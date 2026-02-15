---
title: "Database migrations: When rollback isn't an option"
slug: "database-migrations-when-rollback"
pubDate: 2024-08-16
description: "Sometimes, a change cannot be undone safely. When you don't have the option to revert, redeploy or rollback, how can you handle failed deployment quickly and safely?"
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/f8b95802-589b-4e42-ad53-f5006f1a362c_4871x7952.jpeg"
  alt: "Photo by Daniel Torobekov"
  caption: "Photo by Daniel Torobekov: https://www.pexels.com/photo/airplane-wheel-with-chocks-on-in-airport-5262807/"
---

Last week, I grabbed a few beers with [Ali Tavakoli](https://www.linkedin.com/in/ali-tavakoli-8859089), a friend and former colleague from Yext. Amid updates on our family lives and gratuitous Simpsons quotes, we got onto the subject of CI/CD, and in particular, rolling back changes, as I discussed in my [last article](https://thefridaydeploy.substack.com/p/undoing-bad-changes-revert-redeploy).

Ali made the point that you can’t always just restore a previous version. There are a number of classes of changes that cannot be undone once they have been applied. There are a few classes of change that have this issue, including database migrations, vertical scaling of storage or compute and even some classes of Terraform operation. We’re going to look specifically at the example of database migrations.

# Handling Database Migrations

Database schema migrations are often managed through a series of sequential SQL operations that are essentially one-way.

Let’s look at a set of example migrations for a simple users table. Let’s say you’re using a tool that takes a set of numbered SQL files and manages migration state in a dedicated table - simple, to the point and no ORM needed. The first migration creates the table.

**users0001.sql**

```
CREATE TABLE users (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

Then we decide we need to record the last time each user logged in, and add a column for this:

**users0002.sql**

```
ALTER TABLE users
ADD COLUMN last_login TIMESTAMP WITH TIME ZONE;
```

Let’s say an engineer takes a look at the existing schema and doesn’t like using numeric ids - because security. They think you should be using UUIDs instead, and seeing the problem as urgent, they start working on the change right away. This involves changing the integer key to text.

**users0003.sql**

```
ALTER TABLE users
ALTER COLUMN id TYPE text USING id::text;
```

This change is bundled in a PR with code changes to write UUIDs to the database, and is deployed through to production without much issue. After a couple of hours you start getting angry support messages. The log in page isn’t working! Users who have existing sessions are fine, but when you start a new session, pre-existing numeric ids result in an error. Your tests didn’t catch it, because they involved creating new users for every test.

Applying your incident response skills, you reach for the revert button. The UUID change is undone, and everything is redeployed to production. This only makes things worse, your entire site is down! The migration process, seeing that the database was “ahead” of the migration code and left everything as-is, with the id column as text. But all your application code was expecting an integer, so failed on every read from the users table.

Seeing no other option, a heroic DBA manually reverts the change in the production database, and even generates valid sequential ids for the new users created with UUIDs. This takes several hours, during which none of your users can use your application, resulting in a serious loss in revenue and a few very awkward renewal conversations.

How could we have avoided this situation? Here are a few possible approaches.

## Include Revert Code with Schema Changes

Some migration tools, like [gormigrate](https://github.com/go-gormigrate/gormigrate) or [Atlas](https://atlasgo.io/blog/2024/04/01/migrate-down#how-do-teams-work-around-this) support reverting migrations either through requiring you to provide a reverse operation for each migration, or through automatic mechanisms.

For the example above, our revert operation would be:

```
ALTER TABLE users
ALTER COLUMN id TYPE bigint USING id::bigint;
```

This could run into problems of its own, and if you already had a few users with UUIDs, the rollback would likely fail because they couldn’t be converted. This brings us to our next strategy.

## Backwards compatible changes

As you make changes to your schema, it’ll make your life significantly easier if the changes are backwards compatible. Specifically, you want your old, existing code to work with the new schema.  
  
There are a few simple rules you can apply to help here. I’m not at expertiest-of-experts level when it comes to databases, so I’ll focus on one. _Do not delete, rename or change the type of a column that is in use_.

For our example, we could have created a secondary id column for our UUIDs.

```
ALTER TABLE users
ADD COLUMN uuid_id TEXT DEFAULT gen_random_uuid()::text;
```

Adding this extra column would immediately give us access to UUIDs (and even generates them for us), and if we need to revert anything, the old ids are still there for us. We could still get into trouble if we revert this change and have code expecting the column, but in this case the revert itself would be backwards incompatible. By evolving our database in this way, we ensure that we might never need to revert a schema change.

This also allows us to decouple our code changes from our schema changes, enabling our next.

## Make small changes

The smaller the changes you make, the less that can go wrong, and the easier it is to undo them. This holds true for all kinds of changes, not just modifying schema.

In the example above, if the schema migration had been made separately from the code changes required to support it, the engineer would have been _forced_ to make the changes backwards compatible. Even if a problem was encountered after the migration was applied (maybe it makes the table too big?), reverting the migration wouldn’t have had an impact on the code that was already in place.

There will be a time where you may want to delete an unused column, which brings us to our final strategy.

## Set a high water mark

Sometimes, you will need to make a change that you _cannot_ undo. If you’re able to recognize this ahead of time, you can indicate that changes cannot be reverted beyond this point. This could be something you set up in your CI/CD workflows, or just a note to your colleagues: “here be dragons”.

# Conclusion

While having the ability to undo your changes can be a powerful tool in resolving incidents, it will not always be a viable strategy. The best time to handle these problems is _before_ you deploy, making sure that you understand the implications of undoing your change, as well as applying it.  
  
Your colleagues will thank you!  
  
_Do you have other strategies for managing the un-undoable? Got a CI/CD topic you’d like me to cover? Let’s chat in the comments!_

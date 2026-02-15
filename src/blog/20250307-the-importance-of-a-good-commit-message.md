---
title: "The importance of a good commit message"
slug: "the-importance-of-a-good-commit-message"
pubDate: 2025-03-07
description: "Commit messages act as cover letters for our code, and can act as signposts for humans and machines alike."
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/20822c62-a20e-495f-b48a-a6b3c55f3b9e_8000x5333.jpeg"
  alt: "Focused boy writing notes in notepad with pencil at home"
  caption: " Focused boy writing notes in notepad with pencil at home"
---

Commit messages can often be an afterthought. You’ve toiled over your code, making sure it handles every case while being elegant as heck. Surely your code can speak for itself! Why should you need to put much time into a note that nobody’s going to read anyway? Although, they are, and probably in ways you didn’t expect!

A well-crafted commit message serves as an easily-accessible summary of the work you’ve done. It’s the first thing most people will see when viewing your change, regardless of where they see it. In many cases it will be the _only_ part of your work someone will actively read.

I’m going to try not to be too prescriptive about specific style. I’ll offer up some suggestions but in the end, your style will likely evolve over time to better suit your organization. In the rest of this post, I’ll walk through some use cases where you’d encounter commit messages and highlight some information I’ve found particularly useful over the years.

For more specific and sometimes prescriptive advice, I’d recommend cbeams’ excellent article: [How to write a Git commit message](https://cbea.ms/git-commit/).

# Use Cases

## For code review

I’ve probably read more commit messages during the code review process than for any other reason. This is where the “cover letter” analogy really shines through. You’re about to read through a lot of code, and anything that can provide extra context will save you time and mental effort.

The **subject line** is where everything starts. It’s what you see in the notification message that a review is waiting for you. So it needs to be short and to the point.

A good **description of the change** is essential, or more specifically, a summary of the _intent_ of the change. If you know what your colleague’s goal is, you’ll be more likely to recognize if they’re off track or missed something.

Details of **testing performed** can be a good indicator that appropriate care was taken by the author before submitting a review (and a nudge to everyone to actually do some testing up front). But I’ve seen it grow far beyond that. I once worked in an organization that enforced a `TEST=***` line in commit messages. Initially it was just to indicate if tests were conducted manually or automated - with the goal to encourage everyone to do more automated testing. Over time, people started adding a line below with a bit more detail: the command to run the tests, or observations made when running locally. This served as even more signposting about the intent of the change, as well as providing a short set of instructions if a reviewer wanted to run tests themselves, or for someone following up on the change later. Test detail is probably my favorite thing to see in a code review.

## For tracking work

When you’re working with project management software like Jira, you’ll want to be able to easily find the code associated with a ticket. Many integrations allow you to establish this connection by adding a **ticket id** into the commit message.

Not only does this provide links in your product management platform back to individual commits, but if you’re browsing changes in a third party tool that doesn’t support the integration, you can still copy/paste the id.

You may have more sources of work beyond your project management tool, such as a support tracker, or incident management system. In these cases, it’s important to ensure your messages clearly distinguish between them, even if their ids have distinct appearances. A quick and easy way is having the id on a separate line prefixed with the platform, like `jira: ABC-123`.

Once you have all these associations, you might want to create your own tools or dashboards. One pitfall to be aware of is the assumption that the relationship between tickets and commits is 1-1. You might be surprised at the different ways people approach breaking down a problem. I’ve seen many issues broken down into multiple commits, and in some cases, a single commit that - through cleverness or brute force - addresses multiple issues.

## For diagnosing problems

When something goes wrong, it’s probably going to be because something changed. You may find yourself suddenly under pressure to identify a specific change that introduced a problem.

This is when the **completeness** of a commit message is important. There have been times when I’ve said “this change couldn’t possibly have caused this problem, according to the commit message it didn’t touch the affected features”. Of course, then I find out that there was a sneaky fix included in the change but not mentioned in the message.

Even if you use automated practices like [git bisect](https://git-scm.com/docs/git-bisect) to identify the offending change, the message can provide clues about possible side effects of reverting it.

A good rule of thumb: if you can’t cover the full scope of your change in a 50 character summary line, you might want to break your change into smaller pieces.

# Growing the practice

So if you’re in an environment where frazzled engineers leave behind a string of commit messages reading only ‘fixes’, what can you do to improve the situation?

## Set an example

The first step is to make sure your own messages are as good as you can make them. Ensure you have short, concise summary lines, write a description to clearly explain the purpose of your changes and provide key information like how you tested and any breaking changes you may introduce.

Over time, if your approach proves useful, you might be surprised to see others following suit. This could create a snowball effect within the organization, possibly helped along if you drop the occasional article on style in your team Slack.

Of course, this takes time, so for a more top down approach, you may want to lobby your leaders.

## Get buy-in on style

If you’re going to enforce a consistent style for commit messages, you’ll need to get buy-in from leadership, and indeed the engineers who’ll be writing the messages themselves!

You may get some nods if you just say “we should write better commit messages”, after all, who doesn’t want to be “better”? But this is unlikely to spur real action. Write up a proposal including a complete style guide and adoption plan (this might include changes to tooling and a workshop to practice writing good messages). Present it to the team or management. If you’re not in a position to directly change policy, you’ll still have some convincing to do, but you’ll get more traction if you’ve done all that initial leg work (and are prepared to do more).

You may adopt a format like [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), which includes machine readable annotations that can unlock the ability to automatically generate release notes. I have to admit I’m not the biggest fan of that one, partly because you can end up having to remember a long list of change types. But this is where automation can help!

## Automate!

Quality, machine-readable commit messages can unlock a lot of automation after the fact, but there’s a lot of automation that can help with writing good messages in the first place.

The [commit.template](https://git-scm.com/docs/git-config#Documentation/git-config.txt-committemplate) config setting in Git allows you to specify a file containing starter text for all new commit messages. Here’s a great example gist from [lisawolderiksen](https://gist.github.com/lisawolderiksen): [Using Git Commit Message Templates to Write Better Commit Messages](https://gist.github.com/lisawolderiksen/a7b99d94c92c6671181611be1641c733).  
  
You can also use [git hooks](https://git-scm.com/book/ms/v2/Customizing-Git-Git-Hooks) to lint your commit messages, preventing a commit that doesn’t meet the standards from even being created. Here’s an example for Conventional Commits: [https://github.com/conventional-changelog/commitlint](http://github.com/conventional-changelog/commitlint).

# Conclusion

Well written commit messages can improve your developer experience at all points of the software development life cycle. Beyond just providing information, they can unlock numerous kinds of automation and help manage work across large teams and codebases.  
  
Spending a couple of minutes crafting a meaningful, helpful message is time very well spent!

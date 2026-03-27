---
title: "Why merge queues?"
slug: "why-merge-queues"
pubDate: 2026-03-26
description: "You might have heard of merge queues. You might even have used one at work. If so, you might even hate them. But if you've never used them before, how do you decide if your engineering team would benefit from a merge queue?"
author: "Tom Elliott"
image:
  url: "/assets/blog/20260326-why-merge-queues/cover.jpg"
  alt: "Vehicles in the freeway"
  caption: "Photo by Ekaterina Belinskaya: https://www.pexels.com/photo/vehicles-in-the-freeway-4744715/"
---
I've previously written about my preference for [trunk based development](https://telliott.me/posts/note-to-future-self-use-trunk-based/), but no approach is without its challenges. With trunk based development
the biggest challenge is timing.

# What's the problem?

If you have a monorepo and a large team, merging frequently can lead to some unexpected breakages. Maybe two
developers are working on the same package, and change it in ways that are incompatible with each other. If the
diffs don't merge cleanly, it's just a little frustrating. Whoever comes second has to make some changes. But if
the changes do merge, they could break the build or cause tests to fail. Main is no longer working, and this could
slow everyone down. If you have a monolith, or a mono-build, maybe *nobody* can deploy anything until this is fixed.

The problem here is *semantic merge conflicts*, conflicts that can be merged with git, but create issues when combined
together. This may seem like it would be rare, after all, your codebase includes so many features and components, and
there's an infinite space of possible changes, so how likely is a collision.

This is where a smarter person with more free time would do some math. Calculate some probabilities. Prove that collisions get more likely the more frequently you push. They'd use the birthday paradox or something like that. But for now, I'll just say: you'd be surprised.

Regardless, if you absolutely, positively must keep the trunk branch green, merge queues might be for you!

# What is a merge queue?

A merge queue is a mechanism to manage merging of changes into your trunk branch. At its most basic, changes are tested and
merged one-at-a-time, in the order they were enqueued. Before merging, the changes are rebased on the HEAD of the trunk, and
a set of tests are run to verify that everything works. If everything passes, you merge. If anything fails, the change is booted from the queue. Either way you then move on to the next change.

This can be slow, so a slightly more advanced merge queue will *batch* changes. Instead of sitting idle waiting to reach the
front of the queue, changes are batched together and tested as a group.

Let's say we have three changes in the queue, A, B and C (I promise I tried to think of more fun labels). A is at the head of
the queue, with B and C behind it. We rebase A onto the trunk, B onto A and C onto B. So with C as our head, we run all of our tests.

If the tests pass, can merge everything at once and pat ourselves on the back for getting a 3x performance improvement! If they fail, we need to figure out which change caused the problem. Another test run or two is needed. We might test A in isolation, and batch B and C. If A is the problem, we can boot it, if it passes, we merge it.

This can be made a little more efficient by running tests in parallel. In fact, GitHub merge queues will test each subsequent
group in a batch all at once. A, A+B, A+B+C, all running at the same time. A passes? Great, merge it.

# What can go wrong?

If everything always passes, merge queues are great! Batches go through quickly, everyone is happy. But as soon as something
fails, at least one change must be booted, and the whole queue has to be re-tested. If this keeps happening, the queue can
be totally blocked, with nothing able to merge.

Know someone who's using a merge queue? Ask them about *flaky tests*. They'll probably have a horror story or two.

Even if everything always passes, you do still need to wait for tests. If you're automatically running tests during the review
process, this means every change has to wait at least 2x the average duration of your test process. Your tests need to be fast, or you're going to be very limited in how many changes you can merge per day.

# Planning your merge queue

The faster your merge queue, the better. At the end of the day, this means you want to run as few tests as possible, especially in the case of a failure.

When running tests against a change in review, you want to make sure every test runs, regardless of failures. This lets you see the big picture and make your fix comprehensive. In a merge queue, you want the opposite. Fail fast, get it out, move on.

# When do you need a merge queue?

How do you decide if you need a merge queue? It comes down to the impact of those semantic merge conflicts.

If your code is split into many repos, then they could each have their own merge queue with minimal overhead. Merge queues
be a useful protection measure that doesn't really impact the flow of changes.

If you have a monorepo, it needs a little more consideration. If you have a monolithic build, deployment or test suite, then
the impact of a conflict can be huge, so a merge queue would be well worth the effort.

If your monorepo contains a set of loosely coupled microservices, each with their own build, tests and deployment, then semantic conflicts are either less likely, or have less impact. A merge queue would only slow you down in this case. Any conflicts could be fixed in follow up changes by the affected team, and other teams probably wouldn't even notice.

Maybe the biggest indicator that a merge queue would help you, is if not having one is already causing you significant pain.


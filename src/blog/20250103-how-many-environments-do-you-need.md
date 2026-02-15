---
title: "How many environments do you need?"
slug: "how-many-environments-do-you-need"
pubDate: 2025-01-03
description: "You'll hear the term \"environment\" a lot when talking about CI/CD. But this term covers a broad range of use cases. In this post we'll take a look how we can define and scale environments."
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/15e0fa71-e922-466f-9071-74eb3f9dd4e0_4000x6000.jpeg"
  alt: "A terrarium jar with mossy plants"
  caption: "A terrarium jar with mossy plants"
---

Environments are a common concept within CI/CD, and typically refer to a “place” where you can deploy your code. The scope of this place can vary a lot, from a single VPS to a cluster of servers or even multiple datacenters distributed around the world.

While the set of environments an organization may have can vary wildly, there are a few key patterns I’ve seen during my career, and through talking to engineers at various companies.  
  
So let’s start with the one environment that everyone has to have: _production_.

# Day 1: Production

Production is where the “real” version of your application lives. It’s the environment that your normal users interact with and the one that’s going to wake you up at 2am if something goes wrong.

When you’re starting out, you really only need production. You probably have a small team and a small enough application that you can run everything on a laptop to test before deploying. At this point, you might not even have CI/CD, and just deploy everything manually.

This isn’t perfect, of course. Your manual testing won’t catch everything, and you sometimes forget to run all of your automated tests, and running on a laptop can miss quirks of running in your production environment. This leaves you scrambling to undo the occasional bad change that gets out to your users.  
  
But because things are simple, you’re moving quickly, your application is growing and hopefully, so is the team. If all goes well, you’ll quickly outgrow this phase and need somewhere more robust to test, you need more environments!

# Empowering testing: Staging and Dev

When you’re automating acceptance tests, you’ll want your tests to represent production as much as possible. This could mean running your tests against production, maybe with a canary instance for safety, but more often you’ll end up creating a _staging_ environment.

Staging environments (which I’ve also seen called QA) are a place to deploy your changes to help validate them before going to production. Even without automated tests, a staging environment allows you to verify that the changes **can** be deployed, but they really come into their own when you can run a set of tests to give you confidence in the new build before promoting it to somewhere less safe.

For B2C applications, this may be all you need! I’ve spoken to engineers at well-known companies who only have to deal with staging and production. In one case, even doing environment-level blue-green deployments and flipping staging and production as a whole. So technically, they only had two production environments! This isn’t to say that having a minimal set of environments should be a goal. There are plenty of reasons you may need to grow beyond these two.

For example, if your application is large enough, you may not be able to run it on a single developer machine any more. At this point, you might also introduce a _dev_ environment where developers can deploy changes before merging, or in a microservices architecture, provides a backend for running individual services locally.

# Scaling up: Multiple production envs

As you grow, you might find yourself needing multiple production environments. Perhaps you want multiple points-of-presence for redundancy or latency. Maybe you’re pursuing a multi-cloud strategy. If you’re a B2B business with large customers, maybe some of them demand a single-tenant option.

If you have multiple production environments with different properties, you may also need separate staging environments to match. For example, if you have separate production environments for GCP and AWS, you might want to have staging environments for these clouds to ensure that your code works as expected on both platforms.

This also introduces a challenge in terminology. If you have multiple production environments, do you refer to them as environments, or are they all smaller parts of “production”. Because you likely got here organically, it might be jarring to suddenly change what an environment is (not to mention rebuilding your pipelines). I’ve seen this split be treated as sub-environments of production, using terms like “sites” to refer to a distinct part of the wider production environment.

# Developer experience: Ephemeral Environments

As your team grows more, you might also encounter issues with contention in your staging or dev environments. Many developers pushing iterative changes to dev could lead to it becoming unstable, or you may need to “lock down” your staging environment for regular load tests.

You can’t afford to give every developer a complete production environment, and it seems excessive to have a whole environment running 24/7 for a load test you only run occasionally. So you want environments that only exist for a short period of time, you want _ephemeral environments_.

Being able to create and destroy environments on a whim can be a very powerful tool. You can create a working preview of a change for a code review and tear it down when the change is merged, or set up an exact copy of production to practice a risky migration.

Managing ephemeral environments can be quite a lift for an existing application, though. You need to be able to create and destroy all your infrastructure automatically, and be able to react to events that should trigger these changes. Getting it wrong can be costly (imagine all these environments burning through your cloud spend), but the rewards in terms of developer experience can be huge.

# Conclusion

The exact set (and terminology) for environments in an organization can vary a lot, but will usually come down to variations on the themes I laid out in this post.

I’ve seen that many of the challenges in managing environments come when you’re introducing a new concept and/or a set of environments. This is part of the reason that I’m making environments a first-class concept in [Ocuroot](https://www.ocuroot.com/), so you can easily adapt to changing architectures and still keep a handle on everything.

Do these categories of environment resonate with you? Do you have some environments that don’t fit into these groups? I’d love to hear about your environment set in the comments!

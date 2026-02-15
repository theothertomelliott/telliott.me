---
title: "CI/CD pipelines: when to ask human permission"
slug: "cicd-pipelines-when-to-ask-human"
pubDate: 2025-02-21
description: "A lot of focus is placed on automation of CI/CD pipelines, but sometimes a human just has to be in the loop. Let's look at the why and the how."
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/dcb33b2d-099e-4491-9170-3d9c7ca987d0_6000x4000.jpeg"
  alt: "A woman signing for a package"
  caption: "A woman signing for a package"
---

When people talk about CI/CD (particularly CD), they’re probably talking a lot about automation. If your D is “deployment” your goal is probably to go from commit to production deploy without any human intervention at all.

There are times when automation doesn’t quite cut it, and you need that human touch. This could involve providing information to the next step of a pipeline, choosing the right action to take, or just providing your approval to continue.

I’ve heard this referred to by a few different terms, such as manual promotion, manual approval or manual advancement.

But when should you include a manual step in your pipelines? Adding a human to any automated process will inevitably slow it down. Not just because of the time taken to do the task, but also waiting for the human to have the time to do it! So this is a decision you shouldn’t take lightly.

Once you’ve made the decision to include a manual step, how can you implement it? What tools and techniques are available to you?  
  
I’ll cover both of these questions in this post as best I can, based on my experience debating them at length on various engineering teams. Plus a bit of skimming through documentation.

# Why promote manually?

## A placeholder for later automation

Automating a process takes time and mental effort, and when you’re getting set up, that time may be better spent on improving your product. So for the sake of having _something_ working, you may want to start by doing a few steps in your CI/CD pipelines manually - your own [Mechanical Turk](https://en.wikipedia.org/wiki/Mechanical_Turk).

This could be a manual testing of your web UI, or even manually configuring a server. I recently employed this approach because my DNS provider didn’t offer an API unless I was on a more expensive plan. Changes to DNS were pretty rare, so it made sense to do it by hand when it was needed.

The trick is making sure you actually get around to implementing the automation at some point. If you’re not careful, a temporary workaround can easily become the status quo. Eventually, the total time and mental effort dedicated to the manual steps will outweigh the effort required to automate it away.

## Limitations of testing automation

Sometimes automation is hard, and sometimes it’s prohibitively hard or even impossible.

You may be interacting with a third party API that quickly blocks your automated tests as bot interactions. Perhaps you’re writing software for physical machinery, and a human needs to prep a test area.

There is a sliding scale of difficulty in automating tests so you need to be careful about where your line is. Sometimes there are easy ways to juggle your pipelines to get around the problems.  
  
Let’s take LLMs as an example. If your tests involve a bunch of calls to an LLM, you could find yourself racking up a decent bill for every run of the test suite. You might not be comfortable with running these tests for every commit.

This could be handled by requiring a human to approve the tests, but you could also explore options to throttle test runs. If you have hundreds of daily commits, test up to one commit an hour, and if there’s a failure, use a git bisect to find the culprit.

## Controlling release schedule

As I mentioned in my [last post](https://open.substack.com/pub/thefridaydeploy/p/how-you-yes-you-can-deploy-to-production?r=36rml&utm_campaign=post&utm_medium=web&showWelcomeOnShare=false), if you’re providing software that your customers run themselves (be it on desktops or in datacenters) you probably don’t want to inundate them with new builds. This control may also be imposed upon you by a customer or regulatory body - requiring approval of a changelog before you can distribute a new version.

Marketing probably wants to have a say in the timing of your releases, so they can accompany them with notes, blog posts or even big events. The support team will also need to be sure they’re ready to handle questions about new features, or provide help with bugs. Legal might also want to review the release notes.  
  
Suddenly, a simple approval becomes a 20-person go/no go meeting, or a series of separate approval steps. If this is your reason for including manual steps, you need to make sure that it doesn’t snowball into a ton of busy work. At the very least, make sure you record who signed off!

# How to implement manual promotions

## Outside the pipeline

If your manual step is the last one in your pipeline, you could reasonably just move it outside the pipeline entirely. Create a Jira ticket if needed and hand over entirely from CI to the humans.

This is a simple solution to implement, but can create a disconnect between the CI pipeline and the final release. That disconnect could make it difficult to identify which builds were sent out to customers.

## CI/CD Platform Tools

Your CI/CD platform likely has some kind of mechanism for managing manual progression.

BuildKite has two elegant patterns, [block](https://buildkite.com/docs/pipelines/configure/step-types/block-step) and [input](https://buildkite.com/docs/pipelines/configure/step-types/input-step) steps that will pause a pipeline to wait for human input. GitLab has [deployment approvals](https://docs.gitlab.com/ci/environments/deployment_approvals/). GitHub Actions have the [workflow\_dispatch](https://docs.github.com/en/actions/managing-workflow-runs-and-deployments/managing-workflow-runs/manually-running-a-workflow) event, which allows manual triggering of a workflow, but does require you to split your pipeline between multiple workflows.

## GitOps

If you practice GitOps, you can control your final state through manual commits to a repo. Update a build version id in a file, with any approvals controlled through your code review process.

# What did I miss?

This is all based mostly on my own experience and a few conversations I’ve had. Perhaps you’ve found your own reasons for requiring a manual step, or invented a clever way to build them into your pipeline. If so, drop a comment, I’d love to hear more!

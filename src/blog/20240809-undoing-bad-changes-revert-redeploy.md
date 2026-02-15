---
title: "Undoing bad changes: Revert, Redeploy, Rollback"
slug: "undoing-bad-changes-revert-redeploy"
pubDate: 2024-08-09
description: "Bad deploys happen, and when they do, you'll be scrambling for the \"undo\" button. Let's look at a few strategies to get you back in a good state."
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/1a5a425f-6c94-4aac-9c77-7c5a4dbe5012_4896x2760.jpeg"
  alt: "Photo by Matthias Zomer"
  caption: "Photo by Matthias Zomer: https://www.pexels.com/photo/lighted-running-signage-845265/"
---

It’s 5pm on a Friday and the pager goes off. Your app’s UI is down! In this kind of situation, your first priority will be to get things into a good state as quickly as possible, to “stem the bleeding”. This will buy you time to work on a more robust solution.  
  
You investigate a little and find that your telemetry points to a recent deploy of a frontend service as the culprit. You want to get an older, working version back into production fast. How do you make it happen? You might turn to one of three strategies: Revert, Redeploy, or Rollback.

# Strategies

## _Revert_ the commit

If you know which commit (or even better, which lines of code) caused the problem, the first port of call might be to revert the commit in Git and deploy a brand new build.

Assuming you use version control, this strategy is pretty much always an option, regardless of how your deployment pipelines are structured, and it has the advantage of ensuring subsequent changes don’t include the bug.

On the downside, reverting can end up being slow if you have a robust testing pipeline. You may have mechanisms to bypass tests (or even deploy directly from your laptop), but since this is a brand new build, there may be some changes between the “bad” one and your revert, which introduce risks of their own.

## _Redeploy_ the previous version

Most CI solutions allow you to re-run specific pipelines or build steps. This means that you can redeploy a previous build that may already exist in an artifact store or Docker registry.

If you’re not sure exactly which commit introduced the bug, but know that a previous build didn’t have it, this is a great way to get back into a known good state. You also avoid any side effects from other, unrelated changes that may have happened in your repository subsequent to the bug going out.

Of course, for this to be better than a revert, you need to be able to redeploy a known good version quickly, without rebuilding and retesting. This requires a certain level of flexibility in your CI tooling.

Once you’ve redeployed, you will need some means of making sure that the bug isn’t deployed again. I’ve seen this implemented as an automated “freeze” which fails deployments while in effect and has to be removed once the fix is out.

## _Rollback_ through orchestration

Depending on where you run your applications, you may be able to restore a known good version of your service by rolling back in your orchestration layer. Both [Kubernetes](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_rollout/kubectl_rollout_undo/) and [Nomad](https://developer.hashicorp.com/nomad/docs/commands/job/revert) have this functionality built in, in the latter case, it’s called a “revert”.

Rolling back in this way can be faster than the other two strategies and doesn’t require you to locate a specific commit, or click through your CI platform to find the right build.

Similarly to redeploying, you would also need a freeze mechanism to prevent bad changes being redeployed.

Rollbacks are, by their nature separated from your deployment processes, so the state of your pipelines will immediately not be representative of the state in production. If you have multiple platforms in play - such as combining Kubernetes, serverless and Terraform - you would end up with multiple rollback processes depending on what component was broken.

## Combining Strategies

All three of these strategies have their own benefits and drawbacks, so you may want to combine them for a better overall solution. For example, you could write a script that kicks off a rollback and a revert at the same time, so you get into a good state as quickly as possible, and remove the bug from subsequent deploys to avoid freezing.

# Pitfalls

## The Tyranny of Choice

Because you get two of these strategies “for free”, developers will effectively have to choose one of these options every time they need to undo a bad change. I’ve seen this create a lot of confusion and frustration, with developers complaining about slow rollbacks because they only considered the revert option. This underscores a need to document your emergency procedures well and drill your teams on using them. In the heat of an incident, it’s unlikely everyone will be thinking clearly, in an ideal scenario, a member of your team should be able to execute a rollback more or less instinctively.

## Testing the Process

As mentioned, if redeploying or rolling back, you’ll need some kind of “freezing” mechanism to prevent bad changes going out again. This process **must** be tested so you know you can rely on it in an emergency. Nothing could be worse than bringing everything down twice because the process didn’t work as expected.

This applies to any emergency procedure - the less frequently you do something, the more important it is to make sure it works when you do need it. One approach I’ve seen work well is having a “tracer” build, a simple application that is taken through the motions of all your processes on a regular basis so you can catch breakages as they happen. This can happen manually (mark your calendar!), or, even better, automatically.

# Conclusion

The ability to quickly revert, redeploy, or rollback changes in an emergency is crucial for maintaining the reliability and availability of your web application. Each strategy offers unique advantages and potential drawbacks. Ensuring your team is familiar with your preferred procedures and regularly testing them can help make incidents run more smoothly and quickly.

Have you encountered other effective strategies for dealing with bad deploys and getting into a good state? Share your experiences and thoughts in the comments below!

---
title: "Pipelines: The Forgotten SLO"
slug: "pipelines-the-forgotten-slo"
pubDate: 2026-04-26
description: "When talking about SLOs, uptime and latency get all the attention. But there are many other kinds of SLI that we don't pay enough attention to."
author: "Tom Elliott"
image:
  url: "/assets/blog/20260426-pipelines-the-forgotten-slo/cover.jpg"
  alt: "Person Checking Test Papers"
  caption: "Photo by Andy Barbour from Pexels: https://www.pexels.com/photo/person-checking-test-papers-6684372/"
---
Eventually, every discussion of reliability will come down to SLIs and SLOs. They've become something of a standard for
measuring performance and setting goals. I've often seen these discussions being limited to availability and latency for web
requests, but there's so much more to the subject!

Let's look at another category of SLI defined in the [Google SRE book](https://sre.google/workbook/implementing-slos/#slis-for-different-types-of-services): pipelines.

Pipelines are all about getting data from one place to another, and possibly modifying
them along the way. Maybe you're ingesting access logs and storing them in structured database rows, or fanning out content updates to many points of presence.

When working with pipelines, you may be interested in measuring freshness (how long it
takes to get the data to its destination) or correctness (how many records are lost or corrupted).

I'm going to focus on correctness for the rest of this post, since it has some
really interesting implications.

# What brought this to mind

On Thursday, I had to spend my evening cleaning up after a particularly nasty GitHub
incident.

<blockquote class="twitter-tweet" data-width="550">
  <a href="https://twitter.com/theotherelliott/status/2047467609486954623"></a>
</blockquote>

GitHub's merge queue was misapplying some commits into our main branch, reverting
all the changes merged since the PR's branch was created. In one case, this eliminated
about 20 hours worth of work! The only way to be sure we were in a good shape was to
manually audit our commits during the incident and create new PRs to recover missing
changes. While GitHub did provide us with a list of impacted changes the following
morning, this was long after we'd done the restoration work.

This was a huge failure in pipeline correctness, and generated enough chatter on
social media that GitHub's COO responded with some numbers.

<blockquote class="twitter-tweet" data-width="550">
  <a href="https://twitter.com/kdaigle/status/2047803291988590609"></a>
</blockquote>

The quoted percentage stuck out to me: 0.07% of commits were mis-applied. This means
a 99.93% success rate. This would be just about OK for uptime, but how does it stack
up for a correctness SLI?

# Why they're different

Request driven SLIs like availability and latency are highly visible and reasonably
easy to measure. Customers will be quick to report if your website is "down", and
almost as quick if it's "slow". Getting metrics is also reasonably straightforward.

Pipelines, on the other hand are a little more mysterious. There can be a lot going
on behind the scenes that is invisible to the user, and sometimes even to the developers! If you have a high volume of data, the odds that someone will notice one
or two incorrect outputs is pretty low. Worse, how do you even define correct?

In the case of the GitHub issue, I only noticed because I was prompted to approve a
deployment that my PR shouldn't have touched, and the commit touched 90+ files instead
of one. A single-line error would have been much harder to notice, even with the detailed records of each step that you get naturally with Git.

Not only is it harder to measure or notice issues in pipelines, but the impact of
a failure can be much greater. If a web endpoint responds slowly, you can wait. If it
returns a 500, you can (usually) try again. But if the wrong data is stored, it can
have cascading downstream effects. Imagine how many of those 2000+ bad merges might have undone a critical fix!

# What's a good target?

What would make a good target for pipeline correctness? A [worked example](https://sre.google/workbook/slo-document/) from the SRE book suggests a target of 99.99999% (7 nines). This is coupled with other SLOs that require no more than 99% success rates. In line with the greater impact I mentioned above, correctness needs a high bar!

For another comparison, durability targets can have an even higher bar, with Amazon's S3 [advertising](https://aws.amazon.com/s3/) 99.999999999% (11 nines) data durability, but "only" 99.99% for availability. Data loss is a big deal!

This also gives another reason why we don't tend to talk about correctness and durability SLOs when discussing reliability. They're so reliable that we rarely hear
about failures, and probably take these things for granted. Plus, any failure is so severe that we're subconsciously targeting 100%.

# How can you start measuring your pipelines?

Regardless of the target, you won't know something's wrong unless you measure it. So how do you go about getting a measure of correctness?

Direct measurement of your production traffic is likely not going to be feasible, either because the data is too unstructured, or because there's just too much data to
validate in a cost-effective way.

A more practical approach is to use synthetics. I've previously written about [using
synthetics to measure freshness](https://telliott.me/posts/measuring-freshness-with-synthetics/), and correctness can be measured in a similar way. Regularly send tracer data through your pipeline and validate that the output matches your expectations. Send a few different payloads to exercise different code paths, and you'll have a pretty decent indication of whether your pipeline is doing what it's supposed to.

Synthetics also give you some bonus benefits, you can use them in testing as well! Run
them for a while in pre-production or as an integration test to catch failures even
before they get close to a customer!

# Conclusion

When setting up your SLOs, don't stop at your synchronous requests! Look at the
asynchronous work your system does, and how you can measure its success. Set aggressive
goals and test as early as possible to catch issues before they hit your customers in
unexpected and disastrous ways.

<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
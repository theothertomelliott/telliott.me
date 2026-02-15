---
title: "Why I'm not using feature flags...yet"
slug: "why-im-not-using-feature-flagsyet"
pubDate: 2025-01-31
description: "Feature flags give you a lot of flexibility in how you roll out new features and changes, but they come with a certain amount of responsibility. So adoption must come with careful consideration."
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/e250a90a-bcd2-457b-a4b7-a2a71175175d_8192x5466.jpeg"
  alt: "A control panel with many toggles to flip"
  caption: "A control panel with many toggles to flip"
---

Feature flagging (sometimes called feature toggles) is a technique for configuring the behavior of your product without having to change the underlying code. They’ve become a popular way of controlling rollout of changes.

But I’m not using feature flags in my work on [Ocuroot](https://www.ocuroot.com/) as of yet. In this post, I’ll look into the benefits and drawbacks of feature flags, and how I’ll know when it’s the right time to implement them.

# What are feature flags?

Feature flags at their core take the form of an on/off switch for a feature that can be evaluated during a request.  
  
Typically, you’ll go down a branch based on whether a flag is on or off, so if you’re introducing a new-look UI for your app, you might wrap a request in something like:

```
if featureEnabled("newUI") {
  return renderNewUI()
} else {
  return renderOldUI()
}
```

By setting the `newUI` flag based on user, account, or even time, you can give yourself very fine-grained control over who sees which features. The biggest benefit to the developer is that you can “hide” new features while you work on them, and ship frequently without having to rely on long-lived branches.

In my last job, feature flags contributed greatly to our ability to ship to production over 200 times a day. A big point of pride for our engineering org!

This isn’t to mention the benefits to product management, sales and marketing. Being able to enable and disable features at will can help keep sensitive customers happy, and enables techniques like A/B testing for new additions.  
  
But I’m not using feature flags in my own work quite yet, for a number of reasons, some obvious, some not so obvious.

# Obvious: One developer, few users

We’ll start with the blatant reason that would seal the deal on its own. I’m the only one building Ocuroot, and there are currently around 10 alpha users.

This means there’s no real coordination I need to with anyone when building out features, and I actively want my users to see the UI improvements as I go - especially if they asked for them directly.

With such a small number of users, I also won’t get a whole lot of information from an A/B test. If I need to compare two different options, I’m more likely to just show both of them to a few users and ask what they think directly.

# Complexity

A few if statements here and there don’t seem too bad, but once you have even a handful of feature flags in place it can make your code significantly more complex.

This can slow future implementation work by making it harder to read your code later - and even when reading code I wrote myself, it can take some interpreting a few months down the line.

The proliferation of flags can also generate a lot of perceived tech debt in flags that are no longer used and their associated code branches. This can create a push to proactively retire older flags, sometimes causing additional problems as you attempt to unwind the code.

I my experience, though, the biggest impact of this complexity will be in testing, both manual and automated. Not only are there a broader range of automated tests to write to account for various combinations of flags, but setting up an account to manually test a change can become a gauntlet of tracking down just the right settings to get that extra page in the UI to appear.

The good folks at PostHog recently published an article on this kind of complexity and how you can better manage it: [Don’t make these feature flag mistakes](https://newsletter.posthog.com/p/dont-make-these-classic-feature-flag).

# API and SDKs are versioned

A significant portions of user interactions with Ocuroot will be via the SDK or API. In both cases, I made sure to have a rough versioning scheme in place immediately to help me control backwards compatibility. For example, the [SDK](https://github.com/ocuroot/sdk/tree/main/v0) started with v0 and I’m currently working on v0.1 which introduces some broad changes to package definitions.  
  
In many ways users are likely to be _more_ sensitive to API/SDK changes than UI changes, with any breaking change introducing an unpredictable amount of work to get their code working again. Whereas a human can just figure out where the buttons moved.

I’ve seen chaos ensue when an API contract changed under a customer’s feet - even what you see as bugs can end up being a critical behavior to someone. This means that the ease of change you get from feature flags can be flat-out undesirable for APIs/SDKs.

# Flags are easy to add later

When it comes time to introduce feature flags, it shouldn’t be too difficult. This isn’t like switching to a new database backend or threading contexts through all your code to get traces working. The first feature flag will require a few if statements and I can go from there.  
  
There was a time when you’d also need to spend time on building out your own backend, but there’s now a huge choice of providers to handle that part for you. There’s the incumbent - LaunchDarkly, providers with feature flags as an add-on, like PostHog, and a bunch of open-source options, including Flagsmith, Unleashed and Flipt. Among all of these you’ve got a really good chance of finding a solution that matches your needs really well.

# When will I start?

Given all of the above, the tipping point for introducing feature flags is going to come from a combination of:

-   Customer demand
    
-   Team growth
    
-   UI restructuring
    

Of these, customer demand is likely to be the slowest to emerge. Not that I’m not expecting customers! But in my experience, requests to limit UI changes tend to come from larger organizations (more often in banking) with many internal users and comprehensive training materials. Attracting such customers and meeting their requirements can take quite some time.

Team growth is where I _hope_ the problem emerges first, and as and when I onboard more developers I’ll be watching for bottlenecks in the release process carefully. As soon as we even see a hint that a feature branch is needed, we’ll start talking flags.

UI restructuring has a decent chance of being the first to crop up. Ocuroot already has a growing web UI, and also a CLI tool with a lot of commands. The CLI in particular is fast reaching a point where I’ll want to clean up a bit.

My expectation is that changes to the CLI will be more disruptive than the web UI, possibly even getting close to the level of sensitivity of an API or SDK. CLIs have a habit of being called in scripts, and wrapped in aliases. Not only that, but having led a few migrations over the years, I’ve seen that muscle memory carries much more momentum at the command line than in a GUI. Version control for CLI downloads could help here, but will require a little more management on the part of the end user than locking API versions in a script.

# A measured decision

Regardless of what finally causes me to cross over, I believe it’s a case of when I adopt feature flags, not if. When that time does come, I’ll need to carefully consider the drawbacks and come up with my own set of internal guidelines to get the most benefit, while incurring the minimum of additional complexity and tech debt.

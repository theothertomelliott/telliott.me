---
title: "Why you shouldn't call your Platform Engineers the \"Platform Team\""
slug: "why-you-shouldnt-call-your-platform"
pubDate: 2024-09-27
description: "All engineers know that naming is hard, and naming your team can have more impact than you think. Especially when your customers are your colleagues."
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/e0c27676-0ee0-4a89-8fb3-d2ef7b67b478_6016x4000.jpeg"
  alt: "Photo by Miguel Á. Padriñán"
  caption: "Photo by Miguel Á. Padriñán: https://www.pexels.com/photo/white-product-label-1111319/"
---

So here you are, you’ve read the literature on [Platform Engineering](https://en.wikipedia.org/wiki/Platform_engineering), felt inspired and started to get excited about the possibilities of building a world-class IDP for your engineering org. You’re ready to start staffing up with high-quality Platform Engineers and begin building - the Platform Team.

Careful! This might seem like the obvious choice, but you could be setting yourself up for a lot of extra work. Specifically answering questions like “which Platform do you engineer?” and “how can I get help with tool X?”.

Despite the growing popularity of Platform Engineering as a practice, the odds are that your end-users - developers on other teams - either haven’t heard of it, don’t know quite what it means, or even have a totally different definition in their head than yours. When you name your team, you’re presenting an identity to the rest of your organization, and when your role includes supporting your colleagues, it needs to be clear to them what they can expect from you and when they should come to you for help.  
  
I got this wrong in a very visible and somewhat embarrassing way. It’s hard to admit, but I once led a team who changed their name almost **annually**.

# My struggles with naming

In 2019 I was a product-facing engineering manager at [Yext](https://www.yext.com/), and during a re-org I was given the opportunity to head up a new group of three teams dedicated to tooling. Naming the group was one of the first important decisions - or at least the one that seemed the least impactful if we got wrong (so much for that theory).

There was something of a tradition in Yext Engineering to give individual teams “fun” names, but with the new “group” layer, we wanted to be a little more descriptive and serious.

We considered calling ourselves “DevOps” - but after a lengthy debate, decided against it, based on an argument that DevOps is a practice rather than a business function (“a state of mind, man”) and might send the wrong message. We also considered “The Tools Group”, but it seemed a bit dry and generic - in hindsight, that choice could have saved us a lot of hassle.

We settled on the name “Production Engineering”, a term I believe was borrowed from Facebook, but we’d used before to talk about all the bits and pieces that go into getting things into production and operating them once they were there.

This wasn’t without it’s drawbacks, though. It became very confusing when they started calling the department as a whole “Product Engineering”. By this time, we’d been using the abbreviation “ProdEng”, which made it even worse.

A year or two later, and we hit a crossroads. We’d downscaled our teams a little after the post-COVID “great resignation” and had to re-focus our efforts. A big part of our remit was managing the incident response process, and we saw this as an important place to hang our hats. So we became the “SRE” group - framing all our work as being key to maintaining reliable systems.

Shortly after this rebrand, we started upping our support game and created a dedicated, staffed help channel: #help-sre. This worked fine as a distinct channel when someone knew what we were responsible for “I need help from the SRE group”. But fell apart when we changed name yet again.

We started to grow as a group again, and brought on a couple of teams whose remit didn’t really fit under the SRE brand. So we bounced around a few options and eventually settled on “Engineering Productivity”. Thankfully we were saved from the mistake of rebranding as the “Platform Group”, since the word “Platform” was already being applied to the core of our main product!

When the time to announce this rebrand, it had become something of a running joke, and the “new name” slide was met with more than a few giggles. Suffice to say, we didn’t rename the Slack channel.

# Why it matters

You might wonder why this was a problem. Sure, it was a little embarrassing, but the name doesn’t matter too much, right? Well, aside from the confusion of still having the #help-sre channel long after changing our name, choosing our names in the way we did ended up affecting how we thought about our mission.

We made a key mistake of chasing trends. We tried to align ourselves with practices that we saw as aspirational, but without realizing it, restricted our thinking to those practices. A very subtle form of cargo culting.

We also opened ourselves up to criticism and self-doubt about whether we were “doing DevOps/SRE/etc right” rather than focusing on whether our approach was providing the value we needed.

Over time, we found that what we were doing day-to-day often had elements of DevOps, SRE, Platform Engineering and many other practices besides at the same time. It was a buffet, not a-la-carte.

# Build your brand

One tenet of Platform Engineering does present a good alternative. Your IDP is a product, which means you can give it a brand. Your users will be interacting with your Platform through a subdomain, maybe a CLI tool. So you can choose a distinct, but not necessarily descriptive name and build an identity based on the services you provide, not where you got the idea.

Let’s say you name your platform “Demeter” - Greek Gods were popular fodder at Yext for fun team names.

When an engineer onboards into the company, one of the first things they will have to learn how to do is how to interact with Demeter. Maybe they install the \`demeter\` tool, which provides handy shortcuts for running tests and committing code reviews, or visit _demeter.yourcompany.com_ to explore their team’s services and create new ones.

You don’t even need to be building everything from the ground up. Some Platform-focused tools like [Backstage](https://backstage.io/) give you a lot of control over the look, feel and even the name of your UI.

If you establish a consistent brand, your users will naturally associate your chosen name with everything your Platform Engineers are responsible for, so when they need help, they will find your team wherever you are at.

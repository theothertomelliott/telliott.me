---
title: "When incident heroics are too heroic: the \"bigger problems\" limit"
slug: "when-incident-heroics-are-too-heroic"
pubDate: 2025-04-25
description: "After dealing with a late-night outage with surprisingly small impact, I got thinking about how you would know if you were working too hard to guarantee uptime."
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/221d26d2-ec31-4a6f-aa22-731ba27d788c_6000x4000.jpeg"
  alt: "Photo by Connor Danylenko"
  caption: "Photo by Connor Danylenko: https://www.pexels.com/photo/person-with-black-mask-holding-a-burning-news-paper-2538122/"
---

Last Wednesday evening, [Ocuroot](https://www.ocuroot.com/) experienced it’s first outage. I got an alert around 9pm for a timeout app.ocuroot.com. Luckily, I happened to be near my desk anyway, so I dug in.

As it turned out, both the staging and production instances were down, which suggested something happening at my hosting provider. I narrowed this down to the loadbalancers. Not only were the existing ones not working, but I couldn’t create new ones.

There wasn’t much I could do here, so I kicked off a support ticket and started considering alternatives. Since the databases were still available, one option would be to stand up a copy of the production app elsewhere (it’s a single binary so could even be serverless). I could have also bypassed the loadbalancers by port forwarding or tunneling to another service. But I didn’t take these options.

At this point, I had around 15 users, all based in the US, and none of them using Ocuroot for production workloads as of yet. The odds of someone even trying to use the app during this outage was pretty low, so it didn’t make sense to put time, effort and money into a workaround.

I sat back and waited for a response from my provider, and the issue was resolved over the course of the next hour or two. This got me thinking about the level of effort that goes into resolving (or preventing) outages, and when “fix it at all costs” costs too much.

# Late night heroics and unforced errors

Efforts in the SRE space are often aimed at minimizing downtime, with SLOs (or more scarily, formalized SLAs) described in numbers of “nines” leaving [vanishingly small](https://en.wikipedia.org/wiki/High_availability#Percentage_calculation) margins of error. Stories of late-night heroics to resolve outages are passed around almost every company - and somehow things only go wrong at 2am. Once you get past three nines, even human reaction time becomes too slow, so it’s all about planning ahead for redundancy. But not all outages are created equally, and some are more forgivable than others.

There are of course, “unforced errors” where a change you make to your code breaks something critical and you’re on the hook for fixing it. But in my experience, the most frustrating late-night outages are more often caused by something going wrong at an upstream provider. Like last week, there might be an outage in your hosting provider. Your DNS nameserver could start sending out the wrong data. On the extreme side, a natural disaster could take out power to multiple datacenters at once.

Which of those should you really invest in mitigating? This is really going to be different for every organization. A bank is going to have much higher expectations placed on it than a quote-of-the-day app and will invest accordingly.

An organization could calculate their tolerance based on the cost of an outage versus the cost to prevent it. If it costs $1m a year to add redundancies that prevent outages that would only cause losses of $100,000, it probably doesn’t make sense to have those redundancies.

There are two problems with this approach. Firstly, it’s math and who likes math? Secondly, it doesn’t necessarily account for damage to your company’s reputation that might come with a big, public outage.

There’s a rule of thumb that could be a little easier to apply. Are you (or more importantly your users) experiencing a “bigger problem” than just your outage?

# “We’ve got bigger problems”

In 2022, [Cloudflare](https://www.theverge.com/2022/6/21/23176519/cloudflare-outage-june-2022-discord-shopify-fitbit-peleton) experienced an outage that took out a number of popular sites. The product I was working on was no exception. We went into “incident mode”, published status page updates and bypassed Cloudflare wherever we could. But once the dust had settled, the general response from our customers was that they were worrying about other, more critical apps that were down. Some were so distracted that they didn’t even notice we were down. They had bigger problems.

If you’ve been building high-availability apps on a hyperscaler, you’re probably aware of _availability zones_. These are distinct locations within a single region that are separated to a degree that minimizes the impact of failures. They will be physically in separate buildings, possibly even in different cities, using separate utilities. If a disaster takes out multiple availability zones in a single region, that region definitely has bigger problems.

Looking to the physical world, Waffle House is famous (some would call it infamous) for staying open throughout natural disasters, but even they have their limits. It may be rare, but Waffle House _will_ close if things are bad enough. Once it reaches that point, nobody will judge them for closing. By that point it’s a _very_ big problem.

In the case of my outage last week, the “bigger problem” for my users was simply enjoying their evening. As soon as I’d notified my provider of the problem, the best use of my time was to get some rest so I could focus on improving the product and building the user base.

# Raising the bar

This isn’t to say that you should become complacent. I posted about the outage in the Slack channel for my alpha users, and if anyone was impacted, I would have jumped to find a solution and provide them with a good experience. I’ve also spent a lot of time thinking about how I’ll need to protect against this kind of problem in the future.

There’s still plenty of room for heroics and clever mitigations for potential issues. As a counterpoint, you can gain some reputation points if you’re able to keep your services up when everyone else’s are down. But you need to know that your users will both notice these efforts, and benefit from them.

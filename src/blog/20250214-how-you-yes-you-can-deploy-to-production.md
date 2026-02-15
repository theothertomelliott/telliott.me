---
title: "How you, yes you, can deploy to production hundreds of times a day"
slug: "how-you-yes-you-can-deploy-to-production"
pubDate: 2025-02-14
description: "A slightly flippant look at the art of high deployment frequency."
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/1b3a7204-d54d-4c25-a086-5293c75b2abe_5129x3401.jpeg"
  alt: "A row of trucks in a parking lot"
  caption: "A row of trucks in a parking lot"
---

High deployment frequency has become something of a badge of honor for tech companies. Companies like [Monzo](https://monzo.com/blog/2022/05/16/how-we-deploy-to-production-over-100-times-a-day), [HubSpot](https://product.hubspot.com/blog/how-we-deploy-300-times-a-day) and even [IBM](https://launchdarkly.com/case-studies/ibm/) have bragged about their heroic path towards hundreds of daily deploys. Deployment frequency is even enshrined in the DORA Metrics as an indicator of a high-performing DevOps team.

It’s not just for clout (although who doesn’t love clout?). If you’re deploying frequently, it’s probably a sign that there are a lot of things going right. You have the right mechanisms in place to deploy safely at pretty much any time, your team is empowered to move forward quickly, and you can fix problems easily with a follow-up deploy!

During my career, I’ve worked at companies that hit the mythical 200 deploys a day, as well as companies that deployed only a few times a _year_. I’ve been in charge of a DevOps organization that had responsibility for keeping those numbers high, and seen plenty of things that can help, as well as hinder, this goal.

So if you want your company to be the next poster child for frequent deployment, here are a few ways that can help get you there!

# 1\. Be a SaaS company

Building a hosted SaaS product gives you complete control over the version of your software that’s exposed to your customers. No messing about with pesky installation instructions or handling a client that hasn’t been upgraded.

If you make the mistake of running the wrong kind of business, you might even find that your customers don’t let you deploy as much as you want - how dare they! Working with some government agencies, for example, may require you to request written approval for each batch of changes you send into the approved environment.

# 2\. Have hundreds of engineers

Maybe not hundreds, but no individual is going to be deploying hundreds of times a day.

I’m a one person shop and deployed a total of 8 times yesterday. Maybe there’s a 10x engineer out there who could get up to 80+, but how easy would it be to hire someone like that?

If you have 100 engineers, then they only need to deploy once on average each day to hit 100 daily deployments. 150 engineers and you can start letting them take vacation!

# 3\. Ship one-line fixes

Why ship one 200 line change, when you can ship 200 separate one-line changes? Bingo, you’ve hit your quota for the day! Granted, those changes probably don’t do a whole lot, but what’s wrong with gaming a few numbers here and there?

# 4\. No code reviews or manual testing

Let’s face it, people just get in the way. We’ve all waited days for a code review, or for a QA team to return a report.

Early in my career, I worked in an organization with a large QA team. Nightly builds were subjected to a “fast” round of manual testing to identify critical bugs, followed by a series of more rigorous rounds as we got closer to releasing to our customers. A strong safety net, for sure, but too slow to truly be ready to “deploy” at a moment’s notice. In fact, the one time we really needed to perform an emergency release, the global QA team was left scrambling to execute an abridged suite of tests over the course of a day or two.

# Put another way

Maybe those aren’t the most realistic ways to achieve frequent deploys. So let’s come at it from a more practical angle.

## 1\. Define “production” for your business

You may indeed find yourself in circumstances where you can’t deliver directly to your customers as often as you might like, but it’s ok to move the goal posts a little bit.  
  
Let’s say you’re selling an on-premises software solution and don’t have access to your customers’ networks. It would be unreasonable to expect them to upgrade every time you pushed a change to your source repo. But that’s not to say you can’t always be ready to send them a build when appropriate.

Define a “production-ready” stage to your deployment process, where builds can be kept ready to send out. These builds should be of a quality that would satisfy your customers, so if you need to send out an update in a hurry, you have that capability.

## 2\. Empower your whole team

Don’t just rely on your “high performers” to meet your goals. Skill can play a part in how frequently your team members can deliver results, but it’s important to look at systemic blockers that might slow them down.

Maybe the build process for a particular service is too slow. Perhaps it’s difficult to test third party APIs locally. Some of your tools may require specialist knowledge that and experience that only a few team members have accrued. If you can tune your tools and practices to make your whole team more productive, then it will be easier to maintain your numbers.

It’s also possible that the team members who appear the most productive are finding ways to game their numbers. [Goodhart’s law](https://en.wikipedia.org/wiki/Goodhart%27s_law) in action. If there’s a big skew in your numbers, it’s important to ask why, and focus on the real goal of the exercise - delivering value from your software.

## 3\. Small, self-contained changes

While aiming for one-line changes is extreme and impractical, keeping your changes as small as possible will help you move rapidly and safely.

Small changes are easier to review, can be subjected to a focused set of tests, and are simpler to revert if something goes wrong.

## 4\. Automate and minimize handoffs

Every time you need to ask a colleague to do something, you’re going to be slowed down. Everyone has many demands on their time, so each request for a code review or a manual test will have to go into a queue, be it formal or in someone’s head.

By keeping handoffs between different team members to a minimum, you can cut out the greatest source of delays. Everything you can automate will pay dividends in time saved.

You won’t be able to eliminate every manual step. Some form of code review is probably required by your compliance controls, and it’s always a good move to manually verify your changes before shipping them. But you’ll probably be able to find ways to streamline the process through techniques like pair programming and dogfooding.

# Bonus: Make it part of the culture!

If you really want to achieve high deployment frequency, everyone needs to own that goal. Of all the tools, techniques and measurements I’ve seen, the most effective one is making frequent deployment a part of your organization’s identity.

When interviewing engineers, I always loved being able to say they’d get to deploy to production on their first day. Deploying frequently brings a lot of operational benefits, but there’s also a lot of pride and satisfaction that comes with being part of an effective team.

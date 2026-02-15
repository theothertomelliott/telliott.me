---
title: "In defence of deployment freezes"
slug: "in-defence-of-deployment-freezes"
pubDate: 2025-02-28
description: "Many organizations have periods when they restrict deployments to production. You may find yourself working for one, so it's best to be prepared for it, and protect yourself from the downsides."
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/5cec937e-bc33-405f-8546-761a87b91e3d_3538x2112.jpeg"
  alt: "Photo by Egor Kamelev"
  caption: "Photo by Egor Kamelev: https://www.pexels.com/photo/close-up-photography-of-snowflake-813872/"
---

Telling your engineering team not to deliver any work for a few weeks sounds bad, right? If you’re not moving forward, you’re moving backwards! This is more or less what a deployment freeze is, stopping your team from deploying to production on the off chance something goes wrong.

In a world where carefully crafted CI/CD lets you deploy safely hundreds of times a day, it may seem like an anti-pattern to put a pause on everything. Because it is.

Charity Majors has authored a number of [popular blog posts](https://charity.wtf/tag/friday-deploys/) on the subject of Friday deployment freezes - part of a broader debate that inspired the name of this blog. And surely if freezing for a single day is so bad, freezing for longer is even worse.  
  
From my perspective, the main drawback of deployment freezes is that they cause changes to “stack up”. Your engineers are probably still working on changes, and maybe even pushing them through the early stages of your pipelines. So when the freeze is lifted, there’s a sudden rush of changes going into production, so any problems with those changes will be more difficult to pinpoint and resolve.

So why would I defend deployment freezes?

Regardless of your view on freezes, as an engineer, you’ll probably have to participate in one at some point. Despite their drawbacks, a lot of companies implement some kind of deployment freeze period. Gergely Orosz called out a surprising number of big names in [his series on the subject](https://newsletter.pragmaticengineer.com/p/code-freezes).

In my time working for a retail-adjacent company we enacted freezes for the run up to Black Friday (the busiest time for our users), and occasionally for big live demos of new features. They were frustrating, sometimes pushed back on, and generated a decent amount of work to enforce. But when they were executed well, they did bring some sense of calm to the holiday period - and a popular time to book vacation.

# The one motivation for freezes

There’s only really one reason you’d want to do a deployment freeze. **Most incidents happen when we change things.**

If you’re not introducing changes, you’re not introducing new bugs, so when there’s a critical period where everything has to work flawlessly, blocking changes is a large, blunt instrument to throw at the problem.

# How you might end up doing one

Assuming you’re of the opinion that deployment freezes are an unforgivable trespass, the number one way you’ll end up putting one in place is that **someone ordered you to**.

This could be a directive from higher-ups in your company, a demand from a big customer with huge contract value, or a regulatory requirement. It could also just be a case of cultural inertia that you don’t have the weight to reverse just yet.

You may have argued your case valiantly, but ultimately had to disagree and commit. So now you’re here, you might as well implement a deployment freeze to be proud of!

# How to minimize the downsides

Aside from the problem of stacking up changes to push out in one big batch, you also want to ensure that running a deployment freeze doesn’t create a ton of extra work for you. These are a few of the strategies I’ve seen work well when running a smooth freeze.

## Reduce the blast radius

If you’re concerned about changes reaching production, don’t freeze staging! Ideally, you want to keep as much of your CI/CD pipeline running as you can, so you’re getting good feedback on the changes that are eventually going to be rolled out to production.

For critical demos, you could even create a dedicated demo environment separate from production. This environment could be frozen at will, and any stacked changes would still be getting verified in your main production environment. If you want to get really fancy, you could create ephemeral demo environments.

## Automate the freeze

If you have thousands of microservices to manage, setting up a freeze on all of them can be a massive pain. Ideally, setting up a freeze should be automated, at least so far as being a single click to enable or disable it across the board.

You’ll also need a way of bypassing the freeze in an emergency. Just because you’re not deploying changes doesn’t mean nothing will go wrong. The bypass should be quick to enact and hold the paperwork until the dust settles. The last thing you need is to have an engineer scrambling for manager approval at 2am to deploy a critical fix.

## Yell it from the rooftops

The whole team needs to know a freeze is happening well in advance. This includes engineers, but also product managers, the support team, etc. Nobody should be left wondering why their pet feature is stalled, or worse, disregarding the freeze and bypassing it because they didn’t understand the purpose.  
  
The communication doesn’t stop after the freeze is lifted. Being subjected to this kind of disruption is way less annoying if you know it did some good. I recall one year where a holiday freeze was followed up by a triumphant Slack message: “last year three people got paged over the holidays, this year nobody did!”.

The reverse is also true, if something did go wrong, there needs to be clear follow up. Did someone bypass the process? Worse, would the problem have been prevented by a change that was blocked by the freeze?

# If you have to do it, do it well

Were I to give you one piece of advice, it would be to do everything you can to avoid having to run a deployment freeze. But sometimes everything you can do isn’t quite enough, and you’ll have to hold your nose and hold your deploys. If that ever happens, make sure you’re running a great process that gets you all the benefits and avoids the drawbacks.

---
title: "Break Glass in Case of Emergency"
slug: "break-glass-in-case-of-emergency"
pubDate: 2024-07-05
description: "The importance of emergency procedures for CI/CD systems."
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/fa4fe786-bc21-4881-af91-347016342bcd_4024x6048.jpeg"
  alt: "Fire Alarm: Photo by Brett Sayles"
  caption: "Fire Alarm: Photo by Brett Sayles: https://www.pexels.com/photo/red-metal-box-3186166/"
---

Having a well-defined process for deploying your software is critical, but sometimes, you need to break the rules to get results. In this article, I’ll be exploring some of the kinds of break-glass strategies I’ve seen and why you might want to put them into practice.

## **The Benefits of a Good CI/CD Setup**

A good CI/CD setup is great: it helps your developers move more quickly, gives you peace of mind that code going into production has passed certain requirements, and provides a detailed paper trail when something goes wrong. Once your team is consistently using a CI platform for deployments, they also won’t need as much direct access to production, which will make your security and compliance team happy.

Until recently, I was of the opinion that this was the ideal. If you were getting it right, why would you need to give the team at large unfettered access to modify your production environment? However, things go wrong, and sometimes we find we just have to roll up our sleeves and make some manual changes. With access to production being limited, we often need to page someone we knew had the right access to do so. Surely there was a way to manage this to make it less painful?

## **Why Break-Glass Options Are Essential**

I recently attended the excellent [r9y.dev discussion meeting](https://www.r9y.dev/discuss/) and asked the attendees about their strategies for making sure their pipelines were able to handle emergency situations. I expected that they had perhaps automated some of the tasks that those of us with way too many permissions in prod often have to perform manually. The response was overwhelmingly that you will always need a break-glass option. Your CI/CD processes will be optimized for the day-to-day, and this won’t always be applicable during an incident.

You want your tests to be fast, but they will never be instantaneous. Verifying in a staging environment to test will naturally take twice as long as just deploying straight to production. So during an emergency, your pipeline will likely be just too slow. You may have a lightning-fast rollback process, but sometimes the problem isn’t because of some bad code getting out, and you need to do a fix-forward. Not only that, but by definition, an incident will involve some kind of unknown element, so eventually, you’re all but guaranteed to encounter a situation your carefully constructed CI pipelines and automations weren’t designed to handle. In the most egregious case, your entire CI system may go down. Even GitHub Actions is known to have [fairly regular incidents](https://www.githubstatus.com/history), with varying levels of impact. Sometimes you just need to deploy from your local machine, and that’s ok.

## **The Key: Plan for Emergencies**

Recognizing the potential for emergencies and being ready for them is critical. This may sound as counterintuitive as “expecting the unexpected”, but really boils down to acknowledging that you’ll need to bypass your processes from time to time. Identify which options you have to break out of the usual workflows, and, more importantly, train your teams on the options that are available. Incidents are high-pressure situations, and you won’t always be thinking at your best, so it’s important to be able to rely on muscle memory.

During my time at Yext, we built out a few different mechanisms for bypassing our CI tooling. Code review could be bypassed with a “To Be Reviewed” flag, you could manually promote a build that had failed tests, and you could even deploy to production from your laptop (after receiving a reasonably loud warning). All of these came in handy during emergencies.

For our friends in security and compliance, we needed to have a good story around each of these methods, requiring us to document and enforce procedures to catch when one of these methods had been used. For example, in exchange for allowing deployments from a laptop, we implemented a monitoring service that consumed our [Nomad event logs](https://developer.hashicorp.com/nomad/tutorials/integrate-nomad/event-stream) and created a Jira ticket whenever a package was deployed outside of TeamCity. This ticket documented the necessary follow ups, including recording the reason for the bypass, and requiring re-deployment through normal CI pipelines within 7 days.

## **Conclusion**

While a well-structured CI/CD pipeline is essential for efficient and secure software deployment, it's equally important to recognize the need for break-glass strategies. Emergencies and incidents can and will occur, often requiring swift and sometimes manual interventions. By planning for these scenarios and training your teams appropriately, you can ensure that your deployment process remains resilient and adaptable, even under pressure.

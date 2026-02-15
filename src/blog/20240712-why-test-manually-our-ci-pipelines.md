---
title: "Why Test Manually? Our CI Pipelines do the testing"
slug: "why-test-manually-our-ci-pipelines"
pubDate: 2024-07-12
description: "Exploring why manual testing is still important even with a robust CI pipeline"
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/3192a351-702f-47f2-ac5a-81edc9debcab_6016x4016.jpeg"
  alt: "Photo by Chokniti Khongchum"
  caption: "Photo by Chokniti Khongchum: https://www.pexels.com/photo/person-holding-laboratory-flask-2280571/"
---

Automated testing is a critical tool for building robust CI pipelines and delivering high-quality software rapidly, but in practice, even the most robust automated tests won’t cover every eventuality. In this article, we’ll explore how manual testing can still be just as important to your processes, and how to make strategic use of manual testing to cut down on risk without slowing you down.

Over the years, I’ve seen engineers striving for 100% test coverage, or seeing it as a shameful failure when a bug slipped through the CI pipeline. But humans are unpredictable, and even your most carefully crafted tests won’t anticipate the chaos that will ensue when they get their hands on your software. There will always be room for a human to jump in and spot check things, and it’s always good practice for an engineer to do so.

_As a tl;dr:_ **There is value in manually verifying your changes after they’re deployed.**

This isn’t to say you need a dedicated testing team (or that having one is always a bad idea). The engineering team that makes a change can usually do a decent job of using their own work. If they don’t, that’s probably a cause for concern - building a product is incredibly hard if you don’t know how to use it.

# Why Automate Tests?

Before exploring the motivation for manual testing, let’s first look at the case for automated tests. After all, manual tests were how we all started verifying our code, and for the majority of us, are still part of our daily lives.

[Continuous Delivery](https://www.amazon.com/Continuous-Delivery-Deployment-Automation-Addison-Wesley/dp/0321601912), by Jez Humble and David Farley is an excellent resource to get an initial overview of CI/CD concepts, and talks about the benefits of automation from the beginning. Chapter 1 defines three criteria for useful feedback:

-   Any change, of whatever kind, needs to trigger the feedback process. 
    
-   The feedback must be delivered as soon as possible.
    
-   The delivery team must receive feedback and then act on it.
    

These criteria do not specify automation, but the desire for speed is a significant motivator to automate feedback wherever possible, as is the need for consistency when you’re engaging in a feedback process as frequently as prescribed.

To ensure the fastest possible feedback for the bulk of problems, the book advocates running your fastest tests first. This also implies that slower tests can run later, creating layers of progressively slower tests. 

This can be compared to the [Swiss cheese](https://en.m.wikipedia.org/wiki/Swiss_cheese_model) model of accident causation. Each successive layer of tests catches a different set of potential bugs, so the final output has as few as possible.

Running your fastest tests first is a great strategy, but there are factors other than time that may be taken into consideration, such as cloud resource utilization or availability of physical hardware. So let’s order our tests by a more generic concept: _cost_, with the “cheapest” first.

You may have your tests organized something like this:

![](https://substack-post-media.s3.amazonaws.com/public/images/1d5e863c-4b04-4c87-b422-86d70fdd5701_595x463.png)

Your unit tests, with minimal dependencies can run quickly and cheaply, so you run those first to catch as many issues as possible. Integration tests need a little extra setup and may be slower, so those run next. Acceptance tests require a full end-to-end environment and likely use a full browser or even real hardware, so incur the most cost and are run last. 

# Where can manual testing fit in?

One clear situation where you will need to rely on manual testing is when you bypass your CI pipelines entirely, as described in my [previous article](https://thefridaydeploy.substack.com/p/break-glass-in-case-of-emergency). In this case, you may have run your most rapid unit tests, and know everything builds, but by definition you will have skipped your longer-running tests, and you will want to know that your fix works as expected, so you will likely have to do at least some manual testing to give you that confidence.

But even if you run your complete CI pipeline to the letter, there is one big set of manual tests after deployment. Your customers!  
  
Having your customers discover and report a problem in production is potentially extremely costly, especially if a poor experience may result in lost revenue. So let’s add this cost to the diagram.

![](https://substack-post-media.s3.amazonaws.com/public/images/f9657406-3245-4ccb-a2ad-9d3d8717f501_738x508.png)

You can mitigate the cost of customers noticing issues by having robust monitoring, or introducing rollout strategies like canaries or blue green deployments. However, depending on the usage patterns of your application, it may take some time for either of these steps to catch a problem. Time is of the essence, as the longer bad code is in production, the greater the cost. But we can mitigate this problem by adding a short manual testing step after deployment.

Spend a couple of minutes testing and you might catch a problem that automated tests would miss, like a rendering issue making a button usable by tools like [Playwright](https://playwright.dev/) but invisible to a human, or missing key explanatory text.

![](https://substack-post-media.s3.amazonaws.com/public/images/10547589-4cd2-4b3e-8f1b-62d7b3e8a859_899x519.png)

Even if your pipeline is fully automated, there’s value in taking a peek at your changes as soon as you know they’ve been rolled out. Who knows? You might have triggered your pipeline on the wrong commit or forgot to stage the file that actually enables your change. No access to production? Focus on staging or an ephemeral environment.

You can also start before you even push a commit. Tools like [Tilt](https://tilt.dev/), [kind](https://kind.sigs.k8s.io/) and others allow you to run your changes locally in a production-like manner. So once you know your build and likely your faster unit tests are passing, you can do a slower manual test.

Granted, all of this adds time to the process of getting software out of the door. But the other beauty of manual testing is that humans can get better at it, applying their discretion to do more or less testing depending on the change being made in any given moment.

# Optics

There is also a significant social benefit to having performed manual tests along the way. You remember what you saw and can draw on that when handling failures. When your manager appears at your desk asking about an angry customer report, you’re not caught having to admit that you don’t know if the code worked when it hit production.

Even better, if you make it a habit of manually testing in production, you will have accounts and other configuration ready to go when you need to diagnose a fault. This will save you valuable time.

# Conclusion

Automated testing is an incredibly useful tool that can help you create higher quality software more efficiently. But it cannot entirely replace manual testing, and an engineer who diligently performs their own tests will amplify the benefits of a strong automated testing strategy.

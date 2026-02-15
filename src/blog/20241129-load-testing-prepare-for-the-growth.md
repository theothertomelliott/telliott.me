---
title: "Load testing: Prepare for the growth you dream of!"
slug: "load-testing-prepare-for-the-growth"
pubDate: 2024-11-29
description: "You did it! Your latest marketing post went viral and users are flooding in. But can your systems handle it? Let's build some confidence with load testing."
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/7db3a0a9-b56b-45ff-9242-37cc873c67b1_2848x4288.jpeg"
  alt: "A small car, overloaded with luggage"
  caption: "A small car, overloaded with luggage"
---

A couple of weeks ago, I signed up for [Bluesky](https://bsky.app/) (don’t be afraid to say hi - [@telliott.me](https://bsky.app/profile/telliott.me)). It was almost immediately apparent how quickly the platform is growing. At times it was gaining a million users per day or more, which no doubt caused a vast growth in traffic as everyone found friends and followers to engage with.

I saw the odd report of errors and short outages here and there, but honestly never saw any of this myself - I guess I was one of the lucky ones. I’m old enough to remember the “fail whale” days of Twitter, and seeing a new platform able to scale this quickly with so few problems is incredibly impressive.

So it seemed like a perfect time to talk about how you can make sure your systems can handle explosive growth in traffic! Let’s talk load testing.

# What is load testing?

Load testing typically refers a kind of automated test that simulates multiple users (often called Vusers) to ensure that the system behaves correctly. This can involve many Vusers, or just a few.

Load tests can be pass/fail, but they can also be exploratory, attempting to probe and understand the properties of your system under load.

Typically, when an engineer talks about load testing, they’re referring to testing with a large number of Vusers, but this only really includes some of the different types of load testing that organizations might implement.

# Types of load testing

Grafana have an article, [Types of Load Testing](https://grafana.com/load-testing/types-of-load-testing/) that covers 6 key flavors of load testing. I’ll recount them briefly here.

**Smoke tests** simulate a small number of users to ensure things are generally working as expected.

**Average-load tests** place a “typical” level of load on the system to see how it performs. This is intended to simulate the load you would see during a regular day.

**Stress tests** attempt to simulate “peak” traffic, to see how the system would manage during higher than normal load.

**Spike tests** apply a sudden increase of usage. Think of all the websites that crashed after a Superbowl commercial!

**Breakpoint tests** push your systems until they break. This can help you build an understanding of what the true limits are, what failure modes you can expect and where the bottlenecks might be.

**Soak tests** apply a typical amount of traffic over a long period of time. This could help capture issues like memory leaks or inefficient storage practices.

# What should a load test do?

This is a complex question, since there likely many features in your application that could be subject to a load test.  
  
Should your Vusers all perform the same workflow? Should there be multiple workflows being exercised in parallel?

There are a few ways you could approach this:

-   If you’ve been unfortunate enough to have seen your systems fail under real load, you likely made some observations that indicated what kind of operations caused the most problems. This can help guide you in generating meaningful load to reproduce the problem.
    
-   You could attempt to replicate your existing typical load either through carefully written scripts, or through a replay of previous traffic. Of course, this requires you’ve already seen some example of load. Maybe your app is very new with few users.
    
-   You could try to anticipate the most common user behavior during peak load. If you have an e-commerce site, you could expect a lot of users to select an item and check out after an advertising campaign. Of course, you could always be surprised by what really happens!
    

The best option for you will depend on your circumstances and the goals of your testing.

Of course, putting theory into practice often doesn’t work out the way we expect it to, so you may find that the load you generate doesn’t impact your systems in quite the way you anticipated.

It’s always worth having a few different options available and comparing them to one another before making a choice. If your monitoring allows, you could execute a small scale load test with a handful of users, and see how they impact the resource utilization in your system. Compare metrics like memory usage, cpu usage and db connection counts to give you an indication of what workflows might tax your systems at scale.

# Where should you load test?

Everyone has a production environment, and you may also have a staging environment, but it may not make sense to run load tests in either of these.

It’s probably obvious that there’s a big risk in running a load test against your production environment - who wants to tell their customers that your services are unavailable because you were running a test?

But there are also drawbacks to running load tests against a staging environment. You may not want other tests or developers to interact with staging during a load test, so you can be confident of your conclusions after a test.

This may lead you to want to create a dedicated load test environment with a complete copy of your production environment. I’ve seen this approach taken a couple of times and while this gave us confidence that load test results were meaningful, there were obvious cost implications and it was easy for this extra environment to “drift” from production, to the point at which it wasn’t representative.

You could attempt to combat this by:

-   Creating an ephemeral test environment from scratch when you need to execute a test and tearing it down when the test is complete. The templates for this environment can evolve alongside production.
    
-   Designing a “scaled down” environment that include a minimal set of resources necessary to execute a test. To get meaningful results, you likely want some kind of horizontal scaling, but not as much as in production.
    

Of course these approaches add their own costs to any load testing project, and should be factored into your plans.

# When to run load tests

Some kinds of load test can be very time and resource intensive. Not only do you need the resources to generate your simulated traffic, but you could essentially lock other users out of your test environment.

Initially, it’s entirely reasonable to run your heavier load tests manually on an occasional basis. Schedule a test ahead of time and ensure the team are prepared. This gives you the advantage of having someone available to monitor your systems during the test - very handy when the unexpected happens in the early days.

It’s worthwhile to have an eventual goal of running your tests automatically on a regular basis - in the case of smoke tests this could be pretty straightforward. But you’ll have to balance out the cost of running each type of test (both time and server resources) against the additional protection it can provide you.

# Load testing tools

There are a wealth of tooling options for load testing, far too many for me to reasonably list here. But here are a few that I’ve had experience with.

[Hey](https://github.com/rakyll/hey) is a delightfully simple application that can send HTTP requests in bulk. I’ve found it really handy for running ad-hoc tests to verify load balancing setups.

[JMeter](https://jmeter.apache.org/) has been around since 1998 and for a long time was something of the standard for load testing. It provides a desktop GUI and a pretty deep list of features. There’s a reason it stood the test of time!

[Grafana k6](https://grafana.com/docs/k6/latest/) is an open source tool, but Grafana also provides a hosted instance with a few additional capabilities. One thing I really like about k6 is a feature that allows you to record real browser interactions for a workflow and play back just the associated network requests - so you get realistic traffic but for a fraction of the compute of scripting a headless browser.

Whatever solution you choose from the sea of options, I can recommend looking for a few key features up-front:

-   How easy it is to run Vusers on remote servers (you’ll be very limited if you just run on your laptop!)
    
-   Can you ramp up and ramp down requests to adjust load steadily?
    
-   In what format do you get the results? Is this something you can draw useful conclusions from?
    
-   And probably most importantly, how easy is it to shut everything down if something goes wrong? Let’s say you accidentally pointed a spike test at production!
    

# Conclusion

Load testing is a powerful technique that can help you shore up your services to handle the growth in usage that you’re working so hard to bring in. But it can get very complicated, and expensive, quickly. Before embarking on your load testing journey, you need to carefully consider the steps you wish to take and what flavor of tests are going to serve you best for your immediate goals.

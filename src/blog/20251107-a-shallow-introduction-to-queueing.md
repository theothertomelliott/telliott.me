---
title: "A Shallow Introduction to Queueing Theory"
slug: "a-shallow-introduction-to-queueing"
pubDate: 2025-11-07
description: "Queueing theory can be incredibly useful, but potentially dense for those of us who aren't mathematically inclined (myself included), so let's look at the basics in their simplest form."
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/0c145115-c34b-4d66-88e6-601bf138396c_3840x2160.jpeg"
  alt: "Photo by Deepak Gautam"
  caption: "Photo by Deepak Gautam: https://www.pexels.com/photo/opened-book-240163/"
---

In my previous post about [parallelizing builds](https://open.substack.com/pub/thefridaydeploy/p/how-parallelizing-your-builds-can?r=36rml&utm_campaign=post&utm_medium=web&showWelcomeOnShare=false), I mentioned that there was enough content out there on build queues to write a short series. So this week, I’m going to take a little detour into theory. Specifically [Queueing Theory](https://en.wikipedia.org/wiki/Queueing_theory).

As a Brit, I consider queueing to be in my nature. But even when your national pastime is standing in a line, a long queue can still be incredibly frustrating. This is where queueing theory comes in, helping you predict queue length and wait times so you can plan effectively. A supermarket might use queueing theory to help decide how many staff are needed at checkout, a consulting firm might use it to plan how many projects to take on at once, and (most relevant to this blog) an engineering team may use it to right-size their cluster of CI runners.

# The Simplest Queue

A nice, simple, starting model for a queue is _M/M/1_. These values (in Kendall’s notation) break down to _arrival times_/_service times_/_# of servers_. A server count of 1 is simple enough to understand, but let’s look closer at the M.

The Ms stand for “Markovian”, or more helpfully, “memoryless”. This means that events are independent of one another, and occur randomly with a constant average. So for the purposes of modeling, we represent arrival rate with **λ**, and our service rate with **µ**. These are the mean numbers of requests that arrive or can be served in a unit time period, so for example a λ of 5 could mean that 5 requests arrive every minute.

Kendall’s notation may also include a fourth value, the length of the queueing area. We’ll omit this for today, assuming that we have an infinite waiting area.

# Predicting Wait Time

With λ and µ, we can figure out other properties of our queue, like our total wait time. The average wait time **W** describes the average amount of unit time a request spends in the system, including queueing and service.

W can be calculated with this formula:

$$
W = \frac{1}{\mu - \lambda}
$$

So with a unit time in minutes, if we can service 7 requests per minute, and 5 requests arrive every minute, we can expect each request to be waiting a total of 0.5 minutes, or 30 seconds.

This formula assumes we can reach a _steady state_, and it breaks down if λ >= μ. When the rates are equal, we end up dividing by zero (requests wait forever on average). When λ > μ, W is negative, which is meaningless.

# Predicting Queue Size

Once we have our wait time, we can also predict the average size of our queue, **L**. This is calculated using [Little’s Law](https://en.wikipedia.org/wiki/Little%27s_law).

$$
L=λW
$$

So for our example above with a wait time of 0.5 and an arrival rate of 5, we can expect that on average there will be 2.5 requests in the system.

# Further Reading

As promised, this was about as shallow an introduction to queueing theory as I could manage, but here are a few more resources for you to find out more!

-   Wikipedia
    
    -   [Queueing Theory](https://en.wikipedia.org/wiki/Queueing_theory)
        
    -   [Kendall’s Notation](https://en.wikipedia.org/wiki/Kendall%27s_notation)
        
    -   [Little’s Law](https://en.wikipedia.org/wiki/Little%27s_law)
        
-   [Little’s Law as Viewed on its 50th Anniversary](http://www.informs.org/content/download/255808/2414681/file/little_paper.pdf)
    
-   [Simio and Simulation Chapter 2](https://textbook.simio.com/SASMAA7/ch-queueing.html): Basics of Queueing Theory

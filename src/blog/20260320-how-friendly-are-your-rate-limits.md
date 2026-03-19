---
title: "How friendly are your rate limits?"
slug: "how-friendly-are-your-rate-limits"
pubDate: 2026-03-19
description: "Comparing two rate limiting strategies, one that's (almost) pleasant to work with, another that is very much not."
author: "Tom Elliott"
image:
  url: "/assets/blog/20260320-how-friendly-are-your-rate-limits/cover.jpg"
  alt: "A sign reading 'Maximum 6 people beyond this point'"
  caption: "Photo by Erik Mclean: https://www.pexels.com/photo/warning-panel-in-foggy-overcast-weather-4751220/"
---
It's entirely possible this short post will turn into a short rant. I've been thinking about rate limits a lot lately, and I think it's fair to say that most of them are a pain to work with.

During the past couple of weeks, I've been working on a certificate managemen service, for which I had to spend a decent amount of time designing around the [LetsEncrypt](https://letsencrypt.org/docs/rate-limits/) rate limits. Coincidentally, we also hit a problem with an internal tool hitting [GitHub's API rate limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api?apiVersion=2026-03-10).

The way in which these rate limits are applied could not be more different. Although, I will caveat that I've not hit the LetsEncrypt rate limits directly, so everything that follows is based on their docs. With GitHub on the other hand, I have first-hand experience (and not just recently) of the experience when you hit the limits.

LetsEncrypt have a range of rate limits for different operations, so let's start by looking at the "New Order per Account" limit.

> Up to 300 new orders can be created by a single account every 3 hours. The ability to create new orders refills at a rate of 1 order every 36 seconds.

In this case, an "order" is a request for a certificate. So you can make the equivalent of 100 requests, every hour. You also know that if you hit the rate limit, you'll effectively be throttled to just under 2 requests a minute. So hit the limit and some requests will still go through, just slowly.

Contrast this with GitHub's rate limiting.

> You can use a personal access token to make API requests. Additionally, you can authorize a GitHub App or OAuth app, which can then make API requests on your behalf.
> 
> All of these requests count towards your personal rate limit of 5,000 requests per hour.

It's not until later in the doc that they talk about when the rate limit is reset.

> If you exceed your primary rate limit, you will receive a 403 or 429 response, and the x-ratelimit-remaining header will be 0. You should not retry your request until after the time specified by the x-ratelimit-reset header.

So when you hit a rate limit, you're stuck until you hit the reset point. This could be 2 minutes away, or 59 minutes away. Worse still, the error can manifest as a 403, completely masking the fact that you've been rate limited at all.

So if you're designing a rate limiting system, consider having a steady refill rather than all-at-once, to throttle rather than block.

If you're a developer looking to use a third party API, pay close attention to the rate limiting documentation!
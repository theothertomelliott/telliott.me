---
title: "Rehousing my blog"
slug: "rehousing-my-blog"
pubDate: 2026-02-20
description: "I've been dissatisfied with SubStack for a little while, and finally got my act together to move to a self-hosted site where I have more control."
author: "Tom Elliott"
image:
  url: "/images/pexels-introspectivedsgn-4157121.jpg"
  alt: "Photo by Erik Mclean"
  caption: "Photo by Erik Mclean: https://www.pexels.com/photo/wooden-fence-of-high-cottage-in-suburb-4157121/"
---
I've been writing pretty regularly on [my SubStack](https://thefridaydeploy.substack.com/) since mid-2024. Initially weekly, then bi-weekly (alternating with my Ocuroot blog), and back to weekly again in recent months. The writing itself has been mostly satisfying, giving me nice excuses for fun little side projects, but text with the occasional image is starting to feel a bit limiting. So I'm going to be writing on my own site instead!

I've re-vamped [telliott.me](https://telliott.me) to be a first port-of-call for my writing, but will likely cross-post to SubStack and possibly my [LinkedIn newsletter](https://www.linkedin.com/newsletters/scaling-deployments-7307762478157885441/) for a while. So you don't need to do anything right away if you're subscribed to either of those, although if you prefer, there's a handy-dandy [RSS feed](https://telliott.me/rss.xml) on my site. Promise I won't be sad if I see you unsubscribe from the newsletters to follow along that way.

Housekeeping out of the way, let's talk about motivations and some of the tools I'm using. 

# Motivations

My biggest frustration with SubStack, LinkedIn Newsletters, and other social media blog platforms is their "social mediay-ness". They can help you find an audience, but you have to do it on their terms. Farming engagement, exchanging recommendations and posting short updates between posts. I'd find myself repeatedly refreshing the stats for each post the day it went live, as if it mattered how quickly people found it. I just want to write about things I've built, things I've learned and maybe share the occasional controversial opinion.

What finally got me to move, however, was the limited palette of tools in the editor. Code blocks don't provide syntax highlighting or a nice way to handle long lines. Embedding a table in a recent post required me to go to a third-party site and drop in an iFrame. I want more flexibility and control. Maybe this way I'll even start dabbling in interactive content!

# Tools

The previous version of telliott.me was vibe coded as an [Astro site](https://astro.build/). This was barely scratching the surface of what Astro could do, and working through the [Build a Blog tutorial](https://docs.astro.build/en/tutorial/0-introduction/) I got a much better grounding in what the framework was capable of.

In particular the concept of collections stood out as a useful way to organize content. Alongside blog posts, I had short lists of podcasts I'd appeared on and talks I'd given. My `content.config.js` file ended up looking like this:

```javascript
import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const blog = defineCollection({
    loader: glob({ pattern: '**/[^_]*.md', base: "./src/blog" }),
    schema: z.object({
      title: z.string(),
      slug: z.string(),
      pubDate: z.date(),
      description: z.string(),
      author: z.string().optional(),
      image: z.object({
        url: z.string(),
        alt: z.string(),
        caption: z.string().optional()
      }).optional(),
    })
});

const podcasts = defineCollection({
    loader: glob({ pattern: '**/*.yaml', base: "./src/podcasts" }),
    schema: z.object({
      title: z.string(),
      date: z.string(),
      description: z.string(),
      video_url: z.string(),
    })
});

const talks = defineCollection({
    loader: glob({ pattern: '**/*.yaml', base: "./src/talks" }),
    schema: z.object({
      title: z.string(),
      event: z.string(),
      date: z.string(),
      description: z.string(),
      slides_url: z.string(),
      video_url: z.string().optional(),
    })
});

export const collections = { blog, podcasts, talks };
```

(If you're reading on my main site, you'll notice the helpful syntax highlighting!)

I'm using [CloudFlare Pages](https://pages.cloudflare.com/) for hosting, enjoying their more than generous free tier. However, for a little more flexibility, I've disabled the auto-deploy feature and moved to using GitHub Actions for CI. This let me add some [Playwright](https://playwright.dev/) tests, which the Pages build environments currently don't support. As of right now, the tests are just to make sure that the menu works on desktop and mobile (I've been burned by that one before), but as I add some more complexity, I'm sure I'll have plenty more to add.

The workflow currently looks like this:

```yaml
name: Deploy to CloudFlare Pages
on:
  push:
    branches:
      - main
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test
    - uses: actions/upload-artifact@v4
      if: ${{ !cancelled() }}
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
  deploy:
    needs: test
    runs-on: ubuntu-latest
    timeout-minutes: 60
    steps:
      - uses: actions/checkout@v4
      - name: Install dependencies
        run: npm ci
      - name: Build site
        run: npm run build 
      - name: Deploy site to CloudFlare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy dist --project-name telliott-me
```

This gives a certain amount of peace of mind, but does come at a cost. The Playwright tests take about 2-3 minutes to execute on a standard runner, which will likely be a pain if I'm just trying to fix a typo.

Of course, this reveals another, hidden motivation behind this move. I have an excuse to play around with CI configuration to my heart's content! I'm back in my happy place.


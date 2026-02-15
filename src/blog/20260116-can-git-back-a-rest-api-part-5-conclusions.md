---
title: "Can Git back a REST API? (part 5 - conclusions!)"
slug: "can-git-back-a-rest-api-part-5-conclusions"
pubDate: 2026-01-16
description: "It's been a month and a half since I started working on a Git-backed REST API. High time to wrap it up and answer the dang question already!"
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/8bc7ce16-d491-4a3e-bd18-d8dfb407df16_6000x4000.jpeg"
  alt: "Photo credit: Photo by Martin Lopez"
  caption: "Photo credit: Photo by Martin Lopez: https://www.pexels.com/photo/man-in-black-blazer-wearing-black-framed-eyeglasses-2399065/"
---

In early December, I posed the question: can Git be used as a generic data store? Specifically I wanted to see if I could use a Git repo to provide storage for a simple REST API as an alternative to services like S3. It’s now mid January, so I better hurry up and give my answer. It’s conclusions week!

# Let’s summarize

In [part 1](https://open.substack.com/pub/thefridaydeploy/p/can-git-back-a-rest-api-part-1-the), I defined the problem and built the first prototype using Git’s “porcelain” commands directly. Suffice to say it wasn’t super performant.

[Part 2](https://open.substack.com/pub/thefridaydeploy/p/can-git-back-a-rest-api-part-2-git) was when I started building something more realistic. With the help of go-git, I implemented an in-memory backend that interacted more directly with the underlying Git protocols. Way faster! But maybe a bit error prone.

Concurrency was the name of the game in [part 3](https://thefridaydeploy.substack.com/p/can-git-back-a-rest-api-part-3-concurrency)! I set up a test to fire off a bunch of reads and writes in parallel and fixed all the problems that came up.

Finally, [part 4](https://thefridaydeploy.substack.com/p/can-git-back-a-rest-api-part-4-stability) got my API to a place that could be considered production-ready, but it took a lot of work to get there. Fixing some logic, cleaning up a cache, tuning garbage collection. In the end, it seems usable, but not necessarily super efficient when compared to S3.

It’s not exactly trivial, but building this API is certainly possible, and I could see how it could be made even better. Although probably not surpassing S3. Of course, there are a few issues that I’m aware of that could pose more challenging blockers.

# Known limits - file size

In part 1, I [briefly discussed](https://thefridaydeploy.substack.com/i/180445404/fundamental-limitations) Git’s limitations around large files. Partly due to the complexity of generating diffs, Git performs best when working with small text files. Anything above 1MB will see degradation, which was probably helpful in identifying some of the stability issues I addressed in part 4.

GitHub enforce a 100MB cap on individual files, and [Git LFS](https://git-lfs.com/) is commonly used as a workaround. Since LFS relies on a secondary store, I’m going to assume it isn’t desirable for this kind of use case. So a as a rule of thumb, a Git-backed REST API is really only going to be useful for small text files.

# One more problem

Early on during this project, I spend some time poking around GitHub’s documentation, and found something interesting in the [Repository limits](https://docs.github.com/en/repositories/creating-and-managing-repositories/repository-limits) page. I kept it in my back pocket until now since it seemed like a great bombshell to drop at the last minute.

> The recommended maximum limit is 6 pushes per minute per repository.

That seems pretty low. On the plus side I successfully pushed past this a few times during my testing, so I’m assuming there’s not a hard rate limit for bursty traffic.

What about reads? The same document recommends limiting operations in general to 15 per second (900 per minute). More reasonable, but I could imagine a modestly popular application to exceed that.

How does this stack up to alternatives? I did a little research to compare to a couple of other Git hosting solutions, as well as S3. Numbers are normalized to be per minute. Some are rate limits, some are recommendations or expectations, so I’ve noted that in the “type column”.  
  
Since I’ve been totally remiss in mentioning it before, GitHub also have a REST API of their own, which allows you to read and write individual files much like with my own API.

<iframe src="https://datawrapper.dwcdn.net/CUBlJ/1/" width="730" height="404" title="" frameborder="0" scrolling="no"></iframe>

Surprisingly, the GitHub REST API has rate limits for reading lower than their recommendation for direct reads from their Git endpoints. GitLab and GCP are a little less clear about reads vs write, but even if we assume the same limits for both, S3 blows them all out of the water.

Of course, if you want to put in the work, you can host your own Git server for just the cost of compute. There are also a number of open source projects that make the process a bit easier. I won’t go into specifics on these here, but given that GitLab’s self-hosted option has the built in limit above, I’d be surprised if it was easy to scale your own Git server to handle much more.

Best case, we’re looking on the order of ~1000 operations per minute for our API. Worst case, ~10.

# Does this ever make sense?

I think it’s fair to say that this isn’t the _best_ option for hosting an API. At least not one you want to run at any kind of scale.

That said, I can think of a few use cases where it could be reasonable. This pattern allows for mixing Git-based interactions for developers with a UI or automations. This could help teams using GitOps workflows to automate some smaller changes, or build out tools to navigate their infrastructure. Or a markdown-based blogging tool could provide an optional WYSIWYG editor.

If your data is public, this approach could also provide a cheap (or free) option for hosting. Maybe you have a structured dataset that doesn’t change very often, and you want to provide a flexible API on top of it.

You may also want to take advantage of Git’s log to provide rich history tracking and rollback features on a set of files.

As with so many things in tech, it comes down to circumstances and requirements. So, after a month and a half, my answer to the question “Can Git Back a REST API?” is…  
  
**Kinda.**

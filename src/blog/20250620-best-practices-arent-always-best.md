---
title: "\"Best practices\" aren't always best for you"
slug: "best-practices-arent-always-best"
pubDate: 2025-06-20
description: "Why it's ok to not be a \"mature\" organization and how not to fool yourself into over-engineering."
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/84d94c20-d1e9-43e0-83a0-044e3cdc3c4a_4500x3000.jpeg"
  alt: "Photo by RDNE Stock project"
  caption: "Photo by RDNE Stock project: https://www.pexels.com/photo/a-man-in-safety-vest-and-hard-hat-checking-the-front-door-8293673/"
---

There are a bewildering number of concepts that could be called the “right way” to do DevOps. But they all take time and effort to implement, and may only pay off once you reach a certain size or level of technical complexity. In this post, I’m taking a step back to look at how you can decide if a “best practice” is best for you right now.

If you spend enough time online, you’re going to receive unsolicited advice. It could be directed at you specifically in a comment. Perhaps a “you must do this or your business will fail horribly” post that just happens to have a paid course attached to it. There are also plenty of opinions about what tools to use, how to architect your applications and what criteria you need to meet to feel good about your abilities as an engineer. Everything needs an SLO, all your deployments must be fully automated, everything must run on Kubernetes.

This can be overwhelming, but worse, it creates a trap for anyone just starting out. As a new engineer, you could spend all your time learning every technique and reading all the books without getting any work done. As a small company you could sink a ton of engineering time into setting up “best practices” without really seeing much benefit.

I’ve previously written about my [approach to feature flags](https://thefridaydeploy.substack.com/p/why-im-not-using-feature-flagsyet), and why [deployment freezes are ok](https://thefridaydeploy.substack.com/p/in-defence-of-deployment-freezes) (or unavoidable). But there are countless other times I’ve felt pressure to take a certain approach purely because it was prescribed by the community. I’ve run tiny projects on Kubernetes when a single VPS would have done the trick. I spent years trying to shoehorn SLOs into an organization when alerting from synthetics was plenty. I’ve even tried GitOps once or twice.

I could write many articles about my thoughts on SLOs, and probably a few others as well. What they have in common, though, is that I was making the same kinds of mistakes. I started from the solution, rather than thinking of the end result I wanted. I didn’t give enough thought to the alternatives (including the always-available “status quo” option). And I let myself believe that even if the immediate benefit was small, the effort would be worth it as we “grew into” the solution.

# Good and bad arguments

That last mistake manifested as a few repeated arguments that seemed reasonable on their face, but made huge unstated assumptions. If you ever find yourself hearing (or saying) these, run for the hills:

-   “This approach won’t scale in 5 years time” - if you’re still using the same approach in 5 years, it’s been a huge success, and no shame in having to change then, when you really need it.
    
-   “We might need this if X happens".” - how likely is X? _(the Twitter rebrand has really ruined hypotheticals for me)_
    
-   “We did it this way at another company.” - Same size? Same industry? Same tech stack?
    

There are a few better reasons, but they also have their own follow up questions:

-   “This will save us n hours!” - How often? Who’s time does it save?
    
-   “This is a well-known pattern/technology so people we hire will be familiar with it.” - Would we need to change our hiring pipeline to focus on a particular community for that benefit?
    
-   “This will improve the developer experience.” - Can we do some surveys before and after?
    

# An example: Terraform vs ClickOps

As a slightly more concrete example, this week I was setting up a new store for binary builds of Ocuroot. For mainly cost reasons I was looking at using Cloudflare R2, and would need to create a bucket. The choice was to create it manually through “ClickOps” or via Terraform.

I would usually jump right to Terraform. I like being able to recreate resources easily, and having a record in-code of the current configuration. But in this case I took a step back to briefly compare the options.  
  
The ClickOps approach took maybe a couple of minutes to create a bucket and credentials. Since I’d already created a bucket to see how everything worked, this was now a sunk cost.

Getting going with Terraform would probably take me a few hours. I’d need to get familiar with the Cloudflare provider, identify the settings I wanted, set up credentials and a state store (ironically probably another bucket). Then there would invariably be a couple of rounds of correcting errors and connecting to GitHub Actions and a real secret store to do everything “properly”.

What value would those few hours give me? I’d be able to overwrite unintended manual changes quickly - which isn’t a huge concern since I’m a team of one. I could recreate the bucket quickly if it was lost - which I hope is unlikely given potential loss of data, and if it did happen, it would be a few minutes to get the bucket back. I could also create additional buckets reasonably easily - which is also unlikely since I only need one place for my binary downloads.

So ClickOps was a pretty obvious choice. There will likely be a time where Terraform makes sense, as I grow a team and have need for more easy testing, discovery and modification of resources, but when the time comes, that would be a half-day job at most.

# Conclusion

It’s really easy to fall into a trap of adopting a technology or approach purely because of its popularity and a vague sense that the “true engineers” do it this way. Before you spend a lot of time on adoption, ask yourself what your organization really needs right now, and if this new shiny is really going to help you reach that goal.

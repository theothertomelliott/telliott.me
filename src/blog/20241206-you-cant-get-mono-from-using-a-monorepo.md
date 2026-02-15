---
title: "You can't get mono from using a monorepo"
slug: "you-cant-get-mono-from-using-a-monorepo"
pubDate: 2024-12-06
description: "There's one architectural question that all organizations have to deal with eventually: should you store your code in one repository or many? The truth is, it probably doesn't matter...until it does."
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/dd916172-907b-4abe-bafc-6206a1a72298_5472x3648.jpeg"
  alt: "A smiling man holding and pointing at a post it note that says \"code\"."
  caption: "A smiling man holding and pointing at a post it note that says \"code\"."
---

At some point, we’ve probably all debated the benefits of monorepos vs polyrepos. Should you keep all your code in one huge repository (monorepo), or break it down into a repository for each individual service (polyrepo)?  
  
Both approaches have their own benefits and drawbacks, and as with many decisions, there’s no real “right” way for every organization. So let’s look at them individually.

# Pros and cons of monorepos

By keeping your application code in the same place as its dependencies, monorepos allow you to make broad changes with a single commit. Need to add a function to a library to support a new application feature? No problem, just do them both at once! This can accelerate development, but can also cause its own set of headaches, as all your applications must always use the latest versions of their dependencies, so any backwards-incompatible changes must be handled for every usage at once.

Monorepos can also aid in discoverability, since if everyone has a full copy of all your code checked out, they can search their local copy to find whatever they need. This can benefit your tooling as well, since you can assume always having all the code available when writing scripts.

When evaluating third party tools over the past few years, I’ve noticed that modern tools increasingly assume polyrepo setups. For example, GitHub Actions (similar to many other CI tools) has a single _.github_ folder in each repo to store your workflow configuration. This doesn’t mean that it’s impossible to use Actions for a monorepo, but it means you need to do a little extra work to get everything set up if you need multiple pipelines for multiple applications. Similarly, [Backstage](https://backstage.io/docs/features/software-templates/) by default assumes a polyrepo architecture, and the tooling to generate components tends to assume they will be created in a brand new repo.

The final challenge for monorepos is probably the most commonly discussed: scaling. As a repo grows, even simple operations can become painfully slow, and cloning a fresh copy of the whole repo and its history can take hours. Even with a reasonable-sounding 10GB repository, if you have a whole class of interns trying to download it at once in the same room, they’re going to be waiting all day.

Large tech companies like Google and Facebook have created elaborate setups to handle repos containing Terabytes of code. Facebook famously selected Mercurial over Git for this reason, and Google went as far as to build a custom version control system. Odds are, you’re not going to reach this kind of scale, but the cracks may start to appear earlier than you expect. You may be surprised to hear that GitHub has soft limits on the size of a repo, and recommend keeping them under 1GB for performance.

There are a lot of strategies to combat scaling issues, ranging from shallow clones in CI runs, to [sparse checkout](https://github.blog/open-source/git/bring-your-monorepo-down-to-size-with-sparse-checkout/), which was added to git in 2020. This makes the scaling problem something of a moving target, so the kind of scale you’re concerned about today, may be easy to manage tomorrow.

# Pros and cons of polyrepos

Unsurprisingly, the pros and cons of polyrepos are largely the inverse of the pros and cons of monorepos.

If your shared dependencies are separate from your application code, you are able to use different versions of a dependency in different applications, at the expense of having far more commits to create when making updates. From speaking with a few different organizations, I’ve seen that rolling out updated versions of shared dependencies is an almost ubiquitous challenge for companies that are all-in on polyrepos. I’ve even seen teams building clever in-house tools to manage the changes across all their different services.

Discoverability and consistency can also be a challenge when working with polyrepos. You need a way for your engineers to search across many repos to find what they need, and when working locally with multiple applications, you might need to get prescriptive about how a workspace should be structured. Not to mention the potential error modes for your scripts if an expected repo isn’t checked out or up to date.

Having a dedicated repo for each service can make templating a heck of a lot simpler, especially with some of the tools mentioned previously. This can also make it easier to follow common conventions for project structure, and simplify attribution of code to particular teams. However, this can come with the cost of having to manage more complex permissions and configuration across hundreds, or maybe even thousands of repositories.

# Repos in practice - it’s a spectrum

Despite the stark differences between these approaches - and strong opinions on both sides - I’ve not seen many examples of organizations that were “pure” monorepo _or_ polyrepo. Most companies I’ve talked to had at least one repository composed of multiple projects, and a decent number of small, satellite repositories.  
  
This can come about for many reasons. Some projects just don’t “fit” in a monorepo, and end up off to one side - I saw this happen following attempts to shoe-horn ML code into a monorepo that had grown to favor Java web apps. You may also have teams outside of a broader engineering department that just need somewhere to put a few scripts.  
  
In an extreme case, an acquisition can result in two monorepos from two separate companies suddenly having to co-exist. Add a few more acquisitions into the mix and you can end up with many monorepos - begging the question of whether those would still count as monorepos.

# Making your choice

The choice between a monorepo and polyrepos is one you likely want to make quickly, so you can move on to more “exciting” decisions.

My advice: don’t sweat this one too much up-front.

Start with a monorepo until your application architecture becomes clear and you can make a more informed decision. Moving individual services out into their own repo will probably be straightforward for quite a while, and you’ll need to amass a decent amount of code before the scaling pains manifest. Odds are you’ll end up in one of the hybrid modes above anyway, and there’s nothing inherently wrong with that.

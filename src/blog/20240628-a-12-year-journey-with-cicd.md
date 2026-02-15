---
title: "A 12 Year Journey with CI/CD"
slug: "a-12-year-journey-with-cicd"
pubDate: 2024-06-28
description: "Tales from the trenches of software deployment"
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/f7160181-7a64-4397-85e6-217a227a4281_8192x5461.jpeg"
  alt: "Pipelines in a forest - Photo by Wolfgang Weiser"
  caption: "Pipelines in a forest - Photo by Wolfgang Weiser: https://www.pexels.com/photo/view-of-pipelines-in-a-forest-18784617/"
---

As a first post in this (hopefully) weekly series, I’d like to share some tales of my experiences with [CI/CD](https://en.wikipedia.org/wiki/CI/CD) over the past 12 years. From a disastrous version rollout at a tiny startup to supporting CI for hundreds of engineers, I've seen successful practices, failed practices and a fair few levels of success in between.

This is partly so I can set the stage for future writings, a way to get me back into the habit of tapping out prose regularly, and - as a great man once said - [I like stories](https://getyarn.io/yarn-clip/a1d58193-f696-4e72-90ad-5c9114d347a7).

So let’s start with that tiny startup.

## Startup Support Horror

Let’s rewind to 2012 when I was working at a small startup. We were a team of five, creating end-user software for both Windows and Mac. One day, disaster struck. We released a new version of our Windows client, but in our rush, we only tested it on 64-bit systems, completely overlooking the 32-bit versions. The fallout was immediate and brutal. Users flooded us with support requests, hundreds of them, all reporting the same issue. The solution seemed straightforward: post an updated version and a note on our website. But this wasn't enough; we couldn’t expect our users to keep refreshing our website after they’d submitted a ticket, so we had to make sure we replied to every, single one.

This experience was a harsh lesson in the importance of thorough testing. We needed a way to ensure this never happened again. After some hurried research on the concept of deployment pipelines, and a few minutes in the rabbit hole that was the [Hudson-Jenkins split](https://en.wikipedia.org/wiki/Hudson_\(software\)#Hudson%E2%80%93Jenkins_split), we set up a Jenkins server on a Mac Mini in the office. This server would build the clients, install them in a virtual machine, then run some simple checks to make sure everything worked before publishing the build to our website. This setup was rudimentary but effective, and showed me the value of CI/CD.

## Going Enterprise

Cut to my next job, where I joined a team of 30 engineers. Each of us deployed directly from our desktop machines, navigating a frustrating, multi-step process. I’ll admit I would batch together a few changes before deploying out to protection, despite the risk of also batching together bugs. It was clear we needed a more efficient solution. We chose TeamCity from JetBrains, a more advanced CI/CD tool that promised a much simpler, one-click process to get code tested and into production.

In 2019, I was handed the reins of the group responsible for developer tooling, including TeamCity. Suddenly, I found myself supporting CI/CD for around 150 engineers, who were deploying to production over 200 times a day. This role was a massive leap from my startup days, pushing me to expand my knowledge and skills rapidly. Before long I was exploring concepts like Canaries, Blue-Green deployment and shifting left.

During this period, we also ventured into expanding our open-source offerings. This led us to experiment briefly with CircleCI before eventually settling on GitHub Actions for our projects. GitHub Actions provided a cohesive environment, integrating code and CI seamlessly.

## A Side of CI

Beyond my professional work, I’ve always had one or two side projects on the go. I love learning by doing, and there’s something incredibly satisfying about building something from scratch over a weekend. Plus, it’s often cheaper than buying a video game.

GitHub Actions became my go-to tool for these side projects. It’s free for open source, offers a wealth of community-built extensions in the GitHub Actions Marketplace, and you can’t argue with the reduced cognitive load of having everything in one place. Some of the more recent projects included:

-   A Tic-Tac-Toe game with way too many microservices: [Tic-Tac-Toverengineered](https://github.com/theothertomelliott/tic-tac-toverengineered)
    
-   An experiment in versioning: [Versioned with Actions](https://github.com/theothertomelliott/versioned-with-actions)
    
-   Exploring the limits of scheduled builds: [Can You Use GitHub Actions for Monitoring?](https://medium.com/average-coder/can-you-use-github-actions-for-monitoring-e9c6cfe79ef4)
    

While I was playing around with deploying multi-cloud environments in my [“cloud lab”](https://github.com/telliott-io), I found it useful to supplement GitHub Actions with tools like Terraform Cloud and ArgoCD. For example, GitHub Actions was great for deploying an application to an existing Kubernetes cluster, but Terraform Cloud made managing the creation and destruction of this cluster much easier.

I started with a Terraform project that created a cluster and a second project that would load the cluster with ArgoCD. ArgoCD would then pull in all the other applications. This meant that I could rapidly rebuild the cluster from the ground up by just deleting the resources created by that first project and re-running it.

## Stuff I Learned

Over the past decade and more of working with CI/CD, I’ve encountered numerous pitfalls and picked up a few handy practices. For instance, tighter feedback loops make for happier developers. There's no substitute for a final, manual test, and no matter how good your CI system is, you always need an emergency option to bypass it!

I'll be sharing these insights and more in no particular order every Friday. Stay tuned for more stories and lessons from the trenches of CI/CD.

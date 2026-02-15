---
title: "Revisiting Jenkins after over a decade"
slug: "revisiting-jenkins-after-over-a-decade"
pubDate: 2025-05-23
description: "I've used a lot of CI tools over the years, but Jenkins was the first. I've not used it since 2015, so let's take a look at where it is now and what's different than I remember!"
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/a95dc464-927a-44e5-8a48-98c75937897a_1123x461.png"
  alt: "https://jenkins.io"
  caption: "https://jenkins.io"
---

[Jenkins](https://www.jenkins.io/) has been around since 2011, and I started using it late in 2012. Back then, CI tooling was a relatively new concept and the biggest choice I remember making was which side of the Hudson fork I was going to fall.

I stopped using Jenkins when I switched jobs in 2015, and since have been spoiled for choice for CI tooling. I’ve used TeamCity, GitHub Actions, CircleCI and dabbled with a couple of others in the past decade. But after talking with friends at a bunch of other companies it’s clear that there are plenty of Jenkins installations out there. High time for me to take another look and see what’s changed.

So I took a quick visit back to Jenkins-land, with a local install and a few code snippets. I didn’t do anything production-worthy, but managed to get some impressions on what’s changed over 10 years - assuming I can remember my early experiences correctly!

# Getting started

Setting up Jenkins used to involve starting a .war file on a server you’d configured yourself. Docker was just starting to gain some adoption and Kubernetes was yet to be released so for me, the server was a VM running on a Mac Mini.

Now there are a ton of options to run Jenkins, often with pre-canned scripts or managed packages. So for running locally, Docker seemed the best option for me to get started. The [instructions](https://www.jenkins.io/doc/book/installing/docker/) had a little faffing with DinD and building your own image, but only took a few minutes to get running.

Once I’d set up an admin account and installed the default plugins, I was greeted with a UI that looked familiar, but less dated than I expected.

![Dark mode aside, I’ve seen this before…](https://substack-post-media.s3.amazonaws.com/public/images/841d82b0-4fd7-45f8-98cc-ad592aad28cc_3438x1298.png)
*Dark mode aside, I’ve seen this before…*

While the layout and the general feel of the UI doesn’t seem to have changed since the early days, it’s clear there have been subtle updates to fonts and other styling that keep it feeling moderately fresh.

# Plugins are king

It’s clear that plugins are still the big draw for Jenkins, with almost all of the experience being customizable to a degree. Some of these, like the [Go plugin](https://plugins.jenkins.io/golang/), are similar to GitHub Actions (like [setup-go](https://github.com/marketplace/actions/setup-go-environment)) in that they provide hooks in pipelines for installing and interacting with tools and services. But others, like [Nested View](https://plugins.jenkins.io/nested-view/) make broad changes to parts of the UI.

The plugin community is still very active, with some receiving updates within the last day. Although plenty haven’t been updated in 10 years (with health scores to match).

![A screenshot of the jenkins plugin marketplace searching for "Go". There are a number of plugins returned with health scores varying from 48% to 99%, with a range of release dates.](https://substack-post-media.s3.amazonaws.com/public/images/31a03437-e120-4096-b5b7-d4bfeb7772db_1360x781.png)
*Some plugins are actively maintained, some less so*

Exploring a little, I found myself downloading multiple plugins that rendered pipelines just to see what was available. Having to restart aside, it was really easy to add a plugin, so I could imagine teams could find themselves with a ton of unused plugins after a while.

During the setup process, I initially accepted a set of “recommended” plugins. This included some user management plugins and a couple for rendering pipelines. But I later tried again without those suggestions and still had the ability to create a pipeline project, just without the same options for rendering it. Pipelines may seem like a pretty standard (some might say old hat) concept for CI/CD nowadays, but in the early 2010s, the default was just a set of sequential steps run on a single machine end-to-end.

# Creating projects

While we’re on the subject, there were quite a few options available for creating a project. They ranged from a basic project with a sequential set of steps, to full pipelines, and multi-branch configurations. I could imagine this being overwhelming to someone new to CI, and would be inclined to just suggest everyone start with a pipeline project. Since the real power that has been added since I last used Jenkins is the [Jenkinsfile](https://www.jenkins.io/doc/book/pipeline/jenkinsfile/).

In the early days, the Jenkins UI was the only way to configure your pipeline, what I’ve since heard called “ClickOps”. A little tedious to get started with, and worse if you wanted to adapt something you’d already done. The pipeline project type now defaults to using [Groovy](https://en.wikipedia.org/wiki/Apache_Groovy) to configure your pipeline, either via a UI-based editor or by loading the file from a source control repository.

One really neat thing you can do with this config is to use the dynamic mode to create stages based on parameters. So you could repeat or omit stages based on configuration.

```
node {
    def repeatTotal = 3
    def repeatCount = 0
    while ( repeatCount++ < repeatTotal ) {
        stage('Repeated step ' + (repeatCount)) {
            echo "Prep" + repeatCount
        }
    }
}
```

I’ve not had a lot of time to play with this, but it seems like you might only be able to pass in environment variables or UI parameters to this logic, but it is nice to be able to use a loop rather than learn some quirky YAML schema.

# An ocean of uncertainty

Any project as old as Jenkins is bound to have some legacy stuff floating around, and there’s a really interesting one in plain sight. A default Jenkins install will include the [BlueOcean](https://plugins.jenkins.io/blueocean/) plugin, which provides a parallel UI for Jenkins.

![The pipeline view in BlueOcean](https://substack-post-media.s3.amazonaws.com/public/images/d8454fa3-205d-4c2a-ac45-84b9c08da55e_1137x493.png)
*The pipeline view in BlueOcean*

This seems like a strange choice, and I’m still not entirely sure why a separate UI was necessary. Reading the docs I think it’s something to do with larger teams being able to provide a dedicated UI for developers separate from administrative functions, but I’m still not entirely sure.  
  
More confusing is this statement in the docs:

> Blue Ocean will not receive further functionality updates. Blue Ocean will continue to provide easy-to-use Pipeline visualization, but it will not be enhanced further. It will only receive selective updates for significant security issues or functional defects.

This suggests to me that BlueOcean may be on the way to deprecation, although it received an update in the past month, so is still being maintained. A bit of an odd state of affairs, that might make me spend a bit too much time picking my UI of choice.

# Conclusions

After this super-quick revisit, it’s clear to me that Jenkins is still a good option for self-hosting a CI solution. It may have a reputation for being dated, but didn’t feel quite so old when I loaded it up, and if you’re just looking to build a straightforward pipeline or two, it’ll more than do the job.

The flexibility of the plugin system seems like a double edged sword, though. While it gives options for customizing Jenkins in pretty much any way you can think of, you need to put the thought into exactly what kind of customizations you need.

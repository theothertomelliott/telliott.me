---
title: "Release with Reduced Risk: Canary and Blue-Green Strategies"
slug: "release-with-reduced-risk-canary"
pubDate: 2024-08-02
description: "Even with the most carefully prepared testing strategies, problems will slip through the cracks, let's look at some approaches that will reduce the impact of a bad deploy getting into production!"
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/5f3e61e4-168c-4b0e-bd7d-31e90afd61cc_6239x4159.jpeg"
  alt: "A blue-green canary. Photo by Marco Midmore on Unsplash"
  caption: "A blue-green canary. Photo by Marco Midmore on Unsplash"
---

In a [previous article](https://thefridaydeploy.substack.com/p/why-test-manually-our-ci-pipelines), I talked about the [Swiss Cheese](https://en.m.wikipedia.org/wiki/Swiss_cheese_model) model for risk management. A key take-away from this model is that no matter how good your testing is, there will almost always be a path for bad code to get all the way through your processes and into production.

You could try to plug all the holes, but at the end of the day, some things aren’t practical to test for. It’s easy to end up with minor differences between your production and pre-production environments that make it impossible to catch certain classes of problem. I remember at a previous job, we often ended up running different versions of third party tools across environments just because the process of upgrading was so laborious that it could be a few weeks between upgrading staging and upgrading production.

What you need is a way to minimize the exposure of your users to bad deployments, and a common way to do this is to stage your releases so that they first go to a small number of users, before being made available to everyone once you’re confident that everything is working as expected.

Two really popular strategies to achieve this are **Canary** and **Blue-Green** deployments.

# Canary

Canary deployments are named for the “canary in the coal mine”, an old practice to bring a canary into a mine as an early indicator of a build up of dangerous gases. If it wasn’t safe to be in the mine, the canary would die before the miners, giving them early warning.  
  
Canary deployments work on a similar principle - albeit with fewer concerns around animal cruelty. A small subset of your users are chosen to receive a new version of your code first, and their experience is observed for a certain period of time.  
  
If everything is good, you can then roll out the change to a larger number of users - possibly even going through several groups before reaching 100%. If something goes wrong, you can roll the change back and the majority of your users would never know anything went wrong.

# Blue Green

Blue-green deployment is similar to Canary deployment in that it involves exposing a small cohort of your users to a change first, but enables this in a slightly different way.  
  
In a blue-green setup, you would have two completely separate copies of your service, one designated “blue” and another “green” (or whatever quirky name your engineering teams want to give them). One of these will be serving production traffic, and the other will be in standby ready to receive a new version of your code.

Let’s say you’re currently serving production traffic from Blue. The deployment process might look something like:

1.  A new version is deployed to Green.
    
2.  5% of traffic is directed to Green.
    
3.  Telemetry is monitored for 15 minutes, and everything looks good.
    
4.  Another 5% of traffic is directed at Green.
    
5.  Repeat 3-4 until 100% of production traffic is pointed at Green.
    

Once this process is complete, Green is your production instance and Blue is a standby. The next deployment would use the same process, but the roles would be reversed.

# How to Implement

## Load Balancing

A key part of managing Canary and Blue Green strategies is your [load balancer](https://en.wikipedia.org/wiki/Load_balancing_\(computing\)). This will decide where requests are routed and as such, controls which of your users will be hitting the newer versions of your code. Load balancing software like [Traefik](https://traefik.io/) and CDNs like [Cloudflare](https://www.cloudflare.com/) or [Fastly](https://www.fastly.com/) support robust routing strategies that give you a wealth of choice in how you manage rollout.

If you’re using a Canary strategy, you may not need to make a significant change to your loadbalancer, as the natural balance of traffic across your service’s instances may already include the Canary instance. But if you wanted something more targeted, you could go as far as to route based on IP or user id so your employees were always the first to see an update.  
  
A Blue Green setup can be a little more complex, as you have to deliberately route traffic to the correct mirror. This could be done purely on a percentage of traffic, starting with employees or maybe even on a rotating basis so no user is in the “test” cohort every time.

## The Deployment Process

These strategies can be layered on top of most CI/CD pipelines with a little creative configuration. For example, I’ve seen Canaries implemented by having a single service represented by two totally separate deployment configurations using the same artifact, one of which is labeled as the Canary. The deployment pipeline was then set up so that the Canary service gated the full Production one.

However, these techniques are common enough that many platforms support them natively. Hashicorp Nomad has [built-in support](https://developer.hashicorp.com/nomad/tutorials/job-updates/job-blue-green-and-canary-deployments) for both strategies, and tools like [Argo Rollouts](https://argoproj.github.io/rollouts/) enable these patterns in Kubernetes, even doing the monitoring part for you!

# Which is best?

While these two strategies are similar in their end goal (and from the perspective your users), they come with their own advantages and disadvantages. So when asked to make a recommendation of one or the other, I have to use the classic cop-out, “it depends”.

Blue green deployments give you more flexibility in how you roll out to your user base, permitting much more fine-grained adjustments. And because the previous deployed version is retained in standby mode, you can quickly fail back even if something goes wrong after you’ve completed the rollout. This comes at the cost of having to duplicate the resources needed to run your application - potentially resulting in double the cost!

Canary deployments are typically cheaper to implement than Blue Green deployments, since you can often designate one or more pre-existing instances of a service to be the Canary during a deployment. Having a Canary instance of your service in the mix also adds some complexity to how your system behaves under stress. If you’re only dedicating one instance to the Canary, what happens if the server dies? And depending on your routing strategy, what happens to the Canary users if you have a sudden spike in traffic?

# Conclusion

In conclusion, while no testing process can completely eliminate the risk of bad code reaching production, deploying strategies like Canary and Blue-Green provide effective ways to minimize user exposure to potential issues. Both come with their strengths and drawbacks, and choosing the right strategy depends on your specific context. But when integrated with robust load balancing and CI/CD practices, both approaches can enhance the reliability and stability of your software delivery process.

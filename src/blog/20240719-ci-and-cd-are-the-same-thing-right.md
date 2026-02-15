---
title: "CI and CD are the same thing? Right?"
slug: "ci-and-cd-are-the-same-thing-right"
pubDate: 2024-07-19
description: ""
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/2350ed29-fa7f-4c40-994b-aa6b21b0e79e_3500x2333.jpeg"
  alt: "Photo by Pixabay"
  caption: "Photo by Pixabay: https://www.pexels.com/photo/dictionary-text-in-bokeh-effect-267669/"
---

CI/CD is a familiar term for many developers, but what does it really mean? In this article, we’ll be digging into the term, its component pieces and how they can work together, or separately.

You may hear the term CI/CD and think of build automation tools like [GitHub Actions](https://github.com/actions), or GitOps tools like [ArgoCD](https://argoproj.github.io/cd/). You might have visions of complex pipelines dancing in your head. These tools are part of the puzzle, but when you boil it down, CI and CD are practices that your organization can take advantage of to help engineers collaborate and get your code in the hands of your users more quickly and effectively.

## What is CI?

[Continuous Integration](https://en.wikipedia.org/wiki/Continuous_integration) is a practice of integrating changes to your source code on a regular basis to make sure that the codebase is always in a good state. For those of you working in an environment that practices CI, this may seem obvious, but prior to the term being coined in the early 90s, it was common for teams to work separately on changes for a long period of time. This would be followed by a potentially even longer period of bringing everyone’s changes together for release. A process that would be rife with merge conflicts and incompatible alterations to behavior.

In order to practice CI, you need a centralized code repository, likely some flavor of Git (other version control technologies are available). Any commit made to the repository should be tested prior to merging into a shared branch. It is highly recommended to automate verification of the code, which is where your typical CI tools come into play.

Adopting CI as a practice enables, and outright encourages developers to commit code more frequently, in smaller, more manageable chunks. This accelerates the whole team, and is a key contributor to metrics like Deployment Frequency - as [promoted by DORA](https://cloud.google.com/blog/products/devops-sre/using-the-four-keys-to-measure-your-devops-performance). The deployment frequency baton can then be picked up by CD practices.

## What is CD?

Confusingly, CD can refer to two similar, but distinct practices: Continuous Delivery, and Continuous Deployment.

[Continuous Delivery](https://en.wikipedia.org/wiki/Continuous_delivery) follows on from CI, in that it promotes development in short cycles, and requires that you can reliably release your software at any time. Code passes through a set of validations prior to release - as in the model we explored in my [previous article](https://thefridaydeploy.substack.com/p/why-test-manually-our-ci-pipelines).

As with CI, smaller and more frequent changes allow a team to move more rapidly, and make it easier to identify and address problems as they occur. This can result in higher reliability and a higher quality end product.

Continuous Delivery ensures that any commit that passes validation _can_ be deployed to production, but a human may be in the loop when making the choice to perform deployment of any given version of your code.

[Continuous Deployment](https://en.wikipedia.org/wiki/Continuous_deployment) picks up where Continuous Delivery leaves off and automates this final step, so any commit that _can_ be deployed to production is deployed automatically.

When referring to CI/CD, the CD may imply only Continuous Delivery, or both practices. It can be argued that Continuous Deployment cannot happen without Continuous Delivery.

# Should they be separate?

CI and CD are often conflated because they’re parts of solving the same problem: getting your code into production. But there are plenty of solutions out there that focus on one particular area. [ArgoCD](https://argoproj.github.io/cd/) and [Flux](https://fluxcd.io/flux/concepts/) are focused on CD almost exclusively and a typical installation will expect that you have your artifacts built and tested before they get hold of them.

Such tools promote the practice of [GitOps](https://www.gitops.tech/), which prescribes tracking the desired state for your environments in a Git repository. This state is monitored by automated tooling to automatically apply any changes. The state repo may be totally separate from your source repo and could be updated manually or automatically.

This creates a fracture plane between the building and testing of your artifacts (CI) and their deployment (CD). It also permits adopting a [pull model](https://www.gitops.tech/#pull-based-deployments), where your CD tooling is constantly watching for changes between your desired state and your live infrastructure.

Implementing the pull model makes it easier to handle drift, such as when someone makes a manual change outside of your CI/CD pipeline, and can also make it easier to deploy new environments - if you host your CD tooling within each cluster, they will start syncing by themselves! On the con side, this introduces a lot of moving parts to your architecture, with more moving parts to debug when something goes wrong. In an emergency, you may also _need_ manual changes to persist for a period of time, in which case the pull model could actively slow down your remediation efforts.

# Possible Challenges

CI/CD practices bring a number of benefits, but also can bring a set of unique challenges.

With full automation, it may take quite some time to go through your full suite of tests before deploying. This leaves engineers waiting for the processes complete and at best requires a context switch if they need to go back and fix something. At worst, by the time some bad code sneaks through the pipeline, the team may have gone home for the day. Cue the dreaded pager!

Depending on your industry, you may also have customers who don’t want frequent changes to your software. They may want to have someone manually verify and approve every change on their side, or require a dedicated instance of your software on a slower release cadence. This is common in highly regulated industries like Healthcare, Finance and Government. Meeting these requirements can add a significant amount of complexity to your CI/CD pipelines, and in some cases may require a totally separate process.

# Conclusion

In conclusion, CI/CD transforms software delivery by integrating and deploying code frequently and automatically. Continuous Integration ensures your code is always ready for deployment, while Continuous Delivery and Continuous Deployment automate the release process.

Though CI/CD has challenges like balancing rapid releases with thorough testing, adopting these practices enhances productivity and product quality. By embracing CI/CD, your organization can deliver value faster and stay competitive in today’s tech landscape.

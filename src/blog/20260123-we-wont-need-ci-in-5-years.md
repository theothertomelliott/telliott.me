---
title: "We won't need CI in 5 years"
slug: "we-wont-need-ci-in-5-years"
pubDate: 2026-01-23
description: "The way we build software is changing, and the way we deploy is going to have to change right along with it. What we consider to be \"good\" CI today may be very different from tomorrow's definition"
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/1e2d1a44-59d8-4728-bae1-a2c676384ce2_3500x2500.jpeg"
  alt: "Photo by Anna Tarazevich"
  caption: "Photo by Anna Tarazevich: https://www.pexels.com/photo/a-woman-in-a-futuristic-dress-posing-7651006/"
---

I’ve been thinking a lot about CI/CD over the last couple of years (and to some extent for [the last 13](https://thefridaydeploy.substack.com/p/a-12-year-journey-with-cicd)). Watching recent changes in the industry and recent huge shifts in attitudes towards AI generated code, it’s looking to me like time is running out for the current model of continuous integration. A few years from now, will we need to run pipelines on centralized infrastructure?

In its purest form, continuous integration makes a lot of sense. Frequently testing and merging small change to a codebase. It makes sure you catch problems early, and makes sure you’re always in a releasable state. But over the years, we’ve loaded up on “best practices”, automations and products. Nowadays, if you ask a typical developer what CI is, they’ll probably start with a list of brands like GitHub Actions, CircleCI and BuildKite. If you’re talking CD, they’ll probably mention ArgoCD (clue’s in the name!). Centralizing your CI efforts around a series of automated processes on shared infrastructure. It’s the default way, and until recently, I saw it as the only way.

When starting a new project, I didn’t really see it as “ready” until I at least had GitHub Actions set up. Even if I was the only one working on the project. The more I use AI tooling, the more I’m getting out of this mindset.

# A different experience

Swept up in a little social media hype, I gave [exe.dev](https://exe.dev/) a try. On the surface, it’s a super-simple VPS service. Fire up a VM, ssh in, build something! What’s really neat, though, is their coding agent, [Shelley](https://exe.dev/docs/shelley/intro).

![Shelley on mobile, showing off the fruits of its labors](https://substack-post-media.s3.amazonaws.com/public/images/f3412ef2-ae8d-468a-b1d3-78d68b32bb31_3146x2359.png)
*Shelley on mobile, showing off the fruits of its labors*

Similar to other coding agents, Shelley writes and tests code for you based on a chat session. It has a few nice bells and whistles, like showing you screenshots as it goes. What’s really interesting, though, is that everything happens in “production”. Coding, testing, serving: it all happens on a single box.

As a former corporate DevOps person, this initially seemed insane to me. Make a mistake (or miss a mistake the agent made) and you have an immediate outage!

On the other hand, the feedback loop is insanely fast. Asking for a UI tweak and seeing it “deployed” right away was incredibly satisfying. I didn’t even need to take the time to write the commit message! There had to be some middle ground here, a happy place somewhere between full, corporate, centralized CI and gung-ho agentic immediacy.

# What is centralized CI good for?

A team might have a bunch of goals in mind when setting up a centralized CI system. Some driven by reliability, some by security, some by compliance.

## Testing

Automated testing is a huge part of CI. Regression tests, load testing, smoke tests and even canaries. Teams want to have confidence that every change that makes it to production has gone through a testing process to reduce the risk of new bugs and breakages.

## Supply chain control

Code is not the only thing that can impact the behavior of an application. Third party libraries, OS versions, tools: they all contribute to problems like “works on my machine” debates, or even supply chain attacks.

Running “official” builds on blessed machines in a centralized CI system can help mitigate these concerns. Secure storage of artifacts like binaries and container images ensures that build results can be put into use in production quickly and repeatably.

## Human Review

AI makes mistakes, but so do people. Having a human look over everything is non-negotiable for most organizations. This can take the form of a PR process, manual promotion to production or something I’ve never seen before. As long as a second person is involved in making changes to production, the compliance team (and your tech lead) are probably going to be happy.

## Auditability

Following the process is just one part of the equation. You also need to be able to prove that the process was followed. Particularly if you’re involved in audit processes like SOC2. Clear logs in trusted storage are crucial to providing this proof.

# One possible future

Looking over the above challenges, I can see some overlap with the challenges emerging in AI assisted development.

AI code assistants already run a suite of tests as a matter of course, even extending them as they go. Some, like Antigravity, add an approximation of manual testing to each change.

We know AI can hallucinate, and attacks like prompt injection present a whole new surface to secure. This has parallels in the supply chain problem, and solutions range from human approval of every CLI command to fully sandboxed environments like exe.dev and Ona.

The nature of human review can vary depending where you land on the spectrum of vibes. You may read every line, you may just rely on demonstrations like interacting with the resulting application, or details of test results and follow up questions. But humans are still looking at something, and all of this can generate artifacts for review by a second set of eyes. Chat logs and incremental diffs can also be useful in auditing. At the very least, you’ll want to have a record of potentially sensitive commands that might have been run.

With all this overlap, we could see [SDLCs](https://www.geeksforgeeks.org/software-engineering/software-development-life-cycle-sdlc/) collapsing into dedicated, per application agents. Developers would write code, run tests, operate their applications all from chat interfaces.

![Distributed, agent-driven application development and operation](https://substack-post-media.s3.amazonaws.com/public/images/7fc12af6-82e4-4128-874c-b23f4c7954a5_2890x1005.png)
*Distributed, agent-driven application development and operation*

At the risk of overloading Kubernetes terminology, everything centers on a set of “operator” agents.

These agents would handle the whole lifecycle. Coding, testing and deployment. This all seems achievable with current models. A little further down the line? Throw some monitoring into the mix and you could have a self-healing, self-improving application!

Each agent is responsible for managing a set of application nodes for a single service. This allows for zero-downtime deployments, horizontal scaling and canaries. It also separates the operator from the production application for greater security.

When review and approval is needed from a second human, the agent would be responsible for obtaining this feedback. Do you need Git? Maybe you use something else to track changes and reverse mistakes. Alerts could trigger recovery workflows and alert humans as needed.

Rather than putting all of your builds, tests, deployments and operations into a centralized set of carefully-designed pipelines, each service gets its own CI system right next door that can quickly adapt to the specific needs of the application. Need to codify a particular workflow as the “right” way? Implement (or ask the agent to implement) it as a [skill](https://agentskills.io/home), with deterministic scripts as needed. Worried about security? You have control over the agent configuration, the secrets it has access to and how much of your network it can reach.

# Alternate futures

Predicting the future is always a gamble, so let me throw out a few alternatives to slightly increase my chances of being seen as a visionary by 2031.

If I’ve learned anything over the past few years, it’s that swapping out critical infrastructure is not an easy sell. Plenty of organizations have old Jenkins instances they can’t justify replacing, even after a decade and a half. So perhaps we would end up in a world where agents are more of a convenience layer on top of existing tools. Each developer has their own agents that work with their traditional, centralized CI, code review and monitoring tools, but can orchestrate previously human tasks to save time. Gathering review feedback, summarizing logs. Like today, but easier, and maybe (depending on who you ask) faster. Safer, but nowhere near as fun as up-ending everything we do.

Back to our operator model: doing “everything” is a tall ask, so we could also see an even more distributed model. Separate agents for coding, deployment, operations. A fleet of operators, each dedicated to a specific function, with the permissions and limitations to match. The human addresses the coding agent first, procures approval through a review agent, then interacts with the deployment agent to get their work into production. Or you throw yet another agent in the mix to operate the operators.

# What am I missing?

This is just a thought experiment, and the next half decade will see technical improvements, industry experience and disastrous outages that I can’t even imagine right now. You can probably think of a few areas I’ve not considered off the top of your head (migrations?). Maybe you’re picturing a totally different future. Let’s talk about it!

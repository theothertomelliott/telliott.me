---
title: "How much code *should* you review?"
slug: "how-much-code-should-you-review"
pubDate: 2026-03-06
description: "There's no escaping it, AI is writing a lot of code. Some great, some needing human intervention. But how to we focus our review efforts to catch the bugs without getting overwhelmed?"
author: "Tom Elliott"
image:
  url: "/assets/blog/20260306-how-much-code-should-you-review/cover.jpg"
  alt: "A man wearing an orange hard hat inspecting a large piece of machinery"
  caption: "Photo by Kateryna Babaieva: https://www.pexels.com/photo/man-wearing-orange-hard-hat-2760241/"
---
About a year ago, Andrej Karpathy coined the term "Vibe Coding" and kicked off any number of debates. Are you really coding if an AI assistant generates the code itself? Will terminal-based tools kill the IDE? What do we call...not vibe coding?

As I've been drifting between the extremes of purely vibed code and hand-crafted algorithms, I've wondered where the happy medium lies. Just how much of the generated code do I need to be reading to get a balance between speed and control? The more I think about it, the more familiar the problem seems. It's basically the same set of problems we face when reviewing code written by other humans.

Pretty much everywhere I've worked had a code review process of some sort. If you're going to get SOC 2 certified, it's pretty much table stakes. I've seen some teams average a week to approve a PR, others pairing to turn them around the same day. I've seen nit-picky stylistic assessments, and "looks good to me" on a 2000 line change. Much the same extremes as I've seen in myself when reviewing AI generated code.

So I got a little introspective and started thinking about how my approach to code review has changed over time. What it came down to lay on the axes of "interest" and "understanding". Is this code novel enough for me to require additional attention? And do I really know what's going on?

# Interest

When I started coding “professionally”, I quickly found myself writing the same code over and over. Simple CRUD operations, API definitions, config files. My work was split between interesting business logic and tedious boilerplate.

Like many engineers I sought out ways to reduce the boilerplate. Frameworks, templates and layer after layer of abstraction.
Some of it proved useful in lowering the cognitive load, some of it just introduced its own set of problems and complexity. But the end goal was always getting more done with less code. In the case of templates, there was still a lot of code in my own codebase, but it was all generated and I never felt the need to review it in much detail.

Having AI write code can often feel like generating it from a template. Ask for a skeleton of an RPC endpoint, and you'll probably get something that's pretty much exactly what you asked for. Hook it up to some backend code and you can quickly see if it works or not without reading all of it. 

Ask for a set of tests, and you can probably skim them to get the gist of what's going on. We're usually not too precious about the style of test code. It doesn't need to be super-optimized, it just needs to check the right things and make sense to someone dealing with a failure.

This making sense, of course, is key. Which brings us to the need for understanding.

# Understanding

Before AI, a new engineer starting their career usually didn't start by reviewing code. They'd be writing code and having more experienced engineers review it. I've often seen this lead to a certain degree of imposter syndrome when the time came for them to start reviewing code themselves. If you've only got a few months of real experience, how can you possibly catch issues as effectively as someone who's been coding professionally for a decade?

After a while, I came across a little trick to getting over this hurdle, and I've shared it with many engineers taking their first steps in reviewing their peer's code.

*Ask about anything you don't understand*

Ok, so you don't want to be asking for clarification on every line. It should go without saying that you need to do a little legwork. But there will usually be something that doesn't make total sense. It might be a clever bit of code golf, but it could be a bug! If you ask about it, the worst that will happen is you'll learn a little something.

Another useful approach is something I've seen a lot of people forget is possible when they're reading through a PR in GitHub.

*Run it!*

Check out the change, run the tests, maybe experiment a little to see what happens. There's a great GitHub extension in VSCode for doing just this. But the even better news is, if you're using an AI assistant, it probably wrote the code on your local machine, so it's waiting right there for you!

Even better, you can ask your assistant to run some experiments for you. You can also ask it to explain it's code in real-time to aid your understanding.

# Conclusion

I’ve uncovered quite a few subtle bugs written by AI. Inefficient logic, functions that only covered the simplest case, even authentication code that didn't actually check if the user was authenticated. I never found these purely through reading the generated code. Some of it I skimmed, some I asked the AI to explain, and some I discovered through experimenting. Which approach I used at any given moment was usually informed by the novelty of the code, and how much I trusted my own understanding of it.
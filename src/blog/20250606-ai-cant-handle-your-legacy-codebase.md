---
title: "AI can't handle your legacy codebase? This might be why."
slug: "ai-cant-handle-your-legacy-codebase"
pubDate: 2025-06-06
description: "While AI can be great to kick off a new project, it can struggle to get up to speed with large, preexisting codebases. Last week, I spoke with a group of fellow engineers about their experiences."
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/70db1067-ba3b-423c-9673-6c6444532ecf_7728x5152.jpeg"
  alt: "Photo by Willian Matiola"
  caption: "Photo by Willian Matiola: https://www.pexels.com/photo/industrial-skyline-at-sunset-in-duisburg-germany-29942606/"
---

At last week’s [NYC CoffeeOps](https://www.meetup.com/nyc-coffeeops/), myself and 12 other engineers were given the discussion topic:

> Is AI dev tooling less useful for brownfield projects than greenfield?”

We’ve all been bombarded with stories of people creating brand new apps from scratch without a day’s programming experience, and there are uncounted tools that promise to create whatever code you want from nothing. But what about when you already have a team of engineers and a sizeable codebase with plenty of history? Will AI tools live up to the hype in that case?

The ensuing debate was lively - about as lively as it was going to get for that time of the morning - and raised enough interesting points that I’d like to recount them (with permission) in this post.

# What is a “brownfield” project?

The terms “greenfield” and “brownfield”, like many others we use in software engineering, are, shall we say, _lovingly borrowed_ from another discipline. In this case, we lifted them from real estate terminology.

In that setting, [greenfield land](https://en.wikipedia.org/wiki/Greenfield_land) is undeveloped land that can be built on without much concern for what’s already there. So in our software engineering analogy, a greenfield project is one that doesn’t have constraints imposed by existing code - like a brand new product or side project.

On the other hand, [brownfield land](https://en.wikipedia.org/wiki/Brownfield_land) has previously been built on and subsequent development may have to address concerns such as pollution or pre-existing infrastructure. While most of us might not be so cynical as to refer to pre-existing code as “pollution” (I’m being very generous here), our analogous brownfield projects are project we do on pre-existing code bases where we have to be careful of existing patterns.

# Well, is it?

Now we’ve got our definitions nailed down we can get to answering the actual question posed.

We’re certainly not the only ones who’ve been asking this question and you may have seen Gergely Orosz discussing the same question on BlueSky:

<iframe src="https://embed.bsky.app/embed/did:plc:3n5xhy6vl7smssmwxq5wgqa6/app.bsky.feed.post/3lqac6aeysc22?id=006183898425579759" width="100%" height="400" title="" frameborder="0" scrolling="no"></iframe>

There was plenty of agreement, along with a healthy amount of disagreement in this thread. There were reports of large companies seeing minimal benefit from using AI tools on their codebases, and even startups seeing diminished returns after 18 months.

There was also [this post](https://www.linkedin.com/posts/bryan-finster_i-keep-seeing-posts-where-people-criticize-activity-7335290867852746752-tHDF) from Bryan Finster on LinkedIn putting expectations into perspective:

![](https://substack-post-media.s3.amazonaws.com/public/images/5db10ccb-027e-4112-844d-085d16704048_580x294.png)

Within our CoffeeOps group most of us agreed that AI was less effective on brownfield projects, but with a couple caveats. First, there’s the “exception that proves the rule” and with millions of developers out there, someone’s bound to be lucky. More hopefully, though, most of us had a few tips and tricks that we’ve seen help AI handle the challenges of large, legacy codebases.

# Challenges specific to brownfield projects

While sharing our war stories of how AI tools had burned us, a few common challenges emerged.

**Missing conventions** was probably the loudest complaint. Given a limited context window, it’s easy for an LLM to miss out on important information in your repo. Maybe you’ve amassed a library of helper functions specific to your area of business, or you have a UX component library you want everyone to use. Too bad, the LLM missed it and just reinvented everything for you, enjoy!

As a project evolves in production, it may become **unsafe to make changes**. Database migrations and API changes need to be backwards compatible. Moving a button or changing some text will immediately make your documentation screenshots out of date. This requires far more careful review of generated code.

Older repos may contain **old versions of dependencies**. If they’re old enough, your AI tools may start assuming they can use new functions that you don’t yet have access to. This can be particularly pronounced when using AI autocomplete, leaving you to clean up a bunch of build errors.

Finally, older projects may have **longer feedback loops**. Maybe the build or tests have become slow over time. Maybe you can only test certain features by running a set of dependent services. Even worse, maybe there are things you can only test by pushing a change into a staging environment. With tool use, some AI coders are able to run basic tests, but how will they know which testing process they actually need to run for their particular changes?

# When AI works well

While they may be less well publicized, we each found at least one task where AI could perform well on a large codebase.

**O**ne member of the group reported AI being very useful during incidents, when you could provide a specific error message for the tooling to track down. Once it had identified a specific area of your code to focus on, it could be very effective in explaining how you might have got into this state.

In a similar vein, AI can do a great job of explaining code, and by having it methodically describe your codebase a chunk at a time, you can build up very complete documentation. There are even tools designed specifically for this purpose that do a great job of thoroughly documenting projects, like [deepwiki.com](https://deepwiki.com/) from the folks at [Devin](https://devin.ai/).

# Tactics to help

It’s true that some folks have been successful, even if it was only on a particular task. Our conversation uncovered a few tactics that have served us well in working with AI coding tools.

**Learn to prompt effectively**. Many of the tips and tricks for better general prompting will serve you well when working on a brownfield project. Things like suggesting a “role” for the LLM to adopt, asking it to ask clarifying questions, and providing details of where to look for code to reference and edit.

**Give the AI smaller, more focused tasks**. Related to writing quality prompts, selecting an appropriate scale of problem for the AI to solve can greatly increase the chances of success. In particular, asking for a single, well defined outcome will avoid confusion, reduce the complexity of the solution and make it easy for you to review the generated code.

**Best practices for people often work for AI tools**. If you think of a context window as being analogous to a human attention span, tactics you may use to make code easy to understand and work with for people can also apply for LLMs. These can include breaking code down into shorter functions and files, adding descriptive comments and including readme files to summarize best practices for each section of the codebase.

**Create positive feedback loops**. Following on from the previous point, if you need more comments and documentation, why not get the AI to help you? Ask it to some of the refactoring or documentation tasks you might have been putting off, check it for correctness and you’ve helped out both humans and AI alike.

**Take advantage of rules files**. Tools like Cursor, Windsurf and Zed allow you to provide rules files that become part of the context. These files can be used to describe conventions to obey when working in your codebase. I myself have had a lot of success creating rules files to help with conventions and test steps for tools that might not have had much prominence in the training sets, like [Templ](https://templ.guide/).

# Conclusion

While AI can indeed struggle when working with large, pre-existing codebases, there are plenty of situations where it can still perform well. As with using any tool, applying it to more complex tasks just requires a little extra knowledge and skill from you, the operator. The more you work with these tools, the better you’ll understand what approach is most effective for your own codebase.

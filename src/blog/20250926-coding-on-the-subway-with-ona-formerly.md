---
title: "Coding on the subway with Ona (formerly GitPod)"
slug: "coding-on-the-subway-with-ona-formerly"
pubDate: 2025-09-26
description: "For years, I've been idly hoping for a decent option for working on projects from my phone. Ona's move to agent-based dev environments offers an interesting new option. But can it be a daily driver?"
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/9d7a74bd-fe3f-47fb-9b55-189a50fca93f_4897x3265.png"
  alt: "Background image - Photo by Matthis Volquardsen"
  caption: "Background image - Photo by Matthis Volquardsen: https://www.pexels.com/photo/black-metal-fence-2130508/"
---

Inspiration often strikes when I’m away from my laptop. I’ll finally hit upon a fix for the bug that’s been annoying me all week, and won’t be able to do anything about it until I get home. Extra frustrating if I’m taking public transit and have the time, but not the screen real estate.

So when I heard about Gitpod’s rebrand and [pivot into Ona](https://ona.com/stories/gitpod-is-now-ona), I started wondering how the mobile experience would stack up.

Up to the start of this month, Gitpod’s focus has been on enabling IDEs in the cloud, hosting developer environments with a default VSCode-based web interface. Handy for sharing config across teams and streamlining onboarding, less so for mobile coding.

With the Ona rebrand, they’re going all-in on AI, putting the chat interface front and center. Cloud environments and the web IDE are still there, but tucked into a sidebar. While you could still use your environments directly, the chat area will demand your attention, this is clearly an agent-first experience.

![New Ona desktop UI, with the editor tucked away to the side and AI chat front and center](https://substack-post-media.s3.amazonaws.com/public/images/86464242-d1b9-4da2-afec-594ad8b86cd3_3078x2270.png)
*New Ona desktop UI, with the editor tucked away to the side and AI chat front and center*

But I know how I like to code when I have my laptop. I was more interested in mobile, where the chat view is even more prominent, which, to be honest, really works for the form factor.

![A chat-only view in a mobile browser](https://substack-post-media.s3.amazonaws.com/public/images/9823bce3-e91c-4585-88c1-2a083e17a3bd_3862x3265.png)
*A chat-only view in a mobile browser*

# Sign up in a cafe, first PR on the subway

I’d heard the news and had been meaning to give Ona a try, and recently found myself sitting outside a cafe waiting for someone who was running late. I figured I might as well sign up to at least have an account ready and maybe even try a prompt or two.

I tried one of the default prompts to explain a repo, and after a short wait for setup and planning, got a pretty decent overview of my current project just in time for my coffee meeting to show up. Neat, but also familiar having used a lot of other coding assistants.

A little later, I was standing on the subway platform heading home and thought I’d try another prompt. This time, I asked Ona to review the GitHub issues on my project and pick one to implement. It ended up picking the most recent issue (how convenient), but the reasoning seemed sound, so I asked it to implement it, providing minimal guidance and no indication as to which files to edit.

The initial result was fairly decent, with the chat output showing the plan pretty clearly, and more importantly, code snippets of what was being changed that gave me just enough context to recommend alternative approaches.

At this point, I was on the train, with spotty cell service. Ona continued while I lost connection and the chat caught up as soon as I arrived in a station, just in time for me to fire off a prompt for the next tweak.

By the time I was home, I had [a PR](https://github.com/ocuroot/ocuroot/pull/92) ready to go. I’d like to think I could have implemented something similar by myself in a similar amount of time. But not while commuting home, it felt like I’d reclaimed 20-30 minutes that might otherwise have been dead.

I followed this up with a few more issues to get the hang of things. Some small tasks to see what kind of scope Ona could one-shot. I’ve not tried anything particularly large or complex as of yet, mostly because of personal preference. Working with other AI tools has left me eager to review the generated code as much as possible, which is easier for smaller commits - an eternally good practice IMO.

My second trial was a [quick fix for test portability.](https://github.com/ocuroot/ocuroot/pull/94) This was quite a bit simpler than the first one, and the code was pretty much correct in a single commit, except I had to prompt further to actually get a branch pushed. An object lesson in specificity, I guess.

Third up was a [fairly trivial UI change](https://github.com/ocuroot/ocuroot/pull/95). I didn’t specify anything about which files to edit, and Ona did an admirable job of tracking down the right place. But something went awry in the testing process and the commit ended up only including the generated _\_templ.go_ file, rather than the _.templ_ file that should have been included. Foolishly, I got complacent and merged without double checking, so ended up manually fixing the code after the fact. On the plus side, I knew exactly what to change after watching the chat, so it only took a minute.

Last example was a [more involved UI change](https://github.com/ocuroot/ocuroot/pulls), that included using a library to implement natural sorting of release lists. I was taking no chances this time, so opened the code up in Windsurf to run it myself before accepting it. This time I got exactly what I’d asked for, and a follow up prompt was just to expand the sorting to other types.

While this wasn’t a perfect experience, it was at least on par with other AI code assistants, and as I got used to this mode of working, I could see a clear improvement in the speed and quality of what I was able to get out of it.

Aside from the chat being fairly easy to follow, and providing clear indicators of progress, other highlights included clear, concise commit messages and a surprisingly broad range of IDE integrations (even for a company that’s been in this space for as long as they were as Gitpod). Commits created using Ona are also clearly labelled as such, a really nice touch to promote honesty and maybe encouraging coworkers to review PRs more carefully.

I’ve also come out with the sense that Ona is **not** a vibe coding tool. The workflows and feature set seem very much directed at working on pre-existing projects with varied approaches to testing and deployment. The emphasis is on working with code, rather than building a generic web app.

# The rough edges

Ona as a brand is still very new, so there are bound to be some areas in need of a little more polish. Nothing about the product seems rushed, but there are still a number of mentions of Gitpod floating around the documentation (and the app domain), and I came across some references to Gitpod Desktop, which appears to have been phased out entirely.

User-experience wise, I had a little trouble getting the VSCode integration working with it hanging on establishing a connection to the cloud environment, but Windsurf worked first time. Windsurf would be my preference anyway, but I might have missed the option if the default hadn’t failed.

Creating a PR from the branches Ona created was also non-trivial, as the environment seemed to be missing credentials to do so. Asking in chat implied this would be something that could be configured, but it would have been really nice to have this ability out of the box.

There was also a bit of a lag in adding credits to my account and the chat recognizing that I had credit available. More on the pricing model lately, but this was probably the most frustrating of the issues I encountered, since money was involved. Even though the lag was only about 5 minutes, the disconnect between the billing page and the errors I saw in the chat made it a very annoying 5 minutes.

One huge challenge when evaluating AI-powered tools is separating problems with the tool itself from behaviors common to anything using the underlying model. Pretty much any AI coding tool is subject to over-enthusiastic language like “Perfect!” and sycophancy - “You’re absolutely right!”.

That said, I did encounter an issue with the chat and code generation that did appear related to how Ona manages context. When following up on my first PR to address additional comments, I saw a step labelled “Compacting conversation memory to manage context window”. After this, Ona seemingly forgot the structure of the tests used to verify the changes it was making, reverting to running go tests rather than the scripted end to end tests. I can’t say for sure it was down to the compaction, but that seems like a strong smoking gun, suggesting that longer exchanges may need a fair bit of babysitting.

# What does it cost?

Individual LLM requests are fairly cheap, but the tokens can really add up when you’re working with code. So no evaluation of an AI coding tool would be complete without a discussion of the price.

Ona offers a free tier with $10 of credit. This credit is converted to “OCUs”, which is a combined measure of LLM usage and the compute for your environments. The latter means that Ona will be naturally a bit more expensive than tools that run in your local IDE. The different tiers have clear comparisons in terms of cash, a nice way to help compare your experiences on the Free tier with what you’d get in Core. At lower volumes, an OCU costs $0.25, with a 10% discount once you reach $500/month. All that said, how OCUs are mapped to compute/LLM usage is a bit opaque, making it hard to predict cost.

My first PR ended up using ~20 credits ($5), while the second one used ~5 ($1.25). There were a number of different factors that could have contributed to this. I was far more deliberate in my prompting with the second PR, resulting in less back-and-forth. The first PR was written while travelling, leading to longer gaps between prompts and thus a longer-lived environment using up credit.

The numbers above are deliberately vague, as they’re based on viewing the billing page between each requests. It seemed to update pretty quickly, which was nice, but it would have been even better to see the credits used by each conversation directly.

Without being deliberate in your usage, it would be easy to burn through credits pretty quickly - even with care the initial $10 only lasted me a couple of days. That said, I was pretty happy to subscribe to the $20/month tier after this. Seems very much worth it to have the option to set agents running on some simple tasks and walk away. The thought of addressing a new bug on my way home from a demo also seems very appealing. The $100 of extra credit for signing up in September was also a nice bonus.

# Will I keep using it?

As a solo developer, I don’t see Ona becoming a daily driver for me. It’s comparable to other coding assistants, but quite a bit more expensive than a local solution.  
  
This cost does bring a mode of working that I’ve wanted for a long time. For emergency fixes when I’m away from a laptop, rapidly acting on a flash of inspiration, or keeping multiple threads going at once, it’s a great tool to have in my back pocket.

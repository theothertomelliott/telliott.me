---
title: "Why I prefer running internal support in Slack"
slug: "why-i-prefer-running-internal-support"
pubDate: 2024-10-25
description: "When you're running an internal engineering team, support will be a key part of your job. My preference was to run all of this in the open, in Slack. Let's talk about why!"
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/114b59f1-3c1b-4f35-9450-6a9f14e325f3_5079x3386.jpeg"
  alt: "A team of people with phone headsets"
  caption: "A team of people with phone headsets"
---

_This article is an expansion on a small segment of a talk I recently gave at [Platform Engineering New York](https://www.meetup.com/platform-engineering-new-york/events/303678239). The full set of slides are available [here](https://docs.google.com/presentation/d/1woorPCwwGq6vLqB4qTCpLHg4mUs5HuW_x9_bnrGN_Dc/edit?usp=sharing)._

When I was working at [Yext](https://www.yext.com/), I led their Engineering Productivity group, providing tooling and processes for up to 300 engineers. These engineers were spread across a number of departments, and more importantly, could have very different levels of experience and knowledge of specific technologies. This meant that support was one of our most important functions. We’d need to be able to help out when things went wrong, guide teams with use cases we’d never anticipated, and - let’s be honest - field questions from people who hadn’t read the docs.

Despite it’s importance, support work doesn’t exactly have a glamorous reputation. Some of you who’ve been around a while may recall the [BOFH](https://en.wikipedia.org/wiki/Bastard_Operator_From_Hell), the IT Crowd, or have heard terms like [PEBCAK](https://en.wiktionary.org/wiki/PEBCAK) (I guess “skill issue” is a more modern equivalent). So I had a real concern about support becoming a dreaded task and an unpleasant experience all around.

My theory was that the most frustrating support experiences (on both sides) were the ones that were _private_ and/or _impersonal_. Being trapped in a ticket with someone who isn’t understanding you, or receiving a templated response in a forum. So we ran in the opposite direction, trying to make our support as _public_ and _friendly_ as we could.

Yext already had a pretty positive Slack culture, so it seemed like a very natural place for us to start. We created the #help-sre channel (more about that naming in a [previous article](https://thefridaydeploy.substack.com/p/why-you-shouldnt-call-your-platform)), and invited the whole engineering team. Anyone could post a question, and anyone could contribute a reply to the thread.

# The wisdom of the crowd or; the power of peer pressure

Pretty quickly, we saw the benefits of getting all of our support out in the open. Firstly, because everyone could see every question being asked, it was easy to see if someone had recently asked the same question - a good way to avoid us being overwhelmed during an incident. Not only that, but we could easily link back to older questions if they popped up again, and surprisingly, people outside of our group started doing this for us!  
  
This highlighted a really nice side effect of getting our support out in the open, the channel started to form its own norms and etiquette. There were examples of good and bad questions to guide people in crafting their own asks, and members of the channel would give each other friendly nudges to provide additional information.

There were limits, of course, Slack by nature doesn’t show you much history, and search isn’t necessarily someone’s first port of call when they want to ask a question. So we relied pretty heavily on someone recalling that there was a thread that already answered a particular question - which happened more than we expected once the channel reached a critical mass.

# Fun with emojis

[Emoji reactions](https://slack.com/help/articles/202931348-Use-emoji-and-reactions) were (and probably still are) hugely popular in Yext’s internal slack. You’d be able to gauge the popularity of a post based purely on the number of reactions, and team members added hundreds of custom emojis over the years. I remember a certain sense of pride when someone made a custom emoji of me, like I’d “made it” in the company.

We found a [blog post](https://slack.com/blog/productivity/some-of-the-ways-we-use-emoji-at-slack) that outlined some ways that Slack used reactions internally and ran with it. In particular we started with:

-   👀 (:eyes:) to show someone was looking at a question.
    
-   ✅ (:white\_check\_mark:) to indicate that a question had been successfully answered.
    

The eyes emoji was probably my favorite, as it helped us build trust. When you’re dealing with a support request, it seems like you should put all your energy into finding a solution, but this takes time. During which time the person you’re helping has no idea if anyone’s doing anything at all. Using eyes was a quick way to indicate that we were working a problem, and also showed _who_ was working on it.

We quickly found that the channel started gaining its own personality as more patterns of reactions started being introduced by the community. If more than one person was experiencing a problem, a flurry of [ditto](https://slackmojis.com/emojis/9425-ditto) emojis would quickly appear. A little bit of fun for sure, but also a great way for us to get a read on what was happening for the team as a whole.

# Dealing with DMs

When providing support to your coworkers, it’s inevitable that some people will try to bypass the “official” routes for getting help and try to come to you directly. Maybe they have a question about your area of expertise and know you will be able to answer quickly, perhaps they’re worried that their question is “stupid” and want to ask a friendly person privately. Whatever the reason, I created a policy for myself.

**I would never give support in DMs.**

No matter who it was, even if I knew the answer immediately, I would always redirect people to the public channel.

I was nice about it of course, and always made sure to explain my reasons. “Great question! I bet a few other people are having that problem. Can you ask that in #help-sre so we can share the answer with everyone?”. This was rarely a problem, and they could just copy-paste the question.

Once I’d got comfortable with this approach, I asked the team to do the same. After a while, the DM questions pretty much dried up, and we had a thriving public support channel.

# Conclusion

Putting our support operations in Slack helped us create a really positive experience for us and the teams we served. We even had other teams asking for tips on how to run their own help channels!  
  
Have you tried this for your own internal support? Did you use Discord instead? What benefits and challenges did you experience? I’d love to hear your thoughts in the comments.

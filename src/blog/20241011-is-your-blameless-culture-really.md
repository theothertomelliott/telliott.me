---
title: "Is your \"blameless\" culture really blameless?"
slug: "is-your-blameless-culture-really"
pubDate: 2024-10-11
description: "It's a common refrain in the SRE world that postmortems must be blameless. But why is this important? And how can you make sure you're doing it for the right reasons?"
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/78a4fe45-e1ef-426a-8473-83d1d655ab2c_5707x3805.jpeg"
  alt: "People pointing fingers at a stressed woman"
  caption: "People pointing fingers at a stressed woman"
---

I’m sure many of you have sat in a meeting where it seemed like everyone was trying to shift the blame.

“This wouldn’t have happened if the infra team had noticed the warnings sooner.”

“Well, the dev obviously didn’t run this test before shipping.”

The conversation goes around in circles, tensions run high and it doesn’t seem like anything’s getting done. This is where you feel the need for a _blameless culture_.

# What is blameless culture?

At it’s core, a blameless culture (most often associated with the postmortem process) is a policy of not trying to attribute fault to individuals, but instead to identify systemic root causes that can be addressed practically.

Let’s say you have a tool to remove servers from a loadbalancer for maintenance, and Bob took _everything down_ when using this tool. It would be easy to chalk everything up to Bob’s mistake, reprimand him and move on. But in a blameless culture, you dig deeper, and find that the tool will default to removing all servers if a specific set is not specified. It would only be a matter of time until someone made the same mistake again, so you update the behavior to require manual confirmation if you omit the flag.  
  
We’ve probably all heard the story of the intern who [accidentally deleted the production database](https://www.reddit.com/r/cscareerquestions/comments/6ez8ag/accidentally_destroyed_production_database_on/). General consensus in the comments is that the problem was that it was even possible for an intern to do this in the first place. Ironically, a lot of blame ends up directed at the CTO for not having a blameless culture.

# Where does it come from?

My first exposure to the concept of a blameless culture came from [Google’s SRE Book](https://sre.google/sre-book/postmortem-culture/), but (as with many things in the SRE world) the concept was borrowed from aviation. In an industry where mistakes and failures are life-threatening, it’s critical to ensure that all problems are followed up and effectively addressed. Here a blameless culture is key to providing the psychological safety necessary for people to speak up when they see something is wrong.

This is what it’s really all about, making sure that the team can have a productive conversation when something goes wrong: everyone feels safe to provide as much information as possible, and the focus is on solving the systemic causes rather than finding who was most at fault.

But it’s easy to lose sight of the reasons for adopting a blameless culture, and I’ve seen teams fall into a few different failure modes when this happens.

# Failure mode 1: “It was human error”

This is probably the most common mistake I’ve seen teams make when trying to embrace a blameless culture. They take it at face value, and as soon as they see a place where a person made a mistake, they don’t really dig deeper.  
  
This can manifest in postmortems as a root cause of “human error”, and follow up actions like “we’ll take more care when deploying this service”.

A worse manifestation is when any discussion of someone making a mistake is shut down, so you never actually explore the root cause at all. “This is a blameless culture, we can’t talk about what Chuck did.”.  
  
It can be uncomfortable, but having a blameless culture means you’re ok with digging deep into the underlying causes of human mistakes, and finding ways to prevent them from happening again _without_ expecting people to get it right all the time.

# Failure mode 2: “We need accountability”

When you have a well-established blameless culture, you may notice management higher-ups getting concerned about a perceived “lack of accountability”. They may see that Alice made a mistake resulting in an incident and ask why she isn’t experiencing any repercussions.

This can be particularly frustrating if you know that Alice was just in the wrong place at the wrong time - I’m reminded of the line from Apollo 13: “If I'm in the left-hand seat when the call comes up, _I_ stir the tanks”.

It’s important to recognize that no blame doesn’t mean no accountability. If someone bypassed three separate warnings about a potential destructive action, they probably weren’t executing good judgement. But if the warnings could be bypassed by including a CLI flag that was in every example in the documentation, the problem is more systemic.  
  
Patterns can also emerge. If one person consistently makes mistakes resulting in incidents, there is likely a problem with that person. If the same mistake is frequently made by many different people, you have a systemic issue to fix.

This is a fine line to walk, but if you’re diving deep into the real root causes of issues, you’ll have the evidence to show you which side of the line you’re on.

# Failure mode 3: Casual blame

If you successfully adopt a blameless culture where people feel safe to speak up, you may see blame being thrown around as a joke.

In a previous job, we had the “build breaker” hat. If someone broke the build, they would have to take the hat until someone else earned it. This was very lighthearted - most people just placed the hat on their desks and didn’t say much about it.  
  
This may seem like a healthy, fun part of office culture, but it requires everyone to be bought into it and see it for what it is. It would be very easy for someone to be hurt by having attention drawn to their mistakes for a prolonged period.

A better alternative I’ve heard of is “failure Fridays” where teams _voluntarily_ present learnings from things that went wrong.

# Conclusion

Adopting a blameless culture can help drive you towards more effective root cause analysis and more practical, long-term solutions. It’s important to never lose sight of the fact that people can and do make mistakes. To err is human (to err != nil is Gopher).  
  
We can’t shy away from talking about these mistakes, we need to look below them and carefully consider the why behind them. Only then can we craft solutions to blunt the impact that these mistakes can have.

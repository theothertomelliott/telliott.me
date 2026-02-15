---
title: "A Year of the Friday Deploy!"
slug: "a-year-of-the-friday-deploy"
pubDate: 2025-07-04
description: "My first post on this blog was June 28th, 2024. Let's take a look back at the past year of writing about CI/CD, DevOps and a little AI."
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/c0f79068-cabf-425f-a71b-407e96bbd4d3_3000x2000.jpeg"
  alt: "Photo by Marina Utrabo"
  caption: "Photo by Marina Utrabo: https://www.pexels.com/photo/lighted-candles-on-an-elegant-looking-cake-1729808/"
---

Last summer was a big time for me. I left my job to build my own take on CI/CD tooling, [Ocuroot](https://www.ocuroot.com/). I started posting weekly here on the Friday Deploy. I also turned 40, which might have had a lot to do with why I did the other two. So now seems as good a time as any to reflect on the past year of writing!

I’d tried my hand at blogging a couple of times before, but always had trouble being consistent. Not just consistent in terms of posting regularly, but also in subject matter. So this time I had a real goal, I wanted to focus on CI/CD, and I wanted to keep to a regular posting schedule. The former was all tied in with Ocuroot, and seemed like a good way to keep my knowledge and opinions front of mind. The latter was just so I didn’t go months between posts!

I’ve deviated slightly from both of these goals, but feel like I’ve kept with the spirit of things. Now might be a good a time as any to reset a little, and either get back to my original goals or find a newer direction. So let’s look back on the past year and see where my chain of thought leads me next!

# Pick of the posts

My most popular post by far was [My 6 months with the GoTH stack](https://thefridaydeploy.substack.com/p/my-6-months-with-the-goth-stack-building). This post gathered more than double the views of any single posts, and even a few likes for good measure. I can think of a few reasons why it proved (semi) popular. It talks about something practical that readers could apply themselves after reading. It presents an alternative for front end development that some Gophers may have been seeking and not heard about before. But more importantly, I posted it on [/r/golang](https://www.reddit.com/r/golang/) and it wasn’t about AI…

Significantly less popular, but plenty of fun to make was the only video post I’ve put out there: [Build a website with an AI assistant in 10 minutes](https://thefridaydeploy.substack.com/p/build-a-website-with-an-ai-assistant). Granted, posts on this topic are ten a penny these days, but making a “live coding” style video was plenty enjoyable. I really should do more of these, but they’re definitely more effort than the written word.

Finally, the infamy of being my least read post goes to [Break glass in case of emergency](https://thefridaydeploy.substack.com/p/break-glass-in-case-of-emergency). This was my second post, and while I was still finding my style at this point, I was also dual-posting to LinkedIn, so never really promoted the SubStack version much. A good reminder to myself that there’s nothing wrong with reposting after a few months.

# Chasing views

It’s probably not lost on anyone that “build it and they will come” is a fallacy, most especially online. Having quality content helps, but you need to put in the work to get it in front of people.

My success here has been pretty modest. A typical post with minimal promotion (repost on BlueSky and LinkedIn plus SubStack emails) will get about 100 views over the first few days. Not nothing, but not stellar.

If I see a good fit for a Reddit community, I’ll also post there, which makes a huge difference if I get it right. Aside from following the written rules for each subreddit, they each have their own culture and goals. If your post doesn’t line up with what their members are looking for when they sign in, you get ignored pretty quickly, and maybe worse, downvoted.

Occasionally, I’ve had a nice surprise when someone saw my writing and posted a link on one of their communities, creating a new line on my referral stats. A couple of times, someone reposted me to HackerNews, although I never really garnered enough upvotes to make much of an impact. [SRE Weekly](https://sreweekly.com/) has also picked up a few of my posts, which I’ve always very much appreciated.

While we’re looking at referral stats, the number of “direct” views has always surprised me, consistently being attached to the largest slice of views. This isn’t just the case on SubStack, but I’m also seeing it in stats for other sites I run. I since learned that sites can set [Referrer-Rolicy headers](https://web.dev/articles/referrer-best-practices) to control how much of a URL (if any) is sent in the referer header. I think there’s also a user-specific setting at play as well, since based on timing and the typical patterns, I can can see that only a fraction of viewers from Reddit are likely being attributed.

One source where I’ve seen surprisingly little traffic has been from searches. Granted, I can’t be 100% sure because of the referral issue above, but most of my posts are going through a pattern if a burst of views over a week or two, then nothing. Comparing this to some of my [older posts on Medium](https://medium.com/average-coder/how-to-debug-a-running-go-app-with-vscode-76e3eac45bd), which still see a few views every week through search, it makes me wonder if the SEO on SubStack is a bit off. Of course, this could be a content thing, but the platform doesn’t really give me much insight on how I could do better here.

Over the past 6 months or so, SubStack have really been pushing themselves as a complete social media platform, with a feed of short “notes” being the first thing you see on their front page. At first, the notes were all people promoting their own newsletters and comparing subscriber counts, but I’m now seeing a little more “natural” posting there. That said, I really don’t want to be devoting a lot of time to yet another social platform, so I may be limiting my potential for growth through SubStack itself.

# Finding subscribers

Speaking of growth. I’ve slowly amassed 109 subscribers, who’ve trickled in throughout the year. I’ve been pleasantly surprised by how attentive my subscribers have been, with my posts typically being read by ~50% of them. Given the amount of email I ignore, this feels like a decent number to me! This is assuming that the number is showing what I think it is, of course…

Of my 109 subscribers, 29 of them came from recommendations from other SubStacks. I’d like to thank the 4 SubStacks that have recommended mine: [Citizen’s SubStack](https://itcantbepeople.substack.com/), [In Lehmann's Terms](https://inlehmannsterms.substack.com/), [Reliability Engineering](https://thereliabilityengineering.substack.com/) and [M.I.S.S.I.O.N. Coaching](https://missioncoachingprogram.substack.com/).

# Going bi-weekly & Scope creep

Initially, I was posting to the Friday Deploy on a weekly basis every, well, Friday. The eagle eyed amongst you might have noticed that 45 posts is less than 52. This is because I went bi-weekly a few months ago. That’s not to say I wasn’t posting, every other week I post to the [Ocuroot blog](https://www.ocuroot.com/blog). Writing a post a week takes a decent amount of energy, and writing two posts amongst everything else I was doing for the business was a bit too much.

I’ve also strayed a little from my original focus of CI/CD, opening up to broader DevOps topics and a little bit about AI coding. As it turns out, posting specifically about CI/CD every week was going to be more of a challenge to keep up than I expected. I’ve also come to the opinion that CI/CD itself is probably too narrow a topic overall. The concept of CI/CD itself is a subset of release management, which can be seen as a small part of a broader SDLC. I also don’t like the idea that the job is “done” after we’ve deployed. Five years of managing incident response should have taught me better.

# What’s next?

For the time being, I’ll be keeping up the same cadence and focus that I’ve had over the past year, alternating between the Friday Deploy and the Ocuroot blog. I am, however, considering a move away from SubStack.

I have some ideas for some more interactive content I’d like to create that really doesn’t fit with a WYSIWYG platform, and have to admit I’d like to have a little more control over things like SEO and social cards.  
  
If I do move, I’ll probably continue cross-posting at least the bulk of my writing to SubStack, and I’ll be sure to share notes or shorter posts to point to anything I make that doesn’t fit here. In the meantime, I’m on [BlueSky](https://bsky.app/profile/telliott.me) and [LinkedIn](https://www.linkedin.com/in/telliott1984/) as well and always excited to make new connections!

---
title: "Reflections on the Crowdstrike Outage"
slug: "reflections-on-the-crowdstrike-outage"
pubDate: 2024-07-26
description: "A week on from the global IT outage, what lessons can we as software developers take from it?"
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/222cc3fb-bde8-4af2-841e-a8742d447f3c_4564x3712.jpeg"
  alt: "Photo by Pixabay"
  caption: "Photo by Pixabay: https://www.pexels.com/photo/grayscale-photo-of-people-standing-near-the-wrecked-vintage-car-78793/"
---

We’re now a week out from the global Crowdstrike IT outage. There’s been a lot of discourse online about it, and blame directed at everyone from Crowdstrike themselves, Microsoft and even the EU. But putting aside the (justifiable) anger that something like this could happen, what can we learn from it?

It’s hard to have missed what happened [last Friday](https://www.bbc.com/news/articles/cpe3zgznwjno), with millions of devices disabled, flights grounded and even hospitals left struggling, it was one of the largest outages in the history of computing. Hot takes immediately dominated social media, with varying degrees of frenzy and accuracy. The best content I’ve seen so far is Dave Plummer’s excellent [deep dive](https://www.youtube.com/watch?v=wAzEJxOo1ts) on the nature of the problem and his [follow up](https://www.youtube.com/watch?v=ZHrayP-Y71Q) a few days later.

The dust has settled a little now some time has passed, although Delta aren’t entirely out of the woods. More importantly, Crowdstrike have published their [preliminary postmortem](https://www.crowdstrike.com/falcon-content-update-remediation-and-guidance-hub/) on the incident. So now we have a more official overview of what went wrong, we can draw some conclusions without having to make too many assumptions (I say, hopefully).

# What actually happened?

At 04:09 UTC on Friday July 19th, 2024, Crowdstrike released a config update for their Falcon Sensor. The file in question was corrupted, apparently consisting of all zeros. This resulted in the Falcon Sensor running on Windows causing the OS to crash. Restarting also resulted in a similar crash, totally disabling affected devices.

At 05:27, the problematic update was reverted. The timing here is noteworthy, about an hour and a quarter between the update going out, and it being reverted. Almost certainly not an automated response, but not too bad for a human team responding overnight (assuming this was a team in Texas). This required some kind of report of failures being received quickly, the correct people being mobilized and then identifying the cause of the problem and a short-term resolution.

Crowdstrike subsequently published workaround instructions to fix affected machines manually.

# What was the root cause?

As with pretty much any incident, a number of factors had to occur in tandem to create the impact that we saw. Using something like the [Five Whys](https://en.wikipedia.org/wiki/Five_whys) method, with a little forking here and there, we can dig into the problem to build up a list of these factors.

The Falcon Sensor caused Windows to go into a crash loop on millions of machines.

Why did it cause a crash loop? A bad file update was received that the driver could not handle, and the driver running in kernel mode meant that Windows had no option but to crash to prevent further harm. The Falcon Sensor was a required driver at Windows startup, so the failure was repeated whenever the machine restarted.  
  
Why was the driver running in kernel mode? Security applications like Falcon have to run in kernel mode to provide enough access to low-level events to detect potential breaches. In this case the data file was also processed in kernel mode rather than passing findings to a separate, safer application.

Why does Falcon process the data in kernel mode rather than passing to another application? This is speculation on my part, but Crowdstrike may have wanted to avoid having a necessary part of the Falcon package be easily disabled. Keeping everything in a required kernel driver would prevent someone disabling it.

Why might someone want to disable Falcon? IT teams often install software like Falcon on all company-managed devices and this can cause actual or perceived performance problems for intensive applications. So some employees may want to disable an application that’s using up a lot of resources.

Why did Falcon crash on a bad config file? Somewhere in the code that processes the config file, a check was missed, or an error case wasn’t handled. This scenario was not covered in automated testing, both within Crowdstrike and Microsoft’s own certification process for kernel-mode drivers.

Why was a bad config file update published in the first place? A bug in the testing process resulted in the file in question passing tests when it should have failed. The final package did not undergo manual or canary testing before being released to the broader customer base.

This makes for a long list of contributing factors, and isn’t by any means comprehensive. If any of these had played out differently, it’s likely that the outage would have been much smaller in scope, if it would have happened at all.

# Non-Lessons

A common refrain that (serious or not) popped up pretty immediately in the wake of the outage was “don’t deploy on Fridays”. Wherever you fall on this particular debate, it doesn’t really apply in this case, since the deployment itself went out Thursday night, or early Friday morning, and given the turnaround time for an initial fix, people with the appropriate expertise were clearly available to address the problem. Granted, there were IT folks who sadly had to work the weekend to actually recover affected devices, but given that the impact is still being felt a week later, it’s unlikely that this could have been avoided even if the update was pushed a day or two earlier.

There has also been a lot of talk about “single points of failure” and the dangers of farming out responsibility to large companies. But this must be compared to other failures we’ve seen in the past. I’m reminded of [Facebook’s 2021 outage](https://en.wikipedia.org/wiki/2021_Facebook_outage) that took out pretty much all of their services as a direct result of them running things in-house. Suffice to say, taking direct control of your internal software won’t prevent this kind of problem, but would reduce the blast radius to within a single company. If you’re the company in question, that doesn’t seem like much of a benefit to you, unless your goal is avoiding having to [testify to Congress](https://apnews.com/article/crowdstrike-tech-outage-microsoft-windows-falcon-8fe725037ab975e011b2cfad67b17c0f). This limitation impact must also be weighed against the likelihood that doing everything in house spreads your engineering efforts pretty thin and may well increase the chances of a serious outage. Not to mention the cost of staffing.

# Lessons

Crowdstrike is committing to an overhaul of their testing and deployment mechanisms, as well as a programme of third-party validation. I’d like to dig into a few of these in particular.

## Implement a staggered deployment strategy

This goal involves deploying changes first to a canary, and then to a few customers at a time, allowing the process to be stopped quickly if a problem is detected, minimizing the impacted users.

This was a recommendation I saw touted a lot as the news broke, usually along with shock that this wasn’t already a practice. So why might they have architected their deployments without what seems to be a key best-practice? It’s possible that specifics on that will never emerge from the corridors at Crowdstrike (or the engineering team’s circle of friends), but I can imagine a few reasons:

-   Since the problematic update was a config file, it may just be the case that nobody considered that such a file could cause a problem this serious, and the existing testing would be sufficient.
    
-   Identifying the guinea pig customers is non trivial. Who would volunteer to be in the first wave? Even if you randomize you could still bring down a hospital.
    
-   Adding canaries and phased rollouts takes time. The longer it takes to get the updated data out, the longer customers are vulnerable to whatever you’re protecting against. The media were already warning that systems would be vulnerable to attack during the time the updates were re-published.
    

Weighing those and other factors against the cost of implementing phased rollout I can understand why they may have chosen to prioritize other things. Of course now, hindsight being 20/20, it’s painfully clear that this wasn’t the right decision.

Suffice to say, if you can take advantage of this practice, it will pay off, even if it’s hard to tell, after all, how can you demonstrate that an outage _didn’t_ happen?

## Provide customers with greater control

This goal would allow customers to be able to select how and when updates are deployed to their devices.

This is an ask I’ve seen quite a lot for B2B. You have a large customer who - for good reason - may be risk-averse or sensitive to change and they want to be able to control the frequency of changes to the software they use.

## Local developer testing

Having recently written about the [importance of manual testing](https://thefridaydeploy.substack.com/p/why-test-manually-our-ci-pipelines), I feel compelled to repeat the message a bit. If you have an opportunity to manually verify your changes when they’re ready to go out, or shortly after, it’s well worth doing.

## Stress testing, fuzzing and fault injection

I’ve been skeptical about the value of fuzz testing in the past, and will admit that I’ve never really employed it in a serious way. In retrospect, it’s pretty obvious to me where the value is. If a malformed input can get into your system, handling it gracefully is way better than crashing.  
  
I’ll also admit to being a little gung-ho about crashing, preferring to exit quickly and allow services to be automatically restarted to recover. This is fine when the impact of such a crash is short-lived and contained (maybe a few users see an error or their batch job takes longer than usual), but dealing with critical infrastructure is another story, even if you manage to avoid the dreaded crash loop.

# What are your thoughts?

When all’s said and done, this is a complex situation and much like the rest of the reporting out there, I can only scratch the surface with a single article. But that’s the beauty of the comment section! Think I’ve missed a key detail? Got more lessons to share? Disagree fundamentally? Drop a comment and let’s chat!

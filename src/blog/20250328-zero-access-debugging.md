---
title: "Zero-access debugging"
slug: "zero-access-debugging"
pubDate: 2025-03-28
description: "In today's world of managed SaaS, quick deployments and observability 2.0 we have a ton of options for debugging software issues. But what about when you don't have all that? How can you prepare?"
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/cf046ce3-b1c4-4f5a-acaa-45fdf98cf96b_4000x6000.jpeg"
  alt: "A man being blindfolded while holding a bat in a garden. There is a pinata in the foreground."
  caption: "A man being blindfolded while holding a bat in a garden. There is a pinata in the foreground."
---

I’d like to share a story from early in my career. It was 2009 or thereabouts and I was a junior engineer for a team building VDI solutions at VMware. For our most recent release I’d been responsible for building out the login page (anyone remember RSA tokens?).

# An evening escalation

One Thursday evening, I got a phone call from our support team, a customer was having a problem setting up authentication, and the issue had been escalated all the way to the person who wrote the code. That would be me.

This was the first of only a few times I got such a call, and it ended up being a particularly difficult one for a few reasons:

1.  Our product was self-hosted, so we didn’t have direct access to logs or other telemetry (and, for the record, distributed tracing was still a few years away).
    
2.  Self hosting meant there could be any number of quirks in the customer environment, especially related to integration with their user directory
    
3.  The customer in question was the DoD, so there was only so much I was allowed to be told, being based outside the US at the time.
    

To add to all this, time zones meant it was 7pm for me, and I was standing outside a colleague’s leaving drinks. I debated going back to the office so I’d at least have access to the source code, but youthful hubris got the better of me.

So there I was, standing on a street corner in London, debugging an auth issue with the help of a support engineer and a Marine on a base somewhere in the midwest.

We poked around at a few possible causes for the problem, and frequently returned to the logs for a look under the hood. Since screen sharing was not an option, we experienced a few exchanges like this:

_Me: Ok, what just came through in the logs?_

_Support Engineer: It says ‘Authenticating user…’ blah, blah, blah._

_Me: No, can you read out the ‘blah blah’s? I need the ‘blah blahs’s to know what’s going on._

After a few rounds of this, I got frustrated and asked our engineer to put the Marine on. He made things a little easier, since when asked to do something, he did it word for word. He even called me “Sir”.  
  
It ended up being a pretty straightforward misconfiguration, but maybe took us 30 minutes to pin down with all the back-and-forth. It could easily have taken a lot longer.  
  
Once we were all wrapped up, our engineer had a question for me:  
  
_Support Engineer: Hey, it’s pretty late in the UK, shouldn’t you be at the pub?_

_Me: Oh, don’t worry, I am._

# Could this happen today?

Sixteen years on, and I’ve seen a lot of changes, both in the field and in the kind of products I’ve been building. Modern applications emit an incredible amount of telemetry - so much so that there’s a whole industry dedicated to storing and retrieving it in a cost-effective manner. And I’ve gone from building “boxed”, self-hosted software to managed SaaS, with short stops at desktop and mobile apps.

In the world of managed SaaS in particular, I’ve seen a growing desire to keep all the data just in case you need it. Suggestions of sampling telemetry met with cries of “what if…”.

But there will always be situations when you can’t get all the data you could possibly want, exactly when you want it. Even for managed applications, there will be limits to how much data you can keep. There is an ever-growing list of rules around PII that differ from country to country, and customers are increasingly demanding that their data be isolated from even your own employees. Then there are the costs associated with storing millions of events, that might require you to sample only a small portion of the possible data. This can slow down access to data, limit the ability to connect events to specific users or reduce the amount of data you have available to you.

# How to prepare

The best way to prepare for those inevitable support calls is to reduce the number you have to deal with in the first place. Consider the “unhappy path” in your workflows, and what information you can present to your users when things go wrong. Wherever possible, provide guideposts to allow a user to identify the cause of a problem, and the configuration options so they can resolve it themselves,

This is, of course, easier said than done, so your next line of defense will be your telemetry. Consider how you can use your logs, metrics, traces and even profiles to identify the root cause of a problem, and how to get from a customer complains to the right information quickly. In a managed SaaS application this can take the form of a “request ID” that a customer can access and provide (such as from an error screen) to help you find the request without PII. For a self-hosted solution, this could take the form of a “support bundle” that a customer can generate and send to you quickly.

Finally, there may be times when even this is insufficient and you need direct access. For most customers, you will be able to negotiate the ability to get access in an emergency situation to help out. This could take the form of remote access or user impersonation. Atlassian do this really well, including a checkbox directly in their support form giving their team permission to sign in to your account.

Having all the data and access can make diagnosing and fixing problems easy, but we rarely have everything we need. Beyond just adding more telemetry, we need to prepare for those times when we don’t have much of it at all.

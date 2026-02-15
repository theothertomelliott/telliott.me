---
title: "Building an internal support team that your engineers will love"
slug: "building-an-internal-support-team"
pubDate: 2024-11-01
description: "How we staffed a Slack support channel to provide assistance to 2-300 engineers."
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/76ec763e-4732-4463-ac36-1680818949d8_6000x4000.jpeg"
  alt: "A team of people looking at a laptop"
  caption: "A team of people looking at a laptop"
---

Last week, I wrote about why I preferred [running internal support in Slack](https://thefridaydeploy.substack.com/p/why-i-prefer-running-internal-support). This week, I’d like to talk about our experiences staffing the channel!  
  
_This article is part of an expansion on a segment of a talk I recently gave at [Platform Engineering New York](https://www.meetup.com/platform-engineering-new-york/events/303678239). The full set of slides are available [here](https://docs.google.com/presentation/d/1woorPCwwGq6vLqB4qTCpLHg4mUs5HuW_x9_bnrGN_Dc/edit?usp=sharing)._

When we first created our #help-sre channel, we set a goal of responding to each question within 1 hour during the business day. This response could be as simple as an emoji reaction to take ownership of the question, but the underlying promise was that we would start working the problem as quickly as possible.  
  
This meant that we needed to work towards full-time staffing of the channel.

# A first attempt: first responders

We started by having a designated “first responder” on each of our teams. During each sprint, someone on the team would have responsibility for handling support questions, but also responding to alerts and joining incidents. Essentially anything that could be considered “unplanned work” as per the [Phoenix Project](https://www.amazon.com/Phoenix-Project-DevOps-Helping-Business/dp/0988262592).

![Three teams, each with a single first responder](https://substack-post-media.s3.amazonaws.com/public/images/4fee9000-2d33-488e-88a8-c4050319506e_1211x393.png)
*Three teams, each with a single first responder*

This approach had its advantages: we always had a subject matter expert from each team available, and the members of the team not on rotation were able to focus on planned work, making it easier to meet deadlines.

But it quickly became apparent that there were some serious issues as well.

The workload in #help-sre was hugely variable by team, so one responder could find themselves swamped at the same time another was bored.

Since the responder was sitting with their team day-to-day, it was easy for them to get pulled into the planned work, or continuing something they hadn’t finished before going on rotation. A big distraction that impacted their responsiveness.

Worst of all: it was lonely. Despite us having multiple first responders active at any given time, they were all siloed into their “home” team. So it was easy to feel isolated and unsupported.

# Enter the RRT

Eventually, we decided to try something new. We created a pseudo-team which we called the RRT - Rapid Response Team. This team would be 100% focused on unplanned work for all the teams, and would be the first port of call when there was a question or something went wrong.

This team had three members:

-   A Senior Staff Engineer as permanent leader
    
-   A rotating member responsible for responding to question in Slack, alerts and incidents
    
-   A rotating member responsible for implementing small fixes and improvements
    

![The three-member RRT](https://substack-post-media.s3.amazonaws.com/public/images/bb1d8ad9-4bf9-4a2d-b703-7e56d2e9fb91_417x289.png)
*The three-member RRT*

This did mean that we lost a bit of the subject matter expertise from the previous model, but balanced that with the deep expertise of the team lead and collaboration of the team as a whole. Granted, there were times when they would ask another team or expert directly for help, but this actually ended up being the minority of cases.

Consolidating support efforts in a dedicated team gave a greater sense of purpose and focus to the people on rotation, and we pretty much immediately saw improvement in the speed and quality of responses.

Having a seasoned leader on the team (hand picked for their diagnostic abilities) also brought accountability and mentoring to support. Regular reporting on the effectiveness of our support forced us to think about how to improve it, and the rotating members received real guidance on how to handle support well.  
  
Within a year, we’d rotated every member of our group through the RRT and saw a drastic improvement when people started taking their second stint on the team.

# Conclusion

Dedicating a team to offering support to our engineering org greatly improved the quality and timeliness of our efforts - so our colleagues building product could get unblocked and getting features to our customers!  
  
We had our concerns about dedicating resources to answering questions - as engineers we really wanted to be writing code! But it cannot be understated how important support can be when you’re an internal engineering team. When you’re colleagues are your customers, you want to give them the best customer experience you possibly can.

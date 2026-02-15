---
title: "The pitfalls of cost saving projects"
slug: "the-pitfalls-of-cost-saving-projects"
pubDate: 2024-10-18
description: "Many companies have been tightening their belts in recent years, and you may well have been asked to undertake a cost saving DevOps project. But not all costs are created equal!"
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/05c87f08-21f5-458c-9b53-42d719862657_6000x4000.jpeg"
  alt: "Photo by Pixabay"
  caption: "Photo by Pixabay: https://www.pexels.com/photo/copper-colored-coin-lot-259165/"
---

_This article is an expansion on a small segment (just 2 slides, in fact) from a talk I recently gave at [Platform Engineering New York](https://www.meetup.com/platform-engineering-new-york/events/303678239). The full set of slides are available [here](https://docs.google.com/presentation/d/1woorPCwwGq6vLqB4qTCpLHg4mUs5HuW_x9_bnrGN_Dc/edit?usp=sharing)._

It’s been a difficult couple of years economically, and [layoffs](https://techcrunch.com/2024/05/01/a-comprehensive-archive-of-2023-tech-layoffs) have sadly been rampant within the tech industry since early 2023. Even when companies aren’t looking to actively reduce headcount, they’re being extremely cost-conscious. DevOps and similar areas will be no stranger to the feel of this pinch, being a cost center where the ROI is felt very indirectly.

You yourself may be embarking on a cost saving project. You may have been given a specific budget item to cut. Perhaps you were given a mandate for a percentage, or a target amount. Or you may want to onboard something new, but be told you need to find the money by cutting somewhere else.

No matter the motivation, it’s very easy to embark down a project that initially seems like it presents great savings, but whose benefit evaporates when they reach the accountants’ spreadsheets. These are a few of the pitfalls I’ve encountered over the years:

# Non-fungible budgets

As companies grow, their budgets become more and more complex. They may be segmented by department or function in order to make them easier to manage at the top level. It’s a lot easier to assign a percentage of a total budget to developer tooling, for example, than having to enumerate every possible tool you might want to purchase during the year or pull together detailed projections for price or usage increases. Suffice to say, I’m not an accountant so this is a gross simplification.  
  
This can make it very difficult to move money from one budget to another, so a saving from your tooling budget might not be transferable to your infrastructure budget without a very long conversation with the finance team.

Even worse, if you’re purchasing a tool that charges per seat, this might not be mapped to headcount. You could easily find yourself with a fixed budget that doesn’t scale if more people join the team - so you’re forced to trim other costs unexpectedly. This left me with a personal pet peeve - paying up front for enough empty seats to cover growth for the year because it was such a huge pain to get approval to add seats mid-year.

When managing costs, it’s critical to know what item goes in which budget. You might even discover that you’re going to save another department money and can count on their support, or at least call in a favor later.

# Minimum spends

If you’re a medium-to-large sized company and using a major cloud provider like AWS, GCP or Azure, it’s likely your contract has a minimum spend attached to it. This means that you agree that you will spend _at least_ a certain amount each year on their services. Most companies will want to get as close to that amount as possible by the end of the year.

This can lead to very rapidly changing priorities in terms of managing cloud spend. If you’re on track to go over your minimums, it may suddenly become very important to cut down cloud usage. But if you’re already well under, that autoscaling project you were planning out might not actually make a real difference.

Adding more confusion to the mix, all three major clouds have their own marketplaces, where you can purchase third party services using your cloud account. It can be tempting to take advantage of this if you’re nicely under your minimums, but you need to be careful to understand the terms, as you might not be able to count 100% of a marketplace purchase against your minimum.  
  
If you’re aware of where you are with respect to your minimum spends and burn rate, you can make informed decisions about how you can grow your cloud usage and proactively reduce usage in one area to benefit another.

# Opportunity cost

If you’re switching from one tool to another, you may be tempted to calculate what it costs in terms of developer time to see if it’s worth the effort. Most of the time, it won’t seem to be worth it at all.

Let’s say you’re going to switch from tool A to tool B. They have very similar features, but B will be $10k/year cheaper. You work out a rough project plan and estimate it will take a team of 4 engineers a month to complete the migration (they’re a very capable team). Assuming an average salary of $100k/year, you’re looking at $30k just to migrate! So on the face of it, it looks like you’d take 3 years to realize any savings at all. If you need savings this year, surely it doesn’t make sense to do this project? Right???  
  
Not quite.

It’s important to remember in this scenario that you’ve already committed to paying the team’s salaries. So you still realize the $10k of savings in the tools budget, and the true cost of the engineers’ time is _what they’re not doing_ during the month they execute the migration. This is the opportunity cost.

If you’re looking at the effort involved in a cost saving project, you’ll want to compare to other projects you might want to tackle. Perhaps there’s another project with similar effort but even bigger savings out there!

This also holds true for projects that save time for engineers. It’s always a worthy goal to make your engineers more productive, but these improvements cannot be considered to be cost savings. Productivity gains are felt much further down the line, manifesting in higher employee satisfaction and (hopefully) increased sales.

# Conclusion

With the complexities of accounting and complex contracts, trying to save money can be a bit of a minefield. You need to be keenly aware of who is responsible for what spend and how that money is accounted for, so you can focus on the projects where your effort is going to have a real impact to the bottom line.

If you can get this right, you’ll be way ahead of your peers!

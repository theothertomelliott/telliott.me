---
title: "AI is transforming DevOps: Will you be ready?"
slug: "ai-is-transforming-devops-will-you"
pubDate: 2024-10-04
description: "There's no doubt that AI is going to have an impact on the world at this point, and the world of DevOps will be no exception."
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/9fc39d8c-b886-49a9-aa3f-34a71f5bf0f7_4896x3264.jpeg"
  alt: "An eager looking robot assistant"
  caption: "An eager looking robot assistant"
---

A lot has changed over the past few years. It seems like yesterday that “Artificial Intelligence” as a term had been deprecated in favor of “Machine Learning”, the domain of data scientists and mathematicians. But since the explosion of LLMs, AI is the hottest ticket in town and everyone’s scrambling to participate in the rush.

AI is poised to bring significant changes to pretty much every aspect of our lives, and the world of DevOps (plus adjacent disciplines) will be no exception. I’ll have to admit that I’m already finding it hard to keep up with all the new tools and practices that are cropping up.  
  
In this post, I’ll be exploring some of the trends I’m seeing so far and what might be coming next, focusing on the areas of Observability, Operations and Governance.

# Observability

Observability seems to be an area where AI has the most potential to have a quick impact. With techniques like RAG, tools to search and explain data seem like low hanging fruit.

The major players have already leapt on this opportunity. Honeycomb has [Query Assistant](https://www.honeycomb.io/blog/honeycomb-natural-language-querying-query-assistant) to generate queries from natural language, Grafana [incident auto-summary](https://grafana.com/blog/2023/08/28/generative-ai-at-grafana-labs-whats-new-whats-next-and-our-vision-for-the-open-source-community/) will (unsurprisingly) summarize incidents automatically and Datadog’s [Bits AI](https://www.datadoghq.com/blog/datadog-bits-generative-ai/) promises to answer questions across all of your monitoring data.  
  
We're also starting to see totally new approaches appearing in and around observability with AI as core to the product, rather than an add-on. [Causely](https://www.causely.io/), for example, ingests telemetry and alerts automatically and applies causal knowledge to create a causal graph between observable symptoms and causes, bringing AI-powered automation to root cause analysis.  
  
But there's another side to the coin that to me present some really interesting challenges. How do you effectively monitor AI-based applications? What is acceptable latency for your use case? Is it worth using more tokens to get slightly better results? Some dedicated products are appearing in this space, like [LangFuse](https://langfuse.com/), but it still feels like there’s a lot to discover and figure out.

# Operations

Next, we come to operations. For want of better terminology, I’m going to lump a whole bunch of stuff in here. Including CI/CD, testing, and maintenance tasks like rebooting or upgrading a server.

One obvious trend is the proliferation of code generation tooling. We’re spoilt for choice when it comes to coding assistants: [GitHub Copilot](https://github.com/features/copilot), [Sourcegraph Cody](https://sourcegraph.com/cody), [Codeium](https://codeium.com/), [Qodo](https://www.qodo.ai/) (formerly the confusingly named CodiumAI), [Cursor](https://www.cursor.com/) to name just the ones I’ve tried. We're undoubtedly going to be generating more and more code with LLMs. On the operations side, I can see this having a big impact on low-code and no-code tools.  
  
We may see a swing more towards "high code" options with AI support, or all solutions meeting somewhere in between, with generated code being the end result in all cases. This will have impact on all operational tasks, including builds, tests and deployment. Want a script to move an account between shards? Ask a well-informed bot and it'll give it to you.  
  
Taking generated code one step further is the “AI Engineer”, manifesting in products like [Devin](https://devin.ai/). This concept is starting to spread into the DevOps world, with [Cleric](https://cleric.io/) and [Resolve.ai](https://resolve.ai/) positioning themselves as an AI SRE and Production Engineer respectively.  
  
It's still far from perfect, of course, and I imagine it's going to be a while before we can leave an agent alone to manage our systems independently. Time-saving recommendations, absolutely! Having seen code generation tie itself in knots after a simple mistake, I'd still want human eyes on the results before executing them in production.  
  
Of course, the more generated code we're shipping in our products, including in tests, or running as operational scripts, the greater importance we'll need to place on supervision. Robust testing will be critical, but the **process** for testing and approval will be even more important to protect you from AI-generated mistakes (and the blame).

# Governance

This brings us to the realm of governance. Security, compliance and everything in between. There's potential for AI to give us greater ability to check for compliance to policy as an extension of the kinds of observability tools mentioned above. But the nature of these controls is likely to change drastically.  
  
As with operations, we'll need to account for more and more generated code and operations, but also the concerns over privacy and loss of jobs (let alone copyright) will almost certainly lead to greater regulation.  
  
We're already seeing legislation like the [EU Artificial Intelligence Act](https://artificialintelligenceact.eu/), with some US states [following suit](https://perkinscoie.com/insights/update/states-begin-regulate-ai-absence-federal-legislation) with their own, similar legislation. I can only imagine there will be more and more as we realize the potential of the technology. Keeping in front of all that will be a full time task!

# Conclusion

The AI revolution promises to bring sweeping changes to how we operate as engineers and will bring many new tools and productivity improvements we can enjoy. But all of this will come with new challenges and new classes of problem to solve.  
  
It’s an exciting time, and occasionally a scary time. But I for one am excited to see where the shifting landscape takes us next!

---
title: "Forget no code, I'm going *all* code"
slug: "forget-no-code-im-going-all-code"
pubDate: 2025-05-09
description: "The more I use AI coding tools, the more work I'm bringing into my IDE. Even my writing tasks are creeping into the same workspace as my code. One workspace, many repos."
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/93db459c-7e86-4e6b-9553-944ea6d6d332_6144x4069.jpeg"
  alt: "Photo by Lukas"
  caption: "Photo by Lukas: https://www.pexels.com/photo/person-encoding-in-laptop-574071/"
---

I’ve been using [Windsurf](https://windsurf.com/) as my editor since it was launched last November, and its Cascade feature - similar to [Cursor](https://www.cursor.com/)’s Agentic mode - has steadily been changing the way that I approach my work. There are miles of text to scroll on vibe coding and “building the next big TODO app from a single prompt”, and I don’t want to add to that. I’m thinking of more focused, rote and surprising tasks that I’ve started to bring into my IDE.  
  
This has brought me to what you could call a “mono-workspace” model. I have a single workspace open in my IDE, which contains all the repos I might want to work on.

As I’ve been building out [Ocuroot](https://www.ocuroot.com/), there have been three major things to maintain: the app, the website and the documentation. I initially had all three of these in the same workspace to reduce context switching, but this quickly showed other benefits. When I wanted to create a set of documentation pages for the CLI, I could just ask Windsurf to copy and reformat the [Cobra](https://github.com/spf13/cobra) doc text to markdown. If I needed a code example for a blog, I could ask for not just the example, but a quick harness program to prove that it works. When I had to rename a bunch of blog files to follow a new format, I asked the AI to do it, saw it fail utterly to catch every example, and then asked it to write a bash script that could finish the job.

Getting results from generative AI is all about context, and the more files it has available to it, the more context it can find independently. For complex tasks where I want to do some design up front, if I put that design into a markdown file, the AI can see the “big picture” while I’m working with it. For a recent big project, I ended up with a workflow like this:

1.  Write an overview doc in markdown describing some of the use cases I want to enable
    
2.  Ask the AI to act as “an architect” to review the doc and ask questions about areas I might have missed (it created a long list).
    
3.  Resolve those questions until I had a comprehensive doc I was happy with.
    
4.  Ask the AI to draft a database schema as a Mermaid diagram. This was the fun part! I opened a preview of the diagram and just chatted back and forth to make adjustments until I was happy with the overall structure.
    
5.  With these docs in hand, coding could start! I asked the AI create a skeleton of the new features I could experiment with. It took care of all the boilerplate and rote structure so I could do the interesting parts. I could even ask it to compare the end result with the design to keep me honest.
    

It’s workflows like this that are making me want to move everything into the IDE! Whereas before I might have done design work in Google Docs or Notion because of their WYSIWYG experience, now I’m willing to work in the lower-level world of markdown because of how much more useful the content becomes when it’s AI-accessible. Sure, it’s a pain to embed an image, but I have an assistant to help with that.

Even for pure writing tasks, like copy-editing a blog post can be handled by a code-optimized AI. I’ll usually point it at drafts and ask a few questions about readability, flow and to help me select hashtags to go with the content. It does a great job, especially since it has a growing corpus of my writing to refer to. Now I just need to get around to automating the copy/paste step into Substack!

Of course, there are still plenty of things I can’t, or haven’t brought into the IDE. My calendar and spreadsheets are the biggest holdouts. But I’ve been on the lookout for ways to convert my work to text and code. A friend recently pointed me to [sli.dev](https://sli.dev/) for creating presentations and I’m looking forward to putting it through it’s paces! Now there’s [MCP](https://modelcontextprotocol.io/introduction) support, in Windsurf, there are also more opportunities for connecting to resources that don’t fit into a Git repo.

No article on AI tools would be complete without highlighting the drawbacks, and I’ve certainly hit a few by relying so heavily on my IDE. Having everything in one big workspace does run the risk of the AI “going rogue” and editing files I didn’t expect it to, which can require a little more care in reviewing output. There are also times where the IDE can get very busy with the chat window, terminal, code and a preview open.

It still feels like I’m only scratching the surface here, and I’m continuously refining my approach to better suit this way of working. Just this week I started adding [rules](https://docs.windsurf.com/windsurf/cascade/memories#rules) to my workspace to help side-step some of the places the tools kept getting stuck. I’d love to hear if anyone else has found themselves adopting this pattern, or other ways they’ve been getting the most out of their AI tools. I’m also always open to recommendations for text-based solutions to any problem!

---
title: "Shifting left: not just for security!"
slug: "shifting-left-not-just-for-security"
pubDate: 2024-09-06
description: "A short and sweet exploration of the term \"shifting left\", and its roots well beyond DevSecOps."
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/0b4ff6d8-ce19-4357-9b44-ceacc0145384_5184x3456.jpeg"
  alt: "Image of a keyboard with the left shift key in the background"
  caption: "Image of a keyboard with the left shift key in the background"
---

You may have heard the phrase “shifting left” before, and if your experience is anything like mine, this will most often have been in relation to security ([or if you will, DevSecOps](https://www.reddit.com/r/TheSimpsons/comments/3ibwlm/and_this_is_the_snack_holder_where_i_can_put_my/)). But it’s a maxim that can be applied to all aspects of software development, and has been for a surprisingly long time.

# What is “shifting left”?

I was first exposed to the term “shifting left” when discussing security practices. In that context, it referred to moving security checks as early as possible in the development process (the [SDLC](https://en.wikipedia.org/wiki/Systems_development_life_cycle)). The “left” in this case refers to a timeline that places earlier steps in the process to the left.

![Illustration of a development process, from writing code to getting into production, indicating that "left" is earlier in time.](https://substack-post-media.s3.amazonaws.com/public/images/9d4ceac3-4c25-43c0-84cc-e508b9492d0a_1056x512.png)

This goal is particularly applicable to security, because security testing is easy to consider an afterthought, especially if you have a separate team responsible for security concerns. While you’re trying to get features out the door, you may not be checking in on your choice of library versions or container base image and you certainly won’t be keen to wade through long lists of CVEs. But if you have your security team following on behind, these vulnerabilities may already be in production when they start nagging you!

Ideally, software engineers would execute security-focused tests and scans while still writing their code, giving the fastest possible feedback and ensuring that problems could be addressed quickly. This is a large part of the value proposition of services like [Semgrep](https://semgrep.dev/) and [Snyk](https://snyk.io/), who each provide automated tools to perform security scans at various stages prior to deployment.

# Beyond security: some history

But the emphasis on shifting left for security is just a more recent iteration of a decades-old concept. The concept goes back at least as far as the early 2000s and the early days of the agile movement, the term itself being coined in a 2001 [article by Larry Smith](https://www.drdobbs.com/shift-left-testing/184404768).

Back then, QA as a whole had similar problems that security faced in more recent years. Testing was often delegated to a separate team, resulting in a lot of back and forth when the QA team inevitably discovered a host of bugs. Smith observed that catching bugs earlier greatly reduced the cost of fixing them. So by automating tests and empowering development teams to run them frequently, the overall cost of releasing high-quality software came down.

One way or another this model has been a success, leading to best practices like the [testing pyramid](https://thefridaydeploy.substack.com/p/climbing-the-testing-pyramid-from) we explored last time. It has been so successful, in fact, that I had absolutely no idea how old the term was and how broadly applicable it really is.

# Conclusion

You may be doing pretty well at shifting left for most regular testing. Maybe you have a really nice suite of unit tests, and you might even be able to do some security scanning before you merge a change.  
  
But you might also have some tests that can only be run during the early stages of your CI pipelines so if these tests fail you **have** to push a patch to verify a fix. Or your acceptance tests may be hard-coded to only hit your staging environment, making it even slower to confirm a fix works. I know I’ve done both of these.  
  
When designing your tests, take a moment to think “just how far left can this go?”.  

* * *

# I have a new project!

![Ocuroot banner with logo](https://substack-post-media.s3.amazonaws.com/public/images/e3d30f94-6587-4efb-b380-1c0a8bb6781a_1584x396.png)

I’m branching out on my CI/CD journey and building [Ocuroot](https://www.ocuroot.com/), a new tool to help enterprises scale their deployment processes to handle large numbers of environments with varied requirements. It’s very early days, but I’m planning to build in the open, and would love you to follow along.

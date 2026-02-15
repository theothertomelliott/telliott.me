---
title: "How to handle flaky tests"
slug: "the-horrors-of-flaky-tests"
pubDate: 2024-11-22
description: "Our automated tests are supposed to be there to catch us when we make mistakes, but what happens when a test can't be relied upon?"
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/6bd400a7-3501-49b5-8e20-3331301548bb_6016x4016.jpeg"
  alt: "A person wearing a white coat and gloves holding a laboratory flask"
  caption: "A person wearing a white coat and gloves holding a laboratory flask"
---

If you’ve worked on a software team for any length of time, you’ve probably had a conversation like this:

“Can you take a look at this change? One of the tests just failed and I have no idea why.“  
”Oh, that test is flaky, just re-run it and it might pass.”  
”Well, ok, but I’ve already run it a few…oh it passed.”  
”There ya go. Flaky.”  
”Why even have this test then?”  
”It checks if you can log into the app. Obviously we need to know if **that’s** broken.”

We write all kinds of automated tests with the expectation that they’re going to save us time and catch problems before they get into production. But sometimes, an automated test cannot be relied upon, it becomes flaky.

# What is a flaky test?

A flaky tests is a test that may give a different result (pass or fail) when re-run with the same inputs.

In many cases, a developer in a hurry will re-run a failing test to see if it fails consistently. This can lead to a risky mode of operating, where you assume that a single pass indicates that your code works, no matter how many failures you might see.

# Causes of flaky tests

**External dependencies**, such as network calls can be subject to all manner of temporary failures that would impact tests. Even a request taking slightly longer than usual can trip up a test if it has a particularly short timeout.

It can get even more complicated when you have an external database with all your carefully crafted test data on it - what if someone changes your data to support a test they’re building?

And don’t get me started about DNS.

This is why it’s always a good practice to avoid using any external resources in unit tests, so you can focus on the logic.

**Concurrency** can easily result in behavior of a test being non-deterministic. For example, let’s say you have a test that creates a server in the background for a test client to talk to. If the test client doesn’t wait for the server to be ready, it’s initial requests could fail, causing a failure of the test.

**Side effects** in your code can result in subsequent runs behaving differently. Perhaps you save a file to a common location and don’t clean it up afterwards. Maybe you create a container with a specific name and only delete it after the test passes - so after a single failure, every subsequent run will fail.

This can also be a problem for functions that don’t touch external resources. You could be relying on randomized data to create an initial state, or controlling flow using the current time.

Sometimes a seemingly “pure” function is anything but, which brings me to an important point.

# Tests will always be flaky

There are a lot of ways you can reduce the chances of a test becoming flaky, but you can’t eliminate it completely. If you have acceptance tests, you’re almost certainly working with an external dependency that could fail.

Sooner or later, you’re going to see a seemingly spurious test failure, so what do you do then?

# How should you handle a flaky test?

The simplest way to handle a potentially flaky test is to simply re-run it until it passes. But as mentioned above this relies on the assumption that it’s only the failures that are spurious - false positives are entirely possible.

To ensure consistency, you could require tests to pass or fail multiple times before deciding on an actual result. Of course, this would take up a lot of time and resources.

The exact opposite approach would be to never allow retries at all, and expect any test failure to be followed up with a code change that at least attempts to fix it. This could easily be frustrating in cases where a test failed just because the test database happened to be down.

# Automated tests still need human help

When it comes down to it, a capable human should be able to judge whether or not a test failure was because of the changes to their code, or some outside factor, and perform the correct steps to remedy it.

If you empower your developers with the tools to re-run or bypass tests when necessary, they should have the ability and the motivation to use these powers appropriately.  
  
To give them the ability, care must be taken when creating tests to ensure that they provide appropriate output to make a sound judgement call as to the cause of a failure. Think quality error messages, and separate paths for failed assertions vs. network errors.

To give them the motivation, keep track of how often tests have to be re-run or bypassed. Encourage the team to try to keep those numbers low, and keep your quality KPIs high.

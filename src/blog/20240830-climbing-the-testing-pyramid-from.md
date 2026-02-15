---
title: "Climbing the testing pyramid: from unit to acceptance"
slug: "climbing-the-testing-pyramid-from"
pubDate: 2024-08-30
description: "Automated testing can mean many things, and needs to be approached differently depending on your goals and where in your process the tests run. Let's explore the three main categories!"
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/2033bcc8-d602-4352-808f-e5adb00dcf40_5184x3456.jpeg"
  alt: "Photo by Omar Zetina"
  caption: "Photo by Omar Zetina: https://www.pexels.com/photo/pyramid-el-castillo-in-chichen-itza-mexico-12046436/"
---

Good tests are a critical part of your CI/CD processes. They can mean the difference between catching a bug before code is even merged or having to field angry calls because the bug got all the way to your customers.

# Testing Categories

During my time in the industry, I’ve seen most automated tests fall into one of three categories: unit, integration and acceptance tests.

## Unit

Unit tests are the smallest, and fastest category of test. A unit test will typically focus on testing a small, self-contained piece of code, such as a package, class or even a single function. Because of their simplicity, there is usually pretty good support for unit tests in popular programming language, with tools such as [JUnit](https://junit.org/junit5/), [Jest](https://www.testim.io/blog/jest-testing-a-helpful-introductory-tutorial/) and the built-in [testing package](https://pkg.go.dev/testing) for Go to name just a few.

Unit tests are intended to be fast, reproducible and run frequently. This allows you to get rapid feedback as changes happen, and many developers will configure their IDE to run unit tests whenever they save their code.

To enable this kind of rapid feedback, it’s generally best practice for unit tests to avoid depending on third party APIs, databases, or even the filesystem. This helps remove any potential sources of instability and prevent the dreaded “flaky test”. In practice, this can be surprisingly difficult, and requires techniques like [dependency injection](https://en.wikipedia.org/wiki/Dependency_injection) along with stubs, mocks and fakes. Even then, it’s surprisingly common to see downstream dependencies sneaking into your unit tests, even if you thought you’d addressed them all.

## Integration

The term “integration test” refers to testing a combination of components to ensure they work correctly together. This may be as simple as re-running a unit test with a “real” database rather than a “fake” in-memory one, or as complex as standing up several microservices together and sending a few API calls to them.  
  
I’ve seen the concept of integration tests stretched a bit in both directions, and there can be considerable overlap between integration tests and either unit or acceptance tests. Depending on how you approach it, integration testing can also be the most complex to maintain, often requiring special infrastructure or tooling (such as [Testcontainers](https://testcontainers.com/)) to support short-lived services and resources.

## Acceptance

Acceptance tests, also known as “end-to-end” tests are the slowest, but most comprehensive of the three categories. They will usually be run against a fully-deployed instance of your application and exercise workflows that real users would go through.

They often involve browser automation tools like [Playwright](https://playwright.dev/) or [Cypress](https://www.cypress.io/), which allow you to simulate user interaction via a browser, and even do things like record videos to review what happened when a test fails.  
  
By representing a more “real world” situation, acceptance tests can give you a high degree of confidence that your software is really going to behave how you want when it reaches production. Browser-based acceptance tests can also often be mapped directly to common use cases, making it easier to know whether your test suite is as comprehensive as you want.

But these benefits come at the cost of speed, resource utilization and reliability. Deploying out to a representative environment in itself takes time, and simulating a browser can also be time and resource intensive. And due to the sheer number of factors interacting with one another, acceptance tests can fail seemingly at random. This can lead to even slower deployment cycles, and in extremes can erode faith in the tests, so developers start manually bypassing a flaky test, making it worse than useless.

# The testing pyramid

These three categories are often represented as a pyramid, like the below:

![A testing pyramid. Bottom to top: unit, integration, acceptance](https://substack-post-media.s3.amazonaws.com/public/images/55a1a136-4e5d-48a8-aca7-774cb3934644_1958x1076.png)
*A testing pyramid. Bottom to top: unit, integration, acceptance*

This pyramid prescribes the number of each category of test you should aim for, with unit tests being most common, and acceptance tests being most rare. Because unit tests are faster and cheaper to execute, having more of them means that you are more likely to catch problems earlier during your testing process. This structure also balances the maintenance burden that you are likely to experience with each type of test.

I’ve also seen this pyramid inverted, with the reasoning that acceptance tests, being more representative of the user experience, have greater inherent value. But if I were to modify the pyramid for my own ends, it would look like this.

![Modified pyramid with more acceptance tests, fewer integration tests](https://substack-post-media.s3.amazonaws.com/public/images/15489745-eddd-4f1c-a019-b55340b3f2b9_1934x962.png)
*Modified pyramid with more acceptance tests, fewer integration tests*

Because of the frequent overlap between integration tests and the other two categories, and the complexity incurred in enabling them, my view is that your time is often better spent creating and maintaining better unit and acceptance tests. Integration tests can be reserved the few situations where they shine, like testing CRUD in Postgres.

# Conclusion

This was something of a whistle-stop tour of three major categories of automated testing. There are a vast array of testing techniques out there, including linting, load testing, benchmarking, fuzz testing. Some of these fit into the above categories, some less so.

Regardless of what you want to test, being aware of the costs of executing any given test can be critical to building strong feedback loops that allow your teams to deliver rapidly and with high quality. The testing pyramid can be a powerful tool to help with designing your CI/CD processes.

* * *

# I have a new project!

![Ocuroot banner with logo](https://substack-post-media.s3.amazonaws.com/public/images/e3d30f94-6587-4efb-b380-1c0a8bb6781a_1584x396.png)

I’m branching out on my CI/CD journey and building [Ocuroot](https://www.ocuroot.com/), a new tool to help enterprises scale their deployment processes to handle large numbers of environments with varied requirements. It’s very early days, but I’m planning to build in the open, and would love you to follow along.

---
title: "Less is more with OpenTelemetry spans"
slug: "less-is-more-with-opentelemetry-spans"
pubDate: 2025-01-17
description: "When you're getting started with OpenTelemetry, it can be tempting to instrument everything in sight. But small, concise traces are often way more helpful than big, comprehensive ones."
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/4e4a85b6-6412-4a1a-8443-0ccd1de58e5d_4256x2832.jpeg"
  alt: "A formation of four stones"
  caption: "A formation of four stones"
---

So you’ve decided to add distributed tracing to your application with OpenTelemetry! You make a plan to set up collectors and storage, maybe a wrapper library or two to make setup easy. Then it’s time to start instrumenting! You give your teams some instructions and let them loose. The question is, when do they stop instrumenting?

You may be tempted to instrument every function, add attributes for all inputs and outputs and events for each step along the way. After all, the more information you have available, the more potential questions you’ll be able to answer when something goes wrong.

# What can go wrong

While this seems easy to justify (who doesn’t want to be prepared?), it can create a number of problems for you.

Firstly, there’s the time to actually implement the instrumentation. With a large existing codebase, instrumenting every inner function can become a long and tedious task.

Instrumenting short-lived spans (maybe even just a few microseconds) will add to the size of your traces without really adding much useful value. After all, the most common use case of distributed traces is in explaining slow requests. All this extra data needs to be processed and stored, and we’ve all heard horror stories of huge, unexpected observability bills. Sampling can help keep costs down, but the larger your traces are, the more you’ll need to sample and the less overall value you may get.

Some backends, like Grafana’s Tempo also put limits on the overall size of traces, this can be [as low as 50MB](https://grafana.com/blog/2023/12/18/opentelemetry-best-practices-a-users-guide-to-getting-started-with-opentelemetry/#use-exporters). When a trace exceeds this size, it can simply be dropped irretrievably. This caused a lot of frustration at my last job, when teams started seeing big gaps in their telemetry, sometimes losing the majority of traces for complex endpoints.

# Instrumentation Tactics

With those potential problems in mind, how can you select the right set of spans to instrument? Here are a few tactics you might employ.

## Start with incoming and outgoing requests

When you’re just starting out, it’s probably enough just to instrument operations when they enter and leave your service. This is particularly true if you have a microservices architecture, where individual calls will be doing minimal work.

For the use case of identifying bottlenecks in slow running calls, seeing external calls (to databases, other servers, etc) is usually going to be enough to show you where the problem is. Even if something else is causing the delay, you’ll see a gap in telemetry between external requests which should narrow your search a bit.

As I noted in my [previous post](https://thefridaydeploy.substack.com/i/154206531/instrumenting-http), it might be as simple as adding a couple of lines of code to capture these traces. Then the only work is in making sure contexts are propagated all the way down - for Go at least.

## Skip tracing for health checks and file serving

Some types of request just don’t make sense to trace.

If I’m hunting down slow requests, I sometimes run a search for spans above a particular duration - even if I know the endpoint I’m looking at. This kind of search can be polluted by long-running spans that _aren’t_ a problem, like serving large files.

Similarly, health checks can spam your collector and backend, using up compute and storage. If the checks are simple enough, it’s unlikely you’ll ever need to look at these traces.

These traces can either be filtered out at the collector, or you could write your services to never emit them in the first place.

## Filter spans

The OpenTelemetry collector allows [transforming and filtering spans](https://opentelemetry.io/docs/collector/transforming-telemetry/) as they come in. This would permit you to selectively drop or modify spans that you know won’t be useful.

To save space, you may want to drop short-lived inner spans that didn’t error - if a span behaved as expected, it may not add much useful context when something goes wrong.

Less drastically, you could remove larger attributes (like SQL queries) from these spans.

Being able to distinguish between different types of span can be critical to being able to effectively filter, so this may require some additional annotation. At the very least, you’ll get a lot of benefit from setting [span kinds](https://opentelemetry.io/docs/concepts/signals/traces/#span-kind) to distinguish between incoming requests, outgoing requests and inner functions.

## Split traces across ownership boundaries

Most of the time, you’ll be working to ensure propagation captures the whole life of a request through the entire stack, but there could be situations where this isn’t desirable. If your teams are large, and overall trace size is proving a problem, it might make sense to split your traces based on who will be most likely to review them.

Let’s say you had a _Web_ service for your frontend, and a _Users_ service providing an API to work with user data like permissions. The services are owned by different teams, and you’re seeing that Tempo is dropping traces involving permissions checks.

You may want to start a new trace inside the permissions check, so traces from Web indicate that the function was reached, but doesn’t have to store all the data for the rest of the request. Meanwhile, the rest of the request is provided in a separate trace that the Users team can reference separately. So in Go, you might do something like:

```
func CheckPermissions(ctx context.Context, ...) (error) {
    _, outerSpan := tracer.Start(ctx, "CheckPermissions")
    defer outerSpan.End()

    ctx, innerSpan := tracer.Start(
        ctx, 
        "CheckPermissions", 
        // Start a new trace
        trace.WithNewRoot(),
        // Establish a causal link from one trace to the other
        trace.WithLinks(trace.LinkFromContext(outerSpan)),
    )
    defer innerSpan.End()
```

This will start a new trace and associate the two with one another.

# Bonus snippet!

If you’ve decided you need to instrument a particular function, you’ll want to make sure you can capture errors from this function. One way to do this in Go would be to name the error and check its value in the defer that ends the span.

```
func endSpan(span trace.Span, err error) {
    if err != nil {
        span.SetStatus(codes.Error, "")
        span.RecordError(err)
    }
    span.End()
}

// === Cut here ===

func F(ctx context.Context) (err error) {
    _, span := tracer.Start(ctx, "F")
    defer func() {
        endSpan(span, err)
    }()
```

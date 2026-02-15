---
title: "Why I use Tilt, but not local Kubernetes"
slug: "why-i-use-tilt-but-not-local-kubernetes"
pubDate: 2025-08-15
description: "I've been using Tilt for local builds and testing for years. If you're familiar, you may consider it synonymous with Kubernetes. But I rarely use its Kubernetes features at all. Here's why!"
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/39e5a30a-5c68-444a-9d45-0c7db8f531db_633x417.png"
  alt: ""
  caption: ""
---

I’ve been a fan of [Tilt](https://tilt.dev/) since 2018, when I saw an impromptu demo on a bar after GothamGo. At the time we were dipping our toes into the Kubernetes water at Yext, and were trying to figure out how to adapt an internal tool we were using to run microservices locally. Given the daunting nature of implementing our own kubernetes integration, the prospect of an off-the-shelf tool that could do it all was immediately exciting.

Seven years on, and I’m still using Tilt, but very rarely with Kubernetes in the mix. Given Tilt’s tight integration with Kubernetes, this may seem antithetical, heretical or some other word ending in “-ical”. But even their [own documentation](https://docs.tilt.dev/tutorial/1-prerequisites.html) makes no secret of Tilt’s ability to go “off-road”:

> Our sample project uses Docker for building container images and Kubernetes for running them. However, it’s possible to use Tilt without Docker or Kubernetes! Tilt is incredibly flexible and supports a variety of ways to build and run your services during local development.

## Why not Kubernetes?

A simple answer would be that I’m currently not using Kubernetes in production - even when I was at Yext we ended up running our production applications on Nomad. But that wouldn’t let me have an opinion about it, so I’ll expand a little.

Even if I were using production k8s, I’d probably not be using it locally day-to-day. There is a lot of value in being able to test your k8s configuration locally, but it adds a fair amount of overhead - both when initially setting up your Tiltfile and when rebuilding as you make changes to your code. There’s a lot that Tilt can help with when it comes to the latter, like updating files on your containers in-place, but you still incur a time penalty at least on the first launch.

As something of compromise, I could imagine having separate Tiltfiles for active development and for validating your k8s config either before sending a PR and/or within your CI checks.

When you take Kubernetes out of the equation, you start to see what I feel is the real power of Tilt.

## Tilt’s Secret Sauce - Flexibility

For me, the biggest differentiator for Tilt as a dev tool is its sheer flexibility.

First and foremost it is designed to run **multiple jobs** at once - key to being useful for microservices development. This allows you to not only work with complex arrangements of jobs, but also add dependencies and tools around the edges, like databases or an OpenTelemetry collector. You could do this with Docker Compose, but Tilt also provides customizable build steps and crucially, running processes outside of Docker entirely with the `local` and `local_resource` functions.

Probably my favorite thing about Tilt, though, is the `Tiltfile`, a [Starlark](https://github.com/bazelbuild/starlark)\-based configuration file. This allows you to write pretty much any logic you might need around your configuration in a Python-like syntax. When I was at Yext, we used this capability to integrate seamlessly with our Bazel builds and migrate from our internal tooling without having to re-write any of our pre-existing, custom yaml files.

I liked this approach so much, it inspired the use of Starlark as a configuration language in [Ocuroot](https://www.ocuroot.com/)!

## My current super-simple workflow

Back in March, I wrote about my [experiences with the GoTH stack](https://thefridaydeploy.substack.com/p/my-6-months-with-the-goth-stack-building), and in particular some of the challenges in [getting live updates working](https://thefridaydeploy.substack.com/i/158785569/live-update-complexity). I’ve tried a few different approaches, but they all had their problems. The built-in proxy mode hit some interesting issues when I imported components from other projects. And while [air](https://github.com/air-verse/air) was a little more reliable, it required tweaking a fairly long .toml file.

For some reason, Tilt didn’t occur to me as an option until after I’d got frustrated with everything else I tried. I’m kicking myself now, as when I thought about it, `Tiltfile` for this was embarrassingly simple.

```
local_resource(
    'app',
    cmd="templ generate",     // Generate templ code
    serve_cmd="go run .",     // Run the app directly from source
    deps=["."],               // Rebuild if any source files change
    ignore=["**/*_templ.go"], // ...except the generated templ ones
)
```

That’s it. Just seven lines. One if I didn’t care about formatting.

Granted, this example doesn’t have all the nice bells and whistles of some of the other tools. Any changes require a full rebuild, and there’s no proxy to automatically reload the page. Right now, my Go builds are pleasantly fast so I’m not too worried about the first problem, but the second would be a real nice to have.

What I needed was a tool to provide a standalone reload proxy. A [StackOverflow answer](https://stackoverflow.com/a/78055134/77643) led me to [browser-sync](https://www.npmjs.com/package/browser-sync), an npm package that does just that. Along with some instructions for running it standalone. After a little tweaking, I came up with this addition.

```
local_resource(
    'live',
    cmd="yarn global add browser-sync",
    serve_cmd="""browser-sync start \
  --files './**/*_templ.go' \
  --port 8081 \
  --proxy 'localhost:8080' \
  --reload-delay 500 \
  --middleware 'function(req, res, next) { \
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); \
    return next(); \
  }'""",
)
```

This starts the proxy as a separate resource, watches for any changes to the generated Templ Go files and then reloads after a 1/2 second delay (to give the server time to rebuild). Note the global install just do I don’t need to maintain a package and lock file. A little verbose, but easier than writing my own proxy for sure.  
  
I might also want to make the port numbers configurable so I can more easily reuse this code for another project. This is where the Starlark flexibility comes in!

```
PORT=8080
PROXY_PORT=8081

local_resource(
    'app',
    cmd='templ generate',
    serve_cmd='go run . -port=' + str(PORT),
    deps=["."],
    ignore=["**/*_templ.go"],
)

middleware = """function(req, res, next) { \
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); \
  return next(); \
}"""

local_resource(
    'sync',
    cmd="yarn global add browser-sync",
    serve_cmd="""browser-sync start \
  --files './**/*_templ.go' \
  --port {proxy_port} \
  --proxy 'localhost:{port}' \
  --reload-delay 500 \
  --middleware '{middleware}'""".format(
      proxy_port=PROXY_PORT, 
      port=PORT, 
      middleware=middleware,
    ),
)
```

From there, there are all kinds of interesting things I could add to the `Tiltfile`. I could create separate versions of `app` on separate ports for different scenarios, or choose ports automatically to avoid collisions when I’m running multiple services.

## Why not give it a try?

If you’re looking for a tool to build, run and live-update your applications locally, Tilt might be a great place to start. Even if you’re not using Kubernetes at all, it can make for a very flexible, satisfying experience.

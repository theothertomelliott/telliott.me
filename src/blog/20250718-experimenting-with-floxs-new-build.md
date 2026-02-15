---
title: "Experimenting with Flox's new build and publish"
slug: "experimenting-with-floxs-new-build"
pubDate: 2025-07-18
description: "Trading perfect reproducibility for usability: a pragmatic look at Flox's new features"
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/b7e19118-2eea-4af2-a63b-7decb32b7be4_1442x994.png"
  alt: "Screenshot of the flox website"
  caption: "Screenshot of the flox website: https://flox.dev"
---

I’ve been following the folks at [Flox](https://flox.dev/) for a little while, after meeting some of the team at an event. I’d heard about Nix in passing, but it always felt like it would be a big lift to move over to a new package manager, let alone a complete new OS. Flox piqued my interest by offering a project-by-project Nix environment, for easier sharing between development teams and CI. A neat solution to toolchain consistency! As of [a couple of weeks ago](https://flox.dev/blog/introducing-flox-build-and-publish/), they’ve also added tooling to handle building and publishing packages, so I felt compelled to take another look.

# What has gone before

Over the years, I’ve seen a few different approaches to solving the “works on my machine” toolchain problem. During my days at VMware, we maintained a separate repo to contain all of our shared build tools in one, gargantuan download. At Yext, we used a combination of a carefully-maintained setup script and Bazel - for double the maintenance burden.

Since we’re talking builds today, the comparison with Bazel has suddenly become way more relevant. The key difference that I can see here is one of priorities. Bazel prioritizes reproducibility (in their words, hermeticity) of builds to the extreme, tracking every file (source or intermediary) involved in producing each artifact. Flox, on the other hand, is focused on the provenance of your build environment, ensuring that you have a consistent toolset to run against a known set of input source files. This results in trading a little reproducibility for a much shallower learning curve.

# Building and publishing a Go package

I hadn’t used Flox in a little while, so had to start from scratch with a new environment. Luckily they have a handy-dandy [5-minute quickstart](https://flox.dev/docs/flox-5-minutes/) guide. I won’t recount the steps here, but by the end of it I had an environment with Go installed ready to start building a binary.

I think they’ve done a good job of balancing getting up and running quickly via the CLI with the flexibility afforded by modifying the toml environment file. If you don’t want to get your hands dirty with editing the config, you can install and update packages to your heart’s content at the command line.

The Go package was helpfully pretty up to date, only missing the most recent release from a couple of weeks before. I could easily imagine there being concerns about being trapped in the release cadence of Nix packages, though. I’d probably be less concerned than with waiting for Bazel rule updates, but I have absolutely no data to back up that general feeling. That said, who hasn’t adopted some software based on a gut feeling before?

Getting onto the reason we’re here, building and publishing! At an absolute minimum, you just need to specify a command to run for your build.

```
[build.myapp]
command="""
	mkdir -p $out/bin
	go build -o $out/bin/app .
"""
```

You can then run `flox build`, which will create a build of your app using your local copy of the repo. This was a pleasantly quick experience, seeming to take advantage of Go’s local module caching and not having to wait for a container to spin up.

One slight note of confusion: the build output was mixed in with logs from Flox itself, so I had to scroll up in my (admittedly short) IDE terminal. The build output was printed in colors, which helped, but there was still a lot of info after it that didn’t mean a whole lot to me. There was also a log file generated, but with all the ANSI codes intact, so a little piping was required for easy reading.

Speaking of output files. Output from the build appeared in the source repo in directories and files prefixed `result-`. Oddly these weren’t gitignored by default, which led to me accidentally committing one of them.  
  
There’s also a “sandbox” mode that provides some additional guarantees of reproducibility. By adding `sandbox = "pure"` to your build config, Flox will copy all files tracked in git to a temp directory and build there. This will ensure that you have a clean working copy each time, and that you don’t accidentally rely on something in a parent directory of the repo. I could see this coming in handy if you’re using Go workspaces! It’s important to remember that files need to be tracked to be copied, so any new files will need to be staged to show up.

This brings us to the publishing part of the equation. Specifically, publishing Nix packages to the [Flox Hub](https://hub.flox.dev/). Once you have a build going, it’s just a case of running `flox publish` to get it out into the world. More specifically into a private area of the Hub. One nice touch here was that the CLI tool automatically prompted me to log in the first time, removing an extra step that would have no doubt led me to run the command a few times to navigate the help text.

The publishing step takes the git-based control of the build step one, well, step further. To publish a package, you must be on a clean commit that has been pushed to a remote branch.

This is where it’s useful to specify a version for your build, otherwise you’ll keep overwriting version `0.0.0`. The good news is that you have a few options to set the version, either statically in the config file, via the contents of another file, or by running a command. See [build metadata](https://flox.dev/docs/reference/command-reference/flox-build/?h=build#metadata).

Once published, you can use you new package like any other, public package in the Hub. You even get a neat little page with a familiar set of instructions to install.

![A private package in Flox Hub](https://substack-post-media.s3.amazonaws.com/public/images/201463cc-468f-477c-ad5d-954971dfad23_872x589.png)
*A private package in Flox Hub*

I could see this feature being really useful for sharing internal tools, and maybe even starting up services on a VPS. I’ll admit I haven’t got that far yet.

# Getting help

While I was able to make decent progress with just the docs alone, I did have a few questions along the way. You can probably guess what a few were from the above.  
  
I’ve been lurking in the Flox slack for a little while, so posed a few of these questions in their general channel. Impressively, I was only waiting for about 6 minutes before I got a nicely detailed answer. It’s also great to know that a lot of my concerns are already on the roadmap.

![Tom Elliott   Yesterday at 3:54 PM Hi folks, I’ve been playing around with the build/publish features and have a couple questions off the bat: I was initially a bit confused by sandbox mode only copying over tracked files, requiring me to stage new files to include them in a test build. What’s the motivation for this behavior vs, say, just omitting gitignored files? Running a build creates a bunch of files prefixed result- . Is there a way to control this prefix and/or put them all in a single directory I can gitignore? 6 replies   Tom Bereknyei   Yesterday at 4:00 PM Both approaches - only tracked files vs. gitignored excluded, require a workflow involving git. The idea is that if the build depends on tracked files, it is far more likely that others can also run the build. If we only excluded files based on gitignore; (1) we're forcing them to maintain a gitignore, and (2) they might have files neither in gitignore nor tracked that are required for the build, and now their co-workers will encounter "missing files" much later in the collaboration workflow. We don't allow for control over that prefix right now, but that is viable feature. We can put them somewhere similar to how cargo or other ecosystems put them into a subdir some where. Let us look into this.](https://substack-post-media.s3.amazonaws.com/public/images/2b4ae6bb-726e-458b-aa76-f04c46e947ed_531x674.png)
*Kudos to the team for replying to my questions in just 6 minutes!*

# Conclusions

This was something of a shallow dive into what Flox can do, but gave me enough of a taste that I’m sure I’ll be using it for some more “serious” projects in the near future. There are a few rough edges, but to be expected with any dev tool, let alone with a new set of features. Plus the responsiveness of the team and the hints at their roadmap give me confidence that these will be smoothed out soon.

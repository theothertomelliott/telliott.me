---
title: "My struggles with Gatekeeper errors and Homebrew - and a solution!"
slug: "my-struggles-with-gatekeeper-errors"
pubDate: 2025-09-12
description: "When distributing an open source CLI tool, you want to make it as easy as possible to install. On MacOS the go-to option is Homebrew, but it's not always as easy as it might seem. This is my story."
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/36a7cbca-f1e2-45d5-bdab-185aaaeff755_6000x4000.jpeg"
  alt: "Photo by Travis Saylor"
  caption: "Photo by Travis Saylor: https://www.pexels.com/photo/cyclone-fence-in-shallow-photography-951408/"
---

With Ocuroot starting to get a little more use, I faced calls to make installation simpler. Up until now, I’d been relying on `go install` (only good for other Go developers), or manual download/installs from GitHub releases (fiddly to say the least). The excellent [bin](https://github.com/marcosnils/bin) tool helped a little with the latter, but wasn’t ubiquitous.

So earlier this month, I was pleased to be able to announce a Homebrew tap, so MacOS users now had a nice, simple command to install the CLI.

<iframe src="https://embed.bsky.app/embed/did:plc:6m4t243kozmlqilfj2r5wlm4/app.bsky.feed.post/3lxrt3xuhbs26?id=7751977176709257" width="100%" height="400" title="" frameborder="0" scrolling="no"></iframe>

I already had my binaries built and ready in the GitHub releases, so I figured it would make sense to use those. So I set up a cask similar to the below:

```
cask "fromcask" do
  version "0.0.2"
  
  name "Homebrew Example"
  desc "An example Go application distributed as a binary"
  homepage "https://github.com/theothertomelliott/homebrew-example"

  on_intel do
    url "https://github.com/theothertomelliott/homebrew-example/releases/download/v#{version}/homebrew-example-darwin-amd64.tar.gz"
    sha256 "b6a53e31c9589af4652c83d2e30b466dd7056c50bd50302fa086408c2d3b78d2"
    binary "homebrew-example-darwin-amd64/homebrew-example", target: "fromcask"
  end

  on_arm do
    url "https://github.com/theothertomelliott/homebrew-example/releases/download/v#{version}/homebrew-example-darwin-arm64.tar.gz"
    sha256 "8ef6aba23c7875cc9f9a9fdee859d3e9c379283cb79677f583cf9f6d595c68fb"
    binary "homebrew-example-darwin-arm64/homebrew-example", target: "fromcask"
  end
end
```

You might have noticed that I recreated my steps in a quick and dirty repo at [https://github.com/theothertomelliott/homebrew-example](https://github.com/theothertomelliott/homebrew-example). There if you’d like to follow along!

Once this was pushed to GitHub, I could install and test:

```
$ brew install theothertomelliott/example/fromcask 
$ fromcask  
```

But was immediately greeted with a familiar error. _‘Apple could not verify that “homebrew-example” is free of malware that may harm your Mac or compromise your privacy.’_

![Gatekeeper error: ‘“homebrew-example” Not Opened’](https://substack-post-media.s3.amazonaws.com/public/images/4502dfb6-a026-42c8-9f4d-13661737b2c1_820x824.png)
*Gatekeeper error: ‘“homebrew-example” Not Opened’*

I’d come across this error before when double-checking the binaries uploaded to my GitHub releases. This is caused by Gatekeeper, which is a feature of MacOS to police apps installed outside the App Store. In theory, any binary downloaded from the internet must be signed with an Apple-issued certificate or manually allowed to run.

I can see the security argument for this, preventing your average user from downloading and running any random binary that gets sent to them. I can also see the cynical view that this is another way for Apple to control the ecosystem. But it hadn’t stopped open source distribution yet, so I was sure there were solutions!

Unsigned apps can be allowed via the Gatekeeper section of the System Settings app.

![The “Gatekeeper” view in System Settings showing the “Allow Anyway” button for the blocked binary](https://substack-post-media.s3.amazonaws.com/public/images/8ca63494-3c77-4b88-aee8-723cf7194c5e_1822x1794.png)
*The “Gatekeeper” view in System Settings showing the “Allow Anyway” button for the blocked binary*

Of course, you can’t really expect your users to all know how to do this. Even if they did, it’s not the most friendly or safe-feeling experience.

Previously, when I’d seen this, I noticed that it only appeared to affect binaries downloaded via a browser. A quick workaround was to just download the file with `curl`. So I was a little surprised that Homebrew had this problem, since I’d lump it in with tools like curl more than browsers. Unscientific, but that was my train of thought.

This left the option of signing the binaries, which would be a pretty long and involved process, as [this article](https://dennisbabkin.com/blog/?t=how-to-get-certificate-code-sign-notarize-macos-binaries-outside-apple-app-store#run_unsigned) attests. The annual fee involved was annoying, but not entirely untenble. The real kicker was that it can take days to turn around an account review. There was also the question of what happens when a certificate expired and had to be renewed.

Thankfully, there was an alternative! I looked at some of the tools I had installed and found some in the core repo that were built with Go. Their approach: install from source. At the minimum, a Formula (not a Cask) would look like this:

```
class Fromsource < Formula
  desc "An example installing a Go app from source"
  url "https://github.com/theothertomelliott/homebrew-example.git",
      tag:      "v0.0.2",
      revision: "0b2cebbda8eb92c977b246c19e8bd21e5226c752"
  license "MIT"
  head "https://github.com/theothertomelliott/homebrew-example.git", branch: "main"

  depends_on "go" => :build

  def install
    system "go", "build", *std_go_args(), "."
  end
end
```

While you can’t always rely on Go being installed, you _can_ ask Homebrew to install it for you as a dependency and then run your build. Once pushed, this could be installed and run without trouble.

```
$ brew install theothertomelliott/example/fromsource
$ fromsource
Success!
```

So after a working day of trying out different approaches, in the end, the solution amounted to about 15 lines of code. Hopefully this might help other open-source Gophers down the line, and if anyone knows a better approach, I’m all ears!

---
title: "A minimal static site with Cloudflare Workers"
slug: "a-minimal-static-site-with-cloudflare"
pubDate: 2025-08-29
description: "Sometimes, you just want to put some static pages on the web. While it can do a lot more besides, I recently found that Cloudflare Workers has a really nice, minimal workflow for static assets."
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/c3a996c1-599c-44fd-81f2-e0e840925946_3360x2240.jpeg"
  alt: "Photo by Paula Schmidt"
  caption: "Photo by Paula Schmidt: https://www.pexels.com/photo/wooden-chair-on-a-white-wall-studio-963486/"
---

I’ve previously hosted static sites on [Cloudflare Pages](https://developers.cloudflare.com/pages/), both for the ease of integration with their DNS products, and the generous free tier. But the Pages documentation now comes with a banner recommending migration to [Workers](https://developers.cloudflare.com/workers/). At first read, this felt like overkill for just hosting some static assets, but after working through an example, it turns out to be way simpler than I expected. In this post, I’ll walk you through what’s needed for a “minimum viable site”.

There are a few different entry points for Cloudflare Workers, but I’m going to focus on [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/). This is Cloudflare’s CLI for working with their developer products, and is a big part of the [Getting Started](https://developers.cloudflare.com/workers/get-started/guide/) guide for the CLI.

This guide will take you through deploying a simple JavaScript application, which is great. But we want something even simpler. Luckily, this just requires modifying the first step a little.

```
npm create cloudflare@latest -- my-first-worker
```

We’re going to choose these options instead of the ones in the guide:

-   For _What would you like to start with?_, choose `Hello World example`.
    
-   For _Which template would you like to use?_, choose `Static site`.
    
-   For _Do you want to use git for version control?_, choose `Yes`.
    
-   For _Do you want to deploy your application?_, choose `No`.
    

This results in a directory structure a bit like this:

```
my-first-worker/
├── .gitignore
├── .vscode/
│   └── settings.json
├── node_modules/
│   └── ...
├── package-lock.json
├── package.json
├── public/
│   └── index.html
└── wrangler.jsonc
```

Pretty simple, but it’s even more simple than it looks! There are really only two files that are important. Those are _public/index.html_ and _wrangler.jsonc_. If we want to split hairs, _wrangler.jsonc_ references the _public_ directory so it’s the only truly necessary one.  
  
The node files (_package.json_, _package-lock.json_ and _node\_modules_) are really just there for the benefit of Wrangler. It’s nice to have the tool locked to a specific version, but you could also just install it globally. You get _.vscode/settings.json_ for convenience but no harm to delete it. There is one line in _.gitignore_ we would also need, and that’s ignoring _node\_modules_, since Wrangler will put some cache files in there even if globally installed.

So if _wrangler.jsonc_ is the only truly important file, what’s in there? This is it in a nutshell, with all the helpful comments removed.

```
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "my-first-worker",
  "compatibility_date": "2025-08-23",
  "assets": {
    "directory": "./public"
  },
  "observability": {
    "enabled": true
  }
}
```

See the reference to the _public_ directory in the `assets` block? That’s what makes everything work. That and the `name` field that specifies the name of the Worker in your account.

Of course, this will just serve exactly what’s in that directory, which isn’t too different from hosting files in an S3 (or Cloudflare’s R2 - see what they did there?). I wanted to have a branded 404 page, and there’s a `"not_found_handling"` option to do that. With it set to `“404-page”`, any 404 error will be filled with the contents of _preview/404.html_.

So my final _wrangler.jsonc_ was more like this:

```
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "my-first-worker",
  "compatibility_date": "2025-08-23",
  "assets": {
    "directory": "./public",
    "not_found_handling": "404-page"
  },
  "observability": {
    "enabled": true
  }
}
```

Now we have this ultra-simple config, we can run it locally with:

```
wrangler dev
```

Or `npx wrangler dev` if not installed globally.

And we can deploy it direct to “production” with:

```
wrangler deploy
```

This will provide you with the URL for your worker and a version ID. By default, these Version IDs can persist as previews. You can create a version without deploying straight to production with the `versions` command. You can even specify an alias for the preview to get a reusable URL:

```
wrangler versions upload --preview-alias staging
```

This will provide a Version ID like before, and a Preview URL. This Version can then be deployed using the Version ID:

```
wrangler versions deploy --yes <id>@100  
```

The `@100` specifies that you want this version to receive 100% of traffic, a really neat feature that would allow you to set up A/B testing, canaries or blue/green deployment.

With these commands, you can easily set up a deploy-on-commit workflow, as well as complex staged deployments. I set up the latter, so I could have previews and promote those directly to production later. This was complicated a little by not having machine-friendly output from `wrangler versions upload`. This could be worked around either through parsing the human-readable text, pulling recent versions with `wrangler versions list --json` or just re-deploying the same content with `wrangler deploy`.

Even without the more “advanced” features, Cloudflare Workers is a simple, but flexible tool for deploying static sites. Even if you’re not using a site generator they directly support, it’s not too hard to customize a workflow. I’m sure I’ll be using it more and more in future.

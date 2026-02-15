---
title: "My 6 months with the GoTH stack: building front-ends with Go, HTML and a little duct tape"
slug: "my-6-months-with-the-goth-stack-building"
pubDate: 2025-03-14
description: "In a quest for the ideal front-end experience for a long-term Gopher, I started using Templ, Tailwind and HTMX late last summer. Now I've had some time with it, here are my impressions."
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/020a21ab-616d-4308-8574-39629f2c79f7_3264x4928.jpeg"
  alt: "A goth figure seated in an antique chair"
  caption: "A goth figure seated in an antique chair"
---

I’ve been a fan of [Go](https://go.dev/) for the better part of 10 years now. Its simplicity and portability quickly earned it a place as my language of choice. But the frontend experience has always left something to be desired for me. While powerful, [Go templates](https://pkg.go.dev/html/template) are a language unto themselves and for any kind of interactivity you’re going to want to reach for some JavaScript or TypeScript.

This is where the GoTH stack comes in! A toolkit that enables interactive front-ends with as much Go-like syntax as possible. The ‘Go’ stands for Go, of course, with the ‘TH’ made up of:

-   [Templ](https://templ.guide/) - it’s like JSX for Go! A component-based templating framework for building HTML with Go syntax.
    
-   [Tailwind](https://tailwindcss.com/) - A CSS framework that keeps everything in your markup. Yes, the T is pulling double duty.
    
-   [HTMX](https://htmx.org/) - A library for adding interactivity to your interface with HTML attributes
    

Noticing the theme? It’s all about putting everything you need for your front end in your Go and HTML, cutting down on that multi-language cognitive load.

A big goal of mine in building [Ocuroot](https://www.ocuroot.com/) has been to distribute everything as a single binary, so the GoTH stack had immediate appeal. If everything starts with Go, it’s easy to keep it all in one build (with [embeds](https://pkg.go.dev/embed) covering the gaps for static content).

I picked up the stack late last summer, and haven’t dropped it yet, so here are my impressions of my first 6 months with GoTH.

# What I’m loving

Aside from simplifying my single binary journey, there’s a lot to love here. This is probably going to lean on Templ a bit, just because it’s so core to the overall experience.

## Reusable Components

Templ’s function-like syntax for defining a template lends itself really well to building small, reusable components. I quickly found myself breaking any element I wrote more than once into its own component, and now have a pretty sizable library.

Most of my top-level components are now just composed of other components, like:

```
templ BuildEnvironmentList(
  environments []*state.Environment, 
  build BuildModel,
) {
  @components.Card() {
    @table.Table(table.TableProps{}, "Environment", "State") {
      for _, environment := range environments {
        @table.Tr(table.TRProps{}) {
	  @table.Td(table.TDProps{}) {
	    { environment.Name }
	  }
	  @table.Td(table.TDProps{}) {
            @badges.Live(environment.Name)
	  }
        }
      }
    }
  }
}

```

Maybe I went a little overboard with the tables, but indenting aside, this makes everything more compact and easy to read. It also helps mitigate one of the disadvantages of Tailwind: long lists of classes. For example, the `Live` component contains this set of classes:

```
templ Live(msg string) {
  <span class="inline-flex items-center mb-2 me-2 text-xs font-medium px-2.5 py-0.5 rounded border border-gray-500 bg-green-100 text-green-800 ">
    @icons.Check()
    { msg }
  </span>
}
```

## It’s “real” HTML

If you’ve ever had to copy an HTML snipped into JSX, you probably had to do a find/replace on “class” → “className”. Then found some other errors because of similar quirks.

At it’s heart, Templ is just parsing and rendering HTML, so the only really frustrating part of the experience is making sure everything you template is a string.

## Quickly adapt examples

Tailwind boasts a wealth of examples, both free and paid. Not only that, but the framework is popular enough that there are a number of third-party offerings like [Flowbite](https://flowbite.com/). Odds are there is an example or bundle that has exactly what you need!

Once you’ve chosen an example, it’s pretty simple to drop it into a component and template out the relevant prop for reuse. Even if you’re only going to use the example once, like for a nav bar, putting it into a `templ` function with well-considered parameters will make it really easy to make changes later on.

## Combine AJAX with server-side rendering

Technically it’s all server-side, but let’s say you wanted to have a div poll for regular updates. You’d need a “loading” spinner or something as a placeholder, right?

Not necessarily. Since HTMX loads HTML from the server, you can re-use the same component in Templ to render the content up-front so there’s no waiting.

```
func dynamicEndpoint() {
  http.HandleFunc(
    "/dynamic", 
    func(w http.ResponseWriter, r *http.Request) {
      data := ... get data for request ...
    
      content := DynamicContent(data)
      content.Render(r.Context(), w)
  }
}

templ RefreshingContent(data) {
  <div hx-get="/dynamic" hx-swap="innerHTML" hx-trigger="every 5s">
    @DynamicContent(data)
  </div>
}
```

In this example, the `DynamicContent` component is called both in the `RefreshingContent` component and the HTTP handler created in `dynamicEndpoint`, so you see the content as soon as the page loads, and get regular updates every few seconds. All with only one implementation of the content itself.

If you want to get really fancy, you can also use [WebSockets](https://htmx.org/extensions/ws/)!

## Robust Tooling ecosystem

Both Templ and Tailwind have a really impressive set of tooling available. With IDE extensions in particular enhancing the overall experience for using both tools.

A particular favorite for me is the Tailwind VSCode extension providing previews of color classes.

![Screenshot from VSCode showing color previews provided with color classes like bg-green-600](https://substack-post-media.s3.amazonaws.com/public/images/932b2c43-d49f-46bd-9a69-79388af21474_815x56.png)

## Great documentation

All three tools have really great documentation available, which makes all the difference when you’re getting to grips with a new tool.

Templ has short, easy to follow pages with examples throughout.

Tailwind has beautiful illustrative diagrams. Plus the popularity of the framework means it’s easy to find third-party content to answer any questions you have.

HTMX lays out their documentation in a intuitive way so it’s surprisingly easy to find what you’re looking for.

# What are the gaps?

Like any toolbox, there are a few rough edges and rusty patches. Thankfully nothing I’d call deal-breaking, but still frustrating at times.

## Error handling

Templ and HTMX are great for the “happy path”, when everything goes well. The handling of error cases is unfortunately a little less refined. HTMX requires an [extension](https://htmx.org/extensions/response-targets/) to allow you to effectively render errors, while the structure of templ functions (and lack of early returns) encourages you to handle errors in a layer above your “happy” components.

I’ve taken to dealing with errors at the HTTP server, choosing an appropriate template when errors occur. In some cases this means HTMX will receive content for an error message with a 2xx status code, but since the content is intended for human consumption, it seems a reasonable price to pay.

## Live update complexity

Node-based applications have a huge developer experience advantage when it comes to live updates. Just fire `npm run dev` or similar and you’ve got a local server with a UI that auto-updates as you change your code!

Templ has a [nice approximation](https://templ.guide/developer-tools/live-reload) of this, but once you start throwing in [other tooling](https://templ.guide/developer-tools/live-reload-with-other-tools), you quickly end up having to maintain a complicated Makefile.

## It’s not “API-first”

When I first got started with GoTH and in particular HTMX, I had something of a nagging doubt about the model as a whole. In recent years, I’d heard a lot about “API-first” approaches - writing an API that can be consumed by clients and front-end alike. Write your logic once and reuse it everywhere! Adopting a server side rendering model just didn’t feel DRY enough in comparison.  
  
Having used the stack for a while, I’ve found my ability to move quickly with my front end is well worth any perceived trade off. At this early stage, I’d much rather be making forward progress than spending time refining an API that can serve multiple use cases.

## React is sometimes unavoidable

React can often seem ubiquitous in the front end world, and I’ve definitely found a few times where I wished I was using it. In particular, I’ve been using [React Flow](https://reactflow.dev/) for rendering graphs and, as the name implies, it’s only available under React.

But that’s ok! Templ recognizes this too and there are options for [integrating React into Templ](https://templ.guide/syntax-and-usage/using-react-with-templ). It’s even leading me into patterns that I’m really liking, like [islands of interactivity](https://templ.guide/syntax-and-usage/using-react-with-templ).

As I think about React less as a tool for building SPAs and more as a tool for building reusable interactive components, I’m finding it easier to integrate into my existing applications. Ironically, by using React less, I’m finding I understand how it works more.

## LLM Expertise

This wouldn’t be a 2025 tech blog posts without some mention of AI. As I’m using code assistants like [Windsurf](https://codeium.com/windsurf) more and more, I’m seeing where their expertise is concentrated. Because of the popularity and sheer number of examples of React out there, the big LLMs are _very_ good at working with it.

Using an LLM with GoTH is serviceable, but much less of a smooth experience. In particular, I’ve had a lot of issues getting the assistant to recognize the set of components I have and not write a ton of plain HTML every time.

That said, the emphasis on plain HTML, boosted by the popularity of Tailwind mean that you’ll probably have a lot of success generating individual components.

Templ also has a [markdown file](https://templ.guide/llms.md) tailored to LLMs to bridge the knowledge gap. Unfortunately, I only discovered this partway through writing this post, so can’t comment on its effectiveness.

# Will I keep using it?

Of all the technical choices I’ve made on this project, adopting the GoTH stack gives me the fewest regrets. Even with some of the challenges, I’d use it for other projects in a heartbeat. I’m even debating migrating my marketing and docs sites to GoTH with static generation!

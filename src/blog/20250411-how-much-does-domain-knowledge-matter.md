---
title: "How much does domain knowledge matter when using AI tools?"
slug: "how-much-does-domain-knowledge-matter"
pubDate: 2025-04-11
description: "AI coding tools are bringing down barriers and enabling more and more people to build software. But do experienced programmers still have an advantage?"
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/c9519c50-5378-4b72-90d8-38d4ceaeb970_5192x3466.jpeg"
  alt: "Photo by Pavel Danilyuk"
  caption: "Photo by Pavel Danilyuk: https://www.pexels.com/photo/a-robot-holding-a-wine-8439094/"
---

Like it or not, AI is writing more and more code. We’re living in a world of vibe coding, where in theory anyone can build anything by asking an LLM. Does this mean that human skills no longer matter? Is all you need to build software an idea?

I recently had an experience that got me thinking about what human skill and knowledge can bring to AI workflows, and what it takes to get really good results when taking advantage of this new technology. TL;DR: meaningful domain knowledge will allow you to prompt, interact with and review the output of AIs with much greater effectiveness and success.

# My experience: learning a new technique

Last week, I attended the [BugBash](https://bugbash.antithesis.com/#about) conference, and was exposed to a concept I’d never used before: property based testing. It’s similar to fuzzing, involving generating random inputs, but with a goal of producing a finite set of example inputs to quickly verify an expected behavior. There’s a clear overlap with unit testing and to me, it felt like a logical progression from table-driven or example-based testing, which I’d been doing a lot of in my Go unit tests.

This got me wondering, why had this technique never been suggested to me by an AI code assistant? I’d had an AI write tests for me before, and usually it generated some basic unit tests, maybe with a couple of different examples and a very variable rate of success. It also made me wonder if the AI was _capable_ of using property based testing if I asked for it explicitly. I fired up a new Go project, and started on an example.

## A first pass at generating tests

I wanted something that wasn’t overly complex, but also wasn’t too well-defined ahead of time, so I sketched out an interface to represent a REST-like API for a data store.

```
type User struct {
	ID    string
	Name  string
	Email string
}

type Team struct {
	ID   string
	Name string

	Users []User
}

type Store interface {
	GetUsers() ([]User, error)
	GetTeams() ([]Team, error)

	PostTeam(team Team) error
	PostUser(user User) error

	PutTeam(team Team) error
	PutUser(user User) error

	PatchTeam(team Team) error
	PatchUser(user User) error

	DeleteTeam(team Team) error
	DeleteUser(user User) error
}
```

I’m a fan of TDD, so I wanted to write the tests before creating any kind of implementation. So I opened up the chat box and asked it to “create tests for the Store interface”. With this very vague prompt, it was able to create a few rote unit tests. They were by no means perfect.

AI code assistants can also be a little “over-eager”, so along with the unit tests, I got a full implementation of an in-memory version of the interface. I wasn’t going to complain about it doing the extra work, but it did give me more code to review.

While the tests covered the generalities, making sure you could create a user with Post, update with Put, etc, they didn’t perform a Get to confirm the content was as expected. The exception was testing the Patch functions, which did retrieve the final value for comparison. In this case, though, each field was checked separately, which would potentially make it a pain to add new ones. My personal preference would have been to compare the whole User value using `cmp.Equal` or `assert.ObjectsAreEqualValues` (Claude seems to be a big fan of the `assert` package)  
  
For the heck of it, I undid that step ask asked again with the exact same prompt as before. It was a little better this time, but ended up with a slightly different set of tests. You’re probably not going to get decent test coverage out of the gate this way.

I started over, this time asking it to “create property based tests for the Store interface”. Still a bit vague, but at least being more explicit about technique. And property based tests I indeed received!

The AI chose the [gopter](https://github.com/leanovate/gopter) package, which I found interesting. I won’t complain about not having to research and find a package, but I did wonder why it chose this one and not the similarly popular but slightly younger [rapid](https://github.com/flyingmutant/rapid) or the built-in (but frozen) [testing/quick](https://pkg.go.dev/testing/quick).

There were a couple of generators to cover the User and Team types, and a set of properties that at least hit the functions in my interface. I could spot a few gaps up-front, the biggest one being that only valid inputs were being generated. I had to ask for it to add some invalid examples to hit some error cases. This was a little disappointing, since missing error cases is probably the most common “beginner” mistake when writing tests.

## Exploring and learning

I figured I could always add more tests later, so I turned my attention to the use of the gopter package and trying to understand how the inputs were being generated.

I noticed that most values started with a call to `gen.AlphaString()`. Having hit a series of errors with length before, I wondered how short or long these strings could be. I started reaching for the docs, but realized I could ask the AI. It informed me that I could use `gen.AlphaStringN`. I briefly wondered why it wasn’t using this from the start, but realized I’d never asked.

There was also a really odd pattern that emerged in the generated code:

```
"ID": gen.AlphaString().Map(func(s string) string { 
  if s == "" {
    return "defaultId"
  }
  return s + "Id" 
}),
```

Why the default value, and why the suffix with “Id”? I asked why it did this and it explained that this approach prevented certain kinds of invalid outputs that we weren’t testing for. I pressed it a little further and it came up with a couple of alternative approaches to avoid the empty string, one with the aforementioned `AlphaStringN`:

```
"ID": gen.AlphaStringN(1, 10).Map(func(s string) string { 
    return s + "Id" 
}),
```

And one using `SuchThat`:

```
"ID": gen.AlphaString().SuchThat(func(s string) bool {
    return s != "" // Ensure non-empty ID
}).Map(func(s string) string { 
    return s + "Id" 
}),
```

Seeing the SuchThat example, I started wondering about performance. Presumably if you’re rejecting randomly-generated examples you could just keep rejecting them forever, or at least for longer than the 30 second timeout. I asked the AI and it provided a somewhat satisfactory explanation that lined up with my intuition. Although it missed something from the [godoc](https://pkg.go.dev/github.com/leanovate/gopter#Gen.SuchThat):

> Use with care, if the sieve is too fine the generator will have many misses which results in an undecided property.

This implies that there is a limit to generation so rather than being slow, it would outright fail. My guess is that the AI’s explanation was heavily biased by the structure of my question. Similar to the “ah, you’re right” responses when you challenge a previous answer.

I turned my attention to the properties themselves, the “meat” of the tests.

```
properties.Property(
  "a team created with POST can be retrieved with GET", 
  prop.ForAll(
    func(team store.Team) bool {
      s := New()
			
      // POST operation
      err := s.PostTeam(team)
      if err != nil {
        return false
      }
			
      // GET operation
      teams, err := s.GetTeams()
      if err != nil || len(teams) != 1 {
        return false
      }
			
      // Deep equality check
      return teams[0].ID == team.ID && 
        teams[0].Name == team.Name && 
        assert.ObjectsAreEqualValues(teams[0].Users, team.Users)		
    },
    generateTeam(),
  ),
)
```

One really nice thing about the property structure was that it made it really easy to see what the test was trying to do, separating the concept from the inputs. I’ve always been a fan of table-driven tests in Go, but this was way easier to read and understand.

Of course, it was far from perfect. The generated code suffered from a similar issue to the earlier unit tests, but even worse. Now it was comparing the id and name separately as well as comparing the whole object.  
  
At least the more readable code made it easier to find this…

## Failing at failure

Since I was new to this kind of testing, I wanted to see how easy it would be to debug. I needed to force a failure so I could see how errors were output. So I modified the in-memory representation to skip alternate Users in `GetUsers`. Of course, the existing tests didn’t do anything with multiple users, so everything still passed.

I asked the assistant to create a test including multiple Users and, true to form, it eagerly fixed my “broken” code so all the tests still passed. Determined to see a failure, I carefully accepted the new test, but rejected the fix and had a poke around the output that I received to get comfortable with it. I could do more of a full review of gopter, but this post is about AI tools, so I’ll leave you to explore that one yourself.

## Scratching the surface

This was a pretty decent introduction to property based testing, but there’s still a lot for me to learn. Poking around the docs uncovered the concept of shrinking, for example.

Exploring and asking about generated code was a decent way for me to get comfortable with property based testing and the gopter package, but there’s plenty that I won’t be able to discover this way. I’m still going to be searching for tutorials, articles and videos to expand my knowledge. But once I do, the AI will help me put it into practice!

# What does this mean?

This experience brought me to the conclusion that while LLMs are often surprisingly good at doing what they’re asked, you need to know _what_ to ask them. Until I knew enough about property based testing to ask for it, it was never going to choose that technique for me. Until I asked for tests of invalid data, I wasn’t going to get them. And unless I told it not to, the AI wanted to fix all the broken tests for me.

Knowing to ask all of these things takes experience. Experience which in my case has been built up through writing code myself. In future, there may be other ways of getting this experience.

When Copilot was announced and the AI code assistant race began, I remember thinking that getting help from an AI was probably going to be like getting help from a “very average” programmer. I’m more convinced of this now that I was back then. But now I see that much like pairing with a senior developer can raise the output of a junior developer, an experienced operator can use their knowledge to nudge an AI to produce something better.

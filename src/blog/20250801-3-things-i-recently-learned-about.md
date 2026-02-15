---
title: "3 things I recently learned about bash"
slug: "3-things-i-recently-learned-about"
pubDate: 2025-08-01
description: "Bash has been around almost as long as I have, but I've apparently still got a lot to learn about it. Here are a few things I discovered in recent weeks."
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/125d2ef7-4500-4dbc-87ea-9a459fbc16d0_633x417.png"
  alt: "The bash logo with a command below: ➜ ~ for i in {1..3}; do echo \"🎓\"; done"
  caption: "The bash logo with a command below: ➜  ~ for i in {1..3}; do echo \"🎓\"; done"
---

I’ve recently been writing a _lot_ of bash scripts, having deemed them to be the quickest way to test the CLI I’m building (which I wrote about on my [work blog](https://www.ocuroot.com/blog/back-to-basics-e2e-tests-in-bash)). This has stretched my bash muscles more than I have in quite some years, and I’ve bumped into a few quirks and new features I didn’t know about before.

So why not share them here? It’s possible someone might find it useful. More importantly, writing about them will force me to actually understand the dang things.

# Newlines

When building up a string in most languages, I’m used to using escape characters like \`\\n\` to introduce newlines, or \`\\t\` for a tab. This doesn’t work with your typical string in bash, so:

```
echo "First line\nSecond line"
```

Will output `First line\nSecond line` verbatim. There is, however a separate feature to handle escape sequences, [ANSI-C quoting](https://www.gnu.org/software/bash/manual/bash.html#ANSI_002dC-Quoting-1). If you prefix a single-quoted string with a `$`, the escape sequences will be expanded, so:

```
echo $'First line\nSecond line'
```

Will output:

```
First line
Second line
```

Annoyingly, you can’t expand variables in ANSI-C quoted strings, so to build a multi-line string including variable content, you need to combine two different kinds of string.  
  
My janky initial approach was to create a variables to contain the newline.

```
NEWLINE=$'\n'
echo "Hello$NEWLINE$NAME"
```

But I later discovered you can concatenate strings by just butting them up against each other:

```
echo $'Hello\n'"$NAME"
```

EDIT: After publishing, I was also informed you can use echo’s `-e` flag if you’re only worried about output:

```
echo -e "Hello\n$NAME"
```

# Local variables

Declaring variables in bash is pretty easy, just a line of the form `FOO=BAR`, so I’ve never really searched for anything more powerful than that. But now I’ve been writing a lot of functions, I discovered the `local` builtin ([docs](https://www.gnu.org/software/bash/manual/bash.html#index-local)).

Using local allows you to limit the scope of a variable to the current function and its children. This can help avoid confusion if you re-use variable names in a complex script.

```
my_func() {
    local param="$1 but with extra text!"
    echo "$param"
}

param="foo"
my_func "$param"
echo "$param"

# Outputs:
# foo but with extra text!
# foo
```

# Cheating at loops

I’ve had some issues with flaky test scripts, so I want to be able to execute multiple runs sequentially. The “right” way to do this would be to use a for loop:

```
for i in {1..10}; do ./test.sh; done
```

This is all well and good, but I’m not a huge fan of remembering all those dos, dones and semicolons. So I dug up a sneaky one-liner to repeat a command that for me is slightly more aesthetically pleasing:

```
seq 10 | xargs -n 1 ./test.sh  
```

It’s slightly shorter, if command golf is your thing. For me, it’s a little more readable, and I like that it keeps the key command at the end of the line for an easier copy/paste and edit.  
  
Granted, you need to make sure that your script doesn’t actually do anything with the extra parameter, and if you want to exit on a failure, you end up losing some of the cleanliness:

```
seq 10 | xargs -n 1 sh -c './test.sh || exit 255'
```

Still, always nice to have options! I’d only really use this as a one-liner, I’m still using `for` loops in my actual scripts. I’m not a monster.

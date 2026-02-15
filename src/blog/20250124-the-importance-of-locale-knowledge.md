---
title: "The Importance of Locale Knowledge: Or my story of breaking software in Turkey"
slug: "the-importance-of-locale-knowledge"
pubDate: 2025-01-24
description: "Localization can be a pain, requiring you to account for all the quirks of many languages. This is my story of a particularly surprising and frustrating quirk, and how we worked around it."
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/853c2fe3-6cc1-46f9-a1bf-95b413c9c80d_6720x4480.jpeg"
  alt: "Three people telling a story around a campfire"
  caption: "Three people telling a story around a campfire"
---

I recently listened to the [War Stories](https://fallthrough.transistor.fm/episodes/war-stories) episode of the Fallthrough podcast. I’d recommend it to anyone who’s currently dealing with a frustrating technology problem - it’s always good in those moments to know you’re not alone! It got me thinking about one of my own war stories.

# 13 years, 3 jobs and many technologies ago

This was in early 2012, back in my Java days. I’d spent most of a week trying to track down a bug a customer was having during install. When you installed our server software on a Turkish copy of Windows, the different services couldn’t talk to one another.

A typical architecture would consist of a central server and a few satellites providing access from different networks, and the satellites would randomly fail when trying to authenticate to the server. Authentication was handled by issuing a secret key from the server, which would be manually input to the satellite on installation. More often than not, the server would not recognize a good key from a Turkish machine.

# It was DNS localization

After spending a week reading logs, we tracked down the issue to a call to `String.toLowerCase()`. We’d been converting the key to lower case to “simplify” the process, but this was somehow causing the keys to be truncated.

One thing we hadn’t considered during implementation was that `String.toLowerCase()` is locale specific. We were using Base64 keys, which had this character set:

```
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/
```

We expected this would have the same upper/lower case mappings for all languages, and in most cases, we were correct. Turkish is the _only_ exception.

Removing the already lower case letters, these are the outputs of running `toLowerCase()` on the character set.

English:

```
abcdefghijklmnopqrstuvwxyz0123456789+/
```

Turkish:

```
abcdefghıjklmnopqrstuvwxyz0123456789+/
```

It's hard to see (so took us a while to spot!), but the converted lower case 'i' in Turkish doesn't have a dot above it. It was a subtle difference, but enough to confuse the heck out of the regex we used to parse our message keys. So trying to validate the character set for the key resulted in everything after the first “I” being dropped.

The solution was pretty simple: specify an English locale when we manipulate the case of a Base-64 String:

```
id.toLowerCase(Locale.ENGLISH);
```

We know the character set in use, so it wouldn't cause any problems forcing the locale in this manner for this specific use case.

# Would you believe it happened twice?

This was a particularly frustrating episode, and I’ve managed not to forget it in the decade-plus since. I’m glad I haven’t, not only because of the object lesson in considering localization throughout your work, but also because I somehow managed to hit this exact problem again a few years later!

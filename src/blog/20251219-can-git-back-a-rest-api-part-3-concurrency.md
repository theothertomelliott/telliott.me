---
title: "Can Git back a REST API? (part 3 - concurrency)"
slug: "can-git-back-a-rest-api-part-3-concurrency"
pubDate: 2025-12-19
description: "Now the Git-backed REST API is a bit more performant, I focus on what happens when you have multiple users at once."
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/7de3a017-6ba2-42cc-80e4-d225fbd19bef_6000x4000.jpeg"
  alt: "Photo by Ketut Subiyanto"
  caption: "Photo by Ketut Subiyanto: https://www.pexels.com/photo/crop-faceless-female-entrepreneur-doing-multitasking-work-on-different-devices-4474033/"
---

I’ve spent the last couple of weeks building a REST API backed by a Git repo. In [part 1,](https://thefridaydeploy.substack.com/p/can-git-back-a-rest-api-part-1-the) I took the naïve route calling the Git CLI and found performance a bit lacking. In [part 2](https://open.substack.com/pub/thefridaydeploy/p/can-git-back-a-rest-api-part-2-git), I hit the server with the HTTP protocol directly and was surprised how fast it could be! In this edition, I look at what happens when the API receives multiple requests at once.

If you’ve worked with Git regularly, you’ve probably seen errors talking about “non-fast-forward” updates. This happens when you create a commit in your local copy of a repo and try to push it to the remote, but someone else has pushed a commit before you. So you go back, rebase and try again. The edit/commit/push cycle in my API ran a bit more quickly than the human one, but it still wasn’t atomic, so I knew it would be possible to hit this kind of error if two POSTs overlapped.

# The test

To try to force this kind of overlap, I set up a test that created 10 goroutines, each executing a POST to a different file. I was keen on having strong consistency, so I also validated that the file could be read with a GET immediately afterwards. Once all the goroutines finished, I also validated that all the files existed with another round of GETs, to make sure none of the commits clobbered older ones.

This was also a perfect opportunity to try out `WaitGroup.Go`, new in Go 1.25!

```
func TestConcurrentPOSTs(t *testing.T) {
    // Setup test repo and backend here

    ctx := t.Context()
    
    wg := sync.WaitGroup{}
    
    // Create and validate 10 files in parallel
    for i := range 10 {
        wg.Go(func() {
            err := backend.POST(
                ctx, 
                fmt.Sprintf(”file%d”, i),
                fmt.Appendf(nil, “content%d”, i),
            )
            if err != nil {
                t.Errorf(”%d: Error on POST: %v”, i, err)
                return
            }

            content, err := backend.GET(ctx, fname(i))
            if err != nil {
                t.Errorf(”%d: Error on GET: %v”, i, err)
                return
            }

            if string(content) != fmt.Sprintf(”content%d”, i) {
                t.Errorf(
                    ”%d: Content mismatch: expected %s, got %s”, 
                    i, 
                    fmt.Sprintf(”content%d”, i),
                    string(content),
                )
            }
        })
    }
    wg.Wait()

    // Check all files are as expected
    for i := range 10 {
        content, err := backend.GET(ctx, fname(i))
        if err != nil {
            t.Errorf(”%d: Error on GET: %v”, i, err)
        }
        if string(content) != fmt.Sprintf(”content%d”, i) {
            t.Errorf(
                ”%d: Content mismatch: expected %s, got %s”,
                i,
                fmt.Sprintf(”content%d”, i),
                string(content),
            )
        }
    }
}
```

Testing concurrency in this way does introduce some non-determinism into the mix, since catching a failure relies on goroutines overlapping in particular ways. This means that I’d need to run this test multiple times to be sure it was actually succeeding. An intentionally flaky test!

# First bug - server errors

The first error was pretty much as expected:

```
command error on refs/heads/main: cannot lock ref ‘refs/heads/main’: is at efa054235712bcd1e7a89c5277f990093174dd94 but expected c1bd7df9fb79bdddcbf2a67c646fc3f893a8976f
```

This indicated that a push had been prepped on top of one commit, but a new commit had come in before the push was applied.

I could have solved this by making the PUSH operation atomic, either by adding a mutex or using channels to do all the writes in sequence on a single goroutine. But this would only really be effective with a single server, elimination options for high availability and horizontal scaling. Sure, I could have added some kind of distributed locking, but that would either require an additional service to manage the locks (defeating the purpose of git-backed APIs a little), or going down a rabbit hole of distributed systems theory and implementing it myself.

A much easier option was to add **exponential backoff**. If a POST failed in a recoverable way, just keep trying until it worked, waiting for longer and longer periods to avoid collisions.

With [cenktali/backoff](http://github.com/cenkalti/backoff), this was pretty straightforward:

```
import “github.com/cenkalti/backoff/v5”

func (b *Backend) POST(
    ctx context.Context, 
    path string, 
    body []byte,
) error {
    operation := func() (plumbing.Hash, error) {
        commit, err := b.doPOST(ctx, path, body)
        if err != nil {
            if err == gitbackedrest.ErrConflict {
                return plumbing.ZeroHash,
                       backoff.Permanent(gitbackedrest.ErrConflict)
            }
            return plumbing.ZeroHash, err
        }
        return commit, nil
    }

    _, err := backoff.Retry(
        ctx, 
        operation, 
        backoff.WithBackOff(backoff.NewExponentialBackOff()),
    )
    if err != nil {
        if errors.Is(err, gitbackedrest.ErrConflict) {
            return gitbackedrest.ErrConflict
        }
        return gitbackedrest.ErrInternalServerError
    }
} 
```

This sets up a function, `operation` that runs the POST (`doPost`) and on an error, will either fail permanently by wrapping the error with `backoff.Permanent`, or return an error as-is to trigger a retry.  
  
This function is passed to `backoff.Retry` with the default configuration, which in the current version will start with an interval of 500ms between retries, multiply that interval by 1.5 (randomized 0.5x either way) each failure and time out after 60s.

This eliminated the ref locking error at the expense of making the test a bit slower. Fixing those errors brought another, slightly less expected issue to the forefront.

# Bug the second - concurrent map writes

Now I was consistently seeing the test crash with a `concurrent map write` error. The resulting stack trace pointed to the in-memory store that I was using with go-git. This store implementation was not thread safe, so the test goroutines were colliding when storing new objects.

The fix here was simple, but slightly tedious. I just had to add a [mutex](https://gobyexample.com/mutexes) for the store, and hold a lock for any segments of code where the store was being used, but without wrapping the whole POST operation in a lock.

# Completing the trilogy - missing commits

With these two issues addressed, the POSTs all succeeded, but oddly, some of the files were missing, causing `not found` errors in the validation GETs.

To debug this, I disabled the cleanup so I could inspect the test repo. Not only were the files missing, but there was no evidence of the commits that should have introduced them.

This made me wonder about the ordering of the commits, so I added logging to show the parent and new commit hashes for each successful push:

```
2025/12/16 12:37:26 Successful push request old=c11245d5faeb640cb4844b15136beca59af44501 new=78bdb964fd638bc0baf528817f0dfdc3606bff93
```

Simplifying a bit I saw something like:

```
Successful push request old=a new=b
Successful push request old=b new=c
Successful push request old=b new=d
Successful push request old=d new=e
```

Spot it? The second and third push are applied on top of the same commit, so the latter one is effectively orphaned. This was a little surprising to me, since this would seem like exactly the kind of mistake that should have triggered an error from the server.  
  
As it turns out, when working with the Git protocols directly, there are ways to fool the server! When creating my commits, I had to specify their parents, but I had to identify both commits _again_ when creating the push request. Rather than passing the correct parent hash along to the code that set up the push, I was retrieving the _latest_ commit, which was not guaranteed to be the parent I started with. With this mismatch, the bad commit was being allowed through.  
  
The fix was easy enough, just make sure I retained the correct parent commit and use it in both places.  
  
Now the test passed every time, although a bit more slowly, as this fix resulted in more collisions being caught.

# Some polish

Now I had something that worked consistently, but left the last of the 10 commits waiting 14s! During a storm of writes, the wait time could easily be longer, maybe even hitting the timeout.

At this point, I revisited the “easy” locking solution I’d dismissed earlier. Now we had a solution for concurrent writes across multiple API servers, the extra lock for a single server could be added on top to minimize the retries on a single server.

```
func (b *Backend) POST(
    ctx context.Context, 
    path string, 
    body []byte,
) error {

    b.writeMtx.Lock()
    defer b.writeMtx.Unlock()
```

With this locking in place, the longest wait time went down to 7s!

This left a question of testing. The lock was essentially blocking the retries from ever being needed. I needed to make sure both solutions worked, so I doubled up the concurrency test, one instance with the locking enabled, and one without.

A more “realistic” test would be to actually have two concurrent backend instances serving a set of tests together. But that’s an improvement for next time!

# Next Steps

Speaking of next time, I’m getting close to something I could call production ready. For part 4, I’m going to finish up the implementation for PUT and DELETE, and try some more long-running tests.

# The whole series

-   [Part 1 - the naive approach](https://open.substack.com/pub/thefridaydeploy/p/can-git-back-a-rest-api-part-1-the)
    
-   [Part 2 - git protocols](https://open.substack.com/pub/thefridaydeploy/p/can-git-back-a-rest-api-part-2-git)
    
-   [Part 3 - concurrency](https://thefridaydeploy.substack.com/p/can-git-back-a-rest-api-part-3-concurrency)

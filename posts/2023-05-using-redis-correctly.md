---
title: "How I Stopped Fighting Redis and Started Using It Right"
slug: "using-redis-correctly"
date: "May 2023"
summary: "I used Redis as a fancy key-value store for two years before I understood what I was doing wrong. This is about the mental model shift that finally made everything click."
---

For a long time, my mental model of Redis was basically "fast database." I'd store things in it, retrieve them, set TTLs, move on. I thought I was using it well. I wasn't.

The moment I realized this was when we had a cache stampede. We'd set a TTL of 15 minutes on a fairly expensive computation — building the recommendation feed for a user. Popular users had high cache hit rates. But every 15 minutes, when their cache expired, multiple requests would arrive simultaneously, all miss the cache, all kick off the same expensive computation, and all try to write the result back at the same time. The database briefly buckled under the load.

## The Thundering Herd Problem

I'd heard the term before. I hadn't actually felt it. We were serving around 40,000 requests per minute at peak, with cache TTLs that I thought were staggered — except they weren't. Because we set all TTLs at ingestion time and ingested in batches, popular content would expire in coordinated waves. Classic.

The fix is well-known: add jitter to your TTLs. Instead of a fixed 900 seconds, use something like 900 plus a random offset between 0 and 120. It's embarrassingly simple and I'd just never thought to do it. We also added a distributed lock using `SET NX` so that only one worker would regenerate the cache entry while others returned the slightly stale value. The stale-while-revalidate pattern, essentially.

## Using Redis for What It's Actually Good At

After that incident I went back and actually read the Redis documentation. Not the getting-started guide — the actual docs on data structures and eviction policies. I'd been using Redis purely as a string store. I started using sorted sets for leaderboards and sliding-window rate limiting. I started using pub/sub for lightweight event signaling between services. I started treating eviction policies as a first-class configuration decision rather than something to leave at the default.

The thing about Redis that took me a while to internalize is that it's not trying to replace your database. It's a tool for a different class of problem — problems where you need sub-millisecond reads, or want to coordinate across multiple instances, or where the data genuinely doesn't need to be durable. When you use it for those things, it's remarkable. When you use it as a caching afterthought, you'll spend a lot of time debugging strange behavior.

I still occasionally set an eviction policy to `allkeys-lru` and then get surprised when something important gets evicted. But at least now I understand why it happened.

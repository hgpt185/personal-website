---
title: "The Day I Learned to Stop Trusting Default Connection Pool Sizes"
slug: "connection-pool-exhaustion"
date: "Feb 2024"
summary: "A late-night production incident, a flood of timeout errors, and the realization that the default pool size in my framework had been quietly waiting to fail. A story about connection pool exhaustion and how to actually think about sizing one."
---

It was 11 PM on a Wednesday. The kind of night where you're half-watching something on TV and keeping one eye on Slack. The PagerDuty alert came in at 11:17 — error rate on our order processing service had spiked from under 0.1% to 22% in about 90 seconds.

I pulled up the logs and saw thousands of "Timeout getting connection from pool" errors. The service itself wasn't down. The database wasn't down. The service just couldn't talk to the database. The connection pool was exhausted.

## What Actually Happened

We'd deployed a batch job that ran on a cron every 5 minutes, processing a queue of pending orders. The job was written to parallelize processing — it spun up 50 threads, each grabbing a connection from the pool. Our default pool size was 10. So the batch job was immediately saturating the entire pool, and all incoming API requests that needed a database connection were timing out waiting for one to become free.

The fix was fast — kill the batch job, error rate drops immediately. But the cause took a while to fully sit with. We'd been running with a default pool size of 10 for months. It had always been fine because we'd never had a burst consumer like this. The pool size was set when the service was first scaffolded, nobody had ever questioned it, and it had been sitting there quietly waiting to fail.

## How Connection Pools Are Actually Supposed to Be Sized

The rough heuristic I use now comes from HikariCP's documentation: `pool size = (core count × 2) + effective spindle count`. It's a reasonable starting point for CPU-bound workloads. For I/O-heavy services, the calculation shifts because threads are often just idle, waiting on database round-trips, which means you can support more concurrency.

More importantly, I started thinking about connection pools as a shared resource that needs to be budgeted across all consumers — not just the main request-handling path. That batch job should have had its own, separate pool with its own limit. Or it should have been throttled to use at most a fraction of the available connections. Instead it grabbed everything it could, as fast as it could, which is exactly what code does when you don't tell it not to.

I also added a pool utilization alert after this. If we're sitting at 80% capacity for more than 30 seconds, I want to know about it before it becomes an incident. That kind of headroom monitoring is trivial to add and has already surfaced two potential problems before they became pages.

## The Unexciting Lesson

The lesson here isn't glamorous. It's just: read the defaults in your framework, understand what they mean, and make a deliberate choice rather than accepting whatever was set when the project was initialized. A lot of production incidents trace back to a configuration value nobody ever questioned. Default pool size 10, default request timeout 30s, default heap 512m. These are conservative for a reason, and they will bite you if your traffic pattern ever grows beyond what the original author imagined.

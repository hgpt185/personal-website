---
title: "The N+1 Query That Cost Us $3k a Month"
slug: "n-plus-one-queries-production"
date: "Aug 2023"
summary: "What started as a slightly slow endpoint turned into a database query storm. Here's the full story: how we found it, why it was harder to fix than expected, and the money we were quietly bleeding."
---

It started with a Slack message. "Hey, the /orders endpoint feels slow on the dashboard." Not an alert, not a spike in our latency graphs. Just a message from the product team. The kind you acknowledge, add to the backlog, and forget about for three weeks.

I finally got around to it on a Tuesday afternoon. Opened Datadog, filtered to that endpoint, and saw p99 latency sitting at 1.4 seconds. Not terrible. Not good either. I figured there was probably a missing index somewhere.

## The Query Count That Made Me Wince

I set up query logging locally, reproduced the call, and scrolled through the output. I stopped counting after 180 individual SQL queries. For a single API request. The ORM was doing exactly what ORMs do when you don't think about them: fetching a list of orders, then for each order, fetching the customer, then fetching the customer's address, then the billing info. The classic N+1.

In hindsight, this was entirely my fault. I'd written the endpoint maybe four months earlier, used the ORM because it was fast to write, and tested it against a dataset of about 20 orders. In production, some users had thousands. The math gets ugly quickly.

## Why It Wasn't a Quick Fix

My first instinct was to just add eager-load calls and fetch everything in one shot. That worked, but it created a different problem. The JOIN was now returning a massive result set with a lot of repeated data. For customers with thousands of orders, we were pulling back megabytes just to render a paginated list.

We ended up going with a two-query approach. Fetch the paginated orders first, collect all the customer IDs, then do a single batch fetch for those customers. Not revolutionary, but it reduced query count from ~180 to 2. Latency dropped to about 80ms at p99.

## The Part That Still Bothers Me

When I looked at the RDS costs for that month, the difference was visible. Not enormous, but enough that our DBA sent a slightly pointed message about read IOPS. I ran the numbers backward. We'd been running this endpoint in production for about 3 months. The rough estimate came out around $3k in unnecessary database compute over that period.

What gets me is how invisible this kind of issue is until it isn't. There's no error. No crash. Just money quietly leaking out while everything appears to work fine. Profiling your database queries, actually looking at what your ORM generates, should probably be a step in code review for anything that touches production data. Lesson learned, I suppose.

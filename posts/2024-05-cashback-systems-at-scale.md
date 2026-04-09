---
title: "Designing Cashback Systems That Don't Lose Money"
slug: "cashback-systems-at-scale"
date: "May 2024"
summary: "At Porter, I built the backend for cashback and referral flows handling real production traffic. The hard part wasn't the logic - it was making sure money never appeared or disappeared due to race conditions, retries, or partial failures."
---

Money is the scariest data type in software. When you're building a cashback system, every bug is a financial bug. Credit a user twice and the company loses money. Fail to credit them and you lose trust. The margin for error is exactly zero, and the system has to handle concurrent requests, network failures, and retry storms without ever getting the number wrong.

At Porter, I was part of the Customer Growth & Engagement team, building the backend services that powered cashback rewards, referral bonuses, and transactional incentive flows. These weren't toy features. They ran against real production traffic, real users, real money.

## Idempotency Is Not Optional

The first thing I learned is that every financial operation needs an idempotency key. Period. Users double-tap buttons. Networks drop and clients retry. Queue consumers crash mid-processing and the message gets redelivered. If your cashback credit endpoint isn't idempotent, you will double-credit someone. It's not a question of if, it's when.

We used a pattern where every cashback event had a unique transaction ID generated at the source. The credit service would check this ID before processing. If it had already been processed, it returned the previous result without doing anything. Simple in concept, but the implementation details matter: the check-and-insert has to be atomic, otherwise two concurrent requests with the same ID can both pass the check before either writes.

In Ktor, we handled this with database-level unique constraints on the transaction ID column. If two requests raced, one would succeed and the other would hit a constraint violation, which we caught and treated as a successful duplicate. No distributed locks needed.

## The Referral Loop Problem

Referral systems have a fun edge case: circular referrals. User A refers User B, User B refers User C, User C refers User A. If your referral bonus is triggered on sign-up and you're not checking for cycles, you can create an infinite reward loop. We'd seen this exploited on other platforms, so we built cycle detection into the referral graph from day one.

The referral chain was modeled as a directed graph. Before crediting a referral bonus, we'd walk the chain backwards (up to a configurable depth) to check for cycles. If a cycle was detected, the referral was flagged for manual review instead of being auto-credited. In practice, legitimate referral chains rarely exceeded 2-3 levels, so the depth check was fast.

## Ktor and Dagger: Keeping It Clean

The service was built with Ktor for the HTTP layer and Dagger for dependency injection. Ktor's coroutine-based model was a natural fit for I/O-heavy financial operations, where most of the time is spent waiting on database writes and downstream service calls. We could handle high concurrency without the thread-per-request overhead.

Dagger kept the dependency graph explicit and compile-time verified. In a financial system, you really don't want runtime surprises from misconfigured dependencies. Every repository, every service client, every transaction manager was wired through Dagger modules. If something was missing, the build failed. That strictness felt like overhead at first, but it saved us multiple times when refactoring.

## Zero P0s

The thing I'm most proud of from this internship isn't a specific feature. It's that we shipped all of this to production and had zero P0 incidents across the entire period. No double-credits, no missing rewards, no data inconsistencies. For a financial system handling real user money at production scale, that's the metric that matters.

It wasn't luck. It was idempotency keys, atomic operations, comprehensive integration tests against a real database (not mocks), and a healthy paranoia about every edge case where money could be wrong. Financial software teaches you to be pessimistic about everything, and that pessimism is a feature.

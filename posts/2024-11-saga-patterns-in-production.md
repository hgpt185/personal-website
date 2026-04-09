---
title: "Saga Patterns in Production: What the Tutorials Don't Tell You"
slug: "saga-patterns-in-production"
date: "Nov 2024"
summary: "I implemented saga-based synchronization for Tableau Cloud Manager's User Service at Salesforce. The pattern looks elegant in diagrams. In production, it's a state machine that has to handle every ugly way a distributed system can partially fail."
---

Every blog post about the saga pattern shows the same diagram. A series of steps, each with a compensating action. Step 1 succeeds, step 2 succeeds, step 3 fails, so you run compensating actions for step 2 and step 1 in reverse order. Clean. Elegant. Completely insufficient for production.

At Salesforce, I work on Tableau Cloud Manager's User Service. When a user is created or modified, that change needs to propagate to Tableau Pods, which are the actual compute environments running Tableau workloads. This synchronization has to be reliable, ordered, and eventually consistent. We use a saga-based approach orchestrated through AWS Step Functions, and the gap between the textbook version and the production version is significant.

## Why Sagas

The User Service owns the canonical user record in DynamoDB. Tableau Pods have their own user stores. When we create a user, we need to provision them in the pod. When we update their license, we need to sync that change. When we deactivate them, the pod needs to know.

We can't use a distributed transaction because the pod APIs are external services with their own failure modes and latency characteristics. A two-phase commit across these boundaries would be fragile and slow. Sagas give us eventual consistency with explicit handling for partial failures.

## The State Machine Is the Hard Part

Step Functions gives you a state machine runtime, but you still have to design the states. Our user sync saga looks something like: validate the request, acquire a lock on the user record, write to DynamoDB, call the pod API, confirm the sync, release the lock. If the pod API fails, we retry with exponential backoff. If retries are exhausted, we mark the sync as failed and enqueue it for manual resolution.

The tricky part is the states between states. What happens if the Step Function execution itself fails between writing to DynamoDB and calling the pod API? Now DynamoDB has the new state but the pod doesn't. We handle this with a reconciliation process that periodically compares DynamoDB records against pod state and re-enqueues any that are out of sync. The saga handles the happy path and most failure paths. Reconciliation handles the rest.

## Multi-Region DynamoDB Adds Complexity

The User Service runs across multiple AWS regions for availability. DynamoDB global tables handle replication, but replication lag means that a write in one region isn't immediately visible in another. If a user is created in us-east-1 and the saga triggers in us-west-2 before replication completes, the saga reads stale data.

We mitigate this by ensuring that the saga always reads from the region where the write originated. The Step Function execution carries the source region as metadata, and the read operations are routed accordingly. It's one of those things that's invisible when it works and catastrophic when it doesn't.

## Bulk Operations and Backpressure

Single-user operations are straightforward. Bulk operations, like onboarding an enterprise customer with thousands of users, are where the saga pattern gets stressed. You can't fire 5,000 Step Function executions simultaneously without overwhelming the pod APIs. We built a throttling layer that controls the concurrency of active sagas, using a semaphore backed by DynamoDB's conditional writes.

The semaphore works like this: before starting a saga, the orchestrator attempts a conditional update on a counter record. If the current count is below the concurrency limit, it increments and proceeds. If not, it backs off and retries. This gives us predictable load on downstream services without requiring a centralized queue, which would be another single point of failure.

## Compensation Is Messier Than You Think

The textbook says "run compensating actions in reverse." In practice, compensating actions can also fail. If we successfully created a user in DynamoDB but the pod sync failed, the compensating action is to either roll back the DynamoDB write or mark it as pending-sync. But what if the rollback fails? Now you have a user record in a state that doesn't match anything.

We ended up with a compensation retry loop that's separate from the main saga. Failed compensations are written to a dead-letter queue with full context (what was the original operation, what succeeded, what failed, what compensation was attempted). An operator can inspect these and either retry or manually resolve. It's not elegant, but it's honest about the reality of distributed systems: sometimes the best you can do is make failures visible and recoverable.

## The Unsexy Truth

Saga patterns work. They're the right tool for coordinating multi-service operations without distributed transactions. But the production implementation is 80% error handling, retry logic, and reconciliation, and 20% the actual business logic. If you're evaluating whether to use sagas, don't look at the happy-path diagram. Look at how you'll handle every state where something is half-done, and make sure you have an answer for each one.

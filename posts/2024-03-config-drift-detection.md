---
title: "Building a Config Drift Detector That Files Its Own Bugs"
slug: "config-drift-detection"
date: "Mar 2024"
summary: "At Salesforce, I built a pipeline that pulls Tableau Cloud pod configs from GitLab and S3, diffs them against a golden baseline, auto-files defects in GUS, and alerts on Slack. Here's how I thought about making it fully autonomous."
---

Configuration drift is one of those problems that's boring right up until it causes an outage. A pod is running with slightly different settings than what's in the golden baseline. Maybe someone hotfixed a value during an incident and forgot to revert it. Maybe a deploy applied to 11 of 12 pods. The delta sits there, invisible, until something depends on consistency and breaks.

During my internship at Salesforce, I was tasked with building a pipeline to detect this drift across Tableau Cloud pods. The goal was simple to state and surprisingly tricky to execute: continuously compare what's running against what should be running, and when they diverge, make sure the right people know about it without any human having to check.

## The Architecture

The pipeline had three main data sources. Pod configurations lived in GitLab repos, one per pod. Some additional runtime configs were stored in S3 as JSON blobs. And the golden baseline, the canonical "this is what the config should look like," lived in its own repo with versioned snapshots.

The pipeline ran on a schedule, pulling the latest state from all three sources, normalizing the formats (GitLab configs were YAML, S3 was JSON, baseline was a mix), and running a structured diff. Not a raw text diff; that would've been noisy and useless. I built a semantic differ that understood the schema, ignored ordering differences in lists where order didn't matter, and flagged only meaningful deviations.

## Making It Autonomous

The part I'm most proud of is the zero-human-intervention loop. When drift was detected, the pipeline didn't just log it. It filed a defect in GUS (Salesforce's internal issue tracker) with the exact config keys that had drifted, the expected vs. actual values, and which pod was affected. It then posted a summary to the relevant team's Slack channel with a link to the defect.

This sounds straightforward, but getting the signal-to-noise ratio right took iteration. The first version filed a defect for every single diff, including things like timestamp fields that naturally diverge. Teams got flooded with noise and started ignoring the alerts entirely, which is worse than having no alerts at all.

I ended up building an allowlist system. Certain keys were marked as expected-to-diverge (timestamps, instance-specific identifiers, ephemeral cache settings). The differ skipped those entirely. Other keys were marked as soft-drift, meaning they'd generate a Slack notification but not a defect, for cases where teams intentionally ran slightly different configs for A/B testing. Only hard-drift, unexpected deviations on critical config keys, would trigger a GUS defect.

## The Hardest Part Was Testing

How do you test a drift detector? You need to simulate drift, which means you need a controlled environment where you can introduce known deviations and verify the pipeline catches exactly those and nothing else. I built a test harness that generated synthetic pod configs with injected drift, ran the pipeline against them, and asserted on the output (which defects were filed, which Slack messages were sent, which diffs were ignored).

The trickiest edge case was partial drift: a config value that was wrong in a way that was technically valid. For example, a timeout set to 30 seconds instead of the baseline's 60 seconds. Both are valid integers, neither causes an immediate error, but the deviation could cause subtle behavior differences under load. The pipeline had to treat any deviation from baseline as drift, regardless of whether the new value was "valid."

## What I Took Away

This project taught me that automation isn't just about replacing manual work. It's about building systems that maintain invariants you can't afford to check by hand. Nobody was going to manually compare configs across a dozen pods every day. The drift would accumulate silently. The pipeline turned an invisible problem into a visible, trackable, assignable one. That's the kind of engineering I find satisfying: not flashy, but it quietly prevents the incidents that would've been flashy.

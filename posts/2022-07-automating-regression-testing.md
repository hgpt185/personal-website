---
title: "Why I Automated 400 Manual Test Cases in My First Internship"
slug: "automating-regression-testing"
date: "Jul 2022"
summary: "My first internship at Samsung taught me that the fastest way to earn a team's trust is to kill the work nobody wants to do. I replaced hours of manual QA with a Selenium + Pytest suite and learned more about software than any classroom ever taught me."
---

My first real engineering internship was at Samsung. I was 20, nervous, and had no idea what "regression testing" meant beyond a vague sense that it involved running the same tests over and over. Turns out, that's exactly what it meant, and the team had been doing it by hand.

Every release cycle, a QA engineer would open a spreadsheet with roughly 400 test cases, open a browser, and start clicking. Login flow, navigation, form submissions, edge cases around locale settings. It took the better part of two days. By the time they were done, the next cycle was already approaching.

## The Pitch

I asked my manager if I could try automating some of it. He said sure, pick a few flows and see how far you get. I think he expected me to automate maybe 20 or 30 cases and write a report about it. I ended up automating all of them.

The stack was straightforward: Selenium WebDriver for browser automation, Pytest as the test runner, and a simple page object model to keep the selectors organized. Nothing fancy. The real work wasn't in the tooling, it was in translating vague spreadsheet descriptions like "verify user can navigate to settings" into deterministic, repeatable assertions.

## The Part Nobody Warns You About

Flaky tests. That was the real enemy. A test that passes 95% of the time is worse than no test at all, because it teaches people to ignore failures. I spent more time fighting race conditions and timing issues than writing actual test logic.

The browser renders asynchronously. Elements appear on the page before they're interactive. Animations delay visibility. Network requests complete at different speeds depending on server load. My first version of the suite had about a 70% pass rate on any given run, not because the app was broken, but because I was asserting on elements before they were ready.

The fix was explicit waits everywhere. Not `time.sleep(3)`, which is the amateur move I started with, but `WebDriverWait` with expected conditions. Wait until this element is clickable. Wait until this text appears. Wait until this spinner disappears. It's tedious to write, but it turned the suite from unreliable noise into something the team actually trusted.

## What I Actually Learned

The technical skills were useful, but the real lesson was about leverage. A two-day manual process became a 40-minute automated run. That's not a marginal improvement. That's the kind of change that shifts what a team can do with their time. The QA engineer who'd been running those tests manually started spending that time on exploratory testing and finding actual bugs, the kind of creative work that humans are good at and scripts aren't.

I also learned that the barrier to automation isn't usually technical. It's inertia. The team had been doing manual regression for years. Not because they didn't know automation existed, but because nobody had carved out the time to set it up. Sometimes the most valuable thing an intern can do is tackle the thing everyone's been tolerating.

Looking back, this internship shaped how I think about engineering more than I realized at the time. The best code isn't clever. It's the code that quietly removes a bottleneck and lets people focus on harder problems.

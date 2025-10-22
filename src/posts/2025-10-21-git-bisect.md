---
layout: post.njk
title: Git Bisect Makes Bug Hunting Easy
date: 2025-10-21
excerpt: Learned how to use git bisect to efficiently find the commit that introduced a bug using binary search.
---

Today I finally learned how to properly use `git bisect` and it's an absolute lifesaver for finding bugs!

## The Problem

You know a bug exists now, and you know it didn't exist 50 commits ago. How do you find which commit introduced it without checking each one manually?

## Enter Git Bisect

Git bisect uses binary search to find the problematic commit in O(log n) time!

```bash
# Start the bisect session
git bisect start

# Mark the current commit as bad
git bisect bad

# Mark a known good commit (e.g., from 2 weeks ago)
git bisect good abc123

# Git checks out a commit in the middle
# Test if the bug exists, then mark it:
git bisect good  # or git bisect bad

# Repeat until git finds the first bad commit
```

## Automating It

You can even automate the testing:

```bash
git bisect start HEAD abc123
git bisect run npm test
```

Git will automatically test each commit and find the culprit!

## My Experience

I had a bug that was introduced somewhere in the last 60 commits. Instead of manually checking commits for hours, `git bisect` found it in about 6 steps (log₂(60) ≈ 6).

This tool is a must-know for any developer working with Git!

---
layout: post.njk
title: HTTP 103 Early Hints Can Speed Up Your Site
date: 2025-10-20
excerpt: Discovered the HTTP 103 status code that lets servers send hints about resources while generating the main response.
---

Today I learned about **HTTP 103 Early Hints** - a relatively new status code that can significantly improve page load times!

## What Is It?

HTTP 103 is an informational status code that allows the server to send headers with hints about resources the page will need, *while* the server is still preparing the main response.

## How It Works

```http
HTTP/1.1 103 Early Hints
Link: </style.css>; rel=preload; as=style
Link: </script.js>; rel=preload; as=script

HTTP/1.1 200 OK
Content-Type: text/html
...
```

The browser receives the 103 response first and starts downloading the CSS and JavaScript immediately, even before receiving the HTML!

## Real-World Impact

- **Cloudflare reported** 30% faster page loads for some sites
- **Shopify saw** improvements of 20% on time-to-first-byte metrics
- Works best when your server has processing time before responding (database queries, API calls, etc.)

## Browser Support

Supported in:
- Chrome/Edge 103+
- Firefox 103+
- Safari 16.4+

## When To Use

Best for:
- Sites with server-side rendering that takes time
- When you know what resources will be needed before generating HTML
- Dynamic pages where the resource list is predictable

This is a simple optimization that can have a big impact on perceived performance!

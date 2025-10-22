# TiL Microblog

A clean, minimal microblog for daily "Today I Learned" (TiL) entries. Built with Eleventy for easy maintenance and deployment.

## Features

- **Static Site Generation**: Fast, secure, and easy to host anywhere
- **Colorblind-Friendly Themes**: Toggle between light and dark modes with accessible color palettes
- **Markdown Posts**: Write posts in simple Markdown format
- **Zero Configuration**: Works out of the box
- **Mobile Responsive**: Looks great on all devices

## Getting Started

### Prerequisites

- Node.js 14+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The site will be available at `http://localhost:8080` with live reload.

### Building for Production

```bash
# Build static files
npm run build
```

The output will be in the `_site/` directory, ready to deploy.

## Writing Posts

Create a new Markdown file in `src/posts/` with the following format:

```markdown
---
layout: post.njk
title: Your Post Title
date: 2025-10-22
excerpt: A brief description of what you learned (optional)
---

Your content here in Markdown...

## Headings work

- Lists work
- Code blocks work

\`\`\`javascript
console.log('Code syntax highlighting works too!');
\`\`\`
```

### Post Naming Convention

Use this format: `YYYY-MM-DD-post-slug.md`

Example: `2025-10-22-css-container-queries.md`

## Deployment

This static site can be deployed anywhere. Here are some popular options:

### Netlify (Recommended)

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `_site`

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

### Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Build command: `npm run build`
4. Output directory: `_site`

### GitHub Pages

```bash
# Build the site
npm run build

# Deploy to GitHub Pages (using gh-pages branch)
npx gh-pages -d _site
```

### Cloudflare Pages

1. Push your code to GitHub
2. Connect your repository to Cloudflare Pages
3. Build command: `npm run build`
4. Build output directory: `_site`

## Project Structure

```
j14i/
├── src/
│   ├── _includes/          # Layout templates
│   │   ├── base.njk        # Base HTML layout
│   │   └── post.njk        # Post layout
│   ├── css/
│   │   └── style.css       # Styles with theme support
│   ├── posts/              # Your TiL posts (Markdown)
│   │   └── *.md
│   └── index.njk           # Homepage
├── _site/                  # Generated output (git ignored)
├── .eleventy.js            # Eleventy configuration
└── package.json
```

## Customization

### Changing Theme Colors

Edit `src/css/style.css` and modify the CSS variables:

```css
:root {
  --accent: #58a6ff;        /* Change accent color */
  --bg-primary: #0d1117;    /* Change background */
  /* ... */
}
```

### Changing Site Title

Edit `src/_includes/base.njk` to change the site title and subtitle.

## Technology Stack

- **Eleventy (11ty)**: Static site generator
- **Nunjucks**: Templating engine
- **Markdown**: Content format
- **CSS Variables**: Theme system
- **Vanilla JavaScript**: Theme switcher

## License

MIT

## Contributing

This is a personal microblog, but feel free to fork and adapt for your own use!

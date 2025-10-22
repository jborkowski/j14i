# TiL Microblog

A clean, minimal microblog for daily "Today I Learned" (TiL) entries. Built with Eleventy for easy maintenance and deployment.

## Features

- **Apple Notes Integration**: Seamlessly import notes from Apple Notes with one command (macOS only)
- **Social Media Feed UI**: Clean, Twitter/Facebook-style timeline interface with avatars and relative timestamps
- **Static Site Generation**: Fast, secure, and easy to host anywhere
- **Colorblind-Friendly Themes**: Toggle between light and dark modes with accessible color palettes
- **Markdown Posts**: Write posts in simple Markdown format or import from Apple Notes
- **One-Click Publish**: Fetch latest note and build site with a single command
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

## Apple Notes Integration (macOS only)

The easiest way to add content! Write your TiL notes in Apple Notes and import them with one command.

### Quick Workflow

```bash
# Fetch and publish latest note in one command
npm run publish
```

This will:
1. Get your latest note from Apple Notes
2. Convert it to Markdown
3. Add it to your blog
4. Build the site

### Detailed Commands

```bash
# Fetch latest note from Apple Notes and add to blog
npm run fetch-latest

# Fetch multiple notes (shows list to review before importing)
npm run fetch-notes
npm run import-notes
```

### Setting Up Apple Notes

For best results, create a folder called "TiL" in Apple Notes and keep your blog posts there. The scripts will:
- Look for notes in the "TiL" folder first
- Fall back to all notes if no "TiL" folder exists
- Convert HTML content to Markdown automatically
- Extract title and excerpt from your note
- Use the note's modification date as the post date

### Tips for Writing in Apple Notes

- **First line becomes the title**: Make it descriptive
- **Use headings**: They convert to Markdown headers
- **Format as usual**: Bold, italic, lists, and code blocks all convert properly
- **Links work**: URLs in Apple Notes become Markdown links

## Writing Posts Manually

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
├── scripts/
│   ├── fetch-latest.js     # Import latest note from Apple Notes
│   ├── fetch-notes.js      # Fetch multiple notes
│   └── import-notes.js     # Import fetched notes to blog
├── src/
│   ├── _includes/          # Layout templates
│   │   ├── base.njk        # Base HTML layout
│   │   └── post.njk        # Post layout
│   ├── css/
│   │   └── style.css       # Feed-style UI with theme support
│   ├── posts/              # Your TiL posts (Markdown)
│   │   └── *.md
│   └── index.njk           # Homepage timeline
├── _site/                  # Generated output (git ignored)
├── .notes-cache/           # Temporary notes storage (git ignored)
├── .eleventy.js            # Eleventy configuration
└── package.json
```

## Available npm Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start development server with live reload |
| `npm run build` | Build static site for production |
| `npm run fetch-latest` | Fetch and import latest note from Apple Notes |
| `npm run fetch-notes` | Fetch multiple notes from Apple Notes |
| `npm run import-notes` | Import previously fetched notes |
| `npm run publish` | One-click: fetch latest note and build site |

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
- **CSS Variables**: Theme system with colorblind-friendly palettes
- **Vanilla JavaScript**: Theme switcher and feed interactions
- **AppleScript**: Apple Notes integration (macOS)
- **Turndown**: HTML to Markdown conversion
- **date-fns**: Date formatting and relative time display

## License

MIT

## Contributing

This is a personal microblog, but feel free to fork and adapt for your own use!

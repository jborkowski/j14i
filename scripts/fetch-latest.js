#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const TurndownService = require('turndown');
const slugify = require('slugify');
const { format } = require('date-fns');

// Initialize Turndown for HTML to Markdown conversion
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});

// AppleScript to get the latest note
const appleScript = `
tell application "Notes"
  -- Get the most recent note
  try
    set tilFolder to folder "TiL"
    set latestNote to item 1 of (notes of tilFolder)
  on error
    -- If no TiL folder, get latest from default account
    set latestNote to item 1 of (notes of default account)
  end try

  set noteTitle to name of latestNote
  set noteBody to body of latestNote
  set noteDate to creation date of latestNote
  set noteModified to modification date of latestNote

  -- Format: title|||body|||creationDate|||modifiedDate
  return noteTitle & "|||" & noteBody & "|||" & (noteDate as string) & "|||" & (noteModified as string)
end tell
`;

function parseAppleScriptDate(dateStr) {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return new Date();
    }
    return date;
  } catch (e) {
    return new Date();
  }
}

function createSlug(title) {
  return slugify(title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  });
}

function htmlToMarkdown(html) {
  let cleaned = html
    .replace(/<div>/g, '\n')
    .replace(/<\/div>/g, '\n')
    .replace(/<br>/g, '\n')
    .replace(/<br\/>/g, '\n');

  return turndownService.turndown(cleaned).trim();
}

function extractExcerpt(markdown) {
  const paragraphs = markdown.split('\n\n');
  const firstPara = paragraphs.find(p => p.trim().length > 0) || '';

  if (firstPara.length > 150) {
    return firstPara.substring(0, 147) + '...';
  }
  return firstPara;
}

async function fetchLatestNote() {
  console.log('📝 Fetching latest note from Apple Notes...\n');

  try {
    const result = execSync(`osascript -e '${appleScript.replace(/'/g, "'\\''")}'`, {
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024
    });

    if (!result || result.trim() === '') {
      console.log('❌ No notes found in Apple Notes.');
      process.exit(1);
    }

    const parts = result.split('|||');
    if (parts.length !== 4) {
      console.log('❌ Error parsing note data.');
      process.exit(1);
    }

    const [title, htmlBody, creationDate, modifiedDate] = parts;
    const markdown = htmlToMarkdown(htmlBody);
    const date = parseAppleScriptDate(modifiedDate);
    const excerpt = extractExcerpt(markdown);

    const note = {
      title: title.trim(),
      body: markdown,
      date,
      excerpt,
      dateStr: format(date, 'yyyy-MM-dd'),
      slug: createSlug(title.trim())
    };

    console.log(`📄 Latest note: "${note.title}"`);
    console.log(`📅 Date: ${note.dateStr}`);
    console.log(`📝 Excerpt: ${note.excerpt.substring(0, 80)}${note.excerpt.length > 80 ? '...' : ''}\n`);

    // Save to posts directory
    const postsDir = path.join(__dirname, '..', 'src', 'posts');
    const filename = `${note.dateStr}-${note.slug}.md`;
    const filepath = path.join(postsDir, filename);

    if (fs.existsSync(filepath)) {
      console.log('⚠️  Note already exists. Overwriting...\n');
    }

    const frontmatter = `---
layout: post.njk
title: ${note.title}
date: ${note.date.toISOString()}
excerpt: ${note.excerpt}
---

${note.body}
`;

    fs.writeFileSync(filepath, frontmatter);
    console.log(`✅ Imported: ${filename}`);
    console.log('');
    console.log('Run "npm run build" to build your site, or "npm start" to preview.\n');

  } catch (error) {
    if (error.message.includes('osascript')) {
      console.error('❌ Error: This script requires macOS with Apple Notes installed.');
      console.error('Make sure Apple Notes is accessible and you have notes in your library.\n');
    } else {
      console.error('❌ Error fetching note:', error.message);
    }
    process.exit(1);
  }
}

fetchLatestNote().catch(console.error);

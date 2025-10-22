#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function importNotes() {
  console.log('📥 Importing notes to blog...\n');

  const cacheFile = path.join(__dirname, '..', '.notes-cache', 'notes.json');

  if (!fs.existsSync(cacheFile)) {
    console.error('❌ No notes found. Run "npm run fetch-notes" first.\n');
    process.exit(1);
  }

  const notes = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));

  if (notes.length === 0) {
    console.log('No notes to import.');
    rl.close();
    return;
  }

  console.log(`Found ${notes.length} note(s) to import:\n`);

  notes.forEach((note, index) => {
    console.log(`${index + 1}. ${note.title} (${note.dateStr})`);
  });

  console.log('');
  const answer = await question('Import all notes? (y/n): ');

  if (answer.toLowerCase() !== 'y') {
    console.log('Import cancelled.');
    rl.close();
    return;
  }

  const postsDir = path.join(__dirname, '..', 'src', 'posts');
  let imported = 0;
  let skipped = 0;

  for (const note of notes) {
    const filename = `${note.dateStr}-${note.slug}.md`;
    const filepath = path.join(postsDir, filename);

    // Check if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`⏭️  Skipping "${note.title}" - already exists`);
      skipped++;
      continue;
    }

    // Create frontmatter
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
    imported++;
  }

  console.log('');
  console.log(`📊 Import complete!`);
  console.log(`   Imported: ${imported}`);
  console.log(`   Skipped: ${skipped}`);
  console.log('');
  console.log('Run "npm run build" to build your site, or "npm start" to preview.\n');

  rl.close();
}

importNotes().catch(error => {
  console.error('❌ Error:', error.message);
  rl.close();
  process.exit(1);
});

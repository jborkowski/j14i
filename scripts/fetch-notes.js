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

// AppleScript to get notes from Apple Notes
const appleScript = `
tell application "Notes"
  set notesList to {}

  -- Get all notes from the "TiL" folder (or default folder if TiL doesn't exist)
  try
    set tilFolder to folder "TiL"
    set allNotes to notes of tilFolder
  on error
    -- If no TiL folder, get all notes from default account
    set allNotes to notes of default account
  end try

  -- Get the last 10 notes (or all if less than 10)
  set noteCount to count of allNotes
  if noteCount > 10 then
    set notesToProcess to items 1 thru 10 of allNotes
  else
    set notesToProcess to allNotes
  end if

  -- Process each note
  repeat with aNote in notesToProcess
    set noteTitle to name of aNote
    set noteBody to body of aNote
    set noteDate to creation date of aNote
    set noteModified to modification date of aNote

    -- Format: title|||body|||creationDate|||modifiedDate
    set noteData to noteTitle & "|||" & noteBody & "|||" & (noteDate as string) & "|||" & (noteModified as string)
    set end of notesList to noteData
  end repeat

  -- Return notes separated by special delimiter
  set AppleScript's text item delimiters to "###NOTESEPARATOR###"
  return notesList as text
end tell
`;

function parseAppleScriptDate(dateStr) {
  // Apple Script date format: "Monday, October 22, 2025 at 7:40:00 PM"
  // Convert to ISO format for JavaScript
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
  // Remove Apple Notes specific tags
  let cleaned = html
    .replace(/<div>/g, '\n')
    .replace(/<\/div>/g, '\n')
    .replace(/<br>/g, '\n')
    .replace(/<br\/>/g, '\n');

  return turndownService.turndown(cleaned).trim();
}

function extractExcerpt(markdown) {
  // Get first paragraph or first 150 characters
  const paragraphs = markdown.split('\n\n');
  const firstPara = paragraphs.find(p => p.trim().length > 0) || '';

  if (firstPara.length > 150) {
    return firstPara.substring(0, 147) + '...';
  }
  return firstPara;
}

async function fetchNotes() {
  console.log('📝 Fetching notes from Apple Notes...\n');

  try {
    // Execute AppleScript
    const result = execSync(`osascript -e '${appleScript.replace(/'/g, "'\\''")}'`, {
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer
    });

    if (!result || result.trim() === '') {
      console.log('No notes found in Apple Notes.');
      return [];
    }

    // Parse the results
    const notesData = result.split('###NOTESEPARATOR###');
    const notes = [];

    for (const noteData of notesData) {
      if (!noteData.trim()) continue;

      const parts = noteData.split('|||');
      if (parts.length !== 4) continue;

      const [title, htmlBody, creationDate, modifiedDate] = parts;
      const markdown = htmlToMarkdown(htmlBody);
      const date = parseAppleScriptDate(modifiedDate); // Use modified date as it's more recent
      const excerpt = extractExcerpt(markdown);

      notes.push({
        title: title.trim(),
        body: markdown,
        date,
        excerpt,
        dateStr: format(date, 'yyyy-MM-dd'),
        slug: createSlug(title.trim())
      });
    }

    return notes;

  } catch (error) {
    if (error.message.includes('osascript')) {
      console.error('❌ Error: This script requires macOS with Apple Notes installed.');
      console.error('Make sure Apple Notes is accessible and you have notes in your library.\n');
    } else {
      console.error('❌ Error fetching notes:', error.message);
    }
    return [];
  }
}

async function main() {
  const notes = await fetchNotes();

  if (notes.length === 0) {
    console.log('No notes to display.');
    return;
  }

  console.log(`Found ${notes.length} note(s):\n`);

  notes.forEach((note, index) => {
    console.log(`${index + 1}. ${note.title}`);
    console.log(`   Date: ${note.dateStr}`);
    console.log(`   Excerpt: ${note.excerpt.substring(0, 80)}${note.excerpt.length > 80 ? '...' : ''}`);
    console.log('');
  });

  // Save notes data for the import script
  const dataDir = path.join(__dirname, '..', '.notes-cache');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(dataDir, 'notes.json'),
    JSON.stringify(notes, null, 2)
  );

  console.log('✅ Notes fetched successfully!');
  console.log('Run "npm run import-notes" to import them to your blog.\n');
}

main().catch(console.error);

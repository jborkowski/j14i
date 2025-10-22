#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 Running E2E tests...\n');

let exitCode = 0;

// Test 1: Check if build directory exists
console.log('Test 1: Checking if build can complete...');
try {
  const { execSync } = require('child_process');
  execSync('npm run build', { stdio: 'pipe' });
  console.log('✅ Build completed successfully\n');
} catch (error) {
  console.error('❌ Build failed\n');
  exitCode = 1;
}

// Test 2: Verify critical files exist
console.log('Test 2: Verifying critical files...');
const criticalFiles = [
  '_site/index.html',
  '_site/css/style.css',
];

criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.error(`❌ ${file} is missing`);
    exitCode = 1;
  }
});
console.log('');

// Test 3: Verify posts directory
console.log('Test 3: Verifying posts...');
const postsDir = '_site/posts';
if (fs.existsSync(postsDir)) {
  const posts = fs.readdirSync(postsDir);
  if (posts.length > 0) {
    console.log(`✅ Found ${posts.length} post(s)`);
  } else {
    console.warn('⚠️  No posts found (this is ok for a new site)');
  }
} else {
  console.error('❌ Posts directory missing');
  exitCode = 1;
}
console.log('');

// Test 4: Validate HTML structure
console.log('Test 4: Validating HTML structure...');
try {
  const indexHtml = fs.readFileSync('_site/index.html', 'utf-8');

  const checks = [
    { name: 'DOCTYPE', pattern: /<!DOCTYPE html>/i },
    { name: 'Title tag', pattern: /<title>.*TiL Microblog.*<\/title>/i },
    { name: 'CSS link', pattern: /<link.*href="\/css\/style\.css"/ },
    { name: 'Post list', pattern: /class="post-list"/ },
    { name: 'Theme toggle', pattern: /class="theme-toggle"/ },
    { name: 'JavaScript', pattern: /<script>/ },
  ];

  checks.forEach(check => {
    if (check.pattern.test(indexHtml)) {
      console.log(`✅ ${check.name} found`);
    } else {
      console.error(`❌ ${check.name} missing`);
      exitCode = 1;
    }
  });
} catch (error) {
  console.error('❌ Could not read index.html');
  exitCode = 1;
}
console.log('');

// Test 5: Check CSS file
console.log('Test 5: Validating CSS...');
try {
  const css = fs.readFileSync('_site/css/style.css', 'utf-8');

  const cssChecks = [
    { name: 'CSS variables', pattern: /--bg-primary/ },
    { name: 'Dark theme', pattern: /:root/ },
    { name: 'Light theme', pattern: /\[data-theme="light"\]/ },
    { name: 'Feed styles', pattern: /\.post-list/ },
    { name: 'Theme toggle styles', pattern: /\.theme-toggle/ },
  ];

  cssChecks.forEach(check => {
    if (check.pattern.test(css)) {
      console.log(`✅ ${check.name} found`);
    } else {
      console.error(`❌ ${check.name} missing`);
      exitCode = 1;
    }
  });
} catch (error) {
  console.error('❌ Could not read style.css');
  exitCode = 1;
}
console.log('');

// Test 6: Verify package.json scripts
console.log('Test 6: Verifying npm scripts...');
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

  const requiredScripts = [
    'start',
    'build',
    'fetch-latest',
    'fetch-notes',
    'import-notes',
    'publish'
  ];

  requiredScripts.forEach(script => {
    if (pkg.scripts[script]) {
      console.log(`✅ Script '${script}' exists`);
    } else {
      console.error(`❌ Script '${script}' missing`);
      exitCode = 1;
    }
  });
} catch (error) {
  console.error('❌ Could not read package.json');
  exitCode = 1;
}
console.log('');

// Summary
console.log('═══════════════════════════════════════');
if (exitCode === 0) {
  console.log('✅ All E2E tests passed!');
} else {
  console.log('❌ Some tests failed');
}
console.log('═══════════════════════════════════════\n');

process.exit(exitCode);

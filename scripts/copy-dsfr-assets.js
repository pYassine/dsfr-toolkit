#!/usr/bin/env node
/**
 * Copy DSFR assets from node_modules to assets/dsfr for deployment
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SOURCE = path.join(ROOT, 'node_modules/@gouvfr/dsfr/dist');
const TARGET = path.join(ROOT, 'assets/dsfr');

const FILES = [
  'dsfr.min.css',
  'dsfr.module.min.js',
  'utility/icons/icons.min.css',
  'utility/colors/colors.min.css',
  'utility/utility.min.css',
  'favicon/favicon.ico',
  'favicon/favicon.svg',
  'favicon/apple-touch-icon.png'
];

const DIRECTORIES = [
  'fonts',
  'icons'
];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
  console.log(`✓ ${path.relative(ROOT, dest)}`);
}

function copyDirectory(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`⚠ Directory not found: ${src}`);
    return;
  }

  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
  console.log(`✓ ${path.relative(ROOT, dest)}/ (directory)`);
}

// Clean target
if (fs.existsSync(TARGET)) {
  fs.rmSync(TARGET, { recursive: true });
}

console.log('Copying DSFR assets...\n');

FILES.forEach(file => {
  copyFile(
    path.join(SOURCE, file),
    path.join(TARGET, file)
  );
});

console.log('\nCopying directories...\n');

DIRECTORIES.forEach(dir => {
  copyDirectory(
    path.join(SOURCE, dir),
    path.join(TARGET, dir)
  );
});

console.log('\n✓ Done!');

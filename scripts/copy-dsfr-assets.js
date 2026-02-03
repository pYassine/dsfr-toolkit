#!/usr/bin/env node
/**
 * Copy DSFR assets from node_modules to assets/dsfr for deployment
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DSFR_SOURCE = path.join(ROOT, 'node_modules/@gouvfr/dsfr/dist');
const DSFR_TARGET = path.join(ROOT, 'assets/dsfr');
const REMIX_SOURCE = path.join(ROOT, 'node_modules/remixicon/fonts');
const REMIX_TARGET = path.join(ROOT, 'assets/remixicon/fonts');

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

// Clean targets
if (fs.existsSync(DSFR_TARGET)) {
  fs.rmSync(DSFR_TARGET, { recursive: true });
}
if (fs.existsSync(REMIX_TARGET)) {
  fs.rmSync(REMIX_TARGET, { recursive: true });
}

console.log('Copying DSFR assets...\n');

FILES.forEach(file => {
  copyFile(
    path.join(DSFR_SOURCE, file),
    path.join(DSFR_TARGET, file)
  );
});

console.log('\nCopying DSFR directories...\n');

DIRECTORIES.forEach(dir => {
  copyDirectory(
    path.join(DSFR_SOURCE, dir),
    path.join(DSFR_TARGET, dir)
  );
});

console.log('\nCopying Remix Icon assets...\n');

copyDirectory(REMIX_SOURCE, REMIX_TARGET);

console.log('\n✓ Done!');

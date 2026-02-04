#!/usr/bin/env node
/**
 * Extract DSFR icons and colors
 *
 * Usage:
 *   node extract-dsfr.js
 *   node extract-dsfr.js --output ./src/data
 */

const fs = require("node:fs");
const path = require("node:path");

// Config
const args = process.argv.slice(2);
const getArg = (flag, defaultValue) => {
  const index = args.indexOf(flag);
  return index !== -1 ? args[index + 1] : defaultValue;
};

const dsfrPath = "./node_modules/@gouvfr/dsfr/dist";
const outputDir = getArg("--output", "./src/data");

// ============================================
// ICONS
// ============================================
function extractIcons() {
  const iconsPath = path.join(dsfrPath, "icons");

  if (!fs.existsSync(iconsPath)) {
    console.error(`❌ Dossier introuvable: ${iconsPath}`);
    return null;
  }

  const getFiles = (dir, files = []) => {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        getFiles(fullPath, files);
      } else if (item.name.endsWith(".svg")) {
        files.push(fullPath);
      }
    }
    return files;
  };

  const files = getFiles(iconsPath);
  const icons = {};

  for (const file of files) {
    const relativePath = path.relative(iconsPath, file);
    const parts = relativePath.split(path.sep);
    const category = parts[0];
    const iconName = path.basename(file, ".svg");

    // Remove fr-- prefix from icon name for CSS class
    const cleanName = iconName.replace(/^fr--/, "");

    if (!icons[category]) icons[category] = [];
    icons[category].push({
      name: iconName,
      class: `fr-icon-${cleanName}`,
      file: relativePath,
    });
  }

  // Trier
  const sorted = {};
  Object.keys(icons)
    .sort()
    .forEach((cat) => {
      sorted[cat] = icons[cat].sort((a, b) => a.name.localeCompare(b.name));
    });

  const total = Object.values(sorted).flat().length;
  const categories = Object.keys(sorted).length;

  return {
    meta: {
      generatedAt: new Date().toISOString(),
      source: iconsPath,
      totalIcons: total,
      totalCategories: categories,
    },
    categories: sorted,
  };
}

// ============================================
// COLORS
// ============================================
function extractColors() {
  const cssPath = path.join(dsfrPath, "utility/colors/colors.css");

  if (!fs.existsSync(cssPath)) {
    console.error(`❌ Fichier introuvable: ${cssPath}`);
    return null;
  }

  const css = fs.readFileSync(cssPath, "utf-8");
  const classRegex = /\.(fr-(background|text)-[a-z0-9-]+)\s*\{[^}]*?(background-color|color):\s*var\(([^)]+)\)/g;

  const backgrounds = {};
  const texts = {};

  let match;
  while ((match = classRegex.exec(css)) !== null) {
    const className = match[1];
    const type = match[2];
    const cssVar = match[4];

    const parts = className.match(/fr-(background|text)-([a-z-]+)--([a-z0-9-]+)/);
    if (!parts) continue;

    const variant = parts[2];
    const color = parts[3];

    const entry = { class: className, cssVar, color };

    if (type === "background") {
      if (!backgrounds[variant]) backgrounds[variant] = [];
      if (!backgrounds[variant].find((e) => e.class === className)) {
        backgrounds[variant].push(entry);
      }
    } else {
      if (!texts[variant]) texts[variant] = [];
      if (!texts[variant].find((e) => e.class === className)) {
        texts[variant].push(entry);
      }
    }
  }

  const sortEntries = (obj) => {
    const sorted = {};
    Object.keys(obj)
      .sort()
      .forEach((key) => {
        sorted[key] = obj[key].sort((a, b) => a.color.localeCompare(b.color));
      });
    return sorted;
  };

  return {
    meta: {
      generatedAt: new Date().toISOString(),
      source: cssPath,
      totalBackgrounds: Object.values(backgrounds).flat().length,
      totalTexts: Object.values(texts).flat().length,
    },
    background: sortEntries(backgrounds),
    text: sortEntries(texts),
  };
}

// ============================================
// MAIN
// ============================================
function main() {
  console.log("🎨 Extraction DSFR\n");

  if (!fs.existsSync(dsfrPath)) {
    console.error(`❌ DSFR non trouvé: ${dsfrPath}`);
    console.error('   Lance "pnpm install" d\'abord.');
    process.exit(1);
  }

  // Créer le dossier de sortie
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Icons
  const icons = extractIcons();
  if (icons) {
    const iconsFile = path.join(outputDir, "dsfr-icons.json");
    fs.writeFileSync(iconsFile, JSON.stringify(icons, null, 2));
    console.log(`✅ ${icons.meta.totalIcons} icônes (${icons.meta.totalCategories} catégories)`);
    console.log(`   → ${iconsFile}`);
  }

  // Colors
  const colors = extractColors();
  if (colors) {
    const colorsFile = path.join(outputDir, "dsfr-colors.json");
    fs.writeFileSync(colorsFile, JSON.stringify(colors, null, 2));
    console.log(`✅ ${colors.meta.totalBackgrounds} backgrounds, ${colors.meta.totalTexts} texts`);
    console.log(`   → ${colorsFile}`);
  }

  console.log("\n🎉 Terminé !");
}

main();

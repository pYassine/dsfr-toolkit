#!/usr/bin/env node
/**
 * Extract Remix Icons
 *
 * Usage:
 *   node extract-remix.js
 *   node extract-remix.js --output ./src/data
 */

const fs = require("node:fs");
const path = require("node:path");

// Config
const args = process.argv.slice(2);
const getArg = (flag, defaultValue) => {
  const index = args.indexOf(flag);
  return index !== -1 ? args[index + 1] : defaultValue;
};

const remixPath = "./node_modules/remixicon/fonts/remixicon.css";
const outputDir = getArg("--output", "./src/data");

function extractRemixIcons() {
  if (!fs.existsSync(remixPath)) {
    console.error(`❌ Remix Icon non trouvé: ${remixPath}`);
    return null;
  }

  const css = fs.readFileSync(remixPath, "utf-8");

  // Extraire les classes d'icônes (format: .ri-icon-name-line:before, .ri-icon-name-fill:before)
  const iconRegex = /\.ri-([a-z0-9-]+)-(line|fill):before/g;
  const iconsMap = {};

  let match;
  while ((match = iconRegex.exec(css)) !== null) {
    const iconName = match[1];
    const variant = match[2];
    const fullName = `${iconName}-${variant}`;

    if (!iconsMap[iconName]) {
      iconsMap[iconName] = {
        name: iconName,
        variants: [],
      };
    }

    if (!iconsMap[iconName].variants.includes(variant)) {
      iconsMap[iconName].variants.push(variant);
    }
  }

  // Organiser par catégorie (première partie du nom)
  const categories = {};
  const uncategorized = [];

  Object.values(iconsMap).forEach((icon) => {
    const parts = icon.name.split("-");
    const category = parts.length > 1 ? parts[0] : "other";

    if (!categories[category]) {
      categories[category] = [];
    }

    icon.variants.forEach((variant) => {
      categories[category].push({
        name: `${icon.name}-${variant}`,
        class: `ri-${icon.name}-${variant}`,
        baseIcon: icon.name,
        variant: variant,
      });
    });
  });

  // Trier
  const sorted = {};
  Object.keys(categories)
    .sort()
    .forEach((cat) => {
      sorted[cat] = categories[cat].sort((a, b) => a.name.localeCompare(b.name));
    });

  const total = Object.values(sorted).flat().length;
  const categories_count = Object.keys(sorted).length;

  return {
    meta: {
      generatedAt: new Date().toISOString(),
      source: remixPath,
      totalIcons: total,
      totalCategories: categories_count,
    },
    categories: sorted,
  };
}

function main() {
  console.log("🎨 Extraction Remix Icons\n");

  if (!fs.existsSync(remixPath)) {
    console.error(`❌ Remix Icon non installé`);
    console.error('   Lance "pnpm add remixicon" d\'abord.');
    process.exit(1);
  }

  // Créer le dossier de sortie
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Remix Icons
  const icons = extractRemixIcons();
  if (icons) {
    const iconsFile = path.join(outputDir, "remix-icons.json");
    fs.writeFileSync(iconsFile, JSON.stringify(icons, null, 2));
    console.log(
      `✅ ${icons.meta.totalIcons} icônes Remix (${icons.meta.totalCategories} catégories)`,
    );
    console.log(`   → ${iconsFile}`);
  }

  console.log("\n🎉 Terminé !");
}

main();

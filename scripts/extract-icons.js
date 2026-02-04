#!/usr/bin/env node
/**
 * Extract DSFR icons from node_modules/@gouvfr/dsfr/dist/icons
 *
 * Usage:
 *   node extract-dsfr-icons.js
 *   node extract-dsfr-icons.js --path ./node_modules/@gouvfr/dsfr/dist/icons
 *   node extract-dsfr-icons.js --output ./src/data
 */

const fs = require("node:fs");
const path = require("node:path");

// Config
const args = process.argv.slice(2);
const getArg = (flag, defaultValue) => {
  const index = args.indexOf(flag);
  return index !== -1 ? args[index + 1] : defaultValue;
};

const iconsPath = getArg("--path", "./node_modules/@gouvfr/dsfr/dist/icons");
const outputDir = getArg("--output", "./src/data");
const outputPath = path.join(outputDir, "dsfr-icons.json");

// Recursive file search
function getFiles(dir, files = []) {
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
}

// Main
function main() {
  if (!fs.existsSync(iconsPath)) {
    console.error(`❌ Dossier introuvable: ${iconsPath}`);
    console.error("   Vérifie que @gouvfr/dsfr est installé.");
    process.exit(1);
  }

  console.log(`📁 Scan de ${iconsPath}...`);

  const files = getFiles(iconsPath);
  const icons = {};

  for (const file of files) {
    const relativePath = path.relative(iconsPath, file);
    const parts = relativePath.split(path.sep);

    // Structure: category/icon-name.svg ou category/subcategory/icon-name.svg
    const category = parts[0];
    const iconName = path.basename(file, ".svg");

    // Le DSFR retire le préfixe "fr--" des noms de fichiers lors de la génération CSS
    // Exemple: fr--success-fill.svg → .fr-icon-success-fill
    const className = iconName.startsWith('fr--')
      ? iconName.replace('fr--', '')
      : iconName;

    if (!icons[category]) {
      icons[category] = [];
    }

    icons[category].push({
      name: iconName,
      class: `fr-icon-${className}`,
      file: relativePath,
    });
  }

  // Trier les catégories et icônes
  const sortedIcons = {};
  Object.keys(icons)
    .sort()
    .forEach((category) => {
      sortedIcons[category] = icons[category].sort((a, b) => a.name.localeCompare(b.name));
    });

  // Stats
  const totalIcons = Object.values(sortedIcons).flat().length;
  const totalCategories = Object.keys(sortedIcons).length;

  // Output
  const output = {
    meta: {
      generatedAt: new Date().toISOString(),
      source: iconsPath,
      totalIcons,
      totalCategories,
    },
    categories: sortedIcons,
  };

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (outputDir && !fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log(`✅ ${totalIcons} icônes extraites (${totalCategories} catégories)`);
  console.log(`📄 Fichier généré: ${outputPath}`);
}

main();

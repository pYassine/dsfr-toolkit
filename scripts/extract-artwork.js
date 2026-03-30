#!/usr/bin/env node
/**
 * Extract DSFR artwork (pictograms) from node_modules/@gouvfr/dsfr/dist/artwork
 *
 * Usage:
 *   node extract-artwork.js
 *   node extract-artwork.js --path ./node_modules/@gouvfr/dsfr/dist/artwork
 *   node extract-artwork.js --output ./src/data
 */

const fs = require("node:fs");
const path = require("node:path");

// Config
const args = process.argv.slice(2);
const getArg = (flag, defaultValue) => {
  const index = args.indexOf(flag);
  return index !== -1 ? args[index + 1] : defaultValue;
};

const artworkPath = getArg(
  "--path",
  "./node_modules/@gouvfr/dsfr/dist/artwork",
);
const outputDir = getArg("--output", "./src/data");
const outputPath = path.join(outputDir, "dsfr-artwork.json");

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
  if (!fs.existsSync(artworkPath)) {
    console.error(`❌ Dossier introuvable: ${artworkPath}`);
    console.error("   Vérifie que @gouvfr/dsfr est installé.");
    process.exit(1);
  }

  console.log(`📁 Scan de ${artworkPath}...`);

  const files = getFiles(artworkPath);
  const groups = {};

  for (const file of files) {
    const relativePath = path.relative(artworkPath, file);
    const parts = relativePath.split(path.sep);
    const name = path.basename(file, ".svg");

    // Déterminer le groupe
    let group;
    if (parts.length === 1) {
      group = "racine";
    } else {
      // Ex: "pictograms/buildings" ou "background"
      group = parts.slice(0, -1).join("/");
    }

    // Lire le contenu SVG
    const svg = fs.readFileSync(file, "utf-8");

    if (!groups[group]) {
      groups[group] = [];
    }

    groups[group].push({
      name,
      file: path.basename(file),
      path: `@gouvfr/dsfr/dist/artwork/${relativePath}`,
      svg,
    });
  }

  // Trier les groupes et les pictogrammes
  const sortedGroups = {};
  Object.keys(groups)
    .sort()
    .forEach((group) => {
      sortedGroups[group] = groups[group].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
    });

  // Stats
  const totalArtwork = Object.values(sortedGroups).flat().length;

  // Output
  const output = {
    meta: {
      generatedAt: new Date().toISOString(),
      source: artworkPath,
      totalArtwork,
    },
    groups: sortedGroups,
  };

  // Ensure output directory exists
  if (outputDir && !fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log(
    `✅ ${totalArtwork} pictogrammes extraits (${Object.keys(sortedGroups).length} groupes)`,
  );
  console.log(`📄 Fichier généré: ${outputPath}`);
}

main();

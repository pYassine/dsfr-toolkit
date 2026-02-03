#!/usr/bin/env node
/**
 * Generate Markdown documentation from JSON data
 * Useful for AI tools to reference icons and colors
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../src/data');
const OUTPUT_DIR = path.join(__dirname, '../docs');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Generate DSFR Icons Markdown
function generateDsfrIconsMd() {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'dsfr-icons.json'), 'utf8'));

  let md = `# Icônes DSFR\n\n`;
  md += `> ${data.meta.totalIcons} icônes organisées en ${data.meta.totalCategories} catégories\n\n`;
  md += `**Source:** Design System de l'État Français (DSFR)\n\n`;
  md += `## Utilisation\n\n`;
  md += `\`\`\`html\n<span class="fr-icon-[nom-icone]" aria-hidden="true"></span>\n\`\`\`\n\n`;
  md += `## Liste des icônes par catégorie\n\n`;

  const categories = Object.keys(data.categories).sort();

  categories.forEach(category => {
    const icons = data.categories[category];
    md += `### ${category.charAt(0).toUpperCase() + category.slice(1)} (${icons.length})\n\n`;

    icons.forEach(icon => {
      md += `- **${icon.name}**\n`;
      md += `  - Classe: \`${icon.class}\`\n`;
      if (icon.aliases && icon.aliases.length > 0) {
        md += `  - Alias: ${icon.aliases.map(a => `\`${a}\``).join(', ')}\n`;
      }
    });

    md += `\n`;
  });

  fs.writeFileSync(path.join(OUTPUT_DIR, 'icones-dsfr.md'), md);
  console.log('✓ docs/icones-dsfr.md');
}

// Generate Remix Icons Markdown
function generateRemixIconsMd() {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'remix-icons.json'), 'utf8'));

  let md = `# Icônes Remix Icon\n\n`;
  md += `> ${data.meta.totalIcons} icônes organisées en ${data.meta.totalCategories} catégories\n\n`;
  md += `**Source:** Remix Icon (bibliothèque complémentaire)\n\n`;
  md += `## Utilisation\n\n`;
  md += `\`\`\`html\n<i class="ri-[nom-icone]"></i>\n\`\`\`\n\n`;
  md += `## Liste des icônes par catégorie\n\n`;

  const categories = Object.keys(data.categories).sort();

  // Too many icons, show only category list with count
  categories.forEach(category => {
    const icons = data.categories[category];
    md += `### ${category} (${icons.length})\n\n`;

    // Show first 10 icons as examples
    const examples = icons.slice(0, 10);
    examples.forEach(icon => {
      md += `- \`${icon.class}\`\n`;
    });

    if (icons.length > 10) {
      md += `- ... et ${icons.length - 10} autres\n`;
    }

    md += `\n`;
  });

  fs.writeFileSync(path.join(OUTPUT_DIR, 'icones-remix.md'), md);
  console.log('✓ docs/icones-remix.md');
}

// Generate DSFR Colors Markdown
function generateColorsMd() {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'dsfr-colors.json'), 'utf8'));

  let md = `# Couleurs DSFR\n\n`;
  md += `> ${data.meta.totalBackgrounds} couleurs de fond • ${data.meta.totalTexts} couleurs de texte\n\n`;
  md += `**Source:** Design System de l'État Français (DSFR)\n\n`;

  // Background colors
  md += `## Couleurs de fond\n\n`;

  const bgCategories = Object.keys(data.background).sort();
  bgCategories.forEach(category => {
    const colors = data.background[category];
    md += `### ${category.replace(/-/g, ' ')} (${colors.length})\n\n`;

    colors.forEach(color => {
      md += `- **${color.color}**\n`;
      md += `  - Classe: \`${color.class}\`\n`;
      md += `  - Variable CSS: \`${color.cssVar}\`\n`;
    });

    md += `\n`;
  });

  // Text colors
  md += `## Couleurs de texte\n\n`;

  const textCategories = Object.keys(data.text).sort();
  textCategories.forEach(category => {
    const colors = data.text[category];
    md += `### ${category.replace(/-/g, ' ')} (${colors.length})\n\n`;

    colors.forEach(color => {
      md += `- **${color.color}**\n`;
      md += `  - Classe: \`${color.class}\`\n`;
      md += `  - Variable CSS: \`${color.cssVar}\`\n`;
    });

    md += `\n`;
  });

  fs.writeFileSync(path.join(OUTPUT_DIR, 'couleurs-dsfr.md'), md);
  console.log('✓ docs/couleurs-dsfr.md');
}

// Generate all
console.log('Génération des fichiers Markdown...\n');

generateDsfrIconsMd();
generateRemixIconsMd();
generateColorsMd();

console.log('\n✓ Documentation Markdown générée!');

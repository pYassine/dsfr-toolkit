#!/usr/bin/env node
/**
 * Extract DSFR tags and badges from CSS files
 *
 * Usage:
 *   node extract-tags-badges.js
 *   node extract-tags-badges.js --output ./src/data
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
const badgeCssPath = path.join(dsfrPath, "component/badge/badge.css");
const tagCssPath = path.join(dsfrPath, "component/tag/tag.css");
const outputDir = getArg("--output", "./src/data");
const outputPath = path.join(outputDir, "tags-badges.json");

/**
 * Parse CSS to extract class variants
 */
function parseClassVariants(css, baseClass) {
  const variants = {
    colors: new Set(),
    modifiers: new Set(),
    states: new Set()
  };

  // Pattern pour les variantes de couleur
  // Ex: .fr-badge--green-tilleul-verveine, .fr-tag--blue-ecume
  const colorPattern = new RegExp(`\\.${baseClass}--(green-[a-z-]+|blue-[a-z-]+|purple-[a-z-]+|pink-[a-z-]+|yellow-[a-z-]+|orange-[a-z-]+|brown-[a-z-]+|beige-[a-z-]+)`, 'g');

  // Pattern pour les variantes système
  // Ex: .fr-badge--info, .fr-badge--success
  const systemPattern = new RegExp(`\\.${baseClass}--(info|success|error|warning|new)(?:[^a-z-]|$)`, 'g');

  // Pattern pour les modifiers
  // Ex: .fr-badge--sm, .fr-badge--no-icon, .fr-badge--icon-left
  const modifierPattern = new RegExp(`\\.${baseClass}--(sm|no-icon|icon-left|dismiss)(?:[^a-z-]|$)`, 'g');

  // Pattern pour les états (tags uniquement)
  // Ex: [aria-pressed="true"], [aria-pressed="false"]
  const statePattern = /\[aria-pressed=["']?(true|false)["']?\]/g;

  // Extraire les couleurs
  let match;
  while ((match = colorPattern.exec(css)) !== null) {
    variants.colors.add(match[1]);
  }

  // Extraire les variantes système
  while ((match = systemPattern.exec(css)) !== null) {
    variants.colors.add(match[1]);
  }

  // Extraire les modifiers
  while ((match = modifierPattern.exec(css)) !== null) {
    variants.modifiers.add(match[1]);
  }

  // Extraire les états
  while ((match = statePattern.exec(css)) !== null) {
    variants.states.add(match[1]);
  }

  return {
    colors: Array.from(variants.colors).sort(),
    modifiers: Array.from(variants.modifiers).sort(),
    states: Array.from(variants.states).sort()
  };
}

/**
 * Déterminer le type de couleur
 */
function getColorType(color) {
  if (['info', 'success', 'error', 'warning', 'new'].includes(color)) {
    return 'system';
  }
  if (color.startsWith('green-')) return 'green';
  if (color.startsWith('blue-')) return 'blue';
  if (color.startsWith('purple-')) return 'purple';
  if (color.startsWith('pink-')) return 'pink';
  if (color.startsWith('yellow-')) return 'yellow';
  if (color.startsWith('orange-')) return 'orange';
  if (color.startsWith('brown-')) return 'brown';
  if (color.startsWith('beige-')) return 'beige';
  return 'other';
}

/**
 * Formater le nom d'affichage
 */
function formatName(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Generate badge combinations
 */
function generateBadgeCombinations(variants) {
  const combinations = [];

  // Badges de base avec toutes les couleurs
  const allColors = ['default', ...variants.colors];
  allColors.forEach(color => {
    combinations.push({
      name: color === 'default' ? 'Badge par défaut' : formatName(color),
      className: color === 'default' ? 'fr-badge' : `fr-badge fr-badge--${color}`,
      color: color,
      colorType: color === 'default' ? 'default' : getColorType(color),
      type: 'base',
      hasIcon: color !== 'default' && ['info', 'success', 'error', 'warning', 'new'].includes(color),
      element: 'p'
    });
  });

  // Badges sans icône (uniquement système)
  variants.colors
    .filter(c => ['info', 'success', 'error', 'warning', 'new'].includes(c))
    .forEach(color => {
      combinations.push({
        name: `${formatName(color)} sans icône`,
        className: `fr-badge fr-badge--${color} fr-badge--no-icon`,
        color: color,
        colorType: 'system',
        type: 'no-icon',
        hasIcon: false,
        element: 'p'
      });
    });

  // Badges avec icône personnalisée
  allColors.forEach(color => {
    combinations.push({
      name: `${color === 'default' ? 'Badge' : formatName(color)} avec icône`,
      className: color === 'default'
        ? 'fr-badge fr-badge--icon-left fr-icon-star-fill'
        : `fr-badge fr-badge--${color} fr-badge--icon-left fr-icon-star-fill`,
      color: color,
      colorType: color === 'default' ? 'default' : getColorType(color),
      type: 'icon-left',
      hasIcon: true,
      customIcon: true,
      element: 'p'
    });
  });

  return combinations;
}

/**
 * Generate tag combinations
 */
function generateTagCombinations(variants) {
  const combinations = [];

  // Tag simple (non interactif, gris)
  combinations.push({
    name: 'Tag simple',
    className: 'fr-tag',
    color: 'default',
    colorType: 'default',
    type: 'simple',
    element: 'p',
    interactive: false
  });

  // Tags interactifs (liens et boutons) avec toutes les couleurs
  // Note: les tags interactifs par défaut sont blue-france, pas gris
  const interactiveColors = ['default', ...variants.colors];

  // Tags liens
  interactiveColors.forEach(color => {
    combinations.push({
      name: color === 'default' ? 'Tag lien' : `${formatName(color)} (lien)`,
      className: color === 'default' || ['info', 'success', 'error', 'warning', 'new'].includes(color)
        ? 'fr-tag'
        : `fr-tag fr-tag--${color}`,
      color: color === 'default' ? 'blue-france' : color,
      colorType: color === 'default' ? 'system' : getColorType(color),
      type: 'link',
      element: 'a',
      interactive: true,
      href: '#'
    });
  });

  // Tags boutons
  interactiveColors.forEach(color => {
    combinations.push({
      name: color === 'default' ? 'Tag bouton' : `${formatName(color)} (bouton)`,
      className: color === 'default' || ['info', 'success', 'error', 'warning', 'new'].includes(color)
        ? 'fr-tag'
        : `fr-tag fr-tag--${color}`,
      color: color === 'default' ? 'blue-france' : color,
      colorType: color === 'default' ? 'system' : getColorType(color),
      type: 'button',
      element: 'button',
      interactive: true
    });
  });

  // Tags avec icône
  interactiveColors.forEach(color => {
    combinations.push({
      name: color === 'default' ? 'Tag avec icône' : `${formatName(color)} avec icône`,
      className: color === 'default' || ['info', 'success', 'error', 'warning', 'new'].includes(color)
        ? 'fr-tag fr-tag--icon-left fr-icon-star-fill'
        : `fr-tag fr-tag--${color} fr-tag--icon-left fr-icon-star-fill`,
      color: color === 'default' ? 'blue-france' : color,
      colorType: color === 'default' ? 'system' : getColorType(color),
      type: 'icon-left',
      element: 'button',
      interactive: true,
      hasIcon: true
    });
  });

  // Tags sélectionnables (aria-pressed="false")
  interactiveColors.forEach(color => {
    combinations.push({
      name: color === 'default' ? 'Tag sélectionnable' : `${formatName(color)} sélectionnable`,
      className: color === 'default' || ['info', 'success', 'error', 'warning', 'new'].includes(color)
        ? 'fr-tag'
        : `fr-tag fr-tag--${color}`,
      color: color === 'default' ? 'blue-france' : color,
      colorType: color === 'default' ? 'system' : getColorType(color),
      type: 'selectable',
      element: 'button',
      interactive: true,
      ariaPressed: 'false'
    });
  });

  // Tags sélectionnés (aria-pressed="true")
  interactiveColors.forEach(color => {
    combinations.push({
      name: color === 'default' ? 'Tag sélectionné' : `${formatName(color)} sélectionné`,
      className: color === 'default' || ['info', 'success', 'error', 'warning', 'new'].includes(color)
        ? 'fr-tag'
        : `fr-tag fr-tag--${color}`,
      color: color === 'default' ? 'blue-france' : color,
      colorType: color === 'default' ? 'system' : getColorType(color),
      type: 'selected',
      element: 'button',
      interactive: true,
      ariaPressed: 'true'
    });
  });

  // Tags avec suppression
  interactiveColors.forEach(color => {
    combinations.push({
      name: color === 'default' ? 'Tag avec suppression' : `${formatName(color)} avec suppression`,
      className: color === 'default' || ['info', 'success', 'error', 'warning', 'new'].includes(color)
        ? 'fr-tag fr-tag--dismiss'
        : `fr-tag fr-tag--${color} fr-tag--dismiss`,
      color: color === 'default' ? 'blue-france' : color,
      colorType: color === 'default' ? 'system' : getColorType(color),
      type: 'dismiss',
      element: 'button',
      interactive: true,
      dismissible: true
    });
  });

  return combinations;
}

/**
 * Main
 */
function main() {
  console.log('🏷️  Extraction des tags et badges DSFR...\n');

  // Vérifier l'existence des fichiers
  if (!fs.existsSync(badgeCssPath)) {
    console.error(`❌ Fichier introuvable: ${badgeCssPath}`);
    process.exit(1);
  }

  if (!fs.existsSync(tagCssPath)) {
    console.error(`❌ Fichier introuvable: ${tagCssPath}`);
    process.exit(1);
  }

  // Lire les fichiers CSS
  const badgeCss = fs.readFileSync(badgeCssPath, 'utf-8');
  const tagCss = fs.readFileSync(tagCssPath, 'utf-8');

  console.log('📄 Parsing badge.css...');
  const badgeVariants = parseClassVariants(badgeCss, 'fr-badge');
  console.log(`   Couleurs trouvées: ${badgeVariants.colors.length}`);
  console.log(`   Modifiers trouvés: ${badgeVariants.modifiers.length}`);

  console.log('\n📄 Parsing tag.css...');
  const tagVariants = parseClassVariants(tagCss, 'fr-tag');
  console.log(`   Couleurs trouvées: ${tagVariants.colors.length}`);
  console.log(`   Modifiers trouvés: ${tagVariants.modifiers.length}`);
  console.log(`   États trouvés: ${tagVariants.states.length}`);

  // Générer les combinaisons
  console.log('\n🔨 Génération des combinaisons...');
  const badges = generateBadgeCombinations(badgeVariants);
  const tags = generateTagCombinations(tagVariants);

  console.log(`   ${badges.length} combinaisons de badges`);
  console.log(`   ${tags.length} combinaisons de tags`);

  // Output
  const output = {
    meta: {
      generatedAt: new Date().toISOString(),
      source: {
        badge: badgeCssPath,
        tag: tagCssPath
      },
      totalBadges: badges.length,
      totalTags: tags.length,
      dsfrVersion: '1.14.0'
    },
    variants: {
      badge: badgeVariants,
      tag: tagVariants
    },
    badges: badges,
    tags: tags
  };

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (outputDir && !fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log(`\n✅ Extraction terminée!`);
  console.log(`📄 Fichier généré: ${outputPath}`);
  console.log(`\nRésumé:`);
  console.log(`   - ${badges.length} badges`);
  console.log(`   - ${tags.length} tags`);
  console.log(`   - ${badges.length + tags.length} combinaisons au total`);
}

main();

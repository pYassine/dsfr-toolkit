# DSFR Toolkit

**Une boîte à outils pour mieux intégrer le Design System de l'État**

Un ensemble d'outils interactifs pour faciliter la prise en main du [Système de Design de l'État Français (DSFR)](https://www.systeme-de-design.gouv.fr/).

> **Auteur :** [pYassine](https://github.com/pyassine)
> **Licence :** Open Source - Respecte les standards du DSFR
> **Note :** Ce projet n'est pas officiel et n'est pas maintenu par l'équipe DSFR.

## Démo en ligne

Découvrez l'outil en ligne : **[https://storied-nougat-78ee14.netlify.app/](https://storied-nougat-78ee14.netlify.app/)**

## Outils disponibles

### 1. Visualiseur d'icônes

Explorer et copier les icônes DSFR et Remix Icon.

- Recherche en temps réel parmi toutes les icônes
- Deux bibliothèques : **DSFR** (662 icônes) et **Remix Icon** (3078 icônes)
- Sélecteur de couleur interactif (11 couleurs DSFR)
- Copie rapide : nom, classe CSS, éléments HTML (`<span>`, `<i>`)
- Badges informatifs avec suggestions d'alternatives
- Organisation par catégories

### 2. Palette de couleurs

Explorer et utiliser les couleurs du DSFR.

- Couleurs de fond (112) et de texte (73)
- Recherche par nom, classe ou variable CSS
- Copie rapide des classes et variables CSS
- Organisation par variantes (action-high, default, contrast, etc.)
- Prévisualisation avec Lorem ipsum pour les couleurs de texte

### 3. Tags & Badges

Composer et explorer les tags et badges DSFR.

- Compositeur interactif : type, élément HTML, taille, couleur, icône
- 23 couleurs DSFR et 16 icônes populaires
- Aperçu en temps réel et code HTML généré
- Catalogues complets : 51 badges et 109 tags
- 100% accessible : uniquement des combinaisons conformes au DSFR

### 4. Pictogrammes

Parcourir et copier les pictogrammes SVG du DSFR.

- 69 pictogrammes organisés par catégorie
- Copie du SVG, de la balise `<img>` ou du chemin
- Recherche par nom

### 5. Exemples de grille

Exemples pratiques pour maîtriser le système de grille DSFR.

- Système de grille à 12 colonnes
- Exemples responsive (mobile-first)
- Gutters, alignements, offsets, grilles imbriquées
- Exemples pratiques : blog, galerie, dashboard
- Code source visible pour chaque exemple

## Installation

```bash
git clone https://github.com/pYassine/dsfr-toolkit.git
cd dsfr-toolkit
pnpm install
```

## Utilisation

### Démarrer le serveur

```bash
pnpm start
```

Le serveur démarre sur http://localhost:8080 et ouvre automatiquement le navigateur.

### Extraction des données

```bash
# Extraire toutes les données (icônes, couleurs, tags & badges, Remix Icon, pictogrammes)
pnpm extract

# Extraire individuellement
pnpm extract:icons
pnpm extract:colors
pnpm extract:tags-badges
pnpm extract:remix
pnpm extract:artwork
```

### Build (pour le déploiement)

```bash
pnpm build
```

Exécute l'extraction des données, la copie des assets DSFR et la génération de la documentation Markdown.

## Structure du projet

```
dsfr-toolkit/
├── index.html                     # Page d'accueil
├── icons-viewer.html              # Visualiseur d'icônes
├── colors-viewer.html             # Palette de couleurs
├── tags-badges-viewer.html        # Compositeur de tags et badges
├── artwork-viewer.html            # Pictogrammes SVG
├── grid-viewer.html               # Exemples de grille
├── about.html                     # À propos
├── src/
│   ├── styles/
│   │   └── style.css             # Styles centralisés
│   └── data/
│       ├── dsfr-icons.json       # Données des icônes DSFR
│       ├── remix-icons.json      # Données Remix Icon
│       ├── dsfr-colors.json      # Données des couleurs
│       ├── tags-badges.json      # Données des tags et badges
│       └── dsfr-artwork.json     # Données des pictogrammes
├── scripts/
│   ├── extract-icons.js          # Extraction icônes DSFR
│   ├── extract-colors.js         # Extraction couleurs
│   ├── extract-tags-badges.js    # Extraction tags & badges
│   ├── extract-remix.js          # Extraction Remix Icon
│   ├── extract-artwork.js        # Extraction pictogrammes
│   ├── copy-dsfr-assets.js       # Copie assets pour le déploiement
│   └── generate-markdown.js      # Génération documentation
├── assets/                        # Assets copiés au build (gitignored)
│   ├── dsfr/                     # CSS, JS, fonts, icons, artwork
│   └── remixicon/                # Fonts Remix Icon
├── package.json
├── netlify.toml                   # Configuration Netlify
└── README.md
```

## Technologies

- **DSFR** - Système de Design de l'État Français (v1.14.0)
- **Vanilla JavaScript** - Aucun framework, code natif uniquement
- **Node.js** - Scripts d'extraction et serveur HTTP
- **http-server** - Serveur HTTP simple pour le développement
- **Remix Icon** - Bibliothèque d'icônes complémentaire

## Contraintes techniques

- **Node.js uniquement** : Tous les scripts utilisent Node.js natif
- **JavaScript vanilla** : Pas de frameworks front-end
- **Standards DSFR** : Respect des composants et conventions du Design System
- **Modules CommonJS** : Pour compatibilité maximale avec Node.js
- **API Web natives** : Fetch, LocalStorage, etc.

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à signaler des bugs, proposer de nouvelles fonctionnalités ou améliorer la documentation.

## Licence

Ce projet est **open source** et gratuit. Il respecte les standards et les licences du DSFR.

**Auteur :** pYassine
**Statut :** Projet communautaire non officiel

## Liens utiles

- [Documentation DSFR](https://www.systeme-de-design.gouv.fr/)
- [DSFR sur GitHub](https://github.com/GouvernementFR/dsfr)
- [DSFR sur npm](https://www.npmjs.com/package/@gouvfr/dsfr)

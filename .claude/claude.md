# Visualiseur DSFR - Contraintes techniques

## Technologies

- **Node.js uniquement** : Tous les scripts et outils doivent utiliser Node.js
- **JavaScript natif** : Pas de frameworks front-end (React, Vue, etc.)
- **HTML/CSS vanilla** : Pages HTML statiques avec CSS pur
- **DSFR** : Utilisation du Design System de l'État Français

## Stack technique

- Node.js pour les scripts d'extraction
- JavaScript natif (ES6+) pour les interactions front-end
- Fetch API pour le chargement des données
- CSS pur (avec classes DSFR)

## Structure du projet

```
.
├── index.html                    # Page d'accueil
├── icons-viewer.html             # Visualiseur d'icônes
├── colors-viewer.html            # Palettes de couleurs
├── src/
│   ├── styles/
│   │   └── style.css            # Styles centralisés
│   └── data/
│       ├── dsfr-icons.json      # Données des icônes
│       └── dsfr-colors.json     # Données des couleurs
└── scripts/
    ├── extract-icons.js         # Extraction des icônes depuis DSFR
    └── extract-colors.js        # Extraction des couleurs depuis DSFR

```

## Scripts disponibles

- `pnpm extract` : Extraire toutes les données DSFR
- `pnpm extract:icons` : Extraire uniquement les icônes
- `pnpm extract:colors` : Extraire uniquement les couleurs

## Règles de développement

1. **Pas de frameworks** : Utiliser uniquement du JavaScript vanilla
2. **Node.js pur** : Les scripts doivent fonctionner avec Node.js sans transpilation
3. **Modules CommonJS** : Pour compatibilité Node.js (require/module.exports)
4. **Standards web** : Utiliser les API web natives (Fetch, LocalStorage, etc.)
5. **Accessibilité** : Respecter les normes WCAG via le DSFR

## Développement

Pour visualiser le projet localement :

```bash
pnpm start    # Démarre http-server sur le port 3000
```

Le serveur utilise `http-server`, un package Node.js simple pour servir des fichiers statiques.

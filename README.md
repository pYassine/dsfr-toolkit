# DSFR Toolkit

Un ensemble d'outils pour faciliter la prise en main du [Système de Design de l'État Français (DSFR)](https://www.systeme-de-design.gouv.fr/).

> **Auteur :** [pYassine](https://github.com/pyassine)
> **Licence :** Open Source - Respecte les standards du DSFR
> **Note :** Ce projet n'est pas officiel et n'est pas maintenu par l'équipe DSFR.

## 🎯 Objectif

Ce projet regroupe plusieurs outils interactifs pour aider les développeurs et designers à découvrir, explorer et utiliser les ressources du DSFR de manière simple et intuitive.

## 🌐 Démo en ligne

Découvrez l'outil en ligne : **[https://storied-nougat-78ee14.netlify.app/](https://storied-nougat-78ee14.netlify.app/)**

## 🛠️ Outils disponibles

### 1. Visualiseur d'icônes

Un outil interactif pour explorer et copier les icônes DSFR et Remix Icon.

**Fonctionnalités :**

- 🔍 Recherche en temps réel parmi toutes les icônes
- 🎨 Deux bibliothèques d'icônes : **DSFR** (662 icônes) et **Remix Icon** (3078 icônes)
- 📋 Copie rapide du nom, de la classe CSS, ou des éléments HTML (`<span>`, `<i>`)
- 🌓 Mode sombre/clair avec sauvegarde des préférences
- 📱 Design responsive (grille adaptative)
- 🎯 Interface 100% DSFR (utilisation des composants natifs : `fr-card`, `fr-tag`, `fr-select`, `fr-tabs`)
- 📊 Statistiques en temps réel
- 🏷️ Organisation par catégories

### 2. Palette de couleurs

Un outil pour explorer et utiliser les couleurs du DSFR.

**Fonctionnalités :**

- 🎨 Exploration des couleurs de fond (112 couleurs) et de texte (73 couleurs)
- 🔍 Recherche par nom, classe ou variable CSS
- 📋 Copie rapide des classes et variables CSS
- 🎯 Organisation par variantes (action-high, default, contrast, etc.)
- 📝 Prévisualisation avec Lorem ipsum pour les couleurs de texte
- ↕️ Tri alphabétique automatique
- 🌓 Mode sombre/clair

## 📦 Installation

```bash
# Cloner le projet
git clone <url-du-repo>
cd dsfr-toolkit

# Installer les dépendances avec pnpm
pnpm install
```

## 🚀 Utilisation

### Démarrer le serveur

```bash
pnpm start
# ou
pnpm dev
```

Le serveur démarre sur http://localhost:8080 et ouvre automatiquement le navigateur.

### Extraction des données

```bash
# Extraire toutes les données (icônes DSFR, couleurs, Remix Icon)
pnpm extract

# Extraire uniquement les icônes DSFR
pnpm extract:icons

# Extraire uniquement les couleurs
pnpm extract:colors

# Extraire uniquement Remix Icon
pnpm extract:remix
```

## 📝 Structure du projet

```
dsfr-toolkit/
├── index.html                  # Page d'accueil
├── icons-viewer.html           # Visualiseur d'icônes
├── colors-viewer.html          # Palette de couleurs
├── src/
│   ├── styles/
│   │   └── style.css          # Styles centralisés
│   └── data/
│       ├── dsfr-icons.json    # Données des icônes DSFR
│       ├── remix-icons.json   # Données Remix Icon
│       └── dsfr-colors.json   # Données des couleurs
├── scripts/
│   ├── extract-icons.js       # Script d'extraction DSFR
│   ├── extract-colors.js      # Script d'extraction couleurs
│   └── extract-remix.js       # Script d'extraction Remix
├── package.json               # Dépendances
└── README.md                  # Documentation
```

## 🎨 Technologies utilisées

- **DSFR** - Système de Design de l'État Français
- **Vanilla JavaScript** - Aucun framework, code natif uniquement
- **Node.js** - Pour les scripts d'extraction et le serveur HTTP
- **http-server** - Serveur HTTP simple pour le développement
- **Remix Icon** - Bibliothèque d'icônes complémentaire (optionnelle)

## 🔧 Contraintes techniques

Ce projet respecte des contraintes strictes pour rester simple et maintenable :

- ✅ **Node.js uniquement** : Tous les scripts utilisent Node.js natif
- ✅ **JavaScript vanilla** : Pas de frameworks front-end
- ✅ **Standards DSFR** : Respect des composants et conventions du Design System
- ✅ **Modules CommonJS** : Pour compatibilité maximale avec Node.js
- ✅ **API Web natives** : Fetch, LocalStorage, etc.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

- Signaler des bugs
- Proposer de nouvelles fonctionnalités
- Améliorer la documentation
- Ajouter de nouveaux outils

## 📄 Licence

Ce projet est **open source** et gratuit. Il respecte les standards et les licences du DSFR.

**Auteur :** pYassine
**Statut :** Projet communautaire non officiel

## 🔗 Liens utiles

- [Documentation DSFR](https://www.systeme-de-design.gouv.fr/)
- [DSFR sur GitHub](https://github.com/GouvernementFR/dsfr)
- [DSFR sur npm](https://www.npmjs.com/package/@gouvfr/dsfr)

---

<p align="center">
  Créé avec ❤️ par <a href="https://github.com/pyassine">pYassine</a><br>
  Projet open source respectant les standards du DSFR
</p>

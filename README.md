# 🏆 Commit Awards

Une application web interactive pour explorer et analyser les messages de commit les plus drôles de vos projets GitHub. Découvrez les commits qui méritent des récompenses pour leur humour !

## ✨ Fonctionnalités

- 🎯 **Classification automatique** : Analyse les commits pour détecter ceux qui sont drôles vs sérieux
- 🏅 **Système d'awards** : Récompenses pour les commits les plus créatifs
- 📊 **Statistiques détaillées** : Visualisation des données de vos commits
- 🌙 **Interface moderne** : Design sombre élégant et responsive
- 📁 **Import JSON** : Importez facilement vos données de commits GitHub
- ⭐ **Système de favoris** : Marquez vos commits préférés
- 🔍 **Recherche et filtres** : Trouvez rapidement les commits qui vous intéressent

## 🚀 Installation

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn

### Étapes d'installation

1. **Clonez le repository**
   ```bash
   git clone <votre-repo-url>
   cd commit-awards-web
   ```

2. **Installez les dépendances**
   ```bash
   npm install
   ```

3. **Lancez le serveur de développement**
   ```bash
   npm run dev
   ```

4. **Ouvrez votre navigateur**
   ```
   http://localhost:5173
   ```

## 📥 Comment importer vos données

### Format JSON attendu

L'application accepte un fichier JSON avec la structure suivante :

```json
[
  {
    "message": "fix: corrige le bug qui faisait danser les boutons",
    "author": {
      "name": "utilisateur-github",
      "email": "user@example.com"
    },
    "date": "2024-01-15T10:30:00Z",
    "sha": "abc123def456",
    "repo": {
      "name": "utilisateur-github/mon-projet",
      "url": "https://github.com/utilisateur-github/mon-projet"
    }
  }
]
```

### Extraction automatique des noms d'utilisateur

L'application extrait automatiquement le nom d'utilisateur à partir du champ `repo.name` (format `utilisateur/projet`). Si `author.name` est différent du nom d'utilisateur extrait, il sera automatiquement remplacé pour assurer la cohérence.

### Étapes d'importation

1. **Accédez à la page d'import** : Cliquez sur "Importer" dans la navigation
2. **Glissez-déposez votre fichier JSON** ou cliquez pour le sélectionner
3. **Vérifiez l'aperçu** des données importées
4. **Confirmez l'import** pour ajouter les commits à votre collection

## 🛠️ Scripts disponibles

- `npm run dev` : Lance le serveur de développement
- `npm run build` : Construit l'application pour la production
- `npm run preview` : Prévisualise la version de production
- `npm run lint` : Vérifie la qualité du code avec ESLint

## 🏗️ Technologies utilisées

- **React 18** : Framework frontend
- **Vite** : Outil de build rapide
- **Tailwind CSS** : Framework CSS utilitaire
- **Heroicons** : Icônes SVG
- **React Router** : Navigation côté client

## 📁 Structure du projet

```
commit-awards-web/
├── src/
│   ├── components/     # Composants React réutilisables
│   ├── context/        # Contextes React (gestion d'état)
│   ├── pages/          # Pages de l'application
│   ├── utils/          # Fonctions utilitaires
│   └── index.css       # Styles globaux
├── public/             # Fichiers statiques
└── package.json        # Configuration du projet
```

## 🎨 Personnalisation

L'application utilise Tailwind CSS pour le styling. Vous pouvez personnaliser les couleurs et thèmes en modifiant le fichier `tailwind.config.js`.

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**Amusez-vous bien à explorer vos commits ! 🎉**
# 🗺️ PDTI Tétouan 2026 : Dashboard Territorial Intégré

## 🌟 Vision du Projet
Le **PDTI Tétouan 2026** est une plateforme décisionnelle de haute fidélité conçue pour la Province de Tétouan. Elle permet la visualisation géospatiale, l'analyse des investissements et le suivi des indicateurs de développement territorial pour la tranche prioritaire 2026.

---

## 🚀 Fonctionnalités Clés

### 1. Cartographie Intelligence (OpenLayers)
*   **Découpage Administratif** : Visualisation précise des 23 communes.
*   **Heatmap Démographique** : Échelle de couleurs dynamique basée sur la densité de population (Urbain vs Rural).
*   **Patrimoine Territorial** : Couches interactives pour les barrages, aéroports, zones industrielles et linéaire littoral.

### 2. Analyse Projets & Investissements
*   **Tableaux de Bord Dynamiques** : Statistiques en temps réel sur les coûts (MDH) et les emplois créés.
*   **Fiches Projets** : Consultation détaillée par commune via un panneau latéral élégant.
*   **Indicateurs de Couverture** : Métriques automatiques sur les unités recensées et les points géospatiaux.

### 3. Navigation Intuitive
*   **Diagnostics PDTI** : Module de présentation intégré pour les analyses sectorielles.
*   **Synthèse Provinciale** : Vue d'ensemble des priorités stratégiques de l'année 2026.

---

## 🛠️ Guide d'Extension (Système "Sandbox")

Pour ajouter de nouvelles fonctionnalités (points d'intérêt, tracés, zones) sans modifier le code source principal, utilisez le fichier **`services/extraLayers.ts`**.

### Comment ajouter vos données :
1.  Ouvrez `services/extraLayers.ts`.
2.  Ajoutez un nouvel objet dans `CUSTOM_FEATURES_REGISTRY`.
3.  **Le Dashboard affichera automatiquement votre couche sur la carte.**

**Modèle de données :**
```typescript
{
  id: "ma-nouvelle-couche",
  label: "Nouveaux Sites",
  color: "#8b5cf6", // Couleur Hex
  icon: "⭐",        // Emoji ou SVG
  data: {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": { "NOM": "Site Alpha" },
        "geometry": { "type": "Point", "coordinates": [-5.3414, 35.5818] }
      }
    ]
  }
}
```

---

## 💻 Stack Technique
*   **Framework** : React 19 (Architecture par composants haute performance).
*   **Moteur Cartographique** : OpenLayers (Précision géodésique et support GeoJSON).
*   **Design System** : Tailwind CSS (Aesthetics premium et responsive).
*   **Visualisation** : Recharts (Graphiques d'investissement fluides).
*   **Outils** : Vite & TypeScript (Type-safety et build ultra-rapide).

---

## 📦 Installation Locale

1.  **Clonage & Dépendances** :
    ```bash
    npm install
    ```
2.  **Lancement Développement** :
    ```bash
    npm run dev
    ```
3.  **Production Build** :
    ```bash
    npm run build
    ```

---

## 🖼️ Ressources Médias
*   **Diapo** : Placez votre fichier `diapo.png` dans le dossier `public/` pour activer le module de diagnostic visuel.

---
*© 2026 - Direction Provinciale de Tétouan | Développement Territorial Intégré*
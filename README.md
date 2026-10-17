# ROME-3D — Première salle

Une salle unique inspirée de Saint-Pierre au Vatican : architecture géométrique Three.js, marbres crème / rouge brun / noir, quatre colonnes, une arche monumentale, plafond à caissons et or ancien. Aucune photo n'était fournie lors de cette première version : la palette suit la description, sans prétendre reproduire un relevé exact.

## Lancer

Prérequis : Node.js 22.12+ (ou 24) et npm.

```sh
npm ci
npm run dev
```

Ouvrir l'adresse affichée par Vite (port 5173 par défaut) dans un navigateur de bureau avec WebGL. Dans un environnement cloud, utiliser le transfert de port proposé par votre outil.

Cliquer sur **Entrer dans la salle**, puis utiliser **ZQSD** ou les flèches et la souris. **Échap** libère la souris et met la visite en pause. Le bouton en bas à droite rétablit le point de vue initial. Z/W et Q/A sont pris en charge selon la disposition du clavier. La visite se fait à hauteur d'œil ; les murs et les quatre colonnes bloquent les déplacements. Le téléphone affiche la scène, mais la visite nécessite clavier et souris.

```sh
npm run build
npm run preview
```

Le rendu ne dépend d'aucun CDN, police distante, texture ou modèle externe. Les matériaux sont volontairement unis. Le ratio de pixels est plafonné à 2 ; les géométries sont simples et une seule lumière projette des ombres.

## Validation

Compilation de production et tests Chromium réels : rendu WebGL, entrée dans la visite, déplacement Z, orientation souris, collisions des murs / colonnes, retour au point de vue initial et affichage étroit. Capture réelle dans `artifacts/salle-saint-pierre.png`.

Cette version s'arrête à cette salle. Aucun autre quartier ou salle n'est créé.

Le test de navigation est conservé dans `tests/browser.cjs`. Il nécessite Playwright et Chromium disponibles sur la machine, ainsi que le serveur Vite lancé. Exécuter `node tests/browser.cjs` ; si nécessaire, définir `PLAYWRIGHT_MODULE` vers le module Playwright installé et `CHROMIUM_PATH` vers l'exécutable Chromium. Le test utilise le port 5173 et renouvelle la capture. Dans le navigateur sans interface, Échap est vérifié via la gestion clavier explicite de l'application.

## Publication GitHub Pages

Adresse prévue : https://lizalamour13-droid.github.io/ROME-3D/

Dans GitHub : **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: gh-pages → / (root) → Save**. La branche `gh-pages` contient la version compilée, prête à servir. Attendre la réussite du déploiement Pages avant d'ouvrir l'adresse.

`vite.config.js` fixe le chemin `/ROME-3D/` pour les ressources sur GitHub Pages. La publication ne change ni les graphismes ni les commandes de la salle. Pour une prochaine mise à jour, reconstruire avec `npm ci` puis `npm run build` et publier le contenu de `dist/` à la racine de `gh-pages`, avec un fichier `.nojekyll`.

## Embellissement de la salle

Deux niches cintrées avec statues géométriques en pierre claire encadrent désormais une porte monumentale à panneaux bronze et or ancien. Des cadres en marbre rouge brun, un fronton et des médaillons complètent le mur du fond. La salle, la palette, les quatre colonnes et les commandes de visite sont conservées ; la porte est décorative et fermée.

## Fontaine et galerie

La salle comporte désormais une fontaine centrale à vasques superposées, en pierre crème avec bordures en or ancien. L'eau et les gouttes sont animées ; les gouttes partagent un seul objet instancié. Une collision circulaire laisse une marge autour du socle et permet de contourner le bassin.

Six tableaux originaux de paysages et d'architecture sont dessinés localement sur Canvas, dans une palette terre, pierre et vert grisé, avec des cadres dorés. Des rosaces et feuilles géométriques complètent les pilastres et chapiteaux. Aucun téléchargement de texture, aucune image personnelle ou œuvre historique reproduite.

Les tests navigateur vérifient aussi la collision de la fontaine, le passage tout autour, l'animation de l'eau et la présence des six tableaux.

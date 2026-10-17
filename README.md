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

Quatre tableaux originaux (Saint-Pierre, le Tibre, une nature morte et une figure drapée) sont dessinés localement sur Canvas, dans une palette terre, pierre et vert grisé, avec des cadres dorés. Des rosaces et feuilles géométriques complètent les pilastres et chapiteaux. Aucun téléchargement de texture, aucune image personnelle ou œuvre historique reproduite.

Les tests navigateur vérifient aussi la collision de la fontaine, le passage tout autour, l'animation de l'eau et la présence des quatre tableaux.

## Marbre noir et plafond de Saint-Pierre

Des filets de marbre noir soulignent les soubassements, socles de colonnes, bordures de la fontaine et encadrements du fond. Les moulures du plafond ont un profil concave arrondi : les bords descendent et le centre remonte dans le plafond pour former un creux. Les rosaces et filets en or ancien restent sobres. Le médaillon noir aux clés croisées a été retiré. La circulation et l'éclairage sont conservés.

Les quatre tableaux sont tous différents et répartis à raison de deux par côté, sans duplication : Saint-Pierre, le Tibre, une nature morte et une figure drapée. Les textures sont créées localement sans téléchargement.

## Tableau du panneau gauche

Le panneau central du mur gauche reçoit une cinquième composition originale représentant le Colisée. Les quatre tableaux précédents sont conservés ; les cinq textures sont différentes. Le plafond, les matériaux et la navigation ne sont pas modifiés par cette correction.

## Maquette sous verre

Au centre de la largeur de la salle, du côté opposé à la porte et aux statues (x = 0 ; z = 9,4), une vitrine présente une interprétation miniature de l'extérieur de Saint-Pierre : façade à portails et fronton, nef et transept, abside, grande coupole nervurée, lanterne, croix et deux petites coupoles. La place ovale comporte un obélisque, deux fontaines et une double colonnade, dont les 80 colonnes sont instanciées. Les proportions sont simplifiées pour rester dans le style du projet, sans prétendre à une reproduction architecturale exacte.

Le verre transparent ne projette pas d'ombre opaque. Le socle dispose d'une collision rectangulaire avec marge pour empêcher de traverser la vitrine ; les passages sur les deux côtés et l'espace entre la vitrine et la fontaine restent ouverts. La capture `artifacts/maquette-saint-pierre.png` montre la vitrine à hauteur de visite.

## Tableau du panneau droit

Le panneau central du mur droit reçoit un jardin italien avec une allée de cyprès, un bassin et un pavillon. Les six tableaux sont désormais tous différents, à raison de trois par mur latéral.

## Statues entre les tableaux

Quatre statues ivoire ornées d'or ancien occupent les intervalles entre les tableaux (deux par mur, z = -3 et 4). Leurs poses sont différentes : livre et main levée, mains jointes, bras ouverts, palme et livre. Leurs socles sont placés contre les pilastres à x = ±8,05, hors de l'emprise des quatre colonnes. Des collisions rectangulaires tiennent compte des socles et des bras ; le passage devant les statues est vérifié. Aucun tableau n'est déplacé ou masqué.

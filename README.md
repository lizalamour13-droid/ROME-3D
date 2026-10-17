# ROME-3D — Salle des marbres et salle de la chaire

Deux salles reliées inspirées de Saint-Pierre au Vatican. La première conserve son architecture géométrique Three.js, marbres crème / rouge brun / noir, quatre colonnes, une arche monumentale, plafond à caissons et or ancien. Aucune photo n'était fournie lors de cette première version : la palette suit la description, sans prétendre reproduire un relevé exact.

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

Le rendu ne dépend d'aucun CDN, police distante, texture ou modèle externe. Les textures des tableaux, fresques et vitraux sont générées localement. Le ratio de pixels est plafonné à 2 ; les géométries sont simples et une seule lumière projette des ombres.

## Validation

Compilation de production et tests Chromium réels : rendu WebGL, entrée dans la visite, déplacement Z, orientation souris, collisions des murs / colonnes, retour au point de vue initial et affichage étroit. Capture réelle dans `artifacts/salle-saint-pierre.png`.

La porte au fond de la première salle mène à la seconde salle ; on peut la traverser dans les deux sens.

Le test de navigation est conservé dans `tests/browser.cjs`. Il nécessite Playwright et Chromium disponibles sur la machine, ainsi que le serveur Vite lancé. Exécuter `node tests/browser.cjs` ; si nécessaire, définir `PLAYWRIGHT_MODULE` vers le module Playwright installé et `CHROMIUM_PATH` vers l'exécutable Chromium. Le test utilise le port 5173 et renouvelle la capture. Dans le navigateur sans interface, Échap est vérifié via la gestion clavier explicite de l'application.

## Publication GitHub Pages

Adresse prévue : https://lizalamour13-droid.github.io/ROME-3D/

Dans GitHub : **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: gh-pages → / (root) → Save**. La branche `gh-pages` contient la version compilée, prête à servir. Attendre la réussite du déploiement Pages avant d'ouvrir l'adresse.

`vite.config.js` fixe le chemin `/ROME-3D/` pour les ressources sur GitHub Pages. La publication ne change ni les graphismes ni les commandes de la salle. Pour une prochaine mise à jour, reconstruire avec `npm ci` puis `npm run build` et publier le contenu de `dist/` à la racine de `gh-pages`, avec un fichier `.nojekyll`.

## Embellissement de la salle

Deux niches cintrées avec statues géométriques en pierre claire encadrent désormais une porte monumentale à panneaux bronze et or ancien. Des cadres en marbre rouge brun, un fronton et des médaillons complètent le mur du fond. La salle, la palette, les quatre colonnes et les commandes de visite sont conservées ; les deux vantaux sont ouverts pour accéder à la salle de la chaire.

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

## Dégagement des colonnes

Les quatre colonnes sont replacées à x = ±3, z = ±6, sous les croisements pleins entre les moulures concaves. Leurs chapiteaux rejoignent le plafond sans entrer dans les creux ; les colliers, feuilles et volutes utilisent l'or ancien existant. Cette implantation éloigne les colonnes des statues et conserve les dimensions de la salle. Les tests vérifient les collisions, l'écartement des statues et l'absence de recouvrement entre les chapiteaux et les moulures creusées.

## Chérubins en bas-relief

Chaque colonne est entourée d'un ruban de fresque qui descend en spirale sur trois tours espacés. Les anges aux six poses différentes alternent avec des motifs végétaux noirs et or. Le ruban mesure 72 cm de largeur et laisse de grandes plages de pierre visible entre les passages, sans répétition couvrant tout le fût. Les bordures noires et or suivent la spirale, sans anneaux horizontaux supplémentaires. La géométrie épouse le rétrécissement de la colonne. Les quatre rubans partagent une géométrie, mais chacun reçoit une texture Canvas originale différente : palmes et anges, musique et lyres, guirlandes et fleurs, étoiles et encens. La circulation est conservée.

## Deux statues de la porte

Les deux niches de la porte présentent des statues distinctes : à gauche, robe bordeaux, manteau noir, livre et main levée ; à droite, robe noire, manteau bordeaux, bâton doré et main sur le cœur. Les têtes et mains restent en pierre ivoire, avec des galons et détails en or ancien. Cette modification reste limitée aux deux statues et à leurs socles.

## Salle de la chaire

Traverser la porte entre les statues bordeaux et noires pour entrer dans une nef à abside elliptique, sous une voûte arrondie. L'allée centrale mène à une interprétation géométrique de la Cathedra Petri : trône monumental en or ancien et noir, quatre figures de soutien, gloire dorée et fenêtre ambrée avec colombe. La palette suit les matériaux du monument sans prétendre reproduire ses sculptures ou proportions exactes.

Vingt chaises individuelles bordeaux et or accueillent les visiteurs assis en robes longues bordeaux. Les vitraux et leurs effets colorés sont retirés. Les bougies éclairent des murs et une voûte noirs étoilés ; des paillettes dorées flottent doucement dans la salle. Le plafond de la seconde salle a une voûte en berceau et une demi-coupole sur l'abside.

Les murs courbes, les rangées de chaises et l'estrade disposent de collisions ; l'allée centrale et les passages latéraux restent libres. L'indicateur de salle change pendant la visite. Les commandes et le point de départ sont conservés. Capture : `artifacts/salle-chaire.png`.

Le test `node tests/chapel.cjs` utilise les mêmes prérequis que `tests/browser.cjs`. Il contrôle les vingt visiteurs en robes, l’absence de vitraux, les collisions, le passage jusqu'à l'estrade et effectue un vrai trajet au clavier aller-retour à travers la porte.

## Sanctuaire monumental

La chaire est agrandie de 45 % et reçoit une structure dorée, des panneaux noirs, deux colonnes en or ancien et un fronton monumental. Le fond courbe de l'abside est habillé de bleu nuit très sombre, de 108 petites étoiles dorées instanciées et de contours architecturaux en or ancien. Les visiteurs sont conservés, les bancs étant remplacés par des chaises individuelles ; une ambiance noire éclairée aux bougies remplace désormais la pierre claire de cette seconde salle. Les nouveaux éléments du sanctuaire restent à l'intérieur de la zone de l'estrade déjà protégée par collision.

## Salle noire aux bougies et baldaquin

La seconde salle reçoit des murs et une voûte noirs, un sol sombre et huit appliques murales portant trois bougies chacune. Leurs flammes et leur halo sont animés très légèrement. Quatre lumières chaudes partagées accompagnent les vingt-quatre bougies ; les vitraux ont été retirés. Le niveau des lumières générales s'adapte progressivement à l'entrée de la seconde salle et revient à son réglage initial au retour dans la première.

Un baldaquin géométrique inspiré de Bernin encadre le sanctuaire : quatre colonnes torsadées en bronze sombre avec lianes dorées, bases noires, chapiteaux, franges, volutes et croix sommitale. Sa partie supérieure reste ouverte pour préserver la visibilité de la gloire et de la chaire. Les nouveaux éléments restent sur l'estrade protégée ; les allées restent libres. La forme est une interprétation simplifiée, sans prétendre reproduire tous les détails du baldaquin historique.

## Étoiles, paillettes et robes bordeaux

Le motif bleu nuit et doré couvre désormais tous les murs ainsi que la voûte de la seconde salle. Une texture locale partagée complète le fond de l'abside. Les 180 paillettes dorées sont regroupées en un seul objet `Points`, avec une dérive ascendante lente et sans collision. Les vingt visiteurs ont une robe longue bordeaux avec un col clair ; leur position assise et les bancs sont conservés. Les vitraux, éclairages colorés et faisceaux associés sont supprimés. Les bougies et le baldaquin sont maintenus.

## Cérémonie, chaises et audio

Les bancs sont remplacés par vingt chaises individuelles, en velours bordeaux et or ancien, dont les éléments répétés sont instanciés. Des moulures cintrées et des corniches à denticules évoquent l'architecture classique de Saint-Pierre. Un maître de cérémonie se tient près de l'estrade, avec un livre et de légers gestes ; deux visiteurs marchent lentement dans les allées latérales et s'arrêtent si le joueur approche. Les personnes assises ont une animation très légère.

Dans la seconde salle, **P** lance ou coupe la récitation du Notre Père. Le bouton **Écouter la prière** et le curseur de volume sont accessibles après **Échap** pour libérer la souris. Le son ne démarre pas automatiquement avant le premier choix de l'utilisateur ; il s'interrompt à la sortie de la salle ou quand l'onglet est masqué. Le MP3 local utilise maintenant une voix neuronale synthétique, récitant le Pater Noster en latin avec une réverbération discrète. Détails dans `public/audio/README.md` ; aucun accès réseau externe ni microphone requis.

`node tests/ceremony.cjs` vérifie les chaises et les moulures, le mouvement des visiteurs et du maître, le chargement et la progression réelle de l'audio, la touche P, le volume et l'arrêt à la sortie. La variable facultative `ROME_TEST_URL` permet de tester la version compilée servie sous `/ROME-3D/`.

## Tapis rouge et prière latine

Un tapis rouge bordeaux à liseré doré parcourt l'allée centrale de la seconde salle. L'ancienne récitation française est remplacée par le Pater Noster en latin, avec une nouvelle voix neuronale et un débit posé. La touche P, le réglage du volume et la pause en quittant la salle sont conservés. Le nouveau fichier audio possède un nom distinct pour éviter de servir l'ancienne version depuis le cache du navigateur.

## Lumière et saint Pierre

Quatre faisceaux dorés translucides accompagnent une statue centrale de saint Pierre sous le baldaquin, avec livre et clefs. Les paillettes passent à 280. Quatre des vingt visiteurs se lèvent, traversent les intervalles entre les rangées puis se rassoient ; les deux marcheurs latéraux sont conservés. Les déplacements s'arrêtent à proximité du joueur.

Les visiteurs debout utilisent désormais des jambes articulées aux hanches et aux genoux, avec balancement opposé des bras et des pas synchronisés sur la distance parcourue. Les quatre visiteurs qui quittent leur chaise utilisent également cette marche. Le maître de cérémonie dispose d’un pupitre noir et or, avec livre et microphone décoratif ; le son reste la prière existante.

## Décor inspiré de la référence visuelle

La seconde salle conserve son plan avec abside elliptique, ses vingt chaises et tous les personnages animés. Ses murs sont désormais en pierre crème, avec pilastres à soubassements noirs, panneaux bordeaux bordés d’or et six petits anges à trompette en hauteur. La voûte existante reçoit un bleu étoilé plus lisible et des nervures dorées ; le dallage latéral alterne marbre sombre et bordeaux avec médaillons clairs. L’éclairage ambiant de cette salle est rehaussé. Le baldaquin, saint Pierre, le tapis, le pupitre et la prière sont conservés.

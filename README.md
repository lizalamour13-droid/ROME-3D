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

## Maquette centrale et galerie

La fontaine intérieure a été retirée : la maquette de la basilique et sa vitrine occupent maintenant le centre de la salle. Une collision rectangulaire protège le socle et le verre ; la circulation reste possible autour.

Quatre tableaux originaux (Saint-Pierre, le Tibre, une nature morte et une figure drapée) sont dessinés localement sur Canvas, dans une palette terre, pierre et vert grisé, avec des cadres dorés. Des rosaces et feuilles géométriques complètent les pilastres et chapiteaux. Aucun téléchargement de texture, aucune image personnelle ou œuvre historique reproduite.

Les tests navigateur vérifient la collision de la vitrine, les passages autour de la maquette et la présence des six tableaux différents.

## Marbre noir et plafond de Saint-Pierre

Des filets de marbre noir soulignent les soubassements, socles de colonnes et encadrements du fond. Les moulures du plafond ont un profil concave arrondi : les bords descendent et le centre remonte dans le plafond pour former un creux. Les rosaces et filets en or ancien restent sobres. Le médaillon noir aux clés croisées a été retiré. La circulation et l'éclairage sont conservés.

Les quatre tableaux sont tous différents et répartis à raison de deux par côté, sans duplication : Saint-Pierre, le Tibre, une nature morte et une figure drapée. Les textures sont créées localement sans téléchargement.

## Tableau du panneau gauche

Le panneau central du mur gauche reçoit une cinquième composition originale représentant le Colisée. Les quatre tableaux précédents sont conservés ; les cinq textures sont différentes. Le plafond, les matériaux et la navigation ne sont pas modifiés par cette correction.

## Maquette sous verre

Au centre de la salle (x = 0 ; z = 0), une vitrine présente une interprétation miniature de l'extérieur de Saint-Pierre : façade à portails et fronton, nef et transept, abside, grande coupole nervurée, lanterne, croix et deux petites coupoles. La place ovale comporte un obélisque, deux fontaines et une double colonnade, dont les 80 colonnes sont instanciées. Les proportions sont simplifiées pour rester dans le style du projet, sans prétendre à une reproduction architecturale exacte.

Le verre transparent ne projette pas d'ombre opaque. Le socle dispose d'une collision rectangulaire avec marge pour empêcher de traverser la vitrine ; les passages autour restent ouverts. La capture `artifacts/maquette-centrale-visiteurs.png` montre la disposition actuelle.

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

## Reconstruction de la seconde salle selon l’image

Le décor précédent est remplacé par `src/chapel-architecture.js` : voûte crème à caissons en relief, coupole bleue nervurée sur tambour à douze fenêtres, couverture arrondie de l’abside, niches bordeaux, statues de pierre avec clefs et épée, anges à trompette, dallage géométrique crème/noir/bordeaux et baldaquin à frontons noirs bordés d’or. Le grand siège et la statue centrale précédents sont remplacés par un autel dégagé et une gloire rayonnante au fond. L’emprise elliptique, les vingt chaises et les personnages animés restent identiques ; le pupitre et la prière restent disponibles.

Les quatre statues sont désormais polychromes (robes bordeaux/bleues et liserés dorés) et placées dans des niches réellement ouvertes dans les murs, avec couverture cintrée et fond bordeaux. La coupole est approfondie et son éclairage adouci. Le dallage précédent et son tapis bordeaux sont rétablis.

## Place extérieure

Depuis la salle des marbres, une porte ouverte au fond à droite (à droite de la maquette sous verre) mène sans téléportation à la terrasse puis aux marches de la place. ZQSD et la souris restent les commandes. La vitesse augmente sur la place. Retournez-vous après avoir descendu les marches pour voir la façade, les volumes de la nef et la grande coupole de la basilique ; éloignez-vous jusqu’au fond de la place pour une vue d’ensemble.

L’extérieur est une interprétation géométrique de Saint-Pierre : place ovale, obélisque, deux fontaines, colonnades instanciées, façade et coupole grise. Il ne représente pas toute la cité du Vatican. Les deux salles et le retour par la porte sont conservés. `tests/exterior.cjs` vérifie le trajet aller-retour au clavier, la hauteur dans les escaliers, les limites de visite et les obstacles de la place.

La façade extérieure a été reconstruite selon la nouvelle référence : cinq travées à portes cintrées, grandes colonnes à chapiteaux, fenêtres encadrées, loggia centrale avec tenture bordeaux, dédicace, attique, horloges et treize statues sur balustrade. La coupole plus élancée reçoit un tambour à fenêtres, des nervures, des oculi et une lanterne ; deux petites coupoles accompagnent sa silhouette. Le passage existant reste ouvert.

Les deux fontaines de la place reçoivent des jets courbes et des gouttes animées. Dix oiseaux articulés suivent des trajectoires elliptiques au-dessus de la place. Huit jardinières fleuries bordent les parcours (avec collisions) ; dix pins parasols et un sol périphérique vert olive complètent le décor derrière les colonnades.

La seconde salle accueille dix-huit bougies flottantes au-dessus des rangées, avec cire ivoire, base dorée, flammes vacillantes et léger mouvement vertical. Deux petites sources chaudes partagées complètent les halos. L’allée centrale, la coupole et les déplacements restent dégagés.

## Vie urbaine autour de la place

Vingt-deux immeubles stylisés aux couleurs romaines bordent la scène : enduits ocre/crème, toits de terre cuite, fenêtres à volets, cheminées et petits balcons. Les éléments de façade sont regroupés par matériau dans des objets instanciés. La ville forme un décor périphérique ; les limites de visite restent celles de la place. Huit bancs accueillent huit personnes assises, huit passants marchent avec jambes articulées et des lampadaires ponctuent les parcours. Les passants s’arrêtent près du joueur et les bancs ont des collisions.

## Ambiances, scène et verrière

Les ambiances utilisent des enregistrements naturels CC0 de vent, oiseaux et eau (sources dans `public/audio/ambient/README.md`). Elles démarrent au clic d’entrée ; **M** ou le bouton les coupe, et un curseur règle leur volume. Les oiseaux sont audibles dehors, l’eau se renforce près des fontaines, l’intérieur reste discret et la prière garde sa commande P. Les sons se mettent en pause quand l’onglet est masqué.

La seconde salle conserve huit bougies flottantes au lieu de dix-huit. Le maître de cérémonie et son pupitre sont sur une petite estrade bordeaux et or ; la circulation centrale reste libre. Le tambour a des ouvertures vitrées avec ciel bleu nuageux et la coupole possède un oculus vitré. Les fontaines extérieures ont 160 particules d’éclaboussures supplémentaires.

Le pavage de la place est désormais gris anthracite/noir, avec petits pavés à joints fins, anneaux et rayons gris, et vingt-quatre losanges de pierre. Les personnages ont des coudes articulés, des épaules moins raides et des poses assises variées. Des murmures enregistrés (domaine public, provenance dans `public/audio/ambient/README.md`) deviennent audibles près des passants et des bancs, puis disparaissent au-delà de sept mètres. La touche M et le volume des ambiances les contrôlent aussi.

## Sanctuaire centré et quatre statues distinctes

Le maître, son pupitre et l’estrade sont centrés sous le baldaquin. L’allée mène au pied des marches et les côtés restent accessibles. Un monument funéraire stylisé évoque le tombeau de saint Pierre dans la crypte sous le sanctuaire, en noir, bordeaux et or, avec une inscription. Les quatre statues des niches sont différentes : Pierre avec clefs/livre, Paul avec épée/manuscrit, pèlerin avec bâton et main levée, évêque avec mitre/crosse. Les robes et manteaux utilisent seulement noir, bordeaux sombre et or ancien, avec visages en pierre naturelle.

## Premières interactions et familles

Approchez d’un personnage proposant un échange : **E** ouvre la discussion, **1/2/3** ou les boutons sélectionnent une question, **E** ferme. Le guide explique la place, une visiteuse partage ses impressions et les familles proposent de petites conversations. Le maître et le prêtre permettent aussi de lancer/arrêter la prière. Ce sont des dialogues écrits à choix, sans service en ligne. La marche est suspendue pendant un échange.

Un prêtre blanc et or, avec mitre et crosse, marche sur le tapis rouge. Trois enfants et deux femmes avec poussettes rejoignent la place. Une musique de piano douce démarre avec les ambiances ; décochez « Musique douce » après Échap pour la couper seule. M coupe tous les sons d’ambiance. Crédits et licence du piano dans `public/audio/ambient/README.md`.

Les vingt personnes assises dans la deuxième salle disposent d’un livret ouvert du Pater Noster ; le pupitre porte également un livre ouvert plus grand. La prière se lance automatiquement en entrant après le clic initial de visite, puis sa présence diminue dans le passage et son volume descend en fondu avant la pause. P reste disponible et un choix de coupure est conservé lors des entrées suivantes. Le curseur règle le niveau maximal ; masquer l’onglet met toujours le son en pause.

La répartition des passants utilise désormais quatre circuits emboîtés, des départs espacés et une vitesse commune par circuit. Les passants contournent doucement une personne arrêtée au lieu de converger sur les mêmes carrefours et de former des amas. Les personnages assis sont répartis à raison d’une personne par banc.

## Grande entrée centrale

Une grande porte ouverte au centre de la façade relie désormais la place à la salle des marbres. La maquette se trouve au centre de la première salle, sous sa vitrine, à la place de la fontaine retirée. Les deux vantaux bronze, bordeaux et or sont ouverts vers la place. Un drapeau carré jaune et blanc du Vatican, avec clefs croisées et tiare, flotte sur une hampe en bois décalée à droite de l’entrée, en laissant les fenêtres dégagées. La petite porte latérale a été retirée et son passage fermé.

## Visiteurs et expériences

La place accueille désormais huit promeneurs adultes, trois enfants, deux parents avec poussette et huit personnes assises, au lieu de quarante et une personnes. Cinq visiteurs regardent la maquette centrale, les tableaux et les sculptures de la première salle ; deux autres circulent entre les salles en contournant les œuvres et les colonnes. La fontaine intérieure et son ambiance d’eau ont été retirées ; les fontaines de la place sont conservées.

Dans la seconde salle, approchez du Père Matteo et appuyez sur **E**, puis **3**, pour prendre une place assise et assister à une **courte reconstitution de messe** : accueil, lecture, intentions, Notre Père latin et bénédiction. Il s’agit d’une évocation guidée, pas d’une messe intégrale ou d’une célébration en direct. Les étapes se succèdent avec voix locales et sous-titres ; les boutons permettent de continuer, couper la voix ou reprendre la visite. **Échap** quitte et restitue le point de vue initial.

Le petit cartel « Mémoire de Pierre », dans la crypte sous le sanctuaire, propose **E**, puis **1** : une apparition symbolique se lève au-dessus du monument funéraire et raconte brièvement les origines de Pierre et de la basilique. La narration précise les éléments relevant de la tradition chrétienne. La prière et les ambiances s’atténuent pendant ces séquences. Tous les fichiers audio sont locaux, avec textes et crédits dans `public/audio/experiences/README.md`.

Validation : `tests/visitors-experiences.cjs` vérifie les dialogues réels au clavier, les pistes audio, la succession des étapes, la caméra assise, la sortie, l’apparition, les passages entre salles et la nouvelle disposition.

## Escaliers, crypte et balcons

Sur le côté droit du sanctuaire de la seconde salle, un puits accueille un escalier hélicoïdal de deux tours : marches grises, panneaux vert sombre et filets/ornements or ancien inspirés de la référence. Contournez l’estrade par la droite et abordez le palier du puits. Descendez avec **ZQSD et la souris**, sans téléportation. Le tombeau se trouve désormais huit mètres plus bas dans une chambre sombre ; le cartel propose toujours **E**, puis **1**, pour l’apparition symbolique et le récit vocal. On peut ensuite remonter par le même escalier.

La crypte et l’escalier enterré sont éclairés uniquement par leurs bougies. Le rendu utilise deux passes avec profondeur conservée pour exclure la lumière ambiante et le soleil de ces surfaces. La prière de la seconde salle s’atténue pendant la descente et reprend progressivement au retour. L’apparition ne crée pas de lumière supplémentaire dans la pièce.

Dans la première salle, deux escaliers hélicoïdaux symétriques encadrent la grande entrée et montent de 6,4 mètres, vers deux balcons latéraux reliés par des galeries avant et arrière, formant un tour complet. Les tableaux restent sous les balcons, le centre est ouvert, et l’on peut regarder la maquette et les visiteurs depuis le haut. Les garde-corps et les limites de marche empêchent de tomber dans la salle. La même commande ZQSD permet de redescendre.

La navigation conserve le niveau courant pour distinguer les tours superposés, accepte les petits changements de hauteur des marches et bloque les sauts entre étages. `tests/vertical-routes.cjs` vérifie l’ascension au clavier, les trajets complets aller-retour par le contrôleur du jeu, les balcons, la protection des bords, l’accès à la crypte et l’interaction déplacée du tombeau. `tests/auto-prayer-books.cjs` vérifie aussi l’extinction progressive de la prière en sous-sol et sa reprise au retour. Captures réelles : `artifacts/escalier-spirale-crypte.png`, `artifacts/crypte-aux-bougies.png`, `artifacts/crypte-recit-saint-pierre.png`, `artifacts/balcons-vue-salle.png`, `artifacts/escalier-balcons.png`.

## Escaliers aux flèches, raccords et crypte décorée

Les deux escaliers de l’entrée utilisent la navigation libre ZQSD/flèches et souris, sans bouton, guidage sur un trajet ou changement de caméra. On peut s’arrêter, reculer, tourner et se décaler sur les marches.

Les paliers supérieurs sont élargis, leurs sols rejoignent les dernières marches, et les mains courantes sont reliées aux garde-corps. La galerie arrière est plus large, pour circuler entre les deux escaliers et les balcons. Les grosses pancartes et les petits supports au milieu des passages ont été supprimés.

L’escalier de la crypte est décalé sur le côté droit du sanctuaire, en dehors de l’estrade du maître de cérémonie et à distance des colonnes du baldaquin. La crypte accueille désormais des moulures, palmettes, panneaux bordeaux encadrés d’or ancien et une arche autour du tombeau. Une brume diffuse animée reste au ras du sol, uniquement dans la crypte ; les bougies restent les seules lumières. Le cartel du tombeau conserve son interaction **E**, puis **1**, pour le récit de Pierre.

La silhouette extérieure conserve ses deux grandes coupoles latérales et quatre petites coupoles de chapelles en retrait, avec tambours, nervures, lanternes et croix.

`tests/manual-stairs.cjs` vérifie les six trajets par les événements clavier et la boucle de déplacement du jeu, le déplacement latéral sur les marches, l’arrêt au relâchement et l’absence de contrôleur imposé. `tests/vertical-routes.cjs` vérifie aussi le tour complet des balcons, les raccords, la protection des bords et l’interaction du tombeau.


### Déplacement libre dans les escaliers

Les escaliers utilisent désormais exactement la même navigation que le reste de la visite : ZQSD/flèches et souris. Aucun bouton, aucun guidage sur un trajet, aucun changement de caméra. Orientez-vous librement pour suivre les marches ; vous pouvez tourner, vous arrêter, reculer ou vous décaler. Les garde-corps et limites de marche empêchent de tomber. Les pancartes d’accès sont supprimées. Le petit cartel de la crypte est fixé au mur, sans pied au sol.

Les balcons forment un circuit complet autour du vide central. Les sorties des paliers restent ouvertes. Les garde-corps bordeaux, filets et rosettes en or ancien, panneaux muraux et incrustations au sol décorent les galeries sans encombrer le passage.

### Crypte ouverte, orgue et détails des balcons

Le chemisage de l’escalier souterrain s’arrête au plafond de la crypte. Les dernières marches donnent directement sur la chambre, sans mur circulaire autour du palier inférieur.

Dans la seconde salle, un escalier hélicoïdal à gauche du maître de cérémonie rejoint une galerie complète, dont la tribune de l’orgue au-dessus de l’entrée. On y monte librement avec ZQSD/flèches et la souris. L’orgue comporte cinq tourelles et 35 tuyaux, un buffet bordeaux et bois sombre, des couronnes et des ornements en or ancien, ainsi qu’une console à deux claviers. À proximité de la console, **O** lance ou arrête une courte composition originale en boucle, synthétisée par harmoniques d’orgue et réverbération de nef avec Web Audio. Le son décroît avec la distance et s’efface hors de la salle ; le réglage de volume des ambiances s’applique. Il est atténué pendant les séquences de messe ou de récit. Aucun téléchargement sonore supplémentaire n’est nécessaire.

Les balcons de la première salle possèdent deux lignes lumineuses chaudes sous corniche, deux petites statues aux poses distinctes et deux bancs placés au fond de la galerie. Les bancs et statues sont exclus de la surface de marche, et le tour reste dégagé.

Validation : `tests/chapel-organ.cjs` vérifie l’aller-retour au clavier jusqu’à la tribune, la touche O seulement à proximité, le signal audio réellement produit et l’ouverture du bas de l’escalier de la crypte. `tests/vertical-routes.cjs` vérifie les escaliers existants, le tour des balcons, les nouveaux décors et le récit du tombeau.

Les quatre colonnes noires torsadées du baldaquin reposent désormais sur des socles continus jusqu’au dallage : plinthes noires, filets d’or et dés de pierre claire.

### Sol noir et or et visiteurs aux balcons

Le dallage de la deuxième salle reçoit un marbre noir plus profond, des rosaces et bordures en or ancien, ainsi que des bandes noires et dorées de chaque côté du tapis bordeaux. Le tapis et les chaises sont conservés.

Les deux promeneurs de cette salle empruntent désormais les allées centrales, à distance de l’escalier de l’orgue. Les personnes qui se lèvent sortent de leur rangée puis avancent vers ces allées, au lieu de rejoindre le bord gauche occupé par l’escalier. La présence du joueur à l’étage n’immobilise plus les visiteurs au rez-de-chaussée.

Deux visiteurs supplémentaires parcourent un circuit continu dans la première salle : montée par l’escalier gauche, tour des balcons, descente par l’escalier droit et retour au pied. Ils restent espacés et cèdent le passage au joueur lorsqu’il est à leur niveau. Les trajets suivent les mêmes dimensions et hauteurs que les escaliers du joueur.

`tests/balcony-visitors-floor.cjs` simule six minutes de déplacement pour vérifier montée, descente, circulation sur les galeries, absence de saut de position et passage sur les surfaces praticables. Il vérifie également les allées des promeneurs de la seconde salle et l’écart avec l’escalier de l’orgue.


### Galerie complète de la seconde salle et nom de saint Pierre

La deuxième salle possède désormais un balcon continu à 6,6 m : galerie de l’entrée devant l’orgue, côtés au-dessus des quatre niches de statues, et galerie courbe autour de l’abside. Un escalier hélicoïdal compact à gauche du sanctuaire remplace l’escalier qui passait devant les statues. Les niches restent dégagées ; les anges sont remontés au-dessus de la galerie. Garde-corps bordeaux et or, ouverture au-dessus de la nef et raccord au palier de l’escalier sont conservés sur tout le circuit. La navigation reste entièrement libre. L’orgue et sa console suivent le nouveau niveau ; la touche O reste disponible près de la console.

La crypte conserve son escalier ouvert et sa brume légère. Une plaque murale « SAINT PIERRE » au-dessus du tombeau, un petit tapis bordeaux, un filet doré autour du sépulcre et deux bougies complètent son décor sans encombrer le passage.

`tests/chapel-organ.cjs` vérifie la montée et la descente au clavier, le tour complet de la galerie, les protections des bords et le fonctionnement sonore de l’orgue au nouveau niveau. Captures : `artifacts/balcon-complet-salle-deux.png`, `artifacts/crypte-saint-pierre.png`.

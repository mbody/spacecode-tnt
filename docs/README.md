<h1>&#128640; SPACECODE</h1>

<center>Codez votre spacebot et conquérez... l'univers !</center>

## Principes du jeu

Votre spacebot évolue dans une arène dont il ne peut pas sortir avec des adversaires (8 spacebots max).

Il dispose de trois vies &#129505; &#129505; &#129505; et son objectif est de maximiser son score pour gagner &#127942;.

Pour éliminer vos adveraires, vous pouvez shooter mais 1 fois toutes les 3 secondes seulement... sauf en mode rafale.

> Chaque kill vous rapporte 1 point.

### Bonus

Pour vous aider dans votre mission, des bonus peuvent être collectés :

|                                   |                                                                             |
| --------------------------------: | --------------------------------------------------------------------------- |
|        ![icon](../img/shield.svg) | MGEN vous protège et active votre bouclier !                                |
|          ![icon](../img/bomb.svg) | TNT tire des balles dans 16 directions !                                    |
|         ![icon](../img/heart.svg) | Harmonie Mutuelle vous restaure une vie !                                   |
|       ![icon](../img/crystal.svg) | Ce cristal vous fait gagner 5 points... L'équivalent de 5 kills d'un coup ! |
|        ![icon](../img/riffle.svg) | Mode rafale, vous pouvez tirer toutes les 100 ms !                          |
| ![icon](../img/triple-riffle.svg) | Mode rafalex3, vous pouvez tirer 3 balles toutes les 100 ms !!!             |

Lorsque deux spacebots se rentrent dedans, ils perdent une vie... sauf si leur bouclier est activé !

## Bien démarrer

L'interface présente les éléments suivants :

![max](./img/interface.png)

1. Accès à la configuration de son spacebot (couleur, nom, identifiant = téléphone)
1. Accès à la documentation
1. Envoie le code au serveur. Votre spacecode est ajouté automatiquement au jeu en cours
1. Accès aux blocs de code organisés par catégories
1. Espace de codage

Vous devez donc coder le comportement de votre spacebot dans l'espace de codage en utilisant les blocs à votre disposition et en les arrangeant les uns avec les autres.

> ⚠️ Seuls les éléments compris dans des blocs verts seront pris en compte.

> Attention : Pour associer deux blocs, il faut utiliser la partie gauche du bloc utilisé et la faire glisser dans la cible souhaitée jusqu'à ce qu'elle se surligne :

![max](./img/block-position.png)

Il est également possible de dupliquer des blocs en

## Références des blocs

### Base

#### Au démarrage

![block](./img/start.png)

Ce bloc de code sera exécuté au démarrage et lorsque votre spacebot respawn après avoir été tué.

#### Toujours

![block](./img/always.png)

Le bloc "Toujours" est la boucle principale de votre programme, elle est appelée environ 20 fois par seconde.

#### Lorsque ...

![block](./img/handler.png)

Permet d'exécuter du code lorsque l'événement sélectionné se produit

#### Définir

![block](./img/set-attribute.png)

Permet de définir un des attributs de votre vaisseau.

Pour `x` et `y`, la règle est la suivante pour le positionnement dans l'arène :

![max](./img/arena-xy.png)

Pour `rotation`, la valeur est exprimée en degré et l'orientation est définie ainsi :

![max](./img/arena-rotation.png)

### Actions

#### Déplacer

![block](./img/move.png)

Permet de faire avancer ou reculer le spacebot de l'incrément choisi (en nombre de pixels), éventuellement négatif.

> ⚠️ Ce nombre sera borné entre -30 et 30.

#### Tourner

![block](./img/turn.png)

Permet de faire tourner le spacebot dans le sens et de l'incrément choisis (en degré), éventuellement négatif.

> ⚠️ Ce nombre sera borné entre -20 et 20.

#### Shooter

![block](./img/shoot.png)

Tire... dans la limite d'une balle toutes les 3 secondes.
Si le bonus 'Rafale' a été collecté et qu'il est encore actif, les balles pourront être tirées toutes les 100 ms !

### Logique

#### Adversaire/Bonus détecté

![block](./img/scan.png)

Retourne vrai si l'objet choisi (adversaire ou bonus) est dans l'angle de vue du spacebot (+/- 5°), sinon faux

![max](./img/arena-scan.png)

#### Bouclier/Rafale actif

![block](./img/state.png)

Retourne vrai si le bouclier ou si le mode rafale est actif, sinon faux

#### Si, Sinon si, Sinon

![block](./img/ifelse.png)

Ce bloc est indispensable pour concevoir des branches conditionnelles dans votre programme en fonction de valeurs booléennes.
Vous pouvez les pamarétrer en utilisant la petite roue crantée bleue et ajouter les blocs souhaités dans le pop-up qui s'ouvre !

## Credits

Projet de Mathurin BODY pour Makers Kids Montlouis, basé sur les travaux de [Chris Courses - Online Multiplayer Game Tutorial](https://www.youtube.com/watch?v=Wcvqnx14cZA) et de [Spishewi synchronized shapes](https://github.com/Spishewi/makerskids-syncronized-shapes) !

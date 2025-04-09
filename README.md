# QT Robot Math

![QT Robot](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mPxPrXC43PxNdzoHPXLsRQp6tskmBv.png)

QT Robot Math est une application web interactive conçue pour aider les enfants de 8 à 10 ans à apprendre les mathématiques de manière ludique et engageante. L'application utilise un robot virtuel (QT) qui interagit avec les enfants, leur pose des questions et leur fournit des explications adaptées à leur niveau.

## Table des matières

- [Installation](#installation)
- [Utilisation](#utilisation)
- [Technologies utilisées](#technologies-utilisées)
- [Logique du projet](#logique-du-projet)
- [Fichiers clés](#fichiers-clés)
- [Fonctionnalités](#fonctionnalités)

## Installation

### Prérequis

- Node.js (v18 ou supérieur)
- npm ou yarn
- Git
- Next.js

### Étapes d'installation

1. Clonez le dépôt GitHub :

```bash
git clone https://github.com/YasserRazzaki/qt-robot-math.git
cd qt-robot-math
```

2. Installez les dépendances :


```shellscript
npm install
# ou
yarn install
```

3. Lancez le serveur de développement :


```shellscript
npm run dev
# ou
yarn dev
```

4. Ouvrez votre navigateur et accédez à `http://localhost:3000`


### Déploiement

Pour déployer l'application en production :

```shellscript
npm run build
npm run start
# ou
yarn build
yarn start
```

## Utilisation

### Test du robot de mathématiques

#### Interface utilisateur

1. Sur la page d'accueil, cliquez sur le bouton "Tester le Robot"
2. Choisissez une opération mathématique (addition, soustraction, multiplication, division)
3. Entrez deux nombres pour votre calcul
4. Entrez votre réponse
5. Cliquez sur "Vérifier ma réponse"
6. Le robot QT vous indiquera si votre réponse est correcte et vous fournira une explication


#### Utilisation vocale

L'application prend en charge la reconnaissance vocale pour une expérience plus interactive :

1. Cliquez sur l'icône de microphone dans la barre supérieure ou sur le bouton "Dicter à voix haute"
2. Parlez clairement en utilisant l'un des formats suivants :

    1. "5 plus 3 égale 8"
    2. "10 moins 4"
    3. "6 fois 7"
    4. "20 divisé par 5"

Ensuite pour la réponse, vous pouvez directement dire le nombre de réponse ou "La réponse est 8"

3. Vous pouvez également utiliser des commandes comme :

1. "Vérifier ma réponse"
2. "Nouveau calcul"
3. "Activer l'audio" / "Désactiver l'audio"


#### Questions vrai/faux

Le robot pose occasionnellement des questions vrai/faux pour tester votre compréhension :

1. Lisez la question mathématique
2. Cliquez sur "Vrai" ou "Faux" selon votre réponse
3. Le robot vous donnera un feedback immédiat


## Technologies utilisées

- **Next.js** : Framework React pour le développement frontend et backend
- **TypeScript** : Pour un code typé et plus robuste
- **Tailwind CSS** : Pour le design et la mise en page responsive
- **Web Speech API** : Pour la synthèse vocale et la reconnaissance vocale
- **Shadcn/UI** : Pour les composants d'interface utilisateur
- **Lucide React** : Pour les icônes


## Logique du projet

Le projet est structuré autour de plusieurs concepts clés :

### 1. Architecture React avec Next.js

- Utilisation de l'App Router de Next.js pour la navigation
- Composants React pour une interface modulaire et réutilisable
- Hooks personnalisés pour la logique métier


### 2. Interaction vocale

- Synthèse vocale (`useSpeechSynthesis`) : Permet au robot de parler et d'expliquer les concepts mathématiques
- Reconnaissance vocale (`useSpeechRecognition`) : Permet aux enfants de dicter leurs réponses et commandes


### 3. Logique mathématique

- Génération dynamique de problèmes mathématiques
- Vérification des réponses avec gestion des erreurs d'arrondi
- Génération d'explications adaptées au niveau de l'enfant
- Questions vrai/faux générées aléatoirement pour tester la compréhension


### 4. Interface utilisateur interactive

- Robot animé qui réagit aux interactions (expressions faciales, mouvements)
- Feedback visuel et auditif pour les réponses correctes et incorrectes
- Design responsive adapté à différents appareils


## Fichiers clés

- `app/page.tsx` : Page d'accueil de l'application
- `app/apprendre/page.tsx` : Page principale d'apprentissage des mathématiques
- `components/qt-robot-real.tsx` : Composant principal du robot QT avec animations et expressions
- `hooks/use-speech-synthesis.ts` : Hook personnalisé pour la synthèse vocale
- `hooks/use-speech-recognition.ts` : Hook personnalisé pour la reconnaissance vocale
- `hooks/use-math-questions.ts` : Hook pour la génération de questions mathématiques
- `components/true-false-question.tsx` : Composant pour les questions vrai/faux


## Fonctionnalités

- **Interface interactive avec QT Robot** : Un robot virtuel animé qui réagit aux interactions
- **Exercices mathématiques** : Addition, soustraction, multiplication et division
- **Synthèse vocale** : Le robot parle et explique les concepts mathématiques
- **Reconnaissance vocale** : Les enfants peuvent dicter leurs réponses et opérations
- **Questions vrai/faux** : Le robot pose des questions pour vérifier la compréhension
- **Feedback immédiat** : Explications détaillées pour les réponses correctes et incorrectes
- **Design responsive** : Fonctionne sur ordinateurs, tablettes et smartphones

---

Développé par Yasser Razzaki avec ❤️ pour aider les enfants à aimer ainsi qu'à comprendre les mathématiques.

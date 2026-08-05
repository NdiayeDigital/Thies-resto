# 🚀 Guide de Déploiement & Configuration Production

Ce guide explique étape par étape comment déployer et configurer la plateforme **THIÉS Resto** pour un environnement de production complet.

---

## 1. Préparation de la Base de Données Supabase

1. Créez un compte gratuit sur [Supabase](https://supabase.com).
2. Créez un nouveau projet (ex: `Thies-Resto-Prod`).
3. Accédez à l'**Éditeur SQL** (SQL Editor) dans le panneau de gauche de Supabase.
4. Cliquez sur **New Query** (Nouvelle requête).
5. Copiez et collez le contenu du fichier [supabase_setup.sql](file:///c:/Users/mouha/OneDrive/Desktop/Thi%C3%A9s%20%C3%A0%20Table/supabase_setup.sql).
6. Cliquez sur **Run** pour exécuter le script.
   * *Cela créera les quatre tables nécessaires (`restaurants`, `orders`, `reservations`, `customers`) avec les politiques de sécurité (RLS) associées.*

---

## 2. Configuration du Client Frontend

1. Récupérez vos clés d'API Supabase :
   * Allez dans **Project Settings** > **API**.
   * Copiez l'**URL du projet** et la clé **anon (public)**.
2. Ouvrez le fichier [app.js](file:///c:/Users/mouha/OneDrive/Desktop/Thi%C3%A9s%20%C3%A0%20Table/app.js) dans le code source de votre frontend.
3. Repérez les variables de configuration aux alentours de la ligne 125 :
   ```javascript
   const SUPABASE_URL = 'https://[VOTRE_ID_PROJET].supabase.co';
   const SUPABASE_ANON_KEY = '[VOTRE_CLE_ANON]';
   ```
4. Remplacez par vos clés réelles de production et sauvegardez.

---

## 3. Déploiement du Site (Frontend PWA)

La plateforme est entièrement statique (HTML, CSS, JS), ce qui la rend éligible aux hébergeurs gratuits et rapides.

### Option A : Déploiement sur Vercel (Recommandé)
1. Installez le CLI Vercel (`npm i -g vercel`) ou connectez votre dépôt GitHub sur le site de [Vercel](https://vercel.com).
2. Si vous utilisez le CLI, lancez la commande suivante à la racine du projet :
   ```bash
   vercel
   ```
3. Suivez les instructions et validez. Pour passer en production :
   ```bash
   vercel --prod
   ```

### Option B : Déploiement sur Netlify
1. Connectez-vous sur [Netlify](https://netlify.com).
2. Cliquez sur **Add new site** > **Import from Git**.
3. Choisissez votre dépôt GitHub, configurez le dossier racine et laissez le champ de commande de build vide (le site n'a pas besoin de compilation).
4. Cliquez sur **Deploy**.

---

## 4. Activation du Mode PWA (Offline-First)

Le Service Worker (`sw.js`) est déjà pré-configuré à la racine du projet.
Pour vérifier que la PWA fonctionne :
1. Ouvrez l'inspecteur de votre navigateur (F12) > Onglet **Application**.
2. Allez dans **Service Workers** et vérifiez qu'il est activé et contrôle la page.
3. Allez dans **Manifest** pour voir le nom, les icônes, et vérifier qu'il est installable sur smartphone (icône d'installation dans la barre d'adresse).

---

## 5. Tests de Validation en Production

Avant de communiquer le lien à vos clients et restaurants partenaires, validez les points suivants :

1. **Seeding automatique** : Ouvrez le site pour la première fois. Vérifiez dans votre table `restaurants` sur Supabase que les 20 restaurants d'origine ont été injectés automatiquement.
2. **Prise de commande** : Passez une commande test. Vérifiez :
   * Qu'elle apparaît dans l'onglet **Commandes** de votre espace restaurateur.
   * Qu'elle apparaît dans la table `orders` sur Supabase.
   * Que le numéro de téléphone du client est inséré dans la table `customers` de loyauté.
3. **Réservation** : Créez une demande de table et validez sa présence dans la table `reservations`.

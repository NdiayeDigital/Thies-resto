# 🧠 Notions Développeur : Thiés à Table

Ce document rassemble et explique les principaux concepts techniques et les technologies de développement utilisés dans la conception de la plateforme **Thiés à Table**.

## 1. PWA (Progressive Web App) & Offline-First
Une **PWA** est une application web qui utilise des technologies modernes pour offrir une expérience utilisateur similaire à celle d'une application mobile native.
* **Offline-First (Priorité au hors-ligne)** : L'application est conçue pour fonctionner en priorité même avec une connexion internet instable ou inexistante. Elle utilise le cache local du navigateur (`localStorage`) pour stocker les données immédiates.
* **Service Worker (`sw.js`)** : C'est un script JavaScript qui s'exécute en arrière-plan. Il intercepte les requêtes réseau et permet de mettre en cache les ressources essentielles (fichiers CSS, JS, images). Ainsi, l'interface utilisateur peut se charger instantanément même sans connexion.
* **Manifest (`manifest.json`)** : Un fichier de configuration JSON qui fournit au navigateur des informations sur l'application (nom, icônes, couleurs de thème). C'est ce qui permet aux utilisateurs "d'installer" le site web sur l'écran d'accueil de leur smartphone comme une vraie application.

## 2. Supabase & Base de Données PostgreSQL
**Supabase** est une plateforme Backend-as-a-Service (BaaS) open-source, utilisée comme backend et base de données cloud pour le projet.
* **PostgreSQL** : Un système de gestion de base de données relationnelle objet très puissant, robuste et évolutif. Il gère les tables de données (restaurants, commandes, utilisateurs).
* **RLS (Row-Level Security)** : Une fonctionnalité critique de sécurité de PostgreSQL. Elle permet de restreindre l'accès et les modifications des données *ligne par ligne*. Par exemple, des règles RLS strictes garantissent qu'un restaurateur ne peut consulter que les commandes de *son* établissement, et non celles des autres.
* **Vues (Views) & RPC (Remote Procedure Call)** : Pour éviter d'exposer directement la structure des tables sensibles côté client, l'architecture utilise des "Vues" (requêtes pré-enregistrées sécurisées) et des fonctions "RPC" (des procédures logiques exécutées côté serveur). Cela empêche les fuites de données (ex: identifiants clients/partenaires) et centralise la validation.

## 3. Architecture Front-End "Vanilla"
Le projet se distingue par l'absence de frameworks lourds (pas de React, Vue, ou Angular) ou de bibliothèques CSS encombrantes (pas de Bootstrap ou Tailwind).
* **Vanilla HTML5, CSS3, JavaScript (ES6)** : Le code est écrit "à la main" en utilisant les standards purs du web. Cela permet d'avoir une application extrêmement légère, avec des temps de chargement ultra-rapides et une maintenance simplifiée.
* **SPA (Single Page Application)** : Toute l'application se charge en une seule page web. La navigation entre les différentes sections (menu, panier, commandes) se fait dynamiquement via JavaScript. Il n'y a pas de rechargement complet de la page, ce qui offre une fluidité optimale.

## 4. SEO (Search Engine Optimization)
Le SEO rassemble les techniques permettant d'optimiser le référencement naturel du site sur les moteurs de recherche comme Google.
* **Balises Meta** : Ce sont des éléments HTML invisibles pour les visiteurs mais essentiels pour les robots d'indexation. Elles définissent le titre de la page, la description et aident à la prévisualisation des liens sur les réseaux sociaux.
* **JSON-LD (Structured Data)** : Un format de données structurées intégré au code. Il "parle" directement aux moteurs de recherche pour leur expliquer explicitement le contenu (ex: indiquer qu'une page représente un "Restaurant" local à Thiès, avec ses notes, ses horaires et ses coordonnées).
* **Robots.txt & Sitemap.xml** : Le `robots.txt` indique aux moteurs de recherche quelles pages ils peuvent ou ne doivent pas indexer. Le `sitemap.xml` est un plan du site qui liste toutes les pages importantes pour faciliter et accélérer leur découverte.

## 5. UI/UX et Design Moderne
* **Mobile-First / Responsive Design** : L'interface a été conçue en priorité pour les petits écrans (smartphones), qui représentent la majorité du trafic, avant d'être adaptée pour les grands écrans.
* **Micro-interactions & Animations** : L'utilisation de retours visuels (animations de confettis, transitions fluides, effets de survol, design "Glassmorphism") améliore l'engagement de l'utilisateur. Ces détails donnent un aspect "Premium" et vivant à l'application.

## 6. Déploiement et Infrastructure (Vercel)
Le projet utilise **Vercel** pour son hébergement (indiqué par la présence de `vercel.json`).
* **Hébergement Serverless & CDN Edge** : Le code Front-End est déployé sur un réseau mondial de serveurs (CDN). Lorsqu'un utilisateur à Thiès ouvre le site, il télécharge les fichiers depuis le serveur physique le plus proche, garantissant une latence minimale et des performances maximales.

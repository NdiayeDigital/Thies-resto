# 🛠️ Architecture Technique & Synchronisation Supabase

Ce document détaille l'architecture logicielle, la structure de la base de données et la stratégie de synchronisation de la plateforme **THIÉS Resto**.

---

## 1. Vue d'ensemble de l'architecture
L'application fonctionne selon un modèle **PWA (Progressive Web App) "Offline-First"** avec synchronisation cloud.
*   **Front-End** : Single Page Application (SPA) ultra-rapide écrite en Vanilla HTML5, CSS3, et ES6 JavaScript.
*   **Base de Données Locale** : `localStorage` gère la persistance immédiate côté client pour un fonctionnement hors-ligne à latence zéro.
*   **Base de Données Cloud** : **Supabase** (PostgreSQL) agit comme source de vérité centrale pour la persistance multi-appareils et l'administration.

---

## 2. Schéma de la Base de Données (PostgreSQL)

La base de données en ligne comprend 4 tables clés. Les scripts de configuration associés se trouvent dans le fichier `supabase_setup.sql`.

### Table `restaurants`
Contient les informations d'identité, de contact et le catalogue de chaque établissement.
*   `id` (TEXT, PK) : Identifiant unique (ex: `r1`, `r2`).
*   `name` (TEXT) : Nom commercial.
*   `slug` (TEXT, Unique) : Identifiant URL simplifié.
*   `rating` (NUMERIC) : Note moyenne.
*   `reviews_count` (INT) : Nombre d'avis clients.
*   `category` (TEXT) : Tag de spécialité culinaire.
*   `address` (TEXT) : Adresse physique à Thiès.
*   `whatsapp` (TEXT) : Téléphone de contact (format international).
*   `open_hours` (TEXT) : Plage horaire.
*   `closed_days` (JSONB) : Jours de fermeture hebdomadaire.
*   `is_open_manual` (BOOLEAN) : Commutateur manuel d'ouverture.
*   `status` (TEXT) : Statut du compte (`active`, `pending`, `suspended`).
*   `username` / `password` (TEXT) : Identifiants de connexion au tableau de bord.
*   `cover_image` (TEXT) : URL de l'image de couverture.
*   `menu` (JSONB) : Liste des plats et tarifs.
*   `reviews` (JSONB) : Liste des commentaires et réponses.

### Table `orders`
Enregistre les détails de toutes les commandes de plats passées sur la plateforme.
*   `id` (TEXT, PK) : Référence de commande (ex: `ORD-9821`).
*   `restaurant_id` (TEXT, FK) : Référence du restaurant.
*   `customer_name` (TEXT) : Nom & Prénom du client.
*   `customer_phone` (TEXT) : Téléphone client (WhatsApp).
*   `mode` (TEXT) : Livraison ou À emporter.
*   `address` (TEXT) : Adresse de livraison.
*   `items` (JSONB) : Liste des plats, prix et quantités commandés.
*   `total` (NUMERIC) : Montant total de la commande.
*   `note` (TEXT) : Remarques client.
*   `status` (TEXT) : Statut (`Reçue`, `Confirmée`, `En préparation`, `Livrée`, `Annulée`).
*   `date` / `time` (TEXT) : Date et heure de soumission.

### Table `reservations`
Enregistre les demandes de réservations de table faites en ligne.
*   `id` (TEXT, PK) : Référence unique.
*   `restaurant_id` (TEXT, FK) : Référence du restaurant.
*   `customer_name` (TEXT) : Identité du client.
*   `customer_phone` (TEXT) : Téléphone client.
*   `date` / `time` (TEXT) : Date et heure de réservation.
*   `guests` (INT) : Nombre de couverts demandés.
*   `note` (TEXT) : Demandes spéciales.
*   `status` (TEXT) : Statut (`En attente`, `Confirmée`, `Annulée`).

### Table `customers`
Tableau des profils clients, indispensable pour stocker l'historique et la fidélité.
*   `phone` (TEXT, PK) : Numéro de téléphone WhatsApp (nettoyé).
*   `name` (TEXT) : Nom ou prénom du client.
*   `used_rewards` (INT) : Nombre de récompenses fidélité déjà réclamées (plats offerts).
*   `created_at` (TIMESTAMPTZ) : Date de création du profil.

---

## 3. Stratégie de Synchronisation Hybride
Pour offrir une expérience fluide y compris sur des connexions mobiles instables (3G/4G locale), la synchronisation utilise un concept asynchrone non bloquant :

1.  **Démarrage** : L'application charge instantanément le cache local depuis `localStorage`.
2.  **Initialisation client** : Si Supabase est accessible, la méthode `syncFromSupabase()` est lancée en arrière-plan.
3.  **Réconciliation** :
    *   Si Supabase est vide (première connexion), le store y pousse ses données locales d'origine (Auto-Seeding).
    *   Si Supabase contient des données, elles fusionnent avec les données locales (les commandes locales non synchronisées sont poussées en ligne, et les nouvelles commandes en ligne sont téléchargées localement).
4.  **Enregistrement en direct** : Chaque action utilisateur (commande, réservation, changement de statut restaurateur) modifie le cache immédiat pour un retour visuel instantané, puis envoie une requête d'écriture en ligne sans bloquer l'interface.

---

## 4. Sécurité & RLS (Row Level Security)
Les politiques de sécurité de la base de données autorisent l'accès anonyme (RLS public bypass) pour l'insertion de commandes et la consultation des restaurants, éliminant la lourdeur d'un système d'authentification par email obligatoire pour le client final :
*   `SELECT` : Autorisé pour tous (visiteurs et restaurateurs).
*   `INSERT` : Autorisé pour tous (pour placer une commande ou une réservation).
*   `UPDATE` : Autorisé pour tous (permet aux restaurateurs de modifier les statuts de commande sans authentification complexe).

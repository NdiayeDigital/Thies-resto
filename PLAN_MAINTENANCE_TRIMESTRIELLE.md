# 📅 Plan de Maintenance Trimestrielle (Tous les 3 mois)

Ce document établit la liste des vérifications et des tâches à effectuer **tous les 3 mois** pour garantir que la plateforme **Thiés à Table** reste performante, sécurisée et à jour.

---

## 1. 🗄️ Base de Données & Backend (Supabase)

**Objectif :** Éviter la saturation de la base de données, sécuriser les données et surveiller les limites du forfait gratuit/payant.

* [ ] **Sauvegarde (Backup) :** Exporter les données critiques (Tables `restaurants`, `orders`, `customers`) au format CSV depuis le tableau de bord Supabase pour avoir une copie de sécurité locale.
* [ ] **Archivage des Commandes :** Supprimer ou archiver les très anciennes commandes (plus de 6 mois) si la base de données commence à être trop lourde, afin de garder des temps de réponse rapides.
* [ ] **Vérification des Quotas :** Aller sur le tableau de bord Supabase (Settings > Usage) et vérifier la consommation :
  * Espace de stockage de la base de données (Database size).
  * Bande passante mensuelle (Egress).
  * Espace de stockage des fichiers (Storage, si utilisé pour les images).
* [ ] **Revue de la Sécurité (RLS) :** S'assurer que les règles *Row-Level Security* sont toujours bien en place et qu'aucune table sensible n'a été accidentellement rendue publique en lecture/écriture totale.

---

## 2. ⚡ Performance Frontend & PWA

**Objectif :** S'assurer que l'application charge toujours aussi vite et que le mode hors-ligne fonctionne correctement.

* [ ] **Audit Google Lighthouse :** Ouvrir l'application sur Google Chrome, faire un clic droit > *Inspecter* > onglet *Lighthouse* et lancer un audit. Corriger les éventuels scores qui auraient baissé (Performances, Accessibilité, SEO).
* [ ] **Vérification du Cache (Service Worker) :** Tester l'application en mode hors-ligne (couper le wifi/données) pour s'assurer que l'application s'affiche toujours bien. Si des modifications majeures de design sont faites, penser à vider l'ancien cache ou mettre à jour la version dans le fichier `sw.js`.
* [ ] **Tests Multi-Navigateurs :** Vérifier que le site s'affiche toujours correctement sur les dernières versions de Safari (iOS), Chrome (Android) et Firefox.

---

## 3. 🔍 SEO (Référencement) & Marketing

**Objectif :** Maintenir ou améliorer la position de la plateforme sur les moteurs de recherche.

* [ ] **Google Search Console :** Vérifier s'il y a des erreurs d'indexation (pages introuvables, erreurs 404).
* [ ] **Vérification du `sitemap.xml` :** Si de nouveaux restaurants ou de nouvelles pages importantes ont été ajoutés, s'assurer que le fichier `sitemap.xml` est à jour et bien soumis à Google.
* [ ] **Audit des Liens :** Vérifier que les redirections WhatsApp fonctionnent toujours correctement (l'API WhatsApp peut parfois faire de légères mises à jour).

---

## 4. 📝 Mise à jour des Contenus (Restaurants)

**Objectif :** Garder les informations pertinentes et à jour pour les clients.

* [ ] **Revue des Menus & Prix :** Demander aux restaurateurs partenaires s'il y a eu des changements de prix ou de plats pour les mettre à jour.
* [ ] **Horaires d'Ouverture :** Vérifier si les horaires habituels ou les jours de fermeture ont changé (ex: changements liés aux vacances, au ramadan, etc.).
* [ ] **Vérification des Comptes Inactifs :** Désactiver ou suspendre temporairement le statut (`status = 'suspended'`) des restaurants qui ne répondent plus ou qui sont fermés depuis longtemps.

---

## 5. ☁️ Hébergement (Vercel) & Domaines

**Objectif :** S'assurer que l'application reste en ligne sans interruption.

* [ ] **Renouvellement du Nom de Domaine :** Vérifier la date d'expiration du nom de domaine personnalisé (ex: *thiesatable.com* ou *.sn*) et s'assurer que le renouvellement automatique est activé.
* [ ] **Alertes Vercel :** Vérifier l'interface Vercel pour s'assurer qu'il n'y a pas d'erreurs de déploiement bloquées ou d'avertissements de sécurité concernant l'infrastructure.

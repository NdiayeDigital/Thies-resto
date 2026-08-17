router.add('#/', () => {
    updateSEO('home');
    try {
        const cartBar = document.getElementById('floating-cart-bar');
        if (cartBar) cartBar.style.display = 'none';
        
        if (typeof stopOrderPolling === 'function') stopOrderPolling();
        if (typeof loadCart === 'function') loadCart();
        
        const allRestos = store.getRestaurants().filter(r => r.status === 'active');
        const shuffledIds = allRestos.map(r => r.id);
        for (let i = shuffledIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledIds[i], shuffledIds[j]] = [shuffledIds[j], shuffledIds[i]];
    }
    window.shuffledRestaurantIds = shuffledIds;
    
    const container = document.getElementById('main-content');
    
    const activeRestos = allRestos;
    const totalOrders = store.data.orders ? store.data.orders.length : 0;
    const totalReservations = store.data.reservations ? store.data.reservations.length : 0;

    // Load order history
    const history = getOrderHistory();
    let historyHtml = '';
    if (history.length > 0) {
        let itemsHtml = '';
        history.slice(0, 5).forEach(h => {
            itemsHtml += `
                <div class="history-item">
                    <div>
                        <strong>${h.id}</strong> — ${h.restaurantName || 'Restaurant'}
                        <div class="history-item-meta">${(Array.isArray(h.items) ? h.items : []).map(i => i.name || 'Produit').join(', ')}</div>
                    </div>
                    <div style="text-align:right;">
                        <strong style="color:var(--primary)">${h.total} FCFA</strong>
                        <div class="history-item-meta">${h.date}</div>
                    </div>
                </div>
            `;
        });
        historyHtml = `
            <section class="history-mini">
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0 1rem; margin-bottom: 1rem;">
                    <h2 class="section-title">Vos Dernières Commandes (Persistant)</h2>
                </div>
                ${itemsHtml}
            </section>
        `;
    }

    const hour = new Date().getHours();
    let greeting = "Bonjour";
    if (hour < 11) greeting = "Bonjour ! Prêt pour le déjeuner ?";
    else if (hour < 17) greeting = "Une petite faim ?";
    else greeting = "Bonsoir ! Ne cuisinez pas ce soir.";


    container.innerHTML = `
        <!-- ========== HERO SECTION ========== -->
        <section class="hero-section page-transition" style="background: linear-gradient(var(--glass-bg), var(--bg-primary)), url('https://images.unsplash.com/photo-1544025162-d76694265947?w=1920&auto=format&fit=crop&q=80') center/cover fixed;">
                <div class="hero-left-col hover-3d" style="padding: 2rem; border-radius: 24px; background: var(--glass-bg); backdrop-filter: blur(16px); border: 1px solid var(--border); box-shadow: var(--shadow);">
                    <span class="greeting-text" style="display: block; font-size: 1.1rem; color: var(--primary); font-weight: 600; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 2px;">${greeting}</span>
                    <h1 class="hero-title" style="color: var(--text-primary); text-shadow: 0 4px 20px rgba(0,0,0,0.8); font-weight: 800; letter-spacing: -0.03em; margin-bottom: 1.5rem;">Découvrez les Meilleures Tables de <span style="color: var(--primary);">Thiès</span></h1>
                    <p class="hero-subtitle" style="color: var(--text-secondary); font-size: 1.2rem; line-height: 1.6; margin-bottom: 2.5rem;">Commandez vos plats du jour locaux en direct ou réservez votre table en quelques clics. Paiement à la livraison ou sur place. Simple, rapide et sans commission.</p>
                    
                    <div class="search-container hover-3d" style="margin: 0 0 2rem 0; width: 100%; max-width: 480px; position: relative;">
                        <input type="text" x-model="searchQuery" class="search-input" placeholder="Rechercher un plat, un restaurant..." style="background: var(--bg-input); color: var(--text-primary); border: 1px solid var(--border); border-radius: 16px; padding: 1.2rem 3rem 1.2rem 1.5rem; width: 100%; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1); transition: var(--transition-smooth);">
                        <button class="search-btn" style="color: var(--primary); position: absolute; right: 15px; top: 50%; transform: translateY(-50%); background: none; border: none; font-size: 1.2rem;">🔍</button>
                    </div>

                    <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: flex-start;">
                        <button class="btn btn-primary ripple hover-3d" onclick="scrollToCatalog()" style="box-shadow: 0 10px 25px -5px rgba(242,107,33,0.5); padding: 1rem 2rem; border-radius: 12px; font-weight: 600;">Explorer nos Menus 🍽️</button>
                        <button class="btn btn-secondary ripple hover-3d" onclick="geolocateRestaurants()" style="background: var(--glass-bg); color: var(--text-primary); border: 1px solid var(--border); padding: 1rem 2rem; border-radius: 12px; font-weight: 500;">📍 Trouver autour de moi</button>
                    </div>
                </div>
                
            </div>
        </section>
        <!-- VOS DERNIERES COMMANDES PERSISTANT -->
        ${historyHtml}

        <!-- ========== KEY CONCEPTS ROW (3 Cards: Text - Image - Text) ========== -->
        <section class="presentation-section" style="padding: 1rem 0 0 0;">
            <div class="reference-row-cards">
                <!-- Left Card: Zero Account -->
                <div class="ref-card-text">
                    <div class="ref-card-icon-circle">🚫</div>
                    <h3>Zéro Inscription</h3>
                    <p>Commandez et réservez sans jamais avoir besoin de créer un compte. Aucun mot de passe à retenir.</p>
                </div>
                
                <!-- Middle Card: Premium Dish Image -->
                <div class="ref-card-image-box">
                    <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80" alt="Gourmet Bowl" loading="lazy">
                </div>
                
                <!-- Right Card: Direct WhatsApp -->
                <div class="ref-card-text">
                    <div class="ref-card-icon-circle">💬</div>
                    <h3>Direct WhatsApp</h3>
                    <p>Votre panier est transformé en un message structuré envoyé en un clic au restaurateur pour confirmation.</p>
                </div>
            </div>
        </section>

        

        <section id="catalog-section" x-data="catalogComponent()">
            <div class="section-header">
                <h2 style="font-size: 1.2rem; font-weight: 700; margin: 0;">Restaurants</h2><span style="color: var(--text-secondary); font-size: 0.9rem; cursor: pointer;">View All</span>
            </div>


            <!-- SORTING BAR -->
            <div class="sort-bar">
                <label for="sort-select">Trier par :</label>
                <select class="sort-select" id="sort-select" x-model="sortBy">
                    <option value="default">Recommandé</option>
                    <option value="rating">Meilleure note ★</option>
                    <option value="reviews">Nombre d'avis</option>
                    <option value="name">Nom de A à Z</option>
                </select>
            </div>
            
            <div class="restaurant-grid" id="restaurants-list-grid">
                <template x-if="filteredRestaurants.length === 0">
                    <div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 3rem 0;">Aucun restaurant ne correspond à vos critères.</div>
                </template>
                
                
                <template x-for="r in filteredRestaurants" :key="r.id">
                    <div class="glass-card" style="display: flex; padding: 1rem; margin: 0 1rem 1rem 1rem; cursor: pointer; border-radius: 20px; align-items: center; gap: 1rem;" @click="openRestaurant(r.slug)">
                        <img :src="r.coverImage || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&auto=format&fit=crop&q=60'" style="width: 80px; height: 80px; object-fit: cover; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.3);" :alt="r.name" loading="lazy">
                        <div style="flex: 1;">
                            <h3 style="margin: 0 0 0.25rem 0; font-size: 1.1rem; font-weight: 700; color: var(--text-primary);" x-text="r.name"></h3>
                            <p style="color: var(--text-secondary); font-size: 0.85rem; margin: 0 0 0.5rem 0;" x-text="r.category"></p>
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <div style="display: flex; align-items: center; gap: 0.2rem;">
                                    <span style="color: var(--primary); font-size: 0.9rem;">★</span>
                                    <span style="font-weight: 600; font-size: 0.85rem; color: var(--text-primary);" x-text="r.rating || '4.5'"></span>
                                </div>
                                <template x-if="isCurrentlyOpen(r)">
                                    <span style="color: var(--success); font-size: 0.8rem; font-weight: 600;">Ouvert</span>
                                </template>
                            </div>
                        </div>
                        <div style="color: var(--primary); font-size: 1.5rem;">➔</div>
                    </div>
                </template>

                        <div class="restaurant-card-header" style="height: 200px; position: relative;">
                            <img :src="r.coverImage || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60'" style="width: 100%; height: 100%; object-fit: cover;" :alt="r.name" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60'">
                            <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 50%; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);"></div>
                            <div style="position: absolute; top: 1rem; left: 1rem; z-index: 2;">
                                <template x-if="isCurrentlyOpen(r)">
                                    <span class="badge badge-success restaurant-card-badge">Ouvert</span>
                                </template>
                                <template x-if="!isCurrentlyOpen(r)">
                                    <span class="badge badge-danger restaurant-card-badge">Fermé</span>
                                </template>
                            </div>
                        </div>
                        <div class="restaurant-card-body" style="padding: 1.5rem; flex: 1; display: flex; flex-direction: column; background: var(--bg-card);">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                                <h3 style="margin: 0; font-size: 1.2rem; font-weight: 700; color: var(--text-primary);" x-text="r.name"></h3>
                                <div style="display: flex; align-items: center; background: rgba(255, 184, 0, 0.1); padding: 0.25rem 0.5rem; border-radius: 8px;">
                                    <span style="color: #ffb800; margin-right: 4px;">★</span>
                                    <span style="font-weight: 600; font-size: 0.9rem; color: var(--text-primary);" x-text="r.rating + ' (' + r.reviewsCount + ')'"></span>
                                </div>
                            </div>
                            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem; flex: 1;" x-text="r.category + ' • ' + r.address"></p>
                            <button class="btn btn-primary btn-block" style="border-radius: 12px; padding: 0.75rem; font-weight: 600;">Voir le Menu ➔</button>
                        </div>
                    </div>
                </template>
            </div>

            <!-- RESTAURANT SUGGESTION CTA -->
            <div style="background: rgba(207, 168, 83, 0.1); border: 1px dashed var(--primary); border-radius: 16px; padding: 2rem; text-align: center; max-width: 600px; margin: 3rem auto 1rem auto;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">🤔</div>
                <h3 style="color: var(--text-primary); margin-bottom: 0.5rem; font-size: 1.2rem;">Votre restaurant préféré n'est pas là ?</h3>
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.5rem;">Nous ajoutons continuellement de nouvelles tables à Thiès. Aidez-nous à découvrir les meilleures !</p>
                <a href="https://wa.me/221784799882?text=Bonjour,%20j'aimerais%20suggérer%20ce%20restaurant%20sur%20Thiès%20à%20Table%20:%20[Insérez le nom]" target="_blank" class="btn btn-primary" style="background: var(--bg-card); color: var(--primary); border: 1px solid var(--primary); text-decoration: none;">
                    Suggérer un restaurant 💡
                </a>
            </div>
        </section>

        <!-- ========== PRESENTATION SECTION (Side by Side: Image Left, Text Right) ========== -->
        <section class="side-by-side-section">
            <div class="side-img-box">
                <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=700&auto=format&fit=crop&q=80" alt="Plat Traditionnel Sénégalais" loading="lazy">
            </div>
            
            <div class="side-content">
                <h2 style="font-family: var(--font-serif); font-weight: 400; color: var(--text-primary);">Une Plateforme Commune & Solidaire</h2>
                <p>Né d'une étude sur le terrain à Thiès, ce projet répond au constat que 95% des restaurateurs de la ville ne disposent d'aucun outil numérique propre. Nous réunissons les 20 tables les mieux notées sous un même toit virtuel pour leur offrir une présence en ligne immédiate et gratuite.</p>
                <div style="display: flex; gap: 2rem;">
                    <div>
                        <div style="font-size: 1.8rem; font-weight: 700; color: var(--primary); font-family: var(--font-serif);">95%</div>
                        <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Établissements sans site</div>
                    </div>
                    <div>
                        <div style="font-size: 1.8rem; font-weight: 700; color: var(--primary); font-family: var(--font-serif);">20+</div>
                        <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Tables Partenaires</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ========== SIGNATURE MENU SECTION (List Left, Big Image Right) ========== -->
        <section class="signature-section">
            <div class="sig-list">
                <h2 style="font-family: var(--font-serif); font-weight: 400; color: var(--text-primary); font-size: 2.25rem; margin-bottom: 0.5rem;">Les Saveurs Emblématiques de Thiès</h2>
                <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 1.5rem; line-height: 1.6;">Découvrez notre sélection de plats phares issus des cartes de nos restaurants partenaires.</p>
                
                <div class="sig-item">
                    <div class="sig-item-num">01</div>
                    <div class="sig-item-body">
                        <h4>Thiéboudiène Traditionnel</h4>
                        <p>Le riz au poisson emblématique du Sénégal, cuisiné avec du poisson frais du jour et ses légumes de saison.</p>
                    </div>
                </div>
                
                <div class="sig-item">
                    <div class="sig-item-num">02</div>
                    <div class="sig-item-body">
                        <h4>Dibi d'Agneau au Feu de Bois</h4>
                        <p>De tendres morceaux de viande grillés façon dibiterie, relevés d'oignons caramélisés et de moutarde.</p>
                    </div>
                </div>
                
                <div class="sig-item">
                    <div class="sig-item-num">03</div>
                    <div class="sig-item-body">
                        <h4>Pastels Dorés Croustillants</h4>
                        <p>De savoureux beignets farcis au poisson épicé ou à la viande, accompagnés d'une sauce tomate piquante maison.</p>
                    </div>
                </div>
            </div>
            
            <div class="sig-img-container">
                <img src="https://images.unsplash.com/photo-1547592180-85f173990554?w=700&auto=format&fit=crop&q=80" alt="Mijoté Mafé Sénégalais" loading="lazy">
            </div>
        </section>

        <!-- ONBOARDING COMMENT CA MARCHE -->
        <section class="how-it-works" id="how-it-works-section">
            <span class="study-title-tag">💡 Mode d'emploi</span>
            <h2 class="section-title" style="text-align:center; margin-bottom: 0.5rem; color: var(--text-primary);">Comment fonctionne la plateforme ?</h2>
            <p class="study-subtitle">Découvrez la simplicité et la flexibilité de THIES Resto à travers nos trois services phares.</p>
            
            <div class="how-it-works-tabs">
                <button class="hw-tab-btn active" onclick="switchHowItWorksTab('hw-order')">🛍️ Commander un plat</button>
                <button class="hw-tab-btn" onclick="switchHowItWorksTab('hw-reserve')">📅 Réserver une table</button>
                <button class="hw-tab-btn" onclick="switchHowItWorksTab('hw-group')">👥 Commande de groupe</button>
            </div>

            <!-- Tab 1: Commander -->
            <div class="hw-tab-content active" id="hw-order">
                <div class="timeline-steps">
                    <div class="timeline-card">
                        <div class="timeline-badge">1</div>
                        <span class="timeline-icon">🏪</span>
                        <h3>Sélection du restaurant</h3>
                        <p>Choisissez parmi les meilleurs établissements de Thiès, filtrez par envie et ouvrez la carte du jour.</p>
                    </div>
                    <div class="timeline-card">
                        <div class="timeline-badge">2</div>
                        <span class="timeline-icon">🛒</span>
                        <h3>Panier instantané</h3>
                        <p>Ajoutez vos plats préférés, spécifiez vos préférences et validez en un clic, sans création de compte fastidieuse.</p>
                    </div>
                    <div class="timeline-card">
                        <div class="timeline-badge">3</div>
                        <span class="timeline-icon">💬</span>
                        <h3>Envoi WhatsApp</h3>
                        <p>Votre commande est transmise de manière ultra-rapide par WhatsApp au restaurant. Payez en espèces ou Wave à la livraison.</p>
                    </div>
                    <div class="timeline-card">
                        <div class="timeline-badge">4</div>
                        <span class="timeline-icon">🎁</span>
                        <h3>Fidélité cumulée</h3>
                        <p>Cumulez automatiquement 5 points fidélité à chaque commande livrée pour obtenir des plats offerts.</p>
                    </div>
                </div>
            </div>

            <!-- Tab 2: Réserver -->
            <div class="hw-tab-content" id="hw-reserve">
                <div class="timeline-steps">
                    <div class="timeline-card">
                        <div class="timeline-badge">1</div>
                        <span class="timeline-icon">📅</span>
                        <h3>Choix de la date</h3>
                        <p>Sélectionnez votre restaurant préféré, l'onglet "Réserver", définissez la date, l'heure et le nombre de convives.</p>
                    </div>
                    <div class="timeline-card">
                        <div class="timeline-badge">2</div>
                        <span class="timeline-icon">👤</span>
                        <h3>Détails du contact</h3>
                        <p>Entrez vos coordonnées de contact pour que le gérant puisse bloquer et préparer votre table attitrée.</p>
                    </div>
                    <div class="timeline-card">
                        <div class="timeline-badge">3</div>
                        <span class="timeline-icon">✨</span>
                        <h3>Confirmation reçue</h3>
                        <p>Le restaurateur valide votre créneau directement sur son tableau de bord et vous envoie une confirmation par message.</p>
                    </div>
                    <div class="timeline-card">
                        <div class="timeline-badge">4</div>
                        <span class="timeline-icon">🍽️</span>
                        <h3>Installez-vous !</h3>
                        <p>Présentez-vous au restaurant à l'heure convenue : votre table est prête et des points fidélité vous sont offerts.</p>
                    </div>
                </div>
            </div>

            <!-- Tab 3: Commande de Groupe -->
            <div class="hw-tab-content" id="hw-group">
                <div class="timeline-steps">
                    <div class="timeline-card">
                        <div class="timeline-badge">1</div>
                        <span class="timeline-icon">👥</span>
                        <h3>Création du groupe</h3>
                        <p>Lancez un panier partagé pour vos collègues de bureau ou vos amis en clicking sur "Commande de Groupe".</p>
                    </div>
                    <div class="timeline-card">
                        <div class="timeline-badge">2</div>
                        <span class="timeline-icon">🔗</span>
                        <h3>Partage du lien</h3>
                        <p>Copiez et envoyez le lien unique généré dans votre discussion de groupe (WhatsApp, Slack, etc.).</p>
                    </div>
                    <div class="timeline-card">
                        <div class="timeline-badge">3</div>
                        <span class="timeline-icon">🍕</span>
                        <h3>Choix individuels</h3>
                        <p>Chaque membre ajoute ses plats préférés depuis son propre appareil. Le restaurant reçoit le tout regroupé et clair !</p>
                    </div>
                    <div class="timeline-card">
                        <div class="timeline-badge">4</div>
                        <span class="timeline-icon">👑</span>
                        <h3>Validation & Envoi</h3>
                        <p>L'initiateur du groupe valide le panier commun et l'envoie par WhatsApp. Le restaurant livre tout en une fois !</p>
                    </div>
                </div>
            </div>
        </section>


        <!-- ========== LOYALTY CARD SECTION ========== -->
        <section class="loyalty-checker-section" style="padding: 2.5rem 1.5rem; background: var(--bg-card); border-radius: 24px; border: 1px solid var(--border); margin: 2rem auto; max-width: 1200px;">
            <div style="max-width: 800px; margin: 0 auto; text-align: center;">
                <span class="study-title-tag" style="background: rgba(207, 168, 83, 0.1); color: var(--primary); padding: 0.35rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; border: 1px solid rgba(207, 168, 83, 0.2);">🎁 Programme de Fidélisation</span>
                <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--text-primary); margin: 0.75rem 0 0.5rem 0;">Consultez votre Statut & Plats Offerts</h2>
                <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1.5rem;">Saisissez votre numéro WhatsApp pour suivre vos points fidélité (5 pts/commande livrée, 5 pts/réservation) et réclamer vos cadeaux.</p>
                
                <div style="display: flex; gap: 0.75rem; justify-content: center; max-width: 480px; margin: 0 auto 1.5rem auto;">
                    <input type="tel" id="loyalty-phone" class="form-control" placeholder="+221 77 123 45 67" style="margin-bottom: 0;">
                    <button class="btn btn-primary" onclick="checkLoyaltyPoints()" style="white-space: nowrap;">Consulter ➔</button>
                </div>
                
                <div id="loyalty-result-card" style="display: none; margin-top: 1.5rem; animation: fadeIn 0.4s ease;">
                    <!-- Result card dynamically rendered by checkLoyaltyPoints -->
                </div>
            </div>
        </section>

        <!-- ========== ÉTUDE DE TERRAIN & NOTRE SOLUTION ========== -->
        <section class="field-study-section" id="field-study-section">
            <div style="text-align: center;">
                <span class="study-title-tag">📊 Analyse & Impact</span>
                <h2 class="section-title" style="margin-bottom: 0.5rem; color: var(--text-primary);">L'Étude de Terrain & Notre Solution</h2>
                <p class="study-subtitle">Comment THIES Resto répond à la réalité chiffrée de la restauration à Thiès.</p>
            </div>

            <div class="study-split-grid">
                <!-- Left: Problems / Metrics -->
                <div class="study-left-col">
                    <h3 style="font-family: var(--font-serif); font-size: 1.3rem; margin-bottom: 1.5rem; color: var(--text-primary);">Le Constat Local (Étude Juin 2025)</h3>
                    
                    <div class="study-carousel-wrapper">
                        <div class="study-metric-card square-stat-card">
                            <span class="stat-number">85%</span>
                            <span class="stat-label">Désert Numérique Complet</span>
                        </div>

                        <div class="study-metric-card square-stat-card">
                            <span class="stat-number">0%</span>
                            <span class="stat-label">Absence de Contenu Moderne</span>
                        </div>

                        <div class="study-metric-card square-stat-card">
                            <span class="stat-number">90%</span>
                            <span class="stat-label">Avis Négatifs Ignorés</span>
                        </div>
                    </div>
                </div>

                <!-- Right: Our Solutions -->
                <div class="study-right-col">
                    <h3 style="font-family: var(--font-serif); font-size: 1.3rem; margin-bottom: 1.5rem; color: var(--text-primary);">Les Réponses de THIES Resto</h3>

                    <div class="solution-carousel-wrapper">
                        <div class="solution-feature-card">
                            <span class="solution-icon">✨</span>
                            <div class="solution-text">
                                <h3>1. Vitrine Digitale Premium</h3>
                                <p>Chaque partenaire bénéficie d'une page personnalisée, moderne, rapide et optimisée pour le référencement local à Thiès.</p>
                            </div>
                        </div>

                        <div class="solution-feature-card">
                            <span class="solution-icon">⚡</span>
                            <div class="solution-text">
                                <h3>2. Précommande Réduisant l'Attente</h3>
                                <p>Les clients commandent et réservent à l'avance, ce qui réduit de moitié les temps d'attente souvent pointés du doigt.</p>
                            </div>
                        </div>

                        <div class="solution-feature-card">
                            <span class="solution-icon">📶</span>
                            <div class="solution-text">
                                <h3>3. Mode Hybride (SMS en Secours)</h3>
                                <p>En cas de coupure ou faiblesse du réseau internet à Thiès, la commande bascule automatiquement par SMS classique sécurisé.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;

    // Wait a tick for Alpine to initialize the injected HTML
    setTimeout(() => {
        // Force Alpine to process the new container content
        if (typeof Alpine !== 'undefined') {
            Alpine.initTree(container);
        }
    }, 50);

    if (typeof startSocialProof === 'function') startSocialProof();
    hideLoadingOverlay();
    } catch (err) {
        console.error("Error in home route:", err);
        hideLoadingOverlay();
        if (typeof showToast === 'function') {
            showToast("Une erreur non critique est survenue lors du chargement.", "warning");
        }
    }
});

document.addEventListener('alpine:init', () => {
    Alpine.data('catalogComponent', () => ({
        activeFilter: 'Tous',
        searchQuery: '',
        sortBy: 'default',
        get filteredRestaurants() {
            let restos = store.getRestaurants().filter(r => r.status === 'active');
            
            if (this.activeFilter !== 'Tous') {
                restos = restos.filter(r => r.category === this.activeFilter);
            }
            if (this.searchQuery) {
                const q = this.searchQuery.toLowerCase();
                restos = restos.filter(r => 
                    r.name.toLowerCase().includes(q) || 
                    r.category.toLowerCase().includes(q) ||
                    r.address.toLowerCase().includes(q)
                );
            }
            if (this.sortBy === 'rating') {
                restos.sort((a,b) => b.rating - a.rating);
            } else if (this.sortBy === 'reviews') {
                restos.sort((a,b) => b.reviewsCount - a.reviewsCount);
            } else if (this.sortBy === 'name') {
                restos.sort((a,b) => a.name.localeCompare(b.name));
            } else {
                if (window.shuffledRestaurantIds) {
                    restos.sort((a, b) => window.shuffledRestaurantIds.indexOf(a.id) - window.shuffledRestaurantIds.indexOf(b.id));
                }
            }
            return restos;
        },
        openRestaurant(slug) {
            router.navigate('/r/' + slug);
        },
        isCurrentlyOpen(r) {
            return isRestaurantOpenNow(r);
        }
    }));
});

function setFilter(category) {
    activeFilter = category;
    const filterBar = document.getElementById('filter-bar');
    if (filterBar) {
        filterBar.querySelectorAll('.filter-btn').forEach(btn => {
            if (btn.textContent.includes(category === 'Tous' ? 'Tous' : category.split(' ')[0])) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    let restos = store.getRestaurants().filter(r => r.status === 'active');

    // 1. Filter by category
    if (activeFilter !== 'Tous') {
        restos = restos.filter(r => r.category === activeFilter);
    }

    // 2. Filter by search query
    if (query) {
        restos = restos.filter(r => {
            return r.name.toLowerCase().includes(query) || 
                   r.category.toLowerCase().includes(query) || 
                   r.address.toLowerCase().includes(query) ||
                   (Array.isArray(r.menu) && r.menu.some(m => (m.name || '').toLowerCase().includes(query) || (m.description || '').toLowerCase().includes(query)));
        });
    }

    // 3. Sort
    if (restos[0] && restos[0]._tempDistance) {
        restos.sort((a, b) => a._tempDistance - b._tempDistance);
    } else if (activeSortBy === 'rating') {
        restos.sort((a, b) => b.rating - a.rating);
    } else if (activeSortBy === 'reviews') {
        restos.sort((a, b) => b.reviewsCount - a.reviewsCount);
    } else if (activeSortBy === 'name') {
        restos.sort((a, b) => a.name.localeCompare(b.name));
    } else {
        // Default sort: use stable randomized order generated on home page load
        if (window.shuffledRestaurantIds) {
            restos.sort((a, b) => window.shuffledRestaurantIds.indexOf(a.id) - window.shuffledRestaurantIds.indexOf(b.id));
        }
    }

    // Render cards
    if (restos.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 3rem 0;">Aucun restaurant ne correspond à vos critères.</div>`;
        return;
    }

    let cardsHtml = '';
    restos.forEach(r => {
        const isCurrentlyOpen = isRestaurantOpenNow(r);
        const statusBadge = isCurrentlyOpen 
            ? `<span class="badge badge-success restaurant-card-badge">Ouvert</span>` 
            : `<span class="badge badge-danger restaurant-card-badge">Fermé</span>`;
        
        const coverUrl = r.coverImage || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60';
        let distanceBadge = '';
        if (r._tempDistance) {
            distanceBadge = `<div style="position: absolute; top: 1rem; right: 1rem; background: var(--bg-card); color: var(--text-primary); padding: 0.35rem 0.75rem; border-radius: 20px; font-weight: 600; font-size: 0.8rem; box-shadow: 0 4px 10px rgba(0,0,0,0.1); z-index: 2;">📍 ${r._tempDistance} km</div>`;
        }
            
        cardsHtml += `
            <div class="restaurant-card hover-3d glass-panel" style="position: relative; border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; cursor: pointer; border: 1px solid var(--border);" onclick="window.router.navigate('/r/${r.slug || r.id}')">
                ${distanceBadge}
                <div class="restaurant-card-header" style="height: 200px; position: relative;">
                    <img src="${coverUrl}" style="width: 100%; height: 100%; object-fit: cover;" alt="${r.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60'">
                    <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 50%; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);"></div>
                    <div style="position: absolute; top: 1rem; left: 1rem; z-index: 2;">
                        ${statusBadge}
                    </div>
                </div>
                <div class="restaurant-card-body" style="padding: 1.5rem; flex: 1; display: flex; flex-direction: column; background: var(--bg-card);">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                        <h3 class="restaurant-card-name" style="font-size: 1.3rem; font-weight: 700; color: var(--text-primary); margin: 0; line-height: 1.2;">${r.name}</h3>
                        <span class="stars-rating" style="background: var(--bg-primary); padding: 0.2rem 0.6rem; border-radius: 12px; font-weight: 600; font-size: 0.9rem; color: #fbbf24; border: 1px solid var(--border);">★ ${r.rating.toFixed(1)}</span>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.3rem;">
                        <span>📍</span> <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${r.address}</span>
                    </p>
                    <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center;">
                        <span class="restaurant-card-cuisine" style="background: rgba(242,107,33,0.1); color: var(--primary); padding: 0.4rem 1rem; border-radius: 12px; font-size: 0.8rem; font-weight: 600;">${r.category}</span>
                        <span style="font-size: 0.8rem; color: var(--text-secondary);">(${r.reviewsCount} avis)</span>
                    </div>
                </div>
            </div>
        `;
    });
    grid.innerHTML = cardsHtml;
}

// Calculate distance using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}


// ----------------------------------------------------
// Map Modal Logic
// ----------------------------------------------------
function showMapModal(userLat, userLng, restaurants) {
    let mapModal = document.getElementById('map-modal');
    if (!mapModal) {
        mapModal = document.createElement('div');
        mapModal.id = 'map-modal';
        mapModal.style.position = 'fixed';
        mapModal.style.top = '0';
        mapModal.style.left = '0';
        mapModal.style.width = '100vw';
        mapModal.style.height = '100vh';
        mapModal.style.backgroundColor = 'rgba(0,0,0,0.8)';
        mapModal.style.zIndex = '99999';
        mapModal.style.display = 'flex';
        mapModal.style.flexDirection = 'column';
        
        mapModal.innerHTML = `
            <div style="background: var(--bg-card); width: 100%; height: 100%; max-width: 800px; max-height: 90vh; margin: auto; border-radius: 12px; display: flex; flex-direction: column; overflow: hidden; position: relative; border: 1px solid var(--border);">
                <div style="padding: 1rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0;">📍 Restaurants autour de moi</h3>
                    <button id="close-map-btn" style="background: transparent; border: none; font-size: 2rem; cursor: pointer; color: var(--text-primary); line-height: 1;">&times;</button>
                </div>
                <div id="leaflet-map" style="flex: 1; width: 100%;"></div>
            </div>
        `;
        document.body.appendChild(mapModal);
        
        document.getElementById('close-map-btn').addEventListener('click', () => {
            mapModal.style.display = 'none';
        });
    }
    
    mapModal.style.display = 'flex';
    
    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
        if (typeof showToast === 'function') showToast("Erreur: Carte non chargée.", "danger");
        return;
    }

    if (!window.myLeafletMap) {
        window.myLeafletMap = L.map('leaflet-map').setView([userLat, userLng], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(window.myLeafletMap);
    } else {
        window.myLeafletMap.setView([userLat, userLng], 14);
    }
    
    // Clear existing markers
    if (window.myMapMarkers) {
        window.myMapMarkers.forEach(m => window.myLeafletMap.removeLayer(m));
    }
    window.myMapMarkers = [];
    
    // Add user marker
    const userIcon = L.divIcon({
        className: 'user-marker',
        html: '<div style="background-color: var(--primary); width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>',
        iconSize: [20, 20]
    });
    
    const userMarker = L.marker([userLat, userLng], {icon: userIcon})
        .addTo(window.myLeafletMap)
        .bindPopup("<b>Vous êtes ici 🎯</b>").openPopup();
    window.myMapMarkers.push(userMarker);
    
    let anyClose = false;

    // Add restaurant markers
    restaurants.forEach(r => {
        if (r.lat && r.lng) {
            const isClose = r._tempDistance && r._tempDistance < 20; // threshold: 20km
            if (isClose) anyClose = true;
            
            const marker = L.marker([r.lat, r.lng])
                .addTo(window.myLeafletMap)
                .bindTooltip(r.name, {permanent: true, direction: "top", className: "map-label"}).bindPopup(`
                    <div style="text-align:center;">
                        <b style="font-size:1.1rem;">${r.name}</b><br>
                        <span style="color:var(--text-secondary); font-size:0.85rem;">${r.address}</span><br>
                        <span style="font-size:0.8rem; color:var(--primary); font-weight:bold;">${r._tempDistance ? r._tempDistance + ' km' : ''}</span><br>
                        <a href="#/r/${r.slug}" style="display:inline-block; margin-top:8px; padding:6px 12px; background:var(--primary); color:white; border-radius:4px; text-decoration:none;" onclick="document.getElementById('map-modal').style.display='none';">Voir le menu</a>
                    </div>
                `);
            window.myMapMarkers.push(marker);
        }
    });

    if (!anyClose) {
        if (typeof showToast === 'function') {
            showToast("Les restaurants sont un peu loin de vous. Commandez en ligne pour vous faire livrer ! 🛵", "info");
        }
        const warningDiv = document.createElement('div');
        warningDiv.style.background = 'var(--warning)';
        warningDiv.style.color = '#000';
        warningDiv.style.padding = '10px 15px';
        warningDiv.style.textAlign = 'center';
        warningDiv.style.fontWeight = 'bold';
        warningDiv.style.fontSize = '0.9rem';
        warningDiv.innerHTML = `📍 Votre position a été trouvée, mais les restaurants sont un peu loin de vous. <br><a href="#/catalog" onclick="document.getElementById('map-modal').style.display='none';" style="color: #000; text-decoration: underline; margin-top: 5px; display: inline-block;">Faites-vous livrer en commandant en ligne ! 🛵</a>`;
        
        const mapContainer = document.getElementById('leaflet-map');
        if (mapContainer && mapContainer.parentNode) {
            // Remove previous warning if exists to prevent duplicates
            const oldWarning = document.getElementById('map-distance-warning');
            if (oldWarning) oldWarning.remove();
            
            warningDiv.id = 'map-distance-warning';
            mapContainer.parentNode.insertBefore(warningDiv, mapContainer);
        }
    }
    
    // Force Leaflet to recalculate size since it was hidden
    setTimeout(() => {
        window.myLeafletMap.invalidateSize();
    }, 200);
}

window.geolocateRestaurants = function() {
    if ("geolocation" in navigator) {
        if (typeof showToast === 'function') showToast("Recherche de votre position...", "info");
        navigator.geolocation.getCurrentPosition((position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            
            let restosWithDist = 0;
            store.data.restaurants.forEach(r => {
                if (r.lat && r.lng) {
                    const dist = calculateDistance(userLat, userLng, r.lat, r.lng);
                    r._tempDistance = parseFloat(dist.toFixed(1));
                    restosWithDist++;
                }
            });
            
            if (typeof showToast === 'function') showToast(`Position trouvée ! Tri de ${restosWithDist} restaurants...`, "success");
            
            // Focus catalog
            scrollToCatalog();
            
            // Re-render
            applyFilters();
            
            // Show Map Modal
            showMapModal(userLat, userLng, store.data.restaurants);
            
        }, (error) => {
            if (typeof showToast === 'function') showToast("Impossible d'obtenir votre position. Veuillez autoriser l'accès.", "error");
        });
    } else {
        if (typeof showToast === 'function') showToast("La géolocalisation n'est pas supportée par votre navigateur.", "error");
    }
};


function filterRestaurantsList() {
    applyFilters();
}


// ----------------------------------------------------
// Restaurant Open Hours Logic
// ----------------------------------------------------
function isRestaurantOpenNow(restaurant) {
    if (restaurant.isOpenManual === false) return false;
    if (restaurant.isOpenManual === true) {
        // Double check closed days
        const now = new Date();
        // JavaScript day is 0=Sunday, 1=Monday... 7 is not used, so let's map it.
        let day = now.getDay();
        if (day === 0) day = 7; // Map Sunday to 7
        if (restaurant.closedDays.includes(day)) {
            return false;
        }
        
        // Hours check
        try {
            const hoursStr = restaurant.openHours; // e.g. "12:00 - 23:00"
            const parts = hoursStr.split('-');
            if (parts.length === 2) {
                const openParts = parts[0].trim().split(':');
                const closeParts = parts[1].trim().split(':');
                
                const openHour = parseInt(openParts[0]);
                const openMin = parseInt(openParts[1]);
                const closeHour = parseInt(closeParts[0]);
                const closeMin = parseInt(closeParts[1]);
                
                const currentHour = now.getHours();
                const currentMin = now.getMinutes();
                
                const openTime = openHour * 60 + openMin;
                const closeTime = closeHour * 60 + closeMin;
                const currentTime = currentHour * 60 + currentMin;
                
                if (closeTime > openTime) {
                    return currentTime >= openTime && currentTime <= closeTime;
                } else {
                    // Over midnight hours, e.g. 18:00 - 02:00
                    return currentTime >= openTime || currentTime <= closeTime;
                }
            }
        } catch (e) {
            return true;
        }
        return true;
    }
    return false;
}

// Get string name for day
function getDayName(dayNum) {
    const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    return days[dayNum - 1] || "";
}

// ----------------------------------------------------
// Page: RESTAURANT PAGE (client view with tabs)
// ----------------------------------------------------

// ----------------------------------------------------
// THIES Resto - Core JavaScript Application
// ----------------------------------------------------

// Cover images by category (real restaurant-style photos)
// Global State
// ----------------------------------------------------
let cart = {
    restaurantId: null,
    items: [],
    total: 0
};

// Current Session (with safe storage check for file:// protocol support)
let currentRestaurantSession = null;
let isSuperAdminSession = false;
try {
    const sessionStr = sessionStorage.getItem('resto_session');
    if (sessionStr) {
        currentRestaurantSession = JSON.parse(sessionStr);
    }
    isSuperAdminSession = sessionStorage.getItem('admin_session') === 'true';
} catch (e) {
    console.warn("sessionStorage is not accessible (e.g. running locally via file:// protocol). Session data will be held in memory only.", e);
}

// Temporary Group Order object in memory
let activeGroupOrder = null;

// Active category filter
let activeFilter = 'Tous';
let activeSortBy = 'default';

// ---------- LOADING STATE ----------
let isFirstLoad = true;
let firstLoadTimeoutId = null;

function hideLoadingOverlay() {
    if (isFirstLoad) {
        if (!firstLoadTimeoutId) {
            firstLoadTimeoutId = setTimeout(() => {
                const overlay = document.getElementById('loading-overlay');
                if (overlay) {
                    overlay.classList.add('hidden');
                    setTimeout(() => overlay.remove(), 600);
                }
                isFirstLoad = false;
            }, 5000);
        }
    } else {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
            setTimeout(() => overlay.remove(), 600);
        }
    }
}

// Start smooth progress animation for the 5-second load
(function startLoadingAnimation() {
    const progressBar = document.getElementById('loading-progress-bar');
    const loadingText = document.getElementById('loading-text');
    if (!progressBar) return;

    const messages = [
        "Chargement de THIES Resto… 🍲",
        "Connexion avec les restaurants de Thiès… 🏪",
        "Mise à jour des plats du jour… 🍽️",
        "Vérification des disponibilités… ⌛",
        "Presque prêt, préparez vos papilles ! 🧑‍🍳"
    ];

    let start = null;
    const duration = 5000;

    function animate(timestamp) {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min((elapsed / duration) * 100, 100);
        
        progressBar.style.width = progress + '%';

        const msgIndex = Math.min(Math.floor((progress / 100) * messages.length), messages.length - 1);
        if (loadingText) {
            loadingText.textContent = messages[msgIndex];
        }

        if (elapsed < duration) {
            requestAnimationFrame(animate);
        }
    }
    requestAnimationFrame(animate);
})();

// ---------- THEME TOGGLE ----------
function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    try { localStorage.setItem('THIES_THEME', next); } catch(e) {}
    updateThemeToggleUI(next);
}
function updateThemeToggleUI(theme) {
    const icon = document.getElementById('theme-toggle-icon');
    const label = document.getElementById('theme-toggle-label');
    if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    if (label) label.textContent = theme === 'dark' ? 'Mode Clair' : 'Mode Sombre';
}
function loadSavedTheme() {
    try {
        const saved = localStorage.getItem('THIES_THEME');
        if (saved) {
            document.documentElement.setAttribute('data-theme', saved);
            updateThemeToggleUI(saved);
        }
    } catch(e) {}
}

// ---------- CART PERSISTENCE ----------
function saveCart() {
    try { localStorage.setItem('THIES_CART', JSON.stringify(cart)); } catch(e) {}
}
function loadCart() {
    try {
        const saved = localStorage.getItem('THIES_CART');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && parsed.items && parsed.items.length > 0) {
                cart = parsed;
            }
        }
    } catch(e) {}
}

function pulseCartBar() {
    const bar = document.getElementById('floating-cart-bar');
    const qty = document.getElementById('floating-cart-qty');
    const btn = document.getElementById('floating-cart-btn');
    
    [bar, qty, btn].forEach(el => {
        if (el) {
            el.classList.remove('cart-pulse');
            void el.offsetWidth; // Trigger reflow
            el.classList.add('cart-pulse');
        }
    });
}

// ---------- REALTIME SLUG VALIDATION ----------
function checkSlugAvailabilityRealtime(val) {
    const badge = document.getElementById('adm-slug-availability-badge') || document.getElementById('slug-availability-badge');
    if (!badge) return;
    const cleanVal = val.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!cleanVal) {
        badge.innerHTML = '';
        return;
    }
    const exists = store.getRestaurants().some(r => r.username === cleanVal || r.slug === cleanVal);
    if (exists) {
        badge.className = 'slug-status taken';
        badge.innerHTML = '❌ Cet identifiant est déjà pris';
    } else {
        badge.className = 'slug-status available';
        badge.innerHTML = '✅ Cet identifiant est disponible';
    }
}

// ---------- CLIENT ORDER HISTORY ----------
function saveOrderToHistory(order, restaurantName) {
    try {
        let history = JSON.parse(localStorage.getItem('THIES_ORDER_HISTORY') || '[]');
        history.unshift({ ...order, restaurantName, savedAt: new Date().toISOString() });
        if (history.length > 20) history = history.slice(0, 20);
        localStorage.setItem('THIES_ORDER_HISTORY', JSON.stringify(history));
    } catch(e) {}
}
function getOrderHistory() {
    try {
        return JSON.parse(localStorage.getItem('THIES_ORDER_HISTORY') || '[]');
    } catch(e) { return []; }
}

// ---------- NOTIFICATION SOUND ----------
function playNotificationSound() {
    try {
        let audio = document.getElementById('notification-sound');
        if (!audio) {
            audio = document.createElement('audio');
            audio.id = 'notification-sound';
            audio.src = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-120.wav';
            document.body.appendChild(audio);
        }
        audio.currentTime = 0;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn("Notification audio blocked by browser autoplay settings:", error);
            });
        }
    } catch(e) {
        console.warn("Failed to play notification sound:", e);
    }
}

// ---------- ORDER POLLING (Supabase Realtime WebSockets) ----------
let orderChannel = null;
function startOrderPolling(restaurantId) {
    stopOrderPolling();
    if (typeof supabaseClient !== 'undefined' && supabaseClient) {
        orderChannel = supabaseClient
            .channel('realtime-orders')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'orders' },
                (payload) => {
                    const newOrder = payload.new;
                    if (newOrder.restaurant_id === restaurantId) {
                        // Avoid duplicates if sync already caught it
                        const exists = store.data.orders.find(o => o.id === newOrder.id);
                        if (!exists) {
                            playNotificationSound();
                            if (typeof showToast === 'function') showToast(`🔔 Nouvelle commande reçue !`, 'success');
                            
                            const formatted = {
                                id: newOrder.id,
                                restaurantId: newOrder.restaurant_id,
                                customerName: newOrder.customer_name,
                                customerPhone: newOrder.customer_phone,
                                mode: newOrder.mode,
                                address: newOrder.address,
                                items: typeof newOrder.items === 'string' ? JSON.parse(newOrder.items) : newOrder.items,
                                total: newOrder.total,
                                note: newOrder.note,
                                status: newOrder.status,
                                date: newOrder.date
                            };
                            store.data.orders.unshift(formatted);
                            store.save();
                            
                            // Re-render dashboard if open
                            if (typeof renderDashboardTabContent === 'function') {
                                const r = store.getRestaurantById(restaurantId);
                                if (r && document.getElementById('dashboard-view-orders') && document.getElementById('dashboard-view-orders').classList.contains('active')) {
                                    renderDashboardTabContent(r);
                                }
                            }
                        }
                    }
                }
            )
            .subscribe();
    }
}
function stopOrderPolling() {
    if (orderChannel && typeof supabaseClient !== 'undefined' && supabaseClient) {
        supabaseClient.removeChannel(orderChannel);
        orderChannel = null;
    }
}

// ---------- SCROLL HELPERS ----------
function scrollToHowItWorks() {
    if (window.location.hash && window.location.hash !== '#/') {
        router.navigate('/');
        setTimeout(() => {
            const el = document.getElementById('how-it-works-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
    } else {
        const el = document.getElementById('how-it-works-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
}

function scrollToCatalog() {
    if (window.location.hash && window.location.hash !== '#/') {
        router.navigate('/');
        setTimeout(() => {
            const el = document.getElementById('catalog-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
    } else {
        const el = document.getElementById('catalog-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
}

// Helper to automatically generate username and default password when typing restaurant name
function handleRestaurantNameInput(nameVal, usernameId, passwordId, badgeId) {
    const usernameInput = document.getElementById(usernameId);
    const passwordInput = document.getElementById(passwordId);
    if (!usernameInput || !passwordInput) return;
    
    // Normalize and slugify
    const slug = nameVal.trim().toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
        
    usernameInput.value = slug;
    passwordInput.value = slug ? `${slug}_221` : '';
    
    // Trigger validation badge update
    if (usernameId === 'reg-username') {
        checkSlugAvailability();
    } else {
        checkSlugAvailabilityRealtime(slug);
    }
}

// ---------- SLUG AVAILABILITY CHECK ----------
function checkSlugAvailability() {
    const input = document.getElementById('reg-username');
    const badge = document.getElementById('slug-availability-badge');
    if (!input || !badge) return;
    const slug = input.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    if (slug.length < 3) { badge.innerHTML = ''; return; }
    const exists = store.getRestaurants().find(r => r.username === slug || r.slug === slug);
    if (exists) {
        badge.innerHTML = '<span class="slug-status taken">❌ Identifiant déjà pris</span>';
    } else {
        badge.innerHTML = '<span class="slug-status available">✅ Disponible</span>';
    }
}

// Helper to show modern notification toast
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast-notification');
    toast.innerText = message;
    toast.style.display = 'block';
    
    // Color schemes
    if (type === 'success') {
        toast.style.backgroundColor = '#10b981';
        toast.style.color = 'white';
    } else if (type === 'danger') {
        toast.style.backgroundColor = '#ef4444';
        toast.style.color = 'white';
    } else if (type === 'warning') {
        toast.style.backgroundColor = '#f7b731';
        toast.style.color = 'black';
    } else {
        toast.style.backgroundColor = '#ff6b35';
        toast.style.color = 'white';
    }
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 4000);
}

// Format Phone Numbers +221 7X XXX XX XX
function cleanPhoneNumber(phone) {
    let cleaned = phone.replace(/\s+/g, '');
    if (!cleaned.startsWith('+221') && !cleaned.startsWith('221')) {
        if (cleaned.length === 9) {
            cleaned = '+221' + cleaned;
        }
    }
    if (cleaned.startsWith('221') && !cleaned.startsWith('+')) {
        cleaned = '+' + cleaned;
    }
    return cleaned;
}

// ----------------------------------------------------
// Navbar population
// ----------------------------------------------------
function updateNavbar() {
    const navActions = document.getElementById('nav-actions');
    let html = '';
    
    if (isSuperAdminSession) {
        if (currentRestaurantSession) {
            html = `
                <span class="badge badge-danger">👑 Admin (${currentRestaurantSession.name})</span>
                <button class="btn btn-primary btn-sm" onclick="router.navigate('/dashboard')">Tableau de Bord 📊</button>
                <button class="btn btn-secondary btn-sm" onclick="exitImpersonation()">Console Admin 🔐</button>
            `;
        } else {
            html = `
                <span class="badge badge-danger">Super-Admin</span>
                <button class="btn btn-primary btn-sm" onclick="router.navigate('/admin')">Console Admin 📊</button>
                <button class="btn btn-secondary btn-sm" onclick="logoutAdmin()">Déconnexion</button>
            `;
        }
    } else if (currentRestaurantSession) {
        html = `
            <span class="badge badge-success">${currentRestaurantSession.name}</span>
            <button class="btn btn-primary btn-sm" onclick="router.navigate('/dashboard')">Tableau de Bord 📊</button>
            <button class="btn btn-secondary btn-sm" onclick="logoutRestaurant()">Déconnexion</button>
        `;
    } else {
        html = `
            <button class="btn btn-secondary btn-sm" onclick="router.navigate('/auth')">Espace Resto</button>
        `;
    }
    navActions.innerHTML = html;
}

// logoutRestaurant moved to js/auth.js

function logoutAdmin() {
    try {
        sessionStorage.removeItem('admin_session');
    } catch (e) {
        console.warn("Failed to clear admin_session from sessionStorage", e);
    }
    isSuperAdminSession = false;
    showToast("Session administrateur déconnectée", "success");
    router.navigate('/');
}

// ----------------------------------------------------
// Page: LANDING PAGE (catalog)
// ----------------------------------------------------
router.add('#/', () => {
    // Hide cart bar
    document.getElementById('floating-cart-bar').style.display = 'none';
    stopOrderPolling();
    loadCart();
    
    // Generate a stable session/visit specific random shuffle for restaurants
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
                        <div class="history-item-meta">${h.items.map(i => i.name).join(', ')}</div>
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
                <div class="section-header">
                    <h2 class="section-title">Vos Dernières Commandes (Persistant)</h2>
                </div>
                ${itemsHtml}
            </section>
        `;
    }

    container.innerHTML = `
        <!-- ========== HERO SECTION ========== -->
        <section class="hero-section">
            <div class="hero-split-container">
                <!-- Left: Title, Description and Search -->
                <div class="hero-left-col">
                    <h1 class="hero-title">Découvrez les Meilleures Tables de <span>Thiès</span></h1>
                    <p class="hero-subtitle">Commandez vos plats du jour locaux en direct ou réservez votre table en quelques clics. Paiement à la livraison ou sur place. Simple, rapide et sans commission.</p>
                    
                    <div class="search-container" style="margin: 0 0 2rem 0; width: 100%; max-width: 480px;">
                        <input type="text" id="search-input-field" class="search-input" placeholder="Rechercher un plat, un restaurant (dibi, yassa, pastel...)" oninput="applyFilters()">
                        <button class="search-btn">🔍</button>
                    </div>

                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <button class="btn btn-primary" onclick="scrollToCatalog()">Explorer nos Menus 🍽️</button>
                        <button class="btn btn-secondary" onclick="geolocateRestaurants()" style="background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border);">📍 Trouver autour de moi</button>
                    </div>
                </div>
                
                <!-- Right: Large Gourmet Plate Image -->
                <div class="hero-right-col">
                    <div class="hero-food-plate-container">
                        <img class="hero-food-plate" src="https://images.unsplash.com/photo-1544025162-d76694265947?w=700&auto=format&fit=crop&q=80" alt="Dibi d'Agneau Thiès">
                        <div class="glow-effect"></div>
                    </div>
                </div>
            </div>
        </section>

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
                    <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80" alt="Gourmet Bowl">
                </div>
                
                <!-- Right Card: Direct WhatsApp -->
                <div class="ref-card-text">
                    <div class="ref-card-icon-circle">💬</div>
                    <h3>Direct WhatsApp</h3>
                    <p>Votre panier est transformé en un message structuré envoyé en un clic au restaurateur pour confirmation.</p>
                </div>
            </div>
        </section>

        <!-- ========== PRESENTATION SECTION (Side by Side: Image Left, Text Right) ========== -->
        <section class="side-by-side-section">
            <div class="side-img-box">
                <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=700&auto=format&fit=crop&q=80" alt="Plat Traditionnel Sénégalais">
            </div>
            
            <div class="side-content">
                <h2 style="font-family: var(--font-serif); font-weight: 400; color: #ffffff;">Une Plateforme Commune & Solidaire</h2>
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
                <h2 style="font-family: var(--font-serif); font-weight: 400; color: #ffffff; font-size: 2.25rem; margin-bottom: 0.5rem;">Les Saveurs Emblématiques de Thiès</h2>
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
                <img src="https://images.unsplash.com/photo-1547592180-85f173990554?w=700&auto=format&fit=crop&q=80" alt="Mijoté Mafé Sénégalais">
            </div>
        </section>

        <!-- ONBOARDING COMMENT CA MARCHE -->
        <section class="how-it-works" id="how-it-works-section">
            <span class="study-title-tag">💡 Mode d'emploi</span>
            <h2 class="section-title" style="text-align:center; margin-bottom: 0.5rem; color: #fff;">Comment fonctionne la plateforme ?</h2>
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

        <!-- VOS DERNIERES COMMANDES PERSISTANT -->
        ${historyHtml}

        <section id="catalog-section">
            <div class="section-header">
                <h2 class="section-title">Les Restaurants Partenaires</h2>
            </div>

            <!-- FILTERS BAR -->
            <div class="filter-bar" id="filter-bar">
                <button class="filter-btn ${activeFilter === 'Tous' ? 'active' : ''}" onclick="setFilter('Tous')">Tous</button>
                <button class="filter-btn ${activeFilter === 'Traditionnel' ? 'active' : ''}" onclick="setFilter('Traditionnel')">🍲 Traditionnel</button>
                <button class="filter-btn ${activeFilter === 'Fast Food' ? 'active' : ''}" onclick="setFilter('Fast Food')">🍔 Fast Food</button>
                <button class="filter-btn ${activeFilter === 'Grillades / Dibi' ? 'active' : ''}" onclick="setFilter('Grillades / Dibi')">🔥 Grillades</button>
                <button class="filter-btn ${activeFilter === 'Gastronomique' ? 'active' : ''}" onclick="setFilter('Gastronomique')">✨ Gastronomique</button>
                <button class="filter-btn ${activeFilter === 'Pâtisserie' ? 'active' : ''}" onclick="setFilter('Pâtisserie')">🥐 Pâtisserie</button>
            </div>

            <!-- SORTING BAR -->
            <div class="sort-bar">
                <label for="sort-select">Trier par :</label>
                <select class="sort-select" id="sort-select" onchange="activeSortBy = this.value; applyFilters();">
                    <option value="default" ${activeSortBy === 'default' ? 'selected' : ''}>Recommandé</option>
                    <option value="rating" ${activeSortBy === 'rating' ? 'selected' : ''}>Meilleure note ★</option>
                    <option value="reviews" ${activeSortBy === 'reviews' ? 'selected' : ''}>Nombre d'avis</option>
                    <option value="name" ${activeSortBy === 'name' ? 'selected' : ''}>Nom de A à Z</option>
                </select>
            </div>
            
            <div class="restaurant-grid" id="restaurants-list-grid"></div>
        </section>

        <!-- ========== LOYALTY CARD SECTION ========== -->
        <section class="loyalty-checker-section" style="padding: 2.5rem 1.5rem; background: var(--bg-card); border-radius: 24px; border: 1px solid var(--border); margin: 2rem auto; max-width: 1200px;">
            <div style="max-width: 800px; margin: 0 auto; text-align: center;">
                <span class="study-title-tag" style="background: rgba(207, 168, 83, 0.1); color: var(--primary); padding: 0.35rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; border: 1px solid rgba(207, 168, 83, 0.2);">🎁 Programme de Fidélisation</span>
                <h2 style="font-family: var(--font-serif); font-size: 2rem; color: #fff; margin: 0.75rem 0 0.5rem 0;">Consultez votre Statut & Plats Offerts</h2>
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
                <h2 class="section-title" style="margin-bottom: 0.5rem; color: #fff;">L'Étude de Terrain & Notre Solution</h2>
                <p class="study-subtitle">Comment THIES Resto répond à la réalité chiffrée de la restauration à Thiès.</p>
            </div>

            <div class="study-split-grid">
                <!-- Left: Problems / Metrics -->
                <div class="study-left-col">
                    <h3 style="font-family: var(--font-serif); font-size: 1.3rem; margin-bottom: 1.5rem; color: #fff;">Le Constat Local (Étude Juin 2025)</h3>
                    
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
                    <h3 style="font-family: var(--font-serif); font-size: 1.3rem; margin-bottom: 1.5rem; color: #fff;">Les Réponses de THIES Resto</h3>

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

    applyFilters();
    hideLoadingOverlay();
});

function scrollToCatalog() {
    const el = document.getElementById('catalog-section');
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
    }
}

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
    applyFilters();
}

function applyFilters() {
    const searchInput = document.getElementById('search-input-field');
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const grid = document.getElementById('restaurants-list-grid');
    if (!grid) return;

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
                   r.menu.some(m => m.name.toLowerCase().includes(query) || m.description.toLowerCase().includes(query));
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
        
        const coverUrl = r.coverImage || RESTAURANT_COVERS[r.id] || COVER_IMAGES[r.category] || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60';
        const distanceBadge = r._tempDistance ? `<div style="position: absolute; top: 1rem; right: 1rem; background: var(--bg-card); color: var(--text-primary); padding: 0.35rem 0.75rem; border-radius: 20px; font-weight: 600; font-size: 0.8rem; box-shadow: 0 4px 10px rgba(0,0,0,0.1); z-index: 2;">📍 ${r._tempDistance} km</div>` : '';
            
        cardsHtml += `
            <div class="restaurant-card" onclick="router.navigate('/r/${r.slug}')">
                ${distanceBadge}
                <div class="restaurant-card-header">
                    <img src="${coverUrl}" class="restaurant-card-cover" alt="${r.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60'">
                    ${statusBadge}
                </div>
                <div class="restaurant-card-body">
                    <h3 class="restaurant-card-name">${r.name}</h3>
                    <div class="restaurant-card-meta">
                        <span class="stars-rating">★ ${r.rating.toFixed(1)}</span>
                        <span>(${r.reviewsCount} avis)</span>
                    </div>
                    <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
                        📍 ${r.address}
                    </p>
                    <span class="restaurant-card-cuisine">${r.category}</span>
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
router.add('#/r/:slug', (slug, startTab = 'menu', groupId = null) => {
    const r = store.getRestaurantBySlug(slug);
    if (!r) {
        document.getElementById('main-content').innerHTML = `
            <div style="text-align: center; padding: 5rem 1.5rem;">
                <h2>Restaurant non trouvé</h2>
                <p style="color: var(--text-secondary); margin: 1rem 0;">Le restaurant "${slug}" n'existe pas ou n'est plus actif.</p>
                <button class="btn btn-primary" onclick="router.navigate('/')">Retour à l'accueil</button>
            </div>
        `;
        return;
    }

    // Hide loading overlay if visible
    hideLoadingOverlay();
    stopOrderPolling();

    // Load persistent cart if any
    loadCart();

    // Associate cart with current restaurant if empty
    if (!cart.items || cart.items.length === 0) {
        cart.restaurantId = r.id;
        saveCart();
    }

    // Handle group order load from link
    if (startTab === 'group' && groupId) {
        if (!activeGroupOrder || activeGroupOrder.id !== groupId) {
            activeGroupOrder = {
                id: groupId,
                restaurantId: r.id,
                creator: "Coordinateur",
                participants: [
                    { name: "Mariama (Créateur)", items: [] }
                ]
            };
        }
    }

    // Dynamic SEO / JSON-LD Injection
    let seoScript = document.getElementById('dynamic-jsonld');
    if (!seoScript) {
        seoScript = document.createElement('script');
        seoScript.id = 'dynamic-jsonld';
        seoScript.type = 'application/ld+json';
        document.head.appendChild(seoScript);
    }
    const jsonLdData = {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        "name": r.name,
        "image": r.coverImage || RESTAURANT_COVERS[r.id] || COVER_IMAGES[r.category],
        "address": {
            "@type": "PostalAddress",
            "streetAddress": r.address,
            "addressLocality": "Thiès",
            "addressCountry": "SN"
        },
        "telephone": r.whatsapp,
        "priceRange": "1500 - 8000 FCFA",
        "servesCuisine": r.category,
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": r.rating.toString(),
            "reviewCount": r.reviewsCount.toString()
        }
    };
    seoScript.text = JSON.stringify(jsonLdData);

    // Update document title for SEO
    document.title = `${r.name} - Commander en Ligne à Thiès | THIES Resto`;

    renderRestaurantView(r, startTab, groupId);
});

function renderRestaurantView(r, activeTab = 'menu', groupId = null) {
    const container = document.getElementById('main-content');
    
    // Status Badge
    const isCurrentlyOpen = isRestaurantOpenNow(r);
    const statusBadge = isCurrentlyOpen 
        ? `<span class="badge badge-success">Ouvert</span>` 
        : `<span class="badge badge-danger">Fermé</span>`;

    // Map URL
    const mapQuery = encodeURIComponent(`${r.name}, Thiès, Sénégal`);
    const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

    // Closed days description
    let closedDaysText = '';
    if (r.closedDays.length > 0) {
        closedDaysText = ` (Fermé : ${r.closedDays.map(d => getDayName(d)).join(', ')})`;
    }

    // Render Base Page Structure with ← Back Button above header
    container.innerHTML = `
        <button class="back-btn" onclick="router.navigate('/')">
            ← Retour aux restaurants
        </button>

        <div class="restaurant-details-header">
            <div class="restaurant-logo-large">🍽️</div>
            <h1 class="restaurant-name-title">${r.name}</h1>
            
            <div class="restaurant-status-row">
                ${statusBadge}
                <span class="stars-rating">★ ${r.rating.toFixed(1)}</span>
                <span style="color: var(--text-secondary)">(${r.reviewsCount} avis)</span>
            </div>
            
            <p class="restaurant-meta-info">
                🕒 Horaires : ${r.openHours}${closedDaysText} | 📍 ${r.address}
            </p>
            
            <div class="restaurant-meta-actions">
                <a href="${googleMapsLink}" target="_blank" class="btn btn-secondary btn-sm">
                    🗺️ S'y rendre (Google Maps)
                </a>
                <a href="https://wa.me/${r.whatsapp.replace(/\+/g, '')}" target="_blank" class="btn btn-outline btn-sm">
                    💬 Contacter WhatsApp
                </a>
            </div>
        </div>

        <nav class="tabs-nav">
            <button class="tab-btn ${activeTab === 'menu' ? 'active' : ''}" onclick="switchRestoTab('menu')">Menu du Jour 🍕</button>
            <button class="tab-btn ${activeTab === 'checkout' ? 'active' : ''}" id="tab-checkout-btn" onclick="switchRestoTab('checkout')">Commander 🛒</button>
            <button class="tab-btn ${activeTab === 'group' ? 'active' : ''}" onclick="switchRestoTab('group')">Commande de Groupe 👥</button>
            <button class="tab-btn ${activeTab === 'booking' ? 'active' : ''}" onclick="switchRestoTab('booking')">Réserver une Table 📅</button>
            <button class="tab-btn ${activeTab === 'reviews' ? 'active' : ''}" onclick="switchRestoTab('reviews')">Avis Clients (${r.reviews.length}) 💬</button>
        </nav>

        <div class="tab-content">
            <!-- PANEL: MENU -->
            <div class="tab-panel ${activeTab === 'menu' ? 'active' : ''}" id="panel-menu">
                <div class="dishes-grid" id="dishes-list-grid"></div>
            </div>

            <!-- PANEL: CHECKOUT -->
            <div class="tab-panel ${activeTab === 'checkout' ? 'active' : ''}" id="panel-checkout">
                <div id="checkout-content-container"></div>
            </div>

            <!-- PANEL: GROUP ORDER -->
            <div class="tab-panel ${activeTab === 'group' ? 'active' : ''}" id="panel-group">
                <div id="group-content-container"></div>
            </div>

            <!-- PANEL: BOOKING -->
            <div class="tab-panel ${activeTab === 'booking' ? 'active' : ''}" id="panel-booking">
                <div id="booking-content-container"></div>
            </div>

            <!-- PANEL: REVIEWS -->
            <div class="tab-panel ${activeTab === 'reviews' ? 'active' : ''}" id="panel-reviews">
                <div id="reviews-content-container"></div>
            </div>
        </div>
    `;

    // Render Tab Panel Contents
    renderDishesTab(r);
    renderCheckoutTab(r);
    renderGroupTab(r, groupId);
    renderBookingTab(r);
    renderReviewsTab(r);
    
    // Update floating cart visibility
    updateFloatingCartBar(r);
}

function switchRestoTab(tabName) {
    const btns = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.tab-panel');
    
    btns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.toLowerCase().includes(tabName === 'checkout' ? 'commander' : tabName === 'booking' ? 'réserver' : tabName === 'group' ? 'groupe' : tabName === 'reviews' ? 'avis' : 'menu')) {
            btn.classList.add('active');
        }
    });

    panels.forEach(p => p.classList.remove('active'));
    const panel = document.getElementById(`panel-${tabName}`);
    if (panel) panel.classList.add('active');
    
    const r = store.getRestaurantById(cart.restaurantId);
    if (r) {
        updateFloatingCartBar(r);
        if (tabName === 'checkout') renderCheckoutTab(r);
    }
    
    // Window scroll to top of tabs smoothly
    const tabsNav = document.querySelector('.tabs-nav');
    if (tabsNav) tabsNav.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function openCartTab() {
    switchRestoTab('checkout');
}


// ----------------------------------------------------
// Restaurant View - Tab Panels Renderers
// ----------------------------------------------------

// 1. Menu Panel
function renderDishesTab(r) {
    const grid = document.getElementById('dishes-list-grid');
    let html = '';
    
    if (r.menu.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 3rem 0;">Aucun plat du jour disponible aujourd'hui.</div>`;
        return;
    }

    r.menu.forEach(d => {
        const isCurrentlyOpen = isRestaurantOpenNow(r);
        const actionBtn = isCurrentlyOpen
            ? `<button class="btn btn-primary btn-block" onclick="addToCart('${r.id}', '${d.id}')">Ajouter au Panier 🛒</button>`
            : `<button class="btn btn-secondary btn-block" disabled>Fermé temporairement</button>`;

        html += `
            <div class="dish-card">
                <div class="dish-img-container">
                    <img src="${d.image}" class="dish-image" alt="${d.name}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'">
                    <span class="dish-price-tag">${d.price} FCFA</span>
                </div>
                <div class="dish-body">
                    <h3 class="dish-title">${d.name}</h3>
                    <p class="dish-desc">${d.description}</p>
                    ${actionBtn}
                </div>
            </div>
        `;
    });
    grid.innerHTML = html;
}

// Cart updates
function addToCart(restaurantId, dishId) {
    const r = store.getRestaurantById(restaurantId);
    const dish = r.menu.find(d => d.id === dishId);
    if (!dish) return;
    
    // Check for multi-restaurant cart safety
    if (cart.restaurantId && cart.restaurantId !== restaurantId && cart.items.length > 0) {
        const oldResto = store.getRestaurantById(cart.restaurantId);
        const oldName = oldResto ? oldResto.name : "un autre restaurant";
        const confirmClear = confirm(`Votre panier contient déjà des plats de "${oldName}". Voulez-vous vider votre panier actuel pour commander chez "${r.name}" ?`);
        if (!confirmClear) {
            return;
        }
        // User confirmed: clear cart and switch restaurant
        cart = {
            restaurantId: restaurantId,
            items: [],
            total: 0
        };
    }
    
    // Set restaurant ID if cart was empty or reset
    cart.restaurantId = restaurantId;
    
    const existing = cart.items.find(item => item.id === dishId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.items.push({
            id: dish.id,
            name: dish.name,
            price: dish.price,
            qty: 1
        });
    }
    
    recalculateCart();
    saveCart();
    updateFloatingCartBar(r);
    pulseCartBar();
    renderCheckoutTab(r); // update checkout page too
    showToast(`${dish.name} ajouté !`, "success");
}

function updateCartQty(dishId, change) {
    const r = store.getRestaurantById(cart.restaurantId);
    const idx = cart.items.findIndex(item => item.id === dishId);
    if (idx !== -1) {
        cart.items[idx].qty += change;
        if (cart.items[idx].qty <= 0) {
            cart.items.splice(idx, 1);
        }
        recalculateCart();
        saveCart();
        updateFloatingCartBar(r);
        renderCheckoutTab(r);
    }
}

function recalculateCart() {
    let subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    cart.subtotal = subtotal;
    if (cart.loyaltyApplied) {
        cart.total = Math.max(0, subtotal - 2500);
    } else {
        cart.total = subtotal;
    }
}

function updateFloatingCartBar(r) {
    const bar = document.getElementById('floating-cart-bar');
    const totalQty = cart.items.reduce((sum, item) => sum + item.qty, 0);
    
    const activePanel = document.querySelector('.tab-panel.active');
    const isCheckoutActive = activePanel && activePanel.id === 'panel-checkout';

    // Show floating bar only if cart has items AND restaurant is open AND we are not already on the checkout tab
    if (totalQty > 0 && isRestaurantOpenNow(r) && !isCheckoutActive) {
        document.getElementById('floating-cart-qty').innerText = `${totalQty} article${totalQty > 1 ? 's' : ''}`;
        document.getElementById('floating-cart-total').innerText = `${cart.total} FCFA`;
        bar.style.display = 'flex';
    } else {
        bar.style.display = 'none';
    }
}

// 2. Checkout Panel
function renderCheckoutTab(r) {
    const container = document.getElementById('checkout-content-container');
    
    if (cart.items.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 4rem 1rem;">
                <span style="font-size: 3rem;">🛒</span>
                <h3 style="margin-top: 1rem;">Votre panier est vide</h3>
                <p style="color: var(--text-secondary); margin: 0.5rem 0 1.5rem 0;">Parcourez notre menu du jour et ajoutez des délices !</p>
                <button class="btn btn-primary" onclick="switchRestoTab('menu')">Voir le Menu</button>
            </div>
        `;
        return;
    }

    let itemsHtml = '';
    cart.items.forEach(item => {
        itemsHtml += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price} FCFA</div>
                </div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="updateCartQty('${item.id}', -1)">-</button>
                    <span class="qty-val">${item.qty}</span>
                    <button class="qty-btn" onclick="updateCartQty('${item.id}', 1)">+</button>
                </div>
            </div>
        `;
    });

    let totalHtml = '';
    if (cart.loyaltyApplied) {
        totalHtml = `
            <div class="cart-total-box" style="flex-direction: column; align-items: flex-end; gap: 0.25rem;">
                <div style="font-size: 0.9rem; color: var(--text-secondary);">Sous-total : ${cart.subtotal} FCFA</div>
                <div style="font-size: 0.9rem; color: var(--success); font-weight: bold; display: flex; align-items: center; gap: 0.5rem;">
                    <span>🎁 Réduction Fidélité : -2,500 FCFA</span>
                    <button type="button" class="btn btn-link btn-xs" onclick="removeLoyaltyReward()" style="padding: 0; color: #ff6b6b; text-decoration: underline; font-size: 0.75rem;">Retirer</button>
                </div>
                <div style="font-size: 1.25rem; font-weight: 800; color: #fff; margin-top: 0.25rem;">Total à payer : <span class="cart-total-price">${cart.total} FCFA</span></div>
            </div>
        `;
    } else {
        totalHtml = `
            <div class="cart-total-box">
                <span>Total à payer :</span>
                <span class="cart-total-price">${cart.total} FCFA</span>
            </div>
        `;
    }

    container.innerHTML = `
        <h2 style="font-size: 1.25rem; margin-bottom: 1rem;">Votre Commande</h2>
        <div class="cart-list">
            ${itemsHtml}
        </div>
        
        ${totalHtml}
        
        <form id="checkout-form" onsubmit="submitSimpleOrder(event, '${r.id}')" style="background: var(--bg-card); padding: 1.5rem; border-radius: 20px; border: 1px solid var(--border);">
            <h3 style="font-size: 1.1rem; margin-bottom: 1.25rem;">Informations de Livraison / Récupération</h3>
            
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Prénom <span class="required">*</span></label>
                    <input type="text" id="order-firstname" class="form-control" placeholder="Awa" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Nom <span class="required">*</span></label>
                    <input type="text" id="order-lastname" class="form-control" placeholder="Diop" required>
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">Numéro WhatsApp <span class="required">*</span></label>
                <input type="tel" id="order-phone" class="form-control" placeholder="+221 77 123 45 67" required>
            </div>
            
            <div class="form-group">
                <label class="form-label">Mode de Récupération <span class="required">*</span></label>
                <div class="delivery-options">
                    <label class="delivery-radio-card">
                        <input type="radio" name="order-mode" value="Sur place" onchange="toggleAddressField(false)">
                        <div class="delivery-card-content">
                            <span class="delivery-icon">🍽️</span>
                            <span>Sur Place</span>
                        </div>
                    </label>
                    <label class="delivery-radio-card">
                        <input type="radio" name="order-mode" value="A emporter" checked onchange="toggleAddressField(false)">
                        <div class="delivery-card-content">
                            <span class="delivery-icon">🛍️</span>
                            <span>A Emporter</span>
                        </div>
                    </label>
                    <label class="delivery-radio-card">
                        <input type="radio" name="order-mode" value="Livraison" onchange="toggleAddressField(true)">
                        <div class="delivery-card-content">
                            <span class="delivery-icon">🛵</span>
                            <span>Livraison</span>
                        </div>
                    </label>
                </div>
            </div>
            
            <div class="form-group" id="delivery-address-group" style="display: none;">
                <label class="form-label">Adresse de Livraison (Thiès) <span class="required">*</span></label>
                <input type="text" id="order-address" class="form-control" placeholder="Quartier Mbour 1, en face de la mosquée, Thiès">
            </div>
            
            <div class="form-group">
                <label class="form-label">Notes Spéciales / Allergies (Optionnel)</label>
                <textarea id="order-notes" class="form-control" placeholder="Sans piment, sauce à part..."></textarea>
            </div>
            
            <button type="submit" class="btn btn-primary btn-block">
                Envoyer ma commande au restaurant 🛵
            </button>
        </form>
    `;
}

function toggleAddressField(show) {
    const group = document.getElementById('delivery-address-group');
    const input = document.getElementById('order-address');
    if (show) {
        group.style.display = 'block';
        input.required = true;
    } else {
        group.style.display = 'none';
        input.required = false;
        input.value = '';
    }
}

// Submission of client order
function submitSimpleOrder(e, restaurantId) {
    e.preventDefault();
    
    const r = store.getRestaurantById(restaurantId);
    
    const firstname = document.getElementById('order-firstname').value.trim();
    const lastname = document.getElementById('order-lastname').value.trim();
    const phone = cleanPhoneNumber(document.getElementById('order-phone').value.trim());
    const mode = document.querySelector('input[name="order-mode"]:checked').value;
    const address = document.getElementById('order-address').value.trim();
    const notes = document.getElementById('order-notes').value.trim();
    
    // Validate phone number
    if (!/^\+221(70|75|76|77|78)\d{7}$/.test(phone.replace(/\s+/g, ''))) {
        showToast("Numéro de téléphone sénégalais invalide (ex: +221 77 XXX XX XX)", "danger");
        return;
    }
    
    const orderId = "ORD-" + Math.floor(1000 + Math.random() * 9000);
    const date = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
    let finalNotes = notes;
    if (cart.loyaltyApplied) {
        finalNotes = `${notes ? notes + ' | ' : ''}[RÉCOMPENSE FIDÉLITÉ APPLIQUÉE : -2,500 FCFA]`;
    }

    const order = {
        id: orderId,
        restaurantId: r.id,
        customerName: `${firstname} ${lastname}`,
        customerPhone: phone,
        mode,
        address,
        items: cart.items.map(item => ({ name: item.name, price: item.price, qty: item.qty })),
        total: cart.total,
        note: finalNotes,
        status: "Reçue",
        date,
        time
    };

    store.addOrder(order);
    saveOrderToHistory(order, r.name);
    
    // Increment used rewards if loyalty was applied
    if (cart.loyaltyApplied && cart.loyaltyPhone) {
        store.applyLoyaltyRewardUsed(cart.loyaltyPhone, `${firstname} ${lastname}`);
    }

    // Format WhatsApp & SMS message
    const formattedItems = cart.items.map(i => `${i.name} x${i.qty}`).join(', ');
    const waText = `Bonjour ${r.name}, je viens de passer la commande n°*${orderId}* sur THIES Resto de la part de *${firstname} ${lastname}* (${phone}).
 
🛍️ *Détail de la commande* :
${formattedItems}
${cart.loyaltyApplied ? `🎁 *Réduction Fidélité* : -2500 FCFA\n` : ''}💰 *Total* : ${cart.total} FCFA
🛵 *Mode* : ${mode}
${address ? `📍 *Adresse* : ${address}` : ''}
${notes ? `📝 *Note* : ${notes}` : ''}
 
Merci de confirmer la réception !`;

    const waLink = `https://wa.me/${r.whatsapp.replace(/\+/g, '')}?text=${encodeURIComponent(waText)}`;
    const smsLink = getSMSLink(r.whatsapp, waText);
    
    // Reset Cart
    cart = {
        restaurantId: null,
        items: [],
        total: 0,
        loyaltyApplied: false,
        loyaltyPhone: null
    };
    saveCart();
    updateFloatingCartBar(r);

    // Show Confirmation screen
    const isOffline = !navigator.onLine;
    const waBtnClass = isOffline ? 'btn-secondary' : 'btn-success';
    const smsBtnClass = isOffline ? 'btn-success' : 'btn-secondary';
    
    const connectionAlert = isOffline 
        ? `<div style="background: rgba(220, 53, 69, 0.15); color: #ff6b6b; padding: 0.75rem; border-radius: 12px; font-size: 0.85rem; margin-bottom: 1rem; border: 1px solid rgba(220, 53, 69, 0.3); text-align: center; font-weight: 500;">
            🔌 Vous êtes HORS-LIGNE. Veuillez envoyer le récapitulatif par SMS classique sécurisé ci-dessous.
           </div>`
        : `<p style="font-size: 0.85rem; color: var(--accent); margin-bottom: 1.5rem;">⚠️ Pour assurer une confirmation immédiate par le gérant, veuillez également envoyer le récapitulatif par WhatsApp via le bouton ci-dessous.</p>`;

    triggerCelebration();

    const container = document.getElementById('checkout-content-container');
    container.innerHTML = `
        <div class="confirmation-screen">
            <div class="confirmation-icon">✅</div>
            <h2>Commande enregistrée !</h2>
            <p style="color: var(--text-secondary); margin: 1rem 0;">Votre commande n° <strong>${orderId}</strong> a bien été enregistrée par le restaurant.</p>
            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 12px; font-size: 0.9rem; text-align: left; margin: 1.5rem 0;">
                <strong>Récapitulatif :</strong><br>
                Client : ${firstname} ${lastname}<br>
                Mode : ${mode}<br>
                Montant : <strong>${order.total} FCFA</strong> (espèces à la livraison/réception)
            </div>
            ${connectionAlert}
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                <a href="${waLink}" target="_blank" class="btn ${waBtnClass}">
                    💬 Confirmer par WhatsApp
                </a>
                <a href="${smsLink}" class="btn ${smsBtnClass}">
                    📱 Option Secours : Envoyer par SMS classique
                </a>
                <button class="btn btn-dark" onclick="router.navigate('/')">
                    Retourner à l'accueil
                </button>
            </div>
            
            <div class="review-section" id="checkout-review-section" style="margin-top: 2rem; background: rgba(255,255,255,0.02); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                <h3 style="font-size: 1.1rem; margin-bottom: 1rem; color: var(--primary);">Évaluez votre expérience</h3>
                <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 1rem;">Votre avis aide <strong>${r.name}</strong> à s'améliorer !</p>
                <div class="form-group" style="text-align: left;">
                    <label class="form-label">Note sur 5 <span class="required">*</span></label>
                    <select id="review-rating" class="form-control" required style="background: rgba(255,255,255,0.05); color: white; border: 1px solid rgba(255,255,255,0.2);">
                        <option value="5" style="color: black;">⭐⭐⭐⭐⭐ Parfait !</option>
                        <option value="4" style="color: black;">⭐⭐⭐⭐ Très bien</option>
                        <option value="3" style="color: black;">⭐⭐⭐ Bien</option>
                        <option value="2" style="color: black;">⭐⭐ Moyen</option>
                        <option value="1" style="color: black;">⭐ Décevant</option>
                    </select>
                </div>
                <div class="form-group" style="text-align: left;">
                    <label class="form-label">Commentaire (optionnel)</label>
                    <textarea id="review-comment" class="form-control" rows="2" placeholder="Qu'avez-vous pensé du repas ?" style="background: rgba(255,255,255,0.05); color: white; border: 1px solid rgba(255,255,255,0.2);"></textarea>
                </div>
                <button class="btn btn-primary btn-block" onclick="submitCustomerReview('${r.id}', '${(firstname + ' ' + lastname).replace(/'/g, "\\'")}')">Envoyer mon avis</button>
            </div>
        </div>
    `;
    
    showToast("Commande enregistrée avec succès !", "success");
}

// 3. Commande de Groupe Panel
function renderGroupTab(r, groupId = null) {
    const container = document.getElementById('group-content-container');
    
    if (!groupId && !activeGroupOrder) {
        // No group order active yet, show setup screen
        container.innerHTML = `
            <div class="group-setup">
                <div class="group-setup-icon">👥</div>
                <h3 style="margin-bottom: 0.75rem;">Commande de Groupe</h3>
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.5rem;">
                    Commandez avec vos collègues ou amis ! Créez un panier partagé, envoyez le lien sur WhatsApp, et laissez chacun choisir son plat en direct.
                </p>
                <div class="form-group" style="text-align: left; max-width: 400px; margin: 0 auto 1.5rem auto;">
                    <label class="form-label">Votre Prénom/Nom (Organisateur) <span class="required">*</span></label>
                    <input type="text" id="group-creator-name" class="form-control" placeholder="Mariama Diop" required>
                </div>
                <button class="btn btn-primary" onclick="createGroupOrder('${r.slug}')">
                    Lancer une commande de groupe 🚀
                </button>
            </div>
        `;
        return;
    }

    // A group order is active
    const groupLink = `${window.location.origin}${window.location.pathname}#/r/${r.slug}/group/${activeGroupOrder.id}`;
    
    const waText = `Bonjour ! Rejoignez ma commande de groupe chez *${r.name}* sur THIES Resto pour ajouter vos plats en un clic : ${groupLink}`;
    const waShareLink = `https://wa.me/?text=${encodeURIComponent(waText)}`;

    // Build participants table
    let participantsHtml = '';
    let grandTotal = 0;
    
    activeGroupOrder.participants.forEach((p, pIdx) => {
        let pItemsText = '';
        let pSubtotal = 0;
        
        if (p.items.length === 0) {
            pItemsText = `<span style="font-style: italic; color: var(--text-secondary);">Aucun plat sélectionné</span>`;
        } else {
            pItemsText = p.items.map(item => `${item.name} (x${item.qty})`).join(', ');
            pSubtotal = p.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
            grandTotal += pSubtotal;
        }

        participantsHtml += `
            <div class="participant-row">
                <div>
                    <div class="participant-name">${p.name}</div>
                    <div class="participant-choice">${pItemsText}</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: 700; color: var(--primary);">${pSubtotal} FCFA</div>
                    <button class="btn btn-danger btn-sm btn-icon" style="padding: 0.15rem 0.35rem; font-size: 0.7rem; margin-top: 0.25rem;" onclick="removeParticipant(${pIdx}, '${r.slug}', '${groupId}')">❌</button>
                </div>
            </div>
        `;
    });

    // Dishes dropdown options
    let dishesOptions = '<option value="">-- Sélectionner un plat --</option>';
    r.menu.forEach(d => {
        dishesOptions += `<option value="${d.id}">${d.name} (${d.price} FCFA)</option>`;
    });

    container.innerHTML = `
        <div class="group-active-panel">
            <div style="background: var(--bg-card); border: 1px solid var(--border); padding: 1.25rem; border-radius: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <h3 style="font-size: 1.15rem;">Groupe Actif : Commandes en cours</h3>
                    <span class="badge badge-info">ID : ${activeGroupOrder.id}</span>
                </div>
                <p style="font-size: 0.85rem; color: var(--text-secondary);">Créé par : <strong>${activeGroupOrder.creator}</strong></p>
            </div>
            
            <div class="group-share-box">
                <div style="flex-grow: 1; overflow: hidden;">
                    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--primary); margin-bottom: 0.25rem;">Lien à partager aux collègues :</div>
                    <div class="group-share-link" id="group-link-display">${groupLink}</div>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="copyGroupLink()">Copier 📋</button>
                <a href="${waShareLink}" target="_blank" class="btn btn-success btn-sm">Partager 💬</a>
            </div>

            <!-- SIMULATION FORM FOR MULTIPLE USERS ON SAME MACHINE -->
            <div style="background: var(--bg-card); border: 1px solid var(--border); padding: 1.25rem; border-radius: 16px;">
                <h4 style="font-size: 0.95rem; margin-bottom: 0.75rem;">Ajouter un participant ou votre choix</h4>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Nom du participant <span class="required">*</span></label>
                        <input type="text" id="part-name" class="form-control" placeholder="Aline, Omar..." required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Plat choisi <span class="required">*</span></label>
                        <select id="part-dish-select" class="form-control" required>
                            ${dishesOptions}
                        </select>
                    </div>
                </div>
                <button type="button" class="btn btn-secondary btn-block btn-sm" onclick="addParticipantAction('${r.slug}', '${groupId}')">
                    Ajouter ce choix au panier commun ➕
                </button>
            </div>

            <div class="group-participants">
                <h4 style="font-size: 0.95rem;">Membres du Groupe</h4>
                ${participantsHtml}
            </div>

            <div class="cart-total-box">
                <span>Total de groupe :</span>
                <span class="cart-total-price">${grandTotal} FCFA</span>
            </div>

            <form id="group-final-form" onsubmit="submitGroupOrder(event, '${r.id}', '${grandTotal}')" style="background: var(--bg-card); padding: 1.5rem; border-radius: 20px; border: 1px solid var(--border);">
                <h3 style="font-size: 1.05rem; margin-bottom: 1rem;">Validation & Livraison Globale</h3>
                
                <div class="form-group">
                    <label class="form-label">Responsable du Paiement <span class="required">*</span></label>
                    <input type="text" id="group-payee-name" class="form-control" value="${activeGroupOrder.creator}" required>
                </div>

                <div class="form-group">
                    <label class="form-label">Numéro WhatsApp du Responsable <span class="required">*</span></label>
                    <input type="tel" id="group-phone" class="form-control" placeholder="+221 77 123 45 67" required>
                </div>

                <div class="form-group">
                    <label class="form-label">Mode de Récupération <span class="required">*</span></label>
                    <div class="delivery-options">
                        <label class="delivery-radio-card">
                            <input type="radio" name="group-mode" value="Sur place" onchange="toggleGroupAddressField(false)">
                            <div class="delivery-card-content">
                                <span class="delivery-icon">🍽️</span>
                                <span>Sur Place</span>
                            </div>
                        </label>
                        <label class="delivery-radio-card">
                            <input type="radio" name="group-mode" value="A emporter" checked onchange="toggleGroupAddressField(false)">
                            <div class="delivery-card-content">
                                <span class="delivery-icon">🛍️</span>
                                <span>A Emporter</span>
                            </div>
                        </label>
                        <label class="delivery-radio-card">
                            <input type="radio" name="group-mode" value="Livraison" onchange="toggleGroupAddressField(true)">
                            <div class="delivery-card-content">
                                <span class="delivery-icon">🛵</span>
                                <span>Livraison</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div class="form-group" id="group-address-group" style="display: none;">
                    <label class="form-label">Adresse Unique de Livraison (Thiès) <span class="required">*</span></label>
                    <input type="text" id="group-address" class="form-control" placeholder="Adresse du bureau, service, Thiès">
                </div>

                <button type="submit" class="btn btn-primary btn-block" ${grandTotal === 0 ? 'disabled' : ''}>
                    Valider et envoyer la commande groupée (${grandTotal} FCFA) 👥
                </button>
            </form>
        </div>
    `;
}

function toggleGroupAddressField(show) {
    const group = document.getElementById('group-address-group');
    const input = document.getElementById('group-address');
    if (show) {
        group.style.display = 'block';
        input.required = true;
    } else {
        group.style.display = 'none';
        input.required = false;
        input.value = '';
    }
}

function createGroupOrder(slug) {
    const creator = document.getElementById('group-creator-name').value.trim();
    if (!creator) {
        showToast("Veuillez saisir le nom de l'organisateur", "danger");
        return;
    }
    
    const r = store.getRestaurantBySlug(slug);
    const groupId = "GRP-" + Math.floor(100000 + Math.random() * 900000);
    
    activeGroupOrder = {
        id: groupId,
        restaurantId: r.id,
        creator: creator,
        participants: [
            { name: `${creator} (Créateur)`, items: [] }
        ]
    };
    
    showToast("Commande de groupe lancée !", "success");
    router.navigate(`/r/${slug}/group/${groupId}`);
}

function addParticipantAction(slug, groupId) {
    const name = document.getElementById('part-name').value.trim();
    const dishId = document.getElementById('part-dish-select').value;
    
    if (!name || !dishId) {
        showToast("Veuillez remplir le nom et choisir un plat", "danger");
        return;
    }
    
    const r = store.getRestaurantBySlug(slug);
    const dish = r.menu.find(d => d.id === dishId);
    
    // Check if participant already exists in the group order
    let p = activeGroupOrder.participants.find(part => part.name.toLowerCase() === name.toLowerCase());
    
    if (p) {
        // add to existing
        const item = p.items.find(i => i.id === dishId);
        if (item) {
            item.qty += 1;
        } else {
            p.items.push({ id: dish.id, name: dish.name, price: dish.price, qty: 1 });
        }
    } else {
        // create new
        activeGroupOrder.participants.push({
            name: name,
            items: [{ id: dish.id, name: dish.name, price: dish.price, qty: 1 }]
        });
    }

    // Reset inputs
    document.getElementById('part-name').value = '';
    document.getElementById('part-dish-select').value = '';
    
    showToast(`Plat ajouté pour ${name}`, "success");
    renderGroupTab(r, groupId);
}

function removeParticipant(idx, slug, groupId) {
    activeGroupOrder.participants.splice(idx, 1);
    const r = store.getRestaurantBySlug(slug);
    renderGroupTab(r, groupId);
    showToast("Choix supprimé", "info");
}

function copyGroupLink() {
    const display = document.getElementById('group-link-display');
    navigator.clipboard.writeText(display.innerText).then(() => {
        showToast("Lien copié dans le presse-papiers !", "success");
    }).catch(err => {
        showToast("Échec de la copie du lien", "danger");
    });
}

function submitGroupOrder(e, restaurantId, grandTotal) {
    e.preventDefault();
    
    const r = store.getRestaurantById(restaurantId);
    const payeeName = document.getElementById('group-payee-name').value.trim();
    const phone = cleanPhoneNumber(document.getElementById('group-phone').value.trim());
    const mode = document.querySelector('input[name="group-mode"]:checked').value;
    const address = document.getElementById('group-address').value.trim();
    
    // Validate phone number
    if (!/^\+221(70|75|76|77|78)\d{7}$/.test(phone.replace(/\s+/g, ''))) {
        showToast("Numéro de téléphone sénégalais invalide (ex: +221 77 XXX XX XX)", "danger");
        return;
    }
    
    const orderId = "ORD-" + Math.floor(1000 + Math.random() * 9000);
    const date = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
    // Build combined items for order tracking
    const itemsMap = {};
    activeGroupOrder.participants.forEach(p => {
        p.items.forEach(i => {
            if (itemsMap[i.name]) {
                itemsMap[i.name].qty += i.qty;
            } else {
                itemsMap[i.name] = { name: i.name, price: i.price, qty: i.qty };
            }
        });
    });
    const combinedItems = Object.values(itemsMap);
    
    // String formatted participants for notes
    const participantsDetail = activeGroupOrder.participants.map(p => {
        const pItems = p.items.map(i => `${i.name} x${i.qty}`).join(', ');
        return `${p.name} : ${pItems}`;
    }).join(' | ');

    const order = {
        id: orderId,
        restaurantId: r.id,
        customerName: `[GROUPE] ${payeeName}`,
        customerPhone: phone,
        mode,
        address,
        items: combinedItems,
        total: parseInt(grandTotal),
        note: `Commande de groupe (${activeGroupOrder.id}). Détails : ${participantsDetail}`,
        status: "Reçue",
        date,
        time
    };

    store.addOrder(order);
    
    // Format WhatsApp message
    let partListStr = '';
    activeGroupOrder.participants.forEach(p => {
        if (p.items.length > 0) {
            const pItems = p.items.map(i => `${i.name} x${i.qty}`).join(', ');
            partListStr += `• *${p.name}* : ${pItems}\n`;
        }
    });

    const waText = `Bonjour ${r.name}, voici la commande de groupe n°*${orderId}* (ID Groupe: ${activeGroupOrder.id}) sur THIES Resto de la part de *${payeeName}* (${phone}).

👥 *Détails des participants* :
${partListStr}
💰 *Total cumulé* : ${grandTotal} FCFA
🛵 *Mode* : ${mode}
${address ? `📍 *Adresse de livraison* : ${address}` : ''}

Merci de nous confirmer la réception et le départ en préparation !`;

    const waLink = `https://wa.me/${r.whatsapp.replace(/\+/g, '')}?text=${encodeURIComponent(waText)}`;
    const smsLink = getSMSLink(r.whatsapp, waText);
    
    // Clear active group order
    activeGroupOrder = null;
    
    // Show confirmation
    const isOffline = !navigator.onLine;
    const waBtnClass = isOffline ? 'btn-secondary' : 'btn-success';
    const smsBtnClass = isOffline ? 'btn-success' : 'btn-secondary';
    
    const connectionAlert = isOffline 
        ? `<div style="background: rgba(220, 53, 69, 0.15); color: #ff6b6b; padding: 0.75rem; border-radius: 12px; font-size: 0.85rem; margin-bottom: 1rem; border: 1px solid rgba(220, 53, 69, 0.3); text-align: center; font-weight: 500;">
            🔌 Vous êtes HORS-LIGNE. Veuillez envoyer le récapitulatif groupé par SMS classique sécurisé ci-dessous.
           </div>`
        : `<p style="font-size: 0.85rem; color: var(--accent); margin-bottom: 1.5rem;">⚠️ Pour assurer une confirmation immédiate, veuillez transmettre le récapitulatif groupé par WhatsApp.</p>`;

    triggerCelebration();

    const container = document.getElementById('group-content-container');
    container.innerHTML = `
        <div class="confirmation-screen">
            <div class="confirmation-icon">👥✅</div>
            <h2>Commande de Groupe validée !</h2>
            <p style="color: var(--text-secondary); margin: 1rem 0;">La commande groupée n° <strong>${orderId}</strong> a été enregistrée.</p>
            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 12px; font-size: 0.9rem; text-align: left; margin: 1.5rem 0;">
                <strong>Responsable de groupe :</strong> ${payeeName}<br>
                <strong>Montant total cumulé :</strong> ${grandTotal} FCFA
            </div>
            ${connectionAlert}
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                <a href="${waLink}" target="_blank" class="btn ${waBtnClass}">
                    💬 Confirmer par WhatsApp
                </a>
                <a href="${smsLink}" class="btn ${smsBtnClass}">
                    📱 Option Secours : Envoyer par SMS classique
                </a>
                <button class="btn btn-dark" onclick="router.navigate('/')">
                    Retourner à l'accueil
                </button>
            </div>
        </div>
    `;
    
    showToast("Commande de groupe validée !", "success");
}

// 4. Booking Panel (Reservation)
function renderBookingTab(r) {
    const container = document.getElementById('booking-content-container');
    
    // Calculate hour slots
    // Supposing hours are "12:00 - 23:00"
    let hourOptionsHtml = '';
    try {
        const parts = r.openHours.split('-');
        if (parts.length === 2) {
            const startHour = parseInt(parts[0].trim().split(':')[0]);
            const endHour = parseInt(parts[1].trim().split(':')[0]);
            
            // Generate slots
            for (let h = startHour; h < (endHour < startHour ? endHour + 24 : endHour); h++) {
                const displayH = h % 24;
                const paddedH = String(displayH).padStart(2, '0');
                hourOptionsHtml += `<option value="${paddedH}:00">${paddedH}:00</option>`;
                hourOptionsHtml += `<option value="${paddedH}:30">${paddedH}:30</option>`;
            }
        }
    } catch(e) {
        hourOptionsHtml = `
            <option value="12:00">12:00</option>
            <option value="13:00">13:00</option>
            <option value="19:00">19:00</option>
            <option value="20:00">20:00</option>
            <option value="21:00">21:00</option>
        `;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    container.innerHTML = `
        <form id="booking-form" onsubmit="submitBooking(event, '${r.id}')" style="background: var(--bg-card); padding: 1.5rem; border-radius: 20px; border: 1px solid var(--border);">
            <h3 style="font-size: 1.15rem; margin-bottom: 1.25rem;">Réserver une Table</h3>
            
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Prénom <span class="required">*</span></label>
                    <input type="text" id="booking-firstname" class="form-control" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Nom <span class="required">*</span></label>
                    <input type="text" id="booking-lastname" class="form-control" required>
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">Numéro WhatsApp <span class="required">*</span></label>
                <input type="tel" id="booking-phone" class="form-control" placeholder="+221 77 123 45 67" required>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Date souhaitée <span class="required">*</span></label>
                    <input type="date" id="booking-date" class="form-control" min="${todayStr}" onchange="validateBookingDate('${r.id}')" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Heure souhaitée <span class="required">*</span></label>
                    <select id="booking-time" class="form-control" required>
                        ${hourOptionsHtml}
                    </select>
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">Nombre de personnes <span class="required">*</span></label>
                <input type="number" id="booking-guests" class="form-control" min="1" max="20" value="2" required>
            </div>
            
            <div class="form-group">
                <label class="form-label">Demande particulière / Note (Optionnel)</label>
                <textarea id="booking-note" class="form-control" placeholder="Table calme, anniversaire, chaise haute..."></textarea>
            </div>
            
            <button type="submit" class="btn btn-primary btn-block">
                Réserver ma table 📅
            </button>
        </form>
    `;
}

function validateBookingDate(restaurantId) {
    const input = document.getElementById('booking-date');
    const selectedDate = new Date(input.value);
    
    // getDay returns 0=Sunday, 1=Monday... 6=Saturday
    let day = selectedDate.getDay();
    if (day === 0) day = 7; // Map Sunday to 7
    
    const r = store.getRestaurantById(restaurantId);
    
    if (r.closedDays.includes(day)) {
        showToast(`Désolé, le restaurant est fermé le ${getDayName(day)}. Veuillez choisir une autre date.`, "danger");
        input.value = '';
    }
}

function submitBooking(e, restaurantId) {
    e.preventDefault();
    
    const r = store.getRestaurantById(restaurantId);
    
    const firstname = document.getElementById('booking-firstname').value.trim();
    const lastname = document.getElementById('booking-lastname').value.trim();
    const phone = cleanPhoneNumber(document.getElementById('booking-phone').value.trim());
    const date = document.getElementById('booking-date').value;
    const time = document.getElementById('booking-time').value;
    const guests = document.getElementById('booking-guests').value;
    const note = document.getElementById('booking-note').value.trim();
    
    if (!/^\+221(70|75|76|77|78)\d{7}$/.test(phone.replace(/\s+/g, ''))) {
        showToast("Numéro de téléphone sénégalais invalide (ex: +221 77 XXX XX XX)", "danger");
        return;
    }
    
    const bookingId = "RES-" + Math.floor(1000 + Math.random() * 9000);
    
    const res = {
        id: bookingId,
        restaurantId: r.id,
        customerName: `${firstname} ${lastname}`,
        customerPhone: phone,
        date,
        time,
        guests: parseInt(guests),
        note,
        status: "En attente"
    };

    store.addReservation(res);
    
    // Format WhatsApp message
    const formattedDate = new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const waText = `Bonjour ${r.name}, je souhaite réserver une table pour *${guests} personnes* le *${formattedDate}* à *${time}* au nom de *${firstname} ${lastname}* (${phone}).
${note ? `📝 *Note particulière* : ${note}` : ''}
 
Merci de me confirmer la disponibilité !`;

    const waLink = `https://wa.me/${r.whatsapp.replace(/\+/g, '')}?text=${encodeURIComponent(waText)}`;
    const smsLink = getSMSLink(r.whatsapp, waText);

    // Show confirmation
    const isOffline = !navigator.onLine;
    const waBtnClass = isOffline ? 'btn-secondary' : 'btn-success';
    const smsBtnClass = isOffline ? 'btn-success' : 'btn-secondary';
    
    const connectionAlert = isOffline 
        ? `<div style="background: rgba(220, 53, 69, 0.15); color: #ff6b6b; padding: 0.75rem; border-radius: 12px; font-size: 0.85rem; margin-bottom: 1rem; border: 1px solid rgba(220, 53, 69, 0.3); text-align: center; font-weight: 500;">
            🔌 Vous êtes HORS-LIGNE. Veuillez envoyer la demande par SMS classique sécurisé ci-dessous.
           </div>`
        : `<p style="font-size: 0.85rem; color: var(--accent); margin-bottom: 1.5rem;">⚠️ Le restaurant doit valider votre réservation. Envoyez le récapitulatif par WhatsApp pour bloquer votre table immédiatement.</p>`;

    triggerCelebration();

    const container = document.getElementById('booking-content-container');
    container.innerHTML = `
        <div class="confirmation-screen">
            <div class="confirmation-icon">📅✅</div>
            <h2>Réservation Enregistrée !</h2>
            <p style="color: var(--text-secondary); margin: 1rem 0;">Votre demande de réservation n° <strong>${bookingId}</strong> est bien enregistrée.</p>
            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 12px; font-size: 0.9rem; text-align: left; margin: 1.5rem 0;">
                Nom : ${firstname} ${lastname}<br>
                Date & Heure : ${formattedDate} à ${time}<br>
                Couverts : <strong>${guests} personnes</strong>
            </div>
            ${connectionAlert}
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                <a href="${waLink}" target="_blank" class="btn ${waBtnClass}">
                    💬 Confirmer par WhatsApp
                </a>
                <a href="${smsLink}" class="btn ${smsBtnClass}">
                    📱 Option Secours : Envoyer par SMS classique
                </a>
                <button class="btn btn-dark" onclick="router.navigate('/')">
                    Retourner à l'accueil
                </button>
            </div>
        </div>
    `;
    
    showToast("Réservation enregistrée !", "success");
}

// 5. Reviews Panel
function renderReviewsTab(r) {
    const container = document.getElementById('reviews-content-container');
    
    // Calculate stats
    let totalScore = r.reviews.reduce((sum, rev) => sum + rev.rating, 0);
    let avg = r.reviews.length > 0 ? (totalScore / r.reviews.length).toFixed(1) : "0.0";
    
    let listHtml = '';
    
    if (r.reviews.length === 0) {
        listHtml = `<div style="text-align: center; color: var(--text-secondary); padding: 2rem 0;">Aucun avis pour l'instant. Soyez le premier !</div>`;
    } else {
        r.reviews.forEach(rev => {
            const stars = '★'.repeat(rev.rating) + '☆'.repeat(5 - rev.rating);
            const replyBlock = rev.reply 
                ? `<div class="review-reply"><div class="review-reply-author">Réponse de ${r.name}</div>${rev.reply}</div>` 
                : '';
                
            listHtml += `
                <div class="review-item">
                    <div class="review-header">
                        <div>
                            <span class="review-author">${rev.author}</span>
                            <div class="stars-rating" style="display:block; font-size: 0.8rem;">${stars}</div>
                        </div>
                        <span class="review-date">${rev.date}</span>
                    </div>
                    <p class="review-comment">${rev.comment}</p>
                    ${replyBlock}
                </div>
            `;
        });
    }

    container.innerHTML = `
        <div class="reviews-summary">
            <div class="rating-big-box">
                <div class="rating-big-num">${avg}</div>
                <div class="stars-rating" style="font-size: 0.9rem;">${'★'.repeat(Math.round(avg))}${'☆'.repeat(5 - Math.round(avg))}</div>
                <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">${r.reviews.length} avis</div>
            </div>
            <div style="flex-grow: 1;">
                <p style="font-size: 0.85rem; color: var(--text-secondary);">
                    Les avis proviennent de clients ayant commandé sur notre plateforme. Ils alimentent directement la note du restaurant.
                </p>
            </div>
        </div>

        <h3 style="font-size: 1.1rem; margin-bottom: 1rem;">Laisser un avis</h3>
        <form id="review-form" onsubmit="submitReview(event, '${r.id}')" style="background: var(--bg-card); padding: 1.25rem; border-radius: 16px; border: 1px solid var(--border); margin-bottom: 2rem;">
            <div class="form-group">
                <label class="form-label">Note</label>
                <div class="stars-selector" id="stars-selector-container">
                    <span onclick="setStarsSelector(1)">★</span>
                    <span onclick="setStarsSelector(2)">★</span>
                    <span onclick="setStarsSelector(3)">★</span>
                    <span onclick="setStarsSelector(4)">★</span>
                    <span onclick="setStarsSelector(5)">★</span>
                </div>
                <input type="hidden" id="review-rating-val" value="5">
            </div>
            
            <div class="form-group">
                <label class="form-label">Votre Nom <span class="required">*</span></label>
                <input type="text" id="review-author-name" class="form-control" placeholder="Seydou Kane" required>
            </div>
            
            <div class="form-group">
                <label class="form-label">Commentaire <span class="required">*</span></label>
                <textarea id="review-comment-text" class="form-control" placeholder="Racontez votre expérience..." required></textarea>
            </div>
            
            <button type="submit" class="btn btn-secondary btn-sm">Publier l'avis</button>
        </form>

        <h3 style="font-size: 1.1rem; margin-bottom: 1rem;">Tous les avis</h3>
        <div class="reviews-list">
            ${listHtml}
        </div>
    `;
    
    // Trigger default star highlights
    setStarsSelector(5);
}

let currentSelectedRating = 5;
function setStarsSelector(num) {
    currentSelectedRating = num;
    const input = document.getElementById('review-rating-val');
    if (input) input.value = num;
    
    const stars = document.querySelectorAll('#stars-selector-container span');
    stars.forEach((s, idx) => {
        if (idx < num) {
            s.classList.add('active');
        } else {
            s.classList.remove('active');
        }
    });
}

function submitReview(e, restaurantId) {
    e.preventDefault();
    
    const r = store.getRestaurantById(restaurantId);
    
    const name = document.getElementById('review-author-name').value.trim();
    const comment = document.getElementById('review-comment-text').value.trim();
    const rating = parseInt(document.getElementById('review-rating-val').value);
    
    const date = new Date().toISOString().split('T')[0];
    
    const newRev = {
        id: `rev_${r.id}_${Date.now()}`,
        author: name,
        rating,
        comment,
        date,
        reply: null
    };
    
    // Add review
    r.reviews.unshift(newRev);
    
    // Recalculate average rating & counts
    let totalScore = r.reviews.reduce((sum, rev) => sum + rev.rating, 0);
    r.rating = totalScore / r.reviews.length;
    r.reviewsCount = r.reviews.length;
    
    store.updateRestaurant(r.id, { 
        reviews: r.reviews,
        rating: r.rating,
        reviewsCount: r.reviewsCount
    });

    showToast("Merci pour votre avis !", "success");
    
    // Re-render restaurant view on reviews tab
    renderRestaurantView(r, 'reviews');
}

// ----------------------------------------------------
// Page: RESTAURANT AUTH (Login uniquement)
// ----------------------------------------------------
router.add('#/politique-client', () => {
    document.getElementById('floating-cart-bar').style.display = 'none';
    stopOrderPolling();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('main-content').innerHTML = `
        <section class="policy-page-container" style="max-width: 800px; margin: 3rem auto; padding: 2.5rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: 28px; box-shadow: var(--shadow);">
            <div style="margin-bottom: 2rem; border-bottom: 1px solid var(--border); padding-bottom: 1.5rem;">
                <span class="study-title-tag">⚖️ Mentions Légales</span>
                <h1 style="font-family: var(--font-serif); font-size: 2rem; color: #fff; margin-top: 0.5rem; margin-bottom: 0.25rem;">Politique d'utilisation — Espace Client</h1>
                <p style="color: var(--text-secondary); font-size: 0.9rem; font-style: italic;">Cette politique s'applique à toute personne utilisant la plateforme Thiès Resto pour consulter un menu, passer une commande, participer à une commande de groupe, réserver une table ou laisser un avis.</p>
            </div>
            
            <div class="policy-content" style="color: var(--text-secondary); line-height: 1.7; font-size: 0.95rem;">
                <h3 style="color: #fff; font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">1. Aucun compte requis</h3>
                <p>Thiès Resto ne demande jamais la création d'un compte ni d'identifiants pour commander, réserver ou participer à une commande de groupe. Vous fournissez uniquement les informations nécessaires au traitement de votre demande : nom, prénom, et numéro de téléphone.</p>

                <h3 style="color: #fff; font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">2. Informations que vous transmettez</h3>
                <p>Lorsque vous passez une commande, réservez une table, ou laissez un avis, vous transmettez au restaurant concerné :</p>
                <ul style="margin-left: 1.5rem; margin-bottom: 1rem; list-style-type: disc;">
                    <li>Votre nom et prénom</li>
                    <li>Votre numéro de téléphone (utilisé pour vous contacter sur WhatsApp au sujet de votre commande ou réservation)</li>
                    <li>Le détail de votre commande, votre mode de récupération choisi, et toute note ou demande particulière que vous indiquez</li>
                    <li>Pour une réservation : la date, l'heure et le nombre de personnes souhaité</li>
                </ul>
                <p>Ces informations sont transmises uniquement au restaurant concerné. Thiès Resto ne les revend à aucun tiers et ne les utilise pas à des fins publicitaires.</p>

                <h3 style="color: #fff; font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">3. Commande de groupe</h3>
                <p>Si vous participez à une commande de groupe créée par une autre personne, votre prénom et le plat que vous choisissez sont visibles par les autres participants au sein de cette commande de groupe, ainsi que par le restaurant au moment de l'envoi de la commande complète.</p>

                <h3 style="color: #fff; font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">4. Exactitude de vos informations</h3>
                <p>Vous êtes responsable de l'exactitude des informations que vous transmettez, notamment votre numéro de téléphone. Un numéro incorrect peut empêcher le restaurant de vous contacter pour confirmer votre commande ou votre réservation.</p>

                <h3 style="color: #fff; font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">5. Paiement</h3>
                <p>Thiès Resto ne collecte aucun paiement en ligne. Le règlement de votre commande se fait directement auprès du restaurant, en espèces, à la livraison ou sur place, selon le mode que vous avez choisi. Thiès Resto n'intervient à aucune étape de cette transaction financière.</p>

                <h3 style="color: #fff; font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">6. Avis clients</h3>
                <p>Si vous laissez un avis (note et commentaire) après une commande ou une réservation, celui-ci est rendu public sur la page du restaurant concerné. Le restaurant peut y répondre publiquement. Vous vous engagez à rédiger un avis sincère et respectueux. Thiès Resto se réserve le droit de masquer un avis manifestement abusif, injurieux ou sans rapport avec une expérience réelle.</p>

                <h3 style="color: #fff; font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">7. Statut et disponibilité du restaurant</h3>
                <p>Les informations affichées (statut Ouvert/Fermé, menu du jour, créneaux de réservation disponibles) sont saisies et mises à jour par le restaurant lui-même. Thiès Resto ne garantit pas en temps réel l'exactitude absolue de ces informations en cas de retard de mise à jour par le restaurant. En cas de doute, le bouton de confirmation WhatsApp vous permet de vérifier directement auprès du restaurant.</p>

                <h3 style="color: #fff; font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">8. Confirmation par WhatsApp</h3>
                <p>Après l'envoi d'une commande ou d'une réservation, un bouton vous permet d'envoyer également un message de confirmation directement au restaurant via WhatsApp. Cette étape est facultative mais recommandée, notamment en cas de connexion internet instable, pour vous assurer que votre demande a bien été reçue.</p>

                <h3 style="color: #fff; font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">9. Programme de fidélité</h3>
                <p>Si le restaurant propose un programme de fidélité, vos points sont associés à votre numéro de téléphone et cumulés automatiquement à chaque commande validée. Aucune carte physique ni application n'est nécessaire. Les conditions exactes du programme (seuil de récompense, type de récompense) sont définies librement par chaque restaurant.</p>

                <h3 style="color: #fff; font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">10. Responsabilité</h3>
                <p>Thiès Resto met en relation le client et le restaurant mais n'est pas partie à la transaction commerciale elle-même (préparation du repas, qualité du service, respect des horaires annoncés). Toute réclamation relative au déroulement d'une commande ou d'une réservation doit être adressée directement au restaurant concerné.</p>

                <h3 style="color: #fff; font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">11. Évolutions de cette politique</h3>
                <p>Cette politique peut évoluer à mesure que de nouvelles fonctionnalités sont ajoutées à la plateforme. La version la plus récente est toujours disponible sur cette page.</p>

                <hr style="border: 0; border-top: 1px solid var(--border); margin: 2rem 0;">
                <p style="font-size: 0.85rem; font-style: italic; text-align: center;">Dernière mise à jour : juin 2026</p>
            </div>
            <div style="text-align: center; margin-top: 2rem;">
                <button class="btn btn-primary" onclick="router.navigate('/')">Retour à l'accueil</button>
            </div>
        </section>
    `;
});

// ----------------------------------------------------
// Page: POLITIQUE ADMIN
// ----------------------------------------------------
router.add('#/politique-admin', () => {
    document.getElementById('floating-cart-bar').style.display = 'none';
    stopOrderPolling();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('main-content').innerHTML = `
        <section class="policy-page-container" style="max-width: 800px; margin: 3rem auto; padding: 2.5rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: 28px; box-shadow: var(--shadow);">
            <div style="margin-bottom: 2rem; border-bottom: 1px solid var(--border); padding-bottom: 1.5rem;">
                <span class="study-title-tag">⚖️ Charte Resto</span>
                <h1 style="font-family: var(--font-serif); font-size: 2rem; color: #fff; margin-top: 0.5rem; margin-bottom: 0.25rem;">Politique d'utilisation — Espace Administrateur</h1>
                <p style="color: var(--text-secondary); font-size: 0.9rem; font-style: italic;">Cette politique s'applique au restaurant utilisant son tableau de bord Thiès Resto pour gérer son menu, ses commandes, ses réservations et ses avis clients.</p>
            </div>
            
            <div class="policy-content" style="color: var(--text-secondary); line-height: 1.7; font-size: 0.95rem;">
                <h3 style="color: #fff; font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">1. Accès et compte</h3>
                <p>L'accès au tableau de bord administrateur est protégé par un identifiant et un mot de passe propres à votre restaurant. Vous êtes responsable de la confidentialité de ces identifiants. Ne les partagez qu'avec les membres de votre équipe autorisés à gérer les commandes et le menu.</p>
                <p>En cas de doute sur une utilisation non autorisée de votre compte, changez votre mot de passe immédiatement depuis l'onglet Paramètres.</p>

                <h3 style="color: #fff; font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">2. Exactitude des informations publiées</h3>
                <p>Vous vous engagez à maintenir à jour les informations suivantes, visibles publiquement par vos clients :</p>
                <ul style="margin-left: 1.5rem; margin-bottom: 1rem; list-style-type: disc;">
                    <li>Le statut Ouvert / Fermé de votre restaurant, reflété en temps réel</li>
                    <li>Le menu du jour : plats disponibles, prix en FCFA, descriptions</li>
                    <li>Les horaires d'ouverture et les créneaux de réservation proposés</li>
                    <li>Vos coordonnées de contact (numéro WhatsApp, adresse)</li>
                </ul>
                <p>Une information erronée (plat indisponible affiché comme disponible, statut « Ouvert » alors que le restaurant est fermé) peut entraîner une mauvaise expérience client et nuire à votre réputation. Il est de votre responsabilité de garder ces données exactes.</p>

                <h3 style="color: #fff; font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">3. Traitement des commandes et réservations</h3>
                <p>Chaque commande ou réservation reçue déclenche une notification immédiate sur votre tableau de bord et une option d'envoi WhatsApp. Vous vous engagez à :</p>
                <ul style="margin-left: 1.5rem; margin-bottom: 1rem; list-style-type: disc;">
                    <li>Traiter les commandes en attente dans un délai raisonnable</li>
                    <li>Mettre à jour le statut de chaque commande (Confirmée, Prête, Livrée) afin que le client soit informé automatiquement</li>
                    <li>Confirmer ou annuler les réservations de table dans un délai raisonnable avant la date prévue</li>
                    <li>Ne pas annuler une commande ou une réservation déjà confirmée sans en informer le client par WhatsApp</li>
                </ul>

                <h3 style="color: #fff; font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">4. Gestion des avis clients</h3>
                <p>Les avis laissés par les clients sur votre page sont publics et ne peuvent pas être supprimés by the restaurant. Vous disposez d'un droit de réponse publique à chaque avis depuis votre tableau de bord. Les réponses doivent rester professionnelles et respectueuses, y compris face à un avis négatif ou injuste.</p>

                <h3 style="color: #fff; font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">5. Paiement</h3>
                <p>Thiès Resto ne traite aucun paiement en ligne. Toutes les transactions financières (espèces ou tout autre moyen que vous acceptez) se déroulent directement entre vous et le client, à la livraison ou sur place. Thiès Resto n'intervient à aucun moment dans cette transaction et n'en est pas responsable.</p>

                <h3 style="color: #fff; font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">6. Données collectées sur vos clients</h3>
                <p>Dans le cadre de l'utilisation de la plateforme, vous avez accès aux informations suivantes transmises par vos clients : nom, prénom, numéro de téléphone, contenu de leur commande ou réservation. Ces informations doivent être utilisées uniquement dans le cadre du service que vous proposez (traitement de la commande, organisation de la réservation, programme de fidélité) et ne doivent pas être réutilisées à d'autres fins, notamment commerciales, sans le consentement du client.</p>

                <h3 style="color: #fff; font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">7. Disponibilité du service</h3>
                <p>Thiès Resto met tout en œuvre pour assurer la disponibilité continue du tableau de bord et de la page client. En cas de panne, de maintenance ou d'interruption de service, le restaurant en sera informé dans la mesure du possible. Thiès Resto ne peut être tenu responsable des pertes de commandes liées à une interruption de connexion internet ou de réseau mobile, locale au restaurant ou au client.</p>

                <h3 style="color: #fff; font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">8. Modification ou suspension du compte</h3>
                <p>Le restaurant peut demander la suspension ou la fermeture de son espace à tout moment. Thiès Resto se réserve le droit de suspendre un compte en cas de non-respect manifeste de cette politique, notamment en cas d'informations délibérément trompeuses publiées sur la page client.</p>

                <h3 style="color: #fff; font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">9. Évolutions de cette politique</h3>
                <p>Cette politique peut être amenée à évoluer à mesure que de nouvelles fonctionnalités sont ajoutées à la plateforme. Le restaurant sera informé de toute modification significative.</p>

                <hr style="border: 0; border-top: 1px solid var(--border); margin: 2rem 0;">
                <p style="font-size: 0.85rem; font-style: italic; text-align: center;">Dernière mise à jour : juin 2026</p>
            </div>
            <div style="text-align: center; margin-top: 2rem;">
                <button class="btn btn-primary" onclick="router.navigate('/')">Retour à l'accueil</button>
            </div>
        </section>
    `;
});

// ----------------------------------------------------
// 404 View
// ----------------------------------------------------
router.add('#/404', () => {
    document.getElementById('main-content').innerHTML = `
        <div style="text-align: center; padding: 5rem 1.5rem;">
            <h2>Page Non Trouvée (404)</h2>
            <p style="color: var(--text-secondary); margin: 1rem 0;">La page demandée n'existe pas.</p>
            <button class="btn btn-primary" onclick="router.navigate('/')">Retour à l'accueil</button>
        </div>
    `;
});

// ----------------------------------------------------
// PWA Service Worker Registration
// ----------------------------------------------------
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker registered successfully.', reg.scope))
            .catch(err => console.log('Service Worker registration failed:', err));
    });
}

// Global Connection State Listeners
window.addEventListener('offline', () => {
    showToast("🔌 Vous êtes hors-ligne. Vous pouvez toujours commander via l'option SMS classique !", "warning");
});
window.addEventListener('online', () => {
    showToast("📶 Connexion Internet rétablie. Thiès à Table est de nouveau connecté au réseau.", "success");
});

// SMS Link Helper
window.getSMSLink = function(phone, body) {
    const cleanPhone = phone.replace(/\+/g, '').trim();
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const separator = isIOS ? '&' : '?';
    return `sms:${cleanPhone}${separator}body=${encodeURIComponent(body)}`;
};

// CGV Route & Render
router.on('/cgv', () => renderCGV());
function renderCGV() {
    hideLoadingOverlay();
    const container = document.getElementById('main-content');
    container.innerHTML = `
        <div style="max-width: 800px; margin: 4rem auto; padding: 2rem; background: var(--bg-card); border-radius: 20px; border: 1px solid rgba(255,255,255,0.05);">
            <h1 style="color: var(--primary); margin-bottom: 2rem; font-family: var(--font-serif);">Conditions Générales de Vente (CGV) & Mentions Légales</h1>
            <div style="color: var(--text-secondary); line-height: 1.6;">
                <h3>1. Présentation de la plateforme</h3>
                <p>THIES Resto est un portail de mise en relation entre les clients et les restaurants partenaires basés à Thiès, Sénégal.</p>
                
                <h3>2. Responsabilités</h3>
                <p>THIES Resto agit exclusivement en tant qu'intermédiaire technique. Les restaurants partenaires sont seuls responsables de la qualité, l'hygiène et la livraison des repas. <strong>En cas de problème d'intoxication ou d'hygiène, le client doit se retourner directement contre le restaurant concerné.</strong> THIES Resto décline toute responsabilité quant aux conséquences liées à la consommation des produits.</p>
                
                <h3>3. Commandes et Paiements</h3>
                <p>Le paiement s'effectue exclusivement à la livraison ou selon les modalités convenues avec le restaurant via WhatsApp. Les prix affichés incluent les taxes applicables.</p>
                
                <h3>4. Données Personnelles (RGPD / CDP Sénégal)</h3>
                <p>Les données (numéro de téléphone, prénom) sont collectées uniquement pour le traitement de la commande et le programme de fidélité. Elles ne sont pas revendues à des tiers et sont protégées conformément à la loi sur les données personnelles.</p>
            </div>
            <button class="btn btn-primary" style="margin-top: 2rem;" onclick="router.navigate('/')">Retour à l'accueil</button>
        </div>
    `;
}

// ----------------------------------------------------
// CSV Export & Charts
// ----------------------------------------------------
window.exportOrdersCSV = function(restaurantId) {
    const orders = store.getOrdersByRestaurant(restaurantId);
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Date,Heure,Client,Telephone,Mode,Montant,Statut\n";
    
    orders.forEach(function(o) {
        let row = [
            o.id,
            o.date,
            o.time || '',
            o.customerName ? o.customerName.replace(/,/g, '') : '',
            o.customerPhone,
            o.mode,
            o.total,
            o.status
        ].join(",");
        csvContent += row + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "commandes_" + new Date().toISOString().split('T')[0] + ".csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

window.revenueChartInstance = null;
window.renderRevenueChart = function(orders) {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    
    const last7Days = Array.from({length: 7}, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
    });
    
    const revenueByDay = {};
    last7Days.forEach(d => revenueByDay[d] = 0);
    
    orders.forEach(o => {
        if (o.status === 'Livrée' && revenueByDay[o.date] !== undefined) {
            revenueByDay[o.date] += o.total;
        }
    });
    
    if (window.revenueChartInstance) {
        window.revenueChartInstance.destroy();
    }
    
    if(typeof Chart !== 'undefined') {
        window.revenueChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: last7Days,
                datasets: [{
                    label: "Chiffre d'Affaires (FCFA)",
                    data: Object.values(revenueByDay),
                    borderColor: '#cfa853',
                    backgroundColor: 'rgba(207, 168, 83, 0.2)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#fff' } }
                },
                scales: {
                    x: { ticks: { color: 'rgba(255,255,255,0.7)' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                    y: { ticks: { color: 'rgba(255,255,255,0.7)' }, grid: { color: 'rgba(255,255,255,0.1)' }, beginAtZero: true }
                }
            }
        });
    }
};

// ----------------------------------------------------
// Realtime & Push Notifications
// ----------------------------------------------------
window.requestNotificationPermission = function() {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
    }
};

window.setupRealtimeSubscriptions = function() {
    if (!supabaseClient || !currentRestaurantSession || !currentRestaurantSession.id) return;
    if (window.currentRealtimeSubscription) return; // Already setup
    
    window.currentRealtimeSubscription = supabaseClient.channel('custom-insert-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders', filter: `restaurant_id=eq.${currentRestaurantSession.id}` },
        (payload) => {
          console.log('New order via Realtime!', payload);
          const newOrder = {
              id: payload.new.id,
              restaurantId: payload.new.restaurant_id,
              customerName: payload.new.customer_name,
              customerPhone: payload.new.customer_phone,
              mode: payload.new.mode,
              address: payload.new.address,
              items: typeof payload.new.items === 'string' ? JSON.parse(payload.new.items) : payload.new.items,
              total: Number(payload.new.total),
              note: payload.new.note,
              status: payload.new.status,
              date: payload.new.date,
              time: payload.new.time
          };
          
          if (!store.data.orders.find(o => o.id === newOrder.id)) {
              store.data.orders.unshift(newOrder);
              store.save();
              
              if ('Notification' in window && Notification.permission === 'granted') {
                  navigator.serviceWorker.ready.then(reg => {
                      reg.showNotification('🔔 Nouvelle Commande!', {
                          body: `${newOrder.customerName} a commandé pour ${newOrder.total} FCFA.`,
                          icon: '/icon.png',
                          vibrate: [200, 100, 200]
                      });
                  });
              } else {
                  showToast(`🔔 Nouvelle commande de ${newOrder.total} FCFA!`, "success");
              }
              
              if (window.location.hash === '#/dashboard') {
                  const r = store.getRestaurantById(currentRestaurantSession.id);
                  if (r) renderDashboardTabContent(r);
              }
          }
        }
      )
      .subscribe();
};

// Hook into login to start realtime
const originalHandleRestaurantLogin = window.handleRestaurantLogin;
if (originalHandleRestaurantLogin) {
    window.handleRestaurantLogin = async function(event) {
        await originalHandleRestaurantLogin(event);
        if (currentRestaurantSession) {
            requestNotificationPermission();
            setupRealtimeSubscriptions();
        }
    };
}

// Submit Customer Review
window.submitCustomerReview = async function(restaurantId, customerName) {
    if (!supabaseClient) {
        showToast("Service temporairement indisponible.", "danger");
        return;
    }
    
    const rating = parseInt(document.getElementById('review-rating').value);
    const comment = document.getElementById('review-comment').value.trim();
    
    document.getElementById('checkout-review-section').innerHTML = `<p style="text-align:center; color: var(--success); padding: 1rem;">Envoi de votre avis...</p>`;
    
    const { error } = await supabaseClient.rpc('submit_restaurant_review', {
        p_restaurant_id: restaurantId,
        p_customer_name: customerName || 'Client Anonyme',
        p_rating: rating,
        p_comment: comment
    });
    
    if (error) {
        console.error("Review Error:", error);
        showToast("Erreur lors de l'envoi de l'avis.", "danger");
        document.getElementById('checkout-review-section').innerHTML = `<p style="text-align:center; color: var(--danger); padding: 1rem;">Échec de l'envoi.</p>`;
    } else {
        showToast("Merci pour votre avis !", "success");
        document.getElementById('checkout-review-section').innerHTML = `
            <div style="text-align:center; padding: 2rem;">
                <h3 style="color: var(--success); margin-bottom: 0.5rem;">✅ Avis publié avec succès</h3>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">Votre retour a bien été pris en compte. Merci !</p>
            </div>
        `;
    }
};

// Start application routing
router.resolve();

// ==================== SORTING LOGIC ====================
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                const val = e.target.value;
                if(val === 'rating') {
                    // Trier par note (Meilleure en premier)
                    Store.restaurants.sort((a, b) => b.rating - a.rating);
                } else if(val === 'alpha') {
                    // Trier de A à Z
                    Store.restaurants.sort((a, b) => a.name.localeCompare(b.name));
                } else {
                    // Revenir à l'ordre par défaut (pas de tri spécifique ou ordre ID)
                    // On pourrait recharger depuis SEED_RESTAURANTS pour l'ordre original
                    Store.restaurants = [...SEED_RESTAURANTS];
                }
                
                // Re-render
                if (window.renderCatalogCards) {
                    renderCatalogCards(Store.restaurants);
                } else {
                    renderHome();
                }
            });
        }
    }, 1000);
});

// Auto-refresh data every 20 seconds
setInterval(() => {
    if (typeof store !== 'undefined' && store.syncFromSupabase) {
        // We only want to refresh silently if we're not currently editing something.
        // For clients, it's fine. For admin, maybe skip if typing.
        const activeElem = document.activeElement;
        const isEditing = activeElem && (activeElem.tagName === 'INPUT' || activeElem.tagName === 'TEXTAREA');
        if (!isEditing) {
            store.syncFromSupabase().then(() => {
                if (typeof applyFilters === 'function') {
                    // re-render silently
                    // applyFilters();
                    // We don't want to re-render aggressively because it interrupts scrolling
                    // Just update the status badges if needed
                }
            });
        }
    }
}, 20000);

function updateNav() {
    const navActions = document.getElementById('nav-actions');
    if (!navActions) return;
    
    if (typeof currentRestaurantSession !== 'undefined' && currentRestaurantSession) {
        navActions.innerHTML = `
            <span style="color: var(--text-secondary); font-size: 0.9rem; margin-right: 1rem; display: none;" class="desktop-only">Connecté : ${currentRestaurantSession.name || 'Admin'}</span>
            <button class="btn btn-outline" style="padding: 0.4rem 1rem; font-size: 0.85rem;" onclick="handleLogout()">Déconnexion</button>
        `;
    } else if (typeof isSuperAdminSession !== 'undefined' && isSuperAdminSession) {
        navActions.innerHTML = `
            <button class="btn btn-outline" style="padding: 0.4rem 1rem; font-size: 0.85rem;" onclick="handleLogout()">Déconnexion</button>
        `;
    } else {
        navActions.innerHTML = `
            <button class="btn btn-primary" onclick="router.navigate('/auth')">Connexion Partenaire</button>
        `;
    }
}

function updateDynamicSEO(resto) {
    if (!resto) return;
    document.title = resto.name + " - THIES Resto | Menu & Livraison";
    
    const setMeta = (property, content) => {
        let el = document.querySelector(`meta[property="${property}"]`) || document.querySelector(`meta[name="${property}"]`);
        if (!el) {
            el = document.createElement('meta');
            el.setAttribute(property.startsWith('og:') ? 'property' : 'name', property);
            document.head.appendChild(el);
        }
        el.setAttribute('content', content);
    };

    const desc = `Découvrez le menu de ${resto.name} sur Thiès Resto. Commandez vos plats et réservez votre table facilement.`;
    const image = resto.coverImage || 'https://thiesresto.sn/icon.png';

    setMeta('description', desc);
    setMeta('og:title', resto.name + " - THIES Resto");
    setMeta('og:description', desc);
    setMeta('og:image', image);
    setMeta('twitter:title', resto.name + " - THIES Resto");
    setMeta('twitter:description', desc);
    setMeta('twitter:image', image);
}

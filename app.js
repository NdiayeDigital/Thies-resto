
// Client Behavior Analytics Tracker
class ClientTracker {
    constructor() {
        this.sessionStart = Date.now();
        this.navigationPath = [];
        this.events = [];
        this.initTracking();
    }

    initTracking() {
        // Track initial page
        this.trackPageView(window.location.hash || '/');

        // Intercept router.navigate if it exists
        if (typeof router !== 'undefined' && router.navigate) {
            const originalNavigate = router.navigate;
            router.navigate = (path) => {
                this.trackPageView(path);
                return originalNavigate.call(router, path);
            };
        }
        
        // Track clicks on restaurants
        document.addEventListener('click', (e) => {
            const restoCard = e.target.closest('.restaurant-card');
            if (restoCard) {
                const name = restoCard.querySelector('h3') ? restoCard.querySelector('h3').innerText : 'Restaurant';
                this.logEvent('CLICK_RESTAURANT', name);
            }
        });
    }

    trackPageView(path) {
        const timeSpent = this.navigationPath.length > 0 
            ? Math.round((Date.now() - this.navigationPath[this.navigationPath.length-1].timestamp) / 1000) 
            : 0;
            
        this.navigationPath.push({
            path: path,
            timestamp: Date.now(),
            timeSpentPrevious: timeSpent
        });
    }

    logEvent(eventName, details) {
        this.events.push({
            event: eventName,
            details: details,
            timeSinceStart: Math.round((Date.now() - this.sessionStart) / 1000)
        });
    }

    getBehaviorReport() {
        const totalTimeSeconds = Math.round((Date.now() - this.sessionStart) / 1000);
        const pathStr = this.navigationPath.map(p => p.path).join(' -> ');
        return `Temps total: ${totalTimeSeconds}s. Parcours: ${pathStr}`;
    }
}

// Initialize tracker later when router is defined

// Supabase Configuration
const SUPABASE_URL = 'https://eyrayquciqyswshiwtwb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5cmF5cXVjaXF5c3dzaGl3dHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5MDQyNjQsImV4cCI6MjA5NzQ4MDI2NH0.8_VJvm9xiwmqX3oLD9L1b9W7r7T-b9OfJ2WIyST3FoM';
let supabaseClient = null;

if (typeof supabase !== 'undefined' && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// App Local Database state manager (with Supabase sync)
class Store {
    constructor() {
        this.key = 'THIES_RESTO_DB_V3'; // Bumped version to clear all old local cached orders
        this.data = this.load();
        if (!this.data) {
            this.seed();
        }
        // Background sync with Supabase
        if (supabaseClient) {
            this.syncFromSupabase();
            // Poll for remote database updates every 15 seconds
            setInterval(() => this.syncFromSupabase(), 15000);
        }
    }

    load() {
        try {
            const val = localStorage.getItem(this.key);
            return val ? JSON.parse(val) : null;
        } catch (e) {
            console.error("Failed to load local DB", e);
            return null;
        }
    }

    save() {
        try {
            localStorage.setItem(this.key, JSON.stringify(this.data));
        } catch (e) {
            console.error("Failed to save local DB", e);
        }
    }

    seed() {
        this.data = {
            restaurants: [],
            orders: [],
            reservations: [],
            groupOrders: []
        };
        this.save();
    }

    async syncFromSupabase() {
        if (!supabaseClient) return;
        try {
            console.log("Syncing with Supabase...");

            // 1. Sync Restaurants (Publiques)
            const { data: dbRestos, error: restosError } = await supabaseClient.from('public_restaurants').select('*');
            if (!restosError && dbRestos) {
                if (dbRestos.length === 0) {
                    console.log("Database is empty. Seeding remote database with local restaurant data...");
                    await this.seedRemoteDatabase();
                    return;
                }
                const mappedRestos = dbRestos.map(r => {
                    let parsedMenu = r.menu;
                    try { if (typeof r.menu === 'string') parsedMenu = JSON.parse(r.menu); } catch(e) {}
                    let parsedReviews = r.reviews;
                    try { if (typeof r.reviews === 'string') parsedReviews = JSON.parse(r.reviews); } catch(e) {}
                    
                    return {
                        id: r.id,
                        name: r.name,
                        slug: r.slug,
                        rating: Number(r.rating),
                        reviewsCount: Number(r.reviews_count),
                        category: r.category,
                        address: r.address,
                        whatsapp: r.whatsapp,
                        openHours: r.open_hours,
                        closedDays: Array.isArray(r.closed_days) ? r.closed_days : (r.closed_days ? JSON.parse(r.closed_days) : []),
                        isOpenManual: Boolean(r.is_open_manual),
                        coverImage: (r.cover_image && r.cover_image !== 'null' && r.cover_image !== 'undefined') ? r.cover_image : null,
                        menu: Array.isArray(parsedMenu) ? parsedMenu : null,
                        reviews: Array.isArray(parsedReviews) ? parsedReviews : []
                    };
                });
                
                // Merge locally saved credentials for normal operation if not fetched (public_restaurants hides them)
                const mergedRestos = mappedRestos.map(dbR => {
                    const localR = this.data.restaurants.find(lr => lr.id === dbR.id);
                    if (localR) {
                        const baseName = dbR.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                        return {
                            ...dbR,
                            menu: (dbR.menu && dbR.menu.length > 0) ? dbR.menu : localR.menu,
                            coverImage: dbR.coverImage || localR.coverImage,
                            username: localR.username || ('id_' + baseName),
                            password: localR.password || (baseName + '221'),
                            status: localR.status || dbR.status || 'active',
                            subscriptionPack: localR.subscriptionPack || 'Aucun (Gratuit)',
                            createdAt: localR.createdAt || '2026-06-25T00:00:00Z'
                        };
                    }
                    const baseName = dbR.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                    return {
                        ...dbR,
                        menu: dbR.menu || [],
                        username: 'id_' + baseName,
                        password: baseName + '221',
                        status: dbR.status || 'active',
                        subscriptionPack: 'Aucun (Gratuit)',
                        createdAt: dbR.created_at || '2026-06-25T00:00:00Z'
                    };
                });

                this.data.restaurants = mergedRestos;
            }

            // 2. Fetch admin data or restaurant specific data
            if (typeof currentRestaurantSession !== 'undefined' && currentRestaurantSession && currentRestaurantSession.password) {
                // Fetch only for this restaurant via RPC
                const { data: myOrders, error: ordersError } = await supabaseClient.rpc('get_restaurant_orders', {
                    p_restaurant_id: currentRestaurantSession.id,
                    p_password: currentRestaurantSession.password
                });
                if (!ordersError && myOrders) {
                    const mappedOrders = myOrders.map(o => ({
                        id: o.id,
                        restaurantId: o.restaurant_id,
                        customerName: o.customer_name,
                        customerPhone: o.customer_phone,
                        mode: o.mode,
                        address: o.address,
                        items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items,
                        total: Number(o.total),
                        note: o.note,
                        status: o.status,
                        date: o.date,
                        time: o.time
                    }));
                    this.data.orders = mappedOrders.sort((a,b) => b.id.localeCompare(a.id));
                }
                
                const { data: myRes, error: resError } = await supabaseClient.rpc('get_restaurant_reservations', {
                    p_restaurant_id: currentRestaurantSession.id,
                    p_password: currentRestaurantSession.password
                });
                if (!resError && myRes) {
                    const mappedReservations = myRes.map(r => ({
                        id: r.id,
                        restaurantId: r.restaurant_id,
                        customerName: r.customer_name,
                        customerPhone: r.customer_phone,
                        date: r.date,
                        time: r.time,
                        guests: Number(r.guests),
                        note: r.note,
                        status: r.status
                    }));
                    this.data.reservations = mappedReservations.sort((a,b) => b.id.localeCompare(a.id));
                }
            }

            this.save();
            console.log("Supabase synchronization completed successfully.");
            if (typeof hideLoadingOverlay === 'function') hideLoadingOverlay();
            if (typeof applyFilters === 'function') {
                applyFilters();
            }
        } catch (e) {
            console.error("Supabase sync failed", e);
        }
    }

    async seedRemoteDatabase() {
        if (!supabaseClient) return;
        try {
            let localRestos = this.data.restaurants;
            if (!localRestos || localRestos.length === 0) {
                this.seed();
                localRestos = this.data.restaurants;
            }

            const list = localRestos.map(r => {
                let baseName = r.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                let username = 'id_' + baseName;
                let password = baseName + '221';
                
                return {
                    id: r.id,
                    name: r.name,
                    slug: r.slug,
                    rating: r.rating || 4.0,
                    reviews_count: r.reviewsCount || 0,
                    category: r.category,
                    address: r.address || '',
                    whatsapp: r.whatsapp || '',
                    open_hours: r.openHours || '08:00 - 22:00',
                    closed_days: r.closedDays || [],
                    is_open_manual: r.isOpenManual !== undefined ? r.isOpenManual : true,
                    status: 'active',
                    username: username,
                    password: password,
                    cover_image: r.coverImage || '',
                    menu: r.menu || [],
                    reviews: r.reviews || []
                };
            });

            const { error } = await supabaseClient.from('restaurants').insert(list);
            if (error) {
                console.error("Error seeding remote database:", error);
            } else {
                console.log("Successfully seeded remote database!");
                await this.syncFromSupabase();
            }
        } catch (e) {
            console.error("Failed to seed remote database:", e);
        }
    }

    async pushRestaurantToSupabase(resto) {
        if (!supabaseClient) return;
        try {
            const { error } = await supabaseClient.from('restaurants').insert({
                id: resto.id,
                name: resto.name,
                slug: resto.slug,
                rating: resto.rating,
                reviews_count: resto.reviewsCount,
                category: resto.category,
                address: resto.address,
                whatsapp: resto.whatsapp,
                open_hours: resto.openHours,
                closed_days: resto.closedDays,
                is_open_manual: resto.isOpenManual,
                status: resto.status,
                username: resto.username,
                password: resto.password,
                cover_image: resto.coverImage,
                menu: resto.menu,
                reviews: resto.reviews,
                subscription_pack: resto.subscriptionPack || 'Aucun (Gratuit)'
            });

            if (error && error.code === '23505') {
                if (isSuperAdminSession) {
                    const adminPass = sessionStorage.getItem('admin_password') || '';
                    await supabaseClient.rpc('admin_update_restaurant', {
                        p_admin_password: adminPass,
                        p_restaurant_id: resto.id,
                        p_updates: {
                            name: resto.name,
                            status: resto.status,
                            username: resto.username,
                            password: resto.password,
                            subscription_pack: resto.subscriptionPack || 'Aucun (Gratuit)'
                        }
                    });
                } else if (typeof currentRestaurantSession !== 'undefined' && currentRestaurantSession && currentRestaurantSession.id === resto.id) {
                    await supabaseClient.rpc('update_restaurant_data', {
                        p_restaurant_id: resto.id,
                        p_password: currentRestaurantSession.password,
                        p_updates: {
                            name: resto.name,
                            address: resto.address,
                            whatsapp: resto.whatsapp,
                            open_hours: resto.openHours,
                            closed_days: resto.closedDays,
                            is_open_manual: resto.isOpenManual,
                            cover_image: resto.coverImage,
                            menu: resto.menu,
                            reviews: resto.reviews
                        }
                    });
                }
            }
        } catch (e) {
            console.error("Failed to push restaurant to Supabase", e);
        }
    }

    async deleteRestaurantFromSupabase(id) {
        if (!supabaseClient) return;
        try {
            if (isSuperAdminSession) {
                const adminPass = sessionStorage.getItem('admin_password') || '';
                await supabaseClient.rpc('admin_delete_restaurant', {
                    p_admin_password: adminPass,
                    p_restaurant_id: id
                });
            } else {
                console.warn("Unauthorized delete attempt on Supabase");
            }
        } catch (e) {
            console.error("Failed to delete restaurant from Supabase", e);
        }
    }

    async pushOrderToSupabase(order) {
        if (!supabaseClient) return;
        try {
            await supabaseClient.from('orders').insert({
                id: order.id,
                restaurant_id: order.restaurantId,
                customer_name: order.customerName,
                customer_phone: order.customerPhone,
                mode: order.mode,
                address: order.address,
                items: order.items,
                total: order.total,
                note: order.note,
                status: order.status,
                date: order.date,
                time: order.time
            });
        } catch (e) {
            console.error("Failed to push order to Supabase", e);
        }
    }

    async pushReservationToSupabase(res) {
        if (!supabaseClient) return;
        try {
            await supabaseClient.from('reservations').insert({
                id: res.id,
                restaurant_id: res.restaurantId,
                customer_name: res.customerName,
                customer_phone: res.customerPhone,
                date: res.date,
                time: res.time,
                guests: res.guests,
                note: res.note,
                status: res.status
            });
        } catch (e) {
            console.error("Failed to push reservation to Supabase", e);
        }
    }

    async pushCustomerToSupabase(phone, name, usedRewards) {
        if (!supabaseClient) return;
        try {
            await supabaseClient.rpc('upsert_customer_loyalty', {
                p_phone: phone,
                p_name: name,
                p_used_rewards: usedRewards
            });
        } catch (e) {
            console.error("Failed to push customer to Supabase", e);
        }
    }

    applyLoyaltyRewardUsed(phone, name) {
        if (!this.data.usedRewards) {
            this.data.usedRewards = {};
        }
        this.data.usedRewards[phone] = (this.data.usedRewards[phone] || 0) + 1;
        this.save();
        this.pushCustomerToSupabase(phone, name, this.data.usedRewards[phone]);
    }

    
    async saveClientInfo(name, phone) {
        if (!supabaseClient) return;
        try {
            await supabaseClient.rpc('upsert_client', {
                p_name: name,
                p_phone: phone
            });
        } catch (error) {
            console.error('Error saving client info:', error);
        }
    }
    getRestaurants() {
        const currentDate = new Date();
        let changed = false;
        
        this.data.restaurants.forEach(r => {
            // Mock created date if not present. In a real DB, this is the registration date.
            const createdAt = new Date(r.createdAt || '2026-06-26T00:00:00Z');
            const diffTime = Math.abs(currentDate - createdAt);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            // Suspend restaurant if 3 months (90 days) free trial has expired and no paid package is active
            let packSubscribed = r.subscriptionPack || 'Aucun (Gratuit)';
            if (diffDays > 90 && r.status === 'active' && packSubscribed === 'Aucun (Gratuit)') {
                r.status = 'suspended';
                changed = true;
                this.pushRestaurantToSupabase(r);
            }
        });
        
        if (changed) {
            this.save();
        }
        return this.data.restaurants;
    }

    getRestaurantBySlug(slug) {
        return this.data.restaurants.find(r => r.slug === slug);
    }

    getRestaurantById(id) {
        return this.data.restaurants.find(r => r.id === id);
    }

    updateRestaurant(id, fields) {
        const idx = this.data.restaurants.findIndex(r => r.id === id);
        if (idx !== -1) {
            this.data.restaurants[idx] = { ...this.data.restaurants[idx], ...fields };
            this.save();
            this.pushRestaurantToSupabase(this.data.restaurants[idx]);
            return this.data.restaurants[idx];
        }
        return null;
    }

    addRestaurant(resto) {
        this.data.restaurants.push(resto);
        this.save();
        this.pushRestaurantToSupabase(resto);
    }

    deleteRestaurant(id) {
        this.data.restaurants = this.data.restaurants.filter(r => r.id !== id);
        this.save();
        this.deleteRestaurantFromSupabase(id);
    }

    getOrdersByRestaurant(restaurantId) {
        return this.data.orders.filter(o => o.restaurantId === restaurantId);
    }

    addOrder(order) {
        
        if (window.clientTracker) {
            const behaviorStr = window.clientTracker.getBehaviorReport();
            // Append to internal note for admin visibility (not necessarily to WhatsApp to not spam the restaurant)
            order.note = order.note ? order.note + ' | [Analytics: ' + behaviorStr + ']' : '[Analytics: ' + behaviorStr + ']';
        }
        this.data.orders.unshift(order);

        this.save();
        this.pushOrderToSupabase(order);
        
        // Also save customer profile in Supabase
        const usedRewards = (this.data.usedRewards && this.data.usedRewards[order.customerPhone]) || 0;
        this.pushCustomerToSupabase(order.customerPhone, order.customerName, usedRewards);
    }

    async updateOrderStatus(orderId, status) {
        const order = this.data.orders.find(o => o.id === orderId);
        if (order) {
            order.status = status;
            this.save();
            if (supabaseClient && typeof currentRestaurantSession !== 'undefined' && currentRestaurantSession) {
                await supabaseClient.rpc('update_order_status', {
                    p_order_id: orderId,
                    p_restaurant_id: currentRestaurantSession.id,
                    p_password: currentRestaurantSession.password,
                    p_status: status
                });
            } else {
                this.pushOrderToSupabase(order);
            }
        }
    }

    getReservationsByRestaurant(restaurantId) {
        return this.data.reservations.filter(r => r.restaurantId === restaurantId);
    }

    addReservation(res) {
        this.data.reservations.unshift(res);
        this.save();
        this.pushReservationToSupabase(res);
    }

    async updateReservationStatus(resId, status) {
        const res = this.data.reservations.find(r => r.id === resId);
        if (res) {
            res.status = status;
            this.save();
            if (supabaseClient && typeof currentRestaurantSession !== 'undefined' && currentRestaurantSession) {
                await supabaseClient.rpc('update_reservation_status', {
                    p_res_id: resId,
                    p_restaurant_id: currentRestaurantSession.id,
                    p_password: currentRestaurantSession.password,
                    p_status: status
                });
            } else {
                this.pushReservationToSupabase(res);
            }
        }
    }
}

const store = new Store();

// ----------------------------------------------------
// Global Router
// ----------------------------------------------------
class Router {
    constructor() {
        this.routes = {};
        window.addEventListener('hashchange', () => this.resolve());
        window.addEventListener('load', () => this.resolve());
    }

    add(path, handler) {
        this.routes[path] = handler;
    }

    navigate(path) {
        window.location.hash = path;
    }

    resolve() {
        const hash = window.location.hash || '#/';
        
        const container = document.getElementById('main-content');
        if (container) {
            container.classList.remove('page-transition');
            void container.offsetWidth; // Force reflow
            container.classList.add('page-transition');
        }
        
        // Parse params for restaurant view: #/r/la-licorne
        let matched = false;
        
        // Match group route first: #/r/:slug/group/:groupId
        const groupMatch = hash.match(/^#\/r\/([^/]+)\/group\/([^/]+)$/);
        if (groupMatch) {
            const slug = groupMatch[1];
            const groupId = groupMatch[2];
            if (this.routes['#/r/:slug']) {
                this.routes['#/r/:slug'](slug, 'group', groupId);
                matched = true;
            }
        }
        
        if (!matched) {
            const restoMatch = hash.match(/^#\/r\/([^/]+)$/);
            if (restoMatch) {
                const slug = restoMatch[1];
                if (this.routes['#/r/:slug']) {
                    this.routes['#/r/:slug'](slug, 'menu');
                    matched = true;
                }
            }
        }

        if (!matched) {
            const handler = this.routes[hash] || this.routes['#/404'];
            if (handler) {
                handler();
            } else {
                this.navigate('/');
            }
        }
        
        // Refresh Navbar State
        updateNavbar();
    }
}

const router = new Router();

// ----------------------------------------------------
function logoutRestaurant() {
    try {
        sessionStorage.removeItem('resto_session');
    } catch(e) {}
    if (typeof currentRestaurantSession !== 'undefined') currentRestaurantSession = null;
    if (typeof showToast === 'function') showToast('Déconnexion réussie', 'success');
    if (typeof router !== 'undefined') router.navigate('/auth');
}

router.add('#/auth', () => {
    // Hide cart
    document.getElementById('floating-cart-bar').style.display = 'none';
    stopOrderPolling();
    hideLoadingOverlay();
    
    const container = document.getElementById('main-content');
    
    container.innerHTML = `
        <div class="auth-container" style="max-width: 450px; margin: 3rem auto; padding: 2rem; background: var(--bg-card); border-radius: 24px; border: 1px solid var(--border); box-shadow: var(--shadow);">
            <div class="auth-header" style="text-align: center; margin-bottom: 2rem;">
                <span class="auth-logo" style="font-size: 3rem; display: block; margin-bottom: 1rem;">🏪</span>
                <h2 style="font-family: var(--font-serif); font-size: 1.75rem; color: var(--text-primary);">Espace Partenaire</h2>
                <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.5rem;">Connectez-vous à votre tableau de bord restaurant.</p>
            </div>

            <!-- LOGIN FORM -->
            <form id="login-form" onsubmit="handleRestaurantLogin(event)">
                <div class="form-group" style="margin-bottom: 1.25rem;">
                    <label class="form-label">Identifiant unique (slug)</label>
                    <input type="text" id="login-username" class="form-control" placeholder="la-licorne" required>
                </div>
                <div class="form-group" style="margin-bottom: 1.5rem;">
                    <label class="form-label">Mot de passe</label>
                    <input type="password" id="login-password" class="form-control" placeholder="••••••••" required>
                </div>
                <button type="submit" class="btn btn-primary btn-block" style="font-weight: 700; width: 100%;">Se connecter 🔓</button>
            </form>

            <!-- PARTNERSHIP CTA -->
            <div style="text-align: center; margin-top: 1.5rem; border-top: 1px solid var(--border); padding-top: 1.5rem;">
                <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 0.75rem;">Vous souhaitez rejoindre le réseau THIES Resto ?</p>
                <button class="btn btn-secondary btn-block" onclick="router.navigate('/partnership')" style="width: 100%; font-weight: 700;">Demander un Partenariat 🤝</button>
            </div>
        </div>
    `;
});

// ----------------------------------------------------
// Page: DEMANDE DE PARTENARIAT
// ----------------------------------------------------
router.add('#/partnership', () => {
    // Hide cart
    document.getElementById('floating-cart-bar').style.display = 'none';
    stopOrderPolling();
    hideLoadingOverlay();
    
    const container = document.getElementById('main-content');
    
    container.innerHTML = `
        <div class="auth-container" style="max-width: 600px; margin: 3rem auto; padding: 2.5rem; background: var(--bg-card); border-radius: 24px; border: 1px solid var(--border); box-shadow: var(--shadow);">
            <div class="auth-header" style="text-align: center; margin-bottom: 2rem;">
                <span class="auth-logo" style="font-size: 3rem; display: block; margin-bottom: 1rem;">🤝</span>
                <h2 style="font-family: var(--font-serif); font-size: 1.75rem; color: var(--text-primary);">Demande de Partenariat</h2>
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.5rem;">
                    Rejoignez la première plateforme commune de restauration à Thiès. Remplissez les informations de votre établissement ci-dessous.
                </p>
            </div>

            <!-- REGISTRATION FORM -->
            <form id="register-form" onsubmit="handleRestaurantRegister(event)">
                <div class="form-group" style="margin-bottom: 1.25rem;">
                    <label class="form-label">Nom de votre restaurant <span class="required" style="color: var(--accent);">*</span></label>
                    <input type="text" id="reg-name" class="form-control" placeholder="ex: Le Teranga du Rail" required oninput="handleRestaurantNameInput(this.value, 'reg-username', 'reg-password', 'slug-availability-badge')">
                </div>

                <div class="form-group" style="margin-bottom: 1.25rem;">
                    <label class="form-label">Adresse physique à Thiès <span class="required" style="color: var(--accent);">*</span></label>
                    <input type="text" id="reg-address" class="form-control" placeholder="ex: Quartier Escale, Thiès" required>
                </div>

                <div class="form-group" style="margin-bottom: 1.25rem;">
                    <label class="form-label">Catégorie de cuisine <span class="required" style="color: var(--accent);">*</span></label>
                    <select id="reg-category" class="form-control" required style="width: 100%;">
                        <option value="Traditionnel">Traditionnel (Thiéb, Yassa, Mafé)</option>
                        <option value="Grillades / Dibi">Grillades / Dibi (Dibiterie)</option>
                        <option value="Fast Food">Fast Food (Burgers, Chawarmas)</option>
                        <option value="Pâtisserie">Pâtisserie / Petit Déjeuner</option>
                        <option value="Gastronomique">Chic / Gastronomique</option>
                    </select>
                </div>

                <div class="form-group" style="margin-bottom: 1.25rem;">
                    <label class="form-label">Numéro WhatsApp de réception <span class="required" style="color: var(--accent);">*</span></label>
                    <input type="tel" id="reg-whatsapp" class="form-control" placeholder="ex: +221 77 123 45 67" required>
                    <small style="color: var(--text-secondary); font-size: 0.75rem; display: block; margin-top: 0.25rem;">C'est sur ce numéro que vous recevrez les commandes clients.</small>
                </div>

                <div class="form-group" style="margin-bottom: 1.25rem;">
                    <label class="form-label">Photo du Restaurant / Logo (Optionnel)</label>
                    <input type="file" id="reg-image-file" class="form-control" accept="image/*" onchange="handleRegImageUpload(event)" style="padding: 0.35rem; height: auto;">
                    <input type="hidden" id="reg-image-url" value="">
                    <div id="reg-image-preview-container" style="display: none; margin-top: 0.75rem; align-items: center; gap: 0.75rem; background: var(--bg-secondary); padding: 0.5rem; border-radius: 10px; border: 1px solid var(--border);">
                        <img id="reg-image-preview" src="" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
                        <span id="reg-image-upload-status" style="font-size: 0.75rem; color: var(--success); font-weight: 600;">Photo sélectionnée avec succès ! ✅</span>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
                    <div class="form-group">
                        <label class="form-label">Heure d'ouverture <span class="required" style="color: var(--accent);">*</span></label>
                        <input type="time" id="reg-open" class="form-control" value="08:00" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Heure de fermeture <span class="required" style="color: var(--accent);">*</span></label>
                        <input type="time" id="reg-close" class="form-control" value="23:00" required>
                    </div>
                </div>

                <div class="form-group" style="margin-bottom: 1.25rem;">
                    <label class="form-label">Identifiant de connexion souhaité (slug) <span class="required" style="color: var(--accent);">*</span></label>
                    <input type="text" id="reg-username" class="form-control" placeholder="ex: le-teranga-rail" required oninput="checkSlugAvailability()">
                    <small style="color: var(--text-secondary); font-size: 0.75rem; display: block; margin-top: 0.25rem;">Généré automatiquement (modifiable).</small>
                    <div id="slug-availability-badge" style="margin-top: 0.35rem; font-size: 0.8rem; font-weight: 600;"></div>
                </div>

                <div class="form-group" style="margin-bottom: 1.75rem;">
                    <label class="form-label">Mot de passe de connexion <span class="required" style="color: var(--accent);">*</span></label>
                    <input type="password" id="reg-password" class="form-control" placeholder="••••••••" required>
                    <small style="color: var(--text-secondary); font-size: 0.75rem; display: block; margin-top: 0.25rem;">Généré automatiquement par défaut (nom_221, modifiable).</small>
                </div>

                <button type="submit" class="btn btn-primary btn-block" style="font-weight: 700; width: 100%;">Envoyer la demande de partenariat 🚀</button>
            </form>

            <div style="text-align: center; margin-top: 1.5rem; border-top: 1px solid var(--border); padding-top: 1.5rem;">
                <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 0.5rem;">Vous êtes déjà partenaire ?</p>
                <button class="btn btn-secondary btn-block" onclick="router.navigate('/auth')" style="width: 100%;">Se connecter à l'espace membre 🔓</button>
            </div>
        </div>
    `;
});

window.handleRegImageUpload = async function(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!supabaseClient) {
        showToast("Service Storage non disponible", "danger");
        return;
    }

    const previewImg = document.getElementById('reg-image-preview');
    const container = document.getElementById('reg-image-preview-container');
    const statusText = document.getElementById('reg-image-upload-status');
    const urlInput = document.getElementById('reg-image-url');
    const submitBtn = document.querySelector('#register-form button[type="submit"]');

    if (container) container.style.display = 'flex';
    if (previewImg) previewImg.src = URL.createObjectURL(file);
    if (statusText) {
        statusText.innerHTML = `⏳ Compression et envoi...`;
        statusText.style.color = "var(--warning)";
    }
    if (submitBtn) submitBtn.disabled = true;

    // --- IMAGE COMPRESSION LOGIC ---
    const compressImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = event => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Convert to blob (webp for better compression)
                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, 'image/webp', 0.8);
                };
            };
        });
    };

    try {
        const compressedBlob = await compressImage(file);
        const fileName = `${Date.now()}_logo.webp`;
        const filePath = `restaurants/${fileName}`;

        const { error } = await supabaseClient.storage
            .from('restaurant_images')
            .upload(filePath, compressedBlob, { contentType: 'image/webp' });

        if (error) throw error;

        const { data: publicUrlData } = supabaseClient.storage
            .from('restaurant_images')
            .getPublicUrl(filePath);

        urlInput.value = publicUrlData.publicUrl;
        
        if (statusText) {
            statusText.innerHTML = `✅ Photo compressée et hébergée !`;
            statusText.style.color = "var(--success)";
        }
    } catch (e) {
        console.error("Upload error:", e);
        if (statusText) {
            statusText.innerHTML = `❌ Échec de l'envoi (${e.message})`;
            statusText.style.color = "var(--danger)";
        }
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }
}



async function handleRestaurantLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim().toLowerCase();
    const pass = document.getElementById('login-password').value.trim();
    
    // Hachage sécurisé du mot de passe admin (SHA-256)
    const msgUint8 = new TextEncoder().encode(pass);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Identifiant unique : admin / Mot de passe fort sécurisé
    const isSuperAdmin = (username === 'admin' && hashHex === '4c5b8f75c052bcf17d687eefcfe9fc03c5a8b145c0ebea94806c0bd218b9d6d1');

    if (isSuperAdmin) {
        isSuperAdminSession = true;
        try {
            sessionStorage.setItem('thies_admin_logged', 'true');
            sessionStorage.setItem('admin_session', 'true');
            sessionStorage.setItem('admin_password', pass);
        } catch (e) {}
        if (typeof showToast === 'function') showToast("Connexion réussie ! Bienvenue Admin.", "success");
        if (typeof updateNavbar === 'function') updateNavbar();
        setTimeout(() => {
            const modal = document.getElementById('auth-modal');
            if (modal) modal.style.display = 'none';
            router.navigate('/admin');
        }, 1000);
        return;
    }
    
    let r = null;
    
    // 1. Vérification sécurisée EXCLUSIVE via Supabase
    if (typeof supabaseClient !== 'undefined' && supabaseClient) {
        try {
            const { data, error } = await supabaseClient.rpc('verify_restaurant_login', {
                p_username: username,
                p_password: pass
            });
            if (!error && data && data.length > 0) {
                r = {
                    id: data[0].id,
                    name: data[0].name,
                    slug: data[0].slug,
                    status: data[0].status,
                    password: pass
                };
            }
        } catch(err) {
            console.error("Supabase login error", err);
        }
    }
    
    // Fallback local désactivé en production pour des raisons de sécurité.
    
    if (!r) {
        if (typeof showToast === 'function') showToast("Identifiant ou mot de passe introuvable", "danger");
        return;
    }

    if (r.status === 'pending') {
        if (typeof showToast === 'function') showToast("Votre compte est en cours de validation.", "warning");
        return;
    }
    
    if (r.status === 'suspended') {
        if (typeof showToast === 'function') showToast("Votre compte a été suspendu temporairement.", "danger");
        return;
    }
    
    currentRestaurantSession = { id: r.id, name: r.name, slug: r.slug, password: pass };
    try {
        sessionStorage.setItem('resto_session', JSON.stringify(currentRestaurantSession));
    } catch (e) {}
    
    if (typeof updateNavbar === 'function') updateNavbar();
    if (typeof showToast === 'function') showToast(`Bienvenue, ${r.name} !`, "success");
    
    setTimeout(() => {
        const modal = document.getElementById('auth-modal');
        if (modal) modal.style.display = 'none';
        router.navigate('/dashboard');
    }, 1000);
}

function handleRestaurantRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('reg-name').value.trim();
    const address = document.getElementById('reg-address').value.trim();
    const category = document.getElementById('reg-category').value;
    const whatsapp = cleanPhoneNumber(document.getElementById('reg-whatsapp').value.trim());
    const openH = document.getElementById('reg-open').value;
    const closeH = document.getElementById('reg-close').value;
    const username = document.getElementById('reg-username').value.trim().toLowerCase();
    const password = document.getElementById('reg-password').value;
    const imageUrl = document.getElementById('reg-image-url').value;
    
    if (!/^\+221(70|75|76|77|78)\d{7}$/.test(whatsapp.replace(/\s+/g, ''))) {
        showToast("Numéro WhatsApp invalide (ex: +221 77 XXX XX XX)", "danger");
        return;
    }

    // Check availability
    const exists = store.getRestaurants().find(r => r.username === username || r.slug === username);
    if (exists) {
        showToast("Cet identifiant est déjà utilisé", "danger");
        return;
    }

    const newId = "r" + (store.getRestaurants().length + 1);
    const slug = username.replace(/[^a-z0-9]/g, '-');
    
    const newResto = {
        id: newId,
        name,
        slug,
        rating: 5.0,
        reviewsCount: 0,
        category,
        address,
        whatsapp,
        image: imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500',
        openHours: `${openH} - ${closeH}`,
        closedDays: [],
        isOpenManual: true,
        status: "pending",
        username,
        password,
        menu: [],
        reviews: []
    };

    store.addRestaurant(newResto);
    
    const container = document.querySelector('.auth-container');
    container.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem;">
            <div style="font-size: 3.5rem; margin-bottom: 1rem;">⏳</div>
            <h2 style="font-size: 1.25rem;">Demande d'inscription envoyée !</h2>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 1rem 0 1.5rem 0;">
                Votre dossier pour "<strong>${name}</strong>" a été transmis avec succès.
            </p>
            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 12px; font-size: 0.85rem; text-align: left; margin-bottom: 1.5rem;">
                Notre super-administrateur valide les inscriptions sous 10 minutes. Vous recevrez une confirmation et un message d'activation directement sur WhatsApp au <strong>${whatsapp}</strong>.
            </div>
            <button class="btn btn-primary btn-block" onclick="router.navigate('/')">Retourner à l'accueil</button>
        </div>
    `;
    
    showToast("Inscription enregistrée. En attente d'approbation.", "success");
}

// ----------------------------------------------------
// Page: RESTAURANT DASHBOARD (Gerer ses donnees)
// ----------------------------------------------------
let dashboardActiveTab = 'orders';
let currentOrderStatusFilter = 'Tous';

router.add('#/dashboard', () => {
    // Hide cart
    document.getElementById('floating-cart-bar').style.display = 'none';
    
    if (!currentRestaurantSession) {
        showToast("Veuillez vous connecter pour accéder au tableau de bord.", "danger");
        router.navigate('/auth');
        return;
    }
    
    startOrderPolling(currentRestaurantSession.id);
    hideLoadingOverlay();
    renderDashboardShell();
});

function renderDashboardShell() {
    const container = document.getElementById('main-content');
    const r = store.getRestaurantById(currentRestaurantSession.id);
    
    let impersonateBanner = '';
    if (isSuperAdminSession) {
        impersonateBanner = `
            <div style="background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%); color: var(--primary); padding: 0.75rem 1.5rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; font-weight: 700; border-radius: 12px; margin: 1rem 1.5rem 0 1.5rem; box-shadow: var(--shadow); border: 1px solid rgba(255,255,255,0.1);">
                <span>👑 Mode Super-Admin : Vous gérez actuellement le profil de "<strong>${r.name}</strong>"</span>
                <button class="btn btn-secondary btn-sm" onclick="exitImpersonation()" style="background: rgba(255,255,255,0.25); border-color: transparent; color: var(--primary); font-weight: 700;">
                    Retourner à la Console 🔐
                </button>
            </div>
        `;
    }
    
    container.innerHTML = `
        ${impersonateBanner}
        <div class="dashboard-grid">
            <aside class="sidebar">
                <button class="sidebar-btn ${dashboardActiveTab === 'orders' ? 'active' : ''}" onclick="switchDashboardTab('orders')">📦 Commandes</button>
                <button class="sidebar-btn ${dashboardActiveTab === 'reservations' ? 'active' : ''}" onclick="switchDashboardTab('reservations')">📅 Réservations</button>
                <button class="sidebar-btn ${dashboardActiveTab === 'menu' ? 'active' : ''}" onclick="switchDashboardTab('menu')">🍽️ Plats du Jour</button>
                <button class="sidebar-btn ${dashboardActiveTab === 'reviews' ? 'active' : ''}" onclick="switchDashboardTab('reviews')">💬 Avis Clients</button>
                <button class="sidebar-btn ${dashboardActiveTab === 'accounting' ? 'active' : ''}" onclick="switchDashboardTab('accounting')">📊 Comptabilité</button>
                <button class="sidebar-btn ${dashboardActiveTab === 'settings' ? 'active' : ''}" onclick="switchDashboardTab('settings')">⚙️ Paramètres</button>
                <button class="sidebar-btn ${dashboardActiveTab === 'subscription' ? 'active' : ''}" onclick="switchDashboardTab('subscription')">💳 Abonnement</button>
            </aside>
            <main class="dashboard-content" id="dashboard-tab-panel">
                <!-- Sub tab contents injected here -->
            </main>
        </div>
    `;

    renderDashboardTabContent(r);
}

function switchDashboardTab(tab) {
    dashboardActiveTab = tab;
    const r = store.getRestaurantById(currentRestaurantSession.id);
    
    const btns = document.querySelectorAll('.sidebar-btn');
    btns.forEach(b => b.classList.remove('active'));
    
    // Highlight active
    const label = tab === 'orders' ? 'commandes' : tab === 'reservations' ? 'réservations' : tab === 'menu' ? 'plats' : tab === 'reviews' ? 'avis' : tab === 'accounting' ? 'comptabilité' : tab === 'subscription' ? 'abonnement' : 'paramètres';
    btns.forEach(b => {
        if (b.innerText.toLowerCase().includes(label)) {
            b.classList.add('active');
        }
    });

    renderDashboardTabContent(r);
}

function renderDashboardTabContent(r) {
    const panel = document.getElementById('dashboard-tab-panel');
    
    if (dashboardActiveTab === 'orders') {
        const orders = store.getOrdersByRestaurant(r.id);
        const todayStr = new Date().toISOString().split('T')[0];
        
        const todayOrders = orders.filter(o => o.date === todayStr);
        const todayRevenue = todayOrders.filter(o => o.status === 'Livrée').reduce((sum, o) => sum + o.total, 0);
        const pendingOrders = orders.filter(o => o.status === 'Reçue').length;

        // Apply filters
        let filteredOrders = [...orders];
        if (currentOrderStatusFilter === 'En attente') {
            filteredOrders = orders.filter(o => o.status === 'Reçue');
        } else if (currentOrderStatusFilter === 'Confirmées') {
            filteredOrders = orders.filter(o => o.status === 'Confirmée' || o.status === 'Prête');
        } else if (currentOrderStatusFilter === 'Livrées') {
            filteredOrders = orders.filter(o => o.status === 'Livrée');
        }

        let listHtml = '';
        if (filteredOrders.length === 0) {
            listHtml = `
                <div style="text-align: center; color: var(--text-secondary); padding: 4rem 0; background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px;">
                    <span style="font-size: 3rem; display: block; margin-bottom: 1rem;">📦</span>
                    Aucune commande ne correspond au filtre <strong>"${currentOrderStatusFilter}"</strong>.
                </div>
            `;
        } else {
            filteredOrders.forEach(o => {
                const itemsStr = o.items.map(i => `<span style="background: var(--bg-secondary); padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.8rem; font-weight: 600; border: 1px solid var(--border); display: inline-block; margin: 0.15rem 0.15rem 0.15rem 0;">${i.name} <strong>x${i.qty}</strong></span>`).join(' ');
                
                // Status styles
                let statusBadge = '';
                let actionBtns = '';
                
                if (o.status === 'Reçue') {
                    statusBadge = `<span class="badge badge-warning" style="animation: pulseMainCircle 2s infinite;">Reçue</span>`;
                    actionBtns = `
                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            <button class="btn btn-primary" onclick="changeOrderStatus('${o.id}', 'Confirmée')" style="font-weight: 700; flex: 1;">
                                ✅ Accepter & notifier 💬
                            </button>
                            <button class="btn btn-danger" onclick="changeOrderStatus('${o.id}', 'Annulée')" style="font-weight: 700; flex: 1;">
                                ❌ Refuser la commande
                            </button>
                        </div>
                    `;
                } else if (o.status === 'Confirmée') {
                    statusBadge = `<span class="badge badge-info">En Préparation</span>`;
                    actionBtns = `
                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            <button class="btn btn-success" onclick="changeOrderStatus('${o.id}', 'Prête')" style="font-weight: 700; flex: 1; background: #007bff; border-color: #007bff;">
                                🛵 Prête & notifier client 💬
                            </button>
                            <button class="btn btn-danger" onclick="changeOrderStatus('${o.id}', 'Annulée')" style="font-weight: 700;">
                                ❌ Annuler
                            </button>
                        </div>
                    `;
                } else if (o.status === 'Prête') {
                    statusBadge = `<span class="badge badge-success">Prête</span>`;
                    actionBtns = `
                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            <button class="btn btn-success" onclick="changeOrderStatus('${o.id}', 'Livrée')" style="font-weight: 700; flex: 1; background: var(--success); border-color: var(--success);">
                                📦 Livrée / Récupérée 💬
                            </button>
                            <button class="btn btn-danger" onclick="changeOrderStatus('${o.id}', 'Annulée')" style="font-weight: 700;">
                                ❌ Annuler
                            </button>
                        </div>
                    `;
                } else if (o.status === 'Annulée') {
                    statusBadge = `<span class="badge badge-danger">Annulée</span>`;
                    actionBtns = `<span style="font-size: 0.85rem; color: var(--danger); font-weight: 600; display: block; text-align: center; padding: 0.5rem; background: rgba(var(--danger-rgb,220,53,69), 0.1); border-radius: 8px;">❌ Commande refusée / annulée</span>`;
                } else {
                    statusBadge = `<span class="badge badge-success" style="opacity: 0.6">Livrée / Récupérée</span>`;
                    actionBtns = `<span style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 600; display: block; text-align: center; padding: 0.5rem; background: var(--bg-secondary); border-radius: 8px;">✅ Commande traitée et archivée</span>`;
                }

                listHtml += `
                    <div class="dashboard-list-item" style="border-left: 4px solid ${o.status === 'Reçue' ? 'var(--accent)' : o.status === 'Livrée' ? 'var(--success)' : 'var(--primary)'}; background: var(--bg-card); border-radius: 16px; padding: 1.5rem; margin-bottom: 1.25rem; box-shadow: var(--shadow);">
                        <div class="list-item-header" style="border-bottom: 1px solid var(--border); padding-bottom: 0.75rem; margin-bottom: 0.75rem;">
                            <div>
                                <span class="list-item-title" style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary);">N° ${o.id}</span>
                                <span style="margin-left: 0.75rem;">${statusBadge}</span>
                            </div>
                            <span class="list-item-time" style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600;">🕒 Le ${o.date} à ${o.time}</span>
                        </div>
                        <div class="list-item-details" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
                            <div>
                                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong style="color:var(--text-secondary)">👤 Client :</strong> <span style="font-weight: 700;">${o.customerName}</span></p>
                                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong style="color:var(--text-secondary)">📞 WhatsApp :</strong> <a href="https://wa.me/${o.customerPhone.replace(/\+/g, '')}" target="_blank" class="call-btn" style="margin-left:0.25rem;">💬 Ouvrir WhatsApp (${o.customerPhone})</a></p>
                                ${o.address ? `<p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong style="color:var(--text-secondary)">📍 Adresse :</strong> ${o.address}</p>` : ''}
                            </div>
                            <div>
                                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong style="color:var(--text-secondary)">🛵 Récupération :</strong> <span class="badge ${o.mode === 'Livraison' ? 'badge-primary' : 'badge-info'}" style="font-weight:700;">${o.mode}</span></p>
                                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong style="color:var(--text-secondary)">💰 Total à payer :</strong> <span style="font-size: 1.1rem; color: var(--primary); font-weight: 800;">${o.total} FCFA</span></p>
                                ${o.note ? `<p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong style="color:var(--text-secondary)">📝 Note :</strong> <span style="font-style: italic; color:var(--text-secondary);">"${o.note}"</span></p>` : ''}
                            </div>
                        </div>
                        <div style="background: var(--bg-secondary); padding: 0.75rem 1rem; border-radius: 12px; margin-bottom: 1.25rem; border: 1px solid var(--border);">
                            <strong style="display: block; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 0.35rem;">🍳 Plats commandés :</strong>
                            <div style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
                                ${itemsStr}
                            </div>
                        </div>
                        <div class="list-item-actions" style="margin-top: 1rem;">
                            ${actionBtns}
                        </div>
                    </div>
                `;
            });
        }

        const filterBtnsHtml = ['Tous', 'En attente', 'Confirmées', 'Livrées'].map(f => {
            const isActive = currentOrderStatusFilter === f;
            return `
                <button class="btn ${isActive ? 'btn-primary' : 'btn-secondary'}" style="padding: 0.4rem 1rem; font-size: 0.85rem; font-weight: 700; border-radius: 20px;" onclick="filterOrdersDashboard('${f}')">
                    ${f === 'En attente' ? '⏳ ' : f === 'Confirmées' ? '🍳 ' : f === 'Livrées' ? '✅ ' : '📦 '}${f}
                </button>
            `;
        }).join(' ');

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
                <h2 style="font-size: 1.25rem; margin: 0;">Gestion des Commandes</h2>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
                    ${filterBtnsHtml}
                    <button class="btn btn-secondary" onclick="exportOrdersToCSV()" style="padding: 0.4rem 0.8rem; font-size: 0.85rem; font-weight: 700; border-radius: 20px; margin-left: 0.5rem;">
                        📥 Exporter CSV
                    </button>
                </div>
            </div>
            
            <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
                <div class="stat-card" style="border-top: 4px solid var(--primary); background: var(--bg-card); padding: 1.25rem; border-radius: 16px; box-shadow: var(--shadow);">
                    <span class="stat-card-title" style="color: var(--text-secondary); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 0.5rem;">📅 Commandes du jour</span>
                    <span class="stat-card-value" style="font-size: 1.75rem; font-weight: 800; color: var(--text-primary);">${todayOrders.length}</span>
                </div>
                <div class="stat-card" style="border-top: 4px solid var(--success); background: var(--bg-card); padding: 1.25rem; border-radius: 16px; box-shadow: var(--shadow);">
                    <span class="stat-card-title" style="color: var(--text-secondary); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 0.5rem;">💰 Chiffre d'affaires (Jour)</span>
                    <span class="stat-card-value" style="font-size: 1.75rem; font-weight: 800; color: var(--success);">${todayRevenue} FCFA</span>
                </div>
                <div class="stat-card" style="border-top: 4px solid var(--accent); background: var(--bg-card); padding: 1.25rem; border-radius: 16px; box-shadow: var(--shadow);">
                    <span class="stat-card-title" style="color: var(--text-secondary); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 0.5rem;">⏳ Commandes en attente</span>
                    <span class="stat-card-value" style="font-size: 1.75rem; font-weight: 800; color: var(--accent);">${pendingOrders}</span>
                </div>
            </div>

            <div class="dashboard-list">
                ${listHtml}
            </div>
        `;
    } 
    else if (dashboardActiveTab === 'reservations') {
        const reservations = store.getReservationsByRestaurant(r.id);
        
        let listHtml = '';
        if (reservations.length === 0) {
            listHtml = `<div style="text-align: center; color: var(--text-secondary); padding: 3rem 0;">Aucune réservation pour le moment.</div>`;
        } else {
            reservations.forEach(res => {
                let statusBadge = '';
                let actionBtns = '';

                if (res.status === 'En attente') {
                    statusBadge = `<span class="badge badge-warning">En Attente</span>`;
                    actionBtns = `
                        <button class="btn btn-success btn-sm" onclick="changeReservationStatus('${res.id}', 'Confirmée')">
                            Confirmer & Envoyer WA 💬
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="changeReservationStatus('${res.id}', 'Annulée')">
                            Annuler & WhatsApp 💬
                        </button>
                    `;
                } else if (res.status === 'Confirmée') {
                    statusBadge = `<span class="badge badge-success">Confirmée</span>`;
                    actionBtns = `<span style="font-size: 0.8rem; color: var(--success)">Validée</span>`;
                } else {
                    statusBadge = `<span class="badge badge-danger">Annulée</span>`;
                    actionBtns = `<span style="font-size: 0.8rem; color: var(--danger)">Annulée</span>`;
                }

                const formattedDate = new Date(res.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });

                listHtml += `
                    <div class="dashboard-list-item">
                        <div class="list-item-header">
                            <div>
                                <span class="list-item-title">${res.id} - <strong>${res.customerName}</strong></span>
                                <span style="margin-left: 0.5rem;">${statusBadge}</span>
                            </div>
                            <span class="list-item-time">📅 Prévu le ${formattedDate} à ${res.time}</span>
                        </div>
                        <div class="list-item-details">
                            👥 Personnes : <strong>${res.guests} couverts</strong> <br>
                            📞 Téléphone : <a href="https://wa.me/${res.customerPhone.replace(/\+/g, '')}" target="_blank" class="call-btn">💬 WhatsApp (${res.customerPhone})</a>
                            ${res.note ? `<br>📝 Note client : <em>"${res.note}"</em>` : ''}
                        </div>
                        <div class="list-item-actions">
                            ${actionBtns}
                        </div>
                    </div>
                `;
            });
        }

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
                <h2 style="font-size: 1.25rem; margin: 0;">Réservations de Tables</h2>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-secondary btn-sm" onclick="exportReservationsToCSV()">
                        📥 Exporter CSV
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="toggleManualReservationForm()">
                        ➕ Prendre une réservation (Appel)
                    </button>
                </div>
            </div>
            
            <!-- Manual Reservation Form -->
            <div id="manual-reservation-card" style="display: none; background: var(--bg-card); border: 1px solid var(--border); padding: 1.5rem; border-radius: 20px; margin-bottom: 2rem;">
                <h3 style="font-size: 1rem; margin-bottom: 1.25rem;">📝 Enregistrer une réservation par téléphone</h3>
                <form onsubmit="saveManualReservation(event, '${r.id}')">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Nom du client <span class="required">*</span></label>
                            <input type="text" id="mres-name" class="form-control" placeholder="Modou Diagne" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Téléphone <span class="required">*</span></label>
                            <input type="tel" id="mres-phone" class="form-control" placeholder="+221 77 123 45 67" required>
                        </div>
                    </div>
                    
                    <div class="form-row" style="margin-top: 1rem;">
                        <div class="form-group">
                            <label class="form-label">Date <span class="required">*</span></label>
                            <input type="date" id="mres-date" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Heure <span class="required">*</span></label>
                            <input type="time" id="mres-time" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Nombre de couverts <span class="required">*</span></label>
                            <input type="number" id="mres-guests" class="form-control" placeholder="4" min="1" required>
                        </div>
                    </div>
                    
                    <div class="form-group" style="margin-top: 1rem;">
                        <label class="form-label">Note / Commentaires (ex: table extérieure, anniversaire...)</label>
                        <textarea id="mres-note" class="form-control" placeholder="Demande particulière du client..."></textarea>
                    </div>
                    
                    <div style="display: flex; gap: 0.5rem; margin-top: 1.5rem;">
                        <button type="submit" class="btn btn-primary">Enregistrer la réservation</button>
                        <button type="button" class="btn btn-secondary" onclick="toggleManualReservationForm()">Annuler</button>
                    </div>
                </form>
            </div>

            <div class="dashboard-list">
                ${listHtml}
            </div>
        `;
    } 
    else if (dashboardActiveTab === 'menu') {
        let menuHtml = '';
        if (r.menu.length === 0) {
            menuHtml = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 2rem 0;">Aucun plat n'a encore été ajouté. Créez-en un ci-dessous !</div>`;
        } else {
            r.menu.forEach(d => {
                menuHtml += `
                    <div class="dish-card" style="flex-direction: row; height: auto; align-items: center; padding: 0.75rem; gap: 1rem;">
                        <img src="${d.image}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'">
                        <div style="flex-grow: 1;">
                            <h4 style="font-size: 0.95rem;">${d.name}</h4>
                            <div style="color: var(--primary); font-weight: 700; font-size: 0.85rem;">${d.price} FCFA</div>
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-secondary btn-sm" style="padding: 0.35rem 0.5rem;" onclick="openEditDishForm('${d.id}')">✏️</button>
                            <button class="btn btn-danger btn-sm" style="padding: 0.35rem 0.5rem;" onclick="deleteDish('${d.id}')">🗑️</button>
                        </div>
                    </div>
                `;
            });
        }

        panel.innerHTML = `
            <h2 style="font-size: 1.25rem; margin-bottom: 1rem;">Menu du Jour</h2>
            
            <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem;">
                <!-- Current Dishes List -->
                <div style="background: var(--bg-card); border: 1px solid var(--border); padding: 1.25rem; border-radius: 20px;">
                    <h3 style="font-size: 1rem; margin-bottom: 1rem;">Plats actifs</h3>
                    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                        ${menuHtml}
                    </div>
                </div>

                <!-- Add/Edit Dish Form -->
                <div style="background: var(--bg-card); border: 1px solid var(--border); padding: 1.25rem; border-radius: 20px;" id="dish-form-card">
                    <h3 style="font-size: 1rem; margin-bottom: 1rem;" id="dish-form-title">Ajouter un nouveau plat</h3>
                    <form id="dish-editor-form" onsubmit="saveDish(event)">
                        <input type="hidden" id="dish-edit-id" value="">
                        
                        <div class="form-group">
                            <label class="form-label">Nom du plat <span class="required">*</span></label>
                            <input type="text" id="dish-name" class="form-control" placeholder="Yassa Poulet..." required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Description <span class="required">*</span></label>
                            <textarea id="dish-desc" class="form-control" placeholder="Ingrédients, accompagnements..." required></textarea>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Prix (FCFA) <span class="required">*</span></label>
                                <input type="number" id="dish-price" class="form-control" placeholder="2500" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Photo du plat (URL ou preset) <span class="required">*</span></label>
                                <select id="dish-image-select" class="form-control" onchange="document.getElementById('dish-image-custom').value = this.value">
                                    <option value="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500">Poisson Rouge / Thieb</option>
                                    <option value="https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500">Poulet / Yassa</option>
                                    <option value="https://images.unsplash.com/photo-1544025162-d76694265947?w=500">Grillades / Viandes / Dibi</option>
                                    <option value="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500">Burger / Sandwich</option>
                                    <option value="https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500">Frites dorées</option>
                                    <option value="https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500">Boisson / Jus maison</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Ou coller l'URL d'une image (Google, etc.)</label>
                            <input type="text" id="dish-image-custom" class="form-control" placeholder="https://images.unsplash.com/... (optionnel)">
                        </div>
                        
                        <div class="form-group" style="margin-top: 1rem;">
                            <label class="form-label">📸 Télécharger depuis votre téléphone / appareil</label>
                            <input type="file" id="dish-image-file" class="form-control" accept="image/*" onchange="handleDishImageUpload(event)" style="padding: 0.35rem; height: auto;">
                            <div id="dish-image-preview-container" style="display: none; margin-top: 0.75rem; align-items: center; gap: 0.75rem; background: var(--bg-secondary); padding: 0.5rem; border-radius: 10px; border: 1px solid var(--border);">
                                <img id="dish-image-preview" src="" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
                                <span id="dish-image-upload-status" style="font-size: 0.75rem; color: var(--success); font-weight: 600;">Photo sélectionnée avec succès ! ✅</span>
                            </div>
                        </div>
                        
                        <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                            <button type="submit" class="btn btn-primary" style="flex:1;">Enregistrer</button>
                            <button type="button" class="btn btn-secondary" style="display:none;" id="dish-cancel-edit-btn" onclick="resetDishForm()">Annuler la modification</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    } 
    else if (dashboardActiveTab === 'reviews') {
        let reviewsHtml = '';
        if (r.reviews.length === 0) {
            reviewsHtml = `<div style="text-align: center; color: var(--text-secondary); padding: 3rem 0;">Aucun avis reçu pour l'instant.</div>`;
        } else {
            r.reviews.forEach(rev => {
                const stars = '★'.repeat(rev.rating) + '☆'.repeat(5 - rev.rating);
                
                const replySection = rev.reply
                    ? `
                        <div class="review-reply" style="margin-top: 0.75rem;">
                            <div class="review-reply-author">Votre réponse publique :</div>
                            <p>${rev.reply}</p>
                            <button class="btn btn-secondary btn-sm" style="padding: 0.15rem 0.5rem; font-size: 0.7rem; margin-top: 0.5rem;" onclick="openReplyForm('${rev.id}')">Modifier</button>
                        </div>
                    `
                    : `
                        <div id="reply-form-container-${rev.id}" style="margin-top: 0.75rem;">
                            <button class="btn btn-outline btn-sm" onclick="openReplyForm('${rev.id}')">Répondre publiquement</button>
                        </div>
                    `;

                reviewsHtml += `
                    <div class="review-item">
                        <div class="review-header">
                            <div>
                                <span class="review-author">${rev.author}</span>
                                <span class="stars-rating" style="display: block; font-size: 0.8rem;">${stars}</span>
                            </div>
                            <span class="review-date">${rev.date}</span>
                        </div>
                        <p class="review-comment">${rev.comment}</p>
                        ${replySection}
                        
                        <div id="reply-input-area-${rev.id}" style="display:none; margin-top: 0.75rem; background: var(--bg-secondary); padding: 0.75rem; border-radius: 8px;">
                            <label class="form-label" style="font-size: 0.75rem;">Votre réponse :</label>
                            <textarea id="reply-text-${rev.id}" class="form-control" style="font-size: 0.85rem;" placeholder="Merci pour votre retour...">${rev.reply || ''}</textarea>
                            <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                                <button class="btn btn-primary btn-sm" style="font-size: 0.75rem;" onclick="submitReply('${rev.id}')">Publier</button>
                                <button class="btn btn-secondary btn-sm" style="font-size: 0.75rem;" onclick="closeReplyForm('${rev.id}')">Annuler</button>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        panel.innerHTML = `
            <h2 style="font-size: 1.25rem; margin-bottom: 1.5rem;">Avis Clients</h2>
            <div class="reviews-list">
                ${reviewsHtml}
            </div>
        `;
    }
    else if (dashboardActiveTab === 'accounting') {
        const orders = store.getOrdersByRestaurant(r.id);
        const completedOrders = orders.filter(o => o.status === 'Livrée');
        
        const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
        const totalOrdersCount = orders.length;
        const completedOrdersCount = completedOrders.length;
        const avgCart = completedOrdersCount > 0 ? Math.round(totalRevenue / completedOrdersCount) : 0;
        
        // Breakdown by mode
        const deliveryOrders = completedOrders.filter(o => o.mode === 'Livraison');
        const takeawayOrders = completedOrders.filter(o => o.mode === 'A emporter' || o.mode === 'Emporter' || o.mode === 'À emporter');
        const dineInOrders = completedOrders.filter(o => o.mode === 'Sur place');
        
        const deliveryRev = deliveryOrders.reduce((sum, o) => sum + o.total, 0);
        const takeawayRev = takeawayOrders.reduce((sum, o) => sum + o.total, 0);
        const dineInRev = dineInOrders.reduce((sum, o) => sum + o.total, 0);

        // Build list of completed or all orders
        let rowsHtml = '';
        if (orders.length === 0) {
            rowsHtml = `
                <tr>
                    <td colspan="6" style="text-align: center; color: var(--text-secondary); padding: 2rem;">
                        Aucune commande enregistrée pour le moment.
                    </td>
                </tr>
            `;
        } else {
            orders.forEach(o => {
                const statusBadge = o.status === 'Livrée' 
                    ? `<span class="badge badge-success" style="background: rgba(16, 185, 129, 0.15); color: var(--success); border: 1px solid rgba(16, 185, 129, 0.3);">Livrée (Payée)</span>`
                    : o.status === 'Reçue'
                    ? `<span class="badge badge-warning" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3);">En attente</span>`
                    : `<span class="badge badge-info" style="background: rgba(59, 130, 246, 0.15); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.3);">${o.status}</span>`;

                rowsHtml += `
                    <tr class="accounting-row" data-client="${(o.customerName || '').toLowerCase()}" data-id="${o.id.toLowerCase()}">
                        <td><strong>${o.date} ${o.time || ''}</strong></td>
                        <td>${o.customerName || 'Client anonyme'}</td>
                        <td><a href="tel:${o.customerPhone}" style="color: var(--success); font-weight: bold;">📞 ${o.customerPhone}</a></td>
                        <td>${o.mode}</td>
                        <td style="color: var(--primary); font-weight: bold;">${o.total.toLocaleString()} FCFA</td>
                        <td>${statusBadge}</td>
                    </tr>
                `;
            });
        }

        panel.innerHTML = `
            <div class="accounting-dashboard">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
                    <div>
                        <h2 style="font-family: var(--font-serif); font-size: 1.6rem; color: var(--text-primary);">📊 Journal de Comptabilité</h2>
                        <p style="color: var(--text-secondary); font-size: 0.85rem;">Suivi des chiffres d'affaires et historique complet des commandes clients.</p>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-primary btn-sm" onclick="exportOrdersCSV('${r.id}')">💾 Exporter CSV</button>
                        <button class="btn btn-secondary btn-sm" onclick="window.print()">🖨️ Imprimer</button>
                    </div>
                </div>

                <div style="background: rgba(255,255,255,0.02); padding: 1rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 1rem; position: relative; height: 250px;">
                    <canvas id="revenueChart"></canvas>
                </div>

                <div class="accounting-stats-grid">
                    <div class="accounting-card">
                        <div class="accounting-card-title">Chiffre d'Affaires Total</div>
                        <div class="accounting-card-value" style="color: var(--success);">${totalRevenue.toLocaleString()} FCFA</div>
                        <small style="color: var(--text-secondary); font-size: 0.75rem;">Commandes validées & livrées</small>
                    </div>
                    <div class="accounting-card">
                        <div class="accounting-card-title">Commandes traitées</div>
                        <div class="accounting-card-value">${completedOrdersCount} / ${totalOrdersCount}</div>
                        <small style="color: var(--text-secondary); font-size: 0.75rem;">Commandes livrées sur le total</small>
                    </div>
                    <div class="accounting-card">
                        <div class="accounting-card-title">Panier Moyen</div>
                        <div class="accounting-card-value" style="color: var(--primary);">${avgCart.toLocaleString()} FCFA</div>
                        <small style="color: var(--text-secondary); font-size: 0.75rem;">Par commande encaissée</small>
                    </div>
                </div>

                <div class="accounting-stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); margin-bottom: 2rem;">
                    <div class="accounting-card" style="padding: 1rem 1.25rem;">
                        <div class="accounting-card-title" style="font-size: 0.7rem;">🛵 Livraison</div>
                        <div class="accounting-card-value" style="font-size: 1.2rem;">${deliveryRev.toLocaleString()} F</div>
                        <small style="color: var(--text-secondary); font-size: 0.7rem;">${deliveryOrders.length} commande(s)</small>
                    </div>
                    <div class="accounting-card" style="padding: 1rem 1.25rem;">
                        <div class="accounting-card-title" style="font-size: 0.7rem;">🛍️ À Emporter</div>
                        <div class="accounting-card-value" style="font-size: 1.2rem;">${takeawayRev.toLocaleString()} F</div>
                        <small style="color: var(--text-secondary); font-size: 0.7rem;">${takeawayOrders.length} commande(s)</small>
                    </div>
                    <div class="accounting-card" style="padding: 1rem 1.25rem;">
                        <div class="accounting-card-title" style="font-size: 0.7rem;">🍽️ Sur Place</div>
                        <div class="accounting-card-value" style="font-size: 1.2rem;">${dineInRev.toLocaleString()} F</div>
                        <small style="color: var(--text-secondary); font-size: 0.7rem;">${dineInOrders.length} commande(s)</small>
                    </div>
                </div>

                <div class="accounting-table-container">
                    <div class="accounting-header-actions">
                        <h3 style="font-size: 1.1rem; color: var(--text-primary); font-family: var(--font-serif);">Historique Général des Commandes</h3>
                        <input type="text" placeholder="Rechercher par client ou N°..." class="accounting-search" oninput="filterAccountingTable(this.value)">
                    </div>

                    <div class="table-responsive-accounting">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Date & Heure</th>
                                    <th>Client (Prénom & Nom)</th>
                                    <th>Téléphone</th>
                                    <th>Mode</th>
                                    <th>Montant Total</th>
                                    <th>Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rowsHtml}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        setTimeout(() => renderRevenueChart(orders), 100);
    }
    else if (dashboardActiveTab === 'settings') {
        const clientLink = `${window.location.origin}${window.location.pathname}#/r/${r.slug}`;
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(clientLink)}`;

        // Days checklist
        let daysHtml = '';
        for (let i = 1; i <= 7; i++) {
            const isChecked = r.closedDays.includes(i);
            daysHtml += `
                <label style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; cursor: pointer; font-size: 0.9rem;">
                    <input type="checkbox" name="closed-day-check" value="${i}" ${isChecked ? 'checked' : ''}>
                    ${getDayName(i)}
                </label>
            `;
        }

        panel.innerHTML = `
            <h2 style="font-size: 1.25rem; margin-bottom: 1.5rem;">Paramètres du Restaurant</h2>
            
            <div style="display: grid; grid-template-columns: 1fr; gap: 2rem;">
                
                <!-- Open/Closed Status Switch -->
                <div style="background: var(--bg-card); border: 1px solid var(--border); padding: 1.5rem; border-radius: 20px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h3 style="font-size: 1.1rem; margin-bottom: 0.25rem;">Statut de la Boutique (Temps Réel)</h3>
                        <p style="color: var(--text-secondary); font-size: 0.85rem;">Indiquez en direct si vous acceptez les commandes aujourd'hui.</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <span id="settings-status-label" class="badge ${r.isOpenManual ? 'badge-success' : 'badge-danger'}">
                            ${r.isOpenManual ? 'OUVERT' : 'FERMÉ'}
                        </span>
                        <button class="btn ${r.isOpenManual ? 'btn-danger' : 'btn-success'} btn-sm" onclick="toggleStoreOpenStatus('${r.id}')">
                            ${r.isOpenManual ? 'Fermer Boutique 🔒' : 'Ouvrir Boutique 🔓'}
                        </button>
                    </div>
                </div>

                <!-- Info Modification Form -->
                
                <div style="background: var(--bg-card); border: 1px solid var(--border); padding: 1.5rem; border-radius: 20px;">
                    <h3 style="font-size: 1.1rem; margin-bottom: 1.25rem;">Coordonnées, Horaires & Logo</h3>
                    <form onsubmit="saveProfileSettings(event, '${r.id}')">
                        <div class="form-group" style="margin-bottom: 1.5rem;">
                            <label class="form-label">Logo du Restaurant</label>
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                <img id="settings-logo-preview" src="${r.image}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary);" onerror="this.src='https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200'">
                                <div style="flex: 1;">
                                    <input type="file" id="settings-logo-file" class="form-control" accept="image/*" onchange="handleRestaurantLogoUpload(event)" style="padding: 0.35rem; height: auto;">
                                    <input type="hidden" id="settings-logo-url" value="${r.image}">
                                    <span id="settings-logo-status" style="font-size: 0.75rem; color: var(--success); display: none; margin-top: 0.25rem;">Upload en cours...</span>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Numéro WhatsApp de réception <span class="required">*</span></label>
                            <input type="tel" id="settings-whatsapp" class="form-control" value="${r.whatsapp}" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Horaires habituels <span class="required">*</span></label>
                            <input type="text" id="settings-hours" class="form-control" value="${r.openHours}" placeholder="12:00 - 23:00" required>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Jours de fermeture hebdomadaire</label>
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; margin-top: 0.5rem;">
                                ${daysHtml}
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Nouveau mot de passe (Optionnel)</label>
                            <input type="password" id="settings-password" class="form-control" placeholder="Laisser vide si aucun changement">
                        </div>

                        <button type="submit" id="settings-submit-btn" class="btn btn-primary">Enregistrer les modifications</button>
                    </form>
                </div>


                <!-- QR Code Generation -->
                <div class="qr-container" style="margin: 0 auto;">
                    <h3 style="font-size: 1.1rem; margin-bottom: 0.5rem;">QR Code de Commande</h3>
                    <p style="color: var(--text-secondary); font-size: 0.8rem; margin-bottom: 1rem;">Imprimez et posez ce QR Code sur vos tables ou comptoir pour que vos clients scannent et commandent.</p>
                    <img src="${qrCodeUrl}" class="qr-image" alt="QR Code Link">
                    <a href="${qrCodeUrl}" target="_blank" download="qrcode-${r.slug}.png" class="btn btn-secondary btn-sm btn-block">
                        Imprimer / Télécharger 🖨️
                    </a>
                </div>
            </div>
        `;
    }

    else if (dashboardActiveTab === 'subscription') {
        const currentDate = new Date();
        const createdAt = new Date(r.createdAt || '2026-06-26T00:00:00Z');
        const diffTime = Math.abs(currentDate - createdAt);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const daysLeft = Math.max(0, 90 - diffDays);
        
        // WhatsApp admin number for subscription requests
        const adminWhatsApp = '221781056721';
        const buildWhatsAppLink = (pack, price) => {
            const msg = encodeURIComponent(`Bonjour Thiès à Table 👋\n\nJe souhaite souscrire au *${pack}* (${price} FCFA/mois) pour réactiver mon restaurant.\n\n🏪 Restaurant : ${r.name}\n🆔 Identifiant : ${r.slug}\n📦 Pack choisi : ${pack}\n\nMerci de procéder à l'activation !`);
            return 'https://wa.me/' + adminWhatsApp + '?text=' + msg;
        };
        
        let freePeriodHtml = '';
        if (daysLeft > 0) {
            freePeriodHtml = `
                <div style="background: linear-gradient(135deg, var(--success) 0%, #20c997 100%); color: var(--primary); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <h3 style="margin: 0 0 0.5rem 0; font-size: 1.4rem;">🎉 Période de Gratuité en cours</h3>
                        <p style="margin: 0; font-size: 1rem; opacity: 0.9;">Il vous reste <strong>${daysLeft} jours</strong> d'accès gratuit. Profitez-en pour développer votre chiffre d'affaires !</p>
                    </div>
                    <div style="font-size: 2.5rem;">🎁</div>
                </div>
            `;
        } else {
            const reactivateMsg = encodeURIComponent(`Bonjour Thiès à Table 👋\n\nMa période d'essai gratuit est terminée et je souhaite réactiver mon restaurant.\n\n🏪 Restaurant : ${r.name}\n🆔 Identifiant : ${r.slug}\n\nMerci de m'indiquer la marche à suivre !`);
            freePeriodHtml = `
                <div style="background: linear-gradient(135deg, var(--danger) 0%, #ff4b4b 100%); color: var(--primary); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                        <div>
                            <h3 style="margin: 0 0 0.5rem 0; font-size: 1.4rem;">⚠️ Période d'essai terminée</h3>
                            <p style="margin: 0; font-size: 1rem; opacity: 0.9;">Vos 3 mois gratuits sont écoulés. <strong>Votre restaurant a été automatiquement désactivé.</strong> Choisissez un pack ci-dessous et envoyez-nous un message WhatsApp pour réactiver votre boutique.</p>
                        </div>
                        <div style="font-size: 2.5rem;">🔒</div>
                    </div>
                    <a href="https://wa.me/${adminWhatsApp}?text=${reactivateMsg}" target="_blank" style="display: inline-flex; align-items: center; gap: 0.5rem; background: white; color: #25D366; padding: 0.6rem 1.2rem; border-radius: 10px; font-weight: 700; text-decoration: none; font-size: 0.95rem;">
                        💬 Contacter Thiès à Table sur WhatsApp
                    </a>
                </div>
            `;
        }
        
        panel.innerHTML = `
            <div style="background: var(--bg-card); padding: 2rem; border-radius: 20px; box-shadow: var(--shadow); max-width: 1000px; margin: 0 auto;">
                <h2 style="margin-bottom: 1rem; color: var(--text-primary); font-size: 1.8rem; font-weight: 800; border-bottom: 2px solid var(--border); padding-bottom: 0.5rem;">💳 Mon Abonnement & Visibilité</h2>
                
                ${freePeriodHtml}

                <h3 style="margin-bottom: 0.5rem; color: var(--text-primary); font-size: 1.3rem;">Des forfaits Gagnant-Gagnant</h3>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">Nos tarifs sont pensés pour s'adapter à la taille de votre activité. Pour souscrire, cliquez sur le bouton du pack qui vous convient et envoyez-nous un message WhatsApp avec vos identifiants.</p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
                    <!-- Pack Simple -->
                    <div style="border: 2px solid var(--border); border-radius: 16px; padding: 1.5rem; display: flex; flex-direction: column; transition: transform 0.3s ease; background: var(--bg-secondary);">
                        <h4 style="margin: 0 0 0.5rem 0; font-size: 1.3rem; color: var(--text-primary);">Pack Simple</h4>
                        <div style="font-size: 1.8rem; font-weight: 800; color: var(--primary); margin-bottom: 0.5rem;">3 000 <span style="font-size: 1rem; color: var(--text-secondary); font-weight: 600;">FCFA / mois</span></div>
                        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">L'essentiel pour exister en ligne et recevoir des commandes.</p>
                        <ul style="list-style: none; padding: 0; margin: 0 0 1.5rem 0; flex-grow: 1; color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6;">
                            <li style="margin-bottom: 0.5rem;">✅ Menu digital accessible 24/7</li>
                            <li style="margin-bottom: 0.5rem;">✅ Réception illimitée de commandes</li>
                            <li style="margin-bottom: 0.5rem;">✅ Visibilité standard sur l'application</li>
                            <li style="margin-bottom: 0.5rem;">✅ Rapport d'activité trimestriel</li>
                            <li style="margin-bottom: 0.5rem;">✅ Support technique par e-mail</li>
                        </ul>
                        <a href="${buildWhatsAppLink('Pack Simple', '3 000')}" target="_blank" class="btn btn-outline" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem; text-decoration: none;">💬 Souscrire via WhatsApp</a>
                    </div>

                    <!-- Pack Startup -->
                    <div style="border: 2px solid var(--primary); border-radius: 16px; padding: 1.5rem; display: flex; flex-direction: column; position: relative; background: rgba(var(--primary-rgb), 0.03); box-shadow: 0 10px 25px rgba(var(--primary-rgb), 0.1);">
                        <div style="position: absolute; top: -12px; right: 20px; background: var(--primary); color: var(--primary); padding: 0.2rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 700;">Recommandé</div>
                        <h4 style="margin: 0 0 0.5rem 0; font-size: 1.3rem; color: var(--text-primary);">Pack Startup</h4>
                        <div style="font-size: 1.8rem; font-weight: 800; color: var(--primary); margin-bottom: 0.5rem;">5 000 <span style="font-size: 1rem; color: var(--text-secondary); font-weight: 600;">FCFA / mois</span></div>
                        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">Pour booster vos ventes avec une meilleure visibilité.</p>
                        <ul style="list-style: none; padding: 0; margin: 0 0 1.5rem 0; flex-grow: 1; color: var(--text-primary); font-size: 0.95rem; line-height: 1.6; font-weight: 500;">
                            <li style="margin-bottom: 0.5rem;">✅ <strong>Tout du Pack Simple</strong></li>
                            <li style="margin-bottom: 0.5rem;">🚀 <strong>Positionnement prioritaire</strong> dans votre catégorie</li>
                            <li style="margin-bottom: 0.5rem;">⭐ Badge "Restaurant Certifié"</li>
                            <li style="margin-bottom: 0.5rem;">📊 Rapport détaillé des ventes (Mensuel)</li>
                            <li style="margin-bottom: 0.5rem;">💬 Support direct et rapide via WhatsApp</li>
                        </ul>
                        <a href="${buildWhatsAppLink('Pack Startup', '5 000')}" target="_blank" class="btn btn-primary" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem; text-decoration: none;">💬 Souscrire via WhatsApp</a>
                    </div>

                    <!-- Pack Entreprise -->
                    <div style="border: 2px solid var(--accent); border-radius: 16px; padding: 1.5rem; display: flex; flex-direction: column; background: rgba(var(--accent-rgb), 0.03);">
                        <h4 style="margin: 0 0 0.5rem 0; font-size: 1.3rem; color: var(--text-primary);">Pack Entreprise</h4>
                        <div style="font-size: 1.8rem; font-weight: 800; color: var(--accent); margin-bottom: 0.5rem;">15 000 <span style="font-size: 1rem; color: var(--text-secondary); font-weight: 600;">FCFA / mois</span></div>
                        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">La solution complète pour dominer le marché local.</p>
                        <ul style="list-style: none; padding: 0; margin: 0 0 1.5rem 0; flex-grow: 1; color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6;">
                            <li style="margin-bottom: 0.5rem;">✅ <strong>Tout du Pack Startup</strong></li>
                            <li style="margin-bottom: 0.5rem;">📢 <strong>Bannière publicitaire</strong> sur l'accueil</li>
                            <li style="margin-bottom: 0.5rem;">📱 1 Post sponsorisé par mois sur nos réseaux</li>
                            <li style="margin-bottom: 0.5rem;">🎁 Outils de fidélisation (Coupons promo)</li>
                            <li style="margin-bottom: 0.5rem;">📈 Statistiques avancées (Hebdomadaire)</li>
                        </ul>
                        <a href="${buildWhatsAppLink('Pack Entreprise', '15 000')}" target="_blank" class="btn btn-outline" style="width: 100%; border-color: var(--accent); color: var(--accent); display: flex; align-items: center; justify-content: center; gap: 0.5rem; text-decoration: none;">💬 Souscrire via WhatsApp</a>
                    </div>
                </div>
            </div>
        `;
    }

}

// Global helper for accounting search filtering
window.filterAccountingTable = function(val) {
    const q = val.toLowerCase().trim();
    const rows = document.querySelectorAll('.accounting-row');
    rows.forEach(r => {
        const client = r.getAttribute('data-client') || '';
        const id = r.getAttribute('data-id') || '';
        if (client.includes(q) || id.includes(q)) {
            r.style.display = '';
        } else {
            r.style.display = 'none';
        }
    });
};
// Global helper for landing page how-it-works tabs switching
window.switchHowItWorksTab = function(tabId) {
    document.querySelectorAll('.hw-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.hw-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Highlight the active button
    const activeBtn = document.querySelector(`.hw-tab-btn[onclick*="${tabId}"]`);
    const activeContent = document.getElementById(tabId);
    if (activeBtn) activeBtn.classList.add('active');
    if (activeContent) activeContent.classList.add('active');
};


// Global helper for checking customer loyalty points
window.checkLoyaltyPoints = async function() {
    const rawPhone = document.getElementById('loyalty-phone').value.trim();
    if (!rawPhone) {
        showToast("Veuillez saisir votre numéro WhatsApp", "warning");
        return;
    }
    const phone = cleanPhoneNumber(rawPhone);
    if (!/^\+221(70|75|76|77|78)\d{7}$/.test(phone.replace(/\s+/g, ''))) {
        showToast("Numéro de téléphone sénégalais invalide (ex: +221 77 XXX XX XX)", "danger");
        return;
    }

    let ordersCount = 0;
    let resCount = 0;
    let usedRewards = 0;

    if (supabaseClient) {
        const { data, error } = await supabaseClient.rpc('get_customer_loyalty_data', { p_phone: phone });
        if (!error && data && data.length > 0) {
            ordersCount = data[0].orders_count;
            resCount = data[0].reservations_count;
            usedRewards = data[0].used_rewards;
        }
    } else {
        ordersCount = store.data.orders.filter(o => cleanPhoneNumber(o.customerPhone) === phone && o.status === 'Livrée').length;
        resCount = store.data.reservations.filter(r => cleanPhoneNumber(r.customerPhone) === phone && r.status === 'Confirmée').length;
        if (!store.data.usedRewards) store.data.usedRewards = {};
        usedRewards = store.data.usedRewards[phone] || 0;
    }

    const orderPoints = ordersCount * 5;
    const resPoints = resCount * 5;
    const totalPoints = orderPoints + resPoints;

    const totalRewardsUnlocked = Math.floor(totalPoints / 100);
    const activeRewards = Math.max(0, totalRewardsUnlocked - usedRewards);
    const nextRewardPoints = 100 - (totalPoints % 100);

    // Gamification badges
    let tier = 'Gourmand de Bronze 🥉';
    let tierClass = 'tier-bronze';
    if (totalPoints >= 200) {
        tier = 'Empereur du Goût 👑';
        tierClass = 'tier-emperor';
    } else if (totalPoints >= 100) {
        tier = 'Gourmand d\'Or 🥇';
        tierClass = 'tier-gold';
    } else if (totalPoints >= 50) {
        tier = 'Gourmand d\'Argent 🥈';
        tierClass = 'tier-silver';
    }

    const resultCard = document.getElementById('loyalty-result-card');
    if (!resultCard) return;
    
    resultCard.style.display = 'block';
    
    let rewardActionHtml = '';
    if (activeRewards > 0) {
        rewardActionHtml = `
            <div class="reward-claim-box" style="margin-top: 1.5rem; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); padding: 1.25rem; border-radius: 16px; display: flex; align-items: center; gap: 1rem;">
                <span class="gift-icon" style="font-size: 2.2rem;">🎁</span>
                <div style="flex: 1; text-align: left;">
                    <h4 style="color: var(--text-primary); margin: 0 0 0.25rem 0; font-family: var(--font-serif); font-size: 1.05rem;">Vous avez ${activeRewards} plat(s) offert(s) disponible(s) !</h4>
                    <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0 0 0.5rem 0;">Profitez de votre récompense de fidélité lors de votre prochaine commande en ligne.</p>
                    <button class="btn btn-sm btn-success" onclick="applyLoyaltyRewardToCart('${phone}')">Appliquer au panier actif 🛒</button>
                </div>
            </div>
        `;
    }

    resultCard.innerHTML = `
        <div class="loyalty-card-inner" style="background: linear-gradient(135deg, #071a11 0%, #0c2b1d 100%); border: 1px solid var(--border); border-radius: 24px; padding: 1.75rem; text-align: left; position: relative; overflow: hidden; box-shadow: var(--shadow);">
            <div class="loyalty-card-header" style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 1rem; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
                <div>
                    <h3 style="font-family: var(--font-serif); color: var(--text-primary); margin: 0; font-size: 1.3rem;">Carte de Fidélité</h3>
                    <span class="loyalty-phone-lbl" style="font-size: 0.8rem; color: var(--text-secondary); font-family: monospace;">WhatsApp: ${phone}</span>
                </div>
                <div class="loyalty-tier-badge ${tierClass}" style="font-size: 0.8rem; font-weight: bold; padding: 0.35rem 0.75rem; border-radius: 20px; text-transform: uppercase; background: rgba(255,255,255,0.05); color: var(--primary); border: 1px solid rgba(207,168,83,0.3);">${tier}</div>
            </div>
            
            <div class="loyalty-card-body">
                <div class="loyalty-gauge-container" style="display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1rem; flex-wrap: wrap;">
                    <div class="loyalty-points-circle" style="width: 80px; height: 80px; border-radius: 50%; background: rgba(207, 168, 83, 0.1); border: 2.5px solid var(--primary); display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(207,168,83,0.15);">
                        <span class="points-num" style="font-size: 1.8rem; font-weight: 800; color: var(--primary); font-family: var(--font-serif); line-height: 1;">${totalPoints}</span>
                        <span class="points-lbl" style="font-size: 0.6rem; text-transform: uppercase; color: var(--text-secondary); margin-top: 2px;">Points</span>
                    </div>
                    <div class="loyalty-progress-text" style="flex: 1; min-width: 200px;">
                        <p style="font-size: 1.1rem; font-weight: bold; color: var(--text-primary); margin: 0;">${totalPoints % 100} / 100 pts</p>
                        <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0.25rem 0 0 0;">
                            Plus que <strong style="color: var(--primary);">${nextRewardPoints} points</strong> pour obtenir votre prochain plat gratuit !
                        </p>
                    </div>
                </div>
                
                <div class="loyalty-progress-bar-bg" style="width: 100%; height: 8px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; margin-bottom: 1.5rem; border: 1px solid rgba(255,255,255,0.02);">
                    <div class="loyalty-progress-bar-fill" style="width: ${totalPoints % 100}%; height: 100%; background: linear-gradient(90deg, var(--primary), var(--accent)); border-radius: 10px; transition: width 0.4s ease;"></div>
                </div>

                <div class="loyalty-stats-summary" style="display: flex; justify-content: space-around; gap: 1rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1.25rem; margin-top: 1rem; text-align: center; flex-wrap: wrap;">
                    <div class="loyalty-stat-col" style="flex: 1; min-width: 80px;">
                        <span class="stat-num" style="font-size: 1.25rem; font-weight: bold; color: var(--text-primary); display: block; margin-bottom: 0.25rem;">${ordersCount}</span>
                        <span class="stat-lbl" style="font-size: 0.75rem; color: var(--text-secondary); display: block;">Commandes livrées</span>
                    </div>
                    <div class="loyalty-stat-col" style="flex: 1; min-width: 80px;">
                        <span class="stat-num" style="font-size: 1.25rem; font-weight: bold; color: var(--text-primary); display: block; margin-bottom: 0.25rem;">${resCount}</span>
                        <span class="stat-lbl" style="font-size: 0.75rem; color: var(--text-secondary); display: block;">Tables réservées</span>
                    </div>
                    <div class="loyalty-stat-col" style="flex: 1; min-width: 80px;">
                        <span class="stat-num" style="font-size: 1.25rem; font-weight: bold; color: var(--text-primary); display: block; margin-bottom: 0.25rem;">${usedRewards}</span>
                        <span class="stat-lbl" style="font-size: 0.75rem; color: var(--text-secondary); display: block;">Cadeaux réclamés</span>
                    </div>
                </div>

                ${rewardActionHtml}
            </div>
        </div>
    `;
};

// Global helper for applying loyalty reward to cart
window.applyLoyaltyRewardToCart = async function(phone) {
    if (!cart.items || cart.items.length === 0) {
        showToast("Votre panier est vide. Veuillez d'abord ajouter des plats depuis un restaurant !", "warning");
        return;
    }
    
    let ordersCount = 0;
    let resCount = 0;
    let usedRewards = 0;

    if (supabaseClient) {
        const { data, error } = await supabaseClient.rpc('get_customer_loyalty_data', { p_phone: phone });
        if (!error && data && data.length > 0) {
            ordersCount = data[0].orders_count;
            resCount = data[0].reservations_count;
            usedRewards = data[0].used_rewards;
        }
    } else {
        ordersCount = store.data.orders.filter(o => cleanPhoneNumber(o.customerPhone) === phone && o.status === 'Livrée').length;
        resCount = store.data.reservations.filter(r => cleanPhoneNumber(r.customerPhone) === phone && r.status === 'Confirmée').length;
        if (!store.data.usedRewards) store.data.usedRewards = {};
        usedRewards = store.data.usedRewards[phone] || 0;
    }

    const totalPoints = ordersCount * 5 + resCount * 5;
    const totalRewardsUnlocked = Math.floor(totalPoints / 100);
    const activeRewards = Math.max(0, totalRewardsUnlocked - usedRewards);
    
    if (activeRewards <= 0) {
        showToast("Vous n'avez aucune récompense disponible pour le moment.", "danger");
        return;
    }
    
    cart.loyaltyApplied = true;
    cart.loyaltyPhone = phone;
    recalculateCart();
    saveCart();
    
    // Redirect to active restaurant detail checkout tab
    const activeResto = store.getRestaurantById(cart.restaurantId);
    if (activeResto) {
        router.navigate(`/r/${activeResto.slug}`);
        setTimeout(() => {
            switchRestoTab('checkout');
        }, 150);
    }
    
    showToast("🎁 Récompense Fidélité appliquée ! Réduction de 2,500 FCFA.", "success");
    
    // Update checker view if on home
    checkLoyaltyPoints();
};

// Global helper for removing loyalty reward from active cart
window.removeLoyaltyReward = function() {
    cart.loyaltyApplied = false;
    cart.loyaltyPhone = null;
    recalculateCart();
    saveCart();
    
    const activeResto = store.getRestaurantById(cart.restaurantId);
    if (activeResto) {
        renderCheckoutTab(activeResto);
    }
    showToast("Réduction de fidélité retirée.", "info");
};

// Actions from restaurant dashboard
function changeOrderStatus(orderId, nextStatus) {
    const o = store.data.orders.find(ord => ord.id === orderId);
    if (!o) return;
    
    store.updateOrderStatus(orderId, nextStatus);
    
    // Build notification message for the client
    let pushText = '';
    const restoName = currentRestaurantSession ? currentRestaurantSession.name || '' : '';
    
    if (nextStatus === 'Confirmée') {
        pushText = `Bonjour ${o.customerName} 👋\n\nVotre commande n°${o.id} chez *${restoName}* a été *acceptée* et part en cuisine ! 🍳\n\nMontant : ${o.total} FCFA\nMode : ${o.mode}\n\nMerci pour votre confiance !`;
    } else if (nextStatus === 'Prête') {
        pushText = `Bonjour ${o.customerName} 👋\n\nVotre commande n°${o.id} chez *${restoName}* est *PRÊTE* ! 🛵\n\n${o.mode === 'Livraison' ? 'Elle est en cours de livraison.' : 'Vous pouvez venir la récupérer.'}\n\nBon appétit !`;
    } else if (nextStatus === 'Livrée') {
        pushText = `Bonjour ${o.customerName} 👋\n\nVotre commande n°${o.id} chez *${restoName}* a été *livrée avec succès*. 😋\n\nMerci et à bientôt sur Thiès à Table !`;
    } else if (nextStatus === 'Annulée') {
        pushText = `Bonjour ${o.customerName} 👋\n\nNous sommes désolés, votre commande n°${o.id} chez *${restoName}* a été *annulée* par le restaurant. ❌\n\nVeuillez nous excuser pour ce désagrément. N'hésitez pas à passer une nouvelle commande.`;
    }
    
    showToast(`Commande mise à jour vers : ${nextStatus}`, nextStatus === 'Annulée' ? 'warning' : 'success');
    
    // Open WhatsApp to notify the client directly
    if (pushText && o.customerPhone) {
        const waLink = 'https://wa.me/' + o.customerPhone.replace(/\+/g, '') + '?text=' + encodeURIComponent(pushText);
        window.open(waLink, '_blank');
        showToast(`📲 WhatsApp ouvert pour notifier le client !`, 'success');
    }
    
    // Reload dashboard list
    switchDashboardTab('orders');
}

function changeReservationStatus(resId, nextStatus) {
    const res = store.data.reservations.find(r => r.id === resId);
    if (!res) return;
    
    store.updateReservationStatus(resId, nextStatus);
    
    let pushText = '';
    const formattedDate = new Date(res.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    
    if (nextStatus === 'Confirmée') {
        pushText = `Réservation confirmée pour ${res.guests} personnes le ${formattedDate} à ${res.time}. 📅`;
    } else if (nextStatus === 'Annulée') {
        pushText = `Réservation annulée pour cause d'indisponibilité le ${formattedDate}.`;
    }
    
    showToast(`Réservation mise à jour : ${nextStatus}`, "success");
    if (pushText) {
        showToast(`📲 Notification push envoyée au client !`, "success");
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Push Envoyé au Client', {
                body: pushText,
                icon: 'icon.png'
            });
        }
    }

    switchDashboardTab('reservations');
}

function toggleManualReservationForm() {
    const card = document.getElementById('manual-reservation-card');
    if (card) {
        if (card.style.display === 'none') {
            card.style.display = 'block';
            card.scrollIntoView({ behavior: 'smooth' });
        } else {
            card.style.display = 'none';
        }
    }
}

function saveManualReservation(e, restaurantId) {
    e.preventDefault();
    
    const name = document.getElementById('mres-name').value.trim();
    const phone = cleanPhoneNumber(document.getElementById('mres-phone').value.trim());
    const date = document.getElementById('mres-date').value;
    const time = document.getElementById('mres-time').value;
    const guests = parseInt(document.getElementById('mres-guests').value);
    const note = document.getElementById('mres-note').value.trim();
    
    if (!/^\+221(70|75|76|77|78)\d{7}$/.test(phone.replace(/\s+/g, ''))) {
        showToast("Numéro de téléphone invalide (ex: +221 77 XXX XX XX)", "danger");
        return;
    }
    
    const newResId = "RES-" + Math.floor(100000 + Math.random() * 900000);
    const newReservation = {
        id: newResId,
        restaurantId,
        customerName: name,
        customerPhone: phone,
        date,
        time,
        guests,
        note,
        status: 'Confirmée' // Direct confirmation for phone bookings taken by admin
    };
    
    store.addReservation(newReservation);
    showToast("Réservation enregistrée et confirmée ! ✅", "success");
    
    // Switch to reload
    switchDashboardTab('reservations');
}

function filterOrdersDashboard(status) {
    currentOrderStatusFilter = status;
    const r = store.getRestaurantById(currentRestaurantSession.id);
    renderDashboardTabContent(r);
}

function deleteDish(dishId) {
    if (confirm("Voulez-vous vraiment supprimer ce plat du jour ?")) {
        const r = store.getRestaurantById(currentRestaurantSession.id);
        r.menu = r.menu.filter(d => d.id !== dishId);
        store.updateRestaurant(r.id, { menu: r.menu });
        showToast("Plat supprimé !", "success");
        switchDashboardTab('menu');
    }
}

function openEditDishForm(dishId) {
    const r = store.getRestaurantById(currentRestaurantSession.id);
    const dish = r.menu.find(d => d.id === dishId);
    if (!dish) return;
    
    document.getElementById('dish-form-title').innerText = "Modifier le plat : " + dish.name;
    document.getElementById('dish-edit-id').value = dish.id;
    document.getElementById('dish-name').value = dish.name;
    document.getElementById('dish-desc').value = dish.description;
    document.getElementById('dish-price').value = dish.price;
    
    const selectImg = document.getElementById('dish-image-select');
    const customImg = document.getElementById('dish-image-custom');
    if (Array.from(selectImg.options).some(opt => opt.value === dish.image)) {
        selectImg.value = dish.image;
        customImg.value = '';
    } else {
        selectImg.selectedIndex = 0;
        customImg.value = dish.image;
    }
    
    document.getElementById('dish-cancel-edit-btn').style.display = 'block';
    document.getElementById('dish-form-card').scrollIntoView({ behavior: 'smooth' });
}

function resetDishForm() {
    document.getElementById('dish-form-title').innerText = "Ajouter un nouveau plat";
    document.getElementById('dish-edit-id').value = '';
    document.getElementById('dish-name').value = '';
    document.getElementById('dish-desc').value = '';
    document.getElementById('dish-price').value = '';
    document.getElementById('dish-image-select').selectedIndex = 0;
    document.getElementById('dish-image-custom').value = '';
    document.getElementById('dish-cancel-edit-btn').style.display = 'none';
    
    const fileInput = document.getElementById('dish-image-file');
    if (fileInput) fileInput.value = '';
    
    const previewContainer = document.getElementById('dish-image-preview-container');
    if (previewContainer) previewContainer.style.display = 'none';
}

window.handleDishImageUpload = async function(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!supabaseClient) {
        showToast("Service Storage non disponible", "danger");
        return;
    }

    const previewImg = document.getElementById('dish-image-preview');
    const container = document.getElementById('dish-image-preview-container');
    const statusText = document.getElementById('dish-image-upload-status');
    const customInput = document.getElementById('dish-image-custom');
    const submitBtn = document.querySelector('#dish-editor-form button[type="submit"]');

    if (container) container.style.display = 'flex';
    if (previewImg) previewImg.src = URL.createObjectURL(file);
    if (statusText) {
        statusText.innerHTML = `⏳ Téléchargement vers Supabase...`;
        statusText.style.color = "var(--warning)";
    }
    if (submitBtn) submitBtn.disabled = true;

    // Build unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `dishes/${currentRestaurantSession.id}/${fileName}`;

    try {
        const { data, error } = await supabaseClient.storage
            .from('restaurant_images')
            .upload(filePath, file);

        if (error) throw error;

        const { data: publicUrlData } = supabaseClient.storage
            .from('restaurant_images')
            .getPublicUrl(filePath);

        customInput.value = publicUrlData.publicUrl;
        
        if (statusText) {
            statusText.innerHTML = `✅ Photo uploadée et hébergée sur Supabase !`;
            statusText.style.color = "var(--success)";
        }
    } catch (e) {
        console.error("Upload error:", e);
        if (statusText) {
            statusText.innerHTML = `❌ Échec de l'envoi (${e.message})`;
            statusText.style.color = "var(--danger)";
        }
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }
};

function saveDish(e) {
    e.preventDefault();
    
    const r = store.getRestaurantById(currentRestaurantSession.id);
    
    const dishId = document.getElementById('dish-edit-id').value;
    const name = document.getElementById('dish-name').value.trim();
    const desc = document.getElementById('dish-desc').value.trim();
    const price = parseInt(document.getElementById('dish-price').value);
    
    const customImage = document.getElementById('dish-image-custom').value.trim();
    const image = customImage || document.getElementById('dish-image-select').value;
    
    if (dishId) {
        // Edit mode
        const dish = r.menu.find(d => d.id === dishId);
        if (dish) {
            dish.name = name;
            dish.description = desc;
            dish.price = price;
            dish.image = image;
            showToast("Plat modifié !", "success");
        }
    } else {
        // Add mode
        const newDishId = "dish_" + Date.now();
        r.menu.push({
            id: newDishId,
            name,
            description: desc,
            price,
            image
        });
        showToast("Plat ajouté au menu du jour !", "success");
    }
    
    store.updateRestaurant(r.id, { menu: r.menu });
    resetDishForm();
    switchDashboardTab('menu');
}

function toggleStoreOpenStatus(restoId) {
    const r = store.getRestaurantById(restoId);
    r.isOpenManual = !r.isOpenManual;
    store.updateRestaurant(r.id, { isOpenManual: r.isOpenManual });
    showToast(r.isOpenManual ? "Boutique OUVERTE" : "Boutique FERMÉE", "success");
    switchDashboardTab('settings');
}

function saveProfileSettings(e, restoId) {
    e.preventDefault();
    
    const r = store.getRestaurantById(restoId);
    const whatsapp = cleanPhoneNumber(document.getElementById('settings-whatsapp').value.trim());
    const hours = document.getElementById('settings-hours').value.trim();
    const newPass = document.getElementById('settings-password').value;
    
    // Parse closed days checklist
    const checkboxes = document.querySelectorAll('input[name="closed-day-check"]:checked');
    const closedDays = Array.from(checkboxes).map(cb => parseInt(cb.value));
    
    if (!/^\+221(70|75|76|77|78)\d{7}$/.test(whatsapp.replace(/\s+/g, ''))) {
        showToast("Numéro WhatsApp invalide", "danger");
        return;
    }
    
    const updates = {
        whatsapp,
        openHours: hours,
        closedDays
    };
    
    if (newPass) {
        updates.password = newPass;
    }
    
    store.updateRestaurant(r.id, updates);
    showToast("Paramètres enregistrés !", "success");
    switchDashboardTab('settings');
}

function openReplyForm(revId) {
    document.getElementById(`reply-form-container-${revId}`).style.display = 'none';
    document.getElementById(`reply-input-area-${revId}`).style.display = 'block';
}

function closeReplyForm(revId) {
    document.getElementById(`reply-form-container-${revId}`).style.display = 'block';
    document.getElementById(`reply-input-area-${revId}`).style.display = 'none';
}

function submitReply(revId) {
    const text = document.getElementById(`reply-text-${revId}`).value.trim();
    if (!text) {
        showToast("La réponse ne peut pas être vide", "danger");
        return;
    }
    
    const r = store.getRestaurantById(currentRestaurantSession.id);
    const review = r.reviews.find(rev => rev.id === revId);
    
    if (review) {
        review.reply = text;
        store.updateRestaurant(r.id, { reviews: r.reviews });
        showToast("Réponse publiée !", "success");
        switchDashboardTab('reviews');
    }
}

// ----------------------------------------------------
// Page: SUPER-ADMIN LOGIN & PANEL (toi)
// ----------------------------------------------------
router.add('#/admin-login', () => {
    // Hide cart
    document.getElementById('floating-cart-bar').style.display = 'none';
    stopOrderPolling();
    hideLoadingOverlay();
    
    const container = document.getElementById('main-content');
    
    container.innerHTML = `
        <div class="auth-container">
            <div class="auth-header">
                <span class="auth-logo">🔑</span>
                <h2>Console Super-Admin</h2>
                <p style="color: var(--text-secondary); font-size: 0.85rem;">Accès exclusif réservé au gérant du réseau THIES Resto.</p>
            </div>
            
            <form onsubmit="handleAdminLogin(event)">
                <div class="form-group">
                    <label class="form-label">Nom d'utilisateur</label>
                    <input type="text" id="admin-user" class="form-control" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Mot de passe de sécurité</label>
                    <input type="password" id="admin-pass" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary btn-block">Ouvrir la Console 🔐</button>
            </form>
        </div>
    `;
});

function handleAdminLogin(e) {
    e.preventDefault();
    const user = document.getElementById('admin-user').value.trim().toLowerCase();
    const pass = document.getElementById('admin-pass').value.trim();
    
    if ((user === '784799882' && pass === 'Mouhamadou2005') || 
        (user === 'admin' && pass === 'adminthies') || 
        (user === 'idadmin' && pass === 'admin221') || 
        (user === 'thiesresto' && pass === 'Resto221')) {
        isSuperAdminSession = true;
        try {
            sessionStorage.setItem('admin_session', 'true');
            sessionStorage.setItem('thies_admin_logged', 'true');
            sessionStorage.setItem('admin_password', pass);
        } catch (e) {
            console.warn("Failed to save admin_session to sessionStorage", e);
        }
        showToast("Connexion Super-Admin établie", "success");
        router.navigate('/admin');
    } else {
        showToast("Identifiants de sécurité invalides", "danger");
    }
}

let adminActiveTab = 'pending';
router.add('#/admin', () => {
    // Hide cart
    document.getElementById('floating-cart-bar').style.display = 'none';
    stopOrderPolling();
    hideLoadingOverlay();
    
    if (!isSuperAdminSession) {
        showToast("Accès refusé. Veuillez vous connecter.", "danger");
        router.navigate('/admin-login');
        return;
    }
    
    renderAdminView();
});

function renderAdminView() {
    const container = document.getElementById('main-content');
    
    // Calculate network figures
    const restos = store.getRestaurants();
    const activeRestos = restos.filter(r => r.status === 'active');
    const pendingCount = restos.filter(r => r.status === 'pending').length;
    
    const orders = store.data.orders;
    const reservations = store.data.reservations;
    
    // Estimated Gross Merchandise Volume (Chiffre d'Affaires global)
    // On calcule la somme exacte des chiffres d'affaires de toutes les commandes validées (livrées ou terminées)
    const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'delivered');
    const totalGmv = completedOrders.reduce((sum, o) => sum + o.total, 0);

    container.innerHTML = `
        <div style="padding: 2rem 1.5rem; max-width: 1000px; margin: 0 auto;">
            <div style="display:flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
                <div>
                    <h1 style="font-size: 1.75rem;">Super-Admin Console</h1>
                    <p style="color: var(--text-secondary); font-size: 0.85rem;">Supervisez l'intégralité du réseau de restauration de Thiès.</p>
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.25rem;">
                    <span class="badge badge-danger">Live Monitor</span>
                    <button class="btn btn-outline" style="color: var(--danger); border-color: var(--danger); font-size: 0.8rem; padding: 0.3rem 0.6rem;" onclick="handleLogout()">🚪 Déconnexion</button>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <span class="stat-card-title">Total Restaurants</span>
                    <span class="stat-card-value">${activeRestos.length} actifs</span>
                </div>
                <div class="stat-card">
                    <span class="stat-card-title">En attente d'activation</span>
                    <span class="stat-card-value" style="color: ${pendingCount > 0 ? 'var(--accent)' : 'inherit'}">${pendingCount} demandes</span>
                </div>
                <div class="stat-card">
                    <span class="stat-card-title">Volume d'affaires généré</span>
                    <span class="stat-card-value">${totalGmv.toLocaleString()} FCFA</span>
                </div>
                <div class="stat-card">
                    <span class="stat-card-title">Commandes / Réservations</span>
                    <span class="stat-card-value">${orders.length} | ${reservations.length}</span>
                </div>
            </div>

            <!-- Section Abonnements -->
            ${(function() {
                let totalPlatformRevenue = 0;
                let rowsHtml = restos.filter(r => r.status !== 'pending').map(r => {
                    const createdAt = new Date(r.createdAt || '2026-06-25T00:00:00Z');
                    const diffTime = Math.abs(new Date() - createdAt);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    let daysLeft = 90 - diffDays;
                    let packSubscribed = r.subscriptionPack || 'Aucun (Gratuit)';
                    let revenue = 0;
                    
                    if (packSubscribed === 'Pack Simple') revenue = 3000;
                    else if (packSubscribed === 'Pack Startup') revenue = 5000;
                    else if (packSubscribed === 'Pack Entreprise') revenue = 15000;
                    
                    if (r.status === 'active' || r.status === 'suspended') {
                        totalPlatformRevenue += revenue;
                    }
                    
                    let statusHtml = '';
                    if (daysLeft > 0) {
                        statusHtml = `<span class="badge badge-success">En cours (${daysLeft} jrs restants)</span>`;
                    } else {
                        statusHtml = `<span class="badge badge-danger">Expiré</span>`;
                    }
                    
                    return `
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 1rem;"><strong>${r.name}</strong></td>
                        <td style="padding: 1rem;">${statusHtml}</td>
                        <td style="padding: 1rem;"><span class="badge" style="background: ${packSubscribed === 'Aucun (Gratuit)' ? '#e2e8f0' : 'rgba(var(--accent-rgb), 0.1)'}; color: ${packSubscribed === 'Aucun (Gratuit)' ? '#64748b' : 'var(--accent)'};">${packSubscribed}</span></td>
                        <td style="padding: 1rem; font-weight: 700; color: var(--text-secondary);">${revenue > 0 ? revenue.toLocaleString() + ' FCFA' : '0 FCFA'}</td>
                    </tr>`;
                }).join('');
                
                return `
                <section style="background: var(--bg-card); padding: 1.5rem; border-radius: 12px; box-shadow: var(--shadow); margin-bottom: 2rem; border: 1px solid var(--border);">
                    <h3 style="margin-top: 0; color: var(--text-primary); border-bottom: 2px solid var(--border); padding-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                        <span>💳 Abonnements & Revenus Plateforme</span>
                        <span style="color: var(--success); font-weight: 800; font-size: 1.2rem; background: rgba(var(--success-rgb), 0.1); padding: 0.4rem 0.8rem; border-radius: 8px;">Revenus Plateforme: ${totalPlatformRevenue.toLocaleString()} FCFA / mois</span>
                    </h3>
                    <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">Suivi des packs d'hébergement souscrits par les restaurants après leurs 3 mois gratuits.</p>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; min-width: 600px;">
                            <thead>
                                <tr style="background: var(--bg-secondary); text-align: left; border-bottom: 2px solid var(--border);">
                                    <th style="padding: 1rem;">Restaurant</th>
                                    <th style="padding: 1rem;">Statut Gratuité</th>
                                    <th style="padding: 1rem;">Pack Souscrit</th>
                                    <th style="padding: 1rem;">Revenu (Mensuel)</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rowsHtml || '<tr><td colspan="4" style="padding: 1rem; text-align: center; color: var(--text-secondary);">Aucun restaurant actif</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </section>`;
            })()}

            <!-- Tab selections -->
            <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; flex-wrap: wrap;">
                <button class="btn btn-sm ${adminActiveTab === 'pending' ? 'btn-primary' : 'btn-secondary'}" onclick="switchAdminTab('pending')">⏳ Demandes (${pendingCount})</button>
                <button class="btn btn-sm ${adminActiveTab === 'active' ? 'btn-primary' : 'btn-secondary'}" onclick="switchAdminTab('active')">🏪 Réseau Actif (${activeRestos.length})</button>
                <button class="btn btn-sm ${adminActiveTab === 'create' ? 'btn-primary' : 'btn-secondary'}" onclick="switchAdminTab('create')">➕ Ajouter</button>
                <button class="btn btn-sm ${adminActiveTab === 'accounting' ? 'btn-primary' : 'btn-secondary'}" onclick="switchAdminTab('accounting')">📊 Comptabilité</button>
            </div>


            <div id="admin-table-container">
                <!-- Tables populated dynamically -->
            </div>
        </div>
    `;

    renderAdminTabTable();
}

function switchAdminTab(tab) {
    adminActiveTab = tab;
    renderAdminView();
}

function renderAdminTabTable() {
    const tableContainer = document.getElementById('admin-table-container');
    const restos = store.getRestaurants();
    
    if (adminActiveTab === 'pending') {
        const pending = restos.filter(r => r.status === 'pending');
        
        if (pending.length === 0) {
            tableContainer.innerHTML = `<div style="text-align: center; background: var(--bg-card); padding: 3rem; border-radius: 16px; color: var(--text-secondary); border: 1px solid var(--border);">Aucune demande d'inscription en attente.</div>`;
            return;
        }

        let rowsHtml = '';
        pending.forEach(r => {
            rowsHtml += `
                <tr>
                    <td><strong>${r.name}</strong></td>
                    <td>${r.category}</td>
                    <td>${r.address}</td>
                    <td><a href="https://wa.me/${r.whatsapp.replace(/\+/g, '')}" target="_blank" class="call-btn">💬 ${r.whatsapp}</a></td>
                    <td>${r.openHours}</td>
                    <td>
                        <button class="btn btn-success btn-sm" onclick="approveRestaurant('${r.id}')">Valider (Activer) ✅</button>
                        <button class="btn btn-danger btn-sm" onclick="rejectRestaurant('${r.id}')">Refuser ❌</button>
                    </td>
                </tr>
            `;
        });

        tableContainer.innerHTML = `
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Catégorie</th>
                            <th>Adresse</th>
                            <th>WhatsApp</th>
                            <th>Horaires</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
            </div>
        `;
    } 
    else if (adminActiveTab === 'active') {
        const activeOrSuspended = restos.filter(r => r.status === 'active' || r.status === 'suspended');
        
        if (activeOrSuspended.length === 0) {
            tableContainer.innerHTML = `<div style="text-align: center; background: var(--bg-card); padding: 3rem; border-radius: 16px; color: var(--text-secondary);">Aucun restaurant configuré dans le réseau.</div>`;
            return;
        }

        let rowsHtml = '';
        activeOrSuspended.forEach(r => {
            const rOrdersList = store.getOrdersByRestaurant(r.id);
            const rReservations = store.getReservationsByRestaurant(r.id).length;
            const rCompletedOrders = rOrdersList.filter(o => o.status === 'completed' || o.status === 'delivered');
            const rRevenue = rCompletedOrders.reduce((sum, o) => sum + o.total, 0);
            
            const statusLabel = r.status === 'active' 
                ? `<span class="badge badge-success">Actif</span>` 
                : `<span class="badge badge-danger">Suspendu</span>`;
                
            const actionBtn = r.status === 'active'
                ? `<button class="btn btn-danger btn-sm" onclick="suspendRestaurant('${r.id}')">Suspendre 🔒</button>`
                : `<button class="btn btn-success btn-sm" onclick="reactivateRestaurant('${r.id}')">Réactiver 🔓</button>`;

            let packSubscribed = r.subscriptionPack || 'Aucun (Gratuit)';
            let selectPackHtml = `
                <select class="form-control" style="padding: 0.2rem; font-size: 0.8rem; height: auto;" onchange="updateRestaurantPack('${r.id}', this.value)">
                    <option value="Aucun (Gratuit)" ${packSubscribed === 'Aucun (Gratuit)' ? 'selected' : ''}>Gratuit (0 FCFA)</option>
                    <option value="Pack Simple" ${packSubscribed === 'Pack Simple' ? 'selected' : ''}>Simple (3k FCFA)</option>
                    <option value="Pack Startup" ${packSubscribed === 'Pack Startup' ? 'selected' : ''}>Startup (5k FCFA)</option>
                    <option value="Pack Entreprise" ${packSubscribed === 'Pack Entreprise' ? 'selected' : ''}>Entreprise (15k FCFA)</option>
                </select>
            `;

            rowsHtml += `
                <tr>
                    <td><strong>${r.name}</strong></td>
                    <td>${statusLabel}</td>
                    <td>${selectPackHtml}</td>
                    <td>${rOrdersList.length} Cmd(s)</td>
                    <td style="color: var(--success); font-weight: bold;">${rRevenue.toLocaleString()} FCFA</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="impersonateRestaurant('${r.id}')" title="Gérer ce restaurant">⚙️</button>
                        ${actionBtn}
                        <button class="btn btn-secondary btn-sm" onclick="router.navigate('/r/${r.slug}')" title="Visiter la page">🌐</button>
                    </td>
                </tr>
            `;
        });

        tableContainer.innerHTML = `
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Restaurant</th>
                            <th>Statut</th>
                            <th>Pack Abonnement</th>
                            <th>Commandes</th>
                            <th>C.A. Généré</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
        `;
    }
    else if (adminActiveTab === 'create') {
        tableContainer.innerHTML = `
            <div style="background: var(--bg-card); border: 1px solid var(--border); padding: 2rem; border-radius: 24px; max-width: 600px; margin: 0 auto; box-shadow: var(--shadow);">
                <h3 style="font-family: var(--font-serif); font-size: 1.35rem; margin-bottom: 1.5rem; text-align: center; color: var(--text-primary);">Créer un Nouveau Partenaire Restaurant</h3>
                
                <form id="admin-create-resto-form" onsubmit="handleAdminCreateRestaurant(event)">
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label class="form-label">Nom du restaurant <span class="required">*</span></label>
                        <input type="text" id="adm-reg-name" class="form-control" placeholder="L'Étoile de Thiès" required oninput="handleRestaurantNameInput(this.value, 'adm-reg-username', 'adm-reg-password', 'adm-slug-availability-badge')">
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label class="form-label">Adresse physique à Thiès <span class="required">*</span></label>
                        <input type="text" id="adm-reg-address" class="form-control" placeholder="Avenue de Caen, Thiès" required>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label class="form-label">Catégorie <span class="required">*</span></label>
                        <select id="adm-reg-category" class="form-control" required>
                            <option value="Traditionnel">Traditionnel (Thiéb, Yassa, Mafé)</option>
                            <option value="Grillades / Dibi">Grillades / Dibi (Dibiterie)</option>
                            <option value="Fast Food">Fast Food (Burgers, Chawarmas)</option>
                            <option value="Pâtisserie">Pâtisserie / Petit Déjeuner</option>
                            <option value="Gastronomique">Chic / Gastronomique</option>
                        </select>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label class="form-label">Numéro WhatsApp de contact <span class="required">*</span></label>
                        <input type="tel" id="adm-reg-whatsapp" class="form-control" placeholder="+221 77 XXX XX XX" required>
                    </div>
                    
                    <div class="form-row" style="margin-bottom: 1rem;">
                        <div class="form-group">
                            <label class="form-label">Heure d'ouverture <span class="required">*</span></label>
                            <input type="time" id="adm-reg-open" class="form-control" value="12:00" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Heure de fermeture <span class="required">*</span></label>
                            <input type="time" id="adm-reg-close" class="form-control" value="23:00" required>
                        </div>
                    </div>

                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label class="form-label">Identifiant de connexion (slug unique) <span class="required">*</span></label>
                        <input type="text" id="adm-reg-username" class="form-control" placeholder="letoile-thies" required oninput="checkSlugAvailabilityRealtime(this.value)">
                        <small style="color: var(--text-secondary); font-size: 0.75rem; display: block; margin-top: 0.25rem;">Généré automatiquement (modifiable).</small>
                        <div id="adm-slug-availability-badge" class="slug-status" style="margin-top: 0.35rem; font-size: 0.8rem; font-weight: 600;"></div>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 1.5rem;">
                        <label class="form-label">Mot de passe de connexion <span class="required">*</span></label>
                        <input type="password" id="adm-reg-password" class="form-control" placeholder="••••••••" required>
                        <small style="color: var(--text-secondary); font-size: 0.75rem; display: block; margin-top: 0.25rem;">Généré automatiquement par défaut (nom_221, modifiable).</small>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-block" style="font-weight: 700;">Ajouter le Restaurant au Réseau 🚀</button>
                </form>
            </div>
        `;
    }
    else if (adminActiveTab === 'accounting') {
        const allOrders = store.data.orders;
        const completedOrders = allOrders.filter(o => o.status === 'Livrée');
        const cancelledOrders = allOrders.filter(o => o.status === 'Annulée');
        const pendingOrders = allOrders.filter(o => o.status === 'Reçue' || o.status === 'Confirmée' || o.status === 'Prête');
        const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
        
        // Revenue per restaurant
        let revenueByResto = {};
        completedOrders.forEach(o => {
            const resto = restos.find(r => r.id === o.restaurantId);
            const name = resto ? resto.name : o.restaurantId;
            revenueByResto[name] = (revenueByResto[name] || 0) + o.total;
        });
        
        let revenueRowsHtml = '';
        Object.entries(revenueByResto).sort((a,b) => b[1] - a[1]).forEach(([name, rev]) => {
            const orderCount = completedOrders.filter(o => {
                const r = restos.find(r => r.name === name);
                return r && o.restaurantId === r.id;
            }).length;
            revenueRowsHtml += `
                <tr style="border-bottom: 1px solid var(--border);">
                    <td style="padding: 0.75rem;"><strong>${name}</strong></td>
                    <td style="padding: 0.75rem;">${orderCount}</td>
                    <td style="padding: 0.75rem; font-weight: 700; color: var(--success);">${rev.toLocaleString()} FCFA</td>
                </tr>
            `;
        });
        
        if (!revenueRowsHtml) {
            revenueRowsHtml = '<tr><td colspan="3" style="padding: 1.5rem; text-align: center; color: var(--text-secondary);">Aucune commande livrée pour le moment.</td></tr>';
        }

        // All orders list
        let allOrdersHtml = '';
        const sortedOrders = [...allOrders].sort((a,b) => (b.date + b.time).localeCompare(a.date + a.time));
        sortedOrders.forEach(o => {
            const resto = restos.find(r => r.id === o.restaurantId);
            const restoName = resto ? resto.name : o.restaurantId;
            const statusClass = o.status === 'Livrée' ? 'badge-success' : o.status === 'Annulée' ? 'badge-danger' : o.status === 'Reçue' ? 'badge-warning' : 'badge-info';
            allOrdersHtml += `
                <tr style="border-bottom: 1px solid var(--border);">
                    <td style="padding: 0.6rem; font-weight: 600;">${o.id}</td>
                    <td style="padding: 0.6rem;">${restoName}</td>
                    <td style="padding: 0.6rem;">${o.customerName}</td>
                    <td style="padding: 0.6rem;">${o.date} ${o.time}</td>
                    <td style="padding: 0.6rem;"><span class="badge ${statusClass}">${o.status}</span></td>
                    <td style="padding: 0.6rem; font-weight: 700; color: var(--primary);">${o.total.toLocaleString()} FCFA</td>
                </tr>
            `;
        });
        
        if (!allOrdersHtml) {
            allOrdersHtml = '<tr><td colspan="6" style="padding: 2rem; text-align: center; color: var(--text-secondary);">Aucune commande enregistrée sur la plateforme.</td></tr>';
        }

        tableContainer.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                <div class="stat-card" style="border-top: 4px solid var(--success); background: var(--bg-card); padding: 1.25rem; border-radius: 16px; box-shadow: var(--shadow);">
                    <span style="color: var(--text-secondary); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 0.5rem;">💰 Chiffre d'Affaires Global</span>
                    <span style="font-size: 1.75rem; font-weight: 800; color: var(--success);">${totalRevenue.toLocaleString()} FCFA</span>
                </div>
                <div class="stat-card" style="border-top: 4px solid var(--primary); background: var(--bg-card); padding: 1.25rem; border-radius: 16px; box-shadow: var(--shadow);">
                    <span style="color: var(--text-secondary); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 0.5rem;">📦 Total Commandes</span>
                    <span style="font-size: 1.75rem; font-weight: 800; color: var(--text-primary);">${allOrders.length}</span>
                </div>
                <div class="stat-card" style="border-top: 4px solid var(--accent); background: var(--bg-card); padding: 1.25rem; border-radius: 16px; box-shadow: var(--shadow);">
                    <span style="color: var(--text-secondary); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 0.5rem;">⏳ En Attente</span>
                    <span style="font-size: 1.75rem; font-weight: 800; color: var(--accent);">${pendingOrders.length}</span>
                </div>
                <div class="stat-card" style="border-top: 4px solid var(--danger); background: var(--bg-card); padding: 1.25rem; border-radius: 16px; box-shadow: var(--shadow);">
                    <span style="color: var(--text-secondary); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 0.5rem;">❌ Annulées</span>
                    <span style="font-size: 1.75rem; font-weight: 800; color: var(--danger);">${cancelledOrders.length}</span>
                </div>
            </div>
            
            <h3 style="font-size: 1.2rem; margin-bottom: 1rem; color: var(--text-primary);">📊 Revenus par Restaurant</h3>
            <div class="table-responsive" style="margin-bottom: 2rem;">
                <table class="admin-table" style="width: 100%;">
                    <thead><tr><th style="padding: 0.75rem;">Restaurant</th><th style="padding: 0.75rem;">Commandes Livrées</th><th style="padding: 0.75rem;">C.A. Généré</th></tr></thead>
                    <tbody>${revenueRowsHtml}</tbody>
                </table>
            </div>

            <h3 style="font-size: 1.2rem; margin-bottom: 1rem; color: var(--text-primary);">📋 Historique de toutes les Commandes</h3>
            <div class="table-responsive">
                <table class="admin-table" style="width: 100%;">
                    <thead><tr><th style="padding: 0.6rem;">N°</th><th style="padding: 0.6rem;">Restaurant</th><th style="padding: 0.6rem;">Client</th><th style="padding: 0.6rem;">Date</th><th style="padding: 0.6rem;">Statut</th><th style="padding: 0.6rem;">Montant</th></tr></thead>
                    <tbody>${allOrdersHtml}</tbody>
                </table>
            </div>
        `;
    }
}

function handleAdminCreateRestaurant(e) {
    e.preventDefault();
    
    const name = document.getElementById('adm-reg-name').value.trim();
    const address = document.getElementById('adm-reg-address').value.trim();
    const category = document.getElementById('adm-reg-category').value;
    const whatsapp = cleanPhoneNumber(document.getElementById('adm-reg-whatsapp').value.trim());
    const openH = document.getElementById('adm-reg-open').value;
    const closeH = document.getElementById('adm-reg-close').value;
    const username = document.getElementById('adm-reg-username').value.trim().toLowerCase();
    const password = document.getElementById('adm-reg-password').value;
    
    if (!/^\+221(70|75|76|77|78)\d{7}$/.test(whatsapp.replace(/\s+/g, ''))) {
        showToast("Numéro WhatsApp invalide (ex: +221 77 XXX XX XX)", "danger");
        return;
    }

    // Check availability
    const exists = store.getRestaurants().find(r => r.username === username || r.slug === username);
    if (exists) {
        showToast("Cet identifiant est déjà utilisé", "danger");
        return;
    }

    const newId = "r" + (store.getRestaurants().length + 1);
    const slug = username.replace(/[^a-z0-9]/g, '-');
    
    const newResto = {
        id: newId,
        name,
        slug,
        rating: 5.0,
        reviewsCount: 0,
        category,
        address,
        whatsapp,
        openHours: `${openH} - ${closeH}`,
        closedDays: [],
        isOpenManual: true,
        status: "active",
        username,
        password,
        menu: [],
        reviews: []
    };

    store.addRestaurant(newResto);
    showToast(`Restaurant "${name}" ajouté avec succès dans le réseau !`, "success");
    
    switchAdminTab('active');
}

// Admin actions
function approveRestaurant(id) {
    const r = store.getRestaurantById(id);
    if (!r) return;
    
    store.updateRestaurant(id, { status: "active" });
    showToast(`Restaurant ${r.name} activé avec succès !`, "success");
    
    // Create WhatsApp confirmation message
    const waText = `Bonjour ${r.name}, nous avons le plaisir de vous informer que votre inscription sur THIES Resto a été validée par notre équipe ! 🥳

Vous pouvez dès à présent vous connecter à votre Tableau de Bord avec vos identifiants pour gérer vos plats du jour, commandes et réservations.

Lien d'accès : ${window.location.origin}${window.location.pathname}#/auth

Bienvenue dans le réseau !`;
    const waLink = `https://wa.me/${r.whatsapp.replace(/\+/g, '')}?text=${encodeURIComponent(waText)}`;
    
    renderAdminView();
    window.open(waLink, '_blank');
}

function rejectRestaurant(id) {
    const r = store.getRestaurantById(id);
    if (!r) return;
    
    if (confirm(`Voulez-vous rejeter et supprimer définitivement la demande de "${r.name}" ?`)) {
        store.deleteRestaurant(id);
        showToast("Demande supprimée", "info");
        renderAdminView();
    }
}

function suspendRestaurant(id) {
    const r = store.getRestaurantById(id);
    if (!r) return;
    
    store.updateRestaurant(id, { status: "suspended" });
    showToast(`Restaurant ${r.name} suspendu temporairement`, "warning");
    renderAdminView();
}

function reactivateRestaurant(id) {
    const r = store.getRestaurantById(id);
    if (!r) return;
    
    store.updateRestaurant(id, { status: "active" });
    showToast(`Restaurant ${r.name} réactivé`, "success");
    renderAdminView();
}

window.updateRestaurantPack = function(id, packName) {
    const r = store.getRestaurantById(id);
    if (!r) return;
    
    // Si on attribue un pack payant, le restaurant doit être réactivé
    const newStatus = r.status === 'suspended' && packName !== 'Aucun (Gratuit)' ? 'active' : r.status;
    
    store.updateRestaurant(id, { subscriptionPack: packName, status: newStatus });
    showToast(`Pack ${packName} attribué à ${r.name}`, "success");
    renderAdminView();
};

function impersonateRestaurant(id) {
    const r = store.getRestaurantById(id);
    if (!r) return;
    
    currentRestaurantSession = r;
    sessionStorage.setItem('restaurantSession', JSON.stringify(r));
    showToast(`Session administrateur activée pour "${r.name}"`, "success");
    router.navigate('/dashboard');
}

function exitImpersonation() {
    currentRestaurantSession = null;
    sessionStorage.removeItem('restaurantSession');
    showToast("Retour à la console Super-Admin", "info");
    router.navigate('/admin');
}

function exportOrdersToCSV() {
    const r = store.getRestaurantById(currentRestaurantSession.id);
    if (!r) return;
    const orders = store.getOrdersByRestaurant(r.id);
    if (orders.length === 0) {
        showToast("Aucune commande à exporter", "warning");
        return;
    }
    
    let csvContent = "\ufeff"; // BOM for Excel UTF-8 support
    csvContent += "ID Commande;Date;Heure;Client;Telephone;Mode de Recuperation;Total (FCFA);Statut;Plats;Note\n";
    
    orders.forEach(o => {
        const dishesList = o.items.map(i => `${i.name} (x${i.qty})`).join(', ');
        const client = o.customerName.replace(/"/g, '""');
        const phone = o.customerPhone;
        const note = (o.note || '').replace(/"/g, '""').replace(/\n/g, ' ');
        const row = [
            o.id,
            o.date,
            o.time,
            `"${client}"`,
            `"${phone}"`,
            o.mode,
            o.total,
            o.status,
            `"${dishesList.replace(/"/g, '""')}"`,
            `"${note}"`
        ].join(';');
        csvContent += row + "\n";
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const encodedUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUrl);
    link.setAttribute("download", `commandes_${r.slug}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Fichier CSV des commandes téléchargé !", "success");
}

function exportReservationsToCSV() {
    const r = store.getRestaurantById(currentRestaurantSession.id);
    if (!r) return;
    const reservations = store.getReservationsByRestaurant(r.id);
    if (reservations.length === 0) {
        showToast("Aucune réservation à exporter", "warning");
        return;
    }
    
    let csvContent = "\ufeff"; // BOM for Excel UTF-8 support
    csvContent += "ID Reservation;Date;Heure;Client;Telephone;Couverts;Statut;Note\n";
    
    reservations.forEach(res => {
        const client = res.customerName.replace(/"/g, '""');
        const phone = res.customerPhone;
        const note = (res.note || '').replace(/"/g, '""').replace(/\n/g, ' ');
        const row = [
            res.id,
            res.date,
            res.time,
            `"${client}"`,
            `"${phone}"`,
            res.guests,
            res.status,
            `"${note}"`
        ].join(';');
        csvContent += row + "\n";
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const encodedUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUrl);
    link.setAttribute("download", `reservations_${r.slug}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Fichier CSV des réservations téléchargé !", "success");
}

// ----------------------------------------------------
// Hamburger & Drawer Logic
// ----------------------------------------------------
function toggleMobileMenu() {
    const drawer = document.getElementById('mobile-drawer');
    const backdrop = document.getElementById('drawer-backdrop');
    const btn = document.getElementById('hamburger-btn');
    if (drawer && backdrop) {
        drawer.classList.toggle('active');
        backdrop.classList.toggle('active');
        btn.classList.toggle('active');
    }
}

// ----------------------------------------------------
// Page: POLITIQUE CLIENT
// ----------------------------------------------------
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
            }, 500);
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
            `;
        }
    } else if (currentRestaurantSession) {
        html = `
            <span class="badge badge-success">${currentRestaurantSession.name}</span>
            <button class="btn btn-primary btn-sm" onclick="router.navigate('/dashboard')">Tableau de Bord 📊</button>
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
    setDynamicMeta('THIES Resto — Plateforme de Restauration Commune à Thiès, Sénégal', 'icon.png');
    try {
        // Hide cart bar
        const cartBar = document.getElementById('floating-cart-bar');
        if (cartBar) cartBar.style.display = 'none';
        
        if (typeof stopOrderPolling === 'function') stopOrderPolling();
        if (typeof loadCart === 'function') loadCart();
    
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

    const hour = new Date().getHours();
    let greeting = "Bonjour";
    if (hour < 11) greeting = "Bonjour ! Prêt pour le déjeuner ?";
    else if (hour < 17) greeting = "Une petite faim ?";
    else greeting = "Bonsoir ! Ne cuisinez pas ce soir.";

    container.innerHTML = `
        <!-- ========== HERO SECTION ========== -->
        <section class="hero-section" style="background: linear-gradient(rgba(10, 10, 12, 0.8), rgba(10, 10, 12, 0.95)), url('https://images.unsplash.com/photo-1544025162-d76694265947?w=1920&auto=format&fit=crop&q=80') center/cover fixed; padding: 6rem 1.5rem 5rem 1.5rem;">
            <div class="hero-split-container">
                <!-- Left: Title, Description and Search -->
                <div class="hero-left-col">
                    
                    <div style="margin: 0 0 1.5rem 0; width: 100px; height: 100px; border-radius: 50%; box-shadow: 0 10px 30px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; overflow: hidden; border: 2px solid var(--primary);"><img src="icon.png" alt="THIES Resto Logo" style="width: 100%; height: 100%; object-fit: cover;"></div><h1 class="hero-title" style="color: var(--primary); text-shadow: 0 2px 10px rgba(0,0,0,0.5);">Découvrez les Meilleures Tables de <span>Thiès</span></h1>
                    <p class="hero-subtitle" style="color: var(--text-secondary); font-size: 1.1rem;">Commandez vos plats du jour locaux en direct ou réservez votre table en quelques clics. Paiement à la livraison ou sur place. Simple, rapide et sans commission.</p>
                    
                    <div class="search-container" style="margin: 0 0 2rem 0; width: 100%; max-width: 480px;">
                        <input type="text" id="search-input-field" class="search-input" placeholder="Rechercher un plat, un restaurant..." oninput="applyFilters()" style="background: rgba(255,255,255,0.1); color: var(--primary); border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(10px);">
                        <button class="search-btn" style="color: var(--primary);">🔍</button>
                    </div>

                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <button class="btn btn-primary" onclick="scrollToCatalog()" style="box-shadow: 0 4px 15px rgba(242,107,33,0.4);">Explorer nos Menus 🍽️</button>
                        <button class="btn btn-secondary" onclick="geolocateRestaurants()" style="background: rgba(255,255,255,0.1); color: var(--primary); border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(5px);">📍 Trouver autour de moi</button>
                    </div>
                </div>
                
                </div></div></section>
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

    if (typeof applyFilters === 'function') applyFilters();
    hideLoadingOverlay();
    } catch (err) {
        console.error("Error in home route:", err);
        hideLoadingOverlay();
        const container = document.getElementById('main-content');
        if (container) {
            container.innerHTML = `<div style="padding: 100px; text-align: center; color: red;">Une erreur est survenue lors du chargement : ${err.message}</div>`;
        }
    }
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
        
        const coverUrl = r.coverImage || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60';
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
        "image": r.coverImage || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60",
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

window.shareRestaurant = function(name, slug) {
    const url = 'https://thies-resto.com/#/r/' + slug;
    const text = "Regarde ce restaurant sur THIES Resto, on commande ce soir ? " + name;
    
    if (navigator.share) {
        navigator.share({
            title: name,
            text: text,
            url: url
        }).catch(console.error);
    } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(text + " : " + url)
            .then(() => {
                if (typeof showToast === 'function') showToast("Lien copié dans le presse-papiers !", "success");
            })
            .catch(() => {
                window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(text + " " + url), '_blank');
            });
    }
};

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
                <button class="btn btn-primary btn-sm" onclick="shareRestaurant('${r.name}', '${r.slug}')">
                    📤 Partager à un ami
                </button>
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
            ? `<button class="btn btn-primary btn-block" onclick="openProductModal('${r.id}', '${d.id}')">Choisir & Ajouter 🛒</button>`
            : `<button class="btn btn-secondary btn-block" disabled>Fermé temporairement</button>`;

        html += `
            <div class="dish-card" onclick="if(isRestaurantOpenNow(store.getRestaurantById('${r.id}'))) openProductModal('${r.id}', '${d.id}')" style="cursor: pointer;">
                <div class="dish-img-container">
                    <img src="${d.image}" class="dish-image" alt="${d.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'">
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

window.openProductModal = function(restaurantId, dishId) {
    const r = store.getRestaurantById(restaurantId);
    const dish = r.menu.find(d => d.id === dishId);
    if (!dish) return;

    let modal = document.getElementById('product-detail-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'product-detail-modal';
        document.body.appendChild(modal);
    }
    
    // Default quantity
    window.currentProductQty = 1;

    modal.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #0c0e12; z-index: 9999; display: flex; flex-direction: column; animation: slideUp 0.3s ease-out; overflow-y: auto;">
            <!-- Header -->
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; position: absolute; top: 0; left: 0; width: 100%; z-index: 10;">
                <button onclick="document.getElementById('product-detail-modal').remove()" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); width: 45px; height: 45px; border-radius: 50%; color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; cursor: pointer; backdrop-filter: blur(5px);">
                    ←
                </button>
                <div style="position: relative;" onclick="document.getElementById('product-detail-modal').remove(); openCartTab();">
                    <button style="background: var(--primary); border: none; width: 45px; height: 45px; border-radius: 50%; color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; cursor: pointer; box-shadow: 0 4px 15px rgba(207,168,83,0.4);">
                        🛒
                    </button>
                    <span style="position: absolute; top: -5px; right: -5px; background: white; color: var(--primary); font-size: 0.75rem; font-weight: 800; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                        ${cart.items.length}
                    </span>
                </div>
            </div>

            <!-- Image Hero -->
            <div style="flex: 1; min-height: 40vh; position: relative; display: flex; align-items: center; justify-content: center; padding: 5rem 2rem 2rem 2rem; background: radial-gradient(circle at center, rgba(207,168,83,0.15) 0%, transparent 60%);">
                <img src="${dish.image}" style="width: 280px; height: 280px; object-fit: cover; border-radius: 50%; box-shadow: 0 20px 40px rgba(0,0,0,0.6); border: 4px solid rgba(255,255,255,0.05);" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'">
            </div>

            <!-- Curved Separator -->
            <div style="width: 100%; height: 30px; background: transparent; position: relative; overflow: hidden; margin-top: -15px;">
                <div style="position: absolute; top: 15px; left: -10%; width: 120%; height: 100px; border-top: 1px solid rgba(207,168,83,0.3); border-radius: 50%; box-shadow: 0 -10px 30px rgba(207,168,83,0.1);"></div>
            </div>

            <!-- Details Section -->
            <div style="background: #0c0e12; padding: 2rem 1.5rem; flex: 1; border-top-left-radius: 30px; border-top-right-radius: 30px; display: flex; flex-direction: column;">
                
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                    <h2 style="color: var(--primary); font-size: 1.8rem; font-family: var(--font-serif); font-weight: 700; margin: 0; max-width: 65%;">${dish.name}</h2>
                    <span style="color: var(--primary); font-size: 1.6rem; font-weight: 800;">${dish.price} <span style="font-size: 1rem;">FCFA</span></span>
                </div>
                
                <p style="color: rgba(255,255,255,0.6); font-size: 0.95rem; line-height: 1.5; margin-bottom: 2rem;">${dish.description}</p>

                <!-- Controls -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="display: flex; flex-direction: column;">
                        <span style="color: rgba(255,255,255,0.5); font-size: 0.75rem; font-weight: 700; letter-spacing: 1px; margin-bottom: 0.5rem; text-transform: uppercase;">Quantité</span>
                        <div style="display: flex; align-items: center; gap: 1rem; background: #16181d; border-radius: 30px; padding: 0.25rem; border: 1px solid rgba(255,255,255,0.05);">
                            <button onclick="if(window.currentProductQty > 1) { window.currentProductQty--; document.getElementById('modal-qty-val').innerText = window.currentProductQty; }" style="background: var(--primary); border: none; width: 35px; height: 35px; border-radius: 50%; color: var(--primary); font-weight: bold; font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center;">-</button>
                            <span id="modal-qty-val" style="color: var(--primary); font-weight: 700; font-size: 1.2rem; min-width: 20px; text-align: center;">1</span>
                            <button onclick="window.currentProductQty++; document.getElementById('modal-qty-val').innerText = window.currentProductQty;" style="background: var(--primary); border: none; width: 35px; height: 35px; border-radius: 50%; color: var(--primary); font-weight: bold; font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center;">+</button>
                        </div>
                    </div>
                </div>

                <!-- Action Button -->
                <button onclick="addModalItemToCart('${restaurantId}', '${dishId}'); document.getElementById('product-detail-modal').remove();" style="background: var(--primary); color: var(--primary); border: none; width: 100%; padding: 1.25rem; border-radius: 20px; font-size: 1.1rem; font-weight: 700; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 0.5rem; box-shadow: 0 10px 25px rgba(207,168,83,0.3); transition: transform 0.2s;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                    AJOUTER AU PANIER
                </button>
            </div>
        </div>
    `;
}

window.addModalItemToCart = function(restaurantId, dishId) {
    const qty = window.currentProductQty || 1;
    
    // Re-use logic from addToCart but with quantity
    const r = store.getRestaurantById(restaurantId);
    const dish = r.menu.find(d => d.id === dishId);
    if (!dish) return;
    
    if (cart.restaurantId && cart.restaurantId !== restaurantId && cart.items.length > 0) {
        const oldResto = store.getRestaurantById(cart.restaurantId);
        const oldName = oldResto ? oldResto.name : "un autre restaurant";
        const confirmClear = confirm(`Votre panier contient déjà des plats de "${oldName}". Voulez-vous vider votre panier actuel pour commander chez "${r.name}" ?`);
        if (!confirmClear) return;
        cart = { restaurantId: restaurantId, items: [], total: 0 };
    }

    if (!cart.restaurantId) cart.restaurantId = restaurantId;

    const existingItem = cart.items.find(i => i.id === dishId);
    if (existingItem) {
        existingItem.qty += qty;
    } else {
        cart.items.push({
            id: dish.id,
            name: dish.name,
            price: dish.price,
            qty: qty
        });
    }

    cart.total += dish.price * qty;
    saveCart();
    
    if (document.getElementById('panel-checkout')) {
        renderCheckoutTab(store.getRestaurantById(restaurantId));
    }
    updateFloatingCartBar(store.getRestaurantById(restaurantId));
    
    showToast(`(${qty}) ${dish.name} ajouté(s) au panier ! 🛒`, "success");
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
                <div style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin-top: 0.25rem;">Total à payer : <span class="cart-total-price">${cart.total} FCFA</span></div>
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

// Rate Limiter to prevent spam
function checkOrderRateLimit() {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    let timestamps = JSON.parse(localStorage.getItem('thies_order_timestamps') || '[]');
    
    // Filter timestamps within the last hour
    timestamps = timestamps.filter(ts => now - ts < oneHour);
    
    if (timestamps.length >= 3) {
        if(typeof showToast === 'function') showToast("Limite anti-spam atteinte : maximum 3 envois par heure. Veuillez patienter.", "danger");
        return false;
    }
    
    timestamps.push(now);
    localStorage.setItem('thies_order_timestamps', JSON.stringify(timestamps));
    return true;
}

// Submission of client order
function submitSimpleOrder(e, restaurantId) {
    e.preventDefault();
    
    if (!checkOrderRateLimit()) return;
    
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
                    <select id="review-rating" class="form-control" required style="background: rgba(255,255,255,0.05); color: var(--primary); border: 1px solid rgba(255,255,255,0.2);">
                        <option value="5" style="color: black;">⭐⭐⭐⭐⭐ Parfait !</option>
                        <option value="4" style="color: black;">⭐⭐⭐⭐ Très bien</option>
                        <option value="3" style="color: black;">⭐⭐⭐ Bien</option>
                        <option value="2" style="color: black;">⭐⭐ Moyen</option>
                        <option value="1" style="color: black;">⭐ Décevant</option>
                    </select>
                </div>
                <div class="form-group" style="text-align: left;">
                    <label class="form-label">Commentaire (optionnel)</label>
                    <textarea id="review-comment" class="form-control" rows="2" placeholder="Qu'avez-vous pensé du repas ?" style="background: rgba(255,255,255,0.05); color: var(--primary); border: 1px solid rgba(255,255,255,0.2);"></textarea>
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
    
    if (!checkOrderRateLimit()) return;
    
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
    
    if (!checkOrderRateLimit()) return;
    
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
                <h1 style="font-family: var(--font-serif); font-size: 2rem; color: var(--text-primary); margin-top: 0.5rem; margin-bottom: 0.25rem;">Politique d'utilisation — Espace Client</h1>
                <p style="color: var(--text-secondary); font-size: 0.9rem; font-style: italic;">Cette politique s'applique à toute personne utilisant la plateforme Thiès Resto pour consulter un menu, passer une commande, participer à une commande de groupe, réserver une table ou laisser un avis.</p>
            </div>
            
            <div class="policy-content" style="color: var(--text-secondary); line-height: 1.7; font-size: 0.95rem;">
                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">1. Aucun compte requis</h3>
                <p>Thiès Resto ne demande jamais la création d'un compte ni d'identifiants pour commander, réserver ou participer à une commande de groupe. Vous fournissez uniquement les informations nécessaires au traitement de votre demande : nom, prénom, et numéro de téléphone.</p>

                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">2. Informations que vous transmettez</h3>
                <p>Lorsque vous passez une commande, réservez une table, ou laissez un avis, vous transmettez au restaurant concerné :</p>
                <ul style="margin-left: 1.5rem; margin-bottom: 1rem; list-style-type: disc;">
                    <li>Votre nom et prénom</li>
                    <li>Votre numéro de téléphone (utilisé pour vous contacter sur WhatsApp au sujet de votre commande ou réservation)</li>
                    <li>Le détail de votre commande, votre mode de récupération choisi, et toute note ou demande particulière que vous indiquez</li>
                    <li>Pour une réservation : la date, l'heure et le nombre de personnes souhaité</li>
                </ul>
                <p>Ces informations sont transmises uniquement au restaurant concerné. Thiès Resto ne les revend à aucun tiers et ne les utilise pas à des fins publicitaires.</p>

                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">3. Commande de groupe</h3>
                <p>Si vous participez à une commande de groupe créée par une autre personne, votre prénom et le plat que vous choisissez sont visibles par les autres participants au sein de cette commande de groupe, ainsi que par le restaurant au moment de l'envoi de la commande complète.</p>

                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">4. Exactitude de vos informations</h3>
                <p>Vous êtes responsable de l'exactitude des informations que vous transmettez, notamment votre numéro de téléphone. Un numéro incorrect peut empêcher le restaurant de vous contacter pour confirmer votre commande ou votre réservation.</p>

                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">5. Paiement</h3>
                <p>Thiès Resto ne collecte aucun paiement en ligne. Le règlement de votre commande se fait directement auprès du restaurant, en espèces, à la livraison ou sur place, selon le mode que vous avez choisi. Thiès Resto n'intervient à aucune étape de cette transaction financière.</p>

                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">6. Avis clients</h3>
                <p>Si vous laissez un avis (note et commentaire) après une commande ou une réservation, celui-ci est rendu public sur la page du restaurant concerné. Le restaurant peut y répondre publiquement. Vous vous engagez à rédiger un avis sincère et respectueux. Thiès Resto se réserve le droit de masquer un avis manifestement abusif, injurieux ou sans rapport avec une expérience réelle.</p>

                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">7. Statut et disponibilité du restaurant</h3>
                <p>Les informations affichées (statut Ouvert/Fermé, menu du jour, créneaux de réservation disponibles) sont saisies et mises à jour par le restaurant lui-même. Thiès Resto ne garantit pas en temps réel l'exactitude absolue de ces informations en cas de retard de mise à jour par le restaurant. En cas de doute, le bouton de confirmation WhatsApp vous permet de vérifier directement auprès du restaurant.</p>

                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">8. Confirmation par WhatsApp</h3>
                <p>Après l'envoi d'une commande ou d'une réservation, un bouton vous permet d'envoyer également un message de confirmation directement au restaurant via WhatsApp. Cette étape est facultative mais recommandée, notamment en cas de connexion internet instable, pour vous assurer que votre demande a bien été reçue.</p>

                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">9. Programme de fidélité</h3>
                <p>Si le restaurant propose un programme de fidélité, vos points sont associés à votre numéro de téléphone et cumulés automatiquement à chaque commande validée. Aucune carte physique ni application n'est nécessaire. Les conditions exactes du programme (seuil de récompense, type de récompense) sont définies librement par chaque restaurant.</p>

                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">10. Responsabilité</h3>
                <p>Thiès Resto met en relation le client et le restaurant mais n'est pas partie à la transaction commerciale elle-même (préparation du repas, qualité du service, respect des horaires annoncés). Toute réclamation relative au déroulement d'une commande ou d'une réservation doit être adressée directement au restaurant concerné.</p>

                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">11. Évolutions de cette politique</h3>
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
                <h1 style="font-family: var(--font-serif); font-size: 2rem; color: var(--text-primary); margin-top: 0.5rem; margin-bottom: 0.25rem;">Politique d'utilisation — Espace Administrateur</h1>
                <p style="color: var(--text-secondary); font-size: 0.9rem; font-style: italic;">Cette politique s'applique au restaurant utilisant son tableau de bord Thiès Resto pour gérer son menu, ses commandes, ses réservations et ses avis clients.</p>
            </div>
            
            <div class="policy-content" style="color: var(--text-secondary); line-height: 1.7; font-size: 0.95rem;">
                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">1. Accès et compte</h3>
                <p>L'accès au tableau de bord administrateur est protégé par un identifiant et un mot de passe propres à votre restaurant. Vous êtes responsable de la confidentialité de ces identifiants. Ne les partagez qu'avec les membres de votre équipe autorisés à gérer les commandes et le menu.</p>
                <p>En cas de doute sur une utilisation non autorisée de votre compte, changez votre mot de passe immédiatement depuis l'onglet Paramètres.</p>

                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">2. Exactitude des informations publiées</h3>
                <p>Vous vous engagez à maintenir à jour les informations suivantes, visibles publiquement par vos clients :</p>
                <ul style="margin-left: 1.5rem; margin-bottom: 1rem; list-style-type: disc;">
                    <li>Le statut Ouvert / Fermé de votre restaurant, reflété en temps réel</li>
                    <li>Le menu du jour : plats disponibles, prix en FCFA, descriptions</li>
                    <li>Les horaires d'ouverture et les créneaux de réservation proposés</li>
                    <li>Vos coordonnées de contact (numéro WhatsApp, adresse)</li>
                </ul>
                <p>Une information erronée (plat indisponible affiché comme disponible, statut « Ouvert » alors que le restaurant est fermé) peut entraîner une mauvaise expérience client et nuire à votre réputation. Il est de votre responsabilité de garder ces données exactes.</p>

                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">3. Traitement des commandes et réservations</h3>
                <p>Chaque commande ou réservation reçue déclenche une notification immédiate sur votre tableau de bord et une option d'envoi WhatsApp. Vous vous engagez à :</p>
                <ul style="margin-left: 1.5rem; margin-bottom: 1rem; list-style-type: disc;">
                    <li>Traiter les commandes en attente dans un délai raisonnable</li>
                    <li>Mettre à jour le statut de chaque commande (Confirmée, Prête, Livrée) afin que le client soit informé automatiquement</li>
                    <li>Confirmer ou annuler les réservations de table dans un délai raisonnable avant la date prévue</li>
                    <li>Ne pas annuler une commande ou une réservation déjà confirmée sans en informer le client par WhatsApp</li>
                </ul>

                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">4. Gestion des avis clients</h3>
                <p>Les avis laissés par les clients sur votre page sont publics et ne peuvent pas être supprimés by the restaurant. Vous disposez d'un droit de réponse publique à chaque avis depuis votre tableau de bord. Les réponses doivent rester professionnelles et respectueuses, y compris face à un avis négatif ou injuste.</p>

                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">5. Paiement</h3>
                <p>Thiès Resto ne traite aucun paiement en ligne. Toutes les transactions financières (espèces ou tout autre moyen que vous acceptez) se déroulent directement entre vous et le client, à la livraison ou sur place. Thiès Resto n'intervient à aucun moment dans cette transaction et n'en est pas responsable.</p>

                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">6. Données collectées sur vos clients</h3>
                <p>Dans le cadre de l'utilisation de la plateforme, vous avez accès aux informations suivantes transmises par vos clients : nom, prénom, numéro de téléphone, contenu de leur commande ou réservation. Ces informations doivent être utilisées uniquement dans le cadre du service que vous proposez (traitement de la commande, organisation de la réservation, programme de fidélité) et ne doivent pas être réutilisées à d'autres fins, notamment commerciales, sans le consentement du client.</p>

                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">7. Disponibilité du service</h3>
                <p>Thiès Resto met tout en œuvre pour assurer la disponibilité continue du tableau de bord et de la page client. En cas de panne, de maintenance ou d'interruption de service, le restaurant en sera informé dans la mesure du possible. Thiès Resto ne peut être tenu responsable des pertes de commandes liées à une interruption de connexion internet ou de réseau mobile, locale au restaurant ou au client.</p>

                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">8. Modification ou suspension du compte</h3>
                <p>Le restaurant peut demander la suspension ou la fermeture de son espace à tout moment. Thiès Resto se réserve le droit de suspendre un compte en cas de non-respect manifeste de cette politique, notamment en cas d'informations délibérément trompeuses publiées sur la page client.</p>

                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">9. Évolutions de cette politique</h3>
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
router.add('#/cgv', () => renderCGV());
function renderCGV() {
    hideLoadingOverlay();
    const container = document.getElementById('main-content');
    container.innerHTML = `
        <div style="max-width: 800px; margin: 4rem auto; padding: 2.5rem; background: var(--bg-card); border-radius: 20px; border: 1px solid var(--border); box-shadow: var(--shadow);">
            <h1 style="color: var(--primary); margin-bottom: 2rem; font-family: var(--font-serif); font-size: 2.2rem;">Mentions Légales & CGV</h1>
            
            <div style="color: var(--text-secondary); line-height: 1.7; font-size: 0.95rem;">
                
                <h2 style="color: var(--text-primary); margin-top: 2rem; margin-bottom: 1rem; font-family: var(--font-serif); font-size: 1.5rem;">1. Mentions Légales</h2>
                <p><strong>Éditeur de la plateforme :</strong> NdiayeDigital</p>
                <p><strong>Plateforme :</strong> THIES Resto (thies-resto.com)</p>
                <p><strong>Contact :</strong> contact@thies-resto.com / +221 78 479 98 82</p>
                <p><strong>Hébergement :</strong> Vercel Inc. (USA) / Base de données : Supabase</p>
                <p>La plateforme THIES Resto est un annuaire et un outil de mise en relation dématérialisé dédié à la restauration dans la région de Thiès (Sénégal).</p>

                <h2 style="color: var(--text-primary); margin-top: 2.5rem; margin-bottom: 1rem; font-family: var(--font-serif); font-size: 1.5rem;">2. Conditions Générales d'Utilisation (CGU)</h2>
                <h3 style="color: var(--text-primary); margin-top: 1rem; font-size: 1.1rem;">2.1 Rôle de THIES Resto</h3>
                <p>THIES Resto agit exclusivement en tant qu'intermédiaire technique de mise en relation. La plateforme permet aux clients de consulter les menus et d'envoyer des commandes ou des réservations aux restaurants partenaires via WhatsApp et le tableau de bord de la plateforme.</p>
                
                <h3 style="color: var(--text-primary); margin-top: 1rem; font-size: 1.1rem;">2.2 Responsabilités</h3>
                <p><strong>THIES Resto ne prépare pas, ne vend pas et ne livre pas de repas.</strong> Par conséquent, les restaurants partenaires sont seuls responsables de :</p>
                <ul style="margin-left: 1.5rem; margin-bottom: 1rem; list-style-type: disc;">
                    <li>L'exactitude de leurs menus, prix et disponibilités.</li>
                    <li>La qualité, la conformité et l'hygiène des plats préparés.</li>
                    <li>Les délais de préparation et les conditions de livraison.</li>
                </ul>
                <p>En cas de litige, de retard, de non-conformité de la commande ou de problème d'intoxication alimentaire, <strong>le client s'engage à se retourner exclusivement et directement contre le restaurant concerné</strong>. La responsabilité de THIES Resto ne saurait être engagée à quelque titre que ce soit concernant la prestation de restauration.</p>

                <h2 style="color: var(--text-primary); margin-top: 2.5rem; margin-bottom: 1rem; font-family: var(--font-serif); font-size: 1.5rem;">3. Conditions Générales de Vente (CGV)</h2>
                <h3 style="color: var(--text-primary); margin-top: 1rem; font-size: 1.1rem;">3.1 Commandes et Tarifs</h3>
                <p>Les prix affichés sur la plateforme sont définis par les restaurants et incluent les taxes applicables au Sénégal. Les frais de livraison, s'ils existent, sont communiqués directement par le restaurant au client (notamment via WhatsApp) avant la confirmation finale.</p>
                
                <h3 style="color: var(--text-primary); margin-top: 1rem; font-size: 1.1rem;">3.2 Paiement</h3>
                <p>Aucun paiement n'est traité directement sur la plateforme THIES Resto. Le règlement s'effectue exclusivement en espèces (ou via un service de mobile money selon l'accord du restaurant) au moment de la livraison ou du retrait sur place.</p>

                <h2 style="color: var(--text-primary); margin-top: 2.5rem; margin-bottom: 1rem; font-family: var(--font-serif); font-size: 1.5rem;">4. Protection des Données (CDP Sénégal)</h2>
                <p>Dans le cadre de l'utilisation du service, les données suivantes sont collectées : Prénom et Numéro de téléphone. Ces données sont strictement utilisées pour :</p>
                <ul style="margin-left: 1.5rem; margin-bottom: 1rem; list-style-type: disc;">
                    <li>La transmission de la commande au restaurant.</li>
                    <li>Le suivi du programme de fidélité.</li>
                </ul>
                <p>Conformément à la législation sénégalaise sur la protection des données à caractère personnel (CDP), THIES Resto s'engage à ne jamais revendre ces données à des tiers. Vous disposez d'un droit d'accès et de suppression de vos données en contactant : contact@thies-resto.com.</p>
                
                <hr style="border: 0; border-top: 1px solid var(--border); margin: 2rem 0;">
                <p style="font-size: 0.85rem; font-style: italic; text-align: center;">Ces conditions sont acceptées implicitement par toute personne utilisant la plateforme.</p>
            </div>
            <div style="text-align: center; margin-top: 2.5rem;">
                <button class="btn btn-primary" onclick="router.navigate('/')">J'ai compris, retour à l'accueil</button>
            </div>
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

// ==================== NETWORK DETECTOR ====================
window.addEventListener('offline', () => {
    let banner = document.getElementById('offline-banner');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'offline-banner';
        banner.style.cssText = 'position:fixed;top:0;left:0;width:100%;background:var(--danger);color:white;text-align:center;padding:12px;z-index:999999;font-weight:bold;font-size:0.9rem;box-shadow:0 4px 6px rgba(0,0,0,0.2);animation:slideDown 0.3s ease-out;';
        banner.innerHTML = '⚠️ Vous êtes hors connexion. Veuillez vérifier votre réseau.';
        document.body.appendChild(banner);
    }
    banner.style.display = 'block';
});

window.addEventListener('online', () => {
    const banner = document.getElementById('offline-banner');
    if (banner) {
        banner.style.display = 'none';
        if (typeof showToast === 'function') showToast("Connexion rétablie !", "success");
    }
});

// Start application routing
try {
    // Initialize tracker now that router is defined
    if (typeof ClientTracker !== 'undefined') {
        window.clientTracker = new ClientTracker();
    }
    router.resolve();
} catch (err) {
    console.error("Global Initialization Error:", err);
    hideLoadingOverlay();
    document.body.innerHTML += `<div style="position:fixed;top:0;left:0;right:0;background:red;color:white;padding:20px;z-index:999999;">Erreur Critique d'Initialisation: ${err.message}</div>`;
}

window.addEventListener('error', function(e) {
    hideLoadingOverlay();
    console.error("Uncaught Error:", e.message);
});

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
    const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
    
    if (typeof currentRestaurantSession !== 'undefined' && currentRestaurantSession) {
        if (navActions) navActions.innerHTML = `
            <span style="color: var(--text-secondary); font-size: 0.9rem; margin-right: 0.5rem;" class="desktop-only">👤 ${currentRestaurantSession.name || 'Connecté'}</span>
            <button class="btn btn-outline desktop-only" style="padding: 0.4rem 1rem; font-size: 0.85rem;" onclick="handleLogout()">Déconnexion</button>
        `;
        if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'block';
    } else if (typeof isSuperAdminSession !== 'undefined' && isSuperAdminSession) {
        if (navActions) navActions.innerHTML = `
            <span style="color: var(--text-secondary); font-size: 0.9rem; margin-right: 0.5rem;" class="desktop-only">👑 Admin</span>
            <button class="btn btn-outline desktop-only" style="padding: 0.4rem 1rem; font-size: 0.85rem;" onclick="handleLogout()">Déconnexion</button>
        `;
        if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'block';
    } else {
        if (navActions) navActions.innerHTML = `
            <button class="btn btn-primary" onclick="router.navigate('/auth')">Connexion Partenaire</button>
        `;
        if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'none';
    }
}

window.handleLogout = function() {
    if (typeof isSuperAdminSession !== 'undefined' && isSuperAdminSession) {
        if (typeof logoutAdmin === 'function') logoutAdmin();
    } else if (typeof currentRestaurantSession !== 'undefined' && currentRestaurantSession) {
        if (typeof logoutRestaurant === 'function') logoutRestaurant();
    }
    const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
    if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'none';
    updateNav();
    router.navigate('/');
};

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
    const image = resto.coverImage || 'https://thies-resto.com/icon.png';

    setMeta('description', desc);
    setMeta('og:title', resto.name + " - THIES Resto");
    setMeta('og:description', desc);
    setMeta('og:image', image);
    setMeta('twitter:title', resto.name + " - THIES Resto");
    setMeta('twitter:description', desc);
    setMeta('twitter:image', image);
}

function setDynamicMeta(title, image) {
    document.title = title;
    let iconLink = document.querySelector("link[rel='icon']") || document.createElement('link');
    iconLink.rel = 'icon';
    iconLink.href = image;
    document.head.appendChild(iconLink);
    let appleLink = document.querySelector("link[rel='apple-touch-icon']") || document.createElement('link');
    appleLink.rel = 'apple-touch-icon';
    appleLink.href = image;
    document.head.appendChild(appleLink);
    let ogImage = document.querySelector("meta[property='og:image']");
    if(ogImage) ogImage.setAttribute('content', image);
    let twImage = document.querySelector("meta[name='twitter:image']");
    if(twImage) twImage.setAttribute('content', image);
}



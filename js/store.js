let currentRestaurantSession = null;
let isSuperAdminSession = false;

// Global Cart State Initialization
window.cart = window.cart || {
    restaurantId: null,
    items: [],
    subtotal: 0,
    total: 0,
    deliveryFee: 0,
    deliveryLat: null,
    deliveryLng: null,
    loyaltyApplied: false,
    loyaltyPhone: null
};
try {
    const savedCart = localStorage.getItem('THIES_CART');
    if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (parsed && typeof parsed === 'object') {
            window.cart.restaurantId = parsed.restaurantId || null;
            window.cart.items = Array.isArray(parsed.items) ? parsed.items : [];
            window.cart.subtotal = Number(parsed.subtotal || 0);
            window.cart.total = Number(parsed.total || 0);
            window.cart.deliveryFee = Number(parsed.deliveryFee || 0);
            window.cart.deliveryLat = parsed.deliveryLat || null;
            window.cart.deliveryLng = parsed.deliveryLng || null;
            window.cart.loyaltyApplied = !!parsed.loyaltyApplied;
            window.cart.loyaltyPhone = parsed.loyaltyPhone || null;
        }
    }
} catch(e) {}

try {
    const sessionStr = sessionStorage.getItem('resto_session') || localStorage.getItem('resto_session');
    if (sessionStr) {
        currentRestaurantSession = JSON.parse(sessionStr);
    }
    isSuperAdminSession = sessionStorage.getItem('admin_session') === 'true' || 
                          sessionStorage.getItem('thies_admin_logged') === 'true' || 
                          localStorage.getItem('admin_session') === 'true';
} catch (e) {
    console.warn("Session storage restore warning:", e);
}

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
        // Initialisation avec données de secours et synchronisation Supabase
        const initialRestos = (typeof SEED_RESTAURANTS !== 'undefined' && Array.isArray(SEED_RESTAURANTS))
            ? JSON.parse(JSON.stringify(SEED_RESTAURANTS))
            : [];
        this.data = {
            restaurants: initialRestos,
            orders: [],
            reservations: [],
            groupOrders: []
        };
        
        // Restore local overrides (customized menus, real images, plats du jour)
        try {
            const savedOverrides = JSON.parse(localStorage.getItem('thies_restaurant_overrides') || '{}');
            this.data.restaurants.forEach(r => {
                if (savedOverrides[r.id]) {
                    Object.assign(r, savedOverrides[r.id]);
                }
            });
        } catch(e) {}

        // Restore locally saved custom restaurants
        try {
            const savedCustomRestos = JSON.parse(localStorage.getItem('thies_custom_restaurants') || '[]');
            if (Array.isArray(savedCustomRestos)) {
                savedCustomRestos.forEach(customR => {
                    const exists = this.data.restaurants.some(r => r.id === customR.id || r.slug === customR.slug);
                    if (!exists) {
                        this.data.restaurants.push(customR);
                    }
                });
            }
        } catch(e) {}

        // Restore locally stored orders and ensure clean sequence per restaurant
        try {
            const savedOrders = JSON.parse(localStorage.getItem('thies_platform_orders') || '[]');
            if (Array.isArray(savedOrders)) {
                this.data.orders = savedOrders;
            }
        } catch(e) {}

        // Restore locally stored reservations
        try {
            const savedReservations = JSON.parse(localStorage.getItem('thies_platform_reservations') || '[]');
            if (Array.isArray(savedReservations)) {
                this.data.reservations = savedReservations;
            }
        } catch(e) {}

        // Ensure order numbers are indexed 1..N per restaurant
        this.resequenceOrders();

        // Background sync with Supabase
        if (supabaseClient) {
            this.syncPromise = this.syncFromSupabase();
        } else {
            this.syncPromise = Promise.resolve();
        }
    }

    // Persist all state (restaurant overrides, orders, reservations, custom partners)
    save() {
        try {
            const overrides = {};
            const customRestos = [];
            this.data.restaurants.forEach(r => {
                if (r.menu && r.menu.length > 0) {
                    overrides[r.id] = {
                        menu: r.menu,
                        name: r.name,
                        coverImage: r.coverImage,
                        isOpenManual: r.isOpenManual,
                        address: r.address,
                        whatsapp: r.whatsapp,
                        openHours: r.openHours,
                        status: r.status,
                        subscriptionPack: r.subscriptionPack
                    };
                }
                // If it's a dynamic or newly added restaurant
                if (r.id.startsWith('r') && parseInt(r.id.slice(1), 10) > 10 || r.id.startsWith('id_')) {
                    customRestos.push(r);
                }
            });
            localStorage.setItem('thies_restaurant_overrides', JSON.stringify(overrides));
            localStorage.setItem('thies_custom_restaurants', JSON.stringify(customRestos));
            localStorage.setItem('thies_platform_orders', JSON.stringify(this.data.orders));
            localStorage.setItem('thies_platform_reservations', JSON.stringify(this.data.reservations));
        } catch(e) {
            console.warn("Could not save platform state to localStorage", e);
        }
    }

    // Calcul du prochain numéro de commande séquentiel (1 à N) indépendant par restaurant
    getNextRestaurantOrderNumber(restaurantId) {
        if (!restaurantId) return 1;
        const restoOrders = this.data.orders.filter(o => o.restaurantId === restaurantId);
        if (!restoOrders || restoOrders.length === 0) return 1;
        
        const maxNum = restoOrders.reduce((max, o) => {
            const num = Number(o.orderNumber) || 0;
            return num > max ? num : max;
        }, 0);
        
        return maxNum + 1;
    }

    // Remise à zéro / réindexation propre de tous les numéros de commande de 1 à N par restaurant
    resequenceOrders() {
        if (!this.data.orders || this.data.orders.length === 0) return;
        
        const restoMap = {};
        // Trier chronologiquement (plus ancienne à plus récente)
        const sorted = [...this.data.orders].sort((a, b) => {
            const tA = a.timestamp || (a.date && a.time ? new Date(`${a.date}T${a.time}`).getTime() : 0);
            const tB = b.timestamp || (b.date && b.time ? new Date(`${b.date}T${b.time}`).getTime() : 0);
            return tA - tB;
        });

        sorted.forEach(order => {
            if (!restoMap[order.restaurantId]) restoMap[order.restaurantId] = [];
            restoMap[order.restaurantId].push(order);
        });

        Object.keys(restoMap).forEach(restoId => {
            restoMap[restoId].forEach((o, index) => {
                o.orderNumber = index + 1;
                o.id = `CMD-${o.orderNumber}`;
            });
        });
    }

    // Réinitialisation complète des commandes à 0 pour démarrer une nouvelle séquence propre
    resetAllOrdersToZero() {
        this.data.orders = [];
        this.save();
        if (typeof showToast === 'function') {
            showToast("Les numéros de commande ont été réinitialisés à zéro pour tous les restaurants.", "info");
        }
    }

    async syncFromSupabase() {
        if (!supabaseClient) return;
        try {
            console.log("Syncing with Supabase...");

            // 1. Sync Restaurants with timeout and fallback protection
            let dbRestos = null;
            let restosError = null;
            
            try {
                // Timeout after 4 seconds to prevent hanging on slow network or sandbox
                const fetchPromise = supabaseClient.rpc('get_public_restaurants');
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Supabase sync timeout')), 4000)
                );
                const res = await Promise.race([fetchPromise, timeoutPromise]);
                if (res && res.error) {
                    restosError = res.error;
                } else if (res && res.data) {
                    dbRestos = res.data;
                }
            } catch (err) {
                restosError = err;
            }

            if (!restosError && Array.isArray(dbRestos) && dbRestos.length > 0) {
                try {
                    const mappedRestos = dbRestos.map(r => {
                        let parsedMenu = r.menu;
                        try { if (typeof r.menu === 'string') parsedMenu = JSON.parse(r.menu); } catch(e) {}
                        let parsedReviews = r.reviews;
                        try { if (typeof r.reviews === 'string') parsedReviews = JSON.parse(r.reviews); } catch(e) {}
                        
                        return {
                            id: r.id,
                            name: r.name,
                            slug: r.slug,
                            rating: Number(r.rating) || 4.5,
                            reviewsCount: Number(r.reviews_count) || 12,
                            category: r.category || 'Traditionnel',
                            address: r.address || 'Thiès, Sénégal',
                            whatsapp: r.whatsapp || '+221770000000',
                            openHours: r.open_hours || '10:00 - 23:00',
                            closedDays: Array.isArray(r.closed_days) ? r.closed_days : (r.closed_days ? JSON.parse(r.closed_days) : []),
                            isOpenManual: r.is_open_manual !== undefined ? Boolean(r.is_open_manual) : true,
                            lat: r.lat ? Number(r.lat) : 14.7928,
                            lng: r.lng ? Number(r.lng) : -16.9260,
                            coverImage: (r.cover_image && r.cover_image !== 'null' && r.cover_image !== 'undefined') ? r.cover_image : null,
                            menu: Array.isArray(parsedMenu) ? parsedMenu : [],
                            reviews: Array.isArray(parsedReviews) ? parsedReviews : []
                        };
                    });
                    
                    // Merge with fallback data for any missing fields
                    const mergedRestos = mappedRestos.map(dbR => {
                        const localR = this.data.restaurants.find(lr => lr.id === dbR.id);
                        const baseName = String(dbR.name || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                        let fallbackCover = '';
                        if (typeof RESTAURANT_COVERS !== 'undefined' && RESTAURANT_COVERS[dbR.id]) {
                            fallbackCover = RESTAURANT_COVERS[dbR.id];
                        } else if (typeof COVER_IMAGES !== 'undefined' && COVER_IMAGES[dbR.category]) {
                            fallbackCover = COVER_IMAGES[dbR.category];
                        }
                        
                        return {
                            ...dbR,
                            menu: (dbR.menu && dbR.menu.length > 0) ? dbR.menu : (localR ? localR.menu : []),
                            username: (localR && localR.username) ? localR.username : ('id_' + baseName),
                            password: (localR && localR.password) ? localR.password : (baseName + '221'),
                            status: (localR && localR.status) ? localR.status : (dbR.status || 'active'),
                            subscriptionPack: (localR && localR.subscriptionPack) ? localR.subscriptionPack : 'Aucun (Gratuit)',
                            createdAt: (localR && localR.createdAt) ? localR.createdAt : '2026-06-25T00:00:00Z',
                            coverImage: dbR.coverImage || fallbackCover
                        };
                    });

                    this.data.restaurants = mergedRestos;
                } catch(error) {
                    console.warn("Notice: Using local enriched restaurant database:", error);
                    if (!this.data.restaurants || this.data.restaurants.length === 0) {
                        this.data.restaurants = this.getEnrichedFallbackData();
                    }
                }
            } else {
                // If offline, timeout or remote DB empty, use enriched offline/seed data smoothly
                if (restosError) {
                    console.warn("Supabase sync notice: Operating with local dataset.", restosError.message || restosError);
                }
                if (!this.data.restaurants || this.data.restaurants.length === 0) {
                    this.data.restaurants = this.getEnrichedFallbackData();
                }
            }
            // 2. Fetch admin data or restaurant specific data
            if (typeof isSuperAdminSession !== 'undefined' && isSuperAdminSession) {
                const adminPass = sessionStorage.getItem('admin_password') || '';
                const { data: adminData, error: adminError } = await supabaseClient.rpc('get_admin_data', {
                    p_admin_password: adminPass
                });
                if (!adminError && adminData) {
                    if (adminData.restaurants) {
                        adminData.restaurants.forEach(dbR => {
                            const localR = this.data.restaurants.find(lr => lr.id === dbR.id);
                            if (localR) {
                                localR.username = dbR.username;
                                localR.password = dbR.password;
                                localR.status = dbR.status;
                            }
                        });
                    }
                    if (adminData.orders) {
                        const mappedOrders = adminData.orders.map(o => {
                            const ts = o.created_at ? new Date(o.created_at).getTime() : (o.date && o.time ? new Date(`${o.date}T${o.time}`).getTime() : Date.now());
                            return {
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
                                time: o.time,
                                createdAt: o.created_at || (o.date && o.time ? `${o.date}T${o.time}` : new Date().toISOString()),
                                timestamp: isNaN(ts) ? Date.now() : ts
                            };
                        });
                        this.data.orders = mappedOrders.sort((a,b) => b.id.localeCompare(a.id));
                    }
                    if (adminData.reservations) {
                        const mappedReservations = adminData.reservations.map(r => ({
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
            } else if (typeof currentRestaurantSession !== 'undefined' && currentRestaurantSession && currentRestaurantSession.password) {
                // Fetch only for this restaurant via RPC
                const { data: myOrders, error: ordersError } = await supabaseClient.rpc('get_restaurant_orders', {
                    p_restaurant_id: currentRestaurantSession.id,
                    p_password: currentRestaurantSession.password
                });
                if (!ordersError && myOrders) {
                    const mappedOrders = myOrders.map(o => {
                        const ts = o.created_at ? new Date(o.created_at).getTime() : (o.date && o.time ? new Date(`${o.date}T${o.time}`).getTime() : Date.now());
                        return {
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
                            time: o.time,
                            createdAt: o.created_at || (o.date && o.time ? `${o.date}T${o.time}` : new Date().toISOString()),
                            timestamp: isNaN(ts) ? Date.now() : ts
                        };
                    });
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
            console.error("Error connecting to Supabase during sync:", e);
            this.data.restaurants = this.getEnrichedFallbackData();
        }
    }

    getEnrichedFallbackData() {
        if (typeof SEED_RESTAURANTS === 'undefined') return [];
        const baseData = JSON.parse(JSON.stringify(SEED_RESTAURANTS));
        return baseData.map(r => {
            const baseName = String(r.name || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            let fallbackCover = '';
            if (typeof RESTAURANT_COVERS !== 'undefined' && RESTAURANT_COVERS[r.id]) {
                fallbackCover = RESTAURANT_COVERS[r.id];
            } else if (typeof COVER_IMAGES !== 'undefined' && COVER_IMAGES[r.category]) {
                fallbackCover = COVER_IMAGES[r.category];
            }
            let fallbackMenu = [];
            if (typeof MENU_TEMPLATES !== 'undefined' && MENU_TEMPLATES[r.category]) {
                fallbackMenu = JSON.parse(JSON.stringify(MENU_TEMPLATES[r.category]));
            }
            return {
                ...r,
                coverImage: r.coverImage || fallbackCover,
                menu: r.menu || fallbackMenu,
                username: 'id_' + baseName,
                password: baseName + '221',
                status: 'active'
            };
        });
    }

    async seedRemoteDatabase() {
        if (!supabaseClient) return;
        try {
            let localRestos = typeof SEED_RESTAURANTS !== 'undefined' ? SEED_RESTAURANTS : [];
            if (!localRestos || localRestos.length === 0) {
                console.log("No local restaurants to seed from.");
                return;
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
            if (isSuperAdminSession) {
                const adminPass = sessionStorage.getItem('admin_password') || '';
                const { error } = await supabaseClient.rpc('admin_create_restaurant', {
                    p_admin_password: adminPass,
                    p_restaurant: {
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
                        menu: resto.menu || [],
                        reviews: resto.reviews || [],
                        subscription_pack: resto.subscriptionPack || 'Aucun (Gratuit)'
                    }
                });

                if (error) {
                    console.log("Admin insert failed or restaurant exists, updating via admin RPC...", error);
                    await supabaseClient.rpc('admin_update_restaurant', {
                        p_admin_password: adminPass,
                        p_restaurant_id: resto.id,
                        p_updates: {
                            name: resto.name,
                            status: resto.status,
                            username: resto.username,
                            password: resto.password,
                            subscription_pack: resto.subscriptionPack || 'Aucun (Gratuit)',
                            address: resto.address,
                            whatsapp: resto.whatsapp,
                            is_open_manual: resto.isOpenManual
                        }
                    });
                }
                return;
            }

            // Client/Public registration (limited by RLS check: status must be pending)
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
                if (typeof currentRestaurantSession !== 'undefined' && currentRestaurantSession && currentRestaurantSession.id === resto.id) {
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
            const isOtp = order.otpVerified !== false;
            const { data, error } = await supabaseClient.rpc('place_secure_order', {
                p_order_id: order.id,
                p_restaurant_id: order.restaurantId,
                p_customer_name: order.customerName,
                p_customer_phone: order.customerPhone,
                p_mode: order.mode,
                p_address: order.address,
                p_note: order.note,
                p_items: order.items,
                p_date: order.date,
                p_time: order.time,
                p_delivery_fee: order.deliveryFee || 0,
                p_loyalty_applied: order.loyaltyApplied || false,
                p_otp_verified: isOtp,
                p_otp_verified_via: order.otpVerifiedVia || 'WhatsApp / Direct Vérifié'
            });
            if (error) {
                console.warn("RPC place_secure_order notice, using direct table fallback:", error.message || error);
                const { error: insertError } = await supabaseClient.from('orders').upsert({
                    id: order.id,
                    restaurant_id: order.restaurantId,
                    customer_name: order.customerName,
                    customer_phone: order.customerPhone,
                    mode: order.mode,
                    delivery_address: order.address,
                    note: order.note,
                    items: order.items,
                    total: order.total,
                    delivery_fee: order.deliveryFee || 0,
                    loyalty_applied: order.loyaltyApplied || false,
                    otp_verified: isOtp,
                    otp_verified_via: order.otpVerifiedVia || 'WhatsApp / Direct Vérifié',
                    status: order.status || 'En attente'
                });
                if (insertError) {
                    console.error("Direct insert into orders failed:", insertError);
                }
            }
        } catch (e) {
            console.warn("Notice: Failed to push order to Supabase (offline/sync mode):", e);
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
            throw e;
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
            throw e;
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

    async fetchMenuForRestaurant(restaurantId) {
        if (!supabaseClient) return [];
        
        // Find the restaurant in our local cache
        const resto = this.data.restaurants.find(r => r.id === restaurantId);
        
        // If the menu is already loaded (and has items), return it from cache
        if (resto && resto.menu && resto.menu.length > 0) {
            return resto.menu;
        }

        try {
            console.log(`Lazy loading menu for restaurant ${restaurantId}...`);
            let menuItems = null;
            let error = null;
            try {
                const fetchPromise = supabaseClient.rpc('get_public_menu_items', { p_restaurant_id: restaurantId });
                const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Menu timeout')), 3500));
                const res = await Promise.race([fetchPromise, timeoutPromise]);
                if (res && res.error) error = res.error;
                else if (res && res.data) menuItems = res.data;
            } catch (err) {
                error = err;
            }

            if (error) {
                console.warn(`Menu fetch notice for restaurant ${restaurantId}: using offline templates`, error.message || error);
            }
            
            let parsedMenu = [];
            if (menuItems && menuItems.length > 0) {
                parsedMenu = menuItems.map(item => {
                    let fallbackImg = item.image_url;
                    if (!fallbackImg || (typeof fallbackImg === 'string' && fallbackImg.trim() === '')) {
                        if (typeof DISH_IMAGE_OPTIONS !== 'undefined' && DISH_IMAGE_OPTIONS.length > 0) {
                            let str = String(item.id || item.name || '');
                            let hash = 0;
                            for (let i = 0; i < str.length; i++) {
                                hash = str.charCodeAt(i) + ((hash << 5) - hash);
                            }
                            fallbackImg = DISH_IMAGE_OPTIONS[Math.abs(hash) % DISH_IMAGE_OPTIONS.length].url;
                        }
                    }
                    return {
                        id: item.id,
                        name: item.name,
                        description: item.description,
                        price: item.price,
                        category: item.category,
                        image: fallbackImg,
                        isDailySpecial: item.is_daily_special !== undefined ? item.is_daily_special : (item.isDailySpecial !== undefined ? item.isDailySpecial : (item.tag === 'Plat du jour')),
                        tag: item.tag || (item.is_daily_special ? 'Plat du jour' : (item.isDailySpecial ? 'Plat du jour' : null)),
                        available: item.is_available !== undefined ? item.is_available : (item.available !== undefined ? item.available : true)
                    };
                });
            }

            // If empty or offline, fallback to category template
            if (parsedMenu.length === 0 && resto) {
                if (typeof MENU_TEMPLATES !== 'undefined' && MENU_TEMPLATES[resto.category]) {
                    parsedMenu = JSON.parse(JSON.stringify(MENU_TEMPLATES[resto.category]));
                }
            }

            // Update local cache
            if (resto) {
                resto.menu = parsedMenu;
                this.save();
            }

            return parsedMenu;
        } catch (error) {
            console.warn("Notice: Serving local menu items for restaurant:", error);
            if (resto && typeof MENU_TEMPLATES !== 'undefined' && MENU_TEMPLATES[resto.category]) {
                resto.menu = JSON.parse(JSON.stringify(MENU_TEMPLATES[resto.category]));
                return resto.menu;
            }
            return [];
        }
    }

    getDailyDishes() {
        const activeRestos = this.getRestaurants().filter(r => r.status === 'active');
        const dailyDishes = [];
        
        activeRestos.forEach(resto => {
            if (Array.isArray(resto.menu)) {
                resto.menu.forEach(dish => {
                    const isDaily = dish.isDailySpecial === true || 
                                    dish.is_daily_special === true || 
                                    (dish.tag && String(dish.tag).toLowerCase().includes('jour')) ||
                                    (dish.tags && Array.isArray(dish.tags) && dish.tags.some(t => String(t).toLowerCase().includes('jour')));
                    
                    if (isDaily && dish.available !== false && dish.is_available !== false) {
                        dailyDishes.push({
                            ...dish,
                            restaurantId: resto.id,
                            restaurantName: resto.name,
                            restaurantSlug: resto.slug,
                            restaurantCategory: resto.category,
                            restaurantRating: resto.rating || 4.5,
                            restaurantAddress: resto.address || 'Thiès',
                            restaurantOpen: typeof isRestaurantOpen === 'function' ? isRestaurantOpen(resto) : (resto.isOpenManual !== false),
                            tag: dish.tag || 'Plat du jour'
                        });
                    }
                });
            }
        });

        // Fallback: If no explicit daily specials yet, showcase the first signature dish from each active restaurant
        if (dailyDishes.length === 0) {
            activeRestos.slice(0, 8).forEach(resto => {
                let menuList = resto.menu;
                if ((!menuList || menuList.length === 0) && typeof MENU_TEMPLATES !== 'undefined' && MENU_TEMPLATES[resto.category]) {
                    menuList = MENU_TEMPLATES[resto.category];
                }
                if (Array.isArray(menuList) && menuList.length > 0) {
                    const primeDish = menuList[0];
                    if (primeDish && primeDish.available !== false) {
                        dailyDishes.push({
                            ...primeDish,
                            restaurantId: resto.id,
                            restaurantName: resto.name,
                            restaurantSlug: resto.slug,
                            restaurantCategory: resto.category,
                            restaurantRating: resto.rating || 4.5,
                            restaurantAddress: resto.address || 'Thiès',
                            restaurantOpen: typeof isRestaurantOpen === 'function' ? isRestaurantOpen(resto) : (resto.isOpenManual !== false),
                            tag: primeDish.tag || 'Plat du jour'
                        });
                    }
                }
            });
        }

        return dailyDishes;
    }

    async fetchDailyDishes() {
        if (!this.syncPromise) {
            this.syncPromise = this.syncFromSupabase();
        }
        await this.syncPromise;
        return this.getDailyDishes();
    }

    async getRestaurantBySlug(slug) {
        if (!this.syncPromise) {
            this.syncPromise = this.syncFromSupabase();
        }
        await this.syncPromise;
        const resto = this.data.restaurants.find(r => r.slug === slug);
        if (resto) {
            // Wait for menu to load before returning the restaurant
            await this.fetchMenuForRestaurant(resto.id);
        }
        return resto;
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
        if (!order.orderNumber) {
            order.orderNumber = this.getNextRestaurantOrderNumber(order.restaurantId);
        }
        if (!order.id || order.id.startsWith('ORD-')) {
            order.id = `CMD-${order.orderNumber}`;
        }
        
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
            if (supabaseClient && isSuperAdminSession) {
                // Super Admin utilise la RPC admin sécurisée
                const adminPass = sessionStorage.getItem('admin_password') || '';
                await supabaseClient.rpc('admin_update_order_status', {
                    p_admin_password: adminPass,
                    p_order_id: orderId,
                    p_status: status
                });
            } else if (supabaseClient && typeof currentRestaurantSession !== 'undefined' && currentRestaurantSession) {
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
            if (supabaseClient && isSuperAdminSession) {
                const adminPass = sessionStorage.getItem('admin_password') || '';
                await supabaseClient.rpc('admin_update_reservation_status', {
                    p_admin_password: adminPass,
                    p_reservation_id: resId,
                    p_status: status
                });
            } else if (supabaseClient && typeof currentRestaurantSession !== 'undefined' && currentRestaurantSession) {
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

    async adminDeleteOrder(orderId) {
        if (!supabaseClient || !isSuperAdminSession) return false;
        try {
            const adminPass = sessionStorage.getItem('admin_password') || '';
            const { error } = await supabaseClient.rpc('admin_delete_order', {
                p_admin_password: adminPass,
                p_order_id: orderId
            });
            if (error) throw error;
            this.data.orders = this.data.orders.filter(o => o.id !== orderId);
            return true;
        } catch (err) {
            console.error('Erreur suppression commande admin:', err);
            return false;
        }
    }

    async createSecureOrder(payload) {
        if (!supabaseClient) {
            return null;
        }
        try {
            const { data, error } = await supabaseClient.rpc('create_secure_order', { payload: payload });
            if (error) {
                console.warn("Supabase create_secure_order RPC notice:", error.message || error);
                return null;
            }
            return data;
        } catch (error) {
            console.warn("Error creating secure order RPC (fallback to local order):", error);
            return null;
        }
    }

    async uploadImage(file) {
        if (!supabaseClient) return null;
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
            
            const { data, error } = await supabaseClient.storage
                .from('images')
                .upload(fileName, file);

            if (error) {
                console.error("Storage error details:", error);
                throw error;
            }
            
            const { data: publicUrlData } = supabaseClient.storage
                .from('images')
                .getPublicUrl(fileName);
                
            return publicUrlData.publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            alert("Erreur lors de l'upload de l'image. Avez-vous créé le bucket 'images' en mode public sur Supabase ?");
            return null;
        }
    }
    // ============================================
    // VENDOR DASHBOARD METHODS (Requires PIN)
    // ============================================

    async vendorLogin(slug, pin) {
        if (!supabaseClient) throw new Error("Supabase non initialisé");
        
        try {
            const { data, error } = await supabaseClient.rpc('verify_vendor_pin', {
                p_slug: slug,
                p_pin: pin
            });
            if (error) {
                // Propager l'erreur de rate limiting pour l'afficher dans l'UI
                if (error.message && error.message.includes('Trop de tentatives')) {
                    throw { rateLimited: true, message: error.message };
                }
                throw error;
            }
            return data;
        } catch (err) {
            if (err.rateLimited) throw err; // Re-throw rate limit pour le UI
            console.error("Erreur de connexion restaurateur:", err);
            throw err;
        }
    }

    async vendorUpdateMenuItem(restaurantId, pin, itemId, newPrice, isAvailable) {
        if (!supabaseClient) throw new Error("Supabase non initialisé");
        
        try {
            const { error } = await supabaseClient.rpc('update_vendor_menu_item', {
                p_restaurant_id: restaurantId,
                p_pin: pin,
                p_item_id: itemId,
                p_price: newPrice,
                p_is_available: isAvailable
            });
            
            if (error) throw error;
            
            // Update local cache
            const resto = this.data.restaurants.find(r => r.id === restaurantId);
            if (resto && resto.menu) {
                const item = resto.menu.find(m => m.id === itemId);
                if (item) {
                    item.price = newPrice;
                    item.available = isAvailable;
                    this.save();
                }
            }
            return true;
        } catch (err) {
            console.error("Erreur de mise à jour du plat:", err);
            return false;
        }
    }

    async vendorUpdateStatus(restaurantId, pin, isOpen) {
        if (!supabaseClient) throw new Error("Supabase non initialisé");
        
        try {
            const { error } = await supabaseClient.rpc('update_vendor_status', {
                p_restaurant_id: restaurantId,
                p_pin: pin,
                p_is_open: isOpen
            });
            
            if (error) throw error;
            
            // Update local cache
            const resto = this.data.restaurants.find(r => r.id === restaurantId);
            if (resto) {
                resto.isOpenManual = isOpen;
                this.save();
            }
            return true;
        } catch (err) {
            console.error("Erreur de mise à jour du statut:", err);
            return false;
        }
    }

    // ============================================
    // OTP VERIFICATION METHODS (Twilio SMS & Fallback)
    // ============================================

    async generateOtp(phone) {
        // 1. Appel du backend Twilio SMS API (/api/otp/send)
        try {
            const response = await fetch('/api/otp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone })
            });
            const result = await response.json();
            if (response.ok && result.success) {
                // Si en mode démo (clés Twilio non encore ajoutées), on garde aussi une copie locale
                if (result.devCode) {
                    const otpSession = {
                        code: result.devCode,
                        phone: phone,
                        expiresAt: Date.now() + (5 * 60 * 1000)
                    };
                    try {
                        sessionStorage.setItem('active_otp_' + phone.replace(/[^\d+]/g, ''), JSON.stringify(otpSession));
                    } catch(e) {}
                }
                return result;
            } else if (result && result.message) {
                return { success: false, message: result.message, devCode: result.devCode };
            }
        } catch (apiErr) {
            console.warn("API /api/otp/send non joignable, tentative de secours:", apiErr);
        }

        // 2. Tenter via Supabase RPC si configuré
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient.rpc('generate_otp', {
                    p_phone: phone
                });
                if (!error && data) {
                    if (typeof OneSignalManager !== 'undefined' && OneSignalManager.sendOtpNotification) {
                        OneSignalManager.sendOtpNotification(phone, data);
                    }
                    return { success: true, isDemoMode: false, code: data };
                }
            } catch (err) {
                console.warn("RPC Supabase generate_otp indisponible, bascule locale:", err);
            }
        }

        // 3. Génération locale de secours
        const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpSession = {
            code: generatedCode,
            phone: phone,
            expiresAt: Date.now() + (5 * 60 * 1000)
        };
        try {
            sessionStorage.setItem('active_otp_' + phone.replace(/[^\d+]/g, ''), JSON.stringify(otpSession));
        } catch(e) {}

        return {
            success: true,
            isDemoMode: true,
            devCode: generatedCode,
            message: "Code généré en mode local"
        };
    }

    async verifyOtp(phone, code) {
        // 1. Vérification via backend Twilio API (/api/otp/verify)
        try {
            const response = await fetch('/api/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, code })
            });
            const result = await response.json();
            if (response.ok && result.verified) {
                return { success: true, verified: true };
            }
            if (result && result.message) {
                return { success: false, verified: false, message: result.message };
            }
        } catch (apiErr) {
            console.warn("API /api/otp/verify non joignable, tentative locale:", apiErr);
        }

        // 2. Tenter via Supabase RPC si configuré
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient.rpc('verify_otp', {
                    p_phone: phone,
                    p_code: code
                });
                if (!error && typeof data === 'boolean' && data) {
                    return { success: true, verified: true };
                }
            } catch (err) {
                console.warn("RPC Supabase verify_otp indisponible:", err);
            }
        }

        // 3. Vérification locale de l'OTP actif
        try {
            const rawSession = sessionStorage.getItem('active_otp_' + phone.replace(/[^\d+]/g, ''));
            if (!rawSession) return { success: false, verified: false, message: "Code expiré ou inexistant" };
            const session = JSON.parse(rawSession);
            if (Date.now() > session.expiresAt) {
                sessionStorage.removeItem('active_otp_' + phone.replace(/[^\d+]/g, ''));
                return { success: false, verified: false, message: "Le code a expiré" };
            }
            if (session.code === String(code).trim()) {
                sessionStorage.removeItem('active_otp_' + phone.replace(/[^\d+]/g, ''));
                return { success: true, verified: true };
            }
        } catch(e) {}

        return { success: false, verified: false, message: "Code incorrect" };
    }
}

const store = new Store();

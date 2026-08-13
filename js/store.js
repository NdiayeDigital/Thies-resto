let currentRestaurantSession = null;
let isSuperAdminSession = false;
try {
    const sessionStr = sessionStorage.getItem('resto_session');
    if (sessionStr) {
        currentRestaurantSession = JSON.parse(sessionStr);
    }
    isSuperAdminSession = sessionStorage.getItem('admin_session') === 'true' || sessionStorage.getItem('thies_admin_logged') === 'true';
} catch (e) {
    console.warn("sessionStorage is not accessible or invalid. Session data will be held in memory only.", e);
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
        // Enregistrement exclusif sur Supabase (pas de localStorage local)
        this.data = {
            restaurants: [],
            orders: [],
            reservations: [],
            groupOrders: []
        };
        
        // Background sync with Supabase
        if (supabaseClient) {
            this.syncPromise = this.syncFromSupabase();
        } else {
            this.syncPromise = Promise.resolve();
        }
    }

    // load() has been removed as data is exclusively fetched from Supabase
    
    // save() is now a no-op to prevent errors, all data is pushed to Supabase directly
    save() {
        // No local storage saving anymore.
    }

    async syncFromSupabase() {
        if (!supabaseClient) return;
        try {
            console.log("Syncing with Supabase...");

            // 1. Sync Restaurants (Tous les restaurants)
            const { data: dbRestos, error: restosError } = await supabaseClient.from('restaurants').select('*');

            // We NO LONGER fetch all menu_items globally for performance reasons (Lazy Loading)
            if (!restosError && dbRestos) {
                if (dbRestos.length === 0) {
                    console.log("Database is empty. Returning early...");
                    // await this.seedRemoteDatabase(); // Remove auto-seed from client
                    this.data.restaurants = []; // Start empty
                    return;
                }
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
                        rating: Number(r.rating),
                        reviewsCount: Number(r.reviews_count),
                        category: r.category,
                        address: r.address,
                        whatsapp: r.whatsapp,
                        openHours: r.open_hours,
                        closedDays: Array.isArray(r.closed_days) ? r.closed_days : (r.closed_days ? JSON.parse(r.closed_days) : []),
                        isOpenManual: Boolean(r.is_open_manual),
                        lat: r.lat ? Number(r.lat) : 14.7928, // Default Thiès center if not set
                        lng: r.lng ? Number(r.lng) : -16.9260,
                        coverImage: (r.cover_image && r.cover_image !== 'null' && r.cover_image !== 'undefined') ? r.cover_image : null,
                        menu: [], // Menu is lazy-loaded when the user opens the restaurant page
                        reviews: Array.isArray(parsedReviews) ? parsedReviews : []
                    };
                });
                
                // Merge locally saved credentials for normal operation if not fetched (public_restaurants hides them)
                const mergedRestos = mappedRestos.map(dbR => {
                    const localR = this.data.restaurants.find(lr => lr.id === dbR.id);
                    if (localR) {
                        const baseName = String(dbR.name || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
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
                    const baseName = String(dbR.name || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                    let fallbackCover = '';
                    if (typeof RESTAURANT_COVERS !== 'undefined' && RESTAURANT_COVERS[dbR.id]) {
                        fallbackCover = RESTAURANT_COVERS[dbR.id];
                    } else if (typeof COVER_IMAGES !== 'undefined' && COVER_IMAGES[dbR.category]) {
                        fallbackCover = COVER_IMAGES[dbR.category];
                    }
                    
                    return {
                        ...dbR,
                        menu: dbR.menu || [],
                        username: 'id_' + baseName,
                        password: baseName + '221',
                        status: dbR.status || 'active',
                        subscriptionPack: 'Aucun (Gratuit)',
                        createdAt: dbR.createdAt || '2026-06-25T00:00:00Z',
                        coverImage: dbR.coverImage || fallbackCover
                    };
                });

                this.data.restaurants = mergedRestos;
                } catch(error) {
                    console.error("Error during Supabase mapping:", error);
                }
            } else {
                console.error("Error fetching nearby restaurants", restosError);
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
                        const mappedOrders = adminData.orders.map(o => ({
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
                p_loyalty_applied: order.loyaltyApplied || false
            });
            if (error) {
                console.error("RPC Error place_secure_order:", error);
            }
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
            const { data: menuItems, error } = await supabaseClient
                .from('menu_items')
                .select('*')
                .eq('restaurant_id', restaurantId);

            if (error) throw error;
            
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
                        available: item.is_available
                    };
                });
            }

            // Update local cache
            if (resto) {
                resto.menu = parsedMenu;
                // We don't necessarily need to this.save() because menu is re-fetchable, 
                // but we can to persist the cache
                this.save();
            }

            return parsedMenu;
        } catch (error) {
            console.error("Error fetching menu items:", error);
            return [];
        }
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
            console.error("Supabase client not initialized.");
            return null;
        }
        try {
            const { data, error } = await supabaseClient.rpc('create_secure_order', { payload: payload });
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error creating secure order:", error);
            throw error;
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
            return null;
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
}

const store = new Store();

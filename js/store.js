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
        this.key = 'THIES_RESTO_DB_V2';
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
        // Initialize base structure
        const restaurants = SEED_RESTAURANTS.map(r => {
            // Pick a matching menu template based on category
            const menuType = MENU_TEMPLATES[r.category] ? r.category : "Traditionnel";
            const menu = JSON.parse(JSON.stringify(MENU_TEMPLATES[menuType]));
            
            // Generate reviews list
            const reviews = SAMPLE_REVIEWS.map((rev, index) => ({
                id: `rev_${r.id}_${index}`,
                author: rev.author,
                rating: rev.rating,
                comment: rev.comment,
                date: rev.date,
                reply: rev.reply
            }));

            return {
                ...r,
                
                
                coverImage: RESTAURANT_COVERS[r.id] || COVER_IMAGES[r.category] || COVER_IMAGES["Traditionnel"],
                menu,
                reviews
            };
        });

        // Initialize orders
        const orders = [
            {
                id: "ORD-9821",
                restaurantId: "r18",
                customerName: "Moussa Ndiaye",
                customerPhone: "+221776541234",
                mode: "Livraison",
                address: "Cité Lamy, Villa 104, Thiès",
                items: [
                    { name: 'Lotte rôtie sauce vanille de Casamance', price: 7500, qty: 1 },
                    { name: 'Moelleux au Chocolat & Coulis Bissap', price: 2500, qty: 2 }
                ],
                total: 12500,
                note: "Sans piment s'il vous plaît",
                status: "Confirmée",
                date: "2026-06-18",
                time: "14:15"
            },
            {
                id: "ORD-1204",
                restaurantId: "r18",
                customerName: "Awa Diop",
                customerPhone: "+221768884422",
                mode: "A emporter",
                address: "",
                items: [
                    { name: 'Filet de Bœuf braisé au Café Touba', price: 8000, qty: 1 }
                ],
                total: 8000,
                note: "",
                status: "Reçue",
                date: "2026-06-18",
                time: "17:05"
            }
        ];

        // Initialize reservations
        const reservations = [
            {
                id: "RES-4482",
                restaurantId: "r18",
                customerName: "Babacar Sy",
                customerPhone: "+221774443322",
                date: "2026-06-20",
                time: "20:30",
                guests: 4,
                note: "Table en terrasse si possible",
                status: "Confirmée"
            }
        ];

        this.data = {
            restaurants,
            orders,
            reservations,
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
                        return {
                            ...dbR,
                            menu: (dbR.menu && dbR.menu.length > 0) ? dbR.menu : localR.menu,
                            coverImage: dbR.coverImage || localR.coverImage,
                            username: localR.username,
                            password: localR.password,
                            status: localR.status
                        };
                    }
                    return {
                        ...dbR,
                        menu: dbR.menu || [],
                        username: dbR.slug,
                        password: '',
                        status: 'active'
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
                reviews: resto.reviews
            });

            if (error && error.code === '23505') {
                if (isSuperAdminSession) {
                    const adminPass = sessionStorage.getItem('admin_password') || 'adminthies';
                    await supabaseClient.rpc('admin_update_restaurant', {
                        p_admin_password: adminPass,
                        p_restaurant_id: resto.id,
                        p_updates: {
                            name: resto.name,
                            status: resto.status,
                            username: resto.username,
                            password: resto.password
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
                const adminPass = sessionStorage.getItem('admin_password') || 'adminthies';
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

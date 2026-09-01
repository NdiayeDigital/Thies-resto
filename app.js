
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

// ----------------------------------------------------
function logoutRestaurant() {
    try {
        sessionStorage.removeItem('resto_session');
        localStorage.removeItem('resto_session');
        sessionStorage.removeItem('restaurantSession');
    } catch(e) {}
    currentRestaurantSession = null;
    if (typeof showToast === 'function') showToast('Déconnexion Restaurant réussie. Vous êtes maintenant sur l\'espace client.', 'info');
    if (typeof updateNavbar === 'function') updateNavbar();
    if (typeof router !== 'undefined') router.navigate('/');
}
window.logoutRestaurant = logoutRestaurant;

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



// Auth handlers are managed primarily in js/auth.js with multi-layer resilience
// The global implementations are exported on window in js/auth.js

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

function escapeHTML(str) {
    if (!str) return '';
    return str.toString().replace(/[&<>"']/g, function(m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[m];
    });
}

// Global Cart State (Unified reference across all modules)
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
var cart = window.cart;

// ---------- CART PERSISTENCE & HELPERS ----------
function saveCart() {
    try {
        localStorage.setItem('THIES_CART', JSON.stringify(cart));
    } catch(e) {
        console.warn("Could not save cart:", e);
    }
}
window.saveCart = saveCart;

function recalculateCart() {
    if (!cart.items || !Array.isArray(cart.items)) {
        cart.items = [];
    }
    let subtotal = cart.items.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.qty || 1)), 0);
    cart.subtotal = subtotal;
    if (cart.loyaltyApplied) {
        cart.total = Math.max(0, subtotal - 2500);
    } else {
        cart.total = subtotal;
    }
    if (cart.deliveryFee) {
        cart.total += Number(cart.deliveryFee || 0);
    }
    window.cart = cart;
    return cart.total;
}
window.recalculateCart = recalculateCart;

function loadCart() {
    try {
        const saved = localStorage.getItem('THIES_CART');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && typeof parsed === 'object') {
                cart.restaurantId = parsed.restaurantId || null;
                cart.items = Array.isArray(parsed.items) ? parsed.items : [];
                cart.subtotal = Number(parsed.subtotal || 0);
                cart.total = Number(parsed.total || 0);
                cart.deliveryFee = Number(parsed.deliveryFee || 0);
                cart.deliveryLat = parsed.deliveryLat || null;
                cart.deliveryLng = parsed.deliveryLng || null;
                cart.loyaltyApplied = !!parsed.loyaltyApplied;
                cart.loyaltyPhone = parsed.loyaltyPhone || null;
                recalculateCart();
            }
        }
    } catch(e) {
        console.warn("Could not load cart:", e);
    }
    window.cart = cart;
    return cart;
}
window.loadCart = loadCart;
loadCart();

function resetCart() {
    cart.restaurantId = null;
    cart.items = [];
    cart.subtotal = 0;
    cart.total = 0;
    cart.deliveryFee = 0;
    cart.deliveryLat = null;
    cart.deliveryLng = null;
    cart.loyaltyApplied = false;
    cart.loyaltyPhone = null;
    window.cart = cart;
    saveCart();
    if (typeof updateFloatingCartBar === 'function') {
        updateFloatingCartBar();
    }
}
window.resetCart = resetCart;

function clearCart() {
    if (!cart.items || cart.items.length === 0) return;
    const confirmed = confirm("Voulez-vous vraiment vider l'ensemble de votre panier ?");
    if (!confirmed) return;
    
    const restoId = cart.restaurantId;
    resetCart();
    
    if (restoId) {
        const r = store.getRestaurantById(restoId);
        if (r && typeof renderCheckoutTab === 'function') {
            renderCheckoutTab(r);
        }
    } else {
        const panel = document.getElementById('checkout-content-container');
        if (panel) {
            panel.innerHTML = `
                <div style="text-align: center; padding: 4rem 1rem;">
                    <span style="font-size: 3rem;">🛒</span>
                    <h3 style="margin-top: 1rem;">Votre panier est vide</h3>
                    <p style="color: var(--text-secondary); margin: 0.5rem 0 1.5rem 0;">Parcourez notre menu du jour et ajoutez des délices !</p>
                    <button class="btn btn-primary" onclick="switchRestoTab('menu')">Voir le Menu</button>
                </div>
            `;
        }
    }
    if (typeof showToast === 'function') {
        showToast("Votre panier a été vidé", "info");
    }
}
window.clearCart = clearCart;

function removeCartItem(dishId) {
    if (!cart.items) return;
    const idx = cart.items.findIndex(item => String(item.id) === String(dishId));
    if (idx !== -1) {
        const removedItem = cart.items[idx];
        cart.items.splice(idx, 1);
        if (cart.items.length === 0) {
            cart.restaurantId = null;
            cart.deliveryFee = 0;
            cart.loyaltyApplied = false;
        }
        recalculateCart();
        saveCart();
        const r = cart.restaurantId ? store.getRestaurantById(cart.restaurantId) : null;
        if (r) {
            updateFloatingCartBar(r);
            renderCheckoutTab(r);
        } else {
            updateFloatingCartBar();
            const container = document.getElementById('checkout-content-container');
            if (container) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 4rem 1rem;">
                        <span style="font-size: 3rem;">🛒</span>
                        <h3 style="margin-top: 1rem;">Votre panier est vide</h3>
                        <p style="color: var(--text-secondary); margin: 0.5rem 0 1.5rem 0;">Parcourez notre menu du jour et ajoutez des délices !</p>
                        <button class="btn btn-primary" onclick="switchRestoTab('menu')">Voir le Menu</button>
                    </div>
                `;
            }
        }
        if (typeof showToast === 'function') {
            showToast(`${removedItem.name} retiré du panier`, "info");
        }
    }
}
window.removeCartItem = removeCartItem;

// Safe HTML escaping helper using DOMPurify
function sanitizeHTML(html) {
    if (typeof DOMPurify !== 'undefined') {
        return DOMPurify.sanitize(html);
    }
    // Fallback simple escape
    return html.replace(/[&<>"']/g, function(m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[m];
    });
}

// Current Session is managed in store.js

// Temporary Group Order object in memory
let activeGroupOrder = null;

// Active category filter
let activeFilter = 'Tous';
let activeSortBy = 'default';

// ---------- LOADING STATE ----------
// Loading overlay has been completely removed. Keeping an empty function for compatibility.
function hideLoadingOverlay() {
    // No-op
}

// ---------- THEME TOGGLE ----------
function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    try { localStorage.setItem('THIES_THEME', next); } catch(e) {}
    updateThemeToggleUI(next);
    if (typeof showToast === 'function') {
        showToast(next === 'dark' ? 'Mode Sombre activé 🌙' : 'Mode Clair activé ☀️', 'info', 1800);
    }
}
window.toggleTheme = toggleTheme;

function updateThemeToggleUI(theme) {
    const icon = document.getElementById('theme-toggle-icon');
    const label = document.getElementById('theme-toggle-label');
    if (icon) icon.textContent = theme === 'light' ? '🌙' : '☀️';
    if (label) label.textContent = theme === 'light' ? 'Mode Sombre' : 'Mode Clair';
    
    // Dynamically update mobile browser address bar color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', theme === 'dark' ? '#0F1117' : '#F26B21');
    }
}
window.updateThemeToggleUI = updateThemeToggleUI;

function loadSavedTheme() {
    try {
        const saved = localStorage.getItem('THIES_THEME') || 'light';
        document.documentElement.setAttribute('data-theme', saved);
        updateThemeToggleUI(saved);
    } catch(e) {}
}
window.loadSavedTheme = loadSavedTheme;
loadSavedTheme();

// ---------- CART PULSE ----------

function pulseCartBar() {
    // Haptic feedback (vibration) for mobile users
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
    
    const bar = document.getElementById('floating-cart-bar');
    const qty = document.getElementById('floating-cart-qty');
    const btn = document.getElementById('floating-cart-btn');
    const bottomNavQty = document.getElementById('bottom-nav-cart-qty');
    
    [bar, qty, btn, bottomNavQty].forEach(el => {
        if (el) {
            el.classList.remove('cart-pulse', 'bounce');
            void el.offsetWidth; // Trigger reflow
            el.classList.add('cart-pulse', 'bounce');
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
        const phone = order.customerPhone || localStorage.getItem('customerPhone') || '';
        const isPhoneVerified = phone ? localStorage.getItem('phoneVerified_' + phone) === 'true' : false;
        const isOtp = order.otpVerified !== undefined ? order.otpVerified : isPhoneVerified;
        
        if (phone) {
            localStorage.setItem('customerPhone', phone);
        }
        if (order.id) {
            localStorage.setItem('trackingOrderId', String(order.id));
        }

        history.unshift({ 
            ...order, 
            restaurantName, 
            otpVerified: isOtp,
            otpVerifiedVia: order.otpVerifiedVia || (isOtp ? 'Twilio SMS OTP' : null),
            savedAt: new Date().toISOString() 
        });
        if (history.length > 20) history = history.slice(0, 20);
        localStorage.setItem('THIES_ORDER_HISTORY', JSON.stringify(history));
    } catch(e) {}
}
function getOrderHistory() {
    try {
        return JSON.parse(localStorage.getItem('THIES_ORDER_HISTORY') || '[]');
    } catch(e) { return []; }
}

// ---------- SPLASH SCREEN & FAVORITES & BOTTOM NAV MANAGEMENT ----------
window.dismissSplashScreen = function() {
    const splash = document.getElementById('splash-screen');
    if (splash) {
        splash.classList.add('hidden');
        sessionStorage.setItem('thies_splash_seen', 'true');
        setTimeout(() => {
            splash.style.display = 'none';
        }, 600);
    }
};

window.showWelcomeScreen = function() {
    const splash = document.getElementById('splash-screen');
    if (splash) {
        splash.style.display = 'flex';
        splash.classList.remove('hidden');
    }
};

window.getFavorites = function() {
    try {
        return JSON.parse(localStorage.getItem('THIES_FAVORITES') || '[]');
    } catch(e) {
        return [];
    }
};

window.isFavorite = function(restaurantId) {
    const favs = window.getFavorites();
    return favs.includes(restaurantId);
};

window.toggleFavorite = function(restaurantId, event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }
    let favs = window.getFavorites();
    const index = favs.indexOf(restaurantId);
    let added = false;
    if (index > -1) {
        favs.splice(index, 1);
        added = false;
    } else {
        favs.push(restaurantId);
        added = true;
    }
    localStorage.setItem('THIES_FAVORITES', JSON.stringify(favs));
    
    window.updateFavoritesBadge();
    
    document.querySelectorAll(`[data-fav-resto-id="${restaurantId}"]`).forEach(btn => {
        if (added) {
            btn.classList.add('is-fav', 'active');
            btn.innerHTML = '❤️';
        } else {
            btn.classList.remove('is-fav', 'active');
            btn.innerHTML = '🤍';
        }
    });

    if (typeof showToast === 'function') {
        if (added) {
            showToast("Ajouté aux favoris ❤️", "success");
        } else {
            showToast("Retiré des favoris", "info");
        }
    }
    
    if (window.location.hash === '#/favorites' && typeof renderFavoritesView === 'function') {
        renderFavoritesView();
    }
};

window.updateFavoritesBadge = function() {
    const favs = window.getFavorites();
    const badge = document.getElementById('mobile-nav-fav-badge');
    if (badge) {
        if (favs.length > 0) {
            badge.textContent = favs.length;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    }
};

window.handleLogoClick = function() {
    if (typeof currentRestaurantSession !== 'undefined' && currentRestaurantSession) {
        if (typeof router !== 'undefined') router.navigate('/dashboard');
    } else if (typeof isSuperAdminSession !== 'undefined' && isSuperAdminSession) {
        if (typeof router !== 'undefined') router.navigate('/admin');
    } else {
        if (typeof router !== 'undefined') router.navigate('/');
    }
};

window.switchDashboardSection = function(sectionName) {
    if (typeof currentRestaurantSession === 'undefined' || !currentRestaurantSession) {
        if (typeof showToast === 'function') showToast("Veuillez vous connecter à votre espace restaurant.", "warning");
        if (typeof router !== 'undefined') router.navigate('/auth');
        return;
    }

    if (sectionName === 'accounting' || sectionName === 'summary') {
        if (typeof dashboardActiveTab !== 'undefined') dashboardActiveTab = 'accounting';
        if (typeof router !== 'undefined') router.navigate('/dashboard');
    } else if (sectionName === 'orders' || sectionName === 'reservations') {
        if (typeof dashboardActiveTab !== 'undefined') dashboardActiveTab = 'orders';
        if (typeof router !== 'undefined') router.navigate('/dashboard-orders');
    } else if (sectionName === 'dishes' || sectionName === 'menu' || sectionName === 'add-menu' || sectionName === 'daily-menu') {
        if (typeof dashboardActiveTab !== 'undefined') dashboardActiveTab = 'dishes';
        if (typeof router !== 'undefined') router.navigate('/dashboard-dishes');
    } else if (sectionName === 'account' || sectionName === 'settings' || sectionName === 'subscription' || sectionName === 'reviews') {
        if (typeof dashboardActiveTab !== 'undefined') dashboardActiveTab = 'account';
        if (typeof router !== 'undefined') router.navigate('/dashboard-account');
    } else {
        // default: accounting (premiere page)
        if (typeof dashboardActiveTab !== 'undefined') dashboardActiveTab = 'accounting';
        if (typeof router !== 'undefined') router.navigate('/dashboard');
    }

    if (typeof updateNavbar === 'function') updateNavbar();
    if (typeof renderMobileBottomNav === 'function') renderMobileBottomNav();
};

window.renderMobileBottomNav = function() {
    const nav = document.getElementById('mobile-bottom-nav');
    if (!nav) return;

    // 1. Logged in Restaurant (Restaurant Only Navigation - 4 Clean Pages: Comptabilité, Commandes, Plats, Compte)
    if (typeof currentRestaurantSession !== 'undefined' && currentRestaurantSession && (typeof isSuperAdminSession === 'undefined' || !isSuperAdminSession)) {
        const active = typeof dashboardActiveTab !== 'undefined' ? dashboardActiveTab : 'accounting';
        const isAccounting = active === 'accounting' || active === 'summary';
        const isOrders = active === 'orders' || active === 'reservations';
        const isDishes = active === 'dishes' || active === 'menu' || active === 'add-menu' || active === 'daily-menu';
        const isAccount = active === 'account' || active === 'settings' || active === 'subscription' || active === 'reviews';

        nav.innerHTML = `
            <a href="#" id="bottom-nav-resto-accounting" class="nav-item ${isAccounting ? 'active' : ''}" onclick="switchDashboardSection('accounting'); return false;">
                <div class="nav-icon"><i class="ri-bar-chart-2-line"></i></div>
                <span>Comptabilité</span>
            </a>
            <a href="#" id="bottom-nav-resto-orders" class="nav-item ${isOrders ? 'active' : ''}" onclick="switchDashboardSection('orders'); return false;">
                <div class="nav-icon"><i class="ri-file-list-3-line"></i></div>
                <span>Commandes</span>
            </a>
            <a href="#" id="bottom-nav-resto-dishes" class="nav-item ${isDishes ? 'active' : ''}" onclick="switchDashboardSection('dishes'); return false;">
                <div class="nav-icon"><i class="ri-restaurant-line"></i></div>
                <span>Plats</span>
            </a>
            <a href="#" id="bottom-nav-resto-account" class="nav-item ${isAccount ? 'active' : ''}" onclick="switchDashboardSection('account'); return false;">
                <div class="nav-icon"><i class="ri-user-settings-line"></i></div>
                <span>Compte</span>
            </a>
        `;
    } 
    // 2. Super Admin Session (Central Administration Navigation)
    else if (typeof isSuperAdminSession !== 'undefined' && isSuperAdminSession) {
        nav.innerHTML = `
            <a href="#" id="bottom-nav-admin-console" class="nav-item active" onclick="router.navigate('/admin'); return false;">
                <div class="nav-icon"><i class="ri-dashboard-3-line"></i></div>
                <span>Supervision</span>
            </a>
            <a href="#" id="bottom-nav-admin-chart" class="nav-item" onclick="router.navigate('/politique-admin'); return false;">
                <div class="nav-icon"><i class="ri-file-text-line"></i></div>
                <span>Charte</span>
            </a>
            <a href="#" id="bottom-nav-admin-logout" class="nav-item" onclick="logoutAdmin(); return false;" style="color: var(--danger);">
                <div class="nav-icon"><i class="ri-logout-box-r-line"></i></div>
                <span>Déconnexion</span>
            </a>
        `;
    }
    // 3. Public Client Mode (5 Essential Customer Tabs)
    else {
        nav.innerHTML = `
            <a href="#" id="bottom-nav-home" class="nav-item active" onclick="router.navigate('/'); updateBottomNavActive('home'); return false;">
                <div class="nav-icon"><i class="ri-home-5-fill"></i></div>
                <span>Accueil</span>
            </a>
            <a href="#" id="bottom-nav-explore" class="nav-item" onclick="router.navigate('/explore'); updateBottomNavActive('explore'); return false;">
                <div class="nav-icon"><i class="ri-compass-3-line"></i></div>
                <span>Explorer</span>
            </a>
            <a href="#" id="bottom-nav-favorites" class="nav-item" onclick="router.navigate('/favorites'); updateBottomNavActive('favorites'); return false;">
                <div class="nav-icon"><i class="ri-heart-3-line"></i></div>
                <span>Favoris</span>
                <span id="mobile-nav-fav-badge" class="nav-badge" style="display: none;">0</span>
            </a>
            <a href="#" id="bottom-nav-orders" class="nav-item" onclick="router.navigate('/tracking'); updateBottomNavActive('orders'); return false;">
                <div class="nav-icon"><i class="ri-file-list-3-line"></i></div>
                <span>Commandes</span>
            </a>
            <a href="#" id="bottom-nav-profile" class="nav-item" onclick="router.navigate('/profile'); updateBottomNavActive('profile'); return false;">
                <div class="nav-icon"><i class="ri-user-3-line"></i></div>
                <span>Compte</span>
            </a>
        `;
    }
};

window.updateBottomNavActive = function(tabName) {
    document.querySelectorAll('.mobile-bottom-nav .nav-item').forEach(item => {
        item.classList.remove('active');
    });
    const target = document.getElementById('bottom-nav-' + tabName) || document.getElementById('bottom-nav-resto-' + tabName);
    if (target) {
        target.classList.add('active');
    }
};

window.updateBottomNavFromRoute = function(hash) {
    window.renderMobileBottomNav();

    // Check Restaurant routes
    if (typeof currentRestaurantSession !== 'undefined' && currentRestaurantSession && (typeof isSuperAdminSession === 'undefined' || !isSuperAdminSession)) {
        if (!hash || hash === '#/dashboard' || hash.startsWith('#/dashboard-accounting')) {
            window.updateBottomNavActive('resto-accounting');
        } else if (hash.startsWith('#/dashboard-orders') || hash.startsWith('#/dashboard-reservations')) {
            window.updateBottomNavActive('resto-orders');
        } else if (hash.startsWith('#/dashboard-dishes') || hash.startsWith('#/dashboard-menu') || hash.startsWith('#/dashboard-add-menu') || hash.startsWith('#/dashboard-daily-menu')) {
            window.updateBottomNavActive('resto-dishes');
        } else if (hash.startsWith('#/dashboard-account') || hash.startsWith('#/dashboard-settings') || hash.startsWith('#/dashboard-subscription') || hash.startsWith('#/dashboard-reviews')) {
            window.updateBottomNavActive('resto-account');
        }
        return;
    }

    if (!hash || hash === '#/' || hash === '#') {
        window.updateBottomNavActive('home');
    } else if (hash.startsWith('#/explore')) {
        window.updateBottomNavActive('explore');
    } else if (hash.startsWith('#/favorites')) {
        window.updateBottomNavActive('favorites');
    } else if (hash.startsWith('#/tracking')) {
        window.updateBottomNavActive('orders');
    } else if (hash.startsWith('#/profile')) {
        window.updateBottomNavActive('profile');
    } else {
        document.querySelectorAll('.mobile-bottom-nav .nav-item').forEach(item => {
            item.classList.remove('active');
        });
    }
    window.updateFavoritesBadge();
};

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
                            
                            // Trigger Push Notification if permission granted
                            if ("Notification" in window && Notification.permission === "granted") {
                                new Notification("Nouvelle Commande 🔔", { 
                                    body: `Commande reçue de ${newOrder.customer_name} pour ${newOrder.total} FCFA`,
                                    icon: "icon.png" 
                                });
                            }
                            
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
window.scrollToHowItWorks = function scrollToHowItWorks() {
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
};

window.switchHowItWorksTab = function switchHowItWorksTab(tabId) {
    document.querySelectorAll('.hw-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.hw-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`.hw-tab-btn[onclick*="${tabId}"]`);
    const activeContent = document.getElementById(tabId);
    if (activeBtn) activeBtn.classList.add('active');
    if (activeContent) activeContent.classList.add('active');
};

window.scrollToCatalog = function scrollToCatalog() {
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
};

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

// Modern Reusable Notification Toast System
window.showToast = function(message, type = 'info', options = {}) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        container.setAttribute('aria-live', 'polite');
        container.setAttribute('aria-atomic', 'true');
        document.body.appendChild(container);
    }

    // Limit maximum stacked toasts to 3 for clean view
    const currentToasts = container.querySelectorAll('.toast-item:not(.toast-removing)');
    if (currentToasts.length >= 3) {
        const oldest = currentToasts[0];
        window.dismissToast(oldest);
    }

    const duration = options.duration || (type === 'cart' ? 4500 : 3800);
    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;
    toast.setAttribute('role', type === 'danger' || type === 'error' ? 'alert' : 'status');

    // Determine icon / visual
    let iconContent = '';
    if (options.image) {
        iconContent = `<img src="${options.image}" alt="" class="toast-dish-thumb" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=60'">`;
    } else if (options.icon) {
        iconContent = `<div class="toast-icon-wrap">${options.icon}</div>`;
    } else {
        let defaultIcon = 'ℹ️';
        if (type === 'success') defaultIcon = '✓';
        else if (type === 'cart') defaultIcon = '🛒';
        else if (type === 'danger' || type === 'error') defaultIcon = '✕';
        else if (type === 'warning') defaultIcon = '⚠️';
        iconContent = `<div class="toast-icon-wrap">${defaultIcon}</div>`;
    }

    let headline = options.title || '';
    let subtext = '';

    if (headline) {
        subtext = message;
    } else {
        headline = message;
    }

    // Action button (e.g. "Voir le panier")
    let actionBtnHtml = '';
    if (options.actionText) {
        actionBtnHtml = `<button type="button" class="toast-action-btn">${options.actionText}</button>`;
    }

    toast.innerHTML = `
        <div class="toast-body">
            ${iconContent}
            <div class="toast-content-col">
                <div class="toast-headline">${headline}</div>
                ${subtext ? `<div class="toast-subtext">${subtext}</div>` : ''}
            </div>
            <div class="toast-actions-wrap">
                ${actionBtnHtml}
                <button type="button" class="toast-close-btn" aria-label="Fermer la notification">✕</button>
            </div>
        </div>
        <div class="toast-progress-track">
            <div class="toast-progress-fill" style="animation-duration: ${duration}ms;"></div>
        </div>
    `;

    container.appendChild(toast);

    // Close button
    const closeBtn = toast.querySelector('.toast-close-btn');
    if (closeBtn) {
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            window.dismissToast(toast);
        };
    }

    // Action button callback
    if (options.actionText && typeof options.onAction === 'function') {
        const actionBtn = toast.querySelector('.toast-action-btn');
        if (actionBtn) {
            actionBtn.onclick = (e) => {
                e.stopPropagation();
                options.onAction();
                window.dismissToast(toast);
            };
        }
    }

    // Auto-dismiss timer
    let dismissTimeout = setTimeout(() => {
        window.dismissToast(toast);
    }, duration);

    // Pause on hover
    toast.onmouseenter = () => {
        clearTimeout(dismissTimeout);
        const fill = toast.querySelector('.toast-progress-fill');
        if (fill) fill.style.animationPlayState = 'paused';
    };

    toast.onmouseleave = () => {
        const fill = toast.querySelector('.toast-progress-fill');
        if (fill) fill.style.animationPlayState = 'running';
        dismissTimeout = setTimeout(() => {
            window.dismissToast(toast);
        }, 1500);
    };

    return toast;
};

// Global dismiss helper
window.dismissToast = function(toastEl) {
    if (!toastEl || toastEl.classList.contains('toast-removing')) return;
    toastEl.classList.add('toast-removing');
    setTimeout(() => {
        if (toastEl.parentNode) toastEl.parentNode.removeChild(toastEl);
    }, 280);
};

// Specialized helper for adding items to the cart
window.showCartToast = function(dish, qty = 1, restaurant = null) {
    const itemPrice = (dish.price * qty).toLocaleString('fr-FR');
    
    // Play light haptic feedback if supported
    if (navigator.vibrate) {
        try { navigator.vibrate(35); } catch(e) {}
    }

    window.showToast(`${qty > 1 ? qty + 'x ' : ''}${dish.name} • ${itemPrice} FCFA`, 'cart', {
        title: 'Ajouté au panier ! 🛒',
        image: dish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=60',
        duration: 4500,
        actionText: 'Voir le panier ➔',
        onAction: () => {
            if (typeof openCartTab === 'function') {
                openCartTab();
            }
        }
    });
};

// Modern Custom Confirmation Modal to replace native confirm()
window.showConfirmModal = function(title, message, onConfirm, onCancel = null) {
    let modal = document.getElementById('custom-confirm-modal');
    if (modal) modal.remove();
    
    modal = document.createElement('div');
    modal.id = 'custom-confirm-modal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.6); display: flex; align-items: center;
        justify-content: center; z-index: 100000; backdrop-filter: blur(4px);
        animation: fadeIn 0.2s ease-out; padding: 1.5rem;
    `;
    
    modal.innerHTML = `
        <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; max-width: 400px; width: 100%; padding: 2rem; box-shadow: var(--shadow); text-align: center; animation: scaleUp 0.2s ease-out;">
            <div style="font-size: 2.5rem; margin-bottom: 1rem;">⚠️</div>
            <h3 style="font-family: var(--font-serif); margin-bottom: 0.75rem; color: var(--text-primary); font-size: 1.3rem;">${sanitizeHTML(title)}</h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.5; margin-bottom: 2rem;">${sanitizeHTML(message)}</p>
            <div style="display: flex; gap: 0.75rem; justify-content: center;">
                <button id="confirm-modal-cancel" class="btn btn-secondary btn-sm" style="flex: 1; font-weight: bold; border-radius: 10px;">Annuler</button>
                <button id="confirm-modal-ok" class="btn btn-primary btn-sm" style="flex: 1; font-weight: bold; border-radius: 10px; background: var(--danger); color: white;">Confirmer</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('#confirm-modal-cancel').onclick = function() {
        modal.remove();
        if (onCancel) onCancel();
    };
    
    modal.querySelector('#confirm-modal-ok').onclick = function() {
        modal.remove();
        if (onConfirm) onConfirm();
    };
};

// Modern Custom Info / Alert Modal
window.alertModal = window.showAlertModal = function(title, contentHtml) {
    let modal = document.getElementById('custom-info-modal');
    if (modal) modal.remove();

    modal = document.createElement('div');
    modal.id = 'custom-info-modal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.65); display: flex; align-items: center;
        justify-content: center; z-index: 100000; backdrop-filter: blur(6px);
        animation: fadeIn 0.2s ease-out; padding: 1.25rem;
    `;

    modal.innerHTML = `
        <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: 24px; max-width: 480px; width: 100%; padding: 1.75rem; box-shadow: var(--shadow-lg); animation: scaleUp 0.2s ease-out; position: relative;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; border-bottom: 1px solid var(--border); padding-bottom: 0.75rem;">
                <h3 style="font-family: var(--font-serif); font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin: 0;">${title}</h3>
                <button id="info-modal-close" style="background: var(--bg-input); border: 1px solid var(--border); border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-secondary); font-size: 1.1rem;">✕</button>
            </div>
            <div style="margin-bottom: 1.5rem; max-height: 65vh; overflow-y: auto;">
                ${contentHtml}
            </div>
            <button id="info-modal-ok" class="btn btn-primary btn-block" style="border-radius: 14px; font-weight: 700; padding: 0.75rem;">Fermer</button>
        </div>
    `;

    document.body.appendChild(modal);

    const closeModal = () => modal.remove();
    modal.querySelector('#info-modal-close').onclick = closeModal;
    modal.querySelector('#info-modal-ok').onclick = closeModal;
    modal.onclick = (e) => {
        if (e.target === modal) closeModal();
    };
};

// Format Phone Numbers +221 7X XXX XX XX
function cleanPhoneNumber(phone) {
    if (!phone || typeof phone !== 'string') return '';
    let cleaned = phone.replace(/\s+/g, '').replace(/[^0-9+]/g, '');
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
window.cleanPhoneNumber = cleanPhoneNumber;

// Validation & Real-time Formatting of Senegal Phone Numbers (+221 70/75/76/77/78/33)
function validateSenegalPhoneNumber(rawPhone) {
    if (!rawPhone || typeof rawPhone !== 'string' || !rawPhone.trim()) {
        return {
            isValid: false,
            state: 'empty',
            operator: null,
            nationalNumber: '',
            clean: '',
            formatted: '',
            message: 'Format attendu : 77, 78, 76, 70, 75 (ex: 77 123 45 67)'
        };
    }

    let trimmed = rawPhone.trim();
    let digitsOnly = trimmed.replace(/[^0-9]/g, '');

    // Extract national 9-digit part
    let national = digitsOnly;
    if (digitsOnly.startsWith('00221')) {
        national = digitsOnly.substring(5);
    } else if (digitsOnly.startsWith('221')) {
        national = digitsOnly.substring(3);
    }

    // Operator identification based on first 2 digits
    let op = null;
    if (national.length >= 2) {
        const prefix = national.substring(0, 2);
        if (prefix === '77' || prefix === '78') {
            op = { code: prefix, name: 'Orange', color: '#ff7900', bg: 'rgba(255, 121, 0, 0.12)', icon: '🟠' };
        } else if (prefix === '76') {
            op = { code: prefix, name: 'Free Sénégal', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.12)', icon: '🔴' };
        } else if (prefix === '70') {
            op = { code: prefix, name: 'Expresso', color: '#0284c7', bg: 'rgba(2, 132, 199, 0.12)', icon: '🔵' };
        } else if (prefix === '75') {
            op = { code: prefix, name: 'Promobile / Wave', color: '#9333ea', bg: 'rgba(147, 51, 234, 0.12)', icon: '🟣' };
        } else if (prefix === '33') {
            op = { code: prefix, name: 'Ligne Fixe', color: '#4b5563', bg: 'rgba(75, 85, 99, 0.12)', icon: '☎️' };
        }
    }

    // Formatted readable representation (+221 77 123 45 67)
    let formatted = '';
    if (national.length > 0) {
        const p1 = national.substring(0, 2);
        const p2 = national.substring(2, 5);
        const p3 = national.substring(5, 7);
        const p4 = national.substring(7, 9);
        const pExtra = national.substring(9);
        
        let parts = [p1, p2, p3, p4].filter(p => p.length > 0);
        formatted = '+221 ' + parts.join(' ') + (pExtra ? ' ' + pExtra : '');
    }

    if (national.length === 0) {
        return {
            isValid: false,
            state: 'empty',
            operator: null,
            nationalNumber: '',
            clean: '',
            formatted: '',
            message: 'Format attendu : 77, 78, 76, 70, 75 (ex: 77 123 45 67)'
        };
    }

    if (national.length >= 2 && !op) {
        return {
            isValid: false,
            state: 'invalid_prefix',
            operator: null,
            nationalNumber: national,
            clean: '+221' + national,
            formatted,
            message: '❌ Préfixe invalide (les mobiles commencent par 70, 75, 76, 77 ou 78)'
        };
    }

    if (national.length > 9) {
        return {
            isValid: false,
            state: 'too_long',
            operator: op,
            nationalNumber: national,
            clean: '+221' + national,
            formatted,
            message: `❌ Trop long (${national.length}/9 chiffres) : un numéro sénégalais comporte exactement 9 chiffres`
        };
    }

    if (national.length < 9) {
        const remaining = 9 - national.length;
        const opLabel = op ? `${op.icon} ${op.name}` : 'Saisie...';
        return {
            isValid: false,
            state: 'typing',
            operator: op,
            nationalNumber: national,
            clean: '+221' + national,
            formatted,
            remaining,
            message: `⏳ ${opLabel} • encore ${remaining} chiffre${remaining > 1 ? 's' : ''} requis`
        };
    }

    // Exact 9 digits and recognized operator
    return {
        isValid: true,
        state: 'valid',
        operator: op,
        nationalNumber: national,
        clean: '+221' + national,
        formatted,
        message: `✅ Numéro valide (${op ? op.icon + ' ' + op.name : 'Sénégal'})`
    };
}
window.validateSenegalPhoneNumber = validateSenegalPhoneNumber;

function attachRealtimePhoneValidation(inputEl, feedbackEl, badgeEl, iconEl) {
    if (!inputEl) return null;
    if (typeof inputEl === 'string') inputEl = document.getElementById(inputEl);
    if (!inputEl) return null;
    if (typeof feedbackEl === 'string') feedbackEl = document.getElementById(feedbackEl);
    if (typeof badgeEl === 'string') badgeEl = document.getElementById(badgeEl);
    if (typeof iconEl === 'string') iconEl = document.getElementById(iconEl);

    const updateUI = () => {
        if (!inputEl) return null;
        const val = inputEl.value;
        const res = validateSenegalPhoneNumber(val);

        if (res.state === 'empty') {
            inputEl.style.borderColor = 'var(--border)';
            inputEl.style.boxShadow = 'none';
            if (feedbackEl) {
                feedbackEl.innerHTML = `<span style="color: var(--text-secondary); font-size: 0.76rem;">💡 Format Sénégal : 77, 78, 76, 70, 75 (9 chiffres)</span>`;
            }
            if (badgeEl) badgeEl.innerHTML = '';
            if (iconEl) iconEl.innerHTML = '';
        } else if (res.state === 'valid') {
            inputEl.style.borderColor = '#10b981';
            inputEl.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.15)';
            if (feedbackEl) {
                feedbackEl.innerHTML = `<span style="color: #059669; font-weight: 700; display: inline-flex; align-items: center; gap: 0.35rem;">${res.message} • ${res.formatted}</span>`;
            }
            if (badgeEl && res.operator) {
                badgeEl.innerHTML = `<span style="background: ${res.operator.bg}; color: ${res.operator.color}; padding: 2px 8px; border-radius: 8px; font-size: 0.72rem; font-weight: 700; border: 1px solid ${res.operator.color}40;">${res.operator.icon} ${res.operator.name}</span>`;
            }
            if (iconEl) iconEl.innerHTML = '✅';
        } else if (res.state === 'typing') {
            inputEl.style.borderColor = '#f59e0b';
            inputEl.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.12)';
            if (feedbackEl) {
                feedbackEl.innerHTML = `<span style="color: #d97706; font-weight: 600; display: inline-flex; align-items: center; gap: 0.35rem;">${res.message}</span>`;
            }
            if (badgeEl && res.operator) {
                badgeEl.innerHTML = `<span style="background: ${res.operator.bg}; color: ${res.operator.color}; padding: 2px 8px; border-radius: 8px; font-size: 0.72rem; font-weight: 700; border: 1px solid ${res.operator.color}40;">${res.operator.icon} ${res.operator.name}</span>`;
            } else if (badgeEl) {
                badgeEl.innerHTML = '';
            }
            if (iconEl) iconEl.innerHTML = '✍️';
        } else if (res.state === 'invalid_prefix') {
            inputEl.style.borderColor = '#ef4444';
            inputEl.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.15)';
            if (feedbackEl) {
                feedbackEl.innerHTML = `<span style="color: #dc2626; font-weight: 600; display: inline-flex; align-items: center; gap: 0.35rem;">${res.message}</span>`;
            }
            if (badgeEl) {
                badgeEl.innerHTML = `<span style="background: rgba(220, 38, 38, 0.1); color: #dc2626; padding: 2px 8px; border-radius: 8px; font-size: 0.72rem; font-weight: 700;">Invalide</span>`;
            }
            if (iconEl) iconEl.innerHTML = '❌';
        } else if (res.state === 'too_long') {
            inputEl.style.borderColor = '#ef4444';
            inputEl.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.15)';
            if (feedbackEl) {
                feedbackEl.innerHTML = `<span style="color: #dc2626; font-weight: 600; display: inline-flex; align-items: center; gap: 0.35rem;">${res.message}</span>`;
            }
            if (badgeEl) {
                badgeEl.innerHTML = `<span style="background: rgba(220, 38, 38, 0.1); color: #dc2626; padding: 2px 8px; border-radius: 8px; font-size: 0.72rem; font-weight: 700;">Trop long</span>`;
            }
            if (iconEl) iconEl.innerHTML = '⚠️';
        }
        return res;
    };

    inputEl.addEventListener('input', updateUI);
    inputEl.addEventListener('blur', () => {
        const res = updateUI();
        if (res && res.isValid && res.formatted) {
            inputEl.value = res.formatted;
        }
    });

    setTimeout(updateUI, 50);
    return updateUI;
}
window.attachRealtimePhoneValidation = attachRealtimePhoneValidation;

// ----------------------------------------------------
// Mobile Drawer & Startup Verification Status
// ----------------------------------------------------
window.toggleMobileMenu = function() {
    const drawer = document.getElementById('mobile-drawer');
    const backdrop = document.getElementById('drawer-backdrop');
    const hamburger = document.getElementById('hamburger-btn');
    if (!drawer || !backdrop) return;
    
    const isOpen = drawer.classList.contains('active');
    if (isOpen) {
        drawer.classList.remove('active');
        backdrop.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
        document.body.style.overflow = '';
    } else {
        drawer.classList.add('active');
        backdrop.classList.add('active');
        if (hamburger) hamburger.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

window.updateStartupVerificationUI = function() {
    const geoLabel = document.getElementById('micro-geo-city');
    const geoBtn = document.getElementById('micro-geo-btn');
    const authLabel = document.getElementById('micro-auth-label');
    const authStatusText = document.getElementById('micro-auth-status-text');
    const authDot = document.getElementById('micro-auth-dot');

    if (window.userLat && window.userLng) {
        if (geoLabel) geoLabel.textContent = "Thiès (GPS Actif)";
        if (geoBtn) {
            geoBtn.textContent = "✓ OK";
            geoBtn.classList.add('active');
        }
    } else {
        if (geoLabel) geoLabel.textContent = "Thiès, SN";
        if (geoBtn) {
            geoBtn.textContent = "GPS";
            geoBtn.classList.remove('active');
        }
    }

    if (!authLabel && !authStatusText && !authDot) return;

    if (isSuperAdminSession) {
        if (authLabel) authLabel.textContent = "Super-Admin";
        if (authStatusText) authStatusText.textContent = "Connecté 👑";
        if (authDot) authDot.className = "micro-dot red";
    } else if (currentRestaurantSession) {
        if (authLabel) authLabel.textContent = currentRestaurantSession.name || "Restaurateur";
        if (authStatusText) authStatusText.textContent = "Partenaire 🏪";
        if (authDot) authDot.className = "micro-dot green";
    } else {
        const storedPhone = localStorage.getItem('thies_resto_user_phone') || localStorage.getItem('client_phone');
        if (storedPhone) {
            if (authLabel) authLabel.textContent = "Client";
            if (authStatusText) authStatusText.textContent = "Vérifié ✓";
            if (authDot) authDot.className = "micro-dot green";
        } else {
            if (authLabel) authLabel.textContent = "";
            if (authStatusText) authStatusText.textContent = "";
            if (authDot) authDot.className = "micro-dot blue";
        }
    }
};

window.handleMicroAuthClick = function() {
    if (isSuperAdminSession) {
        if (currentRestaurantSession) {
            router.navigate('/dashboard');
        } else {
            router.navigate('/admin');
        }
    } else if (currentRestaurantSession) {
        router.navigate('/dashboard');
    } else {
        router.navigate('/profile');
    }
};

// ----------------------------------------------------
// Navbar population
// ----------------------------------------------------
function updateNavbar() {
    const navActions = document.getElementById('nav-actions');
    const drawerLinks = document.querySelector('.drawer-links');
    let html = '';
    let drawerHtml = '';
    
    // 1. SUPER ADMIN MODE (Clean executive navbar, no bloated buttons)
    if (isSuperAdminSession) {
        if (currentRestaurantSession) {
            html = `
                <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                    <span class="badge badge-danger" style="font-weight: 600; font-size: 0.8rem; padding: 0.35rem 0.65rem;">
                        <i class="ri-shield-user-line" style="margin-right: 0.25rem;"></i> Mode Admin (${currentRestaurantSession.name})
                    </span>
                    <button class="btn btn-secondary btn-sm" onclick="exitImpersonation()" style="font-weight: 600; font-size: 0.82rem; padding: 0.35rem 0.75rem;">
                        <i class="ri-arrow-go-back-line"></i> Console
                    </button>
                </div>
            `;
            drawerHtml = `
                <div style="padding: 0.75rem; background: rgba(239, 68, 68, 0.08); border-radius: 12px; margin-bottom: 1rem; border: 1px solid rgba(239, 68, 68, 0.2);">
                    <span style="color: var(--danger); font-weight: 600; font-size: 0.85rem; display: block; margin-bottom: 0.25rem;">Mode Super-Admin</span>
                    <span style="font-size: 0.8rem; color: var(--text-primary); font-weight: 600;">Établissement : ${currentRestaurantSession.name}</span>
                </div>
                <a href="#" onclick="toggleMobileMenu(); router.navigate('/dashboard'); return false;"><i class="ri-dashboard-3-line"></i> Tableau de bord</a>
                <a href="#" onclick="toggleMobileMenu(); exitImpersonation(); return false;" style="color: var(--danger); font-weight: 600;"><i class="ri-arrow-go-back-line"></i> Retour Console Globale</a>
                <a href="#" onclick="toggleMobileMenu(); router.navigate('/politique-admin'); return false;"><i class="ri-file-text-line"></i> Charte &amp; Politique Restaurant</a>
                <a href="#" onclick="toggleMobileMenu(); logoutAdmin(); return false;" style="color: var(--danger); font-weight: 600; margin-top: 1rem;"><i class="ri-logout-box-r-line"></i> Déconnexion Super-Admin</a>
            `;
        } else {
            html = `
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <button class="btn btn-secondary btn-sm" onclick="router.navigate('/politique-admin')" style="font-weight: 600; font-size: 0.82rem; padding: 0.35rem 0.75rem;">
                        <i class="ri-file-text-line"></i> Charte
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="logoutAdmin()" style="color: var(--danger); border-color: var(--danger); font-weight: 600; font-size: 0.82rem; padding: 0.35rem 0.75rem;">
                        <i class="ri-logout-box-r-line"></i> Déconnexion
                    </button>
                </div>
            `;
            drawerHtml = `
                <div style="padding: 0.75rem; background: rgba(var(--primary-rgb), 0.08); border-radius: 12px; margin-bottom: 1rem; border: 1px solid var(--border); text-align: center;">
                    <span style="color: var(--text-primary); font-weight: 700; font-size: 0.9rem;">Supervision Plateforme</span>
                </div>
                <a href="#" onclick="toggleMobileMenu(); router.navigate('/admin'); return false;" style="color: var(--primary); font-weight: 600;"><i class="ri-dashboard-3-line"></i> Console Principale</a>
                <a href="#" onclick="toggleMobileMenu(); router.navigate('/politique-admin'); return false;"><i class="ri-file-text-line"></i> Charte Restaurant</a>
                <a href="#" onclick="toggleMobileMenu(); logoutAdmin(); return false;" style="color: var(--danger); font-weight: 600; margin-top: 1rem;"><i class="ri-logout-box-r-line"></i> Déconnexion</a>
            `;
        }
    } 
    // 2. RESTAURANT PARTNER MODE (Clean header: badge + quick preview; all navigation is in bottom nav & sidebar)
    else if (currentRestaurantSession) {
        html = `
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                <span class="badge badge-success" style="font-weight: 600; font-size: 0.82rem; padding: 0.35rem 0.75rem; display: inline-flex; align-items: center; gap: 0.35rem;">
                    <i class="ri-store-2-fill"></i> ${currentRestaurantSession.name}
                </span>
                <button class="btn btn-outline btn-sm" onclick="router.navigate('/r/${currentRestaurantSession.slug}')" title="Voir ma fiche publique" style="font-size: 0.8rem; padding: 0.35rem 0.7rem; border-radius: 10px;">
                    <i class="ri-external-link-line"></i> Aperçu
                </button>
            </div>
        `;
        drawerHtml = `
            <div style="padding: 0.75rem; background: rgba(16, 185, 129, 0.08); border-radius: 12px; margin-bottom: 1rem; border: 1px solid rgba(16, 185, 129, 0.2);">
                <span style="color: var(--success); font-weight: 600; font-size: 0.85rem; display: block; margin-bottom: 0.25rem;">Espace Restaurant</span>
                <span style="font-size: 0.85rem; color: var(--text-primary); font-weight: 700;">${currentRestaurantSession.name}</span>
            </div>
            <a href="#" onclick="toggleMobileMenu(); switchDashboardSection('accounting'); return false;"><i class="ri-bar-chart-2-line"></i> Comptabilité</a>
            <a href="#" onclick="toggleMobileMenu(); switchDashboardSection('orders'); return false;"><i class="ri-file-list-3-line"></i> Commandes</a>
            <a href="#" onclick="toggleMobileMenu(); switchDashboardSection('dishes'); return false;"><i class="ri-restaurant-line"></i> Plats</a>
            <a href="#" onclick="toggleMobileMenu(); switchDashboardSection('account'); return false;"><i class="ri-user-settings-line"></i> Compte</a>
            <hr style="border: 0; border-top: 1px solid var(--border); margin: 0.75rem 0;">
            <a href="#" onclick="toggleMobileMenu(); router.navigate('/politique-admin'); return false;" style="font-size: 0.85rem; color: var(--text-secondary);"><i class="ri-file-text-line"></i> Charte &amp; Conditions</a>
            <a href="#" onclick="toggleMobileMenu(); logoutRestaurant(); return false;" style="color: var(--danger); font-weight: 600; margin-top: 0.5rem;"><i class="ri-logout-box-r-line"></i> Déconnexion</a>
        `;
    } 
    // 3. PUBLIC CLIENT / GUEST MODE (Clean navigation with 'Espace' button, no emojis, no clutter)
    else {
        html = `
            <button class="btn btn-secondary btn-sm" onclick="router.navigate('/auth')" title="Espace Restaurant / Partenaire" aria-label="Espace Restaurant" style="display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.45rem 0.9rem; border-radius: 12px; font-weight: 600; font-size: 0.85rem; transition: all 0.2s ease;">
                <i class="ri-store-2-line"></i>
                <span>Espace</span>
            </button>
        `;
        drawerHtml = `
            <div style="padding: 0.75rem; background: rgba(var(--primary-rgb), 0.08); border-radius: 12px; margin-bottom: 1rem; border: 1px solid var(--border);">
                <span style="color: var(--primary); font-weight: 700; font-size: 0.85rem; display: block;">Thiès Resto</span>
                <span style="font-size: 0.75rem; color: var(--text-secondary);">Commandes en direct &amp; Réservations</span>
            </div>
            <a href="#" onclick="toggleMobileMenu(); router.navigate('/'); return false;"><i class="ri-home-5-line"></i> Accueil</a>
            <a href="#" onclick="toggleMobileMenu(); scrollToCatalog(); return false;"><i class="ri-restaurant-2-line"></i> Restaurants partenaires</a>
            <a href="#" onclick="toggleMobileMenu(); router.navigate('/tracking'); return false;" style="color: var(--primary); font-weight: 600;"><i class="ri-file-list-3-line"></i> Suivi de commande</a>
            <a href="#" onclick="toggleMobileMenu(); router.navigate('/profile'); return false;"><i class="ri-user-3-line"></i> Mon profil</a>
            <a href="#" onclick="toggleMobileMenu(); scrollToHowItWorks(); return false;"><i class="ri-information-line"></i> Comment ça marche</a>
            <a href="#" onclick="toggleMobileMenu(); router.navigate('/partnership'); return false;"><i class="ri-hand-heart-line"></i> Devenir partenaire</a>
            <a href="#" onclick="toggleMobileMenu(); router.navigate('/livreurs'); return false;" style="display: flex; align-items: center; justify-content: space-between;"><span style="display: inline-flex; align-items: center; gap: 0.5rem;"><i class="ri-EBike-2-line"></i> Espace Livreurs</span> <span class="badge" style="background: #FEF3C7; color: #92400E; font-size: 0.68rem; padding: 2px 6px; border-radius: 6px; font-weight: 700;">Bientôt disponible</span></a>
            <hr style="border: 0; border-top: 1px solid var(--border); margin: 0.75rem 0;">
            <a href="#" onclick="toggleMobileMenu(); router.navigate('/cgv'); return false;" style="font-size: 0.85rem; color: var(--text-secondary);"><i class="ri-file-shield-line"></i> Conditions Générales (CGV)</a>
            <a href="#" onclick="toggleMobileMenu(); router.navigate('/politique-client'); return false;" style="font-size: 0.85rem; color: var(--text-secondary);"><i class="ri-lock-line"></i> Confidentialité Client</a>
            <a href="#" onclick="toggleMobileMenu(); router.navigate('/auth'); return false;" style="font-size: 0.85rem; color: var(--primary); font-weight: 600; margin-top: 0.5rem;"><i class="ri-store-2-line"></i> Espace Restaurant</a>
        `;
    }
    
    if (navActions) navActions.innerHTML = html;
    if (drawerLinks) {
        drawerLinks.innerHTML = drawerHtml;
    }

    // Always keep micro verification indicators and bottom navigation in sync
    updateStartupVerificationUI();
    if (typeof window.renderMobileBottomNav === 'function') {
        window.renderMobileBottomNav();
    }
}

// logoutRestaurant moved to js/auth.js

function logoutAdmin() {
    try {
        sessionStorage.removeItem('admin_session');
        sessionStorage.removeItem('thies_admin_logged');
        sessionStorage.removeItem('admin_password');
        localStorage.removeItem('admin_session');
        sessionStorage.removeItem('resto_session');
        sessionStorage.removeItem('restaurantSession');
        localStorage.removeItem('resto_session');
    } catch (e) {
        console.warn("Failed to clear admin_session from storage", e);
    }
    isSuperAdminSession = false;
    currentRestaurantSession = null;
    if (typeof showToast === 'function') showToast("Déconnexion Super-Admin réussie. Vous êtes maintenant sur l'espace client.", "info");
    if (typeof updateNavbar === 'function') updateNavbar();
    if (typeof router !== 'undefined') router.navigate('/');
}
window.logoutAdmin = logoutAdmin;

// ----------------------------------------------------
// Helper: Render Plats du Jour Component for Landing Page
// ----------------------------------------------------
// Helper: Render Plats du Jour Component for Landing Page (Taille Moyenne & Design Raffiné)
// ----------------------------------------------------
window.renderDailySpecialsHomeSection = function() {
    if (typeof store === 'undefined' || !store.getDailyDishes) return '';
    const specials = store.getDailyDishes();
    if (!specials || specials.length === 0) return '';

    const cardsHtml = specials.slice(0, 10).map(dish => {
        const dishImage = dish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
        const tagText = dish.tag || (dish.isDailySpecial ? 'Plat du jour' : 'Spécialité du Jour');
        const priceFormatted = Number(dish.price || 0).toLocaleString('fr-FR');
        const restaurantSlug = dish.restaurantSlug || dish.restaurantId;
        
        return `
            <div class="daily-dish-card hover-3d" style="background: var(--bg-card); border-radius: 14px; border: 1px solid var(--border); box-shadow: var(--shadow-sm); overflow: hidden; display: flex; flex-direction: column; min-width: 240px; max-width: 260px; flex: 1 0 240px; scroll-snap-align: start; transition: transform 0.2s ease, box-shadow 0.2s ease;">
                <div style="position: relative; width: 100%; height: 140px; overflow: hidden; background: var(--bg-secondary);">
                    <img src="${dishImage}" alt="${dish.name}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'">
                    
                    <!-- Tag Spécifique -->
                    <div style="position: absolute; top: 8px; left: 8px; background: linear-gradient(135deg, #F26B21 0%, #D9531E 100%); color: #ffffff; padding: 0.2rem 0.6rem; border-radius: 16px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.3px; box-shadow: 0 2px 8px rgba(242,107,33,0.35); display: flex; align-items: center; gap: 0.25rem;">
                        <span>⭐</span>
                        <span>${tagText}</span>
                    </div>

                    <!-- Note & Statut -->
                    <div style="position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.65); backdrop-filter: blur(6px); color: #fff; padding: 0.15rem 0.45rem; border-radius: 8px; font-size: 0.7rem; font-weight: 700; display: flex; align-items: center; gap: 0.2rem;">
                        <span style="color: #FFC107;">★</span> ${dish.restaurantRating || '4.8'}
                    </div>
                </div>

                <div style="padding: 0.85rem; display: flex; flex-direction: column; flex: 1; justify-content: space-between;">
                    <div>
                        <!-- Restaurant Link -->
                        <a href="#/restaurant/${restaurantSlug}" onclick="router.navigate('/restaurant/${restaurantSlug}'); return false;" style="font-size: 0.78rem; color: var(--primary); font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 0.25rem; margin-bottom: 0.25rem;">
                            <span>🏪</span> <span>${dish.restaurantName || 'Restaurant Thiès'}</span>
                        </a>
                        
                        <!-- Dish Name -->
                        <h3 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin: 0 0 0.3rem 0; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                            ${dish.name}
                        </h3>

                        <!-- Dish Description -->
                        <p style="font-size: 0.78rem; color: var(--text-secondary); line-height: 1.4; margin: 0 0 0.75rem 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                            ${dish.description || 'Préparé aujourd\'hui avec des ingrédients frais locaux.'}
                        </p>
                    </div>

                    <!-- Footer / Price & Order Button -->
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; padding-top: 0.65rem; border-top: 1px solid var(--border);">
                        <div>
                            <span style="font-size: 0.65rem; color: var(--text-secondary); display: block; font-weight: 600; text-transform: uppercase;">Prix</span>
                            <span style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary);">${priceFormatted} <small style="font-size: 0.7rem; color: var(--primary); font-weight: 700;">FCFA</small></span>
                        </div>

                        <button onclick="openProductModal('${dish.restaurantId}', '${dish.id}')" class="btn btn-primary ripple" style="padding: 0.45rem 0.85rem; border-radius: 10px; font-size: 0.78rem; font-weight: 700; display: inline-flex; align-items: center; gap: 0.3rem; box-shadow: 0 3px 10px rgba(242,107,33,0.3);">
                            <span>🛒</span>
                            <span>Commander</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    return `
        <!-- ========== PLATS DU JOUR DU MOMENT (TAILLE MOYENNE) ========== -->
        <section class="daily-specials-section" id="daily-specials-section" style="margin: 1.75rem 0 1.5rem 0; padding: 1rem 0;">
            <div class="section-header" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.65rem; margin-bottom: 1rem;">
                <div>
                    <div style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.25rem 0.7rem; background: rgba(242, 107, 33, 0.1); border-radius: 16px; color: var(--primary); font-size: 0.75rem; font-weight: 700; margin-bottom: 0.3rem; border: 1px solid rgba(242,107,33,0.2);">
                        <span>🔥</span> <span>Sélection Fraîche</span>
                    </div>
                    <h2 class="section-title" style="margin: 0; font-size: 1.35rem;">Les Plats du Jour du Moment</h2>
                    <p style="color: var(--text-secondary); font-size: 0.85rem; margin: 0.2rem 0 0 0;">Spécialités fraîches et suggestions du jour disponibles immédiatement en commande directe</p>
                </div>
                <button onclick="scrollToCatalog()" class="btn btn-secondary" style="font-size: 0.8rem; padding: 0.45rem 0.9rem; border-radius: 10px; font-weight: 600; display: inline-flex; align-items: center; gap: 0.3rem;">
                    <span>Voir les restos</span> <span>➔</span>
                </button>
            </div>

            <!-- Horizontal Scrollable Container with Snap -->
            <div class="daily-specials-carousel" style="display: flex; gap: 1rem; overflow-x: auto; padding: 0.25rem 0.25rem 0.75rem 0.25rem; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;">
                ${cardsHtml}
            </div>
        </section>
    `;
};

// ----------------------------------------------------
// PLATS DU JOUR (DAILY SPECIALS) COMPONENT
// ----------------------------------------------------
window.renderDailySpecialsHtml = function(dishes, isInnerOnly = false) {
    const dailyList = (Array.isArray(dishes) && dishes.length > 0) ? dishes : (typeof store !== 'undefined' ? store.getDailyDishes() : []);
    if (!dailyList || dailyList.length === 0) {
        return isInnerOnly ? '' : '<div id="daily-specials-section-container" style="display:none;"></div>';
    }

    let cardsHtml = '';
    dailyList.forEach(dish => {
        const tag = dish.tag || 'Plat du jour';
        const formattedPrice = Number(dish.price || 0).toLocaleString() + ' FCFA';
        const restoUrl = `#/restaurant/${dish.restaurantSlug}`;
        const defaultFallback = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500';
        const imgUrl = dish.image || defaultFallback;
        const rating = (dish.restaurantRating || 4.5).toFixed(1);

        cardsHtml += `
            <div class="daily-special-card hover-3d" id="daily-dish-card-${dish.id}" onclick="if (event.target.closest('.daily-special-resto-name') || event.target.closest('.daily-special-view-btn') || event.target.closest('.daily-special-order-btn')) return; openProductModal('${dish.restaurantId}', '${dish.id}')">
                <div class="daily-special-img-wrapper">
                    <img src="${imgUrl}" alt="${dish.name}" class="daily-special-img" loading="lazy" onerror="this.src='${defaultFallback}'">
                    <span class="daily-special-tag-badge" title="Plat du jour">⭐ ${tag}</span>
                    <span class="daily-special-price-badge">${formattedPrice}</span>
                </div>
                <div class="daily-special-body">
                    <div class="daily-special-resto-row">
                        <a href="${restoUrl}" class="daily-special-resto-name" title="Voir le restaurant ${dish.restaurantName}">
                            <span>📍</span> <span>${dish.restaurantName}</span>
                        </a>
                        <span class="daily-special-rating">★ ${rating}</span>
                    </div>
                    <h3 class="daily-special-name">${dish.name}</h3>
                    <p class="daily-special-desc">${dish.description || 'Spécialité préparée fraîchement ce jour avec des ingrédients locaux de qualité.'}</p>
                    <div class="daily-special-footer">
                        <button type="button" class="daily-special-order-btn" onclick="openProductModal('${dish.restaurantId}', '${dish.id}')" title="Commander ce plat directement" style="width: 100%; justify-content: center;">
                            <span>⚡</span> <span>Commander ce plat</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    const innerHtml = `
        <section class="daily-specials-section" id="daily-specials-section" aria-label="Plats du Jour du Moment">
            <div class="daily-specials-header">
                <div class="daily-specials-title-group">
                    <div class="daily-specials-pill">
                        <span>🔥</span> <span>Sélection Fraîche du Jour</span>
                    </div>
                    <h2 class="daily-specials-title">Les Plats du Jour du Moment 🍲</h2>
                    <p class="daily-specials-subtitle">Cuisinés ce matin par nos chefs partenaires. Commandez en direct en 1-clic !</p>
                </div>
                <div class="daily-specials-controls">
                    <button class="daily-nav-btn" onclick="scrollDailySpecials(-1)" aria-label="Défiler vers la gauche">‹</button>
                    <button class="daily-nav-btn" onclick="scrollDailySpecials(1)" aria-label="Défiler vers la droite">›</button>
                </div>
            </div>
            <div class="daily-specials-scroll" id="daily-specials-scroll">
                ${cardsHtml}
            </div>
        </section>
    `;

    if (isInnerOnly) return innerHtml;
    return `<div id="daily-specials-section-container">${innerHtml}</div>`;
};

window.scrollDailySpecials = function(direction) {
    const scrollContainer = document.getElementById('daily-specials-scroll');
    if (scrollContainer) {
        const scrollAmount = 310 * direction;
        scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
};

// ----------------------------------------------------
// Page: LANDING PAGE (catalog)
// ----------------------------------------------------
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
        <section class="hero-section page-transition" style="background: linear-gradient(var(--glass-bg), var(--bg-primary)), url('https://images.unsplash.com/photo-1544025162-d76694265947?w=1920&auto=format&fit=crop&q=80') center/cover fixed;">
            <div class="hero-split-container">
                <!-- Center Hero Card: Title, Description, Search and Actions -->
                <div class="hero-left-col hover-3d" style="padding: 2.5rem 2rem; border-radius: 24px; background: var(--glass-bg); backdrop-filter: blur(16px); border: 1px solid var(--border); box-shadow: var(--shadow); max-width: 800px; margin: 0 auto; width: 100%;">
                    <div class="hero-greeting-badge" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.45rem 1.1rem; border-radius: 30px; background: rgba(242, 107, 33, 0.12); border: 1px solid rgba(242, 107, 33, 0.3); color: var(--primary); font-weight: 700; font-size: 0.85rem; margin-bottom: 1.25rem; text-transform: uppercase; letter-spacing: 1.5px;">
                        <span>✨</span> <span>${greeting}</span>
                    </div>
                    <h1 class="hero-title" style="color: var(--text-primary); text-shadow: 0 4px 20px rgba(0,0,0,0.8); font-weight: 800; letter-spacing: -0.03em; margin-bottom: 1.25rem; line-height: 1.25;">Découvrez les Meilleures Tables de <span style="color: var(--primary);">Thiès</span></h1>
                    <p class="hero-subtitle" style="color: var(--text-secondary); font-size: 1.1rem; line-height: 1.6; margin-bottom: 2rem; max-width: 640px; margin-left: auto; margin-right: auto;">Commandez vos plats du jour locaux en direct ou réservez votre table en quelques clics. Paiement à la livraison ou sur place. Simple, rapide et sans commission.</p>
                    
                    <div class="search-container hover-3d" style="margin: 0 auto 1.25rem auto; width: 100%; max-width: 500px; position: relative;">
                        <input type="text" id="search-input-field" class="search-input" placeholder="Rechercher un plat, un restaurant..." oninput="applyFilters()" style="background: var(--bg-input); color: var(--text-primary); border: 1.5px solid var(--border); border-radius: 16px; padding: 1.1rem 3rem 1.1rem 1.5rem; width: 100%; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1); transition: var(--transition-smooth); font-size: 16px;">
                        <button class="search-btn" style="color: var(--primary); position: absolute; right: 15px; top: 50%; transform: translateY(-50%); background: none; border: none; font-size: 1.2rem; cursor: pointer;" aria-label="Rechercher">🔍</button>
                    </div>

                    <!-- HERO QUICK FILTER TAGS -->
                    <div class="hero-quick-tags" style="margin-bottom: 1.5rem;">
                        <span style="font-weight: 600; opacity: 0.85; font-size: 0.85rem;">Filtres rapides :</span>
                        <button type="button" class="quick-chip-btn" onclick="scrollToCatalogAndFilter('Fast-Food')">🍔 Fast-Food</button>
                        <button type="button" class="quick-chip-btn" onclick="scrollToCatalogAndFilter('Dibiterie')">🔥 Dibiterie</button>
                        <button type="button" class="quick-chip-btn" onclick="scrollToCatalogAndFilter('Traditionnel')">🍲 Traditionnel</button>
                        <button type="button" class="quick-chip-btn" onclick="scrollToCatalogAndFilter('Gastronomique')">✨ Gastronomique</button>
                        <button type="button" class="quick-chip-btn" onclick="scrollToCatalogAndFilter('Pâtisserie')">🥐 Pâtisserie</button>
                    </div>

                    <div class="hero-actions-container" style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; align-items: center; margin-top: 0.5rem; width: 100%;">
                        <button class="btn btn-primary ripple hover-3d" onclick="scrollToCatalog()" style="box-shadow: 0 10px 25px -5px rgba(242,107,33,0.5); min-height: 48px; padding: 0.9rem 2.2rem; border-radius: 14px; font-weight: 700; font-size: 1.05rem; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;">
                            <i class="ri-restaurant-2-line"></i>
                            <span>Explorer nos Menus 🍽️</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- VOS DERNIERES COMMANDES PERSISTANT -->
        ${historyHtml}

        <!-- ========== KEY CONCEPTS ROW (3 Cards: Text - Image - Text) ========== -->
        <section class="presentation-section" id="presentation-section" style="margin-top: 2.5rem; padding: 3rem 1.5rem;">
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

        <!-- PROMO SPECIAL DEAL CARD (Ref Mockup) -->
        <div class="promo-banner-card">
            <div class="promo-banner-content">
                <div class="promo-badge-tag">🔥 Bon Plan Thiès</div>
                <h2 class="promo-banner-title">Jusqu'à -40% sur vos plats préférés</h2>
                <p class="promo-banner-desc">Découvrez les offres gourmandes du moment chez les restaurants partenaires de Thiès.</p>
                <button type="button" class="promo-banner-btn" onclick="scrollToCatalogAndFilter('Fast-Food')">
                    <span>Voir les offres</span>
                    <i class="ri-arrow-right-line"></i>
                </button>
            </div>
            <div class="promo-banner-visual">
                <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80" alt="Plat Savoureux" class="promo-food-img" loading="lazy">
            </div>
        </div>

        <!-- ========== PLATS DU JOUR DU MOMENT ========== -->
        ${renderDailySpecialsHomeSection()}

        <section id="catalog-section">
            <div class="section-header" style="display: flex; flex-direction: column; align-items: flex-start; gap: 0.5rem; margin-bottom: 1.25rem;">
                <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; flex-wrap: wrap; gap: 0.75rem;">
                    <div>
                        <h2 class="section-title" style="margin-bottom: 0.25rem;">Les Restaurants Partenaires</h2>
                        <p style="color: var(--text-secondary); font-size: 0.95rem; margin: 0;">Filtrez rapidement par catégorie pour trouver votre table idéale</p>
                    </div>
                    <div id="results-count-badge" class="results-count-badge"></div>
                </div>
            </div>

            <!-- QUICK FILTERS BAR -->
            <div class="quick-filters-wrapper">
                <div class="filter-bar" id="filter-bar" role="tablist" aria-label="Filtres rapides de restaurants">
                    <button class="filter-btn ${activeFilter === 'Tous' ? 'active' : ''}" onclick="setFilter('Tous')" data-category="Tous" role="tab" aria-selected="${activeFilter === 'Tous'}">
                        <span class="filter-icon">🍽️</span>
                        <span class="filter-label">Tous</span>
                        <span class="filter-badge" id="count-all"></span>
                    </button>
                    <button class="filter-btn ${activeFilter === 'Fast-Food' ? 'active' : ''}" onclick="setFilter('Fast-Food')" data-category="Fast-Food" role="tab" aria-selected="${activeFilter === 'Fast-Food'}">
                        <span class="filter-icon">🍔</span>
                        <span class="filter-label">Fast-Food</span>
                        <span class="filter-badge" id="count-fastfood"></span>
                    </button>
                    <button class="filter-btn ${activeFilter === 'Dibiterie' ? 'active' : ''}" onclick="setFilter('Dibiterie')" data-category="Dibiterie" role="tab" aria-selected="${activeFilter === 'Dibiterie'}">
                        <span class="filter-icon">🔥</span>
                        <span class="filter-label">Dibiterie</span>
                        <span class="filter-badge" id="count-dibiterie"></span>
                    </button>
                    <button class="filter-btn ${activeFilter === 'Traditionnel' ? 'active' : ''}" onclick="setFilter('Traditionnel')" data-category="Traditionnel" role="tab" aria-selected="${activeFilter === 'Traditionnel'}">
                        <span class="filter-icon">🍲</span>
                        <span class="filter-label">Traditionnel</span>
                        <span class="filter-badge" id="count-traditionnel"></span>
                    </button>
                    <button class="filter-btn ${activeFilter === 'Gastronomique' ? 'active' : ''}" onclick="setFilter('Gastronomique')" data-category="Gastronomique" role="tab" aria-selected="${activeFilter === 'Gastronomique'}">
                        <span class="filter-icon">✨</span>
                        <span class="filter-label">Gastronomique</span>
                        <span class="filter-badge" id="count-gastronomique"></span>
                    </button>
                    <button class="filter-btn ${activeFilter === 'Pâtisserie' ? 'active' : ''}" onclick="setFilter('Pâtisserie')" data-category="Pâtisserie" role="tab" aria-selected="${activeFilter === 'Pâtisserie'}">
                        <span class="filter-icon">🥐</span>
                        <span class="filter-label">Pâtisserie</span>
                        <span class="filter-badge" id="count-patisserie"></span>
                    </button>
                </div>
            </div>

            <!-- CONTROLS ROW (ACTIVE FILTER & SORT SELECTOR) -->
            <div class="filter-controls-row">
                <div id="active-filter-indicator" class="active-filter-indicator" style="${activeFilter !== 'Tous' ? 'display: inline-flex;' : 'display: none;'}">
                    <span id="active-filter-text">${activeFilter !== 'Tous' ? 'Filtre actif : ' + activeFilter : ''}</span>
                    <button type="button" class="btn-clear-filter" onclick="setFilter('Tous')" title="Réinitialiser">✕ Réinitialiser</button>
                </div>
                <div class="sort-bar" style="margin: 0; padding: 0;">
                    <label for="sort-select">Trier par :</label>
                    <select class="sort-select" id="sort-select" onchange="activeSortBy = this.value; applyFilters();">
                        <option value="default" ${activeSortBy === 'default' ? 'selected' : ''}>Recommandé</option>
                        <option value="rating" ${activeSortBy === 'rating' ? 'selected' : ''}>Meilleure note ★</option>
                        <option value="reviews" ${activeSortBy === 'reviews' ? 'selected' : ''}>Nombre d'avis</option>
                        <option value="name" ${activeSortBy === 'name' ? 'selected' : ''}>Nom de A à Z</option>
                    </select>
                </div>
            </div>
            
            <div class="restaurant-grid" id="restaurants-list-grid"></div>

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
                        <p>Lancez un panier partagé pour vos collègues de bureau ou vos amis en cliquant sur "Commande de Groupe".</p>
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
                    <h3 style="font-family: var(--font-serif); font-size: 1.3rem; margin-bottom: 1.5rem; color: var(--text-primary);">Le Constat Local (Étude Septembre 2026)</h3>
                    
                    <div class="study-carousel-wrapper">
                        <div class="study-metric-card square-stat-card">
                            <span class="stat-number">85%</span>
                            <span class="stat-label">Désert Numérique Complet</span>
                        </div>

                        <div class="study-metric-card square-stat-card">
                            <span class="stat-number">0%</span>
                            <span class="stat-label">Absence de Menus Interactifs</span>
                        </div>

                        <div class="study-metric-card square-stat-card">
                            <span class="stat-number">90%</span>
                            <span class="stat-label">Avis Négatifs Ignorés</span>
                        </div>

                        <div class="study-metric-card square-stat-card">
                            <span class="stat-number">75%</span>
                            <span class="stat-label">Commandes Perdues en Heures de Pointe</span>
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
                                <h3>1. Vitrine Digitale Gratuite & Propre</h3>
                                <p>Chaque partenaire bénéficie d'une page personnalisée, moderne, rapide et optimisée pour le référencement local à Thiès.</p>
                            </div>
                        </div>

                        <div class="solution-feature-card">
                            <span class="solution-icon">⚡</span>
                            <div class="solution-text">
                                <h3>2. Précommande & Réservation Express</h3>
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

                        <div class="solution-feature-card">
                            <span class="solution-icon">📱</span>
                            <div class="solution-text">
                                <h3>4. Centralisation WhatsApp & 0% Commission</h3>
                                <p>Commandes directes et structurées sur WhatsApp avec notification sonore et récapitulatif sans aucune commission sur les plats.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;

    if (typeof applyFilters === 'function') applyFilters();
    if (typeof startSocialProof === 'function') startSocialProof();
    
    // Dynamically re-sync daily specials from database
    if (typeof store !== 'undefined' && typeof store.fetchDailyDishes === 'function') {
        store.fetchDailyDishes().then(dishes => {
            const specialsContainer = document.getElementById('daily-specials-section-container');
            if (specialsContainer && Array.isArray(dishes) && dishes.length > 0) {
                specialsContainer.innerHTML = renderDailySpecialsHtml(dishes, true);
                specialsContainer.style.display = 'block';
            }
        }).catch(e => console.warn("Daily specials async fetch error:", e));
    }

    hideLoadingOverlay();
    } catch (err) {
        console.error("Error in home route:", err);
        hideLoadingOverlay();
        document.getElementById('main-content').innerHTML = `
            <div style="text-align: center; padding: 5rem 1rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🔌</div>
                <h2 style="color: var(--danger); margin-bottom: 1rem;">Erreur de connexion</h2>
                <p style="color: var(--text-secondary); max-width: 400px; margin: 0 auto 2rem;">
                    Impossible de charger le catalogue. Veuillez vérifier votre connexion internet et réessayer.
                </p>
                <button class="btn btn-primary" onclick="window.location.reload()">Rafraîchir la page</button>
            </div>
        `;
    }
});

window.matchesCategory = function matchesCategory(restaurant, filter) {
    if (!filter || filter === 'Tous') return true;
    const cat = (restaurant.category || '').toLowerCase();
    const name = (restaurant.name || '').toLowerCase();
    const menuNames = Array.isArray(restaurant.menu) ? restaurant.menu.map(m => (m.name || '').toLowerCase()).join(' ') : '';
    const f = filter.toLowerCase();

    if (f === 'fast-food' || f === 'fast food') {
        return cat.includes('fast') || cat.includes('snack') || cat.includes('burger') || cat.includes('pizza') || cat.includes('tacos') || name.includes('tacos') || name.includes('snack') || name.includes('burger') || name.includes('biba') || menuNames.includes('burger') || menuNames.includes('chawarma') || menuNames.includes('frite');
    }
    if (f === 'dibiterie' || f === 'grillades' || f === 'grillades / dibi') {
        return cat.includes('dibi') || cat.includes('grill') || name.includes('dibi') || name.includes('nice time') || menuNames.includes('dibi') || menuNames.includes('merguez') || menuNames.includes('brais');
    }
    if (f === 'traditionnel') {
        return cat.includes('tradition') || cat.includes('senegal') || menuNames.includes('thiéboudiène') || menuNames.includes('yassa') || menuNames.includes('mafé');
    }
    if (f === 'gastronomique') {
        return cat.includes('gastro') || cat.includes('raffin') || name.includes('gourmet') || name.includes('casablancaise') || name.includes('khayma');
    }
    if (f === 'pâtisserie' || f === 'patisserie' || f === 'pâtisserie & café') {
        return cat.includes('pâtisserie') || cat.includes('patisserie') || cat.includes('boulangerie') || cat.includes('café') || name.includes('cigale') || name.includes('relais');
    }
    return cat.includes(f) || name.includes(f);
};

window.updateCategoryBadges = function updateCategoryBadges() {
    const allRestos = store.getRestaurants().filter(r => r.status === 'active');
    const counts = {
        'Tous': allRestos.length,
        'Fast-Food': 0,
        'Dibiterie': 0,
        'Traditionnel': 0,
        'Gastronomique': 0,
        'Pâtisserie': 0
    };

    allRestos.forEach(r => {
        if (matchesCategory(r, 'Fast-Food')) counts['Fast-Food']++;
        if (matchesCategory(r, 'Dibiterie')) counts['Dibiterie']++;
        if (matchesCategory(r, 'Traditionnel')) counts['Traditionnel']++;
        if (matchesCategory(r, 'Gastronomique')) counts['Gastronomique']++;
        if (matchesCategory(r, 'Pâtisserie')) counts['Pâtisserie']++;
    });

    const setBadge = (id, count) => {
        const el = document.getElementById(id);
        if (el) el.textContent = `(${count})`;
    };

    setBadge('count-all', counts['Tous']);
    setBadge('count-fastfood', counts['Fast-Food']);
    setBadge('count-dibiterie', counts['Dibiterie']);
    setBadge('count-traditionnel', counts['Traditionnel']);
    setBadge('count-gastronomique', counts['Gastronomique']);
    setBadge('count-patisserie', counts['Pâtisserie']);
};

window.scrollToCatalogAndFilter = function scrollToCatalogAndFilter(category) {
    window.setFilter(category);
    const catalog = document.getElementById('catalog-section');
    if (catalog) {
        catalog.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

window.setFilter = function setFilter(category) {
    activeFilter = category;
    const filterBar = document.getElementById('filter-bar');
    if (filterBar) {
        filterBar.querySelectorAll('.filter-btn').forEach(btn => {
            const btnCat = btn.getAttribute('data-category');
            if (btnCat === category || (category === 'Tous' && btnCat === 'Tous')) {
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');
            } else {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            }
        });
    }

    const indicator = document.getElementById('active-filter-indicator');
    const indicatorText = document.getElementById('active-filter-text');
    if (indicator && indicatorText) {
        if (category !== 'Tous') {
            indicator.style.display = 'inline-flex';
            indicatorText.textContent = `Filtre actif : ${category}`;
        } else {
            indicator.style.display = 'none';
            indicatorText.textContent = '';
        }
    }

    applyFilters();
};

/**
 * Génère des cartes skeleton fluides et dynamiques avec shimmer wave
 * @param {number} count Nombre de cartes skeletons à afficher
 * @returns {string} HTML des skeletons
 */
window.renderRestaurantSkeletons = function renderRestaurantSkeletons(count = 6) {
    const titlesWidths = ['65%', '72%', '58%', '68%', '62%', '75%'];
    const addrWidths = ['85%', '75%', '80%', '90%', '70%', '85%'];
    
    let html = '';
    for (let i = 0; i < count; i++) {
        const titleW = titlesWidths[i % titlesWidths.length];
        const addrW = addrWidths[i % addrWidths.length];
        
        html += `
            <div class="skeleton-restaurant-card" aria-hidden="true">
                <div class="skeleton skeleton-img-box">
                    <div class="skeleton skeleton-floating-pill"></div>
                    <div class="skeleton skeleton-floating-heart"></div>
                </div>
                <div class="skeleton-card-content">
                    <div class="skeleton-header-row">
                        <div class="skeleton skeleton-title-bar" style="width: ${titleW};"></div>
                        <div class="skeleton skeleton-rating-badge"></div>
                    </div>
                    <div class="skeleton skeleton-address-line" style="width: ${addrW};"></div>
                    <div class="skeleton-footer-split">
                        <div class="skeleton skeleton-category-tag"></div>
                        <div class="skeleton skeleton-reviews-text"></div>
                    </div>
                </div>
            </div>
        `;
    }
    return html;
};

/**
 * Génère des skeletons fluides pour les plats du menu
 * @param {number} count Nombre de plats skeletons
 * @returns {string} HTML des skeletons
 */
window.renderDishSkeletons = function renderDishSkeletons(count = 4) {
    let html = '';
    for (let i = 0; i < count; i++) {
        html += `
            <div class="skeleton-dish-card" aria-hidden="true">
                <div class="skeleton skeleton-dish-thumb"></div>
                <div class="skeleton-dish-details">
                    <div class="skeleton skeleton-dish-title"></div>
                    <div class="skeleton skeleton-dish-desc"></div>
                    <div class="skeleton skeleton-dish-price"></div>
                </div>
            </div>
        `;
    }
    return html;
};

window.applyFilters = function applyFilters() {
    const searchInput = document.getElementById('search-input-field');
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const grid = document.getElementById('restaurants-list-grid');
    if (!grid) return;

    let restos = store.getRestaurants().filter(r => r.status === 'active');

    // 1. Filter by category
    if (activeFilter !== 'Tous') {
        restos = restos.filter(r => matchesCategory(r, activeFilter));
    }

    // 2. Filter by search query
    if (query) {
        restos = restos.filter(r => {
            return (r.name || '').toLowerCase().includes(query) || 
                   (r.category || '').toLowerCase().includes(query) || 
                   (r.address || '').toLowerCase().includes(query) ||
                   (Array.isArray(r.menu) && r.menu.some(m => (m.name || '').toLowerCase().includes(query) || (m.description || '').toLowerCase().includes(query)));
        });
    }

    // Update count badges
    const countBadge = document.getElementById('results-count-badge');
    if (countBadge) {
        countBadge.textContent = `${restos.length} restaurant${restos.length > 1 ? 's' : ''} disponible${restos.length > 1 ? 's' : ''}`;
    }
    updateCategoryBadges();

    // 3. Sort & Distance Filter (15km)
    let fallbackTriggered = false;
    let distanceSorted = false;

    if (restos[0] && restos[0]._tempDistance !== undefined) {
        distanceSorted = true;
        // Sort by distance first
        restos.sort((a, b) => (a._tempDistance || 9999) - (b._tempDistance || 9999));
        
        // Filter by 15km
        const closeRestos = restos.filter(r => r._tempDistance <= 15.0);
        
        if (closeRestos.length > 0) {
            restos = closeRestos;
        } else {
            // Fallback triggered: keep all restos, just sorted, but flag it
            fallbackTriggered = true;
        }
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
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 3.5rem 1.5rem; background: var(--bg-card); border-radius: 16px; border: 1.5px dashed var(--border);">
                <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🍽️</div>
                <h3 style="color: var(--text-primary); margin-bottom: 0.5rem; font-size: 1.2rem; font-weight: 700;">Aucun restaurant trouvé</h3>
                <p style="margin-bottom: 1.25rem; font-size: 0.95rem; max-width: 450px; margin-left: auto; margin-right: auto;">Aucun établissement ne correspond au filtre <strong>"${activeFilter}"</strong>${query ? ` et à la recherche "${query}"` : ''}.</p>
                <button type="button" class="btn btn-primary" onclick="setFilter('Tous'); if(document.getElementById('search-input-field')) { document.getElementById('search-input-field').value=''; applyFilters(); }" style="padding: 0.65rem 1.5rem; font-size: 0.9rem; border-radius: 25px; font-weight: 600;">
                    Afficher tous les restaurants
                </button>
            </div>`;
        return;
    }

    let cardsHtml = '';
    
    if (fallbackTriggered) {
        cardsHtml += `
            <div style="grid-column: 1/-1; background: rgba(255, 170, 0, 0.1); border-left: 4px solid var(--warning); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                <p style="margin:0; font-size: 0.95rem; color: var(--text-primary); display: flex; align-items: center;">
                    <i class="ri-information-fill" style="color: var(--warning); margin-right: 8px; font-size: 1.2rem;"></i>
                    Aucun restaurant à moins de 15 km de votre position. Voici les plus proches :
                </p>
            </div>
        `;
    }

    restos.forEach(r => {
        const isCurrentlyOpen = isRestaurantOpenNow(r);
        const statusBadge = isCurrentlyOpen 
            ? `<span class="badge badge-success restaurant-card-badge">Ouvert</span>` 
            : `<span class="badge badge-danger restaurant-card-badge">Fermé</span>`;
        
        const coverUrl = r.coverImage || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60';
        let distanceBadge = '';
        if (r._tempDistance) {
            distanceBadge = `<div style="position: absolute; top: 1rem; left: 1rem; background: var(--bg-card); color: var(--text-primary); padding: 0.35rem 0.75rem; border-radius: 20px; font-weight: 600; font-size: 0.8rem; box-shadow: 0 4px 10px rgba(0,0,0,0.1); z-index: 2;">📍 ${r._tempDistance} km</div>`;
        }

        const isFav = window.isFavorite ? window.isFavorite(r.id) : false;
            
        cardsHtml += `
            <div class="restaurant-card hover-3d glass-panel" onclick="router.navigate('/r/${r.slug}')">
                ${distanceBadge}
                <button type="button" class="card-fav-btn ${isFav ? 'is-fav active' : ''}" data-fav-resto-id="${r.id}" onclick="toggleFavorite('${r.id}', event)" aria-label="Ajouter aux favoris">
                    ${isFav ? '❤️' : '🤍'}
                </button>
                <div class="restaurant-card-header">
                    <img src="${coverUrl}" class="restaurant-card-img" alt="${r.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60'">
                    <div class="restaurant-card-gradient"></div>
                    <div class="restaurant-card-status">
                        ${statusBadge}
                    </div>
                </div>
                <div class="restaurant-card-body">
                    <div class="restaurant-card-top-row">
                        <h3 class="restaurant-card-name" title="${r.name}">${r.name}</h3>
                        <span class="stars-rating">★ ${r.rating.toFixed(1)}</span>
                    </div>
                    <p class="restaurant-card-address">
                        <span>📍</span> <span class="restaurant-card-address-text">${r.address}</span>
                    </p>
                    <div class="restaurant-card-footer">
                        <span class="restaurant-card-cuisine">${r.category}</span>
                        <span class="restaurant-card-reviews">${r.reviewsCount} avis</span>
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
// ----------------------------------------------------
// Geolocation & Distance Sorting (No Maps)
// ----------------------------------------------------
window.openGoogleMapsExplorer = function() {
    // No maps - scroll directly to catalog with GPS filter
    if (typeof geolocateRestaurants === 'function') geolocateRestaurants();
    if (typeof scrollToCatalog === 'function') scrollToCatalog();
};

window.geolocateRestaurants = async function() {
    const heroBtn = document.getElementById('hero-geo-btn');
    if (heroBtn) heroBtn.innerHTML = `<i class="ri-loader-4-line spin"></i> <span>Recherche GPS...</span>`;

    if ("geolocation" in navigator) {
        if (typeof showToast === 'function') showToast("Recherche de votre position à Thiès...", "info");
        navigator.geolocation.getCurrentPosition((position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            window.userLat = userLat;
            window.userLng = userLng;
            
            let restosWithDist = 0;
            if (typeof store !== 'undefined' && store.data && store.data.restaurants) {
                store.data.restaurants.forEach(r => {
                    if (r.lat && r.lng) {
                        const dist = calculateDistance(userLat, userLng, Number(r.lat), Number(r.lng));
                        r._tempDistance = parseFloat(dist.toFixed(1));
                        restosWithDist++;
                    }
                });
            }
            
            if (typeof showToast === 'function') showToast(`Position trouvée ! ${restosWithDist} restaurants triés par proximité.`, "success");
            if (heroBtn) {
                heroBtn.innerHTML = `<i class="ri-check-line"></i> <span>Position active (${userLat.toFixed(2)}, ${userLng.toFixed(2)})</span>`;
                setTimeout(() => {
                    heroBtn.innerHTML = `<i class="ri-crosshair-2-line"></i> <span>Autour de moi (GPS)</span>`;
                }, 4000);
            }
            if (typeof applyFilters === 'function') applyFilters();
        }, (error) => {
            console.warn("Notice: Geolocation unavailable or timed out, default center used.");
            if (heroBtn) heroBtn.innerHTML = `<i class="ri-crosshair-2-line"></i> <span>Autour de moi (GPS)</span>`;
            if (typeof applyFilters === 'function') applyFilters();
            if (typeof showToast === 'function') showToast("Position par défaut : Thiès Centre", "info");
        }, { timeout: 8000, maximumAge: 0, enableHighAccuracy: true });
    } else {
        if (typeof showToast === 'function') showToast("La géolocalisation n'est pas supportée sur ce navigateur.", "info");
    }
};

// Route: #/map redirects to catalog view
router.add('#/map', () => {
    router.navigate('/');
});


function filterRestaurantsList() {
    applyFilters();
}


// ----------------------------------------------------
// Restaurant Open Hours Logic
// ----------------------------------------------------
function isRestaurantOpenNow(restaurant) {
    if (!restaurant) return false;
    if (restaurant.isOpenManual === false) return false;
    if (restaurant.isOpenManual === true || restaurant.isOpenManual === undefined) {
        // Double check closed days
        const now = new Date();
        // JavaScript day is 0=Sunday, 1=Monday... 7 is not used, so let's map it.
        let day = now.getDay();
        if (day === 0) day = 7; // Map Sunday to 7
        const closedDays = Array.isArray(restaurant.closedDays) ? restaurant.closedDays : [];
        if (closedDays.includes(day)) {
            return false;
        }
        
        // Hours check
        try {
            const hoursStr = restaurant.openHours; // e.g. "12:00 - 23:00"
            if (!hoursStr) return true;
            const parts = hoursStr.split('-');
            if (parts.length === 2) {
                const openParts = parts[0].trim().split(':');
                const closeParts = parts[1].trim().split(':');
                
                const openHour = parseInt(openParts[0], 10);
                const openMin = parseInt(openParts[1], 10);
                const closeHour = parseInt(closeParts[0], 10);
                const closeMin = parseInt(closeParts[1], 10);
                
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
window.isRestaurantOpenNow = isRestaurantOpenNow;
window.isRestaurantOpen = isRestaurantOpenNow;

// Get string name for day
function getDayName(dayNum) {
    const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    return days[dayNum - 1] || "";
}
window.getDayName = getDayName;

// ----------------------------------------------------
// Page: RESTAURANT PAGE (client view with tabs)
// ----------------------------------------------------
router.add('#/r/:slug', async (slug, startTab = 'menu', groupId = null) => {
    // Show fluid realistic skeleton if restaurant data is being fetched
    const mainContent = document.getElementById('main-content');
    if (mainContent && (!mainContent.innerHTML || mainContent.innerHTML.trim() === '')) {
        mainContent.innerHTML = `
            <div style="padding: 2rem 1.5rem; max-width: 1100px; margin: 0 auto;" class="page-transition">
                <div class="skeleton" style="height: 300px; width: 100%; border-radius: 24px; margin-bottom: 2rem;"></div>
                <div style="display: flex; gap: 12px; margin-bottom: 2rem; flex-wrap: wrap;">
                    <div class="skeleton" style="width: 120px; height: 42px; border-radius: 20px;"></div>
                    <div class="skeleton" style="width: 120px; height: 42px; border-radius: 20px;"></div>
                    <div class="skeleton" style="width: 120px; height: 42px; border-radius: 20px;"></div>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.25rem;">
                    ${typeof window.renderDishSkeletons === 'function' ? window.renderDishSkeletons(6) : ''}
                </div>
            </div>
        `;
    }
    const r = await store.getRestaurantBySlug(slug);
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
    updateSEO('restaurant', r);

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

    // Closed days description
    let closedDaysText = '';
    const closedDaysList = Array.isArray(r.closedDays) ? r.closedDays : [];
    if (closedDaysList.length > 0) {
        closedDaysText = ` (Fermé : ${closedDaysList.map(d => getDayName(d)).join(', ')})`;
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
                <button type="button" onclick="switchRestoTab('reviews')" style="background: none; border: none; cursor: pointer; padding: 0; display: inline-flex; align-items: center; gap: 0.35rem;" title="Voir les avis clients">
                    <span class="stars-rating" style="color: #F59E0B; font-weight: 700;">★ ${(Number(r.rating) || 5.0).toFixed(1)}</span>
                    <span style="color: var(--text-secondary); text-decoration: underline;">(${r.reviewsCount || (r.reviews ? r.reviews.length : 0)} avis)</span>
                </button>
            </div>
            
            <p class="restaurant-meta-info">
                🕒 Horaires : ${r.openHours}${closedDaysText} | 📍 ${r.address}
            </p>
            
            <div class="restaurant-meta-actions">
                <a href="https://wa.me/${r.whatsapp.replace(/\+/g, '')}" target="_blank" class="btn btn-outline btn-sm" style="display: inline-flex; align-items: center; gap: 0.4rem;">
                    💬 Contacter WhatsApp
                </a>
                <button class="btn btn-primary btn-sm" onclick="shareRestaurant('${r.name}', '${r.slug}')" style="display: inline-flex; align-items: center; gap: 0.4rem;">
                    📤 Partager à un ami
                </button>
            </div>
        </div>

        <nav class="tabs-nav">
            <button class="tab-btn ${activeTab === 'menu' ? 'active' : ''}" onclick="switchRestoTab('menu')">Menu du Jour 🍕</button>
            <button class="tab-btn ${activeTab === 'checkout' ? 'active' : ''}" id="tab-checkout-btn" onclick="switchRestoTab('checkout')">Commander 🛒</button>
            <button class="tab-btn ${activeTab === 'group' ? 'active' : ''}" onclick="switchRestoTab('group')">Commande de Groupe 👥</button>
            <button class="tab-btn ${activeTab === 'booking' ? 'active' : ''}" onclick="switchRestoTab('booking')">Réserver une Table 📅</button>
            <button class="tab-btn ${activeTab === 'reviews' ? 'active' : ''}" onclick="switchRestoTab('reviews')">Avis Clients (${r.reviews ? r.reviews.length : 0}) 💬</button>
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

// openCartTab is now globally defined at the bottom of the file


// ----------------------------------------------------
// Restaurant View - Tab Panels Renderers
// ----------------------------------------------------

// 1. Menu Panel
/**
 * Affiche l'onglet du menu pour un restaurant spécifique.
 * @param {Object} r - L'objet contenant les données du restaurant.
 * @param {string} r.id - L'identifiant unique du restaurant.
 * @param {Array} r.menu - La liste des plats disponibles.
 * @returns {void} Modifie le DOM directement.
 */
function renderDishesTab(r) {
    const grid = document.getElementById('dishes-list-grid');
    let html = '';
    
    if (r.menu.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 3rem 0;">Aucun plat du jour disponible aujourd'hui.</div>`;
        return;
    }

    r.menu.forEach(d => {
        const isCurrentlyOpen = isRestaurantOpenNow(r);
        const isAvailable = d.available !== false;
        
        let actionBtn = '';
        if (!isCurrentlyOpen) {
            actionBtn = `<button class="btn btn-secondary btn-block" disabled>Fermé temporairement</button>`;
        } else if (!isAvailable) {
            actionBtn = `<button class="btn btn-danger btn-block" disabled>Rupture de Stock</button>`;
        } else {
            actionBtn = `<button class="btn btn-primary btn-block" onclick="openProductModal('${r.id}', '${d.id}')">Choisir & Ajouter 🛒</button>`;
        }

        const outOfStockBadge = !isAvailable ? `<span style="position:absolute; top:10px; left:10px; background:var(--danger); color:white; padding:4px 8px; border-radius:4px; font-weight:bold; font-size:0.8rem; z-index:10;">ÉPUISÉ</span>` : '';
        const imgStyle = !isAvailable ? `filter: grayscale(100%); opacity: 0.6;` : '';
        const cardOpacity = !isAvailable ? `opacity: 0.8;` : '';

        html += `
            <div class="dish-card" data-menu-item-id="${d.id}" onclick="${isAvailable && isCurrentlyOpen ? `openProductModal('${r.id}', '${d.id}')` : ''}" style="${isAvailable && isCurrentlyOpen ? 'cursor: pointer;' : 'cursor: not-allowed;'} ${cardOpacity}">
                <div class="dish-img-container" style="position:relative;">
                    ${outOfStockBadge}
                    <img src="${d.image}" class="dish-image" alt="${d.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'" style="${imgStyle}">
                    <span class="dish-price-tag item-price">${d.price} FCFA</span>
                </div>
                <div class="dish-body">
                    <h3 class="dish-title" style="${!isAvailable ? 'text-decoration: line-through; color: var(--text-secondary);' : ''}">${d.name}</h3>
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
        <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: var(--bg-primary); z-index: 9999; display: flex; flex-direction: column; animation: slideUp 0.3s ease-out; overflow-y: auto; color: var(--text-primary);">
            <!-- Header -->
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; position: absolute; top: 0; left: 0; width: 100%; z-index: 10;">
                <button onclick="document.getElementById('product-detail-modal').remove()" aria-label="Fermer" style="background: var(--bg-glass, rgba(0,0,0,0.3)); border: 1px solid var(--border); width: 45px; height: 45px; border-radius: 50%; color: var(--text-primary); display: flex; align-items: center; justify-content: center; font-size: 1.3rem; cursor: pointer; backdrop-filter: blur(8px);">
                    ✕
                </button>
                <div style="position: relative;" onclick="document.getElementById('product-detail-modal').remove(); openCartTab();">
                    <button aria-label="Voir le panier" style="background: var(--primary); border: none; width: 45px; height: 45px; border-radius: 50%; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; cursor: pointer; box-shadow: var(--shadow-sm);">
                        🛒
                    </button>
                    <span style="position: absolute; top: -5px; right: -5px; background: var(--danger, #EF4444); color: #ffffff; font-size: 0.75rem; font-weight: 800; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
                        ${cart.items.length}
                    </span>
                </div>
            </div>

            <!-- Image Hero -->
            <div style="flex: 1; min-height: 38vh; position: relative; display: flex; align-items: center; justify-content: center; padding: 5rem 2rem 2rem 2rem; background: radial-gradient(circle at center, rgba(var(--primary-rgb), 0.15) 0%, transparent 70%);">
                <img src="${dish.image}" style="width: 240px; height: 240px; object-fit: cover; border-radius: 50%; box-shadow: var(--shadow-md); border: 4px solid var(--border);" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'" loading="lazy" alt="${dish.name}">
            </div>

            <!-- Details Section -->
            <div style="background: var(--bg-card); padding: 2rem 1.5rem; flex: 1; border-top-left-radius: 28px; border-top-right-radius: 28px; border-top: 1px solid var(--border); display: flex; flex-direction: column;">
                
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                    <h2 style="color: var(--text-primary); font-size: 1.6rem; font-family: var(--font-serif); font-weight: 700; margin: 0; max-width: 65%;">${dish.name}</h2>
                    <span style="color: var(--primary); font-size: 1.5rem; font-weight: 800;">${dish.price} <span style="font-size: 0.9rem; color: var(--text-secondary);">FCFA</span></span>
                </div>
                
                <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6; margin-bottom: 2rem;">${dish.description || 'Préparé avec soin par les chefs de l’établissement avec des ingrédients frais locaux.'}</p>

                <!-- Controls -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; background: var(--bg-input); padding: 1rem 1.25rem; border-radius: 20px; border: 1px solid var(--border);">
                    <div style="display: flex; flex-direction: column;">
                        <span style="color: var(--text-secondary); font-size: 0.75rem; font-weight: 700; letter-spacing: 1px; margin-bottom: 0.5rem; text-transform: uppercase;">Quantité</span>
                        <div style="display: flex; align-items: center; gap: 1rem; background: var(--bg-card); border-radius: 30px; padding: 0.25rem 0.5rem; border: 1px solid var(--border);">
                            <button onclick="if(window.currentProductQty > 1) { window.currentProductQty--; document.getElementById('modal-qty-val').innerText = window.currentProductQty; }" style="background: var(--bg-input); border: 1px solid var(--border); width: 34px; height: 34px; border-radius: 50%; color: var(--text-primary); font-weight: bold; font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center;">-</button>
                            <span id="modal-qty-val" style="color: var(--primary); font-weight: 700; font-size: 1.2rem; min-width: 24px; text-align: center;">1</span>
                            <button onclick="window.currentProductQty++; document.getElementById('modal-qty-val').innerText = window.currentProductQty;" style="background: var(--bg-input); border: 1px solid var(--border); width: 34px; height: 34px; border-radius: 50%; color: var(--text-primary); font-weight: bold; font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center;">+</button>
                        </div>
                    </div>
                </div>

                <!-- Action Button -->
                <button onclick="addModalItemToCart('${restaurantId}', '${dishId}'); document.getElementById('product-detail-modal').remove();" style="background: var(--primary); color: #ffffff; border: none; width: 100%; padding: 1.1rem; border-radius: 16px; font-size: 1.05rem; font-weight: 700; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 0.5rem; box-shadow: var(--shadow-md); transition: transform 0.2s;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                    AJOUTER AU PANIER
                </button>
            </div>
        </div>
    `;
}

window.addModalItemToCart = function(restaurantId, dishId) {
    const qty = Number(window.currentProductQty) || 1;
    
    const r = store.getRestaurantById(restaurantId);
    if (!r || !r.menu) return;
    const dish = r.menu.find(d => String(d.id) === String(dishId));
    if (!dish) return;
    
    // Check for multi-restaurant cart safety (with safe string conversion)
    if (cart.restaurantId && String(cart.restaurantId) !== String(restaurantId) && cart.items && cart.items.length > 0) {
        const oldResto = store.getRestaurantById(cart.restaurantId);
        const oldName = oldResto ? oldResto.name : "un autre restaurant";
        const confirmClear = confirm(`Votre panier contient déjà des plats de "${oldName}". Voulez-vous vider votre panier actuel pour commander chez "${r.name}" ?`);
        if (!confirmClear) return;
        cart.items = [];
        cart.subtotal = 0;
        cart.total = 0;
        cart.loyaltyApplied = false;
    }

    cart.restaurantId = restaurantId;
    if (!Array.isArray(cart.items)) {
        cart.items = [];
    }

    const existingItem = cart.items.find(i => String(i.id) === String(dishId));
    if (existingItem) {
        existingItem.qty = Number(existingItem.qty || 0) + qty;
    } else {
        cart.items.push({
            id: dish.id,
            name: dish.name,
            price: Number(dish.price),
            qty: qty,
            image: dish.image || ''
        });
    }

    recalculateCart();
    saveCart();
    
    if (document.getElementById('panel-checkout')) {
        renderCheckoutTab(r);
    }
    updateFloatingCartBar(r);
    pulseCartBar();
    
    showCartToast(dish, qty, r);
};

// Cart updates
function addToCart(restaurantId, dishId) {
    const r = store.getRestaurantById(restaurantId);
    if (!r || !r.menu) return;
    const dish = r.menu.find(d => String(d.id) === String(dishId));
    if (!dish) return;
    
    // Check for multi-restaurant cart safety
    if (cart.restaurantId && String(cart.restaurantId) !== String(restaurantId) && cart.items && cart.items.length > 0) {
        const oldResto = store.getRestaurantById(cart.restaurantId);
        const oldName = oldResto ? oldResto.name : "un autre restaurant";
        const confirmClear = confirm(`Votre panier contient déjà des plats de "${oldName}". Voulez-vous vider votre panier actuel pour commander chez "${r.name}" ?`);
        if (!confirmClear) {
            return;
        }
        cart.items = [];
        cart.subtotal = 0;
        cart.total = 0;
        cart.loyaltyApplied = false;
    }
    
    cart.restaurantId = restaurantId;
    if (!Array.isArray(cart.items)) {
        cart.items = [];
    }
    
    const existing = cart.items.find(item => String(item.id) === String(dishId));
    if (existing) {
        existing.qty = Number(existing.qty || 0) + 1;
    } else {
        cart.items.push({
            id: dish.id,
            name: dish.name,
            price: Number(dish.price),
            qty: 1,
            image: dish.image || ''
        });
    }
    
    recalculateCart();
    saveCart();
    updateFloatingCartBar(r);
    pulseCartBar();
    if (document.getElementById('panel-checkout')) {
        renderCheckoutTab(r);
    }
    showCartToast(dish, 1, r);
}
window.addToCart = addToCart;

function updateCartQty(dishId, change) {
    if (!cart.items) return;
    const idx = cart.items.findIndex(item => String(item.id) === String(dishId));
    if (idx !== -1) {
        cart.items[idx].qty = Number(cart.items[idx].qty || 1) + Number(change);
        if (cart.items[idx].qty <= 0) {
            cart.items.splice(idx, 1);
        }
        if (cart.items.length === 0) {
            cart.restaurantId = null;
            cart.deliveryFee = 0;
            cart.loyaltyApplied = false;
        }
        recalculateCart();
        saveCart();
        const r = cart.restaurantId ? store.getRestaurantById(cart.restaurantId) : null;
        if (r) {
            updateFloatingCartBar(r);
            renderCheckoutTab(r);
        } else {
            updateFloatingCartBar();
            const container = document.getElementById('checkout-content-container');
            if (container) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 4rem 1rem;">
                        <span style="font-size: 3rem;">🛒</span>
                        <h3 style="margin-top: 1rem;">Votre panier est vide</h3>
                        <p style="color: var(--text-secondary); margin: 0.5rem 0 1.5rem 0;">Parcourez notre menu du jour et ajoutez des délices !</p>
                        <button class="btn btn-primary" onclick="switchRestoTab('menu')">Voir le Menu</button>
                    </div>
                `;
            }
        }
    }
}
window.updateCartQty = updateCartQty;

function updateFloatingCartBar(r) {
    const totalQty = (cart && cart.items) ? cart.items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0) : 0;
    const totalAmount = cart ? (cart.total || 0) : 0;
    
    // Mobile navigation cart badge
    const badge = document.getElementById('mobile-nav-cart-badge');
    if (badge) {
        if (totalQty > 0) {
            badge.innerText = totalQty;
            badge.style.display = 'flex';
            badge.classList.add('pulse-animation');
            setTimeout(() => badge.classList.remove('pulse-animation'), 300);
        } else {
            badge.style.display = 'none';
        }
    }

    // Floating cart bar in body
    const bar = document.getElementById('floating-cart-bar');
    const barQty = document.getElementById('floating-cart-qty');
    const barTotal = document.getElementById('floating-cart-total');
    if (bar) {
        if (totalQty > 0) {
            bar.style.display = 'flex';
            if (barQty) barQty.innerText = `${totalQty} article${totalQty > 1 ? 's' : ''}`;
            if (barTotal) barTotal.innerText = `${Number(totalAmount).toLocaleString('fr-FR')} FCFA`;
        } else {
            bar.style.display = 'none';
        }
    }
}
window.updateFloatingCartBar = updateFloatingCartBar;

// Checkout logic moved to js/ui-checkout.js


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
                <button class="btn btn-primary" onclick="window.startGroupOrder('${r.slug}')">
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
                    <button class="btn btn-danger btn-sm btn-icon" style="padding: 0.15rem 0.35rem; font-size: 0.7rem; margin-top: 0.25rem;" onclick="window.removeParticipant(${pIdx}, '${r.slug}', '${groupId}')">❌</button>
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
                <div class="form-row" style="margin-bottom: 1rem;">
                    <input type="text" id="part-name" class="form-control" placeholder="Votre prénom">
                    <select id="part-dish-select" class="form-control">${dishesOptions}</select>
                    <button class="btn btn-primary btn-sm" onclick="window.addParticipantAction('${r.slug}', '${groupId}')">Ajouter</button>
                </div>
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
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                        <label class="form-label" style="margin-bottom: 0;">Numéro WhatsApp du Responsable <span class="required">*</span></label>
                        <span id="group-phone-badge" style="font-size: 0.75rem; font-weight: 600;"></span>
                    </div>
                    <div style="position: relative;">
                        <input type="tel" id="group-phone" class="form-control" placeholder="+221 77 123 45 67" required autocomplete="tel" style="padding-right: 2.5rem; transition: all 0.2s ease;">
                        <span id="group-phone-icon" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); font-size: 1rem; pointer-events: none; opacity: 0.85;"></span>
                    </div>
                    <div id="group-phone-feedback" style="margin-top: 0.35rem; font-size: 0.78rem; min-height: 1.2rem; display: flex; align-items: center; gap: 0.35rem; transition: all 0.2s ease;">
                        <span style="color: var(--text-secondary);">💡 Format Sénégal : 77, 78, 76, 70, 75 (9 chiffres)</span>
                    </div>
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

    setTimeout(() => {
        const phoneInput = document.getElementById('group-phone');
        const savedPhone = localStorage.getItem('customerPhone') || localStorage.getItem('user_phone') || '';
        if (savedPhone && phoneInput && !phoneInput.value) {
            phoneInput.value = savedPhone;
        }
        if (phoneInput && typeof window.attachRealtimePhoneValidation === 'function') {
            window.attachRealtimePhoneValidation('group-phone', 'group-phone-feedback', 'group-phone-badge', 'group-phone-icon');
        }
    }, 30);
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

window.startGroupOrder = async function(slug) {
    const creator = document.getElementById('group-creator-name').value.trim();
    
    if (!creator) {
        showToast("Veuillez saisir le nom de l'organisateur", "danger");
        return;
    }
    
    const r = await store.getRestaurantBySlug(slug);
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

window.addParticipantAction = async function(slug, groupId) {
    const name = document.getElementById('part-name').value.trim();
    const dishId = document.getElementById('part-dish-select').value;
    
    if (!name || !dishId) {
        showToast("Veuillez remplir le nom et choisir un plat", "danger");
        return;
    }
    
    const r = await store.getRestaurantBySlug(slug);
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

window.removeParticipant = async function(idx, slug, groupId) {
    activeGroupOrder.participants.splice(idx, 1);
    const r = await store.getRestaurantBySlug(slug);
    renderGroupTab(r, groupId);
    showToast("Choix supprimé", "info");
}

window.joinGroupOrder = async function(slug, groupId) {
    const r = await store.getRestaurantBySlug(slug);
    renderGroupTab(r, groupId);
    showToast("Commande jointe", "info");
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
        time,
        timestamp: Date.now(),
        createdAt: new Date().toISOString()
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
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                    <label class="form-label" style="margin-bottom: 0;">Numéro WhatsApp <span class="required">*</span></label>
                    <span id="booking-phone-badge" style="font-size: 0.75rem; font-weight: 600;"></span>
                </div>
                <div style="position: relative;">
                    <input type="tel" id="booking-phone" class="form-control" placeholder="+221 77 123 45 67" required autocomplete="tel" style="padding-right: 2.5rem; transition: all 0.2s ease;">
                    <span id="booking-phone-icon" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); font-size: 1rem; pointer-events: none; opacity: 0.85;"></span>
                </div>
                <div id="booking-phone-feedback" style="margin-top: 0.35rem; font-size: 0.78rem; min-height: 1.2rem; display: flex; align-items: center; gap: 0.35rem; transition: all 0.2s ease;">
                    <span style="color: var(--text-secondary);">💡 Format Sénégal : 77, 78, 76, 70, 75 (9 chiffres)</span>
                </div>
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

    setTimeout(() => {
        const phoneInput = document.getElementById('booking-phone');
        const firstnameInput = document.getElementById('booking-firstname');
        const lastnameInput = document.getElementById('booking-lastname');

        const savedPhone = localStorage.getItem('customerPhone') || localStorage.getItem('user_phone') || '';
        const savedName = localStorage.getItem('customerName') || localStorage.getItem('user_name') || '';

        if (savedPhone && phoneInput && !phoneInput.value) {
            phoneInput.value = savedPhone;
        }

        if (savedName && firstnameInput && lastnameInput && !firstnameInput.value && !lastnameInput.value) {
            const parts = savedName.trim().split(' ');
            if (parts.length > 1) {
                firstnameInput.value = parts[0];
                lastnameInput.value = parts.slice(1).join(' ');
            } else if (parts.length === 1) {
                firstnameInput.value = parts[0];
            }
        }

        if (phoneInput && typeof window.attachRealtimePhoneValidation === 'function') {
            window.attachRealtimePhoneValidation('booking-phone', 'booking-phone-feedback', 'booking-phone-badge', 'booking-phone-icon');
        }
    }, 30);
}

function validateBookingDate(restaurantId) {
    const input = document.getElementById('booking-date');
    const selectedDate = new Date(input.value);
    
    // getDay returns 0=Sunday, 1=Monday... 6=Saturday
    let day = selectedDate.getDay();
    if (day === 0) day = 7; // Map Sunday to 7
    
    const r = store.getRestaurantById(restaurantId);
    if (!r) return;
    
    const closedDaysList = Array.isArray(r.closedDays) ? r.closedDays : [];
    if (closedDaysList.includes(day)) {
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
    if (!container) return;
    
    // Calculate stats & stars breakdown
    const reviews = Array.isArray(r.reviews) ? r.reviews : [];
    const totalReviews = reviews.length;
    let totalScore = reviews.reduce((sum, rev) => sum + (Number(rev.rating) || 5), 0);
    let avg = totalReviews > 0 ? (totalScore / totalReviews).toFixed(1) : "0.0";
    
    // Counts per star rating (5, 4, 3, 2, 1)
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(rev => {
        const star = Math.min(5, Math.max(1, Math.round(Number(rev.rating) || 5)));
        counts[star] = (counts[star] || 0) + 1;
    });

    let breakdownHtml = '';
    for (let star = 5; star >= 1; star--) {
        const count = counts[star] || 0;
        const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
        breakdownHtml += `
            <div class="review-breakdown-bar">
                <span style="width: 45px; font-weight: 600; color: var(--text-primary); display: flex; align-items: center; gap: 2px;">
                    ${star} <span style="color: #F59E0B; font-size: 0.85rem;">★</span>
                </span>
                <div class="review-progress-track">
                    <div class="review-progress-fill" style="width: ${pct}%;"></div>
                </div>
                <span style="width: 35px; text-align: right; color: var(--text-secondary); font-size: 0.75rem;">${count}</span>
            </div>
        `;
    }
    
    let listHtml = '';
    if (totalReviews === 0) {
        listHtml = `
            <div style="text-align: center; color: var(--text-secondary); padding: 3rem 1rem; background: var(--bg-card); border-radius: 16px; border: 1px dashed var(--border);">
                <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🌟</div>
                <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem;">Soyez le premier à donner votre avis !</h4>
                <p style="font-size: 0.85rem; max-width: 400px; margin: 0 auto;">Partagez votre expérience culinaire avec la communauté thiessoise.</p>
            </div>
        `;
    } else {
        reviews.forEach(rev => {
            const numRating = Math.min(5, Math.max(1, Math.round(Number(rev.rating) || 5)));
            const stars = '★'.repeat(numRating) + '☆'.repeat(5 - numRating);
            const replyBlock = rev.reply 
                ? `<div class="review-reply"><div class="review-reply-author">Réponse du restaurant ${r.name}</div>${rev.reply}</div>` 
                : '';
            
            const initials = (rev.author || 'Anonyme')
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2) || 'AN';
                
            listHtml += `
                <div class="review-item" style="box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
                    <div class="review-header">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem; flex-shrink: 0;">
                                ${initials}
                            </div>
                            <div>
                                <span class="review-author" style="font-size: 0.95rem; font-weight: 700; display: block;">${rev.author || 'Client vérifié'}</span>
                                <div class="stars-rating" style="display: flex; align-items: center; gap: 4px; font-size: 0.9rem; color: #F59E0B; margin-top: 2px;">
                                    ${stars}
                                    <span style="font-size: 0.75rem; color: var(--text-secondary); margin-left: 4px;">(${numRating}/5)</span>
                                </div>
                            </div>
                        </div>
                        <span class="review-date" style="font-size: 0.75rem; color: var(--text-secondary);">${rev.date || 'Récemment'}</span>
                    </div>
                    <p class="review-comment" style="margin-top: 0.75rem; line-height: 1.5; font-size: 0.9rem;">${rev.comment}</p>
                    ${replyBlock}
                </div>
            `;
        });
    }

    // Pre-fill user name if logged in
    const defaultAuthor = (typeof customerAuth !== 'undefined' && customerAuth.currentUser && customerAuth.currentUser.name) 
        ? customerAuth.currentUser.name 
        : '';

    container.innerHTML = `
        <div class="reviews-summary" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; align-items: center;">
            <div class="rating-big-box" style="border-right: none; padding-right: 0; text-align: center;">
                <div class="rating-big-num" style="color: var(--primary); font-size: 3rem;">${avg}</div>
                <div class="stars-rating" style="font-size: 1.1rem; color: #F59E0B; margin: 0.35rem 0;">
                    ${'★'.repeat(Math.round(Number(avg)))}${'☆'.repeat(5 - Math.round(Number(avg)))}
                </div>
                <div style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 600;">
                    Basé sur ${totalReviews} avis client${totalReviews > 1 ? 's' : ''}
                </div>
            </div>
            <div style="flex-grow: 1;">
                ${breakdownHtml}
            </div>
        </div>

        <div style="margin-bottom: 2.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h3 style="font-size: 1.15rem; font-weight: 700; margin: 0;">✍️ Laisser un avis et une note</h3>
            </div>
            <form id="review-form" onsubmit="submitReview(event, '${r.id}')" style="background: var(--bg-card); padding: 1.5rem; border-radius: 18px; border: 1px solid var(--border); box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                <div class="form-group" style="margin-bottom: 1.25rem;">
                    <label class="form-label" style="font-weight: 700; margin-bottom: 0.5rem; display: block;">Votre note pour ${r.name} <span class="required" style="color: var(--accent);">*</span></label>
                    <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
                        <div class="stars-selector" id="stars-selector-container">
                            <span onclick="setStarsSelector(1)" title="1 étoile - Décevant">★</span>
                            <span onclick="setStarsSelector(2)" title="2 étoiles - Moyen">★</span>
                            <span onclick="setStarsSelector(3)" title="3 étoiles - Bon">★</span>
                            <span onclick="setStarsSelector(4)" title="4 étoiles - Très bon">★</span>
                            <span onclick="setStarsSelector(5)" title="5 étoiles - Excellent">★</span>
                        </div>
                        <span id="star-rating-label" style="font-weight: 700; font-size: 0.9rem; color: #92400E; background: #FEF3C7; padding: 0.2rem 0.6rem; border-radius: 8px;">5/5 - Excellent ⭐</span>
                    </div>
                    <input type="hidden" id="review-rating-val" value="5">
                </div>
                
                <div class="form-group" style="margin-bottom: 1.25rem;">
                    <label class="form-label" style="font-weight: 600;">Votre nom complet <span class="required" style="color: var(--accent);">*</span></label>
                    <input type="text" id="review-author-name" class="form-control" placeholder="ex: Seydou Kane" value="${defaultAuthor}" required>
                </div>
                
                <div class="form-group" style="margin-bottom: 1.5rem;">
                    <label class="form-label" style="font-weight: 600;">Votre retour d'expérience <span class="required" style="color: var(--accent);">*</span></label>
                    <textarea id="review-comment-text" class="form-control" rows="3" placeholder="Qualité des plats, rapidité, accueil, emballage..." required></textarea>
                </div>
                
                <button type="submit" class="btn btn-primary" style="font-weight: 700; padding: 0.75rem 1.5rem;">
                    ✨ Publier mon avis
                </button>
            </form>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <h3 style="font-size: 1.15rem; font-weight: 700; margin: 0;">💬 Tous les retours clients (${totalReviews})</h3>
        </div>
        <div class="reviews-list">
            ${listHtml}
        </div>
    `;
    
    // Trigger default star highlights
    setStarsSelector(5);
}

let currentSelectedRating = 5;
const RATING_LABELS = {
    1: "1/5 - Décevant 😞",
    2: "2/5 - Moyen 😐",
    3: "3/5 - Bon 🙂",
    4: "4/5 - Très bon ! 😊",
    5: "5/5 - Excellent ! 🌟"
};

function setStarsSelector(num) {
    currentSelectedRating = num;
    const input = document.getElementById('review-rating-val');
    if (input) input.value = num;
    
    const label = document.getElementById('star-rating-label');
    if (label) {
        label.textContent = RATING_LABELS[num] || `${num}/5`;
    }
    
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
    if (!r) {
        showToast("Restaurant introuvable", "danger");
        return;
    }
    
    const name = document.getElementById('review-author-name').value.trim();
    const comment = document.getElementById('review-comment-text').value.trim();
    const rating = parseInt(document.getElementById('review-rating-val').value) || 5;
    
    if (!name || !comment) {
        showToast("Veuillez remplir tous les champs obligatoires.", "warning");
        return;
    }
    
    const date = new Date().toISOString().split('T')[0];
    
    const newRev = {
        id: `rev_${r.id}_${Date.now()}`,
        author: name,
        rating,
        comment,
        date,
        reply: null
    };
    
    if (!Array.isArray(r.reviews)) {
        r.reviews = [];
    }
    
    // Add review at the beginning of the list
    r.reviews.unshift(newRev);
    
    // Recalculate average rating & counts
    let totalScore = r.reviews.reduce((sum, rev) => sum + (Number(rev.rating) || 5), 0);
    r.rating = Number((totalScore / r.reviews.length).toFixed(1));
    r.reviewsCount = r.reviews.length;
    
    store.updateRestaurant(r.id, { 
        reviews: r.reviews,
        rating: r.rating,
        reviewsCount: r.reviewsCount
    });

    showToast("✨ Merci ! Votre avis et votre note ont été publiés.", "success");
    
    // Re-render restaurant view on reviews tab
    renderRestaurantView(r, 'reviews');
}

// ----------------------------------------------------
// Page: RESTAURANT AUTH (Login uniquement)
// ----------------------------------------------------
// ----------------------------------------------------
// Page: VENDOR DASHBOARD
// ----------------------------------------------------
router.add('#/vendor/:slug', (slug) => {
    if (window.currentVendorSession && window.currentVendorSession.slug === slug) {
        window.renderVendorDashboard();
    } else {
        window.renderVendorLogin(slug);
    }
});

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
                <p style="font-size: 0.85rem; font-style: italic; text-align: center;">Dernière mise à jour : septembre 2026</p>
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
                <p style="font-size: 0.85rem; font-style: italic; text-align: center;">Dernière mise à jour : septembre 2026</p>
            </div>
            <div style="text-align: center; margin-top: 2rem;">
                <button class="btn btn-primary" onclick="router.navigate('/')">Retour à l'accueil</button>
            </div>
        </section>
    `;
});

// ----------------------------------------------------
// Page: LIVREUR (Bientôt disponible)
// ----------------------------------------------------
router.add('#/livreurs', () => {
    document.getElementById('floating-cart-bar').style.display = 'none';
    stopOrderPolling();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    document.getElementById('main-content').innerHTML = `
        <div style="max-width: 650px; margin: 3rem auto; padding: 2.5rem 1.5rem; text-align: center; animation: fadeIn 0.3s ease;">
            <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: 24px; padding: 3rem 2rem; box-shadow: var(--shadow);">
                <div style="width: 80px; height: 80px; background: rgba(var(--primary-rgb), 0.12); color: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin: 0 auto 1.5rem;">
                    🛵
                </div>
                
                <span class="badge" style="background: #FEF3C7; color: #92400E; font-size: 0.85rem; font-weight: 800; padding: 0.4rem 1rem; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; margin-bottom: 1rem; border: 1px solid rgba(245, 158, 11, 0.3);">
                    ⏳ Bientôt disponible
                </span>

                <h1 style="font-family: var(--font-serif); font-size: 1.85rem; color: var(--text-primary); margin: 0 0 0.75rem; font-weight: 800;">
                    Espace Coursiers &amp; Livreurs Thiès
                </h1>
                
                <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6; max-width: 480px; margin: 0 auto 1.75rem;">
                    L'application dédiée aux livreurs indépendants et flottes de livraison de la ville de Thiès est actuellement en cours de finalisation.
                </p>

                <div style="background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 16px; padding: 1.25rem; text-align: left; margin-bottom: 2rem;">
                    <div style="font-weight: 700; font-size: 0.9rem; color: var(--text-primary); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem;">
                        <span>📋</span> <span>Vous souhaitez rejoindre notre réseau de livreurs ?</span>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0; line-height: 1.5;">
                        Contactez directement la coordination logistique pour enregistrer votre moto / scooter et être prioritaire dès le lancement officiel de l'interface livreur.
                    </p>
                </div>

                <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
                    <a href="https://wa.me/221784799882?text=${encodeURIComponent("Bonjour THIES Resto, je souhaite postuler comme livreur partenaire à Thiès.")}" target="_blank" class="btn btn-primary" style="font-weight: 700; border-radius: 12px; padding: 0.75rem 1.5rem; display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none;">
                        💬 Rejoindre la flotte sur WhatsApp
                    </a>
                    <button class="btn btn-secondary" onclick="router.navigate('/')" style="font-weight: 600; border-radius: 12px; padding: 0.75rem 1.25rem;">
                        Retour à l'accueil
                    </button>
                </div>
            </div>
        </div>
    `;
});

// ----------------------------------------------------
// Order Tracking View
// ----------------------------------------------------
router.add('#/tracking', () => {
    document.getElementById('floating-cart-bar').style.display = 'none';
    
    // Set up realtime listener object if not exists
    if (!window.trackingSubscriptions) window.trackingSubscriptions = {};
    
    const userPhone = (typeof customerAuth !== 'undefined' && customerAuth.getUser().phone) 
        || localStorage.getItem('customerPhone') 
        || localStorage.getItem('trackingPhone') 
        || '';

    document.getElementById('main-content').innerHTML = `
        <div style="max-width: 640px; margin: 0 auto; padding: 2rem 1.25rem; text-align: center; animation: fadeIn 0.4s ease;">
            <div style="font-size: 3rem; margin-bottom: 0.75rem;">📍</div>
            <h2 style="color: var(--text-primary); margin-bottom: 0.4rem; font-size: 1.75rem; font-weight: 800;">Suivi de Commande en Direct</h2>
            <p style="color: var(--text-secondary); margin-bottom: 1.75rem; font-size: 0.92rem; line-height: 1.5;">
                Suivez la progression de votre repas : <strong>Réception ➔ Mise en cuisine ➔ Livraison ➔ Confirmation par vous</strong>.
            </p>
            
            <div style="background: var(--bg-card); padding: 1.5rem; border-radius: 20px; border: 1px solid var(--border); box-shadow: var(--shadow);">
                <div style="display: flex; gap: 0.75rem; margin-bottom: 1rem;">
                    <input type="tel" id="tracking-phone" class="form-control" placeholder="+221 77 123 45 67" value="${userPhone}" style="margin-bottom: 0; font-weight: 600;">
                    <button class="btn btn-primary" onclick="window.fetchOrderTracking()" style="white-space: nowrap; font-weight: 700; padding: 0.65rem 1.25rem;">Suivre 🔍</button>
                </div>
                <div id="tracking-result-container" style="text-align: left; margin-top: 1.5rem;">
                    <!-- Tracking results will appear here -->
                </div>
            </div>
        </div>
    `;

    if (userPhone) {
        setTimeout(() => {
            if (typeof window.fetchOrderTracking === 'function') {
                window.fetchOrderTracking();
            }
        }, 100);
    }
});

window.confirmCustomerDelivery = async function(orderId) {
    if (!orderId) return;
    
    const btns = document.querySelectorAll(`[data-confirm-order-id="${orderId}"], #btn-confirm-delivery-${orderId}`);
    btns.forEach(btn => {
        btn.disabled = true;
        btn.innerHTML = '⏳ Transmission...';
    });

    try {
        // 1. Mettre à jour dans Supabase
        if (typeof supabaseClient !== 'undefined' && supabaseClient) {
            try {
                await supabaseClient.rpc('update_order_status', {
                    p_order_id: String(orderId),
                    p_status: 'Livrée'
                });
            } catch (rpcErr) {
                console.warn('RPC update_order_status notice, using direct update:', rpcErr);
                await supabaseClient.from('orders').update({ status: 'Livrée', updated_at: new Date().toISOString() }).eq('id', String(orderId));
            }
        }

        // 2. Mettre à jour dans le store mémoire
        if (typeof store !== 'undefined' && store.data && Array.isArray(store.data.orders)) {
            const memOrder = store.data.orders.find(o => String(o.id) === String(orderId));
            if (memOrder) {
                memOrder.status = 'Livrée';
                store.save();
            }
        }

        // 3. Mettre à jour dans l'historique local
        try {
            let history = JSON.parse(localStorage.getItem('THIES_ORDER_HISTORY') || '[]');
            history.forEach(item => {
                if (String(item.id) === String(orderId)) {
                    item.status = 'Livrée';
                    item.customerConfirmedAt = new Date().toISOString();
                }
            });
            localStorage.setItem('THIES_ORDER_HISTORY', JSON.stringify(history));
        } catch (e) {}

        // 4. Son et animation de célébration
        if (typeof playNotificationSound === 'function') playNotificationSound();
        if (typeof triggerCelebration === 'function') triggerCelebration();
        if (navigator.vibrate) {
            try { navigator.vibrate([100, 50, 100]); } catch (e) {}
        }

        if (typeof showToast === 'function') {
            showToast("🎉 Merci ! Votre confirmation de réception a été transmise en direct au restaurant. Bon appétit !", "success", {
                title: "Commande Réceptionnée & Livrée !",
                duration: 8000
            });
        }

        // 5. Rafraîchir l'écran actif (suivi ou profil)
        setTimeout(() => {
            if (window.location.hash === '#/tracking' && typeof window.fetchOrderTracking === 'function') {
                window.fetchOrderTracking();
            } else if (window.location.hash === '#/profile' && typeof router !== 'undefined' && router.routes && router.routes['#/profile']) {
                router.routes['#/profile']();
            }
        }, 300);

    } catch (err) {
        console.error("Erreur lors de la confirmation client de livraison:", err);
        btns.forEach(btn => {
            btn.disabled = false;
            btn.innerHTML = '✅ J\'ai bien reçu ma commande';
        });
        if (typeof showToast === 'function') {
            showToast("Impossible de confirmer pour l'instant. Veuillez réessayer.", "danger");
        }
    }
};

window.fetchOrderTracking = async function() {
    const rawPhone = document.getElementById('tracking-phone')?.value.trim() || '';
    if (!rawPhone) {
        showToast("Veuillez saisir votre numéro de téléphone", "warning");
        return;
    }
    const phone = cleanPhoneNumber(rawPhone);
    const container = document.getElementById('tracking-result-container');
    if (!container) return;
    
    container.innerHTML = '<div style="text-align:center; padding: 2rem 0;"><div class="spinner-ring" style="width:34px;height:34px;border-width:3px; margin: 0 auto 0.75rem;"></div><div style="font-size: 0.88rem; color: var(--text-secondary);">Recherche de votre dernière commande et de votre historique...</div></div>';
    
    let allOrders = [];
    
    try {
        // 1. Récupération depuis Supabase
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient.rpc('get_order_tracking', {
                    p_phone: phone
                });
                if (!error && Array.isArray(data)) {
                    data.forEach(o => { if (o && o.id) allOrders.push(o); });
                }
            } catch (err) {
                console.warn("Supabase tracking fetch notice:", err);
            }
        }
        
        // 2. Récupération depuis la mémoire locale du store
        if (typeof store !== 'undefined' && store.data && Array.isArray(store.data.orders)) {
            const memoryOrders = store.data.orders.filter(o => {
                const oPhone = cleanPhoneNumber(o.customerPhone || '');
                return oPhone && (oPhone.endsWith(phone.slice(-9)) || phone.endsWith(oPhone.slice(-9)));
            });
            memoryOrders.forEach(mo => {
                if (!allOrders.some(x => String(x.id) === String(mo.id))) {
                    allOrders.push(mo);
                }
            });
        }
        
        // 3. Récupération depuis l'historique persistent (localStorage)
        try {
            const localHistory = JSON.parse(localStorage.getItem('THIES_ORDER_HISTORY') || '[]');
            localHistory.forEach(localItem => {
                const oPhone = cleanPhoneNumber(localItem.customerPhone || '');
                if (oPhone && (oPhone.endsWith(phone.slice(-9)) || phone.endsWith(oPhone.slice(-9)))) {
                    if (!allOrders.some(x => String(x.id) === String(localItem.id))) {
                        allOrders.push(localItem);
                    }
                }
            });
        } catch (e) {}

        if (!allOrders || allOrders.length === 0) {
            container.innerHTML = `
                <div style="text-align:center; padding: 2.5rem 1rem; color: var(--text-secondary); background: var(--bg-page); border-radius: 18px; border: 1px dashed var(--border); margin-top: 1rem;">
                    <span style="font-size: 2.5rem; display: block; margin-bottom: 0.5rem;">🔍</span>
                    <h4 style="color: var(--text-primary); margin: 0 0 0.35rem; font-size: 1.1rem; font-weight: 700;">Aucune commande trouvée</h4>
                    <p style="margin: 0 0 1.25rem; font-size: 0.88rem; line-height: 1.4;">Aucune commande enregistrée pour le numéro <strong>${phone}</strong>.</p>
                    <button class="btn btn-primary" onclick="router.navigate('/')" style="border-radius: 12px; font-weight: 700; padding: 0.6rem 1.25rem; font-size: 0.9rem;">
                        Commander maintenant 🍲
                    </button>
                </div>
            `;
            return;
        }

        // Tri par date décroissante : la plus récente en premier
        allOrders.sort((a, b) => {
            const dateA = new Date(a.created_at || a.savedAt || a.date || 0).getTime();
            const dateB = new Date(b.created_at || b.savedAt || b.date || 0).getTime();
            if (!isNaN(dateA) && !isNaN(dateB) && dateA !== dateB) return dateB - dateA;
            return String(b.id).localeCompare(String(a.id), undefined, { numeric: true });
        });

        // =========================================================================
        // RÈGLE : Suivi en direct strict de la DERNIÈRE commande active
        // Lorsque la commande est terminée (Livrée ou Annulée), un résumé clair et épuré est affiché.
        // On n'affiche plus l'historique complet pour ne pas alourdir la page.
        // =========================================================================
        const latestOrder = allOrders[0];

        // Sauvegarder l'ID de la commande suivie
        if (latestOrder && latestOrder.id) {
            try {
                localStorage.setItem('trackingOrderId', String(latestOrder.id));
                localStorage.setItem('trackingPhone', String(phone));
            } catch (e) {}
        }

        // Vérification automatique des délais d'expiration (1h30 sans réaction ou non réceptionnée)
        if (store && typeof store.checkAndAutoCancelStaleOrders === 'function') {
            store.checkAndAutoCancelStaleOrders();
        }

        const ageMinutes = (store && typeof store.getOrderAgeMinutes === 'function')
            ? store.getOrderAgeMinutes(latestOrder)
            : 0;
        
        // Règle 1 : Si le restaurant ne marque pas comme reçu (reste "En attente" sans confirmation > 20 min)
        if (latestOrder.status === 'En attente' && ageMinutes >= 20) {
            latestOrder.status = 'Annulée';
            latestOrder.cancelReason = "Délai expiré : Le restaurant n'a pas confirmé la réception de la commande dans le délai imparti.";
            if (store && typeof store.updateOrderStatus === 'function') {
                store.updateOrderStatus(latestOrder.id, 'Annulée', latestOrder.cancelReason);
            }
        }
        // Règle 2 : Si la commande est reçue/acceptée mais reste bloquée sans progression après 1h30 (90 min)
        else if (latestOrder.status !== 'Livrée' && latestOrder.status !== 'Livré' && latestOrder.status !== 'Annulée' && ageMinutes >= 90) {
            latestOrder.status = 'Annulée';
            latestOrder.cancelReason = "Délai expiré : Commande automatiquement annulée après 1h30 sans réaction ou finalisation de livraison par le restaurant.";
            if (store && typeof store.updateOrderStatus === 'function') {
                store.updateOrderStatus(latestOrder.id, 'Annulée', latestOrder.cancelReason);
            }
        }

        const r = store.getRestaurantById(latestOrder.restaurant_id || latestOrder.restaurantId);
        const rName = r ? r.name : (latestOrder.restaurantName || 'Restaurant de Thiès');
        const rWhatsapp = r ? (r.whatsapp || r.phone) : null;
        
        const isEnAttente = latestOrder.status === 'En attente';
        const isRecue = latestOrder.status === 'Reçue';
        const isEnCuisine = latestOrder.status === 'Confirmée' || latestOrder.status === 'En préparation' || latestOrder.status === 'En cuisine';
        const isPretPourLivraison = latestOrder.status === 'Prêt pour livraison' || latestOrder.status === 'Prête';
        const isEnLivraison = latestOrder.status === 'En cours de livraison' || latestOrder.status === 'En livraison' || latestOrder.status === 'Partie en livraison';
        const isLivree = latestOrder.status === 'Livrée' || latestOrder.status === 'Livré';
        const isCancelled = latestOrder.status === 'Annulée';

        let statusColor = '#f59e0b';
        let statusIcon = '⏳';
        let stepPercent = 15;
        let statusLabel = 'En attente de confirmation';
        let stepDescription = 'Votre commande a été transmise. En attente de confirmation par le restaurant.';

        if (isEnAttente) {
            statusColor = '#f59e0b';
            statusIcon = '⏳';
            stepPercent = 15;
            statusLabel = 'En attente (Restaurant)';
            stepDescription = 'Votre commande a été transmise. Le restaurant doit confirmer la réception.';
        } else if (isRecue) {
            statusColor = '#0284c7';
            statusIcon = '📥';
            stepPercent = 35;
            statusLabel = 'Reçue & Acceptée';
            stepDescription = 'Le restaurant a bien réceptionné votre commande ! Elle va être mise en cuisine.';
        } else if (isEnCuisine) {
            statusColor = 'var(--primary)';
            statusIcon = '👨‍🍳';
            stepPercent = 55;
            statusLabel = 'En cuisine (Préparation)';
            stepDescription = 'Vos plats sont en cours de cuisson et de préparation par le chef.';
        } else if (isPretPourLivraison) {
            statusColor = '#0d9488';
            statusIcon = '📦';
            stepPercent = 75;
            statusLabel = 'Prêt pour livraison';
            stepDescription = 'Vos plats sont prêts et emballés ! En attente de prise en charge par le livreur.';
        } else if (isEnLivraison) {
            statusColor = '#0284c7';
            statusIcon = '🛵';
            stepPercent = 90;
            statusLabel = 'En cours de livraison';
            stepDescription = 'Le livreur est en route ! Dès que vous recevez vos plats, confirmez ci-dessous.';
        } else if (isLivree) {
            statusColor = '#059669';
            statusIcon = '✅';
            stepPercent = 100;
            statusLabel = 'Livrée avec succès';
            stepDescription = 'Commande réceptionnée et validée avec succès. Bon appétit !';
        } else if (isCancelled) {
            statusColor = 'var(--danger)';
            statusIcon = '❌';
            stepPercent = 100;
            statusLabel = 'Commande annulée';
            stepDescription = latestOrder.cancelReason || 'Cette commande a été automatiquement annulée.';
        }
        
        const isOtpVerified = latestOrder.otpVerified !== false;
        const totalFormatted = Number(latestOrder.total || latestOrder.certifiedTotal || 0).toLocaleString();

        let html = `
            <!-- =========================================================================
                 1. CARTE PRINCIPALE : SUIVI DE LA DERNIÈRE COMMANDE UNIQUE
                 ========================================================================= -->
            <div class="active-track-hero" id="track-card-${latestOrder.id}">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
                    <div>
                        <div class="track-pill-latest">
                            <span>📍</span> <span>Dernière Commande en Direct</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                            <span style="font-size: 0.9rem; font-weight: 800; color: var(--text-primary); font-family: monospace;">#${latestOrder.id}</span>
                            ${isOtpVerified ? `
                                <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.72rem; color: #059669; font-weight: 700; background: rgba(16, 185, 129, 0.12); padding: 2px 8px; border-radius: 12px; border: 1px solid rgba(16, 185, 129, 0.25);">
                                    🛡️ Authentifiée
                                </span>
                            ` : ''}
                            ${latestOrder.date ? `<span style="font-size: 0.78rem; color: var(--text-secondary);">📅 ${latestOrder.date}</span>` : ''}
                        </div>
                        <h3 style="margin: 0; color: var(--text-primary); font-size: 1.3rem; font-weight: 800;">${rName}</h3>
                    </div>
                    <div class="track-status-badge" style="background: rgba(255,255,255,0.06); padding: 0.45rem 0.95rem; border-radius: 20px; font-size: 0.85rem; font-weight: 800; color: ${statusColor}; border: 1.5px solid ${statusColor}; display: flex; align-items: center; gap: 0.4rem;">
                        <span>${statusIcon}</span> <span class="track-status-text">${statusLabel}</span>
                    </div>
                </div>

                <!-- Detail items -->
                <div style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 1rem; line-height: 1.5; background: var(--bg-page); padding: 0.75rem 1rem; border-radius: 12px; border: 1px solid var(--border);">
                    <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.35rem; font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.5px;">Articles commandés :</div>
                    <div>
                        ${latestOrder.items ? (Array.isArray(latestOrder.items) ? latestOrder.items.map(i => `<span style="display: inline-block; background: var(--bg-card); padding: 3px 8px; border-radius: 6px; margin: 2px; font-size: 0.82rem; border: 1px solid var(--border); font-weight: 600; color: var(--text-primary);">${i.qty}x ${i.name}</span>`).join(' ') : 'Détail commande') : ''}
                    </div>
                    ${totalFormatted !== '0' ? `
                        <div style="margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px dashed var(--border); display: flex; justify-content: space-between; align-items: center; font-size: 0.92rem; font-weight: 700; color: var(--text-primary);">
                            <span>Total de la commande :</span>
                            <span style="color: var(--primary); font-size: 1.05rem;">${totalFormatted} FCFA</span>
                        </div>
                    ` : ''}
                    ${latestOrder.paymentMethod ? `
                        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.35rem; padding-top: 0.35rem; border-top: 1px dashed var(--border);">
                            <span>💳 Règlement direct :</span>
                            <span style="font-weight: 700; color: var(--text-primary);">${latestOrder.paymentMethod}</span>
                        </div>
                    ` : ''}
                </div>

                <!-- Step explanation banner -->
                <div style="background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 12px; padding: 0.75rem 1rem; margin-bottom: 1.15rem; font-size: 0.88rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.6rem;">
                    <span style="font-size: 1.25rem;">${statusIcon}</span>
                    <span style="line-height: 1.4;">${stepDescription}</span>
                </div>
                
                <!-- Progress Bar 6 Distinct Steps -->
                <div style="margin-bottom: 1.25rem;">
                    <div style="height: 8px; background: var(--bg-secondary); border-radius: 10px; overflow: hidden; margin-bottom: 0.6rem; border: 1px solid var(--border);">
                        <div class="track-progress-bar" style="height: 100%; width: ${stepPercent}%; background: ${statusColor}; transition: width 0.5s ease-out, background 0.5s ease-out;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-secondary); font-weight: 600; gap: 2px;">
                        <span style="${stepPercent >= 15 ? 'color: var(--text-primary); font-weight: 700;' : ''}">⏳ Transmise</span>
                        <span style="${stepPercent >= 35 ? 'color: var(--text-primary); font-weight: 700;' : ''}">📥 Reçue</span>
                        <span style="${stepPercent >= 55 ? 'color: var(--text-primary); font-weight: 700;' : ''}">👨‍🍳 En cuisine</span>
                        <span style="${stepPercent >= 75 ? 'color: var(--text-primary); font-weight: 700;' : ''}">📦 Prêt</span>
                        <span style="${stepPercent >= 90 ? 'color: var(--text-primary); font-weight: 700;' : ''}">🛵 Livraison</span>
                        <span style="${stepPercent >= 100 ? (isCancelled ? 'color: var(--danger); font-weight: 700;' : 'color: #059669; font-weight: 700;') : ''}">${isCancelled ? '❌ Annulée' : '✅ Livrée'}</span>
                    </div>
                </div>

                <!-- Client Delivery Confirmation Action (ACTIVE ONLY IN PHASE DE LIVRAISON) -->
                ${isEnLivraison ? `
                    <div style="margin-top: 1.25rem; padding: 1.25rem; background: rgba(32, 201, 151, 0.08); border: 2px solid #20c997; border-radius: 16px; text-align: center; box-shadow: 0 4px 15px rgba(32, 201, 151, 0.15);">
                        <div style="font-size: 1.75rem; margin-bottom: 0.35rem;">🛵 📦</div>
                        <h4 style="margin: 0 0 0.35rem; font-size: 1.05rem; color: #059669; font-weight: 800;">
                            Le livreur est arrivé ?
                        </h4>
                        <p style="margin: 0 0 1rem; font-size: 0.88rem; color: var(--text-secondary); line-height: 1.4;">
                            Confirmez que vous avez bien reçu votre repas en mains propres pour finaliser la commande.
                        </p>
                        <button type="button" id="btn-confirm-delivery-${latestOrder.id}" data-confirm-order-id="${latestOrder.id}" class="btn btn-success ripple hover-3d" onclick="confirmCustomerDelivery('${latestOrder.id}')" style="width: 100%; font-weight: 800; padding: 0.9rem 1.25rem; border-radius: 14px; font-size: 1.05rem; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; background: #20c997; border-color: #20c997; box-shadow: 0 4px 14px rgba(32, 201, 151, 0.35);">
                            ✅ J'ai bien reçu ma commande
                        </button>
                    </div>
                ` : isLivree ? `
                    <div style="margin-top: 1.25rem; padding: 1.25rem; background: rgba(16, 185, 129, 0.1); border: 1.5px solid rgba(16, 185, 129, 0.35); border-radius: 16px; text-align: center;">
                        <div style="font-size: 1.8rem; margin-bottom: 0.25rem;">🎉 🍽️</div>
                        <div style="font-size: 1.05rem; font-weight: 800; color: #059669; margin-bottom: 0.25rem;">
                            Commande livrée & réception validée !
                        </div>
                        <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
                            Le restaurant a bien comptabilisé votre réception. Bon appétit !
                        </div>
                        ${r ? `
                            <a href="#/restaurant/${r.slug || r.id}" class="btn btn-outline btn-sm" style="font-weight: 700; border-radius: 10px; font-size: 0.82rem; padding: 0.4rem 0.85rem;">
                                ⭐ Donner un avis / Recommander chez ${r.name}
                            </a>
                        ` : ''}
                    </div>
                ` : ''}

                <!-- Contact Restaurant Help / Assistance -->
                <div style="margin-top: 1rem; display: flex; gap: 0.5rem; justify-content: flex-end; flex-wrap: wrap;">
                    ${rWhatsapp ? `
                        <a href="https://wa.me/${String(rWhatsapp).replace(/\+/g, '').replace(/\s+/g, '')}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="font-size: 0.78rem; border-radius: 10px; font-weight: 600; display: inline-flex; align-items: center; gap: 0.3rem;">
                            <span>💬</span> <span>WhatsApp Restaurant</span>
                        </a>
                    ` : ''}
                    ${r ? `
                        <a href="#/restaurant/${r.slug || r.id}" class="btn btn-secondary btn-sm" style="font-size: 0.78rem; border-radius: 10px; font-weight: 600; display: inline-flex; align-items: center; gap: 0.3rem;">
                            <span>🏪</span> <span>Voir la carte</span>
                        </a>
                    ` : ''}
                </div>
            </div>
        `;

        // Afficher uniquement la carte de suivi de la dernière commande active
        container.innerHTML = html;

        // Setup Realtime Listener specifically for the active latest order
        if (supabaseClient && !window.trackingSubscriptions[latestOrder.id]) {
            window.trackingSubscriptions[latestOrder.id] = supabaseClient.channel('track-' + latestOrder.id)
                .on(
                    'postgres_changes',
                    { event: 'UPDATE', schema: 'public', table: 'orders', filter: 'id=eq.' + latestOrder.id },
                    (payload) => {
                        console.log('Order update tracked in realtime:', payload);
                        if (payload.new && payload.old && payload.new.status !== payload.old.status) {
                            if (typeof playNotificationSound === 'function') playNotificationSound();
                            window.fetchOrderTracking();
                            if (typeof showToast === 'function') {
                                showToast(`🔔 Mise à jour : Votre commande est maintenant "${payload.new.status}" !`, "success");
                            }
                        }
                    }
                )
                .subscribe();
        }
        
    } catch (err) {
        console.error("fetchOrderTracking error:", err);
        container.innerHTML = '<p style="color: var(--danger); text-align: center;">Une erreur est survenue lors de la récupération.</p>';
    }
};
// ----------------------------------------------------
// Explore View (Recherche & Filtres)
// ----------------------------------------------------
router.add('#/explore', () => {
    updateSEO('home');
    const container = document.getElementById('main-content');
    const cartBar = document.getElementById('floating-cart-bar');
    if (cartBar) cartBar.style.display = 'none';

    container.innerHTML = `
        <div class="explore-screen" style="max-width: 1100px; margin: 0 auto; padding: 1.5rem 1rem 3rem; animation: fadeIn 0.3s ease;">
            <div style="margin-bottom: 1.5rem;">
                <h1 style="font-family: var(--font-serif); font-size: 1.75rem; font-weight: 800; color: var(--text-primary); margin: 0 0 0.35rem;">Explorer à Thiès 🔍</h1>
                <p style="color: var(--text-secondary); margin: 0; font-size: 0.95rem;">Recherchez un plat, une spécialité ou trouvez les restaurants les plus proches.</p>
            </div>

            <!-- Search input -->
            <div class="search-container" style="margin-bottom: 1.25rem; width: 100%; position: relative;">
                <input type="text" id="search-input-field" class="search-input" placeholder="Rechercher un plat, un restaurant..." oninput="applyFilters()" style="background: var(--bg-input); color: var(--text-primary); border: 1.5px solid var(--border); border-radius: 16px; padding: 1rem 3rem 1rem 1.25rem; width: 100%; font-size: 16px;">
                <button class="search-btn" style="color: var(--primary); position: absolute; right: 15px; top: 50%; transform: translateY(-50%); background: none; border: none; font-size: 1.2rem; cursor: pointer;" aria-label="Rechercher">🔍</button>
            </div>

            <!-- Action button for GPS -->
            <div style="display: flex; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
                <button type="button" class="btn btn-secondary btn-sm" onclick="geolocateRestaurants()" style="border-radius: 20px; display: inline-flex; align-items: center; gap: 0.4rem;">
                    📍 Restaurants autour de moi
                </button>
                <button type="button" class="btn btn-outline btn-sm" onclick="router.navigate('/favorites')" style="border-radius: 20px; display: inline-flex; align-items: center; gap: 0.4rem;">
                    ❤️ Mes Favoris
                </button>
            </div>

            <!-- Category Pills -->
            <div class="quick-filters-wrapper" style="margin-bottom: 1.5rem;">
                <div class="filter-bar" id="filter-bar" role="tablist">
                    <button class="filter-btn ${activeFilter === 'Tous' ? 'active' : ''}" onclick="setFilter('Tous')" data-category="Tous">
                        <span class="filter-icon">🍽️</span>
                        <span class="filter-label">Tous</span>
                        <span class="filter-badge" id="count-all"></span>
                    </button>
                    <button class="filter-btn ${activeFilter === 'Fast-Food' ? 'active' : ''}" onclick="setFilter('Fast-Food')" data-category="Fast-Food">
                        <span class="filter-icon">🍔</span>
                        <span class="filter-label">Fast-Food</span>
                        <span class="filter-badge" id="count-fastfood"></span>
                    </button>
                    <button class="filter-btn ${activeFilter === 'Dibiterie' ? 'active' : ''}" onclick="setFilter('Dibiterie')" data-category="Dibiterie">
                        <span class="filter-icon">🔥</span>
                        <span class="filter-label">Dibiterie</span>
                        <span class="filter-badge" id="count-dibiterie"></span>
                    </button>
                    <button class="filter-btn ${activeFilter === 'Traditionnel' ? 'active' : ''}" onclick="setFilter('Traditionnel')" data-category="Traditionnel">
                        <span class="filter-icon">🍲</span>
                        <span class="filter-label">Traditionnel</span>
                        <span class="filter-badge" id="count-traditionnel"></span>
                    </button>
                    <button class="filter-btn ${activeFilter === 'Gastronomique' ? 'active' : ''}" onclick="setFilter('Gastronomique')" data-category="Gastronomique">
                        <span class="filter-icon">✨</span>
                        <span class="filter-label">Gastronomique</span>
                        <span class="filter-badge" id="count-gastronomique"></span>
                    </button>
                    <button class="filter-btn ${activeFilter === 'Pâtisserie' ? 'active' : ''}" onclick="setFilter('Pâtisserie')" data-category="Pâtisserie">
                        <span class="filter-icon">🥐</span>
                        <span class="filter-label">Pâtisserie</span>
                        <span class="filter-badge" id="count-patisserie"></span>
                    </button>
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <span id="results-count-badge" class="results-count-badge"></span>
            </div>

            <!-- Restaurants Grid -->
            <div class="restaurants-grid" id="restaurants-list-grid"></div>
        </div>
    `;

    applyFilters();
});

// ----------------------------------------------------
// Favorites View (Mes Favoris)
// ----------------------------------------------------
router.add('#/favorites', () => {
    const container = document.getElementById('main-content');
    const cartBar = document.getElementById('floating-cart-bar');
    if (cartBar) cartBar.style.display = 'none';

    renderFavoritesView();
});

function renderFavoritesView() {
    const container = document.getElementById('main-content');
    const favIds = window.getFavorites ? window.getFavorites() : [];
    const allRestos = store.getRestaurants().filter(r => r.status === 'active');
    const favRestos = allRestos.filter(r => favIds.includes(r.id));

    let contentHtml = '';
    if (favRestos.length === 0) {
        contentHtml = `
            <div style="text-align: center; padding: 4rem 1.5rem; background: var(--bg-card); border-radius: 24px; border: 1.5px dashed var(--border); max-width: 500px; margin: 2rem auto;">
                <div style="font-size: 3.5rem; margin-bottom: 1rem; animation: floatCloche 3s ease-in-out infinite;">❤️</div>
                <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem;">Aucun favori pour le moment</h2>
                <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.75rem;">
                    Ajoutez vos restaurants préférés en cliquant sur l'icône cœur pour les retrouver en un clin d'œil ici.
                </p>
                <button type="button" class="btn btn-primary" onclick="router.navigate('/')" style="border-radius: 25px; padding: 0.75rem 1.75rem; font-weight: 700;">
                    Découvrir nos restaurants 🍽️
                </button>
            </div>
        `;
    } else {
        let cardsHtml = '';
        favRestos.forEach(r => {
            const isCurrentlyOpen = isRestaurantOpenNow(r);
            const statusBadge = isCurrentlyOpen 
                ? `<span class="badge badge-success restaurant-card-badge">Ouvert</span>` 
                : `<span class="badge badge-danger restaurant-card-badge">Fermé</span>`;
            
            const coverUrl = r.coverImage || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60';
            
            cardsHtml += `
                <div class="restaurant-card hover-3d glass-panel" onclick="router.navigate('/r/${r.slug}')">
                    <button type="button" class="card-fav-btn is-fav active" data-fav-resto-id="${r.id}" onclick="toggleFavorite('${r.id}', event)" aria-label="Retirer des favoris">
                        ❤️
                    </button>
                    <div class="restaurant-card-header">
                        <img src="${coverUrl}" class="restaurant-card-img" alt="${r.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60'">
                        <div class="restaurant-card-gradient"></div>
                        <div class="restaurant-card-status">
                            ${statusBadge}
                        </div>
                    </div>
                    <div class="restaurant-card-body">
                        <div class="restaurant-card-top-row">
                            <h3 class="restaurant-card-name" title="${r.name}">${r.name}</h3>
                            <span class="stars-rating">★ ${r.rating.toFixed(1)}</span>
                        </div>
                        <p class="restaurant-card-address">
                            <span>📍</span> <span class="restaurant-card-address-text">${r.address}</span>
                        </p>
                        <div class="restaurant-card-footer">
                            <span class="restaurant-card-cuisine">${r.category}</span>
                            <span class="restaurant-card-reviews">${r.reviewsCount} avis</span>
                        </div>
                    </div>
                </div>
            `;
        });

        contentHtml = `
            <div class="restaurants-grid" style="margin-top: 1.5rem;">
                ${cardsHtml}
            </div>
        `;
    }

    container.innerHTML = `
        <div class="favorites-container">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.75rem;">
                <div>
                    <h1 style="font-family: var(--font-serif); font-size: 1.75rem; font-weight: 800; color: var(--text-primary); margin: 0 0 0.25rem;">Mes Favoris ❤️</h1>
                    <p style="color: var(--text-secondary); margin: 0; font-size: 0.95rem;">${favRestos.length} restaurant${favRestos.length > 1 ? 's' : ''} enregistré${favRestos.length > 1 ? 's' : ''}</p>
                </div>
                <button type="button" class="btn btn-secondary btn-sm" onclick="router.navigate('/')" style="border-radius: 20px;">
                    ← Retour à l'accueil
                </button>
            </div>
            ${contentHtml}
        </div>
    `;
}

// ----------------------------------------------------
// Cart View (#/cart)
// ----------------------------------------------------
router.add('#/cart', () => {
    if (typeof openCartTab === 'function') {
        openCartTab();
    }
});

// ----------------------------------------------------
// ----------------------------------------------------
// Profile View (Mon Compte Client)
// ----------------------------------------------------
router.add('#/profile', () => {
    const container = document.getElementById('main-content');
    const cartBar = document.getElementById('floating-cart-bar');
    if (cartBar) cartBar.style.display = 'none';

    // Load local customer data
    const isCustomerAuth = typeof customerAuth !== 'undefined' && customerAuth.isAuthenticated();
    const customerUser = typeof customerAuth !== 'undefined' ? customerAuth.getUser() : {};
    
    const customerPhone = customerUser.phone || localStorage.getItem('customerPhone') || '';
    const customerName = customerUser.name || localStorage.getItem('customerName') || '';
    const customerAddress = customerUser.address || localStorage.getItem('customerAddress') || '';

    // Compute initials
    let initials = '👤';
    if (customerName) {
        const parts = customerName.trim().split(' ');
        if (parts.length >= 2) {
            initials = (parts[0][0] + parts[1][0]).toUpperCase();
        } else if (parts[0]) {
            initials = parts[0].substring(0, 2).toUpperCase();
        }
    }

    container.innerHTML = `
        <div class="account-screen" style="max-width: 620px; margin: 0 auto; padding: 1.25rem 1rem 3rem;">
            
            <!-- TOP PROFILE HEADER CARD (Comme les applications modernes) -->
            <div class="account-header-card" style="background: var(--bg-card); border-radius: 24px; border: 1px solid var(--border); padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.04); position: relative; overflow: hidden;">
                <div style="display: flex; align-items: center; gap: 1.25rem; flex-wrap: wrap;">
                    <div class="account-avatar" style="width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, #F26B21, #F59E0B); color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; font-weight: 800; box-shadow: 0 4px 14px rgba(242, 107, 33, 0.35); flex-shrink: 0;">
                        ${initials}
                    </div>
                    <div class="account-info" style="flex: 1; min-width: 200px;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.25rem;">
                            <h2 style="margin: 0; font-size: 1.35rem; font-weight: 800; color: var(--text-primary); font-family: var(--font-serif);">
                                ${customerName || 'Gourmet de Thiès'}
                            </h2>
                            ${isCustomerAuth ? `
                                <span style="font-size: 0.72rem; background: rgba(16, 185, 129, 0.15); color: #059669; padding: 0.2rem 0.6rem; border-radius: 12px; font-weight: 700; border: 1px solid rgba(16, 185, 129, 0.25); display: inline-flex; align-items: center; gap: 0.25rem;">
                                    ✓ Vérifié
                                </span>
                            ` : `
                                <span style="font-size: 0.72rem; background: rgba(242, 107, 33, 0.12); color: var(--primary); padding: 0.2rem 0.6rem; border-radius: 12px; font-weight: 700;">
                                    ⭐ Compte Client
                                </span>
                            `}
                        </div>
                        
                        <div style="display: flex; flex-direction: column; gap: 0.2rem; font-size: 0.88rem; color: var(--text-secondary);">
                            <div style="display: flex; align-items: center; gap: 0.4rem;">
                                <span>📱</span>
                                <span style="color: var(--text-primary); font-weight: 600;">${customerPhone || 'Numéro WhatsApp non renseigné'}</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 0.4rem;">
                                <span>📍</span>
                                <span>${customerAddress || 'Adresse de livraison à Thiès non renseignée'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Profile Action Bar -->
                <div style="display: flex; gap: 0.75rem; margin-top: 1.25rem; pt-3; border-top: 1px solid var(--border); padding-top: 1rem; flex-wrap: wrap;">
                    <button class="btn btn-primary btn-sm" onclick="toggleProfileEditForm()" style="border-radius: 12px; font-weight: 700; font-size: 0.85rem; padding: 0.5rem 1rem; flex: 1;">
                        ✏️ Modifier mes coordonnées
                    </button>
                    ${isCustomerAuth ? `
                        <button class="btn btn-secondary btn-sm" onclick="if(typeof customerAuth !== 'undefined') customerAuth.logout(); else clearLocalCustomerData();" style="border-radius: 12px; font-weight: 600; font-size: 0.85rem; padding: 0.5rem 1rem; color: var(--danger);">
                            🚪 Déconnexion
                        </button>
                    ` : `
                        <button class="btn btn-secondary btn-sm" onclick="if(typeof customerAuth !== 'undefined') customerAuth.openModal(); else router.navigate('/auth');" style="border-radius: 12px; font-weight: 700; font-size: 0.85rem; padding: 0.5rem 1rem;">
                            ⚡ Connexion
                        </button>
                    `}
                </div>
            </div>

            <!-- MON PROFIL & COORDONNÉES FORM -->
            <div class="account-group" id="profile-edit-card" style="background: var(--bg-card); border-radius: 20px; border: 1px solid var(--border); overflow: hidden; margin-bottom: 1.5rem; box-shadow: var(--shadow-sm);">
                <div style="padding: 1.25rem 1.25rem 0.5rem;">
                    <h3 style="font-size: 1.05rem; font-weight: 700; margin: 0 0 0.25rem; color: var(--text-primary);">Mes Coordonnées de Livraison</h3>
                    <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 0;">Ces informations sont utilisées pour pré-remplir automatiquement vos commandes à Thiès.</p>
                </div>

                <div style="padding: 1rem 1.25rem 1.25rem;">
                    <form id="profile-form" onsubmit="saveProfile(event)">
                        <div class="form-group" style="margin-bottom: 0.85rem;">
                            <label style="font-size: 0.82rem; font-weight: 700; color: var(--text-secondary); display: block; margin-bottom: 0.35rem;">Nom Complet <span style="color: var(--primary);">*</span></label>
                            <input type="text" id="profile-name" class="form-control" value="${customerName}" placeholder="Ex: Awa Diop" required style="padding: 0.75rem 1rem; font-size: 0.95rem; border-radius: 12px;">
                        </div>
                        <div class="form-group" style="margin-bottom: 0.85rem;">
                            <label style="font-size: 0.82rem; font-weight: 700; color: var(--text-secondary); display: block; margin-bottom: 0.35rem;">Numéro de Téléphone WhatsApp <span style="color: var(--primary);">*</span></label>
                            <input type="tel" id="profile-phone" class="form-control" value="${customerPhone}" placeholder="Ex: 77 123 45 67" required style="padding: 0.75rem 1rem; font-size: 0.95rem; border-radius: 12px;">
                        </div>
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label style="font-size: 0.82rem; font-weight: 700; color: var(--text-secondary); display: block; margin-bottom: 0.35rem;">Adresse / Quartier par défaut (Thiès)</label>
                            <input type="text" id="profile-address" class="form-control" value="${customerAddress}" placeholder="Ex: Cité Lamy, Grand Standing, Randène, Tivaouane..." style="padding: 0.75rem 1rem; font-size: 0.95rem; border-radius: 12px;">
                        </div>
                        <button type="submit" class="btn btn-primary btn-block" style="border-radius: 14px; font-weight: 700; padding: 0.75rem; font-size: 0.95rem;">
                            💾 Enregistrer mes coordonnées
                        </button>
                    </form>
                </div>
            </div>

            <!-- RACCOURCIS & ACTIVITÉ -->
            <div class="account-group" style="background: var(--bg-card); border-radius: 20px; border: 1px solid var(--border); overflow: hidden; margin-bottom: 1.5rem; box-shadow: var(--shadow-sm);">
                <div class="account-group-title" style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-secondary); padding: 1rem 1.25rem 0.5rem;">Services &amp; Raccourcis</div>
                
                <div class="account-item-row" onclick="router.navigate('/favorites')">
                    <div class="account-item-left">
                        <span class="account-item-icon"><i class="ri-heart-3-line"></i></span>
                        <span>Mes restaurants favoris</span>
                    </div>
                    <span class="account-item-arrow"><i class="ri-arrow-right-s-line"></i></span>
                </div>

                <div class="account-item-row" onclick="router.navigate('/tracking')">
                    <div class="account-item-left">
                        <span class="account-item-icon"><i class="ri-file-list-3-line"></i></span>
                        <span>Suivi de commande en direct</span>
                    </div>
                    <span class="account-item-arrow"><i class="ri-arrow-right-s-line"></i></span>
                </div>

                <div class="account-item-row" onclick="showPaymentMethodsModal()">
                    <div class="account-item-left">
                        <span class="account-item-icon"><i class="ri-bank-card-line"></i></span>
                        <span>Moyens de paiement acceptés (Wave, Orange Money)</span>
                    </div>
                    <span class="account-item-arrow"><i class="ri-arrow-right-s-line"></i></span>
                </div>

                <div class="account-item-row" onclick="showPromoDiscountsModal()">
                    <div class="account-item-left">
                        <span class="account-item-icon"><i class="ri-coupon-3-line"></i></span>
                        <span>Bons plans &amp; Réductions</span>
                    </div>
                    <span class="account-item-arrow"><i class="ri-arrow-right-s-line"></i></span>
                </div>
            </div>

            <!-- EFFACER DONNÉES LOCALES -->
            <div class="account-group" style="background: var(--bg-card); border-radius: 20px; border: 1px solid var(--border); overflow: hidden; box-shadow: var(--shadow-sm);">
                <div class="account-item-row" onclick="clearLocalCustomerData()" style="color: var(--danger);">
                    <div class="account-item-left" style="color: var(--danger);">
                        <span class="account-item-icon" style="color: var(--danger);"><i class="ri-delete-bin-line"></i></span>
                        <span style="font-weight: 700;">Effacer mes données locales</span>
                    </div>
                    <span class="account-item-arrow" style="color: var(--danger);"><i class="ri-arrow-right-s-line"></i></span>
                </div>
            </div>
        </div>
    `;
});

window.toggleProfileEditForm = function() {
    const card = document.getElementById('profile-edit-card');
    const input = document.getElementById('profile-name');
    if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (input) {
            setTimeout(() => input.focus(), 250);
        }
    }
};

window.showPaymentMethodsModal = function() {
    alertModal("Moyens de Paiement & Modalités", `
        <div style="text-align: left; padding: 0.5rem 0;">
            <p style="margin-bottom: 1rem; color: var(--text-secondary); font-size: 0.92rem; line-height: 1.5;">
                Deux modalités transparentes et pratiques sont disponibles pour régler vos commandes sur <strong>THIES Resto</strong> :
            </p>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                <div style="padding: 0.85rem; background: var(--bg-input); border-radius: 12px; display: flex; align-items: flex-start; gap: 0.75rem; border: 1px solid var(--border);">
                    <span style="font-size: 1.5rem; margin-top: 2px;">💵</span>
                    <div>
                        <strong style="color: var(--text-primary); font-size: 0.95rem;">1. Espèces à la Livraison (Cash on Delivery)</strong>
                        <div style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 0.25rem; line-height: 1.4;">
                            Règlement en liquide de la totalité (plats + livraison) remis en main propre au livreur ou au comptoir lors du retrait.
                        </div>
                    </div>
                </div>
                <div style="padding: 0.85rem; background: var(--bg-input); border-radius: 12px; display: flex; align-items: flex-start; gap: 0.75rem; border: 1px solid var(--border);">
                    <span style="font-size: 1.5rem; margin-top: 2px;">🌊</span>
                    <div>
                        <strong style="color: var(--text-primary); font-size: 0.95rem;">2. Paiement d'Avance ou à Réception (Wave / Orange Money)</strong>
                        <div style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 0.25rem; line-height: 1.4;">
                            • <strong>Paiement d'avance :</strong> Effectuez votre transfert Wave direct vers le numéro WhatsApp officiel du restaurant pour lancer la commande sans manipulation d'argent liquide.<br>
                            • <strong>À réception :</strong> Scannez le QR Code Wave du livreur lors de la remise du repas.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);
};

window.showPromoDiscountsModal = function() {
    alertModal("Bons Plans & Réductions", `
        <div style="text-align: left; padding: 0.5rem 0;">
            <div style="background: linear-gradient(135deg, #F26B21, #D95A14); color: white; padding: 1.25rem; border-radius: 16px; margin-bottom: 1rem; box-shadow: 0 4px 15px rgba(242,107,33,0.3);">
                <div style="font-size: 0.8rem; font-weight: 800; background: #FEF3C7; color: #92400E; display: inline-block; padding: 2px 8px; border-radius: 10px; margin-bottom: 0.5rem;">OFFRE DU JOUR</div>
                <h3 style="margin: 0 0 0.25rem; font-size: 1.2rem; color: white;">Jusqu'à -40% sur vos menus</h3>
                <p style="margin: 0; font-size: 0.85rem; opacity: 0.9;">Commandez directement auprès de nos restaurants partenaires à Thiès sans intermédiaire.</p>
            </div>
            <p style="color: var(--text-secondary); font-size: 0.9rem;">
                💡 Les réductions sont directement appliquées sur les tarifs affichés dans les menus des restaurants partenaires.
            </p>
        </div>
    `);
};

window.clearLocalCustomerData = function() {
    if (confirm("Voulez-vous vraiment effacer vos coordonnées locales et vos favoris ?")) {
        localStorage.removeItem('customerName');
        localStorage.removeItem('customerPhone');
        localStorage.removeItem('customerAddress');
        localStorage.removeItem('customerEmail');
        localStorage.removeItem('THIES_FAVORITES');
        localStorage.removeItem('THIES_ORDER_HISTORY');
        showToast("Données locales effacées avec succès", "success");
        router.navigate('/profile');
    }
};

window.saveProfile = function(e) {
    e.preventDefault();
    const name = document.getElementById('profile-name').value.trim();
    const phone = document.getElementById('profile-phone').value.trim();
    const address = document.getElementById('profile-address').value.trim();
    
    if (typeof customerAuth !== 'undefined') {
        customerAuth.login({ phone, name, address });
    } else {
        if (name) localStorage.setItem('customerName', name);
        if (phone) localStorage.setItem('customerPhone', phone);
        if (address) localStorage.setItem('customerAddress', address);
        showToast("Profil enregistré avec succès !", "success");
    }
    
    router.navigate('/profile');
};

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
// Social Proof Logic
// ----------------------------------------------------
let socialProofInterval = null;
window.startSocialProof = function() {
    if (socialProofInterval) clearInterval(socialProofInterval);
    const toast = document.getElementById('social-proof-toast');
    if (!toast) return;

    const names = ['Fatou', 'Ousmane', 'Awa', 'Mamadou', 'Aminata', 'Cheikh', 'Ndeye', 'Ibrahima', 'Khadija', 'Fallou'];
    const actions = [
        (name, resto, dish) => `<strong>${name}</strong> a commandé <em>${dish}</em> chez <strong>${resto}</strong>`,
        (name, resto, dish) => `<strong>${name}</strong> a gagné +5 points fidélité chez <strong>${resto}</strong>`,
        (name, resto, dish) => `<strong>${name}</strong> a réservé une table chez <strong>${resto}</strong>`
    ];
    
    const allDishes = [];
    store.getRestaurants().filter(r => r.status === 'active').forEach(r => {
        if(r.menu && Array.isArray(r.menu)) {
            r.menu.forEach(c => {
                if(c.items && Array.isArray(c.items)) {
                    c.items.forEach(i => allDishes.push({ dish: i.name, resto: r.name }));
                }
            });
        }
    });

    if(allDishes.length === 0) return;

    socialProofInterval = setInterval(() => {
        // Stop if not on home page
        if (window.location.hash !== '' && window.location.hash !== '#/') {
            return;
        }

        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomDishItem = allDishes[Math.floor(Math.random() * allDishes.length)];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        const minutes = Math.floor(Math.random() * 5) + 1;
        
        toast.innerHTML = `
            <div style="background: rgba(207,168,83,0.15); padding: 10px; border-radius: 50%; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; height: 40px; width: 40px; flex-shrink: 0;">🔥</div>
            <div>
                <p style="margin: 0; font-size: 0.85rem; font-weight: 400; line-height: 1.3;">${randomAction(randomName, randomDishItem.resto, randomDishItem.dish)}</p>
                <p style="margin: 0; font-size: 0.75rem; color: var(--accent); margin-top: 3px; font-weight: bold;">Il y a ${minutes} min</p>
            </div>
        `;
        
        toast.style.display = 'flex';
        // Force reflow
        void toast.offsetWidth;
        toast.style.opacity = '1';
        
        // Hide after 5 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if(toast.style.opacity === '0') toast.style.display = 'none';
            }, 500);
        }, 5000);
        
    }, 12000 + Math.random() * 8000); // Randomly between 12s and 20s
}

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

                <h3 style="color: var(--text-primary); margin-top: 1rem; font-size: 1.1rem;">3.3 Politique d'Annulation et de Remboursement</h3>
                <p>Étant donné que les paiements s'effectuent à la livraison, THIES Resto ne procède à <strong>aucun remboursement</strong>. Toute demande d'annulation de commande doit être formulée directement auprès du restaurant (via WhatsApp ou par appel) dans les plus brefs délais avant la préparation du repas. Si le repas livré n'est pas conforme, le litige commercial et la demande de dédommagement se règlent exclusivement entre le client et le restaurant partenaire.</p>

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

    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
    
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

// ==================== SORTING & REALTIME LOGIC ====================
document.addEventListener('DOMContentLoaded', () => {
    // Setup Supabase Realtime
    if (typeof setupRealtime === 'function') {
        setupRealtime();
    }
    
    setTimeout(() => {
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                activeSortBy = e.target.value;
                if (typeof applyFilters === 'function') {
                    applyFilters();
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

// ============================================
// REALTIME WEBSOCKET — Mise à jour live des plats
// ============================================
// Quand un restaurateur change un prix ou désactive un plat,
// les clients qui ont la page ouverte voient le changement en direct.
if (typeof supabaseClient !== 'undefined' && supabaseClient) {
    const menuRealtimeChannel = supabaseClient
        .channel('realtime-menu-items')
        .on('postgres_changes', 
            { event: 'UPDATE', schema: 'public', table: 'menu_items' },
            (payload) => {
                const updated = payload.new;
                if (!updated) return;
                
                console.log('🔄 Realtime: menu_item mis à jour:', updated.name, '→', updated.is_available ? 'Disponible' : 'Rupture');
                
                // 1. Mettre à jour le cache local
                const resto = store.data.restaurants.find(r => r.id === updated.restaurant_id);
                if (resto && resto.menu) {
                    const menuItem = resto.menu.find(m => m.id === updated.id);
                    if (menuItem) {
                        menuItem.price = updated.price;
                        menuItem.available = updated.is_available;
                        menuItem.name = updated.name || menuItem.name;
                    }
                }
                
                // 2. Griser/dégriser le plat en direct dans le DOM (sans recharger la page)
                const itemCard = document.querySelector(`[data-menu-item-id="${updated.id}"]`);
                if (itemCard) {
                    if (!updated.is_available) {
                        itemCard.style.opacity = '0.4';
                        itemCard.style.filter = 'grayscale(100%)';
                        itemCard.style.pointerEvents = 'none';
                        // Ajouter un badge "Épuisé"
                        if (!itemCard.querySelector('.realtime-badge')) {
                            const badge = document.createElement('div');
                            badge.className = 'realtime-badge';
                            badge.style.cssText = 'position:absolute;top:10px;left:10px;background:var(--danger);color:white;padding:4px 10px;border-radius:20px;font-size:0.75rem;font-weight:700;z-index:5;';
                            badge.textContent = 'ÉPUISÉ';
                            itemCard.style.position = 'relative';
                            itemCard.appendChild(badge);
                        }
                    } else {
                        itemCard.style.opacity = '1';
                        itemCard.style.filter = 'none';
                        itemCard.style.pointerEvents = 'auto';
                        const oldBadge = itemCard.querySelector('.realtime-badge');
                        if (oldBadge) oldBadge.remove();
                    }
                    
                    // Mettre à jour le prix affiché
                    const priceEl = itemCard.querySelector('.item-price, [data-price]');
                    if (priceEl) {
                        priceEl.textContent = Number(updated.price).toLocaleString() + ' FCFA';
                    }
                }
                
                // 3. Notification discrète pour le client
                if (typeof showToast === 'function') {
                    if (!updated.is_available) {
                        showToast(`"${updated.name}" est maintenant en rupture de stock`, "warning");
                    }
                }
            }
        )
        .subscribe();
    
    console.log('📡 Realtime menu_items : Abonnement activé');
}

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
            <button class="btn btn-secondary btn-sm" onclick="router.navigate('/auth')" title="Espace Resto / Connexion Restaurateur" aria-label="Espace Resto" style="display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.45rem 0.9rem; border-radius: 12px; font-weight: 600; font-size: 0.85rem;">
                <span style="font-size: 1.05rem; line-height: 1;">🏪</span>
                <span>Espace Resto</span>
            </button>
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
    updateNavbar();
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

// ==================== PHASE 4: SEO & JSON-LD ====================
function updateSEO(pageType, data) {
    let oldScript = document.getElementById('seo-json-ld');
    if (oldScript) oldScript.remove();

    let schema = {};

    if (pageType === 'home') {
        setDynamicMeta('THIES Resto — Plateforme de Restauration Commune à Thiès', 'icon.png');
        schema = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "THIES Resto",
            "url": "https://thies-resto.com/",
            "description": "L'application n°1 pour commander à manger et se faire livrer à Thiès."
        };
    } else if (pageType === 'restaurant' && data) {
        setDynamicMeta(`Menu de ${data.name} - Livraison à Thiès`, data.coverImage || 'icon.png');
        
        let menuItemsSchema = [];
        if (data.menu && data.menu.length > 0) {
            menuItemsSchema = data.menu.map(item => ({
                "@type": "MenuItem",
                "name": item.name,
                "description": item.description,
                "offers": { "@type": "Offer", "price": item.price, "priceCurrency": "XOF" }
            }));
        }

        schema = {
            "@context": "https://schema.org",
            "@type": "Restaurant",
            "name": data.name,
            "image": data.coverImage || "https://thies-resto.com/icon.png",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Thiès",
                "addressCountry": "SN",
                "streetAddress": data.address || "Thiès"
            },
            "servesCuisine": data.category,
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": data.rating || "4.5",
                "reviewCount": data.reviewsCount || "10"
            },
            "hasMenu": {
                "@type": "Menu",
                "name": `Menu de ${data.name}`,
                "hasMenuItem": menuItemsSchema
            }
        };
    }

    const script = document.createElement('script');
    script.id = 'seo-json-ld';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
}


// ==================== MOBILE NAVIGATION & UI HELPERS ====================
window.scrollToCatalog = function() {
    if (window.location.hash !== '#/') {
        router.navigate('/');
        setTimeout(function() {
            var section = document.getElementById('catalog-section');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
        }, 500);
    } else {
        var section = document.getElementById('catalog-section');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
    }
};

window.openCartTab = function() {
    if (cart && cart.restaurantId && cart.items.length > 0) {
        const r = store.getRestaurantById(cart.restaurantId);
        if (r) {
            if (!window.location.hash.startsWith('#/r/' + r.slug)) {
                router.navigate('/r/' + r.slug);
                setTimeout(() => {
                    if (typeof switchRestoTab === 'function') {
                        switchRestoTab('checkout');
                    }
                }, 100);
            } else {
                if (typeof switchRestoTab === 'function') {
                    switchRestoTab('checkout');
                }
            }
            return;
        }
    }
    
    if (typeof switchRestoTab === 'function' && document.getElementById('panel-checkout')) {
        switchRestoTab('checkout');
    } else {
        showToast("Votre panier est vide. Choisissez un restaurant !", "warning");
        if (typeof scrollToCatalog === 'function') scrollToCatalog();
    }
};

// ---------- PUSH NOTIFICATIONS ----------
window.requestPushNotifications = function() {
    if (!("Notification" in window)) {
        showToast("Ce navigateur ne supporte pas les notifications système", "danger");
        return;
    }
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            showToast("Notifications activées ! Vous serez alerté des nouvelles commandes.", "success");
            new Notification("THIES Resto", { body: "Les notifications fonctionnent parfaitement !", icon: "icon.png" });
        } else {
            showToast("Les notifications sont bloquées ou refusées.", "warning");
        }
    });
};

// ==================== SUPABASE REALTIME ====================
let globalOrderSubscription = null;
window._notifiedOrderStatuses = window._notifiedOrderStatuses || {};

window.setupRealtime = function() {
    if (typeof supabaseClient === 'undefined' || !supabaseClient) {
        if (!window._supabaseRetryTimer) {
            window._supabaseRetryTimer = setTimeout(() => {
                window._supabaseRetryTimer = null;
                window.setupRealtime();
            }, 1000);
        }
        return;
    }
    if (globalOrderSubscription) return; // Already subscribed

    console.log('[Supabase Realtime] Initializing global orders listener...');

    try {
        globalOrderSubscription = supabaseClient
            .channel('public:orders:realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => {
                console.log('[Supabase Realtime Order Event]:', payload.eventType, payload);
                
                const eventType = payload.eventType;
                const newOrder = payload.new;
                if (!newOrder) return;

                const orderId = String(newOrder.id || '');
                const newStatus = (newOrder.status || '').trim();
                const orderPhone = cleanPhoneNumber(newOrder.customer_phone || '');

                // Identify user phone credentials from local and session storage
                const storedCustomerPhone = cleanPhoneNumber(localStorage.getItem('customerPhone') || '');
                const storedUserPhone = cleanPhoneNumber(localStorage.getItem('user_phone') || sessionStorage.getItem('user_phone') || '');
                const activeProfilePhone = cleanPhoneNumber(document.getElementById('profile-phone')?.value || '');
                const activeTrackingPhone = cleanPhoneNumber(document.getElementById('tracking-phone')?.value || '');
                const trackingOrderId = String(localStorage.getItem('trackingOrderId') || '');

                // Check local order history
                let myHistory = [];
                try {
                    myHistory = JSON.parse(localStorage.getItem('THIES_ORDER_HISTORY') || '[]');
                } catch (e) { myHistory = []; }

                const isInHistory = myHistory.some(o => String(o.id) === orderId);
                const isMatchingPhone = Boolean(
                    (storedCustomerPhone && orderPhone && (orderPhone.endsWith(storedCustomerPhone.slice(-9)) || storedCustomerPhone.endsWith(orderPhone.slice(-9)))) ||
                    (storedUserPhone && orderPhone && (orderPhone.endsWith(storedUserPhone.slice(-9)) || storedUserPhone.endsWith(orderPhone.slice(-9)))) ||
                    (activeProfilePhone && orderPhone && (orderPhone.endsWith(activeProfilePhone.slice(-9)) || activeProfilePhone.endsWith(orderPhone.slice(-9)))) ||
                    (activeTrackingPhone && orderPhone && (orderPhone.endsWith(activeTrackingPhone.slice(-9)) || activeTrackingPhone.endsWith(orderPhone.slice(-9))))
                );
                const isTrackingCurrent = Boolean(trackingOrderId && (trackingOrderId === orderId));

                const isUserOrder = isInHistory || isMatchingPhone || isTrackingCurrent;

                // --- 1. IN-APP TOAST NOTIFICATION FOR USERS ON ORDER STATUS UPDATE ---
                if (isUserOrder && eventType === 'UPDATE' && newStatus) {
                    const lastStatus = window._notifiedOrderStatuses[orderId];
                    
                    if (lastStatus !== newStatus) {
                        window._notifiedOrderStatuses[orderId] = newStatus;

                        // Synchronize updated status in local order history
                        try {
                            let history = JSON.parse(localStorage.getItem('THIES_ORDER_HISTORY') || '[]');
                            let updated = false;
                            history.forEach(item => {
                                if (String(item.id) === orderId) {
                                    item.status = newStatus;
                                    updated = true;
                                }
                            });
                            if (updated) {
                                localStorage.setItem('THIES_ORDER_HISTORY', JSON.stringify(history));
                            }
                        } catch (e) {}

                        // Synchronize status in memory store
                        if (typeof store !== 'undefined' && store.data && Array.isArray(store.data.orders)) {
                            const localOrder = store.data.orders.find(o => String(o.id) === orderId);
                            if (localOrder) localOrder.status = newStatus;
                        }

                        // Determine restaurant brand name
                        const restaurant = (typeof store !== 'undefined' && store.getRestaurantById) 
                            ? store.getRestaurantById(newOrder.restaurant_id) 
                            : null;
                        const historyItem = myHistory.find(o => String(o.id) === orderId);
                        const restaurantName = restaurant?.name || historyItem?.restaurantName || 'votre restaurant';

                        // Play audio chime and haptics
                        playNotificationSound();
                        if (navigator.vibrate) {
                            try { navigator.vibrate([120, 60, 120]); } catch (e) {}
                        }

                        // Build friendly status message & toast configuration
                        let toastTitle = '🔔 Suivi de Commande';
                        let toastMessage = `Votre commande n°${orderId} chez ${restaurantName} est : ${newStatus}`;
                        let toastType = 'info';
                        let toastIcon = '🔔';

                        if (newStatus === 'Reçue') {
                            toastTitle = '📥 Commande Reçue & Acceptée !';
                            toastMessage = `Le restaurant ${restaurantName} a bien validé la réception de votre commande n°${orderId}.`;
                            toastType = 'info';
                            toastIcon = '📥';
                        } else if (newStatus === 'Confirmée' || newStatus === 'En préparation' || newStatus === 'En cuisine') {
                            toastTitle = '👨‍🍳 Commande En Cuisine !';
                            toastMessage = `Excellente nouvelle ! Votre commande n°${orderId} chez ${restaurantName} est en cours de préparation en cuisine.`;
                            toastType = 'info';
                            toastIcon = '👨‍🍳';
                        } else if (newStatus === 'Prêt pour livraison' || newStatus === 'Prête') {
                            toastTitle = '📦 Prêt pour Livraison !';
                            toastMessage = `Vos plats chez ${restaurantName} sont prêts et emballés pour la livraison !`;
                            toastType = 'success';
                            toastIcon = '📦';
                        } else if (newStatus === 'En cours de livraison' || newStatus === 'En livraison' || newStatus === 'Partie en livraison') {
                            toastTitle = '🛵 Commande en Route !';
                            toastMessage = `Le livreur est en route avec votre repas chaud de ${restaurantName} !`;
                            toastType = 'info';
                            toastIcon = '🛵';
                        } else if (newStatus === 'Livrée') {
                            toastTitle = '🎉 Commande Livrée !';
                            toastMessage = `Votre commande n°${orderId} chez ${restaurantName} a été livrée. Bon appétit ! 🍽️`;
                            toastType = 'success';
                            toastIcon = '✅';
                        } else if (newStatus === 'Annulée') {
                            toastTitle = '⚠️ Commande Annulée';
                            toastMessage = `Votre commande n°${orderId} chez ${restaurantName} a été annulée par le restaurant.`;
                            toastType = 'danger';
                            toastIcon = '✕';
                        }

                        // Also trigger system/desktop Web Notification if tab is hidden/backgrounded
                        if (typeof Notification !== 'undefined' && Notification.permission === 'granted' && document.hidden) {
                            try {
                                new Notification(toastTitle, {
                                    body: toastMessage,
                                    icon: '/favicon.ico',
                                    badge: '/favicon.ico'
                                });
                            } catch (e) {}
                        }

                        // Trigger rich in-app toast notification with interactive track button
                        if (typeof showToast === 'function') {
                            showToast(toastMessage, toastType, {
                                title: toastTitle,
                                icon: toastIcon,
                                duration: 7500,
                                actionText: 'Suivre',
                                onAction: () => {
                                    const targetPhone = orderPhone || storedCustomerPhone || storedUserPhone;
                                    if (targetPhone) {
                                        localStorage.setItem('trackingOrderId', orderId);
                                        localStorage.setItem('customerPhone', targetPhone);
                                    }
                                    if (typeof router !== 'undefined' && router.navigate) {
                                        router.navigate('/tracking');
                                        setTimeout(() => {
                                            const phoneInput = document.getElementById('tracking-phone');
                                            if (phoneInput && targetPhone) {
                                                phoneInput.value = targetPhone;
                                                if (typeof window.fetchOrderTracking === 'function') {
                                                    window.fetchOrderTracking();
                                                }
                                            }
                                        }, 200);
                                    }
                                }
                            });
                        }

                        // Live UI Updates: if user is currently viewing the tracking screen
                        if (window.location.hash === '#/tracking' && typeof window.fetchOrderTracking === 'function') {
                            window.fetchOrderTracking();
                        }
                    }
                }

                // --- 2. RESTAURATEUR DASHBOARD REALTIME ---
                if (eventType === 'INSERT') {
                    // Planifier le déclenchement de vérification à 10 minutes précises
                    setTimeout(() => {
                        if (typeof window.checkUntreatedOrdersFor10MinAlert === 'function') {
                            window.checkUntreatedOrdersFor10MinAlert();
                        }
                    }, 10 * 60 * 1000 + 1000);
                }

                if (window.location.hash === '#/dashboard' && typeof currentRestaurantSession !== 'undefined' && currentRestaurantSession) {
                    if (newOrder.restaurant_id === currentRestaurantSession.id) {
                        if (eventType === 'INSERT') {
                            playNotificationSound();
                            if (typeof showToast === 'function') {
                                showToast(`🔔 NOUVELLE COMMANDE REÇUE : #${orderId} (${newOrder.total || 0} FCFA)`, "success", {
                                    title: "Nouvelle Commande !",
                                    duration: 8000
                                });
                            }
                        } else if (eventType === 'UPDATE') {
                            if (newStatus === 'Livrée' || newStatus === 'Livré') {
                                playNotificationSound();
                                if (typeof showToast === 'function') {
                                    showToast(`🎉 Le client a confirmé la bonne réception de la commande #${orderId} ! Statut : Livrée.`, "success", {
                                        title: "📦 Commande Réceptionnée & Livrée !",
                                        icon: "✅",
                                        duration: 8500
                                    });
                                }
                            } else {
                                if (typeof showToast === 'function') {
                                    showToast(`Commande #${orderId} mise à jour : ${newStatus}`, "info");
                                }
                            }
                        }

                        if (typeof store !== 'undefined' && store.syncFromSupabase) {
                            store.syncFromSupabase().then(() => {
                                if (typeof renderDashboardTabContent === 'function') {
                                    renderDashboardTabContent(currentRestaurantSession);
                                }
                                if (typeof window.checkUntreatedOrdersFor10MinAlert === 'function') {
                                    window.checkUntreatedOrdersFor10MinAlert();
                                }
                            });
                        }
                    }
                }

                // --- 3. SUPER ADMIN DASHBOARD REALTIME ---
                if (window.location.hash === '#/admin' && typeof isSuperAdminSession !== 'undefined' && isSuperAdminSession) {
                    if (eventType === 'INSERT') {
                        playNotificationSound();
                        if (typeof showToast === 'function') {
                            showToast(`Nouvelle commande globale #${orderId} (${newOrder.total || 0} FCFA)`, "info", {
                                title: "Super Admin"
                            });
                        }
                    }
                    if (typeof loadAllAdminOrders === 'function') {
                        loadAllAdminOrders();
                    }
                }
            })
            .subscribe((status, err) => {
                console.log('[Supabase Realtime Orders] Channel Status:', status, err || '');
            });
    } catch (e) {
        console.warn("[Supabase Realtime] Setup error:", e);
    }
};

// Global Listener for local and push order status changes to notify client
window.addEventListener('thies:order-status-changed', (e) => {
    try {
        const detail = e.detail || {};
        const order = detail.order || {};
        const orderId = String(detail.orderId || order.id || '');
        const newStatus = detail.newStatus || order.status || '';
        const restoName = detail.restaurantName || order.restaurantName || 'votre restaurant';

        // Check if this device is related to this order
        const trackingOrderId = String(localStorage.getItem('trackingOrderId') || '');
        const storedCustomerPhone = String(localStorage.getItem('customerPhone') || '');
        let myHistory = [];
        try {
            myHistory = JSON.parse(localStorage.getItem('THIES_ORDER_HISTORY') || '[]');
        } catch (err) { myHistory = []; }

        const isInHistory = myHistory.some(o => String(o.id) === orderId);
        const isTracking = trackingOrderId && (trackingOrderId === orderId);
        const orderPhone = String(order.customerPhone || order.customer_phone || '');
        const isMatchingPhone = storedCustomerPhone && orderPhone && (storedCustomerPhone.slice(-9) === orderPhone.slice(-9));

        if (isInHistory || isTracking || isMatchingPhone) {
            // Jouer le son et retour haptique
            if (typeof window.playNotificationSound === 'function') {
                window.playNotificationSound();
            }
            if (navigator.vibrate) {
                try { navigator.vibrate([120, 60, 120]); } catch (err) {}
            }

            let toastTitle = detail.title || '🔔 Suivi de Commande';
            let toastMessage = detail.body || `Votre commande n°${orderId} chez ${restoName} est : ${newStatus}`;
            let toastType = (newStatus === 'Livrée' || newStatus === 'Livré' || newStatus === 'Prêt pour livraison') ? 'success' : (newStatus === 'Annulée' ? 'danger' : 'info');

            if (typeof showToast === 'function') {
                showToast(toastMessage, toastType, {
                    title: toastTitle,
                    duration: 7500,
                    actionText: 'Suivre',
                    onAction: () => {
                        if (orderId) localStorage.setItem('trackingOrderId', orderId);
                        if (typeof router !== 'undefined' && router.navigate) {
                            router.navigate('/tracking');
                            setTimeout(() => {
                                if (typeof window.fetchOrderTracking === 'function') window.fetchOrderTracking();
                            }, 200);
                        }
                    }
                });
            }

            // Rafraîchir l'écran de suivi si le client est actuellement dessus
            if (window.location.hash === '#/tracking' && typeof window.fetchOrderTracking === 'function') {
                window.fetchOrderTracking();
            }
        }
    } catch (listenerErr) {
        console.warn("thies:order-status-changed listener error:", listenerErr);
    }
});

window.playNotificationSound = function() {
    try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(e => console.warn("Audio play requires user interaction first", e));
    } catch(e) {
        console.error("Audio play failed:", e);
    }
};

// ---------- ALARME AUDIO D'URGENCE POUR COMMANDE EN ATTENTE (+10 MIN) ----------
window.playUrgentReminderSound = function() {
    try {
        // 1. Jouer le son de notification standard
        if (typeof window.playNotificationSound === 'function') {
            window.playNotificationSound();
        }
        // 2. Synthétiseur acoustique d'alerte Web Audio API (haute fiabilité sans dépendance externe)
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
            const ctx = new AudioCtx();
            const now = ctx.currentTime;
            
            // Premier bip d'urgence (880 Hz)
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(880, now);
            gain1.gain.setValueAtTime(0.3, now);
            gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.start(now);
            osc1.stop(now + 0.18);
            
            // Deuxième bip plus aigu (1174 Hz)
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(1174.66, now + 0.22);
            gain2.gain.setValueAtTime(0.35, now + 0.22);
            gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.42);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start(now + 0.22);
            osc2.stop(now + 0.42);

            // Troisième tonalité accentuée (1318 Hz)
            const osc3 = ctx.createOscillator();
            const gain3 = ctx.createGain();
            osc3.type = 'triangle';
            osc3.frequency.setValueAtTime(1318.51, now + 0.46);
            gain3.gain.setValueAtTime(0.4, now + 0.46);
            gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
            osc3.connect(gain3);
            gain3.connect(ctx.destination);
            osc3.start(now + 0.46);
            osc3.stop(now + 0.75);
        }
    } catch(e) {
        console.warn("Urgent alarm synth notice:", e);
    }
};

// ---------- GESTIONNAIRE D'ANCIENNETÉ ET NOTIFICATIONS COMMANDES NON TRAITÉES (+10 MIN) ----------
window.getOrderTimestamp = function(order) {
    if (!order) return Date.now();
    if (typeof order.timestamp === 'number' && !isNaN(order.timestamp) && order.timestamp > 0) {
        return order.timestamp;
    }
    if (order.createdAt || order.created_at) {
        const d = new Date(order.createdAt || order.created_at);
        if (!isNaN(d.getTime())) return d.getTime();
    }
    if (order.date && order.time) {
        try {
            const cleanTime = String(order.time).trim();
            const [h, m] = cleanTime.split(':');
            const d = new Date(order.date);
            if (!isNaN(d.getTime())) {
                d.setHours(Number(h) || 12, Number(m) || 0, 0, 0);
                return d.getTime();
            }
        } catch (e) {}
    }
    if (order.date) {
        const d = new Date(order.date);
        if (!isNaN(d.getTime())) return d.getTime();
    }
    return Date.now();
};

window.isOrderUntreated = function(order) {
    if (!order) return false;
    const status = String(order.status || '').trim();
    return status === 'En attente' || status === 'Reçue' || status === 'pending';
};

window.getUntreatedElapsedMinutes = function(order) {
    const ts = window.getOrderTimestamp(order);
    const diffMs = Date.now() - ts;
    return Math.max(0, Math.floor(diffMs / 60000));
};

window.checkUntreatedOrdersFor10MinAlert = function() {
    if (typeof store === 'undefined' || !store.data || !Array.isArray(store.data.orders)) return;

    let ordersToCheck = store.data.orders;
    
    // Si un restaurant est connecté, on cible ses commandes
    if (typeof currentRestaurantSession !== 'undefined' && currentRestaurantSession && currentRestaurantSession.id) {
        ordersToCheck = ordersToCheck.filter(o => o.restaurantId === currentRestaurantSession.id);
    }

    let notifiedMap = {};
    try {
        notifiedMap = JSON.parse(localStorage.getItem('THIES_10MIN_NOTIFIED_ORDERS') || '{}');
    } catch(e) { notifiedMap = {}; }

    let hasNewAlert = false;

    ordersToCheck.forEach(order => {
        if (window.isOrderUntreated(order)) {
            const elapsed = window.getUntreatedElapsedMinutes(order);
            if (elapsed >= 10) {
                const orderKey = String(order.id);
                
                // Si pas encore notifié pour le seuil des 10 minutes
                if (!notifiedMap[orderKey]) {
                    notifiedMap[orderKey] = Date.now();
                    hasNewAlert = true;

                    const restaurant = store.getRestaurantById ? store.getRestaurantById(order.restaurantId) : null;
                    const restoName = restaurant ? restaurant.name : (currentRestaurantSession ? currentRestaurantSession.name : 'Votre Restaurant');

                    console.warn(`[Alerte 10 min] Commande #${order.id} non traitée depuis ${elapsed} minutes chez ${restoName} !`);

                    // 1. Notification Push Système Navigateur (Web Push API)
                    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                        try {
                            const notif = new Notification("⚠️ RAPPEL : Commande non traitée (+10 min)", {
                                body: `La commande #${order.id} (${Number(order.total || 0).toLocaleString()} FCFA) chez ${restoName} attend d'être traitée depuis ${elapsed} minutes !`,
                                icon: 'icon.png',
                                badge: 'icon.png',
                                tag: `unprocessed-10min-${order.id}`,
                                requireInteraction: true
                            });
                            notif.onclick = function() {
                                window.focus();
                                if (typeof router !== 'undefined' && router.navigate) {
                                    router.navigate('/dashboard');
                                }
                                if (typeof switchDashboardTab === 'function') {
                                    switchDashboardTab('orders');
                                }
                            };
                        } catch(e) {
                            console.warn("Native notification push error:", e);
                        }
                    }

                    // 2. Notification Push OneSignal si configuré
                    if (typeof OneSignalManager !== 'undefined' && OneSignalManager.sendUnprocessedOrderNotification) {
                        OneSignalManager.sendUnprocessedOrderNotification(order, restoName);
                    }

                    // 3. Alarme sonore d'urgence
                    window.playUrgentReminderSound();
                    if (navigator.vibrate) {
                        try { navigator.vibrate([250, 100, 250, 100, 400]); } catch(e) {}
                    }

                    // 4. Toast d'alerte haute priorité avec bouton d'action directe
                    if (typeof showToast === 'function') {
                        showToast(`⚠️ URGENT : La commande #${order.id} (${order.customerName || 'Client'}) attend depuis ${elapsed} minutes sans traitement !`, "danger", {
                            title: "🚨 Commande Non Traitée (>10 min)",
                            icon: "⏰",
                            duration: 12000,
                            actionText: "Traiter Immédiatement",
                            onAction: () => {
                                if (typeof router !== 'undefined' && router.navigate) {
                                    router.navigate('/dashboard');
                                }
                                if (typeof switchDashboardTab === 'function') {
                                    switchDashboardTab('orders');
                                }
                            }
                        });
                    }
                }
            }
        }
    });

    if (hasNewAlert) {
        try {
            localStorage.setItem('THIES_10MIN_NOTIFIED_ORDERS', JSON.stringify(notifiedMap));
        } catch(e) {}
    }
};

// Démarrer la surveillance automatique toutes les 20 secondes
if (!window._unprocessedOrderInterval) {
    window._unprocessedOrderInterval = setInterval(() => {
        if (typeof window.checkUntreatedOrdersFor10MinAlert === 'function') {
            window.checkUntreatedOrdersFor10MinAlert();
        }
    }, 20000);
}

// Surveillance au réveil de l'onglet
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && typeof window.checkUntreatedOrdersFor10MinAlert === 'function') {
        window.checkUntreatedOrdersFor10MinAlert();
    }
});
window.addEventListener('focus', () => {
    if (typeof window.checkUntreatedOrdersFor10MinAlert === 'function') {
        window.checkUntreatedOrdersFor10MinAlert();
    }
});
window.captureGPSCoordinates = function() {
    if ("geolocation" in navigator) {
        if(typeof showToast === 'function') showToast("Recherche GPS...", "info");
        navigator.geolocation.getCurrentPosition(pos => {
            document.getElementById('settings-lat').value = pos.coords.latitude;
            document.getElementById('settings-lng').value = pos.coords.longitude;
            if(typeof showToast === 'function') showToast("Coordonnées capturées !", "success");
        }, err => {
            if(typeof showToast === 'function') showToast("Veuillez autoriser la localisation.", "error");
        });
    } else {
        if(typeof showToast === 'function') showToast("Non supporté par le navigateur.", "error");
    }
};

// ==================== PWA INSTALLATION (A2HS) ====================
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    setTimeout(() => {
        const isInstalled = localStorage.getItem('pwa_installed');
        if (!isInstalled) {
            showInstallPromotion();
        }
    }, 5000);
});

function showInstallPromotion() {
    if (document.getElementById('pwa-install-banner')) return;
    
    const installBanner = document.createElement('div');
    installBanner.id = 'pwa-install-banner';
    installBanner.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--bg-card);
        color: var(--text-primary);
        padding: 1rem;
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        border: 2px solid var(--primary);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        width: 90%;
        max-width: 400px;
        animation: fadeUp 0.5s ease-out;
    `;
    installBanner.innerHTML = `
        <img src="icon.png" style="width: 50px; height: 50px; border-radius: 12px; border: 1px solid var(--border);">
        <div style="flex-grow: 1;">
            <strong style="display:block; margin-bottom: 0.25rem;">Installer THIES Resto</strong>
            <span style="font-size: 0.8rem; color: var(--text-secondary);">Pour commander en un clic !</span>
        </div>
        <button id="pwa-install-btn" class="btn btn-primary" style="padding: 0.5rem 1rem;">Installer</button>
        <button id="pwa-close-btn" style="background: none; border: none; color: var(--text-secondary); font-size: 1.5rem; cursor: pointer;">&times;</button>
    `;
    document.body.appendChild(installBanner);
    
    document.getElementById('pwa-install-btn').addEventListener('click', async () => {
        installBanner.remove();
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                localStorage.setItem('pwa_installed', 'true');
                if(typeof showToast === 'function') showToast("Merci d'avoir installé l'application !", "success");
            }
            deferredPrompt = null;
        }
    });
    
    document.getElementById('pwa-close-btn').addEventListener('click', () => {
        installBanner.remove();
        localStorage.setItem('pwa_installed', 'dismissed'); // Don't show again immediately
    });
}
window.addEventListener('appinstalled', () => {
    localStorage.setItem('pwa_installed', 'true');
    const banner = document.getElementById('pwa-install-banner');
    if (banner) banner.remove();
});

window.toggleDishAvailability = function(dishId, currentStatus) {
    if (!currentRestaurantSession) return;
    const newStatus = !currentStatus;
    const dish = currentRestaurantSession.menu.find(d => d.id === dishId);
    if (dish) dish.available = newStatus;
    
    store.updateRestaurantData(currentRestaurantSession.id, { menu: JSON.stringify(currentRestaurantSession.menu) }).then(() => {
        if (typeof supabaseClient !== 'undefined' && supabaseClient) {
            supabaseClient.from('menu_items').update({ is_available: newStatus }).eq('id', dishId).then(({error}) => {
                if (error) console.warn("Could not update menu_items table", error);
            });
        }
        if(typeof showToast === 'function') showToast(newStatus ? "Plat disponible !" : "Plat marqué en rupture.", newStatus ? "success" : "warning");
        renderDashboardTabContent(currentRestaurantSession);
    });
};

// Initialize app when data is ready
if (typeof store !== 'undefined' && store.syncPromise) {
    store.syncPromise.then(() => {
        if (typeof hideLoadingOverlay === 'function') hideLoadingOverlay();
        router.start();
    }).catch(err => {
        console.error("Failed to load initial data:", err);
        if (typeof hideLoadingOverlay === 'function') hideLoadingOverlay();
        router.start();
    });
} else {
    if (typeof hideLoadingOverlay === 'function') hideLoadingOverlay();
    router.start();
}

// ==================== PHASE 5: PWA INSTALLATION ====================
// deferredPrompt already declared
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    if(localStorage.getItem('pwa_install_dismissed')) return;

    let banner = document.getElementById('pwa-install-banner');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'pwa-install-banner';
        banner.innerHTML = `
            <div style="flex: 1;">
                <strong style="display:block; margin-bottom: 2px;">Installez Thies Resto 🚀</strong>
                <span style="font-size: 0.8rem; color: var(--text-secondary);">Pour commander plus rapidement.</span>
            </div>
            <div>
                <button class="btn btn-primary btn-sm" id="pwa-install-btn" style="margin-right: 5px;">Installer</button>
                <button class="btn btn-outline btn-sm" id="pwa-dismiss-btn" style="border:none; background:transparent; color:var(--text-secondary)">Plus tard</button>
            </div>
        `;
        banner.style.cssText = "position: fixed; bottom: 85px; left: 10px; right: 10px; background: var(--bg-card); padding: 15px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: space-between; z-index: 1000; border: 1px solid var(--primary);";
        document.body.appendChild(banner);
        
        document.getElementById('pwa-install-btn').addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                deferredPrompt = null;
                banner.remove();
            }
        });
        document.getElementById('pwa-dismiss-btn').addEventListener('click', () => {
            localStorage.setItem('pwa_install_dismissed', 'true');
            banner.remove();
        });
    }
});

// ==================== TERMS OF SERVICE (CGU) FLOATING ACCEPTANCE ====================
window.checkCGUConsent = function() {
    const isRefused = sessionStorage.getItem('thies_resto_cgu_refused') === 'true';
    const isAccepted = localStorage.getItem('thies_resto_cgu_accepted') === 'true';
    
    const refusedScreen = document.getElementById('cgu-refused-screen');
    const floatingOverlay = document.getElementById('cgu-floating-overlay');
    
    if (isRefused) {
        if (refusedScreen) refusedScreen.style.display = 'flex';
        if (floatingOverlay) floatingOverlay.style.display = 'none';
        return;
    }

    if (!isAccepted) {
        if (floatingOverlay) floatingOverlay.style.display = 'flex';
        if (refusedScreen) refusedScreen.style.display = 'none';
    } else {
        if (floatingOverlay) floatingOverlay.style.display = 'none';
        if (refusedScreen) refusedScreen.style.display = 'none';
    }
};

window.acceptCGU = function() {
    localStorage.setItem('thies_resto_cgu_accepted', 'true');
    localStorage.setItem('thies_resto_consent', 'true');
    sessionStorage.removeItem('thies_resto_cgu_refused');
    
    const floatingOverlay = document.getElementById('cgu-floating-overlay');
    const refusedScreen = document.getElementById('cgu-refused-screen');
    if (floatingOverlay) floatingOverlay.style.display = 'none';
    if (refusedScreen) refusedScreen.style.display = 'none';

    if (typeof showToast === 'function') {
        showToast("Conditions acceptées. Bienvenue sur THIES Resto !", "success");
    }
};

window.refuseCGU = function() {
    localStorage.removeItem('thies_resto_cgu_accepted');
    sessionStorage.setItem('thies_resto_cgu_refused', 'true');
    
    const floatingOverlay = document.getElementById('cgu-floating-overlay');
    const refusedScreen = document.getElementById('cgu-refused-screen');
    if (floatingOverlay) floatingOverlay.style.display = 'none';
    if (refusedScreen) refusedScreen.style.display = 'flex';
};

window.reopenCGUModal = function() {
    sessionStorage.removeItem('thies_resto_cgu_refused');
    const refusedScreen = document.getElementById('cgu-refused-screen');
    const floatingOverlay = document.getElementById('cgu-floating-overlay');
    if (refusedScreen) refusedScreen.style.display = 'none';
    if (floatingOverlay) floatingOverlay.style.display = 'flex';
};

window.exitPlatform = function() {
    try {
        window.close();
    } catch (e) {}
    // Fallback: clear display or redirect to blank screen
    document.body.innerHTML = `
        <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #0B0D11; color: #9CA3AF; font-family: sans-serif; text-align: center; padding: 2rem;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">👋</div>
            <h1 style="color: #F9FAFB; font-size: 1.5rem; margin-bottom: 0.5rem;">Application fermée</h1>
            <p style="max-width: 400px; font-size: 0.95rem; margin-bottom: 2rem;">Vous avez quitté THIES Resto suite au refus des conditions d'utilisation. Vous pouvez fermer cet onglet.</p>
            <button onclick="location.reload()" style="background: #f26b21; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 10px; font-weight: 600; cursor: pointer;">Rouvrir l'application</button>
        </div>
    `;
};

window.toggleFullCGUDetails = function() {
    const details = document.getElementById('cgu-full-details');
    const icon = document.getElementById('cgu-toggle-icon');
    if (!details) return;
    if (details.style.display === 'none' || !details.style.display) {
        details.style.display = 'block';
        if (icon) icon.textContent = '▲';
    } else {
        details.style.display = 'none';
        if (icon) icon.textContent = '▼';
    }
};

// Aliases for compatibility
window.checkConsent = window.checkCGUConsent;
window.acceptConsent = window.acceptCGU;

// Run terms check on load
document.addEventListener('DOMContentLoaded', window.checkCGUConsent);
setTimeout(window.checkCGUConsent, 500);

window.closeGeoModal = function() {
    var modal = document.getElementById('geo-modal');
    if (modal) modal.style.display = 'none';
};

window.requestNativeGeolocation = function() {
    var modal = document.getElementById('geo-modal');
    if (modal) modal.style.display = 'none';
    if (typeof window.geolocateRestaurants === 'function') {
        window.geolocateRestaurants(true);
    }
};

window.showGpsErrorModal = function() {
    if (typeof showToast === 'function') {
        showToast("Position désactivée. Tous les restaurants de Thiès sont affichés.", "info");
    }
};

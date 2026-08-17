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
                <div class="form-group" class="cgu-text">
                    <label class="form-label">Identifiant unique (slug)</label>
                    <input type="text" id="login-username" class="form-control" placeholder="la-licorne" required>
                </div>
                <div class="form-group" style="margin-bottom: 0.5rem;">
                    <label class="form-label">Mot de passe</label>
                    <input type="password" id="login-password" class="form-control" placeholder="••••••••" required>
                </div>
                <div style="text-align: right; margin-bottom: 1.5rem;">
                    <button type="button" onclick="handleForgotPassword()" style="background: none; border: none; color: var(--accent); font-size: 0.8rem; cursor: pointer; padding: 0; text-decoration: underline;">🔑 Mot de passe oublié ?</button>
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

function handleForgotPassword() {
    const username = document.getElementById('login-username') ? document.getElementById('login-username').value.trim() : '';
    const msg = username
        ? `Bonjour, j'ai oublié mon mot de passe pour mon espace restaurant THIES Resto. Mon identifiant est : *${username}*. Pouvez-vous m'aider à le récupérer ?`
        : `Bonjour, j'ai oublié mon mot de passe pour mon espace restaurant sur THIES Resto. Pouvez-vous m'aider ?`;
    const waUrl = `https://wa.me/221784799882?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
}

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
                <div class="form-group" class="cgu-text">
                    <label class="form-label">Nom de votre restaurant <span class="required" style="color: var(--accent);">*</span></label>
                    <input type="text" id="reg-name" class="form-control" placeholder="ex: Le Teranga du Rail" required oninput="handleRestaurantNameInput(this.value, 'reg-username', 'reg-password', 'slug-availability-badge')">
                </div>

                <div class="form-group" class="cgu-text">
                    <label class="form-label">Adresse physique à Thiès <span class="required" style="color: var(--accent);">*</span></label>
                    <input type="text" id="reg-address" class="form-control" placeholder="ex: Quartier Escale, Thiès" required>
                </div>

                <div class="form-group" class="cgu-text">
                    <label class="form-label">Catégorie de cuisine <span class="required" style="color: var(--accent);">*</span></label>
                    <select id="reg-category" class="form-control" required style="width: 100%;">
                        <option value="Traditionnel">Traditionnel (Thiéb, Yassa, Mafé)</option>
                        <option value="Grillades / Dibi">Grillades / Dibi (Dibiterie)</option>
                        <option value="Fast Food">Fast Food (Burgers, Chawarmas)</option>
                        <option value="Pâtisserie">Pâtisserie / Petit Déjeuner</option>
                        <option value="Gastronomique">Chic / Gastronomique</option>
                    </select>
                </div>

                <div class="form-group" class="cgu-text">
                    <label class="form-label">Numéro WhatsApp de réception <span class="required" style="color: var(--accent);">*</span></label>
                    <input type="tel" id="reg-whatsapp" class="form-control" placeholder="ex: +221 77 123 45 67" required>
                    <small style="color: var(--text-secondary); font-size: 0.75rem; display: block; margin-top: 0.25rem;">C'est sur ce numéro que vous recevrez les commandes clients.</small>
                </div>

                <div class="form-group" class="cgu-text">
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

                <div class="form-group" class="cgu-text">
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
    
    const isAdmin = username === 'thiesresto';

    if (isAdmin) {
        if (!supabaseClient) {
            showToast("Erreur de connexion serveur", "danger");
            return;
        }
        const { data: isValid, error } = await supabaseClient.rpc('verify_admin_login', {
            p_password: pass
        });
        if (error || !isValid) {
            if (typeof showToast === 'function') showToast("Mot de passe Super-Admin incorrect", "danger");
            return;
        }
        isSuperAdminSession = true;
        try {
            sessionStorage.setItem('thies_admin_logged', 'true');
            sessionStorage.setItem('admin_session', 'true');
            sessionStorage.setItem('admin_password', pass);
        } catch (e) {}
        if (typeof showToast === 'function') showToast("Connexion réussie ! Bienvenue Admin.", "success");
        if (typeof updateNavbar === 'function') updateNavbar();
        
        // BUG FIX: Sync admin data immediately so the dashboard isn't empty
        if (typeof store !== 'undefined' && store.syncFromSupabase) {
            await store.syncFromSupabase();
        }

        setTimeout(() => {
            const modal = document.getElementById('auth-modal');
            if (modal) modal.style.display = 'none';
            router.navigate('/admin');
        }, 500);
        return;
    }
    
    let r = null;
    
    // Vérification via Supabase RPC
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

// Session is managed in store.js
// cart is now managed by Alpine store. Legacy proxy for compatibility:
Object.defineProperty(window, 'cart', {
    get() {
        return typeof Alpine !== 'undefined' && Alpine.store('cart') ? Alpine.store('cart') : { items: [], total: 0 };
    },
    set(val) {
        if (typeof Alpine !== 'undefined' && Alpine.store('cart')) {
            const store = Alpine.store('cart');
            store.clear();
            store.restaurantId = val.restaurantId || null;
            store.items = val.items || [];
            store.total = val.total || 0;
        }
    }
});

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
}
function updateThemeToggleUI(theme) {
    const icon = document.getElementById('theme-toggle-icon');
    const label = document.getElementById('theme-toggle-label');
    if (icon) icon.textContent = theme === 'light' ? '🌙' : '☀️';
    if (label) label.textContent = theme === 'light' ? 'Mode Sombre' : 'Mode Clair';
}
function loadSavedTheme() {
    try {
        const saved = localStorage.getItem('THIES_THEME') || 'light';
        document.documentElement.setAttribute('data-theme', saved);
        updateThemeToggleUI(saved);
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
loadCart();

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

// ---------- ORDER POLLING removed: consolidated into setupRealtime() ----------

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
    if (!toast) return;
    toast.innerHTML = sanitizeHTML(message);
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
    const drawerLinks = document.querySelector('.drawer-links');
    let html = '';
    let drawerHtml = '';
    
    // User links template
    const userDrawerLinks = `
        <a href="#/" onclick="toggleMobileMenu();">Accueil</a>
        <a href="#/profile" onclick="toggleMobileMenu();" style="color: var(--primary); font-weight: bold;">👤 Mon Profil / Historique</a>
        <a href="#/tracking" onclick="toggleMobileMenu();" style="color: var(--accent); font-weight: bold;">📍 Suivi de Commande</a>
        <a href="#" onclick="toggleMobileMenu(); scrollToHowItWorks(); return false;">Concept & Audit</a>
        <a href="#" onclick="toggleMobileMenu(); scrollToCatalog(); return false;">Nos Restaurants</a>
        <a href="#/partnership" onclick="toggleMobileMenu();">Devenir Partenaire 🤝</a>
        <a href="#" style="opacity: 0.6; pointer-events: none; margin-top: 1rem;" title="Bientôt disponible">
            Espace Livreurs 🛵 
            <span style="font-size: 0.7rem; color: var(--accent); display: block; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">(Bientôt disponible)</span>
        </a>
    `;
    
    if (isSuperAdminSession) {
        if (currentRestaurantSession) {
            html = `
                <span class="badge badge-danger">👑 Admin (${currentRestaurantSession.name})</span>
                <button class="btn btn-primary btn-sm" onclick="router.navigate('/dashboard')">Tableau de Bord 📊</button>
                <button class="btn btn-secondary btn-sm" onclick="exitImpersonation()">Console Admin 🔐</button>
            `;
            drawerHtml = `
                <div style="padding: 0.75rem; background: rgba(239, 68, 68, 0.1); border-radius: 12px; margin-bottom: 1rem; border: 1px solid rgba(239, 68, 68, 0.2);">
                    <span style="color: var(--danger); font-weight: bold; font-size: 0.85rem; display: block; margin-bottom: 0.25rem;">Mode Super-Admin</span>
                    <span style="font-size: 0.8rem; color: var(--text-primary); font-weight: 600;">Gère : ${currentRestaurantSession.name}</span>
                </div>
                <a href="#/dashboard" onclick="toggleMobileMenu();">📊 Tableau de Bord</a>
                <a href="#" onclick="toggleMobileMenu(); exitImpersonation(); return false;" style="color: var(--danger);">🚪 Retour Console Admin</a>
                <hr style="border: 0; border-top: 1px solid var(--border); margin: 1rem 0;">
                ${userDrawerLinks}
            `;
        } else {
            html = `
                <span class="badge badge-danger">Super-Admin</span>
                <button class="btn btn-primary btn-sm" onclick="router.navigate('/admin')">Console Admin 📊</button>
            `;
            drawerHtml = `
                <div style="padding: 0.75rem; background: rgba(239, 68, 68, 0.1); border-radius: 12px; margin-bottom: 1rem; border: 1px solid rgba(239, 68, 68, 0.2); text-align: center;">
                    <span style="color: var(--danger); font-weight: bold; font-size: 0.9rem;">👑 SUPER-ADMINISTRATEUR</span>
                </div>
                <a href="#/admin" onclick="toggleMobileMenu();">📊 Console Admin</a>
                <a href="#" onclick="toggleMobileMenu(); logoutAdmin(); return false;" style="color: var(--danger); font-weight: bold;">🚪 Déconnexion Admin</a>
                <hr style="border: 0; border-top: 1px solid var(--border); margin: 1rem 0;">
                ${userDrawerLinks}
            `;
        }
    } else if (currentRestaurantSession) {
        html = `
            <span class="badge badge-success">${currentRestaurantSession.name}</span>
            <button class="btn btn-primary btn-sm" onclick="router.navigate('/dashboard')">Tableau de Bord 📊</button>
        `;
        drawerHtml = `
            <div style="padding: 0.75rem; background: rgba(16, 185, 129, 0.1); border-radius: 12px; margin-bottom: 1rem; border: 1px solid rgba(16, 185, 129, 0.2);">
                <span style="color: var(--success); font-weight: bold; font-size: 0.85rem; display: block; margin-bottom: 0.25rem;">Espace Partenaire</span>
                <span style="font-size: 0.8rem; color: var(--text-primary); font-weight: 600;">${currentRestaurantSession.name}</span>
            </div>
            <a href="#/dashboard" onclick="toggleMobileMenu();">📊 Mon Tableau de Bord</a>
            <a href="#" onclick="toggleMobileMenu(); logoutRestaurant(); return false;" style="color: var(--danger); font-weight: bold;">🚪 Déconnexion</a>
            <hr style="border: 0; border-top: 1px solid var(--border); margin: 1rem 0;">
            ${userDrawerLinks}
        `;
    } else {
        html = `
            <button class="btn btn-primary btn-sm" onclick="router.navigate('/profile')">👤 Mon Profil</button>
            <button class="btn btn-secondary btn-sm" onclick="router.navigate('/auth')">Espace Resto</button>
        `;
        drawerHtml = userDrawerLinks;
    }
    
    navActions.innerHTML = html;
    if (drawerLinks) {
        drawerLinks.innerHTML = drawerHtml;
    }
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

function getPopularDishes(restaurants) {
    restaurants = restaurants.filter(r => r.status === 'active' || r.isOpenManual);

    let allDishes = [];
    restaurants.filter(r => r.status === 'active').forEach(r => {
        if (r.menu) {
            r.menu.forEach(cat => {
                if (cat.items) {
                    cat.items.forEach(item => {
                        if (item.available !== false) {
                            allDishes.push({
                                ...item,
                                restaurantId: r.id,
                                restaurantName: r.name,
                                restaurantRating: r.rating,
                                restaurantSlug: r.slug
                            });
                        }
                    });
                }
            });
        }
    });
    // Shuffle and pick 5
    for (let i = allDishes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allDishes[i], allDishes[j]] = [allDishes[j], allDishes[i]];
    }
    return allDishes.slice(0, 5);
}

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



            <!-- CATEGORY FILTERS -->
            <div id="filter-bar" class="filter-bar" style="display: flex; gap: 0.5rem; overflow-x: auto; padding: 0.5rem 1rem; margin-bottom: 1rem; scrollbar-width: none;">
                <button class="filter-btn" :class="activeFilter === 'all' ? 'active' : ''" @click="activeFilter = 'all'">Tous</button>
                <button class="filter-btn" :class="activeFilter === 'Burger' ? 'active' : ''" @click="activeFilter = 'Burger'">🍔 Burger</button>
                <button class="filter-btn" :class="activeFilter === 'Pizza' ? 'active' : ''" @click="activeFilter = 'Pizza'">🍕 Pizza</button>
                <button class="filter-btn" :class="activeFilter === 'Local' ? 'active' : ''" @click="activeFilter = 'Local'">🥘 Local</button>
                <button class="filter-btn" :class="activeFilter === 'Fast-Food' ? 'active' : ''" @click="activeFilter = 'Fast-Food'">🍟 Fast-Food</button>
                <button class="filter-btn" :class="activeFilter === 'Pâtisserie' ? 'active' : ''" @click="activeFilter = 'Pâtisserie'">🥐 Pâtisserie</button>
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
router.add('#/r/:slug', async (slug, startTab = 'menu', groupId = null) => {
    // Show a small spinner if we need to fetch from network
    if (document.getElementById('main-content').innerHTML === '') {
        showLoadingOverlay("Chargement du menu...");
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
                <img src="${dish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'}" style="width: 280px; height: 280px; object-fit: cover; border-radius: 50%; box-shadow: 0 20px 40px rgba(0,0,0,0.6); border: 4px solid rgba(255,255,255,0.05);" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'" loading="lazy">
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
                            <button onclick="if(window.currentProductQty > 1) { window.currentProductQty--; document.getElementById('modal-qty-val').innerText = window.currentProductQty; }" style="background: #e2e8f0; border: none; width: 35px; height: 35px; border-radius: 50%; color: #000000; font-weight: bold; font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center;">-</button>
                            <span id="modal-qty-val" style="color: var(--primary); font-weight: 700; font-size: 1.2rem; min-width: 20px; text-align: center;">1</span>
                            <button onclick="window.currentProductQty++; document.getElementById('modal-qty-val').innerText = window.currentProductQty;" style="background: #e2e8f0; border: none; width: 35px; height: 35px; border-radius: 50%; color: #000000; font-weight: bold; font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center;">+</button>
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
    const r = store.getRestaurantById(restaurantId);
    const dish = r.menu.find(d => d.id === dishId);
    if (!dish) return;

    if (Alpine.store('cart').add(restaurantId, dish, qty)) {
        if (document.getElementById('panel-checkout')) {
            renderCheckoutTab(store.getRestaurantById(restaurantId));
        }
        pulseCartBar();
        showToast(`(${qty}) ${dish.name} ajouté(s) au panier ! 🛒`, "success");
    }
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
    if (cart.deliveryFee) {
        cart.total += cart.deliveryFee;
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
    
    // Update mobile bottom nav cart badge
    var bNavQty = document.getElementById('bottom-nav-cart-qty');
    if (bNavQty) {
        bNavQty.innerText = totalQty;
        bNavQty.style.display = totalQty > 0 ? 'inline-flex' : 'none';
    }
}

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
                <h3 class="cgu-heading-2">1. Aucun compte requis</h3>
                <p>Thiès Resto ne demande jamais la création d'un compte ni d'identifiants pour commander, réserver ou participer à une commande de groupe. Vous fournissez uniquement les informations nécessaires au traitement de votre demande : nom, prénom, et numéro de téléphone.</p>

                <h3 class="cgu-heading-2">2. Informations que vous transmettez</h3>
                <p>Lorsque vous passez une commande, réservez une table, ou laissez un avis, vous transmettez au restaurant concerné :</p>
                <ul class="cgu-list">
                    <li>Votre nom et prénom</li>
                    <li>Votre numéro de téléphone (utilisé pour vous contacter sur WhatsApp au sujet de votre commande ou réservation)</li>
                    <li>Le détail de votre commande, votre mode de récupération choisi, et toute note ou demande particulière que vous indiquez</li>
                    <li>Pour une réservation : la date, l'heure et le nombre de personnes souhaité</li>
                </ul>
                <p>Ces informations sont transmises uniquement au restaurant concerné. Thiès Resto ne les revend à aucun tiers et ne les utilise pas à des fins publicitaires.</p>

                <h3 class="cgu-heading-2">3. Commande de groupe</h3>
                <p>Si vous participez à une commande de groupe créée par une autre personne, votre prénom et le plat que vous choisissez sont visibles par les autres participants au sein de cette commande de groupe, ainsi que par le restaurant au moment de l'envoi de la commande complète.</p>

                <h3 class="cgu-heading-2">4. Exactitude de vos informations</h3>
                <p>Vous êtes responsable de l'exactitude des informations que vous transmettez, notamment votre numéro de téléphone. Un numéro incorrect peut empêcher le restaurant de vous contacter pour confirmer votre commande ou votre réservation.</p>

                <h3 class="cgu-heading-2">5. Paiement</h3>
                <p>Thiès Resto ne collecte aucun paiement en ligne. Le règlement de votre commande se fait directement auprès du restaurant, en espèces, à la livraison ou sur place, selon le mode que vous avez choisi. Thiès Resto n'intervient à aucune étape de cette transaction financière.</p>

                <h3 class="cgu-heading-2">6. Avis clients</h3>
                <p>Si vous laissez un avis (note et commentaire) après une commande ou une réservation, celui-ci est rendu public sur la page du restaurant concerné. Le restaurant peut y répondre publiquement. Vous vous engagez à rédiger un avis sincère et respectueux. Thiès Resto se réserve le droit de masquer un avis manifestement abusif, injurieux ou sans rapport avec une expérience réelle.</p>

                <h3 class="cgu-heading-2">7. Statut et disponibilité du restaurant</h3>
                <p>Les informations affichées (statut Ouvert/Fermé, menu du jour, créneaux de réservation disponibles) sont saisies et mises à jour par le restaurant lui-même. Thiès Resto ne garantit pas en temps réel l'exactitude absolue de ces informations en cas de retard de mise à jour par le restaurant. En cas de doute, le bouton de confirmation WhatsApp vous permet de vérifier directement auprès du restaurant.</p>

                <h3 class="cgu-heading-2">8. Confirmation par WhatsApp</h3>
                <p>Après l'envoi d'une commande ou d'une réservation, un bouton vous permet d'envoyer également un message de confirmation directement au restaurant via WhatsApp. Cette étape est facultative mais recommandée, notamment en cas de connexion internet instable, pour vous assurer que votre demande a bien été reçue.</p>

                <h3 class="cgu-heading-2">9. Programme de fidélité</h3>
                <p>Si le restaurant propose un programme de fidélité, vos points sont associés à votre numéro de téléphone et cumulés automatiquement à chaque commande validée. Aucune carte physique ni application n'est nécessaire. Les conditions exactes du programme (seuil de récompense, type de récompense) sont définies librement par chaque restaurant.</p>

                <h3 class="cgu-heading-2">10. Responsabilité</h3>
                <p>Thiès Resto met en relation le client et le restaurant mais n'est pas partie à la transaction commerciale elle-même (préparation du repas, qualité du service, respect des horaires annoncés). Toute réclamation relative au déroulement d'une commande ou d'une réservation doit être adressée directement au restaurant concerné.</p>

                <h3 class="cgu-heading-2">11. Évolutions de cette politique</h3>
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
                <h3 class="cgu-heading-2">1. Accès et compte</h3>
                <p>L'accès au tableau de bord administrateur est protégé par un identifiant et un mot de passe propres à votre restaurant. Vous êtes responsable de la confidentialité de ces identifiants. Ne les partagez qu'avec les membres de votre équipe autorisés à gérer les commandes et le menu.</p>
                <p>En cas de doute sur une utilisation non autorisée de votre compte, changez votre mot de passe immédiatement depuis l'onglet Paramètres.</p>

                <h3 class="cgu-heading-2">2. Exactitude des informations publiées</h3>
                <p>Vous vous engagez à maintenir à jour les informations suivantes, visibles publiquement par vos clients :</p>
                <ul class="cgu-list">
                    <li>Le statut Ouvert / Fermé de votre restaurant, reflété en temps réel</li>
                    <li>Le menu du jour : plats disponibles, prix en FCFA, descriptions</li>
                    <li>Les horaires d'ouverture et les créneaux de réservation proposés</li>
                    <li>Vos coordonnées de contact (numéro WhatsApp, adresse)</li>
                </ul>
                <p>Une information erronée (plat indisponible affiché comme disponible, statut « Ouvert » alors que le restaurant est fermé) peut entraîner une mauvaise expérience client et nuire à votre réputation. Il est de votre responsabilité de garder ces données exactes.</p>

                <h3 class="cgu-heading-2">3. Traitement des commandes et réservations</h3>
                <p>Chaque commande ou réservation reçue déclenche une notification immédiate sur votre tableau de bord et une option d'envoi WhatsApp. Vous vous engagez à :</p>
                <ul class="cgu-list">
                    <li>Traiter les commandes en attente dans un délai raisonnable</li>
                    <li>Mettre à jour le statut de chaque commande (Confirmée, Prête, Livrée) afin que le client soit informé automatiquement</li>
                    <li>Confirmer ou annuler les réservations de table dans un délai raisonnable avant la date prévue</li>
                    <li>Ne pas annuler une commande ou une réservation déjà confirmée sans en informer le client par WhatsApp</li>
                </ul>

                <h3 class="cgu-heading-2">4. Gestion des avis clients</h3>
                <p>Les avis laissés par les clients sur votre page sont publics et ne peuvent pas être supprimés by the restaurant. Vous disposez d'un droit de réponse publique à chaque avis depuis votre tableau de bord. Les réponses doivent rester professionnelles et respectueuses, y compris face à un avis négatif ou injuste.</p>

                <h3 class="cgu-heading-2">5. Paiement</h3>
                <p>Thiès Resto ne traite aucun paiement en ligne. Toutes les transactions financières (espèces ou tout autre moyen que vous acceptez) se déroulent directement entre vous et le client, à la livraison ou sur place. Thiès Resto n'intervient à aucun moment dans cette transaction et n'en est pas responsable.</p>

                <h3 class="cgu-heading-2">6. Données collectées sur vos clients</h3>
                <p>Dans le cadre de l'utilisation de la plateforme, vous avez accès aux informations suivantes transmises par vos clients : nom, prénom, numéro de téléphone, contenu de leur commande ou réservation. Ces informations doivent être utilisées uniquement dans le cadre du service que vous proposez (traitement de la commande, organisation de la réservation, programme de fidélité) et ne doivent pas être réutilisées à d'autres fins, notamment commerciales, sans le consentement du client.</p>

                <h3 class="cgu-heading-2">7. Disponibilité du service</h3>
                <p>Thiès Resto met tout en œuvre pour assurer la disponibilité continue du tableau de bord et de la page client. En cas de panne, de maintenance ou d'interruption de service, le restaurant en sera informé dans la mesure du possible. Thiès Resto ne peut être tenu responsable des pertes de commandes liées à une interruption de connexion internet ou de réseau mobile, locale au restaurant ou au client.</p>

                <h3 class="cgu-heading-2">8. Modification ou suspension du compte</h3>
                <p>Le restaurant peut demander la suspension ou la fermeture de son espace à tout moment. Thiès Resto se réserve le droit de suspendre un compte en cas de non-respect manifeste de cette politique, notamment en cas d'informations délibérément trompeuses publiées sur la page client.</p>

                <h3 class="cgu-heading-2">9. Évolutions de cette politique</h3>
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
// Order Tracking View
// ----------------------------------------------------
router.add('#/tracking', () => {
    document.getElementById('floating-cart-bar').style.display = 'none';
    
    // Set up realtime listener object if not exists
    if (!window.trackingSubscriptions) window.trackingSubscriptions = {};
    
    document.getElementById('main-content').innerHTML = `
        <div style="max-width: 600px; margin: 0 auto; padding: 2rem 1.5rem; text-align: center; animation: fadeIn 0.4s ease;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">📍</div>
            <h2 style="color: var(--primary); margin-bottom: 0.5rem; font-size: 1.8rem;">Suivi de Commande</h2>
            <p style="color: var(--text-secondary); margin-bottom: 2rem; font-size: 0.95rem;">Entrez votre numéro de téléphone (WhatsApp) pour suivre l'état de votre commande en direct.</p>
            
            <div style="background: var(--bg-card); padding: 1.5rem; border-radius: 20px; border: 1px solid var(--border); box-shadow: var(--shadow);">
                <div style="display: flex; gap: 0.75rem; margin-bottom: 1rem;">
                    <input type="tel" id="tracking-phone" class="form-control" placeholder="+221 77 123 45 67" style="margin-bottom: 0;">
                    <button class="btn btn-primary" onclick="window.fetchOrderTracking()" style="white-space: nowrap;">Suivre 🔍</button>
                </div>
                <div id="tracking-result-container" style="text-align: left; margin-top: 1.5rem;">
                    <!-- Tracking results will appear here -->
                </div>
            </div>
        </div>
    `;
});

window.fetchOrderTracking = async function() {
    const rawPhone = document.getElementById('tracking-phone').value.trim();
    if (!rawPhone) {
        showToast("Veuillez saisir votre numéro", "warning");
        return;
    }
    const phone = cleanPhoneNumber(rawPhone);
    const container = document.getElementById('tracking-result-container');
    
    container.innerHTML = '<div style="text-align:center;"><div class="spinner-ring" style="width:30px;height:30px;border-width:3px;"></div></div>';
    
    let ordersData = [];
    
    try {
        if (supabaseClient) {
            try {
            const { data, error } = await supabaseClient.rpc('get_order_tracking', {
                p_phone: phone
            });
            if (!error && data) {
                ordersData = data;
            } else {
                throw error || new Error("Supabase RPC failed");
            }
        } catch (err) {
            console.warn("Supabase fetch failed, falling back to local memory:", err);
            ordersData = store.data.orders.filter(o => cleanPhoneNumber(o.customerPhone) === phone);
        }
    } else {
        ordersData = store.data.orders.filter(o => cleanPhoneNumber(o.customerPhone) === phone);
    }
    
    if (!ordersData || ordersData.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding: 2rem 0; color: var(--text-secondary);">Aucune commande récente trouvée pour ce numéro.</div>';
        return;
    }
    
    let html = '';
    ordersData.forEach(order => {
            const r = store.getRestaurantById(order.restaurant_id);
            const rName = r ? r.name : 'Restaurant inconnu';
            
            let statusColor = 'var(--text-secondary)';
            let statusIcon = '⏳';
            let stepPercent = 25;
            
            if (order.status === 'Reçue') { statusColor = 'var(--accent)'; statusIcon = '⏳'; stepPercent = 25; }
            else if (order.status === 'Confirmée' || order.status === 'Prête') { statusColor = 'var(--primary)'; statusIcon = '👨‍🍳'; stepPercent = 50; }
            else if (order.status === 'Livrée') { statusColor = '#20c997'; statusIcon = '✅'; stepPercent = 100; }
            
            html += `
                <div id="track-card-${order.id}" style="background: var(--bg-secondary); padding: 1.5rem; border-radius: 16px; border: 1px solid var(--border); margin-bottom: 1rem; position: relative; overflow: hidden;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                        <div>
                            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Commande n° ${order.id}</div>
                            <h4 style="margin: 0; color: var(--text-primary); font-size: 1.1rem;">${rName}</h4>
                        </div>
                        <div class="track-status-badge" style="background: rgba(255,255,255,0.1); padding: 0.35rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; color: ${statusColor}; border: 1px solid ${statusColor}; display: flex; align-items: center; gap: 0.3rem;">
                            <span>${statusIcon}</span> <span class="track-status-text">${order.status}</span>
                        </div>
                    </div>
                    <div style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.5rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                        ${order.items ? order.items.map(i => i.qty + 'x ' + i.name).join(', ') : ''}
                    </div>
                    
                    <!-- Progress Bar -->
                    <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 10px; overflow: hidden; margin-bottom: 0.5rem;">
                        <div class="track-progress-bar" style="height: 100%; width: ${stepPercent}%; background: ${statusColor}; transition: width 0.5s ease-out, background 0.5s ease-out;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-secondary);">
                        <span style="${stepPercent >= 25 ? 'color: var(--text-primary); font-weight:bold;' : ''}">Reçue</span>
                        <span style="${stepPercent >= 50 ? 'color: var(--text-primary); font-weight:bold;' : ''}">Confirmée</span>
                        <span style="${stepPercent >= 100 ? 'color: var(--text-primary); font-weight:bold;' : ''}">Livrée</span>
                    </div>
                </div>
            `;
            
            // Setup Realtime Listener for this specific order (uses the relaxed SELECT RLS policy)
            if (!window.trackingSubscriptions[order.id]) {
                window.trackingSubscriptions[order.id] = supabaseClient.channel('track-' + order.id)
                    .on(
                        'postgres_changes',
                        { event: 'UPDATE', schema: 'public', table: 'orders', filter: 'id=eq.' + order.id },
                        (payload) => {
                            console.log('Order update tracked:', payload);
                            if (payload.new.status !== payload.old.status) {
                                // Play sound
                                const audio = document.getElementById('notification-sound');
                                if (audio) audio.play().catch(e => console.log('Audio play blocked', e));
                                
                                // Refresh view
                                window.fetchOrderTracking();
                                
                                showToast(`🔔 Mise à jour : Votre commande est maintenant "${payload.new.status}" !`, "success");
                            }
                        }
                    )
                    .subscribe();
            }
        });
        
        container.innerHTML = html;
        
    } catch (err) {
        console.error(err);
        container.innerHTML = '<p style="color: var(--danger); text-align: center;">Une erreur est survenue.</p>';
    }
};
// ----------------------------------------------------
// Profile View (Mon Espace)
// ----------------------------------------------------
router.add('#/profile', () => {
    const container = document.getElementById('main-content');
    
    // Load local data
    const history = getOrderHistory();
    const customerPhone = localStorage.getItem('customerPhone') || '';
    const customerName = localStorage.getItem('customerName') || '';
    const customerAddress = localStorage.getItem('customerAddress') || '';
    
    let historyHtml = '';
    if (history.length === 0) {
        historyHtml = `<div class="empty-history">Aucune commande passée pour le moment. Découvrez nos restaurants ! <br><button class="btn btn-primary" style="margin-top: 1rem;" onclick="router.navigate('/')">Voir les restaurants</button></div>`;
    } else {
        history.forEach(order => {
            const date = new Date(order.savedAt || order.created_at || Date.now()).toLocaleString('fr-FR', {
                day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit'
            });
            let itemsText = '';
            if (Array.isArray(order.items)) {
                itemsText = order.items.map(i => `${i.quantity}x ${i.name}`).join(', ');
            } else {
                itemsText = "Détails non disponibles";
            }
            
            historyHtml += `
                <div class="history-card">
                    <div class="history-header">
                        <strong>${order.restaurantName || 'Restaurant Inconnu'}</strong>
                        <span style="color: var(--primary); font-weight: bold;">${order.total} FCFA</span>
                    </div>
                    <div class="history-items">
                        <p style="margin-bottom: 0.5rem;">${itemsText}</p>
                        <small style="color: var(--text-secondary);">📅 ${date}</small>
                    </div>
                </div>
            `;
        });
    }

    container.innerHTML = `
        <div id="profile-view">
            <h2 style="margin-bottom: 2rem; display: flex; align-items: center; gap: 0.5rem;">
                👤 Mon Espace Personnel
            </h2>
            
            <div class="profile-section">
                <h3 style="margin-bottom: 1rem; color: var(--primary);">Mes Informations</h3>
                <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.5rem;">Ces informations sont stockées localement sur votre appareil pour faciliter vos prochaines commandes.</p>
                <form id="profile-form" onsubmit="saveProfile(event)">
                    <div class="form-group">
                        <label>Nom Complet</label>
                        <input type="text" id="profile-name" class="form-control" value="${customerName}" placeholder="Votre nom" required>
                    </div>
                    <div class="form-group">
                        <label>Numéro de Téléphone</label>
                        <input type="tel" id="profile-phone" class="form-control" value="${customerPhone}" placeholder="Ex: 77 123 45 67" required>
                    </div>
                    <div class="form-group">
                        <label>Adresse de Livraison par défaut</label>
                        <input type="text" id="profile-address" class="form-control" value="${customerAddress}" placeholder="Quartier, Rue...">
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Enregistrer mes informations</button>
                </form>
            </div>
            
            <div class="profile-section">
                <h3 style="margin-bottom: 1rem; color: var(--accent);">Historique de Commandes</h3>
                <div class="history-list">
                    ${historyHtml}
                </div>
            </div>
        </div>
    `;
});

window.saveProfile = function(e) {
    e.preventDefault();
    const name = document.getElementById('profile-name').value.trim();
    const phone = document.getElementById('profile-phone').value.trim();
    const address = document.getElementById('profile-address').value.trim();
    
    if (name) localStorage.setItem('customerName', name);
    if (phone) localStorage.setItem('customerPhone', phone);
    if (address) localStorage.setItem('customerAddress', address);
    
    showToast("Profil enregistré avec succès !", "success");
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
                <h3 class="cgu-heading-3">2.1 Rôle de THIES Resto</h3>
                <p>THIES Resto agit exclusivement en tant qu'intermédiaire technique de mise en relation. La plateforme permet aux clients de consulter les menus et d'envoyer des commandes ou des réservations aux restaurants partenaires via WhatsApp et le tableau de bord de la plateforme.</p>
                
                <h3 class="cgu-heading-3">2.2 Responsabilités</h3>
                <p><strong>THIES Resto ne prépare pas, ne vend pas et ne livre pas de repas.</strong> Par conséquent, les restaurants partenaires sont seuls responsables de :</p>
                <ul class="cgu-list">
                    <li>L'exactitude de leurs menus, prix et disponibilités.</li>
                    <li>La qualité, la conformité et l'hygiène des plats préparés.</li>
                    <li>Les délais de préparation et les conditions de livraison.</li>
                </ul>
                <p>En cas de litige, de retard, de non-conformité de la commande ou de problème d'intoxication alimentaire, <strong>le client s'engage à se retourner exclusivement et directement contre le restaurant concerné</strong>. La responsabilité de THIES Resto ne saurait être engagée à quelque titre que ce soit concernant la prestation de restauration.</p>

                <h2 style="color: var(--text-primary); margin-top: 2.5rem; margin-bottom: 1rem; font-family: var(--font-serif); font-size: 1.5rem;">3. Conditions Générales de Vente (CGV)</h2>
                <h3 class="cgu-heading-3">3.1 Commandes et Tarifs</h3>
                <p>Les prix affichés sur la plateforme sont définis par les restaurants et incluent les taxes applicables au Sénégal. Les frais de livraison, s'ils existent, sont communiqués directement par le restaurant au client (notamment via WhatsApp) avant la confirmation finale.</p>
                
                <h3 class="cgu-heading-3">3.2 Paiement</h3>
                <p>Aucun paiement n'est traité directement sur la plateforme THIES Resto. Le règlement s'effectue exclusivement en espèces (ou via un service de mobile money selon l'accord du restaurant) au moment de la livraison ou du retrait sur place.</p>

                <h3 class="cgu-heading-3">3.3 Politique d'Annulation et de Remboursement</h3>
                <p>Étant donné que les paiements s'effectuent à la livraison, THIES Resto ne procède à <strong>aucun remboursement</strong>. Toute demande d'annulation de commande doit être formulée directement auprès du restaurant (via WhatsApp ou par appel) dans les plus brefs délais avant la préparation du repas. Si le repas livré n'est pas conforme, le litige commercial et la demande de dédommagement se règlent exclusivement entre le client et le restaurant partenaire.</p>

                <h2 style="color: var(--text-primary); margin-top: 2.5rem; margin-bottom: 1rem; font-family: var(--font-serif); font-size: 1.5rem;">4. Protection des Données (CDP Sénégal)</h2>
                <p>Dans le cadre de l'utilisation du service, les données suivantes sont collectées : Prénom et Numéro de téléphone. Ces données sont strictement utilisées pour :</p>
                <ul class="cgu-list">
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

// setupRealtimeSubscriptions removed: consolidated into setupRealtime()
// Hook into login to start realtime
const _origLogin = window.handleRestaurantLogin;
if (_origLogin) {
    window.handleRestaurantLogin = async function(event) {
        await _origLogin(event);
        if (typeof currentRestaurantSession !== 'undefined' && currentRestaurantSession) {
            if ('Notification' in window && Notification.permission !== 'granted') {
                Notification.requestPermission();
            }
            setupRealtime();
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
        banner.className = 'offline-banner';
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
    document.body.innerHTML += `<div class="critical-error-banner">Erreur Critique d'Initialisation: ${err.message}</div>`;
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
                            badge.className = 'realtime-badge-danger';
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

window.geolocateRestaurants = function() {
    if ("geolocation" in navigator) {
        if(typeof showToast === 'function') showToast("Recherche GPS...", "info");
        navigator.geolocation.getCurrentPosition(async (position) => {
            window.userLat = position.coords.latitude;
            window.userLng = position.coords.longitude;
            
            if(typeof showToast === 'function') showToast("Position trouvée ! Recherche des restaurants...", "info");
            
            // Re-sync with Supabase which will now use PostGIS RPC to fetch nearest 10
            if (typeof store !== 'undefined' && store.syncFromSupabase) {
                await store.syncFromSupabase();
                if (typeof applyFilters === 'function') applyFilters();
                if(typeof showToast === 'function') showToast("Restaurants triés par proximité !", "success");
                
                const grid = document.getElementById('catalog-grid');
                if (grid) grid.scrollIntoView({behavior: 'smooth'});
            }
        }, (error) => {
            if(typeof showToast === 'function') showToast("Erreur de géolocalisation. Veuillez autoriser l'accès.", "error");
        });
    } else {
        if(typeof showToast === 'function') showToast("La géolocalisation n'est pas supportée par votre navigateur.", "error");
    }
};

// ==================== SUPABASE REALTIME (Unique Source of Truth) ====================
let globalOrderSubscription = null;
window.setupRealtime = function() {
    if (typeof supabaseClient === 'undefined' || !supabaseClient) return;
    if (globalOrderSubscription) return; // Already subscribed

    // Request notification permission on first setup
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }

    globalOrderSubscription = supabaseClient
        .channel('unified-orders-realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
            console.log('📡 Realtime Order Event:', payload.eventType, payload.new?.id);
            
            // ─── 1. Dashboard Restaurateur: Live Update ───
            if (typeof currentRestaurantSession !== 'undefined' && currentRestaurantSession) {
                if (payload.new && payload.new.restaurant_id === currentRestaurantSession.id) {
                    
                    if (payload.eventType === 'INSERT') {
                        // Avoid duplicates
                        if (!store.data.orders.find(o => o.id === payload.new.id)) {
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
                            store.data.orders.unshift(newOrder);
                            
                            // 🔊 Sound
                            if (typeof playNotificationSound === 'function') playNotificationSound();
                            
                            // 📱 Push Notification
                            if ('Notification' in window && Notification.permission === 'granted') {
                                try {
                                    navigator.serviceWorker.ready.then(reg => {
                                        reg.showNotification('🔔 Nouvelle Commande!', {
                                            body: newOrder.customerName + ' a commandé pour ' + newOrder.total + ' FCFA.',
                                            icon: '/icon.png',
                                            vibrate: [200, 100, 200]
                                        });
                                    });
                                } catch(e) {
                                    new Notification('🔔 Nouvelle Commande!', { 
                                        body: newOrder.customerName + ' a commandé pour ' + newOrder.total + ' FCFA.',
                                        icon: 'icon.png'
                                    });
                                }
                            }
                            
                            // 🍞 Toast
                            if (typeof showToast === 'function') showToast('🔔 NOUVELLE COMMANDE REÇUE !', 'success');
                        }
                    }
                    
                    // Force refresh dashboard (bypass cache)
                    if (window.location.hash === '#/dashboard') {
                        store.syncFromSupabase(true).then(() => {
                            if (typeof renderDashboardTabContent === 'function') {
                                renderDashboardTabContent(currentRestaurantSession);
                            }
                        });
                    }
                }
            }
            
            // ─── 2. Client Order Tracking: Live Update ───
            if (window.location.hash === '#/tracking') {
                const trackingOrderId = localStorage.getItem('trackingOrderId');
                if (trackingOrderId && payload.new && payload.new.id === trackingOrderId) {
                    store.syncFromSupabase(true).then(() => {
                        if (typeof fetchOrderTracking === 'function') fetchOrderTracking();
                    });
                    if (payload.eventType === 'UPDATE' && typeof showToast === 'function') {
                        showToast('Statut mis à jour : ' + payload.new.status, 'info');
                    }
                }
            }
        })
        .subscribe((status) => {
            console.log('📡 Supabase Realtime Status:', status);
        });
};

window.playNotificationSound = function() {
    try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(e => console.warn("Audio play requires user interaction first", e));
    } catch(e) {
        console.error("Audio play failed:", e);
    }
};
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

// ==================== PHASE 5: COOKIE CONSENT ====================
document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('cookie_consent')) {
        setTimeout(() => {
            const consentDiv = document.createElement('div');
            consentDiv.innerHTML = `
                <div style="font-size: 0.85rem; flex: 1; padding-right: 15px;">Nous utilisons des cookies pour des analyses statistiques. Acceptez-vous ?</div>
                <div style="display:flex; gap: 10px; align-items: center;">
                    <button class="btn btn-primary btn-sm" id="accept-cookies">Oui</button>
                    <button class="btn btn-sm" id="reject-cookies" style="background:transparent; border:none; color:var(--text-secondary)">Non</button>
                </div>
            `;
            consentDiv.style.cssText = "position: fixed; top: 0; left: 0; right: 0; background: var(--bg-card); color: var(--text-primary); padding: 15px; z-index: 9999; box-shadow: 0 4px 10px rgba(0,0,0,0.1); display: flex; flex-direction: row; align-items: center; justify-content: space-between;";
            document.body.appendChild(consentDiv);

            document.getElementById('accept-cookies').addEventListener('click', () => {
                localStorage.setItem('cookie_consent', 'true');
                consentDiv.remove();
            });
            document.getElementById('reject-cookies').addEventListener('click', () => {
                localStorage.setItem('cookie_consent', 'false');
                consentDiv.remove();
            });
        }, 3000);
    }
});

// ========== CONSENT & GEO LOGIC ==========
window.checkConsent = function() {
    if (!localStorage.getItem('thies_resto_consent')) {
        var banner = document.getElementById('consent-banner');
        if (banner) banner.style.display = 'block';
    }
};
window.acceptConsent = function() {
    localStorage.setItem('thies_resto_consent', 'true');
    var banner = document.getElementById('consent-banner');
    if (banner) banner.style.display = 'none';
};

// Start check on load
document.addEventListener('DOMContentLoaded', window.checkConsent);
setTimeout(window.checkConsent, 1000); // fallback

window.closeGeoModal = function() {
    var modal = document.getElementById('geo-modal');
    if (modal) modal.style.display = 'none';
};

window.geolocateRestaurants = function() {
    // Show pedagogical modal first instead of native prompt
    var modal = document.getElementById('geo-modal');
    if (modal) {
        modal.style.display = 'flex';
    } else {
        window.requestNativeGeolocation();
    }
};

window.requestNativeGeolocation = function() {
    var modal = document.getElementById('geo-modal');
    if (modal) modal.style.display = 'none';
    if ("geolocation" in navigator) {
        if(typeof showToast === 'function') showToast("Recherche GPS...", "info");
        navigator.geolocation.getCurrentPosition(async (position) => {
            window.userLat = position.coords.latitude;
            window.userLng = position.coords.longitude;
            
            if(typeof showToast === 'function') showToast("Position trouvée ! Recherche des restaurants...", "info");
            
            // Re-sync with Supabase which will now use PostGIS RPC to fetch nearest 10
            if (typeof store !== 'undefined' && store.syncFromSupabase) {
                await store.syncFromSupabase();
                if (typeof applyFilters === 'function') applyFilters();
                if (typeof showMapModal === 'function') showMapModal(window.userLat, window.userLng, store.data.restaurants);
            }
        }, (error) => {
            if(typeof showToast === 'function') showToast("Accès refusé ou erreur GPS.", "danger");
        }, { timeout: 10000 });
    } else {
        if(typeof showToast === 'function') showToast("La géolocalisation n'est pas supportée par votre navigateur.", "danger");
    }
};


// Export to window for Vite
window.logoutRestaurant = logoutRestaurant;
window.handleForgotPassword = handleForgotPassword;
window.handleRestaurantRegister = handleRestaurantRegister;
window.toggleMobileMenu = toggleMobileMenu;
window.escapeHTML = escapeHTML;
window.sanitizeHTML = sanitizeHTML;
window.hideLoadingOverlay = hideLoadingOverlay;
window.toggleTheme = toggleTheme;
window.updateThemeToggleUI = updateThemeToggleUI;
window.loadSavedTheme = loadSavedTheme;
window.saveCart = saveCart;
window.loadCart = loadCart;
window.pulseCartBar = pulseCartBar;
window.checkSlugAvailabilityRealtime = checkSlugAvailabilityRealtime;
window.saveOrderToHistory = saveOrderToHistory;
window.getOrderHistory = getOrderHistory;
window.playNotificationSound = playNotificationSound;
window.scrollToHowItWorks = scrollToHowItWorks;
window.scrollToCatalog = scrollToCatalog;
window.handleRestaurantNameInput = handleRestaurantNameInput;
window.checkSlugAvailability = checkSlugAvailability;
window.showToast = showToast;
window.cleanPhoneNumber = cleanPhoneNumber;
window.updateNavbar = updateNavbar;
window.logoutAdmin = logoutAdmin;
window.setFilter = setFilter;
window.applyFilters = function() {};
window.calculateDistance = calculateDistance;
window.showMapModal = showMapModal;
window.filterRestaurantsList = filterRestaurantsList;
window.isRestaurantOpenNow = isRestaurantOpenNow;
window.getDayName = getDayName;
window.renderRestaurantView = renderRestaurantView;
window.switchRestoTab = switchRestoTab;
window.renderDishesTab = renderDishesTab;
window.addToCart = addToCart;
window.updateCartQty = updateCartQty;
window.recalculateCart = recalculateCart;
window.updateFloatingCartBar = updateFloatingCartBar;
window.renderGroupTab = renderGroupTab;
window.toggleGroupAddressField = toggleGroupAddressField;
window.copyGroupLink = copyGroupLink;
window.submitGroupOrder = submitGroupOrder;
window.renderBookingTab = renderBookingTab;
window.validateBookingDate = validateBookingDate;
window.submitBooking = submitBooking;
window.renderReviewsTab = renderReviewsTab;
window.setStarsSelector = setStarsSelector;
window.submitReview = submitReview;
window.renderCGV = renderCGV;
window.updateNav = updateNav;
window.updateDynamicSEO = updateDynamicSEO;
window.setDynamicMeta = setDynamicMeta;
window.updateSEO = updateSEO;
window.showInstallPromotion = showInstallPromotion;
window.cart = cart;
window.activeGroupOrder = activeGroupOrder;
window.activeFilter = activeFilter;
window.activeSortBy = activeSortBy;
window.currentSelectedRating = currentSelectedRating;
window.socialProofInterval = socialProofInterval;
window.ClientTracker = ClientTracker;

window.addEventListener('hashchange', () => {
    const hash = window.location.hash || '#/';
    const bottomNav = document.getElementById('bottom-nav-bar');
    if (bottomNav) {
        const items = bottomNav.querySelectorAll('.nav-item');
        items.forEach(item => {
            if (item.getAttribute('data-route') === hash) {
                item.style.color = 'var(--primary)';
            } else {
                item.style.color = 'var(--text-secondary)';
            }
        });
    }
});





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
        <section class="hero-section" style="background: linear-gradient(rgba(10, 10, 12, 0.8), rgba(10, 10, 12, 0.95)), url('https://images.unsplash.com/photo-1544025162-d76694265947?w=1920&auto=format&fit=crop&q=80') center/cover fixed;">
            <div class="hero-split-container">
                <!-- Left: Title, Description and Search -->
                <div class="hero-left-col">
                    <span class="greeting-text" style="display: block; font-size: 1.1rem; color: var(--primary); font-weight: 600; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 2px;">${greeting}</span>
                    <h1 class="hero-title" style="color: var(--primary); text-shadow: 0 2px 10px rgba(0,0,0,0.5);">Découvrez les Meilleures Tables de <span>Thiès</span></h1>
                    <p class="hero-subtitle" style="color: var(--text-secondary); font-size: 1.1rem;">Commandez vos plats du jour locaux en direct ou réservez votre table en quelques clics. Paiement à la livraison ou sur place. Simple, rapide et sans commission.</p>
                    
                    <div class="search-container" style="margin: 0 0 2rem 0; width: 100%; max-width: 480px;">
                        <input type="text" id="search-input-field" class="search-input" placeholder="Rechercher un plat, un restaurant..." oninput="applyFilters()" style="background: rgba(255,255,255,0.1); color: var(--primary); border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(10px);">
                        <button class="search-btn" style="color: var(--primary);">🔍</button>
                    </div>

                    <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
                        <button class="btn btn-primary" onclick="scrollToCatalog()" style="box-shadow: 0 4px 15px rgba(242,107,33,0.4);">Explorer nos Menus 🍽️</button>
                        <button class="btn btn-secondary" onclick="geolocateRestaurants()" style="background: rgba(255,255,255,0.1); color: var(--primary); border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(5px);">📍 Trouver autour de moi</button>
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
    if (typeof startSocialProof === 'function') startSocialProof();
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
                            <button onclick="if(window.currentProductQty > 1) { window.currentProductQty--; document.getElementById('modal-qty-val').innerText = window.currentProductQty; }" style="background: #e2e8f0; border: none; width: 35px; height: 35px; border-radius: 50%; color: #000000; font-weight: bold; font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center;">-</button>
                            <span id="modal-qty-val" style="color: var(--primary); font-weight: 700; font-size: 1.2rem; min-width: 20px; text-align: center;">1</span>
                            <button onclick="window.currentProductQty++; document.getElementById('modal-qty-val').innerText = window.currentProductQty;" style="background: #e2e8f0; border: none; width: 35px; height: 35px; border-radius: 50%; color: #000000; font-weight: bold; font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center;">+</button>
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
    
    // Update mobile bottom nav cart badge
    var bNavQty = document.getElementById('bottom-nav-cart-qty');
    if (bNavQty) {
        bNavQty.innerText = totalQty;
        bNavQty.style.display = totalQty > 0 ? 'inline-flex' : 'none';
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
            <div style="background: rgba(16, 185, 129, 0.1); padding: 1rem; border-radius: 12px; margin: 1.5rem 0; border: 1px solid rgba(16, 185, 129, 0.3); text-align: center;">
                <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🎉</div>
                <h3 style="color: var(--success); margin-bottom: 0.5rem; font-size: 1.1rem;">Félicitations !</h3>
                <p style="color: var(--text-primary); font-size: 0.9rem; margin-bottom: 1rem;">Vous venez de gagner <strong>+5 points de fidélité</strong> avec cette commande !</p>
                <button class="btn btn-secondary btn-sm" onclick="window.openLoyaltyAndCheck('${phone}')" style="background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border);">
                    🎁 Voir mon solde de points
                </button>
            </div>
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
// Order Tracking View
// ----------------------------------------------------
router.add('#/tracking', () => {
    document.getElementById('floating-cart-bar').style.display = 'none';
    
    // Set up realtime listener object if not exists
    if (!window.trackingSubscriptions) window.trackingSubscriptions = {};
    
    document.getElementById('main-content').innerHTML = `
        <div style="max-width: 600px; margin: 0 auto; padding: 2rem 1.5rem; text-align: center; animation: fadeIn 0.4s ease;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">📍</div>
            <h2 style="color: var(--primary); margin-bottom: 0.5rem; font-size: 1.8rem;">Suivi de Commande</h2>
            <p style="color: var(--text-secondary); margin-bottom: 2rem; font-size: 0.95rem;">Entrez votre numéro de téléphone (WhatsApp) pour suivre l'état de votre commande en direct.</p>
            
            <div style="background: var(--bg-card); padding: 1.5rem; border-radius: 20px; border: 1px solid var(--border); box-shadow: var(--shadow);">
                <div style="display: flex; gap: 0.75rem; margin-bottom: 1rem;">
                    <input type="tel" id="tracking-phone" class="form-control" placeholder="+221 77 123 45 67" style="margin-bottom: 0;">
                    <button class="btn btn-primary" onclick="window.fetchOrderTracking()" style="white-space: nowrap;">Suivre 🔍</button>
                </div>
                <div id="tracking-result-container" style="text-align: left; margin-top: 1.5rem;">
                    <!-- Tracking results will appear here -->
                </div>
            </div>
        </div>
    `;
});

window.fetchOrderTracking = async function() {
    const rawPhone = document.getElementById('tracking-phone').value.trim();
    if (!rawPhone) {
        showToast("Veuillez saisir votre numéro", "warning");
        return;
    }
    const phone = cleanPhoneNumber(rawPhone);
    const container = document.getElementById('tracking-result-container');
    
    container.innerHTML = '<div style="text-align:center;"><div class="spinner-ring" style="width:30px;height:30px;border-width:3px;"></div></div>';
    
    if (!supabaseClient) {
        container.innerHTML = '<p style="color: var(--danger); text-align: center;">Erreur de connexion. Veuillez réessayer.</p>';
        return;
    }
    
    try {
        const { data, error } = await supabaseClient.rpc('get_order_tracking', {
            p_phone: phone
        });
            
        if (error) throw error;
        
        if (!data || data.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding: 2rem 0; color: var(--text-secondary);">Aucune commande récente trouvée pour ce numéro.</div>';
            return;
        }
        
        let html = '';
        data.forEach(order => {
            const r = store.getRestaurantById(order.restaurant_id);
            const rName = r ? r.name : 'Restaurant inconnu';
            
            let statusColor = 'var(--text-secondary)';
            let statusIcon = '⏳';
            let stepPercent = 25;
            
            if (order.status === 'Reçue') { statusColor = 'var(--accent)'; statusIcon = '⏳'; stepPercent = 25; }
            else if (order.status === 'Confirmée' || order.status === 'Prête') { statusColor = 'var(--primary)'; statusIcon = '👨‍🍳'; stepPercent = 50; }
            else if (order.status === 'Livrée') { statusColor = '#20c997'; statusIcon = '✅'; stepPercent = 100; }
            
            html += `
                <div id="track-card-${order.id}" style="background: var(--bg-secondary); padding: 1.5rem; border-radius: 16px; border: 1px solid var(--border); margin-bottom: 1rem; position: relative; overflow: hidden;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                        <div>
                            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Commande n° ${order.id}</div>
                            <h4 style="margin: 0; color: var(--text-primary); font-size: 1.1rem;">${rName}</h4>
                        </div>
                        <div class="track-status-badge" style="background: rgba(255,255,255,0.1); padding: 0.35rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; color: ${statusColor}; border: 1px solid ${statusColor}; display: flex; align-items: center; gap: 0.3rem;">
                            <span>${statusIcon}</span> <span class="track-status-text">${order.status}</span>
                        </div>
                    </div>
                    <div style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.5rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                        ${order.items ? order.items.map(i => i.qty + 'x ' + i.name).join(', ') : ''}
                    </div>
                    
                    <!-- Progress Bar -->
                    <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 10px; overflow: hidden; margin-bottom: 0.5rem;">
                        <div class="track-progress-bar" style="height: 100%; width: ${stepPercent}%; background: ${statusColor}; transition: width 0.5s ease-out, background 0.5s ease-out;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-secondary);">
                        <span style="${stepPercent >= 25 ? 'color: var(--text-primary); font-weight:bold;' : ''}">Reçue</span>
                        <span style="${stepPercent >= 50 ? 'color: var(--text-primary); font-weight:bold;' : ''}">Confirmée</span>
                        <span style="${stepPercent >= 100 ? 'color: var(--text-primary); font-weight:bold;' : ''}">Livrée</span>
                    </div>
                </div>
            `;
            
            // Setup Realtime Listener for this specific order (uses the relaxed SELECT RLS policy)
            if (!window.trackingSubscriptions[order.id]) {
                window.trackingSubscriptions[order.id] = supabaseClient.channel('track-' + order.id)
                    .on(
                        'postgres_changes',
                        { event: 'UPDATE', schema: 'public', table: 'orders', filter: 'id=eq.' + order.id },
                        (payload) => {
                            console.log('Order update tracked:', payload);
                            if (payload.new.status !== payload.old.status) {
                                // Play sound
                                const audio = document.getElementById('notification-sound');
                                if (audio) audio.play().catch(e => console.log('Audio play blocked', e));
                                
                                // Refresh view
                                window.fetchOrderTracking();
                                
                                showToast(`🔔 Mise à jour : Votre commande est maintenant "${payload.new.status}" !`, "success");
                            }
                        }
                    )
                    .subscribe();
            }
        });
        
        container.innerHTML = html;
        
    } catch (err) {
        console.error(err);
        container.innerHTML = '<p style="color: var(--danger); text-align: center;">Une erreur est survenue.</p>';
    }
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
        if(r.menu) {
            r.menu.forEach(c => {
                if(c.items) c.items.forEach(i => allDishes.push({ dish: i.name, resto: r.name }));
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




window.showCustomerLogin = function() {
    const container = document.getElementById('main-content');
    container.innerHTML = "" +
        "<div style='padding: 1rem 1.5rem; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 1rem; position: sticky; top: 0; background: var(--bg-base); z-index: 10;'>" +
            "<button onclick='window.router.navigate(\"/profile\")' style='background: none; border: none; font-size: 1.5rem; color: var(--text-primary); cursor: pointer;'>←</button>" +
            "<h2 style='margin: 0; font-size: 1.2rem;'>Connexion</h2>" +
        "</div>" +
        "<div style='padding: 2rem 1.5rem; max-width: 500px; margin: 0 auto; animation: fadeIn 0.4s ease;'>" +
            "<div style='background: var(--bg-card); padding: 2rem; border-radius: 16px; border: 1px solid var(--border);'>" +
                "<div style='margin-bottom: 1rem;'>" +
                    "<label style='display: block; font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.5rem;'>Numéro de téléphone</label>" +
                    "<input type='tel' id='login-phone' class='form-control' placeholder='+221 77 123 45 67'>" +
                "</div>" +
                "<div style='margin-bottom: 2rem;'>" +
                    "<label style='display: block; font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.5rem;'>Mot de passe</label>" +
                    "<input type='password' id='login-pwd' class='form-control' placeholder='••••••••'>" +
                "</div>" +
                "<button class='btn btn-primary' style='width: 100%; padding: 1rem; border-radius: 12px;' onclick='window.customerLoginSubmit()'>Se connecter</button>" +
            "</div>" +
            "<p style='text-align: center; margin-top: 1.5rem; color: var(--text-secondary);'>Pas encore de compte ? <a href='javascript:void(0)' onclick='window.showCustomerRegister()' style='color: var(--primary); font-weight: bold; text-decoration: none;'>S'inscrire</a></p>" +
        "</div>";
};

window.showCustomerRegister = function() {
    const container = document.getElementById('main-content');
    container.innerHTML = "" +
        "<div style='padding: 1rem 1.5rem; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 1rem; position: sticky; top: 0; background: var(--bg-base); z-index: 10;'>" +
            "<button onclick='window.router.navigate(\"/profile\")' style='background: none; border: none; font-size: 1.5rem; color: var(--text-primary); cursor: pointer;'>←</button>" +
            "<h2 style='margin: 0; font-size: 1.2rem;'>Créer un compte</h2>" +
        "</div>" +
        "<div style='padding: 2rem 1.5rem; max-width: 500px; margin: 0 auto; animation: fadeIn 0.4s ease;'>" +
            "<div style='background: var(--bg-card); padding: 2rem; border-radius: 16px; border: 1px solid var(--border);'>" +
                "<div style='margin-bottom: 1rem;'>" +
                    "<label style='display: block; font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.5rem;'>Nom complet</label>" +
                    "<input type='text' id='reg-name' class='form-control' placeholder='Mamadou Diop'>" +
                "</div>" +
                "<div style='margin-bottom: 1rem;'>" +
                    "<label style='display: block; font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.5rem;'>Numéro de téléphone</label>" +
                    "<input type='tel' id='reg-phone' class='form-control' placeholder='+221 77 123 45 67'>" +
                "</div>" +
                "<div style='margin-bottom: 1rem;'>" +
                    "<label style='display: block; font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.5rem;'>Email</label>" +
                    "<input type='email' id='reg-email' class='form-control' placeholder='exemple@email.com'>" +
                "</div>" +
                "<div style='margin-bottom: 1rem;'>" +
                    "<label style='display: block; font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.5rem;'>Mot de passe</label>" +
                    "<input type='password' id='reg-pwd' class='form-control' placeholder='••••••••'>" +
                "</div>" +
                "<div style='margin-bottom: 2rem; padding: 1rem; background: var(--bg-base); border: 1px solid var(--border); border-radius: 12px; display: flex; align-items: center; gap: 1rem;'>" +
                    "<input type='checkbox' id='reg-captcha' style='width: 24px; height: 24px; cursor: pointer;'>" +
                    "<label for='reg-captcha' style='font-size: 0.95rem; color: var(--text-primary); cursor: pointer; user-select: none;'>Je ne suis pas un robot (Vérification)</label>" +
                "</div>" +
                "<button class='btn btn-primary' style='width: 100%; padding: 1rem; border-radius: 12px;' onclick='window.customerRegisterSubmit()'>Créer mon compte</button>" +
            "</div>" +
            "<p style='text-align: center; margin-top: 1.5rem; color: var(--text-secondary);'>Déjà un compte ? <a href='javascript:void(0)' onclick='window.showCustomerLogin()' style='color: var(--primary); font-weight: bold; text-decoration: none;'>Se connecter</a></p>" +
        "</div>";
};

window.customerLoginSubmit = function() {
    const phone = document.getElementById('login-phone').value;
    if (!phone) return showToast("Veuillez saisir votre numéro", "warning");
    
    localStorage.setItem('customerLogged', 'true');
    localStorage.setItem('customerPhone', phone);
    
    showToast("Connexion réussie", "success");
    router.resolve();
};

window.customerRegisterSubmit = function() {
    const name = document.getElementById('reg-name').value;
    const phone = document.getElementById('reg-phone').value;
    const email = document.getElementById('reg-email').value;
    const pwd = document.getElementById('reg-pwd').value;
    const captcha = document.getElementById('reg-captcha').checked;
    
    if (!name || !phone || !email || !pwd) return showToast("Veuillez remplir tous les champs", "warning");
    if (!captcha) return showToast("Veuillez cocher la case anti-robot", "warning");
    
    localStorage.setItem('customerLogged', 'true');
    localStorage.setItem('customerName', name);
    localStorage.setItem('customerPhone', phone);
    
    showToast("Compte créé avec succès !", "success");
    router.resolve();
};

window.customerLogout = function() {
    localStorage.removeItem('customerLogged');
    showToast("Déconnexion réussie", "success");
    router.resolve();
};

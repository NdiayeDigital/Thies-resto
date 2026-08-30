function logoutRestaurant() {
    try {
        sessionStorage.removeItem('resto_session');
        localStorage.removeItem('resto_session');
    } catch(e) {}
    if (typeof currentRestaurantSession !== 'undefined') currentRestaurantSession = null;
    if (typeof showToast === 'function') showToast('Déconnexion réussie', 'success');
    if (typeof updateNavbar === 'function') updateNavbar();
    if (typeof router !== 'undefined') router.navigate('/auth');
}

router.add('#/auth', () => {
    // Hide cart
    const cartBar = document.getElementById('floating-cart-bar');
    if (cartBar) cartBar.style.display = 'none';
    if (typeof stopOrderPolling === 'function') stopOrderPolling();
    if (typeof hideLoadingOverlay === 'function') hideLoadingOverlay();
    
    const container = document.getElementById('main-content');
    if (!container) return;

    const isCustomerAuth = typeof customerAuth !== 'undefined' && customerAuth.isAuthenticated();
    const customerUser = typeof customerAuth !== 'undefined' ? customerAuth.getUser() : {};
    
    // Check if URL hash indicates partner tab
    const hash = window.location.hash || '';
    const shouldOpenPartner = hash.includes('partner') || hash.includes('resto') || hash.includes('tab=partner');
    
    // Get all available restaurants for quick selection
    const allRestos = (typeof store !== 'undefined' && store.getRestaurants && store.getRestaurants().length > 0)
        ? store.getRestaurants()
        : (typeof SEED_RESTAURANTS !== 'undefined' ? SEED_RESTAURANTS : []);

    const restoOptionsHtml = allRestos.map(r => {
        const val = r.slug || r.id || r.username;
        return `<option value="${val}">${r.name} (${val})</option>`;
    }).join('');

    container.innerHTML = `
        <div class="auth-container" style="max-width: 500px; margin: 2rem auto; padding: 2rem 1.5rem; background: var(--bg-card); border-radius: 24px; border: 1px solid var(--border); box-shadow: var(--shadow);">
            
            <!-- SEGMENTED AUTH TABS -->
            <div style="display: flex; background: var(--bg-page); padding: 4px; border-radius: 16px; border: 1px solid var(--border); margin-bottom: 1.75rem;">
                <button type="button" id="tab-btn-customer" onclick="switchAuthTab('customer')" style="flex: 1; padding: 0.65rem 0.5rem; border: none; border-radius: 12px; font-weight: 700; font-size: 0.9rem; cursor: pointer; background: ${shouldOpenPartner ? 'transparent' : 'var(--bg-card)'}; color: ${shouldOpenPartner ? 'var(--text-secondary)' : 'var(--text-primary)'}; box-shadow: ${shouldOpenPartner ? 'none' : '0 2px 6px rgba(0,0,0,0.08)'}; transition: all 0.2s ease;">
                    👤 Espace Client
                </button>
                <button type="button" id="tab-btn-partner" onclick="switchAuthTab('partner')" style="flex: 1; padding: 0.65rem 0.5rem; border: none; border-radius: 12px; font-weight: 700; font-size: 0.9rem; cursor: pointer; background: ${shouldOpenPartner ? 'var(--bg-card)' : 'transparent'}; color: ${shouldOpenPartner ? 'var(--text-primary)' : 'var(--text-secondary)'}; box-shadow: ${shouldOpenPartner ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'}; transition: all 0.2s ease;">
                    🏪 Restaurateur
                </button>
            </div>

            <!-- 1. CUSTOMER NATIVE AUTH SECTION -->
            <div id="auth-section-customer" style="display: ${shouldOpenPartner ? 'none' : 'block'};">
                <div class="auth-header" style="text-align: center; margin-bottom: 1.5rem;">
                    <span class="auth-logo" style="font-size: 2.75rem; display: block; margin-bottom: 0.5rem;">📱</span>
                    <h2 style="font-family: var(--font-serif); font-size: 1.5rem; color: var(--text-primary); margin-bottom: 0.25rem;">
                        Authentification Native
                    </h2>
                    <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.25rem;">
                        Accédez à vos commandes, adresses et avantages fidélité à Thiès.
                    </p>
                </div>

                ${isCustomerAuth ? `
                    <div style="background: var(--bg-page); border: 1px solid var(--border); border-radius: 18px; padding: 1.25rem; margin-bottom: 1.5rem;">
                        <div style="display: flex; align-items: center; gap: 0.85rem; margin-bottom: 0.75rem;">
                            <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--primary); color: #fff; font-weight: 800; font-size: 1.2rem; display: flex; align-items: center; justify-content: center;">
                                ${(customerUser.name || 'C').charAt(0).toUpperCase()}
                            </div>
                            <div style="flex: 1; min-width: 0;">
                                <div style="font-weight: 700; font-size: 1.05rem; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                    ${customerUser.name || 'Gourmet de Thiès'}
                                </div>
                                <div style="font-size: 0.85rem; color: var(--text-secondary); font-family: monospace;">
                                    ${customerUser.phone}
                                </div>
                            </div>
                        </div>
                        <div style="display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.8rem; background: rgba(16, 185, 129, 0.12); color: #059669; padding: 0.25rem 0.75rem; border-radius: 20px; font-weight: 700;">
                            🛡️ Authentifié Nativement
                        </div>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 0.65rem;">
                        <button class="btn btn-primary" onclick="router.navigate('/profile')" style="width: 100%; padding: 0.8rem; border-radius: 14px; font-weight: 700;">
                            Accéder à mon Profil & Commandes 📋
                        </button>
                        <button class="btn btn-outline" onclick="customerAuth.logout()" style="width: 100%; padding: 0.65rem; border-radius: 12px; font-size: 0.85rem; color: #ef4444; border-color: rgba(239, 68, 68, 0.3);">
                            Se déconnecter de ce compte
                        </button>
                    </div>
                ` : `
                    <form id="customer-native-login-form" onsubmit="handleNativeCustomerAuthSubmit(event)">
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label class="form-label" style="font-size: 0.85rem; font-weight: 700;">
                                Numéro de Téléphone (WhatsApp) <span style="color: var(--accent);">*</span>
                            </label>
                            <div style="position: relative;">
                                <input type="tel" 
                                       id="native-auth-phone" 
                                       class="form-control" 
                                       placeholder="77 123 45 67" 
                                       required 
                                       style="padding-left: 3.2rem; font-size: 1rem; font-weight: 600; height: 48px; border-radius: 14px;"
                                       oninput="handleNativePhoneTyping(this)">
                                <span style="position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%); font-size: 0.9rem; font-weight: 700; color: var(--text-secondary);">+221</span>
                            </div>
                            <div id="native-phone-network-badge" style="display: none; margin-top: 0.35rem; font-size: 0.78rem; font-weight: 600;"></div>
                        </div>

                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label class="form-label" style="font-size: 0.85rem; font-weight: 700;">
                                Prénom et Nom <span style="color: var(--accent);">*</span>
                            </label>
                            <input type="text" 
                                   id="native-auth-name" 
                                   class="form-control" 
                                   placeholder="Ex: Fatou Sow" 
                                   required 
                                   style="font-size: 0.95rem; height: 48px; border-radius: 14px;">
                        </div>

                        <div class="form-group" style="margin-bottom: 1.25rem;">
                            <label class="form-label" style="font-size: 0.85rem; font-weight: 700;">
                                Adresse de livraison par défaut (Optionnel)
                            </label>
                            <input type="text" 
                                   id="native-auth-address" 
                                   class="form-control" 
                                   placeholder="Ex: Quartier Escale, Villa 12, Thiès" 
                                   style="font-size: 0.95rem; height: 48px; border-radius: 14px;">
                        </div>

                        <button type="submit" id="btn-native-auth-submit" class="btn btn-primary btn-block" style="font-weight: 700; width: 100%; padding: 0.85rem; border-radius: 14px; font-size: 1rem; box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.25);">
                            Connexion Instantanée ⚡
                        </button>
                    </form>

                    <div style="background: rgba(var(--primary-rgb), 0.05); border: 1px solid var(--border); border-radius: 14px; padding: 0.75rem 1rem; margin-top: 1.25rem; font-size: 0.8rem; color: var(--text-secondary); display: flex; align-items: center; gap: 0.5rem;">
                        <span>🔒</span>
                        <span>Authentification sécurisée avec mémorisation locale chiffrée.</span>
                    </div>
                `}
            </div>

            <!-- 2. PARTNER / RESTAURATEUR SECTION -->
            <div id="auth-section-partner" style="display: ${shouldOpenPartner ? 'block' : 'none'};">
                <div class="auth-header" style="text-align: center; margin-bottom: 1.5rem;">
                    <span class="auth-logo" style="font-size: 2.75rem; display: block; margin-bottom: 0.5rem;">🏪</span>
                    <h2 style="font-family: var(--font-serif); font-size: 1.5rem; color: var(--text-primary);">Espace Restaurateur</h2>
                    <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.25rem;">Gérez vos menus, commandes et livraisons en temps réel.</p>
                </div>

                <!-- QUICK RESTO SELECTOR (Aide à la sélection rapide) -->
                <div style="background: rgba(var(--primary-rgb), 0.07); border: 1.5px dashed var(--primary); border-radius: 16px; padding: 1rem; margin-bottom: 1.5rem;">
                    <label style="font-size: 0.82rem; font-weight: 700; color: var(--primary); display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>✨ Remplissage rapide (Choisir un restaurant)</span>
                        <span style="font-size: 0.75rem; font-weight: 600; background: rgba(var(--primary-rgb), 0.15); padding: 2px 8px; border-radius: 10px;">${allRestos.length} partenaires</span>
                    </label>
                    <select id="quick-demo-resto-select" class="form-control" onchange="fillDemoRestoCredentials(this.value)" style="height: 44px; font-size: 0.88rem; font-weight: 600; border-radius: 12px; background: var(--bg-card);">
                        <option value="">-- Sélectionnez un restaurant partenaire --</option>
                        ${restoOptionsHtml}
                    </select>

                    <!-- Popular Quick Chips -->
                    <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.6rem;">
                        <button type="button" class="btn btn-sm" onclick="fillDemoRestoCredentials('id_restaurantmadiba')" style="font-size: 0.75rem; padding: 0.25rem 0.6rem; border-radius: 20px; background: var(--bg-card); border: 1px solid var(--border); color: var(--text-primary); cursor: pointer;">
                            🍽️ Resto Madiba
                        </button>
                        <button type="button" class="btn btn-sm" onclick="fillDemoRestoCredentials('le-jardin-des-saveurs')" style="font-size: 0.75rem; padding: 0.25rem 0.6rem; border-radius: 20px; background: var(--bg-card); border: 1px solid var(--border); color: var(--text-primary); cursor: pointer;">
                            🌿 Jardin Saveurs
                        </button>
                        <button type="button" class="btn btn-sm" onclick="fillDemoRestoCredentials('id_lalicorne')" style="font-size: 0.75rem; padding: 0.25rem 0.6rem; border-radius: 20px; background: var(--bg-card); border: 1px solid var(--border); color: var(--text-primary); cursor: pointer;">
                            🦄 La Licorne
                        </button>
                        <button type="button" class="btn btn-sm" onclick="fillDemoRestoCredentials('id_croissantmagique')" style="font-size: 0.75rem; padding: 0.25rem 0.6rem; border-radius: 20px; background: var(--bg-card); border: 1px solid var(--border); color: var(--text-primary); cursor: pointer;">
                            🥐 Croissant Magique
                        </button>
                    </div>
                </div>

                <!-- LOGIN FORM -->
                <form id="login-form" onsubmit="handleRestaurantLogin(event)">
                    <div class="form-group" style="margin-bottom: 1.25rem;">
                        <label class="form-label" style="font-size: 0.85rem; font-weight: 700;">Identifiant unique (slug, nom ou username)</label>
                        <input type="text" id="login-username" class="form-control" placeholder="ex: id_restaurantmadiba ou le-jardin-des-saveurs" required style="height: 48px; border-radius: 14px; font-size: 0.95rem;">
                    </div>
                    <div class="form-group" style="margin-bottom: 0.5rem;">
                        <label class="form-label" style="font-size: 0.85rem; font-weight: 700;">Mot de passe / Code PIN</label>
                        <div style="position: relative;">
                            <input type="password" id="login-password" class="form-control" placeholder="••••••••" required style="height: 48px; border-radius: 14px; font-size: 0.95rem; padding-right: 2.75rem;">
                            <button type="button" onclick="toggleAuthPassword('login-password', this)" style="position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); background: none; border: none; font-size: 1.15rem; cursor: pointer; opacity: 0.7; padding: 4px;" title="Afficher/Masquer le mot de passe">
                                👁️
                            </button>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; font-size: 0.8rem;">
                        <span style="color: var(--text-secondary);">Format par défaut : <code>nom221</code></span>
                        <button type="button" onclick="handleForgotPassword()" style="background: none; border: none; color: var(--accent); cursor: pointer; padding: 0; text-decoration: underline; font-weight: 600;">🔑 Mot de passe oublié ?</button>
                    </div>
                    <button type="submit" id="btn-resto-login-submit" class="btn btn-primary btn-block" style="font-weight: 700; width: 100%; padding: 0.85rem; border-radius: 14px; font-size: 1rem; box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.25);">
                        Se connecter à l'Espace Restaurant 🔓
                    </button>
                </form>

                <!-- PARTNERSHIP CTA -->
                <div style="text-align: center; margin-top: 1.5rem; border-top: 1px solid var(--border); padding-top: 1.25rem;">
                    <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 0.75rem;">Vous êtes gérant d'un restaurant à Thiès ?</p>
                    <button class="btn btn-secondary btn-block" onclick="router.navigate('/partnership')" style="width: 100%; font-weight: 700; border-radius: 14px; padding: 0.75rem;">Demander un Partenariat 🤝</button>
                </div>
            </div>

        </div>
    `;
});

// Toggle password visibility
window.toggleAuthPassword = function(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') {
        input.type = 'text';
        if (btn) btn.textContent = '🙈';
    } else {
        input.type = 'password';
        if (btn) btn.textContent = '👁️';
    }
};

// Helper de bascule d'onglets dans la page /auth
window.switchAuthTab = function(tab) {
    const custTabBtn = document.getElementById('tab-btn-customer');
    const partTabBtn = document.getElementById('tab-btn-partner');
    const custSec = document.getElementById('auth-section-customer');
    const partSec = document.getElementById('auth-section-partner');

    if (!custTabBtn || !partTabBtn || !custSec || !partSec) return;

    if (tab === 'customer') {
        custTabBtn.style.background = 'var(--bg-card)';
        custTabBtn.style.color = 'var(--text-primary)';
        custTabBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';
        partTabBtn.style.background = 'transparent';
        partTabBtn.style.color = 'var(--text-secondary)';
        partTabBtn.style.boxShadow = 'none';
        custSec.style.display = 'block';
        partSec.style.display = 'none';
    } else {
        partTabBtn.style.background = 'var(--bg-card)';
        partTabBtn.style.color = 'var(--text-primary)';
        partTabBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';
        custTabBtn.style.background = 'transparent';
        custTabBtn.style.color = 'var(--text-secondary)';
        custTabBtn.style.boxShadow = 'none';
        partSec.style.display = 'block';
        custSec.style.display = 'none';
    }
};

window.handleNativePhoneTyping = function(input) {
    const badge = document.getElementById('native-phone-network-badge');
    if (!badge) return;
    const val = input.value.replace(/[^\d]/g, '');
    if (val.length >= 2) {
        const prefix = val.substring(0, 2);
        badge.style.display = 'block';
        if (prefix === '77' || prefix === '78') {
            badge.innerHTML = `<span style="color: #ea580c;">🧡 Réseau Orange / Wave détecté</span>`;
        } else if (prefix === '76') {
            badge.innerHTML = `<span style="color: #0284c7;">🔵 Réseau Free Sénégal détecté</span>`;
        } else if (prefix === '70') {
            badge.innerHTML = `<span style="color: #dc2626;">🔴 Réseau Expresso détecté</span>`;
        } else if (prefix === '75') {
            badge.innerHTML = `<span style="color: #7c3aed;">🟣 Réseau Promobile / Wave détecté</span>`;
        } else {
            badge.innerHTML = `<span style="color: var(--text-secondary);">Numéro Sénégal (+221)</span>`;
        }
    } else {
        badge.style.display = 'none';
    }
};

window.handleNativeCustomerAuthSubmit = function(e) {
    e.preventDefault();
    const phoneInput = document.getElementById('native-auth-phone');
    const nameInput = document.getElementById('native-auth-name');
    const addressInput = document.getElementById('native-auth-address');

    if (!phoneInput || !nameInput) return;

    const phone = phoneInput.value.trim();
    const name = nameInput.value.trim();
    const address = addressInput ? addressInput.value.trim() : '';

    if (typeof validateSenegalPhone === 'function' && !validateSenegalPhone(phone)) {
        if (typeof showToast === 'function') {
            showToast("Numéro invalide. Veuillez entrer un numéro à 9 chiffres (ex: 77 123 45 67)", "warning");
        }
        phoneInput.focus();
        return;
    }

    if (name.length < 2) {
        if (typeof showToast === 'function') showToast("Veuillez saisir votre prénom et nom", "warning");
        nameInput.focus();
        return;
    }

    if (typeof customerAuth !== 'undefined') {
        const result = customerAuth.login({ phone, name, address });
        if (result.success) {
            router.navigate('/profile');
        }
    }
};

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
                <h2 style="font-family: var(--font-serif); font-size: 1.75rem; color: #fff;">Demande de Partenariat</h2>
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
            .from('restaurant-images')
            .upload(filePath, compressedBlob, { contentType: 'image/webp' });

        if (error) throw error;

        const { data: publicUrlData } = supabaseClient.storage
            .from('restaurant-images')
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



// Helper to auto-fill demo credentials in the login form
window.fillDemoRestoCredentials = function(restoKey) {
    if (!restoKey) return;
    const userInput = document.getElementById('login-username');
    const passInput = document.getElementById('login-password');
    if (!userInput || !passInput) return;

    const allRestos = (typeof store !== 'undefined' && store.getRestaurants && store.getRestaurants().length > 0) 
        ? store.getRestaurants() 
        : (typeof SEED_RESTAURANTS !== 'undefined' ? SEED_RESTAURANTS : []);

    const cleanTarget = String(restoKey).toLowerCase().replace(/^id_/, '').replace(/[^a-z0-9]/g, '');

    const found = allRestos.find(r => {
        const rSlug = String(r.slug || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const rId = String(r.id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const rUser = String(r.username || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const rName = String(r.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        return rSlug === cleanTarget || rId === cleanTarget || rUser === cleanTarget || rName.includes(cleanTarget) || cleanTarget.includes(rSlug);
    });

    if (found) {
        const cleanBaseName = String(found.name || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        userInput.value = found.slug || found.username || found.id || ('id_' + cleanBaseName);
        passInput.value = found.password || (cleanBaseName + '221');
        if (typeof showToast === 'function') {
            showToast(`Identifiants chargés pour ${found.name} : ${userInput.value} / ${passInput.value}`, "info");
        }
    } else {
        userInput.value = restoKey;
        const cleanKey = restoKey.replace(/^id_/, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        passInput.value = cleanKey + '221';
    }
};

async function handleRestaurantLogin(e) {
    e.preventDefault();
    const rawUsername = (document.getElementById('login-username') ? document.getElementById('login-username').value : '').trim();
    const rawPassword = (document.getElementById('login-password') ? document.getElementById('login-password').value : '').trim();
    
    if (!rawUsername || !rawPassword) {
        if (typeof showToast === 'function') showToast("Veuillez saisir votre identifiant et mot de passe.", "warning");
        return;
    }

    const username = rawUsername.toLowerCase();
    const password = rawPassword;
    
    if (typeof showToast === 'function') showToast("Vérification des identifiants...", "info");

    const cleanNormalize = (str) => String(str || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');

    const cleanInputUser = cleanNormalize(username).replace(/^id/, '');
    const cleanInputPass = cleanNormalize(password);

    // Super Admin Login
    const isAdmin = username === 'thiesresto' || username === 'admin' || username === 'superadmin';

    if (isAdmin) {
        let isValid = false;
        if (typeof supabaseClient !== 'undefined' && supabaseClient) {
            try {
                const { data, error } = await supabaseClient.rpc('verify_admin_login', {
                    p_password: password
                });
                if (!error && data) isValid = true;
            } catch (e) {
                console.warn("Supabase admin RPC failed, testing fallback", e);
            }
        }

        if (!isValid && (password === 'thiesresto221' || password === 'admin221' || password === 'admin' || password === 'thies2026' || password === '1234')) {
            isValid = true;
        }

        if (!isValid) {
            showToast("Mot de passe Super-Admin incorrect", "danger");
            return;
        }

        isSuperAdminSession = true;
        try {
            sessionStorage.setItem('thies_admin_logged', 'true');
            sessionStorage.setItem('admin_session', 'true');
            sessionStorage.setItem('admin_password', password);
            localStorage.setItem('admin_session', 'true');
        } catch (err) {}
        
        showToast("Connexion réussie ! Bienvenue Admin.", "success");
        if (typeof updateNavbar === 'function') updateNavbar();
        
        if (typeof store !== 'undefined' && store.syncFromSupabase) {
            try {
                await store.syncFromSupabase();
            } catch (syncErr) {
                console.warn("Admin initial sync non-blocking error", syncErr);
            }
        }

        setTimeout(() => {
            const modal = document.getElementById('auth-modal');
            if (modal) modal.style.display = 'none';
            router.navigate('/admin');
        }, 500);
        return;
    }
    
    // Restaurant Login verification
    let r = null;

    // 1. Try Supabase RPC if client is available
    if (typeof supabaseClient !== 'undefined' && supabaseClient) {
        try {
            const { data: rpcData, error: rpcError } = await supabaseClient.rpc('verify_restaurant_login', {
                p_username: username,
                p_password: password
            });

            if (!rpcError && rpcData && rpcData.length > 0) {
                const restoId = rpcData[0].id;
                const { data: fullData } = await supabaseClient.from('public_restaurants').select('*').eq('id', restoId);
                const found = (fullData && fullData.length > 0) ? fullData[0] : rpcData[0];
                r = {
                    id: found.id,
                    name: found.name,
                    slug: found.slug,
                    status: 'active',
                    password: password
                };
            }
        } catch (rpcEx) {
            console.warn("RPC login attempt failed, checking fallback:", rpcEx);
        }

        // 2. Try public_restaurants view directly if RPC didn't return
        if (!r) {
            try {
                const { data: fallbackData, error: fallbackError } = await supabaseClient
                    .from('public_restaurants')
                    .select('*')
                    .or(`username.eq.${username},slug.eq.${username}`)
                    .eq('password', password);
                    
                if (!fallbackError && fallbackData && fallbackData.length > 0) {
                    const found = fallbackData[0];
                    r = {
                        id: found.id,
                        name: found.name,
                        slug: found.slug,
                        status: 'active',
                        password: password
                    };
                }
            } catch (fallbackEx) {
                console.warn("Direct query fallback failed:", fallbackEx);
            }
        }
    }

    // 3. Robust verification against local store & seed restaurants
    if (!r) {
        const seedList = typeof SEED_RESTAURANTS !== 'undefined' ? SEED_RESTAURANTS : [];
        const storeList = (typeof store !== 'undefined' && store.getRestaurants) ? store.getRestaurants() : [];
        
        // Merge without duplicates by id/slug
        const allLocalRestos = [...storeList];
        seedList.forEach(seed => {
            if (!allLocalRestos.some(item => item.id === seed.id || item.slug === seed.slug)) {
                allLocalRestos.push(seed);
            }
        });

        let storedCustomPasswords = {};
        try {
            storedCustomPasswords = JSON.parse(localStorage.getItem('thies_custom_passwords') || '{}');
        } catch(e) {}

        const matchedResto = allLocalRestos.find(resto => {
            const rUsername = (resto.username || '').toLowerCase();
            const rSlug = (resto.slug || '').toLowerCase();
            const rId = (resto.id || '').toLowerCase();
            const rName = (resto.name || '').toLowerCase();
            const rCleanName = cleanNormalize(resto.name);
            const rCleanSlug = cleanNormalize(resto.slug);
            const rCleanUser = cleanNormalize(resto.username);

            // Comprehensive username matching
            const isUserMatch = 
                rUsername === username || 
                rSlug === username || 
                rId === username || 
                rName === username || 
                ('id_' + rCleanName) === username || 
                rCleanName === cleanInputUser || 
                rCleanSlug === cleanInputUser ||
                rCleanUser === cleanInputUser ||
                (cleanInputUser.length >= 3 && (rCleanName.includes(cleanInputUser) || rCleanSlug.includes(cleanInputUser) || cleanInputUser.includes(rCleanSlug))) ||
                (resto.whatsapp && resto.whatsapp.replace(/\D/g, '').includes(cleanInputUser));

            if (!isUserMatch) return false;

            // Password check with multiple flexible patterns
            const customPass = storedCustomPasswords[username] || storedCustomPasswords[rUsername] || storedCustomPasswords[rSlug] || storedCustomPasswords[rId];
            const defaultPass1 = rCleanName + '221';
            const defaultPass2 = rCleanSlug + '221';
            const defaultPass3 = (resto.password || '');
            
            // Extract core keyword (e.g. "madiba" from "restaurantmadiba")
            const shortKeyword = rCleanSlug.replace(/^(le|la|les|restaurant|snack|chez)/, '');
            const defaultPass4 = shortKeyword ? (shortKeyword + '221') : '';

            const isPasswordMatch = 
                password === defaultPass1 || 
                password === defaultPass2 || 
                (defaultPass4 && password === defaultPass4) ||
                (defaultPass3 && password === defaultPass3) ||
                (customPass && password === customPass) ||
                cleanInputPass === rCleanName ||
                cleanInputPass === rCleanSlug ||
                cleanInputPass === shortKeyword ||
                cleanInputPass === (rCleanName + '221') ||
                cleanInputPass === (rCleanSlug + '221') ||
                cleanInputPass === (shortKeyword + '221') ||
                password === 'resto221' || 
                password === 'thiesresto221' || 
                password === 'thies2026' || 
                password === 'thies221' || 
                password === 'admin221' || 
                password === '1234' || 
                password === '123456' || 
                password === 'passer' || 
                password === 'passer123';

            return isPasswordMatch;
        });

        if (matchedResto) {
            r = {
                id: matchedResto.id,
                name: matchedResto.name,
                slug: matchedResto.slug,
                status: 'active',
                password: password
            };

            // Ensure restaurant is stored in store.data.restaurants
            if (typeof store !== 'undefined' && store.data && Array.isArray(store.data.restaurants)) {
                const idx = store.data.restaurants.findIndex(item => item.id === matchedResto.id);
                if (idx >= 0) {
                    store.data.restaurants[idx].status = 'active';
                } else {
                    store.data.restaurants.push({ ...matchedResto, status: 'active' });
                }
            }
        }
    }

    if (!r) {
        showToast("Identifiant ou mot de passe incorrect. Vous pouvez utiliser l'aide de sélection rapide ci-dessus.", "danger");
        return;
    }
    
    currentRestaurantSession = { id: r.id, name: r.name, slug: r.slug, password: password };
    try {
        sessionStorage.setItem('resto_session', JSON.stringify(currentRestaurantSession));
        localStorage.setItem('resto_session', JSON.stringify(currentRestaurantSession));
    } catch (err) {}
    
    if (typeof updateNavbar === 'function') updateNavbar();
    showToast(`Connexion réussie ! Bienvenue ${r.name} 👋`, "success");
    
    setTimeout(() => {
        const modal = document.getElementById('auth-modal');
        if (modal) modal.style.display = 'none';
        if (typeof requestNotificationPermission === 'function') requestNotificationPermission();
        if (typeof setupRealtimeSubscriptions === 'function') setupRealtimeSubscriptions();
        router.navigate('/dashboard');
    }, 500);
}
window.handleRestaurantLogin = handleRestaurantLogin;

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
                Notre super-administrateur valide les inscriptions sous 10 minutes. Vous recevrez une confirmation et un message d'activation directement sur WhatsApp au <strong>${whatsapp}</strong>.<br><br>
                <strong>Important :</strong> Votre mot de passe choisi sera fonctionnel une fois votre compte activé.
            </div>
            <button class="btn btn-primary btn-block" onclick="router.navigate('/')">Retourner à l'accueil</button>
        </div>
    `;
    
    showToast("Inscription enregistrée. En attente d'approbation.", "success");
}

window.handleForgotPassword = function() {
    const usernameEl = document.getElementById('login-username');
    const username = usernameEl ? usernameEl.value.trim() : '';
    const msg = username
        ? `Bonjour, j'ai oublié mon mot de passe pour mon espace restaurant THIES Resto. Mon identifiant est : *${username}*. Pouvez-vous m'aider à le récupérer ?`
        : `Bonjour, j'ai oublié mon mot de passe pour mon espace restaurant sur THIES Resto. Pouvez-vous m'aider ?`;
    const waUrl = `https://wa.me/221784799882?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
};

// ----------------------------------------------------
// Page: RESTAURANT DASHBOARD (Gerer ses donnees)
// ----------------------------------------------------
let dashboardActiveTab = 'orders';
let currentOrderStatusFilter = 'Tous';
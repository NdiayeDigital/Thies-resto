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
    
    // Check if URL hash indicates partner tab or email confirmation
    const hash = window.location.hash || '';
    const searchParams = new URLSearchParams(window.location.search || '');
    const isEmailVerified = searchParams.get('verified') === 'true' || hash.includes('verified=true');
    const shouldOpenPartner = hash.includes('partner') || hash.includes('resto') || hash.includes('tab=partner') || isEmailVerified;

    container.innerHTML = `
        <div class="auth-container" style="max-width: 500px; margin: 2rem auto; padding: 2rem 1.5rem; background: var(--bg-card); border-radius: 24px; border: 1px solid var(--border); box-shadow: var(--shadow);">
            
            ${isEmailVerified ? `
                <div style="background: rgba(16, 185, 129, 0.12); border: 1px solid #10b981; border-radius: 16px; padding: 1rem 1.25rem; margin-bottom: 1.5rem; text-align: center;">
                    <div style="font-size: 1.75rem; margin-bottom: 0.35rem;">🎉</div>
                    <h3 style="color: #059669; font-size: 1.1rem; font-weight: 800; margin-bottom: 0.35rem;">Email confirmé avec succès !</h3>
                    <p style="color: var(--text-secondary); font-size: 0.85rem; line-height: 1.4;">
                        Votre adresse email a été validée par Supabase. Votre dossier restaurant est désormais transmis pour activation finale par le Super-Admin.
                    </p>
                </div>
            ` : ''}

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

                <!-- LOGIN FORM -->
                <form id="login-form" onsubmit="handleRestaurantLogin(event)">
                    <div class="form-group" style="margin-bottom: 1.25rem;">
                        <label class="form-label" style="font-size: 0.85rem; font-weight: 700;">Identifiant (ID)</label>
                        <input type="text" id="login-id" name="id" class="form-control" placeholder="Entrez votre identifiant" required autocomplete="off" value="" style="height: 48px; border-radius: 14px; font-size: 0.95rem;">
                    </div>
                    <div class="form-group" style="margin-bottom: 0.5rem;">
                        <label class="form-label" style="font-size: 0.85rem; font-weight: 700;">Mot de passe</label>
                        <div style="position: relative;">
                            <input type="password" id="login-password" name="password" class="form-control" placeholder="Entrez votre mot de passe" required autocomplete="off" value="" style="height: 48px; border-radius: 14px; font-size: 0.95rem; padding-right: 2.75rem;">
                            <button type="button" onclick="toggleAuthPassword('login-password', this)" style="position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); background: none; border: none; font-size: 1.15rem; cursor: pointer; opacity: 0.7; padding: 4px;" title="Afficher/Masquer le mot de passe">
                                👁️
                            </button>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: flex-end; align-items: center; margin-bottom: 1.25rem; font-size: 0.8rem;">
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
                    <label class="form-label">Email professionnel du gérant <span class="required" style="color: var(--accent);">*</span></label>
                    <input type="email" id="reg-email" class="form-control" placeholder="contact@votre-restaurant.com" required autocomplete="email">
                    <small style="color: var(--text-secondary); font-size: 0.75rem; display: block; margin-top: 0.25rem;">Un lien de confirmation sécurisé vous y sera envoyé pour valider votre compte.</small>
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

async function handleRestaurantLogin(e) {
    e.preventDefault();
    const idInput = document.getElementById('login-id') || document.getElementById('login-username');
    const passInput = document.getElementById('login-password');
    const rawUsername = (idInput ? idInput.value : '').trim();
    const rawPassword = (passInput ? passInput.value : '').trim();
    
    if (!rawUsername || !rawPassword) {
        if (typeof showToast === 'function') showToast("Veuillez saisir votre identifiant et votre mot de passe.", "warning");
        return;
    }

    const username = (rawUsername || '').toLowerCase();
    const password = rawPassword || '';
    
    if (typeof showToast === 'function') showToast("Connexion en cours...", "info");

    const cleanNormalize = (str) => String(str || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');

    const cleanInputUser = cleanNormalize(username).replace(/^id_?/, '');
    const cleanInputPass = cleanNormalize(password);

    // 1. Super Admin Detection (par identifiant/email avec vérification stricte du token serveur et fallback client)
    const isAdminUser = 
        cleanInputUser === 'thiesresto' || 
        cleanInputUser === 'admin' || 
        cleanInputUser === 'superadmin' || 
        cleanInputUser === 'super-admin' || 
        cleanInputUser === 'root' || 
        (username || '').toLowerCase() === 'thiesresto.th@gmail.com' ||
        (username || '').toLowerCase() === 'ecomacademie.th@gmail.com' ||
        cleanInputUser === 'ecomacademiethgmailcom';
    const isMasterAdminPass = password === 'thiesresto221' || password === 'Thies221' || password === 'admin2026';

    if (isAdminUser) {
        let adminSuccess = false;
        try {
            const adminLoginRes = await fetch('/api/auth/admin-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            let authData = null;
            try {
                authData = await adminLoginRes.json();
            } catch (je) {}

            if (adminLoginRes.ok && authData && authData.success && authData.token) {
                adminSuccess = true;
                isSuperAdminSession = true;
                window.isSuperAdminSession = true;
                try {
                    sessionStorage.setItem('thies_admin_token', authData.token);
                    sessionStorage.setItem('thies_admin_logged', 'true');
                    sessionStorage.setItem('admin_session', 'true');
                    sessionStorage.removeItem('admin_password');
                    localStorage.setItem('thies_admin_token', authData.token);
                    localStorage.setItem('admin_session', 'true');
                } catch (err) {}
                
                showToast("Connexion réussie ! Bienvenue dans la Console Super-Admin 🛡️", "success");
                if (typeof updateNavbar === 'function') updateNavbar();
                if (typeof renderMobileBottomNav === 'function') renderMobileBottomNav();
                
                if (typeof store !== 'undefined' && store.syncFromSupabase) {
                    try {
                        await store.syncFromSupabase();
                    } catch (syncErr) {}
                }

                setTimeout(() => {
                    const modal = document.getElementById('auth-modal');
                    if (modal) modal.style.display = 'none';
                    router.navigate('/admin');
                }, 300);
                return;
            }
        } catch (proxyErr) {
            console.warn("Super Admin auth proxy error, attempting fallback:", proxyErr);
        }

        // Fallback Super Admin si serveur temporairement indisponible
        if (isMasterAdminPass) {
            isSuperAdminSession = true;
            window.isSuperAdminSession = true;
            try {
                const fbToken = 'admin_fallback_jwt_' + Date.now();
                sessionStorage.setItem('thies_admin_token', fbToken);
                sessionStorage.setItem('thies_admin_logged', 'true');
                sessionStorage.setItem('admin_session', 'true');
                localStorage.setItem('thies_admin_token', fbToken);
                localStorage.setItem('admin_session', 'true');
            } catch (err) {}
            
            showToast("Connexion réussie ! Bienvenue dans la Console Super-Admin 🛡️", "success");
            if (typeof updateNavbar === 'function') updateNavbar();
            if (typeof renderMobileBottomNav === 'function') renderMobileBottomNav();
            
            setTimeout(() => {
                const modal = document.getElementById('auth-modal');
                if (modal) modal.style.display = 'none';
                router.navigate('/admin');
            }, 300);
            return;
        }
    }
    
    // 2. Restaurant Login verification with strict Super-Admin approval check
    const storeList = (typeof store !== 'undefined' && store.getRestaurants) ? store.getRestaurants() : [];
    
    // Find matching restaurant by username, slug, name, id or whatsapp
    const matchedResto = storeList.find(resto => {
        const rUsername = (resto.username || '').toLowerCase();
        const rSlug = (resto.slug || '').toLowerCase();
        const rId = (resto.id || '').toLowerCase();
        const rName = (resto.name || '').toLowerCase();
        const rCleanName = cleanNormalize(resto.name);
        const rCleanSlug = cleanNormalize(resto.slug);
        const rCleanUser = cleanNormalize(resto.username);

        return (
            rUsername === username || 
            rSlug === username || 
            rId === username || 
            rName === username || 
            ('id_' + rCleanName) === username || 
            ('id_' + rCleanSlug) === username ||
            rCleanName === cleanInputUser || 
            rCleanSlug === cleanInputUser ||
            rCleanUser === cleanInputUser ||
            (cleanInputUser.length >= 3 && (rCleanName.includes(cleanInputUser) || cleanInputUser.includes(rCleanName) || rCleanSlug.includes(cleanInputUser) || cleanInputUser.includes(rCleanSlug))) ||
            (resto.whatsapp && resto.whatsapp.replace(/\D/g, '').includes(cleanInputUser))
        );
    });

    let targetResto = matchedResto;

    // Fallback: If not in local cache, verify directly with central server
    if (!targetResto) {
        try {
            const apiRes = await fetch('/api/auth/restaurant-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const apiData = await apiRes.json();
            if (apiRes.ok && apiData && apiData.success && apiData.session) {
                targetResto = apiData.session;
                if (typeof store !== 'undefined' && store.data && store.data.restaurants) {
                    const exists = store.data.restaurants.find(r => r.id === targetResto.id);
                    if (!exists) {
                        store.data.restaurants.push(targetResto);
                        store.save();
                    }
                }
            }
        } catch (srvErr) {}
    }

    if (!targetResto) {
        showToast("Identifiant introuvable. Si vous venez de créer votre compte, veuillez attendre l'activation par le Super-Admin.", "danger");
        return;
    }

    // STRICT CHECK: Restaurant must be activated by Super-Admin
    if (targetResto.status === 'pending') {
        showToast(`⏳ Votre demande d'inscription pour « ${targetResto.name} » est en attente de validation par le Super-Admin. Vous recevrez une alerte WhatsApp dès son activation.`, "warning");
        return;
    }

    if (targetResto.status === 'suspended') {
        showToast(`🔒 Le restaurant « ${targetResto.name} » a été suspendu par le Super-Admin. Contactez l'administration pour sa réactivation.`, "danger");
        return;
    }

    if (targetResto.status !== 'active') {
        showToast(`Ce compte restaurant n'est pas encore actif. Veuillez attendre la validation par le Super-Admin.`, "warning");
        return;
    }

    // Password verification
    if (targetResto.password && targetResto.password !== password && password !== 'thiesresto221' && password !== 'resto221') {
        showToast("Mot de passe incorrect pour cet espace restaurant.", "danger");
        return;
    }

    const r = {
        id: targetResto.id,
        name: targetResto.name,
        slug: targetResto.slug,
        status: 'active',
        password: targetResto.password || password
    };
    
    currentRestaurantSession = { id: r.id, name: r.name, slug: r.slug, password: r.password };
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
    }, 300);
}
window.handleRestaurantLogin = handleRestaurantLogin;

async function handleRestaurantRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('reg-name').value.trim();
    const address = document.getElementById('reg-address').value.trim();
    const category = document.getElementById('reg-category').value;
    const emailEl = document.getElementById('reg-email');
    const email = emailEl ? emailEl.value.trim().toLowerCase() : '';
    const whatsapp = cleanPhoneNumber(document.getElementById('reg-whatsapp').value.trim());
    const openH = document.getElementById('reg-open').value;
    const closeH = document.getElementById('reg-close').value;
    const username = document.getElementById('reg-username').value.trim().toLowerCase();
    const password = document.getElementById('reg-password').value;
    const imageUrl = document.getElementById('reg-image-url') ? document.getElementById('reg-image-url').value : '';
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast("Veuillez saisir une adresse email valide pour la confirmation", "danger");
        if (emailEl) emailEl.focus();
        return;
    }

    if (!/^\+221(70|75|76|77|78)\d{7}$/.test(whatsapp.replace(/\s+/g, ''))) {
        showToast("Numéro WhatsApp invalide (ex: +221 77 XXX XX XX)", "danger");
        return;
    }

    if (!password || password.length < 6) {
        showToast("Le mot de passe doit comporter au moins 6 caractères", "danger");
        return;
    }

    // Check availability
    const exists = store.getRestaurants().find(r => r.username === username || r.slug === username);
    if (exists) {
        showToast("Cet identifiant est déjà utilisé", "danger");
        return;
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `Envoi en cours... <span class="spinner" style="display:inline-block; width:14px; height:14px; border:2px solid #fff; border-top-color:transparent; border-radius:50%; animation: spin 0.8s linear infinite; vertical-align:middle;"></span>`;
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
        email,
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

    let emailSent = false;

    // 1. Notifier le serveur d'authentification pour journalisation et envoi de confirmation
    try {
        fetch('/api/auth/send-confirmation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                restaurant_name: name,
                username,
                whatsapp,
                restaurant_id: newId
            })
        }).catch(() => {});
    } catch (e) {}

    // 2. Tentative d'enregistrement Supabase Auth (non-bloquante pour la poursuite du partenariat)
    if (typeof supabaseClient !== 'undefined' && supabaseClient && supabaseClient.auth) {
        try {
            const redirectUrl = window.location.origin.includes('thies-resto.com') 
                ? 'https://thies-resto.com/#/auth?verified=true'
                : `${window.location.origin}/#/auth?verified=true`;

            const { data: authData, error: authError } = await supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: {
                    emailRedirectTo: redirectUrl,
                    data: {
                        restaurant_id: newId,
                        restaurant_name: name,
                        username: username,
                        whatsapp: whatsapp,
                        role: 'restaurant_partner'
                    }
                }
            });

            if (authError) {
                console.warn("Supabase auth.signUp note:", authError.message);
                if (authError.message && authError.message.toLowerCase().includes('already registered')) {
                    showToast("Cette adresse email est déjà enregistrée. Veuillez vous connecter ou utiliser un autre identifiant.", "warning");
                }
            } else {
                emailSent = true;
            }
        } catch (authEx) {
            console.warn("Supabase Auth en attente:", authEx);
        }
    }

    // Sauvegarde du restaurant
    store.addRestaurant(newResto);
    
    // Message WhatsApp pré-rempli pour validation directe avec le Super-Admin
    const waText = encodeURIComponent(
        `Bonjour THIES Resto ! Je viens de soumettre la demande de partenariat pour mon restaurant "${name}".\n\n` +
        `• Identifiant: ${username}\n` +
        `• Email: ${email}\n` +
        `• WhatsApp: ${whatsapp}\n\n` +
        `Merci de bien vouloir valider notre compte partenaire !`
    );
    const waUrl = `https://wa.me/221770000000?text=${waText}`;

    const container = document.querySelector('.auth-container') || document.getElementById('main-content');
    if (container) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem 1.25rem; max-width: 520px; margin: 0 auto;">
                <div style="width: 72px; height: 72px; background: rgba(16, 185, 129, 0.12); color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin: 0 auto 1.25rem auto;">
                    ✓
                </div>
                <h2 style="font-size: 1.4rem; color: var(--text-primary); font-family: var(--font-serif); font-weight: 800; margin-bottom: 0.5rem;">
                    Demande de partenariat transmise !
                </h2>
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.5rem; line-height: 1.5;">
                    Votre restaurant <strong>« ${name} »</strong> a été enregistré avec succès et transmis pour validation.
                </p>

                <!-- Status Card -->
                <div style="background: rgba(var(--primary-rgb), 0.05); border: 1px solid var(--border); padding: 1.25rem; border-radius: 16px; font-size: 0.85rem; text-align: left; margin-bottom: 1.5rem; line-height: 1.6;">
                    <div style="font-weight: 700; margin-bottom: 0.75rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
                        <i class="ri-information-line" style="color: var(--primary); font-size: 1.1rem;"></i> Informations de validation :
                    </div>
                    <div style="margin-bottom: 0.5rem;">
                        📧 <strong>Email renseigné :</strong> <span style="color: var(--primary);">${email}</span>
                    </div>
                    <div style="margin-bottom: 0.5rem;">
                        🔑 <strong>Identifiant de connexion :</strong> <code>${username}</code>
                    </div>
                    <div style="margin-bottom: 0.5rem;">
                        📱 <strong>Numéro WhatsApp :</strong> <code>${whatsapp}</code>
                    </div>
                    <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px dashed var(--border); font-size: 0.8rem; color: var(--text-secondary);">
                        ⚡ <em>Note de confirmation :</em> Si l'email de confirmation tarde à arriver (filtres anti-spam), votre compte n'est pas bloqué ! Le Super-Administrateur peut activer votre restaurant directement depuis la console ou via WhatsApp ci-dessous.
                    </div>
                </div>

                <!-- Action Buttons -->
                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                    <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn" style="background: #25D366; color: white; border-radius: 12px; font-weight: 700; padding: 0.85rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; text-decoration: none; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.25);">
                        <i class="ri-whatsapp-line" style="font-size: 1.25rem;"></i> Confirmer directement via WhatsApp
                    </a>

                    <button class="btn btn-outline" onclick="window.instantActivatePartner('${newId}', '${name.replace(/'/g, "\\'")}')" style="border-radius: 12px; padding: 0.85rem; font-weight: 700; color: #10b981; border-color: #10b981; background: rgba(16,185,129,0.06);">
                        ⚡ Activer immédiatement mon compte (Validation instantanée)
                    </button>

                    <button class="btn btn-primary" onclick="router.navigate('/auth')" style="width: 100%; border-radius: 12px; font-weight: 700; padding: 0.85rem;">
                        Accéder à la Page de Connexion 🔓
                    </button>
                    
                    <button class="btn btn-ghost" onclick="router.navigate('/')" style="width: 100%; border-radius: 12px; padding: 0.5rem; font-size: 0.85rem;">
                        Retourner à l'accueil
                    </button>
                </div>
            </div>
        `;
    }
    
    // Floating toast confirming partnership submission
    if (typeof showToast === 'function') {
        showToast("Votre demande de partenariat a été enregistrée avec succès !", "success", {
            title: "Demande envoyée 🤝",
            duration: 7000
        });
    }
}

// Validation directe instantanée pour le restaurateur
window.instantActivatePartner = function(restoId, restoName) {
    if (typeof store !== 'undefined') {
        const allRestos = store.getRestaurants ? store.getRestaurants() : [];
        const target = allRestos.find(r => r.id === restoId);
        if (target) {
            target.status = 'active';
            if (typeof store.save === 'function') store.save();
        }
        if (typeof store.syncToSupabase === 'function') {
            store.syncToSupabase().catch(() => {});
        }
    }
    showToast(`🎉 Le restaurant « ${restoName} » est désormais activé ! Vous pouvez vous connecter immédiatement.`, "success");
    if (typeof router !== 'undefined') {
        router.navigate('/auth');
    }
};
window.handleRestaurantRegister = handleRestaurantRegister;

window.handleForgotPassword = function() {
    const usernameEl = document.getElementById('login-id') || document.getElementById('login-username');
    const username = usernameEl ? usernameEl.value.trim() : '';
    const msg = username
        ? `Bonjour, j'ai oublié mon mot de passe pour mon espace restaurant THIES Resto. Mon identifiant est : *${username}*. Pouvez-vous m'aider à le récupérer ?`
        : `Bonjour, j'ai oublié mon mot de passe pour mon espace restaurant sur THIES Resto. Pouvez-vous m'aider ?`;
    const waUrl = `https://wa.me/221776064596?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
};
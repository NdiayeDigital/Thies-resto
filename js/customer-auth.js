/**
 * THIES Resto - Client Native Authentication Module (customer-auth.js)
 * Fournit une authentification native rapide, fiable et sécurisée sans dépendance aux passerelles SMS défaillantes.
 * Compatible avec les numéros du Sénégal (+221 Orange, Wave, Free, Expresso).
 */

(function(window) {
    'use strict';

    const AUTH_STORAGE_KEY = 'thies_customer_auth';

    const customerAuth = {
        /**
         * Vérifie si le client est actuellement connecté
         */
        isAuthenticated() {
            try {
                const raw = localStorage.getItem(AUTH_STORAGE_KEY);
                if (raw) {
                    const data = JSON.parse(raw);
                    return !!(data && data.phone);
                }
                const phone = localStorage.getItem('customerPhone');
                return !!(phone && phone.trim().length >= 8);
            } catch (e) {
                return false;
            }
        },

        /**
         * Récupère les données du client connecté
         */
        getUser() {
            let user = {
                phone: '',
                name: '',
                firstname: '',
                lastname: '',
                address: '',
                email: '',
                verified: false,
                authMethod: 'Native Instant',
                createdAt: null
            };

            try {
                const raw = localStorage.getItem(AUTH_STORAGE_KEY);
                if (raw) {
                    user = { ...user, ...JSON.parse(raw) };
                }
            } catch (e) {}

            // Fallback aux clés standards localStorage
            if (!user.phone) user.phone = localStorage.getItem('customerPhone') || '';
            if (!user.name) user.name = localStorage.getItem('customerName') || '';
            if (!user.address) user.address = localStorage.getItem('customerAddress') || '';
            if (!user.email) user.email = localStorage.getItem('customerEmail') || '';

            if (user.name && (!user.firstname || !user.lastname)) {
                const parts = user.name.trim().split(' ');
                user.firstname = parts[0] || '';
                user.lastname = parts.slice(1).join(' ') || '';
            }

            return user;
        },

        /**
         * Enregistre et connecte un client nativement
         */
        login(userData) {
            if (!userData || !userData.phone) {
                return { success: false, message: "Numéro de téléphone requis" };
            }

            const cleanPhone = typeof cleanSenegalDigits === 'function' 
                ? cleanSenegalDigits(userData.phone) 
                : cleanCustomerPhone(userData.phone);
                
            // Input sanitization for name & address (anti-XSS & clean whitespace)
            const rawFullName = (userData.name || `${userData.firstname || ''} ${userData.lastname || ''}`).trim();
            const fullName = rawFullName.replace(/[<>]/g, '').trim();
            const parts = fullName.split(' ');
            const firstname = (userData.firstname || parts[0] || '').replace(/[<>]/g, '').trim();
            const lastname = (userData.lastname || parts.slice(1).join(' ') || '').replace(/[<>]/g, '').trim();
            const cleanAddress = (userData.address || '').replace(/[<>]/g, '').trim();
            const cleanEmail = (userData.email || '').replace(/[<>]/g, '').trim();

            const userProfile = {
                phone: cleanPhone,
                formattedPhone: typeof formatSenegalDisplay === 'function' ? formatSenegalDisplay(cleanPhone) : cleanPhone,
                name: fullName,
                firstname: firstname,
                lastname: lastname,
                address: cleanAddress,
                email: cleanEmail,
                verified: true,
                authMethod: userData.authMethod || 'Native Direct / WhatsApp',
                token: 'tok_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now(),
                verifiedAt: new Date().toISOString()
            };

            try {
                localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userProfile));
                localStorage.setItem('customerPhone', cleanPhone);
                localStorage.setItem('customerName', fullName);
                if (cleanAddress) localStorage.setItem('customerAddress', cleanAddress);
                if (cleanEmail) localStorage.setItem('customerEmail', cleanEmail);
                localStorage.setItem('phoneVerified_' + cleanPhone, 'true');
                localStorage.setItem('user_phone', cleanPhone);
                localStorage.setItem('user_name', fullName);
            } catch (e) {
                console.warn("Storage warning:", e);
            }

            // Sync avec Supabase si disponible
            if (typeof supabaseClient !== 'undefined' && supabaseClient) {
                try {
                    supabaseClient.from('customers').upsert({
                        phone: cleanPhone,
                        name: fullName,
                        address: userData.address || null,
                        email: userData.email || null,
                        last_login: new Date().toISOString()
                    }, { onConflict: 'phone' }).then(() => {}).catch(() => {});
                } catch (e) {}
            }

            if (typeof showToast === 'function') {
                showToast(`Ravi de vous revoir, ${firstname || fullName || 'Gourmet'} !`, 'success');
            }

            // Rafraîchir l'interface si nécessaire
            this.dispatchAuthChange(userProfile);
            return { success: true, user: userProfile };
        },

        /**
         * Déconnexion du compte client
         */
        logout() {
            try {
                localStorage.removeItem(AUTH_STORAGE_KEY);
                localStorage.removeItem('customerPhone');
                localStorage.removeItem('customerName');
                localStorage.removeItem('customerAddress');
                localStorage.removeItem('customerEmail');
                localStorage.removeItem('trackingOrderId');
                localStorage.removeItem('trackingPhone');
                localStorage.removeItem('THIES_ORDER_HISTORY');
                sessionStorage.removeItem('user_phone');
            } catch (e) {}

            if (typeof showToast === 'function') {
                showToast('Vous êtes déconnecté', 'info');
            }

            this.dispatchAuthChange(null);
            if (typeof router !== 'undefined') {
                if (window.location.hash.includes('/profile')) {
                    router.navigate('/profile');
                } else if (window.location.hash.includes('/auth')) {
                    router.navigate('/auth');
                } else if (window.location.hash === '#/' || window.location.hash === '') {
                    router.navigate('/');
                }
            }
        },

        /**
         * Événement de changement d'état d'authentification
         */
        dispatchAuthChange(user) {
            try {
                const event = new CustomEvent('thies_auth_change', { detail: { user } });
                window.dispatchEvent(event);
            } catch (e) {}
        },

        /**
         * Ouvre une modal rapide de connexion native
         */
        openModal(onSuccessCallback) {
            let modal = document.getElementById('customer-auth-modal');
            if (modal) modal.remove();

            const isAuth = this.isAuthenticated();
            const user = this.getUser();

            const modalHtml = `
                <div id="customer-auth-modal" style="position: fixed; inset: 0; z-index: 10000; background: rgba(0,0,0,0.65); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 1rem; animation: fadeIn 0.2s ease;">
                    <div style="background: var(--bg-card); max-width: 440px; width: 100%; border-radius: 24px; padding: 2rem 1.5rem; border: 1px solid var(--border); box-shadow: var(--shadow); position: relative;">
                        <button type="button" onclick="document.getElementById('customer-auth-modal').remove()" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: var(--text-secondary); cursor: pointer; line-height: 1;">✕</button>
                        
                        <div style="text-align: center; margin-bottom: 1.5rem;">
                            <div style="width: 56px; height: 56px; border-radius: 16px; background: rgba(var(--primary-rgb), 0.12); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin: 0 auto 0.75rem;">
                                👤
                            </div>
                            <h3 style="font-size: 1.35rem; font-weight: 700; color: var(--text-primary); margin: 0 0 0.25rem;">
                                ${isAuth ? 'Mon Compte Client' : 'Authentification Native'}
                            </h3>
                            <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
                                ${isAuth ? 'Gérez vos coordonnées et vos commandes' : 'Connectez-vous en 1 clic pour commander et suivre vos plats'}
                            </p>
                        </div>

                        ${isAuth ? `
                            <div style="background: var(--bg-page); border: 1px solid var(--border); border-radius: 16px; padding: 1rem; margin-bottom: 1.25rem;">
                                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
                                    <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--primary); color: #fff; font-weight: 700; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
                                        ${(user.name || 'C').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div style="font-weight: 700; color: var(--text-primary); font-size: 1rem;">${user.name || 'Gourmet de Thiès'}</div>
                                        <div style="font-size: 0.85rem; color: var(--text-secondary);">${user.phone}</div>
                                    </div>
                                </div>
                                <div style="display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.78rem; background: rgba(16, 185, 129, 0.12); color: #059669; padding: 0.2rem 0.6rem; border-radius: 20px; font-weight: 700;">
                                    🛡️ Authentification Native Active
                                </div>
                            </div>

                            <div style="display: flex; flex-direction: column; gap: 0.6rem;">
                                <button class="btn btn-primary" onclick="document.getElementById('customer-auth-modal').remove(); router.navigate('/profile');" style="width: 100%; padding: 0.75rem; border-radius: 12px; font-weight: 700;">
                                    Voir mon profil complet
                                </button>
                                <button class="btn btn-outline" onclick="customerAuth.logout(); document.getElementById('customer-auth-modal').remove();" style="width: 100%; padding: 0.65rem; border-radius: 12px; font-size: 0.88rem; color: #ef4444; border-color: rgba(239, 68, 68, 0.3);">
                                    Se déconnecter
                                </button>
                            </div>
                        ` : `
                            <form id="modal-customer-auth-form" onsubmit="customerAuth.handleFormSubmit(event, ${onSuccessCallback ? 'true' : 'false'})">
                                <div class="form-group" style="margin-bottom: 0.85rem;">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                                        <label class="form-label" style="font-size: 0.82rem; font-weight: 700; margin: 0;">Numéro de téléphone <span style="color: var(--accent);">*</span></label>
                                        <span id="modal-phone-badge" style="display: none;"></span>
                                    </div>
                                    <div style="position: relative;">
                                        <input type="tel" id="modal-auth-phone" class="form-control" placeholder="77 123 45 67" required style="padding-left: 3.2rem; font-size: 0.95rem;">
                                        <span style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); font-size: 0.85rem; font-weight: 700; color: var(--text-secondary);">+221</span>
                                    </div>
                                    <small id="modal-phone-hint" style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem; display: block;">Orange (77/78), Free (76), Expresso (70), Promobile (75)</small>
                                </div>

                                <div class="form-group" style="margin-bottom: 0.85rem;">
                                    <label class="form-label" style="font-size: 0.82rem; font-weight: 700;">Prénom et Nom <span style="color: var(--accent);">*</span></label>
                                    <input type="text" id="modal-auth-name" class="form-control" placeholder="Ex: Moussa Ndiaye" required style="font-size: 0.95rem;">
                                </div>

                                <div class="form-group" style="margin-bottom: 1.25rem;">
                                    <label class="form-label" style="font-size: 0.82rem; font-weight: 700;">Adresse de livraison habituelle (optionnel)</label>
                                    <input type="text" id="modal-auth-address" class="form-control" placeholder="Quartier, Rue, Repère à Thiès..." style="font-size: 0.95rem;">
                                </div>

                                <button type="submit" id="btn-modal-auth-submit" class="btn btn-primary btn-block" style="width: 100%; padding: 0.8rem; border-radius: 14px; font-weight: 700; font-size: 0.95rem;">
                                    ✅ Valider et Se Connecter
                                </button>
                            </form>
                        `}
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHtml);

            // Attacher validation et masque temps réel
            setTimeout(() => {
                if (typeof window.attachRealtimePhoneValidation === 'function') {
                    window.attachRealtimePhoneValidation(
                        'modal-auth-phone',
                        'modal-phone-hint',
                        'modal-phone-badge'
                    );
                }
            }, 30);
        },

        /**
         * Traite la soumission du formulaire d'authentification
         */
        handleFormSubmit(e, hasCallback) {
            e.preventDefault();
            const phoneInput = document.getElementById('modal-auth-phone') || document.getElementById('native-auth-phone');
            const nameInput = document.getElementById('modal-auth-name') || document.getElementById('native-auth-name');
            const addressInput = document.getElementById('modal-auth-address') || document.getElementById('native-auth-address');

            if (!phoneInput || !nameInput) return;

            const phone = phoneInput.value.trim();
            const name = nameInput.value.trim();
            const address = addressInput ? addressInput.value.trim() : '';

            if (!validateSenegalPhone(phone)) {
                if (typeof showToast === 'function') {
                    showToast("Numéro invalide. Utilisez un numéro à 9 chiffres (ex: 77 123 45 67)", "warning");
                }
                phoneInput.focus();
                return;
            }

            if (name.length < 2) {
                if (typeof showToast === 'function') {
                    showToast("Veuillez renseigner votre prénom et nom", "warning");
                }
                nameInput.focus();
                return;
            }

            const res = this.login({
                phone,
                name,
                address
            });

            if (res.success) {
                const modal = document.getElementById('customer-auth-modal');
                if (modal) modal.remove();

                if (window.pendingOrderContext) {
                    if (typeof window.executePendingOrder === 'function') {
                        window.executePendingOrder();
                    }
                } else if (window.location.hash.includes('/profile')) {
                    if (typeof router !== 'undefined') router.navigate('/profile');
                } else if (window.location.hash.includes('/auth')) {
                    if (typeof router !== 'undefined') router.navigate('/profile');
                }
            }
        }
    };

    /**
     * Nettoie et formate le numéro sénégalais
     */
    function cleanCustomerPhone(phoneStr) {
        if (!phoneStr) return '';
        let digits = phoneStr.replace(/[^\d+]/g, '');
        if (digits.startsWith('+221')) {
            digits = digits.replace('+221', '');
        } else if (digits.startsWith('00221')) {
            digits = digits.replace('00221', '');
        } else if (digits.startsWith('221') && digits.length === 12) {
            digits = digits.substring(3);
        }
        return digits.trim();
    }

    /**
     * Valide le préfixe sénégalais (70, 75, 76, 77, 78)
     */
    function validateSenegalPhone(phoneStr) {
        const cleaned = cleanCustomerPhone(phoneStr);
        return /^(70|75|76|77|78)\d{7}$/.test(cleaned);
    }

    window.customerAuth = customerAuth;
    window.cleanCustomerPhone = cleanCustomerPhone;
    window.validateSenegalPhone = validateSenegalPhone;

})(window);

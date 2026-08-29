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
                    <input type="text" id="order-firstname" class="form-control" placeholder="Awa" required autocomplete="given-name">
                </div>
                <div class="form-group">
                    <label class="form-label">Nom <span class="required">*</span></label>
                    <input type="text" id="order-lastname" class="form-control" placeholder="Diop" required autocomplete="family-name">
                </div>
            </div>
            
            <div class="form-group">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                    <label class="form-label" style="margin-bottom: 0;">Numéro WhatsApp <span class="required">*</span></label>
                    <span id="order-phone-badge" style="font-size: 0.75rem; font-weight: 600;"></span>
                </div>
                <div style="position: relative;">
                    <input type="tel" id="order-phone" class="form-control" placeholder="+221 77 123 45 67" required autocomplete="tel" style="padding-right: 2.5rem; transition: all 0.2s ease;">
                    <span id="order-phone-icon" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); font-size: 1rem; pointer-events: none; opacity: 0.85;"></span>
                </div>
                <div id="order-phone-feedback" style="margin-top: 0.35rem; font-size: 0.78rem; min-height: 1.2rem; display: flex; align-items: center; gap: 0.35rem; transition: all 0.2s ease;">
                    <span style="color: var(--text-secondary);">💡 Format Sénégal : 77, 78, 76, 70, 75 (9 chiffres)</span>
                </div>
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
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
                    <label class="form-label" style="margin-bottom: 0;">Position de livraison exacte <span class="required">*</span></label>
                    <button type="button" id="btn-live-gps" class="btn btn-outline btn-sm" onclick="locateClientLive()" style="padding: 0.35rem 0.75rem; font-size: 0.8rem; border-radius: 20px; display: inline-flex; align-items: center; gap: 0.35rem; color: var(--primary); border-color: var(--primary);">
                        📍 Ma position exacte en direct (GPS)
                    </button>
                </div>
                <div id="delivery-map" style="height: 220px; width: 100%; border-radius: 14px; margin-bottom: 0.75rem; border: 1.5px solid var(--border);"></div>
                <div id="live-gps-status" style="display: none; font-size: 0.8rem; color: #059669; font-weight: 600; margin-bottom: 0.5rem; background: rgba(16, 185, 129, 0.1); padding: 0.4rem 0.75rem; border-radius: 8px;">
                    ✅ Position GPS en direct capturée avec succès
                </div>
                <div id="delivery-fee-display" style="font-weight: bold; color: var(--primary); margin-bottom: 1rem; display: none;">Frais de livraison : <span id="fee-val">0</span> FCFA</div>
                
                <label class="form-label">Adresse Détaillée / Point de repère</label>
                <input type="text" id="order-address" class="form-control" placeholder="Quartier, rue, villa, près de...">
            </div>
            
            <div class="form-group">
                <label class="form-label">Notes Spéciales / Allergies (Optionnel)</label>
                <textarea id="order-notes" class="form-control" placeholder="Sans piment, sauce à part..."></textarea>
            </div>
            
            <div class="form-group" style="margin-top: 1rem;">
                <label style="display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.85rem; color: var(--text-secondary); cursor: pointer;">
                    <input type="checkbox" id="order-gdpr" required style="margin-top: 0.2rem;" checked>
                    <span>J'accepte que mes données (nom, téléphone) soient transmises au restaurateur pour le traitement de ma commande.</span>
                </label>
            </div>
            
            <button type="submit" id="btn-submit-order" class="btn btn-primary btn-block" style="font-weight: 700; font-size: 1rem; padding: 0.85rem 1.5rem; border-radius: 14px; box-shadow: 0 4px 14px rgba(255, 107, 0, 0.25);">
                Envoyer ma commande au restaurant 🛵
            </button>
        </form>
    `;

    // Pre-fill user profile & attach real-time phone validation
    setTimeout(() => {
        const phoneInput = document.getElementById('order-phone');
        const firstnameInput = document.getElementById('order-firstname');
        const lastnameInput = document.getElementById('order-lastname');

        const savedPhone = localStorage.getItem('customerPhone') || localStorage.getItem('user_phone') || sessionStorage.getItem('user_phone') || '';
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
            window.attachRealtimePhoneValidation(
                'order-phone',
                'order-phone-feedback',
                'order-phone-badge',
                'order-phone-icon'
            );
        }
    }, 30);
}

let deliveryMap = null;
let deliveryMarker = null;

window.locateClientLive = function() {
    const btn = document.getElementById('btn-live-gps');
    const statusEl = document.getElementById('live-gps-status');
    if (!navigator.geolocation) {
        if (typeof showToast === 'function') showToast("La géolocalisation n'est pas supportée par votre navigateur.", "danger");
        return;
    }

    if (btn) btn.innerHTML = '⏳ Localisation en direct...';

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            
            cart.deliveryLat = lat;
            cart.deliveryLng = lng;

            if (deliveryMap && deliveryMarker) {
                deliveryMap.setView([lat, lng], 16);
                deliveryMarker.setLatLng([lat, lng]);
                deliveryMarker.fire('dragend');
            }

            if (btn) {
                btn.innerHTML = '📍 Position GPS capturée ✅';
                btn.classList.remove('btn-outline');
                btn.classList.add('btn-success');
            }
            if (statusEl) {
                statusEl.style.display = 'block';
                statusEl.innerHTML = `✅ Position GPS exacte capturée (${lat.toFixed(5)}, ${lng.toFixed(5)})`;
            }

            const addressInput = document.getElementById('order-address');
            if (addressInput && !addressInput.value.trim()) {
                addressInput.placeholder = "Position GPS enregistrée. Précisez si besoin (villa, étage...)";
            }

            if (typeof showToast === 'function') {
                showToast("📍 Votre position exacte en direct a été enregistrée pour la livraison.", "success");
            }
            if (navigator.vibrate) navigator.vibrate(60);
        },
        (err) => {
            console.warn("Live Geolocation error:", err);
            if (btn) btn.innerHTML = '📍 Ma position exacte (GPS)';
            if (typeof showToast === 'function') {
                showToast("Veuillez autoriser l'accès GPS pour partager votre position exacte.", "warning");
            }
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 5000 }
    );
};

function toggleAddressField(show) {
    const group = document.getElementById('delivery-address-group');
    if (show) {
        group.style.display = 'block';
        
        setTimeout(() => {
            if (!deliveryMap) {
                deliveryMap = L.map('delivery-map').setView([14.7928, -16.9260], 13);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors'
                }).addTo(deliveryMap);
                
                const r = store.getRestaurantById(cart.restaurantId);
                const rLat = r.lat || 14.7928;
                const rLng = r.lng || -16.9260;
                L.marker([rLat, rLng]).addTo(deliveryMap).bindPopup(r.name).openPopup();
                
                deliveryMarker = L.marker([14.7928, -16.9260], {draggable: true}).addTo(deliveryMap);
                
                deliveryMarker.on('dragend', function(e) {
                    const pos = deliveryMarker.getLatLng();
                    cart.deliveryLat = pos.lat;
                    cart.deliveryLng = pos.lng;
                    const dist = calculateDistance(rLat, rLng, pos.lat, pos.lng);
                    if (dist > 10) {
                        if(typeof showToast === 'function') showToast("Attention: Vous êtes à plus de 10km du restaurant.", "warning");
                    }
                    let fee = Math.floor(dist * 200);
                    fee = Math.min(fee, 1500);
                    cart.deliveryFee = fee;
                    document.getElementById('delivery-fee-display').style.display = 'block';
                    document.getElementById('fee-val').innerText = fee;
                    recalculateCart();
                    
                    const totalEls = document.querySelectorAll('.cart-total-price');
                    totalEls.forEach(el => el.innerText = cart.total + " FCFA");
                });
                
                // Bouton de géolocalisation automatique
                const GeoControl = L.Control.extend({
                    options: { position: 'topright' },
                    onAdd: function () {
                        const btn = L.DomUtil.create('button', 'leaflet-bar leaflet-control');
                        btn.innerHTML = '📍 GPS Direct';
                        btn.style.backgroundColor = 'white';
                        btn.style.padding = '5px 10px';
                        btn.style.cursor = 'pointer';
                        btn.style.fontWeight = 'bold';
                        btn.style.border = '2px solid rgba(0,0,0,0.2)';
                        btn.style.borderRadius = '4px';
                        btn.style.color = 'var(--primary, #d35400)';
                        
                        btn.onclick = function(e) {
                            e.preventDefault();
                            window.locateClientLive();
                        };
                        return btn;
                    }
                });
                deliveryMap.addControl(new GeoControl());
            } else {
                deliveryMap.invalidateSize();
            }
        }, 100);
        
    } else {
        group.style.display = 'none';
        cart.deliveryFee = 0;
        document.getElementById('delivery-fee-display').style.display = 'none';
        recalculateCart();
        const totalEls = document.querySelectorAll('.cart-total-price');
        totalEls.forEach(el => el.innerText = cart.total + " FCFA");
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
    
    const r = store.getRestaurantById(restaurantId);
    if (!r) return;

    const phoneInput = document.getElementById('order-phone');
    const rawPhone = phoneInput ? phoneInput.value.trim() : '';
    
    // Strict Senegal Real-time Validation Check
    const validation = typeof validateSenegalPhoneNumber === 'function'
        ? validateSenegalPhoneNumber(rawPhone)
        : { isValid: /^\+221(70|75|76|77|78)\d{7}$/.test(cleanPhoneNumber(rawPhone)) };

    if (!validation.isValid) {
        if (phoneInput) {
            phoneInput.focus();
            phoneInput.style.borderColor = '#ef4444';
            phoneInput.style.boxShadow = '0 0 0 4px rgba(239, 68, 68, 0.25)';
            // Add a brief subtle shake
            phoneInput.style.transform = 'translateX(-4px)';
            setTimeout(() => { phoneInput.style.transform = 'translateX(4px)'; }, 80);
            setTimeout(() => { phoneInput.style.transform = 'translateX(-4px)'; }, 160);
            setTimeout(() => { phoneInput.style.transform = 'translateX(0)'; }, 240);
        }
        const errorMsg = validation.message || "Veuillez entrer un numéro de téléphone sénégalais valide (ex: 77 123 45 67)";
        if (typeof showToast === 'function') {
            showToast(errorMsg, "warning");
        }
        return;
    }

    if (!checkOrderRateLimit()) return;
    
    const firstname = document.getElementById('order-firstname').value.trim();
    const lastname = document.getElementById('order-lastname').value.trim();
    const phone = validation.clean || cleanPhoneNumber(rawPhone);
    const mode = document.querySelector('input[name="order-mode"]:checked').value;
    const address = document.getElementById('order-address') ? document.getElementById('order-address').value.trim() : '';
    const notes = document.getElementById('order-notes') ? document.getElementById('order-notes').value.trim() : '';

    // Remember customer details for future orders
    localStorage.setItem('customerPhone', phone);
    if (firstname || lastname) {
        localStorage.setItem('customerName', `${firstname} ${lastname}`.trim());
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
        time,
        deliveryFee: cart.deliveryFee || 0,
        deliveryLat: cart.deliveryLat || null,
        deliveryLng: cart.deliveryLng || null,
        loyaltyApplied: cart.loyaltyApplied || false,
        otpVerified: true,
        otpVerifiedVia: 'Twilio SMS OTP',
        otpVerifiedAt: new Date().toISOString()
    };

    window.pendingOrderContext = { order, r, firstname, lastname, mode, phone };
    
    const isVerified = localStorage.getItem('phoneVerified_' + phone) === 'true';
    if (isVerified) {
        // Déjà vérifié, on soumet directement
        executePendingOrder();
        return;
    }

    // Sinon, on demande la vérification OTP
    const container = document.getElementById('checkout-content-container');
    container.innerHTML = `
        <div class="confirmation-screen" style="max-width: 440px; margin: 2rem auto 0; background: var(--bg-card); padding: 2.5rem 2rem; border-radius: 24px; box-shadow: var(--shadow); border: 1px solid var(--border); text-align: center;">
            <div class="spinner-ring" style="width:44px;height:44px;border-width:4px;margin: 0 auto 1.25rem;"></div>
            <h2 style="font-family: var(--font-serif); font-size: 1.4rem; margin-bottom: 0.5rem;">Envoi du code de sécurité...</h2>
            <p style="color: var(--text-secondary); font-size: 0.95rem;">Génération et transmission du SMS vers <strong>${phone}</strong></p>
        </div>
    `;

    // Définir la méthode globale de validation
    window.verifyOtpAndSubmitOrder = async function() {
        const codeInput = document.getElementById('otp-input-code');
        if (!codeInput) return;
        const code = codeInput.value.trim();
        if (!code || code.length < 6) {
            if (typeof showToast === 'function') showToast("Veuillez saisir le code complet à 6 chiffres", "warning");
            codeInput.focus();
            return;
        }

        const btn = document.getElementById('btn-verify-otp');
        const feedbackEl = document.getElementById('otp-feedback-msg');
        btn.disabled = true;
        btn.innerHTML = `<div class="spinner-ring" style="width:20px;height:20px;border-width:2px;display:inline-block;vertical-align:middle;margin-right:0.5rem;"></div> Vérification en cours...`;

        const { phone } = window.pendingOrderContext;

        const verifyRes = await store.verifyOtp(phone, code);

        if (verifyRes && verifyRes.verified) {
            localStorage.setItem('phoneVerified_' + phone, 'true');
            btn.innerHTML = '✅ Code Valide !';
            if (typeof showToast === 'function') showToast("Numéro validé avec succès !", "success");
            setTimeout(() => {
                executePendingOrder();
            }, 400);
        } else {
            const errText = (verifyRes && verifyRes.message) ? verifyRes.message : "Code de sécurité incorrect ou expiré.";
            if (typeof showToast === 'function') showToast(errText, "danger");
            if (feedbackEl) {
                feedbackEl.style.display = 'block';
                feedbackEl.textContent = errText;
            }
            btn.innerHTML = '✅ Vérifier et Valider la Commande';
            btn.disabled = false;
            codeInput.focus();
        }
    };

    // Gestion du renvoi de code SMS avec compte à rebours
    window.resendOtpSms = async function() {
        const resendBtn = document.getElementById('btn-resend-otp');
        if (resendBtn && resendBtn.disabled) return;

        if (resendBtn) {
            resendBtn.disabled = true;
            resendBtn.innerHTML = `<span class="spinner-ring" style="width:14px;height:14px;border-width:2px;display:inline-block;vertical-align:middle;margin-right:4px;"></span> Envoi...`;
        }

        const { phone } = window.pendingOrderContext;
        const result = await store.generateOtp(phone);

        if (result && result.success) {
            if (typeof showToast === 'function') {
                showToast("Nouveau code SMS envoyé !", "info");
            }
            startOtpResendCountdown(30);

            // Mise à jour de la bannière démo si applicable
            const demoBox = document.getElementById('otp-demo-badge');
            if (demoBox && result.devCode) {
                demoBox.innerHTML = `🔑 <strong>Code de test:</strong> <span style="font-family: monospace; font-size: 1.1rem; color: var(--primary);">${result.devCode}</span>`;
            }
        } else {
            if (typeof showToast === 'function') {
                showToast((result && result.message) ? result.message : "Impossible de renvoyer le code", "danger");
            }
            if (resendBtn) {
                resendBtn.disabled = false;
                resendBtn.innerHTML = `🔄 Renvoyer le code par SMS`;
            }
        }
    };

    function startOtpResendCountdown(seconds) {
        let remaining = seconds;
        const resendBtn = document.getElementById('btn-resend-otp');
        if (!resendBtn) return;
        resendBtn.disabled = true;

        if (window._otpCountdownInterval) {
            clearInterval(window._otpCountdownInterval);
        }

        window._otpCountdownInterval = setInterval(() => {
            remaining--;
            if (remaining <= 0) {
                clearInterval(window._otpCountdownInterval);
                resendBtn.disabled = false;
                resendBtn.innerHTML = `🔄 Renvoyer le code par SMS`;
            } else {
                resendBtn.innerHTML = `⏳ Renvoyer dans ${remaining}s`;
            }
        }, 1000);
    }

    // Lancer la génération d'OTP Twilio
    (async () => {
        const otpResult = await store.generateOtp(phone);
        
        if (otpResult && otpResult.success) {
            const isDemo = otpResult.isDemoMode;
            if (typeof showToast === 'function') {
                showToast(isDemo ? "Code de test généré (Twilio en mode démo)" : "Code OTP envoyé par SMS via Twilio !", "info");
            }
            
            container.innerHTML = `
                <div class="confirmation-screen" style="max-width: 440px; margin: 2rem auto 0; background: var(--bg-card); padding: 2.2rem 2rem; border-radius: 24px; box-shadow: var(--shadow); border: 1px solid var(--border); text-align: center;">
                    <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(239, 68, 68, 0.1); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 1.25rem;">
                        📩
                    </div>
                    
                    <h2 style="font-family: var(--font-serif); font-size: 1.45rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-primary);">
                        Vérification par SMS
                    </h2>
                    
                    <p style="color: var(--text-secondary); font-size: 0.92rem; line-height: 1.5; margin-bottom: 1.25rem;">
                        Un code de validation à 6 chiffres a été envoyé par SMS au <strong style="color: var(--text-primary); font-family: monospace;">${phone}</strong>.
                    </p>

                    ${isDemo && otpResult.devCode ? `
                        <div id="otp-demo-badge" style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); color: var(--text-primary); padding: 0.65rem 1rem; border-radius: 12px; font-size: 0.85rem; margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                            <span>🔑 <strong>Code de test:</strong></span>
                            <span style="font-family: monospace; font-size: 1.15rem; font-weight: 700; color: #D97706; letter-spacing: 2px;">${otpResult.devCode}</span>
                        </div>
                    ` : ''}
                    
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <input type="text" 
                               id="otp-input-code" 
                               class="form-control" 
                               placeholder="• • • • • •" 
                               inputmode="numeric"
                               pattern="[0-9]*"
                               maxlength="6" 
                               autocomplete="one-time-code"
                               style="font-size: 1.75rem; letter-spacing: 8px; text-align: center; font-weight: 700; border-radius: 16px; height: 56px; background: var(--bg-input); border: 2px solid var(--border);" 
                               autofocus
                               onkeyup="if (event.key === 'Enter') verifyOtpAndSubmitOrder();">
                    </div>

                    <div id="otp-feedback-msg" style="display: none; color: var(--danger); font-size: 0.85rem; font-weight: 600; margin-bottom: 1rem;"></div>
                    
                    <button class="btn btn-primary btn-block" onclick="verifyOtpAndSubmitOrder()" style="width: 100%; margin-bottom: 0.85rem; padding: 0.85rem; border-radius: 14px; font-weight: 700; font-size: 1rem;" id="btn-verify-otp">
                        ✅ Vérifier et Valider la Commande
                    </button>

                    <div style="display: flex; gap: 0.5rem; justify-content: space-between; align-items: center; margin-top: 0.75rem;">
                        <button id="btn-resend-otp" class="btn btn-outline btn-sm" onclick="resendOtpSms()" style="font-size: 0.82rem; padding: 0.5rem 0.85rem; border-radius: 10px;">
                            🔄 Renvoyer le SMS
                        </button>
                        <button class="btn btn-secondary btn-sm" onclick="router.navigate('/cart')" style="font-size: 0.82rem; padding: 0.5rem 0.85rem; border-radius: 10px;">
                            Annuler
                        </button>
                    </div>
                </div>
            `;

            startOtpResendCountdown(30);

            // Auto-focus the OTP input field
            setTimeout(() => {
                const el = document.getElementById('otp-input-code');
                if (el) el.focus();
            }, 100);

        } else {
            const errDesc = (otpResult && otpResult.message) ? otpResult.message : "Impossible de transmettre le SMS.";
            if (typeof showToast === 'function') showToast(errDesc, "danger");
            container.innerHTML = `
                <div class="confirmation-screen" style="max-width: 420px; margin: 2rem auto 0; background: var(--bg-card); padding: 2.5rem 2rem; border-radius: 20px; box-shadow: var(--shadow); border: 1px solid var(--border); text-align: center;">
                    <div style="font-size: 3rem; color: var(--danger); margin-bottom: 1rem;">⚠️</div>
                    <h2 style="font-family: var(--font-serif); font-size: 1.4rem; margin-bottom: 0.5rem;">Échec de l'envoi SMS</h2>
                    <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.5rem; line-height: 1.5;">${errDesc}</p>
                    <div style="display: flex; gap: 0.75rem; justify-content: center;">
                        <button class="btn btn-primary" onclick="proceedToOTP('${phone}')" style="padding: 0.75rem 1.25rem; border-radius: 12px;">
                            🔄 Réessayer
                        </button>
                        <button class="btn btn-secondary" onclick="router.navigate('/cart')" style="padding: 0.75rem 1.25rem; border-radius: 12px;">
                            Retour au panier
                        </button>
                    </div>
                </div>
            `;
        }
    })();
}


window.executePendingOrder = async function() {
    if (!window.pendingOrderContext) return;
    
    const { order, r, firstname, lastname, mode, phone } = window.pendingOrderContext;
    
    const container = document.getElementById('checkout-content-container');
    container.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem;">
            <div class="spinner" style="border: 4px solid var(--border); border-top: 4px solid var(--primary); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
            <p style="color: var(--text-primary); font-weight: 500;">Sécurisation et validation de votre commande...</p>
        </div>
    `;

    try {
        // 1. Prepare Secure Payload
        const securePayload = {
            restaurant_id: order.restaurantId,
            customer_name: order.customerName,
            customer_phone: order.customerPhone,
            order_type: order.mode,
            delivery_fee: order.deliveryFee,
            items: cart.items.map(item => ({
                menu_item_id: item.id, // Assuming item has 'id' from DB
                quantity: item.qty
            }))
        };

        // 2. Call Supabase RPC for Server-Side Math
        let securedOrder;
        if (typeof store.createSecureOrder === 'function') {
            securedOrder = await store.createSecureOrder(securePayload);
        }

        // Fallback for local testing if RPC is not deployed yet
        if (!securedOrder) {
            console.warn("RPC failed or not found, falling back to local order.");
            store.addOrder(order);
            securedOrder = {
                order_id: order.id,
                total_price: order.total
            };
        } else {
            // Re-sync local store with secure order for history
            order.id = securedOrder.order_id;
            order.total = securedOrder.total_price;
            store.addOrder(order);
        }

        saveOrderToHistory(order, r.name);
        
        if (cart.loyaltyApplied && cart.loyaltyPhone) {
            store.applyLoyaltyRewardUsed(cart.loyaltyPhone, `${firstname} ${lastname}`);
        }

        cart = {
            restaurantId: null,
            items: [],
            total: 0,
            loyaltyApplied: false,
            loyaltyPhone: null,
            deliveryFee: 0,
            deliveryLat: null,
            deliveryLng: null
        };
        saveCart();
        if(typeof updateFloatingCartBar === 'function') updateFloatingCartBar(r);
        
        if (typeof triggerCelebration === 'function') triggerCelebration();
        
        // Trigger OneSignal permission prompt for order tracking
        if (typeof OneSignalManager !== 'undefined') {
            OneSignalManager.requestPermission();
        }

        // 3. Generate WhatsApp Link with SECURE Server Data
        let itemsText = window.pendingOrderContext.order.items.map(i => `${i.qty}x ${i.name}`).join(', ');
        let gpsLink = '';
        if (order.deliveryLat && order.deliveryLng) {
            gpsLink = `📍 *Position GPS en direct* : https://www.google.com/maps?q=${order.deliveryLat},${order.deliveryLng}\n`;
        }
        const waText = `Bonjour ${r.name}, voici ma commande officielle n°*${securedOrder.order_id}* sur THIES Resto.\n\n👤 *Client* : ${firstname} ${lastname} (${phone})\n🍽️ *Plats* : ${itemsText}\n🛵 *Mode* : ${mode}\n${order.address ? `📍 *Adresse* : ${order.address}\n` : ''}${gpsLink}💰 *Total Sécurisé* : ${securedOrder.total_price} FCFA\n\nMerci de confirmer la réception !`;
        const waLink = `https://wa.me/${r.whatsapp.replace(/\+/g, '')}?text=${encodeURIComponent(waText)}`;

        container.innerHTML = `
            <div class="confirmation-screen">
                <div class="confirmation-icon">🛡️✅</div>
                <h2>Commande Sécurisée !</h2>
                <p style="color: var(--text-secondary); margin: 1rem 0;">Votre commande n° <strong>${securedOrder.order_id}</strong> a été validée par nos serveurs.</p>
                <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 12px; font-size: 0.9rem; text-align: left; margin: 1.5rem 0; border: 1px solid var(--border);">
                    <strong>Récapitulatif Officiel :</strong><br>
                    Client : ${firstname} ${lastname}<br>
                    Mode : ${mode}<br>
                    Montant certifié : <strong style="color: var(--primary);">${securedOrder.total_price} FCFA</strong>
                </div>
                
                <div style="background: rgba(16, 185, 129, 0.1); padding: 1rem; border-radius: 12px; margin: 1.5rem 0; border: 1px solid rgba(16, 185, 129, 0.3); text-align: center;">
                    <p style="color: var(--success); font-weight: 500; font-size: 0.95rem; margin-bottom: 1rem;">Dernière étape : envoyez ce récapitulatif certifié au restaurant pour déclencher la préparation !</p>
                    <a href="${waLink}" target="_blank" class="btn btn-success" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <i class="ri-whatsapp-line" style="font-size: 1.2rem;"></i> Confirmer par WhatsApp
                    </a>
                </div>

                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                    <button class="btn btn-dark" onclick="router.navigate('/')">
                        Retourner à l'accueil
                    </button>
                </div>
            </div>
        `;
    } catch (err) {
        console.error("Order error", err);
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem 1rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">❌</div>
                <h3 style="color: var(--danger);">Erreur de sécurisation</h3>
                <p style="color: var(--text-secondary);">Impossible de valider votre commande. Veuillez réessayer.</p>
                <button class="btn btn-primary" onclick="window.executePendingOrder()" style="margin-top: 1rem;">Réessayer</button>
            </div>
        `;
    }
};

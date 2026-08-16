// 2. Checkout Panel
function renderCheckoutTab(r) {
    const cart = typeof Alpine !== 'undefined' ? Alpine.store('cart') : window.cart;
    const container = document.getElementById('checkout-content-container');
    
    if (cart.items.length === 0) {
        container.innerHTML = `
            <div class="text-center-p4">
                <span class="checkout-icon">🛒</span>
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
                <label class="form-label">Pointer votre position sur la carte <span class="required">*</span></label>
                <div id="delivery-map" style="height: 200px; width: 100%; border-radius: 12px; margin-bottom: 1rem; border: 1px solid var(--border);"></div>
                <div id="delivery-fee-display" style="font-weight: bold; color: var(--primary); margin-bottom: 1rem; display: none;">Frais de livraison : <span id="fee-val">0</span> FCFA</div>
                
                <label class="form-label">Adresse Détaillée (Optionnel)</label>
                <input type="text" id="order-address" class="form-control" placeholder="Indication supplémentaire...">
            </div>
            
                        <div class="form-group">
                <label class="form-label">Notes Spéciales / Allergies (Optionnel)</label>
                <textarea id="order-notes" class="form-control" placeholder="Sans piment, sauce à part..."></textarea>
            </div>
            
            <div class="form-group" style="margin-top: 1rem;">
                <label style="display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.85rem; color: var(--text-secondary); cursor: pointer;">
                    <input type="checkbox" id="order-gdpr" required style="margin-top: 0.2rem;">
                    <span>J'accepte que mes données (nom, téléphone) soient transmises au restaurateur pour le traitement de ma commande.</span>
                </label>
            </div>
            
            <button type="submit" class="btn btn-primary btn-block">
                Envoyer ma commande au restaurant 🛵
            </button>
        </form>
    `;
}

let deliveryMap = null;
let deliveryMarker = null;

function toggleAddressField(show) {
    const cart = typeof Alpine !== 'undefined' ? Alpine.store('cart') : window.cart;
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
                        btn.innerHTML = '📍 Me localiser';
                        btn.style.backgroundColor = 'white';
                        btn.style.padding = '5px 10px';
                        btn.style.cursor = 'pointer';
                        btn.style.fontWeight = 'bold';
                        btn.style.border = '2px solid rgba(0,0,0,0.2)';
                        btn.style.borderRadius = '4px';
                        btn.style.color = 'var(--primary, #d35400)';
                        
                        btn.onclick = function(e) {
                            e.preventDefault();
                            if(navigator.geolocation) {
                                btn.innerHTML = '⏳...';
                                navigator.geolocation.getCurrentPosition(pos => {
                                    const lat = pos.coords.latitude;
                                    const lng = pos.coords.longitude;
                                    deliveryMap.setView([lat, lng], 15);
                                    deliveryMarker.setLatLng([lat, lng]);
                                    deliveryMarker.fire('dragend'); // Recalculate distance & fees
                                    btn.innerHTML = '📍 Me localiser';
                                    if(navigator.vibrate) navigator.vibrate(50);
                                }, err => {
                                    if(typeof showToast === 'function') showToast("Géolocalisation refusée ou impossible.", "error");
                                    btn.innerHTML = '📍 Me localiser';
                                });
                            }
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
    const cart = typeof Alpine !== 'undefined' ? Alpine.store('cart') : window.cart;
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
        time,
        deliveryFee: cart.deliveryFee || 0,
        deliveryLat: cart.deliveryLat || null,
        deliveryLng: cart.deliveryLng || null,
        loyaltyApplied: cart.loyaltyApplied || false
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
        <div class="confirmation-screen">
            <div class="spinner-ring" style="width:40px;height:40px;border-width:4px;margin: 0 auto 1rem;"></div>
            <h2>Génération du code de sécurité...</h2>
            <p style="color: var(--text-secondary);">Envoi d'un code OTP sécurisé au <strong>${phone}</strong></p>
        </div>
    `;

    // Définir la méthode globale de validation
    window.verifyOtpAndSubmitOrder = async function() {
        const code = document.getElementById('otp-input-code').value.trim();
        if (!code || code.length < 6) {
            if (typeof showToast === 'function') showToast("Veuillez entrer le code à 6 chiffres", "warning");
            return;
        }

        const btn = document.getElementById('btn-verify-otp');
        btn.disabled = true;
        btn.innerHTML = `<div class="spinner-ring" style="width:20px;height:20px;border-width:2px;display:inline-block;vertical-align:middle;margin-right:0.5rem;"></div> Vérification...`;

        const { phone } = window.pendingOrderContext;

        // Appel RPC réel pour vérifier le code
        const isCodeValid = await store.verifyOtp(phone, code);

        if (isCodeValid) {
            localStorage.setItem('phoneVerified_' + phone, 'true');
            btn.innerHTML = '✅ Code Valide !';
            executePendingOrder();
        } else {
            if (typeof showToast === 'function') showToast("Code de sécurité incorrect ou expiré.", "danger");
            btn.innerHTML = '✅ Vérifier et Commander';
            btn.disabled = false;
        }
    };

        // Lancer la génération d'OTP en tâche de fond
    window.startOtpTimer = function() {
        let timeLeft = 60;
        const resendBtn = document.getElementById('btn-resend-otp');
        if(!resendBtn) return;
        resendBtn.disabled = true;
        
        const timer = setInterval(() => {
            timeLeft--;
            if (timeLeft <= 0) {
                clearInterval(timer);
                resendBtn.disabled = false;
                resendBtn.innerHTML = '🔄 Renvoyer le code';
            } else {
                resendBtn.innerHTML = `⏳ Renvoyer le code dans ${timeLeft}s`;
            }
        }, 1000);
    };

    window.resendOtp = async function() {
        const { phone } = window.pendingOrderContext;
        const resendBtn = document.getElementById('btn-resend-otp');
        resendBtn.disabled = true;
        resendBtn.innerHTML = 'Envoi...';
        
        const otpSent = await store.generateOtp(phone);
        if (otpSent) {
            if (typeof showToast === 'function') showToast("Un nouveau code a été envoyé !", "info");
            window.startOtpTimer();
        } else {
            if (typeof showToast === 'function') showToast("Erreur lors de l'envoi du code.", "danger");
            resendBtn.disabled = false;
            resendBtn.innerHTML = '🔄 Renvoyer le code';
        }
    };

    (async () => {
        const otpSent = await store.generateOtp(phone);
        
        if (otpSent) {
            if (typeof showToast === 'function') showToast("Code de sécurité généré (Voir Console pour test) !", "info");
            
            container.innerHTML = `
                <div class="confirmation-screen checkout-card">
                    <div class="checkout-icon" style="font-size: 3rem; margin-bottom: 1rem;">💬</div>
                    <h2>Vérification SMS</h2>
                    <p class="checkout-subtitle" style="margin-bottom: 1.5rem;">Veuillez entrer le code de sécurité reçu par SMS au <strong>${phone}</strong>.</p>
                    
                    <div class="form-group">
                        <input type="text" id="otp-input-code" class="form-control" placeholder="000000" style="font-size: 2rem; letter-spacing: 10px; text-align: center; font-weight: bold; margin-bottom: 1.5rem; height: 60px;" maxlength="6">
                    </div>
                    
                    <button class="btn btn-primary" onclick="verifyOtpAndSubmitOrder()" style="width: 100%; margin-bottom: 1rem; padding: 1rem; font-size: 1.1rem;" id="btn-verify-otp">
                        ✅ Vérifier et Commander
                    </button>
                    
                    <button class="btn btn-outline" id="btn-resend-otp" onclick="resendOtp()" style="width: 100%; margin-bottom: 1rem; background: transparent; border: 1px solid var(--border); color: var(--text-secondary);" disabled>
                        ⏳ Renvoyer le code dans 60s
                    </button>

                    <button class="btn btn-link" onclick="router.navigate('/')" style="width: 100%; color: var(--text-secondary); text-decoration: underline;">
                        Annuler la commande
                    </button>
                </div>
            `;
            
            // Démarrer le timer
            setTimeout(window.startOtpTimer, 100);
        } else {
            if (typeof showToast === 'function') showToast("Impossible d'envoyer le SMS. Format de numéro incorrect ?", "danger");
            container.innerHTML = `
                <div class="confirmation-screen checkout-card">
                    <div style="font-size: 3rem; color: var(--danger); margin-bottom: 1rem;">⚠️</div>
                    <h2>Échec de l'envoi</h2>
                    <p class="checkout-subtitle">Nous n'avons pas pu valider votre numéro <strong>${phone}</strong>.</p>
                    <button class="btn btn-secondary" onclick="router.navigate('/')" style="width: 100%;">
                        Retour à l'accueil
                    </button>
                </div>
            `;
        }
    })();
}


window.executePendingOrder = async function() {
    const cart = typeof Alpine !== 'undefined' ? Alpine.store('cart') : window.cart;
    if (!window.pendingOrderContext) return;
    
    const { order, r, firstname, lastname, mode, phone } = window.pendingOrderContext;
    
    const container = document.getElementById('checkout-content-container');
    container.innerHTML = `
        <div class="text-center-p3">
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
            throw new Error("Impossible de sécuriser la commande sur nos serveurs.");
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

        cart.clear();
        if(typeof updateFloatingCartBar === 'function') updateFloatingCartBar(r);
        
        if (typeof triggerCelebration === 'function') triggerCelebration();

        // 3. Generate WhatsApp Link with SECURE Server Data
        let itemsText = window.pendingOrderContext.order.items.map(i => `${i.qty}x ${i.name}`).join(', ');
        const waText = `Bonjour ${r.name}, voici ma commande officielle n°*${securedOrder.order_id}* sur THIES Resto.\n\n👤 *Client* : ${firstname} ${lastname} (${phone})\n🍽️ *Plats* : ${itemsText}\n🛵 *Mode* : ${mode}\n${order.address ? `📍 *Adresse* : ${order.address}\n` : ''}💰 *Total Sécurisé* : ${securedOrder.total_price} FCFA\n\nMerci de confirmer la réception !`;
        const waLink = `https://wa.me/${r.whatsapp.replace(/\+/g, '')}?text=${encodeURIComponent(waText)}`;

        container.innerHTML = DOMPurify.sanitize(`
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
        `);
    } catch (err) {
        console.error("Order error", err);
        container.innerHTML = `
            <div class="text-center-p3">
                <div class="checkout-icon">❌</div>
                <h3 style="color: var(--danger);">Erreur de sécurisation</h3>
                <p style="color: var(--text-secondary);">Impossible de valider votre commande. Veuillez réessayer.</p>
                <button class="btn btn-primary" onclick="window.executePendingOrder()" style="margin-top: 1rem;">Réessayer</button>
            </div>
        `;
    }
};


// Export to window for Vite
window.renderCheckoutTab = renderCheckoutTab;
window.toggleAddressField = toggleAddressField;
window.checkOrderRateLimit = checkOrderRateLimit;
window.submitSimpleOrder = submitSimpleOrder;
window.deliveryMap = deliveryMap;
window.deliveryMarker = deliveryMarker;


window.renderPhase3Checkout = function(container, r) {
    const cart = typeof Alpine !== 'undefined' ? Alpine.store('cart') : window.cart;
    
    // Setup local vars for bindings if needed
    const customerPhone = localStorage.getItem('customerPhone') || '';
    const customerName = localStorage.getItem('customerName') || '';

    // Calculate initial total
    const deliveryFee = cart.deliveryFee || 0;
    const total = cart.subtotal + deliveryFee;

    container.innerHTML = `
        <div style="padding: 1rem 1.5rem; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 1rem; position: sticky; top: 0; background: var(--bg-base); z-index: 10;">
            <button onclick="window.router.navigate('/cart')" style="background: none; border: none; font-size: 1.5rem; color: var(--text-primary); cursor: pointer;">←</button>
            <h2 style="margin: 0; font-size: 1.2rem;">Validation Commande</h2>
        </div>
        
        <div style="padding: 1.5rem; animation: fadeIn 0.3s ease;">
            
            <!-- Section 1: Coordonnées -->
            <div class="glass-panel" style="padding: 1.5rem; border-radius: 16px; border: 1px solid var(--border); margin-bottom: 1.5rem;">
                <h3 style="margin: 0 0 1rem 0; font-size: 1.1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <span style="background: var(--primary); color: white; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 0.8rem;">1</span> 
                    Mes Coordonnées
                </h3>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.9rem;">Prénom et Nom *</label>
                    <input type="text" id="checkout-name" class="form-control" placeholder="Ex: Awa Ndiaye" value="${customerName}" required>
                </div>
                
                <div style="margin-bottom: 0.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.9rem;">Numéro WhatsApp *</label>
                    <input type="tel" id="checkout-phone" class="form-control" placeholder="+221 77 123 45 67" value="${customerPhone}" required>
                </div>
            </div>

            <!-- Section 2: Mode de Réception -->
            <div class="glass-panel" style="padding: 1.5rem; border-radius: 16px; border: 1px solid var(--border); margin-bottom: 1.5rem;">
                <h3 style="margin: 0 0 1rem 0; font-size: 1.1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <span style="background: var(--primary); color: white; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 0.8rem;">2</span> 
                    Mode de Réception
                </h3>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                    <label style="cursor: pointer; position: relative;">
                        <input type="radio" name="orderType" value="delivery" onchange="window.toggleCheckoutDelivery(this.value)" checked style="position: absolute; opacity: 0;">
                        <div class="order-type-btn delivery-active" id="btn-type-delivery" style="padding: 1rem; text-align: center; border-radius: 12px; border: 2px solid var(--primary); background: rgba(242, 107, 33, 0.1); transition: all 0.2s;">
                            <div style="font-size: 1.5rem; margin-bottom: 0.25rem;">🛵</div>
                            <div style="font-weight: 600; color: var(--text-primary);">Livraison</div>
                        </div>
                    </label>
                    
                    <label style="cursor: pointer; position: relative;">
                        <input type="radio" name="orderType" value="pickup" onchange="window.toggleCheckoutDelivery(this.value)" style="position: absolute; opacity: 0;">
                        <div class="order-type-btn" id="btn-type-pickup" style="padding: 1rem; text-align: center; border-radius: 12px; border: 1px solid var(--border); background: var(--bg-card); transition: all 0.2s;">
                            <div style="font-size: 1.5rem; margin-bottom: 0.25rem;">🛍️</div>
                            <div style="font-weight: 600; color: var(--text-primary);">À Emporter</div>
                        </div>
                    </label>
                </div>
                
                <div id="checkout-delivery-section" style="animation: fadeIn 0.3s ease;">
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.9rem;">Quartier / Adresse *</label>
                        <input type="text" id="checkout-address" class="form-control" placeholder="Ex: Grand Thiès, près de...">
                    </div>
                    
                    <!-- Geo Option -->
                    <button type="button" class="btn btn-secondary btn-block" onclick="window.openGeoModal()" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 0.9rem; padding: 0.75rem; background: var(--bg-secondary); color: var(--text-primary);">
                        <span>📍</span> Utiliser ma position GPS
                    </button>
                    <input type="hidden" id="checkout-lat">
                    <input type="hidden" id="checkout-lng">
                </div>
            </div>

            <!-- Section 3: Note / Instructions -->
            <div class="glass-panel" style="padding: 1.5rem; border-radius: 16px; border: 1px solid var(--border); margin-bottom: 1.5rem;">
                <h3 style="margin: 0 0 1rem 0; font-size: 1.1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <span style="background: var(--primary); color: white; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 0.8rem;">3</span> 
                    Instructions (Optionnel)
                </h3>
                <textarea id="checkout-note" class="form-control" rows="2" placeholder="Précisions pour le livreur ou le restaurant..."></textarea>
            </div>

            <!-- Section 4: Récapitulatif et Validation -->
            <div class="glass-panel" style="padding: 1.5rem; border-radius: 16px; border: 1px solid var(--border); margin-bottom: 1.5rem;">
                <h3 style="margin: 0 0 1rem 0; font-size: 1.1rem;">Récapitulatif</h3>
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem; color: var(--text-secondary);">
                    <span>Sous-total (${cart.items.reduce((a,b)=>a+b.qty, 0)} articles)</span>
                    <span>${cart.subtotal.toLocaleString()} FCFA</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; color: var(--text-secondary);" id="checkout-delivery-row">
                    <span>Frais de livraison</span>
                    <span id="checkout-delivery-fee">${deliveryFee > 0 ? deliveryFee.toLocaleString() + ' FCFA' : 'À calculer'}</span>
                </div>
                
                <hr style="border: 0; border-top: 1px dashed var(--border); margin: 1rem 0;">
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 1.5rem; font-size: 1.3rem; font-weight: 700; color: var(--text-primary);">
                    <span>Total à payer</span>
                    <span id="checkout-total-price" style="color: var(--primary);">${total.toLocaleString()} FCFA</span>
                </div>
                
                <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem; display: flex; gap: 0.75rem; align-items: flex-start;">
                    <span style="font-size: 1.2rem;">💵</span>
                    <div>
                        <div style="font-weight: 600; color: #10b981; font-size: 0.95rem; margin-bottom: 0.25rem;">Paiement en espèces</div>
                        <div style="font-size: 0.85rem; color: var(--text-secondary);">Vous paierez directement à la livraison.</div>
                    </div>
                </div>

                <div style="display: flex; gap: 0.5rem; align-items: flex-start; margin-bottom: 1.5rem;">
                    <input type="checkbox" id="checkout-rgpd" style="margin-top: 0.25rem; accent-color: var(--primary);">
                    <label for="checkout-rgpd" style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4;">
                        J'accepte les <a href="#/cgv" style="color: var(--primary); text-decoration: underline;">conditions générales de vente</a> et consens à l'utilisation de mon numéro pour le suivi.
                    </label>
                </div>

                <button id="btn-submit-order" class="btn btn-primary btn-block" style="font-size: 1.1rem; padding: 1rem; border-radius: 30px; box-shadow: 0 4px 15px rgba(242,107,33,0.4);" onclick="window.submitPhase3Order('${r ? r.id : ''}')">
                    CONFIRMER LA COMMANDE 🚀
                </button>
            </div>
            
        </div>
    `;
};

window.toggleCheckoutDelivery = function(type) {
    const section = document.getElementById('checkout-delivery-section');
    const btnDelivery = document.getElementById('btn-type-delivery');
    const btnPickup = document.getElementById('btn-type-pickup');
    
    if (type === 'delivery') {
        section.style.display = 'block';
        btnDelivery.style.border = '2px solid var(--primary)';
        btnDelivery.style.background = 'rgba(242, 107, 33, 0.1)';
        btnPickup.style.border = '1px solid var(--border)';
        btnPickup.style.background = 'var(--bg-card)';
        
        // Restore delivery fee if we have one
        const cart = typeof Alpine !== 'undefined' ? Alpine.store('cart') : window.cart;
        document.getElementById('checkout-delivery-row').style.display = 'flex';
        document.getElementById('checkout-total-price').textContent = (cart.subtotal + (cart.deliveryFee || 0)).toLocaleString() + ' FCFA';
    } else {
        section.style.display = 'none';
        btnPickup.style.border = '2px solid var(--primary)';
        btnPickup.style.background = 'rgba(242, 107, 33, 0.1)';
        btnDelivery.style.border = '1px solid var(--border)';
        btnDelivery.style.background = 'var(--bg-card)';
        
        // Remove delivery fee from total
        const cart = typeof Alpine !== 'undefined' ? Alpine.store('cart') : window.cart;
        document.getElementById('checkout-delivery-row').style.display = 'none';
        document.getElementById('checkout-total-price').textContent = cart.subtotal.toLocaleString() + ' FCFA';
    }
};

window.submitPhase3Order = async function(restaurantId) {
    const btn = document.getElementById('btn-submit-order');
    const cart = typeof Alpine !== 'undefined' ? Alpine.store('cart') : window.cart;
    
    const name = document.getElementById('checkout-name').value.trim();
    const phone = document.getElementById('checkout-phone').value.trim();
    const rgpd = document.getElementById('checkout-rgpd').checked;
    const type = document.querySelector('input[name="orderType"]:checked').value;
    const address = type === 'delivery' ? document.getElementById('checkout-address').value.trim() : '';
    const note = document.getElementById('checkout-note').value.trim();
    
    if (!name || !phone) {
        if(typeof showToast==='function') showToast("Veuillez remplir vos coordonnées", "warning");
        return;
    }
    
    if (type === 'delivery' && !address) {
        if(typeof showToast==='function') showToast("Veuillez indiquer une adresse de livraison", "warning");
        return;
    }
    
    if (!rgpd) {
        if(typeof showToast==='function') showToast("Veuillez accepter les conditions (RGPD)", "warning");
        return;
    }
    
    // UI Loading state
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-ring" style="width:20px;height:20px;border-width:2px;display:inline-block;vertical-align:middle;margin-right:10px;"></span> Traitement...';
    
    // Save to local storage for convenience next time
    localStorage.setItem('customerName', name);
    localStorage.setItem('customerPhone', phone);
    if (address) localStorage.setItem('customerAddress', address);
    
    // Construct order payload
    const orderPayload = {
        restaurantId: restaurantId,
        customerName: name,
        customerPhone: phone,
        orderType: type,
        address: address,
        note: note,
        lat: document.getElementById('checkout-lat').value || null,
        lng: document.getElementById('checkout-lng').value || null
    };

    // Note: We use existing window.executeOrder from ui-checkout.js
    try {
        if (typeof window.executeOrder === 'function') {
            // For now, we skip SMS verification logic and directly execute
            // In Phase 3.5 we will intercept here to show OTP modal.
            await window.executeOrder(orderPayload);
        } else {
            throw new Error("window.executeOrder is missing");
        }
    } catch (err) {
        console.error(err);
        btn.disabled = false;
        btn.innerHTML = 'CONFIRMER LA COMMANDE 🚀';
        if(typeof showToast==='function') showToast("Erreur lors de l'envoi de la commande", "danger");
    }
};

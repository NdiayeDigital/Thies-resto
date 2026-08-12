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
            <h2>Vérification du numéro...</h2>
            <p style="color: var(--text-secondary);">Une simulation de code SMS est en cours de préparation pour le <strong>${phone}</strong></p>
        </div>
    `;
    
    // MOCK OTP LOGIC (Since Twilio isn't configured, we simulate an SMS)
    if(typeof showToast === 'function') showToast("Vérification en cours... Simulation SMS", "info");
    window.verifyOtpAndSubmitOrder = async function() {
        const code = document.getElementById('otp-input-code').value.trim();
        if (!code || code.length < 6) {
            if(typeof showToast === 'function') showToast("Veuillez entrer le code à 6 chiffres", "warning");
            return;
        }
        
        const btn = document.getElementById('btn-verify-otp');
        btn.disabled = true;
        btn.innerHTML = `<div class="spinner-ring" style="width:20px;height:20px;border-width:2px;display:inline-block;vertical-align:middle;margin-right:0.5rem;"></div> Vérification...`;
        
        const { phone } = window.pendingOrderContext;
        
        // MOCK VERIFICATION
        if (code === '123456') {
            // Validation réussie !
            localStorage.setItem('phoneVerified_' + phone, 'true');
            btn.innerHTML = '✅ Code Valide !';
            
            // On soumet la vraie commande
            executePendingOrder();
        } else {
            if(typeof showToast === 'function') showToast("Code invalide. Veuillez réessayer.", "danger");
            btn.innerHTML = '✅ Vérifier et Commander';
            btn.disabled = false;
        }
    }
    
    // Simulate network delay
    setTimeout(() => {
        if(typeof showToast === 'function') showToast("SMS de démo envoyé ! Code : 123456", "info");
        
        container.innerHTML = `
            <div class="confirmation-screen" style="max-width: 400px; margin: 2rem auto 0; background: var(--bg-card); padding: 2rem; border-radius: 20px; box-shadow: var(--shadow); border: 1px solid var(--border);">
                <div style="font-size: 3rem; margin-bottom: 1rem;">📱</div>
                <h2>Vérification de Sécurité</h2>
                <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Veuillez entrer le code à 6 chiffres envoyé au <strong>${phone}</strong>.</p>
                <p style="font-size:0.8rem; color:var(--primary); margin-bottom: 1rem;">(Mode Démo : Tapez 123456)</p>
                
                <div class="form-group">
                    <input type="text" id="otp-input-code" class="form-control" placeholder="Ex: 123456" style="font-size: 1.5rem; letter-spacing: 5px; text-align: center; font-weight: bold; margin-bottom: 1rem;" maxlength="6">
                </div>
                
                <button class="btn btn-primary" onclick="verifyOtpAndSubmitOrder()" style="width: 100%; margin-bottom: 1rem;" id="btn-verify-otp">
                    ✅ Vérifier et Commander
                </button>
                
                <button class="btn btn-secondary" onclick="router.navigate('/')" style="width: 100%;">
                    Annuler
                </button>
            </div>
        `;
    }, 1500);
}


window.executePendingOrder = function() {
    if (!window.pendingOrderContext) return;
    
    const { order, r, firstname, lastname, mode, phone } = window.pendingOrderContext;
    
    store.addOrder(order);
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

    window.gotoTracking = function(phoneNumber) {
        router.navigate('#/tracking');
        setTimeout(() => {
            const phoneInput = document.getElementById('tracking-phone');
            if (phoneInput) {
                phoneInput.value = phoneNumber;
                if(typeof window.fetchOrderTracking === 'function') window.fetchOrderTracking();
            }
        }, 200);
    };

    const container = document.getElementById('checkout-content-container');
    container.innerHTML = `
        <div class="confirmation-screen">
            <div class="confirmation-icon">🎊</div>
            <h2>Commande enregistrée !</h2>
            <div style="background: rgba(16, 185, 129, 0.1); padding: 1rem; border-radius: 12px; margin: 1.5rem 0; border: 1px solid rgba(16, 185, 129, 0.3); text-align: center;">
                <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🎁</div>
                <h3 style="color: var(--success); margin-bottom: 0.5rem; font-size: 1.1rem;">Félicitations !</h3>
                <p style="color: var(--text-primary); font-size: 0.9rem; margin-bottom: 1rem;">Vous venez de gagner <strong>+5 points de fidélité</strong> avec cette commande !</p>
                <button class="btn btn-secondary btn-sm" onclick="window.openLoyaltyAndCheck('${phone}')" style="background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border);">
                    💳 Voir mon solde de points
                </button>
            </div>
            <p style="color: var(--text-secondary); margin: 1rem 0;">Votre commande n° <strong>${order.id}</strong> a bien été envoyée au restaurant.</p>
            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 12px; font-size: 0.9rem; text-align: left; margin: 1.5rem 0;">
                <strong>Récapitulatif :</strong><br>
                Client : ${firstname} ${lastname}<br>
                Mode : ${mode}<br>
                Montant : <strong>${order.total} FCFA</strong> (espèces à la livraison/réception)
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                <button onclick="window.gotoTracking('${phone}')" class="btn btn-primary">
                    📍 Suivre ma commande en direct
                </button>
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
                        <option value="1" style="color: black;">⭐ À améliorer</option>
                    </select>
                </div>
                <div class="form-group" style="text-align: left;">
                    <textarea id="review-comment" class="form-control" rows="2" placeholder="Qu'avez-vous pensé du repas ?" style="background: rgba(255,255,255,0.05); color: var(--primary); border: 1px solid rgba(255,255,255,0.2);"></textarea>
                </div>
                <button class="btn btn-primary btn-block" onclick="submitCustomerReview('${r.id}', '${(firstname + ' ' + lastname).replace(/'/g, "\\'")}')">Envoyer mon avis</button>
            </div>
        </div>
    `;
    
    showToast("Commande enregistrée avec succès !", "success");
}

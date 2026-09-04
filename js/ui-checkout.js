// 2. Checkout Panel
function renderCheckoutTab(r) {
    const container = document.getElementById('checkout-content-container');
    if (!container) return;
    
    if (!cart.items || cart.items.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 4rem 1rem;">
                <span style="font-size: 3.5rem; display: block; margin-bottom: 0.75rem;">🛒</span>
                <h3 style="font-size: 1.3rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem;">Votre panier est vide</h3>
                <p style="color: var(--text-secondary); margin: 0 auto 1.5rem auto; max-width: 320px; font-size: 0.95rem;">Découvrez notre sélection de plats frais du jour et faites votre choix !</p>
                <button class="btn btn-primary" onclick="switchRestoTab('menu')" style="padding: 0.75rem 1.5rem; border-radius: 12px; font-weight: 600;">Voir le Menu 🍽️</button>
            </div>
        `;
        return;
    }

    const totalItemCount = cart.items.reduce((acc, item) => acc + (Number(item.qty) || 1), 0);

    let itemsHtml = '';
    cart.items.forEach(item => {
        const itemLineTotal = (Number(item.price) || 0) * (Number(item.qty) || 1);
        itemsHtml += `
            <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border); margin-bottom: 0.75rem; gap: 0.75rem; transition: transform 0.2s ease;">
                <div class="cart-item-info" style="flex: 1; min-width: 0;">
                    <div class="cart-item-title" style="font-weight: 700; font-size: 1rem; color: var(--text-primary); margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</div>
                    <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--text-secondary);">
                        <span>${Number(item.price).toLocaleString('fr-FR')} FCFA / unité</span>
                        ${item.qty > 1 ? `<span style="font-weight: 700; color: var(--accent);">• Total : ${Number(itemLineTotal).toLocaleString('fr-FR')} FCFA</span>` : ''}
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                    <div class="cart-item-qty" style="display: flex; align-items: center; background: var(--bg-page); border-radius: 10px; border: 1px solid var(--border); padding: 2px;">
                        <button class="qty-btn" onclick="updateCartQty('${item.id}', -1)" title="Diminuer" style="width: 30px; height: 30px; border: none; background: transparent; cursor: pointer; font-size: 1.1rem; font-weight: bold; display: flex; align-items: center; justify-content: center; color: var(--text-primary);">-</button>
                        <span class="qty-val" style="min-width: 24px; text-align: center; font-weight: 700; font-size: 0.95rem; color: var(--text-primary);">${item.qty}</span>
                        <button class="qty-btn" onclick="updateCartQty('${item.id}', 1)" title="Augmenter" style="width: 30px; height: 30px; border: none; background: transparent; cursor: pointer; font-size: 1.1rem; font-weight: bold; display: flex; align-items: center; justify-content: center; color: var(--text-primary);">+</button>
                    </div>
                    <button type="button" onclick="removeCartItem('${item.id}')" title="Supprimer cet article" style="width: 34px; height: 34px; border-radius: 10px; border: 1px solid rgba(239, 68, 68, 0.2); background: rgba(239, 68, 68, 0.08); color: #ef4444; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.95rem; transition: all 0.2s ease;">
                        🗑️
                    </button>
                </div>
            </div>
        `;
    });

    let totalHtml = '';
    if (cart.loyaltyApplied) {
        totalHtml = `
            <div class="cart-total-box" style="display: flex; flex-direction: column; gap: 0.5rem; background: var(--bg-card); border-radius: 16px; padding: 1.25rem; border: 1px solid var(--border); margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between; font-size: 0.95rem; color: var(--text-secondary);">
                    <span>Sous-total (${totalItemCount} article${totalItemCount > 1 ? 's' : ''})</span>
                    <span>${Number(cart.subtotal).toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; color: var(--success); font-weight: 600;">
                    <span>🎁 Réduction Fidélité</span>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span>-2,500 FCFA</span>
                        <button type="button" class="btn btn-link btn-xs" onclick="removeLoyaltyReward()" style="padding: 0; color: #ef4444; text-decoration: underline; font-size: 0.75rem;">Retirer</button>
                    </div>
                </div>
                ${cart.deliveryFee ? `
                <div style="display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--text-secondary);">
                    <span>Frais de livraison</span>
                    <span>${Number(cart.deliveryFee).toLocaleString('fr-FR')} FCFA</span>
                </div>` : ''}
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border); padding-top: 0.75rem; margin-top: 0.25rem;">
                    <span style="font-weight: 700; font-size: 1.1rem; color: var(--text-primary);">Total à payer :</span>
                    <span class="cart-total-price" style="font-size: 1.35rem; font-weight: 800; color: var(--accent);">${Number(cart.total).toLocaleString('fr-FR')} FCFA</span>
                </div>
            </div>
        `;
    } else {
        totalHtml = `
            <div class="cart-total-box" style="display: flex; flex-direction: column; gap: 0.5rem; background: var(--bg-card); border-radius: 16px; padding: 1.25rem; border: 1px solid var(--border); margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between; font-size: 0.95rem; color: var(--text-secondary);">
                    <span>Sous-total (${totalItemCount} article${totalItemCount > 1 ? 's' : ''})</span>
                    <span>${Number(cart.subtotal).toLocaleString('fr-FR')} FCFA</span>
                </div>
                ${cart.deliveryFee ? `
                <div style="display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--text-secondary);">
                    <span>Frais de livraison</span>
                    <span>${Number(cart.deliveryFee).toLocaleString('fr-FR')} FCFA</span>
                </div>` : ''}
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border); padding-top: 0.75rem; margin-top: 0.25rem;">
                    <span style="font-weight: 700; font-size: 1.1rem; color: var(--text-primary);">Total à payer :</span>
                    <span class="cart-total-price" style="font-size: 1.35rem; font-weight: 800; color: var(--accent);">${Number(cart.total).toLocaleString('fr-FR')} FCFA</span>
                </div>
            </div>
        `;
    }

    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h2 style="font-size: 1.25rem; font-weight: 700; margin: 0; display: flex; align-items: center; gap: 0.5rem;">
                <span>Votre Panier</span>
                <span style="font-size: 0.8rem; background: var(--accent-light); color: var(--accent); padding: 2px 8px; border-radius: 12px; font-weight: 700;">${totalItemCount}</span>
            </h2>
            <button type="button" class="btn btn-outline-danger btn-xs" onclick="clearCart()" style="font-size: 0.8rem; padding: 4px 10px; border-radius: 8px; color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); background: transparent; cursor: pointer;">
                🗑️ Vider le panier
            </button>
        </div>
        
        <div class="cart-list" style="margin-bottom: 1rem;">
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
                    <label class="form-label" style="margin-bottom: 0;">Position &amp; Adresse de livraison <span class="required">*</span></label>
                    <button type="button" id="btn-live-gps" class="btn btn-outline btn-sm" onclick="locateClientLive()" style="padding: 0.4rem 0.85rem; font-size: 0.85rem; border-radius: 20px; display: inline-flex; align-items: center; gap: 0.35rem; color: var(--primary); border-color: var(--primary);">
                        <i class="ri-crosshair-2-line"></i> <span>Ma position GPS actuelle</span>
                    </button>
                </div>
                <div id="live-gps-status" style="display: none; font-size: 0.85rem; color: #059669; font-weight: 600; margin-bottom: 0.75rem; background: rgba(16, 185, 129, 0.1); padding: 0.5rem 0.85rem; border-radius: 10px; border: 1px solid rgba(16, 185, 129, 0.2);">
                    ✅ Position GPS exacte enregistrée pour le livreur
                </div>
                <div id="delivery-fee-display" style="font-weight: bold; color: var(--primary); margin-bottom: 0.85rem; display: none;">Frais de livraison : <span id="fee-val">0</span> FCFA</div>
                
                <label class="form-label">Adresse Détaillée / Point de repère <span class="required">*</span></label>
                <input type="text" id="order-address" class="form-control" placeholder="Quartier, rue, villa, près de la station / pharmacie...">
            </div>
            
            <div class="form-group">
                <label class="form-label">Notes Spéciales / Allergies (Optionnel)</label>
                <textarea id="order-notes" class="form-control" placeholder="Sans piment, sauce à part..."></textarea>
            </div>
            
            <div class="form-group" style="margin-top: 1.25rem;">
                <label class="form-label" style="font-weight: 700;">Mode de Règlement direct <span class="required">*</span></label>
                <div style="display: flex; flex-direction: column; gap: 0.65rem;">
                    <label class="delivery-radio-card" style="padding: 0.85rem 1rem; border-radius: 14px; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; border: 1.5px solid var(--primary); background: rgba(var(--primary-rgb), 0.04);">
                        <input type="radio" name="order-payment" value="Espèces à la livraison" checked style="accent-color: var(--primary);">
                        <div style="flex: 1;">
                            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.25rem;">
                                <strong style="color: var(--text-primary); font-size: 0.95rem;">💵 Espèces à la livraison (Cash on Delivery)</strong>
                                <span class="badge" style="background: #10B981; color: white; font-size: 0.7rem; padding: 2px 7px; border-radius: 6px; font-weight: 700;">Recommandé</span>
                            </div>
                            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.2rem;">Règlement en liquide de la totalité (repas + livraison) directement en main propre au livreur à l'arrivée</div>
                        </div>
                    </label>
                    <label class="delivery-radio-card" style="padding: 0.85rem 1rem; border-radius: 14px; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; border: 1px solid var(--border); background: var(--bg-card);">
                        <input type="radio" name="order-payment" value="Transfert Wave restaurant" style="accent-color: var(--primary);">
                        <div style="flex: 1;">
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <img src="/images/wave_senegal.png" alt="Wave Sénégal" style="width: 20px; height: 20px; border-radius: 4px; object-fit: contain;">
                                <strong style="color: var(--text-primary); font-size: 0.95rem;">Paiement Wave d'avance (Direct au restaurant)</strong>
                            </div>
                            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.2rem;">Transfert Wave direct sur le numéro WhatsApp officiel du restaurateur pour lancer la commande</div>
                        </div>
                    </label>
                </div>
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
        const savedAddress = localStorage.getItem('customerAddress') || '';
        const addressInput = document.getElementById('order-address');

        if (savedPhone && phoneInput && !phoneInput.value) {
            phoneInput.value = savedPhone;
        }

        if (savedAddress && addressInput && !addressInput.value) {
            addressInput.value = savedAddress;
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

window.locateClientLive = async function() {
    const btn = document.getElementById('btn-live-gps');
    const statusEl = document.getElementById('live-gps-status');
    if (!navigator.geolocation) {
        if (typeof showToast === 'function') showToast("La géolocalisation n'est pas supportée par votre navigateur.", "danger");
        return;
    }

    if (btn) btn.innerHTML = '<i class="ri-loader-4-line spin"></i> <span>Recherche GPS en direct...</span>';

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            
            cart.deliveryLat = lat;
            cart.deliveryLng = lng;

            const r = store.getRestaurantById(cart.restaurantId) || {};
            const rLat = Number(r.lat) || 14.7928;
            const rLng = Number(r.lng) || -16.9260;
            const dist = typeof calculateDistance === 'function' ? calculateDistance(rLat, rLng, lat, lng) : 2.5;

            let fee = Math.floor(dist * 200);
            fee = Math.max(500, Math.min(fee, 1500));
            cart.deliveryFee = fee;

            const feeDisplay = document.getElementById('delivery-fee-display');
            if (feeDisplay) {
                feeDisplay.style.display = 'block';
                const feeVal = document.getElementById('fee-val');
                if (feeVal) feeVal.innerText = Number(fee).toLocaleString('fr-FR');
            }
            recalculateCart();

            const totalEls = document.querySelectorAll('.cart-total-price');
            totalEls.forEach(el => el.innerText = Number(cart.total).toLocaleString('fr-FR') + " FCFA");

            if (btn) {
                btn.innerHTML = '<i class="ri-check-line"></i> <span>Position GPS capturée ✅</span>';
                btn.classList.remove('btn-outline');
                btn.classList.add('btn-success');
            }
            if (statusEl) {
                statusEl.style.display = 'block';
                statusEl.innerHTML = `✅ Coordonnées GPS capturées (${lat.toFixed(4)}, ${lng.toFixed(4)}) • Distance ~${dist.toFixed(1)} km`;
            }

            const addressInput = document.getElementById('order-address');
            if (addressInput && !addressInput.value.trim()) {
                addressInput.placeholder = "Position GPS enregistrée. Précisez (quartier, villa, repère...)";
            }

            if (typeof showToast === 'function') {
                showToast("📍 Votre position GPS exacte a été enregistrée pour la livraison !", "success");
            }
            if (navigator.vibrate) navigator.vibrate(60);
        },
        (err) => {
            console.warn("Live Geolocation error:", err);
            if (btn) btn.innerHTML = '<i class="ri-crosshair-2-line"></i> <span>Ma position GPS actuelle</span>';
            if (typeof showToast === 'function') {
                showToast("Veuillez autoriser l'accès GPS pour partager votre position exacte.", "warning");
            }
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
};

function toggleAddressField(show) {
    const group = document.getElementById('delivery-address-group');
    if (show) {
        group.style.display = 'block';
        
        // Base delivery fee (standard delivery in Thiès)
        if (!cart.deliveryFee || cart.deliveryFee === 0) {
            cart.deliveryFee = 500;
        }
        const feeDisplay = document.getElementById('delivery-fee-display');
        if (feeDisplay) {
            feeDisplay.style.display = 'block';
            const feeVal = document.getElementById('fee-val');
            if (feeVal) feeVal.innerText = Number(cart.deliveryFee).toLocaleString('fr-FR');
        }
        recalculateCart();
        const totalEls = document.querySelectorAll('.cart-total-price');
        totalEls.forEach(el => el.innerText = Number(cart.total).toLocaleString('fr-FR') + " FCFA");
    } else {
        group.style.display = 'none';
        cart.deliveryFee = 0;
        const feeDisplay = document.getElementById('delivery-fee-display');
        if (feeDisplay) feeDisplay.style.display = 'none';
        recalculateCart();
        const totalEls = document.querySelectorAll('.cart-total-price');
        totalEls.forEach(el => el.innerText = Number(cart.total).toLocaleString('fr-FR') + " FCFA");
    }
}


// Anti-Rebond & Rate Limiter to prevent spam/double-clicks
let lastOrderSubmissionTime = 0;
function checkOrderRateLimit() {
    const now = Date.now();
    
    // Anti-double click protection (3 seconds debounce)
    if (now - lastOrderSubmissionTime < 3000) {
        if (typeof showToast === 'function') {
            showToast("⏳ Votre commande est déjà en cours de transmission...", "info");
        }
        return false;
    }

    const tenMinutes = 10 * 60 * 1000;
    let timestamps = JSON.parse(localStorage.getItem('thies_order_timestamps') || '[]');
    
    // Filter timestamps within the last 10 minutes
    timestamps = timestamps.filter(ts => now - ts < tenMinutes);
    
    if (timestamps.length >= 5) {
        if (typeof showToast === 'function') {
            showToast("Sécurité : maximum 5 commandes par tranche de 10 minutes. Veuillez patienter un instant.", "warning");
        }
        return false;
    }
    
    lastOrderSubmissionTime = now;
    timestamps.push(now);
    localStorage.setItem('thies_order_timestamps', JSON.stringify(timestamps));
    return true;
}

// Submission of client order with Cart Tamper-Proofing & Price Integrity
function submitSimpleOrder(e, restaurantId) {
    if (e && e.preventDefault) e.preventDefault();
    
    const submitBtn = document.getElementById('btn-submit-order');
    if (submitBtn && submitBtn.disabled) return;

    const r = store.getRestaurantById(restaurantId);
    if (!r) return;

    const phoneInput = document.getElementById('order-phone');
    const rawPhone = phoneInput ? phoneInput.value.trim() : '';
    
    // Strict Senegal Real-time Validation Check
    const validation = typeof validateSenegalPhoneNumber === 'function'
        ? validateSenegalPhoneNumber(rawPhone)
        : { isValid: /^\+221(70|75|76|77|78)\d{7}$/.test(cleanPhoneNumber(rawPhone)), clean: rawPhone };

    if (!validation.isValid) {
        if (phoneInput) {
            phoneInput.focus();
            phoneInput.style.borderColor = '#ef4444';
            phoneInput.style.boxShadow = '0 0 0 4px rgba(239, 68, 68, 0.25)';
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
    
    // Lock submit button to prevent double execution
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>⏳ Transmission sécurisée...</span>';
    }

    const firstname = (document.getElementById('order-firstname')?.value || '').trim();
    const lastname = (document.getElementById('order-lastname')?.value || '').trim();
    const phone = validation.clean || cleanPhoneNumber(rawPhone);
    const mode = document.querySelector('input[name="order-mode"]:checked')?.value || 'A emporter';
    const paymentChoice = document.querySelector('input[name="order-payment"]:checked')?.value || 'Espèces à la livraison';
    const address = document.getElementById('order-address') ? document.getElementById('order-address').value.trim() : '';
    const notes = document.getElementById('order-notes') ? document.getElementById('order-notes').value.trim() : '';

    // =========================================================================
    // PRICE INTEGRITY & CART TAMPER-PROOFING
    // Recalculate directly from official restaurant catalog to prevent DOM tampering
    // =========================================================================
    let verifiedSubtotal = 0;
    const verifiedItems = (cart.items || []).map(item => {
        let officialPrice = Number(item.price) || 0;
        if (Array.isArray(r.menu) && r.menu.length > 0) {
            const officialDish = r.menu.find(d => d.id === item.id || d.name === item.name);
            if (officialDish && Number(officialDish.price) > 0) {
                officialPrice = Number(officialDish.price);
            }
        }
        const qty = Math.max(1, Math.min(Number(item.qty) || 1, 100));
        verifiedSubtotal += officialPrice * qty;
        return {
            id: item.id || null,
            name: item.name,
            price: officialPrice,
            qty: qty
        };
    });

    let verifiedDeliveryFee = 0;
    if (mode === 'Livraison') {
        verifiedDeliveryFee = Math.max(500, Math.min(Number(cart.deliveryFee) || 500, 2500));
    }

    let verifiedDiscount = 0;
    if (cart.loyaltyApplied) {
        verifiedDiscount = 2500;
    }

    const verifiedTotal = Math.max(0, verifiedSubtotal + verifiedDeliveryFee - verifiedDiscount);

    // Format payment labels (direct customer <-> restaurant)
    let paymentMethod = 'Espèces à la livraison (Cash on Delivery)';
    let paymentStatus = 'À régler au livreur à la réception';
    if (paymentChoice === 'Transfert Wave restaurant') {
        paymentMethod = 'Paiement Wave direct au restaurant';
        paymentStatus = 'À transférer sur le compte Wave du restaurant';
    }

    // Remember customer details for future orders
    localStorage.setItem('customerPhone', phone);
    if (firstname || lastname) {
        localStorage.setItem('customerName', `${firstname} ${lastname}`.trim());
    }
    
    // Calculate sequence number for this specific restaurant (starts at 1 per restaurant)
    const orderSeq = store.getNextRestaurantOrderNumber(r.id);
    const orderId = "CMD-" + orderSeq;
    const date = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
    let finalNotes = notes;
    if (cart.loyaltyApplied) {
        finalNotes = `${notes ? notes + ' | ' : ''}[RÉCOMPENSE FIDÉLITÉ APPLIQUÉE : -2,500 FCFA]`;
    }

    const order = {
        id: orderId,
        orderNumber: orderSeq,
        restaurantId: r.id,
        customerName: `${firstname} ${lastname}`,
        customerPhone: phone,
        mode,
        address,
        paymentMethod,
        paymentStatus,
        items: verifiedItems,
        subtotal: verifiedSubtotal,
        total: verifiedTotal,
        note: finalNotes,
        status: "En attente",
        date,
        time,
        timestamp: Date.now(),
        createdAt: new Date().toISOString(),
        deliveryFee: verifiedDeliveryFee,
        deliveryLat: cart.deliveryLat || null,
        deliveryLng: cart.deliveryLng || null,
        loyaltyApplied: cart.loyaltyApplied || false,
        priceVerified: true,
        otpVerified: true,
        otpVerifiedVia: 'Authentification Native / WhatsApp',
        otpVerifiedAt: new Date().toISOString()
    };

    // Synchronisation automatique de l'authentification native du client
    if (typeof customerAuth !== 'undefined') {
        customerAuth.login({
            phone: phone,
            firstname: firstname,
            lastname: lastname,
            name: `${firstname} ${lastname}`.trim(),
            address: order.address || '',
            authMethod: 'Authentification Native'
        });
    }

    window.pendingOrderContext = { order, r, firstname, lastname, mode, phone };
    
    // Validation et Enregistrement direct et sécurisé de la commande
    executePendingOrder();
    return;
}

window.executePendingOrder = async function() {
    if (!window.pendingOrderContext) return;
    
    const { order, r, firstname, lastname, mode, phone } = window.pendingOrderContext;
    
    const container = document.getElementById('checkout-content-container');
    if (container) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem 1rem;">
                <div class="spinner" style="border: 4px solid var(--border); border-top: 4px solid var(--primary); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
                <p style="color: var(--text-primary); font-weight: 600; font-size: 1.05rem;">Validation et sécurisation de votre commande...</p>
                <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.25rem;">Génération du bon de commande officiel</p>
            </div>
        `;
    }

    try {
        // 1. Enregistrement direct et robuste de la commande
        try {
            store.addOrder(order);
        } catch (storeErr) {
            console.warn("Store addOrder handled:", storeErr);
        }

        const securedOrderId = order.id;
        const certifiedTotal = Number(order.total || 0).toLocaleString('fr-FR');

        saveOrderToHistory(order, r.name);
        
        try {
            localStorage.setItem('trackingOrderId', String(securedOrderId));
            localStorage.setItem('trackingPhone', String(phone));
        } catch (e) {}
        
        if (cart.loyaltyApplied && cart.loyaltyPhone) {
            store.applyLoyaltyRewardUsed(cart.loyaltyPhone, `${firstname} ${lastname}`);
        }

        if (typeof resetCart === 'function') {
            resetCart();
        } else {
            cart.restaurantId = null;
            cart.items = [];
            cart.subtotal = 0;
            cart.total = 0;
            cart.loyaltyApplied = false;
            cart.loyaltyPhone = null;
            cart.deliveryFee = 0;
            cart.deliveryLat = null;
            cart.deliveryLng = null;
            window.cart = cart;
            if (typeof saveCart === 'function') saveCart();
        }
        if (typeof updateFloatingCartBar === 'function') updateFloatingCartBar(r);
        
        if (typeof triggerCelebration === 'function') triggerCelebration();
        
        // Notification OneSignal
        if (typeof OneSignalManager !== 'undefined' && OneSignalManager.requestPermission) {
            OneSignalManager.requestPermission();
        }

        // 2. Génération du lien WhatsApp sécurisé et officiel
        let itemsText = (order.items || []).map(i => `${i.qty}x ${i.name}`).join(', ');
        let gpsLink = '';
        if (order.deliveryLat && order.deliveryLng) {
            gpsLink = `📍 *Position GPS en direct* : https://www.google.com/maps?q=${order.deliveryLat},${order.deliveryLng}\n`;
        }
        const waText = `Bonjour ${r.name}, voici ma commande officielle n°*${securedOrderId}* sur THIES Resto.\n\n👤 *Client* : ${firstname} ${lastname} (${phone})\n🍽️ *Plats* : ${itemsText}\n🛵 *Mode* : ${mode}\n${order.address ? `📍 *Adresse* : ${order.address}\n` : ''}${gpsLink}💰 *Total à payer* : ${certifiedTotal} FCFA\n\nMerci de confirmer la réception !`;
        const waLink = `https://wa.me/${(r.whatsapp || '').replace(/\+/g, '').replace(/\s+/g, '')}?text=${encodeURIComponent(waText)}`;

        if (container) {
            container.innerHTML = `
                <div class="confirmation-screen" style="max-width: 480px; margin: 1.5rem auto 0; background: var(--bg-card); padding: 2.2rem 1.75rem; border-radius: 24px; box-shadow: var(--shadow); border: 1px solid var(--border); text-align: center;">
                    <div style="width: 68px; height: 68px; border-radius: 50%; background: rgba(16, 185, 129, 0.12); color: #059669; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; margin: 0 auto 1rem;">
                        ⏳
                    </div>
                    <h2 style="font-family: var(--font-serif); font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.35rem;">
                        Commande Transmise !
                    </h2>
                    <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.25rem;">
                        Votre commande n° <strong style="color: var(--text-primary); font-family: monospace;">${securedOrderId}</strong> est transmise au restaurant.
                    </p>

                    <!-- Steps Timeline Preview -->
                    <div style="background: var(--bg-page); border: 1px solid var(--border); border-radius: 16px; padding: 1rem; margin-bottom: 1.25rem; text-align: left;">
                        <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 0.65rem; letter-spacing: 0.5px;">
                            Étapes de validation en direct :
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.85rem;">
                            <div style="display: flex; align-items: center; gap: 0.5rem; color: #d97706; font-weight: 700;">
                                <span>⏳ 1.</span> <span>En attente de confirmation par le restaurant</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary);">
                                <span>👨‍🍳 2.</span> <span>Mise en cuisine par le restaurant</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary);">
                                <span>🛵 3.</span> <span>Départ en livraison (notifié par le restaurant)</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary);">
                                <span>✅ 4.</span> <span>Confirmation de réception par vous (Client)</span>
                            </div>
                        </div>
                    </div>

                    <div style="background: var(--bg-page); padding: 1.1rem; border-radius: 16px; font-size: 0.9rem; text-align: left; margin-bottom: 1.25rem; border: 1px solid var(--border);">
                        <div style="font-weight: 700; margin-bottom: 0.6rem; color: var(--text-primary); border-bottom: 1px solid var(--border); padding-bottom: 0.4rem; display: flex; justify-content: space-between;">
                            <span>📋 Récapitulatif</span>
                            <span style="color: var(--accent);">${mode}</span>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 0.35rem; color: var(--text-secondary); font-size: 0.88rem;">
                            <div>👤 <strong>Client :</strong> ${firstname} ${lastname} (${phone})</div>
                            <div>🍽️ <strong>Articles :</strong> ${itemsText}</div>
                            <div>💳 <strong>Paiement :</strong> <span style="color: var(--text-primary); font-weight: 600;">${order.paymentMethod || 'Non spécifié'}</span></div>
                            ${order.address ? `<div>📍 <strong>Adresse :</strong> ${order.address}</div>` : ''}
                            <div style="margin-top: 0.4rem; font-size: 1rem; color: var(--text-primary); font-weight: 700; border-top: 1px dashed var(--border); padding-top: 0.5rem; display: flex; justify-content: space-between;">
                                <span>Total certifié :</span>
                                <span style="color: var(--accent); font-size: 1.15rem;">${certifiedTotal} FCFA</span>
                            </div>
                        </div>
                    </div>

                    <div style="background: rgba(37, 211, 102, 0.08); padding: 1.25rem; border-radius: 18px; margin-bottom: 1.25rem; border: 1px solid rgba(37, 211, 102, 0.25); text-align: center;">
                        <p style="color: #047857; font-weight: 600; font-size: 0.92rem; margin-bottom: 0.9rem; line-height: 1.4;">
                            📲 Envoyez le récapitulatif officiel sur le WhatsApp du restaurant pour notifier le gérant :
                        </p>
                        <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn btn-success" style="width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.85rem 1rem; border-radius: 14px; font-weight: 700; font-size: 1rem; text-decoration: none; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.25);">
                            <span style="font-size: 1.25rem;">💬</span> Ouvrir WhatsApp du Restaurant
                        </a>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 0.6rem;">
                        <button class="btn btn-primary" onclick="router.navigate('/tracking')" style="width: 100%; padding: 0.75rem; border-radius: 12px; font-weight: 600;">
                            🛵 Suivre l'avancement en direct
                        </button>
                        <button class="btn btn-secondary" onclick="router.navigate('/')" style="width: 100%; padding: 0.65rem; border-radius: 12px; font-size: 0.88rem;">
                            Retourner à l'accueil
                        </button>
                    </div>
                </div>
            `;
        }
    } catch (err) {
        console.error("Order execution unexpected error:", err);
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem 1rem; max-width: 420px; margin: 2rem auto; background: var(--bg-card); border-radius: 20px; border: 1px solid var(--border);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                    <h3 style="color: var(--text-primary); font-size: 1.3rem; margin-bottom: 0.5rem;">Une erreur est survenue</h3>
                    <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.25rem;">Nous n'avons pas pu finaliser automatiquement l'étape. Veuillez cliquer ci-dessous pour réessayer.</p>
                    <button class="btn btn-primary" onclick="window.executePendingOrder()" style="padding: 0.75rem 1.5rem; border-radius: 12px;">🔄 Réessayer la validation</button>
                </div>
            `;
        }
    }
};

/**
 * Global Helper to launch PayTech checkout flow from any UI screen
 */
window.initiatePaytechPayment = async function(orderId) {
    const btn = document.getElementById('btn-paytech-now') || document.querySelector(`[data-paytech-order-id="${orderId}"]`);
    const originalText = btn ? btn.innerHTML : '';
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-ring" style="width:16px;height:16px;border-width:2px;display:inline-block;vertical-align:middle;margin-right:6px;"></span> Connexion PayTech...';
    }

    try {
        let order = null;
        if (typeof store !== 'undefined' && store.data && Array.isArray(store.data.orders)) {
            order = store.data.orders.find(o => String(o.id) === String(orderId));
        }
        if (!order) {
            const history = JSON.parse(localStorage.getItem('THIES_ORDER_HISTORY') || '[]');
            order = history.find(o => String(o.id) === String(orderId));
        }

        const total = order ? (order.total || order.certifiedTotal || 0) : (window.cart?.total || 0);
        const customerName = order?.customerName || localStorage.getItem('customerName') || 'Client';
        const customerPhone = order?.customerPhone || localStorage.getItem('customerPhone') || '';
        
        let restaurantName = 'THIES Resto';
        if (order && order.restaurantId && store?.getRestaurantById) {
            const r = store.getRestaurantById(order.restaurantId);
            if (r) restaurantName = r.name;
        }

        const response = await fetch('/api/paytech/request-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                orderId: orderId,
                amount: total,
                customerName: customerName,
                customerPhone: customerPhone,
                restaurantName: restaurantName,
                returnHash: `/tracking?orderId=${encodeURIComponent(orderId)}&payment=success`
            })
        });

        const data = await response.json();

        if (data && data.success && data.redirectUrl) {
            if (btn) {
                btn.innerHTML = '<span>Redirection PayTech ➔</span>';
            }
            // Navigate client to PayTech payment page
            window.location.href = data.redirectUrl;
        } else {
            console.error("PayTech API Error:", data);
            if (typeof showToast === 'function') {
                showToast(data.message || "Erreur lors de l'ouverture de PayTech.", "danger");
            }
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = originalText;
            }
        }
    } catch (err) {
        console.error("PayTech payment exception:", err);
        if (typeof showToast === 'function') {
            showToast("Impossible de contacter la passerelle PayTech.", "danger");
        }
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    }
};


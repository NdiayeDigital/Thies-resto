// ============================================
// VENDOR DASHBOARD (Priorité C)
// ============================================

window.currentVendorSession = null;

window.renderVendorLogin = function(slug) {
    const container = document.getElementById('main-content');
    
    // Find restaurant name for context (if slug is valid)
    const r = store.data.restaurants.find(res => res.slug === slug);
    const restoName = r ? r.name : "Restaurant";

    container.innerHTML = `
        <div style="max-width: 400px; margin: 4rem auto; padding: 2rem; background: var(--bg-card); border-radius: 20px; border: 1px solid var(--border); box-shadow: var(--shadow);">
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">👨‍🍳</div>
                <h2>Espace Restaurateur</h2>
                <p style="color: var(--text-secondary); margin-top: 0.5rem;">Connexion pour <strong>${restoName}</strong></p>
            </div>
            
            <div class="form-group" style="margin-bottom: 1.5rem;">
                <label class="form-label" style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">Code PIN Secret</label>
                <input type="password" id="vendor-pin" class="form-control" placeholder="****" style="text-align: center; font-size: 1.5rem; letter-spacing: 0.5rem; padding: 1rem;" maxlength="6">
            </div>
            
            <button class="btn btn-primary" style="width: 100%; padding: 1rem; font-size: 1.1rem;" onclick="window.submitVendorLogin('${slug}')">
                Se Connecter
            </button>
            <p id="vendor-login-error" style="color: var(--danger); text-align: center; margin-top: 1rem; display: none;">PIN incorrect.</p>
        </div>
    `;
};

window.submitVendorLogin = async function(slug) {
    const pin = document.getElementById('vendor-pin').value;
    if (!pin) return;
    
    const errorEl = document.getElementById('vendor-login-error');
    errorEl.style.display = 'none';
    
    showLoadingOverlay("Vérification...");
    
    try {
        const session = await store.vendorLogin(slug, pin);
        hideLoadingOverlay();
        
        if (session) {
            window.currentVendorSession = { ...session, pin: pin };
            showToast("Connexion réussie !", "success");
            window.renderVendorDashboard();
        } else {
            errorEl.textContent = "PIN incorrect.";
            errorEl.style.display = 'block';
        }
    } catch (err) {
        hideLoadingOverlay();
        if (err.rateLimited) {
            errorEl.innerHTML = `🔒 <strong>Compte temporairement bloqué</strong><br><span style="font-size: 0.85rem;">Trop de tentatives. Réessayez dans 15 minutes.</span>`;
            errorEl.style.display = 'block';
            errorEl.style.background = 'rgba(255,0,0,0.08)';
            errorEl.style.padding = '1rem';
            errorEl.style.borderRadius = '12px';
            showToast("Compte bloqué — trop de tentatives", "danger");
        } else {
            errorEl.textContent = "Erreur de connexion.";
            errorEl.style.display = 'block';
        }
    }
};

window.renderVendorDashboard = async function() {
    if (!window.currentVendorSession) {
        router.navigate('/');
        return;
    }
    
    const session = window.currentVendorSession;
    
    showLoadingOverlay("Chargement de votre carte...");
    // We need the menu items to manage them
    const menuItems = await store.fetchMenuForRestaurant(session.id);
    hideLoadingOverlay();
    
    const container = document.getElementById('main-content');
    
    const isOpen = session.is_open_manual;
    const toggleColor = isOpen ? "var(--success)" : "var(--danger)";
    const toggleText = isOpen ? "OUVERT" : "FERMÉ";
    
    let menuHtml = '';
    
    if (menuItems.length === 0) {
        menuHtml = `<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">Aucun plat trouvé.</p>`;
    } else {
        menuItems.forEach(item => {
            menuHtml += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 12px; margin-bottom: 0.75rem;">
                    <div style="flex: 1; min-width: 0;">
                        <h4 style="margin: 0; color: var(--text-primary); font-size: 1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</h4>
                        <div style="display: flex; gap: 1rem; margin-top: 0.5rem; align-items: center;">
                            <input type="number" id="price-${item.id}" value="${item.price}" style="width: 100px; padding: 0.4rem; background: var(--bg-input); border: 1px solid var(--border); color: var(--text-primary); border-radius: 6px;">
                            <span style="color: var(--text-secondary); font-size: 0.9rem;">FCFA</span>
                        </div>
                    </div>
                    
                    <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem;">
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                            <input type="checkbox" id="avail-${item.id}" ${item.available ? 'checked' : ''}>
                            <span style="font-size: 0.85rem; color: ${item.available ? 'var(--success)' : 'var(--danger)'};">${item.available ? 'En stock' : 'Rupture'}</span>
                        </label>
                        <button class="btn btn-primary btn-sm" onclick="window.saveVendorMenuItem('${item.id}')" style="padding: 0.3rem 0.75rem; font-size: 0.8rem;">Enregistrer</button>
                    </div>
                </div>
            `;
        });
    }

    container.innerHTML = `
        <div style="max-width: 800px; margin: 2rem auto; padding: 0 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
                <h2>Tableau de Bord - <span style="color: var(--primary);">${session.name}</span></h2>
                <button class="btn btn-secondary btn-sm" onclick="window.vendorLogout()">Déconnexion</button>
            </div>
            
            <div style="background: var(--bg-card); padding: 1.5rem; border-radius: 16px; border: 1px solid var(--border); margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h3 style="margin: 0 0 0.5rem 0;">Statut du restaurant</h3>
                    <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Ouvrez ou fermez manuellement votre restaurant.</p>
                </div>
                <button id="vendor-status-btn" class="btn" style="background: ${toggleColor}; color: white; width: 120px;" onclick="window.toggleVendorStatus()">
                    ${toggleText}
                </button>
            </div>
            
            <div style="background: var(--bg-card); padding: 1.5rem; border-radius: 16px; border: 1px solid var(--border);">
                <h3 style="margin: 0 0 1.5rem 0; border-bottom: 1px solid var(--border); padding-bottom: 1rem;">Gestion de la Carte</h3>
                ${menuHtml}
            </div>
        </div>
    `;
};

window.saveVendorMenuItem = async function(itemId) {
    const session = window.currentVendorSession;
    if (!session) return;
    
    const priceInput = document.getElementById(`price-${itemId}`);
    const availInput = document.getElementById(`avail-${itemId}`);
    
    const newPrice = parseFloat(priceInput.value);
    const isAvailable = availInput.checked;
    
    if (isNaN(newPrice) || newPrice < 0) {
        showToast("Prix invalide", "danger");
        return;
    }
    
    const success = await store.vendorUpdateMenuItem(session.id, session.pin, itemId, newPrice, isAvailable);
    
    if (success) {
        showToast("Plat mis à jour !", "success");
        // Update label color visually without re-rendering
        const labelText = availInput.nextElementSibling;
        labelText.innerText = isAvailable ? 'En stock' : 'Rupture';
        labelText.style.color = isAvailable ? 'var(--success)' : 'var(--danger)';
    } else {
        showToast("Erreur lors de la mise à jour", "danger");
    }
};

window.toggleVendorStatus = async function() {
    const session = window.currentVendorSession;
    if (!session) return;
    
    const newStatus = !session.is_open_manual;
    
    const success = await store.vendorUpdateStatus(session.id, session.pin, newStatus);
    
    if (success) {
        session.is_open_manual = newStatus;
        const btn = document.getElementById('vendor-status-btn');
        btn.style.background = newStatus ? "var(--success)" : "var(--danger)";
        btn.innerText = newStatus ? "OUVERT" : "FERMÉ";
        showToast(`Restaurant ${newStatus ? 'ouvert' : 'fermé'} !`, "success");
    } else {
        showToast("Erreur lors du changement de statut", "danger");
    }
};

window.vendorLogout = function() {
    window.currentVendorSession = null;
    router.navigate('/');
    showToast("Déconnecté", "info");
};

// Page: RESTAURANT DASHBOARD (Gerer ses donnees)
// ----------------------------------------------------
let dashboardActiveTab = 'summary';
let currentOrderStatusFilter = 'Tous';
let currentAccountingFilter = 'all'; // all, today, week, month

router.add('#/dashboard', () => {
    // Hide cart
    document.getElementById('floating-cart-bar').style.display = 'none';
    
    if (!currentRestaurantSession) {
        showToast("Veuillez vous connecter pour accéder au tableau de bord.", "danger");
        router.navigate('/auth');
        return;
    }
    
    startOrderPolling(currentRestaurantSession.id);
    hideLoadingOverlay();
    renderDashboardShell();
});

function renderDashboardShell() {
    const container = document.getElementById('main-content');
    const r = store.getRestaurantById(currentRestaurantSession.id);
    
    let impersonateBanner = '';
    if (isSuperAdminSession) {
        impersonateBanner = `
            <div style="background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%); color: var(--primary); padding: 0.75rem 1.5rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; font-weight: 700; border-radius: 12px; margin: 1rem 1.5rem 0 1.5rem; box-shadow: var(--shadow); border: 1px solid rgba(255,255,255,0.1);">
                <span>👑 Mode Super-Admin : Vous gérez actuellement le profil de "<strong>${r.name}</strong>"</span>
                <button class="btn btn-secondary btn-sm" onclick="exitImpersonation()" style="background: rgba(255,255,255,0.25); border-color: transparent; color: var(--primary); font-weight: 700;">
                    Retourner à la Console 🔐
                </button>
            </div>
        `;
    }
    
    // Check trial expiry for paywall
    const _createdAt = new Date(r.createdAt || '2026-06-25T00:00:00Z');
    const _diffTime = Math.abs(new Date() - _createdAt);
    const _diffDays = Math.ceil(_diffTime / (1000 * 60 * 60 * 24));
    const _packSubscribed = r.subscriptionPack || 'Aucun (Gratuit)';
    const isTrialExpired = _diffDays > 90 && _packSubscribed === 'Aucun (Gratuit)' && !isSuperAdminSession;
    const _daysLeft = Math.max(0, 90 - _diffDays);

    // Locked tab icon for expired trials
    const lockIcon = isTrialExpired ? ' 🔒' : '';

    // Alert banner for expired trials
    let trialAlertBanner = '';
    if (isTrialExpired) {
        trialAlertBanner = `
            <div style="background: linear-gradient(135deg, #dc3545 0%, #ff4b4b 100%); color: white; padding: 1rem 1.5rem; border-radius: 12px; margin: 1rem 1.5rem 0 1.5rem; display: flex; align-items: center; gap: 1rem; box-shadow: 0 4px 15px rgba(220,53,69,0.3); animation: pulseMainCircle 2s infinite;">
                <span style="font-size: 2rem;">⚠️</span>
                <div>
                    <strong style="font-size: 1.1rem;">Votre page est indisponible sur la plateforme</strong>
                    <p style="margin: 0.25rem 0 0; opacity: 0.9; font-size: 0.9rem;">Votre période d'essai gratuit de 3 mois est terminée. Souscrivez à un abonnement pour réactiver votre restaurant.</p>
                </div>
                <button class="btn btn-sm" onclick="switchDashboardTab('subscription')" style="background: white; color: #dc3545; font-weight: 700; white-space: nowrap;">💳 Voir les offres</button>
            </div>
        `;
    }

    container.innerHTML = `
        ${impersonateBanner}
        ${trialAlertBanner}
        <div class="dashboard-grid">
            <aside class="sidebar">
                <button class="sidebar-btn ${dashboardActiveTab === 'summary' ? 'active' : ''}" onclick="switchDashboardTab('summary')">📈 Résumé du Jour</button>
                <button class="sidebar-btn ${dashboardActiveTab === 'orders' ? 'active' : ''}" onclick="switchDashboardTab('orders')">📦 Commandes${lockIcon}</button>
                <button class="sidebar-btn ${dashboardActiveTab === 'reservations' ? 'active' : ''}" onclick="switchDashboardTab('reservations')">📅 Réservations${lockIcon}</button>
                <button class="sidebar-btn ${dashboardActiveTab === 'menu' ? 'active' : ''}" onclick="switchDashboardTab('menu')">🍽️ Plats du Jour${lockIcon}</button>
                <button class="sidebar-btn ${dashboardActiveTab === 'reviews' ? 'active' : ''}" onclick="switchDashboardTab('reviews')">💬 Avis Clients</button>
                <button class="sidebar-btn ${dashboardActiveTab === 'accounting' ? 'active' : ''}" onclick="switchDashboardTab('accounting')">📊 Comptabilité${lockIcon}</button>
                <button class="sidebar-btn ${dashboardActiveTab === 'settings' ? 'active' : ''}" onclick="switchDashboardTab('settings')">⚙️ Paramètres</button>
                <button class="sidebar-btn ${dashboardActiveTab === 'subscription' ? 'active' : ''}" onclick="switchDashboardTab('subscription')">💳 Abonnement</button>
            </aside>
            <main class="dashboard-content" id="dashboard-tab-panel">
                <!-- Sub tab contents injected here -->
            </main>
        </div>
    `;

    renderDashboardTabContent(r);
}

function switchDashboardTab(tab) {
    dashboardActiveTab = tab;
    const r = store.getRestaurantById(currentRestaurantSession.id);
    
    const btns = document.querySelectorAll('.sidebar-btn');
    btns.forEach(b => b.classList.remove('active'));
    
    // Highlight active
    const label = tab === 'summary' ? 'résumé' : tab === 'orders' ? 'commandes' : tab === 'reservations' ? 'réservations' : tab === 'menu' ? 'plats' : tab === 'reviews' ? 'avis' : tab === 'accounting' ? 'comptabilité' : tab === 'subscription' ? 'abonnement' : 'paramètres';
    btns.forEach(b => {
        if (b.innerText.toLowerCase().includes(label)) {
            b.classList.add('active');
        }
    });

    renderDashboardTabContent(r);
}

function renderDashboardTabContent(r) {
    const panel = document.getElementById('dashboard-tab-panel');
    
    // Check trial expiry for paywall
    const _cr = new Date(r.createdAt || '2026-06-25T00:00:00Z');
    const _dt = Math.abs(new Date() - _cr);
    const _dd = Math.ceil(_dt / (1000 * 60 * 60 * 24));
    const _pk = r.subscriptionPack || 'Aucun (Gratuit)';
    const trialExpired = _dd > 90 && _pk === 'Aucun (Gratuit)' && !isSuperAdminSession;
    
    // Block restricted tabs if trial expired
    const lockedTabs = ['orders', 'reservations', 'menu', 'accounting'];
    if (trialExpired && lockedTabs.includes(dashboardActiveTab)) {
        const adminWhatsApp = '221781056721';
        const reactivateMsg = encodeURIComponent(`Bonjour Thiès à Table 👋\n\nMa période d'essai gratuit est terminée et je souhaite réactiver mon restaurant.\n\n🏪 Restaurant : ${r.name}\n🆔 Identifiant : ${r.slug}\n\nMerci de m'indiquer la marche à suivre !`);
        panel.innerHTML = `
            <div style="text-align: center; padding: 4rem 2rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px;">
                <div style="font-size: 4rem; margin-bottom: 1.5rem;">🔒</div>
                <h2 style="color: var(--text-primary); font-size: 1.8rem; margin-bottom: 1rem;">Disponible en mode Pro</h2>
                <p style="color: var(--text-secondary); font-size: 1rem; max-width: 500px; margin: 0 auto 1.5rem auto; line-height: 1.6;">Votre période d'essai gratuit de 3 mois est terminée. Cette fonctionnalité est réservée aux restaurants ayant un abonnement actif.</p>
                <div style="background: rgba(220, 53, 69, 0.1); border: 1px solid rgba(220, 53, 69, 0.3); padding: 1rem; border-radius: 12px; margin-bottom: 2rem; max-width: 500px; margin-left: auto; margin-right: auto;">
                    <p style="color: #ff6b6b; font-weight: 600; margin: 0;">⚠️ Votre page restaurant est actuellement indisponible sur la plateforme pour les clients.</p>
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 350px; margin: 0 auto;">
                    <button class="btn btn-primary" onclick="switchDashboardTab('subscription')" style="font-weight: 700;">💳 Voir les offres d'abonnement</button>
                    <a href="https://wa.me/${adminWhatsApp}?text=${reactivateMsg}" target="_blank" class="btn btn-success" style="font-weight: 700; background: #25D366; border-color: #25D366; display: flex; align-items: center; justify-content: center; gap: 0.5rem; text-decoration: none;">💬 Contacter le support WhatsApp</a>
                </div>
            </div>
        `;
        return;
    }
    
    if (dashboardActiveTab === 'summary') {
        const orders = store.getOrdersByRestaurant(r.id);
        const todayStr = new Date().toISOString().split('T')[0];
        const todayOrders = orders.filter(o => o.date === todayStr);
        const pendingOrders = orders.filter(o => o.status === 'Reçue');
        const todayRevenue = todayOrders.filter(o => o.status === 'Livrée').reduce((sum, o) => sum + o.total, 0);
        
        const reservations = store.getReservationsByRestaurant(r.id);
        const upcomingRes = reservations.filter(res => res.status === 'En attente' || res.status === 'Confirmée').length;

        panel.innerHTML = `
            <div style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
                <h2 style="font-family: var(--font-serif); font-size: 1.5rem; color: var(--text-primary);">Résumé du Jour</h2>
                <button class="btn btn-primary btn-sm" onclick="requestPushNotifications()">🔔 Activer Notifications</button>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                <div class="stat-card" style="border-top: 4px solid var(--accent); background: var(--bg-card); padding: 1.25rem; border-radius: 16px; box-shadow: var(--shadow);">
                    <span style="color: var(--text-secondary); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 0.5rem;">⏳ Commandes en attente</span>
                    <span style="font-size: 2rem; font-weight: 800; color: var(--accent);">${pendingOrders.length}</span>
                    ${pendingOrders.length > 0 ? `<button class="btn btn-primary btn-sm" style="margin-top: 1rem; width: 100%;" onclick="switchDashboardTab('orders')">Voir les commandes</button>` : ''}
                </div>
                <div class="stat-card" style="border-top: 4px solid var(--success); background: var(--bg-card); padding: 1.25rem; border-radius: 16px; box-shadow: var(--shadow);">
                    <span style="color: var(--text-secondary); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 0.5rem;">💰 C.A. d'Aujourd'hui</span>
                    <span style="font-size: 2rem; font-weight: 800; color: var(--success);">${todayRevenue.toLocaleString()} FCFA</span>
                    <div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--text-secondary);">${todayOrders.length} commandes aujourd'hui</div>
                </div>
                <div class="stat-card" style="border-top: 4px solid var(--primary); background: var(--bg-card); padding: 1.25rem; border-radius: 16px; box-shadow: var(--shadow);">
                    <span style="color: var(--text-secondary); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 0.5rem;">📅 Réservations Actives</span>
                    <span style="font-size: 2rem; font-weight: 800; color: var(--primary);">${upcomingRes}</span>
                    <button class="btn btn-secondary btn-sm" style="margin-top: 1rem; width: 100%;" onclick="switchDashboardTab('reservations')">Voir l'agenda</button>
                </div>
            </div>
            
            <h3 style="font-family: var(--font-serif); font-size: 1.2rem; color: var(--text-primary); margin-bottom: 1rem;">Action Rapide : Statut du Restaurant</h3>
            <div style="background: var(--bg-card); padding: 1.5rem; border-radius: 16px; border: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between;">
                <div>
                    <strong style="display: block; font-size: 1.1rem; margin-bottom: 0.25rem;">${r.isOpenManual ? '🟢 Ouvert aux commandes' : '🔴 Actuellement fermé (Manuel)'}</strong>
                    <span style="font-size: 0.9rem; color: var(--text-secondary);">Gérez l'ouverture exceptionnelle (ex: rupture de stock totale, fermeture inattendue)</span>
                </div>
                <button class="btn ${r.isOpenManual ? 'btn-danger' : 'btn-success'}" onclick="toggleRestaurantManualStatus('${r.id}')">
                    ${r.isOpenManual ? 'Forcer la Fermeture 🔴' : 'Ré-ouvrir 🟢'}
                </button>
            </div>
        `;
    }
    else if (dashboardActiveTab === 'orders') {
        const orders = store.getOrdersByRestaurant(r.id);
        const todayStr = new Date().toISOString().split('T')[0];
        
        const todayOrders = orders.filter(o => o.date === todayStr);
        const todayRevenue = todayOrders.filter(o => o.status === 'Livrée').reduce((sum, o) => sum + o.total, 0);
        const pendingOrders = orders.filter(o => o.status === 'Reçue').length;

        // Apply filters
        let filteredOrders = [...orders];
        if (currentOrderStatusFilter === 'En attente') {
            filteredOrders = orders.filter(o => o.status === 'Reçue');
        } else if (currentOrderStatusFilter === 'Confirmées') {
            filteredOrders = orders.filter(o => o.status === 'Confirmée' || o.status === 'Prête');
        } else if (currentOrderStatusFilter === 'Livrées') {
            filteredOrders = orders.filter(o => o.status === 'Livrée');
        }

        let listHtml = '';
        if (filteredOrders.length === 0) {
            listHtml = `
                <div style="text-align: center; color: var(--text-secondary); padding: 4rem 0; background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px;">
                    <span style="font-size: 3rem; display: block; margin-bottom: 1rem;">📦</span>
                    Aucune commande ne correspond au filtre <strong>"${currentOrderStatusFilter}"</strong>.
                </div>
            `;
        } else {
            filteredOrders.forEach(o => {
                const itemsStr = o.items.map(i => `<span style="background: var(--bg-secondary); padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.8rem; font-weight: 600; border: 1px solid var(--border); display: inline-block; margin: 0.15rem 0.15rem 0.15rem 0;">${i.name} <strong>x${i.qty}</strong></span>`).join(' ');
                
                // Status styles
                let statusBadge = '';
                let actionBtns = '';
                
                if (o.status === 'Reçue') {
                    statusBadge = `<span class="badge badge-warning" style="animation: pulseMainCircle 2s infinite;">Reçue</span>`;
                    actionBtns = `
                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            <button class="btn btn-primary" onclick="changeOrderStatus('${o.id}', 'Confirmée')" style="font-weight: 700; flex: 1;">
                                ✅ Accepter & notifier 💬
                            </button>
                            <button class="btn btn-danger" onclick="changeOrderStatus('${o.id}', 'Annulée')" style="font-weight: 700; flex: 1;">
                                ❌ Refuser la commande
                            </button>
                        </div>
                    `;
                } else if (o.status === 'Confirmée') {
                    statusBadge = `<span class="badge badge-info">En Préparation</span>`;
                    actionBtns = `
                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            <button class="btn btn-success" onclick="changeOrderStatus('${o.id}', 'Prête')" style="font-weight: 700; flex: 1; background: #007bff; border-color: #007bff;">
                                🛵 Prête & notifier client 💬
                            </button>
                            <button class="btn btn-danger" onclick="changeOrderStatus('${o.id}', 'Annulée')" style="font-weight: 700;">
                                ❌ Annuler
                            </button>
                        </div>
                    `;
                } else if (o.status === 'Prête') {
                    statusBadge = `<span class="badge badge-success">Prête</span>`;
                    actionBtns = `
                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            <button class="btn btn-success" onclick="changeOrderStatus('${o.id}', 'Livrée')" style="font-weight: 700; flex: 1; background: var(--success); border-color: var(--success);">
                                📦 Livrée / Récupérée 💬
                            </button>
                            <button class="btn btn-danger" onclick="changeOrderStatus('${o.id}', 'Annulée')" style="font-weight: 700;">
                                ❌ Annuler
                            </button>
                        </div>
                    `;
                } else if (o.status === 'Annulée') {
                    statusBadge = `<span class="badge badge-danger">Annulée</span>`;
                    actionBtns = `<span style="font-size: 0.85rem; color: var(--danger); font-weight: 600; display: block; text-align: center; padding: 0.5rem; background: rgba(var(--danger-rgb,220,53,69), 0.1); border-radius: 8px;">❌ Commande refusée / annulée</span>`;
                } else {
                    statusBadge = `<span class="badge badge-success" style="opacity: 0.6">Livrée / Récupérée</span>`;
                    const reviewText = `Bonjour ${o.customerName}, avez-vous aimé votre commande chez ${r.name} ? Laissez-nous un avis sur Thiès Resto ! https://thies-resto.com/#/r/${r.slug}`;
                    const waLink = `https://wa.me/${o.customerPhone.replace(/\+/g, '')}?text=${encodeURIComponent(reviewText)}`;
                    actionBtns = `
                        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                            <span style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 600; display: block; text-align: center; padding: 0.5rem; background: var(--bg-secondary); border-radius: 8px;">✅ Commande traitée et archivée</span>
                            <a href="${waLink}" target="_blank" class="btn btn-primary" style="font-weight: 700; background: #25D366; border-color: #25D366; display: flex; justify-content: center; align-items: center; gap: 0.5rem;">⭐ Relance Avis (WhatsApp)</a>
                        </div>
                    `;
                }

                listHtml += `
                    <div class="dashboard-list-item" style="border-left: 4px solid ${o.status === 'Reçue' ? 'var(--accent)' : o.status === 'Livrée' ? 'var(--success)' : 'var(--primary)'}; background: var(--bg-card); border-radius: 16px; padding: 1.5rem; margin-bottom: 1.25rem; box-shadow: var(--shadow);">
                        <div class="list-item-header" style="border-bottom: 1px solid var(--border); padding-bottom: 0.75rem; margin-bottom: 0.75rem;">
                            <div>
                                <span class="list-item-title" style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary);">N° ${o.id}</span>
                                <span style="margin-left: 0.75rem;">${statusBadge}</span>
                            </div>
                            <span class="list-item-time" style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600;">🕒 Le ${o.date} à ${o.time}</span>
                        </div>
                        <div class="list-item-details" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
                            <div>
                                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong style="color:var(--text-secondary)">👤 Client :</strong> <span style="font-weight: 700;">${o.customerName}</span></p>
                                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong style="color:var(--text-secondary)">📞 WhatsApp :</strong> <a href="https://wa.me/${o.customerPhone.replace(/\+/g, '')}" target="_blank" class="call-btn" style="margin-left:0.25rem;">💬 Ouvrir WhatsApp (${o.customerPhone})</a></p>
                                ${o.address ? `<p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong style="color:var(--text-secondary)">📍 Adresse :</strong> ${o.address}</p>` : ''}
                            </div>
                            <div>
                                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong style="color:var(--text-secondary)">🛵 Récupération :</strong> <span class="badge ${o.mode === 'Livraison' ? 'badge-primary' : 'badge-info'}" style="font-weight:700;">${o.mode}</span></p>
                                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong style="color:var(--text-secondary)">💰 Total à payer :</strong> <span style="font-size: 1.1rem; color: var(--primary); font-weight: 800;">${o.total} FCFA</span></p>
                                ${o.note ? `<p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong style="color:var(--text-secondary)">📝 Note :</strong> <span style="font-style: italic; color:var(--text-secondary);">"${o.note}"</span></p>` : ''}
                            </div>
                        </div>
                        <div style="background: var(--bg-secondary); padding: 0.75rem 1rem; border-radius: 12px; margin-bottom: 1.25rem; border: 1px solid var(--border);">
                            <strong style="display: block; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 0.35rem;">🍳 Plats commandés :</strong>
                            <div style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
                                ${itemsStr}
                            </div>
                        </div>
                        <div class="list-item-actions" style="margin-top: 1rem;">
                            ${actionBtns}
                        </div>
                    </div>
                `;
            });
        }

        const filterBtnsHtml = ['Tous', 'En attente', 'Confirmées', 'Livrées'].map(f => {
            const isActive = currentOrderStatusFilter === f;
            return `
                <button class="btn ${isActive ? 'btn-primary' : 'btn-secondary'}" style="padding: 0.4rem 1rem; font-size: 0.85rem; font-weight: 700; border-radius: 20px;" onclick="filterOrdersDashboard('${f}')">
                    ${f === 'En attente' ? '⏳ ' : f === 'Confirmées' ? '🍳 ' : f === 'Livrées' ? '✅ ' : '📦 '}${f}
                </button>
            `;
        }).join(' ');

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
                <h2 style="font-size: 1.25rem; margin: 0;">Gestion des Commandes</h2>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
                    ${filterBtnsHtml}
                    <button class="btn btn-secondary" onclick="exportOrdersToCSV()" style="padding: 0.4rem 0.8rem; font-size: 0.85rem; font-weight: 700; border-radius: 20px; margin-left: 0.5rem;">
                        📥 Exporter CSV
                    </button>
                </div>
            </div>
            
            <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
                <div class="stat-card" style="border-top: 4px solid var(--primary); background: var(--bg-card); padding: 1.25rem; border-radius: 16px; box-shadow: var(--shadow);">
                    <span class="stat-card-title" style="color: var(--text-secondary); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 0.5rem;">📅 Commandes du jour</span>
                    <span class="stat-card-value" style="font-size: 1.75rem; font-weight: 800; color: var(--text-primary);">${todayOrders.length}</span>
                </div>
                <div class="stat-card" style="border-top: 4px solid var(--success); background: var(--bg-card); padding: 1.25rem; border-radius: 16px; box-shadow: var(--shadow);">
                    <span class="stat-card-title" style="color: var(--text-secondary); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 0.5rem;">💰 Chiffre d'affaires (Jour)</span>
                    <span class="stat-card-value" style="font-size: 1.75rem; font-weight: 800; color: var(--success);">${todayRevenue} FCFA</span>
                </div>
                <div class="stat-card" style="border-top: 4px solid var(--accent); background: var(--bg-card); padding: 1.25rem; border-radius: 16px; box-shadow: var(--shadow);">
                    <span class="stat-card-title" style="color: var(--text-secondary); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 0.5rem;">⏳ Commandes en attente</span>
                    <span class="stat-card-value" style="font-size: 1.75rem; font-weight: 800; color: var(--accent);">${pendingOrders}</span>
                </div>
            </div>

            <div class="dashboard-list">
                ${listHtml}
            </div>
        `;
    } 
    else if (dashboardActiveTab === 'reservations') {
        const reservations = store.getReservationsByRestaurant(r.id);
        
        let listHtml = '';
        if (reservations.length === 0) {
            listHtml = `<div style="text-align: center; color: var(--text-secondary); padding: 3rem 0;">Aucune réservation pour le moment.</div>`;
        } else {
            reservations.forEach(res => {
                let statusBadge = '';
                let actionBtns = '';

                if (res.status === 'En attente') {
                    statusBadge = `<span class="badge badge-warning">En Attente</span>`;
                    actionBtns = `
                        <button class="btn btn-success btn-sm" onclick="changeReservationStatus('${res.id}', 'Confirmée')">
                            Confirmer & Envoyer WA 💬
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="changeReservationStatus('${res.id}', 'Annulée')">
                            Annuler & WhatsApp 💬
                        </button>
                    `;
                } else if (res.status === 'Confirmée') {
                    statusBadge = `<span class="badge badge-success">Confirmée</span>`;
                    actionBtns = `<span style="font-size: 0.8rem; color: var(--success)">Validée</span>`;
                } else {
                    statusBadge = `<span class="badge badge-danger">Annulée</span>`;
                    actionBtns = `<span style="font-size: 0.8rem; color: var(--danger)">Annulée</span>`;
                }

                const formattedDate = new Date(res.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });

                listHtml += `
                    <div class="dashboard-list-item">
                        <div class="list-item-header">
                            <div>
                                <span class="list-item-title">${res.id} - <strong>${res.customerName}</strong></span>
                                <span style="margin-left: 0.5rem;">${statusBadge}</span>
                            </div>
                            <span class="list-item-time">📅 Prévu le ${formattedDate} à ${res.time}</span>
                        </div>
                        <div class="list-item-details">
                            👥 Personnes : <strong>${res.guests} couverts</strong> <br>
                            📞 Téléphone : <a href="https://wa.me/${res.customerPhone.replace(/\+/g, '')}" target="_blank" class="call-btn">💬 WhatsApp (${res.customerPhone})</a>
                            ${res.note ? `<br>📝 Note client : <em>"${res.note}"</em>` : ''}
                        </div>
                        <div class="list-item-actions">
                            ${actionBtns}
                        </div>
                    </div>
                `;
            });
        }

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
                <h2 style="font-size: 1.25rem; margin: 0;">Réservations de Tables</h2>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-secondary btn-sm" onclick="exportReservationsToCSV()">
                        📥 Exporter CSV
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="toggleManualReservationForm()">
                        ➕ Prendre une réservation (Appel)
                    </button>
                </div>
            </div>
            
            <!-- Manual Reservation Form -->
            <div id="manual-reservation-card" style="display: none; background: var(--bg-card); border: 1px solid var(--border); padding: 1.5rem; border-radius: 20px; margin-bottom: 2rem;">
                <h3 style="font-size: 1rem; margin-bottom: 1.25rem;">📝 Enregistrer une réservation par téléphone</h3>
                <form onsubmit="saveManualReservation(event, '${r.id}')">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Nom du client <span class="required">*</span></label>
                            <input type="text" id="mres-name" class="form-control" placeholder="Modou Diagne" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Téléphone <span class="required">*</span></label>
                            <input type="tel" id="mres-phone" class="form-control" placeholder="+221 77 123 45 67" required>
                        </div>
                    </div>
                    
                    <div class="form-row" style="margin-top: 1rem;">
                        <div class="form-group">
                            <label class="form-label">Date <span class="required">*</span></label>
                            <input type="date" id="mres-date" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Heure <span class="required">*</span></label>
                            <input type="time" id="mres-time" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Nombre de couverts <span class="required">*</span></label>
                            <input type="number" id="mres-guests" class="form-control" placeholder="4" min="1" required>
                        </div>
                    </div>
                    
                    <div class="form-group" style="margin-top: 1rem;">
                        <label class="form-label">Note / Commentaires (ex: table extérieure, anniversaire...)</label>
                        <textarea id="mres-note" class="form-control" placeholder="Demande particulière du client..."></textarea>
                    </div>
                    
                    <div style="display: flex; gap: 0.5rem; margin-top: 1.5rem;">
                        <button type="submit" class="btn btn-primary">Enregistrer la réservation</button>
                        <button type="button" class="btn btn-secondary" onclick="toggleManualReservationForm()">Annuler</button>
                    </div>
                </form>
            </div>

            <div class="dashboard-list">
                ${listHtml}
            </div>
        `;
    } 
    else if (dashboardActiveTab === 'menu') {
        let menuHtml = '';
        if (r.menu.length === 0) {
            menuHtml = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 2rem 0;">Aucun plat n'a encore été ajouté. Créez-en un ci-dessous !</div>`;
        } else {
            r.menu.forEach(d => {
                menuHtml += `
                    <div class="dish-card" style="flex-direction: row; height: auto; align-items: center; padding: 0.75rem; gap: 1rem;">
                        <img src="${d.image}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'">
                        <div style="flex-grow: 1;">
                            <h4 style="font-size: 0.95rem;">${d.name}</h4>
                            <div style="color: var(--primary); font-weight: 700; font-size: 0.85rem;">${d.price} FCFA</div>
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn ${d.available === false ? 'btn-danger' : 'btn-success'} btn-sm" style="padding: 0.35rem 0.5rem;" onclick="toggleDishAvailability('${d.id}', ${d.available !== false})">
                                ${d.available === false ? '❌ Rupture' : '✅ Dispo'}
                            </button>
                            <button class="btn btn-secondary btn-sm" style="padding: 0.35rem 0.5rem;" onclick="openEditDishForm('${d.id}')">✏️</button>
                            <button class="btn btn-danger btn-sm" style="padding: 0.35rem 0.5rem;" onclick="deleteDish('${d.id}')">🗑️</button>
                        </div>
                    </div>
                `;
            });
        }

        panel.innerHTML = `
            <h2 style="font-size: 1.25rem; margin-bottom: 1rem;">Menu du Jour</h2>
            
            <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem;">
                <!-- Current Dishes List -->
                <div style="background: var(--bg-card); border: 1px solid var(--border); padding: 1.25rem; border-radius: 20px;">
                    <h3 style="font-size: 1rem; margin-bottom: 1rem;">Plats actifs</h3>
                    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                        ${menuHtml}
                    </div>
                </div>

                <!-- Add/Edit Dish Form -->
                <div style="background: var(--bg-card); border: 1px solid var(--border); padding: 1.25rem; border-radius: 20px;" id="dish-form-card">
                    <h3 style="font-size: 1rem; margin-bottom: 1rem;" id="dish-form-title">Ajouter un nouveau plat</h3>
                    <form id="dish-editor-form" onsubmit="saveDish(event)">
                        <input type="hidden" id="dish-edit-id" value="">
                        
                        <div class="form-group">
                            <label class="form-label">Nom du plat <span class="required">*</span></label>
                            <input type="text" id="dish-name" class="form-control" placeholder="Yassa Poulet..." required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Description <span class="required">*</span></label>
                            <textarea id="dish-desc" class="form-control" placeholder="Ingrédients, accompagnements..." required></textarea>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Prix (FCFA) <span class="required">*</span></label>
                                <input type="number" id="dish-price" class="form-control" placeholder="2500" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Photo du plat <span class="required">*</span></label>
                                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                    <input type="file" id="dish-image-file" class="form-control" accept="image/*" onchange="handleDishImageUpload(event)" style="padding: 0.35rem; height: auto;">
                                    <span id="dish-image-status" style="font-size: 0.75rem; color: var(--success); display: none;">Upload en cours...</span>
                                    <input type="hidden" id="dish-image-custom" value="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500">
                                    <div style="text-align: center; margin: 0.25rem 0; font-size: 0.8rem; color: var(--text-secondary);">OU choisir une image par défaut</div>
                                    <select id="dish-image-select" class="form-control" onchange="document.getElementById('dish-image-custom').value = this.value">
                                        <option value="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500">Poisson Rouge / Thieb</option>
                                        <option value="https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500">Poulet / Yassa</option>
                                        <option value="https://images.unsplash.com/photo-1544025162-d76694265947?w=500">Grillades / Viandes / Dibi</option>
                                        <option value="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500">Burger / Sandwich</option>
                                        <option value="https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500">Frites dorées</option>
                                        <option value="https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500">Boisson / Jus maison</option>
                                    </select>
                                </div>
                            </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Ou coller l'URL d'une image (Google, etc.)</label>
                            <input type="text" id="dish-image-custom" class="form-control" placeholder="https://images.unsplash.com/... (optionnel)">
                        </div>
                        
                        <div class="form-group" style="margin-top: 1rem;">
                            <label class="form-label">📸 Télécharger depuis votre téléphone / appareil</label>
                            <input type="file" id="dish-image-file" class="form-control" accept="image/*" onchange="handleDishImageUpload(event)" style="padding: 0.35rem; height: auto;">
                            <div id="dish-image-preview-container" style="display: none; margin-top: 0.75rem; align-items: center; gap: 0.75rem; background: var(--bg-secondary); padding: 0.5rem; border-radius: 10px; border: 1px solid var(--border);">
                                <img id="dish-image-preview" src="" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
                                <span id="dish-image-upload-status" style="font-size: 0.75rem; color: var(--success); font-weight: 600;">Photo sélectionnée avec succès ! ✅</span>
                            </div>
                        </div>
                        
                        <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                            <button type="submit" class="btn btn-primary" style="flex:1;">Enregistrer</button>
                            <button type="button" class="btn btn-secondary" style="display:none;" id="dish-cancel-edit-btn" onclick="resetDishForm()">Annuler la modification</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    } 
    else if (dashboardActiveTab === 'reviews') {
        let reviewsHtml = '';
        if (r.reviews.length === 0) {
            reviewsHtml = `<div style="text-align: center; color: var(--text-secondary); padding: 3rem 0;">Aucun avis reçu pour l'instant.</div>`;
        } else {
            r.reviews.forEach(rev => {
                const stars = '★'.repeat(rev.rating) + '☆'.repeat(5 - rev.rating);
                
                const replySection = rev.reply
                    ? `
                        <div class="review-reply" style="margin-top: 0.75rem;">
                            <div class="review-reply-author">Votre réponse publique :</div>
                            <p>${rev.reply}</p>
                            <button class="btn btn-secondary btn-sm" style="padding: 0.15rem 0.5rem; font-size: 0.7rem; margin-top: 0.5rem;" onclick="openReplyForm('${rev.id}')">Modifier</button>
                        </div>
                    `
                    : `
                        <div id="reply-form-container-${rev.id}" style="margin-top: 0.75rem;">
                            <button class="btn btn-outline btn-sm" onclick="openReplyForm('${rev.id}')">Répondre publiquement</button>
                        </div>
                    `;

                reviewsHtml += `
                    <div class="review-item">
                        <div class="review-header">
                            <div>
                                <span class="review-author">${rev.author}</span>
                                <span class="stars-rating" style="display: block; font-size: 0.8rem;">${stars}</span>
                            </div>
                            <span class="review-date">${rev.date}</span>
                        </div>
                        <p class="review-comment">${rev.comment}</p>
                        ${replySection}
                        
                        <div id="reply-input-area-${rev.id}" style="display:none; margin-top: 0.75rem; background: var(--bg-secondary); padding: 0.75rem; border-radius: 8px;">
                            <label class="form-label" style="font-size: 0.75rem;">Votre réponse :</label>
                            <textarea id="reply-text-${rev.id}" class="form-control" style="font-size: 0.85rem;" placeholder="Merci pour votre retour...">${rev.reply || ''}</textarea>
                            <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                                <button class="btn btn-primary btn-sm" style="font-size: 0.75rem;" onclick="submitReply('${rev.id}')">Publier</button>
                                <button class="btn btn-secondary btn-sm" style="font-size: 0.75rem;" onclick="closeReplyForm('${rev.id}')">Annuler</button>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        panel.innerHTML = `
            <h2 style="font-size: 1.25rem; margin-bottom: 1.5rem;">Avis Clients</h2>
            <div class="reviews-list">
                ${reviewsHtml}
            </div>
        `;
    }
    else if (dashboardActiveTab === 'accounting') {
        let orders = store.getOrdersByRestaurant(r.id);
        const todayStr = new Date().toISOString().split('T')[0];
        
        if (currentAccountingFilter === 'today') {
            orders = orders.filter(o => o.date === todayStr);
        } else if (currentAccountingFilter === 'week') {
            const today = new Date();
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            orders = orders.filter(o => o.date >= weekAgo && o.date <= todayStr);
        } else if (currentAccountingFilter === 'month') {
            const today = new Date();
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            orders = orders.filter(o => o.date >= monthAgo && o.date <= todayStr);
        }

        const completedOrders = orders.filter(o => o.status === 'Livrée');
        const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
        const totalOrdersCount = orders.length;
        const completedOrdersCount = completedOrders.length;
        const avgCart = completedOrdersCount > 0 ? Math.round(totalRevenue / completedOrdersCount) : 0;
        
        // Breakdown by mode
        const deliveryOrders = completedOrders.filter(o => o.mode === 'Livraison');
        const takeawayOrders = completedOrders.filter(o => o.mode === 'A emporter' || o.mode === 'Emporter' || o.mode === 'À emporter');
        const dineInOrders = completedOrders.filter(o => o.mode === 'Sur place');
        
        const deliveryRev = deliveryOrders.reduce((sum, o) => sum + o.total, 0);
        const takeawayRev = takeawayOrders.reduce((sum, o) => sum + o.total, 0);
        const dineInRev = dineInOrders.reduce((sum, o) => sum + o.total, 0);

        // Build list of completed or all orders
        let rowsHtml = '';
        if (orders.length === 0) {
            rowsHtml = `
                <tr>
                    <td colspan="6" style="text-align: center; color: var(--text-secondary); padding: 2rem;">
                        Aucune commande enregistrée pour la période sélectionnée.
                    </td>
                </tr>
            `;
        } else {
            orders.forEach(o => {
                const statusBadge = o.status === 'Livrée' 
                    ? `<span class="badge badge-success" style="background: rgba(16, 185, 129, 0.15); color: var(--success); border: 1px solid rgba(16, 185, 129, 0.3);">Livrée (Payée)</span>`
                    : o.status === 'Reçue'
                    ? `<span class="badge badge-warning" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3);">En attente</span>`
                    : `<span class="badge badge-info" style="background: rgba(59, 130, 246, 0.15); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.3);">${o.status}</span>`;

                rowsHtml += `
                    <tr class="accounting-row" data-client="${(o.customerName || '').toLowerCase()}" data-id="${o.id.toLowerCase()}">
                        <td><strong>${o.date} ${o.time || ''}</strong></td>
                        <td>${o.customerName || 'Client anonyme'}</td>
                        <td><a href="tel:${o.customerPhone}" style="color: var(--success); font-weight: bold;">📞 ${o.customerPhone}</a></td>
                        <td>${o.mode}</td>
                        <td style="color: var(--primary); font-weight: bold;">${o.total.toLocaleString()} FCFA</td>
                        <td>${statusBadge}</td>
                    </tr>
                `;
            });
        }

        panel.innerHTML = `
            <div class="accounting-dashboard">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
                    <div>
                        <h2 style="font-family: var(--font-serif); font-size: 1.6rem; color: var(--text-primary);">📊 Journal de Comptabilité</h2>
                        <p style="color: var(--text-secondary); font-size: 0.85rem;">Suivi des chiffres d'affaires et historique complet des commandes clients.</p>
                    </div>
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        <select class="form-control" style="width: auto; margin: 0; padding: 0.25rem 0.5rem; font-size: 0.85rem;" onchange="currentAccountingFilter = this.value; renderDashboardTabContent(store.getRestaurantById('${r.id}'))">
                            <option value="all" ${currentAccountingFilter === 'all' ? 'selected' : ''}>Toutes les dates</option>
                            <option value="today" ${currentAccountingFilter === 'today' ? 'selected' : ''}>Aujourd'hui</option>
                            <option value="week" ${currentAccountingFilter === 'week' ? 'selected' : ''}>7 derniers jours</option>
                            <option value="month" ${currentAccountingFilter === 'month' ? 'selected' : ''}>30 derniers jours</option>
                        </select>
                        <button class="btn btn-primary btn-sm" onclick="exportOrdersCSV('${r.id}')">💾 Exporter CSV</button>
                        <button class="btn btn-secondary btn-sm" onclick="window.print()">🖨️ Imprimer</button>
                    </div>
                </div>

                <div style="background: rgba(255,255,255,0.02); padding: 1rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 1rem; position: relative; height: 250px;">
                    <canvas id="revenueChart"></canvas>
                </div>

                <div class="accounting-stats-grid">
                    <div class="accounting-card">
                        <div class="accounting-card-title">Chiffre d'Affaires Total</div>
                        <div class="accounting-card-value" style="color: var(--success);">${totalRevenue.toLocaleString()} FCFA</div>
                        <small style="color: var(--text-secondary); font-size: 0.75rem;">Commandes validées & livrées</small>
                    </div>
                    <div class="accounting-card">
                        <div class="accounting-card-title">Commandes traitées</div>
                        <div class="accounting-card-value">${completedOrdersCount} / ${totalOrdersCount}</div>
                        <small style="color: var(--text-secondary); font-size: 0.75rem;">Commandes livrées sur le total</small>
                    </div>
                    <div class="accounting-card">
                        <div class="accounting-card-title">Panier Moyen</div>
                        <div class="accounting-card-value" style="color: var(--primary);">${avgCart.toLocaleString()} FCFA</div>
                        <small style="color: var(--text-secondary); font-size: 0.75rem;">Par commande encaissée</small>
                    </div>
                </div>

                <div class="accounting-stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); margin-bottom: 2rem;">
                    <div class="accounting-card" style="padding: 1rem 1.25rem;">
                        <div class="accounting-card-title" style="font-size: 0.7rem;">🛵 Livraison</div>
                        <div class="accounting-card-value" style="font-size: 1.2rem;">${deliveryRev.toLocaleString()} F</div>
                        <small style="color: var(--text-secondary); font-size: 0.7rem;">${deliveryOrders.length} commande(s)</small>
                    </div>
                    <div class="accounting-card" style="padding: 1rem 1.25rem;">
                        <div class="accounting-card-title" style="font-size: 0.7rem;">🛍️ À Emporter</div>
                        <div class="accounting-card-value" style="font-size: 1.2rem;">${takeawayRev.toLocaleString()} F</div>
                        <small style="color: var(--text-secondary); font-size: 0.7rem;">${takeawayOrders.length} commande(s)</small>
                    </div>
                    <div class="accounting-card" style="padding: 1rem 1.25rem;">
                        <div class="accounting-card-title" style="font-size: 0.7rem;">🍽️ Sur Place</div>
                        <div class="accounting-card-value" style="font-size: 1.2rem;">${dineInRev.toLocaleString()} F</div>
                        <small style="color: var(--text-secondary); font-size: 0.7rem;">${dineInOrders.length} commande(s)</small>
                    </div>
                </div>

                <div class="accounting-table-container">
                    <div class="accounting-header-actions">
                        <h3 style="font-size: 1.1rem; color: var(--text-primary); font-family: var(--font-serif);">Historique Général des Commandes</h3>
                        <input type="text" placeholder="Rechercher par client ou N°..." class="accounting-search" oninput="filterAccountingTable(this.value)">
                    </div>

                    <div class="table-responsive-accounting">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Date & Heure</th>
                                    <th>Client (Prénom & Nom)</th>
                                    <th>Téléphone</th>
                                    <th>Mode</th>
                                    <th>Montant Total</th>
                                    <th>Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rowsHtml}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        setTimeout(() => renderRevenueChart(orders), 100);
    }
    else if (dashboardActiveTab === 'settings') {
        const clientLink = `${window.location.origin}${window.location.pathname}#/r/${r.slug}`;
        const qrCodeUrl = `https://quickchart.io/qr?size=200&text=${encodeURIComponent(clientLink)}`;

        // Days checklist
        let daysHtml = '';
        for (let i = 1; i <= 7; i++) {
            const isChecked = r.closedDays.includes(i);
            daysHtml += `
                <label style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; cursor: pointer; font-size: 0.9rem;">
                    <input type="checkbox" name="closed-day-check" value="${i}" ${isChecked ? 'checked' : ''}>
                    ${getDayName(i)}
                </label>
            `;
        }

        panel.innerHTML = `
            <h2 style="font-size: 1.25rem; margin-bottom: 1.5rem;">Paramètres du Restaurant</h2>
            
            <div style="display: grid; grid-template-columns: 1fr; gap: 2rem;">
                
                <!-- Open/Closed Status Switch -->
                <div style="background: var(--bg-card); border: 1px solid var(--border); padding: 1.5rem; border-radius: 20px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h3 style="font-size: 1.1rem; margin-bottom: 0.25rem;">Statut de la Boutique (Temps Réel)</h3>
                        <p style="color: var(--text-secondary); font-size: 0.85rem;">Indiquez en direct si vous acceptez les commandes aujourd'hui.</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <span id="settings-status-label" class="badge ${r.isOpenManual ? 'badge-success' : 'badge-danger'}">
                            ${r.isOpenManual ? 'OUVERT' : 'FERMÉ'}
                        </span>
                        <button class="btn ${r.isOpenManual ? 'btn-danger' : 'btn-success'} btn-sm" onclick="toggleStoreOpenStatus('${r.id}')">
                            ${r.isOpenManual ? 'Fermer Boutique 🔒' : 'Ouvrir Boutique 🔓'}
                        </button>
                    </div>
                </div>

                <!-- Info Modification Form -->
                
                <div style="background: var(--bg-card); border: 1px solid var(--border); padding: 1.5rem; border-radius: 20px;">
                    <h3 style="font-size: 1.1rem; margin-bottom: 1.25rem;">Coordonnées, Horaires & Logo</h3>
                    <form onsubmit="saveProfileSettings(event, '${r.id}')">
                        <div class="form-group" style="margin-bottom: 1.5rem;">
                            <label class="form-label">Logo du Restaurant</label>
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                <img id="settings-logo-preview" src="${r.image}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary);" onerror="this.src='https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200'">
                                <div style="flex: 1;">
                                    <input type="file" id="settings-logo-file" class="form-control" accept="image/*" onchange="handleRestaurantLogoUpload(event)" style="padding: 0.35rem; height: auto;">
                                    <input type="hidden" id="settings-logo-url" value="${r.image}">
                                    <span id="settings-logo-status" style="font-size: 0.75rem; color: var(--success); display: none; margin-top: 0.25rem;">Upload en cours...</span>
                                </div>
                            </div>
                        </div>

                        <div class="form-group" style="background: rgba(242,107,33,0.05); padding: 1rem; border-radius: 12px; border: 1px dashed var(--primary); margin-bottom: 1.5rem;">
                            <label class="form-label" style="color: var(--primary);">📍 Coordonnées GPS (Requis pour la livraison) <span class="required">*</span></label>
                            <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <input type="number" id="settings-lat" class="form-control" step="any" value="${r.lat || ''}" placeholder="Latitude (ex: 14.79)" required style="margin-bottom: 0;">
                                <input type="number" id="settings-lng" class="form-control" step="any" value="${r.lng || ''}" placeholder="Longitude (ex: -16.92)" required style="margin-bottom: 0;">
                            </div>
                            <button type="button" class="btn btn-secondary btn-sm" onclick="captureGPSCoordinates()" style="width: 100%;">📌 Capturer ma position actuelle</button>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Numéro WhatsApp de réception <span class="required">*</span></label>
                            <input type="tel" id="settings-whatsapp" class="form-control" value="${r.whatsapp}" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Horaires habituels <span class="required">*</span></label>
                            <input type="text" id="settings-hours" class="form-control" value="${r.openHours}" placeholder="12:00 - 23:00" required>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Jours de fermeture hebdomadaire</label>
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; margin-top: 0.5rem;">
                                ${daysHtml}
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Nouveau mot de passe (Optionnel)</label>
                            <input type="password" id="settings-password" class="form-control" placeholder="Laisser vide si aucun changement">
                        </div>

                        <button type="submit" id="settings-submit-btn" class="btn btn-primary">Enregistrer les modifications</button>
                    </form>
                </div>


                <!-- QR Code Generation -->
                <div class="qr-container" style="margin: 0 auto;">
                    <h3 style="font-size: 1.1rem; margin-bottom: 0.5rem;">QR Code de Commande</h3>
                    <p style="color: var(--text-secondary); font-size: 0.8rem; margin-bottom: 1rem;">Imprimez et posez ce QR Code sur vos tables ou comptoir pour que vos clients scannent et commandent.</p>
                    <img src="${qrCodeUrl}" class="qr-image" alt="QR Code Link">
                    <a href="${qrCodeUrl}" target="_blank" download="qrcode-${r.slug}.png" class="btn btn-secondary btn-sm btn-block">
                        Imprimer / Télécharger 🖨️
                    </a>
                </div>
            </div>
        `;
    }

    else if (dashboardActiveTab === 'subscription') {
        const currentDate = new Date();
        const createdAt = new Date(r.createdAt || '2026-06-26T00:00:00Z');
        const diffTime = Math.abs(currentDate - createdAt);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const daysLeft = Math.max(0, 90 - diffDays);
        
        // WhatsApp admin number for subscription requests
        const adminWhatsApp = '221781056721';
        const buildWhatsAppLink = (pack, price) => {
            const msg = encodeURIComponent(`Bonjour Thiès à Table 👋\n\nJe souhaite souscrire au *${pack}* (${price} FCFA/mois) pour réactiver mon restaurant.\n\n🏪 Restaurant : ${r.name}\n🆔 Identifiant : ${r.slug}\n📦 Pack choisi : ${pack}\n\nMerci de procéder à l'activation !`);
            return 'https://wa.me/' + adminWhatsApp + '?text=' + msg;
        };
        
        let freePeriodHtml = '';
        if (daysLeft > 0) {
            freePeriodHtml = `
                <div style="background: linear-gradient(135deg, var(--success) 0%, #20c997 100%); color: var(--primary); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <h3 style="margin: 0 0 0.5rem 0; font-size: 1.4rem;">🎉 Période de Gratuité en cours</h3>
                        <p style="margin: 0; font-size: 1rem; opacity: 0.9;">Il vous reste <strong>${daysLeft} jours</strong> d'accès gratuit. Profitez-en pour développer votre chiffre d'affaires !</p>
                    </div>
                    <div style="font-size: 2.5rem;">🎁</div>
                </div>
            `;
        } else {
            const reactivateMsg = encodeURIComponent(`Bonjour Thiès à Table 👋\n\nMa période d'essai gratuit est terminée et je souhaite réactiver mon restaurant.\n\n🏪 Restaurant : ${r.name}\n🆔 Identifiant : ${r.slug}\n\nMerci de m'indiquer la marche à suivre !`);
            freePeriodHtml = `
                <div style="background: linear-gradient(135deg, var(--danger) 0%, #ff4b4b 100%); color: var(--primary); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                        <div>
                            <h3 style="margin: 0 0 0.5rem 0; font-size: 1.4rem;">⚠️ Période d'essai terminée</h3>
                            <p style="margin: 0; font-size: 1rem; opacity: 0.9;">Vos 3 mois gratuits sont écoulés. <strong>Votre restaurant a été automatiquement désactivé.</strong> Choisissez un pack ci-dessous et envoyez-nous un message WhatsApp pour réactiver votre boutique.</p>
                        </div>
                        <div style="font-size: 2.5rem;">🔒</div>
                    </div>
                    <a href="https://wa.me/${adminWhatsApp}?text=${reactivateMsg}" target="_blank" style="display: inline-flex; align-items: center; gap: 0.5rem; background: white; color: #25D366; padding: 0.6rem 1.2rem; border-radius: 10px; font-weight: 700; text-decoration: none; font-size: 0.95rem;">
                        💬 Contacter Thiès à Table sur WhatsApp
                    </a>
                </div>
            `;
        }
        
        panel.innerHTML = `
            <div style="background: var(--bg-card); padding: 2rem; border-radius: 20px; box-shadow: var(--shadow); max-width: 1000px; margin: 0 auto;">
                <h2 style="margin-bottom: 1rem; color: var(--text-primary); font-size: 1.8rem; font-weight: 800; border-bottom: 2px solid var(--border); padding-bottom: 0.5rem;">💳 Mon Abonnement & Visibilité</h2>
                
                ${freePeriodHtml}

                <h3 style="margin-bottom: 0.5rem; color: var(--text-primary); font-size: 1.3rem;">Des forfaits Gagnant-Gagnant</h3>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">Nos tarifs sont pensés pour s'adapter à la taille de votre activité. Pour souscrire, cliquez sur le bouton du pack qui vous convient et envoyez-nous un message WhatsApp avec vos identifiants.</p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
                    <!-- Pack Simple -->
                    <div style="border: 2px solid var(--border); border-radius: 16px; padding: 1.5rem; display: flex; flex-direction: column; transition: transform 0.3s ease; background: var(--bg-secondary);">
                        <h4 style="margin: 0 0 0.5rem 0; font-size: 1.3rem; color: var(--text-primary);">Pack Simple</h4>
                        <div style="font-size: 1.8rem; font-weight: 800; color: var(--primary); margin-bottom: 0.5rem;">5 000 <span style="font-size: 1rem; color: var(--text-secondary); font-weight: 600;">FCFA / mois</span></div>
                        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">L'essentiel pour exister en ligne et recevoir des commandes.</p>
                        <ul style="list-style: none; padding: 0; margin: 0 0 1.5rem 0; flex-grow: 1; color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6;">
                            <li style="margin-bottom: 0.5rem;">✅ Menu digital accessible 24/7</li>
                            <li style="margin-bottom: 0.5rem;">✅ Réception illimitée de commandes</li>
                            <li style="margin-bottom: 0.5rem;">✅ Visibilité standard sur l'application</li>
                            <li style="margin-bottom: 0.5rem;">✅ Rapport d'activité trimestriel</li>
                            <li style="margin-bottom: 0.5rem;">✅ Support technique par e-mail</li>
                        </ul>
                        <a href="${buildWhatsAppLink('Pack Simple', '5 000')}" target="_blank" class="btn btn-outline" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem; text-decoration: none;">💬 Souscrire via WhatsApp</a>
                    </div>

                    <!-- Pack Startup -->
                    <div style="border: 2px solid var(--primary); border-radius: 16px; padding: 1.5rem; display: flex; flex-direction: column; position: relative; background: rgba(var(--primary-rgb), 0.03); box-shadow: 0 10px 25px rgba(var(--primary-rgb), 0.1);">
                        <div style="position: absolute; top: -12px; right: 20px; background: var(--primary); color: var(--primary); padding: 0.2rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 700;">Recommandé</div>
                        <h4 style="margin: 0 0 0.5rem 0; font-size: 1.3rem; color: var(--text-primary);">Pack Startup</h4>
                        <div style="font-size: 1.8rem; font-weight: 800; color: var(--primary); margin-bottom: 0.5rem;">15 000 <span style="font-size: 1rem; color: var(--text-secondary); font-weight: 600;">FCFA / mois</span></div>
                        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">Pour booster vos ventes avec une meilleure visibilité.</p>
                        <ul style="list-style: none; padding: 0; margin: 0 0 1.5rem 0; flex-grow: 1; color: var(--text-primary); font-size: 0.95rem; line-height: 1.6; font-weight: 500;">
                            <li style="margin-bottom: 0.5rem;">✅ <strong>Tout du Pack Simple</strong></li>
                            <li style="margin-bottom: 0.5rem;">🚀 <strong>Positionnement prioritaire</strong> dans votre catégorie</li>
                            <li style="margin-bottom: 0.5rem;">⭐ Badge "Restaurant Certifié"</li>
                            <li style="margin-bottom: 0.5rem;">📊 Rapport détaillé des ventes (Mensuel)</li>
                            <li style="margin-bottom: 0.5rem;">💬 Support direct et rapide via WhatsApp</li>
                        </ul>
                        <a href="${buildWhatsAppLink('Pack Startup', '15 000')}" target="_blank" class="btn btn-primary" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem; text-decoration: none;">💬 Souscrire via WhatsApp</a>
                    </div>

                    <!-- Pack Entreprise -->
                    <div style="border: 2px solid var(--accent); border-radius: 16px; padding: 1.5rem; display: flex; flex-direction: column; background: rgba(var(--accent-rgb), 0.03);">
                        <h4 style="margin: 0 0 0.5rem 0; font-size: 1.3rem; color: var(--text-primary);">Pack Entreprise</h4>
                        <div style="font-size: 1.8rem; font-weight: 800; color: var(--accent); margin-bottom: 0.5rem;">25 000 <span style="font-size: 1rem; color: var(--text-secondary); font-weight: 600;">FCFA / mois</span></div>
                        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">La solution complète pour dominer le marché local.</p>
                        <ul style="list-style: none; padding: 0; margin: 0 0 1.5rem 0; flex-grow: 1; color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6;">
                            <li style="margin-bottom: 0.5rem;">✅ <strong>Tout du Pack Startup</strong></li>
                            <li style="margin-bottom: 0.5rem;">📢 <strong>Bannière publicitaire</strong> sur l'accueil</li>
                            <li style="margin-bottom: 0.5rem;">📱 1 Post sponsorisé par mois sur nos réseaux</li>
                            <li style="margin-bottom: 0.5rem;">🎁 Outils de fidélisation (Coupons promo)</li>
                            <li style="margin-bottom: 0.5rem;">📈 Statistiques avancées (Hebdomadaire)</li>
                        </ul>
                        <a href="${buildWhatsAppLink('Pack Entreprise', '25 000')}" target="_blank" class="btn btn-outline" style="width: 100%; border-color: var(--accent); color: var(--accent); display: flex; align-items: center; justify-content: center; gap: 0.5rem; text-decoration: none;">💬 Souscrire via WhatsApp</a>
                    </div>
                </div>
            </div>
        `;
    }

}

// Global helper for accounting search filtering
window.filterAccountingTable = function(val) {
    const q = val.toLowerCase().trim();
    const rows = document.querySelectorAll('.accounting-row');
    rows.forEach(r => {
        const client = r.getAttribute('data-client') || '';
        const id = r.getAttribute('data-id') || '';
        if (client.includes(q) || id.includes(q)) {
            r.style.display = '';
        } else {
            r.style.display = 'none';
        }
    });
};
// Global helper for landing page how-it-works tabs switching
window.switchHowItWorksTab = function(tabId) {
    document.querySelectorAll('.hw-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.hw-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Highlight the active button
    const activeBtn = document.querySelector(`.hw-tab-btn[onclick*="${tabId}"]`);
    const activeContent = document.getElementById(tabId);
    if (activeBtn) activeBtn.classList.add('active');
    if (activeContent) activeContent.classList.add('active');
};


// Navigate to loyalty tab and check points
window.openLoyaltyAndCheck = function(phone) {
    if (window.location.hash !== '#/' && window.location.hash !== '') {
        router.navigate('/');
    }
    setTimeout(() => {
        if (typeof switchHowItWorksTab === 'function') {
            switchHowItWorksTab('hw-loyalty');
        }
        const hwSection = document.getElementById('how-it-works-section');
        if (hwSection) {
            hwSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        const phoneInput = document.getElementById('loyalty-phone');
        if (phoneInput) {
            phoneInput.value = phone;
            window.checkLoyaltyPoints();
        }
    }, 200);
};

// Global helper for checking customer loyalty points
window.checkLoyaltyPoints = async function() {
    const rawPhone = document.getElementById('loyalty-phone').value.trim();
    if (!rawPhone) {
        showToast("Veuillez saisir votre numéro WhatsApp", "warning");
        return;
    }
    const phone = cleanPhoneNumber(rawPhone);
    if (!/^\+221(70|75|76|77|78)\d{7}$/.test(phone.replace(/\s+/g, ''))) {
        showToast("Numéro de téléphone sénégalais invalide (ex: +221 77 XXX XX XX)", "danger");
        return;
    }

    let ordersCount = 0;
    let resCount = 0;
    let usedRewards = 0;

    if (supabaseClient) {
        const { data, error } = await supabaseClient.rpc('get_customer_loyalty_data', { p_phone: phone });
        if (!error && data && data.length > 0) {
            ordersCount = data[0].orders_count;
            resCount = data[0].reservations_count;
            usedRewards = data[0].used_rewards;
        }
    } else {
        ordersCount = store.data.orders.filter(o => cleanPhoneNumber(o.customerPhone) === phone && o.status === 'Livrée').length;
        resCount = store.data.reservations.filter(r => cleanPhoneNumber(r.customerPhone) === phone && r.status === 'Confirmée').length;
        if (!store.data.usedRewards) store.data.usedRewards = {};
        usedRewards = store.data.usedRewards[phone] || 0;
    }

    const orderPoints = ordersCount * 5;
    const resPoints = resCount * 5;
    const totalPoints = orderPoints + resPoints;

    const totalRewardsUnlocked = Math.floor(totalPoints / 100);
    const activeRewards = Math.max(0, totalRewardsUnlocked - usedRewards);
    const nextRewardPoints = 100 - (totalPoints % 100);

    // Gamification badges
    let tier = 'Gourmand de Bronze 🥉';
    let tierClass = 'tier-bronze';
    if (totalPoints >= 200) {
        tier = 'Empereur du Goût 👑';
        tierClass = 'tier-emperor';
    } else if (totalPoints >= 100) {
        tier = 'Gourmand d\'Or 🥇';
        tierClass = 'tier-gold';
    } else if (totalPoints >= 50) {
        tier = 'Gourmand d\'Argent 🥈';
        tierClass = 'tier-silver';
    }

    const resultCard = document.getElementById('loyalty-result-card');
    if (!resultCard) return;
    
    resultCard.style.display = 'block';
    
    let rewardActionHtml = '';
    if (activeRewards > 0) {
        rewardActionHtml = `
            <div class="reward-claim-box" style="margin-top: 1.5rem; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); padding: 1.25rem; border-radius: 16px; display: flex; align-items: center; gap: 1rem;">
                <span class="gift-icon" style="font-size: 2.2rem;">🎁</span>
                <div style="flex: 1; text-align: left;">
                    <h4 style="color: var(--text-primary); margin: 0 0 0.25rem 0; font-family: var(--font-serif); font-size: 1.05rem;">Vous avez ${activeRewards} plat(s) offert(s) disponible(s) !</h4>
                    <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0 0 0.5rem 0;">Profitez de votre récompense de fidélité lors de votre prochaine commande en ligne.</p>
                    <button class="btn btn-sm btn-success" onclick="applyLoyaltyRewardToCart('${phone}')">Appliquer au panier actif 🛒</button>
                </div>
            </div>
        `;
    }

    resultCard.innerHTML = `
        <div class="loyalty-card-inner" style="background: linear-gradient(135deg, #071a11 0%, #0c2b1d 100%); border: 1px solid var(--border); border-radius: 24px; padding: 1.75rem; text-align: left; position: relative; overflow: hidden; box-shadow: var(--shadow);">
            <div class="loyalty-card-header" style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 1rem; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
                <div>
                    <h3 style="font-family: var(--font-serif); color: var(--text-primary); margin: 0; font-size: 1.3rem;">Carte de Fidélité</h3>
                    <span class="loyalty-phone-lbl" style="font-size: 0.8rem; color: var(--text-secondary); font-family: monospace;">WhatsApp: ${phone}</span>
                </div>
                <div class="loyalty-tier-badge ${tierClass}" style="font-size: 0.8rem; font-weight: bold; padding: 0.35rem 0.75rem; border-radius: 20px; text-transform: uppercase; background: rgba(255,255,255,0.05); color: var(--primary); border: 1px solid rgba(207,168,83,0.3);">${tier}</div>
            </div>
            
            <div class="loyalty-card-body">
                <div class="loyalty-gauge-container" style="display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1rem; flex-wrap: wrap;">
                    <div class="loyalty-points-circle" style="width: 80px; height: 80px; border-radius: 50%; background: rgba(207, 168, 83, 0.1); border: 2.5px solid var(--primary); display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(207,168,83,0.15);">
                        <span class="points-num" style="font-size: 1.8rem; font-weight: 800; color: var(--primary); font-family: var(--font-serif); line-height: 1;">${totalPoints}</span>
                        <span class="points-lbl" style="font-size: 0.6rem; text-transform: uppercase; color: var(--text-secondary); margin-top: 2px;">Points</span>
                    </div>
                    <div class="loyalty-progress-text" style="flex: 1; min-width: 200px;">
                        <p style="font-size: 1.1rem; font-weight: bold; color: var(--text-primary); margin: 0;">${totalPoints % 100} / 100 pts</p>
                        <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0.25rem 0 0 0;">
                            Plus que <strong style="color: var(--primary);">${nextRewardPoints} points</strong> pour obtenir votre prochain plat gratuit !
                        </p>
                    </div>
                </div>
                
                <div class="loyalty-progress-bar-bg" style="width: 100%; height: 8px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; margin-bottom: 1.5rem; border: 1px solid rgba(255,255,255,0.02);">
                    <div class="loyalty-progress-bar-fill" style="width: ${totalPoints % 100}%; height: 100%; background: linear-gradient(90deg, var(--primary), var(--accent)); border-radius: 10px; transition: width 0.4s ease;"></div>
                </div>

                <div class="loyalty-stats-summary" style="display: flex; justify-content: space-around; gap: 1rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1.25rem; margin-top: 1rem; text-align: center; flex-wrap: wrap;">
                    <div class="loyalty-stat-col" style="flex: 1; min-width: 80px;">
                        <span class="stat-num" style="font-size: 1.25rem; font-weight: bold; color: var(--text-primary); display: block; margin-bottom: 0.25rem;">${ordersCount}</span>
                        <span class="stat-lbl" style="font-size: 0.75rem; color: var(--text-secondary); display: block;">Commandes livrées</span>
                    </div>
                    <div class="loyalty-stat-col" style="flex: 1; min-width: 80px;">
                        <span class="stat-num" style="font-size: 1.25rem; font-weight: bold; color: var(--text-primary); display: block; margin-bottom: 0.25rem;">${resCount}</span>
                        <span class="stat-lbl" style="font-size: 0.75rem; color: var(--text-secondary); display: block;">Tables réservées</span>
                    </div>
                    <div class="loyalty-stat-col" style="flex: 1; min-width: 80px;">
                        <span class="stat-num" style="font-size: 1.25rem; font-weight: bold; color: var(--text-primary); display: block; margin-bottom: 0.25rem;">${usedRewards}</span>
                        <span class="stat-lbl" style="font-size: 0.75rem; color: var(--text-secondary); display: block;">Cadeaux réclamés</span>
                    </div>
                </div>

                ${rewardActionHtml}
            </div>
        </div>
    `;
};

// Global helper for applying loyalty reward to cart
window.applyLoyaltyRewardToCart = async function(phone) {
    if (!cart.items || cart.items.length === 0) {
        showToast("Votre panier est vide. Veuillez d'abord ajouter des plats depuis un restaurant !", "warning");
        return;
    }
    
    let ordersCount = 0;
    let resCount = 0;
    let usedRewards = 0;

    if (supabaseClient) {
        const { data, error } = await supabaseClient.rpc('get_customer_loyalty_data', { p_phone: phone });
        if (!error && data && data.length > 0) {
            ordersCount = data[0].orders_count;
            resCount = data[0].reservations_count;
            usedRewards = data[0].used_rewards;
        }
    } else {
        ordersCount = store.data.orders.filter(o => cleanPhoneNumber(o.customerPhone) === phone && o.status === 'Livrée').length;
        resCount = store.data.reservations.filter(r => cleanPhoneNumber(r.customerPhone) === phone && r.status === 'Confirmée').length;
        if (!store.data.usedRewards) store.data.usedRewards = {};
        usedRewards = store.data.usedRewards[phone] || 0;
    }

    const totalPoints = ordersCount * 5 + resCount * 5;
    const totalRewardsUnlocked = Math.floor(totalPoints / 100);
    const activeRewards = Math.max(0, totalRewardsUnlocked - usedRewards);
    
    if (activeRewards <= 0) {
        showToast("Vous n'avez aucune récompense disponible pour le moment.", "danger");
        return;
    }
    
    cart.loyaltyApplied = true;
    cart.loyaltyPhone = phone;
    recalculateCart();
    saveCart();
    
    // Redirect to active restaurant detail checkout tab
    const activeResto = store.getRestaurantById(cart.restaurantId);
    if (activeResto) {
        router.navigate(`/r/${activeResto.slug}`);
        setTimeout(() => {
            switchRestoTab('checkout');
        }, 150);
    }
    
    showToast("🎁 Récompense Fidélité appliquée ! Réduction de 2,500 FCFA.", "success");
    
    // Update checker view if on home
    checkLoyaltyPoints();
};

// Global helper for removing loyalty reward from active cart
window.removeLoyaltyReward = function() {
    cart.loyaltyApplied = false;
    cart.loyaltyPhone = null;
    recalculateCart();
    saveCart();
    
    const activeResto = store.getRestaurantById(cart.restaurantId);
    if (activeResto) {
        renderCheckoutTab(activeResto);
    }
    showToast("Réduction de fidélité retirée.", "info");
};

// Actions from restaurant dashboard
function changeOrderStatus(orderId, nextStatus) {
    const o = store.data.orders.find(ord => ord.id === orderId);
    if (!o) return;
    
    store.updateOrderStatus(orderId, nextStatus);
    
    // Build notification message for the client
    let pushText = '';
    const restoName = currentRestaurantSession ? currentRestaurantSession.name || '' : '';
    
    if (nextStatus === 'Confirmée') {
        pushText = `Bonjour ${o.customerName} 👋\n\nVotre commande n°${o.id} chez *${restoName}* a été *acceptée* et part en cuisine ! 🍳\n\nMontant : ${o.total} FCFA\nMode : ${o.mode}\n\nMerci pour votre confiance !`;
    } else if (nextStatus === 'Prête') {
        pushText = `Bonjour ${o.customerName} 👋\n\nVotre commande n°${o.id} chez *${restoName}* est *PRÊTE* ! 🛵\n\n${o.mode === 'Livraison' ? 'Elle est en cours de livraison.' : 'Vous pouvez venir la récupérer.'}\n\nBon appétit !`;
    } else if (nextStatus === 'Livrée') {
        pushText = `Bonjour ${o.customerName} 👋\n\nVotre commande n°${o.id} chez *${restoName}* a été *livrée avec succès*. 😋\n\nMerci et à bientôt sur Thiès à Table !`;
    } else if (nextStatus === 'Annulée') {
        pushText = `Bonjour ${o.customerName} 👋\n\nNous sommes désolés, votre commande n°${o.id} chez *${restoName}* a été *annulée* par le restaurant. ❌\n\nVeuillez nous excuser pour ce désagrément. N'hésitez pas à passer une nouvelle commande.`;
    }
    
    showToast(`Commande mise à jour vers : ${nextStatus}`, nextStatus === 'Annulée' ? 'warning' : 'success');
    
    // Open WhatsApp to notify the client directly
    if (pushText && o.customerPhone) {
        const waLink = 'https://wa.me/' + o.customerPhone.replace(/\+/g, '') + '?text=' + encodeURIComponent(pushText);
        window.open(waLink, '_blank');
        showToast(`📲 WhatsApp ouvert pour notifier le client !`, 'success');
    }
    
    // Reload dashboard list
    switchDashboardTab('orders');
}

function changeReservationStatus(resId, nextStatus) {
    const res = store.data.reservations.find(r => r.id === resId);
    if (!res) return;
    
    store.updateReservationStatus(resId, nextStatus);
    
    let pushText = '';
    const formattedDate = new Date(res.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    
    if (nextStatus === 'Confirmée') {
        pushText = `Réservation confirmée pour ${res.guests} personnes le ${formattedDate} à ${res.time}. 📅`;
    } else if (nextStatus === 'Annulée') {
        pushText = `Réservation annulée pour cause d'indisponibilité le ${formattedDate}.`;
    }
    
    showToast(`Réservation mise à jour : ${nextStatus}`, "success");
    if (pushText) {
        showToast(`📲 Notification push envoyée au client !`, "success");
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Push Envoyé au Client', {
                body: pushText,
                icon: 'icon.png'
            });
        }
    }

    switchDashboardTab('reservations');
}

function toggleManualReservationForm() {
    const card = document.getElementById('manual-reservation-card');
    if (card) {
        if (card.style.display === 'none') {
            card.style.display = 'block';
            card.scrollIntoView({ behavior: 'smooth' });
        } else {
            card.style.display = 'none';
        }
    }
}

function saveManualReservation(e, restaurantId) {
    e.preventDefault();
    
    const name = document.getElementById('mres-name').value.trim();
    const phone = cleanPhoneNumber(document.getElementById('mres-phone').value.trim());
    const date = document.getElementById('mres-date').value;
    const time = document.getElementById('mres-time').value;
    const guests = parseInt(document.getElementById('mres-guests').value);
    const note = document.getElementById('mres-note').value.trim();
    
    if (!/^\+221(70|75|76|77|78)\d{7}$/.test(phone.replace(/\s+/g, ''))) {
        showToast("Numéro de téléphone invalide (ex: +221 77 XXX XX XX)", "danger");
        return;
    }
    
    const newResId = "RES-" + Math.floor(100000 + Math.random() * 900000);
    const newReservation = {
        id: newResId,
        restaurantId,
        customerName: name,
        customerPhone: phone,
        date,
        time,
        guests,
        note,
        status: 'Confirmée' // Direct confirmation for phone bookings taken by admin
    };
    
    store.addReservation(newReservation);
    showToast("Réservation enregistrée et confirmée ! ✅", "success");
    
    // Switch to reload
    switchDashboardTab('reservations');
}

function filterOrdersDashboard(status) {
    currentOrderStatusFilter = status;
    const r = store.getRestaurantById(currentRestaurantSession.id);
    renderDashboardTabContent(r);
}

function deleteDish(dishId) {
    if (confirm("Voulez-vous vraiment supprimer ce plat du jour ?")) {
        const r = store.getRestaurantById(currentRestaurantSession.id);
        r.menu = r.menu.filter(d => d.id !== dishId);
        store.updateRestaurant(r.id, { menu: r.menu });
        showToast("Plat supprimé !", "success");
        switchDashboardTab('menu');
    }
}

function openEditDishForm(dishId) {
    const r = store.getRestaurantById(currentRestaurantSession.id);
    const dish = r.menu.find(d => d.id === dishId);
    if (!dish) return;
    
    document.getElementById('dish-form-title').innerText = "Modifier le plat : " + dish.name;
    document.getElementById('dish-edit-id').value = dish.id;
    document.getElementById('dish-name').value = dish.name;
    document.getElementById('dish-desc').value = dish.description;
    document.getElementById('dish-price').value = dish.price;
    
    const selectImg = document.getElementById('dish-image-select');
    const customImg = document.getElementById('dish-image-custom');
    if (Array.from(selectImg.options).some(opt => opt.value === dish.image)) {
        selectImg.value = dish.image;
        customImg.value = '';
    } else {
        selectImg.selectedIndex = 0;
        customImg.value = dish.image;
    }
    
    document.getElementById('dish-cancel-edit-btn').style.display = 'block';
    document.getElementById('dish-form-card').scrollIntoView({ behavior: 'smooth' });
}

function resetDishForm() {
    document.getElementById('dish-form-title').innerText = "Ajouter un nouveau plat";
    document.getElementById('dish-edit-id').value = '';
    document.getElementById('dish-name').value = '';
    document.getElementById('dish-desc').value = '';
    document.getElementById('dish-price').value = '';
    document.getElementById('dish-image-select').selectedIndex = 0;
    document.getElementById('dish-image-custom').value = '';
    document.getElementById('dish-cancel-edit-btn').style.display = 'none';
    
    const fileInput = document.getElementById('dish-image-file');
    if (fileInput) fileInput.value = '';
    
    const previewContainer = document.getElementById('dish-image-preview-container');
    if (previewContainer) previewContainer.style.display = 'none';
}

window.handleDishImageUpload = async function(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!supabaseClient) {
        showToast("Service Storage non disponible", "danger");
        return;
    }

    const previewImg = document.getElementById('dish-image-preview');
    const container = document.getElementById('dish-image-preview-container');
    const statusText = document.getElementById('dish-image-upload-status');
    const customInput = document.getElementById('dish-image-custom');
    const submitBtn = document.querySelector('#dish-editor-form button[type="submit"]');

    if (container) container.style.display = 'flex';
    if (previewImg) previewImg.src = URL.createObjectURL(file);
    if (statusText) {
        statusText.innerHTML = `⏳ Téléchargement vers Supabase...`;
        statusText.style.color = "var(--warning)";
    }
    if (submitBtn) submitBtn.disabled = true;

    // Build unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `dishes/${currentRestaurantSession.id}/${fileName}`;

    try {
        const { data, error } = await supabaseClient.storage
            .from('restaurant-images')
            .upload(filePath, file);

        if (error) throw error;

        const { data: publicUrlData } = supabaseClient.storage
            .from('restaurant-images')
            .getPublicUrl(filePath);

        customInput.value = publicUrlData.publicUrl;
        
        if (statusText) {
            statusText.innerHTML = `✅ Photo uploadée et hébergée sur Supabase !`;
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

window.handleRestaurantLogoUpload = async function(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!supabaseClient) {
        showToast("Service Storage non disponible", "danger");
        return;
    }

    const previewImg = document.getElementById('settings-logo-preview');
    const statusText = document.getElementById('settings-logo-status');
    const urlInput = document.getElementById('settings-logo-url');
    const submitBtn = document.getElementById('settings-submit-btn');

    if (previewImg) previewImg.src = URL.createObjectURL(file);
    if (statusText) {
        statusText.style.display = 'block';
        statusText.innerHTML = `⏳ Téléchargement vers Supabase...`;
        statusText.style.color = "var(--warning)";
    }
    if (submitBtn) submitBtn.disabled = true;

    // Build unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `restaurants/${currentRestaurantSession.id}/${fileName}`;

    try {
        const { data, error } = await supabaseClient.storage
            .from('restaurant-images')
            .upload(filePath, file);

        if (error) throw error;

        const { data: publicUrlData } = supabaseClient.storage
            .from('restaurant-images')
            .getPublicUrl(filePath);

        urlInput.value = publicUrlData.publicUrl;
        
        if (statusText) {
            statusText.innerHTML = `✅ Photo uploadée et hébergée !`;
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
};

window.handleDishImageUpload = async function(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!supabaseClient) {
        showToast("Service Storage non disponible", "danger");
        return;
    }

    const statusText = document.getElementById('dish-image-status');
    const urlInput = document.getElementById('dish-image-custom');
    const submitBtn = document.querySelector('#dish-editor-form button[type="submit"]');

    if (statusText) {
        statusText.style.display = 'block';
        statusText.innerHTML = `⏳ Téléchargement vers Supabase...`;
        statusText.style.color = "var(--warning)";
    }
    if (submitBtn) submitBtn.disabled = true;

    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `dishes/${currentRestaurantSession.id}/${fileName}`;

        const { data, error } = await supabaseClient.storage
            .from('restaurant-images')
            .upload(filePath, file);

        if (error) throw error;

        const { data: publicUrlData } = supabaseClient.storage
            .from('restaurant-images')
            .getPublicUrl(filePath);

        urlInput.value = publicUrlData.publicUrl;
        
        if (statusText) {
            statusText.innerHTML = `✅ Photo uploadée et hébergée !`;
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
};

function saveDish(e) {
    e.preventDefault();
    
    const r = store.getRestaurantById(currentRestaurantSession.id);
    
    const dishId = document.getElementById('dish-edit-id').value;
    const name = document.getElementById('dish-name').value.trim();
    const desc = document.getElementById('dish-desc').value.trim();
    const price = parseInt(document.getElementById('dish-price').value);
    
    const customImage = document.getElementById('dish-image-custom').value.trim();
    const image = customImage || document.getElementById('dish-image-select').value;
    
    if (dishId) {
        // Edit mode
        const dish = r.menu.find(d => d.id === dishId);
        if (dish) {
            dish.name = name;
            dish.description = desc;
            dish.price = price;
            dish.image = image;
            showToast("Plat modifié !", "success");
        }
    } else {
        // Add mode
        const newDishId = "dish_" + Date.now();
        r.menu.push({
            id: newDishId,
            name,
            description: desc,
            price,
            image
        });
        showToast("Plat ajouté au menu du jour !", "success");
    }
    
    store.updateRestaurant(r.id, { menu: r.menu });
    resetDishForm();
    switchDashboardTab('menu');
}

function toggleStoreOpenStatus(restoId) {
    const r = store.getRestaurantById(restoId);
    r.isOpenManual = !r.isOpenManual;
    store.updateRestaurant(r.id, { isOpenManual: r.isOpenManual });
    showToast(r.isOpenManual ? "Boutique OUVERTE" : "Boutique FERMÉE", "success");
    switchDashboardTab('settings');
}

function saveProfileSettings(e, restoId) {
    e.preventDefault();
    
    const r = store.getRestaurantById(restoId);
    const whatsapp = cleanPhoneNumber(document.getElementById('settings-whatsapp').value.trim());
    const hours = document.getElementById('settings-hours').value.trim();
        const newPass = document.getElementById('settings-password').value;
    const lat = parseFloat(document.getElementById('settings-lat').value);
    const lng = parseFloat(document.getElementById('settings-lng').value);
    
    // Parse closed days checklist
    const checkboxes = document.querySelectorAll('input[name="closed-day-check"]:checked');
    const closedDays = Array.from(checkboxes).map(cb => parseInt(cb.value));
    
    if (!/^\+221(70|75|76|77|78)\d{7}$/.test(whatsapp.replace(/\s+/g, ''))) {
        showToast("Numéro WhatsApp invalide", "danger");
        return;
    }
    
        const updates = {
        whatsapp,
        openHours: hours,
        closedDays,
        lat,
        lng
    };
    
    if (newPass) {
        updates.password = newPass;
    }
    
    store.updateRestaurant(r.id, updates);
    showToast("Paramètres enregistrés !", "success");
    switchDashboardTab('settings');
}

function openReplyForm(revId) {
    document.getElementById(`reply-form-container-${revId}`).style.display = 'none';
    document.getElementById(`reply-input-area-${revId}`).style.display = 'block';
}

function closeReplyForm(revId) {
    document.getElementById(`reply-form-container-${revId}`).style.display = 'block';
    document.getElementById(`reply-input-area-${revId}`).style.display = 'none';
}

function submitReply(revId) {
    const text = document.getElementById(`reply-text-${revId}`).value.trim();
    if (!text) {
        showToast("La réponse ne peut pas être vide", "danger");
        return;
    }
    
    const r = store.getRestaurantById(currentRestaurantSession.id);
    const review = r.reviews.find(rev => rev.id === revId);
    
    if (review) {
        review.reply = text;
        store.updateRestaurant(r.id, { reviews: r.reviews });
        showToast("Réponse publiée !", "success");
        switchDashboardTab('reviews');
    }
}

// ----------------------------------------------------
// Page: SUPER-ADMIN LOGIN & PANEL (toi)
// ----------------------------------------------------
router.add('#/admin-login', () => {
    // Hide cart
    document.getElementById('floating-cart-bar').style.display = 'none';
    stopOrderPolling();
    hideLoadingOverlay();
    
    const container = document.getElementById('main-content');
    
    container.innerHTML = `
        <div class="auth-container">
            <div class="auth-header">
                <span class="auth-logo">🔑</span>
                <h2>Console Super-Admin</h2>
                <p style="color: var(--text-secondary); font-size: 0.85rem;">Accès exclusif réservé au gérant du réseau THIES Resto.</p>
            </div>
            
            <form onsubmit="handleAdminLogin(event)">
                <div class="form-group">
                    <label class="form-label">Nom d'utilisateur</label>
                    <input type="text" id="admin-user" class="form-control" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Mot de passe de sécurité</label>
                    <input type="password" id="admin-pass" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary btn-block">Ouvrir la Console 🔐</button>
            </form>
        </div>
    `;
});

async function handleAdminLogin(e) {
    e.preventDefault();
    const user = document.getElementById('admin-user').value.trim().toLowerCase();
    const pass = document.getElementById('admin-pass').value.trim();
    
    const isAdmin = ['admin', 'idadmin', 'thiesresto', '784799882'].includes(user);
    if (isAdmin) {
        if (!supabaseClient) {
            showToast("Erreur de connexion serveur", "danger");
            return;
        }
        const { data: isValid, error } = await supabaseClient.rpc('verify_admin_login', {
            p_password: pass
        });
        if (!error && isValid) {
            isSuperAdminSession = true;
            try {
                sessionStorage.setItem('admin_session', 'true');
                sessionStorage.setItem('thies_admin_logged', 'true');
            } catch (err) {
                console.warn("Failed to save admin_session to sessionStorage", err);
            }
            showToast("Connexion Super-Admin établie", "success");
            router.navigate('/admin');
            return;
        }
    }
    showToast("Identifiants de sécurité invalides", "danger");
}

let adminActiveTab = 'pending';
router.add('#/admin', () => {
    // Hide cart
    document.getElementById('floating-cart-bar').style.display = 'none';
    stopOrderPolling();
    hideLoadingOverlay();
    
    if (!isSuperAdminSession) {
        showToast("Accès refusé. Veuillez vous connecter.", "danger");
        router.navigate('/admin-login');
        return;
    }
    
    renderAdminView();
});

function renderAdminView() {
    const container = document.getElementById('main-content');
    
    // Calculate network figures
    const restos = store.getRestaurants();
    const activeRestos = restos.filter(r => r.status === 'active');
    const pendingCount = restos.filter(r => r.status === 'pending').length;
    
    const orders = store.data.orders;
    const reservations = store.data.reservations;
    
    // Estimated Gross Merchandise Volume (Chiffre d'Affaires global)
    // On calcule la somme exacte des chiffres d'affaires de toutes les commandes validées (livrées ou terminées)
    const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'delivered');
    const totalGmv = completedOrders.reduce((sum, o) => sum + o.total, 0);

    container.innerHTML = `
        <div style="padding: 2rem 1.5rem; max-width: 1000px; margin: 0 auto;">
            <div style="display:flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
                <div>
                    <h1 style="font-size: 1.75rem;">Super-Admin Console</h1>
                    <p style="color: var(--text-secondary); font-size: 0.85rem;">Supervisez l'intégralité du réseau de restauration de Thiès.</p>
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.25rem;">
                    <span class="badge badge-danger">Live Monitor</span>
                    <button class="btn btn-outline" style="color: var(--danger); border-color: var(--danger); font-size: 0.8rem; padding: 0.3rem 0.6rem;" onclick="handleLogout()">🚪 Déconnexion</button>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <span class="stat-card-title">Total Restaurants</span>
                    <span class="stat-card-value">${activeRestos.length} actifs</span>
                </div>
                <div class="stat-card">
                    <span class="stat-card-title">En attente d'activation</span>
                    <span class="stat-card-value" style="color: ${pendingCount > 0 ? 'var(--accent)' : 'inherit'}">${pendingCount} demandes</span>
                </div>
                <div class="stat-card">
                    <span class="stat-card-title">Volume d'affaires généré</span>
                    <span class="stat-card-value">${totalGmv.toLocaleString()} FCFA</span>
                </div>
                <div class="stat-card">
                    <span class="stat-card-title">Commandes / Réservations</span>
                    <span class="stat-card-value">${orders.length} | ${reservations.length}</span>
                </div>
            </div>

            <!-- Section Abonnements -->
            ${(function() {
                let totalPlatformRevenue = 0;
                let rowsHtml = restos.filter(r => r.status !== 'pending').map(r => {
                    const createdAt = new Date(r.createdAt || '2026-06-25T00:00:00Z');
                    const diffTime = Math.abs(new Date() - createdAt);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    let daysLeft = 90 - diffDays;
                    let packSubscribed = r.subscriptionPack || 'Aucun (Gratuit)';
                    let revenue = 0;
                    
                    if (packSubscribed === 'Pack Simple') revenue = 5000;
                    else if (packSubscribed === 'Pack Startup') revenue = 15000;
                    else if (packSubscribed === 'Pack Entreprise') revenue = 25000;
                    
                    if (r.status === 'active' || r.status === 'suspended') {
                        totalPlatformRevenue += revenue;
                    }
                    
                    let statusHtml = '';
                    if (daysLeft > 0) {
                        statusHtml = `<span class="badge badge-success">En cours (${daysLeft} jrs restants)</span>`;
                    } else {
                        statusHtml = `<span class="badge badge-danger">Expiré</span>`;
                    }
                    
                    return `
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 1rem;"><strong>${r.name}</strong></td>
                        <td style="padding: 1rem;">${statusHtml}</td>
                        <td style="padding: 1rem;"><span class="badge" style="background: ${packSubscribed === 'Aucun (Gratuit)' ? '#e2e8f0' : 'rgba(var(--accent-rgb), 0.1)'}; color: ${packSubscribed === 'Aucun (Gratuit)' ? '#64748b' : 'var(--accent)'};">${packSubscribed}</span></td>
                        <td style="padding: 1rem; font-weight: 700; color: var(--text-secondary);">${revenue > 0 ? revenue.toLocaleString() + ' FCFA' : '0 FCFA'}</td>
                    </tr>`;
                }).join('');
                
                return `
                <section style="background: var(--bg-card); padding: 1.5rem; border-radius: 12px; box-shadow: var(--shadow); margin-bottom: 2rem; border: 1px solid var(--border);">
                    <h3 style="margin-top: 0; color: var(--text-primary); border-bottom: 2px solid var(--border); padding-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                        <span>💳 Abonnements & Revenus Plateforme</span>
                        <span style="color: var(--success); font-weight: 800; font-size: 1.2rem; background: rgba(var(--success-rgb), 0.1); padding: 0.4rem 0.8rem; border-radius: 8px;">Revenus Plateforme: ${totalPlatformRevenue.toLocaleString()} FCFA / mois</span>
                    </h3>
                    <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">Suivi des packs d'hébergement souscrits par les restaurants après leurs 3 mois gratuits.</p>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; min-width: 600px;">
                            <thead>
                                <tr style="background: var(--bg-secondary); text-align: left; border-bottom: 2px solid var(--border);">
                                    <th style="padding: 1rem;">Restaurant</th>
                                    <th style="padding: 1rem;">Statut Gratuité</th>
                                    <th style="padding: 1rem;">Pack Souscrit</th>
                                    <th style="padding: 1rem;">Revenu (Mensuel)</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rowsHtml || '<tr><td colspan="4" style="padding: 1rem; text-align: center; color: var(--text-secondary);">Aucun restaurant actif</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </section>`;
            })()}

            <!-- Tab selections -->
            <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; flex-wrap: wrap;">
                <button class="btn btn-sm ${adminActiveTab === 'pending' ? 'btn-primary' : 'btn-secondary'}" onclick="switchAdminTab('pending')">⏳ Demandes (${pendingCount})</button>
                <button class="btn btn-sm ${adminActiveTab === 'active' ? 'btn-primary' : 'btn-secondary'}" onclick="switchAdminTab('active')">🏪 Réseau Actif (${activeRestos.length})</button>
                <button class="btn btn-sm ${adminActiveTab === 'create' ? 'btn-primary' : 'btn-secondary'}" onclick="switchAdminTab('create')">➕ Ajouter</button>
                <button class="btn btn-sm ${adminActiveTab === 'accounting' ? 'btn-primary' : 'btn-secondary'}" onclick="switchAdminTab('accounting')">📊 Comptabilité</button>
            </div>


            <div id="admin-table-container">
                <!-- Tables populated dynamically -->
            </div>
        </div>
    `;

    renderAdminTabTable();
}

function switchAdminTab(tab) {
    adminActiveTab = tab;
    renderAdminView();
}

function renderAdminTabTable() {
    const tableContainer = document.getElementById('admin-table-container');
    const restos = store.getRestaurants();
    
    if (adminActiveTab === 'pending') {
        const pending = restos.filter(r => r.status === 'pending');
        
        if (pending.length === 0) {
            tableContainer.innerHTML = `<div style="text-align: center; background: var(--bg-card); padding: 3rem; border-radius: 16px; color: var(--text-secondary); border: 1px solid var(--border);">Aucune demande d'inscription en attente.</div>`;
            return;
        }

        let rowsHtml = '';
        pending.forEach(r => {
            rowsHtml += `
                <tr>
                    <td><strong>${r.name}</strong></td>
                    <td>${r.category}</td>
                    <td>${r.address}</td>
                    <td><a href="https://wa.me/${r.whatsapp.replace(/\+/g, '')}" target="_blank" class="call-btn">💬 ${r.whatsapp}</a></td>
                    <td>${r.openHours}</td>
                    <td>
                        <button class="btn btn-success btn-sm" onclick="approveRestaurant('${r.id}')">Valider (Activer) ✅</button>
                        <button class="btn btn-danger btn-sm" onclick="rejectRestaurant('${r.id}')">Refuser ❌</button>
                    </td>
                </tr>
            `;
        });

        tableContainer.innerHTML = `
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Catégorie</th>
                            <th>Adresse</th>
                            <th>WhatsApp</th>
                            <th>Horaires</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
            </div>
        `;
    } 
    else if (adminActiveTab === 'active') {
        const activeOrSuspended = restos.filter(r => r.status === 'active' || r.status === 'suspended');
        
        if (activeOrSuspended.length === 0) {
            tableContainer.innerHTML = `<div style="text-align: center; background: var(--bg-card); padding: 3rem; border-radius: 16px; color: var(--text-secondary);">Aucun restaurant configuré dans le réseau.</div>`;
            return;
        }

        let rowsHtml = '';
        activeOrSuspended.forEach(r => {
            const rOrdersList = store.getOrdersByRestaurant(r.id);
            const rReservations = store.getReservationsByRestaurant(r.id).length;
            const rCompletedOrders = rOrdersList.filter(o => o.status === 'completed' || o.status === 'delivered');
            const rRevenue = rCompletedOrders.reduce((sum, o) => sum + o.total, 0);
            
            const statusLabel = r.status === 'active' 
                ? `<span class="badge badge-success">Actif</span>` 
                : `<span class="badge badge-danger">Suspendu</span>`;
                
            const actionBtn = r.status === 'active'
                ? `<button class="btn btn-danger btn-sm" onclick="suspendRestaurant('${r.id}')">Suspendre 🔒</button>`
                : `<button class="btn btn-success btn-sm" onclick="reactivateRestaurant('${r.id}')">Réactiver 🔓</button>`;

            let packSubscribed = r.subscriptionPack || 'Aucun (Gratuit)';
            let selectPackHtml = `
                <select class="form-control" style="padding: 0.2rem; font-size: 0.8rem; height: auto;" onchange="updateRestaurantPack('${r.id}', this.value)">
                    <option value="Aucun (Gratuit)" ${packSubscribed === 'Aucun (Gratuit)' ? 'selected' : ''}>Gratuit (0 FCFA)</option>
                    <option value="Pack Simple" ${packSubscribed === 'Pack Simple' ? 'selected' : ''}>Simple (5k FCFA)</option>
                    <option value="Pack Startup" ${packSubscribed === 'Pack Startup' ? 'selected' : ''}>Startup (15k FCFA)</option>
                    <option value="Pack Entreprise" ${packSubscribed === 'Pack Entreprise' ? 'selected' : ''}>Entreprise (25k FCFA)</option>
                </select>
            `;

            rowsHtml += `
                <tr>
                    <td><strong>${r.name}</strong></td>
                    <td>${statusLabel}</td>
                    <td>${selectPackHtml}</td>
                    <td>${rOrdersList.length} Cmd(s)</td>
                    <td style="color: var(--success); font-weight: bold;">${rRevenue.toLocaleString()} FCFA</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="impersonateRestaurant('${r.id}')" title="Gérer ce restaurant">⚙️</button>
                        ${actionBtn}
                        <button class="btn btn-secondary btn-sm" onclick="router.navigate('/r/${r.slug}')" title="Visiter la page">🌐</button>
                    </td>
                </tr>
            `;
        });

        tableContainer.innerHTML = `
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Restaurant</th>
                            <th>Statut</th>
                            <th>Pack Abonnement</th>
                            <th>Commandes</th>
                            <th>C.A. Généré</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
        `;
    }
    else if (adminActiveTab === 'create') {
        tableContainer.innerHTML = `
            <div style="background: var(--bg-card); border: 1px solid var(--border); padding: 2rem; border-radius: 24px; max-width: 600px; margin: 0 auto; box-shadow: var(--shadow);">
                <h3 style="font-family: var(--font-serif); font-size: 1.35rem; margin-bottom: 1.5rem; text-align: center; color: var(--text-primary);">Créer un Nouveau Partenaire Restaurant</h3>
                
                <form id="admin-create-resto-form" onsubmit="handleAdminCreateRestaurant(event)">
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label class="form-label">Nom du restaurant <span class="required">*</span></label>
                        <input type="text" id="adm-reg-name" class="form-control" placeholder="L'Étoile de Thiès" required oninput="handleRestaurantNameInput(this.value, 'adm-reg-username', 'adm-reg-password', 'adm-slug-availability-badge')">
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label class="form-label">Adresse physique à Thiès <span class="required">*</span></label>
                        <input type="text" id="adm-reg-address" class="form-control" placeholder="Avenue de Caen, Thiès" required>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label class="form-label">Catégorie <span class="required">*</span></label>
                        <select id="adm-reg-category" class="form-control" required>
                            <option value="Traditionnel">Traditionnel (Thiéb, Yassa, Mafé)</option>
                            <option value="Grillades / Dibi">Grillades / Dibi (Dibiterie)</option>
                            <option value="Fast Food">Fast Food (Burgers, Chawarmas)</option>
                            <option value="Pâtisserie">Pâtisserie / Petit Déjeuner</option>
                            <option value="Gastronomique">Chic / Gastronomique</option>
                        </select>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label class="form-label">Numéro WhatsApp de contact <span class="required">*</span></label>
                        <input type="tel" id="adm-reg-whatsapp" class="form-control" placeholder="+221 77 XXX XX XX" required>
                    </div>
                    
                    <div class="form-row" style="margin-bottom: 1rem;">
                        <div class="form-group">
                            <label class="form-label">Heure d'ouverture <span class="required">*</span></label>
                            <input type="time" id="adm-reg-open" class="form-control" value="12:00" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Heure de fermeture <span class="required">*</span></label>
                            <input type="time" id="adm-reg-close" class="form-control" value="23:00" required>
                        </div>
                    </div>

                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label class="form-label">Identifiant de connexion (slug unique) <span class="required">*</span></label>
                        <input type="text" id="adm-reg-username" class="form-control" placeholder="letoile-thies" required oninput="checkSlugAvailabilityRealtime(this.value)">
                        <small style="color: var(--text-secondary); font-size: 0.75rem; display: block; margin-top: 0.25rem;">Généré automatiquement (modifiable).</small>
                        <div id="adm-slug-availability-badge" class="slug-status" style="margin-top: 0.35rem; font-size: 0.8rem; font-weight: 600;"></div>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 1.5rem;">
                        <label class="form-label">Mot de passe de connexion <span class="required">*</span></label>
                        <input type="password" id="adm-reg-password" class="form-control" placeholder="••••••••" required>
                        <small style="color: var(--text-secondary); font-size: 0.75rem; display: block; margin-top: 0.25rem;">Généré automatiquement par défaut (nom_221, modifiable).</small>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-block" style="font-weight: 700;">Ajouter le Restaurant au Réseau 🚀</button>
                </form>
            </div>
        `;
    }
    else if (adminActiveTab === 'accounting') {
        const allOrders = store.data.orders;
        const completedOrders = allOrders.filter(o => o.status === 'Livrée');
        const cancelledOrders = allOrders.filter(o => o.status === 'Annulée');
        const pendingOrders = allOrders.filter(o => o.status === 'Reçue' || o.status === 'Confirmée' || o.status === 'Prête');
        const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
        
        // Revenue per restaurant
        let revenueByResto = {};
        completedOrders.forEach(o => {
            const resto = restos.find(r => r.id === o.restaurantId);
            const name = resto ? resto.name : o.restaurantId;
            revenueByResto[name] = (revenueByResto[name] || 0) + o.total;
        });
        
        let revenueRowsHtml = '';
        Object.entries(revenueByResto).sort((a,b) => b[1] - a[1]).forEach(([name, rev]) => {
            const orderCount = completedOrders.filter(o => {
                const r = restos.find(r => r.name === name);
                return r && o.restaurantId === r.id;
            }).length;
            revenueRowsHtml += `
                <tr style="border-bottom: 1px solid var(--border);">
                    <td style="padding: 0.75rem;"><strong>${name}</strong></td>
                    <td style="padding: 0.75rem;">${orderCount}</td>
                    <td style="padding: 0.75rem; font-weight: 700; color: var(--success);">${rev.toLocaleString()} FCFA</td>
                </tr>
            `;
        });
        
        if (!revenueRowsHtml) {
            revenueRowsHtml = '<tr><td colspan="3" style="padding: 1.5rem; text-align: center; color: var(--text-secondary);">Aucune commande livrée pour le moment.</td></tr>';
        }

        // All orders list
        let allOrdersHtml = '';
        const sortedOrders = [...allOrders].sort((a,b) => (b.date + b.time).localeCompare(a.date + a.time));
        sortedOrders.forEach(o => {
            const resto = restos.find(r => r.id === o.restaurantId);
            const restoName = resto ? resto.name : o.restaurantId;
            const statusClass = o.status === 'Livrée' ? 'badge-success' : o.status === 'Annulée' ? 'badge-danger' : o.status === 'Reçue' ? 'badge-warning' : 'badge-info';
            allOrdersHtml += `
                <tr style="border-bottom: 1px solid var(--border);">
                    <td style="padding: 0.6rem; font-weight: 600;">${o.id}</td>
                    <td style="padding: 0.6rem;">${restoName}</td>
                    <td style="padding: 0.6rem;">${o.customerName}</td>
                    <td style="padding: 0.6rem;">${o.date} ${o.time}</td>
                    <td style="padding: 0.6rem;"><span class="badge ${statusClass}">${o.status}</span></td>
                    <td style="padding: 0.6rem; font-weight: 700; color: var(--primary);">${o.total.toLocaleString()} FCFA</td>
                </tr>
            `;
        });
        
        if (!allOrdersHtml) {
            allOrdersHtml = '<tr><td colspan="6" style="padding: 2rem; text-align: center; color: var(--text-secondary);">Aucune commande enregistrée sur la plateforme.</td></tr>';
        }

        tableContainer.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                <div class="stat-card" style="border-top: 4px solid var(--success); background: var(--bg-card); padding: 1.25rem; border-radius: 16px; box-shadow: var(--shadow);">
                    <span style="color: var(--text-secondary); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 0.5rem;">💰 Chiffre d'Affaires Global</span>
                    <span style="font-size: 1.75rem; font-weight: 800; color: var(--success);">${totalRevenue.toLocaleString()} FCFA</span>
                </div>
                <div class="stat-card" style="border-top: 4px solid var(--primary); background: var(--bg-card); padding: 1.25rem; border-radius: 16px; box-shadow: var(--shadow);">
                    <span style="color: var(--text-secondary); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 0.5rem;">📦 Total Commandes</span>
                    <span style="font-size: 1.75rem; font-weight: 800; color: var(--text-primary);">${allOrders.length}</span>
                </div>
                <div class="stat-card" style="border-top: 4px solid var(--accent); background: var(--bg-card); padding: 1.25rem; border-radius: 16px; box-shadow: var(--shadow);">
                    <span style="color: var(--text-secondary); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 0.5rem;">⏳ En Attente</span>
                    <span style="font-size: 1.75rem; font-weight: 800; color: var(--accent);">${pendingOrders.length}</span>
                </div>
                <div class="stat-card" style="border-top: 4px solid var(--danger); background: var(--bg-card); padding: 1.25rem; border-radius: 16px; box-shadow: var(--shadow);">
                    <span style="color: var(--text-secondary); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 0.5rem;">❌ Annulées</span>
                    <span style="font-size: 1.75rem; font-weight: 800; color: var(--danger);">${cancelledOrders.length}</span>
                </div>
            </div>
            
            <h3 style="font-size: 1.2rem; margin-bottom: 1rem; color: var(--text-primary);">📊 Revenus par Restaurant</h3>
            <div class="table-responsive" style="margin-bottom: 2rem;">
                <table class="admin-table" style="width: 100%;">
                    <thead><tr><th style="padding: 0.75rem;">Restaurant</th><th style="padding: 0.75rem;">Commandes Livrées</th><th style="padding: 0.75rem;">C.A. Généré</th></tr></thead>
                    <tbody>${revenueRowsHtml}</tbody>
                </table>
            </div>

            <h3 style="font-size: 1.2rem; margin-bottom: 1rem; color: var(--text-primary);">📋 Historique de toutes les Commandes</h3>
            <div class="table-responsive">
                <table class="admin-table" style="width: 100%;">
                    <thead><tr><th style="padding: 0.6rem;">N°</th><th style="padding: 0.6rem;">Restaurant</th><th style="padding: 0.6rem;">Client</th><th style="padding: 0.6rem;">Date</th><th style="padding: 0.6rem;">Statut</th><th style="padding: 0.6rem;">Montant</th></tr></thead>
                    <tbody>${allOrdersHtml}</tbody>
                </table>
            </div>
        `;
    }
}

function handleAdminCreateRestaurant(e) {
    e.preventDefault();
    
    const name = document.getElementById('adm-reg-name').value.trim();
    const address = document.getElementById('adm-reg-address').value.trim();
    const category = document.getElementById('adm-reg-category').value;
    const whatsapp = cleanPhoneNumber(document.getElementById('adm-reg-whatsapp').value.trim());
    const openH = document.getElementById('adm-reg-open').value;
    const closeH = document.getElementById('adm-reg-close').value;
    const username = document.getElementById('adm-reg-username').value.trim().toLowerCase();
    const password = document.getElementById('adm-reg-password').value;
    
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
        openHours: `${openH} - ${closeH}`,
        closedDays: [],
        isOpenManual: true,
        status: "active",
        username,
        password,
        menu: [],
        reviews: []
    };

    store.addRestaurant(newResto);
    showToast(`Restaurant "${name}" ajouté avec succès dans le réseau !`, "success");
    
    switchAdminTab('active');
}

// Admin actions
function approveRestaurant(id) {
    const r = store.getRestaurantById(id);
    if (!r) return;
    
    store.updateRestaurant(id, { status: "active" });
    showToast(`Restaurant ${r.name} activé avec succès !`, "success");
    
    // Create WhatsApp confirmation message
    const waText = `Bonjour ${r.name}, nous avons le plaisir de vous informer que votre inscription sur THIES Resto a été validée par notre équipe ! 🥳

Vous pouvez dès à présent vous connecter à votre Tableau de Bord avec vos identifiants pour gérer vos plats du jour, commandes et réservations.

Lien d'accès : ${window.location.origin}${window.location.pathname}#/auth

Bienvenue dans le réseau !`;
    const waLink = `https://wa.me/${r.whatsapp.replace(/\+/g, '')}?text=${encodeURIComponent(waText)}`;
    
    renderAdminView();
    window.open(waLink, '_blank');
}

function rejectRestaurant(id) {
    const r = store.getRestaurantById(id);
    if (!r) return;
    
    if (confirm(`Voulez-vous rejeter et supprimer définitivement la demande de "${r.name}" ?`)) {
        store.deleteRestaurant(id);
        showToast("Demande supprimée", "info");
        renderAdminView();
    }
}

function suspendRestaurant(id) {
    const r = store.getRestaurantById(id);
    if (!r) return;
    
    store.updateRestaurant(id, { status: "suspended" });
    showToast(`Restaurant ${r.name} suspendu temporairement`, "warning");
    renderAdminView();
}

function reactivateRestaurant(id) {
    const r = store.getRestaurantById(id);
    if (!r) return;
    
    store.updateRestaurant(id, { status: "active" });
    showToast(`Restaurant ${r.name} réactivé`, "success");
    renderAdminView();
}

window.updateRestaurantPack = function(id, packName) {
    const r = store.getRestaurantById(id);
    if (!r) return;
    
    // Si on attribue un pack payant, le restaurant doit être réactivé
    const newStatus = r.status === 'suspended' && packName !== 'Aucun (Gratuit)' ? 'active' : r.status;
    
    store.updateRestaurant(id, { subscriptionPack: packName, status: newStatus });
    showToast(`Pack ${packName} attribué à ${r.name}`, "success");
    renderAdminView();
};

function impersonateRestaurant(id) {
    const r = store.getRestaurantById(id);
    if (!r) return;
    
    currentRestaurantSession = r;
    sessionStorage.setItem('restaurantSession', JSON.stringify(r));
    showToast(`Session administrateur activée pour "${r.name}"`, "success");
    router.navigate('/dashboard');
}

function exitImpersonation() {
    currentRestaurantSession = null;
    sessionStorage.removeItem('restaurantSession');
    showToast("Retour à la console Super-Admin", "info");
    router.navigate('/admin');
}

function exportOrdersToCSV() {
    const r = store.getRestaurantById(currentRestaurantSession.id);
    if (!r) return;
    const orders = store.getOrdersByRestaurant(r.id);
    if (orders.length === 0) {
        showToast("Aucune commande à exporter", "warning");
        return;
    }
    
    let csvContent = "\ufeff"; // BOM for Excel UTF-8 support
    csvContent += "ID Commande;Date;Heure;Client;Telephone;Mode de Recuperation;Total (FCFA);Statut;Plats;Note\n";
    
    orders.forEach(o => {
        const dishesList = o.items.map(i => `${i.name} (x${i.qty})`).join(', ');
        const client = o.customerName.replace(/"/g, '""');
        const phone = o.customerPhone;
        const note = (o.note || '').replace(/"/g, '""').replace(/\n/g, ' ');
        const row = [
            o.id,
            o.date,
            o.time,
            `"${client}"`,
            `"${phone}"`,
            o.mode,
            o.total,
            o.status,
            `"${dishesList.replace(/"/g, '""')}"`,
            `"${note}"`
        ].join(';');
        csvContent += row + "\n";
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const encodedUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUrl);
    link.setAttribute("download", `commandes_${r.slug}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Fichier CSV des commandes téléchargé !", "success");
}

function exportReservationsToCSV() {
    const r = store.getRestaurantById(currentRestaurantSession.id);
    if (!r) return;
    const reservations = store.getReservationsByRestaurant(r.id);
    if (reservations.length === 0) {
        showToast("Aucune réservation à exporter", "warning");
        return;
    }
    
    let csvContent = "\ufeff"; // BOM for Excel UTF-8 support
    csvContent += "ID Reservation;Date;Heure;Client;Telephone;Couverts;Statut;Note\n";
    
    reservations.forEach(res => {
        const client = res.customerName.replace(/"/g, '""');
        const phone = res.customerPhone;
        const note = (res.note || '').replace(/"/g, '""').replace(/\n/g, ' ');
        const row = [
            res.id,
            res.date,
            res.time,
            `"${client}"`,
            `"${phone}"`,
            res.guests,
            res.status,
            `"${note}"`
        ].join(';');
        csvContent += row + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const encodedUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUrl);
    link.setAttribute("download", `reservations_${r.slug}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Fichier CSV des réservations téléchargé !", "success");
}

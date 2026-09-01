/**
 * OneSignal SDK Centralized Wrapper
 * Gère l'initialisation, les permissions et la synchronisation avec Supabase.
 */

class OneSignalManager {
    static isProductionDomain() {
        return typeof window !== 'undefined' && 
            (window.location.hostname === 'thies-resto.com' || window.location.hostname === 'www.thies-resto.com');
    }

    static async init() {
        if (!OneSignalManager.isProductionDomain()) {
            console.log("[OneSignal] En environnement de développement/preview, OneSignal est en mode veille.");
            return;
        }

        window.OneSignalDeferred = window.OneSignalDeferred || [];
        OneSignalDeferred.push(async function(OneSignal) {
            try {
                // Écouteur d'abonnement (quand le token est généré ou mis à jour)
                if (OneSignal.User && OneSignal.User.PushSubscription) {
                    OneSignal.User.PushSubscription.addEventListener("change", async (subscription) => {
                        const currentId = subscription.current && subscription.current.id;
                        const optIn = subscription.current && subscription.current.optedIn;
                        
                        console.log("OneSignal Subscription changed:", currentId, "Opt-in:", optIn);
                        
                        if (currentId && optIn && currentId !== "" && !currentId.startsWith("local-")) {
                            await OneSignalManager.syncWithSupabase(currentId);
                            OneSignalManager.showVerificationDialogOnce();
                        }
                    });
                    
                    // Vérification au démarrage si déjà abonné
                    const currentSub = OneSignal.User.PushSubscription;
                    if (currentSub && currentSub.optedIn && currentSub.id && !currentSub.id.startsWith("local-")) {
                        await OneSignalManager.syncWithSupabase(currentSub.id);
                    }
                }
            } catch (err) {
                console.warn("[OneSignal] Initialisation skipped or handled:", err);
            }
        });
    }

    /**
     * Demande la permission Push à l'utilisateur
     */
    static async requestPermission() {
        if (!OneSignalManager.isProductionDomain()) {
            console.log("[OneSignal] Simulation permission push en dev/preview.");
            return true;
        }

        return new Promise((resolve) => {
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            window.OneSignalDeferred.push(async function(OneSignal) {
                try {
                    if (OneSignal.Slidedown && typeof OneSignal.Slidedown.promptPush === 'function') {
                        await OneSignal.Slidedown.promptPush();
                    }
                    resolve(true);
                } catch (error) {
                    console.warn("Erreur demande push:", error);
                    resolve(false);
                }
            });
        });
    }

    /**
     * Affiche la boîte de dialogue de vérification requise par les guidelines OneSignal (une seule fois - compacte)
     */
    static showVerificationDialogOnce() {
        const hasShown = localStorage.getItem('onesignal_verification_shown');
        if (hasShown === 'true') return;

        const dialog = document.createElement('div');
        dialog.id = 'onesignal-verification-toast';
        dialog.style.cssText = "position: fixed; bottom: 85px; right: 16px; width: calc(100% - 32px); max-width: 360px; background: var(--bg-card, #121212); border: 1px solid var(--border, #333); color: var(--text-primary, #fff); border-radius: 16px; padding: 14px 16px; z-index: 10000; box-shadow: 0 10px 25px rgba(0,0,0,0.35); display: flex; flex-direction: column; gap: 10px; animation: slideInUp 0.3s ease;";
        dialog.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 1.25rem;">🔔</span>
                <div style="flex: 1;">
                    <div style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary, #fff);">Notifications Activées</div>
                    <div style="font-size: 0.75rem; color: var(--text-secondary, #aaa); line-height: 1.3;">Recevez le statut en direct de vos commandes à Thiès.</div>
                </div>
            </div>
            <div style="display: flex; gap: 8px; justify-content: flex-end;">
                <button id="onesignal-dismiss-btn" style="background: transparent; border: 1px solid var(--border, #444); color: var(--text-secondary, #aaa); border-radius: 8px; padding: 6px 12px; font-size: 0.75rem; cursor: pointer;">Fermer</button>
                <button id="onesignal-got-it-btn" style="background: var(--primary, #f26b21); color: white; border: none; padding: 6px 14px; border-radius: 8px; font-weight: 600; font-size: 0.75rem; cursor: pointer;">Autoriser</button>
            </div>
        `;
        
        document.body.appendChild(dialog);
        localStorage.setItem('onesignal_verification_shown', 'true');

        const dismissBtn = document.getElementById('onesignal-dismiss-btn');
        if (dismissBtn) {
            dismissBtn.addEventListener('click', () => {
                dialog.remove();
            });
        }

        const gotItBtn = document.getElementById('onesignal-got-it-btn');
        if (gotItBtn) {
            gotItBtn.addEventListener('click', () => {
                dialog.remove();
                OneSignalManager.requestPermission();
            });
        }
    }

    /**
     * Synchronise le Player ID avec Supabase
     */
    static async syncWithSupabase(playerId) {
        const userPhone = localStorage.getItem('user_phone') || sessionStorage.getItem('user_phone');
        
        if (!userPhone) {
            console.log("Abonnement push obtenu, mais aucun téléphone client local pour l'associer.");
            return;
        }

        try {
            if (typeof supabaseClient !== 'undefined' && supabaseClient && typeof supabaseClient.rpc === 'function') {
                console.log("Synchronisation du Player ID avec Supabase pour le numéro:", userPhone);
                const { error } = await supabaseClient.rpc('register_push_id', {
                    p_phone: userPhone,
                    p_player_id: playerId
                });

                if (error) {
                    console.warn("Erreur d'enregistrement Push DB:", error);
                } else {
                    console.log("Player ID enregistré en base de données avec succès !");
                }
            }
        } catch (e) {
            console.warn("Erreur inattendue Push DB:", e);
        }
    }
    /**
     * Envoie une notification Push d'urgence pour commande non traitée depuis plus de 10 minutes
     * @param {Object} order - Détails de la commande
     * @param {string} restaurantName - Nom du restaurant
     */
    static async sendUnprocessedOrderNotification(order, restaurantName) {
        console.log(`[OneSignal] Alerte commande non traitée (+10min): #${order.id} (${restaurantName})`);
        
        const title = "⚠️ RAPPEL COMMANDE NON TRAITÉE (+10 min)";
        const message = `La commande n°${order.id} chez ${restaurantName} (${Number(order.total || 0).toLocaleString()} FCFA) attend d'être traitée depuis plus de 10 minutes !`;

        // 1. Notification locale via le navigateur si disponible
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
            try {
                const browserNotif = new Notification(title, {
                    body: message,
                    icon: 'icon.png',
                    badge: 'icon.png',
                    tag: `unprocessed-order-${order.id}`,
                    requireInteraction: true
                });
                browserNotif.onclick = function() {
                    window.focus();
                    if (typeof router !== 'undefined' && router.navigate) {
                        router.navigate('/dashboard');
                    }
                    if (typeof switchDashboardTab === 'function') {
                        switchDashboardTab('orders');
                    }
                };
            } catch (err) {
                console.warn("[OneSignal] Notification API native erreur:", err);
            }
        }

        // 2. Tenter envoi via l'API REST OneSignal
        const appId = "1475ba26-4ce8-4e66-8631-5cbdb9a0b3fe";
        const apiKey = "1475ba26-4ce8-4e66-8631-5cbdb9a0b3fe";

        try {
            const response = await fetch('https://onesignal.com/api/v1/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': `Basic ${apiKey}`
                },
                body: JSON.stringify({
                    app_id: appId,
                    included_segments: ["All"],
                    target_channel: "push",
                    headings: { "fr": title },
                    contents: { "fr": message },
                    data: {
                        type: "unprocessed_order_10min",
                        orderId: order.id,
                        restaurantId: order.restaurantId
                    }
                })
            });
            const result = await response.json();
            console.log("[OneSignal] Réponse notification push commande en retard:", result);
            return { success: true, data: result };
        } catch (error) {
            console.warn("[OneSignal] Envoi push distant:", error);
            return { success: true, fallback: true };
        }
    }

    /**
     * Envoie ou simule l'envoi d'une notification OTP avec OneSignal
     * @param {string} phone - Numéro de téléphone du destinataire (+221...)
     * @param {string} otpCode - Code à 6 chiffres généré
     */
    static async sendOtpNotification(phone, otpCode) {
        console.log(`[OneSignal OTP] Envoi du code ${otpCode} au numéro ${phone}`);
        
        const appId = "1475ba26-4ce8-4e66-8631-5cbdb9a0b3fe";
        const apiKey = "1475ba26-4ce8-4e66-8631-5cbdb9a0b3fe";

        // 1. Tenter l'envoi via l'API REST OneSignal (Notification Push ciblée / SMS)
        try {
            const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
            
            // Requête REST OneSignal
            const response = await fetch('https://onesignal.com/api/v1/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': `Basic ${apiKey}`
                },
                body: JSON.stringify({
                    app_id: appId,
                    // Cibler l'utilisateur par son alias (numéro de téléphone) ou par Push
                    include_aliases: {
                        external_id: [cleanPhone]
                    },
                    target_channel: "push",
                    headings: { "fr": "Code de vérification THIES Resto" },
                    contents: { "fr": `Votre code de sécurité est : ${otpCode}. Valable 5 minutes.` },
                    data: {
                        type: "otp_verification",
                        phone: cleanPhone,
                        code: otpCode
                    }
                })
            });

            const result = await response.json();
            console.log("[OneSignal OTP] Réponse API REST:", result);
            return { success: true, data: result };
        } catch (error) {
            console.warn("[OneSignal OTP] Envoi via API REST OneSignal impossible (mode secours local actif):", error);
            return { success: true, fallback: true };
        }
    }

    /**
     * Envoie une notification Push au client lors d'un changement de statut de sa commande
     * (ex: En cuisine, Prêt pour livraison, En livraison, Livrée, Annulée)
     * @param {Object} order - Objet commande
     * @param {string} newStatus - Nouveau statut de la commande
     * @param {string} restaurantName - Nom de l'établissement
     */
    static async sendOrderStatusPushNotification(order, newStatus, restaurantName = '') {
        if (!order) return;
        const orderId = order.id || `CMD-${order.orderNumber || ''}`;
        const cleanPhone = (order.customerPhone || '').replace(/[\s\-\(\)\+]/g, '');
        const resto = restaurantName || order.restaurantName || 'Votre restaurant';
        const total = (Number(order.total) || 0).toLocaleString('fr-FR');

        let title = `🔔 Suivi Commande #${orderId}`;
        let body = `Votre commande chez ${resto} est passée au statut : ${newStatus}`;

        if (newStatus === 'Reçue') {
            title = `📥 Commande #${orderId} Reçue & Validée !`;
            body = `Le restaurant ${resto} a confirmé la réception de votre commande.`;
        } else if (newStatus === 'Confirmée' || newStatus === 'En préparation' || newStatus === 'En cuisine') {
            title = `👨‍🍳 Commande #${orderId} En Cuisine !`;
            body = `Excellente nouvelle ! Vos plats chez ${resto} sont en cours de préparation en cuisine.`;
        } else if (newStatus === 'Prêt pour livraison' || newStatus === 'Prête') {
            title = `📦 Commande #${orderId} Prête !`;
            body = `Vos plats chez ${resto} sont soigneusement emballés et prêts pour la livraison.`;
        } else if (newStatus === 'En cours de livraison' || newStatus === 'En livraison' || newStatus === 'Partie en livraison') {
            title = `🛵 Commande #${orderId} en Route !`;
            body = `Le livreur est en route vers votre adresse (${order.address || 'Thiès'}).`;
        } else if (newStatus === 'Livrée' || newStatus === 'Livré') {
            title = `✅ Commande #${orderId} Livrée !`;
            body = `Votre commande de ${total} FCFA chez ${resto} a été livrée. Bon appétit ! 🍽️`;
        } else if (newStatus === 'Annulée') {
            title = `❌ Commande #${orderId} Annulée`;
            body = `Votre commande chez ${resto} a été annulée. ${order.cancelReason ? `Raison : ${order.cancelReason}` : ''}`;
        }

        console.log(`[OneSignal Push] Notification statut client: #${orderId} ➔ ${newStatus} (${cleanPhone})`);

        // 1. Notification locale via le navigateur si disponible
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
            try {
                const browserNotif = new Notification(title, {
                    body: body,
                    icon: '/favicon.ico',
                    badge: '/favicon.ico',
                    tag: `order-status-${orderId}-${Date.now()}`,
                    requireInteraction: false
                });
                browserNotif.onclick = function() {
                    window.focus();
                    if (typeof router !== 'undefined' && router.navigate) {
                        router.navigate('/tracking');
                    }
                };
            } catch (err) {
                console.warn("[OneSignal] Notification API native erreur:", err);
            }
        }

        // 2. Diffuser l'événement localement pour réactivité instantanée du client
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('thies:order-status-changed', {
                detail: { orderId, newStatus, restaurantName: resto, order, title, body }
            }));
        }

        // 3. Envoi via l'API REST OneSignal pour joindre l'appareil du client
        const appId = "1475ba26-4ce8-4e66-8631-5cbdb9a0b3fe";
        const apiKey = "1475ba26-4ce8-4e66-8631-5cbdb9a0b3fe";

        try {
            const payload = {
                app_id: appId,
                target_channel: "push",
                headings: { "fr": title },
                contents: { "fr": body },
                data: {
                    type: "order_status_update",
                    orderId: orderId,
                    status: newStatus,
                    restaurantName: resto
                }
            };

            // Si un numéro de téléphone client est présent, cibler l'alias
            if (cleanPhone) {
                payload.include_aliases = {
                    external_id: [cleanPhone, `221${cleanPhone.replace(/^221/, '')}`]
                };
            } else {
                payload.included_segments = ["All"];
            }

            const response = await fetch('https://onesignal.com/api/v1/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': `Basic ${apiKey}`
                },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            console.log("[OneSignal] Push client envoyé avec succès:", result);
            return { success: true, data: result };
        } catch (error) {
            console.warn("[OneSignal] Envoi push distant:", error);
            return { success: true, fallback: true };
        }
    }
}

// Lancement automatique sécurisé
OneSignalManager.init();


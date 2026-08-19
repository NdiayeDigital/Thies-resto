/**
 * OneSignal SDK Centralized Wrapper
 * Gère l'initialisation, les permissions et la synchronisation avec Supabase.
 */

class OneSignalManager {
    static async init() {
        window.OneSignalDeferred = window.OneSignalDeferred || [];
        OneSignalDeferred.push(async function(OneSignal) {
            
            // Écouteur d'abonnement (quand le token est généré ou mis à jour)
            OneSignal.User.PushSubscription.addEventListener("change", async (subscription) => {
                const currentId = subscription.current.id;
                const optIn = subscription.current.optedIn;
                
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
                // Si on a déjà l'ID au boot, on ne montre pas la modale, c'est que c'est déjà validé
            } else {
                // S'il n'est pas abonné, on peut éventuellement afficher le bouton d'opt-in custom ou utiliser le Slidedown natif.
                // Ici on attendra que le user s'abonne via la cloche ou un bouton custom pour déclencher l'évenement.
            }
        });
    }

    /**
     * Demande la permission Push à l'utilisateur
     */
    static async requestPermission() {
        return new Promise((resolve) => {
            window.OneSignalDeferred.push(async function(OneSignal) {
                try {
                    await OneSignal.Slidedown.promptPush();
                    resolve(true);
                } catch (error) {
                    console.error("Erreur demande push:", error);
                    resolve(false);
                }
            });
        });
    }

    /**
     * Affiche la boîte de dialogue de vérification requise par les guidelines OneSignal (une seule fois)
     */
    static showVerificationDialogOnce() {
        const hasShown = localStorage.getItem('onesignal_verification_shown');
        if (hasShown === 'true') return;

        const dialog = document.createElement('div');
        dialog.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.8); backdrop-filter: blur(5px); z-index: 10000; display: flex; align-items: center; justify-content: center;";
        dialog.innerHTML = `
            <div style="background: var(--bg-primary, #ffffff); border-radius: 24px; padding: 2rem; width: 90%; max-width: 400px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.2);">
                <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
                <h2 style="color: var(--text-primary, #000); margin-bottom: 1rem; font-size: 1.5rem;">Your OneSignal SDK integration is complete!</h2>
                <p style="color: var(--text-secondary, #666); margin-bottom: 2rem; font-size: 1rem; line-height: 1.5;">You can now send Push Notifications & In-App Messages through OneSignal. Tap below to enable push notifications.</p>
                <button id="onesignal-got-it-btn" style="background: var(--primary, #f26b21); color: white; border: none; padding: 1rem 2rem; border-radius: 30px; font-weight: bold; font-size: 1.1rem; width: 100%; cursor: pointer;">Got it</button>
            </div>
        `;
        
        document.body.appendChild(dialog);
        localStorage.setItem('onesignal_verification_shown', 'true');

        document.getElementById('onesignal-got-it-btn').addEventListener('click', () => {
            document.body.removeChild(dialog);
            OneSignalManager.requestPermission();
        });
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
            console.log("Synchronisation du Player ID avec Supabase pour le numéro:", userPhone);
            const { error } = await supabaseClient.rpc('register_push_id', {
                p_phone: userPhone,
                p_player_id: playerId
            });

            if (error) {
                console.error("Erreur d'enregistrement Push DB:", error);
            } else {
                console.log("Player ID enregistré en base de données avec succès !");
            }
        } catch (e) {
            console.error("Erreur inattendue Push DB:", e);
        }
    }
}

// Lancement automatique
OneSignalManager.init();

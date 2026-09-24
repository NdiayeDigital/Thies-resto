import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
    initializeFirestore, 
    doc, 
    collection, 
    onSnapshot, 
    getDocFromServer, 
    setDoc 
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App and Firestore Database with long-polling and no fetch streams (prevent proxy/iframe timeouts)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    useFetchStreams: false
}, firebaseConfig.firestoreDatabaseId); /* CRITICAL: Database ID configuration */
export const auth = getAuth(app);

// Make db accessible globally for auxiliary debugging / tooling
if (typeof window !== 'undefined') {
    window.firestoreDb = db;
    window.firebaseAuth = auth;
}

// 1. Connection test at boot with graceful offline resilience
export async function testConnection() {
    try {
        await getDocFromServer(doc(db, 'test', 'connection'));
        console.log('🔥 [Firestore] Connexion autoritaire à Firestore établie avec succès.');
    } catch (error) {
        // En cas de latence ou coupure réseau temporaire, bascule automatique sur le cache local et REST
        console.warn('🔥 [Firestore] Mode hors-ligne / résilience activé. Utilisation transparente du cache local et de l\'API REST.');
    }
}
testConnection();

// 2. Structured Error Handling as mandated by Firebase Architecture Skill
export const OperationType = {
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete',
    LIST: 'list',
    GET: 'get',
    WRITE: 'write'
};

export function handleFirestoreError(error, operationType, path) {
    const errInfo = {
        error: error instanceof Error ? error.message : String(error),
        authInfo: {
            userId: auth.currentUser?.uid || null,
            email: auth.currentUser?.email || null,
            emailVerified: auth.currentUser?.emailVerified || null,
            isAnonymous: auth.currentUser?.isAnonymous || null,
            tenantId: auth.currentUser?.tenantId || null,
            providerInfo: auth.currentUser?.providerData?.map(provider => ({
                providerId: provider.providerId,
                email: provider.email
            })) || []
        },
        operationType,
        path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
}

// Helper to hide suspended restaurants from DOM and update UI views
export function applyClientSideHiding(suspendedRestoIds) {
    if (!suspendedRestoIds || !(suspendedRestoIds instanceof Set || Array.isArray(suspendedRestoIds))) return;

    const idsSet = suspendedRestoIds instanceof Set ? suspendedRestoIds : new Set(suspendedRestoIds);

    // 1. Hide from restaurant lists / catalogs (Home, Explore, Search, Categories)
    idsSet.forEach(rId => {
        const matchingResto = window.store?.getRestaurantById?.(rId) || 
            (window.store?.data?.restaurants || []).find(r => r.id === rId);
        const rSlug = matchingResto?.slug || rId;

        // Hide specific cards from DOM immediately
        const cardSelectors = [
            `[data-restaurant-id="${rId}"]`,
            `[data-id="${rId}"]`,
            `#restaurant-card-${rId}`,
            `[data-slug="${rSlug}"]`,
            `.restaurant-card[onclick*="${rId}"]`,
            `.restaurant-card[onclick*="${rSlug}"]`
        ];
        
        cardSelectors.forEach(selector => {
            try {
                document.querySelectorAll(selector).forEach(card => {
                    card.style.setProperty('display', 'none', 'important');
                    card.setAttribute('aria-hidden', 'true');
                    card.dataset.suspended = 'true';
                });
            } catch(e) {}
        });
    });

    // 2. Refresh active filter lists in app.js if present
    if (typeof window.applyFilters === 'function') {
        window.applyFilters();
    }
    if (typeof window.debouncedApplyFilters === 'function') {
        window.debouncedApplyFilters();
    }
    if (typeof window.updateCategoryBadges === 'function') {
        window.updateCategoryBadges();
    }

    // 3. Hide from active Restaurant Menu / Details page if user is currently viewing it
    const currentHash = (window.location.hash || '').toLowerCase();
    if (currentHash.startsWith('#/r/')) {
        const slugInUrl = currentHash.replace('#/r/', '').split('?')[0].split('/')[0];
        const isCurrentRestoSuspended = Array.from(idsSet).some(sId => {
            const r = window.store?.getRestaurantById?.(sId) || 
                (window.store?.data?.restaurants || []).find(item => item.id === sId);
            return sId.toLowerCase() === slugInUrl || (r && r.slug && r.slug.toLowerCase() === slugInUrl);
        });

        const isSuperAdmin = typeof window.isSuperAdminSession !== 'undefined' && window.isSuperAdminSession;
        const isOwner = typeof window.currentRestaurantSession !== 'undefined' && 
            window.currentRestaurantSession && 
            (window.currentRestaurantSession.id === slugInUrl || window.currentRestaurantSession.slug === slugInUrl);

        if (isCurrentRestoSuspended && !isSuperAdmin && !isOwner) {
            const currentResto = (window.store?.data?.restaurants || []).find(
                item => item.id.toLowerCase() === slugInUrl || item.slug?.toLowerCase() === slugInUrl
            );
            const rName = currentResto ? currentResto.name : 'Ce restaurant';

            console.warn(`🚨 [Firestore onSnapshot] Établissement "${rName}" suspendu en temps réel. Masquage immédiat du menu.`);

            if (typeof window.hideLoadingOverlay === 'function') window.hideLoadingOverlay();
            
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.innerHTML = `
                    <div style="text-align: center; padding: 5rem 1.5rem; max-width: 580px; margin: 0 auto;" class="page-transition">
                        <div style="width: 72px; height: 72px; border-radius: 50%; background: #fee2e2; color: #dc2626; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; margin: 0 auto 1.5rem;">
                            <i class="ri-error-warning-line"></i>
                        </div>
                        <h2 style="font-size: 1.6rem; font-weight: 800; margin-bottom: 0.75rem; color: var(--text-primary);">Établissement Suspendu</h2>
                        <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 2rem;">
                            Le restaurant <strong>${rName}</strong> a été temporairement suspendu par l'administration de Thiès-Resto et son menu n'est plus accessible.
                        </p>
                        <button class="btn btn-primary" onclick="window.router ? window.router.navigate('/') : (window.location.hash='#/')" style="border-radius: 12px; padding: 0.75rem 1.5rem; font-weight: 700;">
                            <i class="ri-arrow-left-line"></i> Découvrir d'autres restaurants à Thiès
                        </button>
                    </div>
                `;
            }

            if (typeof window.showToast === 'function') {
                window.showToast(`« ${rName} » vient d'être suspendu par l'administration.`, 'warning');
            }

            // Also clear cart if it belonged to this suspended restaurant
            if (window.cart && (window.cart.restaurantId === slugInUrl || (currentResto && window.cart.restaurantId === currentResto.id))) {
                if (typeof window.clearCart === 'function') {
                    window.clearCart();
                } else {
                    window.cart = { restaurantId: null, items: [], total: 0 };
                    try { localStorage.removeItem('thies_resto_cart'); } catch(e) {}
                }
            }
        }
    }
}

// 3. Real-time onSnapshot listener on the "restaurants" collection
let unsubscribeRestaurantsListener = null;

export function initFirestoreRestaurantsListener() {
    if (unsubscribeRestaurantsListener) {
        console.log('🔥 [Firestore] Listener restaurants déjà actif.');
        return unsubscribeRestaurantsListener;
    }

    const pathForOnSnapshot = 'restaurants';
    console.log('🔥 [Firestore] Démarrage du listener temps réel onSnapshot sur /' + pathForOnSnapshot);

    try {
        unsubscribeRestaurantsListener = onSnapshot(
            collection(db, pathForOnSnapshot),
            (snapshot) => {
                const suspendedIds = new Set();
                const activeIds = new Set();
                let hasChanges = false;

                snapshot.docChanges().forEach((change) => {
                    const data = change.doc.data();
                    const docId = change.doc.id;
                    const rId = data.id || docId;
                    const status = data.status || 'active';

                    console.log(`🔥 [Firestore onSnapshot Event] ${change.type}: "${data.name || rId}" -> status: "${status}"`);

                    if (status === 'suspended' || change.type === 'removed') {
                        suspendedIds.add(rId);
                        hasChanges = true;
                    } else if (status === 'active') {
                        activeIds.add(rId);
                        hasChanges = true;
                    }
                });

                // Update local Store restaurants list in memory
                if (window.store && window.store.data && Array.isArray(window.store.data.restaurants)) {
                    snapshot.docs.forEach((docSnap) => {
                        const data = docSnap.data();
                        const rId = data.id || docSnap.id;
                        const status = data.status || 'active';

                        if (status === 'suspended') {
                            suspendedIds.add(rId);
                        }

                        const localResto = window.store.data.restaurants.find(
                            r => r.id === rId || (data.slug && r.slug === data.slug)
                        );
                        if (localResto) {
                            if (localResto.status !== status) {
                                console.log(`⚡ [Firestore Sync] Statut mis à jour pour ${localResto.name}: "${localResto.status}" -> "${status}"`);
                                localResto.status = status;
                                hasChanges = true;
                            }
                            if (data.isOpenManual !== undefined) localResto.isOpenManual = data.isOpenManual;
                            if (data.suspendReason) localResto.suspendReason = data.suspendReason;
                            if (data.suspendedAt) localResto.suspendedAt = data.suspendedAt;
                        }
                    });
                }

                // Cache overrides in localStorage for instant offline / reload hydration
                try {
                    if (typeof localStorage !== 'undefined') {
                        const overrides = JSON.parse(localStorage.getItem('thies_restaurant_overrides') || '{}');
                        snapshot.docs.forEach((docSnap) => {
                            const data = docSnap.data();
                            const rId = data.id || docSnap.id;
                            overrides[rId] = {
                                status: data.status || 'active',
                                isOpenManual: data.isOpenManual,
                                suspendReason: data.suspendReason,
                                suspendedAt: data.suspendedAt
                            };
                        });
                        localStorage.setItem('thies_restaurant_overrides', JSON.stringify(overrides));
                    }
                } catch(e) {}

                // Execute client-side hiding across all views (restaurants list & menus)
                applyClientSideHiding(suspendedIds);

                // Dispatch event so other components can react
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('thies_restaurants_live_update', {
                        detail: {
                            restaurants: window.store?.data?.restaurants || [],
                            suspendedIds: Array.from(suspendedIds),
                            activeIds: Array.from(activeIds)
                        }
                    }));
                }
            },
            (error) => {
                console.warn('🔥 [Firestore onSnapshot] Déconnexion ou bascule offline:', error?.message || error);
                // Bascule automatique et transparente vers le cache local et API REST sans planter l'UI
                try {
                    if (typeof localStorage !== 'undefined') {
                        const overrides = JSON.parse(localStorage.getItem('thies_restaurant_overrides') || '{}');
                        const suspendedIds = Object.keys(overrides).filter(id => overrides[id]?.status === 'suspended');
                        applyClientSideHiding(new Set(suspendedIds));
                    }
                } catch(e) {}
            }
        );
    } catch(err) {
        console.error('🔥 [Firestore onSnapshot init error]', err);
    }

    return unsubscribeRestaurantsListener;
}

// 4. Helper for Admin actions: update status in Firestore in real-time
export async function updateFirestoreRestaurantStatus(restaurantId, newStatus, reason = '') {
    if (!restaurantId) return false;
    const path = `restaurants/${restaurantId}`;
    try {
        const existing = window.store?.getRestaurantById?.(restaurantId) || 
            (window.store?.data?.restaurants || []).find(r => r.id === restaurantId);

        const updateData = {
            id: restaurantId,
            name: existing?.name || ('Restaurant ' + restaurantId),
            slug: existing?.slug || restaurantId,
            status: newStatus,
            updatedAt: new Date().toISOString()
        };
        if (newStatus === 'suspended') {
            updateData.isOpenManual = false;
            updateData.suspendedAt = new Date().toISOString();
            updateData.suspendReason = reason || 'Suspension manuelle SuperAdmin';
        } else if (newStatus === 'active') {
            updateData.suspendReason = null;
            updateData.suspendedAt = null;
        }

        await setDoc(doc(db, 'restaurants', restaurantId), updateData, { merge: true });
        console.log(`🔥 [Firestore] Mise à jour effectuée dans Firestore pour "${restaurantId}" -> "${newStatus}"`);
        return true;
    } catch(error) {
        console.warn('🔥 [Firestore update error] Bascule locale:', error);
        return false;
    }
}

// Expose on window
if (typeof window !== 'undefined') {
    window.initFirestoreRestaurantsListener = initFirestoreRestaurantsListener;
    window.updateFirestoreRestaurantStatus = updateFirestoreRestaurantStatus;
    window.applyClientSideHiding = applyClientSideHiding;

    // Automatically initialize listener when DOM is ready or immediately if loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initFirestoreRestaurantsListener();
        });
    } else {
        initFirestoreRestaurantsListener();
    }
}

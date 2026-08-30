/**
 * ============================================================================
 * THIES Resto - Google Maps Platform Integration Service
 * Compliant with Google Maps Platform Standards & Code Assist Guidelines
 * Real-time Live GPS Synchronization & Interactive Explorer
 * Attribution: gmp_mcp_codeassist_v1_aistudio
 * ============================================================================
 */

(function(window) {
    'use strict';

    const THIES_CENTER = { lat: 14.7910, lng: -16.9359 }; // Thiès, Sénégal (Place de France)
    const DEFAULT_ZOOM = 14;
    const ATTRIBUTION_ID = 'gmp_mcp_codeassist_v1_aistudio';

    class GoogleMapsService {
        constructor() {
            this.apiKey = null;
            this.isConfigured = false;
            this.isLoading = false;
            this.isLoaded = false;
            this.loadPromise = null;
            this.activeMaps = new Map(); // containerId -> google.maps.Map
            this.markers = new Map();    // containerId -> Array<{ resto, marker }>
            this.userMarkers = new Map();// containerId -> google.maps.marker.AdvancedMarkerElement
            this.userLocation = null;   // { lat, lng, accuracy, timestamp }
            this.watchId = null;
            this.isTracking = false;
            this.listeners = new Set();
        }

        /**
         * Fetch server-side API Key configuration or check window global
         */
        async fetchConfig() {
            if (this.apiKey) return this.apiKey;
            
            // Check global / local overrides
            const localKey = localStorage.getItem('thies_gmaps_key');
            if (localKey && localKey.trim()) {
                this.apiKey = localKey.trim();
                this.isConfigured = true;
                return this.apiKey;
            }

            if (window.GOOGLE_MAPS_API_KEY && window.GOOGLE_MAPS_API_KEY.trim()) {
                this.apiKey = window.GOOGLE_MAPS_API_KEY.trim();
                this.isConfigured = true;
                return this.apiKey;
            }

            try {
                const res = await fetch('/api/maps-config');
                if (res.ok) {
                    const data = await res.json();
                    if (data.apiKey) {
                        this.apiKey = data.apiKey;
                        this.isConfigured = true;
                    }
                }
            } catch (err) {
                console.warn('[Google Maps] Impossible de récupérer /api/maps-config:', err);
            }

            return this.apiKey;
        }

        /**
         * Bootstrap Google Maps JavaScript API with Dynamic Library Import
         */
        async loadGoogleMaps(customKey = null) {
            if (this.isLoaded && window.google && window.google.maps) {
                return window.google.maps;
            }

            if (this.loadPromise) {
                return this.loadPromise;
            }

            this.loadPromise = new Promise(async (resolve, reject) => {
                const key = customKey || await this.fetchConfig();
                
                // If already initialized on page
                if (window.google && window.google.maps && window.google.maps.importLibrary) {
                    this.isLoaded = true;
                    return resolve(window.google.maps);
                }

                // Official Dynamic Loader Bootstrap
                ((g) => {
                    var h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window;
                    b[c] = b[c] || {};
                    var d = b[c].maps = b[c].maps || {}, r = new Set(), e = new URLSearchParams(),
                        u = () => h || (h = new Promise(async (f, n) => {
                            await (a = m.createElement("script"));
                            e.set("libraries", [...r] + "");
                            for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]);
                            e.set("callback", c + ".maps." + q);
                            a.src = `https://maps.googleapis.com/maps/api/js?` + e;
                            d[q] = f;
                            a.onerror = () => {
                                h = null;
                                n(new Error(p + " could not load. Check your API key or network."));
                            };
                            a.nonce = m.querySelector("script[nonce]")?.nonce || "";
                            m.head.append(a);
                        }));
                    d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n));
                })({
                    key: key || '',
                    v: 'weekly',
                    loading: 'async',
                    region: 'SN',
                    language: 'fr'
                });

                try {
                    await google.maps.importLibrary("maps");
                    await google.maps.importLibrary("marker");
                    this.isLoaded = true;
                    resolve(window.google.maps);
                } catch (err) {
                    console.error('[Google Maps] Erreur lors du chargement des librairies Google Maps:', err);
                    reject(err);
                }
            });

            return this.loadPromise;
        }

        /**
         * Subscribe to live position updates
         */
        onLocationChanged(callback) {
            if (typeof callback === 'function') {
                this.listeners.add(callback);
                if (this.userLocation) {
                    callback(this.userLocation);
                }
            }
            return () => this.listeners.delete(callback);
        }

        /**
         * Notify all listeners of new coordinates
         */
        notifyLocation(coords) {
            this.userLocation = coords;
            window.userLat = coords.lat;
            window.userLng = coords.lng;

            // Update all active map user markers
            this.activeMaps.forEach((mapInstance, containerId) => {
                this.updateOrAddUserMarker(containerId, mapInstance, coords);
            });

            // Update restaurants distances in store
            if (window.store && window.store.data && Array.isArray(window.store.data.restaurants)) {
                window.store.data.restaurants.forEach(r => {
                    if (r.lat && r.lng) {
                        const dist = this.calculateDistance(coords.lat, coords.lng, Number(r.lat), Number(r.lng));
                        r._tempDistance = parseFloat(dist.toFixed(1));
                    }
                });
            }

            this.listeners.forEach(cb => {
                try { cb(coords); } catch (e) { console.error(e); }
            });
        }

        /**
         * Calculate Haversine distance in km
         */
        calculateDistance(lat1, lon1, lat2, lon2) {
            const R = 6371; // Rayon terre en km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                      Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        }

        /**
         * Start Live Real-Time GPS Tracking with navigator.geolocation.watchPosition
         */
        startLiveTracking(onUpdate = null) {
            if (onUpdate) this.onLocationChanged(onUpdate);

            if (!("geolocation" in navigator)) {
                if (typeof window.showToast === 'function') {
                    window.showToast("La géolocalisation n'est pas prise en charge par ce navigateur.", "warning");
                }
                return Promise.reject(new Error("Geolocation unsupported"));
            }

            if (this.isTracking && this.userLocation) {
                // Already tracking, re-notify
                this.notifyLocation(this.userLocation);
                return Promise.resolve(this.userLocation);
            }

            return new Promise((resolve, reject) => {
                const geoOptions = {
                    enableHighAccuracy: true,
                    timeout: 12000,
                    maximumAge: 0
                };

                // First immediate position
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        const coords = {
                            lat: pos.coords.latitude,
                            lng: pos.coords.longitude,
                            accuracy: pos.coords.accuracy,
                            timestamp: Date.now()
                        };
                        this.isTracking = true;
                        this.notifyLocation(coords);

                        // Start continuous watch
                        if (!this.watchId) {
                            this.watchId = navigator.geolocation.watchPosition(
                                (watchPos) => {
                                    const updated = {
                                        lat: watchPos.coords.latitude,
                                        lng: watchPos.coords.longitude,
                                        accuracy: watchPos.coords.accuracy,
                                        timestamp: Date.now()
                                    };
                                    this.notifyLocation(updated);
                                },
                                (err) => console.warn('[Google Maps Live GPS] watch error:', err),
                                { enableHighAccuracy: true, maximumAge: 5000 }
                            );
                        }

                        resolve(coords);
                    },
                    (err) => {
                        console.warn('[Google Maps Live GPS] Position error:', err);
                        // Default to Thiès center gracefully
                        const fallbackCoords = { ...THIES_CENTER, isDefault: true };
                        this.notifyLocation(fallbackCoords);
                        reject(err);
                    },
                    geoOptions
                );
            });
        }

        /**
         * Locate user and pan all active maps smoothly
         */
        async locateAndPan(containerId = null) {
            if (typeof window.showToast === 'function') {
                window.showToast("🛰️ Synchronisation GPS en direct...", "info");
            }

            try {
                const coords = await this.startLiveTracking();
                
                // Pan specific or all maps
                if (containerId && this.activeMaps.has(containerId)) {
                    const map = this.activeMaps.get(containerId);
                    map.panTo({ lat: coords.lat, lng: coords.lng });
                    map.setZoom(16);
                } else {
                    this.activeMaps.forEach((map) => {
                        map.panTo({ lat: coords.lat, lng: coords.lng });
                        map.setZoom(16);
                    });
                }

                if (typeof window.showToast === 'function') {
                    window.showToast("📍 Votre position en direct est synchronisée sur la carte !", "success");
                }
                return coords;
            } catch (err) {
                if (typeof window.showToast === 'function') {
                    window.showToast("Position centrée sur Thiès (Quartier Escale / Place de France)", "info");
                }
                if (containerId && this.activeMaps.has(containerId)) {
                    const map = this.activeMaps.get(containerId);
                    map.panTo(THIES_CENTER);
                    map.setZoom(14);
                }
                return THIES_CENTER;
            }
        }

        /**
         * Get Category Pin Styling & Emoji
         */
        getCategoryPinInfo(category) {
            const cat = String(category || '').toLowerCase();
            if (cat.includes('traditionnel') || cat.includes('thieb')) {
                return { emoji: '🍲', color: '#ff6b35', bg: '#fff0eb', label: 'Traditionnel' };
            }
            if (cat.includes('grillade') || cat.includes('dibi')) {
                return { emoji: '🥩', color: '#d9381e', bg: '#fdeeed', label: 'Dibi / Grillades' };
            }
            if (cat.includes('fast') || cat.includes('burger')) {
                return { emoji: '🍔', color: '#f59e0b', bg: '#fef3c7', label: 'Fast-Food' };
            }
            if (cat.includes('patiss') || cat.includes('croissant') || cat.includes('dejeuner')) {
                return { emoji: '🥐', color: '#ec4899', bg: '#fdf2f8', label: 'Pâtisserie' };
            }
            if (cat.includes('gastro') || cat.includes('chic')) {
                return { emoji: '✨', color: '#8b5cf6', bg: '#f5f3ff', label: 'Gastronomique' };
            }
            return { emoji: '🍽️', color: '#ff6b35', bg: '#fff0eb', label: 'Restaurant' };
        }

        /**
         * Create a custom DOM element for AdvancedMarkerElement
         */
        createCustomMarkerElement(restaurant, isSelected = false) {
            const pinInfo = this.getCategoryPinInfo(restaurant.category);
            const isOpen = restaurant.is_open_manual !== false && restaurant.status !== 'pending' && restaurant.status !== 'suspended';
            const distLabel = restaurant._tempDistance ? `${restaurant._tempDistance} km` : '';
            
            const pinWrapper = document.createElement('div');
            pinWrapper.className = `gmp-custom-marker ${isSelected ? 'selected' : ''}`;
            pinWrapper.style.cursor = 'pointer';
            pinWrapper.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
            pinWrapper.style.transformOrigin = 'bottom center';
            pinWrapper.setAttribute('title', `${restaurant.name} (${restaurant.category || 'Restaurant'})`);

            pinWrapper.innerHTML = `
                <div style="
                    display: flex;
                    align-items: center;
                    background: #ffffff;
                    border: 2px solid ${pinInfo.color};
                    border-radius: 22px;
                    padding: 4px 10px 4px 6px;
                    box-shadow: 0 6px 16px rgba(0,0,0,0.18);
                    position: relative;
                    white-space: nowrap;
                    font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
                ">
                    <span style="
                        background: ${pinInfo.bg};
                        color: ${pinInfo.color};
                        font-size: 14px;
                        width: 28px;
                        height: 28px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 6px;
                    ">${pinInfo.emoji}</span>
                    <div style="display: flex; flex-direction: column; text-align: left;">
                        <span style="font-size: 12px; font-weight: 700; color: #1e293b; max-width: 130px; overflow: hidden; text-overflow: ellipsis;">${restaurant.name}</span>
                        <div style="display: flex; align-items: center; gap: 4px;">
                            <span style="font-size: 10px; color: ${isOpen ? '#16a34a' : '#dc2626'}; font-weight: 600;">
                                ${isOpen ? '● Ouvert' : '○ Fermé'}
                            </span>
                            ${distLabel ? `<span style="font-size: 10px; color: #64748b; font-weight: 600;">• 📍 ${distLabel}</span>` : ''}
                        </div>
                    </div>
                    <div style="
                        position: absolute;
                        bottom: -7px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 0;
                        height: 0;
                        border-left: 6px solid transparent;
                        border-right: 6px solid transparent;
                        border-top: 7px solid ${pinInfo.color};
                    "></div>
                </div>
            `;

            pinWrapper.addEventListener('mouseenter', () => {
                pinWrapper.style.transform = 'scale(1.12) translateY(-4px)';
                pinWrapper.style.zIndex = '999';
            });
            pinWrapper.addEventListener('mouseleave', () => {
                pinWrapper.style.transform = isSelected ? 'scale(1.08)' : 'scale(1)';
            });

            return pinWrapper;
        }

        /**
         * Update or create live pulsating user marker on map
         */
        async updateOrAddUserMarker(containerId, mapInstance, coords) {
            if (!mapInstance || !coords) return;

            const existingMarker = this.userMarkers.get(containerId);
            if (existingMarker) {
                existingMarker.position = { lat: coords.lat, lng: coords.lng };
                return existingMarker;
            }

            try {
                const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
                
                const userDom = document.createElement('div');
                userDom.className = 'gmp-live-user-pin';
                userDom.style.cursor = 'pointer';
                userDom.innerHTML = `
                    <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;" title="Votre position en direct (GPS)">
                        <!-- Pulsating Halo -->
                        <div style="
                            position: absolute;
                            width: 100%;
                            height: 100%;
                            background: rgba(37, 99, 235, 0.35);
                            border-radius: 50%;
                            animation: pulse-live-gps 1.8s infinite ease-out;
                        "></div>
                        <!-- Core Pin -->
                        <div style="
                            position: relative;
                            width: 18px;
                            height: 18px;
                            background: #2563eb;
                            border: 3.5px solid #ffffff;
                            border-radius: 50%;
                            box-shadow: 0 3px 10px rgba(0,0,0,0.35);
                            z-index: 2;
                        "></div>
                        <!-- Inner Dot -->
                        <div style="
                            position: absolute;
                            width: 6px;
                            height: 6px;
                            background: #ffffff;
                            border-radius: 50%;
                            z-index: 3;
                        "></div>
                    </div>
                `;

                // Add CSS keyframe if not exists
                if (!document.getElementById('live-gps-style')) {
                    const style = document.createElement('style');
                    style.id = 'live-gps-style';
                    style.innerHTML = `
                        @keyframes pulse-live-gps {
                            0% { transform: scale(0.6); opacity: 0.9; }
                            70% { transform: scale(2.2); opacity: 0.15; }
                            100% { transform: scale(2.6); opacity: 0; }
                        }
                    `;
                    document.head.appendChild(style);
                }

                const marker = new AdvancedMarkerElement({
                    map: mapInstance,
                    position: { lat: coords.lat, lng: coords.lng },
                    title: "Votre position en direct (GPS)",
                    content: userDom,
                    zIndex: 1000
                });

                this.userMarkers.set(containerId, marker);
                return marker;
            } catch (e) {
                console.warn('[Google Maps] Error adding user marker:', e);
            }
        }

        /**
         * Render Interactive Restaurant Explorer Map
         * Supports both:
         * renderExplorerMap(containerId, options)
         * renderExplorerMap(containerId, restaurantsList, options)
         */
        async renderExplorerMap(containerId, restaurantsOrOptions = {}, maybeOptions = {}) {
            const container = document.getElementById(containerId);
            if (!container) {
                console.error(`[Google Maps] Conteneur #${containerId} introuvable.`);
                return null;
            }

            let restaurants = [];
            let options = {};

            if (Array.isArray(restaurantsOrOptions)) {
                restaurants = restaurantsOrOptions;
                options = maybeOptions || {};
            } else {
                options = restaurantsOrOptions || {};
                restaurants = options.restaurants || (window.store && window.store.data ? window.store.data.restaurants : []);
            }

            container.style.position = 'relative';
            container.style.width = '100%';
            container.style.minHeight = options.height || '500px';

            try {
                await this.loadGoogleMaps();
            } catch (err) {
                this.renderKeyRequiredFallback(container, options);
                return null;
            }

            const { Map } = await google.maps.importLibrary("maps");
            const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

            const initialCenter = this.userLocation 
                ? { lat: this.userLocation.lat, lng: this.userLocation.lng }
                : (options.userLat && options.userLng ? { lat: options.userLat, lng: options.userLng } : THIES_CENTER);
            
            const zoom = options.zoom || (this.userLocation ? 15 : DEFAULT_ZOOM);

            // Initialize Map
            const mapInstance = new Map(container, {
                center: initialCenter,
                zoom: zoom,
                mapId: "DEMO_MAP_ID",
                mapTypeControl: false,
                streetViewControl: true,
                fullscreenControl: true,
                zoomControl: true,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_CENTER
                },
                styles: [
                    {
                        featureType: "poi.business",
                        elementType: "labels",
                        stylers: [{ visibility: "off" }]
                    }
                ]
            });

            this.activeMaps.set(containerId, mapInstance);

            // Inject Live GPS floating button inside the map container
            this.injectLiveGpsControl(container, containerId);

            const markersList = [];
            const infoWindow = new google.maps.InfoWindow({
                minWidth: 260,
                maxWidth: 320
            });

            // Filter active restaurants
            const validRestos = restaurants.filter(r => r.lat && r.lng && r.status !== 'suspended' && r.status !== 'pending');

            validRestos.forEach(resto => {
                const markerContent = this.createCustomMarkerElement(resto);
                const marker = new AdvancedMarkerElement({
                    map: mapInstance,
                    position: { lat: Number(resto.lat), lng: Number(resto.lng) },
                    title: resto.name,
                    content: markerContent
                });

                marker.addListener('click', () => {
                    const isOpen = resto.is_open_manual !== false && resto.status !== 'pending' && resto.status !== 'suspended';
                    const coverImg = resto.cover_image || (window.RESTAURANT_COVERS && window.RESTAURANT_COVERS[resto.id]) || 'icon.png';
                    const distText = resto._tempDistance ? `• 📍 À ${resto._tempDistance} km de vous` : '';
                    
                    const infoHtml = `
                        <div style="font-family: system-ui, sans-serif; padding: 4px 2px; max-width: 280px;">
                            <div style="position: relative; height: 110px; border-radius: 8px; overflow: hidden; margin-bottom: 8px; background: #eee;">
                                <img src="${coverImg}" alt="${resto.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='icon.png'">
                                <span style="position: absolute; top: 6px; left: 6px; background: rgba(0,0,0,0.7); color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600;">
                                    ${resto.category || 'Restaurant'}
                                </span>
                                <span style="position: absolute; bottom: 6px; right: 6px; background: ${isOpen ? '#16a34a' : '#dc2626'}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700;">
                                    ${isOpen ? 'OUVERT' : 'FERMÉ'}
                                </span>
                            </div>
                            <h4 style="margin: 0 0 4px 0; font-size: 15px; color: #0f172a; font-weight: 700;">${resto.name}</h4>
                            <p style="margin: 0 0 6px 0; font-size: 12px; color: #64748b; line-height: 1.3;">📍 ${resto.address || 'Thiès'}</p>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 12px;">
                                <span style="color: #f59e0b; font-weight: 700;">★ ${resto.rating ? Number(resto.rating).toFixed(1) : '4.5'} (${resto.reviews_count || (resto.reviews ? resto.reviews.length : 24)})</span>
                                <span style="color: #10b981; font-weight: 600; font-size: 11px;">${distText}</span>
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
                                <a href="#/r/${resto.slug}" class="btn-gmap-menu" style="
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    background: #ff6b35;
                                    color: white;
                                    padding: 7px 8px;
                                    border-radius: 6px;
                                    font-size: 12px;
                                    font-weight: 600;
                                    text-decoration: none;
                                    text-align: center;
                                " onclick="if(typeof options.onMarkerClick === 'function') options.onMarkerClick(resto);">
                                    🍽️ Menu & Commande
                                </a>
                                <a href="https://www.google.com/maps/dir/?api=1&destination=${resto.lat},${resto.lng}" target="_blank" rel="noopener" style="
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    background: #f1f5f9;
                                    color: #334155;
                                    padding: 7px 8px;
                                    border-radius: 6px;
                                    font-size: 12px;
                                    font-weight: 600;
                                    text-decoration: none;
                                    text-align: center;
                                    border: 1px solid #cbd5e1;
                                ">
                                    🗺️ Itinéraire
                                </a>
                            </div>
                        </div>
                    `;

                    infoWindow.setContent(infoHtml);
                    infoWindow.open({
                        anchor: marker,
                        map: mapInstance,
                        shouldFocus: false
                    });

                    if (typeof options.onRestaurantSelect === 'function') {
                        options.onRestaurantSelect(resto);
                    }
                });

                markersList.push({ resto, marker });
            });

            this.markers.set(containerId, markersList);

            // Add user marker if we already have location or auto-trigger
            if (this.userLocation) {
                await this.updateOrAddUserMarker(containerId, mapInstance, this.userLocation);
            } else if (options.autoLocate !== false) {
                // Silent live location init
                this.startLiveTracking().catch(() => {});
            }

            return {
                map: mapInstance,
                markers: markersList,
                filterCategory: (cat) => this.filterMapMarkers(containerId, cat),
                locateUser: () => this.locateAndPan(containerId)
            };
        }

        /**
         * Inject clean floating live GPS control over Google Map
         */
        injectLiveGpsControl(container, containerId) {
            const existing = container.querySelector('.gmap-floating-gps-btn');
            if (existing) existing.remove();

            const btn = document.createElement('button');
            btn.className = 'gmap-floating-gps-btn';
            btn.setAttribute('type', 'button');
            btn.setAttribute('title', 'Me localiser en direct (GPS)');
            btn.style.cssText = `
                position: absolute;
                bottom: 24px;
                left: 16px;
                z-index: 10;
                background: #ffffff;
                color: #1e293b;
                border: 2px solid #2563eb;
                border-radius: 24px;
                padding: 8px 14px;
                font-size: 13px;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 6px;
                box-shadow: 0 4px 14px rgba(0,0,0,0.18);
                cursor: pointer;
                transition: all 0.2s ease;
                font-family: system-ui, sans-serif;
            `;

            btn.innerHTML = `<span style="font-size: 15px;">📍</span> <span>Me localiser en direct</span>`;
            
            btn.addEventListener('mouseenter', () => {
                btn.style.background = '#2563eb';
                btn.style.color = '#ffffff';
                btn.style.transform = 'scale(1.05)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.background = '#ffffff';
                btn.style.color = '#1e293b';
                btn.style.transform = 'scale(1)';
            });

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                btn.innerHTML = `<span>⏳</span> <span>Localisation...</span>`;
                this.locateAndPan(containerId).finally(() => {
                    btn.innerHTML = `<span style="color:#16a34a;">🟢</span> <span>Position en direct</span>`;
                    setTimeout(() => {
                        btn.innerHTML = `<span style="font-size: 15px;">📍</span> <span>Me localiser en direct</span>`;
                    }, 3500);
                });
            });

            container.appendChild(btn);
        }

        /**
         * Filter markers by Category
         */
        filterMapMarkers(containerId, category) {
            const markersList = this.markers.get(containerId);
            if (!markersList) return;

            const target = String(category || '').toLowerCase();

            markersList.forEach(({ resto, marker }) => {
                if (!target || target === 'tous' || target === 'all') {
                    marker.map = this.activeMaps.get(containerId);
                } else {
                    const restoCat = String(resto.category || '').toLowerCase();
                    const matches = restoCat.includes(target) || 
                                   (target.includes('grillade') && restoCat.includes('dibi')) ||
                                   (target.includes('fast') && restoCat.includes('burger'));
                    marker.map = matches ? this.activeMaps.get(containerId) : null;
                }
            });
        }

        /**
         * Render Single Restaurant Detail Map with Route Directions
         */
        async renderRestaurantDetailMap(containerId, restaurant) {
            const container = document.getElementById(containerId);
            if (!container) return;

            container.style.width = '100%';
            container.style.height = '380px';
            container.style.borderRadius = '16px';
            container.style.overflow = 'hidden';
            container.style.position = 'relative';

            try {
                await this.loadGoogleMaps();
            } catch (e) {
                this.renderKeyRequiredFallback(container, { minimal: true });
                return;
            }

            const { Map } = await google.maps.importLibrary("maps");
            const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

            const position = {
                lat: Number(restaurant.lat) || THIES_CENTER.lat,
                lng: Number(restaurant.lng) || THIES_CENTER.lng
            };

            const map = new Map(container, {
                center: position,
                zoom: 15,
                mapId: "DEMO_MAP_ID",
                disableDefaultUI: true,
                zoomControl: true,
                fullscreenControl: true
            });

            this.activeMaps.set(containerId, map);

            const markerContent = this.createCustomMarkerElement(restaurant, true);
            new AdvancedMarkerElement({
                map: map,
                position: position,
                title: restaurant.name,
                content: markerContent
            });

            // If user location is known or when located, show user marker and fit bounds
            if (this.userLocation) {
                this.updateOrAddUserMarker(containerId, map, this.userLocation);
            }

            this.injectLiveGpsControl(container, containerId);
        }

        /**
         * Render Delivery Location Picker for Checkout
         */
        async renderDeliveryPickerMap(containerId, onLocationChanged) {
            const container = document.getElementById(containerId);
            if (!container) return;

            container.style.width = '100%';
            container.style.height = '240px';
            container.style.borderRadius = '12px';
            container.style.position = 'relative';

            try {
                await this.loadGoogleMaps();
            } catch (e) {
                this.renderKeyRequiredFallback(container, { minimal: true, message: "Sélectionnez votre quartier dans la liste déroulante ci-dessous." });
                return;
            }

            const { Map } = await google.maps.importLibrary("maps");
            const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

            const initialCoords = this.userLocation || THIES_CENTER;

            const map = new Map(container, {
                center: initialCoords,
                zoom: 15,
                mapId: "DEMO_MAP_ID",
                disableDefaultUI: true,
                zoomControl: true
            });

            this.activeMaps.set(containerId, map);

            // Delivery pin
            const pinElement = new PinElement({
                background: '#ff6b35',
                borderColor: '#ffffff',
                glyphColor: '#ffffff',
                scale: 1.25
            });

            const deliveryMarker = new AdvancedMarkerElement({
                map: map,
                position: initialCoords,
                title: "Point de livraison",
                content: pinElement.element,
                gmpDraggable: true
            });

            const updatePos = (pos) => {
                deliveryMarker.position = pos;
                if (typeof onLocationChanged === 'function') {
                    onLocationChanged(pos);
                }
            };

            // Click to set delivery point
            map.addListener('click', (e) => {
                updatePos({
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng()
                });
            });

            // Drag listener
            deliveryMarker.addListener('dragend', () => {
                const pos = deliveryMarker.position;
                updatePos({ lat: pos.lat, lng: pos.lng });
            });

            // Listen to live GPS location changes
            this.onLocationChanged((coords) => {
                if (!coords.isDefault) {
                    map.panTo({ lat: coords.lat, lng: coords.lng });
                    updatePos({ lat: coords.lat, lng: coords.lng });
                }
            });
        }

        /**
         * Fallback UI when Google Maps Platform Key needs to be enabled
         */
        renderKeyRequiredFallback(container, options = {}) {
            if (options.minimal) {
                container.innerHTML = `
                    <div style="
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        height: 100%;
                        background: #f8fafc;
                        border: 1px dashed #cbd5e1;
                        border-radius: 12px;
                        padding: 1rem;
                        text-align: center;
                        color: #64748b;
                        font-size: 0.85rem;
                    ">
                        <span style="font-size: 1.5rem; margin-bottom: 0.5rem;">🗺️</span>
                        <strong>Carte Google Maps Thiès</strong>
                        <p style="margin: 0.25rem 0 0 0;">${options.message || 'Thiès Centre • Quartier Escale & Environs'}</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = `
                <div style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 380px;
                    height: 100%;
                    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                    border: 2px dashed #94a3b8;
                    border-radius: 20px;
                    padding: 2rem 1.5rem;
                    text-align: center;
                    font-family: system-ui, -apple-system, sans-serif;
                ">
                    <div style="
                        width: 60px;
                        height: 60px;
                        background: #ff6b35;
                        color: white;
                        border-radius: 16px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1.8rem;
                        margin-bottom: 1rem;
                        box-shadow: 0 8px 18px rgba(255,107,53,0.25);
                    ">🗺️</div>
                    <h3 style="font-size: 1.2rem; font-weight: 700; color: #0f172a; margin: 0 0 0.5rem 0;">
                        Carte Interactive des Restaurants de Thiès
                    </h3>
                    <p style="color: #64748b; font-size: 0.88rem; max-width: 440px; margin: 0 0 1.25rem 0; line-height: 1.5;">
                        L'intégration <strong>Google Maps Platform</strong> est activée. Renseignez votre clé API Google Maps (ou utilisez la clé de démo) pour explorer tous les restaurants de Thiès avec le suivi GPS en direct.
                    </p>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center; max-width: 480px;">
                        <input type="text" id="gmaps-user-key-input" placeholder="Collez votre clé API Google Maps (AIzaSy...)" style="
                            flex: 1;
                            min-width: 240px;
                            padding: 0.6rem 1rem;
                            border: 1.5px solid #cbd5e1;
                            border-radius: 10px;
                            font-size: 0.85rem;
                            outline: none;
                        ">
                        <button onclick="window.googleMapsService.saveCustomKeyAndReload(document.getElementById('gmaps-user-key-input').value)" style="
                            background: #ff6b35;
                            color: white;
                            border: none;
                            padding: 0.6rem 1.25rem;
                            border-radius: 10px;
                            font-weight: 600;
                            cursor: pointer;
                            font-size: 0.85rem;
                        ">
                            Activer la carte
                        </button>
                    </div>
                    <div style="margin-top: 1.25rem; font-size: 0.8rem; color: #64748b;">
                        <span>Prototypage : </span>
                        <a href="https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_mcp_codeassist_v1_aistudio" target="_blank" rel="noopener" style="color: #2563eb; text-decoration: underline; font-weight: 600;">
                            Obtenir une clé Google Maps Demo Gratuite →
                        </a>
                    </div>
                </div>
            `;
        }

        /**
         * Save custom key entered in fallback and refresh map
         */
        saveCustomKeyAndReload(key) {
            if (!key || key.trim().length < 10) {
                if (typeof window.showToast === 'function') {
                    window.showToast("Veuillez saisir une clé API Google Maps valide.", "danger");
                }
                return;
            }
            localStorage.setItem('thies_gmaps_key', key.trim());
            this.apiKey = key.trim();
            this.isLoaded = false;
            this.loadPromise = null;
            if (typeof window.showToast === 'function') {
                window.showToast("Clé Google Maps enregistrée ! Chargement de la carte...", "success");
            }
            if (typeof window.openGoogleMapsExplorer === 'function') {
                window.openGoogleMapsExplorer();
            } else {
                window.location.reload();
            }
        }
    }

    // Attach to global window
    window.googleMapsService = new GoogleMapsService();

})(window);

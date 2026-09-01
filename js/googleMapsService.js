// THIES Resto - No-Map Lightweight Stub
// Maps have been deactivated from the platform.
(function() {
    'use strict';
    class GoogleMapsServiceStub {
        constructor() {
            this.isConfigured = false;
            this.isLoaded = false;
            this.activeMaps = new Map();
        }
        async fetchConfig() { return null; }
        async loadGoogleMaps() { return null; }
        onLocationChanged() {}
        async startLiveTracking() {
            return new Promise((resolve) => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, isDefault: false }),
                        () => resolve({ lat: 14.7928, lng: -16.9260, isDefault: true }),
                        { timeout: 8000 }
                    );
                } else {
                    resolve({ lat: 14.7928, lng: -16.9260, isDefault: true });
                }
            });
        }
        async locateAndPan() {
            return this.startLiveTracking();
        }
        renderExplorerMap() {}
        renderRestaurantDetailMap() {}
        renderDeliveryPickerMap() {}
    }

    if (typeof window !== 'undefined') {
        window.googleMapsService = new GoogleMapsServiceStub();
        window.openGoogleMapsExplorer = function() {};
    }
})();

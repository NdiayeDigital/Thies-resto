
// Client Behavior Analytics Tracker
class ClientTracker {
    constructor() {
        this.sessionStart = Date.now();
        this.navigationPath = [];
        this.events = [];
        this.initTracking();
    }

    initTracking() {
        // Track initial page
        this.trackPageView(window.location.hash || '/');

        // Intercept router.navigate if it exists
        if (typeof router !== 'undefined' && router.navigate) {
            const originalNavigate = router.navigate;
            router.navigate = (path) => {
                this.trackPageView(path);
                return originalNavigate.call(router, path);
            };
        }
        
        // Track clicks on restaurants
        document.addEventListener('click', (e) => {
            const restoCard = e.target.closest('.restaurant-card');
            if (restoCard) {
                const name = restoCard.querySelector('h3') ? restoCard.querySelector('h3').innerText : 'Restaurant';
                this.logEvent('CLICK_RESTAURANT', name);
            }
        });
    }

    trackPageView(path) {
        const timeSpent = this.navigationPath.length > 0 
            ? Math.round((Date.now() - this.navigationPath[this.navigationPath.length-1].timestamp) / 1000) 
            : 0;
            
        this.navigationPath.push({
            path: path,
            timestamp: Date.now(),
            timeSpentPrevious: timeSpent
        });
    }

    logEvent(eventName, details) {
        this.events.push({
            event: eventName,
            details: details,
            timeSinceStart: Math.round((Date.now() - this.sessionStart) / 1000)
        });
    }

    getBehaviorReport() {
        const totalTimeSeconds = Math.round((Date.now() - this.sessionStart) / 1000);
        const pathStr = this.navigationPath.map(p => p.path).join(' -> ');
        return `Temps total: ${totalTimeSeconds}s. Parcours: ${pathStr}`;
    }
}

// Initialize tracker
window.clientTracker = new ClientTracker();

class Router {
    constructor() {
        this.routes = {};
        this.isReady = false;

        // Prevent browser from restoring previous scroll position automatically
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }

        const forceScrollTop = () => {
            window.scrollTo(0, 0);
            if (document.documentElement) document.documentElement.scrollTop = 0;
            if (document.body) document.body.scrollTop = 0;
            const main = document.getElementById('main-content');
            if (main) main.scrollTop = 0;
        };

        // Event listener resetting scroll position whenever a route is loaded
        window.addEventListener('hashchange', () => {
            window.scrollTo(0, 0);
            forceScrollTop();
            this.resolve();
            setTimeout(forceScrollTop, 50);
            setTimeout(forceScrollTop, 150);
        });

        window.addEventListener('load', () => {
            forceScrollTop();
            setTimeout(forceScrollTop, 50);
        });

        window.addEventListener('DOMContentLoaded', () => {
            forceScrollTop();
        });
    }

    start() {
        this.isReady = true;
        this.forceScrollTop();
        this.resolve();
        setTimeout(() => this.forceScrollTop(), 50);
        setTimeout(() => this.forceScrollTop(), 150);
    }

    forceScrollTop() {
        window.scrollTo(0, 0);
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
        const main = document.getElementById('main-content');
        if (main) main.scrollTop = 0;
    }

    add(path, handler) {
        this.routes[path] = handler;
    }

    navigate(path) {
        window.location.hash = path;
        this.forceScrollTop();
        setTimeout(() => this.forceScrollTop(), 50);
    }

    resolve() {
        if (!this.isReady) return;
        const hash = window.location.hash || '#/';
        
        this.forceScrollTop();

        // ----------------------------------------------------
        // RESTAURANT SESSION ROUTE GUARD
        // When a restaurant is connected, they only see the restaurant portal
        // They do NOT see client-facing pages (accueil, explorer, favoris, suivi, compte client)
        // ----------------------------------------------------
        if (typeof currentRestaurantSession !== 'undefined' && currentRestaurantSession && (typeof isSuperAdminSession === 'undefined' || !isSuperAdminSession)) {
            const clientRoutes = ['#/', '#', '#/explore', '#/favorites', '#/tracking', '#/profile', '#/how-it-works'];
            if (clientRoutes.includes(hash) || hash.startsWith('#/r/') || hash.startsWith('#/restaurant/')) {
                this.navigate('/dashboard');
                return;
            }
        }

        const container = document.getElementById('main-content');
        if (container) {
            container.classList.remove('page-transition');
            void container.offsetWidth; // Force reflow
            container.classList.add('page-transition');
            container.scrollTop = 0;
        }
        
        // Parse params for restaurant view: #/r/la-licorne
        let matched = false;
        
        // Match group route first: #/r/:slug/group/:groupId
        const groupMatch = hash.match(/^#\/r\/([^/]+)\/group\/([^/]+)$/);
        if (groupMatch) {
            const slug = groupMatch[1];
            const groupId = groupMatch[2];
            if (this.routes['#/r/:slug']) {
                this.routes['#/r/:slug'](slug, 'group', groupId);
                matched = true;
            }
        }
        
        if (!matched) {
            const restoMatch = hash.match(/^#\/r\/([^/]+)$/);
            if (restoMatch) {
                const slug = restoMatch[1];
                if (this.routes['#/r/:slug']) {
                    this.routes['#/r/:slug'](slug, 'menu');
                    matched = true;
                }
            }
        }

        if (!matched) {
            const handler = this.routes[hash] || this.routes['#/404'];
            if (handler) {
                handler();
            } else {
                this.navigate('/');
            }
        }
        
        // Refresh Navbar & Bottom Nav State
        if (typeof updateNavbar === 'function') updateNavbar();
        if (typeof updateBottomNavFromRoute === 'function') updateBottomNavFromRoute(hash);
        if (typeof updateFaqVisibility === 'function') updateFaqVisibility(hash);

        // Ensure top position after DOM render
        requestAnimationFrame(() => this.forceScrollTop());
        setTimeout(() => this.forceScrollTop(), 50);
    }
}

const router = new Router();


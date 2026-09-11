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

        // Pathname support: if user accessed domain.com/admin directly in address bar
        if (typeof window !== 'undefined' && window.location && window.location.pathname) {
            const cleanPath = window.location.pathname.replace(/\/+$/, '').toLowerCase();
            if (cleanPath === '/admin' || cleanPath === '/admin-login' || cleanPath === '/js/admin' || cleanPath === '/js/admin.js' || cleanPath === '/superadmin') {
                const hasValidAdminAuth = Boolean(
                    typeof isSuperAdminSession !== 'undefined' && isSuperAdminSession &&
                    sessionStorage.getItem('thies_admin_token') &&
                    sessionStorage.getItem('admin_session') === 'true'
                );
                if (hasValidAdminAuth && cleanPath === '/admin') {
                    if (window.location.hash !== '#/admin') {
                        window.location.replace(window.location.origin + '/#/admin');
                        return;
                    }
                } else {
                    if (window.location.hash !== '#/admin-login') {
                        window.location.replace(window.location.origin + '/#/admin-login');
                        return;
                    }
                }
            }
        }

        let hash = window.location.hash || '#/';
        // Normalize hash shortcuts
        if (hash === '#admin' || hash === '#/admin/' || hash === '#superadmin' || hash === '#admin-console') {
            hash = '#/admin';
            window.location.hash = '#/admin';
        }
        if (hash === '#admin-login' || hash === '#/admin-login/') {
            hash = '#/admin-login';
            window.location.hash = '#/admin-login';
        }
        
        this.forceScrollTop();

        // ----------------------------------------------------
        // STRICT SESSION ROUTE GUARDS (Super-Admin & Restaurant Isolation)
        // ----------------------------------------------------
        
        // 1. GUEST / UNAUTHENTICATED ATTEMPT TO ACCESS #/admin:
        // Must be authenticated with valid token & session in sessionStorage, otherwise redirect immediately to #/admin-login
        const isAccessingAdminConsole = hash === '#/admin' || (hash.startsWith('#/admin') && hash !== '#/admin-login');
        if (isAccessingAdminConsole) {
            const hasValidAdminAuth = Boolean(
                typeof isSuperAdminSession !== 'undefined' && isSuperAdminSession &&
                sessionStorage.getItem('thies_admin_token') &&
                sessionStorage.getItem('admin_session') === 'true'
            );
            if (!hasValidAdminAuth) {
                // Clear any lingering / corrupt state
                if (typeof isSuperAdminSession !== 'undefined') isSuperAdminSession = false;
                if (typeof window !== 'undefined') window.isSuperAdminSession = false;
                try {
                    sessionStorage.removeItem('thies_admin_token');
                    sessionStorage.removeItem('admin_session');
                    sessionStorage.removeItem('thies_admin_logged');
                    localStorage.removeItem('thies_admin_token');
                    localStorage.removeItem('admin_session');
                } catch(e) {}
                this.navigate('/admin-login');
                return;
            }
        }

        // Common complete suite of restaurant manager views
        const allRestoAllowedRoutes = [
            '#/dashboard',
            '#/dashboard-orders',
            '#/dashboard-reservations',
            '#/dashboard-dishes',
            '#/dashboard-menu',
            '#/dashboard-add-menu',
            '#/dashboard-daily-menu',
            '#/dashboard-reports',
            '#/dashboard-accounting',
            '#/dashboard-account',
            '#/dashboard-subscription',
            '#/dashboard-reviews',
            '#/politique-admin'
        ];

        // 2. SUPER ADMIN LOCK-IN: Super-Admin can access Admin console or full impersonation dashboard
        if (typeof isSuperAdminSession !== 'undefined' && isSuperAdminSession) {
            const allowedAdminRoutes = [
                '#/admin',
                '#/admin-login',
                '#/politique-admin'
            ];
            const allowedImpersonationRoutes = [
                ...allRestoAllowedRoutes,
                '#/admin'
            ];

            if (typeof currentRestaurantSession !== 'undefined' && currentRestaurantSession) {
                if (!allowedImpersonationRoutes.includes(hash)) {
                    this.navigate('/dashboard');
                    return;
                }
            } else {
                if (!allowedAdminRoutes.includes(hash)) {
                    this.navigate('/admin');
                    return;
                }
            }
        }

        // 3. RESTAURANT PARTNER LOCK-IN: Restaurant manager can access all manager tabs until logged out
        else if (typeof currentRestaurantSession !== 'undefined' && currentRestaurantSession) {
            const allowedRestoRoutes = [
                ...allRestoAllowedRoutes,
                '#/auth'
            ];

            if (!allowedRestoRoutes.includes(hash)) {
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
            const cleanRouteKey = hash.split('?')[0];
            const handler = this.routes[hash] || this.routes[cleanRouteKey] || this.routes['#/404'];
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
        if (typeof updateFloatingCartBar === 'function') updateFloatingCartBar();

        // Ensure top position after DOM render
        if (typeof requestAnimationFrame !== 'undefined') {
            requestAnimationFrame(() => this.forceScrollTop());
        }
        setTimeout(() => this.forceScrollTop(), 50);
    }
}

const router = new Router();


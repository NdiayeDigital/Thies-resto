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
        const isAccessingAdminConsole = hash === '#/admin' || (hash.startsWith('#/admin') && hash !== '#/admin-login');
        if (isAccessingAdminConsole) {
            const hasValidAdminAuth = Boolean(
                typeof isSuperAdminSession !== 'undefined' && isSuperAdminSession &&
                sessionStorage.getItem('thies_admin_token') &&
                sessionStorage.getItem('admin_session') === 'true'
            );
            if (!hasValidAdminAuth) {
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

        // 2. UNAUTHENTICATED ATTEMPT TO ACCESS RESTAURANT DASHBOARD:
        const isAccessingDashboard = hash.startsWith('#/dashboard');
        if (isAccessingDashboard) {
            const hasRestoAuth = Boolean(
                (typeof currentRestaurantSession !== 'undefined' && currentRestaurantSession) ||
                (typeof isSuperAdminSession !== 'undefined' && isSuperAdminSession)
            );
            if (!hasRestoAuth) {
                this.navigate('/auth');
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
        
        // Parse params for restaurant view: #/r/:slug or #/restaurant/:slug or group
        let matched = false;
        
        // Match group route first: #/r/:slug/group/:groupId or #/restaurant/:slug/group/:groupId
        const groupMatch = hash.match(/^#\/(?:r|restaurant|resto)\/([^/]+)\/group\/([^/]+)$/);
        if (groupMatch) {
            const slug = groupMatch[1];
            const groupId = groupMatch[2];
            if (this.routes['#/r/:slug']) {
                try {
                    this.routes['#/r/:slug'](slug, 'group', groupId);
                } catch (err) {
                    console.error("Router error on restaurant group route:", err);
                }
                matched = true;
            }
        }
        
        if (!matched) {
            const restoMatch = hash.match(/^#\/(?:r|restaurant|resto)\/([^/]+)$/);
            if (restoMatch) {
                const slug = restoMatch[1];
                if (this.routes['#/r/:slug']) {
                    try {
                        this.routes['#/r/:slug'](slug, 'menu');
                    } catch (err) {
                        console.error("Router error on restaurant route:", err);
                    }
                    matched = true;
                }
            }
        }

        if (!matched) {
            const cleanRouteKey = hash.split('?')[0];
            const handler = this.routes[hash] || this.routes[cleanRouteKey] || this.routes['#/404'];
            if (handler) {
                try {
                    handler();
                } catch (err) {
                    console.error("Router execution error on route " + hash + ":", err);
                    const mainEl = document.getElementById('main-content');
                    if (mainEl) {
                        mainEl.innerHTML = `
                            <div style="text-align: center; padding: 4rem 1.5rem; max-width: 600px; margin: 0 auto;">
                                <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(var(--primary-rgb), 0.1); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 1.5rem;">
                                    <i class="ri-refresh-line"></i>
                                </div>
                                <h2 style="font-family: var(--font-serif); font-size: 1.5rem; margin-bottom: 0.75rem; color: var(--text-primary);">Contenu temporairement indisponible</h2>
                                <p style="color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 0.95rem;">Nous actualisons actuellement nos services gastronomiques. Veuillez recharger ou revenir à la sélection.</p>
                                <button class="btn btn-primary" onclick="router.navigate('/')" style="font-weight: 700; border-radius: 12px; padding: 0.65rem 1.5rem;">
                                    Retour aux restaurants
                                </button>
                            </div>
                        `;
                    }
                }
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


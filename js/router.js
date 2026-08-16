class Router {
    constructor() {
        this.routes = {};
        this.isReady = false;
        window.addEventListener('hashchange', () => this.resolve());
        // window.addEventListener('load', () => this.resolve());
        // window.addEventListener('DOMContentLoaded', () => this.resolve());
    }

    start() {
        this.isReady = true;
        this.resolve();
    }

    add(path, handler) {
        this.routes[path] = handler;
    }

    navigate(path) {
        window.location.hash = path;
    }

    resolve() {
        if (!this.isReady) return;
        const hash = window.location.hash || '#/';
        
        const container = document.getElementById('main-content');
        if (container) {
            container.classList.remove('page-transition');
            void container.offsetWidth; // Force reflow
            container.classList.add('page-transition');
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
            const handler = this.routes[hash];
            if (handler) {
                handler();
            } else if (this.routes['#/404']) {
                this.routes['#/404']();
            } else {
                console.warn('Route non trouvée:', hash);
                const container = document.getElementById('main-content');
                if (container) {
                    container.innerHTML = `
                        <div style="text-align: center; padding: 5rem 1.5rem;">
                            <h2 style="font-size: 2rem; color: var(--text-primary); margin-bottom: 1rem;">Page introuvable</h2>
                            <p style="color: var(--text-secondary); margin-bottom: 2rem;">La page <strong>${hash}</strong> n'existe pas ou n'est pas encore disponible.</p>
                            <button class="btn btn-primary" onclick="window.router.navigate('/')">Retour à l'accueil</button>
                        </div>
                    `;
                }
            }
        }
        
        // Refresh Navbar State
        updateNavbar();
    }
}

const router = new Router();

// Export to window for Vite
window.Router = Router;
window.router = router;


// Export to window for Vite
window.router = router;
window.Router = Router;


// Export to window for Vite
window.router = router;
window.Router = Router;


// Export to window for Vite
window.router = router;
window.Router = Router;

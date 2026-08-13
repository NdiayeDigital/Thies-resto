import './style.css';

import Alpine from 'alpinejs';
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "https://demo@sentry.io/1234567", // Placeholder DSN to be replaced by the client
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

import './js/logger.js';
import './js/data.js';
import './js/store.js';
import './js/router.js';
import './js/admin.js';
import './js/ui-checkout.js';
import './js/ui-vendor.js';
import './app.js';

window.Alpine = Alpine;

// We will initialize Alpine after the store is loaded
document.addEventListener('alpine:init', () => {
    // Cart initialization logic for Alpine
    const savedCart = localStorage.getItem('THIES_CART');
    let initialCart = { restaurantId: null, items: [], total: 0, subtotal: 0, deliveryFee: 0 };
    if (savedCart) {
        try { initialCart = { ...initialCart, ...JSON.parse(savedCart) }; } catch(e) {}
    }

    Alpine.store('global', window.store.data);
    Alpine.store('cart', {
        ...initialCart,
        add(restaurantId, dish, qty = 1) {
            if (this.restaurantId && this.restaurantId !== restaurantId && this.items.length > 0) {
                const oldResto = window.store.getRestaurantById(this.restaurantId);
                const oldName = oldResto ? oldResto.name : "un autre restaurant";
                if (!confirm(`Votre panier contient déjà des plats de "${oldName}". Voulez-vous vider votre panier actuel pour commander ici ?`)) {
                    return false;
                }
                this.items = [];
            }
            this.restaurantId = restaurantId;
            const existing = this.items.find(i => i.id === dish.id);
            if (existing) {
                existing.qty += qty;
            } else {
                this.items.push({ id: dish.id, name: dish.name, price: dish.price, qty: qty });
            }
            this.recalculate();
            return true;
        },
        updateQty(dishId, change) {
            const idx = this.items.findIndex(item => item.id === dishId);
            if (idx !== -1) {
                this.items[idx].qty += change;
                if (this.items[idx].qty <= 0) {
                    this.items.splice(idx, 1);
                }
                this.recalculate();
            }
        },
        recalculate() {
            this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
            this.total = this.subtotal + (this.deliveryFee || 0);
            if (this.loyaltyApplied) {
                this.total = Math.max(0, this.total - 2500);
            }
            localStorage.setItem('THIES_CART', JSON.stringify(this));
        },
        get itemCount() {
            return this.items.reduce((sum, item) => sum + item.qty, 0);
        },
        clear() {
            this.restaurantId = null;
            this.items = [];
            this.recalculate();
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    Alpine.start();
});

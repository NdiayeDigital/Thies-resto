import './style.css';

import Alpine from 'alpinejs';

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
    Alpine.store('global', window.store.data);
    Alpine.store('cart', window.cart || { items: [], total: 0 });
});

document.addEventListener('DOMContentLoaded', () => {
    Alpine.start();
});

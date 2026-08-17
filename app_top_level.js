// Client Behavior Analytics Tracker
class ClientTracker { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

// Initialize tracker later when router is defined

// ----------------------------------------------------
function logoutRestaurant() { /* block */ }{ /* block */ }{ /* block */ }

router.add('#/auth', () => { /* block */ });

function handleForgotPassword() { /* block */ }{ /* block */ }{ /* block */ }

// ----------------------------------------------------
// Page: DEMANDE DE PARTENARIAT
// ----------------------------------------------------
router.add('#/partnership', () => { /* block */ });

window.handleRegImageUpload = async function(event) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }



async function handleRestaurantLogin(e) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

function handleRestaurantRegister(e) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

// ----------------------------------------------------

function toggleMobileMenu() { /* block */ }{ /* block */ }

    // ----------------------------------------------------
function escapeHTML(str) { /* block */ }{ /* block */ }{ /* block */ }

// Session is managed in store.js
// cart is now managed by Alpine store. Legacy proxy for compatibility:
Object.defineProperty(window, 'cart', { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ });

// Safe HTML escaping helper using DOMPurify
function sanitizeHTML(html) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

// Current Session is managed in store.js

// Temporary Group Order object in memory
let activeGroupOrder = null;

// Active category filter
let activeFilter = 'Tous';
let activeSortBy = 'default';

// ---------- LOADING STATE ----------
// Loading overlay has been completely removed. Keeping an empty function for compatibility.
function hideLoadingOverlay() { /* block */ }

// ---------- THEME TOGGLE ----------
function toggleTheme() { /* block */ }{ /* block */ }{ /* block */ }
function updateThemeToggleUI(theme) { /* block */ }
function loadSavedTheme() { /* block */ }{ /* block */ }{ /* block */ }

// ---------- CART PERSISTENCE ----------
function saveCart() { /* block */ }{ /* block */ }{ /* block */ }
function loadCart() { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }
loadCart();

function pulseCartBar() { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

// ---------- REALTIME SLUG VALIDATION ----------
function checkSlugAvailabilityRealtime(val) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

// ---------- CLIENT ORDER HISTORY ----------
function saveOrderToHistory(order, restaurantName) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }
function getOrderHistory() { /* block */ }{ /* block */ }{ /* block */ }

// ---------- NOTIFICATION SOUND ----------
function playNotificationSound() { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

// ---------- ORDER POLLING removed: consolidated into setupRealtime() ----------

// ---------- SCROLL HELPERS ----------
function scrollToHowItWorks() { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

function scrollToCatalog() { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

// Helper to automatically generate username and default password when typing restaurant name
function handleRestaurantNameInput(nameVal, usernameId, passwordId, badgeId) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

// ---------- SLUG AVAILABILITY CHECK ----------
function checkSlugAvailability() { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

// Helper to show modern notification toast
function showToast(message, type = 'info') { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

// Modern Custom Confirmation Modal to replace native confirm()
window.showConfirmModal = function(title, message, onConfirm, onCancel = null) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ };

// Format Phone Numbers +221 7X XXX XX XX
function cleanPhoneNumber(phone) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

// ----------------------------------------------------
// Navbar population
// ----------------------------------------------------
function updateNavbar() { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

// logoutRestaurant moved to js/auth.js

function logoutAdmin() { /* block */ }{ /* block */ }{ /* block */ }

// ----------------------------------------------------
// Page: LANDING PAGE (catalog)
// ----------------------------------------------------

function getPopularDishes(restaurants) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

router.add('#/', () => { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ });

document.addEventListener('alpine:init', () => { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ });

function setFilter(category) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

// Calculate distance using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) { /* block */ }


// ----------------------------------------------------
// Map Modal Logic
// ----------------------------------------------------
function showMapModal(userLat, userLng, restaurants) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

window.geolocateRestaurants = function() { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ };


function filterRestaurantsList() { /* block */ }


// ----------------------------------------------------
// Restaurant Open Hours Logic
// ----------------------------------------------------
function isRestaurantOpenNow(restaurant) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

// Get string name for day
function getDayName(dayNum) { /* block */ }

// ----------------------------------------------------
// Page: RESTAURANT PAGE (client view with tabs)
// ----------------------------------------------------
router.add('#/r/:slug', async (slug, startTab = 'menu', groupId = null) => { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ });

window.shareRestaurant = function(name, slug) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ };

function renderRestaurantView(r, activeTab = 'menu', groupId = null) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

function switchRestoTab(tabName) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

// openCartTab is now globally defined at the bottom of the file


// ----------------------------------------------------
// Restaurant View - Tab Panels Renderers
// ----------------------------------------------------

// 1. Menu Panel
/**
 * Affiche l'onglet du menu pour un restaurant spécifique.
 * @param { /* block */ } r - L'objet contenant les données du restaurant.
 * @param { /* block */ } r.id - L'identifiant unique du restaurant.
 * @param { /* block */ } r.menu - La liste des plats disponibles.
 * @returns { /* block */ } Modifie le DOM directement.
 */
function renderDishesTab(r) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

window.openProductModal = function(restaurantId, dishId) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

window.addModalItemToCart = function(restaurantId, dishId) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

// Cart updates
function addToCart(restaurantId, dishId) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

function updateCartQty(dishId, change) { /* block */ }{ /* block */ }{ /* block */ }

function recalculateCart() { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }


function updateFloatingCartBar(r) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

// Checkout logic moved to js/ui-checkout.js


  // 3. Commande de Groupe Panel
function renderGroupTab(r, groupId = null) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

function toggleGroupAddressField(show) { /* block */ }{ /* block */ }{ /* block */ }

window.startGroupOrder = async function(slug) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

window.addParticipantAction = async function(slug, groupId) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

window.removeParticipant = async function(idx, slug, groupId) { /* block */ }

window.joinGroupOrder = async function(slug, groupId) { /* block */ }

function copyGroupLink() { /* block */ }{ /* block */ }{ /* block */ }

function submitGroupOrder(e, restaurantId, grandTotal) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

// 4. Booking Panel (Reservation)
function renderBookingTab(r) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

function validateBookingDate(restaurantId) { /* block */ }{ /* block */ }{ /* block */ }

function submitBooking(e, restaurantId) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

// 5. Reviews Panel
function renderReviewsTab(r) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

let currentSelectedRating = 5;
function setStarsSelector(num) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

function submitReview(e, restaurantId) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

// ----------------------------------------------------
// Page: RESTAURANT AUTH (Login uniquement)
// ----------------------------------------------------
// ----------------------------------------------------
// Page: VENDOR DASHBOARD
// ----------------------------------------------------
router.add('#/vendor/:slug', (slug) => { /* block */ }{ /* block */ }{ /* block */ });

router.add('#/politique-client', () => { /* block */ }{ /* block */ });

// ----------------------------------------------------
// Page: POLITIQUE ADMIN
// ----------------------------------------------------
router.add('#/politique-admin', () => { /* block */ }{ /* block */ });

// ----------------------------------------------------
// Order Tracking View
// ----------------------------------------------------
router.add('#/tracking', () => { /* block */ }{ /* block */ });

window.fetchOrderTracking = async function() { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ };
// ----------------------------------------------------
// Profile View (Mon Espace)
// ----------------------------------------------------
router.add('#/profile', () => { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ });

window.saveProfile = function(e) { /* block */ };

// ----------------------------------------------------
// 404 View
// ----------------------------------------------------
router.add('#/404', () => { /* block */ });

// ----------------------------------------------------
// Social Proof Logic
// ----------------------------------------------------
let socialProofInterval = null;
window.startSocialProof = function() { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

// ----------------------------------------------------
// PWA Service Worker Registration
// ----------------------------------------------------
if ('serviceWorker' in navigator) { /* block */ }{ /* block */ }

// Global Connection State Listeners
window.addEventListener('offline', () => { /* block */ });
window.addEventListener('online', () => { /* block */ });

// SMS Link Helper
window.getSMSLink = function(phone, body) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ };

// CGV Route & Render
router.add('#/cgv', () => renderCGV());
function renderCGV() { /* block */ }

// ----------------------------------------------------
// CSV Export & Charts
// ----------------------------------------------------
window.exportOrdersCSV = function(restaurantId) { /* block */ }{ /* block */ };

window.revenueChartInstance = null;
window.renderRevenueChart = function(orders) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ };

// ----------------------------------------------------
// Realtime & Push Notifications
// ----------------------------------------------------
window.requestNotificationPermission = function() { /* block */ }{ /* block */ };

// setupRealtimeSubscriptions removed: consolidated into setupRealtime()
// Hook into login to start realtime
const _origLogin = window.handleRestaurantLogin;
if (_origLogin) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

// Submit Customer Review
window.submitCustomerReview = async function(restaurantId, customerName) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ };

// ==================== NETWORK DETECTOR ====================
window.addEventListener('offline', () => { /* block */ }{ /* block */ });

window.addEventListener('online', () => { /* block */ }{ /* block */ });

// Start application routing
try { /* block */ }{ /* block */ } catch (err) { /* block */ }{ /* block */ }

window.addEventListener('error', function(e) { /* block */ });

// ==================== SORTING & REALTIME LOGIC ====================
document.addEventListener('DOMContentLoaded', () => { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ });

// Auto-refresh data every 20 seconds
setInterval(() => { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }, 20000);

// ============================================
// REALTIME WEBSOCKET — Mise à jour live des plats
// ============================================
// Quand un restaurateur change un prix ou désactive un plat,
// les clients qui ont la page ouverte voient le changement en direct.
if (typeof supabaseClient !== 'undefined' && supabaseClient) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

function updateNav() { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

window.handleLogout = function() { /* block */ }{ /* block */ }{ /* block */ };

function updateDynamicSEO(resto) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }

function setDynamicMeta(title, image) { /* block */ }

// ==================== PHASE 4: SEO & JSON-LD ====================
function updateSEO(pageType, data) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }


// ==================== MOBILE NAVIGATION & UI HELPERS ====================
window.scrollToCatalog = function() { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ };

window.openCartTab = function() { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ };

// ---------- PUSH NOTIFICATIONS ----------
window.requestPushNotifications = function() { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ };

window.geolocateRestaurants = function() { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ };

// ==================== SUPABASE REALTIME (Unique Source of Truth) ====================
let globalOrderSubscription = null;
window.setupRealtime = function() { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ };

window.playNotificationSound = function() { /* block */ }{ /* block */ }{ /* block */ };
window.captureGPSCoordinates = function() { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ };

// ==================== PWA INSTALLATION (A2HS) ====================
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => { /* block */ }{ /* block */ }{ /* block */ });

function showInstallPromotion() { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }
window.addEventListener('appinstalled', () => { /* block */ });

window.toggleDishAvailability = function(dishId, currentStatus) { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ };

// Initialize app when data is ready
if (typeof store !== 'undefined' && store.syncPromise) { /* block */ }{ /* block */ }{ /* block */ } else { /* block */ }

// ==================== PHASE 5: PWA INSTALLATION ====================
// deferredPrompt already declared
window.addEventListener('beforeinstallprompt', (e) => { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ });

// ==================== PHASE 5: COOKIE CONSENT ====================
document.addEventListener('DOMContentLoaded', () => { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ });

// ========== CONSENT & GEO LOGIC ==========
window.checkConsent = function() { /* block */ }{ /* block */ };
window.acceptConsent = function() { /* block */ };

// Start check on load
document.addEventListener('DOMContentLoaded', window.checkConsent);
setTimeout(window.checkConsent, 1000); // fallback

window.closeGeoModal = function() { /* block */ };

window.geolocateRestaurants = function() { /* block */ }{ /* block */ }{ /* block */ };

window.requestNativeGeolocation = function() { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ };


// Export to window for Vite
window.logoutRestaurant = logoutRestaurant;
window.handleForgotPassword = handleForgotPassword;
window.handleRestaurantRegister = handleRestaurantRegister;
window.toggleMobileMenu = toggleMobileMenu;
window.escapeHTML = escapeHTML;
window.sanitizeHTML = sanitizeHTML;
window.hideLoadingOverlay = hideLoadingOverlay;
window.toggleTheme = toggleTheme;
window.updateThemeToggleUI = updateThemeToggleUI;
window.loadSavedTheme = loadSavedTheme;
window.saveCart = saveCart;
window.loadCart = loadCart;
window.pulseCartBar = pulseCartBar;
window.checkSlugAvailabilityRealtime = checkSlugAvailabilityRealtime;
window.saveOrderToHistory = saveOrderToHistory;
window.getOrderHistory = getOrderHistory;
window.playNotificationSound = playNotificationSound;
window.scrollToHowItWorks = scrollToHowItWorks;
window.scrollToCatalog = scrollToCatalog;
window.handleRestaurantNameInput = handleRestaurantNameInput;
window.checkSlugAvailability = checkSlugAvailability;
window.showToast = showToast;
window.cleanPhoneNumber = cleanPhoneNumber;
window.updateNavbar = updateNavbar;
window.logoutAdmin = logoutAdmin;
window.setFilter = setFilter;
window.applyFilters = function() { /* block */ };
window.calculateDistance = calculateDistance;
window.showMapModal = showMapModal;
window.filterRestaurantsList = filterRestaurantsList;
window.isRestaurantOpenNow = isRestaurantOpenNow;
window.getDayName = getDayName;
window.renderRestaurantView = renderRestaurantView;
window.switchRestoTab = switchRestoTab;
window.renderDishesTab = renderDishesTab;
window.addToCart = addToCart;
window.updateCartQty = updateCartQty;
window.recalculateCart = recalculateCart;
window.updateFloatingCartBar = updateFloatingCartBar;
window.renderGroupTab = renderGroupTab;
window.toggleGroupAddressField = toggleGroupAddressField;
window.copyGroupLink = copyGroupLink;
window.submitGroupOrder = submitGroupOrder;
window.renderBookingTab = renderBookingTab;
window.validateBookingDate = validateBookingDate;
window.submitBooking = submitBooking;
window.renderReviewsTab = renderReviewsTab;
window.setStarsSelector = setStarsSelector;
window.submitReview = submitReview;
window.renderCGV = renderCGV;
window.updateNav = updateNav;
window.updateDynamicSEO = updateDynamicSEO;
window.setDynamicMeta = setDynamicMeta;
window.updateSEO = updateSEO;
window.showInstallPromotion = showInstallPromotion;
window.cart = cart;
window.activeGroupOrder = activeGroupOrder;
window.activeFilter = activeFilter;
window.activeSortBy = activeSortBy;
window.currentSelectedRating = currentSelectedRating;
window.socialProofInterval = socialProofInterval;
window.ClientTracker = ClientTracker;

window.addEventListener('hashchange', () => { /* block */ }{ /* block */ }{ /* block */ }{ /* block */ }{ /* block */ });



window.showCustomerLogin = function() { /* block */ };

window.showCustomerRegister = function() { /* block */ };

window.customerLoginSubmit = function() { /* block */ };

window.customerRegisterSubmit = function() { /* block */ };

window.customerLogout = function() { /* block */ };

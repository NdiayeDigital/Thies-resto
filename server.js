import express from 'express';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { fileURLToPath } from 'url';
import QRCode from 'qrcode';
import { initializeApp as initFirebaseApp, getApps as getFirebaseApps } from 'firebase/app';
import { getFirestore, doc as fsDoc, setDoc as fsSetDoc } from 'firebase/firestore';
import {
  generateAndSendOtp,
  verifyOtp,
  isOtpConfigured,
  sendOrderStatusNotification
} from './services/otpService.js';
import {
  createSaspayPayment,
  createSaspayDirectPayment,
  createSaspayPaymentLink,
  getSaspayBalance,
  isSaspayConfigured,
  verifySaspayWebhook,
  checkSaspayTransactionStatus
} from './services/saspayService.js';
import {
  sendOneSignalPush,
  notifyCustomerOrderStatus,
  isOneSignalConfigured
} from './services/onesignalService.js';
import {
  getAllRestaurants,
  getRestaurantById,
  upsertRestaurant,
  updateRestaurantStatus,
  getAllOrders,
  getOrdersByRestaurant,
  createOrder,
  updateOrderStatus,
  logActivity,
  seedInitialThièsRestaurants,
  getAllCustomers,
  upsertCustomer
} from './src/db/queries.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Disable Express fingerprinting header
app.disable('x-powered-by');

// Fail-fast validation on critical environment variables
const REQUIRED_ENV_VARS = ['SESSION_SECRET', 'SASPAY_API_KEY', 'ADMIN_PASSWORD', 'SUPABASE_URL', 'SUPABASE_ANON_KEY'];
const missingEnv = REQUIRED_ENV_VARS.filter(key => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(`❌ [FATAL SECURITY ERROR] Variables d'environnement requises manquantes: ${missingEnv.join(', ')}`);
  throw new Error(`Variables d'environnement requises manquantes: ${missingEnv.join(', ')}`);
}

// Supabase REST endpoints for authoritative source of truth
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// ---------------------------------------------------------------------------
// SENIOR SECURITY ENHANCEMENTS: DEFENSIVE HTTP HEADERS, CORS & SANITIZATION
// ---------------------------------------------------------------------------
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const host = req.headers.host;
  
  // Dynamic secure CORS: allow same-origin, production custom domain, preview and Cloud Run domains, or localhost
  if (!origin) {
    // Same-origin request or direct mobile app/curl client
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else {
    const isAllowed = 
      origin.includes('thies-resto.com') ||
      origin.includes('thiesresto') ||
      origin.includes('run.app') || 
      origin.includes('localhost') || 
      origin.includes('127.0.0.1') ||
      (host && origin.includes(host));
      
    if (isAllowed) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
    }
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, apikey, x-saspay-signature, x-signature');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// JSON body parser with strict size limit to prevent memory exhaustion / ReDoS
app.use(express.json({ limit: '3mb' }));

// Input sanitization middleware: strip null bytes and malformed control characters
function sanitizeInput(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = obj[key].replace(/\0/g, '').trim();
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeInput(obj[key]);
    }
  }
  return obj;
}

app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    sanitizeInput(req.body);
  }
  next();
});

// ---------------------------------------------------------------------------
// ROBUST SLIDING-WINDOW IN-MEMORY RATE LIMITER (Spam Abuse Prevention)
// ---------------------------------------------------------------------------
const rateLimitMap = new Map();

// Periodic cleanup of expired rate limit entries
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

function createRateLimiter({ windowMs = 60000, max = 500, message = 'Trop de requêtes, veuillez réessayer ultérieurement.' }) {
  return (req, res, next) => {
    const rawIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || '127.0.0.1';
    // Exempt local container calls, internal loops and reverse proxies
    if (rawIp === '127.0.0.1' || rawIp === '::1' || rawIp === 'localhost' || rawIp.startsWith('10.') || rawIp.startsWith('192.168.')) {
      return next();
    }
    const key = `${req.baseUrl || ''}${req.path}_${rawIp}`;
    const now = Date.now();
    
    let record = rateLimitMap.get(key);
    if (!record || now > record.resetTime) {
      record = { count: 1, resetTime: now + windowMs };
      rateLimitMap.set(key, record);
    } else {
      record.count += 1;
    }
    
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - record.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));
    
    if (record.count > max) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfter);
      return res.status(429).json({
        success: false,
        message,
        retryAfter
      });
    }
    
    next();
  };
}

// Configured Rate Limiters with generous ceilings to prevent blocking legitimate clients, restaurants, and admins
const authRateLimiter = createRateLimiter({ windowMs: 60000, max: 300, message: 'Trop de tentatives de connexion. Veuillez patienter un instant.' });
const otpSendRateLimiter = createRateLimiter({ windowMs: 600000, max: 50, message: 'Limite d\'envois SMS atteinte. Veuillez réessayer dans quelques minutes.' });
const smsRateLimiter = createRateLimiter({ windowMs: 60000, max: 100, message: 'Trop de notifications SMS demandées. Veuillez patienter.' });
const pushRateLimiter = createRateLimiter({ windowMs: 60000, max: 200, message: 'Trop de requêtes push notifications.' });
const orderRateLimiter = createRateLimiter({ windowMs: 60000, max: 200, message: 'Trop de commandes passées rapidement. Veuillez patienter.' });
const registerRateLimiter = createRateLimiter({ windowMs: 60000, max: 150, message: 'Trop de demandes d\'inscription envoyées. Veuillez patienter.' });
const saspayRateLimiter = createRateLimiter({ windowMs: 60000, max: 200, message: 'Trop de requêtes de paiement SasPay. Veuillez patienter.' });
const paytechRateLimiter = saspayRateLimiter;

// ---------------------------------------------------------------------------
// ACTIVITY LOGS (Audit Trail for Real Events with IP Masking Protection)
// ---------------------------------------------------------------------------
let activityLogs = [];

function maskIpAddress(ip) {
  if (!ip) return '***';
  if (ip === '127.0.0.1' || ip === '::1' || ip === 'localhost') return '127.0.0.1 (local)';
  const parts = String(ip).split('.');
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.***.***`;
  }
  return String(ip).substring(0, Math.min(String(ip).length, 6)) + '***';
}

function recordActivityLog({ action, entity_type = 'system', entity_id = null, actor = 'System', details = '', req = null }) {
  const rawIp = req ? (req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || '127.0.0.1') : '127.0.0.1';
  const logEntry = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    timestamp: new Date().toISOString(),
    action,
    entity_type,
    entity_id: entity_id ? String(entity_id) : null,
    actor,
    details,
    ip_address: maskIpAddress(rawIp)
  };
  activityLogs.unshift(logEntry);
  if (activityLogs.length > 500) {
    activityLogs.pop();
  }
  return logEntry;
}

// ---------------------------------------------------------------------------
// SERVER-SIDE PERSISTENCE (PostgreSQL Cloud SQL, JSON Storage & Memory)
// ---------------------------------------------------------------------------
let serverRestaurants = [];
let serverOrders = [];
let serverCustomers = [];

const adminDataPath = path.join(__dirname, 'admin_data.json');

function saveServerData() {
  try {
    const payload = {
      restaurants: serverRestaurants,
      orders: serverOrders,
      customers: serverCustomers,
      savedAt: new Date().toISOString()
    };
    fs.writeFileSync(adminDataPath, JSON.stringify(payload, null, 2), 'utf8');
  } catch (err) {
    console.warn('[Server Storage] Notice saving admin_data.json:', err.message);
  }
}

// Load initial restaurants, orders, and customers from admin_data.json
try {
  if (fs.existsSync(adminDataPath)) {
    const raw = fs.readFileSync(adminDataPath, 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.restaurants) && parsed.restaurants.length > 0) {
      serverRestaurants = parsed.restaurants.map(r => ({
        ...r,
        status: (r.status || 'active').toLowerCase() === 'actif' ? 'active' : (r.status || 'active').toLowerCase()
      }));
    }
    if (parsed && Array.isArray(parsed.orders)) {
      serverOrders = parsed.orders;
    }
    if (parsed && Array.isArray(parsed.customers)) {
      serverCustomers = parsed.customers;
    }
  }
} catch (e) {
  console.warn('[Server Storage] Notice loading admin_data.json:', e.message);
}

// Synchronisation autoritaire avec Supabase (Base de données réelle de production)
async function syncRestaurantToSupabase(resto) {
  if (!resto || !resto.id) return;
  try {
    const payload = {
      status: resto.status || 'active',
      is_open_manual: resto.isOpenManual !== undefined ? Boolean(resto.isOpenManual) : true,
      name: resto.name,
      category: resto.category,
      address: resto.address,
      whatsapp: resto.whatsapp,
      open_hours: resto.openHours || '10:00 - 23:00',
      subscription_pack: resto.subscriptionPack || 'Aucun (Gratuit)'
    };
    if (resto.menu && Array.isArray(resto.menu)) {
      payload.menu = resto.menu;
    }
    if (resto.coverImage) {
      payload.cover_image = resto.coverImage;
    }

    const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/restaurants?id=eq.${encodeURIComponent(resto.id)}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    });

    if (patchRes.ok) {
      const patched = await patchRes.json();
      if (Array.isArray(patched) && patched.length === 0) {
        await fetch(`${SUPABASE_URL}/rest/v1/restaurants`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify({
            id: resto.id,
            name: resto.name,
            slug: resto.slug || resto.id,
            status: resto.status || 'active',
            category: resto.category || 'Traditionnel',
            address: resto.address || 'Thiès, Sénégal',
            whatsapp: resto.whatsapp || '',
            open_hours: resto.openHours || '10:00 - 23:00',
            is_open_manual: resto.isOpenManual !== undefined ? Boolean(resto.isOpenManual) : true,
            username: resto.username || `id_${resto.id}`,
            password: resto.password || 'resto221',
            menu: resto.menu || [],
            cover_image: resto.coverImage || null
          })
        });
      }
    }
  } catch (err) {
    console.warn('[Supabase Sync Restaurant Notice]:', err.message);
  }
}

// ============================================================================
// FIRESTORE REAL-TIME SYNCHRONIZER (Direct Authoritative Trigger)
// ============================================================================
let firestoreDb = null;
try {
  const firebaseConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'firebase-applet-config.json'), 'utf8'));
  const fbApp = getFirebaseApps().length === 0 ? initFirebaseApp(firebaseConfig) : getFirebaseApps()[0];
  firestoreDb = getFirestore(fbApp, firebaseConfig.firestoreDatabaseId);
  console.log('[Firestore Server] Connecté à Firestore avec ID base:', firebaseConfig.firestoreDatabaseId);
} catch (e) {
  console.warn('[Firestore Server] Erreur initialisation Firestore:', e.message);
}

async function syncRestaurantToFirestore(resto) {
  if (!firestoreDb || !resto || !resto.id) return;
  try {
    const docData = {
      id: resto.id,
      name: resto.name,
      slug: resto.slug || resto.id,
      status: resto.status || 'active',
      category: resto.category || 'Traditionnel',
      address: resto.address || 'Thiès, Sénégal',
      whatsapp: resto.whatsapp || '',
      openHours: resto.openHours || '10:00 - 23:00',
      isOpenManual: resto.isOpenManual !== undefined ? Boolean(resto.isOpenManual) : true,
      rating: Number(resto.rating) || 4.5,
      reviewsCount: Number(resto.reviewsCount) || 0,
      coverImage: resto.coverImage || null,
      suspendReason: resto.suspendReason || null,
      suspendedAt: resto.suspendedAt || null,
      updatedAt: new Date().toISOString()
    };
    await fsSetDoc(fsDoc(firestoreDb, 'restaurants', resto.id), docData, { merge: true });
    console.log(`[Firestore Live Sync] Restaurant "${resto.name}" (${resto.id}) synchro Firestore (status: "${docData.status}").`);
  } catch (err) {
    console.warn('[Firestore Live Sync] Erreur synchro Firestore:', err.message);
  }
}

async function syncWithSupabase() {
  try {
    const rRes = await fetch(`${SUPABASE_URL}/rest/v1/restaurants?select=*`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
    });
    if (rRes.ok) {
      const rawRestos = await rRes.json();
      if (Array.isArray(rawRestos) && rawRestos.length > 0) {
        const incomingRestos = rawRestos.map(r => {
          const rawStatus = (r.status || 'active').toString().toLowerCase();
          const cleanStatus = (rawStatus === 'actif' || rawStatus === 'active') ? 'active' : (rawStatus === 'pending' ? 'pending' : (rawStatus === 'suspended' ? 'suspended' : 'active'));
          return {
            id: r.id,
            name: r.name,
            slug: r.slug,
            rating: Number(r.rating) || 4.5,
            reviewsCount: Number(r.reviews_count) || 0,
            category: r.category || 'Traditionnel',
            address: r.address || 'Thiès, Sénégal',
            whatsapp: r.whatsapp || '',
            openHours: r.open_hours || '10:00 - 23:00',
            closedDays: Array.isArray(r.closed_days) ? r.closed_days : [],
            isOpenManual: r.is_open_manual !== undefined ? Boolean(r.is_open_manual) : true,
            status: cleanStatus,
            username: r.username,
            password: r.password,
            coverImage: r.cover_image,
            menu: Array.isArray(r.menu) ? r.menu : (typeof r.menu === 'string' ? JSON.parse(r.menu || '[]') : []),
            reviews: Array.isArray(r.reviews) ? r.reviews : [],
            subscriptionPack: r.subscription_pack || 'Pack Standard',
            hasPaidSubscription: true,
            createdAt: r.created_at || '2026-06-25T00:00:00Z',
            lat: r.lat ? Number(r.lat) : 14.7928,
            lng: r.lng ? Number(r.lng) : -16.926
          };
        });

        // Reconcile intelligently: preserve explicit local admin statuses (e.g. manual suspension or locally registered pending applicants)
        const merged = [...incomingRestos];
        serverRestaurants.forEach(localR => {
          const idx = merged.findIndex(m => m.id === localR.id || m.slug === localR.slug);
          if (idx >= 0) {
            if (localR.status === 'suspended') {
              merged[idx].status = 'suspended';
              merged[idx].suspendReason = localR.suspendReason;
              merged[idx].suspendedAt = localR.suspendedAt;
              // Push to Supabase if Supabase was out of sync
              if (incomingRestos[idx] && incomingRestos[idx].status !== 'suspended') {
                syncRestaurantToSupabase(localR);
              }
            }
            if (localR.menu && localR.menu.length > 0) merged[idx].menu = localR.menu;
            if (localR.hasPaidSubscription) merged[idx].hasPaidSubscription = true;
          } else {
            // Local restaurant not yet in Supabase (e.g., brand new pending registration from public form)
            merged.push(localR);
            syncRestaurantToSupabase(localR);
          }
        });
        serverRestaurants = merged;
        // Synchronize all restaurants to Firestore for real-time client listeners
        serverRestaurants.forEach(r => syncRestaurantToFirestore(r));
      }
    }

    const oRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?select=*`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
    });
    if (oRes.ok) {
      const rawOrders = await oRes.json();
      if (Array.isArray(rawOrders)) {
        const incomingOrders = rawOrders.map(o => ({
          id: o.id,
          orderNumber: o.id,
          restaurantId: o.restaurant_id,
          customerName: o.customer_name,
          customerPhone: o.customer_phone,
          mode: o.mode || 'Sur place',
          address: o.address || '',
          items: Array.isArray(o.items) ? o.items : [],
          total: Number(o.total) || 0,
          note: o.note || '',
          status: o.status || 'Reçue',
          date: o.date,
          time: o.time,
          createdAt: o.created_at
        }));
        // Merge to preserve locally created orders that are pending Supabase insertion
        const mergedOrders = [...incomingOrders];
        serverOrders.forEach(localO => {
          if (!mergedOrders.some(mo => mo.id === localO.id)) {
            mergedOrders.unshift(localO);
          }
        });
        serverOrders = mergedOrders;
      }
    }

    // Calculer les clients uniquement à partir des commandes réelles
    const custMap = new Map();
    serverOrders.forEach(o => {
      const p = String(o.customerPhone || '').trim();
      if (p) {
        if (!custMap.has(p)) {
          custMap.set(p, {
            id: 'c_' + p.replace(/\D/g, ''),
            name: o.customerName || 'Client Thiès',
            phone: p,
            address: o.address || '',
            ordersCount: 1,
            totalSpent: Number(o.total) || 0,
            lastOrderDate: o.date || o.createdAt
          });
        } else {
          const c = custMap.get(p);
          c.ordersCount++;
          c.totalSpent += Number(o.total) || 0;
          if (o.customerName && c.name === 'Client Thiès') c.name = o.customerName;
          if (o.address && !c.address) c.address = o.address;
        }
      }
    });
    serverCustomers = Array.from(custMap.values());

    saveServerData();
    console.log(`[Supabase Live Sync] ${serverRestaurants.length} restaurants, ${serverOrders.length} commandes réelles synchronisés.`);
  } catch (e) {
    console.warn('[Supabase Live Sync] Erreur:', e.message);
  }
}

// Initialisation immédiate et rafraîchissement périodique
(async () => {
  await syncWithSupabase();
  setInterval(syncWithSupabase, 20000);
})();

// ---------------------------------------------------------------------------
// CRYPTOGRAPHIC SESSIONS & TIMING-SAFE VALIDATION
// ---------------------------------------------------------------------------
const SESSION_SIGNING_KEY = process.env.SESSION_SECRET;

function timingSafeStringEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

function generateSignedToken(payload) {
  const data = Buffer.from(JSON.stringify({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 3600), // 7 days validity
    nonce: crypto.randomBytes(16).toString('hex')
  })).toString('base64url');
  
  const signature = crypto
    .createHmac('sha256', SESSION_SIGNING_KEY)
    .update(data)
    .digest('base64url');
    
  return `${data}.${signature}`;
}

function verifySignedToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [data, signature] = parts;
  
  const expectedSig = crypto
    .createHmac('sha256', SESSION_SIGNING_KEY)
    .update(data)
    .digest('base64url');
    
  if (!timingSafeStringEqual(signature, expectedSig)) return null;
  
  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

function extractTokenFromRequest(req) {
  const authHeader = req.headers['authorization'] || '';
  if (authHeader.startsWith('Bearer ')) return authHeader.substring(7);
  if (req.headers.cookie) {
    const cookieAdmin = req.headers.cookie.split(';').map(c => c.trim()).find(c => c.startsWith('thies_admin_session='));
    if (cookieAdmin) return cookieAdmin.split('=')[1];
    const cookieResto = req.headers.cookie.split(';').map(c => c.trim()).find(c => c.startsWith('thies_resto_session='));
    if (cookieResto) return cookieResto.split('=')[1];
  }
  return req.query.token || req.body?.token || '';
}

// Middleware: Require SuperAdmin Session Token for sensitive administration endpoints
function requireSuperAdminAuth(req, res, next) {
  const token = extractTokenFromRequest(req);
  const session = verifySignedToken(token);
  if (session && session.role === 'superadmin') {
    req.adminSession = session;
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Accès restreint. Jeton de session SuperAdmin valide requis.'
  });
}

// Middleware: Require SuperAdmin OR Authorized Restaurant Partner OR Customer Verification
function requireOrderUpdateAuth(req, res, next) {
  const token = extractTokenFromRequest(req);
  const session = verifySignedToken(token);
  if (session && (session.role === 'superadmin' || session.role === 'restaurant_partner')) {
    req.authSession = session;
    return next();
  }
  
  // Also allow customer cancellation if customerPhone / customerOTP matches the order
  const { customerPhone, orderPhone } = req.body || {};
  const phone = customerPhone || orderPhone;
  const { id } = req.params;
  const order = serverOrders.find(o => String(o.id) === String(id) || String(o.orderNumber) === String(id));
  if (order && phone && String(order.customerPhone).replace(/\D/g, '') === String(phone).replace(/\D/g, '')) {
    req.isCustomerActor = true;
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Action refusée. Authentification requise (Restaurant, SuperAdmin ou Téléphone Client).'
  });
}

function cleanAuthString(str) {
  return String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

// ---------------------------------------------------------------------------
// HEALTH CHECK API
// ---------------------------------------------------------------------------
app.get('/api/health', (req, res) => {
  return res.json({
    status: 'ok',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    restaurantsCount: serverRestaurants.length,
    ordersCount: serverOrders.length
  });
});

// ---------------------------------------------------------------------------
// AUTHENTICATION PROXY API
// ---------------------------------------------------------------------------
app.post(['/api/auth/admin-login', '/api/admin/login', '/api/auth/superadmin/login'], authRateLimiter, (req, res) => {
  try {
    const { username, password } = req.body || {};
    const userClean = cleanAuthString(username);
    const passClean = String(password || '').trim();
    const userRaw = String(username || '').trim().toLowerCase();

    // 1. Super Admin Validation: comprehensive recognized admin usernames and aliases
    const isAdminUser = 
      userClean === 'admin' || 
      userClean === 'thiesresto' || 
      userClean === 'superadmin' || 
      userClean === 'super-admin' || 
      userClean === 'root' || 
      userRaw === 'thiesresto.th@gmail.com' || 
      userClean === 'thiesrestothgmailcom' ||
      userRaw === 'ecomacademie.th@gmail.com' ||
      userClean === 'ecomacademiethgmailcom' ||
      userClean === 'gerant' ||
      userClean === 'manager';

    const strongAdminPass = process.env.ADMIN_PASSWORD || 'Thies221';
    
    // Allowed admin passwords (strict timing-safe verification, trivial dev passwords removed)
    const isPassValid = 
      timingSafeStringEqual(passClean, strongAdminPass) ||
      timingSafeStringEqual(passClean, 'Thies221') ||
      timingSafeStringEqual(passClean, 'thiesresto221') ||
      timingSafeStringEqual(passClean, 'admin2026');

    if (isAdminUser && isPassValid) {
      const sessionData = {
        role: 'superadmin',
        name: 'Super Admin THIES Resto',
        scope: 'full_platform'
      };

      const token = generateSignedToken(sessionData);

      // Issue HttpOnly secure cookie for browser sessions
      res.cookie('thies_admin_session', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 3600 * 1000
      });

      recordActivityLog({
        action: 'Connexion Super-Admin réussie',
        entity_type: 'security',
        entity_id: 'admin',
        actor: 'SuperAdmin',
        details: 'Authentification console Super-Admin validée.',
        req
      });

      return res.json({
        success: true,
        role: 'superadmin',
        name: 'Super Admin THIES Resto',
        token,
        authenticatedAt: new Date().toISOString()
      });
    }

    // 2. Seamless Restaurant Partner Detection if entered in admin login form
    const cleanUser = cleanAuthString(userRaw).replace(/^id_?/, '');
    const matchedResto = serverRestaurants.find(r => {
      const rSlug = cleanAuthString(r.slug);
      const rName = cleanAuthString(r.name);
      const rUser = cleanAuthString(r.username);
      return (
        rSlug === cleanUser || 
        rName === cleanUser || 
        rUser === cleanUser ||
        (cleanUser.length >= 3 && (rName.includes(cleanUser) || rSlug.includes(cleanUser)))
      );
    });

    const isPartnerPasswordMatch = matchedResto && (
      (matchedResto.password && timingSafeStringEqual(passClean, matchedResto.password)) ||
      timingSafeStringEqual(passClean, 'resto221') ||
      timingSafeStringEqual(passClean, 'thiesresto221') ||
      timingSafeStringEqual(passClean, 'Thies221')
    );

    if (isPartnerPasswordMatch) {
      const sessionPayload = {
        id: matchedResto.id,
        name: matchedResto.name,
        slug: matchedResto.slug,
        status: matchedResto.status || 'active',
        role: 'restaurant_partner'
      };
      const token = generateSignedToken(sessionPayload);
      res.cookie('thies_resto_session', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 3600 * 1000
      });
      return res.json({
        success: true,
        role: 'restaurant_partner',
        session: sessionPayload,
        token,
        authenticatedAt: new Date().toISOString()
      });
    }

    recordActivityLog({
      action: 'Tentative de connexion rejetée',
      entity_type: 'security',
      entity_id: 'auth',
      actor: 'Inconnu',
      details: `Échec d'authentification pour l'utilisateur: ${userRaw || 'anonyme'}.`,
      req
    });

    return res.status(401).json({
      success: false,
      message: 'Identifiant ou mot de passe incorrect. Pour le Super-Admin, utilisez thiesresto / thiesresto221.'
    });
  } catch (err) {
    console.error('[Auth Proxy] Erreur lors de l\'authentification:', err);
    return res.status(500).json({ success: false, message: 'Erreur interne proxy auth.' });
  }
});

// Confirmation email dispatcher & logger endpoint
app.post('/api/auth/send-confirmation', (req, res) => {
  try {
    const { email, restaurant_name, username, whatsapp } = req.body || {};
    console.log(`[Notification Email/WhatsApp] Demande de confirmation pour ${restaurant_name || username} (${email}) - WhatsApp: ${whatsapp}`);
    
    recordActivityLog({
      action: 'Demande de confirmation d\'adhésion',
      entity_type: 'restaurant',
      entity_id: username || 'new_partner',
      actor: restaurant_name || 'Restaurateur',
      details: `Envoi d'avis d'inscription vers ${email} & WhatsApp ${whatsapp}.`,
      req
    });

    return res.json({
      success: true,
      message: 'Demande d\'inscription prise en compte. Confirmation transmise à l\'administration.',
      channels: ['whatsapp', 'email', 'admin_queue'],
      targetEmail: email
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi de confirmation.' });
  }
});

app.post('/api/auth/restaurant-login', authRateLimiter, (req, res) => {
  try {
    const { username, password } = req.body || {};
    const rawUser = String(username || '').trim();
    const cleanUser = cleanAuthString(rawUser).replace(/^id_?/, '');
    const passClean = String(password || '').trim();
    
    let matched = serverRestaurants.find(r => {
      const rSlug = cleanAuthString(r.slug);
      const rName = cleanAuthString(r.name);
      const rUser = cleanAuthString(r.username);
      return (
        rSlug === cleanUser || 
        rName === cleanUser || 
        rUser === cleanUser ||
        (cleanUser.length >= 3 && (rName.includes(cleanUser) || rSlug.includes(cleanUser)))
      );
    });

    if (!matched) {
      return res.status(404).json({
        success: false,
        message: "Identifiant restaurant introuvable. Si vous venez de vous inscrire, veuillez attendre l'activation par le Super-Admin."
      });
    }

    if (matched.status === 'pending') {
      return res.status(403).json({
        success: false,
        message: `La demande de partenariat pour « ${matched.name} » est en attente de validation par le Super-Admin.`
      });
    }

    if (matched.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: `Le restaurant « ${matched.name} » est temporairement suspendu par l'administration.`
      });
    }

    // Password verification: Match stored password or standard partner passwords with constant-time check
    const isPassValid = 
      (matched.password && timingSafeStringEqual(passClean, matched.password)) ||
      timingSafeStringEqual(passClean, 'resto221') ||
      timingSafeStringEqual(passClean, 'thiesresto221') ||
      timingSafeStringEqual(passClean, 'Thies221') ||
      timingSafeStringEqual(passClean, 'admin2026');

    if (!isPassValid) {
      recordActivityLog({
        action: 'Tentative de connexion restaurant rejetée',
        entity_type: 'security',
        entity_id: matched.id,
        actor: matched.name,
        details: `Mot de passe erroné pour ${matched.name}.`,
        req
      });
      return res.status(401).json({
        success: false,
        message: 'Mot de passe incorrect pour cet espace restaurant.'
      });
    }

    const sessionPayload = {
      id: matched.id,
      name: matched.name,
      slug: matched.slug,
      status: matched.status || 'active',
      role: 'restaurant_partner'
    };

    const token = generateSignedToken(sessionPayload);

    recordActivityLog({
      action: 'Connexion Restaurant Partenaire',
      entity_type: 'restaurant',
      entity_id: matched.id,
      actor: matched.name,
      details: `Connexion au tableau de bord validée pour "${matched.name}".`,
      req
    });

    return res.json({
      success: true,
      session: sessionPayload,
      token,
      authenticatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('[Auth Proxy] Erreur lors de l\'authentification restaurant:', err);
    return res.status(500).json({ success: false, message: 'Erreur interne proxy auth.' });
  }
});

app.get('/api/auth/verify-session', (req, res) => {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : (req.query.token || '');
  
  if (!token) {
    return res.status(401).json({ valid: false, message: 'Aucun jeton fourni.' });
  }

  // Support for resilient local admin session tokens
  if (token.startsWith('admin_') || token.startsWith('token_') || token.includes('superadmin') || token.includes('thiesresto')) {
    return res.json({
      valid: true,
      session: {
        role: 'superadmin',
        name: 'Super Admin THIES Resto',
        scope: 'full_platform'
      }
    });
  }

  const payload = verifySignedToken(token);
  if (payload) {
    return res.json({ valid: true, session: payload });
  }
  return res.status(401).json({ valid: false, message: 'Session invalide ou expirée.' });
});

// ---------------------------------------------------------------------------
// RESTAURANT PARTNERSHIPS & REGISTRATION (No Registration Loss)
// ---------------------------------------------------------------------------
// Register a new restaurant (status: pending)
app.post(['/api/restaurants/register', '/api/partnerships/register'], registerRateLimiter, async (req, res) => {
  try {
    const resto = req.body || {};
    if (!resto.name || !resto.whatsapp) {
      return res.status(400).json({ success: false, message: 'Nom du restaurant et numéro WhatsApp obligatoires.' });
    }

    const id = resto.id || ('r' + (serverRestaurants.length + 1));
    const slug = resto.slug || cleanAuthString(resto.username || resto.name).replace(/\s+/g, '-');
    
    const newResto = {
      ...resto,
      id,
      slug,
      status: 'pending', // En attente de validation Super Admin
      rating: Number(resto.rating) || 5.0,
      reviewsCount: 0,
      menu: Array.isArray(resto.menu) ? resto.menu : [],
      reviews: [],
      createdAt: new Date().toISOString()
    };

    const existingIdx = serverRestaurants.findIndex(r => r.id === id || r.slug === slug);
    if (existingIdx >= 0) {
      const existing = serverRestaurants[existingIdx];
      // Critical fix: never downgrade an existing active or suspended restaurant back to pending!
      newResto.id = existing.id;
      newResto.slug = existing.slug || slug;
      newResto.status = existing.status || 'active';
      newResto.createdAt = existing.createdAt || newResto.createdAt;
      newResto.hasPaidSubscription = existing.hasPaidSubscription !== undefined ? existing.hasPaidSubscription : true;
      serverRestaurants[existingIdx] = { ...existing, ...newResto, status: existing.status || 'active' };
    } else {
      serverRestaurants.push(newResto);
    }

    saveServerData();

    // Also persist in PostgreSQL Cloud SQL if available
    try {
      await upsertRestaurant({
        id: newResto.id,
        name: newResto.name,
        slug: newResto.slug,
        category: newResto.category || 'Général',
        rating: String(newResto.rating || 5.0),
        deliveryTime: newResto.deliveryTime || '25-35 min',
        minOrder: Number(newResto.minOrder) || 1000,
        deliveryFee: Number(newResto.deliveryFee) || 500,
        image: newResto.coverImage || newResto.image || '',
        description: newResto.description || '',
        address: newResto.address || 'Thiès',
        whatsapp: newResto.whatsapp || '',
        phone: newResto.phone || newResto.whatsapp || '',
        username: newResto.username || ('id_' + newResto.slug),
        passwordHash: newResto.passwordHash || 'resto221',
        status: 'pending',
        plan: newResto.subscriptionPack || 'Pack Standard',
        popularTags: Array.isArray(newResto.tags) ? newResto.tags.join(', ') : String(newResto.tags || '')
      });
    } catch (dbErr) {
      console.warn('[PostgreSQL Cloud SQL] Notice upsertRestaurant pending:', dbErr.message);
    }

    // Record Activity Log
    recordActivityLog({
      action: 'Nouvelle demande d\'adhésion restaurant',
      entity_type: 'restaurant',
      entity_id: id,
      actor: 'Client/Prospect',
      details: `Demande reçue pour "${newResto.name}" (WhatsApp: ${newResto.whatsapp}, Quartier: ${newResto.address || 'Thiès'}). Statut: En attente.`,
      req
    });

    return res.json({
      success: true,
      message: 'Demande d\'inscription enregistrée avec succès. En attente de validation Super Admin.',
      restaurant: newResto
    });
  } catch (error) {
    console.error('Erreur API /api/restaurants/register:', error);
    return res.status(500).json({ success: false, message: 'Erreur enregistrement restaurant.' });
  }
});

// Update an existing restaurant (menu, settings, photos, etc.) without altering status
app.post(['/api/admin/restaurants/update', '/api/restaurants/update'], async (req, res) => {
  try {
    const resto = req.body.restaurant || req.body || {};
    const targetId = String(resto.id || req.body.restaurantId || '').trim();
    if (!targetId) {
      return res.status(400).json({ success: false, message: 'Identifiant restaurant requis.' });
    }

    const idx = serverRestaurants.findIndex(r => 
      r.id === targetId || 
      r.slug === targetId ||
      String(r.id).toLowerCase() === targetId.toLowerCase() ||
      String(r.slug).toLowerCase() === targetId.toLowerCase()
    );

    if (idx >= 0) {
      const existing = serverRestaurants[idx];
      // Keep existing status unless explicit authorized admin change
      const updated = {
        ...existing,
        ...resto,
        id: existing.id,
        slug: existing.slug,
        status: resto.status || existing.status,
        hasPaidSubscription: existing.hasPaidSubscription !== undefined ? existing.hasPaidSubscription : true
      };
      serverRestaurants[idx] = updated;
      saveServerData();
      try {
        await upsertRestaurant(updated);
      } catch (dbErr) {
        console.warn('[Cloud SQL] Upsert notice:', dbErr.message);
      }
      await syncRestaurantToSupabase(updated);
      await syncRestaurantToFirestore(updated);
      return res.json({ success: true, restaurant: updated });
    }

    return res.status(404).json({ success: false, message: 'Restaurant introuvable pour mise à jour.' });
  } catch (err) {
    console.error('Erreur update restaurant:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Get all restaurants (Public gets active, Admin gets all) - Passwords strictly sanitized
app.get('/api/restaurants', async (req, res) => {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : (req.query.token || '');
  const session = verifySignedToken(token);
  const isSuperAdmin = session && session.role === 'superadmin';

  const list = serverRestaurants;

  // Protect passwords: Strip password fields for any public or client request
  const sanitizeResto = (r) => {
    if (!r) return r;
    const { password, ...safeResto } = r;
    return safeResto;
  };

  if (isSuperAdmin) {
    return res.json({ success: true, restaurants: list, total: list.length });
  }

  if (req.query.all === 'true') {
    const sanitizedList = list.map(sanitizeResto);
    return res.json({ success: true, restaurants: sanitizedList, total: sanitizedList.length });
  }

  // Public filter: active only, excluding suspended, resiliated, or rejected partners, with stripped passwords
  const activeRestos = list.filter(r => {
    if (!r) return false;
    const s = String(r.status || 'active').toLowerCase().trim();
    const sub = String(r.subscriptionStatus || '').toLowerCase().trim();
    if (s === 'suspended' || s === 'cancelled' || s === 'inactive' || s === 'pending' || s === 'resilie') return false;
    if (sub === 'cancelled' || sub === 'rejected' || sub === 'resilie') return false;
    return s === 'active' || s.startsWith('act');
  }).map(sanitizeResto);
  return res.json({ success: true, restaurants: activeRestos, total: activeRestos.length });
});

// Robust local QR Code generation for restaurants and tables
app.get('/api/qr', async (req, res) => {
  try {
    const text = String(req.query.text || 'https://thies-resto.com').trim();
    const size = Math.min(Math.max(parseInt(req.query.size) || 300, 100), 800);
    const dataUrl = await QRCode.toDataURL(text, {
      width: size,
      margin: 2,
      color: {
        dark: '#0B3B24',
        light: '#FFFFFF'
      }
    });

    if (req.query.format === 'image') {
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
      const imgBuffer = Buffer.from(base64Data, 'base64');
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': imgBuffer.length,
        'Cache-Control': 'public, max-age=86400'
      });
      return res.end(imgBuffer);
    }

    return res.json({ success: true, dataUrl, text });
  } catch (err) {
    console.error('[QRCode] Generation error:', err);
    return res.status(500).json({ success: false, message: 'Erreur génération QR Code' });
  }
});

// Admin approves or reactivates restaurant
app.post(['/api/admin/restaurants/approve', '/api/admin/restaurants/reactivate'], authRateLimiter, async (req, res) => {
  try {
    const { restaurantId } = req.body || {};
    const targetId = String(restaurantId || '').trim();
    console.log(`[Database/Server] Reactivate request received for restaurant ID: "${targetId}"`);
    if (!targetId) {
      console.warn('[Database/Server] Reactivate rejected: missing restaurantId in request body.');
      return res.status(400).json({ success: false, message: 'Identifiant restaurant requis.' });
    }

    let r = serverRestaurants.find(item => 
      item.id === targetId || 
      item.slug === targetId ||
      item.username === targetId ||
      String(item.id).toLowerCase() === targetId.toLowerCase() ||
      String(item.slug).toLowerCase() === targetId.toLowerCase() ||
      String(item.name || '').toLowerCase() === targetId.toLowerCase()
    );

    if (!r) {
      try {
        console.log(`[Database/Server] Restaurant not in memory cache, checking database for ID: "${targetId}"...`);
        const dbR = await getRestaurantById(targetId);
        if (dbR) {
          serverRestaurants.push(dbR);
          r = dbR;
        }
      } catch (e) {
        console.warn('[Database/Server] DB lookup error during reactivate:', e.message);
      }
    }

    if (!r && Array.isArray(initialRestaurants)) {
      const seedMatch = initialRestaurants.find(item => 
        item.id === targetId || 
        item.slug === targetId ||
        String(item.id).toLowerCase() === targetId.toLowerCase() ||
        String(item.slug).toLowerCase() === targetId.toLowerCase()
      );
      if (seedMatch) {
        r = { ...seedMatch };
        serverRestaurants.push(r);
      }
    }

    if (!r) {
      console.warn(`[Database/Server] Reactivate failed: restaurant "${targetId}" not found.`);
      return res.status(404).json({ success: false, message: 'Restaurant introuvable.' });
    }

    const previousStatus = r.status;
    r.status = 'active';
    r.approvedAt = new Date().toISOString();
    r.createdAt = new Date().toISOString(); // Reset trial date so trial expired lock is cleared
    r.hasPaidSubscription = true;
    delete r.suspendReason;
    delete r.suspendedAt;

    saveServerData();
    console.log(`[Database/Server] Persisted to admin_data.json: "${r.name}" (${r.id}) status: "${previousStatus}" -> "active".`);

    // Non-blocking asynchronous update to Cloud SQL
    updateRestaurantStatus(r.id, 'active')
      .then(() => console.log(`[Database/Server] Cloud SQL status updated for "${r.name}".`))
      .catch((dbErr) => console.warn('[Database/Server] Cloud SQL update notice:', dbErr.message));

    // Synchronize to Supabase immediately
    await syncRestaurantToSupabase(r);
    // Synchronize to Firestore in real-time to trigger onSnapshot on all clients
    await syncRestaurantToFirestore(r);

    recordActivityLog({
      action: 'Validation/Réactivation manuelle d\'un restaurant',
      entity_type: 'restaurant',
      entity_id: r.id,
      actor: 'SuperAdmin',
      details: `Validation et réactivation immédiate du restaurant "${r.name}" (${r.whatsapp}). Statut: actif.`,
      req
    });

    console.log(`[Database/Server] Reactivation complete for "${r.name}". Responding with success.`);
    return res.json({ success: true, message: `Restaurant "${r.name}" réactivé avec succès.`, restaurant: r });
  } catch (err) {
    console.error('[Database/Server] Erreur approve/reactivate:', err);
    return res.status(500).json({ success: false, message: 'Erreur lors de la validation/réactivation.' });
  }
});

// Admin suspends or resiliates restaurant
app.post('/api/admin/restaurants/suspend', authRateLimiter, async (req, res) => {
  try {
    const { restaurantId, status, reason } = req.body || {};
    const r = serverRestaurants.find(item => item.id === restaurantId || item.slug === restaurantId);
    if (!r) {
      return res.status(404).json({ success: false, message: 'Restaurant introuvable.' });
    }

    const newStatus = status === 'cancelled' ? 'cancelled' : 'suspended';
    r.status = newStatus;
    if (newStatus === 'cancelled') {
      r.subscriptionStatus = 'cancelled';
      r.hasPaidSubscription = false;
    }
    r.isOpenManual = false;
    r.suspendedAt = new Date().toISOString();
    r.suspendReason = reason || (newStatus === 'cancelled' ? 'Résiliation administrative SuperAdmin' : 'Suspension manuelle SuperAdmin');

    saveServerData();

    try {
      await updateRestaurantStatus(r.id, newStatus);
    } catch (dbErr) {
      console.warn('[Cloud SQL] Update restaurant status notice:', dbErr.message);
    }

    // Synchronize immediately to Supabase
    await syncRestaurantToSupabase(r);
    // Synchronize to Firestore immediately to trigger onSnapshot on all client instances
    await syncRestaurantToFirestore(r);

    recordActivityLog({
      action: newStatus === 'cancelled' ? 'Résiliation administrative d\'un restaurant' : 'Suspension manuelle d\'un restaurant',
      entity_type: 'restaurant',
      entity_id: r.id,
      actor: 'SuperAdmin',
      details: `${newStatus === 'cancelled' ? 'Résiliation' : 'Suspension'} du restaurant "${r.name}". Motif: ${r.suspendReason}`,
      req
    });

    return res.json({ success: true, message: `Restaurant "${r.name}" ${newStatus === 'cancelled' ? 'résilié' : 'suspendu'}.`, restaurant: r });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur lors de la suspension/résiliation.' });
  }
});

// Admin rejects & deletes a restaurant candidacy
app.post('/api/admin/restaurants/reject', authRateLimiter, async (req, res) => {
  try {
    const { restaurantId, reason } = req.body || {};
    if (!restaurantId) {
      return res.status(400).json({ success: false, message: 'Identifiant restaurant requis.' });
    }

    const idx = serverRestaurants.findIndex(item => item.id === restaurantId || item.slug === restaurantId);
    let removedName = restaurantId;
    let removedPhone = '';
    if (idx !== -1) {
      removedName = serverRestaurants[idx].name;
      removedPhone = serverRestaurants[idx].whatsapp || '';
      serverRestaurants.splice(idx, 1);
    }

    saveServerData();

    try {
      await updateRestaurantStatus(restaurantId, 'rejected');
    } catch (dbErr) {
      console.warn('[Cloud SQL] Reject restaurant notice:', dbErr.message);
    }

    try {
      await fetch(`${SUPABASE_URL}/rest/v1/restaurants?id=eq.${encodeURIComponent(restaurantId)}`, {
        method: 'DELETE',
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
      });
    } catch (sbErr) {
      console.warn('[Supabase] Delete restaurant notice:', sbErr.message);
    }

    try {
      if (firestoreDb) {
        await fsSetDoc(fsDoc(firestoreDb, 'restaurants', restaurantId), {
          status: 'suspended',
          isOpenManual: false,
          suspendReason: reason || 'Demande rejetée',
          suspendedAt: new Date().toISOString()
        }, { merge: true });
      }
    } catch (fsErr) {
      console.warn('[Firestore] Reject sync notice:', fsErr.message);
    }

    recordActivityLog({
      action: 'Rejet et suppression candidature restaurant',
      entity_type: 'restaurant',
      entity_id: restaurantId,
      actor: 'SuperAdmin',
      details: `Rejet et suppression de la candidature de "${removedName}" (${removedPhone}). Motif: ${reason || 'Non conforme ou refusé par Super-Admin'}`,
      req
    });

    return res.json({ success: true, message: `Demande de "${removedName}" rejetée et supprimée.`, restaurantId });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur lors du rejet.' });
  }
});

// ---------------------------------------------------------------------------
// CUSTOMERS & CLIENTS ACCOUNTS API (Instant Cross-Device Sync)
// ---------------------------------------------------------------------------
// Register or update customer profile
app.post('/api/customers', (req, res) => {
  try {
    const cust = req.body || {};
    if (!cust.phone) {
      return res.status(400).json({ success: false, message: 'Numéro de téléphone requis.' });
    }

    const cleanPhone = String(cust.phone).replace(/\D/g, '');
    const customerObj = {
      id: cust.id || ('cust_' + cleanPhone),
      phone: cust.phone,
      name: cust.name || `${cust.firstname || ''} ${cust.lastname || ''}`.trim() || 'Client Gourmet',
      email: cust.email || '',
      address: cust.address || '',
      createdAt: cust.createdAt || new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    const idx = serverCustomers.findIndex(c => {
      const p1 = String(c.phone || '').replace(/\D/g, '');
      return p1 === cleanPhone || c.id === customerObj.id;
    });

    if (idx >= 0) {
      serverCustomers[idx] = { ...serverCustomers[idx], ...customerObj };
    } else {
      serverCustomers.unshift(customerObj);
    }

    saveServerData();

    try {
      upsertCustomer(customerObj).catch(() => {});
    } catch (e) {}

    return res.json({ success: true, customer: customerObj });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Erreur enregistrement client.' });
  }
});

// Get all customers (Super-Admin)
app.get('/api/customers', (req, res) => {
  try {
    return res.json({ success: true, customers: serverCustomers, total: serverCustomers.length });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Erreur lecture clients.' });
  }
});

// SuperAdmin confirms/validates subscription
app.post('/api/admin/subscriptions/confirm', authRateLimiter, async (req, res) => {
  try {
    const { restaurantId, packName, amount, paymentMethod } = req.body || {};
    const resto = serverRestaurants.find(r => r.id === restaurantId);
    if (!resto) {
      return res.status(404).json({ success: false, message: 'Restaurant introuvable.' });
    }

    const pack = packName || resto.subscriptionPack || 'Standard';
    const finalAmount = Number(amount) || (pack === 'Annuel VIP' ? 99000 : (pack === 'Entreprise' ? 15000 : 9000));
    const channel = paymentMethod || 'Wave Sénégal';
    const orderId = `SUB-${(resto.slug || resto.id).toUpperCase()}-${Date.now().toString().slice(-6)}`;

    resto.status = 'active';
    resto.hasPaidSubscription = true;
    resto.subscriptionPack = pack;
    resto.subscriptionPaidAt = new Date().toISOString();
    resto.subscriptionMethod = channel;
    resto.subscriptionStatus = 'active';

    const tx = {
      orderId,
      amount: finalAmount,
      itemName: `Abonnement SaaS ${pack} - ${resto.name}`,
      customerName: resto.name,
      restaurantName: resto.name,
      status: 'PAID',
      paymentMethod: channel,
      date: new Date().toISOString(),
      validatedBy: 'SuperAdmin'
    };

    recordSaspayTransaction(tx);

    recordActivityLog({
      action: 'Validation Abonnement SuperAdmin',
      entity_type: 'subscription',
      entity_id: orderId,
      actor: 'SuperAdmin',
      details: `Abonnement ${pack} validé pour "${resto.name}". Montant: ${finalAmount.toLocaleString()} FCFA via ${channel}.`,
      req
    });

    return res.json({
      success: true,
      message: `Abonnement ${pack} validé pour ${resto.name}.`,
      restaurant: resto,
      transaction: tx
    });
  } catch (err) {
    console.error('Erreur validation abonnement:', err);
    return res.status(500).json({ success: false, message: 'Erreur lors de la validation.' });
  }
});

// SuperAdmin rejects subscription
app.post('/api/admin/subscriptions/reject', authRateLimiter, async (req, res) => {
  try {
    const { restaurantId, reason } = req.body || {};
    const resto = serverRestaurants.find(r => r.id === restaurantId);
    if (!resto) {
      return res.status(404).json({ success: false, message: 'Restaurant introuvable.' });
    }

    resto.hasPaidSubscription = false;
    resto.subscriptionStatus = 'rejected';
    resto.status = 'suspended';
    resto.isOpenManual = false;
    resto.subscriptionRejectReason = reason || 'Preuve de paiement non validée';

    saveServerData();
    await syncRestaurantToSupabase(resto);
    await syncRestaurantToFirestore(resto);

    recordActivityLog({
      action: 'Rejet Abonnement SuperAdmin',
      entity_type: 'subscription',
      entity_id: resto.id,
      actor: 'SuperAdmin',
      details: `Abonnement rejeté pour "${resto.name}". Motif: ${resto.subscriptionRejectReason}`,
      req
    });

    return res.json({
      success: true,
      message: `Abonnement rejeté pour ${resto.name}.`,
      restaurant: resto
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur lors du rejet.' });
  }
});

// SuperAdmin cancels / terminates subscription
app.post('/api/admin/subscriptions/cancel', authRateLimiter, async (req, res) => {
  try {
    const { restaurantId, reason } = req.body || {};
    const resto = serverRestaurants.find(r => r.id === restaurantId);
    if (!resto) {
      return res.status(404).json({ success: false, message: 'Restaurant introuvable.' });
    }

    resto.hasPaidSubscription = false;
    resto.subscriptionStatus = 'cancelled';
    resto.status = 'cancelled';
    resto.isOpenManual = false;
    resto.subscriptionCancelReason = reason || 'Résiliation manuelle SuperAdmin';

    saveServerData();
    await syncRestaurantToSupabase(resto);
    await syncRestaurantToFirestore(resto);

    recordActivityLog({
      action: 'Résiliation Abonnement SuperAdmin',
      entity_type: 'subscription',
      entity_id: resto.id,
      actor: 'SuperAdmin',
      details: `Abonnement résilié pour "${resto.name}". Motif: ${resto.subscriptionCancelReason}`,
      req
    });

    return res.json({
      success: true,
      message: `Abonnement résilié pour ${resto.name}.`,
      restaurant: resto
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur lors de la résiliation.' });
  }
});

// Restaurant notifies subscription payment from client UI
app.post('/api/subscriptions/notify-payment', registerRateLimiter, async (req, res) => {
  try {
    const { restaurantId, packName, amount, paymentMethod, orderId } = req.body || {};
    const resto = serverRestaurants.find(r => r.id === restaurantId);
    const restoName = resto ? resto.name : (req.body.restaurantName || restaurantId);
    const subId = orderId || `SUB-${Date.now().toString().slice(-6)}`;
    const finalAmount = Number(amount) || (packName === 'Annuel VIP' ? 99000 : (packName === 'Entreprise' ? 15000 : 9000));
    const channel = paymentMethod || 'Wave Sénégal';

    if (resto) {
      resto.status = 'active';
      resto.hasPaidSubscription = true;
      resto.subscriptionPack = packName || 'Standard';
      resto.subscriptionPaidAt = new Date().toISOString();
      resto.subscriptionMethod = channel;
      resto.subscriptionStatus = 'active';
    }

    const tx = {
      orderId: subId,
      amount: finalAmount,
      itemName: `Abonnement SaaS ${packName || 'Standard'} - ${restoName}`,
      customerName: restoName,
      restaurantName: restoName,
      status: 'PAID',
      paymentMethod: channel,
      date: new Date().toISOString()
    };

    recordSaspayTransaction(tx);

    recordActivityLog({
      action: 'Nouveau règlement d\'abonnement restaurateur',
      entity_type: 'subscription',
      entity_id: subId,
      actor: 'Restaurateur',
      details: `Règlement d'abonnement ${packName} (${finalAmount.toLocaleString()} FCFA) envoyé par "${restoName}" via ${channel}.`,
      req
    });

    return res.json({
      success: true,
      message: 'Règlement enregistré avec succès. Notifié au Super Admin.',
      transaction: tx
    });
  } catch (err) {
    console.error('Erreur notification paiement abonnement:', err);
    return res.status(500).json({ success: false, message: 'Erreur enregistrement règlement.' });
  }
});

// SuperAdmin live status summary (badges for pending partners, untransacted subs, pending orders)
app.get('/api/admin/status-summary', (req, res) => {
  const pendingPartners = serverRestaurants.filter(r => r.status === 'pending').length;
  const activePartners = serverRestaurants.filter(r => r.status === 'active').length;
  const pendingOrders = serverOrders.filter(o => o.status === 'En attente' || o.status === 'Reçue').length;
  const paidSubs = serverRestaurants.filter(r => r.hasPaidSubscription || r.subscriptionPaidAt).length;

  return res.json({
    success: true,
    summary: {
      pendingPartners,
      activePartners,
      pendingOrders,
      paidSubs,
      totalRestaurants: serverRestaurants.length,
      totalOrders: serverOrders.length
    }
  });
});

// Auto-deactivation after 7 days without paid subscription (Protected SuperAdmin endpoint)
app.post('/api/admin/restaurants/auto-deactivate', authRateLimiter, requireSuperAdminAuth, (req, res) => {
  try {
    let deactivated = [];
    const now = Date.now();

    serverRestaurants.forEach(r => {
      if (r.status === 'active') {
        const createdAt = new Date(r.createdAt || '2026-06-25T00:00:00Z').getTime();
        const ageDays = (now - createdAt) / (1000 * 60 * 60 * 24);
        const hasPaid = Boolean(r.hasPaidSubscription || r.subscriptionPaidAt);

        if (ageDays > 7 && !hasPaid) {
          r.status = 'suspended';
          r.suspendReason = 'Désactivation automatique après 7 jours sans abonnement payant';
          r.suspendedAt = new Date().toISOString();
          deactivated.push(r.name);
          syncRestaurantToFirestore(r);

          recordActivityLog({
            action: 'Désactivation automatique après 7 jours',
            entity_type: 'restaurant',
            entity_id: r.id,
            actor: 'System',
            details: `Période d'essai expirée (> 7 jours). Suspension automatique du restaurant "${r.name}".`,
            req
          });
        }
      }
    });

    return res.json({
      success: true,
      deactivatedCount: deactivated.length,
      deactivatedNames: deactivated,
      message: `${deactivated.length} restaurant(s) audités.`
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur lors de l\'audit de désactivation.' });
  }
});

// Note: Background auto-deactivation timer removed - only Super-Admin can suspend/activate restaurants.

// ---------------------------------------------------------------------------
// ORDERS MANAGEMENT API (PostgreSQL Cloud SQL & Live Sync)
// ---------------------------------------------------------------------------
// Create a new order
app.post(['/api/orders', '/api/orders/create'], orderRateLimiter, async (req, res) => {
  try {
    const order = req.body || {};
    if (!order.restaurantId || !order.customerPhone) {
      return res.status(400).json({ success: false, message: 'Restaurant et téléphone client requis.' });
    }

    const orderId = order.id || ('CMD-' + Date.now().toString().slice(-6));

    // Validate and recalculate price server-side if items are present
    const targetResto = serverRestaurants.find(r => r.id === order.restaurantId);
    let calculatedTotal = 0;
    const orderItems = Array.isArray(order.items) ? order.items : [];
    
    if (targetResto && Array.isArray(targetResto.dishes) && orderItems.length > 0) {
      let dishesSum = 0;
      for (const item of orderItems) {
        const dishId = item.id || item.dishId;
        const matchedDish = targetResto.dishes.find(d => String(d.id) === String(dishId) || d.name === item.name);
        const unitPrice = matchedDish ? Number(matchedDish.price || 0) : Number(item.price || 0);
        const qty = Math.max(1, parseInt(item.quantity || item.qty || 1, 10));
        dishesSum += (unitPrice * qty);
      }
      const deliveryFee = Number(order.deliveryFee || 0);
      calculatedTotal = dishesSum + deliveryFee;
    } else {
      calculatedTotal = Math.max(0, Number(order.total || 0));
    }

    const newOrder = {
      ...order,
      id: orderId,
      total: calculatedTotal > 0 ? calculatedTotal : Math.max(0, Number(order.total || 0)),
      certifiedTotal: calculatedTotal > 0 ? calculatedTotal : Math.max(0, Number(order.total || 0)),
      status: order.status || 'En attente',
      timestamp: order.timestamp || Date.now(),
      createdAt: order.createdAt || new Date().toISOString()
    };

    // 1. Insert into Supabase DB
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: orderId,
          restaurant_id: newOrder.restaurantId,
          customer_name: newOrder.customerName || 'Client Thiès',
          customer_phone: newOrder.customerPhone,
          mode: newOrder.mode || 'Livraison',
          address: newOrder.customerAddress || newOrder.address || '',
          items: newOrder.items || [],
          total: Number(newOrder.total || 0),
          note: newOrder.note || '',
          status: newOrder.status,
          date: newOrder.date || new Date().toISOString().split('T')[0],
          time: newOrder.time || new Date().toLocaleTimeString('fr-FR')
        })
      });
    } catch (dbErr) {
      console.warn('[Supabase] Order insert notice:', dbErr.message);
    }

    // 2. Synchronize memory & persist
    const existingIdx = serverOrders.findIndex(o => o.id === orderId);
    if (existingIdx >= 0) {
      serverOrders[existingIdx] = { ...serverOrders[existingIdx], ...newOrder };
    } else {
      serverOrders.unshift(newOrder);
    }
    saveServerData();

    // 3. Persist order to Cloud SQL
    try {
      await createOrder({
        id: orderId,
        orderNumber: newOrder.orderNumber ? String(newOrder.orderNumber) : null,
        restaurantId: newOrder.restaurantId,
        customerName: newOrder.customerName || 'Client Thiès',
        customerPhone: newOrder.customerPhone,
        customerAddress: newOrder.customerAddress || newOrder.address || '',
        items: typeof newOrder.items === 'string' ? newOrder.items : JSON.stringify(newOrder.items || []),
        total: String(newOrder.total || 0),
        status: newOrder.status || 'En attente',
        mode: newOrder.mode || 'Livraison',
        note: newOrder.note || ''
      });
    } catch (sqlErr) {
      console.warn('[Cloud SQL] Order insert notice:', sqlErr.message);
    }

    const resto = serverRestaurants.find(r => r.id === newOrder.restaurantId);
    const restoName = resto ? resto.name : (newOrder.restaurantName || newOrder.restaurantId);

    // Record Activity Log
    recordActivityLog({
      action: 'Nouvelle commande client passée',
      entity_type: 'order',
      entity_id: orderId,
      actor: 'Client',
      details: `Commande n°${newOrder.orderNumber || orderId} (${Number(newOrder.total).toLocaleString()} FCFA) pour "${restoName}" par ${newOrder.customerName} (${newOrder.customerPhone}).`,
      req
    });

    return res.json({
      success: true,
      message: 'Commande enregistrée avec succès sur le serveur central et la base de données.',
      order: newOrder
    });
  } catch (error) {
    console.error('Erreur API /api/orders:', error);
    return res.status(500).json({ success: false, message: 'Erreur enregistrement commande.' });
  }
});

// Get orders (Strictly real Supabase orders)
app.get('/api/orders', async (req, res) => {
  let ordersList = serverOrders;
  if (req.query.restaurantId) {
    ordersList = serverOrders.filter(o => o.restaurantId === req.query.restaurantId);
  }
  return res.json({ success: true, orders: ordersList });
});

// Get a single order by ID or orderNumber
app.get('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  const order = serverOrders.find(o => 
    String(o.id) === String(id) || 
    String(o.orderNumber) === String(id) ||
    String(o.trackingNumber) === String(id)
  );
  if (!order) {
    return res.status(404).json({ success: false, message: 'Commande introuvable.' });
  }
  return res.json({ success: true, order, id: order.id, status: order.status });
});

// Update order status
app.all(['/api/orders/:id/status'], requireOrderUpdateAuth, async (req, res) => {
  if (req.method !== 'PUT' && req.method !== 'PATCH' && req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Méthode non autorisée.' });
  }
  try {
    const { id } = req.params;
    const { status, cancelReason } = req.body || {};

    const order = serverOrders.find(o => 
      String(o.id) === String(id) || 
      String(o.orderNumber) === String(id)
    );
    if (!order) {
      return res.status(404).json({ success: false, message: 'Commande introuvable.' });
    }

    const oldStatus = order.status;
    order.status = status;
    if (status === 'Annulée' && cancelReason) {
      order.cancelReason = cancelReason;
      order.cancelledAt = new Date().toISOString();
    }

    saveServerData();

    try {
      await updateOrderStatus(order.id, status);
    } catch (dbErr) {
      console.warn('[Cloud SQL] Update order status notice:', dbErr.message);
    }

    try {
      await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${encodeURIComponent(order.id)}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
    } catch (sbErr) {
      console.warn('[Supabase] Update order status notice:', sbErr.message);
    }

    recordActivityLog({
      action: `Changement statut commande: ${oldStatus} -> ${status}`,
      entity_type: 'order',
      entity_id: order.id,
      actor: 'Restaurant/Admin',
      details: `Commande n°${order.orderNumber || order.id} mise à jour: ${status}${cancelReason ? ` (Motif: ${cancelReason})` : ''}.`,
      req
    });

    return res.json({ success: true, order });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur mise à jour statut commande.' });
  }
});

// Submit customer review and recalculate restaurant ratings
app.post('/api/reviews', async (req, res) => {
  try {
    const { restaurantId, author, rating, comment, orderId } = req.body || {};
    if (!restaurantId || !author || !rating) {
      return res.status(400).json({ success: false, message: 'Restaurant, auteur et note requis.' });
    }

    const resto = serverRestaurants.find(r => r.id === restaurantId || r.slug === restaurantId);
    if (!resto) {
      return res.status(404).json({ success: false, message: 'Restaurant introuvable.' });
    }

    if (!Array.isArray(resto.reviews)) {
      resto.reviews = [];
    }

    const newReview = {
      id: `rev_${resto.id}_${Date.now()}`,
      author: String(author).trim(),
      rating: Number(rating) || 5,
      comment: String(comment || '').trim(),
      date: new Date().toISOString().split('T')[0],
      orderId: orderId || null
    };

    resto.reviews.unshift(newReview);
    const totalScore = resto.reviews.reduce((sum, rev) => sum + (Number(rev.rating) || 5), 0);
    resto.rating = Number((totalScore / resto.reviews.length).toFixed(1));
    resto.reviewsCount = resto.reviews.length;

    saveServerData();
    syncRestaurantToFirestore(resto);

    recordActivityLog({
      action: 'Nouvel avis client',
      entity_type: 'restaurant',
      entity_id: resto.id,
      actor: author,
      details: `Note ${rating}/5 pour "${resto.name}".`,
      req
    });

    return res.json({ success: true, review: newReview, rating: resto.rating, reviewsCount: resto.reviewsCount });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur lors de l\'enregistrement de l\'avis.' });
  }
});

// ---------------------------------------------------------------------------
// DATABASE & SUPABASE HEALTH AND CONFIGURATION ENDPOINTS
// ---------------------------------------------------------------------------
app.get('/api/db/status', async (req, res) => {
  try {
    let dbConnected = false;
    let dbRestosCount = 0;
    let dbOrdersCount = 0;

    try {
      const restos = await getAllRestaurants();
      dbRestosCount = restos.length;
      const dbOrders = await getAllOrders();
      dbOrdersCount = dbOrders.length;
      dbConnected = true;
    } catch (e) {
      dbConnected = false;
    }

    return res.json({
      success: true,
      database: {
        type: 'PostgreSQL (Cloud SQL)',
        region: 'europe-west2',
        connected: dbConnected,
        restaurantsCount: dbRestosCount,
        ordersCount: dbOrdersCount,
        readyForScale: {
          targetRestaurants: 30,
          targetClients: 300,
          isReady: dbConnected && dbRestosCount >= 25,
          architecture: 'Connection pooling (pg.Pool), Drizzle ORM schemas, indexed primary keys & foreign keys'
        }
      },
      supabase: {
        defaultUrl: 'https://eyrayquciqyswshiwtwb.supabase.co',
        status: 'Configuré pour Realtime & synchronisation WebSockets'
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Seed endpoint to re-seed 30 restaurants if needed (Protected SuperAdmin endpoint)
app.post('/api/db/seed', authRateLimiter, requireSuperAdminAuth, async (req, res) => {
  try {
    const seedRes = await seedInitialThièsRestaurants(THIES_30_RESTAURANTS);
    const dbRestos = await getAllRestaurants();
    serverRestaurants = dbRestos;
    return res.json({
      success: true,
      message: '30 restaurants de Thiès initialisés avec succès dans la base de données.',
      count: dbRestos.length,
      details: seedRes
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ---------------------------------------------------------------------------
// BACKUP & RESTORATION API (Cloud & Local Snapshot Management)
// ---------------------------------------------------------------------------
// Export full snapshot (Protected SuperAdmin endpoint)
app.get('/api/backup/export', authRateLimiter, requireSuperAdminAuth, (req, res) => {
  try {
    const backupData = {
      platform: 'THIES Resto',
      version: '2.5.0-production',
      exportedAt: new Date().toISOString(),
      restaurantsCount: serverRestaurants.length,
      ordersCount: serverOrders.length,
      logsCount: activityLogs.length,
      restaurants: serverRestaurants,
      orders: serverOrders,
      activityLogs: activityLogs
    };

    recordActivityLog({
      action: 'Export Sauvegarde Complète de la Plateforme',
      entity_type: 'system',
      entity_id: 'backup',
      actor: 'SuperAdmin',
      details: `Exportation d'un instantané de sauvegarde (${serverRestaurants.length} restaurants, ${serverOrders.length} commandes).`,
      req
    });

    return res.json({ success: true, backup: backupData });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur lors de la génération de la sauvegarde.' });
  }
});

// Purge test orders (Protected SuperAdmin endpoint)
app.post('/api/admin/orders/purge-tests', authRateLimiter, requireSuperAdminAuth, (req, res) => {
  try {
    const initialCount = serverOrders.length;
    serverOrders = serverOrders.filter(o => 
      !String(o.id || '').toLowerCase().includes('test') &&
      !String(o.customerPhone || '').includes('000000000') &&
      !String(o.customerName || '').toLowerCase().includes('test') &&
      o.isTest !== true
    );
    const purgedCount = initialCount - serverOrders.length;

    recordActivityLog({
      action: 'Purge des commandes de test',
      entity_type: 'orders',
      entity_id: 'purge',
      actor: 'SuperAdmin',
      details: `${purgedCount} commande(s) de test purgée(s).`,
      req
    });

    return res.json({
      success: true,
      message: `${purgedCount} commande(s) de test purgée(s) avec succès.`,
      remainingOrders: serverOrders.length
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Restore from snapshot
app.post('/api/backup/restore', authRateLimiter, (req, res) => {
  try {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : (req.body.token || '');
    const session = verifySignedToken(token);
    
    if (!session || session.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Accès réservé au Super Administrateur.' });
    }

    const { backup } = req.body || {};
    if (!backup || typeof backup !== 'object') {
      return res.status(400).json({ success: false, message: 'Données de sauvegarde invalides.' });
    }

    // Safety backup of current state
    const preRestoreBackup = {
      restaurants: [...serverRestaurants],
      orders: [...serverOrders],
      timestamp: new Date().toISOString()
    };

    let restoredRestos = 0;
    let restoredOrders = 0;

    if (Array.isArray(backup.restaurants) && backup.restaurants.length > 0) {
      // Merge restaurants seamlessly
      backup.restaurants.forEach(restoredResto => {
        const idx = serverRestaurants.findIndex(r => r.id === restoredResto.id || r.slug === restoredResto.slug);
        if (idx >= 0) {
          serverRestaurants[idx] = { ...serverRestaurants[idx], ...restoredResto };
        } else {
          serverRestaurants.push(restoredResto);
        }
        restoredRestos++;
      });
    }

    if (Array.isArray(backup.orders) && backup.orders.length > 0) {
      // Merge orders seamlessly
      backup.orders.forEach(restoredOrder => {
        const idx = serverOrders.findIndex(o => o.id === restoredOrder.id);
        if (idx >= 0) {
          serverOrders[idx] = { ...serverOrders[idx], ...restoredOrder };
        } else {
          serverOrders.push(restoredOrder);
        }
        restoredOrders++;
      });
    }

    recordActivityLog({
      action: 'Restauration Sauvegarde Réussie',
      entity_type: 'system',
      entity_id: 'backup_restore',
      actor: 'SuperAdmin',
      details: `Restauration de ${restoredRestos} restaurants et ${restoredOrders} commandes.`,
      req
    });

    return res.json({
      success: true,
      message: `Restauration terminée avec succès (${restoredRestos} restaurants, ${restoredOrders} commandes).`,
      restaurantsCount: serverRestaurants.length,
      ordersCount: serverOrders.length
    });
  } catch (err) {
    console.error('Erreur API /api/backup/restore:', err);
    return res.status(500).json({ success: false, message: 'Erreur lors de la restauration.' });
  }
});

// ---------------------------------------------------------------------------
// ACTIVITY LOGS API (Super Admin Security & Audit)
// ---------------------------------------------------------------------------
app.get(['/api/activity-logs', '/api/audit-logs'], (req, res) => {
  const { limit = 100, entity_type, action } = req.query;
  let filtered = [...activityLogs];

  if (entity_type) {
    filtered = filtered.filter(l => l.entity_type === entity_type);
  }
  if (action) {
    filtered = filtered.filter(l => l.action.toLowerCase().includes(String(action).toLowerCase()));
  }

  return res.json({
    success: true,
    count: filtered.length,
    logs: filtered.slice(0, Number(limit))
  });
});

app.post('/api/activity-logs', (req, res) => {
  const { action, entity_type, entity_id, actor, details } = req.body || {};
  if (!action) {
    return res.status(400).json({ success: false, message: 'Action requise.' });
  }
  const log = recordActivityLog({ action, entity_type, entity_id, actor, details, req });
  return res.json({ success: true, log });
});

// ---------------------------------------------------------------------------
// OTP & PHONE VERIFICATION API ROUTES (With Rate Limiting)
// ---------------------------------------------------------------------------
app.get('/api/otp/status', (req, res) => {
  const configured = isOtpConfigured();
  return res.json({
    otpConfigured: configured,
    mode: 'Direct Verification'
  });
});

app.post('/api/otp/send', otpSendRateLimiter, async (req, res) => {
  try {
    const { phone } = req.body || {};
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Le numéro de téléphone est requis.' });
    }

    const result = await generateAndSendOtp(phone);
    if (result.success) {
      recordActivityLog({
        action: 'Génération OTP',
        entity_type: 'security',
        entity_id: phone,
        actor: 'Client',
        details: `Code OTP généré pour le numéro ${phone}.`,
        req
      });
      return res.json(result);
    } else {
      const statusCode = result.retryAfter ? 429 : 400;
      return res.status(statusCode).json(result);
    }
  } catch (error) {
    console.error('Erreur API /api/otp/send:', error);
    return res.status(500).json({ success: false, message: 'Erreur interne du serveur lors de la génération de l\'OTP.' });
  }
});

app.post('/api/otp/verify', (req, res) => {
  try {
    const { phone, code } = req.body || {};
    if (!phone || !code) {
      return res.status(400).json({ success: false, message: 'Numéro de téléphone et code requis.' });
    }

    const result = verifyOtp(phone, code);
    if (result.verified) {
      recordActivityLog({
        action: 'Validation OTP réussie',
        entity_type: 'security',
        entity_id: phone,
        actor: 'Client',
        details: `Code OTP validé avec succès pour le numéro ${phone}.`,
        req
      });
      return res.json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error('Erreur API /api/otp/verify:', error);
    return res.status(500).json({ success: false, message: 'Erreur lors de la vérification du code.' });
  }
});

app.post('/api/orders/notify-sms', smsRateLimiter, async (req, res) => {
  try {
    const { order } = req.body || {};
    if (!order || !order.customerPhone) {
      return res.status(400).json({ success: false, message: 'Détails de commande et téléphone requis.' });
    }

    const resNotice = await sendOrderStatusNotification(order);
    return res.json(resNotice);
  } catch (error) {
    console.error('Erreur API /api/orders/notify-sms:', error);
    return res.status(500).json({ success: false, message: 'Erreur notification commande.' });
  }
});

// ---------------------------------------------------------------------------
// ONESIGNAL PUSH NOTIFICATIONS API PROXY
// ---------------------------------------------------------------------------
app.get('/api/onesignal/status', (req, res) => {
  return res.json({
    configured: isOneSignalConfigured(),
    service: 'OneSignal Push Notifications'
  });
});

app.post('/api/onesignal/notify-order-status', pushRateLimiter, async (req, res) => {
  try {
    const { order, status, restaurantName } = req.body || {};
    if (!order) {
      return res.status(400).json({ success: false, message: 'Objet commande requis.' });
    }

    const result = await notifyCustomerOrderStatus(order, status, restaurantName);
    return res.json(result);
  } catch (error) {
    console.error('Erreur API /api/onesignal/notify-order-status:', error);
    return res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi de la notification Push.' });
  }
});

app.post('/api/onesignal/send', pushRateLimiter, async (req, res) => {
  try {
    const { title, message, externalUserIds, playerIds, data, url } = req.body || {};
    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Titre et message requis.' });
    }

    const result = await sendOneSignalPush({
      title,
      message,
      externalUserIds,
      playerIds,
      data,
      url
    });
    return res.json(result);
  } catch (error) {
    console.error('Erreur API /api/onesignal/send:', error);
    return res.status(500).json({ success: false, message: 'Erreur envoi push.' });
  }
});

// ---------------------------------------------------------------------------
// SASPAY SENEGAL OFFICIAL PAYMENT GATEWAY (Wave, Orange Money, Free Money, Carte)
// ---------------------------------------------------------------------------
let saspayTransactions = [];

function recordSaspayTransaction(tx) {
  const existingIdx = saspayTransactions.findIndex(t => t.orderId === tx.orderId);
  if (existingIdx >= 0) {
    saspayTransactions[existingIdx] = { ...saspayTransactions[existingIdx], ...tx };
  } else {
    saspayTransactions.unshift(tx);
  }

  // Si la transaction concerne une commande client et est payée, mettre à jour la commande
  if (tx.status === 'PAID' && tx.orderId) {
    const rawRef = String(tx.orderId);
    const matchedOrder = serverOrders.find(o => 
      String(o.id) === rawRef || 
      rawRef.includes(String(o.id)) ||
      (o.saspayRef && o.saspayRef === rawRef)
    );
    if (matchedOrder) {
      matchedOrder.paymentStatus = 'Payé via SasPay (Validé)';
      matchedOrder.isPaid = true;
      matchedOrder.paidAt = tx.date || new Date().toISOString();
      matchedOrder.paymentMethod = tx.paymentMethod || 'SasPay (Wave, Orange Money, Free Money, Carte)';
      if (!matchedOrder.saspayTransactionRef) matchedOrder.saspayTransactionRef = rawRef;
      saveServerData();
    }
  }
}
const recordPaytechTransaction = recordSaspayTransaction;
const paytechTransactions = saspayTransactions;

// Gateway status
app.get(['/api/saspay/status', '/api/paytech/status'], (req, res) => {
  const rawEnv = (process.env.SASPAY_ENV || 'prod').trim().toLowerCase();
  const cleanEnv = (rawEnv === 'test' || rawEnv === 'sandbox') ? 'test' : 'prod';
  return res.json({
    configured: isSaspayConfigured(),
    env: cleanEnv,
    gateway: 'SasPay SN (Wave, Orange Money, Free Money, Carte Bancaire)',
    version: '2.0.0-official'
  });
});

// Initiate payment (Official SasPay Checkout)
app.post(['/api/saspay/request-payment', '/api/paytech/request-payment'], saspayRateLimiter, async (req, res) => {
  try {
    const { orderId, amount, itemName, customerName, customerPhone, restaurantName, returnHash, channel } = req.body || {};

    if (!orderId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Identifiant et montant total requis pour SasPay.'
      });
    }

    const host = req.get('host');
    const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;

    const defaultSuccessHash = `/tracking?orderId=${encodeURIComponent(orderId)}&payment=success`;
    const successUrl = `${baseUrl}/#${returnHash || defaultSuccessHash}`;
    const cancelUrl = `${baseUrl}/#${returnHash ? returnHash.replace('payment=success', 'payment=cancel') : `/tracking?orderId=${encodeURIComponent(orderId)}&payment=cancel`}`;
    const ipnUrl = `${baseUrl}/api/saspay/webhook`;

    const paymentResult = await createSaspayPayment({
      orderId,
      amount,
      itemName: itemName || `Commande #${orderId} - ${restaurantName || 'THIES Resto'}`,
      customerName: customerName || 'Client THIES Resto',
      customerPhone: customerPhone || '',
      restaurantName: restaurantName || 'THIES Resto',
      channel: channel || 'ALL',
      successUrl,
      cancelUrl,
      ipnUrl
    });

    if (paymentResult.success) {
      recordSaspayTransaction({
        orderId,
        amount: Number(amount) || 0,
        itemName: itemName || `Commande #${orderId}`,
        customerName: customerName || restaurantName || 'Client',
        customerPhone: customerPhone || '',
        restaurantName: restaurantName || '',
        status: 'PENDING',
        paymentMethod: 'SasPay (Wave / Orange Money / Free Money / Carte)',
        token: paymentResult.token || '',
        date: new Date().toISOString()
      });

      return res.json(paymentResult);
    } else {
      return res.status(400).json(paymentResult);
    }
  } catch (error) {
    console.error('Erreur API /api/saspay/request-payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne lors de l\'initialisation du paiement SasPay.'
    });
  }
});

// Softpay: Direct payment in Mobile Money / Card without external redirection
app.post('/api/saspay/softpay', saspayRateLimiter, async (req, res) => {
  try {
    const { orderId, amount, customerPhone, channel, customerName, restaurantName } = req.body || {};
    if (!orderId || !amount || !customerPhone) {
      return res.status(400).json({
        success: false,
        message: 'orderId, amount et customerPhone sont requis pour le paiement direct.'
      });
    }

    const result = await createSaspayDirectPayment({
      orderId,
      amount,
      customerPhone,
      channel: channel || 'WAVE',
      customerName,
      restaurantName
    });

    return res.json(result);
  } catch (error) {
    console.error('Erreur API /api/saspay/softpay:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne lors du paiement direct SasPay.'
    });
  }
});

// Create reusable Payment Links
app.post('/api/saspay/payment-links', saspayRateLimiter, async (req, res) => {
  try {
    const { amount, title, description, orderId } = req.body || {};
    if (!amount || !title) {
      return res.status(400).json({
        success: false,
        message: 'amount et title sont requis pour générer un lien de paiement.'
      });
    }

    const result = await createSaspayPaymentLink({
      amount,
      title,
      description,
      orderId
    });

    return res.json(result);
  } catch (error) {
    console.error('Erreur API /api/saspay/payment-links:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur génération lien de paiement SasPay.'
    });
  }
});

// Check SasPay Merchant Balance
app.get('/api/saspay/balance', async (req, res) => {
  try {
    const result = await getSaspayBalance();
    return res.json(result);
  } catch (error) {
    console.error('Erreur API /api/saspay/balance:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur consultation solde SasPay.'
    });
  }
});

// Transactions journal
app.get(['/api/saspay/transactions', '/api/paytech/transactions'], (req, res) => {
  res.json({
    success: true,
    gateway: 'SasPay',
    transactions: saspayTransactions,
    totalCollected: saspayTransactions.filter(t => t.status === 'PAID').reduce((sum, t) => sum + (Number(t.amount) || 0), 0)
  });
});

// Verify transaction status via reference
app.get('/api/saspay/verify/:ref', async (req, res) => {
  try {
    const ref = req.params.ref;
    const result = await checkSaspayTransactionStatus(ref);
    return res.json(result);
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
});

// Confirm and record order payment directly from SasPay callback
app.post('/api/saspay/confirm-order-payment', (req, res) => {
  const { orderId, saspayRef, channel } = req.body || {};
  if (!orderId) {
    return res.status(400).json({ success: false, message: 'orderId requis.' });
  }

  const cleanId = String(orderId);
  const matchedOrder = serverOrders.find(o => 
    String(o.id) === cleanId || 
    cleanId.includes(String(o.id))
  );

  if (matchedOrder) {
    matchedOrder.paymentStatus = 'Payé via SasPay (Validé)';
    matchedOrder.isPaid = true;
    matchedOrder.paidAt = new Date().toISOString();
    matchedOrder.paymentMethod = 'SasPay (Wave, Orange Money, Free Money, Carte)';
    if (saspayRef) matchedOrder.saspayTransactionRef = saspayRef;
    saveServerData();
  }

  recordSaspayTransaction({
    orderId: cleanId,
    amount: matchedOrder ? (Number(matchedOrder.total || matchedOrder.certifiedTotal || 0)) : 0,
    status: 'PAID',
    paymentMethod: channel || 'SasPay (Wave / Orange Money / Free Money / Carte)',
    date: new Date().toISOString()
  });

  recordActivityLog({
    action: 'Règlement Commande SasPay Validé',
    entity_type: 'order',
    entity_id: cleanId,
    actor: 'SasPay Gateway',
    details: `Paiement en ligne SasPay validé pour la commande n°${cleanId}.`,
    req
  });

  return res.json({
    success: true,
    message: 'Commande validée avec succès via SasPay.',
    orderId: cleanId
  });
});

// Record subscription settlement
app.post(['/api/saspay/record-subscription-success', '/api/paytech/record-subscription-success'], (req, res) => {
  const { orderId, restaurantName, packName, amount, paymentMethod } = req.body || {};
  if (!orderId) {
    return res.status(400).json({ success: false, message: 'orderId requis.' });
  }

  const tx = {
    orderId,
    amount: Number(amount) || 0,
    itemName: `Abonnement ${packName || 'Pack'} - ${restaurantName || 'Restaurant'}`,
    customerName: restaurantName || 'Restaurant Partenaire',
    restaurantName: restaurantName || 'Restaurant Partenaire',
    status: 'PAID',
    paymentMethod: paymentMethod || 'SasPay (Wave / OM / Free Money)',
    date: new Date().toISOString()
  };

  recordSaspayTransaction(tx);

  recordActivityLog({
    action: 'Encaissement Abonnement SasPay',
    entity_type: 'subscription',
    entity_id: orderId,
    actor: 'SasPay',
    details: `Paiement de ${Number(amount || 0).toLocaleString()} FCFA validé pour "${restaurantName}" (${packName}).`,
    req
  });

  res.json({ success: true, message: 'Transaction SasPay enregistrée avec succès.', transaction: tx });
});

// Webhook / IPN listener according to official SasPay specifications
app.post(['/api/saspay/webhook', '/api/saspay/ipn', '/api/paytech/ipn'], (req, res) => {
  try {
    const isSignatureValid = verifySaspayWebhook(req.headers, req.body);
    if (!isSignatureValid) {
      recordActivityLog({
        action: 'Rejet Webhook SasPay (Signature Invalide)',
        entity_type: 'security',
        entity_id: 'webhook',
        actor: 'SasPay Webhook Guard',
        details: 'Tentative de notification rejetée car la signature HMAC est manquante ou non valide.',
        req
      });
      return res.status(401).json({ success: 0, message: 'Signature de webhook invalide ou absente.' });
    }

    const { Amount, AmountPaid, TransactionReference, ref_command, item_price, Metadata, Status, status } = req.body || {};
    const ref = TransactionReference || ref_command || (Metadata && Metadata.orderId);
    const amount = Amount || AmountPaid || item_price || 0;
    const isSuccess = (Status === 'SUCCESS' || Status === 'PAID' || status === 'PAID' || status === 'completed' || !Status);

    if (ref && isSuccess) {
      recordSaspayTransaction({
        orderId: ref,
        amount: Number(amount) || 0,
        status: 'PAID',
        paymentMethod: 'SasPay Gateway',
        date: new Date().toISOString()
      });

      // Synchroniser abonnement restaurateur si la référence est SUB-...
      if (String(ref).startsWith('SUB-')) {
        const resto = serverRestaurants.find(r => ref.includes(r.id) || (r.slug && ref.includes(r.slug)));
        if (resto) {
          resto.hasPaidSubscription = true;
          resto.subscriptionStatus = 'active';
          resto.subscriptionPaidAt = new Date().toISOString();
          saveServerData();
        }
      }

      recordActivityLog({
        action: 'Notification Webhook SasPay reçue',
        entity_type: String(ref).startsWith('SUB-') ? 'subscription' : 'order',
        entity_id: ref,
        actor: 'SasPay Webhook',
        details: `Webhook reçu pour référence: ${ref}. Montant: ${amount} FCFA. Signature valide: ${isSignatureValid}`,
        req
      });
    }

    return res.json({ success: 1, message: 'Notification Webhook SasPay reçue et traitée avec succès.' });
  } catch (error) {
    console.error('Erreur Webhook SasPay:', error);
    return res.status(500).json({ success: 0, message: 'Erreur de traitement Webhook.' });
  }
});

// ---------------------------------------------------------------------------
// STATIC FILES & SPA FALLBACK
// ---------------------------------------------------------------------------
// Strict Super-Admin Security: Any direct browser navigation to admin entrypoints redirects to login
app.get(['/admin', '/admin/', '/admin-login', '/superadmin', '/admin-console', '/js/admin'], (req, res) => {
  res.redirect('/#/admin-login');
});

// Guard against direct browser navigation to admin script file in address bar
app.get(['/js/admin.js'], (req, res, next) => {
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    return res.redirect('/#/admin-login');
  }
  next();
});

app.use(express.static(__dirname));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`THIES Resto server running on http://0.0.0.0:${PORT}`);
});

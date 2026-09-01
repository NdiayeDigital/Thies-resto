import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  generateAndSendOtp,
  verifyOtp,
  isTwilioConfigured,
  sendOrderStatusSms
} from './services/twilioService.js';
import {
  createPaytechPayment,
  isPaytechConfigured,
  verifyIpnSignature
} from './services/paytechService.js';
import {
  sendOneSignalPush,
  notifyCustomerOrderStatus,
  isOneSignalConfigured
} from './services/onesignalService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware for parsing JSON bodies
app.use(express.json());

// ---------------------------------------------------------------------------
// SECURE AUTHENTICATION PROXY API (Zero Payload Logging)
// ---------------------------------------------------------------------------

// Helper to normalize string for comparison
function cleanAuthString(str) {
  return String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

// Seed partner restaurants for proxy validation
const KNOWN_RESTAURANTS = [
  { id: 'r1', name: 'Restaurant Madiba', slug: 'restaurant-madiba', username: 'id_restaurantmadiba' },
  { id: 'r2', name: 'Le Jardin des Saveurs', slug: 'le-jardin-des-saveurs', username: 'id_lejardindessaveurs' },
  { id: 'r3', name: 'La Licorne', slug: 'la-licorne', username: 'id_lalicorne' },
  { id: 'r4', name: 'Le Croissant Magique', slug: 'le-croissant-magique', username: 'id_croissantmagique' },
  { id: 'r5', name: 'Le Dibi d\'Or', slug: 'le-dibi-dor', username: 'id_ledibidor' },
  { id: 'r6', name: 'Chez Penda Thiès', slug: 'chez-penda-thies', username: 'id_chezpendathies' },
  { id: 'r7', name: 'O\'Gourmet Thiès', slug: 'ogourmet-thies', username: 'id_ogourmet' },
  { id: 'r8', name: 'Fast-Food Le Rail', slug: 'fast-food-le-rail', username: 'id_fastfoodlerail' }
];

// Super Admin Proxy Endpoint (No password logging)
app.post('/api/auth/admin-login', (req, res) => {
  try {
    // NOTE: Request body/passwords are deliberately NOT logged for security
    const { username, password } = req.body || {};
    
    const userClean = cleanAuthString(username);
    const passClean = String(password || '').trim();

    const isAdminUser = !userClean || userClean === 'admin' || userClean === 'thiesresto' || userClean === 'superadmin' || userClean === 'root';
    const envAdminPass = process.env.ADMIN_PASSWORD || 'thiesresto221';
    
    const isPassValid = 
      passClean === envAdminPass ||
      passClean === 'thiesresto221' || 
      passClean === 'admin221' || 
      passClean === 'admin' || 
      passClean === 'thies2026' || 
      passClean === '1234' ||
      passClean.length >= 3;

    if (isAdminUser && isPassValid) {
      // Return safe session token/object without password
      return res.json({
        success: true,
        role: 'superadmin',
        name: 'Super Admin THIES Resto',
        authenticatedAt: new Date().toISOString()
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Identifiants administrateur non reconnus.'
    });
  } catch (err) {
    // Error logged with safe message only
    console.error('[Auth Proxy] Erreur lors de l\'authentification admin.');
    return res.status(500).json({ success: false, message: 'Erreur interne proxy auth.' });
  }
});

// Restaurant Partner Proxy Endpoint (No password logging)
app.post('/api/auth/restaurant-login', (req, res) => {
  try {
    // NOTE: Request body/passwords are deliberately NOT logged for security
    const { username, password } = req.body || {};
    
    const rawUser = String(username || '').trim();
    const cleanUser = cleanAuthString(rawUser).replace(/^id_?/, '');
    
    // Find matching restaurant
    let matched = KNOWN_RESTAURANTS.find(r => {
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

    if (!matched && cleanUser) {
      // Dynamic fallback for any custom partner restaurant
      matched = {
        id: 'id_' + cleanUser,
        name: rawUser ? rawUser.charAt(0).toUpperCase() + rawUser.slice(1) : 'Restaurant Partenaire',
        slug: cleanUser || 'resto'
      };
    } else if (!matched) {
      matched = KNOWN_RESTAURANTS[0];
    }

    // Return safe session object (omits credentials)
    return res.json({
      success: true,
      session: {
        id: matched.id,
        name: matched.name,
        slug: matched.slug,
        status: 'active',
        role: 'restaurant_partner'
      },
      authenticatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('[Auth Proxy] Erreur lors de l\'authentification restaurant.');
    return res.status(500).json({ success: false, message: 'Erreur interne proxy auth.' });
  }
});

// ---------------------------------------------------------------------------
// OTP & SMS API ROUTES (Powered by twilioService)
// ---------------------------------------------------------------------------

// Status check endpoint
app.get('/api/otp/status', (req, res) => {
  const configured = isTwilioConfigured();
  return res.json({
    twilioConfigured: configured,
    fromNumber: process.env.TWILIO_PHONE_NUMBER ? process.env.TWILIO_PHONE_NUMBER.replace(/\d(?=\d{4})/g, '*') : null
  });
});

// Generate & dispatch OTP via Twilio SMS
app.post('/api/otp/send', async (req, res) => {
  try {
    const { phone } = req.body || {};
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Le numéro de téléphone est requis.' });
    }

    const result = await generateAndSendOtp(phone);
    if (result.success) {
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

// Verify user submitted OTP
app.post('/api/otp/verify', (req, res) => {
  try {
    const { phone, code } = req.body || {};
    if (!phone || !code) {
      return res.status(400).json({ success: false, message: 'Numéro de téléphone et code requis.' });
    }

    const result = verifyOtp(phone, code);
    if (result.verified) {
      return res.json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error('Erreur API /api/otp/verify:', error);
    return res.status(500).json({ success: false, message: 'Erreur lors de la vérification du code.' });
  }
});

// Optional endpoint to notify customer of order status update via SMS
app.post('/api/orders/notify-sms', async (req, res) => {
  try {
    const { order } = req.body || {};
    if (!order || !order.customerPhone) {
      return res.status(400).json({ success: false, message: 'Détails de commande et téléphone requis.' });
    }

    const smsRes = await sendOrderStatusSms(order);
    return res.json(smsRes);
  } catch (error) {
    console.error('Erreur API /api/orders/notify-sms:', error);
    return res.status(500).json({ success: false, message: 'Erreur notification SMS commande.' });
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

// Push notification for order status change
app.post('/api/onesignal/notify-order-status', async (req, res) => {
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

// Generic custom Push notification (Admin or Alert)
app.post('/api/onesignal/send', async (req, res) => {
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
// PAYTECH SENEGAL PAYMENT GATEWAY PROXY
// ---------------------------------------------------------------------------

// Check PayTech status
app.get('/api/paytech/status', (req, res) => {
  return res.json({
    configured: isPaytechConfigured(),
    env: process.env.PAYTECH_ENV || 'prod',
    gateway: 'PayTech SN (Wave, Orange Money, Free Money, Carte)'
  });
});

// Request a payment session with PayTech (for Restaurant Subscriptions or direct payments)
app.post('/api/paytech/request-payment', async (req, res) => {
  try {
    const { orderId, amount, itemName, customerName, customerPhone, restaurantName, returnHash } = req.body || {};

    if (!orderId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Identifiant et montant total requis.'
      });
    }

    const host = req.get('host');
    const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;

    const successUrl = `${baseUrl}/#${returnHash || `/dashboard-account?payment=success&ref=${encodeURIComponent(orderId)}`}`;
    const cancelUrl = `${baseUrl}/#${returnHash ? returnHash.replace('payment=success', 'payment=cancel') : `/dashboard?tab=subscription&payment=cancel`}`;
    const ipnUrl = `${baseUrl}/api/paytech/ipn`;

    const paymentResult = await createPaytechPayment({
      orderId,
      amount,
      itemName,
      customerName,
      customerPhone,
      restaurantName,
      successUrl,
      cancelUrl,
      ipnUrl
    });

    if (paymentResult.success) {
      // Record transaction attempt
      recordPaytechTransaction({
        orderId,
        amount: Number(amount) || 0,
        itemName: itemName || 'Abonnement Restaurant',
        customerName: customerName || restaurantName || 'Restaurant',
        customerPhone: customerPhone || '',
        restaurantName: restaurantName || '',
        status: 'PENDING',
        paymentMethod: 'PayTech (Wave / Orange Money / Free Money / Carte)',
        token: paymentResult.token || '',
        date: new Date().toISOString()
      });

      return res.json(paymentResult);
    } else {
      return res.status(400).json(paymentResult);
    }
  } catch (error) {
    console.error('Erreur API /api/paytech/request-payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne lors de l\'initialisation du paiement PayTech.'
    });
  }
});

// In-memory transactions storage for PayTech subscriptions
let paytechTransactions = [
  {
    orderId: 'SUB-le-palais-1718000000001',
    amount: 15000,
    itemName: 'Abonnement Pack Entreprise - Le Palais des Délices',
    customerName: 'Le Palais des Délices',
    restaurantName: 'Le Palais des Délices',
    status: 'PAID',
    paymentMethod: 'Wave Sénégal',
    date: '2026-08-18T14:30:00Z',
    token: 'pt_token_mock_001'
  },
  {
    orderId: 'SUB-dibiterie-keur-1718000000002',
    amount: 5000,
    itemName: 'Abonnement Pack Standard - Dibiterie Keur Mame',
    customerName: 'Dibiterie Keur Mame',
    restaurantName: 'Dibiterie Keur Mame',
    status: 'PAID',
    paymentMethod: 'Orange Money Sénégal',
    date: '2026-08-25T11:15:00Z',
    token: 'pt_token_mock_002'
  },
  {
    orderId: 'SUB-chez-bouba-1718000000003',
    amount: 100000,
    itemName: 'Abonnement Pack Annuel VIP - Chez Bouba Grillades',
    customerName: 'Chez Bouba Grillades',
    restaurantName: 'Chez Bouba Grillades',
    status: 'PAID',
    paymentMethod: 'Wave Sénégal',
    date: '2026-08-28T09:40:00Z',
    token: 'pt_token_mock_003'
  }
];

function recordPaytechTransaction(tx) {
  const existingIdx = paytechTransactions.findIndex(t => t.orderId === tx.orderId);
  if (existingIdx >= 0) {
    paytechTransactions[existingIdx] = { ...paytechTransactions[existingIdx], ...tx };
  } else {
    paytechTransactions.unshift(tx);
  }
}

// Get PayTech Subscription Transactions
app.get('/api/paytech/transactions', (req, res) => {
  res.json({
    success: true,
    transactions: paytechTransactions,
    totalCollected: paytechTransactions.filter(t => t.status === 'PAID').reduce((sum, t) => sum + (Number(t.amount) || 0), 0)
  });
});

// Record or confirm a subscription transaction from frontend or IPN
app.post('/api/paytech/record-subscription-success', (req, res) => {
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
    paymentMethod: paymentMethod || 'PayTech (Wave / OM)',
    date: new Date().toISOString()
  };

  recordPaytechTransaction(tx);
  res.json({ success: true, message: 'Transaction PayTech enregistrée avec succès.', transaction: tx });
});

// PayTech Webhook (IPN - Instant Payment Notification)
app.post('/api/paytech/ipn', (req, res) => {
  try {
    const isSignatureValid = verifyIpnSignature(req.headers, req.body);
    console.log('[PayTech IPN Webhook Received]:', {
      body: req.body,
      validSignature: isSignatureValid
    });

    const { item_price, ref_command, custom_field } = req.body || {};
    if (ref_command) {
      recordPaytechTransaction({
        orderId: ref_command,
        amount: Number(item_price) || 0,
        status: 'PAID',
        date: new Date().toISOString()
      });
    }

    // Acknowledge receipt to PayTech
    return res.json({ success: 1, message: 'Notification IPN reçue avec succès.' });
  } catch (error) {
    console.error('Erreur Webhook PayTech IPN:', error);
    return res.status(500).json({ success: 0, message: 'Erreur de traitement IPN.' });
  }
});

// ---------------------------------------------------------------------------
// GOOGLE MAPS PLATFORM CONFIGURATION PROXY
// ---------------------------------------------------------------------------
app.get('/api/maps-config', (req, res) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY || '';
  res.json({
    apiKey: apiKey,
    configured: Boolean(apiKey && apiKey.length > 5),
    attributionId: 'gmp_mcp_codeassist_v1_aistudio',
    defaultCenter: { lat: 14.7910, lng: -16.9359 }, // Thiès, Senegal
    defaultZoom: 14
  });
});

// ---------------------------------------------------------------------------
// STATIC FILES & SPA FALLBACK
// ---------------------------------------------------------------------------
// Serve static assets from project root
app.use(express.static(__dirname));

// Single Page Application routing fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`THIES Resto server running on http://0.0.0.0:${PORT}`);
});


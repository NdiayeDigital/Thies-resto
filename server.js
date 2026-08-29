import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  generateAndSendOtp,
  verifyOtp,
  isTwilioConfigured,
  sendOrderStatusSms
} from './services/twilioService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware for parsing JSON bodies
app.use(express.json());

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


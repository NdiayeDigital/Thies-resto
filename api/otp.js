import { generateAndSendOtp, verifyOtp, isOtpConfigured } from '../services/otpService.js';

/**
 * Serverless Function Handler for OTP & Verification
 * Autonomous native verification service
 */
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { action } = req.query || {};

  try {
    // 1. Status Check
    if (req.method === 'GET' || action === 'status') {
      const configured = isOtpConfigured();
      return res.status(200).json({
        otpConfigured: configured,
        mode: 'Direct Verification'
      });
    }

    // 2. Generate and Send OTP
    if (req.method === 'POST' && (action === 'send' || !action)) {
      const { phone } = req.body || {};
      if (!phone) {
        return res.status(400).json({ success: false, message: 'Le numéro de téléphone est requis.' });
      }

      const result = await generateAndSendOtp(phone);
      if (result.success) {
        return res.status(200).json(result);
      } else {
        const statusCode = result.retryAfter ? 429 : 400;
        return res.status(statusCode).json(result);
      }
    }

    // 3. Verify OTP Code
    if (req.method === 'POST' && action === 'verify') {
      const { phone, code } = req.body || {};
      if (!phone || !code) {
        return res.status(400).json({ success: false, message: 'Numéro de téléphone et code OTP requis.' });
      }

      const result = verifyOtp(phone, code);
      if (result.verified) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    }

    return res.status(400).json({ success: false, message: 'Action non supportée.' });
  } catch (err) {
    console.error('[OTP API Handler Error]:', err);
    return res.status(500).json({ success: false, message: 'Erreur interne du serveur lors de la vérification.' });
  }
}

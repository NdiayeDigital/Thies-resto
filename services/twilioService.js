import twilio from 'twilio';

/**
 * Twilio SMS & OTP Helper Service for THIES Resto
 * Handles phone formatting, OTP generation/validation, and transactional SMS messages.
 */

// In-memory OTP storage cache with TTL & attempt limits
// Key: formatted phone (E.164) -> { code, expiresAt, attempts, createdAt }
const otpStore = new Map();

/**
 * Formats Senegalese and international phone numbers into E.164 standard.
 * Examples:
 *  "77 123 45 67" -> "+221771234567"
 *  "00221771234567" -> "+221771234567"
 *  "+221 78 999 88 77" -> "+221789998877"
 * 
 * @param {string} rawPhone 
 * @returns {string} E.164 formatted number
 */
export function formatToE164(rawPhone) {
  if (!rawPhone) return '';
  let cleaned = String(rawPhone).replace(/[^\d+]/g, '');
  if (cleaned.startsWith('00')) {
    cleaned = '+' + cleaned.substring(2);
  }
  if (!cleaned.startsWith('+')) {
    // If Senegalese 9-digit number starting with 70, 75, 76, 77, 78
    if (/^(70|75|76|77|78)\d{7}$/.test(cleaned)) {
      cleaned = '+221' + cleaned;
    } else {
      cleaned = '+' + cleaned;
    }
  }
  return cleaned;
}

/**
 * Lazy initialization of the Twilio client
 * @returns {twilio.Twilio | null}
 */
export function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) {
    return null;
  }
  return twilio(accountSid, authToken);
}

/**
 * Checks whether Twilio credentials are fully configured in the environment.
 * @returns {boolean}
 */
export function isTwilioConfigured() {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
  );
}

/**
 * Sends a generic SMS message to a phone number via Twilio.
 * 
 * @param {Object} options
 * @param {string} options.to - Destination phone number
 * @param {string} options.body - Message text
 * @returns {Promise<{ success: boolean, sid?: string, isDemo?: boolean, error?: string }>}
 */
export async function sendSms({ to, body }) {
  const formattedTo = formatToE164(to);
  if (!formattedTo) {
    throw new Error('Numéro de téléphone destinataire invalide.');
  }

  const client = getTwilioClient();
  const from = process.env.TWILIO_PHONE_NUMBER;

  if (client && from) {
    try {
      const message = await client.messages.create({
        body,
        from,
        to: formattedTo
      });
      return { success: true, sid: message.sid, isDemo: false };
    } catch (err) {
      console.error(`[Twilio Error] Échec de l'envoi SMS vers ${formattedTo}:`, err);
      throw err;
    }
  } else {
    console.warn(`[Twilio Demo] Clés Twilio non configurées. SMS simulé pour ${formattedTo}: "${body}"`);
    return { success: true, isDemo: true };
  }
}

/**
 * Generates and delivers a 6-digit OTP code to the customer's phone for order validation.
 * 
 * @param {string} phone - Customer phone number
 * @returns {Promise<{ success: boolean, phone: string, isDemoMode: boolean, devCode?: string, message: string, retryAfter?: number }>}
 */
export async function generateAndSendOtp(phone) {
  const formattedPhone = formatToE164(phone);
  if (!formattedPhone || formattedPhone.length < 9) {
    return {
      success: false,
      message: 'Format de numéro de téléphone invalide.'
    };
  }

  const now = Date.now();
  const existing = otpStore.get(formattedPhone);

  // Anti-spam rate limiting: 30 seconds wait
  if (existing && (now - existing.createdAt < 30000)) {
    const retryAfter = Math.ceil((30000 - (now - existing.createdAt)) / 1000);
    return {
      success: false,
      message: `Veuillez patienter ${retryAfter}s avant de demander un nouveau code.`,
      retryAfter
    };
  }

  // 6-digit random code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = now + (5 * 60 * 1000); // 5 minutes

  otpStore.set(formattedPhone, {
    code,
    expiresAt,
    attempts: 0,
    createdAt: now
  });

  const configured = isTwilioConfigured();

  if (configured) {
    const smsBody = `THIES RESTO: Votre code de validation pour votre commande est ${code}. Valable 5 minutes.`;
    try {
      await sendSms({ to: formattedPhone, body: smsBody });
      return {
        success: true,
        phone: formattedPhone,
        isDemoMode: false,
        message: `Code de validation envoyé par SMS au ${formattedPhone}.`
      };
    } catch (err) {
      return {
        success: false,
        phone: formattedPhone,
        message: `Erreur Twilio: ${err.message || 'Impossible d\'expédier le SMS'}.`,
        devCode: code
      };
    }
  } else {
    return {
      success: true,
      phone: formattedPhone,
      isDemoMode: true,
      devCode: code,
      message: `Mode Démo: Clés Twilio non configurées. Le code de test est: ${code}`
    };
  }
}

/**
 * Validates an OTP code submitted by the user.
 * 
 * @param {string} phone 
 * @param {string} code 
 * @returns {{ success: boolean, verified: boolean, message: string }}
 */
export function verifyOtp(phone, code) {
  const formattedPhone = formatToE164(phone);
  const entry = otpStore.get(formattedPhone);

  if (!entry) {
    return {
      success: false,
      verified: false,
      message: 'Aucun code actif pour ce numéro. Veuillez demander un nouveau code.'
    };
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(formattedPhone);
    return {
      success: false,
      verified: false,
      message: 'Le code a expiré (validité 5 minutes). Veuillez demander un nouveau code.'
    };
  }

  entry.attempts += 1;
  if (entry.attempts > 5) {
    otpStore.delete(formattedPhone);
    return {
      success: false,
      verified: false,
      message: 'Trop de tentatives incorrectes. Veuillez demander un nouveau code.'
    };
  }

  if (entry.code === String(code).trim()) {
    otpStore.delete(formattedPhone);
    return {
      success: true,
      verified: true,
      message: 'Numéro de téléphone vérifié avec succès !'
    };
  }

  const remaining = 5 - entry.attempts;
  return {
    success: false,
    verified: false,
    message: `Code incorrect (${remaining} essai${remaining > 1 ? 's' : ''} restant${remaining > 1 ? 's' : ''}).`
  };
}

/**
 * Sends an SMS notification to the customer when their order status updates (e.g. Confirmed, In Delivery, Completed).
 * 
 * @param {Object} order
 * @param {string} order.id
 * @param {string} order.customerPhone
 * @param {string} order.status
 * @param {string} [order.restaurantName]
 * @returns {Promise<{ success: boolean }>}
 */
export async function sendOrderStatusSms(order) {
  if (!order || !order.customerPhone) return { success: false };

  const formattedPhone = formatToE164(order.customerPhone);
  const restName = order.restaurantName || 'votre restaurant';
  let message = '';

  switch (order.status) {
    case 'Confirmée':
      message = `THIES RESTO: Votre commande #${order.id.slice(0, 6)} chez ${restName} a été confirmée en cuisine !`;
      break;
    case 'En livraison':
      message = `THIES RESTO: Votre livreur est en route pour la commande #${order.id.slice(0, 6)} ! 🛵`;
      break;
    case 'Livrée':
      message = `THIES RESTO: Votre commande #${order.id.slice(0, 6)} a été livrée. Bon appétit ! 🍽️`;
      break;
    default:
      message = `THIES RESTO: Mise à jour commande #${order.id.slice(0, 6)}: ${order.status}`;
  }

  try {
    return await sendSms({ to: formattedPhone, body: message });
  } catch (e) {
    console.error('[Order Status SMS Error]', e);
    return { success: false, error: e.message };
  }
}

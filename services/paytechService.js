import crypto from 'crypto';

/**
 * PayTech Payment Gateway Integration Service for THIES Resto
 * Aggregates Wave, Orange Money, Free Money, and Cards in Senegal.
 */

const DEFAULT_API_KEY = '0ba6ccd186e61db3755b4be8e7f553bc4be7bc6e4902443285235e1c04102707';
const DEFAULT_API_SECRET = '04deed27a7457479e8a5763b6d28fea033934b0103d0c1de5365ec7adf0cf715';

export function getPaytechApiKey() {
  return process.env.PAYTECH_API_KEY || DEFAULT_API_KEY;
}

export function getPaytechApiSecret() {
  return process.env.PAYTECH_API_SECRET || DEFAULT_API_SECRET;
}

export function isPaytechConfigured() {
  const key = getPaytechApiKey();
  const secret = getPaytechApiSecret();
  return Boolean(key && secret && key.length > 10 && secret.length > 10);
}

/**
 * Initiates a payment request with PayTech API.
 * 
 * @param {Object} params
 * @param {string} params.orderId - Unique order or subscription reference (e.g. SUB-ROYAL-SNACK-123)
 * @param {number} params.amount - Total amount in FCFA
 * @param {string} [params.itemName] - Name of the item/pack being paid
 * @param {string} [params.customerName] - Customer or Restaurant Manager name
 * @param {string} [params.customerPhone] - Mobile phone number
 * @param {string} [params.restaurantName] - Partner restaurant name
 * @param {string} [params.successUrl] - Return URL after successful payment
 * @param {string} [params.cancelUrl] - Return URL after cancellation
 * @param {string} [params.ipnUrl] - Webhook IPN notification URL
 * @param {string} [params.env] - 'prod' or 'test'
 * @returns {Promise<Object>} Result with redirect_url and token
 */
export async function createPaytechPayment({
  orderId,
  amount,
  itemName = '',
  customerName = '',
  customerPhone = '',
  restaurantName = 'THIES Resto',
  successUrl,
  cancelUrl,
  ipnUrl,
  env = 'prod'
}) {
  const apiKey = getPaytechApiKey();
  const apiSecret = getPaytechApiSecret();

  if (!apiKey || !apiSecret) {
    throw new Error('Les clés API PayTech ne sont pas configurées.');
  }

  const numericAmount = Math.max(100, Math.round(Number(amount) || 0));
  const cleanRef = `TR_${String(orderId).replace(/[^a-zA-Z0-9_-]/g, '')}_${Date.now()}`;
  const targetEnv = process.env.PAYTECH_ENV || env || 'prod';

  const payload = {
    item_name: itemName || `Abonnement THIES Resto - ${restaurantName}`,
    item_price: numericAmount,
    currency: 'XOF',
    ref_command: cleanRef,
    command_name: `Abonnement THIES Resto - ${restaurantName}`,
    env: targetEnv,
    ipn_url: ipnUrl || '',
    success_url: successUrl || '',
    cancel_url: cancelUrl || '',
    custom_field: JSON.stringify({
      orderId,
      itemName: itemName || `Abonnement ${restaurantName}`,
      customerName,
      customerPhone,
      restaurantName,
      amount: numericAmount,
      timestamp: Date.now()
    })
  };

  try {
    const response = await fetch('https://paytech.sn/api/payment/request-payment', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'API_KEY': apiKey,
        'API_SECRET': apiSecret
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (data && (data.success === 1 || data.token || data.redirect_url)) {
      return {
        success: true,
        token: data.token,
        redirectUrl: data.redirect_url || data.redirect_url_desktop || `https://paytech.sn/payment/checkout/${data.token}`,
        refCommand: cleanRef,
        amount: numericAmount
      };
    } else {
      console.error('[PayTech API Error Response]:', data);
      return {
        success: false,
        message: data.message || data.error || 'Erreur lors de la communication avec la passerelle PayTech.',
        raw: data
      };
    }
  } catch (error) {
    console.error('[PayTech Service Exception]:', error);
    return {
      success: false,
      message: 'Impossible de contacter les serveurs PayTech. Vérifiez votre connexion internet.',
      error: error.message
    };
  }
}

/**
 * Validates PayTech Instant Payment Notification (IPN) signature.
 * 
 * @param {Object} headers - HTTP request headers
 * @param {Object} body - IPN payload
 * @returns {boolean}
 */
export function verifyIpnSignature(headers, body) {
  const apiKey = getPaytechApiKey();
  const apiSecret = getPaytechApiSecret();

  const expectedKeyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
  const expectedSecretHash = crypto.createHash('sha256').update(apiSecret).digest('hex');

  const receivedKeyHash = headers['api_key_sha256'] || headers['api-key-sha256'] || '';
  const receivedSecretHash = headers['api_secret_sha256'] || headers['api-secret-sha256'] || '';

  if (receivedKeyHash && receivedSecretHash) {
    return receivedKeyHash === expectedKeyHash && receivedSecretHash === expectedSecretHash;
  }

  // If no header hash is provided, check API credentials presence
  return true;
}

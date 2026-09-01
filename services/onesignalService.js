/**
 * OneSignal Push Notification Service for THIES Resto
 * Handles REST API push notification dispatch to clients, restaurants, and admins.
 */

export function isOneSignalConfigured() {
  return Boolean(
    process.env.ONESIGNAL_APP_ID || 
    process.env.ONESIGNAL_REST_API_KEY
  );
}

export function getOneSignalConfig() {
  return {
    appId: process.env.ONESIGNAL_APP_ID || '1475ba26-4ce8-4e66-8631-5cbdb9a0b3fe',
    apiKey: process.env.ONESIGNAL_REST_API_KEY || '1475ba26-4ce8-4e66-8631-5cbdb9a0b3fe'
  };
}

/**
 * Send a push notification via OneSignal REST API
 * 
 * @param {Object} options
 * @param {string} options.title - Notification title
 * @param {string} options.message - Notification body text
 * @param {string[]} [options.externalUserIds] - Target external IDs (e.g. phone numbers)
 * @param {string[]} [options.playerIds] - Target specific subscription player IDs
 * @param {Object} [options.data] - Custom metadata payload
 * @param {string} [options.url] - Action URL to open on click
 * @returns {Promise<{ success: boolean, data?: any, error?: string }>}
 */
export async function sendOneSignalPush({ title, message, externalUserIds, playerIds, data = {}, url = null }) {
  const { appId, apiKey } = getOneSignalConfig();

  const payload = {
    app_id: appId,
    target_channel: 'push',
    headings: { fr: title, en: title },
    contents: { fr: message, en: message },
    data: data
  };

  if (url) {
    payload.url = url;
  }

  // Target specific users by external_id (phone) or player_id or all
  if (Array.isArray(externalUserIds) && externalUserIds.length > 0) {
    payload.include_aliases = {
      external_id: externalUserIds
    };
  } else if (Array.isArray(playerIds) && playerIds.length > 0) {
    payload.include_player_ids = playerIds;
  } else {
    payload.included_segments = ['All'];
  }

  try {
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Basic ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('[OneSignal Service Error]:', error);
    return { success: false, error: error.message || 'Error sending push notification' };
  }
}

/**
 * Send order status update notification to customer
 */
export async function notifyCustomerOrderStatus(order, newStatus, restaurantName = 'THIES Resto') {
  if (!order) return { success: false, message: 'Order is required' };

  const orderId = order.id || 'CMD';
  const cleanPhone = String(order.customerPhone || '').replace(/[\s\-\(\)\+]/g, '');
  const total = Number(order.total || 0).toLocaleString('fr-FR');

  let title = `🔔 Suivi Commande #${orderId}`;
  let message = `Votre commande chez ${restaurantName} est passée au statut : ${newStatus}`;

  if (newStatus === 'Reçue') {
    title = `📥 Commande #${orderId} Reçue & Validée !`;
    message = `Le restaurant ${restaurantName} a confirmé la réception de votre commande.`;
  } else if (newStatus === 'Confirmée' || newStatus === 'En préparation' || newStatus === 'En cuisine') {
    title = `👨‍🍳 Commande #${orderId} En Cuisine !`;
    message = `Excellente nouvelle ! Vos plats chez ${restaurantName} sont en cours de préparation en cuisine.`;
  } else if (newStatus === 'Prêt pour livraison' || newStatus === 'Prête') {
    title = `📦 Commande #${orderId} Prête !`;
    message = `Vos plats chez ${restaurantName} sont soigneusement emballés et prêts pour la livraison.`;
  } else if (newStatus === 'En cours de livraison' || newStatus === 'En livraison' || newStatus === 'Partie en livraison') {
    title = `🛵 Commande #${orderId} en Route !`;
    message = `Le livreur est en route vers votre adresse (${order.address || 'Thiès'}).`;
  } else if (newStatus === 'Livrée' || newStatus === 'Livré') {
    title = `✅ Commande #${orderId} Livrée !`;
    message = `Votre commande de ${total} FCFA chez ${restaurantName} a été livrée. Bon appétit ! 🍽️`;
  } else if (newStatus === 'Annulée') {
    title = `❌ Commande #${orderId} Annulée`;
    message = `Votre commande chez ${restaurantName} a été annulée. ${order.cancelReason ? `Raison : ${order.cancelReason}` : ''}`;
  }

  const aliases = cleanPhone ? [cleanPhone, `221${cleanPhone.replace(/^221/, '')}`, `+221${cleanPhone.replace(/^221/, '')}`] : [];

  return await sendOneSignalPush({
    title,
    message,
    externalUserIds: aliases.length > 0 ? aliases : undefined,
    data: {
      type: 'order_status_update',
      orderId,
      status: newStatus,
      restaurantName
    },
    url: 'https://thies-resto.com/#/tracking'
  });
}

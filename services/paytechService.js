/**
 * Legacy PayTech Service wrapper - Redirects to SasPay (Primary Gateway)
 * Preserves compatibility with existing imports and callbacks.
 */

import {
  createSaspayPayment,
  isSaspayConfigured,
  verifySaspayWebhook,
  getSaspayClientId,
  getSaspayClientSecret
} from './saspayService.js';

export function getPaytechApiKey() {
  return getSaspayClientId();
}

export function getPaytechApiSecret() {
  return getSaspayClientSecret();
}

export function isPaytechConfigured() {
  return isSaspayConfigured();
}

export async function createPaytechPayment(params) {
  console.log('🔄 [Payment Gateway] Redirection automatique de PayTech vers SasPay...');
  return createSaspayPayment(params);
}

export function verifyIpnSignature(headers, body) {
  return verifySaspayWebhook(headers, body);
}

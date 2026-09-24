/**
 * Native OTP Client Helper
 * Fournit les fonctions JavaScript front-end pour envoyer et vérifier les codes OTP natifs.
 */

/**
 * Envoie un code OTP au numéro de téléphone spécifié via l'API interne
 * @param {string} phone - Numéro de téléphone
 * @returns {Promise<{ success: boolean, phone?: string, isDemoMode?: boolean, devCode?: string, message: string, retryAfter?: number }>}
 */
async function sendNativeOtp(phone) {
    if (!phone) {
        return { success: false, message: "Le numéro de téléphone est requis." };
    }

    try {
        const response = await fetch('/api/otp/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone })
        });

        const data = await response.json();
        return data;
    } catch (err) {
        console.error("[OTP] Erreur réseau lors de l'envoi du code:", err);
        return {
            success: false,
            message: "Impossible de joindre le serveur pour l'envoi du SMS."
        };
    }
}

/**
 * Vérifie le code OTP saisi par l'utilisateur pour le numéro donné
 * @param {string} phone - Numéro de téléphone
 * @param {string} code - Code à 6 chiffres entré par l'utilisateur
 * @returns {Promise<{ success: boolean, verified: boolean, message: string }>}
 */
async function verifyNativeOtp(phone, code) {
    if (!phone || !code) {
        return { success: false, verified: false, message: "Numéro de téléphone et code requis." };
    }

    try {
        const response = await fetch('/api/otp/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone, code: String(code).trim() })
        });

        const data = await response.json();
        return data;
    } catch (err) {
        console.error("[OTP] Erreur réseau lors de la vérification:", err);
        return {
            success: false,
            verified: false,
            message: "Erreur de connexion au serveur lors de la vérification."
        };
    }
}

if (typeof window !== 'undefined') {
    window.sendNativeOtp = sendNativeOtp;
    window.verifyNativeOtp = verifyNativeOtp;
    window.sendOtp = sendNativeOtp;
    window.verifyOtp = verifyNativeOtp;
}

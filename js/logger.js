/**
 * THIES Resto - Global Security & Error Logger
 * Masquage automatique et sécurisé des données sensibles (mots de passe, tokens, OTP, clés)
 * Protection de la console F12 contre toute fuite d'identifiants
 */

(function() {
    'use strict';

    // Liste des clés considérées comme sensibles
    const SENSITIVE_KEYS = new Set([
        'password', 'pass', 'admin_password', 'p_password', 'admin_pass',
        'reg-password', 'reg_password', 'adm-reg-password', 'adm_reg_password',
        'vendor-pin', 'vendor_pin', 'pin', 'secret', 'token', 'authorization',
        'auth', 'auth_token', 'access_token', 'refresh_token', 'jwt',
        'apikey', 'api_key', 'otp', 'code', 'otpcode', 'verificationcode',
        'credential', 'credentials', 'cookie', 'cvv', 'card_number'
    ]);

    /**
     * Masque une chaîne de caractères contenant des informations sensibles (JSON, headers, URLs)
     */
    function maskSensitiveString(str) {
        if (typeof str !== 'string') return str;
        
        let cleaned = str;
        
        // 1. Masquer les tokens Bearer
        cleaned = cleaned.replace(/(Bearer\s+)[A-Za-z0-9\-\._~\+\/]+=*/gi, '$1[REDACTED_TOKEN]');
        
        // 2. Masquer les champs JSON sensibles (ex: "password": "xyz")
        cleaned = cleaned.replace(
            /("(?:password|pass|p_password|token|secret|pin|otp|code|auth)"\s*:\s*)"([^"]+)"/gi,
            '$1"[REDACTED]"'
        );

        // 3. Masquer les paramètres d'URL sensibles (ex: ?token=xyz ou &password=xyz)
        cleaned = cleaned.replace(
            /([?&](?:password|pass|token|secret|key|otp)=)[^&#\s]+/gi,
            '$1[REDACTED]'
        );

        return cleaned;
    }

    /**
     * Masque récursivement les données sensibles dans un objet ou tableau
     * @param {*} data Donnée à masquer
     * @param {WeakSet} seen Protection contre les références circulaires
     * @returns {*} Donnée nettoyée
     */
    function maskSensitiveData(data, seen = new WeakSet()) {
        if (data === null || data === undefined) return data;
        
        // Primitives
        if (typeof data === 'string') {
            return maskSensitiveString(data);
        }
        if (typeof data !== 'object') {
            return data;
        }

        // Protection contre références circulaires
        if (seen.has(data)) {
            return '[Circular Reference]';
        }
        seen.add(data);

        // Tableaux
        if (Array.isArray(data)) {
            return data.map(item => maskSensitiveData(item, seen));
        }

        // Erreurs JS
        if (data instanceof Error) {
            return {
                name: data.name,
                message: maskSensitiveString(data.message),
                stack: maskSensitiveString(data.stack || '')
            };
        }

        // Objets standards
        const sanitized = {};
        for (const [key, value] of Object.entries(data)) {
            const lowerKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (SENSITIVE_KEYS.has(lowerKey) || lowerKey.includes('password') || lowerKey.includes('secret')) {
                sanitized[key] = '***[REDACTED]***';
            } else if (typeof value === 'object' && value !== null) {
                sanitized[key] = maskSensitiveData(value, seen);
            } else if (typeof value === 'string') {
                sanitized[key] = maskSensitiveString(value);
            } else {
                sanitized[key] = value;
            }
        }
        return sanitized;
    }

    // Expose globalement la fonction de masquage
    window.maskSensitiveData = maskSensitiveData;

    // ---------------------------------------------------------------------------
    // INTERCEPTION GLOBALE DE LA CONSOLE (F12 Shield)
    // ---------------------------------------------------------------------------
    const originalConsole = {
        log: console.log.bind(console),
        info: console.info.bind(console),
        warn: console.warn.bind(console),
        error: console.error.bind(console),
        debug: console.debug ? console.debug.bind(console) : console.log.bind(console)
    };

    ['log', 'info', 'warn', 'error', 'debug'].forEach(method => {
        if (typeof console[method] === 'function') {
            console[method] = function(...args) {
                try {
                    const sanitizedArgs = args.map(arg => maskSensitiveData(arg));
                    originalConsole[method](...sanitizedArgs);
                } catch (e) {
                    originalConsole[method]('[Logger Sanitizer Fallback]', ...args.map(a => typeof a === 'string' ? maskSensitiveString(a) : typeof a));
                }
            };
        }
    });

    // ---------------------------------------------------------------------------
    // GESTIONNAIRES D'ERREURS GLOBAUX AVEC MASQUAGE
    // ---------------------------------------------------------------------------
    window.onerror = function(message, source, lineno, colno, error) {
        const msgStr = String(message || '');
        // Ignore benign notices
        if (msgStr.includes('Failed to fetch') || 
            msgStr.includes('NetworkError') || 
            msgStr.includes('Timeout') || 
            msgStr.includes('geolocation') || 
            msgStr.includes('ResizeObserver') ||
            msgStr.includes('OneSignal') ||
            msgStr.includes('Script error')) {
            return true;
        }

        const safeErrorLog = maskSensitiveData({
            timestamp: new Date().toISOString(),
            type: 'uncaught_exception',
            message: message,
            source: source,
            line: lineno,
            column: colno,
            stack: error ? error.stack : 'N/A',
            url: window.location.href
        });
        
        originalConsole.warn("[GlobalLogger] Exception interceptée sécurisée :", safeErrorLog);
        return true;
    };

    window.addEventListener('unhandledrejection', function(event) {
        const reasonStr = String(event.reason ? (event.reason.message || event.reason) : '');
        if (reasonStr.includes('Failed to fetch') || 
            reasonStr.includes('NetworkError') || 
            reasonStr.includes('Timeout') || 
            reasonStr.includes('Supabase') ||
            reasonStr.includes('geolocation') ||
            reasonStr.includes('OneSignal') ||
            reasonStr.includes('AbortError')) {
            event.preventDefault();
            return;
        }

        const safeErrorLog = maskSensitiveData({
            timestamp: new Date().toISOString(),
            type: 'unhandled_promise_rejection',
            reason: event.reason,
            url: window.location.href
        });
        
        originalConsole.warn("[GlobalLogger] Rejet de promesse sécurisé :", safeErrorLog);
        event.preventDefault();
    });

    originalConsole.log("[GlobalLogger] Masquage des données sensibles et observabilité activés ✓");
})();

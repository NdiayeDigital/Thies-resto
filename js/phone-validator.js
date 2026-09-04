/**
 * THIES Resto - Phone Validator & Smart Mask for Senegal (+221)
 * Fournit un masque de saisie temps réel, une validation fluide et la détection d'opérateurs (Orange, Free, Expresso, Promobile).
 * Sans blocage intrusif, avec standardisation WhatsApp internationale (221XXXXXXXXX).
 */

(function(window) {
    'use strict';

    // Opérateurs mobiles du Sénégal
    const OPERATORS = [
        { prefix: /^77/, name: 'Orange', color: '#ff7900', bg: 'rgba(255, 121, 0, 0.12)', icon: '🟠' },
        { prefix: /^78/, name: 'Orange', color: '#ff7900', bg: 'rgba(255, 121, 0, 0.12)', icon: '🟠' },
        { prefix: /^76/, name: 'Free', color: '#e60000', bg: 'rgba(230, 0, 0, 0.12)', icon: '🔴' },
        { prefix: /^70/, name: 'Expresso', color: '#0083cb', bg: 'rgba(0, 131, 203, 0.12)', icon: '🔵' },
        { prefix: /^75/, name: 'Promobile', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', icon: '🟢' },
        { prefix: /^33/, name: 'Fixe Sonatel', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.12)', icon: '☎️' }
    ];

    /**
     * Nettoie et extrait les 9 chiffres locaux sénégalais
     */
    function cleanSenegalDigits(input) {
        if (!input) return '';
        let digits = String(input).replace(/[^\d]/g, '');
        
        // Supprimer les préfixes indicatifs internationaux courants
        if (digits.startsWith('00221')) {
            digits = digits.substring(5);
        } else if (digits.startsWith('221') && digits.length > 9) {
            digits = digits.substring(3);
        }
        
        // Limiter à 9 chiffres max (format standard Sénégal)
        return digits.substring(0, 9);
    }

    /**
     * Formate 9 chiffres en masque aéré : "77 123 45 67"
     */
    function formatSenegalDisplay(digits) {
        if (!digits) return '';
        const clean = cleanSenegalDigits(digits);
        if (clean.length <= 2) return clean;
        if (clean.length <= 5) return `${clean.slice(0, 2)} ${clean.slice(2)}`;
        if (clean.length <= 7) return `${clean.slice(0, 2)} ${clean.slice(2, 5)} ${clean.slice(5)}`;
        return `${clean.slice(0, 2)} ${clean.slice(2, 5)} ${clean.slice(5, 7)} ${clean.slice(7, 9)}`;
    }

    /**
     * Formate en standard WhatsApp / International : "221771234567"
     */
    function formatForWhatsApp(input) {
        const digits = cleanSenegalDigits(input);
        if (!digits) return '';
        return `221${digits}`;
    }

    /**
     * Identifie l'opérateur sénégalais
     */
    function detectOperator(digits) {
        const clean = cleanSenegalDigits(digits);
        for (const op of OPERATORS) {
            if (op.prefix.test(clean)) {
                return op;
            }
        }
        return null;
    }

    /**
     * Validation complète fluide du numéro sénégalais
     */
    function validateSenegalPhoneNumber(input) {
        const clean = cleanSenegalDigits(input);
        const op = detectOperator(clean);

        if (!clean || clean.length === 0) {
            return {
                isValid: false,
                isPartial: false,
                digits: '',
                formatted: '',
                clean: '',
                operator: null,
                message: 'Veuillez saisir votre numéro de téléphone.'
            };
        }

        if (clean.length < 9) {
            return {
                isValid: false,
                isPartial: true,
                digits: clean,
                formatted: formatSenegalDisplay(clean),
                clean: `+221 ${formatSenegalDisplay(clean)}`,
                operator: op,
                message: `Encore ${9 - clean.length} chiffre${9 - clean.length > 1 ? 's' : ''} requis.`
            };
        }

        if (!op) {
            return {
                isValid: false,
                isPartial: false,
                digits: clean,
                formatted: formatSenegalDisplay(clean),
                clean: `+221 ${formatSenegalDisplay(clean)}`,
                operator: null,
                message: 'Le préfixe doit débuter par 77, 78, 76, 70 ou 75.'
            };
        }

        return {
            isValid: true,
            isPartial: false,
            digits: clean,
            formatted: formatSenegalDisplay(clean),
            clean: `+221 ${formatSenegalDisplay(clean)}`,
            waNumber: formatForWhatsApp(clean),
            operator: op,
            message: `Numéro ${op.name} validé ✅`
        };
    }

    /**
     * Attache automatiquement le masque et la validation temps réel à un champ input
     */
    function attachRealtimePhoneValidation(inputId, feedbackId, badgeId, iconId) {
        const input = typeof inputId === 'string' ? document.getElementById(inputId) : inputId;
        if (!input) return;

        const feedback = feedbackId ? (typeof feedbackId === 'string' ? document.getElementById(feedbackId) : feedbackId) : null;
        const badge = badgeId ? (typeof badgeId === 'string' ? document.getElementById(badgeId) : badgeId) : null;
        const icon = iconId ? (typeof iconId === 'string' ? document.getElementById(iconId) : iconId) : null;

        function updateUI() {
            const rawVal = input.value;
            const res = validateSenegalPhoneNumber(rawVal);
            const digits = cleanSenegalDigits(rawVal);

            // Maintien du curseur et du formatage sans à-coup
            const formatted = formatSenegalDisplay(digits);
            if (input.value !== formatted && !input.value.startsWith('+221 ')) {
                input.value = formatted;
            }

            // Mise à jour de la pastille opérateur
            if (badge) {
                if (res.operator) {
                    badge.style.display = 'inline-flex';
                    badge.style.alignItems = 'center';
                    badge.style.gap = '4px';
                    badge.style.padding = '2px 8px';
                    badge.style.borderRadius = '10px';
                    badge.style.fontSize = '0.75rem';
                    badge.style.fontWeight = '700';
                    badge.style.color = res.operator.color;
                    badge.style.background = res.operator.bg;
                    badge.innerHTML = `${res.operator.icon} ${res.operator.name}`;
                } else if (digits.length >= 2) {
                    badge.style.display = 'inline-flex';
                    badge.style.padding = '2px 8px';
                    badge.style.borderRadius = '10px';
                    badge.style.fontSize = '0.75rem';
                    badge.style.color = '#ef4444';
                    badge.style.background = 'rgba(239, 68, 68, 0.1)';
                    badge.innerText = 'Préfixe inconnu';
                } else {
                    badge.style.display = 'none';
                }
            }

            // Mise à jour de l'icône de statut
            if (icon) {
                if (res.isValid) {
                    icon.innerHTML = '✅';
                    icon.style.opacity = '1';
                } else if (res.isPartial) {
                    icon.innerHTML = '✏️';
                    icon.style.opacity = '0.6';
                } else if (digits.length > 0) {
                    icon.innerHTML = '⚠️';
                    icon.style.opacity = '0.8';
                } else {
                    icon.innerHTML = '';
                }
            }

            // Mise à jour du message d'aide
            if (feedback) {
                if (res.isValid) {
                    feedback.style.color = '#059669';
                    feedback.innerHTML = `<span>✅ Numéro ${res.operator ? res.operator.name : 'Sénégal'} certifié (9 chiffres)</span>`;
                    input.style.borderColor = '#10b981';
                } else if (res.isPartial) {
                    feedback.style.color = 'var(--text-secondary)';
                    feedback.innerHTML = `<span>💡 ${res.message}</span>`;
                    input.style.borderColor = 'var(--border)';
                } else if (digits.length > 0) {
                    feedback.style.color = '#ef4444';
                    feedback.innerHTML = `<span>⚠️ ${res.message}</span>`;
                    input.style.borderColor = '#ef4444';
                } else {
                    feedback.style.color = 'var(--text-secondary)';
                    feedback.innerHTML = `<span>💡 Format Sénégal : 77, 78, 76, 70, 75 (9 chiffres)</span>`;
                    input.style.borderColor = 'var(--border)';
                }
            }
        }

        // Événements de frappe et collage
        input.addEventListener('input', updateUI);
        input.addEventListener('paste', () => setTimeout(updateUI, 10));
        input.addEventListener('focus', updateUI);

        // Premier passage pour les champs pré-remplis
        if (input.value) {
            updateUI();
        }
    }

    // Export global
    window.cleanSenegalDigits = cleanSenegalDigits;
    window.formatSenegalDisplay = formatSenegalDisplay;
    window.formatForWhatsApp = formatForWhatsApp;
    window.detectOperator = detectOperator;
    window.validateSenegalPhoneNumber = validateSenegalPhoneNumber;
    window.attachRealtimePhoneValidation = attachRealtimePhoneValidation;

    // Compatibilité rétroactive
    window.cleanPhoneNumber = cleanSenegalDigits;
    window.formatPhoneNumber = formatSenegalDisplay;

})(window);

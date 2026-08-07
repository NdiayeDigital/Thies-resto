/**
 * THIES Resto - Global Error Logger
 * Capture silencieusement les erreurs JavaScript en production
 * Idéalement à brancher sur Sentry ou Datadog dans le futur.
 */

window.onerror = function(message, source, lineno, colno, error) {
    const errorLog = {
        timestamp: new Date().toISOString(),
        type: 'uncaught_exception',
        message: message,
        source: source,
        line: lineno,
        column: colno,
        stack: error ? error.stack : 'N/A',
        url: window.location.href,
        userAgent: navigator.userAgent
    };
    
    console.error("[GlobalLogger] Erreur interceptée :", errorLog);
    
    // Si l'application a planté sévèrement, on tente de prévenir l'utilisateur
    // sans bloquer le thread principal.
    if (typeof showToast === 'function') {
        showToast("Une erreur inattendue s'est produite. Si le problème persiste, rechargez la page.", "warning");
    }
    
    // TODO: Envoyer `errorLog` à un service d'observabilité (ex: fetch('https://api.sentry.io/...'))
    return false; // Permet à l'erreur d'être loggée dans la console standard
};

window.addEventListener('unhandledrejection', function(event) {
    const errorLog = {
        timestamp: new Date().toISOString(),
        type: 'unhandled_promise_rejection',
        reason: event.reason,
        url: window.location.href
    };
    
    console.error("[GlobalLogger] Promesse rejetée :", errorLog);
});

console.log("[GlobalLogger] Observabilité activée.");

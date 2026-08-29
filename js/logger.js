/**
 * THIES Resto - Global Error Logger
 * Capture silencieusement les erreurs JavaScript en production
 * Idéalement à brancher sur Sentry ou Datadog dans le futur.
 */

window.onerror = function(message, source, lineno, colno, error) {
    const msgStr = String(message || '');
    // Ignore benign network or iframe permission warnings
    if (msgStr.includes('Failed to fetch') || 
        msgStr.includes('NetworkError') || 
        msgStr.includes('Timeout') || 
        msgStr.includes('geolocation') || 
        msgStr.includes('ResizeObserver') ||
        msgStr.includes('Script error')) {
        console.warn("[GlobalLogger] Ignored benign notice:", msgStr);
        return true;
    }

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
    
    console.warn("[GlobalLogger] Exception interceptée :", errorLog);
    return true; // Prevents unhandled error propagation
};

window.addEventListener('unhandledrejection', function(event) {
    const reasonStr = String(event.reason ? (event.reason.message || event.reason) : '');
    if (reasonStr.includes('Failed to fetch') || 
        reasonStr.includes('NetworkError') || 
        reasonStr.includes('Timeout') || 
        reasonStr.includes('Supabase') ||
        reasonStr.includes('geolocation') ||
        reasonStr.includes('AbortError')) {
        console.warn("[GlobalLogger] Ignored network rejection notice:", reasonStr);
        event.preventDefault();
        return;
    }

    const errorLog = {
        timestamp: new Date().toISOString(),
        type: 'unhandled_promise_rejection',
        reason: event.reason,
        url: window.location.href
    };
    
    console.warn("[GlobalLogger] Promesse rejetée :", errorLog);
    event.preventDefault();
});

console.log("[GlobalLogger] Observabilité activée.");

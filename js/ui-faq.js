/**
 * THIES Resto - FAQ Component
 * Gère l'accordéon des questions fréquentes et l'affichage exclusif sur la page d'accueil.
 */

(function () {
    /**
     * Bascule l'état d'un élément d'accordéon (Ouvrir / Fermer)
     * @param {string} faqId 
     */
    function toggleFaq(faqId) {
        const item = document.getElementById(faqId);
        if (!item) return;

        const isCurrentlyActive = item.classList.contains('active');
        const questionBtn = item.querySelector('.footer-faq-question-btn');
        const answerBox = item.querySelector('.footer-faq-answer');

        if (isCurrentlyActive) {
            item.classList.remove('active');
            if (questionBtn) questionBtn.setAttribute('aria-expanded', 'false');
            if (answerBox) answerBox.setAttribute('aria-hidden', 'true');
        } else {
            // Ferme les autres accordéons pour une lecture propre et nette
            document.querySelectorAll('.footer-faq-item.active').forEach(openItem => {
                if (openItem !== item) {
                    openItem.classList.remove('active');
                    const btn = openItem.querySelector('.footer-faq-question-btn');
                    const ans = openItem.querySelector('.footer-faq-answer');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                    if (ans) ans.setAttribute('aria-hidden', 'true');
                }
            });

            item.classList.add('active');
            if (questionBtn) questionBtn.setAttribute('aria-expanded', 'true');
            if (answerBox) answerBox.setAttribute('aria-hidden', 'false');
        }
    }

    /**
     * Masque ou affiche la section FAQ selon la page active (visible uniquement sur l'accueil)
     */
    function updateFaqVisibility(routeHash) {
        const hash = routeHash || window.location.hash || '';
        const faqSection = document.getElementById('footer-faq');
        if (!faqSection) return;

        const isHomePage = hash === '' || hash === '#' || hash === '#/' || hash.startsWith('#/?');
        faqSection.style.display = isHomePage ? 'block' : 'none';
    }

    window.addEventListener('hashchange', () => {
        updateFaqVisibility();
    });

    document.addEventListener('DOMContentLoaded', () => {
        updateFaqVisibility();
    });

    // Export global sur window
    window.toggleFaq = toggleFaq;
    window.updateFaqVisibility = updateFaqVisibility;
})();


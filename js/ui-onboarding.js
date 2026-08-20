class OnboardingUI {
    constructor() {
        this.root = document.getElementById('onboarding-root');
        this.currentSlide = 0;
        this.totalSlides = 4;
        this.startX = 0;
        
        // Define Whatsapp Support number for password reset
        this.whatsappSupport = "221770000000"; // Placeholder, the user should change this
    }

    render() {
        if (!this.root) return;

        this.root.innerHTML = `
            <div class="onboarding-container">
                <button class="onboarding-skip" onclick="onboarding.goToSlide(3)">Passer</button>
                
                <div class="onboarding-slider" id="onboarding-slider">
                    <!-- Slide 1 -->
                    <div class="onboarding-slide slide-1">
                        <div class="slide-content">
                            <div class="slide-logo">THIES Resto</div>
                            <h2 class="slide-title">Vos restaurants préférés de Thiès, en un clic</h2>
                        </div>
                    </div>

                    <!-- Slide 2 -->
                    <div class="onboarding-slide slide-2">
                        <div class="slide-content">
                            <div class="slide-icon">🚀</div>
                            <h2 class="slide-title">Découvrez & Commandez</h2>
                            <p class="slide-text">Parcourez les meilleurs plats de Thiès, commandez simplement et payez via Wave ou Orange Money.</p>
                        </div>
                    </div>

                    <!-- Slide 3 -->
                    <div class="onboarding-slide slide-3">
                        <div class="slide-content">
                            <div class="slide-icon">📍</div>
                            <h2 class="slide-title">Comment ça marche ?</h2>
                            <ul class="slide-steps">
                                <li><span>1</span> Choisissez un restaurant</li>
                                <li><span>2</span> Composez votre commande</li>
                                <li><span>3</span> Payez en toute sécurité</li>
                                <li><span>4</span> Suivez la livraison</li>
                            </ul>
                        </div>
                    </div>

                    <!-- Slide 4 -->
                    <div class="onboarding-slide slide-4">
                        <div class="slide-content auth-slide">
                            <div class="slide-logo small">THIES Resto</div>
                            
                            <div class="auth-tabs">
                                <button class="auth-tab active" id="tab-login" onclick="onboarding.switchAuthMode('login')">Se connecter</button>
                                <button class="auth-tab" id="tab-register" onclick="onboarding.switchAuthMode('register')">Créer un compte</button>
                            </div>

                            <form id="auth-form" onsubmit="onboarding.handleAuthSubmit(event)">
                                <div class="form-group">
                                    <input type="tel" id="auth-phone" placeholder="Numéro de téléphone (+221...)" required class="auth-input">
                                </div>
                                <div class="form-group">
                                    <input type="password" id="auth-password" placeholder="Mot de passe (8 car. min)" required minlength="8" class="auth-input">
                                </div>
                                
                                <!-- Div de confirmation pour l'inscription -->
                                <div id="register-confirm-box" style="display: none; background: rgba(246,138,15,0.1); border: 1px solid var(--primary); padding: 1rem; border-radius: 10px; margin-bottom: 1rem;">
                                    <p style="font-size: 0.9rem; margin-bottom: 0.5rem;">Veuillez confirmer que ce numéro est correct :</p>
                                    <strong id="confirm-phone-display" style="font-size: 1.2rem; display: block; margin-bottom: 0.5rem;"></strong>
                                    <div style="display: flex; gap: 0.5rem;">
                                        <button type="button" class="btn btn-secondary btn-sm" onclick="onboarding.cancelConfirm()">Modifier</button>
                                        <button type="button" class="btn btn-primary btn-sm" onclick="onboarding.executeRegister()">Oui, c'est mon numéro</button>
                                    </div>
                                </div>

                                <button type="submit" class="btn btn-primary w-100" id="auth-submit-btn">Se connecter</button>
                                
                                <div class="auth-forgot">
                                    <a href="javascript:void(0)" onclick="onboarding.contactSupport()">Mot de passe oublié / J'ai changé de téléphone</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div class="onboarding-dots" id="onboarding-dots">
                    <span class="dot active" onclick="onboarding.goToSlide(0)"></span>
                    <span class="dot" onclick="onboarding.goToSlide(1)"></span>
                    <span class="dot" onclick="onboarding.goToSlide(2)"></span>
                    <span class="dot" onclick="onboarding.goToSlide(3)"></span>
                </div>
            </div>
        `;

        this.bindEvents();
        this.updateUI();
        this.authMode = 'login'; // 'login' or 'register'
        this.isConfirming = false;
    }

    bindEvents() {
        const slider = document.getElementById('onboarding-slider');
        
        // Touch events for swipe
        slider.addEventListener('touchstart', (e) => {
            this.startX = e.touches[0].clientX;
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diffX = this.startX - endX;

            if (Math.abs(diffX) > 50) { // Threshold
                if (diffX > 0 && this.currentSlide < this.totalSlides - 1) {
                    this.goToSlide(this.currentSlide + 1);
                } else if (diffX < 0 && this.currentSlide > 0) {
                    this.goToSlide(this.currentSlide - 1);
                }
            }
        }, { passive: true });
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.updateUI();
    }

    updateUI() {
        const slider = document.getElementById('onboarding-slider');
        const dots = document.querySelectorAll('.onboarding-dots .dot');
        const skipBtn = document.querySelector('.onboarding-skip');

        if (!slider) return;

        slider.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentSlide);
        });

        // Hide skip button and dots on last slide
        if (this.currentSlide === this.totalSlides - 1) {
            skipBtn.style.display = 'none';
            document.getElementById('onboarding-dots').style.display = 'none';
            // Mark as seen once they reach the end
            localStorage.setItem('hasSeenOnboarding', 'true');
        } else {
            skipBtn.style.display = 'block';
            document.getElementById('onboarding-dots').style.display = 'flex';
        }
    }

    switchAuthMode(mode) {
        this.authMode = mode;
        this.isConfirming = false;
        
        const tabLogin = document.getElementById('tab-login');
        const tabRegister = document.getElementById('tab-register');
        const submitBtn = document.getElementById('auth-submit-btn');
        const confirmBox = document.getElementById('register-confirm-box');
        
        confirmBox.style.display = 'none';
        submitBtn.style.display = 'block';

        if (mode === 'login') {
            tabLogin.classList.add('active');
            tabRegister.classList.remove('active');
            submitBtn.textContent = "Se connecter";
        } else {
            tabRegister.classList.add('active');
            tabLogin.classList.remove('active');
            submitBtn.textContent = "Créer mon compte";
        }
    }

    async handleAuthSubmit(e) {
        e.preventDefault();
        
        const phoneInput = document.getElementById('auth-phone');
        const passInput = document.getElementById('auth-password');
        const phone = phoneInput.value.trim();
        const password = passInput.value;

        if (!phone || password.length < 8) {
            if(typeof showToast === 'function') showToast("Veuillez remplir correctement les champs.", "warning");
            return;
        }

        if (this.authMode === 'register') {
            // Show confirmation box first
            this.isConfirming = true;
            document.getElementById('register-confirm-box').style.display = 'block';
            document.getElementById('confirm-phone-display').textContent = phone;
            document.getElementById('auth-submit-btn').style.display = 'none';
            phoneInput.disabled = true;
            passInput.disabled = true;
        } else {
            // Login directly
            await this.executeLogin(phone, password);
        }
    }
    
    cancelConfirm() {
        this.isConfirming = false;
        document.getElementById('register-confirm-box').style.display = 'none';
        document.getElementById('auth-submit-btn').style.display = 'block';
        document.getElementById('auth-phone').disabled = false;
        document.getElementById('auth-password').disabled = false;
    }

    async executeRegister() {
        const phone = document.getElementById('auth-phone').value.trim();
        const password = document.getElementById('auth-password').value;
        const btn = document.querySelector('#register-confirm-box .btn-primary');
        const originalText = btn.textContent;
        
        try {
            btn.textContent = "Création...";
            btn.disabled = true;
            await store.signUpWithPhone(phone, password);
            
            // Auto login after signup
            await store.signInWithPhone(phone, password);
            
            if(typeof showToast === 'function') showToast("Compte créé avec succès !", "success");
            this.finishOnboarding();
        } catch (error) {
            if(typeof showToast === 'function') showToast(error.message || "Erreur lors de la création du compte.", "danger");
            btn.textContent = originalText;
            btn.disabled = false;
        }
    }

    async executeLogin(phone, password) {
        const btn = document.getElementById('auth-submit-btn');
        const originalText = btn.textContent;
        
        try {
            btn.textContent = "Connexion...";
            btn.disabled = true;
            await store.signInWithPhone(phone, password);
            
            if(typeof showToast === 'function') showToast("Connexion réussie !", "success");
            this.finishOnboarding();
        } catch (error) {
            if(typeof showToast === 'function') showToast(error.message || "Erreur de connexion.", "danger");
            btn.textContent = originalText;
            btn.disabled = false;
        }
    }

    contactSupport() {
        const text = encodeURIComponent("Bonjour, j'ai oublié mon mot de passe ou changé de numéro sur THIES Resto. Pouvez-vous m'aider à récupérer mon compte ?");
        window.open(`https://wa.me/${this.whatsappSupport}?text=${text}`, '_blank');
    }

    finishOnboarding() {
        localStorage.setItem('hasSeenOnboarding', 'true');
        // Hide root and trigger app init
        if (this.root) {
            this.root.style.display = 'none';
        }
        
        // Let app.js take over
        if (typeof renderApp === 'function') {
            renderApp();
        }
    }
}

const onboarding = new OnboardingUI();
onboarding.render();

function logoutRestaurant() {
    try {
        sessionStorage.removeItem('resto_session');
    } catch(e) {}
    if (typeof currentRestaurantSession !== 'undefined') currentRestaurantSession = null;
    if (typeof showToast === 'function') showToast('Déconnexion réussie', 'success');
    if (typeof router !== 'undefined') router.navigate('/auth');
}

router.add('#/auth', () => {
    // Hide cart
    document.getElementById('floating-cart-bar').style.display = 'none';
    stopOrderPolling();
    hideLoadingOverlay();
    
    const container = document.getElementById('main-content');
    
    container.innerHTML = `
        <div class="auth-container" style="max-width: 450px; margin: 3rem auto; padding: 2rem; background: var(--bg-card); border-radius: 24px; border: 1px solid var(--border); box-shadow: var(--shadow);">
            <div class="auth-header" style="text-align: center; margin-bottom: 2rem;">
                <span class="auth-logo" style="font-size: 3rem; display: block; margin-bottom: 1rem;">🏪</span>
                <h2 style="font-family: var(--font-serif); font-size: 1.75rem; color: #fff;">Espace Partenaire</h2>
                <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.5rem;">Connectez-vous à votre tableau de bord restaurant.</p>
            </div>

            <!-- LOGIN FORM -->
            <form id="login-form" onsubmit="handleRestaurantLogin(event)">
                <div class="form-group" style="margin-bottom: 1.25rem;">
                    <label class="form-label">Identifiant unique (slug)</label>
                    <input type="text" id="login-username" class="form-control" placeholder="la-licorne" required>
                </div>
                <div class="form-group" style="margin-bottom: 1.5rem;">
                    <label class="form-label">Mot de passe</label>
                    <input type="password" id="login-password" class="form-control" placeholder="••••••••" required>
                </div>
                <button type="submit" class="btn btn-primary btn-block" style="font-weight: 700; width: 100%;">Se connecter 🔓</button>
            </form>

            <!-- PARTNERSHIP CTA -->
            <div style="text-align: center; margin-top: 1.5rem; border-top: 1px solid var(--border); padding-top: 1.5rem;">
                <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 0.75rem;">Vous souhaitez rejoindre le réseau THIES Resto ?</p>
                <button class="btn btn-secondary btn-block" onclick="router.navigate('/partnership')" style="width: 100%; font-weight: 700;">Demander un Partenariat 🤝</button>
            </div>
        </div>
    `;
});

// ----------------------------------------------------
// Page: DEMANDE DE PARTENARIAT
// ----------------------------------------------------
router.add('#/partnership', () => {
    // Hide cart
    document.getElementById('floating-cart-bar').style.display = 'none';
    stopOrderPolling();
    hideLoadingOverlay();
    
    const container = document.getElementById('main-content');
    
    container.innerHTML = `
        <div class="auth-container" style="max-width: 600px; margin: 3rem auto; padding: 2.5rem; background: var(--bg-card); border-radius: 24px; border: 1px solid var(--border); box-shadow: var(--shadow);">
            <div class="auth-header" style="text-align: center; margin-bottom: 2rem;">
                <span class="auth-logo" style="font-size: 3rem; display: block; margin-bottom: 1rem;">🤝</span>
                <h2 style="font-family: var(--font-serif); font-size: 1.75rem; color: #fff;">Demande de Partenariat</h2>
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.5rem;">
                    Rejoignez la première plateforme commune de restauration à Thiès. Remplissez les informations de votre établissement ci-dessous.
                </p>
            </div>

            <!-- REGISTRATION FORM -->
            <form id="register-form" onsubmit="handleRestaurantRegister(event)">
                <div class="form-group" style="margin-bottom: 1.25rem;">
                    <label class="form-label">Nom de votre restaurant <span class="required" style="color: var(--accent);">*</span></label>
                    <input type="text" id="reg-name" class="form-control" placeholder="ex: Le Teranga du Rail" required oninput="handleRestaurantNameInput(this.value, 'reg-username', 'reg-password', 'slug-availability-badge')">
                </div>

                <div class="form-group" style="margin-bottom: 1.25rem;">
                    <label class="form-label">Adresse physique à Thiès <span class="required" style="color: var(--accent);">*</span></label>
                    <input type="text" id="reg-address" class="form-control" placeholder="ex: Quartier Escale, Thiès" required>
                </div>

                <div class="form-group" style="margin-bottom: 1.25rem;">
                    <label class="form-label">Catégorie de cuisine <span class="required" style="color: var(--accent);">*</span></label>
                    <select id="reg-category" class="form-control" required style="width: 100%;">
                        <option value="Traditionnel">Traditionnel (Thiéb, Yassa, Mafé)</option>
                        <option value="Grillades / Dibi">Grillades / Dibi (Dibiterie)</option>
                        <option value="Fast Food">Fast Food (Burgers, Chawarmas)</option>
                        <option value="Pâtisserie">Pâtisserie / Petit Déjeuner</option>
                        <option value="Gastronomique">Chic / Gastronomique</option>
                    </select>
                </div>

                <div class="form-group" style="margin-bottom: 1.25rem;">
                    <label class="form-label">Numéro WhatsApp de réception <span class="required" style="color: var(--accent);">*</span></label>
                    <input type="tel" id="reg-whatsapp" class="form-control" placeholder="ex: +221 77 123 45 67" required>
                    <small style="color: var(--text-secondary); font-size: 0.75rem; display: block; margin-top: 0.25rem;">C'est sur ce numéro que vous recevrez les commandes clients.</small>
                </div>

                <div class="form-group" style="margin-bottom: 1.25rem;">
                    <label class="form-label">Photo du Restaurant / Logo (Optionnel)</label>
                    <input type="file" id="reg-image-file" class="form-control" accept="image/*" onchange="handleRegImageUpload(event)" style="padding: 0.35rem; height: auto;">
                    <input type="hidden" id="reg-image-url" value="">
                    <div id="reg-image-preview-container" style="display: none; margin-top: 0.75rem; align-items: center; gap: 0.75rem; background: var(--bg-secondary); padding: 0.5rem; border-radius: 10px; border: 1px solid var(--border);">
                        <img id="reg-image-preview" src="" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
                        <span id="reg-image-upload-status" style="font-size: 0.75rem; color: var(--success); font-weight: 600;">Photo sélectionnée avec succès ! ✅</span>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
                    <div class="form-group">
                        <label class="form-label">Heure d'ouverture <span class="required" style="color: var(--accent);">*</span></label>
                        <input type="time" id="reg-open" class="form-control" value="08:00" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Heure de fermeture <span class="required" style="color: var(--accent);">*</span></label>
                        <input type="time" id="reg-close" class="form-control" value="23:00" required>
                    </div>
                </div>

                <div class="form-group" style="margin-bottom: 1.25rem;">
                    <label class="form-label">Identifiant de connexion souhaité (slug) <span class="required" style="color: var(--accent);">*</span></label>
                    <input type="text" id="reg-username" class="form-control" placeholder="ex: le-teranga-rail" required oninput="checkSlugAvailability()">
                    <small style="color: var(--text-secondary); font-size: 0.75rem; display: block; margin-top: 0.25rem;">Généré automatiquement (modifiable).</small>
                    <div id="slug-availability-badge" style="margin-top: 0.35rem; font-size: 0.8rem; font-weight: 600;"></div>
                </div>

                <div class="form-group" style="margin-bottom: 1.75rem;">
                    <label class="form-label">Mot de passe de connexion <span class="required" style="color: var(--accent);">*</span></label>
                    <input type="password" id="reg-password" class="form-control" placeholder="••••••••" required>
                    <small style="color: var(--text-secondary); font-size: 0.75rem; display: block; margin-top: 0.25rem;">Généré automatiquement par défaut (nom_221, modifiable).</small>
                </div>

                <button type="submit" class="btn btn-primary btn-block" style="font-weight: 700; width: 100%;">Envoyer la demande de partenariat 🚀</button>
            </form>

            <div style="text-align: center; margin-top: 1.5rem; border-top: 1px solid var(--border); padding-top: 1.5rem;">
                <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 0.5rem;">Vous êtes déjà partenaire ?</p>
                <button class="btn btn-secondary btn-block" onclick="router.navigate('/auth')" style="width: 100%;">Se connecter à l'espace membre 🔓</button>
            </div>
        </div>
    `;
});

window.handleRegImageUpload = async function(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!supabaseClient) {
        showToast("Service Storage non disponible", "danger");
        return;
    }

    const previewImg = document.getElementById('reg-image-preview');
    const container = document.getElementById('reg-image-preview-container');
    const statusText = document.getElementById('reg-image-upload-status');
    const urlInput = document.getElementById('reg-image-url');
    const submitBtn = document.querySelector('#register-form button[type="submit"]');

    if (container) container.style.display = 'flex';
    if (previewImg) previewImg.src = URL.createObjectURL(file);
    if (statusText) {
        statusText.innerHTML = `⏳ Compression et envoi...`;
        statusText.style.color = "var(--warning)";
    }
    if (submitBtn) submitBtn.disabled = true;

    // --- IMAGE COMPRESSION LOGIC ---
    const compressImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = event => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Convert to blob (webp for better compression)
                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, 'image/webp', 0.8);
                };
            };
        });
    };

    try {
        const compressedBlob = await compressImage(file);
        const fileName = `${Date.now()}_logo.webp`;
        const filePath = `restaurants/${fileName}`;

        const { error } = await supabaseClient.storage
            .from('restaurant-images')
            .upload(filePath, compressedBlob, { contentType: 'image/webp' });

        if (error) throw error;

        const { data: publicUrlData } = supabaseClient.storage
            .from('restaurant-images')
            .getPublicUrl(filePath);

        urlInput.value = publicUrlData.publicUrl;
        
        if (statusText) {
            statusText.innerHTML = `✅ Photo compressée et hébergée !`;
            statusText.style.color = "var(--success)";
        }
    } catch (e) {
        console.error("Upload error:", e);
        if (statusText) {
            statusText.innerHTML = `❌ Échec de l'envoi (${e.message})`;
            statusText.style.color = "var(--danger)";
        }
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }
}



async function handleRestaurantLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim().toLowerCase();
    const pass = document.getElementById('login-password').value.trim();
    
    // Obfuscated admin check (btoa('admin221') = 'YWRtaW4yMjE=')
    // btoa('idadmin') = 'aWRhZG1pbg=='
    if (btoa(username) === 'aWRhZG1pbg==' && btoa(pass) === 'YWRtaW4yMjE=') {
        sessionStorage.setItem('thies_admin_logged', 'true');
        if (typeof showToast === 'function') showToast("Connexion réussie ! Bienvenue Admin.", "success");
        setTimeout(() => {
            document.getElementById('auth-modal').style.display = 'none';
            router.navigate('/admin');
        }, 1000);
        return;
    }
    
    let r = null;
    
    if (typeof supabaseClient !== 'undefined' && supabaseClient) {
        try {
            const { data, error } = await supabaseClient.rpc('verify_restaurant_login', {
                p_username: username,
                p_password: pass
            });
            if (!error && data && data.length > 0) {
                r = {
                    id: data[0].id,
                    name: data[0].name,
                    slug: data[0].slug,
                    status: data[0].status,
                    password: pass
                };
            }
        } catch(err) {
            console.error("Supabase login error", err);
        }
    }
    
    // Fallback: local dynamic check
    if (!r) {
        const localRestos = store.getRestaurants();
        const matchedResto = localRestos.find(resto => {
            let baseName = resto.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            let expectedUsername = 'id_' + baseName;
            let expectedPassword = baseName + '221';
            return username === expectedUsername && pass.toLowerCase() === expectedPassword;
        });
        
        if (matchedResto) {
            r = matchedResto;
            r.password = pass; // Store in session
        }
    }
    
    if (!r) {
        if (typeof showToast === 'function') showToast("Identifiant ou mot de passe incorrect", "danger");
        return;
    }

    if (r.status === 'pending') {
        if (typeof showToast === 'function') showToast("Votre compte est en cours de validation.", "warning");
        return;
    }
    
    if (r.status === 'suspended') {
        if (typeof showToast === 'function') showToast("Votre compte a été suspendu temporairement.", "danger");
        return;
    }
    
    currentRestaurantSession = { id: r.id, name: r.name, slug: r.slug, password: pass };
    try {
        sessionStorage.setItem('resto_session', JSON.stringify(currentRestaurantSession));
    } catch (e) {}
    
    if (typeof updateNav === 'function') updateNav();
    if (typeof showToast === 'function') showToast(`Bienvenue, ${r.name} !`, "success");
    
    setTimeout(() => {
        document.getElementById('auth-modal').style.display = 'none';
        router.navigate('/dashboard');
    }, 1000);
}

function handleRestaurantRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('reg-name').value.trim();
    const address = document.getElementById('reg-address').value.trim();
    const category = document.getElementById('reg-category').value;
    const whatsapp = cleanPhoneNumber(document.getElementById('reg-whatsapp').value.trim());
    const openH = document.getElementById('reg-open').value;
    const closeH = document.getElementById('reg-close').value;
    const username = document.getElementById('reg-username').value.trim().toLowerCase();
    const password = document.getElementById('reg-password').value;
    const imageUrl = document.getElementById('reg-image-url').value;
    
    if (!/^\+221(70|75|76|77|78)\d{7}$/.test(whatsapp.replace(/\s+/g, ''))) {
        showToast("Numéro WhatsApp invalide (ex: +221 77 XXX XX XX)", "danger");
        return;
    }

    // Check availability
    const exists = store.getRestaurants().find(r => r.username === username || r.slug === username);
    if (exists) {
        showToast("Cet identifiant est déjà utilisé", "danger");
        return;
    }

    const newId = "r" + (store.getRestaurants().length + 1);
    const slug = username.replace(/[^a-z0-9]/g, '-');
    
    const newResto = {
        id: newId,
        name,
        slug,
        rating: 5.0,
        reviewsCount: 0,
        category,
        address,
        whatsapp,
        image: imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500',
        openHours: `${openH} - ${closeH}`,
        closedDays: [],
        isOpenManual: true,
        status: "pending",
        username,
        password,
        menu: [],
        reviews: []
    };

    store.addRestaurant(newResto);
    
    const container = document.querySelector('.auth-container');
    container.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem;">
            <div style="font-size: 3.5rem; margin-bottom: 1rem;">⏳</div>
            <h2 style="font-size: 1.25rem;">Demande d'inscription envoyée !</h2>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 1rem 0 1.5rem 0;">
                Votre dossier pour "<strong>${name}</strong>" a été transmis avec succès.
            </p>
            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 12px; font-size: 0.85rem; text-align: left; margin-bottom: 1.5rem;">
                Notre super-administrateur valide les inscriptions sous 10 minutes. Vous recevrez une confirmation et un message d'activation directement sur WhatsApp au <strong>${whatsapp}</strong>.
            </div>
            <button class="btn btn-primary btn-block" onclick="router.navigate('/')">Retourner à l'accueil</button>
        </div>
    `;
    
    showToast("Inscription enregistrée. En attente d'approbation.", "success");
}

// ----------------------------------------------------
// Page: RESTAURANT DASHBOARD (Gerer ses donnees)
// ----------------------------------------------------
let dashboardActiveTab = 'orders';
let currentOrderStatusFilter = 'Tous';

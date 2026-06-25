const fs = require('fs');
let appJs = fs.readFileSync('C:\\Users\\mouha\\OneDrive\\Desktop\\Thiés à Table\\app.js', 'utf8');

const subscriptionBlock = `
    else if (dashboardActiveTab === 'subscription') {
        const currentDate = new Date();
        const createdAt = new Date(r.createdAt || '2026-06-25T00:00:00Z');
        const diffTime = Math.abs(currentDate - createdAt);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const daysLeft = Math.max(0, 90 - diffDays);
        
        let freePeriodHtml = '';
        if (daysLeft > 0) {
            freePeriodHtml = \`
                <div style="background: linear-gradient(135deg, var(--success) 0%, #20c997 100%); color: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <h3 style="margin: 0 0 0.5rem 0; font-size: 1.4rem;">🎉 Période de Gratuité en cours</h3>
                        <p style="margin: 0; font-size: 1rem; opacity: 0.9;">Il vous reste <strong>\${daysLeft} jours</strong> d'accès gratuit. Profitez-en pour développer votre chiffre d'affaires !</p>
                    </div>
                    <div style="font-size: 2.5rem;">🎁</div>
                </div>
            \`;
        } else {
            freePeriodHtml = \`
                <div style="background: linear-gradient(135deg, var(--danger) 0%, #ff4b4b 100%); color: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <h3 style="margin: 0 0 0.5rem 0; font-size: 1.4rem;">⚠️ Période d'essai terminée</h3>
                        <p style="margin: 0; font-size: 1rem; opacity: 0.9;">Vos 3 mois gratuits sont écoulés. <strong>Votre restaurant a été automatiquement désactivé de l'application client.</strong> Veuillez souscrire à l'un de nos forfaits pour réactiver votre boutique.</p>
                    </div>
                    <div style="font-size: 2.5rem;">🔒</div>
                </div>
            \`;
        }
        
        panel.innerHTML = \`
            <div style="background: var(--bg-card); padding: 2rem; border-radius: 20px; box-shadow: var(--shadow); max-width: 1000px; margin: 0 auto;">
                <h2 style="margin-bottom: 1rem; color: var(--text-primary); font-size: 1.8rem; font-weight: 800; border-bottom: 2px solid var(--border); padding-bottom: 0.5rem;">💳 Mon Abonnement & Visibilité</h2>
                
                \${freePeriodHtml}

                <h3 style="margin-bottom: 0.5rem; color: var(--text-primary); font-size: 1.3rem;">Des forfaits Gagnant-Gagnant</h3>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">Nos tarifs sont pensés pour s'adapter à la taille de votre activité. Vous ne payez que pour les outils qui vous font grandir.</p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
                    <!-- Pack Simple -->
                    <div style="border: 2px solid var(--border); border-radius: 16px; padding: 1.5rem; display: flex; flex-direction: column; transition: transform 0.3s ease; background: var(--bg-secondary);">
                        <h4 style="margin: 0 0 0.5rem 0; font-size: 1.3rem; color: var(--text-primary);">Pack Simple</h4>
                        <div style="font-size: 1.8rem; font-weight: 800; color: var(--primary); margin-bottom: 0.5rem;">3 000 <span style="font-size: 1rem; color: var(--text-secondary); font-weight: 600;">FCFA / mois</span></div>
                        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">L'essentiel pour exister en ligne et recevoir des commandes.</p>
                        <ul style="list-style: none; padding: 0; margin: 0 0 1.5rem 0; flex-grow: 1; color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6;">
                            <li style="margin-bottom: 0.5rem;">✅ Menu digital accessible 24/7</li>
                            <li style="margin-bottom: 0.5rem;">✅ Réception illimitée de commandes</li>
                            <li style="margin-bottom: 0.5rem;">✅ Visibilité standard sur l'application</li>
                            <li style="margin-bottom: 0.5rem;">✅ Rapport d'activité trimestriel</li>
                            <li style="margin-bottom: 0.5rem;">✅ Support technique par e-mail</li>
                        </ul>
                        <button class="btn btn-outline" style="width: 100%;" onclick="alert('Fonctionnalité de souscription bientôt disponible.')">Choisir ce Pack</button>
                    </div>

                    <!-- Pack Startup -->
                    <div style="border: 2px solid var(--primary); border-radius: 16px; padding: 1.5rem; display: flex; flex-direction: column; position: relative; background: rgba(var(--primary-rgb), 0.03); box-shadow: 0 10px 25px rgba(var(--primary-rgb), 0.1);">
                        <div style="position: absolute; top: -12px; right: 20px; background: var(--primary); color: white; padding: 0.2rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 700;">Recommandé</div>
                        <h4 style="margin: 0 0 0.5rem 0; font-size: 1.3rem; color: var(--text-primary);">Pack Startup</h4>
                        <div style="font-size: 1.8rem; font-weight: 800; color: var(--primary); margin-bottom: 0.5rem;">5 000 <span style="font-size: 1rem; color: var(--text-secondary); font-weight: 600;">FCFA / mois</span></div>
                        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">Pour booster vos ventes avec une meilleure visibilité.</p>
                        <ul style="list-style: none; padding: 0; margin: 0 0 1.5rem 0; flex-grow: 1; color: var(--text-primary); font-size: 0.95rem; line-height: 1.6; font-weight: 500;">
                            <li style="margin-bottom: 0.5rem;">✅ <strong>Tout du Pack Simple</strong></li>
                            <li style="margin-bottom: 0.5rem;">🚀 <strong>Positionnement prioritaire</strong> dans votre catégorie</li>
                            <li style="margin-bottom: 0.5rem;">⭐ Badge "Restaurant Certifié"</li>
                            <li style="margin-bottom: 0.5rem;">📊 Rapport détaillé des ventes (Mensuel)</li>
                            <li style="margin-bottom: 0.5rem;">💬 Support direct et rapide via WhatsApp</li>
                        </ul>
                        <button class="btn btn-primary" style="width: 100%;" onclick="alert('Fonctionnalité de souscription bientôt disponible.')">Choisir ce Pack</button>
                    </div>

                    <!-- Pack Entreprise -->
                    <div style="border: 2px solid var(--accent); border-radius: 16px; padding: 1.5rem; display: flex; flex-direction: column; background: rgba(var(--accent-rgb), 0.03);">
                        <h4 style="margin: 0 0 0.5rem 0; font-size: 1.3rem; color: var(--text-primary);">Pack Entreprise</h4>
                        <div style="font-size: 1.8rem; font-weight: 800; color: var(--accent); margin-bottom: 0.5rem;">15 000 <span style="font-size: 1rem; color: var(--text-secondary); font-weight: 600;">FCFA / mois</span></div>
                        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">La solution complète pour dominer le marché local.</p>
                        <ul style="list-style: none; padding: 0; margin: 0 0 1.5rem 0; flex-grow: 1; color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6;">
                            <li style="margin-bottom: 0.5rem;">✅ <strong>Tout du Pack Startup</strong></li>
                            <li style="margin-bottom: 0.5rem;">📢 <strong>Bannière publicitaire</strong> sur l'accueil</li>
                            <li style="margin-bottom: 0.5rem;">📱 1 Post sponsorisé par mois sur nos réseaux</li>
                            <li style="margin-bottom: 0.5rem;">🎁 Outils de fidélisation (Coupons promo)</li>
                            <li style="margin-bottom: 0.5rem;">📈 Statistiques avancées (Hebdomadaire)</li>
                        </ul>
                        <button class="btn btn-outline" style="width: 100%; border-color: var(--accent); color: var(--accent);" onclick="alert('Fonctionnalité de souscription bientôt disponible.')">Choisir ce Pack</button>
                    </div>
                </div>
            </div>
        \`;
    }
`;

// Insert the subscriptionBlock just before the end of renderDashboardTabContent
appJs = appJs.replace(
    /\}\s*\n\/\/ Global helper for accounting search filtering/,
    subscriptionBlock + '\n}\n\n// Global helper for accounting search filtering'
);

// We should also replace the admin table to show everyone on free tier.
const oldAdminTableRegex = /<table style="width: 100%; border-collapse: collapse; min-width: 600px;">[\s\S]*?<\/table>/;
const newAdminTable = `
                    <table style="width: 100%; border-collapse: collapse; min-width: 600px;">
                        <thead>
                            <tr style="background: var(--bg-secondary); text-align: left; border-bottom: 2px solid var(--border);">
                                <th style="padding: 1rem;">Restaurant</th>
                                <th style="padding: 1rem;">Statut Gratuité</th>
                                <th style="padding: 1rem;">Pack Souscrit</th>
                                <th style="padding: 1rem;">Revenu (Mensuel)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid var(--border);">
                                <td style="padding: 1rem;"><strong>La Licorne</strong></td>
                                <td style="padding: 1rem;"><span class="badge badge-success">En cours (90 jrs restants)</span></td>
                                <td style="padding: 1rem;"><span class="badge" style="background: #e2e8f0; color: #64748b;">Aucun (Gratuit)</span></td>
                                <td style="padding: 1rem; font-weight: 700; color: var(--text-secondary);">0 FCFA</td>
                            </tr>
                            <tr style="border-bottom: 1px solid var(--border);">
                                <td style="padding: 1rem;"><strong>L'Épicurien</strong></td>
                                <td style="padding: 1rem;"><span class="badge badge-success">En cours (89 jrs restants)</span></td>
                                <td style="padding: 1rem;"><span class="badge" style="background: #e2e8f0; color: #64748b;">Aucun (Gratuit)</span></td>
                                <td style="padding: 1rem; font-weight: 700; color: var(--text-secondary);">0 FCFA</td>
                            </tr>
                            <tr style="border-bottom: 1px solid var(--border);">
                                <td style="padding: 1rem;"><strong>Complexe ABOUL ABBAS</strong></td>
                                <td style="padding: 1rem;"><span class="badge badge-success">En cours (90 jrs restants)</span></td>
                                <td style="padding: 1rem;"><span class="badge" style="background: #e2e8f0; color: #64748b;">Aucun (Gratuit)</span></td>
                                <td style="padding: 1rem; font-weight: 700; color: var(--text-secondary);">0 FCFA</td>
                            </tr>
                            <tr style="border-bottom: 1px solid var(--border);">
                                <td style="padding: 1rem;"><strong>Massa Massa</strong></td>
                                <td style="padding: 1rem;"><span class="badge badge-success">En cours (85 jrs restants)</span></td>
                                <td style="padding: 1rem;"><span class="badge" style="background: #e2e8f0; color: #64748b;">Aucun (Gratuit)</span></td>
                                <td style="padding: 1rem; font-weight: 700; color: var(--text-secondary);">0 FCFA</td>
                            </tr>
                        </tbody>
                    </table>
`;
appJs = appJs.replace(oldAdminTableRegex, newAdminTable);

// We also need to fix the Revenue total at the top of the admin table
appJs = appJs.replace(
    /Revenus Plateforme: 23 000 FCFA \/ mois/,
    'Revenus Plateforme: 0 FCFA / mois'
);

fs.writeFileSync('C:\\Users\\mouha\\OneDrive\\Desktop\\Thiés à Table\\app.js', appJs);
console.log('Successfully injected subscription tab and updated admin table.');

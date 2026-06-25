const fs = require('fs');
let appJs = fs.readFileSync('C:\\Users\\mouha\\OneDrive\\Desktop\\Thiés à Table\\app.js', 'utf8');

const regexAdminView = /function renderAdminView\(\) \{[\s\S]*?<\/table>\s*<\/div>\s*<\/section>/;

if (regexAdminView.test(appJs)) {
    const adminSubscriptionsHtml = `
        <!-- Section Abonnements -->
        <section style="background: var(--bg-card); padding: 1.5rem; border-radius: 12px; box-shadow: var(--shadow); margin-bottom: 2rem;">
            <h3 style="margin-top: 0; color: var(--text-primary); border-bottom: 2px solid var(--border); padding-bottom: 0.5rem; display: flex; justify-content: space-between;">
                <span>💳 Abonnements & Revenus Plateforme</span>
                <span style="color: var(--success); font-weight: 800;">Total Estimé: 18 000 FCFA / mois</span>
            </h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">Suivi des packs d'hébergement souscrits par les restaurants après leurs 3 mois gratuits.</p>
            <div style="overflow-x: auto;">
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
                        <!-- Mocked data for demo purposes, since actual subscription tracking requires database changes -->
                        <tr style="border-bottom: 1px solid var(--border);">
                            <td style="padding: 1rem;"><strong>La Licorne</strong></td>
                            <td style="padding: 1rem;"><span class="badge badge-warning">Terminée</span></td>
                            <td style="padding: 1rem;"><span class="badge badge-primary">Pack Startup</span></td>
                            <td style="padding: 1rem; font-weight: 700; color: var(--success);">5 000 FCFA</td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--border);">
                            <td style="padding: 1rem;"><strong>L'Épicurien</strong></td>
                            <td style="padding: 1rem;"><span class="badge badge-warning">Terminée</span></td>
                            <td style="padding: 1rem;"><span class="badge badge-primary">Pack Simple</span></td>
                            <td style="padding: 1rem; font-weight: 700; color: var(--success);">3 000 FCFA</td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--border);">
                            <td style="padding: 1rem;"><strong>Complexe ABOUL ABBAS</strong></td>
                            <td style="padding: 1rem;"><span class="badge badge-success">En cours (2 mois restants)</span></td>
                            <td style="padding: 1rem;"><span class="badge" style="background: #e2e8f0; color: #64748b;">Aucun (Gratuit)</span></td>
                            <td style="padding: 1rem; font-weight: 700; color: var(--text-secondary);">0 FCFA</td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--border);">
                            <td style="padding: 1rem;"><strong>Massa Massa</strong></td>
                            <td style="padding: 1rem;"><span class="badge badge-warning">Terminée</span></td>
                            <td style="padding: 1rem;"><span class="badge" style="background: var(--accent); color: white;">Pack Entreprise</span></td>
                            <td style="padding: 1rem; font-weight: 700; color: var(--success);">15 000 FCFA</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    `;

    appJs = appJs.replace(regexAdminView, match => match + '\n' + adminSubscriptionsHtml);
    fs.writeFileSync('C:\\Users\\mouha\\OneDrive\\Desktop\\Thiés à Table\\app.js', appJs);
    console.log('Added Admin Subscriptions UI');
} else {
    console.log('Could not find renderAdminView table end');
}

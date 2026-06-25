const fs = require('fs');
let appJs = fs.readFileSync('C:\\Users\\mouha\\OneDrive\\Desktop\\Thiés à Table\\app.js', 'utf8');

appJs = appJs.replace(
    /if \(!currentRestaurantSession && isSuperAdminSession\) \{\s*currentRestaurantSession = store\.getRestaurantById\("r18"\);\s*\/\/\s*fallback\s*\}/g,
    `// Fallback removed`
);

// We need to add the "Abonnement" button to the restaurant dashboard sidebar
appJs = appJs.replace(
    /<button class="sidebar-btn \$\{dashboardActiveTab === 'settings' \? 'active' : ''\}" onclick="switchDashboardTab\('settings'\)">⚙️ Paramètres<\/button>/g,
    `<button class="sidebar-btn \${dashboardActiveTab === 'settings' ? 'active' : ''}" onclick="switchDashboardTab('settings')">⚙️ Paramètres</button>
                <button class="sidebar-btn \${dashboardActiveTab === 'subscription' ? 'active' : ''}" onclick="switchDashboardTab('subscription')">💳 Abonnement</button>`
);

// Add the highlight logic for subscription
appJs = appJs.replace(
    /const label = tab === 'orders' \? 'commandes' : tab === 'reservations' \? 'réservations' : tab === 'menu' \? 'plats' : tab === 'reviews' \? 'avis' : tab === 'accounting' \? 'comptabilité' : 'paramètres';/,
    `const label = tab === 'orders' ? 'commandes' : tab === 'reservations' ? 'réservations' : tab === 'menu' ? 'plats' : tab === 'reviews' ? 'avis' : tab === 'accounting' ? 'comptabilité' : tab === 'subscription' ? 'abonnement' : 'paramètres';`
);

fs.writeFileSync('C:\\Users\\mouha\\OneDrive\\Desktop\\Thiés à Table\\app.js', appJs);
console.log('Removed r18 fallback and added abonnement tab to sidebar');

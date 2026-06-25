const fs = require('fs');
let appJs = fs.readFileSync('C:\\Users\\mouha\\OneDrive\\Desktop\\Thiés à Table\\app.js', 'utf8');

// 1. Fix impersonateRestaurant to save to sessionStorage
appJs = appJs.replace(
    /currentRestaurantSession = r;\s+showToast\(\`Session administrateur/g,
    `currentRestaurantSession = r;\n    sessionStorage.setItem('restaurantSession', JSON.stringify(r));\n    showToast(\`Session administrateur`
);

appJs = appJs.replace(
    /currentRestaurantSession = null;\s+showToast\("Retour à la console Super-Admin"/g,
    `currentRestaurantSession = null;\n    sessionStorage.removeItem('restaurantSession');\n    showToast("Retour à la console Super-Admin"`
);

// 2. Remove simulated orders logic
// Find the block:
// // 2. Générer des commandes simulées aléatoirement
// if (this.data.orders.length === 0) {
// ...
// SEED_ORDERS.forEach(o => this.data.orders.push(o));
// }

appJs = appJs.replace(
    /\/\/ 2\. Générer des commandes simulées aléatoirement[\s\S]*?SEED_ORDERS\.forEach\(o => this\.data\.orders\.push\(o\)\);\n            }/,
    `// 2. Pas de commandes simulées\n            if (this.data.orders.length === 0) {\n                // Removed fake orders\n            }`
);

// Also let's clear SEED_ORDERS just in case
appJs = appJs.replace(
    /const SEED_ORDERS = \[[\s\S]*?\];/,
    `const SEED_ORDERS = [];`
);

fs.writeFileSync('C:\\Users\\mouha\\OneDrive\\Desktop\\Thiés à Table\\app.js', appJs);
console.log("Patched successfully!");

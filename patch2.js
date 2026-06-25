const fs = require('fs');
let appJs = fs.readFileSync('C:\\Users\\mouha\\OneDrive\\Desktop\\Thiés à Table\\app.js', 'utf8');
const tempMenu = fs.readFileSync('C:\\Users\\mouha\\OneDrive\\Desktop\\Thiés à Table\\temp_menu.json', 'utf8');

const newResto = `, { id: "r20", name: "Complexe ABOUL ABBAS", slug: "complexe-aboul-abbas", rating: 5.0, reviewsCount: 0, category: "Traditionnel", address: "À préciser", whatsapp: "À préciser", lat: 14.7950, lng: -16.9250, openHours: "08:00 - 23:00", closedDays: [], isOpenManual: true, status: "active", menu: ${tempMenu} }`;

appJs = appJs.replace(
    /({ id: "r19", name: "Biba Food"[^}]*})(\r?\n];)/,
    `$1${newResto}$2`
);
fs.writeFileSync('C:\\Users\\mouha\\OneDrive\\Desktop\\Thiés à Table\\app.js', appJs);
console.log('Patched!');

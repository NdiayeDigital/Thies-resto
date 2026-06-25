const fs = require('fs');
let appJs = fs.readFileSync('C:\\Users\\mouha\\OneDrive\\Desktop\\Thiés à Table\\app.js', 'utf8');

const tempMenu = fs.readFileSync('C:\\Users\\mouha\\OneDrive\\Desktop\\Thiés à Table\\temp_menu.json', 'utf8');

const newResto = `
    { id: "r20", name: "Complexe ABOUL ABBAS", slug: "complexe-aboul-abbas", rating: 5.0, reviewsCount: 0, category: "Traditionnel", address: "À préciser", whatsapp: "À préciser", lat: 14.7950, lng: -16.9250, openHours: "08:00 - 23:00", closedDays: [], isOpenManual: true, status: "active", menu: ${tempMenu} }
`;

// Insert into SEED_RESTAURANTS array
appJs = appJs.replace(
    /({ id: "r19", name: "Biba Food".*?\n)(];)/g,
    `$1    ,${newResto}\n$2`
);

// Fix seed logic to accept custom menu
appJs = appJs.replace(
    /coverImage: RESTAURANT_COVERS\[r\.id\] \|\| COVER_IMAGES\[r\.category\] \|\| COVER_IMAGES\["Traditionnel"\],\s+menu,\s+reviews/g,
    `coverImage: RESTAURANT_COVERS[r.id] || COVER_IMAGES[r.category] || COVER_IMAGES["Traditionnel"],
                menu: r.menu || menu,
                reviews`
);

fs.writeFileSync('C:\\Users\\mouha\\OneDrive\\Desktop\\Thiés à Table\\app.js', appJs);
console.log('App.js patched successfully!');

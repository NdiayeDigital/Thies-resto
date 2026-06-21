const COVER_IMAGES = {
    "Traditionnel": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60",
    "Grillades / Dibi": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=60",
    "Fast Food": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&auto=format&fit=crop&q=60",
    "Pâtisserie": "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=600&auto=format&fit=crop&q=60",
    "Gastronomique": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&auto=format&fit=crop&q=60"
};

// Unique cover per restaurant (alternating within categories)
const RESTAURANT_COVERS = {
    "r1": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=60",
    "r2": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=60",
    "r3": "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&auto=format&fit=crop&q=60",
    "r4": "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&auto=format&fit=crop&q=60",
    "r5": "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=600&auto=format&fit=crop&q=60",
    "r6": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=60",
    "r7": "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&auto=format&fit=crop&q=60",
    "r8": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&auto=format&fit=crop&q=60",
    "r9": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&auto=format&fit=crop&q=60",
    "r10": "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&auto=format&fit=crop&q=60",
    "r11": "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=600&auto=format&fit=crop&q=60",
    "r12": "https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=600&auto=format&fit=crop&q=60",
    "r13": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=60",
    "r14": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60",
    "r15": "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=600&auto=format&fit=crop&q=60",
    "r16": "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=600&auto=format&fit=crop&q=60",
    "r17": "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=60",
    "r18": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=60",
    "r19": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=60",
    "r20": "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&auto=format&fit=crop&q=60"
};

// Dish image options for admin image selector
const DISH_IMAGE_OPTIONS = [
    { label: "Thiéboudiène / Poisson", url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60" },
    { label: "Yassa / Poulet", url: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=60" },
    { label: "Mafé / Ragoût", url: "https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=60" },
    { label: "Grillades / Dibi", url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60" },
    { label: "Poulet Grillé", url: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=60" },
    { label: "Brochettes", url: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=500&auto=format&fit=crop&q=60" },
    { label: "Burger", url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60" },
    { label: "Chawarma / Wrap", url: "https://images.unsplash.com/photo-1626700051175-6518c4793f06?w=500&auto=format&fit=crop&q=60" },
    { label: "Frites", url: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60" },
    { label: "Pizza", url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60" },
    { label: "Salade", url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&auto=format&fit=crop&q=60" },
    { label: "Poisson Grillé", url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60" },
    { label: "Croissant / Pâtisserie", url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=60" },
    { label: "Pain au Chocolat", url: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500&auto=format&fit=crop&q=60" },
    { label: "Petit-Déjeuner", url: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=500&auto=format&fit=crop&q=60" },
    { label: "Dessert / Chocolat", url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60" },
    { label: "Boisson / Jus", url: "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60" },
    { label: "Jus de Bouye", url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60" },
    { label: "Riz Sénégalais", url: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=500&auto=format&fit=crop&q=60" },
    { label: "URL personnalisée", url: "" }
];

// Default Menu templates by Category
const MENU_TEMPLATES = {
    "Traditionnel": [
        { id: 'dish_1', name: 'Thiéboudiène Penda Mbaye', description: 'Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce.', price: 2500, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60' },
        { id: 'dish_2', name: 'Yassa Poulet au Feu de Bois', description: 'Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé.', price: 2200, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=60' },
        { id: 'dish_3', name: 'Mafé Viande de Bœuf', description: 'Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d\'arachide locale, riz blanc.', price: 2000, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=60' },
        { id: 'dish_4', name: 'Jus de Bissap Glacé', description: 'Boisson rafraîchissante maison à base d\'infusion de fleurs d\'hibiscus séchées, menthe et sucre.', price: 500, image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60' },
        { id: 'dish_5', name: 'Jus de Bouye (Pain de Singe)', description: 'Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré.', price: 500, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60' }
    ],
    "Grillades / Dibi": [
        { id: 'dish_6', name: 'Dibi d\'Agneau Traditionnel (Portion)', description: 'Viande d\'agneau coupée en morceaux, marinée et grillée façon dibiterie, servie avec oignons et piment.', price: 4500, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60' },
        { id: 'dish_7', name: 'Dibi de Poulet (Demi Poulet)', description: 'Demi-poulet mariné aux épices locales et grillé lentement, accompagné d\'oignons émincés.', price: 3500, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=60' },
        { id: 'dish_8', name: 'Merguez Braisées de Thiès', description: 'Brochettes de merguez maison grillées, servies avec frites croustillantes.', price: 2500, image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=500&auto=format&fit=crop&q=60' },
        { id: 'dish_4', name: 'Jus de Bissap Glacé', description: 'Infusion de fleurs d\'hibiscus séchées parfumée à la menthe.', price: 500, image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60' }
    ],
    "Fast Food": [
        { id: 'dish_9', name: 'Burger Teranga Double Cheese', description: 'Pain artisanal, double steak de bœuf haché, double cheddar fondu, sauce maison.', price: 2000, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60' },
        { id: 'dish_10', name: 'Chawarma Poulet Fromage', description: 'Pain libanais roulé garni de poulet émincé grillé, frites maison, crème d\'ail et fromage.', price: 1500, image: 'https://images.unsplash.com/photo-1626700051175-6518c4793f06?w=500&auto=format&fit=crop&q=60' },
        { id: 'dish_11', name: 'Frites Maison (Portion XXL)', description: 'Pommes de terre fraîches coupées à la main et frites dorées aux herbes aromatiques.', price: 800, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60' },
        { id: 'dish_5', name: 'Jus de Bouye', description: 'Jus onctueux à base de fruit de baobab.', price: 500, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60' }
    ],
    "Pâtisserie": [
        { id: 'dish_12', name: 'Croissant Beurre Français', description: 'Feuilletage croustillant pur beurre, doré à souhait.', price: 500, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=60' },
        { id: 'dish_13', name: 'Pain au Chocolat (Chocolatine)', description: 'Viennoiserie feuilletée avec deux barres de chocolat noir.', price: 600, image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500&auto=format&fit=crop&q=60' },
        { id: 'dish_14', name: 'Formule Petit-Déjeuner Express', description: 'Un café Touba ou expresso, un croissant, et un verre de jus frais d\'orange.', price: 1500, image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=500&auto=format&fit=crop&q=60' }
    ],
    "Gastronomique": [
        { id: 'dish_15', name: 'Lotte rôtie sauce vanille de Casamance', description: 'Médaillon de lotte poêlé, purée fine de patate douce et émulsion à la vanille.', price: 7500, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60' },
        { id: 'dish_16', name: 'Filet de Bœuf braisé au Café Touba', description: 'Filet tendre de bœuf du pays, sauce corsée infusée au café Touba et poivre de Selim, petits légumes.', price: 8000, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60' },
        { id: 'dish_17', name: 'Moelleux au Chocolat & Coulis Bissap', description: 'Dessert gourmand au cœur coulant, parfumé d\'un coulis acidulé au bissap rouge.', price: 2500, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60' }
    ]
};

// Seeding standard reviews
const SAMPLE_REVIEWS = [
    { author: "Abdoulaye Diallo", rating: 5, comment: "Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement.", date: "2026-06-10", reply: "Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes." },
    { author: "Khadija Fall", rating: 4, comment: "Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d'attente à la livraison.", date: "2026-06-12", reply: null },
    { author: "Michel Dupont", rating: 5, comment: "Un trésor caché à Thiès. Le service Teranga est excellent.", date: "2026-06-14", reply: "Merci Michel ! Heureux de vous avoir accueilli." }
];

// Celebration Animation Helper
window.triggerCelebration = function() {
    if (typeof confetti === 'function') {
        const duration = 3000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#ff6b35', '#cfa853', '#4caf50']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#ff6b35', '#cfa853', '#4caf50']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }
};

// Complete Seed Data from rapport_restaurants_thies
const SEED_RESTAURANTS = [
    { id: "r1", username: "croissant-magique", password: "Thies2024",  name: "Croissant Magique", slug: "croissant-magique", rating: 3.9, reviewsCount: 999, category: "Pâtisserie", address: "Avenue Léopold Sédar Senghor, Thiès", whatsapp: "+221339512551", lat: 14.7933, lng: -16.9298, openHours: "07:00 - 22:00", closedDays: [], isOpenManual: true, status: "active" },
    { id: "r2", username: "cafe-du-rail", password: "Thies2024",  name: "Le Café du Rail", slug: "cafe-du-rail", rating: 4.7, reviewsCount: 679, category: "Traditionnel", address: "Près de la Gare ferroviaire de Thiès", whatsapp: "+221773505050", lat: 14.7880, lng: -16.9350, openHours: "08:00 - 23:00", closedDays: [1], isOpenManual: true, status: "active" },
    { id: "r3", username: "restaurant-madiba", password: "Thies2024",  name: "Restaurant Madiba", slug: "restaurant-madiba", rating: 4.3, reviewsCount: 312, category: "Traditionnel", address: "Quartier Escale, Thiès", whatsapp: "+221339542523", lat: 14.7980, lng: -16.9200, openHours: "11:30 - 23:00", closedDays: [], isOpenManual: true, status: "active" },
    { id: "r4", username: "les-delices", password: "Thies2024",  name: "Les Délices", slug: "les-delices", rating: 3.6, reviewsCount: 328, category: "Traditionnel", address: "373 Av. Lamine Gueye, Thiès", whatsapp: "+221339517516", lat: 14.7930, lng: -16.9295, openHours: "24h/24", closedDays: [], isOpenManual: true, status: "active" },
    { id: "r5", username: "obs-resto-chicha", password: "Thies2024",  name: "OBS Resto Chicha", slug: "obs-resto-chicha", rating: 5.0, reviewsCount: 1, category: "Traditionnel", address: "Rue Dr. Birane Beye, Thiès", whatsapp: "+221784269172", lat: 14.7940, lng: -16.9280, openHours: "24h/24", closedDays: [], isOpenManual: true, status: "active" },
    { id: "r6", username: "sams-prestige", password: "Thies2024",  name: "Sam's Prestige", slug: "sams-prestige", rating: 3.5, reviewsCount: 229, category: "Traditionnel", address: "Avenida Léopold Senghor, Thiès", whatsapp: "+221772004699", lat: 14.7950, lng: -16.9300, openHours: "08:00 - 02:00", closedDays: [], isOpenManual: true, status: "active" },
    { id: "r7", username: "ile-de-goree", password: "Thies2024",  name: "Ile de Gorée", slug: "ile-de-goree", rating: 3.9, reviewsCount: 159, category: "Traditionnel", address: "Av. Lamine Gueye, Thiès", whatsapp: "+221339510267", lat: 14.7910, lng: -16.9310, openHours: "08:00 - 04:00", closedDays: [], isOpenManual: true, status: "active" },
    { id: "r8", username: "nadia", password: "Thies2024",  name: "Nadia", slug: "nadia", rating: 4.0, reviewsCount: 0, category: "Traditionnel", address: "Thiès 21000, Sénégal", whatsapp: "+221774640624", lat: 14.7960, lng: -16.9320, openHours: "24h/24", closedDays: [], isOpenManual: true, status: "active" },
    { id: "r9", username: "tacos-de-thies", password: "Thies2024",  name: "Tacos de Thiès", slug: "tacos-de-thies", rating: 3.6, reviewsCount: 74, category: "Fast Food", address: "335 Av. Lamine Gueye, Thiès", whatsapp: "+221761385542", lat: 14.7925, lng: -16.9290, openHours: "11:00 - 02:00", closedDays: [], isOpenManual: true, status: "active" },
    { id: "r10", username: "pamanda", password: "Thies2024",  name: "Pamanda", slug: "pamanda", rating: 4.0, reviewsCount: 366, category: "Traditionnel", address: "Guinth Rue Amadou Sow, Thiès", whatsapp: "+221339521550", lat: 14.8050, lng: -16.9250, openHours: "09:00 - 01:30", closedDays: [], isOpenManual: true, status: "active" },
    { id: "r11", username: "case-a-teranga", password: "Thies2024",  name: "Case à Teranga", slug: "case-a-teranga", rating: 3.9, reviewsCount: 7, category: "Traditionnel", address: "Thiès, Sénégal", whatsapp: "+221773239779", lat: 14.7900, lng: -16.9350, openHours: "09:00 - 00:00", closedDays: [], isOpenManual: true, status: "active" },
    { id: "r12", username: "khayma-teslem", password: "Thies2024",  name: "Restaurant Khayma Teslem", slug: "khayma-teslem", rating: 5.0, reviewsCount: 1, category: "Traditionnel", address: "358 Rocade de Contournement de Thiès", whatsapp: "+221788712020", lat: 14.7800, lng: -16.9500, openHours: "24h/24", closedDays: [], isOpenManual: true, status: "active" },
    { id: "r13", username: "nice-time-complexe", password: "Thies2024",  name: "Nice Time Complexe", slug: "nice-time-complexe", rating: 4.1, reviewsCount: 614, category: "Traditionnel", address: "137 Allée Mawa, M Doucouré, Thiès", whatsapp: "+221339540442", lat: 14.7880, lng: -16.9400, openHours: "12:00 - 23:00", closedDays: [], isOpenManual: true, status: "active" },
    { id: "r16", username: "la-casablancaise", password: "Thies2024",  name: "La Casablancaise", slug: "la-casablancaise", rating: 4.7, reviewsCount: 19, category: "Gastronomique", address: "Quartier Som, Thiès", whatsapp: "+221781056721", lat: 14.7900, lng: -16.9300, openHours: "12:00 - 23:00", closedDays: [1], isOpenManual: true, status: "active" },
    { id: "r17", username: "la-table-des-gourmets", password: "Thies2024",  name: "La Table des Gourmets", slug: "la-table-des-gourmets", rating: 5.0, reviewsCount: 14, category: "Gastronomique", address: "Quartier Grand-Thiès", whatsapp: "+221787846296", lat: 14.7950, lng: -16.9250, openHours: "19:00 - 23:30", closedDays: [1, 2], isOpenManual: true, status: "active" },
    { id: "r18", username: "la-licorne", password: "Thies2024",  name: "La Licorne", slug: "la-licorne", rating: 4.8, reviewsCount: 11, category: "Gastronomique", address: "Zone Résidentielle Escale, Thiès", whatsapp: "+221772012229", lat: 14.8000, lng: -16.9200, openHours: "12:00 - 23:00", closedDays: [1], isOpenManual: true, status: "active" },
    { id: "r19", username: "biba-food", password: "Thies2024",  name: "Biba Food", slug: "biba-food", rating: 5.0, reviewsCount: 9, category: "Fast Food", address: "Quartier Cité Lamy, Thiès", whatsapp: "+221770000000", lat: 14.8050, lng: -16.9100, openHours: "17:00 - 23:00", closedDays: [], isOpenManual: true, status: "active" }
];


const COVER_IMAGES = {
    "Traditionnel": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60",
    "Grillades / Dibi": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=60",
    "Dibiterie": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=60",
    "Fast Food": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&auto=format&fit=crop&q=60",
    "Fast-Food": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&auto=format&fit=crop&q=60",
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
        { id: 'dish_1', name: 'Thiéboudiène Penda Mbaye', description: 'Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce.', price: 2500, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60', isDailySpecial: true, tag: 'Plat du jour' },
        { id: 'dish_2', name: 'Yassa Poulet au Feu de Bois', description: 'Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé.', price: 2200, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=60', isDailySpecial: true, tag: 'Spécialité du Jour' },
        { id: 'dish_3', name: 'Mafé Viande de Bœuf', description: 'Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d\'arachide locale, riz blanc.', price: 2000, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=60' },
        { id: 'dish_4', name: 'Jus de Bissap Glacé', description: 'Boisson rafraîchissante maison à base d\'infusion de fleurs d\'hibiscus séchées, menthe et sucre.', price: 500, image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60' },
        { id: 'dish_5', name: 'Jus de Bouye (Pain de Singe)', description: 'Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré.', price: 500, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60' }
    ],
    "Grillades / Dibi": [
        { id: 'dish_6', name: 'Dibi d\'Agneau Traditionnel (Portion)', description: 'Viande d\'agneau coupée en morceaux, marinée et grillée façon dibiterie, servie avec oignons et piment.', price: 4500, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60', isDailySpecial: true, tag: 'Plat du jour' },
        { id: 'dish_7', name: 'Dibi de Poulet (Demi Poulet)', description: 'Demi-poulet mariné aux épices locales et grillé lentement, accompagné d\'oignons émincés.', price: 3500, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=60' },
        { id: 'dish_8', name: 'Merguez Braisées de Thiès', description: 'Brochettes de merguez maison grillées, servies avec frites croustillantes.', price: 2500, image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=500&auto=format&fit=crop&q=60' },
        { id: 'dish_4', name: 'Jus de Bissap Glacé', description: 'Infusion de fleurs d\'hibiscus séchées parfumée à la menthe.', price: 500, image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60' }
    ],
    "Dibiterie": [
        { id: 'dish_6', name: 'Dibi d\'Agneau Traditionnel (Portion)', description: 'Viande d\'agneau coupée en morceaux, marinée et grillée façon dibiterie, servie avec oignons et piment.', price: 4500, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60', isDailySpecial: true, tag: 'Plat du jour' },
        { id: 'dish_7', name: 'Dibi de Poulet (Demi Poulet)', description: 'Demi-poulet mariné aux épices locales et grillé lentement, accompagné d\'oignons émincés.', price: 3500, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=60' },
        { id: 'dish_8', name: 'Merguez Braisées de Thiès', description: 'Brochettes de merguez maison grillées, servies avec frites croustillantes.', price: 2500, image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=500&auto=format&fit=crop&q=60' },
        { id: 'dish_4', name: 'Jus de Bissap Glacé', description: 'Infusion de fleurs d\'hibiscus séchées parfumée à la menthe.', price: 500, image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60' }
    ],
    "Fast Food": [
        { id: 'dish_9', name: 'Burger Teranga Double Cheese', description: 'Pain artisanal, double steak de bœuf haché, double cheddar fondu, sauce maison.', price: 2000, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60', isDailySpecial: true, tag: 'Plat du jour' },
        { id: 'dish_10', name: 'Chawarma Poulet Fromage', description: 'Pain libanais roulé garni de poulet émincé grillé, frites maison, crème d\'ail et fromage.', price: 1500, image: 'https://images.unsplash.com/photo-1626700051175-6518c4793f06?w=500&auto=format&fit=crop&q=60' },
        { id: 'dish_11', name: 'Frites Maison (Portion XXL)', description: 'Pommes de terre fraîches coupées à la main et frites dorées aux herbes aromatiques.', price: 800, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60' },
        { id: 'dish_5', name: 'Jus de Bouye', description: 'Jus onctueux à base de fruit de baobab.', price: 500, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60' }
    ],
    "Fast-Food": [
        { id: 'dish_9', name: 'Burger Teranga Double Cheese', description: 'Pain artisanal, double steak de bœuf haché, double cheddar fondu, sauce maison.', price: 2000, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60', isDailySpecial: true, tag: 'Plat du jour' },
        { id: 'dish_10', name: 'Chawarma Poulet Fromage', description: 'Pain libanais roulé garni de poulet émincé grillé, frites maison, crème d\'ail et fromage.', price: 1500, image: 'https://images.unsplash.com/photo-1626700051175-6518c4793f06?w=500&auto=format&fit=crop&q=60' },
        { id: 'dish_11', name: 'Frites Maison (Portion XXL)', description: 'Pommes de terre fraîches coupées à la main et frites dorées aux herbes aromatiques.', price: 800, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60' },
        { id: 'dish_5', name: 'Jus de Bouye', description: 'Jus onctueux à base de fruit de baobab.', price: 500, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60' }
    ],
    "Pâtisserie": [
        { id: 'dish_12', name: 'Croissant Beurre Français', description: 'Feuilletage croustillant pur beurre, doré à souhait.', price: 500, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=60', isDailySpecial: true, tag: 'Plat du jour' },
        { id: 'dish_13', name: 'Pain au Chocolat (Chocolatine)', description: 'Viennoiserie feuilletée avec deux barres de chocolat noir.', price: 600, image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500&auto=format&fit=crop&q=60' },
        { id: 'dish_14', name: 'Formule Petit-Déjeuner Express', description: 'Un café Touba ou expresso, un croissant, et un verre de jus frais d\'orange.', price: 1500, image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=500&auto=format&fit=crop&q=60', isDailySpecial: true, tag: 'Formule du Jour' }
    ],
    "Gastronomique": [
        { id: 'dish_15', name: 'Lotte rôtie sauce vanille de Casamance', description: 'Médaillon de lotte poêlé, purée fine de patate douce et émulsion à la vanille.', price: 7500, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60', isDailySpecial: true, tag: 'Plat du jour' },
        { id: 'dish_16', name: 'Filet de Bœuf braisé au Café Touba', description: 'Filet tendre de bœuf du pays, sauce corsée infusée au café Touba et poivre de Selim, petits légumes.', price: 8000, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60', isDailySpecial: true, tag: 'Suggestion du Chef' },
        { id: 'dish_17', name: 'Moelleux au Chocolat & Coulis Bissap', description: 'Dessert gourmand au cœur coulant, parfumé d\'un coulis acidulé au bissap rouge.', price: 2500, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60' }
    ]
};

// Seeding standard reviews
const SAMPLE_REVIEWS = [
    { author: "Abdoulaye Diallo", rating: 5, comment: "Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement.", date: "2026-06-10", reply: "Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes." },
    { author: "Khadija Fall", rating: 4, comment: "Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d'attente à la livraison.", date: "2026-06-12", reply: null },
    { author: "Michel Dupont", rating: 5, comment: "Un trésor caché à Thiès. Le service Teranga est excellent.", date: "2026-06-14", reply: "Merci Michel ! Heureux de vous avoir accueilli." }
];

// Celebration Animation Helper (Lazy-loaded on demand)
window.triggerCelebration = function() {
    const runAnimation = () => {
        if (typeof confetti !== 'function') return;
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
    };

    if (typeof confetti === 'function') {
        runAnimation();
    } else {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
        script.async = true;
        script.onload = runAnimation;
        document.head.appendChild(script);
    }
};

// Complete Seed Data from rapport_restaurants_thies
const SEED_RESTAURANTS = [
    {
        "id":  "r3",
        "name":  "Restaurant Madiba",
        "slug":  "restaurant-madiba",
        "rating":  4.30,
        "reviews_count":  312,
        "category":  "Traditionnel",
        "address":  "Quartier Escale, Thiès",
        "whatsapp":  "+221339542523",
        "open_hours":  "11:30 - 23:00",
        "closed_days":  [

                        ],
        "is_open_manual":  true,
        "status":  "active",
        "username":  "id_restaurantmadiba",
        "cover_image":  "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600\u0026auto=format\u0026fit=crop\u0026q=60",
        "menu":  [
                     {
                         "id":  "dish_1",
                         "name":  "Thiéboudiène Penda Mbaye",
                         "image":  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2500,
                         "description":  "Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce."
                     },
                     {
                         "id":  "dish_2",
                         "name":  "Yassa Poulet au Feu de Bois",
                         "image":  "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2200,
                         "description":  "Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé."
                     },
                     {
                         "id":  "dish_3",
                         "name":  "Mafé Viande de Bœuf",
                         "image":  "https://images.unsplash.com/photo-1547592180-85f173990554?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2000,
                         "description":  "Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d\u0027arachide locale, riz blanc."
                     },
                     {
                         "id":  "dish_4",
                         "name":  "Jus de Bissap Glacé",
                         "image":  "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  500,
                         "description":  "Boisson rafraîchissante maison à base d\u0027infusion de fleurs d\u0027hibiscus séchées, menthe et sucre."
                     },
                     {
                         "id":  "dish_5",
                         "name":  "Jus de Bouye (Pain de Singe)",
                         "image":  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  500,
                         "description":  "Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré."
                     }
                 ],
        "reviews":  [
                        {
                            "id":  "rev_r3_0",
                            "date":  "2026-06-10",
                            "reply":  "Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.",
                            "author":  "Abdoulaye Diallo",
                            "rating":  5,
                            "comment":  "Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement."
                        },
                        {
                            "id":  "rev_r3_1",
                            "date":  "2026-06-12",
                            "reply":  null,
                            "author":  "Khadija Fall",
                            "rating":  4,
                            "comment":  "Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d\u0027attente à la livraison."
                        },
                        {
                            "id":  "rev_r3_2",
                            "date":  "2026-06-14",
                            "reply":  "Merci Michel ! Heureux de vous avoir accueilli.",
                            "author":  "Michel Dupont",
                            "rating":  5,
                            "comment":  "Un trésor caché à Thiès. Le service Teranga est excellent."
                        }
                    ],
        "created_at":  "2026-06-20T03:24:45.203377+00:00",
        "subscription_pack":  "Aucun (Gratuit)",
        "lat":  14.7928,
        "lng":  -16.9260,
        "location":  null,
        "menu_items":  [
                           {
                               "id":  "dish_1",
                               "name":  "Thiéboudiène Penda Mbaye",
                               "price":  2500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce.",
                               "is_available":  true,
                               "restaurant_id":  "r3"
                           },
                           {
                               "id":  "dish_2",
                               "name":  "Yassa Poulet au Feu de Bois",
                               "price":  2200.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé.",
                               "is_available":  true,
                               "restaurant_id":  "r3"
                           },
                           {
                               "id":  "dish_3",
                               "name":  "Mafé Viande de Bœuf",
                               "price":  2000.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1547592180-85f173990554?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d\u0027arachide locale, riz blanc.",
                               "is_available":  true,
                               "restaurant_id":  "r3"
                           },
                           {
                               "id":  "dish_4",
                               "name":  "Jus de Bissap Glacé",
                               "price":  500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Boisson rafraîchissante maison à base d\u0027infusion de fleurs d\u0027hibiscus séchées, menthe et sucre.",
                               "is_available":  true,
                               "restaurant_id":  "r3"
                           },
                           {
                               "id":  "dish_5",
                               "name":  "Jus de Bouye (Pain de Singe)",
                               "price":  500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré.",
                               "is_available":  true,
                               "restaurant_id":  "r3"
                           }
                       ]
    },
    {
        "id":  "r4",
        "name":  "Les Délices",
        "slug":  "les-delices",
        "rating":  3.60,
        "reviews_count":  328,
        "category":  "Traditionnel",
        "address":  "373 Av. Lamine Gueye, Thiès",
        "whatsapp":  "+221339517516",
        "open_hours":  "24h/24",
        "closed_days":  [

                        ],
        "is_open_manual":  true,
        "status":  "active",
        "username":  "id_lesdelices",
        "cover_image":  "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600\u0026auto=format\u0026fit=crop\u0026q=60",
        "menu":  [
                     {
                         "id":  "dish_1",
                         "name":  "Thiéboudiène Penda Mbaye",
                         "image":  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2500,
                         "description":  "Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce."
                     },
                     {
                         "id":  "dish_2",
                         "name":  "Yassa Poulet au Feu de Bois",
                         "image":  "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2200,
                         "description":  "Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé."
                     },
                     {
                         "id":  "dish_3",
                         "name":  "Mafé Viande de Bœuf",
                         "image":  "https://images.unsplash.com/photo-1547592180-85f173990554?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2000,
                         "description":  "Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d\u0027arachide locale, riz blanc."
                     },
                     {
                         "id":  "dish_4",
                         "name":  "Jus de Bissap Glacé",
                         "image":  "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  500,
                         "description":  "Boisson rafraîchissante maison à base d\u0027infusion de fleurs d\u0027hibiscus séchées, menthe et sucre."
                     },
                     {
                         "id":  "dish_5",
                         "name":  "Jus de Bouye (Pain de Singe)",
                         "image":  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  500,
                         "description":  "Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré."
                     }
                 ],
        "reviews":  [
                        {
                            "id":  "rev_r4_0",
                            "date":  "2026-06-10",
                            "reply":  "Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.",
                            "author":  "Abdoulaye Diallo",
                            "rating":  5,
                            "comment":  "Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement."
                        },
                        {
                            "id":  "rev_r4_1",
                            "date":  "2026-06-12",
                            "reply":  null,
                            "author":  "Khadija Fall",
                            "rating":  4,
                            "comment":  "Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d\u0027attente à la livraison."
                        },
                        {
                            "id":  "rev_r4_2",
                            "date":  "2026-06-14",
                            "reply":  "Merci Michel ! Heureux de vous avoir accueilli.",
                            "author":  "Michel Dupont",
                            "rating":  5,
                            "comment":  "Un trésor caché à Thiès. Le service Teranga est excellent."
                        }
                    ],
        "created_at":  "2026-06-20T03:24:45.203377+00:00",
        "subscription_pack":  "Aucun (Gratuit)",
        "lat":  14.7928,
        "lng":  -16.9260,
        "location":  null,
        "menu_items":  [
                           {
                               "id":  "dish_1",
                               "name":  "Thiéboudiène Penda Mbaye",
                               "price":  2500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce.",
                               "is_available":  true,
                               "restaurant_id":  "r4"
                           },
                           {
                               "id":  "dish_2",
                               "name":  "Yassa Poulet au Feu de Bois",
                               "price":  2200.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé.",
                               "is_available":  true,
                               "restaurant_id":  "r4"
                           },
                           {
                               "id":  "dish_3",
                               "name":  "Mafé Viande de Bœuf",
                               "price":  2000.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1547592180-85f173990554?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d\u0027arachide locale, riz blanc.",
                               "is_available":  true,
                               "restaurant_id":  "r4"
                           },
                           {
                               "id":  "dish_4",
                               "name":  "Jus de Bissap Glacé",
                               "price":  500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Boisson rafraîchissante maison à base d\u0027infusion de fleurs d\u0027hibiscus séchées, menthe et sucre.",
                               "is_available":  true,
                               "restaurant_id":  "r4"
                           },
                           {
                               "id":  "dish_5",
                               "name":  "Jus de Bouye (Pain de Singe)",
                               "price":  500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré.",
                               "is_available":  true,
                               "restaurant_id":  "r4"
                           }
                       ]
    },
    {
        "id":  "r20",
        "name":  "Le Jardin des Saveurs",
        "slug":  "le-jardin-des-saveurs",
        "rating":  4.60,
        "reviews_count":  7,
        "category":  "Traditionnel",
        "address":  "Près de la Manufacture des Arts Décoratifs, Thiès",
        "whatsapp":  "+221776789012",
        "open_hours":  "12:00 - 22:00",
        "closed_days":  [
                            1
                        ],
        "is_open_manual":  true,
        "status":  "active",
        "username":  "le-jardin-des-saveurs",
        "cover_image":  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600\u0026auto=format\u0026fit=crop\u0026q=60",
        "menu":  [
                     {
                         "id":  "dish_1",
                         "name":  "Thiéboudiène Penda Mbaye",
                         "image":  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2500,
                         "description":  "Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce."
                     },
                     {
                         "id":  "dish_2",
                         "name":  "Yassa Poulet au Feu de Bois",
                         "image":  "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2200,
                         "description":  "Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé."
                     },
                     {
                         "id":  "dish_3",
                         "name":  "Mafé Viande de Bœuf",
                         "image":  "https://images.unsplash.com/photo-1547592180-85f173990554?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2000,
                         "description":  "Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d\u0027arachide locale, riz blanc."
                     },
                     {
                         "id":  "dish_4",
                         "name":  "Jus de Bissap Glacé",
                         "image":  "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  500,
                         "description":  "Boisson rafraîchissante maison à base d\u0027infusion de fleurs d\u0027hibiscus séchées, menthe et sucre."
                     },
                     {
                         "id":  "dish_5",
                         "name":  "Jus de Bouye (Pain de Singe)",
                         "image":  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  500,
                         "description":  "Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré."
                     }
                 ],
        "reviews":  [
                        {
                            "id":  "rev_r20_0",
                            "date":  "2026-06-10",
                            "reply":  "Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.",
                            "author":  "Abdoulaye Diallo",
                            "rating":  5,
                            "comment":  "Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement."
                        },
                        {
                            "id":  "rev_r20_1",
                            "date":  "2026-06-12",
                            "reply":  null,
                            "author":  "Khadija Fall",
                            "rating":  4,
                            "comment":  "Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d\u0027attente à la livraison."
                        },
                        {
                            "id":  "rev_r20_2",
                            "date":  "2026-06-14",
                            "reply":  "Merci Michel ! Heureux de vous avoir accueilli.",
                            "author":  "Michel Dupont",
                            "rating":  5,
                            "comment":  "Un trésor caché à Thiès. Le service Teranga est excellent."
                        }
                    ],
        "created_at":  "2026-06-20T03:24:45.203377+00:00",
        "subscription_pack":  "Aucun (Gratuit)",
        "lat":  14.7928,
        "lng":  -16.9260,
        "location":  null,
        "menu_items":  [
                           {
                               "id":  "dish_1",
                               "name":  "Thiéboudiène Penda Mbaye",
                               "price":  2500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce.",
                               "is_available":  true,
                               "restaurant_id":  "r20"
                           },
                           {
                               "id":  "dish_2",
                               "name":  "Yassa Poulet au Feu de Bois",
                               "price":  2200.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé.",
                               "is_available":  true,
                               "restaurant_id":  "r20"
                           },
                           {
                               "id":  "dish_3",
                               "name":  "Mafé Viande de Bœuf",
                               "price":  2000.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1547592180-85f173990554?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d\u0027arachide locale, riz blanc.",
                               "is_available":  true,
                               "restaurant_id":  "r20"
                           },
                           {
                               "id":  "dish_4",
                               "name":  "Jus de Bissap Glacé",
                               "price":  500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Boisson rafraîchissante maison à base d\u0027infusion de fleurs d\u0027hibiscus séchées, menthe et sucre.",
                               "is_available":  true,
                               "restaurant_id":  "r20"
                           },
                           {
                               "id":  "dish_5",
                               "name":  "Jus de Bouye (Pain de Singe)",
                               "price":  500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré.",
                               "is_available":  true,
                               "restaurant_id":  "r20"
                           }
                       ]
    },
    {
        "id":  "r1",
        "name":  "Croissant Magique",
        "slug":  "croissant-magique",
        "rating":  3.90,
        "reviews_count":  999,
        "category":  "Pâtisserie",
        "address":  "Avenue Léopold Sédar Senghor, Thiès",
        "whatsapp":  "+221339512551",
        "open_hours":  "07:00 - 22:00",
        "closed_days":  [

                        ],
        "is_open_manual":  true,
        "status":  "active",
        "username":  "id_croissantmagique",
        "cover_image":  "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600\u0026auto=format\u0026fit=crop\u0026q=60",
        "menu":  [
                     {
                         "id":  "dish_12",
                         "name":  "Croissant Beurre Français",
                         "image":  "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  500,
                         "description":  "Feuilletage croustillant pur beurre, doré à souhait."
                     },
                     {
                         "id":  "dish_13",
                         "name":  "Pain au Chocolat (Chocolatine)",
                         "image":  "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  600,
                         "description":  "Viennoiserie feuilletée avec deux barres de chocolat noir."
                     },
                     {
                         "id":  "dish_14",
                         "name":  "Formule Petit-Déjeuner Express",
                         "image":  "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  1500,
                         "description":  "Un café Touba ou expresso, un croissant, et un verre de jus frais d\u0027orange."
                     }
                 ],
        "reviews":  [
                        {
                            "id":  "rev_r1_0",
                            "date":  "2026-06-10",
                            "reply":  "Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.",
                            "author":  "Abdoulaye Diallo",
                            "rating":  5,
                            "comment":  "Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement."
                        },
                        {
                            "id":  "rev_r1_1",
                            "date":  "2026-06-12",
                            "reply":  null,
                            "author":  "Khadija Fall",
                            "rating":  4,
                            "comment":  "Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d\u0027attente à la livraison."
                        },
                        {
                            "id":  "rev_r1_2",
                            "date":  "2026-06-14",
                            "reply":  "Merci Michel ! Heureux de vous avoir accueilli.",
                            "author":  "Michel Dupont",
                            "rating":  5,
                            "comment":  "Un trésor caché à Thiès. Le service Teranga est excellent."
                        }
                    ],
        "created_at":  "2026-06-20T03:24:45.203377+00:00",
        "subscription_pack":  "Aucun (Gratuit)",
        "lat":  14.7928,
        "lng":  -16.9260,
        "location":  null,
        "menu_items":  [
                           {
                               "id":  "dish_12",
                               "name":  "Croissant Beurre Français",
                               "price":  500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Feuilletage croustillant pur beurre, doré à souhait.",
                               "is_available":  true,
                               "restaurant_id":  "r1"
                           },
                           {
                               "id":  "dish_13",
                               "name":  "Pain au Chocolat (Chocolatine)",
                               "price":  600.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Viennoiserie feuilletée avec deux barres de chocolat noir.",
                               "is_available":  true,
                               "restaurant_id":  "r1"
                           },
                           {
                               "id":  "dish_14",
                               "name":  "Formule Petit-Déjeuner Express",
                               "price":  1500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Un café Touba ou expresso, un croissant, et un verre de jus frais d\u0027orange.",
                               "is_available":  true,
                               "restaurant_id":  "r1"
                           }
                       ]
    },
    {
        "id":  "r18",
        "name":  "La Licorne",
        "slug":  "la-licorne",
        "rating":  4.80,
        "reviews_count":  11,
        "category":  "Gastronomique",
        "address":  "Zone Résidentielle Escale, Thiès",
        "whatsapp":  "+221772012229",
        "open_hours":  "12:00 - 23:00",
        "closed_days":  [
                            1
                        ],
        "is_open_manual":  true,
        "status":  "active",
        "username":  "id_lalicorne",
        "cover_image":  "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600\u0026auto=format\u0026fit=crop\u0026q=60",
        "menu":  [
                     {
                         "id":  "dish_15",
                         "name":  "Lotte rôtie sauce vanille de Casamance",
                         "image":  "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  7500,
                         "description":  "Médaillon de lotte poêlé, purée fine de patate douce et émulsion à la vanille."
                     },
                     {
                         "id":  "dish_16",
                         "name":  "Filet de Bœuf braisé au Café Touba",
                         "image":  "https://images.unsplash.com/photo-1544025162-d76694265947?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  8000,
                         "description":  "Filet tendre de bœuf du pays, sauce corsée infusée au café Touba et poivre de Selim, petits légumes."
                     },
                     {
                         "id":  "dish_17",
                         "name":  "Moelleux au Chocolat \u0026 Coulis Bissap",
                         "image":  "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2500,
                         "description":  "Dessert gourmand au cœur coulant, parfumé d\u0027un coulis acidulé au bissap rouge."
                     }
                 ],
        "reviews":  [
                        {
                            "id":  "rev_r18_0",
                            "date":  "2026-06-10",
                            "reply":  "Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.",
                            "author":  "Abdoulaye Diallo",
                            "rating":  5,
                            "comment":  "Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement."
                        },
                        {
                            "id":  "rev_r18_1",
                            "date":  "2026-06-12",
                            "reply":  null,
                            "author":  "Khadija Fall",
                            "rating":  4,
                            "comment":  "Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d\u0027attente à la livraison."
                        },
                        {
                            "id":  "rev_r18_2",
                            "date":  "2026-06-14",
                            "reply":  "Merci Michel ! Heureux de vous avoir accueilli.",
                            "author":  "Michel Dupont",
                            "rating":  5,
                            "comment":  "Un trésor caché à Thiès. Le service Teranga est excellent."
                        }
                    ],
        "created_at":  "2026-06-20T03:24:45.203377+00:00",
        "subscription_pack":  "Aucun (Gratuit)",
        "lat":  14.7928,
        "lng":  -16.9260,
        "location":  null,
        "menu_items":  [
                           {
                               "id":  "dish_15",
                               "name":  "Lotte rôtie sauce vanille de Casamance",
                               "price":  7500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Médaillon de lotte poêlé, purée fine de patate douce et émulsion à la vanille.",
                               "is_available":  true,
                               "restaurant_id":  "r18"
                           },
                           {
                               "id":  "dish_16",
                               "name":  "Filet de Bœuf braisé au Café Touba",
                               "price":  8000.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1544025162-d76694265947?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Filet tendre de bœuf du pays, sauce corsée infusée au café Touba et poivre de Selim, petits légumes.",
                               "is_available":  true,
                               "restaurant_id":  "r18"
                           },
                           {
                               "id":  "dish_17",
                               "name":  "Moelleux au Chocolat \u0026 Coulis Bissap",
                               "price":  2500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Dessert gourmand au cœur coulant, parfumé d\u0027un coulis acidulé au bissap rouge.",
                               "is_available":  true,
                               "restaurant_id":  "r18"
                           }
                       ]
    },
    {
        "id":  "r2",
        "name":  "Le Café du Rail",
        "slug":  "cafe-du-rail",
        "rating":  4.70,
        "reviews_count":  679,
        "category":  "Traditionnel",
        "address":  "Près de la Gare ferroviaire de Thiès",
        "whatsapp":  "+221773505050",
        "open_hours":  "08:00 - 23:00",
        "closed_days":  [
                            1
                        ],
        "is_open_manual":  true,
        "status":  "active",
        "username":  "id_lecafedurail",
        "cover_image":  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600\u0026auto=format\u0026fit=crop\u0026q=60",
        "menu":  [
                     {
                         "id":  "dish_1",
                         "name":  "Thiéboudiène Penda Mbaye",
                         "image":  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2500,
                         "description":  "Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce."
                     },
                     {
                         "id":  "dish_2",
                         "name":  "Yassa Poulet au Feu de Bois",
                         "image":  "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2200,
                         "description":  "Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé."
                     },
                     {
                         "id":  "dish_3",
                         "name":  "Mafé Viande de Bœuf",
                         "image":  "https://images.unsplash.com/photo-1547592180-85f173990554?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2000,
                         "description":  "Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d\u0027arachide locale, riz blanc."
                     },
                     {
                         "id":  "dish_4",
                         "name":  "Jus de Bissap Glacé",
                         "image":  "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  500,
                         "description":  "Boisson rafraîchissante maison à base d\u0027infusion de fleurs d\u0027hibiscus séchées, menthe et sucre."
                     },
                     {
                         "id":  "dish_5",
                         "name":  "Jus de Bouye (Pain de Singe)",
                         "image":  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  500,
                         "description":  "Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré."
                     }
                 ],
        "reviews":  [
                        {
                            "id":  "rev_r2_0",
                            "date":  "2026-06-10",
                            "reply":  "Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.",
                            "author":  "Abdoulaye Diallo",
                            "rating":  5,
                            "comment":  "Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement."
                        },
                        {
                            "id":  "rev_r2_1",
                            "date":  "2026-06-12",
                            "reply":  null,
                            "author":  "Khadija Fall",
                            "rating":  4,
                            "comment":  "Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d\u0027attente à la livraison."
                        },
                        {
                            "id":  "rev_r2_2",
                            "date":  "2026-06-14",
                            "reply":  "Merci Michel ! Heureux de vous avoir accueilli.",
                            "author":  "Michel Dupont",
                            "rating":  5,
                            "comment":  "Un trésor caché à Thiès. Le service Teranga est excellent."
                        }
                    ],
        "created_at":  "2026-06-20T03:24:45.203377+00:00",
        "subscription_pack":  "Aucun (Gratuit)",
        "lat":  14.7928,
        "lng":  -16.9260,
        "location":  null,
        "menu_items":  [
                           {
                               "id":  "dish_1",
                               "name":  "Thiéboudiène Penda Mbaye",
                               "price":  2500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce.",
                               "is_available":  true,
                               "restaurant_id":  "r2"
                           },
                           {
                               "id":  "dish_2",
                               "name":  "Yassa Poulet au Feu de Bois",
                               "price":  2200.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé.",
                               "is_available":  true,
                               "restaurant_id":  "r2"
                           },
                           {
                               "id":  "dish_3",
                               "name":  "Mafé Viande de Bœuf",
                               "price":  2000.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1547592180-85f173990554?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d\u0027arachide locale, riz blanc.",
                               "is_available":  true,
                               "restaurant_id":  "r2"
                           },
                           {
                               "id":  "dish_4",
                               "name":  "Jus de Bissap Glacé",
                               "price":  500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Boisson rafraîchissante maison à base d\u0027infusion de fleurs d\u0027hibiscus séchées, menthe et sucre.",
                               "is_available":  true,
                               "restaurant_id":  "r2"
                           },
                           {
                               "id":  "dish_5",
                               "name":  "Jus de Bouye (Pain de Singe)",
                               "price":  500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré.",
                               "is_available":  true,
                               "restaurant_id":  "r2"
                           }
                       ]
    },
    {
        "id":  "r7",
        "name":  "Ile de Gorée",
        "slug":  "ile-de-goree",
        "rating":  3.90,
        "reviews_count":  159,
        "category":  "Traditionnel",
        "address":  "Av. Lamine Gueye, Thiès",
        "whatsapp":  "+221339510267",
        "open_hours":  "08:00 - 04:00",
        "closed_days":  [

                        ],
        "is_open_manual":  true,
        "status":  "active",
        "username":  "id_iledegoree",
        "cover_image":  "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600\u0026auto=format\u0026fit=crop\u0026q=60",
        "menu":  [
                     {
                         "id":  "dish_1",
                         "name":  "Thiéboudiène Penda Mbaye",
                         "image":  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2500,
                         "description":  "Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce."
                     },
                     {
                         "id":  "dish_2",
                         "name":  "Yassa Poulet au Feu de Bois",
                         "image":  "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2200,
                         "description":  "Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé."
                     },
                     {
                         "id":  "dish_3",
                         "name":  "Mafé Viande de Bœuf",
                         "image":  "https://images.unsplash.com/photo-1547592180-85f173990554?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2000,
                         "description":  "Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d\u0027arachide locale, riz blanc."
                     },
                     {
                         "id":  "dish_4",
                         "name":  "Jus de Bissap Glacé",
                         "image":  "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  500,
                         "description":  "Boisson rafraîchissante maison à base d\u0027infusion de fleurs d\u0027hibiscus séchées, menthe et sucre."
                     },
                     {
                         "id":  "dish_5",
                         "name":  "Jus de Bouye (Pain de Singe)",
                         "image":  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  500,
                         "description":  "Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré."
                     }
                 ],
        "reviews":  [
                        {
                            "id":  "rev_r7_0",
                            "date":  "2026-06-10",
                            "reply":  "Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.",
                            "author":  "Abdoulaye Diallo",
                            "rating":  5,
                            "comment":  "Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement."
                        },
                        {
                            "id":  "rev_r7_1",
                            "date":  "2026-06-12",
                            "reply":  null,
                            "author":  "Khadija Fall",
                            "rating":  4,
                            "comment":  "Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d\u0027attente à la livraison."
                        },
                        {
                            "id":  "rev_r7_2",
                            "date":  "2026-06-14",
                            "reply":  "Merci Michel ! Heureux de vous avoir accueilli.",
                            "author":  "Michel Dupont",
                            "rating":  5,
                            "comment":  "Un trésor caché à Thiès. Le service Teranga est excellent."
                        }
                    ],
        "created_at":  "2026-06-20T03:24:45.203377+00:00",
        "subscription_pack":  "Aucun (Gratuit)",
        "lat":  14.7928,
        "lng":  -16.9260,
        "location":  null,
        "menu_items":  [
                           {
                               "id":  "dish_1",
                               "name":  "Thiéboudiène Penda Mbaye",
                               "price":  2500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce.",
                               "is_available":  true,
                               "restaurant_id":  "r7"
                           },
                           {
                               "id":  "dish_2",
                               "name":  "Yassa Poulet au Feu de Bois",
                               "price":  2200.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé.",
                               "is_available":  true,
                               "restaurant_id":  "r7"
                           },
                           {
                               "id":  "dish_3",
                               "name":  "Mafé Viande de Bœuf",
                               "price":  2000.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1547592180-85f173990554?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d\u0027arachide locale, riz blanc.",
                               "is_available":  true,
                               "restaurant_id":  "r7"
                           },
                           {
                               "id":  "dish_4",
                               "name":  "Jus de Bissap Glacé",
                               "price":  500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Boisson rafraîchissante maison à base d\u0027infusion de fleurs d\u0027hibiscus séchées, menthe et sucre.",
                               "is_available":  true,
                               "restaurant_id":  "r7"
                           },
                           {
                               "id":  "dish_5",
                               "name":  "Jus de Bouye (Pain de Singe)",
                               "price":  500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré.",
                               "is_available":  true,
                               "restaurant_id":  "r7"
                           }
                       ]
    },
    {
        "id":  "r14",
        "name":  "Le Festin Africain",
        "slug":  "le-festin-africain",
        "rating":  4.10,
        "reviews_count":  28,
        "category":  "Traditionnel",
        "address":  "Près du Stade Lat Dior, Thiès",
        "whatsapp":  "+221770123456",
        "open_hours":  "12:00 - 22:00",
        "closed_days":  [

                        ],
        "is_open_manual":  true,
        "status":  "active",
        "username":  "le-festin-africain",
        "cover_image":  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600\u0026auto=format\u0026fit=crop\u0026q=60",
        "menu":  [
                     {
                         "id":  "dish_1",
                         "name":  "Thiéboudiène Penda Mbaye",
                         "image":  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2500,
                         "description":  "Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce."
                     },
                     {
                         "id":  "dish_2",
                         "name":  "Yassa Poulet au Feu de Bois",
                         "image":  "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2200,
                         "description":  "Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé."
                     },
                     {
                         "id":  "dish_3",
                         "name":  "Mafé Viande de Bœuf",
                         "image":  "https://images.unsplash.com/photo-1547592180-85f173990554?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2000,
                         "description":  "Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d\u0027arachide locale, riz blanc."
                     },
                     {
                         "id":  "dish_4",
                         "name":  "Jus de Bissap Glacé",
                         "image":  "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  500,
                         "description":  "Boisson rafraîchissante maison à base d\u0027infusion de fleurs d\u0027hibiscus séchées, menthe et sucre."
                     },
                     {
                         "id":  "dish_5",
                         "name":  "Jus de Bouye (Pain de Singe)",
                         "image":  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  500,
                         "description":  "Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré."
                     }
                 ],
        "reviews":  [
                        {
                            "id":  "rev_r14_0",
                            "date":  "2026-06-10",
                            "reply":  "Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.",
                            "author":  "Abdoulaye Diallo",
                            "rating":  5,
                            "comment":  "Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement."
                        },
                        {
                            "id":  "rev_r14_1",
                            "date":  "2026-06-12",
                            "reply":  null,
                            "author":  "Khadija Fall",
                            "rating":  4,
                            "comment":  "Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d\u0027attente à la livraison."
                        },
                        {
                            "id":  "rev_r14_2",
                            "date":  "2026-06-14",
                            "reply":  "Merci Michel ! Heureux de vous avoir accueilli.",
                            "author":  "Michel Dupont",
                            "rating":  5,
                            "comment":  "Un trésor caché à Thiès. Le service Teranga est excellent."
                        }
                    ],
        "created_at":  "2026-06-20T03:24:45.203377+00:00",
        "subscription_pack":  "Aucun (Gratuit)",
        "lat":  14.7928,
        "lng":  -16.9260,
        "location":  null,
        "menu_items":  [
                           {
                               "id":  "dish_1",
                               "name":  "Thiéboudiène Penda Mbaye",
                               "price":  2500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce.",
                               "is_available":  true,
                               "restaurant_id":  "r14"
                           },
                           {
                               "id":  "dish_2",
                               "name":  "Yassa Poulet au Feu de Bois",
                               "price":  2200.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé.",
                               "is_available":  true,
                               "restaurant_id":  "r14"
                           },
                           {
                               "id":  "dish_3",
                               "name":  "Mafé Viande de Bœuf",
                               "price":  2000.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1547592180-85f173990554?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d\u0027arachide locale, riz blanc.",
                               "is_available":  true,
                               "restaurant_id":  "r14"
                           },
                           {
                               "id":  "dish_4",
                               "name":  "Jus de Bissap Glacé",
                               "price":  500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Boisson rafraîchissante maison à base d\u0027infusion de fleurs d\u0027hibiscus séchées, menthe et sucre.",
                               "is_available":  true,
                               "restaurant_id":  "r14"
                           },
                           {
                               "id":  "dish_5",
                               "name":  "Jus de Bouye (Pain de Singe)",
                               "price":  500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré.",
                               "is_available":  true,
                               "restaurant_id":  "r14"
                           }
                       ]
    },
    {
        "id":  "r15",
        "name":  "Snack du Marché",
        "slug":  "snack-du-marche",
        "rating":  3.60,
        "reviews_count":  22,
        "category":  "Fast Food",
        "address":  "Marché Central de Thiès",
        "whatsapp":  "+221771234567",
        "open_hours":  "09:00 - 19:00",
        "closed_days":  [
                            7
                        ],
        "is_open_manual":  true,
        "status":  "active",
        "username":  "snack-du-marche",
        "cover_image":  "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=600\u0026auto=format\u0026fit=crop\u0026q=60",
        "menu":  [
                     {
                         "id":  "dish_9",
                         "name":  "Burger Teranga Double Cheese",
                         "image":  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2000,
                         "description":  "Pain artisanal, double steak de bœuf haché, double cheddar fondu, sauce maison."
                     },
                     {
                         "id":  "dish_10",
                         "name":  "Chawarma Poulet Fromage",
                         "image":  "https://images.unsplash.com/photo-1626700051175-6518c4793f06?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  1500,
                         "description":  "Pain libanais roulé garni de poulet émincé grillé, frites maison, crème d\u0027ail et fromage."
                     },
                     {
                         "id":  "dish_11",
                         "name":  "Frites Maison (Portion XXL)",
                         "image":  "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  800,
                         "description":  "Pommes de terre fraîches coupées à la main et frites dorées aux herbes aromatiques."
                     },
                     {
                         "id":  "dish_5",
                         "name":  "Jus de Bouye",
                         "image":  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  500,
                         "description":  "Jus onctueux à base de fruit de baobab."
                     }
                 ],
        "reviews":  [
                        {
                            "id":  "rev_r15_0",
                            "date":  "2026-06-10",
                            "reply":  "Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.",
                            "author":  "Abdoulaye Diallo",
                            "rating":  5,
                            "comment":  "Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement."
                        },
                        {
                            "id":  "rev_r15_1",
                            "date":  "2026-06-12",
                            "reply":  null,
                            "author":  "Khadija Fall",
                            "rating":  4,
                            "comment":  "Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d\u0027attente à la livraison."
                        },
                        {
                            "id":  "rev_r15_2",
                            "date":  "2026-06-14",
                            "reply":  "Merci Michel ! Heureux de vous avoir accueilli.",
                            "author":  "Michel Dupont",
                            "rating":  5,
                            "comment":  "Un trésor caché à Thiès. Le service Teranga est excellent."
                        }
                    ],
        "created_at":  "2026-06-20T03:24:45.203377+00:00",
        "subscription_pack":  "Aucun (Gratuit)",
        "lat":  14.7928,
        "lng":  -16.9260,
        "location":  null,
        "menu_items":  [
                           {
                               "id":  "dish_9",
                               "name":  "Burger Teranga Double Cheese",
                               "price":  2000.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Pain artisanal, double steak de bœuf haché, double cheddar fondu, sauce maison.",
                               "is_available":  true,
                               "restaurant_id":  "r15"
                           },
                           {
                               "id":  "dish_10",
                               "name":  "Chawarma Poulet Fromage",
                               "price":  1500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1626700051175-6518c4793f06?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Pain libanais roulé garni de poulet émincé grillé, frites maison, crème d\u0027ail et fromage.",
                               "is_available":  true,
                               "restaurant_id":  "r15"
                           },
                           {
                               "id":  "dish_11",
                               "name":  "Frites Maison (Portion XXL)",
                               "price":  800.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Pommes de terre fraîches coupées à la main et frites dorées aux herbes aromatiques.",
                               "is_available":  true,
                               "restaurant_id":  "r15"
                           },
                           {
                               "id":  "dish_5",
                               "name":  "Jus de Bouye",
                               "price":  500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Jus onctueux à base de fruit de baobab.",
                               "is_available":  true,
                               "restaurant_id":  "r15"
                           }
                       ]
    },
    {
        "id":  "r5",
        "name":  "OBS Resto Chicha",
        "slug":  "obs-resto-chicha",
        "rating":  5.00,
        "reviews_count":  1,
        "category":  "Traditionnel",
        "address":  "Rue Dr. Birane Beye, Thiès",
        "whatsapp":  "+221784269172",
        "open_hours":  "24h/24",
        "closed_days":  [

                        ],
        "is_open_manual":  true,
        "status":  "active",
        "username":  "id_obsrestochicha",
        "cover_image":  "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=600\u0026auto=format\u0026fit=crop\u0026q=60",
        "menu":  [
                     {
                         "id":  "dish_1",
                         "name":  "Thiéboudiène Penda Mbaye",
                         "image":  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2500,
                         "description":  "Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce."
                     },
                     {
                         "id":  "dish_2",
                         "name":  "Yassa Poulet au Feu de Bois",
                         "image":  "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2200,
                         "description":  "Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé."
                     },
                     {
                         "id":  "dish_3",
                         "name":  "Mafé Viande de Bœuf",
                         "image":  "https://images.unsplash.com/photo-1547592180-85f173990554?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2000,
                         "description":  "Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d\u0027arachide locale, riz blanc."
                     },
                     {
                         "id":  "dish_4",
                         "name":  "Jus de Bissap Glacé",
                         "image":  "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  500,
                         "description":  "Boisson rafraîchissante maison à base d\u0027infusion de fleurs d\u0027hibiscus séchées, menthe et sucre."
                     },
                     {
                         "id":  "dish_5",
                         "name":  "Jus de Bouye (Pain de Singe)",
                         "image":  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  500,
                         "description":  "Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré."
                     }
                 ],
        "reviews":  [
                        {
                            "id":  "rev_r5_0",
                            "date":  "2026-06-10",
                            "reply":  "Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.",
                            "author":  "Abdoulaye Diallo",
                            "rating":  5,
                            "comment":  "Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement."
                        },
                        {
                            "id":  "rev_r5_1",
                            "date":  "2026-06-12",
                            "reply":  null,
                            "author":  "Khadija Fall",
                            "rating":  4,
                            "comment":  "Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d\u0027attente à la livraison."
                        },
                        {
                            "id":  "rev_r5_2",
                            "date":  "2026-06-14",
                            "reply":  "Merci Michel ! Heureux de vous avoir accueilli.",
                            "author":  "Michel Dupont",
                            "rating":  5,
                            "comment":  "Un trésor caché à Thiès. Le service Teranga est excellent."
                        }
                    ],
        "created_at":  "2026-06-20T03:24:45.203377+00:00",
        "subscription_pack":  "Aucun (Gratuit)",
        "lat":  14.7928,
        "lng":  -16.9260,
        "location":  null,
        "menu_items":  [
                           {
                               "id":  "dish_1",
                               "name":  "Thiéboudiène Penda Mbaye",
                               "price":  2500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce.",
                               "is_available":  true,
                               "restaurant_id":  "r5"
                           },
                           {
                               "id":  "dish_2",
                               "name":  "Yassa Poulet au Feu de Bois",
                               "price":  2200.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé.",
                               "is_available":  true,
                               "restaurant_id":  "r5"
                           },
                           {
                               "id":  "dish_3",
                               "name":  "Mafé Viande de Bœuf",
                               "price":  2000.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1547592180-85f173990554?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d\u0027arachide locale, riz blanc.",
                               "is_available":  true,
                               "restaurant_id":  "r5"
                           },
                           {
                               "id":  "dish_4",
                               "name":  "Jus de Bissap Glacé",
                               "price":  500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Boisson rafraîchissante maison à base d\u0027infusion de fleurs d\u0027hibiscus séchées, menthe et sucre.",
                               "is_available":  true,
                               "restaurant_id":  "r5"
                           },
                           {
                               "id":  "dish_5",
                               "name":  "Jus de Bouye (Pain de Singe)",
                               "price":  500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré.",
                               "is_available":  true,
                               "restaurant_id":  "r5"
                           }
                       ]
    },
    {
        "id":  "r6",
        "name":  "Sam\u0027s Prestige",
        "slug":  "sams-prestige",
        "rating":  3.50,
        "reviews_count":  229,
        "category":  "Traditionnel",
        "address":  "Avenida Léopold Senghor, Thiès",
        "whatsapp":  "+221772004699",
        "open_hours":  "08:00 - 02:00",
        "closed_days":  [

                        ],
        "is_open_manual":  true,
        "status":  "active",
        "username":  "id_samsprestige",
        "cover_image":  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600\u0026auto=format\u0026fit=crop\u0026q=60",
        "menu":  [
                     {
                         "id":  "dish_9",
                         "name":  "Burger Teranga Double Cheese",
                         "image":  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2000,
                         "description":  "Pain artisanal, double steak de bœuf haché, double cheddar fondu, sauce maison."
                     },
                     {
                         "id":  "dish_10",
                         "name":  "Chawarma Poulet Fromage",
                         "image":  "https://images.unsplash.com/photo-1626700051175-6518c4793f06?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  1500,
                         "description":  "Pain libanais roulé garni de poulet émincé grillé, frites maison, crème d\u0027ail et fromage."
                     },
                     {
                         "id":  "dish_11",
                         "name":  "Frites Maison (Portion XXL)",
                         "image":  "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  800,
                         "description":  "Pommes de terre fraîches coupées à la main et frites dorées aux herbes aromatiques."
                     },
                     {
                         "id":  "dish_5",
                         "name":  "Jus de Bouye",
                         "image":  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  500,
                         "description":  "Jus onctueux à base de fruit de baobab."
                     }
                 ],
        "reviews":  [
                        {
                            "id":  "rev_r6_0",
                            "date":  "2026-06-10",
                            "reply":  "Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.",
                            "author":  "Abdoulaye Diallo",
                            "rating":  5,
                            "comment":  "Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement."
                        },
                        {
                            "id":  "rev_r6_1",
                            "date":  "2026-06-12",
                            "reply":  null,
                            "author":  "Khadija Fall",
                            "rating":  4,
                            "comment":  "Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d\u0027attente à la livraison."
                        },
                        {
                            "id":  "rev_r6_2",
                            "date":  "2026-06-14",
                            "reply":  "Merci Michel ! Heureux de vous avoir accueilli.",
                            "author":  "Michel Dupont",
                            "rating":  5,
                            "comment":  "Un trésor caché à Thiès. Le service Teranga est excellent."
                        }
                    ],
        "created_at":  "2026-06-20T03:24:45.203377+00:00",
        "subscription_pack":  "Aucun (Gratuit)",
        "lat":  14.7928,
        "lng":  -16.9260,
        "location":  null,
        "menu_items":  [
                           {
                               "id":  "dish_9",
                               "name":  "Burger Teranga Double Cheese",
                               "price":  2000.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Pain artisanal, double steak de bœuf haché, double cheddar fondu, sauce maison.",
                               "is_available":  true,
                               "restaurant_id":  "r6"
                           },
                           {
                               "id":  "dish_10",
                               "name":  "Chawarma Poulet Fromage",
                               "price":  1500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1626700051175-6518c4793f06?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Pain libanais roulé garni de poulet émincé grillé, frites maison, crème d\u0027ail et fromage.",
                               "is_available":  true,
                               "restaurant_id":  "r6"
                           },
                           {
                               "id":  "dish_11",
                               "name":  "Frites Maison (Portion XXL)",
                               "price":  800.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Pommes de terre fraîches coupées à la main et frites dorées aux herbes aromatiques.",
                               "is_available":  true,
                               "restaurant_id":  "r6"
                           },
                           {
                               "id":  "dish_5",
                               "name":  "Jus de Bouye",
                               "price":  500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Jus onctueux à base de fruit de baobab.",
                               "is_available":  true,
                               "restaurant_id":  "r6"
                           }
                       ]
    },
    {
        "id":  "r11",
        "name":  "Case à Teranga",
        "slug":  "case-a-teranga",
        "rating":  3.90,
        "reviews_count":  7,
        "category":  "Traditionnel",
        "address":  "Thiès, Sénégal",
        "whatsapp":  "+221773239779",
        "open_hours":  "09:00 - 00:00",
        "closed_days":  [

                        ],
        "is_open_manual":  true,
        "status":  "active",
        "username":  "id_caseateranga",
        "cover_image":  "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=600\u0026auto=format\u0026fit=crop\u0026q=60",
        "menu":  [
                     {
                         "id":  "dish_1",
                         "name":  "Thiéboudiène Penda Mbaye",
                         "image":  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2500,
                         "description":  "Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce."
                     },
                     {
                         "id":  "dish_2",
                         "name":  "Yassa Poulet au Feu de Bois",
                         "image":  "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2200,
                         "description":  "Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé."
                     },
                     {
                         "id":  "dish_3",
                         "name":  "Mafé Viande de Bœuf",
                         "image":  "https://images.unsplash.com/photo-1547592180-85f173990554?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2000,
                         "description":  "Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d\u0027arachide locale, riz blanc."
                     },
                     {
                         "id":  "dish_4",
                         "name":  "Jus de Bissap Glacé",
                         "image":  "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  500,
                         "description":  "Boisson rafraîchissante maison à base d\u0027infusion de fleurs d\u0027hibiscus séchées, menthe et sucre."
                     },
                     {
                         "id":  "dish_5",
                         "name":  "Jus de Bouye (Pain de Singe)",
                         "image":  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  500,
                         "description":  "Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré."
                     }
                 ],
        "reviews":  [
                        {
                            "id":  "rev_r11_0",
                            "date":  "2026-06-10",
                            "reply":  "Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.",
                            "author":  "Abdoulaye Diallo",
                            "rating":  5,
                            "comment":  "Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement."
                        },
                        {
                            "id":  "rev_r11_1",
                            "date":  "2026-06-12",
                            "reply":  null,
                            "author":  "Khadija Fall",
                            "rating":  4,
                            "comment":  "Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d\u0027attente à la livraison."
                        },
                        {
                            "id":  "rev_r11_2",
                            "date":  "2026-06-14",
                            "reply":  "Merci Michel ! Heureux de vous avoir accueilli.",
                            "author":  "Michel Dupont",
                            "rating":  5,
                            "comment":  "Un trésor caché à Thiès. Le service Teranga est excellent."
                        }
                    ],
        "created_at":  "2026-06-20T03:24:45.203377+00:00",
        "subscription_pack":  "Aucun (Gratuit)",
        "lat":  14.7928,
        "lng":  -16.9260,
        "location":  null,
        "menu_items":  [
                           {
                               "id":  "dish_1",
                               "name":  "Thiéboudiène Penda Mbaye",
                               "price":  2500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce.",
                               "is_available":  true,
                               "restaurant_id":  "r11"
                           },
                           {
                               "id":  "dish_2",
                               "name":  "Yassa Poulet au Feu de Bois",
                               "price":  2200.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé.",
                               "is_available":  true,
                               "restaurant_id":  "r11"
                           },
                           {
                               "id":  "dish_3",
                               "name":  "Mafé Viande de Bœuf",
                               "price":  2000.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1547592180-85f173990554?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d\u0027arachide locale, riz blanc.",
                               "is_available":  true,
                               "restaurant_id":  "r11"
                           },
                           {
                               "id":  "dish_4",
                               "name":  "Jus de Bissap Glacé",
                               "price":  500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Boisson rafraîchissante maison à base d\u0027infusion de fleurs d\u0027hibiscus séchées, menthe et sucre.",
                               "is_available":  true,
                               "restaurant_id":  "r11"
                           },
                           {
                               "id":  "dish_5",
                               "name":  "Jus de Bouye (Pain de Singe)",
                               "price":  500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré.",
                               "is_available":  true,
                               "restaurant_id":  "r11"
                           }
                       ]
    },
    {
        "id":  "r21",
        "name":  "Alamindelice",
        "slug":  "alamindelice",
        "rating":  5.00,
        "reviews_count":  0,
        "category":  "Pâtisserie",
        "address":  "Seras",
        "whatsapp":  "+221784799882",
        "open_hours":  "00:00 - 00:00",
        "closed_days":  [

                        ],
        "is_open_manual":  true,
        "status":  "active",
        "username":  "id_alamindelice",
        "cover_image":  null,
        "menu":  [
                     {
                         "id":  "dish_1",
                         "name":  "Thiéboudiène Penda Mbaye",
                         "image":  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2500,
                         "description":  "Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce."
                     },
                     {
                         "id":  "dish_2",
                         "name":  "Yassa Poulet au Feu de Bois",
                         "image":  "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2200,
                         "description":  "Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé."
                     },
                     {
                         "id":  "dish_3",
                         "name":  "Mafé Viande de Bœuf",
                         "image":  "https://images.unsplash.com/photo-1547592180-85f173990554?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2000,
                         "description":  "Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d\u0027arachide locale, riz blanc."
                     },
                     {
                         "id":  "dish_4",
                         "name":  "Jus de Bissap Glacé",
                         "image":  "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  500,
                         "description":  "Boisson rafraîchissante maison à base d\u0027infusion de fleurs d\u0027hibiscus séchées, menthe et sucre."
                     },
                     {
                         "id":  "dish_5",
                         "name":  "Jus de Bouye (Pain de Singe)",
                         "image":  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  500,
                         "description":  "Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré."
                     }
                 ],
        "reviews":  [

                    ],
        "created_at":  "2026-07-26T02:27:53.842184+00:00",
        "subscription_pack":  "Pack Startup",
        "lat":  14.7928,
        "lng":  -16.9260,
        "location":  null,
        "menu_items":  [
                           {
                               "id":  "dish_1",
                               "name":  "Thiéboudiène Penda Mbaye",
                               "price":  2500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce.",
                               "is_available":  true,
                               "restaurant_id":  "r21"
                           },
                           {
                               "id":  "dish_2",
                               "name":  "Yassa Poulet au Feu de Bois",
                               "price":  2200.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé.",
                               "is_available":  true,
                               "restaurant_id":  "r21"
                           },
                           {
                               "id":  "dish_3",
                               "name":  "Mafé Viande de Bœuf",
                               "price":  2000.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1547592180-85f173990554?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d\u0027arachide locale, riz blanc.",
                               "is_available":  true,
                               "restaurant_id":  "r21"
                           },
                           {
                               "id":  "dish_4",
                               "name":  "Jus de Bissap Glacé",
                               "price":  500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Boisson rafraîchissante maison à base d\u0027infusion de fleurs d\u0027hibiscus séchées, menthe et sucre.",
                               "is_available":  true,
                               "restaurant_id":  "r21"
                           },
                           {
                               "id":  "dish_5",
                               "name":  "Jus de Bouye (Pain de Singe)",
                               "price":  500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré.",
                               "is_available":  true,
                               "restaurant_id":  "r21"
                           }
                       ]
    },
    {
        "id":  "r8",
        "name":  "Nadia",
        "slug":  "nadia",
        "rating":  4.00,
        "reviews_count":  0,
        "category":  "Traditionnel",
        "address":  "Thiès 21000, Sénégal",
        "whatsapp":  "+221774640624",
        "open_hours":  "24h/24",
        "closed_days":  [

                        ],
        "is_open_manual":  true,
        "status":  "active",
        "username":  "id_nadia",
        "cover_image":  "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600\u0026auto=format\u0026fit=crop\u0026q=60",
        "menu":  [
                     {
                         "id":  "dish_9",
                         "name":  "Burger Teranga Double Cheese",
                         "image":  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2000,
                         "description":  "Pain artisanal, double steak de bœuf haché, double cheddar fondu, sauce maison."
                     },
                     {
                         "id":  "dish_10",
                         "name":  "Chawarma Poulet Fromage",
                         "image":  "https://images.unsplash.com/photo-1626700051175-6518c4793f06?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  1500,
                         "description":  "Pain libanais roulé garni de poulet émincé grillé, frites maison, crème d\u0027ail et fromage."
                     },
                     {
                         "id":  "dish_11",
                         "name":  "Frites Maison (Portion XXL)",
                         "image":  "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  800,
                         "description":  "Pommes de terre fraîches coupées à la main et frites dorées aux herbes aromatiques."
                     },
                     {
                         "id":  "dish_5",
                         "name":  "Jus de Bouye",
                         "image":  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  500,
                         "description":  "Jus onctueux à base de fruit de baobab."
                     }
                 ],
        "reviews":  [
                        {
                            "id":  "rev_r8_0",
                            "date":  "2026-06-10",
                            "reply":  "Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.",
                            "author":  "Abdoulaye Diallo",
                            "rating":  5,
                            "comment":  "Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement."
                        },
                        {
                            "id":  "rev_r8_1",
                            "date":  "2026-06-12",
                            "reply":  null,
                            "author":  "Khadija Fall",
                            "rating":  4,
                            "comment":  "Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d\u0027attente à la livraison."
                        },
                        {
                            "id":  "rev_r8_2",
                            "date":  "2026-06-14",
                            "reply":  "Merci Michel ! Heureux de vous avoir accueilli.",
                            "author":  "Michel Dupont",
                            "rating":  5,
                            "comment":  "Un trésor caché à Thiès. Le service Teranga est excellent."
                        }
                    ],
        "created_at":  "2026-06-20T03:24:45.203377+00:00",
        "subscription_pack":  "Aucun (Gratuit)",
        "lat":  14.7928,
        "lng":  -16.9260,
        "location":  null,
        "menu_items":  [
                           {
                               "id":  "dish_9",
                               "name":  "Burger Teranga Double Cheese",
                               "price":  2000.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Pain artisanal, double steak de bœuf haché, double cheddar fondu, sauce maison.",
                               "is_available":  true,
                               "restaurant_id":  "r8"
                           },
                           {
                               "id":  "dish_10",
                               "name":  "Chawarma Poulet Fromage",
                               "price":  1500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1626700051175-6518c4793f06?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Pain libanais roulé garni de poulet émincé grillé, frites maison, crème d\u0027ail et fromage.",
                               "is_available":  true,
                               "restaurant_id":  "r8"
                           },
                           {
                               "id":  "dish_11",
                               "name":  "Frites Maison (Portion XXL)",
                               "price":  800.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Pommes de terre fraîches coupées à la main et frites dorées aux herbes aromatiques.",
                               "is_available":  true,
                               "restaurant_id":  "r8"
                           },
                           {
                               "id":  "dish_5",
                               "name":  "Jus de Bouye",
                               "price":  500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Jus onctueux à base de fruit de baobab.",
                               "is_available":  true,
                               "restaurant_id":  "r8"
                           }
                       ]
    },
    {
        "id":  "r9",
        "name":  "Tacos de Thiès",
        "slug":  "tacos-de-thies",
        "rating":  3.60,
        "reviews_count":  74,
        "category":  "Fast Food",
        "address":  "335 Av. Lamine Gueye, Thiès",
        "whatsapp":  "+221761385542",
        "open_hours":  "11:00 - 02:00",
        "closed_days":  [

                        ],
        "is_open_manual":  true,
        "status":  "active",
        "username":  "id_tacosdethies",
        "cover_image":  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600\u0026auto=format\u0026fit=crop\u0026q=60",
        "menu":  [
                     {
                         "id":  "dish_1",
                         "name":  "Thiéboudiène Penda Mbaye",
                         "image":  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2500,
                         "description":  "Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce."
                     },
                     {
                         "id":  "dish_2",
                         "name":  "Yassa Poulet au Feu de Bois",
                         "image":  "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2200,
                         "description":  "Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé."
                     },
                     {
                         "id":  "dish_3",
                         "name":  "Mafé Viande de Bœuf",
                         "image":  "https://images.unsplash.com/photo-1547592180-85f173990554?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2000,
                         "description":  "Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d\u0027arachide locale, riz blanc."
                     },
                     {
                         "id":  "dish_4",
                         "name":  "Jus de Bissap Glacé",
                         "image":  "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  500,
                         "description":  "Boisson rafraîchissante maison à base d\u0027infusion de fleurs d\u0027hibiscus séchées, menthe et sucre."
                     },
                     {
                         "id":  "dish_5",
                         "name":  "Jus de Bouye (Pain de Singe)",
                         "image":  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  500,
                         "description":  "Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré."
                     }
                 ],
        "reviews":  [
                        {
                            "id":  "rev_r9_0",
                            "date":  "2026-06-10",
                            "reply":  "Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.",
                            "author":  "Abdoulaye Diallo",
                            "rating":  5,
                            "comment":  "Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement."
                        },
                        {
                            "id":  "rev_r9_1",
                            "date":  "2026-06-12",
                            "reply":  null,
                            "author":  "Khadija Fall",
                            "rating":  4,
                            "comment":  "Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d\u0027attente à la livraison."
                        },
                        {
                            "id":  "rev_r9_2",
                            "date":  "2026-06-14",
                            "reply":  "Merci Michel ! Heureux de vous avoir accueilli.",
                            "author":  "Michel Dupont",
                            "rating":  5,
                            "comment":  "Un trésor caché à Thiès. Le service Teranga est excellent."
                        }
                    ],
        "created_at":  "2026-06-20T03:24:45.203377+00:00",
        "subscription_pack":  "Aucun (Gratuit)",
        "lat":  14.7928,
        "lng":  -16.9260,
        "location":  null,
        "menu_items":  [
                           {
                               "id":  "dish_1",
                               "name":  "Thiéboudiène Penda Mbaye",
                               "price":  2500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce.",
                               "is_available":  true,
                               "restaurant_id":  "r9"
                           },
                           {
                               "id":  "dish_2",
                               "name":  "Yassa Poulet au Feu de Bois",
                               "price":  2200.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé.",
                               "is_available":  true,
                               "restaurant_id":  "r9"
                           },
                           {
                               "id":  "dish_3",
                               "name":  "Mafé Viande de Bœuf",
                               "price":  2000.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1547592180-85f173990554?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d\u0027arachide locale, riz blanc.",
                               "is_available":  true,
                               "restaurant_id":  "r9"
                           },
                           {
                               "id":  "dish_4",
                               "name":  "Jus de Bissap Glacé",
                               "price":  500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Boisson rafraîchissante maison à base d\u0027infusion de fleurs d\u0027hibiscus séchées, menthe et sucre.",
                               "is_available":  true,
                               "restaurant_id":  "r9"
                           },
                           {
                               "id":  "dish_5",
                               "name":  "Jus de Bouye (Pain de Singe)",
                               "price":  500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré.",
                               "is_available":  true,
                               "restaurant_id":  "r9"
                           }
                       ]
    },
    {
        "id":  "r10",
        "name":  "Pamanda",
        "slug":  "pamanda",
        "rating":  4.00,
        "reviews_count":  366,
        "category":  "Fast Food",
        "address":  "Guinth Rue Amadou Sow, Thiès",
        "whatsapp":  "+221339521550",
        "open_hours":  "09:00 - 01:30",
        "closed_days":  [

                        ],
        "is_open_manual":  true,
        "status":  "active",
        "username":  "id_pamanda",
        "cover_image":  "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600\u0026auto=format\u0026fit=crop\u0026q=60",
        "menu":  [
                     {
                         "id":  "dish_9",
                         "name":  "Burger Teranga Double Cheese",
                         "image":  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2000,
                         "description":  "Pain artisanal, double steak de bœuf haché, double cheddar fondu, sauce maison."
                     },
                     {
                         "id":  "dish_10",
                         "name":  "Chawarma Poulet Fromage",
                         "image":  "https://images.unsplash.com/photo-1626700051175-6518c4793f06?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  1500,
                         "description":  "Pain libanais roulé garni de poulet émincé grillé, frites maison, crème d\u0027ail et fromage."
                     },
                     {
                         "id":  "dish_11",
                         "name":  "Frites Maison (Portion XXL)",
                         "image":  "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  800,
                         "description":  "Pommes de terre fraîches coupées à la main et frites dorées aux herbes aromatiques."
                     },
                     {
                         "id":  "dish_5",
                         "name":  "Jus de Bouye",
                         "image":  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  500,
                         "description":  "Jus onctueux à base de fruit de baobab."
                     }
                 ],
        "reviews":  [
                        {
                            "id":  "rev_r10_0",
                            "date":  "2026-06-10",
                            "reply":  "Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.",
                            "author":  "Abdoulaye Diallo",
                            "rating":  5,
                            "comment":  "Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement."
                        },
                        {
                            "id":  "rev_r10_1",
                            "date":  "2026-06-12",
                            "reply":  null,
                            "author":  "Khadija Fall",
                            "rating":  4,
                            "comment":  "Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d\u0027attente à la livraison."
                        },
                        {
                            "id":  "rev_r10_2",
                            "date":  "2026-06-14",
                            "reply":  "Merci Michel ! Heureux de vous avoir accueilli.",
                            "author":  "Michel Dupont",
                            "rating":  5,
                            "comment":  "Un trésor caché à Thiès. Le service Teranga est excellent."
                        }
                    ],
        "created_at":  "2026-06-20T03:24:45.203377+00:00",
        "subscription_pack":  "Aucun (Gratuit)",
        "lat":  14.7928,
        "lng":  -16.9260,
        "location":  null,
        "menu_items":  [
                           {
                               "id":  "dish_9",
                               "name":  "Burger Teranga Double Cheese",
                               "price":  2000.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Pain artisanal, double steak de bœuf haché, double cheddar fondu, sauce maison.",
                               "is_available":  true,
                               "restaurant_id":  "r10"
                           },
                           {
                               "id":  "dish_10",
                               "name":  "Chawarma Poulet Fromage",
                               "price":  1500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1626700051175-6518c4793f06?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Pain libanais roulé garni de poulet émincé grillé, frites maison, crème d\u0027ail et fromage.",
                               "is_available":  true,
                               "restaurant_id":  "r10"
                           },
                           {
                               "id":  "dish_11",
                               "name":  "Frites Maison (Portion XXL)",
                               "price":  800.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Pommes de terre fraîches coupées à la main et frites dorées aux herbes aromatiques.",
                               "is_available":  true,
                               "restaurant_id":  "r10"
                           },
                           {
                               "id":  "dish_5",
                               "name":  "Jus de Bouye",
                               "price":  500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Jus onctueux à base de fruit de baobab.",
                               "is_available":  true,
                               "restaurant_id":  "r10"
                           }
                       ]
    },
    {
        "id":  "r12",
        "name":  "Restaurant Khayma Teslem",
        "slug":  "khayma-teslem",
        "rating":  5.00,
        "reviews_count":  1,
        "category":  "Traditionnel",
        "address":  "358 Rocade de Contournement de Thiès",
        "whatsapp":  "+221788712020",
        "open_hours":  "24h/24",
        "closed_days":  [

                        ],
        "is_open_manual":  true,
        "status":  "active",
        "username":  "id_restaurantkhaymateslem",
        "cover_image":  "https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=600\u0026auto=format\u0026fit=crop\u0026q=60",
        "menu":  [
                     {
                         "id":  "dish_15",
                         "name":  "Lotte rôtie sauce vanille de Casamance",
                         "image":  "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  7500,
                         "description":  "Médaillon de lotte poêlé, purée fine de patate douce et émulsion à la vanille."
                     },
                     {
                         "id":  "dish_16",
                         "name":  "Filet de Bœuf braisé au Café Touba",
                         "image":  "https://images.unsplash.com/photo-1544025162-d76694265947?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  8000,
                         "description":  "Filet tendre de bœuf du pays, sauce corsée infusée au café Touba et poivre de Selim, petits légumes."
                     },
                     {
                         "id":  "dish_17",
                         "name":  "Moelleux au Chocolat \u0026 Coulis Bissap",
                         "image":  "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2500,
                         "description":  "Dessert gourmand au cœur coulant, parfumé d\u0027un coulis acidulé au bissap rouge."
                     }
                 ],
        "reviews":  [
                        {
                            "id":  "rev_r12_0",
                            "date":  "2026-06-10",
                            "reply":  "Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.",
                            "author":  "Abdoulaye Diallo",
                            "rating":  5,
                            "comment":  "Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement."
                        },
                        {
                            "id":  "rev_r12_1",
                            "date":  "2026-06-12",
                            "reply":  null,
                            "author":  "Khadija Fall",
                            "rating":  4,
                            "comment":  "Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d\u0027attente à la livraison."
                        },
                        {
                            "id":  "rev_r12_2",
                            "date":  "2026-06-14",
                            "reply":  "Merci Michel ! Heureux de vous avoir accueilli.",
                            "author":  "Michel Dupont",
                            "rating":  5,
                            "comment":  "Un trésor caché à Thiès. Le service Teranga est excellent."
                        }
                    ],
        "created_at":  "2026-06-20T03:24:45.203377+00:00",
        "subscription_pack":  "Aucun (Gratuit)",
        "lat":  14.7928,
        "lng":  -16.9260,
        "location":  null,
        "menu_items":  [
                           {
                               "id":  "dish_15",
                               "name":  "Lotte rôtie sauce vanille de Casamance",
                               "price":  7500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Médaillon de lotte poêlé, purée fine de patate douce et émulsion à la vanille.",
                               "is_available":  true,
                               "restaurant_id":  "r12"
                           },
                           {
                               "id":  "dish_16",
                               "name":  "Filet de Bœuf braisé au Café Touba",
                               "price":  8000.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1544025162-d76694265947?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Filet tendre de bœuf du pays, sauce corsée infusée au café Touba et poivre de Selim, petits légumes.",
                               "is_available":  true,
                               "restaurant_id":  "r12"
                           },
                           {
                               "id":  "dish_17",
                               "name":  "Moelleux au Chocolat \u0026 Coulis Bissap",
                               "price":  2500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Dessert gourmand au cœur coulant, parfumé d\u0027un coulis acidulé au bissap rouge.",
                               "is_available":  true,
                               "restaurant_id":  "r12"
                           }
                       ]
    },
    {
        "id":  "r13",
        "name":  "Nice Time Complexe",
        "slug":  "nice-time-complexe",
        "rating":  4.10,
        "reviews_count":  614,
        "category":  "Dibiterie",
        "address":  "137 Allée Mawa, M Doucouré, Thiès",
        "whatsapp":  "+221339540442",
        "open_hours":  "12:00 - 23:00",
        "closed_days":  [

                        ],
        "is_open_manual":  true,
        "status":  "active",
        "username":  "id_nicetimecomplexe",
        "cover_image":  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600\u0026auto=format\u0026fit=crop\u0026q=60",
        "menu":  [
                     {
                         "id":  "dish_6",
                         "name":  "Dibi d\u0027Agneau Traditionnel (Portion)",
                         "image":  "https://images.unsplash.com/photo-1544025162-d76694265947?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  4500,
                         "description":  "Viande d\u0027agneau coupée en morceaux, marinée et grillée façon dibiterie, servie avec oignons et piment."
                     },
                     {
                         "id":  "dish_7",
                         "name":  "Dibi de Poulet (Demi Poulet)",
                         "image":  "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  3500,
                         "description":  "Demi-poulet mariné aux épices locales et grillé lentement, accompagné d\u0027oignons émincés."
                     },
                     {
                         "id":  "dish_8",
                         "name":  "Merguez Braisées de Thiès",
                         "image":  "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2500,
                         "description":  "Brochettes de merguez maison grillées, servies avec frites croustillantes."
                     },
                     {
                         "id":  "dish_4",
                         "name":  "Jus de Bissap Glacé",
                         "image":  "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  500,
                         "description":  "Infusion de fleurs d\u0027hibiscus séchées parfumée à la menthe."
                     }
                 ],
        "reviews":  [
                        {
                            "id":  "rev_r13_0",
                            "date":  "2026-06-10",
                            "reply":  "Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.",
                            "author":  "Abdoulaye Diallo",
                            "rating":  5,
                            "comment":  "Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement."
                        },
                        {
                            "id":  "rev_r13_1",
                            "date":  "2026-06-12",
                            "reply":  null,
                            "author":  "Khadija Fall",
                            "rating":  4,
                            "comment":  "Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d\u0027attente à la livraison."
                        },
                        {
                            "id":  "rev_r13_2",
                            "date":  "2026-06-14",
                            "reply":  "Merci Michel ! Heureux de vous avoir accueilli.",
                            "author":  "Michel Dupont",
                            "rating":  5,
                            "comment":  "Un trésor caché à Thiès. Le service Teranga est excellent."
                        }
                    ],
        "created_at":  "2026-06-20T03:24:45.203377+00:00",
        "subscription_pack":  "Aucun (Gratuit)",
        "lat":  14.7928,
        "lng":  -16.9260,
        "location":  null,
        "menu_items":  [
                           {
                               "id":  "dish_6",
                               "name":  "Dibi d\u0027Agneau Traditionnel (Portion)",
                               "price":  4500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1544025162-d76694265947?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Viande d\u0027agneau coupée en morceaux, marinée et grillée façon dibiterie, servie avec oignons et piment.",
                               "is_available":  true,
                               "restaurant_id":  "r13"
                           },
                           {
                               "id":  "dish_7",
                               "name":  "Dibi de Poulet (Demi Poulet)",
                               "price":  3500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Demi-poulet mariné aux épices locales et grillé lentement, accompagné d\u0027oignons émincés.",
                               "is_available":  true,
                               "restaurant_id":  "r13"
                           },
                           {
                               "id":  "dish_8",
                               "name":  "Merguez Braisées de Thiès",
                               "price":  2500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Brochettes de merguez maison grillées, servies avec frites croustillantes.",
                               "is_available":  true,
                               "restaurant_id":  "r13"
                           },
                           {
                               "id":  "dish_4",
                               "name":  "Jus de Bissap Glacé",
                               "price":  500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Infusion de fleurs d\u0027hibiscus séchées parfumée à la menthe.",
                               "is_available":  true,
                               "restaurant_id":  "r13"
                           }
                       ]
    },
    {
        "id":  "r16",
        "name":  "La Casablancaise",
        "slug":  "la-casablancaise",
        "rating":  4.70,
        "reviews_count":  19,
        "category":  "Gastronomique",
        "address":  "Quartier Som, Thiès",
        "whatsapp":  "+221784799882",
        "open_hours":  "12:00 - 23:00",
        "closed_days":  [
                            1
                        ],
        "is_open_manual":  true,
        "status":  "active",
        "username":  "id_lacasablancaise",
        "cover_image":  "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=600\u0026auto=format\u0026fit=crop\u0026q=60",
        "menu":  [
                     {
                         "id":  "dish_15",
                         "name":  "Lotte rôtie sauce vanille de Casamance",
                         "image":  "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  7500,
                         "description":  "Médaillon de lotte poêlé, purée fine de patate douce et émulsion à la vanille."
                     },
                     {
                         "id":  "dish_16",
                         "name":  "Filet de Bœuf braisé au Café Touba",
                         "image":  "https://images.unsplash.com/photo-1544025162-d76694265947?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  8000,
                         "description":  "Filet tendre de bœuf du pays, sauce corsée infusée au café Touba et poivre de Selim, petits légumes."
                     },
                     {
                         "id":  "dish_17",
                         "name":  "Moelleux au Chocolat \u0026 Coulis Bissap",
                         "image":  "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2500,
                         "description":  "Dessert gourmand au cœur coulant, parfumé d\u0027un coulis acidulé au bissap rouge."
                     }
                 ],
        "reviews":  [
                        {
                            "id":  "rev_r16_0",
                            "date":  "2026-06-10",
                            "reply":  "Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.",
                            "author":  "Abdoulaye Diallo",
                            "rating":  5,
                            "comment":  "Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement."
                        },
                        {
                            "id":  "rev_r16_1",
                            "date":  "2026-06-12",
                            "reply":  null,
                            "author":  "Khadija Fall",
                            "rating":  4,
                            "comment":  "Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d\u0027attente à la livraison."
                        },
                        {
                            "id":  "rev_r16_2",
                            "date":  "2026-06-14",
                            "reply":  "Merci Michel ! Heureux de vous avoir accueilli.",
                            "author":  "Michel Dupont",
                            "rating":  5,
                            "comment":  "Un trésor caché à Thiès. Le service Teranga est excellent."
                        }
                    ],
        "created_at":  "2026-06-20T03:24:45.203377+00:00",
        "subscription_pack":  "Aucun (Gratuit)",
        "lat":  14.7928,
        "lng":  -16.9260,
        "location":  null,
        "menu_items":  [
                           {
                               "id":  "dish_15",
                               "name":  "Lotte rôtie sauce vanille de Casamance",
                               "price":  7500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Médaillon de lotte poêlé, purée fine de patate douce et émulsion à la vanille.",
                               "is_available":  true,
                               "restaurant_id":  "r16"
                           },
                           {
                               "id":  "dish_16",
                               "name":  "Filet de Bœuf braisé au Café Touba",
                               "price":  8000.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1544025162-d76694265947?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Filet tendre de bœuf du pays, sauce corsée infusée au café Touba et poivre de Selim, petits légumes.",
                               "is_available":  true,
                               "restaurant_id":  "r16"
                           },
                           {
                               "id":  "dish_17",
                               "name":  "Moelleux au Chocolat \u0026 Coulis Bissap",
                               "price":  2500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Dessert gourmand au cœur coulant, parfumé d\u0027un coulis acidulé au bissap rouge.",
                               "is_available":  true,
                               "restaurant_id":  "r16"
                           }
                       ]
    },
    {
        "id":  "r17",
        "name":  "La Table des Gourmets",
        "slug":  "la-table-des-gourmets",
        "rating":  5.00,
        "reviews_count":  14,
        "category":  "Gastronomique",
        "address":  "Quartier Grand-Thiès",
        "whatsapp":  "+221787846296",
        "open_hours":  "19:00 - 23:30",
        "closed_days":  [
                            1,
                            2
                        ],
        "is_open_manual":  true,
        "status":  "active",
        "username":  "id_latabledesgourmets",
        "cover_image":  "https://images.unsplash.com/photo-1544025162-d76694265947?w=600\u0026auto=format\u0026fit=crop\u0026q=60",
        "menu":  [
                     {
                         "id":  "dish_15",
                         "name":  "Lotte rôtie sauce vanille de Casamance",
                         "image":  "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  7500,
                         "description":  "Médaillon de lotte poêlé, purée fine de patate douce et émulsion à la vanille."
                     },
                     {
                         "id":  "dish_16",
                         "name":  "Filet de Bœuf braisé au Café Touba",
                         "image":  "https://images.unsplash.com/photo-1544025162-d76694265947?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  8000,
                         "description":  "Filet tendre de bœuf du pays, sauce corsée infusée au café Touba et poivre de Selim, petits légumes."
                     },
                     {
                         "id":  "dish_17",
                         "name":  "Moelleux au Chocolat \u0026 Coulis Bissap",
                         "image":  "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2500,
                         "description":  "Dessert gourmand au cœur coulant, parfumé d\u0027un coulis acidulé au bissap rouge."
                     }
                 ],
        "reviews":  [
                        {
                            "id":  "rev_r17_0",
                            "date":  "2026-06-10",
                            "reply":  "Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.",
                            "author":  "Abdoulaye Diallo",
                            "rating":  5,
                            "comment":  "Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement."
                        },
                        {
                            "id":  "rev_r17_1",
                            "date":  "2026-06-12",
                            "reply":  null,
                            "author":  "Khadija Fall",
                            "rating":  4,
                            "comment":  "Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d\u0027attente à la livraison."
                        },
                        {
                            "id":  "rev_r17_2",
                            "date":  "2026-06-14",
                            "reply":  "Merci Michel ! Heureux de vous avoir accueilli.",
                            "author":  "Michel Dupont",
                            "rating":  5,
                            "comment":  "Un trésor caché à Thiès. Le service Teranga est excellent."
                        }
                    ],
        "created_at":  "2026-06-20T03:24:45.203377+00:00",
        "subscription_pack":  "Aucun (Gratuit)",
        "lat":  14.7928,
        "lng":  -16.9260,
        "location":  null,
        "menu_items":  [
                           {
                               "id":  "dish_15",
                               "name":  "Lotte rôtie sauce vanille de Casamance",
                               "price":  7500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Médaillon de lotte poêlé, purée fine de patate douce et émulsion à la vanille.",
                               "is_available":  true,
                               "restaurant_id":  "r17"
                           },
                           {
                               "id":  "dish_16",
                               "name":  "Filet de Bœuf braisé au Café Touba",
                               "price":  8000.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1544025162-d76694265947?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Filet tendre de bœuf du pays, sauce corsée infusée au café Touba et poivre de Selim, petits légumes.",
                               "is_available":  true,
                               "restaurant_id":  "r17"
                           },
                           {
                               "id":  "dish_17",
                               "name":  "Moelleux au Chocolat \u0026 Coulis Bissap",
                               "price":  2500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Dessert gourmand au cœur coulant, parfumé d\u0027un coulis acidulé au bissap rouge.",
                               "is_available":  true,
                               "restaurant_id":  "r17"
                           }
                       ]
    },
    {
        "id":  "r19",
        "name":  "Biba Food",
        "slug":  "biba-food",
        "rating":  5.00,
        "reviews_count":  9,
        "category":  "Fast Food",
        "address":  "Quartier Cité Lamy, Thiès",
        "whatsapp":  "+221770000000",
        "open_hours":  "17:00 - 23:00",
        "closed_days":  [

                        ],
        "is_open_manual":  true,
        "status":  "active",
        "username":  "id_bibafood",
        "cover_image":  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600\u0026auto=format\u0026fit=crop\u0026q=60",
        "menu":  [
                     {
                         "id":  "dish_9",
                         "name":  "Burger Teranga Double Cheese",
                         "image":  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  2000,
                         "description":  "Pain artisanal, double steak de bœuf haché, double cheddar fondu, sauce maison."
                     },
                     {
                         "id":  "dish_10",
                         "name":  "Chawarma Poulet Fromage",
                         "image":  "https://images.unsplash.com/photo-1626700051175-6518c4793f06?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  1500,
                         "description":  "Pain libanais roulé garni de poulet émincé grillé, frites maison, crème d\u0027ail et fromage."
                     },
                     {
                         "id":  "dish_11",
                         "name":  "Frites Maison (Portion XXL)",
                         "image":  "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  800,
                         "description":  "Pommes de terre fraîches coupées à la main et frites dorées aux herbes aromatiques."
                     },
                     {
                         "id":  "dish_5",
                         "name":  "Jus de Bouye",
                         "image":  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                         "price":  500,
                         "description":  "Jus onctueux à base de fruit de baobab."
                     }
                 ],
        "reviews":  [
                        {
                            "id":  "rev_r19_0",
                            "date":  "2026-06-10",
                            "reply":  "Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.",
                            "author":  "Abdoulaye Diallo",
                            "rating":  5,
                            "comment":  "Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement."
                        },
                        {
                            "id":  "rev_r19_1",
                            "date":  "2026-06-12",
                            "reply":  null,
                            "author":  "Khadija Fall",
                            "rating":  4,
                            "comment":  "Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d\u0027attente à la livraison."
                        },
                        {
                            "id":  "rev_r19_2",
                            "date":  "2026-06-14",
                            "reply":  "Merci Michel ! Heureux de vous avoir accueilli.",
                            "author":  "Michel Dupont",
                            "rating":  5,
                            "comment":  "Un trésor caché à Thiès. Le service Teranga est excellent."
                        }
                    ],
        "created_at":  "2026-06-20T03:24:45.203377+00:00",
        "subscription_pack":  "Aucun (Gratuit)",
        "lat":  14.7928,
        "lng":  -16.9260,
        "location":  null,
        "menu_items":  [
                           {
                               "id":  "dish_9",
                               "name":  "Burger Teranga Double Cheese",
                               "price":  2000.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Pain artisanal, double steak de bœuf haché, double cheddar fondu, sauce maison.",
                               "is_available":  true,
                               "restaurant_id":  "r19"
                           },
                           {
                               "id":  "dish_10",
                               "name":  "Chawarma Poulet Fromage",
                               "price":  1500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1626700051175-6518c4793f06?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Pain libanais roulé garni de poulet émincé grillé, frites maison, crème d\u0027ail et fromage.",
                               "is_available":  true,
                               "restaurant_id":  "r19"
                           },
                           {
                               "id":  "dish_11",
                               "name":  "Frites Maison (Portion XXL)",
                               "price":  800.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Pommes de terre fraîches coupées à la main et frites dorées aux herbes aromatiques.",
                               "is_available":  true,
                               "restaurant_id":  "r19"
                           },
                           {
                               "id":  "dish_5",
                               "name":  "Jus de Bouye",
                               "price":  500.00,
                               "category":  null,
                               "image_url":  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500\u0026auto=format\u0026fit=crop\u0026q=60",
                               "created_at":  "2026-08-12T10:52:22.719336+00:00",
                               "description":  "Jus onctueux à base de fruit de baobab.",
                               "is_available":  true,
                               "restaurant_id":  "r19"
                           }
                       ]
    }
]
;



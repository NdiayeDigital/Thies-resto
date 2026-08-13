(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})(),window.onerror=function(e,t,n,r,i){let a={timestamp:new Date().toISOString(),type:`uncaught_exception`,message:e,source:t,line:n,column:r,stack:i?i.stack:`N/A`,url:window.location.href,userAgent:navigator.userAgent};return console.error(`[GlobalLogger] Erreur interceptée :`,a),typeof showToast==`function`&&showToast(`Une erreur inattendue s'est produite. Si le problème persiste, rechargez la page.`,`warning`),!1},window.addEventListener(`unhandledrejection`,function(e){let t={timestamp:new Date().toISOString(),type:`unhandled_promise_rejection`,reason:e.reason,url:window.location.href};console.error(`[GlobalLogger] Promesse rejetée :`,t)}),console.log(`[GlobalLogger] Observabilité activée.`);var e={Traditionnel:`https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60`,"Grillades / Dibi":`https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=60`,"Fast Food":`https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&auto=format&fit=crop&q=60`,Pâtisserie:`https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=600&auto=format&fit=crop&q=60`,Gastronomique:`https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&auto=format&fit=crop&q=60`},t={r1:`https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=60`,r2:`https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=60`,r3:`https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&auto=format&fit=crop&q=60`,r4:`https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&auto=format&fit=crop&q=60`,r5:`https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=600&auto=format&fit=crop&q=60`,r6:`https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=60`,r7:`https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&auto=format&fit=crop&q=60`,r8:`https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&auto=format&fit=crop&q=60`,r9:`https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&auto=format&fit=crop&q=60`,r10:`https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&auto=format&fit=crop&q=60`,r11:`https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=600&auto=format&fit=crop&q=60`,r12:`https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=600&auto=format&fit=crop&q=60`,r13:`https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=60`,r14:`https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60`,r15:`https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=600&auto=format&fit=crop&q=60`,r16:`https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=600&auto=format&fit=crop&q=60`,r17:`https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=60`,r18:`https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=60`,r19:`https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=60`,r20:`https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&auto=format&fit=crop&q=60`},n=[{label:`Thiéboudiène / Poisson`,url:`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60`},{label:`Yassa / Poulet`,url:`https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=60`},{label:`Mafé / Ragoût`,url:`https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=60`},{label:`Grillades / Dibi`,url:`https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60`},{label:`Poulet Grillé`,url:`https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=60`},{label:`Brochettes`,url:`https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=500&auto=format&fit=crop&q=60`},{label:`Burger`,url:`https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60`},{label:`Chawarma / Wrap`,url:`https://images.unsplash.com/photo-1626700051175-6518c4793f06?w=500&auto=format&fit=crop&q=60`},{label:`Frites`,url:`https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60`},{label:`Pizza`,url:`https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60`},{label:`Salade`,url:`https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&auto=format&fit=crop&q=60`},{label:`Poisson Grillé`,url:`https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60`},{label:`Croissant / Pâtisserie`,url:`https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=60`},{label:`Pain au Chocolat`,url:`https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500&auto=format&fit=crop&q=60`},{label:`Petit-Déjeuner`,url:`https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=500&auto=format&fit=crop&q=60`},{label:`Dessert / Chocolat`,url:`https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60`},{label:`Boisson / Jus`,url:`https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60`},{label:`Jus de Bouye`,url:`https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60`},{label:`Riz Sénégalais`,url:`https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=500&auto=format&fit=crop&q=60`},{label:`URL personnalisée`,url:``}],r={Traditionnel:[{id:`dish_1`,name:`Thiéboudiène Penda Mbaye`,description:`Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce.`,price:2500,image:`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60`},{id:`dish_2`,name:`Yassa Poulet au Feu de Bois`,description:`Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé.`,price:2200,image:`https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=60`},{id:`dish_3`,name:`Mafé Viande de Bœuf`,description:`Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d'arachide locale, riz blanc.`,price:2e3,image:`https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=60`},{id:`dish_4`,name:`Jus de Bissap Glacé`,description:`Boisson rafraîchissante maison à base d'infusion de fleurs d'hibiscus séchées, menthe et sucre.`,price:500,image:`https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60`},{id:`dish_5`,name:`Jus de Bouye (Pain de Singe)`,description:`Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré.`,price:500,image:`https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60`}],"Grillades / Dibi":[{id:`dish_6`,name:`Dibi d'Agneau Traditionnel (Portion)`,description:`Viande d'agneau coupée en morceaux, marinée et grillée façon dibiterie, servie avec oignons et piment.`,price:4500,image:`https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60`},{id:`dish_7`,name:`Dibi de Poulet (Demi Poulet)`,description:`Demi-poulet mariné aux épices locales et grillé lentement, accompagné d'oignons émincés.`,price:3500,image:`https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=60`},{id:`dish_8`,name:`Merguez Braisées de Thiès`,description:`Brochettes de merguez maison grillées, servies avec frites croustillantes.`,price:2500,image:`https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=500&auto=format&fit=crop&q=60`},{id:`dish_4`,name:`Jus de Bissap Glacé`,description:`Infusion de fleurs d'hibiscus séchées parfumée à la menthe.`,price:500,image:`https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60`}],"Fast Food":[{id:`dish_9`,name:`Burger Teranga Double Cheese`,description:`Pain artisanal, double steak de bœuf haché, double cheddar fondu, sauce maison.`,price:2e3,image:`https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60`},{id:`dish_10`,name:`Chawarma Poulet Fromage`,description:`Pain libanais roulé garni de poulet émincé grillé, frites maison, crème d'ail et fromage.`,price:1500,image:`https://images.unsplash.com/photo-1626700051175-6518c4793f06?w=500&auto=format&fit=crop&q=60`},{id:`dish_11`,name:`Frites Maison (Portion XXL)`,description:`Pommes de terre fraîches coupées à la main et frites dorées aux herbes aromatiques.`,price:800,image:`https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60`},{id:`dish_5`,name:`Jus de Bouye`,description:`Jus onctueux à base de fruit de baobab.`,price:500,image:`https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60`}],Pâtisserie:[{id:`dish_12`,name:`Croissant Beurre Français`,description:`Feuilletage croustillant pur beurre, doré à souhait.`,price:500,image:`https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=60`},{id:`dish_13`,name:`Pain au Chocolat (Chocolatine)`,description:`Viennoiserie feuilletée avec deux barres de chocolat noir.`,price:600,image:`https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500&auto=format&fit=crop&q=60`},{id:`dish_14`,name:`Formule Petit-Déjeuner Express`,description:`Un café Touba ou expresso, un croissant, et un verre de jus frais d'orange.`,price:1500,image:`https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=500&auto=format&fit=crop&q=60`}],Gastronomique:[{id:`dish_15`,name:`Lotte rôtie sauce vanille de Casamance`,description:`Médaillon de lotte poêlé, purée fine de patate douce et émulsion à la vanille.`,price:7500,image:`https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60`},{id:`dish_16`,name:`Filet de Bœuf braisé au Café Touba`,description:`Filet tendre de bœuf du pays, sauce corsée infusée au café Touba et poivre de Selim, petits légumes.`,price:8e3,image:`https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60`},{id:`dish_17`,name:`Moelleux au Chocolat & Coulis Bissap`,description:`Dessert gourmand au cœur coulant, parfumé d'un coulis acidulé au bissap rouge.`,price:2500,image:`https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60`}]},i=[{author:`Abdoulaye Diallo`,rating:5,comment:`Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement.`,date:`2026-06-10`,reply:`Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.`},{author:`Khadija Fall`,rating:4,comment:`Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d'attente à la livraison.`,date:`2026-06-12`,reply:null},{author:`Michel Dupont`,rating:5,comment:`Un trésor caché à Thiès. Le service Teranga est excellent.`,date:`2026-06-14`,reply:`Merci Michel ! Heureux de vous avoir accueilli.`}];window.triggerCelebration=function(){if(typeof confetti==`function`){let e=Date.now()+3e3;(function t(){confetti({particleCount:5,angle:60,spread:55,origin:{x:0},colors:[`#ff6b35`,`#cfa853`,`#4caf50`]}),confetti({particleCount:5,angle:120,spread:55,origin:{x:1},colors:[`#ff6b35`,`#cfa853`,`#4caf50`]}),Date.now()<e&&requestAnimationFrame(t)})()}};var a=[{id:`r3`,name:`Restaurant Madiba`,slug:`restaurant-madiba`,rating:4.3,reviews_count:312,category:`Traditionnel`,address:`Quartier Escale, Thiès`,whatsapp:`+221339542523`,open_hours:`11:30 - 23:00`,closed_days:[],is_open_manual:!0,status:`active`,username:`id_restaurantmadiba`,cover_image:`https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&auto=format&fit=crop&q=60`,menu:[{id:`dish_1`,name:`Thiéboudiène Penda Mbaye`,image:`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60`,price:2500,description:`Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce.`},{id:`dish_2`,name:`Yassa Poulet au Feu de Bois`,image:`https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=60`,price:2200,description:`Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé.`},{id:`dish_3`,name:`Mafé Viande de Bœuf`,image:`https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=60`,price:2e3,description:`Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d'arachide locale, riz blanc.`},{id:`dish_4`,name:`Jus de Bissap Glacé`,image:`https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60`,price:500,description:`Boisson rafraîchissante maison à base d'infusion de fleurs d'hibiscus séchées, menthe et sucre.`},{id:`dish_5`,name:`Jus de Bouye (Pain de Singe)`,image:`https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60`,price:500,description:`Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré.`}],reviews:[{id:`rev_r3_0`,date:`2026-06-10`,reply:`Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.`,author:`Abdoulaye Diallo`,rating:5,comment:`Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement.`},{id:`rev_r3_1`,date:`2026-06-12`,reply:null,author:`Khadija Fall`,rating:4,comment:`Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d'attente à la livraison.`},{id:`rev_r3_2`,date:`2026-06-14`,reply:`Merci Michel ! Heureux de vous avoir accueilli.`,author:`Michel Dupont`,rating:5,comment:`Un trésor caché à Thiès. Le service Teranga est excellent.`}],created_at:`2026-06-20T03:24:45.203377+00:00`,subscription_pack:`Aucun (Gratuit)`,lat:14.7928,lng:-16.926,location:null,menu_items:[{id:`dish_1`,name:`Thiéboudiène Penda Mbaye`,price:2500,category:null,image_url:`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce.`,is_available:!0,restaurant_id:`r3`},{id:`dish_2`,name:`Yassa Poulet au Feu de Bois`,price:2200,category:null,image_url:`https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé.`,is_available:!0,restaurant_id:`r3`},{id:`dish_3`,name:`Mafé Viande de Bœuf`,price:2e3,category:null,image_url:`https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d'arachide locale, riz blanc.`,is_available:!0,restaurant_id:`r3`},{id:`dish_4`,name:`Jus de Bissap Glacé`,price:500,category:null,image_url:`https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Boisson rafraîchissante maison à base d'infusion de fleurs d'hibiscus séchées, menthe et sucre.`,is_available:!0,restaurant_id:`r3`},{id:`dish_5`,name:`Jus de Bouye (Pain de Singe)`,price:500,category:null,image_url:`https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré.`,is_available:!0,restaurant_id:`r3`}]},{id:`r4`,name:`Les Délices`,slug:`les-delices`,rating:3.6,reviews_count:328,category:`Traditionnel`,address:`373 Av. Lamine Gueye, Thiès`,whatsapp:`+221339517516`,open_hours:`24h/24`,closed_days:[],is_open_manual:!0,status:`active`,username:`id_lesdelices`,cover_image:`https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&auto=format&fit=crop&q=60`,menu:[{id:`dish_1`,name:`Thiéboudiène Penda Mbaye`,image:`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60`,price:2500,description:`Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce.`},{id:`dish_2`,name:`Yassa Poulet au Feu de Bois`,image:`https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=60`,price:2200,description:`Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé.`},{id:`dish_3`,name:`Mafé Viande de Bœuf`,image:`https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=60`,price:2e3,description:`Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d'arachide locale, riz blanc.`},{id:`dish_4`,name:`Jus de Bissap Glacé`,image:`https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60`,price:500,description:`Boisson rafraîchissante maison à base d'infusion de fleurs d'hibiscus séchées, menthe et sucre.`},{id:`dish_5`,name:`Jus de Bouye (Pain de Singe)`,image:`https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60`,price:500,description:`Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré.`}],reviews:[{id:`rev_r4_0`,date:`2026-06-10`,reply:`Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.`,author:`Abdoulaye Diallo`,rating:5,comment:`Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement.`},{id:`rev_r4_1`,date:`2026-06-12`,reply:null,author:`Khadija Fall`,rating:4,comment:`Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d'attente à la livraison.`},{id:`rev_r4_2`,date:`2026-06-14`,reply:`Merci Michel ! Heureux de vous avoir accueilli.`,author:`Michel Dupont`,rating:5,comment:`Un trésor caché à Thiès. Le service Teranga est excellent.`}],created_at:`2026-06-20T03:24:45.203377+00:00`,subscription_pack:`Aucun (Gratuit)`,lat:14.7928,lng:-16.926,location:null,menu_items:[{id:`dish_1`,name:`Thiéboudiène Penda Mbaye`,price:2500,category:null,image_url:`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce.`,is_available:!0,restaurant_id:`r4`},{id:`dish_2`,name:`Yassa Poulet au Feu de Bois`,price:2200,category:null,image_url:`https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé.`,is_available:!0,restaurant_id:`r4`},{id:`dish_3`,name:`Mafé Viande de Bœuf`,price:2e3,category:null,image_url:`https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d'arachide locale, riz blanc.`,is_available:!0,restaurant_id:`r4`},{id:`dish_4`,name:`Jus de Bissap Glacé`,price:500,category:null,image_url:`https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Boisson rafraîchissante maison à base d'infusion de fleurs d'hibiscus séchées, menthe et sucre.`,is_available:!0,restaurant_id:`r4`},{id:`dish_5`,name:`Jus de Bouye (Pain de Singe)`,price:500,category:null,image_url:`https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré.`,is_available:!0,restaurant_id:`r4`}]},{id:`r20`,name:`Le Jardin des Saveurs`,slug:`le-jardin-des-saveurs`,rating:4.6,reviews_count:7,category:`Traditionnel`,address:`Près de la Manufacture des Arts Décoratifs, Thiès`,whatsapp:`+221776789012`,open_hours:`12:00 - 22:00`,closed_days:[1],is_open_manual:!0,status:`pending`,username:`le-jardin-des-saveurs`,cover_image:`https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&auto=format&fit=crop&q=60`,menu:[{id:`dish_1`,name:`Thiéboudiène Penda Mbaye`,image:`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60`,price:2500,description:`Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce.`},{id:`dish_2`,name:`Yassa Poulet au Feu de Bois`,image:`https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=60`,price:2200,description:`Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé.`},{id:`dish_3`,name:`Mafé Viande de Bœuf`,image:`https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=60`,price:2e3,description:`Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d'arachide locale, riz blanc.`},{id:`dish_4`,name:`Jus de Bissap Glacé`,image:`https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60`,price:500,description:`Boisson rafraîchissante maison à base d'infusion de fleurs d'hibiscus séchées, menthe et sucre.`},{id:`dish_5`,name:`Jus de Bouye (Pain de Singe)`,image:`https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60`,price:500,description:`Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré.`}],reviews:[{id:`rev_r20_0`,date:`2026-06-10`,reply:`Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.`,author:`Abdoulaye Diallo`,rating:5,comment:`Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement.`},{id:`rev_r20_1`,date:`2026-06-12`,reply:null,author:`Khadija Fall`,rating:4,comment:`Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d'attente à la livraison.`},{id:`rev_r20_2`,date:`2026-06-14`,reply:`Merci Michel ! Heureux de vous avoir accueilli.`,author:`Michel Dupont`,rating:5,comment:`Un trésor caché à Thiès. Le service Teranga est excellent.`}],created_at:`2026-06-20T03:24:45.203377+00:00`,subscription_pack:`Aucun (Gratuit)`,lat:14.7928,lng:-16.926,location:null,menu_items:[{id:`dish_1`,name:`Thiéboudiène Penda Mbaye`,price:2500,category:null,image_url:`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce.`,is_available:!0,restaurant_id:`r20`},{id:`dish_2`,name:`Yassa Poulet au Feu de Bois`,price:2200,category:null,image_url:`https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé.`,is_available:!0,restaurant_id:`r20`},{id:`dish_3`,name:`Mafé Viande de Bœuf`,price:2e3,category:null,image_url:`https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d'arachide locale, riz blanc.`,is_available:!0,restaurant_id:`r20`},{id:`dish_4`,name:`Jus de Bissap Glacé`,price:500,category:null,image_url:`https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Boisson rafraîchissante maison à base d'infusion de fleurs d'hibiscus séchées, menthe et sucre.`,is_available:!0,restaurant_id:`r20`},{id:`dish_5`,name:`Jus de Bouye (Pain de Singe)`,price:500,category:null,image_url:`https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré.`,is_available:!0,restaurant_id:`r20`}]},{id:`r1`,name:`Croissant Magique`,slug:`croissant-magique`,rating:3.9,reviews_count:999,category:`Pâtisserie`,address:`Avenue Léopold Sédar Senghor, Thiès`,whatsapp:`+221339512551`,open_hours:`07:00 - 22:00`,closed_days:[],is_open_manual:!0,status:`active`,username:`id_croissantmagique`,cover_image:`https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=60`,menu:[{id:`dish_12`,name:`Croissant Beurre Français`,image:`https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=60`,price:500,description:`Feuilletage croustillant pur beurre, doré à souhait.`},{id:`dish_13`,name:`Pain au Chocolat (Chocolatine)`,image:`https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500&auto=format&fit=crop&q=60`,price:600,description:`Viennoiserie feuilletée avec deux barres de chocolat noir.`},{id:`dish_14`,name:`Formule Petit-Déjeuner Express`,image:`https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=500&auto=format&fit=crop&q=60`,price:1500,description:`Un café Touba ou expresso, un croissant, et un verre de jus frais d'orange.`}],reviews:[{id:`rev_r1_0`,date:`2026-06-10`,reply:`Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.`,author:`Abdoulaye Diallo`,rating:5,comment:`Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement.`},{id:`rev_r1_1`,date:`2026-06-12`,reply:null,author:`Khadija Fall`,rating:4,comment:`Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d'attente à la livraison.`},{id:`rev_r1_2`,date:`2026-06-14`,reply:`Merci Michel ! Heureux de vous avoir accueilli.`,author:`Michel Dupont`,rating:5,comment:`Un trésor caché à Thiès. Le service Teranga est excellent.`}],created_at:`2026-06-20T03:24:45.203377+00:00`,subscription_pack:`Aucun (Gratuit)`,lat:14.7928,lng:-16.926,location:null,menu_items:[{id:`dish_12`,name:`Croissant Beurre Français`,price:500,category:null,image_url:`https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Feuilletage croustillant pur beurre, doré à souhait.`,is_available:!0,restaurant_id:`r1`},{id:`dish_13`,name:`Pain au Chocolat (Chocolatine)`,price:600,category:null,image_url:`https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Viennoiserie feuilletée avec deux barres de chocolat noir.`,is_available:!0,restaurant_id:`r1`},{id:`dish_14`,name:`Formule Petit-Déjeuner Express`,price:1500,category:null,image_url:`https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Un café Touba ou expresso, un croissant, et un verre de jus frais d'orange.`,is_available:!0,restaurant_id:`r1`}]},{id:`r18`,name:`La Licorne`,slug:`la-licorne`,rating:4.8,reviews_count:11,category:`Gastronomique`,address:`Zone Résidentielle Escale, Thiès`,whatsapp:`+221772012229`,open_hours:`12:00 - 23:00`,closed_days:[1],is_open_manual:!0,status:`active`,username:`id_lalicorne`,cover_image:`https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=60`,menu:[{id:`dish_15`,name:`Lotte rôtie sauce vanille de Casamance`,image:`https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60`,price:7500,description:`Médaillon de lotte poêlé, purée fine de patate douce et émulsion à la vanille.`},{id:`dish_16`,name:`Filet de Bœuf braisé au Café Touba`,image:`https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60`,price:8e3,description:`Filet tendre de bœuf du pays, sauce corsée infusée au café Touba et poivre de Selim, petits légumes.`},{id:`dish_17`,name:`Moelleux au Chocolat & Coulis Bissap`,image:`https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60`,price:2500,description:`Dessert gourmand au cœur coulant, parfumé d'un coulis acidulé au bissap rouge.`}],reviews:[{id:`rev_r18_0`,date:`2026-06-10`,reply:`Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.`,author:`Abdoulaye Diallo`,rating:5,comment:`Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement.`},{id:`rev_r18_1`,date:`2026-06-12`,reply:null,author:`Khadija Fall`,rating:4,comment:`Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d'attente à la livraison.`},{id:`rev_r18_2`,date:`2026-06-14`,reply:`Merci Michel ! Heureux de vous avoir accueilli.`,author:`Michel Dupont`,rating:5,comment:`Un trésor caché à Thiès. Le service Teranga est excellent.`}],created_at:`2026-06-20T03:24:45.203377+00:00`,subscription_pack:`Aucun (Gratuit)`,lat:14.7928,lng:-16.926,location:null,menu_items:[{id:`dish_15`,name:`Lotte rôtie sauce vanille de Casamance`,price:7500,category:null,image_url:`https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Médaillon de lotte poêlé, purée fine de patate douce et émulsion à la vanille.`,is_available:!0,restaurant_id:`r18`},{id:`dish_16`,name:`Filet de Bœuf braisé au Café Touba`,price:8e3,category:null,image_url:`https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Filet tendre de bœuf du pays, sauce corsée infusée au café Touba et poivre de Selim, petits légumes.`,is_available:!0,restaurant_id:`r18`},{id:`dish_17`,name:`Moelleux au Chocolat & Coulis Bissap`,price:2500,category:null,image_url:`https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Dessert gourmand au cœur coulant, parfumé d'un coulis acidulé au bissap rouge.`,is_available:!0,restaurant_id:`r18`}]},{id:`r2`,name:`Le Café du Rail`,slug:`cafe-du-rail`,rating:4.7,reviews_count:679,category:`Traditionnel`,address:`Près de la Gare ferroviaire de Thiès`,whatsapp:`+221773505050`,open_hours:`08:00 - 23:00`,closed_days:[1],is_open_manual:!0,status:`active`,username:`id_lecafedurail`,cover_image:`https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=60`,menu:[{id:`dish_1`,name:`Thiéboudiène Penda Mbaye`,image:`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60`,price:2500,description:`Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce.`},{id:`dish_2`,name:`Yassa Poulet au Feu de Bois`,image:`https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=60`,price:2200,description:`Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé.`},{id:`dish_3`,name:`Mafé Viande de Bœuf`,image:`https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=60`,price:2e3,description:`Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d'arachide locale, riz blanc.`},{id:`dish_4`,name:`Jus de Bissap Glacé`,image:`https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60`,price:500,description:`Boisson rafraîchissante maison à base d'infusion de fleurs d'hibiscus séchées, menthe et sucre.`},{id:`dish_5`,name:`Jus de Bouye (Pain de Singe)`,image:`https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60`,price:500,description:`Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré.`}],reviews:[{id:`rev_r2_0`,date:`2026-06-10`,reply:`Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.`,author:`Abdoulaye Diallo`,rating:5,comment:`Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement.`},{id:`rev_r2_1`,date:`2026-06-12`,reply:null,author:`Khadija Fall`,rating:4,comment:`Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d'attente à la livraison.`},{id:`rev_r2_2`,date:`2026-06-14`,reply:`Merci Michel ! Heureux de vous avoir accueilli.`,author:`Michel Dupont`,rating:5,comment:`Un trésor caché à Thiès. Le service Teranga est excellent.`}],created_at:`2026-06-20T03:24:45.203377+00:00`,subscription_pack:`Aucun (Gratuit)`,lat:14.7928,lng:-16.926,location:null,menu_items:[{id:`dish_1`,name:`Thiéboudiène Penda Mbaye`,price:2500,category:null,image_url:`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce.`,is_available:!0,restaurant_id:`r2`},{id:`dish_2`,name:`Yassa Poulet au Feu de Bois`,price:2200,category:null,image_url:`https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé.`,is_available:!0,restaurant_id:`r2`},{id:`dish_3`,name:`Mafé Viande de Bœuf`,price:2e3,category:null,image_url:`https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d'arachide locale, riz blanc.`,is_available:!0,restaurant_id:`r2`},{id:`dish_4`,name:`Jus de Bissap Glacé`,price:500,category:null,image_url:`https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Boisson rafraîchissante maison à base d'infusion de fleurs d'hibiscus séchées, menthe et sucre.`,is_available:!0,restaurant_id:`r2`},{id:`dish_5`,name:`Jus de Bouye (Pain de Singe)`,price:500,category:null,image_url:`https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré.`,is_available:!0,restaurant_id:`r2`}]},{id:`r7`,name:`Ile de Gorée`,slug:`ile-de-goree`,rating:3.9,reviews_count:159,category:`Traditionnel`,address:`Av. Lamine Gueye, Thiès`,whatsapp:`+221339510267`,open_hours:`08:00 - 04:00`,closed_days:[],is_open_manual:!0,status:`active`,username:`id_iledegoree`,cover_image:`https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&auto=format&fit=crop&q=60`,menu:[{id:`dish_1`,name:`Thiéboudiène Penda Mbaye`,image:`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60`,price:2500,description:`Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce.`},{id:`dish_2`,name:`Yassa Poulet au Feu de Bois`,image:`https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=60`,price:2200,description:`Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé.`},{id:`dish_3`,name:`Mafé Viande de Bœuf`,image:`https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=60`,price:2e3,description:`Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d'arachide locale, riz blanc.`},{id:`dish_4`,name:`Jus de Bissap Glacé`,image:`https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60`,price:500,description:`Boisson rafraîchissante maison à base d'infusion de fleurs d'hibiscus séchées, menthe et sucre.`},{id:`dish_5`,name:`Jus de Bouye (Pain de Singe)`,image:`https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60`,price:500,description:`Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré.`}],reviews:[{id:`rev_r7_0`,date:`2026-06-10`,reply:`Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.`,author:`Abdoulaye Diallo`,rating:5,comment:`Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement.`},{id:`rev_r7_1`,date:`2026-06-12`,reply:null,author:`Khadija Fall`,rating:4,comment:`Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d'attente à la livraison.`},{id:`rev_r7_2`,date:`2026-06-14`,reply:`Merci Michel ! Heureux de vous avoir accueilli.`,author:`Michel Dupont`,rating:5,comment:`Un trésor caché à Thiès. Le service Teranga est excellent.`}],created_at:`2026-06-20T03:24:45.203377+00:00`,subscription_pack:`Aucun (Gratuit)`,lat:14.7928,lng:-16.926,location:null,menu_items:[{id:`dish_1`,name:`Thiéboudiène Penda Mbaye`,price:2500,category:null,image_url:`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce.`,is_available:!0,restaurant_id:`r7`},{id:`dish_2`,name:`Yassa Poulet au Feu de Bois`,price:2200,category:null,image_url:`https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé.`,is_available:!0,restaurant_id:`r7`},{id:`dish_3`,name:`Mafé Viande de Bœuf`,price:2e3,category:null,image_url:`https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d'arachide locale, riz blanc.`,is_available:!0,restaurant_id:`r7`},{id:`dish_4`,name:`Jus de Bissap Glacé`,price:500,category:null,image_url:`https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Boisson rafraîchissante maison à base d'infusion de fleurs d'hibiscus séchées, menthe et sucre.`,is_available:!0,restaurant_id:`r7`},{id:`dish_5`,name:`Jus de Bouye (Pain de Singe)`,price:500,category:null,image_url:`https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré.`,is_available:!0,restaurant_id:`r7`}]},{id:`r14`,name:`Le Festin Africain`,slug:`le-festin-africain`,rating:4.1,reviews_count:28,category:`Traditionnel`,address:`Près du Stade Lat Dior, Thiès`,whatsapp:`+221770123456`,open_hours:`12:00 - 22:00`,closed_days:[],is_open_manual:!0,status:`active`,username:`le-festin-africain`,cover_image:`https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60`,menu:[{id:`dish_1`,name:`Thiéboudiène Penda Mbaye`,image:`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60`,price:2500,description:`Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce.`},{id:`dish_2`,name:`Yassa Poulet au Feu de Bois`,image:`https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=60`,price:2200,description:`Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé.`},{id:`dish_3`,name:`Mafé Viande de Bœuf`,image:`https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=60`,price:2e3,description:`Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d'arachide locale, riz blanc.`},{id:`dish_4`,name:`Jus de Bissap Glacé`,image:`https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60`,price:500,description:`Boisson rafraîchissante maison à base d'infusion de fleurs d'hibiscus séchées, menthe et sucre.`},{id:`dish_5`,name:`Jus de Bouye (Pain de Singe)`,image:`https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60`,price:500,description:`Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré.`}],reviews:[{id:`rev_r14_0`,date:`2026-06-10`,reply:`Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.`,author:`Abdoulaye Diallo`,rating:5,comment:`Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement.`},{id:`rev_r14_1`,date:`2026-06-12`,reply:null,author:`Khadija Fall`,rating:4,comment:`Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d'attente à la livraison.`},{id:`rev_r14_2`,date:`2026-06-14`,reply:`Merci Michel ! Heureux de vous avoir accueilli.`,author:`Michel Dupont`,rating:5,comment:`Un trésor caché à Thiès. Le service Teranga est excellent.`}],created_at:`2026-06-20T03:24:45.203377+00:00`,subscription_pack:`Aucun (Gratuit)`,lat:14.7928,lng:-16.926,location:null,menu_items:[{id:`dish_1`,name:`Thiéboudiène Penda Mbaye`,price:2500,category:null,image_url:`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce.`,is_available:!0,restaurant_id:`r14`},{id:`dish_2`,name:`Yassa Poulet au Feu de Bois`,price:2200,category:null,image_url:`https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé.`,is_available:!0,restaurant_id:`r14`},{id:`dish_3`,name:`Mafé Viande de Bœuf`,price:2e3,category:null,image_url:`https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d'arachide locale, riz blanc.`,is_available:!0,restaurant_id:`r14`},{id:`dish_4`,name:`Jus de Bissap Glacé`,price:500,category:null,image_url:`https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Boisson rafraîchissante maison à base d'infusion de fleurs d'hibiscus séchées, menthe et sucre.`,is_available:!0,restaurant_id:`r14`},{id:`dish_5`,name:`Jus de Bouye (Pain de Singe)`,price:500,category:null,image_url:`https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré.`,is_available:!0,restaurant_id:`r14`}]},{id:`r15`,name:`Snack du Marché`,slug:`snack-du-marche`,rating:3.6,reviews_count:22,category:`Fast Food`,address:`Marché Central de Thiès`,whatsapp:`+221771234567`,open_hours:`09:00 - 19:00`,closed_days:[7],is_open_manual:!0,status:`active`,username:`snack-du-marche`,cover_image:`https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=600&auto=format&fit=crop&q=60`,menu:[{id:`dish_9`,name:`Burger Teranga Double Cheese`,image:`https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60`,price:2e3,description:`Pain artisanal, double steak de bœuf haché, double cheddar fondu, sauce maison.`},{id:`dish_10`,name:`Chawarma Poulet Fromage`,image:`https://images.unsplash.com/photo-1626700051175-6518c4793f06?w=500&auto=format&fit=crop&q=60`,price:1500,description:`Pain libanais roulé garni de poulet émincé grillé, frites maison, crème d'ail et fromage.`},{id:`dish_11`,name:`Frites Maison (Portion XXL)`,image:`https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60`,price:800,description:`Pommes de terre fraîches coupées à la main et frites dorées aux herbes aromatiques.`},{id:`dish_5`,name:`Jus de Bouye`,image:`https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60`,price:500,description:`Jus onctueux à base de fruit de baobab.`}],reviews:[{id:`rev_r15_0`,date:`2026-06-10`,reply:`Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.`,author:`Abdoulaye Diallo`,rating:5,comment:`Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement.`},{id:`rev_r15_1`,date:`2026-06-12`,reply:null,author:`Khadija Fall`,rating:4,comment:`Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d'attente à la livraison.`},{id:`rev_r15_2`,date:`2026-06-14`,reply:`Merci Michel ! Heureux de vous avoir accueilli.`,author:`Michel Dupont`,rating:5,comment:`Un trésor caché à Thiès. Le service Teranga est excellent.`}],created_at:`2026-06-20T03:24:45.203377+00:00`,subscription_pack:`Aucun (Gratuit)`,lat:14.7928,lng:-16.926,location:null,menu_items:[{id:`dish_9`,name:`Burger Teranga Double Cheese`,price:2e3,category:null,image_url:`https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Pain artisanal, double steak de bœuf haché, double cheddar fondu, sauce maison.`,is_available:!0,restaurant_id:`r15`},{id:`dish_10`,name:`Chawarma Poulet Fromage`,price:1500,category:null,image_url:`https://images.unsplash.com/photo-1626700051175-6518c4793f06?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Pain libanais roulé garni de poulet émincé grillé, frites maison, crème d'ail et fromage.`,is_available:!0,restaurant_id:`r15`},{id:`dish_11`,name:`Frites Maison (Portion XXL)`,price:800,category:null,image_url:`https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Pommes de terre fraîches coupées à la main et frites dorées aux herbes aromatiques.`,is_available:!0,restaurant_id:`r15`},{id:`dish_5`,name:`Jus de Bouye`,price:500,category:null,image_url:`https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Jus onctueux à base de fruit de baobab.`,is_available:!0,restaurant_id:`r15`}]},{id:`r5`,name:`OBS Resto Chicha`,slug:`obs-resto-chicha`,rating:5,reviews_count:1,category:`Traditionnel`,address:`Rue Dr. Birane Beye, Thiès`,whatsapp:`+221784269172`,open_hours:`24h/24`,closed_days:[],is_open_manual:!0,status:`active`,username:`id_obsrestochicha`,cover_image:`https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=600&auto=format&fit=crop&q=60`,menu:[{id:`dish_1`,name:`Thiéboudiène Penda Mbaye`,image:`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60`,price:2500,description:`Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce.`},{id:`dish_2`,name:`Yassa Poulet au Feu de Bois`,image:`https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=60`,price:2200,description:`Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé.`},{id:`dish_3`,name:`Mafé Viande de Bœuf`,image:`https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=60`,price:2e3,description:`Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d'arachide locale, riz blanc.`},{id:`dish_4`,name:`Jus de Bissap Glacé`,image:`https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60`,price:500,description:`Boisson rafraîchissante maison à base d'infusion de fleurs d'hibiscus séchées, menthe et sucre.`},{id:`dish_5`,name:`Jus de Bouye (Pain de Singe)`,image:`https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60`,price:500,description:`Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré.`}],reviews:[{id:`rev_r5_0`,date:`2026-06-10`,reply:`Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.`,author:`Abdoulaye Diallo`,rating:5,comment:`Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement.`},{id:`rev_r5_1`,date:`2026-06-12`,reply:null,author:`Khadija Fall`,rating:4,comment:`Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d'attente à la livraison.`},{id:`rev_r5_2`,date:`2026-06-14`,reply:`Merci Michel ! Heureux de vous avoir accueilli.`,author:`Michel Dupont`,rating:5,comment:`Un trésor caché à Thiès. Le service Teranga est excellent.`}],created_at:`2026-06-20T03:24:45.203377+00:00`,subscription_pack:`Aucun (Gratuit)`,lat:14.7928,lng:-16.926,location:null,menu_items:[{id:`dish_1`,name:`Thiéboudiène Penda Mbaye`,price:2500,category:null,image_url:`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce.`,is_available:!0,restaurant_id:`r5`},{id:`dish_2`,name:`Yassa Poulet au Feu de Bois`,price:2200,category:null,image_url:`https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé.`,is_available:!0,restaurant_id:`r5`},{id:`dish_3`,name:`Mafé Viande de Bœuf`,price:2e3,category:null,image_url:`https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d'arachide locale, riz blanc.`,is_available:!0,restaurant_id:`r5`},{id:`dish_4`,name:`Jus de Bissap Glacé`,price:500,category:null,image_url:`https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Boisson rafraîchissante maison à base d'infusion de fleurs d'hibiscus séchées, menthe et sucre.`,is_available:!0,restaurant_id:`r5`},{id:`dish_5`,name:`Jus de Bouye (Pain de Singe)`,price:500,category:null,image_url:`https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré.`,is_available:!0,restaurant_id:`r5`}]},{id:`r6`,name:`Sam's Prestige`,slug:`sams-prestige`,rating:3.5,reviews_count:229,category:`Traditionnel`,address:`Avenida Léopold Senghor, Thiès`,whatsapp:`+221772004699`,open_hours:`08:00 - 02:00`,closed_days:[],is_open_manual:!0,status:`active`,username:`id_samsprestige`,cover_image:`https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=60`,menu:[{id:`dish_9`,name:`Burger Teranga Double Cheese`,image:`https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60`,price:2e3,description:`Pain artisanal, double steak de bœuf haché, double cheddar fondu, sauce maison.`},{id:`dish_10`,name:`Chawarma Poulet Fromage`,image:`https://images.unsplash.com/photo-1626700051175-6518c4793f06?w=500&auto=format&fit=crop&q=60`,price:1500,description:`Pain libanais roulé garni de poulet émincé grillé, frites maison, crème d'ail et fromage.`},{id:`dish_11`,name:`Frites Maison (Portion XXL)`,image:`https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60`,price:800,description:`Pommes de terre fraîches coupées à la main et frites dorées aux herbes aromatiques.`},{id:`dish_5`,name:`Jus de Bouye`,image:`https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60`,price:500,description:`Jus onctueux à base de fruit de baobab.`}],reviews:[{id:`rev_r6_0`,date:`2026-06-10`,reply:`Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.`,author:`Abdoulaye Diallo`,rating:5,comment:`Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement.`},{id:`rev_r6_1`,date:`2026-06-12`,reply:null,author:`Khadija Fall`,rating:4,comment:`Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d'attente à la livraison.`},{id:`rev_r6_2`,date:`2026-06-14`,reply:`Merci Michel ! Heureux de vous avoir accueilli.`,author:`Michel Dupont`,rating:5,comment:`Un trésor caché à Thiès. Le service Teranga est excellent.`}],created_at:`2026-06-20T03:24:45.203377+00:00`,subscription_pack:`Aucun (Gratuit)`,lat:14.7928,lng:-16.926,location:null,menu_items:[{id:`dish_9`,name:`Burger Teranga Double Cheese`,price:2e3,category:null,image_url:`https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Pain artisanal, double steak de bœuf haché, double cheddar fondu, sauce maison.`,is_available:!0,restaurant_id:`r6`},{id:`dish_10`,name:`Chawarma Poulet Fromage`,price:1500,category:null,image_url:`https://images.unsplash.com/photo-1626700051175-6518c4793f06?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Pain libanais roulé garni de poulet émincé grillé, frites maison, crème d'ail et fromage.`,is_available:!0,restaurant_id:`r6`},{id:`dish_11`,name:`Frites Maison (Portion XXL)`,price:800,category:null,image_url:`https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Pommes de terre fraîches coupées à la main et frites dorées aux herbes aromatiques.`,is_available:!0,restaurant_id:`r6`},{id:`dish_5`,name:`Jus de Bouye`,price:500,category:null,image_url:`https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Jus onctueux à base de fruit de baobab.`,is_available:!0,restaurant_id:`r6`}]},{id:`r11`,name:`Case à Teranga`,slug:`case-a-teranga`,rating:3.9,reviews_count:7,category:`Traditionnel`,address:`Thiès, Sénégal`,whatsapp:`+221773239779`,open_hours:`09:00 - 00:00`,closed_days:[],is_open_manual:!0,status:`active`,username:`id_caseateranga`,cover_image:`https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=600&auto=format&fit=crop&q=60`,menu:[{id:`dish_1`,name:`Thiéboudiène Penda Mbaye`,image:`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60`,price:2500,description:`Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce.`},{id:`dish_2`,name:`Yassa Poulet au Feu de Bois`,image:`https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=60`,price:2200,description:`Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé.`},{id:`dish_3`,name:`Mafé Viande de Bœuf`,image:`https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=60`,price:2e3,description:`Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d'arachide locale, riz blanc.`},{id:`dish_4`,name:`Jus de Bissap Glacé`,image:`https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60`,price:500,description:`Boisson rafraîchissante maison à base d'infusion de fleurs d'hibiscus séchées, menthe et sucre.`},{id:`dish_5`,name:`Jus de Bouye (Pain de Singe)`,image:`https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60`,price:500,description:`Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré.`}],reviews:[{id:`rev_r11_0`,date:`2026-06-10`,reply:`Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.`,author:`Abdoulaye Diallo`,rating:5,comment:`Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement.`},{id:`rev_r11_1`,date:`2026-06-12`,reply:null,author:`Khadija Fall`,rating:4,comment:`Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d'attente à la livraison.`},{id:`rev_r11_2`,date:`2026-06-14`,reply:`Merci Michel ! Heureux de vous avoir accueilli.`,author:`Michel Dupont`,rating:5,comment:`Un trésor caché à Thiès. Le service Teranga est excellent.`}],created_at:`2026-06-20T03:24:45.203377+00:00`,subscription_pack:`Aucun (Gratuit)`,lat:14.7928,lng:-16.926,location:null,menu_items:[{id:`dish_1`,name:`Thiéboudiène Penda Mbaye`,price:2500,category:null,image_url:`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce.`,is_available:!0,restaurant_id:`r11`},{id:`dish_2`,name:`Yassa Poulet au Feu de Bois`,price:2200,category:null,image_url:`https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé.`,is_available:!0,restaurant_id:`r11`},{id:`dish_3`,name:`Mafé Viande de Bœuf`,price:2e3,category:null,image_url:`https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d'arachide locale, riz blanc.`,is_available:!0,restaurant_id:`r11`},{id:`dish_4`,name:`Jus de Bissap Glacé`,price:500,category:null,image_url:`https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Boisson rafraîchissante maison à base d'infusion de fleurs d'hibiscus séchées, menthe et sucre.`,is_available:!0,restaurant_id:`r11`},{id:`dish_5`,name:`Jus de Bouye (Pain de Singe)`,price:500,category:null,image_url:`https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré.`,is_available:!0,restaurant_id:`r11`}]},{id:`r21`,name:`Alamindelice`,slug:`alamindelice`,rating:5,reviews_count:0,category:`Pâtisserie`,address:`Seras`,whatsapp:`+221784799882`,open_hours:`00:00 - 00:00`,closed_days:[],is_open_manual:!0,status:`active`,username:`id_alamindelice`,cover_image:null,menu:[{id:`dish_1`,name:`Thiéboudiène Penda Mbaye`,image:`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60`,price:2500,description:`Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce.`},{id:`dish_2`,name:`Yassa Poulet au Feu de Bois`,image:`https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=60`,price:2200,description:`Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé.`},{id:`dish_3`,name:`Mafé Viande de Bœuf`,image:`https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=60`,price:2e3,description:`Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d'arachide locale, riz blanc.`},{id:`dish_4`,name:`Jus de Bissap Glacé`,image:`https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60`,price:500,description:`Boisson rafraîchissante maison à base d'infusion de fleurs d'hibiscus séchées, menthe et sucre.`},{id:`dish_5`,name:`Jus de Bouye (Pain de Singe)`,image:`https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60`,price:500,description:`Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré.`}],reviews:[],created_at:`2026-07-26T02:27:53.842184+00:00`,subscription_pack:`Pack Startup`,lat:14.7928,lng:-16.926,location:null,menu_items:[{id:`dish_1`,name:`Thiéboudiène Penda Mbaye`,price:2500,category:null,image_url:`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce.`,is_available:!0,restaurant_id:`r21`},{id:`dish_2`,name:`Yassa Poulet au Feu de Bois`,price:2200,category:null,image_url:`https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé.`,is_available:!0,restaurant_id:`r21`},{id:`dish_3`,name:`Mafé Viande de Bœuf`,price:2e3,category:null,image_url:`https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d'arachide locale, riz blanc.`,is_available:!0,restaurant_id:`r21`},{id:`dish_4`,name:`Jus de Bissap Glacé`,price:500,category:null,image_url:`https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Boisson rafraîchissante maison à base d'infusion de fleurs d'hibiscus séchées, menthe et sucre.`,is_available:!0,restaurant_id:`r21`},{id:`dish_5`,name:`Jus de Bouye (Pain de Singe)`,price:500,category:null,image_url:`https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré.`,is_available:!0,restaurant_id:`r21`}]},{id:`r8`,name:`Nadia`,slug:`nadia`,rating:4,reviews_count:0,category:`Traditionnel`,address:`Thiès 21000, Sénégal`,whatsapp:`+221774640624`,open_hours:`24h/24`,closed_days:[],is_open_manual:!0,status:`active`,username:`id_nadia`,cover_image:`https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&auto=format&fit=crop&q=60`,menu:[{id:`dish_9`,name:`Burger Teranga Double Cheese`,image:`https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60`,price:2e3,description:`Pain artisanal, double steak de bœuf haché, double cheddar fondu, sauce maison.`},{id:`dish_10`,name:`Chawarma Poulet Fromage`,image:`https://images.unsplash.com/photo-1626700051175-6518c4793f06?w=500&auto=format&fit=crop&q=60`,price:1500,description:`Pain libanais roulé garni de poulet émincé grillé, frites maison, crème d'ail et fromage.`},{id:`dish_11`,name:`Frites Maison (Portion XXL)`,image:`https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60`,price:800,description:`Pommes de terre fraîches coupées à la main et frites dorées aux herbes aromatiques.`},{id:`dish_5`,name:`Jus de Bouye`,image:`https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60`,price:500,description:`Jus onctueux à base de fruit de baobab.`}],reviews:[{id:`rev_r8_0`,date:`2026-06-10`,reply:`Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.`,author:`Abdoulaye Diallo`,rating:5,comment:`Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement.`},{id:`rev_r8_1`,date:`2026-06-12`,reply:null,author:`Khadija Fall`,rating:4,comment:`Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d'attente à la livraison.`},{id:`rev_r8_2`,date:`2026-06-14`,reply:`Merci Michel ! Heureux de vous avoir accueilli.`,author:`Michel Dupont`,rating:5,comment:`Un trésor caché à Thiès. Le service Teranga est excellent.`}],created_at:`2026-06-20T03:24:45.203377+00:00`,subscription_pack:`Aucun (Gratuit)`,lat:14.7928,lng:-16.926,location:null,menu_items:[{id:`dish_9`,name:`Burger Teranga Double Cheese`,price:2e3,category:null,image_url:`https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Pain artisanal, double steak de bœuf haché, double cheddar fondu, sauce maison.`,is_available:!0,restaurant_id:`r8`},{id:`dish_10`,name:`Chawarma Poulet Fromage`,price:1500,category:null,image_url:`https://images.unsplash.com/photo-1626700051175-6518c4793f06?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Pain libanais roulé garni de poulet émincé grillé, frites maison, crème d'ail et fromage.`,is_available:!0,restaurant_id:`r8`},{id:`dish_11`,name:`Frites Maison (Portion XXL)`,price:800,category:null,image_url:`https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Pommes de terre fraîches coupées à la main et frites dorées aux herbes aromatiques.`,is_available:!0,restaurant_id:`r8`},{id:`dish_5`,name:`Jus de Bouye`,price:500,category:null,image_url:`https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Jus onctueux à base de fruit de baobab.`,is_available:!0,restaurant_id:`r8`}]},{id:`r9`,name:`Tacos de Thiès`,slug:`tacos-de-thies`,rating:3.6,reviews_count:74,category:`Fast Food`,address:`335 Av. Lamine Gueye, Thiès`,whatsapp:`+221761385542`,open_hours:`11:00 - 02:00`,closed_days:[],is_open_manual:!0,status:`active`,username:`id_tacosdethies`,cover_image:`https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&auto=format&fit=crop&q=60`,menu:[{id:`dish_1`,name:`Thiéboudiène Penda Mbaye`,image:`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60`,price:2500,description:`Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce.`},{id:`dish_2`,name:`Yassa Poulet au Feu de Bois`,image:`https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=60`,price:2200,description:`Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé.`},{id:`dish_3`,name:`Mafé Viande de Bœuf`,image:`https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=60`,price:2e3,description:`Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d'arachide locale, riz blanc.`},{id:`dish_4`,name:`Jus de Bissap Glacé`,image:`https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60`,price:500,description:`Boisson rafraîchissante maison à base d'infusion de fleurs d'hibiscus séchées, menthe et sucre.`},{id:`dish_5`,name:`Jus de Bouye (Pain de Singe)`,image:`https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60`,price:500,description:`Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré.`}],reviews:[{id:`rev_r9_0`,date:`2026-06-10`,reply:`Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.`,author:`Abdoulaye Diallo`,rating:5,comment:`Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement.`},{id:`rev_r9_1`,date:`2026-06-12`,reply:null,author:`Khadija Fall`,rating:4,comment:`Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d'attente à la livraison.`},{id:`rev_r9_2`,date:`2026-06-14`,reply:`Merci Michel ! Heureux de vous avoir accueilli.`,author:`Michel Dupont`,rating:5,comment:`Un trésor caché à Thiès. Le service Teranga est excellent.`}],created_at:`2026-06-20T03:24:45.203377+00:00`,subscription_pack:`Aucun (Gratuit)`,lat:14.7928,lng:-16.926,location:null,menu_items:[{id:`dish_1`,name:`Thiéboudiène Penda Mbaye`,price:2500,category:null,image_url:`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Riz au poisson rouge traditionnel sénégalais, légumes frais (chou, manioc, carotte) et sauce tamarin douce.`,is_available:!0,restaurant_id:`r9`},{id:`dish_2`,name:`Yassa Poulet au Feu de Bois`,price:2200,category:null,image_url:`https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Poulet mariné au citron vert, moutarde et oignons caramélisés fondants, servi avec riz blanc brisé.`,is_available:!0,restaurant_id:`r9`},{id:`dish_3`,name:`Mafé Viande de Bœuf`,price:2e3,category:null,image_url:`https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Mijoté de bœuf tendre dans une sauce onctueuse à base de pâte d'arachide locale, riz blanc.`,is_available:!0,restaurant_id:`r9`},{id:`dish_4`,name:`Jus de Bissap Glacé`,price:500,category:null,image_url:`https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Boisson rafraîchissante maison à base d'infusion de fleurs d'hibiscus séchées, menthe et sucre.`,is_available:!0,restaurant_id:`r9`},{id:`dish_5`,name:`Jus de Bouye (Pain de Singe)`,price:500,category:null,image_url:`https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Jus local onctueux à base de pulpe de fruits de baobab et de lait concentré sucré.`,is_available:!0,restaurant_id:`r9`}]},{id:`r10`,name:`Pamanda`,slug:`pamanda`,rating:4,reviews_count:366,category:`Traditionnel`,address:`Guinth Rue Amadou Sow, Thiès`,whatsapp:`+221339521550`,open_hours:`09:00 - 01:30`,closed_days:[],is_open_manual:!0,status:`active`,username:`id_pamanda`,cover_image:`https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&auto=format&fit=crop&q=60`,menu:[{id:`dish_9`,name:`Burger Teranga Double Cheese`,image:`https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60`,price:2e3,description:`Pain artisanal, double steak de bœuf haché, double cheddar fondu, sauce maison.`},{id:`dish_10`,name:`Chawarma Poulet Fromage`,image:`https://images.unsplash.com/photo-1626700051175-6518c4793f06?w=500&auto=format&fit=crop&q=60`,price:1500,description:`Pain libanais roulé garni de poulet émincé grillé, frites maison, crème d'ail et fromage.`},{id:`dish_11`,name:`Frites Maison (Portion XXL)`,image:`https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60`,price:800,description:`Pommes de terre fraîches coupées à la main et frites dorées aux herbes aromatiques.`},{id:`dish_5`,name:`Jus de Bouye`,image:`https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60`,price:500,description:`Jus onctueux à base de fruit de baobab.`}],reviews:[{id:`rev_r10_0`,date:`2026-06-10`,reply:`Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.`,author:`Abdoulaye Diallo`,rating:5,comment:`Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement.`},{id:`rev_r10_1`,date:`2026-06-12`,reply:null,author:`Khadija Fall`,rating:4,comment:`Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d'attente à la livraison.`},{id:`rev_r10_2`,date:`2026-06-14`,reply:`Merci Michel ! Heureux de vous avoir accueilli.`,author:`Michel Dupont`,rating:5,comment:`Un trésor caché à Thiès. Le service Teranga est excellent.`}],created_at:`2026-06-20T03:24:45.203377+00:00`,subscription_pack:`Aucun (Gratuit)`,lat:14.7928,lng:-16.926,location:null,menu_items:[{id:`dish_9`,name:`Burger Teranga Double Cheese`,price:2e3,category:null,image_url:`https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Pain artisanal, double steak de bœuf haché, double cheddar fondu, sauce maison.`,is_available:!0,restaurant_id:`r10`},{id:`dish_10`,name:`Chawarma Poulet Fromage`,price:1500,category:null,image_url:`https://images.unsplash.com/photo-1626700051175-6518c4793f06?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Pain libanais roulé garni de poulet émincé grillé, frites maison, crème d'ail et fromage.`,is_available:!0,restaurant_id:`r10`},{id:`dish_11`,name:`Frites Maison (Portion XXL)`,price:800,category:null,image_url:`https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Pommes de terre fraîches coupées à la main et frites dorées aux herbes aromatiques.`,is_available:!0,restaurant_id:`r10`},{id:`dish_5`,name:`Jus de Bouye`,price:500,category:null,image_url:`https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Jus onctueux à base de fruit de baobab.`,is_available:!0,restaurant_id:`r10`}]},{id:`r12`,name:`Restaurant Khayma Teslem`,slug:`khayma-teslem`,rating:5,reviews_count:1,category:`Traditionnel`,address:`358 Rocade de Contournement de Thiès`,whatsapp:`+221788712020`,open_hours:`24h/24`,closed_days:[],is_open_manual:!0,status:`active`,username:`id_restaurantkhaymateslem`,cover_image:`https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=600&auto=format&fit=crop&q=60`,menu:[{id:`dish_15`,name:`Lotte rôtie sauce vanille de Casamance`,image:`https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60`,price:7500,description:`Médaillon de lotte poêlé, purée fine de patate douce et émulsion à la vanille.`},{id:`dish_16`,name:`Filet de Bœuf braisé au Café Touba`,image:`https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60`,price:8e3,description:`Filet tendre de bœuf du pays, sauce corsée infusée au café Touba et poivre de Selim, petits légumes.`},{id:`dish_17`,name:`Moelleux au Chocolat & Coulis Bissap`,image:`https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60`,price:2500,description:`Dessert gourmand au cœur coulant, parfumé d'un coulis acidulé au bissap rouge.`}],reviews:[{id:`rev_r12_0`,date:`2026-06-10`,reply:`Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.`,author:`Abdoulaye Diallo`,rating:5,comment:`Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement.`},{id:`rev_r12_1`,date:`2026-06-12`,reply:null,author:`Khadija Fall`,rating:4,comment:`Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d'attente à la livraison.`},{id:`rev_r12_2`,date:`2026-06-14`,reply:`Merci Michel ! Heureux de vous avoir accueilli.`,author:`Michel Dupont`,rating:5,comment:`Un trésor caché à Thiès. Le service Teranga est excellent.`}],created_at:`2026-06-20T03:24:45.203377+00:00`,subscription_pack:`Aucun (Gratuit)`,lat:14.7928,lng:-16.926,location:null,menu_items:[{id:`dish_15`,name:`Lotte rôtie sauce vanille de Casamance`,price:7500,category:null,image_url:`https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Médaillon de lotte poêlé, purée fine de patate douce et émulsion à la vanille.`,is_available:!0,restaurant_id:`r12`},{id:`dish_16`,name:`Filet de Bœuf braisé au Café Touba`,price:8e3,category:null,image_url:`https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Filet tendre de bœuf du pays, sauce corsée infusée au café Touba et poivre de Selim, petits légumes.`,is_available:!0,restaurant_id:`r12`},{id:`dish_17`,name:`Moelleux au Chocolat & Coulis Bissap`,price:2500,category:null,image_url:`https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Dessert gourmand au cœur coulant, parfumé d'un coulis acidulé au bissap rouge.`,is_available:!0,restaurant_id:`r12`}]},{id:`r13`,name:`Nice Time Complexe`,slug:`nice-time-complexe`,rating:4.1,reviews_count:614,category:`Traditionnel`,address:`137 Allée Mawa, M Doucouré, Thiès`,whatsapp:`+221339540442`,open_hours:`12:00 - 23:00`,closed_days:[],is_open_manual:!0,status:`active`,username:`id_nicetimecomplexe`,cover_image:`https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=60`,menu:[{id:`dish_6`,name:`Dibi d'Agneau Traditionnel (Portion)`,image:`https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60`,price:4500,description:`Viande d'agneau coupée en morceaux, marinée et grillée façon dibiterie, servie avec oignons et piment.`},{id:`dish_7`,name:`Dibi de Poulet (Demi Poulet)`,image:`https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=60`,price:3500,description:`Demi-poulet mariné aux épices locales et grillé lentement, accompagné d'oignons émincés.`},{id:`dish_8`,name:`Merguez Braisées de Thiès`,image:`https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=500&auto=format&fit=crop&q=60`,price:2500,description:`Brochettes de merguez maison grillées, servies avec frites croustillantes.`},{id:`dish_4`,name:`Jus de Bissap Glacé`,image:`https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60`,price:500,description:`Infusion de fleurs d'hibiscus séchées parfumée à la menthe.`}],reviews:[{id:`rev_r13_0`,date:`2026-06-10`,reply:`Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.`,author:`Abdoulaye Diallo`,rating:5,comment:`Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement.`},{id:`rev_r13_1`,date:`2026-06-12`,reply:null,author:`Khadija Fall`,rating:4,comment:`Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d'attente à la livraison.`},{id:`rev_r13_2`,date:`2026-06-14`,reply:`Merci Michel ! Heureux de vous avoir accueilli.`,author:`Michel Dupont`,rating:5,comment:`Un trésor caché à Thiès. Le service Teranga est excellent.`}],created_at:`2026-06-20T03:24:45.203377+00:00`,subscription_pack:`Aucun (Gratuit)`,lat:14.7928,lng:-16.926,location:null,menu_items:[{id:`dish_6`,name:`Dibi d'Agneau Traditionnel (Portion)`,price:4500,category:null,image_url:`https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Viande d'agneau coupée en morceaux, marinée et grillée façon dibiterie, servie avec oignons et piment.`,is_available:!0,restaurant_id:`r13`},{id:`dish_7`,name:`Dibi de Poulet (Demi Poulet)`,price:3500,category:null,image_url:`https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Demi-poulet mariné aux épices locales et grillé lentement, accompagné d'oignons émincés.`,is_available:!0,restaurant_id:`r13`},{id:`dish_8`,name:`Merguez Braisées de Thiès`,price:2500,category:null,image_url:`https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Brochettes de merguez maison grillées, servies avec frites croustillantes.`,is_available:!0,restaurant_id:`r13`},{id:`dish_4`,name:`Jus de Bissap Glacé`,price:500,category:null,image_url:`https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Infusion de fleurs d'hibiscus séchées parfumée à la menthe.`,is_available:!0,restaurant_id:`r13`}]},{id:`r16`,name:`La Casablancaise`,slug:`la-casablancaise`,rating:4.7,reviews_count:19,category:`Gastronomique`,address:`Quartier Som, Thiès`,whatsapp:`+221781056721`,open_hours:`12:00 - 23:00`,closed_days:[1],is_open_manual:!0,status:`active`,username:`id_lacasablancaise`,cover_image:`https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=600&auto=format&fit=crop&q=60`,menu:[{id:`dish_15`,name:`Lotte rôtie sauce vanille de Casamance`,image:`https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60`,price:7500,description:`Médaillon de lotte poêlé, purée fine de patate douce et émulsion à la vanille.`},{id:`dish_16`,name:`Filet de Bœuf braisé au Café Touba`,image:`https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60`,price:8e3,description:`Filet tendre de bœuf du pays, sauce corsée infusée au café Touba et poivre de Selim, petits légumes.`},{id:`dish_17`,name:`Moelleux au Chocolat & Coulis Bissap`,image:`https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60`,price:2500,description:`Dessert gourmand au cœur coulant, parfumé d'un coulis acidulé au bissap rouge.`}],reviews:[{id:`rev_r16_0`,date:`2026-06-10`,reply:`Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.`,author:`Abdoulaye Diallo`,rating:5,comment:`Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement.`},{id:`rev_r16_1`,date:`2026-06-12`,reply:null,author:`Khadija Fall`,rating:4,comment:`Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d'attente à la livraison.`},{id:`rev_r16_2`,date:`2026-06-14`,reply:`Merci Michel ! Heureux de vous avoir accueilli.`,author:`Michel Dupont`,rating:5,comment:`Un trésor caché à Thiès. Le service Teranga est excellent.`}],created_at:`2026-06-20T03:24:45.203377+00:00`,subscription_pack:`Aucun (Gratuit)`,lat:14.7928,lng:-16.926,location:null,menu_items:[{id:`dish_15`,name:`Lotte rôtie sauce vanille de Casamance`,price:7500,category:null,image_url:`https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Médaillon de lotte poêlé, purée fine de patate douce et émulsion à la vanille.`,is_available:!0,restaurant_id:`r16`},{id:`dish_16`,name:`Filet de Bœuf braisé au Café Touba`,price:8e3,category:null,image_url:`https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Filet tendre de bœuf du pays, sauce corsée infusée au café Touba et poivre de Selim, petits légumes.`,is_available:!0,restaurant_id:`r16`},{id:`dish_17`,name:`Moelleux au Chocolat & Coulis Bissap`,price:2500,category:null,image_url:`https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Dessert gourmand au cœur coulant, parfumé d'un coulis acidulé au bissap rouge.`,is_available:!0,restaurant_id:`r16`}]},{id:`r17`,name:`La Table des Gourmets`,slug:`la-table-des-gourmets`,rating:5,reviews_count:14,category:`Gastronomique`,address:`Quartier Grand-Thiès`,whatsapp:`+221787846296`,open_hours:`19:00 - 23:30`,closed_days:[1,2],is_open_manual:!0,status:`active`,username:`id_latabledesgourmets`,cover_image:`https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=60`,menu:[{id:`dish_15`,name:`Lotte rôtie sauce vanille de Casamance`,image:`https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60`,price:7500,description:`Médaillon de lotte poêlé, purée fine de patate douce et émulsion à la vanille.`},{id:`dish_16`,name:`Filet de Bœuf braisé au Café Touba`,image:`https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60`,price:8e3,description:`Filet tendre de bœuf du pays, sauce corsée infusée au café Touba et poivre de Selim, petits légumes.`},{id:`dish_17`,name:`Moelleux au Chocolat & Coulis Bissap`,image:`https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60`,price:2500,description:`Dessert gourmand au cœur coulant, parfumé d'un coulis acidulé au bissap rouge.`}],reviews:[{id:`rev_r17_0`,date:`2026-06-10`,reply:`Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.`,author:`Abdoulaye Diallo`,rating:5,comment:`Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement.`},{id:`rev_r17_1`,date:`2026-06-12`,reply:null,author:`Khadija Fall`,rating:4,comment:`Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d'attente à la livraison.`},{id:`rev_r17_2`,date:`2026-06-14`,reply:`Merci Michel ! Heureux de vous avoir accueilli.`,author:`Michel Dupont`,rating:5,comment:`Un trésor caché à Thiès. Le service Teranga est excellent.`}],created_at:`2026-06-20T03:24:45.203377+00:00`,subscription_pack:`Aucun (Gratuit)`,lat:14.7928,lng:-16.926,location:null,menu_items:[{id:`dish_15`,name:`Lotte rôtie sauce vanille de Casamance`,price:7500,category:null,image_url:`https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Médaillon de lotte poêlé, purée fine de patate douce et émulsion à la vanille.`,is_available:!0,restaurant_id:`r17`},{id:`dish_16`,name:`Filet de Bœuf braisé au Café Touba`,price:8e3,category:null,image_url:`https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Filet tendre de bœuf du pays, sauce corsée infusée au café Touba et poivre de Selim, petits légumes.`,is_available:!0,restaurant_id:`r17`},{id:`dish_17`,name:`Moelleux au Chocolat & Coulis Bissap`,price:2500,category:null,image_url:`https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Dessert gourmand au cœur coulant, parfumé d'un coulis acidulé au bissap rouge.`,is_available:!0,restaurant_id:`r17`}]},{id:`r19`,name:`Biba Food`,slug:`biba-food`,rating:5,reviews_count:9,category:`Fast Food`,address:`Quartier Cité Lamy, Thiès`,whatsapp:`+221770000000`,open_hours:`17:00 - 23:00`,closed_days:[],is_open_manual:!0,status:`active`,username:`id_bibafood`,cover_image:`https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=60`,menu:[{id:`dish_9`,name:`Burger Teranga Double Cheese`,image:`https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60`,price:2e3,description:`Pain artisanal, double steak de bœuf haché, double cheddar fondu, sauce maison.`},{id:`dish_10`,name:`Chawarma Poulet Fromage`,image:`https://images.unsplash.com/photo-1626700051175-6518c4793f06?w=500&auto=format&fit=crop&q=60`,price:1500,description:`Pain libanais roulé garni de poulet émincé grillé, frites maison, crème d'ail et fromage.`},{id:`dish_11`,name:`Frites Maison (Portion XXL)`,image:`https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60`,price:800,description:`Pommes de terre fraîches coupées à la main et frites dorées aux herbes aromatiques.`},{id:`dish_5`,name:`Jus de Bouye`,image:`https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60`,price:500,description:`Jus onctueux à base de fruit de baobab.`}],reviews:[{id:`rev_r19_0`,date:`2026-06-10`,reply:`Merci Abdoulaye ! Nous mettons du cœur dans nos assiettes.`,author:`Abdoulaye Diallo`,rating:5,comment:`Incroyable expérience ! Les saveurs sénégalaises revisitées avec brio. Je recommande vivement.`},{id:`rev_r19_1`,date:`2026-06-12`,reply:null,author:`Khadija Fall`,rating:4,comment:`Très bon repas, le thiéboudiène est très savoureux. Un tout petit peu d'attente à la livraison.`},{id:`rev_r19_2`,date:`2026-06-14`,reply:`Merci Michel ! Heureux de vous avoir accueilli.`,author:`Michel Dupont`,rating:5,comment:`Un trésor caché à Thiès. Le service Teranga est excellent.`}],created_at:`2026-06-20T03:24:45.203377+00:00`,subscription_pack:`Aucun (Gratuit)`,lat:14.7928,lng:-16.926,location:null,menu_items:[{id:`dish_9`,name:`Burger Teranga Double Cheese`,price:2e3,category:null,image_url:`https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Pain artisanal, double steak de bœuf haché, double cheddar fondu, sauce maison.`,is_available:!0,restaurant_id:`r19`},{id:`dish_10`,name:`Chawarma Poulet Fromage`,price:1500,category:null,image_url:`https://images.unsplash.com/photo-1626700051175-6518c4793f06?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Pain libanais roulé garni de poulet émincé grillé, frites maison, crème d'ail et fromage.`,is_available:!0,restaurant_id:`r19`},{id:`dish_11`,name:`Frites Maison (Portion XXL)`,price:800,category:null,image_url:`https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Pommes de terre fraîches coupées à la main et frites dorées aux herbes aromatiques.`,is_available:!0,restaurant_id:`r19`},{id:`dish_5`,name:`Jus de Bouye`,price:500,category:null,image_url:`https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60`,created_at:`2026-08-12T10:52:22.719336+00:00`,description:`Jus onctueux à base de fruit de baobab.`,is_available:!0,restaurant_id:`r19`}]}];window.COVER_IMAGES=e,window.RESTAURANT_COVERS=t,window.DISH_IMAGE_OPTIONS=n,window.MENU_TEMPLATES=r,window.SAMPLE_REVIEWS=i,window.SEED_RESTAURANTS=a,window.RESTAURANT_COVERS=t,window.DISH_IMAGE_OPTIONS=n,window.MENU_TEMPLATES=r,window.SAMPLE_REVIEWS=i,window.SEED_RESTAURANTS=a,window.RESTAURANT_COVERS=t,window.DISH_IMAGE_OPTIONS=n,window.MENU_TEMPLATES=r,window.SAMPLE_REVIEWS=i,window.SEED_RESTAURANTS=a,window.RESTAURANT_COVERS=t,window.DISH_IMAGE_OPTIONS=n,window.MENU_TEMPLATES=r,window.SAMPLE_REVIEWS=i,window.SEED_RESTAURANTS=a;var o=null,s=!1;try{let e=sessionStorage.getItem(`resto_session`);e&&(o=JSON.parse(e)),s=sessionStorage.getItem(`admin_session`)===`true`||sessionStorage.getItem(`thies_admin_logged`)===`true`}catch(e){console.warn(`sessionStorage is not accessible or invalid. Session data will be held in memory only.`,e)}var c=`https://eyrayquciqyswshiwtwb.supabase.co`,l=`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5cmF5cXVjaXF5c3dzaGl3dHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5MDQyNjQsImV4cCI6MjA5NzQ4MDI2NH0.8_VJvm9xiwmqX3oLD9L1b9W7r7T-b9OfJ2WIyST3FoM`,u=null;typeof supabase<`u`&&(u=supabase.createClient(c,l));var d=class{constructor(){this.data={restaurants:[],orders:[],reservations:[],groupOrders:[]},this.syncPromise=u?this.syncFromSupabase():Promise.resolve()}save(){}async syncFromSupabase(){if(u)try{console.log(`Syncing with Supabase...`);let{data:e,error:t}=await u.from(`restaurants`).select(`*`);if(!t&&e){if(e.length===0){console.log(`Database is empty. Returning early...`),this.data.restaurants=[];return}try{let t=e.map(e=>{e.menu;try{typeof e.menu==`string`&&JSON.parse(e.menu)}catch{}let t=e.reviews;try{typeof e.reviews==`string`&&(t=JSON.parse(e.reviews))}catch{}return{id:e.id,name:e.name,slug:e.slug,rating:Number(e.rating),reviewsCount:Number(e.reviews_count),category:e.category,address:e.address,whatsapp:e.whatsapp,openHours:e.open_hours,closedDays:Array.isArray(e.closed_days)?e.closed_days:e.closed_days?JSON.parse(e.closed_days):[],isOpenManual:!!e.is_open_manual,lat:e.lat?Number(e.lat):14.7928,lng:e.lng?Number(e.lng):-16.926,coverImage:e.cover_image&&e.cover_image!==`null`&&e.cover_image!==`undefined`?e.cover_image:null,menu:[],reviews:Array.isArray(t)?t:[]}}).map(e=>{let t=this.data.restaurants.find(t=>t.id===e.id);if(t){let n=String(e.name||``).replace(/[^a-zA-Z0-9]/g,``).toLowerCase();return{...e,menu:e.menu&&e.menu.length>0?e.menu:t.menu,coverImage:e.coverImage||t.coverImage,username:t.username||`id_`+n,password:t.password||n+`221`,status:t.status||e.status||`active`,subscriptionPack:t.subscriptionPack||`Aucun (Gratuit)`,createdAt:t.createdAt||`2026-06-25T00:00:00Z`}}let n=String(e.name||``).replace(/[^a-zA-Z0-9]/g,``).toLowerCase(),r=``;return typeof RESTAURANT_COVERS<`u`&&RESTAURANT_COVERS[e.id]?r=RESTAURANT_COVERS[e.id]:typeof COVER_IMAGES<`u`&&COVER_IMAGES[e.category]&&(r=COVER_IMAGES[e.category]),{...e,menu:e.menu||[],username:`id_`+n,password:n+`221`,status:e.status||`active`,subscriptionPack:`Aucun (Gratuit)`,createdAt:e.createdAt||`2026-06-25T00:00:00Z`,coverImage:e.coverImage||r}});this.data.restaurants=t}catch(e){console.error(`Error during Supabase mapping:`,e)}}else console.error(`Error fetching nearby restaurants`,t);if(s!==void 0&&s){let e=sessionStorage.getItem(`admin_password`)||``,{data:t,error:n}=await u.rpc(`get_admin_data`,{p_admin_password:e});if(!n&&t){if(t.restaurants&&t.restaurants.forEach(e=>{let t=this.data.restaurants.find(t=>t.id===e.id);t&&(t.username=e.username,t.password=e.password,t.status=e.status)}),t.orders){let e=t.orders.map(e=>({id:e.id,restaurantId:e.restaurant_id,customerName:e.customer_name,customerPhone:e.customer_phone,mode:e.mode,address:e.address,items:typeof e.items==`string`?JSON.parse(e.items):e.items,total:Number(e.total),note:e.note,status:e.status,date:e.date,time:e.time}));this.data.orders=e.sort((e,t)=>t.id.localeCompare(e.id))}if(t.reservations){let e=t.reservations.map(e=>({id:e.id,restaurantId:e.restaurant_id,customerName:e.customer_name,customerPhone:e.customer_phone,date:e.date,time:e.time,guests:Number(e.guests),note:e.note,status:e.status}));this.data.reservations=e.sort((e,t)=>t.id.localeCompare(e.id))}}}else if(o!==void 0&&o&&o.password){let{data:e,error:t}=await u.rpc(`get_restaurant_orders`,{p_restaurant_id:o.id,p_password:o.password});if(!t&&e){let t=e.map(e=>({id:e.id,restaurantId:e.restaurant_id,customerName:e.customer_name,customerPhone:e.customer_phone,mode:e.mode,address:e.address,items:typeof e.items==`string`?JSON.parse(e.items):e.items,total:Number(e.total),note:e.note,status:e.status,date:e.date,time:e.time}));this.data.orders=t.sort((e,t)=>t.id.localeCompare(e.id))}let{data:n,error:r}=await u.rpc(`get_restaurant_reservations`,{p_restaurant_id:o.id,p_password:o.password});if(!r&&n){let e=n.map(e=>({id:e.id,restaurantId:e.restaurant_id,customerName:e.customer_name,customerPhone:e.customer_phone,date:e.date,time:e.time,guests:Number(e.guests),note:e.note,status:e.status}));this.data.reservations=e.sort((e,t)=>t.id.localeCompare(e.id))}}this.save(),console.log(`Supabase synchronization completed successfully.`),typeof hideLoadingOverlay==`function`&&hideLoadingOverlay(),typeof applyFilters==`function`&&applyFilters()}catch(e){console.error(`Error connecting to Supabase during sync:`,e),this.data.restaurants=this.getEnrichedFallbackData()}}getEnrichedFallbackData(){return typeof SEED_RESTAURANTS>`u`?[]:JSON.parse(JSON.stringify(SEED_RESTAURANTS)).map(e=>{let t=String(e.name||``).replace(/[^a-zA-Z0-9]/g,``).toLowerCase(),n=``;typeof RESTAURANT_COVERS<`u`&&RESTAURANT_COVERS[e.id]?n=RESTAURANT_COVERS[e.id]:typeof COVER_IMAGES<`u`&&COVER_IMAGES[e.category]&&(n=COVER_IMAGES[e.category]);let r=[];return typeof MENU_TEMPLATES<`u`&&MENU_TEMPLATES[e.category]&&(r=JSON.parse(JSON.stringify(MENU_TEMPLATES[e.category]))),{...e,coverImage:e.coverImage||n,menu:e.menu||r,username:`id_`+t,password:t+`221`,status:`active`}})}async seedRemoteDatabase(){if(u)try{let e=typeof SEED_RESTAURANTS<`u`?SEED_RESTAURANTS:[];if(!e||e.length===0){console.log(`No local restaurants to seed from.`);return}let t=e.map(e=>{let t=e.name.replace(/[^a-zA-Z0-9]/g,``).toLowerCase(),n=`id_`+t,r=t+`221`;return{id:e.id,name:e.name,slug:e.slug,rating:e.rating||4,reviews_count:e.reviewsCount||0,category:e.category,address:e.address||``,whatsapp:e.whatsapp||``,open_hours:e.openHours||`08:00 - 22:00`,closed_days:e.closedDays||[],is_open_manual:e.isOpenManual===void 0||e.isOpenManual,status:`active`,username:n,password:r,cover_image:e.coverImage||``,menu:e.menu||[],reviews:e.reviews||[]}}),{error:n}=await u.from(`restaurants`).insert(t);n?console.error(`Error seeding remote database:`,n):(console.log(`Successfully seeded remote database!`),await this.syncFromSupabase())}catch(e){console.error(`Failed to seed remote database:`,e)}}async pushRestaurantToSupabase(e){if(u)try{if(s){let t=sessionStorage.getItem(`admin_password`)||``,{error:n}=await u.rpc(`admin_create_restaurant`,{p_admin_password:t,p_restaurant:{id:e.id,name:e.name,slug:e.slug,rating:e.rating,reviews_count:e.reviewsCount,category:e.category,address:e.address,whatsapp:e.whatsapp,open_hours:e.openHours,closed_days:e.closedDays,is_open_manual:e.isOpenManual,status:e.status,username:e.username,password:e.password,cover_image:e.coverImage,menu:e.menu||[],reviews:e.reviews||[],subscription_pack:e.subscriptionPack||`Aucun (Gratuit)`}});n&&(console.log(`Admin insert failed or restaurant exists, updating via admin RPC...`,n),await u.rpc(`admin_update_restaurant`,{p_admin_password:t,p_restaurant_id:e.id,p_updates:{name:e.name,status:e.status,username:e.username,password:e.password,subscription_pack:e.subscriptionPack||`Aucun (Gratuit)`,address:e.address,whatsapp:e.whatsapp,is_open_manual:e.isOpenManual}}));return}let{error:t}=await u.from(`restaurants`).insert({id:e.id,name:e.name,slug:e.slug,rating:e.rating,reviews_count:e.reviewsCount,category:e.category,address:e.address,whatsapp:e.whatsapp,open_hours:e.openHours,closed_days:e.closedDays,is_open_manual:e.isOpenManual,status:e.status,username:e.username,password:e.password,cover_image:e.coverImage,menu:e.menu,reviews:e.reviews,subscription_pack:e.subscriptionPack||`Aucun (Gratuit)`});t&&t.code===`23505`&&o!==void 0&&o&&o.id===e.id&&await u.rpc(`update_restaurant_data`,{p_restaurant_id:e.id,p_password:o.password,p_updates:{name:e.name,address:e.address,whatsapp:e.whatsapp,open_hours:e.openHours,closed_days:e.closedDays,is_open_manual:e.isOpenManual,cover_image:e.coverImage,menu:e.menu,reviews:e.reviews}})}catch(e){console.error(`Failed to push restaurant to Supabase`,e)}}async deleteRestaurantFromSupabase(e){if(u)try{if(s){let t=sessionStorage.getItem(`admin_password`)||``;await u.rpc(`admin_delete_restaurant`,{p_admin_password:t,p_restaurant_id:e})}else console.warn(`Unauthorized delete attempt on Supabase`)}catch(e){console.error(`Failed to delete restaurant from Supabase`,e)}}async pushOrderToSupabase(e){if(u)try{let{data:t,error:n}=await u.rpc(`place_secure_order`,{p_order_id:e.id,p_restaurant_id:e.restaurantId,p_customer_name:e.customerName,p_customer_phone:e.customerPhone,p_mode:e.mode,p_address:e.address,p_note:e.note,p_items:e.items,p_date:e.date,p_time:e.time,p_delivery_fee:e.deliveryFee||0,p_loyalty_applied:e.loyaltyApplied||!1});n&&console.error(`RPC Error place_secure_order:`,n)}catch(e){console.error(`Failed to push order to Supabase`,e)}}async pushReservationToSupabase(e){if(u)try{await u.from(`reservations`).insert({id:e.id,restaurant_id:e.restaurantId,customer_name:e.customerName,customer_phone:e.customerPhone,date:e.date,time:e.time,guests:e.guests,note:e.note,status:e.status})}catch(e){console.error(`Failed to push reservation to Supabase`,e)}}async pushCustomerToSupabase(e,t,n){if(u)try{await u.rpc(`upsert_customer_loyalty`,{p_phone:e,p_name:t,p_used_rewards:n})}catch(e){console.error(`Failed to push customer to Supabase`,e)}}applyLoyaltyRewardUsed(e,t){this.data.usedRewards||(this.data.usedRewards={}),this.data.usedRewards[e]=(this.data.usedRewards[e]||0)+1,this.save(),this.pushCustomerToSupabase(e,t,this.data.usedRewards[e])}async saveClientInfo(e,t){if(u)try{await u.rpc(`upsert_client`,{p_name:e,p_phone:t})}catch(e){console.error(`Error saving client info:`,e)}}getRestaurants(){let e=new Date,t=!1;return this.data.restaurants.forEach(n=>{let r=new Date(n.createdAt||`2026-06-26T00:00:00Z`),i=Math.abs(e-r),a=Math.ceil(i/864e5),o=n.subscriptionPack||`Aucun (Gratuit)`;a>90&&n.status===`active`&&o===`Aucun (Gratuit)`&&(n.status=`suspended`,t=!0,this.pushRestaurantToSupabase(n))}),t&&this.save(),this.data.restaurants}async fetchMenuForRestaurant(e){if(!u)return[];let t=this.data.restaurants.find(t=>t.id===e);if(t&&t.menu&&t.menu.length>0)return t.menu;try{console.log(`Lazy loading menu for restaurant ${e}...`);let{data:n,error:r}=await u.from(`menu_items`).select(`*`).eq(`restaurant_id`,e);if(r)throw r;let i=[];return n&&n.length>0&&(i=n.map(e=>{let t=e.image_url;if((!t||typeof t==`string`&&t.trim()===``)&&typeof DISH_IMAGE_OPTIONS<`u`&&DISH_IMAGE_OPTIONS.length>0){let n=String(e.id||e.name||``),r=0;for(let e=0;e<n.length;e++)r=n.charCodeAt(e)+((r<<5)-r);t=DISH_IMAGE_OPTIONS[Math.abs(r)%DISH_IMAGE_OPTIONS.length].url}return{id:e.id,name:e.name,description:e.description,price:e.price,category:e.category,image:t,available:e.is_available}})),t&&(t.menu=i,this.save()),i}catch(e){return console.error(`Error fetching menu items:`,e),[]}}async getRestaurantBySlug(e){this.syncPromise||=this.syncFromSupabase(),await this.syncPromise;let t=this.data.restaurants.find(t=>t.slug===e);return t&&await this.fetchMenuForRestaurant(t.id),t}getRestaurantById(e){return this.data.restaurants.find(t=>t.id===e)}updateRestaurant(e,t){let n=this.data.restaurants.findIndex(t=>t.id===e);return n===-1?null:(this.data.restaurants[n]={...this.data.restaurants[n],...t},this.save(),this.pushRestaurantToSupabase(this.data.restaurants[n]),this.data.restaurants[n])}addRestaurant(e){this.data.restaurants.push(e),this.save(),this.pushRestaurantToSupabase(e)}deleteRestaurant(e){this.data.restaurants=this.data.restaurants.filter(t=>t.id!==e),this.save(),this.deleteRestaurantFromSupabase(e)}getOrdersByRestaurant(e){return this.data.orders.filter(t=>t.restaurantId===e)}addOrder(e){if(window.clientTracker){let t=window.clientTracker.getBehaviorReport();e.note=e.note?e.note+` | [Analytics: `+t+`]`:`[Analytics: `+t+`]`}this.data.orders.unshift(e),this.save(),this.pushOrderToSupabase(e);let t=this.data.usedRewards&&this.data.usedRewards[e.customerPhone]||0;this.pushCustomerToSupabase(e.customerPhone,e.customerName,t)}async updateOrderStatus(e,t){let n=this.data.orders.find(t=>t.id===e);if(n){if(n.status=t,this.save(),u&&s){let n=sessionStorage.getItem(`admin_password`)||``;await u.rpc(`admin_update_order_status`,{p_admin_password:n,p_order_id:e,p_status:t})}else u&&o!==void 0&&o?await u.rpc(`update_order_status`,{p_order_id:e,p_restaurant_id:o.id,p_password:o.password,p_status:t}):this.pushOrderToSupabase(n)}}getReservationsByRestaurant(e){return this.data.reservations.filter(t=>t.restaurantId===e)}addReservation(e){this.data.reservations.unshift(e),this.save(),this.pushReservationToSupabase(e)}async updateReservationStatus(e,t){let n=this.data.reservations.find(t=>t.id===e);if(n){if(n.status=t,this.save(),u&&s){let n=sessionStorage.getItem(`admin_password`)||``;await u.rpc(`admin_update_reservation_status`,{p_admin_password:n,p_reservation_id:e,p_status:t})}else u&&o!==void 0&&o?await u.rpc(`update_reservation_status`,{p_res_id:e,p_restaurant_id:o.id,p_password:o.password,p_status:t}):this.pushReservationToSupabase(n)}}async adminDeleteOrder(e){if(!u||!s)return!1;try{let t=sessionStorage.getItem(`admin_password`)||``,{error:n}=await u.rpc(`admin_delete_order`,{p_admin_password:t,p_order_id:e});if(n)throw n;return this.data.orders=this.data.orders.filter(t=>t.id!==e),!0}catch(e){return console.error(`Erreur suppression commande admin:`,e),!1}}async createSecureOrder(e){if(!u)return console.error(`Supabase client not initialized.`),null;try{let{data:t,error:n}=await u.rpc(`create_secure_order`,{payload:e});if(n)throw n;return t}catch(e){throw console.error(`Error creating secure order:`,e),e}}async uploadImage(e){if(!u)return null;try{let t=e.name.split(`.`).pop(),n=`${Math.random().toString(36).substring(2,15)}_${Date.now()}.${t}`,{data:r,error:i}=await u.storage.from(`images`).upload(n,e);if(i)throw console.error(`Storage error details:`,i),i;let{data:a}=u.storage.from(`images`).getPublicUrl(n);return a.publicUrl}catch(e){return console.error(`Error uploading image:`,e),alert(`Erreur lors de l'upload de l'image. Avez-vous créé le bucket 'images' en mode public sur Supabase ?`),null}}async vendorLogin(e,t){if(!u)throw Error(`Supabase non initialisé`);try{let{data:n,error:r}=await u.rpc(`verify_vendor_pin`,{p_slug:e,p_pin:t});if(r)throw r.message&&r.message.includes(`Trop de tentatives`)?{rateLimited:!0,message:r.message}:r;return n}catch(e){if(e.rateLimited)throw e;return console.error(`Erreur de connexion restaurateur:`,e),null}}async vendorUpdateMenuItem(e,t,n,r,i){if(!u)throw Error(`Supabase non initialisé`);try{let{error:a}=await u.rpc(`update_vendor_menu_item`,{p_restaurant_id:e,p_pin:t,p_item_id:n,p_price:r,p_is_available:i});if(a)throw a;let o=this.data.restaurants.find(t=>t.id===e);if(o&&o.menu){let e=o.menu.find(e=>e.id===n);e&&(e.price=r,e.available=i,this.save())}return!0}catch(e){return console.error(`Erreur de mise à jour du plat:`,e),!1}}async vendorUpdateStatus(e,t,n){if(!u)throw Error(`Supabase non initialisé`);try{let{error:r}=await u.rpc(`update_vendor_status`,{p_restaurant_id:e,p_pin:t,p_is_open:n});if(r)throw r;let i=this.data.restaurants.find(t=>t.id===e);return i&&(i.isOpenManual=n,this.save()),!0}catch(e){return console.error(`Erreur de mise à jour du statut:`,e),!1}}async generateOtp(e){if(!u)return!1;try{let{data:t,error:n}=await u.rpc(`generate_otp`,{p_phone:e});if(n)throw n;return t}catch(e){return console.error(`Erreur lors de la génération de l'OTP:`,e),!1}}async verifyOtp(e,t){if(!u)return!1;try{let{data:n,error:r}=await u.rpc(`verify_otp`,{p_phone:e,p_code:t});if(r)throw r;return n}catch(e){return console.error(`Erreur lors de la vérification de l'OTP:`,e),!1}}},f=new d;window.currentRestaurantSession=o,window.isSuperAdminSession=s,window.supabaseClient=u,window.Store=d,window.store=f,window.currentRestaurantSession=o,window.isSuperAdminSession=s,window.SUPABASE_URL=c,window.SUPABASE_ANON_KEY=l,window.supabaseClient=u,window.store=f,window.Store=d,window.currentRestaurantSession=o,window.isSuperAdminSession=s,window.SUPABASE_URL=c,window.SUPABASE_ANON_KEY=l,window.supabaseClient=u,window.store=f,window.Store=d,window.currentRestaurantSession=o,window.isSuperAdminSession=s,window.SUPABASE_URL=c,window.SUPABASE_ANON_KEY=l,window.supabaseClient=u,window.store=f,window.Store=d;var p=class{constructor(){this.routes={},this.isReady=!1,window.addEventListener(`hashchange`,()=>this.resolve())}start(){this.isReady=!0,this.resolve()}add(e,t){this.routes[e]=t}navigate(e){window.location.hash=e}resolve(){if(!this.isReady)return;let e=window.location.hash||`#/`,t=document.getElementById(`main-content`);t&&(t.classList.remove(`page-transition`),t.offsetWidth,t.classList.add(`page-transition`));let n=!1,r=e.match(/^#\/r\/([^/]+)\/group\/([^/]+)$/);if(r){let e=r[1],t=r[2];this.routes[`#/r/:slug`]&&(this.routes[`#/r/:slug`](e,`group`,t),n=!0)}if(!n){let t=e.match(/^#\/r\/([^/]+)$/);if(t){let e=t[1];this.routes[`#/r/:slug`]&&(this.routes[`#/r/:slug`](e,`menu`),n=!0)}}if(!n){let t=this.routes[e]||this.routes[`#/404`];t?t():this.navigate(`/`)}updateNavbar()}},m=new p;window.Router=p,window.router=m,window.router=m,window.Router=p,window.router=m,window.Router=p,window.router=m,window.Router=p;var h=`summary`,g=`Tous`,_=`all`;router.add(`#/dashboard`,()=>{if(document.getElementById(`floating-cart-bar`).style.display=`none`,!currentRestaurantSession){showToast(`Veuillez vous connecter pour accéder au tableau de bord.`,`danger`),router.navigate(`/auth`);return}startOrderPolling(currentRestaurantSession.id),hideLoadingOverlay(),v()});function v(){let e=document.getElementById(`main-content`),t=store.getRestaurantById(currentRestaurantSession.id),n=``;isSuperAdminSession&&(n=`
            <div style="background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%); color: var(--primary); padding: 0.75rem 1.5rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; font-weight: 700; border-radius: 12px; margin: 1rem 1.5rem 0 1.5rem; box-shadow: var(--shadow); border: 1px solid rgba(255,255,255,0.1);">
                <span>👑 Mode Super-Admin : Vous gérez actuellement le profil de "<strong>${t.name}</strong>"</span>
                <button class="btn btn-secondary btn-sm" onclick="exitImpersonation()" style="background: rgba(255,255,255,0.25); border-color: transparent; color: var(--primary); font-weight: 700;">
                    Retourner à la Console 🔐
                </button>
            </div>
        `);let r=new Date(t.createdAt||`2026-06-25T00:00:00Z`),i=Math.abs(new Date-r),a=Math.ceil(i/864e5),o=t.subscriptionPack||`Aucun (Gratuit)`,s=a>90&&o===`Aucun (Gratuit)`&&!isSuperAdminSession;Math.max(0,90-a);let c=s?` 🔒`:``,l=``;s&&(l=`
            <div style="background: linear-gradient(135deg, #dc3545 0%, #ff4b4b 100%); color: white; padding: 1rem 1.5rem; border-radius: 12px; margin: 1rem 1.5rem 0 1.5rem; display: flex; align-items: center; gap: 1rem; box-shadow: 0 4px 15px rgba(220,53,69,0.3); animation: pulseMainCircle 2s infinite;">
                <span style="font-size: 2rem;">⚠️</span>
                <div>
                    <strong style="font-size: 1.1rem;">Votre page est indisponible sur la plateforme</strong>
                    <p style="margin: 0.25rem 0 0; opacity: 0.9; font-size: 0.9rem;">Votre période d'essai gratuit de 3 mois est terminée. Souscrivez à un abonnement pour réactiver votre restaurant.</p>
                </div>
                <button class="btn btn-sm" onclick="switchDashboardTab('subscription')" style="background: white; color: #dc3545; font-weight: 700; white-space: nowrap;">💳 Voir les offres</button>
            </div>
        `),e.innerHTML=`
        ${n}
        ${l}
        <div class="dashboard-grid">
            <aside class="sidebar">
                <button class="sidebar-btn ${h===`summary`?`active`:``}" onclick="switchDashboardTab('summary')">📈 Résumé du Jour</button>
                <button class="sidebar-btn ${h===`orders`?`active`:``}" onclick="switchDashboardTab('orders')">📦 Commandes${c}</button>
                <button class="sidebar-btn ${h===`reservations`?`active`:``}" onclick="switchDashboardTab('reservations')">📅 Réservations${c}</button>
                <button class="sidebar-btn ${h===`menu`?`active`:``}" onclick="switchDashboardTab('menu')">🍽️ Plats du Jour${c}</button>
                <button class="sidebar-btn ${h===`reviews`?`active`:``}" onclick="switchDashboardTab('reviews')">💬 Avis Clients</button>
                <button class="sidebar-btn ${h===`accounting`?`active`:``}" onclick="switchDashboardTab('accounting')">📊 Comptabilité${c}</button>
                <button class="sidebar-btn ${h===`settings`?`active`:``}" onclick="switchDashboardTab('settings')">⚙️ Paramètres</button>
                <button class="sidebar-btn ${h===`subscription`?`active`:``}" onclick="switchDashboardTab('subscription')">💳 Abonnement</button>
            </aside>
            <main class="dashboard-content" id="dashboard-tab-panel">
                <!-- Sub tab contents injected here -->
            </main>
        </div>
    `,b(t)}function y(e){h=e;let t=store.getRestaurantById(currentRestaurantSession.id),n=document.querySelectorAll(`.sidebar-btn`);n.forEach(e=>e.classList.remove(`active`));let r=e===`summary`?`résumé`:e===`orders`?`commandes`:e===`reservations`?`réservations`:e===`menu`?`plats`:e===`reviews`?`avis`:e===`accounting`?`comptabilité`:e===`subscription`?`abonnement`:`paramètres`;n.forEach(e=>{e.innerText.toLowerCase().includes(r)&&e.classList.add(`active`)}),b(t)}function b(e){let t=document.getElementById(`dashboard-tab-panel`),n=new Date(e.createdAt||`2026-06-25T00:00:00Z`),r=Math.abs(new Date-n),i=Math.ceil(r/864e5),a=e.subscriptionPack||`Aucun (Gratuit)`;if(i>90&&a===`Aucun (Gratuit)`&&!isSuperAdminSession&&[`orders`,`reservations`,`menu`,`accounting`].includes(h)){t.innerHTML=`
            <div style="text-align: center; padding: 4rem 2rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px;">
                <div style="font-size: 4rem; margin-bottom: 1.5rem;">🔒</div>
                <h2 style="color: var(--text-primary); font-size: 1.8rem; margin-bottom: 1rem;">Disponible en mode Pro</h2>
                <p style="color: var(--text-secondary); font-size: 1rem; max-width: 500px; margin: 0 auto 1.5rem auto; line-height: 1.6;">Votre période d'essai gratuit de 3 mois est terminée. Cette fonctionnalité est réservée aux restaurants ayant un abonnement actif.</p>
                <div style="background: rgba(220, 53, 69, 0.1); border: 1px solid rgba(220, 53, 69, 0.3); padding: 1rem; border-radius: 12px; margin-bottom: 2rem; max-width: 500px; margin-left: auto; margin-right: auto;">
                    <p style="color: #ff6b6b; font-weight: 600; margin: 0;">⚠️ Votre page restaurant est actuellement indisponible sur la plateforme pour les clients.</p>
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 350px; margin: 0 auto;">
                    <button class="btn btn-primary" onclick="switchDashboardTab('subscription')" style="font-weight: 700;">💳 Voir les offres d'abonnement</button>
                    <a href="https://wa.me/221781056721?text=${encodeURIComponent(`Bonjour Thiès à Table 👋\n\nMa période d'essai gratuit est terminée et je souhaite réactiver mon restaurant.\n\n🏪 Restaurant : ${e.name}\n🆔 Identifiant : ${e.slug}\n\nMerci de m'indiquer la marche à suivre !`)}" target="_blank" class="btn btn-success" style="font-weight: 700; background: #25D366; border-color: #25D366; display: flex; align-items: center; justify-content: center; gap: 0.5rem; text-decoration: none;">💬 Contacter le support WhatsApp</a>
                </div>
            </div>
        `;return}if(h===`summary`){let n=store.getOrdersByRestaurant(e.id),r=new Date().toISOString().split(`T`)[0],i=n.filter(e=>e.date===r),a=n.filter(e=>e.status===`Reçue`),o=i.filter(e=>e.status===`Livrée`).reduce((e,t)=>e+t.total,0),s=store.getReservationsByRestaurant(e.id).filter(e=>e.status===`En attente`||e.status===`Confirmée`).length;t.innerHTML=`
            <div style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
                <h2 style="font-family: var(--font-serif); font-size: 1.5rem; color: var(--text-primary);">Résumé du Jour</h2>
                <button class="btn btn-primary btn-sm" onclick="requestPushNotifications()">🔔 Activer Notifications</button>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                <div class="stat-card" style="border-top: 4px solid var(--accent); background: var(--bg-card); padding: 1.25rem; border-radius: 16px; box-shadow: var(--shadow);">
                    <span style="color: var(--text-secondary); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 0.5rem;">⏳ Commandes en attente</span>
                    <span style="font-size: 2rem; font-weight: 800; color: var(--accent);">${a.length}</span>
                    ${a.length>0?`<button class="btn btn-primary btn-sm" style="margin-top: 1rem; width: 100%;" onclick="switchDashboardTab('orders')">Voir les commandes</button>`:``}
                </div>
                <div class="stat-card" style="border-top: 4px solid var(--success); background: var(--bg-card); padding: 1.25rem; border-radius: 16px; box-shadow: var(--shadow);">
                    <span style="color: var(--text-secondary); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 0.5rem;">💰 C.A. d'Aujourd'hui</span>
                    <span style="font-size: 2rem; font-weight: 800; color: var(--success);">${o.toLocaleString()} FCFA</span>
                    <div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--text-secondary);">${i.length} commandes aujourd'hui</div>
                </div>
                <div class="stat-card" style="border-top: 4px solid var(--primary); background: var(--bg-card); padding: 1.25rem; border-radius: 16px; box-shadow: var(--shadow);">
                    <span style="color: var(--text-secondary); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 0.5rem;">📅 Réservations Actives</span>
                    <span style="font-size: 2rem; font-weight: 800; color: var(--primary);">${s}</span>
                    <button class="btn btn-secondary btn-sm" style="margin-top: 1rem; width: 100%;" onclick="switchDashboardTab('reservations')">Voir l'agenda</button>
                </div>
            </div>
            
            <h3 style="font-family: var(--font-serif); font-size: 1.2rem; color: var(--text-primary); margin-bottom: 1rem;">Action Rapide : Statut du Restaurant</h3>
            <div style="background: var(--bg-card); padding: 1.5rem; border-radius: 16px; border: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between;">
                <div>
                    <strong style="display: block; font-size: 1.1rem; margin-bottom: 0.25rem;">${e.isOpenManual?`🟢 Ouvert aux commandes`:`🔴 Actuellement fermé (Manuel)`}</strong>
                    <span style="font-size: 0.9rem; color: var(--text-secondary);">Gérez l'ouverture exceptionnelle (ex: rupture de stock totale, fermeture inattendue)</span>
                </div>
                <button class="btn ${e.isOpenManual?`btn-danger`:`btn-success`}" onclick="toggleRestaurantManualStatus('${e.id}')">
                    ${e.isOpenManual?`Forcer la Fermeture 🔴`:`Ré-ouvrir 🟢`}
                </button>
            </div>
        `}else if(h===`orders`){let n=store.getOrdersByRestaurant(e.id),r=new Date().toISOString().split(`T`)[0],i=n.filter(e=>e.date===r),a=i.filter(e=>e.status===`Livrée`).reduce((e,t)=>e+t.total,0),o=n.filter(e=>e.status===`Reçue`).length,s=[...n];g===`En attente`?s=n.filter(e=>e.status===`Reçue`):g===`Confirmées`?s=n.filter(e=>e.status===`Confirmée`||e.status===`Prête`):g===`Livrées`&&(s=n.filter(e=>e.status===`Livrée`));let c=``;s.length===0?c=`
                <div style="text-align: center; color: var(--text-secondary); padding: 4rem 0; background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px;">
                    <span style="font-size: 3rem; display: block; margin-bottom: 1rem;">📦</span>
                    Aucune commande ne correspond au filtre <strong>"${g}"</strong>.
                </div>
            `:s.forEach(t=>{let n=t.items.map(e=>`<span style="background: var(--bg-secondary); padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.8rem; font-weight: 600; border: 1px solid var(--border); display: inline-block; margin: 0.15rem 0.15rem 0.15rem 0;">${e.name} <strong>x${e.qty}</strong></span>`).join(` `),r=``,i=``;if(t.status===`Reçue`)r=`<span class="badge badge-warning" style="animation: pulseMainCircle 2s infinite;">Reçue</span>`,i=`
                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            <button class="btn btn-primary" onclick="changeOrderStatus('${t.id}', 'Confirmée')" style="font-weight: 700; flex: 1;">
                                ✅ Accepter & notifier 💬
                            </button>
                            <button class="btn btn-danger" onclick="changeOrderStatus('${t.id}', 'Annulée')" style="font-weight: 700; flex: 1;">
                                ❌ Refuser la commande
                            </button>
                        </div>
                    `;else if(t.status===`Confirmée`)r=`<span class="badge badge-info">En Préparation</span>`,i=`
                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            <button class="btn btn-success" onclick="changeOrderStatus('${t.id}', 'Prête')" style="font-weight: 700; flex: 1; background: #007bff; border-color: #007bff;">
                                🛵 Prête & notifier client 💬
                            </button>
                            <button class="btn btn-danger" onclick="changeOrderStatus('${t.id}', 'Annulée')" style="font-weight: 700;">
                                ❌ Annuler
                            </button>
                        </div>
                    `;else if(t.status===`Prête`)r=`<span class="badge badge-success">Prête</span>`,i=`
                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            <button class="btn btn-success" onclick="changeOrderStatus('${t.id}', 'Livrée')" style="font-weight: 700; flex: 1; background: var(--success); border-color: var(--success);">
                                📦 Livrée / Récupérée 💬
                            </button>
                            <button class="btn btn-danger" onclick="changeOrderStatus('${t.id}', 'Annulée')" style="font-weight: 700;">
                                ❌ Annuler
                            </button>
                        </div>
                    `;else if(t.status===`Annulée`)r=`<span class="badge badge-danger">Annulée</span>`,i=`<span style="font-size: 0.85rem; color: var(--danger); font-weight: 600; display: block; text-align: center; padding: 0.5rem; background: rgba(var(--danger-rgb,220,53,69), 0.1); border-radius: 8px;">❌ Commande refusée / annulée</span>`;else{r=`<span class="badge badge-success" style="opacity: 0.6">Livrée / Récupérée</span>`;let n=`Bonjour ${t.customerName}, avez-vous aimé votre commande chez ${e.name} ? Laissez-nous un avis sur Thiès Resto ! https://thies-resto.com/#/r/${e.slug}`;i=`
                        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                            <span style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 600; display: block; text-align: center; padding: 0.5rem; background: var(--bg-secondary); border-radius: 8px;">✅ Commande traitée et archivée</span>
                            <a href="${`https://wa.me/${t.customerPhone.replace(/\+/g,``)}?text=${encodeURIComponent(n)}`}" target="_blank" class="btn btn-primary" style="font-weight: 700; background: #25D366; border-color: #25D366; display: flex; justify-content: center; align-items: center; gap: 0.5rem;">⭐ Relance Avis (WhatsApp)</a>
                        </div>
                    `}c+=`
                    <div class="dashboard-list-item" style="border-left: 4px solid ${t.status===`Reçue`?`var(--accent)`:t.status===`Livrée`?`var(--success)`:`var(--primary)`}; background: var(--bg-card); border-radius: 16px; padding: 1.5rem; margin-bottom: 1.25rem; box-shadow: var(--shadow);">
                        <div class="list-item-header" style="border-bottom: 1px solid var(--border); padding-bottom: 0.75rem; margin-bottom: 0.75rem;">
                            <div>
                                <span class="list-item-title" style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary);">N° ${t.id}</span>
                                <span style="margin-left: 0.75rem;">${r}</span>
                            </div>
                            <span class="list-item-time" style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600;">🕒 Le ${t.date} à ${t.time}</span>
                        </div>
                        <div class="list-item-details" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
                            <div>
                                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong style="color:var(--text-secondary)">👤 Client :</strong> <span style="font-weight: 700;">${t.customerName}</span></p>
                                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong style="color:var(--text-secondary)">📞 WhatsApp :</strong> <a href="https://wa.me/${t.customerPhone.replace(/\+/g,``)}" target="_blank" class="call-btn" style="margin-left:0.25rem;">💬 Ouvrir WhatsApp (${t.customerPhone})</a></p>
                                ${t.address?`<p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong style="color:var(--text-secondary)">📍 Adresse :</strong> ${t.address}</p>`:``}
                            </div>
                            <div>
                                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong style="color:var(--text-secondary)">🛵 Récupération :</strong> <span class="badge ${t.mode===`Livraison`?`badge-primary`:`badge-info`}" style="font-weight:700;">${t.mode}</span></p>
                                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong style="color:var(--text-secondary)">💰 Total à payer :</strong> <span style="font-size: 1.1rem; color: var(--primary); font-weight: 800;">${t.total} FCFA</span></p>
                                ${t.note?`<p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong style="color:var(--text-secondary)">📝 Note :</strong> <span style="font-style: italic; color:var(--text-secondary);">"${t.note}"</span></p>`:``}
                            </div>
                        </div>
                        <div style="background: var(--bg-secondary); padding: 0.75rem 1rem; border-radius: 12px; margin-bottom: 1.25rem; border: 1px solid var(--border);">
                            <strong style="display: block; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 0.35rem;">🍳 Plats commandés :</strong>
                            <div style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
                                ${n}
                            </div>
                        </div>
                        <div class="list-item-actions" style="margin-top: 1rem;">
                            ${i}
                        </div>
                    </div>
                `}),t.innerHTML=`
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
                <h2 style="font-size: 1.25rem; margin: 0;">Gestion des Commandes</h2>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
                    ${[`Tous`,`En attente`,`Confirmées`,`Livrées`].map(e=>`
                <button class="btn ${g===e?`btn-primary`:`btn-secondary`}" style="padding: 0.4rem 1rem; font-size: 0.85rem; font-weight: 700; border-radius: 20px;" onclick="filterOrdersDashboard('${e}')">
                    ${e===`En attente`?`⏳ `:e===`Confirmées`?`🍳 `:e===`Livrées`?`✅ `:`📦 `}${e}
                </button>
            `).join(` `)}
                    <button class="btn btn-secondary" onclick="exportOrdersToCSV()" style="padding: 0.4rem 0.8rem; font-size: 0.85rem; font-weight: 700; border-radius: 20px; margin-left: 0.5rem;">
                        📥 Exporter CSV
                    </button>
                </div>
            </div>
            
            <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
                <div class="stat-card" style="border-top: 4px solid var(--primary); background: var(--bg-card); padding: 1.25rem; border-radius: 16px; box-shadow: var(--shadow);">
                    <span class="stat-card-title" style="color: var(--text-secondary); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 0.5rem;">📅 Commandes du jour</span>
                    <span class="stat-card-value" style="font-size: 1.75rem; font-weight: 800; color: var(--text-primary);">${i.length}</span>
                </div>
                <div class="stat-card" style="border-top: 4px solid var(--success); background: var(--bg-card); padding: 1.25rem; border-radius: 16px; box-shadow: var(--shadow);">
                    <span class="stat-card-title" style="color: var(--text-secondary); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 0.5rem;">💰 Chiffre d'affaires (Jour)</span>
                    <span class="stat-card-value" style="font-size: 1.75rem; font-weight: 800; color: var(--success);">${a} FCFA</span>
                </div>
                <div class="stat-card" style="border-top: 4px solid var(--accent); background: var(--bg-card); padding: 1.25rem; border-radius: 16px; box-shadow: var(--shadow);">
                    <span class="stat-card-title" style="color: var(--text-secondary); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 0.5rem;">⏳ Commandes en attente</span>
                    <span class="stat-card-value" style="font-size: 1.75rem; font-weight: 800; color: var(--accent);">${o}</span>
                </div>
            </div>

            <div class="dashboard-list">
                ${c}
            </div>
        `}else if(h===`reservations`){let n=store.getReservationsByRestaurant(e.id),r=``;n.length===0?r=`<div style="text-align: center; color: var(--text-secondary); padding: 3rem 0;">Aucune réservation pour le moment.</div>`:n.forEach(e=>{let t=``,n=``;e.status===`En attente`?(t=`<span class="badge badge-warning">En Attente</span>`,n=`
                        <button class="btn btn-success btn-sm" onclick="changeReservationStatus('${e.id}', 'Confirmée')">
                            Confirmer & Envoyer WA 💬
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="changeReservationStatus('${e.id}', 'Annulée')">
                            Annuler & WhatsApp 💬
                        </button>
                    `):e.status===`Confirmée`?(t=`<span class="badge badge-success">Confirmée</span>`,n=`<span style="font-size: 0.8rem; color: var(--success)">Validée</span>`):(t=`<span class="badge badge-danger">Annulée</span>`,n=`<span style="font-size: 0.8rem; color: var(--danger)">Annulée</span>`);let i=new Date(e.date).toLocaleDateString(`fr-FR`,{weekday:`short`,day:`numeric`,month:`short`});r+=`
                    <div class="dashboard-list-item">
                        <div class="list-item-header">
                            <div>
                                <span class="list-item-title">${e.id} - <strong>${e.customerName}</strong></span>
                                <span style="margin-left: 0.5rem;">${t}</span>
                            </div>
                            <span class="list-item-time">📅 Prévu le ${i} à ${e.time}</span>
                        </div>
                        <div class="list-item-details">
                            👥 Personnes : <strong>${e.guests} couverts</strong> <br>
                            📞 Téléphone : <a href="https://wa.me/${e.customerPhone.replace(/\+/g,``)}" target="_blank" class="call-btn">💬 WhatsApp (${e.customerPhone})</a>
                            ${e.note?`<br>📝 Note client : <em>"${e.note}"</em>`:``}
                        </div>
                        <div class="list-item-actions">
                            ${n}
                        </div>
                    </div>
                `}),t.innerHTML=`
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
                <h2 style="font-size: 1.25rem; margin: 0;">Réservations de Tables</h2>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-secondary btn-sm" onclick="exportReservationsToCSV()">
                        📥 Exporter CSV
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="toggleManualReservationForm()">
                        ➕ Prendre une réservation (Appel)
                    </button>
                </div>
            </div>
            
            <!-- Manual Reservation Form -->
            <div id="manual-reservation-card" style="display: none; background: var(--bg-card); border: 1px solid var(--border); padding: 1.5rem; border-radius: 20px; margin-bottom: 2rem;">
                <h3 style="font-size: 1rem; margin-bottom: 1.25rem;">📝 Enregistrer une réservation par téléphone</h3>
                <form onsubmit="saveManualReservation(event, '${e.id}')">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Nom du client <span class="required">*</span></label>
                            <input type="text" id="mres-name" class="form-control" placeholder="Modou Diagne" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Téléphone <span class="required">*</span></label>
                            <input type="tel" id="mres-phone" class="form-control" placeholder="+221 77 123 45 67" required>
                        </div>
                    </div>
                    
                    <div class="form-row" style="margin-top: 1rem;">
                        <div class="form-group">
                            <label class="form-label">Date <span class="required">*</span></label>
                            <input type="date" id="mres-date" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Heure <span class="required">*</span></label>
                            <input type="time" id="mres-time" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Nombre de couverts <span class="required">*</span></label>
                            <input type="number" id="mres-guests" class="form-control" placeholder="4" min="1" required>
                        </div>
                    </div>
                    
                    <div class="form-group" style="margin-top: 1rem;">
                        <label class="form-label">Note / Commentaires (ex: table extérieure, anniversaire...)</label>
                        <textarea id="mres-note" class="form-control" placeholder="Demande particulière du client..."></textarea>
                    </div>
                    
                    <div style="display: flex; gap: 0.5rem; margin-top: 1.5rem;">
                        <button type="submit" class="btn btn-primary">Enregistrer la réservation</button>
                        <button type="button" class="btn btn-secondary" onclick="toggleManualReservationForm()">Annuler</button>
                    </div>
                </form>
            </div>

            <div class="dashboard-list">
                ${r}
            </div>
        `}else if(h===`menu`){let n=``;e.menu.length===0?n=`<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 2rem 0;">Aucun plat n'a encore été ajouté. Créez-en un ci-dessous !</div>`:e.menu.forEach(e=>{n+=`
                    <div class="dish-card" style="flex-direction: row; height: auto; align-items: center; padding: 0.75rem; gap: 1rem;">
                        <img src="${e.image}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'">
                        <div style="flex-grow: 1;">
                            <h4 style="font-size: 0.95rem;">${e.name}</h4>
                            <div style="color: var(--primary); font-weight: 700; font-size: 0.85rem;">${e.price} FCFA</div>
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn ${e.available===!1?`btn-danger`:`btn-success`} btn-sm" style="padding: 0.35rem 0.5rem;" onclick="toggleDishAvailability('${e.id}', ${e.available!==!1})">
                                ${e.available===!1?`❌ Rupture`:`✅ Dispo`}
                            </button>
                            <button class="btn btn-secondary btn-sm" style="padding: 0.35rem 0.5rem;" onclick="openEditDishForm('${e.id}')">✏️</button>
                            <button class="btn btn-danger btn-sm" style="padding: 0.35rem 0.5rem;" onclick="deleteDish('${e.id}')">🗑️</button>
                        </div>
                    </div>
                `}),t.innerHTML=`
            <h2 style="font-size: 1.25rem; margin-bottom: 1rem;">Menu du Jour</h2>
            
            <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem;">
                <!-- Current Dishes List -->
                <div style="background: var(--bg-card); border: 1px solid var(--border); padding: 1.25rem; border-radius: 20px;">
                    <h3 style="font-size: 1rem; margin-bottom: 1rem;">Plats actifs</h3>
                    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                        ${n}
                    </div>
                </div>

                <!-- Add/Edit Dish Form -->
                <div style="background: var(--bg-card); border: 1px solid var(--border); padding: 1.25rem; border-radius: 20px;" id="dish-form-card">
                    <h3 style="font-size: 1rem; margin-bottom: 1rem;" id="dish-form-title">Ajouter un nouveau plat</h3>
                    <form id="dish-editor-form" onsubmit="saveDish(event)">
                        <input type="hidden" id="dish-edit-id" value="">
                        
                        <div class="form-group">
                            <label class="form-label">Nom du plat <span class="required">*</span></label>
                            <input type="text" id="dish-name" class="form-control" placeholder="Yassa Poulet..." required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Description <span class="required">*</span></label>
                            <textarea id="dish-desc" class="form-control" placeholder="Ingrédients, accompagnements..." required></textarea>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Prix (FCFA) <span class="required">*</span></label>
                                <input type="number" id="dish-price" class="form-control" placeholder="2500" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Photo du plat <span class="required">*</span></label>
                                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                    <input type="file" id="dish-image-file" class="form-control" accept="image/*" onchange="handleDishImageUpload(event)" style="padding: 0.35rem; height: auto;">
                                    <span id="dish-image-status" style="font-size: 0.75rem; color: var(--success); display: none;">Upload en cours...</span>
                                    <input type="hidden" id="dish-image-custom" value="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500">
                                    <div style="text-align: center; margin: 0.25rem 0; font-size: 0.8rem; color: var(--text-secondary);">OU choisir une image par défaut</div>
                                    <select id="dish-image-select" class="form-control" onchange="document.getElementById('dish-image-custom').value = this.value">
                                        <option value="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500">Poisson Rouge / Thieb</option>
                                        <option value="https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500">Poulet / Yassa</option>
                                        <option value="https://images.unsplash.com/photo-1544025162-d76694265947?w=500">Grillades / Viandes / Dibi</option>
                                        <option value="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500">Burger / Sandwich</option>
                                        <option value="https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500">Frites dorées</option>
                                        <option value="https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500">Boisson / Jus maison</option>
                                    </select>
                                </div>
                            </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Ou coller l'URL d'une image (Google, etc.)</label>
                            <input type="text" id="dish-image-custom" class="form-control" placeholder="https://images.unsplash.com/... (optionnel)">
                        </div>
                        
                        <div class="form-group" style="margin-top: 1rem;">
                            <label class="form-label">📸 Télécharger depuis votre téléphone / appareil</label>
                            <input type="file" id="dish-image-file" class="form-control" accept="image/*" onchange="handleDishImageUpload(event)" style="padding: 0.35rem; height: auto;">
                            <div id="dish-image-preview-container" style="display: none; margin-top: 0.75rem; align-items: center; gap: 0.75rem; background: var(--bg-secondary); padding: 0.5rem; border-radius: 10px; border: 1px solid var(--border);">
                                <img id="dish-image-preview" src="" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
                                <span id="dish-image-upload-status" style="font-size: 0.75rem; color: var(--success); font-weight: 600;">Photo sélectionnée avec succès ! ✅</span>
                            </div>
                        </div>
                        
                        <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                            <button type="submit" class="btn btn-primary" style="flex:1;">Enregistrer</button>
                            <button type="button" class="btn btn-secondary" style="display:none;" id="dish-cancel-edit-btn" onclick="resetDishForm()">Annuler la modification</button>
                        </div>
                    </form>
                </div>
            </div>
        `}else if(h===`reviews`){let n=``;e.reviews.length===0?n=`<div style="text-align: center; color: var(--text-secondary); padding: 3rem 0;">Aucun avis reçu pour l'instant.</div>`:e.reviews.forEach(e=>{let t=`★`.repeat(e.rating)+`☆`.repeat(5-e.rating),r=e.reply?`
                        <div class="review-reply" style="margin-top: 0.75rem;">
                            <div class="review-reply-author">Votre réponse publique :</div>
                            <p>${e.reply}</p>
                            <button class="btn btn-secondary btn-sm" style="padding: 0.15rem 0.5rem; font-size: 0.7rem; margin-top: 0.5rem;" onclick="openReplyForm('${e.id}')">Modifier</button>
                        </div>
                    `:`
                        <div id="reply-form-container-${e.id}" style="margin-top: 0.75rem;">
                            <button class="btn btn-outline btn-sm" onclick="openReplyForm('${e.id}')">Répondre publiquement</button>
                        </div>
                    `;n+=`
                    <div class="review-item">
                        <div class="review-header">
                            <div>
                                <span class="review-author">${e.author}</span>
                                <span class="stars-rating" style="display: block; font-size: 0.8rem;">${t}</span>
                            </div>
                            <span class="review-date">${e.date}</span>
                        </div>
                        <p class="review-comment">${e.comment}</p>
                        ${r}
                        
                        <div id="reply-input-area-${e.id}" style="display:none; margin-top: 0.75rem; background: var(--bg-secondary); padding: 0.75rem; border-radius: 8px;">
                            <label class="form-label" style="font-size: 0.75rem;">Votre réponse :</label>
                            <textarea id="reply-text-${e.id}" class="form-control" style="font-size: 0.85rem;" placeholder="Merci pour votre retour...">${e.reply||``}</textarea>
                            <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                                <button class="btn btn-primary btn-sm" style="font-size: 0.75rem;" onclick="submitReply('${e.id}')">Publier</button>
                                <button class="btn btn-secondary btn-sm" style="font-size: 0.75rem;" onclick="closeReplyForm('${e.id}')">Annuler</button>
                            </div>
                        </div>
                    </div>
                `}),t.innerHTML=`
            <h2 style="font-size: 1.25rem; margin-bottom: 1.5rem;">Avis Clients</h2>
            <div class="reviews-list">
                ${n}
            </div>
        `}else if(h===`accounting`){let n=store.getOrdersByRestaurant(e.id);new Date().toISOString().split(`T`)[0];let r=n.filter(e=>e.status===`Livrée`),i=r.reduce((e,t)=>e+t.total,0),a=n.length,o=r.length,s=o>0?Math.round(i/o):0,c=r.filter(e=>e.mode===`Livraison`),l=r.filter(e=>e.mode===`A emporter`||e.mode===`Emporter`||e.mode===`À emporter`),u=r.filter(e=>e.mode===`Sur place`),d=c.reduce((e,t)=>e+t.total,0),f=l.reduce((e,t)=>e+t.total,0),p=u.reduce((e,t)=>e+t.total,0),m=``;n.length===0?m=`
                <tr>
                    <td colspan="6" style="text-align: center; color: var(--text-secondary); padding: 2rem;">
                        Aucune commande enregistrée pour la période sélectionnée.
                    </td>
                </tr>
            `:n.forEach(e=>{let t=e.status===`Livrée`?`<span class="badge badge-success" style="background: rgba(16, 185, 129, 0.15); color: var(--success); border: 1px solid rgba(16, 185, 129, 0.3);">Livrée (Payée)</span>`:e.status===`Reçue`?`<span class="badge badge-warning" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3);">En attente</span>`:`<span class="badge badge-info" style="background: rgba(59, 130, 246, 0.15); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.3);">${e.status}</span>`;m+=`
                    <tr class="accounting-row" data-client="${(e.customerName||``).toLowerCase()}" data-id="${e.id.toLowerCase()}">
                        <td><strong>${e.date} ${e.time||``}</strong></td>
                        <td>${e.customerName||`Client anonyme`}</td>
                        <td><a href="tel:${e.customerPhone}" style="color: var(--success); font-weight: bold;">📞 ${e.customerPhone}</a></td>
                        <td>${e.mode}</td>
                        <td style="color: var(--primary); font-weight: bold;">${e.total.toLocaleString()} FCFA</td>
                        <td>${t}</td>
                    </tr>
                `}),t.innerHTML=`
            <div class="accounting-dashboard">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
                    <div>
                        <h2 style="font-family: var(--font-serif); font-size: 1.6rem; color: var(--text-primary);">📊 Journal de Comptabilité</h2>
                        <p style="color: var(--text-secondary); font-size: 0.85rem;">Suivi des chiffres d'affaires et historique complet des commandes clients.</p>
                    </div>
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        <select class="form-control" style="width: auto; margin: 0; padding: 0.25rem 0.5rem; font-size: 0.85rem;" onchange="currentAccountingFilter = this.value; renderDashboardTabContent(store.getRestaurantById('${e.id}'))">
                            <option value="all" selected>Toutes les dates</option>
                            <option value="today" >Aujourd'hui</option>
                            <option value="week" >7 derniers jours</option>
                            <option value="month" >30 derniers jours</option>
                        </select>
                        <button class="btn btn-primary btn-sm" onclick="exportOrdersCSV('${e.id}')">💾 Exporter CSV</button>
                        <button class="btn btn-secondary btn-sm" onclick="window.print()">🖨️ Imprimer</button>
                    </div>
                </div>

                <div style="background: rgba(255,255,255,0.02); padding: 1rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 1rem; position: relative; height: 250px;">
                    <canvas id="revenueChart"></canvas>
                </div>

                <div class="accounting-stats-grid">
                    <div class="accounting-card">
                        <div class="accounting-card-title">Chiffre d'Affaires Total</div>
                        <div class="accounting-card-value" style="color: var(--success);">${i.toLocaleString()} FCFA</div>
                        <small style="color: var(--text-secondary); font-size: 0.75rem;">Commandes validées & livrées</small>
                    </div>
                    <div class="accounting-card">
                        <div class="accounting-card-title">Commandes traitées</div>
                        <div class="accounting-card-value">${o} / ${a}</div>
                        <small style="color: var(--text-secondary); font-size: 0.75rem;">Commandes livrées sur le total</small>
                    </div>
                    <div class="accounting-card">
                        <div class="accounting-card-title">Panier Moyen</div>
                        <div class="accounting-card-value" style="color: var(--primary);">${s.toLocaleString()} FCFA</div>
                        <small style="color: var(--text-secondary); font-size: 0.75rem;">Par commande encaissée</small>
                    </div>
                </div>

                <div class="accounting-stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); margin-bottom: 2rem;">
                    <div class="accounting-card" style="padding: 1rem 1.25rem;">
                        <div class="accounting-card-title" style="font-size: 0.7rem;">🛵 Livraison</div>
                        <div class="accounting-card-value" style="font-size: 1.2rem;">${d.toLocaleString()} F</div>
                        <small style="color: var(--text-secondary); font-size: 0.7rem;">${c.length} commande(s)</small>
                    </div>
                    <div class="accounting-card" style="padding: 1rem 1.25rem;">
                        <div class="accounting-card-title" style="font-size: 0.7rem;">🛍️ À Emporter</div>
                        <div class="accounting-card-value" style="font-size: 1.2rem;">${f.toLocaleString()} F</div>
                        <small style="color: var(--text-secondary); font-size: 0.7rem;">${l.length} commande(s)</small>
                    </div>
                    <div class="accounting-card" style="padding: 1rem 1.25rem;">
                        <div class="accounting-card-title" style="font-size: 0.7rem;">🍽️ Sur Place</div>
                        <div class="accounting-card-value" style="font-size: 1.2rem;">${p.toLocaleString()} F</div>
                        <small style="color: var(--text-secondary); font-size: 0.7rem;">${u.length} commande(s)</small>
                    </div>
                </div>

                <div class="accounting-table-container">
                    <div class="accounting-header-actions">
                        <h3 style="font-size: 1.1rem; color: var(--text-primary); font-family: var(--font-serif);">Historique Général des Commandes</h3>
                        <input type="text" placeholder="Rechercher par client ou N°..." class="accounting-search" oninput="filterAccountingTable(this.value)">
                    </div>

                    <div class="table-responsive-accounting">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Date & Heure</th>
                                    <th>Client (Prénom & Nom)</th>
                                    <th>Téléphone</th>
                                    <th>Mode</th>
                                    <th>Montant Total</th>
                                    <th>Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${m}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `,setTimeout(()=>renderRevenueChart(n),100)}else if(h===`settings`){let n=`${window.location.origin}${window.location.pathname}#/r/${e.slug}`,r=`https://quickchart.io/qr?size=200&text=${encodeURIComponent(n)}`,i=``;for(let t=1;t<=7;t++){let n=e.closedDays.includes(t);i+=`
                <label style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; cursor: pointer; font-size: 0.9rem;">
                    <input type="checkbox" name="closed-day-check" value="${t}" ${n?`checked`:``}>
                    ${getDayName(t)}
                </label>
            `}t.innerHTML=`
            <h2 style="font-size: 1.25rem; margin-bottom: 1.5rem;">Paramètres du Restaurant</h2>
            
            <div style="display: grid; grid-template-columns: 1fr; gap: 2rem;">
                
                <!-- Open/Closed Status Switch -->
                <div style="background: var(--bg-card); border: 1px solid var(--border); padding: 1.5rem; border-radius: 20px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h3 style="font-size: 1.1rem; margin-bottom: 0.25rem;">Statut de la Boutique (Temps Réel)</h3>
                        <p style="color: var(--text-secondary); font-size: 0.85rem;">Indiquez en direct si vous acceptez les commandes aujourd'hui.</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <span id="settings-status-label" class="badge ${e.isOpenManual?`badge-success`:`badge-danger`}">
                            ${e.isOpenManual?`OUVERT`:`FERMÉ`}
                        </span>
                        <button class="btn ${e.isOpenManual?`btn-danger`:`btn-success`} btn-sm" onclick="toggleStoreOpenStatus('${e.id}')">
                            ${e.isOpenManual?`Fermer Boutique 🔒`:`Ouvrir Boutique 🔓`}
                        </button>
                    </div>
                </div>

                <!-- Info Modification Form -->
                
                <div style="background: var(--bg-card); border: 1px solid var(--border); padding: 1.5rem; border-radius: 20px;">
                    <h3 style="font-size: 1.1rem; margin-bottom: 1.25rem;">Coordonnées, Horaires & Logo</h3>
                    <form onsubmit="saveProfileSettings(event, '${e.id}')">
                        <div class="form-group" style="margin-bottom: 1.5rem;">
                            <label class="form-label">Logo du Restaurant</label>
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                <img id="settings-logo-preview" src="${e.image}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary);" onerror="this.src='https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200'">
                                <div style="flex: 1;">
                                    <input type="file" id="settings-logo-file" class="form-control" accept="image/*" onchange="handleRestaurantLogoUpload(event)" style="padding: 0.35rem; height: auto;">
                                    <input type="hidden" id="settings-logo-url" value="${e.image}">
                                    <span id="settings-logo-status" style="font-size: 0.75rem; color: var(--success); display: none; margin-top: 0.25rem;">Upload en cours...</span>
                                </div>
                            </div>
                        </div>

                        <div class="form-group" style="background: rgba(242,107,33,0.05); padding: 1rem; border-radius: 12px; border: 1px dashed var(--primary); margin-bottom: 1.5rem;">
                            <label class="form-label" style="color: var(--primary);">📍 Coordonnées GPS (Requis pour la livraison) <span class="required">*</span></label>
                            <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <input type="number" id="settings-lat" class="form-control" step="any" value="${e.lat||``}" placeholder="Latitude (ex: 14.79)" required style="margin-bottom: 0;">
                                <input type="number" id="settings-lng" class="form-control" step="any" value="${e.lng||``}" placeholder="Longitude (ex: -16.92)" required style="margin-bottom: 0;">
                            </div>
                            <button type="button" class="btn btn-secondary btn-sm" onclick="captureGPSCoordinates()" style="width: 100%;">📌 Capturer ma position actuelle</button>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Numéro WhatsApp de réception <span class="required">*</span></label>
                            <input type="tel" id="settings-whatsapp" class="form-control" value="${e.whatsapp}" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Horaires habituels <span class="required">*</span></label>
                            <input type="text" id="settings-hours" class="form-control" value="${e.openHours}" placeholder="12:00 - 23:00" required>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Jours de fermeture hebdomadaire</label>
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; margin-top: 0.5rem;">
                                ${i}
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Nouveau mot de passe (Optionnel)</label>
                            <input type="password" id="settings-password" class="form-control" placeholder="Laisser vide si aucun changement">
                        </div>

                        <button type="submit" id="settings-submit-btn" class="btn btn-primary">Enregistrer les modifications</button>
                    </form>
                </div>


                <!-- QR Code Generation -->
                <div class="qr-container" style="margin: 0 auto;">
                    <h3 style="font-size: 1.1rem; margin-bottom: 0.5rem;">QR Code de Commande</h3>
                    <p style="color: var(--text-secondary); font-size: 0.8rem; margin-bottom: 1rem;">Imprimez et posez ce QR Code sur vos tables ou comptoir pour que vos clients scannent et commandent.</p>
                    <img src="${r}" class="qr-image" alt="QR Code Link">
                    <a href="${r}" target="_blank" download="qrcode-${e.slug}.png" class="btn btn-secondary btn-sm btn-block">
                        Imprimer / Télécharger 🖨️
                    </a>
                </div>
            </div>
        `}else if(h===`subscription`){let n=new Date,r=new Date(e.createdAt||`2026-06-26T00:00:00Z`),i=Math.abs(n-r),a=Math.ceil(i/864e5),o=Math.max(0,90-a),s=(t,n)=>`https://wa.me/221781056721?text=`+encodeURIComponent(`Bonjour Thiès à Table 👋\n\nJe souhaite souscrire au *${t}* (${n} FCFA/mois) pour réactiver mon restaurant.\n\n🏪 Restaurant : ${e.name}\n🆔 Identifiant : ${e.slug}\n📦 Pack choisi : ${t}\n\nMerci de procéder à l'activation !`),c=``;c=o>0?`
                <div style="background: linear-gradient(135deg, var(--success) 0%, #20c997 100%); color: var(--primary); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <h3 style="margin: 0 0 0.5rem 0; font-size: 1.4rem;">🎉 Période de Gratuité en cours</h3>
                        <p style="margin: 0; font-size: 1rem; opacity: 0.9;">Il vous reste <strong>${o} jours</strong> d'accès gratuit. Profitez-en pour développer votre chiffre d'affaires !</p>
                    </div>
                    <div style="font-size: 2.5rem;">🎁</div>
                </div>
            `:`
                <div style="background: linear-gradient(135deg, var(--danger) 0%, #ff4b4b 100%); color: var(--primary); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                        <div>
                            <h3 style="margin: 0 0 0.5rem 0; font-size: 1.4rem;">⚠️ Période d'essai terminée</h3>
                            <p style="margin: 0; font-size: 1rem; opacity: 0.9;">Vos 3 mois gratuits sont écoulés. <strong>Votre restaurant a été automatiquement désactivé.</strong> Choisissez un pack ci-dessous et envoyez-nous un message WhatsApp pour réactiver votre boutique.</p>
                        </div>
                        <div style="font-size: 2.5rem;">🔒</div>
                    </div>
                    <a href="https://wa.me/221781056721?text=${encodeURIComponent(`Bonjour Thiès à Table 👋\n\nMa période d'essai gratuit est terminée et je souhaite réactiver mon restaurant.\n\n🏪 Restaurant : ${e.name}\n🆔 Identifiant : ${e.slug}\n\nMerci de m'indiquer la marche à suivre !`)}" target="_blank" style="display: inline-flex; align-items: center; gap: 0.5rem; background: white; color: #25D366; padding: 0.6rem 1.2rem; border-radius: 10px; font-weight: 700; text-decoration: none; font-size: 0.95rem;">
                        💬 Contacter Thiès à Table sur WhatsApp
                    </a>
                </div>
            `,t.innerHTML=`
            <div style="background: var(--bg-card); padding: 2rem; border-radius: 20px; box-shadow: var(--shadow); max-width: 1000px; margin: 0 auto;">
                <h2 style="margin-bottom: 1rem; color: var(--text-primary); font-size: 1.8rem; font-weight: 800; border-bottom: 2px solid var(--border); padding-bottom: 0.5rem;">💳 Mon Abonnement & Visibilité</h2>
                
                ${c}

                <h3 style="margin-bottom: 0.5rem; color: var(--text-primary); font-size: 1.3rem;">Des forfaits Gagnant-Gagnant</h3>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">Nos tarifs sont pensés pour s'adapter à la taille de votre activité. Pour souscrire, cliquez sur le bouton du pack qui vous convient et envoyez-nous un message WhatsApp avec vos identifiants.</p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
                    <!-- Pack Simple -->
                    <div style="border: 2px solid var(--border); border-radius: 16px; padding: 1.5rem; display: flex; flex-direction: column; transition: transform 0.3s ease; background: var(--bg-secondary);">
                        <h4 style="margin: 0 0 0.5rem 0; font-size: 1.3rem; color: var(--text-primary);">Pack Simple</h4>
                        <div style="font-size: 1.8rem; font-weight: 800; color: var(--primary); margin-bottom: 0.5rem;">5 000 <span style="font-size: 1rem; color: var(--text-secondary); font-weight: 600;">FCFA / mois</span></div>
                        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">L'essentiel pour exister en ligne et recevoir des commandes.</p>
                        <ul style="list-style: none; padding: 0; margin: 0 0 1.5rem 0; flex-grow: 1; color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6;">
                            <li style="margin-bottom: 0.5rem;">✅ Menu digital accessible 24/7</li>
                            <li style="margin-bottom: 0.5rem;">✅ Réception illimitée de commandes</li>
                            <li style="margin-bottom: 0.5rem;">✅ Visibilité standard sur l'application</li>
                            <li style="margin-bottom: 0.5rem;">✅ Rapport d'activité trimestriel</li>
                            <li style="margin-bottom: 0.5rem;">✅ Support technique par e-mail</li>
                        </ul>
                        <a href="${s(`Pack Simple`,`5 000`)}" target="_blank" class="btn btn-outline" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem; text-decoration: none;">💬 Souscrire via WhatsApp</a>
                    </div>

                    <!-- Pack Startup -->
                    <div style="border: 2px solid var(--primary); border-radius: 16px; padding: 1.5rem; display: flex; flex-direction: column; position: relative; background: rgba(var(--primary-rgb), 0.03); box-shadow: 0 10px 25px rgba(var(--primary-rgb), 0.1);">
                        <div style="position: absolute; top: -12px; right: 20px; background: var(--primary); color: var(--primary); padding: 0.2rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 700;">Recommandé</div>
                        <h4 style="margin: 0 0 0.5rem 0; font-size: 1.3rem; color: var(--text-primary);">Pack Startup</h4>
                        <div style="font-size: 1.8rem; font-weight: 800; color: var(--primary); margin-bottom: 0.5rem;">15 000 <span style="font-size: 1rem; color: var(--text-secondary); font-weight: 600;">FCFA / mois</span></div>
                        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">Pour booster vos ventes avec une meilleure visibilité.</p>
                        <ul style="list-style: none; padding: 0; margin: 0 0 1.5rem 0; flex-grow: 1; color: var(--text-primary); font-size: 0.95rem; line-height: 1.6; font-weight: 500;">
                            <li style="margin-bottom: 0.5rem;">✅ <strong>Tout du Pack Simple</strong></li>
                            <li style="margin-bottom: 0.5rem;">🚀 <strong>Positionnement prioritaire</strong> dans votre catégorie</li>
                            <li style="margin-bottom: 0.5rem;">⭐ Badge "Restaurant Certifié"</li>
                            <li style="margin-bottom: 0.5rem;">📊 Rapport détaillé des ventes (Mensuel)</li>
                            <li style="margin-bottom: 0.5rem;">💬 Support direct et rapide via WhatsApp</li>
                        </ul>
                        <a href="${s(`Pack Startup`,`15 000`)}" target="_blank" class="btn btn-primary" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem; text-decoration: none;">💬 Souscrire via WhatsApp</a>
                    </div>

                    <!-- Pack Entreprise -->
                    <div style="border: 2px solid var(--accent); border-radius: 16px; padding: 1.5rem; display: flex; flex-direction: column; background: rgba(var(--accent-rgb), 0.03);">
                        <h4 style="margin: 0 0 0.5rem 0; font-size: 1.3rem; color: var(--text-primary);">Pack Entreprise</h4>
                        <div style="font-size: 1.8rem; font-weight: 800; color: var(--accent); margin-bottom: 0.5rem;">25 000 <span style="font-size: 1rem; color: var(--text-secondary); font-weight: 600;">FCFA / mois</span></div>
                        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">La solution complète pour dominer le marché local.</p>
                        <ul style="list-style: none; padding: 0; margin: 0 0 1.5rem 0; flex-grow: 1; color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6;">
                            <li style="margin-bottom: 0.5rem;">✅ <strong>Tout du Pack Startup</strong></li>
                            <li style="margin-bottom: 0.5rem;">📢 <strong>Bannière publicitaire</strong> sur l'accueil</li>
                            <li style="margin-bottom: 0.5rem;">📱 1 Post sponsorisé par mois sur nos réseaux</li>
                            <li style="margin-bottom: 0.5rem;">🎁 Outils de fidélisation (Coupons promo)</li>
                            <li style="margin-bottom: 0.5rem;">📈 Statistiques avancées (Hebdomadaire)</li>
                        </ul>
                        <a href="${s(`Pack Entreprise`,`25 000`)}" target="_blank" class="btn btn-outline" style="width: 100%; border-color: var(--accent); color: var(--accent); display: flex; align-items: center; justify-content: center; gap: 0.5rem; text-decoration: none;">💬 Souscrire via WhatsApp</a>
                    </div>
                </div>
            </div>
        `}}window.filterAccountingTable=function(e){let t=e.toLowerCase().trim();document.querySelectorAll(`.accounting-row`).forEach(e=>{let n=e.getAttribute(`data-client`)||``,r=e.getAttribute(`data-id`)||``;n.includes(t)||r.includes(t)?e.style.display=``:e.style.display=`none`})},window.switchHowItWorksTab=function(e){document.querySelectorAll(`.hw-tab-btn`).forEach(e=>{e.classList.remove(`active`)}),document.querySelectorAll(`.hw-tab-content`).forEach(e=>{e.classList.remove(`active`)});let t=document.querySelector(`.hw-tab-btn[onclick*="${e}"]`),n=document.getElementById(e);t&&t.classList.add(`active`),n&&n.classList.add(`active`)},window.openLoyaltyAndCheck=function(e){window.location.hash!==`#/`&&window.location.hash!==``&&router.navigate(`/`),setTimeout(()=>{typeof switchHowItWorksTab==`function`&&switchHowItWorksTab(`hw-loyalty`);let t=document.getElementById(`how-it-works-section`);t&&t.scrollIntoView({behavior:`smooth`,block:`start`});let n=document.getElementById(`loyalty-phone`);n&&(n.value=e,window.checkLoyaltyPoints())},200)},window.checkLoyaltyPoints=async function(){let e=document.getElementById(`loyalty-phone`).value.trim();if(!e){showToast(`Veuillez saisir votre numéro WhatsApp`,`warning`);return}let t=cleanPhoneNumber(e);if(!/^\+221(70|75|76|77|78)\d{7}$/.test(t.replace(/\s+/g,``))){showToast(`Numéro de téléphone sénégalais invalide (ex: +221 77 XXX XX XX)`,`danger`);return}let n=0,r=0,i=0;if(supabaseClient){let{data:e,error:a}=await supabaseClient.rpc(`get_customer_loyalty_data`,{p_phone:t});!a&&e&&e.length>0&&(n=e[0].orders_count,r=e[0].reservations_count,i=e[0].used_rewards)}else n=store.data.orders.filter(e=>cleanPhoneNumber(e.customerPhone)===t&&e.status===`Livrée`).length,r=store.data.reservations.filter(e=>cleanPhoneNumber(e.customerPhone)===t&&e.status===`Confirmée`).length,store.data.usedRewards||(store.data.usedRewards={}),i=store.data.usedRewards[t]||0;let a=n*5+r*5,o=Math.floor(a/100),s=Math.max(0,o-i),c=100-a%100,l=`Gourmand de Bronze 🥉`,u=`tier-bronze`;a>=200?(l=`Empereur du Goût 👑`,u=`tier-emperor`):a>=100?(l=`Gourmand d'Or 🥇`,u=`tier-gold`):a>=50&&(l=`Gourmand d'Argent 🥈`,u=`tier-silver`);let d=document.getElementById(`loyalty-result-card`);if(!d)return;d.style.display=`block`;let f=``;s>0&&(f=`
            <div class="reward-claim-box" style="margin-top: 1.5rem; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); padding: 1.25rem; border-radius: 16px; display: flex; align-items: center; gap: 1rem;">
                <span class="gift-icon" style="font-size: 2.2rem;">🎁</span>
                <div style="flex: 1; text-align: left;">
                    <h4 style="color: var(--text-primary); margin: 0 0 0.25rem 0; font-family: var(--font-serif); font-size: 1.05rem;">Vous avez ${s} plat(s) offert(s) disponible(s) !</h4>
                    <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0 0 0.5rem 0;">Profitez de votre récompense de fidélité lors de votre prochaine commande en ligne.</p>
                    <button class="btn btn-sm btn-success" onclick="applyLoyaltyRewardToCart('${t}')">Appliquer au panier actif 🛒</button>
                </div>
            </div>
        `),d.innerHTML=`
        <div class="loyalty-card-inner" style="background: linear-gradient(135deg, #071a11 0%, #0c2b1d 100%); border: 1px solid var(--border); border-radius: 24px; padding: 1.75rem; text-align: left; position: relative; overflow: hidden; box-shadow: var(--shadow);">
            <div class="loyalty-card-header" style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 1rem; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
                <div>
                    <h3 style="font-family: var(--font-serif); color: var(--text-primary); margin: 0; font-size: 1.3rem;">Carte de Fidélité</h3>
                    <span class="loyalty-phone-lbl" style="font-size: 0.8rem; color: var(--text-secondary); font-family: monospace;">WhatsApp: ${t}</span>
                </div>
                <div class="loyalty-tier-badge ${u}" style="font-size: 0.8rem; font-weight: bold; padding: 0.35rem 0.75rem; border-radius: 20px; text-transform: uppercase; background: rgba(255,255,255,0.05); color: var(--primary); border: 1px solid rgba(207,168,83,0.3);">${l}</div>
            </div>
            
            <div class="loyalty-card-body">
                <div class="loyalty-gauge-container" style="display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1rem; flex-wrap: wrap;">
                    <div class="loyalty-points-circle" style="width: 80px; height: 80px; border-radius: 50%; background: rgba(207, 168, 83, 0.1); border: 2.5px solid var(--primary); display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(207,168,83,0.15);">
                        <span class="points-num" style="font-size: 1.8rem; font-weight: 800; color: var(--primary); font-family: var(--font-serif); line-height: 1;">${a}</span>
                        <span class="points-lbl" style="font-size: 0.6rem; text-transform: uppercase; color: var(--text-secondary); margin-top: 2px;">Points</span>
                    </div>
                    <div class="loyalty-progress-text" style="flex: 1; min-width: 200px;">
                        <p style="font-size: 1.1rem; font-weight: bold; color: var(--text-primary); margin: 0;">${a%100} / 100 pts</p>
                        <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0.25rem 0 0 0;">
                            Plus que <strong style="color: var(--primary);">${c} points</strong> pour obtenir votre prochain plat gratuit !
                        </p>
                    </div>
                </div>
                
                <div class="loyalty-progress-bar-bg" style="width: 100%; height: 8px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; margin-bottom: 1.5rem; border: 1px solid rgba(255,255,255,0.02);">
                    <div class="loyalty-progress-bar-fill" style="width: ${a%100}%; height: 100%; background: linear-gradient(90deg, var(--primary), var(--accent)); border-radius: 10px; transition: width 0.4s ease;"></div>
                </div>

                <div class="loyalty-stats-summary" style="display: flex; justify-content: space-around; gap: 1rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1.25rem; margin-top: 1rem; text-align: center; flex-wrap: wrap;">
                    <div class="loyalty-stat-col" style="flex: 1; min-width: 80px;">
                        <span class="stat-num" style="font-size: 1.25rem; font-weight: bold; color: var(--text-primary); display: block; margin-bottom: 0.25rem;">${n}</span>
                        <span class="stat-lbl" style="font-size: 0.75rem; color: var(--text-secondary); display: block;">Commandes livrées</span>
                    </div>
                    <div class="loyalty-stat-col" style="flex: 1; min-width: 80px;">
                        <span class="stat-num" style="font-size: 1.25rem; font-weight: bold; color: var(--text-primary); display: block; margin-bottom: 0.25rem;">${r}</span>
                        <span class="stat-lbl" style="font-size: 0.75rem; color: var(--text-secondary); display: block;">Tables réservées</span>
                    </div>
                    <div class="loyalty-stat-col" style="flex: 1; min-width: 80px;">
                        <span class="stat-num" style="font-size: 1.25rem; font-weight: bold; color: var(--text-primary); display: block; margin-bottom: 0.25rem;">${i}</span>
                        <span class="stat-lbl" style="font-size: 0.75rem; color: var(--text-secondary); display: block;">Cadeaux réclamés</span>
                    </div>
                </div>

                ${f}
            </div>
        </div>
    `},window.applyLoyaltyRewardToCart=async function(e){if(!cart.items||cart.items.length===0){showToast(`Votre panier est vide. Veuillez d'abord ajouter des plats depuis un restaurant !`,`warning`);return}let t=0,n=0,r=0;if(supabaseClient){let{data:i,error:a}=await supabaseClient.rpc(`get_customer_loyalty_data`,{p_phone:e});!a&&i&&i.length>0&&(t=i[0].orders_count,n=i[0].reservations_count,r=i[0].used_rewards)}else t=store.data.orders.filter(t=>cleanPhoneNumber(t.customerPhone)===e&&t.status===`Livrée`).length,n=store.data.reservations.filter(t=>cleanPhoneNumber(t.customerPhone)===e&&t.status===`Confirmée`).length,store.data.usedRewards||(store.data.usedRewards={}),r=store.data.usedRewards[e]||0;let i=t*5+n*5,a=Math.floor(i/100);if(Math.max(0,a-r)<=0){showToast(`Vous n'avez aucune récompense disponible pour le moment.`,`danger`);return}cart.loyaltyApplied=!0,cart.loyaltyPhone=e,recalculateCart(),saveCart();let o=store.getRestaurantById(cart.restaurantId);o&&(router.navigate(`/r/${o.slug}`),setTimeout(()=>{switchRestoTab(`checkout`)},150)),showToast(`🎁 Récompense Fidélité appliquée ! Réduction de 2,500 FCFA.`,`success`),checkLoyaltyPoints()},window.removeLoyaltyReward=function(){cart.loyaltyApplied=!1,cart.loyaltyPhone=null,recalculateCart(),saveCart();let e=store.getRestaurantById(cart.restaurantId);e&&renderCheckoutTab(e),showToast(`Réduction de fidélité retirée.`,`info`)};function ee(e,t){let n=store.data.orders.find(t=>t.id===e);if(!n)return;store.updateOrderStatus(e,t);let r=currentRestaurantSession&&currentRestaurantSession.name||``;t===`Confirmée`?`${n.customerName}${n.id}${r}${n.total}${n.mode}`:t===`Prête`?(`${n.customerName}${n.id}${r}`,n.mode):(t===`Livrée`||t===`Annulée`)&&`${n.customerName}${n.id}${r}`,showToast(`Commande mise à jour vers : ${t}. Client notifié automatiquement 📲`,t===`Annulée`?`warning`:`success`),y(`orders`)}function te(e,t){let n=store.data.reservations.find(t=>t.id===e);if(!n)return;store.updateReservationStatus(e,t);let r=``,i=new Date(n.date).toLocaleDateString(`fr-FR`,{weekday:`long`,day:`numeric`,month:`long`});t===`Confirmée`?r=`Réservation confirmée pour ${n.guests} personnes le ${i} à ${n.time}. 📅`:t===`Annulée`&&(r=`Réservation annulée pour cause d'indisponibilité le ${i}.`),showToast(`Réservation mise à jour : ${t}`,`success`),r&&(showToast(`📲 Notification push envoyée au client !`,`success`),`Notification`in window&&Notification.permission===`granted`&&new Notification(`Push Envoyé au Client`,{body:r,icon:`icon.png`})),y(`reservations`)}function ne(){let e=document.getElementById(`manual-reservation-card`);e&&(e.style.display===`none`?(e.style.display=`block`,e.scrollIntoView({behavior:`smooth`})):e.style.display=`none`)}function re(e,t){e.preventDefault();let n=document.getElementById(`mres-name`).value.trim(),r=cleanPhoneNumber(document.getElementById(`mres-phone`).value.trim()),i=document.getElementById(`mres-date`).value,a=document.getElementById(`mres-time`).value,o=parseInt(document.getElementById(`mres-guests`).value),s=document.getElementById(`mres-note`).value.trim();if(!/^\+221(70|75|76|77|78)\d{7}$/.test(r.replace(/\s+/g,``))){showToast(`Numéro de téléphone invalide (ex: +221 77 XXX XX XX)`,`danger`);return}let c={id:`RES-`+Math.floor(1e5+Math.random()*9e5),restaurantId:t,customerName:n,customerPhone:r,date:i,time:a,guests:o,note:s,status:`Confirmée`};store.addReservation(c),showToast(`Réservation enregistrée et confirmée ! ✅`,`success`),y(`reservations`)}function ie(e){g=e,b(store.getRestaurantById(currentRestaurantSession.id))}function ae(e){if(confirm(`Voulez-vous vraiment supprimer ce plat du jour ?`)){let t=store.getRestaurantById(currentRestaurantSession.id);t.menu=t.menu.filter(t=>t.id!==e),store.updateRestaurant(t.id,{menu:t.menu}),showToast(`Plat supprimé !`,`success`),y(`menu`)}}function oe(e){let t=store.getRestaurantById(currentRestaurantSession.id).menu.find(t=>t.id===e);if(!t)return;document.getElementById(`dish-form-title`).innerText=`Modifier le plat : `+t.name,document.getElementById(`dish-edit-id`).value=t.id,document.getElementById(`dish-name`).value=t.name,document.getElementById(`dish-desc`).value=t.description,document.getElementById(`dish-price`).value=t.price;let n=document.getElementById(`dish-image-select`),r=document.getElementById(`dish-image-custom`);Array.from(n.options).some(e=>e.value===t.image)?(n.value=t.image,r.value=``):(n.selectedIndex=0,r.value=t.image),document.getElementById(`dish-cancel-edit-btn`).style.display=`block`}function se(){document.getElementById(`dish-form-title`).innerText=`Ajouter un nouveau plat`,document.getElementById(`dish-edit-id`).value=``,document.getElementById(`dish-name`).value=``,document.getElementById(`dish-desc`).value=``,document.getElementById(`dish-price`).value=``,document.getElementById(`dish-image-select`).selectedIndex=0,document.getElementById(`dish-image-custom`).value=``,document.getElementById(`dish-cancel-edit-btn`).style.display=`none`;let e=document.getElementById(`dish-image-file`);e&&(e.value=``);let t=document.getElementById(`dish-image-preview-container`);t&&(t.style.display=`none`)}window.compressImage=function(e,t=800,n=.7){return new Promise((r,i)=>{let a=new FileReader;a.readAsDataURL(e),a.onload=a=>{let o=new Image;o.src=a.target.result,o.onload=()=>{let i=document.createElement(`canvas`),a=o.width,s=o.height;a>t&&(s=Math.round(s*t/a),a=t),i.width=a,i.height=s,i.getContext(`2d`).drawImage(o,0,0,a,s),i.toBlob(t=>{let n=e.name.replace(/\.[^/.]+$/,``)+`.webp`;r(new File([t],n,{type:`image/webp`,lastModified:Date.now()}))},`image/webp`,n)},o.onerror=e=>i(e)},a.onerror=e=>i(e)})},window.handleDishImageUpload=async function(e){let t=e.target.files[0];if(!t)return;if(!supabaseClient){showToast(`Service Storage non disponible`,`danger`);return}let n=document.getElementById(`dish-image-preview`),r=document.getElementById(`dish-image-preview-container`),i=document.getElementById(`dish-image-upload-status`)||document.getElementById(`dish-image-status`),a=document.getElementById(`dish-image-custom`),o=document.querySelector(`#dish-editor-form button[type="submit"]`);r&&(r.style.display=`flex`),n&&(n.src=URL.createObjectURL(t)),i&&(i.style.display=`block`,i.innerHTML=`⏳ Compression de l'image...`,i.style.color=`var(--warning)`),o&&(o.disabled=!0);try{t=await compressImage(t,800,.7),i&&(i.innerHTML=`⏳ Téléchargement vers Supabase...`);let e=`${Date.now()}_${Math.random().toString(36).substring(2)}.webp`,n=`dishes/${currentRestaurantSession.id}/${e}`,{data:r,error:o}=await supabaseClient.storage.from(`restaurant-images`).upload(n,t);if(o)throw o;let{data:s}=supabaseClient.storage.from(`restaurant-images`).getPublicUrl(n);a.value=s.publicUrl,i&&(i.innerHTML=`✅ Photo compressée et hébergée !`,i.style.color=`var(--success)`)}catch(e){console.error(`Upload error:`,e),i&&(i.innerHTML=`❌ Échec de l'envoi (${e.message})`,i.style.color=`var(--danger)`)}finally{o&&(o.disabled=!1)}},window.handleRestaurantLogoUpload=async function(e){let t=e.target.files[0];if(!t)return;if(!supabaseClient){showToast(`Service Storage non disponible`,`danger`);return}let n=document.getElementById(`settings-logo-preview`),r=document.getElementById(`settings-logo-status`),i=document.getElementById(`settings-logo-url`),a=document.getElementById(`settings-submit-btn`);n&&(n.src=URL.createObjectURL(t)),r&&(r.style.display=`block`,r.innerHTML=`⏳ Compression de l'image...`,r.style.color=`var(--warning)`),a&&(a.disabled=!0);try{t=await compressImage(t,500,.7),r&&(r.innerHTML=`⏳ Téléchargement vers Supabase...`);let e=`${Date.now()}_${Math.random().toString(36).substring(2)}.webp`,n=`restaurants/${currentRestaurantSession.id}/${e}`,{data:a,error:o}=await supabaseClient.storage.from(`restaurant-images`).upload(n,t);if(o)throw o;let{data:s}=supabaseClient.storage.from(`restaurant-images`).getPublicUrl(n);i.value=s.publicUrl,r&&(r.innerHTML=`✅ Photo compressée et hébergée !`,r.style.color=`var(--success)`)}catch(e){console.error(`Upload error:`,e),r&&(r.innerHTML=`❌ Échec de l'envoi (${e.message})`,r.style.color=`var(--danger)`)}finally{a&&(a.disabled=!1)}};function ce(e){e.preventDefault();let t=store.getRestaurantById(currentRestaurantSession.id),n=document.getElementById(`dish-edit-id`).value,r=document.getElementById(`dish-name`).value.trim(),i=document.getElementById(`dish-desc`).value.trim(),a=parseInt(document.getElementById(`dish-price`).value),o=document.getElementById(`dish-image-custom`).value.trim()||document.getElementById(`dish-image-select`).value;if(n){let e=t.menu.find(e=>e.id===n);e&&(e.name=r,e.description=i,e.price=a,e.image=o,showToast(`Plat modifié !`,`success`))}else{let e=`dish_`+Date.now();t.menu.push({id:e,name:r,description:i,price:a,image:o}),showToast(`Plat ajouté au menu du jour !`,`success`)}store.updateRestaurant(t.id,{menu:t.menu}),se(),y(`menu`)}function le(e){let t=store.getRestaurantById(e);t.isOpenManual=!t.isOpenManual,store.updateRestaurant(t.id,{isOpenManual:t.isOpenManual}),showToast(t.isOpenManual?`Boutique OUVERTE`:`Boutique FERMÉE`,`success`),y(`settings`)}function ue(e,t){e.preventDefault();let n=store.getRestaurantById(t),r=cleanPhoneNumber(document.getElementById(`settings-whatsapp`).value.trim()),i=document.getElementById(`settings-hours`).value.trim(),a=document.getElementById(`settings-password`).value,o=parseFloat(document.getElementById(`settings-lat`).value),s=parseFloat(document.getElementById(`settings-lng`).value),c=document.querySelectorAll(`input[name="closed-day-check"]:checked`),l=Array.from(c).map(e=>parseInt(e.value));if(!/^\+221(70|75|76|77|78)\d{7}$/.test(r.replace(/\s+/g,``))){showToast(`Numéro WhatsApp invalide`,`danger`);return}let u={whatsapp:r,openHours:i,closedDays:l,lat:o,lng:s};a&&(u.password=a),store.updateRestaurant(n.id,u),showToast(`Paramètres enregistrés !`,`success`),y(`settings`)}function de(e){document.getElementById(`reply-form-container-${e}`).style.display=`none`,document.getElementById(`reply-input-area-${e}`).style.display=`block`}function fe(e){document.getElementById(`reply-form-container-${e}`).style.display=`block`,document.getElementById(`reply-input-area-${e}`).style.display=`none`}function pe(e){let t=document.getElementById(`reply-text-${e}`).value.trim();if(!t){showToast(`La réponse ne peut pas être vide`,`danger`);return}let n=store.getRestaurantById(currentRestaurantSession.id),r=n.reviews.find(t=>t.id===e);r&&(r.reply=t,store.updateRestaurant(n.id,{reviews:n.reviews}),showToast(`Réponse publiée !`,`success`),y(`reviews`))}router.add(`#/admin-login`,()=>{document.getElementById(`floating-cart-bar`).style.display=`none`,stopOrderPolling(),hideLoadingOverlay();let e=document.getElementById(`main-content`);e.innerHTML=`
        <div class="auth-container">
            <div class="auth-header">
                <span class="auth-logo">🔑</span>
                <h2>Console Super-Admin</h2>
                <p style="color: var(--text-secondary); font-size: 0.85rem;">Accès exclusif réservé au gérant du réseau THIES Resto.</p>
            </div>
            
            <form onsubmit="handleAdminLogin(event)">
                <div class="form-group">
                    <label class="form-label">Nom d'utilisateur</label>
                    <input type="text" id="admin-user" class="form-control" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Mot de passe de sécurité</label>
                    <input type="password" id="admin-pass" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary btn-block">Ouvrir la Console 🔐</button>
            </form>
        </div>
    `});var x=`pending`;router.add(`#/admin`,()=>{if(document.getElementById(`floating-cart-bar`).style.display=`none`,stopOrderPolling(),hideLoadingOverlay(),!isSuperAdminSession){showToast(`Accès refusé. Veuillez vous connecter.`,`danger`),router.navigate(`/admin-login`);return}S()});function S(){let e=document.getElementById(`main-content`),t=store.getRestaurants(),n=t.filter(e=>e.status===`active`),r=t.filter(e=>e.status===`pending`).length,i=store.data.orders,a=store.data.reservations,o=i.filter(e=>e.status===`completed`||e.status===`delivered`).reduce((e,t)=>e+t.total,0);e.innerHTML=`
        <div style="padding: 2rem 1.5rem; max-width: 1000px; margin: 0 auto;">
            <div style="display:flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
                <div>
                    <h1 style="font-size: 1.75rem;">Super-Admin Console</h1>
                    <p style="color: var(--text-secondary); font-size: 0.85rem;">Supervisez l'intégralité du réseau de restauration de Thiès.</p>
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.25rem;">
                    <span class="badge badge-danger">Live Monitor</span>
                    <button class="btn btn-outline" style="color: var(--danger); border-color: var(--danger); font-size: 0.8rem; padding: 0.3rem 0.6rem;" onclick="handleLogout()">🚪 Déconnexion</button>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <span class="stat-card-title">Total Restaurants</span>
                    <span class="stat-card-value">${n.length} actifs</span>
                </div>
                <div class="stat-card">
                    <span class="stat-card-title">En attente d'activation</span>
                    <span class="stat-card-value" style="color: ${r>0?`var(--accent)`:`inherit`}">${r} demandes</span>
                </div>
                <div class="stat-card">
                    <span class="stat-card-title">Volume d'affaires généré</span>
                    <span class="stat-card-value">${o.toLocaleString()} FCFA</span>
                </div>
                <div class="stat-card">
                    <span class="stat-card-title">Commandes / Réservations</span>
                    <span class="stat-card-value">${i.length} | ${a.length}</span>
                </div>
            </div>

            <!-- Section Abonnements -->
            ${(function(){let e=0,n=t.filter(e=>e.status!==`pending`).map(t=>{let n=new Date(t.createdAt||`2026-06-25T00:00:00Z`),r=Math.abs(new Date-n),i=90-Math.ceil(r/864e5),a=t.subscriptionPack||`Aucun (Gratuit)`,o=0;a===`Pack Simple`?o=5e3:a===`Pack Startup`?o=15e3:a===`Pack Entreprise`&&(o=25e3),(t.status===`active`||t.status===`suspended`)&&(e+=o);let s=``;return s=i>0?`<span class="badge badge-success">En cours (${i} jrs restants)</span>`:`<span class="badge badge-danger">Expiré</span>`,`
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 1rem;"><strong>${t.name}</strong></td>
                        <td style="padding: 1rem;">${s}</td>
                        <td style="padding: 1rem;"><span class="badge" style="background: ${a===`Aucun (Gratuit)`?`#e2e8f0`:`rgba(var(--accent-rgb), 0.1)`}; color: ${a===`Aucun (Gratuit)`?`#64748b`:`var(--accent)`};">${a}</span></td>
                        <td style="padding: 1rem; font-weight: 700; color: var(--text-secondary);">${o>0?o.toLocaleString()+` FCFA`:`0 FCFA`}</td>
                    </tr>`}).join(``);return`
                <section style="background: var(--bg-card); padding: 1.5rem; border-radius: 12px; box-shadow: var(--shadow); margin-bottom: 2rem; border: 1px solid var(--border);">
                    <h3 style="margin-top: 0; color: var(--text-primary); border-bottom: 2px solid var(--border); padding-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                        <span>💳 Abonnements & Revenus Plateforme</span>
                        <span style="color: var(--success); font-weight: 800; font-size: 1.2rem; background: rgba(var(--success-rgb), 0.1); padding: 0.4rem 0.8rem; border-radius: 8px;">Revenus Plateforme: ${e.toLocaleString()} FCFA / mois</span>
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
                                ${n||`<tr><td colspan="4" style="padding: 1rem; text-align: center; color: var(--text-secondary);">Aucun restaurant actif</td></tr>`}
                            </tbody>
                        </table>
                    </div>
                </section>`})()}

            <!-- Tab selections -->
            <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; flex-wrap: wrap;">
                <button class="btn btn-sm ${x===`pending`?`btn-primary`:`btn-secondary`}" onclick="switchAdminTab('pending')">⏳ Demandes (${r})</button>
                <button class="btn btn-sm ${x===`active`?`btn-primary`:`btn-secondary`}" onclick="switchAdminTab('active')">🏪 Réseau Actif (${n.length})</button>
                <button class="btn btn-sm ${x===`create`?`btn-primary`:`btn-secondary`}" onclick="switchAdminTab('create')">➕ Ajouter</button>
                <button class="btn btn-sm ${x===`accounting`?`btn-primary`:`btn-secondary`}" onclick="switchAdminTab('accounting')">📊 Comptabilité</button>
            </div>


            <div id="admin-table-container">
                <!-- Tables populated dynamically -->
            </div>
        </div>
    `,he()}function me(e){x=e,S()}function he(){let e=document.getElementById(`admin-table-container`),t=store.getRestaurants();if(x===`pending`){let n=t.filter(e=>e.status===`pending`);if(n.length===0){e.innerHTML=`<div style="text-align: center; background: var(--bg-card); padding: 3rem; border-radius: 16px; color: var(--text-secondary); border: 1px solid var(--border);">Aucune demande d'inscription en attente.</div>`;return}let r=``;n.forEach(e=>{r+=`
                <tr>
                    <td><strong>${e.name}</strong></td>
                    <td>${e.category}</td>
                    <td>${e.address}</td>
                    <td><a href="https://wa.me/${e.whatsapp.replace(/\+/g,``)}" target="_blank" class="call-btn">💬 ${e.whatsapp}</a></td>
                    <td>${e.openHours}</td>
                    <td>
                        <button class="btn btn-success btn-sm" onclick="approveRestaurant('${e.id}')">Valider (Activer) ✅</button>
                        <button class="btn btn-danger btn-sm" onclick="rejectRestaurant('${e.id}')">Refuser ❌</button>
                    </td>
                </tr>
            `}),e.innerHTML=`
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Catégorie</th>
                            <th>Adresse</th>
                            <th>WhatsApp</th>
                            <th>Horaires</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${r}
                    </tbody>
                </table>
            </div>
        `}else if(x===`active`){let n=t.filter(e=>e.status===`active`||e.status===`suspended`);if(n.length===0){e.innerHTML=`<div style="text-align: center; background: var(--bg-card); padding: 3rem; border-radius: 16px; color: var(--text-secondary);">Aucun restaurant configuré dans le réseau.</div>`;return}let r=``;n.forEach(e=>{let t=store.getOrdersByRestaurant(e.id);store.getReservationsByRestaurant(e.id).length;let n=t.filter(e=>e.status===`completed`||e.status===`delivered`).reduce((e,t)=>e+t.total,0),i=e.status===`active`?`<span class="badge badge-success">Actif</span>`:`<span class="badge badge-danger">Suspendu</span>`,a=e.status===`active`?`<button class="btn btn-danger btn-sm" onclick="suspendRestaurant('${e.id}')">Suspendre 🔒</button>`:`<button class="btn btn-success btn-sm" onclick="reactivateRestaurant('${e.id}')">Réactiver 🔓</button>`,o=e.subscriptionPack||`Aucun (Gratuit)`,s=`
                <select class="form-control" style="padding: 0.2rem; font-size: 0.8rem; height: auto;" onchange="updateRestaurantPack('${e.id}', this.value)">
                    <option value="Aucun (Gratuit)" ${o===`Aucun (Gratuit)`?`selected`:``}>Gratuit (0 FCFA)</option>
                    <option value="Pack Simple" ${o===`Pack Simple`?`selected`:``}>Simple (5k FCFA)</option>
                    <option value="Pack Startup" ${o===`Pack Startup`?`selected`:``}>Startup (15k FCFA)</option>
                    <option value="Pack Entreprise" ${o===`Pack Entreprise`?`selected`:``}>Entreprise (25k FCFA)</option>
                </select>
            `;r+=`
                <tr>
                    <td><strong>${e.name}</strong></td>
                    <td>${i}</td>
                    <td>${s}</td>
                    <td>${t.length} Cmd(s)</td>
                    <td style="color: var(--success); font-weight: bold;">${n.toLocaleString()} FCFA</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="impersonateRestaurant('${e.id}')" title="Gérer ce restaurant">⚙️</button>
                        ${a}
                        <button class="btn btn-secondary btn-sm" onclick="router.navigate('/r/${e.slug}')" title="Visiter la page">🌐</button>
                    </td>
                </tr>
            `}),e.innerHTML=`
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Restaurant</th>
                            <th>Statut</th>
                            <th>Pack Abonnement</th>
                            <th>Commandes</th>
                            <th>C.A. Généré</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${r}
                    </tbody>
        `}else if(x===`create`)e.innerHTML=`
            <div style="background: var(--bg-card); border: 1px solid var(--border); padding: 2rem; border-radius: 24px; max-width: 600px; margin: 0 auto; box-shadow: var(--shadow);">
                <h3 style="font-family: var(--font-serif); font-size: 1.35rem; margin-bottom: 1.5rem; text-align: center; color: var(--text-primary);">Créer un Nouveau Partenaire Restaurant</h3>
                
                <form id="admin-create-resto-form" onsubmit="handleAdminCreateRestaurant(event)">
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label class="form-label">Nom du restaurant <span class="required">*</span></label>
                        <input type="text" id="adm-reg-name" class="form-control" placeholder="L'Étoile de Thiès" required oninput="handleRestaurantNameInput(this.value, 'adm-reg-username', 'adm-reg-password', 'adm-slug-availability-badge')">
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label class="form-label">Adresse physique à Thiès <span class="required">*</span></label>
                        <input type="text" id="adm-reg-address" class="form-control" placeholder="Avenue de Caen, Thiès" required>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label class="form-label">Catégorie <span class="required">*</span></label>
                        <select id="adm-reg-category" class="form-control" required>
                            <option value="Traditionnel">Traditionnel (Thiéb, Yassa, Mafé)</option>
                            <option value="Grillades / Dibi">Grillades / Dibi (Dibiterie)</option>
                            <option value="Fast Food">Fast Food (Burgers, Chawarmas)</option>
                            <option value="Pâtisserie">Pâtisserie / Petit Déjeuner</option>
                            <option value="Gastronomique">Chic / Gastronomique</option>
                        </select>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label class="form-label">Numéro WhatsApp de contact <span class="required">*</span></label>
                        <input type="tel" id="adm-reg-whatsapp" class="form-control" placeholder="+221 77 XXX XX XX" required>
                    </div>
                    
                    <div class="form-row" style="margin-bottom: 1rem;">
                        <div class="form-group">
                            <label class="form-label">Heure d'ouverture <span class="required">*</span></label>
                            <input type="time" id="adm-reg-open" class="form-control" value="12:00" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Heure de fermeture <span class="required">*</span></label>
                            <input type="time" id="adm-reg-close" class="form-control" value="23:00" required>
                        </div>
                    </div>

                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label class="form-label">Identifiant de connexion (slug unique) <span class="required">*</span></label>
                        <input type="text" id="adm-reg-username" class="form-control" placeholder="letoile-thies" required oninput="checkSlugAvailabilityRealtime(this.value)">
                        <small style="color: var(--text-secondary); font-size: 0.75rem; display: block; margin-top: 0.25rem;">Généré automatiquement (modifiable).</small>
                        <div id="adm-slug-availability-badge" class="slug-status" style="margin-top: 0.35rem; font-size: 0.8rem; font-weight: 600;"></div>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 1.5rem;">
                        <label class="form-label">Mot de passe de connexion <span class="required">*</span></label>
                        <input type="password" id="adm-reg-password" class="form-control" placeholder="••••••••" required>
                        <small style="color: var(--text-secondary); font-size: 0.75rem; display: block; margin-top: 0.25rem;">Généré automatiquement par défaut (nom_221, modifiable).</small>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-block" style="font-weight: 700;">Ajouter le Restaurant au Réseau 🚀</button>
                </form>
            </div>
        `;else if(x===`accounting`){let n=store.data.orders,r=n.filter(e=>e.status===`Livrée`),i=n.filter(e=>e.status===`Annulée`),a=n.filter(e=>e.status===`Reçue`||e.status===`Confirmée`||e.status===`Prête`),o=r.reduce((e,t)=>e+t.total,0),s={};r.forEach(e=>{let n=t.find(t=>t.id===e.restaurantId),r=n?n.name:e.restaurantId;s[r]=(s[r]||0)+e.total});let c=``;Object.entries(s).sort((e,t)=>t[1]-e[1]).forEach(([e,n])=>{let i=r.filter(n=>{let r=t.find(t=>t.name===e);return r&&n.restaurantId===r.id}).length;c+=`
                <tr style="border-bottom: 1px solid var(--border);">
                    <td style="padding: 0.75rem;"><strong>${e}</strong></td>
                    <td style="padding: 0.75rem;">${i}</td>
                    <td style="padding: 0.75rem; font-weight: 700; color: var(--success);">${n.toLocaleString()} FCFA</td>
                </tr>
            `}),c||=`<tr><td colspan="3" style="padding: 1.5rem; text-align: center; color: var(--text-secondary);">Aucune commande livrée pour le moment.</td></tr>`;let l=``;[...n].sort((e,t)=>(t.date+t.time).localeCompare(e.date+e.time)).forEach(e=>{let n=t.find(t=>t.id===e.restaurantId),r=n?n.name:e.restaurantId,i=e.status===`Livrée`?`badge-success`:e.status===`Annulée`?`badge-danger`:e.status===`Reçue`?`badge-warning`:`badge-info`;l+=`
                <tr style="border-bottom: 1px solid var(--border);">
                    <td style="padding: 0.6rem; font-weight: 600;">${e.id}</td>
                    <td style="padding: 0.6rem;">${r}</td>
                    <td style="padding: 0.6rem;">${e.customerName}</td>
                    <td style="padding: 0.6rem;">${e.date} ${e.time}</td>
                    <td style="padding: 0.6rem;"><span class="badge ${i}">${e.status}</span></td>
                    <td style="padding: 0.6rem; font-weight: 700; color: var(--primary);">${e.total.toLocaleString()} FCFA</td>
                </tr>
            `}),l||=`<tr><td colspan="6" style="padding: 2rem; text-align: center; color: var(--text-secondary);">Aucune commande enregistrée sur la plateforme.</td></tr>`,e.innerHTML=`
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                <div class="stat-card" style="border-top: 4px solid var(--success); background: var(--bg-card); padding: 1.25rem; border-radius: 16px; box-shadow: var(--shadow);">
                    <span style="color: var(--text-secondary); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 0.5rem;">💰 Chiffre d'Affaires Global</span>
                    <span style="font-size: 1.75rem; font-weight: 800; color: var(--success);">${o.toLocaleString()} FCFA</span>
                </div>
                <div class="stat-card" style="border-top: 4px solid var(--primary); background: var(--bg-card); padding: 1.25rem; border-radius: 16px; box-shadow: var(--shadow);">
                    <span style="color: var(--text-secondary); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 0.5rem;">📦 Total Commandes</span>
                    <span style="font-size: 1.75rem; font-weight: 800; color: var(--text-primary);">${n.length}</span>
                </div>
                <div class="stat-card" style="border-top: 4px solid var(--accent); background: var(--bg-card); padding: 1.25rem; border-radius: 16px; box-shadow: var(--shadow);">
                    <span style="color: var(--text-secondary); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 0.5rem;">⏳ En Attente</span>
                    <span style="font-size: 1.75rem; font-weight: 800; color: var(--accent);">${a.length}</span>
                </div>
                <div class="stat-card" style="border-top: 4px solid var(--danger); background: var(--bg-card); padding: 1.25rem; border-radius: 16px; box-shadow: var(--shadow);">
                    <span style="color: var(--text-secondary); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 0.5rem;">❌ Annulées</span>
                    <span style="font-size: 1.75rem; font-weight: 800; color: var(--danger);">${i.length}</span>
                </div>
            </div>
            
            <h3 style="font-size: 1.2rem; margin-bottom: 1rem; color: var(--text-primary);">📊 Revenus par Restaurant</h3>
            <div class="table-responsive" style="margin-bottom: 2rem;">
                <table class="admin-table" style="width: 100%;">
                    <thead><tr><th style="padding: 0.75rem;">Restaurant</th><th style="padding: 0.75rem;">Commandes Livrées</th><th style="padding: 0.75rem;">C.A. Généré</th></tr></thead>
                    <tbody>${c}</tbody>
                </table>
            </div>

            <h3 style="font-size: 1.2rem; margin-bottom: 1rem; color: var(--text-primary);">📋 Historique de toutes les Commandes</h3>
            <div class="table-responsive">
                <table class="admin-table" style="width: 100%;">
                    <thead><tr><th style="padding: 0.6rem;">N°</th><th style="padding: 0.6rem;">Restaurant</th><th style="padding: 0.6rem;">Client</th><th style="padding: 0.6rem;">Date</th><th style="padding: 0.6rem;">Statut</th><th style="padding: 0.6rem;">Montant</th></tr></thead>
                    <tbody>${l}</tbody>
                </table>
            </div>
        `}}function ge(e){e.preventDefault();let t=document.getElementById(`adm-reg-name`).value.trim(),n=document.getElementById(`adm-reg-address`).value.trim(),r=document.getElementById(`adm-reg-category`).value,i=cleanPhoneNumber(document.getElementById(`adm-reg-whatsapp`).value.trim()),a=document.getElementById(`adm-reg-open`).value,o=document.getElementById(`adm-reg-close`).value,s=document.getElementById(`adm-reg-username`).value.trim().toLowerCase(),c=document.getElementById(`adm-reg-password`).value;if(!/^\+221(70|75|76|77|78)\d{7}$/.test(i.replace(/\s+/g,``))){showToast(`Numéro WhatsApp invalide (ex: +221 77 XXX XX XX)`,`danger`);return}if(store.getRestaurants().find(e=>e.username===s||e.slug===s)){showToast(`Cet identifiant est déjà utilisé`,`danger`);return}let l={id:`r`+(store.getRestaurants().length+1),name:t,slug:s.replace(/[^a-z0-9]/g,`-`),rating:5,reviewsCount:0,category:r,address:n,whatsapp:i,openHours:`${a} - ${o}`,closedDays:[],isOpenManual:!0,status:`active`,username:s,password:c,menu:[],reviews:[]};store.addRestaurant(l),showToast(`Restaurant "${t}" ajouté avec succès dans le réseau !`,`success`),me(`active`)}function _e(e){let t=store.getRestaurantById(e);if(!t)return;store.updateRestaurant(e,{status:`active`}),showToast(`Restaurant ${t.name} activé avec succès !`,`success`);let n=`Bonjour ${t.name}, nous avons le plaisir de vous informer que votre inscription sur THIES Resto a été validée par notre équipe ! 🥳

Vous pouvez dès à présent vous connecter à votre Tableau de Bord avec vos identifiants pour gérer vos plats du jour, commandes et réservations.

Lien d'accès : ${window.location.origin}${window.location.pathname}#/auth

Bienvenue dans le réseau !`,r=`https://wa.me/${t.whatsapp.replace(/\+/g,``)}?text=${encodeURIComponent(n)}`;S(),window.open(r,`_blank`)}function ve(e){let t=store.getRestaurantById(e);t&&confirm(`Voulez-vous rejeter et supprimer définitivement la demande de "${t.name}" ?`)&&(store.deleteRestaurant(e),showToast(`Demande supprimée`,`info`),S())}function ye(e){let t=store.getRestaurantById(e);t&&(store.updateRestaurant(e,{status:`suspended`}),showToast(`Restaurant ${t.name} suspendu temporairement`,`warning`),S())}function be(e){let t=store.getRestaurantById(e);t&&(store.updateRestaurant(e,{status:`active`}),showToast(`Restaurant ${t.name} réactivé`,`success`),S())}window.updateRestaurantPack=function(e,t){let n=store.getRestaurantById(e);if(!n)return;let r=n.status===`suspended`&&t!==`Aucun (Gratuit)`?`active`:n.status;store.updateRestaurant(e,{subscriptionPack:t,status:r}),showToast(`Pack ${t} attribué à ${n.name}`,`success`),S()};function xe(e){let t=store.getRestaurantById(e);t&&(currentRestaurantSession=t,sessionStorage.setItem(`restaurantSession`,JSON.stringify(t)),showToast(`Session administrateur activée pour "${t.name}"`,`success`),router.navigate(`/dashboard`))}function Se(){currentRestaurantSession=null,sessionStorage.removeItem(`restaurantSession`),showToast(`Retour à la console Super-Admin`,`info`),router.navigate(`/admin`)}function Ce(){let e=store.getRestaurantById(currentRestaurantSession.id);if(!e)return;let t=store.getOrdersByRestaurant(e.id);if(t.length===0){showToast(`Aucune commande à exporter`,`warning`);return}let n=`﻿`;n+=`ID Commande;Date;Heure;Client;Telephone;Mode de Recuperation;Total (FCFA);Statut;Plats;Note
`,t.forEach(e=>{let t=e.items.map(e=>`${e.name} (x${e.qty})`).join(`, `),r=e.customerName.replace(/"/g,`""`),i=e.customerPhone,a=(e.note||``).replace(/"/g,`""`).replace(/\n/g,` `),o=[e.id,e.date,e.time,`"${r}"`,`"${i}"`,e.mode,e.total,e.status,`"${t.replace(/"/g,`""`)}"`,`"${a}"`].join(`;`);n+=o+`
`});let r=new Blob([n],{type:`text/csv;charset=utf-8;`}),i=URL.createObjectURL(r),a=document.createElement(`a`);a.setAttribute(`href`,i),a.setAttribute(`download`,`commandes_${e.slug}_${new Date().toISOString().split(`T`)[0]}.csv`),document.body.appendChild(a),a.click(),document.body.removeChild(a),showToast(`Fichier CSV des commandes téléchargé !`,`success`)}function we(){let e=store.getRestaurantById(currentRestaurantSession.id);if(!e)return;let t=store.getReservationsByRestaurant(e.id);if(t.length===0){showToast(`Aucune réservation à exporter`,`warning`);return}let n=`﻿`;n+=`ID Reservation;Date;Heure;Client;Telephone;Couverts;Statut;Note
`,t.forEach(e=>{let t=e.customerName.replace(/"/g,`""`),r=e.customerPhone,i=(e.note||``).replace(/"/g,`""`).replace(/\n/g,` `),a=[e.id,e.date,e.time,`"${t}"`,`"${r}"`,e.guests,e.status,`"${i}"`].join(`;`);n+=a+`
`});let r=new Blob([n],{type:`text/csv;charset=utf-8;`}),i=URL.createObjectURL(r),a=document.createElement(`a`);a.setAttribute(`href`,i),a.setAttribute(`download`,`reservations_${e.slug}_${new Date().toISOString().split(`T`)[0]}.csv`),document.body.appendChild(a),a.click(),document.body.removeChild(a),showToast(`Fichier CSV des réservations téléchargé !`,`success`)}window.renderDashboardShell=v,window.switchDashboardTab=y,window.renderDashboardTabContent=b,window.changeOrderStatus=ee,window.changeReservationStatus=te,window.toggleManualReservationForm=ne,window.saveManualReservation=re,window.filterOrdersDashboard=ie,window.deleteDish=ae,window.openEditDishForm=oe,window.resetDishForm=se,window.saveDish=ce,window.toggleStoreOpenStatus=le,window.saveProfileSettings=ue,window.openReplyForm=de,window.closeReplyForm=fe,window.submitReply=pe,window.renderAdminView=S,window.switchAdminTab=me,window.renderAdminTabTable=he,window.handleAdminCreateRestaurant=ge,window.approveRestaurant=_e,window.rejectRestaurant=ve,window.suspendRestaurant=ye,window.reactivateRestaurant=be,window.impersonateRestaurant=xe,window.exitImpersonation=Se,window.exportOrdersToCSV=Ce,window.exportReservationsToCSV=we,window.dashboardActiveTab=h,window.currentOrderStatusFilter=g,window.currentAccountingFilter=_,window.adminActiveTab=x,window.renderDashboardShell=v,window.switchDashboardTab=y,window.renderDashboardTabContent=b,window.changeOrderStatus=ee,window.changeReservationStatus=te,window.toggleManualReservationForm=ne,window.saveManualReservation=re,window.filterOrdersDashboard=ie,window.deleteDish=ae,window.openEditDishForm=oe,window.resetDishForm=se,window.saveDish=ce,window.toggleStoreOpenStatus=le,window.saveProfileSettings=ue,window.openReplyForm=de,window.closeReplyForm=fe,window.submitReply=pe,window.renderAdminView=S,window.switchAdminTab=me,window.renderAdminTabTable=he,window.handleAdminCreateRestaurant=ge,window.approveRestaurant=_e,window.rejectRestaurant=ve,window.suspendRestaurant=ye,window.reactivateRestaurant=be,window.impersonateRestaurant=xe,window.exitImpersonation=Se,window.exportOrdersToCSV=Ce,window.exportReservationsToCSV=we,window.dashboardActiveTab=h,window.currentOrderStatusFilter=g,window.currentAccountingFilter=_,window.adminActiveTab=x,window.renderDashboardShell=v,window.switchDashboardTab=y,window.renderDashboardTabContent=b,window.changeOrderStatus=ee,window.changeReservationStatus=te,window.toggleManualReservationForm=ne,window.saveManualReservation=re,window.filterOrdersDashboard=ie,window.deleteDish=ae,window.openEditDishForm=oe,window.resetDishForm=se,window.saveDish=ce,window.toggleStoreOpenStatus=le,window.saveProfileSettings=ue,window.openReplyForm=de,window.closeReplyForm=fe,window.submitReply=pe,window.renderAdminView=S,window.switchAdminTab=me,window.renderAdminTabTable=he,window.handleAdminCreateRestaurant=ge,window.approveRestaurant=_e,window.rejectRestaurant=ve,window.suspendRestaurant=ye,window.reactivateRestaurant=be,window.impersonateRestaurant=xe,window.exitImpersonation=Se,window.exportOrdersToCSV=Ce,window.exportReservationsToCSV=we,window.dashboardActiveTab=h,window.currentOrderStatusFilter=g,window.currentAccountingFilter=_,window.adminActiveTab=x;function Te(e){let t=document.getElementById(`checkout-content-container`);if(cart.items.length===0){t.innerHTML=`
            <div style="text-align: center; padding: 4rem 1rem;">
                <span style="font-size: 3rem;">🛒</span>
                <h3 style="margin-top: 1rem;">Votre panier est vide</h3>
                <p style="color: var(--text-secondary); margin: 0.5rem 0 1.5rem 0;">Parcourez notre menu du jour et ajoutez des délices !</p>
                <button class="btn btn-primary" onclick="switchRestoTab('menu')">Voir le Menu</button>
            </div>
        `;return}let n=``;cart.items.forEach(e=>{n+=`
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-title">${e.name}</div>
                    <div class="cart-item-price">${e.price} FCFA</div>
                </div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="updateCartQty('${e.id}', -1)">-</button>
                    <span class="qty-val">${e.qty}</span>
                    <button class="qty-btn" onclick="updateCartQty('${e.id}', 1)">+</button>
                </div>
            </div>
        `});let r=``;r=cart.loyaltyApplied?`
            <div class="cart-total-box" style="flex-direction: column; align-items: flex-end; gap: 0.25rem;">
                <div style="font-size: 0.9rem; color: var(--text-secondary);">Sous-total : ${cart.subtotal} FCFA</div>
                <div style="font-size: 0.9rem; color: var(--success); font-weight: bold; display: flex; align-items: center; gap: 0.5rem;">
                    <span>🎁 Réduction Fidélité : -2,500 FCFA</span>
                    <button type="button" class="btn btn-link btn-xs" onclick="removeLoyaltyReward()" style="padding: 0; color: #ff6b6b; text-decoration: underline; font-size: 0.75rem;">Retirer</button>
                </div>
                <div style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin-top: 0.25rem;">Total à payer : <span class="cart-total-price">${cart.total} FCFA</span></div>
            </div>
        `:`
            <div class="cart-total-box">
                <span>Total à payer :</span>
                <span class="cart-total-price">${cart.total} FCFA</span>
            </div>
        `,t.innerHTML=`
        <h2 style="font-size: 1.25rem; margin-bottom: 1rem;">Votre Commande</h2>
        <div class="cart-list">
            ${n}
        </div>
        
        ${r}
        
        <form id="checkout-form" onsubmit="submitSimpleOrder(event, '${e.id}')" style="background: var(--bg-card); padding: 1.5rem; border-radius: 20px; border: 1px solid var(--border);">
            <h3 style="font-size: 1.1rem; margin-bottom: 1.25rem;">Informations de Livraison / Récupération</h3>
            
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Prénom <span class="required">*</span></label>
                    <input type="text" id="order-firstname" class="form-control" placeholder="Awa" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Nom <span class="required">*</span></label>
                    <input type="text" id="order-lastname" class="form-control" placeholder="Diop" required>
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">Numéro WhatsApp <span class="required">*</span></label>
                <input type="tel" id="order-phone" class="form-control" placeholder="+221 77 123 45 67" required>
            </div>
            
            <div class="form-group">
                <label class="form-label">Mode de Récupération <span class="required">*</span></label>
                <div class="delivery-options">
                    <label class="delivery-radio-card">
                        <input type="radio" name="order-mode" value="Sur place" onchange="toggleAddressField(false)">
                        <div class="delivery-card-content">
                            <span class="delivery-icon">🍽️</span>
                            <span>Sur Place</span>
                        </div>
                    </label>
                    <label class="delivery-radio-card">
                        <input type="radio" name="order-mode" value="A emporter" checked onchange="toggleAddressField(false)">
                        <div class="delivery-card-content">
                            <span class="delivery-icon">🛍️</span>
                            <span>A Emporter</span>
                        </div>
                    </label>
                    <label class="delivery-radio-card">
                        <input type="radio" name="order-mode" value="Livraison" onchange="toggleAddressField(true)">
                        <div class="delivery-card-content">
                            <span class="delivery-icon">🛵</span>
                            <span>Livraison</span>
                        </div>
                    </label>
                </div>
            </div>
            
                        <div class="form-group" id="delivery-address-group" style="display: none;">
                <label class="form-label">Pointer votre position sur la carte <span class="required">*</span></label>
                <div id="delivery-map" style="height: 200px; width: 100%; border-radius: 12px; margin-bottom: 1rem; border: 1px solid var(--border);"></div>
                <div id="delivery-fee-display" style="font-weight: bold; color: var(--primary); margin-bottom: 1rem; display: none;">Frais de livraison : <span id="fee-val">0</span> FCFA</div>
                
                <label class="form-label">Adresse Détaillée (Optionnel)</label>
                <input type="text" id="order-address" class="form-control" placeholder="Indication supplémentaire...">
            </div>
            
                        <div class="form-group">
                <label class="form-label">Notes Spéciales / Allergies (Optionnel)</label>
                <textarea id="order-notes" class="form-control" placeholder="Sans piment, sauce à part..."></textarea>
            </div>
            
            <div class="form-group" style="margin-top: 1rem;">
                <label style="display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.85rem; color: var(--text-secondary); cursor: pointer;">
                    <input type="checkbox" id="order-gdpr" required style="margin-top: 0.2rem;">
                    <span>J'accepte que mes données (nom, téléphone) soient transmises au restaurateur pour le traitement de ma commande.</span>
                </label>
            </div>
            
            <button type="submit" class="btn btn-primary btn-block">
                Envoyer ma commande au restaurant 🛵
            </button>
        </form>
    `}var C=null,w=null;function Ee(e){let t=document.getElementById(`delivery-address-group`);e?(t.style.display=`block`,setTimeout(()=>{if(C)C.invalidateSize();else{C=L.map(`delivery-map`).setView([14.7928,-16.926],13),L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`,{attribution:`© OpenStreetMap contributors`}).addTo(C);let e=store.getRestaurantById(cart.restaurantId),t=e.lat||14.7928,n=e.lng||-16.926;L.marker([t,n]).addTo(C).bindPopup(e.name).openPopup(),w=L.marker([14.7928,-16.926],{draggable:!0}).addTo(C),w.on(`dragend`,function(e){let r=w.getLatLng();cart.deliveryLat=r.lat,cart.deliveryLng=r.lng;let i=calculateDistance(t,n,r.lat,r.lng);i>10&&typeof showToast==`function`&&showToast(`Attention: Vous êtes à plus de 10km du restaurant.`,`warning`);let a=Math.floor(i*200);a=Math.min(a,1500),cart.deliveryFee=a,document.getElementById(`delivery-fee-display`).style.display=`block`,document.getElementById(`fee-val`).innerText=a,recalculateCart(),document.querySelectorAll(`.cart-total-price`).forEach(e=>e.innerText=cart.total+` FCFA`)});let r=L.Control.extend({options:{position:`topright`},onAdd:function(){let e=L.DomUtil.create(`button`,`leaflet-bar leaflet-control`);return e.innerHTML=`📍 Me localiser`,e.style.backgroundColor=`white`,e.style.padding=`5px 10px`,e.style.cursor=`pointer`,e.style.fontWeight=`bold`,e.style.border=`2px solid rgba(0,0,0,0.2)`,e.style.borderRadius=`4px`,e.style.color=`var(--primary, #d35400)`,e.onclick=function(t){t.preventDefault(),navigator.geolocation&&(e.innerHTML=`⏳...`,navigator.geolocation.getCurrentPosition(t=>{let n=t.coords.latitude,r=t.coords.longitude;C.setView([n,r],15),w.setLatLng([n,r]),w.fire(`dragend`),e.innerHTML=`📍 Me localiser`,navigator.vibrate&&navigator.vibrate(50)},t=>{typeof showToast==`function`&&showToast(`Géolocalisation refusée ou impossible.`,`error`),e.innerHTML=`📍 Me localiser`}))},e}});C.addControl(new r)}},100)):(t.style.display=`none`,cart.deliveryFee=0,document.getElementById(`delivery-fee-display`).style.display=`none`,recalculateCart(),document.querySelectorAll(`.cart-total-price`).forEach(e=>e.innerText=cart.total+` FCFA`))}function De(){let e=Date.now(),t=JSON.parse(localStorage.getItem(`thies_order_timestamps`)||`[]`);return t=t.filter(t=>e-t<36e5),t.length>=3?(typeof showToast==`function`&&showToast(`Limite anti-spam atteinte : maximum 3 envois par heure. Veuillez patienter.`,`danger`),!1):(t.push(e),localStorage.setItem(`thies_order_timestamps`,JSON.stringify(t)),!0)}function Oe(e,t){if(e.preventDefault(),!De())return;let n=store.getRestaurantById(t),r=document.getElementById(`order-firstname`).value.trim(),i=document.getElementById(`order-lastname`).value.trim(),a=cleanPhoneNumber(document.getElementById(`order-phone`).value.trim()),o=document.querySelector(`input[name="order-mode"]:checked`).value,s=document.getElementById(`order-address`).value.trim(),c=document.getElementById(`order-notes`).value.trim();if(!/^\+221(70|75|76|77|78)\d{7}$/.test(a.replace(/\s+/g,``))){showToast(`Numéro de téléphone sénégalais invalide (ex: +221 77 XXX XX XX)`,`danger`);return}let l=`ORD-`+Math.floor(1e3+Math.random()*9e3),u=new Date().toISOString().split(`T`)[0],d=new Date().toLocaleTimeString(`fr-FR`,{hour:`2-digit`,minute:`2-digit`}),f=c;cart.loyaltyApplied&&(f=`${c?c+` | `:``}[RÉCOMPENSE FIDÉLITÉ APPLIQUÉE : -2,500 FCFA]`);let p={id:l,restaurantId:n.id,customerName:`${r} ${i}`,customerPhone:a,mode:o,address:s,items:cart.items.map(e=>({name:e.name,price:e.price,qty:e.qty})),total:cart.total,note:f,status:`Reçue`,date:u,time:d,deliveryFee:cart.deliveryFee||0,deliveryLat:cart.deliveryLat||null,deliveryLng:cart.deliveryLng||null,loyaltyApplied:cart.loyaltyApplied||!1};if(window.pendingOrderContext={order:p,r:n,firstname:r,lastname:i,mode:o,phone:a},localStorage.getItem(`phoneVerified_`+a)===`true`){executePendingOrder();return}let m=document.getElementById(`checkout-content-container`);m.innerHTML=`
        <div class="confirmation-screen">
            <div class="spinner-ring" style="width:40px;height:40px;border-width:4px;margin: 0 auto 1rem;"></div>
            <h2>Génération du code de sécurité...</h2>
            <p style="color: var(--text-secondary);">Envoi d'un code OTP sécurisé au <strong>${a}</strong></p>
        </div>
    `,window.verifyOtpAndSubmitOrder=async function(){let e=document.getElementById(`otp-input-code`).value.trim();if(!e||e.length<6){typeof showToast==`function`&&showToast(`Veuillez entrer le code à 6 chiffres`,`warning`);return}let t=document.getElementById(`btn-verify-otp`);t.disabled=!0,t.innerHTML=`<div class="spinner-ring" style="width:20px;height:20px;border-width:2px;display:inline-block;vertical-align:middle;margin-right:0.5rem;"></div> Vérification...`;let{phone:n}=window.pendingOrderContext;await store.verifyOtp(n,e)?(localStorage.setItem(`phoneVerified_`+n,`true`),t.innerHTML=`✅ Code Valide !`,executePendingOrder()):(typeof showToast==`function`&&showToast(`Code de sécurité incorrect ou expiré.`,`danger`),t.innerHTML=`✅ Vérifier et Commander`,t.disabled=!1)},(async()=>{await store.generateOtp(a)?(typeof showToast==`function`&&showToast(`Code de sécurité SMS envoyé !`,`info`),m.innerHTML=`
                <div class="confirmation-screen" style="max-width: 400px; margin: 2rem auto 0; background: var(--bg-card); padding: 2rem; border-radius: 20px; box-shadow: var(--shadow); border: 1px solid var(--border);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📱</div>
                    <h2>Vérification SMS</h2>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Veuillez entrer le code de sécurité reçu par SMS au <strong>${a}</strong>.</p>
                    
                    <div class="form-group">
                        <input type="text" id="otp-input-code" class="form-control" placeholder="Ex: 839102" style="font-size: 1.5rem; letter-spacing: 5px; text-align: center; font-weight: bold; margin-bottom: 1rem;" maxlength="6">
                    </div>
                    
                    <button class="btn btn-primary" onclick="verifyOtpAndSubmitOrder()" style="width: 100%; margin-bottom: 1rem;" id="btn-verify-otp">
                        ✅ Vérifier et Commander
                    </button>
                    
                    <button class="btn btn-secondary" onclick="router.navigate('/')" style="width: 100%;">
                        Annuler
                    </button>
                </div>
            `):(typeof showToast==`function`&&showToast(`Impossible d'envoyer le SMS. Format de numéro incorrect ?`,`danger`),m.innerHTML=`
                <div class="confirmation-screen" style="max-width: 400px; margin: 2rem auto 0; background: var(--bg-card); padding: 2rem; border-radius: 20px; box-shadow: var(--shadow); border: 1px solid var(--border);">
                    <div style="font-size: 3rem; color: var(--danger); margin-bottom: 1rem;">⚠️</div>
                    <h2>Échec de l'envoi</h2>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Nous n'avons pas pu valider votre numéro <strong>${a}</strong>.</p>
                    <button class="btn btn-secondary" onclick="router.navigate('/')" style="width: 100%;">
                        Retour à l'accueil
                    </button>
                </div>
            `)})()}window.executePendingOrder=async function(){if(!window.pendingOrderContext)return;let{order:e,r:t,firstname:n,lastname:r,mode:i,phone:a}=window.pendingOrderContext,o=document.getElementById(`checkout-content-container`);o.innerHTML=`
        <div style="text-align: center; padding: 3rem 1rem;">
            <div class="spinner" style="border: 4px solid var(--border); border-top: 4px solid var(--primary); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
            <p style="color: var(--text-primary); font-weight: 500;">Sécurisation et validation de votre commande...</p>
        </div>
    `;try{let s={restaurant_id:e.restaurantId,customer_name:e.customerName,customer_phone:e.customerPhone,order_type:e.mode,delivery_fee:e.deliveryFee,items:cart.items.map(e=>({menu_item_id:e.id,quantity:e.qty}))},c;if(typeof store.createSecureOrder==`function`&&(c=await store.createSecureOrder(s)),c)e.id=c.order_id,e.total=c.total_price,store.addOrder(e);else throw Error(`Impossible de sécuriser la commande sur nos serveurs.`);saveOrderToHistory(e,t.name),cart.loyaltyApplied&&cart.loyaltyPhone&&store.applyLoyaltyRewardUsed(cart.loyaltyPhone,`${n} ${r}`),cart={restaurantId:null,items:[],total:0,loyaltyApplied:!1,loyaltyPhone:null,deliveryFee:0,deliveryLat:null,deliveryLng:null},saveCart(),typeof updateFloatingCartBar==`function`&&updateFloatingCartBar(t),typeof triggerCelebration==`function`&&triggerCelebration();let l=window.pendingOrderContext.order.items.map(e=>`${e.qty}x ${e.name}`).join(`, `),u=`Bonjour ${t.name}, voici ma commande officielle n°*${c.order_id}* sur THIES Resto.\n\n👤 *Client* : ${n} ${r} (${a})\n🍽️ *Plats* : ${l}\n🛵 *Mode* : ${i}\n${e.address?`📍 *Adresse* : ${e.address}\n`:``}💰 *Total Sécurisé* : ${c.total_price} FCFA\n\nMerci de confirmer la réception !`,d=`https://wa.me/${t.whatsapp.replace(/\+/g,``)}?text=${encodeURIComponent(u)}`;o.innerHTML=DOMPurify.sanitize(`
            <div class="confirmation-screen">
                <div class="confirmation-icon">🛡️✅</div>
                <h2>Commande Sécurisée !</h2>
                <p style="color: var(--text-secondary); margin: 1rem 0;">Votre commande n° <strong>${c.order_id}</strong> a été validée par nos serveurs.</p>
                <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 12px; font-size: 0.9rem; text-align: left; margin: 1.5rem 0; border: 1px solid var(--border);">
                    <strong>Récapitulatif Officiel :</strong><br>
                    Client : ${n} ${r}<br>
                    Mode : ${i}<br>
                    Montant certifié : <strong style="color: var(--primary);">${c.total_price} FCFA</strong>
                </div>
                
                <div style="background: rgba(16, 185, 129, 0.1); padding: 1rem; border-radius: 12px; margin: 1.5rem 0; border: 1px solid rgba(16, 185, 129, 0.3); text-align: center;">
                    <p style="color: var(--success); font-weight: 500; font-size: 0.95rem; margin-bottom: 1rem;">Dernière étape : envoyez ce récapitulatif certifié au restaurant pour déclencher la préparation !</p>
                    <a href="${d}" target="_blank" class="btn btn-success" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <i class="ri-whatsapp-line" style="font-size: 1.2rem;"></i> Confirmer par WhatsApp
                    </a>
                </div>

                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                    <button class="btn btn-dark" onclick="router.navigate('/')">
                        Retourner à l'accueil
                    </button>
                </div>
            </div>
        `)}catch(e){console.error(`Order error`,e),o.innerHTML=`
            <div style="text-align: center; padding: 3rem 1rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">❌</div>
                <h3 style="color: var(--danger);">Erreur de sécurisation</h3>
                <p style="color: var(--text-secondary);">Impossible de valider votre commande. Veuillez réessayer.</p>
                <button class="btn btn-primary" onclick="window.executePendingOrder()" style="margin-top: 1rem;">Réessayer</button>
            </div>
        `}},window.renderCheckoutTab=Te,window.toggleAddressField=Ee,window.checkOrderRateLimit=De,window.submitSimpleOrder=Oe,window.deliveryMap=C,window.deliveryMarker=w,window.currentVendorSession=null,window.renderVendorLogin=function(e){let t=document.getElementById(`main-content`),n=store.data.restaurants.find(t=>t.slug===e);t.innerHTML=`
        <div style="max-width: 400px; margin: 4rem auto; padding: 2rem; background: var(--bg-card); border-radius: 20px; border: 1px solid var(--border); box-shadow: var(--shadow);">
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">👨‍🍳</div>
                <h2>Espace Restaurateur</h2>
                <p style="color: var(--text-secondary); margin-top: 0.5rem;">Connexion pour <strong>${n?n.name:`Restaurant`}</strong></p>
            </div>
            
            <div class="form-group" style="margin-bottom: 1.5rem;">
                <label class="form-label" style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">Code PIN Secret</label>
                <input type="password" id="vendor-pin" class="form-control" placeholder="****" style="text-align: center; font-size: 1.5rem; letter-spacing: 0.5rem; padding: 1rem;" maxlength="6">
            </div>
            
            <button class="btn btn-primary" style="width: 100%; padding: 1rem; font-size: 1.1rem;" onclick="window.submitVendorLogin('${e}')">
                Se Connecter
            </button>
            <p id="vendor-login-error" style="color: var(--danger); text-align: center; margin-top: 1rem; display: none;">PIN incorrect.</p>
        </div>
    `},window.submitVendorLogin=async function(e){let t=document.getElementById(`vendor-pin`).value;if(!t)return;let n=document.getElementById(`vendor-login-error`);n.style.display=`none`,showLoadingOverlay(`Vérification...`);try{let r=await store.vendorLogin(e,t);hideLoadingOverlay(),r?(window.currentVendorSession={...r,pin:t},showToast(`Connexion réussie !`,`success`),window.renderVendorDashboard()):(n.textContent=`PIN incorrect.`,n.style.display=`block`)}catch(e){hideLoadingOverlay(),e.rateLimited?(n.innerHTML=`🔒 <strong>Compte temporairement bloqué</strong><br><span style="font-size: 0.85rem;">Trop de tentatives. Réessayez dans 15 minutes.</span>`,n.style.display=`block`,n.style.background=`rgba(255,0,0,0.08)`,n.style.padding=`1rem`,n.style.borderRadius=`12px`,showToast(`Compte bloqué — trop de tentatives`,`danger`)):(n.textContent=`Erreur de connexion.`,n.style.display=`block`)}},window.renderVendorDashboard=async function(){if(!window.currentVendorSession){router.navigate(`/`);return}let e=window.currentVendorSession;showLoadingOverlay(`Chargement de votre carte...`);let t=await store.fetchMenuForRestaurant(e.id);hideLoadingOverlay();let n=document.getElementById(`main-content`),r=e.is_open_manual,i=r?`var(--success)`:`var(--danger)`,a=r?`OUVERT`:`FERMÉ`,o=``;t.length===0?o=`<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">Aucun plat trouvé.</p>`:t.forEach(e=>{o+=`
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 12px; margin-bottom: 0.75rem;">
                    <div style="flex: 1; min-width: 0;">
                        <h4 style="margin: 0; color: var(--text-primary); font-size: 1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${e.name}</h4>
                        <div style="display: flex; gap: 1rem; margin-top: 0.5rem; align-items: center;">
                            <input type="number" id="price-${e.id}" value="${e.price}" style="width: 100px; padding: 0.4rem; background: var(--bg-input); border: 1px solid var(--border); color: var(--text-primary); border-radius: 6px;">
                            <span style="color: var(--text-secondary); font-size: 0.9rem;">FCFA</span>
                        </div>
                    </div>
                    
                    <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem;">
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                            <input type="checkbox" id="avail-${e.id}" ${e.available?`checked`:``}>
                            <span style="font-size: 0.85rem; color: ${e.available?`var(--success)`:`var(--danger)`};">${e.available?`En stock`:`Rupture`}</span>
                        </label>
                        <button class="btn btn-primary btn-sm" onclick="window.saveVendorMenuItem('${e.id}')" style="padding: 0.3rem 0.75rem; font-size: 0.8rem;">Enregistrer</button>
                    </div>
                </div>
            `}),n.innerHTML=`
        <div style="max-width: 800px; margin: 2rem auto; padding: 0 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
                <h2>Tableau de Bord - <span style="color: var(--primary);">${e.name}</span></h2>
                <button class="btn btn-secondary btn-sm" onclick="window.vendorLogout()">Déconnexion</button>
            </div>
            
            <div style="background: var(--bg-card); padding: 1.5rem; border-radius: 16px; border: 1px solid var(--border); margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h3 style="margin: 0 0 0.5rem 0;">Statut du restaurant</h3>
                    <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Ouvrez ou fermez manuellement votre restaurant.</p>
                </div>
                <button id="vendor-status-btn" class="btn" style="background: ${i}; color: white; width: 120px;" onclick="window.toggleVendorStatus()">
                    ${a}
                </button>
            </div>
            
            <div style="background: var(--bg-card); padding: 1.5rem; border-radius: 16px; border: 1px solid var(--border);">
                <h3 style="margin: 0 0 1.5rem 0; border-bottom: 1px solid var(--border); padding-bottom: 1rem;">Gestion de la Carte</h3>
                ${o}
            </div>
        </div>
    `},window.saveVendorMenuItem=async function(e){let t=window.currentVendorSession;if(!t)return;let n=document.getElementById(`price-${e}`),r=document.getElementById(`avail-${e}`),i=parseFloat(n.value),a=r.checked;if(isNaN(i)||i<0){showToast(`Prix invalide`,`danger`);return}if(await store.vendorUpdateMenuItem(t.id,t.pin,e,i,a)){showToast(`Plat mis à jour !`,`success`);let e=r.nextElementSibling;e.innerText=a?`En stock`:`Rupture`,e.style.color=a?`var(--success)`:`var(--danger)`}else showToast(`Erreur lors de la mise à jour`,`danger`)},window.toggleVendorStatus=async function(){let e=window.currentVendorSession;if(!e)return;let t=!e.is_open_manual;if(await store.vendorUpdateStatus(e.id,e.pin,t)){e.is_open_manual=t;let n=document.getElementById(`vendor-status-btn`);n.style.background=t?`var(--success)`:`var(--danger)`,n.innerText=t?`OUVERT`:`FERMÉ`,showToast(`Restaurant ${t?`ouvert`:`fermé`} !`,`success`)}else showToast(`Erreur lors du changement de statut`,`danger`)},window.vendorLogout=function(){window.currentVendorSession=null,router.navigate(`/`),showToast(`Déconnecté`,`info`)};var ke=class{constructor(){this.sessionStart=Date.now(),this.navigationPath=[],this.events=[],this.initTracking()}initTracking(){if(this.trackPageView(window.location.hash||`/`),typeof router<`u`&&router.navigate){let e=router.navigate;router.navigate=t=>(this.trackPageView(t),e.call(router,t))}document.addEventListener(`click`,e=>{let t=e.target.closest(`.restaurant-card`);if(t){let e=t.querySelector(`h3`)?t.querySelector(`h3`).innerText:`Restaurant`;this.logEvent(`CLICK_RESTAURANT`,e)}})}trackPageView(e){let t=this.navigationPath.length>0?Math.round((Date.now()-this.navigationPath[this.navigationPath.length-1].timestamp)/1e3):0;this.navigationPath.push({path:e,timestamp:Date.now(),timeSpentPrevious:t})}logEvent(e,t){this.events.push({event:e,details:t,timeSinceStart:Math.round((Date.now()-this.sessionStart)/1e3)})}getBehaviorReport(){return`Temps total: ${Math.round((Date.now()-this.sessionStart)/1e3)}s. Parcours: ${this.navigationPath.map(e=>e.path).join(` -> `)}`}};function T(){try{sessionStorage.removeItem(`resto_session`)}catch{}typeof currentRestaurantSession<`u`&&(currentRestaurantSession=null),typeof B==`function`&&B(`Déconnexion réussie`,`success`),typeof router<`u`&&router.navigate(`/auth`)}router.add(`#/auth`,()=>{document.getElementById(`floating-cart-bar`).style.display=`none`,R();let e=document.getElementById(`main-content`);e.innerHTML=`
        <div class="auth-container" style="max-width: 450px; margin: 3rem auto; padding: 2rem; background: var(--bg-card); border-radius: 24px; border: 1px solid var(--border); box-shadow: var(--shadow);">
            <div class="auth-header" style="text-align: center; margin-bottom: 2rem;">
                <span class="auth-logo" style="font-size: 3rem; display: block; margin-bottom: 1rem;">🏪</span>
                <h2 style="font-family: var(--font-serif); font-size: 1.75rem; color: var(--text-primary);">Espace Partenaire</h2>
                <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.5rem;">Connectez-vous à votre tableau de bord restaurant.</p>
            </div>

            <!-- LOGIN FORM -->
            <form id="login-form" onsubmit="handleRestaurantLogin(event)">
                <div class="form-group" style="margin-bottom: 1.25rem;">
                    <label class="form-label">Identifiant unique (slug)</label>
                    <input type="text" id="login-username" class="form-control" placeholder="la-licorne" required>
                </div>
                <div class="form-group" style="margin-bottom: 0.5rem;">
                    <label class="form-label">Mot de passe</label>
                    <input type="password" id="login-password" class="form-control" placeholder="••••••••" required>
                </div>
                <div style="text-align: right; margin-bottom: 1.5rem;">
                    <button type="button" onclick="handleForgotPassword()" style="background: none; border: none; color: var(--accent); font-size: 0.8rem; cursor: pointer; padding: 0; text-decoration: underline;">🔑 Mot de passe oublié ?</button>
                </div>
                <button type="submit" class="btn btn-primary btn-block" style="font-weight: 700; width: 100%;">Se connecter 🔓</button>
            </form>

            <!-- PARTNERSHIP CTA -->
            <div style="text-align: center; margin-top: 1.5rem; border-top: 1px solid var(--border); padding-top: 1.5rem;">
                <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 0.75rem;">Vous souhaitez rejoindre le réseau THIES Resto ?</p>
                <button class="btn btn-secondary btn-block" onclick="router.navigate('/partnership')" style="width: 100%; font-weight: 700;">Demander un Partenariat 🤝</button>
            </div>
        </div>
    `});function Ae(){let e=document.getElementById(`login-username`)?document.getElementById(`login-username`).value.trim():``,t=e?`Bonjour, j'ai oublié mon mot de passe pour mon espace restaurant THIES Resto. Mon identifiant est : *${e}*. Pouvez-vous m'aider à le récupérer ?`:`Bonjour, j'ai oublié mon mot de passe pour mon espace restaurant sur THIES Resto. Pouvez-vous m'aider ?`,n=`https://wa.me/221784799882?text=${encodeURIComponent(t)}`;window.open(n,`_blank`)}router.add(`#/partnership`,()=>{document.getElementById(`floating-cart-bar`).style.display=`none`,R();let e=document.getElementById(`main-content`);e.innerHTML=`
        <div class="auth-container" style="max-width: 600px; margin: 3rem auto; padding: 2.5rem; background: var(--bg-card); border-radius: 24px; border: 1px solid var(--border); box-shadow: var(--shadow);">
            <div class="auth-header" style="text-align: center; margin-bottom: 2rem;">
                <span class="auth-logo" style="font-size: 3rem; display: block; margin-bottom: 1rem;">🤝</span>
                <h2 style="font-family: var(--font-serif); font-size: 1.75rem; color: var(--text-primary);">Demande de Partenariat</h2>
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
    `}),window.handleRegImageUpload=async function(e){let t=e.target.files[0];if(!t)return;if(!supabaseClient){B(`Service Storage non disponible`,`danger`);return}let n=document.getElementById(`reg-image-preview`),r=document.getElementById(`reg-image-preview-container`),i=document.getElementById(`reg-image-upload-status`),a=document.getElementById(`reg-image-url`),o=document.querySelector(`#register-form button[type="submit"]`);r&&(r.style.display=`flex`),n&&(n.src=URL.createObjectURL(t)),i&&(i.innerHTML=`⏳ Compression et envoi...`,i.style.color=`var(--warning)`),o&&(o.disabled=!0);let s=e=>new Promise(t=>{let n=new FileReader;n.readAsDataURL(e),n.onload=e=>{let n=new Image;n.src=e.target.result,n.onload=()=>{let e=document.createElement(`canvas`),r=n.width,i=n.height;r>i?r>800&&(i*=800/r,r=800):i>800&&(r*=800/i,i=800),e.width=r,e.height=i,e.getContext(`2d`).drawImage(n,0,0,r,i),e.toBlob(e=>{t(e)},`image/webp`,.8)}}});try{let e=await s(t),n=`restaurants/${`${Date.now()}_logo.webp`}`,{error:r}=await supabaseClient.storage.from(`restaurant_images`).upload(n,e,{contentType:`image/webp`});if(r)throw r;let{data:o}=supabaseClient.storage.from(`restaurant_images`).getPublicUrl(n);a.value=o.publicUrl,i&&(i.innerHTML=`✅ Photo compressée et hébergée !`,i.style.color=`var(--success)`)}catch(e){console.error(`Upload error:`,e),i&&(i.innerHTML=`❌ Échec de l'envoi (${e.message})`,i.style.color=`var(--danger)`)}finally{o&&(o.disabled=!1)}};function je(e){e.preventDefault();let t=document.getElementById(`reg-name`).value.trim(),n=document.getElementById(`reg-address`).value.trim(),r=document.getElementById(`reg-category`).value,i=V(document.getElementById(`reg-whatsapp`).value.trim()),a=document.getElementById(`reg-open`).value,o=document.getElementById(`reg-close`).value,s=document.getElementById(`reg-username`).value.trim().toLowerCase(),c=document.getElementById(`reg-password`).value,l=document.getElementById(`reg-image-url`).value;if(!/^\+221(70|75|76|77|78)\d{7}$/.test(i.replace(/\s+/g,``))){B(`Numéro WhatsApp invalide (ex: +221 77 XXX XX XX)`,`danger`);return}if(store.getRestaurants().find(e=>e.username===s||e.slug===s)){B(`Cet identifiant est déjà utilisé`,`danger`);return}let u={id:`r`+(store.getRestaurants().length+1),name:t,slug:s.replace(/[^a-z0-9]/g,`-`),rating:5,reviewsCount:0,category:r,address:n,whatsapp:i,image:l||`https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500`,openHours:`${a} - ${o}`,closedDays:[],isOpenManual:!0,status:`pending`,username:s,password:c,menu:[],reviews:[]};store.addRestaurant(u);let d=document.querySelector(`.auth-container`);d.innerHTML=`
        <div style="text-align: center; padding: 2rem 1rem;">
            <div style="font-size: 3.5rem; margin-bottom: 1rem;">⏳</div>
            <h2 style="font-size: 1.25rem;">Demande d'inscription envoyée !</h2>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 1rem 0 1.5rem 0;">
                Votre dossier pour "<strong>${t}</strong>" a été transmis avec succès.
            </p>
            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 12px; font-size: 0.85rem; text-align: left; margin-bottom: 1.5rem;">
                Notre super-administrateur valide les inscriptions sous 10 minutes. Vous recevrez une confirmation et un message d'activation directement sur WhatsApp au <strong>${i}</strong>.
            </div>
            <button class="btn btn-primary btn-block" onclick="router.navigate('/')">Retourner à l'accueil</button>
        </div>
    `,B(`Inscription enregistrée. En attente d'approbation.`,`success`)}function Me(){let e=document.getElementById(`mobile-drawer`),t=document.getElementById(`drawer-backdrop`),n=document.getElementById(`hamburger-btn`);e&&t&&(e.classList.toggle(`active`),t.classList.toggle(`active`),n.classList.toggle(`active`))}function Ne(e){return e?e.toString().replace(/[&<>"']/g,function(e){return{"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#039;`}[e]}):``}var E={restaurantId:null,items:[],total:0};function D(e){return typeof DOMPurify<`u`?DOMPurify.sanitize(e):e.replace(/[&<>"']/g,function(e){return{"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#039;`}[e]})}var O=null,k=`Tous`,A=`default`;function Pe(){}function Fe(){let e=document.documentElement,t=(e.getAttribute(`data-theme`)||`light`)===`light`?`dark`:`light`;e.setAttribute(`data-theme`,t);try{localStorage.setItem(`THIES_THEME`,t)}catch{}j(t)}function j(e){let t=document.getElementById(`theme-toggle-icon`),n=document.getElementById(`theme-toggle-label`);t&&(t.textContent=e===`light`?`🌙`:`☀️`),n&&(n.textContent=e===`light`?`Mode Sombre`:`Mode Clair`)}function Ie(){try{let e=localStorage.getItem(`THIES_THEME`)||`light`;document.documentElement.setAttribute(`data-theme`,e),j(e)}catch{}}function M(){try{localStorage.setItem(`THIES_CART`,JSON.stringify(E))}catch{}}function N(){try{let e=localStorage.getItem(`THIES_CART`);if(e){let t=JSON.parse(e);t&&t.items&&t.items.length>0&&(E=t)}}catch{}}N();function Le(){navigator.vibrate&&navigator.vibrate(50),[document.getElementById(`floating-cart-bar`),document.getElementById(`floating-cart-qty`),document.getElementById(`floating-cart-btn`),document.getElementById(`bottom-nav-cart-qty`)].forEach(e=>{e&&(e.classList.remove(`cart-pulse`,`bounce`),e.offsetWidth,e.classList.add(`cart-pulse`,`bounce`))})}function Re(e){let t=document.getElementById(`adm-slug-availability-badge`)||document.getElementById(`slug-availability-badge`);if(!t)return;let n=e.trim().toLowerCase().replace(/[^a-z0-9-]/g,``);if(!n){t.innerHTML=``;return}store.getRestaurants().some(e=>e.username===n||e.slug===n)?(t.className=`slug-status taken`,t.innerHTML=`❌ Cet identifiant est déjà pris`):(t.className=`slug-status available`,t.innerHTML=`✅ Cet identifiant est disponible`)}function ze(e,t){try{let n=JSON.parse(localStorage.getItem(`THIES_ORDER_HISTORY`)||`[]`);n.unshift({...e,restaurantName:t,savedAt:new Date().toISOString()}),n.length>20&&(n=n.slice(0,20)),localStorage.setItem(`THIES_ORDER_HISTORY`,JSON.stringify(n))}catch{}}function P(){try{return JSON.parse(localStorage.getItem(`THIES_ORDER_HISTORY`)||`[]`)}catch{return[]}}function F(){try{let e=document.getElementById(`notification-sound`);e||(e=document.createElement(`audio`),e.id=`notification-sound`,e.src=`https://assets.mixkit.co/active_storage/sfx/2869/2869-120.wav`,document.body.appendChild(e)),e.currentTime=0;let t=e.play();t!==void 0&&t.catch(e=>{console.warn(`Notification audio blocked by browser autoplay settings:`,e)})}catch(e){console.warn(`Failed to play notification sound:`,e)}}var I=null;function Be(e){R(),typeof supabaseClient<`u`&&supabaseClient&&(I=supabaseClient.channel(`realtime-orders`).on(`postgres_changes`,{event:`INSERT`,schema:`public`,table:`orders`},t=>{let n=t.new;if(n.restaurant_id===e&&!store.data.orders.find(e=>e.id===n.id)){F(),typeof B==`function`&&B(`🔔 Nouvelle commande reçue !`,`success`),`Notification`in window&&Notification.permission===`granted`&&new Notification(`Nouvelle Commande 🔔`,{body:`Commande reçue de ${n.customer_name} pour ${n.total} FCFA`,icon:`icon.png`});let t={id:n.id,restaurantId:n.restaurant_id,customerName:n.customer_name,customerPhone:n.customer_phone,mode:n.mode,address:n.address,items:typeof n.items==`string`?JSON.parse(n.items):n.items,total:n.total,note:n.note,status:n.status,date:n.date};if(store.data.orders.unshift(t),store.save(),typeof renderDashboardTabContent==`function`){let t=store.getRestaurantById(e);t&&document.getElementById(`dashboard-view-orders`)&&document.getElementById(`dashboard-view-orders`).classList.contains(`active`)&&renderDashboardTabContent(t)}}}).subscribe())}function R(){I&&typeof supabaseClient<`u`&&supabaseClient&&(supabaseClient.removeChannel(I),I=null)}function Ve(){if(window.location.hash&&window.location.hash!==`#/`)router.navigate(`/`),setTimeout(()=>{let e=document.getElementById(`how-it-works-section`);e&&e.scrollIntoView({behavior:`smooth`})},300);else{let e=document.getElementById(`how-it-works-section`);e&&e.scrollIntoView({behavior:`smooth`})}}function z(){if(window.location.hash&&window.location.hash!==`#/`)router.navigate(`/`),setTimeout(()=>{let e=document.getElementById(`catalog-section`);e&&e.scrollIntoView({behavior:`smooth`})},300);else{let e=document.getElementById(`catalog-section`);e&&e.scrollIntoView({behavior:`smooth`})}}function He(e,t,n,r){let i=document.getElementById(t),a=document.getElementById(n);if(!i||!a)return;let o=e.trim().toLowerCase().normalize(`NFD`).replace(/[\u0300-\u036f]/g,``).replace(/[^a-z0-9]/g,`-`).replace(/-+/g,`-`).replace(/^-|-$/g,``);i.value=o,a.value=o?`${o}_221`:``,t===`reg-username`?Ue():Re(o)}function Ue(){let e=document.getElementById(`reg-username`),t=document.getElementById(`slug-availability-badge`);if(!e||!t)return;let n=e.value.trim().toLowerCase().replace(/[^a-z0-9-]/g,`-`);if(n.length<3){t.innerHTML=``;return}t.innerHTML=store.getRestaurants().find(e=>e.username===n||e.slug===n)?`<span class="slug-status taken">❌ Identifiant déjà pris</span>`:`<span class="slug-status available">✅ Disponible</span>`}function B(e,t=`info`){let n=document.getElementById(`toast-notification`);n&&(n.innerHTML=D(e),n.style.display=`block`,t===`success`?(n.style.backgroundColor=`#10b981`,n.style.color=`white`):t===`danger`?(n.style.backgroundColor=`#ef4444`,n.style.color=`white`):t===`warning`?(n.style.backgroundColor=`#f7b731`,n.style.color=`black`):(n.style.backgroundColor=`#ff6b35`,n.style.color=`white`),setTimeout(()=>{n.style.display=`none`},4e3))}window.showConfirmModal=function(e,t,n,r=null){let i=document.getElementById(`custom-confirm-modal`);i&&i.remove(),i=document.createElement(`div`),i.id=`custom-confirm-modal`,i.style.cssText=`
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.6); display: flex; align-items: center;
        justify-content: center; z-index: 100000; backdrop-filter: blur(4px);
        animation: fadeIn 0.2s ease-out; padding: 1.5rem;
    `,i.innerHTML=`
        <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; max-width: 400px; width: 100%; padding: 2rem; box-shadow: var(--shadow); text-align: center; animation: scaleUp 0.2s ease-out;">
            <div style="font-size: 2.5rem; margin-bottom: 1rem;">⚠️</div>
            <h3 style="font-family: var(--font-serif); margin-bottom: 0.75rem; color: var(--text-primary); font-size: 1.3rem;">${D(e)}</h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.5; margin-bottom: 2rem;">${D(t)}</p>
            <div style="display: flex; gap: 0.75rem; justify-content: center;">
                <button id="confirm-modal-cancel" class="btn btn-secondary btn-sm" style="flex: 1; font-weight: bold; border-radius: 10px;">Annuler</button>
                <button id="confirm-modal-ok" class="btn btn-primary btn-sm" style="flex: 1; font-weight: bold; border-radius: 10px; background: var(--danger); color: white;">Confirmer</button>
            </div>
        </div>
    `,document.body.appendChild(i),i.querySelector(`#confirm-modal-cancel`).onclick=function(){i.remove(),r&&r()},i.querySelector(`#confirm-modal-ok`).onclick=function(){i.remove(),n&&n()}};function V(e){let t=e.replace(/\s+/g,``);return!t.startsWith(`+221`)&&!t.startsWith(`221`)&&t.length===9&&(t=`+221`+t),t.startsWith(`221`)&&!t.startsWith(`+`)&&(t=`+`+t),t}function We(){let e=document.getElementById(`nav-actions`),t=document.querySelector(`.drawer-links`),n=``,r=``,i=`
        <a href="#" onclick="toggleMobileMenu(); router.navigate('/'); return false;">Accueil</a>
        <a href="#" onclick="toggleMobileMenu(); router.navigate('/profile'); return false;" style="color: var(--primary); font-weight: bold;">👤 Mon Profil / Historique</a>
        <a href="#" onclick="toggleMobileMenu(); router.navigate('/tracking'); return false;" style="color: var(--accent); font-weight: bold;">📍 Suivi de Commande</a>
        <a href="#" onclick="toggleMobileMenu(); scrollToHowItWorks(); return false;">Concept & Audit</a>
        <a href="#" onclick="toggleMobileMenu(); scrollToCatalog(); return false;">Nos Restaurants</a>
        <a href="#" onclick="toggleMobileMenu(); router.navigate('/partnership'); return false;">Devenir Partenaire 🤝</a>
        <a href="#" style="opacity: 0.6; pointer-events: none; margin-top: 1rem;" title="Bientôt disponible">
            Espace Livreurs 🛵 
            <span style="font-size: 0.7rem; color: var(--accent); display: block; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">(Bientôt disponible)</span>
        </a>
    `;isSuperAdminSession?currentRestaurantSession?(n=`
                <span class="badge badge-danger">👑 Admin (${currentRestaurantSession.name})</span>
                <button class="btn btn-primary btn-sm" onclick="router.navigate('/dashboard')">Tableau de Bord 📊</button>
                <button class="btn btn-secondary btn-sm" onclick="exitImpersonation()">Console Admin 🔐</button>
            `,r=`
                <div style="padding: 0.75rem; background: rgba(239, 68, 68, 0.1); border-radius: 12px; margin-bottom: 1rem; border: 1px solid rgba(239, 68, 68, 0.2);">
                    <span style="color: var(--danger); font-weight: bold; font-size: 0.85rem; display: block; margin-bottom: 0.25rem;">Mode Super-Admin</span>
                    <span style="font-size: 0.8rem; color: var(--text-primary); font-weight: 600;">Gère : ${currentRestaurantSession.name}</span>
                </div>
                <a href="#" onclick="toggleMobileMenu(); router.navigate('/dashboard'); return false;">📊 Tableau de Bord</a>
                <a href="#" onclick="toggleMobileMenu(); exitImpersonation(); return false;" style="color: var(--danger);">🚪 Retour Console Admin</a>
                <hr style="border: 0; border-top: 1px solid var(--border); margin: 1rem 0;">
                ${i}
            `):(n=`
                <span class="badge badge-danger">Super-Admin</span>
                <button class="btn btn-primary btn-sm" onclick="router.navigate('/admin')">Console Admin 📊</button>
            `,r=`
                <div style="padding: 0.75rem; background: rgba(239, 68, 68, 0.1); border-radius: 12px; margin-bottom: 1rem; border: 1px solid rgba(239, 68, 68, 0.2); text-align: center;">
                    <span style="color: var(--danger); font-weight: bold; font-size: 0.9rem;">👑 SUPER-ADMINISTRATEUR</span>
                </div>
                <a href="#" onclick="toggleMobileMenu(); router.navigate('/admin'); return false;">📊 Console Admin</a>
                <a href="#" onclick="toggleMobileMenu(); logoutAdmin(); return false;" style="color: var(--danger); font-weight: bold;">🚪 Déconnexion Admin</a>
                <hr style="border: 0; border-top: 1px solid var(--border); margin: 1rem 0;">
                ${i}
            `):currentRestaurantSession?(n=`
            <span class="badge badge-success">${currentRestaurantSession.name}</span>
            <button class="btn btn-primary btn-sm" onclick="router.navigate('/dashboard')">Tableau de Bord 📊</button>
        `,r=`
            <div style="padding: 0.75rem; background: rgba(16, 185, 129, 0.1); border-radius: 12px; margin-bottom: 1rem; border: 1px solid rgba(16, 185, 129, 0.2);">
                <span style="color: var(--success); font-weight: bold; font-size: 0.85rem; display: block; margin-bottom: 0.25rem;">Espace Partenaire</span>
                <span style="font-size: 0.8rem; color: var(--text-primary); font-weight: 600;">${currentRestaurantSession.name}</span>
            </div>
            <a href="#" onclick="toggleMobileMenu(); router.navigate('/dashboard'); return false;">📊 Mon Tableau de Bord</a>
            <a href="#" onclick="toggleMobileMenu(); logoutRestaurant(); return false;" style="color: var(--danger); font-weight: bold;">🚪 Déconnexion</a>
            <hr style="border: 0; border-top: 1px solid var(--border); margin: 1rem 0;">
            ${i}
        `):(n=`
            <button class="btn btn-primary btn-sm" onclick="router.navigate('/profile')">👤 Mon Profil</button>
            <button class="btn btn-secondary btn-sm" onclick="router.navigate('/auth')">Espace Resto</button>
        `,r=i),e.innerHTML=n,t&&(t.innerHTML=r)}function H(){try{sessionStorage.removeItem(`admin_session`)}catch(e){console.warn(`Failed to clear admin_session from sessionStorage`,e)}isSuperAdminSession=!1,B(`Session administrateur déconnectée`,`success`),router.navigate(`/`)}router.add(`#/`,()=>{ft(`home`);try{let e=document.getElementById(`floating-cart-bar`);e&&(e.style.display=`none`),typeof R==`function`&&R(),typeof N==`function`&&N();let t=store.getRestaurants().filter(e=>e.status===`active`).map(e=>e.id);for(let e=t.length-1;e>0;e--){let n=Math.floor(Math.random()*(e+1));[t[e],t[n]]=[t[n],t[e]]}window.shuffledRestaurantIds=t;let n=document.getElementById(`main-content`);store.data.orders&&store.data.orders.length,store.data.reservations&&store.data.reservations.length;let r=P(),i=``;if(r.length>0){let e=``;r.slice(0,5).forEach(t=>{e+=`
                <div class="history-item">
                    <div>
                        <strong>${t.id}</strong> — ${t.restaurantName||`Restaurant`}
                        <div class="history-item-meta">${(Array.isArray(t.items)?t.items:[]).map(e=>e.name||`Produit`).join(`, `)}</div>
                    </div>
                    <div style="text-align:right;">
                        <strong style="color:var(--primary)">${t.total} FCFA</strong>
                        <div class="history-item-meta">${t.date}</div>
                    </div>
                </div>
            `}),i=`
            <section class="history-mini">
                <div class="section-header">
                    <h2 class="section-title">Vos Dernières Commandes (Persistant)</h2>
                </div>
                ${e}
            </section>
        `}let a=new Date().getHours(),o=`Bonjour`;o=a<11?`Bonjour ! Prêt pour le déjeuner ?`:a<17?`Une petite faim ?`:`Bonsoir ! Ne cuisinez pas ce soir.`,n.innerHTML=`
        <!-- ========== HERO SECTION ========== -->
        <section class="hero-section page-transition" style="background: linear-gradient(var(--glass-bg), var(--bg-primary)), url('https://images.unsplash.com/photo-1544025162-d76694265947?w=1920&auto=format&fit=crop&q=80') center/cover fixed;">
            <div class="hero-split-container">
                <!-- Left: Title, Description and Search -->
                <div class="hero-left-col hover-3d" style="padding: 2rem; border-radius: 24px; background: var(--glass-bg); backdrop-filter: blur(16px); border: 1px solid var(--border); box-shadow: var(--shadow);">
                    <span class="greeting-text" style="display: block; font-size: 1.1rem; color: var(--primary); font-weight: 600; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 2px;">${o}</span>
                    <h1 class="hero-title" style="color: var(--text-primary); text-shadow: 0 4px 20px rgba(0,0,0,0.8); font-weight: 800; letter-spacing: -0.03em; margin-bottom: 1.5rem;">Découvrez les Meilleures Tables de <span style="color: var(--primary);">Thiès</span></h1>
                    <p class="hero-subtitle" style="color: var(--text-secondary); font-size: 1.2rem; line-height: 1.6; margin-bottom: 2.5rem;">Commandez vos plats du jour locaux en direct ou réservez votre table en quelques clics. Paiement à la livraison ou sur place. Simple, rapide et sans commission.</p>
                    
                    <div class="search-container hover-3d" style="margin: 0 0 2rem 0; width: 100%; max-width: 480px; position: relative;">
                        <input type="text" id="search-input-field" class="search-input" placeholder="Rechercher un plat, un restaurant..." oninput="applyFilters()" style="background: var(--bg-input); color: var(--text-primary); border: 1px solid var(--border); border-radius: 16px; padding: 1.2rem 3rem 1.2rem 1.5rem; width: 100%; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1); transition: var(--transition-smooth);">
                        <button class="search-btn" style="color: var(--primary); position: absolute; right: 15px; top: 50%; transform: translateY(-50%); background: none; border: none; font-size: 1.2rem;">🔍</button>
                    </div>

                    <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: flex-start;">
                        <button class="btn btn-primary ripple hover-3d" onclick="scrollToCatalog()" style="box-shadow: 0 10px 25px -5px rgba(242,107,33,0.5); padding: 1rem 2rem; border-radius: 12px; font-weight: 600;">Explorer nos Menus 🍽️</button>
                        <button class="btn btn-secondary ripple hover-3d" onclick="geolocateRestaurants()" style="background: var(--glass-bg); color: var(--text-primary); border: 1px solid var(--border); padding: 1rem 2rem; border-radius: 12px; font-weight: 500;">📍 Trouver autour de moi</button>
                    </div>
                </div>
                
            </div>
        </section>
        <!-- VOS DERNIERES COMMANDES PERSISTANT -->
        ${i}

        <!-- ========== KEY CONCEPTS ROW (3 Cards: Text - Image - Text) ========== -->
        <section class="presentation-section" style="padding: 1rem 0 0 0;">
            <div class="reference-row-cards">
                <!-- Left Card: Zero Account -->
                <div class="ref-card-text">
                    <div class="ref-card-icon-circle">🚫</div>
                    <h3>Zéro Inscription</h3>
                    <p>Commandez et réservez sans jamais avoir besoin de créer un compte. Aucun mot de passe à retenir.</p>
                </div>
                
                <!-- Middle Card: Premium Dish Image -->
                <div class="ref-card-image-box">
                    <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80" alt="Gourmet Bowl" loading="lazy">
                </div>
                
                <!-- Right Card: Direct WhatsApp -->
                <div class="ref-card-text">
                    <div class="ref-card-icon-circle">💬</div>
                    <h3>Direct WhatsApp</h3>
                    <p>Votre panier est transformé en un message structuré envoyé en un clic au restaurateur pour confirmation.</p>
                </div>
            </div>
        </section>

        

        <section id="catalog-section">
            <div class="section-header">
                <h2 class="section-title">Les Restaurants Partenaires</h2>
            </div>

            <!-- FILTERS BAR -->
            <div class="filter-bar" id="filter-bar">
                <button class="filter-btn ${k===`Tous`?`active`:``}" onclick="setFilter('Tous')">Tous</button>
                <button class="filter-btn ${k===`Traditionnel`?`active`:``}" onclick="setFilter('Traditionnel')">🍲 Traditionnel</button>
                <button class="filter-btn ${k===`Fast Food`?`active`:``}" onclick="setFilter('Fast Food')">🍔 Fast Food</button>
                <button class="filter-btn ${k===`Grillades / Dibi`?`active`:``}" onclick="setFilter('Grillades / Dibi')">🔥 Grillades</button>
                <button class="filter-btn ${k===`Gastronomique`?`active`:``}" onclick="setFilter('Gastronomique')">✨ Gastronomique</button>
                <button class="filter-btn ${k===`Pâtisserie`?`active`:``}" onclick="setFilter('Pâtisserie')">🥐 Pâtisserie</button>
            </div>

            <!-- SORTING BAR -->
            <div class="sort-bar">
                <label for="sort-select">Trier par :</label>
                <select class="sort-select" id="sort-select" onchange="activeSortBy = this.value; applyFilters();">
                    <option value="default" ${A==="default"?`selected`:``}>Recommandé</option>
                    <option value="rating" ${A===`rating`?`selected`:``}>Meilleure note ★</option>
                    <option value="reviews" ${A===`reviews`?`selected`:``}>Nombre d'avis</option>
                    <option value="name" ${A===`name`?`selected`:``}>Nom de A à Z</option>
                </select>
            </div>
            
            <div class="restaurant-grid" id="restaurants-list-grid"></div>

            <!-- RESTAURANT SUGGESTION CTA -->
            <div style="background: rgba(207, 168, 83, 0.1); border: 1px dashed var(--primary); border-radius: 16px; padding: 2rem; text-align: center; max-width: 600px; margin: 3rem auto 1rem auto;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">🤔</div>
                <h3 style="color: var(--text-primary); margin-bottom: 0.5rem; font-size: 1.2rem;">Votre restaurant préféré n'est pas là ?</h3>
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.5rem;">Nous ajoutons continuellement de nouvelles tables à Thiès. Aidez-nous à découvrir les meilleures !</p>
                <a href="https://wa.me/221784799882?text=Bonjour,%20j'aimerais%20suggérer%20ce%20restaurant%20sur%20Thiès%20à%20Table%20:%20[Insérez le nom]" target="_blank" class="btn btn-primary" style="background: var(--bg-card); color: var(--primary); border: 1px solid var(--primary); text-decoration: none;">
                    Suggérer un restaurant 💡
                </a>
            </div>
        </section>

        <!-- ========== PRESENTATION SECTION (Side by Side: Image Left, Text Right) ========== -->
        <section class="side-by-side-section">
            <div class="side-img-box">
                <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=700&auto=format&fit=crop&q=80" alt="Plat Traditionnel Sénégalais" loading="lazy">
            </div>
            
            <div class="side-content">
                <h2 style="font-family: var(--font-serif); font-weight: 400; color: var(--text-primary);">Une Plateforme Commune & Solidaire</h2>
                <p>Né d'une étude sur le terrain à Thiès, ce projet répond au constat que 95% des restaurateurs de la ville ne disposent d'aucun outil numérique propre. Nous réunissons les 20 tables les mieux notées sous un même toit virtuel pour leur offrir une présence en ligne immédiate et gratuite.</p>
                <div style="display: flex; gap: 2rem;">
                    <div>
                        <div style="font-size: 1.8rem; font-weight: 700; color: var(--primary); font-family: var(--font-serif);">95%</div>
                        <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Établissements sans site</div>
                    </div>
                    <div>
                        <div style="font-size: 1.8rem; font-weight: 700; color: var(--primary); font-family: var(--font-serif);">20+</div>
                        <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Tables Partenaires</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ========== SIGNATURE MENU SECTION (List Left, Big Image Right) ========== -->
        <section class="signature-section">
            <div class="sig-list">
                <h2 style="font-family: var(--font-serif); font-weight: 400; color: var(--text-primary); font-size: 2.25rem; margin-bottom: 0.5rem;">Les Saveurs Emblématiques de Thiès</h2>
                <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 1.5rem; line-height: 1.6;">Découvrez notre sélection de plats phares issus des cartes de nos restaurants partenaires.</p>
                
                <div class="sig-item">
                    <div class="sig-item-num">01</div>
                    <div class="sig-item-body">
                        <h4>Thiéboudiène Traditionnel</h4>
                        <p>Le riz au poisson emblématique du Sénégal, cuisiné avec du poisson frais du jour et ses légumes de saison.</p>
                    </div>
                </div>
                
                <div class="sig-item">
                    <div class="sig-item-num">02</div>
                    <div class="sig-item-body">
                        <h4>Dibi d'Agneau au Feu de Bois</h4>
                        <p>De tendres morceaux de viande grillés façon dibiterie, relevés d'oignons caramélisés et de moutarde.</p>
                    </div>
                </div>
                
                <div class="sig-item">
                    <div class="sig-item-num">03</div>
                    <div class="sig-item-body">
                        <h4>Pastels Dorés Croustillants</h4>
                        <p>De savoureux beignets farcis au poisson épicé ou à la viande, accompagnés d'une sauce tomate piquante maison.</p>
                    </div>
                </div>
            </div>
            
            <div class="sig-img-container">
                <img src="https://images.unsplash.com/photo-1547592180-85f173990554?w=700&auto=format&fit=crop&q=80" alt="Mijoté Mafé Sénégalais" loading="lazy">
            </div>
        </section>

        <!-- ONBOARDING COMMENT CA MARCHE -->
        <section class="how-it-works" id="how-it-works-section">
            <span class="study-title-tag">💡 Mode d'emploi</span>
            <h2 class="section-title" style="text-align:center; margin-bottom: 0.5rem; color: var(--text-primary);">Comment fonctionne la plateforme ?</h2>
            <p class="study-subtitle">Découvrez la simplicité et la flexibilité de THIES Resto à travers nos trois services phares.</p>
            
            <div class="how-it-works-tabs">
                <button class="hw-tab-btn active" onclick="switchHowItWorksTab('hw-order')">🛍️ Commander un plat</button>
                <button class="hw-tab-btn" onclick="switchHowItWorksTab('hw-reserve')">📅 Réserver une table</button>
                <button class="hw-tab-btn" onclick="switchHowItWorksTab('hw-group')">👥 Commande de groupe</button>
            </div>

            <!-- Tab 1: Commander -->
            <div class="hw-tab-content active" id="hw-order">
                <div class="timeline-steps">
                    <div class="timeline-card">
                        <div class="timeline-badge">1</div>
                        <span class="timeline-icon">🏪</span>
                        <h3>Sélection du restaurant</h3>
                        <p>Choisissez parmi les meilleurs établissements de Thiès, filtrez par envie et ouvrez la carte du jour.</p>
                    </div>
                    <div class="timeline-card">
                        <div class="timeline-badge">2</div>
                        <span class="timeline-icon">🛒</span>
                        <h3>Panier instantané</h3>
                        <p>Ajoutez vos plats préférés, spécifiez vos préférences et validez en un clic, sans création de compte fastidieuse.</p>
                    </div>
                    <div class="timeline-card">
                        <div class="timeline-badge">3</div>
                        <span class="timeline-icon">💬</span>
                        <h3>Envoi WhatsApp</h3>
                        <p>Votre commande est transmise de manière ultra-rapide par WhatsApp au restaurant. Payez en espèces ou Wave à la livraison.</p>
                    </div>
                    <div class="timeline-card">
                        <div class="timeline-badge">4</div>
                        <span class="timeline-icon">🎁</span>
                        <h3>Fidélité cumulée</h3>
                        <p>Cumulez automatiquement 5 points fidélité à chaque commande livrée pour obtenir des plats offerts.</p>
                    </div>
                </div>
            </div>

            <!-- Tab 2: Réserver -->
            <div class="hw-tab-content" id="hw-reserve">
                <div class="timeline-steps">
                    <div class="timeline-card">
                        <div class="timeline-badge">1</div>
                        <span class="timeline-icon">📅</span>
                        <h3>Choix de la date</h3>
                        <p>Sélectionnez votre restaurant préféré, l'onglet "Réserver", définissez la date, l'heure et le nombre de convives.</p>
                    </div>
                    <div class="timeline-card">
                        <div class="timeline-badge">2</div>
                        <span class="timeline-icon">👤</span>
                        <h3>Détails du contact</h3>
                        <p>Entrez vos coordonnées de contact pour que le gérant puisse bloquer et préparer votre table attitrée.</p>
                    </div>
                    <div class="timeline-card">
                        <div class="timeline-badge">3</div>
                        <span class="timeline-icon">✨</span>
                        <h3>Confirmation reçue</h3>
                        <p>Le restaurateur valide votre créneau directement sur son tableau de bord et vous envoie une confirmation par message.</p>
                    </div>
                    <div class="timeline-card">
                        <div class="timeline-badge">4</div>
                        <span class="timeline-icon">🍽️</span>
                        <h3>Installez-vous !</h3>
                        <p>Présentez-vous au restaurant à l'heure convenue : votre table est prête et des points fidélité vous sont offerts.</p>
                    </div>
                </div>
            </div>

            <!-- Tab 3: Commande de Groupe -->
            <div class="hw-tab-content" id="hw-group">
                <div class="timeline-steps">
                    <div class="timeline-card">
                        <div class="timeline-badge">1</div>
                        <span class="timeline-icon">👥</span>
                        <h3>Création du groupe</h3>
                        <p>Lancez un panier partagé pour vos collègues de bureau ou vos amis en clicking sur "Commande de Groupe".</p>
                    </div>
                    <div class="timeline-card">
                        <div class="timeline-badge">2</div>
                        <span class="timeline-icon">🔗</span>
                        <h3>Partage du lien</h3>
                        <p>Copiez et envoyez le lien unique généré dans votre discussion de groupe (WhatsApp, Slack, etc.).</p>
                    </div>
                    <div class="timeline-card">
                        <div class="timeline-badge">3</div>
                        <span class="timeline-icon">🍕</span>
                        <h3>Choix individuels</h3>
                        <p>Chaque membre ajoute ses plats préférés depuis son propre appareil. Le restaurant reçoit le tout regroupé et clair !</p>
                    </div>
                    <div class="timeline-card">
                        <div class="timeline-badge">4</div>
                        <span class="timeline-icon">👑</span>
                        <h3>Validation & Envoi</h3>
                        <p>L'initiateur du groupe valide le panier commun et l'envoie par WhatsApp. Le restaurant livre tout en une fois !</p>
                    </div>
                </div>
            </div>
        </section>


        <!-- ========== LOYALTY CARD SECTION ========== -->
        <section class="loyalty-checker-section" style="padding: 2.5rem 1.5rem; background: var(--bg-card); border-radius: 24px; border: 1px solid var(--border); margin: 2rem auto; max-width: 1200px;">
            <div style="max-width: 800px; margin: 0 auto; text-align: center;">
                <span class="study-title-tag" style="background: rgba(207, 168, 83, 0.1); color: var(--primary); padding: 0.35rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; border: 1px solid rgba(207, 168, 83, 0.2);">🎁 Programme de Fidélisation</span>
                <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--text-primary); margin: 0.75rem 0 0.5rem 0;">Consultez votre Statut & Plats Offerts</h2>
                <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1.5rem;">Saisissez votre numéro WhatsApp pour suivre vos points fidélité (5 pts/commande livrée, 5 pts/réservation) et réclamer vos cadeaux.</p>
                
                <div style="display: flex; gap: 0.75rem; justify-content: center; max-width: 480px; margin: 0 auto 1.5rem auto;">
                    <input type="tel" id="loyalty-phone" class="form-control" placeholder="+221 77 123 45 67" style="margin-bottom: 0;">
                    <button class="btn btn-primary" onclick="checkLoyaltyPoints()" style="white-space: nowrap;">Consulter ➔</button>
                </div>
                
                <div id="loyalty-result-card" style="display: none; margin-top: 1.5rem; animation: fadeIn 0.4s ease;">
                    <!-- Result card dynamically rendered by checkLoyaltyPoints -->
                </div>
            </div>
        </section>

        <!-- ========== ÉTUDE DE TERRAIN & NOTRE SOLUTION ========== -->
        <section class="field-study-section" id="field-study-section">
            <div style="text-align: center;">
                <span class="study-title-tag">📊 Analyse & Impact</span>
                <h2 class="section-title" style="margin-bottom: 0.5rem; color: var(--text-primary);">L'Étude de Terrain & Notre Solution</h2>
                <p class="study-subtitle">Comment THIES Resto répond à la réalité chiffrée de la restauration à Thiès.</p>
            </div>

            <div class="study-split-grid">
                <!-- Left: Problems / Metrics -->
                <div class="study-left-col">
                    <h3 style="font-family: var(--font-serif); font-size: 1.3rem; margin-bottom: 1.5rem; color: var(--text-primary);">Le Constat Local (Étude Juin 2025)</h3>
                    
                    <div class="study-carousel-wrapper">
                        <div class="study-metric-card square-stat-card">
                            <span class="stat-number">85%</span>
                            <span class="stat-label">Désert Numérique Complet</span>
                        </div>

                        <div class="study-metric-card square-stat-card">
                            <span class="stat-number">0%</span>
                            <span class="stat-label">Absence de Contenu Moderne</span>
                        </div>

                        <div class="study-metric-card square-stat-card">
                            <span class="stat-number">90%</span>
                            <span class="stat-label">Avis Négatifs Ignorés</span>
                        </div>
                    </div>
                </div>

                <!-- Right: Our Solutions -->
                <div class="study-right-col">
                    <h3 style="font-family: var(--font-serif); font-size: 1.3rem; margin-bottom: 1.5rem; color: var(--text-primary);">Les Réponses de THIES Resto</h3>

                    <div class="solution-carousel-wrapper">
                        <div class="solution-feature-card">
                            <span class="solution-icon">✨</span>
                            <div class="solution-text">
                                <h3>1. Vitrine Digitale Premium</h3>
                                <p>Chaque partenaire bénéficie d'une page personnalisée, moderne, rapide et optimisée pour le référencement local à Thiès.</p>
                            </div>
                        </div>

                        <div class="solution-feature-card">
                            <span class="solution-icon">⚡</span>
                            <div class="solution-text">
                                <h3>2. Précommande Réduisant l'Attente</h3>
                                <p>Les clients commandent et réservent à l'avance, ce qui réduit de moitié les temps d'attente souvent pointés du doigt.</p>
                            </div>
                        </div>

                        <div class="solution-feature-card">
                            <span class="solution-icon">📶</span>
                            <div class="solution-text">
                                <h3>3. Mode Hybride (SMS en Secours)</h3>
                                <p>En cas de coupure ou faiblesse du réseau internet à Thiès, la commande bascule automatiquement par SMS classique sécurisé.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `,typeof U==`function`&&U(),typeof startSocialProof==`function`&&startSocialProof()}catch(e){console.error(`Error in home route:`,e),typeof B==`function`&&B(`Une erreur non critique est survenue lors du chargement.`,`warning`)}});function Ge(e){k=e;let t=document.getElementById(`filter-bar`);t&&t.querySelectorAll(`.filter-btn`).forEach(t=>{t.textContent.includes(e===`Tous`?`Tous`:e.split(` `)[0])?t.classList.add(`active`):t.classList.remove(`active`)}),U()}function U(){let e=document.getElementById(`search-input-field`),t=e?e.value.toLowerCase().trim():``,n=document.getElementById(`restaurants-list-grid`);if(!n)return;let r=store.getRestaurants().filter(e=>e.status===`active`);if(k!==`Tous`&&(r=r.filter(e=>e.category===k)),t&&(r=r.filter(e=>e.name.toLowerCase().includes(t)||e.category.toLowerCase().includes(t)||e.address.toLowerCase().includes(t)||Array.isArray(e.menu)&&e.menu.some(e=>(e.name||``).toLowerCase().includes(t)||(e.description||``).toLowerCase().includes(t)))),r[0]&&r[0]._tempDistance?r.sort((e,t)=>e._tempDistance-t._tempDistance):A===`rating`?r.sort((e,t)=>t.rating-e.rating):A===`reviews`?r.sort((e,t)=>t.reviewsCount-e.reviewsCount):A===`name`?r.sort((e,t)=>e.name.localeCompare(t.name)):window.shuffledRestaurantIds&&r.sort((e,t)=>window.shuffledRestaurantIds.indexOf(e.id)-window.shuffledRestaurantIds.indexOf(t.id)),r.length===0){n.innerHTML=`<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 3rem 0;">Aucun restaurant ne correspond à vos critères.</div>`;return}let i=``;r.forEach(e=>{let t=G(e)?`<span class="badge badge-success restaurant-card-badge">Ouvert</span>`:`<span class="badge badge-danger restaurant-card-badge">Fermé</span>`,n=e.coverImage||`https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60`,r=``;e._tempDistance&&(r=`<div style="position: absolute; top: 1rem; right: 1rem; background: var(--bg-card); color: var(--text-primary); padding: 0.35rem 0.75rem; border-radius: 20px; font-weight: 600; font-size: 0.8rem; box-shadow: 0 4px 10px rgba(0,0,0,0.1); z-index: 2;">📍 ${e._tempDistance} km</div>`),i+=`
            <div class="restaurant-card hover-3d glass-panel" style="position: relative; border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; cursor: pointer; border: 1px solid var(--border);" onclick="router.navigate('/r/${e.slug}')">
                ${r}
                <div class="restaurant-card-header" style="height: 200px; position: relative;">
                    <img src="${n}" style="width: 100%; height: 100%; object-fit: cover;" alt="${e.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60'">
                    <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 50%; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);"></div>
                    <div style="position: absolute; top: 1rem; left: 1rem; z-index: 2;">
                        ${t}
                    </div>
                </div>
                <div class="restaurant-card-body" style="padding: 1.5rem; flex: 1; display: flex; flex-direction: column; background: var(--bg-card);">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                        <h3 class="restaurant-card-name" style="font-size: 1.3rem; font-weight: 700; color: var(--text-primary); margin: 0; line-height: 1.2;">${e.name}</h3>
                        <span class="stars-rating" style="background: var(--bg-primary); padding: 0.2rem 0.6rem; border-radius: 12px; font-weight: 600; font-size: 0.9rem; color: #fbbf24; border: 1px solid var(--border);">★ ${e.rating.toFixed(1)}</span>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.3rem;">
                        <span>📍</span> <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${e.address}</span>
                    </p>
                    <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center;">
                        <span class="restaurant-card-cuisine" style="background: rgba(242,107,33,0.1); color: var(--primary); padding: 0.4rem 1rem; border-radius: 12px; font-size: 0.8rem; font-weight: 600;">${e.category}</span>
                        <span style="font-size: 0.8rem; color: var(--text-secondary);">(${e.reviewsCount} avis)</span>
                    </div>
                </div>
            </div>
        `}),n.innerHTML=i}function Ke(e,t,n,r){if(!e||!t||!n||!r)return null;let i=(n-e)*Math.PI/180,a=(r-t)*Math.PI/180,o=Math.sin(i/2)*Math.sin(i/2)+Math.cos(e*Math.PI/180)*Math.cos(n*Math.PI/180)*Math.sin(a/2)*Math.sin(a/2);return 6371*(2*Math.atan2(Math.sqrt(o),Math.sqrt(1-o)))}function W(e,t,n){let r=document.getElementById(`map-modal`);if(r||(r=document.createElement(`div`),r.id=`map-modal`,r.style.position=`fixed`,r.style.top=`0`,r.style.left=`0`,r.style.width=`100vw`,r.style.height=`100vh`,r.style.backgroundColor=`rgba(0,0,0,0.8)`,r.style.zIndex=`99999`,r.style.display=`flex`,r.style.flexDirection=`column`,r.innerHTML=`
            <div style="background: var(--bg-card); width: 100%; height: 100%; max-width: 800px; max-height: 90vh; margin: auto; border-radius: 12px; display: flex; flex-direction: column; overflow: hidden; position: relative; border: 1px solid var(--border);">
                <div style="padding: 1rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0;">📍 Restaurants autour de moi</h3>
                    <button id="close-map-btn" style="background: transparent; border: none; font-size: 2rem; cursor: pointer; color: var(--text-primary); line-height: 1;">&times;</button>
                </div>
                <div id="leaflet-map" style="flex: 1; width: 100%;"></div>
            </div>
        `,document.body.appendChild(r),document.getElementById(`close-map-btn`).addEventListener(`click`,()=>{r.style.display=`none`})),r.style.display=`flex`,typeof L>`u`){typeof B==`function`&&B(`Erreur: Carte non chargée.`,`danger`);return}window.myLeafletMap?window.myLeafletMap.setView([e,t],14):(window.myLeafletMap=L.map(`leaflet-map`).setView([e,t],14),L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`,{attribution:`&copy; OpenStreetMap`}).addTo(window.myLeafletMap)),window.myMapMarkers&&window.myMapMarkers.forEach(e=>window.myLeafletMap.removeLayer(e)),window.myMapMarkers=[];let i=L.divIcon({className:`user-marker`,html:`<div style="background-color: var(--primary); width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,iconSize:[20,20]}),a=L.marker([e,t],{icon:i}).addTo(window.myLeafletMap).bindPopup(`<b>Vous êtes ici 🎯</b>`).openPopup();window.myMapMarkers.push(a);let o=!1;if(n.forEach(e=>{if(e.lat&&e.lng){e._tempDistance&&e._tempDistance<20&&(o=!0);let t=L.marker([e.lat,e.lng]).addTo(window.myLeafletMap).bindTooltip(e.name,{permanent:!0,direction:`top`,className:`map-label`}).bindPopup(`
                    <div style="text-align:center;">
                        <b style="font-size:1.1rem;">${e.name}</b><br>
                        <span style="color:var(--text-secondary); font-size:0.85rem;">${e.address}</span><br>
                        <span style="font-size:0.8rem; color:var(--primary); font-weight:bold;">${e._tempDistance?e._tempDistance+` km`:``}</span><br>
                        <a href="#/r/${e.slug}" style="display:inline-block; margin-top:8px; padding:6px 12px; background:var(--primary); color:white; border-radius:4px; text-decoration:none;" onclick="document.getElementById('map-modal').style.display='none';">Voir le menu</a>
                    </div>
                `);window.myMapMarkers.push(t)}}),!o){typeof B==`function`&&B(`Les restaurants sont un peu loin de vous. Commandez en ligne pour vous faire livrer ! 🛵`,`info`);let e=document.createElement(`div`);e.style.background=`var(--warning)`,e.style.color=`#000`,e.style.padding=`10px 15px`,e.style.textAlign=`center`,e.style.fontWeight=`bold`,e.style.fontSize=`0.9rem`,e.innerHTML=`📍 Votre position a été trouvée, mais les restaurants sont un peu loin de vous. <br><a href="#/catalog" onclick="document.getElementById('map-modal').style.display='none';" style="color: #000; text-decoration: underline; margin-top: 5px; display: inline-block;">Faites-vous livrer en commandant en ligne ! 🛵</a>`;let t=document.getElementById(`leaflet-map`);if(t&&t.parentNode){let n=document.getElementById(`map-distance-warning`);n&&n.remove(),e.id=`map-distance-warning`,t.parentNode.insertBefore(e,t)}}setTimeout(()=>{window.myLeafletMap.invalidateSize()},200)}window.geolocateRestaurants=function(){`geolocation`in navigator?(typeof B==`function`&&B(`Recherche de votre position...`,`info`),navigator.geolocation.getCurrentPosition(e=>{let t=e.coords.latitude,n=e.coords.longitude,r=0;store.data.restaurants.forEach(e=>{if(e.lat&&e.lng){let i=Ke(t,n,e.lat,e.lng);e._tempDistance=parseFloat(i.toFixed(1)),r++}}),typeof B==`function`&&B(`Position trouvée ! Tri de ${r} restaurants...`,`success`),z(),U(),W(t,n,store.data.restaurants)},e=>{typeof B==`function`&&B(`Impossible d'obtenir votre position. Veuillez autoriser l'accès.`,`error`)})):typeof B==`function`&&B(`La géolocalisation n'est pas supportée par votre navigateur.`,`error`)};function qe(){U()}function G(e){if(e.isOpenManual===!1)return!1;if(e.isOpenManual===!0){let t=new Date,n=t.getDay();if(n===0&&(n=7),e.closedDays.includes(n))return!1;try{let n=e.openHours.split(`-`);if(n.length===2){let e=n[0].trim().split(`:`),r=n[1].trim().split(`:`),i=parseInt(e[0]),a=parseInt(e[1]),o=parseInt(r[0]),s=parseInt(r[1]),c=t.getHours(),l=t.getMinutes(),u=i*60+a,d=o*60+s,f=c*60+l;return d>u?f>=u&&f<=d:f>=u||f<=d}}catch{return!0}return!0}return!1}function K(e){return[`Lundi`,`Mardi`,`Mercredi`,`Jeudi`,`Vendredi`,`Samedi`,`Dimanche`][e-1]||``}router.add(`#/r/:slug`,async(e,t=`menu`,n=null)=>{document.getElementById(`main-content`).innerHTML===``&&showLoadingOverlay(`Chargement du menu...`);let r=await store.getRestaurantBySlug(e);if(!r){document.getElementById(`main-content`).innerHTML=`
            <div style="text-align: center; padding: 5rem 1.5rem;">
                <h2>Restaurant non trouvé</h2>
                <p style="color: var(--text-secondary); margin: 1rem 0;">Le restaurant "${e}" n'existe pas ou n'est plus actif.</p>
                <button class="btn btn-primary" onclick="router.navigate('/')">Retour à l'accueil</button>
            </div>
        `;return}R(),N(),(!E.items||E.items.length===0)&&(E.restaurantId=r.id,M()),t===`group`&&n&&(!O||O.id!==n)&&(O={id:n,restaurantId:r.id,creator:`Coordinateur`,participants:[{name:`Mariama (Créateur)`,items:[]}]}),ft(`restaurant`,r),q(r,t,n)}),window.shareRestaurant=function(e,t){let n=`https://thies-resto.com/#/r/`+t,r=`Regarde ce restaurant sur THIES Resto, on commande ce soir ? `+e;navigator.share?navigator.share({title:e,text:r,url:n}).catch(console.error):navigator.clipboard.writeText(r+` : `+n).then(()=>{typeof B==`function`&&B(`Lien copié dans le presse-papiers !`,`success`)}).catch(()=>{window.open(`https://api.whatsapp.com/send?text=`+encodeURIComponent(r+` `+n),`_blank`)})};function q(e,t=`menu`,n=null){let r=document.getElementById(`main-content`),i=G(e)?`<span class="badge badge-success">Ouvert</span>`:`<span class="badge badge-danger">Fermé</span>`,a=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${e.name}, Thiès, Sénégal`)}`,o=``;e.closedDays.length>0&&(o=` (Fermé : ${e.closedDays.map(e=>K(e)).join(`, `)})`),r.innerHTML=`
        <button class="back-btn" onclick="router.navigate('/')">
            ← Retour aux restaurants
        </button>

        <div class="restaurant-details-header">
            <div class="restaurant-logo-large">🍽️</div>
            <h1 class="restaurant-name-title">${e.name}</h1>
            
            <div class="restaurant-status-row">
                ${i}
                <span class="stars-rating">★ ${e.rating.toFixed(1)}</span>
                <span style="color: var(--text-secondary)">(${e.reviewsCount} avis)</span>
            </div>
            
            <p class="restaurant-meta-info">
                🕒 Horaires : ${e.openHours}${o} | 📍 ${e.address}
            </p>
            
            <div class="restaurant-meta-actions">
                <a href="${a}" target="_blank" class="btn btn-secondary btn-sm">
                    🗺️ S'y rendre (Google Maps)
                </a>
                <a href="https://wa.me/${e.whatsapp.replace(/\+/g,``)}" target="_blank" class="btn btn-outline btn-sm">
                    💬 Contacter WhatsApp
                </a>
                <button class="btn btn-primary btn-sm" onclick="shareRestaurant('${e.name}', '${e.slug}')">
                    📤 Partager à un ami
                </button>
            </div>
        </div>

        <nav class="tabs-nav">
            <button class="tab-btn ${t===`menu`?`active`:``}" onclick="switchRestoTab('menu')">Menu du Jour 🍕</button>
            <button class="tab-btn ${t===`checkout`?`active`:``}" id="tab-checkout-btn" onclick="switchRestoTab('checkout')">Commander 🛒</button>
            <button class="tab-btn ${t===`group`?`active`:``}" onclick="switchRestoTab('group')">Commande de Groupe 👥</button>
            <button class="tab-btn ${t===`booking`?`active`:``}" onclick="switchRestoTab('booking')">Réserver une Table 📅</button>
            <button class="tab-btn ${t===`reviews`?`active`:``}" onclick="switchRestoTab('reviews')">Avis Clients (${e.reviews.length}) 💬</button>
        </nav>

        <div class="tab-content">
            <!-- PANEL: MENU -->
            <div class="tab-panel ${t===`menu`?`active`:``}" id="panel-menu">
                <div class="dishes-grid" id="dishes-list-grid"></div>
            </div>

            <!-- PANEL: CHECKOUT -->
            <div class="tab-panel ${t===`checkout`?`active`:``}" id="panel-checkout">
                <div id="checkout-content-container"></div>
            </div>

            <!-- PANEL: GROUP ORDER -->
            <div class="tab-panel ${t===`group`?`active`:``}" id="panel-group">
                <div id="group-content-container"></div>
            </div>

            <!-- PANEL: BOOKING -->
            <div class="tab-panel ${t===`booking`?`active`:``}" id="panel-booking">
                <div id="booking-content-container"></div>
            </div>

            <!-- PANEL: REVIEWS -->
            <div class="tab-panel ${t===`reviews`?`active`:``}" id="panel-reviews">
                <div id="reviews-content-container"></div>
            </div>
        </div>
    `,Je(e),renderCheckoutTab(e),Z(e,n),et(e),rt(e),X(e)}function J(e){let t=document.querySelectorAll(`.tab-btn`),n=document.querySelectorAll(`.tab-panel`);t.forEach(t=>{t.classList.remove(`active`),t.innerText.toLowerCase().includes(e===`checkout`?`commander`:e===`booking`?`réserver`:e===`group`?`groupe`:e===`reviews`?`avis`:`menu`)&&t.classList.add(`active`)}),n.forEach(e=>e.classList.remove(`active`));let r=document.getElementById(`panel-${e}`);r&&r.classList.add(`active`);let i=store.getRestaurantById(E.restaurantId);i&&(X(i),e===`checkout`&&renderCheckoutTab(i));let a=document.querySelector(`.tabs-nav`);a&&a.scrollIntoView({behavior:`smooth`,block:`start`})}function Je(e){let t=document.getElementById(`dishes-list-grid`),n=``;if(e.menu.length===0){t.innerHTML=`<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 3rem 0;">Aucun plat du jour disponible aujourd'hui.</div>`;return}e.menu.forEach(t=>{let r=G(e),i=t.available!==!1,a=``;a=r?i?`<button class="btn btn-primary btn-block" onclick="openProductModal('${e.id}', '${t.id}')">Choisir & Ajouter 🛒</button>`:`<button class="btn btn-danger btn-block" disabled>Rupture de Stock</button>`:`<button class="btn btn-secondary btn-block" disabled>Fermé temporairement</button>`;let o=i?``:`<span style="position:absolute; top:10px; left:10px; background:var(--danger); color:white; padding:4px 8px; border-radius:4px; font-weight:bold; font-size:0.8rem; z-index:10;">ÉPUISÉ</span>`,s=i?``:`filter: grayscale(100%); opacity: 0.6;`,c=i?``:`opacity: 0.8;`;n+=`
            <div class="dish-card" data-menu-item-id="${t.id}" onclick="${i&&r?`openProductModal('${e.id}', '${t.id}')`:``}" style="${i&&r?`cursor: pointer;`:`cursor: not-allowed;`} ${c}">
                <div class="dish-img-container" style="position:relative;">
                    ${o}
                    <img src="${t.image}" class="dish-image" alt="${t.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'" style="${s}">
                    <span class="dish-price-tag item-price">${t.price} FCFA</span>
                </div>
                <div class="dish-body">
                    <h3 class="dish-title" style="${i?``:`text-decoration: line-through; color: var(--text-secondary);`}">${t.name}</h3>
                    <p class="dish-desc">${t.description}</p>
                    ${a}
                </div>
            </div>
        `}),t.innerHTML=n}window.openProductModal=function(e,t){let n=store.getRestaurantById(e).menu.find(e=>e.id===t);if(!n)return;let r=document.getElementById(`product-detail-modal`);r||(r=document.createElement(`div`),r.id=`product-detail-modal`,document.body.appendChild(r)),window.currentProductQty=1,r.innerHTML=`
        <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #0c0e12; z-index: 9999; display: flex; flex-direction: column; animation: slideUp 0.3s ease-out; overflow-y: auto;">
            <!-- Header -->
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; position: absolute; top: 0; left: 0; width: 100%; z-index: 10;">
                <button onclick="document.getElementById('product-detail-modal').remove()" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); width: 45px; height: 45px; border-radius: 50%; color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; cursor: pointer; backdrop-filter: blur(5px);">
                    ←
                </button>
                <div style="position: relative;" onclick="document.getElementById('product-detail-modal').remove(); openCartTab();">
                    <button style="background: var(--primary); border: none; width: 45px; height: 45px; border-radius: 50%; color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; cursor: pointer; box-shadow: 0 4px 15px rgba(207,168,83,0.4);">
                        🛒
                    </button>
                    <span style="position: absolute; top: -5px; right: -5px; background: white; color: var(--primary); font-size: 0.75rem; font-weight: 800; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                        ${E.items.length}
                    </span>
                </div>
            </div>

            <!-- Image Hero -->
            <div style="flex: 1; min-height: 40vh; position: relative; display: flex; align-items: center; justify-content: center; padding: 5rem 2rem 2rem 2rem; background: radial-gradient(circle at center, rgba(207,168,83,0.15) 0%, transparent 60%);">
                <img src="${n.image}" style="width: 280px; height: 280px; object-fit: cover; border-radius: 50%; box-shadow: 0 20px 40px rgba(0,0,0,0.6); border: 4px solid rgba(255,255,255,0.05);" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'" loading="lazy">
            </div>

            <!-- Curved Separator -->
            <div style="width: 100%; height: 30px; background: transparent; position: relative; overflow: hidden; margin-top: -15px;">
                <div style="position: absolute; top: 15px; left: -10%; width: 120%; height: 100px; border-top: 1px solid rgba(207,168,83,0.3); border-radius: 50%; box-shadow: 0 -10px 30px rgba(207,168,83,0.1);"></div>
            </div>

            <!-- Details Section -->
            <div style="background: #0c0e12; padding: 2rem 1.5rem; flex: 1; border-top-left-radius: 30px; border-top-right-radius: 30px; display: flex; flex-direction: column;">
                
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                    <h2 style="color: var(--primary); font-size: 1.8rem; font-family: var(--font-serif); font-weight: 700; margin: 0; max-width: 65%;">${n.name}</h2>
                    <span style="color: var(--primary); font-size: 1.6rem; font-weight: 800;">${n.price} <span style="font-size: 1rem;">FCFA</span></span>
                </div>
                
                <p style="color: rgba(255,255,255,0.6); font-size: 0.95rem; line-height: 1.5; margin-bottom: 2rem;">${n.description}</p>

                <!-- Controls -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="display: flex; flex-direction: column;">
                        <span style="color: rgba(255,255,255,0.5); font-size: 0.75rem; font-weight: 700; letter-spacing: 1px; margin-bottom: 0.5rem; text-transform: uppercase;">Quantité</span>
                        <div style="display: flex; align-items: center; gap: 1rem; background: #16181d; border-radius: 30px; padding: 0.25rem; border: 1px solid rgba(255,255,255,0.05);">
                            <button onclick="if(window.currentProductQty > 1) { window.currentProductQty--; document.getElementById('modal-qty-val').innerText = window.currentProductQty; }" style="background: #e2e8f0; border: none; width: 35px; height: 35px; border-radius: 50%; color: #000000; font-weight: bold; font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center;">-</button>
                            <span id="modal-qty-val" style="color: var(--primary); font-weight: 700; font-size: 1.2rem; min-width: 20px; text-align: center;">1</span>
                            <button onclick="window.currentProductQty++; document.getElementById('modal-qty-val').innerText = window.currentProductQty;" style="background: #e2e8f0; border: none; width: 35px; height: 35px; border-radius: 50%; color: #000000; font-weight: bold; font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center;">+</button>
                        </div>
                    </div>
                </div>

                <!-- Action Button -->
                <button onclick="addModalItemToCart('${e}', '${t}'); document.getElementById('product-detail-modal').remove();" style="background: var(--primary); color: var(--primary); border: none; width: 100%; padding: 1.25rem; border-radius: 20px; font-size: 1.1rem; font-weight: 700; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 0.5rem; box-shadow: 0 10px 25px rgba(207,168,83,0.3); transition: transform 0.2s;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                    AJOUTER AU PANIER
                </button>
            </div>
        </div>
    `},window.addModalItemToCart=function(e,t){let n=window.currentProductQty||1,r=store.getRestaurantById(e),i=r.menu.find(e=>e.id===t);if(!i)return;if(E.restaurantId&&E.restaurantId!==e&&E.items.length>0){let t=store.getRestaurantById(E.restaurantId),n=t?t.name:`un autre restaurant`;if(!confirm(`Votre panier contient déjà des plats de "${n}". Voulez-vous vider votre panier actuel pour commander chez "${r.name}" ?`))return;E={restaurantId:e,items:[],total:0}}E.restaurantId||(E.restaurantId=e);let a=E.items.find(e=>e.id===t);a?a.qty+=n:E.items.push({id:i.id,name:i.name,price:i.price,qty:n}),E.total+=i.price*n,M(),document.getElementById(`panel-checkout`)&&renderCheckoutTab(store.getRestaurantById(e)),X(store.getRestaurantById(e)),B(`(${n}) ${i.name} ajouté(s) au panier ! 🛒`,`success`)};function Ye(e,t){let n=store.getRestaurantById(e),r=n.menu.find(e=>e.id===t);if(!r)return;if(E.restaurantId&&E.restaurantId!==e&&E.items.length>0){let t=store.getRestaurantById(E.restaurantId),r=t?t.name:`un autre restaurant`;if(!confirm(`Votre panier contient déjà des plats de "${r}". Voulez-vous vider votre panier actuel pour commander chez "${n.name}" ?`))return;E={restaurantId:e,items:[],total:0}}E.restaurantId=e;let i=E.items.find(e=>e.id===t);i?i.qty+=1:E.items.push({id:r.id,name:r.name,price:r.price,qty:1}),Y(),M(),X(n),Le(),renderCheckoutTab(n),B(`${r.name} ajouté !`,`success`)}function Xe(e,t){let n=store.getRestaurantById(E.restaurantId),r=E.items.findIndex(t=>t.id===e);r!==-1&&(E.items[r].qty+=t,E.items[r].qty<=0&&E.items.splice(r,1),Y(),M(),X(n),renderCheckoutTab(n))}function Y(){let e=E.items.reduce((e,t)=>e+t.price*t.qty,0);E.subtotal=e,E.loyaltyApplied?E.total=Math.max(0,e-2500):E.total=e,E.deliveryFee&&(E.total+=E.deliveryFee)}function X(e){let t=document.getElementById(`floating-cart-bar`),n=E.items.reduce((e,t)=>e+t.qty,0),r=document.querySelector(`.tab-panel.active`),i=r&&r.id===`panel-checkout`;n>0&&G(e)&&!i?(document.getElementById(`floating-cart-qty`).innerText=`${n} article${n>1?`s`:``}`,document.getElementById(`floating-cart-total`).innerText=`${E.total} FCFA`,t.style.display=`flex`):t.style.display=`none`;var a=document.getElementById(`bottom-nav-cart-qty`);a&&(a.innerText=n,a.style.display=n>0?`inline-flex`:`none`)}function Z(e,t=null){let n=document.getElementById(`group-content-container`);if(!t&&!O){n.innerHTML=`
            <div class="group-setup">
                <div class="group-setup-icon">👥</div>
                <h3 style="margin-bottom: 0.75rem;">Commande de Groupe</h3>
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.5rem;">
                    Commandez avec vos collègues ou amis ! Créez un panier partagé, envoyez le lien sur WhatsApp, et laissez chacun choisir son plat en direct.
                </p>
                <div class="form-group" style="text-align: left; max-width: 400px; margin: 0 auto 1.5rem auto;">
                    <label class="form-label">Votre Prénom/Nom (Organisateur) <span class="required">*</span></label>
                    <input type="text" id="group-creator-name" class="form-control" placeholder="Mariama Diop" required>
                </div>
                <button class="btn btn-primary" onclick="window.startGroupOrder('${e.slug}')">
                    Lancer une commande de groupe 🚀
                </button>
            </div>
        `;return}let r=`${window.location.origin}${window.location.pathname}#/r/${e.slug}/group/${O.id}`,i=`Bonjour ! Rejoignez ma commande de groupe chez *${e.name}* sur THIES Resto pour ajouter vos plats en un clic : ${r}`,a=`https://wa.me/?text=${encodeURIComponent(i)}`,o=``,s=0;O.participants.forEach((n,r)=>{let i=``,a=0;n.items.length===0?i=`<span style="font-style: italic; color: var(--text-secondary);">Aucun plat sélectionné</span>`:(i=n.items.map(e=>`${e.name} (x${e.qty})`).join(`, `),a=n.items.reduce((e,t)=>e+t.price*t.qty,0),s+=a),o+=`
            <div class="participant-row">
                <div>
                    <div class="participant-name">${n.name}</div>
                    <div class="participant-choice">${i}</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: 700; color: var(--primary);">${a} FCFA</div>
                    <button class="btn btn-danger btn-sm btn-icon" style="padding: 0.15rem 0.35rem; font-size: 0.7rem; margin-top: 0.25rem;" onclick="window.removeParticipant(${r}, '${e.slug}', '${t}')">❌</button>
                </div>
            </div>
        `});let c=`<option value="">-- Sélectionner un plat --</option>`;e.menu.forEach(e=>{c+=`<option value="${e.id}">${e.name} (${e.price} FCFA)</option>`}),n.innerHTML=`
        <div class="group-active-panel">
            <div style="background: var(--bg-card); border: 1px solid var(--border); padding: 1.25rem; border-radius: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <h3 style="font-size: 1.15rem;">Groupe Actif : Commandes en cours</h3>
                    <span class="badge badge-info">ID : ${O.id}</span>
                </div>
                <p style="font-size: 0.85rem; color: var(--text-secondary);">Créé par : <strong>${O.creator}</strong></p>
            </div>
            
            <div class="group-share-box">
                <div style="flex-grow: 1; overflow: hidden;">
                    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--primary); margin-bottom: 0.25rem;">Lien à partager aux collègues :</div>
                    <div class="group-share-link" id="group-link-display">${r}</div>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="copyGroupLink()">Copier 📋</button>
                <a href="${a}" target="_blank" class="btn btn-success btn-sm">Partager 💬</a>
            </div>

            <div class="group-participants">
                <h4 style="font-size: 0.95rem;">Membres du Groupe</h4>
                <div class="form-row" style="margin-bottom: 1rem;">
                    <input type="text" id="part-name" class="form-control" placeholder="Votre prénom">
                    <select id="part-dish-select" class="form-control">${c}</select>
                    <button class="btn btn-primary btn-sm" onclick="window.addParticipantAction('${e.slug}', '${t}')">Ajouter</button>
                </div>
                ${o}
            </div>

            <div class="cart-total-box">
                <span>Total de groupe :</span>
                <span class="cart-total-price">${s} FCFA</span>
            </div>

            <form id="group-final-form" onsubmit="submitGroupOrder(event, '${e.id}', '${s}')" style="background: var(--bg-card); padding: 1.5rem; border-radius: 20px; border: 1px solid var(--border);">
                <h3 style="font-size: 1.05rem; margin-bottom: 1rem;">Validation & Livraison Globale</h3>
                
                <div class="form-group">
                    <label class="form-label">Responsable du Paiement <span class="required">*</span></label>
                    <input type="text" id="group-payee-name" class="form-control" value="${O.creator}" required>
                </div>

                <div class="form-group">
                    <label class="form-label">Numéro WhatsApp du Responsable <span class="required">*</span></label>
                    <input type="tel" id="group-phone" class="form-control" placeholder="+221 77 123 45 67" required>
                </div>

                <div class="form-group">
                    <label class="form-label">Mode de Récupération <span class="required">*</span></label>
                    <div class="delivery-options">
                        <label class="delivery-radio-card">
                            <input type="radio" name="group-mode" value="Sur place" onchange="toggleGroupAddressField(false)">
                            <div class="delivery-card-content">
                                <span class="delivery-icon">🍽️</span>
                                <span>Sur Place</span>
                            </div>
                        </label>
                        <label class="delivery-radio-card">
                            <input type="radio" name="group-mode" value="A emporter" checked onchange="toggleGroupAddressField(false)">
                            <div class="delivery-card-content">
                                <span class="delivery-icon">🛍️</span>
                                <span>A Emporter</span>
                            </div>
                        </label>
                        <label class="delivery-radio-card">
                            <input type="radio" name="group-mode" value="Livraison" onchange="toggleGroupAddressField(true)">
                            <div class="delivery-card-content">
                                <span class="delivery-icon">🛵</span>
                                <span>Livraison</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div class="form-group" id="group-address-group" style="display: none;">
                    <label class="form-label">Adresse Unique de Livraison (Thiès) <span class="required">*</span></label>
                    <input type="text" id="group-address" class="form-control" placeholder="Adresse du bureau, service, Thiès">
                </div>

                <button type="submit" class="btn btn-primary btn-block" ${s===0?`disabled`:``}>
                    Valider et envoyer la commande groupée (${s} FCFA) 👥
                </button>
            </form>
        </div>
    `}function Ze(e){let t=document.getElementById(`group-address-group`),n=document.getElementById(`group-address`);e?(t.style.display=`block`,n.required=!0):(t.style.display=`none`,n.required=!1,n.value=``)}window.startGroupOrder=async function(e){let t=document.getElementById(`group-creator-name`).value.trim();if(!t){B(`Veuillez saisir le nom de l'organisateur`,`danger`);return}let n=await store.getRestaurantBySlug(e),r=`GRP-`+Math.floor(1e5+Math.random()*9e5);O={id:r,restaurantId:n.id,creator:t,participants:[{name:`${t} (Créateur)`,items:[]}]},B(`Commande de groupe lancée !`,`success`),router.navigate(`/r/${e}/group/${r}`)},window.addParticipantAction=async function(e,t){let n=document.getElementById(`part-name`).value.trim(),r=document.getElementById(`part-dish-select`).value;if(!n||!r){B(`Veuillez remplir le nom et choisir un plat`,`danger`);return}let i=await store.getRestaurantBySlug(e),a=i.menu.find(e=>e.id===r),o=O.participants.find(e=>e.name.toLowerCase()===n.toLowerCase());if(o){let e=o.items.find(e=>e.id===r);e?e.qty+=1:o.items.push({id:a.id,name:a.name,price:a.price,qty:1})}else O.participants.push({name:n,items:[{id:a.id,name:a.name,price:a.price,qty:1}]});document.getElementById(`part-name`).value=``,document.getElementById(`part-dish-select`).value=``,B(`Plat ajouté pour ${n}`,`success`),Z(i,t)},window.removeParticipant=async function(e,t,n){O.participants.splice(e,1),Z(await store.getRestaurantBySlug(t),n),B(`Choix supprimé`,`info`)},window.joinGroupOrder=async function(e,t){Z(await store.getRestaurantBySlug(e),t),B(`Commande jointe`,`info`)};function Qe(){let e=document.getElementById(`group-link-display`);navigator.clipboard.writeText(e.innerText).then(()=>{B(`Lien copié dans le presse-papiers !`,`success`)}).catch(e=>{B(`Échec de la copie du lien`,`danger`)})}function $e(e,t,n){if(e.preventDefault(),!checkOrderRateLimit())return;let r=store.getRestaurantById(t),i=document.getElementById(`group-payee-name`).value.trim(),a=V(document.getElementById(`group-phone`).value.trim()),o=document.querySelector(`input[name="group-mode"]:checked`).value,s=document.getElementById(`group-address`).value.trim();if(!/^\+221(70|75|76|77|78)\d{7}$/.test(a.replace(/\s+/g,``))){B(`Numéro de téléphone sénégalais invalide (ex: +221 77 XXX XX XX)`,`danger`);return}let c=`ORD-`+Math.floor(1e3+Math.random()*9e3),l=new Date().toISOString().split(`T`)[0],u=new Date().toLocaleTimeString(`fr-FR`,{hour:`2-digit`,minute:`2-digit`}),d={};O.participants.forEach(e=>{e.items.forEach(e=>{d[e.name]?d[e.name].qty+=e.qty:d[e.name]={name:e.name,price:e.price,qty:e.qty}})});let f=Object.values(d),p=O.participants.map(e=>{let t=e.items.map(e=>`${e.name} x${e.qty}`).join(`, `);return`${e.name} : ${t}`}).join(` | `),m={id:c,restaurantId:r.id,customerName:`[GROUPE] ${i}`,customerPhone:a,mode:o,address:s,items:f,total:parseInt(n),note:`Commande de groupe (${O.id}). Détails : ${p}`,status:`Reçue`,date:l,time:u};store.addOrder(m);let h=``;O.participants.forEach(e=>{if(e.items.length>0){let t=e.items.map(e=>`${e.name} x${e.qty}`).join(`, `);h+=`• *${e.name}* : ${t}\n`}});let g=`Bonjour ${r.name}, voici la commande de groupe n°*${c}* (ID Groupe: ${O.id}) sur THIES Resto de la part de *${i}* (${a}).

👥 *Détails des participants* :
${h}
💰 *Total cumulé* : ${n} FCFA
🛵 *Mode* : ${o}
${s?`📍 *Adresse de livraison* : ${s}`:``}

Merci de nous confirmer la réception et le départ en préparation !`,_=`https://wa.me/${r.whatsapp.replace(/\+/g,``)}?text=${encodeURIComponent(g)}`,v=getSMSLink(r.whatsapp,g);O=null;let y=!navigator.onLine,b=y?`btn-secondary`:`btn-success`,ee=y?`btn-success`:`btn-secondary`,te=y?`<div style="background: rgba(220, 53, 69, 0.15); color: #ff6b6b; padding: 0.75rem; border-radius: 12px; font-size: 0.85rem; margin-bottom: 1rem; border: 1px solid rgba(220, 53, 69, 0.3); text-align: center; font-weight: 500;">
            🔌 Vous êtes HORS-LIGNE. Veuillez envoyer le récapitulatif groupé par SMS classique sécurisé ci-dessous.
           </div>`:`<p style="font-size: 0.85rem; color: var(--accent); margin-bottom: 1.5rem;">⚠️ Pour assurer une confirmation immédiate, veuillez transmettre le récapitulatif groupé par WhatsApp.</p>`;triggerCelebration();let ne=document.getElementById(`group-content-container`);ne.innerHTML=`
        <div class="confirmation-screen">
            <div class="confirmation-icon">👥✅</div>
            <h2>Commande de Groupe validée !</h2>
            <p style="color: var(--text-secondary); margin: 1rem 0;">La commande groupée n° <strong>${c}</strong> a été enregistrée.</p>
            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 12px; font-size: 0.9rem; text-align: left; margin: 1.5rem 0;">
                <strong>Responsable de groupe :</strong> ${i}<br>
                <strong>Montant total cumulé :</strong> ${n} FCFA
            </div>
            ${te}
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                <a href="${_}" target="_blank" class="btn ${b}">
                    💬 Confirmer par WhatsApp
                </a>
                <a href="${v}" class="btn ${ee}">
                    📱 Option Secours : Envoyer par SMS classique
                </a>
                <button class="btn btn-dark" onclick="router.navigate('/')">
                    Retourner à l'accueil
                </button>
            </div>
        </div>
    `,B(`Commande de groupe validée !`,`success`)}function et(e){let t=document.getElementById(`booking-content-container`),n=``;try{let t=e.openHours.split(`-`);if(t.length===2){let e=parseInt(t[0].trim().split(`:`)[0]),r=parseInt(t[1].trim().split(`:`)[0]);for(let t=e;t<(r<e?r+24:r);t++){let e=t%24,r=String(e).padStart(2,`0`);n+=`<option value="${r}:00">${r}:00</option>`,n+=`<option value="${r}:30">${r}:30</option>`}}}catch{n=`
            <option value="12:00">12:00</option>
            <option value="13:00">13:00</option>
            <option value="19:00">19:00</option>
            <option value="20:00">20:00</option>
            <option value="21:00">21:00</option>
        `}let r=new Date().toISOString().split(`T`)[0];t.innerHTML=`
        <form id="booking-form" onsubmit="submitBooking(event, '${e.id}')" style="background: var(--bg-card); padding: 1.5rem; border-radius: 20px; border: 1px solid var(--border);">
            <h3 style="font-size: 1.15rem; margin-bottom: 1.25rem;">Réserver une Table</h3>
            
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Prénom <span class="required">*</span></label>
                    <input type="text" id="booking-firstname" class="form-control" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Nom <span class="required">*</span></label>
                    <input type="text" id="booking-lastname" class="form-control" required>
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">Numéro WhatsApp <span class="required">*</span></label>
                <input type="tel" id="booking-phone" class="form-control" placeholder="+221 77 123 45 67" required>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Date souhaitée <span class="required">*</span></label>
                    <input type="date" id="booking-date" class="form-control" min="${r}" onchange="validateBookingDate('${e.id}')" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Heure souhaitée <span class="required">*</span></label>
                    <select id="booking-time" class="form-control" required>
                        ${n}
                    </select>
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">Nombre de personnes <span class="required">*</span></label>
                <input type="number" id="booking-guests" class="form-control" min="1" max="20" value="2" required>
            </div>
            
            <div class="form-group">
                <label class="form-label">Demande particulière / Note (Optionnel)</label>
                <textarea id="booking-note" class="form-control" placeholder="Table calme, anniversaire, chaise haute..."></textarea>
            </div>
            
            <button type="submit" class="btn btn-primary btn-block">
                Réserver ma table 📅
            </button>
        </form>
    `}function tt(e){let t=document.getElementById(`booking-date`),n=new Date(t.value).getDay();n===0&&(n=7),store.getRestaurantById(e).closedDays.includes(n)&&(B(`Désolé, le restaurant est fermé le ${K(n)}. Veuillez choisir une autre date.`,`danger`),t.value=``)}function nt(e,t){if(e.preventDefault(),!checkOrderRateLimit())return;let n=store.getRestaurantById(t),r=document.getElementById(`booking-firstname`).value.trim(),i=document.getElementById(`booking-lastname`).value.trim(),a=V(document.getElementById(`booking-phone`).value.trim()),o=document.getElementById(`booking-date`).value,s=document.getElementById(`booking-time`).value,c=document.getElementById(`booking-guests`).value,l=document.getElementById(`booking-note`).value.trim();if(!/^\+221(70|75|76|77|78)\d{7}$/.test(a.replace(/\s+/g,``))){B(`Numéro de téléphone sénégalais invalide (ex: +221 77 XXX XX XX)`,`danger`);return}let u=`RES-`+Math.floor(1e3+Math.random()*9e3),d={id:u,restaurantId:n.id,customerName:`${r} ${i}`,customerPhone:a,date:o,time:s,guests:parseInt(c),note:l,status:`En attente`};store.addReservation(d);let f=new Date(o).toLocaleDateString(`fr-FR`,{weekday:`long`,year:`numeric`,month:`long`,day:`numeric`}),p=`Bonjour ${n.name}, je souhaite réserver une table pour *${c} personnes* le *${f}* à *${s}* au nom de *${r} ${i}* (${a}).
${l?`📝 *Note particulière* : ${l}`:``}
 
Merci de me confirmer la disponibilité !`,m=`https://wa.me/${n.whatsapp.replace(/\+/g,``)}?text=${encodeURIComponent(p)}`,h=getSMSLink(n.whatsapp,p),g=!navigator.onLine,_=g?`btn-secondary`:`btn-success`,v=g?`btn-success`:`btn-secondary`,y=g?`<div style="background: rgba(220, 53, 69, 0.15); color: #ff6b6b; padding: 0.75rem; border-radius: 12px; font-size: 0.85rem; margin-bottom: 1rem; border: 1px solid rgba(220, 53, 69, 0.3); text-align: center; font-weight: 500;">
            🔌 Vous êtes HORS-LIGNE. Veuillez envoyer la demande par SMS classique sécurisé ci-dessous.
           </div>`:`<p style="font-size: 0.85rem; color: var(--accent); margin-bottom: 1.5rem;">⚠️ Le restaurant doit valider votre réservation. Envoyez le récapitulatif par WhatsApp pour bloquer votre table immédiatement.</p>`;triggerCelebration();let b=document.getElementById(`booking-content-container`);b.innerHTML=`
        <div class="confirmation-screen">
            <div class="confirmation-icon">📅✅</div>
            <h2>Réservation Enregistrée !</h2>
            <p style="color: var(--text-secondary); margin: 1rem 0;">Votre demande de réservation n° <strong>${u}</strong> est bien enregistrée.</p>
            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 12px; font-size: 0.9rem; text-align: left; margin: 1.5rem 0;">
                Nom : ${r} ${i}<br>
                Date & Heure : ${f} à ${s}<br>
                Couverts : <strong>${c} personnes</strong>
            </div>
            ${y}
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                <a href="${m}" target="_blank" class="btn ${_}">
                    💬 Confirmer par WhatsApp
                </a>
                <a href="${h}" class="btn ${v}">
                    📱 Option Secours : Envoyer par SMS classique
                </a>
                <button class="btn btn-dark" onclick="router.navigate('/')">
                    Retourner à l'accueil
                </button>
            </div>
        </div>
    `,B(`Réservation enregistrée !`,`success`)}function rt(e){let t=document.getElementById(`reviews-content-container`),n=e.reviews.reduce((e,t)=>e+t.rating,0),r=e.reviews.length>0?(n/e.reviews.length).toFixed(1):`0.0`,i=``;e.reviews.length===0?i=`<div style="text-align: center; color: var(--text-secondary); padding: 2rem 0;">Aucun avis pour l'instant. Soyez le premier !</div>`:e.reviews.forEach(t=>{let n=`★`.repeat(t.rating)+`☆`.repeat(5-t.rating),r=t.reply?`<div class="review-reply"><div class="review-reply-author">Réponse de ${e.name}</div>${t.reply}</div>`:``;i+=`
                <div class="review-item">
                    <div class="review-header">
                        <div>
                            <span class="review-author">${t.author}</span>
                            <div class="stars-rating" style="display:block; font-size: 0.8rem;">${n}</div>
                        </div>
                        <span class="review-date">${t.date}</span>
                    </div>
                    <p class="review-comment">${t.comment}</p>
                    ${r}
                </div>
            `}),t.innerHTML=`
        <div class="reviews-summary">
            <div class="rating-big-box">
                <div class="rating-big-num">${r}</div>
                <div class="stars-rating" style="font-size: 0.9rem;">${`★`.repeat(Math.round(r))}${`☆`.repeat(5-Math.round(r))}</div>
                <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">${e.reviews.length} avis</div>
            </div>
            <div style="flex-grow: 1;">
                <p style="font-size: 0.85rem; color: var(--text-secondary);">
                    Les avis proviennent de clients ayant commandé sur notre plateforme. Ils alimentent directement la note du restaurant.
                </p>
            </div>
        </div>

        <h3 style="font-size: 1.1rem; margin-bottom: 1rem;">Laisser un avis</h3>
        <form id="review-form" onsubmit="submitReview(event, '${e.id}')" style="background: var(--bg-card); padding: 1.25rem; border-radius: 16px; border: 1px solid var(--border); margin-bottom: 2rem;">
            <div class="form-group">
                <label class="form-label">Note</label>
                <div class="stars-selector" id="stars-selector-container">
                    <span onclick="setStarsSelector(1)">★</span>
                    <span onclick="setStarsSelector(2)">★</span>
                    <span onclick="setStarsSelector(3)">★</span>
                    <span onclick="setStarsSelector(4)">★</span>
                    <span onclick="setStarsSelector(5)">★</span>
                </div>
                <input type="hidden" id="review-rating-val" value="5">
            </div>
            
            <div class="form-group">
                <label class="form-label">Votre Nom <span class="required">*</span></label>
                <input type="text" id="review-author-name" class="form-control" placeholder="Seydou Kane" required>
            </div>
            
            <div class="form-group">
                <label class="form-label">Commentaire <span class="required">*</span></label>
                <textarea id="review-comment-text" class="form-control" placeholder="Racontez votre expérience..." required></textarea>
            </div>
            
            <button type="submit" class="btn btn-secondary btn-sm">Publier l'avis</button>
        </form>

        <h3 style="font-size: 1.1rem; margin-bottom: 1rem;">Tous les avis</h3>
        <div class="reviews-list">
            ${i}
        </div>
    `,at(5)}var it=5;function at(e){it=e;let t=document.getElementById(`review-rating-val`);t&&(t.value=e),document.querySelectorAll(`#stars-selector-container span`).forEach((t,n)=>{n<e?t.classList.add(`active`):t.classList.remove(`active`)})}function ot(e,t){e.preventDefault();let n=store.getRestaurantById(t),r=document.getElementById(`review-author-name`).value.trim(),i=document.getElementById(`review-comment-text`).value.trim(),a=parseInt(document.getElementById(`review-rating-val`).value),o=new Date().toISOString().split(`T`)[0],s={id:`rev_${n.id}_${Date.now()}`,author:r,rating:a,comment:i,date:o,reply:null};n.reviews.unshift(s),n.rating=n.reviews.reduce((e,t)=>e+t.rating,0)/n.reviews.length,n.reviewsCount=n.reviews.length,store.updateRestaurant(n.id,{reviews:n.reviews,rating:n.rating,reviewsCount:n.reviewsCount}),B(`Merci pour votre avis !`,`success`),q(n,`reviews`)}router.add(`#/vendor/:slug`,e=>{window.currentVendorSession&&window.currentVendorSession.slug===e?window.renderVendorDashboard():window.renderVendorLogin(e)}),router.add(`#/politique-client`,()=>{document.getElementById(`floating-cart-bar`).style.display=`none`,R(),window.scrollTo({top:0,behavior:`smooth`}),document.getElementById(`main-content`).innerHTML=`
        <section class="policy-page-container" style="max-width: 800px; margin: 3rem auto; padding: 2.5rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: 28px; box-shadow: var(--shadow);">
            <div style="margin-bottom: 2rem; border-bottom: 1px solid var(--border); padding-bottom: 1.5rem;">
                <span class="study-title-tag">⚖️ Mentions Légales</span>
                <h1 style="font-family: var(--font-serif); font-size: 2rem; color: var(--text-primary); margin-top: 0.5rem; margin-bottom: 0.25rem;">Politique d'utilisation — Espace Client</h1>
                <p style="color: var(--text-secondary); font-size: 0.9rem; font-style: italic;">Cette politique s'applique à toute personne utilisant la plateforme Thiès Resto pour consulter un menu, passer une commande, participer à une commande de groupe, réserver une table ou laisser un avis.</p>
            </div>
            
            <div class="policy-content" style="color: var(--text-secondary); line-height: 1.7; font-size: 0.95rem;">
                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">1. Aucun compte requis</h3>
                <p>Thiès Resto ne demande jamais la création d'un compte ni d'identifiants pour commander, réserver ou participer à une commande de groupe. Vous fournissez uniquement les informations nécessaires au traitement de votre demande : nom, prénom, et numéro de téléphone.</p>

                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">2. Informations que vous transmettez</h3>
                <p>Lorsque vous passez une commande, réservez une table, ou laissez un avis, vous transmettez au restaurant concerné :</p>
                <ul style="margin-left: 1.5rem; margin-bottom: 1rem; list-style-type: disc;">
                    <li>Votre nom et prénom</li>
                    <li>Votre numéro de téléphone (utilisé pour vous contacter sur WhatsApp au sujet de votre commande ou réservation)</li>
                    <li>Le détail de votre commande, votre mode de récupération choisi, et toute note ou demande particulière que vous indiquez</li>
                    <li>Pour une réservation : la date, l'heure et le nombre de personnes souhaité</li>
                </ul>
                <p>Ces informations sont transmises uniquement au restaurant concerné. Thiès Resto ne les revend à aucun tiers et ne les utilise pas à des fins publicitaires.</p>

                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">3. Commande de groupe</h3>
                <p>Si vous participez à une commande de groupe créée par une autre personne, votre prénom et le plat que vous choisissez sont visibles par les autres participants au sein de cette commande de groupe, ainsi que par le restaurant au moment de l'envoi de la commande complète.</p>

                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">4. Exactitude de vos informations</h3>
                <p>Vous êtes responsable de l'exactitude des informations que vous transmettez, notamment votre numéro de téléphone. Un numéro incorrect peut empêcher le restaurant de vous contacter pour confirmer votre commande ou votre réservation.</p>

                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">5. Paiement</h3>
                <p>Thiès Resto ne collecte aucun paiement en ligne. Le règlement de votre commande se fait directement auprès du restaurant, en espèces, à la livraison ou sur place, selon le mode que vous avez choisi. Thiès Resto n'intervient à aucune étape de cette transaction financière.</p>

                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">6. Avis clients</h3>
                <p>Si vous laissez un avis (note et commentaire) après une commande ou une réservation, celui-ci est rendu public sur la page du restaurant concerné. Le restaurant peut y répondre publiquement. Vous vous engagez à rédiger un avis sincère et respectueux. Thiès Resto se réserve le droit de masquer un avis manifestement abusif, injurieux ou sans rapport avec une expérience réelle.</p>

                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">7. Statut et disponibilité du restaurant</h3>
                <p>Les informations affichées (statut Ouvert/Fermé, menu du jour, créneaux de réservation disponibles) sont saisies et mises à jour par le restaurant lui-même. Thiès Resto ne garantit pas en temps réel l'exactitude absolue de ces informations en cas de retard de mise à jour par le restaurant. En cas de doute, le bouton de confirmation WhatsApp vous permet de vérifier directement auprès du restaurant.</p>

                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">8. Confirmation par WhatsApp</h3>
                <p>Après l'envoi d'une commande ou d'une réservation, un bouton vous permet d'envoyer également un message de confirmation directement au restaurant via WhatsApp. Cette étape est facultative mais recommandée, notamment en cas de connexion internet instable, pour vous assurer que votre demande a bien été reçue.</p>

                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">9. Programme de fidélité</h3>
                <p>Si le restaurant propose un programme de fidélité, vos points sont associés à votre numéro de téléphone et cumulés automatiquement à chaque commande validée. Aucune carte physique ni application n'est nécessaire. Les conditions exactes du programme (seuil de récompense, type de récompense) sont définies librement par chaque restaurant.</p>

                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">10. Responsabilité</h3>
                <p>Thiès Resto met en relation le client et le restaurant mais n'est pas partie à la transaction commerciale elle-même (préparation du repas, qualité du service, respect des horaires annoncés). Toute réclamation relative au déroulement d'une commande ou d'une réservation doit être adressée directement au restaurant concerné.</p>

                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">11. Évolutions de cette politique</h3>
                <p>Cette politique peut évoluer à mesure que de nouvelles fonctionnalités sont ajoutées à la plateforme. La version la plus récente est toujours disponible sur cette page.</p>

                <hr style="border: 0; border-top: 1px solid var(--border); margin: 2rem 0;">
                <p style="font-size: 0.85rem; font-style: italic; text-align: center;">Dernière mise à jour : juin 2026</p>
            </div>
            <div style="text-align: center; margin-top: 2rem;">
                <button class="btn btn-primary" onclick="router.navigate('/')">Retour à l'accueil</button>
            </div>
        </section>
    `}),router.add(`#/politique-admin`,()=>{document.getElementById(`floating-cart-bar`).style.display=`none`,R(),window.scrollTo({top:0,behavior:`smooth`}),document.getElementById(`main-content`).innerHTML=`
        <section class="policy-page-container" style="max-width: 800px; margin: 3rem auto; padding: 2.5rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: 28px; box-shadow: var(--shadow);">
            <div style="margin-bottom: 2rem; border-bottom: 1px solid var(--border); padding-bottom: 1.5rem;">
                <span class="study-title-tag">⚖️ Charte Resto</span>
                <h1 style="font-family: var(--font-serif); font-size: 2rem; color: var(--text-primary); margin-top: 0.5rem; margin-bottom: 0.25rem;">Politique d'utilisation — Espace Administrateur</h1>
                <p style="color: var(--text-secondary); font-size: 0.9rem; font-style: italic;">Cette politique s'applique au restaurant utilisant son tableau de bord Thiès Resto pour gérer son menu, ses commandes, ses réservations et ses avis clients.</p>
            </div>
            
            <div class="policy-content" style="color: var(--text-secondary); line-height: 1.7; font-size: 0.95rem;">
                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">1. Accès et compte</h3>
                <p>L'accès au tableau de bord administrateur est protégé par un identifiant et un mot de passe propres à votre restaurant. Vous êtes responsable de la confidentialité de ces identifiants. Ne les partagez qu'avec les membres de votre équipe autorisés à gérer les commandes et le menu.</p>
                <p>En cas de doute sur une utilisation non autorisée de votre compte, changez votre mot de passe immédiatement depuis l'onglet Paramètres.</p>

                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">2. Exactitude des informations publiées</h3>
                <p>Vous vous engagez à maintenir à jour les informations suivantes, visibles publiquement par vos clients :</p>
                <ul style="margin-left: 1.5rem; margin-bottom: 1rem; list-style-type: disc;">
                    <li>Le statut Ouvert / Fermé de votre restaurant, reflété en temps réel</li>
                    <li>Le menu du jour : plats disponibles, prix en FCFA, descriptions</li>
                    <li>Les horaires d'ouverture et les créneaux de réservation proposés</li>
                    <li>Vos coordonnées de contact (numéro WhatsApp, adresse)</li>
                </ul>
                <p>Une information erronée (plat indisponible affiché comme disponible, statut « Ouvert » alors que le restaurant est fermé) peut entraîner une mauvaise expérience client et nuire à votre réputation. Il est de votre responsabilité de garder ces données exactes.</p>

                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">3. Traitement des commandes et réservations</h3>
                <p>Chaque commande ou réservation reçue déclenche une notification immédiate sur votre tableau de bord et une option d'envoi WhatsApp. Vous vous engagez à :</p>
                <ul style="margin-left: 1.5rem; margin-bottom: 1rem; list-style-type: disc;">
                    <li>Traiter les commandes en attente dans un délai raisonnable</li>
                    <li>Mettre à jour le statut de chaque commande (Confirmée, Prête, Livrée) afin que le client soit informé automatiquement</li>
                    <li>Confirmer ou annuler les réservations de table dans un délai raisonnable avant la date prévue</li>
                    <li>Ne pas annuler une commande ou une réservation déjà confirmée sans en informer le client par WhatsApp</li>
                </ul>

                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">4. Gestion des avis clients</h3>
                <p>Les avis laissés par les clients sur votre page sont publics et ne peuvent pas être supprimés by the restaurant. Vous disposez d'un droit de réponse publique à chaque avis depuis votre tableau de bord. Les réponses doivent rester professionnelles et respectueuses, y compris face à un avis négatif ou injuste.</p>

                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">5. Paiement</h3>
                <p>Thiès Resto ne traite aucun paiement en ligne. Toutes les transactions financières (espèces ou tout autre moyen que vous acceptez) se déroulent directement entre vous et le client, à la livraison ou sur place. Thiès Resto n'intervient à aucun moment dans cette transaction et n'en est pas responsable.</p>

                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">6. Données collectées sur vos clients</h3>
                <p>Dans le cadre de l'utilisation de la plateforme, vous avez accès aux informations suivantes transmises par vos clients : nom, prénom, numéro de téléphone, contenu de leur commande ou réservation. Ces informations doivent être utilisées uniquement dans le cadre du service que vous proposez (traitement de la commande, organisation de la réservation, programme de fidélité) et ne doivent pas être réutilisées à d'autres fins, notamment commerciales, sans le consentement du client.</p>

                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">7. Disponibilité du service</h3>
                <p>Thiès Resto met tout en œuvre pour assurer la disponibilité continue du tableau de bord et de la page client. En cas de panne, de maintenance ou d'interruption de service, le restaurant en sera informé dans la mesure du possible. Thiès Resto ne peut être tenu responsable des pertes de commandes liées à une interruption de connexion internet ou de réseau mobile, locale au restaurant ou au client.</p>

                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">8. Modification ou suspension du compte</h3>
                <p>Le restaurant peut demander la suspension ou la fermeture de son espace à tout moment. Thiès Resto se réserve le droit de suspendre un compte en cas de non-respect manifeste de cette politique, notamment en cas d'informations délibérément trompeuses publiées sur la page client.</p>

                <h3 style="color: var(--text-primary); font-size: 1.2rem; margin: 1.5rem 0 0.5rem; font-family: var(--font-sans);">9. Évolutions de cette politique</h3>
                <p>Cette politique peut être amenée à évoluer à mesure que de nouvelles fonctionnalités sont ajoutées à la plateforme. Le restaurant sera informé de toute modification significative.</p>

                <hr style="border: 0; border-top: 1px solid var(--border); margin: 2rem 0;">
                <p style="font-size: 0.85rem; font-style: italic; text-align: center;">Dernière mise à jour : juin 2026</p>
            </div>
            <div style="text-align: center; margin-top: 2rem;">
                <button class="btn btn-primary" onclick="router.navigate('/')">Retour à l'accueil</button>
            </div>
        </section>
    `}),router.add(`#/tracking`,()=>{document.getElementById(`floating-cart-bar`).style.display=`none`,window.trackingSubscriptions||(window.trackingSubscriptions={}),document.getElementById(`main-content`).innerHTML=`
        <div style="max-width: 600px; margin: 0 auto; padding: 2rem 1.5rem; text-align: center; animation: fadeIn 0.4s ease;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">📍</div>
            <h2 style="color: var(--primary); margin-bottom: 0.5rem; font-size: 1.8rem;">Suivi de Commande</h2>
            <p style="color: var(--text-secondary); margin-bottom: 2rem; font-size: 0.95rem;">Entrez votre numéro de téléphone (WhatsApp) pour suivre l'état de votre commande en direct.</p>
            
            <div style="background: var(--bg-card); padding: 1.5rem; border-radius: 20px; border: 1px solid var(--border); box-shadow: var(--shadow);">
                <div style="display: flex; gap: 0.75rem; margin-bottom: 1rem;">
                    <input type="tel" id="tracking-phone" class="form-control" placeholder="+221 77 123 45 67" style="margin-bottom: 0;">
                    <button class="btn btn-primary" onclick="window.fetchOrderTracking()" style="white-space: nowrap;">Suivre 🔍</button>
                </div>
                <div id="tracking-result-container" style="text-align: left; margin-top: 1.5rem;">
                    <!-- Tracking results will appear here -->
                </div>
            </div>
        </div>
    `}),window.fetchOrderTracking=async function(){let e=document.getElementById(`tracking-phone`).value.trim();if(!e){B(`Veuillez saisir votre numéro`,`warning`);return}let t=V(e),n=document.getElementById(`tracking-result-container`);n.innerHTML=`<div style="text-align:center;"><div class="spinner-ring" style="width:30px;height:30px;border-width:3px;"></div></div>`;let r=[];try{if(supabaseClient)try{let{data:e,error:n}=await supabaseClient.rpc(`get_order_tracking`,{p_phone:t});if(!n&&e)r=e;else throw n||Error(`Supabase RPC failed`)}catch(e){console.warn(`Supabase fetch failed, falling back to local memory:`,e),r=store.data.orders.filter(e=>V(e.customerPhone)===t)}else r=store.data.orders.filter(e=>V(e.customerPhone)===t);if(!r||r.length===0){n.innerHTML=`<div style="text-align:center; padding: 2rem 0; color: var(--text-secondary);">Aucune commande récente trouvée pour ce numéro.</div>`;return}let e=``;r.forEach(t=>{let n=store.getRestaurantById(t.restaurant_id),r=n?n.name:`Restaurant inconnu`,i=`var(--text-secondary)`,a=`⏳`,o=25;t.status===`Reçue`?(i=`var(--accent)`,a=`⏳`,o=25):t.status===`Confirmée`||t.status===`Prête`?(i=`var(--primary)`,a=`👨‍🍳`,o=50):t.status===`Livrée`&&(i=`#20c997`,a=`✅`,o=100),e+=`
                <div id="track-card-${t.id}" style="background: var(--bg-secondary); padding: 1.5rem; border-radius: 16px; border: 1px solid var(--border); margin-bottom: 1rem; position: relative; overflow: hidden;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                        <div>
                            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Commande n° ${t.id}</div>
                            <h4 style="margin: 0; color: var(--text-primary); font-size: 1.1rem;">${r}</h4>
                        </div>
                        <div class="track-status-badge" style="background: rgba(255,255,255,0.1); padding: 0.35rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; color: ${i}; border: 1px solid ${i}; display: flex; align-items: center; gap: 0.3rem;">
                            <span>${a}</span> <span class="track-status-text">${t.status}</span>
                        </div>
                    </div>
                    <div style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.5rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                        ${t.items?t.items.map(e=>e.qty+`x `+e.name).join(`, `):``}
                    </div>
                    
                    <!-- Progress Bar -->
                    <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 10px; overflow: hidden; margin-bottom: 0.5rem;">
                        <div class="track-progress-bar" style="height: 100%; width: ${o}%; background: ${i}; transition: width 0.5s ease-out, background 0.5s ease-out;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-secondary);">
                        <span style="${o>=25?`color: var(--text-primary); font-weight:bold;`:``}">Reçue</span>
                        <span style="${o>=50?`color: var(--text-primary); font-weight:bold;`:``}">Confirmée</span>
                        <span style="${o>=100?`color: var(--text-primary); font-weight:bold;`:``}">Livrée</span>
                    </div>
                </div>
            `,window.trackingSubscriptions[t.id]||(window.trackingSubscriptions[t.id]=supabaseClient.channel(`track-`+t.id).on(`postgres_changes`,{event:`UPDATE`,schema:`public`,table:`orders`,filter:`id=eq.`+t.id},e=>{if(console.log(`Order update tracked:`,e),e.new.status!==e.old.status){let t=document.getElementById(`notification-sound`);t&&t.play().catch(e=>console.log(`Audio play blocked`,e)),window.fetchOrderTracking(),B(`🔔 Mise à jour : Votre commande est maintenant "${e.new.status}" !`,`success`)}}).subscribe())}),n.innerHTML=e}catch(e){console.error(e),n.innerHTML=`<p style="color: var(--danger); text-align: center;">Une erreur est survenue.</p>`}},router.add(`#/profile`,()=>{let e=document.getElementById(`main-content`),t=P(),n=localStorage.getItem(`customerPhone`)||``,r=localStorage.getItem(`customerName`)||``,i=localStorage.getItem(`customerAddress`)||``,a=``;t.length===0?a=`<div class="empty-history">Aucune commande passée pour le moment. Découvrez nos restaurants ! <br><button class="btn btn-primary" style="margin-top: 1rem;" onclick="router.navigate('/')">Voir les restaurants</button></div>`:t.forEach(e=>{let t=new Date(e.savedAt||e.created_at||Date.now()).toLocaleString(`fr-FR`,{day:`2-digit`,month:`short`,hour:`2-digit`,minute:`2-digit`}),n=``;n=Array.isArray(e.items)?e.items.map(e=>`${e.quantity}x ${e.name}`).join(`, `):`Détails non disponibles`,a+=`
                <div class="history-card">
                    <div class="history-header">
                        <strong>${e.restaurantName||`Restaurant Inconnu`}</strong>
                        <span style="color: var(--primary); font-weight: bold;">${e.total} FCFA</span>
                    </div>
                    <div class="history-items">
                        <p style="margin-bottom: 0.5rem;">${n}</p>
                        <small style="color: var(--text-secondary);">📅 ${t}</small>
                    </div>
                </div>
            `}),e.innerHTML=`
        <div id="profile-view">
            <h2 style="margin-bottom: 2rem; display: flex; align-items: center; gap: 0.5rem;">
                👤 Mon Espace Personnel
            </h2>
            
            <div class="profile-section">
                <h3 style="margin-bottom: 1rem; color: var(--primary);">Mes Informations</h3>
                <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.5rem;">Ces informations sont stockées localement sur votre appareil pour faciliter vos prochaines commandes.</p>
                <form id="profile-form" onsubmit="saveProfile(event)">
                    <div class="form-group">
                        <label>Nom Complet</label>
                        <input type="text" id="profile-name" class="form-control" value="${r}" placeholder="Votre nom" required>
                    </div>
                    <div class="form-group">
                        <label>Numéro de Téléphone</label>
                        <input type="tel" id="profile-phone" class="form-control" value="${n}" placeholder="Ex: 77 123 45 67" required>
                    </div>
                    <div class="form-group">
                        <label>Adresse de Livraison par défaut</label>
                        <input type="text" id="profile-address" class="form-control" value="${i}" placeholder="Quartier, Rue...">
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Enregistrer mes informations</button>
                </form>
            </div>
            
            <div class="profile-section">
                <h3 style="margin-bottom: 1rem; color: var(--accent);">Historique de Commandes</h3>
                <div class="history-list">
                    ${a}
                </div>
            </div>
        </div>
    `}),window.saveProfile=function(e){e.preventDefault();let t=document.getElementById(`profile-name`).value.trim(),n=document.getElementById(`profile-phone`).value.trim(),r=document.getElementById(`profile-address`).value.trim();t&&localStorage.setItem(`customerName`,t),n&&localStorage.setItem(`customerPhone`,n),r&&localStorage.setItem(`customerAddress`,r),B(`Profil enregistré avec succès !`,`success`)},router.add(`#/404`,()=>{document.getElementById(`main-content`).innerHTML=`
        <div style="text-align: center; padding: 5rem 1.5rem;">
            <h2>Page Non Trouvée (404)</h2>
            <p style="color: var(--text-secondary); margin: 1rem 0;">La page demandée n'existe pas.</p>
            <button class="btn btn-primary" onclick="router.navigate('/')">Retour à l'accueil</button>
        </div>
    `});var Q=null;window.startSocialProof=function(){Q&&clearInterval(Q);let e=document.getElementById(`social-proof-toast`);if(!e)return;let t=[`Fatou`,`Ousmane`,`Awa`,`Mamadou`,`Aminata`,`Cheikh`,`Ndeye`,`Ibrahima`,`Khadija`,`Fallou`],n=[(e,t,n)=>`<strong>${e}</strong> a commandé <em>${n}</em> chez <strong>${t}</strong>`,(e,t,n)=>`<strong>${e}</strong> a gagné +5 points fidélité chez <strong>${t}</strong>`,(e,t,n)=>`<strong>${e}</strong> a réservé une table chez <strong>${t}</strong>`],r=[];store.getRestaurants().filter(e=>e.status===`active`).forEach(e=>{e.menu&&Array.isArray(e.menu)&&e.menu.forEach(t=>{t.items&&Array.isArray(t.items)&&t.items.forEach(t=>r.push({dish:t.name,resto:e.name}))})}),r.length!==0&&(Q=setInterval(()=>{if(window.location.hash!==``&&window.location.hash!==`#/`)return;let i=t[Math.floor(Math.random()*t.length)],a=r[Math.floor(Math.random()*r.length)],o=n[Math.floor(Math.random()*n.length)],s=Math.floor(Math.random()*5)+1;e.innerHTML=`
            <div style="background: rgba(207,168,83,0.15); padding: 10px; border-radius: 50%; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; height: 40px; width: 40px; flex-shrink: 0;">🔥</div>
            <div>
                <p style="margin: 0; font-size: 0.85rem; font-weight: 400; line-height: 1.3;">${o(i,a.resto,a.dish)}</p>
                <p style="margin: 0; font-size: 0.75rem; color: var(--accent); margin-top: 3px; font-weight: bold;">Il y a ${s} min</p>
            </div>
        `,e.style.display=`flex`,e.offsetWidth,e.style.opacity=`1`,setTimeout(()=>{e.style.opacity=`0`,setTimeout(()=>{e.style.opacity===`0`&&(e.style.display=`none`)},500)},5e3)},12e3+Math.random()*8e3))},`serviceWorker`in navigator&&window.addEventListener(`load`,()=>{navigator.serviceWorker.register(`./sw.js`).then(e=>console.log(`Service Worker registered successfully.`,e.scope)).catch(e=>console.log(`Service Worker registration failed:`,e))}),window.addEventListener(`offline`,()=>{B(`🔌 Vous êtes hors-ligne. Vous pouvez toujours commander via l'option SMS classique !`,`warning`)}),window.addEventListener(`online`,()=>{B(`📶 Connexion Internet rétablie. Thiès à Table est de nouveau connecté au réseau.`,`success`)}),window.getSMSLink=function(e,t){return`sms:${e.replace(/\+/g,``).trim()}${/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream?`&`:`?`}body=${encodeURIComponent(t)}`},router.add(`#/cgv`,()=>st());function st(){let e=document.getElementById(`main-content`);e.innerHTML=`
        <div style="max-width: 800px; margin: 4rem auto; padding: 2.5rem; background: var(--bg-card); border-radius: 20px; border: 1px solid var(--border); box-shadow: var(--shadow);">
            <h1 style="color: var(--primary); margin-bottom: 2rem; font-family: var(--font-serif); font-size: 2.2rem;">Mentions Légales & CGV</h1>
            
            <div style="color: var(--text-secondary); line-height: 1.7; font-size: 0.95rem;">
                
                <h2 style="color: var(--text-primary); margin-top: 2rem; margin-bottom: 1rem; font-family: var(--font-serif); font-size: 1.5rem;">1. Mentions Légales</h2>
                <p><strong>Éditeur de la plateforme :</strong> NdiayeDigital</p>
                <p><strong>Plateforme :</strong> THIES Resto (thies-resto.com)</p>
                <p><strong>Contact :</strong> contact@thies-resto.com / +221 78 479 98 82</p>
                <p><strong>Hébergement :</strong> Vercel Inc. (USA) / Base de données : Supabase</p>
                <p>La plateforme THIES Resto est un annuaire et un outil de mise en relation dématérialisé dédié à la restauration dans la région de Thiès (Sénégal).</p>

                <h2 style="color: var(--text-primary); margin-top: 2.5rem; margin-bottom: 1rem; font-family: var(--font-serif); font-size: 1.5rem;">2. Conditions Générales d'Utilisation (CGU)</h2>
                <h3 style="color: var(--text-primary); margin-top: 1rem; font-size: 1.1rem;">2.1 Rôle de THIES Resto</h3>
                <p>THIES Resto agit exclusivement en tant qu'intermédiaire technique de mise en relation. La plateforme permet aux clients de consulter les menus et d'envoyer des commandes ou des réservations aux restaurants partenaires via WhatsApp et le tableau de bord de la plateforme.</p>
                
                <h3 style="color: var(--text-primary); margin-top: 1rem; font-size: 1.1rem;">2.2 Responsabilités</h3>
                <p><strong>THIES Resto ne prépare pas, ne vend pas et ne livre pas de repas.</strong> Par conséquent, les restaurants partenaires sont seuls responsables de :</p>
                <ul style="margin-left: 1.5rem; margin-bottom: 1rem; list-style-type: disc;">
                    <li>L'exactitude de leurs menus, prix et disponibilités.</li>
                    <li>La qualité, la conformité et l'hygiène des plats préparés.</li>
                    <li>Les délais de préparation et les conditions de livraison.</li>
                </ul>
                <p>En cas de litige, de retard, de non-conformité de la commande ou de problème d'intoxication alimentaire, <strong>le client s'engage à se retourner exclusivement et directement contre le restaurant concerné</strong>. La responsabilité de THIES Resto ne saurait être engagée à quelque titre que ce soit concernant la prestation de restauration.</p>

                <h2 style="color: var(--text-primary); margin-top: 2.5rem; margin-bottom: 1rem; font-family: var(--font-serif); font-size: 1.5rem;">3. Conditions Générales de Vente (CGV)</h2>
                <h3 style="color: var(--text-primary); margin-top: 1rem; font-size: 1.1rem;">3.1 Commandes et Tarifs</h3>
                <p>Les prix affichés sur la plateforme sont définis par les restaurants et incluent les taxes applicables au Sénégal. Les frais de livraison, s'ils existent, sont communiqués directement par le restaurant au client (notamment via WhatsApp) avant la confirmation finale.</p>
                
                <h3 style="color: var(--text-primary); margin-top: 1rem; font-size: 1.1rem;">3.2 Paiement</h3>
                <p>Aucun paiement n'est traité directement sur la plateforme THIES Resto. Le règlement s'effectue exclusivement en espèces (ou via un service de mobile money selon l'accord du restaurant) au moment de la livraison ou du retrait sur place.</p>

                <h3 style="color: var(--text-primary); margin-top: 1rem; font-size: 1.1rem;">3.3 Politique d'Annulation et de Remboursement</h3>
                <p>Étant donné que les paiements s'effectuent à la livraison, THIES Resto ne procède à <strong>aucun remboursement</strong>. Toute demande d'annulation de commande doit être formulée directement auprès du restaurant (via WhatsApp ou par appel) dans les plus brefs délais avant la préparation du repas. Si le repas livré n'est pas conforme, le litige commercial et la demande de dédommagement se règlent exclusivement entre le client et le restaurant partenaire.</p>

                <h2 style="color: var(--text-primary); margin-top: 2.5rem; margin-bottom: 1rem; font-family: var(--font-serif); font-size: 1.5rem;">4. Protection des Données (CDP Sénégal)</h2>
                <p>Dans le cadre de l'utilisation du service, les données suivantes sont collectées : Prénom et Numéro de téléphone. Ces données sont strictement utilisées pour :</p>
                <ul style="margin-left: 1.5rem; margin-bottom: 1rem; list-style-type: disc;">
                    <li>La transmission de la commande au restaurant.</li>
                    <li>Le suivi du programme de fidélité.</li>
                </ul>
                <p>Conformément à la législation sénégalaise sur la protection des données à caractère personnel (CDP), THIES Resto s'engage à ne jamais revendre ces données à des tiers. Vous disposez d'un droit d'accès et de suppression de vos données en contactant : contact@thies-resto.com.</p>
                
                <hr style="border: 0; border-top: 1px solid var(--border); margin: 2rem 0;">
                <p style="font-size: 0.85rem; font-style: italic; text-align: center;">Ces conditions sont acceptées implicitement par toute personne utilisant la plateforme.</p>
            </div>
            <div style="text-align: center; margin-top: 2.5rem;">
                <button class="btn btn-primary" onclick="router.navigate('/')">J'ai compris, retour à l'accueil</button>
            </div>
        </div>
    `}window.exportOrdersCSV=function(e){let t=store.getOrdersByRestaurant(e),n=`data:text/csv;charset=utf-8,`;n+=`ID,Date,Heure,Client,Telephone,Mode,Montant,Statut
`,t.forEach(function(e){let t=[e.id,e.date,e.time||``,e.customerName?e.customerName.replace(/,/g,``):``,e.customerPhone,e.mode,e.total,e.status].join(`,`);n+=t+`
`});let r=encodeURI(n),i=document.createElement(`a`);i.setAttribute(`href`,r),i.setAttribute(`download`,`commandes_`+new Date().toISOString().split(`T`)[0]+`.csv`),document.body.appendChild(i),i.click(),document.body.removeChild(i)},window.revenueChartInstance=null,window.renderRevenueChart=function(e){let t=document.getElementById(`revenueChart`);if(!t)return;let n=Array.from({length:7},(e,t)=>{let n=new Date;return n.setDate(n.getDate()-(6-t)),n.toISOString().split(`T`)[0]}),r={};n.forEach(e=>r[e]=0),e.forEach(e=>{e.status===`Livrée`&&r[e.date]!==void 0&&(r[e.date]+=e.total)}),window.revenueChartInstance&&window.revenueChartInstance.destroy(),typeof Chart<`u`&&(window.revenueChartInstance=new Chart(t,{type:`line`,data:{labels:n,datasets:[{label:`Chiffre d'Affaires (FCFA)`,data:Object.values(r),borderColor:`#cfa853`,backgroundColor:`rgba(207, 168, 83, 0.2)`,borderWidth:2,fill:!0,tension:.4}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{labels:{color:`#fff`}}},scales:{x:{ticks:{color:`rgba(255,255,255,0.7)`},grid:{color:`rgba(255,255,255,0.1)`}},y:{ticks:{color:`rgba(255,255,255,0.7)`},grid:{color:`rgba(255,255,255,0.1)`},beginAtZero:!0}}}}))},window.requestNotificationPermission=function(){`Notification`in window&&Notification.permission!==`granted`&&Notification.permission!==`denied`&&Notification.requestPermission()},window.setupRealtimeSubscriptions=function(){!supabaseClient||!currentRestaurantSession||!currentRestaurantSession.id||window.currentRealtimeSubscription||(`Notification`in window&&Notification.permission==="default"&&Notification.requestPermission(),window.currentRealtimeSubscription=supabaseClient.channel(`custom-insert-channel`).on(`postgres_changes`,{event:`INSERT`,schema:`public`,table:`orders`,filter:`restaurant_id=eq.${currentRestaurantSession.id}`},e=>{console.log(`New order via Realtime!`,e);let t={id:e.new.id,restaurantId:e.new.restaurant_id,customerName:e.new.customer_name,customerPhone:e.new.customer_phone,mode:e.new.mode,address:e.new.address,items:typeof e.new.items==`string`?JSON.parse(e.new.items):e.new.items,total:Number(e.new.total),note:e.new.note,status:e.new.status,date:e.new.date,time:e.new.time};if(!store.data.orders.find(e=>e.id===t.id)&&(store.data.orders.unshift(t),store.save(),`Notification`in window&&Notification.permission===`granted`?navigator.serviceWorker.ready.then(e=>{e.showNotification(`🔔 Nouvelle Commande!`,{body:`${t.customerName} a commandé pour ${t.total} FCFA.`,icon:`/icon.png`,vibrate:[200,100,200]})}):B(`🔔 Nouvelle commande de ${t.total} FCFA!`,`success`),window.location.hash===`#/dashboard`)){let e=store.getRestaurantById(currentRestaurantSession.id);e&&renderDashboardTabContent(e)}}).subscribe())};var ct=window.handleRestaurantLogin;ct&&(window.handleRestaurantLogin=async function(e){await ct(e),currentRestaurantSession&&(requestNotificationPermission(),setupRealtimeSubscriptions())}),window.submitCustomerReview=async function(e,t){if(!supabaseClient){B(`Service temporairement indisponible.`,`danger`);return}let n=parseInt(document.getElementById(`review-rating`).value),r=document.getElementById(`review-comment`).value.trim();document.getElementById(`checkout-review-section`).innerHTML=`<p style="text-align:center; color: var(--success); padding: 1rem;">Envoi de votre avis...</p>`;let{error:i}=await supabaseClient.rpc(`submit_restaurant_review`,{p_restaurant_id:e,p_customer_name:t||`Client Anonyme`,p_rating:n,p_comment:r});i?(console.error(`Review Error:`,i),B(`Erreur lors de l'envoi de l'avis.`,`danger`),document.getElementById(`checkout-review-section`).innerHTML=`<p style="text-align:center; color: var(--danger); padding: 1rem;">Échec de l'envoi.</p>`):(B(`Merci pour votre avis !`,`success`),document.getElementById(`checkout-review-section`).innerHTML=`
            <div style="text-align:center; padding: 2rem;">
                <h3 style="color: var(--success); margin-bottom: 0.5rem;">✅ Avis publié avec succès</h3>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">Votre retour a bien été pris en compte. Merci !</p>
            </div>
        `)},window.addEventListener(`offline`,()=>{let e=document.getElementById(`offline-banner`);e||(e=document.createElement(`div`),e.id=`offline-banner`,e.style.cssText=`position:fixed;top:0;left:0;width:100%;background:var(--danger);color:white;text-align:center;padding:12px;z-index:999999;font-weight:bold;font-size:0.9rem;box-shadow:0 4px 6px rgba(0,0,0,0.2);animation:slideDown 0.3s ease-out;`,e.innerHTML=`⚠️ Vous êtes hors connexion. Veuillez vérifier votre réseau.`,document.body.appendChild(e)),e.style.display=`block`}),window.addEventListener(`online`,()=>{let e=document.getElementById(`offline-banner`);e&&(e.style.display=`none`,typeof B==`function`&&B(`Connexion rétablie !`,`success`))});try{ke!==void 0&&(window.clientTracker=new ke),router.resolve()}catch(e){console.error(`Global Initialization Error:`,e),document.body.innerHTML+=`<div style="position:fixed;top:0;left:0;right:0;background:red;color:white;padding:20px;z-index:999999;">Erreur Critique d'Initialisation: ${e.message}</div>`}window.addEventListener(`error`,function(e){console.error(`Uncaught Error:`,e.message)}),document.addEventListener(`DOMContentLoaded`,()=>{typeof setupRealtime==`function`&&setupRealtime(),setTimeout(()=>{let e=document.getElementById(`sort-select`);e&&e.addEventListener(`change`,e=>{A=e.target.value,typeof U==`function`&&U()})},1e3)}),setInterval(()=>{if(typeof store<`u`&&store.syncFromSupabase){let e=document.activeElement;e&&(e.tagName===`INPUT`||e.tagName===`TEXTAREA`)||store.syncFromSupabase().then(()=>{})}},2e4),typeof supabaseClient<`u`&&supabaseClient&&(supabaseClient.channel(`realtime-menu-items`).on(`postgres_changes`,{event:`UPDATE`,schema:`public`,table:`menu_items`},e=>{let t=e.new;if(!t)return;console.log(`🔄 Realtime: menu_item mis à jour:`,t.name,`→`,t.is_available?`Disponible`:`Rupture`);let n=store.data.restaurants.find(e=>e.id===t.restaurant_id);if(n&&n.menu){let e=n.menu.find(e=>e.id===t.id);e&&(e.price=t.price,e.available=t.is_available,e.name=t.name||e.name)}let r=document.querySelector(`[data-menu-item-id="${t.id}"]`);if(r){if(t.is_available){r.style.opacity=`1`,r.style.filter=`none`,r.style.pointerEvents=`auto`;let e=r.querySelector(`.realtime-badge`);e&&e.remove()}else if(r.style.opacity=`0.4`,r.style.filter=`grayscale(100%)`,r.style.pointerEvents=`none`,!r.querySelector(`.realtime-badge`)){let e=document.createElement(`div`);e.className=`realtime-badge`,e.style.cssText=`position:absolute;top:10px;left:10px;background:var(--danger);color:white;padding:4px 10px;border-radius:20px;font-size:0.75rem;font-weight:700;z-index:5;`,e.textContent=`ÉPUISÉ`,r.style.position=`relative`,r.appendChild(e)}let e=r.querySelector(`.item-price, [data-price]`);e&&(e.textContent=Number(t.price).toLocaleString()+` FCFA`)}typeof B==`function`&&(t.is_available||B(`"${t.name}" est maintenant en rupture de stock`,`warning`))}).subscribe(),console.log(`📡 Realtime menu_items : Abonnement activé`));function lt(){let e=document.getElementById(`nav-actions`),t=document.getElementById(`mobile-logout-btn`);typeof currentRestaurantSession<`u`&&currentRestaurantSession?(e&&(e.innerHTML=`
            <span style="color: var(--text-secondary); font-size: 0.9rem; margin-right: 0.5rem;" class="desktop-only">👤 ${currentRestaurantSession.name||`Connecté`}</span>
            <button class="btn btn-outline desktop-only" style="padding: 0.4rem 1rem; font-size: 0.85rem;" onclick="handleLogout()">Déconnexion</button>
        `),t&&(t.style.display=`block`)):typeof isSuperAdminSession<`u`&&isSuperAdminSession?(e&&(e.innerHTML=`
            <span style="color: var(--text-secondary); font-size: 0.9rem; margin-right: 0.5rem;" class="desktop-only">👑 Admin</span>
            <button class="btn btn-outline desktop-only" style="padding: 0.4rem 1rem; font-size: 0.85rem;" onclick="handleLogout()">Déconnexion</button>
        `),t&&(t.style.display=`block`)):(e&&(e.innerHTML=`
            <button class="btn btn-primary" onclick="router.navigate('/auth')">Connexion Partenaire</button>
        `),t&&(t.style.display=`none`))}window.handleLogout=function(){typeof isSuperAdminSession<`u`&&isSuperAdminSession?typeof H==`function`&&H():typeof currentRestaurantSession<`u`&&currentRestaurantSession&&typeof T==`function`&&T();let e=document.getElementById(`mobile-logout-btn`);e&&(e.style.display=`none`),We(),router.navigate(`/`)};function ut(e){if(!e)return;document.title=e.name+` - THIES Resto | Menu & Livraison`;let t=(e,t)=>{let n=document.querySelector(`meta[property="${e}"]`)||document.querySelector(`meta[name="${e}"]`);n||(n=document.createElement(`meta`),n.setAttribute(e.startsWith(`og:`)?`property`:`name`,e),document.head.appendChild(n)),n.setAttribute(`content`,t)},n=`Découvrez le menu de ${e.name} sur Thiès Resto. Commandez vos plats et réservez votre table facilement.`,r=e.coverImage||`https://thies-resto.com/icon.png`;t(`description`,n),t(`og:title`,e.name+` - THIES Resto`),t(`og:description`,n),t(`og:image`,r),t(`twitter:title`,e.name+` - THIES Resto`),t(`twitter:description`,n),t(`twitter:image`,r)}function dt(e,t){document.title=e;let n=document.querySelector(`link[rel='icon']`)||document.createElement(`link`);n.rel=`icon`,n.href=t,document.head.appendChild(n);let r=document.querySelector(`link[rel='apple-touch-icon']`)||document.createElement(`link`);r.rel=`apple-touch-icon`,r.href=t,document.head.appendChild(r);let i=document.querySelector(`meta[property='og:image']`);i&&i.setAttribute(`content`,t);let a=document.querySelector(`meta[name='twitter:image']`);a&&a.setAttribute(`content`,t)}function ft(e,t){let n=document.getElementById(`seo-json-ld`);n&&n.remove();let r={};if(e===`home`)dt(`THIES Resto — Plateforme de Restauration Commune à Thiès`,`icon.png`),r={"@context":`https://schema.org`,"@type":`WebSite`,name:`THIES Resto`,url:`https://thies-resto.com/`,description:`L'application n°1 pour commander à manger et se faire livrer à Thiès.`};else if(e===`restaurant`&&t){dt(`Menu de ${t.name} - Livraison à Thiès`,t.coverImage||`icon.png`);let e=[];t.menu&&t.menu.length>0&&(e=t.menu.map(e=>({"@type":`MenuItem`,name:e.name,description:e.description,offers:{"@type":`Offer`,price:e.price,priceCurrency:`XOF`}}))),r={"@context":`https://schema.org`,"@type":`Restaurant`,name:t.name,image:t.coverImage||`https://thies-resto.com/icon.png`,address:{"@type":`PostalAddress`,addressLocality:`Thiès`,addressCountry:`SN`,streetAddress:t.address||`Thiès`},servesCuisine:t.category,aggregateRating:{"@type":`AggregateRating`,ratingValue:t.rating||`4.5`,reviewCount:t.reviewsCount||`10`},hasMenu:{"@type":`Menu`,name:`Menu de ${t.name}`,hasMenuItem:e}}}let i=document.createElement(`script`);i.id=`seo-json-ld`,i.type=`application/ld+json`,i.text=JSON.stringify(r),document.head.appendChild(i)}window.scrollToCatalog=function(){if(window.location.hash!==`#/`)router.navigate(`/`),setTimeout(function(){var e=document.getElementById(`catalog-section`);e&&e.scrollIntoView({behavior:`smooth`})},500);else{var e=document.getElementById(`catalog-section`);e&&e.scrollIntoView({behavior:`smooth`})}},window.openCartTab=function(){if(E&&E.restaurantId&&E.items.length>0){let e=store.getRestaurantById(E.restaurantId);if(e){window.location.hash.startsWith(`#/r/`+e.slug)?typeof J==`function`&&J(`checkout`):(router.navigate(`/r/`+e.slug),setTimeout(()=>{typeof J==`function`&&J(`checkout`)},100));return}}typeof J==`function`&&document.getElementById(`panel-checkout`)?J(`checkout`):(B(`Votre panier est vide. Choisissez un restaurant !`,`warning`),typeof z==`function`&&z())},window.requestPushNotifications=function(){if(!(`Notification`in window)){B(`Ce navigateur ne supporte pas les notifications système`,`danger`);return}Notification.requestPermission().then(e=>{e===`granted`?(B(`Notifications activées ! Vous serez alerté des nouvelles commandes.`,`success`),new Notification(`THIES Resto`,{body:`Les notifications fonctionnent parfaitement !`,icon:`icon.png`})):B(`Les notifications sont bloquées ou refusées.`,`warning`)})},window.geolocateRestaurants=function(){`geolocation`in navigator?(typeof B==`function`&&B(`Recherche GPS...`,`info`),navigator.geolocation.getCurrentPosition(async e=>{if(window.userLat=e.coords.latitude,window.userLng=e.coords.longitude,typeof B==`function`&&B(`Position trouvée ! Recherche des restaurants...`,`info`),typeof store<`u`&&store.syncFromSupabase){await store.syncFromSupabase(),typeof U==`function`&&U(),typeof B==`function`&&B(`Restaurants triés par proximité !`,`success`);let e=document.getElementById(`catalog-grid`);e&&e.scrollIntoView({behavior:`smooth`})}},e=>{typeof B==`function`&&B(`Erreur de géolocalisation. Veuillez autoriser l'accès.`,`error`)})):typeof B==`function`&&B(`La géolocalisation n'est pas supportée par votre navigateur.`,`error`)};var pt=null;window.setupRealtime=function(){typeof supabaseClient>`u`||!supabaseClient||(pt||=supabaseClient.channel(`public:orders`).on(`postgres_changes`,{event:`*`,schema:`public`,table:`orders`},e=>{if(console.log(`Realtime Order Event:`,e),window.location.hash===`#/dashboard`&&typeof currentRestaurantSession<`u`&&currentRestaurantSession&&e.new&&e.new.restaurant_id===currentRestaurantSession.id&&(e.eventType===`INSERT`&&(F(),typeof B==`function`&&B(`🔔 NOUVELLE COMMANDE REÇUE !`,`success`)),typeof store<`u`&&store.syncFromSupabase&&store.syncFromSupabase().then(()=>{typeof renderDashboardTabContent==`function`&&renderDashboardTabContent(currentRestaurantSession)})),window.location.hash===`#/tracking`){let t=localStorage.getItem(`trackingOrderId`);t&&e.new&&e.new.id===t&&(typeof store<`u`&&store.syncFromSupabase&&store.syncFromSupabase().then(()=>{typeof fetchOrderTracking==`function`&&fetchOrderTracking()}),e.eventType===`UPDATE`&&typeof B==`function`&&B(`Statut mis à jour : ${e.new.status}`,`info`))}}).subscribe(e=>{console.log(`Supabase Realtime Status:`,e)}))},window.playNotificationSound=function(){try{new Audio(`https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3`).play().catch(e=>console.warn(`Audio play requires user interaction first`,e))}catch(e){console.error(`Audio play failed:`,e)}},window.captureGPSCoordinates=function(){`geolocation`in navigator?(typeof B==`function`&&B(`Recherche GPS...`,`info`),navigator.geolocation.getCurrentPosition(e=>{document.getElementById(`settings-lat`).value=e.coords.latitude,document.getElementById(`settings-lng`).value=e.coords.longitude,typeof B==`function`&&B(`Coordonnées capturées !`,`success`)},e=>{typeof B==`function`&&B(`Veuillez autoriser la localisation.`,`error`)})):typeof B==`function`&&B(`Non supporté par le navigateur.`,`error`)};var $;window.addEventListener(`beforeinstallprompt`,e=>{e.preventDefault(),$=e,setTimeout(()=>{localStorage.getItem(`pwa_installed`)||mt()},5e3)});function mt(){if(document.getElementById(`pwa-install-banner`))return;let e=document.createElement(`div`);e.id=`pwa-install-banner`,e.style.cssText=`
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--bg-card);
        color: var(--text-primary);
        padding: 1rem;
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        border: 2px solid var(--primary);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        width: 90%;
        max-width: 400px;
        animation: fadeUp 0.5s ease-out;
    `,e.innerHTML=`
        <img src="icon.png" style="width: 50px; height: 50px; border-radius: 12px; border: 1px solid var(--border);">
        <div style="flex-grow: 1;">
            <strong style="display:block; margin-bottom: 0.25rem;">Installer THIES Resto</strong>
            <span style="font-size: 0.8rem; color: var(--text-secondary);">Pour commander en un clic !</span>
        </div>
        <button id="pwa-install-btn" class="btn btn-primary" style="padding: 0.5rem 1rem;">Installer</button>
        <button id="pwa-close-btn" style="background: none; border: none; color: var(--text-secondary); font-size: 1.5rem; cursor: pointer;">&times;</button>
    `,document.body.appendChild(e),document.getElementById(`pwa-install-btn`).addEventListener(`click`,async()=>{if(e.remove(),$){$.prompt();let{outcome:e}=await $.userChoice;e===`accepted`&&(localStorage.setItem(`pwa_installed`,`true`),typeof B==`function`&&B(`Merci d'avoir installé l'application !`,`success`)),$=null}}),document.getElementById(`pwa-close-btn`).addEventListener(`click`,()=>{e.remove(),localStorage.setItem(`pwa_installed`,`dismissed`)})}window.addEventListener(`appinstalled`,()=>{localStorage.setItem(`pwa_installed`,`true`);let e=document.getElementById(`pwa-install-banner`);e&&e.remove()}),window.toggleDishAvailability=function(e,t){if(!currentRestaurantSession)return;let n=!t,r=currentRestaurantSession.menu.find(t=>t.id===e);r&&(r.available=n),store.updateRestaurantData(currentRestaurantSession.id,{menu:JSON.stringify(currentRestaurantSession.menu)}).then(()=>{typeof supabaseClient<`u`&&supabaseClient&&supabaseClient.from(`menu_items`).update({is_available:n}).eq(`id`,e).then(({error:e})=>{e&&console.warn(`Could not update menu_items table`,e)}),typeof B==`function`&&B(n?`Plat disponible !`:`Plat marqué en rupture.`,n?`success`:`warning`),renderDashboardTabContent(currentRestaurantSession)})},typeof store<`u`&&store.syncPromise?store.syncPromise.then(()=>{router.start()}).catch(e=>{console.error(`Failed to load initial data:`,e),router.start()}):router.start(),window.addEventListener(`beforeinstallprompt`,e=>{if(e.preventDefault(),$=e,localStorage.getItem(`pwa_install_dismissed`))return;let t=document.getElementById(`pwa-install-banner`);t||(t=document.createElement(`div`),t.id=`pwa-install-banner`,t.innerHTML=`
            <div style="flex: 1;">
                <strong style="display:block; margin-bottom: 2px;">Installez Thies Resto 🚀</strong>
                <span style="font-size: 0.8rem; color: var(--text-secondary);">Pour commander plus rapidement.</span>
            </div>
            <div>
                <button class="btn btn-primary btn-sm" id="pwa-install-btn" style="margin-right: 5px;">Installer</button>
                <button class="btn btn-outline btn-sm" id="pwa-dismiss-btn" style="border:none; background:transparent; color:var(--text-secondary)">Plus tard</button>
            </div>
        `,t.style.cssText=`position: fixed; bottom: 85px; left: 10px; right: 10px; background: var(--bg-card); padding: 15px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: space-between; z-index: 1000; border: 1px solid var(--primary);`,document.body.appendChild(t),document.getElementById(`pwa-install-btn`).addEventListener(`click`,async()=>{if($){$.prompt();let{outcome:e}=await $.userChoice;$=null,t.remove()}}),document.getElementById(`pwa-dismiss-btn`).addEventListener(`click`,()=>{localStorage.setItem(`pwa_install_dismissed`,`true`),t.remove()}))}),document.addEventListener(`DOMContentLoaded`,()=>{localStorage.getItem(`cookie_consent`)||setTimeout(()=>{let e=document.createElement(`div`);e.innerHTML=`
                <div style="font-size: 0.85rem; flex: 1; padding-right: 15px;">Nous utilisons des cookies pour des analyses statistiques. Acceptez-vous ?</div>
                <div style="display:flex; gap: 10px; align-items: center;">
                    <button class="btn btn-primary btn-sm" id="accept-cookies">Oui</button>
                    <button class="btn btn-sm" id="reject-cookies" style="background:transparent; border:none; color:var(--text-secondary)">Non</button>
                </div>
            `,e.style.cssText=`position: fixed; top: 0; left: 0; right: 0; background: var(--bg-card); color: var(--text-primary); padding: 15px; z-index: 9999; box-shadow: 0 4px 10px rgba(0,0,0,0.1); display: flex; flex-direction: row; align-items: center; justify-content: space-between;`,document.body.appendChild(e),document.getElementById(`accept-cookies`).addEventListener(`click`,()=>{localStorage.setItem(`cookie_consent`,`true`),e.remove()}),document.getElementById(`reject-cookies`).addEventListener(`click`,()=>{localStorage.setItem(`cookie_consent`,`false`),e.remove()})},3e3)}),window.checkConsent=function(){if(!localStorage.getItem(`thies_resto_consent`)){var e=document.getElementById(`consent-banner`);e&&(e.style.display=`block`)}},window.acceptConsent=function(){localStorage.setItem(`thies_resto_consent`,`true`);var e=document.getElementById(`consent-banner`);e&&(e.style.display=`none`)},document.addEventListener(`DOMContentLoaded`,window.checkConsent),setTimeout(window.checkConsent,1e3),window.closeGeoModal=function(){var e=document.getElementById(`geo-modal`);e&&(e.style.display=`none`)},window.geolocateRestaurants=function(){var e=document.getElementById(`geo-modal`);e?e.style.display=`flex`:window.requestNativeGeolocation()},window.requestNativeGeolocation=function(){var e=document.getElementById(`geo-modal`);e&&(e.style.display=`none`),`geolocation`in navigator?(typeof B==`function`&&B(`Recherche GPS...`,`info`),navigator.geolocation.getCurrentPosition(async e=>{window.userLat=e.coords.latitude,window.userLng=e.coords.longitude,typeof B==`function`&&B(`Position trouvée ! Recherche des restaurants...`,`info`),typeof store<`u`&&store.syncFromSupabase&&(await store.syncFromSupabase(),typeof U==`function`&&U(),typeof W==`function`&&W(window.userLat,window.userLng,store.data.restaurants))},e=>{typeof B==`function`&&B(`Accès refusé ou erreur GPS.`,`danger`)},{timeout:1e4})):typeof B==`function`&&B(`La géolocalisation n'est pas supportée par votre navigateur.`,`danger`)},window.logoutRestaurant=T,window.handleForgotPassword=Ae,window.handleRestaurantRegister=je,window.toggleMobileMenu=Me,window.escapeHTML=Ne,window.sanitizeHTML=D,window.hideLoadingOverlay=Pe,window.toggleTheme=Fe,window.updateThemeToggleUI=j,window.loadSavedTheme=Ie,window.saveCart=M,window.loadCart=N,window.pulseCartBar=Le,window.checkSlugAvailabilityRealtime=Re,window.saveOrderToHistory=ze,window.getOrderHistory=P,window.playNotificationSound=F,window.startOrderPolling=Be,window.stopOrderPolling=R,window.scrollToHowItWorks=Ve,window.scrollToCatalog=z,window.handleRestaurantNameInput=He,window.checkSlugAvailability=Ue,window.showToast=B,window.cleanPhoneNumber=V,window.updateNavbar=We,window.logoutAdmin=H,window.setFilter=Ge,window.applyFilters=U,window.calculateDistance=Ke,window.showMapModal=W,window.filterRestaurantsList=qe,window.isRestaurantOpenNow=G,window.getDayName=K,window.renderRestaurantView=q,window.switchRestoTab=J,window.renderDishesTab=Je,window.addToCart=Ye,window.updateCartQty=Xe,window.recalculateCart=Y,window.updateFloatingCartBar=X,window.renderGroupTab=Z,window.toggleGroupAddressField=Ze,window.copyGroupLink=Qe,window.submitGroupOrder=$e,window.renderBookingTab=et,window.validateBookingDate=tt,window.submitBooking=nt,window.renderReviewsTab=rt,window.setStarsSelector=at,window.submitReview=ot,window.renderCGV=st,window.updateNav=lt,window.updateDynamicSEO=ut,window.setDynamicMeta=dt,window.updateSEO=ft,window.showInstallPromotion=mt,window.cart=E,window.activeGroupOrder=O,window.activeFilter=k,window.activeSortBy=A,window.orderChannel=I,window.currentSelectedRating=it,window.socialProofInterval=Q,window.originalHandleRestaurantLogin=ct,window.globalOrderSubscription=pt,window.ClientTracker=ke,window.logoutRestaurant=T,window.handleForgotPassword=Ae,window.handleRestaurantRegister=je,window.toggleMobileMenu=Me,window.escapeHTML=Ne,window.sanitizeHTML=D,window.hideLoadingOverlay=Pe,window.toggleTheme=Fe,window.updateThemeToggleUI=j,window.loadSavedTheme=Ie,window.saveCart=M,window.loadCart=N,window.pulseCartBar=Le,window.checkSlugAvailabilityRealtime=Re,window.saveOrderToHistory=ze,window.getOrderHistory=P,window.playNotificationSound=F,window.startOrderPolling=Be,window.stopOrderPolling=R,window.scrollToHowItWorks=Ve,window.scrollToCatalog=z,window.handleRestaurantNameInput=He,window.checkSlugAvailability=Ue,window.showToast=B,window.cleanPhoneNumber=V,window.updateNavbar=We,window.logoutAdmin=H,window.setFilter=Ge,window.applyFilters=U,window.calculateDistance=Ke,window.showMapModal=W,window.filterRestaurantsList=qe,window.isRestaurantOpenNow=G,window.getDayName=K,window.renderRestaurantView=q,window.switchRestoTab=J,window.renderDishesTab=Je,window.addToCart=Ye,window.updateCartQty=Xe,window.recalculateCart=Y,window.updateFloatingCartBar=X,window.renderGroupTab=Z,window.toggleGroupAddressField=Ze,window.copyGroupLink=Qe,window.submitGroupOrder=$e,window.renderBookingTab=et,window.validateBookingDate=tt,window.submitBooking=nt,window.renderReviewsTab=rt,window.setStarsSelector=at,window.submitReview=ot,window.renderCGV=st,window.updateNav=lt,window.updateDynamicSEO=ut,window.setDynamicMeta=dt,window.updateSEO=ft,window.showInstallPromotion=mt,window.cart=E,window.activeGroupOrder=O,window.activeFilter=k,window.activeSortBy=A,window.orderChannel=I,window.currentSelectedRating=it,window.socialProofInterval=Q,window.originalHandleRestaurantLogin=ct,window.globalOrderSubscription=pt,window.ClientTracker=ke,window.logoutRestaurant=T,window.handleForgotPassword=Ae,window.handleRestaurantRegister=je,window.toggleMobileMenu=Me,window.escapeHTML=Ne,window.sanitizeHTML=D,window.hideLoadingOverlay=Pe,window.toggleTheme=Fe,window.updateThemeToggleUI=j,window.loadSavedTheme=Ie,window.saveCart=M,window.loadCart=N,window.pulseCartBar=Le,window.checkSlugAvailabilityRealtime=Re,window.saveOrderToHistory=ze,window.getOrderHistory=P,window.playNotificationSound=F,window.startOrderPolling=Be,window.stopOrderPolling=R,window.scrollToHowItWorks=Ve,window.scrollToCatalog=z,window.handleRestaurantNameInput=He,window.checkSlugAvailability=Ue,window.showToast=B,window.cleanPhoneNumber=V,window.updateNavbar=We,window.logoutAdmin=H,window.setFilter=Ge,window.applyFilters=U,window.calculateDistance=Ke,window.showMapModal=W,window.filterRestaurantsList=qe,window.isRestaurantOpenNow=G,window.getDayName=K,window.renderRestaurantView=q,window.switchRestoTab=J,window.renderDishesTab=Je,window.addToCart=Ye,window.updateCartQty=Xe,window.recalculateCart=Y,window.updateFloatingCartBar=X,window.renderGroupTab=Z,window.toggleGroupAddressField=Ze,window.copyGroupLink=Qe,window.submitGroupOrder=$e,window.renderBookingTab=et,window.validateBookingDate=tt,window.submitBooking=nt,window.renderReviewsTab=rt,window.setStarsSelector=at,window.submitReview=ot,window.renderCGV=st,window.updateNav=lt,window.updateDynamicSEO=ut,window.setDynamicMeta=dt,window.updateSEO=ft,window.showInstallPromotion=mt,window.cart=E,window.activeGroupOrder=O,window.activeFilter=k,window.activeSortBy=A,window.orderChannel=I,window.currentSelectedRating=it,window.socialProofInterval=Q,window.originalHandleRestaurantLogin=ct,window.globalOrderSubscription=pt,window.ClientTracker=ke;
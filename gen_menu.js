const menuStr = `Thiébou Dieune bou wekh : 2 000 Frs
Thiébou Dieune bou Khonk : 2 000 Frs
Yassa Poulet : 2 500 Frs
Mafe Yapp : 2 500 Frs
Soupou Kandia : 2 500 Frs
C’est bon : 2 500 Frs
Thiébou Yapp : 2 500 Frs
Salade composée : 1 500 Frs
Salade exotique : 4 500 Frs
Frites : 1 000 Frs
Poulet entier : 7 000 Frs
Demi Poulet : 3 500 Frs
Gambas : 6 000 Frs
Crevettes : 4 000 Frs
Poisson Grillé : 4 000 Frs
Brochette de Lotte : 2 500 Frs
Brochette de Boeuf : 4 000 Frs
Filet de Boeuf : 7 000 Frs
Côte de Boeuf : 5 000 Frs
Dibi : 2 000 Frs
Dibi 500g : 3 500 Frs
Dibi 1kg : 7 000 Frs
Lakhass : 250 Frs
Dibi Poulet entier : 8 000 Frs
Dibi Moitié Poulet : 4 000 Frs
Sandwich : 1 000 Frs
Tacos Viande : 2 000 Frs
Burger : 1 500 Frs
Chawarma Royal : 2 000 Frs
Panini Jambon : 1 300 Frs
Panini Poulet : 1 800 Frs
Sandwich Poulet : 1 500 Frs
Chawarma Poulet : 2 000 Frs
Chawarma Viande : 1 500 Frs
Soupream Parisien : 1 500 Frs
Double Burger : 2 000 Frs
Norvégienne : 2 000 Frs
Fataya simple : 1 500 Frs
Fataya complet : 700 Frs
Tacos Poulet : 2 500 Frs
Burger Royale : 2 000 Frs
Petit Pois : 1 500 Frs
Tacos Mixte : 3 000 Frs
Pizza Poulet : 5 000 Frs
Pizza Margarite : 4 000 Frs
Pizza Fermière : 5 000 Frs
Pizza Chawarma : 5 000 Frs
Pizza Reine : 4 000 Frs
Pizza Jambon : 4 000 Frs
Pizza Orientale : 4 000 Frs
Pizza Mexicaine : 6 000 Frs
Crudité : 2 000 Frs
Athiéké : 2 500 Frs
Coucoulet : 4 000 Frs
Touffé : 3 000 Frs
Thiéré : 2 500 Frs
Légumes sautés : 2 000 Frs
Calamars + Crevettes : 4 500 Frs
Omelette Jambon : 3 000 Frs
Omelette Fromage : 3 000 Frs
Omelette Saucisson : 2 000 Frs
Plateau entrée : 10 000 Frs
Fruits de mer : 7 000 Frs
Plateau : 3 500 Frs
Salée : 3 000 Frs
Sucré : 2 000 Frs
Bouye Nestlé : 1 500 Frs
Bouye Fraise : 500 Frs
Bissap Rouge : 500 Frs
Bissap Blanc : 500 Frs
Torsade : 500 Frs
Pot Salade : 500 Frs
Cocktail de Fruits : 1 000 Frs
Pot de Jus : 500 Frs
Boisson Ira : 500 Frs
Boisson Fanta : 500 Frs
Bouteille Jus Petit Model : 500 Frs
Coca-Cola : 500 Frs
Wéli : 500 Frs
Vimto : 500 Frs
3 X Petit modèle : 1 000 Frs
3 X Grand Modèle : 1 000 Frs
Jus d Orange : 300 Frs
Café Simple : 500 Frs
Café Lavazze : 300 Frs
Café au Lait : 500 Frs
Thé : 300 Frs
Dessert Mousse au Chocolat : 1 500 Frs
Drops : 500 Frs
Chaussons Ananas : 500 Frs
Feuillettes Viande : 700 Frs
Feuillettes Jambon : 500 Frs
Feuillettes Hot Dog : 500 Frs
Gateaux 8 parts : 10 000 Frs
Gateaux 10 parts : 10 000 Frs
Cake : 500 Frs
Pli Pli : 500 Frs
Madeleine : 500 Frs
Pain Raisin : 500 Frs
Tarte Ananas : 500 Frs
Tarye Citron : 500 Frs`;
const items = menuStr.split('\n').filter(l => l.trim()).map((line, idx) => {
  const parts = line.split(':');
  const name = parts[0].trim();
  const price = parseInt(parts[1].replace(/[^0-9]/g, ''), 10);
  return { id: 'dish_abba_' + (idx + 1), name: name, description: '', price: price, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60' };
});
const fs = require('fs');
fs.writeFileSync('C:\\Users\\mouha\\OneDrive\\Desktop\\Thiés à Table\\temp_menu.json', JSON.stringify(items, null, 4));
console.log('Done');

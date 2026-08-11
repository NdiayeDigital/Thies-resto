const fs = require('fs');
const path = require('path');

// Génère un numéro de version unique basé sur le timestamp de déploiement
const version = Date.now();
console.log(`Starting cache-busting build process... Generated version: ${version}`);

const filesToProcess = ['index.html'];

filesToProcess.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Remplace toutes les occurrences de ?v=XXX par la nouvelle version générée
        // Cela force les navigateurs à télécharger les nouveaux fichiers CSS et JS
        content = content.replace(/\?v=[0-9]+/g, `?v=${version}`);
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Successfully updated cache versions in ${file}`);
    } else {
        console.warn(`File ${file} not found. Skipping.`);
    }
});

console.log('Build process completed successfully.');

const fs = require('fs');
const appJs = fs.readFileSync('C:\\Users\\mouha\\OneDrive\\Desktop\\Thiés à Table\\app.js', 'utf8');
const lines = appJs.split('\n');
lines.forEach((line, i) => {
    if (line.includes('const store = {') || line.includes('let store = {') || line.includes('var store = {') || line.includes('window.store = {')) {
        console.log(`Line ${i+1}: ${line.trim()}`);
    }
});

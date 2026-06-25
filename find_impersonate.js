const fs = require('fs');
const appJs = fs.readFileSync('C:\\Users\\mouha\\OneDrive\\Desktop\\Thiés à Table\\app.js', 'utf8');
const lines = appJs.split('\n');
let start = -1;
lines.forEach((line, i) => {
    if (line.includes('impersonateRestaurant')) {
        console.log(`Line ${i+1}: ${line.trim()}`);
        if (line.includes('function impersonateRestaurant') || line.includes('impersonateRestaurant =') || line.includes('window.impersonateRestaurant')) {
            start = i;
        }
    }
});
if (start !== -1) {
    console.log('--- Implementation ---');
    for (let j = start; j < start + 20 && j < lines.length; j++) {
        console.log(`${j+1}: ${lines[j]}`);
    }
}

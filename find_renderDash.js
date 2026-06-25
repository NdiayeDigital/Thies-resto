const fs = require('fs');
const appJs = fs.readFileSync('C:\\Users\\mouha\\OneDrive\\Desktop\\Thiés à Table\\app.js', 'utf8');
const lines = appJs.split('\n');
let start = -1;
lines.forEach((line, i) => {
    if (line.includes('function renderDashboard() {')) {
        start = i;
    }
});
if (start !== -1) {
    for (let j = start; j < start + 25 && j < lines.length; j++) {
        console.log(`${j+1}: ${lines[j]}`);
    }
}

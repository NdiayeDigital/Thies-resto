const fs = require('fs');
const appJs = fs.readFileSync('C:\\Users\\mouha\\OneDrive\\Desktop\\Thiés à Table\\app.js', 'utf8');
const lines = appJs.split('\n');
lines.forEach((line, i) => {
    if (line.includes('dashboardActiveTab === \'settings\'')) {
        console.log(`Line ${i+1}: ${line.trim()}`);
    }
});

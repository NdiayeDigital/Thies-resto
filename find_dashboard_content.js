const fs = require('fs');
const appJs = fs.readFileSync('C:\\Users\\mouha\\OneDrive\\Desktop\\Thiés à Table\\app.js', 'utf8');
const lines = appJs.split('\n');
let start = -1;
lines.forEach((line, i) => {
    if (line.includes("function renderDashboardTabContent(r) {")) {
        start = i;
    }
});
if (start !== -1) {
    for (let j = start + 500; j < start + 600 && j < lines.length; j++) {
        if (lines[j].includes('} else if (dashboardActiveTab === ')) {
            console.log(`Line ${j+1}: ${lines[j]}`);
        }
    }
}

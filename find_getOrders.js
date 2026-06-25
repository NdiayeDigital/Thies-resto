const fs = require('fs');
const appJs = fs.readFileSync('C:\\Users\\mouha\\OneDrive\\Desktop\\Thiés à Table\\app.js', 'utf8');
const lines = appJs.split('\n');
let foundStart = -1;
lines.forEach((line, i) => {
    if (line.includes('getOrdersByRestaurant(')) {
        foundStart = i;
    }
});
if (foundStart !== -1) {
    for (let j = foundStart; j < foundStart + 10 && j < lines.length; j++) {
        console.log(`${j+1}: ${lines[j]}`);
    }
}

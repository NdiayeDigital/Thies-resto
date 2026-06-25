const fs = require('fs');
let appJs = fs.readFileSync('C:\\Users\\mouha\\OneDrive\\Desktop\\Thiés à Table\\app.js', 'utf8');

const oldGetRestaurants = `    getRestaurants() {
        return this.data.restaurants;
    }`;

const newGetRestaurants = `    getRestaurants() {
        const currentDate = new Date();
        let changed = false;
        
        this.data.restaurants.forEach(r => {
            // Mock created date if not present. In a real DB, this is the registration date.
            const createdAt = new Date(r.createdAt || '2026-06-25T00:00:00Z');
            const diffTime = Math.abs(currentDate - createdAt);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            // Suspend restaurant if 3 months (90 days) free trial has expired and no paid package is active
            if (diffDays > 90 && r.status === 'active') {
                r.status = 'suspended';
                changed = true;
            }
        });
        
        if (changed) {
            this.save();
        }
        return this.data.restaurants;
    }`;

if (appJs.includes(oldGetRestaurants)) {
    appJs = appJs.replace(oldGetRestaurants, newGetRestaurants);
    fs.writeFileSync('C:\\Users\\mouha\\OneDrive\\Desktop\\Thiés à Table\\app.js', appJs);
    console.log('Successfully added expiration logic to getRestaurants');
} else {
    console.log('Could not find old getRestaurants function block');
}

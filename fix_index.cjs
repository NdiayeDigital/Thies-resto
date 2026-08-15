const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const target = `    <!-- Scripts Applicatifs -->
    <script src="js/logger.js"></script>
    <script src="js/data.js"></script>
    <script src="js/store.js"></script>
    <script src="js/router.js"></script>
    <script src="js/admin.js"></script>
    <script src="js/ui-checkout.js"></script>
    <script src="js/ui-vendor.js"></script>
    <script src="app.js"></script>`;

content = content.replace(target, '    <!-- Scripts Applicatifs (Vite) -->');
fs.writeFileSync('index.html', content);
console.log("Done");

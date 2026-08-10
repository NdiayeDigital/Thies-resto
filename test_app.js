const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const window = {
    addEventListener: () => {},
    location: { hash: '' },
    shuffledRestaurantIds: [],
    onerror: null,
    __earlyErrorHandler: null
};
const document = {
    getElementById: () => null,
    addEventListener: () => {},
    querySelector: () => null,
    documentElement: { getAttribute: () => null, setAttribute: () => {} },
    body: { appendChild: () => {}, innerHTML: '' },
    head: { appendChild: () => {} },
    createElement: () => ({})
};
const localStorage = { getItem: () => null, setItem: () => {} };
const sessionStorage = { getItem: () => null, setItem: () => {} };
const store = { getRestaurants: () => [] };
const router = { add: () => {}, navigate: () => {}, resolve: () => {} };
const navigator = { userAgent: 'test' };
const supabaseClient = null;

try {
    eval(code);
    console.log("No syntax/reference error on load!");
} catch (e) {
    console.error("Error on load:", e);
}

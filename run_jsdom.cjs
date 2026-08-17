const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');

const html = fs.readFileSync('C:/Users/OR/.gemini/antigravity-ide/brain/81c5cad4-3d0d-4622-83b8-2104a515192c/scratch/prod_html.html', 'utf8');
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("jsdomError", (err) => console.log("JSDOM ERROR:", err));

const dom = new JSDOM(html, { 
    url: "https://thies-resto.com/",
    runScripts: "dangerously",
    resources: "usable",
    virtualConsole
});

setTimeout(() => {
    fs.writeFileSync('jsdom_output.html', dom.window.document.body.innerHTML);
    console.log("HTML dumped.");
}, 5000);

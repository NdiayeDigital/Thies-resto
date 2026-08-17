const fs = require('fs');
let txt = fs.readFileSync('app.js', 'utf8');

// 1. Wrap the entire home page with x-data="catalogComponent()"
// so that searchQuery is defined in the hero section.
txt = txt.replace('container.innerHTML = `\n        <!-- ========== HERO SECTION ========== -->', 'container.innerHTML = `\n        <div x-data="catalogComponent()">\n        <!-- ========== HERO SECTION ========== -->');
txt = txt.replace('<section id="catalog-section" x-data="catalogComponent()">', '<section id="catalog-section">');
// Close the div before presentation section
txt = txt.replace('<!-- ========== PRESENTATION SECTION', '</div>\n\n        <!-- ========== PRESENTATION SECTION');

// 2. Fix the broken HTML in the x-for loop for restaurants
// I will extract the exact broken loop from my debug text and replace it with a clean structure
const brokenLoopStart = '<template x-for="r in filteredRestaurants" :key="r.id">';
const brokenLoopEndStr = '</div>\n                </template>\n            </div>';

const startIndex = txt.indexOf(brokenLoopStart);
const endIndex = txt.indexOf(brokenLoopEndStr, startIndex) + '</div>\n                </template>'.length;

const cleanLoop = `
                <template x-for="r in filteredRestaurants" :key="r.id">
                    <div class="glass-card" style="display: flex; padding: 1rem; margin: 0 1rem 1rem 1rem; cursor: pointer; border-radius: 20px; align-items: center; gap: 1rem;" @click="openRestaurant(r.slug)">
                        <img :src="r.coverImage || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&auto=format&fit=crop&q=60'" style="width: 80px; height: 80px; object-fit: cover; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.3);" :alt="r.name" loading="lazy">
                        <div style="flex: 1;">
                            <h3 style="margin: 0 0 0.25rem 0; font-size: 1.1rem; font-weight: 700; color: var(--text-primary);" x-text="r.name"></h3>
                            <p style="color: var(--text-secondary); font-size: 0.85rem; margin: 0 0 0.5rem 0;" x-text="r.category"></p>
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <div style="display: flex; align-items: center; gap: 0.2rem;">
                                    <span style="color: var(--primary); font-size: 0.9rem;">★</span>
                                    <span style="font-weight: 600; font-size: 0.85rem; color: var(--text-primary);" x-text="r.rating || '4.5'"></span>
                                </div>
                                <template x-if="isCurrentlyOpen(r)">
                                    <span style="color: var(--success); font-size: 0.8rem; font-weight: 600;">Ouvert</span>
                                </template>
                            </div>
                        </div>
                        <div style="color: var(--primary); font-size: 1.5rem;">➔</div>
                    </div>
                </template>
`;

if (startIndex !== -1 && endIndex > startIndex) {
    txt = txt.substring(0, startIndex) + cleanLoop + txt.substring(endIndex);
}

fs.writeFileSync('app.js', txt);

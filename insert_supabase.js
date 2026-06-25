const fs = require('fs');

const SUPABASE_URL = 'https://eyrayquciqyswshiwtwb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5cmF5cXVjaXF5c3dzaGl3dHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5MDQyNjQsImV4cCI6MjA5NzQ4MDI2NH0.8_VJvm9xiwmqX3oLD9L1b9W7r7T-b9OfJ2WIyST3FoM';

const tempMenu = JSON.parse(fs.readFileSync('C:\\Users\\mouha\\OneDrive\\Desktop\\Thiés à Table\\temp_menu.json', 'utf8'));

const newResto = {
    id: "r20",
    name: "Complexe ABOUL ABBAS",
    slug: "complexe-aboul-abbas",
    rating: 5.0,
    reviews_count: 0,
    category: "Traditionnel",
    address: "À préciser",
    whatsapp: "À préciser",
    open_hours: "08:00 - 23:00",
    closed_days: [],
    is_open_manual: true,
    status: "active",
    username: "id_complexeaboulabbas",
    password: "complexeaboulabbas221",
    cover_image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&auto=format&fit=crop&q=60",
    menu: tempMenu,
    reviews: []
};

async function insertResto() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/restaurants`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(newResto)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error inserting:', response.status, errorText);
            
            // If already exists, try to update
            if (response.status === 409) {
                 console.log("Restaurant already exists. Updating...");
                 const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/restaurants?id=eq.r20`, {
                    method: 'PATCH',
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newResto)
                 });
                 if (!updateResponse.ok) {
                     console.error('Error updating:', await updateResponse.text());
                 } else {
                     console.log('Successfully updated in Supabase!');
                 }
            }
        } else {
            console.log('Successfully inserted into Supabase!');
        }
    } catch(e) {
        console.error('Network Error:', e);
    }
}

insertResto();

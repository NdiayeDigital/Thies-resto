const SUPABASE_URL = 'https://eyrayquciqyswshiwtwb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5cmF5cXVjaXF5c3dzaGl3dHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5MDQyNjQsImV4cCI6MjA5NzQ4MDI2NH0.8_VJvm9xiwmqX3oLD9L1b9W7r7T-b9OfJ2WIyST3FoM';

async function verify() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/public_restaurants?select=id,name,menu`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        const data = await response.json();
        if (data.error) {
           console.log('Error fetching:', data);
           return;
        }
        const abbas = data.find(r => r.name.includes('ABOUL ABBAS'));
        if (abbas) {
            console.log('✅ Trouvé dans Supabase !');
            console.log('Nom:', abbas.name);
            console.log('ID:', abbas.id);
            console.log('Nombre de plats dans le menu:', abbas.menu ? abbas.menu.length : 0);
        } else {
            console.log('❌ Non trouvé dans Supabase. Les données actuelles :');
            console.log(data.map(r => r.name).join(', '));
        }
    } catch(e) {
        console.error(e);
    }
}
verify();

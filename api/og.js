export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/');
  
  const origin = url.origin;
  
  // If not a restaurant path, just pass through to index.html
  if (pathParts[1] !== 'r' || !pathParts[2]) {
    return await fetch(`${origin}/index.html`);
  }
  
  const slug = pathParts[2];
  
  const SUPABASE_URL = process.env.SUPABASE_URL || 'https://eyrayquciqyswshiwtwb.supabase.co';
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5cmF5cXVjaXF5c3dzaGl3dHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5MDQyNjQsImV4cCI6MjA5NzQ4MDI2NH0.8_VJvm9xiwmqX3oLD9L1b9W7r7T-b9OfJ2WIyST3FoM';
  
  let restaurant = null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/public_restaurants?slug=eq.${slug}&select=name,description`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) restaurant = data[0];
    }
  } catch (e) {
      console.error("Error fetching restaurant for SSR", e);
  }

  const indexRes = await fetch(`${origin}/index.html`);
  let html = await indexRes.text();
  
  if (restaurant) {
    const ogTitle = `${restaurant.name} - THIES Resto | Menu & Livraison`;
    // We don't have coverImage in the public_restaurants view directly if it was hidden, but assuming it's available or we can build it. 
    // Actually, we can fetch from 'restaurants' table if we use the service_role key, or if public_restaurants exposes it. Let's assume there's no cover image easily accessible here, we use a generic beautiful one or try to construct the URL.
    const ogImage = `https://eyrayquciqyswshiwtwb.supabase.co/storage/v1/object/public/restaurant-images/restaurants/${slug}_logo.jpg`; // Approximate
    const ogDesc = restaurant.description || `Commandez chez ${restaurant.name} en ligne sur THIES Resto. Livraison rapide à Thiès.`;
    
    html = html.replace('<title>THIES Resto - Commandez dans les meilleurs restaurants de Thiès</title>', `<title>${ogTitle}</title>`);
    html = html.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${ogTitle}">`);
    html = html.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${ogDesc}">`);
    html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${ogDesc}">`);
    // Attempt to replace image if exists
    html = html.replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${ogImage}">`);
  }
  
  return new Response(html, {
    headers: { 'content-type': 'text/html;charset=UTF-8' },
  });
}

import { db } from './index.ts';
import { restaurants, dishes, orders, subscriptions, customers, activityLogs, users } from './schema.ts';
import { eq, desc, or } from 'drizzle-orm';

// --- RESTAURANTS QUERIES ---
export async function getAllRestaurants() {
  try {
    return await db.select().from(restaurants).orderBy(restaurants.name);
  } catch (error) {
    console.error('Database query getAllRestaurants failed:', error);
    throw new Error('Impossible de récupérer la liste des restaurants.', { cause: error });
  }
}

export async function getRestaurantById(id: string) {
  try {
    const result = await db.select().from(restaurants).where(eq(restaurants.id, id));
    return result[0] || null;
  } catch (error) {
    console.error('Database query getRestaurantById failed:', error);
    throw new Error('Impossible de récupérer le restaurant demandé.', { cause: error });
  }
}

function cleanStringForSlug(str: string): string {
  return String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function upsertRestaurant(resto: any) {
  try {
    const rawId = String(resto.id || ('r' + Date.now()));
    let generatedSlug = cleanStringForSlug(resto.slug || resto.username || resto.name || rawId) || `resto-${rawId}`;
    let generatedUsername = cleanStringForSlug(resto.username || `id_${generatedSlug}`).replace(/-/g, '_') || `user_${rawId}`;

    const tags = Array.isArray(resto.popularTags)
      ? resto.popularTags.join(', ')
      : Array.isArray(resto.tags)
        ? resto.tags.join(', ')
        : (typeof resto.popularTags === 'string' ? resto.popularTags : (typeof resto.tags === 'string' ? resto.tags : ''));

    // 1. Check if restaurant exists by ID
    const existingById = await db.select().from(restaurants).where(eq(restaurants.id, rawId)).limit(1);

    if (existingById && existingById.length > 0) {
      const current = existingById[0];
      const targetSlug = resto.slug ? cleanStringForSlug(resto.slug) : current.slug;
      const targetUsername = resto.username ? cleanStringForSlug(resto.username).replace(/-/g, '_') : current.username;

      const result = await db.update(restaurants)
        .set({
          name: String(resto.name || current.name),
          slug: targetSlug || current.slug,
          category: String(resto.category || current.category),
          rating: String(resto.rating || current.rating),
          deliveryTime: String(resto.deliveryTime || resto.delivery_time || current.deliveryTime),
          minOrder: typeof resto.minOrder === 'number' ? resto.minOrder : (parseInt(resto.minOrder || resto.min_order, 10) || current.minOrder || 1000),
          deliveryFee: typeof resto.deliveryFee === 'number' ? resto.deliveryFee : (parseInt(resto.deliveryFee || resto.delivery_fee, 10) || current.deliveryFee || 500),
          image: String(resto.coverImage || resto.cover_image || resto.image || current.image || ''),
          description: String(resto.description || current.description || ''),
          address: String(resto.address || current.address || 'Thiès'),
          whatsapp: String(resto.whatsapp || resto.phone || current.whatsapp),
          phone: String(resto.phone || resto.whatsapp || current.phone),
          username: targetUsername || current.username,
          passwordHash: String(resto.passwordHash || resto.password || current.passwordHash),
          status: String(resto.status || current.status),
          plan: String(resto.plan || resto.subscriptionPack || current.plan || 'standard'),
          planExpiration: resto.planExpiration !== undefined ? resto.planExpiration : current.planExpiration,
          popularTags: tags || current.popularTags,
        })
        .where(eq(restaurants.id, rawId))
        .returning();

      return result[0];
    }

    // 2. Check if a restaurant exists by slug or username under a different ID
    const existingBySlugOrUser = await db.select().from(restaurants).where(
      or(eq(restaurants.slug, generatedSlug), eq(restaurants.username, generatedUsername))
    ).limit(1);

    if (existingBySlugOrUser && existingBySlugOrUser.length > 0) {
      const current = existingBySlugOrUser[0];
      const result = await db.update(restaurants)
        .set({
          name: String(resto.name || current.name),
          category: String(resto.category || current.category),
          rating: String(resto.rating || current.rating),
          deliveryTime: String(resto.deliveryTime || resto.delivery_time || current.deliveryTime),
          minOrder: typeof resto.minOrder === 'number' ? resto.minOrder : (parseInt(resto.minOrder || resto.min_order, 10) || current.minOrder || 1000),
          deliveryFee: typeof resto.deliveryFee === 'number' ? resto.deliveryFee : (parseInt(resto.deliveryFee || resto.delivery_fee, 10) || current.deliveryFee || 500),
          image: String(resto.coverImage || resto.cover_image || resto.image || current.image || ''),
          description: String(resto.description || current.description || ''),
          address: String(resto.address || current.address || 'Thiès'),
          whatsapp: String(resto.whatsapp || resto.phone || current.whatsapp),
          phone: String(resto.phone || resto.whatsapp || current.phone),
          status: String(resto.status || current.status),
          plan: String(resto.plan || resto.subscriptionPack || current.plan || 'standard'),
          planExpiration: resto.planExpiration !== undefined ? resto.planExpiration : current.planExpiration,
          popularTags: tags || current.popularTags,
        })
        .where(eq(restaurants.id, current.id))
        .returning();

      return result[0];
    }

    // 3. Guarantee slug and username uniqueness for a new restaurant insertion
    const slugCheck = await db.select({ id: restaurants.id }).from(restaurants).where(eq(restaurants.slug, generatedSlug)).limit(1);
    if (slugCheck.length > 0) {
      generatedSlug = `${generatedSlug}-${Date.now().toString(36)}`;
    }
    const userCheck = await db.select({ id: restaurants.id }).from(restaurants).where(eq(restaurants.username, generatedUsername)).limit(1);
    if (userCheck.length > 0) {
      generatedUsername = `${generatedUsername}_${Date.now().toString(36)}`;
    }

    const normalizedResto: typeof restaurants.$inferInsert = {
      id: rawId,
      name: String(resto.name || 'Restaurant'),
      slug: generatedSlug,
      category: String(resto.category || 'Sénégalais'),
      rating: String(resto.rating || '4.8'),
      deliveryTime: String(resto.deliveryTime || resto.delivery_time || '25-35 min'),
      minOrder: typeof resto.minOrder === 'number' ? resto.minOrder : (parseInt(resto.minOrder || resto.min_order, 10) || 1000),
      deliveryFee: typeof resto.deliveryFee === 'number' ? resto.deliveryFee : (parseInt(resto.deliveryFee || resto.delivery_fee, 10) || 500),
      image: String(resto.coverImage || resto.cover_image || resto.image || ''),
      description: String(resto.description || ''),
      address: String(resto.address || 'Thiès'),
      whatsapp: String(resto.whatsapp || resto.phone || '+221770000000'),
      phone: String(resto.phone || resto.whatsapp || '+221770000000'),
      username: generatedUsername,
      passwordHash: String(resto.passwordHash || resto.password || 'resto221'),
      status: String(resto.status || 'pending'),
      plan: String(resto.plan || resto.subscriptionPack || 'standard'),
      planExpiration: resto.planExpiration || null,
      popularTags: tags,
    };

    const result = await db.insert(restaurants)
      .values(normalizedResto)
      .onConflictDoUpdate({
        target: restaurants.id,
        set: {
          name: normalizedResto.name,
          slug: normalizedResto.slug,
          category: normalizedResto.category,
          rating: normalizedResto.rating,
          deliveryTime: normalizedResto.deliveryTime,
          minOrder: normalizedResto.minOrder,
          deliveryFee: normalizedResto.deliveryFee,
          image: normalizedResto.image,
          description: normalizedResto.description,
          address: normalizedResto.address,
          whatsapp: normalizedResto.whatsapp,
          phone: normalizedResto.phone,
          username: normalizedResto.username,
          status: normalizedResto.status,
          plan: normalizedResto.plan,
          planExpiration: normalizedResto.planExpiration,
          popularTags: normalizedResto.popularTags,
        },
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database query upsertRestaurant failed:', error);
    throw new Error("Impossible d'enregistrer le restaurant.", { cause: error });
  }
}

export async function updateRestaurantStatus(id: string, status: string) {
  try {
    const result = await db.update(restaurants)
      .set({ status })
      .where(eq(restaurants.id, id))
      .returning();
    return result[0] || null;
  } catch (error) {
    console.error('Database query updateRestaurantStatus failed:', error);
    throw new Error('Impossible de mettre à jour le statut du restaurant.', { cause: error });
  }
}

// --- DISHES QUERIES ---
export async function getDishesByRestaurant(restaurantId: string) {
  try {
    return await db.select().from(dishes).where(eq(dishes.restaurantId, restaurantId));
  } catch (error) {
    console.error('Database query getDishesByRestaurant failed:', error);
    throw new Error('Impossible de récupérer les plats.', { cause: error });
  }
}

export async function upsertDish(dish: typeof dishes.$inferInsert) {
  try {
    const result = await db.insert(dishes)
      .values(dish)
      .onConflictDoUpdate({
        target: dishes.id,
        set: {
          name: dish.name,
          category: dish.category,
          price: dish.price,
          image: dish.image,
          description: dish.description,
          available: dish.available,
          isPopular: dish.isPopular,
        },
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database query upsertDish failed:', error);
    throw new Error("Impossible d'enregistrer le plat.", { cause: error });
  }
}

// --- ORDERS QUERIES ---
export async function getAllOrders() {
  try {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  } catch (error) {
    console.error('Database query getAllOrders failed:', error);
    throw new Error('Impossible de récupérer les commandes.', { cause: error });
  }
}

export async function getOrdersByRestaurant(restaurantId: string) {
  try {
    return await db.select().from(orders).where(eq(orders.restaurantId, restaurantId)).orderBy(desc(orders.createdAt));
  } catch (error) {
    console.error('Database query getOrdersByRestaurant failed:', error);
    throw new Error('Impossible de récupérer les commandes du restaurant.', { cause: error });
  }
}

export async function createOrder(order: typeof orders.$inferInsert) {
  try {
    const result = await db.insert(orders)
      .values(order)
      .onConflictDoUpdate({
        target: orders.id,
        set: {
          status: order.status,
          paymentStatus: order.paymentStatus,
          total: order.total,
          items: order.items,
        },
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database query createOrder failed:', error);
    throw new Error("Impossible d'enregistrer la commande.", { cause: error });
  }
}

export async function updateOrderStatus(id: string, status: string) {
  try {
    const result = await db.update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return result[0] || null;
  } catch (error) {
    console.error('Database query updateOrderStatus failed:', error);
    throw new Error('Impossible de mettre à jour le statut de la commande.', { cause: error });
  }
}

// --- SUBSCRIPTIONS QUERIES ---
export async function getAllSubscriptions() {
  try {
    return await db.select().from(subscriptions).orderBy(desc(subscriptions.createdAt));
  } catch (error) {
    console.error('Database query getAllSubscriptions failed:', error);
    throw new Error('Impossible de récupérer les abonnements.', { cause: error });
  }
}

export async function createSubscription(sub: typeof subscriptions.$inferInsert) {
  try {
    const result = await db.insert(subscriptions).values(sub).returning();
    return result[0];
  } catch (error) {
    console.error('Database query createSubscription failed:', error);
    throw new Error("Impossible d'enregistrer l'abonnement.", { cause: error });
  }
}

// --- ACTIVITY LOGS QUERIES ---
export async function getAllActivityLogs(limitCount = 100) {
  try {
    return await db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt)).limit(limitCount);
  } catch (error) {
    console.error('Database query getAllActivityLogs failed:', error);
    throw new Error('Impossible de récupérer le journal d’audit.', { cause: error });
  }
}

export async function logActivity(log: typeof activityLogs.$inferInsert) {
  try {
    const result = await db.insert(activityLogs).values(log).returning();
    return result[0];
  } catch (error) {
    console.error('Database query logActivity notice:', error);
    return null;
  }
}

// --- SEED 30 RESTAURANTS IN THIÈS ---
export async function seedInitialThièsRestaurants(seedList: any[]) {
  try {
    const existing = await db.select().from(restaurants);
    if (existing.length >= 25) {
      return { count: existing.length, seeded: false };
    }

    let insertedCount = 0;
    for (const r of seedList) {
      await db.insert(restaurants).values({
        id: r.id,
        name: r.name,
        slug: r.slug || r.id,
        category: r.category || 'Sénégalais',
        rating: String(r.rating || '4.8'),
        deliveryTime: r.deliveryTime || r.delivery_time || '25-40 min',
        minOrder: Number(r.minOrder || r.min_order || 1000),
        deliveryFee: Number(r.deliveryFee || r.delivery_fee || 500),
        image: r.coverImage || r.cover_image || r.image || '',
        description: r.description || `Restaurant authentique à Thiès - ${r.address || 'Thiès'}`,
        address: r.address || 'Thiès',
        whatsapp: r.whatsapp || '+221770000000',
        phone: r.phone || r.whatsapp || '+221770000000',
        username: r.username || `id_${r.slug || r.id}`,
        passwordHash: r.password || 'resto221',
        status: r.status || 'active',
        plan: r.subscriptionPack || 'standard',
        popularTags: Array.isArray(r.tags) ? r.tags.join(', ') : (r.popular_tags || ''),
      }).onConflictDoNothing();
      insertedCount++;
    }

    return { count: insertedCount, seeded: true };
  } catch (error) {
    console.error('Error seeding initial Thiès restaurants:', error);
    return { count: 0, seeded: false, error };
  }
}

// --- CUSTOMERS QUERIES ---
export async function getAllCustomers() {
  try {
    return await db.select().from(customers).orderBy(desc(customers.createdAt));
  } catch (error) {
    console.warn('Database query getAllCustomers notice:', error);
    return [];
  }
}

export async function upsertCustomer(cust: { id?: string; phone: string; name: string; email?: string; address?: string }) {
  try {
    const custId = cust.id || ('cust_' + String(cust.phone).replace(/\D/g, ''));
    const result = await db.insert(customers)
      .values({
        id: custId,
        phone: cust.phone,
        name: cust.name,
        email: cust.email || '',
        address: cust.address || '',
      })
      .onConflictDoUpdate({
        target: customers.phone,
        set: {
          name: cust.name,
          email: cust.email || '',
          address: cust.address || '',
        }
      })
      .returning();
    return result[0];
  } catch (error) {
    console.warn('Database query upsertCustomer notice:', error);
    return null;
  }
}

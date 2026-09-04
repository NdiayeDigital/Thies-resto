import { db } from './index.ts';
import { restaurants, dishes, orders, subscriptions, customers, activityLogs, users } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

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

export async function upsertRestaurant(resto: typeof restaurants.$inferInsert) {
  try {
    const result = await db.insert(restaurants)
      .values(resto)
      .onConflictDoUpdate({
        target: restaurants.id,
        set: {
          name: resto.name,
          category: resto.category,
          rating: resto.rating,
          deliveryTime: resto.deliveryTime,
          minOrder: resto.minOrder,
          deliveryFee: resto.deliveryFee,
          image: resto.image,
          description: resto.description,
          address: resto.address,
          whatsapp: resto.whatsapp,
          phone: resto.phone,
          status: resto.status,
          plan: resto.plan,
          planExpiration: resto.planExpiration,
          popularTags: resto.popularTags,
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

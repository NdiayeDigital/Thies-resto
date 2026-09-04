import { pgTable, text, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';

// Users table (integrated with Firebase Auth UID)
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  role: text('role').default('customer'), // 'customer' | 'restaurant_manager' | 'superadmin'
  createdAt: timestamp('created_at').defaultNow(),
});

// Restaurants table for 30+ establishments in Thiès
export const restaurants = pgTable('restaurants', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  category: text('category').notNull().default('Sénégalais'),
  rating: text('rating').default('4.8'),
  deliveryTime: text('delivery_time').default('25-40 min'),
  minOrder: integer('min_order').default(1000),
  deliveryFee: integer('delivery_fee').default(500),
  image: text('image').default(''),
  description: text('description').default(''),
  address: text('address').notNull().default('Thiès'),
  whatsapp: text('whatsapp').notNull().default('+221770000000'),
  phone: text('phone').default('+221770000000'),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').default(''),
  status: text('status').notNull().default('active'), // 'active' | 'trial' | 'inactive' | 'pending'
  plan: text('plan').default('standard'), // 'standard' | 'enterprise' | 'vip'
  planExpiration: text('plan_expiration'),
  popularTags: text('popular_tags').default(''),
  createdAt: timestamp('created_at').defaultNow(),
});

// Dishes / Menus table
export const dishes = pgTable('dishes', {
  id: text('id').primaryKey(),
  restaurantId: text('restaurant_id').notNull(),
  name: text('name').notNull(),
  category: text('category').notNull().default('Plat principal'),
  price: integer('price').notNull().default(1500),
  image: text('image').default(''),
  description: text('description').default(''),
  available: boolean('available').notNull().default(true),
  isPopular: boolean('is_popular').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Orders table
export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  restaurantId: text('restaurant_id').notNull(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerAddress: text('customer_address').default('Thiès'),
  customerCity: text('customer_city').default('Thiès'),
  mode: text('mode').default('Livraison'), // 'Livraison' | 'À emporter'
  paymentMethod: text('payment_method').default('Espèces'), // 'Espèces' | 'Wave' | 'Orange Money' | 'Free Money' | 'Carte'
  paymentStatus: text('payment_status').default('unpaid'), // 'unpaid' | 'paid' | 'pending'
  total: integer('total').notNull().default(0),
  items: jsonb('items').default([]),
  status: text('status').notNull().default('En attente'), // 'En attente' | 'En préparation' | 'Prête' | 'En livraison' | 'Livrée' | 'Annulée'
  note: text('note').default(''),
  date: text('date').default(''),
  time: text('time').default(''),
  createdAt: timestamp('created_at').defaultNow(),
});

// Subscriptions table (SaaS model & renewals)
export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey(),
  restaurantId: text('restaurant_id').notNull(),
  restaurantName: text('restaurant_name').notNull(),
  plan: text('plan').notNull(),
  amount: integer('amount').notNull(),
  paymentMethod: text('payment_method').default('Wave'),
  paymentReference: text('payment_reference'),
  status: text('status').default('active'),
  date: text('date'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Customers table
export const customers = pgTable('customers', {
  id: text('id').primaryKey(),
  phone: text('phone').notNull().unique(),
  name: text('name').notNull(),
  email: text('email'),
  neighborhood: text('neighborhood').default('Thiès'),
  address: text('address'),
  ordersCount: integer('orders_count').default(0),
  totalSpent: integer('total_spent').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Audit Trail / Activity Logs
export const activityLogs = pgTable('activity_logs', {
  id: text('id').primaryKey(),
  action: text('action').notNull(),
  entityType: text('entity_type').default('system'),
  entityId: text('entity_id'),
  actor: text('actor').default('System'),
  details: text('details').default(''),
  ipAddress: text('ip_address').default('127.0.0.1'),
  createdAt: timestamp('created_at').defaultNow(),
});

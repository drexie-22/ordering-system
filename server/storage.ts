import {
  products,
  orders,
  orderItems,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type OrderWithItems,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, ilike, or, sql } from "drizzle-orm";

export interface IStorage {
  // Products
  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  searchProducts(query: string): Promise<Product[]>;
  filterProducts(category?: string, minPrice?: number, maxPrice?: number): Promise<Product[]>;
  
  // Orders
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  getAllOrders(): Promise<OrderWithItems[]>;
  getOrderById(id: number): Promise<OrderWithItems | undefined>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Reports
  getReports(): Promise<{ totalProducts: number; totalOrders: number; totalRevenue: number }>;
}

export class DatabaseStorage implements IStorage {
  // Products
  async getAllProducts(): Promise<Product[]> {
    return db.select().from(products).orderBy(desc(products.createdAt));
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values(product)
      .returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updated] = await db
      .update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async searchProducts(query: string): Promise<Product[]> {
    return db
      .select()
      .from(products)
      .where(
        or(
          ilike(products.name, `%${query}%`),
          ilike(products.description, `%${query}%`)
        )
      )
      .orderBy(desc(products.createdAt));
  }

  async filterProducts(category?: string, minPrice?: number, maxPrice?: number): Promise<Product[]> {
    const conditions = [];
    
    if (category) {
      conditions.push(eq(products.category, category));
    }
    if (minPrice !== undefined) {
      conditions.push(gte(products.price, minPrice));
    }
    if (maxPrice !== undefined) {
      conditions.push(lte(products.price, maxPrice));
    }

    if (conditions.length === 0) {
      return this.getAllProducts();
    }

    return db
      .select()
      .from(products)
      .where(and(...conditions))
      .orderBy(desc(products.createdAt));
  }

  // Orders
  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    return await db.transaction(async (tx) => {
      const [newOrder] = await tx
        .insert(orders)
        .values(order)
        .returning();

      const orderItemsWithOrderId = items.map((item) => ({
        ...item,
        orderId: newOrder.id,
      }));

      await tx.insert(orderItems).values(orderItemsWithOrderId);

      for (const item of items) {
        await tx
          .update(products)
          .set({
            stock: sql`${products.stock} - ${item.quantity}`,
          })
          .where(eq(products.id, item.productId));
      }

      return newOrder;
    });
  }

  async getAllOrders(): Promise<OrderWithItems[]> {
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));

    const ordersWithItems = await Promise.all(
      allOrders.map(async (order) => {
        const items = await db
          .select({
            id: orderItems.id,
            orderId: orderItems.orderId,
            productId: orderItems.productId,
            quantity: orderItems.quantity,
            subtotal: orderItems.subtotal,
            product: products,
          })
          .from(orderItems)
          .innerJoin(products, eq(orderItems.productId, products.id))
          .where(eq(orderItems.orderId, order.id));

        return {
          ...order,
          orderItems: items,
        };
      })
    );

    return ordersWithItems;
  }

  async getOrderById(id: number): Promise<OrderWithItems | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));

    if (!order) {
      return undefined;
    }

    const items = await db
      .select({
        id: orderItems.id,
        orderId: orderItems.orderId,
        productId: orderItems.productId,
        quantity: orderItems.quantity,
        subtotal: orderItems.subtotal,
        product: products,
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, order.id));

    return {
      ...order,
      orderItems: items,
    };
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [updated] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return updated || undefined;
  }

  // Reports
  async getReports(): Promise<{ totalProducts: number; totalOrders: number; totalRevenue: number }> {
    const [productCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(products);

    const [orderCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(orders);

    const [revenueResult] = await db
      .select({ total: sql<number>`COALESCE(sum(${orders.totalAmount}), 0)::float` })
      .from(orders);

    return {
      totalProducts: productCount?.count || 0,
      totalOrders: orderCount?.count || 0,
      totalRevenue: revenueResult?.total || 0,
    };
  }
}

export const storage = new DatabaseStorage();

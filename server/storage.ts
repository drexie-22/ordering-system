import type {
  Product,
  Order,
  OrderItem,
  InsertProduct,
  InsertOrder,
  InsertOrderItem,
  OrderWithItems,
} from "@shared/types";
import prisma from "./db";

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
    return await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const product = await prisma.product.findUnique({
      where: { id }
    });
    return product || undefined;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    return await prisma.product.create({
      data: product
    });
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    try {
      const updated = await prisma.product.update({
        where: { id },
        data: product
      });
      return updated;
    } catch (error) {
      return undefined;
    }
  }

  async deleteProduct(id: number): Promise<boolean> {
    try {
      await prisma.product.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async searchProducts(query: string): Promise<Product[]> {
    return await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async filterProducts(category?: string, minPrice?: number, maxPrice?: number): Promise<Product[]> {
    const where: any = {};
    
    if (category) {
      where.category = category;
    }
    if (minPrice !== undefined) {
      where.price = { ...where.price, gte: minPrice };
    }
    if (maxPrice !== undefined) {
      where.price = { ...where.price, lte: maxPrice };
    }

    if (Object.keys(where).length === 0) {
      return this.getAllProducts();
    }

    return await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  // Orders
  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    return await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: order
      });

      await tx.orderItem.createMany({
        data: items.map((item) => ({
          orderId: newOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          subtotal: item.subtotal,
        }))
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      return newOrder;
    });
  }

  async getAllOrders(): Promise<OrderWithItems[]> {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return orders;
  }

  async getOrderById(id: number): Promise<OrderWithItems | undefined> {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });

    return order || undefined;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    try {
      const updated = await prisma.order.update({
        where: { id },
        data: { status }
      });
      return updated;
    } catch (error) {
      return undefined;
    }
  }

  // Reports
  async getReports(): Promise<{ totalProducts: number; totalOrders: number; totalRevenue: number }> {
    const [productCount, orderCount, revenueResult] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: {
          totalAmount: true
        }
      })
    ]);

    return {
      totalProducts: productCount,
      totalOrders: orderCount,
      totalRevenue: revenueResult._sum.totalAmount || 0,
    };
  }
}

export const storage = new DatabaseStorage();

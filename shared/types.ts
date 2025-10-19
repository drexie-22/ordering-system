import { z } from "zod";
import type { Product, Order, OrderItem } from "@prisma/client";

// Re-export Prisma types
export type { Product, Order, OrderItem };

// Insert schemas for validation
export const insertProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be positive"),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().url("Must be a valid URL"),
  stock: z.number().int().min(0, "Stock must be non-negative").default(0),
});

export const insertOrderSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  contact: z.string().min(1, "Contact is required"),
  address: z.string().min(1, "Address is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  totalAmount: z.number().positive("Total amount must be positive"),
});

export const insertOrderItemSchema = z.object({
  orderId: z.number().int().optional(),
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
  subtotal: z.number().positive(),
});

// Inferred types
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

// Extended types for API responses
export type OrderWithItems = Order & {
  orderItems: (OrderItem & { product: Product })[];
};

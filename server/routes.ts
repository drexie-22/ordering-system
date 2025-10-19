import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertOrderSchema, insertOrderItemSchema } from "@shared/types";
import { spawn } from "child_process";
import { z } from "zod";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const calculateDiscountSchema = z.object({
  items: z.array(
    z.object({
      price: z.number(),
      quantity: z.number(),
    })
  ),
});

async function calculateDiscountWithCpp(items: { price: number; quantity: number }[]): Promise<number> {
  return new Promise((resolve, reject) => {
    const args = items.map(item => `${item.price},${item.quantity}`);
    const cppPath = path.join(__dirname, "price_calculator");
    
    const cpp = spawn(cppPath, args);
    
    let output = "";
    let error = "";

    cpp.stdout.on("data", (data) => {
      output += data.toString();
    });

    cpp.stderr.on("data", (data) => {
      error += data.toString();
    });

    cpp.on("close", (code) => {
      if (code !== 0) {
        console.error("C++ calculation error:", error);
        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const discount = subtotal > 1000 ? subtotal * 0.1 : 0;
        resolve(subtotal - discount);
      } else {
        resolve(parseFloat(output.trim()));
      }
    });

    cpp.on("error", (err) => {
      console.error("Failed to start C++ process:", err);
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const discount = subtotal > 1000 ? subtotal * 0.1 : 0;
      resolve(subtotal - discount);
    });
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Products endpoints
  app.get("/api/products", async (_req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProductById(id);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, validatedData);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProduct(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Orders endpoints
  app.post("/api/orders", async (req, res) => {
    try {
      const { orderItems: items, ...orderData } = req.body;
      
      const validatedOrder = insertOrderSchema.parse(orderData);
      const validatedItems = z.array(insertOrderItemSchema.omit({ orderId: true })).parse(items);
      
      const order = await storage.createOrder(validatedOrder, validatedItems as any);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.get("/api/orders", async (_req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrderById(id);
      
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.put("/api/orders/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      
      const order = await storage.updateOrderStatus(id, status);
      
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  // Reports endpoint
  app.get("/api/reports", async (_req, res) => {
    try {
      const reports = await storage.getReports();
      res.json(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ error: "Failed to fetch reports" });
    }
  });

  // Discount calculation endpoint (using C++ module)
  app.post("/api/calculate-discount", async (req, res) => {
    try {
      const validatedData = calculateDiscountSchema.parse(req.body);
      const total = await calculateDiscountWithCpp(validatedData.items);
      res.json({ total });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error calculating discount:", error);
      res.status(500).json({ error: "Failed to calculate discount" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

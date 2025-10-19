import prisma from "./db";

const sampleProducts = [
  {
    name: "Premium Coffee Beans",
    description: "High-quality arabica coffee beans sourced from premium farms. Perfect for your morning brew.",
    price: 450.00,
    category: "Beverages",
    imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500",
    stock: 25,
  },
  {
    name: "Organic Green Tea",
    description: "Premium organic green tea leaves with a smooth, refreshing taste.",
    price: 280.00,
    category: "Beverages",
    imageUrl: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=500",
    stock: 30,
  },
  {
    name: "Wireless Headphones",
    description: "High-fidelity wireless headphones with noise cancellation and 30-hour battery life.",
    price: 3500.00,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    stock: 15,
  },
  {
    name: "Smart Watch Pro",
    description: "Feature-rich smartwatch with health tracking, GPS, and water resistance.",
    price: 8999.00,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    stock: 12,
  },
  {
    name: "Yoga Mat Premium",
    description: "Extra-thick yoga mat with non-slip surface, perfect for all types of exercises.",
    price: 1200.00,
    category: "Sports",
    imageUrl: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500",
    stock: 20,
  },
  {
    name: "Protein Powder",
    description: "Whey protein isolate with 25g protein per serving. Available in chocolate flavor.",
    price: 2499.00,
    category: "Sports",
    imageUrl: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500",
    stock: 18,
  },
  {
    name: "Running Shoes",
    description: "Lightweight running shoes with superior cushioning and breathable mesh upper.",
    price: 4200.00,
    category: "Sports",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    stock: 8,
  },
  {
    name: "Bluetooth Speaker",
    description: "Portable waterproof Bluetooth speaker with 360-degree sound and 12-hour battery.",
    price: 1899.00,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
    stock: 22,
  },
  {
    name: "Organic Honey",
    description: "Pure organic honey harvested from local bee farms. Rich in antioxidants.",
    price: 380.00,
    category: "Food",
    imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784710?w=500",
    stock: 40,
  },
  {
    name: "Dark Chocolate Bar",
    description: "Premium 70% dark chocolate made from single-origin cacao beans.",
    price: 150.00,
    category: "Food",
    imageUrl: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=500",
    stock: 50,
  },
  {
    name: "Essential Oil Set",
    description: "Set of 6 pure essential oils including lavender, peppermint, and eucalyptus.",
    price: 899.00,
    category: "Wellness",
    imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500",
    stock: 14,
  },
  {
    name: "Stainless Steel Water Bottle",
    description: "Insulated stainless steel bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
    price: 650.00,
    category: "Accessories",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500",
    stock: 35,
  },
];

async function seed() {
  try {
    console.log("Seeding database...");
    
    await prisma.product.createMany({
      data: sampleProducts
    });
    
    console.log(`✓ Successfully seeded ${sampleProducts.length} products`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();

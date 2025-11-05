import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { CartPanel, type CartItem } from "@/components/CartPanel";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/types";

export default function ProductListingPage() {
  const { toast } = useToast();
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return Array.from(cats);
  }, [products]);

  const maxPrice = useMemo(() => {
    return Math.max(...products.map((p) => p.price), 10000);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(product.category);

      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, searchQuery, selectedCategories, priceRange]);

  const handleAddToCart = (product: Product) => {
    const existingItem = cartItems.find((item) => item.product.id === product.id);

    let newCartItems: CartItem[];
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast({
          title: "Stock limit reached",
          description: `Only ${product.stock} items available`,
          variant: "destructive",
        });
        return;
      }
      newCartItems = cartItems.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCartItems = [...cartItems, { product, quantity: 1 }];
    }

    setCartItems(newCartItems);
    localStorage.setItem("cart", JSON.stringify(newCartItems));

    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    });
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    let newCartItems: CartItem[];
    if (quantity === 0) {
      newCartItems = cartItems.filter((item) => item.product.id !== productId);
    } else {
      newCartItems = cartItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
    }
    setCartItems(newCartItems);
    localStorage.setItem("cart", JSON.stringify(newCartItems));
  };

  const handleRemoveItem = (productId: number) => {
    const newCartItems = cartItems.filter((item) => item.product.id !== productId);
    setCartItems(newCartItems);
    localStorage.setItem("cart", JSON.stringify(newCartItems));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discount = subtotal > 1000 ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    }
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, maxPrice]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-chart-2 to-primary opacity-20" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        <div className="relative z-10 text-center px-4">
          <h1
          className="font-display text-6xl md:text-7xl font-bold mb-4 
                    bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent 
                    animate-glow"
        >
          Order Fresh & Fast w/ 10% OFF
        </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse our wide selection of quality products and get them delivered to your doorstep
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                categories={categories}
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                maxPrice={maxPrice}
                onClearFilters={handleClearFilters}
              />
            </div>
          </aside>

          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-3xl font-bold">
                {searchQuery
                  ? `Search results for "${searchQuery}"`
                  : "All Products"}
              </h2>
              <p className="text-muted-foreground" data-testid="text-product-count">
                {filteredProducts.length} products
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Package className="h-24 w-24 text-muted-foreground mb-4" />
                <h3 className="text-2xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search query
                </p>
                <Button onClick={handleClearFilters} data-testid="button-clear-all-filters">
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <CartPanel
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        subtotal={subtotal}
        discount={discount}
        total={total}
      />
    </div>
  );
}

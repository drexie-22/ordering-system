import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, PackageX } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <Card className="group overflow-hidden border-white/10 bg-card/50 backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-xl hover-elevate" data-testid={`card-product-${product.id}`}>
      <div className="relative aspect-square overflow-hidden rounded-t-xl">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          data-testid={`img-product-${product.id}`}
        />
        <div className="absolute top-4 right-4">
          {isOutOfStock ? (
            <Badge variant="destructive" className="shadow-lg" data-testid={`badge-out-of-stock-${product.id}`}>
              Out of Stock
            </Badge>
          ) : isLowStock ? (
            <Badge className="bg-chart-4 text-white shadow-lg" data-testid={`badge-low-stock-${product.id}`}>
              Low Stock
            </Badge>
          ) : (
            <Badge className="bg-chart-3 text-white shadow-lg" data-testid={`badge-in-stock-${product.id}`}>
              In Stock
            </Badge>
          )}
        </div>
        {!isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              size="lg"
              onClick={() => onAddToCart(product)}
              className="bg-primary shadow-lg"
              data-testid={`button-add-to-cart-${product.id}`}
            >
              <Plus className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
          </div>
        )}
      </div>

      <CardContent className="p-6">
        <Badge variant="outline" className="mb-2" data-testid={`badge-category-${product.id}`}>
          {product.category}
        </Badge>
        <h3 className="font-display text-2xl font-semibold mb-2" data-testid={`text-product-name-${product.id}`}>
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2" data-testid={`text-product-description-${product.id}`}>
          {product.description}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between p-6 pt-0">
        <div className="flex flex-col">
          <span className="text-3xl font-bold text-primary" data-testid={`text-product-price-${product.id}`}>
            ₱{product.price.toFixed(2)}
          </span>
          <span className="text-xs text-muted-foreground" data-testid={`text-product-stock-${product.id}`}>
            {product.stock} available
          </span>
        </div>
        {isOutOfStock ? (
          <Button disabled variant="ghost" size="icon" data-testid={`button-out-of-stock-${product.id}`}>
            <PackageX className="h-5 w-5" />
          </Button>
        ) : (
          <Button
            size="icon"
            onClick={() => onAddToCart(product)}
            data-testid={`button-quick-add-${product.id}`}
          >
            <Plus className="h-5 w-5" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

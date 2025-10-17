import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import type { Product } from "@shared/schema";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  subtotal: number;
  discount: number;
  total: number;
}

export function CartPanel({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  subtotal,
  discount,
  total,
}: CartPanelProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg bg-background/95 backdrop-blur-lg border-white/10">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Shopping Cart</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">Your cart is empty</p>
            <Button className="mt-6" onClick={onClose} data-testid="button-continue-shopping-empty">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 pr-4 my-6 h-[calc(100vh-300px)]">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-4 rounded-lg bg-card border border-white/10"
                    data-testid={`cart-item-${item.product.id}`}
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="h-20 w-20 rounded-lg object-cover"
                      data-testid={`cart-item-image-${item.product.id}`}
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold" data-testid={`cart-item-name-${item.product.id}`}>
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-muted-foreground" data-testid={`cart-item-price-${item.product.id}`}>
                        ₱{item.product.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => onUpdateQuantity(item.product.id, Math.max(0, item.quantity - 1))}
                          data-testid={`button-decrease-${item.product.id}`}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium" data-testid={`text-quantity-${item.product.id}`}>
                          {item.quantity}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          data-testid={`button-increase-${item.product.id}`}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 ml-auto"
                          onClick={() => onRemoveItem(item.product.id)}
                          data-testid={`button-remove-${item.product.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold" data-testid={`cart-item-subtotal-${item.product.id}`}>
                        ₱{(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <SheetFooter className="flex-col gap-4">
              <div className="w-full space-y-2 p-4 rounded-lg bg-gradient-to-br from-primary/10 to-chart-2/10 border border-primary/20">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span data-testid="text-subtotal">₱{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-chart-3">
                    <span>Discount (10%)</span>
                    <span data-testid="text-discount">-₱{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span data-testid="text-total">₱{total.toFixed(2)}</span>
                </div>
              </div>
              <Link href="/cart">
                <a className="w-full">
                  <Button className="w-full" size="lg" onClick={onClose} data-testid="button-checkout">
                    Proceed to Checkout
                  </Button>
                </a>
              </Link>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

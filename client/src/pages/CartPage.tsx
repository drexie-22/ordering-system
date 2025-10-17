import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { CheckoutForm } from "@/components/CheckoutForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface CartItem {
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
  };
  quantity: number;
}

export default function CartPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [calculatedTotal, setCalculatedTotal] = useState<{
    subtotal: number;
    discount: number;
    total: number;
  }>({ subtotal: 0, discount: 0, total: 0 });

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const items = JSON.parse(savedCart);
      setCartItems(items);
      calculateTotal(items);
    }
  }, []);

  const calculateTotal = async (items: CartItem[]) => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    try {
      const result = await apiRequest<{ total: number }>(
        "POST",
        "/api/calculate-discount",
        { items: items.map(item => ({ price: item.product.price, quantity: item.quantity })) }
      );
      
      const total = result.total;
      const discount = subtotal - total;
      
      setCalculatedTotal({ subtotal, discount, total });
    } catch (error) {
      const discount = subtotal > 1000 ? subtotal * 0.1 : 0;
      setCalculatedTotal({ subtotal, discount, total: subtotal - discount });
    }
  };

  const createOrderMutation = useMutation({
    mutationFn: async (data: any) => {
      const orderItems = cartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity,
      }));

      return apiRequest("POST", "/api/orders", {
        ...data,
        totalAmount: calculatedTotal.total,
        orderItems,
      });
    },
    onSuccess: (data: any) => {
      localStorage.removeItem("cart");
      toast({
        title: "Order placed successfully!",
        description: `Your order #${data.id} has been confirmed`,
      });
      setLocation(`/order-success?orderId=${data.id}`);
    },
    onError: () => {
      toast({
        title: "Order failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add some products to get started</p>
          <Link href="/">
            <a>
              <Button data-testid="button-browse-products">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Browse Products
              </Button>
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <Link href="/">
          <a>
            <Button variant="ghost" className="mb-6" data-testid="button-back-to-products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </a>
        </Link>

        <h1 className="font-display text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CheckoutForm
              onSubmit={(data) => createOrderMutation.mutate(data)}
              isSubmitting={createOrderMutation.isPending}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="font-display">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {cartItems.map((item) => (
                      <div key={item.product.id} className="flex gap-3">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ₱{item.product.price.toFixed(2)} × {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold text-sm">
                          ₱{(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-white/10 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span data-testid="text-checkout-subtotal">
                        ₱{(calculatedTotal?.subtotal ?? 0).toFixed(2)}
                      </span>
                    </div>
                    {(calculatedTotal?.discount ?? 0) > 0 && (
                      <div className="flex justify-between text-sm text-chart-3">
                        <span>Discount (10%)</span>
                        <span data-testid="text-checkout-discount">
                          -₱{(calculatedTotal?.discount ?? 0).toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-xl font-bold pt-2 border-t border-white/10">
                      <span>Total</span>
                      <span className="text-primary" data-testid="text-checkout-total">
                        ₱{(calculatedTotal?.total ?? 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

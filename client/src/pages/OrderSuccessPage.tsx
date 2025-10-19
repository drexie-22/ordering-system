import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShoppingBag, Printer } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { OrderWithItems } from "@shared/types";
import { format } from "date-fns";

export default function OrderSuccessPage() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1]);
  const orderId = params.get("orderId");

  const { data: order, isLoading } = useQuery<OrderWithItems>({
    queryKey: ["/api/orders", orderId],
    enabled: !!orderId,
  });

  useEffect(() => {
    localStorage.removeItem("cart");
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-2xl border-white/10 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-8">
            <Skeleton className="h-32 w-32 rounded-full mx-auto mb-6" />
            <Skeleton className="h-8 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold mb-4">Order not found</h1>
          <Link href="/">
            <a>
              <Button>Return to Home</Button>
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-3xl mx-auto border-white/10 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-chart-3/20 to-chart-3/10 mb-6">
                <CheckCircle className="h-16 w-16 text-chart-3" />
              </div>
              <h1 className="font-display text-4xl font-bold mb-2">
                Order Placed Successfully!
              </h1>
              <p className="text-muted-foreground text-lg">
                Thank you for your order. We'll deliver it to you soon.
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-chart-2/10 rounded-xl p-6 mb-6 border border-primary/20">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Order Number</p>
                  <p className="font-mono font-bold text-lg" data-testid="text-order-number">
                    #{order.id.toString().padStart(4, "0")}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Order Date</p>
                  <p className="font-semibold" data-testid="text-order-date">
                    {format(new Date(order.createdAt), "MMM dd, yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Total Amount</p>
                  <p className="font-bold text-lg text-primary" data-testid="text-order-amount">
                    ₱{order.totalAmount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Payment Method</p>
                  <p className="font-semibold" data-testid="text-payment-method">
                    {order.paymentMethod}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="font-display text-xl font-semibold mb-4">Delivery Information</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium" data-testid="text-customer-name">{order.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contact:</span>
                  <span className="font-medium" data-testid="text-customer-contact">{order.contact}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Address:</span>
                  <span className="font-medium text-right max-w-[60%]" data-testid="text-customer-address">
                    {order.address}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="font-display text-xl font-semibold mb-4">Order Items</h2>
              <div className="space-y-3">
                {order.orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-background/50"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ₱{item.product.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">₱{item.subtotal.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handlePrint}
                data-testid="button-print-receipt"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Receipt
              </Button>
              <Link href="/">
                <a className="flex-1">
                  <Button className="w-full" data-testid="button-continue-shopping">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Button>
                </a>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

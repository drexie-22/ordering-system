import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ShoppingBag } from "lucide-react";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

export default function OrderSuccessPage() {
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(window.location.search);

  const orderId = params.get("orderId");
  const total = params.get("total");
  const discount = params.get("discount");
  const itemsParam = params.get("items"); // serialized cart items

  const totalAmount = total ? parseFloat(total) : 0;
  const discountAmount = discount ? parseFloat(discount) : 0;
  const subtotal = totalAmount + discountAmount;

  const items: OrderItem[] = itemsParam ? JSON.parse(itemsParam) : [];
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  
  // Clear cart just in case
  localStorage.removeItem("cart");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
  {/* Background layers */}
  <div className="absolute inset-0 bg-gradient-to-br from-primary via-chart-2 to-primary opacity-20" />
  <div
    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920')] bg-cover bg-center opacity-30"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

  {/* Card content */}
  <Card className="relative z-10 rounded-2xl shadow-2xl max-w-2xl w-full bg-white/90 backdrop-blur-md">
    <CardContent className="p-12 text-center">
      <div className="mb-8 flex justify-center">
        <div className="bg-green-100 rounded-full p-6">
          <CheckCircle className="h-24 w-24 text-green-500" />
        </div>
      </div>

      <h1 className="text-4xl font-bold mb-4 text-gray-800">
        Order Placed Successfully!
      </h1>

      <p className="text-gray-600 mb-8 text-lg">
        Thank you for your order. Please order again!
      </p>

      <div className="bg-white/80 rounded-lg p-6 mb-8 space-y-3 text-left">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600 font-medium">Order:</span>
          <span className="font-semibold text-gray-800">To be delivered</span>
        </div>

         <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600 font-medium">Order Quantity:</span>
          <span className="font-semibold text-gray-800">{totalQuantity}</span>
        </div>
      

        {/* Items list */}
        {items.length > 0 && (
            <div className="mb-2">
              {items.map((item, index) => (
                <div key={index} className="text-gray-800 text-sm mb-1">
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          )}


        {discountAmount > 0 && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Subtotal:</span>
              <span className="font-semibold text-gray-800">
                ₱{subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-green-600">
              <span>Discount:</span>
              <span className="font-semibold">-₱{discountAmount.toFixed(2)}</span>
            </div>
          </>
        )}

        <div className="flex justify-between items-center pt-3 border-t border-gray-300">
          <span className="text-xl font-bold text-gray-800">Total Amount:</span>
          <span className="text-2xl font-bold text-blue-600">
            ₱{totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      <Button
        onClick={() => setLocation("/")}
        className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white shadow-lg transition-all duration-300 px-8 py-6 text-lg"
      >
        <ShoppingBag className="mr-2 h-5 w-5" />
        Continue Shopping
      </Button>
    </CardContent>
  </Card>
</div>

  );
}

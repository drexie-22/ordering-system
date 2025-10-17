import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { OrderWithItems } from "@shared/schema";
import { format } from "date-fns";

interface OrderDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderWithItems | null;
}

const statusColors = {
  Pending: "bg-chart-4 text-white",
  Preparing: "bg-chart-1 text-white",
  "Out for Delivery": "bg-purple-600 text-white",
  Completed: "bg-chart-3 text-white",
};

export function OrderDetailsDialog({ isOpen, onClose, order }: OrderDetailsDialogProps) {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-card border-white/10">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="font-display text-2xl">
              Order #{order.id.toString().padStart(4, "0")}
            </DialogTitle>
            <Badge className={statusColors[order.status as keyof typeof statusColors]}>
              {order.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Customer Information</h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">Name:</span> {order.customerName}
              </p>
              <p>
                <span className="text-muted-foreground">Contact:</span> {order.contact}
              </p>
              <p>
                <span className="text-muted-foreground">Address:</span> {order.address}
              </p>
              <p>
                <span className="text-muted-foreground">Payment:</span> {order.paymentMethod}
              </p>
              <p>
                <span className="text-muted-foreground">Date:</span>{" "}
                {format(new Date(order.createdAt), "MMMM dd, yyyy 'at' hh:mm a")}
              </p>
            </div>
          </div>

          <Separator className="bg-white/10" />

          <div>
            <h3 className="font-semibold mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/50"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="h-12 w-12 rounded object-cover"
                    />
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ₱{item.product.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold">₱{item.subtotal.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-white/10" />

          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total Amount</span>
            <span className="text-primary">₱{order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

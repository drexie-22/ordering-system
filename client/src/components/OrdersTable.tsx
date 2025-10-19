import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Eye } from "lucide-react";
import type { OrderWithItems } from "@shared/types";
import { format } from "date-fns";

interface OrdersTableProps {
  orders: OrderWithItems[];
  onStatusChange: (orderId: number, status: string) => void;
  onViewOrder: (order: OrderWithItems) => void;
}

const statusColors = {
  Pending: "bg-chart-4 text-white",
  Preparing: "bg-chart-1 text-white",
  "Out for Delivery": "bg-purple-600 text-white",
  Completed: "bg-chart-3 text-white",
};

export function OrdersTable({ orders, onStatusChange, onViewOrder }: OrdersTableProps) {
  return (
    <Card className="border-white/10 bg-card/50 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-transparent">
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.id}
              className="border-white/10 hover-elevate"
              data-testid={`order-row-${order.id}`}
            >
              <TableCell className="font-mono" data-testid={`order-id-${order.id}`}>
                #{order.id.toString().padStart(4, "0")}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium" data-testid={`order-customer-${order.id}`}>
                    {order.customerName}
                  </div>
                  <div className="text-sm text-muted-foreground" data-testid={`order-contact-${order.id}`}>
                    {order.contact}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground" data-testid={`order-date-${order.id}`}>
                {format(new Date(order.createdAt), "MMM dd, yyyy")}
              </TableCell>
              <TableCell className="font-semibold" data-testid={`order-total-${order.id}`}>
                ₱{order.totalAmount.toFixed(2)}
              </TableCell>
              <TableCell>
                <Select
                  value={order.status}
                  onValueChange={(value) => onStatusChange(order.id, value)}
                >
                  <SelectTrigger className="w-[180px]" data-testid={`select-status-${order.id}`}>
                    <SelectValue>
                      <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                        {order.status}
                      </Badge>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Preparing">Preparing</SelectItem>
                    <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onViewOrder(order)}
                  data-testid={`button-view-order-${order.id}`}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

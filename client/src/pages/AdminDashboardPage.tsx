import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from "@/components/ui/sidebar";
import { StatsCard } from "@/components/StatsCard";
import { OrdersTable } from "@/components/OrdersTable";
import { OrderDetailsDialog } from "@/components/OrderDetailsDialog";
import { ProductFormDialog } from "@/components/ProductFormDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Package, ShoppingCart, DollarSign, LayoutDashboard, PackageSearch, ShoppingBag, Plus, Pencil, Trash2, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Product, OrderWithItems } from "@shared/schema";

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "orders">("dashboard");
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    enabled: isAuthenticated,
  });

  const { data: orders = [] } = useQuery<OrderWithItems[]>({
    queryKey: ["/api/orders"],
    enabled: isAuthenticated,
  });

  const { data: reports } = useQuery<{ totalProducts: number; totalOrders: number; totalRevenue: number }>({
    queryKey: ["/api/reports"],
    enabled: isAuthenticated,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: string }) =>
      apiRequest("PUT", `/api/orders/${orderId}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({ title: "Order status updated successfully" });
    },
  });

  const createProductMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/products", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      setProductDialogOpen(false);
      setSelectedProduct(null);
      toast({ title: "Product created successfully" });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      apiRequest("PUT", `/api/products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setProductDialogOpen(false);
      setSelectedProduct(null);
      toast({ title: "Product updated successfully" });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/products/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      toast({ title: "Product deleted successfully" });
    },
  });

  const handleAuthenticate = () => {
    if (passcode === "admin123") {
      setIsAuthenticated(true);
      toast({ title: "Access granted" });
    } else {
      toast({
        title: "Invalid passcode",
        description: "Please enter the correct admin passcode",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md border-white/10 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-display text-2xl flex items-center gap-2">
              <Lock className="h-6 w-6 text-primary" />
              Admin Access
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Enter the admin passcode to access the dashboard
            </p>
            <Input
              type="password"
              placeholder="Enter passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAuthenticate()}
              className="bg-background border-white/20"
              data-testid="input-admin-passcode"
            />
            <Button
              className="w-full"
              onClick={handleAuthenticate}
              data-testid="button-admin-login"
            >
              Access Dashboard
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Default passcode: admin123
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const style = {
    "--sidebar-width": "16rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader className="p-6">
            <h2 className="font-display text-2xl font-bold">Admin Panel</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveTab("dashboard")}
                  isActive={activeTab === "dashboard"}
                  data-testid="nav-dashboard"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveTab("products")}
                  isActive={activeTab === "products"}
                  data-testid="nav-products"
                >
                  <PackageSearch className="h-5 w-5" />
                  <span>Products</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveTab("orders")}
                  isActive={activeTab === "orders"}
                  data-testid="nav-orders"
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>Orders</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b border-white/10">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <Button
              variant="ghost"
              onClick={() => {
                setIsAuthenticated(false);
                setPasscode("");
              }}
              data-testid="button-logout"
            >
              Logout
            </Button>
          </header>

          <main className="flex-1 overflow-auto p-6 bg-background">
            {activeTab === "dashboard" && (
              <div className="space-y-6 max-w-screen-2xl mx-auto">
                <h1 className="font-display text-4xl font-bold">Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatsCard
                    title="Total Products"
                    value={reports?.totalProducts || 0}
                    icon={Package}
                    gradient
                  />
                  <StatsCard
                    title="Total Orders"
                    value={reports?.totalOrders || 0}
                    icon={ShoppingCart}
                  />
                  <StatsCard
                    title="Total Revenue"
                    value={`₱${(reports?.totalRevenue || 0).toFixed(2)}`}
                    icon={DollarSign}
                    gradient
                  />
                </div>

                <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="font-display">Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <OrdersTable
                      orders={orders.slice(0, 5)}
                      onStatusChange={(orderId, status) =>
                        updateStatusMutation.mutate({ orderId, status })
                      }
                      onViewOrder={setSelectedOrder}
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "products" && (
              <div className="space-y-6 max-w-screen-2xl mx-auto">
                <div className="flex items-center justify-between">
                  <h1 className="font-display text-4xl font-bold">Products</h1>
                  <Button
                    onClick={() => {
                      setSelectedProduct(null);
                      setProductDialogOpen(true);
                    }}
                    data-testid="button-add-product"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>

                <Card className="border-white/10 bg-card/50 backdrop-blur-sm overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id} className="border-white/10 hover-elevate" data-testid={`product-row-${product.id}`}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="h-12 w-12 rounded-lg object-cover"
                              />
                              <div>
                                <p className="font-medium" data-testid={`product-name-${product.id}`}>{product.name}</p>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {product.description}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell data-testid={`product-category-${product.id}`}>{product.category}</TableCell>
                          <TableCell className="font-semibold" data-testid={`product-price-${product.id}`}>
                            ₱{product.price.toFixed(2)}
                          </TableCell>
                          <TableCell data-testid={`product-stock-${product.id}`}>{product.stock}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setProductDialogOpen(true);
                                }}
                                data-testid={`button-edit-product-${product.id}`}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  if (confirm("Are you sure you want to delete this product?")) {
                                    deleteProductMutation.mutate(product.id);
                                  }
                                }}
                                data-testid={`button-delete-product-${product.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="space-y-6 max-w-screen-2xl mx-auto">
                <h1 className="font-display text-4xl font-bold">Orders</h1>

                <OrdersTable
                  orders={orders}
                  onStatusChange={(orderId, status) =>
                    updateStatusMutation.mutate({ orderId, status })
                  }
                  onViewOrder={setSelectedOrder}
                />
              </div>
            )}
          </main>
        </div>
      </div>

      <ProductFormDialog
        isOpen={productDialogOpen}
        onClose={() => {
          setProductDialogOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={(data) => {
          if (selectedProduct) {
            updateProductMutation.mutate({ id: selectedProduct.id, data });
          } else {
            createProductMutation.mutate(data);
          }
        }}
        product={selectedProduct}
        isSubmitting={
          createProductMutation.isPending || updateProductMutation.isPending
        }
      />

      <OrderDetailsDialog
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
      />
    </SidebarProvider>
  );
}

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet, Banknote } from "lucide-react";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  contact: z.string().min(10, "Please enter a valid contact number"),
  address: z.string().min(10, "Please enter a complete address"),
  paymentMethod: z.enum(["Cash on Delivery", "Credit Card", "E-Wallet"]),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
  isSubmitting: boolean;
}

export function CheckoutForm({ onSubmit, isSubmitting }: CheckoutFormProps) {
  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      contact: "",
      address: "",
      paymentMethod: "Cash on Delivery",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-display text-xl font-semibold">Customer Information</h3>

            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      className="bg-background border-white/20"
                      data-testid="input-customer-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+63 912 345 6789"
                      {...field}
                      className="bg-background border-white/20"
                      data-testid="input-contact"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Street, Barangay, City, Province"
                      {...field}
                      className="bg-background border-white/20 resize-none"
                      rows={3}
                      data-testid="input-address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-display text-xl font-semibold">Payment Method</h3>

            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="space-y-3"
                    >
                      <div
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover-elevate ${
                          field.value === "Cash on Delivery"
                            ? "border-primary bg-primary/10"
                            : "border-white/10"
                        }`}
                      >
                        <RadioGroupItem value="Cash on Delivery" id="cod" data-testid="radio-cod" />
                        <Banknote className="h-5 w-5 text-muted-foreground" />
                        <Label htmlFor="cod" className="flex-1 cursor-pointer">
                          Cash on Delivery
                        </Label>
                      </div>

                      <div
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover-elevate ${
                          field.value === "Credit Card"
                            ? "border-primary bg-primary/10"
                            : "border-white/10"
                        }`}
                      >
                        <RadioGroupItem value="Credit Card" id="card" data-testid="radio-card" />
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <Label htmlFor="card" className="flex-1 cursor-pointer">
                          Credit/Debit Card
                        </Label>
                      </div>

                      <div
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover-elevate ${
                          field.value === "E-Wallet"
                            ? "border-primary bg-primary/10"
                            : "border-white/10"
                        }`}
                      >
                        <RadioGroupItem value="E-Wallet" id="ewallet" data-testid="radio-ewallet" />
                        <Wallet className="h-5 w-5 text-muted-foreground" />
                        <Label htmlFor="ewallet" className="flex-1 cursor-pointer">
                          E-Wallet (GCash, PayMaya)
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
          data-testid="button-place-order"
        >
          {isSubmitting ? "Placing Order..." : "Place Order"}
        </Button>
      </form>
    </Form>
  );
}

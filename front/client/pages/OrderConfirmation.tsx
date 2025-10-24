import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  Mail, 
  MapPin, 
  Phone,
  Download,
  Loader2
} from "lucide-react";
import { api } from "@/lib/api";

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      api.orders.get(orderId)
        .then(setOrder)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [orderId]);

  if (loading) {
    return (
      <main className="container py-20">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading order details...</p>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="container py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="rounded-full bg-destructive/10 p-4 inline-flex mb-4">
            <Package className="h-12 w-12 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find the order you're looking for.
          </p>
          <Button asChild>
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </main>
    );
  }

  const orderSteps = [
    { icon: CheckCircle2, label: "Order Confirmed", status: "complete" },
    { icon: Package, label: "Processing", status: order.status === "pending" ? "current" : "complete" },
    { icon: Truck, label: "Shipped", status: order.status === "shipped" ? "current" : "pending" },
    { icon: CheckCircle2, label: "Delivered", status: order.status === "delivered" ? "complete" : "pending" },
  ];

  return (
    <main className="container py-8 md:py-12 lg:py-16">
      {/* Success Header */}
      <div className="mx-auto max-w-3xl text-center mb-8 md:mb-12 animate-fade-up">
        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-green-100 mb-4 md:mb-6">
          <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-3 md:mb-4">
          Thank You for Your Order!
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
          Your order has been confirmed and will be shipped soon. We've sent a confirmation email to{" "}
          <span className="font-medium text-foreground">{order.email}</span>
        </p>
      </div>

      <div className="mx-auto max-w-4xl space-y-6 md:space-y-8">
        {/* Order Number Card */}
        <Card className="animate-fade-up animate-delay-1">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-wide mb-1">
                  Order Number
                </p>
                <p className="text-lg md:text-xl font-bold">{order.order_id}</p>
              </div>
              <div className="flex gap-2 sm:gap-3">
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Download</span> Receipt
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="hidden sm:inline">Email</span> Receipt
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Timeline */}
        <Card className="animate-fade-up animate-delay-2">
          <CardContent className="p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold mb-4 md:mb-6">Order Status</h2>
            <div className="relative">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-border hidden sm:block" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0 relative">
                {orderSteps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center text-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                        step.status === "complete"
                          ? "bg-green-100 text-green-600"
                          : step.status === "current"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <step.icon className="w-5 h-5" />
                    </div>
                    <p className="text-xs md:text-sm font-medium">{step.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
          {/* Order Items */}
          <Card className="animate-fade-up animate-delay-3">
            <CardContent className="p-4 md:p-6">
              <h2 className="text-base md:text-lg font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items?.map((item: any, index: number) => (
                  <div key={index} className="flex gap-3 md:gap-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                      {item.product_image && (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm md:text-base truncate">{item.product_name}</p>
                      {item.variant_label && (
                        <p className="text-xs md:text-sm text-muted-foreground">{item.variant_label}</p>
                      )}
                      <p className="text-xs md:text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-sm md:text-base">
                        {formatCurrency(parseFloat(item.price) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(parseFloat(order.subtotal))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatCurrency(parseFloat(order.shipping_cost))}</span>
                </div>
                {order.discount_amount && parseFloat(order.discount_amount) > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(parseFloat(order.discount_amount))}</span>
                  </div>
                )}
                <div className="flex justify-between text-base md:text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(parseFloat(order.total))}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery & Contact Info */}
          <div className="space-y-6 md:space-y-8">
            {/* Shipping Address */}
            <Card className="animate-fade-up animate-delay-4">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start gap-3 mb-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-2">Shipping Address</h3>
                    <p className="text-sm text-muted-foreground">
                      {order.first_name} {order.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">{order.address}</p>
                    {order.apartment && (
                      <p className="text-sm text-muted-foreground">{order.apartment}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {order.city}, {order.region}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="animate-fade-up animate-delay-5">
              <CardContent className="p-4 md:p-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium">{order.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">{order.phone}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="animate-fade-up animate-delay-6">
              <CardContent className="p-4 md:p-6">
                <h3 className="font-semibold mb-2">Payment Method</h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {order.payment_method || "Paystack"}
                </p>
                <p className="text-xs text-green-600 mt-1">✓ Payment Confirmed</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Help Section */}
        <Card className="bg-secondary/40 animate-fade-up animate-delay-7">
          <CardContent className="p-4 md:p-6 text-center">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              If you have any questions about your order, feel free to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" size="sm" asChild>
                <a href="https://api.whatsapp.com/send/?phone=233547936812&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer">
                  Contact Support
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

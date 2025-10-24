import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { api } from "@/lib/api";
import { initializePaystack } from "@/lib/paystack";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function Review() {
  const navigate = useNavigate();
  const { items, subtotal, clear } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get shipping and payment info from sessionStorage
  const shippingInfo = JSON.parse(sessionStorage.getItem('shipping_info') || '{}');
  const paymentInfo = JSON.parse(sessionStorage.getItem('payment_info') || '{}');

  const shipping = subtotal > 150 ? 0 : 12;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const placeOrder = async () => {
    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    if (!shippingInfo.full_name || !shippingInfo.email) {
      setError('Please complete shipping information');
      navigate('/checkout/shipping');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create order
      const orderData = {
        email: shippingInfo.email,
        full_name: shippingInfo.full_name,
        shipping_address: shippingInfo.address,
        shipping_city: shippingInfo.city,
        shipping_postal_code: shippingInfo.postal_code || '00000',
        shipping_country: 'Ghana',
        payment_method: 'paystack',
        items: items.map(item => ({
          product_id: item.productId || item.id,
          variant_id: item.variantId,
          name: item.name,
          image: item.image || '',
          variant_label: '',
          quantity: item.qty,
          price: item.price,
        })),
      };

      const order = await api.orders.create(orderData);

      // Get Paystack public key
      const config = await api.orders.getPaystackConfig();
      
      if (!config.public_key) {
        throw new Error('Paystack is not configured. Please contact support.');
      }

      // Initialize Paystack payment
      const callbackUrl = `${window.location.origin}/order/${order.id}/confirmation`;
      
      await initializePaystack({
        publicKey: config.public_key,
        email: shippingInfo.email,
        amount: total,
        reference: `PAY-${order.id}-${Date.now()}`,
        metadata: {
          order_id: order.id,
          customer_name: shippingInfo.full_name,
          items_count: items.length,
        },
        onSuccess: async (reference) => {
          // Verify payment
          try {
            await api.orders.verifyPayment(reference);
            // Clear cart
            await clear();
            // Clear session storage
            sessionStorage.removeItem('shipping_info');
            sessionStorage.removeItem('payment_info');
            // Navigate to confirmation
            navigate(`/order/${order.id}/confirmation`);
          } catch (err) {
            setError('Payment verification failed. Please contact support.');
            setIsProcessing(false);
          }
        },
        onClose: () => {
          setIsProcessing(false);
          setError('Payment was cancelled');
        },
      });

    } catch (err: any) {
      setError(err.message || 'Failed to process order');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-semibold">Review your order</h2>
      
      {error && (
        <div className="mt-4 rounded-md bg-destructive/10 border border-destructive/20 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="mt-4 space-y-4">
        {/* Shipping Info */}
        <div className="rounded-md border p-4">
          <h3 className="font-semibold mb-2">Shipping Information</h3>
          <div className="text-sm space-y-1">
            <p><strong>Name:</strong> {shippingInfo.full_name || 'Not provided'}</p>
            <p><strong>Email:</strong> {shippingInfo.email || 'Not provided'}</p>
            <p><strong>Address:</strong> {shippingInfo.address || 'Not provided'}</p>
            <p><strong>City:</strong> {shippingInfo.city || 'Not provided'}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="rounded-md border p-4">
          <h3 className="font-semibold mb-3">Order Items</h3>
          {items.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">Your cart is empty</div>
          ) : (
            <div className="space-y-3">
              {items.map((it) => (
                <div key={it.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={it.image} className="h-10 w-10 rounded object-cover" alt={it.name} />
                    <div>
                      <div className="font-medium">{it.name}</div>
                      <div className="text-sm text-muted-foreground">Qty: {it.qty}</div>
                    </div>
                  </div>
                  <div className="font-medium">{formatCurrency(it.price * it.qty)}</div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 space-y-2 border-t pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Tax (8%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex items-center justify-between border-t pt-2">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="rounded-md border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
              <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3v-8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3 className="font-semibold">Payment via Paystack</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            You will be redirected to Paystack to complete your payment securely. 
            Accepted: Cards, Mobile Money, Bank Transfer
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            className="flex-1" 
            size="lg"
            onClick={placeOrder}
            disabled={isProcessing || items.length === 0}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay ${formatCurrency(total)} with Paystack`
            )}
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate(-1)}
            disabled={isProcessing}
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}

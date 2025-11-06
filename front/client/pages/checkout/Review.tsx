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

      // Initialize payment with backend (this saves the reference)
      const callbackUrl = `${window.location.origin}/order/${order.id}/confirmation`;
      const paymentInit = await api.orders.initializePayment(order.id, callbackUrl);
      
      if (!paymentInit.status) {
        throw new Error(paymentInit.message || 'Failed to initialize payment');
      }

      // Get Paystack public key
      const config = await api.orders.getPaystackConfig();
      
      if (!config.public_key) {
        throw new Error('Paystack is not configured. Please contact support.');
      }

      // Open Paystack popup
      await initializePaystack({
        publicKey: config.public_key,
        email: shippingInfo.email,
        amount: total,
        reference: paymentInit.data.reference,
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
      console.error('Order processing error:', err);
      setError(err.message || 'Failed to process order');
      setIsProcessing(false);
    }
  };

  return (
    <div className="animate-fade-up pb-32 md:pb-0">
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold">Review & Pay</h2>
        <p className="text-sm text-muted-foreground mt-1">Confirm your order details before payment</p>
      </div>
      
      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 border-2 border-destructive/20 p-4">
          <p className="text-sm font-medium text-destructive">{error}</p>
        </div>
      )}

      <div className="space-y-4 md:space-y-5">
        {/* Shipping Info */}
        <div className="rounded-xl border-2 bg-white p-4 md:p-5">
          <h3 className="font-bold text-sm md:text-base mb-3">Delivery Address</h3>
          <div className="text-xs md:text-sm space-y-2">
            <div className="flex gap-2">
              <span className="text-muted-foreground min-w-[60px]">Name:</span>
              <span className="font-medium">{shippingInfo.full_name || 'Not provided'}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-muted-foreground min-w-[60px]">Email:</span>
              <span className="font-medium break-all">{shippingInfo.email || 'Not provided'}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-muted-foreground min-w-[60px]">Address:</span>
              <span className="font-medium">{shippingInfo.address || 'Not provided'}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-muted-foreground min-w-[60px]">City:</span>
              <span className="font-medium">{shippingInfo.city || 'Not provided'}</span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="rounded-xl border-2 bg-white p-4 md:p-5">
          <h3 className="font-bold text-sm md:text-base mb-3">Order Summary</h3>
          {items.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">Your cart is empty</div>
          ) : (
            <div className="space-y-3">
              {items.map((it) => (
                <div key={it.id} className="flex items-center gap-3">
                  <img src={it.image} className="h-12 w-12 md:h-14 md:w-14 rounded-lg object-cover shrink-0" alt={it.name} />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{it.name}</div>
                    <div className="text-xs text-muted-foreground">Qty: {it.qty}</div>
                  </div>
                  <div className="font-bold text-sm whitespace-nowrap">{formatCurrency(it.price * it.qty)}</div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 space-y-2.5 border-t-2 border-dashed pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium">{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Tax (8%)</span>
              <span className="font-medium">{formatCurrency(tax)}</span>
            </div>
            <div className="flex items-center justify-between border-t-2 pt-3">
              <span className="font-bold text-base">Total</span>
              <span className="text-xl md:text-2xl font-bold text-primary">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-4 md:p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none">
                <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3v-8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="font-bold text-sm md:text-base">Paystack Payment</h3>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            Secure payment via Paystack. Accepts Cards, Mobile Money & Bank Transfer.
          </p>
        </div>

        {/* Mobile sticky payment button */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-20">
          <Button 
            className="w-full h-12 font-bold text-base" 
            size="lg"
            onClick={placeOrder}
            disabled={isProcessing || items.length === 0}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay ${formatCurrency(total)}`
            )}
          </Button>
          <button
            className="w-full mt-2 text-sm text-muted-foreground active:text-foreground"
            onClick={() => navigate(-1)}
            disabled={isProcessing}
          >
            Back to Payment
          </button>
        </div>

        {/* Desktop buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Button 
            className="flex-1 h-12 font-bold" 
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

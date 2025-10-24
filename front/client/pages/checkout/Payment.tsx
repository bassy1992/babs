import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Payment() {
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save payment method preference
    sessionStorage.setItem('payment_info', JSON.stringify({ method: 'paystack' }));
    navigate("/checkout/review");
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
      
      <div className="rounded-lg border-2 border-primary bg-primary/5 p-6">
        <div className="flex items-center gap-3 mb-4">
          <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none">
            <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3v-8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <h3 className="font-semibold text-lg">Pay with Paystack</h3>
            <p className="text-sm text-muted-foreground">Secure payment gateway for Ghana</p>
          </div>
        </div>
        
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Debit/Credit Cards (Visa, Mastercard, Verve)</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Mobile Money (MTN, Vodafone, AirtelTigo)</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Bank Transfer (All major banks)</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Secure & encrypted transactions</span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-md bg-blue-50 border border-blue-200 p-4">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> You will be redirected to Paystack's secure payment page to complete your transaction. 
          Your payment information is never stored on our servers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="flex items-center justify-between">
          <Button type="submit" size="lg">Continue to Review</Button>
          <Button type="button" variant="outline" size="lg" onClick={() => navigate(-1)}>Back</Button>
        </div>
      </form>
    </div>
  );
}

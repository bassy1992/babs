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
    <div className="animate-fade-up">
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold">Payment Method</h2>
        <p className="text-sm text-muted-foreground mt-1">Choose how you'd like to pay</p>
      </div>
      
      <div className="rounded-xl md:rounded-2xl border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10 p-5 md:p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="shrink-0 size-12 md:size-14 rounded-full bg-primary/10 flex items-center justify-center">
            <svg className="h-6 w-6 md:h-7 md:w-7 text-primary" viewBox="0 0 24 24" fill="none">
              <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3v-8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-base md:text-lg">Paystack Payment</h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">Secure payment gateway for Ghana</p>
          </div>
        </div>
        
        <div className="space-y-2.5 md:space-y-3 text-xs md:text-sm">
          <div className="flex items-center gap-2.5">
            <div className="shrink-0 size-5 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-medium">Cards (Visa, Mastercard, Verve)</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="shrink-0 size-5 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-medium">Mobile Money (MTN, Vodafone, AirtelTigo)</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="shrink-0 size-5 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-medium">Bank Transfer</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="shrink-0 size-5 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-medium">Secure & Encrypted</span>
          </div>
        </div>
      </div>

      <div className="mt-4 md:mt-6 rounded-lg bg-blue-50 border-2 border-blue-200 p-4">
        <p className="text-xs md:text-sm text-blue-900 leading-relaxed">
          <strong className="font-semibold">Secure Payment:</strong> You'll be redirected to Paystack's secure payment page. 
          Your payment details are never stored on our servers.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Mobile buttons */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 space-y-2">
          <Button type="submit" size="lg" className="w-full h-12 font-semibold">
            Continue to Review
          </Button>
          <Button type="button" variant="ghost" size="lg" className="w-full" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>

        {/* Desktop buttons */}
        <div className="hidden md:flex items-center gap-3 mt-6">
          <Button type="submit" size="lg" className="flex-1 h-12 font-semibold">
            Continue to Review
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </form>
      
      {/* Spacer for mobile fixed buttons */}
      <div className="md:hidden h-32" />
    </div>
  );
}

import { Link, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Shipping from "./Shipping";
import Payment from "./Payment";
import Review from "./Review";

const STEPS = [
  { id: 1, name: "Shipping", path: "shipping" },
  { id: 2, name: "Payment", path: "payment" },
  { id: 3, name: "Review", path: "review" },
];

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentPath = location.pathname.split('/').pop() || 'shipping';
  const currentStep = STEPS.find(s => s.path === currentPath) || STEPS[0];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-secondary/20">
      {/* Mobile header */}
      <div className="md:hidden sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <Link to="/cart" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground active:text-primary">
              <ArrowLeft className="size-4" /> Cart
            </Link>
            <div className="text-sm font-semibold">
              Checkout
            </div>
            <div className="w-16" />
          </div>
          
          {/* Progress steps */}
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={cn(
                    "size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                    step.id <= currentStep.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {step.id < currentStep.id ? <Check className="size-4" /> : step.id}
                  </div>
                  <div className={cn(
                    "text-[10px] font-medium mt-1",
                    step.id === currentStep.id ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {step.name}
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={cn(
                    "h-0.5 flex-1 mx-2 transition-all",
                    step.id < currentStep.id ? "bg-primary" : "bg-muted"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop header */}
      <section className="hidden md:block container py-8 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Secure Checkout</h1>
            <p className="text-sm text-muted-foreground mt-1">Complete your purchase in 3 easy steps</p>
          </div>
          <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            <ArrowLeft className="size-4" /> Back to cart
          </Link>
        </div>
        
        {/* Desktop progress */}
        <div className="mt-8 flex items-center justify-center max-w-2xl mx-auto">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={cn(
                  "size-12 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                  step.id <= currentStep.id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-muted text-muted-foreground"
                )}>
                  {step.id < currentStep.id ? <Check className="size-5" /> : step.id}
                </div>
                <div className={cn(
                  "text-sm font-semibold mt-2",
                  step.id === currentStep.id ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.name}
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <div className={cn(
                  "h-1 flex-1 mx-4 rounded-full transition-all",
                  step.id < currentStep.id ? "bg-primary" : "bg-muted"
                )} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="container px-4 py-6 md:py-12">
        <div className="max-w-3xl mx-auto">
          <Routes>
            <Route path="/" element={<Shipping />} />
            <Route path="shipping" element={<Shipping />} />
            <Route path="payment" element={<Payment />} />
            <Route path="review" element={<Review />} />
          </Routes>
        </div>
      </section>
    </main>
  );
}

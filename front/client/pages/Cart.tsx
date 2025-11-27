import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { Trash, CreditCard, ArrowLeft, Gift, Sparkles, ShieldCheck, X } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

const PERKS = [
  {
    icon: Sparkles,
    title: "Scent concierge",
    copy: "Complimentary 1:1 layering consult after checkout.",
  },
  {
    icon: Gift,
    title: "Gift-ready",
    copy: "Signature magnetic box and silk cord included with every order.",
  },
  {
    icon: ShieldCheck,
    title: "Quality promise",
    copy: "Ethically sourced ingredients and small-batch production.",
  },
];

export default function Cart() {
  const { items, updateQty, removeItem, subtotal, totalItems } = useCart();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = React.useState("");
  const [appliedPromo, setAppliedPromo] = React.useState<{ code: string; discount: number } | null>(null);
  const [promoError, setPromoError] = React.useState("");

  // Sample promo codes
  const promoCodes: Record<string, number> = {
    "WELCOME10": 0.10,  // 10% off
    "SAVE20": 0.20,     // 20% off
    "FIRST15": 0.15,    // 15% off
    "THANX10": 0.10,    // 10% off
  };

  const handleApplyPromo = () => {
    const code = promoCode.toUpperCase().trim();
    if (!code) {
      setPromoError("Please enter a promo code");
      return;
    }
    
    if (promoCodes[code]) {
      setAppliedPromo({ code, discount: promoCodes[code] });
      setPromoError("");
      setPromoCode("");
    } else {
      setPromoError("Invalid promo code. Try: WELCOME10, SAVE20, or FIRST15");
      setAppliedPromo(null);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoError("");
  };

  const shipping = subtotal > 150 ? 0 : 12;
  const discount = appliedPromo ? subtotal * appliedPromo.discount : 0;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shipping + tax;

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-white to-secondary/20">
      {/* Mobile header */}
      <div className="md:hidden sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/shop" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground active:text-primary">
            <ArrowLeft className="size-4" /> Shop
          </Link>
          <div className="text-sm font-semibold">
            Cart ({totalItems})
          </div>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>
      </div>

      <section className="container px-4 py-6 md:py-16 animate-fade-up">
        {/* Desktop header */}
        <div className="hidden md:flex mb-10 flex-col gap-4 md:flex-row md:items-center md:justify-between animate-fade-up animate-delay-1">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-primary">Your bag</span>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Curate your ritual</h1>
            <p className="mt-2 text-sm text-muted-foreground">{totalItems} items selected — checkout completes your bespoke curation.</p>
          </div>
          <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline self-start md:self-auto">
            <ArrowLeft className="size-4" /> Continue shopping
          </Link>
        </div>

        <div className="grid gap-6 md:gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] animate-fade-up animate-delay-2">
          <div className="space-y-3 md:space-y-5">
            {items.length === 0 ? (
              <Card className="rounded-2xl md:rounded-3xl border-dashed animate-fade-up animate-delay-2">
                <CardContent className="p-8 md:p-12 text-center">
                  <div className="text-lg md:text-xl font-semibold">Your cart is empty</div>
                  <p className="mt-2 md:mt-3 text-sm text-muted-foreground">
                    Discover signature parfums and build your ritual.
                  </p>
                  <Button asChild size="lg" className="mt-4 md:mt-6 rounded-full w-full md:w-auto">
                    <Link to="/shop">Browse fragrances</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3 md:space-y-5">
                {items.map((item, index) => {
                  const delayClass = index > 5 ? "animate-delay-5" : `animate-delay-${index + 1}`;
                  return (
                    <Card
                      key={item.id}
                      className={cn(
                        "animate-fade-up overflow-hidden rounded-xl md:rounded-3xl border bg-white/90 backdrop-blur-sm",
                        delayClass,
                        index === 0 && "md:ring-1 md:ring-primary/20",
                      )}
                    >
                      <CardContent className="p-4 md:p-6">
                        {/* Mobile layout */}
                        <div className="md:hidden flex gap-3">
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex-1 min-w-0">
                                <h2 className="text-sm font-bold text-foreground truncate">{item.name}</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">Qty: {item.qty}</p>
                              </div>
                              <div className="text-sm font-bold text-foreground whitespace-nowrap">
                                {formatCurrency(item.price * item.qty)}
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                              <div className="inline-flex items-center rounded-lg border bg-background">
                                <button
                                  className="px-3 py-1.5 text-sm active:bg-accent"
                                  aria-label="Decrease quantity"
                                  onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))}
                                >
                                  -
                                </button>
                                <div className="w-8 text-center text-sm font-medium">{item.qty}</div>
                                <button
                                  className="px-3 py-1.5 text-sm active:bg-accent"
                                  aria-label="Increase quantity"
                                  onClick={() => updateQty(item.id, item.qty + 1)}
                                >
                                  +
                                </button>
                              </div>

                              <button
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground active:text-destructive"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash className="size-3.5" /> Remove
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Desktop layout */}
                        <div className="hidden md:grid gap-6 md:grid-cols-[auto_1fr] md:items-center md:gap-8">
                          <div className="relative h-36 w-36 overflow-hidden rounded-2xl bg-muted">
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover brightness-[0.9] saturate-[0.88]" loading="lazy" />
                            <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold">Qty {item.qty}</span>
                          </div>

                          <div className="flex flex-1 flex-col justify-between gap-5">
                            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                              <div>
                                <h2 className="text-base font-semibold text-foreground">{item.name}</h2>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Layering-ready extrait</p>
                              </div>
                              <div className="text-base font-semibold text-foreground">{formatCurrency(item.price * item.qty)}</div>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <div className="inline-flex items-center rounded-full border border-primary/15 bg-white/60 p-1">
                                <button
                                  className="px-4 py-2 text-sm"
                                  aria-label="Decrease quantity"
                                  onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))}
                                >
                                  -
                                </button>
                                <div className="w-12 text-center text-sm font-medium">{item.qty}</div>
                                <button
                                  className="px-4 py-2 text-sm"
                                  aria-label="Increase quantity"
                                  onClick={() => updateQty(item.id, item.qty + 1)}
                                >
                                  +
                                </button>
                              </div>

                              <button
                                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash className="size-4" /> Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          <aside className="space-y-4 md:space-y-6 animate-fade-up animate-delay-3">
            {/* Order summary */}
            <Card className="rounded-xl md:rounded-3xl border bg-white/95 backdrop-blur-sm animate-fade-up animate-delay-2">
              <CardContent className="space-y-4 md:space-y-5 p-5 md:p-8">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                {appliedPromo && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600 font-medium">Discount ({appliedPromo.code})</span>
                    <span className="text-green-600 font-semibold">-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-xs md:text-sm font-medium">{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="text-xs md:text-sm">{formatCurrency(tax)}</span>
                </div>
                <div className="border-t border-dashed pt-4 md:pt-5">
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <span className="text-sm font-medium text-muted-foreground">Total</span>
                    <span className="text-xl md:text-2xl font-bold">{formatCurrency(total)}</span>
                  </div>
                  <Button 
                    className="w-full rounded-full h-12 md:h-14 text-sm md:text-base font-semibold" 
                    onClick={() => navigate("/checkout")}
                    disabled={items.length === 0}
                  >
                    <CreditCard className="size-4 md:size-5" /> 
                    <span className="ml-2">Checkout</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Promo code - Desktop only */}
            <Card className="hidden md:block rounded-3xl border bg-white/80 backdrop-blur-sm animate-fade-up animate-delay-3">
              <CardContent className="space-y-4 p-6">
                <div className="text-sm font-semibold text-foreground">Promo Code</div>
                
                {appliedPromo ? (
                  <div className="flex items-center justify-between rounded-full border-2 border-green-200 bg-green-50 px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-green-700">{appliedPromo.code}</span>
                      <span className="text-xs text-green-600">-{(appliedPromo.discount * 100).toFixed(0)}% off</span>
                    </div>
                    <button
                      onClick={handleRemovePromo}
                      className="text-green-600 hover:text-green-700"
                      aria-label="Remove promo code"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        placeholder="Enter code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                        className="flex-1 rounded-full border border-primary/20 bg-background px-4 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                      <Button 
                        variant="outline" 
                        className="rounded-full" 
                        type="button"
                        onClick={handleApplyPromo}
                      >
                        Apply
                      </Button>
                    </div>
                    {promoError && (
                      <p className="text-xs text-destructive">{promoError}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Perks */}
            <div className="grid gap-2.5 md:gap-3 grid-cols-1 md:grid-cols-3">
              {PERKS.map(({ icon: Icon, title, copy }, index) => {
                const delayClass = index > 2 ? "animate-delay-5" : `animate-delay-${index + 2}`;
                return (
                  <Card key={title} className={cn("rounded-lg md:rounded-2xl border border-primary/10 bg-white/70 animate-fade-up", delayClass)}>
                    <CardContent className="space-y-1.5 md:space-y-2 p-3 md:p-4">
                      <Icon className="size-4 md:size-5 text-primary" />
                      <div className="text-xs md:text-sm font-bold text-foreground">{title}</div>
                      <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed">{copy}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </aside>
        </div>
      </section>

      {/* Mobile sticky checkout bar */}
      {items.length > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-white border-t shadow-lg">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs text-muted-foreground">Total</div>
                <div className="text-xl font-bold">{formatCurrency(total)}</div>
              </div>
              <Button 
                className="rounded-full h-11 px-6 font-semibold" 
                onClick={() => navigate("/checkout")}
              >
                Checkout
              </Button>
            </div>
            {shipping > 0 && (
              <div className="text-[10px] text-center text-muted-foreground">
                Add {formatCurrency(150 - subtotal)} more for free shipping
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

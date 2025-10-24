import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { Trash, CreditCard, ArrowLeft, Gift, Sparkles, ShieldCheck } from "lucide-react";
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

  const shipping = subtotal > 150 ? 0 : 12;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <main className="bg-gradient-to-b from-white via-white to-secondary/40">
      <section className="container py-16 animate-fade-up">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between animate-fade-up animate-delay-1">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-primary">Your bag</span>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Curate your ritual</h1>
            <p className="mt-2 text-sm text-muted-foreground">{totalItems} items selected — checkout completes your bespoke curation.</p>
          </div>
          <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline self-start md:self-auto">
            <ArrowLeft className="size-4" /> Continue shopping
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] animate-fade-up animate-delay-2">
          <div className="space-y-5">
            {items.length === 0 ? (
              <Card className="rounded-3xl border-dashed animate-fade-up animate-delay-2">
                <CardContent className="p-12 text-center">
                  <div className="text-xl font-semibold">Your cart is currently empty</div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Discover signature parfums and build your ritual in just a few clicks.
                  </p>
                  <Button asChild size="lg" className="mt-6 rounded-full">
                    <Link to="/shop">Browse fragrances</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-5">
                {items.map((item, index) => {
                  const delayClass = index > 5 ? "animate-delay-5" : `animate-delay-${index + 1}`;
                  return (
                    <Card
                      key={item.id}
                      className={cn(
                        "animate-fade-up overflow-hidden rounded-3xl border border-white/50 bg-white/80 backdrop-blur",
                        delayClass,
                        index === 0 && "ring-1 ring-primary/20",
                      )}
                    >
                      <CardContent className="grid gap-6 p-6 md:grid-cols-[auto_1fr] md:items-center md:gap-8">
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
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          <aside className="space-y-6 animate-fade-up animate-delay-3">
            <Card className="rounded-3xl border border-white/60 bg-white/90 backdrop-blur animate-fade-up animate-delay-2">
              <CardContent className="space-y-5 p-8">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="text-lg font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Complimentary" : formatCurrency(shipping)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Estimated tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="border-t border-dashed pt-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="text-2xl font-semibold">{formatCurrency(total)}</span>
                  </div>
                  <Button className="mt-6 w-full rounded-full py-6 text-sm font-semibold" onClick={() => navigate("/checkout")}>
                    <CreditCard className="size-4" /> Proceed to checkout
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border border-white/50 bg-white/70 backdrop-blur animate-fade-up animate-delay-3">
              <CardContent className="space-y-4 p-6">
                <div className="text-sm font-semibold text-foreground">Redeem a code</div>
                <div className="flex flex-wrap gap-2">
                  <input
                    placeholder="Promo or gift code"
                    className="flex-1 min-w-[180px] rounded-full border border-primary/20 bg-background px-4 py-2 text-sm"
                  />
                  <Button variant="outline" className="rounded-full" type="button">
                    Apply
                  </Button>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Codes are single-use and cannot be combined. Applied discounts are reflected at review.
                </p>
              </CardContent>
            </Card>

            <div className="grid gap-3 sm:grid-cols-3">
              {PERKS.map(({ icon: Icon, title, copy }, index) => {
                const delayClass = index > 2 ? "animate-delay-5" : `animate-delay-${index + 2}`;
                return (
                  <Card key={title} className={cn("rounded-2xl border border-primary/10 bg-white/60 animate-fade-up", delayClass)}>
                    <CardContent className="space-y-2 p-4">
                      <Icon className="size-5 text-primary" />
                      <div className="text-sm font-semibold text-foreground">{title}</div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{copy}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

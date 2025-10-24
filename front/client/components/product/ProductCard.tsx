import * as React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card as UiCard, CardContent as UiCardContent } from "@/components/ui/card";
import { Heart, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  badge?: string;
};

function QuickAdd({ product }: { product: Product }) {
  const { addItem } = useCart();
  const handle = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image });
  };
  return (
    <Button
      className="w-full rounded-full bg-primary px-3 sm:px-4 py-2 sm:py-3 text-[11px] sm:text-[12px] font-semibold tracking-wide hover:bg-primary/90 active:scale-95 transition-all"
      aria-label={`Add ${product.name} to cart`}
      onClick={handle}
    >
      <span className="sm:hidden">Add</span>
      <span className="hidden sm:inline">Add to cart</span>
    </Button>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <UiCard
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl sm:rounded-[20px] border border-primary/10 bg-white/60 backdrop-blur transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 hover:border-primary/30 hover:shadow-xl sm:hover:shadow-2xl animate-fade-up"
    >
      <UiCardContent className="flex flex-1 flex-col p-0">
        <div className="relative w-full">
          <Link to={`/product/${product.id}`} className="block">
            <div className="aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] w-full overflow-hidden rounded-b-[24px] sm:rounded-b-[36px] rounded-t-2xl sm:rounded-t-[20px] bg-gradient-to-br from-primary/5 via-white to-primary/10">
              <img
                src={product.image}
                alt={product.name}
                className="responsive-img object-cover brightness-[0.88] saturate-[0.85] transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </Link>

          {product.badge && (
            <div className="absolute left-2 sm:left-3 top-2 sm:top-3 inline-flex items-center gap-1 sm:gap-2 rounded-full border border-white/60 bg-white/90 px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide text-primary shadow-sm">
              {product.badge}
            </div>
          )}

          <button
            aria-label="Add to wishlist"
            className="absolute right-2 sm:right-3 top-2 sm:top-3 z-10 inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/60 bg-white/90 text-muted-foreground shadow-md transition hover:bg-white active:scale-95"
            onClick={(e) => e.preventDefault()}
            title="Add to wishlist"
          >
            <Heart className="size-3 sm:size-[14px] text-primary transition group-hover:scale-110" />
          </button>

          <div className="absolute inset-x-0 bottom-0 z-10 px-2 sm:px-3 pb-2 sm:pb-3">
            <div className="w-full sm:max-w-[200px] sm:translate-y-4 sm:opacity-0 sm:transition-all sm:duration-500 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
              <QuickAdd product={product} />
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between space-y-2 sm:space-y-3 px-3 sm:px-4 pb-3 sm:pb-4 pt-3 sm:pt-4">
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="text-sm sm:text-base font-semibold leading-tight text-foreground transition-colors group-hover:text-primary line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-muted-foreground">Extrait de parfum</p>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 text-amber-400">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="size-[10px] sm:size-[11px] fill-current" />
              ))}
              <span className="text-[8px] sm:text-[9px] text-muted-foreground hidden xs:inline">(120)</span>
            </div>
            <div className="text-sm sm:text-base font-semibold text-foreground">{formatCurrency(product.price)}</div>
          </div>
        </div>
      </UiCardContent>
    </UiCard>
  );
}

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
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-xl md:rounded-2xl border bg-white transition-all duration-300 hover:shadow-lg md:hover:shadow-xl md:hover:-translate-y-1 animate-fade-up"
    >
      <UiCardContent className="flex flex-1 flex-col p-0">
        {/* Image container */}
        <div className="relative w-full">
          <Link to={`/product/${product.id}`} className="block">
            <div className="aspect-[3/4] w-full overflow-hidden bg-muted">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
          </Link>

          {/* Badge */}
          {product.badge && (
            <div className="absolute left-2 top-2 rounded-full bg-primary/90 backdrop-blur-sm px-2 py-0.5 text-[9px] md:text-[10px] font-bold uppercase tracking-wide text-primary-foreground shadow-sm">
              {product.badge}
            </div>
          )}

          {/* Wishlist button - Desktop only */}
          <button
            aria-label="Add to wishlist"
            className="hidden md:inline-flex absolute right-2 top-2 z-10 size-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border shadow-sm transition-all hover:bg-white hover:scale-110 active:scale-95"
            onClick={(e) => e.preventDefault()}
          >
            <Heart className="size-3.5" />
          </button>

          {/* Quick add button - Desktop hover only */}
          <div className="hidden md:block absolute inset-x-0 bottom-0 z-10 px-3 pb-3">
            <div className="translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <QuickAdd product={product} />
            </div>
          </div>
        </div>

        {/* Product info */}
        <div className="flex flex-1 flex-col gap-1.5 md:gap-2 p-2.5 md:p-3">
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="text-xs md:text-sm font-bold leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          
          {/* Price and rating */}
          <div className="flex items-center justify-between gap-2 mt-auto">
            <div className="text-sm md:text-base font-bold text-foreground">
              {formatCurrency(product.price)}
            </div>
            <div className="flex items-center gap-0.5 text-amber-400">
              <Star className="size-3 md:size-3.5 fill-current" />
              <span className="text-[10px] md:text-xs font-semibold text-foreground">5.0</span>
            </div>
          </div>

          {/* Mobile add button */}
          <div className="md:hidden mt-2">
            <QuickAdd product={product} />
          </div>
        </div>
      </UiCardContent>
    </UiCard>
  );
}

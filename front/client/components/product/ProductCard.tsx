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
      className="w-full rounded-full bg-gradient-to-r from-primary to-primary/90 px-4 py-2.5 md:py-3 text-[11px] md:text-xs font-bold tracking-wide text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-300"
      aria-label={`Add ${product.name} to cart`}
      onClick={handle}
    >
      <span className="md:hidden">Add to Cart</span>
      <span className="hidden md:inline">Add to Cart</span>
    </Button>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <UiCard
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl md:rounded-3xl border-0 bg-gradient-to-br from-white via-white to-secondary/30 shadow-sm transition-all duration-500 hover:shadow-2xl md:hover:-translate-y-2 animate-fade-up"
    >
      <UiCardContent className="flex flex-1 flex-col p-0">
        {/* Image container */}
        <div className="relative w-full">
          <Link to={`/product/${product.id}`} className="block">
            <div className="aspect-[3/4] w-full overflow-hidden rounded-t-2xl md:rounded-t-3xl bg-gradient-to-br from-primary/5 via-muted to-primary/10 relative">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-105"
                loading="lazy"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          </Link>

          {/* Badge with glow effect */}
          {product.badge && (
            <div className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-primary to-primary/80 backdrop-blur-sm px-3 py-1 text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/30">
              {product.badge}
            </div>
          )}

          {/* Wishlist button with backdrop */}
          <button
            aria-label="Add to wishlist"
            className="absolute right-3 top-3 z-10 inline-flex size-9 md:size-10 items-center justify-center rounded-full bg-white/95 backdrop-blur-md border-2 border-white/50 shadow-lg transition-all hover:bg-white hover:scale-110 hover:border-primary/30 active:scale-95"
            onClick={(e) => e.preventDefault()}
          >
            <Heart className="size-4 md:size-[18px] text-primary/70 transition-all group-hover:text-primary group-hover:scale-110" />
          </button>

          {/* Quick add button - Desktop hover */}
          <div className="hidden md:block absolute inset-x-0 bottom-0 z-10 px-4 pb-4">
            <div className="translate-y-6 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <QuickAdd product={product} />
            </div>
          </div>
        </div>

        {/* Product info with enhanced styling */}
        <div className="flex flex-1 flex-col gap-2 md:gap-2.5 p-3 md:p-4 bg-white/80 backdrop-blur-sm">
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="text-sm md:text-base font-bold leading-tight text-foreground line-clamp-2 transition-colors group-hover:text-primary">
              {product.name}
            </h3>
          </Link>
          
          <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
            Extrait de Parfum
          </p>
          
          {/* Price and rating with modern layout */}
          <div className="flex items-center justify-between gap-2 mt-auto pt-1">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium">From</span>
              <span className="text-base md:text-lg font-bold text-foreground">
                {formatCurrency(product.price)}
              </span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/50">
              <Star className="size-3 md:size-3.5 fill-amber-400 text-amber-400" />
              <span className="text-[10px] md:text-xs font-bold text-amber-700">5.0</span>
            </div>
          </div>

          {/* Mobile add button with modern styling */}
          <div className="md:hidden mt-2">
            <QuickAdd product={product} />
          </div>
        </div>
      </UiCardContent>
    </UiCard>
  );
}

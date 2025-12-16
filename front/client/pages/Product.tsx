import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProductCard, type Product } from "@/components/product/ProductCard";
import { useCart } from "@/context/CartContext";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { useProduct, useRelatedProducts } from "@/hooks/useProducts";
import { ReviewsSection } from "@/components/reviews";
import {
  ArrowUpRight,
  Droplet,
  Heart,
  Leaf,
  Palette,
  Share2,
  Sparkles,
  Star,
  Truck,
  ShieldCheck,
  Package,
  Loader2,
} from "lucide-react";

type ProductVariant = {
  label: string;
  volume: string;
  price: number;
};

type AccordSection = {
  top: string[];
  heart: string[];
  base: string[];
};

type ProductDetail = {
  id: string;
  name: string;
  description: string;
  story: string;
  gallery: string[];
  sizes: ProductVariant[];
  accords: AccordSection;
  highlights: { title: string; copy: string }[];
  ritual: string[];
  ingredients: string[];
  rating: { average: number; count: number };
};

// All product data is now loaded dynamically from the API

const SERVICE_POINTS = [
  {
    icon: Truck,
    title: "Complimentary shipping",
    copy: `Free delivery on orders over ${formatCurrency(75)} with express upgrades available.`,
  },
  {
    icon: ShieldCheck,
    title: "45-day returns",
    copy: "Try at your own pace with easy returns and instant store credit.",
  },
  {
    icon: Package,
    title: "Monogram packaging",
    copy: "Personalize your keepsake box at checkout, on the house.",
  },
];

export default function Product() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  // Fetch product from API
  const { data: product, isLoading, error } = useProduct(slug);
  const { data: relatedData } = useRelatedProducts(product?.slug || slug);

  const [activeImage, setActiveImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");

  // Transform related products
  const relatedProducts: Product[] = useMemo(() => {
    if (!relatedData || !Array.isArray(relatedData)) return [];
    return relatedData.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: parseFloat(p.price),
      image: p.image,
      badge: p.badge || (p.is_bestseller ? "Bestseller" : undefined),
    }));
  }, [relatedData]);

  useEffect(() => {
    if (product?.gallery?.[0]) {
      setActiveImage(product.gallery[0]);
    }
    if (product?.sizes?.[0]?.volume) {
      setSelectedSize(product.sizes[0].volume);
    }
  }, [product]);

  // Show loading state
  if (isLoading) {
    return (
      <main className="container py-20">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading product...</p>
        </div>
      </main>
    );
  }

  // Show error or not found
  if (error || !product) {
    return (
      <main className="container py-20">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-destructive/10 p-4 mb-4">
            <Package className="h-12 w-12 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            Sorry, we couldn't find the product you're looking for.
          </p>
          <div className="flex gap-3">
            <Button asChild>
              <Link to="/shop">Browse All Products</Link>
            </Button>
            <Button variant="outline" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const variant = product.sizes?.find((size: any) => size.volume === selectedSize) ?? product.sizes?.[0];

  const ldJson = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.gallery,
    description: product.description,
    sku: product.id,
    offers: {
      "@type": "Offer",
      priceCurrency: "GHS",
      price: variant?.price?.toString() || product.price,
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating?.average || 0,
      reviewCount: product.rating?.count || 0,
    },
  };

  const handleAddToCart = () => {
    addItem(
      {
        id: `${product.id}-${variant?.volume || 'default'}`,
        name: `${product.name}${variant?.volume ? ` (${variant.volume})` : ''}`,
        price: parseFloat(variant?.price || product.price),
        image: product.gallery?.[0] || '',
        productId: product.id,
        variantId: variant?.id,
      },
      1,
    );
  };

  return (
    <main className="min-h-screen">
      <script type="application/ld+json">{JSON.stringify(ldJson)}</script>
      
      {/* Mobile: Full-width image gallery */}
      <section className="md:hidden relative">
        <div className="relative aspect-[3/4] bg-muted">
          <img
            src={activeImage}
            alt={product.name}
            className="h-full w-full object-cover"
            loading="eager"
          />
          {/* Image counter */}
          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
            {product.gallery.findIndex(img => img === activeImage) + 1} / {product.gallery.length}
          </div>
        </div>
        
        {/* Thumbnail strip */}
        <div className="flex gap-2 overflow-x-auto px-4 py-3 snap-x snap-mandatory scrollbar-hide bg-background/95 backdrop-blur-sm border-b">
          {product.gallery.map((image) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveImage(image)}
              className={cn(
                "relative h-16 w-16 shrink-0 snap-center overflow-hidden rounded-lg border-2 transition-all",
                activeImage === image
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border/50 opacity-60",
              )}
            >
              <img
                src={image}
                alt={`${product.name} thumbnail`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </section>

      {/* Desktop: Side-by-side layout */}
      <section className="hidden md:block container px-4 py-16 lg:py-20 animate-fade-up">
        <div className="mb-8 text-xs uppercase tracking-wide text-muted-foreground">
          <Link to="/shop" className="hover:text-primary">
            Shop
          </Link>{" "}
          / <span className="truncate max-w-[200px] inline-block align-bottom">{product.name}</span>
        </div>
        <div className="grid gap-8 lg:gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)]">
          <div className="flex gap-4">
            <div className="flex flex-col gap-3 w-20">
              {product.gallery.map((image) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  className={cn(
                    "relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all",
                    activeImage === image
                      ? "border-primary shadow-md"
                      : "border-transparent hover:border-primary/60",
                  )}
                >
                  <img
                    src={image}
                    alt={`${product.name} thumbnail`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
            <div className="flex-1 aspect-[4/5] overflow-hidden rounded-[32px] bg-muted shadow-xl">
              <img
                src={activeImage}
                alt={product.name}
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>
          </div>

          {/* Desktop product info */}
          <div className="space-y-8">
            <div className="space-y-4">
              {product.rating && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Star className="size-4 fill-primary text-primary" />
                  <span className="font-medium">{product.rating.average.toFixed(1)}</span>
                  <span className="text-muted-foreground/70">({product.rating.count})</span>
                </div>
              )}
              <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight leading-tight">
                {product.name}
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed">{product.description}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{formatCurrency(parseFloat(variant?.price || product.price))}</span>
                {variant?.label && <span className="text-sm text-muted-foreground">/ {variant.label}</span>}
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Select Size
              </div>
              <div className="grid gap-3 grid-cols-3">
                {product.sizes?.map((size: any) => (
                  <button
                    key={size.volume}
                    type="button"
                    onClick={() => setSelectedSize(size.volume)}
                    className={cn(
                      "rounded-xl border-2 px-4 py-3 text-left transition-all",
                      selectedSize === size.volume
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/60 hover:bg-accent/50",
                    )}
                    aria-pressed={selectedSize === size.volume}
                  >
                    <div className="text-sm font-semibold text-foreground truncate">{size.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{formatCurrency(parseFloat(size.price))}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button size="lg" className="flex-1 h-12 text-base font-semibold" onClick={handleAddToCart}>
                Add to Cart
              </Button>
              <button
                type="button"
                className="inline-flex size-12 items-center justify-center rounded-full border-2 hover:border-primary/60 hover:bg-accent/50 transition-all" 
                aria-label="Add to wishlist"
              >
                <Heart className="size-5" />
              </button>
              <button
                type="button"
                className="inline-flex size-12 items-center justify-center rounded-full border-2 hover:border-primary/60 hover:bg-accent/50 transition-all"
                aria-label="Share scent"
              >
                <Share2 className="size-5" />
              </button>
            </div>

            <div className="grid gap-4 grid-cols-3">
              {SERVICE_POINTS.map(({ icon: Icon, title, copy }) => (
                <Card key={title} className="border-dashed hover:border-primary/30 transition-colors">
                  <CardContent className="space-y-2 p-4">
                    <Icon className="size-5 text-primary" />
                    <div className="text-sm font-semibold text-foreground leading-tight">{title}</div>
                    <p className="text-xs leading-relaxed text-muted-foreground">{copy}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile: Product info */}
      <section className="md:hidden px-4 py-6 space-y-6">
        <div className="space-y-3">
          {product.rating && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Star className="size-3.5 fill-primary text-primary" />
              <span className="font-semibold">{product.rating.average.toFixed(1)}</span>
              <span>({product.rating.count} reviews)</span>
            </div>
          )}
          <h1 className="text-2xl font-bold tracking-tight leading-tight">
            {product.name}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
        </div>

        {/* Price and size selector */}
        <div className="space-y-4">
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold">{formatCurrency(parseFloat(variant?.price || product.price))}</span>
            {variant?.label && <span className="text-sm text-muted-foreground">{variant.label}</span>}
          </div>
          
          <div className="space-y-2.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Select Size
            </div>
            <div className="grid gap-2 grid-cols-3">
              {product.sizes?.map((size: any) => (
                <button
                  key={size.volume}
                  type="button"
                  onClick={() => setSelectedSize(size.volume)}
                  className={cn(
                    "rounded-lg border-2 px-3 py-3 text-center transition-all active:scale-95",
                    selectedSize === size.volume
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-border active:border-primary/60",
                  )}
                  aria-pressed={selectedSize === size.volume}
                >
                  <div className="text-xs font-bold text-foreground">{size.label}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{formatCurrency(parseFloat(size.price))}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <Button size="lg" className="w-full h-12 text-base font-semibold" onClick={handleAddToCart}>
            Add to Cart — {formatCurrency(parseFloat(variant?.price || product.price))}
          </Button>
          <div className="flex gap-2">
            <button
              type="button"
              className="flex-1 h-11 inline-flex items-center justify-center gap-2 rounded-lg border-2 font-medium text-sm active:scale-95 transition-all" 
              aria-label="Add to wishlist"
            >
              <Heart className="size-4" />
              <span>Save</span>
            </button>
            <button
              type="button"
              className="flex-1 h-11 inline-flex items-center justify-center gap-2 rounded-lg border-2 font-medium text-sm active:scale-95 transition-all"
              aria-label="Share scent"
            >
              <Share2 className="size-4" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Service points - mobile compact */}
        <div className="space-y-2 pt-4 border-t">
          {SERVICE_POINTS.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="flex gap-3 items-start">
              <div className="shrink-0 mt-0.5">
                <Icon className="size-4 text-primary" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-foreground">{title}</div>
                <p className="text-[11px] leading-relaxed text-muted-foreground">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fragrance details section */}
      <section className="px-4 md:container py-8 md:py-12 space-y-6 md:space-y-12 bg-secondary/20 md:bg-transparent">
        <div className="grid gap-6 md:gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="space-y-6 md:space-y-8">
            {/* Fragrance structure */}
            <div>
              <h2 className="text-lg md:text-xl font-bold tracking-tight mb-4">Fragrance Notes</h2>
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                {product.accords && ([
                  { label: "Top", notes: product.accords.top, icon: Sparkles, color: "text-amber-500" },
                  { label: "Heart", notes: product.accords.heart, icon: Droplet, color: "text-rose-500" },
                  { label: "Base", notes: product.accords.base, icon: Leaf, color: "text-emerald-500" },
                ] as const).map(({ label, notes, icon: Icon, color }) => (
                  <Card key={label} className="border-2">
                    <CardContent className="space-y-2.5 p-4">
                      <div className={cn("flex items-center gap-2 text-sm font-bold", color)}>
                        <Icon className="size-4" /> {label}
                      </div>
                      <ul className="space-y-1.5 text-xs text-muted-foreground">
                        {notes.map((note) => (
                          <li key={note} className="flex items-start gap-1.5">
                            <span className="text-primary mt-0.5">•</span>
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Story and highlights */}
            {(product.story || (product.highlights && product.highlights.length > 0)) && (
              <div className="space-y-4">
                <h2 className="text-lg md:text-xl font-bold tracking-tight">The Story</h2>
                {product.story && <p className="text-sm leading-relaxed text-muted-foreground">{product.story}</p>}
                {product.highlights && product.highlights.length > 0 && (
                  <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
                    {product.highlights.map((item: any) => (
                      <Card key={item.title} className="border-l-4 border-l-primary">
                        <CardContent className="space-y-1.5 p-4">
                          <div className="text-sm font-bold text-foreground">{item.title}</div>
                          <p className="text-xs leading-relaxed text-muted-foreground">{item.copy}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar info */}
          <aside className="space-y-4 md:space-y-6">
            {product.ritual && product.ritual.length > 0 && (
              <div className="rounded-xl md:rounded-2xl border-2 bg-gradient-to-br from-primary/5 to-primary/10 p-4 md:p-5">
                <h3 className="text-sm font-bold uppercase tracking-wide text-foreground mb-3">
                  How to Apply
                </h3>
                <ul className="space-y-2.5 text-xs text-muted-foreground">
                  {product.ritual.map((tip: string, index: number) => (
                  <li key={tip} className="flex gap-2.5">
                    <span className="shrink-0 flex items-center justify-center size-5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                      {index + 1}
                    </span>
                    <span className="pt-0.5">{tip}</span>
                  </li>
                  ))}
                </ul>
              </div>
            )}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="rounded-xl md:rounded-2xl border-2 bg-background p-4 md:p-5">
                <h3 className="text-sm font-bold uppercase tracking-wide text-foreground mb-3">
                  Key Ingredients
                </h3>
                <div className="flex flex-wrap gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                  {product.ingredients.map((ingredient: string) => (
                  <span key={ingredient} className="rounded-full border-2 px-2.5 py-1 font-medium">
                    {ingredient}
                  </span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewsSection productId={product.id} />

      {/* Related products */}
      <section className="px-4 md:container py-8 md:py-12">
        <div className="mb-5 md:mb-8 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">
            You May Also Like
          </h2>
          <Button asChild variant="ghost" size="sm" className="gap-1 text-xs md:text-sm font-semibold text-primary -mr-2">
            <Link to="/shop">
              View All <ArrowUpRight className="size-3.5 md:size-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-3">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((related, index) => (
              <div key={related.id} style={{ animation: `fadeSlideUp 0.7s ease forwards`, animationDelay: `${index * 0.08}s` }}>
                <ProductCard product={related} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-sm text-muted-foreground">
              No related products available
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

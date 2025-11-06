import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProductCard, type Product } from "@/components/product/ProductCard";
import { useCart } from "@/context/CartContext";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { useProduct, useRelatedProducts } from "@/hooks/useProducts";
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
    <main className="space-y-12 md:space-y-16">
      <section className="container px-4 py-6 md:py-16 lg:py-20 animate-fade-up">
        <script type="application/ld+json">{JSON.stringify(ldJson)}</script>
        <div className="mb-4 md:mb-8 text-xs uppercase tracking-wide text-muted-foreground">
          <Link to="/shop" className="hover:text-primary">
            Shop
          </Link>{" "}
          / <span className="truncate max-w-[200px] inline-block align-bottom">{product.name}</span>
        </div>
        <div className="grid gap-6 md:gap-8 lg:gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-3 md:gap-4 md:flex-row">
            <div className="order-2 flex gap-2 md:gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide md:order-1 md:flex-col md:overflow-visible md:pb-0 md:w-20">
              {product.gallery.map((image) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  className={cn(
                    "relative h-14 w-14 md:h-20 md:w-20 shrink-0 snap-center overflow-hidden rounded-lg md:rounded-2xl border-2 transition-all",
                    activeImage === image
                      ? "border-primary shadow-md scale-105"
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
            <div className="order-1 flex-1 aspect-square md:aspect-[4/5] overflow-hidden rounded-xl md:rounded-[32px] bg-muted shadow-lg md:shadow-xl">
              <img
                src={activeImage}
                alt={product.name}
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>
          </div>

          <div className="space-y-5 md:space-y-8">
            <div className="space-y-2 md:space-y-4">
              {product.rating && (
                <div className="flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground">
                  <Star className="size-3.5 md:size-4 fill-primary text-primary" />
                  <span className="font-medium">{product.rating.average.toFixed(1)}</span>
                  <span className="text-muted-foreground/70">({product.rating.count})</span>
                </div>
              )}
              <h1 className="text-2xl font-semibold tracking-tight leading-tight sm:text-3xl lg:text-4xl">
                {product.name}
              </h1>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{product.description}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl md:text-3xl font-bold">{formatCurrency(parseFloat(variant?.price || product.price))}</span>
                {variant?.label && <span className="text-xs md:text-sm text-muted-foreground">/ {variant.label}</span>}
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              <div className="text-xs md:text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Select Size
              </div>
              <div className="grid gap-2 md:gap-3 grid-cols-3">
                {product.sizes?.map((size: any) => (
                  <button
                    key={size.volume}
                    type="button"
                    onClick={() => setSelectedSize(size.volume)}
                    className={cn(
                      "rounded-lg md:rounded-xl border-2 px-2 py-2.5 md:px-4 md:py-3 text-left transition-all",
                      selectedSize === size.volume
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/60 hover:bg-accent/50",
                    )}
                    aria-pressed={selectedSize === size.volume}
                  >
                    <div className="text-xs md:text-sm font-semibold text-foreground truncate">{size.label}</div>
                    <div className="text-[10px] md:text-xs text-muted-foreground mt-0.5">{formatCurrency(parseFloat(size.price))}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
              <Button size="lg" className="flex-1 h-11 md:h-12 text-sm md:text-base font-semibold" onClick={handleAddToCart}>
                Add to Cart
              </Button>
              <div className="flex gap-2 justify-center sm:justify-start">
                <button
                  type="button"
                  className="inline-flex size-11 md:size-12 items-center justify-center rounded-full border-2 hover:border-primary/60 hover:bg-accent/50 transition-all" 
                  aria-label="Add to wishlist"
                >
                  <Heart className="size-4 md:size-5" />
                </button>
                <button
                  type="button"
                  className="inline-flex size-11 md:size-12 items-center justify-center rounded-full border-2 hover:border-primary/60 hover:bg-accent/50 transition-all"
                  aria-label="Share scent"
                >
                  <Share2 className="size-4 md:size-5" />
                </button>
              </div>
            </div>

            <div className="grid gap-2.5 md:gap-4 grid-cols-1 sm:grid-cols-3">
              {SERVICE_POINTS.map(({ icon: Icon, title, copy }) => (
                <Card key={title} className="border-dashed hover:border-primary/30 transition-colors">
                  <CardContent className="space-y-1.5 md:space-y-2 p-3 md:p-4">
                    <Icon className="size-4 md:size-5 text-primary" />
                    <div className="text-xs md:text-sm font-semibold text-foreground leading-tight">{title}</div>
                    <p className="text-[10px] md:text-xs leading-relaxed text-muted-foreground">{copy}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container space-y-8 md:space-y-12 animate-fade-up animate-delay-2">
        <div className="grid gap-8 md:gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="space-y-6 md:space-y-8">
            <div>
              <h2 className="text-lg md:text-xl font-semibold tracking-tight">Fragrance structure</h2>
              <div className="mt-4 grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-3">
                {product.accords && ([
                  { label: "Top", notes: product.accords.top, icon: Sparkles },
                  { label: "Heart", notes: product.accords.heart, icon: Droplet },
                  { label: "Base", notes: product.accords.base, icon: Leaf },
                ] as const).map(({ label, notes, icon: Icon }) => (
                  <Card key={label}>
                    <CardContent className="space-y-2 md:space-y-3 p-4 md:p-5">
                      <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-foreground">
                        <Icon className="size-3 md:size-4 text-primary" /> {label} notes
                      </div>
                      <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-muted-foreground">
                        {notes.map((note) => (
                          <li key={note}>{note}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              <h2 className="text-lg md:text-xl font-semibold tracking-tight">About this extrait</h2>
              {product.story && <p className="text-sm leading-relaxed text-muted-foreground">{product.story}</p>}
              {product.highlights && product.highlights.length > 0 && (
                <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-3">
                  {product.highlights.map((item: any) => (
                    <Card key={item.title} className="h-full">
                      <CardContent className="space-y-2 p-4 md:p-5">
                        <div className="text-xs md:text-sm font-semibold text-foreground">{item.title}</div>
                        <p className="text-xs leading-relaxed text-muted-foreground">{item.copy}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-6 md:space-y-8">
            {product.ritual && product.ritual.length > 0 && (
              <div className="rounded-2xl md:rounded-3xl border bg-secondary/40 p-4 md:p-6">
                <h3 className="text-xs md:text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Ritual notes
                </h3>
                <ul className="mt-3 md:mt-4 space-y-2 md:space-y-3 text-xs md:text-sm text-muted-foreground">
                  {product.ritual.map((tip: string) => (
                  <li key={tip} className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>{tip}</span>
                  </li>
                  ))}
                </ul>
              </div>
            )}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="rounded-2xl md:rounded-3xl border bg-secondary/20 p-4 md:p-6">
                <h3 className="text-xs md:text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Ingredients
                </h3>
                <ul className="mt-3 md:mt-4 flex flex-wrap gap-1.5 md:gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                  {product.ingredients.map((ingredient: string) => (
                  <li key={ingredient} className="rounded-full border px-2 py-0.5 md:px-3 md:py-1">
                    {ingredient}
                  </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>

      <section className="container pb-12 md:pb-16 animate-fade-up animate-delay-3">
        <div className="mb-6 md:mb-8 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl lg:text-3xl">
            Pairs well with
          </h2>
          <Button asChild variant="ghost" className="gap-1 text-xs md:text-sm font-medium text-primary">
            <Link to="/shop">
              Browse all <ArrowUpRight className="size-3 md:size-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((related, index) => (
              <div key={related.id} style={{ animation: `fadeSlideUp 0.7s ease forwards`, animationDelay: `${index * 0.08}s` }}>
                <ProductCard product={related} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No related products available
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

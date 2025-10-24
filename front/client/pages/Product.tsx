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

const PRODUCT_CATALOG: Record<string, ProductDetail> = {
  "noir-bouquet": {
    id: "noir-bouquet",
    name: "Noir Bouquet",
    description:
      "Velvety florals illuminated by smoked amber and rare Madagascan vanilla for a lingering, magnetic aura.",
    story:
      "Inspired by midnight garden salons in Paris, Noir Bouquet captures the contrast of blooming roses against crisp evening air.",
    gallery: [
      "https://images.unsplash.com/photo-1604937455095-ef2fe3d842b6?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1549887534-1e8a0f3b4d9c?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1526745920543-275d4b786d9d?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542639096-0dca574b3cf4?q=80&w=1600&auto=format&fit=crop",
    ],
    sizes: [
      { label: "Extrait 50ml", volume: "50ml", price: 89 },
      { label: "Extrait 100ml", volume: "100ml", price: 138 },
      { label: "Discovery 10ml", volume: "10ml", price: 32 },
    ],
    accords: {
      top: ["Italian bergamot", "Crushed fig leaf"],
      heart: ["Velvet rose", "Saffron petal"],
      base: ["Smoked amber", "Creamy sandalwood"],
    },
    highlights: [
      {
        title: "12-hour sillage",
        copy: "High concentration extrait ensures a luxurious, enduring projection from day to evening.",
      },
      {
        title: "Skin-first base",
        copy: "Crafted with organic sugarcane alcohol and nourishing botanicals for a soft, non-drying finish.",
      },
      {
        title: "Responsible sourcing",
        copy: "Partnerships with fair-trade growers across Madagascar, Grasse, and Morocco.",
      },
    ],
    ritual: [
      "Mist once over hair to create a diffused trail.",
      "Layer with Velvet Evenings oil on pulse points for depth.",
      "Refresh mid-afternoon with the 10ml discovery vial.",
    ],
    ingredients: [
      "Organic grain alcohol",
      "Rose absolute",
      "Fig leaf accord",
      "Amber resin",
      "Sandalwood",
      "Vanilla bean",
    ],
    rating: { average: 4.8, count: 312 },
  },
  "rose-velours": {
    id: "rose-velours",
    name: "Rose Velours",
    description:
      "A plush blend of rose de mai, blackcurrant bud, and cashmere woods that wraps the senses in warmth.",
    story:
      "Rose Velours nods to gilded lounges in Marrakech, where velvet drapes absorb candlelight and rose petals perfuse the air.",
    gallery: [
      "https://images.unsplash.com/photo-1601688246360-68d1bb27b3f7?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1514866726862-0f081731e63f?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1600&auto=format&fit=crop",
    ],
    sizes: [
      { label: "Parfum 50ml", volume: "50ml", price: 79 },
      { label: "Parfum 100ml", volume: "100ml", price: 126 },
      { label: "Layering oil 15ml", volume: "15ml", price: 45 },
    ],
    accords: {
      top: ["Pink pepper", "Blackcurrant bud"],
      heart: ["Rose de mai", "Indian jasmine"],
      base: ["Cashmere wood", "White musk"],
    },
    highlights: [
      {
        title: "Soft-focus aura",
        copy: "Microfine musk accord diffuses on skin for a gossamer veil.",
      },
      {
        title: "Cruelty-free",
        copy: "Certified vegan, no animal-derived ingredients or testing.",
      },
      {
        title: "Refill eligible",
        copy: "Bring back empty bottles for 20% off your refill in-store.",
      },
    ],
    ritual: [
      "Pair with Botanical Library mist for a luminous floral cloud.",
      "Apply to cashmere or silk scarves to enhance natural fibers.",
      "Diffuse two sprays in your closet to scent evening wear.",
    ],
    ingredients: ["Alcohol denat.", "Rosa centifolia", "Cassis absolute", "Jasmine sambac", "Cashmeran"],
    rating: { average: 4.7, count: 204 },
  },
  "amber-dusk": {
    id: "amber-dusk",
    name: "Amber Dusk",
    description:
      "Resinous amber swirled with roasted tonka and smoked vetiver, reminiscent of golden-hour bonfires.",
    story:
      "Amber Dusk traces the warmth of coastal sunsets, capturing the glow of embers and salted skin.",
    gallery: [
      "https://images.unsplash.com/photo-1563170351-be82bc888aa4?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1462396881884-de2c07cb95ed?q=80&w=1600&auto=format&fit=crop",
    ],
    sizes: [
      { label: "Parfum 50ml", volume: "50ml", price: 95 },
      { label: "Parfum 100ml", volume: "100ml", price: 148 },
      { label: "Travel spray 8ml", volume: "8ml", price: 34 },
    ],
    accords: {
      top: ["Pink pepper", "Sea salt"],
      heart: ["Amber resin", "Cedarwood"],
      base: ["Roasted tonka", "Smoked vetiver"],
    },
    highlights: [
      {
        title: "After-dusk energy",
        copy: "Built for evenings out with an addictive gourmand-amber finish.",
      },
      {
        title: "Climate conscious",
        copy: "Bottle crafted from 40% recycled glass and FSC-certified packaging.",
      },
      {
        title: "Complimentary engraving",
        copy: "Personalize the 100ml bottle with monogram engraving in-store.",
      },
    ],
    ritual: [
      "Mist onto wrists and brush through hair for a luminous trail.",
      "Blend with Noir Bouquet to dial up smokiness.",
      "Diffuse two sprays into a silk-lined travel case before packing.",
    ],
    ingredients: ["Alcohol denat.", "Amber accord", "Cedarwood", "Tonka bean", "Vetiver"],
    rating: { average: 4.9, count: 178 },
  },
  "citrus-bloom": {
    id: "citrus-bloom",
    name: "Citrus Bloom",
    description:
      "Sunlit neroli entwined with yuzu zest and white tea for a sparkling, luminous lift.",
    story:
      "Citrus Bloom channels Riviera mornings, brimming with Mediterranean light and orchard breezes.",
    gallery: [
      "https://images.unsplash.com/photo-1547887537-6158d64c30af?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1521417531039-75e91486cc00?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520975922284-6c7d53a481d0?q=80&w=1600&auto=format&fit=crop",
    ],
    sizes: [
      { label: "Eau de parfum 50ml", volume: "50ml", price: 72 },
      { label: "Eau de parfum 100ml", volume: "100ml", price: 118 },
      { label: "Body veil 75ml", volume: "75ml", price: 48 },
    ],
    accords: {
      top: ["Yuzu zest", "Green mandarin"],
      heart: ["Orange blossom", "White tea"],
      base: ["Musk", "Hinoki"],
    },
    highlights: [
      {
        title: "Effervescent clarity",
        copy: "Bright citrus accord diffuses instantly for an uplifting start.",
      },
      {
        title: "Skin-friendly",
        copy: "Infused with aloe vera to calm and hydrate the skin.",
      },
      {
        title: "Carry-on ready",
        copy: "Leak-proof atomizer designed for effortless travel.",
      },
    ],
    ritual: [
      "Spritz before sunrise yoga for an energizing reset.",
      "Layer with Botanical Library hair mist for a luminous cloud.",
      "Apply to pulse points after moisturizing to enhance longevity.",
    ],
    ingredients: ["Alcohol denat.", "Neroli", "Yuzu", "White tea", "Musk accord"],
    rating: { average: 4.6, count: 241 },
  },
};

const RELATED_PRODUCTS: Product[] = [
  {
    id: "rose-velours",
    name: "Rose Velours",
    price: 79,
    image: "https://images.unsplash.com/photo-1601688246360-68d1bb27b3f7?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "amber-dusk",
    name: "Amber Dusk",
    price: 95,
    image: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "citrus-bloom",
    name: "Citrus Bloom",
    price: 72,
    image: "https://images.unsplash.com/photo-1547887537-6158d64c30af?q=80&w=1400&auto=format&fit=crop",
  },
];

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
  const { data: relatedData } = useRelatedProducts(slug);

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
    <main className="space-y-16">
      <section className="container py-8 md:py-16 lg:py-20 animate-fade-up">
        <script type="application/ld+json">{JSON.stringify(ldJson)}</script>
        <div className="mb-6 md:mb-8 text-xs uppercase tracking-wide text-muted-foreground">
          <Link to="/shop" className="hover:text-primary">
            Shop
          </Link>{" "}
          / <span className="truncate">{product.name}</span>
        </div>
        <div className="grid gap-8 lg:gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="order-2 flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory md:order-1 md:flex-col md:overflow-visible md:pb-0 md:w-20">
              {product.gallery.map((image) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  className={cn(
                    "relative h-16 w-16 md:h-20 md:w-20 shrink-0 snap-center overflow-hidden rounded-xl md:rounded-2xl border transition",
                    activeImage === image
                      ? "border-primary shadow"
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
            <div className="order-1 flex-1 aspect-square md:aspect-[4/5] overflow-hidden rounded-2xl md:rounded-[32px] bg-muted shadow-xl">
              <img
                src={activeImage}
                alt={product.name}
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>
          </div>

          <div className="space-y-6 md:space-y-8">
            <div className="space-y-3 md:space-y-4">
              {product.rating && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="size-4 fill-primary text-primary" />
                  <span>{product.rating.average.toFixed(1)}</span>
                  <span>({product.rating.count} reviews)</span>
                </div>
              )}
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
                {product.name}
              </h1>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{product.description}</p>
              <div className="flex items-center gap-3">
                <span className="text-xl md:text-2xl font-semibold">{formatCurrency(parseFloat(variant?.price || product.price))}</span>
                {variant?.label && <span className="text-sm text-muted-foreground">{variant.label}</span>}
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              <div className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Choose your format
              </div>
              <div className="grid gap-2 md:gap-3 grid-cols-1 sm:grid-cols-3">
                {product.sizes?.map((size: any) => (
                  <button
                    key={size.volume}
                    type="button"
                    onClick={() => setSelectedSize(size.volume)}
                    className={cn(
                      "rounded-xl md:rounded-2xl border px-3 py-2 md:px-4 md:py-3 text-left transition",
                      selectedSize === size.volume
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/60",
                    )}
                    aria-pressed={selectedSize === size.volume}
                  >
                    <div className="text-sm font-semibold text-foreground">{size.label}</div>
                    <div className="text-xs text-muted-foreground">{formatCurrency(parseFloat(size.price))}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Button size="lg" className="flex-1 h-12" onClick={handleAddToCart}>
                Add to cart
              </Button>
              <div className="flex gap-2 sm:gap-3 justify-center sm:justify-start">
                <button
                  type="button"
                  className="inline-flex size-10 sm:size-11 items-center justify-center rounded-full border" 
                  aria-label="Add to wishlist"
                >
                  <Heart className="size-4 sm:size-5" />
                </button>
                <button
                  type="button"
                  className="inline-flex size-10 sm:size-11 items-center justify-center rounded-full border"
                  aria-label="Share scent"
                >
                  <Share2 className="size-4 sm:size-5" />
                </button>
              </div>
            </div>

            <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-3">
              {SERVICE_POINTS.map(({ icon: Icon, title, copy }) => (
                <Card key={title} className="border-dashed">
                  <CardContent className="space-y-2 p-3 md:p-4">
                    <Icon className="size-4 md:size-5 text-primary" />
                    <div className="text-xs md:text-sm font-semibold text-foreground">{title}</div>
                    <p className="text-xs leading-relaxed text-muted-foreground">{copy}</p>
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

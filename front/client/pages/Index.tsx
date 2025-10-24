import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProductCard, type Product } from "@/components/product/ProductCard";
import { formatCurrency } from "@/lib/utils";
import { ArrowUpRight, Droplet, Leaf, Palette, Sparkles } from "lucide-react";
import { useFeaturedProducts } from "@/hooks/useProducts";
import { useFeaturedCollections } from "@/hooks/useCollections";
import { useMemo } from "react";

const COLLECTION_CARDS_FALLBACK = [
  {
    title: "Atelier Collection",
    description: "Limited extrait editions handcrafted in micro batches.",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1400&auto=format&fit=crop",
    href: "/collection/atelier",
  },
  {
    title: "Botanical Library",
    description: "Crisp florals layered with rare citrus absolutes.",
    image:
      "https://images.unsplash.com/photo-1528150177500-4c6bb07b44f2?q=80&w=1400&auto=format&fit=crop",
    href: "/collection/botanical",
  },
  {
    title: "Velvet Evenings",
    description: "Smoky ambers and musks inspired by golden hour.",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1400&auto=format&fit=crop",
    href: "/collection/velvet-evenings",
  },
];

const RITUAL_STEPS = [
  {
    title: "Awaken",
    copy: "Begin with a dewy hydrosol to prime skin and lock in moisture.",
    icon: Droplet,
  },
  {
    title: "Layer",
    copy: "Add depth with our concentrated perfume oils at pulse points.",
    icon: Palette,
  },
  {
    title: "Embrace",
    copy: "Finish with a veil mist for an enduring, effortless trail.",
    icon: Leaf,
  },
];

const STATS = [
  { label: "Bespoke blends", value: "40+", icon: Sparkles },
  { label: "Sourcing partners", value: "18", icon: Leaf },
  { label: "Delivery window", value: "3-5 days", icon: ArrowUpRight },
];

export default function Index() {
  // Fetch featured products and collections from API
  const { data: featuredData, isLoading: loadingProducts } = useFeaturedProducts();
  const { data: collectionsData, isLoading: loadingCollections } = useFeaturedCollections();

  // Transform API data to match frontend types
  const featured: Product[] = useMemo(() => {
    if (!featuredData) return [];
    return featuredData.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: parseFloat(p.price),
      image: p.image,
      badge: p.badge || (p.is_bestseller ? "Bestseller" : undefined),
    }));
  }, [featuredData]);

  const collections = useMemo(() => {
    if (!collectionsData) return COLLECTION_CARDS_FALLBACK;
    return collectionsData.map((c: any) => ({
      title: c.title,
      description: c.description,
      image: c.image,
      href: c.href || `/collection/${c.slug}`,
    }));
  }, [collectionsData]);

  return (
    <main className="space-y-0 overflow-hidden">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-white to-white">
        <div className="absolute right-[-20%] sm:right-[-10%] top-[-30%] sm:top-[-20%] size-[300px] sm:size-[420px] rounded-full bg-primary/20 blur-3xl" />
        <div className="container relative grid gap-8 sm:gap-12 py-16 sm:py-20 md:grid-cols-[1.1fr_1fr] md:py-28">
          <div className="flex flex-col justify-center order-2 md:order-1">
            <span className="inline-flex w-fit items-center gap-1 sm:gap-2 rounded-full border border-primary/20 bg-white/80 px-3 sm:px-4 py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-primary">
              New season drop
            </span>
            <h1 className="mt-4 sm:mt-6 text-responsive-3xl sm:text-responsive-4xl font-semibold leading-tight tracking-tight text-foreground">
              Fragrance stories composed for the present moment
            </h1>
            <p className="mt-4 sm:mt-5 max-w-xl text-responsive-sm text-muted-foreground">
              Discover refined extrait de parfums built on rare botanicals and modern layering rituals. Crafted in small batches for slow, expressive living.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link to="/shop">Shop the collection</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full border-primary/30 sm:w-auto"
              >
                <Link to="/collections" className="inline-flex items-center justify-center gap-2">
                  Explore rituals <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-8 sm:mt-10 grid w-full max-w-xl grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3">
              {STATS.map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-xl sm:rounded-2xl border border-primary/10 bg-white/80 p-3 sm:p-4">
                  <Icon className="size-4 sm:size-5 text-primary" />
                  <div className="mt-2 sm:mt-3 text-base sm:text-lg font-semibold text-foreground">{value}</div>
                  <div className="text-[10px] sm:text-xs uppercase tracking-wide text-muted-foreground leading-tight">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative order-1 md:order-2">
            <div className="relative mx-auto max-w-sm sm:max-w-md overflow-hidden rounded-[24px] sm:rounded-[32px] bg-black/10 shadow-xl sm:shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1604937455095-ef2fe3d842b6?q=80&w=1400&auto=format&fit=crop"
                alt="Essentials fragrance duo"
                className="responsive-img object-cover brightness-[0.92] saturate-[0.85] aspect-[3/4]"
                loading="eager"
                sizes="(max-width: 768px) 90vw, 50vw"
              />
              <div className="absolute inset-x-4 sm:inset-x-6 bottom-4 sm:bottom-6 rounded-xl sm:rounded-2xl bg-white/90 p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] sm:text-xs uppercase tracking-wide text-muted-foreground">Featured blend</p>
                    <p className="text-xs sm:text-sm font-semibold text-foreground">Noir Bouquet extrait</p>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-primary">{formatCurrency(89)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12 sm:py-16 md:py-20">
        <div className="mb-8 sm:mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-responsive-2xl font-semibold tracking-tight">Signature collections</h2>
            <p className="mt-2 max-w-xl text-responsive-sm text-muted-foreground">
              Curated capsules inspired by painterly cities, botanical archives, and twilight rituals.
            </p>
          </div>
          <Button asChild variant="ghost" className="justify-start gap-2 text-sm font-medium text-primary md:justify-center self-start">
            <Link to="/collections">
              View all collections <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loadingCollections ? (
            <div className="col-span-full text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-sm text-muted-foreground">Loading collections...</p>
            </div>
          ) : (
            collections.map((card, index) => (
            <Link
              key={card.title}
              to={card.href}
              className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/30 bg-muted/40 shadow-sm transition-transform duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-xl"
              style={{ animation: `fadeSlideUp 0.7s ease forwards`, animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={card.image}
                alt={card.title}
                className="aspect-[4/5] sm:aspect-[4/5] w-full object-cover brightness-[0.9] saturate-[0.88] transition duration-700 group-hover:scale-105"
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 text-white">
                <h3 className="text-base sm:text-lg font-semibold">{card.title}</h3>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-white/80 line-clamp-2">{card.description}</p>
                <span className="mt-3 sm:mt-4 inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-white/80">
                  Discover <ArrowUpRight className="size-3" />
                </span>
              </div>
            </Link>
            ))
          )}
        </div>
      </section>

      <section className="border-t bg-secondary/40" style={{ animation: "fadeSlideUp 0.8s ease forwards", animationDelay: "0.05s" }}>
        <div className="container py-12 sm:py-16 md:py-20">
          <div className="mb-6 sm:mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-responsive-2xl font-semibold tracking-tight">Featured creations</h2>
              <p className="mt-2 max-w-lg text-responsive-sm text-muted-foreground">
                Hand-poured parfums with modern layering potential. Pair with oils for a bespoke finish.
              </p>
            </div>
            <Button asChild variant="outline" className="gap-2 self-start">
              <Link to="/shop">
                Browse all <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
            {loadingProducts ? (
              <div className="col-span-full text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                <p className="mt-4 text-sm text-muted-foreground">Loading products...</p>
              </div>
            ) : featured.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-sm text-muted-foreground">No featured products available</p>
              </div>
            ) : (
              featured.map((p, index) => (
                <div key={p.id} style={{ animation: `fadeSlideUp 0.7s ease forwards`, animationDelay: `${index * 0.07}s` }}>
                  <ProductCard product={p} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-20" style={{ animation: "fadeSlideUp 0.8s ease forwards" }}>
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Design a modern scent ritual</h2>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              Our founders blend ancestry with avant-garde perfumery to create rituals that evolve with you throughout the day.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {RITUAL_STEPS.map(({ title, copy, icon: Icon }, index) => (
                <div
                  key={title}
                  className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm"
                  style={{ animation: `fadeSlideUp 0.7s ease forwards`, animationDelay: `${index * 0.08}s` }}
                >
                  <Icon className="size-6 text-primary" />
                  <div className="mt-4 text-sm font-semibold text-foreground">{title}</div>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{copy}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-primary/10 via-white to-white p-8 shadow-xl" style={{ animation: "fadeSlideUp 0.7s ease forwards", animationDelay: "0.12s" }}>
            <p className="text-xs uppercase tracking-[0.3em] text-primary">The atelier note</p>
            <p className="mt-4 text-lg font-semibold text-foreground">
              “We begin with memory — a hallway of jasmine at dusk, sea spray on silk. Every accord is a conversation between places we’ve loved.”
            </p>
            <p className="mt-6 text-sm text-muted-foreground">— Amara Solace, Creative Director</p>
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-20">
        <div className="grid gap-8 overflow-hidden rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-white p-10 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div style={{ animation: "fadeSlideUp 0.7s ease forwards" }}>
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Scent club</p>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">Be first to new drops, sampling salons, and private events</h3>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              Join our inner circle for curated notes delivered monthly, plus exclusive access to pre-release blends and in-person ritual workshops.
            </p>
            <form
              className="mt-6 flex flex-wrap gap-3 rounded-full border border-primary/20 bg-white/70 p-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                required
                placeholder="Email address"
                className="flex-1 min-w-[200px] rounded-full bg-transparent px-4 py-2 text-sm outline-none"
              />
              <Button className="rounded-full px-6" size="lg">
                Sign me up
              </Button>
            </form>
          </div>
          <div className="rounded-3xl border border-white/50 bg-white/80 p-8 shadow-lg" style={{ animation: "fadeSlideUp 0.7s ease forwards", animationDelay: "0.12s" }}>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Member perks</p>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>Complimentary 3ml layering vial each season</li>
              <li>Priority atelier appointments & digital consults</li>
              <li>Early access to limited capsules and archive sales</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}

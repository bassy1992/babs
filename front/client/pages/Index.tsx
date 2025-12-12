import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProductCard, type Product } from "@/components/product/ProductCard";
import { HeroSlider } from "@/components/site/HeroSlider";
import { ArrowUpRight, Droplet, Leaf, Palette, Sparkles } from "lucide-react";
import { useFeaturedProducts } from "@/hooks/useProducts";
import { useFeaturedCollections } from "@/hooks/useCollections";
import { AnnouncementContainer } from "@/components/announcements";
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

export default function Index() {
  const { data: featuredData, isLoading: loadingProducts } = useFeaturedProducts();
  const { data: collectionsData, isLoading: loadingCollections } = useFeaturedCollections();

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
    <main className="overflow-hidden">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Homepage Announcements */}
      <AnnouncementContainer pageType="homepage" />

      {/* Stats Bar */}
      <section className="border-y bg-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            <div className="px-4 sm:px-6 py-6 sm:py-8 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">40+</div>
              <div className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground">Signature Blends</div>
            </div>
            <div className="px-4 sm:px-6 py-6 sm:py-8 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">100%</div>
              <div className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground">Natural</div>
            </div>
            <div className="px-4 sm:px-6 py-6 sm:py-8 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">3-5</div>
              <div className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground">Days Delivery</div>
            </div>
            <div className="px-4 sm:px-6 py-6 sm:py-8 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">18</div>
              <div className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground">Global Partners</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-4">
              Bestsellers
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Discover Your Signature Scent
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Hand-poured parfums crafted with rare botanicals and modern layering rituals
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 grid-cols-2 lg:grid-cols-4 mb-10">
            {loadingProducts ? (
              <div className="col-span-full text-center py-12">
                <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                <p className="mt-4 text-sm text-muted-foreground">Loading products...</p>
              </div>
            ) : featured.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-sm text-muted-foreground">No featured products available</p>
              </div>
            ) : (
              featured.map((p, index) => (
                <div 
                  key={p.id} 
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={p} />
                </div>
              ))
            )}
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link to="/shop" className="inline-flex items-center gap-2">
                Explore All Products <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-4">
              Collections
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Curated Fragrance Stories
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Inspired by painterly cities, botanical archives, and twilight rituals
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-3 mb-10">
            {loadingCollections ? (
              <div className="col-span-full text-center py-12">
                <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                <p className="mt-4 text-sm text-muted-foreground">Loading collections...</p>
              </div>
            ) : (
              collections.map((card, index) => (
                <Link
                  key={card.title}
                  to={card.href}
                  className="group relative overflow-hidden rounded-3xl bg-muted/40 shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover brightness-[0.85] transition duration-700 group-hover:scale-110 group-hover:brightness-[0.75]"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 text-white">
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">{card.title}</h3>
                    <p className="text-sm sm:text-base text-white/90 mb-4 line-clamp-2">{card.description}</p>
                    <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white group-hover:gap-3 transition-all">
                      Explore Collection <ArrowUpRight className="size-4" />
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="text-center">
            <Button asChild variant="outline" size="lg" className="rounded-full px-8">
              <Link to="/collections" className="inline-flex items-center gap-2">
                View All Collections <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Ritual Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-gray-50 via-white to-white">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=1400&auto=format&fit=crop"
                  alt="Fragrance ritual"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl max-w-xs hidden lg:block">
                <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">The Atelier Note</p>
                <p className="text-sm font-medium text-foreground leading-relaxed">
                  "Every accord is a conversation between places we've loved."
                </p>
                <p className="text-xs text-muted-foreground mt-3">— Amara Solace</p>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-4">
                The Ritual
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Design Your Modern Scent Ritual
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-10">
                Our founders blend ancestry with avant-garde perfumery to create rituals that evolve with you throughout the day.
              </p>

              <div className="space-y-6">
                {RITUAL_STEPS.map(({ title, copy, icon: Icon }) => (
                  <div
                    key={title}
                    className="flex gap-4 p-5 rounded-2xl bg-white border border-primary/10 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex-shrink-0">
                      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="size-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-gray-50 via-white to-white">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-4">
              Scent Club
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Join Our Inner Circle
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Be first to new drops, sampling salons, and private events. Get curated notes delivered monthly with exclusive access to pre-release blends.
            </p>

            <form
              className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3 mb-10"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                required
                placeholder="Enter your email address"
                className="flex-1 rounded-full border border-primary/20 bg-white px-6 py-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <Button size="lg" className="rounded-full px-8 whitespace-nowrap">
                Sign Me Up
              </Button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-primary/10">
                <Sparkles className="size-8 text-primary mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground">Complimentary 3ml vial each season</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-primary/10">
                <Palette className="size-8 text-primary mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground">Priority atelier appointments</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-primary/10">
                <Leaf className="size-8 text-primary mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground">Early access to limited drops</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

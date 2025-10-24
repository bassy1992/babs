import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Award, Heart, Leaf, Sparkles, Users } from "lucide-react";

const VALUES = [
  {
    icon: Leaf,
    title: "Sustainable Sourcing",
    description: "We partner with ethical growers across Madagascar, Grasse, and Morocco to source the finest natural ingredients while supporting local communities.",
  },
  {
    icon: Heart,
    title: "Artisan Craftsmanship",
    description: "Each fragrance is hand-poured in small batches by master perfumers, ensuring exceptional quality and attention to detail in every bottle.",
  },
  {
    icon: Sparkles,
    title: "Modern Rituals",
    description: "We blend traditional perfumery techniques with contemporary layering concepts, creating scents that evolve with you throughout the day.",
  },
  {
    icon: Award,
    title: "Quality Promise",
    description: "Our extraits contain 20-30% pure perfume oils, ensuring long-lasting sillage and depth that develops beautifully on your skin.",
  },
];

const MILESTONES = [
  { year: "2020", event: "Founded in Accra, Ghana" },
  { year: "2021", event: "Launched first collection: Atelier Series" },
  { year: "2022", event: "Expanded to 18 sourcing partners across 3 continents" },
  { year: "2023", event: "Opened flagship atelier in Osu" },
  { year: "2024", event: "Launched online platform and nationwide delivery" },
];

export default function About() {
  return (
    <main className="space-y-0 overflow-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-white to-white">
        <div className="absolute right-[-20%] sm:right-[-10%] top-[-30%] sm:top-[-20%] size-[300px] sm:size-[420px] rounded-full bg-primary/20 blur-3xl" />
        <div className="container relative py-20 sm:py-28 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Our Story
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight tracking-tight">
              Crafting fragrance stories for the modern soul
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              We believe fragrance is more than scent—it's memory, emotion, and identity captured in a bottle. 
              Each creation is a conversation between tradition and innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Our Mission
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              To democratize luxury fragrance in Africa by creating accessible, high-quality extraits that celebrate 
              both global perfumery traditions and local botanical heritage.
            </p>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              We're building a new fragrance culture—one that values slow living, mindful consumption, and the art 
              of layering scents to create something uniquely yours.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link to="/shop">Explore Our Collection</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/collections" className="inline-flex items-center gap-2">
                  View Collections <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=800&auto=format&fit=crop"
                alt="Perfume creation process"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="border-t bg-secondary/40">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              What We Stand For
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our values guide every decision, from ingredient selection to customer experience.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value, index) => (
              <div
                key={value.title}
                className="rounded-2xl border bg-white p-6 shadow-sm transition-transform hover:-translate-y-1"
                style={{ animation: `fadeSlideUp 0.7s ease forwards`, animationDelay: `${index * 0.1}s` }}
              >
                <value.icon className="size-8 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="border-t bg-secondary/40">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Our Journey
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From a small atelier to a growing fragrance house.
            </p>
          </div>
          <div className="mx-auto max-w-3xl">
            <div className="space-y-8">
              {MILESTONES.map((milestone, index) => (
                <div
                  key={milestone.year}
                  className="flex gap-6 items-start"
                  style={{ animation: `fadeSlideUp 0.7s ease forwards`, animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex-shrink-0 w-20 text-right">
                    <span className="text-2xl font-bold text-primary">{milestone.year}</span>
                  </div>
                  <div className="flex-shrink-0 mt-2">
                    <div className="size-3 rounded-full bg-primary"></div>
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-lg font-medium">{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container py-16 md:py-24">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">40+</div>
            <div className="mt-2 text-sm uppercase tracking-wide text-muted-foreground">
              Bespoke Blends
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">18</div>
            <div className="mt-2 text-sm uppercase tracking-wide text-muted-foreground">
              Sourcing Partners
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">5,000+</div>
            <div className="mt-2 text-sm uppercase tracking-wide text-muted-foreground">
              Happy Customers
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">100%</div>
            <div className="mt-2 text-sm uppercase tracking-wide text-muted-foreground">
              Cruelty-Free
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Users className="mx-auto size-12 text-primary" />
            <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
              Join Our Scent Community
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Be the first to discover new releases, exclusive events, and fragrance layering tips.
            </p>
            <form
              className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="flex-1 rounded-full border px-6 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Button type="submit" size="lg" className="rounded-full px-8">
                Subscribe
              </Button>
            </form>
            <p className="mt-4 text-xs text-muted-foreground">
              Join 2,000+ fragrance enthusiasts. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

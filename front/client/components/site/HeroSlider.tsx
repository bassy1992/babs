import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta: {
    primary: { text: string; link: string };
    secondary?: { text: string; link: string };
  };
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    title: "Fragrance Stories for the Present Moment",
    subtitle: "New Season Collection",
    description: "Discover refined extrait de parfums built on rare botanicals and modern layering rituals.",
    image: "https://images.unsplash.com/photo-1604937455095-ef2fe3d842b6?q=80&w=2000&auto=format&fit=crop",
    cta: {
      primary: { text: "Shop Now", link: "https://essentialsbybaabie.com/shop" },
      secondary: { text: "Explore Collections", link: "https://essentialsbybaabie.com/collections" },
    },
  },
  {
    id: 2,
    title: "Velvet Evenings Collection",
    subtitle: "Limited Edition",
    description: "Smoky ambers and musks inspired by golden hour. A sophisticated blend that evolves throughout the evening.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=2000&auto=format&fit=crop",
    cta: {
      primary: { text: "Discover Collection", link: "https://essentialsbybaabie.com/collection/velvet-evenings" },
      secondary: { text: "View All", link: "https://essentialsbybaabie.com/shop" },
    },
  },
  {
    id: 3,
    title: "Botanical Library",
    subtitle: "Spring Arrivals",
    description: "Crisp florals layered with rare citrus absolutes. Fresh, vibrant, and endlessly wearable.",
    image: "https://images.unsplash.com/photo-1528150177500-4c6bb07b44f2?q=80&w=2000&auto=format&fit=crop",
    cta: {
      primary: { text: "Shop Botanicals", link: "https://essentialsbybaabie.com/collection/botanical" },
      secondary: { text: "Learn More", link: "https://essentialsbybaabie.com/about" },
    },
  },
];

export function HeroSlider() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollTo = useCallback((index: number) => {
    api?.scrollTo(index);
  }, [api]);

  return (
    <section className="relative">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          loop: true,
          align: "start",
        }}
        plugins={[
          Autoplay({
            delay: 6000,
            stopOnInteraction: true,
          }),
        ]}
      >
        <CarouselContent className="-ml-0">
          {HERO_SLIDES.map((slide, index) => (
            <CarouselItem key={slide.id} className="pl-0">
              <div className="relative h-[600px] sm:h-[700px] lg:h-[800px] overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                  {/* Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="relative h-full container flex items-center">
                  <div className="max-w-2xl text-white">
                    <div 
                      className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 animate-fade-up"
                      style={{ animationDelay: "0.2s" }}
                    >
                      <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em]">
                        {slide.subtitle}
                      </span>
                    </div>

                    <h1 
                      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-up"
                      style={{ animationDelay: "0.3s" }}
                    >
                      {slide.title}
                    </h1>

                    <p 
                      className="text-base sm:text-lg md:text-xl text-white/90 mb-8 max-w-xl animate-fade-up"
                      style={{ animationDelay: "0.4s" }}
                    >
                      {slide.description}
                    </p>

                    <div 
                      className="flex flex-col sm:flex-row gap-4 animate-fade-up"
                      style={{ animationDelay: "0.5s" }}
                    >
                      <Button 
                        asChild 
                        size="lg" 
                        className="rounded-full px-8 text-base bg-white text-foreground hover:bg-white/90"
                      >
                        <Link to={slide.cta.primary.link} className="inline-flex items-center gap-2">
                          {slide.cta.primary.text}
                          <ArrowRight className="size-5" />
                        </Link>
                      </Button>
                      {slide.cta.secondary && (
                        <Button
                          asChild
                          variant="outline"
                          size="lg"
                          className="rounded-full px-8 text-base border-white/30 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 hover:text-white"
                        >
                          <Link to={slide.cta.secondary.link}>
                            {slide.cta.secondary.text}
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Slide Indicators - Bottom Center */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
                  {Array.from({ length: count }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => scrollTo(idx)}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        idx === current
                          ? "w-12 bg-white"
                          : "w-8 bg-white/40 hover:bg-white/60"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows */}
        <button
          onClick={() => api?.scrollPrev()}
          className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center size-12 lg:size-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all hover:scale-110"
          aria-label="Previous slide"
        >
          <ChevronLeft className="size-6 lg:size-7" />
        </button>
        <button
          onClick={() => api?.scrollNext()}
          className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center size-12 lg:size-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all hover:scale-110"
          aria-label="Next slide"
        >
          <ChevronRight className="size-6 lg:size-7" />
        </button>
      </Carousel>
    </section>
  );
}

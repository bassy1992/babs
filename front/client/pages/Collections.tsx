import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useCollections } from "@/hooks/useCollections";

export default function Collections() {
  const { data: collections, isLoading, error } = useCollections();

  if (isLoading) {
    return (
      <div className="container py-16">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading collections...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-16">
        <div className="text-center">
          <p className="text-sm text-destructive">Failed to load collections</p>
        </div>
      </div>
    );
  }

  return (
    <main className="container py-12 sm:py-16 md:py-20">
      <div className="mb-8 sm:mb-12">
        <h1 className="text-responsive-3xl font-semibold tracking-tight">
          Our Collections
        </h1>
        <p className="mt-3 max-w-2xl text-responsive-sm text-muted-foreground">
          Explore our curated fragrance collections, each telling a unique story through carefully crafted scents.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {collections?.map((collection: any, index: number) => (
          <Link
            key={collection.id}
            to={`/collection/${collection.slug}`}
            className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/30 bg-muted/40 shadow-sm transition-transform duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-xl"
            style={{ 
              animation: `fadeSlideUp 0.7s ease forwards`, 
              animationDelay: `${index * 0.1}s` 
            }}
          >
            <img
              src={collection.image}
              alt={collection.title}
              className="aspect-[4/5] w-full object-cover brightness-[0.9] saturate-[0.88] transition duration-700 group-hover:scale-105"
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 text-white">
              <h3 className="text-base sm:text-lg font-semibold">
                {collection.title}
              </h3>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-white/80 line-clamp-2">
                {collection.description}
              </p>
              {collection.product_count > 0 && (
                <p className="mt-2 text-xs text-white/60">
                  {collection.product_count} {collection.product_count === 1 ? 'product' : 'products'}
                </p>
              )}
              <span className="mt-3 sm:mt-4 inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-white/80">
                Discover <ArrowUpRight className="size-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {collections && collections.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">No collections available at the moment.</p>
        </div>
      )}
    </main>
  );
}

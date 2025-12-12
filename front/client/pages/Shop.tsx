import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ProductCard, type Product } from "@/components/product/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { AnnouncementContainer } from "@/components/announcements";

export default function Shop() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc">("featured");

  // Build query parameters for API
  const queryParams = useMemo(() => {
    const params: Record<string, string> = {};
    
    if (query.trim()) {
      params.search = query.trim();
    }
    
    if (sort === "price-asc") {
      params.ordering = "price";
    } else if (sort === "price-desc") {
      params.ordering = "-price";
    }
    
    return params;
  }, [query, sort]);

  // Fetch products from API
  const { data, isLoading, error } = useProducts(queryParams);

  // Transform API data to match frontend Product type
  const products: Product[] = useMemo(() => {
    if (!data?.results) return [];
    
    return data.results.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: parseFloat(p.price),
      image: p.image,
      badge: p.badge || (p.is_bestseller ? "Bestseller" : undefined),
    }));
  }, [data]);

  return (
    <main>
      {/* Shop Announcements */}
      <AnnouncementContainer pageType="shop" />
      
      <section className="container py-8 sm:py-12 animate-fade-up">
        <div className="mb-6 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between animate-fade-up animate-delay-1">
          <div>
            <h1 className="text-responsive-2xl font-bold">Shop</h1>
            <p className="mt-1 text-responsive-sm text-muted-foreground">Browse all products</p>
          </div>

          <div className="flex w-full max-w-md items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
            <Button variant="outline" onClick={() => setQuery("")} size="sm">
              Clear
            </Button>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-up animate-delay-2">
          <div className="text-responsive-sm text-muted-foreground">
            {isLoading ? "Loading..." : error ? "Error loading products" : `${products.length} products`}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-responsive-sm text-muted-foreground">Sort</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="rounded-md border bg-background px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              disabled={isLoading}
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to high</option>
              <option value="price-desc">Price: High to low</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-sm text-muted-foreground">Loading products...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-lg font-semibold text-destructive">Failed to load products</p>
              <p className="mt-2 text-sm text-muted-foreground">Please make sure the backend is running</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-lg font-semibold">No products found</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {query ? `Try a different search term` : `No products available`}
              </p>
              {query && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setQuery("")}
                >
                  Clear search
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p, index) => {
              const delayClass = index > 4 ? "animate-delay-5" : `animate-delay-${index + 1}`;
              return (
                <div key={p.id} className={`animate-fade-up ${delayClass}`}>
                  <ProductCard product={p} />
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

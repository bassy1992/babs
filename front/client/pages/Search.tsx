import { useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ProductCard, type Product } from "@/components/product/ProductCard";
import { useSearchProducts } from "@/hooks/useProducts";
import { Loader2, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data: searchResults, isLoading } = useSearchProducts(query);

  // Transform API products to frontend format
  const products: Product[] = useMemo(() => {
    if (!searchResults) return [];
    return searchResults.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: parseFloat(p.price),
      image: p.image,
      badge: p.badge || (p.is_bestseller ? "Bestseller" : undefined),
    }));
  }, [searchResults]);

  return (
    <section className="container py-8 md:py-12">
      <div className="mb-8 animate-fade-up">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
          Search Results
        </h1>
        {query && (
          <p className="mt-2 text-base md:text-lg text-muted-foreground">
            Showing results for <span className="font-medium text-foreground">"{query}"</span>
          </p>
        )}
        {!isLoading && (
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? 'result' : 'results'} found
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Searching...</p>
        </div>
      ) : products.length > 0 ? (
        <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-fade-up animate-delay-1">
          {products.map((product, index) => (
            <div 
              key={product.id}
              style={{ 
                animation: `fadeSlideUp 0.7s ease forwards`, 
                animationDelay: `${index * 0.08}s` 
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-up animate-delay-1">
          <div className="rounded-full bg-muted p-6 mb-4">
            <SearchIcon className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No Results Found</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            {query 
              ? `We couldn't find any products matching "${query}". Try different keywords or browse our collections.`
              : "Enter a search term to find products."
            }
          </p>
          <div className="flex gap-3">
            <Button asChild>
              <Link to="/shop">Browse All Products</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/collections">View Collections</Link>
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

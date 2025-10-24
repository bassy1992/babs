import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ProductCard, type Product } from "@/components/product/ProductCard";
import { useCollection } from "@/hooks/useCollections";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Collection() {
  const { slug } = useParams();
  const { data: collection, isLoading, error } = useCollection(slug);

  // Transform API products to frontend format
  const products: Product[] = useMemo(() => {
    if (!collection?.products) return [];
    return collection.products.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: parseFloat(p.price),
      image: p.image,
      badge: p.badge || (p.is_bestseller ? "Bestseller" : undefined),
    }));
  }, [collection]);

  if (isLoading) {
    return (
      <main className="container py-20">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading collection...</p>
        </div>
      </main>
    );
  }

  if (error || !collection) {
    return (
      <main className="container py-20">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-bold mb-2">Collection Not Found</h1>
          <p className="text-muted-foreground mb-6">
            Sorry, we couldn't find the collection you're looking for.
          </p>
          <div className="flex gap-3">
            <Button asChild>
              <Link to="/collections">View All Collections</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/shop">Browse Products</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <section className="container py-8 md:py-12 animate-fade-up">
      {/* Breadcrumb */}
      <div className="mb-6 md:mb-8">
        <Button variant="ghost" size="sm" asChild className="gap-2 -ml-2">
          <Link to="/collections">
            <ArrowLeft className="h-4 w-4" />
            Back to Collections
          </Link>
        </Button>
      </div>

      {/* Collection Header */}
      <div className="mb-8 md:mb-12 animate-fade-up animate-delay-1">
        <div className="grid gap-6 md:gap-8 lg:grid-cols-[1fr_400px]">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              {collection.title}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
              {collection.description}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              {products.length} {products.length === 1 ? 'product' : 'products'}
            </p>
          </div>
          
          {collection.image && (
            <div className="relative aspect-square lg:aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden shadow-xl">
              <img
                src={collection.image}
                alt={collection.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="animate-fade-up animate-delay-2">
          <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        </div>
      ) : (
        <div className="text-center py-12 animate-fade-up animate-delay-2">
          <p className="text-muted-foreground mb-6">
            No products available in this collection yet.
          </p>
          <Button asChild>
            <Link to="/shop">Browse All Products</Link>
          </Button>
        </div>
      )}
    </section>
  );
}

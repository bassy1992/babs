import { useSearchParams } from "react-router-dom";
import { ProductCard, type Product } from "@/components/product/ProductCard";

export default function Search() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";

  const results: Product[] = new Array(6).fill(0).map((_, i) => ({
    id: `s-${i}`,
    name: `${q || "Fragrance"} result ${i + 1}`,
    price: 49 + i * 10,
    image: `https://images.unsplash.com/photo-1520975922284-6c7d53a481d0?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=${i}`,
  }));

  return (
    <section className="container py-12">
      <h1 className="text-2xl font-bold">Search results{q ? ` for "${q}"` : ""}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{results.length} results</p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

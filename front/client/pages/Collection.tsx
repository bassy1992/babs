import { useParams } from "react-router-dom";
import { ProductCard, type Product } from "@/components/product/ProductCard";

const SAMPLE_PRODUCTS: Product[] = new Array(8).fill(0).map((_, i) => ({
  id: `p-${i}`,
  name: `Fragrance ${i + 1}`,
  price: 59 + i * 8,
  image: `https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=${i}`,
}));

export default function Collection() {
  const { slug } = useParams();

  return (
    <section className="container py-12 animate-fade-up">
      <div className="mb-6 flex items-center justify-between animate-fade-up animate-delay-1">
        <div>
          <h1 className="text-3xl font-bold">{slug ? slug.replace(/-/g, " ") : "Collection"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Explore curated scents in this collection.</p>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <select className="rounded-md border bg-background px-3 py-2 text-sm">
            <option>Sort: Popular</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
          <button className="rounded-md border px-3 py-2 text-sm">Filters</button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4 animate-fade-up animate-delay-2">
        <aside className="hidden md:block animate-fade-up animate-delay-2">
          <div className="space-y-4 rounded-md border bg-secondary p-4">
            <h4 className="font-semibold">Filters</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" />
                <span>Free shipping</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" />
                <span>New arrivals</span>
              </label>
            </div>
          </div>
        </aside>

        <div className="md:col-span-3 animate-fade-up animate-delay-3">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SAMPLE_PRODUCTS.map((p, index) => {
              const delayClass = index > 4 ? "animate-delay-5" : `animate-delay-${index + 1}`;
              return (
                <div key={p.id} className={`animate-fade-up ${delayClass}`}>
                  <ProductCard product={p} />
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-center animate-fade-up animate-delay-4">
            <button className="rounded-md border px-4 py-2">Load more</button>
          </div>
        </div>
      </div>
    </section>
  );
}

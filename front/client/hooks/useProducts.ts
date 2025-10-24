import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useProducts(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => api.products.list(params),
  });
}

export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.products.get(slug!),
    enabled: !!slug,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => api.products.featured(),
  });
}

export function useRelatedProducts(slug: string | undefined) {
  return useQuery({
    queryKey: ['products', 'related', slug],
    queryFn: () => api.products.related(slug!),
    enabled: !!slug,
  });
}

export function useSearchProducts(query: string) {
  return useQuery({
    queryKey: ['products', 'search', query],
    queryFn: () => api.products.search(query),
    enabled: query.length > 0,
  });
}

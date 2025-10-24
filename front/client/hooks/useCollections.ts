import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useCollections() {
  return useQuery({
    queryKey: ['collections'],
    queryFn: () => api.collections.list(),
  });
}

export function useCollection(slug: string | undefined) {
  return useQuery({
    queryKey: ['collection', slug],
    queryFn: () => api.collections.get(slug!),
    enabled: !!slug,
  });
}

export function useFeaturedCollections() {
  return useQuery({
    queryKey: ['collections', 'featured'],
    queryFn: () => api.collections.featured(),
  });
}

/**
 * API client for Django backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://babs-production.up.railway.app/api';

export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  price: string;
  image: string;
  badge?: string;
  is_bestseller?: boolean;
}

export interface ApiProductDetail extends ApiProduct {
  description: string;
  story: string;
  rating: {
    average: number;
    count: number;
  };
  gallery: string[];
  sizes: Array<{
    id: number;
    label: string;
    volume: string;
    price: string;
    sku: string;
    stock: number;
    is_available: boolean;
  }>;
  accords: {
    top: string[];
    heart: string[];
    base: string[];
  };
  highlights: Array<{
    id: number;
    title: string;
    description: string;
    order: number;
  }>;
  ritual: string[];
  ingredients: string[];
}

export interface ApiCollection {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string;
  href: string;
  product_count: number;
  is_featured: boolean;
}

export interface ApiCollectionDetail extends ApiCollection {
  products: ApiProduct[];
}

export const api = {
  // Products
  products: {
    list: async (params?: Record<string, string>) => {
      const url = new URL(`${API_BASE_URL}/products/`);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
      }
      const response = await fetch(url.toString());
      return response.json();
    },

    get: async (slug: string): Promise<ApiProductDetail> => {
      const response = await fetch(`${API_BASE_URL}/products/${slug}/`);
      if (!response.ok) throw new Error('Product not found');
      return response.json();
    },

    featured: async (): Promise<ApiProduct[]> => {
      const response = await fetch(`${API_BASE_URL}/products/featured/`);
      return response.json();
    },

    bestsellers: async (): Promise<ApiProduct[]> => {
      const response = await fetch(`${API_BASE_URL}/products/bestsellers/`);
      return response.json();
    },

    search: async (query: string): Promise<ApiProduct[]> => {
      const response = await fetch(`${API_BASE_URL}/products/search/?q=${encodeURIComponent(query)}`);
      return response.json();
    },

    related: async (slug: string): Promise<ApiProduct[]> => {
      const response = await fetch(`${API_BASE_URL}/products/${slug}/related/`);
      return response.json();
    },
  },

  // Collections
  collections: {
    list: async () => {
      const response = await fetch(`${API_BASE_URL}/collections/`);
      const data = await response.json();
      return data.results || data;
    },

    get: async (slug: string): Promise<ApiCollectionDetail> => {
      const response = await fetch(`${API_BASE_URL}/collections/${slug}/`);
      if (!response.ok) throw new Error('Collection not found');
      return response.json();
    },

    featured: async (): Promise<ApiCollection[]> => {
      const response = await fetch(`${API_BASE_URL}/collections/featured/`);
      const data = await response.json();
      return data.results || data;
    },
  },

  // Cart
  cart: {
    get: async (sessionKey: string) => {
      const response = await fetch(`${API_BASE_URL}/orders/cart/${sessionKey}/`);
      return response.json();
    },

    addItem: async (sessionKey: string, item: {
      product_id: string;
      variant_id?: number;
      quantity: number;
    }) => {
      const response = await fetch(`${API_BASE_URL}/orders/cart/${sessionKey}/add_item/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      return response.json();
    },

    updateItem: async (sessionKey: string, itemId: number, quantity: number) => {
      const response = await fetch(`${API_BASE_URL}/orders/cart/${sessionKey}/update_item/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id: itemId, quantity }),
      });
      return response.json();
    },

    removeItem: async (sessionKey: string, itemId: number) => {
      const response = await fetch(`${API_BASE_URL}/orders/cart/${sessionKey}/remove_item/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id: itemId }),
      });
      return response.json();
    },

    clear: async (sessionKey: string) => {
      const response = await fetch(`${API_BASE_URL}/orders/cart/${sessionKey}/clear/`, {
        method: 'POST',
      });
      return response.json();
    },
  },

  // Orders
  orders: {
    create: async (orderData: any) => {
      const response = await fetch(`${API_BASE_URL}/orders/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create order');
      }
      return response.json();
    },

    get: async (orderId: string) => {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/`);
      if (!response.ok) throw new Error('Order not found');
      return response.json();
    },

    initializePayment: async (orderId: string, callbackUrl?: string) => {
      const response = await fetch(`${API_BASE_URL}/orders/initialize_payment/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, callback_url: callbackUrl }),
      });
      if (!response.ok) {
        const error = await response.json();
        console.error('Payment initialization error:', error);
        throw new Error(error.message || error.error || 'Failed to initialize payment');
      }
      return response.json();
    },

    verifyPayment: async (reference: string) => {
      const response = await fetch(`${API_BASE_URL}/orders/verify_payment/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to verify payment');
      }
      return response.json();
    },

    getPaystackConfig: async () => {
      const response = await fetch(`${API_BASE_URL}/orders/paystack_config/`);
      return response.json();
    },
  },

  // Promo Codes
  promo: {
    validate: async (code: string, subtotal: number) => {
      const response = await fetch(`${API_BASE_URL}/orders/promo/${code}/validate/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subtotal }),
      });
      return response.json();
    },
  },
};

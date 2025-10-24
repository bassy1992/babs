import React from "react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { getSessionKey } from "@/lib/session";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
  cartItemId?: number; // Backend cart item ID
  productId?: string;
  variantId?: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  subtotal: number;
  totalItems: number;
  isLoading: boolean;
};

const CartContext = React.createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const sessionKey = getSessionKey();

  // Load cart from backend on mount
  React.useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setIsLoading(true);
      const cartData = await api.cart.get(sessionKey);
      
      // Transform backend cart items to frontend format
      const transformedItems: CartItem[] = (cartData.items || []).map((item: any) => ({
        id: `${item.product.id}-${item.variant || 'default'}`,
        name: item.product.name,
        price: parseFloat(item.price),
        qty: item.quantity,
        image: item.product.image,
        cartItemId: item.id,
        productId: item.product.id,
        variantId: item.variant,
      }));
      
      setItems(transformedItems);
    } catch (error) {
      console.error('Failed to load cart:', error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (item: Omit<CartItem, "qty">, qty = 1) => {
    try {
      await api.cart.addItem(sessionKey, {
        product_id: item.productId || item.id,
        variant_id: item.variantId,
        quantity: qty,
      });
      
      // Reload cart to get updated data
      await loadCart();
      
      toast({ title: "Added to cart", description: item.name });
    } catch (error) {
      console.error('Failed to add item:', error);
      toast({ 
        title: "Error", 
        description: "Failed to add item to cart",
        variant: "destructive" 
      });
    }
  };

  const removeItem = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item?.cartItemId) return;
    
    try {
      await api.cart.removeItem(sessionKey, item.cartItemId);
      await loadCart();
    } catch (error) {
      console.error('Failed to remove item:', error);
      toast({ 
        title: "Error", 
        description: "Failed to remove item",
        variant: "destructive" 
      });
    }
  };

  const updateQty = async (id: string, qty: number) => {
    const item = items.find((i) => i.id === id);
    if (!item?.cartItemId) return;
    
    try {
      await api.cart.updateItem(sessionKey, item.cartItemId, qty);
      await loadCart();
    } catch (error) {
      console.error('Failed to update quantity:', error);
      toast({ 
        title: "Error", 
        description: "Failed to update quantity",
        variant: "destructive" 
      });
    }
  };

  const clear = async () => {
    try {
      await api.cart.clear(sessionKey);
      setItems([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const totalItems = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clear, subtotal, totalItems, isLoading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) {
    // provide a safe fallback to avoid runtime crashes if provider is missing
    return {
      items: [],
      addItem: () => Promise.resolve(),
      removeItem: () => Promise.resolve(),
      updateQty: () => Promise.resolve(),
      clear: () => Promise.resolve(),
      subtotal: 0,
      totalItems: 0,
      isLoading: false,
    } as CartContextValue;
  }
  return ctx;
}

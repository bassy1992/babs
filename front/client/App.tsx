import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import { CartProvider } from "@/context/CartContext";
import NotFound from "./pages/NotFound";
import Layout from "./components/site/Layout";
import Placeholder from "./pages/Placeholder";
import About from "./pages/About";

import Collection from "./pages/Collection";
import Product from "./pages/Product";
import Search from "./pages/Search";
import Cart from "./pages/Cart";
import Checkout from "./pages/checkout/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import ResponsiveDemo from "./pages/ResponsiveDemo";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/collections" element={<Placeholder title="Collections" />} />
            <Route path="/about" element={<About />} />

            {/* Category / Collection */}
            <Route path="/collection/:slug" element={<Collection />} />
            <Route path="/category/:slug" element={<Collection />} />

            {/* Product detail */}
            <Route path="/product/:slug" element={<Product />} />

            {/* Search */}
            <Route path="/search" element={<Search />} />

            {/* Cart & Checkout */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout/*" element={<Checkout />} />

            {/* Order confirmation */}
            <Route path="/order/:orderId/confirmation" element={<OrderConfirmation />} />
            
            {/* Responsive Demo */}
            <Route path="/responsive-demo" element={<ResponsiveDemo />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

const container = document.getElementById("root")! as any;
// React internals or other tooling might attach different keys — check several to avoid double createRoot warnings
const existingRoot = container.__REACT_ROOT__ || container.__reactRoot || container._reactRootContainer || (window as any).__REACT_ROOT__;
let root = existingRoot;
if (!root) {
  root = createRoot(container);
  container.__REACT_ROOT__ = root;
  container.__reactRoot = root;
  (window as any).__REACT_ROOT__ = root;
}
root.render(<App />);

// Hot Module Replacement: keep root alive and avoid remounts
if (import.meta.hot) {
  import.meta.hot.accept();
  import.meta.hot.dispose(() => {
    // do not unmount on dispose to preserve root between updates
  });
}

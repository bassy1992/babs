import { useState, useEffect } from "react";
import * as Router from "react-router-dom";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Search } from "lucide-react";

const logoUrl =
  "https://cdn.builder.io/api/v1/image/assets%2F261a98e6df434ad1ad15c1896e5c6aa3%2F221f1b7f10774a3d9288702a5384a36e?format=webp&width=800";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { totalItems } = useCart();
  const isMobile = useIsMobile();
  const navigate = Router.useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when switching to desktop
  useEffect(() => {
    if (!isMobile && open) {
      setOpen(false);
    }
  }, [isMobile, open]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setOpen(false);
    }
  };

  return (
    <header className={`sticky top-0 z-40 w-full border-b transition-all duration-300 ${
      scrolled 
        ? "bg-white/95 backdrop-blur-md shadow-sm supports-[backdrop-filter]:bg-white/80" 
        : "bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60"
    }`}>
      <div className="container flex h-14 sm:h-16 items-center justify-between animate-fade-up animate-delay-1">
        <Router.Link to="/" className="flex items-center gap-2 sm:gap-3">
          <img
            src={logoUrl}
            alt="Essentials by Baabie logo"
            className="h-8 sm:h-10 w-auto object-contain transition-all duration-300"
          />
        </Router.Link>

        <nav className="hidden gap-4 lg:gap-6 md:flex">
          {[
            { to: "/", label: "Home" },
            { to: "/shop", label: "Shop" },
            { to: "/collections", label: "Collections" },
            { to: "/about", label: "About" },
          ].map((item, index) => {
            const delayClass = index > 3 ? "animate-delay-4" : `animate-delay-${index + 1}`;
            return (
              <Router.NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `animate-fade-up ${delayClass} text-sm lg:text-base font-medium transition-colors hover:text-primary relative ${
                    isActive ? "text-primary" : "text-foreground/80"
                  }`
                }
              >
                {item.label}
              </Router.NavLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center animate-fade-up animate-delay-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-64 rounded-full border border-input bg-background pl-9 pr-4 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </form>

          <Router.Link to="/cart" className="hidden sm:inline-flex">
            <button aria-label="Cart" className="relative inline-flex items-center gap-2 rounded-md px-2 sm:px-3 py-2 hover:bg-secondary/50 transition-colors animate-fade-up animate-delay-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-foreground/90">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="sr-only">View cart</span>
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-xs font-medium text-primary-foreground min-w-[1.25rem] h-5">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>
          </Router.Link>

          <Button className="hidden lg:inline-flex animate-fade-up animate-delay-4" size="sm">
            Shop now
          </Button>

          {/* Mobile menu button */}
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((s) => !s)}
            className="inline-flex items-center justify-center rounded-md p-2 md:hidden animate-fade-up animate-delay-5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 text-foreground/80"
            >
              {open ? (
                <path
                  fillRule="evenodd"
                  d="M6.28 5.22a.75.75 0 011.06 0L12 9.88l4.66-4.66a.75.75 0 111.06 1.06L13.06 10.94l4.66 4.66a.75.75 0 11-1.06 1.06L12 12l-4.66 4.66a.75.75 0 11-1.06-1.06L10.94 10.94 6.28 6.28a.75.75 0 010-1.06z"
                />
              ) : (
                <path d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        } border-t bg-white/95 backdrop-blur-sm`}
      >
        <div className={`space-y-1 px-4 py-4 ${open ? "animate-fade-up" : ""}`}>
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className={`mb-3 ${open ? "animate-fade-up" : ""}`}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-input bg-background pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </form>

          {[
            { to: "/", label: "Home" },
            { to: "/shop", label: "Shop" },
            { to: "/collections", label: "Collections" },
            { to: "/about", label: "About" },
          ].map((item, index) => (
            <Router.NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => 
                `block rounded-lg px-3 py-3 text-base font-medium transition-colors ${
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-foreground/90 hover:bg-secondary/80"
                } ${open ? `animate-fade-up ${index > 3 ? "animate-delay-5" : `animate-delay-${index + 2}`}` : ""}`
              }
            >
              {item.label}
            </Router.NavLink>
          ))}

          <div className={`flex gap-2 pt-2 ${open ? "animate-fade-up animate-delay-4" : ""}`}>
            <Router.Link to="/cart" onClick={() => setOpen(false)} className="flex-1">
              <button className="w-full rounded-lg border border-primary/20 px-3 py-3 text-sm font-medium hover:bg-secondary/50 transition-colors relative">
                Cart
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-xs font-medium text-primary-foreground min-w-[1.25rem] h-5">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </button>
            </Router.Link>
            <Router.Link to="/shop" onClick={() => setOpen(false)} className="flex-1">
              <button className="w-full rounded-lg bg-primary px-3 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                Shop
              </button>
            </Router.Link>
          </div>
        </div>
      </div>
    </header>
  );
}

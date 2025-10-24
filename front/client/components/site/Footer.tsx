import { Link } from "react-router-dom";
import { Mail, Instagram, Facebook, MessageCircle } from "lucide-react";

// TikTok icon component (lucide doesn't have TikTok, so we'll use a custom SVG)
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const logoUrl =
  "https://cdn.builder.io/api/v1/image/assets%2F261a98e6df434ad1ad15c1896e5c6aa3%2F221f1b7f10774a3d9288702a5384a36e?format=webp&width=800";

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container py-8 sm:py-10 animate-fade-up">
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div className="space-y-3 sm:space-y-4 animate-fade-up animate-delay-1 sm:col-span-2 lg:col-span-1">
            <img src={logoUrl} alt="Brand logo" className="h-8 sm:h-10 w-auto" />
            <p className="max-w-sm text-responsive-sm text-muted-foreground">
              Elevated scents and rituals crafted in small batches for moments of quiet luxury.
            </p>
            <div className="flex items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
              <span className="inline-flex size-7 sm:size-8 items-center justify-center rounded-full border text-[10px] sm:text-xs">NYC</span>
              <div>
                <div className="font-medium text-foreground text-xs sm:text-sm">654 Bloom Street</div>
                <div className="text-xs sm:text-sm">New York, NY 10012</div>
              </div>
            </div>
          </div>

          <div className="space-y-3 animate-fade-up animate-delay-2">
            <h4 className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-muted-foreground">Shop</h4>
            <ul className="space-y-2 text-responsive-sm text-foreground/80">
              <li>
                <Link to="/shop" className="transition-colors hover:text-primary active:text-primary">
                  All products
                </Link>
              </li>
              <li>
                <Link to="/collections" className="transition-colors hover:text-primary active:text-primary">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition-colors hover:text-primary active:text-primary">
                  About us
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3 animate-fade-up animate-delay-3">
            <h4 className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-muted-foreground">Support</h4>
            <ul className="space-y-2 text-responsive-sm text-foreground/80">
              <li>
                <Link to="#" className="transition-colors hover:text-primary active:text-primary">
                  Shipping & returns
                </Link>
              </li>
              <li>
                <Link to="#" className="transition-colors hover:text-primary active:text-primary">
                  Gift cards
                </Link>
              </li>
              <li>
                <Link to="#" className="transition-colors hover:text-primary active:text-primary">
                  Concierge
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3 sm:space-y-4 animate-fade-up animate-delay-4 sm:col-span-2 lg:col-span-1">
            <h4 className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-muted-foreground">Stay in touch</h4>
            <p className="text-responsive-sm text-muted-foreground">
              Subscribe for early access to limited releases and private events.
            </p>
            <form
              className="flex items-center gap-2 rounded-full border bg-background px-3 py-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <Mail className="size-3 sm:size-4 text-muted-foreground flex-shrink-0" />
              <input
                type="email"
                required
                placeholder="Your email"
                className="w-full bg-transparent text-xs sm:text-sm outline-none min-w-0"
              />
              <button
                type="submit"
                className="rounded-full bg-primary px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all flex-shrink-0"
              >
                Join
              </button>
            </form>
            <div className="flex gap-2 sm:gap-3 text-muted-foreground">
              <a 
                href="https://www.instagram.com/barbies_essentials/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram" 
                className="inline-flex size-8 sm:size-9 items-center justify-center rounded-full border transition-colors hover:border-primary hover:text-primary active:scale-95"
              >
                <Instagram className="size-3 sm:size-4" />
              </a>
              <a 
                href="https://www.facebook.com/Barbies%20Essentials" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook" 
                className="inline-flex size-8 sm:size-9 items-center justify-center rounded-full border transition-colors hover:border-primary hover:text-primary active:scale-95"
              >
                <Facebook className="size-3 sm:size-4" />
              </a>
              <a 
                href="https://www.tiktok.com/@mizz_mirielle" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="TikTok" 
                className="inline-flex size-8 sm:size-9 items-center justify-center rounded-full border transition-colors hover:border-primary hover:text-primary active:scale-95"
              >
                <TikTokIcon className="size-3 sm:size-4" />
              </a>
              <a 
                href="https://api.whatsapp.com/send/?phone=233547936812&text&type=phone_number&app_absent=0" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="WhatsApp" 
                className="inline-flex size-8 sm:size-9 items-center justify-center rounded-full border transition-colors hover:border-primary hover:text-primary active:scale-95"
              >
                <MessageCircle className="size-3 sm:size-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t py-3 sm:py-4">
        <div className="container flex flex-col items-center justify-between gap-2 sm:gap-3 text-[10px] sm:text-xs text-muted-foreground md:flex-row animate-fade-up animate-delay-2">
          <div>© {new Date().getFullYear()} Essentials by Baabie. All rights reserved.</div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <Link to="#" className="transition-colors hover:text-primary active:text-primary">Privacy</Link>
            <span className="text-foreground/40">•</span>
            <Link to="#" className="transition-colors hover:text-primary active:text-primary">Terms</Link>
            <span className="text-foreground/40">•</span>
            <Link to="#" className="transition-colors hover:text-primary active:text-primary">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

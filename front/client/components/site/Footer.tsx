import { Link } from "react-router-dom";
import { Mail, Instagram, Facebook, MessageCircle } from "lucide-react";

const logoUrl =
  "https://cdn.builder.io/api/v1/image/assets%2F261a98e6df434ad1ad15c1896e5c6aa3%2F221f1b7f10774a3d9288702a5384a36e?format=webp&width=800";

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container py-6 md:py-8">
        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <img src={logoUrl} alt="Essentials by Baabie" className="h-7 md:h-8 w-auto" />
            <p className="text-xs md:text-sm text-muted-foreground max-w-xs">
              Elevated scents crafted in small batches.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Shop</h4>
            <ul className="space-y-1.5 text-xs md:text-sm text-muted-foreground">
              <li><Link to="/shop" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link to="/collections" className="hover:text-primary transition-colors">Collections</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Support</h4>
            <ul className="space-y-1.5 text-xs md:text-sm text-muted-foreground">
              <li><Link to="#" className="hover:text-primary transition-colors">Shipping</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Returns</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Connect</h4>
            <div className="flex gap-2">
              <a 
                href="https://www.instagram.com/barbies_essentials/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram - barbies_essentials" 
                className="inline-flex size-8 items-center justify-center rounded-full border hover:border-primary hover:text-primary transition-all"
              >
                <Instagram className="size-3.5" />
              </a>
              <a 
                href="https://www.facebook.com/profile.php?id=61570171749175" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook - Barbies Essentials" 
                className="inline-flex size-8 items-center justify-center rounded-full border hover:border-primary hover:text-primary transition-all"
              >
                <Facebook className="size-3.5" />
              </a>
              <a 
                href="https://api.whatsapp.com/send/?phone=233547936812&text&type=phone_number&app_absent=0" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="WhatsApp - +233 54 793 6812" 
                className="inline-flex size-8 items-center justify-center rounded-full border hover:border-primary hover:text-primary transition-all"
              >
                <MessageCircle className="size-3.5" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground">Tema, Ghana</p>
          </div>
        </div>
      </div>
      
      {/* Bottom bar */}
      <div className="border-t py-3">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Essentials by Baabie</div>
          <div className="flex items-center gap-3">
            <Link to="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-primary transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

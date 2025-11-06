import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Shipping() {
  const navigate = useNavigate();
  
  // Load saved data if exists
  const savedData = JSON.parse(sessionStorage.getItem('shipping_info') || '{}');
  
  const [formData, setFormData] = useState({
    full_name: savedData.full_name || '',
    email: savedData.email || '',
    address: savedData.address || '',
    city: savedData.city || '',
    postal_code: savedData.postal_code || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save to sessionStorage
    sessionStorage.setItem('shipping_info', JSON.stringify(formData));
    navigate("/checkout/payment");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="animate-fade-up">
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold">Shipping Information</h2>
        <p className="text-sm text-muted-foreground mt-1">Where should we deliver your order?</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Full Name *</label>
            <input 
              required 
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="John Doe" 
              className="w-full rounded-lg border-2 px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Email Address *</label>
            <input 
              required 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com" 
              className="w-full rounded-lg border-2 px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
            />
            <p className="text-xs text-muted-foreground mt-1.5">Order confirmation will be sent here</p>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Street Address *</label>
            <input 
              required 
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main Street, Apt 4B" 
              className="w-full rounded-lg border-2 px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">City *</label>
              <input 
                required 
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Accra" 
                className="w-full rounded-lg border-2 px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Postal Code</label>
              <input 
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                placeholder="00233" 
                className="w-full rounded-lg border-2 px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
              />
            </div>
          </div>
        </div>
        
        {/* Mobile buttons */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 space-y-2">
          <Button type="submit" size="lg" className="w-full h-12 font-semibold">
            Continue to Payment
          </Button>
          <Button type="button" variant="ghost" size="lg" className="w-full" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>

        {/* Desktop buttons */}
        <div className="hidden md:flex items-center gap-3 pt-4">
          <Button type="submit" size="lg" className="flex-1 h-12 font-semibold">
            Continue to Payment
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </form>
      
      {/* Spacer for mobile fixed buttons */}
      <div className="md:hidden h-32" />
    </div>
  );
}

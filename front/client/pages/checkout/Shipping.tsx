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
    <div className="max-w-2xl">
      <h2 className="text-lg font-semibold">Shipping address</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name *</label>
          <input 
            required 
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="John Doe" 
            className="w-full rounded-md border px-3 py-2" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input 
            required 
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com" 
            className="w-full rounded-md border px-3 py-2" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Address *</label>
          <input 
            required 
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Main Street" 
            className="w-full rounded-md border px-3 py-2" 
          />
        </div>
        
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">City *</label>
            <input 
              required 
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Accra" 
              className="w-full rounded-md border px-3 py-2" 
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Postal Code</label>
            <input 
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              placeholder="00233" 
              className="w-full rounded-md border px-3 py-2" 
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4">
          <Button type="submit" size="lg">Continue to Payment</Button>
          <Button type="button" variant="outline" size="lg" onClick={() => navigate(-1)}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}

import { Link, Routes, Route, useNavigate } from "react-router-dom";
import Shipping from "./Shipping";
import Payment from "./Payment";
import Review from "./Review";

export default function Checkout() {
  const navigate = useNavigate();

  return (
    <section className="container py-12">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <div className="mt-6 flex gap-3">
        <button onClick={() => navigate("shipping")} className="rounded-md border px-3 py-1">Shipping</button>
        <button onClick={() => navigate("payment")} className="rounded-md border px-3 py-1">Payment</button>
        <button onClick={() => navigate("review")} className="rounded-md border px-3 py-1">Review</button>
      </div>

      <div className="mt-8">
        <Routes>
          <Route path="/" element={<Shipping />} />
          <Route path="shipping" element={<Shipping />} />
          <Route path="payment" element={<Payment />} />
          <Route path="review" element={<Review />} />
        </Routes>
      </div>

      <div className="mt-6">
        <Link to="/cart" className="text-sm text-muted-foreground">Back to cart</Link>
      </div>
    </section>
  );
}

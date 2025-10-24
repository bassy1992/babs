import { useParams, Link as RouterLink } from "react-router-dom";

export default function OrderConfirmation() {
  const { orderId } = useParams();
  return (
    <section className="container py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold">Thank you for your order</h1>
        <p className="mt-4 text-muted-foreground">Your order <strong>{orderId}</strong> has been received. We'll email you the receipt and tracking info when it's shipped.</p>
        <div className="mt-8 flex justify-center gap-3">
          <RouterLink to="/" className="rounded-md bg-primary px-4 py-2 text-primary-foreground">Continue shopping</RouterLink>
          <RouterLink to="/" className="rounded-md border px-4 py-2">View order</RouterLink>
        </div>
      </div>
    </section>
  );
}

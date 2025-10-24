import { Link } from "react-router-dom";

export default function Placeholder({ title }: { title: string }) {
  return (
    <section className="container py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-4 text-muted-foreground">
          This page is ready to be designed. Tell us what you want here and we
          will build it to match your vision.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          >
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}

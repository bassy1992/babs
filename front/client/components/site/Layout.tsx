import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-gradient">
      <Header />
      <main className="flex-1 animate-fade-up">
        <div className="w-full">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

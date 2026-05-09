import type { ReactNode } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";
import { Toaster } from "@/components/ui/sonner";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <Toaster theme="dark" />
    </div>
  );
}

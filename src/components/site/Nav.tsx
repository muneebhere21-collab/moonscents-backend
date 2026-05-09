import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingBag, Search, Menu, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { openCart, count } = useCart();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate({ to: "/search", search: { q: query.trim() } });
      setSearchOpen(false);
      setQuery("");
    }
  };

  const navLinks = [
    { name: "Collection", to: "/collection" },
    { name: "Discovery Kit", to: "/discovery-kit" },
    { name: "About", to: "/about" },
    { name: "Contact", to: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ${
        scrolled
          ? "backdrop-blur-xl bg-background/80 border-b border-border py-0"
          : "bg-transparent py-2"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <button 
          className="md:hidden text-silver hover:text-white transition-silk"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="hidden md:flex items-center gap-6 text-[10px] tracking-luxe uppercase text-silver-muted">
          {navLinks.map((link) => (
            <Link 
              key={link.to} 
              to={link.to} 
              className="hover:text-silver transition-silk relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-silver transition-all duration-500 group-hover:w-full" />
            </Link>
          ))}
        </div>

        <Link
          to="/"
          className="font-display text-xl md:text-2xl tracking-[0.15em] md:tracking-[0.25em] text-silver-gradient absolute left-1/2 -translate-x-1/2 hover:opacity-80 transition-silk"
        >
          MOONSCENTS
        </Link>

        <div className="flex items-center gap-3 md:gap-5 text-silver/90">
          <div className={`flex items-center transition-all duration-500 ${searchOpen ? "w-32 md:w-64 opacity-100" : "w-0 opacity-0 overflow-hidden"}`}>
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder="Search scents..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent border-b border-border/50 py-1 text-xs text-silver placeholder:text-silver-muted/50 outline-none focus:border-silver transition-silk"
              />
            </form>
          </div>
          <button 
            aria-label="Search" 
            onClick={() => setSearchOpen(!searchOpen)}
            className={`hover:text-white transition-silk ${searchOpen ? "text-white" : ""}`}
          >
            {searchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </button>
          
          {isAdmin && (
            <Link 
              to="/admin" 
              className="hidden md:block px-3 py-1 border border-silver/30 text-[9px] tracking-luxe uppercase text-silver hover:bg-silver hover:text-primary-foreground transition-silk rounded-full"
            >
              Atelier
            </Link>
          )}

          <Link
            to={user ? "/account" : "/auth"}
            aria-label={user ? "Account" : "Sign in"}
            className="hover:text-white transition-silk"
          >
            <User className="w-4 h-4" />
          </Link>

          <button
            onClick={openCart}
            aria-label="Cart"
            className="hover:text-white transition-silk relative"
          >
            <ShoppingBag className="w-4 h-4" />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-3.5 px-1 flex items-center justify-center rounded-full bg-silver text-primary-foreground text-[8px] font-bold">
                {count}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 top-20 bg-background/95 backdrop-blur-2xl transition-all duration-500 z-40 md:hidden ${mobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"}`}>
        <div className="flex flex-col items-center justify-center h-full gap-10 p-10">
          {navLinks.map((link) => (
            <Link 
              key={link.to} 
              to={link.to} 
              onClick={() => setMobileMenuOpen(false)}
              className="font-display text-3xl text-silver hover:text-silver-muted transition-silk"
            >
              {link.name}
            </Link>
          ))}
          {isAdmin && (
            <Link 
              to="/admin" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-display text-3xl text-silver-gradient"
            >
              Atelier
            </Link>
          )}
          <div className="mt-10 h-px w-20 bg-border" />
          <Link 
            to={user ? "/account" : "/auth"}
            onClick={() => setMobileMenuOpen(false)}
            className="text-xs tracking-luxe uppercase text-silver-muted"
          >
            {user ? "Your Account" : "Sign In"}
          </Link>
        </div>
      </div>
    </header>
  );
}

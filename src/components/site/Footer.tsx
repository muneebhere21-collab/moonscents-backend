import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border mt-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
        <div className="md:col-span-2 max-w-sm">
          <p className="font-display text-3xl text-silver-gradient">Moonscents</p>
          <p className="mt-4 text-sm leading-relaxed text-silver-muted">
            Fragrances composed under a Karachi moon. Crafted in small batches,
            delivered across Pakistan and beyond.
          </p>
        </div>

        <div>
          <p className="text-xs tracking-luxe uppercase text-silver mb-4">Shop</p>
          <ul className="space-y-2 text-sm text-silver-muted">
            <li><Link to="/collection" className="hover:text-silver transition-silk">All Fragrances</Link></li>
            <li><Link to="/discovery-kit" className="hover:text-silver transition-silk">Discovery Set</Link></li>
            <li><Link to="/collection" className="hover:text-silver transition-silk">Gifting</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs tracking-luxe uppercase text-silver mb-4">House</p>
          <ul className="space-y-2 text-sm text-silver-muted">
            <li><Link to="/about" className="hover:text-silver transition-silk">Our Story</Link></li>
            <li><Link to="/contact" className="hover:text-silver transition-silk">Contact</Link></li>
            <li><Link to="/policies" className="hover:text-silver transition-silk">Policies</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs tracking-luxe uppercase text-silver mb-4">Social</p>
          <ul className="space-y-2 text-sm text-silver-muted">
            <li><a href="https://www.instagram.com/moonscentofficial?igsh=MTl6ZWg4czh6b3JwZg==" target="_blank" rel="noopener noreferrer" className="hover:text-silver transition-silk">Instagram</a></li>
            <li><a href="https://www.facebook.com/share/1BpSPquJCD/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="hover:text-silver transition-silk">Facebook</a></li>
            <li><a href="https://wa.me/923303965260" target="_blank" rel="noopener noreferrer" className="hover:text-silver transition-silk">WhatsApp</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex flex-col md:flex-row justify-between text-xs text-silver-muted tracking-wider">
          <p>© {new Date().getFullYear()} Moonscents.pk — All rights reserved.</p>
          <p>Composed in Pakistan · Shipped Worldwide</p>
        </div>
      </div>
    </footer>
  );
}

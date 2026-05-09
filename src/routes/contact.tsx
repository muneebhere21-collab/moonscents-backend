import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({ meta: [{ title: "Contact — Moonscents" }] }),
});

function ContactPage() {
  return (
    <Layout>
      <section className="pt-40 pb-32 max-w-5xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-xs tracking-luxe uppercase text-silver-muted mb-6">Reach Out</p>
          <h1 className="font-display text-5xl md:text-6xl text-silver-gradient">Contact Us</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">
          <div className="space-y-12">
            <div>
              <h2 className="font-display text-3xl text-silver mb-4">The Atelier</h2>
              <p className="text-silver-muted leading-relaxed text-sm">
                We invite you to reach out with any inquiries regarding our collections, your order, or personalized fragrance consultations. Our master perfumers and support team are here to guide you.
              </p>
            </div>

            <div className="space-y-8 border-t border-border pt-8">
              <div>
                <p className="text-[10px] tracking-luxe uppercase text-silver-muted mb-3">Email</p>
                <a href="mailto:Moonscents123@gmail.com" className="text-lg text-silver hover:text-white transition-colors">
                  Moonscents123@gmail.com
                </a>
              </div>
              
              <div>
                <p className="text-[10px] tracking-luxe uppercase text-silver-muted mb-3">WhatsApp</p>
                <a href="https://wa.me/923303965260" target="_blank" rel="noopener noreferrer" className="text-lg text-silver hover:text-white transition-colors flex items-center gap-3">
                  +92 330 396 5260
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#25D366]">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
              </div>

              <div>
                <p className="text-[10px] tracking-luxe uppercase text-silver-muted mb-3">Hours</p>
                <p className="text-silver">Monday – Saturday</p>
                <p className="text-silver-muted text-sm mt-1">10:00 AM – 8:00 PM (PKT)</p>
              </div>
            </div>
          </div>

          <div className="bg-card/50 p-8 md:p-12 border border-border">
            <h2 className="font-display text-2xl text-silver mb-8">Send a Message</h2>
            <form action="mailto:Moonscents123@gmail.com" method="POST" encType="text/plain" className="space-y-8">
              <div>
                <label className="block text-[10px] tracking-luxe uppercase text-silver-muted mb-3">Your Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full bg-transparent border-b border-border/60 py-2 text-sm text-silver focus:border-silver outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-luxe uppercase text-silver-muted mb-3">Your Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full bg-transparent border-b border-border/60 py-2 text-sm text-silver focus:border-silver outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-luxe uppercase text-silver-muted mb-3">Your Message</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  className="w-full bg-transparent border-b border-border/60 py-2 text-sm text-silver focus:border-silver outline-none transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-silver text-primary-foreground py-4 text-xs tracking-luxe uppercase hover:bg-moonlight transition-silk mt-4"
              >
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}

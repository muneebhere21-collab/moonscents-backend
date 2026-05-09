import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";

export const Route = createFileRoute("/policies")({
  component: PolicyPage,
  head: () => ({
    meta: [{ title: "Policies — Moonscents" }],
  }),
});

function PolicyPage() {
  return (
    <Layout>
      <section className="pt-40 pb-24 max-w-3xl mx-auto px-6">
        <p className="text-xs tracking-luxe uppercase text-silver-muted mb-3 text-center">Guidelines</p>
        <h1 className="font-display text-5xl text-silver-gradient text-center mb-20">Policies</h1>

        <div className="space-y-24">
          <section id="shipping">
            <h2 className="text-xs tracking-luxe uppercase text-silver mb-8 border-b border-border pb-4">Shipping Policy</h2>
            <div className="prose prose-invert max-w-none text-silver-muted space-y-4 text-sm leading-relaxed">
              <p>
                Each Moonscents fragrance is carefully packed and shipped from our atelier in Karachi. 
                We currently offer nationwide shipping across Pakistan.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Standard shipping usually takes 3-5 business days.</li>
                <li>Expedited shipping is available for major cities (Lahore, Karachi, Islamabad).</li>
                <li>Free shipping is provided for all orders above PKR 15,000.</li>
              </ul>
            </div>
          </section>

          <section id="returns">
            <h2 className="text-xs tracking-luxe uppercase text-silver mb-8 border-b border-border pb-4">Returns & Exchanges</h2>
            <div className="prose prose-invert max-w-none text-silver-muted space-y-4 text-sm leading-relaxed">
              <p>
                Due to the artisanal and personal nature of our fragrances, we can only accept returns 
                on items that are damaged or defective upon arrival.
              </p>
              <p>
                If your order arrives damaged, please contact us within 48 hours of delivery with 
                photographic evidence. We will arrange a replacement or full refund immediately.
              </p>
              <p>
                We do not offer returns based on scent preference. We recommend starting with our 
                discovery sets if you are unsure of which scent to choose.
              </p>
            </div>
          </section>

          <section id="privacy">
            <h2 className="text-xs tracking-luxe uppercase text-silver mb-8 border-b border-border pb-4">Privacy Policy</h2>
            <div className="prose prose-invert max-w-none text-silver-muted space-y-4 text-sm leading-relaxed">
              <p>
                At Moonscents, we value your privacy. We only collect information necessary to process 
                your orders and provide a personalized experience.
              </p>
              <p>
                Your data is never sold to third parties. We use secure, industry-standard encryption 
                to protect your personal and payment information.
              </p>
            </div>
          </section>
        </div>
      </section>
    </Layout>
  );
}

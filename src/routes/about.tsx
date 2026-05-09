import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "Our Story — Moonscents" },
      { name: "description", content: "The story of Moonscents — a Karachi atelier composing fragrances under the moon." },
    ],
  }),
});

function AboutPage() {
  return (
    <Layout>
      <section className="pt-40 pb-24 max-w-3xl mx-auto px-6 lg:px-10">
        <p className="text-xs tracking-luxe uppercase text-silver-muted mb-6">Our Story</p>
        <h1 className="font-display text-5xl md:text-6xl text-silver-gradient leading-[1.05]">
          A house composed under the moon.
        </h1>

        <div className="mt-16 space-y-8 text-base leading-[1.9] text-silver-muted">
          <p>
            Moonscents began as a quiet practice — a small atelier in Karachi where every formula is composed at night, when the city slows and the senses sharpen. We work with raw materials that carry weight: oud from Assam, jasmine from the Konkan coast, ambergris and iris steeped slowly in alcohol until the molecules learn one another.
          </p>
          <p>
            We are not interested in volume. Each release is a small batch, hand-bottled, signed, and dated. A fragrance from us is meant to live with you — to mark a season, an evening, a person you stayed up late with.
          </p>
          <p>
            Our visual language borrows from the moon because the moon, like a great fragrance, is never quite the same twice. It changes with the night, with the eye that watches it, with the mood it meets.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-10 border-t border-border pt-16">
          {[
            ["Composed in", "Karachi, PK"],
            ["Batch size", "Under 200"],
            ["Concentration", "20–24% EDP"],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="text-[10px] tracking-luxe uppercase text-silver-muted">{k}</p>
              <p className="font-display text-2xl text-silver mt-2">{v}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}

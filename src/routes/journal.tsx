import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";

export const Route = createFileRoute("/journal")({
  component: JournalPage,
  head: () => ({
    meta: [
      { title: "Journal — Moonscents" },
      { name: "description", content: "Notes from the atelier — on scent, ritual, and the moon." },
    ],
  }),
});

const entries = [
  { date: "April 2026", title: "On wearing scent at night", excerpt: "Why a fragrance reads differently after the sun has set, and how we compose for that hour." },
  { date: "March 2026", title: "The architecture of oud", excerpt: "A short essay on the slow, smouldering material at the heart of Eclipse." },
  { date: "February 2026", title: "Letters from Karachi", excerpt: "Field notes from our atelier — the markets, the materials, the moon over the Arabian Sea." },
];

function JournalPage() {
  return (
    <Layout>
      <section className="pt-40 pb-12 max-w-4xl mx-auto px-6 lg:px-10">
        <p className="text-xs tracking-luxe uppercase text-silver-muted mb-6">Journal</p>
        <h1 className="font-display text-5xl md:text-6xl text-silver-gradient">
          Notes from the atelier.
        </h1>
      </section>

      <section className="max-w-4xl mx-auto px-6 lg:px-10 pb-24 divide-y divide-border">
        {entries.map((e) => (
          <article key={e.title} className="py-12 grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 group">
            <p className="text-xs tracking-luxe uppercase text-silver-muted pt-2">{e.date}</p>
            <div>
              <h2 className="font-display text-3xl text-silver group-hover:text-moonlight transition-silk">{e.title}</h2>
              <p className="mt-3 text-silver-muted leading-relaxed">{e.excerpt}</p>
              <Link to="/journal" className="inline-block mt-4 text-xs tracking-luxe uppercase text-silver-muted hover:text-silver border-b border-silver/30 pb-1">
                Read
              </Link>
            </div>
          </article>
        ))}
      </section>
    </Layout>
  );
}

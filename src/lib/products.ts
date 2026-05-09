import eclipse from "@/assets/perfume-eclipse.jpg";
import luna from "@/assets/perfume-luna.jpg";
import noir from "@/assets/perfume-noir.jpg";
import celestia from "@/assets/perfume-celestia.jpg";

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  price: number;
  image: string;
  family: "Oriental" | "Floral" | "Woody" | "Aquatic";
  notes: { top: string[]; heart: string[]; base: string[] };
  story: string;
};

export const products: Product[] = [
  {
    slug: "eclipse",
    name: "Eclipse",
    tagline: "A shadow cast in oud and amber.",
    price: 8500,
    image: eclipse,
    family: "Oriental",
    notes: {
      top: ["Saffron", "Bergamot"],
      heart: ["Rose Absolute", "Oud"],
      base: ["Amber", "Vanilla", "Musk"],
    },
    story:
      "Composed in the stillness before totality. Eclipse opens with a flare of saffron, then settles into a smouldering oud, leaving an amber trail like the corona of a hidden sun.",
  },
  {
    slug: "luna",
    name: "Luna",
    tagline: "Soft as moonlight on bare skin.",
    price: 7200,
    image: luna,
    family: "Floral",
    notes: {
      top: ["White Pear", "Aldehydes"],
      heart: ["Jasmine Sambac", "Tuberose"],
      base: ["White Musk", "Sandalwood"],
    },
    story:
      "Luna is a quiet exhale. Cool aldehydes drift over a heart of night-blooming jasmine, finished with the powdery hush of musk — the scent of a sky lit only by the moon.",
  },
  {
    slug: "noir",
    name: "Noir",
    tagline: "Smoke, leather, and a slow burn.",
    price: 9400,
    image: noir,
    family: "Woody",
    notes: {
      top: ["Black Pepper", "Pink Peppercorn"],
      heart: ["Leather", "Iris"],
      base: ["Vetiver", "Tonka", "Cedar"],
    },
    story:
      "An after-midnight composition. Noir wears smoke like silk — a quiet authority of leather and vetiver, warmed by tonka, lingering long after the room has emptied.",
  },
  {
    slug: "celestia",
    name: "Celestia",
    tagline: "A nebula captured in glass.",
    price: 8800,
    image: celestia,
    family: "Aquatic",
    notes: {
      top: ["Sea Salt", "Yuzu"],
      heart: ["Iris", "Violet Leaf"],
      base: ["Ambergris", "White Amber"],
    },
    story:
      "Celestia is weightless. A cool burst of yuzu over salted air, with iris and violet drifting through like distant constellations. Worn close, it shimmers; worn open, it disappears into the night.",
  },
];

export const getProduct = (slug: string) =>
  products.find((p) => p.slug === slug);

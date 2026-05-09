import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres:Fragnancecity1@db.eaqghrfwjunriasozpmg.supabase.co:5432/postgres";

async function migrate() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log("Connected to Supabase PostgreSQL");

    // 1. Create Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        family TEXT NOT NULL,
        tagline TEXT NOT NULL,
        description TEXT NOT NULL,
        notes JSONB NOT NULL,
        perfume_type TEXT NOT NULL,
        ml INTEGER NOT NULL,
        image TEXT NOT NULL,
        price INTEGER NOT NULL,
        stock INTEGER DEFAULT 0,
        variants JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `);
    console.log("Table 'products' verified/created.");

    // 2. Data to migrate
    const products = [
      {
        slug: "noor-e-qamar",
        name: "Noor-e-Qamar",
        family: "Soft Oud",
        tagline: "The Glow of Pure Moonlight",
        description: "A luminous and calming fragrance inspired by the serene radiance of the moon. Noor-e-Qamar blends soft florals with delicate white oud, creating a clean, elegant scent.",
        notes: { top: "Bergamot, Aldehydes, White Pepper", heart: "Jasmine, White Rose, Iris", base: "White Oud, Musk, Sandalwood" },
        perfume_type: "Eau de Parfum",
        ml: 50,
        image: "/uploads/image-1777663618307-428603123.png",
        price: 4500,
        stock: 100,
        variants: [{ ml: 20, price: 2500, stock: 50 }]
      },
      {
        slug: "midnight-eclipse",
        name: "Midnight Eclipse",
        family: "Woody Spicy",
        tagline: "Power After Dark",
        description: "A bold and intense fragrance that captures the energy of a moonless night. Midnight Eclipse opens with sharp citrus and spice, transitions into a smoky heart.",
        notes: { top: "Lemon, Blackcurrant, Pink Pepper", heart: "Birch Smoke, Jasmine, Patchouli", base: "Ambergris, Musk, Oakmoss" },
        perfume_type: "Eau de Parfum",
        ml: 50,
        image: "/uploads/image-1777662010120-232567087.png",
        price: 4500,
        stock: 100,
        variants: [{ ml: 20, price: 2500, stock: 50 }]
      },
      {
        slug: "flora-noctis",
        name: "Flora Noctis",
        family: "Floral Musk",
        tagline: "Where Flowers Bloom in Shadow",
        description: "A mysterious floral scent that reveals itself under the stars. Exotic jasmine and dark rose are wrapped in a velvet musk for a scent that is both dangerous and inviting.",
        notes: { top: "Pear, Pink Pepper, Orange Blossom", heart: "Jasmine, Coffee, Bitter Almond", base: "Vanilla, Patchouli, Cedar" },
        perfume_type: "Eau de Parfum",
        ml: 50,
        image: "/uploads/image-1777662327891-554144598.png",
        price: 4500,
        stock: 100,
        variants: [{ ml: 20, price: 2500, stock: 50 }]
      },
      {
        slug: "crimson-moon",
        name: "Crimson Moon",
        family: "Amber Sweet",
        tagline: "Passion and Mystery",
        description: "A rich, seductive blend of warm amber and deep red fruits. Crimson Moon is for those who embrace the intensity of their emotions.",
        notes: { top: "Saffron, Jasmine", heart: "Amberwood, Ambergris", base: "Fir Resin, Cedar" },
        perfume_type: "Eau de Parfum",
        ml: 50,
        image: "/uploads/image-1777663021795-414657486.png",
        price: 4800,
        stock: 100,
        variants: [{ ml: 20, price: 2800, stock: 50 }]
      },
      {
        slug: "lunar-apex",
        name: "Lunar Apex",
        family: "Fruity Woody",
        tagline: "The Zenith of Luxury",
        description: "A sophisticated scent that balances fresh fruit with deep, grounding woods. It is the pinnacle of the Moonscents collection.",
        notes: { top: "Pineapple, Bergamot", heart: "Birch, Rose, Moroccan Jasmine", base: "Musk, Oakmoss, Vanilla" },
        perfume_type: "Eau de Parfum",
        ml: 50,
        image: "/uploads/image-1777663362339-845736289.png",
        price: 5200,
        stock: 100,
        variants: [{ ml: 20, price: 3200, stock: 50 }]
      }
    ];

    // 3. Insert Data
    for (const p of products) {
      await client.query(`
        INSERT INTO products (slug, name, family, tagline, description, notes, perfume_type, ml, image, price, stock, variants)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          family = EXCLUDED.family,
          tagline = EXCLUDED.tagline,
          description = EXCLUDED.description,
          notes = EXCLUDED.notes,
          perfume_type = EXCLUDED.perfume_type,
          ml = EXCLUDED.ml,
          image = EXCLUDED.image,
          price = EXCLUDED.price,
          stock = EXCLUDED.stock,
          variants = EXCLUDED.variants;
      `, [p.slug, p.name, p.family, p.tagline, p.description, JSON.stringify(p.notes), p.perfume_type, p.ml, p.image, p.price, p.stock, JSON.stringify(p.variants)]);
    }

    console.log("Migration successful! 5 products inserted/updated.");

  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

migrate();

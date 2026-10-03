const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function run() {
  const client = new Client({
    host: process.env.SUPABASE_DB_HOST || 'db.jdaqvsgbchcljcwabiqy.supabase.co',
    port: parseInt(process.env.SUPABASE_DB_PORT || '5432', 10),
    database: process.env.SUPABASE_DB_NAME || 'postgres',
    user: process.env.SUPABASE_DB_USER || 'postgres',
    password: process.env.SUPABASE_DB_PASSWORD || process.env.PGPASSWORD,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });

  console.log('Connecting to Supabase PostgreSQL at db.jdaqvsgbchcljcwabiqy.supabase.co:5432...');
  await client.connect();
  console.log('✓ Successfully connected to PostgreSQL.');

  // 1. Run Schema Migration
  const schemaPath = path.join(__dirname, '..', 'supabase', 'migrations', '20261002000000_init_ecommerce_schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');
  console.log('Executing schema migration...');
  await client.query(sql);
  console.log('✓ Schema and RLS policies created successfully.');

  // 2. Seed Default Site Settings
  console.log('Seeding site settings...');
  const settings = [
    { key: 'minimum_cart_value', value: '2000', description: 'Minimum order cart value in INR' },
    { key: 'business_name', value: 'Sivaji Firecracker', description: 'Official business name' },
    { key: 'business_city', value: 'Hyderabad', description: 'Operating city location' },
    { key: 'business_phone', value: '+91 83740 44445', description: 'Official customer care phone' },
    { key: 'business_email', value: 'sivajiduddempudi42@gmail.com', description: 'Customer support email' },
    { key: 'upi_id', value: 'sivajiduddempudi422@axl', description: 'Official UPI ID for manual payments' },
    { key: 'upi_payee_name', value: 'Sivaji Duddempudi', description: 'Recipient payee name for UPI' },
    { key: 'currency_symbol', value: '₹', description: 'Currency symbol' },
  ];

  for (const s of settings) {
    await client.query(
      `INSERT INTO public.site_settings (key, value, description)
       VALUES ($1, $2, $3)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, description = EXCLUDED.description;`,
      [s.key, s.value, s.description]
    );
  }
  console.log('✓ Site settings seeded.');

  // 3. Seed Categories
  console.log('Seeding categories...');
  const categories = [
    { slug: 'one_sound', name: 'One Sound Crackers', icon: 'Volume2', sort_order: 1 },
    { slug: 'sparklers', name: 'Sparklers & Chakkars', icon: 'Sparkles', sort_order: 2 },
    { slug: 'bombs', name: 'Bomb Items', icon: 'Flame', sort_order: 3 },
    { slug: 'flower_pots', name: 'Flower Pots (Anar)', icon: 'Flower', sort_order: 4 },
    { slug: 'cartoon_varieties', name: 'Kids Cartoon Varieties', icon: 'Smile', sort_order: 5 },
    { slug: 'sky_night_fancy', name: 'Sky Night Aerial Repeaters', icon: 'Rocket', sort_order: 6 },
    { slug: 'night_fancy', name: 'Night Fancy Fountains', icon: 'Sun', sort_order: 7 },
    { slug: 'ground_chakkar', name: 'Ground Chakkars', icon: 'Disc', sort_order: 8 },
    { slug: 'paper_bomb', name: 'Paper Bombs', icon: 'Zap', sort_order: 9 },
    { slug: 'special_item', name: 'Special Festive Items', icon: 'Star', sort_order: 10 },
    { slug: 'twinkling_star', name: 'Twinkling Star', icon: 'Sparkles', sort_order: 11 },
    { slug: 'gift_boxes', name: 'Family Gift Boxes', icon: 'Gift', sort_order: 12 },
    { slug: 'magic_wala', name: 'Magic Wala', icon: 'Wand', sort_order: 13 },
    { slug: 'wala', name: 'Wala Garlands (100 to 10K)', icon: 'Layers', sort_order: 14 },
    { slug: 'children_roll_cap', name: 'Children Roll Cap & Guns', icon: 'Crosshair', sort_order: 15 },
    { slug: 'rocket', name: 'Rockets & Missiles', icon: 'ArrowUpRight', sort_order: 16 },
  ];

  const categoryMap = new Map();
  for (const c of categories) {
    const res = await client.query(
      `INSERT INTO public.categories (name, slug, icon, sort_order)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, sort_order = EXCLUDED.sort_order
       RETURNING id, slug;`,
      [c.name, c.slug, c.icon, c.sort_order]
    );
    categoryMap.set(c.slug, res.rows[0].id);
  }
  console.log(`✓ Seeded ${categories.length} categories.`);

  // 4. Seed 157 Legitimate Products from seed data
  console.log('Seeding products...');
  const seedFile = path.join(__dirname, '..', 'backend', 'database', 'seeders', 'products_seed.json');
  if (fs.existsSync(seedFile)) {
    const productsData = JSON.parse(fs.readFileSync(seedFile, 'utf8'));
    let inserted = 0;
    for (const item of productsData) {
      const categoryId = categoryMap.get(item.category) || null;
      const mrp = parseFloat(item.mrp);
      let price = parseFloat(item.price);
      // Enforce max 80% discount rule
      if (price < Math.ceil(mrp * 0.20)) {
        price = Math.ceil(mrp * 0.20);
      }

      const boxQuantity = parseInt(item.boxQuantity || 1, 10);
      const quantityUnit = item.quantityUnit || 'Pieces';
      const piecesText = item.pieces || `Box Contains: ${boxQuantity} ${quantityUnit}`;
      const slug = (item.name || item.id)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + item.id.toLowerCase();

      await client.query(
        `INSERT INTO public.products (
           category_id, category_slug, name, slug, sku, subtitle,
           description, mrp, selling_price, box_quantity, quantity_unit,
           pieces, sound_level, image_url, green_certified, is_featured,
           is_bestseller, badge, stock_quantity, is_active
         ) VALUES (
           $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
         )
         ON CONFLICT (sku) DO UPDATE SET
           category_id = EXCLUDED.category_id,
           category_slug = EXCLUDED.category_slug,
           name = EXCLUDED.name,
           mrp = EXCLUDED.mrp,
           selling_price = EXCLUDED.selling_price,
           box_quantity = EXCLUDED.box_quantity,
           quantity_unit = EXCLUDED.quantity_unit,
           pieces = EXCLUDED.pieces,
           image_url = EXCLUDED.image_url,
           description = EXCLUDED.description;`,
        [
          categoryId,
          item.category,
          item.name,
          slug,
          item.id,
          item.subtitle || 'Festive Celebration Cracker',
          item.description || 'Authentic Sivaji Firecracker festival selection. 100% CSIR-NEERI Green Certified formulation with verifiable QR code. Wholesale direct price.',
          mrp,
          price,
          boxQuantity,
          quantityUnit,
          piecesText,
          item.soundLevel || 'Festival Sound',
          item.image,
          true,
          Boolean(item.featured),
          item.badge === 'Bestseller',
          item.badge || null,
          100, // standard default inventory
          true,
        ]
      );
      inserted++;
    }
    console.log(`✓ Seeded ${inserted} products.`);
  }

  // 5. Storage Buckets Creation & Storage Policies
  console.log('Ensuring Supabase Storage buckets...');
  await client.query(`
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES
      ('product-images', 'product-images', true, 52428800, ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml']),
      ('payment-screenshots', 'payment-screenshots', false, 10485760, ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'])
    ON CONFLICT (id) DO UPDATE SET
      public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;
  `);

  // Storage RLS
  await client.query(`
    -- Product Images (Public Read, Admin Write)
    DROP POLICY IF EXISTS "Public can view product images bucket" ON storage.objects;
    CREATE POLICY "Public can view product images bucket"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'product-images');

    DROP POLICY IF EXISTS "Admins can manage product images bucket" ON storage.objects;
    CREATE POLICY "Admins can manage product images bucket"
      ON storage.objects FOR ALL
      USING (bucket_id = 'product-images' AND public.is_admin());

    -- Payment Screenshots (Customer upload, Customer view own, Admin view all)
    DROP POLICY IF EXISTS "Customers can upload payment screenshots" ON storage.objects;
    CREATE POLICY "Customers can upload payment screenshots"
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'payment-screenshots');

    DROP POLICY IF EXISTS "Users can view own screenshots or admin all" ON storage.objects;
    CREATE POLICY "Users can view own screenshots or admin all"
      ON storage.objects FOR SELECT
      USING (
        bucket_id = 'payment-screenshots'
        AND (
          public.is_admin()
          OR (auth.uid() IS NOT NULL AND (storage.foldername(name))[1] = auth.uid()::text)
        )
      );
  `);
  console.log('✓ Storage buckets and policies verified.');

  await client.end();
  console.log('All migrations and seeds finished successfully!');
}

run().catch((err) => {
  console.error('Migration error:', err);
  process.exit(1);
});

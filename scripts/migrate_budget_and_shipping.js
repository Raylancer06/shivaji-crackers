const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Auto-load .env.local if present
const envLocalPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = (match[2] || '').trim().replace(/^['"](.*)['"]$/, '$1');
      if (!process.env[key]) process.env[key] = value;
    }
  });
}

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

  console.log('Connecting to Supabase PostgreSQL...');
  await client.connect();

  console.log('1. Creating public.budget_packages table...');
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.budget_packages (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      name TEXT NOT NULL,
      subtitle TEXT,
      tag TEXT,
      budget NUMERIC(10,2) NOT NULL,
      mrp NUMERIC(10,2) NOT NULL,
      description TEXT,
      items_summary TEXT,
      item_skus JSONB DEFAULT '[]'::jsonb,
      sort_order INT DEFAULT 1,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );

    ALTER TABLE public.budget_packages ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Public can view active budget packages" ON public.budget_packages;
    CREATE POLICY "Public can view active budget packages"
      ON public.budget_packages FOR SELECT
      TO anon, authenticated
      USING (is_active = true OR public.is_admin());

    DROP POLICY IF EXISTS "Admins can manage budget packages" ON public.budget_packages;
    CREATE POLICY "Admins can manage budget packages"
      ON public.budget_packages FOR ALL
      TO authenticated
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  `);

  console.log('2. Seeding default budget packages...');
  const initialPackages = [
    {
      id: 'starter',
      name: 'Diwali Anandham Family Pack',
      subtitle: 'Essential Family Celebration (30 Items + Sparklers)',
      tag: 'Meets Minimum Order',
      budget: 3120,
      mrp: 10400,
      description: 'Perfect balanced festival pack for a family with sparklers, flower pots, chakkars, and colorful ground spinners.',
      items_summary: 'Family Gift Box (30 Items) + 5 Boxes Sparklers + Flower Pots + Ground Chakkars',
      item_skus: JSON.stringify([
        { sku: 'PROD-105', qty: 2 },
        { sku: 'PROD-011', qty: 5 },
        { sku: 'PROD-034', qty: 4 },
        { sku: 'PROD-045', qty: 3 },
        { sku: 'PROD-001', qty: 5 },
      ]),
      sort_order: 1,
      is_active: true,
    },
    {
      id: 'grand',
      name: 'Sivaji Royal Platinum Hamper',
      subtitle: 'Our Flagship Festive Collection (50 Items + Fancy Aerials)',
      tag: 'Most Popular Choice',
      budget: 5250,
      mrp: 17500,
      description: 'Our most popular festive pack with aerial repeaters, sky night cakes, giant pots, multi-color sparklers, and kid novelties.',
      items_summary: 'Family Gift Box (50 Items) + Penta Colour Aerials + Night Fountains + Big Pots',
      item_skus: JSON.stringify([
        { sku: 'PROD-107', qty: 2 },
        { sku: 'PROD-046', qty: 3 },
        { sku: 'PROD-047', qty: 3 },
        { sku: 'PROD-035', qty: 4 },
        { sku: 'PROD-012', qty: 4 },
      ]),
      sort_order: 2,
      is_active: true,
    },
    {
      id: 'spectacular',
      name: 'Mega Aerial Night Carnival',
      subtitle: 'Grand Sky Spectacular Display Box (60 Items + Pipe Shots)',
      tag: 'Night Sky Spectacle',
      budget: 9800,
      mrp: 32600,
      description: 'Designed for enthusiasts who want maximum aerial sky fireworks, continuous multi-shot display cakes, and heavy sound.',
      items_summary: 'Family Gift Box (60 Items) + 3.5" Fancy Pipes + Multi-Colour Out + Jumbo Chakkars',
      item_skus: JSON.stringify([
        { sku: 'PROD-108', qty: 2 },
        { sku: 'PROD-048', qty: 5 },
        { sku: 'PROD-047', qty: 5 },
        { sku: 'PROD-030', qty: 4 },
        { sku: 'PROD-036', qty: 4 },
      ]),
      sort_order: 3,
      is_active: true,
    },
  ];

  for (const pkg of initialPackages) {
    await client.query(`
      INSERT INTO public.budget_packages (id, name, subtitle, tag, budget, mrp, description, items_summary, item_skus, sort_order, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        subtitle = EXCLUDED.subtitle,
        tag = EXCLUDED.tag,
        budget = EXCLUDED.budget,
        mrp = EXCLUDED.mrp,
        description = EXCLUDED.description,
        items_summary = EXCLUDED.items_summary,
        item_skus = EXCLUDED.item_skus,
        sort_order = EXCLUDED.sort_order,
        is_active = EXCLUDED.is_active;
    `, [pkg.id, pkg.name, pkg.subtitle, pkg.tag, pkg.budget, pkg.mrp, pkg.description, pkg.items_summary, pkg.item_skus, pkg.sort_order, pkg.is_active]);
  }

  console.log('3. Updating site_settings for shipping & budget builder copy...');
  const newSettings = [
    { key: 'shipping_charge', value: '150', description: 'Base shipping charge in INR' },
    { key: 'free_shipping_enabled', value: 'false', description: 'Whether free shipping is active (true/false)' },
    { key: 'free_shipping_threshold', value: '5000', description: 'Order subtotal required for free shipping if enabled' },
    { key: 'budget_builder_enabled', value: 'true', description: 'Whether Smart Budget Builder section is visible on home page' },
    { key: 'budget_builder_badge', value: 'Instant 1-Click Bundle Calculator', description: 'Badge text for budget builder' },
    { key: 'budget_builder_title', value: 'Smart Budget Builder For Families & Societies', description: 'Main title for budget builder section' },
    { key: 'budget_builder_subtitle', value: 'Curated Diwali celebration bundles tailored for every budget', description: 'Subtitle for budget builder section' },
    { key: 'budget_builder_description', value: 'Don\'t have time to pick 40 individual crackers? Select your celebration budget below. Our master packers have balanced sparklers, flower pots, and sky shots to give you the highest variety and savings.', description: 'Description paragraph for budget builder' },
  ];

  for (const s of newSettings) {
    await client.query(`
      INSERT INTO public.site_settings (key, value, description)
      VALUES ($1, $2, $3)
      ON CONFLICT (key) DO UPDATE SET
        description = EXCLUDED.description;
    `, [s.key, s.value, s.description]);
  }

  console.log('4. Updating create_order_atomic function for backend-controlled shipping...');
  await client.query(`
    CREATE OR REPLACE FUNCTION public.create_order_atomic(order_payload JSONB)
    RETURNS JSONB AS $$
    DECLARE
        v_customer_id UUID;
        v_customer_name TEXT;
        v_customer_phone TEXT;
        v_customer_email TEXT;
        v_delivery_address TEXT;
        v_city TEXT;
        v_state TEXT;
        v_pincode TEXT;
        v_landmark TEXT;
        v_notes TEXT;
        v_items JSONB;
        v_item JSONB;
        v_product_id TEXT;
        v_item_qty INTEGER;
        
        v_product RECORD;
        v_total_mrp NUMERIC(12,2) := 0;
        v_subtotal NUMERIC(12,2) := 0;
        v_discount NUMERIC(12,2) := 0;
        v_final_total NUMERIC(12,2) := 0;
        v_shipping NUMERIC(12,2) := 0;
        v_min_cart NUMERIC(12,2) := 2000;
        
        v_base_shipping NUMERIC(12,2) := 0;
        v_free_ship_enabled BOOLEAN := false;
        v_free_ship_threshold NUMERIC(12,2) := 0;
        
        v_order_id UUID;
        v_order_number TEXT;
        v_random_num INTEGER;
    BEGIN
        -- Extract customer details
        v_customer_id := (order_payload->>'customer_id')::UUID;
        v_customer_name := TRIM(order_payload->>'customer_name');
        v_customer_phone := TRIM(order_payload->>'customer_phone');
        v_customer_email := TRIM(order_payload->>'customer_email');
        v_delivery_address := TRIM(order_payload->>'delivery_address');
        v_city := COALESCE(NULLIF(TRIM(order_payload->>'city'), ''), 'Hyderabad');
        v_state := COALESCE(NULLIF(TRIM(order_payload->>'state'), ''), 'Telangana');
        v_pincode := TRIM(order_payload->>'pincode');
        v_landmark := NULLIF(TRIM(order_payload->>'landmark'), '');
        v_notes := NULLIF(TRIM(order_payload->>'notes'), '');
        v_items := order_payload->'items';

        IF v_customer_name IS NULL OR v_customer_name = '' THEN
            RAISE EXCEPTION 'Customer name is required';
        END IF;
        IF v_customer_phone IS NULL OR v_customer_phone = '' THEN
            RAISE EXCEPTION 'Customer phone is required';
        END IF;
        IF v_delivery_address IS NULL OR v_delivery_address = '' THEN
            RAISE EXCEPTION 'Delivery address is required';
        END IF;
        IF v_items IS NULL OR jsonb_array_length(v_items) = 0 THEN
            RAISE EXCEPTION 'Cart is empty. Please select products to order.';
        END IF;

        -- Load settings from public.site_settings
        SELECT COALESCE(NULLIF(value, '')::NUMERIC, 2000) INTO v_min_cart
        FROM public.site_settings WHERE key = 'minimum_cart_value';

        SELECT COALESCE(NULLIF(value, '')::NUMERIC, 0) INTO v_base_shipping
        FROM public.site_settings WHERE key = 'shipping_charge';

        SELECT (LOWER(COALESCE(NULLIF(value, ''), 'false')) = 'true') INTO v_free_ship_enabled
        FROM public.site_settings WHERE key = 'free_shipping_enabled';

        SELECT COALESCE(NULLIF(value, '')::NUMERIC, 0) INTO v_free_ship_threshold
        FROM public.site_settings WHERE key = 'free_shipping_threshold';

        -- Validate stock and compute authoritative merchandise subtotal
        FOR v_item IN SELECT * FROM jsonb_array_elements(v_items)
        LOOP
            v_product_id := v_item->>'product_id';
            v_item_qty := COALESCE((v_item->>'quantity')::INTEGER, 1);

            IF v_item_qty <= 0 THEN
                RAISE EXCEPTION 'Invalid quantity for product %', v_product_id;
            END IF;

            SELECT * INTO v_product
            FROM public.products
            WHERE (id::text = v_product_id OR sku = v_product_id)
            AND is_active = true
            FOR UPDATE;

            IF NOT FOUND THEN
                RAISE EXCEPTION 'Product % is currently unavailable or inactive', v_product_id;
            END IF;

            IF v_product.stock_quantity < v_item_qty THEN
                RAISE EXCEPTION 'Insufficient stock for %: % available, % requested', v_product.name, v_product.stock_quantity, v_item_qty;
            END IF;

            v_total_mrp := v_total_mrp + (v_product.mrp * v_item_qty);
            v_subtotal := v_subtotal + (v_product.selling_price * v_item_qty);
        END LOOP;

        -- Enforce Minimum Cart Value on merchandise subtotal
        IF v_min_cart > 0 AND v_subtotal < v_min_cart THEN
            RAISE EXCEPTION 'Minimum order value is ₹%. Current subtotal is ₹%. Please add more items to proceed.', v_min_cart, v_subtotal;
        END IF;

        -- Compute dynamic backend shipping charge
        IF v_free_ship_enabled AND v_free_ship_threshold > 0 AND v_subtotal >= v_free_ship_threshold THEN
            v_shipping := 0;
        ELSE
            v_shipping := v_base_shipping;
        END IF;

        v_discount := v_total_mrp - v_subtotal;
        v_final_total := v_subtotal + v_shipping;

        -- Generate Unique Order Number
        v_random_num := floor(100000 + random() * 900000);
        v_order_number := 'SIV-' || v_random_num;

        -- Insert Order
        INSERT INTO public.orders (
            order_number,
            customer_id,
            customer_name,
            customer_phone,
            customer_email,
            delivery_address,
            city,
            state,
            pincode,
            landmark,
            address_snapshot,
            subtotal,
            discount,
            shipping_charge,
            final_total,
            status,
            payment_status,
            notes
        ) VALUES (
            v_order_number,
            v_customer_id,
            v_customer_name,
            v_customer_phone,
            v_customer_email,
            v_delivery_address,
            v_city,
            v_state,
            v_pincode,
            v_landmark,
            jsonb_build_object(
                'recipient_name', v_customer_name,
                'phone', v_customer_phone,
                'address', v_delivery_address,
                'city', v_city,
                'state', v_state,
                'pincode', v_pincode,
                'landmark', v_landmark
            ),
            v_subtotal,
            v_discount,
            v_shipping,
            v_final_total,
            'pending_verification',
            'pending',
            v_notes
        ) RETURNING id INTO v_order_id;

        -- Deduct inventory and insert order items
        FOR v_item IN SELECT * FROM jsonb_array_elements(v_items)
        LOOP
            v_product_id := v_item->>'product_id';
            v_item_qty := (v_item->>'quantity')::INTEGER;

            SELECT * INTO v_product
            FROM public.products
            WHERE (id::text = v_product_id OR sku = v_product_id);

            UPDATE public.products
            SET stock_quantity = stock_quantity - v_item_qty,
                updated_at = NOW()
            WHERE id = v_product.id;

            INSERT INTO public.order_items (
                order_id,
                product_id,
                product_name,
                box_quantity,
                quantity_unit,
                unit_price,
                mrp,
                quantity,
                line_total
            ) VALUES (
                v_order_id,
                v_product.id,
                v_product.name,
                v_product.box_quantity,
                v_product.quantity_unit,
                v_product.selling_price,
                v_product.mrp,
                v_item_qty,
                (v_product.selling_price * v_item_qty)
            );
        END LOOP;

        RETURN jsonb_build_object(
            'id', v_order_id,
            'order_number', v_order_number,
            'subtotal', v_subtotal,
            'discount', v_discount,
            'shipping_charge', v_shipping,
            'final_total', v_final_total,
            'status', 'pending_verification',
            'payment_status', 'pending'
        );
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `);

  console.log('5. Adding trigger to automatically sync order payment status on payment insert/update...');
  await client.query(`
    CREATE OR REPLACE FUNCTION public.handle_payment_lifecycle()
    RETURNS TRIGGER AS $$
    BEGIN
      IF TG_OP = 'INSERT' THEN
        UPDATE public.orders
        SET payment_status = 'submitted', updated_at = NOW()
        WHERE id = NEW.order_id AND payment_status = 'pending';
      ELSIF TG_OP = 'UPDATE' THEN
        IF NEW.status = 'verified' AND (OLD.status IS DISTINCT FROM 'verified') THEN
          UPDATE public.orders
          SET payment_status = 'verified', status = 'confirmed', updated_at = NOW()
          WHERE id = NEW.order_id;
        ELSIF NEW.status = 'rejected' AND (OLD.status IS DISTINCT FROM 'rejected') THEN
          UPDATE public.orders
          SET payment_status = 'rejected', updated_at = NOW()
          WHERE id = NEW.order_id;
        END IF;
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    DROP TRIGGER IF EXISTS trg_payment_lifecycle ON public.payments;
    CREATE TRIGGER trg_payment_lifecycle
    AFTER INSERT OR UPDATE ON public.payments
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_payment_lifecycle();
  `);

  console.log('✓ Migration completed successfully.');
  await client.end();
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});

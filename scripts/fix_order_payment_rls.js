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
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();

  console.log('Creating helper function order_exists...');
  await client.query(`
    CREATE OR REPLACE FUNCTION public.order_exists(p_order_id uuid)
    RETURNS boolean AS $$
      SELECT EXISTS(SELECT 1 FROM public.orders WHERE id = p_order_id);
    $$ LANGUAGE sql SECURITY DEFINER;

    GRANT EXECUTE ON FUNCTION public.order_exists(uuid) TO anon, authenticated, service_role;
  `);

  console.log('Updating public.payments RLS policies...');
  await client.query(`
    -- Allow any user (anon or authenticated) to submit payment proof for an existing order
    DROP POLICY IF EXISTS "Customers can submit payment proof" ON public.payments;
    CREATE POLICY "Customers can submit payment proof"
      ON public.payments FOR INSERT
      TO anon, authenticated
      WITH CHECK (public.order_exists(payments.order_id));

    -- Allow admins to view all payments, and customers to view payments for their orders
    DROP POLICY IF EXISTS "Users can view payments for their orders" ON public.payments;
    CREATE POLICY "Users can view payments for their orders"
      ON public.payments FOR SELECT
      TO anon, authenticated
      USING (
        public.is_admin()
        OR EXISTS (
          SELECT 1 FROM public.orders
          WHERE orders.id = payments.order_id
          AND (orders.customer_id = auth.uid() OR orders.customer_id IS NULL)
        )
      );

    -- Admins can update/verify/reject payments
    DROP POLICY IF EXISTS "Admins can verify/update payments" ON public.payments;
    CREATE POLICY "Admins can verify/update payments"
      ON public.payments FOR UPDATE
      TO authenticated
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  `);

  console.log('Updating public.orders RLS policies...');
  await client.query(`
    -- Customers can view their own orders or guest orders (or admin all)
    DROP POLICY IF EXISTS "Customers can view their own orders" ON public.orders;
    CREATE POLICY "Customers can view their own orders"
      ON public.orders FOR SELECT
      TO anon, authenticated
      USING (
        public.is_admin()
        OR customer_id = auth.uid()
        OR customer_id IS NULL
      );

    -- Admins can update orders
    DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
    CREATE POLICY "Admins can update orders"
      ON public.orders FOR UPDATE
      TO authenticated
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  `);

  console.log('Updating public.order_items RLS policies...');
  await client.query(`
    DROP POLICY IF EXISTS "Users can view items of accessible orders" ON public.order_items;
    CREATE POLICY "Users can view items of accessible orders"
      ON public.order_items FOR SELECT
      TO anon, authenticated
      USING (
        public.is_admin()
        OR EXISTS (
          SELECT 1 FROM public.orders
          WHERE orders.id = order_items.order_id
          AND (orders.customer_id = auth.uid() OR orders.customer_id IS NULL)
        )
      );
  `);

  console.log('✓ Successfully updated RLS policies.');
  await client.end();
}

run().catch(console.error);

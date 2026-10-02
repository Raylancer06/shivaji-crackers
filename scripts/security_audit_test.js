const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jdaqvsgbchcljcwabiqy.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD || process.env.PGPASSWORD;

async function main() {
  console.log('====================================================');
  console.log('SIVAJI FIRECRACKER — AUTOMATED SECURITY AUDIT SUITE');
  console.log('====================================================\n');

  const results = [];

  // 1. Direct PostgreSQL Verification
  const pgClient = new Client({
    host: process.env.SUPABASE_DB_HOST || 'db.jdaqvsgbchcljcwabiqy.supabase.co',
    port: parseInt(process.env.SUPABASE_DB_PORT || '5432', 10),
    database: process.env.SUPABASE_DB_NAME || 'postgres',
    user: process.env.SUPABASE_DB_USER || 'postgres',
    password: DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
  });
  await pgClient.connect();

  console.log('[+] Connected to Supabase PostgreSQL for policy audit.');

  // Check RLS on all public tables
  const rlsCheck = await pgClient.query(`
    SELECT tablename, rowsecurity
    FROM pg_tables
    WHERE schemaname = 'public';
  `);

  console.log('\n--- PUBLIC TABLES RLS STATUS ---');
  rlsCheck.rows.forEach(r => {
    console.log(`Table: ${r.tablename.padEnd(20)} | RLS Enabled: ${r.rowsecurity}`);
    results.push({
      test: `RLS Enabled on ${r.tablename}`,
      passed: r.rowsecurity === true,
      details: r.rowsecurity ? 'RLS is ACTIVE' : 'VULNERABILITY: RLS is DISABLED'
    });
  });

  // Check security definer search_path
  const secDefCheck = await pgClient.query(`
    SELECT proname, prosecdef, proconfig
    FROM pg_proc
    JOIN pg_namespace ON pg_namespace.oid = pg_proc.pronamespace
    WHERE nspname = 'public' AND prosecdef = true;
  `);

  console.log('\n--- SECURITY DEFINER FUNCTIONS SEARCH_PATH ---');
  secDefCheck.rows.forEach(r => {
    const hasSearchPath = r.proconfig && r.proconfig.some(c => c.startsWith('search_path='));
    console.log(`Function: ${r.proname.padEnd(25)} | Search Path Set: ${hasSearchPath}`);
    results.push({
      test: `search_path pinned on ${r.proname}`,
      passed: hasSearchPath,
      details: hasSearchPath ? 'search_path pinned' : 'search_path not pinned (remediation recommended)'
    });
  });

  // 2. Test Customer Authentication & Role Escalation via Supabase Client
  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Test Direct INSERT on public.orders from anon client
  console.log('\n--- TESTING DIRECT INSERT ON public.orders ---');
  const directOrderTest = await anonClient
    .from('orders')
    .insert({
      order_number: 'TEST-HACK-001',
      customer_name: 'Attacker',
      customer_phone: '9999999999',
      delivery_address: 'Hacked',
      subtotal: 10,
      discount: 0,
      shipping_charge: 0,
      final_total: 10,
      status: 'confirmed',
      payment_status: 'verified',
    });

  if (directOrderTest.error) {
    console.log(`[PASS] Direct order insert rejected: ${directOrderTest.error.message}`);
    results.push({
      test: 'Direct INSERT bypass on public.orders',
      passed: true,
      details: `Rejected with code: ${directOrderTest.error.code}`
    });
  } else {
    console.log('[FAIL] VULNERABILITY: Direct order insert SUCCEEDED without atomic validation!');
    results.push({
      test: 'Direct INSERT bypass on public.orders',
      passed: false,
      details: 'Attacker could insert orders directly bypassing atomic checks'
    });
    // Clean up test hack
    await pgClient.query("DELETE FROM public.orders WHERE order_number = 'TEST-HACK-001'");
  }

  // Test atomic order with negative quantity
  console.log('\n--- TESTING create_order_atomic WITH NEGATIVE QUANTITY ---');
  const negQtyTest = await anonClient.rpc('create_order_atomic', {
    order_payload: {
      customer_name: 'Test Attacker',
      customer_phone: '9999999999',
      delivery_address: 'Attack Street',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500034',
      items: [{ product_id: 'PROD-001', quantity: -5 }]
    }
  });

  if (negQtyTest.error) {
    console.log(`[PASS] Negative quantity rejected: ${negQtyTest.error.message}`);
    results.push({
      test: 'Negative quantity injection in create_order_atomic',
      passed: true,
      details: negQtyTest.error.message
    });
  } else {
    console.log('[FAIL] VULNERABILITY: Negative quantity order accepted!');
    results.push({
      test: 'Negative quantity injection in create_order_atomic',
      passed: false,
      details: 'Negative quantity was accepted'
    });
  }

  // Test atomic order with subtotal below minimum cart
  console.log('\n--- TESTING create_order_atomic BELOW MINIMUM CART VALUE ---');
  const minCartTest = await anonClient.rpc('create_order_atomic', {
    order_payload: {
      customer_name: 'Test Attacker',
      customer_phone: '9999999999',
      delivery_address: 'Attack Street',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500034',
      items: [{ product_id: 'PROD-001', quantity: 1 }] // PROD-001 is small (< ₹2000)
    }
  });

  if (minCartTest.error) {
    console.log(`[PASS] Minimum cart bypass rejected: ${minCartTest.error.message}`);
    results.push({
      test: 'Minimum cart value bypass in create_order_atomic',
      passed: true,
      details: minCartTest.error.message
    });
  } else {
    console.log('[FAIL] VULNERABILITY: Order below minimum cart value was accepted!');
    results.push({
      test: 'Minimum cart value bypass in create_order_atomic',
      passed: false,
      details: 'Subtotal check failed'
    });
  }

  // Test Admin settings update from unauthenticated client
  console.log('\n--- TESTING UNAUTHENTICATED SETTINGS MUTATION ---');
  const settingsMutationTest = await anonClient
    .from('site_settings')
    .update({ value: '0' })
    .eq('key', 'minimum_cart_value')
    .select();

  if (settingsMutationTest.error) {
    console.log(`[PASS] Unauthenticated settings update rejected: ${settingsMutationTest.error.message}`);
    results.push({
      test: 'Unauthenticated site_settings update',
      passed: true,
      details: settingsMutationTest.error.message
    });
  } else {
    const countModified = settingsMutationTest.data ? settingsMutationTest.data.length : 0;
    if (countModified === 0) {
      console.log('[PASS] Unauthenticated settings update blocked: 0 rows modified (RLS enforced)');
      results.push({
        test: 'Unauthenticated site_settings update',
        passed: true,
        details: '0 rows updated due to RLS'
      });
    } else {
      console.log('[FAIL] VULNERABILITY: Settings update succeeded without admin privileges!');
      results.push({
        test: 'Unauthenticated site_settings update',
        passed: false,
        details: 'Anon user updated site settings'
      });
    }
  }

  // Test Unauthenticated Payment Verification
  console.log('\n--- TESTING UNAUTHENTICATED PAYMENT VERIFICATION ---');
  const payVerifyTest = await anonClient
    .from('payments')
    .update({ status: 'verified' })
    .eq('status', 'submitted');

  if (payVerifyTest.error) {
    console.log(`[PASS] Unauthenticated payment verification rejected: ${payVerifyTest.error.message}`);
    results.push({
      test: 'Unauthenticated payment status verification',
      passed: true,
      details: payVerifyTest.error.message
    });
  } else {
    // Check if any rows were modified
    const countModified = payVerifyTest.data ? payVerifyTest.data.length : 0;
    if (countModified === 0) {
      console.log('[PASS] Unauthenticated payment verification updated 0 rows (RLS blocked)');
      results.push({
        test: 'Unauthenticated payment status verification',
        passed: true,
        details: '0 rows updated due to RLS'
      });
    } else {
      console.log('[FAIL] VULNERABILITY: Anon user modified payment status!');
      results.push({
        test: 'Unauthenticated payment status verification',
        passed: false,
        details: `${countModified} rows were updated by anon`
      });
    }
  }

  // Test Storage Download from private bucket
  console.log('\n--- TESTING STORAGE PRIVATE BUCKET ACCESS ---');
  const storageDownloadTest = await anonClient.storage
    .from('payment-screenshots')
    .download('guest/fake_file.png');

  if (storageDownloadTest.error) {
    console.log(`[PASS] Private storage download denied: ${storageDownloadTest.error.message}`);
    results.push({
      test: 'Private storage download without authorization',
      passed: true,
      details: storageDownloadTest.error.message
    });
  } else {
    console.log('[FAIL] VULNERABILITY: Private file download permitted without authentication!');
    results.push({
      test: 'Private storage download without authorization',
      passed: false,
      details: 'Private file downloaded'
    });
  }

  // --- CUSTOMER DATA ISOLATION (IDOR / BOLA) TESTS ---
  console.log('\n--- TESTING CUSTOMER DATA ISOLATION & DUMP PROTECTION ---');

  // Test 1: Unauthenticated SELECT on orders table
  const anonOrdersSelect = await anonClient.from('orders').select('*');
  const anonOrdersCount = anonOrdersSelect.data ? anonOrdersSelect.data.length : 0;
  if (anonOrdersCount === 0) {
    console.log('[PASS] Orders table dump prevented: Anon client retrieved 0 orders.');
    results.push({
      test: 'IDOR Protection: Bulk orders dump blocked for anon/unauthenticated',
      passed: true,
      details: '0 rows returned'
    });
  } else {
    console.log(`[FAIL] VULNERABILITY: Anon client dumped ${anonOrdersCount} orders!`);
    results.push({
      test: 'IDOR Protection: Bulk orders dump blocked for anon/unauthenticated',
      passed: false,
      details: `${anonOrdersCount} orders exposed`
    });
  }

  // Test 2: Unauthenticated SELECT on payments table
  const anonPaymentsSelect = await anonClient.from('payments').select('*');
  const anonPaymentsCount = anonPaymentsSelect.data ? anonPaymentsSelect.data.length : 0;
  if (anonPaymentsCount === 0) {
    console.log('[PASS] Payments table dump prevented: Anon client retrieved 0 payments.');
    results.push({
      test: 'Financial Privacy: Bulk payments dump blocked for anon/unauthenticated',
      passed: true,
      details: '0 rows returned'
    });
  } else {
    console.log(`[FAIL] VULNERABILITY: Anon client dumped ${anonPaymentsCount} payments!`);
    results.push({
      test: 'Financial Privacy: Bulk payments dump blocked for anon/unauthenticated',
      passed: false,
      details: `${anonPaymentsCount} payments exposed`
    });
  }

  // Test 3: Unauthenticated SELECT on customer_profiles
  const anonProfilesSelect = await anonClient.from('customer_profiles').select('*');
  const anonProfilesCount = anonProfilesSelect.data ? anonProfilesSelect.data.length : 0;
  if (anonProfilesCount === 0) {
    console.log('[PASS] Customer profiles dump prevented: Anon client retrieved 0 profiles.');
    results.push({
      test: 'Customer PII Privacy: Profile dump blocked for anon/unauthenticated',
      passed: true,
      details: '0 rows returned'
    });
  } else {
    console.log(`[FAIL] VULNERABILITY: Anon client dumped ${anonProfilesCount} customer profiles!`);
    results.push({
      test: 'Customer PII Privacy: Profile dump blocked for anon/unauthenticated',
      passed: false,
      details: `${anonProfilesCount} profiles exposed`
    });
  }

  // Test 4: Unauthenticated SELECT on addresses
  const anonAddressesSelect = await anonClient.from('addresses').select('*');
  const anonAddressesCount = anonAddressesSelect.data ? anonAddressesSelect.data.length : 0;
  if (anonAddressesCount === 0) {
    console.log('[PASS] Addresses table dump prevented: Anon client retrieved 0 addresses.');
    results.push({
      test: 'Address Privacy: Bulk address dump blocked for anon/unauthenticated',
      passed: true,
      details: '0 rows returned'
    });
  } else {
    console.log(`[FAIL] VULNERABILITY: Anon client dumped ${anonAddressesCount} addresses!`);
    results.push({
      test: 'Address Privacy: Bulk address dump blocked for anon/unauthenticated',
      passed: false,
      details: `${anonAddressesCount} addresses exposed`
    });
  }

  // Test 5: Role Escalation Attack Prevention
  console.log('\n--- TESTING ROLE ESCALATION ATTACK PREVENTION ---');
  const roleEscalationTest = await anonClient
    .from('customer_profiles')
    .update({ role: 'admin' })
    .neq('role', 'admin')
    .select();

  const escalatedCount = roleEscalationTest.data ? roleEscalationTest.data.length : 0;
  if (escalatedCount === 0) {
    console.log('[PASS] Role escalation prevented: 0 profiles escalated.');
    results.push({
      test: 'Privilege Escalation: Unauthorized role modification to admin blocked',
      passed: true,
      details: '0 rows modified'
    });
  } else {
    console.log(`[FAIL] VULNERABILITY: ${escalatedCount} profiles escalated to admin!`);
    results.push({
      test: 'Privilege Escalation: Unauthorized role modification to admin blocked',
      passed: false,
      details: `${escalatedCount} profiles modified to admin`
    });
  }

  // Test 6: Secure Order Confirmation RPC
  console.log('\n--- TESTING SECURE ORDER CONFIRMATION RPC ---');
  // First test nonexistent order
  const nonExistentOrder = await anonClient.rpc('get_order_confirmation', { p_order_number: 'NON-EXISTENT-ORDER' });
  if (nonExistentOrder.data === null) {
    console.log('[PASS] Nonexistent order confirmation returned null as expected.');
    results.push({
      test: 'Secure RPC: Nonexistent order returns null safely',
      passed: true,
      details: 'Returned null without error'
    });
  } else {
    console.log('[FAIL] Nonexistent order lookup returned unexpected data:', nonExistentOrder);
    results.push({
      test: 'Secure RPC: Nonexistent order returns null safely',
      passed: false,
      details: 'Did not return null'
    });
  }

  // Place a valid test order and confirm retrieval
  console.log('Placing a valid test order to test end-to-end confirmation...');
  // Find a product with enough stock and price
  const prodCheck = await pgClient.query("SELECT id, sku, selling_price, stock_quantity FROM public.products WHERE is_active = true AND stock_quantity >= 10 AND (selling_price * stock_quantity) >= 2500 ORDER BY selling_price DESC LIMIT 1;");
  if (prodCheck.rows.length > 0) {
    const prod = prodCheck.rows[0];
    const qty = Math.ceil(2100 / Number(prod.selling_price));
    
    const validOrder = await anonClient.rpc('create_order_atomic', {
      order_payload: {
        customer_name: 'Security QA Test',
        customer_phone: '9876543210',
        delivery_address: 'Banjara Hills, Hyderabad',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500034',
        items: [{ product_id: prod.id, quantity: qty }]
      }
    });

    if (validOrder.data && validOrder.data.order_number) {
      console.log(`[+] Order created successfully: ${validOrder.data.order_number}`);
      
      // Fetch via get_order_confirmation
      const fetchedOrder = await anonClient.rpc('get_order_confirmation', { p_order_number: validOrder.data.order_number });
      if (fetchedOrder.data && fetchedOrder.data.order_number === validOrder.data.order_number) {
        console.log('[PASS] Legitimate order confirmation retrieved successfully with items.');
        results.push({
          test: 'Order Confirmation Flow: Valid order retrieved via secure RPC',
          passed: true,
          details: `Order ${validOrder.data.order_number} retrieved with ${fetchedOrder.data.order_items.length} items`
        });
      } else {
        console.log('[FAIL] Could not retrieve placed order via get_order_confirmation:', fetchedOrder.error);
        results.push({
          test: 'Order Confirmation Flow: Valid order retrieved via secure RPC',
          passed: false,
          details: fetchedOrder.error ? fetchedOrder.error.message : 'Order not returned'
        });
      }

      // Cleanup test order
      await pgClient.query("DELETE FROM public.orders WHERE id = $1;", [validOrder.data.id]);
      await pgClient.query("UPDATE public.products SET stock_quantity = stock_quantity + $1 WHERE id = $2;", [qty, prod.id]);
      console.log('[+] Cleaned up test order and restored stock.');
    } else {
      console.log('[FAIL] Could not create valid test order:', validOrder.error);
    }
  }

  await pgClient.end();

  console.log('\n====================================================');
  console.log('SUMMARY OF DISCOVERY AUDIT TESTS:');
  console.log('====================================================');
  results.forEach(r => {
    console.log(`[${r.passed ? 'PASS' : 'FAIL'}] ${r.test}: ${r.details}`);
  });
}

main().catch(console.error);

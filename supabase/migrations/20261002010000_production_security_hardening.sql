
-- ====================================================================
-- SIVAJI FIRECRACKER PRODUCTION SECURITY HARDENING MIGRATION
-- ====================================================================

-- 1. Enable RLS on inventory_logs
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view inventory logs" ON public.inventory_logs;
CREATE POLICY "Admins can view inventory logs"
  ON public.inventory_logs FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage inventory logs" ON public.inventory_logs;
CREATE POLICY "Admins can manage inventory logs"
  ON public.inventory_logs FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 2. Pin search_path on public.is_admin()
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.customer_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;

-- 3. Pin search_path on public.order_exists()
CREATE OR REPLACE FUNCTION public.order_exists(p_order_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN EXISTS(SELECT 1 FROM public.orders WHERE id = p_order_id);
END;
$$;
GRANT EXECUTE ON FUNCTION public.order_exists(uuid) TO anon, authenticated, service_role;

-- 4. Pin search_path and eliminate role escalation on public.handle_new_user()
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.customer_profiles (id, full_name, email, mobile, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'phone', new.raw_user_meta_data->>'mobile', NULL),
    'customer' -- IMMUTABLE: untrusted role metadata ignored
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    mobile = COALESCE(EXCLUDED.mobile, public.customer_profiles.mobile);
  RETURN new;
END;
$$;

-- 5. Role modification protection trigger on customer_profiles
CREATE OR REPLACE FUNCTION public.protect_customer_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT public.is_admin() THEN
      RAISE EXCEPTION 'Access Denied: Customer roles can only be modified by administrators.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_customer_role ON public.customer_profiles;
CREATE TRIGGER trg_protect_customer_role
BEFORE UPDATE ON public.customer_profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_customer_role_escalation();

-- 6. Pin search_path on public.handle_payment_lifecycle()
CREATE OR REPLACE FUNCTION public.handle_payment_lifecycle()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
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
$$;

DROP TRIGGER IF EXISTS trg_payment_lifecycle ON public.payments;
CREATE TRIGGER trg_payment_lifecycle
AFTER INSERT OR UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.handle_payment_lifecycle();

-- 7. Pin search_path and harden customer_id on create_order_atomic()
CREATE OR REPLACE FUNCTION public.create_order_atomic(order_payload JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
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
    v_new_stock INTEGER;
BEGIN
    -- Secure customer identification: Authenticated user id is prioritized
    IF auth.uid() IS NOT NULL THEN
        v_customer_id := auth.uid();
    ELSE
        v_customer_id := NULL;
    END IF;

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
        RAISE EXCEPTION 'Customer name is required.';
    END IF;
    IF v_customer_phone IS NULL OR LENGTH(v_customer_phone) < 10 THEN
        RAISE EXCEPTION 'Valid 10-digit mobile number is required.';
    END IF;
    IF v_delivery_address IS NULL OR v_delivery_address = '' THEN
        RAISE EXCEPTION 'Delivery address is required.';
    END IF;
    IF v_pincode IS NULL OR LENGTH(v_pincode) != 6 THEN
        RAISE EXCEPTION 'Valid 6-digit pincode is required.';
    END IF;
    IF v_items IS NULL OR jsonb_array_length(v_items) = 0 THEN
        RAISE EXCEPTION 'Order must contain at least one item.';
    END IF;

    -- Fetch dynamic site settings
    SELECT COALESCE(NULLIF(value, '')::NUMERIC, 2000) INTO v_min_cart
    FROM public.site_settings WHERE key = 'minimum_cart_value';
    IF v_min_cart IS NULL THEN v_min_cart := 2000; END IF;

    SELECT COALESCE(NULLIF(value, '')::NUMERIC, 0) INTO v_base_shipping
    FROM public.site_settings WHERE key = 'shipping_charge';
    IF v_base_shipping IS NULL THEN v_base_shipping := 0; END IF;

    SELECT (LOWER(TRIM(value)) = 'true') INTO v_free_ship_enabled
    FROM public.site_settings WHERE key = 'free_shipping_enabled';
    IF v_free_ship_enabled IS NULL THEN v_free_ship_enabled := false; END IF;

    SELECT COALESCE(NULLIF(value, '')::NUMERIC, 0) INTO v_free_ship_threshold
    FROM public.site_settings WHERE key = 'free_shipping_threshold';
    IF v_free_ship_threshold IS NULL THEN v_free_ship_threshold := 0; END IF;

    -- Validate items & compute server-side totals
    FOR v_item IN SELECT * FROM jsonb_array_elements(v_items)
    LOOP
        v_product_id := v_item->>'product_id';
        v_item_qty := (v_item->>'quantity')::INTEGER;

        IF v_item_qty IS NULL OR v_item_qty <= 0 THEN
            RAISE EXCEPTION 'Invalid quantity for product %', v_product_id;
        END IF;

        SELECT id, name, sku, mrp, selling_price, stock_quantity, is_active
        INTO v_product
        FROM public.products
        WHERE id::TEXT = v_product_id OR sku = v_product_id
        FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Product % does not exist.', v_product_id;
        END IF;

        IF NOT v_product.is_active THEN
            RAISE EXCEPTION 'Product % is not available for purchase.', v_product.name;
        END IF;

        IF v_product.stock_quantity < v_item_qty THEN
            RAISE EXCEPTION 'Insufficient stock for %. Available: %, Requested: %',
                v_product.name, v_product.stock_quantity, v_item_qty;
        END IF;

        v_total_mrp := v_total_mrp + (v_product.mrp * v_item_qty);
        v_subtotal := v_subtotal + (v_product.selling_price * v_item_qty);
    END LOOP;

    -- Strict validation against minimum cart value
    IF v_subtotal < v_min_cart THEN
        RAISE EXCEPTION 'Minimum order value is ₹%. Current subtotal is ₹%. Please add more items to proceed.',
            TO_CHAR(v_min_cart, 'FM999999990.00'), TO_CHAR(v_subtotal, 'FM999999990.00');
    END IF;

    -- Shipping calculation
    IF v_free_ship_enabled AND v_subtotal >= v_free_ship_threshold THEN
        v_shipping := 0;
    ELSE
        v_shipping := v_base_shipping;
    END IF;

    v_discount := GREATEST(v_total_mrp - v_subtotal, 0);
    v_final_total := v_subtotal + v_shipping;

    -- Generate Unique Order Number
    v_random_num := FLOOR(100000 + RANDOM() * 900000);
    v_order_number := 'SC-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || v_random_num::TEXT;

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
        notes,
        subtotal,
        discount,
        shipping_charge,
        final_total,
        status,
        payment_status
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
        v_notes,
        v_subtotal,
        v_discount,
        v_shipping,
        v_final_total,
        'pending_verification',
        'pending'
    ) RETURNING id INTO v_order_id;

    -- Insert order items and deduct inventory
    FOR v_item IN SELECT * FROM jsonb_array_elements(v_items)
    LOOP
        v_product_id := v_item->>'product_id';
        v_item_qty := (v_item->>'quantity')::INTEGER;

        SELECT id, name, sku, mrp, selling_price, box_quantity, quantity_unit
        INTO v_product
        FROM public.products
        WHERE id::TEXT = v_product_id OR sku = v_product_id;

        INSERT INTO public.order_items (
            order_id,
            product_id,
            product_name,
            sku,
            box_quantity,
            quantity_unit,
            mrp,
            unit_price,
            quantity,
            line_total
        ) VALUES (
            v_order_id,
            v_product.id,
            v_product.name,
            v_product.sku,
            COALESCE(v_product.box_quantity, 1),
            COALESCE(v_product.quantity_unit, 'Pieces'),
            v_product.mrp,
            v_product.selling_price,
            v_item_qty,
            (v_product.selling_price * v_item_qty)
        );

        UPDATE public.products
        SET stock_quantity = stock_quantity - v_item_qty,
            updated_at = NOW()
        WHERE id = v_product.id
        RETURNING stock_quantity INTO v_new_stock;

        INSERT INTO public.inventory_logs (
            product_id,
            quantity_change,
            new_quantity,
            reason,
            reference_order_id
        ) VALUES (
            v_product.id,
            -v_item_qty,
            v_new_stock,
            'Order ' || v_order_number,
            v_order_id
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
$$;
GRANT EXECUTE ON FUNCTION public.create_order_atomic(JSONB) TO anon, authenticated, service_role;

-- 8. Secure RPC for Single Order Confirmation
CREATE OR REPLACE FUNCTION public.get_order_confirmation(p_order_number TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_order RECORD;
  v_items JSONB;
  v_payment RECORD;
BEGIN
  SELECT * INTO v_order
  FROM public.orders
  WHERE order_number = p_order_number OR id::text = p_order_number;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  -- Customer isolation:
  IF v_order.customer_id IS NOT NULL THEN
    IF auth.uid() IS NULL OR (auth.uid() != v_order.customer_id AND NOT public.is_admin()) THEN
      RAISE EXCEPTION 'Access denied: You do not have permission to view this order.';
    END IF;
  END IF;

  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', id,
      'product_id', product_id,
      'product_name', product_name,
      'sku', sku,
      'box_quantity', box_quantity,
      'quantity_unit', quantity_unit,
      'mrp', mrp,
      'unit_price', unit_price,
      'quantity', quantity,
      'line_total', line_total
    )
  ), '[]'::jsonb)
  INTO v_items
  FROM public.order_items
  WHERE order_id = v_order.id;

  SELECT * INTO v_payment
  FROM public.payments
  WHERE order_id = v_order.id
  ORDER BY created_at DESC
  LIMIT 1;

  RETURN jsonb_build_object(
    'id', v_order.id,
    'order_number', v_order.order_number,
    'customer_name', v_order.customer_name,
    'customer_phone', v_order.customer_phone,
    'customer_email', v_order.customer_email,
    'delivery_address', v_order.delivery_address,
    'city', v_order.city,
    'state', v_order.state,
    'pincode', v_order.pincode,
    'landmark', v_order.landmark,
    'notes', v_order.notes,
    'subtotal', v_order.subtotal,
    'discount', v_order.discount,
    'shipping_charge', v_order.shipping_charge,
    'final_total', v_order.final_total,
    'status', v_order.status,
    'payment_status', v_order.payment_status,
    'created_at', v_order.created_at,
    'order_items', v_items,
    'paymentConfirmation', CASE 
      WHEN v_payment.id IS NOT NULL THEN
        jsonb_build_object(
          'id', v_payment.id,
          'utr_number', v_payment.utr_transaction_id,
          'screenshot_url', v_payment.screenshot_storage_path,
          'notes', v_payment.notes,
          'verified', (v_payment.status = 'verified')
        )
      ELSE NULL
    END
  );
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_order_confirmation(TEXT) TO anon, authenticated, service_role;

-- 9. Tighten Table RLS Policies on orders, order_items, payments, site_settings
DROP POLICY IF EXISTS "Customers can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Customers can view own orders" ON public.orders;
CREATE POLICY "Customers can view own orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (
    public.is_admin()
    OR (auth.uid() IS NOT NULL AND customer_id = auth.uid())
  );

DROP POLICY IF EXISTS "Customers or Guests can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Admin only direct order insert" ON public.orders;
CREATE POLICY "Admin only direct order insert"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Users can view items of accessible orders" ON public.order_items;
DROP POLICY IF EXISTS "Users can view order items for their orders" ON public.order_items;
CREATE POLICY "Users can view order items for their orders"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.customer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Insert order items" ON public.order_items;
DROP POLICY IF EXISTS "Admin only direct order items insert" ON public.order_items;
CREATE POLICY "Admin only direct order items insert"
  ON public.order_items FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Users can view payments for their orders" ON public.payments;
CREATE POLICY "Users can view payments for their orders"
  ON public.payments FOR SELECT
  TO authenticated
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = payments.order_id
      AND orders.customer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Customers can submit payment proof" ON public.payments;
CREATE POLICY "Customers can submit payment proof"
  ON public.payments FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    public.order_exists(payments.order_id)
    AND (payments.status IS NULL OR payments.status = 'submitted')
  );

DROP POLICY IF EXISTS "Admins can verify/update payments" ON public.payments;
CREATE POLICY "Admins can verify/update payments"
  ON public.payments FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
CREATE POLICY "Public can view site settings"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;
CREATE POLICY "Admins can manage site settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

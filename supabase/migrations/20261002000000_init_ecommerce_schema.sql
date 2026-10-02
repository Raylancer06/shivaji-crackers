-- ====================================================================
-- SIVAJI FIRECRACKER — SUPABASE ECOMMERCE SCHEMA & RLS POLICIES
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Customer Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.customer_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    mobile TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Customer Saved Addresses Table
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customer_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Hyderabad',
    state TEXT NOT NULL DEFAULT 'Telangana',
    pincode TEXT NOT NULL,
    landmark TEXT,
    tag TEXT NOT NULL DEFAULT 'Home',
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    icon TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT,
    category_slug TEXT NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    subtitle TEXT,
    description TEXT,
    specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
    box_quantity INTEGER NOT NULL DEFAULT 1 CHECK (box_quantity > 0),
    quantity_unit TEXT NOT NULL DEFAULT 'Pieces',
    pieces TEXT,
    sound_level TEXT NOT NULL DEFAULT 'Festival Sound',
    mrp NUMERIC(10,2) NOT NULL CHECK (mrp >= 0),
    selling_price NUMERIC(10,2) NOT NULL CHECK (selling_price >= 0 AND selling_price <= mrp),
    stock_quantity INTEGER NOT NULL DEFAULT 100 CHECK (stock_quantity >= 0),
    low_stock_threshold INTEGER NOT NULL DEFAULT 10 CHECK (low_stock_threshold >= 0),
    image_url TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_bestseller BOOLEAN NOT NULL DEFAULT false,
    badge TEXT,
    green_certified BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Product Images Table (Multi-image Gallery)
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    alt_text TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Inventory Logs Table
CREATE TABLE IF NOT EXISTS public.inventory_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity_change INTEGER NOT NULL,
    new_quantity INTEGER NOT NULL,
    reason TEXT NOT NULL,
    reference_order_id UUID,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.customer_profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    delivery_address TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Hyderabad',
    state TEXT NOT NULL DEFAULT 'Telangana',
    pincode TEXT NOT NULL,
    landmark TEXT,
    address_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    subtotal NUMERIC(12,2) NOT NULL CHECK (subtotal >= 0),
    discount NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
    shipping_charge NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (shipping_charge >= 0),
    final_total NUMERIC(12,2) NOT NULL CHECK (final_total >= 0),
    status TEXT NOT NULL DEFAULT 'pending_verification' CHECK (status IN ('pending_verification', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'submitted', 'verified', 'rejected')),
    notes TEXT,
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    sku TEXT NOT NULL,
    box_quantity INTEGER NOT NULL DEFAULT 1,
    quantity_unit TEXT NOT NULL DEFAULT 'Pieces',
    mrp NUMERIC(10,2) NOT NULL CHECK (mrp >= 0),
    unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
    discount NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    line_total NUMERIC(12,2) NOT NULL CHECK (line_total >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    payment_method TEXT NOT NULL DEFAULT 'UPI',
    amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
    utr_transaction_id TEXT NOT NULL,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_time TIME NOT NULL DEFAULT CURRENT_TIME,
    screenshot_storage_path TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'verified', 'rejected')),
    verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ====================================================================
-- INDEXES FOR HIGH-PERFORMANCE QUERIES
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_slug);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);

CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_addresses_customer_id ON public.addresses(customer_id);

-- ====================================================================
-- SECURITY DEFINER HELPER: is_admin()
-- ====================================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.customer_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================================================
-- AUTH TRIGGER: Automatically populate customer_profiles on signup
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.customer_profiles (id, full_name, email, mobile, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'phone', new.raw_user_meta_data->>'mobile', NULL),
    COALESCE(new.raw_user_meta_data->>'role', 'customer')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    mobile = COALESCE(EXCLUDED.mobile, public.customer_profiles.mobile);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- 1. Customer Profiles RLS
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON public.customer_profiles;
CREATE POLICY "Users can read own profile"
  ON public.customer_profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON public.customer_profiles;
CREATE POLICY "Users can update own profile"
  ON public.customer_profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.customer_profiles;
CREATE POLICY "Admins can manage all profiles"
  ON public.customer_profiles FOR ALL
  USING (public.is_admin());

-- 2. Addresses RLS
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Customers can access own addresses" ON public.addresses;
CREATE POLICY "Customers can access own addresses"
  ON public.addresses FOR ALL
  USING (auth.uid() = customer_id OR public.is_admin())
  WITH CHECK (auth.uid() = customer_id OR public.is_admin());

-- 3. Categories RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;
CREATE POLICY "Public can view active categories"
  ON public.categories FOR SELECT
  USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories"
  ON public.categories FOR ALL
  USING (public.is_admin());

-- 4. Products RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products"
  ON public.products FOR SELECT
  USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL
  USING (public.is_admin());

-- 5. Product Images RLS
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view product images" ON public.product_images;
CREATE POLICY "Public can view product images"
  ON public.product_images FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage product images" ON public.product_images;
CREATE POLICY "Admins can manage product images"
  ON public.product_images FOR ALL
  USING (public.is_admin());

-- 6. Orders RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Customers can view own orders" ON public.orders;
CREATE POLICY "Customers can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = customer_id OR public.is_admin());

DROP POLICY IF EXISTS "Customers or Guests can insert orders" ON public.orders;
CREATE POLICY "Customers or Guests can insert orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = customer_id OR customer_id IS NULL);

DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  USING (public.is_admin());

-- 7. Order Items RLS
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view order items for their orders" ON public.order_items;
CREATE POLICY "Users can view order items for their orders"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND (orders.customer_id = auth.uid() OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "Insert order items" ON public.order_items;
CREATE POLICY "Insert order items"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND (orders.customer_id = auth.uid() OR orders.customer_id IS NULL)
    )
  );

-- 8. Payments RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view payments for their orders" ON public.payments;
CREATE POLICY "Users can view payments for their orders"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = payments.order_id
      AND (orders.customer_id = auth.uid() OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "Customers can submit payment proof" ON public.payments;
CREATE POLICY "Customers can submit payment proof"
  ON public.payments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = payments.order_id
      AND (orders.customer_id = auth.uid() OR orders.customer_id IS NULL)
    )
  );

DROP POLICY IF EXISTS "Admins can verify/update payments" ON public.payments;
CREATE POLICY "Admins can verify/update payments"
  ON public.payments FOR UPDATE
  USING (public.is_admin());

-- 9. Site Settings RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
CREATE POLICY "Public can view site settings"
  ON public.site_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;
CREATE POLICY "Admins can manage site settings"
  ON public.site_settings FOR ALL
  USING (public.is_admin());

-- ====================================================================
-- ATOMIC ORDER CREATION STORED PROCEDURE: create_order_atomic
-- ====================================================================
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

    -- Load minimum cart setting
    SELECT COALESCE(NULLIF(value, '')::NUMERIC, 2000) INTO v_min_cart
    FROM public.site_settings WHERE key = 'minimum_cart_value';

    -- First Pass: Lock product rows, validate stock, compute authoritative totals
    FOR v_item IN SELECT * FROM jsonb_array_elements(v_items)
    LOOP
        v_product_id := v_item->>'product_id';
        v_item_qty := COALESCE((v_item->>'quantity')::INTEGER, 1);

        IF v_item_qty <= 0 THEN
            RAISE EXCEPTION 'Invalid quantity for product %', v_product_id;
        END IF;

        -- Lock row FOR UPDATE to prevent race conditions & overselling
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

    -- Second Pass: Insert Order Items, Decrement Stock & Insert Inventory Logs
    FOR v_item IN SELECT * FROM jsonb_array_elements(v_items)
    LOOP
        v_product_id := v_item->>'product_id';
        v_item_qty := COALESCE((v_item->>'quantity')::INTEGER, 1);

        SELECT * INTO v_product
        FROM public.products
        WHERE (id::text = v_product_id OR sku = v_product_id);

        INSERT INTO public.order_items (
            order_id,
            product_id,
            product_name,
            sku,
            box_quantity,
            quantity_unit,
            mrp,
            unit_price,
            discount,
            quantity,
            line_total
        ) VALUES (
            v_order_id,
            v_product.id,
            v_product.name,
            v_product.sku,
            v_product.box_quantity,
            v_product.quantity_unit,
            v_product.mrp,
            v_product.selling_price,
            (v_product.mrp - v_product.selling_price),
            v_item_qty,
            (v_product.selling_price * v_item_qty)
        );

        -- Decrement Stock atomically
        UPDATE public.products
        SET stock_quantity = stock_quantity - v_item_qty,
            updated_at = now()
        WHERE id = v_product.id;

        -- Log Inventory change
        INSERT INTO public.inventory_logs (
            product_id,
            quantity_change,
            new_quantity,
            reason,
            reference_order_id
        ) VALUES (
            v_product.id,
            -v_item_qty,
            v_product.stock_quantity - v_item_qty,
            'Order ' || v_order_number || ' Placement',
            v_order_id
        );
    END LOOP;

    -- Return JSON Order Confirmation
    RETURN jsonb_build_object(
        'id', v_order_id,
        'order_number', v_order_number,
        'total_mrp', v_total_mrp,
        'subtotal', v_subtotal,
        'discount', v_discount,
        'final_amount', v_final_total,
        'status', 'pending_verification',
        'payment_status', 'pending'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

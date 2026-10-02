import { supabase } from '@/lib/supabase/client';
import { Product, PRODUCTS, CATEGORIES } from '@/data/products';

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data: T;
  count?: number;
}

export interface StoreSettings {
  business_name: string;
  business_city: string;
  business_phone: string;
  business_email: string;
  minimum_cart_value: number;
  upi_id: string;
  upi_payee_name: string;
  currency_symbol: string;
  shipping_charge: number;
  free_shipping_enabled: boolean;
  free_shipping_threshold: number;
  budget_builder_enabled: boolean;
  budget_builder_badge: string;
  budget_builder_title: string;
  budget_builder_subtitle: string;
  budget_builder_description: string;
}

export interface BudgetPackage {
  id: string;
  name: string;
  subtitle: string;
  tag: string;
  budget: number;
  mrp: number;
  description: string;
  items_summary: string;
  item_skus: { sku: string; qty: number }[];
  sort_order: number;
  is_active: boolean;
}

export interface CustomerAddress {
  id: string;
  customer_id?: string;
  user_id?: string;
  tag?: string;
  address_type?: string;
  recipient_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  is_default: boolean;
  created_at?: string;
}

export interface OrderPayload {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address: string;
  city?: string;
  state?: string;
  pincode?: string;
  landmark?: string;
  customer_notes?: string;
  user_id?: string | number;
  items: Array<{
    product_id: string;
    quantity: number;
  }>;
}

export interface OrderResponseData {
  id: string;
  order_number: string;
  total_mrp: number;
  total_selling_price: number;
  discount_amount: number;
  final_amount: number;
  status: string;
  upi_instructions: {
    upi_id: string;
    recipient_name: string;
    amount: number;
    admin_whatsapp: string;
  };
}

export interface PaymentConfirmResponseData {
  order_number: string;
  status: string;
  utr_number: string;
  screenshot_url?: string;
  admin_whatsapp_link: string;
  admin_phone: string;
}

function mapProduct(row: any): Product {
  const mrp = Number(row.mrp);
  const price = Number(row.selling_price);
  const discountPercent = mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;
  return {
    id: row.sku || row.id,
    name: row.name,
    subtitle: row.subtitle || 'Festive Celebration Cracker',
    category: row.category_slug || '',
    mrp: mrp,
    price: price,
    boxQuantity: row.box_quantity || 1,
    quantityUnit: row.quantity_unit || 'Pieces',
    pieces: row.pieces || `Box Contains: ${row.box_quantity || 1} ${row.quantity_unit || 'Pieces'}`,
    soundLevel: row.sound_level || 'Festival Sound',
    image: row.image_url,
    description: row.description || '',
    greenCertified: Boolean(row.green_certified),
    featured: Boolean(row.is_featured),
    badge: row.badge || (row.is_bestseller ? 'Bestseller' : undefined),
    discountPercent,
  };
}

function mapAddress(row: any): CustomerAddress {
  return {
    id: row.id,
    customer_id: row.customer_id,
    user_id: row.customer_id,
    tag: row.tag || 'Home',
    address_type: row.tag || 'Home',
    recipient_name: row.name,
    phone: row.mobile,
    address_line: row.address,
    city: row.city,
    state: row.state,
    pincode: row.pincode,
    landmark: row.landmark || '',
    is_default: Boolean(row.is_default),
    created_at: row.created_at,
  };
}

export const api = {
  // Store Settings (Minimum Cart Value, Business Details, UPI)
  async getSettings(): Promise<StoreSettings> {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value');

      if (error) throw error;

      const map: Record<string, string> = {};
      data?.forEach((row: any) => {
        map[row.key] = row.value;
      });

      return {
        business_name: map['business_name'] || 'Sivaji Firecracker',
        business_city: map['business_city'] || 'Hyderabad',
        business_phone: map['business_phone'] || '+91 83740 44445',
        business_email: map['business_email'] || 'orders@sivajifirecracker.com',
        minimum_cart_value: Number(map['minimum_cart_value']) || 2000,
        upi_id: map['upi_id'] || 'sivajiduddempudi422@axl',
        upi_payee_name: map['upi_payee_name'] || 'Sivaji Duddempudi',
        currency_symbol: map['currency_symbol'] || '₹',
        shipping_charge: Number(map['shipping_charge']) || 0,
        free_shipping_enabled: (map['free_shipping_enabled'] || '').toLowerCase() === 'true',
        free_shipping_threshold: Number(map['free_shipping_threshold']) || 0,
        budget_builder_enabled: (map['budget_builder_enabled'] || 'true').toLowerCase() !== 'false',
        budget_builder_badge: map['budget_builder_badge'] || 'Instant 1-Click Bundle Calculator',
        budget_builder_title: map['budget_builder_title'] || 'Smart Budget Builder For Families & Societies',
        budget_builder_subtitle: map['budget_builder_subtitle'] || 'Curated Diwali celebration bundles tailored for every budget',
        budget_builder_description: map['budget_builder_description'] || "Don't have time to pick 40 individual crackers? Select your celebration budget below. Our master packers have balanced sparklers, flower pots, and sky shots to give you the highest variety and savings.",
      };
    } catch (err) {
      console.warn('Supabase settings query error, falling back to defaults:', err);
      return {
        business_name: 'Sivaji Firecracker',
        business_city: 'Hyderabad',
        business_phone: '+91 83740 44445',
        business_email: 'orders@sivajifirecracker.com',
        minimum_cart_value: 2000,
        upi_id: 'sivajiduddempudi422@axl',
        upi_payee_name: 'Sivaji Duddempudi',
        currency_symbol: '₹',
        shipping_charge: 150,
        free_shipping_enabled: false,
        free_shipping_threshold: 5000,
        budget_builder_enabled: true,
        budget_builder_badge: 'Instant 1-Click Bundle Calculator',
        budget_builder_title: 'Smart Budget Builder For Families & Societies',
        budget_builder_subtitle: 'Curated Diwali celebration bundles tailored for every budget',
        budget_builder_description: "Don't have time to pick 40 individual crackers? Select your celebration budget below. Our master packers have balanced sparklers, flower pots, and sky shots to give you the highest variety and savings.",
      };
    }
  },

  // Budget Packages (Curated Diwali Bundles)
  async getBudgetPackages(): Promise<BudgetPackage[]> {
    try {
      const { data, error } = await supabase
        .from('budget_packages')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      if (!data || data.length === 0) return [];

      return data.map((row: any) => ({
        id: row.id,
        name: row.name,
        subtitle: row.subtitle || '',
        tag: row.tag || '',
        budget: Number(row.budget),
        mrp: Number(row.mrp),
        description: row.description || '',
        items_summary: row.items_summary || '',
        item_skus: Array.isArray(row.item_skus) ? row.item_skus : [],
        sort_order: Number(row.sort_order) || 1,
        is_active: Boolean(row.is_active),
      }));
    } catch (err) {
      console.warn('Failed to load budget packages from database:', err);
      return [];
    }
  },

  // Products
  async getProducts(params?: { category?: string; search?: string; sort?: string }): Promise<Product[]> {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true);

      if (params?.category && params.category !== 'all') {
        query = query.eq('category_slug', params.category);
      }

      if (params?.search) {
        const term = `%${params.search.trim()}%`;
        query = query.or(`name.ilike.${term},sku.ilike.${term},subtitle.ilike.${term}`);
      }

      if (params?.sort === 'price_asc') {
        query = query.order('selling_price', { ascending: true });
      } else if (params?.sort === 'price_desc') {
        query = query.order('selling_price', { ascending: false });
      } else if (params?.sort === 'popular') {
        query = query.order('is_bestseller', { ascending: false }).order('is_featured', { ascending: false });
      } else {
        query = query.order('name', { ascending: true });
      }

      const { data, error } = await query;
      if (error) throw error;
      if (!data || data.length === 0) return PRODUCTS;

      return data.map(mapProduct);
    } catch (err) {
      console.warn('Supabase products fetch failed, using static fallback:', err);
      return PRODUCTS;
    }
  },

  async getProduct(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`sku.eq.${id},id.eq.${id},slug.eq.${id}`)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      if (data) return mapProduct(data);

      const fallback = PRODUCTS.find((p) => p.id.toLowerCase() === id.toLowerCase());
      return fallback || null;
    } catch (err) {
      console.warn(`Supabase getProduct(${id}) failed, fallback to static:`, err);
      const fallback = PRODUCTS.find((p) => p.id.toLowerCase() === id.toLowerCase());
      return fallback || null;
    }
  },

  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .or('is_featured.eq.true,is_bestseller.eq.true')
        .limit(16);

      if (error) throw error;
      if (!data || data.length === 0) {
        return PRODUCTS.filter((p) => p.featured || p.badge === 'Bestseller').slice(0, 12);
      }

      return data.map(mapProduct);
    } catch (err) {
      console.warn('Supabase getFeaturedProducts failed:', err);
      return PRODUCTS.filter((p) => p.featured || p.badge === 'Bestseller').slice(0, 12);
    }
  },

  // Categories
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      if (!data || data.length === 0) return CATEGORIES;

      return data.map((c) => ({
        id: c.slug,
        label: c.name,
        icon: c.icon || 'Flame',
      }));
    } catch (err) {
      return CATEGORIES;
    }
  },

  // Orders — Atomic Order Creation Stored Procedure
  async createOrder(payload: OrderPayload, token?: string | null): Promise<ApiResponse<OrderResponseData>> {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUserId = sessionData?.session?.user?.id || null;

      const rpcPayload = {
        customer_id: currentUserId,
        customer_name: payload.customer_name,
        customer_phone: payload.customer_phone,
        customer_email: payload.customer_email || null,
        delivery_address: payload.delivery_address,
        city: payload.city || 'Hyderabad',
        state: payload.state || 'Telangana',
        pincode: payload.pincode || '500034',
        landmark: payload.landmark || null,
        notes: payload.customer_notes || null,
        items: payload.items.map((i) => ({
          product_id: i.product_id,
          quantity: i.quantity,
        })),
      };

      const { data, error } = await supabase.rpc('create_order_atomic', {
        order_payload: rpcPayload,
      });

      if (error) {
        throw new Error(error.message || 'Failed to place order');
      }

      const settings = await this.getSettings();

      return {
        status: 'success',
        message: 'Order created successfully. Please submit UPI payment confirmation.',
        data: {
          id: data.id,
          order_number: data.order_number,
          total_mrp: Number(data.total_mrp),
          total_selling_price: Number(data.subtotal),
          discount_amount: Number(data.discount),
          final_amount: Number(data.final_amount),
          status: data.status,
          upi_instructions: {
            upi_id: settings.upi_id,
            recipient_name: settings.upi_payee_name,
            amount: Number(data.final_amount),
            admin_whatsapp: settings.business_phone,
          },
        },
      };
    } catch (err: any) {
      throw new Error(err.message || 'Could not place order');
    }
  },

  // Confirm Payment with Screenshot Upload to Private Supabase Storage
  async confirmPayment(orderId: string | number, formData: FormData, token?: string | null): Promise<ApiResponse<PaymentConfirmResponseData>> {
    try {
      const utrNumber = (formData.get('utr_number') as string) || '';
      const notes = (formData.get('notes') as string) || '';
      const screenshotFile = formData.get('screenshot') as File | null;

      if (!utrNumber.trim() && (!screenshotFile || !screenshotFile.name)) {
        throw new Error('Please provide the UPI UTR number or upload a payment screenshot.');
      }

      // 1. Resolve Order Record (by UUID or order_number)
      const cleanOrderId = String(orderId).trim();
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanOrderId);
      
      let orderQuery = supabase
        .from('orders')
        .select('id, order_number, final_total, customer_id');

      if (isUuid) {
        orderQuery = orderQuery.eq('id', cleanOrderId);
      } else {
        orderQuery = orderQuery.eq('order_number', cleanOrderId);
      }

      const { data: order, error: orderErr } = await orderQuery.maybeSingle();

      if (orderErr || !order) {
        throw new Error('Order not found for payment confirmation.');
      }

      let screenshotPath: string | null = null;

      // 2. Upload to Private Supabase Storage bucket 'payment-screenshots'
      if (screenshotFile && typeof screenshotFile.name === 'string') {
        const fileExt = screenshotFile.name.split('.').pop() || 'png';
        const fileName = `${order.order_number}_${Date.now()}.${fileExt}`;
        const filePath = `${order.customer_id || 'guest'}/${fileName}`;

        const { error: uploadErr } = await supabase.storage
          .from('payment-screenshots')
          .upload(filePath, screenshotFile, {
            upsert: false,
            contentType: screenshotFile.type || 'image/png',
          });

        if (uploadErr) {
          console.warn('Screenshot upload warning:', uploadErr);
        } else {
          screenshotPath = filePath;
        }
      }

      // 3. Insert Payment record in public.payments
      const { error: payErr } = await supabase
        .from('payments')
        .insert({
          order_id: order.id,
          payment_method: 'UPI',
          amount: order.final_total,
          utr_transaction_id: utrNumber.trim() || 'PROOF_UPLOADED',
          screenshot_storage_path: screenshotPath,
          notes: notes.trim() || null,
          status: 'submitted',
        });

      if (payErr) {
        console.warn('Payment record insert notice:', payErr);
      }

      // 4. Update order payment status
      await supabase
        .from('orders')
        .update({ payment_status: 'submitted', updated_at: new Date().toISOString() })
        .eq('id', order.id);

      const settings = await this.getSettings();
      const whatsappMsg = encodeURIComponent(
        `*SIVAJI FIRECRACKER — PAYMENT CONFIRMATION*\n` +
        `Order Number: ${order.order_number}\n` +
        `Amount Paid: ₹${order.final_total}\n` +
        `UTR / Reference: ${utrNumber.trim()}\n` +
        `Please verify in admin portal.`
      );

      return {
        status: 'success',
        message: 'Payment verification details recorded successfully.',
        data: {
          order_number: order.order_number,
          status: 'submitted',
          utr_number: utrNumber.trim(),
          screenshot_url: screenshotPath || '',
          admin_whatsapp_link: `https://wa.me/918374044445?text=${whatsappMsg}`,
          admin_phone: settings.business_phone,
        },
      };
    } catch (err: any) {
      throw new Error(err.message || 'Payment confirmation failed');
    }
  },

  // Get Single Order with Items & Payment
  async getOrder(orderNumber: string) {
    try {
      // 1. Try secure stored procedure first (handles customer isolation and guest order lookup)
      const { data: rpcOrder, error: rpcErr } = await supabase.rpc('get_order_confirmation', {
        p_order_number: orderNumber,
      });

      if (!rpcErr && rpcOrder) {
        return {
          status: 'success',
          data: {
            id: rpcOrder.id,
            order_number: rpcOrder.order_number,
            customer_name: rpcOrder.customer_name,
            customer_phone: rpcOrder.customer_phone,
            customer_email: rpcOrder.customer_email,
            delivery_address: rpcOrder.delivery_address,
            city: rpcOrder.city,
            state: rpcOrder.state,
            pincode: rpcOrder.pincode,
            landmark: rpcOrder.landmark,
            customer_notes: rpcOrder.notes,
            total_mrp: Number(rpcOrder.subtotal) + Number(rpcOrder.discount),
            total_selling_price: Number(rpcOrder.subtotal),
            discount_amount: Number(rpcOrder.discount),
            final_amount: Number(rpcOrder.final_total),
            status: rpcOrder.status,
            payment_status: rpcOrder.payment_status,
            created_at: rpcOrder.created_at,
            items: (rpcOrder.order_items || []).map((it: any) => ({
              id: it.id,
              product_id: it.product_id,
              product_name: it.product_name,
              box_quantity: it.box_quantity,
              quantity_unit: it.quantity_unit,
              mrp: Number(it.mrp),
              selling_price: Number(it.unit_price),
              quantity: Number(it.quantity),
              total_mrp: Number(it.mrp) * Number(it.quantity),
              total_selling_price: Number(it.line_total),
            })),
            paymentConfirmation: rpcOrder.paymentConfirmation || undefined,
          },
        };
      }

      // 2. Direct fallback (for admin queries)
      const { data: order, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*),
          payments (*)
        `)
        .or(`order_number.eq.${orderNumber},id.eq.${orderNumber}`)
        .maybeSingle();

      if (error || !order) {
        throw new Error(`Order ${orderNumber} not found`);
      }

      const latestPayment = Array.isArray(order.payments) && order.payments.length > 0
        ? order.payments[order.payments.length - 1]
        : null;

      return {
        status: 'success',
        data: {
          id: order.id,
          order_number: order.order_number,
          customer_name: order.customer_name,
          customer_phone: order.customer_phone,
          customer_email: order.customer_email,
          delivery_address: order.delivery_address,
          city: order.city,
          state: order.state,
          pincode: order.pincode,
          landmark: order.landmark,
          customer_notes: order.notes,
          total_mrp: Number(order.subtotal) + Number(order.discount),
          total_selling_price: Number(order.subtotal),
          discount_amount: Number(order.discount),
          final_amount: Number(order.final_total),
          status: order.status,
          payment_status: order.payment_status,
          created_at: order.created_at,
          items: (order.order_items || []).map((it: any) => ({
            id: it.id,
            product_id: it.product_id,
            product_name: it.product_name,
            box_quantity: it.box_quantity,
            quantity_unit: it.quantity_unit,
            mrp: Number(it.mrp),
            selling_price: Number(it.unit_price),
            quantity: Number(it.quantity),
            total_mrp: Number(it.mrp) * Number(it.quantity),
            total_selling_price: Number(it.line_total),
          })),
          paymentConfirmation: latestPayment
            ? {
                id: latestPayment.id,
                utr_number: latestPayment.utr_transaction_id,
                screenshot_url: latestPayment.screenshot_storage_path,
                notes: latestPayment.notes,
                verified: latestPayment.status === 'verified',
              }
            : undefined,
        },
      };
    } catch (err: any) {
      throw new Error(err.message || `Order ${orderNumber} not found`);
    }
  },

  // Customer Auth (Supabase Auth)
  async register(data: Record<string, any>) {
    try {
      const email = data.email?.trim().toLowerCase();
      const password = data.password;
      const fullName = (data.name || data.full_name || '').trim();
      const phone = (data.phone || data.mobile || '').trim();

      const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
            role: 'customer',
          },
        },
      });

      if (error) throw error;
      if (!authData.user) throw new Error('Registration failed. Please try again.');

      // Ensure profile exists in customer_profiles table
      await supabase
        .from('customer_profiles')
        .upsert({
          id: authData.user.id,
          full_name: fullName || splitEmail(email),
          email: email,
          mobile: phone || null,
          role: 'customer',
          status: 'active',
        }, { onConflict: 'id' });

      return {
        status: 'success',
        message: 'Account created successfully',
        data: {
          user: {
            id: authData.user.id,
            name: fullName,
            email: email,
            phone: phone,
            role: 'customer',
          },
          token: authData.session?.access_token || '',
        },
      };
    } catch (err: any) {
      throw new Error(err.message || 'Registration failed');
    }
  },

  async login(loginInput: string, passwordInput: string) {
    try {
      const email = loginInput.trim().toLowerCase();
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password: passwordInput,
      });

      if (error) {
        throw new Error(error.message || 'Invalid email or password');
      }

      if (!authData.user) {
        throw new Error('User not found');
      }

      // Fetch profile details
      const { data: profile } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

      const userObj = {
        id: authData.user.id,
        name: profile?.full_name || authData.user.user_metadata?.full_name || splitEmail(email),
        email: authData.user.email || email,
        phone: profile?.mobile || authData.user.user_metadata?.phone || '',
        role: profile?.role || 'customer',
      };

      return {
        status: 'success',
        message: 'Login successful',
        data: {
          user: userObj,
          token: authData.session?.access_token || '',
        },
      };
    } catch (err: any) {
      throw new Error(err.message || 'Invalid credentials');
    }
  },

  async logout(token?: string) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      // Ignore network errors on logout
    }
  },

  // Password Recovery via Supabase Auth
  async forgotPassword(email: string) {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/reset-password`
        : undefined;

      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: redirectUrl,
      });

      if (error) throw error;
      return {
        status: 'success',
        message: 'Password reset link sent to your email.',
        reset_token: undefined as string | undefined,
      };
    } catch (err: any) {
      throw new Error(err.message || 'Could not process password reset request.');
    }
  },

  async resetPassword(data: { password: string; [key: string]: any }) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) throw error;
      return { status: 'success', message: 'Password updated successfully' };
    } catch (err: any) {
      throw new Error(err.message || 'Password reset failed');
    }
  },

  // Profile Management
  async getProfile(token?: string) {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (!user) throw new Error('Unauthenticated');

      const { data: profile, error } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      return {
        status: 'success',
        data: {
          id: user.id,
          name: profile?.full_name || user.user_metadata?.full_name || splitEmail(user.email || ''),
          email: user.email || '',
          phone: profile?.mobile || user.user_metadata?.phone || '',
          role: profile?.role || 'customer',
        },
      };
    } catch (err: any) {
      throw new Error('Failed to load profile');
    }
  },

  async updateProfile(token: string | undefined, data: any) {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (!user) throw new Error('Unauthenticated');

      const updatePayload: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };
      if (data.name !== undefined) updatePayload.full_name = data.name.trim();
      if (data.phone !== undefined) updatePayload.mobile = data.phone.trim();

      const { data: updatedProfile, error } = await supabase
        .from('customer_profiles')
        .update(updatePayload)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      return {
        status: 'success',
        message: 'Profile updated successfully',
        data: {
          id: user.id,
          name: updatedProfile?.full_name || data.name || '',
          email: user.email || '',
          phone: updatedProfile?.mobile || data.phone || '',
          role: updatedProfile?.role || 'customer',
        },
      };
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update profile');
    }
  },

  async updatePassword(token: string | undefined, data: { new_password: string; [key: string]: any }) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.new_password,
      });

      if (error) throw error;
      return { status: 'success', message: 'Password changed successfully' };
    } catch (err: any) {
      throw new Error(err.message || 'Failed to change password');
    }
  },

  // Customer Saved Addresses
  async getAddresses(token?: string): Promise<CustomerAddress[]> {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (!user) return [];

      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('customer_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error || !data) return [];
      return data.map(mapAddress);
    } catch (err) {
      return [];
    }
  },

  async addAddress(token: string | undefined, data: Partial<CustomerAddress>) {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (!user) throw new Error('Unauthenticated');

      if (data.is_default) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('customer_id', user.id);
      }

      const { data: newAddr, error } = await supabase
        .from('addresses')
        .insert({
          customer_id: user.id,
          name: data.recipient_name || '',
          mobile: data.phone || '',
          address: data.address_line || '',
          city: data.city || 'Hyderabad',
          state: data.state || 'Telangana',
          pincode: data.pincode || '',
          landmark: data.landmark || null,
          tag: data.tag || data.address_type || 'Home',
          is_default: Boolean(data.is_default),
        })
        .select()
        .single();

      if (error) throw error;
      return { status: 'success', data: mapAddress(newAddr) };
    } catch (err: any) {
      throw new Error(err.message || 'Failed to save address');
    }
  },

  async updateAddress(token: string | undefined, id: string | number, data: Partial<CustomerAddress>) {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (!user) throw new Error('Unauthenticated');

      if (data.is_default) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('customer_id', user.id);
      }

      const updatePayload: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };
      if (data.recipient_name !== undefined) updatePayload.name = data.recipient_name;
      if (data.phone !== undefined) updatePayload.mobile = data.phone;
      if (data.address_line !== undefined) updatePayload.address = data.address_line;
      if (data.city !== undefined) updatePayload.city = data.city;
      if (data.state !== undefined) updatePayload.state = data.state;
      if (data.pincode !== undefined) updatePayload.pincode = data.pincode;
      if (data.landmark !== undefined) updatePayload.landmark = data.landmark;
      if (data.tag !== undefined) updatePayload.tag = data.tag;
      if (data.is_default !== undefined) updatePayload.is_default = Boolean(data.is_default);

      const { data: updated, error } = await supabase
        .from('addresses')
        .update(updatePayload)
        .eq('id', id)
        .eq('customer_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return { status: 'success', data: mapAddress(updated) };
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update address');
    }
  },

  async deleteAddress(token: string | undefined, id: string | number) {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (!user) throw new Error('Unauthenticated');

      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id)
        .eq('customer_id', user.id);

      if (error) throw error;
      return { status: 'success', message: 'Address removed' };
    } catch (err: any) {
      throw new Error(err.message || 'Failed to delete address');
    }
  },

  async setDefaultAddress(token: string | undefined, id: string | number) {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (!user) throw new Error('Unauthenticated');

      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('customer_id', user.id);

      const { error } = await supabase
        .from('addresses')
        .update({ is_default: true, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('customer_id', user.id);

      if (error) throw error;
      return { status: 'success', message: 'Default address updated' };
    } catch (err: any) {
      throw new Error(err.message || 'Failed to set default address');
    }
  },

  // Customer Orders
  async getCustomerOrders(token?: string) {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (!user) return { status: 'success', data: [] };

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*),
          payments (*)
        `)
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formatted = (data || []).map((o: any) => ({
        id: o.id,
        order_number: o.order_number,
        customer_name: o.customer_name,
        customer_phone: o.customer_phone,
        delivery_address: o.delivery_address,
        city: o.city,
        state: o.state,
        pincode: o.pincode,
        total_mrp: Number(o.subtotal) + Number(o.discount),
        total_selling_price: Number(o.subtotal),
        discount_amount: Number(o.discount),
        final_amount: Number(o.final_total),
        status: o.status,
        payment_status: o.payment_status,
        created_at: o.created_at,
        items: (o.order_items || []).map((it: any) => ({
          product_name: it.product_name,
          box_quantity: it.box_quantity,
          quantity_unit: it.quantity_unit,
          mrp: Number(it.mrp),
          selling_price: Number(it.unit_price),
          quantity: Number(it.quantity),
          total_selling_price: Number(it.line_total),
        })),
        payments: o.payments || [],
      }));

      return { status: 'success', data: formatted };
    } catch (err: any) {
      return { status: 'success', data: [] };
    }
  },
};

function splitEmail(email: string): string {
  if (!email) return 'Customer';
  const name = email.split('@')[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
}

import { supabase } from '@/lib/supabase/client';

export interface AdminDashboardMetrics {
  totalOrders: number;
  totalRevenue: number;
  pendingPaymentsCount: number;
  outOfStockCount: number;
  recentOrders: any[];
}

export interface AdminProduct {
  id: string;
  category_id: string;
  category_slug: string;
  name: string;
  slug: string;
  sku: string;
  subtitle?: string;
  description?: string;
  mrp: number;
  selling_price: number;
  box_quantity: number;
  quantity_unit: string;
  pieces?: string;
  sound_level: string;
  stock_quantity: number;
  low_stock_threshold: number;
  image_url: string;
  is_active: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  badge?: string;
  green_certified: boolean;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  icon?: string;
  is_active: boolean;
  sort_order: number;
}

export interface AdminOrder {
  id: string;
  order_number: string;
  customer_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  subtotal: number;
  discount: number;
  shipping_charge: number;
  final_total: number;
  status: string;
  payment_status: string;
  notes?: string;
  admin_notes?: string;
  created_at: string;
  order_items: any[];
  payments: any[];
}

export const adminApi = {
  // Check if current user is an admin
  async checkAdmin(): Promise<boolean> {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (!user) return false;

      const { data, error } = await supabase
        .from('customer_profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (error || !data) return false;
      return data.role === 'admin';
    } catch {
      return false;
    }
  },

  // Dashboard Metrics
  async getDashboardMetrics(): Promise<AdminDashboardMetrics> {
    const [ordersRes, pendingPayRes, lowStockRes, recentOrdersRes] = await Promise.all([
      supabase.from('orders').select('final_total, status, payment_status'),
      supabase.from('payments').select('id', { count: 'exact', head: true }).eq('status', 'submitted'),
      supabase.from('products').select('id', { count: 'exact', head: true }).lte('stock_quantity', 5),
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(6),
    ]);

    const allOrders = ordersRes.data || [];
    const totalOrders = allOrders.length;
    const totalRevenue = allOrders
      .filter((o) => o.payment_status === 'verified' || o.status === 'delivered')
      .reduce((sum, o) => sum + Number(o.final_total || 0), 0);

    return {
      totalOrders,
      totalRevenue,
      pendingPaymentsCount: pendingPayRes.count || 0,
      outOfStockCount: lowStockRes.count || 0,
      recentOrders: recentOrdersRes.data || [],
    };
  },

  // Orders Management
  async getOrders(filterStatus?: string, search?: string): Promise<AdminOrder[]> {
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (*),
        payments (*)
      `)
      .order('created_at', { ascending: false });

    if (filterStatus && filterStatus !== 'all') {
      query = query.eq('status', filterStatus);
    }

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      query = query.or(`order_number.ilike.${term},customer_name.ilike.${term},customer_phone.ilike.${term}`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async updateOrderStatus(orderId: string, status: string, adminNotes?: string) {
    const payload: Record<string, any> = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (adminNotes !== undefined) payload.admin_notes = adminNotes;

    const { error } = await supabase
      .from('orders')
      .update(payload)
      .eq('id', orderId);

    if (error) throw error;
  },

  // Payments Management
  async getPayments(statusFilter?: string) {
    let query = supabase
      .from('payments')
      .select(`
        *,
        orders (
          id,
          order_number,
          customer_name,
          customer_phone,
          customer_email,
          final_total,
          status,
          payment_status
        )
      `)
      .order('created_at', { ascending: false });

    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getScreenshotUrl(path: string): Promise<string> {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;

    // Create a 60-minute signed URL for the private screenshot
    const { data, error } = await supabase.storage
      .from('payment-screenshots')
      .createSignedUrl(path, 3600);

    if (error || !data) return '';
    return data.signedUrl;
  },

  async verifyPayment(paymentId: string, orderId: string) {
    const { data: sessionData } = await supabase.auth.getSession();
    const adminId = sessionData?.session?.user?.id || null;

    // Update payment record
    const { error: payErr } = await supabase
      .from('payments')
      .update({
        status: 'verified',
        verified_at: new Date().toISOString(),
        verified_by: adminId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', paymentId);

    if (payErr) throw payErr;

    // Update order record
    const { error: orderErr } = await supabase
      .from('orders')
      .update({
        payment_status: 'verified',
        status: 'confirmed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (orderErr) throw orderErr;
  },

  async rejectPayment(paymentId: string, orderId: string, reason: string) {
    const { error: payErr } = await supabase
      .from('payments')
      .update({
        status: 'rejected',
        rejection_reason: reason,
        updated_at: new Date().toISOString(),
      })
      .eq('id', paymentId);

    if (payErr) throw payErr;

    const { error: orderErr } = await supabase
      .from('orders')
      .update({
        payment_status: 'rejected',
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (orderErr) throw orderErr;
  },

  // Products Management
  async getProducts(search?: string, category?: string): Promise<AdminProduct[]> {
    let query = supabase.from('products').select('*').order('name', { ascending: true });

    if (category && category !== 'all') {
      query = query.eq('category_slug', category);
    }
    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      query = query.or(`name.ilike.${term},sku.ilike.${term}`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async saveProduct(product: Partial<AdminProduct>) {
    const slug = product.slug || (product.name || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + (product.sku || 'item').toLowerCase();

    const payload: Record<string, any> = {
      ...product,
      slug,
      updated_at: new Date().toISOString(),
    };

    if (product.id) {
      const { data, error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', product.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('products')
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  },

  async deleteProduct(productId: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);
    if (error) throw error;
  },

  async adjustStock(productId: string, newStock: number, reason: string) {
    const { data: current } = await supabase
      .from('products')
      .select('stock_quantity')
      .eq('id', productId)
      .single();

    const oldQty = current?.stock_quantity || 0;
    const diff = newStock - oldQty;

    await supabase
      .from('products')
      .update({ stock_quantity: newStock, updated_at: new Date().toISOString() })
      .eq('id', productId);

    const { data: sessionData } = await supabase.auth.getSession();
    await supabase.from('inventory_logs').insert({
      product_id: productId,
      quantity_change: diff,
      new_quantity: newStock,
      reason: reason || 'Manual Admin Inventory Adjustment',
      created_by: sessionData?.session?.user?.id || null,
    });
  },

  async uploadProductImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `prod_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, {
        upsert: true,
        contentType: file.type || 'image/jpeg',
      });

    if (error) throw error;

    const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
    return data.publicUrl;
  },

  // Categories Management
  async getCategories(): Promise<AdminCategory[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async saveCategory(category: Partial<AdminCategory>) {
    const slug = category.slug || (category.name || 'category')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const payload = {
      ...category,
      slug,
      updated_at: new Date().toISOString(),
    };

    if (category.id) {
      const { data, error } = await supabase
        .from('categories')
        .update(payload)
        .eq('id', category.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('categories')
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  },

  // Customers Directory
  async getCustomers() {
    const { data, error } = await supabase
      .from('customer_profiles')
      .select(`
        *,
        orders (id, final_total, status)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map((c: any) => {
      const orders = c.orders || [];
      const totalSpent = orders.reduce((sum: number, o: any) => sum + Number(o.final_total || 0), 0);
      return {
        id: c.id,
        name: c.full_name,
        email: c.email,
        phone: c.mobile,
        role: c.role,
        status: c.status,
        created_at: c.created_at,
        orders_count: orders.length,
        total_spent: totalSpent,
      };
    });
  },

  // Site Settings
  async getSettings(): Promise<Record<string, string>> {
    const { data, error } = await supabase.from('site_settings').select('*');
    if (error) throw error;
    const map: Record<string, string> = {};
    data?.forEach((s: any) => {
      map[s.key] = s.value;
    });
    return map;
  },

  async updateSettings(settings: Record<string, string>) {
    for (const [key, value] of Object.entries(settings)) {
      await supabase
        .from('site_settings')
        .upsert(
          { key, value, updated_at: new Date().toISOString() },
          { onConflict: 'key' }
        );
    }
  },
};

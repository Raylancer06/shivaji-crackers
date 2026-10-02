import { Product, PRODUCTS, CATEGORIES } from '@/data/products';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data: T;
  count?: number;
}

export interface OrderPayload {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address: string;
  city?: string;
  state?: string;
  pincode?: string;
  transport_hub?: string;
  customer_notes?: string;
  user_id?: number;
  items: Array<{
    product_id: string;
    quantity: number;
  }>;
}

export interface OrderResponseData {
  id: number;
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
  screenshot_url: string;
  admin_whatsapp_link: string;
  admin_phone: string;
}

export const api = {
  // Products
  async getProducts(params?: { category?: string; search?: string; sort?: string }): Promise<Product[]> {
    try {
      const url = new URL(`${API_BASE_URL}/products`);
      if (params?.category && params.category !== 'all') url.searchParams.set('category', params.category);
      if (params?.search) url.searchParams.set('search', params.search);
      if (params?.sort) url.searchParams.set('sort', params.sort);

      const res = await fetch(url.toString(), { next: { revalidate: 60 } });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json: ApiResponse<Product[]> = await res.json();
      return json.data;
    } catch (err) {
      console.warn('Backend API unavailable, falling back to static products:', err);
      return PRODUCTS;
    }
  },

  async getProduct(id: string): Promise<Product | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json: ApiResponse<Product> = await res.json();
      return json.data;
    } catch (err) {
      console.warn(`Backend API unavailable for product ${id}, falling back to static data:`, err);
      const fallback = PRODUCTS.find((p) => p.id === id);
      return fallback || null;
    }
  },

  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/products/featured`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json: ApiResponse<Product[]> = await res.json();
      return json.data;
    } catch (err) {
      console.warn('Backend API unavailable, falling back to static featured products:', err);
      return PRODUCTS.filter((p) => p.featured || p.badge === 'Bestseller').slice(0, 12);
    }
  },

  // Categories
  async getCategories() {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();
      return json.data;
    } catch (err) {
      return CATEGORIES;
    }
  },

  // Orders
  async createOrder(payload: OrderPayload): Promise<ApiResponse<OrderResponseData>> {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.message || `Failed to create order: ${res.statusText}`);
    }

    return await res.json();
  },

  async confirmPayment(orderId: number | string, formData: FormData): Promise<ApiResponse<PaymentConfirmResponseData>> {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/payment-confirm`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: formData,
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.message || `Failed to submit payment confirmation: ${res.statusText}`);
    }

    return await res.json();
  },

  async getOrder(orderNumber: string) {
    const res = await fetch(`${API_BASE_URL}/orders/${orderNumber}`);
    if (!res.ok) throw new Error(`Order ${orderNumber} not found`);
    return await res.json();
  },

  // Customer Auth
  async register(data: Record<string, any>) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Registration failed');
    }

    return await res.json();
  },

  async login(login: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ login, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Invalid credentials');
    }

    return await res.json();
  },

  async getCustomerOrders(token: string) {
    const res = await fetch(`${API_BASE_URL}/customer/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!res.ok) throw new Error('Failed to fetch customer orders');
    return await res.json();
  },
};

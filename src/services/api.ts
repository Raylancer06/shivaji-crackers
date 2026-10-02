import { Product, PRODUCTS, CATEGORIES } from '@/data/products';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

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
}

export interface CustomerAddress {
  id: number;
  user_id?: number;
  tag?: string;
  address_type?: string;
  recipient_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  transport_hub?: string;
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
  // Store Settings (Minimum Cart Value, Business Details, UPI)
  async getSettings(): Promise<StoreSettings> {
    try {
      const res = await fetch(`${API_BASE_URL}/settings`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json: ApiResponse<StoreSettings> = await res.json();
      return json.data;
    } catch (err) {
      console.warn('Backend settings unavailable, falling back to defaults:', err);
      return {
        business_name: 'Sivaji Firecracker',
        business_city: 'Hyderabad',
        business_phone: '+91 83740 44445',
        business_email: 'orders@sivajifirecracker.com',
        minimum_cart_value: 2000,
        upi_id: 'sivajiduddempudi422@axl',
        upi_payee_name: 'Sivaji Duddempudi',
        currency_symbol: '₹',
      };
    }
  },

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
  async createOrder(payload: OrderPayload, token?: string | null): Promise<ApiResponse<OrderResponseData>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.message || `Failed to create order: ${res.statusText}`);
    }

    return await res.json();
  },

  async confirmPayment(orderId: number | string, formData: FormData, token?: string | null): Promise<ApiResponse<PaymentConfirmResponseData>> {
    const headers: Record<string, string> = {
      Accept: 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/payment-confirm`, {
      method: 'POST',
      headers,
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

  async logout(token: string) {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
    } catch (err) {
      // Ignore network errors on logout
    }
  },

  // Password Recovery
  async forgotPassword(email: string) {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Could not process password reset request.');
    }

    return await res.json();
  },

  async resetPassword(data: { email: string; token: string; password: string; password_confirmation: string }) {
    const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Password reset failed');
    }

    return await res.json();
  },

  // Profile Management
  async getProfile(token: string) {
    const res = await fetch(`${API_BASE_URL}/customer/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!res.ok) throw new Error('Failed to load profile');
    return await res.json();
  },

  async updateProfile(token: string, data: any) {
    const res = await fetch(`${API_BASE_URL}/customer/profile`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update profile');
    }

    return await res.json();
  },

  async updatePassword(token: string, data: { current_password: string; new_password: string; new_password_confirmation: string }) {
    const res = await fetch(`${API_BASE_URL}/customer/password`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to change password');
    }

    return await res.json();
  },

  // Customer Saved Addresses
  async getAddresses(token: string): Promise<CustomerAddress[]> {
    const res = await fetch(`${API_BASE_URL}/customer/addresses`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  },

  async addAddress(token: string, data: Partial<CustomerAddress>) {
    const res = await fetch(`${API_BASE_URL}/customer/addresses`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to save address');
    }

    return await res.json();
  },

  async updateAddress(token: string, id: number, data: Partial<CustomerAddress>) {
    const res = await fetch(`${API_BASE_URL}/customer/addresses/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update address');
    }

    return await res.json();
  },

  async deleteAddress(token: string, id: number) {
    const res = await fetch(`${API_BASE_URL}/customer/addresses/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!res.ok) throw new Error('Failed to delete address');
    return await res.json();
  },

  async setDefaultAddress(token: string, id: number) {
    const res = await fetch(`${API_BASE_URL}/customer/addresses/${id}/default`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!res.ok) throw new Error('Failed to set default address');
    return await res.json();
  },

  // Customer Orders
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

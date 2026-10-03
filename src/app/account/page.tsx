"use client";

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAuth, CustomerUser } from '@/context/AuthContext';
import { api, CustomerAddress } from '@/services/api';
import {
  User,
  Package,
  Clock,
  Phone,
  Mail,
  MapPin,
  LogOut,
  CheckCircle,
  FileText,
  X,
  Printer,
  Home,
  Briefcase,
  Plus,
  Trash2,
  Edit2,
  Lock,
  AlertCircle,
  LayoutDashboard,
  Loader2,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

interface OrderItem {
  id: string | number;
  product_name: string;
  product_sku: string;
  box_quantity: number;
  quantity_unit: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

interface OrderRecord {
  id: string | number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  final_amount: number;
  discount_amount: number;
  total_mrp: number;
  status: string;
  payment_status: string;
  created_at: string;
  items?: OrderItem[];
  payment_confirmation?: {
    utr_number: string;
    screenshot_path: string;
    verified_at?: string;
  };
}

function AccountPortal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token, isLoading: authLoading, logout, updateUser } = useAuth();

  const tabParam = searchParams.get('tab');
  const validTabs = ['dashboard', 'orders', 'addresses', 'profile', 'security'] as const;
  const initialTab = validTabs.includes(tabParam as any) ? (tabParam as typeof validTabs[number]) : 'dashboard';

  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile' | 'addresses' | 'orders' | 'security'>(initialTab);

  // Orders State
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Addresses State
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState<boolean>(false);
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
  const [editingAddressId, setEditingAddressId] = useState<number | string | null>(null);
  const [addressForm, setAddressForm] = useState({
    address_type: 'home',
    recipient_name: '',
    phone: '',
    address_line: '',
    landmark: '',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500034',
    is_default: false,
  });
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressError, setAddressError] = useState('');

  // Password Change Form State
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Synchronize profile form whenever user changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
      });
    }
  }, [user]);

  // Load orders and addresses when token is available
  const loadOrders = useCallback(async (authToken: string) => {
    setLoadingOrders(true);
    try {
      const res = await api.getCustomerOrders(authToken);
      if (res.data) setOrders(res.data);
    } catch (err) {
      console.warn('Could not load orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  const loadAddresses = useCallback(async (authToken: string) => {
    setLoadingAddresses(true);
    try {
      const list = await api.getAddresses(authToken);
      setAddresses(list);
    } catch (err) {
      console.warn('Could not load addresses:', err);
    } finally {
      setLoadingAddresses(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      loadOrders(token);
      loadAddresses(token);
    } else {
      setOrders([]);
      setAddresses([]);
    }
  }, [token, loadOrders, loadAddresses]);

  // Profile Update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setProfileSaving(true);
    setProfileMessage(null);
    try {
      const res = await api.updateProfile(token, profileForm);
      if (res.data) {
        updateUser(res.data);
      }
      setProfileMessage({ type: 'success', text: 'Profile details saved successfully.' });
    } catch (err: any) {
      setProfileMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setProfileSaving(false);
    }
  };

  // Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (passwordForm.new_password.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    setPasswordSaving(true);
    setPasswordMessage(null);
    try {
      await api.updatePassword(token, passwordForm);
      setPasswordMessage({ type: 'success', text: 'Password updated successfully.' });
      setPasswordForm({ current_password: '', new_password: '', new_password_confirmation: '' });
    } catch (err: any) {
      setPasswordMessage({ type: 'error', text: err.message || 'Failed to change password. Please verify current password.' });
    } finally {
      setPasswordSaving(false);
    }
  };

  // Address CRUD
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      address_type: 'home',
      recipient_name: user?.name || '',
      phone: user?.phone || '',
      address_line: '',
      landmark: '',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500034',
      is_default: addresses.length === 0,
    });
    setAddressError('');
    setShowAddressModal(true);
  };

  const handleOpenEditAddress = (addr: CustomerAddress) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      address_type: addr.address_type || 'home',
      recipient_name: addr.recipient_name,
      phone: addr.phone,
      address_line: addr.address_line,
      landmark: addr.landmark || '',
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      is_default: addr.is_default,
    });
    setAddressError('');
    setShowAddressModal(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setAddressSaving(true);
    setAddressError('');
    try {
      if (editingAddressId) {
        await api.updateAddress(token, editingAddressId, addressForm);
      } else {
        await api.addAddress(token, addressForm);
      }
      setShowAddressModal(false);
      await loadAddresses(token);
    } catch (err: any) {
      setAddressError(err.message || 'Failed to save address.');
    } finally {
      setAddressSaving(false);
    }
  };

  const handleDeleteAddress = async (id: string | number) => {
    if (!token || !confirm('Are you sure you want to delete this address?')) return;
    try {
      await api.deleteAddress(token, id);
      await loadAddresses(token);
    } catch (err: any) {
      alert(err.message || 'Failed to delete address.');
    }
  };

  const handleSetDefaultAddress = async (id: string | number) => {
    if (!token) return;
    try {
      await api.setDefaultAddress(token, id);
      await loadAddresses(token);
    } catch (err: any) {
      alert(err.message || 'Failed to set default address.');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      pending_verification: {
        label: 'Payment Verification Pending',
        className: 'bg-amber-100 text-amber-900 border-amber-300',
      },
      confirmed: {
        label: 'Verified & Confirmed',
        className: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      },
      packed: {
        label: 'Order Packed',
        className: 'bg-blue-100 text-blue-900 border-blue-300',
      },
      dispatched: {
        label: 'Dispatched for Delivery',
        className: 'bg-purple-100 text-purple-900 border-purple-300',
      },
      delivered: {
        label: 'Delivered',
        className: 'bg-green-100 text-green-900 border-green-300',
      },
      cancelled: {
        label: 'Cancelled',
        className: 'bg-red-100 text-red-900 border-red-300',
      },
    };

    const b = badges[status] || { label: status, className: 'bg-gray-100 text-gray-800 border-gray-300' };
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${b.className}`}>
        {b.label}
      </span>
    );
  };

  // While checking auth on initial page load
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8 py-10 sm:py-16">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-[#C98E2A] animate-spin" />
            <p className="text-xs text-[#66574F] font-semibold">Loading your customer account...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Unauthenticated / Logged-out state
  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between font-sans">
        <Navbar />
        <main className="max-w-xl mx-auto px-4 py-12 sm:py-16 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-[#FFF8ED] text-[#B85D00] border border-[#C98E2A]/30 flex items-center justify-center mx-auto shadow-sm">
            <User className="w-8 h-8 text-[#C98E2A]" />
          </div>
          <h1 className="font-serif text-3xl font-black text-[#550C12]">Customer Account</h1>
          <p className="text-xs sm:text-sm text-[#66574F] max-w-sm mx-auto leading-relaxed">
            Sign in to view your past Diwali orders, download invoices, and manage saved delivery addresses.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/login?redirect=/account"
              className="px-6 py-3 rounded-xl bg-[#550C12] hover:bg-[#7B141C] text-white font-serif font-bold text-xs shadow-md transition"
            >
              Sign In to Account
            </Link>
            <Link
              href="/register?redirect=/account"
              className="px-6 py-3 rounded-xl bg-white border border-[#E2D7C5] hover:bg-[#FAF8F5] text-[#550C12] font-serif font-bold text-xs shadow-sm transition"
            >
              Create New Account
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const defaultAddr = addresses.find((a) => a.is_default) || addresses[0];

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between font-sans">
      <Navbar />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Admin Shortcut Banner if user is Admin */}
        {user.role === 'admin' && (
          <div className="bg-gradient-to-r from-[#200306] via-[#3D060B] to-[#550C12] text-white rounded-3xl p-6 border-2 border-[#F0B543]/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#F0B543]/20 border border-[#F0B543]/50 text-[#F0B543] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="inline-block text-[10px] font-black uppercase tracking-wider bg-[#F0B543] text-[#200306] px-2.5 py-0.5 rounded-full mb-1">
                  Store Administrator
                </span>
                <h3 className="font-serif font-black text-base text-white">
                  Admin Operations Portal Access
                </h3>
                <p className="text-xs text-[#E2D7C5]">
                  Manage customer orders, verify UPI payments, update pricing & inventory.
                </p>
              </div>
            </div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C98E2A] to-[#F0B543] hover:from-[#F0B543] hover:to-[#C98E2A] text-[#1C1411] font-serif font-black text-xs transition shadow-md shrink-0"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to Admin Portal →</span>
            </Link>
          </div>
        )}

        {/* Top Header Card */}
        <div className="bg-white rounded-3xl border border-[#E2D7C5] shadow-regal p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#550C12] to-[#7B141C] text-white flex items-center justify-center font-serif font-black text-2xl shadow-md shrink-0">
              {user.name?.charAt(0) || 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#B85D00] uppercase tracking-wider bg-[#FFF8ED] px-2.5 py-0.5 rounded-full border border-[#C98E2A]/30">
                  Verified Sivaji Firecracker Customer
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#1C1411] mt-1">
                {user.name}
              </h1>
              <p className="text-xs text-[#66574F] font-mono mt-0.5">
                {user.phone} • {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/estimate"
              className="px-4 py-2.5 rounded-xl bg-[#550C12] text-white text-xs font-bold font-serif hover:bg-[#7B141C] transition shadow-md"
            >
              + Place New Order
            </Link>
            <button
              onClick={async () => {
                await logout();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-700 text-xs font-bold transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E2D7C5]">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-[#550C12] text-white shadow-md'
                : 'bg-white border border-[#E2D7C5] text-[#66574F] hover:bg-[#FAF8F5]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-[#550C12] text-white shadow-md'
                : 'bg-white border border-[#E2D7C5] text-[#66574F] hover:bg-[#FAF8F5]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'addresses'
                ? 'bg-[#550C12] text-white shadow-md'
                : 'bg-white border border-[#E2D7C5] text-[#66574F] hover:bg-[#FAF8F5]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses ({addresses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-[#550C12] text-white shadow-md'
                : 'bg-white border border-[#E2D7C5] text-[#66574F] hover:bg-[#FAF8F5]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Details</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'security'
                ? 'bg-[#550C12] text-white shadow-md'
                : 'bg-white border border-[#E2D7C5] text-[#66574F] hover:bg-[#FAF8F5]'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Security & Password</span>
          </button>
        </div>

        {/* ---------------------------------------------------- */}
        {/* TAB 1: DASHBOARD                                     */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#E2D7C5] shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FFF8ED] text-[#B85D00] flex items-center justify-center">
                  <Package className="w-6 h-6 text-[#C98E2A]" />
                </div>
                <div>
                  <div className="font-serif font-black text-2xl text-[#1C1411]">{orders.length}</div>
                  <div className="text-xs text-[#66574F]">Total Orders Placed</div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E2D7C5] shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <div className="font-serif font-black text-2xl text-emerald-700">
                    ₹{orders.reduce((sum, o) => sum + Number(o.final_amount || 0), 0).toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-[#66574F]">Total Wholesale Purchases</div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E2D7C5] shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="font-serif font-black text-2xl text-[#1C1411]">{addresses.length}</div>
                  <div className="text-xs text-[#66574F]">Saved Delivery Addresses</div>
                </div>
              </div>
            </div>

            {/* Dashboard Overview Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Recent Order Quick Glance */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E2D7C5] shadow-regal p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2D7C5]">
                  <h2 className="font-serif font-bold text-base text-[#1C1411]">
                    Latest Order Status
                  </h2>
                  {orders.length > 0 && (
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-bold text-[#550C12] hover:underline"
                    >
                      View All Orders →
                    </button>
                  )}
                </div>

                {loadingOrders ? (
                  <div className="text-center py-8 text-xs text-gray-500">Loading recent order...</div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8 space-y-3">
                    <Package className="w-8 h-8 text-[#C98E2A] mx-auto opacity-60" />
                    <p className="text-xs text-[#66574F]">No orders placed yet.</p>
                    <Link
                      href="/estimate"
                      className="inline-block px-4 py-2 rounded-xl bg-[#550C12] text-white text-xs font-bold font-serif"
                    >
                      Explore Cracker Price List
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E2D7C5] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-black text-sm text-[#B85D00]">
                          {orders[0].order_number}
                        </span>
                        {getStatusBadge(orders[0].status)}
                      </div>
                      <div className="text-xs text-[#66574F]">
                        Ordered on {new Date(orders[0].created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="flex justify-between items-baseline pt-2 border-t border-[#E2D7C5]/60">
                        <span className="text-xs text-[#550C12] font-semibold">Total Amount:</span>
                        <span className="font-serif font-black text-lg text-[#550C12]">
                          ₹{Number(orders[0].final_amount).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedOrder(orders[0])}
                      className="w-full py-2.5 px-4 rounded-xl bg-white border border-[#E2D7C5] hover:bg-[#FAF8F5] text-[#550C12] text-xs font-bold transition"
                    >
                      View Full Order Details & Invoice
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Default Address & Support */}
              <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E2D7C5] shadow-regal p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2D7C5]">
                  <h2 className="font-serif font-bold text-base text-[#1C1411]">
                    Default Delivery Address
                  </h2>
                  <button
                    onClick={() => setActiveTab('addresses')}
                    className="text-xs font-bold text-[#550C12] hover:underline"
                  >
                    Manage →
                  </button>
                </div>

                {defaultAddr ? (
                  <div className="space-y-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E2D7C5] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1C1411] capitalize flex items-center gap-1.5">
                          {defaultAddr.address_type === 'home' ? <Home className="w-3.5 h-3.5 text-[#C98E2A]" /> : <Briefcase className="w-3.5 h-3.5 text-[#C98E2A]" />}
                          {defaultAddr.address_type} Address
                        </span>
                        <span className="text-[10px] font-bold text-[#07542C] bg-[#EDF7EE] px-2 py-0.5 rounded-full border border-[#07542C]/20">
                          Default
                        </span>
                      </div>
                      <p className="text-[#1C1411] font-medium">{defaultAddr.recipient_name} ({defaultAddr.phone})</p>
                      <p className="text-[#66574F]">{defaultAddr.address_line}</p>
                      {defaultAddr.landmark && <p className="text-[#66574F]">Landmark: {defaultAddr.landmark}</p>}
                      <p className="text-[#66574F]">{defaultAddr.city}, {defaultAddr.state} - {defaultAddr.pincode}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 space-y-2">
                    <p className="text-xs text-[#66574F]">No saved addresses yet.</p>
                    <button
                      onClick={handleOpenAddAddress}
                      className="px-4 py-2 rounded-xl bg-[#550C12] text-white text-xs font-bold"
                    >
                      + Add Delivery Address
                    </button>
                  </div>
                )}

                <div className="pt-2 border-t border-gray-100 text-[11px] text-[#66574F] space-y-1">
                  <div className="font-bold text-[#550C12]">Sivaji Firecracker Helpline:</div>
                  <div>Phone: <strong>+91 83740 44445</strong> (Hyderabad Dispatch)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 2: PROFILE DETAILS                               */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl bg-white rounded-3xl border border-[#E2D7C5] shadow-regal p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="font-serif font-black text-xl text-[#1C1411]">
                Customer Profile Information
              </h2>
              <p className="text-xs text-[#66574F]">
                Update your contact information used for delivery updates and order notifications.
              </p>
            </div>

            {profileMessage && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                  profileMessage.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}
              >
                {profileMessage.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{profileMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    disabled={profileSaving}
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A] disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                  WhatsApp Contact Phone *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    disabled={profileSaving}
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A] disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    disabled={profileSaving}
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A] disabled:opacity-60"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={profileSaving}
                className="py-3 px-6 rounded-xl bg-[#550C12] hover:bg-[#7B141C] text-white font-serif font-black text-xs uppercase tracking-wider shadow-regal transition disabled:opacity-50 flex items-center gap-2"
              >
                {profileSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <span>Save Profile Details</span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 3: SAVED ADDRESSES                               */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-black text-xl text-[#1C1411]">
                  Saved Delivery Addresses
                </h2>
                <p className="text-xs text-[#66574F]">
                  Manage home and commercial addresses for seamless one-click Diwali checkout.
                </p>
              </div>

              <button
                onClick={handleOpenAddAddress}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#550C12] hover:bg-[#7B141C] text-white text-xs font-bold transition shadow-sm self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add New Address</span>
              </button>
            </div>

            {loadingAddresses ? (
              <div className="p-12 text-center text-xs text-gray-500 bg-white rounded-3xl border border-[#E2D7C5]">
                Loading address book...
              </div>
            ) : addresses.length === 0 ? (
              <div className="p-12 text-center space-y-3 bg-white rounded-3xl border border-[#E2D7C5]">
                <MapPin className="w-10 h-10 text-[#C98E2A] mx-auto opacity-70" />
                <h3 className="font-serif font-bold text-base text-[#1C1411]">No Addresses Saved</h3>
                <p className="text-xs text-[#66574F] max-w-sm mx-auto">
                  Add your primary delivery address in Hyderabad to speed up your order requests.
                </p>
                <button
                  onClick={handleOpenAddAddress}
                  className="inline-block px-5 py-2.5 rounded-xl bg-[#550C12] text-white text-xs font-bold font-serif shadow-md"
                >
                  + Add Your First Address
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-5 rounded-3xl border bg-white shadow-sm flex flex-col justify-between gap-4 transition ${
                      addr.is_default ? 'border-[#C98E2A] ring-1 ring-[#C98E2A]/50' : 'border-[#E2D7C5]'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#FAF8F5] border border-[#E2D7C5] flex items-center justify-center text-[#550C12]">
                            {addr.address_type === 'home' ? <Home className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
                          </div>
                          <span className="font-bold text-xs text-[#1C1411] capitalize">
                            {addr.address_type} Address
                          </span>
                        </div>
                        {addr.is_default && (
                          <span className="text-[10px] font-bold text-[#07542C] bg-[#EDF7EE] px-2.5 py-0.5 rounded-full border border-[#07542C]/20">
                            Default Address
                          </span>
                        )}
                      </div>

                      <div className="text-xs space-y-1 pt-1">
                        <div className="font-bold text-[#1C1411]">
                          {addr.recipient_name}{' '}
                          <span className="font-normal text-gray-500 font-mono">({addr.phone})</span>
                        </div>
                        <div className="text-gray-600 leading-relaxed">{addr.address_line}</div>
                        {addr.landmark && (
                          <div className="text-gray-500 text-[11px]">
                            <strong>Landmark:</strong> {addr.landmark}
                          </div>
                        )}
                        <div className="text-gray-600">
                          {addr.city}, {addr.state} - {addr.pincode}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                      {!addr.is_default ? (
                        <button
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="text-[11px] font-bold text-[#B85D00] hover:underline"
                        >
                          Set as Default
                        </button>
                      ) : (
                        <span className="text-[11px] text-gray-400">Primary Delivery</span>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditAddress(addr)}
                          className="p-1.5 rounded-lg text-gray-600 hover:text-[#550C12] hover:bg-gray-100 transition"
                          title="Edit Address"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-700 hover:bg-red-50 transition"
                          title="Delete Address"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 4: ORDERS HISTORY                                */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-[#E2D7C5] shadow-regal overflow-hidden">
            <div className="p-6 border-b border-[#E2D7C5] bg-[#FAF8F5] flex items-center justify-between">
              <div>
                <h2 className="font-serif font-black text-lg text-[#1C1411]">
                  Your Sivaji Firecracker Orders
                </h2>
                <p className="text-xs text-[#66574F]">
                  Real-time status tracking, payment verification, and dispatch invoices.
                </p>
              </div>
              <span className="text-xs font-bold text-[#550C12] bg-white px-3 py-1 rounded-xl border border-[#E2D7C5]">
                {orders.length} Total Orders
              </span>
            </div>

            {loadingOrders ? (
              <div className="p-12 text-center text-xs text-gray-500">
                Loading order history...
              </div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Package className="w-10 h-10 text-[#C98E2A] mx-auto opacity-70" />
                <h3 className="font-serif font-bold text-base text-[#1C1411]">No Orders Placed Yet</h3>
                <p className="text-xs text-[#66574F] max-w-sm mx-auto">
                  Browse our wholesale price sheet and book your Diwali crackers with up to 80% discount.
                </p>
                <Link
                  href="/estimate"
                  className="inline-block px-5 py-2.5 rounded-xl bg-[#550C12] text-white text-xs font-bold font-serif shadow-md"
                >
                  Browse Cracker Catalog
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#E2D7C5]/60">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-5 sm:p-6 hover:bg-[#FAF8F5]/80 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-black text-sm text-[#B85D00]">
                          {ord.order_number}
                        </span>
                        {getStatusBadge(ord.status)}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(ord.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <span>•</span>
                        <span>{ord.city} Destination</span>
                        {ord.landmark && (
                          <>
                            <span>•</span>
                            <span>Near {ord.landmark}</span>
                          </>
                        )}
                      </div>
                      <div className="text-xs text-[#550C12] font-bold">
                        Wholesale Total: ₹{Number(ord.final_amount).toLocaleString('en-IN')}{' '}
                        <span className="text-[11px] text-emerald-700 font-normal">
                          (Saved ₹{Number(ord.discount_amount).toLocaleString('en-IN')})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="px-4 py-2 rounded-xl bg-[#550C12] hover:bg-[#7B141C] text-white text-xs font-bold transition shadow-sm"
                      >
                        View Order Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 5: SECURITY & PASSWORD                           */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'security' && (
          <div className="max-w-2xl bg-white rounded-3xl border border-[#E2D7C5] shadow-regal p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="font-serif font-black text-xl text-[#1C1411]">
                Account Security & Password
              </h2>
              <p className="text-xs text-[#66574F]">
                Keep your customer account secure by choosing a strong password.
              </p>
            </div>

            {passwordMessage && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                  passwordMessage.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}
              >
                {passwordMessage.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{passwordMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                  Current Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    disabled={passwordSaving}
                    value={passwordForm.current_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A] disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                  New Password (min 6 chars) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    disabled={passwordSaving}
                    value={passwordForm.new_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A] disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    disabled={passwordSaving}
                    value={passwordForm.new_password_confirmation}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new_password_confirmation: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A] disabled:opacity-60"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={passwordSaving}
                className="py-3 px-6 rounded-xl bg-[#550C12] hover:bg-[#7B141C] text-white font-serif font-black text-xs uppercase tracking-wider shadow-regal transition disabled:opacity-50 flex items-center gap-2"
              >
                {passwordSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODAL: ADD / EDIT ADDRESS                            */}
        {/* ---------------------------------------------------- */}
        {showAddressModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative max-w-lg w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-[#E2D7C5] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2D7C5] mb-4">
                <h3 className="font-serif font-black text-lg text-[#1C1411]">
                  {editingAddressId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
                </h3>
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center font-bold"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {addressError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                  {addressError}
                </div>
              )}

              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`p-3 rounded-2xl border text-center text-xs font-bold cursor-pointer transition flex items-center justify-center gap-2 ${
                      addressForm.address_type === 'home'
                        ? 'border-[#C98E2A] bg-[#FFF8ED] text-[#550C12]'
                        : 'border-[#E2D7C5] text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="address_type"
                      checked={addressForm.address_type === 'home'}
                      onChange={() => setAddressForm({ ...addressForm, address_type: 'home' })}
                      className="sr-only"
                    />
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </label>

                  <label
                    className={`p-3 rounded-2xl border text-center text-xs font-bold cursor-pointer transition flex items-center justify-center gap-2 ${
                      addressForm.address_type === 'office'
                        ? 'border-[#C98E2A] bg-[#FFF8ED] text-[#550C12]'
                        : 'border-[#E2D7C5] text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="address_type"
                      checked={addressForm.address_type === 'office'}
                      onChange={() => setAddressForm({ ...addressForm, address_type: 'office' })}
                      className="sr-only"
                    />
                    <Briefcase className="w-4 h-4" />
                    <span>Office / Commercial</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                      Recipient Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={addressForm.recipient_name}
                      onChange={(e) => setAddressForm({ ...addressForm, recipient_name: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                    Street Address *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={addressForm.address_line}
                    onChange={(e) => setAddressForm({ ...addressForm, address_line: e.target.value })}
                    placeholder="Flat / Door No, Apartment name, Street..."
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={addressForm.landmark}
                      onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                      placeholder="e.g. Near Metro Station"
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      required
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      required
                      value={addressForm.pincode}
                      onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                      placeholder="500034"
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={addressForm.is_default}
                    onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })}
                    className="rounded border-gray-300 text-[#550C12] focus:ring-[#C98E2A]"
                  />
                  <span className="text-xs text-gray-700">Make this my default delivery address</span>
                </label>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addressSaving}
                    className="px-5 py-2.5 rounded-xl bg-[#550C12] hover:bg-[#7B141C] text-white text-xs font-bold transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {addressSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Address</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODAL: ORDER DETAILS & PRINTABLE INVOICE             */}
        {/* ---------------------------------------------------- */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-6 border border-[#E2D7C5] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2D7C5] mb-4">
                <div>
                  <h3 className="font-serif font-black text-xl text-[#1C1411]">
                    Order <span className="font-mono text-[#B85D00]">{selectedOrder.order_number}</span>
                  </h3>
                  <p className="text-xs text-gray-500">
                    Placed on {new Date(selectedOrder.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center font-bold"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {/* Status Banner */}
                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E2D7C5] flex items-center justify-between">
                  <span className="font-bold text-[#66574F]">Fulfillment Status:</span>
                  <div>{getStatusBadge(selectedOrder.status)}</div>
                </div>

                {/* Shipping info */}
                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E2D7C5]">
                  <span className="text-gray-500 font-bold block mb-1">Delivery Destination:</span>
                  <div className="font-semibold text-[#1C1411]">
                    {selectedOrder.customer_name} ({selectedOrder.customer_phone})
                  </div>
                  <div className="text-gray-600 mt-0.5">
                    {selectedOrder.delivery_address}
                    {selectedOrder.landmark ? `, Near ${selectedOrder.landmark}` : ''}, {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}
                  </div>
                </div>

                {/* Items list */}
                {selectedOrder.items && selectedOrder.items.length > 0 && (
                  <div className="border border-[#E2D7C5] rounded-2xl overflow-hidden">
                    <div className="bg-[#FAF8F5] p-2.5 font-bold uppercase text-[10px] text-gray-500 border-b border-[#E2D7C5] flex justify-between">
                      <span>Ordered Cracker Varieties</span>
                      <span>Subtotal</span>
                    </div>
                    <div className="divide-y divide-[#E2D7C5]/50">
                      {selectedOrder.items.map((it) => (
                        <div key={it.id} className="p-2.5 flex justify-between items-center">
                          <div>
                            <div className="font-bold text-[#1C1411]">{it.product_name}</div>
                            <div className="text-[10px] font-bold text-[#550C12] bg-[#FFF8ED] px-1.5 py-0.5 rounded border border-[#C98E2A]/30 inline-block mt-0.5">
                              Box Contains: {it.box_quantity} {it.quantity_unit}
                            </div>
                            <div className="text-[11px] text-gray-500 mt-0.5">
                              ₹{it.unit_price} x {it.quantity} boxes
                            </div>
                          </div>
                          <div className="font-bold text-sm text-[#550C12]">
                            ₹{it.subtotal}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Financials */}
                <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200 flex justify-between items-baseline font-bold text-sm">
                  <span className="text-[#550C12] uppercase font-serif font-black">Net Wholesale Total:</span>
                  <span className="font-serif font-black text-xl text-[#550C12]">
                    ₹{Number(selectedOrder.final_amount).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Payment proof verification status */}
                {selectedOrder.payment_confirmation && (
                  <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 text-[11px] text-gray-600 space-y-1">
                    <div className="font-bold text-[#1C1411]">UPI Payment Reference:</div>
                    <div>UTR / Ref: <span className="font-mono font-bold text-[#B85D00]">{selectedOrder.payment_confirmation.utr_number}</span></div>
                    {selectedOrder.payment_confirmation.verified_at && (
                      <div className="text-emerald-700 font-semibold">Payment Verified on: {new Date(selectedOrder.payment_confirmation.verified_at).toLocaleDateString('en-IN')}</div>
                    )}
                  </div>
                )}

                {/* Post-order WhatsApp link strictly for this order */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href={`https://wa.me/918374044445?text=${encodeURIComponent(
                      `Hello Sivaji Firecracker Admin, checking status of my Diwali order ${selectedOrder.order_number} (Amount: ₹${selectedOrder.final_amount}).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <span>WhatsApp Admin (+91 83740 44445)</span>
                  </a>

                  <button
                    onClick={() => window.print()}
                    className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white border border-[#E2D7C5] font-bold text-xs text-[#550C12] hover:bg-[#FAF8F5] transition"
                  >
                    <Printer className="w-4 h-4 inline mr-1" />
                    <span>Print Invoice</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function CustomerAccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-8"><Loader2 className="w-8 h-8 text-[#C98E2A] animate-spin" /></div>}>
      <AccountPortal />
    </Suspense>
  );
}

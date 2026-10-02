"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { api } from '@/services/api';
import {
  User,
  Package,
  Clock,
  Phone,
  MapPin,
  Truck,
  LogOut,
  ExternalLink,
  MessageCircle,
  CheckCircle,
  FileText,
  X,
  Printer,
} from 'lucide-react';

interface OrderItem {
  id: number;
  product_name: string;
  product_sku: string;
  box_quantity: number;
  quantity_unit: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

interface OrderRecord {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  city: string;
  state: string;
  pincode: string;
  transport_hub: string;
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

export default function CustomerAccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string>('');
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('sivaji_token');
    const savedUser = localStorage.getItem('sivaji_user');

    if (!savedToken || !savedUser) {
      // User is not logged in
      setUser(null);
      setLoadingOrders(false);
      return;
    }

    try {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);

      // Fetch customer orders from API
      api.getCustomerOrders(savedToken)
        .then((res) => {
          if (res.data) setOrders(res.data);
        })
        .catch((err) => {
          console.warn('Could not load orders from API:', err);
        })
        .finally(() => setLoadingOrders(false));
    } catch (e) {
      setUser(null);
      setLoadingOrders(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('sivaji_token');
    localStorage.removeItem('sivaji_user');
    setUser(null);
    router.push('/login');
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
        label: 'Packed in Sivakasi Warehouse',
        className: 'bg-blue-100 text-blue-900 border-blue-300',
      },
      dispatched: {
        label: 'Dispatched via Lorry Transport',
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

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between font-sans">
        <Navbar />
        <main className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FFF8ED] text-[#B85D00] border border-[#C98E2A]/30 flex items-center justify-center mx-auto shadow-sm">
            <User className="w-8 h-8 text-[#C98E2A]" />
          </div>
          <h1 className="font-serif text-3xl font-black text-[#550C12]">Customer Account</h1>
          <p className="text-xs sm:text-sm text-[#66574F] max-w-sm mx-auto">
            Please log in or register an account to view your past Diwali cracker orders and track lorry transport bookings.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link
              href="/login"
              className="px-6 py-2.5 rounded-xl bg-[#550C12] hover:bg-[#7B141C] text-white font-serif font-bold text-xs shadow-md transition"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-6 py-2.5 rounded-xl bg-white border border-[#E2D7C5] hover:bg-[#FAF8F5] text-[#550C12] font-serif font-bold text-xs shadow-sm transition"
            >
              Create Account
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between font-sans">
      <Navbar />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8">
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl border border-[#E2D7C5] shadow-regal p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#550C12] to-[#7B141C] text-white flex items-center justify-center font-serif font-black text-2xl shadow-md shrink-0">
              {user.name?.charAt(0) || 'C'}
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#B85D00] uppercase tracking-wider bg-[#FFF8ED] px-2.5 py-0.5 rounded-full border border-[#C98E2A]/30">
                Verified Sivaji Customer
              </span>
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
              className="px-4 py-2.5 rounded-xl bg-[#FFF8ED] border border-[#C98E2A]/40 text-[#550C12] text-xs font-bold hover:bg-[#F2EBE0] transition"
            >
              + Place New Order
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-700 text-xs font-bold transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* 2 Columns: Saved Delivery Info on Left, Orders on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 4 COLS: Default Shipping & Transport Profile */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-[#E2D7C5] shadow-regal p-6 space-y-4">
            <h2 className="font-serif font-bold text-base text-[#1C1411] pb-3 border-b border-[#E2D7C5] flex items-center justify-between">
              <span>Delivery Profile</span>
              <span className="text-[10px] font-mono font-bold text-[#B85D00] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {user.city || 'Hyderabad'}
              </span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-gray-500 block mb-0.5">Default Delivery Address:</span>
                <div className="font-medium text-[#1C1411] bg-[#FAF8F5] p-3 rounded-xl border border-[#E2D7C5] leading-relaxed">
                  {user.address_line || 'Plot 42, Jubilee Hills Road No. 36'}, {user.city || 'Hyderabad'}, {user.state || 'Telangana'} - {user.pincode || '500034'}
                </div>
              </div>

              <div>
                <span className="text-gray-500 block mb-0.5">Preferred Sivakasi Transport Hub:</span>
                <div className="font-bold text-[#7B141C] flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#C98E2A]" />
                  <span>{user.transport_hub || 'VRL Logistics (Hyderabad Hub)'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 text-[11px] text-[#66574F]">
                Need to change delivery location? Mention in order notes or WhatsApp our admin dispatch desk at <strong>+91 83740 44445</strong>.
              </div>
            </div>
          </div>

          {/* RIGHT 8 COLS: Orders History */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E2D7C5] shadow-regal overflow-hidden">
            <div className="p-6 border-b border-[#E2D7C5] bg-[#FAF8F5] flex items-center justify-between">
              <div>
                <h2 className="font-serif font-black text-lg text-[#1C1411]">
                  Your Diwali Cracker Orders
                </h2>
                <p className="text-xs text-[#66574F]">
                  Real-time status tracking and payment verification receipts.
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
                  Browse our Sivakasi wholesale price sheet and book your Diwali crackers with up to 80% discount.
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
        </div>

        {/* Modal: Order Details & Invoice */}
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
                    {selectedOrder.delivery_address}, {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}
                  </div>
                  <div className="text-[#7B141C] font-semibold mt-1">
                    Transport: {selectedOrder.transport_hub}
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

                {/* WhatsApp Admin Action */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href={`https://wa.me/918374044445?text=${encodeURIComponent(
                      `Hello Sivaji Crackers Admin, checking status of my Diwali order ${selectedOrder.order_number} (Amount: ₹${selectedOrder.final_amount}).`
                    )}`}
                    target="_blank"
                    className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <MessageCircle className="w-4 h-4" />
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

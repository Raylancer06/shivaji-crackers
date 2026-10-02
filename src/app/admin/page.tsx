"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminApi, AdminDashboardMetrics } from '@/services/supabaseAdmin';
import {
  ShoppingBag,
  IndianRupee,
  Clock,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  Truck,
  ShieldCheck,
  Package,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<AdminDashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getDashboardMetrics();
      setMetrics(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-serif font-black text-[#550C12]">
            Store Operations Dashboard
          </h1>
          <p className="text-xs text-[#66574F] mt-1 font-medium">
            Sivaji Firecracker • Hyderabad Hub Administration
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchMetrics}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-[#550C12] bg-white border border-[#C98E2A]/30 rounded-xl hover:bg-[#FFF8ED] transition shadow-xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
          <Link
            href="/admin/payments"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#550C12] rounded-xl hover:bg-[#7B141C] transition shadow-sm"
          >
            <span>Verify Payments</span>
            {metrics && metrics.pendingPaymentsCount > 0 && (
              <span className="bg-[#C98E2A] text-[#1C1411] px-1.5 py-0.5 rounded-full text-[10px] font-extrabold">
                {metrics.pendingPaymentsCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          {error}
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#66574F]">
              Total Orders
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#550C12]/10 flex items-center justify-center text-[#550C12]">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-[#1C1411]">
              {loading ? '—' : (metrics?.totalOrders ?? 0)}
            </div>
            <Link
              href="/admin/orders"
              className="mt-2 text-[11px] font-bold text-[#7B141C] hover:text-[#550C12] flex items-center gap-1 inline-flex"
            >
              <span>View all orders</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Verified Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#66574F]">
              Verified Revenue
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-700">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-emerald-800">
              {loading
                ? '—'
                : `₹${(metrics?.totalRevenue ?? 0).toLocaleString('en-IN')}`}
            </div>
            <p className="mt-2 text-[11px] font-medium text-emerald-600">
              From verified & fulfilled orders
            </p>
          </div>
        </div>

        {/* Pending Verification Queue */}
        <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-xs relative overflow-hidden bg-gradient-to-br from-amber-50/40 to-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              Pending Payments
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-700">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-amber-900">
              {loading ? '—' : (metrics?.pendingPaymentsCount ?? 0)}
            </div>
            <Link
              href="/admin/payments"
              className="mt-2 text-[11px] font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1 inline-flex"
            >
              <span>Action verification queue</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#66574F]">
              Low Stock Items
            </span>
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-[#1C1411]">
              {loading ? '—' : (metrics?.outOfStockCount ?? 0)}
            </div>
            <Link
              href="/admin/products"
              className="mt-2 text-[11px] font-bold text-red-700 hover:text-red-900 flex items-center gap-1 inline-flex"
            >
              <span>Check inventory alerts</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Banner */}
      <div className="bg-gradient-to-r from-[#550C12] via-[#7B141C] to-[#550C12] rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#F0B543]" />
            <h3 className="font-serif font-black text-base text-white">
              UPI Order Verification Standard
            </h3>
          </div>
          <p className="text-xs text-white/80 max-w-xl">
            Orders placed via manual UPI to <strong className="text-[#F0B543]">sivajiduddempudi422@axl</strong> appear in the verification queue. Verify payment screenshots against the reference number before moving orders to processing.
          </p>
        </div>
        <Link
          href="/admin/payments"
          className="px-5 py-2.5 rounded-xl bg-[#C98E2A] text-[#1C1411] font-bold text-xs hover:bg-[#d89e35] transition shrink-0 shadow-sm"
        >
          Review Pending Screenshots
        </Link>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="font-serif font-black text-base text-[#1C1411]">
              Recent Customer Orders
            </h2>
            <p className="text-[11px] text-[#66574F]">
              Latest checkout requests received across Telangana & Andhra Pradesh
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-[#7B141C] hover:text-[#550C12] flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[#66574F] font-bold uppercase tracking-wider text-[10px] border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Order Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#66574F]">
                    Loading recent orders...
                  </td>
                </tr>
              ) : !metrics?.recentOrders || metrics.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#66574F]">
                    No orders placed yet.
                  </td>
                </tr>
              ) : (
                metrics.recentOrders.map((order: any) => {
                  const isVerified = order.payment_status === 'verified';
                  const isSubmitted = order.payment_status === 'submitted';

                  return (
                    <tr key={order.id} className="hover:bg-stone-50/70 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#550C12]">
                        {order.order_number}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#1C1411]">
                          {order.customer_name}
                        </div>
                        <div className="text-[10px] text-[#66574F]">
                          {order.customer_phone}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[#66574F]">
                        {order.city || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-[#66574F]">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#1C1411]">
                        ₹{Number(order.final_total).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isVerified
                              ? 'bg-emerald-100 text-emerald-800'
                              : isSubmitted
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {order.payment_status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="capitalize px-2 py-0.5 rounded-md bg-stone-100 text-[#1C1411] font-semibold text-[10px]">
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/admin/orders?search=${order.order_number}`}
                          className="text-[#7B141C] hover:text-[#550C12] font-bold text-[11px] underline"
                        >
                          View Order
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

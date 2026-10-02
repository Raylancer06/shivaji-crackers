"use client";

import React, { useState, useEffect } from 'react';
import { adminApi } from '@/services/supabaseAdmin';
import {
  Users,
  Search,
  RefreshCw,
  Phone,
  Mail,
  ShoppingBag,
  Shield,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getCustomers();
      setCustomers(data);
    } catch (err) {
      console.error('Failed to load customers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filtered = customers.filter((c) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(term) ||
      c.phone?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-black text-[#550C12]">
            Customer Directory
          </h1>
          <p className="text-xs text-[#66574F] mt-1 font-medium">
            Registered customer accounts, contact details, and lifetime order histories
          </p>
        </div>

        <button
          onClick={fetchCustomers}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#550C12] bg-white border border-[#C98E2A]/30 rounded-xl hover:bg-[#FFF8ED] transition shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#C98E2A]"
          />
        </div>
        <span className="text-xs text-[#66574F] font-bold">
          {filtered.length} Customer{filtered.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[#66574F] font-bold uppercase tracking-wider text-[10px] border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Registered Date</th>
                <th className="py-3 px-4">Total Orders</th>
                <th className="py-3 px-4 text-right">Lifetime Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#66574F]">
                    Loading registered customers...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#66574F]">
                    No customers found matching search.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50/70 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#1C1411]">
                        {c.name || 'Anonymous User'}
                      </div>
                      <div className="text-[10px] font-mono text-stone-400">
                        ID: {c.id.substring(0, 8)}...
                      </div>
                    </td>

                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-[#1C1411]">
                        <Phone className="w-3 h-3 text-[#C98E2A]" />
                        <span>{c.phone || '—'}</span>
                      </div>
                      {c.email && (
                        <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
                          <Mail className="w-3 h-3 text-stone-400" />
                          <span>{c.email}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {c.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#550C12] text-white">
                          <ShieldCheck className="w-3 h-3 text-[#F0B543]" />
                          <span>Admin</span>
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700">
                          Customer
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-[#66574F]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        <span>
                          {new Date(c.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-[#1C1411]">
                        <ShoppingBag className="w-3.5 h-3.5 text-[#C98E2A]" />
                        <span>{c.orders_count} orders</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-extrabold text-[#550C12] text-sm">
                      ₹{Number(c.total_spent).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

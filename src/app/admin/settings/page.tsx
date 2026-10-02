"use client";

import React, { useState, useEffect } from 'react';
import { adminApi } from '@/services/supabaseAdmin';
import {
  Settings,
  Save,
  RefreshCw,
  CreditCard,
  Building,
  Phone,
  Truck,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    business_name: 'Sivaji Firecracker',
    business_city: 'Hyderabad',
    business_state: 'Telangana',
    minimum_cart_value: '2000',
    upi_id: 'sivajiduddempudi422@axl',
    upi_payee_name: 'Sivaji Duddempudi',
    support_phone: '+91 98765 43210',
    support_email: 'support@sivajifirecrackers.com',
    shipping_charge: '0',
    free_shipping_threshold: '3000',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getSettings();
      setSettings((prev) => ({ ...prev, ...data }));
    } catch (err) {
      console.error('Failed to load settings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (key: string, val: string) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    try {
      await adminApi.updateSettings(settings);
      setSuccessMsg('Store settings updated successfully.');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(`Failed to save settings: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-black text-[#550C12]">
            Store & Business Configuration
          </h1>
          <p className="text-xs text-[#66574F] mt-1 font-medium">
            Manage UPI payment endpoints, checkout minimum limits, and store identification
          </p>
        </div>

        <button
          onClick={fetchSettings}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#550C12] bg-white border border-[#C98E2A]/30 rounded-xl hover:bg-[#FFF8ED] transition shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Reload</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Business Branding & Location */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
            <Building className="w-4 h-4 text-[#C98E2A]" />
            <h2 className="font-serif font-black text-sm text-[#1C1411]">
              Business Identity & Operations Hub
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#1C1411] mb-1">
                Business Name
              </label>
              <input
                type="text"
                required
                value={settings.business_name || 'Sivaji Firecracker'}
                onChange={(e) => handleChange('business_name', e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-bold"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">
                Official registered storefront brand
              </span>
            </div>

            <div>
              <label className="block font-bold text-[#1C1411] mb-1">
                Operational City
              </label>
              <input
                type="text"
                required
                value={settings.business_city || 'Hyderabad'}
                onChange={(e) => handleChange('business_city', e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">
                Hyderabad, Telangana
              </span>
            </div>

            <div>
              <label className="block font-bold text-[#1C1411] mb-1">
                State
              </label>
              <input
                type="text"
                required
                value={settings.business_state || 'Telangana'}
                onChange={(e) => handleChange('business_state', e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* UPI Payment Gateway Details */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
            <CreditCard className="w-4 h-4 text-[#C98E2A]" />
            <h2 className="font-serif font-black text-sm text-[#1C1411]">
              Manual UPI Payment Configuration
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#1C1411] mb-1">
                UPI ID (VPA) *
              </label>
              <input
                type="text"
                required
                value={settings.upi_id || 'sivajiduddempudi422@axl'}
                onChange={(e) => handleChange('upi_id', e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono font-bold text-[#550C12]"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">
                Customers will send payment to this UPI VPA
              </span>
            </div>

            <div>
              <label className="block font-bold text-[#1C1411] mb-1">
                UPI Payee Account Name *
              </label>
              <input
                type="text"
                required
                value={settings.upi_payee_name || 'Sivaji Duddempudi'}
                onChange={(e) => handleChange('upi_payee_name', e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-bold"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">
                Official name shown on Google Pay, PhonePe, Paytm
              </span>
            </div>
          </div>
        </div>

        {/* Minimum Order Value & Delivery */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
            <Truck className="w-4 h-4 text-[#C98E2A]" />
            <h2 className="font-serif font-black text-sm text-[#1C1411]">
              Cart Rules & Delivery Charges
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#1C1411] mb-1">
                Minimum Cart Subtotal (₹) *
              </label>
              <input
                type="number"
                min="500"
                step="100"
                required
                value={settings.minimum_cart_value || '2000'}
                onChange={(e) => handleChange('minimum_cart_value', e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono font-bold text-[#550C12]"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">
                Enforced by atomic order stored procedure
              </span>
            </div>

            <div>
              <label className="block font-bold text-[#1C1411] mb-1">
                Base Shipping Charge (₹)
              </label>
              <input
                type="number"
                min="0"
                value={settings.shipping_charge || '0'}
                onChange={(e) => handleChange('shipping_charge', e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">
                Set 0 for free delivery
              </span>
            </div>

            <div>
              <label className="block font-bold text-[#1C1411] mb-1">
                Free Shipping Threshold (₹)
              </label>
              <input
                type="number"
                min="0"
                value={settings.free_shipping_threshold || '3000'}
                onChange={(e) => handleChange('free_shipping_threshold', e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono"
              />
            </div>
          </div>
        </div>

        {/* Support & Contact */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
            <Phone className="w-4 h-4 text-[#C98E2A]" />
            <h2 className="font-serif font-black text-sm text-[#1C1411]">
              Customer Support & Contact Info
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#1C1411] mb-1">
                Support WhatsApp / Phone
              </label>
              <input
                type="text"
                value={settings.support_phone || ''}
                onChange={(e) => handleChange('support_phone', e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1C1411] mb-1">
                Support Email Address
              </label>
              <input
                type="email"
                value={settings.support_email || ''}
                onChange={(e) => handleChange('support_email', e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#550C12] text-white font-bold text-xs hover:bg-[#7B141C] transition shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Settings...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

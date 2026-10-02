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
  ShieldCheck,
  Lock,
  Mail,
  MessageCircle,
  KeyRound,
  Eye,
  EyeOff,
  User,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    business_name: 'Sivaji Firecracker',
    business_city: 'Hyderabad',
    business_state: 'Telangana',
    minimum_cart_value: '2000',
    upi_id: 'sivajiduddempudi422@axl',
    upi_payee_name: 'Sivaji Duddempudi',
    support_phone: '+91 83740 44445',
    support_email: 'sivajiduddempudi42@gmail.com',
    admin_email: 'sivajiduddempudi42@gmail.com',
    admin_notification_email: 'sivajiduddempudi42@gmail.com',
    admin_whatsapp_number: '918374044445',
    shipping_charge: '150',
    free_shipping_enabled: 'false',
    free_shipping_threshold: '5000',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Admin Profile & Credentials State
  const [adminEmail, setAdminEmail] = useState('sivajiduddempudi42@gmail.com');
  const [adminPhone, setAdminPhone] = useState('+91 83740 44445');
  const [adminFullName, setAdminFullName] = useState('Sivaji Duddempudi');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminCredLoading, setAdminCredLoading] = useState(false);
  const [adminCredSuccess, setAdminCredSuccess] = useState<string | null>(null);
  const [adminCredError, setAdminCredError] = useState<string | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getSettings();
      setSettings((prev) => ({ ...prev, ...data }));
      if (data.admin_notification_email || data.admin_email) {
        setAdminEmail(data.admin_notification_email || data.admin_email);
      }
      if (data.admin_whatsapp_number || data.support_phone) {
        setAdminPhone(data.admin_whatsapp_number || data.support_phone);
      }
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

  const handleUpdateAdminCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminCredLoading(true);
    setAdminCredSuccess(null);
    setAdminCredError(null);

    try {
      if (adminPassword && adminPassword.trim().length < 6) {
        throw new Error('Password must be at least 6 characters long.');
      }

      await adminApi.updateAdminCredentials({
        email: adminEmail.trim(),
        password: adminPassword.trim() || undefined,
        phone: adminPhone.trim(),
        fullName: adminFullName.trim(),
      });

      setAdminCredSuccess('Admin login email, password, and order notification channels updated successfully!');
      setAdminPassword('');
      fetchSettings();
      setTimeout(() => setAdminCredSuccess(null), 5000);
    } catch (err: any) {
      setAdminCredError(err.message || 'Failed to update admin credentials.');
    } finally {
      setAdminCredLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    try {
      await adminApi.updateSettings({
        ...settings,
        admin_email: adminEmail.trim(),
        admin_notification_email: adminEmail.trim(),
        admin_whatsapp_number: adminPhone.replace(/\D/g, ''),
      });
      setSuccessMsg('Store settings updated successfully.');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(`Failed to save settings: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-black text-[#550C12]">
            Store & Business Configuration
          </h1>
          <p className="text-xs text-[#66574F] mt-1 font-medium">
            Manage admin credentials, instant order alerts, UPI payments, and shipping rules
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

      {/* 1. DEDICATED ADMIN ACCOUNT & NOTIFICATION SETTINGS */}
      <div className="bg-gradient-to-br from-white to-[#FFFDF9] rounded-2xl p-6 border-2 border-[#C98E2A]/40 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2D7C5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#550C12] text-[#F0B543] flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif font-black text-sm text-[#1C1411]">
                Admin Account & Real-Time Order Notifications
              </h2>
              <span className="text-[11px] text-[#66574F] block">
                Manage login credentials and destination channels for WhatsApp & Email order alerts
              </span>
            </div>
          </div>
          <span className="hidden sm:inline px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FFF8ED] border border-[#C98E2A]/40 text-[#B85D00]">
            Owner Control
          </span>
        </div>

        {adminCredSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{adminCredSuccess}</span>
          </div>
        )}

        {adminCredError && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{adminCredError}</span>
          </div>
        )}

        <form onSubmit={handleUpdateAdminCredentials} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#1C1411] mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#C98E2A]" />
                <span>Admin Login & Notification Email *</span>
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="sivajiduddempudi42@gmail.com"
                className="w-full px-3 py-2.5 bg-white border border-[#E2D7C5] rounded-xl font-medium text-[#1C1411] focus:outline-none focus:ring-2 focus:ring-[#C98E2A]"
              />
              <span className="text-[10px] text-stone-500 mt-1 block">
                All order alerts and portal login use this email address
              </span>
            </div>

            <div>
              <label className="block font-bold text-[#1C1411] mb-1 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Admin WhatsApp Alert Number *</span>
              </label>
              <input
                type="text"
                required
                value={adminPhone}
                onChange={(e) => setAdminPhone(e.target.value)}
                placeholder="+91 83740 44445"
                className="w-full px-3 py-2.5 bg-white border border-[#E2D7C5] rounded-xl font-medium text-[#1C1411] focus:outline-none focus:ring-2 focus:ring-[#C98E2A]"
              />
              <span className="text-[10px] text-stone-500 mt-1 block">
                Receives pre-formatted 1-click WhatsApp order notifications
              </span>
            </div>

            <div>
              <label className="block font-bold text-[#1C1411] mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#C98E2A]" />
                <span>Admin Display Name</span>
              </label>
              <input
                type="text"
                value={adminFullName}
                onChange={(e) => setAdminFullName(e.target.value)}
                placeholder="Sivaji Duddempudi"
                className="w-full px-3 py-2.5 bg-white border border-[#E2D7C5] rounded-xl font-medium text-[#1C1411] focus:outline-none focus:ring-2 focus:ring-[#C98E2A]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1C1411] mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#C98E2A]" />
                <span>Change Admin Password</span>
              </label>
              <div className="relative">
                <input
                  type={showAdminPassword ? 'text' : 'password'}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Leave blank to keep unchanged"
                  className="w-full pl-3 pr-10 py-2.5 bg-white border border-[#E2D7C5] rounded-xl font-medium text-[#1C1411] focus:outline-none focus:ring-2 focus:ring-[#C98E2A]"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                  aria-label={showAdminPassword ? "Hide password" : "Show password"}
                >
                  {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <span className="text-[10px] text-stone-500 mt-1 block">
                Enter 6+ characters only if you wish to change your password
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={adminCredLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#550C12] to-[#7B141C] text-white font-bold text-xs hover:shadow-md transition cursor-pointer disabled:opacity-50"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#F0B543]" />
              <span>{adminCredLoading ? 'Updating Admin Account...' : 'Update Admin Credentials & Alert Channels'}</span>
            </button>
          </div>
        </form>
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
              Cart Rules & Delivery Charges (Backend Controlled)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#1C1411] mb-1">
                Minimum Cart Subtotal (₹) *
              </label>
              <input
                type="number"
                min="0"
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
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono font-bold text-[#1C1411]"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">
                Applied to cart & checkout when free shipping is off
              </span>
            </div>

            <div>
              <label className="block font-bold text-[#1C1411] mb-1">
                Free Shipping Policy
              </label>
              <select
                value={settings.free_shipping_enabled === 'true' ? 'true' : 'false'}
                onChange={(e) => handleChange('free_shipping_enabled', e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-bold text-xs"
              >
                <option value="false">Disabled (Always Charge Shipping)</option>
                <option value="true">Enabled (Free Above Threshold)</option>
              </select>
              <span className="text-[10px] text-stone-400 mt-1 block">
                No automatic or hardcoded free delivery
              </span>
            </div>

            <div>
              <label className="block font-bold text-[#1C1411] mb-1">
                Free Shipping Threshold (₹)
              </label>
              <input
                type="number"
                min="0"
                disabled={settings.free_shipping_enabled !== 'true'}
                value={settings.free_shipping_threshold || '5000'}
                onChange={(e) => handleChange('free_shipping_threshold', e.target.value)}
                className={`w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono ${
                  settings.free_shipping_enabled !== 'true' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              />
              <span className="text-[10px] text-stone-400 mt-1 block">
                {settings.free_shipping_enabled === 'true'
                  ? 'Orders >= this amount get ₹0 delivery'
                  : 'Inactive (Free shipping is disabled)'}
              </span>
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

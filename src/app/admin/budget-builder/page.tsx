"use client";

import React, { useState, useEffect } from 'react';
import { adminApi } from '@/services/supabaseAdmin';
import {
  Gift,
  Plus,
  RefreshCw,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  X,
  Sparkles,
  Save,
  Check,
  Eye,
  Sliders,
  Package,
} from 'lucide-react';

interface BudgetPackageItem {
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

export default function AdminBudgetBuilderPage() {
  const [packages, setPackages] = useState<BudgetPackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Section copy settings
  const [sectionSettings, setSectionSettings] = useState({
    budget_builder_enabled: 'true',
    budget_builder_badge: 'Instant 1-Click Bundle Calculator',
    budget_builder_title: 'Smart Budget Builder For Families & Societies',
    budget_builder_subtitle: 'Curated Diwali celebration bundles tailored for every budget',
    budget_builder_description: "Don't have time to pick 40 individual crackers? Select your celebration budget below. Our master packers have balanced sparklers, flower pots, and sky shots to give you the highest variety and savings.",
  });

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Partial<BudgetPackageItem> | null>(null);
  const [skusRaw, setSkusRaw] = useState('');
  const [savingPackage, setSavingPackage] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pkgs, settings] = await Promise.all([
        adminApi.getBudgetPackages(),
        adminApi.getSettings(),
      ]);

      setPackages(pkgs);

      setSectionSettings({
        budget_builder_enabled: settings.budget_builder_enabled ?? 'true',
        budget_builder_badge: settings.budget_builder_badge ?? 'Instant 1-Click Bundle Calculator',
        budget_builder_title: settings.budget_builder_title ?? 'Smart Budget Builder For Families & Societies',
        budget_builder_subtitle: settings.budget_builder_subtitle ?? 'Curated Diwali celebration bundles tailored for every budget',
        budget_builder_description: settings.budget_builder_description ?? "Don't have time to pick 40 individual crackers? Select your celebration budget below. Our master packers have balanced sparklers, flower pots, and sky shots to give you the highest variety and savings.",
      });
    } catch (err) {
      console.error('Failed to load budget builder data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSuccess(false);
    try {
      await adminApi.updateSettings(sectionSettings);
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
    } catch (err: any) {
      alert(`Error saving section settings: ${err.message}`);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingPackage({
      id: `bundle_${Date.now()}`,
      name: '',
      subtitle: '',
      tag: 'Festive Choice',
      budget: 3500,
      mrp: 12000,
      description: '',
      items_summary: '',
      item_skus: [{ sku: 'PROD-105', qty: 2 }],
      sort_order: (packages.length + 1),
      is_active: true,
    });
    setSkusRaw('PROD-105: 2\nPROD-011: 5');
    setModalOpen(true);
  };

  const handleOpenEdit = (pkg: BudgetPackageItem) => {
    setEditingPackage({ ...pkg });
    const skusText = Array.isArray(pkg.item_skus)
      ? pkg.item_skus.map((item) => `${item.sku}: ${item.qty}`).join('\n')
      : '';
    setSkusRaw(skusText);
    setModalOpen(true);
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage || !editingPackage.name || !editingPackage.budget) {
      alert('Please fill in the package name and budget price.');
      return;
    }

    // Parse skus from raw text
    const parsedSkus: { sku: string; qty: number }[] = [];
    skusRaw.split('\n').forEach((line) => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const sku = parts[0].trim();
        const qty = parseInt(parts[1].trim(), 10) || 1;
        if (sku) parsedSkus.push({ sku, qty });
      } else if (line.trim()) {
        parsedSkus.push({ sku: line.trim(), qty: 1 });
      }
    });

    setSavingPackage(true);
    try {
      await adminApi.saveBudgetPackage({
        ...editingPackage,
        item_skus: parsedSkus,
      });
      setModalOpen(false);
      await fetchData();
    } catch (err: any) {
      alert(`Error saving package: ${err.message}`);
    } finally {
      setSavingPackage(false);
    }
  };

  const handleDeletePackage = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete bundle "${name}"?`)) return;
    try {
      await adminApi.deleteBudgetPackage(id);
      await fetchData();
    } catch (err: any) {
      alert(`Error deleting package: ${err.message}`);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      await adminApi.toggleBudgetPackage(id, !currentActive);
      setPackages((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_active: !currentActive } : p))
      );
    } catch (err: any) {
      alert(`Error updating package status: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-black text-[#550C12] flex items-center gap-2.5">
            <Gift className="w-6 h-6 text-[#C98E2A]" />
            <span>Smart Budget Builder Section</span>
          </h1>
          <p className="text-xs text-[#66574F] mt-1 font-medium">
            Control the curated Diwali bundles, section title, description, and prices directly from backend
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#550C12] bg-white border border-[#C98E2A]/30 rounded-xl hover:bg-[#FFF8ED] transition shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#550C12] rounded-xl hover:bg-[#7B141C] transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Bundle</span>
          </button>
        </div>
      </div>

      {/* Section 1: Visibility & Copy Controls */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2 font-serif font-bold text-base text-[#1C1411]">
            <Sliders className="w-4 h-4 text-[#C98E2A]" />
            <span>Homepage Section Banner & Copy Settings</span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={sectionSettings.budget_builder_enabled === 'true'}
              onChange={(e) =>
                setSectionSettings({
                  ...sectionSettings,
                  budget_builder_enabled: e.target.checked ? 'true' : 'false',
                })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            <span className="ml-2.5 text-xs font-bold text-[#1C1411]">
              {sectionSettings.budget_builder_enabled === 'true' ? 'Section Enabled' : 'Section Hidden'}
            </span>
          </label>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1C1411] mb-1">
                Badge Tag Text
              </label>
              <input
                type="text"
                value={sectionSettings.budget_builder_badge}
                onChange={(e) =>
                  setSectionSettings({ ...sectionSettings, budget_builder_badge: e.target.value })
                }
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#C98E2A] font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1411] mb-1">
                Main Section Heading
              </label>
              <input
                type="text"
                value={sectionSettings.budget_builder_title}
                onChange={(e) =>
                  setSectionSettings({ ...sectionSettings, budget_builder_title: e.target.value })
                }
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#C98E2A] font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1411] mb-1">
              Section Subtitle Accent
            </label>
            <input
              type="text"
              value={sectionSettings.budget_builder_subtitle}
              onChange={(e) =>
                setSectionSettings({ ...sectionSettings, budget_builder_subtitle: e.target.value })
              }
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#C98E2A] font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1411] mb-1">
              Section Description Paragraph
            </label>
            <textarea
              rows={2}
              value={sectionSettings.budget_builder_description}
              onChange={(e) =>
                setSectionSettings({ ...sectionSettings, budget_builder_description: e.target.value })
              }
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#C98E2A]"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {settingsSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                <span>Section copy updated on live website!</span>
              </span>
            )}
            <div className="ml-auto">
              <button
                type="submit"
                disabled={savingSettings}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#550C12] hover:bg-[#7B141C] text-white text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingSettings ? 'Saving...' : 'Save Section Settings'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Section 2: Budget Packages Cards & Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-bold text-lg text-[#1C1411] flex items-center gap-2">
            <Package className="w-5 h-5 text-[#C98E2A]" />
            <span>Configured Bundles ({packages.length})</span>
          </h2>
          <span className="text-xs text-[#66574F]">
            Displayed as interactive 3-column cards on home page
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-[#66574F] bg-white rounded-2xl border border-stone-200">
            Loading budget packages...
          </div>
        ) : packages.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#66574F] bg-white rounded-2xl border border-stone-200">
            No celebration packages configured. Click &quot;Add New Bundle&quot; above to create one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => {
              const savings = pkg.mrp - pkg.budget;
              return (
                <div
                  key={pkg.id}
                  className={`bg-white rounded-3xl p-6 border transition-all relative flex flex-col justify-between shadow-xs ${
                    pkg.is_active
                      ? 'border-[#E2D7C5] hover:border-[#550C12] hover:shadow-regal'
                      : 'border-stone-200 opacity-60 bg-stone-50'
                  }`}
                >
                  <div>
                    {/* Top Row: Tag & Status */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-serif text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFF8ED] text-[#B85D00] border border-[#C98E2A]/30">
                        {pkg.tag || 'Diwali Pack'}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          pkg.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {pkg.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </div>

                    <h3 className="font-serif font-black text-lg text-[#1C1411]">
                      {pkg.name}
                    </h3>
                    {pkg.subtitle && (
                      <p className="text-xs text-[#7B141C] font-medium mt-0.5">
                        {pkg.subtitle}
                      </p>
                    )}

                    <div className="flex items-baseline gap-2 my-3">
                      <span className="font-serif font-black text-2xl text-[#550C12]">
                        ₹{Number(pkg.budget).toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        MRP ₹{Number(pkg.mrp).toLocaleString('en-IN')}
                      </span>
                      {savings > 0 && (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          Save ₹{savings.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#66574F] line-clamp-3 mb-3">
                      {pkg.description}
                    </p>

                    <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E2D7C5] text-[11px] text-[#1C1411] space-y-1 mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#B85D00] block">
                        Box Breakdown:
                      </span>
                      <p className="line-clamp-2">{pkg.items_summary || 'Included festive varieties'}</p>
                    </div>

                    <div className="text-[10px] text-stone-400 font-mono">
                      Order: {pkg.sort_order} • SKUs: {pkg.item_skus?.length || 0} items linked
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(pkg.id, pkg.is_active)}
                      className={`text-xs font-bold px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                        pkg.is_active
                          ? 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      {pkg.is_active ? 'Disable' : 'Enable'}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(pkg)}
                        className="p-1.5 text-stone-600 hover:text-[#550C12] hover:bg-stone-100 rounded-lg transition cursor-pointer"
                        title="Edit Bundle"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePackage(pkg.id, pkg.name)}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                        title="Delete Bundle"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit / Add Modal */}
      {modalOpen && editingPackage && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif font-bold text-lg text-[#550C12] flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#C98E2A]" />
                <span>{editingPackage.id?.startsWith('bundle_') ? 'Add New Bundle' : 'Edit Bundle'}</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1C1411] mb-1">
                    Bundle Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPackage.name || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })}
                    placeholder="e.g. Diwali Anandham Family Pack"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#C98E2A] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1C1411] mb-1">
                    Tag / Badge
                  </label>
                  <input
                    type="text"
                    value={editingPackage.tag || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, tag: e.target.value })}
                    placeholder="e.g. Meets Minimum Order, Best Value"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#C98E2A] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1411] mb-1">
                  Subtitle Accent
                </label>
                <input
                  type="text"
                  value={editingPackage.subtitle || ''}
                  onChange={(e) => setEditingPackage({ ...editingPackage, subtitle: e.target.value })}
                  placeholder="e.g. Essential Family Celebration (30 Items + Sparklers)"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#C98E2A] font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1C1411] mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingPackage.budget || ''}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, budget: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#C98E2A] font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1C1411] mb-1">
                    Original MRP (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingPackage.mrp || ''}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, mrp: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#C98E2A] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1C1411] mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingPackage.sort_order ?? 1}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, sort_order: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#C98E2A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1411] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingPackage.description || ''}
                  onChange={(e) =>
                    setEditingPackage({ ...editingPackage, description: e.target.value })
                  }
                  placeholder="Highlights of this bundle..."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#C98E2A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1411] mb-1">
                  Box Breakdown Summary
                </label>
                <input
                  type="text"
                  value={editingPackage.items_summary || ''}
                  onChange={(e) =>
                    setEditingPackage({ ...editingPackage, items_summary: e.target.value })
                  }
                  placeholder="e.g. Family Gift Box (30 Items) + 5 Boxes Sparklers + Flower Pots"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#C98E2A]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#1C1411]">
                    Included Products (SKU & Quantity)
                  </label>
                  <span className="text-[10px] text-stone-500 font-mono">Format: SKU: Quantity (one per line)</span>
                </div>
                <textarea
                  rows={3}
                  value={skusRaw}
                  onChange={(e) => setSkusRaw(e.target.value)}
                  placeholder="PROD-105: 2&#10;PROD-011: 5&#10;PROD-034: 4"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl font-mono focus:outline-none focus:border-[#C98E2A]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pkgActive"
                  checked={editingPackage.is_active ?? true}
                  onChange={(e) =>
                    setEditingPackage({ ...editingPackage, is_active: e.target.checked })
                  }
                  className="rounded text-[#550C12] focus:ring-[#C98E2A]"
                />
                <label htmlFor="pkgActive" className="text-xs font-bold text-[#1C1411] cursor-pointer">
                  Bundle is Active & Visible
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPackage}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#550C12] hover:bg-[#7B141C] rounded-xl transition shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {savingPackage ? 'Saving...' : 'Save Bundle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

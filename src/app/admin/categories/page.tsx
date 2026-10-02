"use client";

import React, { useState, useEffect } from 'react';
import { adminApi, AdminCategory } from '@/services/supabaseAdmin';
import {
  Layers,
  Plus,
  RefreshCw,
  Edit2,
  CheckCircle,
  XCircle,
  X,
  ArrowUpDown,
} from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<AdminCategory> | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory({
      name: '',
      slug: '',
      description: '',
      sort_order: (categories.length + 1) * 10,
      is_active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (c: AdminCategory) => {
    setEditingCategory({ ...c });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name) return;
    setSaving(true);
    try {
      await adminApi.saveCategory(editingCategory);
      setModalOpen(false);
      await fetchCategories();
    } catch (err: any) {
      alert(`Error saving category: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-black text-[#550C12]">
            Category Hierarchy
          </h1>
          <p className="text-xs text-[#66574F] mt-1 font-medium">
            Manage product collections, display sequences, and category descriptions
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchCategories}
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
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[#66574F] font-bold uppercase tracking-wider text-[10px] border-b border-stone-200">
              <tr>
                <th className="py-3 px-4 w-16">Sort</th>
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#66574F]">
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#66574F]">
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50/70 transition">
                    <td className="py-3 px-4 font-mono font-bold text-stone-500">
                      {c.sort_order}
                    </td>

                    <td className="py-3 px-4 font-bold text-[#1C1411]">
                      {c.name}
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-stone-500">
                      {c.slug}
                    </td>

                    <td className="py-3 px-4 text-[#66574F] max-w-md truncate">
                      {c.description || '—'}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.is_active
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {c.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100 hover:text-[#550C12] transition cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {modalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif font-black text-lg text-[#550C12]">
                {editingCategory.id ? 'Edit Category' : 'New Category'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#1C1411] mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#C98E2A]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1C1411] mb-1">
                  Slug (URL identifier)
                </label>
                <input
                  type="text"
                  placeholder="auto-generated if empty"
                  value={editingCategory.slug || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#C98E2A] font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1C1411] mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={editingCategory.sort_order ?? 10}
                  onChange={(e) => setEditingCategory({ ...editingCategory, sort_order: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1C1411] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCategory.is_active ?? true}
                    onChange={(e) => setEditingCategory({ ...editingCategory, is_active: e.target.checked })}
                    className="rounded text-[#550C12]"
                  />
                  <span className="font-bold text-[#1C1411]">Active on Store Navigation</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-stone-100 text-stone-600 font-bold text-xs hover:bg-stone-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1.5 rounded-xl bg-[#550C12] text-white font-bold text-xs hover:bg-[#7B141C] transition cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

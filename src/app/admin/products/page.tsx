"use client";

import React, { useState, useEffect } from 'react';
import { adminApi, AdminProduct, AdminCategory } from '@/services/supabaseAdmin';
import {
  Package,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Edit2,
  Trash2,
  Upload,
  AlertTriangle,
  CheckCircle,
  X,
  Layers,
  IndianRupee,
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<AdminProduct> | null>(null);

  // Stock Adjustment State
  const [stockItem, setStockItem] = useState<AdminProduct | null>(null);
  const [newStockVal, setNewStockVal] = useState<number>(0);
  const [stockReason, setStockReason] = useState<string>('Inventory replenishment');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        adminApi.getProducts(searchTerm, selectedCategory),
        adminApi.getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleOpenAdd = () => {
    const defaultCat = categories[0]?.slug || 'single-crackers';
    setEditingProduct({
      name: '',
      sku: `SF-${Date.now().toString().slice(-4)}`,
      category_slug: defaultCat,
      mrp: 100,
      selling_price: 60,
      box_quantity: 1,
      quantity_unit: 'box',
      sound_level: 'Medium',
      stock_quantity: 50,
      low_stock_threshold: 5,
      is_active: true,
      is_featured: false,
      is_bestseller: false,
      green_certified: true,
      image_url: '/crackers/sound/2-sound-crackers.png',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p: AdminProduct) => {
    setEditingProduct({ ...p });
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const publicUrl = await adminApi.uploadProductImage(file);
      setEditingProduct((prev) => (prev ? { ...prev, image_url: publicUrl } : null));
    } catch (err: any) {
      alert(`Image upload failed: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name) return;

    // Enforce business discount rule: max 80% discount
    const mrp = Number(editingProduct.mrp || 0);
    const selling = Number(editingProduct.selling_price || 0);
    if (mrp > 0 && selling < mrp * 0.2) {
      alert('Selling price cannot exceed an 80% discount under Sivaji Firecracker pricing guidelines.');
      return;
    }

    setSaving(true);
    try {
      await adminApi.saveProduct(editingProduct);
      setModalOpen(false);
      await fetchData();
    } catch (err: any) {
      alert(`Error saving product: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (p: AdminProduct) => {
    if (!confirm(`Are you sure you want to delete "${p.name}"?`)) return;
    try {
      await adminApi.deleteProduct(p.id);
      await fetchData();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleOpenStockAdjust = (p: AdminProduct) => {
    setStockItem(p);
    setNewStockVal(p.stock_quantity);
    setStockReason('Physical audit adjustment');
    setStockModalOpen(true);
  };

  const handleSaveStock = async () => {
    if (!stockItem) return;
    setSaving(true);
    try {
      await adminApi.adjustStock(stockItem.id, newStockVal, stockReason);
      setStockModalOpen(false);
      await fetchData();
    } catch (err: any) {
      alert(`Stock adjust failed: ${err.message}`);
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
            Product Catalog & Inventory
          </h1>
          <p className="text-xs text-[#66574F] mt-1 font-medium">
            Manage crackers, real-time stock levels, MRPs, and active storefront listings
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
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Category selector */}
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#C98E2A] shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-[#C98E2A]"
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search product name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#C98E2A] w-64"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl bg-[#C98E2A] text-[#1C1411] font-bold text-xs hover:bg-[#d89e35] transition cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[#66574F] font-bold uppercase tracking-wider text-[10px] border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Pricing</th>
                <th className="py-3 px-4">Packaging</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#66574F]">
                    Loading catalog products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#66574F]">
                    No products found matching criteria.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const discountPct = p.mrp > 0 ? Math.round(((p.mrp - p.selling_price) / p.mrp) * 100) : 0;
                  const isLow = p.stock_quantity <= (p.low_stock_threshold || 5);

                  return (
                    <tr key={p.id} className="hover:bg-stone-50/70 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden shrink-0 flex items-center justify-center">
                            <img
                              src={p.image_url || '/placeholder.png'}
                              alt={p.name}
                              className="w-full h-full object-contain p-1"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/logo.png';
                              }}
                            />
                          </div>
                          <div>
                            <div className="font-bold text-[#1C1411] text-xs">
                              {p.name}
                            </div>
                            <div className="text-[10px] font-mono text-stone-500">
                              SKU: {p.sku}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-[#66574F] capitalize">
                        {p.category_slug.replace(/-/g, ' ')}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-black text-[#550C12] text-sm">
                          ₹{p.selling_price}
                        </div>
                        <div className="text-[10px] text-stone-400">
                          MRP: <span className="line-through">₹{p.mrp}</span> ({discountPct}% OFF)
                        </div>
                      </td>

                      <td className="py-3 px-4 text-[#66574F] text-[11px]">
                        <div>{p.box_quantity} {p.quantity_unit}</div>
                        {p.pieces && <div className="text-stone-400">{p.pieces}</div>}
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleOpenStockAdjust(p)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-mono font-bold text-xs cursor-pointer transition ${
                            isLow
                              ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                          }`}
                          title="Click to adjust stock"
                        >
                          <span>{p.stock_quantity} in stock</span>
                        </button>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.is_active
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-200 text-stone-600'
                          }`}
                        >
                          {p.is_active ? 'Active' : 'Draft'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100 hover:text-[#550C12] transition cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p)}
                          className="p-1.5 rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-serif font-black text-xl text-[#550C12]">
                {editingProduct.id ? 'Edit Product' : 'Add New Firecracker'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              {/* Image Upload Row */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="w-20 h-20 rounded-xl bg-white border border-stone-200 overflow-hidden flex items-center justify-center shrink-0">
                  <img
                    src={editingProduct.image_url || '/placeholder.png'}
                    alt="Preview"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <label className="block font-bold text-[#1C1411]">
                    Product Image (Supabase Storage)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="text-xs text-stone-600 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#550C12] file:text-white hover:file:bg-[#7B141C] cursor-pointer"
                  />
                  {uploadingImage && (
                    <span className="text-[10px] text-amber-700 font-bold block animate-pulse">
                      Uploading to product-images bucket...
                    </span>
                  )}
                  <input
                    type="text"
                    placeholder="Or enter image URL directly"
                    value={editingProduct.image_url || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                    className="w-full px-2.5 py-1 text-[11px] bg-white border border-stone-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Name & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1C1411] mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#C98E2A]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1C1411] mb-1">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.sku || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#C98E2A] font-mono"
                  />
                </div>
              </div>

              {/* Category & Sound Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1C1411] mb-1">
                    Category *
                  </label>
                  <select
                    value={editingProduct.category_slug || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category_slug: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#C98E2A]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#1C1411] mb-1">
                    Sound Level
                  </label>
                  <select
                    value={editingProduct.sound_level || 'Medium'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sound_level: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#C98E2A]"
                  >
                    <option value="Low">Low Sound</option>
                    <option value="Medium">Medium Sound</option>
                    <option value="High">High Sound</option>
                    <option value="Silent">Silent / Visual Only</option>
                  </select>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-[#1C1411] mb-1">
                    MRP (₹) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingProduct.mrp ?? 100}
                    onChange={(e) => setEditingProduct({ ...editingProduct, mrp: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1C1411] mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingProduct.selling_price ?? 60}
                    onChange={(e) => setEditingProduct({ ...editingProduct, selling_price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-bold text-[#550C12]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1C1411] mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingProduct.stock_quantity ?? 50}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock_quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1C1411] mb-1">
                    Low Stock Alert
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingProduct.low_stock_threshold ?? 5}
                    onChange={(e) => setEditingProduct({ ...editingProduct, low_stock_threshold: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Packaging info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#1C1411] mb-1">
                    Box Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingProduct.box_quantity ?? 1}
                    onChange={(e) => setEditingProduct({ ...editingProduct, box_quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1C1411] mb-1">
                    Unit Type
                  </label>
                  <input
                    type="text"
                    value={editingProduct.quantity_unit || 'box'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, quantity_unit: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1C1411] mb-1">
                    Pieces Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10 Pcs / Box"
                    value={editingProduct.pieces || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, pieces: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_active ?? true}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_active: e.target.checked })}
                    className="rounded text-[#550C12]"
                  />
                  <span className="font-bold text-[#1C1411]">Active on Store</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_featured ?? false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_featured: e.target.checked })}
                    className="rounded text-[#550C12]"
                  />
                  <span className="font-bold text-[#1C1411]">Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_bestseller ?? false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_bestseller: e.target.checked })}
                    className="rounded text-[#550C12]"
                  />
                  <span className="font-bold text-[#1C1411]">Bestseller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.green_certified ?? true}
                    onChange={(e) => setEditingProduct({ ...editingProduct, green_certified: e.target.checked })}
                    className="rounded text-[#550C12]"
                  />
                  <span className="font-bold text-[#1C1411]">Green Certified</span>
                </label>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-[#1C1411] mb-1">
                  Product Description
                </label>
                <textarea
                  rows={2}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Clean product description without Sivakasi or manufacturer claims..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#550C12] hover:bg-[#7B141C] rounded-xl transition shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Stock Adjustment Dialog */}
      {stockModalOpen && stockItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-serif font-bold text-base text-[#550C12]">
                Adjust Inventory Stock
              </h3>
              <button
                onClick={() => setStockModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs font-bold text-[#1C1411]">
              {stockItem.name}
            </p>
            <p className="text-[11px] text-[#66574F]">
              Current Stock: <strong className="font-mono">{stockItem.stock_quantity}</strong>
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#1C1411] mb-1">
                  New Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={newStockVal}
                  onChange={(e) => setNewStockVal(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1411] mb-1">
                  Reason for Adjustment
                </label>
                <input
                  type="text"
                  value={stockReason}
                  onChange={(e) => setStockReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setStockModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl bg-stone-100 text-stone-600 font-bold text-xs hover:bg-stone-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStock}
                disabled={saving}
                className="px-4 py-1.5 rounded-xl bg-[#550C12] text-white font-bold text-xs hover:bg-[#7B141C] transition cursor-pointer disabled:opacity-50"
              >
                {saving ? 'Updating...' : 'Save Stock'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

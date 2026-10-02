"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { adminApi, AdminOrder } from '@/services/supabaseAdmin';
import {
  Search,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  Package,
  Printer,
  ChevronDown,
  X,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
} from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Orders' },
  { value: 'pending_verification', label: 'Pending Verification' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function AdminOrdersPage() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getOrders(selectedStatus, searchTerm);
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const openOrderDetail = async (order: AdminOrder) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setAdminNotes(order.admin_notes || '');
    setModalOpen(true);
    setScreenshotUrl(null);

    // If there is an attached payment screenshot, resolve signed URL
    const latestPayment = order.payments?.[0];
    const path = latestPayment?.screenshot_storage_path || latestPayment?.screenshot_url;
    if (path) {
      const signed = await adminApi.getScreenshotUrl(path);
      setScreenshotUrl(signed);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      await adminApi.updateOrderStatus(selectedOrder.id, newStatus, adminNotes);
      setModalOpen(false);
      await fetchOrders();
    } catch (err: any) {
      alert(`Error updating order: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-black text-[#550C12]">
            Customer Orders
          </h1>
          <p className="text-xs text-[#66574F] mt-1 font-medium">
            Manage checkout requests, status progressions, and packaging slips
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-[#550C12] bg-white border border-[#C98E2A]/30 rounded-xl hover:bg-[#FFF8ED] transition shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {STATUS_OPTIONS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedStatus(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedStatus === tab.value
                  ? 'bg-[#550C12] text-white shadow-xs'
                  : 'bg-stone-100 text-[#66574F] hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search order #, customer, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#C98E2A] w-64"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-xl bg-[#C98E2A] text-[#1C1411] font-bold text-xs hover:bg-[#d89e35] transition cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[#66574F] font-bold uppercase tracking-wider text-[10px] border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Order Details</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Delivery Destination</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4">Order Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#66574F]">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#66574F]">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const isVerified = order.payment_status === 'verified';
                  const isSubmitted = order.payment_status === 'submitted';

                  return (
                    <tr key={order.id} className="hover:bg-stone-50/70 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-black text-[#550C12] text-xs">
                          {order.order_number}
                        </div>
                        <div className="text-[10px] text-[#66574F] mt-0.5">
                          {new Date(order.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <div className="text-[10px] text-[#66574F]">
                          {order.order_items?.length || 0} items
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#1C1411]">
                          {order.customer_name}
                        </div>
                        <div className="text-[10px] text-[#66574F]">
                          {order.customer_phone}
                        </div>
                        {order.customer_email && (
                          <div className="text-[10px] text-stone-400">
                            {order.customer_email}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="text-[#1C1411] truncate font-medium">
                          {order.city}, {order.state}
                        </div>
                        <div className="text-[10px] text-[#66574F] truncate">
                          {order.delivery_address}
                        </div>
                        <div className="text-[10px] font-mono text-stone-500">
                          PIN: {order.pincode}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-[#1C1411] text-sm">
                          ₹{Number(order.final_total).toLocaleString('en-IN')}
                        </div>
                        {Number(order.shipping_charge) > 0 ? (
                          <div className="text-[10px] text-stone-400">
                            +₹{order.shipping_charge} shipping
                          </div>
                        ) : (
                          <div className="text-[10px] text-emerald-600 font-bold">
                            Free Shipping
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
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
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize ${
                            order.status === 'delivered'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : order.status === 'shipped'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : order.status === 'confirmed'
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              : order.status === 'cancelled'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => openOrderDetail(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-[#550C12] hover:text-white text-[#550C12] font-bold text-xs transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Manage</span>
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

      {/* Order Details & Actions Modal */}
      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-black text-xl text-[#550C12]">
                    Order #{selectedOrder.order_number}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-bold uppercase">
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-[#66574F] mt-1">
                  Placed on {new Date(selectedOrder.created_at).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 transition cursor-pointer"
                  title="Print Slip"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 rounded-xl text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Customer & Delivery Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF8F5] p-4 rounded-2xl border border-[#C98E2A]/20 text-xs">
              <div className="space-y-1.5">
                <h4 className="font-bold text-[#550C12] uppercase tracking-wider text-[10px]">
                  Customer Information
                </h4>
                <div className="font-bold text-[#1C1411] text-sm">
                  {selectedOrder.customer_name}
                </div>
                <div className="flex items-center gap-1.5 text-[#66574F]">
                  <Phone className="w-3.5 h-3.5 text-[#C98E2A]" />
                  <span>{selectedOrder.customer_phone}</span>
                </div>
                {selectedOrder.customer_email && (
                  <div className="flex items-center gap-1.5 text-[#66574F]">
                    <Mail className="w-3.5 h-3.5 text-[#C98E2A]" />
                    <span>{selectedOrder.customer_email}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-[#550C12] uppercase tracking-wider text-[10px]">
                  Shipping Address
                </h4>
                <div className="flex items-start gap-1.5 text-[#1C1411]">
                  <MapPin className="w-3.5 h-3.5 text-[#C98E2A] mt-0.5 shrink-0" />
                  <div>
                    <div>{selectedOrder.delivery_address}</div>
                    {selectedOrder.landmark && (
                      <div className="text-stone-500 text-[11px]">
                        Landmark: {selectedOrder.landmark}
                      </div>
                    )}
                    <div className="font-bold">
                      {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items Table */}
            <div>
              <h4 className="font-bold text-xs text-[#1C1411] uppercase tracking-wider mb-3">
                Order Items ({selectedOrder.order_items?.length || 0})
              </h4>
              <div className="border border-stone-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-600 font-bold uppercase text-[10px] border-b border-stone-200">
                    <tr>
                      <th className="py-2.5 px-3">Item</th>
                      <th className="py-2.5 px-3 text-center">Unit Price</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {selectedOrder.order_items?.map((item: any) => (
                      <tr key={item.id}>
                        <td className="py-2.5 px-3 font-semibold text-[#1C1411]">
                          {item.product_name}
                          {item.sku && (
                            <span className="text-[10px] text-stone-400 block font-mono">
                              SKU: {item.sku}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center text-[#66574F]">
                          ₹{Number(item.unit_price).toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-[#1C1411]">
                          {item.quantity}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-[#550C12]">
                          ₹{Number(item.total_price).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Order Totals Summary */}
              <div className="mt-3 flex justify-end">
                <div className="w-64 space-y-1.5 text-xs text-[#66574F]">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium text-[#1C1411]">
                      ₹{Number(selectedOrder.subtotal).toLocaleString('en-IN')}
                    </span>
                  </div>
                  {Number(selectedOrder.discount) > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount:</span>
                      <span>-₹{Number(selectedOrder.discount).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span className="font-medium text-[#1C1411]">
                      {Number(selectedOrder.shipping_charge) > 0
                        ? `₹${selectedOrder.shipping_charge}`
                        : 'FREE'}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-black text-[#550C12]">
                    <span>Final Total:</span>
                    <span>₹{Number(selectedOrder.final_total).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* UPI Payment Status & Attached Screenshot */}
            {selectedOrder.payments && selectedOrder.payments.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2 text-xs">
                <h4 className="font-bold text-amber-900 uppercase tracking-wider text-[10px]">
                  Attached UPI Payment Proof
                </h4>
                {selectedOrder.payments.map((p: any) => (
                  <div key={p.id} className="space-y-1">
                    <div className="flex items-center gap-4">
                      <span>Status: <strong className="uppercase">{p.status}</strong></span>
                      {(p.utr_transaction_id || p.reference_number) && (
                        <span>UPI Ref / UTR: <strong className="font-mono">{p.utr_transaction_id || p.reference_number}</strong></span>
                      )}
                    </div>
                    {screenshotUrl && (
                      <div className="pt-2">
                        <a
                          href={screenshotUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#550C12] underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>View Signed Payment Screenshot</span>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Management Controls: Status & Notes */}
            <div className="space-y-4 pt-4 border-t border-stone-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1C1411] mb-1">
                    Order Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#C98E2A] font-medium"
                  >
                    <option value="pending_verification">Pending Verification</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1C1411] mb-1">
                    Admin Internal Notes
                  </label>
                  <textarea
                    rows={2}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add fulfillment notes, dispatch tracking, etc."
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#C98E2A]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateStatus}
                  disabled={updating}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#550C12] hover:bg-[#7B141C] rounded-xl transition shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Save Order Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

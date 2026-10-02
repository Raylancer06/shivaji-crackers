"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminApi } from '@/services/supabaseAdmin';
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  RefreshCw,
  ExternalLink,
  MessageCircle,
  X,
  AlertCircle,
} from 'lucide-react';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'submitted' | 'all' | 'verified' | 'rejected'>('submitted');
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getPayments(filter);
      setPayments(data);
    } catch (err) {
      console.error('Failed to load payments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  const handleOpenScreenshot = async (payment: any) => {
    const path = payment.screenshot_storage_path || payment.screenshot_url;
    if (!path) return;
    const url = await adminApi.getScreenshotUrl(path);
    setSelectedScreenshot(url);
    setSelectedPayment(payment);
    setPreviewModalOpen(true);
  };

  const handleVerify = async (payment: any) => {
    if (!confirm(`Verify payment for Order #${payment.orders?.order_number}?`)) return;
    setProcessing(true);
    try {
      await adminApi.verifyPayment(payment.id, payment.order_id);
      await fetchPayments();
      setPreviewModalOpen(false);
    } catch (err: any) {
      alert(`Verification failed: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const openRejectModal = (payment: any) => {
    setSelectedPayment(payment);
    setRejectReason('UTR reference mismatch or incomplete payment screenshot');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedPayment) return;
    setProcessing(true);
    try {
      await adminApi.rejectPayment(selectedPayment.id, selectedPayment.order_id, rejectReason);
      setRejectModalOpen(false);
      setPreviewModalOpen(false);
      await fetchPayments();
    } catch (err: any) {
      alert(`Rejection failed: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-black text-[#550C12]">
            Payment Verification Queue
          </h1>
          <p className="text-xs text-[#66574F] mt-1 font-medium">
            Verify manual UPI screenshots submitted by customers to sivajiduddempudi422@axl
          </p>
        </div>

        <button
          onClick={fetchPayments}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-[#550C12] bg-white border border-[#C98E2A]/30 rounded-xl hover:bg-[#FFF8ED] transition shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
        {[
          { key: 'submitted', label: 'Pending Verification' },
          { key: 'all', label: 'All Payments' },
          { key: 'verified', label: 'Verified' },
          { key: 'rejected', label: 'Rejected' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filter === tab.key
                ? 'bg-[#550C12] text-white shadow-xs'
                : 'bg-stone-100 text-[#66574F] hover:bg-stone-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[#66574F] font-bold uppercase tracking-wider text-[10px] border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">UTR / Reference</th>
                <th className="py-3 px-4">Submitted At</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#66574F]">
                    Loading payments...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#66574F]">
                    No payments found in this queue.
                  </td>
                </tr>
              ) : (
                payments.map((p) => {
                  const isSubmitted = p.status === 'submitted';
                  const isVerified = p.status === 'verified';
                  const isRejected = p.status === 'rejected';

                  return (
                    <tr key={p.id} className="hover:bg-stone-50/70 transition">
                      <td className="py-3.5 px-4">
                        <Link
                          href={`/admin/orders?search=${p.orders?.order_number}`}
                          className="font-mono font-bold text-[#550C12] hover:underline"
                        >
                          {p.orders?.order_number || 'N/A'}
                        </Link>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#1C1411]">
                          {p.orders?.customer_name || 'Customer'}
                        </div>
                        <div className="text-[10px] text-[#66574F]">
                          {p.orders?.customer_phone}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-black text-sm text-[#1C1411]">
                        ₹{Number(p.amount).toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-xs bg-stone-100 px-2 py-1 rounded-md text-[#550C12]">
                          {p.utr_transaction_id || p.reference_number || '—'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-[#66574F]">
                        {new Date(p.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            isVerified
                              ? 'bg-emerald-100 text-emerald-800'
                              : isSubmitted
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {p.status.toUpperCase()}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-2">
                        {(p.screenshot_storage_path || p.screenshot_url) && (
                          <button
                            onClick={() => handleOpenScreenshot(p)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 hover:bg-[#550C12] hover:text-white transition font-bold text-[11px] cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Proof</span>
                          </button>
                        )}

                        {isSubmitted && (
                          <>
                            <button
                              onClick={() => handleVerify(p)}
                              disabled={processing}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition font-bold text-[11px] cursor-pointer"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Verify</span>
                            </button>
                            <button
                              onClick={() => openRejectModal(p)}
                              disabled={processing}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition font-bold text-[11px] cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Screenshot Preview Modal */}
      {previewModalOpen && selectedScreenshot && selectedPayment && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <h3 className="font-serif font-bold text-base text-[#550C12]">
                  UPI Proof: Order #{selectedPayment.orders?.order_number}
                </h3>
                <p className="text-xs text-[#66574F]">
                  Ref: <strong className="font-mono">{selectedPayment.reference_number}</strong> • Amount: ₹{Number(selectedPayment.amount).toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 max-h-96 flex items-center justify-center">
              <img
                src={selectedScreenshot}
                alt="Payment proof screenshot"
                className="max-h-96 w-auto object-contain mx-auto"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <a
                href={selectedScreenshot}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#7B141C] hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in full tab</span>
              </a>

              {selectedPayment.status === 'submitted' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => openRejectModal(selectedPayment)}
                    className="px-3.5 py-1.5 rounded-xl bg-red-100 text-red-700 font-bold text-xs hover:bg-red-200 transition cursor-pointer"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleVerify(selectedPayment)}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition cursor-pointer shadow-sm"
                  >
                    Verify & Confirm Order
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectModalOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif font-bold text-base text-red-700">
                Reject Payment Proof
              </h3>
              <button
                onClick={() => setRejectModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#66574F]">
              Provide a clear reason for the customer. This will update the payment record and alert the customer on their account page.
            </p>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#C98E2A]"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl bg-stone-100 text-stone-600 font-bold text-xs hover:bg-stone-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={processing}
                className="px-4 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition cursor-pointer disabled:opacity-50"
              >
                {processing ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

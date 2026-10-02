@extends('admin.layout')

@section('title', 'Order ' . $order->order_number)

@section('content')
<div class="space-y-6">
    <!-- Breadcrumb & Top Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <a href="{{ route('admin.orders.index') }}" class="text-xs font-bold text-[#550C12] hover:underline mb-1 inline-block">
                ← Back to All Orders
            </a>
            <h1 class="font-serif font-black text-2xl sm:text-3xl text-[#1C1411]">
                Order <span class="font-mono text-[#B85D00]">{{ $order->order_number }}</span>
            </h1>
            <p class="text-xs text-[#66574F] mt-0.5">
                Placed on {{ $order->created_at->format('d M Y, h:i A') }} • Sivakasi Factory Allocation
            </p>
        </div>

        <div class="flex items-center gap-3">
            @php
                $cleanPhone = preg_replace('/[^0-9]/', '', $order->customer_phone);
                if (strlen($cleanPhone) === 10) $cleanPhone = '91' . $cleanPhone;
                $custWaMsg = "Hello {$order->customer_name}, regarding your Sivaji Firecracker order {$order->order_number} (Amount: ₹" . number_format($order->final_amount) . "). ";
                if ($order->status === 'confirmed') {
                    $custWaMsg .= "Your UPI payment has been VERIFIED. We are preparing your crackers for packaging.";
                } elseif ($order->status === 'dispatched') {
                    $custWaMsg .= "Your order has been DISPATCHED. Delivery tracking details will follow shortly.";
                } else {
                    $custWaMsg .= "We have received your order request and payment confirmation.";
                }
                $custWaLink = "https://wa.me/{$cleanPhone}?text=" . urlencode($custWaMsg);
            @endphp
            <a href="{{ $custWaLink }}" target="_blank" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                <span>WhatsApp Customer</span>
            </a>
        </div>
    </div>

    <!-- 2 Column Layout: Details on Left, Payment Verification on Right -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- LEFT 2 COLS: Order Items & Delivery Info -->
        <div class="lg:col-span-2 space-y-6">
            <!-- Customer Delivery Details Card -->
            <div class="bg-white rounded-3xl border border-[#E5DBC8] shadow-sm p-6">
                <h2 class="font-serif font-bold text-base text-[#1C1411] mb-4 pb-2 border-b border-[#E5DBC8] flex items-center justify-between">
                    <span>Customer & Delivery Details</span>
                    <span class="text-xs font-mono font-bold text-[#B85D00] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        {{ $order->city }} Destination
                    </span>
                </h2>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                        <div class="text-[#66574F] font-semibold">Customer Full Name</div>
                        <div class="font-bold text-[#1C1411] text-sm mt-0.5">{{ $order->customer_name }}</div>
                    </div>

                    <div>
                        <div class="text-[#66574F] font-semibold">WhatsApp Contact Number</div>
                        <div class="font-mono font-bold text-[#550C12] text-sm mt-0.5">{{ $order->customer_phone }}</div>
                    </div>

                    <div class="sm:col-span-2">
                        <div class="text-[#66574F] font-semibold">Delivery Address</div>
                        <div class="font-medium text-[#1C1411] mt-0.5 leading-relaxed bg-[#FAF8F5] p-3 rounded-xl border border-[#E5DBC8]">
                            {{ $order->delivery_address }}, {{ $order->city }}, {{ $order->state }} - {{ $order->pincode }}
                        </div>
                    </div>

                    @if($order->customer_notes)
                        <div class="sm:col-span-2">
                            <div class="text-[#66574F] font-semibold">Customer Instructions</div>
                            <div class="text-xs text-gray-700 italic mt-0.5 bg-yellow-50/50 p-2.5 rounded-lg border border-yellow-200">
                                "{{ $order->customer_notes }}"
                            </div>
                        </div>
                    @endif
                </div>
            </div>

            <!-- Ordered Crackers Table with Explicit Box Quantities -->
            <div class="bg-white rounded-3xl border border-[#E5DBC8] shadow-sm overflow-hidden">
                <div class="p-5 border-b border-[#E5DBC8] bg-[#FAF8F5] flex items-center justify-between">
                    <div>
                        <h2 class="font-serif font-bold text-base text-[#1C1411]">Ordered Factory Boxes</h2>
                        <p class="text-xs text-[#66574F]">All items display verified box piece counts.</p>
                    </div>
                    <span class="text-xs font-bold text-[#550C12] bg-white px-3 py-1 rounded-xl border border-[#E5DBC8]">
                        {{ $order->items->sum('quantity') }} Total Boxes
                    </span>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                        <thead class="bg-[#FAF8F5] text-[#5C4D44] font-bold uppercase text-[10px] tracking-wider border-b border-[#E5DBC8]">
                            <tr>
                                <th class="p-3.5">SKU</th>
                                <th class="p-3.5">Cracker Variety & Packaging</th>
                                <th class="p-3.5 text-center">Packaging Spec</th>
                                <th class="p-3.5 text-right">Factory MRP</th>
                                <th class="p-3.5 text-right">Wholesale Rate</th>
                                <th class="p-3.5 text-center">Boxes</th>
                                <th class="p-3.5 text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#E5DBC8]/60">
                            @foreach($order->items as $item)
                                <tr>
                                    <td class="p-3.5 font-mono font-bold text-[#B85D00]">{{ $item->product_sku }}</td>
                                    <td class="p-3.5 font-bold text-[#1C1411]">{{ $item->product_name }}</td>
                                    <td class="p-3.5 text-center whitespace-nowrap">
                                        <span class="inline-flex items-center gap-1 font-bold text-[11px] text-[#550C12] bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#E5DBC8]">
                                            Box: {{ $item->box_quantity }} {{ $item->quantity_unit }}
                                        </span>
                                    </td>
                                    <td class="p-3.5 text-right text-gray-400 line-through">₹{{ number_format($item->unit_mrp) }}</td>
                                    <td class="p-3.5 text-right font-black text-[#550C12]">₹{{ number_format($item->unit_price) }}</td>
                                    <td class="p-3.5 text-center font-bold text-sm">{{ $item->quantity }}</td>
                                    <td class="p-3.5 text-right font-black text-sm text-[#1C1411]">₹{{ number_format($item->subtotal) }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                        <tfoot class="bg-[#FAF8F5] font-bold text-xs border-t border-[#E5DBC8]">
                            <tr>
                                <td colspan="6" class="p-3 text-right text-gray-500 uppercase">Total Factory MRP:</td>
                                <td class="p-3 text-right line-through text-gray-400">₹{{ number_format($order->total_mrp) }}</td>
                            </tr>
                            <tr>
                                <td colspan="6" class="p-3 text-right text-emerald-700 uppercase">Direct Factory Savings (Up to 80%):</td>
                                <td class="p-3 text-right text-emerald-700">-₹{{ number_format($order->discount_amount) }}</td>
                            </tr>
                            <tr class="text-sm bg-amber-50/50">
                                <td colspan="6" class="p-4 text-right font-serif font-black text-[#550C12] uppercase">Net Wholesale Payable:</td>
                                <td class="p-4 text-right font-serif font-black text-base text-[#550C12]">₹{{ number_format($order->final_amount) }}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>

        <!-- RIGHT 1 COL: Payment Proof & Order Status Actions -->
        <div class="space-y-6">
            <!-- Payment Verification Card -->
            <div class="bg-white rounded-3xl border border-[#E5DBC8] shadow-sm p-6">
                <div class="flex items-center justify-between mb-4 pb-2 border-b border-[#E5DBC8]">
                    <h2 class="font-serif font-bold text-base text-[#1C1411]">UPI Payment Proof</h2>
                    @php
                        $paymentStatusBadges = [
                            'submitted' => 'bg-amber-100 text-amber-800',
                            'verified' => 'bg-emerald-100 text-emerald-800',
                            'rejected' => 'bg-red-100 text-red-800',
                            'pending' => 'bg-gray-100 text-gray-800',
                        ];
                    @endphp
                    <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full {{ $paymentStatusBadges[$order->payment_status] ?? 'bg-gray-100 text-gray-800' }}">
                        {{ $order->payment_status }}
                    </span>
                </div>

                <div class="space-y-3.5 text-xs">
                    <div>
                        <span class="text-[#66574F] font-semibold">Official Business UPI ID:</span>
                        <div class="font-mono font-bold text-sm text-[#550C12] bg-amber-50 p-2 rounded-xl border border-amber-200 mt-1">
                            sivajiduddempudi422@axl
                        </div>
                    </div>

                    @if($order->paymentConfirmation)
                        <div>
                            <span class="text-[#66574F] font-semibold">Customer Submitted UTR / Ref:</span>
                            <div class="font-mono font-black text-base text-[#B85D00] bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E5DBC8] mt-1 select-all">
                                {{ $order->paymentConfirmation->utr_number }}
                            </div>
                        </div>

                        <!-- Payment Screenshot Thumbnail with Lightbox Trigger -->
                        <div>
                            <span class="text-[#66574F] font-semibold block mb-1.5">Uploaded Payment Screenshot:</span>
                            <div class="relative group cursor-pointer rounded-2xl overflow-hidden border border-[#E5DBC8] bg-gray-100 aspect-video flex items-center justify-center shadow-inner" onclick="openScreenshotModal()">
                                <img
                                    id="screenshotImg"
                                    src="{{ $order->paymentConfirmation->screenshot_url }}"
                                    alt="Payment Screenshot"
                                    class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                />
                                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-bold text-xs gap-1.5">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
                                    <span>Click to Zoom Screenshot</span>
                                </div>
                            </div>
                        </div>

                        @if($order->paymentConfirmation->verified_at)
                            <div class="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
                                ✓ Verified by Admin on {{ $order->paymentConfirmation->verified_at->format('d M Y, h:i A') }}
                            </div>
                        @endif
                    @else
                        <div class="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center text-gray-500">
                            No payment confirmation or UTR submitted yet.
                        </div>
                    @endif
                </div>
            </div>

            <!-- Order Status Management Form -->
            <div class="bg-white rounded-3xl border border-[#E5DBC8] shadow-sm p-6">
                <h2 class="font-serif font-bold text-base text-[#1C1411] mb-3 pb-2 border-b border-[#E5DBC8]">
                    Order Status & Fulfillment
                </h2>

                <form action="{{ route('admin.orders.status', $order->id) }}" method="POST" class="space-y-4">
                    @csrf

                    <div>
                        <label class="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                            Update Order Lifecycle Status
                        </label>
                        <select name="status" class="w-full p-2.5 rounded-xl border border-[#E5DBC8] bg-[#FAF8F5] text-xs font-bold text-[#1C1411] outline-none focus:border-[#C98E2A]">
                            <option value="pending_verification" {{ $order->status === 'pending_verification' ? 'selected' : '' }}>
                                🟡 Pending Payment Verification
                            </option>
                            <option value="confirmed" {{ $order->status === 'confirmed' ? 'selected' : '' }}>
                                🟢 Confirmed & Payment Verified
                            </option>
                            <option value="packed" {{ $order->status === 'packed' ? 'selected' : '' }}>
                                🔵 Packed in Sivakasi Warehouse
                            </option>
                            <option value="dispatched" {{ $order->status === 'dispatched' ? 'selected' : '' }}>
                                🟣 Dispatched via Lorry Transport
                            </option>
                            <option value="delivered" {{ $order->status === 'delivered' ? 'selected' : '' }}>
                                🟢 Delivered to Hyderabad Customer
                            </option>
                            <option value="cancelled" {{ $order->status === 'cancelled' ? 'selected' : '' }}>
                                🔴 Cancelled
                            </option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                            Payment Verification Status
                        </label>
                        <select name="payment_status" class="w-full p-2.5 rounded-xl border border-[#E5DBC8] bg-[#FAF8F5] text-xs font-bold text-[#1C1411] outline-none focus:border-[#C98E2A]">
                            <option value="submitted" {{ $order->payment_status === 'submitted' ? 'selected' : '' }}>
                                Submitted (Reviewing)
                            </option>
                            <option value="verified" {{ $order->payment_status === 'verified' ? 'selected' : '' }}>
                                Verified & Credited
                            </option>
                            <option value="rejected" {{ $order->payment_status === 'rejected' ? 'selected' : '' }}>
                                Rejected (Invalid UTR/Amount)
                            </option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                            Internal Admin Notes
                        </label>
                        <textarea name="admin_notes" rows="2" placeholder="e.g. Order packed, tracking number assigned..." class="w-full p-2.5 rounded-xl border border-[#E5DBC8] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:border-[#C98E2A]">{{ $order->admin_notes }}</textarea>
                    </div>

                    <button type="submit" class="w-full py-3 px-4 rounded-xl bg-[#550C12] hover:bg-[#7B141C] text-white font-serif font-black text-xs uppercase tracking-wider shadow-md transition">
                        Save Order Status
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>

<!-- Modal: Payment Screenshot Lightbox Viewer -->
<div id="screenshotModal" class="fixed inset-0 z-50 hidden bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
    <div class="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-4 border border-[#E5DBC8]">
        <div class="flex items-center justify-between pb-3 border-b border-[#E5DBC8] mb-3">
            <div>
                <h3 class="font-serif font-bold text-base text-[#1C1411]">UPI Payment Screenshot Verification</h3>
                <p class="text-xs text-[#66574F]">Order {{ $order->order_number }} • UTR: {{ $order->paymentConfirmation->utr_number ?? 'N/A' }}</p>
            </div>
            <button onclick="closeScreenshotModal()" class="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center font-bold">
                ✕
            </button>
        </div>
        <div class="max-h-[75vh] overflow-auto flex items-center justify-center bg-[#140305] rounded-2xl p-2">
            @if($order->paymentConfirmation)
                <img src="{{ $order->paymentConfirmation->screenshot_url }}" alt="Full Screenshot" class="max-h-[70vh] w-auto object-contain rounded-lg">
            @endif
        </div>
        <div class="flex items-center justify-between pt-3 text-xs text-[#66574F]">
            <span>Amount: <strong class="text-[#550C12]">₹{{ number_format($order->final_amount) }}</strong></span>
            <span>UPI ID: <strong class="font-mono">sivajiduddempudi422@axl</strong></span>
        </div>
    </div>
</div>
@endsection

@section('scripts')
<script>
    function openScreenshotModal() {
        document.getElementById('screenshotModal').classList.remove('hidden');
    }
    function closeScreenshotModal() {
        document.getElementById('screenshotModal').classList.add('hidden');
    }
    // Close on backdrop
    document.getElementById('screenshotModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeScreenshotModal();
        }
    });
</script>
@endsection

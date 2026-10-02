@extends('admin.layout')

@section('title', 'Wholesale Operations Dashboard')

@section('content')
<div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h1 class="font-serif font-black text-2xl sm:text-3xl text-[#1C1411]">Store Operations Dashboard</h1>
            <p class="text-xs sm:text-sm text-[#66574F] mt-1">Live order tracking, customer management, and payment verification.</p>
        </div>
        <div class="flex items-center gap-3">
            <a href="{{ route('admin.orders.index', ['status' => 'pending_verification']) }}" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition">
                <span class="w-2 h-2 rounded-full bg-white animate-ping"></span>
                <span>Review Pending Payments ({{ $pendingPayments }})</span>
            </a>
            <a href="{{ route('admin.products.create') }}" class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#550C12] hover:bg-[#7B141C] text-white font-bold text-xs shadow-md transition">
                <span>+ Add Product</span>
            </a>
        </div>
    </div>

    <!-- 4 Key Metric Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <!-- Revenue Card -->
        <div class="bg-white p-5 rounded-2xl border border-[#E5DBC8] shadow-sm relative overflow-hidden">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-[#66574F] uppercase tracking-wider">Total Sales Volume</span>
                <span class="w-8 h-8 rounded-lg bg-amber-50 text-[#B85D00] flex items-center justify-center font-bold text-sm">₹</span>
            </div>
            <div class="font-serif font-black text-2xl sm:text-3xl text-[#550C12] mt-2">
                ₹{{ number_format($totalRevenue) }}
            </div>
            <div class="text-[11px] text-emerald-600 font-semibold mt-1">
                Wholesale direct gate rate
            </div>
        </div>

        <!-- Orders Card -->
        <div class="bg-white p-5 rounded-2xl border border-[#E5DBC8] shadow-sm">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-[#66574F] uppercase tracking-wider">Total Orders</span>
                <span class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                </span>
            </div>
            <div class="font-serif font-black text-2xl sm:text-3xl text-[#1C1411] mt-2">
                {{ $totalOrders }}
            </div>
            <div class="text-[11px] text-[#66574F] font-semibold mt-1">
                Processed via UPI flow
            </div>
        </div>

        <!-- Pending Payments Card -->
        <div class="bg-white p-5 rounded-2xl border border-red-200 bg-gradient-to-br from-white to-red-50/50 shadow-sm">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-red-700 uppercase tracking-wider">Awaiting Verification</span>
                <span class="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
                    {{ $pendingPayments }}
                </span>
            </div>
            <div class="font-serif font-black text-2xl sm:text-3xl text-red-700 mt-2">
                {{ $pendingPayments }}
            </div>
            <div class="text-[11px] text-red-600 font-semibold mt-1">
                Payment proofs awaiting approval
            </div>
        </div>

        <!-- Products Card -->
        <div class="bg-white p-5 rounded-2xl border border-[#E5DBC8] shadow-sm">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-[#66574F] uppercase tracking-wider">Catalog Varieties</span>
                <span class="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                </span>
            </div>
            <div class="font-serif font-black text-2xl sm:text-3xl text-[#1C1411] mt-2">
                {{ $totalProducts }}
            </div>
            <div class="text-[11px] text-[#07542C] font-semibold mt-1">
                All ≤ 80% max discount rule
            </div>
        </div>
    </div>

    <!-- Recent Orders Table -->
    <div class="bg-white rounded-3xl border border-[#E5DBC8] shadow-sm overflow-hidden">
        <div class="p-5 border-b border-[#E5DBC8] flex items-center justify-between bg-[#FAF8F5]">
            <div>
                <h2 class="font-serif font-bold text-lg text-[#1C1411]">Recent Orders & Payment Submissions</h2>
                <p class="text-xs text-[#66574F]">Click on any order to view payment screenshot and update delivery status.</p>
            </div>
            <a href="{{ route('admin.orders.index') }}" class="text-xs font-bold text-[#550C12] hover:underline">
                View All Orders →
            </a>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
                <thead class="bg-[#FAF8F5] text-[#5C4D44] font-bold uppercase text-[10px] tracking-wider border-b border-[#E5DBC8]">
                    <tr>
                        <th class="p-4">Order ID</th>
                        <th class="p-4">Customer</th>
                        <th class="p-4">Destination & Transport</th>
                        <th class="p-4 text-right">Order Amount</th>
                        <th class="p-4">Payment UTR</th>
                        <th class="p-4">Status</th>
                        <th class="p-4 text-center">Action</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-[#E5DBC8]/60">
                    @forelse($recentOrders as $order)
                        <tr class="hover:bg-[#FAF8F5]/80 transition">
                            <td class="p-4 font-mono font-bold text-[#B85D00]">
                                <a href="{{ route('admin.orders.show', $order->id) }}" class="hover:underline">
                                    {{ $order->order_number }}
                                </a>
                                <div class="text-[10px] font-normal text-gray-500 font-sans">
                                    {{ $order->created_at->format('d M, h:i A') }}
                                </div>
                            </td>
                            <td class="p-4">
                                <div class="font-bold text-[#1C1411]">{{ $order->customer_name }}</div>
                                <div class="text-[11px] text-gray-500 font-mono">{{ $order->customer_phone }}</div>
                            </td>
                            <td class="p-4">
                                <div class="font-semibold text-gray-800">{{ $order->city }}</div>
                                <div class="text-[11px] text-gray-500 truncate max-w-xs">{{ $order->delivery_address }}</div>
                            </td>
                            <td class="p-4 text-right font-black text-sm text-[#550C12]">
                                ₹{{ number_format($order->final_amount) }}
                                <div class="text-[10px] font-normal text-emerald-600">Saved ₹{{ number_format($order->discount_amount) }}</div>
                            </td>
                            <td class="p-4">
                                @if($order->paymentConfirmation)
                                    <span class="font-mono text-xs bg-amber-50 text-[#B85D00] px-2 py-0.5 rounded border border-amber-200">
                                        {{ $order->paymentConfirmation->utr_number }}
                                    </span>
                                @else
                                    <span class="text-gray-400 italic">Not submitted</span>
                                @endif
                            </td>
                            <td class="p-4">
                                @php
                                    $statusBadges = [
                                        'pending_verification' => 'bg-amber-100 text-amber-800 border-amber-300',
                                        'confirmed' => 'bg-emerald-100 text-emerald-800 border-emerald-300',
                                        'packed' => 'bg-blue-100 text-blue-800 border-blue-300',
                                        'dispatched' => 'bg-purple-100 text-purple-800 border-purple-300',
                                        'delivered' => 'bg-green-100 text-green-800 border-green-300',
                                        'cancelled' => 'bg-red-100 text-red-800 border-red-300',
                                    ];
                                    $badgeClass = $statusBadges[$order->status] ?? 'bg-gray-100 text-gray-800';
                                @endphp
                                <span class="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider {{ $badgeClass }}">
                                    {{ str_replace('_', ' ', $order->status) }}
                                </span>
                            </td>
                            <td class="p-4 text-center">
                                <a href="{{ route('admin.orders.show', $order->id) }}" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#550C12] hover:bg-[#7B141C] text-white text-xs font-bold transition">
                                    Review Proof
                                </a>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="p-8 text-center text-gray-500">
                                No orders placed yet.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection

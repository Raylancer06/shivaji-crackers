@extends('admin.layout')

@section('title', 'Orders & Payment Verifications')

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h1 class="font-serif font-black text-2xl sm:text-3xl text-[#1C1411]">Orders & Payment Verifications</h1>
            <p class="text-xs text-[#66574F] mt-1">Review customer payment screenshots, verify UTR, and update order fulfillment status.</p>
        </div>
    </div>

    <!-- Status Tabs Filter -->
    <div class="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E5DBC8]">
        @php
            $currentStatus = request('status', 'all');
            $tabs = [
                'all' => 'All Orders (' . $statusCounts['all'] . ')',
                'pending_verification' => 'Pending Verification (' . $statusCounts['pending_verification'] . ')',
                'confirmed' => 'Confirmed (' . $statusCounts['confirmed'] . ')',
                'packed' => 'Packed (' . $statusCounts['packed'] . ')',
                'dispatched' => 'Dispatched (' . $statusCounts['dispatched'] . ')',
                'delivered' => 'Delivered (' . $statusCounts['delivered'] . ')',
            ];
        @endphp

        @foreach($tabs as $key => $label)
            <a href="{{ route('admin.orders.index', ['status' => $key]) }}" class="px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap {{ $currentStatus === $key ? 'bg-[#550C12] text-white shadow-sm' : 'bg-white text-[#66574F] hover:bg-[#FAF8F5] border border-[#E5DBC8]' }}">
                {{ $label }}
            </a>
        @endforeach
    </div>

    <!-- Search Form -->
    <form action="{{ route('admin.orders.index') }}" method="GET" class="flex gap-3">
        <input type="hidden" name="status" value="{{ $currentStatus }}">
        <input
            type="text"
            name="search"
            value="{{ request('search') }}"
            placeholder="Search by Order ID (SIV-XXXXXX), Customer Name, or Phone..."
            class="flex-1 px-4 py-2.5 rounded-xl border border-[#E5DBC8] bg-white text-xs text-[#1C1411] outline-none focus:border-[#C98E2A]"
        />
        <button type="submit" class="px-4 py-2.5 rounded-xl bg-[#550C12] hover:bg-[#7B141C] text-white text-xs font-bold transition">
            Search
        </button>
        @if(request('search'))
            <a href="{{ route('admin.orders.index', ['status' => $currentStatus]) }}" class="px-3 py-2.5 rounded-xl bg-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-300 transition">
                Clear
            </a>
        @endif
    </form>

    <!-- Orders Table -->
    <div class="bg-white rounded-3xl border border-[#E5DBC8] shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
                <thead class="bg-[#FAF8F5] text-[#5C4D44] font-bold uppercase text-[10px] tracking-wider border-b border-[#E5DBC8]">
                    <tr>
                        <th class="p-4">Order ID & Date</th>
                        <th class="p-4">Customer Details</th>
                        <th class="p-4">Hyderabad Delivery & Transport</th>
                        <th class="p-4 text-center">Boxes</th>
                        <th class="p-4 text-right">Order Amount</th>
                        <th class="p-4">Payment UTR</th>
                        <th class="p-4">Status</th>
                        <th class="p-4 text-center">Action</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-[#E5DBC8]/60">
                    @forelse($orders as $order)
                        <tr class="hover:bg-[#FAF8F5]/80 transition">
                            <td class="p-4 font-mono font-bold text-[#B85D00]">
                                <a href="{{ route('admin.orders.show', $order->id) }}" class="hover:underline">
                                    {{ $order->order_number }}
                                </a>
                                <div class="text-[10px] font-normal text-gray-500 font-sans">
                                    {{ $order->created_at->format('d M Y, h:i A') }}
                                </div>
                            </td>
                            <td class="p-4">
                                <div class="font-bold text-[#1C1411]">{{ $order->customer_name }}</div>
                                <div class="text-[11px] text-gray-500 font-mono">{{ $order->customer_phone }}</div>
                            </td>
                            <td class="p-4">
                                <div class="font-semibold text-gray-800">{{ $order->city }}, {{ $order->state }}</div>
                                <div class="text-[11px] text-[#7B141C] truncate max-w-xs">{{ $order->transport_hub }}</div>
                            </td>
                            <td class="p-4 text-center font-bold">
                                {{ $order->items->sum('quantity') }}
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
                                    Manage Order
                                </a>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="8" class="p-8 text-center text-gray-500">
                                No orders matching criteria.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        @if($orders->hasPages())
            <div class="p-4 border-t border-[#E5DBC8] bg-[#FAF8F5]">
                {{ $orders->links() }}
            </div>
        @endif
    </div>
</div>
@endsection

@extends('admin.layout')

@section('title', 'Registered Customers')

@section('content')
<div class="space-y-6">
    <div>
        <h1 class="font-serif font-black text-2xl sm:text-3xl text-[#1C1411]">Registered Customers</h1>
        <p class="text-xs text-[#66574F] mt-1">Customers with registered accounts for order tracking and Hyderabad deliveries.</p>
    </div>

    <!-- Search Form -->
    <form action="{{ route('admin.customers.index') }}" method="GET" class="flex gap-3">
        <input
            type="text"
            name="search"
            value="{{ request('search') }}"
            placeholder="Search by customer name, phone, or email..."
            class="flex-1 px-4 py-2.5 rounded-xl border border-[#E5DBC8] bg-white text-xs text-[#1C1411] outline-none focus:border-[#C98E2A]"
        />
        <button type="submit" class="px-4 py-2.5 rounded-xl bg-[#550C12] hover:bg-[#7B141C] text-white text-xs font-bold transition">
            Search
        </button>
        @if(request('search'))
            <a href="{{ route('admin.customers.index') }}" class="px-3 py-2.5 rounded-xl bg-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-300 transition">
                Clear
            </a>
        @endif
    </form>

    <!-- Customers Table -->
    <div class="bg-white rounded-3xl border border-[#E5DBC8] shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
                <thead class="bg-[#FAF8F5] text-[#5C4D44] font-bold uppercase text-[10px] tracking-wider border-b border-[#E5DBC8]">
                    <tr>
                        <th class="p-4">Customer Name</th>
                        <th class="p-4">WhatsApp Phone</th>
                        <th class="p-4">Email</th>
                        <th class="p-4">City & State</th>
                        <th class="p-4 text-center">Orders Placed</th>
                        <th class="p-4">Registered Date</th>
                        <th class="p-4 text-center">Contact</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-[#E5DBC8]/60">
                    @forelse($customers as $customer)
                        <tr class="hover:bg-[#FAF8F5]/80 transition">
                            <td class="p-4 font-bold text-[#1C1411]">{{ $customer->name }}</td>
                            <td class="p-4 font-mono font-bold text-[#550C12]">{{ $customer->phone }}</td>
                            <td class="p-4 text-gray-600">{{ $customer->email }}</td>
                            <td class="p-4">
                                <div class="font-semibold text-gray-800">{{ $customer->city ?? 'Hyderabad' }}</div>
                                <div class="text-[11px] text-gray-500">{{ $customer->state ?? 'Telangana' }}</div>
                            </td>
                            <td class="p-4 text-center font-bold text-sm text-[#B85D00]">
                                {{ $customer->orders_count }}
                            </td>
                            <td class="p-4 text-gray-500">
                                {{ $customer->created_at->format('d M Y') }}
                            </td>
                            <td class="p-4 text-center">
                                @php
                                    $cleanPhone = preg_replace('/[^0-9]/', '', $customer->phone);
                                    if (strlen($cleanPhone) === 10) $cleanPhone = '91' . $cleanPhone;
                                @endphp
                                <a href="https://wa.me/{{ $cleanPhone }}" target="_blank" class="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] shadow-sm transition">
                                    WhatsApp
                                </a>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="p-8 text-center text-gray-500">
                                No registered customers yet.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        @if($customers->hasPages())
            <div class="p-4 border-t border-[#E5DBC8] bg-[#FAF8F5]">
                {{ $customers->links() }}
            </div>
        @endif
    </div>
</div>
@endsection

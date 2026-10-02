@extends('admin.layout')

@section('title', 'Product Catalog Management')

@section('content')
<div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h1 class="font-serif font-black text-2xl sm:text-3xl text-[#1C1411]">Cracker Catalog (157 Products)</h1>
            <p class="text-xs text-[#66574F] mt-1">Sivakasi factory inventory with strict ≤ 80% max discount enforcement and box quantities.</p>
        </div>
        <a href="{{ route('admin.products.create') }}" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#550C12] hover:bg-[#7B141C] text-white font-bold text-xs shadow-md transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            <span>+ Add New Cracker</span>
        </a>
    </div>

    <!-- Category Pills & Search -->
    <div class="bg-white p-4 rounded-3xl border border-[#E5DBC8] shadow-sm space-y-4">
        <form action="{{ route('admin.products.index') }}" method="GET" class="flex flex-col sm:flex-row gap-3">
            <div class="flex-1">
                <input
                    type="text"
                    name="search"
                    value="{{ request('search') }}"
                    placeholder="Search by SKU or cracker name..."
                    class="w-full px-4 py-2.5 rounded-xl border border-[#E5DBC8] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]"
                />
            </div>
            <div class="sm:w-64">
                <select name="category" onchange="this.form.submit()" class="w-full px-4 py-2.5 rounded-xl border border-[#E5DBC8] bg-[#FAF8F5] text-xs font-semibold text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]">
                    <option value="">All Categories ({{ \App\Models\Product::count() }})</option>
                    @foreach($categories as $cat)
                        <option value="{{ $cat->slug }}" {{ request('category') === $cat->slug ? 'selected' : '' }}>
                            {{ $cat->name }}
                        </option>
                    @endforeach
                </select>
            </div>
            <button type="submit" class="px-5 py-2.5 rounded-xl bg-[#550C12] hover:bg-[#7B141C] text-white text-xs font-bold transition">
                Filter
            </button>
            @if(request('search') || request('category'))
                <a href="{{ route('admin.products.index') }}" class="px-4 py-2.5 rounded-xl bg-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-300 transition text-center">
                    Reset
                </a>
            @endif
        </form>
    </div>

    <!-- Products Table -->
    <div class="bg-white rounded-3xl border border-[#E5DBC8] shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
                <thead class="bg-[#FAF8F5] text-[#5C4D44] font-bold uppercase text-[10px] tracking-wider border-b border-[#E5DBC8]">
                    <tr>
                        <th class="p-3.5">Cracker Image</th>
                        <th class="p-3.5">SKU & Category</th>
                        <th class="p-3.5">Cracker Name</th>
                        <th class="p-3.5 text-center">Box Specification</th>
                        <th class="p-3.5 text-right">Factory MRP</th>
                        <th class="p-3.5 text-right">Wholesale Rate</th>
                        <th class="p-3.5 text-center">Discount</th>
                        <th class="p-3.5 text-center">Stock</th>
                        <th class="p-3.5 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-[#E5DBC8]/60">
                    @forelse($products as $product)
                        <tr class="hover:bg-[#FAF8F5]/80 transition">
                            <td class="p-3.5">
                                <img src="{{ $product->image_url }}" alt="{{ $product->name }}" class="w-12 h-12 object-cover rounded-xl border border-[#E5DBC8]">
                            </td>
                            <td class="p-3.5">
                                <span class="font-mono font-bold text-[#B85D00] block">{{ $product->sku }}</span>
                                <span class="text-[10px] text-gray-500">{{ $product->category->name ?? $product->category_slug }}</span>
                            </td>
                            <td class="p-3.5">
                                <div class="font-bold text-[#1C1411] text-xs">{{ $product->name }}</div>
                                <div class="text-[11px] text-[#7B141C]">{{ $product->subtitle }}</div>
                            </td>
                            <td class="p-3.5 text-center whitespace-nowrap">
                                <span class="inline-flex items-center gap-1 font-bold text-[11px] text-[#550C12] bg-[#FFF8ED] px-2.5 py-1 rounded-lg border border-[#C98E2A]/30">
                                    {{ $product->pieces }}
                                </span>
                            </td>
                            <td class="p-3.5 text-right text-gray-400 line-through">₹{{ number_format($product->mrp) }}</td>
                            <td class="p-3.5 text-right font-black text-sm text-[#550C12]">₹{{ number_format($product->selling_price) }}</td>
                            <td class="p-3.5 text-center">
                                <span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                                    {{ $product->discount_percent }}% OFF
                                </span>
                            </td>
                            <td class="p-3.5 text-center font-bold">
                                <span class="{{ $product->stock_quantity <= 20 ? 'text-red-600' : 'text-gray-700' }}">
                                    {{ $product->stock_quantity }}
                                </span>
                            </td>
                            <td class="p-3.5 text-center">
                                <div class="inline-flex items-center gap-2">
                                    <a href="{{ route('admin.products.edit', $product->id) }}" class="p-1.5 rounded-lg bg-gray-100 hover:bg-[#C98E2A] hover:text-white text-gray-700 transition" title="Edit Product">
                                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                    </a>
                                    <form action="{{ route('admin.products.destroy', $product->id) }}" method="POST" onsubmit="return confirm('Delete {{ $product->name }}?')" class="inline">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="p-1.5 rounded-lg bg-gray-100 hover:bg-red-600 hover:text-white text-gray-700 transition" title="Delete Product">
                                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="9" class="p-8 text-center text-gray-500">
                                No products found.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        @if($products->hasPages())
            <div class="p-4 border-t border-[#E5DBC8] bg-[#FAF8F5]">
                {{ $products->links() }}
            </div>
        @endif
    </div>
</div>
@endsection

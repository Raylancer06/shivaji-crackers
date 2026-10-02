@extends('admin.layout')

@section('title', 'Add New Cracker')

@section('content')
<div class="max-w-3xl mx-auto space-y-6">
    <div>
        <a href="{{ route('admin.products.index') }}" class="text-xs font-bold text-[#550C12] hover:underline mb-1 inline-block">
            ← Back to Product Catalog
        </a>
        <h1 class="font-serif font-black text-2xl text-[#1C1411]">Add New Sivakasi Cracker</h1>
        <p class="text-xs text-[#66574F] mt-0.5">Ensure selling price respects the maximum 80% discount limit (selling price ≥ 20% of MRP).</p>
    </div>

    <form action="{{ route('admin.products.store') }}" method="POST" enctype="multipart/form-data" class="bg-white rounded-3xl border border-[#E5DBC8] shadow-sm p-6 space-y-6">
        @csrf

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label class="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">SKU Code *</label>
                <input type="text" name="sku" value="{{ old('sku', 'PROD-' . rand(200, 999)) }}" required class="w-full p-2.5 rounded-xl border border-[#E5DBC8] bg-[#FAF8F5] text-xs font-mono font-bold text-[#B85D00] outline-none focus:border-[#C98E2A]">
            </div>

            <div>
                <label class="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">Category *</label>
                <select name="category_slug" required class="w-full p-2.5 rounded-xl border border-[#E5DBC8] bg-[#FAF8F5] text-xs font-semibold text-[#1C1411] outline-none focus:border-[#C98E2A]">
                    @foreach($categories as $cat)
                        <option value="{{ $cat->slug }}" {{ old('category_slug') === $cat->slug ? 'selected' : '' }}>
                            {{ $cat->name }}
                        </option>
                    @endforeach
                </select>
            </div>

            <div class="sm:col-span-2">
                <label class="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">Cracker Name *</label>
                <input type="text" name="name" value="{{ old('name') }}" placeholder="e.g. 5” Lakshmi (Mega Pack)" required class="w-full p-2.5 rounded-xl border border-[#E5DBC8] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:border-[#C98E2A]">
            </div>

            <div class="sm:col-span-2">
                <label class="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">Subtitle / Tamil Display</label>
                <input type="text" name="subtitle" value="{{ old('subtitle') }}" placeholder="e.g. Sound Cracker / லக்ஷ்மி வெடி" class="w-full p-2.5 rounded-xl border border-[#E5DBC8] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:border-[#C98E2A]">
            </div>

            <!-- PRICING BLOCK (Strict 80% discount calculation) -->
            <div class="sm:col-span-2 p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                <div class="text-xs font-bold text-[#550C12] uppercase tracking-wider flex items-center justify-between">
                    <span>Pricing & Discount Calculation</span>
                    <span id="discountBadge" class="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                        Calculated Discount: 75% OFF
                    </span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-semibold text-[#66574F] mb-1">Factory Retail MRP (₹) *</label>
                        <input type="number" id="mrpInput" name="mrp" value="{{ old('mrp', 100) }}" step="1" min="1" required class="w-full p-2.5 rounded-xl border border-[#E5DBC8] bg-white text-xs font-bold text-[#1C1411] outline-none focus:border-[#C98E2A]">
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-[#66574F] mb-1">Wholesale Selling Rate (₹) *</label>
                        <input type="number" id="priceInput" name="selling_price" value="{{ old('selling_price', 25) }}" step="1" min="1" required class="w-full p-2.5 rounded-xl border border-[#E5DBC8] bg-white text-xs font-bold text-[#550C12] outline-none focus:border-[#C98E2A]">
                    </div>
                </div>

                <div id="priceWarning" class="hidden text-xs text-red-700 bg-red-100 p-2.5 rounded-xl border border-red-300 font-semibold">
                    ⚠️ Maximum allowed discount is 80%. Selling price cannot be below ₹<span id="minPriceDisplay">20</span>.
                </div>
            </div>

            <!-- BOX QUANTITY SPECIFICATION -->
            <div class="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5DBC8] sm:col-span-2 space-y-3">
                <div class="text-xs font-bold text-[#550C12] uppercase tracking-wider">
                    Box Packaging Specification (No Misleading Counts)
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-semibold text-[#66574F] mb-1">Pieces / Items in 1 Box *</label>
                        <input type="number" id="boxQtyInput" name="box_quantity" value="{{ old('box_quantity', 5) }}" min="1" required class="w-full p-2.5 rounded-xl border border-[#E5DBC8] bg-white text-xs font-bold text-[#1C1411] outline-none focus:border-[#C98E2A]">
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-[#66574F] mb-1">Quantity Unit *</label>
                        <select id="unitInput" name="quantity_unit" class="w-full p-2.5 rounded-xl border border-[#E5DBC8] bg-white text-xs font-semibold text-[#1C1411] outline-none focus:border-[#C98E2A]">
                            <option value="Pieces">Pieces</option>
                            <option value="Pcs">Pcs</option>
                            <option value="Shots">Shots</option>
                            <option value="Items">Items</option>
                            <option value="Rolls">Rolls</option>
                            <option value="Rings">Rings</option>
                            <option value="Pipe">Pipe</option>
                            <option value="Gun">Gun</option>
                            <option value="Crackers Garland">Crackers Garland</option>
                        </select>
                    </div>
                </div>

                <div class="text-[11px] text-[#550C12] font-bold bg-white p-2 rounded-lg border border-[#E5DBC8]">
                    Live Display on Card & Cart: <span id="boxPreview" class="text-[#B85D00]">Box Contains: 5 Pieces</span>
                </div>
            </div>

            <div>
                <label class="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">Sound Level *</label>
                <input type="text" name="sound_level" value="{{ old('sound_level', 'Festival Sound') }}" required class="w-full p-2.5 rounded-xl border border-[#E5DBC8] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:border-[#C98E2A]">
            </div>

            <div>
                <label class="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">Stock Quantity (Boxes) *</label>
                <input type="number" name="stock_quantity" value="{{ old('stock_quantity', 200) }}" min="0" required class="w-full p-2.5 rounded-xl border border-[#E5DBC8] bg-[#FAF8F5] text-xs font-bold text-[#1C1411] outline-none focus:border-[#C98E2A]">
            </div>

            <div class="sm:col-span-2">
                <label class="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">Primary Display Image</label>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input type="url" name="image_url" value="{{ old('image_url') }}" placeholder="https://... primary image link" class="p-2.5 rounded-xl border border-[#E5DBC8] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:border-[#C98E2A]">
                    <input type="file" name="image" accept="image/*" class="p-2 rounded-xl border border-[#E5DBC8] bg-[#FAF8F5] text-xs text-[#1C1411]">
                </div>

                <div class="mt-3 pt-3 border-t border-[#E5DBC8]/60">
                    <label class="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">Additional Gallery Images (Multi-upload)</label>
                    <input type="file" name="gallery_images[]" multiple accept="image/*" class="w-full p-2 rounded-xl border border-[#E5DBC8] bg-[#FAF8F5] text-xs text-[#1C1411]">
                    <p class="text-[11px] text-gray-500 mt-1">Select one or multiple product shots to save locally in storage/app/public/products.</p>
                </div>
            </div>

            <div class="sm:col-span-2">
                <label class="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">Description</label>
                <textarea name="description" rows="2" class="w-full p-2.5 rounded-xl border border-[#E5DBC8] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:border-[#C98E2A]">{{ old('description', 'Authentic Sivakasi direct factory allocation. 100% CSIR-NEERI Green Certified formulation.') }}</textarea>
            </div>

            <div class="sm:col-span-2 flex flex-wrap items-center gap-6 pt-2">
                <label class="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#1C1411]">
                    <input type="checkbox" name="green_certified" value="1" checked class="rounded text-[#550C12]">
                    <span>CSIR-NEERI Green QR Certified</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#1C1411]">
                    <input type="checkbox" name="is_bestseller" value="1" class="rounded text-[#550C12]">
                    <span>Diwali Bestseller Badge</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#1C1411]">
                    <input type="checkbox" name="is_featured" value="1" class="rounded text-[#550C12]">
                    <span>Homepage Featured Carousel</span>
                </label>
            </div>
        </div>

        <div class="pt-4 border-t border-[#E5DBC8] flex items-center justify-end gap-3">
            <a href="{{ route('admin.products.index') }}" class="px-5 py-2.5 rounded-xl bg-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-300 transition">
                Cancel
            </a>
            <button type="submit" id="submitBtn" class="px-6 py-2.5 rounded-xl bg-[#550C12] hover:bg-[#7B141C] text-white font-serif font-black text-xs uppercase tracking-wider shadow-md transition">
                Save & Publish Cracker
            </button>
        </div>
    </form>
</div>
@endsection

@section('scripts')
<script>
    const mrpInput = document.getElementById('mrpInput');
    const priceInput = document.getElementById('priceInput');
    const discountBadge = document.getElementById('discountBadge');
    const priceWarning = document.getElementById('priceWarning');
    const minPriceDisplay = document.getElementById('minPriceDisplay');
    const submitBtn = document.getElementById('submitBtn');

    const boxQtyInput = document.getElementById('boxQtyInput');
    const unitInput = document.getElementById('unitInput');
    const boxPreview = document.getElementById('boxPreview');

    function updateDiscount() {
        const mrp = parseFloat(mrpInput.value) || 0;
        const price = parseFloat(priceInput.value) || 0;

        if (mrp > 0) {
            const minAllowed = Math.ceil(mrp * 0.20);
            minPriceDisplay.textContent = minAllowed;

            if (price < minAllowed) {
                priceWarning.classList.remove('hidden');
                discountBadge.className = 'bg-red-100 text-red-800 text-[10px] px-2 py-0.5 rounded-full font-bold';
                discountBadge.textContent = 'Invalid: >80% Discount';
                submitBtn.disabled = true;
                submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                priceWarning.classList.add('hidden');
                const discount = Math.min(80, Math.round(((mrp - price) / mrp) * 100));
                discountBadge.className = 'bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold';
                discountBadge.textContent = `Calculated Discount: ${discount}% OFF`;
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }
    }

    function updateBoxPreview() {
        const qty = boxQtyInput.value || 1;
        const unit = unitInput.value || 'Pieces';
        boxPreview.textContent = `Box Contains: ${qty} ${unit}`;
    }

    mrpInput.addEventListener('input', updateDiscount);
    priceInput.addEventListener('input', updateDiscount);
    boxQtyInput.addEventListener('input', updateBoxPreview);
    unitInput.addEventListener('change', updateBoxPreview);

    updateDiscount();
    updateBoxPreview();
</script>
@endsection

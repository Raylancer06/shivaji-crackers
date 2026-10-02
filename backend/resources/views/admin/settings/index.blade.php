@extends('admin.layout')

@section('title', 'Business & Store Settings')

@section('content')
<div class="max-w-4xl space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
        <div>
            <h1 class="font-serif font-black text-2xl sm:text-3xl text-[#1C1411]">Store & Business Settings</h1>
            <p class="text-xs text-[#66574F] mt-1">Configure business identity, location, minimum cart requirement, and UPI payment details.</p>
        </div>
    </div>

    @if(session('success'))
        <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            <span>{{ session('success') }}</span>
        </div>
    @endif

    <form action="{{ route('admin.settings.update') }}" method="POST" class="space-y-6">
        @csrf

        <!-- 1. Business Information -->
        <div class="bg-white rounded-3xl border border-[#E5DBC8] p-6 sm:p-8 space-y-6 shadow-sm">
            <div class="border-b border-[#E5DBC8]/60 pb-3">
                <h2 class="font-serif font-bold text-lg text-[#550C12]">1. Business Identity & Location</h2>
                <p class="text-xs text-[#66574F]">Official business information displayed throughout the website and customer invoices.</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                    <label class="block font-bold text-[#1C1411] mb-1">Official Business Name *</label>
                    <input
                        type="text"
                        name="business_name"
                        required
                        value="{{ old('business_name', $settings['business_name']) }}"
                        class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DBC8] bg-white text-xs outline-none focus:border-[#C98E2A]"
                    />
                    <p class="text-[10px] text-gray-500 mt-1">Must strictly remain <strong>Sivaji Firecracker</strong>.</p>
                </div>

                <div>
                    <label class="block font-bold text-[#1C1411] mb-1">City / Location *</label>
                    <input
                        type="text"
                        name="business_city"
                        required
                        value="{{ old('business_city', $settings['business_city']) }}"
                        class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DBC8] bg-white text-xs outline-none focus:border-[#C98E2A]"
                    />
                    <p class="text-[10px] text-gray-500 mt-1">Primary distribution hub (<strong>Hyderabad</strong>).</p>
                </div>

                <div>
                    <label class="block font-bold text-[#1C1411] mb-1">Helpline Phone Number *</label>
                    <input
                        type="text"
                        name="business_phone"
                        required
                        value="{{ old('business_phone', $settings['business_phone']) }}"
                        class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DBC8] bg-white text-xs outline-none focus:border-[#C98E2A]"
                    />
                </div>

                <div>
                    <label class="block font-bold text-[#1C1411] mb-1">Support Email Address *</label>
                    <input
                        type="email"
                        name="business_email"
                        required
                        value="{{ old('business_email', $settings['business_email']) }}"
                        class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DBC8] bg-white text-xs outline-none focus:border-[#C98E2A]"
                    />
                </div>
            </div>
        </div>

        <!-- 2. Ecommerce & Minimum Cart Settings -->
        <div class="bg-white rounded-3xl border border-[#E5DBC8] p-6 sm:p-8 space-y-6 shadow-sm">
            <div class="border-b border-[#E5DBC8]/60 pb-3">
                <h2 class="font-serif font-bold text-lg text-[#550C12]">2. Ecommerce & Order Rules</h2>
                <p class="text-xs text-[#66574F]">Configure minimum order requirements to prevent unprofitable factory dispatches.</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                    <label class="block font-bold text-[#1C1411] mb-1">Minimum Cart Value (₹) *</label>
                    <input
                        type="number"
                        name="minimum_cart_value"
                        required
                        min="0"
                        step="100"
                        value="{{ old('minimum_cart_value', $settings['minimum_cart_value']) }}"
                        class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DBC8] bg-white text-xs font-mono font-bold text-[#550C12] outline-none focus:border-[#C98E2A]"
                    />
                    <p class="text-[10px] text-gray-500 mt-1">Customers with cart total below this value cannot checkout. Enter <strong>0</strong> to disable restriction.</p>
                </div>

                <div>
                    <label class="block font-bold text-[#1C1411] mb-1">Currency Symbol *</label>
                    <input
                        type="text"
                        name="currency_symbol"
                        required
                        value="{{ old('currency_symbol', $settings['currency_symbol']) }}"
                        class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DBC8] bg-white text-xs outline-none focus:border-[#C98E2A]"
                    />
                </div>
            </div>
        </div>

        <!-- 3. Payment & UPI Settings -->
        <div class="bg-white rounded-3xl border border-[#E5DBC8] p-6 sm:p-8 space-y-6 shadow-sm">
            <div class="border-b border-[#E5DBC8]/60 pb-3">
                <h2 class="font-serif font-bold text-lg text-[#550C12]">3. Manual UPI Payment Settings</h2>
                <p class="text-xs text-[#66574F]">Official UPI ID and payee name displayed in checkout and dynamic QR code.</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                    <label class="block font-bold text-[#1C1411] mb-1">Official Business UPI ID *</label>
                    <input
                        type="text"
                        name="upi_id"
                        required
                        value="{{ old('upi_id', $settings['upi_id']) }}"
                        class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DBC8] bg-white text-xs font-mono font-bold text-[#550C12] outline-none focus:border-[#C98E2A]"
                    />
                </div>

                <div>
                    <label class="block font-bold text-[#1C1411] mb-1">Payee Name *</label>
                    <input
                        type="text"
                        name="upi_payee_name"
                        required
                        value="{{ old('upi_payee_name', $settings['upi_payee_name']) }}"
                        class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DBC8] bg-white text-xs outline-none focus:border-[#C98E2A]"
                    />
                </div>
            </div>
        </div>

        <!-- Save Button -->
        <div class="flex justify-end">
            <button
                type="submit"
                class="px-8 py-3 rounded-xl bg-gradient-to-r from-[#550C12] to-[#7B141C] text-white font-serif font-bold text-xs shadow-md hover:shadow-regal transition"
            >
                Save Settings
            </button>
        </div>
    </form>
</div>
@endsection

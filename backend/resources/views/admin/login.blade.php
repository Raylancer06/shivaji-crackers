<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login | Sivaji Firecracker</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        .font-serif { font-family: 'Playfair Display', Georgia, serif; }
    </style>
</head>
<body class="bg-[#2A0508] min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Subtle festive glow background -->
    <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#C98E2A]/10 blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#7B141C]/40 blur-3xl pointer-events-none"></div>

    <div class="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-[#E5DBC8]">
        <!-- Brand Header -->
        <div class="text-center mb-8">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C98E2A] to-[#F0B543] flex items-center justify-center text-[#38060A] font-black text-2xl shadow-lg mx-auto mb-3">
                S
            </div>
            <h1 class="font-serif font-black text-2xl text-[#1C1411]">SIVAJI FIRECRACKER</h1>
            <p class="text-xs text-[#7B141C] font-bold uppercase tracking-wider mt-1">Wholesale Factory Admin Portal</p>
        </div>

        @if($errors->any())
            <div class="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {{ $errors->first() }}
            </div>
        @endif

        <form action="{{ route('admin.login.submit') }}" method="POST" class="space-y-4">
            @csrf

            <div>
                <label class="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1.5">Admin Email</label>
                <input
                    type="email"
                    name="email"
                    value="{{ old('email') }}"
                    placeholder="admin@sivajifirecracker.com"
                    required
                    class="w-full px-4 py-3 rounded-xl border border-[#E5DBC8] bg-[#FAF8F5] text-sm text-[#1C1411] focus:bg-white focus:border-[#C98E2A] outline-none transition"
                />
            </div>

            <div>
                <label class="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1.5">Password</label>
                <input
                    type="password"
                    name="password"
                    value=""
                    placeholder="••••••••"
                    required
                    class="w-full px-4 py-3 rounded-xl border border-[#E5DBC8] bg-[#FAF8F5] text-sm text-[#1C1411] focus:bg-white focus:border-[#C98E2A] outline-none transition"
                />
            </div>

            <div class="flex items-center justify-between text-xs pt-1">
                <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="remember" class="rounded border-gray-300 text-[#7B141C] focus:ring-[#C98E2A]">
                    <span class="text-[#66574F]">Remember login</span>
                </label>
            </div>

            <button
                type="submit"
                class="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#550C12] to-[#7B141C] hover:from-[#38060A] hover:to-[#550C12] text-white font-serif font-black text-sm tracking-wide shadow-lg transition transform active:scale-98 mt-2"
            >
                Secure Admin Access
            </button>
        </form>

        <div class="mt-6 pt-6 border-t border-gray-100 text-center">
            <a href="http://localhost:3001" class="text-xs font-semibold text-[#66574F] hover:text-[#550C12] transition">
                ← Return to Sivaji Online Store (Port 3001)
            </a>
        </div>
    </div>
</body>
</html>

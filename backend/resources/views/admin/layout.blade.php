<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Admin Panel') | Sivaji Crackers Sivakasi</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,900;1,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        regal: {
                            900: '#38060A',
                            800: '#550C12',
                            700: '#7B141C',
                            600: '#9B1D27',
                            50: '#FDF8F8',
                        },
                        amber: {
                            500: '#C98E2A',
                            400: '#F0B543',
                            50: '#FFF9ED',
                        },
                        cream: {
                            50: '#FAF8F5',
                            100: '#F2ECE1',
                            200: '#E5DBC8',
                        }
                    },
                    fontFamily: {
                        serif: ['"Playfair Display"', 'Georgia', 'serif'],
                        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
                        mono: ['"JetBrains Mono"', 'monospace'],
                    }
                }
            }
        }
    </script>
    <style>
        body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        .font-serif { font-family: 'Playfair Display', Georgia, serif; }
    </style>
</head>
<body class="bg-[#FAF8F5] text-[#1C1411] min-h-screen flex flex-col">

    <!-- Top Statutory & Quick Actions Bar -->
    <header class="bg-[#38060A] text-white border-b border-[#C98E2A]/30 sticky top-0 z-40 shadow-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <a href="{{ route('admin.dashboard') }}" class="flex items-center gap-2.5">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C98E2A] to-[#F0B543] flex items-center justify-center text-[#38060A] font-black text-xl shadow">
                        S
                    </div>
                    <div>
                        <div class="font-serif font-black text-lg text-white leading-none tracking-wide">
                            SIVAJI CRACKERS
                        </div>
                        <div class="text-[10px] text-[#F0B543] font-semibold tracking-wider uppercase mt-0.5">
                            Wholesale Admin Management Portal
                        </div>
                    </div>
                </a>
            </div>

            <!-- Header Quick Links -->
            <div class="flex items-center gap-4">
                <a href="http://localhost:3001" target="_blank" class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-[#F0B543] border border-white/10 transition">
                    <span>View Live Store (Port 3001)</span>
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </a>

                <div class="flex items-center gap-2 pl-3 border-l border-white/15">
                    <div class="text-right hidden sm:block">
                        <div class="text-xs font-bold text-white">{{ Auth::user()->name ?? 'Administrator' }}</div>
                        <div class="text-[10px] text-[#A7E2BE]">Master Controller</div>
                    </div>
                    <form action="{{ route('admin.logout') }}" method="POST" class="inline">
                        @csrf
                        <button type="submit" class="p-2 rounded-lg bg-red-900/50 hover:bg-red-800 text-white/80 hover:text-white transition" title="Logout">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>

        <!-- Navigation Tabs -->
        <nav class="bg-[#550C12] border-t border-[#7B141C] px-4 sm:px-6 lg:px-8">
            <div class="max-w-7xl mx-auto flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2">
                <a href="{{ route('admin.dashboard') }}" class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 {{ request()->routeIs('admin.dashboard') ? 'bg-[#C98E2A] text-[#38060A]' : 'text-white/80 hover:text-white hover:bg-white/10' }}">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                    <span>Dashboard</span>
                </a>

                <a href="{{ route('admin.orders.index') }}" class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 {{ request()->routeIs('admin.orders.*') ? 'bg-[#C98E2A] text-[#38060A]' : 'text-white/80 hover:text-white hover:bg-white/10' }}">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                    <span>Orders & Payments</span>
                    @php
                        $pendingCount = \App\Models\Order::where('status', 'pending_verification')->count();
                    @endphp
                    @if($pendingCount > 0)
                        <span class="ml-1 bg-red-600 text-white font-mono text-[10px] px-1.5 py-0.2 rounded-full font-black animate-pulse">
                            {{ $pendingCount }}
                        </span>
                    @endif
                </a>

                <a href="{{ route('admin.products.index') }}" class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 {{ request()->routeIs('admin.products.*') ? 'bg-[#C98E2A] text-[#38060A]' : 'text-white/80 hover:text-white hover:bg-white/10' }}">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                    <span>Products (157 Catalog)</span>
                </a>

                <a href="{{ route('admin.customers.index') }}" class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 {{ request()->routeIs('admin.customers.*') ? 'bg-[#C98E2A] text-[#38060A]' : 'text-white/80 hover:text-white hover:bg-white/10' }}">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    <span>Registered Customers</span>
                </a>
            </div>
        </nav>
    </header>

    <!-- Main Container -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Flash Alerts -->
        @if(session('success'))
            <div class="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm font-semibold flex items-center gap-2 shadow-sm">
                <svg class="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>{{ session('success') }}</span>
            </div>
        @endif

        @if($errors->any())
            <div class="mb-6 p-4 rounded-2xl bg-red-50 border border-red-300 text-red-800 text-sm shadow-sm">
                <div class="font-bold flex items-center gap-2 mb-1">
                    <svg class="w-5 h-5 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>Please correct the errors:</span>
                </div>
                <ul class="list-disc list-inside text-xs space-y-0.5 ml-2">
                    @foreach($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        @yield('content')
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-[#E5DBC8] py-4 text-center text-xs text-[#66574F]">
        <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
                © {{ date('Y') }} Sivaji Crackers Sivakasi. Licensed Explosives Manufacturer (PESO Certified).
            </div>
            <div class="text-[11px] text-[#B85D00] font-semibold">
                Official Business UPI: <span class="font-mono bg-amber-50 px-2 py-0.5 rounded border border-amber-200">sivajiduddempudi422@axl</span>
            </div>
        </div>
    </footer>

    @yield('scripts')
</body>
</html>

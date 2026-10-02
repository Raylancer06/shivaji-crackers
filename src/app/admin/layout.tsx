"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { adminApi } from '@/services/supabaseAdmin';
import {
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  Package,
  Layers,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  Loader2,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/payments', label: 'Payment Verification', icon: CreditCard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Layers },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/settings', label: 'Store Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setCheckingAuth(false);
      return;
    }

    let isMounted = true;

    adminApi.checkAdmin().then((admin) => {
      if (isMounted) {
        if (!admin) {
          router.replace('/admin/login');
        } else {
          setIsAdmin(true);
        }
        setCheckingAuth(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#550C12]" />
        <p className="text-xs font-bold text-[#66574F]">Verifying Admin Authorization...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1411] flex font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col justify-between bg-gradient-to-b from-[#200306] via-[#3D060B] to-[#200306] text-white border-r border-[#C98E2A]/30 p-5 shrink-0 sticky top-0 h-screen">
        <div className="space-y-6">
          {/* Logo & Brand Header */}
          <div className="flex items-center gap-3 pb-5 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFF8ED] to-[#F2EBE0] text-[#550C12] border border-[#C98E2A]/40 flex items-center justify-center font-serif font-black shadow-sm">
              S
            </div>
            <div>
              <h2 className="font-serif font-black text-sm text-white">
                Sivaji Firecracker
              </h2>
              <span className="text-[10px] text-[#F0B543] font-bold uppercase tracking-wider block">
                Store Operations
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#C98E2A] text-[#1C1411] shadow-md font-bold'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-gray-300 hover:bg-white/10 hover:text-white transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Storefront</span>
            </span>
            <span className="text-[10px] text-[#F0B543]">Live</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs text-red-300 hover:bg-red-950/40 hover:text-red-200 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Mobile Bar */}
        <header className="lg:hidden bg-[#200306] text-white p-4 border-b border-[#C98E2A]/30 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="font-serif font-black text-sm text-[#F0B543]">Sivaji Firecracker</span>
            <span className="text-[10px] text-gray-300">Admin</span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-white/10 text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#3D060B] border-b border-[#C98E2A]/30 p-4 space-y-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                    isActive
                      ? 'bg-[#C98E2A] text-[#1C1411] font-bold'
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-white/10 flex justify-between">
              <Link href="/" target="_blank" className="text-xs text-[#F0B543]">Storefront ↗</Link>
              <button onClick={handleLogout} className="text-xs text-red-300">Sign Out</button>
            </div>
          </div>
        )}

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

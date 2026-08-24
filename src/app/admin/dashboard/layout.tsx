'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  MessageSquare, 
  Image as ImageIcon, 
  Building, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ExternalLink
} from 'lucide-react';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/admin');
        } else {
          setLoading(false);
        }
      } catch {
        router.push('/admin');
      }
    }
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-3 text-neutral-400">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(255,255,255,0.3)]"></div>
        <p className="text-sm animate-pulse">Verifying Admin Permissions...</p>
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/dashboard/products', icon: Package },
    { label: 'Categories', href: '/admin/dashboard/categories', icon: Layers },
    { label: 'Enquiries', href: '/admin/dashboard/enquiries', icon: MessageSquare },
    { label: 'Gallery', href: '/admin/dashboard/gallery', icon: ImageIcon },
    { label: 'Business Info', href: '/admin/dashboard/business-info', icon: Building },
    { label: 'Settings', href: '/admin/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row font-sans">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-black border-r border-white/10 shrink-0">
        {/* Brand */}
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white text-black font-extrabold flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            M
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-white leading-tight">MAHAVEER</h2>
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Admin Control Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-grow p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                    : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 text-xs font-semibold border border-white/10 transition-colors"
          >
            <span>View Public Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-black border-b border-white/10 p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white text-black font-bold flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            M
          </div>
          <span className="font-extrabold text-sm">Mahaveer Admin</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black border-b border-white/10 p-4 space-y-2 z-30">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive ? 'bg-white text-black shadow-[0_0_10px_rgba(255,255,255,0.2)]' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-white/10 flex justify-between items-center px-4">
            <Link href="/" target="_blank" className="text-xs text-white font-bold hover:underline">
              View Public Website
            </Link>
            <button onClick={handleLogout} className="text-xs text-red-400 font-bold hover:text-red-300">
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Main Admin Body */}
      <main className="flex-grow p-6 sm:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

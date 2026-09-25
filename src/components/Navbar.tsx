import { useState } from 'react';
import { Home, Globe, Headphones, ShoppingCart, Menu, X, MessageSquare, Server, LayoutGrid } from 'lucide-react';
import { SITE_CONFIG } from '../config';
import { adminLogout } from '../utils/stockService';

interface NavbarProps {
  onOpenOrder: (planId?: 'lite' | 'basic' | 'prime') => void;
  onScrollTo: (sectionId: string) => void;
  onOpenAdmin?: () => void;
}

export default function Navbar({ onOpenOrder, onScrollTo, onOpenAdmin }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogoClick = () => {
    // Hidden admin entry point when clicking the logo
    // Requirement: setiap kali pencet logo harus kasih username dan pw
    adminLogout();
    if (onOpenAdmin) {
      onOpenAdmin();
    } else {
      onScrollTo('hero');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#040814]/85 border-b border-cyan-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo: MAVIXSTORE with custom logo image or stylized mark */}
        <div 
          onClick={handleLogoClick}
          className="flex items-center gap-3.5 cursor-pointer group select-none"
          id="nav-logo"
          title="Klik untuk Kelola Stok (Admin)"
        >
          {SITE_CONFIG.logoUrl ? (
            <img
              src={SITE_CONFIG.logoUrl}
              alt="MavixStore Logo"
              referrerPolicy="no-referrer"
              className="h-12 sm:h-14 w-auto max-w-[56px] object-contain drop-shadow-[0_0_20px_rgba(0,210,255,0.7)] group-hover:scale-105 transition-transform cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleLogoClick();
              }}
            />
          ) : (
            <div 
              onClick={(e) => {
                e.stopPropagation();
                handleLogoClick();
              }}
              className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 p-[2px] shadow-[0_0_22px_rgba(6,182,212,0.6)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.9)] transition-all"
            >
              <div className="w-full h-full bg-[#050b18] rounded-[14px] flex items-center justify-center relative overflow-hidden">
                <span className="font-black text-2xl tracking-tighter bg-gradient-to-br from-cyan-300 via-sky-200 to-blue-400 bg-clip-text text-transparent transform -skew-x-6">
                  M
                </span>
                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-cyan-400 rounded-full blur-[1px]" />
              </div>
            </div>
          )}

          <div className="flex items-center">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">MAVIX</span>
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-cyan-400 drop-shadow-[0_0_16px_rgba(34,211,238,0.7)]">
              STORE
            </span>
          </div>
        </div>

        {/* Desktop Navigation matching Screenshot (37) */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          <button
            onClick={() => onScrollTo('hero')}
            className="flex items-center gap-2 text-sm font-semibold text-slate-200 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4 text-cyan-400" />
            <span>Beranda</span>
          </button>

          <button
            onClick={() => onScrollTo('plans')}
            className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Layanan Hosting</span>
          </button>

          <button
            onClick={() => onScrollTo('features')}
            className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <Server className="w-4 h-4 text-cyan-400" />
            <span>Private Node</span>
          </button>

          <button
            onClick={() => onScrollTo('faq')}
            className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <Headphones className="w-4 h-4 text-cyan-400" />
            <span>Dukungan</span>
          </button>

          <a
            href="https://panel.mavixstore.id"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <LayoutGrid className="w-4 h-4 text-cyan-400" />
            <span>Dashboard</span>
          </a>
        </nav>

        {/* Right Action Items: Glowing SEWA SEKARANG Button (Desktop & Tablet) */}
        <div className="hidden sm:flex items-center">
          <button
            onClick={() => onScrollTo('plans')}
            className="px-6 py-2.5 rounded-xl font-extrabold text-xs tracking-wider uppercase text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:shadow-[0_0_35px_rgba(6,182,212,0.9)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            id="nav-btn-sewa-sekarang"
          >
            SEWA SEKARANG
          </button>
        </div>

        {/* Mobile menu button (tombol sewa dihilangkan khusus tampilan mobile) */}
        <div className="flex sm:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-3 pb-6 bg-[#060b18] border-b border-cyan-900/40 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { onScrollTo('hero'); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-slate-200 hover:text-cyan-300 bg-slate-900/50 rounded-lg"
            >
              <Home className="w-4 h-4 text-cyan-400" />
              <span>Beranda</span>
            </button>
            <button
              onClick={() => { onScrollTo('plans'); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-slate-200 hover:text-cyan-300 bg-slate-900/50 rounded-lg"
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Paket Hosting</span>
            </button>
            <button
              onClick={() => { onScrollTo('testimonials'); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-slate-200 hover:text-cyan-300 bg-slate-900/50 rounded-lg"
            >
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Testimoni</span>
            </button>
            <button
              onClick={() => { onScrollTo('faq'); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-slate-200 hover:text-cyan-300 bg-slate-900/50 rounded-lg"
            >
              <Headphones className="w-4 h-4 text-cyan-400" />
              <span>Dukungan</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => { onScrollTo('plans'); setMobileMenuOpen(false); }}
              className="w-full py-3 text-xs font-black uppercase tracking-wider text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.6)] cursor-pointer"
            >
              SEWA SEKARANG
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

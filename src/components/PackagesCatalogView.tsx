import React, { useState } from 'react';
import { 
  ArrowLeft, Cpu, HardDrive, Zap, 
  Check, ChevronRight, LayoutDashboard, Store, Folder
} from 'lucide-react';
import { PlanId, SelectedPackageDetails, AllStockState } from '../types';
import { TIER_PACKAGES, PackageItem } from '../data/packagesData';
import { SITE_CONFIG } from '../config';
import { getPackageStockInfo, getTierTotalRam, isTierAvailable } from '../utils/stockService';

import officialSteveAlex from '../assets/images/official_minecraft_steve_alex.jpg';
import officialKeyArt2024 from '../assets/images/official_minecraft_key_art_2024.jpg';
import officialCombatAction from '../assets/images/official_minecraft_combat_action.jpg';

interface PackagesCatalogViewProps {
  initialTier: PlanId;
  onBackToHome: () => void;
  onSelectPackage: (details: SelectedPackageDetails) => void;
  stock?: AllStockState;
}

const TIER_HERO_DATA: Record<PlanId, {
  name: string;
  cpu: string;
  description: string;
  bgImage: string;
}> = {
  lite: {
    name: 'Lite Hosting',
    cpu: 'Intel Platinum 8370C',
    description: 'Hosting yang menggunakan prosesor Intel Platinum 8370C yang stabil dan hemat biaya, paket ini cocok untuk server pemula, survival ringan, atau teman bermain privat. Ideal untuk server vanilla dan komunitas kecil.',
    bgImage: officialSteveAlex
  },
  basic: {
    name: 'Basic Hosting',
    cpu: 'Intel Xeon E5 2695V4',
    description: 'Hosting yang menggunakan prosesor Intel Xeon E5 2695V4 yang lebih kuat, paket ini cocok untuk server yang mulai berkembang. Ideal untuk server mini-game, economy, atau SMP yang punya komunitas aktif.',
    bgImage: officialKeyArt2024
  },
  prime: {
    name: 'Prime Hosting',
    cpu: 'Intel Xeon Gold 6154',
    description: 'Hosting yang menggunakan prosesor monster Intel Xeon Gold 6154 dengan clock speed tinggi dan memori ECC, paket ini dirancang untuk performa tanpa kompromi. Ideal untuk server besar, network multiplayer, dan modpack berat.',
    bgImage: officialCombatAction
  }
};

export default function PackagesCatalogView({
  initialTier,
  onBackToHome,
  onSelectPackage,
  stock
}: PackagesCatalogViewProps) {
  const [activeTier, setActiveTier] = useState<PlanId>(initialTier);

  const currentTierInfo = TIER_PACKAGES[activeTier];
  const currentHero = TIER_HERO_DATA[activeTier];
  const tierTotalRam = getTierTotalRam(stock, activeTier);
  const tierHasStock = isTierAvailable(stock, activeTier);

  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString('id-ID')}`;
  };

  const handleOrderClick = (item: PackageItem) => {
    const pkgStock = getPackageStockInfo(stock, activeTier, item.ramGb);
    if (!pkgStock.inStock) {
      alert(`Mohon maaf, stok paket ${item.name} (${item.ramGb} GB RAM) saat ini sedang habis.`);
      return;
    }

    const tierName =
      activeTier === 'lite'
        ? 'LITE HOSTING'
        : activeTier === 'basic'
        ? 'BASIC HOSTING'
        : 'PRIME HOSTING';

    onSelectPackage({
      id: item.id,
      name: item.name,
      tierId: activeTier,
      tierName,
      price: item.price,
      originalPrice: item.originalPrice,
      discountPct: item.discountPct,
      vCore: item.vCore,
      ramGb: item.ramGb,
      diskGb: item.diskGb,
      processor: item.processor
    });
  };

  return (
    <div className="min-h-screen bg-[#020b18] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Top Floating Navigation Bar matching Screenshot (37) */}
      <header className="sticky top-0 z-50 bg-[#020b18]/90 backdrop-blur-xl border-b border-[#0e2547]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Back Button */}
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#061833] hover:bg-[#0a2347] border border-[#143a6b] hover:border-cyan-400/50 text-slate-300 hover:text-white transition-all text-xs sm:text-sm font-bold cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Beranda</span>
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3">
            {SITE_CONFIG.logoUrl ? (
              <img
                src={SITE_CONFIG.logoUrl}
                alt="MavixStore"
                referrerPolicy="no-referrer"
                className="h-9 sm:h-11 w-auto max-w-[48px] object-contain drop-shadow-[0_0_15px_rgba(0,210,255,0.6)]"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 p-[2px]">
                <div className="w-full h-full bg-[#050b18] rounded-[10px] flex items-center justify-center">
                  <span className="font-black text-lg text-cyan-400">M</span>
                </div>
              </div>
            )}
            <div className="hidden sm:flex items-center tracking-tight text-xl font-black">
              <span className="text-white">MAVIX</span>
              <span className="text-[#00d2ff] drop-shadow-[0_0_12px_rgba(0,210,255,0.6)]">STORE</span>
            </div>
          </div>

          {/* Tier Selection Pills in Header */}
          <div className="flex items-center bg-[#051329] p-1 rounded-xl border border-[#0f2d59]">
            <button
              onClick={() => setActiveTier('lite')}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTier === 'lite'
                  ? 'bg-cyan-400 text-slate-950 font-black shadow-[0_0_15px_rgba(0,210,255,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Lite
            </button>
            <button
              onClick={() => setActiveTier('basic')}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTier === 'basic'
                  ? 'bg-cyan-400 text-slate-950 font-black shadow-[0_0_15px_rgba(0,210,255,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Basic ★
            </button>
            <button
              onClick={() => setActiveTier('prime')}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTier === 'prime'
                  ? 'bg-cyan-400 text-slate-950 font-black shadow-[0_0_15px_rgba(0,210,255,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Prime
            </button>
          </div>
        </div>
      </header>

      {/* Main Content matching Screenshot 2026-09-20 044607.png */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {/* Breadcrumb matching Screenshot 2026-09-20 044607.png */}
        <nav 
          aria-label="Breadcrumb"
          className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-400 mb-6 font-medium flex-wrap"
        >
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-slate-400 hover:text-cyan-300"
          >
            <LayoutDashboard className="w-4 h-4 text-slate-400" />
            <span>Dashboard</span>
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />

          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-slate-400 hover:text-cyan-300"
          >
            <Store className="w-4 h-4 text-slate-400" />
            <span>Store</span>
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />

          <div className="flex items-center gap-1.5 text-white font-bold bg-[#0c2242] px-3 py-1 rounded-md border border-[#163868]">
            <Folder className="w-4 h-4 text-cyan-400" />
            <span>{currentHero.name}</span>
          </div>
        </nav>

        {/* Hero Banner matching Screenshot 2026-09-20 044607.png */}
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-[#14325a] shadow-[0_20px_50px_rgba(0,0,0,0.6)] min-h-[220px] sm:min-h-[250px] md:min-h-[270px] flex items-center mb-8 sm:mb-10 group">
          {/* Background Image matching package artwork */}
          <img
            src={currentHero.bgImage}
            alt={`${currentHero.name} Minecraft artwork`}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-[1.01] transition-transform duration-700"
          />

          {/* Left-to-right dark gradient overlay ensuring pristine text readability while leaving right scenery visible */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#020b18]/95 via-[#020b18]/80 via-[#020b18]/45 to-transparent" />

          {/* Bottom subtle shadow gradient fading into the page */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#020b18]/90 via-[#020b18]/50 to-transparent" />

          {/* Content inside banner */}
          <div className="relative z-10 p-6 sm:p-8 md:p-12 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
              {currentHero.name}
            </h1>
            <p className="mt-3 text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.95)] font-normal">
              {currentHero.description}
            </p>
          </div>
        </div>

        {/* Out of stock warning banner if tier is completely empty */}
        {!tierHasStock && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 text-rose-300 flex items-center justify-between gap-3 shadow-[0_0_25px_rgba(244,63,94,0.15)]">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
              <span>Kapasitas RAM untuk kategori <strong>{currentTierInfo.title}</strong> saat ini kosong (0 GB RAM Pool). Hubungi admin untuk restock.</span>
            </div>
            <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
              Pool Kosong
            </span>
          </div>
        )}

        {/* 3-Column Grid of Package Cards matching Screenshot (37) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {currentTierInfo.items.map((pkg) => {
            const pkgStock = getPackageStockInfo(stock, activeTier, pkg.ramGb);
            const isPkgAvailable = pkgStock.inStock;

            return (
              <div
                key={pkg.id}
                className={`rounded-[24px] p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 relative group bg-[#061426] border ${
                  !isPkgAvailable
                    ? 'border-rose-900/40 opacity-75'
                    : pkg.isHighlighted
                    ? 'border-cyan-500/70 shadow-[0_0_35px_rgba(0,210,255,0.18)] hover:border-cyan-400'
                    : 'border-[#11294a] hover:border-[#1d4880] shadow-[0_8px_30px_rgba(0,0,0,0.4)]'
                }`}
              >
                <div>
                  {/* Top Header Row: Package Title + Status Pill */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3
                        className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                          !isPkgAvailable
                            ? 'text-slate-400'
                            : pkg.isHighlighted
                            ? 'text-[#00d2ff] drop-shadow-[0_0_15px_rgba(0,210,255,0.5)]'
                            : 'text-white'
                        }`}
                      >
                        {pkg.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium mt-1">
                        {pkg.processor}
                      </p>
                    </div>

                    {/* Status Badge: • TERSEDIA (X Unit) vs • STOK HABIS */}
                    {isPkgAvailable ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#05261d] border border-[#0d553e] text-[#22c55e] text-xs font-bold shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                        <span>TERSEDIA ({pkgStock.stockCount} Unit)</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-400 text-xs font-bold shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        <span>STOK HABIS</span>
                      </div>
                    )}
                  </div>

                  {/* Price Section matching Screenshot (37) */}
                  <div className="mt-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
                        {formatPrice(pkg.price)}
                      </span>
                      <span className="text-xs text-slate-400 font-normal ml-0.5">
                        /bulan
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs line-through text-slate-500 font-medium">
                        {formatPrice(pkg.originalPrice)}
                      </span>
                      <span className="bg-[#052b1e] border border-[#0f533a] text-[#22c55e] text-[10px] font-black px-1.5 py-0.5 rounded tracking-wide">
                        HEMAT {pkg.discountPct}%
                      </span>
                    </div>
                  </div>

                  {/* 3 Spec Boxes Horizontally in a row matching Screenshot (37) */}
                  <div className="grid grid-cols-3 gap-2.5 my-6">
                    {/* Box 1: vCore */}
                    <div className="bg-[#0a1c36] border border-[#143763] rounded-2xl py-3 px-2 flex flex-col items-center justify-center text-center min-w-0">
                      <Cpu className="w-4 h-4 text-cyan-400 mb-1 shrink-0" />
                      <span className="text-[11px] text-slate-400 font-medium truncate w-full">vCore</span>
                      <span className="text-xs sm:text-sm font-bold text-white mt-0.5 truncate w-full">{pkg.vCore}</span>
                    </div>

                    {/* Box 2: RAM */}
                    <div className="bg-[#0a1c36] border border-[#143763] rounded-2xl py-3 px-2 flex flex-col items-center justify-center text-center min-w-0">
                      <Zap className="w-4 h-4 text-cyan-400 mb-1 shrink-0" />
                      <span className="text-[11px] text-slate-400 font-medium truncate w-full">RAM</span>
                      <span className="text-xs sm:text-sm font-bold text-cyan-300 mt-0.5 truncate w-full">{pkg.ramGb} GB</span>
                    </div>

                    {/* Box 3: Disk */}
                    <div className="bg-[#0a1c36] border border-[#143763] rounded-2xl py-3 px-2 flex flex-col items-center justify-center text-center min-w-0">
                      <HardDrive className="w-4 h-4 text-cyan-400 mb-1 shrink-0" />
                      <span className="text-[11px] text-slate-400 font-medium truncate w-full">Disk</span>
                      <span className="text-xs sm:text-sm font-bold text-white mt-0.5 truncate w-full">{pkg.diskGb} GB</span>
                    </div>
                  </div>

                  {/* Features List matching Screenshot (37) */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-cyan-400 stroke-[2.5] shrink-0" />
                      <span className="text-xs sm:text-sm text-slate-300 font-medium">Deploy Instan</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-cyan-400 stroke-[2.5] shrink-0" />
                      <span className="text-xs sm:text-sm text-slate-300 font-medium">DDoS Protection</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-cyan-400 stroke-[2.5] shrink-0" />
                      <span className="text-xs sm:text-sm text-slate-300 font-medium">FTP Access</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-cyan-400 stroke-[2.5] shrink-0" />
                      <span className="text-xs sm:text-sm text-slate-300 font-medium">Panel Pterodactyl</span>
                    </div>
                  </div>
                </div>

                {/* Action Button: Beli Sekarang vs Stok Habis */}
                {isPkgAvailable ? (
                  <button
                    onClick={() => handleOrderClick(pkg)}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#081b33] hover:bg-[#00d2ff] hover:text-[#020b18] text-white border border-[#143965] hover:border-[#00d2ff] font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
                    id={`catalog-btn-buy-${pkg.id}`}
                  >
                    <span>Beli Sekarang</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-3.5 px-4 rounded-xl bg-rose-950/30 text-rose-400/80 border border-rose-500/30 font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed opacity-75"
                    id={`catalog-btn-buy-${pkg.id}`}
                  >
                    <span>Stok Habis (0 Unit)</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

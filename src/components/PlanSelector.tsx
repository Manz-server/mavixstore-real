import React, { useState } from 'react';
import { PlanId, SelectedPackageDetails, AllStockState } from '../types';
import { Cpu, HardDrive, Zap, ChevronRight, Check, Sparkles, Crown, ArrowLeft, Layers, Grid, LayoutDashboard, Store, Folder } from 'lucide-react';
import { TIER_PACKAGES, PackageItem } from '../data/packagesData';
import { getPackageStockInfo, getTierTotalRam, isTierAvailable } from '../utils/stockService';

import officialSteveAlex from '../assets/images/official_minecraft_steve_alex.jpg';
import officialKeyArt2024 from '../assets/images/official_minecraft_key_art_2024.jpg';
import officialCombatAction from '../assets/images/official_minecraft_combat_action.jpg';

const TIER_HERO_DATA: Record<PlanId, {
  name: string;
  cpu: string;
  description: string;
  bgImage: string;
}> = {
  lite: {
    name: 'Lite Hosting',
    cpu: 'Intel Platinum 8370C',
    description: 'Hosting yang menggunakan prosesor Intel Platinum 8370C yang stabil dan hemat biaya, paket ini cocok untuk server pemula, survival ringan, atau teman bermain privat. Ideal untuk vanilla gameplay dan komunitas kecil.',
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
    description: 'Hosting yang menggunakan prosesor monster Intel Xeon Gold 6154 dengan clock speed tinggi dan memori ECC, dirancang untuk performa tanpa kompromi. Ideal untuk server besar, network multiplayer, dan modpack berat.',
    bgImage: officialCombatAction
  }
};

interface PlanSelectorProps {
  onSelectPlan: (planId: PlanId, ram: number, pkgDetails?: SelectedPackageDetails) => void;
  onViewPackages?: (tierId: PlanId) => void;
  stock?: AllStockState;
}

export default function PlanSelector({ onSelectPlan, onViewPackages, stock }: PlanSelectorProps) {
  // Default to 'tiers' (3 cards matching Screenshot 56 & 57)
  const [viewMode, setViewMode] = useState<'tiers' | 'packages'>('tiers');
  // If user switches to individual packages list
  const [activePackageTier, setActivePackageTier] = useState<PlanId>('lite');

  const packagesByTier = TIER_PACKAGES;

  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString('id-ID')}`;
  };

  const handleOpenTierPackages = (tierId: PlanId) => {
    if (!isTierAvailable(stock, tierId)) {
      alert(`Mohon maaf, stok kapasitas RAM untuk kategori ${tierId.toUpperCase()} saat ini sedang habis (0 GB)!`);
      return;
    }

    if (onViewPackages) {
      onViewPackages(tierId);
    } else {
      setActivePackageTier(tierId);
      setViewMode('packages');
    }
  };

  const handleOrder = (pkg: PackageItem) => {
    const pkgStock = getPackageStockInfo(stock, activePackageTier, pkg.ramGb);
    if (!pkgStock.inStock) {
      alert(`Mohon maaf, stok paket ${pkg.name} (${pkg.ramGb} GB RAM) saat ini sedang habis!`);
      return;
    }

    const tierName =
      activePackageTier === 'lite'
        ? 'LITE HOSTING'
        : activePackageTier === 'basic'
        ? 'BASIC HOSTING'
        : 'PRIME HOSTING';

    const pkgDetails: SelectedPackageDetails = {
      id: pkg.id,
      name: pkg.name,
      tierId: activePackageTier,
      tierName,
      price: pkg.price,
      originalPrice: pkg.originalPrice,
      discountPct: pkg.discountPct,
      vCore: pkg.vCore,
      ramGb: pkg.ramGb,
      diskGb: pkg.diskGb,
      processor: pkg.processor
    };

    onSelectPlan(activePackageTier, pkg.ramGb, pkgDetails);
  };

  // 3 Primary Tier Cards matching original names and prices: Lite (5k), Basic (8k), Prime (12.5k)
  const mainTiers = [
    {
      id: 'lite' as PlanId,
      eyebrow: 'ENTRY-LEVEL STABILITY',
      eyebrowDotColor: 'bg-slate-400',
      eyebrowTextColor: 'text-slate-400',
      badge: null,
      title: 'Lite Hosting',
      subtitle: 'Solusi terjangkau untuk game server kecil-menengah & friend SMP',
      price: '5.000',
      processorName: 'Intel Platinum 8370C',
      processorSub: 'Enterprise High Compute',
      memoryName: '1-16 GB RAM',
      memorySub: 'DDR4 ECC',
      storageText: 'High-Speed NVMe SSD',
      isPopular: false,
      bgImage: officialSteveAlex,
      features: [
        'Pterodactyl Panel Modern',
        'Unlimited MySQL Databases',
        'CosmicGuard DDoS Protection 500 Gbps',
        '24/7 Ticket & WA Support',
        'Full FTP & SFTP Access',
        '1x Slot Auto Backup System'
      ]
    },
    {
      id: 'basic' as PlanId,
      eyebrow: 'PERFORMANCE CORE',
      eyebrowDotColor: 'bg-cyan-400',
      eyebrowTextColor: 'text-cyan-400',
      badge: {
        text: 'PALING POPULER',
        icon: Crown,
        style: 'bg-[#052b47] border border-cyan-400/40 text-[#00d2ff]'
      },
      title: 'Basic Hosting',
      subtitle: 'Keseimbangan terbaik performa & harga dengan Intel Xeon v4 2695',
      price: '8.000',
      processorName: 'Intel Xeon v4 2695',
      processorSub: 'Enterprise Broadwell',
      memoryName: '1-16 GB RAM',
      memorySub: 'DDR4 ECC',
      storageText: 'Ultra Fast Gen4 NVMe (5000 MB/s)',
      isPopular: true,
      bgImage: officialKeyArt2024,
      features: [
        'CPU Intel Xeon v4 2695 Enterprise',
        'CosmicGuard Game DDoS Filter 2 Tbps',
        '3x Slot Automated Daily Backup',
        'Dukungan Penuh Java & Bedrock Crossplay',
        'Instant Auto-Deployment Panel',
        'Support Prioritas WhatsApp 24/7'
      ]
    },
    {
      id: 'prime' as PlanId,
      eyebrow: 'PERFORMA SULTAN',
      eyebrowDotColor: 'bg-cyan-400',
      eyebrowTextColor: 'text-cyan-300',
      badge: {
        text: 'XEON GOLD',
        icon: Sparkles,
        style: 'bg-[#08203d] border border-cyan-400/40 text-cyan-300'
      },
      title: 'Prime Hosting',
      subtitle: 'Performa monster tanpa kompromi bertenaga Intel Xeon Gold 6154',
      price: '12.500',
      processorName: 'Intel Xeon Gold 6154',
      processorSub: 'Enterprise High-Clock',
      memoryName: '1-16 GB RAM',
      memorySub: 'DDR4 ECC',
      storageText: 'Enterprise NVMe Gen4 (7000 MB/s)',
      isPopular: false,
      bgImage: officialCombatAction,
      features: [
        'CPU Intel Xeon Gold 6154 Enterprise',
        'Enterprise NVMe Gen4 (7000 MB/s)',
        'CosmicGuard Ultra-Shield 3.2 Tbps',
        '5x Slot Automated Offsite Backup',
        'Dedicated High-Clock vCPU Allocation',
        'VIP Priority Support Telegram & WA'
      ]
    }
  ];

  return (
    <section id="plans" className="relative py-16 sm:py-24 bg-[#020b18] overflow-hidden">
      {/* Background ambient glow matching screenshot */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-cyan-600/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[300px] bg-blue-700/10 blur-[110px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center mb-12 space-y-4 text-center">
          {/* Badge Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#051b2f] border border-cyan-500/30 text-cyan-400 text-xs font-black uppercase tracking-[0.16em] shadow-[0_0_20px_rgba(0,210,255,0.15)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>PILIHAN PAKET HOSTING MINECRAFT</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-2xl">
            Pilih Paket Server{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400 drop-shadow-[0_0_25px_rgba(56,189,248,0.5)]">
              Terbaik Kamu
            </span>
          </h2>

          <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
            Infrastruktur handal dengan performa single-core tinggi, storage NVMe ultra cepat, dan proteksi anti-DDoS 24/7.
          </p>
        </div>

        {/* VIEW 1: EXACT SCREENSHOT (56) & (57) 3-TIER CARDS GRID */}
        {viewMode === 'tiers' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7 items-stretch">
            {mainTiers.map((tier) => {
              const BadgeIcon = tier.badge?.icon;
              const isAvailable = isTierAvailable(stock, tier.id);
              const totalRam = getTierTotalRam(stock, tier.id);

              return (
                <div
                  key={tier.id}
                  className={`rounded-[30px] p-6 sm:p-7 xl:p-8 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden ${
                    !isAvailable
                      ? 'bg-[#051329]/95 border border-rose-500/40 shadow-[0_0_30px_rgba(244,63,94,0.1)] opacity-90'
                      : tier.isPopular
                      ? 'bg-[#061836] border-2 border-cyan-400/50 hover:border-cyan-400/80 shadow-[0_4px_24px_rgba(0,210,255,0.12)]'
                      : 'bg-[#051329] border border-[#122e54] hover:border-[#1e4880] shadow-[0_10px_40px_rgba(0,0,0,0.5)]'
                  }`}
                >
                  {/* Background Minecraft Trailer Artwork with Bottom Shadow */}
                  <div className="absolute inset-x-0 top-0 h-[280px] sm:h-[300px] overflow-hidden pointer-events-none z-0">
                    <img
                      src={tier.bgImage}
                      alt={`${tier.title} Minecraft trailer background`}
                      referrerPolicy="no-referrer"
                      className={`w-full h-full ${
                        tier.isPopular
                          ? 'object-cover object-center opacity-40 sm:opacity-50 group-hover:scale-105 group-hover:opacity-65'
                          : 'object-cover object-top opacity-55 sm:opacity-65 group-hover:scale-105 group-hover:opacity-80'
                      } transition-all duration-700 ease-out`}
                    />

                    {/* Dark subtle top vignette to ensure badges & eyebrow stay super readable */}
                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#020b18]/90 via-[#020b18]/45 to-transparent" />

                    {/* Shadow underneath the image fading into the card body */}
                    <div 
                      className={`absolute inset-x-0 bottom-0 h-52 sm:h-56 bg-gradient-to-t ${
                        tier.isPopular 
                          ? 'from-[#061836] via-[#061836]/95 via-[#061836]/75 to-transparent' 
                          : 'from-[#051329] via-[#051329]/95 via-[#051329]/75 to-transparent'
                      }`} 
                    />

                    {/* Ambient bottom drop shadow for prominent depth */}
                    <div className="absolute inset-x-0 bottom-0 h-28 shadow-[0_30px_50px_25px_#020b18]" />
                  </div>

                  <div className="relative z-10">
                    {/* Top Eyebrow & Optional Badge */}
                    <div className="flex items-center justify-between gap-2 min-h-[28px]">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${!isAvailable ? 'bg-rose-500' : tier.eyebrowDotColor}`} />
                        <span className={`text-[11px] font-black uppercase tracking-wider ${!isAvailable ? 'text-rose-400' : tier.eyebrowTextColor}`}>
                          {tier.eyebrow}
                        </span>
                      </div>

                      {!isAvailable ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-950/60 border border-rose-500/50 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                          <span>STOK HABIS (0 GB)</span>
                        </div>
                      ) : tier.badge ? (
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${tier.badge.style}`}>
                          {BadgeIcon && <BadgeIcon className="w-3.5 h-3.5" />}
                          <span>{tier.badge.text}</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-cyan-300 bg-cyan-950/40 border border-cyan-500/30">
                          <span>{totalRam} GB Pool</span>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                      {tier.title}
                    </h3>

                    {/* Subtitle */}
                    <p className="text-slate-200 text-xs sm:text-sm mt-2 leading-relaxed min-h-[40px] drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] font-medium">
                      {tier.subtitle}
                    </p>

                    {/* Price matching Screenshot (56) & (57) */}
                    <div className="flex items-baseline gap-1.5 mt-5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                      <span className="text-base font-bold text-slate-300">Rp</span>
                      <span className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-none">
                        {tier.price}
                      </span>
                      <span className="text-xs font-black text-slate-400 tracking-wider uppercase ml-1">
                        /GB/BULAN
                      </span>
                    </div>

                    {/* Spec Boxes matching Screenshot (56) & (57) */}
                    {/* Row 1: Two boxes (Processor & Memory) */}
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mt-6">
                      {/* Box 1: Processor */}
                      <div className="bg-[#081b36]/90 border border-[#11315c] rounded-2xl p-3 sm:p-3.5 flex flex-col justify-center min-w-0">
                        <div className="flex items-center gap-1.5 text-cyan-400 mb-1 min-w-0">
                          <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
                          <span className="text-[9px] sm:text-[10px] font-black tracking-wide uppercase text-slate-400 truncate">PROCESSOR</span>
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-white leading-tight break-words">
                          {tier.processorName}
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium mt-0.5 break-words">
                          {tier.processorSub}
                        </div>
                      </div>

                      {/* Box 2: Memory */}
                      <div className="bg-[#081b36]/90 border border-[#11315c] rounded-2xl p-3 sm:p-3.5 flex flex-col justify-center min-w-0">
                        <div className="flex items-center gap-1.5 text-cyan-400 mb-1 min-w-0">
                          <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
                          <span className="text-[9px] sm:text-[10px] font-black tracking-wide uppercase text-slate-400 truncate">MEMORY</span>
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-white leading-tight break-words">
                          {tier.memoryName}
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium mt-0.5 break-words">
                          {tier.memorySub}
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Full-width Storage Box */}
                    <div className="bg-[#081b36]/90 border border-[#11315c] rounded-2xl p-3 sm:p-3.5 mt-2.5 sm:mt-3 flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div className="flex items-center gap-1.5 text-cyan-400 shrink-0">
                        <HardDrive className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                        <span className="text-[9px] sm:text-[10px] font-black tracking-wide uppercase text-slate-400">STORAGE</span>
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-white truncate">
                        {tier.storageText}
                      </div>
                    </div>

                    {/* YANG DIDAPAT Section matching Screenshot (56) & (57) */}
                    <div className="mt-7 pt-6 border-t border-[#0e274a]">
                      <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-3.5">
                        YANG DIDAPAT
                      </div>
                      <div className="space-y-2.5">
                        {tier.features.map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full bg-cyan-950 border border-cyan-500/50 flex items-center justify-center shrink-0">
                              <Check className="w-2.5 h-2.5 text-cyan-400 stroke-[3]" />
                            </div>
                            <span className="text-xs sm:text-sm text-slate-300 font-medium">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Button: Lihat Paket vs Stok Habis */}
                  <div className="pt-8 relative z-10">
                    {isAvailable ? (
                      <button
                        onClick={() => handleOpenTierPackages(tier.id)}
                        className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer group ${
                          tier.isPopular
                            ? 'bg-[#00d2ff] hover:bg-cyan-300 text-slate-950 shadow-[0_0_30px_rgba(0,210,255,0.4)]'
                            : 'bg-[#081b36] hover:bg-[#00d2ff] text-white hover:text-slate-950 border border-[#143965] hover:border-[#00d2ff]'
                        }`}
                        id={`btn-lihat-paket-${tier.id}`}
                      >
                        <span>Lihat Paket</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full py-3.5 px-6 rounded-2xl font-black text-sm bg-rose-950/40 border border-rose-500/40 text-rose-400 flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
                        id={`btn-lihat-paket-${tier.id}`}
                      >
                        <span>Stok Habis</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW 2: DIRECT RAM PACKAGES GRID (Screenshot 37 & 2026-09-20 044607.png) */}
        {viewMode === 'packages' && (() => {
          const currentHero = TIER_HERO_DATA[activePackageTier];
          return (
            <div className="space-y-8 animate-fadeIn">
              {/* Breadcrumb matching Screenshot */}
              <nav 
                aria-label="Breadcrumb"
                className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-400 mb-2 font-medium flex-wrap"
              >
                <button
                  onClick={() => setViewMode('tiers')}
                  className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-slate-400 hover:text-cyan-300"
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-400" />
                  <span>Dashboard</span>
                </button>

                <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />

                <button
                  onClick={() => setViewMode('tiers')}
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

              {/* Hero Banner matching Screenshot */}
              <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-[#14325a] shadow-[0_20px_50px_rgba(0,0,0,0.6)] min-h-[220px] sm:min-h-[250px] md:min-h-[270px] flex items-center mb-6 group">
                <img
                  src={currentHero.bgImage}
                  alt={`${currentHero.name} Minecraft artwork`}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-[1.01] transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-[#020b18]/95 via-[#020b18]/80 via-[#020b18]/45 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#020b18]/90 via-[#020b18]/50 to-transparent" />

                <div className="relative z-10 p-6 sm:p-8 md:p-12 max-w-2xl">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                    {currentHero.name}
                  </h1>
                  <p className="mt-3 text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.95)] font-normal">
                    {currentHero.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#0e2547]">
                <button
                  onClick={() => setViewMode('tiers')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#061833] hover:bg-[#0a2347] border border-[#143a6b] text-cyan-300 hover:text-white text-xs sm:text-sm font-bold transition-all cursor-pointer w-fit"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali ke 3 Kategori Utama</span>
                </button>

                {/* Tier selector pills */}
                <div className="inline-flex items-center p-1 rounded-xl bg-[#061426] border border-[#12315a]">
                  <button
                    onClick={() => setActivePackageTier('lite')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activePackageTier === 'lite'
                        ? 'bg-[#00d2ff] text-slate-950 font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Lite (5k/GB)
                  </button>
                  <button
                    onClick={() => setActivePackageTier('basic')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activePackageTier === 'basic'
                        ? 'bg-[#00d2ff] text-slate-950 font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Basic (8k/GB) ★
                  </button>
                  <button
                    onClick={() => setActivePackageTier('prime')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activePackageTier === 'prime'
                        ? 'bg-[#00d2ff] text-slate-950 font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Prime (12.5k/GB)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {packagesByTier[activePackageTier].items.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`rounded-[24px] p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 relative group bg-[#061426] border ${
                    pkg.isHighlighted
                      ? 'border-cyan-500/70 shadow-[0_0_35px_rgba(0,210,255,0.18)] hover:border-cyan-400'
                      : 'border-[#11294a] hover:border-[#1d4880] shadow-[0_8px_30px_rgba(0,0,0,0.4)]'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3
                          className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                            pkg.isHighlighted
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

                      {(() => {
                        const pkgStock = getPackageStockInfo(stock, activePackageTier, pkg.ramGb);
                        return pkgStock.inStock ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#05261d] border border-[#0d553e] text-[#22c55e] text-xs font-bold shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                            <span>TERSEDIA ({pkgStock.stockCount} Unit)</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-400 text-xs font-bold shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                            <span>STOK HABIS</span>
                          </div>
                        );
                      })()}
                    </div>

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

                    <div className="grid grid-cols-3 gap-2.5 my-6">
                      <div className="bg-[#0a1c36] border border-[#143763] rounded-2xl py-3 px-2 flex flex-col items-center justify-center text-center min-w-0">
                        <Cpu className="w-4 h-4 text-cyan-400 mb-1 shrink-0" />
                        <span className="text-[11px] text-slate-400 font-medium truncate w-full">vCore</span>
                        <span className="text-xs sm:text-sm font-bold text-white mt-0.5 truncate w-full">{pkg.vCore}</span>
                      </div>

                      <div className="bg-[#0a1c36] border border-[#143763] rounded-2xl py-3 px-2 flex flex-col items-center justify-center text-center min-w-0">
                        <Zap className="w-4 h-4 text-cyan-400 mb-1 shrink-0" />
                        <span className="text-[11px] text-slate-400 font-medium truncate w-full">RAM</span>
                        <span className="text-xs sm:text-sm font-bold text-cyan-300 mt-0.5 truncate w-full">{pkg.ramGb} GB</span>
                      </div>

                      <div className="bg-[#0a1c36] border border-[#143763] rounded-2xl py-3 px-2 flex flex-col items-center justify-center text-center min-w-0">
                        <HardDrive className="w-4 h-4 text-cyan-400 mb-1 shrink-0" />
                        <span className="text-[11px] text-slate-400 font-medium truncate w-full">Disk</span>
                        <span className="text-xs sm:text-sm font-bold text-white mt-0.5 truncate w-full">{pkg.diskGb} GB</span>
                      </div>
                    </div>

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

                  {(() => {
                    const pkgStock = getPackageStockInfo(stock, activePackageTier, pkg.ramGb);
                    return pkgStock.inStock ? (
                      <button
                        onClick={() => handleOrder(pkg)}
                        className="w-full py-3.5 px-4 rounded-xl bg-[#081b33] hover:bg-[#00d2ff] hover:text-[#020b18] text-white border border-[#143965] hover:border-[#00d2ff] font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
                        id={`pkg-btn-buy-${pkg.id}`}
                      >
                        <span>Beli Sekarang</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full py-3.5 px-4 rounded-xl bg-rose-950/30 text-rose-400/80 border border-rose-500/30 font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed opacity-75"
                        id={`pkg-btn-buy-${pkg.id}`}
                      >
                        <span>Stok Habis (0 Unit)</span>
                      </button>
                    );
                  })()}
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      </div>
    </section>
  );
}

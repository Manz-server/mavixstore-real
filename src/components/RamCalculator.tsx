import { useState } from 'react';
import { PLANS, DURATION_DISCOUNTS, calculatePricing, formatRupiah } from '../data/plans';
import { PlanId } from '../types';
import { Calculator, Users, Cpu, HardDrive, Zap, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

interface RamCalculatorProps {
  onProceedOrder: (planId: PlanId, ram: number, duration: number) => void;
}

export default function RamCalculator({ onProceedOrder }: RamCalculatorProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>('basic');
  const [ramGb, setRamGb] = useState<number>(6);
  const [durationMonths, setDurationMonths] = useState<number>(1);

  const plan = PLANS[selectedPlanId];
  const pricing = calculatePricing(selectedPlanId, ramGb, durationMonths);

  // Recommendations based on RAM
  const getRamRecommendation = (ram: number) => {
    if (ram <= 2) {
      return {
        players: '3 - 8 Pemain',
        type: 'Vanilla / Spigot Ringan',
        plugins: '1 - 10 Plugin Dasar',
        description: 'Ideal untuk private SMP bersama teman dekat tanpa banyak modifikasi berat.'
      };
    } else if (ram <= 4) {
      return {
        players: '10 - 25 Pemain',
        type: 'Paper / Purpur SMP',
        plugins: '15 - 30 Plugin (Economy, Claims, Jobs)',
        description: 'Standar server survival modern dengan proteksi klaim, shop, dan login auth.'
      };
    } else if (ram <= 8) {
      return {
        players: '25 - 60 Pemain',
        type: 'Modpack Menengah / Crossplay',
        plugins: '40+ Plugin / 50+ Mod (BetterMC, Cobblemon)',
        description: 'Sangat stabil untuk event komunitas, Geyser Bedrock crossplay, dan modpack petualangan.'
      };
    } else if (ram <= 16) {
      return {
        players: '60 - 120 Pemain',
        type: 'Heavy Modpack / Network Hub',
        plugins: '70+ Plugin / Heavy Modpack (All The Mods, ATM9)',
        description: 'Performa monster untuk server dungeon, RPG MMO Minecraft dengan custom texture & quest.'
      };
    } else {
      return {
        players: '150+ Pemain',
        type: 'Enterprise Network & BungeeCord',
        plugins: '100+ Plugin / Huge Modpack Cluster',
        description: 'Kapasitas maksimal untuk server network bertingkat, mini-games, dan event turnamen.'
      };
    }
  };

  const rec = getRamRecommendation(ramGb);

  return (
    <section id="calculator" className="py-20 relative bg-gradient-to-b from-[#020b18] via-[#04132a] to-[#020b18] border-y border-[#12345e] overflow-hidden">
      {/* Subtle light-green and cyan ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-[#00d2ff]/[0.07] blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-1/4 w-[420px] h-[280px] bg-emerald-500/[0.045] blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#062634] border border-[#00d2ff]/30 text-cyan-300 text-xs font-semibold">
            <Calculator className="w-3.5 h-3.5 text-[#00d2ff]" />
            <span>Kalkulator Kebutuhan Server</span>
            <span className="w-1 h-1 rounded-full bg-[#4ade80]" />
            <span className="text-[10px] text-[#4ade80] font-bold uppercase tracking-wider">Hemat & Akurat</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Hitung Estimasi RAM & Biaya <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-400 to-[#4ade80]">Secara Transparan</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Sesuaikan alokasi RAM dan durasi sewa sesuai anggaran dan kebutuhan server komunitas kamu.
          </p>
        </div>

        {/* Main Calculator Box */}
        <div className="max-w-4xl mx-auto bg-[#061833] border border-[#12345e] hover:border-[#154273] rounded-[32px] p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Controls (Plan, RAM, Duration) */}
            <div className="lg:col-span-7 space-y-6">
              {/* 1. Pilih Paket Tier */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-3">
                  1. Pilih Tipe Paket:
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['lite', 'basic', 'prime'] as PlanId[]).map((pid) => {
                    const p = PLANS[pid];
                    const active = selectedPlanId === pid;
                    return (
                      <button
                        key={pid}
                        type="button"
                        onClick={() => setSelectedPlanId(pid)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          active
                            ? 'bg-[#0a2e5c] border-2 border-[#00d2ff] text-white shadow-[0_0_20px_rgba(0,210,255,0.3)]'
                            : 'bg-[#0a2347] border-[#153a66] text-[#94a3b8] hover:border-[#1c477d] hover:text-white'
                        }`}
                      >
                        <div className="text-xs font-bold text-white">{p.name.replace('Paket ', '')}</div>
                        <div className="text-[11px] font-mono text-[#00d2ff] mt-0.5 font-bold">
                          {formatRupiah(p.pricePerGb)}/GB
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Slider RAM */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
                    2. Alokasi Kapasitas RAM:
                  </label>
                  <span className="text-xl font-extrabold text-[#00d2ff] font-mono">
                    {ramGb} GB RAM
                  </span>
                </div>

                <input
                  type="range"
                  min={1}
                  max={32}
                  step={1}
                  value={ramGb}
                  onChange={(e) => setRamGb(Number(e.target.value))}
                  className="w-full h-2.5 bg-[#0a2347] rounded-lg appearance-none cursor-pointer accent-[#00d2ff]"
                />

                <div className="flex justify-between text-[11px] text-[#64748b] font-mono mt-1">
                  <span>1 GB</span>
                  <span>8 GB</span>
                  <span>16 GB</span>
                  <span>24 GB</span>
                  <span>32 GB</span>
                </div>

                {/* Quick select buttons */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {[2, 4, 6, 8, 12, 16, 24, 32].map((gb) => (
                    <button
                      key={gb}
                      type="button"
                      onClick={() => setRamGb(gb)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        ramGb === gb
                          ? 'bg-[#00d2ff] text-[#021124] shadow-[0_0_15px_rgba(0,210,255,0.4)]'
                          : 'bg-[#0a2347] text-[#94a3b8] hover:text-white border border-[#153a66] hover:border-[#1c477d]'
                      }`}
                    >
                      {gb} GB
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Durasi Sewa */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-2.5">
                  3. Durasi Sewa:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[1, 3, 6, 12].map((months) => {
                    const discount = DURATION_DISCOUNTS[months];
                    const active = durationMonths === months;
                    return (
                      <button
                        key={months}
                        type="button"
                        onClick={() => setDurationMonths(months)}
                        className={`p-2.5 rounded-xl border text-center transition-all relative ${
                          active
                            ? 'bg-[#0a2e5c] border-2 border-[#00d2ff] text-white shadow-[0_0_15px_rgba(0,210,255,0.3)]'
                            : 'bg-[#0a2347] border-[#153a66] text-[#94a3b8] hover:text-white hover:border-[#1c477d]'
                        }`}
                      >
                        {discount.badge && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-[#062e24] text-[#4ade80] border border-[#4ade80]/40 font-black text-[9px] whitespace-nowrap shadow-[0_0_8px_rgba(74,222,128,0.25)]">
                            {discount.badge}
                          </span>
                        )}
                        <div className="text-xs font-bold">{discount.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Server Specs Recommendation Preview with subtle light-green touch */}
              <div className="p-4 rounded-2xl bg-[#0a2347] border border-[#153a66] hover:border-[#4ade80]/30 transition-colors space-y-2 text-xs">
                <div className="font-bold text-white flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#4ade80]" />
                    <span className="text-[#4ade80] font-bold">Rekomendasi Kapasitas {ramGb} GB RAM</span>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-200 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#4ade80] shrink-0" />
                    <span>{rec.players}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>{rec.type}</span>
                  </div>
                </div>
                <p className="text-[11px] text-[#94a3b8] pt-1 border-t border-[#153a66]">
                  {rec.description}
                </p>
              </div>
            </div>

            {/* Right Summary & Checkout Box */}
            <div className="lg:col-span-5 bg-[#071e40] border-2 border-[#00d2ff]/60 rounded-3xl p-6 sm:p-7 space-y-5 shadow-[0_0_40px_rgba(0,210,255,0.2)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#153a66]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
                    Ringkasan Estimasi
                  </span>
                  <span className="px-2.5 py-1 text-[10px] font-black rounded-full bg-[#062e24] text-[#4ade80] border border-[#4ade80]/40 flex items-center gap-1 shadow-[0_0_10px_rgba(74,222,128,0.2)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
                    Aktivasi Instan
                  </span>
                </div>

                {/* Spec List */}
                <div className="py-4 space-y-3 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-[#94a3b8]">Paket:</span>
                    <span className="font-bold text-white">{plan.name}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-[#94a3b8]">RAM Dedicated:</span>
                    <span className="font-bold text-[#00d2ff] font-mono">{ramGb} GB RAM</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-[#94a3b8]">NVMe Storage:</span>
                    <span className="font-bold text-white font-mono">{ramGb * plan.storagePerGb} GB NVMe</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-[#94a3b8]">CPU Allocation:</span>
                    <span className="font-bold text-white truncate max-w-[170px]">{plan.cpuShares}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-[#94a3b8]">Durasi:</span>
                    <span className="font-bold text-white">{durationMonths} Bulan</span>
                  </div>

                  {pricing.durationDiscountAmount > 0 && (
                    <div className="flex justify-between text-[#4ade80] bg-[#062e24]/50 px-2.5 py-1.5 rounded-lg border border-[#4ade80]/30">
                      <span>Diskon Durasi ({pricing.discountPct}%):</span>
                      <span className="font-mono font-bold">-{formatRupiah(pricing.durationDiscountAmount)}</span>
                    </div>
                  )}
                </div>

                {/* Total Price display */}
                <div className="pt-4 border-t border-[#153a66]">
                  <div className="text-xs text-[#94a3b8] mb-1">Total Biaya:</div>
                  <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    {formatRupiah(pricing.grandTotal)}
                  </div>
                  <div className="text-[11px] text-[#00d2ff] mt-0.5 font-semibold">
                    Hanya {formatRupiah(Math.round(pricing.grandTotal / durationMonths))}/bulan
                  </div>
                </div>
              </div>

              {/* Direct Order Button */}
              <div className="pt-4 space-y-2">
                <button
                  onClick={() => onProceedOrder(selectedPlanId, ramGb, durationMonths)}
                  className="w-full py-4 px-5 rounded-2xl font-black text-sm text-[#021124] bg-[#00d2ff] hover:bg-[#33dcff] shadow-[0_0_35px_rgba(0,210,255,0.45)] hover:shadow-[0_0_45px_rgba(0,210,255,0.65)] transition-all flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer"
                  id="calc-btn-proceed"
                >
                  <span>Lanjut Konfigurasi Pesanan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[10px] text-center text-[#94a3b8]">
                  ⚡ Alur: Paket → Konfigurasi → Pembayaran → Teleportasi WA
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

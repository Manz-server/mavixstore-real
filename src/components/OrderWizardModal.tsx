import { useState, useEffect } from 'react';
import { PLANS, NODE_LOCATIONS, SOFTWARE_OPTIONS, DURATION_DISCOUNTS, PAYMENT_METHODS, formatRupiah, calculatePricing, generateWhatsAppMessage, generateWhatsAppUrl, ADMIN_WHATSAPP_NUMBER } from '../data/plans';
import { PlanId, OrderState, CheckoutStep } from '../types';
import { SITE_CONFIG } from '../config';
import EWalletBadges, { QrisLogo, GpnLogo } from './EWalletLogos';
import { 
  X, Check, ArrowRight, ArrowLeft, Server, ShieldCheck, 
  Copy, CheckCheck, ExternalLink, QrCode, CreditCard, 
  Smartphone, Building, Sparkles, AlertCircle, Clock, Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface OrderWizardModalProps {
  isOpen: boolean;
  initialPlanId?: PlanId;
  initialRam?: number;
  initialDuration?: number;
  onClose: () => void;
}

export default function OrderWizardModal({
  isOpen,
  initialPlanId = 'basic',
  initialRam,
  initialDuration = 1,
  onClose
}: OrderWizardModalProps) {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('select_plan');
  
  // Invoice ID generated once per order session
  const [invoiceId, setInvoiceId] = useState<string>('');

  const [order, setOrder] = useState<OrderState>({
    planId: initialPlanId,
    ramGb: initialRam || PLANS[initialPlanId].defaultRam,
    durationMonths: initialDuration,
    serverName: 'Mavix SMP',
    subdomain: 'myserver',
    software: 'Purpur 1.21.1',
    nodeLocation: 'SG-01',
    customerName: '',
    customerWhatsapp: '',
    customerEmail: '',
    customerDiscord: '',
    voucherCode: '',
    paymentMethod: 'qris'
  });

  const [voucherInput, setVoucherInput] = useState('');
  const [voucherApplied, setVoucherApplied] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [qrisTimer, setQrisTimer] = useState(900); // 15 minutes countdown

  // Initialize or reset when modal opens
  useEffect(() => {
    if (isOpen) {
      const randomCode = Math.floor(100000 + Math.random() * 900000);
      setInvoiceId(`MVX-${randomCode}`);
      setCurrentStep('select_plan');
      setOrder(prev => ({
        ...prev,
        planId: initialPlanId,
        ramGb: initialRam || PLANS[initialPlanId].defaultRam,
        durationMonths: initialDuration
      }));
      setQrisTimer(900);
    }
  }, [isOpen, initialPlanId, initialRam, initialDuration]);

  // QRIS Countdown Timer
  useEffect(() => {
    if (currentStep !== 'payment' || qrisTimer <= 0) return;
    const timer = setInterval(() => {
      setQrisTimer(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentStep, qrisTimer]);

  if (!isOpen) return null;

  const currentPlan = PLANS[order.planId] || PLANS.basic;
  const pricing = calculatePricing(order.planId, order.ramGb, order.durationMonths, voucherApplied ? voucherInput : undefined);

  const stepsList: { id: CheckoutStep; number: number; label: string; shortLabel: string }[] = [
    { id: 'select_plan', number: 1, label: 'Pilih Paket', shortLabel: 'Paket' },
    { id: 'configure', number: 2, label: 'Konfigurasi Server', shortLabel: 'Konfigurasi' },
    { id: 'payment', number: 3, label: 'Pembayaran', shortLabel: 'Bayar' },
    { id: 'teleport_wa', number: 4, label: 'Teleportasi WA', shortLabel: 'Kirim WA' },
  ];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(key);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleApplyVoucher = () => {
    if (!voucherInput.trim()) return;
    const upper = voucherInput.trim().toUpperCase();
    if (upper === 'MAVIXHEMAT' || upper === 'MAVIXNEW') {
      setVoucherApplied(true);
      setOrder(prev => ({ ...prev, voucherCode: upper }));
    } else {
      alert('Kode voucher tidak valid. Coba gunakan: MAVIXHEMAT');
    }
  };

  const handleGoToStep = (step: CheckoutStep) => {
    // Validation before moving to payment
    if (step === 'payment') {
      if (!order.customerName.trim()) {
        alert('Mohon masukkan Nama Buyer Anda terlebih dahulu.');
        return;
      }
      if (!order.customerWhatsapp.trim()) {
        alert('Mohon masukkan Nomor WhatsApp aktif untuk konfirmasi pesanan.');
        return;
      }
    }

    if (step === 'teleport_wa') {
      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }
    }

    setCurrentStep(step);
  };

  const formattedTimer = `${Math.floor(qrisTimer / 60).toString().padStart(2, '0')}:${(qrisTimer % 60).toString().padStart(2, '0')}`;
  const whatsAppUrl = generateWhatsAppUrl(order, invoiceId);
  const whatsAppText = generateWhatsAppMessage(order, invoiceId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-4xl bg-[#090d17] border border-cyan-500/40 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden my-6">
        {/* Top Gradient Banner & Close Button */}
        <div className="relative bg-gradient-to-r from-cyan-950/60 via-[#0e1627] to-blue-950/60 p-5 sm:p-6 border-b border-cyan-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                <span>Order Portal Mavix Store</span>
                <span className="text-xs px-2 py-0.5 rounded font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
                  #{invoiceId}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Alur Pemesanan Cepat &bull; Aktivasi Instan &bull; Terhubung Langsung ke WhatsApp
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Step Progress Breadcrumb (matches user's requested flow) */}
        <div className="px-4 sm:px-8 py-3 bg-[#060911] border-b border-slate-800/80">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {stepsList.map((step, idx) => {
              const isActive = currentStep === step.id;
              const isPast = stepsList.findIndex(s => s.id === currentStep) > idx;
              return (
                <div key={step.id} className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.8)] scale-110'
                          : isPast
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isPast ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.number}
                    </div>
                    <span
                      className={`text-xs font-semibold hidden sm:inline ${
                        isActive ? 'text-cyan-300 font-bold' : isPast ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {step.label}
                    </span>
                    <span className={`text-[11px] font-semibold sm:hidden ${isActive ? 'text-cyan-300' : 'text-slate-500'}`}>
                      {step.shortLabel}
                    </span>
                  </div>

                  {idx < stepsList.length - 1 && (
                    <div className="w-6 sm:w-12 h-[1.5px] mx-1 bg-slate-800">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isPast ? 'bg-cyan-500' : 'bg-transparent'
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content Body */}
        <div className="p-5 sm:p-8 max-h-[72vh] overflow-y-auto">
          {/* ========================================================
              STEP 1: MEMILIH PAKET (Lite, Basic, Prime)
             ======================================================== */}
          {currentStep === 'select_plan' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  1. Pilih Paket & Kapasitas RAM
                </h3>
                <p className="text-xs text-slate-400">
                  Tentukan spesifikasi inti server Minecraft kamu. Tersedia 3 tier sesuai budget dan skala pemain.
                </p>
              </div>

              {/* 3 Package Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(['lite', 'basic', 'prime'] as PlanId[]).map((pid) => {
                  const p = PLANS[pid];
                  const isSelected = order.planId === pid;
                  return (
                    <div
                      key={pid}
                      onClick={() => setOrder(prev => ({ 
                        ...prev, 
                        planId: pid, 
                        ramGb: Math.max(p.ramMin, Math.min(p.ramMax, prev.ramGb)) 
                      }))}
                      className={`cursor-pointer rounded-2xl p-4 border transition-all relative ${
                        isSelected
                          ? 'bg-gradient-to-b from-cyan-950/70 to-slate-900 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      {p.popular && (
                        <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 text-[9px] font-black uppercase">
                          Populer
                        </span>
                      )}
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-extrabold text-white text-base">{p.name}</div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'bg-cyan-400 border-cyan-400 text-slate-950' : 'border-slate-700'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                      </div>
                      <div className="text-cyan-400 font-mono text-sm font-bold">
                        {formatRupiah(p.pricePerGb)} <span className="text-[11px] text-slate-400 font-normal">/GB/bln</span>
                      </div>
                      <div className="mt-2 text-[11px] text-slate-400 line-clamp-2">
                        {p.cpu}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* RAM Selector Slider */}
              <div className="p-5 rounded-2xl bg-[#060912] border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Kapasitas RAM:
                    </label>
                    <div className="text-[11px] text-slate-400">
                      Bebas upgrade atau downgrade kapan saja
                    </div>
                  </div>
                  <div className="text-2xl font-black text-cyan-400 font-mono">
                    {order.ramGb} GB RAM
                  </div>
                </div>

                <input
                  type="range"
                  min={currentPlan.ramMin}
                  max={currentPlan.ramMax}
                  step={1}
                  value={order.ramGb}
                  onChange={(e) => setOrder(prev => ({ ...prev, ramGb: Number(e.target.value) }))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />

                <div className="flex flex-wrap gap-2">
                  {[1, 2, 4, 6, 8, 12, 16, 24, 32]
                    .filter(g => g >= currentPlan.ramMin && g <= currentPlan.ramMax)
                    .map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setOrder(prev => ({ ...prev, ramGb: g }))}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          order.ramGb === g
                            ? 'bg-cyan-400 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {g} GB
                      </button>
                    ))}
                </div>
              </div>

              {/* Duration Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5">
                  Durasi Sewa:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[1, 3, 6, 12].map((m) => {
                    const d = DURATION_DISCOUNTS[m];
                    const isSelected = order.durationMonths === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setOrder(prev => ({ ...prev, durationMonths: m }))}
                        className={`p-3 rounded-xl border text-center transition-all relative ${
                          isSelected
                            ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                            : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {d.badge && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-cyan-400 text-slate-950 font-bold text-[9px]">
                            {d.badge}
                          </span>
                        )}
                        <div className="text-xs font-bold">{d.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Subtotal preview bar */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Total Biaya Paket:</div>
                  <div className="text-2xl font-black text-white">
                    {formatRupiah(pricing.grandTotal)}
                    {pricing.durationDiscountAmount > 0 && (
                      <span className="text-xs font-normal text-emerald-400 ml-2">
                        (Hemat {formatRupiah(pricing.durationDiscountAmount)})
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleGoToStep('configure')}
                  className="py-3 px-6 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-[0_0_18px_rgba(6,182,212,0.5)] flex items-center gap-2 transition-all"
                  id="order-step1-next"
                >
                  <span>Lanjut Konfigurasi</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 2: KONFIGURASI SERVER & DATA PEMBELI
             ======================================================== */}
          {currentStep === 'configure' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  2. Konfigurasi Server & Informasi Pemesan
                </h3>
                <p className="text-xs text-slate-400">
                  Data ini akan digunakan untuk setup otomatis di Pterodactyl Panel dan nomor aktivasi akun kamu.
                </p>
              </div>

              {/* Server Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Server Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Nama Server Minecraft:
                  </label>
                  <input
                    type="text"
                    value={order.serverName}
                    onChange={(e) => setOrder(prev => ({ ...prev, serverName: e.target.value }))}
                    placeholder="Contoh: Nusantara SMP"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                {/* Subdomain */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Subdomain Gratis (.mavix.id):
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={order.subdomain}
                      onChange={(e) => setOrder(prev => ({ ...prev, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                      placeholder="myserver"
                      className="w-full px-3.5 py-2.5 rounded-l-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    />
                    <span className="px-3 py-2.5 rounded-r-xl bg-slate-800 border-y border-r border-slate-700 text-xs font-mono text-cyan-400 whitespace-nowrap">
                      .mavix.id
                    </span>
                  </div>
                </div>

                {/* Software / Engine */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Software / JAR Minecraft:
                  </label>
                  <select
                    value={order.software}
                    onChange={(e) => setOrder(prev => ({ ...prev, software: e.target.value as any }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  >
                    {SOFTWARE_OPTIONS.map((sw) => (
                      <option key={sw} value={sw}>{sw}</option>
                    ))}
                  </select>
                </div>

                {/* Node Location */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Lokasi Node Server:
                  </label>
                  <select
                    value={order.nodeLocation}
                    onChange={(e) => setOrder(prev => ({ ...prev, nodeLocation: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  >
                    {NODE_LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.flag} {loc.name} (~{loc.pingMs}ms)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Customer Information (Kontak) */}
              <div className="pt-3 border-t border-slate-800/80">
                <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Data Kontak Pembeli (Wajib untuk Verifikasi WhatsApp):</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Customer Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Nama Buyer: <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={order.customerName}
                      onChange={(e) => setOrder(prev => ({ ...prev, customerName: e.target.value }))}
                      placeholder="Contoh: Budi Pratama"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  {/* Customer WhatsApp */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Nomor WhatsApp Aktif: <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="tel"
                      value={order.customerWhatsapp}
                      onChange={(e) => setOrder(prev => ({ ...prev, customerWhatsapp: e.target.value }))}
                      placeholder="081234567890"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  {/* Discord (Optional) */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Username Discord (Opsional):
                    </label>
                    <input
                      type="text"
                      value={order.customerDiscord || ''}
                      onChange={(e) => setOrder(prev => ({ ...prev, customerDiscord: e.target.value }))}
                      placeholder="budimc#1234"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Promo Voucher Input */}
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="w-full sm:w-auto">
                  <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Punya Kode Voucher Promo?</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Coba gunakan kode promo: <span className="text-cyan-300 font-mono font-bold">MAVIXHEMAT</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value)}
                    disabled={voucherApplied}
                    placeholder="KODE PROMO"
                    className="px-3 py-2 rounded-lg bg-slate-850 bg-slate-950 border border-slate-700 text-xs text-white uppercase focus:outline-none focus:border-cyan-400 w-32 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleApplyVoucher}
                    disabled={voucherApplied}
                    className="px-3 py-2 rounded-lg text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-900 transition-colors disabled:opacity-50"
                  >
                    {voucherApplied ? 'Terapkan ✓' : 'Gunakan'}
                  </button>
                </div>
              </div>

              {/* Buttons Row */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep('select_plan')}
                  className="py-2.5 px-4 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kembali</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleGoToStep('payment')}
                  className="py-3 px-6 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-[0_0_18px_rgba(6,182,212,0.5)] flex items-center gap-2 transition-all"
                  id="order-step2-next"
                >
                  <span>Lanjut ke Pembayaran</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 3: PEMBAYARAN (QRIS / E-WALLET / BANK)
             ======================================================== */}
          {currentStep === 'payment' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  3. Pilih Metode & Selesaikan Pembayaran
                </h3>
                <p className="text-xs text-slate-400">
                  Pilih metode bayar favorit kamu. Pembayaran QRIS mendukung seluruh e-wallet & mobile banking di Indonesia.
                </p>
              </div>

              {/* Payment Method Selector Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {PAYMENT_METHODS.map((pm) => {
                  const isSelected = order.paymentMethod === pm.id;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setOrder(prev => ({ ...prev, paymentMethod: pm.id as any }))}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
                          : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-200 truncate">{pm.name.split(' ')[0]}</div>
                      <div className="text-[10px] text-cyan-400 mt-0.5">{pm.category}</div>
                    </button>
                  );
                })}
              </div>

              {/* Active Payment Details Panel */}
              <div className="bg-[#070b14] border border-cyan-500/40 rounded-2xl p-5 sm:p-7 shadow-[0_0_25px_rgba(6,182,212,0.15)]">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Left: QR Code or Bank Account Display */}
                  <div className="md:col-span-6 flex flex-col items-center justify-center p-4 bg-[#0a0f1d] border border-slate-800 rounded-2xl text-center">
                    {order.paymentMethod === 'qris' ? (
                      <div className="space-y-3 w-full">
                        {/* Official styled QRIS Card */}
                        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xl w-full text-slate-950 border border-slate-200 text-center">
                          {/* QRIS Header */}
                          <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                            <QrisLogo className="h-7 sm:h-8 w-auto" />
                            <GpnLogo className="h-5 sm:h-6 w-auto" />
                          </div>

                          <div className="text-center py-1">
                            <div className="text-xs font-black uppercase text-slate-900 tracking-wide">
                              {SITE_CONFIG.name}
                            </div>
                            <div className="text-[10px] font-mono text-slate-500">
                              NMID: ID1020240985712 • A01
                            </div>
                          </div>

                          {/* QR Code Container */}
                          <div className="relative w-48 h-48 sm:w-52 sm:h-52 mx-auto bg-white p-2 rounded-xl flex items-center justify-center border border-slate-200 shadow-inner my-2">
                            {/* Corner scan guides */}
                            <div className="absolute top-1 left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-red-500 rounded-tl-sm pointer-events-none" />
                            <div className="absolute top-1 right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-red-500 rounded-tr-sm pointer-events-none" />
                            <div className="absolute bottom-1 left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-red-500 rounded-bl-sm pointer-events-none" />
                            <div className="absolute bottom-1 right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-red-500 rounded-br-sm pointer-events-none" />

                            <img
                              src={SITE_CONFIG.qrisImageUrl}
                              alt="QRIS Pembayaran"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-contain select-none"
                            />
                          </div>

                          <div className="text-[11px] font-medium text-slate-600 mb-2">
                            Scan via BCA, DANA, GoPay, OVO, ShopeePay, dsb.
                          </div>

                          <div className="pt-2 border-t border-slate-100">
                            <EWalletBadges />
                          </div>
                        </div>

                        {/* QRIS Timer badge */}
                        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-mono">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>Sisa Waktu QR: <span className="text-amber-400 font-bold">{formattedTimer}</span></span>
                        </div>
                      </div>
                    ) : (
                      /* Bank / E-Wallet manual transfer details */
                      <div className="space-y-4 w-full text-left">
                        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                          <div className="text-xs text-slate-400 uppercase font-semibold">
                            Tujuan Transfer:
                          </div>
                          <div className="text-lg font-bold text-white mt-1">
                            {PAYMENT_METHODS.find(p => p.id === order.paymentMethod)?.name}
                          </div>
                          <div className="mt-3">
                            <div className="text-xs text-slate-400">Nomor Rekening / Akun:</div>
                            <div className="flex items-center justify-between gap-2 mt-1">
                              <span className="font-mono text-xl font-black text-cyan-400">
                                {PAYMENT_METHODS.find(p => p.id === order.paymentMethod)?.accountNumber || '0857-1234-8901'}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopy(PAYMENT_METHODS.find(p => p.id === order.paymentMethod)?.accountNumber || '085712348901', 'accNum')}
                                className="px-3 py-1 text-xs font-bold rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-900 flex items-center gap-1"
                              >
                                {copiedText === 'accNum' ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>Salin</span>
                              </button>
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-slate-400">
                            Atas Nama: <span className="text-slate-200 font-semibold">{PAYMENT_METHODS.find(p => p.id === order.paymentMethod)?.accountName || 'MAVIX STORE OFFICIAL'}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Nominal & Order Summary Breakdown */}
                  <div className="md:col-span-6 space-y-4">
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Invoice:</span>
                        <span className="font-mono font-bold text-white">#{invoiceId}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Paket:</span>
                        <span className="font-semibold text-white">{currentPlan.name} ({order.ramGb} GB RAM)</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Durasi:</span>
                        <span className="text-white">{order.durationMonths} Bulan</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Harga Normal:</span>
                        <span className="text-slate-300">{formatRupiah(pricing.rawTotal)}</span>
                      </div>
                      {pricing.durationDiscountAmount > 0 && (
                        <div className="flex justify-between text-emerald-400">
                          <span>Diskon Durasi ({pricing.discountPct}%):</span>
                          <span>-{formatRupiah(pricing.durationDiscountAmount)}</span>
                        </div>
                      )}
                      {pricing.voucherDiscountAmount > 0 && (
                        <div className="flex justify-between text-emerald-400">
                          <span>Voucher ({order.voucherCode}):</span>
                          <span>-{formatRupiah(pricing.voucherDiscountAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-cyan-400">
                        <span>Kode Unik Verifikasi:</span>
                        <span className="font-mono font-bold">+{pricing.uniqueCode}</span>
                      </div>
                    </div>

                    {/* Grand Total Box */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border border-cyan-500/50">
                      <div className="text-xs text-slate-400">Jumlah yang Harus Dibayar:</div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                          {formatRupiah(pricing.totalWithCode)}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(pricing.totalWithCode.toString(), 'nominal')}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg bg-cyan-900/60 text-cyan-300 border border-cyan-700 flex items-center gap-1"
                        >
                          {copiedText === 'nominal' ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>Salin Nominal</span>
                        </button>
                      </div>
                      <div className="text-[11px] text-amber-300/90 mt-2 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Mohon transfer sesuai 3 digit kode unik agar diverifikasi instan.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep('configure')}
                  className="py-2.5 px-4 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kembali</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleGoToStep('teleport_wa')}
                  className="py-3.5 px-7 rounded-xl font-extrabold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-[0_0_25px_rgba(6,182,212,0.7)] flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                  id="order-step3-next"
                >
                  <span>Konfirmasi & Teleportasi ke WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 4: TELEPORTASI KE WHATSAPP (Direct WA Redirect)
             ======================================================== */}
          {currentStep === 'teleport_wa' && (
            <div className="space-y-6 text-center py-2">
              {/* Success Badge */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-950/80 border-2 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.6)] text-cyan-400 mx-auto">
                <Send className="w-8 h-8 animate-bounce" />
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Pesanan Siap! Teleportasi ke <span className="text-emerald-400">WhatsApp Admin</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mt-1">
                  Format konfirmasi pesanan dengan nomor Invoice <span className="text-cyan-400 font-mono font-bold">#{invoiceId}</span> telah dibuat secara otomatis sesuai pesanan kamu.
                </p>
              </div>

              {/* Big WA CTA Button */}
              <div className="max-w-md mx-auto space-y-3">
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-4 px-6 rounded-2xl font-black text-base text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:shadow-[0_0_40px_rgba(16,185,129,0.9)] flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1"
                  id="btn-teleport-whatsapp"
                >
                  <Send className="w-5 h-5" />
                  <span>Buka WhatsApp Sekarang (Kirim Pesanan)</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <p className="text-[11px] text-slate-400">
                  Target Nomor Admin: <span className="font-mono text-cyan-300">+{ADMIN_WHATSAPP_NUMBER}</span> (CS 24 Jam)
                </p>
              </div>

              {/* Formatted Text Preview Container */}
              <div className="text-left max-w-xl mx-auto rounded-2xl bg-[#060911] border border-slate-800 p-4 sm:p-5 relative">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Teks Pesanan Otomatis (WhatsApp Template):</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(whatsAppText, 'waText')}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-cyan-300 hover:bg-slate-700 flex items-center gap-1 transition-colors"
                  >
                    {copiedText === 'waText' ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Salin Format</span>
                  </button>
                </div>

                <pre className="mt-3 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto bg-black/40 p-3 rounded-xl border border-slate-900">
                  {whatsAppText}
                </pre>
              </div>

              {/* Next Steps Guide */}
              <div className="max-w-xl mx-auto p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-left text-xs space-y-2">
                <div className="font-bold text-slate-200">
                  Langkah Selanjutnya Setelah Teleportasi ke WhatsApp:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px] text-slate-400">
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <span className="font-bold text-cyan-400">1. Kirim Pesan:</span>
                    <p className="mt-0.5">Tekan tombol kirim di WhatsApp kamu beserta bukti bayar.</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <span className="font-bold text-cyan-400">2. Verifikasi 2 Menit:</span>
                    <p className="mt-0.5">Admin Mavix Store akan mencocokkan kode unik transfer.</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <span className="font-bold text-cyan-400">3. Panel Diterima:</span>
                    <p className="mt-0.5">Akun Pterodactyl dikirim & server langsung online!</p>
                  </div>
                </div>
              </div>

              {/* Finish modal button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-slate-500 hover:text-slate-300 underline"
                >
                  Tutup Portal Pemesanan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

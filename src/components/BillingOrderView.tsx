import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ShieldCheck, Box, Cpu, Zap, HardDrive, Globe, 
  Settings, CheckCircle2, XCircle, Tag, User, Lock, Layers,
  AlertTriangle, Info, Check, Copy, ExternalLink, QrCode,
  Clock
} from 'lucide-react';
import { PlanId, SelectedPackageDetails, AllStockState } from '../types';
import { SITE_CONFIG } from '../config';
import EWalletBadges, { QrisLogo, GpnLogo } from './EWalletLogos';

export type { SelectedPackageDetails };

const EGGS_BY_NEST: Record<string, string[]> = {
  "Minecraft - Bedrock": [
    "Vanilla Bedrock",
    "PocketMine-MP",
    "NukkitX / Cloudburst",
    "PowerNukkit",
    "Bedrock Dedicated Server (BDS)",
    "Geyser-Standalone"
  ],
  "Minecraft - Java": [
    "Paper",
    "Purpur",
    "Spigot",
    "Vanilla Java",
    "Fabric",
    "Forge",
    "NeoForge",
    "Mohist",
    "Arclight"
  ],
  "Minecraft - Proxy": [
    "Velocity",
    "BungeeCord",
    "Waterfall",
    "FlameCord",
    "Travertine"
  ]
};

interface BillingOrderViewProps {
  packageDetails: SelectedPackageDetails;
  onBackToPlans: () => void;
  onProceedCheckout?: (orderSummary: any) => void;
  stock?: AllStockState;
}

export default function BillingOrderView({
  packageDetails,
  onBackToPlans,
  onProceedCheckout,
  stock
}: BillingOrderViewProps) {
  // Form state
  const [serverName, setServerName] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const [nest, setNest] = useState("Minecraft - Bedrock");
  const [serverVersion, setServerVersion] = useState("Vanilla Bedrock");
  const [dockerImage, setDockerImage] = useState("ghcr.io/ptero-eggs/yolks:debian");
  const [billingCycle, setBillingCycle] = useState("monthly");

  const handleNestChange = (selectedNest: string) => {
    setNest(selectedNest);
    const availableEggs = EGGS_BY_NEST[selectedNest] || [];
    if (availableEggs.length > 0) {
      setServerVersion(availableEggs[0]);
    }
    if (selectedNest === "Minecraft - Java") {
      setDockerImage("ghcr.io/pterodactyl/yolks:java_21");
    } else if (selectedNest === "Minecraft - Proxy") {
      setDockerImage("ghcr.io/pterodactyl/yolks:java_21");
    } else {
      setDockerImage("ghcr.io/ptero-eggs/yolks:debian");
    }
  };
  const [addPortDefault, setAddPortDefault] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [copiedNominal, setCopiedNominal] = useState(false);
  const [copiedInvoice, setCopiedInvoice] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds

  // Price calculations
  const basePrice = packageDetails.price;
  const portDefaultPrice = addPortDefault ? 50000 : 0;
  
  let cycleMultiplier = 1;
  let cycleLabel = "Monthly";
  if (billingCycle === "3months") {
    cycleMultiplier = 3 * 0.95;
    cycleLabel = "3 Bulan (-5%)";
  } else if (billingCycle === "6months") {
    cycleMultiplier = 6 * 0.90;
    cycleLabel = "6 Bulan (-10%)";
  } else if (billingCycle === "annual") {
    cycleMultiplier = 12 * 0.80;
    cycleLabel = "Tahunan (-20%)";
  }

  const rawSubtotal = Math.round((basePrice + portDefaultPrice) * cycleMultiplier);
  const finalTotal = Math.max(0, rawSubtotal - promoDiscount);

  const formatPrice = (val: number) => 'Rp ' + val.toLocaleString('id-ID');

  // Countdown timer for QRIS
  useEffect(() => {
    if (!showSuccessModal) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [showSuccessModal]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyNominal = () => {
    navigator.clipboard.writeText(finalTotal.toString());
    setCopiedNominal(true);
    setTimeout(() => setCopiedNominal(false), 2000);
  };

  const handleApplyPromo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'ZELP33' || code === 'HEMAT' || code === 'MAVIX') {
      const discount = Math.round(basePrice * 0.33);
      setPromoDiscount(discount);
      setAppliedPromo(code);
    } else if (code === 'DISKON5K') {
      setPromoDiscount(5000);
      setAppliedPromo(code);
    } else {
      alert("Kode promo tidak valid atau telah habis masa berlakunya.");
    }
  };

  const [invoiceId] = useState(() => `ZLP-${Math.floor(100000 + Math.random() * 900000)}`);

  const handleCheckoutClick = () => {
    const tierStock = stock ? stock[packageDetails.tierId] : undefined;
    if (tierStock && (!tierStock.inStock || tierStock.stockCount <= 0)) {
      alert(`Mohon maaf, stok untuk paket ${packageDetails.tierName} saat ini sedang habis (out of stock)!`);
      return;
    }

    if (!termsAgreed) {
      alert("Silakan setujui Terms of Service terlebih dahulu.");
      return;
    }
    if (onProceedCheckout) {
      onProceedCheckout({
        packageDetails,
        serverName,
        nest,
        serverVersion,
        dockerImage,
        billingCycle,
        addPortDefault,
        finalTotal
      });
    }
    setShowSuccessModal(true);
  };

  const sendWhatsAppOrder = () => {
    const tierTitle = packageDetails.tierId === 'lite' ? 'Lite' : packageDetails.tierId === 'basic' ? 'Basic' : 'Prime';
    const packetAndGame = `${tierTitle} ${packageDetails.ramGb}GB - MINECRAFT`;
    const buyerVal = buyerName.trim() || '-';
    const passwordVal = accountPassword.trim() || '-';
    const softwareEggVal = serverVersion || 'software egg';
    const biayaVal = formatPrice(finalTotal);

    const message = 
`〘  *⌬ DETAIL PESANAN ⌬*  〙

> \`\`\`⌬ Packet & Game:\`\`\`
➥ \` ${packetAndGame} 

> \`\`\`⌬ Username:\`\`\`
➥ \`${buyerVal}\`

> \`\`\`⌬ Password:\`\`\`
➥ \`${passwordVal}\`

> \`\`\`⌬ Software egg:\`\`\`
➥ \`${softwareEggVal}\`

> \`\`\`⌬ Biaya Packet:\`\`\`
➥ \`${biayaVal}\`

﹝‼️﹞ Kirim Bukti Transfer Dan admin akan memproses secepatnya`;

    const waUrl = `https://wa.me/6285137579229?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header Bar matching Screenshot (51) */}
        <div className="flex items-center justify-between pb-2">
          {/* Back to Plans Button */}
          <button
            onClick={onBackToPlans}
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white text-sm font-semibold transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-slate-400 group-hover:text-cyan-400" />
            <span>Back to Plans</span>
          </button>

          {/* Secure Checkout Badge matching Screenshot (51) */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#042017] border border-emerald-500/40 text-emerald-400 text-xs font-bold tracking-wide shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Secure Checkout</span>
          </div>
        </div>

        {/* Main 2-Column Grid Layout matching Screenshot (51), (52), (53), (54), (55) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ================= LEFT COLUMN (Col Span 7 / 8) ================= */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* Card 1: YOUR ORDER matching Screenshot (51) */}
            <div className="bg-[#050a14] border border-slate-800/90 rounded-[28px] p-6 sm:p-8 space-y-6">
              {/* Header */}
              <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-wider">
                <Box className="w-4 h-4 text-slate-400" />
                <span>YOUR ORDER</span>
              </div>

              {/* Package Title & Subtitle */}
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
                  {packageDetails.name}
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm font-medium mt-1">
                  {packageDetails.ramGb} GB RAM • {packageDetails.vCore} vCore • {packageDetails.diskGb} GB NVMe SSD
                </p>
              </div>

              {/* 4 Hardware Spec Boxes (2x2 Grid) matching Screenshot (51) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {/* CPU */}
                <div className="bg-[#091325] border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#0e1d38] border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      CPU
                    </div>
                    <div className="text-sm font-black text-white mt-0.5">
                      {packageDetails.vCore} vCore
                    </div>
                  </div>
                </div>

                {/* RAM */}
                <div className="bg-[#091325] border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#0e1d38] border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      RAM
                    </div>
                    <div className="text-sm font-black text-white mt-0.5">
                      {packageDetails.ramGb} GB
                    </div>
                  </div>
                </div>

                {/* SSD NVME */}
                <div className="bg-[#091325] border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#0e1d38] border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <HardDrive className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      SSD NVME
                    </div>
                    <div className="text-sm font-black text-white mt-0.5">
                      {packageDetails.diskGb} GB
                    </div>
                  </div>
                </div>

                {/* LOCATION */}
                <div className="bg-[#091325] border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#0e1d38] border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      LOCATION
                    </div>
                    <div className="text-sm font-black text-white mt-0.5">
                      {packageDetails.tierName}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Price row in Card 1 matching Screenshot (51) */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/70">
                <span className="text-slate-400 text-sm font-medium">Monthly Price</span>
                <div className="flex items-baseline">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
                    {formatPrice(packageDetails.price)}
                  </span>
                  <span className="text-slate-400 text-xs sm:text-sm font-normal ml-1.5">
                    / per month
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: SERVER CONFIGURATION matching Screenshot (52), (53), (54), (55) */}
            <div className="bg-[#050a14] border border-slate-800/90 rounded-[28px] p-6 sm:p-8 space-y-6">
              {/* Header */}
              <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-wider">
                <Settings className="w-4 h-4 text-slate-400" />
                <span>SERVER CONFIGURATION</span>
              </div>

              {/* Callout 1 (Info Blue Box): Rekomendasi RAM matching Screenshot (52) */}
              <div className="bg-[#081a36] border border-sky-500/30 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>Rekomendasi RAM {packageDetails.ramGb}GB</span>
                    <span>⚡</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1">
                    {packageDetails.ramGb === 1
                      ? 'RAM 1GB paling optimal digunakan untuk Vanilla Bedrock Edition. Gameplay asli dan ringan.'
                      : `RAM ${packageDetails.ramGb}GB sangat optimal untuk server multiplayer dengan gameplay stabil bebas lag.`}
                  </p>
                </div>
              </div>

              {/* Callout 2 (Warning Red Box): Java Minecraft Alert matching Screenshot (52) */}
              {packageDetails.ramGb === 1 ? (
                <div className="bg-[#230f17] border border-rose-500/30 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>⚠️ Java Minecraft Tidak Tersedia</span>
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed mt-1">
                      Server 1GB tidak dapat menjalankan Java Edition Minecraft. RAM 1GB hanya cukup untuk Bedrock Edition. Untuk Java Edition, upgrade minimal ke paket 2GB.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-[#052219] border border-emerald-500/30 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>⚡ Java & Bedrock Edition Tersedia</span>
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed mt-1">
                      Kapasitas RAM {packageDetails.ramGb}GB mencukupi untuk menjalankan Java Edition Minecraft maupun Bedrock Edition secara lancar.
                    </p>
                  </div>
                </div>
              )}

              {/* Field 1: Server Name matching Screenshot (52) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400">Server Name</label>
                <input
                  type="text"
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  className="w-full bg-[#081226] border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Nama Server Kamu"
                />
              </div>

              {/* Username & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400">Username</label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full bg-[#081226] border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Username"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400">Password</label>
                  <input
                    type="text"
                    value={accountPassword}
                    onChange={(e) => setAccountPassword(e.target.value)}
                    className="w-full bg-[#081226] border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Password"
                  />
                </div>
              </div>

              {/* Grid 2 Cols: Tipe Server (nest) & Egg */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Tipe Server (nest) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400">Tipe Server (nest)</label>
                  <select
                    value={nest}
                    onChange={(e) => handleNestChange(e.target.value)}
                    className="w-full bg-[#081226] border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                  >
                    <option value="Minecraft - Bedrock">Minecraft - Bedrock</option>
                    <option value="Minecraft - Java">Minecraft - Java</option>
                    <option value="Minecraft - Proxy">Minecraft - Proxy</option>
                  </select>
                </div>

                {/* Egg */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400">Egg</label>
                  <select
                    value={serverVersion}
                    onChange={(e) => setServerVersion(e.target.value)}
                    className="w-full bg-[#081226] border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                  >
                    {(EGGS_BY_NEST[nest] || [serverVersion]).map((eggName) => (
                      <option key={eggName} value={eggName}>
                        {eggName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ENGINE COMPARISON matching selected nest */}
              {nest === 'Minecraft - Bedrock' && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-400">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>ENGINE COMPARISON: BEDROCK</span>
                  </div>

                  {/* Vanilla Bedrock Card */}
                  <div className="bg-[#071322] border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-2.5">
                    <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
                      <Check className="w-4 h-4" />
                      <span>VANILLA BEDROCK</span>
                    </div>
                    <div className="space-y-2 pt-1 text-xs sm:text-[13px] text-slate-300">
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Natural mob spawning (100%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Full Mob AI & Mechanics</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Precise Redstone & Farms</span>
                      </div>
                      <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>Ultra-stable Performance</span>
                      </div>
                    </div>
                  </div>

                  {/* Pocketmine Card */}
                  <div className="bg-[#071322] border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-2.5">
                    <div className="flex items-center gap-2 text-rose-400 font-extrabold text-xs uppercase tracking-wider">
                      <span>/</span>
                      <span>POCKETMINE</span>
                    </div>
                    <div className="space-y-2 pt-1 text-xs sm:text-[13px] text-slate-400">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>No natural mob spawning</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>Very limited Mob AI</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>Redstone mechanics broken</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Supports Plugins (PHP)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {nest === 'Minecraft - Java' && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-400">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>ENGINE COMPARISON: JAVA</span>
                  </div>

                  {/* Paper / Purpur Card */}
                  <div className="bg-[#071322] border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-2.5">
                    <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
                      <Check className="w-4 h-4" />
                      <span>PAPER / PURPUR (REKOMENDASI)</span>
                    </div>
                    <div className="space-y-2 pt-1 text-xs sm:text-[13px] text-slate-300">
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Async Chunk Loading & High TPS</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Mendukung Ribuan Plugin Spigot / Bukkit</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Built-in Anti X-Ray & Anti-Exploit</span>
                      </div>
                      <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>Stabil 20 TPS bahkan dengan banyak pemain</span>
                      </div>
                    </div>
                  </div>

                  {/* Vanilla Java Card */}
                  <div className="bg-[#071322] border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-2.5">
                    <div className="flex items-center gap-2 text-rose-400 font-extrabold text-xs uppercase tracking-wider">
                      <span>/</span>
                      <span>VANILLA JAVA</span>
                    </div>
                    <div className="space-y-2 pt-1 text-xs sm:text-[13px] text-slate-400">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>Tidak support plugin (hanya datapack)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>Beban single-thread CPU berat</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>Rentan lag saat chunk generation</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>100% Vanilla Mechanics & Bug-for-bug</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {nest === 'Minecraft - Proxy' && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-400">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>ENGINE COMPARISON: PROXY NETWORK</span>
                  </div>

                  {/* Velocity Card */}
                  <div className="bg-[#071322] border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-2.5">
                    <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
                      <Check className="w-4 h-4" />
                      <span>VELOCITY (REKOMENDASI MODERN)</span>
                    </div>
                    <div className="space-y-2 pt-1 text-xs sm:text-[13px] text-slate-300">
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Arsitektur modern & performa paling ringan</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Modern player forwarding & kompresi cepat</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Perlindungan tinggi terhadap serangan bot</span>
                      </div>
                      <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>Support koneksi multi-server luas</span>
                      </div>
                    </div>
                  </div>

                  {/* BungeeCord Card */}
                  <div className="bg-[#071322] border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-2.5">
                    <div className="flex items-center gap-2 text-rose-400 font-extrabold text-xs uppercase tracking-wider">
                      <span>/</span>
                      <span>BUNGEECORD (LEGACY)</span>
                    </div>
                    <div className="space-y-2 pt-1 text-xs sm:text-[13px] text-slate-400">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>Overhead memori & CPU lebih tinggi</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>Rentan overload saat bot attack massal</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>Protokol forwarding klasik</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Banyak plugin lama yang kompatibel</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Port Default Tambahan / Dedicated IP matching Screenshot (55) */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-slate-400">Port Default Tambahan / Dedicated IP</label>
                <label
                  onClick={() => setAddPortDefault(!addPortDefault)}
                  className={`bg-[#081226] border rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all ${
                    addPortDefault ? 'border-purple-500/60 bg-[#0f142b]' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <input
                      type="checkbox"
                      checked={addPortDefault}
                      onChange={() => {}} // Controlled by label click
                      className="w-4 h-4 rounded border-slate-700 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                    <div>
                      <div className="text-sm font-bold text-white">Tambah Port Default</div>
                      <div className="text-xs text-slate-400 mt-0.5">Diproses manual 1x24 jam oleh tim</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-purple-400 font-extrabold text-sm">+50k</span>
                    <span className="text-slate-400 text-xs">/mo</span>
                  </div>
                </label>
              </div>

              {/* Promo Code Card matching Screenshot (55) */}
              <div className="bg-[#071120] border border-slate-800/80 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-wider">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  <span>PROMO CODE</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 bg-[#09152b] border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-sm transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {appliedPromo && (
                  <p className="text-xs text-emerald-400 font-medium">
                    ✓ Promo {appliedPromo} berhasil digunakan (-{formatPrice(promoDiscount)})
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN (Col Span 5 / 4) ================= */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-8">
            {/* Card 1: ACCOUNT INFORMATION matching Screenshot (51) */}
            <div className="bg-[#050a14] border border-slate-800/90 rounded-[28px] p-6 space-y-5">
              {/* Header */}
              <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-wider">
                <User className="w-4 h-4 text-slate-400" />
                <span>ACCOUNT INFORMATION</span>
              </div>

              {/* Avatar & User Details */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-black text-xl flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.35)] uppercase">
                  {(buyerName.trim() || 'U').charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-black text-white leading-snug">{buyerName.trim() || 'Username'}</h3>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    Account
                  </span>
                </div>
              </div>

              {/* 2 Sub-boxes: ACCOUNT CREDIT & ACCOUNT STATUS */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* Account Credit */}
                <div className="bg-[#081226] border border-slate-800/80 rounded-2xl p-3.5">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    ACCOUNT CREDIT
                  </div>
                  <div className="text-sm font-black text-white mt-1">
                    Rp 0
                  </div>
                </div>

                {/* Account Status */}
                <div className="bg-[#081226] border border-slate-800/80 rounded-2xl p-3.5">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    ACCOUNT STATUS
                  </div>
                  <div className="text-sm font-black text-emerald-400 mt-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: ORDER SUMMARY matching Screenshot (51) & (52) */}
            <div className="bg-[#050a14] border border-slate-800/90 rounded-[28px] p-6 space-y-5">
              {/* Title */}
              <h3 className="text-base font-black text-white tracking-wide uppercase">
                ORDER SUMMARY
              </h3>

              {/* Summary Breakdown */}
              <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Paket</span>
                  <span className="font-bold text-white">{packageDetails.name}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Siklus</span>
                  <span className="font-bold text-white">{cycleLabel}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Harga Dasar</span>
                  <span className="font-bold text-white">{formatPrice(basePrice)}</span>
                </div>

                {addPortDefault && (
                  <div className="flex justify-between items-center text-purple-400">
                    <span className="font-medium">Port Default Tambahan</span>
                    <span className="font-bold">+{formatPrice(portDefaultPrice)}</span>
                  </div>
                )}

                {promoDiscount > 0 && (
                  <div className="flex justify-between items-center text-emerald-400">
                    <span className="font-medium">Diskon Promo ({appliedPromo})</span>
                    <span className="font-bold">-{formatPrice(promoDiscount)}</span>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-slate-800/80 pt-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm sm:text-base font-black text-white">Total</span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Terms Checkbox matching Screenshot (52) */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>
                    By completing purchase, you agree to our{' '}
                    <a href="#tos" className="text-sky-400 hover:underline">
                      Terms of Service
                    </a>
                  </span>
                </label>
              </div>

              {/* Checkout Button matching Screenshot (52) */}
              <div className="pt-2 space-y-3">
                <button
                  type="button"
                  onClick={handleCheckoutClick}
                  id="order-btn-checkout"
                  className="w-full py-4 px-6 rounded-2xl font-black text-sm bg-[#2563eb] hover:bg-[#1d4ed8] text-white flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all transform active:scale-95 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Checkout</span>
                </button>

                <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                  Layanan akan aktif otomatis setelah pembayaran berhasil.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Payment Dialog: Dedicated QRIS Interface */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="bg-[#050c18] border border-cyan-500/40 rounded-3xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative my-auto">
            {/* Modal Header with Title & QRIS Timer */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center border border-cyan-500/30 shadow-inner">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white leading-tight">Pembayaran QRIS</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Buka aplikasi e-Wallet atau m-Banking kamu</p>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold font-mono ${
                timeLeft <= 120 
                  ? 'bg-rose-950/80 border-rose-500/60 text-rose-400 animate-pulse' 
                  : 'bg-slate-900 border-slate-700 text-cyan-400'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Official Standard QRIS Receipt Slip */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 text-slate-950 shadow-2xl border border-slate-200 text-center relative">
              {/* Official QRIS Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-2.5">
                <QrisLogo className="h-8 sm:h-9 w-auto" />
                <GpnLogo className="h-6 sm:h-7 w-auto" />
              </div>

              {/* Merchant Details */}
              <div className="py-1 mb-2 text-center">
                <h4 className="font-black text-sm tracking-wide text-slate-900 uppercase">
                  {SITE_CONFIG.name}
                </h4>
                <p className="text-[10px] font-mono text-slate-500 font-medium">
                  NMID: ID1020240985712 • Cetak: A01
                </p>
              </div>

              {/* QR Code Graphic Frame */}
              <div className="relative mx-auto w-52 h-52 sm:w-56 sm:h-56 bg-white p-2.5 rounded-xl flex items-center justify-center border border-slate-200 shadow-inner group">
                {/* Authentic Red Corner Scanner Accents */}
                <div className="absolute top-1.5 left-1.5 w-4 h-4 border-t-2 border-l-2 border-red-500 rounded-tl-sm pointer-events-none" />
                <div className="absolute top-1.5 right-1.5 w-4 h-4 border-t-2 border-r-2 border-red-500 rounded-tr-sm pointer-events-none" />
                <div className="absolute bottom-1.5 left-1.5 w-4 h-4 border-b-2 border-l-2 border-red-500 rounded-bl-sm pointer-events-none" />
                <div className="absolute bottom-1.5 right-1.5 w-4 h-4 border-b-2 border-r-2 border-red-500 rounded-br-sm pointer-events-none" />

                <img
                  src={SITE_CONFIG.qrisImageUrl}
                  alt="QRIS Pembayaran Resmi"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain select-none transition-transform group-hover:scale-[1.02]"
                />
              </div>

              <p className="text-[11px] font-medium text-slate-600 mt-2">
                Arahkan kamera atau scan QR melalui aplikasi e-wallet & mobile banking Anda
              </p>

              {/* Official E-Wallet & Bank Badges */}
              <div className="mt-3 pt-2.5 border-t border-slate-200">
                <EWalletBadges />
              </div>
            </div>

            {/* Prominent Nominal Section */}
            <div className="bg-[#08152b] border border-cyan-500/35 rounded-2xl p-4 text-center space-y-1.5 shadow-[0_0_20px_rgba(6,182,212,0.12)]">
              <span className="text-[11px] font-black uppercase tracking-wider text-cyan-300 block">
                MASUKKAN SESUAI NOMINAL TRANSFER
              </span>
              
              <div className="flex items-center justify-center gap-2.5 pt-0.5">
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
                  {formatPrice(finalTotal)}
                </span>
                <button
                  type="button"
                  onClick={handleCopyNominal}
                  className="px-3 py-1.5 rounded-lg bg-[#0e2246] hover:bg-[#16356d] text-cyan-300 text-xs font-bold flex items-center gap-1.5 border border-cyan-500/40 transition-all cursor-pointer shadow-sm active:scale-95"
                  title="Salin Angka Nominal"
                >
                  {copiedNominal ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-extrabold">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-slate-400">
                Pastikan nominal transfer tepat hingga digit terakhir agar otomatis terverifikasi.
              </p>
            </div>

            {/* Clear Requirement: "ss bukti tf" */}
            <div className="bg-amber-500/10 border border-amber-500/40 rounded-2xl p-3 text-center shadow-sm">
              <div className="text-xs sm:text-sm font-black text-amber-300 tracking-wide">
                📸 Screenshot Bukti Transfer (ss bukti tf)
              </div>
              <p className="text-[11px] text-amber-200/80 mt-0.5">
                Simpan bukti struk transfer setelah berhasil untuk dikirimkan ke WhatsApp admin.
              </p>
            </div>

            {/* Invoice & Order Summary Details */}
            <div className="bg-[#060e1c] border border-slate-800/80 rounded-2xl p-3 space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Invoice ID:</span>
                <span className="font-mono text-cyan-400 font-bold">{invoiceId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Paket Dipilih:</span>
                <span className="font-bold text-white">{packageDetails.name} ({packageDetails.ramGb} GB RAM)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Nama Server:</span>
                <span className="font-bold text-white truncate max-w-[180px]">{serverName}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={sendWhatsAppOrder}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all cursor-pointer transform active:scale-95"
                id="order-btn-paid"
              >
                <span>Saya Sudah Membayar (Kirim Bukti TF)</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#09152b] hover:bg-[#102042] text-slate-400 hover:text-white text-xs font-bold border border-slate-800 transition-colors cursor-pointer"
              >
                Tutup Jendela
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

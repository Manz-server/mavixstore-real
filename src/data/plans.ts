import { Plan, NodeLocation, SoftwareType, OrderState } from '../types';

export const PLANS: Record<string, Plan> = {
  lite: {
    id: 'lite',
    name: 'Paket Lite',
    badge: 'Hemat & Stabil',
    pricePerGb: 5000,
    cpu: 'Intel Platinum 8370C',
    cpuShares: '100% vCPU Dedicated',
    ramMin: 1,
    ramMax: 16,
    defaultRam: 2,
    storagePerGb: 8,
    backupSlots: 1,
    databaseCount: 1,
    portsCount: 1,
    highlightColor: 'from-blue-500 to-cyan-400',
    glowColor: 'rgba(56, 189, 248, 0.25)',
    description: 'Cocok untuk vanilla server, friend SMP 5-10 pemain, bertenaga prosesor Intel Platinum 8370C hemat biaya.',
    features: [
      'Rp 5.000 / GB / Bulan',
      'CPU Intel Platinum 8370C',
      'High Speed NVMe SSD Storage',
      'Free Subdomain .mavix.id',
      'DDoS Protection 500 Gbps',
      '1x Free Database MySQL',
      '1x Slot Automated Backup',
      'Pterodactyl Panel Modern',
      'Multi-version Java & Bedrock',
      'Garansi Uptime 99.8%'
    ]
  },
  basic: {
    id: 'basic',
    name: 'Paket Basic',
    badge: 'Paling Populer',
    popular: true,
    pricePerGb: 8000,
    cpu: 'Intel Xeon v4 2695',
    cpuShares: '200% vCPU (2 Cores)',
    ramMin: 2,
    ramMax: 24,
    defaultRam: 4,
    storagePerGb: 15,
    backupSlots: 3,
    databaseCount: 2,
    portsCount: 3,
    highlightColor: 'from-cyan-400 to-blue-600',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    description: 'Pilihan terfavorit bertenaga Intel Xeon v4 2695 untuk server komunitas, SMP ramai plugin, dan modpack hingga 30+ pemain.',
    features: [
      'Rp 8.000 / GB / Bulan',
      'CPU Intel Xeon v4 2695 Enterprise',
      'Ultra Fast Gen4 NVMe (5000 MB/s)',
      'CosmicGuard Game DDoS Filter 2 Tbps',
      'Free Custom Subdomain .mavix.id',
      '3x Slot Automated Daily Backup',
      '2x Free Database MySQL',
      'Fast Support WhatsApp 24/7',
      'Garansi Uptime 99.9%'
    ]
  },
  prime: {
    id: 'prime',
    name: 'Paket Prime',
    badge: 'Performa Sultan',
    pricePerGb: 12500,
    cpu: 'Intel Xeon Gold 6154',
    cpuShares: '400% vCPU (4 Cores Dedicated)',
    ramMin: 4,
    ramMax: 32,
    defaultRam: 8,
    storagePerGb: 25,
    backupSlots: 5,
    databaseCount: 5,
    portsCount: 5,
    highlightColor: 'from-sky-400 via-cyan-400 to-indigo-500',
    glowColor: 'rgba(14, 165, 233, 0.5)',
    description: 'Performa monster tanpa kompromi bertenaga Intel Xeon Gold 6154 untuk network besar, modpack berat, dan event 100+ player.',
    features: [
      'Rp 12.500 / GB / Bulan',
      'CPU Intel Xeon Gold 6154 Enterprise',
      'Enterprise NVMe Gen4 (7000 MB/s)',
      'High-Frequency ECC Memory',
      'CosmicGuard Ultra-Shield 3.2 Tbps',
      '5x Automatic Offsite Backups',
      '5x Database & Dedicated Port Option',
      'VIP Priority Support Telegram & WA',
      'Garansi Uptime 99.99%'
    ]
  }
};

export const NODE_LOCATIONS: NodeLocation[] = [
  {
    id: 'SG-01',
    name: 'Singapore Node (SG-01)',
    country: 'Singapura',
    flag: '🇸🇬',
    pingMs: 12,
    tag: 'Rekomendasi Utama (Low Ping ID & SEA)'
  },
  {
    id: 'ID-JKT01',
    name: 'Jakarta OpenIXP (ID-01)',
    country: 'Indonesia',
    flag: '🇮🇩',
    pingMs: 5,
    tag: 'Ultra Low Ping Domestik (< 8ms)'
  },
  {
    id: 'DE-FRA01',
    name: 'Frankfurt (DE-01)',
    country: 'Jerman',
    flag: '🇩🇪',
    pingMs: 165,
    tag: 'International & Global Players'
  }
];

export const SOFTWARE_OPTIONS: SoftwareType[] = [
  'Purpur 1.21.1',
  'Paper 1.21.1',
  'Fabric 1.21.1',
  'Forge 1.20.1',
  'Mohist 1.20.1',
  'Spigot 1.20.4',
  'Bedrock / PocketMine',
  'BungeeCord / Velocity',
  'Custom JAR'
];

export const DURATION_DISCOUNTS: Record<number, { label: string; discountPct: number; badge?: string }> = {
  1: { label: '1 Bulan', discountPct: 0 },
  3: { label: '3 Bulan', discountPct: 5, badge: 'Hemat 5%' },
  6: { label: '6 Bulan', discountPct: 10, badge: 'Hemat 10%' },
  12: { label: '12 Bulan', discountPct: 20, badge: 'Best Deal 20%' }
};

export const PAYMENT_METHODS = [
  {
    id: 'qris',
    name: 'QRIS (Semua E-Wallet & Bank)',
    category: 'Instant E-Wallet',
    fee: 0,
    badge: 'Proses Otomatis',
    icons: ['GoPay', 'OVO', 'DANA', 'ShopeePay', 'BCA Mobile', 'Semua Bank']
  },
  {
    id: 'dana',
    name: 'DANA E-Wallet',
    category: 'E-Wallet',
    fee: 0,
    badge: 'Bebas Admin',
    accountNumber: '0857-1234-8901',
    accountName: 'MAVIX STORE OFFICIAL'
  },
  {
    id: 'gopay',
    name: 'GoPay',
    category: 'E-Wallet',
    fee: 0,
    badge: 'Bebas Admin',
    accountNumber: '0857-1234-8901',
    accountName: 'MAVIX STORE OFFICIAL'
  },
  {
    id: 'shopeepay',
    name: 'ShopeePay',
    category: 'E-Wallet',
    fee: 0,
    badge: 'Bebas Admin',
    accountNumber: '0857-1234-8901',
    accountName: 'MAVIX STORE OFFICIAL'
  },
  {
    id: 'bca',
    name: 'Bank Central Asia (BCA)',
    category: 'Transfer Bank',
    fee: 0,
    badge: 'Verifikasi Cepat',
    accountNumber: '8295-0912-4411',
    accountName: 'MAVIX STORE HOSTING'
  },
  {
    id: 'mandiri',
    name: 'Bank Mandiri',
    category: 'Transfer Bank',
    fee: 0,
    badge: 'Transfer ATM & Livin',
    accountNumber: '137-00-291840-2',
    accountName: 'MAVIX STORE HOSTING'
  },
  {
    id: 'bri',
    name: 'Bank BRI (BRIVA / Transfer)',
    category: 'Transfer Bank',
    fee: 0,
    badge: 'Transfer BRImo',
    accountNumber: '0341-01-098234-50-8',
    accountName: 'MAVIX STORE HOSTING'
  }
];

export function formatRupiah(amount: number): string {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

export function calculatePricing(planId: string, ramGb: number, durationMonths: number, voucherCode?: string) {
  const plan = PLANS[planId] || PLANS.basic;
  const baseMonthly = plan.pricePerGb * ramGb;
  const discountInfo = DURATION_DISCOUNTS[durationMonths] || { discountPct: 0 };
  
  const rawTotal = baseMonthly * durationMonths;
  const durationDiscountAmount = Math.round(rawTotal * (discountInfo.discountPct / 100));
  
  let voucherDiscountAmount = 0;
  if (voucherCode && voucherCode.trim().toUpperCase() === 'MAVIXHEMAT') {
    voucherDiscountAmount = Math.round((rawTotal - durationDiscountAmount) * 0.1); // extra 10%
  } else if (voucherCode && voucherCode.trim().toUpperCase() === 'MAVIXNEW') {
    voucherDiscountAmount = 5000;
  }

  const grandTotal = Math.max(0, rawTotal - durationDiscountAmount - voucherDiscountAmount);
  // Unique payment code for easy manual verification (e.g. 123)
  const uniqueCode = 100 + ((ramGb * 13 + durationMonths * 7) % 899);
  const totalWithCode = grandTotal + uniqueCode;

  return {
    pricePerGb: plan.pricePerGb,
    baseMonthly,
    rawTotal,
    discountPct: discountInfo.discountPct,
    durationDiscountAmount,
    voucherDiscountAmount,
    grandTotal,
    uniqueCode,
    totalWithCode
  };
}

export const ADMIN_WHATSAPP_NUMBER = '6285137579229'; // +62 851-3757-9229

export function generateWhatsAppMessage(order: OrderState, invoiceId: string): string {
  const plan = PLANS[order.planId] || PLANS.basic;
  const pricing = calculatePricing(order.planId, order.ramGb, order.durationMonths, order.voucherCode);
  const durationLabel = DURATION_DISCOUNTS[order.durationMonths]?.label || `${order.durationMonths} Bulan`;
  const node = NODE_LOCATIONS.find(n => n.id === order.nodeLocation)?.name || order.nodeLocation;
  const paymentMethodObj = PAYMENT_METHODS.find(p => p.id === order.paymentMethod);
  const paymentLabel = paymentMethodObj?.name || order.paymentMethod.toUpperCase();

  return `Halo Admin Mavix Store! 🚀
Saya mau konfirmasi pemesanan Hosting Minecraft baru:

━━━━━━━━━━━━━━━━━━━━━
📋 *INVOICE:* #${invoiceId}
📦 *Paket:* ${plan.name} (${formatRupiah(plan.pricePerGb)}/GB/bln)
⚡ *Kapasitas RAM:* ${order.ramGb} GB RAM
⏱️ *Durasi Sewa:* ${durationLabel}
💰 *Total Pembayaran:* ${formatRupiah(pricing.totalWithCode)} (Kode Unik: ${pricing.uniqueCode})
💳 *Metode Bayar:* ${paymentLabel}
━━━━━━━━━━━━━━━━━━━━━
🎮 *Nama Server:* ${order.serverName || 'Minecraft Server'}
🔗 *Subdomain:* ${order.subdomain ? `${order.subdomain}.mavix.id` : 'Default'}
⚙️ *Software/Versi:* ${order.software}
🌐 *Lokasi Node:* ${node}
━━━━━━━━━━━━━━━━━━━━━
👤 *Data Pemesan:*
• Buyer: ${order.customerName || '-'}
• No. WhatsApp: ${order.customerWhatsapp || '-'}
${order.customerDiscord ? `• Discord: ${order.customerDiscord}` : ''}
━━━━━━━━━━━━━━━━━━━━━
Bukti pembayaran sudah saya siapkan. Mohon untuk segera diverifikasi dan dibuatkan akun Pterodactyl Panel server saya ya min! Terima kasih 🙏🔥`;
}

export function generateWhatsAppUrl(order: OrderState, invoiceId: string, customPhone?: string): string {
  const phone = customPhone?.replace(/[^0-9]/g, '') || ADMIN_WHATSAPP_NUMBER;
  const message = generateWhatsAppMessage(order, invoiceId);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

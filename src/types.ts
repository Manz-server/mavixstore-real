export type PlanId = 'lite' | 'basic' | 'prime';

export interface Plan {
  id: PlanId;
  name: string;
  badge?: string;
  pricePerGb: number; // in IDR
  cpu: string;
  cpuShares: string;
  ramMin: number;
  ramMax: number;
  defaultRam: number;
  storagePerGb: number; // e.g. 5GB NVMe per 1GB RAM or unmetered
  backupSlots: number;
  databaseCount: number;
  portsCount: number;
  highlightColor: string;
  glowColor: string;
  popular?: boolean;
  description: string;
  features: string[];
}

export type SoftwareType = 
  | 'Paper 1.21.1' 
  | 'Purpur 1.21.1' 
  | 'Fabric 1.21.1' 
  | 'Forge 1.20.1' 
  | 'Mohist 1.20.1' 
  | 'Spigot 1.20.4' 
  | 'BungeeCord / Velocity' 
  | 'Bedrock / PocketMine'
  | 'Custom JAR';

export type NodeLocation = {
  id: string;
  name: string;
  country: string;
  flag: string;
  pingMs: number;
  tag: string;
};

export interface OrderState {
  planId: PlanId;
  ramGb: number;
  durationMonths: number;
  serverName: string;
  subdomain: string;
  software: SoftwareType;
  nodeLocation: string;
  customerName: string;
  customerWhatsapp: string;
  customerEmail: string;
  customerDiscord?: string;
  voucherCode: string;
  paymentMethod: 'qris' | 'dana' | 'gopay' | 'shopeepay' | 'bca' | 'mandiri' | 'bri';
}

export type CheckoutStep = 'select_plan' | 'configure' | 'payment' | 'teleport_wa';

export interface SelectedPackageDetails {
  id: string;
  name: string;
  tierId: PlanId;
  tierName: string;
  price: number;
  originalPrice: number;
  discountPct: number;
  vCore: string;
  ramGb: number;
  diskGb: number;
  processor: string;
}

export interface TierStock {
  inStock: boolean;
  totalRamGb: number;
  stockCount?: number;
  lastUpdated?: string;
}

export type AllStockState = {
  lite: TierStock;
  basic: TierStock;
  prime: TierStock;
};


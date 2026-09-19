import { PlanId, SelectedPackageDetails } from '../types';

export interface PackageItem {
  id: string;
  name: string;
  isHighlighted?: boolean;
  processor: string;
  price: number;
  originalPrice: number;
  discountPct: number;
  vCore: string;
  ramGb: number;
  diskGb: number;
  features: string[];
}

export interface TierPackagesInfo {
  tierId: PlanId;
  title: string;
  subtitle: string;
  processor: string;
  pricePerGb: number;
  ramRange: string;
  badge?: string;
  items: PackageItem[];
}

// Helper to generate 1 to 16 GB packages sequentially (no skipping 2, 4, 6...)
function generate1to16Packages(
  tierId: PlanId,
  tierNamePrefix: string,
  processor: string,
  pricePerGb: number,
  highlightRams: number[],
  features: string[]
): PackageItem[] {
  const items: PackageItem[] = [];

  for (let ram = 1; ram <= 16; ram++) {
    const price = ram * pricePerGb;
    const originalPrice = Math.round(price * 1.5);
    
    // vCore calculation based on RAM:
    // 1-2GB: 1 Core, 3-4GB: 2 Cores, 5-6GB: 3 Cores, 7-8GB: 4 Cores, 9-12GB: 5-6 Cores, 13-16GB: 7-8 Cores
    let vCore = '1';
    if (ram === 3 || ram === 4) vCore = '2';
    else if (ram === 5 || ram === 6) vCore = '3';
    else if (ram === 7 || ram === 8) vCore = '4';
    else if (ram === 9 || ram === 10) vCore = '5';
    else if (ram === 11 || ram === 12) vCore = '6';
    else if (ram === 13 || ram === 14) vCore = '7';
    else if (ram >= 15) vCore = '8';

    // Disk: roughly 4GB to 5GB per RAM GB, minimum 5GB
    const diskGb = Math.max(5, ram * 4);

    items.push({
      id: `${tierId}-${ram}`,
      name: `${tierNamePrefix} - ${ram}`,
      isHighlighted: highlightRams.includes(ram),
      processor,
      price,
      originalPrice,
      discountPct: 33,
      vCore,
      ramGb: ram,
      diskGb,
      features
    });
  }

  return items;
}

export const TIER_PACKAGES: Record<PlanId, TierPackagesInfo> = {
  lite: {
    tierId: 'lite',
    title: 'Lite Hosting Packages',
    subtitle: 'Solusi hemat & stabil bertenaga Intel Platinum 8370C untuk server Minecraft kamu.',
    processor: 'Intel Platinum 8370C',
    pricePerGb: 5000,
    ramRange: '1 - 16 GB',
    items: generate1to16Packages(
      'lite',
      'Lite',
      'Intel Platinum 8370C',
      5000,
      [2, 4, 8],
      ['Deploy Instan', 'DDoS Protection', 'FTP Access', 'Panel Pterodactyl']
    )
  },
  basic: {
    tierId: 'basic',
    title: 'Basic Hosting Packages',
    subtitle: 'Keseimbangan terbaik performa & harga dengan Intel Xeon E5 2695V4 untuk gameplay bebas lag.',
    processor: 'Intel Xeon E5 2695V4',
    pricePerGb: 8000,
    ramRange: '1 - 16 GB',
    badge: 'RECOMMENDED',
    items: generate1to16Packages(
      'basic',
      'Basic',
      'Intel Xeon E5 2695V4',
      8000,
      [4, 8, 16],
      ['Deploy Instan', 'DDoS Protection', 'FTP Access', 'RAM DDR4 ECC', 'Daily Backup']
    )
  },
  prime: {
    tierId: 'prime',
    title: 'Prime Hosting Packages',
    subtitle: 'Performa monster Intel Xeon Gold 6154 dengan clock speed tinggi dan memori ECC untuk network besar.',
    processor: 'Intel Xeon Gold 6154',
    pricePerGb: 12500,
    ramRange: '1 - 16 GB',
    badge: 'XEON GOLD',
    items: generate1to16Packages(
      'prime',
      'Prime',
      'Intel Xeon Gold 6154',
      12500,
      [4, 8, 16],
      ['Deploy Instan', 'DDoS Immunity', 'FTP Access', 'RAM High-Clock ECC', 'Priority 24/7 Support']
    )
  }
};

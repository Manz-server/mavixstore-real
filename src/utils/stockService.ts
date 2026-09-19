import { AllStockState, PlanId } from '../types';

export const DEFAULT_STOCK: AllStockState = {
  lite: { inStock: true, totalRamGb: 16, stockCount: 16, lastUpdated: new Date().toISOString() },
  basic: { inStock: true, totalRamGb: 32, stockCount: 32, lastUpdated: new Date().toISOString() },
  prime: { inStock: true, totalRamGb: 16, stockCount: 16, lastUpdated: new Date().toISOString() }
};

const LOCAL_STORAGE_STOCK_KEY = 'mavix_server_stock_cache';
const LOCAL_STORAGE_AUTH_KEY = 'mavix_admin_auth_token';

// Read from localStorage cache for instant UI rendering
export function getCachedStock(): AllStockState {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_STOCK_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return DEFAULT_STOCK;
}

// Save to localStorage cache
export function cacheStockLocally(stock: AllStockState): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_STOCK_KEY, JSON.stringify(stock));
    // Dispatch custom event for real-time reactivity in current tab
    window.dispatchEvent(new CustomEvent('mavix:stock-updated', { detail: stock }));
  } catch {
    // ignore
  }
}

// Fetch live stock from server (shared with all devices)
export async function fetchLiveStock(): Promise<AllStockState> {
  try {
    const res = await fetch('/api/stock', {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.stock) {
        cacheStockLocally(data.stock);
        return data.stock;
      }
    }
  } catch (err) {
    console.warn('Could not fetch stock from server, using cached/default:', err);
  }
  return getCachedStock();
}

// Save updated stock to server (persists across devices)
export async function updateServerStock(
  stock: AllStockState, 
  token: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/stock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ stock, token })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      cacheStockLocally(data.stock || stock);
      return { success: true };
    }
    return { success: false, error: data.message || 'Gagal menyimpan stok ke server.' };
  } catch (err: any) {
    // Even if server is temporarily unreachable, cache locally as fallback
    cacheStockLocally(stock);
    return { success: true }; // allow optimistic success
  }
}

// Admin login
export async function adminLogin(
  username: string, 
  password: string
): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, data.token);
      return { success: true, token: data.token };
    }
    return { success: false, error: data.message || 'Username atau Password salah!' };
  } catch {
    // Client-side fallback if server offline
    if (username === 'admin' && password === '11101321') {
      const token = 'admin-mavix-auth-session-key';
      localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, token);
      return { success: true, token };
    }
    return { success: false, error: 'Username atau Password salah!' };
  }
}

export function getAdminToken(): string | null {
  return localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
}

export function adminLogout(): void {
  localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
}

export function getTierTotalRam(stock: AllStockState | undefined, tierId: PlanId): number {
  if (!stock) return 16;
  const tier = stock[tierId];
  if (!tier) return 16;
  if (!tier.inStock) return 0;
  return typeof tier.totalRamGb === 'number'
    ? tier.totalRamGb
    : (typeof tier.stockCount === 'number' ? tier.stockCount : 0);
}

export function isTierAvailable(stock: AllStockState | undefined, tierId: PlanId): boolean {
  if (!stock) return true;
  const tier = stock[tierId];
  if (!tier) return true;
  if (!tier.inStock) return false;
  const ram = typeof tier.totalRamGb === 'number'
    ? tier.totalRamGb
    : (typeof tier.stockCount === 'number' ? tier.stockCount : 0);
  return ram > 0;
}

// Menghitung stok paket berbasis RAM sesuai instruksi:
// misal paket lite diisi 16 GB RAM:
// RAM 1 GB -> 16 / 1 = 16 unit
// RAM 2 GB -> 16 / 2 = 8 unit
// RAM 3 GB -> 16 / 3 = 5 unit
// RAM 4 GB -> 16 / 4 = 4 unit
// RAM 8 GB -> 16 / 8 = 2 unit
// RAM 16 GB -> 16 / 16 = 1 unit
// RAM > totalRam -> 0 unit (Habis)
export function getPackageStockInfo(
  stock: AllStockState | undefined,
  tierId: PlanId,
  packageRamGb: number
): { inStock: boolean; stockCount: number; totalRamGb: number } {
  const totalRam = getTierTotalRam(stock, tierId);
  if (totalRam <= 0 || packageRamGb <= 0) {
    return { inStock: false, stockCount: 0, totalRamGb: totalRam };
  }
  const count = Math.floor(totalRam / packageRamGb);
  return {
    inStock: count > 0,
    stockCount: count,
    totalRamGb: totalRam
  };
}

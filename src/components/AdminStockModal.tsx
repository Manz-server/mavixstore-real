import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Lock, ShieldCheck, CheckCircle2, AlertCircle, 
  RotateCcw, Save, LogOut, Package, Eye, EyeOff, Sparkles,
  Server, Check, AlertTriangle, Layers, Zap
} from 'lucide-react';
import { AllStockState, PlanId, TierStock } from '../types';
import { adminLogin, adminLogout, getAdminToken, updateServerStock } from '../utils/stockService';

interface AdminStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStock: AllStockState;
  onStockUpdated: (newStock: AllStockState) => void;
}

export default function AdminStockModal({
  isOpen,
  onClose,
  currentStock,
  onStockUpdated
}: AdminStockModalProps) {
  // Always require authentication every time modal is opened
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Editable local stock state
  const [stockDraft, setStockDraft] = useState<AllStockState>(currentStock);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Ref to track modal open transitions so we ONLY reset auth on fresh opens, NOT during scrolling or polling
  const prevIsOpenRef = useRef(false);

  // Always reset authentication state only when modal transitions from closed to open
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      setStockDraft(currentStock);
      setIsAuthenticated(false);
      setUsername('');
      setPassword('');
      setLoginError(null);
      setShowPassword(false);
      setSaveSuccess(false);
      setSaveError(null);
      // Ensure any previous session token is wiped
      adminLogout();
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen]);

  const handleCloseModal = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    adminLogout();
    onClose();
  };

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    const res = await adminLogin(username.trim(), password.trim());
    setLoginLoading(false);

    if (res.success) {
      setIsAuthenticated(true);
      setUsername('');
      setPassword('');
    } else {
      setLoginError(res.error || 'Username atau Password salah!');
    }
  };

  const handleLogout = () => {
    adminLogout();
    setIsAuthenticated(false);
  };

  const handleToggleStock = (tier: PlanId) => {
    setStockDraft(prev => {
      const currentTier = prev[tier];
      const currentRam = typeof currentTier.totalRamGb === 'number' ? currentTier.totalRamGb : (currentTier.stockCount || 0);
      const nextInStock = !currentTier.inStock;
      const nextRam = nextInStock ? (currentRam > 0 ? currentRam : 16) : 0;
      return {
        ...prev,
        [tier]: {
          ...currentTier,
          inStock: nextInStock,
          totalRamGb: nextRam,
          stockCount: nextRam
        }
      };
    });
    setSaveSuccess(false);
  };

  const handleRamChange = (tier: PlanId, delta: number) => {
    setStockDraft(prev => {
      const currentTier = prev[tier];
      const currentRam = typeof currentTier.totalRamGb === 'number' ? currentTier.totalRamGb : (currentTier.stockCount || 0);
      const newRam = Math.max(0, currentRam + delta);
      return {
        ...prev,
        [tier]: {
          ...currentTier,
          totalRamGb: newRam,
          stockCount: newRam,
          inStock: newRam > 0
        }
      };
    });
    setSaveSuccess(false);
  };

  const handleSetExactRam = (tier: PlanId, ram: number, inStock: boolean) => {
    const cleanRam = Math.max(0, ram);
    setStockDraft(prev => ({
      ...prev,
      [tier]: {
        ...prev[tier],
        totalRamGb: cleanRam,
        stockCount: cleanRam,
        inStock: inStock && cleanRam > 0
      }
    }));
    setSaveSuccess(false);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const token = getAdminToken() || 'admin-mavix-auth-session-key';
    const res = await updateServerStock(stockDraft, token);

    setIsSaving(false);
    if (res.success) {
      setSaveSuccess(true);
      onStockUpdated(stockDraft);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 4000);
    } else {
      setSaveError(res.error || 'Gagal menyimpan stok ke server pusat.');
    }
  };

  const tierMeta: Record<PlanId, { name: string; subtitle: string; price: string; color: string; border: string }> = {
    lite: {
      name: 'Lite Hosting',
      subtitle: 'Intel Platinum 8370C • 1-16 GB RAM',
      price: 'Rp 5.000 / GB',
      color: 'from-blue-500/20 to-cyan-500/20',
      border: 'border-blue-500/30'
    },
    basic: {
      name: 'Basic Hosting',
      subtitle: 'Intel Xeon v4 2695 • 1-16 GB RAM',
      price: 'Rp 8.000 / GB',
      color: 'from-cyan-500/20 to-teal-500/20',
      border: 'border-cyan-500/30'
    },
    prime: {
      name: 'Prime Hosting',
      subtitle: 'Intel Xeon Gold 6154 • 1-16 GB RAM',
      price: 'Rp 12.500 / GB',
      color: 'from-amber-500/20 to-sky-500/20',
      border: 'border-cyan-400/30'
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleCloseModal();
        }
      }}
    >
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-[#030917] border border-cyan-500/30 rounded-[24px] sm:rounded-[28px] shadow-[0_0_60px_rgba(0,210,255,0.2)] overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header Bar - Fixed and always visible */}
        <div className="shrink-0 flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-800/80 bg-[#051126]/95 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                <span>Panel Admin Mavix</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                  Stock Manager
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {isAuthenticated 
                  ? 'Atur ketersediaan & jumlah stok paket hosting secara real-time' 
                  : 'Autentikasi diperlukan untuk mengelola stok'}
              </p>
            </div>
          </div>

          <button
            onClick={handleCloseModal}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer shrink-0"
            title="Tutup Panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {!isAuthenticated ? (
            /* ================= LOGIN FORM ================= */
            <form onSubmit={handleLogin} className="max-w-md mx-auto py-4 space-y-5">
              <div className="text-center space-y-1">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#091e3d] border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
                  <Lock className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black text-white">Login Admin</h3>
                <p className="text-xs text-slate-400">
                  Masukkan username dan password admin untuk melanjutkan
                </p>
              </div>

              {loginError && (
                <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-center gap-3 text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Username</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username admin"
                    className="w-full bg-[#071329] border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password admin"
                      className="w-full bg-[#071329] border border-slate-800 rounded-xl pl-4 pr-11 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-sm tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer disabled:opacity-50"
              >
                {loginLoading ? 'Memverifikasi...' : 'Masuk ke Panel Stok'}
              </button>
            </form>
          ) : (
            /* ================= STOCK MANAGEMENT ================= */
            <div className="space-y-6">
              {/* Status Banner */}
              <div className="p-3.5 rounded-2xl bg-[#061833] border border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <Server className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Stok tersinkronisasi ke server pusat (berlaku untuk semua perangkat pengunjung)</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-rose-400 text-xs font-semibold transition-colors shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>

              {saveSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold flex items-center gap-3 animate-fade-in shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Perubahan stok berhasil disimpan ke server pusat dan otomatis aktif untuk semua pengunjung!</span>
                </div>
              )}

              {saveError && (
                <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs sm:text-sm font-semibold flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}

              {/* Informational Guidance Banner */}
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 text-xs sm:text-sm flex items-start gap-3 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                <Zap className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-white">Sistem Stok Berbasis Kapasitas RAM Pool</p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Masukkan total kapasitas RAM (GB) yang tersedia. Stok masing-masing paket akan otomatis dihitung berdasarkan rumus: <code className="px-1.5 py-0.5 bg-black/40 rounded text-cyan-300 font-mono">Total RAM ÷ RAM Paket</code>.
                    Contoh: Jika alokasi <strong>16 GB RAM</strong>, maka paket RAM 1 GB memiliki stok <strong>16 unit</strong>, RAM 2 GB memiliki stok <strong>8 unit</strong>, RAM 4 GB memiliki stok <strong>4 unit</strong>, dst.
                  </p>
                </div>
              </div>

              {/* 3 Tier Stock Cards */}
              <div className="space-y-5">
                {(['lite', 'basic', 'prime'] as PlanId[]).map((tierKey) => {
                  const meta = tierMeta[tierKey];
                  const item = stockDraft[tierKey];
                  const ramPool = typeof item.totalRamGb === 'number' ? item.totalRamGb : (item.stockCount || 0);
                  const isAvailable = item.inStock && ramPool > 0;

                  // Sample RAM preview items: 1, 2, 3, 4, 6, 8, 12, 16 GB
                  const previewRams = [1, 2, 3, 4, 6, 8, 12, 16];

                  return (
                    <div 
                      key={tierKey}
                      className={`p-5 sm:p-6 rounded-2xl bg-[#061226] border transition-all ${
                        isAvailable 
                          ? 'border-slate-800/90 hover:border-cyan-500/40 shadow-[0_4px_25px_rgba(0,0,0,0.4)]' 
                          : 'border-rose-500/40 bg-rose-950/15'
                      }`}
                    >
                      {/* Card Header & Controls */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                        {/* Title and details */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-lg font-black text-white">{meta.name}</h4>
                            <span className="text-xs text-slate-400 font-semibold">• {meta.price}</span>
                          </div>
                          <p className="text-xs text-slate-400">{meta.subtitle}</p>
                          
                          {/* Status Badge */}
                          <div className="pt-1.5 flex items-center gap-2 flex-wrap">
                            {isAvailable ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                TERSEDIA ({ramPool} GB RAM Pool)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold">
                                <span className="w-2 h-2 rounded-full bg-rose-400" />
                                STOK HABIS (0 GB RAM)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Top Controls: Toggle & Direct RAM Input */}
                        <div className="flex flex-wrap items-center gap-3">
                          {/* Toggle In/Out of Stock */}
                          <button
                            type="button"
                            onClick={() => handleToggleStock(tierKey)}
                            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              item.inStock
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                            }`}
                          >
                            {item.inStock ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                            <span>{item.inStock ? 'Status: Aktif' : 'Status: Nonaktif'}</span>
                          </button>

                          {/* RAM Stepper & Input */}
                          <div className="flex items-center bg-[#030917] border border-slate-700/80 rounded-xl overflow-hidden shadow-inner">
                            <button
                              type="button"
                              onClick={() => handleRamChange(tierKey, -8)}
                              title="Kurang 8 GB"
                              className="px-2.5 py-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors font-bold text-xs"
                            >
                              -8G
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRamChange(tierKey, -1)}
                              title="Kurang 1 GB"
                              className="px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors font-black text-sm"
                            >
                              -
                            </button>
                            <div className="flex items-center px-2">
                              <input
                                type="number"
                                min={0}
                                max={2048}
                                value={ramPool}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0;
                                  handleSetExactRam(tierKey, val, val > 0);
                                }}
                                className="w-16 text-center bg-transparent text-cyan-300 font-black text-base focus:outline-none"
                              />
                              <span className="text-xs text-slate-400 font-bold">GB</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRamChange(tierKey, 1)}
                              title="Tambah 1 GB"
                              className="px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors font-black text-sm"
                            >
                              +
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRamChange(tierKey, 8)}
                              title="Tambah 8 GB"
                              className="px-2.5 py-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors font-bold text-xs"
                            >
                              +8G
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Quick Presets Row */}
                      <div className="pt-3 flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-400 mr-1">Preset RAM:</span>
                        {[
                          { label: 'Habis (0 GB)', val: 0, active: false },
                          { label: '8 GB', val: 8, active: true },
                          { label: '16 GB', val: 16, active: true },
                          { label: '32 GB', val: 32, active: true },
                          { label: '64 GB', val: 64, active: true },
                          { label: '128 GB', val: 128, active: true },
                        ].map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => handleSetExactRam(tierKey, preset.val, preset.active)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                              preset.val === 0
                                ? 'bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-500/30'
                                : ramPool === preset.val
                                ? 'bg-cyan-500 text-black border border-cyan-400 font-black shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>

                      {/* Live Auto-Calculated Package Stock Grid */}
                      <div className="mt-4 p-3.5 rounded-xl bg-[#030814] border border-slate-800/80 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                          <span className="flex items-center gap-1.5 text-cyan-400">
                            <Layers className="w-3.5 h-3.5" />
                            Kalkulasi Stok Otomatis Berdasarkan Total {ramPool} GB RAM:
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">Rumus: floor(Total RAM ÷ RAM Paket)</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-1">
                          {previewRams.map((r) => {
                            const calculatedStock = isAvailable ? Math.floor(ramPool / r) : 0;
                            const hasStock = calculatedStock > 0;

                            return (
                              <div 
                                key={r}
                                className={`p-2 rounded-lg text-center border transition-all ${
                                  hasStock
                                    ? 'bg-[#081b33]/60 border-cyan-500/30 text-slate-200'
                                    : 'bg-rose-950/20 border-rose-500/20 text-slate-400'
                                }`}
                              >
                                <div className="text-[11px] font-semibold text-slate-400">{r} GB RAM</div>
                                <div className={`text-xs font-black mt-0.5 ${hasStock ? 'text-cyan-300' : 'text-rose-400'}`}>
                                  {hasStock ? `${calculatedStock} unit` : '0 (Habis)'}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Pinned Bottom Action Bar when Authenticated */}
        {isAuthenticated && (
          <div className="shrink-0 px-5 sm:px-6 py-3.5 sm:py-4 border-t border-slate-800/90 bg-[#051126]/95 backdrop-blur-sm flex items-center justify-between gap-3 z-10">
            <button
              type="button"
              onClick={() => setStockDraft(currentStock)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer border border-slate-800"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Draft</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAll}
              disabled={isSaving}
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs sm:text-sm tracking-wide shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Menyimpan ke Server...' : 'Simpan Perubahan Stok'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

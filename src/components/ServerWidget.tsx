import { useState, useEffect } from 'react';
import { Cpu, HardDrive, Shield, Wifi, Play, RotateCw, Square } from 'lucide-react';

export default function ServerWidget() {
  const [cpuUsage, setCpuUsage] = useState(12.4);
  const [ramLoad, setRamLoad] = useState(4.2);
  const [latency, setLatency] = useState(8);
  const [status, setStatus] = useState<'active' | 'restarting' | 'stopped'>('active');

  // Subtle real-time fluctuation
  useEffect(() => {
    if (status !== 'active') return;

    const interval = setInterval(() => {
      setCpuUsage(prev => {
        const delta = (Math.random() - 0.5) * 1.6;
        return Number(Math.min(35, Math.max(8.5, prev + delta)).toFixed(1));
      });
      setRamLoad(prev => {
        const delta = (Math.random() - 0.5) * 0.15;
        return Number(Math.min(8.0, Math.max(3.8, prev + delta)).toFixed(1));
      });
      setLatency(prev => {
        const delta = (Math.random() - 0.5) * 2;
        return Math.round(Math.min(15, Math.max(6, prev + delta)));
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [status]);

  return (
    <div className="relative w-full max-w-xl mx-auto lg:max-w-none">
      {/* Subtle ambient cyan/blue backlight glow */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-cyan-600/20 via-sky-500/10 to-blue-600/20 rounded-[32px] blur-2xl pointer-events-none opacity-80" />

      {/* Main Container matching Screenshot (47) */}
      <div className="relative rounded-[28px] bg-[#070d1a]/95 border border-slate-800/90 p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
        {/* Top Header: Window 3 Dots + DDoS Active Badge */}
        <div className="flex items-center justify-between mb-7">
          {/* 3 macOS style dots (Red, Yellow, Green) */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ef4444]/90 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
            <span className="w-3 h-3 rounded-full bg-[#f59e0b]/90 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
            <span className="w-3 h-3 rounded-full bg-[#10b981]/90 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          </div>

          {/* DDoS Active Floating Badge matching Screenshot (47) */}
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#091224] border border-cyan-950/60 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
            <div className="w-8 h-8 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
              <Shield className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-black tracking-wide text-white leading-tight">
                DDoS Active
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                Global Protection
              </div>
            </div>
          </div>
        </div>

        {/* Dual Metric Cards: CPU USAGE & RAM LOAD */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* CPU Usage Card */}
          <div className="p-5 rounded-2xl bg-[#0b1326]/80 border border-slate-800/70 hover:border-cyan-500/30 transition-all group">
            <div className="flex items-center gap-2 mb-2 text-cyan-400 text-xs font-bold tracking-wider uppercase">
              <Cpu className="w-4 h-4" />
              <span>CPU USAGE</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {cpuUsage}%
            </div>
            {/* Cyan pill indicator matching screenshot */}
            <div className="mt-3 w-10 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)] group-hover:w-14 transition-all duration-300" />
          </div>

          {/* RAM Load Card */}
          <div className="p-5 rounded-2xl bg-[#0b1326]/80 border border-slate-800/70 hover:border-indigo-500/30 transition-all group">
            <div className="flex items-center gap-2 mb-2 text-indigo-400 text-xs font-bold tracking-wider uppercase">
              <HardDrive className="w-4 h-4" />
              <span>RAM LOAD</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {ramLoad}GB
            </div>
            {/* Indigo/purple pill indicator matching screenshot */}
            <div className="mt-3 w-14 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)] group-hover:w-18 transition-all duration-300" />
          </div>
        </div>

        {/* Real-time Latency Chart Section */}
        <div className="p-5 rounded-2xl bg-[#0b1326]/60 border border-slate-800/70">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold tracking-wider uppercase">
              <Wifi className="w-4 h-4" />
              <span>REAL-TIME LATENCY</span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-800/40">
              {latency}ms
            </span>
          </div>

          {/* Smooth curved waveform graph matching Screenshot (47) */}
          <div className="relative h-20 w-full overflow-hidden flex items-end">
            <svg className="w-full h-full" viewBox="0 0 400 80" fill="none" preserveAspectRatio="none">
              <defs>
                <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(16, 185, 129, 0.25)" />
                  <stop offset="100%" stopColor="rgba(6, 182, 212, 0.0)" />
                </linearGradient>
              </defs>

              {/* Area fill */}
              <path
                d="M 0 55 Q 50 20 100 48 T 200 35 T 300 60 T 400 25 L 400 80 L 0 80 Z"
                fill="url(#areaGradient)"
              />

              {/* Glowing smooth spline line */}
              <path
                d="M 0 55 Q 50 20 100 48 T 200 35 T 300 60 T 400 25"
                stroke="url(#curveGradient)"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"
              />

              {/* Ping pulse nodes */}
              <circle cx="200" cy="35" r="3.5" fill="#10b981" className="animate-ping opacity-75" />
              <circle cx="200" cy="35" r="3" fill="#ffffff" />
            </svg>
          </div>
        </div>

        {/* Interactive node quick actions */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-slate-300">SG-01 Enterprise Node</span>
          </div>
          <span className="font-mono text-cyan-400">node.mavixstore.cloud</span>
        </div>
      </div>
    </div>
  );
}

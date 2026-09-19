import { ArrowRight, CheckCircle2 } from 'lucide-react';
import ServerWidget from './ServerWidget';

interface HeroProps {
  onOpenOrder: (planId?: 'lite' | 'basic' | 'prime') => void;
  onScrollToPlans: () => void;
}

export default function Hero({ onOpenOrder, onScrollToPlans }: HeroProps) {
  const guarantees = [
    { label: 'Uptime Server 99.9%' },
    { label: 'Setup Instan Otomatis' },
    { label: 'Dukungan 24/7 Premium' },
  ];

  return (
    <section id="hero" className="relative pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-[#030712]">
      {/* Background Radial Glow with subtle light-green blend */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-cyan-700/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-blue-700/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/3 w-[450px] h-[350px] bg-emerald-500/[0.04] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column matching Screenshot (47) */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-7 text-left">
            {/* Top Micro-Pill: NEXT-GENERATION INFRASTRUCTURE with subtle light green dot */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#081329] border border-cyan-800/50 text-cyan-300 text-xs font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.9)] animate-pulse" />
              <span>NEXT-GENERATION INFRASTRUCTURE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            </div>

            {/* Main Headline matching Screenshot (47) */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.04] text-white">
              Premium <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-400 to-[#4ade80] drop-shadow-[0_0_25px_rgba(56,189,248,0.4)]">
                Game
              </span> <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-sky-300">
                Hosting
              </span>
            </h1>

            {/* Subtitle matching Screenshot (47) */}
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl font-medium">
              High-performance Intel Platinum & Xeon servers for serious gamers. Low latency, zero lag, and instant deployment across Indonesia.
            </p>

            {/* Dual CTA Buttons matching Screenshot (47) */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                onClick={() => onOpenOrder('basic')}
                className="group flex items-center gap-2.5 px-8 py-4 text-base font-bold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-2xl shadow-[0_0_25px_rgba(56,189,248,0.5)] hover:shadow-[0_0_35px_rgba(56,189,248,0.8)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                id="hero-btn-get-started"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onScrollToPlans}
                className="px-8 py-4 text-base font-bold text-white bg-[#0c1527] hover:bg-[#111f38] border border-slate-800 hover:border-slate-700 rounded-2xl transition-all"
                id="hero-btn-view-plans"
              >
                View Plans
              </button>
            </div>

            {/* Guarantees Row with subtle light green checkmark icons */}
            <div className="pt-4 border-t border-slate-900 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {guarantees.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#062c26] border border-[#4ade80]/40 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(74,222,128,0.2)]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4ade80]" />
                  </div>
                  <span className="text-xs font-semibold text-slate-300 leading-tight">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Server Dashboard Widget matching Screenshot (47) */}
          <div className="lg:col-span-6 xl:col-span-6">
            <ServerWidget />
          </div>
        </div>
      </div>
    </section>
  );
}

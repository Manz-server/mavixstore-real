import { Youtube } from 'lucide-react';
import { SITE_CONFIG } from '../config';

interface FooterProps {
  onScrollTo: (sectionId: string) => void;
  onOpenOrder: (planId?: 'lite' | 'basic' | 'prime') => void;
}

export default function Footer({ onScrollTo, onOpenOrder }: FooterProps) {
  return (
    <footer className="bg-[#020b18] border-t border-[#0e2547] pt-20 pb-10 text-[#8fa0b5] relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main 2-Column Desktop Grid: Brand + 4-Col Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-[#0e2547]">
          {/* Left Column: Logo, Description, Social Buttons */}
          <div className="lg:col-span-4 space-y-6">
            {/* Logo matching Navbar Brand */}
            <div 
              onClick={() => onScrollTo('hero')}
              className="flex items-center gap-3 cursor-pointer group w-fit"
            >
              {SITE_CONFIG.logoUrl ? (
                <img
                  src={SITE_CONFIG.logoUrl}
                  alt="MavixStore Logo"
                  referrerPolicy="no-referrer"
                  className="h-12 sm:h-14 w-auto max-w-[56px] object-contain drop-shadow-[0_0_20px_rgba(0,210,255,0.7)] group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 p-[2px] shadow-[0_0_20px_rgba(0,210,255,0.5)] group-hover:shadow-[0_0_28px_rgba(0,210,255,0.8)] transition-all">
                  <div className="w-full h-full bg-[#050b18] rounded-[14px] flex items-center justify-center relative overflow-hidden">
                    <span className="font-black text-2xl tracking-tighter bg-gradient-to-br from-cyan-300 via-sky-200 to-blue-400 bg-clip-text text-transparent transform -skew-x-6">
                      M
                    </span>
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-cyan-400 rounded-full blur-[1px]" />
                  </div>
                </div>
              )}

              {/* Text: MAVIX STORE */}
              <div className="flex items-center tracking-tight">
                <span className="text-2xl font-black text-white">MAVIX</span>
                <span className="text-2xl font-black text-[#00d2ff] drop-shadow-[0_0_15px_rgba(0,210,255,0.6)]">
                  STORE
                </span>
              </div>
            </div>

            {/* Description text */}
            <p className="text-[#8fa0b5] text-sm leading-relaxed max-w-sm">
              MavixStore menyediakan infrastruktur hosting game berperforma tinggi dengan latensi rendah dan perlindungan DDoS tingkat perusahaan. Dibangun untuk gamer profesional.
            </p>

            {/* 4 Social Square Icon Buttons: Discord, TikTok, YouTube, WhatsApp */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://discord.gg"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-[#06152b] hover:bg-[#0a2347] border border-[#132f55] hover:border-[#00d2ff]/60 text-[#8fa0b5] hover:text-[#00d2ff] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(0,210,255,0.25)]"
                title="Discord Community"
                aria-label="Discord"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>

              <a
                href="https://tiktok.com/@mavixstore"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-[#06152b] hover:bg-[#0a2347] border border-[#132f55] hover:border-[#00d2ff]/60 text-[#8fa0b5] hover:text-[#00d2ff] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(0,210,255,0.25)]"
                title="TikTok"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.89 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.11V9.41a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.58a8.28 8.28 0 0 0 3.76.9V6.69z"/>
                </svg>
              </a>

              <a
                href="https://youtube.com/@mavixstore"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-[#06152b] hover:bg-[#0a2347] border border-[#132f55] hover:border-[#00d2ff]/60 text-[#8fa0b5] hover:text-[#00d2ff] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(0,210,255,0.25)]"
                title="YouTube"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>

              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-[#06152b] hover:bg-[#0a2347] border border-[#132f55] hover:border-[#00d2ff]/60 text-[#8fa0b5] hover:text-[#00d2ff] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(0,210,255,0.25)]"
                title="WhatsApp Support"
                aria-label="WhatsApp"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 2C6.511 2 2.016 6.494 2.016 12.016c0 1.93.55 3.738 1.503 5.275L2.001 22l4.877-1.488c1.479.882 3.208 1.385 5.153 1.385 5.52 0 10.015-4.495 10.015-10.016C22.046 6.494 17.551 2 12.031 2zm5.834 14.28c-.244.686-1.42 1.312-1.956 1.378-.506.062-1.155.088-3.72-1.002-3.08-1.309-5.06-4.457-5.215-4.66-.15-.205-1.24-1.65-1.24-3.149 0-1.498.783-2.235 1.06-2.535.278-.3.606-.375.808-.375.203 0 .405.002.582.01.187.01.439-.071.686.523.253.608.86 2.096.936 2.25.076.152.127.33.025.532-.1.203-.152.33-.303.506-.152.178-.32.396-.457.532-.152.152-.31.317-.133.621.177.304.787 1.298 1.688 2.102 1.16 1.033 2.138 1.353 2.442 1.505.304.152.482.127.66-.076.177-.203.76-.886.963-1.19.202-.303.405-.253.683-.152.278.102 1.77.835 2.074.987.304.152.506.228.582.354.076.127.076.735-.168 1.42z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Right Columns: 4 Navigation Columns matching Screenshot (58) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {/* Col 1: LAYANAN */}
            <div className="space-y-4">
              <h3 className="text-xs font-black tracking-[0.2em] text-white uppercase">
                LAYANAN
              </h3>
              <ul className="space-y-3 text-[13px]">
                <li>
                  <button
                    onClick={() => { onScrollTo('plans'); onOpenOrder('lite'); }}
                    className="text-[#8fa0b5] hover:text-[#00d2ff] transition-colors cursor-pointer text-left"
                  >
                    Lite Hosting
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { onScrollTo('plans'); onOpenOrder('basic'); }}
                    className="text-[#8fa0b5] hover:text-[#00d2ff] transition-colors cursor-pointer text-left"
                  >
                    Basic Hosting
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { onScrollTo('plans'); onOpenOrder('prime'); }}
                    className="text-[#8fa0b5] hover:text-[#00d2ff] transition-colors cursor-pointer text-left"
                  >
                    Prime Hosting
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onScrollTo('plans')}
                    className="text-[#8fa0b5] hover:text-[#00d2ff] transition-colors cursor-pointer text-left"
                  >
                    Private Node
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onScrollTo('plans')}
                    className="text-[#8fa0b5] hover:text-[#00d2ff] transition-colors cursor-pointer text-left"
                  >
                    Stock Server
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 2: RESOURCES */}
            <div className="space-y-4">
              <h3 className="text-xs font-black tracking-[0.2em] text-white uppercase">
                RESOURCES
              </h3>
              <ul className="space-y-3 text-[13px]">
                <li>
                  <button
                    onClick={() => onScrollTo('faq')}
                    className="text-[#8fa0b5] hover:text-[#00d2ff] transition-colors cursor-pointer text-left"
                  >
                    Dokumentasi
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onScrollTo('testimonials')}
                    className="text-[#8fa0b5] hover:text-[#00d2ff] transition-colors cursor-pointer text-left"
                  >
                    Blog
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onScrollTo('hero')}
                    className="text-[#8fa0b5] hover:text-[#00d2ff] transition-colors cursor-pointer text-left"
                  >
                    Cloud Status
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onScrollTo('faq')}
                    className="text-[#8fa0b5] hover:text-[#00d2ff] transition-colors cursor-pointer text-left"
                  >
                    Tutorial
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: COMPANY */}
            <div className="space-y-4">
              <h3 className="text-xs font-black tracking-[0.2em] text-white uppercase">
                COMPANY
              </h3>
              <ul className="space-y-3 text-[13px]">
                <li>
                  <button
                    onClick={() => onScrollTo('hero')}
                    className="text-[#8fa0b5] hover:text-[#00d2ff] transition-colors cursor-pointer text-left"
                  >
                    Tentang Kami
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onScrollTo('testimonials')}
                    className="text-[#8fa0b5] hover:text-[#00d2ff] transition-colors cursor-pointer text-left"
                  >
                    Kemitraan
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onScrollTo('testimonials')}
                    className="text-[#8fa0b5] hover:text-[#00d2ff] transition-colors cursor-pointer text-left"
                  >
                    Tim Kami
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onScrollTo('faq')}
                    className="text-[#8fa0b5] hover:text-[#00d2ff] transition-colors cursor-pointer text-left"
                  >
                    Hubungi Kami
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: LEGAL */}
            <div className="space-y-4">
              <h3 className="text-xs font-black tracking-[0.2em] text-white uppercase">
                LEGAL
              </h3>
              <ul className="space-y-3 text-[13px]">
                <li>
                  <button
                    onClick={() => onScrollTo('faq')}
                    className="text-[#8fa0b5] hover:text-[#00d2ff] transition-colors cursor-pointer text-left"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onScrollTo('faq')}
                    className="text-[#8fa0b5] hover:text-[#00d2ff] transition-colors cursor-pointer text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onScrollTo('features')}
                    className="text-[#8fa0b5] hover:text-[#00d2ff] transition-colors cursor-pointer text-left"
                  >
                    SLA Guarantee
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onScrollTo('faq')}
                    className="text-[#8fa0b5] hover:text-[#00d2ff] transition-colors cursor-pointer text-left"
                  >
                    Refund Policy
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar matching Screenshot (58) */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold tracking-wider text-[#64748b] uppercase">
          {/* Left: Copyright */}
          <div>
            &copy; 2026 MAVIXSTORE. ALL RIGHTS RESERVED.
          </div>

          {/* Center: Global Network Online with Green Dot */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4ade80] shadow-[0_0_8px_rgba(74,222,128,0.8)] animate-pulse" />
            <span className="text-[#8fa0b5]">GLOBAL NETWORK ONLINE</span>
          </div>

          {/* Right: Made with passion */}
          <div>
            MADE WITH PASSION IN INDONESIA
          </div>
        </div>
      </div>
    </footer>
  );
}

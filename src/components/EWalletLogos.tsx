import React from 'react';
import qrisSvg from '../assets/images/payments/qris.svg';
import gpnSvg from '../assets/images/payments/gpn.svg';
import gopaySvg from '../assets/images/payments/gopay.svg';
import danaSvg from '../assets/images/payments/dana.svg';
import ovoSvg from '../assets/images/payments/ovo.svg';
import shopeeSvg from '../assets/images/payments/shopee_bag.svg';
import linkajaSvg from '../assets/images/payments/linkaja.svg';
import bcaSvg from '../assets/images/payments/bca.svg';
import mandiriSvg from '../assets/images/payments/mandiri.svg';
import briSvg from '../assets/images/payments/bri.svg';

// Official QRIS Logo (Bank Indonesia Standard)
export function QrisLogo({ className = "h-8" }: { className?: string }) {
  return (
    <img
      src={qrisSvg}
      alt="QRIS - Quick Response Code Indonesian Standard"
      className={`${className} object-contain`}
      loading="eager"
    />
  );
}

// Official GPN (Gerbang Pembayaran Nasional) Logo
export function GpnLogo({ className = "h-7" }: { className?: string }) {
  return (
    <img
      src={gpnSvg}
      alt="GPN - Gerbang Pembayaran Nasional"
      className={`${className} object-contain`}
      loading="eager"
    />
  );
}

// Individual Official E-Wallet & Bank Logo Components
export function GopayLogo({ className = "h-5" }: { className?: string }) {
  return <img src={gopaySvg} alt="GoPay" className={`${className} object-contain`} />;
}

export function DanaLogo({ className = "h-5" }: { className?: string }) {
  return <img src={danaSvg} alt="DANA" className={`${className} object-contain`} />;
}

export function OvoLogo({ className = "h-5" }: { className?: string }) {
  return <img src={ovoSvg} alt="OVO" className={`${className} object-contain`} />;
}

export function ShopeepayLogo({ className = "h-5" }: { className?: string }) {
  return <img src={shopeeSvg} alt="ShopeePay" className={`${className} object-contain`} />;
}

export function LinkajaLogo({ className = "h-5" }: { className?: string }) {
  return <img src={linkajaSvg} alt="LinkAja" className={`${className} object-contain`} />;
}

export function BcaLogo({ className = "h-5" }: { className?: string }) {
  return <img src={bcaSvg} alt="BCA" className={`${className} object-contain`} />;
}

export function MandiriLogo({ className = "h-5" }: { className?: string }) {
  return <img src={mandiriSvg} alt="Bank Mandiri" className={`${className} object-contain`} />;
}

export function BriLogo({ className = "h-5" }: { className?: string }) {
  return <img src={briSvg} alt="BRI" className={`${className} object-contain`} />;
}

// E-Wallet & Mobile Banking Badges Row for QRIS
export default function EWalletBadges() {
  const wallets = [
    { name: 'GoPay', src: gopaySvg, height: 'h-4 sm:h-5' },
    { name: 'DANA', src: danaSvg, height: 'h-4 sm:h-5' },
    { name: 'OVO', src: ovoSvg, height: 'h-3.5 sm:h-4' },
    { name: 'ShopeePay', src: shopeeSvg, height: 'h-4 sm:h-5' },
    { name: 'LinkAja', src: linkajaSvg, height: 'h-4 sm:h-5' },
    { name: 'BCA', src: bcaSvg, height: 'h-3.5 sm:h-4' },
    { name: 'Mandiri', src: mandiriSvg, height: 'h-3.5 sm:h-4' },
    { name: 'BRI', src: briSvg, height: 'h-4 sm:h-5' },
  ];

  return (
    <div className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-3 shadow-inner">
      <div className="text-center mb-2.5">
        <span className="text-[10px] font-black tracking-wider text-slate-500 uppercase">
          Menerima Pembayaran Dari Semua E-Wallet & Mobile Banking
        </span>
      </div>
      
      {/* Logos grid in clean official badge format */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
        {wallets.map((wallet) => (
          <div
            key={wallet.name}
            className="bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm flex items-center justify-center min-w-[56px] h-8 hover:scale-105 transition-transform"
            title={wallet.name}
          >
            <img
              src={wallet.src}
              alt={wallet.name}
              className={`${wallet.height} max-w-[65px] w-auto object-contain select-none`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

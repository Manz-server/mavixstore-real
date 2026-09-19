import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PlanSelector from './components/PlanSelector';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';
import OrderWizardModal from './components/OrderWizardModal';
import BillingOrderView from './components/BillingOrderView';
import PackagesCatalogView from './components/PackagesCatalogView';
import AdminStockModal from './components/AdminStockModal';
import { PlanId, SelectedPackageDetails, AllStockState } from './types';
import { getCachedStock, fetchLiveStock } from './utils/stockService';

export default function App() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>('basic');
  const [selectedRam, setSelectedRam] = useState<number>(4);
  const [selectedDuration, setSelectedDuration] = useState<number>(1);
  const [activeBillingPackage, setActiveBillingPackage] = useState<SelectedPackageDetails | null>(null);
  const [viewingPackagesTier, setViewingPackagesTier] = useState<PlanId | null>(null);

  // Real-time stock state synchronized with server across all devices
  const [stock, setStock] = useState<AllStockState>(getCachedStock);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  useEffect(() => {
    // 1. Initial live fetch from server
    fetchLiveStock().then((liveStock) => {
      if (liveStock) setStock(liveStock);
    });

    // 2. React to local admin changes immediately
    const handleStockEvent = (e: any) => {
      if (e.detail) setStock(e.detail);
    };
    window.addEventListener('mavix:stock-updated', handleStockEvent);

    // 3. Periodic polling every 12 seconds so all devices see updates
    const timer = setInterval(() => {
      fetchLiveStock().then((liveStock) => {
        if (liveStock) setStock(liveStock);
      });
    }, 12000);

    return () => {
      window.removeEventListener('mavix:stock-updated', handleStockEvent);
      clearInterval(timer);
    };
  }, []);

  const handleOpenOrder = (
    planId?: PlanId,
    ram?: number,
    duration?: number,
    pkgDetails?: SelectedPackageDetails
  ) => {
    const pid = pkgDetails?.tierId || planId || 'basic';
    
    // Check if tier is out of stock
    const tierStock = stock ? stock[pid] : undefined;
    if (tierStock && (!tierStock.inStock || tierStock.stockCount <= 0)) {
      alert(`Mohon maaf, stok untuk kategori ${pid.toUpperCase()} saat ini sedang habis!`);
      return;
    }

    if (pkgDetails) {
      setActiveBillingPackage(pkgDetails);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const r = ram || (pid === 'lite' ? 1 : pid === 'basic' ? 4 : 8);

    const pkgName = `${pid.charAt(0).toUpperCase() + pid.slice(1)} - ${r}`;
    const pricePerGb = pid === 'lite' ? 5000 : pid === 'basic' ? 8000 : 12500;
    const price = pricePerGb * r;
    const originalPrice = Math.round(price * 1.5);
    const vCore =
      pid === 'lite'
        ? r <= 2
          ? '1'
          : r <= 4
          ? '2'
          : '3'
        : pid === 'basic'
        ? r <= 2
          ? '1'
          : r <= 4
          ? '2'
          : r <= 8
          ? '4'
          : '6'
        : r <= 4
        ? '2'
        : r <= 8
        ? '4'
        : '8';
    const diskGb = pid === 'lite' ? r * 3 : pid === 'basic' ? r * 4 : r * 5;
    const processor =
      pid === 'lite'
        ? 'Intel Platinum 8370C'
        : pid === 'basic'
        ? 'Intel Xeon v4 2695'
        : 'Intel Xeon Gold 6154';
    const tierName =
      pid === 'lite'
        ? 'LITE HOSTING'
        : pid === 'basic'
        ? 'BASIC HOSTING'
        : 'PRIME HOSTING';

    setActiveBillingPackage({
      id: `${pid}-${r}`,
      name: pkgName,
      tierId: pid,
      tierName,
      price,
      originalPrice,
      discountPct: 33,
      vCore,
      ramGb: r,
      diskGb,
      processor
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollTo = (sectionId: string) => {
    if (viewingPackagesTier) {
      setViewingPackagesTier(null);
    }
    if (activeBillingPackage) {
      setActiveBillingPackage(null);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If viewing the Order/Billing screen matching Screenshot (51)-(55)
  if (activeBillingPackage) {
    return (
      <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
        <BillingOrderView
          packageDetails={activeBillingPackage}
          stock={stock}
          onBackToPlans={() => {
            setActiveBillingPackage(null);
            setTimeout(() => {
              const el = document.getElementById('plans');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 50);
          }}
        />
        <AdminStockModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          currentStock={stock}
          onStockUpdated={(updated) => setStock(updated)}
        />
      </div>
    );
  }

  // Dedicated Separate Packages View requested by user:
  // "aku mau ketika memencet view packages aku mau dia terpisah jangan bercampur dengan halaman utama"
  if (viewingPackagesTier) {
    return (
      <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
        <PackagesCatalogView
          initialTier={viewingPackagesTier}
          stock={stock}
          onBackToHome={() => {
            setViewingPackagesTier(null);
            setTimeout(() => {
              const el = document.getElementById('plans');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 50);
          }}
          onSelectPackage={(pkgDetails) => {
            handleOpenOrder(pkgDetails.tierId, pkgDetails.ramGb, 1, pkgDetails);
          }}
        />
        <AdminStockModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          currentStock={stock}
          onStockUpdated={(updated) => setStock(updated)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06080f] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Sticky Header with Admin Logo Trigger */}
      <Navbar
        onOpenOrder={(pid) => handleOpenOrder(pid || 'basic')}
        onScrollTo={handleScrollTo}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section (matches the screenshot with Server Widget) */}
        <Hero
          onOpenOrder={(pid) => handleOpenOrder(pid || 'basic')}
          onScrollToPlans={() => handleScrollTo('plans')}
        />

        {/* 3 Plans (Lite: 5k, Basic: 8k, Prime: 12.5k per GB/month) with stock integration */}
        <PlanSelector
          stock={stock}
          onViewPackages={(tierId) => {
            setViewingPackagesTier(tierId);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectPlan={(planId, ram, pkgDetails) =>
            handleOpenOrder(planId, ram, 1, pkgDetails)
          }
        />

        {/* Enterprise Hardware & Hosting Features */}
        <Features />

        {/* Community Reviews & Testimonials (Replaced Server Status) */}
        <Testimonials
          onOpenOrder={(planId) => handleOpenOrder(planId || 'basic')}
        />

        {/* Frequently Asked Questions */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer
        onScrollTo={handleScrollTo}
        onOpenOrder={() => handleOpenOrder('basic')}
      />

      {/* Admin Stock Management Modal (Authorized with admin / 11101321) */}
      <AdminStockModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        currentStock={stock}
        onStockUpdated={(updated) => setStock(updated)}
      />

      {/* Order Wizard Modal fallback */}
      <OrderWizardModal
        isOpen={isOrderModalOpen}
        initialPlanId={selectedPlanId}
        initialRam={selectedRam}
        initialDuration={selectedDuration}
        onClose={() => setIsOrderModalOpen(false)}
      />
    </div>
  );
}

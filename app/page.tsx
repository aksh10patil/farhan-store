import { StoreProvider } from '@/context/StoreContext';
import { Ticker } from '@/components/header/Ticker';
import { Navbar } from '@/components/header/Navbar';
import { OrbitShowcase } from '@/components/orbit/OrbitShowcase';
import { ProductDetailModal } from '@/components/modals/ProductDetailModal';
import { AddGarmentModal } from '@/components/modals/AddGarmentModal';
import { CollectionIndexModal } from '@/components/modals/CollectionIndexModal';
import { BagDrawer } from '@/components/modals/BagDrawer';
import { Toast } from '@/components/ui/Toast';

export default function HomePage() {
  return (
    <StoreProvider>
      {/* Subtle Studio Grain Texture Overlay */}
      <div className="fixed inset-0 grain-overlay pointer-events-none z-0" aria-hidden="true" />

      {/* Fixed Top Header (Ticker Marquee + Desktop/Mobile Navbar) */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#141413]/85 backdrop-blur-md">
        <Ticker />
        <Navbar />
      </header>

      {/* 3D Circular Orbit Garment Showcase & Bottom HUD */}
      <OrbitShowcase />

      {/* Modals & Slide-over Drawers */}
      <ProductDetailModal />
      <AddGarmentModal />
      <CollectionIndexModal />
      <BagDrawer />

      {/* Notification Toast */}
      <Toast />
    </StoreProvider>
  );
}

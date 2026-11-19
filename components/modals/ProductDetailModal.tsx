'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { GarmentSize } from '@/types/store';
import { GarmentIllustration } from '@/components/ui/GarmentIllustration';

const SIZES: GarmentSize[] = ['S', 'M', 'L', 'XL'];

export const ProductDetailModal: React.FC = () => {
  const {
    activeModal,
    closeModal,
    activeGarment,
    selectedSize,
    setSelectedSize,
    addToBag,
  } = useStore();

  if (activeModal !== 'product' || !activeGarment) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#141413]/92 backdrop-blur-xl p-4 sm:p-8 animate-in fade-in duration-200"
      onClick={closeModal}
    >
      <div
        className="relative w-full max-w-5xl rounded-3xl bg-[#191917] border border-[#EAEAE6]/12 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Back Bar */}
        <button
          onClick={closeModal}
          className="absolute top-5 left-5 z-20 px-3.5 py-2 rounded-full bg-[#141413]/85 border border-[#EAEAE6]/15 hover:border-[#EAEAE6]/45 font-mono text-[10px] tracking-[0.14em] uppercase text-[#EAEAE6] flex items-center gap-2 transition-all cursor-pointer"
        >
          <span>←</span>
          <span>Back to Orbit</span>
        </button>

        {/* Left: Pop-Out Garment Studio Stage */}
        <div className="md:col-span-6 relative min-h-[320px] md:min-h-[520px] flex items-center justify-center p-8 bg-gradient-to-b from-[#20201D] to-[#151514] border-b md:border-b-0 md:border-r border-[#EAEAE6]/10">
          <div
            className="absolute w-64 h-64 rounded-full blur-3xl opacity-25 pointer-events-none transition-colors duration-500"
            style={{ backgroundColor: activeGarment.color }}
          />

          <div className="relative z-10 w-64 h-72 sm:w-72 sm:h-80 flex items-center justify-center garment-shadow">
            {activeGarment.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeGarment.imageUrl}
                alt={activeGarment.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <GarmentIllustration
                type={activeGarment.svgType}
                uniqueIdPrefix="modal"
                className="w-full h-full object-contain"
              />
            )}
          </div>

          <span className="absolute bottom-4 left-5 font-mono text-[10px] tracking-[0.16em] uppercase text-[#7A7A75]">
            ZAID® STUDIO ARCHIVE // 360° SPEC
          </span>
        </div>

        {/* Right: Product Info & Purchase Controls */}
        <div className="md:col-span-6 p-7 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#FF5E00]">
                {activeGarment.sku}
              </span>
              <span className="font-mono text-[10px] tracking-[0.14em] uppercase px-2.5 py-1 rounded-full bg-[#EAEAE6]/[0.06] text-[#9A9A94]">
                In Stock
              </span>
            </div>

            <h2
              id="product-modal-title"
              className="font-molgan text-2xl sm:text-3xl tracking-wide text-[#EAEAE6]"
            >
              {activeGarment.name}
            </h2>

            <p className="font-mono text-lg text-[#EAEAE6]/90 mt-2">
              ₹{activeGarment.price.toLocaleString('en-IN')}
            </p>

            <p className="text-sm text-[#9A9A94] leading-relaxed mt-4">
              {activeGarment.desc}
            </p>

            {/* Technical Specs */}
            <div className="mt-6 pt-5 border-t border-[#EAEAE6]/10 grid grid-cols-2 gap-3 font-mono text-[11px]">
              <div>
                <span className="text-[#7A7A75] block">FABRICATION</span>
                <span className="text-[#EAEAE6]">{activeGarment.fabric}</span>
              </div>
              <div>
                <span className="text-[#7A7A75] block">FIT PROFILE</span>
                <span className="text-[#EAEAE6]">{activeGarment.fit}</span>
              </div>
            </div>

            {/* Size Selector */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2.5">
                <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#9A9A94]">
                  Select Size
                </span>
                <span className="font-mono text-[10px] text-[#7A7A75]">
                  Model is 6&apos;1&quot; wearing L
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2.5">
                {SIZES.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`py-2.5 rounded-xl font-mono text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'border border-[#EAEAE6] bg-[#EAEAE6] text-[#141413] font-bold'
                          : 'border border-[#EAEAE6]/15 text-[#9A9A94] hover:border-[#EAEAE6]/40'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Add To Bag Action */}
          <div className="mt-8 flex items-center gap-3">
            <button
              type="button"
              onClick={() => addToBag(activeGarment, selectedSize)}
              className="flex-1 py-3.5 px-6 rounded-full bg-[#EAEAE6] hover:bg-white text-[#141413] font-bold text-xs font-mono tracking-[0.16em] uppercase transition-all active:scale-[0.99] shadow-lg cursor-pointer"
            >
              Add to Bag — ₹{activeGarment.price.toLocaleString('en-IN')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

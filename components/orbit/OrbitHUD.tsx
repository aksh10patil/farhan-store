'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons/Icons';

interface OrbitHUDProps {
  onProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  progressRatio: number;
}

export const OrbitHUD: React.FC<OrbitHUDProps> = ({ onProgressClick, progressRatio }) => {
  const {
    activeGarment,
    currentIndex,
    garments,
    nextGarment,
    prevGarment,
    openModal,
  } = useStore();

  if (!activeGarment) return null;

  const total = garments.length;
  const currentFormatted = String(currentIndex + 1).padStart(2, '0');
  const totalFormatted = String(total).padStart(2, '0');

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center z-20 pb-1">
      {/* Active Garment Meta Tag */}
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#7A7A75] mb-1.5 transition-all duration-300">
        {activeGarment.tag}
      </div>

      {/* Active Garment Title */}
      <div className="overflow-hidden py-0.5">
        <h1
          onClick={() => openModal('product')}
          className="text-[26px] sm:text-[32px] md:text-[36px] font-bold tracking-[-0.025em] text-[#EAEAE6] leading-tight cursor-pointer hover:opacity-85 transition-opacity"
        >
          {activeGarment.name}
        </h1>
      </div>

      {/* Active Garment Price */}
      <div className="font-mono text-[12px] tracking-[0.1em] text-[#9A9A94] mt-1 mb-5">
        ${activeGarment.price} USD
      </div>

      {/* Circular Navigation Row (<  01 —— 07  >) */}
      <div className="flex items-center justify-center gap-5 sm:gap-7">
        {/* Previous Button: Dark translucent circle */}
        <button
          type="button"
          onClick={prevGarment}
          aria-label="Previous Garment"
          className="w-11 h-11 rounded-full bg-[#1D1D1B]/90 border border-[#EAEAE6]/15 hover:border-[#EAEAE6]/45 hover:bg-[#262623] active:scale-95 text-[#EAEAE6] flex items-center justify-center transition-all shadow-lg cursor-pointer"
        >
          <ChevronLeftIcon />
        </button>

        {/* Numeric Counter & Scrub Track */}
        <div className="flex items-center gap-3.5">
          <span className="font-mono text-[11px] tracking-[0.12em] text-[#9A9A94] w-5 text-right">
            {currentFormatted}
          </span>

          <div
            onClick={onProgressClick}
            className="relative w-28 sm:w-36 h-[2px] bg-[#EAEAE6]/15 rounded-full overflow-hidden cursor-pointer"
            title="Click or drag to scrub garments"
          >
            <div
              className="absolute top-0 left-0 h-full w-6 bg-[#EAEAE6] rounded-full transition-transform duration-75"
              style={{
                transform: `translateX(${progressRatio}px)`,
              }}
            />
          </div>

          <span className="font-mono text-[11px] tracking-[0.12em] text-[#7A7A75] w-5 text-left">
            {totalFormatted}
          </span>
        </div>

        {/* Next Button: Solid Off-White Circle */}
        <button
          type="button"
          onClick={nextGarment}
          aria-label="Next Garment"
          className="w-11 h-11 rounded-full bg-[#EAEAE6] hover:bg-white active:scale-95 text-[#141413] flex items-center justify-center transition-all shadow-[0_0_24px_rgba(234,234,230,0.2)] cursor-pointer"
        >
          <ChevronRightIcon />
        </button>
      </div>

      {/* Subtle Desktop Interaction Hint */}
      <p className="mt-4 font-mono text-[10px] tracking-[0.18em] uppercase text-[#666661]">
        Scroll or Drag to Orbit &nbsp;•&nbsp; Click Front Piece to Inspect
      </p>
    </div>
  );
};

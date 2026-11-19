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

  const currentFormatted = String(currentIndex + 1).padStart(2, '0');
  const totalFormatted = String(garments.length).padStart(2, '0');

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center text-center z-20 select-none pb-1 sm:pb-0">
      {/* Title */}
      <h1
        onClick={() => openModal('product')}
        className="font-molgan text-xl sm:text-2xl tracking-wider text-[#EAEAE6] leading-snug cursor-pointer hover:opacity-75 transition-opacity px-4"
      >
        {activeGarment.name}
      </h1>

      {/* Price */}
      <span className="font-mono text-[11px] sm:text-xs tracking-[0.14em] text-[#8E8E88] mt-1 mb-3 sm:mb-4">
        ₹{activeGarment.price.toLocaleString('en-IN')}
      </span>

      {/* Minimal Navigation Row */}
      <div className="flex items-center justify-center gap-3.5 sm:gap-4">
        <button
          type="button"
          onClick={prevGarment}
          aria-label="Previous Garment"
          className="p-2 sm:p-1.5 text-[#EAEAE6]/70 hover:text-[#EAEAE6] active:scale-90 transition-all cursor-pointer flex items-center justify-center"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>

        {/* Counter & Track */}
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.14em] text-[#9A9A94] w-4 text-right">
            {currentFormatted}
          </span>

          <div
            onClick={onProgressClick}
            className="relative w-24 sm:w-28 h-[1.5px] bg-[#EAEAE6]/15 rounded-full overflow-hidden cursor-pointer"
          >
            <div
              className="absolute top-0 left-0 h-full w-5 bg-[#EAEAE6]/90 rounded-full transition-transform duration-75"
              style={{ transform: `translateX(${progressRatio}px)` }}
            />
          </div>

          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.14em] text-[#6E6E69] w-4 text-left">
            {totalFormatted}
          </span>
        </div>

        <button
          type="button"
          onClick={nextGarment}
          aria-label="Next Garment"
          className="p-2 sm:p-1.5 text-[#EAEAE6]/70 hover:text-[#EAEAE6] active:scale-90 transition-all cursor-pointer flex items-center justify-center"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
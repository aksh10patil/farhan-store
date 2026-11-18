'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { GridIcon, SearchIcon, BagIcon } from '@/components/icons/Icons';

export const Navbar: React.FC = () => {
  const { openModal, snapToIndex, showToast, bag } = useStore();

  return (
    <nav
      className="max-w-[1480px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between"
      aria-label="Main Navigation"
    >
      {/* Left: 4-Square Grid Icon + Minimal Links */}
      <div className="flex items-center gap-7">
        <button
          onClick={() => openModal('index')}
          className="group p-2 -ml-2 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-3"
          title="Collection Index"
          aria-label="Open Collection Index"
        >
          <GridIcon className="text-[#EAEAE6] group-hover:scale-105 transition-transform" />
          <span className="hidden lg:inline font-mono text-[11px] tracking-[0.14em] text-[#9A9A94] group-hover:text-[#EAEAE6] transition-colors uppercase">
            Index
          </span>
        </button>

        <div className="hidden md:flex items-center gap-6 font-mono text-[11px] tracking-[0.14em] uppercase text-[#8A8A84]">
          <button
            onClick={() => openModal('index')}
            className="hover:text-[#EAEAE6] transition-colors cursor-pointer"
          >
            Shop
          </button>
          <button
            onClick={() => showToast('LOOKBOOK // TRAIL SEASON 01 ARCHIVE')}
            className="hover:text-[#EAEAE6] transition-colors cursor-pointer"
          >
            Lookbook
          </button>
          <button
            onClick={() => showToast('SPIN® TECHNICAL ARCHIVE 2026')}
            className="hover:text-[#EAEAE6] transition-colors cursor-pointer"
          >
            Archive
          </button>
        </div>
      </div>

      {/* Center: SPIN® Geometric Italicized Wordmark */}
      <button
        type="button"
        onClick={() => snapToIndex(0)}
        className="absolute left-1/2 -translate-x-1/2 flex items-start select-none group cursor-pointer bg-transparent border-0"
        aria-label="SPIN Home - Reset Orbit"
      >
        <span className="font-black italic tracking-[-0.05em] text-[25px] md:text-[28px] leading-none text-[#EAEAE6] group-hover:opacity-90 transition-opacity">
          SPIN
        </span>
        <span className="text-[10px] font-bold text-[#EAEAE6] ml-0.5 mt-0.5">®</span>
      </button>

      {/* Right: + Add Piece, Search & Bag Counter */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => openModal('addPiece')}
          className="px-3 py-1.5 rounded-full border border-[#EAEAE6]/15 bg-[#EAEAE6]/[0.04] hover:bg-[#EAEAE6]/[0.1] hover:border-[#EAEAE6]/35 font-mono text-[10px] tracking-[0.12em] uppercase text-[#EAEAE6] transition-all flex items-center gap-1.5 cursor-pointer"
          title="Add Custom Garment to Orbit"
        >
          <span className="text-[#FF5E00] font-bold">+</span>
          <span>Add Piece</span>
        </button>

        <button
          onClick={() => openModal('index')}
          className="p-2.5 rounded-full hover:bg-white/5 text-[#EAEAE6]/90 hover:text-[#EAEAE6] transition-colors cursor-pointer"
          aria-label="Search Collection"
        >
          <SearchIcon />
        </button>

        <button
          onClick={() => openModal('bag')}
          className="p-2.5 rounded-full hover:bg-white/5 text-[#EAEAE6]/90 hover:text-[#EAEAE6] transition-colors flex items-center gap-1.5 cursor-pointer"
          aria-label={`Shopping Bag with ${bag.length} items`}
        >
          <BagIcon />
          <span className="font-mono text-[11px] text-[#EAEAE6]">({bag.length})</span>
        </button>
      </div>
    </nav>
  );
};

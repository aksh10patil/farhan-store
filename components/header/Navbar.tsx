'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { GridIcon, SearchIcon, BagIcon } from '@/components/icons/Icons';

export const Navbar: React.FC = () => {
  const { openModal, snapToIndex, showToast, bag } = useStore();
  const [mounted, setMounted] = useState(false);
  const [bagPulse, setBagPulse] = useState(false);

  // Trigger choreographed entrance after hydration
  useEffect(() => {
    const timer = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  // Subtle tactile pulse when bag count changes
  useEffect(() => {
    if (!mounted) return;
    setBagPulse(true);
    const timeout = setTimeout(() => setBagPulse(false), 300);
    return () => clearTimeout(timeout);
  }, [bag.length, mounted]);

  const logoLetters = ['Z', 'A', 'I', 'D'];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${mounted
          ? 'bg-[#0C0C0B]/75 backdrop-blur-md border-b border-[#EAEAE6]/[0.07]'
          : 'bg-transparent border-b border-transparent'
        }`}
    >
      <nav
        className="relative max-w-[1480px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between"
        aria-label="Main Navigation"
      >
        {/* Left: 4-Square Grid Icon + Minimal Links */}
        <div
          className={`flex items-center gap-7 transition-all duration-700 delay-100 ease-[cubic-bezier(0.16,1,0.3,1)] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
            }`}
        >
          <button
            onClick={() => openModal('index')}
            className="group p-2 -ml-2 rounded-lg hover:bg-white/[0.04] transition-all duration-300 flex items-center gap-3 cursor-pointer"
            title="Collection Index"
            aria-label="Open Collection Index"
          >
            <GridIcon className="text-[#EAEAE6] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-90 group-hover:scale-105" />
            <span className="hidden lg:inline font-mono text-[11px] tracking-[0.14em] text-[#9A9A94] group-hover:text-[#EAEAE6] transition-colors duration-300 uppercase">
              Index
            </span>
          </button>

          <div className="hidden md:flex items-center gap-6 font-mono text-[11px] tracking-[0.14em] uppercase text-[#8A8A84]">
            {[
              { label: 'Shop', action: () => openModal('index') },
              { label: 'Lookbook', action: () => showToast('LOOKBOOK // TRAIL SEASON 01 ARCHIVE') },
              { label: 'Archive', action: () => showToast('ZAID® TECHNICAL ARCHIVE 2026') },
            ].map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="relative py-1 hover:text-[#EAEAE6] transition-colors duration-300 cursor-pointer group"
              >
                <span>{item.label}</span>
                {/* Precision technical underline */}
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#FF5E00] scale-x-0 origin-right transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-hover:origin-left" />
              </button>
            ))}
          </div>
        </div>

        {/* Center: Kinetic ZAID® Geometric Italicized Wordmark */}
        <button
          type="button"
          onClick={() => snapToIndex(0)}
          className="absolute left-1/2 -translate-x-1/2 flex items-start select-none group cursor-pointer bg-transparent border-0 py-1 px-2"
          aria-label="ZAID Home - Reset Orbit"
        >
          {/* Masked kinetic container */}
          <span className="relative inline-flex overflow-hidden pr-[3px]">
            {/* Primary Wordmark Layer (Staggered Entrance + Hover Slide Up) */}
            <span className="inline-flex">
              {logoLetters.map((char, idx) => (
                <span
                  key={`primary-${idx}`}
                  style={{ transitionDelay: `${mounted ? idx * 75 : 180 + idx * 80}ms` }}
                  className={`inline-block font-black italic tracking-[-0.05em] text-[25px] md:text-[28px] leading-none text-[#EAEAE6] transition-all duration-[850ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${mounted
                      ? 'translate-y-0 opacity-100 blur-0'
                      : 'translate-y-[115%] opacity-0 blur-[4px]'
                    } group-hover:-translate-y-[115%]`}
                >
                  {char}
                </span>
              ))}
            </span>

            {/* Secondary Hover Reveal Layer (Slides up from bottom on hover) */}
            <span
              aria-hidden="true"
              className="absolute inset-0 inline-flex pr-[3px] pointer-events-none"
            >
              {logoLetters.map((char, idx) => (
                <span
                  key={`hover-${idx}`}
                  style={{ transitionDelay: `${idx * 75}ms` }}
                  className="inline-block font-black italic tracking-[-0.05em] text-[25px] md:text-[28px] leading-none text-[#EAEAE6] translate-y-[115%] transition-transform duration-[850ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
                >
                  {char}
                </span>
              ))}
            </span>
          </span>

          {/* Registered Trademark Symbol */}
          <span
            style={{ transitionDelay: mounted ? '300ms' : '500ms' }}
            className={`text-[10px] font-bold text-[#EAEAE6] ml-0.5 mt-0.5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
              } group-hover:text-[#FF5E00] group-hover:rotate-12`}
          >
            ®
          </span>
        </button>

        {/* Right: + Add Piece, Search & Bag Counter */}
        <div
          className={`flex items-center gap-2 sm:gap-3 transition-all duration-700 delay-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
            }`}
        >
       

          <button
            onClick={() => openModal('index')}
            className="p-2.5 rounded-full hover:bg-white/[0.06] active:scale-95 text-[#EAEAE6]/85 hover:text-[#EAEAE6] transition-all duration-300 cursor-pointer group"
            aria-label="Search Collection"
          >
            <SearchIcon className="transition-transform duration-300 group-hover:scale-110" />
          </button>

          <button
            onClick={() => openModal('bag')}
            className={`p-2.5 rounded-full hover:bg-white/[0.06] active:scale-95 text-[#EAEAE6]/85 hover:text-[#EAEAE6] transition-all duration-300 flex items-center gap-1.5 cursor-pointer group ${bagPulse ? 'scale-110 bg-white/[0.08]' : 'scale-100'
              }`}
            aria-label={`Shopping Bag with ${bag.length} items`}
          >
            <BagIcon className="transition-transform duration-300 group-hover:-translate-y-0.5" />
            <span
              className={`font-mono text-[11px] transition-colors duration-300 ${bag.length > 0 ? 'text-[#FF5E00] font-semibold' : 'text-[#EAEAE6]'
                }`}
            >
              ({bag.length})
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
};
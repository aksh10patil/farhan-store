'use client';

import React, { useEffect, useState } from 'react';

interface TickerItem {
  text: string;
  accent?: string;
  glow?: string;
  dotColor?: string;
  isLive?: boolean;
}

const TICKER_ITEMS: TickerItem[] = [
  {
    text: '21.11 12:00 ET',
    accent: 'text-[#FFB085]', // Pastel Neon Coral/Amber
    glow: 'drop-shadow-[0_0_8px_rgba(255,176,133,0.35)]',
    dotColor: 'bg-[#FFB085] shadow-[0_0_8px_#FFB085]',
    isLive: true,
  },
  {
    text: 'FREE SHIPPING NATIONWIDE',
    accent: 'text-[#7AF8CB]', // Pastel Neon Mint
    glow: 'drop-shadow-[0_0_8px_rgba(122,248,203,0.3)]',
    dotColor: 'bg-[#7AF8CB]/60',
  },
  {
    text: 'TRAIL SEASON DROP 01',
    accent: 'text-[#EAEAE6]',
    dotColor: 'bg-[#FF5E00]',
  },
  {
    text: 'SWEATSHIRTS & FLEECE',
    accent: 'text-[#A3A39E]',
    dotColor: 'bg-[#EAEAE6]/25',
  },
  {
    text: 'BAGGY CARGO SWEATPANTS',
    accent: 'text-[#8EE3FF]', // Pastel Neon Glacier Cyan
    glow: 'drop-shadow-[0_0_8px_rgba(142,227,255,0.28)]',
    dotColor: 'bg-[#8EE3FF]/60',
  },
  {
    text: 'ENGINEERED TECHWEAR SPEC',
    accent: 'text-[#D8B4FE]', // Pastel Neon Lavender
    glow: 'drop-shadow-[0_0_8px_rgba(216,180,254,0.3)]',
    dotColor: 'bg-[#D8B4FE]/60',
  },
];

export const Ticker: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const renderSequence = (prefix: string) =>
    TICKER_ITEMS.map((item, idx) => (
      <div
        key={`${prefix}-${idx}`}
        className="inline-flex items-center space-x-10 shrink-0"
      >
        {/* Precision Micro-Indicator Dot */}
        <span className="relative flex h-1.5 w-1.5 items-center justify-center">
          {item.isLive && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFB085] opacity-75" />
          )}
          <span
            className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
              item.dotColor || 'bg-[#EAEAE6]/30'
            }`}
          />
        </span>

        {/* Pastel Neon Typography */}
        <span
          className={`transition-all duration-300 hover:brightness-125 ${
            item.accent || 'text-[#9A9A94]'
          } ${item.glow || ''}`}
        >
          {item.text}
        </span>
        <span className="text-[#EAEAE6]/20 select-none">•</span>
      </div>
    ));

  return (
    <div
      className={`w-full overflow-hidden border-b border-[#EAEAE6]/[0.08] py-2 bg-[#0C0C0B]/90 backdrop-blur-md transition-opacity duration-700 ${
        mounted ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="ticker-track font-mono text-[11px] tracking-[0.16em] uppercase text-[#9A9A94] flex select-none whitespace-nowrap">
        <div className="flex items-center space-x-10 pr-10 shrink-0">
          {renderSequence('ticker-1')}
        </div>
        <div className="flex items-center space-x-10 pr-10 shrink-0" aria-hidden="true">
          {renderSequence('ticker-2')}
        </div>
      </div>
    </div>
  );
};
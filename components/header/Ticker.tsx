import React from 'react';

const TICKER_ITEMS = [
  '21.11 12:00 ET',
  'FREE SHIPPING OVER $150',
  'TRAIL SEASON DROP 01',
  'SWEATSHIRTS & FLEECE',
  'BAGGY CARGO SWEATPANTS',
  'TACTICAL HARDWARE BELTS',
  'ENGINEERED TECHWEAR SPEC',
];

export const Ticker: React.FC = () => {
  return (
    <div className="w-full overflow-hidden border-b border-[#EAEAE6]/[0.08] py-2 bg-[#141413]/85 backdrop-blur-md">
      <div className="ticker-track font-mono text-[11px] tracking-[0.16em] uppercase text-[#9A9A94]">
        <div className="flex items-center space-x-10 pr-10">
          {TICKER_ITEMS.map((item, idx) => (
            <React.Fragment key={`ticker-1-${idx}`}>
              <span>•</span>
              <span>{item}</span>
            </React.Fragment>
          ))}
        </div>
        <div className="flex items-center space-x-10 pr-10" aria-hidden="true">
          {TICKER_ITEMS.map((item, idx) => (
            <React.Fragment key={`ticker-2-${idx}`}>
              <span>•</span>
              <span>{item}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

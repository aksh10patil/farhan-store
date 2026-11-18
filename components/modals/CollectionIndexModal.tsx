'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { GarmentIllustration } from '@/components/ui/GarmentIllustration';
import { CloseIcon } from '@/components/icons/Icons';

export const CollectionIndexModal: React.FC = () => {
  const { activeModal, closeModal, garments, snapToIndex } = useStore();

  if (activeModal !== 'index') return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="index-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#141413]/92 backdrop-blur-xl p-4 sm:p-8 animate-in fade-in duration-200"
      onClick={closeModal}
    >
      <div
        className="w-full max-w-4xl rounded-3xl bg-[#191917] border border-[#EAEAE6]/12 p-6 sm:p-8 shadow-2xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#EAEAE6]/10">
          <div>
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#8A8A84]">
              TRAIL SEASON // LOOK INDEX
            </span>
            <h3 id="index-modal-title" className="text-xl font-bold text-[#EAEAE6]">
              All Pieces in Orbit
            </h3>
          </div>
          <button
            onClick={closeModal}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-[#EAEAE6] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close Collection Index"
          >
            <CloseIcon size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto pt-5 pr-1">
          {garments.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => {
                closeModal();
                snapToIndex(idx);
              }}
              className="group p-4 rounded-2xl bg-[#141413] border border-[#EAEAE6]/10 hover:border-[#EAEAE6]/40 cursor-pointer flex flex-col items-center text-center transition-all hover:bg-[#181816]"
            >
              <div className="mb-3 w-24 h-28 flex items-center justify-center group-hover:scale-105 transition-transform">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <GarmentIllustration
                    type={item.svgType}
                    uniqueIdPrefix={`grid_${item.id}`}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              <span className="font-mono text-[9px] text-[#7A7A75]">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <h4 className="text-xs font-semibold text-[#EAEAE6] mt-0.5">{item.name}</h4>
              <span className="font-mono text-[11px] text-[#9A9A94] mt-1">${item.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

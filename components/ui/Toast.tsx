'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';

export const Toast: React.FC = () => {
  const { toast } = useStore();

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-full bg-[#22221F] border border-[#EAEAE6]/20 font-mono text-[11px] tracking-[0.12em] uppercase text-[#EAEAE6] shadow-2xl transition-all duration-300 ${
        toast.visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
    >
      {toast.message}
    </div>
  );
};

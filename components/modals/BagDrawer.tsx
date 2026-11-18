'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { CloseIcon } from '@/components/icons/Icons';

export const BagDrawer: React.FC = () => {
  const { activeModal, closeModal, bag, bagSubtotal, removeFromBag, showToast } = useStore();

  if (activeModal !== 'bag') return null;

  return (
    <aside
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag Drawer"
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeModal}
    >
      <div
        className="w-full max-w-md h-full bg-[#181816] border-l border-[#EAEAE6]/12 p-6 sm:p-8 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[#EAEAE6]/10">
            <span className="font-mono text-xs tracking-[0.16em] uppercase text-[#EAEAE6]">
              Your Bag ({bag.length})
            </span>
            <button
              onClick={closeModal}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-[#EAEAE6] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close Shopping Bag"
            >
              <CloseIcon size={12} />
            </button>
          </div>

          <div className="mt-5 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {bag.length === 0 ? (
              <p className="font-mono text-xs text-[#7A7A75] py-12 text-center">
                YOUR SPIN® BAG IS EMPTY.
              </p>
            ) : (
              bag.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#141413] border border-[#EAEAE6]/10"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#EAEAE6]">{item.name}</p>
                    <p className="font-mono text-[10px] text-[#8A8A84] mt-0.5">
                      SIZE: {item.size} &nbsp;//&nbsp; ${item.price} USD
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromBag(item.id)}
                    className="text-xs font-mono text-[#7A7A75] hover:text-[#FF5E00] px-2 py-1 transition-colors cursor-pointer"
                  >
                    REMOVE
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-[#EAEAE6]/10">
          <div className="flex items-center justify-between font-mono text-xs mb-4">
            <span className="text-[#9A9A94]">SUBTOTAL</span>
            <span className="text-[#EAEAE6] font-bold">${bagSubtotal} USD</span>
          </div>
          <button
            type="button"
            disabled={bag.length === 0}
            onClick={() => showToast('PROCEEDING TO ENCRYPTED CHECKOUT...')}
            className={`w-full py-3.5 rounded-full font-mono font-bold text-xs tracking-[0.16em] uppercase transition-all shadow-lg ${
              bag.length === 0
                ? 'bg-[#EAEAE6]/20 text-[#7A7A75] cursor-not-allowed'
                : 'bg-[#EAEAE6] hover:bg-white text-[#141413] cursor-pointer'
            }`}
          >
            Checkout
          </button>
        </div>
      </div>
    </aside>
  );
};

'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { CloseIcon } from '@/components/icons/Icons';

export const AddGarmentModal: React.FC = () => {
  const { activeModal, closeModal, addCustomGarment } = useStore();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(2999);
  const [color, setColor] = useState('#FF5E00');
  const [imgUrl, setImgUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (activeModal !== 'addPiece') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const commitInsert = (finalUrl: string | null) => {
      addCustomGarment({
        name: name.trim(),
        tag: 'CUSTOM DROP // TRAIL SEASON ARCHIVE',
        price: Number(price) || 2999,
        color,
        fabric: 'Technical Composite Shell',
        fit: 'Relaxed Studio Fit',
        desc: 'Custom added piece integrated directly into the ZAID® Trail Season 3D orbital showcase.',
        svgType: 'shell',
        imageUrl: finalUrl,
      });

      // Reset form
      setName('');
      setPrice(220);
      setColor('#FF5E00');
      setImgUrl('');
      setSelectedFile(null);
    };

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        commitInsert(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      commitInsert(imgUrl.trim() || null);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#141413]/90 backdrop-blur-lg p-4 animate-in fade-in duration-200"
      onClick={closeModal}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-[#1A1A18] border border-[#EAEAE6]/15 p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#FF5E00]">
              Customize Orbit
            </span>
            <h3 id="add-modal-title" className="text-xl font-bold text-[#EAEAE6]">
              Add Garment to Showcase
            </h3>
          </div>
          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-[#EAEAE6] flex items-center justify-center text-sm cursor-pointer transition-colors"
            aria-label="Close Modal"
          >
            <CloseIcon size={12} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="customName"
              className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#9A9A94] mb-1.5"
            >
              Garment Name
            </label>
            <input
              id="customName"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alpine Tech Parka"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141413] border border-[#EAEAE6]/15 text-sm text-[#EAEAE6] focus:outline-none focus:border-[#EAEAE6]/50 placeholder-[#7A7A75]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="customPrice"
                className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#9A9A94] mb-1.5"
              >
                Price (INR)
              </label>
              <input
                id="customPrice"
                type="number"
                required
                min={100}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141413] border border-[#EAEAE6]/15 text-sm text-[#EAEAE6] focus:outline-none focus:border-[#EAEAE6]/50"
              />
            </div>
            <div>
              <label
                htmlFor="customColor"
                className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#9A9A94] mb-1.5"
              >
                Accent Glow Color
              </label>
              <input
                id="customColor"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-[42px] p-1 rounded-xl bg-[#141413] border border-[#EAEAE6]/15 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="customImgUrl"
              className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#9A9A94] mb-1.5"
            >
              Transparent PNG Image URL (Optional)
            </label>
            <input
              id="customImgUrl"
              type="url"
              value={imgUrl}
              onChange={(e) => setImgUrl(e.target.value)}
              placeholder="https://... (or upload file below)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141413] border border-[#EAEAE6]/15 text-sm text-[#EAEAE6] focus:outline-none focus:border-[#EAEAE6]/50 placeholder-[#7A7A75]"
            />
          </div>

          <div>
            <label
              htmlFor="customImgFile"
              className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#9A9A94] mb-1.5"
            >
              Or Upload Local Image File
            </label>
            <input
              id="customImgFile"
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full text-xs font-mono text-[#9A9A94] file:mr-3 file:py-2 file:px-3.5 file:rounded-full file:border-0 file:text-xs file:font-mono file:bg-[#EAEAE6]/10 file:text-[#EAEAE6] hover:file:bg-[#EAEAE6]/20 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-full bg-[#EAEAE6] hover:bg-white text-[#141413] font-mono font-bold text-xs tracking-[0.15em] uppercase transition-all cursor-pointer shadow-lg"
          >
            Insert Into 3D Orbit
          </button>
        </form>
      </div>
    </div>
  );
};

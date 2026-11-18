'use client';

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { Garment, BagItem, GarmentSize, ModalType, StoreContextType } from '@/types/store';
import { INITIAL_GARMENTS } from '@/data/garments';

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [garments, setGarments] = useState<Garment[]>(INITIAL_GARMENTS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [targetIndex, setTargetIndex] = useState<{ index: number; timestamp: number } | null>(null);
  const [selectedSize, setSelectedSize] = useState<GarmentSize>('L');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [bag, setBag] = useState<BagItem[]>([]);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false,
  });

  const activeGarment = garments[currentIndex] ?? garments[0];

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
  }, []);

  useEffect(() => {
    if (!toast.visible) return;
    const timer = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 2800);
    return () => clearTimeout(timer);
  }, [toast.visible, toast.message]);

  const openModal = useCallback((modal: ModalType) => {
    setActiveModal(modal);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const snapToIndex = useCallback(
    (index: number) => {
      if (!garments.length) return;
      const wrapped = ((index % garments.length) + garments.length) % garments.length;
      setCurrentIndex(wrapped);
      setTargetIndex({ index: wrapped, timestamp: Date.now() });
    },
    [garments.length]
  );

  const nextGarment = useCallback(() => {
    if (!garments.length) return;
    setCurrentIndex((prev) => {
      const next = (prev + 1) % garments.length;
      setTargetIndex({ index: next, timestamp: Date.now() });
      return next;
    });
  }, [garments.length]);

  const prevGarment = useCallback(() => {
    if (!garments.length) return;
    setCurrentIndex((prev) => {
      const prevIdx = (prev - 1 + garments.length) % garments.length;
      setTargetIndex({ index: prevIdx, timestamp: Date.now() });
      return prevIdx;
    });
  }, [garments.length]);

  const addToBag = useCallback(
    (garment: Garment, size: GarmentSize) => {
      const newItem: BagItem = {
        id: `${garment.id}-${size}-${Date.now()}`,
        garmentId: garment.id,
        name: garment.name,
        sku: garment.sku,
        price: garment.price,
        size,
        color: garment.color,
        svgType: garment.svgType,
        imageUrl: garment.imageUrl,
      };
      setBag((prev) => [...prev, newItem]);
      closeModal();
      showToast(`ADDED ${garment.name.toUpperCase()} (${size}) TO BAG`);
    },
    [closeModal, showToast]
  );

  const removeFromBag = useCallback((bagItemId: string) => {
    setBag((prev) => prev.filter((item) => item.id !== bagItemId));
  }, []);

  const bagSubtotal = useMemo(() => {
    return bag.reduce((acc, item) => acc + item.price, 0);
  }, [bag]);

  const addCustomGarment = useCallback(
    (newPiece: Omit<Garment, 'id' | 'sku'>) => {
      const nextNum = garments.length + 1;
      const created: Garment = {
        ...newPiece,
        id: `trl-custom-${nextNum}`,
        sku: `TRL-26-0${nextNum < 10 ? `0${nextNum}` : nextNum}`,
      };
      const newIndex = garments.length;
      setGarments((prev) => [...prev, created]);
      setCurrentIndex(newIndex);
      setTargetIndex({ index: newIndex, timestamp: Date.now() });
      closeModal();
      showToast(`ADDED "${created.name.toUpperCase()}" TO ORBIT`);
    },
    [garments.length, closeModal, showToast]
  );

  // Global keyboard shortcuts (Escape to close modals, Left/Right for orbit when no modal is open)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeModal !== null) {
        if (e.key === 'Escape') {
          closeModal();
        }
        return;
      }

      if (e.key === 'ArrowRight') {
        nextGarment();
      } else if (e.key === 'ArrowLeft') {
        prevGarment();
      } else if (e.key === 'Enter') {
        openModal('product');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, closeModal, nextGarment, prevGarment, openModal]);

  const value: StoreContextType = {
    garments,
    currentIndex,
    targetIndex,
    activeGarment,
    selectedSize,
    activeModal,
    bag,
    bagSubtotal,
    toast,
    setSelectedSize,
    openModal,
    closeModal,
    setCurrentIndex,
    snapToIndex,
    nextGarment,
    prevGarment,
    addToBag,
    removeFromBag,
    addCustomGarment,
    showToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

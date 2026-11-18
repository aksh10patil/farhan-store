'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { useStore } from '@/context/StoreContext';
import { GarmentIllustration } from '@/components/ui/GarmentIllustration';
import { OrbitHUD } from './OrbitHUD';

export const OrbitShowcase: React.FC = () => {
  const {
    garments,
    currentIndex,
    setCurrentIndex,
    targetIndex,
    activeGarment,
    activeModal,
    openModal,
    snapToIndex,
  } = useStore();

  const stageRef = useRef<HTMLElement>(null);
  const orbitState = useRef({ rotation: -1.35 });
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const currentIndexRef = useRef(currentIndex);
  const [progressOffset, setProgressOffset] = useState(0);
  const snapTimeout = useRef<NodeJS.Timeout | null>(null);
  const isPointerDown = useRef(false);
  const lastPointerX = useRef(0);

  // Sync refs safely in effects
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    nodesRef.current = nodesRef.current.slice(0, garments.length);
  }, [garments.length]);

  const setNodeRef = useCallback((el: HTMLDivElement | null, idx: number) => {
    nodesRef.current[idx] = el;
  }, []);

  /**
   * Core 3D Spherical / Elliptical Projection Loop
   */
  const renderOrbitFrame = useCallback(() => {
    const total = garments.length;
    if (!total || typeof window === 'undefined') return;

    const stageWidth = window.innerWidth;
    const radiusX = Math.min(stageWidth * 0.34, 460);
    const radiusZ = 260;
    const arcLiftY = 34;

    const wrappedIndex = ((Math.round(orbitState.current.rotation) % total) + total) % total;
    if (wrappedIndex !== currentIndexRef.current) {
      currentIndexRef.current = wrappedIndex;
      setCurrentIndex(wrappedIndex);
    }

    nodesRef.current.forEach((node, idx) => {
      if (!node) return;

      let diff = (idx - orbitState.current.rotation) % total;
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;

      const theta = (diff / total) * Math.PI * 2;

      const x = Math.sin(theta) * radiusX;
      const z = Math.cos(theta) * radiusZ;
      const normalizedDepth = (z + radiusZ) / (2 * radiusZ);

      const frontProximity = Math.max(0, Math.cos(theta));
      const popCurve = Math.pow(frontProximity, 4);

      const y = -Math.cos(theta) * arcLiftY + (1 - popCurve) * 14 - popCurve * 12;
      const scale = 0.56 + normalizedDepth * 0.44 + popCurve * 0.16;
      const rotateY = -Math.sin(theta) * 26;
      const brightness = 0.46 + normalizedDepth * 0.44 + popCurve * 0.14;
      const opacity = normalizedDepth < 0.15 ? 0.35 : 0.65 + normalizedDepth * 0.35;
      const zIndex = Math.round(normalizedDepth * 100);

      node.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) rotateY(${rotateY.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
      node.style.zIndex = String(zIndex);
      node.style.opacity = opacity.toFixed(3);
      node.style.filter = `brightness(${brightness.toFixed(3)})`;

      if (popCurve > 0.72) {
        node.classList.add('is-front');
      } else {
        node.classList.remove('is-front');
      }
    });

    // Update scrub bar thumb position
    const normalizedPos = (((orbitState.current.rotation % total) + total) % total) / Math.max(1, total - 1);
    const maxTravel = 110;
    setProgressOffset(normalizedPos * maxTravel);
  }, [garments.length, setCurrentIndex]);

  /**
   * Magnetic snap to nearest garment slot after free drag/wheel
   */
  const scheduleMagneticSnap = useCallback(() => {
    if (snapTimeout.current) clearTimeout(snapTimeout.current);
    snapTimeout.current = setTimeout(() => {
      const nearest = Math.round(orbitState.current.rotation);
      gsap.to(orbitState.current, {
        rotation: nearest,
        duration: 0.55,
        ease: 'back.out(1.25)',
        onUpdate: renderOrbitFrame,
      });
    }, 140);
  }, [renderOrbitFrame]);

  // Smooth GSAP Tween to Target Index when triggered via context
  useEffect(() => {
    if (!targetIndex) return;
    const total = garments.length;
    if (!total) return;

    const currentRot = orbitState.current.rotation;
    const currentMod = ((currentRot % total) + total) % total;

    let delta = targetIndex.index - currentMod;
    if (delta > total / 2) delta -= total;
    if (delta < -total / 2) delta += total;

    gsap.killTweensOf(orbitState.current);
    gsap.to(orbitState.current, {
      rotation: currentRot + delta,
      duration: 0.72,
      ease: 'power3.out',
      onUpdate: renderOrbitFrame,
    });
  }, [targetIndex, garments.length, renderOrbitFrame]);

  // Setup wheel, pointer and resize listeners
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const handleWheel = (e: WheelEvent) => {
      if (activeModal !== null) return;
      e.preventDefault();
      gsap.killTweensOf(orbitState.current);
      const step = e.deltaY * -0.0026;
      orbitState.current.rotation += step;
      renderOrbitFrame();
      scheduleMagneticSnap();
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (activeModal !== null) return;
      isPointerDown.current = true;
      lastPointerX.current = e.clientX;
      gsap.killTweensOf(orbitState.current);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isPointerDown.current || activeModal !== null) return;
      const deltaX = e.clientX - lastPointerX.current;
      lastPointerX.current = e.clientX;
      const step = deltaX * 0.005;
      orbitState.current.rotation -= step;
      renderOrbitFrame();
    };

    const handlePointerUp = () => {
      if (isPointerDown.current) {
        isPointerDown.current = false;
        scheduleMagneticSnap();
      }
    };

    const handleResize = () => {
      renderOrbitFrame();
    };

    stage.addEventListener('wheel', handleWheel, { passive: false });
    stage.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('resize', handleResize);

    // Initial load intro entrance animation
    renderOrbitFrame();
    gsap.to(orbitState.current, {
      rotation: 0,
      duration: 1.35,
      ease: 'power3.out',
      onUpdate: renderOrbitFrame,
    });

    return () => {
      stage.removeEventListener('wheel', handleWheel);
      stage.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      if (snapTimeout.current) clearTimeout(snapTimeout.current);
    };
  }, [activeModal, renderOrbitFrame, scheduleMagneticSnap]);

  // Click on progress scrub track
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const target = Math.round(ratio * (garments.length - 1));
    snapToIndex(target);
  };

  return (
    <main
      ref={stageRef}
      className="relative w-full h-screen flex flex-col justify-between pt-24 pb-8 px-6 z-10 overflow-hidden select-none cursor-grab active:cursor-grabbing"
    >
      {/* Top Collection Subtitle */}
      <div className="w-full text-center pt-2 z-20 pointer-events-none">
        <p className="font-mono text-[11px] md:text-[12px] tracking-[0.26em] uppercase text-[#8A8A84]">
          TRAIL SEASON
        </p>
      </div>

      {/* 3D Orbital Sphere Container */}
      <div className="orbit-stage relative flex-1 w-full max-w-[1440px] mx-auto my-auto flex items-center justify-center">
        {/* Elliptical Orbital Floor Rings */}
        <div className="orbital-floor-ring" />
        <div className="orbital-floor-ring-inner" />

        {/* Ambient Color Floor Reflection */}
        <div
          className="floor-reflection"
          style={{
            backgroundColor: activeGarment?.color || '#C81E1E',
          }}
        />

        {/* Garment 3D Sphere Ring */}
        <div className="relative w-full h-full">
          {garments.map((item, idx) => {
            const isFront = idx === currentIndex;
            return (
              <div
                key={item.id}
                ref={(el) => setNodeRef(el, idx)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isFront) {
                    openModal('product');
                  } else {
                    snapToIndex(idx);
                  }
                }}
                className={`garment-node ${isFront ? 'is-front' : ''}`}
                data-index={idx}
                title={`${item.name} — Click to inspect`}
              >
                <div className="garment-visual-wrap garment-shadow">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-contain pointer-events-none"
                    />
                  ) : (
                    <GarmentIllustration
                      type={item.svgType}
                      uniqueIdPrefix={`node_${item.id}`}
                      className="w-full h-full object-contain pointer-events-none"
                    />
                  )}

                  {/* Reflected silhouette beneath garment */}
                  <div className="garment-reflection">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt=""
                        className="w-full h-full object-contain pointer-events-none"
                      />
                    ) : (
                      <GarmentIllustration
                        type={item.svgType}
                        uniqueIdPrefix={`reflect_${item.id}`}
                        className="w-full h-full object-contain pointer-events-none"
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Inspect Pill on Active Front Garment */}
        <button
          type="button"
          onClick={() => openModal('product')}
          className="absolute bottom-[13%] left-1/2 -translate-x-1/2 z-30 px-3.5 py-1.5 rounded-full bg-[#1C1C1A]/85 backdrop-blur-md border border-[#EAEAE6]/15 hover:border-[#EAEAE6]/45 text-[10px] font-mono tracking-[0.16em] uppercase text-[#EAEAE6]/90 hover:text-white transition-all flex items-center gap-2 shadow-xl pointer-events-auto cursor-pointer"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5E00] animate-pulse" />
          <span>Inspect Piece</span>
        </button>
      </div>

      {/* Bottom HUD & Controls */}
      <OrbitHUD
        onProgressClick={handleProgressClick}
        progressRatio={progressOffset}
      />
    </main>
  );
};

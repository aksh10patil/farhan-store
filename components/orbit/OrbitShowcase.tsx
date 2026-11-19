'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { useStore } from '@/context/StoreContext';
import { GarmentIllustration } from '@/components/ui/GarmentIllustration';
import { OrbitHUD } from './OrbitHUD';

// Orbital geometry constants — keeps garments locked to the tilted floor plane
const ORBIT_TILT_DEG = 13.5;
const ORBIT_TILT_RAD = (ORBIT_TILT_DEG * Math.PI) / 180;
const INITIAL_REVOLUTIONS = 0.375; // Shorter by 50% (~135° sweep down from 270°)

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
  const floorRingRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const innerVisualsRef = useRef<(HTMLDivElement | null)[]>([]);
  const currentIndexRef = useRef(currentIndex);
  const activeModalRef = useRef(activeModal);
  const hasPlayedIntro = useRef(false);

  // Unified animation state driven by GSAP
  const orbitState = useRef({
    rotation: 0,
    entranceProgress: 0, // 0 -> 1 staggered bloom on initial load
    radiusScale: 0.84,   // Subtle orbital expansion on load
  });

  // Physics & pointer tracking
  const velocityRef = useRef(0);
  const isPointerDown = useRef(false);
  const hasDragged = useRef(false);
  const startPointerPos = useRef({ x: 0, y: 0 });
  const lastPointerX = useRef(0);
  const lastPointerTime = useRef(0);
  const snapTimeout = useRef<NodeJS.Timeout | null>(null);
  const inertiaTween = useRef<gsap.core.Tween | null>(null);
  const introTimelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    activeModalRef.current = activeModal;
  }, [activeModal]);

  useEffect(() => {
    nodesRef.current = nodesRef.current.slice(0, garments.length);
    innerVisualsRef.current = innerVisualsRef.current.slice(0, garments.length);
  }, [garments.length]);

  const setNodeRef = useCallback((el: HTMLDivElement | null, idx: number) => {
    nodesRef.current[idx] = el;
  }, []);

  const setInnerVisualRef = useCallback((el: HTMLDivElement | null, idx: number) => {
    innerVisualsRef.current[idx] = el;
  }, []);

  /**
   * Core 3D Tilted Elliptical Projection Loop
   */
  const renderOrbitFrame = useCallback(() => {
    const total = garments.length;
    if (!total || typeof window === 'undefined') return;

    const stageWidth = window.innerWidth;
    const stageHeight = window.innerHeight;
    const isMobile = stageWidth < 768;

    // Responsive radii scaled smoothly on entrance:
    // On mobile, spread X wider (0.44 of screen) so flank models frame the hero gracefully instead of crowding behind it
    const baseRadiusX = isMobile
      ? stageWidth * 0.44
      : Math.min(stageWidth * 0.35, 480);
    const baseRadiusZ = isMobile
      ? Math.min(stageWidth * 0.25, 170)
      : Math.min(stageWidth * 0.22, 290);
    const radiusX = baseRadiusX * orbitState.current.radiusScale;
    const radiusZ = baseRadiusZ * orbitState.current.radiusScale;

    // Rotate the inner orbital track ring in sync with garment revolution
    if (floorRingRef.current) {
      const orbitDeg = -(orbitState.current.rotation / total) * 360;
      floorRingRef.current.style.transform = `scale(${orbitState.current.radiusScale.toFixed(4)}) rotateZ(${orbitDeg.toFixed(2)}deg)`;
    }

    // Center offset lifts the orbit slightly above optical center for HUD balance
    const verticalCenterBias = isMobile ? -stageHeight * 0.016 : -stageHeight * 0.025;

    const wrappedIndex = ((Math.round(orbitState.current.rotation) % total) + total) % total;
    if (wrappedIndex !== currentIndexRef.current) {
      currentIndexRef.current = wrappedIndex;
      setCurrentIndex(wrappedIndex);
    }

    const masterEntrance = orbitState.current.entranceProgress;

    nodesRef.current.forEach((node, idx) => {
      if (!node) return;

      // Shortest angular distance around the ring
      let diff = (idx - orbitState.current.rotation) % total;
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;

      const theta = (diff / total) * Math.PI * 2;

      // True 3D coordinates on a plane tilted toward the viewer by ORBIT_TILT_DEG
      const x = Math.sin(theta) * radiusX;
      const rawZ = Math.cos(theta) * radiusZ;
      const z = rawZ * Math.cos(ORBIT_TILT_RAD);

      // Front items (rawZ > 0) sit lower on screen; rear items (rawZ < 0) rise naturally
      const planeY = rawZ * Math.sin(ORBIT_TILT_RAD);

      // Normalized depth: 0 (furthest back) -> 1 (closest front)
      const normalizedDepth = (rawZ + radiusZ) / (2 * radiusZ);

      // Smooth bell curve for the hero foreground piece
      const frontProximity = Math.max(0, Math.cos(theta));
      const heroCurve = Math.pow(frontProximity, isMobile ? 4.2 : 5);

      // Staggered entrance bloom across the ring
      const angularDistanceFromFront = Math.abs(diff) / (total / 2);
      const staggerDelay = angularDistanceFromFront * 0.25;
      const itemEntrance = Math.max(
        0,
        Math.min(1, (masterEntrance - staggerDelay) / (1 - staggerDelay))
      );
      const easedEntrance = 1 - Math.pow(1 - itemEntrance, 3);

      // Floating elevation on hero piece + entrance rise
      const y =
        verticalCenterBias +
        planeY -
        heroCurve * (isMobile ? 12 : 10) +
        (1 - easedEntrance) * 24;

      // Perspective scale: On mobile, amplify hero prominence and push background into deeper perspective
      const baseScale = isMobile
        ? 0.48 + normalizedDepth * 0.44 + heroCurve * 0.22
        : 0.54 + normalizedDepth * 0.42 + heroCurve * 0.16;
      const scale = baseScale * (0.82 + 0.18 * easedEntrance);

      // Subtle inward tilt tangent to the ellipse
      const rotateY = -Math.sin(theta) * (isMobile ? 18 : 22);
      const rotateX = Math.cos(theta) * 3.5;

      // Atmospheric depth falloff: On mobile, heighten contrast so the active garment is the undisputed focal star
      const brightness = isMobile
        ? (0.34 + normalizedDepth * 0.52 + heroCurve * 0.22) * (0.55 + 0.45 * easedEntrance)
        : (0.42 + normalizedDepth * 0.46 + heroCurve * 0.15) * (0.55 + 0.45 * easedEntrance);
      const baseOpacity = isMobile
        ? (normalizedDepth < 0.18 ? 0.22 : 0.46 + normalizedDepth * 0.54)
        : (normalizedDepth < 0.12 ? 0.28 : 0.58 + normalizedDepth * 0.42);
      const opacity = baseOpacity * easedEntrance;
      const zIndex = Math.round(normalizedDepth * 100);

      node.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) rotateY(${rotateY.toFixed(2)}deg) rotateX(${rotateX.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
      node.style.zIndex = String(zIndex);
      node.style.opacity = opacity.toFixed(3);
      node.style.filter = `brightness(${brightness.toFixed(3)})`;

      if (heroCurve > (isMobile ? 0.74 : 0.78)) {
        node.classList.add('is-front');
      } else {
        node.classList.remove('is-front');
      }
    });
  }, [garments.length, setCurrentIndex]);

  /**
   * Weighted glide + soft magnetic settle to nearest garment slot
   */
  const scheduleWeightedSettle = useCallback(
    (initialVelocity = 0) => {
      if (snapTimeout.current) clearTimeout(snapTimeout.current);
      if (inertiaTween.current) inertiaTween.current.kill();

      const projectedRotation = orbitState.current.rotation + initialVelocity * 0.22;
      const targetSlot = Math.round(projectedRotation);
      const distance = Math.abs(targetSlot - orbitState.current.rotation);
      const duration = Math.min(1.05, Math.max(0.52, 0.48 + distance * 0.22));

      inertiaTween.current = gsap.to(orbitState.current, {
        rotation: targetSlot,
        duration,
        ease: 'power3.out',
        onUpdate: renderOrbitFrame,
      });
    },
    [renderOrbitFrame]
  );

  // Smooth GSAP Tween to Target Index when triggered via HUD / click
  useEffect(() => {
    if (!targetIndex) return;
    const total = garments.length;
    if (!total) return;

    if (introTimelineRef.current) introTimelineRef.current.kill();
    if (snapTimeout.current) clearTimeout(snapTimeout.current);
    if (inertiaTween.current) inertiaTween.current.kill();

    const currentRot = orbitState.current.rotation;
    const currentMod = ((currentRot % total) + total) % total;

    let delta = targetIndex.index - currentMod;
    if (delta > total / 2) delta -= total;
    if (delta < -total / 2) delta += total;

    inertiaTween.current = gsap.to(orbitState.current, {
      rotation: currentRot + delta,
      duration: 0.88,
      ease: 'expo.out',
      onUpdate: renderOrbitFrame,
    });
  }, [targetIndex, garments.length, renderOrbitFrame]);

  // Sweeping initial revolution (Strict-Mode safe)
  useEffect(() => {
    if (garments.length === 0) return;

    if (hasPlayedIntro.current) {
      orbitState.current.entranceProgress = 1;
      orbitState.current.radiusScale = 1;
      renderOrbitFrame();
      return;
    }

    const ctx = gsap.context(() => {
      orbitState.current.rotation = -garments.length * INITIAL_REVOLUTIONS;
      orbitState.current.entranceProgress = 0;
      orbitState.current.radiusScale = 0.84;
      renderOrbitFrame();

      const tl = gsap.timeline({
        delay: 0.1,
        onComplete: () => {
          hasPlayedIntro.current = true;
        },
      });
      introTimelineRef.current = tl;

      tl.to(
        orbitState.current,
        {
          entranceProgress: 1,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: renderOrbitFrame,
        },
        0
      ).to(
        orbitState.current,
        {
          radiusScale: 1,
          rotation: 0,
          duration: 3.5,
          ease: 'power3.out',
          onUpdate: renderOrbitFrame,
        },
        0
      );
    }, stageRef);

    return () => {
      ctx.revert();
    };
  }, [garments.length, renderOrbitFrame]);

  // Setup wheel, pointer, and resize listeners
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const cancelIntro = () => {
      if (introTimelineRef.current && introTimelineRef.current.isActive()) {
        introTimelineRef.current.kill();
        hasPlayedIntro.current = true;
        gsap.to(orbitState.current, {
          entranceProgress: 1,
          radiusScale: 1,
          duration: 0.4,
          ease: 'power2.out',
          onUpdate: renderOrbitFrame,
        });
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (activeModalRef.current !== null) return;
      e.preventDefault();

      cancelIntro();
      if (inertiaTween.current) inertiaTween.current.kill();
      if (snapTimeout.current) clearTimeout(snapTimeout.current);

      const rawDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const step = rawDelta * -0.0021;
      orbitState.current.rotation += step;
      velocityRef.current = step * 18;
      renderOrbitFrame();

      snapTimeout.current = setTimeout(() => {
        scheduleWeightedSettle(velocityRef.current);
        velocityRef.current = 0;
      }, 110);
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (activeModalRef.current !== null) return;
      isPointerDown.current = true;
      hasDragged.current = false;
      startPointerPos.current = { x: e.clientX, y: e.clientY };
      lastPointerX.current = e.clientX;
      lastPointerTime.current = performance.now();
      velocityRef.current = 0;

      cancelIntro();
      if (inertiaTween.current) inertiaTween.current.kill();
      if (snapTimeout.current) clearTimeout(snapTimeout.current);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isPointerDown.current || activeModalRef.current !== null) return;
      const now = performance.now();
      const deltaX = e.clientX - lastPointerX.current;
      const dt = Math.max(8, now - lastPointerTime.current);

      const dist = Math.hypot(
        e.clientX - startPointerPos.current.x,
        e.clientY - startPointerPos.current.y
      );
      if (dist > 7) {
        hasDragged.current = true;
      }

      const isMobile = window.innerWidth < 768;
      const step = deltaX * (isMobile ? 0.0050 : 0.0042);
      orbitState.current.rotation -= step;

      const instantVelocity = (-step / dt) * 16.67;
      velocityRef.current = velocityRef.current * 0.65 + instantVelocity * 0.35;

      lastPointerX.current = e.clientX;
      lastPointerTime.current = now;
      renderOrbitFrame();
    };

    const handlePointerUp = () => {
      if (!isPointerDown.current) return;
      isPointerDown.current = false;
      scheduleWeightedSettle(velocityRef.current);
      velocityRef.current = 0;
    };

    const handleResize = () => {
      renderOrbitFrame();
    };

    stage.addEventListener('wheel', handleWheel, { passive: false });
    stage.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('resize', handleResize);

    return () => {
      if (inertiaTween.current) inertiaTween.current.kill();
      stage.removeEventListener('wheel', handleWheel);
      stage.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      if (snapTimeout.current) clearTimeout(snapTimeout.current);
    };
  }, [renderOrbitFrame, scheduleWeightedSettle]);

  // Click on progress scrub track
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const target = Math.round(ratio * (garments.length - 1));
    snapToIndex(target);
  };

  const normalizedProgress =
    garments.length > 1 ? (currentIndex / (garments.length - 1)) * 110 : 0;

  return (
    <main
      ref={stageRef}
      className="relative w-full h-[100dvh] flex flex-col justify-between pt-20 sm:pt-24 pb-6 sm:pb-8 px-4 sm:px-6 z-10 overflow-hidden select-none cursor-grab active:cursor-grabbing touch-none"
    >
      {/* 3D Orbital Sphere Container */}
      <div
        className="orbit-stage relative flex-1 w-full max-w-[1440px] mx-auto my-auto flex items-center justify-center"
      >
        {/* Tilted Elliptical Orbital Floor Plane (matches ORBIT_TILT_DEG = 13.5deg) */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          style={{
            transform: `translateY(11%) rotateX(${90 - ORBIT_TILT_DEG}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Outer Orbital Track Ring */}
          <div className="w-[min(88vw,980px)] md:w-[min(74vw,980px)] h-[min(88vw,980px)] md:h-[min(74vw,980px)] rounded-full border border-[#EAEAE6]/[0.09] shadow-[0_0_60px_rgba(255,255,255,0.02)_inset]" />
          {/* Inner Precision Hairline Ring (rotates with the orbit) */}
          <div
            ref={floorRingRef}
            className="absolute w-[min(72vw,790px)] md:w-[min(60vw,790px)] h-[min(72vw,790px)] md:h-[min(60vw,790px)] rounded-full border border-dashed border-[#EAEAE6]/[0.08] will-change-transform"
          />
        </div>

        {/* Ambient Color Floor Reflection */}
        <div
          className="floor-reflection transition-colors duration-700 ease-out"
          style={{
            backgroundColor: activeGarment?.color || '#C81E1E',
          }}
        />

        {/* Garment 3D Sphere Ring */}
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {garments.map((item, idx) => {
            const isFront = idx === currentIndex;
            return (
              <div
                key={item.id}
                ref={(el) => setNodeRef(el, idx)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (hasDragged.current) return;
                  if (isFront) {
                    openModal('product');
                  } else {
                    snapToIndex(idx);
                  }
                }}
                className={`garment-node absolute will-change-transform transition-[filter] duration-300 ${
                  isFront ? 'is-front cursor-pointer' : 'cursor-pointer'
                }`}
                data-index={idx}
                title={`${item.name} — Click to inspect`}
              >
                <div
                  ref={(el) => setInnerVisualRef(el, idx)}
                  className="garment-visual-wrap garment-shadow transition-transform duration-600 ease-out hover:scale-[1.0]"
                >
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
      </div>

      {/* Bottom HUD & Controls */}
      <OrbitHUD
        onProgressClick={handleProgressClick}
        progressRatio={normalizedProgress}
      />
    </main>
  );
};
"use client";

import { useEffect, useRef } from "react";
import { mountLiquid } from "./liquid-renderer";
import { PRISM } from "./prism-preset";

// Scroll distances, as a share of the viewport height.
const EDGES_FILL_FROM = 0.05;
const EDGES_FILL_TO = 0.75;
const DEEPEN_TO = 2.5;
const MAX_DEEPEN = 0.45;

function smoothstep(from: number, to: number, value: number): number {
  const t = Math.min(1, Math.max(0, (value - from) / (to - from)));
  return t * t * (3 - 2 * t);
}

export default function LiquidBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const liquid = mountLiquid(ref.current, PRISM);
    return () => liquid?.destroy();
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const progress = window.scrollY / window.innerHeight;
      scrimRef.current?.style.setProperty(
        "--edge-fill",
        smoothstep(EDGES_FILL_FROM, EDGES_FILL_TO, progress).toFixed(3)
      );
      if (dimRef.current) {
        dimRef.current.style.opacity = (smoothstep(EDGES_FILL_TO, DEEPEN_TO, progress) * MAX_DEEPEN).toFixed(3);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="liquid-bg">
      <div ref={scrimRef} className="liquid-scrim" />
      <div ref={dimRef} className="liquid-dim" />
    </div>
  );
}

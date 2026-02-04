"use client";

import { useEffect, useMemo, useState } from "react";

type CountUpValueProps = {
  value: number;
  durationMs?: number;
};

export default function CountUpValue({ value, durationMs = 1000 }: CountUpValueProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const formattedTarget = useMemo(() => Math.round(value), [value]);

  useEffect(() => {
    let animationFrame = 0;
    let start: number | null = null;

    const step = (timestamp: number) => {
      if (start === null) {
        start = timestamp;
      }

      const progress = Math.min((timestamp - start) / durationMs, 1);
      const nextValue = Math.round(progress * formattedTarget);
      setDisplayValue(nextValue);

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      }
    };

    animationFrame = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [formattedTarget, durationMs]);

  return <span>{displayValue}</span>;
}

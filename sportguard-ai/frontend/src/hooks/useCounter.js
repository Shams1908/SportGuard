import { useState, useEffect } from "react";

export default function useCounter(target, duration = 2000, start = false) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);

      // "Ease Out Cubic" formula for a snappy start and smooth finish
      const eased = 1 - Math.pow(1 - progress, 3);

      setVal(Math.floor(eased * target));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [start, target, duration]);

  return val;
}
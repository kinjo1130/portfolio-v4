import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const SESSION_KEY = "kinjo:top-car-shown";
const HEIGHT = 28;
const ORIGINAL_W = 2105;
const ORIGINAL_H = 747;
const WIDTH = Math.round(HEIGHT * (ORIGINAL_W / ORIGINAL_H));

export default function RoadCar() {
  const [animKey, setAnimKey] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, "1");
    const t = window.setTimeout(() => setAnimKey(1), 600);
    return () => window.clearTimeout(t);
  }, []);

  const trigger = useCallback(() => {
    if (typeof window !== "undefined") {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    }
    setAnimKey((k) => (k ?? 0) + 1);
  }, []);

  return (
    <div
      onClick={trigger}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          trigger();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Run the car"
      title="Run the car"
      className="absolute inset-x-0 cursor-pointer focus:outline-none"
      style={{ height: HEIGHT, bottom: 0 }}
    >
      {animKey !== null && (
        <span
          key={animKey}
          aria-hidden="true"
          className="absolute pointer-events-none top-car-run"
          style={{
            width: WIDTH,
            height: HEIGHT,
            bottom: 0,
            ["--car-width" as string]: `${WIDTH}px`,
          }}
        >
          <Image
            src="/animations/lancer-evo.png"
            alt=""
            width={WIDTH}
            height={HEIGHT}
            priority
            unoptimized
            style={{ transform: "scaleX(-1)" }}
          />
        </span>
      )}
    </div>
  );
}

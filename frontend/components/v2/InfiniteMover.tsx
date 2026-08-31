import React from "react";

type InfiniteMoverProps = {
  children: React.ReactNode;
  /** LR: content travels left-to-right; RL: right-to-left. */
  move?: "LR" | "RL";
  /** Seconds for one full copy-width of travel. */
  duration?: number;
  style?: React.CSSProperties;
};

/**
 * CSS port of the Vrit Website Landing `InfiniteMover` (framer-motion
 * original). Five identical copies of `children` sit side by side in a
 * clipped flex row, and every copy translates exactly one copy-width per
 * cycle before snapping back — the snap is invisible because the copy that
 * slides into view is pixel-identical to the one that left. Five copies
 * (rather than the classic two) keep the viewport covered at any width.
 *
 * The container carries the `ab-inf-x` edge-fade mask from the same source
 * project, and hovering pauses the drift.
 */
export default function InfiniteMover({ children, move = "LR", duration = 40, style }: InfiniteMoverProps) {
  const animation = `${move === "LR" ? "abInfLR" : "abInfRL"} ${duration}s linear infinite`;
  return (
    <div className="ab-inf-x" style={{ position: "relative", display: "flex", overflow: "hidden", ...style }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          aria-hidden={i > 0}
          style={{
            flex: "0 0 auto",
            display: "flex",
            alignItems: "center",
            willChange: "transform",
            animation,
          }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

import type { ReactNode } from "react";
import type { PlatformFormat } from "@/types";

// Draws the true-dimension canvas (scaled to fit the viewport) and, optionally,
// a safe-area guide. Preview here == export source.
export function PlatformFrame({
  format,
  scale,
  showSafe,
  exportRef,
  children,
}: {
  format: PlatformFormat;
  scale: number;
  showSafe?: boolean;
  exportRef?: (el: HTMLDivElement | null) => void;
  children: ReactNode;
}) {
  return (
    <div
      style={{ width: format.width * scale, height: format.height * scale }}
      className="relative shrink-0"
    >
      <div
        style={{
          width: format.width,
          height: format.height,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
        className="absolute top-0 left-0"
      >
        <div
          ref={exportRef}
          data-export-node
          style={{ width: format.width, height: format.height }}
          className="relative overflow-hidden"
        >
          {children}
          {showSafe && (
            <div
              className="pointer-events-none absolute border border-dashed"
              style={{
                top: format.safeArea.top,
                left: format.safeArea.left,
                right: format.safeArea.right,
                bottom: format.safeArea.bottom,
                borderColor: "rgba(201,111,67,.7)",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

import type { ReactNode } from "react";

interface CRTEffectProps {
  children: ReactNode;
}

export default function CRTEffect({ children }: CRTEffectProps) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-50">
        <div className="absolute inset-0 bg-crt-overlay opacity-5"></div>
        <div className="absolute inset-0 scanlines"></div>
        <div className="absolute inset-0 vignette"></div>
      </div>
      <div className="relative z-10 crt-content">{children}</div>
    </div>
  );
}

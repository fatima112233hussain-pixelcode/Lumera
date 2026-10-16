"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const AuroraScene = dynamic(
  () => import("./aurora-scene").then((m) => m.AuroraScene),
  { ssr: false, loading: () => <AuroraFallback /> },
);

/** A CSS stand-in with the same palette, for no-WebGL and first paint. */
function AuroraFallback() {
  return (
    <div
      aria-hidden
      className="size-full"
      style={{
        background:
          "radial-gradient(55% 55% at 50% 42%, oklch(0.62 0.2 295 / 0.55), transparent 70%), radial-gradient(40% 40% at 66% 62%, oklch(0.8 0.15 75 / 0.3), transparent 70%)",
        filter: "blur(40px)",
      }}
    />
  );
}

export function AuroraBackdrop() {
  const [ok, setOk] = useState(true);
  return ok ? <AuroraScene onUnsupported={() => setOk(false)} /> : <AuroraFallback />;
}

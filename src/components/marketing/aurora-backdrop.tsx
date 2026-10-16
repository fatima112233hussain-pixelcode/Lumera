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
          "radial-gradient(60% 50% at 50% 45%, color-mix(in oklch, var(--primary) 38%, transparent), transparent 70%), radial-gradient(40% 40% at 70% 65%, color-mix(in oklch, var(--warning) 26%, transparent), transparent 70%)",
        filter: "blur(40px)",
      }}
    />
  );
}

export function AuroraBackdrop() {
  const [ok, setOk] = useState(true);
  return ok ? <AuroraScene onUnsupported={() => setOk(false)} /> : <AuroraFallback />;
}

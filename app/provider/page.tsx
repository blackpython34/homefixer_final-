import { Suspense } from 'react';
import ProviderDetail from "./ProviderClient";
import { Loader2 } from "lucide-react";

export default function Page() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center"
        style={{ background: "var(--background)" }}>
        <Loader2 className="w-9 h-9 animate-spin" style={{ color: "var(--brand)" }} />
      </div>
    }>
      <ProviderDetail />
    </Suspense>
  );
}
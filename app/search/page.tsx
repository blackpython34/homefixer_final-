import { Suspense } from "react";
import SearchClient from "./SearchClient";
import { Loader2 } from "lucide-react";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div
          className="h-screen flex flex-col items-center justify-center gap-4"
          style={{ background: "var(--background)" }}
        >
          <Loader2 className="w-9 h-9 animate-spin" style={{ color: "var(--brand)" }} />
          <span
            className="text-sm font-600"
            style={{ color: "var(--muted)" }}
          >
            Finding experts near you…
          </span>
        </div>
      }
    >
      <SearchClient />
    </Suspense>
  );
}
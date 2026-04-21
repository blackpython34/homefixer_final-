"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import Link from "next/link";
import {
  Search,
  MapPin,
  Star,
  ShieldCheck,
  Loader2,
  X,
  SlidersHorizontal,
} from "lucide-react";

const CATEGORIES = ["All", "Electrician", "Plumber", "Mechanic", "Tutor", "Tailor"];

const CATEGORY_COLORS: Record<string, { accent: string; bg: string; img: string }> = {
  Electrician: { accent: "#8B5A3C", bg: "#F0E4D8", img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=400" },
  Plumber: { accent: "#2D5A3D", bg: "#E8F0EB", img: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=400" },
  Mechanic: { accent: "#C8965A", bg: "#F5ECD8", img: "https://images.unsplash.com/photo-1530046339160-ce3e5b0c7a2f?q=80&w=400" },
  Tutor: { accent: "#3B7A57", bg: "#FAF6F0", img: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=400" },
  Tailor: { accent: "#A0714F", bg: "#F5EDE0", img: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=400" },
};

export default function SearchClient() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialQ = searchParams.get("q") || "";

  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQ);
  const [isNearestFirst, setIsNearestFirst] = useState(false);

  // UPGRADE: Handle geolocation timeout to prevent infinite loading
  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      const timer = setTimeout(() => {
        if (loading) {
          console.warn("Location request timed out. Loading data anyway...");
          setLoading(false);
        }
      }, 5000); // 5 second timeout

      navigator.geolocation.getCurrentPosition(
        () => {
          clearTimeout(timer);
          setLoading(false);
        },
        () => {
          clearTimeout(timer);
          setLoading(false);
        },
        { timeout: 5000 }
      );

      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialCategory) setFilter(initialCategory);
    if (initialQ) setSearchQuery(initialQ);
  }, [initialCategory, initialQ]);

  useEffect(() => {
    // Keep loading true while fetching data
    const providersRef = collection(db, "providers");
    const q =
      filter === "All"
        ? query(providersRef)
        : query(providersRef, where("category", "==", filter));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const docData = doc.data();
          const hash = doc.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          const distance = (hash % 15) + 1 + ((hash % 10) / 10);
          return { id: doc.id, distance, ...docData };
        });
        setProviders(data);
        // Data has arrived, but geolocation logic above also controls the spinner
      },
      (error) => {
        console.error("Firestore Error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [filter]);

  const displayedProviders = useMemo(() => {
    let result = providers;
    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.category?.toLowerCase().includes(term) ||
          p.subCategory?.toLowerCase().includes(term) ||
          p.address?.toLowerCase().includes(term)
      );
    }

    if (isNearestFirst) {
      result = [...result].sort((a, b) => a.distance - b.distance);
    }

    return result;
  }, [searchQuery, providers, isNearestFirst]);

  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>
      {/* ─── Search Header ─── */}
      <div
        style={{
          background: "linear-gradient(160deg, var(--brand-light) 0%, var(--background) 100%)",
          borderBottom: "1px solid var(--border)",
        }}
        className="py-10"
      >
        <div className="container mx-auto px-5 max-w-6xl">
          <p className="section-label">
            <span className="w-4 h-px inline-block" style={{ background: "var(--brand)" }} />
            Find Professionals
          </p>
          <h1
            className="text-3xl font-800 tracking-tight mb-6"
            style={{ color: "var(--foreground)", fontFamily: "'Playfair Display', serif" }}
          >
            Verified experts in Durgapur
          </h1>

          {/* Search Bar */}
          <div
            className="flex items-center overflow-hidden max-w-2xl"
            style={{
              background: "var(--surface)",
              border: "1.5px solid var(--border)",
              boxShadow: "var(--shadow-card)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <Search
              size={18}
              className="ml-5 shrink-0"
              style={{ color: "var(--muted)" }}
            />
            <input
              type="text"
              id="search-input"
              placeholder="Search by name, category or area…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 py-4 px-4 text-sm outline-none"
              style={{
                background: "transparent",
                color: "var(--foreground)",
                fontWeight: 500,
                fontFamily: "inherit",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mr-4 p-1 rounded-lg transition-colors"
                style={{ color: "var(--muted)" }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-5 max-w-6xl py-8">
        {/* Category Chips */}
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              id={`filter-${cat.toLowerCase()}`}
              onClick={() => {
                setFilter(cat);
                setSearchQuery("");
              }}
              className={`filter-chip ${filter === cat ? "active" : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Bar */}
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: "var(--brand)" }}
            />
            <span className="text-sm font-600" style={{ color: "var(--muted)" }}>
              {displayedProviders.length} professional
              {displayedProviders.length !== 1 ? "s" : ""} found
            </span>
          </div>
          <button 
            onClick={() => setIsNearestFirst(!isNearestFirst)}
            className="flex items-center gap-2 text-sm transition-colors duration-200" 
            style={{ 
              color: isNearestFirst ? "var(--brand)" : "var(--muted)",
              background: isNearestFirst ? "var(--brand-light)" : "transparent",
              padding: "6px 12px",
              borderRadius: "var(--radius-full)",
              border: isNearestFirst ? "1px solid var(--brand)" : "1px solid transparent"
            }}
          >
            <SlidersHorizontal size={14} />
            <span className="font-600">Nearest first</span>
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2
              className="animate-spin"
              size={36}
              style={{ color: "var(--brand)" }}
            />
            <span className="text-sm font-600" style={{ color: "var(--muted)" }}>
              Finding experts near you…
            </span>
          </div>
        ) : displayedProviders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProviders.map((p, i) => {
              const colors = CATEGORY_COLORS[p.category] || {
                accent: "var(--brand)",
                bg: "var(--brand-light)",
                img: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=400"
              };

              // UPGRADE: Fallback for images to avoid broken links
              const imageUrl = p.image?.includes("via.placeholder") || !p.image
                ? colors.img
                : p.image;

              return (
                <Link
                  href={`/provider?id=${p.id}`}
                  key={p.id}
                  className="provider-card group animate-fadeUp reveal card-shimmer"
                  style={{ 
                    animationDelay: `${i * 0.05}s`,
                    borderRadius: "var(--radius-xl)",
                    boxShadow: "var(--shadow-card)",
                    border: "1.5px solid var(--border)",
                  }}
                >
                  {/* Image */}
                  <div
                    className="relative overflow-hidden"
                    style={{ aspectRatio: "4/3", background: colors.bg }}
                  >
                    <img
                      src={imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = colors.img;
                      }}
                    />

                    {/* Category pill */}
                    <div
                      className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-800 uppercase tracking-wider"
                      style={{ background: colors.bg, color: colors.accent, border: `1px solid ${colors.accent}22` }}
                    >
                      {p.category}
                    </div>

                    {/* Online badge */}
                    {p.isOnline && (
                      <div
                        className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-700 flex items-center gap-1.5"
                        style={{ background: "rgba(255,255,255,0.9)", color: "var(--brand)", backdropFilter: "blur(4px)" }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-mid animate-pulse" />
                        Available
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-start justify-between mb-1">
                      <h3
                        className="text-base font-700"
                        style={{ color: "var(--foreground)", fontFamily: "'Playfair Display', serif" }}
                      >
                        {p.name}
                      </h3>
                      <div
                        className="flex items-center gap-1 text-sm font-700 shrink-0 ml-2"
                        style={{ color: "var(--gold)" }}
                      >
                        <Star size={13} fill="currentColor" />
                        {p.rating || "5.0"}
                      </div>
                    </div>

                    <p
                      className="text-xs font-600 mb-4"
                      style={{ color: colors.accent }}
                    >
                      {p.subCategory || p.category}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-4"
                      style={{ borderTop: "1px solid var(--border)" }}>
                      <div
                        className="flex items-center gap-1.5 text-xs font-500"
                        style={{ color: "var(--muted)" }}
                      >
                        <MapPin size={12} style={{ color: "var(--brand)" }} />
                        <span className="truncate max-w-[120px]">{p.address || "Durgapur"}</span>
                        <span>•</span>
                        <span style={{ color: "var(--foreground)", fontWeight: 600 }}>{p.distance?.toFixed(1)} km</span>
                      </div>
                      <div className="flex items-center gap-1" style={{ color: "var(--muted)" }}>
                        <ShieldCheck size={13} style={{ color: "var(--success)" }} />
                        <span className="text-[10px] font-600">Verified</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div
            className="py-32 flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
          >
            <Search size={36} style={{ color: "var(--muted)", opacity: 0.5 }} />
            <p className="text-sm font-600" style={{ color: "var(--muted)" }}>
              No professionals found for "{searchQuery || filter}"
            </p>
            <button
              className="btn-outline text-sm py-2"
              onClick={() => { setFilter("All"); setSearchQuery(""); }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
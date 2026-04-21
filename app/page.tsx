"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search, Cpu, Droplets, Wrench, BookOpen, Scissors,
  ShieldCheck, Star, Clock, ArrowRight, ChevronRight,
  Zap, CheckCircle, MapPin, Users, ThumbsUp, Award,
} from "lucide-react";

/* ─── DATA ARRAYS (PRESERVED) ──────────────────────────── */

const CATEGORIES = [
  {
    name: "Electrician",
    Icon: Cpu,
    description: "Wiring, fixtures & repairs",
    accent: "#d97706",
    bg: "#fffbeb",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Plumber",
    Icon: Droplets,
    description: "Pipes, leaks & drainage",
    accent: "#2563eb",
    bg: "#eff6ff",
    image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Mechanic",
    Icon: Wrench,
    description: "Two & four-wheeler service",
    accent: "#ea580c",
    bg: "#fff7ed",
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Tutor",
    Icon: BookOpen,
    description: "Home tuition, all grades",
    accent: "#7c3aed",
    bg: "#f5f3ff",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Tailor",
    Icon: Scissors,
    description: "Alterations & custom stitching",
    accent: "#db2777",
    bg: "#fdf2f8",
    image: "https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?q=80&w=600&auto=format&fit=crop",
  },
];

const HERO_FLOATS = [
  { label: "Verified Experts", stat: "100+", img: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=300", floatClass: "float-a" },
  { label: "Booked Monthly", stat: "2,000+", img: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=300", floatClass: "float-b" },
  { label: "Customer Rating", stat: "4.9/5", img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=300", floatClass: "float-c" },
];

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "Verified Professionals", description: "Background-checked & ID verified experts" },
  { icon: Star,        label: "Top-Rated Only",          description: "Avg. 4.8★ across all services" },
  { icon: Clock,       label: "On-Time Guarantee",       description: "Punctuality or a free reschedule" },
  { icon: Zap,         label: "Instant Booking",         description: "Confirm a slot in under 60 seconds" },
];

const HOW_IT_WORKS = [
  {
    step: "01", title: "Search a Service",
    desc: "Describe what you need or tap a category to browse verified professionals instantly.",
    img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=400&auto=format&fit=crop",
  },
  {
    step: "02", title: "Pick a Professional",
    desc: "Compare profiles, ratings, reviews, and pricing — then choose the best fit.",
    img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=400&auto=format&fit=crop",
  },
  {
    step: "03", title: "Book & Relax",
    desc: "Confirm your slot with one tap. We handle the rest — guaranteed satisfaction.",
    img: "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?q=80&w=400&auto=format&fit=crop",
  },
];

const STATS = [
  { icon: Users,    value: "2,000+", label: "Happy Customers" },
  { icon: Award,    value: "100+",   label: "Verified Experts" },
  { icon: ThumbsUp, value: "4.9★",   label: "Average Rating" },
  { icon: MapPin,   value: "10+",    label: "Areas Covered" },
];

/* ─── COMPONENT ────────────────────────────────────────── */

export default function HomePage() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div style={{ background: "#FAF6F0" }}>

      {/* ═══════════════════════════════════════
          HERO — Diagonal Split Layout (3D feel)
      ═══════════════════════════════════════ */}
      <section
        data-hero=""
        style={{
          minHeight: "94vh",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          position: "relative",
          overflow: "hidden",
          background: "#FAF6F0",
        }}
      >
        {/* ── LEFT PANEL: Forest green with text ── */}
        <div
          style={{
            background: "linear-gradient(160deg, #1C2B1F 0%, #2D5A3D 60%, #1A3326 100%)",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "clamp(2.5rem, 6vw, 6rem) clamp(2rem, 5vw, 5rem)",
            zIndex: 2,
            // Diagonal right edge
            clipPath: "polygon(0 0, 92% 0, 100% 100%, 0 100%)",
            paddingRight: "clamp(3rem, 8vw, 8rem)",
          }}
        >
          {/* Noise texture overlay */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
            mixBlendMode: "overlay",
          }} />

          {/* Radial glow */}
          <div style={{
            position: "absolute", top: "20%", left: "10%",
            width: 500, height: 500,
            background: "radial-gradient(ellipse, rgba(74,144,104,0.25) 0%, transparent 70%)",
            pointerEvents: "none", zIndex: 0,
          }} />

          {/* Content */}
          <div style={{ position: "relative", zIndex: 2 }}>

            {/* Live pill */}
            <div
              className="animate-fadeUp"
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.625rem",
                padding: "0.5rem 1.125rem",
                borderRadius: "999px",
                background: "rgba(200,150,90,0.18)",
                border: "1px solid rgba(200,150,90,0.4)",
                marginBottom: "1.75rem",
                backdropFilter: "blur(8px)",
              }}
            >
              <span style={{ position: "relative", display: "inline-flex", width: 8, height: 8 }}>
                <span className="animate-ping" style={{
                  position: "absolute", inset: 0, borderRadius: "50%",
                  background: "#C8965A", opacity: 0.7,
                }} />
                <span style={{
                  position: "relative", width: 8, height: 8, borderRadius: "50%",
                  background: "#C8965A", display: "inline-block",
                }} />
              </span>
              <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#E8D5B7", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Durgapur's Most Trusted Platform
              </span>
            </div>

            {/* Headline */}
            <h1
              className="animate-fadeUp stagger-1"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(2.8rem, 4.5vw, 4.8rem)",
                fontWeight: 800,
                lineHeight: 1.05,
                color: "#FAF6F0",
                marginBottom: "1.5rem",
                letterSpacing: "-0.02em",
              }}
            >
              Expert home<br />
              services,{" "}
              <span
                className="text-shimmer"
                style={{ display: "inline-block" }}
              >
                at your door.
              </span>
            </h1>

            {/* Body copy */}
            <p
              className="animate-fadeUp stagger-2"
              style={{
                fontSize: "1rem",
                lineHeight: 1.85,
                color: "rgba(232,213,183,0.80)",
                maxWidth: 420,
                marginBottom: "2.5rem",
                fontWeight: 300,
              }}
            >
              Book trusted electricians, plumbers, mechanics, tutors, and tailors
              across Durgapur — vetted, rated, and ready when you are.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="animate-fadeUp stagger-3" style={{ maxWidth: 480, marginBottom: "2rem" }}>
              <div style={{
                display: "flex", alignItems: "center",
                background: "rgba(250,246,240,0.10)",
                border: "1.5px solid rgba(212,196,176,0.30)",
                borderRadius: "var(--radius-xl, 2.75rem)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 8px 40px rgba(15,26,18,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
                overflow: "hidden",
              }}>
                <Search size={18} style={{ marginLeft: "1.25rem", color: "rgba(232,213,183,0.6)", flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="What do you need help with?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{
                    flex: 1, padding: "1rem 0.875rem",
                    background: "transparent",
                    color: "#FAF6F0",
                    fontSize: "0.92rem",
                    fontWeight: 400,
                    outline: "none",
                    border: "none",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    margin: "0.375rem",
                    padding: "0.7rem 1.375rem",
                    background: "linear-gradient(135deg, #C8965A, #A0714F)",
                    color: "#FAF6F0",
                    border: "none",
                    borderRadius: "2rem",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "0.4rem",
                    boxShadow: "0 4px 16px rgba(200,150,90,0.40)",
                    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    whiteSpace: "nowrap",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "scale(1.04)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(200,150,90,0.55)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(200,150,90,0.40)";
                  }}
                >
                  Search <ArrowRight size={14} />
                </button>
              </div>
            </form>

            {/* Quick tags */}
            <div className="animate-fadeUp stagger-4" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "rgba(232,213,183,0.55)" }}>Quick:</span>
              {["Electrician", "Plumber", "Tutor", "Mechanic", "Tailor"].map((tag) => (
                <Link
                  key={tag}
                  href={`/search?category=${tag}`}
                  style={{
                    fontSize: "0.75rem", fontWeight: 600,
                    padding: "0.35rem 0.875rem",
                    borderRadius: "999px",
                    border: "1px solid rgba(212,196,176,0.28)",
                    color: "rgba(232,213,183,0.78)",
                    background: "rgba(250,246,240,0.06)",
                    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "#C8965A";
                    el.style.color = "#E8D5B7";
                    el.style.background = "rgba(200,150,90,0.18)";
                    el.style.transform = "translateY(-2px) scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "rgba(212,196,176,0.28)";
                    el.style.color = "rgba(232,213,183,0.78)";
                    el.style.background = "rgba(250,246,240,0.06)";
                    el.style.transform = "translateY(0) scale(1)";
                  }}
                >
                  {tag}
                </Link>
              ))}
            </div>

            {/* Social proof */}
            <div className="animate-fadeUp stagger-5" style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginTop: "2.5rem" }}>
              <div style={{ display: "flex", marginLeft: 0 }}>
                {["1","12","23","34","45"].map((n, i) => (
                  <img
                    key={n}
                    src={`https://i.pravatar.cc/40?img=${n}`}
                    alt=""
                    style={{
                      width: 34, height: 34, borderRadius: "50%", objectFit: "cover",
                      border: "2.5px solid rgba(200,150,90,0.5)",
                      marginLeft: i === 0 ? 0 : -10,
                    }}
                  />
                ))}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  {[1,2,3,4,5].map((s) => <Star key={s} size={12} fill="#C8965A" style={{ color: "#C8965A" }} />)}
                  <span style={{ marginLeft: 4, fontSize: "0.85rem", fontWeight: 800, color: "#FAF6F0" }}>4.9 / 5</span>
                </div>
                <p style={{ fontSize: "0.72rem", marginTop: 2, color: "rgba(232,213,183,0.6)" }}>
                  Trusted by 2,000+ families
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL: Organic leaves / service imagery ── */}
        <div
          style={{
            position: "relative",
            background: "linear-gradient(145deg, #8B5A3C 0%, #A0714F 30%, #6B4226 70%, #4A2E18 100%)",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Decorative leaf shapes using border-radius */}
          <div style={{
            position: "absolute", top: "-8%", right: "-5%",
            width: 320, height: 480,
            background: "linear-gradient(135deg, #3B7A57, #2D5A3D)",
            borderRadius: "60% 40% 55% 45% / 45% 55% 40% 60%",
            transform: "rotate(-15deg)",
            boxShadow: "inset 0 -20px 40px rgba(0,0,0,0.2), 0 20px 60px rgba(0,0,0,0.35)",
            zIndex: 1,
          }} />
          <div style={{
            position: "absolute", bottom: "-10%", right: "10%",
            width: 260, height: 400,
            background: "linear-gradient(135deg, #8B7355, #C8A882)",
            borderRadius: "45% 55% 50% 50% / 55% 45% 60% 40%",
            transform: "rotate(8deg)",
            boxShadow: "inset 0 -15px 30px rgba(0,0,0,0.15), 0 20px 50px rgba(0,0,0,0.3)",
            zIndex: 2,
          }} />
          <div style={{
            position: "absolute", top: "20%", left: "5%",
            width: 200, height: 320,
            background: "linear-gradient(135deg, #4A9068, #3B7A57)",
            borderRadius: "50% 50% 45% 55% / 40% 60% 50% 50%",
            transform: "rotate(20deg)",
            boxShadow: "inset 0 -10px 25px rgba(0,0,0,0.2), 0 15px 40px rgba(0,0,0,0.3)",
            zIndex: 3,
          }} />

          {/* Floating service cards — KEEP HERO_FLOATS data, new visual style */}
          {HERO_FLOATS.slice(0, 3).map((card, i) => (
            <div
              key={card.label}
              className={card.floatClass}
              style={{
                position: "absolute",
                ...(i === 0 ? { top: "8%", right: "8%", width: 150 }
                  : i === 1 ? { top: "42%", left: "12%", width: 140 }
                  : { bottom: "10%", right: "15%", width: 145 }),
                zIndex: 10,
                borderRadius: "var(--radius-lg, 2rem)",
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(15,26,18,0.55), 0 4px 16px rgba(0,0,0,0.3)",
                border: "2px solid rgba(232,213,183,0.2)",
              }}
            >
              <img src={card.img} alt={card.label} style={{ width: "100%", height: 90, objectFit: "cover", display: "block" }} />
              <div style={{
                padding: "0.5rem 0.75rem",
                background: "rgba(28,43,31,0.88)",
                backdropFilter: "blur(16px)",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#FAF6F0" }}>{card.label}</span>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#C8965A" }}>{card.stat}</span>
              </div>
            </div>
          ))}

          {/* Central stats badge */}
          <div style={{
            position: "relative", zIndex: 10,
            background: "linear-gradient(135deg, rgba(45,90,61,0.95), rgba(59,122,87,0.90))",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(200,150,90,0.30)",
            borderRadius: "var(--radius-xl, 2.75rem)",
            padding: "1.75rem 2rem",
            textAlign: "center",
            minWidth: 180,
            boxShadow: "0 25px 70px rgba(15,26,18,0.55), inset 0 1px 0 rgba(255,255,255,0.10)",
          }}>
            <p style={{ fontSize: "2.5rem", fontWeight: 900, color: "#FAF6F0", lineHeight: 1, fontFamily: "'Playfair Display', serif" }}>100+</p>
            <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "rgba(232,213,183,0.85)", marginTop: 4 }}>Verified Experts</p>
            <p style={{ fontSize: "0.7rem", color: "rgba(232,213,183,0.55)", marginTop: 2 }}>across Durgapur</p>
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              marginTop: "0.875rem", paddingTop: "0.875rem",
              borderTop: "1px solid rgba(200,150,90,0.25)",
              justifyContent: "center",
            }}>
              <CheckCircle size={12} style={{ color: "#C8965A" }} />
              <span style={{ fontSize: "0.68rem", fontWeight: 600, color: "rgba(232,213,183,0.75)" }}>All Background Checked</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          STATS BAR
      ═══════════════════════════════════════ */}
      <section style={{
        background: "linear-gradient(90deg, #1E3D29 0%, #2D5A3D 50%, #1E3D29 100%)",
        borderTop: "1px solid rgba(200,150,90,0.2)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: "linear-gradient(90deg, transparent, #C8965A 30%, #3B7A57 50%, #C8965A 70%, transparent)",
        }} />
        <div className="container mx-auto px-6 max-w-6xl py-8" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1.5rem", textAlign: "center" }}>
            {STATS.map(({ icon: Icon, value, label }, i) => (
              <div
                key={label}
                className={`animate-fadeUp stagger-${i + 1}`}
                style={{ color: "#FAF6F0", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: "14px",
                  background: "rgba(200,150,90,0.15)",
                  border: "1px solid rgba(200,150,90,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 4,
                }}>
                  <Icon size={20} style={{ color: "#C8965A" }} />
                </div>
                <p style={{ fontSize: "1.75rem", fontWeight: 900, lineHeight: 1, fontFamily: "'Playfair Display', serif" }}>{value}</p>
                <p style={{ fontSize: "0.72rem", fontWeight: 500, opacity: 0.7, letterSpacing: "0.04em" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TRUST — Faceted Gem Tile Panel
      ═══════════════════════════════════════ */}
      <section style={{ background: "var(--background)", padding: "4rem 1.5rem" }}>
        <div className="container mx-auto max-w-6xl">
          <div
            style={{
              background: "linear-gradient(150deg, #2D5A3D 0%, #234830 40%, #1C3D2A 70%, #2D5A3D 100%)",
              borderRadius: "var(--radius-xl, 2.75rem)",
              padding: "0",
              overflow: "hidden",
              position: "relative",
              boxShadow: `
                0 2px 0 rgba(255,255,255,0.07) inset,
                0 -2px 0 rgba(0,0,0,0.25) inset,
                0 30px 80px rgba(15,26,18,0.35),
                0 8px 24px rgba(15,26,18,0.20),
                0 1px 0 rgba(200,150,90,0.15)
              `,
              border: "1px solid rgba(200,150,90,0.15)",
            }}
          >
            <div style={{
              position: "absolute", top: 0, left: "10%", right: "10%", height: 1,
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
              zIndex: 2,
            }} />
            <div style={{
              position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
              mixBlendMode: "overlay",
              borderRadius: "inherit",
            }} />
            <div className="gem-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              position: "relative", zIndex: 2,
            }}>
              {TRUST_ITEMS.map(({ icon: Icon, label, description }, i) => (
                <div
                  key={label}
                  style={{
                    padding: "2.5rem 1.75rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    gap: "0.875rem",
                    position: "relative",
                    transition: "background 0.35s ease",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(74,144,104,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  {i < 3 && (
                    <div style={{
                      position: "absolute",
                      top: "12%", bottom: "12%",
                      right: 0,
                      width: 1,
                      background: "linear-gradient(180deg, transparent 0%, rgba(200,150,90,0.2) 30%, rgba(200,150,90,0.35) 50%, rgba(200,150,90,0.2) 70%, transparent 100%)",
                      transform: "skewX(-8deg)",
                    }} />
                  )}

                  <div style={{
                    width: 56, height: 56,
                    borderRadius: "50%",
                    border: "1.5px solid rgba(200,150,90,0.35)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "rgba(200,150,90,0.08)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.12)",
                    transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    flexShrink: 0,
                  }}>
                    <Icon size={22} style={{ color: "#C8965A", strokeWidth: 1.5 }} />
                  </div>

                  <div>
                    <p style={{
                      fontSize: "0.88rem", fontWeight: 700,
                      color: "#FAF6F0",
                      fontFamily: "'DM Sans', sans-serif",
                      marginBottom: "0.4rem",
                      letterSpacing: "0.01em",
                    }}>{label}</p>
                    <p style={{
                      fontSize: "0.75rem",
                      color: "rgba(232,213,183,0.60)",
                      lineHeight: 1.65,
                      fontWeight: 300,
                    }}>{description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: 6,
              background: "rgba(0,0,0,0.20)",
              zIndex: 3,
            }} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CATEGORIES — 3D Floating Tile Grid
      ═══════════════════════════════════════ */}
      <section
        style={{
          background: "var(--surface)",
          padding: "5rem 1.5rem 6rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="blob" style={{
          position: "absolute", top: "-5%", right: "-3%",
          width: 350, height: 350,
          background: "radial-gradient(ellipse, rgba(45,90,61,0.07) 0%, transparent 70%)",
          pointerEvents: "none", zIndex: 0,
        }} />
        <div className="blob" style={{
          position: "absolute", bottom: "-8%", left: "-5%",
          width: 300, height: 300,
          background: "radial-gradient(ellipse, rgba(200,150,90,0.06) 0%, transparent 70%)",
          pointerEvents: "none", zIndex: 0, animationDelay: "4s",
        }} />

        <div className="container mx-auto max-w-6xl" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "3rem" }}>
            <div>
              <p className="section-label">
                <span style={{ width: 20, height: 2, background: "var(--brand)", display: "inline-block", borderRadius: 2 }} />
                Browse Services
              </p>
              <h2 style={{
                fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800,
                color: "var(--foreground)",
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
              }}>
                What do you need today?
              </h2>
            </div>
            <Link href="/search" className="hidden md:flex" style={{
              alignItems: "center", gap: 4,
              fontSize: "0.85rem", fontWeight: 600,
              color: "var(--brand)",
              textDecoration: "none",
              transition: "gap 0.3s ease",
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.gap = "8px"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.gap = "4px"; }}
            >
              View all <ChevronRight size={16} />
            </Link>
          </div>

          <div className="tile-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "auto auto",
            gap: "1.25rem",
          }}>
            {CATEGORIES.map((cat, i) => {
              const tileColors = [
                { bg: "linear-gradient(145deg, #3B6E4A, #2D5A3D)", iconBg: "rgba(255,255,255,0.15)", text: "#FAF6F0", sub: "rgba(232,213,183,0.7)" },
                { bg: "linear-gradient(145deg, #8B5A3C, #6B4226)", iconBg: "rgba(255,255,255,0.12)", text: "#FAF6F0", sub: "rgba(232,213,183,0.7)" },
                { bg: "linear-gradient(145deg, #A08060, #8B6A4A)", iconBg: "rgba(255,255,255,0.15)", text: "#FAF6F0", sub: "rgba(232,213,183,0.75)" },
                { bg: "linear-gradient(145deg, #2D5A3D, #1E3D29)", iconBg: "rgba(200,150,90,0.20)", text: "#FAF6F0", sub: "rgba(232,213,183,0.7)" },
                { bg: "linear-gradient(145deg, #6B4226, #8B5A3C)", iconBg: "rgba(255,255,255,0.12)", text: "#FAF6F0", sub: "rgba(232,213,183,0.7)" },
              ];
              const colors = tileColors[i % tileColors.length];

              return (
                <Link
                  key={cat.name}
                  href={`/search?category=${cat.name}`}
                  className={`animate-fadeUp stagger-${Math.min(i + 1, 5)} tile-3d tile-grid-item`}
                  data-idx={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textDecoration: "none",
                    padding: "2.5rem 1.5rem 2rem",
                    borderRadius: "28px",
                    background: colors.bg,
                    position: "relative",
                    overflow: "hidden",
                    minHeight: 220,
                    cursor: "pointer",
                    boxShadow: `
                      0 2px 0 rgba(255,255,255,0.10) inset,
                      0 -3px 0 rgba(0,0,0,0.20) inset,
                      0 20px 50px rgba(15,26,18,0.25),
                      0 6px 18px rgba(15,26,18,0.18),
                      0 1px 0 rgba(0,0,0,0.12)
                    `,
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div style={{
                    position: "absolute", top: 0, left: "-30%", width: "50%", height: "100%",
                    background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)",
                    pointerEvents: "none",
                  }} className="tile-shine" />
                  <div style={{
                    position: "absolute", top: 0, left: "15%", right: "15%", height: 1,
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                  }} />
                  <div style={{
                    position: "absolute", inset: 0,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='150' height='150' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
                    pointerEvents: "none", mixBlendMode: "overlay",
                  }} />

                  <div style={{
                    width: 72, height: 72,
                    borderRadius: "22px",
                    background: colors.iconBg,
                    border: "1px solid rgba(255,255,255,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "1.125rem",
                    position: "relative", zIndex: 2,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.20)",
                  }}>
                    <cat.Icon size={30} style={{ color: colors.text, strokeWidth: 1.4, filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.35))" }} />
                  </div>

                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "1rem", fontWeight: 700,
                    color: colors.text,
                    textAlign: "center", zIndex: 2, position: "relative",
                    marginBottom: "0.35rem",
                    letterSpacing: "-0.01em",
                  }}>{cat.name}</p>
                  <p style={{
                    fontSize: "0.75rem", fontWeight: 400,
                    color: colors.sub,
                    textAlign: "center", zIndex: 2, position: "relative",
                    lineHeight: 1.5,
                  }}>{cat.description}</p>

                  <div style={{
                    position: "absolute", bottom: "1rem", right: "1rem",
                    width: 28, height: 28, borderRadius: "50%",
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    zIndex: 2,
                  }}>
                    <ChevronRight size={14} style={{ color: "rgba(255,255,255,0.7)" }} />
                  </div>
                </Link>
              );
            })}

            <Link
              href="/search"
              className="animate-fadeUp stagger-5"
              style={{
                display: "block",
                borderRadius: "28px",
                overflow: "hidden",
                position: "relative",
                minHeight: 220,
                cursor: "pointer",
                gridColumn: "3 / 4",
                gridRow: "2 / 3",
                boxShadow: "0 20px 50px rgba(15,26,18,0.25), 0 6px 18px rgba(15,26,18,0.18)",
                border: "1px solid rgba(255,255,255,0.08)",
                textDecoration: "none",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=600&auto=format&fit=crop"
                alt="View all services"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(28,43,31,0.88) 0%, rgba(28,43,31,0.30) 60%, transparent 100%)",
                display: "flex", alignItems: "flex-end", padding: "1.5rem",
              }}>
                <div>
                  <p style={{ fontSize: "1rem", fontWeight: 700, color: "#FAF6F0", marginBottom: 2 }}>View All Services</p>
                  <p style={{ fontSize: "0.75rem", color: "rgba(232,213,183,0.75)", display: "flex", alignItems: "center", gap: 4 }}>
                    Explore more <ChevronRight size={12} />
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS — Diagonal Connecting Line
      ═══════════════════════════════════════ */}
      <section style={{ background: "var(--background)", padding: "5rem 0 6rem", overflow: "hidden" }}>
        <div className="container mx-auto px-6 max-w-6xl" style={{ marginBottom: "2.5rem" }}>
          <div style={{ textAlign: "center" }}>
            <p className="section-label" style={{ justifyContent: "center" }}>
              <span style={{ width: 16, height: 2, background: "var(--brand)", display: "inline-block", borderRadius: 2 }} />
              Simple Process
            </p>
            <h2 style={{
              fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
              fontFamily: "'Playfair Display', serif",
              fontWeight: 800,
              color: "var(--foreground)",
              letterSpacing: "-0.02em",
            }}>
              Book a service in 3 easy steps
            </h2>
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <div style={{
            position: "absolute",
            top: "8.5rem", left: "calc(50% - 380px)", right: "calc(50% - 380px)",
            height: 2,
            background: "linear-gradient(90deg, transparent, var(--brand-mid) 10%, var(--gold) 50%, var(--brand-mid) 90%, transparent)",
            zIndex: 0,
          }} />

          <div className="container mx-auto px-6 max-w-5xl">
            <div className="how-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem", position: "relative", zIndex: 1 }}>
              {HOW_IT_WORKS.map((step, i) => (
                <div
                  key={step.step}
                  className={`animate-fadeUp stagger-${i + 1}`}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
                >
                  <div style={{
                    width: 56, height: 56,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #2D5A3D, #3B7A57)",
                    color: "#FAF6F0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1rem", fontWeight: 800,
                    fontFamily: "'Playfair Display', serif",
                    boxShadow: "0 6px 24px rgba(45,90,61,0.40), inset 0 1px 0 rgba(255,255,255,0.20)",
                    border: "3px solid var(--background)",
                    marginBottom: "1.5rem",
                    zIndex: 2, position: "relative",
                    flexShrink: 0,
                  }}>
                    {step.step}
                  </div>

                  <div className="card-organic" style={{
                    width: "100%",
                    borderRadius: "var(--radius-xl)",
                    overflow: "hidden",
                    marginBottom: "1.25rem",
                    boxShadow: "var(--shadow-card)",
                    border: "1.5px solid var(--border)",
                  }}>
                    <img src={step.img} alt={step.title} style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
                  </div>

                  <h3 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.1rem", fontWeight: 700,
                    color: "var(--foreground)", marginBottom: "0.5rem",
                  }}>{step.title}</h3>
                  <p style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.7, fontWeight: 300 }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "3.5rem" }}>
          <Link href="/search" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            Book a Service Now <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PARTNER CTA — Diagonal Accent
      ═══════════════════════════════════════ */}
      <section style={{
        background: "var(--background)",
        padding: "0 1.5rem 5rem",
        position: "relative",
      }}>
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="rounded-[4rem] overflow-hidden relative" style={{ minHeight: 480 }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 4,
              background: "linear-gradient(90deg, var(--brand-mid), var(--gold), var(--brand-mid))",
              borderRadius: "2rem 2rem 0 0",
              zIndex: 20,
            }} />

            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1200"
              alt="professionals"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(15,26,18,0.95) 0%, rgba(45,90,61,0.85) 100%)" }} />

            <div className="relative z-10 p-12 lg:p-24 flex flex-col items-center text-center">
              <p className="text-gold font-700 text-xs tracking-[0.3em] uppercase mb-6 reveal">Collaboration</p>
              <h2 className="text-4xl md:text-5xl tracking-tight text-white mb-8 reveal" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800 }}>
                Elevate your talent. <br />Join the elite.
              </h2>
              <p className="mb-12 max-w-xl mx-auto leading-relaxed text-white/60 reveal">
                Become part of Durgapur's most prestigious service network.
                We connect top-tier professionals with high-end customer demand.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center reveal">
                <Link href="/register-partner"
                  className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full font-800 text-sm transition-all shadow-2xl hover:scale-105"
                  style={{ background: "#C8965A", color: "#FAF6F0" }}>
                  Apply as Partner <ArrowRight size={16} />
                </Link>
                <Link href="/partner-login"
                  className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full font-700 text-sm border-white/20 border text-white transition-all hover:bg-white/10">
                  Partner Access
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
"use client";

import { ShieldCheck, Target, Award, ArrowRight, Users, Star, Zap, MapPin, HeartHandshake } from "lucide-react";
import Link from "next/link";

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Trust & Verification",
    desc: "Every professional undergoes rigorous background checks before being listed. Your safety is our absolute priority.",
    color: "#2D5A3D",
  },
  {
    icon: Target,
    title: "Hyper-local Focus",
    desc: "Exclusively focused on Durgapur—built by locals, for locals. We understand the specific needs of our city.",
    color: "#8B5A3C",
  },
  {
    icon: Award,
    title: "Quality First",
    desc: "We measure partner performance continuously. Only the top-rated professionals maintain their active status.",
    color: "#A08060",
  },
  {
    icon: Zap,
    title: "Instant Booking",
    desc: "Confirm a verified professional in under 60 seconds. We've eliminated the friction of finding help.",
    color: "#3B6E4A",
  },
];

const STATS = [
  { value: "500+", label: "Service Bookings" },
  { value: "100+", label: "Verified Partners" },
  { value: "4.8★", label: "Average Rating" },
  { value: "10+", label: "Service Areas" },
];

export default function AboutPage() {
  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>
      
      {/* ── HERO: Forest Green Diagonal Split ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #1C2B1F 0%, #2D5A3D 60%, #1A3326 100%)",
          minHeight: "65vh",
          display: "flex",
          alignItems: "center",
          clipPath: "polygon(0 0, 100% 0, 100% 90%, 0 100%)",
          paddingBottom: "8rem",
        }}
      >
        {/* Noise overlay */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }} />

        {/* Decorative Blooms */}
        <div style={{
          position: "absolute", top: "-10%", right: "-5%",
          width: 400, height: 400,
          background: "radial-gradient(ellipse, rgba(200,150,90,0.15) 0%, transparent 60%)",
          pointerEvents: "none", zIndex: 0,
        }} />
        
        <div className="container mx-auto px-6 max-w-4xl text-center relative z-10 pt-20">
          <div
            className="animate-fadeUp inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-700 mb-8"
            style={{ background: "rgba(200,150,90,0.15)", border: "1px solid rgba(200,150,90,0.3)", color: "#E8D5B7", backdropFilter: "blur(8px)" }}
          >
            <MapPin size={14} style={{ color: "#C8965A" }} /> Proudly Built in Durgapur
          </div>
          
          <h1
            className="animate-fadeUp stagger-1 tracking-tight leading-tight mb-6"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", color: "#FAF6F0", fontFamily: "'Playfair Display', serif", fontWeight: 800 }}
          >
            We are Durgapur's <br />
            <span style={{ color: "#C8965A" }}>digital service backbone.</span>
          </h1>
          
          <p
            className="animate-fadeUp stagger-2 text-lg max-w-2xl mx-auto"
            style={{ color: "rgba(232,213,183,0.8)", lineHeight: 1.8, fontWeight: 300 }}
          >
            Founded by <strong>Infinity Squad</strong>, our mission is to connect the elite skilled labor of Durgapur with the citizens who need them most—through a transparent, deeply trustworthy platform.
          </p>
        </div>
      </section>

      {/* ── STATS: Uniform 3D Tiles ── */}
      <section className="relative z-20 -mt-24">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {STATS.map(({ value, label }, i) => (
              <div 
                key={label} 
                className={`animate-fadeUp stagger-${i + 2} rounded-[1.5rem] p-6 text-center transform transition-all duration-300 hover:-translate-y-2`}
                style={{ 
                  background: "color-mix(in srgb, var(--surface) 80%, transparent)", 
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: "1.5px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: `
                    0 2px 0 rgba(255,255,255,0.07) inset,
                    0 -2px 0 rgba(0,0,0,0.05) inset,
                    0 25px 50px rgba(15,26,18,0.15),
                    0 8px 16px rgba(15,26,18,0.08)
                  `
                }}
              >
                <p className="text-4xl font-900 tracking-tight mb-2" style={{ color: "var(--brand)", fontFamily: "'Playfair Display', serif" }}>
                  {value}
                </p>
                <p className="text-xs font-700 uppercase tracking-widest opacity-70" style={{ color: "var(--foreground)" }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR STORY: Bento Grid ── */}
      <section className="py-32 relative overflow-hidden" style={{ background: "var(--background)" }}>
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16 reveal">
            <p className="section-label justify-center">
              <span className="w-12 h-px inline-block mr-3" style={{ background: "var(--brand)" }} />
              The Infinity Squad Origin
              <span className="w-12 h-px inline-block ml-3" style={{ background: "var(--brand)" }} />
            </p>
            <h2 className="text-4xl md:text-5xl font-800 tracking-tight" style={{ color: "var(--foreground)", fontFamily: "'Playfair Display', serif" }}>
              Bridging the local gap
            </h2>
          </div>

          <div className="grid lg:grid-cols-12 gap-6 h-auto lg:h-[500px]">
             {/* Left Large Text Tile */}
             <div 
                className="lg:col-span-7 rounded-[2.5rem] p-10 lg:p-14 flex flex-col justify-center relative overflow-hidden organic-texture reveal"
                style={{ 
                  background: "var(--surface)", 
                  border: "1px solid var(--border)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.05)"
                }}
              >
                 <HeartHandshake size={32} style={{ color: "var(--gold)", marginBottom: "1.5rem" }} />
                 <h3 className="text-3xl font-800 mb-6" style={{ fontFamily: "'Playfair Display', serif", color: "var(--foreground)" }}>
                   From word-of-mouth<br/> to instant verification.
                 </h3>
                 <p className="leading-relaxed mb-6" style={{ color: "var(--muted)", fontSize: "1.05rem" }}>
                   Durgapur is growing exponentially. However, we noticed a critical flaw: despite the high demand for skilled services, finding a reliable professional still relied entirely on outdated word-of-mouth. 
                 </p>
                 <p className="leading-relaxed" style={{ color: "var(--muted)", fontSize: "1.05rem" }}>
                   Infinity Squad solved this by building a unified, verified digital ecosystem. Today, hundreds of elite professionals trust us to connect them with customers who value quality—and we are just getting started.
                 </p>
             </div>

             {/* Right Image/Logo Tile */}
             <div 
                className="lg:col-span-5 rounded-[2.5rem] relative overflow-hidden flex flex-col items-center justify-center p-10 reveal tile-3d"
                style={{ 
                  background: "linear-gradient(135deg, rgba(45,90,61,0.5), rgba(26,51,38,0.7))",
                  backdropFilter: "blur(32px)",
                  WebkitBackdropFilter: "blur(32px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  boxShadow: "inset 0 2px 0 rgba(255,255,255,0.1), 0 25px 60px rgba(28,43,31,0.3)"
                }}
              >
                {/* noise */}
                <div style={{
                  position: "absolute", inset: 0,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='150' height='150' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
                  mixBlendMode: "overlay"
                }} />
                
                <div className="w-24 h-24 rounded-[1.5rem] flex items-center justify-center mb-6 relative z-10 shadow-2xl" style={{ background: "rgba(200,150,90,0.15)", border: "1px solid rgba(200,150,90,0.3)" }}>
                  <Star size={40} style={{ color: "#C8965A" }} fill="currentColor" />
                </div>
                <h3 className="text-3xl font-900 relative z-10 text-white tracking-widest" style={{ fontFamily: "'Playfair Display', serif" }}>
                  INFINITY<br/>SQUAD
                </h3>
                <div className="mt-6 px-4 py-1.5 rounded-full relative z-10" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
                  <p className="text-xs font-700 tracking-[0.2em] uppercase text-white/90">ESTD 2026</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* ── VALUES: 3D Floating Grid ── */}
      <section className="py-24 relative" style={{ background: "var(--surface)" }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: "linear-gradient(90deg, transparent, var(--gold) 30%, var(--brand-mid) 50%, var(--gold) 70%, transparent)",
        }} />
        
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-20 reveal">
            <h2
              className="text-4xl md:text-5xl font-800 tracking-tight"
              style={{ color: "var(--foreground)", fontFamily: "'Playfair Display', serif" }}
            >
              Our Core Principles
            </h2>
            <p className="text-lg mt-4 max-w-xl mx-auto" style={{ color: "var(--muted)" }}>
              The unshakeable foundations that power every booking on HomeFixer.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 tile-grid-wrap">
            {VALUES.map(({ icon: Icon, title, desc, color }, i) => (
              <div
                key={title}
                className={`animate-fadeUp stagger-${i + 1} reveal tile-3d relative overflow-hidden`}
                style={{ 
                  borderRadius: "28px",
                  padding: "3rem 2.5rem",
                  background: `linear-gradient(145deg, ${color}, #1A3326)`,
                  boxShadow: `
                    0 2px 0 rgba(255,255,255,0.10) inset,
                    0 -3px 0 rgba(0,0,0,0.20) inset,
                    0 25px 60px rgba(15,26,18,0.25),
                    0 1px 0 rgba(0,0,0,0.12)
                  `,
                  border: "1px solid rgba(255,255,255,0.08)"
                }}
              >
                {/* Tile Shine Layer */}
                <div className="tile-shine" style={{
                  position: "absolute", top: 0, left: "-40%", width: "50%", height: "100%",
                  background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)",
                  pointerEvents: "none",
                }} />
                
                {/* Noise */}
                <div style={{
                  position: "absolute", inset: 0,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='150' height='150' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
                  pointerEvents: "none", mixBlendMode: "overlay",
                }} />

                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
                  <div 
                    className="w-16 h-16 rounded-[1.2rem] shrink-0 flex items-center justify-center shadow-inner"
                    style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
                  >
                    <Icon size={30} style={{ color: "#FAF6F0" }} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-800 mb-2" style={{ color: "#FAF6F0", fontFamily: "'Playfair Display', serif" }}>
                      {title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(232,213,183,0.8)" }}>
                      {desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-24 text-center reveal">
            <Link href="/search" className="btn-primary inline-flex items-center gap-2 !px-10 !py-4 !text-base shadow-2xl hover:scale-105 transition-transform" style={{ background: "linear-gradient(135deg, #1C2B1F, #2D5A3D)", border: "1px solid rgba(200,150,90,0.3)" }}>
              Experience the difference <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
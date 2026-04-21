"use client";

import { useState, useEffect, Suspense } from "react";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";
import { Lock, Mail, Loader2, UserPlus, ArrowRight, CheckCircle2, Briefcase } from "lucide-react";
import Link from "next/link";

export default function PartnerLogin() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
          <Loader2 className="animate-spin" style={{ color: "var(--brand)" }} />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const isNewVerification = searchParams.get("mode") === "verifyEmail";
    const alreadyShown = sessionStorage.getItem("verified_toast_shown");
    if (isNewVerification && !alreadyShown) {
      setShowToast(true);
      sessionStorage.setItem("verified_toast_shown", "true");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;
      const q = query(collection(db, "providers"), where("adminUid", "==", user.uid));
      const snap = await getDocs(q);
      if (!snap.empty) {
        router.push("/partner");
      } else {
        setError("No partner account found. Please register as a partner first.");
        await auth.signOut();
      }
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-[94vh] flex flex-col lg:flex-row relative overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* Toast */}
      {showToast && (
        <div
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl animate-fadeIn"
          style={{ background: "var(--brand-mid)", color: "#FAF6F0" }}
        >
          <CheckCircle2 size={18} />
          <span className="text-sm font-600">Login successful! Redirecting to dashboard.</span>
          <button onClick={() => setShowToast(false)} className="ml-2 opacity-70 hover:opacity-100">×</button>
        </div>
      )}

      {/* ── LEFT: Decorative Panel (Diagonal Split) ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[480px] p-12 shrink-0 relative z-10"
        style={{
          background: "linear-gradient(160deg, #1A3326 0%, #234830 50%, #1C2B1F 100%)",
          clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)",
          paddingRight: "6rem",
        }}
      >
        {/* Noise overlay */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }} />

        <div className="flex items-center gap-2.5 mb-8 relative z-10">
          <Logo className="w-9 h-9" inverted={true} />
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem", color: "#FAF6F0" }}>Partner Console</span>
        </div>

        <div className="relative z-10">
          <h2 className="animate-fadeUp text-4xl font-800 text-white tracking-tight leading-tight mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Grow your business <br />with HomeFixer.
          </h2>
          <p className="animate-fadeUp stagger-1 text-sm leading-relaxed" style={{ color: "rgba(232,213,183,0.80)" }}>
            Review daily work requests, manage your profile visibility, and scale your client base in Durgapur.
          </p>
        </div>

        <div className="flex flex-col gap-3 relative z-10 animate-fadeUp stagger-2 mt-12">
          {[
            "Real-time order notifications",
            "Manage your availability status",
            "Track earnings and reviews",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm" style={{ color: "rgba(232,213,183,0.90)" }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(200,150,90,0.18)", border: "1px solid rgba(200,150,90,0.4)" }}>
                <ArrowRight size={10} style={{ color: "#C8965A" }} />
              </div>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT: Form Container ── */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-0">
        <div
          className="w-full max-w-md rounded-[2rem] p-10 animate-scaleIn reveal organic-texture"
          style={{
            background: "var(--surface)",
            border: "1.5px solid var(--border)",
            boxShadow: `
              0 2px 0 rgba(255,255,255,0.07) inset,
              0 -2px 0 rgba(0,0,0,0.05) inset,
              0 30px 80px rgba(15,26,18,0.15),
              0 8px 24px rgba(15,26,18,0.10)
            `,
          }}
        >
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-3xl font-800 tracking-tight mb-2" style={{ color: "var(--foreground)", fontFamily: "'Playfair Display', serif" }}>
              Partner Sign In
            </h1>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              New partner?{" "}
              <Link href="/register-partner" style={{ color: "var(--brand)" }} className="font-600 hover:underline">
                Create an account
              </Link>
            </p>
          </div>

          {error && (
            <div
              className="mb-5 text-sm p-4 rounded-xl border animate-fadeIn"
              style={{ background: "var(--accent-light)", color: "var(--danger)", borderColor: "rgba(160,64,45,0.2)" }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted)" }} />
              <input
                id="partner-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="input-modern w-full px-11 py-3.5"
                style={{ background: "var(--background)", borderRadius: "var(--radius-md)" }}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted)" }} />
              <input
                id="partner-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="input-modern w-full px-11 py-3.5"
                style={{ background: "var(--background)", borderRadius: "var(--radius-md)" }}
              />
            </div>
            <button
              id="partner-login-submit"
              disabled={loading}
              className="w-full py-4 text-white font-bold rounded-full transition-all flex items-center justify-center gap-2 mt-2"
              style={{
                background: "linear-gradient(135deg, #2D5A3D, #1C2B1F)",
                boxShadow: "0 4px 16px rgba(45,90,61,0.40)",
                fontFamily: "'DM Sans', sans-serif",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if(!loading) {
                  (e.currentTarget as HTMLElement).style.transform = "scale(1.02)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(45,90,61,0.55)";
                }
              }}
              onMouseLeave={(e) => {
                if(!loading) {
                  (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(45,90,61,0.40)";
                }
              }}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : null}
              {loading ? "Signing in…" : "Access Dashboard"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="mt-8 pt-8 flex flex-col gap-3" style={{ borderTop: "1px solid var(--border)" }}>
            <Link
              href="/register-partner"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-600 border transition-all"
              style={{
                borderColor: "var(--border)", color: "var(--foreground)", background: "var(--background)",
                fontFamily: "'DM Sans', sans-serif" 
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--brand)";
                el.style.background = "var(--brand-light)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--border)";
                el.style.background = "var(--background)";
              }}
            >
              <Briefcase size={16} style={{ color: "var(--brand-mid)" }} /> Create Partner Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
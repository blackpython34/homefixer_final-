"use client";

import { useState } from "react";
import Logo from "@/components/Logo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Mail, Lock, ArrowRight, Loader2, Star } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if user is a service provider
      const q = query(collection(db, "providers"), where("adminUid", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError("This portal is for customers. Please use the Partner Login page.");
        await auth.signOut();
        setLoading(false);
        return;
      }

      router.push("/");
    } catch (err: any) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      setError("");
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if they are a partner/provider
      const q = query(collection(db, "providers"), where("adminUid", "==", user.uid));
      const snap = await getDocs(q);

      if (!snap.empty) {
        router.push("/partner");
      } else {
        // Handle new or existing customer
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            name: user.displayName || "User",
            email: user.email,
            phone: "",
            createdAt: new Date().toISOString(),
          });
        }
        router.push("/");
      }
    } catch (err: any) {
      console.error(err);
      setError("Google Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-[94vh] flex flex-col lg:flex-row relative overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* ── LEFT: Decorative Panel (Diagonal Split) ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[480px] p-12 shrink-0 relative z-10"
        style={{
          background: "linear-gradient(160deg, #1C2B1F 0%, #2D5A3D 60%, #1A3326 100%)",
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
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem", color: "#FAF6F0" }}>HomeFixer</span>
        </div>

        <div className="relative z-10">
          <h2 className="animate-fadeUp text-4xl font-800 text-white tracking-tight leading-tight mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Welcome back to <br />Durgapur's #1 <br />service platform.
          </h2>
          <p className="animate-fadeUp stagger-1 text-sm leading-relaxed" style={{ color: "rgba(232,213,183,0.80)" }}>
            Access your bookings, track professionals, and book services across the city.
          </p>
        </div>

        <div className="flex flex-col gap-3 relative z-10 animate-fadeUp stagger-2 mt-12">
          {[
            "100+ verified professionals",
            "Instant booking & confirmation",
            "Transparent pricing, no hidden fees",
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
            <h1
              className="text-3xl font-800 tracking-tight mb-2"
              style={{ color: "var(--foreground)", fontFamily: "'Playfair Display', serif" }}
            >
              Sign in
            </h1>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Don't have an account?{" "}
              <Link href="/signup" style={{ color: "var(--brand)" }} className="font-600 hover:underline">
                Create one
              </Link>
            </p>
          </div>

          {error && (
            <div
              className="mb-6 text-sm p-4 rounded-xl border animate-fadeIn"
              style={{
                background: "var(--accent-light)",
                color: "var(--danger)",
                borderColor: "rgba(160,64,45,0.2)",
              }}
            >
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "var(--muted)" }}
              />
              <input
                id="login-email"
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
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "var(--muted)" }}
              />
              <input
                id="login-password"
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
              id="login-submit"
              disabled={loading}
              className="w-full py-4 text-white font-bold rounded-full transition-all flex items-center justify-center gap-2 mt-2"
              style={{
                background: "linear-gradient(135deg, #C8965A, #A0714F)",
                boxShadow: "0 4px 16px rgba(200,150,90,0.40)",
                fontFamily: "'DM Sans', sans-serif",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if(!loading) {
                  (e.currentTarget as HTMLElement).style.transform = "scale(1.02)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(200,150,90,0.55)";
                }
              }}
              onMouseLeave={(e) => {
                if(!loading) {
                  (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(200,150,90,0.40)";
                }
              }}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Sign In"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="relative my-8 flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            <span className="text-xs font-600 tracking-wider uppercase" style={{ color: "var(--muted)" }}>
              Or Continue With
            </span>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          </div>

          <button
            id="google-login"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-full text-sm font-600 border transition-all"
            style={{
              background: "var(--background)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
              fontFamily: "'DM Sans', sans-serif",
            }}
            onMouseEnter={(e) => { 
                (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"; 
                (e.currentTarget as HTMLElement).style.borderColor = "var(--brand-mid)";
            }}
            onMouseLeave={(e) => { 
                (e.currentTarget as HTMLElement).style.background = "var(--background)"; 
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
            }}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-4 h-4"
              alt="Google"
            />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}

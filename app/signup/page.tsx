"use client";

import { useState } from "react";
import Logo from "@/components/Logo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { User, Mail, Phone, Lock, ArrowRight, Loader2, Star } from "lucide-react";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: formData.name });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: "user",
        createdAt: new Date().toISOString(),
      });

      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { id: "signup-name",     Icon: User,  type: "text",     placeholder: "Full name",       key: "name" as const },
    { id: "signup-email",    Icon: Mail,  type: "email",    placeholder: "Email address",   key: "email" as const },
    { id: "signup-phone",    Icon: Phone, type: "tel",      placeholder: "Phone number",    key: "phone" as const },
    { id: "signup-password", Icon: Lock,  type: "password", placeholder: "Create password", key: "password" as const },
  ];

  return (
    <div
      className="min-h-[90vh] flex"
      style={{ background: "var(--surface)" }}
    >
      {/* Left decorative panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] p-12 shrink-0"
        style={{
          background: "linear-gradient(160deg, var(--brand) 0%, #1e3a8a 100%)",
        }}
      >
        <div className="flex items-center gap-2.5 mb-8">
          <Logo className="w-9 h-9" inverted={true} />
          <span className="text-white font-700 text-base">HomeFixer</span>
        </div>

        <div>
          <h2 className="text-4xl font-800 text-white tracking-tight leading-tight mb-4">
            Join thousands of happy customers in Durgapur.
          </h2>
          <p className="text-blue-200 text-sm leading-relaxed">
            Create a free account and access verified professionals across the city in seconds.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {[
            "Free to create, no credit card needed",
            "Book & track services in real-time",
            "Secure, verified professionals only",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm text-blue-100">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <ArrowRight size={10} className="text-white" />
              </div>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div
          className="w-full max-w-md rounded-2xl p-10 animate-scaleIn"
          style={{
            background: "var(--background)",
            border: "1.5px solid var(--border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div className="mb-8">
            <h1
              className="text-2xl font-800 tracking-tight mb-1"
              style={{ color: "var(--foreground)" }}
            >
              Create your account
            </h1>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "var(--brand)" }} className="font-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          {error && (
            <div
              className="mb-5 text-sm p-4 rounded-xl border animate-fadeIn"
              style={{
                background: "#fef2f2",
                color: "#dc2626",
                borderColor: "#fecaca",
              }}
            >
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSignup}>
            {fields.map(({ id, Icon, type, placeholder, key }) => (
              <div key={key} className="relative">
                <Icon
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: "var(--muted)" }}
                />
                <input
                  id={id}
                  type={type}
                  required
                  placeholder={placeholder}
                  className="input-modern"
                  onChange={(e) =>
                    setFormData({ ...formData, [key]: e.target.value })
                  }
                />
              </div>
            ))}

            <button
              id="signup-submit"
              disabled={loading}
              className="btn-primary w-full mt-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "Create Account"
              )}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p
            className="mt-6 text-center text-xs"
            style={{ color: "var(--muted)" }}
          >
            By creating an account you agree to our{" "}
            <span style={{ color: "var(--brand)" }} className="font-600 cursor-pointer hover:underline">
              Terms of Service
            </span>{" "}
            and{" "}
            <span style={{ color: "var(--brand)" }} className="font-600 cursor-pointer hover:underline">
              Privacy Policy
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
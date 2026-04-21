"use client";

import { useState } from "react";
import { auth, db, storage } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import {
  UserPlus,
  Loader2,
  Camera,
  Mail,
  Lock,
  Phone,
  MapPin,
  IndianRupee,
  Wrench,
  CheckCircle2,
  ArrowRight,
  User,
  ChevronDown,
} from "lucide-react";
import Logo from "@/components/Logo";
import Link from "next/link";

const CATEGORIES = ["Electrician", "Plumber", "Mechanic", "Tutor", "Tailor"];

export default function RegisterPartner() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    category: "Electrician",
    subCategory: "",
    price: "",
    address: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: form.name });

      let imageUrl = "https://via.placeholder.com/400";
      if (imageFile) {
        const storageRef = ref(storage, `providers/${user.uid}-${Date.now()}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(db, "providers"), {
        adminUid: user.uid,
        adminEmail: form.email,
        name: form.name,
        phone: form.phone,
        category: form.category,
        subCategory: form.subCategory,
        price: Number(form.price) || 0,
        address: form.address,
        image: imageUrl,
        rating: 5.0,
        views: 0,
        status: "online",
        isVerifiedPartner: true,
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
    } catch (e: any) {
      alert("Registration Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  if (success)
    return (
      <div
        className="min-h-[94vh] flex flex-col items-center justify-center p-6 relative overflow-hidden"
        style={{ background: "var(--background)" }}
      >
        <div style={{
          position: "absolute", top: "-5%", right: "-3%", width: 350, height: 350,
          background: "radial-gradient(ellipse, rgba(45,90,61,0.07) 0%, transparent 70%)", pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", bottom: "-8%", left: "-5%", width: 300, height: 300,
          background: "radial-gradient(ellipse, rgba(200,150,90,0.06) 0%, transparent 70%)", pointerEvents: "none"
        }} />

        <div
          className="w-full max-w-md rounded-[2rem] p-12 text-center animate-scaleIn organic-texture relative z-10"
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
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: "#ecfdf5", border: "1px solid #a7f3d0" }}
          >
            <CheckCircle2 size={40} style={{ color: "#059669" }} />
          </div>
          <h1 className="text-3xl font-800 tracking-tight mb-2" style={{ color: "var(--foreground)", fontFamily: "'Playfair Display', serif" }}>
            Registration Complete
          </h1>
          <p className="text-sm mb-8 leading-relaxed" style={{ color: "var(--muted)" }}>
            Your premium partner profile is now active. Access your business dashboard immediately.
          </p>
          <button onClick={() => router.push("/partner-login")} className="w-full py-4 text-white font-bold rounded-full transition-all flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg, #C8965A, #A0714F)", boxShadow: "0 4px 16px rgba(200,150,90,0.40)" }}>
            Go to Partner Login <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );

  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>
      {/* ── HEADER: Forest Green V2 Aesthetic ── */}
      <div
        style={{
          background: "linear-gradient(160deg, #1C2B1F 0%, #2D5A3D 60%, #1A3326 100%)",
          position: "relative",
          overflow: "hidden",
        }}
        className="py-16"
      >
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }} />
        <div className="container mx-auto px-6 max-w-3xl relative z-10 text-center animate-fadeUp">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Logo className="w-10 h-10" inverted={true} />
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.2rem", color: "#FAF6F0" }}>HomeFixer Partners</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-800 tracking-tight" style={{ color: "#FAF6F0", fontFamily: "'Playfair Display', serif" }}>
            Join the elite network
          </h1>
          <p className="text-sm mt-4 text-white/70 max-w-xl mx-auto leading-relaxed font-300">
            Already a verified partner?{" "}
            <Link href="/partner-login" style={{ color: "#C8965A" }} className="font-600 hover:underline">
              Sign in securely
            </Link>
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-5 max-w-3xl py-12 relative -top-8 z-20">
        <form onSubmit={handleSubmit} className="animate-scaleIn reveal">
          <div className="flex flex-col gap-6">

            {/* Account Section */}
            <div
              className="rounded-[2rem] p-8 sm:p-10 organic-texture"
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
              <h3 className="text-xl font-800 mb-6" style={{ color: "var(--foreground)", fontFamily: "'Playfair Display', serif" }}>
                1. Account Credentials
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted)" }} />
                  <input
                    id="reg-email"
                    type="email"
                    required
                    placeholder="Email address"
                    className="input-modern w-full px-11 py-3.5"
                    style={{ background: "var(--background)", borderRadius: "var(--radius-md)" }}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted)" }} />
                  <input
                    id="reg-password"
                    type="password"
                    required
                    placeholder="Create password"
                    className="input-modern w-full px-11 py-3.5"
                    style={{ background: "var(--background)", borderRadius: "var(--radius-md)" }}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Business Section */}
            <div
              className="rounded-[2rem] p-8 sm:p-10 organic-texture"
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
              <h3 className="text-xl font-800 mb-6" style={{ color: "var(--foreground)", fontFamily: "'Playfair Display', serif" }}>
                2. Professional Portfolio
              </h3>

              {/* Photo Upload */}
              <div className="mb-8">
                <label className="block text-xs font-700 tracking-wider uppercase mb-3" style={{ color: "var(--muted)" }}>
                  Profile Verification Photo
                </label>
                <div
                  className="relative h-40 rounded-[1.5rem] overflow-hidden flex flex-col items-center justify-center cursor-pointer transition-all"
                  style={{
                    background: imagePreview ? "transparent" : "var(--background)",
                    border: `2px dashed var(--border)`,
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--brand)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  {imagePreview ? (
                    <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full mb-3 flex items-center justify-center" style={{ background: "rgba(200,150,90,0.1)" }}>
                        <Camera size={20} style={{ color: "var(--brand-mid)" }} />
                      </div>
                      <span className="text-sm font-600" style={{ color: "var(--foreground)" }}>
                        Upload business headshot
                      </span>
                      <span className="text-xs" style={{ color: "var(--muted)" }}>JPG or PNG, max 5MB</span>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted)" }} />
                    <input
                      id="reg-name"
                      type="text"
                      required
                      placeholder="Full name / Business Name"
                      className="input-modern w-full px-11 py-3.5"
                      style={{ background: "var(--background)", borderRadius: "var(--radius-md)" }}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted)" }} />
                    <input
                      id="reg-phone"
                      type="tel"
                      required
                      placeholder="Verified Phone number"
                      className="input-modern w-full px-11 py-3.5"
                      style={{ background: "var(--background)", borderRadius: "var(--radius-md)" }}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="relative">
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--muted)" }} />
                    <select
                      id="reg-category"
                      className="input-modern w-full appearance-none pr-10 cursor-pointer py-3.5"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      style={{ background: "var(--background)", borderRadius: "var(--radius-md)", paddingLeft: "1.25rem" }}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="relative">
                    <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted)" }} />
                    <input
                      id="reg-subcategory"
                      type="text"
                      required
                      placeholder="Specialization (e.g. AC Repair)"
                      className="input-modern w-full px-11 py-3.5"
                      style={{ background: "var(--background)", borderRadius: "var(--radius-md)" }}
                      onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted)" }} />
                    <input
                      id="reg-price"
                      type="number"
                      required
                      placeholder="Base Visiting fee (₹)"
                      className="input-modern w-full px-11 py-3.5"
                      style={{ background: "var(--background)", borderRadius: "var(--radius-md)" }}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted)" }} />
                    <input
                      id="reg-address"
                      type="text"
                      required
                      placeholder="Service area / Base Address"
                      className="input-modern w-full px-11 py-3.5"
                      style={{ background: "var(--background)", borderRadius: "var(--radius-md)" }}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              id="reg-submit"
              type="submit"
              disabled={loading}
              className="w-full py-4 text-white font-bold rounded-full transition-all flex items-center justify-center gap-2 mt-4"
              style={{
                background: "linear-gradient(135deg, #1C2B1F, #2D5A3D)",
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
              {loading ? <Loader2 className="animate-spin" size={18} /> : <UserPlus size={18} />}
              {loading ? "Creating your account…" : "Register as Partner"}
            </button>

            <p className="text-xs text-center pb-8" style={{ color: "var(--muted)" }}>
              By registering you agree to our{" "}
              <span style={{ color: "var(--brand)" }} className="font-600 cursor-pointer">Terms of Service</span>
              {" "}and{" "}
              <span style={{ color: "var(--brand)" }} className="font-600 cursor-pointer">Privacy Policy</span>.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
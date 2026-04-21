"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import {
  Loader2,
  CheckCircle2,
  LogOut,
  Phone,
  ArrowUpRight,
  User,
  Mail,
  ShoppingBag,
  Shield,
  Settings,
} from "lucide-react";

export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const unsubSnapshot = onSnapshot(
          userRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              setUserData(data);
              setName(data.name || "");
              setPhone(data.phone || "");
            } else {
              const initialData = { name: user.displayName || "New User", email: user.email };
              setUserData(initialData);
              setName(initialData.name);
            }
            setLoading(false);
          },
          (error) => {
            console.error("Firestore real-time error:", error);
            setLoading(false);
          }
        );
        return () => unsubSnapshot();
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribeAuth();
  }, [router]);

  const handleUpdate = async () => {
    if (!auth.currentUser) return;
    setUpdating(true);
    try {
      const uid = auth.currentUser.uid;
      await setDoc(doc(db, "users", uid), { name, phone, email: auth.currentUser.email }, { merge: true });
      await setDoc(doc(db, "providers", uid), { name, phone, adminUid: uid }, { merge: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: any) {
      console.error(e);
      alert("Error: " + e.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <Loader2 className="w-9 h-9 animate-spin" style={{ color: "var(--brand)" }} />
      </div>
    );

  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(160deg, #eff6ff 0%, var(--background) 100%)",
          borderBottom: "1px solid var(--border)",
        }}
        className="py-10"
      >
        <div className="container mx-auto px-5 max-w-5xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-label">
                <User size={12} /> My Account
              </p>
              <h1
                className="text-3xl font-800 tracking-tight"
                style={{ color: "var(--foreground)" }}
              >
                Profile & Settings
              </h1>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-600 border transition-all"
              style={{ borderColor: "var(--border)", color: "var(--muted)" }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "#fca5a5";
                el.style.color = "#dc2626";
                el.style.background = "#fef2f2";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--border)";
                el.style.color = "var(--muted)";
                el.style.background = "transparent";
              }}
            >
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-5 max-w-5xl py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left: Avatar Card */}
          <div className="lg:col-span-4">
            <div
              className="rounded-2xl p-8"
              style={{
                background: "var(--background)",
                border: "1.5px solid var(--border)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              {/* Avatar */}
              <div className="flex flex-col items-center text-center mb-8">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-800 text-white mb-4"
                  style={{ background: "var(--brand)" }}
                >
                  {name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <h2 className="text-xl font-800 tracking-tight" style={{ color: "var(--foreground)" }}>
                  {name || "Your Name"}
                </h2>
                <div
                  className="flex items-center gap-1.5 mt-2"
                >
                  <div
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-700"
                    style={{ background: "#ecfdf5", color: "#059669" }}
                  >
                    <Shield size={11} /> Verified Account
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="flex items-center gap-3">
                  <Mail size={15} style={{ color: "var(--muted)" }} />
                  <div>
                    <p className="text-xs font-600" style={{ color: "var(--muted)" }}>Email</p>
                    <p className="text-sm font-700" style={{ color: "var(--foreground)" }}>
                      {userData?.email}
                    </p>
                  </div>
                </div>
                {phone && (
                  <div className="flex items-center gap-3">
                    <Phone size={15} style={{ color: "var(--muted)" }} />
                    <div>
                      <p className="text-xs font-600" style={{ color: "var(--muted)" }}>Phone</p>
                      <p className="text-sm font-700" style={{ color: "var(--foreground)" }}>{phone}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick links */}
              <div className="mt-6 flex flex-col gap-2 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
                <button
                  onClick={() => router.push("/orders")}
                  className="flex items-center justify-between p-3.5 rounded-xl text-sm font-600 transition-all"
                  style={{ color: "var(--foreground)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--surface)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag size={15} style={{ color: "var(--brand)" }} /> My Bookings
                  </span>
                  <ArrowUpRight size={14} style={{ color: "var(--muted)" }} />
                </button>
                <button
                  className="flex items-center justify-between p-3.5 rounded-xl text-sm font-600 transition-all"
                  style={{ color: "var(--foreground)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--surface)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <span className="flex items-center gap-2">
                    <Settings size={15} style={{ color: "var(--brand)" }} /> Settings
                  </span>
                  <ArrowUpRight size={14} style={{ color: "var(--muted)" }} />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Edit Form */}
          <div className="lg:col-span-8">
            <div
              className="rounded-2xl p-8"
              style={{
                background: "var(--background)",
                border: "1.5px solid var(--border)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <h3 className="text-lg font-700 mb-6" style={{ color: "var(--foreground)" }}>
                Personal Information
              </h3>

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-xs font-700 mb-2" style={{ color: "var(--muted)" }}>
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                      style={{ color: "var(--muted)" }}
                    />
                    <input
                      id="profile-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="input-modern"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-700 mb-2" style={{ color: "var(--muted)" }}>
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                      style={{ color: "var(--muted)" }}
                    />
                    <input
                      id="profile-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="input-modern"
                    />
                  </div>
                </div>

                {/* Email (read-only) */}
                <div>
                  <label className="block text-xs font-700 mb-2" style={{ color: "var(--muted)" }}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                      style={{ color: "var(--muted)" }}
                    />
                    <input
                      type="email"
                      value={userData?.email || ""}
                      disabled
                      className="input-modern opacity-60 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-2">
                  <button
                    id="profile-save"
                    onClick={handleUpdate}
                    disabled={updating}
                    className="btn-primary w-full"
                    style={saved ? { background: "#059669" } : {}}
                  >
                    {updating ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : saved ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <CheckCircle2 size={18} />
                    )}
                    {updating ? "Saving…" : saved ? "Changes Saved!" : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
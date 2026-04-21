"use client";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {
  IndianRupee,
  Star,
  Clock,
  Settings,
  Loader2,
  Power,
  Save,
  MapPin,
  Eye,
  Users,
  Wrench,
  CheckCircle2,
  LayoutDashboard,
  MessageSquare,
  ArrowUpRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

const CATEGORIES = ["Electrician", "Plumber", "Mechanic", "Tutor", "Tailor"];

const TABS = [
  { id: "dashboard", label: "Overview", icon: LayoutDashboard },
  { id: "leads",     label: "Bookings",  icon: Users },
  { id: "settings",  label: "Settings",  icon: Settings },
  { id: "reviews",   label: "Reviews",   icon: MessageSquare },
];

export default function PartnerConsole() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [providerData, setProviderData] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState({ revenue: 0, activeJobs: 0, rating: 0, views: 0, reviewCount: 0 });
  const [formData, setFormData] = useState({ name: "", price: "", category: "", subCategory: "", address: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) { router.push("/login"); return; }

      const qProvider = query(collection(db, "providers"), where("adminUid", "==", user.uid));
      const unsubProvider = onSnapshot(qProvider, (snap) => {
        if (snap.empty) { setLoading(false); router.push("/"); return; }

        const pDoc = { id: snap.docs[0].id, ...snap.docs[0].data() } as any;
        setProviderData(pDoc);
        setFormData({
          name: pDoc?.name || "",
          price: pDoc?.price || "",
          category: pDoc?.category || "",
          subCategory: pDoc?.subCategory || "",
          address: pDoc?.address || "",
        });

        const qOrders = query(collection(db, "orders"), where("providerId", "==", pDoc.id), orderBy("createdAt", "desc"));
        const unsubOrders = onSnapshot(qOrders, (orderSnap) => {
          const orderData = orderSnap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
          setOrders(orderData);

          const qReviews = query(collection(db, "reviews"), where("providerId", "==", pDoc.id), orderBy("createdAt", "desc"));
          onSnapshot(qReviews, (revSnap) => {
            const revData = revSnap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
            setReviews(revData);
            setStats({
              revenue: orderData
                .filter((o: any) => o?.status === "Paid" || o?.status === "Completed")
                .reduce((acc: number, c: any) => acc + (Number(c?.amount) || 0), 0),
              activeJobs: orderData.filter((o: any) => o?.status === "Accepted").length,
              rating: Number(pDoc?.rating) || 5.0,
              views: Number(pDoc?.views) || 0,
              reviewCount: revData.length,
            });
            setLoading(false);
          });
        });
      });
      return () => unsubProvider();
    });
    return () => unsubscribeAuth();
  }, [router]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus, lastUpdated: new Date().toISOString() });
    } catch (e: any) {
      alert("Failed to update: " + e.message);
    }
  };

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerData?.id || !auth.currentUser) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "providers", providerData.id), { ...formData, price: Number(formData.price) });
      await setDoc(doc(db, "users", auth.currentUser.uid), { name: formData.name }, { merge: true });
      setSavedOk(true);
      setTimeout(() => setSavedOk(false), 2500);
    } catch (e: any) {
      alert("Update failed: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <Loader2 className="w-9 h-9 animate-spin" style={{ color: "var(--brand)" }} />
      </div>
    );

  const isOnline = providerData?.status === "online";

  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>
      {/* ─── Header ─── */}
      <div
        style={{
          background: "linear-gradient(160deg, #eff6ff 0%, var(--background) 100%)",
          borderBottom: "1px solid var(--border)",
        }}
        className="py-8"
      >
        <div className="container mx-auto px-5 max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-label">
                <LayoutDashboard size={12} /> Partner Console
              </p>
              <h1 className="text-2xl font-800 tracking-tight" style={{ color: "var(--foreground)" }}>
                {providerData?.name}
                <span className="ml-2 text-base font-600" style={{ color: "var(--muted)" }}>
                  Dashboard
                </span>
              </h1>
            </div>

            {/* Online/Offline Toggle */}
            <button
              onClick={async () => {
                const newStatus = isOnline ? "offline" : "online";
                await updateDoc(doc(db, "providers", providerData.id), { status: newStatus });
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-700 border transition-all"
              style={{
                background: isOnline ? "#ecfdf5" : "#fef2f2",
                color: isOnline ? "#059669" : "#dc2626",
                borderColor: isOnline ? "#a7f3d0" : "#fecaca",
              }}
            >
              <Power size={14} />
              {isOnline ? "Online" : "Offline"}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-5 max-w-7xl py-8">
        {/* ─── Tabs ─── */}
        <div
          className="flex gap-1 p-1.5 rounded-xl mb-8 w-fit"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              id={`tab-${id}`}
              onClick={() => setActiveTab(id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-600 transition-all"
              style={{
                background: activeTab === id ? "var(--background)" : "transparent",
                color: activeTab === id ? "var(--brand)" : "var(--muted)",
                boxShadow: activeTab === id ? "var(--shadow-card)" : "none",
                fontWeight: activeTab === id ? 700 : 600,
              }}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* ─── OVERVIEW ─── */}
        {activeTab === "dashboard" && (
          <div className="animate-fadeIn">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {[
                { label: "Total Earnings", value: `₹${stats.revenue.toLocaleString("en-IN")}`, icon: IndianRupee, color: "#059669", bg: "#ecfdf5" },
                { label: "Active Jobs",    value: stats.activeJobs, icon: Clock, color: "#2563eb", bg: "#eff6ff" },
                { label: "Reputation",     value: `${stats.rating} ★`,  icon: Star, color: "#d97706", bg: "#fffbeb" },
                { label: "Profile Views",  value: stats.views,      icon: Eye, color: "#7c3aed", bg: "#f5f3ff" },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div
                  key={label}
                  className="rounded-2xl p-6"
                  style={{ background: "var(--background)", border: "1.5px solid var(--border)", boxShadow: "var(--shadow-card)" }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: bg }}>
                    <Icon size={18} style={{ color }} />
                  </div>
                  <p className="text-xs font-600 mb-1" style={{ color: "var(--muted)" }}>{label}</p>
                  <p className="text-2xl font-800 tracking-tight" style={{ color: "var(--foreground)" }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Quick info card */}
            <div
              className="rounded-2xl p-7 flex flex-col md:flex-row gap-6 items-start"
              style={{ background: "var(--surface)", border: "1.5px solid var(--border)" }}
            >
              <div className="flex-1">
                <p className="section-label">Quick Actions</p>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  Use the tabs above to manage bookings, update your profile details, and read customer reviews.
                </p>
              </div>
              <div className="flex gap-3 shrink-0">
                <button
                  onClick={() => setActiveTab("leads")}
                  className="btn-primary text-sm py-2.5 px-5"
                >
                  View Bookings <ArrowUpRight size={14} />
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className="btn-outline text-sm py-2.5 px-5"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── BOOKINGS ─── */}
        {activeTab === "leads" && (
          <div className="animate-fadeIn space-y-4">
            <h2 className="text-xl font-700 mb-6" style={{ color: "var(--foreground)" }}>
              Booking Requests
              {orders.length > 0 && (
                <span
                  className="ml-2 px-2.5 py-0.5 rounded-full text-sm"
                  style={{ background: "var(--brand-light)", color: "var(--brand)" }}
                >
                  {orders.length}
                </span>
              )}
            </h2>

            {orders.length > 0 ? (
              orders.map((order: any) => {
                const statusMap: Record<string, { bg: string; text: string; border: string }> = {
                  Paid:      { bg: "#fffbeb", text: "#d97706", border: "#fde68a" },
                  Accepted:  { bg: "#eff6ff", text: "#2563eb", border: "#bfdbfe" },
                  Completed: { bg: "#ecfdf5", text: "#059669", border: "#a7f3d0" },
                };
                const s = statusMap[order.status] || statusMap.Paid;
                return (
                  <div
                    key={order.id}
                    className="rounded-2xl p-6 flex flex-col md:flex-row justify-between gap-5 items-center"
                    style={{ background: "var(--background)", border: "1.5px solid var(--border)", boxShadow: "var(--shadow-card)" }}
                  >
                    <div className="flex items-center gap-5 w-full">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "var(--brand-light)" }}
                      >
                        <Users size={20} style={{ color: "var(--brand)" }} />
                      </div>
                      <div>
                        <p className="text-xs font-500 mb-1" style={{ color: "var(--muted)" }}>
                          {order?.userEmail} &nbsp;·&nbsp; ID: {order?.id?.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="font-700" style={{ color: "var(--foreground)" }}>
                          ₹{Number(order.amount || 299).toLocaleString("en-IN")} booking
                        </p>
                        <span
                          className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-700"
                          style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3 shrink-0">
                      {order.status === "Paid" && (
                        <button
                          onClick={() => updateStatus(order.id, "Accepted")}
                          className="btn-primary text-sm py-2 px-5"
                        >
                          Accept
                        </button>
                      )}
                      {order.status === "Accepted" && (
                        <button
                          onClick={() => updateStatus(order.id, "Completed")}
                          className="btn-primary text-sm py-2 px-5"
                        >
                          <CheckCircle2 size={14} /> Complete
                        </button>
                      )}
                      {order.status === "Completed" && (
                        <span className="flex items-center gap-1 text-sm font-600" style={{ color: "#059669" }}>
                          <CheckCircle2 size={14} /> Done
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                className="py-28 text-center rounded-2xl border-2 border-dashed"
                style={{ borderColor: "var(--border)" }}
              >
                <Users size={32} className="mx-auto mb-3" style={{ color: "var(--muted)", opacity: 0.4 }} />
                <p className="font-600" style={{ color: "var(--muted)" }}>No bookings received yet.</p>
                <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>Make sure your profile is active and online.</p>
              </div>
            )}
          </div>
        )}

        {/* ─── SETTINGS ─── */}
        {activeTab === "settings" && (
          <div className="animate-fadeIn max-w-2xl">
            <h2 className="text-xl font-700 mb-6" style={{ color: "var(--foreground)" }}>
              Business Profile
            </h2>
            <form onSubmit={saveSettings}>
              <div
                className="rounded-2xl p-8"
                style={{ background: "var(--background)", border: "1.5px solid var(--border)", boxShadow: "var(--shadow-card)" }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-700 mb-2" style={{ color: "var(--muted)" }}>Business Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-modern"
                      placeholder="Your business name"
                      style={{ paddingLeft: "1rem" }}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-700 mb-2" style={{ color: "var(--muted)" }}>Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="input-modern appearance-none cursor-pointer"
                      style={{ paddingLeft: "1rem" }}
                    >
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  {/* Specialization */}
                  <div>
                    <label className="block text-xs font-700 mb-2" style={{ color: "var(--muted)" }}>Specialization</label>
                    <div className="relative">
                      <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted)" }} />
                      <input
                        type="text"
                        value={formData.subCategory}
                        onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                        className="input-modern"
                        placeholder="e.g. AC Repair"
                      />
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-xs font-700 mb-2" style={{ color: "var(--muted)" }}>Visiting Fee (₹)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted)" }} />
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="input-modern"
                        placeholder="e.g. 299"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-xs font-700 mb-2" style={{ color: "var(--muted)" }}>Service Area</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted)" }} />
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="input-modern"
                        placeholder="Sector, Locality, Durgapur"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn-primary"
                    style={savedOk ? { background: "#059669" } : {}}
                  >
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : savedOk ? <CheckCircle2 size={18} /> : <Save size={18} />}
                    {isSaving ? "Saving…" : savedOk ? "Saved!" : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ─── REVIEWS ─── */}
        {activeTab === "reviews" && (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-700 mb-6" style={{ color: "var(--foreground)" }}>
              Customer Reviews
              {reviews.length > 0 && (
                <span
                  className="ml-2 px-2.5 py-0.5 rounded-full text-sm"
                  style={{ background: "var(--brand-light)", color: "var(--brand)" }}
                >
                  {reviews.length}
                </span>
              )}
            </h2>

            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {reviews.map((rev: any) => (
                  <div
                    key={rev.id}
                    className="rounded-2xl p-6"
                    style={{ background: "var(--background)", border: "1.5px solid var(--border)", boxShadow: "var(--shadow-card)" }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-700 text-sm" style={{ color: "var(--foreground)" }}>{rev.userName}</p>
                        <div className="flex gap-0.5 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={11}
                              fill={i < rev.rating ? "#f59e0b" : "none"}
                              style={{ color: i < rev.rating ? "#f59e0b" : "var(--border)" }}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs" style={{ color: "var(--muted)" }}>
                        {rev.createdAt?.toDate
                          ? rev.createdAt.toDate().toLocaleDateString("en-IN", { day: "numeric", month: "short" })
                          : "Recent"}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="py-28 text-center rounded-2xl border-2 border-dashed"
                style={{ borderColor: "var(--border)" }}
              >
                <MessageSquare size={32} className="mx-auto mb-3" style={{ color: "var(--muted)", opacity: 0.4 }} />
                <p className="font-600" style={{ color: "var(--muted)" }}>No reviews yet.</p>
                <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                  Complete bookings to start receiving customer feedback.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
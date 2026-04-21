"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {
  ShoppingBag,
  Calendar,
  CheckCircle,
  ArrowLeft,
  Loader2,
  MapPin,
  ArrowRight,
  Receipt,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const unsubscribeOrders = onSnapshot(
          q,
          (snapshot) => {
            setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
          },
          (error) => {
            console.error("Firestore Error:", error);
            setLoading(false);
          }
        );
        return () => unsubscribeOrders();
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribeAuth();
  }, [router]);

  const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    Paid:      { bg: "#ecfdf5", text: "#059669", border: "#a7f3d0" },
    Pending:   { bg: "#fffbeb", text: "#d97706", border: "#fde68a" },
    Cancelled: { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
  };

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4"
           style={{ background: "var(--background)" }}>
        <Loader2 className="w-9 h-9 animate-spin" style={{ color: "var(--brand)" }} />
        <span className="text-sm font-600" style={{ color: "var(--muted)" }}>
          Loading your bookings…
        </span>
      </div>
    );

  const totalSpent = orders.reduce((acc, o) => acc + (Number(o.amount) || 0), 0);

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
        <div className="container mx-auto px-5 max-w-4xl">
          <button
            onClick={() => router.push("/profile")}
            className="flex items-center gap-2 text-sm font-600 mb-6 transition-colors"
            style={{ color: "var(--muted)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--brand)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--muted)"; }}
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back to Profile
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div>
              <p className="section-label">
                <ShoppingBag size={12} /> Transaction History
              </p>
              <h1
                className="text-3xl font-800 tracking-tight"
                style={{ color: "var(--foreground)" }}
              >
                My Bookings
              </h1>
            </div>

            {/* Summary stat */}
            <div
              className="rounded-2xl px-6 py-4 flex items-center gap-4"
              style={{
                background: "var(--background)",
                border: "1.5px solid var(--border)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "var(--brand-light)" }}
              >
                <Receipt size={18} style={{ color: "var(--brand)" }} />
              </div>
              <div>
                <p className="text-xs font-600" style={{ color: "var(--muted)" }}>
                  Total Spent
                </p>
                <p className="text-xl font-800 tracking-tight" style={{ color: "var(--foreground)" }}>
                  ₹{totalSpent.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders */}
      <div className="container mx-auto px-5 max-w-4xl py-10">
        {orders.length > 0 ? (
          <div className="flex flex-col gap-5">
            {orders.map((order, i) => {
              const statusColors =
                STATUS_COLORS[order.status] || STATUS_COLORS["Paid"];
              return (
                <Link
                  href={`/provider?id=${order.providerId}#reviews`}
                  key={order.id}
                  className="block rounded-2xl p-6 animate-fadeUp transition-all hover:scale-[1.02]"
                  style={{
                    background: "var(--background)",
                    border: "1.5px solid var(--border)",
                    boxShadow: "var(--shadow-card)",
                    animationDelay: `${i * 0.05}s`,
                  }}
                >
                  <div className="flex flex-col md:flex-row justify-between gap-5">
                    <div className="flex items-start gap-5">
                      {/* Icon */}
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "var(--brand-light)" }}
                      >
                        <ShoppingBag size={20} style={{ color: "var(--brand)" }} />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span
                            className="px-2.5 py-1 rounded-full text-xs font-700"
                            style={{
                              background: statusColors.bg,
                              color: statusColors.text,
                              border: `1px solid ${statusColors.border}`,
                            }}
                          >
                            <CheckCircle className="inline w-3 h-3 mr-1" />
                            {order.status || "Paid"}
                          </span>
                          <span
                            className="flex items-center gap-1 text-xs font-500"
                            style={{ color: "var(--muted)" }}
                          >
                            <Calendar size={12} />
                            {order.createdAt?.toDate
                              ? order.createdAt
                                  .toDate()
                                  .toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })
                              : "Processing"}
                          </span>
                        </div>

                        <h3
                          className="text-lg font-700 mb-1"
                          style={{ color: "var(--foreground)" }}
                        >
                          {order.providerName}
                        </h3>
                        <p
                          className="text-sm font-500"
                          style={{ color: "var(--brand)" }}
                        >
                          {order.category}
                        </p>
                        <div
                          className="flex items-center gap-1 mt-2 text-xs"
                          style={{ color: "var(--muted)" }}
                        >
                          <MapPin size={12} style={{ color: "var(--brand)" }} />
                          Durgapur, WB &nbsp;·&nbsp; ID: {order.id.slice(0, 8).toUpperCase()}
                        </div>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center pt-4 md:pt-0 border-t md:border-t-0"
                         style={{ borderColor: "var(--border)" }}>
                      <span className="text-xs font-600" style={{ color: "var(--muted)" }}>
                        Amount Paid
                      </span>
                      <span
                        className="text-2xl font-800 tracking-tight"
                        style={{ color: "var(--foreground)" }}
                      >
                        ₹{Number(order.amount || 299).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div
            className="py-28 flex flex-col items-center gap-5 rounded-2xl border-2 border-dashed"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--surface)" }}
            >
              <ShoppingBag size={28} style={{ color: "var(--muted)", opacity: 0.5 }} />
            </div>
            <div className="text-center">
              <p className="font-700 mb-1" style={{ color: "var(--foreground)" }}>
                No bookings yet
              </p>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Find a professional and make your first booking.
              </p>
            </div>
            <Link href="/search" className="btn-primary mt-2">
              Explore Services <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
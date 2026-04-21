"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  increment,
  getDocs,
} from "firebase/firestore";
import {
  Phone,
  MessageCircle,
  Star,
  ShieldCheck,
  MapPin,
  CheckCircle,
  ArrowLeft,
  Loader2,
  X,
  CheckCircle2,
} from "lucide-react";

export default function ProviderDetail() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [id, setId] = useState<string | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState("input");

  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState("");
  const [allReviews, setAllReviews] = useState<any[]>([]);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const getSafeId = () => {
      const queryId = searchParams.get("id");
      if (queryId) return queryId;
      const pId = Array.isArray(params?.id) ? params.id[0] : params?.id;
      if (pId && pId !== "provider") return pId;
      if (typeof window !== "undefined") {
        const path = window.location.pathname;
        const segments = path.split("/").filter(Boolean);
        const last = segments[segments.length - 1];
        if (last && last !== "provider") return last;
      }
      return null;
    };
    const finalId = getSafeId();
    if (finalId) setId(finalId);
  }, [params, searchParams]);

  useEffect(() => {
    async function getProvider() {
      if (!id) return;
      try {
        setLoading(true);
        const docRef = doc(db, "providers", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProvider(docSnap.data());
          updateDoc(docRef, { views: increment(1) }).catch(() => null);
        } else {
          setProvider(null);
        }
      } catch (error) {
        console.error("Firestore Error:", error);
      } finally {
        setLoading(false);
      }
    }
    getProvider();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const q = query(
      collection(db, "reviews"),
      where("providerId", "==", id),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setAllReviews(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    }, (err) => console.log("Review listener failed:", err));
    return () => unsub();
  }, [id]);

  const submitReview = async () => {
    if (!auth.currentUser) return alert("Please login to review");
    if (!userComment.trim()) return alert("Please write a comment");
    setSubmittingReview(true);
    try {
      const uid = auth.currentUser.uid;
      const bookingSnap = await getDocs(
        query(collection(db, "orders"), where("userId", "==", uid), where("providerId", "==", id))
      );
      if (bookingSnap.empty) {
        alert("You must book this service before leaving a review.");
        setSubmittingReview(false);
        return;
      }
      const userDocSnap = await getDoc(doc(db, "users", uid));
      const latestName = userDocSnap.exists()
        ? userDocSnap.data().name
        : auth.currentUser.displayName || "Anonymous";
      await addDoc(collection(db, "reviews"), {
        providerId: id,
        userId: uid,
        userName: latestName,
        rating: userRating,
        comment: userComment,
        createdAt: serverTimestamp(),
      });
      setUserComment("");
      setUserRating(5);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleConfirmBooking = async () => {
    const user = auth.currentUser;
    if (!user) { router.push("/login"); return; }
    setPaymentStep("processing");
    setTimeout(async () => {
      try {
        await addDoc(collection(db, "orders"), {
          userId: user.uid,
          userEmail: user.email,
          providerId: id,
          adminUid: provider.adminUid || "",
          providerName: provider.name,
          category: provider.category,
          amount: Number(provider.price) || 299,
          status: "Paid",
          createdAt: serverTimestamp(),
        });
        setPaymentStep("success");
      } catch {
        setPaymentStep("input");
      }
    }, 2000);
  };

  const openMaps = () => {
    const queryStr = encodeURIComponent(`${provider?.address || "Durgapur"} Durgapur`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${queryStr}`, "_blank");
  };

  const handleWhatsAppBooking = () => {
    if (!provider?.phone) { alert("Contact number not available."); return; }
    const clean = provider.phone.replace(/\D/g, "");
    const msg = encodeURIComponent(`Hi ${provider.name}, I need your ${provider.category} service…`);
    window.open(`https://wa.me/${clean}?text=${msg}`, "_blank");
  };

  const categoryImages: Record<string, string> = {
    Electrician: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800",
    Plumber: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=800",
    Mechanic: "https://images.unsplash.com/photo-1530046339160-ce3e5b0c7a2f?q=80&w=800",
    Tutor: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800",
    Tailor: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=800",
  };
  const fallbackImg = categoryImages[provider?.category] || "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=800";

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4" style={{ background: "var(--background)" }}>
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: "var(--brand)" }} />
        <p className="text-sm font-600 animate-pulse" style={{ color: "var(--muted)" }}>Loading profile...</p>
      </div>
    );

  if (!provider)
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4" style={{ background: "var(--background)" }}>
        <p className="font-700 text-lg" style={{ color: "var(--foreground)" }}>Provider not found.</p>
        <button className="btn-primary" onClick={() => router.push("/search")}>Browse Services</button>
      </div>
    );

  const isOwner = auth.currentUser?.uid === provider?.adminUid;
  const isOffline = provider?.status === "offline";

  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>
      {(isOwner || isOffline) && (
        <div className="w-full py-2.5 text-center text-xs font-700 sticky top-0 z-50"
          style={{ background: isOwner ? "var(--brand)" : "#dc2626", color: "#fff" }}>
          {isOwner ? "You are viewing your own professional profile" : "This provider is currently offline"}
        </div>
      )}

      <div className="container mx-auto px-5 max-w-5xl py-10">
        <button onClick={() => router.push("/search")}
          className="flex items-center gap-2 text-sm font-600 mb-8 transition-colors"
          style={{ color: "var(--muted)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--brand)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--muted)"; }}
        >
          <ArrowLeft size={16} /> Back to Search
        </button>

        {/* Profile Header Card */}
        <div className="rounded-3xl overflow-hidden mb-12"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-card)" }}>
          <div className="h-48 relative" style={{ background: "linear-gradient(135deg, #1C2B1F 0%, #2D5A3D 100%)" }}>
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
              mixBlendMode: "overlay",
            }} />
            <div className="absolute -bottom-12 left-8 w-24 h-24 rounded-3xl overflow-hidden border-4"
              style={{ borderColor: "var(--surface)", background: "var(--surface)" }}>
              <img src={provider.image && !provider.image.includes("via.placeholder") ? provider.image : fallbackImg}
                className={`w-full h-full object-cover ${isOffline && !isOwner ? "grayscale opacity-60" : ""}`}
                alt={provider.name}
                onError={(e) => { (e.target as HTMLImageElement).src = fallbackImg; }} />
            </div>
          </div>

          <div className="pt-16 pb-10 px-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-700"
                    style={{ background: "rgba(45,90,61,0.1)", color: "var(--brand)", border: "1px solid rgba(45,90,61,0.2)" }}>
                    <CheckCircle size={11} /> Verified Pro
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-700"
                    style={{ background: "var(--brand-light)", color: "var(--brand-mid)", border: "1px solid rgba(45,90,61,0.15)" }}>
                    {provider.category}
                  </span>
                </div>

                <h1 className="text-4xl font-900 tracking-tight mb-3" style={{ color: "var(--foreground)", fontFamily: "'Playfair Display', serif" }}>
                  {provider.name}
                </h1>

                <div className="flex flex-wrap items-center gap-5 text-sm">
                  <span className="flex items-center gap-1.5 font-800" style={{ color: "#C8965A" }}>
                    <Star size={18} fill="currentColor" /> {provider.rating || "5.0"}
                    <span className="font-600 ml-1" style={{ color: "var(--muted)" }}>({allReviews.length} reviews)</span>
                  </span>
                  <button onClick={openMaps} className="flex items-center gap-1.5 font-700 transition-colors"
                    style={{ color: "var(--brand-mid)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.textDecoration = "underline"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.textDecoration = "none"; }}>
                    <MapPin size={16} /> {provider.address || "Durgapur, WB"}
                  </button>
                </div>

                <p className="mt-6 text-base leading-relaxed max-w-2xl" style={{ color: "var(--muted)" }}>
                  {provider.description || `Professional expert specializing in ${provider.subCategory || provider.category} services for the Durgapur community.`}
                </p>
              </div>

              {/* Pricing Card */}
              <div className="rounded-3xl p-8 flex flex-col items-center gap-5 shrink-0 min-w-[260px]"
                style={{ background: "var(--background)", border: "1.5px solid var(--border)", boxShadow: "var(--shadow-card)" }}>
                <div className="text-center">
                  <p className="text-xs font-700 uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>Base Service Fee</p>
                  <p className="text-4xl font-900 tracking-tight" style={{ color: "var(--foreground)", fontFamily: "'Playfair Display', serif" }}>
                    ₹{provider.price || "299"}
                  </p>
                </div>
                <button disabled={isOffline || isOwner} onClick={() => setShowPaymentModal(true)}
                  className="btn-primary w-full py-4 text-base"
                  style={isOffline || isOwner ? { opacity: 0.5, cursor: "not-allowed" } : {}}>
                  {isOwner ? "Owner View" : isOffline ? "Offline" : "Book Service"}
                </button>
                <button disabled={isOwner} onClick={handleWhatsAppBooking}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-800 transition-all"
                  style={{
                    background: isOwner ? "var(--surface-2)" : "rgba(34,197,94,0.1)",
                    color: isOwner ? "var(--muted)" : "#16a34a",
                    border: `1px solid ${isOwner ? "var(--border)" : "rgba(34,197,94,0.25)"}`,
                    cursor: isOwner ? "not-allowed" : "pointer"
                  }}>
                  <MessageCircle size={20} /> {isOwner ? "Owner View" : "Direct WhatsApp"}
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-10 pt-10 grid grid-cols-2 md:grid-cols-4 gap-6"
              style={{ borderTop: "1px dashed var(--border)" }}>
              {["Identity Verified", "Background Checked", "No Hidden Costs", "24/7 Support"].map((t) => (
                <div key={t} className="flex items-center gap-2.5 text-xs font-700" style={{ color: "var(--muted)" }}>
                  <ShieldCheck size={16} style={{ color: "var(--brand)" }} /> {t}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Write Review */}
          <div className="rounded-3xl p-8"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-card)" }}>
            <h3 className="text-xl font-800 mb-6" style={{ color: "var(--foreground)", fontFamily: "'Playfair Display', serif" }}>
              Rate this Professional
            </h3>
            <div className="flex gap-2.5 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={32} className={`transition-all ${isOwner ? '' : 'cursor-pointer hover:scale-110'}`}
                  fill={star <= userRating ? "#C8965A" : "none"}
                  style={{ 
                    color: star <= userRating ? "#C8965A" : "var(--border)",
                    opacity: isOwner ? 0.5 : 1
                  }}
                  onClick={() => {
                    if (!isOwner) setUserRating(star);
                  }} />
              ))}
            </div>
            <textarea
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
              disabled={isOwner}
              className="input-modern mb-5 resize-none"
              style={{
                minHeight: 140,
                padding: "1.25rem",
                background: "var(--background)",
                color: "var(--foreground)",
                borderRadius: "1rem",
                opacity: isOwner ? 0.5 : 1,
                cursor: isOwner ? "not-allowed" : "text"
              }}
              placeholder={isOwner ? "You cannot review your own profile." : "How was your experience?"}
            />
            <button 
              onClick={submitReview} 
              disabled={submittingReview || isOwner} 
              className="btn-primary w-full py-4 font-800"
              style={submittingReview || isOwner ? { opacity: 0.5, cursor: "not-allowed" } : {}}
            >
              {isOwner ? "Cannot review own profile" : submittingReview ? "Posting..." : "Submit Review"}
            </button>
          </div>

          {/* Review List */}
          <div>
            <h3 className="text-xl font-800 mb-6" style={{ color: "var(--foreground)", fontFamily: "'Playfair Display', serif" }}>
              Verified Reviews{" "}
              {allReviews.length > 0 && (
                <span className="ml-3 px-3 py-1 rounded-full text-xs font-800"
                  style={{ background: "var(--brand-light)", color: "var(--brand)" }}>
                  {allReviews.length}
                </span>
              )}
            </h3>
            <div className="space-y-5 max-h-[550px] overflow-y-auto pr-2 no-scrollbar">
              {allReviews.length > 0 ? allReviews.map((rev) => (
                <div key={rev.id} className="rounded-2xl p-6"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-800" style={{ color: "var(--foreground)" }}>{rev.userName}</p>
                      <div className="flex gap-0.5 mt-1.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12}
                            fill={i < rev.rating ? "#C8965A" : "none"}
                            style={{ color: i < rev.rating ? "#C8965A" : "var(--border)" }} />
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] font-700" style={{ color: "var(--muted)" }}>
                      {rev.createdAt?.toDate ? rev.createdAt.toDate().toLocaleDateString("en-IN") : "Recent"}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed italic" style={{ color: "var(--muted)" }}>"{rev.comment}"</p>
                </div>
              )) : (
                <div className="py-24 text-center rounded-3xl border-2 border-dashed" style={{ borderColor: "var(--border)" }}>
                  <p className="text-sm font-600" style={{ color: "var(--muted)" }}>No reviews yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between p-6" style={{ borderBottom: "1px solid var(--border)" }}>
              <h3 className="text-lg font-800" style={{ color: "var(--foreground)", fontFamily: "'Playfair Display', serif" }}>
                {paymentStep === "success" ? "Done!" : "Confirm Booking"}
              </h3>
              <button onClick={() => { setShowPaymentModal(false); setPaymentStep("input"); }}
                className="p-2 rounded-xl transition-colors"
                style={{ color: "var(--muted)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--background)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                <X size={20} />
              </button>
            </div>
            <div className="p-8">
              {paymentStep === "input" && (
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl" style={{ background: "var(--background)", border: "1px solid var(--border)" }}>
                    <p className="text-xs font-700 uppercase tracking-widest mb-2" style={{ color: "var(--muted)" }}>Order Summary</p>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-700" style={{ color: "var(--foreground)" }}>{provider.name}</span>
                      <span className="font-800" style={{ color: "var(--brand)" }}>₹{provider.price || 299}</span>
                    </div>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>{provider.category} Service</p>
                  </div>
                  <button onClick={handleConfirmBooking} className="btn-primary w-full py-4">Confirm & Book</button>
                </div>
              )}
              {paymentStep === "processing" && (
                <div className="py-12 flex flex-col items-center gap-5">
                  <Loader2 className="w-12 h-12 animate-spin" style={{ color: "var(--brand)" }} />
                  <p className="font-700" style={{ color: "var(--muted)" }}>Securing your booking...</p>
                </div>
              )}
              {paymentStep === "success" && (
                <div className="py-10 flex flex-col items-center gap-5 text-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(45,90,61,0.1)", color: "var(--brand)" }}>
                    <CheckCircle2 size={48} />
                  </div>
                  <div>
                    <p className="font-900 text-2xl" style={{ color: "var(--foreground)", fontFamily: "'Playfair Display', serif" }}>Success!</p>
                    <p className="text-sm px-4 mt-2" style={{ color: "var(--muted)" }}>Your booking has been placed. The expert will contact you shortly.</p>
                  </div>
                  <button className="btn-primary w-full py-4 mt-4"
                    onClick={() => { setShowPaymentModal(false); router.push("/orders"); }}>
                    View Order
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useState, useEffect, useCallback } from "react";

// Hardcoded admin credentials (frontend-only auth)
const ADMIN_EMAIL = "mrinmoyg2025@gmail.com";
const ADMIN_PASSWORD = "admin@123";

interface Booking {
  _id: string;
  name: string;
  email: string;
  category: string;
  days: number;
  startDate: string;
  endDate: string;
  price: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  bookingStatus: string;
  createdAt: string;
}

interface PricingEntry {
  _id?: string;
  category: string;
  days: number;
  price: number;
}

type AdminTab = 'bookings' | 'pricing';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("bookings");

  // Pricing state
  const CATEGORIES = ["single", "double", "dormitory"] as const;
  const DURATIONS = [7, 15] as const;
  const [pricingData, setPricingData] = useState<PricingEntry[]>([]);
  const [pricingDraft, setPricingDraft] = useState<Record<string, Record<number, number>>>({});
  const [pricingLoading, setPricingLoading] = useState(false);
  const [pricingSaving, setPricingSaving] = useState(false);
  const [pricingError, setPricingError] = useState("");
  const [pricingSuccess, setPricingSuccess] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("adminAuth", "true");
    } else {
      setError("Invalid email or password");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("adminAuth");
    setEmail("");
    setPassword("");
  };

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const res = await fetch("http://localhost:5000/api/bookings/all");
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings);
      } else {
        setFetchError(data.message || "Failed to fetch bookings");
      }
    } catch {
      setFetchError("Unable to connect to server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPricing = useCallback(async () => {
    setPricingLoading(true);
    setPricingError("");
    try {
      const res = await fetch("http://localhost:5000/api/pricing");
      const data = await res.json();
      if (data.success) {
        setPricingData(data.pricing);
        // Build draft from matrix
        const draft: Record<string, Record<number, number>> = {};
        CATEGORIES.forEach((cat) => {
          draft[cat] = {};
          DURATIONS.forEach((d) => {
            draft[cat][d] = data.matrix?.[cat]?.[d] ?? 0;
          });
        });
        setPricingDraft(draft);
      } else {
        setPricingError(data.message || "Failed to fetch pricing");
      }
    } catch {
      setPricingError("Unable to connect to server.");
    } finally {
      setPricingLoading(false);
    }
  }, []);

  const handleSavePricing = async () => {
    setPricingSaving(true);
    setPricingError("");
    setPricingSuccess("");
    try {
      const entries: { category: string; days: number; price: number }[] = [];
      CATEGORIES.forEach((cat) => {
        DURATIONS.forEach((d) => {
          entries.push({ category: cat, days: d, price: pricingDraft[cat]?.[d] ?? 0 });
        });
      });

      const res = await fetch("http://localhost:5000/api/pricing/bulk", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries }),
      });
      const data = await res.json();
      if (data.success) {
        setPricingSuccess("Pricing updated successfully!");
        fetchPricing();
        setTimeout(() => setPricingSuccess(""), 3000);
      } else {
        setPricingError(data.message || "Failed to save pricing");
      }
    } catch {
      setPricingError("Unable to connect to server.");
    } finally {
      setPricingSaving(false);
    }
  };

  const handleSeedPricing = async () => {
    try {
      await fetch("http://localhost:5000/api/pricing/seed", { method: "POST" });
      fetchPricing();
    } catch {
      setPricingError("Failed to seed default pricing.");
    }
  };

  const updatePriceDraft = (category: string, days: number, value: string) => {
    const numVal = parseInt(value, 10) || 0;
    setPricingDraft((prev) => ({
      ...prev,
      [category]: { ...prev[category], [days]: numVal },
    }));
  };

  useEffect(() => {
    // Restore session on mount
    if (sessionStorage.getItem("adminAuth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
      fetchPricing();
    }
  }, [isAuthenticated, fetchBookings, fetchPricing]);

  const filteredBookings = bookings.filter(
    (b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.razorpayPaymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.razorpayOrderId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = bookings.reduce((sum, b) => sum + b.price, 0);
  const confirmedCount = bookings.filter((b) => b.bookingStatus === "confirmed").length;

  // ---------- LOGIN SCREEN ----------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1a0b2e] via-[#2d002d] to-[#050505] px-4">
        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white">Admin Login</h1>
              <p className="text-gray-400 mt-1 text-sm">Kshetra Retreat Resort — Dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold hover:from-pink-500 hover:to-purple-500 transition-all duration-200 shadow-lg shadow-pink-500/25"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ---------- DASHBOARD ----------
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0b2e] via-[#2d002d] to-[#050505] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-400 text-xs">Kshetra Retreat Resort</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-white/5 rounded-lg border border-white/10 overflow-hidden">
              <button
                onClick={() => setActiveTab("bookings")}
                className={`px-4 py-2 text-sm font-medium transition ${
                  activeTab === "bookings"
                    ? "bg-pink-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                Bookings
              </button>
              <button
                onClick={() => setActiveTab("pricing")}
                className={`px-4 py-2 text-sm font-medium transition ${
                  activeTab === "pricing"
                    ? "bg-pink-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                Pricing
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm rounded-lg border border-white/10 hover:bg-white/10 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === "bookings" && (
          <>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <p className="text-gray-400 text-sm">Total Bookings</p>
            <p className="text-3xl font-bold mt-1">{bookings.length}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <p className="text-gray-400 text-sm">Confirmed</p>
            <p className="text-3xl font-bold mt-1 text-green-400">{confirmedCount}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <p className="text-gray-400 text-sm">Total Revenue</p>
            <p className="text-3xl font-bold mt-1 text-pink-400">₹{totalRevenue.toLocaleString("en-IN")}</p>
          </div>
        </div>

        {/* Search + Refresh */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by name, email, or payment ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
          />
          <button
            onClick={fetchBookings}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-medium transition disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {/* Error */}
        {fetchError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
            {fetchError}
          </div>
        )}

        {/* Table */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left px-4 py-3 font-semibold text-gray-300">#</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-300">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-300">Email</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-300">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-300">Days</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-300">Start Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-300">End Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-300">Price</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-300">Payment ID</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-300">Order ID</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-300">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-300">Booked On</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={12} className="text-center py-12 text-gray-400">
                      Loading bookings...
                    </td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="text-center py-12 text-gray-400">
                      {searchTerm ? "No bookings match your search." : "No bookings found."}
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking, index) => (
                    <tr
                      key={booking._id}
                      className="border-b border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="px-4 py-3 text-gray-400">{index + 1}</td>
                      <td className="px-4 py-3 font-medium">{booking.name}</td>
                      <td className="px-4 py-3 text-gray-300">{booking.email}</td>
                      <td className="px-4 py-3">
                        <span className="capitalize px-2 py-0.5 rounded-full text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {booking.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">{booking.days}</td>
                      <td className="px-4 py-3 text-gray-300">
                        {new Date(booking.startDate).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {new Date(booking.endDate).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-4 py-3 font-semibold text-pink-400">
                        ₹{booking.price.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs font-mono">
                        {booking.razorpayPaymentId}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs font-mono">
                        {booking.razorpayOrderId}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`capitalize px-2 py-0.5 rounded-full text-xs border ${
                            booking.bookingStatus === "confirmed"
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : booking.bookingStatus === "pending"
                              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                              : "bg-red-500/20 text-red-400 border-red-500/30"
                          }`}
                        >
                          {booking.bookingStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {new Date(booking.createdAt).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer count */}
        {!loading && filteredBookings.length > 0 && (
          <p className="text-gray-500 text-xs mt-3">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </p>
        )}
          </>
        )}

        {activeTab === "pricing" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Pricing Management</h2>
                <p className="text-gray-400 text-sm mt-1">Set prices for each room category and duration</p>
              </div>
              {/* <button
                onClick={handleSeedPricing}
                className="px-4 py-2 text-sm rounded-lg border border-white/10 hover:bg-white/10 transition text-gray-300"
                title="Seed default pricing if database is empty"
              >
                Seed Defaults
              </button> */}
            </div>

            {pricingError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
                {pricingError}
              </div>
            )}

            {pricingSuccess && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-lg px-4 py-3 mb-6">
                {pricingSuccess}
              </div>
            )}

            {pricingLoading ? (
              <div className="text-center py-12 text-gray-400">Loading pricing...</div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="text-left px-6 py-4 font-semibold text-gray-300">Room Category</th>
                      {DURATIONS.map((d) => (
                        <th key={d} className="text-left px-6 py-4 font-semibold text-gray-300">
                          {d} Days (₹)
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {CATEGORIES.map((cat) => (
                      <tr key={cat} className="border-b border-white/5 hover:bg-white/5 transition">
                        <td className="px-6 py-4">
                          <span className="capitalize px-3 py-1 rounded-full text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
                            {cat}
                          </span>
                        </td>
                        {DURATIONS.map((d) => (
                          <td key={d} className="px-6 py-4">
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                              <input
                                type="number"
                                min={0}
                                value={pricingDraft[cat]?.[d] ?? ""}
                                onChange={(e) => updatePriceDraft(cat, d, e.target.value)}
                                className="w-full pl-8 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition font-mono"
                              />
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="px-6 py-4 border-t border-white/10 flex justify-end">
                  <button
                    onClick={handleSavePricing}
                    disabled={pricingSaving}
                    className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold hover:from-pink-500 hover:to-purple-500 transition-all duration-200 shadow-lg shadow-pink-500/25 disabled:opacity-50"
                  >
                    {pricingSaving ? "Saving..." : "Save All Prices"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

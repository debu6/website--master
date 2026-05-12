"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { partnerAPI } from "../services/partnerAPI";
import { clearAuthToken } from "../utils/cookies";
import { LogOut, Menu, X } from "lucide-react";

interface PartnerBooking {
  _id: string;
  customerName: string;
  customerEmail: string;
  bookingDate: string;
  amount: number;
  status: string;
  type: "yoga" | "vehicle" | "ayurveda";
}

type BookingTab = "yoga" | "vehicles" | "ayurveda";

export default function PartnerDashboard() {
  const router = useRouter();
  const { isAuth, user, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<BookingTab>("yoga");
  const [bookings, setBookings] = useState<PartnerBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuth) {
      router.push("/partner-login");
    }
  }, [isAuth, isLoading, router]);

  useEffect(() => {
    // Check if user is a partner
    if (isAuth && user?.type !== "partner") {
      router.push("/profile");
    }
  }, [isAuth, user]);

  const handleLogout = () => {
    logout();
    clearAuthToken();
    router.push("/partner-login");
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
      completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    };
    return styles[status] || styles.pending;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a0b2e] via-[#2d002d] to-[#050505] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuth || user?.type !== "partner") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0b2e] via-[#2d002d] to-[#050505]">
      {/* Header */}
      <header className="border-b border-purple-500/20 sticky top-0 z-50 bg-[#1a0b2e]/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white font-urbanist">
              {user?.companyName || "Partner Dashboard"}
            </h1>
            <p className="text-purple-300 text-sm">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            <LogOut size={18} />
            Logout
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-purple-500/20 bg-[#1a0b2e]/80">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-purple-500/20">
          <button
            onClick={() => setActiveTab("yoga")}
            className={`px-4 py-2 font-semibold font-urbanist transition ${
              activeTab === "yoga"
                ? "text-magenta-accent border-b-2 border-magenta-accent"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Yoga Retreat Bookings
          </button>
          <button
            onClick={() => setActiveTab("vehicles")}
            className={`px-4 py-2 font-semibold font-urbanist transition ${
              activeTab === "vehicles"
                ? "text-magenta-accent border-b-2 border-magenta-accent"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Vehicle Rentals
          </button>
          <button
            onClick={() => setActiveTab("ayurveda")}
            className={`px-4 py-2 font-semibold font-urbanist transition ${
              activeTab === "ayurveda"
                ? "text-magenta-accent border-b-2 border-magenta-accent"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Ayurveda Bookings
          </button>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-400">Loading bookings...</div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12 bg-purple-500/5 rounded-lg border border-purple-500/10">
            <div className="text-gray-400 mb-4">
              No {activeTab === "yoga" ? "yoga retreat" : activeTab === "vehicles" ? "vehicle rental" : "ayurveda"} bookings yet
            </div>
            <Link
              href="/"
              className="inline-block px-6 py-2 bg-magenta-accent text-white rounded-lg hover:bg-magenta-accent/80 transition font-urbanist"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4 hover:border-magenta-accent/50 transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-white font-semibold font-urbanist">
                      {booking.customerName}
                    </h3>
                    <p className="text-sm text-gray-400">{booking.customerEmail}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded border ${getStatusBadge(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-300">
                    Date: {new Date(booking.bookingDate).toLocaleDateString()}
                  </p>
                  <p className="text-magenta-accent font-semibold">
                    ₹{booking.amount?.toLocaleString() || "0"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded text-red-400">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { authAPI } from "../services/authAPI";
import { clearAuthToken } from "../utils/cookies";

interface YogaBooking {
  _id: string;
  name: string;
  email: string;
  category: string;
  days: number;
  startDate: string;
  endDate: string;
  price: number;
  razorpayPaymentId: string;
  bookingStatus: string;
  createdAt: string;
}

interface VehicleBooking {
  _id: string;
  vehicleName: string;
  customerName: string;
  customerEmail: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalPrice: number;
  razorpayPaymentId: string;
  bookingStatus: string;
  createdAt: string;
}

type BookingTab = "yoga" | "vehicles";

export default function ProfilePage() {
  const router = useRouter();
  const { isAuth, user, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<BookingTab>("yoga");
  const [yogaBookings, setYogaBookings] = useState<YogaBooking[]>([]);
  const [vehicleBookings, setVehicleBookings] = useState<VehicleBooking[]>([]);
  const [loadingYoga, setLoadingYoga] = useState(false);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuth) {
      router.push("/");
    }
  }, [isAuth, isLoading, router]);

  useEffect(() => {
    if (isAuth) {
      fetchYogaBookings();
      fetchVehicleBookings();
    }
  }, [isAuth]);

  const fetchYogaBookings = async () => {
    setLoadingYoga(true);
    setError("");
    try {
      const response = await authAPI.getYogaBookings();
      if (response.data.success) {
        setYogaBookings(response.data.bookings || []);
      }
    } catch (err: any) {
      console.error("Failed to fetch yoga bookings:", err);
    } finally {
      setLoadingYoga(false);
    }
  };

  const fetchVehicleBookings = async () => {
    setLoadingVehicles(true);
    try {
      const response = await authAPI.getVehicleBookings();
      if (response.data.success) {
        setVehicleBookings(response.data.data || []);
      }
    } catch (err: any) {
      console.error("Failed to fetch vehicle bookings:", err);
    } finally {
      setLoadingVehicles(false);
    }
  };

  const handleLogout = () => {
    logout();
    clearAuthToken();
    router.push("/");
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
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

  if (!isAuth) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0b2e] via-[#2d002d] to-[#050505] pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Profile Header */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{user?.name || "User"}</h1>
                <p className="text-gray-400">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 font-medium hover:bg-red-500/30 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Booking Tabs */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          {/* Tab Header */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActiveTab("yoga")}
              className={`flex-1 px-6 py-4 text-center font-medium transition ${
                activeTab === "yoga"
                  ? "bg-purple-600/20 text-purple-400 border-b-2 border-purple-500"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Yoga Retreat Bookings
              </div>
            </button>
            <button
              onClick={() => setActiveTab("vehicles")}
              className={`flex-1 px-6 py-4 text-center font-medium transition ${
                activeTab === "vehicles"
                  ? "bg-cyan-600/20 text-cyan-400 border-b-2 border-cyan-500"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 4h4m-4 4h8M4 7a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" />
                </svg>
                Vehicle Rentals
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Yoga Bookings */}
            {activeTab === "yoga" && (
              <div>
                {loadingYoga ? (
                  <div className="text-center py-12 text-gray-400">Loading yoga bookings...</div>
                ) : yogaBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">No yoga retreat bookings yet</div>
                    <Link
                      href="/yoga"
                      className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 transition"
                    >
                      Explore Yoga Programs
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {yogaBookings.map((booking) => (
                      <div
                        key={booking._id}
                        className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/[0.07] transition"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="capitalize px-3 py-1 rounded-full text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
                                {booking.category}
                              </span>
                              <span className={`capitalize px-3 py-1 rounded-full text-xs border ${getStatusBadge(booking.bookingStatus)}`}>
                                {booking.bookingStatus}
                              </span>
                            </div>
                            <p className="text-white font-medium">{booking.days} Days Yoga Program</p>
                            <p className="text-gray-400 text-sm mt-1">
                              {new Date(booking.startDate).toLocaleDateString("en-IN")} - {new Date(booking.endDate).toLocaleDateString("en-IN")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-pink-400">₹{booking.price.toLocaleString("en-IN")}</p>
                            <p className="text-gray-500 text-xs mt-1">
                              Booked on {new Date(booking.createdAt).toLocaleDateString("en-IN")}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Vehicle Bookings */}
            {activeTab === "vehicles" && (
              <div>
                {loadingVehicles ? (
                  <div className="text-center py-12 text-gray-400">Loading vehicle rentals...</div>
                ) : vehicleBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">No vehicle rentals yet</div>
                    <Link
                      href="/rent-vehicle"
                      className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium hover:opacity-90 transition"
                    >
                      Rent a Vehicle
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {vehicleBookings.map((booking) => (
                      <div
                        key={booking._id}
                        className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/[0.07] transition"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="px-3 py-1 rounded-full text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium">
                                Vehicle
                              </span>
                              <span className={`capitalize px-3 py-1 rounded-full text-xs border ${getStatusBadge(booking.bookingStatus)}`}>
                                {booking.bookingStatus}
                              </span>
                            </div>
                            <p className="text-white font-medium">{booking.vehicleName}</p>
                            <p className="text-gray-400 text-sm mt-1">
                              {new Date(booking.startDate).toLocaleDateString("en-IN")} - {new Date(booking.endDate).toLocaleDateString("en-IN")} ({booking.totalDays} days)
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-cyan-400">₹{booking.totalPrice.toLocaleString("en-IN")}</p>
                            <p className="text-gray-500 text-xs mt-1">
                              Booked on {new Date(booking.createdAt).toLocaleDateString("en-IN")}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

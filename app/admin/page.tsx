"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  fetchAllVehiclesAdmin, 
  createVehicle, 
  updateVehicle, 
  deleteVehicle, 
  seedVehicles,
  fetchVehicleBookings,
  Vehicle,
  VehicleBooking,
  VehicleBookingStats
} from "../services/vehicleAPI";
import ImageUploader from "../components/ui/ImageUploader";

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

type AdminTab = 'bookings' | 'pricing' | 'vehicles' | 'vehicleBookings';

// Default empty vehicle for form
const emptyVehicleForm = {
  name: '',
  subtitle: '',
  type: 'scooter' as 'scooter' | 'bike' | 'car',
  pricePerDay: 0,
  image: '',
  thumbnails: [] as string[],
  description: '',
  specs: {
    passengers: 2,
    fuel: 'Petrol',
    transmission: 'Automatic',
    location: 'Kshetra Retreat',
    mileage: '',
    engine: ''
  },
  features: [] as string[],
  deposit: 0,
  isActive: true
};

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

  // Vehicles state
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);
  const [vehiclesError, setVehiclesError] = useState("");
  const [vehicleSearchTerm, setVehicleSearchTerm] = useState("");
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [vehicleForm, setVehicleForm] = useState(emptyVehicleForm);
  const [vehicleSaving, setVehicleSaving] = useState(false);
  const [vehicleFormError, setVehicleFormError] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Vehicle Bookings state
  const [vehicleBookings, setVehicleBookings] = useState<VehicleBooking[]>([]);
  const [vehicleBookingsStats, setVehicleBookingsStats] = useState<VehicleBookingStats>({ totalBookings: 0, confirmedBookings: 0, totalRevenue: 0 });
  const [vehicleBookingsLoading, setVehicleBookingsLoading] = useState(false);
  const [vehicleBookingsError, setVehicleBookingsError] = useState("");
  const [vehicleBookingSearchTerm, setVehicleBookingSearchTerm] = useState("");

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

  // Vehicle functions
  const loadVehicles = useCallback(async () => {
    setVehiclesLoading(true);
    setVehiclesError("");
    try {
      const data = await fetchAllVehiclesAdmin();
      setVehicles(data);
    } catch (err: any) {
      setVehiclesError(err.message || "Failed to fetch vehicles");
    } finally {
      setVehiclesLoading(false);
    }
  }, []);

  const handleOpenVehicleModal = (vehicle?: Vehicle) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setVehicleForm({
        name: vehicle.name,
        subtitle: vehicle.subtitle || '',
        type: vehicle.type,
        pricePerDay: vehicle.pricePerDay,
        image: vehicle.image,
        thumbnails: vehicle.thumbnails || [],
        description: vehicle.description || '',
        specs: vehicle.specs || emptyVehicleForm.specs,
        features: vehicle.features || [],
        deposit: vehicle.deposit,
        isActive: vehicle.isActive
      });
    } else {
      setEditingVehicle(null);
      setVehicleForm(emptyVehicleForm);
    }
    setVehicleFormError("");
    setShowVehicleModal(true);
  };

  const handleCloseVehicleModal = () => {
    setShowVehicleModal(false);
    setEditingVehicle(null);
    setVehicleForm(emptyVehicleForm);
    setVehicleFormError("");
  };

  const handleSaveVehicle = async () => {
    if (!vehicleForm.name.trim()) {
      setVehicleFormError("Vehicle name is required");
      return;
    }
    if (!vehicleForm.image.trim()) {
      setVehicleFormError("Vehicle image URL is required");
      return;
    }
    if (vehicleForm.pricePerDay <= 0) {
      setVehicleFormError("Price per day must be greater than 0");
      return;
    }

    setVehicleSaving(true);
    setVehicleFormError("");
    try {
      if (editingVehicle) {
        await updateVehicle(editingVehicle._id, vehicleForm);
      } else {
        await createVehicle(vehicleForm);
      }
      handleCloseVehicleModal();
      loadVehicles();
    } catch (err: any) {
      setVehicleFormError(err.message || "Failed to save vehicle");
    } finally {
      setVehicleSaving(false);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    try {
      await deleteVehicle(id);
      setDeleteConfirmId(null);
      loadVehicles();
    } catch (err: any) {
      setVehiclesError(err.message || "Failed to delete vehicle");
    }
  };

  const handleSeedVehicles = async () => {
    setVehiclesLoading(true);
    try {
      await seedVehicles();
      loadVehicles();
    } catch (err: any) {
      setVehiclesError(err.message || "Failed to seed vehicles");
    } finally {
      setVehiclesLoading(false);
    }
  };

  // Vehicle Bookings functions
  const loadVehicleBookings = useCallback(async () => {
    setVehicleBookingsLoading(true);
    setVehicleBookingsError("");
    try {
      const result = await fetchVehicleBookings();
      setVehicleBookings(result.data);
      setVehicleBookingsStats(result.stats);
    } catch (err: any) {
      setVehicleBookingsError(err.message || "Failed to fetch vehicle bookings");
    } finally {
      setVehicleBookingsLoading(false);
    }
  }, []);

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.name.toLowerCase().includes(vehicleSearchTerm.toLowerCase()) ||
      v.type.toLowerCase().includes(vehicleSearchTerm.toLowerCase())
  );

  const filteredVehicleBookings = vehicleBookings.filter(
    (b) =>
      b.customerName.toLowerCase().includes(vehicleBookingSearchTerm.toLowerCase()) ||
      b.customerEmail.toLowerCase().includes(vehicleBookingSearchTerm.toLowerCase()) ||
      b.vehicleName.toLowerCase().includes(vehicleBookingSearchTerm.toLowerCase()) ||
      (b.razorpayPaymentId && b.razorpayPaymentId.toLowerCase().includes(vehicleBookingSearchTerm.toLowerCase()))
  );

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
      loadVehicles();
      loadVehicleBookings();
    }
  }, [isAuthenticated, fetchBookings, fetchPricing, loadVehicles, loadVehicleBookings]);

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
            {/* Section-based tabs */}
            <div className="flex items-center gap-2 bg-white/5 rounded-xl border border-white/10 p-1">
              {/* Yoga Section */}
              <div className="flex items-center">
                <span className="px-3 py-1.5 text-xs font-medium text-purple-400 bg-purple-500/10 rounded-lg mr-1">
                  <svg className="w-3.5 h-3.5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Yoga
                </span>
                <button
                  onClick={() => setActiveTab("bookings")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                    activeTab === "bookings"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Bookings
                </button>
                <button
                  onClick={() => setActiveTab("pricing")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                    activeTab === "pricing"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Pricing
                </button>
              </div>

              {/* Divider */}
              <div className="w-px h-8 bg-white/10"></div>

              {/* Vehicle Section */}
              <div className="flex items-center">
                <span className="px-3 py-1.5 text-xs font-medium text-cyan-400 bg-cyan-500/10 rounded-lg mr-1">
                  <svg className="w-3.5 h-3.5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 4h4m-4 4h8M4 7a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" />
                  </svg>
                  Vehicles
                </span>
              
                <button
                  onClick={() => setActiveTab("vehicleBookings")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                    activeTab === "vehicleBookings"
                      ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Bookings
                </button>
                  <button
                  onClick={() => setActiveTab("vehicles")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                    activeTab === "vehicles"
                      ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Pricing
                </button>
              </div>
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
            {/* Section Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 text-xs font-medium text-purple-400 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  Yoga Retreat
                </span>
              </div>
              <h2 className="text-2xl font-bold">Yoga Program Bookings</h2>
              <p className="text-gray-400 text-sm mt-1">View and manage all yoga retreat bookings and payments</p>
            </div>

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
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 text-xs font-medium text-purple-400 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    Yoga Retreat
                  </span>
                </div>
                <h2 className="text-2xl font-bold">Yoga Program Pricing</h2>
                <p className="text-gray-400 text-sm mt-1">Set accommodation prices for yoga retreat programs by room category and duration</p>
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

        {/* Vehicles Tab */}
        {activeTab === "vehicles" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 text-xs font-medium text-cyan-400 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                    Vehicle Rentals
                  </span>
                </div>
                <h2 className="text-2xl font-bold">Vehicle Pricing & Management</h2>
                <p className="text-gray-400 text-sm mt-1">Add, edit, or remove vehicles and set rental prices</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSeedVehicles}
                  className="px-4 py-2 text-sm rounded-lg border border-white/10 hover:bg-white/10 transition text-gray-300"
                  title="Seed default vehicles"
                >
                  Seed Defaults
                </button>
                <button
                  onClick={() => handleOpenVehicleModal()}
                  className="px-4 py-2 text-sm rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-medium transition"
                >
                  + Add Vehicle
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <input
                type="text"
                placeholder="Search vehicles by name or type..."
                value={vehicleSearchTerm}
                onChange={(e) => setVehicleSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
              />
              <button
                onClick={loadVehicles}
                disabled={vehiclesLoading}
                className="px-5 py-2.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-medium transition disabled:opacity-50"
              >
                {vehiclesLoading ? "Loading..." : "Refresh"}
              </button>
            </div>

            {vehiclesError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
                {vehiclesError}
              </div>
            )}

            {/* Vehicles Table */}
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">Image</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">Name</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">Type</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">Price/Day</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">Deposit</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">Status</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehiclesLoading ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-gray-400">
                          Loading vehicles...
                        </td>
                      </tr>
                    ) : filteredVehicles.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-gray-400">
                          {vehicleSearchTerm ? "No vehicles match your search." : "No vehicles found. Click 'Seed Defaults' to add sample vehicles."}
                        </td>
                      </tr>
                    ) : (
                      filteredVehicles.map((vehicle) => (
                        <tr key={vehicle._id} className="border-b border-white/5 hover:bg-white/5 transition">
                          <td className="px-4 py-3">
                            <div className="w-16 h-12 rounded-lg bg-cover bg-center bg-white/5" style={{ backgroundImage: `url(${vehicle.image})` }} />
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium">{vehicle.name}</div>
                            <div className="text-gray-500 text-xs">{vehicle.subtitle}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="capitalize px-2 py-0.5 rounded-full text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              {vehicle.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-pink-400">₹{vehicle.pricePerDay.toLocaleString()}</td>
                          <td className="px-4 py-3 text-gray-300">₹{vehicle.deposit.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs border ${vehicle.isActive ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}`}>
                              {vehicle.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleOpenVehicleModal(vehicle)}
                                className="px-3 py-1 text-xs rounded-lg bg-white/10 hover:bg-white/20 transition"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(vehicle._id)}
                                className="px-3 py-1 text-xs rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {!vehiclesLoading && filteredVehicles.length > 0 && (
              <p className="text-gray-500 text-xs mt-3">
                Showing {filteredVehicles.length} of {vehicles.length} vehicles
              </p>
            )}
          </div>
        )}

        {/* Vehicle Bookings Tab */}
        {activeTab === "vehicleBookings" && (
          <>
            {/* Section Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 text-xs font-medium text-cyan-400 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                  Vehicle Rentals
                </span>
              </div>
              <h2 className="text-2xl font-bold">Vehicle Bookings</h2>
              <p className="text-gray-400 text-sm mt-1">Track all vehicle rental reservations and payments</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <p className="text-gray-400 text-sm">Total Vehicle Rentals</p>
                <p className="text-3xl font-bold mt-1">{vehicleBookingsStats.totalBookings}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <p className="text-gray-400 text-sm">Confirmed</p>
                <p className="text-3xl font-bold mt-1 text-green-400">{vehicleBookingsStats.confirmedBookings}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold mt-1 text-pink-400">₹{vehicleBookingsStats.totalRevenue.toLocaleString("en-IN")}</p>
              </div>
            </div>

            {/* Search + Refresh */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <input
                type="text"
                placeholder="Search by customer name, email, vehicle, or payment ID..."
                value={vehicleBookingSearchTerm}
                onChange={(e) => setVehicleBookingSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
              />
              <button
                onClick={loadVehicleBookings}
                disabled={vehicleBookingsLoading}
                className="px-5 py-2.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-medium transition disabled:opacity-50"
              >
                {vehicleBookingsLoading ? "Loading..." : "Refresh"}
              </button>
            </div>

            {vehicleBookingsError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
                {vehicleBookingsError}
              </div>
            )}

            {/* Vehicle Bookings Table */}
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">#</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">Customer</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">Vehicle</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">Start Date</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">End Date</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">Days</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">Total Price</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">Payment ID</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">Status</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">Booked On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicleBookingsLoading ? (
                      <tr>
                        <td colSpan={10} className="text-center py-12 text-gray-400">
                          Loading vehicle rentals...
                        </td>
                      </tr>
                    ) : filteredVehicleBookings.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="text-center py-12 text-gray-400">
                          {vehicleBookingSearchTerm ? "No rentals match your search." : "No vehicle rentals found."}
                        </td>
                      </tr>
                    ) : (
                      filteredVehicleBookings.map((booking, index) => (
                        <tr key={booking._id} className="border-b border-white/5 hover:bg-white/5 transition">
                          <td className="px-4 py-3 text-gray-400">{index + 1}</td>
                          <td className="px-4 py-3">
                            <div className="font-medium">{booking.customerName}</div>
                            <div className="text-gray-500 text-xs">{booking.customerEmail}</div>
                            <div className="text-gray-500 text-xs">{booking.customerPhone}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="capitalize px-2 py-0.5 rounded-full text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              {booking.vehicleName}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-300">
                            {new Date(booking.startDate).toLocaleDateString("en-IN")}
                          </td>
                          <td className="px-4 py-3 text-gray-300">
                            {new Date(booking.endDate).toLocaleDateString("en-IN")}
                          </td>
                          <td className="px-4 py-3">{booking.totalDays}</td>
                          <td className="px-4 py-3 font-semibold text-pink-400">
                            ₹{booking.totalPrice.toLocaleString("en-IN")}
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs font-mono">
                            {booking.razorpayPaymentId || "-"}
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

            {!vehicleBookingsLoading && filteredVehicleBookings.length > 0 && (
              <p className="text-gray-500 text-xs mt-3">
                Showing {filteredVehicleBookings.length} of {vehicleBookings.length} rentals
              </p>
            )}
          </>
        )}
      </main>

      {/* Vehicle Add/Edit Modal */}
      {showVehicleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1a0b2e] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 shadow-2xl">
            <div className="sticky top-0 bg-[#1a0b2e] border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">{editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}</h3>
              <button onClick={handleCloseVehicleModal} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5">
              {vehicleFormError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
                  {vehicleFormError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Name *</label>
                  <input
                    type="text"
                    value={vehicleForm.name}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, name: e.target.value })}
                    placeholder="Honda Activa 6G"
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Subtitle</label>
                  <input
                    type="text"
                    value={vehicleForm.subtitle}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, subtitle: e.target.value })}
                    placeholder="Honda Activa 6G (2023)"
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Type *</label>
                  <select
                    value={vehicleForm.type}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, type: e.target.value as 'scooter' | 'bike' | 'car' })}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                  >
                    <option value="scooter">Scooter</option>
                    <option value="bike">Bike</option>
                    <option value="car">Car</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Price per Day (₹) *</label>
                  <input
                    type="number"
                    min={0}
                    value={vehicleForm.pricePerDay}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, pricePerDay: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Deposit (₹) *</label>
                  <input
                    type="number"
                    min={0}
                    value={vehicleForm.deposit}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, deposit: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                  />
                </div>
              </div>

              <div>
                <ImageUploader
                  currentImage={vehicleForm.image}
                  onImageUploaded={(imageUrl) => setVehicleForm({ ...vehicleForm, image: imageUrl })}
                  aspectRatio={4 / 3}
                  label="Vehicle Image"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
                <textarea
                  value={vehicleForm.description}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, description: e.target.value })}
                  rows={3}
                  placeholder="A brief description of the vehicle..."
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Features (comma-separated)</label>
                <input
                  type="text"
                  value={vehicleForm.features.join(", ")}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, features: e.target.value.split(",").map(f => f.trim()).filter(f => f) })}
                  placeholder="Easy to ride, Storage space, Lightweight"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Passengers</label>
                  <input
                    type="number"
                    min={1}
                    value={vehicleForm.specs.passengers}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, specs: { ...vehicleForm.specs, passengers: parseInt(e.target.value) || 2 } })}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Fuel</label>
                  <input
                    type="text"
                    value={vehicleForm.specs.fuel}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, specs: { ...vehicleForm.specs, fuel: e.target.value } })}
                    placeholder="Petrol"
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Transmission</label>
                  <input
                    type="text"
                    value={vehicleForm.specs.transmission}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, specs: { ...vehicleForm.specs, transmission: e.target.value } })}
                    placeholder="Automatic"
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Mileage</label>
                  <input
                    type="text"
                    value={vehicleForm.specs.mileage}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, specs: { ...vehicleForm.specs, mileage: e.target.value } })}
                    placeholder="45 kmpl"
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Engine</label>
                  <input
                    type="text"
                    value={vehicleForm.specs.engine}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, specs: { ...vehicleForm.specs, engine: e.target.value } })}
                    placeholder="110cc"
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Location</label>
                  <input
                    type="text"
                    value={vehicleForm.specs.location}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, specs: { ...vehicleForm.specs, location: e.target.value } })}
                    placeholder="Kshetra Retreat"
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={vehicleForm.isActive}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, isActive: e.target.checked })}
                    className="w-4 h-4 rounded bg-white/5 border-white/20 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="text-sm text-gray-300">Active (visible on website)</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={handleCloseVehicleModal}
                  className="flex-1 py-2.5 rounded-lg border border-white/10 text-white font-medium hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveVehicle}
                  disabled={vehicleSaving}
                  className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold hover:from-pink-500 hover:to-purple-500 transition disabled:opacity-50"
                >
                  {vehicleSaving ? "Saving..." : editingVehicle ? "Update Vehicle" : "Add Vehicle"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1a0b2e] w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Delete Vehicle?</h3>
            <p className="text-gray-400 text-sm mb-6">This action cannot be undone. The vehicle will be permanently removed.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-lg border border-white/10 text-white font-medium hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteVehicle(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-500 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
import {
  fetchAllTreatmentsAdmin,
  createTreatment,
  updateTreatment,
  deleteTreatment,
  seedTreatments,
  fetchAyurvedaBookings,
  AyurvedaTreatment,
  AyurvedaBooking,
  AyurvedaBookingStats
} from "../services/ayurvedaAPI";
import ImageUploader from "../components/ui/ImageUploader";

// Hardcoded credentials (frontend-only auth)
const ADMIN_EMAIL = "mrinmoyg2025@gmail.com";
const ADMIN_PASSWORD = "admin@123";
const VENDOR_EMAIL = "vendor@kshetra.com";
const VENDOR_PASSWORD = "vendor@123";

type UserRole = "admin" | "vendor";

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

type AdminTab = 'bookings' | 'pricing' | 'vehicles' | 'vehicleBookings' | 'ayurvedaTreatments' | 'ayurvedaBookings';

// Default empty vehicle for form
const emptyVehicleForm = {
  name: '',
  subtitle: '',
  type: 'scooter' as 'scooter' | 'bike' | 'car',
  pricePerDay: 0,
  partnerPricePerDay: 0,
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
  partnerDeposit: 0,
  isActive: true
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("bookings");
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({ yoga: true });

  // Pricing state
  const CATEGORIES = ["single", "double", "dormitory"] as const;
  const DURATIONS = [7, 15] as const;
  const [pricingData, setPricingData] = useState<PricingEntry[]>([]);
  const [pricingDraft, setPricingDraft] = useState<Record<string, Record<number, number>>>({});
  const [pricingLoading, setPricingLoading] = useState(false);
  const [pricingSaving, setPricingSaving] = useState(false);
  const [pricingError, setPricingError] = useState("");
  const [pricingSuccess, setPricingSuccess] = useState("");

  // Partner Pricing state
  const [partnerPricingData, setPartnerPricingData] = useState<PricingEntry[]>([]);
  const [partnerPricingDraft, setPartnerPricingDraft] = useState<Record<string, Record<number, number>>>({});
  const [partnerPricingLoading, setPartnerPricingLoading] = useState(false);
  const [partnerPricingSaving, setPartnerPricingSaving] = useState(false);
  const [partnerPricingError, setPartnerPricingError] = useState("");
  const [partnerPricingSuccess, setPartnerPricingSuccess] = useState("");

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

  // Ayurveda Treatments state
  const AYURVEDA_CATEGORIES = ['Ayurvedic Massage', 'Spa Massage', 'Special Treatment', 'Combo Packages'] as const;
  const [ayurvedaTreatments, setAyurvedaTreatments] = useState<AyurvedaTreatment[]>([]);
  const [ayurvedaTreatmentsLoading, setAyurvedaTreatmentsLoading] = useState(false);
  const [ayurvedaTreatmentsError, setAyurvedaTreatmentsError] = useState("");
  const [ayurvedaSearchTerm, setAyurvedaSearchTerm] = useState("");
  const [showAyurvedaModal, setShowAyurvedaModal] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<AyurvedaTreatment | null>(null);
  const [treatmentForm, setTreatmentForm] = useState({ name: '', category: 'Ayurvedic Massage' as string, price: 0, duration: '', description: '', isActive: true });
  const [treatmentSaving, setTreatmentSaving] = useState(false);
  const [treatmentFormError, setTreatmentFormError] = useState("");
  const [deleteTreatmentConfirmId, setDeleteTreatmentConfirmId] = useState<string | null>(null);

  // Ayurveda Bookings state
  const [ayurvedaBookings, setAyurvedaBookings] = useState<AyurvedaBooking[]>([]);
  const [ayurvedaBookingsStats, setAyurvedaBookingsStats] = useState<AyurvedaBookingStats>({ totalBookings: 0, confirmedBookings: 0, totalRevenue: 0 });
  const [ayurvedaBookingsLoading, setAyurvedaBookingsLoading] = useState(false);
  const [ayurvedaBookingsError, setAyurvedaBookingsError] = useState("");
  const [ayurvedaBookingSearchTerm, setAyurvedaBookingSearchTerm] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setUserRole("admin");
      setIsAuthenticated(true);
      setActiveTab("bookings");
      setOpenMenus({ yoga: true });
      sessionStorage.setItem("adminAuth", "true");
      sessionStorage.setItem("adminRole", "admin");
    } else if (email === VENDOR_EMAIL && password === VENDOR_PASSWORD) {
      setUserRole("vendor");
      setIsAuthenticated(true);
      setActiveTab("vehicleBookings");
      setOpenMenus({ vehicles: true });
      sessionStorage.setItem("adminAuth", "true");
      sessionStorage.setItem("adminRole", "vendor");
    } else {
      setError("Invalid email or password");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole("admin");
    sessionStorage.removeItem("adminAuth");
    sessionStorage.removeItem("adminRole");
    setEmail("");
    setPassword("");
  };

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/all`);
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pricing`);
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

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pricing/bulk`, {
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
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pricing/seed`, { method: "POST" });
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

  // Partner pricing functions
  const fetchPartnerPricing = useCallback(async () => {
    setPartnerPricingLoading(true);
    setPartnerPricingError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pricing/partner`);
      const data = await res.json();
      if (data.success) {
        setPartnerPricingData(data.pricing);
        // Build draft from matrix
        const draft: Record<string, Record<number, number>> = {};
        CATEGORIES.forEach((cat) => {
          draft[cat] = {};
          DURATIONS.forEach((d) => {
            draft[cat][d] = data.matrix?.[cat]?.[d] ?? 0;
          });
        });
        setPartnerPricingDraft(draft);
      } else {
        setPartnerPricingError(data.message || "Failed to fetch partner pricing");
      }
    } catch {
      setPartnerPricingError("Unable to connect to server.");
    } finally {
      setPartnerPricingLoading(false);
    }
  }, []);

  const handleSavePartnerPricing = async () => {
    setPartnerPricingSaving(true);
    setPartnerPricingError("");
    setPartnerPricingSuccess("");
    try {
      const entries: { category: string; days: number; price: number }[] = [];
      CATEGORIES.forEach((cat) => {
        DURATIONS.forEach((d) => {
          entries.push({ category: cat, days: d, price: partnerPricingDraft[cat]?.[d] ?? 0 });
        });
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pricing/partner/bulk`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries }),
      });
      const data = await res.json();
      if (data.success) {
        setPartnerPricingSuccess("Partner pricing updated successfully!");
        fetchPartnerPricing();
        setTimeout(() => setPartnerPricingSuccess(""), 3000);
      } else {
        setPartnerPricingError(data.message || "Failed to save partner pricing");
      }
    } catch {
      setPartnerPricingError("Unable to connect to server.");
    } finally {
      setPartnerPricingSaving(false);
    }
  };

  const updatePartnerPriceDraft = (category: string, days: number, value: string) => {
    const numVal = parseInt(value, 10) || 0;
    setPartnerPricingDraft((prev) => ({
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
        partnerPricePerDay: (vehicle as any).partnerPricePerDay || 0,
        image: vehicle.image,
        thumbnails: vehicle.thumbnails || [],
        description: vehicle.description || '',
        specs: vehicle.specs || emptyVehicleForm.specs,
        features: vehicle.features || [],
        deposit: vehicle.deposit,
        partnerDeposit: (vehicle as any).partnerDeposit || 0,
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

  // Ayurveda Treatment functions
  const loadAyurvedaTreatments = useCallback(async () => {
    setAyurvedaTreatmentsLoading(true);
    setAyurvedaTreatmentsError("");
    try {
      const data = await fetchAllTreatmentsAdmin();
      setAyurvedaTreatments(data);
    } catch (err: any) {
      setAyurvedaTreatmentsError(err.message || "Failed to fetch treatments");
    } finally {
      setAyurvedaTreatmentsLoading(false);
    }
  }, []);

  const handleOpenTreatmentModal = (treatment?: AyurvedaTreatment) => {
    if (treatment) {
      setEditingTreatment(treatment);
      setTreatmentForm({
        name: treatment.name,
        category: treatment.category,
        price: treatment.price,
        duration: treatment.duration,
        description: treatment.description || '',
        isActive: treatment.isActive
      });
    } else {
      setEditingTreatment(null);
      setTreatmentForm({ name: '', category: 'Ayurvedic Massage', price: 0, duration: '', description: '', isActive: true });
    }
    setTreatmentFormError("");
    setShowAyurvedaModal(true);
  };

  const handleCloseTreatmentModal = () => {
    setShowAyurvedaModal(false);
    setEditingTreatment(null);
    setTreatmentForm({ name: '', category: 'Ayurvedic Massage', price: 0, duration: '', description: '', isActive: true });
    setTreatmentFormError("");
  };

  const handleSaveTreatment = async () => {
    if (!treatmentForm.name.trim()) { setTreatmentFormError("Treatment name is required"); return; }
    if (treatmentForm.price <= 0) { setTreatmentFormError("Price must be greater than 0"); return; }
    if (!treatmentForm.duration.trim()) { setTreatmentFormError("Duration is required"); return; }

    setTreatmentSaving(true);
    setTreatmentFormError("");
    try {
      if (editingTreatment) {
        await updateTreatment(editingTreatment._id, treatmentForm as Partial<AyurvedaTreatment>);
      } else {
        await createTreatment(treatmentForm as Partial<AyurvedaTreatment>);
      }
      handleCloseTreatmentModal();
      loadAyurvedaTreatments();
    } catch (err: any) {
      setTreatmentFormError(err.message || "Failed to save treatment");
    } finally {
      setTreatmentSaving(false);
    }
  };

  const handleDeleteTreatment = async (id: string) => {
    try {
      await deleteTreatment(id);
      setDeleteTreatmentConfirmId(null);
      loadAyurvedaTreatments();
    } catch (err: any) {
      setAyurvedaTreatmentsError(err.message || "Failed to delete treatment");
    }
  };

  const handleSeedTreatments = async () => {
    setAyurvedaTreatmentsLoading(true);
    try {
      await seedTreatments();
      loadAyurvedaTreatments();
    } catch (err: any) {
      setAyurvedaTreatmentsError(err.message || "Failed to seed treatments");
    } finally {
      setAyurvedaTreatmentsLoading(false);
    }
  };

  // Ayurveda Bookings functions
  const loadAyurvedaBookings = useCallback(async () => {
    setAyurvedaBookingsLoading(true);
    setAyurvedaBookingsError("");
    try {
      const result = await fetchAyurvedaBookings();
      setAyurvedaBookings(result.data);
      setAyurvedaBookingsStats(result.stats);
    } catch (err: any) {
      setAyurvedaBookingsError(err.message || "Failed to fetch ayurveda bookings");
    } finally {
      setAyurvedaBookingsLoading(false);
    }
  }, []);

  const filteredAyurvedaTreatments = ayurvedaTreatments.filter(
    (t) =>
      t.name.toLowerCase().includes(ayurvedaSearchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(ayurvedaSearchTerm.toLowerCase())
  );

  const filteredAyurvedaBookings = ayurvedaBookings.filter(
    (b) =>
      b.customerName.toLowerCase().includes(ayurvedaBookingSearchTerm.toLowerCase()) ||
      b.customerEmail.toLowerCase().includes(ayurvedaBookingSearchTerm.toLowerCase()) ||
      b.treatmentName.toLowerCase().includes(ayurvedaBookingSearchTerm.toLowerCase()) ||
      (b.razorpayPaymentId && b.razorpayPaymentId.toLowerCase().includes(ayurvedaBookingSearchTerm.toLowerCase()))
  );

  useEffect(() => {
    // Restore session on mount
    if (sessionStorage.getItem("adminAuth") === "true") {
      const storedRole = sessionStorage.getItem("adminRole") as UserRole | null;
      const role = storedRole === "vendor" ? "vendor" : "admin";
      setUserRole(role);
      setIsAuthenticated(true);
      if (role === "vendor") {
        setActiveTab("vehicleBookings");
        setOpenMenus({ vehicles: true });
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
      fetchPricing();
      fetchPartnerPricing();
      loadVehicles();
      loadVehicleBookings();
      loadAyurvedaTreatments();
      loadAyurvedaBookings();
    }
  }, [isAuthenticated, fetchBookings, fetchPricing, fetchPartnerPricing, loadVehicles, loadVehicleBookings, loadAyurvedaTreatments, loadAyurvedaBookings]);

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
              <h1 className="text-2xl font-bold text-white">Panel Login</h1>
              <p className="text-gray-400 mt-1 text-sm">Kshetra Retreat Resort — Admin / Vendor</p>
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
  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0b2e] via-[#2d002d] to-[#050505] text-white flex">
      {/* Left Sidebar */}
      <aside className="w-64 min-h-screen bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col fixed top-0 left-0 z-40">
        {/* Sidebar Header */}
        <div className="p-5 border-b border-white/10">
          <h1 className="text-lg font-bold">{userRole === "vendor" ? "Vendor Panel" : "Admin Dashboard"}</h1>
          <p className="text-gray-500 text-xs mt-0.5">Kshetra Retreat Resort</p>
          <span className={`mt-2 inline-block px-2.5 py-0.5 rounded-md text-xs font-medium ${
            userRole === "vendor" 
              ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/25" 
              : "bg-purple-500/15 text-purple-400 border border-purple-500/25"
          }`}>
            {userRole === "vendor" ? "Vendor" : "Admin"}
          </span>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {/* Yoga Section - Admin only */}
          {userRole === "admin" && (
          <div className="mb-1">
            <button
              onClick={() => toggleMenu("yoga")}
              className="w-full flex items-center justify-between px-5 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/5 transition"
            >
              <span className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-purple-500/15 flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </span>
                Yoga
              </span>
              <svg className={`w-4 h-4 text-gray-500 transition-transform ${openMenus.yoga ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openMenus.yoga && (
              <div className="ml-5 pl-5 border-l border-white/5">
                <button
                  onClick={() => setActiveTab("bookings")}
                  className={`w-full text-left px-4 py-2 text-sm rounded-lg my-0.5 transition ${
                    activeTab === "bookings"
                      ? "bg-purple-500/15 text-purple-300 font-medium"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Bookings
                </button>
                <button
                  onClick={() => setActiveTab("pricing")}
                  className={`w-full text-left px-4 py-2 text-sm rounded-lg my-0.5 transition ${
                    activeTab === "pricing"
                      ? "bg-purple-500/15 text-purple-300 font-medium"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Pricing
                </button>
              </div>
            )}
          </div>
          )}

          {/* Vehicles Section */}
          <div className="mb-1">
            <button
              onClick={() => toggleMenu("vehicles")}
              className="w-full flex items-center justify-between px-5 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/5 transition"
            >
              <span className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 4h4m-4 4h8M4 7a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" />
                  </svg>
                </span>
                Vehicles
              </span>
              <svg className={`w-4 h-4 text-gray-500 transition-transform ${openMenus.vehicles ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openMenus.vehicles && (
              <div className="ml-5 pl-5 border-l border-white/5">
                <button
                  onClick={() => setActiveTab("vehicleBookings")}
                  className={`w-full text-left px-4 py-2 text-sm rounded-lg my-0.5 transition ${
                    activeTab === "vehicleBookings"
                      ? "bg-cyan-500/15 text-cyan-300 font-medium"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Bookings
                </button>
                <button
                  onClick={() => setActiveTab("vehicles")}
                  className={`w-full text-left px-4 py-2 text-sm rounded-lg my-0.5 transition ${
                    activeTab === "vehicles"
                      ? "bg-cyan-500/15 text-cyan-300 font-medium"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Manage Vehicles
                </button>
              </div>
            )}
          </div>

          {/* Ayurveda Section - Admin only */}
          {userRole === "admin" && (
          <div className="mb-1">
            <button
              onClick={() => toggleMenu("ayurveda")}
              className="w-full flex items-center justify-between px-5 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/5 transition"
            >
              <span className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </span>
                Ayurveda
              </span>
              <svg className={`w-4 h-4 text-gray-500 transition-transform ${openMenus.ayurveda ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openMenus.ayurveda && (
              <div className="ml-5 pl-5 border-l border-white/5">
                <button
                  onClick={() => setActiveTab("ayurvedaBookings")}
                  className={`w-full text-left px-4 py-2 text-sm rounded-lg my-0.5 transition ${
                    activeTab === "ayurvedaBookings"
                      ? "bg-emerald-500/15 text-emerald-300 font-medium"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Bookings
                </button>
                <button
                  onClick={() => setActiveTab("ayurvedaTreatments")}
                  className={`w-full text-left px-4 py-2 text-sm rounded-lg my-0.5 transition ${
                    activeTab === "ayurvedaTreatments"
                      ? "bg-emerald-500/15 text-emerald-300 font-medium"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Treatments
                </button>
              </div>
            )}
          </div>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2.5 text-sm rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 px-6 lg:px-10 py-8">
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

            {/* Partner Pricing Table */}
            <div className="mt-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 text-xs font-medium text-blue-400 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  Partner Pricing
                </span>
              </div>
              <h3 className="text-xl font-bold mb-4">Partner Room Pricing</h3>
              <p className="text-gray-400 text-sm mb-6">Set accommodation prices for partner users by room category and duration</p>

              {partnerPricingError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
                  {partnerPricingError}
                </div>
              )}

              {partnerPricingSuccess && (
                <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-lg px-4 py-3 mb-6">
                  {partnerPricingSuccess}
                </div>
              )}

              {partnerPricingLoading ? (
                <div className="text-center py-12 text-gray-400">Loading partner pricing...</div>
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
                            <span className="capitalize px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">
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
                                  value={partnerPricingDraft[cat]?.[d] ?? ""}
                                  onChange={(e) => updatePartnerPriceDraft(cat, d, e.target.value)}
                                  className="w-full pl-8 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-mono"
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
                      onClick={handleSavePartnerPricing}
                      disabled={partnerPricingSaving}
                      className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all duration-200 shadow-lg shadow-blue-500/25 disabled:opacity-50"
                    >
                      {partnerPricingSaving ? "Saving..." : "Save Partner Prices"}
                    </button>
                  </div>
                </div>
              )}
            </div>
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
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">Partner Price/Day</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">Deposit</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">Partner Deposit</th>
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
                          <td className="px-4 py-3 font-semibold text-blue-400">₹{((vehicle as any).partnerPricePerDay || 0).toLocaleString()}</td>
                          <td className="px-4 py-3 text-gray-300">₹{vehicle.deposit.toLocaleString()}</td>
                          <td className="px-4 py-3 text-blue-300">₹{((vehicle as any).partnerDeposit || 0).toLocaleString()}</td>
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

        {/* Ayurveda Treatments Tab */}
        {activeTab === "ayurvedaTreatments" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    Ayurveda
                  </span>
                </div>
                <h2 className="text-2xl font-bold">Treatment Management</h2>
                <p className="text-gray-400 text-sm mt-1">Add, edit, or remove Ayurvedic treatments and set prices</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSeedTreatments}
                  className="px-4 py-2 text-sm rounded-lg border border-white/10 hover:bg-white/10 transition text-gray-300"
                  title="Seed default treatments"
                >
                  Seed Defaults
                </button>
                <button
                  onClick={() => handleOpenTreatmentModal()}
                  className="px-4 py-2 text-sm rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition"
                >
                  + Add Treatment
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <input
                type="text"
                placeholder="Search treatments by name or category..."
                value={ayurvedaSearchTerm}
                onChange={(e) => setAyurvedaSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
              <button
                onClick={loadAyurvedaTreatments}
                disabled={ayurvedaTreatmentsLoading}
                className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition disabled:opacity-50"
              >
                {ayurvedaTreatmentsLoading ? "Loading..." : "Refresh"}
              </button>
            </div>

            {ayurvedaTreatmentsError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
                {ayurvedaTreatmentsError}
              </div>
            )}

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">#</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">Name</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">Category</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">Price</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">Duration</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">Status</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ayurvedaTreatmentsLoading ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-gray-400">Loading treatments...</td>
                      </tr>
                    ) : filteredAyurvedaTreatments.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-gray-400">
                          {ayurvedaSearchTerm ? "No treatments match your search." : "No treatments found. Click 'Seed Defaults' to add default treatments."}
                        </td>
                      </tr>
                    ) : (
                      filteredAyurvedaTreatments.map((t, index) => (
                        <tr key={t._id} className="border-b border-white/5 hover:bg-white/5 transition">
                          <td className="px-4 py-3 text-gray-400">{index + 1}</td>
                          <td className="px-4 py-3 font-medium">{t.name}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-md text-xs whitespace-nowrap bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {t.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-pink-400">₹{t.price.toLocaleString()}</td>
                          <td className="px-4 py-3 text-gray-300">{t.duration}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs border ${t.isActive ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}`}>
                              {t.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleOpenTreatmentModal(t)}
                                className="px-3 py-1 text-xs rounded-lg bg-white/10 hover:bg-white/20 transition"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => setDeleteTreatmentConfirmId(t._id)}
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

            {!ayurvedaTreatmentsLoading && filteredAyurvedaTreatments.length > 0 && (
              <p className="text-gray-500 text-xs mt-3">
                Showing {filteredAyurvedaTreatments.length} of {ayurvedaTreatments.length} treatments
              </p>
            )}
          </div>
        )}

        {/* Ayurveda Bookings Tab */}
        {activeTab === "ayurvedaBookings" && (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  Ayurveda
                </span>
              </div>
              <h2 className="text-2xl font-bold">Ayurveda Bookings</h2>
              <p className="text-gray-400 text-sm mt-1">Track all Ayurvedic treatment bookings and payments</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <p className="text-gray-400 text-sm">Total Bookings</p>
                <p className="text-3xl font-bold mt-1">{ayurvedaBookingsStats.totalBookings}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <p className="text-gray-400 text-sm">Confirmed</p>
                <p className="text-3xl font-bold mt-1 text-green-400">{ayurvedaBookingsStats.confirmedBookings}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold mt-1 text-pink-400">₹{ayurvedaBookingsStats.totalRevenue.toLocaleString("en-IN")}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <input
                type="text"
                placeholder="Search by customer name, email, treatment, or payment ID..."
                value={ayurvedaBookingSearchTerm}
                onChange={(e) => setAyurvedaBookingSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
              <button
                onClick={loadAyurvedaBookings}
                disabled={ayurvedaBookingsLoading}
                className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition disabled:opacity-50"
              >
                {ayurvedaBookingsLoading ? "Loading..." : "Refresh"}
              </button>
            </div>

            {ayurvedaBookingsError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
                {ayurvedaBookingsError}
              </div>
            )}

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">#</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">Customer</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">Treatment</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">Category</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">Appointment</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">Duration</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">Price</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">Payment ID</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">Status</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-300">Booked On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ayurvedaBookingsLoading ? (
                      <tr>
                        <td colSpan={10} className="text-center py-12 text-gray-400">Loading ayurveda bookings...</td>
                      </tr>
                    ) : filteredAyurvedaBookings.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="text-center py-12 text-gray-400">
                          {ayurvedaBookingSearchTerm ? "No bookings match your search." : "No ayurveda bookings found."}
                        </td>
                      </tr>
                    ) : (
                      filteredAyurvedaBookings.map((booking, index) => (
                        <tr key={booking._id} className="border-b border-white/5 hover:bg-white/5 transition">
                          <td className="px-4 py-3 text-gray-400">{index + 1}</td>
                          <td className="px-4 py-3">
                            <div className="font-medium">{booking.customerName}</div>
                            <div className="text-gray-500 text-xs">{booking.customerEmail}</div>
                            <div className="text-gray-500 text-xs">{booking.customerPhone}</div>
                          </td>
                          <td className="px-4 py-3 font-medium">{booking.treatmentName}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-md text-xs whitespace-nowrap bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {booking.treatmentCategory}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-300">
                            {new Date(booking.appointmentDate).toLocaleDateString("en-IN")}
                          </td>
                          <td className="px-4 py-3 text-gray-300">{booking.duration}</td>
                          <td className="px-4 py-3 font-semibold text-pink-400">₹{booking.price.toLocaleString("en-IN")}</td>
                          <td className="px-4 py-3 text-gray-400 text-xs font-mono">{booking.razorpayPaymentId || "-"}</td>
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

            {!ayurvedaBookingsLoading && filteredAyurvedaBookings.length > 0 && (
              <p className="text-gray-500 text-xs mt-3">
                Showing {filteredAyurvedaBookings.length} of {ayurvedaBookings.length} bookings
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

              {/* Partner Pricing Fields */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Partner Price/Day (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={(vehicleForm as any).partnerPricePerDay || 0}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, partnerPricePerDay: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Partner Deposit (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={(vehicleForm as any).partnerDeposit || 0}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, partnerDeposit: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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

      {/* Ayurveda Treatment Add/Edit Modal */}
      {showAyurvedaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1a0b2e] w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-bold">
                {editingTreatment ? "Edit Treatment" : "Add New Treatment"}
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                {editingTreatment ? "Update treatment details" : "Fill in the treatment details below"}
              </p>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Treatment Name *</label>
                <input
                  type="text"
                  value={treatmentForm.name}
                  onChange={(e) => setTreatmentForm({ ...treatmentForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  placeholder="e.g., Abhyanga"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Category *</label>
                <select
                  value={treatmentForm.category}
                  onChange={(e) => setTreatmentForm({ ...treatmentForm, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                >
                  <option value="Ayurvedic Massage">Ayurvedic Massage</option>
                  <option value="Spa Massage">Spa Massage</option>
                  <option value="Special Treatment">Special Treatment</option>
                  <option value="Combo Packages">Combo Packages</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    value={treatmentForm.price}
                    onChange={(e) => setTreatmentForm({ ...treatmentForm, price: Number(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    placeholder="e.g., 1299"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Duration *</label>
                  <input
                    type="text"
                    value={treatmentForm.duration}
                    onChange={(e) => setTreatmentForm({ ...treatmentForm, duration: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    placeholder="e.g., 60 min"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  value={treatmentForm.description}
                  onChange={(e) => setTreatmentForm({ ...treatmentForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition resize-none"
                  placeholder="Brief description of the treatment..."
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="treatmentActive"
                  checked={treatmentForm.isActive}
                  onChange={(e) => setTreatmentForm({ ...treatmentForm, isActive: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500"
                />
                <label htmlFor="treatmentActive" className="text-sm text-gray-300">Active (visible to customers)</label>
              </div>
            </div>

            <div className="p-6 border-t border-white/10 flex gap-3">
              <button
                onClick={handleCloseTreatmentModal}
                className="flex-1 py-2.5 rounded-lg border border-white/10 text-white font-medium hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTreatment}
                className="flex-1 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-500 transition"
              >
                {editingTreatment ? "Update Treatment" : "Add Treatment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ayurveda Treatment Delete Confirmation Modal */}
      {deleteTreatmentConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1a0b2e] w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Delete Treatment?</h3>
            <p className="text-gray-400 text-sm mb-6">This action cannot be undone. The treatment will be permanently removed.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTreatmentConfirmId(null)}
                className="flex-1 py-2.5 rounded-lg border border-white/10 text-white font-medium hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTreatment(deleteTreatmentConfirmId)}
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

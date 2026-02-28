const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Types
export interface VehicleSpecs {
    passengers: number;
    fuel: string;
    transmission: string;
    location: string;
    mileage: string;
    engine: string;
}

export interface Vehicle {
    _id: string;
    name: string;
    subtitle: string;
    type: 'scooter' | 'bike' | 'car';
    pricePerDay: number;
    image: string;
    thumbnails: string[];
    description: string;
    specs: VehicleSpecs;
    features: string[];
    deposit: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface VehicleBooking {
    _id: string;
    userId?: string;
    vehicleId: string | Vehicle;
    vehicleName: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    pricePerDay: number;
    totalPrice: number;
    deposit: number;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    bookingStatus: 'pending' | 'confirmed' | 'cancelled';
    createdAt: string;
    updatedAt: string;
}

export interface VehicleBookingStats {
    totalBookings: number;
    confirmedBookings: number;
    totalRevenue: number;
}

// Fetch all active vehicles (public)
export async function fetchVehicles(): Promise<Vehicle[]> {
    const res = await fetch(`${API_BASE}/vehicles`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to fetch vehicles');
    return data.data;
}

// Fetch all vehicles including inactive (admin)
export async function fetchAllVehiclesAdmin(): Promise<Vehicle[]> {
    const res = await fetch(`${API_BASE}/vehicles/admin/all`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to fetch vehicles');
    return data.data;
}

// Fetch single vehicle by ID
export async function fetchVehicleById(id: string): Promise<Vehicle> {
    const res = await fetch(`${API_BASE}/vehicles/${id}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to fetch vehicle');
    return data.data;
}

// Create new vehicle (admin)
export async function createVehicle(vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    const res = await fetch(`${API_BASE}/vehicles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleData)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to create vehicle');
    return data.data;
}

// Update vehicle (admin)
export async function updateVehicle(id: string, vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    const res = await fetch(`${API_BASE}/vehicles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleData)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to update vehicle');
    return data.data;
}

// Delete vehicle (admin)
export async function deleteVehicle(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/vehicles/${id}`, {
        method: 'DELETE'
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to delete vehicle');
}

// Seed default vehicles (admin)
export async function seedVehicles(): Promise<Vehicle[]> {
    const res = await fetch(`${API_BASE}/vehicles/seed`, {
        method: 'POST'
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to seed vehicles');
    return data.data;
}

// Create Razorpay order for vehicle booking
export async function createVehicleBookingOrder(orderData: {
    vehicleId: string;
    totalPrice: number;
    customerName: string;
    customerEmail: string;
}): Promise<{ orderId: string; amount: number; currency: string; keyId: string }> {
    const res = await fetch(`${API_BASE}/vehicle-bookings/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to create order');
    return data;
}

// Verify payment and create booking
export async function verifyVehicleBookingPayment(paymentData: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    bookingData: {
        userId?: string;
        vehicleId: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string;
        startDate: string;
        endDate: string;
        totalDays: number;
        totalPrice: number;
    };
}): Promise<VehicleBooking> {
    const res = await fetch(`${API_BASE}/vehicle-bookings/verify-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to verify payment');
    return data.data;
}

// Fetch all vehicle bookings (admin)
export async function fetchVehicleBookings(): Promise<{ stats: VehicleBookingStats; data: VehicleBooking[] }> {
    const res = await fetch(`${API_BASE}/vehicle-bookings/all`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to fetch bookings');
    return { stats: data.stats, data: data.data };
}

// Update booking status (admin)
export async function updateVehicleBookingStatus(id: string, status: string): Promise<VehicleBooking> {
    const res = await fetch(`${API_BASE}/vehicle-bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to update status');
    return data.data;
}

// Load Razorpay SDK (reuse from razorpayAPI.ts pattern)
export function loadRazorpaySDK(): Promise<boolean> {
    return new Promise((resolve) => {
        if ((window as any).Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

// Open Razorpay payment modal for vehicle booking
export async function openVehiclePayment(options: {
    orderId: string;
    amount: number;
    currency: string;
    keyId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    vehicleName: string;
    onSuccess: (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void;
    onError: (error: any) => void;
}): Promise<void> {
    const loaded = await loadRazorpaySDK();
    if (!loaded) {
        options.onError({ message: 'Failed to load Razorpay SDK' });
        return;
    }

    const rzp = new (window as any).Razorpay({
        key: options.keyId,
        amount: options.amount,
        currency: options.currency,
        name: 'Kshetra Retreat',
        description: `Vehicle Rental: ${options.vehicleName}`,
        order_id: options.orderId,
        prefill: {
            name: options.customerName,
            email: options.customerEmail,
            contact: options.customerPhone
        },
        theme: {
            color: '#B23092'
        },
        handler: function(response: any) {
            options.onSuccess(response);
        },
        modal: {
            ondismiss: function() {
                options.onError({ message: 'Payment cancelled' });
            }
        }
    });

    rzp.on('payment.failed', function(response: any) {
        options.onError(response.error);
    });

    rzp.open();
}

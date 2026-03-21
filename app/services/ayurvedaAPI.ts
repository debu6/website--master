const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Types
export interface AyurvedaTreatment {
    _id: string;
    name: string;
    category: 'Ayurvedic Massage' | 'Spa Massage' | 'Special Treatment' | 'Combo Packages';
    price: number;
    duration: string;
    description: string;
    image: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AyurvedaBooking {
    _id: string;
    userId?: string;
    treatmentId: string | AyurvedaTreatment;
    treatmentName: string;
    treatmentCategory: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    appointmentDate: string;
    price: number;
    duration: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    bookingStatus: 'pending' | 'confirmed' | 'cancelled';
    createdAt: string;
    updatedAt: string;
}

export interface AyurvedaBookingStats {
    totalBookings: number;
    confirmedBookings: number;
    totalRevenue: number;
}

// Fetch all active treatments (public) - grouped by category
export async function fetchTreatments(): Promise<{ data: AyurvedaTreatment[]; grouped: Record<string, AyurvedaTreatment[]> }> {
    const res = await fetch(`${API_BASE}/ayurveda/treatments`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to fetch treatments');
    return { data: data.data, grouped: data.grouped };
}

// Fetch all treatments including inactive (admin)
export async function fetchAllTreatmentsAdmin(): Promise<AyurvedaTreatment[]> {
    const res = await fetch(`${API_BASE}/ayurveda/treatments/admin/all`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to fetch treatments');
    return data.data;
}

// Create treatment (admin)
export async function createTreatment(treatmentData: Partial<AyurvedaTreatment>): Promise<AyurvedaTreatment> {
    const res = await fetch(`${API_BASE}/ayurveda/treatments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(treatmentData)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to create treatment');
    return data.data;
}

// Update treatment (admin)
export async function updateTreatment(id: string, treatmentData: Partial<AyurvedaTreatment>): Promise<AyurvedaTreatment> {
    const res = await fetch(`${API_BASE}/ayurveda/treatments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(treatmentData)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to update treatment');
    return data.data;
}

// Delete treatment (admin)
export async function deleteTreatment(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/ayurveda/treatments/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to delete treatment');
}

// Seed default treatments (admin)
export async function seedTreatments(): Promise<AyurvedaTreatment[]> {
    const res = await fetch(`${API_BASE}/ayurveda/treatments/seed`, { method: 'POST' });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to seed treatments');
    return data.data;
}

// Create Razorpay order for ayurveda booking
export async function createAyurvedaBookingOrder(orderData: {
    treatmentId: string;
    price: number;
    customerName: string;
    customerEmail: string;
}): Promise<{ orderId: string; amount: number; currency: string; keyId: string }> {
    const res = await fetch(`${API_BASE}/ayurveda-bookings/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to create order');
    return data;
}

// Verify payment and create booking
export async function verifyAyurvedaBookingPayment(paymentData: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    bookingData: {
        userId?: string;
        treatmentId: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string;
        appointmentDate: string;
        price: number;
    };
}): Promise<AyurvedaBooking> {
    const res = await fetch(`${API_BASE}/ayurveda-bookings/verify-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to verify payment');
    return data.data;
}

// Fetch all ayurveda bookings (admin)
export async function fetchAyurvedaBookings(): Promise<{ stats: AyurvedaBookingStats; data: AyurvedaBooking[] }> {
    const res = await fetch(`${API_BASE}/ayurveda-bookings/all`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to fetch bookings');
    return { stats: data.stats, data: data.data };
}

// Update ayurveda booking status (admin)
export async function updateAyurvedaBookingStatus(id: string, status: string): Promise<AyurvedaBooking> {
    const res = await fetch(`${API_BASE}/ayurveda-bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to update status');
    return data.data;
}

// Load Razorpay SDK
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

// Open Razorpay payment modal for ayurveda booking
export async function openAyurvedaPayment(options: {
    orderId: string;
    amount: number;
    currency: string;
    keyId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    treatmentName: string;
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
        description: `Ayurveda: ${options.treatmentName}`,
        order_id: options.orderId,
        prefill: {
            name: options.customerName,
            email: options.customerEmail,
            contact: options.customerPhone
        },
        theme: { color: '#B23092' },
        handler: function (response: any) {
            options.onSuccess(response);
        },
        modal: {
            ondismiss: function () {
                options.onError({ message: 'Payment cancelled' });
            }
        }
    });

    rzp.on('payment.failed', function (response: any) {
        options.onError(response.error);
    });

    rzp.open();
}

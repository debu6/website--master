// Frontend Razorpay Service
// Handles payment operations and integration with backend

export interface CreateOrderPayload {
  amount: number;
  currency: string;
  email: string;
  name: string;
}

export interface VerifyPaymentPayload {
  orderId: string;
  paymentId: string;
  signature: string;
  bookingData: {
    name: string;
    email: string;
    category: string;
    days: number;
    startDate: string;
    endDate: string;
    price: number;
  };
}

export interface OrderResponse {
  success: boolean;
  orderId: string;
  amount: number;
  currency: string;
}

export interface VerifyResponse {
  success: boolean;
  message: string;
  booking?: {
    id: string;
    name: string;
    email: string;
    category: string;
    days: number;
    startDate: string;
    endDate: string;
    price: number;
    bookingStatus: string;
  };
}

/**
 * Load Razorpay SDK script
 */
export const loadRazorpaySDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
    document.body.appendChild(script);
  });
};

/**
 * Create Razorpay order via backend
 */
export const createRazorpayOrder = async (
  payload: CreateOrderPayload
): Promise<OrderResponse> => {
  try {
    const response = await fetch('/api/bookings/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      `Order creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

/**
 * Verify payment with backend
 */
export const verifyRazorpayPayment = async (
  payload: VerifyPaymentPayload
): Promise<VerifyResponse> => {
  try {
    const response = await fetch('/api/bookings/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Payment verification failed');
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      `Payment verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

/**
 * Open Razorpay payment modal
 */
export const openRazorpayPayment = (options: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const razorpay = new (window as any).Razorpay(options);
      razorpay.on('payment.failed', (response: any) => {
        reject(new Error(response.error.description));
      });
      razorpay.open();
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Complete payment flow - combines all steps
 */
export const processBookingPayment = async (
  createOrderPayload: CreateOrderPayload,
  verifyPaymentHandler: (response: any) => Promise<void>
): Promise<void> => {
  try {
    // Load Razorpay SDK
    await loadRazorpaySDK();

    // Create order
    const orderData = await createRazorpayOrder(createOrderPayload);

    // Prepare Razorpay options
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: createOrderPayload.amount * 100, // Convert to paise
      currency: createOrderPayload.currency,
      name: 'Yoga Retreat Varkala',
      description: `${createOrderPayload.name} - Booking`,
      order_id: orderData.orderId,
      handler: verifyPaymentHandler,
      prefill: {
        name: createOrderPayload.name,
        email: createOrderPayload.email,
      },
      theme: {
        color: '#EC407A',
      },
    };

    // Open payment modal
    await openRazorpayPayment(options);
  } catch (error) {
    throw new Error(
      `Payment processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

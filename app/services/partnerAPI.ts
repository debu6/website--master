// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        const data = await response.json();
        return { success: response.ok, data, status: response.status };
    } catch (error: any) {
        return {
            success: false,
            data: null,
            error: error.message,
            status: 0,
        };
    }
};

export const partnerAPI = {
    register: async (formData: any) => {
        return apiCall('/partners/register', {
            method: 'POST',
            body: JSON.stringify(formData),
        });
    },

    login: async (email: string, password: string) => {
        return apiCall('/partners/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    },

    getProfile: async (partnerId: string, token: string) => {
        return apiCall(`/partners/${partnerId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },

    updateProfile: async (partnerId: string, data: any, token: string) => {
        return apiCall(`/partners/${partnerId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
    },
};

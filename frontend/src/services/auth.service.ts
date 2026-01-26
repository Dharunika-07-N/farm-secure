import api from '@/lib/api';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    farms?: {
        id: string;
        name: string;
        location: string;
        size: number;
        sizeUnit: string;
    }[];
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    whatsappNotifications?: boolean;
    shareData?: boolean;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    user: User;
    token?: string; // Register might not return token depending on implementation, but login does
}

export const login = async (email: string, password: string) => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

export const register = async (data: any) => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    // If register returns token immediately
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
};

export const getCurrentUser = (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
};

export const updateProfile = async (data: Partial<User>) => {
    const response = await api.patch<{ success: boolean; message: string; user: User }>('/auth/profile', data);
    if (response.data.success) {
        // Update local storage with new user data
        const currentUser = getCurrentUser();
        if (currentUser) {
            // Merge existing data with new data (to keep fields not returned if any, though backend should return full object)
            // Ideally backend returns the fresh full object.
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
    }
    return response.data;
};

export const sendOTP = async (identifier: string) => {
    const response = await api.post<{ success: boolean; message: string }>('/auth/send-otp', { identifier });
    return response.data;
};

export const loginWithOTP = async (identifier: string, otp: string) => {
    const response = await api.post<AuthResponse>('/auth/login-otp', { identifier, otp });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

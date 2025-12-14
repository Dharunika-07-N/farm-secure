import api from '@/lib/api';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
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

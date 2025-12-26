import api from '@/lib/api';

export interface DashboardData {
    stats: {
        biosecurityScore: string;
        activeProtocols: number;
        staffTrained: string;
        openAlerts: number;
    };
    alerts: Alert[];
    compliance: Compliance[];
    weather?: {
        temp: number;
        humidity: number;
        windSpeed: number;
        description: string;
        icon: string;
        biosecurityRisk: 'low' | 'medium' | 'high';
    };
}

export interface Alert {
    id: string;
    title: string;
    description: string;
    type: string;
    isRead: boolean;
    createdAt: string;
}

export interface Compliance {
    id: string;
    name: string;
    completed: boolean;
    date: string;
}

export const getDashboardData = async () => {
    const response = await api.get<{ success: boolean; data: DashboardData }>('/dashboard');
    return response.data.data;
};

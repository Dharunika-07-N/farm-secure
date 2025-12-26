import api from '@/lib/api';

export interface Staff {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    phone?: string;
    email?: string;
    farmId: string;
    farm?: {
        name: string;
    };
    trainings?: {
        id: string;
        trainingModule: {
            name: string;
            category: string;
        };
        completedAt: string;
        score?: number;
    }[];
}

export const getStaff = async () => {
    const response = await api.get<{ success: boolean; data: Staff[] }>('/staff');
    return response.data.data;
};

export const createStaff = async (staffData: Omit<Staff, 'id' | 'trainings' | 'farm'>) => {
    const response = await api.post<{ success: boolean; data: Staff }>('/staff', staffData);
    return response.data.data;
};

export const recordTraining = async (staffId: string, trainingModuleId: string, score?: number) => {
    const response = await api.post<{ success: boolean; data: any }>(`/staff/${staffId}/training`, {
        trainingModuleId,
        score
    });
    return response.data.data;
};

import api from '@/lib/api';

export interface Farm {
    id: string;
    alias?: string; // Sometimes called name in frontend
    name: string;
    registrationNumber?: string;
    location: string;
    size: number;
    sizeUnit: string;
    livestockType?: string;
    animalCount?: number;
    establishmentDate?: string;
    infrastructure?: string;
    description?: string;
    imageUrl?: string;
}

export const createFarm = async (data: Partial<Farm>) => {
    const response = await api.post<{ success: boolean; data: Farm }>('/farms', data);
    return response.data;
};

export const getFarms = async () => {
    const response = await api.get<{ success: boolean; data: Farm[] }>('/farms');
    return response.data.data;
};

export const updateFarm = async (id: string, data: Partial<Farm>) => {
    const response = await api.patch<{ success: boolean; data: Farm }>(`/farms/${id}`, data);
    return response.data;
};

export const deleteFarm = async (id: string) => {
    const response = await api.delete<{ success: boolean; message: string }>(`/farms/${id}`);
    return response.data;
};

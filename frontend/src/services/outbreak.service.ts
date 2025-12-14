import api from '@/lib/api';

export interface Outbreak {
    id: string;
    name: string;
    type: "avian_influenza" | "african_swine_fever" | "newcastle_disease" | "foot_mouth";
    latitude: number;
    longitude: number;
    severity: "high" | "medium" | "low";
    date: string;
    affectedAnimals: number;
    riskRadius: number;
}

export const getOutbreaks = async (): Promise<Outbreak[]> => {
    const response = await api.get<Outbreak[]>('/outbreaks');
    return response.data;
};

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

const STATE_COORDINATES: Record<string, [number, number]> = {
    'Kerala': [10.8505, 76.2711],
    'Rajasthan': [27.0238, 74.2179],
    'Madhya Pradesh': [22.9734, 78.6569],
    'Himachal Pradesh': [31.1048, 77.1734],
    'Haryana': [29.0588, 76.0856],
    'Delhi': [28.7041, 77.1025],
    'Uttar Pradesh': [26.8467, 80.9462],
    'Gujarat': [22.2587, 71.1924],
    'Maharashtra': [19.7515, 75.7139],
    'West Bengal': [22.9868, 87.8550],
    'Assam': [26.2006, 92.9376],
    'Meghalaya': [25.4670, 91.3662],
    'Nagaland': [26.1584, 94.5624],
    'Manipur': [24.6637, 93.9063],
    'Mizoram': [23.1645, 92.9376],
    'Tripura': [23.9408, 91.9882],
    'Arunachal Pradesh': [28.2180, 94.7278],
    'Sikkim': [27.5330, 88.5122],
    'Karnataka': [15.3173, 75.7139],
    'Punjab': [31.1471, 75.3412]
};

export const getOutbreaks = async (): Promise<Outbreak[]> => {
    try {
        // Fetch stats for the latest year (assuming 2023 for now, or fetch all and filter client side)
        const response = await api.get('/analytics/stats');
        const stats = response.data; // Type: DiseaseStatistic[]

        const outbreaks: Outbreak[] = [];

        // Filter for 2023 to show current status
        const currentYearStats = stats.filter((s: any) => s.year === 2023);

        currentYearStats.forEach((stat: any) => {
            const coords = STATE_COORDINATES[stat.state];
            if (coords) {
                // Determine severity based on outbreaks count
                let severity: "high" | "medium" | "low" = "low";
                if (stat.outbreaks > 20) severity = "high";
                else if (stat.outbreaks > 10) severity = "medium";

                // Map disease type
                let type: any = "avian_influenza";
                if (stat.diseaseType === "African Swine Fever") type = "african_swine_fever";
                else if (stat.diseaseType === "Avian Influenza") type = "avian_influenza";

                // Calculate risk radius (simple multiplier)
                // More outbreaks = larger "risk zone" visually
                const radius = Math.max(15, stat.outbreaks * 2.5);

                outbreaks.push({
                    id: stat.id,
                    name: `${stat.diseaseType} in ${stat.state}`,
                    type: type,
                    latitude: coords[0],
                    longitude: coords[1],
                    severity: severity,
                    date: new Date(stat.year, 11, 31).toISOString(), // End of year
                    affectedAnimals: stat.deaths + (stat.culled || 0),
                    riskRadius: radius
                });
            }
        });

        return outbreaks;
    } catch (error) {
        console.error("Failed to fetch real stats, falling back to empty list", error);
        return [];
    }
};

export const reportOutbreak = async (data: any): Promise<boolean> => {
    try {
        await api.post('/outbreaks/report', data);
        return true;
    } catch (error) {
        console.error("Failed to report outbreak", error);
        return false;
    }
};

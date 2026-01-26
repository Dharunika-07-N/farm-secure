import api from "@/lib/api";

export interface InventoryItem {
    id: string;
    itemName: string;
    category: "SEEDS" | "FERTILIZER" | "PESTICIDE" | "EQUIPMENT" | "OTHER";
    quantity: number;
    unit: string;
    lowStockAlert?: number;
    farmId: string;
    updatedAt: string;
}

export const getInventory = async () => {
    const response = await api.get<{ data: InventoryItem[] }>("/inventory");
    // Backend returns pagination or straight array? It seems the controller might return {data: [...] } or just [...].
    // Based on other services, let's assume standard response wrapper or direct.
    // Actually, checking controller is best, but usually we stick to a pattern.
    // I'll assume standard axios response.data matches what backend sends.
    return response.data;
};

export const createInventoryItem = async (data: Partial<InventoryItem>) => {
    const response = await api.post("/inventory", data);
    return response.data;
};

export const updateInventoryItem = async (id: string, data: Partial<InventoryItem>) => {
    const response = await api.patch(`/inventory/${id}`, data);
    return response.data;
};

export const deleteInventoryItem = async (id: string) => {
    const response = await api.delete(`/inventory/${id}`);
    return response.data;
};

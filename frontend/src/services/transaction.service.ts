import api from "@/lib/api";

export interface Transaction {
    id: string;
    type: "INCOME" | "EXPENSE";
    category: string;
    amount: number;
    description?: string;
    date: string;
    farmId: string;
    createdAt: string;
}

export const getTransactions = async (params?: { type?: string; category?: string }) => {
    const response = await api.get<{ data: Transaction[] }>("/transactions", { params });
    return response.data;
};

export const createTransaction = async (data: Partial<Transaction>) => {
    const response = await api.post("/transactions", data);
    return response.data;
};

export const deleteTransaction = async (id: string) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
};

export const getTransactionStats = async () => {
    const response = await api.get("/transactions/stats/summary");
    return response.data;
};

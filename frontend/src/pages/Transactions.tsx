import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    ArrowLeft,
    Plus,
    TrendingUp,
    TrendingDown,
    Search,
    Filter,
    Download,
    Calendar,
    Loader2,
    Trash2,
    Receipt
} from "lucide-react";
import { getTransactions, Transaction, deleteTransaction } from "@/services/transaction.service";
import { useToast } from "@/hooks/use-toast";

export default function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await getTransactions();
            setTransactions(Array.isArray(response) ? response : (response as any).data || []);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load transactions.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const totalIncome = transactions
        .filter(t => t.type === "INCOME")
        .reduce((acc, t) => acc + t.amount, 0);

    const totalExpense = transactions
        .filter(t => t.type === "EXPENSE")
        .reduce((acc, t) => acc + t.amount, 0);

    const balance = totalIncome - totalExpense;

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this transaction?")) return;
        try {
            await deleteTransaction(id);
            setTransactions(transactions.filter(t => t.id !== id));
            toast({ title: "Deleted", description: "Record removed successfully." });
        } catch (error) {
            toast({ title: "Error", description: "Operation failed.", variant: "destructive" });
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container py-8">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <Button variant="ghost" asChild className="mb-4 -ml-4">
                            <a href="/dashboard">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Dashboard
                            </a>
                        </Button>
                        <h1 className="text-2xl font-bold md:text-3xl font-heading">Financial Tracking</h1>
                        <p className="text-muted-foreground">Manage your farm income and expenditures in one place.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                        <Button className="shadow-lg">
                            <Plus className="h-4 w-4 mr-2" />
                            New Transaction
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3 mb-8">
                    <Card className="bg-gradient-to-br from-success/5 to-transparent border-success/20">
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-bold text-success uppercase tracking-widest mb-1">Total Income</p>
                                    <h3 className="text-3xl font-bold font-numeric">₹{totalIncome.toLocaleString()}</h3>
                                </div>
                                <div className="p-3 bg-success/10 rounded-xl">
                                    <TrendingUp className="h-6 w-6 text-success" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-destructive/5 to-transparent border-destructive/20">
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-bold text-destructive uppercase tracking-widest mb-1">Total Expenses</p>
                                    <h3 className="text-3xl font-bold font-numeric">₹{totalExpense.toLocaleString()}</h3>
                                </div>
                                <div className="p-3 bg-destructive/10 rounded-xl">
                                    <TrendingDown className="h-6 w-6 text-destructive" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Net Balance</p>
                                    <h3 className={`text-3xl font-bold font-numeric ${balance < 0 ? 'text-destructive' : 'text-primary'}`}>
                                        ₹{balance.toLocaleString()}
                                    </h3>
                                </div>
                                <div className="p-3 bg-primary/10 rounded-xl">
                                    <TrendingUp className={`h-6 w-6 ${balance < 0 ? 'text-destructive rotate-180' : 'text-primary'}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden mb-6">
                    <div className="p-4 border-b border-border bg-muted/20 flex flex-col md:flex-row justify-between gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search description..." className="pl-8 h-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-9">
                                <Calendar className="h-4 w-4 mr-2" />
                                This Month
                            </Button>
                            <Button variant="outline" size="sm" className="h-9">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-muted/30 text-xs font-bold uppercase text-muted-foreground border-b">
                                <tr>
                                    <th className="px-6 py-4">Transaction</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center">
                                            <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto mb-2" />
                                            <p className="text-sm text-muted-foreground">Fetching records...</p>
                                        </td>
                                    </tr>
                                ) : transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center">
                                            <Receipt className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-20" />
                                            <p className="text-sm text-muted-foreground">No transactions recorded yet.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    transactions
                                        .filter(t => t.description?.toLowerCase().includes(searchTerm.toLowerCase()) || t.category.toLowerCase().includes(searchTerm.toLowerCase()))
                                        .map((t) => (
                                            <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${t.type === 'INCOME' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                                                            {t.type === 'INCOME' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm">{t.description || "N/A"}</p>
                                                            <p className="text-[10px] text-muted-foreground uppercase font-bold">{t.type}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="outline" className="font-bold text-[10px] uppercase tracking-wider">
                                                        {t.category}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-muted-foreground">
                                                    {new Date(t.date).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right font-numeric font-bold">
                                                    <span className={t.type === 'INCOME' ? 'text-success' : 'text-destructive'}>
                                                        {t.type === 'INCOME' ? '+' : '-'}₹{t.amount.toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(t.id)}>
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Plus,
    ArrowLeft,
    History,
    Skull,
    Truck,
    Warehouse,
    ChevronRight,
    TrendingUp,
    AlertTriangle
} from "lucide-react";
import api from "@/lib/api";
import { useTranslation } from "react-i18next";

export default function Livestock() {
    const { t } = useTranslation();
    const [batches, setBatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBatches = async () => {
            try {
                const userStr = localStorage.getItem('user');
                if (!userStr) return;
                const user = JSON.parse(userStr);
                if (!user.farms?.[0]) return;

                const response = await api.get(`/livestock/farm/${user.farms[0].id}`);
                setBatches(response.data.data);
            } catch (error) {
                console.error("Failed to fetch batches:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBatches();
    }, []);

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
                        <h1 className="text-2xl font-bold md:text-3xl">Livestock Management</h1>
                        <p className="text-muted-foreground">Track animal batches, movements, and mortality events.</p>
                    </div>
                    <Button className="shadow-lg">
                        <Plus className="h-4 w-4 mr-2" />
                        New Batch
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-4">
                    {/* Summary Cards */}
                    <Card className="p-4 flex items-center gap-4 border-primary/10">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Warehouse className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Active Batches</p>
                            <p className="text-2xl font-bold">{batches.filter(b => b.status === 'ACTIVE').length}</p>
                        </div>
                    </Card>
                    <Card className="p-4 flex items-center gap-4 border-destructive/10">
                        <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                            <Skull className="h-6 w-6 text-destructive" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Mortality</p>
                            <p className="text-2xl font-bold">{batches.reduce((acc, b) => acc + (b._count?.mortality || 0), 0)}</p>
                        </div>
                    </Card>
                    <Card className="p-4 flex items-center gap-4 border-info/10">
                        <div className="h-12 w-12 rounded-xl bg-info/10 flex items-center justify-center">
                            <Truck className="h-6 w-6 text-info" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Movements</p>
                            <p className="text-2xl font-bold">{batches.reduce((acc, b) => acc + (b._count?.movements || 0), 0)}</p>
                        </div>
                    </Card>
                    <Card className="p-4 flex items-center gap-4 border-warning/10">
                        <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-warning" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Headcount</p>
                            <p className="text-2xl font-bold">{batches.reduce((acc, b) => acc + b.quantity, 0)}</p>
                        </div>
                    </Card>
                </div>

                <Tabs defaultValue="batches" className="mt-8">
                    <TabsList className="mb-6">
                        <TabsTrigger value="batches">Batches</TabsTrigger>
                        <TabsTrigger value="history">Recent Logs</TabsTrigger>
                    </TabsList>

                    <TabsContent value="batches">
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {batches.map((batch) => (
                                <Card key={batch.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-bold">{batch.batchNumber}</h3>
                                                <p className="text-sm text-muted-foreground">{batch.breed} • {batch.species}</p>
                                            </div>
                                            <Badge className={batch.status === 'ACTIVE' ? "bg-success/10 text-success hover:bg-success/20" : ""}>
                                                {batch.status}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-muted/50 p-2 rounded-lg text-center">
                                                <span className="text-xs text-muted-foreground block">Headcount</span>
                                                <span className="text-lg font-bold">{batch.quantity}</span>
                                            </div>
                                            <div className="bg-muted/50 p-2 rounded-lg text-center">
                                                <span className="text-xs text-muted-foreground block">Arrival</span>
                                                <span className="text-sm font-bold">{new Date(batch.arrivalDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" className="flex-1">
                                                <Truck className="h-3 w-3 mr-1" />
                                                Move
                                            </Button>
                                            <Button variant="outline" size="sm" className="flex-1 text-destructive hover:text-destructive">
                                                <Skull className="h-3 w-3 mr-1" />
                                                Record Loss
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="border-t border-border bg-muted/20 p-3 flex justify-between items-center text-xs text-muted-foreground">
                                        <span>Last updated: {new Date(batch.updatedAt).toLocaleDateString()}</span>
                                        <Button variant="ghost" size="sm" className="h-6 gap-1 p-1">
                                            History <ChevronRight className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </Card>
                            ))}

                            {batches.length === 0 && !loading && (
                                <div className="md:col-span-3 py-12 text-center">
                                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                                        <AlertTriangle className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-bold">No Batches Found</h3>
                                    <p className="text-muted-foreground">Start by adding your first livestock batch.</p>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}

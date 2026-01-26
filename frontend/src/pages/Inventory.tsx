import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Package,
    Plus,
    Search,
    AlertTriangle,
    ArrowLeft,
    Loader2,
    Trash2,
    Edit2,
    Filter
} from "lucide-react";
import { getInventory, InventoryItem, deleteInventoryItem } from "@/services/inventory.service";
import { toast } from "@/hooks/use-toast";

export default function Inventory() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const data = await getInventory();
            // Adjust based on API structure
            setItems(Array.isArray(data) ? data : (data as any).data || []);
        } catch (error) {
            console.error("Failed to fetch inventory:", error);
            toast({
                title: "Error",
                description: "Failed to load inventory items.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return;
        try {
            await deleteInventoryItem(id);
            setItems(items.filter(item => item.id !== id));
            toast({
                title: "Deleted",
                description: "Item removed from inventory.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete item.",
                variant: "destructive",
            });
        }
    };

    const filteredItems = items.filter(item =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        <h1 className="text-2xl font-bold md:text-3xl font-heading">Inventory Management</h1>
                        <p className="text-muted-foreground">Track feed, vaccines, equipment, and supplies.</p>
                    </div>
                    <Button className="shadow-lg bg-primary hover:bg-primary/90 transition-all">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                    </Button>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search items..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Filter
                    </Button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Loading your inventory...</p>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <Card className="border-dashed border-2 py-20 text-center">
                        <CardContent>
                            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                            <h3 className="text-lg font-bold">No Items Found</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto">
                                {searchTerm ? "Try searching for something else." : "Your inventory is empty. Start by adding your first item."}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredItems.map((item) => (
                            <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 border-border/50 overflow-hidden">
                                <CardHeader className="pb-2 space-y-0 flex flex-row items-start justify-between">
                                    <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10">
                                        {item.category}
                                    </Badge>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Edit2 className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(item.id)}>
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <CardTitle className="text-lg mb-1">{item.itemName}</CardTitle>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold tracking-tight">{item.quantity}</span>
                                            <span className="text-sm text-muted-foreground font-medium uppercase">{item.unit}</span>
                                        </div>
                                    </div>

                                    {item.lowStockAlert && item.quantity <= item.lowStockAlert && (
                                        <div className="flex items-center gap-2 text-xs font-bold text-destructive bg-destructive/5 p-2 rounded-lg">
                                            <AlertTriangle className="h-3.5 w-3.5" />
                                            LOW STOCK ALERT
                                        </div>
                                    )}

                                    <div className="pt-2 flex justify-between items-center text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                                        <span>Last Updated</span>
                                        <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    UserPlus,
    ArrowLeft,
    Search,
    CheckCircle2,
    XCircle,
    Calendar,
    Clock,
    History
} from "lucide-react";
import api from "@/lib/api";

export default function Visitors() {
    const [visitors, setVisitors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVisitors = async () => {
            try {
                const userStr = localStorage.getItem('user');
                if (!userStr) return;
                const user = JSON.parse(userStr);
                if (!user.farms?.[0]) return;

                const response = await api.get(`/visitors/farm/${user.farms[0].id}`);
                setVisitors(response.data.data);
            } catch (error) {
                console.error("Failed to fetch visitors:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVisitors();
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
                        <h1 className="text-2xl font-bold md:text-3xl">Visitor Logs</h1>
                        <p className="text-muted-foreground">Maintain a record of everyone entering the farm premises for biosecurity tracking.</p>
                    </div>
                    <Button className="shadow-lg">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Log New Visitor
                    </Button>
                </div>

                <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center">
                        <h3 className="font-bold">Recent Visitors</h3>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search name or company..." className="pl-8 h-9" />
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Visitor Name</TableHead>
                                <TableHead>Organization</TableHead>
                                <TableHead>Purpose</TableHead>
                                <TableHead>Entry / Exit</TableHead>
                                <TableHead>Biosecurity Pass</TableHead>
                                <TableHead>Disinfected</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {visitors.map((visitor) => (
                                <TableRow key={visitor.id}>
                                    <TableCell className="font-medium">{visitor.visitorName}</TableCell>
                                    <TableCell>{visitor.organization || "N/A"}</TableCell>
                                    <TableCell>{visitor.purpose}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-xs">
                                            <span className="flex items-center gap-1 font-bold">
                                                <Clock className="h-3 w-3" /> {new Date(visitor.entryTime).toLocaleTimeString()}
                                            </span>
                                            <span className="text-muted-foreground">
                                                {new Date(visitor.entryTime).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {visitor.biosecurityPass ? (
                                            <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                                                <CheckCircle2 className="h-3 w-3 mr-1" /> Approved
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
                                                <XCircle className="h-3 w-3 mr-1" /> Rejected
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {visitor.disinfected ? (
                                            <div className="h-2.5 w-2.5 rounded-full bg-success ring-4 ring-success/20" />
                                        ) : (
                                            <div className="h-2.5 w-2.5 rounded-full bg-destructive ring-4 ring-destructive/20" />
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {visitors.length === 0 && !loading && (
                        <div className="py-20 text-center">
                            <p className="text-muted-foreground">No visitor records found.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

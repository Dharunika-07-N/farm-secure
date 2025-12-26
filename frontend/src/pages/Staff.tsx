import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    Plus,
    Search,
    Phone,
    Mail,
    GraduationCap,
    ArrowLeft,
    Loader2,
    Briefcase,
    CheckCircle2,
    X
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { getStaff, createStaff, Staff } from "@/services/staff.service";
import { getFarms } from "@/services/farm.service";
import { toast } from "@/components/ui/use-toast";

export default function StaffManagement() {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [farms, setFarms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        role: "Worker",
        phone: "",
        email: "",
        farmId: ""
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [staffData, farmData] = await Promise.all([
                getStaff(),
                getFarms()
            ]);
            setStaff(staffData);
            setFarms(farmData);
            if (farmData.length > 0 && !formData.farmId) {
                setFormData(prev => ({ ...prev, farmId: farmData[0].id }));
            }
        } catch (error) {
            console.error("Error fetching staff data:", error);
            toast({
                title: "Error",
                description: "Failed to load staff data.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createStaff(formData);
            toast({
                title: "Success",
                description: "Staff member added successfully.",
            });
            setIsAddDialogOpen(false);
            setFormData({
                firstName: "",
                lastName: "",
                role: "Worker",
                phone: "",
                email: "",
                farmId: farms[0]?.id || ""
            });
            fetchData();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add staff member.",
                variant: "destructive",
            });
        }
    };

    const filteredStaff = staff.filter(s =>
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container py-8">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <Button variant="ghost" asChild className="mb-4">
                            <a href="/dashboard">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Dashboard
                            </a>
                        </Button>
                        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                            Staff Management
                        </h1>
                        <p className="text-muted-foreground">
                            Manage your farm workers and their assignments.
                        </p>
                    </div>

                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="shrink-0">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Staff Member
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <form onSubmit={handleAddStaff}>
                                <DialogHeader>
                                    <DialogTitle>Add New Staff Member</DialogTitle>
                                    <DialogDescription>
                                        Enter the details of the new worker. They will be associated with a specific farm.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input
                                                id="firstName"
                                                required
                                                value={formData.firstName}
                                                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input
                                                id="lastName"
                                                required
                                                value={formData.lastName}
                                                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="role">Role / Position</Label>
                                        <Input
                                            id="role"
                                            placeholder="e.g. Senior Worker, Poultry Handler"
                                            required
                                            value={formData.role}
                                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="farm">Assign to Farm</Label>
                                        <select
                                            id="farm"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={formData.farmId}
                                            onChange={e => setFormData({ ...formData, farmId: e.target.value })}
                                            required
                                        >
                                            {farms.map(farm => (
                                                <option key={farm.id} value={farm.id}>{farm.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone (Optional)</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email (Optional)</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                                    <Button type="submit">Add Member</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Search and Filters */}
                <div className="mb-6 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search staff by name or role..."
                        className="pl-10 h-11"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Loading staff members...</p>
                    </div>
                ) : filteredStaff.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="p-4 rounded-full bg-muted mb-4">
                                <Users className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold">No staff found</h3>
                            <p className="text-sm text-muted-foreground max-w-sm mt-1">
                                {searchTerm ? "We couldn't find any staff matching your search." : "You haven't added any staff members yet."}
                            </p>
                            {!searchTerm && (
                                <Button className="mt-6" onClick={() => setIsAddDialogOpen(true)}>
                                    Add Your First Member
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredStaff.map((person) => (
                            <Card key={person.id} className="overflow-hidden border-border hover:shadow-md transition-shadow">
                                <CardHeader className="bg-muted/30 pb-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                                {person.firstName[0]}{person.lastName[0]}
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">{person.firstName} {person.lastName}</CardTitle>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                                    <Briefcase className="h-3 w-3" />
                                                    {person.role}
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="bg-background">
                                            {person.farm?.name}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="space-y-2">
                                        {person.phone && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                <span>{person.phone}</span>
                                            </div>
                                        )}
                                        {person.email && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                <span className="truncate">{person.email}</span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                                <div className="p-4 bg-muted/20 border-t flex gap-2">
                                    <Button variant="outline" size="sm" className="flex-1" asChild>
                                        <a href={`mailto:${person.email}`}>
                                            <Mail className="h-4 w-4 mr-2" />
                                            Contact Staff
                                        </a>
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}


import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    User,
    MapPin,
    Phone,
    Mail,
    Shield,
    Award,
    AlertTriangle,
    FileText,
    Activity,
    Lock,
    Settings,
    Camera,
    History,
    Download,
    LogOut,
    Tractor,
    Syringe,
    FileCheck
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { getCurrentUser, updateProfile } from "@/services/auth.service";
import { getFarms, updateFarm, createFarm } from "@/services/farm.service";
import { toast } from "@/components/ui/use-toast";

export default function Profile() {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const currentTab = searchParams.get('tab') || 'personal';

    // Form state (in a real app, use react-hook-form)
    const [personalForm, setPersonalForm] = useState<any>({});
    const [farmForm, setFarmForm] = useState<any>({});
    const [settingsForm, setSettingsForm] = useState<any>({});

    useEffect(() => {
        const fetchProfile = async () => {
            const currentUser = getCurrentUser();
            if (currentUser) {
                // Fetch latest farm details
                try {
                    const farms = await getFarms();
                    const farm = farms.length > 0 ? farms[0] : null; // Use first farm

                    const fullProfile = {
                        ...currentUser,
                        // Default values if missing
                        language: (currentUser as any).language || "English",
                        address: (currentUser as any).address || "",
                        phone: (currentUser as any).phone || "",
                        farm: farm || {
                            name: "",
                            registrationNumber: "",
                            location: "",
                            size: 0,
                            sizeUnit: "acres",
                            livestockType: "",
                            animalCount: 0,
                            infrastructure: "",
                            establishmentDate: "",
                        },
                        biosecurity: {
                            score: 85,
                            status: "Certified Compliant",
                            lastAssessment: "2024-05-10"
                        }
                    };

                    setUser(fullProfile);
                    setPersonalForm({
                        firstName: currentUser.firstName,
                        lastName: currentUser.lastName,
                        phone: (currentUser as any).phone || "",
                        address: (currentUser as any).address || "",
                        language: (currentUser as any).language || "English",
                    });

                    setSettingsForm({
                        emailNotifications: (currentUser as any).emailNotifications ?? true,
                        smsNotifications: (currentUser as any).smsNotifications ?? true,
                        whatsappNotifications: (currentUser as any).whatsappNotifications ?? false,
                        shareData: (currentUser as any).shareData ?? true,
                    });

                    if (farm) {
                        setFarmForm({ ...farm, establishmentDate: farm.establishmentDate?.split('T')[0] });
                    } else {
                        setFarmForm({
                            name: "",
                            registrationNumber: "",
                            location: "",
                            size: 0,
                            sizeUnit: "acres",
                            livestockType: "",
                            animalCount: 0,
                            infrastructure: "",
                            establishmentDate: "",
                        });
                    }
                } catch (error) {
                    console.error("Failed to fetch profile", error);
                    // Fallback to local user
                    setUser({ ...currentUser, farm: null });
                }
            }
            setIsLoading(false);
        };

        fetchProfile();
    }, []);

    const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPersonalForm((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleFarmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFarmForm((prev: any) => ({ ...prev, [name]: value }));
    };



    const handleToggle = async (key: string, value: boolean) => {
        // Optimistic update
        setSettingsForm((prev: any) => ({ ...prev, [key]: value }));

        try {
            await updateProfile({ [key]: value });
            // Update main user object too
            setUser((prev: any) => ({ ...prev, [key]: value }));

            toast({
                title: "Settings Saved",
                description: "Your preference has been updated.",
            });
        } catch (error) {
            // Revert on failure
            setSettingsForm((prev: any) => ({ ...prev, [key]: !value }));
            toast({
                title: "Error",
                description: "Failed to update settings.",
                variant: "destructive",
            });
        }
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            await updateProfile(personalForm);

            // Update local user state
            setUser((prev: any) => ({ ...prev, ...personalForm }));

            toast({
                title: "Profile Updated",
                description: "Your personal information has been saved successfully.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save profile changes.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveFarm = async () => {
        setIsSaving(true);
        try {
            let updatedFarm;
            if (user.farm && user.farm.id) {
                // Update existing
                const { id, ...data } = farmForm;
                // Convert types if needed
                const payload = {
                    ...data,
                    size: Number(data.size),
                    animalCount: Number(data.animalCount)
                };
                updatedFarm = await updateFarm(user.farm.id, payload);
            } else {
                // Create new
                const payload = {
                    ...farmForm,
                    size: Number(farmForm.size),
                    animalCount: Number(farmForm.animalCount)
                };
                updatedFarm = await createFarm(payload);
            }

            // Update local state
            setUser((prev: any) => ({ ...prev, farm: updatedFarm }));
            // Also update form ID if created
            if (updatedFarm && updatedFarm.id) {
                setFarmForm((prev: any) => ({ ...prev, id: updatedFarm.id }));
            }

            toast({
                title: "Farm Details Saved",
                description: "Your farm information has been updated.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save farm details.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Activity className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="container py-20 text-center">
                    <p>Please log in to view your profile.</p>
                    <Button className="mt-4" asChild><a href="/login">Login</a></Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container py-8">

                {/* Profile Header */}
                <div className="mb-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <div className="relative">
                        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-xl">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                            <AvatarFallback className="text-4xl bg-primary/20 text-primary">{user.firstName[0]}</AvatarFallback>
                        </Avatar>
                        <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full shadow-md">
                            <Camera className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </div>

                    <div className="flex-1 space-y-2">
                        <div>
                            <h1 className="text-3xl font-bold">{user.firstName} {user.lastName}</h1>
                            <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">{user.role}</Badge>
                                <span>•</span>
                                <MapPin className="h-4 w-4" />
                                <span>{user.address || "Location not set"}</span>
                            </div>
                        </div>
                        <p className="max-w-xl text-muted-foreground">
                            {user.bio || "No bio added yet."}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </Button>
                        <Button>Edit Profile</Button>
                    </div>
                </div>

                <Tabs value={currentTab} onValueChange={(value) => setSearchParams({ tab: value })} className="space-y-6">
                    <TabsList className="flex h-auto flex-wrap justify-start gap-2 bg-transparent p-0">
                        <TabsTrigger value="personal" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-background hover:bg-muted px-4 py-2">
                            <User className="mr-2 h-4 w-4" /> Personal
                        </TabsTrigger>
                        <TabsTrigger value="farm" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-background hover:bg-muted px-4 py-2">
                            <Tractor className="mr-2 h-4 w-4" /> Farm Details
                        </TabsTrigger>
                        <TabsTrigger value="biosecurity" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-background hover:bg-muted px-4 py-2">
                            <Shield className="mr-2 h-4 w-4" /> Biosecurity
                        </TabsTrigger>
                        <TabsTrigger value="veterinary" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-background hover:bg-muted px-4 py-2">
                            <Syringe className="mr-2 h-4 w-4" /> Vet & Contacts
                        </TabsTrigger>
                        <TabsTrigger value="docs" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-background hover:bg-muted px-4 py-2">
                            <FileText className="mr-2 h-4 w-4" /> Documents
                        </TabsTrigger>
                        <TabsTrigger value="privacy" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-background hover:bg-muted px-4 py-2">
                            <Lock className="mr-2 h-4 w-4" /> Privacy & Alerts
                        </TabsTrigger>
                    </TabsList>

                    {/* Personal Information */}
                    <TabsContent value="personal" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>Manage your personal details and contact information.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>First Name</Label>
                                    <Input name="firstName" value={personalForm.firstName} onChange={handlePersonalChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Last Name</Label>
                                    <Input name="lastName" value={personalForm.lastName} onChange={handlePersonalChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email Address</Label>
                                    <Input defaultValue={user.email} disabled className="bg-muted" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone Number</Label>
                                    <Input name="phone" value={personalForm.phone} onChange={handlePersonalChange} placeholder="+91..." />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Address</Label>
                                    <Input name="address" value={personalForm.address} onChange={handlePersonalChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Role / Designation</Label>
                                    <Input defaultValue={user.role} disabled className="bg-muted" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Preferred Language</Label>
                                    <select
                                        name="language"
                                        value={personalForm.language}
                                        onChange={handlePersonalChange}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="English">English</option>
                                        <option value="Tamil">Tamil</option>
                                        <option value="Hindi">Hindi</option>
                                        <option value="Telugu">Telugu</option>
                                    </select>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t px-6 py-4">
                                <Button onClick={handleSaveProfile} disabled={isSaving}>
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* Farm Details */}
                    <TabsContent value="farm" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Farm Details</CardTitle>
                                <CardDescription>Information about your farm and livestock.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Farm Name</Label>
                                    <Input name="name" value={farmForm.name} onChange={handleFarmChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Registration Number</Label>
                                    <Input name="registrationNumber" value={farmForm.registrationNumber} onChange={handleFarmChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label>GPS Location</Label>
                                    <div className="flex gap-2">
                                        <Input name="location" value={farmForm.location} onChange={handleFarmChange} className="flex-1" />
                                        <Button size="icon" variant="outline"><MapPin className="h-4 w-4" /></Button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Size</Label>
                                        <div className="flex gap-2">
                                            <Input name="size" type="number" value={farmForm.size} onChange={handleFarmChange} />
                                            <div className="flex items-center text-sm text-muted-foreground">{farmForm.sizeUnit}</div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Since</Label>
                                        <Input name="establishmentDate" type="date" value={farmForm.establishmentDate} onChange={handleFarmChange} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Livestock Type</Label>
                                    <Input name="livestockType" value={farmForm.livestockType} onChange={handleFarmChange} placeholder="e.g. Poultry, Pig" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Number of Animals</Label>
                                    <Input name="animalCount" type="number" value={farmForm.animalCount} onChange={handleFarmChange} />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Infrastructure Details</Label>
                                    <Input name="infrastructure" value={farmForm.infrastructure} onChange={handleFarmChange} />
                                </div>
                            </CardContent>
                            <CardFooter className="border-t px-6 py-4">
                                <Button onClick={handleSaveFarm} disabled={isSaving}>
                                    {isSaving ? "Saving..." : "Save Farm Details"}
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Farm Gallery</CardTitle>
                                <CardDescription>Photos of your farm infrastructure and facilities.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="aspect-square rounded-md bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/25 cursor-pointer hover:bg-muted/80 transition-colors">
                                        <div className="text-center">
                                            <Camera className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                            <span className="text-xs text-muted-foreground">Add Photo</span>
                                        </div>
                                    </div>
                                    {/* Placeholder for uploaded images */}
                                    <div className="aspect-square rounded-md bg-muted overflow-hidden">
                                        <img src="https://images.unsplash.com/photo-1516467508483-a721206088f5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="Farm 1" className="h-full w-full object-cover" />
                                    </div>
                                    <div className="aspect-square rounded-md bg-muted overflow-hidden">
                                        <img src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="Farm 2" className="h-full w-full object-cover" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Biosecurity */}
                    <TabsContent value="biosecurity" className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-3">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Biosecurity Score</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-bold text-success">{user.biosecurity?.score}/100</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Ranked top 10% in your region
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Status</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2">
                                        <Award className="h-5 w-5 text-primary" />
                                        <span className="text-lg font-bold">{user.biosecurity?.status}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Valid until Dec 2024
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Last Assessment</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-lg font-bold">{user.biosecurity?.lastAssessment}</div>
                                    <Button variant="link" className="px-0 h-auto text-xs">View Report</Button>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Active Protocols</CardTitle>
                                <CardDescription>Current biosecurity measures in place.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-4">
                                    {[
                                        "Daily disinfection of entry points",
                                        "Visitor logs mandatory",
                                        "Pest control checks weekly",
                                        "Water quality testing monthly"
                                    ].map((protocol, i) => (
                                        <li key={i} className="flex items-center gap-2 p-3 border rounded-lg">
                                            <FileCheck className="h-5 w-5 text-success" />
                                            <span>{protocol}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Veterinary & Contacts */}
                    <TabsContent value="veterinary" className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Assigned Veterinarian</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-16 w-16">
                                            <AvatarFallback>DK</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-semibold text-lg">{user.veterinarian?.name}</h3>
                                            <p className="text-muted-foreground">{user.veterinarian?.clinic}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3 pt-4">
                                        <div className="flex items-center gap-3">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <span>{user.veterinarian?.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <span>{user.veterinarian?.email}</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="outline" className="w-full">Schedule Visit</Button>
                                </CardFooter>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Emergency Contacts</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                                        <div>
                                            <div className="font-semibold text-destructive">Animal Disease Helpline</div>
                                            <div className="text-sm">24/7 National Emergency Line</div>
                                        </div>
                                        <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full">
                                            <Phone className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg border">
                                        <div>
                                            <div className="font-semibold">Local Extension Officer</div>
                                            <div className="text-sm">Mr. R. Mani - Available 9AM-5PM</div>
                                        </div>
                                        <Button size="icon" variant="outline" className="h-8 w-8 rounded-full">
                                            <Phone className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Documents */}
                    <TabsContent value="docs" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Documents & Records</CardTitle>
                                <CardDescription>Manage your farm licenses, certificates, and reports.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {[
                                        { name: "Farm Operating License.pdf", type: "License", date: "Jan 15, 2024" },
                                        { name: "Q1 Biosecurity Audit.pdf", type: "Report", date: "Mar 10, 2024" },
                                        { name: "Vaccination Schedule 2024.pdf", type: "Record", date: "Jan 01, 2024" },
                                        { name: "Water Quality Test.pdf", type: "Lab Result", date: "Apr 22, 2024" },
                                    ].map((doc, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <FileText className="h-8 w-8 text-blue-500" />
                                                <div>
                                                    <div className="font-medium">{doc.name}</div>
                                                    <div className="text-xs text-muted-foreground">{doc.type} • Added {doc.date}</div>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full">
                                    <UploadIcon className="mr-2 h-4 w-4" /> Upload New Document
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* Privacy & Settings */}
                    <TabsContent value="privacy" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Notifications</CardTitle>
                                <CardDescription>Manage how you receive alerts and updates.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Email Notifications</Label>
                                        <p className="text-sm text-muted-foreground">Receive daily digests and major alerts.</p>
                                    </div>
                                    <Switch
                                        checked={settingsForm.emailNotifications}
                                        onCheckedChange={(val) => handleToggle('emailNotifications', val)}
                                    />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>SMS Alerts</Label>
                                        <p className="text-sm text-muted-foreground">Instant alerts for disease outbreaks nearby.</p>
                                    </div>
                                    <Switch
                                        checked={settingsForm.smsNotifications}
                                        onCheckedChange={(val) => handleToggle('smsNotifications', val)}
                                    />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>WhatsApp Updates</Label>
                                        <p className="text-sm text-muted-foreground">Get weekly tips and community news.</p>
                                    </div>
                                    <Switch
                                        checked={settingsForm.whatsappNotifications}
                                        onCheckedChange={(val) => handleToggle('whatsappNotifications', val)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Data Privacy</CardTitle>
                                <CardDescription>Control how your data is used and shared.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Share Anonymized Data</Label>
                                        <p className="text-sm text-muted-foreground">Help improve disease tracking by sharing anonymous data.</p>
                                    </div>
                                    <Switch
                                        checked={settingsForm.shareData}
                                        onCheckedChange={(val) => handleToggle('shareData', val)}
                                    />
                                </div>
                                <Separator />
                                <div className="pt-4">
                                    <Button variant="destructive">
                                        Delete Account
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                </Tabs>
            </main>
            <Footer />
        </div>
    );
}

function UploadIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
    )
}

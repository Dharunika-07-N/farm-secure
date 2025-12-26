import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { AlertCard } from "@/components/dashboard/AlertCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Bell, Filter, Check, ChevronDown, Settings2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

const allAlerts = [
  {
    id: "1",
    title: "Avian Influenza Alert - H5N1",
    description: "H5N1 outbreak confirmed 50km from your location. Immediate review of containment protocols recommended. Restrict all non-essential visitor access.",
    type: "critical" as const,
    time: "2 hours ago",
    location: "Regional Alert - District A",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    title: "African Swine Fever Update",
    description: "ASF cases reported in neighboring province. Enhanced border control measures in effect. Monitor pig health closely.",
    type: "critical" as const,
    time: "6 hours ago",
    location: "National Alert",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    title: "Monthly Biosecurity Inspection Due",
    description: "Your scheduled monthly biosecurity self-inspection is due in 3 days. Complete the checklist to maintain compliance.",
    type: "warning" as const,
    time: "1 day ago",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    title: "Feed Supplier Certification Expiring",
    description: "Your primary feed supplier's health certification expires in 14 days. Request updated documentation.",
    type: "warning" as const,
    time: "2 days ago",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "6",
    title: "Quarantine Period Completed",
    description: "New poultry batch has completed the 21-day quarantine period. Animals cleared for integration.",
    type: "success" as const,
    time: "3 days ago",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "7",
    title: "Weather Advisory",
    description: "Heavy rainfall expected this week may affect drainage systems. Ensure proper water management protocols.",
    type: "info" as const,
    time: "4 days ago",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "8",
    title: "System Maintenance Complete",
    description: "BioSecure system update successfully applied. All farm monitoring tools are online and synchronized.",
    type: "info" as const,
    time: "5 days ago",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function Alerts() {
  const [sortOrder, setSortOrder] = useState("newest");
  const [filterType, setFilterType] = useState("all");

  const filteredAlerts = allAlerts
    .filter(a => filterType === "all" || a.type === filterType)
    .sort((a, b) => {
      if (sortOrder === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

  const criticalAlerts = filteredAlerts.filter(a => a.type === "critical");
  const warningAlerts = filteredAlerts.filter(a => a.type === "warning");
  const otherAlerts = filteredAlerts.filter(a => a.type === "info" || a.type === "success");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <a href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </a>
          </Button>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                Alerts & Notifications
              </h1>
              <p className="text-muted-foreground">
                Stay informed about disease outbreaks, compliance deadlines, and farm updates.
              </p>
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Sort Order</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={sortOrder} onValueChange={setSortOrder}>
                    <DropdownMenuRadioItem value="newest">Newest First</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="oldest">Oldest First</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Alert Type</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={filterType} onValueChange={setFilterType}>
                    <DropdownMenuRadioItem value="all">All Alerts</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="critical">Critical</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="warning">Warnings</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" size="sm" className="gap-2" asChild>
                <a href="/profile?tab=privacy">
                  <Settings2 className="h-4 w-4" />
                  Settings
                </a>
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6 h-auto p-1 bg-muted/30 border border-border/40">
            <TabsTrigger value="all" className="px-6 py-2">All ({allAlerts.length})</TabsTrigger>
            <TabsTrigger value="critical" className="px-6 py-2">Critical ({allAlerts.filter(a => a.type === 'critical').length})</TabsTrigger>
            <TabsTrigger value="warnings" className="px-6 py-2">Warnings ({allAlerts.filter(a => a.type === 'warning').length})</TabsTrigger>
            <TabsTrigger value="other" className="px-6 py-2">Other ({allAlerts.filter(a => a.type === 'info' || a.type === 'success').length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))
            ) : (
              <EmptyAlertsState />
            )}
          </TabsContent>

          <TabsContent value="critical" className="space-y-3">
            {criticalAlerts.length > 0 ? (
              criticalAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))
            ) : (
              <EmptyAlertsState title="No Critical Alerts" />
            )}
          </TabsContent>

          <TabsContent value="warnings" className="space-y-3">
            {warningAlerts.length > 0 ? (
              warningAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))
            ) : (
              <EmptyAlertsState title="No Warnings" />
            )}
          </TabsContent>

          <TabsContent value="other" className="space-y-3">
            {otherAlerts.length > 0 ? (
              otherAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))
            ) : (
              <EmptyAlertsState title="No Other Updates" />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function EmptyAlertsState({ title = "No Alerts Found" }: { title?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm">
      <Bell className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">Everything looks good for now.</p>
    </div>
  );
}

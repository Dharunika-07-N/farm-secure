import { Header } from "@/components/layout/Header";
import { AlertCard } from "@/components/dashboard/AlertCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Bell, Filter } from "lucide-react";

const allAlerts = [
  {
    id: "1",
    title: "Avian Influenza Alert - H5N1",
    description: "H5N1 outbreak confirmed 50km from your location. Immediate review of containment protocols recommended. Restrict all non-essential visitor access.",
    type: "critical" as const,
    time: "2 hours ago",
    location: "Regional Alert - District A",
  },
  {
    id: "2",
    title: "African Swine Fever Update",
    description: "ASF cases reported in neighboring province. Enhanced border control measures in effect. Monitor pig health closely.",
    type: "critical" as const,
    time: "6 hours ago",
    location: "National Alert",
  },
  {
    id: "3",
    title: "Monthly Biosecurity Inspection Due",
    description: "Your scheduled monthly biosecurity self-inspection is due in 3 days. Complete the checklist to maintain compliance.",
    type: "warning" as const,
    time: "1 day ago",
  },
  {
    id: "4",
    title: "Feed Supplier Certification Expiring",
    description: "Your primary feed supplier's health certification expires in 14 days. Request updated documentation.",
    type: "warning" as const,
    time: "2 days ago",
  },
  {
    id: "5",
    title: "Staff Training Completed",
    description: "Farm worker John Doe successfully completed the 'Disease Prevention Protocols' training module.",
    type: "success" as const,
    time: "2 days ago",
  },
  {
    id: "6",
    title: "Quarantine Period Completed",
    description: "New poultry batch has completed the 21-day quarantine period. Animals cleared for integration.",
    type: "success" as const,
    time: "3 days ago",
  },
  {
    id: "7",
    title: "Weather Advisory",
    description: "Heavy rainfall expected this week may affect drainage systems. Ensure proper water management protocols.",
    type: "info" as const,
    time: "4 days ago",
  },
  {
    id: "8",
    title: "New Best Practice Guidelines Available",
    description: "Updated biosecurity guidelines for poultry farms have been published. Review the changes in the Training section.",
    type: "info" as const,
    time: "5 days ago",
  },
];

export default function Alerts() {
  const criticalAlerts = allAlerts.filter(a => a.type === "critical");
  const warningAlerts = allAlerts.filter(a => a.type === "warning");
  const otherAlerts = allAlerts.filter(a => a.type === "info" || a.type === "success");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <a href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
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
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-4 md:w-auto md:inline-grid">
            <TabsTrigger value="all">All ({allAlerts.length})</TabsTrigger>
            <TabsTrigger value="critical">Critical ({criticalAlerts.length})</TabsTrigger>
            <TabsTrigger value="warnings">Warnings ({warningAlerts.length})</TabsTrigger>
            <TabsTrigger value="other">Other ({otherAlerts.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            {allAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </TabsContent>

          <TabsContent value="critical" className="space-y-3">
            {criticalAlerts.length > 0 ? (
              criticalAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))
            ) : (
              <div className="rounded-xl border border-border bg-card p-8 text-center">
                <Bell className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">No Critical Alerts</h3>
                <p className="text-sm text-muted-foreground">All clear - no critical issues at this time.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="warnings" className="space-y-3">
            {warningAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </TabsContent>

          <TabsContent value="other" className="space-y-3">
            {otherAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

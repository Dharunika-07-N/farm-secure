import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StatCard } from "@/components/dashboard/StatCard";
import { AlertCard } from "@/components/dashboard/AlertCard";
import { RiskGauge } from "@/components/dashboard/RiskGauge";
import { ComplianceProgress } from "@/components/dashboard/ComplianceProgress";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Activity, 
  Users, 
  AlertTriangle,
  FileCheck,
  ArrowRight,
  RefreshCw,
  Map
} from "lucide-react";

const stats = [
  { title: "Biosecurity Score", value: "78%", icon: Shield, variant: "success" as const, trend: { value: 5, isPositive: true } },
  { title: "Active Protocols", value: 12, icon: Activity, variant: "info" as const },
  { title: "Staff Trained", value: "8/10", icon: Users, variant: "default" as const },
  { title: "Open Alerts", value: 3, icon: AlertTriangle, variant: "warning" as const },
];

const alerts = [
  {
    id: "1",
    title: "Avian Influenza Alert",
    description: "H5N1 outbreak reported 50km from your location. Review containment protocols.",
    type: "critical" as const,
    time: "2h ago",
    location: "Regional Level",
  },
  {
    id: "2",
    title: "Monthly Inspection Due",
    description: "Your scheduled biosecurity inspection is due in 3 days.",
    type: "warning" as const,
    time: "1d ago",
  },
  {
    id: "3",
    title: "Training Module Completed",
    description: "Staff member John completed 'Disease Prevention Basics' module.",
    type: "success" as const,
    time: "2d ago",
  },
];

const complianceItems = [
  { id: "1", name: "Visitor log maintained", completed: true },
  { id: "2", name: "Disinfection stations active", completed: true },
  { id: "3", name: "Feed storage secured", completed: true },
  { id: "4", name: "Quarantine protocols documented", completed: false },
  { id: "5", name: "Emergency response plan updated", completed: false },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">
              Welcome back, Farmer
            </h1>
            <p className="text-muted-foreground">
              Here's an overview of your farm's biosecurity status
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4" />
              Sync Data
            </Button>
            <Button size="sm">
              <FileCheck className="h-4 w-4" />
              Run Assessment
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Risk Gauge & Compliance */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-6 text-lg font-semibold text-foreground">Overall Risk Level</h3>
              <RiskGauge score={35} label="Current Farm Risk" />
              <div className="mt-6">
                <Button variant="outline" className="w-full" asChild>
                  <a href="/risk-assessment">
                    Update Assessment
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            <ComplianceProgress items={complianceItems} overallProgress={60} />
          </div>

          {/* Alerts Section */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Recent Alerts</h3>
                <Button variant="ghost" size="sm" asChild>
                  <a href="/alerts">
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Quick Actions</h3>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
                  <a href="/risk-assessment">
                    <Activity className="h-5 w-5 text-primary" />
                    <span>Risk Assessment</span>
                  </a>
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
                  <a href="/disease-map">
                    <Map className="h-5 w-5 text-destructive" />
                    <span>Outbreak Map</span>
                  </a>
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
                  <a href="/training">
                    <Users className="h-5 w-5 text-info" />
                    <span>Training Modules</span>
                  </a>
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
                  <a href="/compliance">
                    <FileCheck className="h-5 w-5 text-success" />
                    <span>Compliance Docs</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

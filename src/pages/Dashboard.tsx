import { useEffect, useState } from "react";
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
  Map,
  Loader2
} from "lucide-react";
import { getDashboardData, DashboardData, Alert as AlertType, Compliance as ComplianceType } from "@/services/dashboard.service";

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getDashboardData();
      setData(result);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data. Please check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = data ? [
    { title: "Biosecurity Score", value: data.stats.biosecurityScore, icon: Shield, variant: "success" as const, trend: { value: 5, isPositive: true } },
    { title: "Active Protocols", value: data.stats.activeProtocols, icon: Activity, variant: "info" as const },
    { title: "Staff Trained", value: data.stats.staffTrained, icon: Users, variant: "default" as const },
    { title: "Open Alerts", value: data.stats.openAlerts, icon: AlertTriangle, variant: "warning" as const },
  ] : [];

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
            <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Syncing...' : 'Sync Data'}
            </Button>
            <Button size="sm">
              <FileCheck className="h-4 w-4" />
              Run Assessment
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded bg-destructive/10 text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {error}
          </div>
        )}

        {loading && !data ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
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
                  {/* Mocked Score for now, ideally comes from API */}
                  <RiskGauge score={parseInt(data?.stats.biosecurityScore.replace('%', '') || '0') < 50 ? 70 : 35} label="Current Farm Risk" />
                  <div className="mt-6">
                    <Button variant="outline" className="w-full" asChild>
                      <a href="/risk-assessment">
                        Update Assessment
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>

                <ComplianceProgress items={data?.compliance || []} overallProgress={60} />
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
                    {data?.alerts.length === 0 ? (
                      <div className="text-center text-muted-foreground p-4">No active alerts</div>
                    ) : (
                      data?.alerts.map((alert) => (
                        <AlertCard key={alert.id} alert={{
                          ...alert,
                          time: new Date(alert.createdAt).toLocaleDateString(), // Simple format
                          location: 'Farm', // Mock
                          type: alert.type as any // Cast for now
                        }} />
                      )))}
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
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

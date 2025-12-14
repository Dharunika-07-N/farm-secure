import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { OutbreakMap } from "@/components/map/OutbreakMap";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle, RefreshCw } from "lucide-react";

export default function DiseaseMap() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex flex-1 flex-col">
        <div className="container py-4">
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Button variant="ghost" asChild className="mb-2">
                <a href="/dashboard">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </a>
              </Button>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                Disease Outbreak Map
              </h1>
              <p className="text-muted-foreground">
                Real-time visualization of disease outbreaks and risk zones in your region.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4" />
                Refresh Data
              </Button>
              <Button variant="warning" size="sm">
                <AlertTriangle className="h-4 w-4" />
                Report Outbreak
              </Button>
            </div>
          </div>

          {/* Alert Banner */}
          <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground">Active Alert: H5N1 Outbreak</h3>
                <p className="text-sm text-muted-foreground">
                  Avian Influenza H5N1 confirmed 50km from your farm location. Review biosecurity protocols immediately.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 border-t border-border" style={{ minHeight: "500px" }}>
          <OutbreakMap />
        </div>
      </main>

      <Footer />
    </div>
  );
}

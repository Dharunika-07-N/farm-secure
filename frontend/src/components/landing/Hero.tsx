import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, CheckCircle } from "lucide-react";

const features = [
  "Real-time disease alerts",
  "Risk assessment tools",
  "Compliance tracking",
  "Mobile-first design",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 py-20 md:py-32">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-primary-foreground blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-primary-foreground blur-3xl" />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-sm font-medium text-primary-foreground backdrop-blur-sm animate-fade-up">
            <Shield className="h-4 w-4" />
            Protecting Livestock Health
          </div>

          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-primary-foreground md:text-5xl lg:text-6xl animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Biosecurity Management for{" "}
            <span className="text-secondary">Healthier Farms</span>
          </h1>

          <p className="mb-8 text-lg text-primary-foreground/80 md:text-xl animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Empower your farm with comprehensive biosecurity protocols, risk assessment tools, 
            and real-time disease alerts designed for pig and poultry producers.
          </p>

          <div className="mb-10 flex flex-wrap items-center justify-center gap-3 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            {features.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-sm font-medium text-primary-foreground backdrop-blur-sm"
              >
                <CheckCircle className="h-4 w-4 text-secondary" />
                {feature}
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <Button variant="hero" size="xl" asChild>
              <a href="/dashboard">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <a href="/risk-assessment">
                Take Risk Assessment
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
}

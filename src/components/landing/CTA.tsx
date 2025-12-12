import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";

export function CTA() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/90 px-6 py-16 text-center shadow-lg md:px-12 md:py-20">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary-foreground blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-secondary blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-2xl">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/10 backdrop-blur-sm">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>

            <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
              Start Protecting Your Farm Today
            </h2>

            <p className="mb-8 text-lg text-primary-foreground/80">
              Join thousands of farmers who are safeguarding their livestock with our comprehensive biosecurity platform.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button variant="hero" size="xl" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90" asChild>
                <a href="/dashboard">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <a href="/training">
                  Explore Training
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

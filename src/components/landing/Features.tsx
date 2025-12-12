import { 
  ShieldCheck, 
  Activity, 
  BookOpen, 
  Bell, 
  FileCheck, 
  Users 
} from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Risk Assessment",
    description: "Customizable risk evaluation tools based on local epidemiological conditions and farm-specific factors.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: BookOpen,
    title: "Training Modules",
    description: "Interactive learning resources and best practice guidelines tailored for pig and poultry systems.",
    color: "bg-info/10 text-info",
  },
  {
    icon: FileCheck,
    title: "Compliance Tracking",
    description: "Monitor regulatory requirements and work toward disease-free compartment recognition.",
    color: "bg-success/10 text-success",
  },
  {
    icon: Bell,
    title: "Real-time Alerts",
    description: "Instant notifications for disease outbreaks and biosecurity breaches in your area.",
    color: "bg-warning/10 text-warning",
  },
  {
    icon: ShieldCheck,
    title: "Protocol Management",
    description: "Access customized biosecurity protocols and guidelines for your specific operation.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Users,
    title: "Stakeholder Network",
    description: "Connect with veterinarians, extension workers, and fellow farmers for collaborative support.",
    color: "bg-earth/10 text-earth",
  },
];

export function Features() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Everything You Need for{" "}
            <span className="text-primary">Farm Biosecurity</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A comprehensive platform designed to protect your livestock and secure your livelihood.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color} transition-transform group-hover:scale-110`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

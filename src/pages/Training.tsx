import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Clock, CheckCircle, Lock } from "lucide-react";

const trainingModules = [
  {
    id: "1",
    title: "Introduction to Biosecurity",
    description: "Learn the fundamentals of farm biosecurity and why it matters for your livestock.",
    duration: "15 min",
    progress: 100,
    status: "completed" as const,
    category: "Basics",
  },
  {
    id: "2",
    title: "Disease Prevention Protocols",
    description: "Understand common diseases affecting pigs and poultry and how to prevent them.",
    duration: "25 min",
    progress: 60,
    status: "in-progress" as const,
    category: "Prevention",
  },
  {
    id: "3",
    title: "Visitor Management",
    description: "Best practices for managing visitors and vehicles entering your farm.",
    duration: "20 min",
    progress: 0,
    status: "available" as const,
    category: "Operations",
  },
  {
    id: "4",
    title: "Cleaning & Disinfection",
    description: "Proper techniques for cleaning and disinfecting farm facilities and equipment.",
    duration: "30 min",
    progress: 0,
    status: "available" as const,
    category: "Operations",
  },
  {
    id: "5",
    title: "Emergency Response Planning",
    description: "How to prepare for and respond to disease outbreaks on your farm.",
    duration: "35 min",
    progress: 0,
    status: "locked" as const,
    category: "Advanced",
  },
  {
    id: "6",
    title: "Regulatory Compliance",
    description: "Understanding local and international biosecurity regulations and requirements.",
    duration: "40 min",
    progress: 0,
    status: "locked" as const,
    category: "Advanced",
  },
];

const statusStyles = {
  completed: { badge: "bg-success/10 text-success border-success/30", icon: CheckCircle },
  "in-progress": { badge: "bg-warning/10 text-warning border-warning/30", icon: Play },
  available: { badge: "bg-primary/10 text-primary border-primary/30", icon: Play },
  locked: { badge: "bg-muted text-muted-foreground border-border", icon: Lock },
};

export default function Training() {
  const completedCount = trainingModules.filter(m => m.status === "completed").length;
  const overallProgress = (completedCount / trainingModules.length) * 100;

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
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Training Center
          </h1>
          <p className="text-muted-foreground">
            Interactive learning modules to enhance your biosecurity knowledge.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Your Progress</h2>
              <p className="text-sm text-muted-foreground">
                {completedCount} of {trainingModules.length} modules completed
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Progress value={overallProgress} className="h-3 w-48" />
              <span className="text-lg font-bold text-primary">{Math.round(overallProgress)}%</span>
            </div>
          </div>
        </div>

        {/* Training Modules Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trainingModules.map((module) => {
            const style = statusStyles[module.status];
            const Icon = style.icon;
            const isLocked = module.status === "locked";

            return (
              <div
                key={module.id}
                className={`rounded-2xl border border-border bg-card p-6 shadow-sm transition-all ${
                  isLocked ? "opacity-60" : "hover:shadow-md hover:-translate-y-1"
                }`}
              >
                <div className="mb-4 flex items-start justify-between">
                  <Badge variant="outline" className={style.badge}>
                    {module.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {module.duration}
                  </div>
                </div>

                <h3 className="mb-2 font-semibold text-foreground">{module.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{module.description}</p>

                {module.status === "in-progress" && (
                  <div className="mb-4">
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">{module.progress}%</span>
                    </div>
                    <Progress value={module.progress} className="h-2" />
                  </div>
                )}

                <Button
                  variant={module.status === "completed" ? "outline" : "default"}
                  size="sm"
                  className="w-full"
                  disabled={isLocked}
                >
                  <Icon className="h-4 w-4" />
                  {module.status === "completed"
                    ? "Review"
                    : module.status === "in-progress"
                    ? "Continue"
                    : module.status === "locked"
                    ? "Locked"
                    : "Start"}
                </Button>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}

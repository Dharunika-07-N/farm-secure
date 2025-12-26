import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Clock, CheckCircle, Lock } from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";

const statusStyles: any = {
  completed: { badge: "bg-success/10 text-success border-success/30", icon: CheckCircle },
  "in-progress": { badge: "bg-warning/10 text-warning border-warning/30", icon: Play },
  available: { badge: "bg-primary/10 text-primary border-primary/30", icon: Play },
  locked: { badge: "bg-muted text-muted-foreground border-border", icon: Lock },
};

export default function Training() {
  const [trainingModules, setTrainingModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get(`${API_URL}/training/modules`);
        const modules = response.data.map((m: any) => ({
          id: m.id,
          title: m.name,
          description: m.description,
          duration: `${m.duration} min`,
          progress: 0,
          status: "available", // Default to available
          category: m.category,
        }));
        setTrainingModules(modules);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching training modules:", error);
        setLoading(false);
      }
    };
    fetchModules();
  }, []);
  const completedCount = trainingModules.filter(m => m.status === "completed").length;
  const overallProgress = (completedCount / trainingModules.length) * 100;

  const handleModuleClick = (moduleId: string, isLocked: boolean) => {
    if (!isLocked) {
      window.location.href = `/training/${moduleId}`;
    }
  };

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
                onClick={() => handleModuleClick(module.id, isLocked)}
                className={`rounded-2xl border border-border bg-card p-6 shadow-sm transition-all ${isLocked
                  ? "opacity-60 cursor-not-allowed"
                  : "cursor-pointer hover:shadow-md hover:-translate-y-1"
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleModuleClick(module.id, isLocked);
                  }}
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
    </div>
  );
}

import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComplianceItem {
  id: string;
  name: string;
  completed: boolean;
}

interface ComplianceProgressProps {
  items: ComplianceItem[];
  overallProgress: number;
}

export function ComplianceProgress({ items, overallProgress }: ComplianceProgressProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Compliance Status</h3>
        <span className="text-2xl font-bold text-primary">{overallProgress}%</span>
      </div>
      
      <Progress value={overallProgress} className="mb-6 h-3" />

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            {item.completed ? (
              <CheckCircle className="h-5 w-5 text-success" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground" />
            )}
            <span className={cn(
              "text-sm",
              item.completed ? "text-foreground" : "text-muted-foreground"
            )}>
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

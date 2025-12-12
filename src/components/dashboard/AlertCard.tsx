import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  title: string;
  description: string;
  type: "critical" | "warning" | "info" | "success";
  time: string;
  location?: string;
}

const alertStyles = {
  critical: {
    bg: "bg-destructive/10 border-destructive/30",
    icon: XCircle,
    iconColor: "text-destructive",
  },
  warning: {
    bg: "bg-warning/10 border-warning/30",
    icon: AlertTriangle,
    iconColor: "text-warning",
  },
  info: {
    bg: "bg-info/10 border-info/30",
    icon: Info,
    iconColor: "text-info",
  },
  success: {
    bg: "bg-success/10 border-success/30",
    icon: CheckCircle,
    iconColor: "text-success",
  },
};

interface AlertCardProps {
  alert: Alert;
}

export function AlertCard({ alert }: AlertCardProps) {
  const style = alertStyles[alert.type];
  const Icon = style.icon;

  return (
    <div className={cn(
      "rounded-xl border p-4 transition-all hover:shadow-sm",
      style.bg
    )}>
      <div className="flex gap-3">
        <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", style.iconColor)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-foreground">{alert.title}</h4>
            <span className="text-xs text-muted-foreground whitespace-nowrap">{alert.time}</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{alert.description}</p>
          {alert.location && (
            <p className="mt-2 text-xs font-medium text-muted-foreground">📍 {alert.location}</p>
          )}
        </div>
      </div>
    </div>
  );
}

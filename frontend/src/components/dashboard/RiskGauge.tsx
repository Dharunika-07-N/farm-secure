import { cn } from "@/lib/utils";

interface RiskGaugeProps {
  score: number; // 0-100
  label: string;
}

export function RiskGauge({ score, label }: RiskGaugeProps) {
  const getRiskLevel = (score: number) => {
    if (score <= 30) return { level: "Low", color: "text-success", bg: "bg-success" };
    if (score <= 60) return { level: "Medium", color: "text-warning", bg: "bg-warning" };
    return { level: "High", color: "text-destructive", bg: "bg-destructive" };
  };

  const risk = getRiskLevel(score);
  const rotation = (score / 100) * 180 - 90; // -90 to 90 degrees

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-24 w-48">
        {/* Background arc */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="h-48 w-48 rounded-full border-[12px] border-muted" />
        </div>
        
        {/* Colored segments */}
        <svg className="absolute inset-0 h-24 w-48" viewBox="0 0 200 100">
          <path
            d="M 20 100 A 80 80 0 0 1 80 20.4"
            fill="none"
            stroke="hsl(var(--success))"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 80 20.4 A 80 80 0 0 1 120 20.4"
            fill="none"
            stroke="hsl(var(--warning))"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 120 20.4 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="hsl(var(--destructive))"
            strokeWidth="12"
            strokeLinecap="round"
          />
        </svg>

        {/* Needle */}
        <div 
          className="absolute bottom-0 left-1/2 h-16 w-1 origin-bottom -translate-x-1/2 rounded-full bg-foreground transition-transform duration-700"
          style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
        />
        
        {/* Center circle */}
        <div className="absolute bottom-0 left-1/2 h-4 w-4 -translate-x-1/2 translate-y-1/2 rounded-full bg-foreground" />
      </div>

      <div className="mt-4 text-center">
        <p className={cn("text-2xl font-bold", risk.color)}>{score}%</p>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className={cn("text-sm font-semibold", risk.color)}>{risk.level} Risk</p>
      </div>
    </div>
  );
}

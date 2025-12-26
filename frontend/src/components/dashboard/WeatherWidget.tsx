import { Cloud, Droplets, Wind, Thermometer, AlertCircle } from "lucide-react";

interface WeatherWidgetProps {
    data?: {
        temp: number;
        humidity: number;
        windSpeed: number;
        description: string;
        icon: string;
        biosecurityRisk: 'low' | 'medium' | 'high';
    };
}

export function WeatherWidget({ data }: WeatherWidgetProps) {
    if (!data) {
        return (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Local Weather</h3>
                <p className="text-sm text-muted-foreground">Weather data unavailable. Please ensure your farm location and API key are set.</p>
            </div>
        );
    }

    const riskColors = {
        low: "text-success bg-success/10 border-success/20",
        medium: "text-warning bg-warning/10 border-warning/20",
        high: "text-destructive bg-destructive/10 border-destructive/20"
    };

    return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Local Weather</h3>
                <div className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${riskColors[data.biosecurityRisk]}`}>
                    <AlertCircle className="h-3 w-3" />
                    {data.biosecurityRisk} Risk
                </div>
            </div>

            <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/5">
                    <img
                        src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
                        alt={data.description}
                        className="h-12 w-12"
                    />
                </div>
                <div>
                    <div className="text-3xl font-bold text-foreground">{Math.round(data.temp)}°C</div>
                    <div className="text-sm capitalize text-muted-foreground">{data.description}</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                    <Droplets className="h-4 w-4 text-info" />
                    <div>
                        <div className="text-xs text-muted-foreground">Humidity</div>
                        <div className="text-sm font-semibold text-foreground">{data.humidity}%</div>
                    </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                    <Wind className="h-4 w-4 text-primary" />
                    <div>
                        <div className="text-xs text-muted-foreground">Wind</div>
                        <div className="text-sm font-semibold text-foreground">{data.windSpeed} m/s</div>
                    </div>
                </div>
            </div>

            <p className="mt-4 text-[10px] text-muted-foreground">
                * Risk level calculated based on temperature, humidity, and wind conditions affecting pathogen transmission.
            </p>
        </div>
    );
}

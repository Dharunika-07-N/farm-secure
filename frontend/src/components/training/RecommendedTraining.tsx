import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Clock, BookOpen, Loader2 } from "lucide-react";
import api from "@/lib/api";

export function RecommendedTraining() {
    const [modules, setModules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await api.get("/training/recommendations");
                setModules(response.data);
            } catch (error) {
                console.error("Failed to fetch training recommendations:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecommendations();
    }, []);

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
    }

    if (modules.length === 0) {
        return (
            <Card className="p-6 text-center border-dashed border-2">
                <p className="text-muted-foreground text-sm">No specific recommendations yet. Complete a risk assessment to see targeted training.</p>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Recommended for You
            </h3>
            <div className="grid gap-4">
                {modules.map((module) => (
                    <Card key={module.id} className="p-4 hover:shadow-md transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 group-hover:opacity-10 transition-opacity">
                            <PlayCircle className="h-12 w-12" />
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <h4 className="font-bold group-hover:text-primary transition-colors">{module.name}</h4>
                                <p className="text-xs text-muted-foreground line-clamp-1">{module.description}</p>
                                <div className="flex gap-4 mt-2">
                                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        {module.duration} mins
                                    </span>
                                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                                        <BookOpen className="h-3 w-3" />
                                        {module.level}
                                    </span>
                                </div>
                            </div>
                            <Button size="sm" className="shrink-0">
                                Start Module
                                <PlayCircle className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

import { useState, useEffect } from "react";
import { Cloud, CloudOff, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SyncStatus() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    const triggerSync = () => {
        if (!isOnline) return;
        setIsSyncing(true);
        // Simulate background sync
        setTimeout(() => {
            setIsSyncing(false);
        }, 2000);
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <Badge
                variant={isOnline ? "outline" : "destructive"}
                className={`flex items-center gap-2 px-3 py-1.5 shadow-lg backdrop-blur-md ${isOnline ? 'bg-background/80' : 'bg-destructive/90'}`}
            >
                {isOnline ? (
                    <>
                        <Cloud className="h-3.5 w-3.5 text-success" />
                        <span className="text-[10px] font-bold uppercase tracking-tight">System Online</span>
                        <button
                            onClick={triggerSync}
                            disabled={isSyncing}
                            className={`ml-2 hover:bg-muted p-0.5 rounded transition-transform ${isSyncing ? 'animate-spin' : ''}`}
                        >
                            <RefreshCw className="h-3 w-3" />
                        </button>
                    </>
                ) : (
                    <>
                        <CloudOff className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-tight">Offline Mode - Data Cached</span>
                    </>
                )}
            </Badge>
        </div>
    );
}

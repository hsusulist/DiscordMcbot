import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Square, Clock } from "lucide-react";

interface MonitoringControlsProps {
  onModeChange?: (mode: "once" | "auto") => void;
  onStart?: () => void;
  onStop?: () => void;
  isMonitoring?: boolean;
}

export default function MonitoringControls({ 
  onModeChange, 
  onStart, 
  onStop,
  isMonitoring = false 
}: MonitoringControlsProps) {
  const [mode, setMode] = useState<"once" | "auto">("once");

  const handleModeChange = (newMode: "once" | "auto") => {
    setMode(newMode);
    console.log("Monitoring mode changed to:", newMode);
    onModeChange?.(newMode);
  };

  const handleStart = () => {
    console.log("Starting monitoring...");
    onStart?.();
  };

  const handleStop = () => {
    console.log("Stopping monitoring...");
    onStop?.();
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Monitoring Controls</CardTitle>
            <CardDescription className="text-sm">Configure check frequency and monitoring</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Check Frequency</p>
          <div className="inline-flex rounded-md border bg-muted/50 p-1" role="group">
            <button
              onClick={() => handleModeChange("once")}
              className={`rounded-sm px-4 py-2 text-sm font-medium transition-all ${
                mode === "once" 
                  ? "bg-background shadow-sm" 
                  : "hover-elevate"
              }`}
              data-testid="button-mode-once"
            >
              One-time Check
            </button>
            <button
              onClick={() => handleModeChange("auto")}
              className={`rounded-sm px-4 py-2 text-sm font-medium transition-all ${
                mode === "auto" 
                  ? "bg-background shadow-sm" 
                  : "hover-elevate"
              }`}
              data-testid="button-mode-auto"
            >
              Auto-monitor (2 min)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isMonitoring ? (
            <Button
              onClick={handleStart}
              className="flex-1"
              data-testid="button-start-monitoring-control"
            >
              <Play className="mr-2 h-4 w-4" />
              Start {mode === "auto" ? "Auto-Monitor" : "Check"}
            </Button>
          ) : (
            <Button
              onClick={handleStop}
              variant="destructive"
              className="flex-1"
              data-testid="button-stop-monitoring"
            >
              <Square className="mr-2 h-4 w-4" />
              Stop Monitoring
            </Button>
          )}
          {isMonitoring && mode === "auto" && (
            <Badge variant="default" className="flex items-center gap-1.5 animate-pulse">
              <div className="h-2 w-2 rounded-full bg-white" />
              Active
            </Badge>
          )}
        </div>

        {mode === "auto" && (
          <p className="text-xs text-muted-foreground">
            Server will be checked every 2 minutes for player count and status
          </p>
        )}
      </CardContent>
    </Card>
  );
}

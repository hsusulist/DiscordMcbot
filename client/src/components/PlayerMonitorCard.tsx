import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, RefreshCw } from "lucide-react";

interface PlayerMonitorCardProps {
  playerCount?: number;
  maxPlayers?: number;
  playerNames?: string[];
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function PlayerMonitorCard({ 
  playerCount = 0, 
  maxPlayers = 20,
  playerNames = [],
  onRefresh,
  isRefreshing = false
}: PlayerMonitorCardProps) {
  const handleRefresh = () => {
    console.log("Refreshing player count...");
    onRefresh?.();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-xl">Player Count</CardTitle>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleRefresh}
            disabled={isRefreshing}
            data-testid="button-refresh-players"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold" data-testid="text-player-count">{playerCount}</span>
          <span className="text-2xl text-muted-foreground">/ {maxPlayers}</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Server Capacity</span>
            <span className="font-medium">{Math.round((playerCount / maxPlayers) * 100)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${(playerCount / maxPlayers) * 100}%` }}
            />
          </div>
        </div>
        {playerNames && playerNames.length > 0 && (
          <div className="space-y-2 pt-2 border-t">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Online Players
            </p>
            <div className="flex flex-wrap gap-1.5">
              {playerNames.map((name, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ServerStatusCardProps {
  ip?: string;
  port?: string;
  status?: "online" | "offline" | "checking";
  lastChecked?: Date;
}

export default function ServerStatusCard({ 
  ip = "Not configured", 
  port = "25565",
  status = "offline",
  lastChecked
}: ServerStatusCardProps) {
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      description: `${label} copied to clipboard`,
    });
  };

  const statusConfig = {
    online: {
      icon: CheckCircle2,
      color: "bg-green-500",
      textColor: "text-green-600",
      bgColor: "bg-green-500/10",
      label: "Online"
    },
    offline: {
      icon: XCircle,
      color: "bg-gray-400",
      textColor: "text-gray-600",
      bgColor: "bg-gray-400/10",
      label: "Offline"
    },
    checking: {
      icon: Clock,
      color: "bg-amber-500",
      textColor: "text-amber-600",
      bgColor: "bg-amber-500/10",
      label: "Checking..."
    }
  };

  const currentStatus = statusConfig[status];
  const StatusIcon = currentStatus.icon;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-xl">Server Status</CardTitle>
          <Badge 
            className={`flex items-center gap-1.5 ${currentStatus.bgColor} ${currentStatus.textColor} border-0`}
            data-testid="badge-server-status"
          >
            <div className={`h-2 w-2 rounded-full ${currentStatus.color} ${status === "checking" ? "animate-pulse" : ""}`} />
            {currentStatus.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              IP Address
            </p>
            <div className="flex items-center gap-2">
              <p className="font-mono text-sm font-medium" data-testid="text-server-ip">{ip}</p>
              {ip !== "Not configured" && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => copyToClipboard(ip, "IP address")}
                  data-testid="button-copy-ip"
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Port
            </p>
            <div className="flex items-center gap-2">
              <p className="font-mono text-sm font-medium" data-testid="text-server-port">{port}</p>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => copyToClipboard(port, "Port")}
                data-testid="button-copy-port"
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Status
            </p>
            <p className="text-sm font-medium flex items-center gap-2">
              <StatusIcon className={`h-4 w-4 ${currentStatus.textColor}`} />
              {currentStatus.label}
            </p>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Last Checked
            </p>
            <p className="text-sm font-medium" data-testid="text-last-checked">
              {lastChecked ? lastChecked.toLocaleTimeString() : "Never"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

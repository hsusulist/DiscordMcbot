import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Network } from "lucide-react";

interface ServerSetupCardProps {
  onSave?: (ip: string, port: string) => void;
  initialIp?: string;
  initialPort?: string;
}

export default function ServerSetupCard({ onSave, initialIp = "", initialPort = "25565" }: ServerSetupCardProps) {
  const [ip, setIp] = useState(initialIp);
  const [port, setPort] = useState(initialPort);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    console.log("Starting monitoring for", ip, port);
    await new Promise(resolve => setTimeout(resolve, 600));
    onSave?.(ip, port);
    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
            <Network className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Server Setup</CardTitle>
            <CardDescription className="text-sm">Configure your Minecraft server details</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2 lg:col-span-1">
            <Label htmlFor="server-ip" className="text-sm font-medium">
              Server IP Address
            </Label>
            <Input
              id="server-ip"
              type="text"
              placeholder="mc.example.com"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              className="font-mono text-sm"
              data-testid="input-server-ip"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="server-port" className="text-sm font-medium">
              Port
            </Label>
            <Input
              id="server-port"
              type="text"
              placeholder="25565"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              className="font-mono text-sm"
              data-testid="input-server-port"
            />
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!ip || !port || isSubmitting}
          className="w-full"
          data-testid="button-start-monitoring"
        >
          {isSubmitting ? "Starting..." : "Start Monitoring"}
        </Button>
      </CardContent>
    </Card>
  );
}

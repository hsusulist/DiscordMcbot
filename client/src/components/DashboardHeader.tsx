import { Server } from "lucide-react";

export default function DashboardHeader() {
  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
            <Server className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">MC-Bot</h1>
            <p className="text-sm text-muted-foreground">Minecraft Server Monitor</p>
          </div>
        </div>
      </div>
    </div>
  );
}

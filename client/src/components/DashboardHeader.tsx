import { Server, Home, Settings } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function DashboardHeader() {
  const [location] = useLocation();

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
              <Server className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">MC-Bot</h1>
              <p className="text-sm text-muted-foreground">Minecraft Server Monitor</p>
            </div>
          </div>
          <nav className="flex gap-2">
            <Link href="/">
              <Button 
                variant={location === "/" ? "default" : "ghost"} 
                size="sm"
                data-testid="link-dashboard"
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/settings">
              <Button 
                variant={location === "/settings" ? "default" : "ghost"} 
                size="sm"
                data-testid="link-settings"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Server, CheckCircle2, XCircle } from "lucide-react";

interface BotConfigCardProps {
  onSave?: (token: string) => void;
  initialToken?: string;
  isConnected?: boolean;
}

export default function BotConfigCard({ onSave, initialToken = "", isConnected = false }: BotConfigCardProps) {
  const [token, setToken] = useState(initialToken);
  const [showToken, setShowToken] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    console.log("Saving bot token...");
    await new Promise(resolve => setTimeout(resolve, 800));
    onSave?.(token);
    setIsSaving(false);
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
              <Server className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Bot Configuration</CardTitle>
              <CardDescription className="text-sm">Connect your Discord bot token</CardDescription>
            </div>
          </div>
          <Badge 
            variant={isConnected ? "default" : "secondary"}
            className="flex items-center gap-1.5"
            data-testid="badge-connection-status"
          >
            {isConnected ? (
              <>
                <CheckCircle2 className="h-3 w-3" />
                Connected
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3" />
                Disconnected
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bot-token" className="text-sm font-medium">
            Discord Bot Token
          </Label>
          <div className="relative">
            <Input
              id="bot-token"
              type={showToken ? "text" : "password"}
              placeholder="MTIzNDU2Nzg5MDEyMzQ1Njc4OTAuAbCdEf.XyZ123-AbC456DeF789"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="pr-10 font-mono text-sm"
              data-testid="input-bot-token"
            />
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-toggle-token-visibility"
            >
              {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Get your bot token from the Discord Developer Portal
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={!token || isSaving}
          className="w-full"
          data-testid="button-save-token"
        >
          {isSaving ? "Connecting..." : "Save & Connect"}
        </Button>
      </CardContent>
    </Card>
  );
}

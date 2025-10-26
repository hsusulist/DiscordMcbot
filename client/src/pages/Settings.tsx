import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { applySettings } from "@/hooks/use-settings";
import { Settings as SettingsIcon, Palette, Save, RotateCcw } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import type { WebsiteSettings } from "@shared/schema";

const defaultSettings: WebsiteSettings = {
  primaryColor: "#3b82f6",
  backgroundColor: "#ffffff",
  cardBackgroundColor: "#ffffff",
  textColor: "#0f172a",
  borderColor: "#e2e8f0",
  accentColor: "#8b5cf6",
  successColor: "#10b981",
  errorColor: "#ef4444",
  warningColor: "#f59e0b",
  theme: "light",
};

export default function Settings() {
  const { toast } = useToast();
  const [localSettings, setLocalSettings] = useState<WebsiteSettings>(defaultSettings);

  // Fetch settings
  const { data: settings, isLoading } = useQuery<WebsiteSettings>({
    queryKey: ["/api/settings"],
  });

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  // Save settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: async (settings: WebsiteSettings) => {
      return apiRequest("POST", "/api/settings", settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Settings saved",
        description: "Your website settings have been saved successfully",
      });
      applySettings(localSettings);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    saveSettingsMutation.mutate(localSettings);
  };

  const handleReset = () => {
    setLocalSettings(defaultSettings);
    applySettings(defaultSettings);
    toast({
      description: "Settings reset to default values",
    });
  };

  const updateColor = (key: keyof WebsiteSettings, value: string) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    // Apply settings in real-time for preview
    applySettings(newSettings);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading settings...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <section className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <SettingsIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Website Settings</h1>
                <p className="text-muted-foreground">Customize your dashboard appearance</p>
              </div>
            </div>
          </section>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                <CardTitle>Color Customization</CardTitle>
              </div>
              <CardDescription>
                Personalize your dashboard with custom colors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor" data-testid="label-primary-color">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={localSettings.primaryColor}
                      onChange={(e) => updateColor("primaryColor", e.target.value)}
                      className="h-10 w-20 cursor-pointer"
                      data-testid="input-primary-color"
                    />
                    <Input
                      type="text"
                      value={localSettings.primaryColor}
                      onChange={(e) => updateColor("primaryColor", e.target.value)}
                      className="flex-1"
                      data-testid="input-primary-color-text"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accentColor" data-testid="label-accent-color">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={localSettings.accentColor}
                      onChange={(e) => updateColor("accentColor", e.target.value)}
                      className="h-10 w-20 cursor-pointer"
                      data-testid="input-accent-color"
                    />
                    <Input
                      type="text"
                      value={localSettings.accentColor}
                      onChange={(e) => updateColor("accentColor", e.target.value)}
                      className="flex-1"
                      data-testid="input-accent-color-text"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="successColor" data-testid="label-success-color">Success Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="successColor"
                      type="color"
                      value={localSettings.successColor}
                      onChange={(e) => updateColor("successColor", e.target.value)}
                      className="h-10 w-20 cursor-pointer"
                      data-testid="input-success-color"
                    />
                    <Input
                      type="text"
                      value={localSettings.successColor}
                      onChange={(e) => updateColor("successColor", e.target.value)}
                      className="flex-1"
                      data-testid="input-success-color-text"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="errorColor" data-testid="label-error-color">Error Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="errorColor"
                      type="color"
                      value={localSettings.errorColor}
                      onChange={(e) => updateColor("errorColor", e.target.value)}
                      className="h-10 w-20 cursor-pointer"
                      data-testid="input-error-color"
                    />
                    <Input
                      type="text"
                      value={localSettings.errorColor}
                      onChange={(e) => updateColor("errorColor", e.target.value)}
                      className="flex-1"
                      data-testid="input-error-color-text"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warningColor" data-testid="label-warning-color">Warning Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="warningColor"
                      type="color"
                      value={localSettings.warningColor}
                      onChange={(e) => updateColor("warningColor", e.target.value)}
                      className="h-10 w-20 cursor-pointer"
                      data-testid="input-warning-color"
                    />
                    <Input
                      type="text"
                      value={localSettings.warningColor}
                      onChange={(e) => updateColor("warningColor", e.target.value)}
                      className="flex-1"
                      data-testid="input-warning-color-text"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backgroundColor" data-testid="label-bg-color">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={localSettings.backgroundColor}
                      onChange={(e) => updateColor("backgroundColor", e.target.value)}
                      className="h-10 w-20 cursor-pointer"
                      data-testid="input-bg-color"
                    />
                    <Input
                      type="text"
                      value={localSettings.backgroundColor}
                      onChange={(e) => updateColor("backgroundColor", e.target.value)}
                      className="flex-1"
                      data-testid="input-bg-color-text"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardBackgroundColor" data-testid="label-card-bg-color">Card Background</Label>
                  <div className="flex gap-2">
                    <Input
                      id="cardBackgroundColor"
                      type="color"
                      value={localSettings.cardBackgroundColor}
                      onChange={(e) => updateColor("cardBackgroundColor", e.target.value)}
                      className="h-10 w-20 cursor-pointer"
                      data-testid="input-card-bg-color"
                    />
                    <Input
                      type="text"
                      value={localSettings.cardBackgroundColor}
                      onChange={(e) => updateColor("cardBackgroundColor", e.target.value)}
                      className="flex-1"
                      data-testid="input-card-bg-color-text"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="textColor" data-testid="label-text-color">Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="textColor"
                      type="color"
                      value={localSettings.textColor}
                      onChange={(e) => updateColor("textColor", e.target.value)}
                      className="h-10 w-20 cursor-pointer"
                      data-testid="input-text-color"
                    />
                    <Input
                      type="text"
                      value={localSettings.textColor}
                      onChange={(e) => updateColor("textColor", e.target.value)}
                      className="flex-1"
                      data-testid="input-text-color-text"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="borderColor" data-testid="label-border-color">Border Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="borderColor"
                      type="color"
                      value={localSettings.borderColor}
                      onChange={(e) => updateColor("borderColor", e.target.value)}
                      className="h-10 w-20 cursor-pointer"
                      data-testid="input-border-color"
                    />
                    <Input
                      type="text"
                      value={localSettings.borderColor}
                      onChange={(e) => updateColor("borderColor", e.target.value)}
                      className="flex-1"
                      data-testid="input-border-color-text"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={handleSave}
                  disabled={saveSettingsMutation.isPending}
                  className="flex-1"
                  data-testid="button-save-settings"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saveSettingsMutation.isPending ? "Saving..." : "Save Settings"}
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  data-testid="button-reset-settings"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Default
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

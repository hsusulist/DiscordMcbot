import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import type { WebsiteSettings } from "@shared/schema";

export function useSettings() {
  const { data: settings } = useQuery<WebsiteSettings>({
    queryKey: ["/api/settings"],
  });

  useEffect(() => {
    if (settings) {
      applySettings(settings);
    }
  }, [settings]);

  return { settings };
}

export function applySettings(settings: WebsiteSettings) {
  const root = document.documentElement;
  
  // Convert hex to HSL for CSS variables
  const hexToHSL = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return "0 0% 0%";
    
    const r = parseInt(result[1], 16) / 255;
    const g = parseInt(result[2], 16) / 255;
    const b = parseInt(result[3], 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };
  
  // Apply primary color
  root.style.setProperty("--primary", hexToHSL(settings.primaryColor));
  
  // Apply background colors
  root.style.setProperty("--background", hexToHSL(settings.backgroundColor));
  root.style.setProperty("--card", hexToHSL(settings.cardBackgroundColor));
  
  // Apply text and border colors
  root.style.setProperty("--foreground", hexToHSL(settings.textColor));
  root.style.setProperty("--border", hexToHSL(settings.borderColor));
  
  // Apply semantic colors
  root.style.setProperty("--accent", hexToHSL(settings.accentColor));
  root.style.setProperty("--destructive", hexToHSL(settings.errorColor));
  root.style.setProperty("--success", hexToHSL(settings.successColor));
  root.style.setProperty("--warning", hexToHSL(settings.warningColor));
  
  // Apply theme
  if (settings.theme === "dark") {
    root.classList.add("dark");
  } else if (settings.theme === "light") {
    root.classList.remove("dark");
  } else {
    // Auto - use system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }
}

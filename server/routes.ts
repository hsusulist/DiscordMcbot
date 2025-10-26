import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { startBot, stopBot, getBotInstance } from "./discord-bot";
import { checkMinecraftServer, createServerStatus } from "./minecraft-checker";
import { monitoringManager } from "./monitoring-manager";
import { botConfigSchema, serverConfigSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Bot configuration endpoints
  app.post("/api/bot/config", async (req, res) => {
    try {
      const validation = botConfigSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid bot configuration", 
          errors: validation.error.errors 
        });
      }

      const { token } = validation.data;
      
      // Save config
      await storage.saveBotConfig({ token });
      
      // Start the bot
      try {
        await startBot(token);
        res.json({ 
          message: "Bot configured and started successfully",
          connected: true 
        });
      } catch (error) {
        console.error("Failed to start bot:", error);
        res.status(500).json({ 
          message: "Failed to start bot. Please check your token.",
          connected: false
        });
      }
    } catch (error) {
      console.error("Error saving bot config:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/bot/status", async (req, res) => {
    try {
      const config = await storage.getBotConfig();
      const bot = getBotInstance();
      
      res.json({
        configured: !!config,
        connected: bot?.getClient().isReady() || false,
        username: bot?.getClient().user?.username,
      });
    } catch (error) {
      console.error("Error getting bot status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Server configuration endpoints
  app.post("/api/server/config", async (req, res) => {
    try {
      // For web dashboard, we'll use a special guildId
      const guildId = "web-dashboard";
      
      const validation = serverConfigSchema.safeParse({
        ...req.body,
        guildId,
      });
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid server configuration", 
          errors: validation.error.errors 
        });
      }

      // Stop any existing monitoring to prevent stale intervals (after validation succeeds)
      monitoringManager.stopMonitoring(guildId);

      const config = await storage.saveServerConfig(validation.data);
      
      // Only start monitoring if the new config explicitly requests it
      if (config.autoMonitor) {
        await monitoringManager.startMonitoring(guildId, config.ip, parseInt(config.port));
      }
      
      res.json(config);
    } catch (error) {
      console.error("Error saving server config:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/server/config", async (req, res) => {
    try {
      const guildId = "web-dashboard";
      const config = await storage.getServerConfig(guildId);
      
      if (!config) {
        return res.json(null);
      }
      
      res.json(config);
    } catch (error) {
      console.error("Error getting server config:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Server status endpoints
  app.get("/api/server/status", async (req, res) => {
    try {
      const guildId = "web-dashboard";
      const status = await storage.getServerStatus(guildId);
      
      if (!status) {
        return res.json(null);
      }
      
      res.json(status);
    } catch (error) {
      console.error("Error getting server status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/server/check", async (req, res) => {
    try {
      const guildId = "web-dashboard";
      const config = await storage.getServerConfig(guildId);
      
      if (!config) {
        return res.status(400).json({ 
          message: "Server not configured. Please configure server first." 
        });
      }

      // Check server status
      const serverInfo = await checkMinecraftServer(config.ip, parseInt(config.port));
      const serverStatus = createServerStatus(guildId, serverInfo);
      
      // Save status
      await storage.saveServerStatus(serverStatus);
      
      res.json(serverStatus);
    } catch (error) {
      console.error("Error checking server:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Monitoring control endpoints
  app.post("/api/server/monitor", async (req, res) => {
    try {
      const { action } = req.body as { action: "start" | "stop" };
      const guildId = "web-dashboard";
      const config = await storage.getServerConfig(guildId);
      
      if (!config) {
        return res.status(400).json({ 
          message: "Server not configured. Please configure server first." 
        });
      }

      if (action === "start") {
        // Update config to enable auto-monitoring
        await storage.saveServerConfig({ ...config, autoMonitor: true });
        
        // Start monitoring
        await monitoringManager.startMonitoring(guildId, config.ip, parseInt(config.port));
        
        res.json({ 
          message: "Auto-monitoring started",
          monitoring: true 
        });
      } else if (action === "stop") {
        // Stop monitoring
        monitoringManager.stopMonitoring(guildId);
        
        await storage.saveServerConfig({ ...config, autoMonitor: false });
        res.json({ 
          message: "Auto-monitoring stopped",
          monitoring: false 
        });
      } else {
        res.status(400).json({ message: "Invalid action" });
      }
    } catch (error) {
      console.error("Error controlling monitoring:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  // Auto-start bot and monitoring if configured
  (async () => {
    // Start bot
    const config = await storage.getBotConfig();
    if (config) {
      try {
        await startBot(config.token);
        console.log("Bot auto-started from saved configuration");
      } catch (error) {
        console.error("Failed to auto-start bot:", error);
      }
    }
    
    // Restore monitoring
    await monitoringManager.restoreMonitoring();
  })();

  return httpServer;
}

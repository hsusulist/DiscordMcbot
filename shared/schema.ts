import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Bot configuration schema
export const botConfigSchema = z.object({
  token: z.string().min(1, "Bot token is required"),
});

export type BotConfig = z.infer<typeof botConfigSchema>;

// Server configuration schema
export const serverConfigSchema = z.object({
  guildId: z.string(),
  ip: z.string().min(1, "Server IP is required"),
  port: z.string().regex(/^\d+$/, "Port must be a number").default("25565"),
  autoMonitor: z.boolean().default(false),
});

export const insertServerConfigSchema = serverConfigSchema;
export type InsertServerConfig = z.infer<typeof insertServerConfigSchema>;
export type ServerConfig = InsertServerConfig & { 
  lastChecked?: Date;
  status?: "online" | "offline" | "checking";
  playerCount?: number;
  maxPlayers?: number;
};

// Server status schema
export const serverStatusSchema = z.object({
  guildId: z.string(),
  status: z.enum(["online", "offline", "checking"]),
  playerCount: z.number().optional(),
  maxPlayers: z.number().optional(),
  lastChecked: z.date(),
  version: z.string().optional(),
  motd: z.string().optional(),
  playerNames: z.array(z.string()).optional(),
});

export type ServerStatus = z.infer<typeof serverStatusSchema>;

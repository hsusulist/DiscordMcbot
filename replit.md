# MC-Bot - Minecraft Server Monitor Discord Bot

## Overview
MC-Bot is a Discord bot with a web dashboard for monitoring Minecraft server status and player counts. It provides slash commands for Discord servers and a web interface for easy bot configuration and server monitoring.

## Features
- **Discord Bot Integration**: Discord.js bot with slash commands
- **Web Dashboard**: React-based dashboard for bot configuration and monitoring
- **Minecraft Server Monitoring**: Real-time server status and player count tracking
- **Auto-Monitoring**: Automatic server checks every 2 minutes
- **Multiple Interfaces**: Control via Discord commands or web dashboard

## Architecture

### Backend (Express + TypeScript)
- **server/index.ts**: Main server entry point
- **server/routes.ts**: API routes for web dashboard
- **server/discord-bot.ts**: Discord bot implementation with slash commands
- **server/minecraft-checker.ts**: Minecraft server status checking utility
- **server/monitoring-manager.ts**: Auto-monitoring system for periodic checks
- **server/storage.ts**: In-memory storage for bot config and server settings

### Frontend (React + TypeScript + Vite)
- **client/src/pages/Dashboard.tsx**: Main dashboard page
- **client/src/components/**: Reusable UI components
  - BotConfigCard: Bot token configuration
  - ServerSetupCard: Server IP/port setup
  - ServerStatusCard: Real-time server status display
  - PlayerMonitorCard: Player count and capacity
  - MonitoringControls: Start/stop monitoring controls
  - DashboardHeader: Application header

### Shared
- **shared/schema.ts**: Shared TypeScript types and Zod schemas

## Discord Bot Commands

### /setup
Configure your Minecraft server for monitoring
- **Parameters**: 
  - `ip` (required): Server IP address
  - `port` (optional): Server port (default: 25565)
- **Example**: `/setup ip:play.hypixel.net port:25565`

### /ip
Display the configured server IP and port
- **Example**: `/ip`

### /check-server
Check server status
- **Parameters**:
  - `mode` (required): "One-time check" or "Auto-monitor (every 2 minutes)"
- **Example**: `/check-server mode:once`

## Web Dashboard

### Bot Configuration
- Save Discord bot token
- View connection status
- Auto-connect on startup

### Server Setup
- Configure Minecraft server IP and port
- Starts monitoring on save
- Validation for IP and port format

### Monitoring Dashboard
- Real-time server status (Online/Offline)
- Current player count and max players
- Last checked timestamp
- Manual refresh button
- Auto-monitoring controls (2-minute intervals)

## API Endpoints

### Bot Configuration
- `POST /api/bot/config` - Save bot token and start bot
- `GET /api/bot/status` - Get bot connection status

### Server Configuration
- `POST /api/server/config` - Save server configuration
- `GET /api/server/config` - Get current server configuration
- `GET /api/server/status` - Get current server status
- `POST /api/server/check` - Manually trigger server check
- `POST /api/server/monitor` - Start/stop auto-monitoring

## Data Models

### BotConfig
```typescript
{
  token: string
}
```

### ServerConfig
```typescript
{
  guildId: string
  ip: string
  port: string
  autoMonitor: boolean
}
```

### ServerStatus
```typescript
{
  guildId: string
  status: "online" | "offline" | "checking"
  playerCount?: number
  maxPlayers?: number
  lastChecked: Date
  version?: string
  motd?: string
}
```

## Technical Details

### Storage
- Uses in-memory storage (MemStorage class)
- Separate storage for: bot config, server configs, server statuses
- Web dashboard uses special guildId: "web-dashboard"

### Monitoring System
- Separate intervals for each guild/server
- 2-minute interval for auto-monitoring
- Restores monitoring on server restart
- Properly cleans up intervals on config changes

### Frontend State Management
- React Query for server state management
- Auto-refetch intervals for live updates
- Optimistic UI updates with loading states

## Development

### Running the Application
```bash
npm run dev
```
Server runs on port 5000 (both API and frontend)

### Environment Variables
- `PORT`: Server port (default: 5000)
- Bot token is stored via web dashboard (not in env vars)

## Dependencies
- **discord.js**: Discord bot functionality
- **minecraft-server-util**: Minecraft server status checking
- **express**: Backend API server
- **react**: Frontend UI framework
- **@tanstack/react-query**: Server state management
- **zod**: Schema validation
- **drizzle-orm**: Type-safe database toolkit (schemas only)

## Security Notes
- Bot tokens are stored in memory only (not persisted to disk)
- API endpoints validate input using Zod schemas
- Bot token input uses password-style masking
- CORS configured for same-origin only

## Future Enhancements
- Database persistence (PostgreSQL)
- Multiple server monitoring per guild
- Historical status tracking and uptime graphs
- Player list display
- Discord notifications for status changes
- Custom check intervals

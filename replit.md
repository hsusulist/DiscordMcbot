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
- **server/routes.ts**: API routes for web dashboard and settings
- **server/discord-bot.ts**: Discord bot implementation with modular command system
- **server/commands/**: Modular Discord command files
  - **setup.ts**: Server configuration command
  - **ip.ts**: Display server IP command
  - **check-server.ts**: Server status check command
  - **stop-monitoring.ts**: Stop auto-monitoring command
  - **player-list.ts**: Display online players command
  - **server-info.ts**: Detailed server info command
  - **help.ts**: Help and command list
  - **index.ts**: Command registration and exports
- **server/minecraft-checker.ts**: Minecraft server status checking utility
- **server/monitoring-manager.ts**: Auto-monitoring system for periodic checks
- **server/storage.ts**: In-memory storage for bot config, server settings, and website settings

### Frontend (React + TypeScript + Vite)
- **client/src/pages/Dashboard.tsx**: Main dashboard page
- **client/src/pages/Settings.tsx**: Website customization settings page
- **client/src/components/**: Reusable UI components
  - BotConfigCard: Bot token configuration
  - ServerSetupCard: Server IP/port setup
  - ServerStatusCard: Real-time server status display
  - PlayerMonitorCard: Player count, capacity, and online player names
  - MonitoringControls: Start/stop monitoring controls
  - DashboardHeader: Application header with navigation

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
Check server status (one-time or auto-monitor)
- **Parameters**:
  - `mode` (required): "One-time check" or "Auto-monitor (every 2 minutes)"
- **Example**: `/check-server mode:once`
- **Features**: Displays player count, max players, version, and online player names

### /stop-monitoring
Stop auto-monitoring your Minecraft server
- **Example**: `/stop-monitoring`

### /player-list
Show the list of online players
- **Example**: `/player-list`
- **Features**: Shows numbered list of player names currently online

### /server-info
Display detailed server information
- **Example**: `/server-info`
- **Features**: Shows IP, port, status, auto-monitoring state, player count, version, and MOTD

### /help
Show all available commands and how to use them
- **Example**: `/help`

## Web Dashboard

### Pages
- **Dashboard** (`/`): Main monitoring interface
- **Settings** (`/settings`): Website customization

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
- Online player names displayed as badges
- Last checked timestamp
- Manual refresh button
- Auto-monitoring controls (2-minute intervals)

### Website Settings
- Customize primary, accent, success, error, and warning colors
- Customize background, card background, text, and border colors
- Visual color pickers with hex value inputs
- Real-time preview
- Reset to default option
- Theme selection (light/dark/auto)

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

### Website Settings
- `GET /api/settings` - Get website customization settings
- `POST /api/settings` - Save website customization settings

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
  playerNames?: string[]
  lastChecked: Date
  version?: string
  motd?: string
}
```

### WebsiteSettings
```typescript
{
  primaryColor: string
  backgroundColor: string
  cardBackgroundColor: string
  textColor: string
  borderColor: string
  accentColor: string
  successColor: string
  errorColor: string
  warningColor: string
  theme: "light" | "dark" | "auto"
}
```

## Technical Details

### Bot 24/7 Operation
- Bot automatically starts on server startup if configured
- Monitoring intervals are restored on restart
- In-memory storage persists for the server session
- Workflow runs continuously serving both API and frontend

### Storage
- Uses in-memory storage (MemStorage class)
- Separate storage for: bot config, server configs, server statuses, website settings
- Web dashboard uses special guildId: "web-dashboard"

### Monitoring System
- Separate intervals for each guild/server
- 2-minute interval for auto-monitoring
- Restores monitoring on server restart
- Properly cleans up intervals on config changes

### Command Architecture
- Modular command system in `server/commands/`
- Each command in separate file for maintainability
- Commands export `data` (SlashCommandBuilder) and `execute` function
- Centralized command registration via `commands/index.ts`

### Frontend State Management
- React Query for server state management
- Auto-refetch intervals for live updates
- Optimistic UI updates with loading states
- Wouter for client-side routing

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
- **discord.js**: Discord bot functionality with slash commands
- **minecraft-server-util**: Minecraft server status and player list checking
- **express**: Backend API server
- **react**: Frontend UI framework
- **wouter**: Lightweight client-side routing
- **@tanstack/react-query**: Server state management
- **zod**: Schema validation
- **drizzle-orm**: Type-safe database toolkit (schemas only)
- **shadcn/ui**: UI component library with Radix UI primitives
- **lucide-react**: Icon library

## Security Notes
- Bot tokens are stored in memory only (not persisted to disk)
- API endpoints validate input using Zod schemas
- Bot token input uses password-style masking
- CORS configured for same-origin only

## Recent Updates (October 2025)
- ✅ Added player names display in Discord and web dashboard
- ✅ Modular command system with separate command files
- ✅ New Discord commands: /stop-monitoring, /player-list, /server-info, /help
- ✅ Website settings page for color customization
- ✅ Navigation between Dashboard and Settings pages
- ✅ Improved bot 24/7 operation with auto-start

## Future Enhancements
- Database persistence (PostgreSQL) for permanent storage
- Multiple server monitoring per guild
- Historical status tracking and uptime graphs
- Discord notifications for status changes (player join/leave, server offline)
- Custom check intervals (configurable monitoring frequency)
- Dark mode implementation using settings
- Server performance metrics (TPS, lag)

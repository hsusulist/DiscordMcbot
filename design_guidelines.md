# MC-Bot Dashboard Design Guidelines

## Design Approach
**System-Based Approach**: Clean developer dashboard aesthetic inspired by modern DevOps platforms (Vercel, Railway, Railway) prioritizing clarity, instant feedback, and efficient configuration workflows.

**Core Principles**:
- Immediate visual status feedback
- Streamlined configuration flows
- Information hierarchy for monitoring data
- Developer-friendly interface with technical precision

---

## Typography System

**Font Stack**: Google Fonts via CDN
- Primary: 'Inter' - Body text, forms, general UI (400, 500, 600)
- Monospace: 'JetBrains Mono' - IPs, ports, technical data (400, 500)

**Hierarchy**:
- Page Titles: text-3xl font-semibold
- Section Headers: text-xl font-medium
- Card Titles: text-lg font-medium
- Body Text: text-base font-normal
- Labels: text-sm font-medium uppercase tracking-wide
- Technical Data: text-sm font-mono
- Status Text: text-xs font-medium uppercase

---

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-6 or p-8
- Section spacing: space-y-8
- Card gaps: gap-6
- Input spacing: space-y-4
- Button padding: px-6 py-3

**Container Strategy**:
- Dashboard: max-w-7xl mx-auto px-4
- Configuration forms: max-w-2xl mx-auto
- Status cards: Full width within container

---

## Component Library

### Navigation
**Top Bar**: Fixed header with blur backdrop
- Logo/branding (left): "MC-Bot" with small server icon
- Status indicator (right): Connection status pill with pulse animation
- Navigation links: Dashboard, Configuration, Logs (if space)
- Height: h-16
- Backdrop: backdrop-blur-lg

### Configuration Cards
**Bot Token Setup**:
- Card with border and subtle shadow
- Title: "Bot Configuration"
- Input field with label "Discord Bot Token"
- Password-style input with reveal toggle (eye icon - Heroicons)
- Save button (primary CTA): Full width or right-aligned
- Connection status below: small pill with icon + text

**Server Setup**:
- Two-column grid on desktop (md:grid-cols-2), stacked on mobile
- Left: IP Address input (full width)
- Right: Port input (smaller, max-w-xs)
- Both with monospace font for input values
- "Start Monitoring" button below (primary, prominent)
- Validation feedback: inline error states with red accent

### Dashboard Cards
**Server Status Card**:
- Large card with status banner at top
- Online/Offline indicator: Large badge with icon (circle filled/outlined)
- Server details grid (2 columns):
  - IP Address (monospace, copy button)
  - Port (monospace)
  - Status (text badge)
  - Last Checked (timestamp)

**Player Monitoring Card**:
- Header with "Player Count" title and refresh icon button
- Large number display: text-5xl font-bold for player count
- Subtitle: "/ max players" in muted text
- Toggle controls below: "One-time Check" vs "Auto-monitor (2min)"
- Toggle implemented as pill-style segmented control
- Player list (if available): Simple table or list with player names

**Monitoring Controls**:
- Segmented control for check frequency
- Start/Stop monitoring button with loading state
- Manual check button (secondary style)

### Status Indicators
**Status Pills**:
- Rounded-full px-3 py-1
- Online: Green accent with filled circle icon
- Offline: Red accent with outline circle icon
- Checking: Yellow/amber with animated pulse
- Include Heroicons: CheckCircle, XCircle, ClockIcon

**Data Display**:
- Monospace font for all technical values (IPs, ports)
- Copy-to-clipboard buttons next to copyable values
- Icon: DocumentDuplicateIcon (Heroicons)

### Forms
**Input Fields**:
- Label above input (font-medium text-sm)
- Input: border rounded-lg px-4 py-3
- Focus state: ring with accent
- Error state: red border + error message below
- Helper text: text-xs below input when needed

**Buttons**:
- Primary: Solid fill, rounded-lg, px-6 py-3, font-medium
- Secondary: Border style, same padding
- Icon buttons: Rounded-lg p-2, icon only (Heroicons 20px)
- Loading states: Spinner icon (no text change)

### Data Tables (if needed for logs)
- Simple striped rows
- Headers: font-medium text-sm
- Cells: text-sm monospace for data
- Actions column (right): Icon buttons

---

## Icons
**Library**: Heroicons via CDN (outline for most, solid for emphasis)

**Key Icons**:
- Server: ServerIcon
- Status: CheckCircleIcon, XCircleIcon, ClockIcon
- Copy: DocumentDuplicateIcon
- Refresh: ArrowPathIcon
- Settings: Cog6ToothIcon
- Eye toggle: EyeIcon, EyeSlashIcon
- Play/Stop: PlayIcon, StopIcon

---

## Animations
**Minimal & Purposeful**:
- Status pulse: Animate-pulse on checking state only
- Transitions: transition-all duration-200 for hover states
- Loading spinners: animate-spin for loading states
- NO scroll animations, NO page transitions

---

## Page Layouts

### Bot Configuration Page
- Centered card layout (max-w-2xl)
- Single column form
- Progress indicator if multi-step
- Persistent header with app name

### Main Dashboard
- Two-column grid on desktop (lg:grid-cols-2)
- Server Status card (left)
- Player Monitoring card (right)
- Monitoring Controls below (full width)
- Responsive: Stack to single column on mobile

### Responsive Behavior
- Mobile (base): Single column, full-width cards, p-4 spacing
- Tablet (md:): Two columns where appropriate, p-6 spacing
- Desktop (lg:+): Full layout, p-8 spacing, max-width containers

---

## Images
**No decorative images needed**. This is a utility dashboard focused on function. All visual interest comes from:
- Clear typography hierarchy
- Status indicators with meaningful colors
- Clean card layouts
- Purposeful spacing

If any branding is needed, use simple icon or wordmark - no hero images required for this application type.
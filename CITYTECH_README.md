# CityTech KZ — Городские проблемы

A citizen-facing MVP for reporting and tracking local infrastructure issues in Kazakhstan cities, built with React, Tailwind CSS, and Leaflet maps.

## 🎯 Project Overview

CityTech KZ enables Kazakhstan citizens to:
- Report local infrastructure problems (potholes, broken streetlights, water outages, etc.)
- View hyper-local issues specific to their residential complex (ЖК)
- Browse city-wide issues ranked by AI priority algorithm
- Support/upvote issues to increase visibility
- Visualize issue clusters on an interactive map

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **Maps**: Leaflet with OpenStreetMap tiles
- **State Management**: React Context API (Auth, Issues)
- **Routing**: Wouter (lightweight client-side router)

### Project Structure
```
client/
├── src/
│   ├── pages/
│   │   ├── Auth.tsx          # Login/Signup + Profile completion
│   │   ├── Feed.tsx          # Main feed with two-table layout
│   │   └── NotFound.tsx
│   ├── components/
│   │   ├── IssueCard.tsx     # Issue card with priority ring
│   │   ├── CityTechMap.tsx   # Leaflet map with clusters
│   │   └── SubmitIssueModal.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx   # User authentication state
│   │   └── IssuesContext.tsx # Issues + AI priority ranking
│   ├── App.tsx               # Routes & providers
│   └── index.css             # Global styles + Kaspi color palette
├── index.html
└── public/
```

## 🔐 Authentication Flow

### Dual-Mode Auth Screen
1. **Login Mode**: Email + password authentication
2. **Signup Mode**: New user registration
3. **Profile Completion**: After auth, users fill in:
   - Full Name (ФИО)
   - Residential Complex (ЖК)
   - Street (Улица)
   - House Number (Дом)
   - Entrance (Подъезд)

These profile fields are used to:
- Filter "Hyper-Local" issues (Table A)
- Pre-populate issue submission forms
- Enable location-based filtering

**Storage**: User data stored in localStorage (mock implementation)

## 📊 Two-Table Issue Feed Layout

### Table A: Hyper-Local Issues (Left Panel)
- **Filter**: Issues within user's residential complex + street
- **Sorting**: By AI priority score (descending)
- **Display**: Card-based list with priority rings

### Table B: City-Wide Issues (Right Panel - Map)
- **Filter**: All issues in the city
- **Sorting**: By AI priority score (descending)
- **Display**: Interactive Leaflet map with cluster markers

## 🤖 AI-Driven Priority Ranking

The `analyzePriority(issue)` function calculates a composite priority score:

```typescript
function analyzePriority(issue: Issue): number {
  // Category multiplier (severity)
  const categoryMultiplier = {
    critical: 3.0,    // Water/power outages, structural danger
    warning: 1.5,     // Road pits, broken streetlights
    community: 0.5,   // Gardening, painting, beautification
  }[issue.category];

  // Normalize components to 0-100 scale
  const supportScore = Math.min(issue.supportCount * 5, 100);
  const ageScore = Math.min(issue.issueAge * 3, 100);
  const budgetScore = Math.min((issue.budgetCost / 10000) * 2, 100);

  // Weighted average: support (40%), age (30%), budget (30%)
  const baseScore = supportScore * 0.4 + ageScore * 0.3 + budgetScore * 0.3;

  return baseScore * categoryMultiplier;
}
```

**Scoring Factors**:
- **Support Count** (40% weight): Upvotes from other users
- **Issue Age** (30% weight): Days since issue was reported
- **Budget Cost** (30% weight): Government budget required for fix

## 🗺️ Map Component Features

### Cluster Markers
- **Red circles**: Critical issues (water/power outages)
- **Amber circles**: Warning issues (potholes, broken lights)
- **Green circles**: Community issues (beautification, gardening)
- **Number badge**: Count of issues in cluster

### Side Panel
- **Triggered**: Click on any cluster marker
- **Content**: Filtered list of issues in that cluster
- **Categories**: Color-coded by severity
- **Interaction**: Shows issue title, address, support count

### Map Library
- **Leaflet** with OpenStreetMap tiles
- **Geolocation**: Mock coordinates (production: use browser Geolocation API)
- **Clustering Algorithm**: Grid-based proximity grouping (0.05° grid ≈ 5km)

## 🎨 Design System (Kaspi-Inspired Civic Minimalism)

### Color Palette
- **Primary Navy**: `#0A2463` — Authority, trust
- **Electric Blue**: `#1E88E5` — Interactive elements, CTAs
- **White**: `#FFFFFF` — Breathing space, backgrounds
- **Critical Red**: `#EF4444` — Water/power outages
- **Warning Amber**: `#F59E0B` — Road hazards
- **Community Green**: `#22C55E` — Beautification

### Typography
- **Headings**: Manrope (700/800 weight) — Geometric, authoritative
- **Body**: Inter (400/500 weight) — Clean, readable
- **Russian/Kazakh**: Both fonts support Cyrillic rendering

### Components
- **Issue Cards**: Left border stripe in category color
- **Priority Ring**: Circular progress indicator (SVG)
- **Buttons**: Blue gradient, hover scale effect
- **Modal**: Frosted glass effect with backdrop blur

## 🎯 Key Features

### 1. Submit Issue Modal
- **Trigger**: Massive "Подать заявку" button (center, pulsing animation)
- **Form Fields**:
  - Title (required)
  - Description (required)
  - Category dropdown (critical/warning/community)
  - Budget cost estimate (required)
  - Location (pre-filled from user profile)
- **Validation**: All fields required before submission

### 2. Support/Upvote System
- **Toggle**: Click thumbs-up button on issue card
- **State**: Tracks `userSupported` flag per issue
- **Display**: Shows total support count
- **Button Style**: Changes color when user has supported

### 3. Responsive Design
- **Mobile**: Single-column layout (feed above map)
- **Tablet**: 2-column layout (feed left, map right)
- **Desktop**: Sticky map panel, scrollable feed

## 📱 Mobile-First Approach

- **Viewport**: Optimized for 320px+ screens
- **Touch Targets**: 44px minimum for buttons
- **Tabs**: Switch between "Мой ЖК" (Local) and "Город" (City) on mobile
- **Map Height**: Responsive (h-96 mobile, min-h-screen desktop)

## 🚀 Getting Started

### Installation
```bash
cd /home/ubuntu/citytech-kz
pnpm install
pnpm dev
```

### Development
- **Dev Server**: http://localhost:3000
- **Hot Reload**: Enabled via Vite
- **TypeScript**: Type-checked automatically

### Build
```bash
pnpm build
pnpm start
```

## 📝 Mock Data

The app includes 6 mock issues pre-populated in `IssuesContext`:
1. **Pothole on ul. Abaya** (Warning) — 12 supports, 3 days old
2. **Power outage in ЖК Nur-Astana** (Critical) — 28 supports, 2 days old
3. **Playground painting needed** (Community) — 5 supports, 7 days old
4. **Broken streetlight on ul. Panfilova** (Warning) — 8 supports, 5 days old
5. **Water pressure issue** (Critical) — 15 supports, 1 day old
6. **Park greening in ЖК Nur-Astana** (Community) — 3 supports, 10 days old

## 🔄 Data Flow

```
Auth Screen
    ↓
    → Login/Signup → Profile Completion
    ↓
Feed Page
    ├── Left Panel (Tabs)
    │   ├── "Мой ЖК" → Hyper-local issues
    │   └── "Город" → City-wide issues
    ├── Right Panel (Map)
    │   ├── Cluster markers
    │   └── Side panel on cluster click
    └── Action Hub
        └── Submit Issue Modal
            ├── Form submission
            └── Add to issues list
```

## 🔮 Future Enhancements

1. **Backend Integration**: Replace localStorage with API calls
2. **Real Geolocation**: Use browser Geolocation API for user location
3. **Image Upload**: Allow users to attach photos to issues
4. **Comments**: Enable community discussion on issues
5. **Admin Dashboard**: Government officials can mark issues as "In Progress" or "Resolved"
6. **Notifications**: Push notifications when issues are resolved
7. **2GIS API**: Integrate actual 2GIS Maps SDK (currently using Leaflet)
8. **Budget Tracking**: Show government budget allocation per category

## 📄 License

MIT

## 👥 Contact

For questions or feedback, contact the CityTech team.

---

**Last Updated**: April 3, 2026
**Version**: 1.0.0 MVP

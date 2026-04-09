# Homework #4 — Frontend

**GitHub Repository:** https://github.com/Rektoooooo/space-mission-control

## 1. Route List

| Route            | View                                                    |
|------------------|---------------------------------------------------------|
| `/`              | Main dashboard — space scene + missions control panel   |
| `/crew`          | Space scene + crew management panel                     |
| `/missions/:id`  | Space scene + mission detail with lifecycle controls    |

## 2. Single Page Application Diagram

```
┌──────────────────────────────────────────────────────────┐
│                     BrowserRouter                        │
│  ┌────────────────────────────────────────────────────┐  │
│  │                   Dashboard                        │  │
│  │                                                    │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │            SpaceScene (always visible)        │  │  │
│  │  │  ┌──────────┐  ┌───────┐  ┌────────────┐    │  │  │
│  │  │  │ Starfield │  │ Earth │  │ Planet (x6)│    │  │  │
│  │  │  └──────────┘  └───────┘  └────────────┘    │  │  │
│  │  │  ┌──────────────┐                            │  │  │
│  │  │  │ Rocket (x N) │ (animated per mission)     │  │  │
│  │  │  └──────────────┘                            │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  │                                                    │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │        ControlPanel (floating bottom)         │  │  │
│  │  │  ┌────────────────────────────────────────┐  │  │  │
│  │  │  │  Tabs: [ Missions | Crew ]             │  │  │  │
│  │  │  └────────────────────────────────────────┘  │  │  │
│  │  │  ┌────────────────────────────────────────┐  │  │  │
│  │  │  │  <Routes>                              │  │  │  │
│  │  │  │    "/" → MissionsPanel                  │  │  │  │
│  │  │  │    "/crew" → CrewPanel                  │  │  │  │
│  │  │  │    "/missions/:id" → MissionDetail      │  │  │  │
│  │  │  └────────────────────────────────────────┘  │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

## 3. Route Diagrams

### Route: `/` — Missions Dashboard

```
┌─────────────────────────────────────────────┐
│              MissionsPanel                   │
│  ┌────────────────────────────────────────┐  │
│  │ Toolbar: [Filter] [Status] [+New]     │  │
│  └────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────┐  │
│  │ Table                                  │  │
│  │  Name | Destination | Status | Progress│  │
│  │  ─────────────────────────────────────│  │
│  │  Artemis VII | Moon | Planning |      │  │
│  │  Ares Pioneer | Mars | Traveling | ██░│  │
│  │  (click row → /missions/:id)          │  │
│  └────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────┐  │
│  │ MissionForm (Dialog) — create/edit     │  │
│  └────────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### Route: `/crew` — Crew Management

```
┌─────────────────────────────────────────────┐
│                CrewPanel                     │
│  ┌────────────────────────────────────────┐  │
│  │ Toolbar: [Crew count] [+Add Crew]     │  │
│  └────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────┐  │
│  │ Table                                  │  │
│  │  Name | Role | Level | Nation | Mission│  │
│  │  ─────────────────────────────────────│  │
│  │  Elena Vasquez | Commander | Elite |..│  │
│  │  James Chen | Pilot | Veteran |...    │  │
│  └────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────┐  │
│  │ CrewForm (Dialog) — create/edit        │  │
│  └────────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### Route: `/missions/:id` — Mission Detail & Lifecycle

```
┌─────────────────────────────────────────────┐
│              MissionDetail                   │
│  ┌────────────────────────────────────────┐  │
│  │ [← Back] Mission Name [Status] [Abort]│  │
│  └────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────┐  │
│  │ MissionActions (lifecycle controls)    │  │
│  │                                        │  │
│  │  Planning:  [Prepare for Takeoff]      │  │
│  │  Preparing: CountdownTimer (T-10...)   │  │
│  │  Traveling: ProgressBar (██████░░ 65%) │  │
│  │  Exploring: ProgressBar + [Prep Return]│  │
│  │  Returning: ProgressBar (████░░░ 40%) │  │
│  │  Completed: ✓ Mission Complete         │  │
│  └────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────┐  │
│  │ Crew Roster                            │  │
│  │  [Assign dropdown] (Planning only)     │  │
│  │  Name | Role | Experience | [Remove]   │  │
│  └────────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

## 4. Technology

| Component    | Technology                              |
|--------------|-----------------------------------------|
| Framework    | React (Vite)                            |
| Routing      | React Router v7                         |
| Styling      | Tailwind CSS v4                         |
| UI Components| shadcn/ui (Table, Dialog, Tabs, Badge, Select, Input, Button, Tooltip) |
| Animations   | Framer Motion                           |
| Icons        | Lucide React                            |
| State        | React hooks (useState, useEffect, custom hooks) |

## 5. Key Components

| Component          | Purpose                                              |
|--------------------|------------------------------------------------------|
| SpaceScene         | Full-screen space visualization with stars, Earth, planets, rockets |
| Earth              | Centered Earth with phase-dependent glow effects     |
| Planet             | Destination planets with tooltips, scanning effects  |
| Rocket             | Progress-driven animated rocket with JS-driven orbit animation, landing module deploy/retrieve, and thruster flame |
| Starfield          | CSS animated star layers with warp speed mode        |
| ControlPanel       | Floating bottom panel with tab navigation            |
| MissionsPanel      | Mission list with inline progress bars and filters   |
| CrewPanel          | Crew member list with role/level badges              |
| MissionDetail      | Mission lifecycle controls and crew management       |
| MissionActions     | Phase-specific action buttons and progress displays  |
| CountdownTimer     | Animated SVG countdown ring with urgency escalation  |
| MissionProgressBar | Color-coded progress bars for travel/explore phases  |
| MissionForm        | Dialog for creating/editing missions with rocket type selection (3 types with preview) |
| CrewForm           | Dialog for creating/editing crew members             |
| useSounds          | Custom hook for sound effects (beep, launch, complete) |

## 6. Visual & Audio Effects

| Phase          | Visual Effect                                       |
|----------------|-----------------------------------------------------|
| Countdown      | Earth orange glow, warning light strips, screen vibration (last 3s), countdown color escalation |
| Launch         | White flash overlay, screen shake, Earth flash       |
| Traveling      | Warp speed stars, rocket thruster flame with particles |
| Exploring      | Purple scanning ring pulses on destination planet, JS-driven orbit animation, landing module deploy/retrieve |
| Return Launch  | Same flash + shake effects as initial launch         |
| Complete       | Green celebration glow on Earth                      |

| Feature            | Description                                     |
|--------------------|-------------------------------------------------|
| Sound effects      | Beep (countdown), launch rumble, mission complete chime (via useSounds hook) |
| Rocket selection   | 3 rocket types (Falcon 9, Space Shuttle, Saturn V) with image preview in MissionForm |
| Orbit animation    | JS-driven continuous orbit around destination planet during Exploring phase |
| Landing module     | Deploys from rocket to planet surface during Exploring, retrieves during PreparingReturn |

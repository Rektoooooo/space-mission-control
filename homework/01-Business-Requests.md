# Homework #1 — Business Requests

## Application Vision

**Space Mission Control** is a web-based application that allows space enthusiasts to plan, organize, and track fictional space exploration missions. Users can create missions to various celestial destinations (Moon, Mars, Europa, Titan...), assemble crews by assigning members with specialized roles, and monitor the progress of each mission through its lifecycle.

The application is accessible to anyone without registration — serving as an interactive mission planning dashboard where users can manage missions, build crew rosters, and track statuses from planning through to completion.

### Vision Diagram

```
┌─────────────────────────────────────────────────────┐
│                      USER                           │
│               (No login required)                   │
└────────────┬────────────────────┬───────────────────┘
             │                    │
             v                    v
┌────────────────────┐  ┌────────────────────────────┐
│  Mission           │  │  Crew                      │
│  Management        │  │  Management                │
│                    │  │                            │
│  - Create mission  │  │  - Create crew member      │
│  - Edit mission    │  │  - Edit crew member        │
│  - Delete mission  │  │  - Delete crew member      │
│  - Track status    │  │  - View roster             │
└────────┬───────────┘  └──────────┬─────────────────┘
         │                         │
         │    ┌──────────────┐     │
         └───>│  Assignment  │<────┘
              │  (1 : N)     │
              │              │
              │  One Mission │
              │  has many    │
              │  CrewMembers │
              └──────────────┘

Mission Lifecycle:

  [ Planning ] ──> [ Preparing ] ──> [ Traveling ] ──> [ Exploring ]
                        │                  │                │
                        v                  v                v
                    [ Failed ]         [ Failed ]       [ Failed ]
                        │
  [ Exploring ] ──> [ PreparingReturn ] ──> [ Returning ] ──> [ Completed ]
                          │                      │
                          v                      v
                      [ Failed ]             [ Failed ]

  [ Completed ] ──> [ Planning ]   (reset)
  [ Failed ]    ──> [ Planning ]   (reset)
```

## Data Entities

### Mission

| Attribute      | Type   | Description                          |
|----------------|--------|--------------------------------------|
| name           | String | Name of the mission (e.g. "Mars Odyssey") |
| destination    | String | Target destination (Moon, Mars, Europa, Titan, etc.) |
| launchDate     | Date   | Planned launch date                  |
| status         | String | Current status: Planning, Preparing, Traveling, Exploring, PreparingReturn, Returning, Completed, Failed |
| phaseStartedAt | Date   | Timestamp when the current phase began |
| rocketType     | String | Rocket type: falcon9, shuttle, saturnV (user picks per mission) |
| description    | String | Mission objective / description      |

### CrewMember

| Attribute       | Type   | Description                          |
|-----------------|--------|--------------------------------------|
| name            | String | Full name of the crew member         |
| role            | String | Role: Commander, Pilot, Engineer, Scientist, Medic |
| nationality     | String | Country of origin                    |
| experienceLevel | String | Rookie, Veteran, or Elite            |
| missionId       | Ref    | Reference to assigned Mission (FK)   |

### Relationship

- **One Mission** can have **many CrewMembers** (1:N)
- A CrewMember belongs to one Mission (or none if unassigned)

## Core Functional Requirements

### US1 — Manage Missions

> As a user, I want to create, view, edit, and delete space missions so that I can plan new explorations and keep track of existing ones.

- Create a mission with name, destination, launch date, and description
- View a list of all missions
- Edit mission details
- Delete a mission (and unassign its crew)

### US2 — Manage Crew Members

> As a user, I want to create, view, edit, and delete crew members so that I can build a roster of available astronauts for missions.

- Create a crew member with name, role, nationality, and experience level
- View all crew members
- Edit crew member details
- Delete a crew member

### US3 — Assign Crew to Missions

> As a user, I want to assign crew members to a specific mission so that each mission has a defined team for the expedition.

- Assign an existing crew member to a mission
- View which crew members belong to a mission
- Reassign or unassign a crew member from a mission

### US4 — Track Mission Status

> As a user, I want to update and monitor the status of each mission so that I can follow the lifecycle of every space expedition.

- Transition mission status through validated phases via dedicated endpoint (PATCH /api/missions/:id/transition)
- Valid transitions: Planning → Preparing (requires crew), Preparing → Traveling/Failed, Traveling → Exploring/Failed, Exploring → PreparingReturn/Failed, PreparingReturn → Returning/Failed, Returning → Completed/Failed, Completed → Planning, Failed → Planning
- See visual status indicators, countdown timers, progress bars, and phase-specific action buttons
- Filter/sort missions by status or destination

# Homework #2 — Business Model

## 1. Product Diagram (Data Entities)

```
┌──────────────────────────────┐         ┌──────────────────────────────────┐
│          MISSION             │         │          CREW MEMBER             │
│──────────────────────────────│         │──────────────────────────────────│
│  _id        : ObjectId (PK) │         │  _id             : ObjectId (PK)│
│  name       : String [req]  │ 1     N │  name            : String [req] │
│  destination: String [req]  │◄────────│  role            : String [req] │
│  launchDate : Date   [req]  │         │  nationality     : String [req] │
│  status     : String [req]  │         │  experienceLevel : String [req] │
│  description: String [opt]  │         │  missionId       : ObjectId (FK)│
└──────────────────────────────┘         └──────────────────────────────────┘

Relationship: One Mission has many CrewMembers (1:N)
A CrewMember references a Mission via missionId (optional — can be unassigned)
```

## 2. Product Descriptions

### Mission

**Purpose:** Represents a space exploration expedition. Each mission defines a destination, timeline, objective, and tracks its current progress through a lifecycle of statuses.

| Attribute   | Type     | Required | Constraints                                           |
|-------------|----------|----------|-------------------------------------------------------|
| _id         | ObjectId | auto     | Primary key, auto-generated                           |
| name        | String   | yes      | Non-empty, e.g. "Mars Odyssey"                        |
| destination | String   | yes      | E.g. Moon, Mars, Europa, Titan, Venus, Saturn         |
| launchDate  | Date     | yes      | Planned launch date                                   |
| status      | String   | yes      | Enum: `Planning`, `Launched`, `Completed`, `Failed`   |
| description | String   | no       | Free-text mission objective                           |

### CrewMember

**Purpose:** Represents an astronaut who can be assigned to a mission. Each crew member has a specialized role and experience level that determine their function within a mission team.

| Attribute       | Type     | Required | Constraints                                          |
|-----------------|----------|----------|------------------------------------------------------|
| _id             | ObjectId | auto     | Primary key, auto-generated                          |
| name            | String   | yes      | Full name of the crew member                         |
| role            | String   | yes      | Enum: `Commander`, `Pilot`, `Engineer`, `Scientist`, `Medic` |
| nationality     | String   | yes      | Country of origin                                    |
| experienceLevel | String   | yes      | Enum: `Rookie`, `Veteran`, `Elite`                   |
| missionId       | ObjectId | no       | FK → Mission._id (null if unassigned)                |

## 3. Business Use Cases

### UC1 — Manage Missions

| Field          | Description                                                              |
|----------------|--------------------------------------------------------------------------|
| **Actor**      | Anonymous user                                                           |
| **Description**| User manages the full lifecycle of space missions (create, view, edit, delete) |

**Main Flow:**

1. User navigates to the Missions page
2. System displays a list of all missions with name, destination, status, and launch date
3. User clicks "Create Mission"
4. System displays a form with fields: name, destination, launch date, status, description
5. User fills in the required fields and submits
6. System validates the input and creates the mission
7. System redirects to the mission list showing the new mission

**Alternative Flows:**

- **Edit:** User clicks edit on an existing mission → system loads form with current data → user modifies and saves
- **Delete:** User clicks delete → system asks for confirmation → on confirm, mission is deleted and its crew members become unassigned
- **Validation error:** System highlights missing required fields and displays error messages

**Preconditions:** None (no login required)
**Postconditions:** Mission is created / updated / deleted in the database

---

### UC2 — Manage Crew Members

| Field          | Description                                                              |
|----------------|--------------------------------------------------------------------------|
| **Actor**      | Anonymous user                                                           |
| **Description**| User manages the astronaut roster (create, view, edit, delete crew members) |

**Main Flow:**

1. User navigates to the Crew page
2. System displays a list of all crew members with name, role, experience level, and assigned mission
3. User clicks "Add Crew Member"
4. System displays a form with fields: name, role, nationality, experience level
5. User fills in the required fields and submits
6. System validates the input and creates the crew member (initially unassigned)
7. System redirects to the crew list showing the new member

**Alternative Flows:**

- **Edit:** User clicks edit on a crew member → system loads form with current data → user modifies and saves
- **Delete:** User clicks delete → system asks for confirmation → on confirm, crew member is removed
- **Validation error:** System highlights missing required fields and displays error messages

**Preconditions:** None
**Postconditions:** Crew member is created / updated / deleted in the database

---

### UC3 — Assign Crew to Missions

| Field          | Description                                                              |
|----------------|--------------------------------------------------------------------------|
| **Actor**      | Anonymous user                                                           |
| **Description**| User assigns crew members to specific missions to build expedition teams |

**Main Flow:**

1. User opens a mission detail page
2. System displays mission info and a list of currently assigned crew members
3. User clicks "Assign Crew Member"
4. System displays a dropdown/list of available (unassigned) crew members
5. User selects a crew member and confirms
6. System updates the crew member's missionId to reference this mission
7. System refreshes the crew roster for the mission

**Alternative Flows:**

- **Unassign:** User clicks unassign on a crew member → system sets their missionId to null → member returns to the available pool
- **Reassign:** User edits a crew member and changes their assigned mission via the crew member form
- **No available crew:** System displays a message that all crew members are currently assigned

**Preconditions:** At least one mission and one crew member exist
**Postconditions:** Crew member is linked to / unlinked from a mission

---

### UC4 — Track Mission Status

| Field          | Description                                                              |
|----------------|--------------------------------------------------------------------------|
| **Actor**      | Anonymous user                                                           |
| **Description**| User monitors and updates mission statuses through the expedition lifecycle |

**Main Flow:**

1. User navigates to the Missions page
2. System displays all missions with visual status indicators (color-coded badges)
3. User clicks on a mission to view its details
4. User changes the mission status (e.g. Planning → Launched)
5. System validates the status transition and updates the mission
6. System reflects the new status with updated visual indicators

**Alternative Flows:**

- **Filter by status:** User selects a status filter → system shows only missions matching that status
- **Filter by destination:** User selects a destination filter → system shows only missions to that destination
- **Sort:** User sorts missions by launch date, name, or status

**Preconditions:** At least one mission exists
**Postconditions:** Mission status is updated in the database

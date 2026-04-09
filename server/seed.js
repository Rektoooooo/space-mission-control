const Mission = require("./models/Mission");
const CrewMember = require("./models/CrewMember");

const MISSIONS = [
  {
    name: "Artemis VII",
    destination: "Moon",
    launchDate: new Date("2026-06-15"),
    description: "Establish permanent lunar outpost near Shackleton Crater",
  },
  {
    name: "Ares Pioneer",
    destination: "Mars",
    launchDate: new Date("2026-09-22"),
    description: "First crewed Mars landing and soil analysis mission",
  },
  {
    name: "Aphrodite Survey",
    destination: "Venus",
    launchDate: new Date("2026-08-10"),
    description: "Atmospheric research above the Venusian cloud layer",
  },
  {
    name: "Europa Deep Dive",
    destination: "Europa",
    launchDate: new Date("2027-01-05"),
    description: "Search for subsurface ocean life beneath the ice crust",
  },
  {
    name: "Titan Frontier",
    destination: "Titan",
    launchDate: new Date("2027-03-18"),
    description: "Study methane lakes and deploy autonomous surface rovers",
  },
  {
    name: "Kronos Ring Run",
    destination: "Saturn",
    launchDate: new Date("2027-06-01"),
    description: "Close orbital survey of Saturn's ring composition",
  },
];

const CREW_MEMBERS = [
  // Pre-assigned (missionIndex references MISSIONS array)
  { name: "Elena Vasquez", role: "Commander", nationality: "Mexican", experienceLevel: "Elite", missionIndex: 0 },
  { name: "James Chen", role: "Pilot", nationality: "American", experienceLevel: "Veteran", missionIndex: 0 },
  { name: "Aisha Patel", role: "Scientist", nationality: "Indian", experienceLevel: "Veteran", missionIndex: 1 },
  { name: "Bjorn Eriksen", role: "Engineer", nationality: "Norwegian", experienceLevel: "Elite", missionIndex: 1 },
  { name: "Yuki Tanaka", role: "Medic", nationality: "Japanese", experienceLevel: "Veteran", missionIndex: 3 },
  { name: "Kofi Asante", role: "Pilot", nationality: "Ghanaian", experienceLevel: "Elite", missionIndex: 3 },
  // Unassigned
  { name: "Lena Novak", role: "Commander", nationality: "Czech", experienceLevel: "Veteran", missionIndex: null },
  { name: "Marcus Webb", role: "Engineer", nationality: "British", experienceLevel: "Rookie", missionIndex: null },
  { name: "Sofia Reyes", role: "Scientist", nationality: "Argentine", experienceLevel: "Elite", missionIndex: null },
  { name: "Dimitri Volkov", role: "Pilot", nationality: "Russian", experienceLevel: "Veteran", missionIndex: null },
  { name: "Amara Osei", role: "Medic", nationality: "Kenyan", experienceLevel: "Rookie", missionIndex: null },
  { name: "Hans Mueller", role: "Engineer", nationality: "German", experienceLevel: "Veteran", missionIndex: null },
];

async function seed() {
  const missionCount = await Mission.countDocuments();
  if (missionCount > 0) return false;

  console.log("Seeding database...");

  const missions = await Mission.insertMany(MISSIONS);

  const crewData = CREW_MEMBERS.map((c) => ({
    name: c.name,
    role: c.role,
    nationality: c.nationality,
    experienceLevel: c.experienceLevel,
    missionId: c.missionIndex !== null ? missions[c.missionIndex]._id : null,
  }));

  await CrewMember.insertMany(crewData);
  console.log(`Seeded ${missions.length} missions and ${crewData.length} crew members`);
  return true;
}

module.exports = seed;

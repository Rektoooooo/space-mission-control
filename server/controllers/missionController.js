const Mission = require("../models/Mission");
const CrewMember = require("../models/CrewMember");

// GET /api/missions
exports.getAll = async (req, res) => {
  try {
    const missions = await Mission.find().sort({ createdAt: -1 });
    res.json(missions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/missions/:id
exports.getById = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission) {
      return res.status(404).json({ error: "Mission not found" });
    }
    res.json(mission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/missions
exports.create = async (req, res) => {
  try {
    const mission = await Mission.create(req.body);
    res.status(201).json(mission);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PUT /api/missions/:id
exports.update = async (req, res) => {
  try {
    const mission = await Mission.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!mission) {
      return res.status(404).json({ error: "Mission not found" });
    }
    res.json(mission);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /api/missions/:id
exports.remove = async (req, res) => {
  try {
    const mission = await Mission.findByIdAndDelete(req.params.id);
    if (!mission) {
      return res.status(404).json({ error: "Mission not found" });
    }
    // Unassign all crew members from the deleted mission
    await CrewMember.updateMany(
      { missionId: req.params.id },
      { missionId: null }
    );
    res.json({ message: "Mission deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PATCH /api/missions/:id/transition
const VALID_TRANSITIONS = {
  Planning: ["Preparing"],
  Preparing: ["Traveling", "Failed"],
  Traveling: ["Exploring", "Failed"],
  Exploring: ["PreparingReturn", "Failed"],
  PreparingReturn: ["Returning", "Failed"],
  Returning: ["Completed", "Failed"],
  Completed: ["Planning"],
  Failed: ["Planning"],
};

exports.transitionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const mission = await Mission.findById(req.params.id);
    if (!mission) {
      return res.status(404).json({ error: "Mission not found" });
    }

    const allowed = VALID_TRANSITIONS[mission.status];
    if (!allowed || !allowed.includes(status)) {
      return res.status(400).json({
        error: `Cannot transition from ${mission.status} to ${status}`,
      });
    }

    // Require crew for Planning → Preparing
    if (mission.status === "Planning" && status === "Preparing") {
      const crewCount = await CrewMember.countDocuments({
        missionId: mission._id,
      });
      if (crewCount === 0) {
        return res
          .status(400)
          .json({ error: "Assign at least one crew member before launch" });
      }
    }

    mission.status = status;
    mission.phaseStartedAt = new Date();
    await mission.save();
    res.json(mission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/missions/:id/crew
exports.getCrew = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission) {
      return res.status(404).json({ error: "Mission not found" });
    }
    const crew = await CrewMember.find({ missionId: req.params.id });
    res.json(crew);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

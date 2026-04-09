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

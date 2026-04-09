const CrewMember = require("../models/CrewMember");

// GET /api/crew-members
exports.getAll = async (req, res) => {
  try {
    const crewMembers = await CrewMember.find()
      .populate("missionId", "name destination")
      .sort({ createdAt: -1 });
    res.json(crewMembers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/crew-members/:id
exports.getById = async (req, res) => {
  try {
    const crewMember = await CrewMember.findById(req.params.id).populate(
      "missionId",
      "name destination"
    );
    if (!crewMember) {
      return res.status(404).json({ error: "Crew member not found" });
    }
    res.json(crewMember);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/crew-members
exports.create = async (req, res) => {
  try {
    const crewMember = await CrewMember.create(req.body);
    res.status(201).json(crewMember);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PUT /api/crew-members/:id
exports.update = async (req, res) => {
  try {
    const crewMember = await CrewMember.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!crewMember) {
      return res.status(404).json({ error: "Crew member not found" });
    }
    res.json(crewMember);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /api/crew-members/:id
exports.remove = async (req, res) => {
  try {
    const crewMember = await CrewMember.findByIdAndDelete(req.params.id);
    if (!crewMember) {
      return res.status(404).json({ error: "Crew member not found" });
    }
    res.json({ message: "Crew member deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

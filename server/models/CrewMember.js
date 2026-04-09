const mongoose = require("mongoose");

const crewMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Crew member name is required"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: ["Commander", "Pilot", "Engineer", "Scientist", "Medic"],
    },
    nationality: {
      type: String,
      required: [true, "Nationality is required"],
      trim: true,
    },
    experienceLevel: {
      type: String,
      required: [true, "Experience level is required"],
      enum: ["Rookie", "Veteran", "Elite"],
    },
    missionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mission",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CrewMember", crewMemberSchema);

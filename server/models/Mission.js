const mongoose = require("mongoose");

const missionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Mission name is required"],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, "Destination is required"],
      trim: true,
    },
    launchDate: {
      type: Date,
      required: [true, "Launch date is required"],
    },
    status: {
      type: String,
      required: true,
      enum: ["Planning", "Launched", "Completed", "Failed"],
      default: "Planning",
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mission", missionSchema);

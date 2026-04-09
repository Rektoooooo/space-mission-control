const express = require("express");
const router = express.Router();
const missionController = require("../controllers/missionController");

router.get("/", missionController.getAll);
router.get("/:id", missionController.getById);
router.post("/", missionController.create);
router.put("/:id", missionController.update);
router.delete("/:id", missionController.remove);
router.patch("/:id/transition", missionController.transitionStatus);
router.get("/:id/crew", missionController.getCrew);

module.exports = router;

const express = require("express");
const router = express.Router();
const crewMemberController = require("../controllers/crewMemberController");

router.get("/", crewMemberController.getAll);
router.get("/:id", crewMemberController.getById);
router.post("/", crewMemberController.create);
router.put("/:id", crewMemberController.update);
router.delete("/:id", crewMemberController.remove);

module.exports = router;

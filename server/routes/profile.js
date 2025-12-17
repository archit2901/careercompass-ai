const express = require("express");
const router = express.Router();

const {
  getProfile,
  createOrUpdateProfile,
  addSkill,
  updateSkill,
  deleteSkill,
  getSkillsSummary,
} = require("../controllers/profileController");

const { protect } = require("../middleware/auth");

// All routes require authentication
router.use(protect);

// Profile routes
router.route("/").get(getProfile).post(createOrUpdateProfile);

// Skills routes
router.route("/skills").post(addSkill);

router.route("/skills/:skillId").put(updateSkill).delete(deleteSkill);

// Summary route (for Claude API integration)
router.get("/summary", getSkillsSummary);

module.exports = router;

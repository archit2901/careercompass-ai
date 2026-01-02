const express = require("express");
const router = express.Router();

const {
  analyzeJob,
  generateInterview,
  generateLearningPath,
  quickSkillCheck,
} = require("../controllers/analysisController");

const { protect } = require("../middleware/auth");

// All routes require authentication
router.use(protect);

// Analysis routes
router.post("/job", analyzeJob);
router.post("/interview", generateInterview);
router.post("/learning-path", generateLearningPath);
router.post("/quick-check", quickSkillCheck);

module.exports = router;

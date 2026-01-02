const SkillProfile = require("../models/SkillProfile");
const claudeService = require("../services/claudeService");

// @desc    Analyze a job description
// @route   POST /api/analysis/job
// @access  Private
const analyzeJob = async (req, res, next) => {
  try {
    const { jobDescription } = req.body;

    if (!jobDescription || jobDescription.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: "Please provide a job description (at least 50 characters)",
      });
    }

    // Get user's skill profile
    const profile = await SkillProfile.findOne({ user: req.user.id });

    const userSkills = profile?.skills || [];
    const userProfile = {
      currentRole: profile?.currentRole || "",
      targetRole: profile?.targetRole || "",
      yearsOfExperience: profile?.yearsOfExperience || 0,
      education: profile?.education || {},
    };

    // Call Claude API for analysis
    const result = await claudeService.analyzeJobDescription(
      jobDescription,
      userSkills,
      userProfile
    );

    res.status(200).json({
      success: true,
      data: result.analysis,
      usage: result.usage,
    });
  } catch (error) {
    console.error("Job analysis error:", error);

    // Handle Claude API specific errors
    if (error.message.includes("API key")) {
      return res.status(500).json({
        success: false,
        message: "AI service configuration error. Please contact support.",
      });
    }

    if (error.message.includes("Rate limit")) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again in a few minutes.",
      });
    }

    next(error);
  }
};

// @desc    Generate interview questions
// @route   POST /api/analysis/interview
// @access  Private
const generateInterview = async (req, res, next) => {
  try {
    const { jobDescription, questionCount = 5 } = req.body;

    if (!jobDescription || jobDescription.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: "Please provide a job description (at least 50 characters)",
      });
    }

    // Limit question count
    const count = Math.min(Math.max(parseInt(questionCount) || 5, 1), 10);

    // Get user's skills
    const profile = await SkillProfile.findOne({ user: req.user.id });
    const userSkills = profile?.skills || [];

    // Call Claude API
    const result = await claudeService.generateInterviewQuestions(
      jobDescription,
      userSkills,
      count
    );

    res.status(200).json({
      success: true,
      data: result.questions,
      usage: result.usage,
    });
  } catch (error) {
    console.error("Interview generation error:", error);
    next(error);
  }
};

// @desc    Generate learning path
// @route   POST /api/analysis/learning-path
// @access  Private
const generateLearningPath = async (req, res, next) => {
  try {
    const { skillGaps, targetRole, timeframe = "3 months" } = req.body;

    if (!skillGaps || !Array.isArray(skillGaps) || skillGaps.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide skill gaps to generate a learning path",
      });
    }

    // Get user's profile for target role if not provided
    let role = targetRole;
    if (!role) {
      const profile = await SkillProfile.findOne({ user: req.user.id });
      role = profile?.targetRole || "Software Developer";
    }

    // Call Claude API
    const result = await claudeService.generateLearningPath(
      skillGaps,
      role,
      timeframe
    );

    res.status(200).json({
      success: true,
      data: result.learningPath,
      usage: result.usage,
    });
  } catch (error) {
    console.error("Learning path generation error:", error);
    next(error);
  }
};

// @desc    Quick skill gap check (lighter weight)
// @route   POST /api/analysis/quick-check
// @access  Private
const quickSkillCheck = async (req, res, next) => {
  try {
    const { jobDescription } = req.body;

    if (!jobDescription) {
      return res.status(400).json({
        success: false,
        message: "Please provide a job description",
      });
    }

    // Get user's skills
    const profile = await SkillProfile.findOne({ user: req.user.id });
    const userSkills = profile?.skills || [];

    if (userSkills.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please add skills to your profile first",
      });
    }

    // Simple analysis using Claude
    const systemPrompt =
      "You are a job matching assistant. Respond with JSON only.";
    const prompt = `Compare these skills: ${userSkills
      .map((s) => s.name)
      .join(", ")}

Against this job: ${jobDescription.substring(0, 500)}

Return JSON: {"matchScore": 0-100, "topMatches": ["skill1"], "topGaps": ["skill1"]}`;

    const result = await claudeService.sendMessage(prompt, systemPrompt, {
      maxTokens: 300,
      temperature: 0.2,
    });

    const analysis = JSON.parse(result.content);

    res.status(200).json({
      success: true,
      data: analysis,
      usage: result.usage,
    });
  } catch (error) {
    console.error("Quick check error:", error);
    next(error);
  }
};

module.exports = {
  analyzeJob,
  generateInterview,
  generateLearningPath,
  quickSkillCheck,
};

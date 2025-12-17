const SkillProfile = require("../models/SkillProfile");

// @desc    Get current user's skill profile
// @route   GET /api/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    let profile = await SkillProfile.findOne({ user: req.user.id });

    // If no profile exists, return empty structure
    if (!profile) {
      return res.status(200).json({
        success: true,
        data: null,
        message: "No profile found. Create one to get started!",
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update skill profile
// @route   POST /api/profile
// @access  Private
const createOrUpdateProfile = async (req, res, next) => {
  try {
    const {
      targetRole,
      careerGoals,
      currentRole,
      yearsOfExperience,
      education,
      industries,
    } = req.body;

    const profileData = {
      user: req.user.id,
      targetRole,
      careerGoals,
      currentRole,
      yearsOfExperience,
      education,
      industries,
    };

    // Find and update, or create new
    let profile = await SkillProfile.findOne({ user: req.user.id });

    if (profile) {
      // Update existing profile
      profile = await SkillProfile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileData },
        { new: true, runValidators: true }
      );

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: profile,
      });
    }

    // Create new profile
    profile = await SkillProfile.create(profileData);

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a skill to profile
// @route   POST /api/profile/skills
// @access  Private
const addSkill = async (req, res, next) => {
  try {
    const { name, proficiency, yearsOfExperience, category } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Skill name is required",
      });
    }

    let profile = await SkillProfile.findOne({ user: req.user.id });

    // Create profile if it doesn't exist
    if (!profile) {
      profile = await SkillProfile.create({
        user: req.user.id,
        skills: [],
      });
    }

    // Check if skill already exists (case-insensitive)
    const skillExists = profile.skills.some(
      (s) => s.name.toLowerCase() === name.toLowerCase()
    );

    if (skillExists) {
      return res.status(400).json({
        success: false,
        message: "This skill already exists in your profile",
      });
    }

    // Add the new skill
    profile.skills.push({
      name: name.trim(),
      proficiency: proficiency || "beginner",
      yearsOfExperience: yearsOfExperience || 0,
      category: category || "other",
    });

    await profile.save();

    res.status(201).json({
      success: true,
      message: "Skill added successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a skill
// @route   PUT /api/profile/skills/:skillId
// @access  Private
const updateSkill = async (req, res, next) => {
  try {
    const { skillId } = req.params;
    const { name, proficiency, yearsOfExperience, category } = req.body;

    const profile = await SkillProfile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // Find the skill
    const skill = profile.skills.id(skillId);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    // Update skill fields
    if (name) skill.name = name.trim();
    if (proficiency) skill.proficiency = proficiency;
    if (yearsOfExperience !== undefined)
      skill.yearsOfExperience = yearsOfExperience;
    if (category) skill.category = category;

    await profile.save();

    res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a skill
// @route   DELETE /api/profile/skills/:skillId
// @access  Private
const deleteSkill = async (req, res, next) => {
  try {
    const { skillId } = req.params;

    const profile = await SkillProfile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // Find and remove the skill
    const skillIndex = profile.skills.findIndex(
      (s) => s._id.toString() === skillId
    );

    if (skillIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    profile.skills.splice(skillIndex, 1);
    await profile.save();

    res.status(200).json({
      success: true,
      message: "Skill removed successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get skills summary (for Claude API)
// @route   GET /api/profile/summary
// @access  Private
const getSkillsSummary = async (req, res, next) => {
  try {
    const profile = await SkillProfile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found. Please create your profile first.",
      });
    }

    const summary = profile.getSkillsSummary();

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  createOrUpdateProfile,
  addSkill,
  updateSkill,
  deleteSkill,
  getSkillsSummary,
};

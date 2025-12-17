const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Skill name is required"],
    trim: true,
    maxlength: [50, "Skill name cannot exceed 50 characters"],
  },
  proficiency: {
    type: String,
    enum: ["beginner", "intermediate", "advanced", "expert"],
    default: "beginner",
  },
  yearsOfExperience: {
    type: Number,
    min: 0,
    max: 50,
    default: 0,
  },
  category: {
    type: String,
    enum: ["technical", "soft", "tools", "languages", "frameworks", "other"],
    default: "other",
  },
});

const SkillProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // One profile per user
  },
  skills: [SkillSchema],
  targetRole: {
    type: String,
    trim: true,
    maxlength: [100, "Target role cannot exceed 100 characters"],
  },
  careerGoals: {
    type: String,
    trim: true,
    maxlength: [1000, "Career goals cannot exceed 1000 characters"],
  },
  currentRole: {
    type: String,
    trim: true,
    maxlength: [100, "Current role cannot exceed 100 characters"],
  },
  yearsOfExperience: {
    type: Number,
    min: 0,
    max: 50,
    default: 0,
  },
  education: {
    degree: {
      type: String,
      trim: true,
      maxlength: [100, "Degree cannot exceed 100 characters"],
    },
    field: {
      type: String,
      trim: true,
      maxlength: [100, "Field cannot exceed 100 characters"],
    },
    institution: {
      type: String,
      trim: true,
      maxlength: [100, "Institution cannot exceed 100 characters"],
    },
    graduationYear: {
      type: Number,
      min: 1950,
      max: 2100,
    },
  },
  industries: [
    {
      type: String,
      trim: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
SkillProfileSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Method to get skills formatted for Claude API
SkillProfileSchema.methods.getSkillsSummary = function () {
  return {
    skills: this.skills.map((s) => ({
      name: s.name,
      level: s.proficiency,
      years: s.yearsOfExperience,
      category: s.category,
    })),
    targetRole: this.targetRole,
    currentRole: this.currentRole,
    totalExperience: this.yearsOfExperience,
    education: this.education,
  };
};

module.exports = mongoose.model("SkillProfile", SkillProfileSchema);

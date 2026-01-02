import api from "./api";

const analysisService = {
  // Analyze a job description
  async analyzeJob(jobDescription) {
    const response = await api.post("/analysis/job", { jobDescription });
    return response.data;
  },

  // Generate interview questions
  async generateInterviewQuestions(jobDescription, questionCount = 5) {
    const response = await api.post("/analysis/interview", {
      jobDescription,
      questionCount,
    });
    return response.data;
  },

  // Generate learning path
  async generateLearningPath(skillGaps, targetRole, timeframe = "3 months") {
    const response = await api.post("/analysis/learning-path", {
      skillGaps,
      targetRole,
      timeframe,
    });
    return response.data;
  },

  // Quick skill check
  async quickSkillCheck(jobDescription) {
    const response = await api.post("/analysis/quick-check", {
      jobDescription,
    });
    return response.data;
  },
};

export default analysisService;

import api from "./api";

const profileService = {
  // Get user's skill profile
  async getProfile() {
    const response = await api.get("/profile");
    return response.data;
  },

  // Create or update profile info
  async updateProfile(profileData) {
    const response = await api.post("/profile", profileData);
    return response.data;
  },

  // Add a new skill
  async addSkill(skillData) {
    const response = await api.post("/profile/skills", skillData);
    return response.data;
  },

  // Update an existing skill
  async updateSkill(skillId, skillData) {
    const response = await api.put(`/profile/skills/${skillId}`, skillData);
    return response.data;
  },

  // Delete a skill
  async deleteSkill(skillId) {
    const response = await api.delete(`/profile/skills/${skillId}`);
    return response.data;
  },

  // Get skills summary (for Claude API)
  async getSkillsSummary() {
    const response = await api.get("/profile/summary");
    return response.data;
  },
};

export default profileService;

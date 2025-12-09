import api from "./api";

const authService = {
  // Register new user
  async register(userData) {
    const response = await api.post("/auth/register", userData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Login user
  async login(credentials) {
    const response = await api.post("/auth/login", credentials);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout user
  async logout() {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      // Even if API call fails, clear local storage
      console.error("Logout API error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  // Get current user
  async getCurrentUser() {
    const response = await api.get("/auth/me");
    return response.data;
  },

  // Update user profile
  async updateProfile(profileData) {
    const response = await api.put("/auth/updateprofile", profileData);
    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Update password
  async updatePassword(passwordData) {
    const response = await api.put("/auth/updatepassword", passwordData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },

  // Get stored token
  getToken() {
    return localStorage.getItem("token");
  },

  // Get stored user
  getStoredUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  },
};

export default authService;

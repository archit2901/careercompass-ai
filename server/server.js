const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "CareerCompass AI API is running!",
    status: "success",
    timestamp: new Date().toISOString(),
  });
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    environment: process.env.NODE_ENV || "development",
  });
});

// Test route to verify environment variables are loaded
app.get("/api/test", (req, res) => {
  res.json({
    message: "Environment variables test",
    port: process.env.PORT || 5000,
    hasMongoUri: !!process.env.MONGODB_URI,
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasClaudeKey: !!process.env.ANTHROPIC_API_KEY,
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `✅ Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
  console.log(`🔗 API available at: http://localhost:${PORT}`);
});

// Keep the process running (prevent clean exit)
process.on("SIGINT", () => {
  console.log("\n👋 Shutting down gracefully...");
  process.exit(0);
});

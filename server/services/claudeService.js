const Anthropic = require("@anthropic-ai/sdk");

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Default model to use
const DEFAULT_MODEL = "claude-sonnet-4-20250514";

/**
 * Send a message to Claude and get a response
 * @param {string} prompt - The user prompt
 * @param {string} systemPrompt - Optional system prompt
 * @param {object} options - Additional options (maxTokens, temperature)
 */
const sendMessage = async (prompt, systemPrompt = "", options = {}) => {
  const { maxTokens = 1024, temperature = 0.7 } = options;

  try {
    const messageParams = {
      model: DEFAULT_MODEL,
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    };

    // Add system prompt if provided
    if (systemPrompt) {
      messageParams.system = systemPrompt;
    }

    // Add temperature if not default
    if (temperature !== 1) {
      messageParams.temperature = temperature;
    }

    const response = await anthropic.messages.create(messageParams);

    return {
      success: true,
      content: response.content[0].text,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
      model: response.model,
    };
  } catch (error) {
    console.error("Claude API Error:", error);

    // Handle specific error types
    if (error.status === 401) {
      throw new Error("Invalid API key. Please check your ANTHROPIC_API_KEY.");
    }
    if (error.status === 429) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }
    if (error.status === 500) {
      throw new Error(
        "Claude API is temporarily unavailable. Please try again."
      );
    }

    throw new Error(error.message || "Failed to communicate with Claude API");
  }
};

/**
 * Analyze a job description against user skills
 */
const analyzeJobDescription = async (
  jobDescription,
  userSkills,
  userProfile
) => {
  const systemPrompt = `You are an expert career advisor and job market analyst. Your task is to analyze job descriptions and provide actionable insights. Always respond with valid JSON only, no additional text.`;

  const skillsList = userSkills
    .map((s) => `${s.name} (${s.proficiency}, ${s.yearsOfExperience} years)`)
    .join(", ");

  const prompt = `Analyze this job description against the candidate's profile.

## Job Description:
${jobDescription}

## Candidate's Current Skills:
${skillsList || "No skills listed yet"}

## Candidate's Profile:
- Current Role: ${userProfile.currentRole || "Not specified"}
- Target Role: ${userProfile.targetRole || "Not specified"}
- Years of Experience: ${userProfile.yearsOfExperience || 0}
- Education: ${userProfile.education?.degree || "Not specified"} in ${
    userProfile.education?.field || "Not specified"
  }

## Task:
Provide a comprehensive analysis in the following JSON format:
{
  "jobTitle": "extracted job title",
  "company": "company name if mentioned",
  "matchScore": 75,
  "requiredSkills": [
    {"name": "skill name", "importance": "required|preferred|nice-to-have", "candidateHas": true}
  ],
  "skillGaps": [
    {"name": "missing skill", "importance": "required|preferred", "difficulty": "easy|medium|hard", "timeToLearn": "2-4 weeks"}
  ],
  "strengths": ["strength 1", "strength 2"],
  "recommendations": [
    {"priority": "high|medium|low", "action": "specific actionable recommendation"}
  ],
  "salaryInsight": "brief salary range insight if determinable",
  "overallAssessment": "2-3 sentence summary of candidacy"
}

Respond with valid JSON only.`;

  const response = await sendMessage(prompt, systemPrompt, {
    maxTokens: 2048,
    temperature: 0.3, // Lower temperature for more consistent JSON
  });

  // Parse the JSON response
  try {
    const analysis = JSON.parse(response.content);
    return {
      success: true,
      analysis,
      usage: response.usage,
    };
  } catch (parseError) {
    // Try to extract JSON from the response
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);
      return {
        success: true,
        analysis,
        usage: response.usage,
      };
    }
    throw new Error("Failed to parse job analysis response");
  }
};

/**
 * Generate interview questions based on job and user profile
 */
const generateInterviewQuestions = async (
  jobDescription,
  userSkills,
  questionCount = 5
) => {
  const systemPrompt = `You are an expert interview coach. Generate relevant, thoughtful interview questions. Always respond with valid JSON only.`;

  const skillsList = userSkills.map((s) => s.name).join(", ");

  const prompt = `Generate ${questionCount} interview questions for this role.

## Job Description:
${jobDescription}

## Candidate's Skills:
${skillsList || "General candidate"}

Generate questions in this JSON format:
{
  "questions": [
    {
      "question": "the interview question",
      "type": "behavioral|technical|situational",
      "difficulty": "easy|medium|hard",
      "tip": "brief tip for answering well",
      "skillsTested": ["skill1", "skill2"]
    }
  ]
}

Include a mix of behavioral, technical, and situational questions. Respond with valid JSON only.`;

  const response = await sendMessage(prompt, systemPrompt, {
    maxTokens: 1500,
    temperature: 0.5,
  });

  try {
    const result = JSON.parse(response.content);
    return {
      success: true,
      questions: result.questions,
      usage: response.usage,
    };
  } catch (parseError) {
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return {
        success: true,
        questions: result.questions,
        usage: response.usage,
      };
    }
    throw new Error("Failed to parse interview questions response");
  }
};

/**
 * Generate learning path recommendations
 */
const generateLearningPath = async (
  skillGaps,
  targetRole,
  timeframe = "3 months"
) => {
  const systemPrompt = `You are an expert career development advisor. Create actionable learning paths. Always respond with valid JSON only.`;

  const gapsList = skillGaps.map((g) => g.name).join(", ");

  const prompt = `Create a learning path to acquire these skills for the target role.

## Skills to Learn:
${gapsList}

## Target Role:
${targetRole}

## Timeframe:
${timeframe}

Generate a learning path in this JSON format:
{
  "totalWeeks": 12,
  "phases": [
    {
      "name": "Phase 1: Foundations",
      "weeks": "1-4",
      "skills": ["skill1"],
      "resources": [
        {"type": "course|book|project|tutorial", "name": "resource name", "url": "optional url", "duration": "10 hours", "cost": "free|paid"}
      ],
      "milestone": "what you'll achieve"
    }
  ],
  "dailyCommitment": "1-2 hours",
  "tips": ["tip 1", "tip 2"]
}

Respond with valid JSON only.`;

  const response = await sendMessage(prompt, systemPrompt, {
    maxTokens: 2000,
    temperature: 0.4,
  });

  try {
    const result = JSON.parse(response.content);
    return {
      success: true,
      learningPath: result,
      usage: response.usage,
    };
  } catch (parseError) {
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return {
        success: true,
        learningPath: result,
        usage: response.usage,
      };
    }
    throw new Error("Failed to parse learning path response");
  }
};

module.exports = {
  sendMessage,
  analyzeJobDescription,
  generateInterviewQuestions,
  generateLearningPath,
};

const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// ✅ Initialize Gemini with your API key
const genAI = new GoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ✅ POST route for chatbot
router.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // System prompt (AI role and instructions)
    const systemPrompt = `
You are the official assistant for the Career AI website, a comprehensive career development platform.

# ABOUT CAREER AI:
Career AI helps users discover, plan, and achieve their career goals through AI-powered tools and personalized guidance.

## Key Features:
- Career Assessment: AI-powered aptitude test with personalized recommendations
- Learning Pathways: Curated roadmaps for different careers
- Comparison Tool: Compare different career options
- Resources Library: Collection of learning materials and courses
- Career Roadmap: Visualize and plan your progression
- Dashboard: Track your progress, saved content, and achievements

## NAVIGATION COMMANDS:
Respond with the appropriate JSON if the user asks to navigate:
- Home page → { "navigation": "/" }
- About page → { "navigation": "/about" }
- Learning Pathways → { "navigation": "/pathways" }
- Resources → { "navigation": "/resources" }
- Comparison Tool → { "navigation": "/comparison-tool-page" }
- Career Roadmap → { "navigation": "/roadmap" }
- Career Test → { "navigation": "/career-test" }
- My Dashboard → { "navigation": "/my-dashboard" }

## RESPONSE RULES:
1. Only answer questions about Career AI or career guidance.
2. For unrelated questions, reply with:
   { "answer": "I specialize in career guidance and the Career AI platform. How can I help you with your career development?" }
3. Always return **valid JSON** in one of these formats:
   - { "answer": "Your helpful response here" }
   - { "navigation": "/path" }
`;

    // ✅ Proper format for v0.24.1
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: `${systemPrompt}\n\nUser: ${message}` }
          ],
        },
      ],
    });

    // ✅ Extract model response
    const text = result.response.text();
    const cleaned = text.replace(/```json|```/g, "").trim();

    // ✅ Ensure JSON-safe output
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { answer: cleaned };
    }

    res.json(parsed);
  } catch (error) {
    console.error("Gemini Chatbot Error:", error);
    res.status(500).json({
      error:
        "I'm experiencing technical difficulties. Please try again shortly.",
    });
  }
});

module.exports = router;

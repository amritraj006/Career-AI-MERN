const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

router.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are the official assistant for the Career AI website, a comprehensive career development platform.

# ABOUT CAREER AI:
Career AI is an innovative platform designed to help users discover, plan, and achieve their career goals through AI-powered tools and personalized guidance.

## Key Features:
- Career Assessment: AI-powered career aptitude test with personalized recommendations
- Learning Pathways: Curated learning roadmaps for different careers
- Comparison Tool: Compare different career options side-by-side
- Resources Library: Extensive collection of learning materials and courses
- Career Roadmap: Visualize your career progression and set milestones
- Personal Dashboard: Track your progress, saved content, and achievements

## NAVIGATION COMMANDS:
If the user asks to navigate to any of these pages, respond with the appropriate JSON navigation object:
- Home page: { "navigation": "/" }
- About page: { "navigation": "/about" }
- Learning Pathways: { "navigation": "/pathways" }
- Resources: { "navigation": "/resources" }
- Comparison Tool: { "navigation": "/comparison-tool-page" }
- Career Roadmap: { "navigation": "/roadmap" }
- Career Test: { "navigation": "/career-test" }
- My Dashboard: { "navigation": "/my-dashboard" }

## RULES FOR RESPONDING:
1. Answer questions about Career AI's features, services, and how it works
2. Provide career guidance and advice related to the platform's capabilities
3. If the user asks to navigate to a page, respond with the appropriate navigation JSON object
4. If the user asks something completely unrelated to careers or the website, respond:
{ "answer": "I specialize in career guidance and the Career AI platform. How can I help you with your career development?" }

## RESPONSE FORMAT:
Always respond with valid JSON only using this format:
{ "answer": "Your helpful response here" }
OR if navigation is requested:
{ "navigation": "/path-to-page" }
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `${prompt}\n\n${message}` }] }],
    });

    const text = result.response.text();
    const cleaned = text.replace(/```json|```/g, "").trim();

    res.json(JSON.parse(cleaned));
  } catch (error) {
    console.error("Gemini Chatbot Error:", error);
    res.status(500).json({
      error: "I'm experiencing technical difficulties. Please try again shortly.",
    });
  }
});

module.exports = router;

const { GoogleGenerativeAI } = require('@google/generative-ai');
const Roadmap = require('../models/Roadmap');

// Initialize Gemini — called once per request so key changes take effect
const initGenAI = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenerativeAI(key);
};

exports.generateRoadmap = async (req, res) => {
  try {
    const { email, prompt } = req.body;

    if (!email || !prompt) {
      return res.status(400).json({ success: false, message: 'Email and prompt are required.' });
    }

    const genAI = initGenAI();
    if (!genAI) {
      return res.status(500).json({ success: false, message: 'GEMINI_API_KEY is not configured on the server.' });
    }

    // --- Gemini API call ---
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const fullPrompt = `You are an expert career counselor and senior developer.
The user will provide a career goal. Create a highly detailed, step-by-step career roadmap in Markdown format.
Use headers (##, ###), bullet points, and code blocks where appropriate.
Structure it logically into phases (Phase 1, Phase 2, etc.) with practical, actionable advice.

User Goal: ${prompt}`;

    let result;
    try {
      result = await model.generateContent(fullPrompt);
    } catch (geminiError) {
      console.error('Gemini API error:', geminiError?.message || geminiError);
      const status = geminiError?.status || 502;
      return res.status(status).json({
        success: false,
        message: `AI engine error: ${geminiError?.message || 'Unknown Gemini error'}`,
      });
    }

    // Guard: ensure we actually got text back
    const textOutput = result?.response?.text?.();
    if (!textOutput) {
      console.error('Gemini returned an empty response:', result);
      return res.status(502).json({ success: false, message: 'AI engine returned an empty response. Please try again.' });
    }

    // --- Persist to MongoDB ---
    const newRoadmap = new Roadmap({ user_email: email, prompt, roadmap: textOutput });
    await newRoadmap.save();

    return res.status(200).json({ success: true, roadmap: textOutput, id: newRoadmap._id });

  } catch (error) {
    console.error('Unexpected error in generateRoadmap:', error?.message || error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Unexpected server error while generating roadmap.',
    });
  }
};

exports.getRoadmapHistory = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const history = await Roadmap.find({ user_email: email }).sort({ created_at: -1 });

    res.status(200).json({ success: true, history });
  } catch (error) {
    console.error('Error in getRoadmapHistory:', error);
    res.status(500).json({ success: false, message: 'Server error fetching roadmap history' });
  }
};

exports.deleteRoadmapHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRoadmap = await Roadmap.findByIdAndDelete(id);

    if (!deletedRoadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found' });
    }

    res.status(200).json({ success: true, message: 'Roadmap deleted successfully' });
  } catch (error) {
    console.error('Error in deleteRoadmapHistory:', error);
    res.status(500).json({ success: false, message: 'Server error deleting roadmap' });
  }
};

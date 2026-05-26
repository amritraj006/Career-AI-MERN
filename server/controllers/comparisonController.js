const { generateGeminiContent } = require('../utils/geminiFetch');

const cleanText = (value, fallback = '') =>
  String(value || fallback)
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 500);

const toNumber = (value, fallback = null) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toStringList = (value, limit = 8) => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => cleanText(item))
    .filter(Boolean)
    .slice(0, limit);
};

const extractJson = (text) => {
  const cleaned = String(text || '')
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) {
      throw error;
    }

    return JSON.parse(cleaned.slice(start, end + 1));
  }
};

const normalizeCareer = (career) => ({
  title: cleanText(career.title, 'Career').slice(0, 90),
  salaryUSD: toNumber(career.salaryUSD),
  salary: cleanText(career.salaryLabel || career.salary),
  growthRate: toNumber(career.growthRate),
  growth: cleanText(career.growth),
  education: cleanText(career.education),
  workLife: cleanText(career.workLife),
  timeToEntryMonths: toNumber(career.timeToEntryMonths),
  remoteScore: toNumber(career.remoteScore),
  stabilityScore: toNumber(career.stabilityScore),
  fitScore: toNumber(career.fitScore),
  skills: toStringList(career.skills),
  bestFor: cleanText(career.bestFor),
  tradeoffs: toStringList(career.tradeoffs, 4),
});

const normalizeInsights = (parsed, careers) => {
  const careerTitles = new Set(careers.map((career) => career.title));
  const recommendedCareer = careerTitles.has(parsed.recommendedCareer)
    ? parsed.recommendedCareer
    : careers[0]?.title || '';

  return {
    recommendedCareer,
    verdict: cleanText(parsed.verdict).slice(0, 700),
    bestFitReason: cleanText(parsed.bestFitReason).slice(0, 500),
    careerNotes: Array.isArray(parsed.careerNotes)
      ? parsed.careerNotes.slice(0, 4).map((note) => ({
          title: careerTitles.has(note?.title) ? note.title : cleanText(note?.title),
          upside: cleanText(note?.upside).slice(0, 260),
          caution: cleanText(note?.caution).slice(0, 260),
          firstMove: cleanText(note?.firstMove).slice(0, 260),
        }))
      : [],
    skillGaps: toStringList(parsed.skillGaps, 6),
    nextSteps: toStringList(parsed.nextSteps, 6),
    questionsToAsk: toStringList(parsed.questionsToAsk, 5),
  };
};

exports.generateComparisonInsights = async (req, res) => {
  try {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const careers = Array.isArray(body.careers) ? body.careers.slice(0, 4).map(normalizeCareer) : [];

    if (careers.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Select at least two careers before asking for AI insights.',
      });
    }

    const preferences = {
      salary: toNumber(body.preferences?.salary, 3),
      growth: toNumber(body.preferences?.growth, 3),
      balance: toNumber(body.preferences?.balance, 3),
      entry: toNumber(body.preferences?.entry, 3),
      remote: toNumber(body.preferences?.remote, 3),
      stability: toNumber(body.preferences?.stability, 3),
    };

    const profile = cleanText(body.profile, 'No personal background was provided.').slice(0, 900);

    const prompt = `You are a practical career coach helping a learner choose between career paths.
Use the user's stated priorities and the supplied career comparison data. Be specific, honest, and action-oriented.
Do not claim access to live labor-market data. Do not invent salary numbers beyond the provided data.

User profile and interests:
${profile}

Priority weights from 1 to 5:
${JSON.stringify(preferences, null, 2)}

Career options:
${JSON.stringify(careers, null, 2)}

Return ONLY valid JSON in this exact shape:
{
  "recommendedCareer": "One exact title from the career options",
  "verdict": "A concise 2-3 sentence recommendation",
  "bestFitReason": "Why this recommendation fits the user and priorities",
  "careerNotes": [
    {
      "title": "Exact career title",
      "upside": "Best upside of this path",
      "caution": "Main tradeoff or risk",
      "firstMove": "One concrete first action"
    }
  ],
  "skillGaps": ["skill gap 1", "skill gap 2", "skill gap 3"],
  "nextSteps": ["step 1", "step 2", "step 3"],
  "questionsToAsk": ["question 1", "question 2", "question 3"]
}`;

    let textOutput;
    try {
      textOutput = await generateGeminiContent(prompt);
    } catch (geminiError) {
      console.error('Gemini API error (comparison insights):', geminiError?.message || geminiError);
      return res.status(geminiError.status || 502).json({
        success: false,
        message: `AI engine error: ${geminiError?.message || 'Could not generate comparison insights'}`,
      });
    }

    let insights;
    try {
      insights = normalizeInsights(extractJson(textOutput), careers);
    } catch (parseError) {
      console.error('Failed to parse comparison insights:', parseError?.message);
      return res.status(502).json({
        success: false,
        message: 'Failed to parse AI comparison insights. Please try again.',
      });
    }

    return res.status(200).json({ success: true, insights });
  } catch (error) {
    console.error('Error in generateComparisonInsights:', error?.message || error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Server error generating comparison insights.',
    });
  }
};

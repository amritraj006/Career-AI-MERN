const Assessment = require('../models/Assessment');
const { generateGeminiContent } = require('../utils/geminiFetch');
const { parseAssessmentQuestionsJson } = require('../utils/parseAssessmentQuestions');

const DOMAIN_LABELS = {
  webdev: 'Web Development',
  datascience: 'Data Science',
  cybersecurity: 'Cybersecurity',
  cloud: 'Cloud Computing',
  blockchain: 'Blockchain',
  ai: 'Artificial Intelligence',
  mobile: 'Mobile Development',
  devops: 'DevOps',
};

exports.generateAssessmentQuestions = async (req, res) => {
  try {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const { domain, domainName, difficulty = 'Medium', questionCount = 10 } = body;

    if (!domain) {
      return res.status(400).json({ success: false, message: 'Domain is required.' });
    }

    const label = domainName || DOMAIN_LABELS[domain] || domain;
    const count = Math.min(Math.max(Number(questionCount) || 10, 5), 12);

    const prompt = `You are an expert career skills assessor.
Create exactly ${count} multiple-choice questions to evaluate readiness in the career domain: "${label}".
Difficulty level: ${difficulty}.

Return ONLY valid JSON (no markdown):
{
  "questions": [
    {
      "question": "Clear scenario or knowledge question",
      "options": [
        { "text": "Weakest / least accurate answer", "score": 1 },
        { "text": "Below average answer", "score": 2 },
        { "text": "Good answer", "score": 3 },
        { "text": "Best expert-level answer", "score": 4 }
      ]
    }
  ]
}

Rules:
- Exactly ${count} questions, each with exactly 4 options
- Each option must have "text" and "score" (integer 1-4 only)
- Questions must be unique, practical, and domain-specific
- Mix difficulty from foundational to advanced
- Use realistic job scenarios where appropriate`;

    let textOutput;
    try {
      textOutput = await generateGeminiContent(prompt);
    } catch (geminiError) {
      console.error('Gemini API error (assessment questions):', geminiError?.message);
      return res.status(geminiError.status || 502).json({
        success: false,
        message: `AI engine error: ${geminiError.message || 'Could not generate questions'}`,
      });
    }

    let questions;
    try {
      questions = parseAssessmentQuestionsJson(textOutput);
    } catch (parseError) {
      console.error('Failed to parse assessment questions:', parseError?.message);
      return res.status(502).json({
        success: false,
        message: 'Failed to parse AI questions. Please try again.',
      });
    }

    return res.status(200).json({ success: true, questions, domain, domainName: label });
  } catch (error) {
    console.error('Error in generateAssessmentQuestions:', error?.message || error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Server error generating assessment questions.',
    });
  }
};

exports.evaluateAssessment = async (req, res) => {
  try {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const { domain, domainName, percentage, level, responses } = body;

    const pct = Number(percentage);
    if (!domain || Number.isNaN(pct)) {
      return res.status(400).json({
        success: false,
        message: 'Domain and a valid percentage are required.',
      });
    }

    const label = domainName || DOMAIN_LABELS[domain] || domain;
    const summary = (responses || [])
      .slice(0, 12)
      .map(
        (r, i) =>
          `Q${i + 1}: ${r.question}\nUser chose (score ${r.score}/4): ${r.selectedText}`
      )
      .join('\n\n');

    const prompt = `You are a supportive career coach. A student completed a ${label} skills quiz.
Score: ${pct}% (${level || 'beginner'} level).

Their answers:
${summary}

Return ONLY JSON:
{
  "recommendation": "2-3 sentence personalized summary",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "areas_for_improvement": ["area 1", "area 2", "area 3"],
  "next_steps": ["actionable step 1", "step 2", "step 3"]
}

Be specific to their answer patterns. Encouraging but honest.`;

    let textOutput;
    try {
      textOutput = await generateGeminiContent(prompt);
    } catch (geminiError) {
      return res.status(geminiError.status || 502).json({
        success: false,
        message: geminiError.message || 'Could not analyze results',
      });
    }

    const cleaned = textOutput.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return res.status(200).json({
      success: true,
      insights: {
        recommendation: parsed.recommendation || '',
        strengths: parsed.strengths || [],
        areas_for_improvement: parsed.areas_for_improvement || [],
        next_steps: parsed.next_steps || [],
      },
    });
  } catch (error) {
    console.error('Error in evaluateAssessment:', error?.message);
    return res.status(500).json({ success: false, message: 'Failed to analyze assessment results.' });
  }
};

exports.saveAssessment = async (req, res) => {
  try {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const {
      email,
      domain,
      level,
      percentage,
      totalScore,
      maxPossibleScore,
      recommendation,
      strengths,
      areas_for_improvement,
      next_steps,
    } = body;

    if (!email || !domain) {
      return res.status(400).json({ success: false, message: 'Email and domain are required' });
    }

    const filter = { email };
    const update = {
      domain,
      level,
      percentage,
      totalScore,
      maxPossibleScore,
      recommendation,
      strengths,
      areas_for_improvement,
      next_steps,
    };

    const assessment = await Assessment.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true,
    });

    res.status(200).json({ success: true, assessment });
  } catch (error) {
    console.error('Error in saveAssessment:', error);
    res.status(500).json({ success: false, message: 'Server error saving assessment' });
  }
};

exports.getAssessment = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const assessment = await Assessment.findOne({ email });

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    res.status(200).json({ success: true, assessment });
  } catch (error) {
    console.error('Error in getAssessment:', error);
    res.status(500).json({ success: false, message: 'Server error fetching assessment' });
  }
};

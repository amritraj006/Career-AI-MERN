const InterviewPrep = require('../models/InterviewPrep');
const { generateGeminiContent } = require('../utils/geminiFetch');

const parseQuestionsJson = (text) => {
  const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
  const parsed = JSON.parse(cleaned);
  if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
    throw new Error('Invalid questions format');
  }
  return parsed.questions.map((q) => ({
    question: String(q.question || '').trim(),
    answer: String(q.answer || '').trim(),
    tip: q.tip ? String(q.tip).trim() : undefined,
  }));
};

const buildPrompt = ({
  role,
  company,
  questionType,
  difficulty,
  experienceLevel,
  count,
  existingQuestions = [],
}) => {
  const companyLine = company ? `Target company: "${company}".` : '';
  const avoidLine =
    existingQuestions.length > 0
      ? `\nDo NOT repeat these existing questions:\n${existingQuestions.map((q, i) => `${i + 1}. ${q.question}`).join('\n')}`
      : '';

  return `You are an expert interview coach.
Generate exactly ${count} ${questionType} interview questions with sample answers for:
- Role: "${role}"
- Experience: ${experienceLevel}
- Difficulty: ${difficulty}
${companyLine}

Return ONLY valid JSON (no markdown):
{
  "questions": [
    { "question": "...", "answer": "...", "tip": "one short answering tip" }
  ]
}

Requirements:
- Questions must be realistic and role-specific
- Progress from foundational to challenging
- Answers: 3-5 actionable sentences
- For Behavioral questions, tips should mention STAR (Situation, Task, Action, Result)
- Each "tip" is one sentence of coaching advice${avoidLine}`;
};

const formatSession = (doc) => ({
  id: doc._id,
  role: doc.role,
  company: doc.company || '',
  question_type: doc.question_type,
  difficulty: doc.difficulty,
  experience_level: doc.experience_level,
  questions: doc.questions,
  created_at: doc.created_at,
});

exports.generateInterviewQuestions = async (req, res) => {
  try {
    const body = req.body || {};
    const {
      email,
      role,
      questionType,
      company = '',
      difficulty = 'Medium',
      experienceLevel = 'Mid-level',
      questionCount = 10,
    } = body;

    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Request body is missing. Send JSON with Content-Type: application/json.',
      });
    }

    if (!email || !role || !questionType) {
      return res.status(400).json({
        success: false,
        message: 'Email, role, and question type are required.',
      });
    }

    const count = Math.min(Math.max(Number(questionCount) || 10, 5), 15);

    let textOutput;
    try {
      textOutput = await generateGeminiContent(
        buildPrompt({ role, company, questionType, difficulty, experienceLevel, count })
      );
    } catch (geminiError) {
      console.error('Gemini API error:', geminiError?.message || geminiError);
      return res.status(geminiError.status || 502).json({
        success: false,
        message: `AI engine error: ${geminiError.message || 'Unknown Gemini error'}`,
      });
    }

    let questions;
    try {
      questions = parseQuestionsJson(textOutput);
    } catch (parseError) {
      console.error('Failed to parse interview JSON:', parseError?.message);
      return res.status(502).json({
        success: false,
        message: 'Failed to parse AI response. Please try again.',
      });
    }

    const session = new InterviewPrep({
      user_email: email,
      role,
      company,
      question_type: questionType,
      difficulty,
      experience_level: experienceLevel,
      questions,
    });
    await session.save();

    return res.status(200).json({ success: true, session: formatSession(session) });
  } catch (error) {
    console.error('Unexpected error in generateInterviewQuestions:', error?.message || error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Unexpected server error while generating questions.',
    });
  }
};

exports.generateMoreQuestions = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Request body is missing. Send JSON with Content-Type: application/json.',
      });
    }
    const { email, sessionId, count = 3 } = req.body;

    if (!email || !sessionId) {
      return res.status(400).json({ success: false, message: 'Email and sessionId are required.' });
    }

    const session = await InterviewPrep.findOne({ _id: sessionId, user_email: email });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    const addCount = Math.min(Math.max(Number(count) || 3, 1), 5);

    let textOutput;
    try {
      textOutput = await generateGeminiContent(
        buildPrompt({
          role: session.role,
          company: session.company,
          questionType: session.question_type,
          difficulty: session.difficulty,
          experienceLevel: session.experience_level,
          count: addCount,
          existingQuestions: session.questions,
        })
      );
    } catch (geminiError) {
      return res.status(geminiError.status || 502).json({
        success: false,
        message: `AI engine error: ${geminiError.message}`,
      });
    }

    const newQuestions = parseQuestionsJson(textOutput);
    session.questions.push(...newQuestions);
    await session.save();

    return res.status(200).json({
      success: true,
      session: formatSession(session),
      added: newQuestions.length,
    });
  } catch (error) {
    console.error('Error in generateMoreQuestions:', error?.message || error);
    return res.status(500).json({ success: false, message: 'Server error generating more questions.' });
  }
};

exports.getInterviewHistory = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const history = await InterviewPrep.find({ user_email: email })
      .sort({ created_at: -1 })
      .select('role company question_type difficulty experience_level created_at questions');

    res.status(200).json({
      success: true,
      history: history.map((h) => ({
        id: h._id,
        role: h.role,
        company: h.company,
        question_type: h.question_type,
        difficulty: h.difficulty,
        experience_level: h.experience_level,
        question_count: h.questions.length,
        created_at: h.created_at,
      })),
    });
  } catch (error) {
    console.error('Error in getInterviewHistory:', error);
    res.status(500).json({ success: false, message: 'Server error fetching interview history' });
  }
};

exports.getInterviewSession = async (req, res) => {
  try {
    const { email } = req.query;
    const { id } = req.params;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const session = await InterviewPrep.findOne({ _id: id, user_email: email });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    res.status(200).json({ success: true, session: formatSession(session) });
  } catch (error) {
    console.error('Error in getInterviewSession:', error);
    res.status(500).json({ success: false, message: 'Server error fetching session' });
  }
};

exports.deleteInterviewHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await InterviewPrep.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    res.status(200).json({ success: true, message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Error in deleteInterviewHistory:', error);
    res.status(500).json({ success: false, message: 'Server error deleting session' });
  }
};

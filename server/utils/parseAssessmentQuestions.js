const validateQuestions = (questions) => {
  if (!Array.isArray(questions) || questions.length < 8) {
    throw new Error('Expected at least 8 questions');
  }

  return questions.slice(0, 10).map((q, i) => {
    if (!q.question || !Array.isArray(q.options) || q.options.length !== 4) {
      throw new Error(`Invalid question structure at index ${i}`);
    }

    const options = q.options.map((opt, oi) => {
      const score = Number(opt.score);
      if (!opt.text || ![1, 2, 3, 4].includes(score)) {
        throw new Error(`Invalid option at question ${i + 1}, option ${oi + 1}`);
      }
      return { text: String(opt.text).trim(), score };
    });

    return { question: String(q.question).trim(), options };
  });
};

const parseAssessmentQuestionsJson = (text) => {
  const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
  const parsed = JSON.parse(cleaned);
  const list = parsed.questions || parsed;
  return validateQuestions(list);
};

module.exports = { parseAssessmentQuestionsJson };

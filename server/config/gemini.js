/** Primary model — override with GEMINI_MODEL in server/.env */
const primary = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';

/** Tried in order when primary hits 404 or quota (429). */
const fallbacks = [
  'gemini-2.5-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-2.5-flash',
];

const modelChain = [...new Set([primary, ...fallbacks])];

module.exports = { primary, modelChain };

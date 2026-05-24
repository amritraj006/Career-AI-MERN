const { modelChain } = require('../config/gemini');

const isQuotaError = (status, message = '') =>
  status === 429 || /quota|rate.?limit|resource exhausted/i.test(message);

const parseRetrySeconds = (message = '') => {
  const match = message.match(/retry in (\d+(?:\.\d+)?)s/i);
  return match ? Math.ceil(parseFloat(match[1])) : null;
};

const friendlyError = (status, rawMessage, lastModel) => {
  if (isQuotaError(status, rawMessage)) {
    const wait = parseRetrySeconds(rawMessage);
    const hint =
      'Your gemini-2.0-flash free quota may be exhausted. Default is now gemini-2.5-flash-lite.';
    if (wait) {
      return `AI rate limit reached. Wait about ${wait} seconds and try again. ${hint}`;
    }
    return `AI rate limit reached for all available models. Try again later or add billing in Google AI Studio. ${hint}`;
  }
  if (status === 404) {
    return `${rawMessage} Set GEMINI_MODEL=gemini-2.5-flash-lite in server/.env`;
  }
  return rawMessage || `Gemini API error (${status}) on ${lastModel}`;
};

async function callModel(apiKey, model, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data?.error?.message || `Gemini API error (${response.status})`;
    const err = new Error(message);
    err.status = response.status;
    err.retryable = isQuotaError(response.status, message) || response.status === 404;
    return { ok: false, error: err };
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    const err = new Error('AI engine returned an empty response. Please try again.');
    err.status = 502;
    err.retryable = false;
    return { ok: false, error: err };
  }

  return { ok: true, text, model };
}

/**
 * Call Gemini REST API with automatic model fallback on quota / not-found errors.
 */
async function generateGeminiContent(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const err = new Error('GEMINI_API_KEY is not configured on the server.');
    err.status = 500;
    throw err;
  }

  let lastError = null;
  let lastModel = modelChain[0];

  for (const model of modelChain) {
    lastModel = model;
    const result = await callModel(apiKey, model, prompt);

    if (result.ok) {
      if (model !== modelChain[0]) {
        console.log(`Gemini: used fallback model "${model}"`);
      }
      return result.text;
    }

    lastError = result.error;
    if (result.error.retryable) {
      console.warn(`Gemini model "${model}" unavailable: ${result.error.message.split('\n')[0]}`);
      continue;
    }
    break;
  }

  const err = new Error(friendlyError(lastError?.status, lastError?.message, lastModel));
  err.status = isQuotaError(lastError?.status, lastError?.message) ? 429 : lastError?.status || 502;
  throw err;
}

module.exports = { generateGeminiContent };

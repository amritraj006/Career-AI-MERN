import axios from 'axios';

const url = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: url,
  timeout: 60000, // 60s — Gemini AI calls can take 15-30s
});

export const apiService = {
  getEnrolledCourses: async (userEmail) => {
    const res = await api.post('/api/course/enrolled-ids', { userEmail });
    return res.data;
  },

  getStats: async () => {
    const res = await api.get('/api/stats');
    return res.data;
  },

  sendComparisonImage: async (formData) => {
    const res = await api.post('/api/send-comparison-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // Roadmap endpoints
  generateRoadmap: async (email, prompt, signal) => {
    const res = await api.post('/api/roadmap', { email, prompt }, { signal });
    return res.data;
  },

  getRoadmapHistory: async (email) => {
    const res = await api.get('/api/roadmap/history', { params: { email } });
    return res.data;
  },

  deleteRoadmapHistory: async (id) => {
    const res = await api.delete(`/api/roadmap/history/${id}`);
    return res.data;
  },

  // Assessment endpoints
  generateAssessmentQuestions: async ({ domain, domainName, difficulty, questionCount }) => {
    const res = await api.post('/api/assessment/generate-questions', {
      domain,
      domainName,
      difficulty,
      questionCount,
    });
    return res.data;
  },

  evaluateAssessment: async (payload) => {
    const res = await api.post('/api/assessment/evaluate', payload);
    return res.data;
  },

  saveAssessment: async (assessmentData) => {
    const res = await api.post('/api/assessment', assessmentData);
    return res.data;
  },

  getAssessment: async (email) => {
    const res = await api.get('/api/assessment', { params: { email } });
    return res.data;
  },

  getAssessmentHistory: async (email) => {
    const res = await api.get('/api/assessment/history', { params: { email } });
    return res.data;
  },

  deleteAssessmentHistory: async (id) => {
    const res = await api.delete(`/api/assessment/history/${id}`);
    return res.data;
  },

  // Interview prep endpoints
  generateInterviewQuestions: async (payload) => {
    const res = await api.post('/api/interview/generate', payload);
    return res.data;
  },

  generateMoreInterviewQuestions: async (email, sessionId, count = 3) => {
    const res = await api.post('/api/interview/generate-more', { email, sessionId, count });
    return res.data;
  },

  getInterviewHistory: async (email) => {
    const res = await api.get('/api/interview/history', { params: { email } });
    return res.data;
  },

  getInterviewSession: async (email, sessionId) => {
    const res = await api.get(`/api/interview/session/${sessionId}`, { params: { email } });
    return res.data;
  },

  deleteInterviewHistory: async (id) => {
    const res = await api.delete(`/api/interview/history/${id}`);
    return res.data;
  },
};

export default apiService;

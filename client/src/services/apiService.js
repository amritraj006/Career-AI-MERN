import axios from 'axios';

const url = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: url,
  timeout: 10000,
});

export const apiService = {
  getEnrolledCourses: async (userEmail) => {
    const res = await api.post('/api/course/enrolled-ids', { userEmail });
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
};

export default apiService;

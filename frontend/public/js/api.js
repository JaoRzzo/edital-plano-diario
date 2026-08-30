// API Base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Cliente HTTP
const api = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login.html';
        }
        const error = await response.json();
        throw new Error(error.error || 'Erro na requisição');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  },

  // Auth
  auth: {
    register: (name, email, password) =>
      api.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      }),
    login: (email, password) =>
      api.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    getProfile: () => api.request('/auth/profile'),
  },

  // Exams
  exams: {
    create: (data) => api.request('/exams', { method: 'POST', body: JSON.stringify(data) }),
    list: () => api.request('/exams'),
    get: (examId) => api.request(`/exams/${examId}`),
    update: (examId, data) => api.request(`/exams/${examId}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (examId) => api.request(`/exams/${examId}`, { method: 'DELETE' }),
  },

  // Subjects
  subjects: {
    create: (examId, data) => api.request(`/exams/${examId}/subjects`, { method: 'POST', body: JSON.stringify(data) }),
    list: (examId) => api.request(`/exams/${examId}/subjects`),
    update: (examId, subjectId, data) => api.request(`/exams/${examId}/subjects/${subjectId}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (examId, subjectId) => api.request(`/exams/${examId}/subjects/${subjectId}`, { method: 'DELETE' }),
  },

  // Topics
  topics: {
    create: (examId, subjectId, data) => api.request(`/exams/${examId}/subjects/${subjectId}/topics`, { method: 'POST', body: JSON.stringify(data) }),
    list: (examId, subjectId) => api.request(`/exams/${examId}/subjects/${subjectId}/topics`),
    update: (examId, subjectId, topicId, data) => api.request(`/exams/${examId}/subjects/${subjectId}/topics/${topicId}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (examId, subjectId, topicId) => api.request(`/exams/${examId}/subjects/${subjectId}/topics/${topicId}`, { method: 'DELETE' }),
  },

  // Study Plans
  studyPlans: {
    create: (examId, data) => api.request(`/exams/${examId}/study-plans`, { method: 'POST', body: JSON.stringify(data) }),
    get: (examId) => api.request(`/exams/${examId}/study-plans`),
  },

  // Tasks
  tasks: {
    generate: (examId) => api.request(`/exams/${examId}/tasks/generate`, { method: 'POST' }),
    today: () => api.request('/exams/today/tasks/today'),
    list: (examId) => api.request(`/exams/${examId}/tasks`),
    complete: (examId, taskId, timeSpent) => api.request(`/exams/${examId}/tasks/${taskId}/complete`, { method: 'POST', body: JSON.stringify({ time_spent_minutes: timeSpent }) }),
    skip: (examId, taskId) => api.request(`/exams/${examId}/tasks/${taskId}/skip`, { method: 'POST' }),
  },

  // Questions & Analytics
  questions: {
    createSession: (examId, data) => api.request(`/exams/${examId}/questions`, { method: 'POST', body: JSON.stringify(data) }),
    getSubjectEvolution: (examId, subjectId) => api.request(`/exams/${examId}/questions/analytics/subjects/${subjectId}`),
    getStats: (examId) => api.request(`/exams/${examId}/questions/analytics/stats`),
    getTasksStats: (examId) => api.request(`/exams/${examId}/questions/analytics/tasks`),
  },
};

module.exports = api;

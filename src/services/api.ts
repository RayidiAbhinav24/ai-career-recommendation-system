import type {
  User,
  StudentProfile,
  Assessment,
  AssessmentAnswers,
  CareerRecommendation,
  Career,
  LearningRoadmap,
  SavedCareer,
  AdminStats,
  AdminAuditLog
} from '../types/index.ts';

const TOKEN_KEY = 'careerai_token';

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY)
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = authStorage.getToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  register: (payload: { name: string; email: string; password: string; confirmPassword: string }) =>
    request<{ user: User; token: string; message: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  login: (payload: { email: string; password: string }) =>
    request<{ user: User; token: string; message: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getMe: () =>
    request<{ user: User }>('/api/auth/me'),

  logout: () =>
    request<{ message: string }>('/api/auth/logout', { method: 'POST' }),

  forgotPassword: (email: string) =>
    request<{ message: string; demoCode?: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    }),

  resetPassword: (payload: { email: string; code: string; newPassword: string }) =>
    request<{ message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  // Profile
  getProfile: () =>
    request<{ profile: StudentProfile | null }>('/api/profile'),

  updateProfile: (profile: Partial<StudentProfile>) =>
    request<{ profile: StudentProfile }>('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(profile)
    }),

  // Assessments
  submitAssessment: (answers: AssessmentAnswers) =>
    request<{ assessment: Assessment }>('/api/assessments', {
      method: 'POST',
      body: JSON.stringify({ answers })
    }),

  getAssessments: () =>
    request<{ assessments: Assessment[] }>('/api/assessments'),

  getAssessmentById: (id: string) =>
    request<{ assessment: Assessment }>(`/api/assessments/${id}`),

  // Recommendations
  generateRecommendations: (payload: { answers?: AssessmentAnswers; assessmentId?: string }) =>
    request<{ recommendations: CareerRecommendation[]; message: string }>('/api/recommendations/generate', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getRecommendations: () =>
    request<{ recommendations: CareerRecommendation[] }>('/api/recommendations'),

  getRecommendationById: (id: string) =>
    request<{ recommendation: CareerRecommendation }>(`/api/recommendations/${id}`),

  // Careers Directory
  getCareers: (params?: { search?: string; category?: string }) => {
    const q = new URLSearchParams();
    if (params?.search) q.set('search', params.search);
    if (params?.category) q.set('category', params.category);
    return request<{ careers: Career[] }>(`/api/careers${q.toString() ? '?' + q.toString() : ''}`);
  },

  getCareerById: (id: string) =>
    request<{ career: Career }>(`/api/careers/${id}`),

  getSavedCareers: () =>
    request<{ savedCareers: SavedCareer[] }>('/api/saved-careers'),

  saveCareer: (careerId: string) =>
    request<{ saved: SavedCareer; message: string }>(`/api/careers/${careerId}/save`, {
      method: 'POST'
    }),

  removeSavedCareer: (careerId: string) =>
    request<{ success: boolean; message: string }>(`/api/careers/${careerId}/save`, {
      method: 'DELETE'
    }),

  // Roadmaps
  getRoadmaps: () =>
    request<{ roadmaps: LearningRoadmap[] }>('/api/roadmaps'),

  getRoadmapById: (id: string) =>
    request<{ roadmap: LearningRoadmap }>(`/api/roadmaps/${id}`),

  updateMilestoneProgress: (roadmapId: string, milestoneId: string, completed: boolean) =>
    request<{ roadmap: LearningRoadmap }>(`/api/roadmaps/${roadmapId}/progress`, {
      method: 'PUT',
      body: JSON.stringify({ milestoneId, completed })
    }),

  // Admin
  getAdminStats: () =>
    request<{ stats: AdminStats }>('/api/admin/stats'),

  getAdminCareers: () =>
    request<{ careers: Career[] }>('/api/admin/careers'),

  createAdminCareer: (career: Partial<Career>) =>
    request<{ career: Career }>('/api/admin/careers', {
      method: 'POST',
      body: JSON.stringify(career)
    }),

  updateAdminCareer: (id: string, career: Partial<Career>) =>
    request<{ career: Career }>(`/api/admin/careers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(career)
    }),

  deleteAdminCareer: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/admin/careers/${id}`, {
      method: 'DELETE'
    }),

  getAdminAuditLogs: () =>
    request<{ auditLogs: AdminAuditLog[] }>('/api/admin/audit-logs')
};

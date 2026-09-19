/**
 * KRUSHIDRISHTI AI — API Client Service
 * Developed by Sopan Pandit Gavali
 */

import { AnalysisRecordData, UserProfile, CropInfo, DiseaseInfo } from './types.js';

const TOKEN_KEY = 'kdr_auth_token';
const USER_KEY = 'kdr_auth_user';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): UserProfile | null {
  const user = localStorage.getItem(USER_KEY);
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

export function setStoredAuth(token: string, user: UserProfile) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function request(endpoint: string, options: RequestInit = {}) {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Server request failed');
  }
  return data;
}

export const api = {
  // Auth
  async login(email: string, password: string) {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setStoredAuth(res.token, res.user);
    return res.user as UserProfile;
  },

  async register(data: { email: string; password: string; full_name: string; role?: string; organization?: string; phone?: string }) {
    const res = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setStoredAuth(res.token, res.user);
    return res.user as UserProfile;
  },

  async logout() {
    try {
      await request('/api/auth/logout', { method: 'POST' });
    } finally {
      clearStoredAuth();
    }
  },

  async getMe() {
    const res = await request('/api/auth/me');
    return res.user as UserProfile;
  },

  // Analysis
  async predict(imageData: string, mimeType: string = 'image/jpeg', crop?: string) {
    return await request('/api/analysis/predict', {
      method: 'POST',
      body: JSON.stringify({ image: imageData, mimeType, crop }),
    });
  },

  async getHistory(): Promise<{ history: AnalysisRecordData[] }> {
    return await request('/api/analysis/history');
  },

  async getAnalysis(id: string): Promise<{ data: AnalysisRecordData }> {
    return await request(`/api/analysis/${id}`);
  },

  async deleteAnalysis(id: string) {
    return await request(`/api/analysis/${id}`, { method: 'DELETE' });
  },

  // Knowledge
  async getCrops(): Promise<{ crops: CropInfo[] }> {
    return await request('/api/plants');
  },

  async getCropDetails(id: string): Promise<{ crop: CropInfo; diseases: DiseaseInfo[] }> {
    return await request(`/api/plants/${id}`);
  },

  async getDiseases(): Promise<{ diseases: DiseaseInfo[] }> {
    return await request('/api/diseases');
  },

  async getDiseaseDetails(id: string): Promise<{ disease: DiseaseInfo }> {
    return await request(`/api/diseases/${id}`);
  },

  // Feedback
  async submitFeedback(data: {
    analysis_id: string;
    helpful_status: 'Correct' | 'Incorrect' | 'Not Sure';
    issue_type?: string;
    comment?: string;
  }) {
    return await request('/api/feedback', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Expert
  async getExpertCases(): Promise<{ cases: AnalysisRecordData[] }> {
    return await request('/api/expert/reviews');
  },

  async submitExpertReview(data: {
    analysis_id: string;
    comment: string;
    corrected_plant?: string;
    corrected_disease?: string;
    corrected_severity?: string;
  }) {
    return await request('/api/expert/review', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Admin
  async getAdminAnalytics() {
    return await request('/api/admin/analytics');
  },

  async getAdminUsers() {
    return await request('/api/admin/users');
  },

  async getAdminModels() {
    return await request('/api/admin/models');
  },

  async updateModelThresholds(id: string, plantThreshold: number, diseaseThreshold: number) {
    return await request(`/api/admin/models/${id}/thresholds`, {
      method: 'PUT',
      body: JSON.stringify({ plant_threshold: plantThreshold, disease_threshold: diseaseThreshold }),
    });
  },

  async getAdminAuditLogs() {
    return await request('/api/admin/audit-logs');
  },

  async getAdminSystemLogs() {
    return await request('/api/admin/system-logs');
  },
};

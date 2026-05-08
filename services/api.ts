// API Service Layer - Ready for Backend Integration
// This file provides a centralized API service that can be connected to any backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          data: null,
          error: data.message || "An error occurred",
          status: response.status,
        };
      }

      return { data, error: null, status: response.status };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Network error",
        status: 0,
      };
    }
  }

  // Authentication
  async login(email: string, password: string, role: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, role }),
    });
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    role: string;
    college?: string;
  }) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request("/auth/logout", { method: "POST" });
  }

  // Notes
  async getNotes(filters?: { subject?: string; semester?: string }) {
    const params = new URLSearchParams(filters as Record<string, string>);
    return this.request(`/notes?${params}`);
  }

  async uploadNote(formData: FormData) {
    return this.request("/notes", {
      method: "POST",
      body: formData,
      headers: {}, // Let browser set content-type for FormData
    });
  }

  async downloadNote(noteId: string) {
    return this.request(`/notes/${noteId}/download`);
  }

  // Assignments
  async getAssignments(filters?: { status?: string; subject?: string }) {
    const params = new URLSearchParams(filters as Record<string, string>);
    return this.request(`/assignments?${params}`);
  }

  async submitAssignment(assignmentId: string, formData: FormData) {
    return this.request(`/assignments/${assignmentId}/submit`, {
      method: "POST",
      body: formData,
      headers: {},
    });
  }

  async getSubmissions(assignmentId: string) {
    return this.request(`/assignments/${assignmentId}/submissions`);
  }

  // Attendance
  async getAttendance(filters?: { date?: string; subject?: string }) {
    const params = new URLSearchParams(filters as Record<string, string>);
    return this.request(`/attendance?${params}`);
  }

  async markAttendance(data: { studentIds: string[]; date: string; subject: string }) {
    return this.request("/attendance", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Discussions
  async getDiscussions(filters?: { topic?: string }) {
    const params = new URLSearchParams(filters as Record<string, string>);
    return this.request(`/discussions?${params}`);
  }

  async createDiscussion(data: { title: string; content: string; topic: string }) {
    return this.request("/discussions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async replyToDiscussion(discussionId: string, content: string) {
    return this.request(`/discussions/${discussionId}/reply`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });
  }

  // Announcements
  async getAnnouncements() {
    return this.request("/announcements");
  }

  async createAnnouncement(data: { title: string; content: string; priority: string }) {
    return this.request("/announcements", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Analytics
  async getStudentProgress(studentId?: string) {
    const endpoint = studentId ? `/analytics/student/${studentId}` : "/analytics/student";
    return this.request(endpoint);
  }

  async getClassAnalytics(classId: string) {
    return this.request(`/analytics/class/${classId}`);
  }

  // AI Features
  async askDoubtAssistant(question: string, context?: string) {
    return this.request("/ai/doubt", {
      method: "POST",
      body: JSON.stringify({ question, context }),
    });
  }

  async summarizeNotes(noteId: string, language?: string) {
    return this.request("/ai/summarize", {
      method: "POST",
      body: JSON.stringify({ noteId, language }),
    });
  }

  async translateContent(content: string, targetLanguage: string) {
    return this.request("/ai/translate", {
      method: "POST",
      body: JSON.stringify({ content, targetLanguage }),
    });
  }

  // Offline Sync
  async syncOfflineData(data: unknown[]) {
    return this.request("/sync", {
      method: "POST",
      body: JSON.stringify({ items: data }),
    });
  }

  // User Profile
  async updateProfile(updates: Record<string, unknown>) {
    return this.request("/user/profile", {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  }

  async uploadAvatar(formData: FormData) {
    return this.request("/user/avatar", {
      method: "POST",
      body: formData,
      headers: {},
    });
  }
}

export const api = new ApiService(API_BASE_URL);
export default api;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  specialization?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  specialization?: string;
  totalSessions: number;
  createdAt: string;
  updatedAt?: string;
}

export interface UserProfile {
  user: User;
  stats: UserStats;
}

export interface UserStats {
  totalSessions: number;
  totalMinutes: number;
  averageSessionLength: number;
  empathyScore: number;
  clarityScore: number;
  toneScore: number;
  professionalismScore: number;
  recentSessions: Session[];
  weeklyProgress: WeeklyProgress[];
}

export interface WeeklyProgress {
  week: string;
  empathyScore: number;
  clarityScore: number;
  toneScore: number;
  professionalismScore: number;
  totalScore: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  specialization?: string;
}
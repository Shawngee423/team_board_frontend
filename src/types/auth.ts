export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: number;
    name: string;
    jobTitle?: string;
    city?: string;
    country?: string;
    phoneNumber?: string;
    website?: string;
    profileUrl?: string;
  } | null;
  loading: boolean;
  error: string | null;
}

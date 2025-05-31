export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string
  password: string
  confirmPassword: string
  name: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
  }
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  user: User;
}

export interface User {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  username: string;
}

export interface AuthResponse {
  token: string;
  user_id: number;
  user: User;
}

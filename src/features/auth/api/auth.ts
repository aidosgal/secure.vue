import type { LoginRequest, RegisterRequest, AuthResponse } from "../model/types";

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.statusText}`);
  }

  const data: AuthResponse = await response.json();
  return data;
}

export async function register(credentials: RegisterRequest): Promise<AuthResponse> {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error(`Registration failed: ${response.statusText}`);
  }

  const data: AuthResponse = await response.json();
  return data;
}


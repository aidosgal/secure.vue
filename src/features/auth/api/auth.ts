import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "../model/types";

// Custom error class to handle API errors with response data
export class ApiError extends Error {
  public response: any;
  public status: number;
  public data: any;

  constructor(message: string, status: number, data: any, response: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.response = response;
  }
}

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api-token-auth/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    // Create a structured error that includes response data
    const error = new ApiError(
      data.detail || `Login failed: ${response.statusText}`,
      response.status,
      data,
      { status: response.status, data },
    );
    throw error;
  }

  return data as AuthResponse;
}

export async function register(
  credentials: RegisterRequest,
): Promise<AuthResponse> {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/secure-storage/user/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = new ApiError(
      data.detail || `Registration failed: ${response.statusText}`,
      response.status,
      data,
      { status: response.status, data },
    );
    throw error;
  }

  return data as AuthResponse;
}

export async function verifyOtp(
  email: string,
  otp: string,
  token?: string,
): Promise<AuthResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add authorization header if token is provided
  if (token) {
    headers.Authorization = `Token ${token}`;
  } else {
    // Fallback to localStorage token
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      headers.Authorization = `Token ${storedToken}`;
    }
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/verify-otp/`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        email,
        otp,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = new ApiError(
      data.detail || `OTP verification failed: ${response.statusText}`,
      response.status,
      data,
      { status: response.status, data },
    );
    throw error;
  }

  return data as AuthResponse;
}

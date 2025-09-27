// frontend/fetchs/auth.ts
import { API_URL } from "./config";

// --- API専用型定義 ---
export type LoginInput = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: {
    id: number;
    username: string;
    name: string;
    email: string;
    avatar_url: string;
  };
};

export type VerifyTokenResponse = {
  valid: boolean;
  user?: {
    id: number;
    username: string;
    name: string;
    email: string;
    avatar_url: string;
  };
};

export type LogoutResponse = true;

// --- fetch functions ---

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const res = await fetch(`${API_URL}/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password } satisfies LoginInput),
  });

  if (!res.ok) {
    throw new Error(`Login failed: ${res.status}`);
  }

  return res.json();
};

export const verifyToken = async (token: string): Promise<VerifyTokenResponse> => {
  const res = await fetch(`${API_URL}/v1/auth/verify?token=${token}`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error(`Token verify failed: ${res.status}`);
  }

  return res.json();
};

export const logout = async (token: string): Promise<LogoutResponse> => {
  const res = await fetch(`${API_URL}/v1/auth/logout?token=${token}`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error(`Logout failed: ${res.status}`);
  }

  return true;
};

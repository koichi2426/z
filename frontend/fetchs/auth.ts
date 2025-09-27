// frontend/fetchs/auth.ts
import { API_URL } from "./config";

export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error(`Login failed: ${res.status}`);
  }

  return res.json();
};

export const verifyToken = async (token: string) => {
  const res = await fetch(`${API_URL}/v1/auth/verify?token=${token}`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error(`Token verify failed: ${res.status}`);
  }

  return res.json();
};

export const logout = async (token: string) => {
  const res = await fetch(`${API_URL}/v1/auth/logout?token=${token}`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error(`Logout failed: ${res.status}`);
  }

  return true;
};

// frontend/fetchs/users.ts
import { API_URL } from "./config";

// API 専用の型定義（バックエンドの JSON スキーマに合わせる）
export type ApiUser = {
  id: number;
  username: string;
  name: string;
  email: string;
  avatar_url: string;
};

export type CreateUserInput = {
  username: string;
  name: string;
  email: string;
  password: string;
  avatar_url?: string;
};

export type UpdateUserInput = {
  id: number;
  username: string;
  name: string;
  email: string;
  password?: string;
  avatar_url?: string;
};

// --- fetch functions ---
export const fetchAllUsers = async (): Promise<ApiUser[]> => {
  const res = await fetch(`${API_URL}/v1/users`);
  if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);
  return res.json();
};

export const createUser = async (user: CreateUserInput): Promise<ApiUser> => {
  const res = await fetch(`${API_URL}/v1/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error(`Failed to create user: ${res.status}`);
  return res.json();
};

export const updateUser = async (user: UpdateUserInput): Promise<ApiUser> => {
  const res = await fetch(`${API_URL}/v1/users`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error(`Failed to update user: ${res.status}`);
  return res.json();
};

export const deleteUser = async (userId: number): Promise<boolean> => {
  const res = await fetch(`${API_URL}/v1/users/${userId}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to delete user: ${res.status}`);
  return true;
};

export const deleteAllUsers = async (): Promise<boolean> => {
  const res = await fetch(`${API_URL}/v1/users`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to delete all users: ${res.status}`);
  return true;
};

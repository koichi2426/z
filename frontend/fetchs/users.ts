// frontend/fetchs/users.ts
import { API_URL } from "./config";
import type { User } from "@/lib/data";

export const fetchAllUsers = async (): Promise<User[]> => {
  const res = await fetch(`${API_URL}/v1/users`);
  if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);
  return res.json();
};

export const createUser = async (user: Omit<User, "id"> & { password: string }) => {
  const res = await fetch(`${API_URL}/v1/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (!res.ok) throw new Error(`Failed to create user: ${res.status}`);
  return res.json();
};

export const updateUser = async (user: User & { password: string }) => {
  const res = await fetch(`${API_URL}/v1/users`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (!res.ok) throw new Error(`Failed to update user: ${res.status}`);
  return res.json();
};

export const deleteUser = async (userId: number) => {
  const res = await fetch(`${API_URL}/v1/users/${userId}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to delete user: ${res.status}`);
  return true;
};

export const deleteAllUsers = async () => {
  const res = await fetch(`${API_URL}/v1/users`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to delete all users: ${res.status}`);
  return true;
};

// frontend/fetchs/posts.ts
import { API_URL } from "./config";

// --- API専用型定義 ---
export type ApiPost = {
  id: number;
  user_id: number;
  content: string;
  created_at: string;
};

export type ApiPostWithUser = ApiPost & {
  user: {
    id: number;
    username: string;
    name: string;
    email: string;
    avatar_url: string;
  };
};

export type CreatePostInput = {
  user_id: number;
  content: string;
};

export type UpdatePostInput = {
  id: number;
  user_id: number;
  content: string;
};

// --- fetch functions ---
export const fetchAllPosts = async (): Promise<ApiPostWithUser[]> => {
  const res = await fetch(`${API_URL}/v1/posts`);
  if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);
  return res.json();
};

export const fetchPostsByUserId = async (userId: number): Promise<ApiPostWithUser[]> => {
  const res = await fetch(`${API_URL}/v1/posts/user/${userId}`);
  if (!res.ok) throw new Error(`Failed to fetch posts by user: ${res.status}`);
  return res.json();
};

export const createPost = async (input: CreatePostInput): Promise<ApiPost> => {
  const res = await fetch(`${API_URL}/v1/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Failed to create post: ${res.status}`);
  return res.json();
};

export const updatePost = async (input: UpdatePostInput): Promise<ApiPost> => {
  const res = await fetch(`${API_URL}/v1/posts`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Failed to update post: ${res.status}`);
  return res.json();
};

export const deletePost = async (postId: number): Promise<boolean> => {
  const res = await fetch(`${API_URL}/v1/posts/${postId}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to delete post: ${res.status}`);
  return true;
};

export const deleteAllPosts = async (): Promise<boolean> => {
  const res = await fetch(`${API_URL}/v1/posts`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to delete all posts: ${res.status}`);
  return true;
};

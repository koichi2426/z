// frontend/fetchs/posts.ts
import { API_URL } from "./config";
import type { PostWithUser } from "@/lib/data";

export const fetchAllPosts = async (): Promise<PostWithUser[]> => {
  const res = await fetch(`${API_URL}/v1/posts`);
  if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);
  return res.json();
};

export const fetchPostsByUserId = async (userId: number): Promise<PostWithUser[]> => {
  const res = await fetch(`${API_URL}/v1/posts/user/${userId}`);
  if (!res.ok) throw new Error(`Failed to fetch posts by user: ${res.status}`);
  return res.json();
};

export const createPost = async (userId: number, content: string) => {
  const res = await fetch(`${API_URL}/v1/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, content }),
  });

  if (!res.ok) throw new Error(`Failed to create post: ${res.status}`);
  return res.json();
};

export const updatePost = async (id: number, userId: number, content: string) => {
  const res = await fetch(`${API_URL}/v1/posts`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, user_id: userId, content }),
  });

  if (!res.ok) throw new Error(`Failed to update post: ${res.status}`);
  return res.json();
};

export const deletePost = async (postId: number) => {
  const res = await fetch(`${API_URL}/v1/posts/${postId}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to delete post: ${res.status}`);
  return true;
};

export const deleteAllPosts = async () => {
  const res = await fetch(`${API_URL}/v1/posts`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to delete all posts: ${res.status}`);
  return true;
};

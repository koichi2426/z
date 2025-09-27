import { API_URL } from "./config";

// --- API専用型定義 ---
export type ApiPost = {
  id: number;
  userId: number;      // ← user_id → userId
  content: string;
  createdAt: string;   // ← created_at → createdAt
};

export type ApiPostWithUser = ApiPost & {
  user: {
    id: number;
    username: string;
    name: string;
    email: string;
    avatarUrl: string; // ← avatar_url → avatarUrl
  };
};

export type CreatePostInput = {
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

  const data = await res.json();
  return data.posts; // ← unwrap して配列を返す
};

export const fetchPostsByUserId = async (userId: number): Promise<ApiPostWithUser[]> => {
  const res = await fetch(`${API_URL}/v1/posts/user/${userId}`);
  if (!res.ok) throw new Error(`Failed to fetch posts by user: ${res.status}`);
  
  const data = await res.json();
  return data.posts; // ← unwrap
};

export const fetchPostsByUsername = async (username: string): Promise<ApiPostWithUser[]> => {
  const res = await fetch(`${API_URL}/v1/posts/username/${username}`);
  if (!res.ok) throw new Error(`Failed to fetch posts by username: ${res.status}`);

  const data = await res.json();
  return data.posts; // ← unwrap
};

export const createPost = async (
  input: CreatePostInput,
  token: string
): Promise<ApiPostWithUser> => {  // ← ApiPost → ApiPostWithUser に変更
  const res = await fetch(`${API_URL}/v1/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Failed to create post: ${res.status}`);
  return res.json();
};

export const updatePost = async (
  input: UpdatePostInput,
  token: string
): Promise<ApiPostWithUser> => {   // ← ApiPost → ApiPostWithUser に変更
  const res = await fetch(`${API_URL}/v1/posts`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Failed to update post: ${res.status}`);
  return res.json();
};

export const deletePost = async (
  postId: number,
  token: string
): Promise<boolean> => {
  const res = await fetch(`${API_URL}/v1/posts/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error(`Failed to delete post: ${res.status}`);
  return true;
};

export const deleteAllPosts = async (): Promise<boolean> => {
  const res = await fetch(`${API_URL}/v1/posts`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to delete all posts: ${res.status}`);
  return true;
};

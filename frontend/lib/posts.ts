import mockData from './mock-data.json';
import type { User, Post, PostWithUser } from './data';

/**
 * 全ての投稿を、ユーザー情報を結合した形で取得する関数
 * @returns ユーザー情報が結合された投稿の配列（新しい順）
 */
export const fetchAllPosts = async (): Promise<PostWithUser[]> => {
  const users: User[] = mockData.users;
  const posts: Post[] = mockData.posts;

  // 投稿にユーザー情報を結合
  const populatedPosts: PostWithUser[] = posts.map((post) => {
    const foundUser = users.find((user) => user.id === post.userId);

    const userForPost: User = foundUser
      ? foundUser
      : { id: 0, username: 'unknown', name: 'Unknown User', email: 'unknown@example.com', avatarUrl: '' };

    return { ...post, user: userForPost }; // ← userIdは残したまま
  });

  return populatedPosts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

/**
 * 特定のユーザー名に紐づく投稿を取得する関数
 */
export const fetchPostsByUsername = async (username: string): Promise<PostWithUser[]> => {
  const users: User[] = mockData.users;
  const posts: Post[] = mockData.posts;

  const user = users.find((u) => u.username === username);
  if (!user) return [];

  const userPosts: PostWithUser[] = posts
    .filter((post) => post.userId === user.id)
    .map((post) => ({ ...post, user }));

  return userPosts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

from typing import List, Optional
from domain.post import Post, PostRepository
from adapter.repository.sql import SQL, RowData


class PostMySQL(PostRepository):
    """
    PostRepository の MySQL 実装。
    SQL インターフェースを介してデータベースと対話する。
    """

    def __init__(self, db: SQL):
        self.db = db

    def create(self, post: Post) -> Post:
        query = """
            INSERT INTO posts (user_id, content, created_at)
            VALUES (%s, %s, %s)
        """
        try:
            new_id = self.db.execute_and_return_id(
                query,
                post.user_id,
                post.content,
                post.created_at,
            )
            post.id = new_id
            return post
        except Exception as e:
            raise RuntimeError(f"error creating post: {e}")

    def find_by_id(self, post_id: int) -> Optional[Post]:
        query = "SELECT id, user_id, content, created_at FROM posts WHERE id = %s LIMIT 1"
        try:
            row = self.db.query_row(query, post_id)
            return self._scan_row_data(row.get_values()) if row else None
        except Exception:
            return None

    def find_all(self) -> List[Post]:
        query = "SELECT id, user_id, content, created_at FROM posts"
        try:
            rows = self.db.query(query)
            return [self._scan_row_data(r) for r in rows if r]
        except Exception as e:
            raise RuntimeError(f"error finding all posts: {e}")

    def find_by_user_id(self, user_id: int) -> List[Post]:
        query = "SELECT id, user_id, content, created_at FROM posts WHERE user_id = %s"
        try:
            rows = self.db.query(query, user_id)
            return [self._scan_row_data(r) for r in rows if r]
        except Exception as e:
            raise RuntimeError(f"error finding posts by user_id: {e}")

    def update(self, post: Post) -> None:
        query = """
            UPDATE posts SET
                user_id = %s,
                content = %s,
                created_at = %s
            WHERE id = %s
        """
        try:
            self.db.execute(
                query,
                post.user_id,
                post.content,
                post.created_at,
                post.id,
            )
        except Exception as e:
            raise RuntimeError(f"error updating post: {e}")

    def delete(self, post_id: int) -> None:
        query = "DELETE FROM posts WHERE id = %s"
        try:
            self.db.execute(query, post_id)
        except Exception as e:
            raise RuntimeError(f"error deleting post: {e}")

    def delete_all(self) -> None:
        query = "DELETE FROM posts"
        try:
            self.db.execute(query)
        except Exception as e:
            raise RuntimeError(f"error deleting all posts: {e}")

    def _scan_row_data(self, row_data: Optional[RowData]) -> Optional[Post]:
        """単一のRowData(タプル)からPostを構築するヘルパー"""
        if not row_data:
            return None
        try:
            (
                id_int,
                user_id_int,
                content,
                created_at,
            ) = row_data

            return Post(
                id=id_int,
                user_id=user_id_int,
                content=content,
                created_at=created_at,
            )
        except Exception as e:
            print(f"Error scanning row data: {e}")
            return None


def NewPostMySQL(db: SQL) -> PostMySQL:
    """
    PostMySQL のインスタンスを生成するファクトリ関数。
    """
    return PostMySQL(db)

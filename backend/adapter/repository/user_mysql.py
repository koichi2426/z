from typing import List, Optional
from domain.user import User, UserRepository
from adapter.repository.sql import SQL, RowData


class UserMySQL(UserRepository):
    """
    UserRepository の MySQL 実装。
    SQL インターフェースを介してデータベースと対話する。
    """

    def __init__(self, db: SQL):
        self.db = db

    def create(self, user: User) -> User:
        query = """
            INSERT INTO users (username, name, email, avatar_url, password)
            VALUES (%s, %s, %s, %s, %s)
        """
        try:
            new_id = self.db.execute_and_return_id(
                query,
                user.username,
                user.name,
                user.email,
                user.avatar_url,
                user.password,
            )
            user.id = new_id
            return user
        except Exception as e:
            raise RuntimeError(f"error creating user: {e}")

    def find_by_id(self, user_id: int) -> Optional[User]:
        query = "SELECT id, username, name, email, avatar_url, password FROM users WHERE id = %s LIMIT 1"
        try:
            row = self.db.query_row(query, user_id)
            return self._scan_row_data(row.get_values()) if row else None
        except Exception:
            return None

    def find_all(self) -> List[User]:
        query = "SELECT id, username, name, email, avatar_url, password FROM users"
        try:
            rows = self.db.query(query)
            return [self._scan_row_data(r) for r in rows if r]
        except Exception as e:
            raise RuntimeError(f"error finding all users: {e}")

    def update(self, user: User) -> None:
        query = """
            UPDATE users SET
                username = %s,
                name = %s,
                email = %s,
                avatar_url = %s,
                password = %s
            WHERE id = %s
        """
        try:
            self.db.execute(
                query,
                user.username,
                user.name,
                user.email,
                user.avatar_url,
                user.password,
                user.id,
            )
        except Exception as e:
            raise RuntimeError(f"error updating user: {e}")

    def delete(self, user_id: int) -> None:
        query = "DELETE FROM users WHERE id = %s"
        try:
            self.db.execute(query, user_id)
        except Exception as e:
            raise RuntimeError(f"error deleting user: {e}")

    def delete_all(self) -> None:
        query = "DELETE FROM users"
        try:
            self.db.execute(query)
        except Exception as e:
            raise RuntimeError(f"error deleting all users: {e}")

    def _scan_row_data(self, row_data: Optional[RowData]) -> Optional[User]:
        """単一のRowData(タプル)からUserを構築するヘルパー"""
        if not row_data:
            return None
        try:
            (
                id_int,
                username,
                name,
                email,
                avatar_url,
                password,
            ) = row_data

            return User(
                id=id_int,
                username=username,
                name=name,
                email=email,
                avatar_url=avatar_url,
                password=password,
            )
        except Exception as e:
            print(f"Error scanning row data: {e}")
            return None


def NewUserMySQL(db: SQL) -> UserMySQL:
    """
    UserMySQL のインスタンスを生成するファクトリ関数。
    """
    return UserMySQL(db)

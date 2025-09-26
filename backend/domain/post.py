import abc
from dataclasses import dataclass
from typing import Optional

@dataclass
class Post:
    id: int
    user_id: int
    content: str
    created_at: str  # ISO 8601 datetime

class PostRepository(abc.ABC):
    @abc.abstractmethod
    def create(self, post: Post) -> Post:
        """
        新しい投稿を作成する
        """
        pass

    @abc.abstractmethod
    def find_by_id(self, post_id: int) -> Optional[Post]:
        """
        投稿IDから投稿を検索する
        """
        pass

    @abc.abstractmethod
    def find_all(self) -> list[Post]:
        """
        すべての投稿を取得する
        """
        pass

    @abc.abstractmethod
    def find_by_user_id(self, user_id: int) -> list[Post]:
        """
        ユーザーIDからそのユーザーの投稿一覧を取得する
        """
        pass

    @abc.abstractmethod
    def update(self, post: Post) -> None:
        """
        投稿を更新する
        """
        pass

    @abc.abstractmethod
    def delete(self, post_id: int) -> None:
        """
        投稿IDで投稿を削除する
        """
        pass

    @abc.abstractmethod
    def delete_all(self) -> None:
        """
        すべての投稿を削除する
        """
        pass

def NewPost(
    id: int,
    user_id: int,
    content: str,
    created_at: str,
) -> Post:
    return Post(
        id=id,
        user_id=user_id,
        content=content,
        created_at=created_at,
    )

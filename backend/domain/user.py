import abc
from dataclasses import dataclass
from typing import Optional

@dataclass
class User:
    id: int
    username: str
    name: str
    email: str
    avatar_url: str
    password: str  # 本来はハッシュ化したパスワードを想定

class UserRepository(abc.ABC):
    @abc.abstractmethod
    def create(self, user: User) -> User:
        """
        ユーザーを新規作成し、作成されたUserを返す
        """
        pass

    @abc.abstractmethod
    def find_by_id(self, user_id: int) -> Optional[User]:
        """
        IDからユーザーを検索する
        """
        pass

    @abc.abstractmethod
    def find_all(self) -> list[User]:
        """
        すべてのユーザーを取得する
        """
        pass

    @abc.abstractmethod
    def update(self, user: User) -> None:
        """
        ユーザー情報を更新する
        """
        pass

    @abc.abstractmethod
    def delete(self, user_id: int) -> None:
        """
        IDでユーザーを削除する
        """
        pass

    @abc.abstractmethod
    def delete_all(self) -> None:
        """
        すべてのユーザーを削除する
        """
        pass

def NewUser(
    id: int,
    username: str,
    name: str,
    email: str,
    avatar_url: str,
    password: str,
) -> User:
    return User(
        id=id,
        username=username,
        name=name,
        email=email,
        avatar_url=avatar_url,
        password=password,
    )

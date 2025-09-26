import abc
from .user import User  # Userエンティティを参照

class AuthDomainService(abc.ABC):
    @abc.abstractmethod
    def login(self, email: str, password: str) -> str:
        """
        ユーザーを認証してJWTトークンを返す
        """
        pass

    @abc.abstractmethod
    def verify_token(self, token: str) -> User:
        """
        JWTトークンを検証して、対応するUserを返す
        """
        pass

    @abc.abstractmethod
    def logout(self, token: str) -> None:
        """
        実質的にはクライアント側でトークン削除を行う
        """
        pass

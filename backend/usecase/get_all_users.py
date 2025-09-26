import abc
from dataclasses import dataclass
from typing import Protocol, List, Tuple
from domain.user import User, UserRepository


# ======================================
# Usecaseのインターフェース定義
# ======================================
class GetAllUsersUseCase(Protocol):
    def execute(self) -> Tuple["GetAllUsersOutput", Exception | None]:
        ...


# ======================================
# Output DTO
# ======================================
@dataclass
class UserOutputDTO:
    id: int
    username: str
    name: str
    email: str
    avatar_url: str


@dataclass
class GetAllUsersOutput:
    users: List[UserOutputDTO]


# ======================================
# Presenterのインターフェース定義
# ======================================
class GetAllUsersPresenter(abc.ABC):
    @abc.abstractmethod
    def output(self, users: List[User]) -> GetAllUsersOutput:
        pass


# ======================================
# Usecaseの具体的な実装
# ======================================
class GetAllUsersInteractor:
    def __init__(
        self,
        presenter: "GetAllUsersPresenter",
        repo: UserRepository,
        timeout_sec: int = 10,
    ):
        self.presenter = presenter
        self.repo = repo
        self.timeout_sec = timeout_sec

    def execute(self) -> Tuple["GetAllUsersOutput", Exception | None]:
        try:
            # リポジトリから全ユーザーを取得
            users = self.repo.find_all()
            # Presenterに渡す
            output = self.presenter.output(users)
            return output, None
        except Exception as e:
            # エラー時は空リストを返す
            empty_output = GetAllUsersOutput(users=[])
            return empty_output, e


# ======================================
# Usecaseインスタンスを生成するファクトリ関数
# ======================================
def new_get_all_users_interactor(
    presenter: "GetAllUsersPresenter",
    repo: UserRepository,
    timeout_sec: int,
) -> "GetAllUsersUseCase":
    return GetAllUsersInteractor(
        presenter=presenter,
        repo=repo,
        timeout_sec=timeout_sec,
    )

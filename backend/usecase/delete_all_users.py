import abc
from dataclasses import dataclass
from typing import Protocol, Tuple
from domain.user import UserRepository


# ======================================
# Usecaseのインターフェース定義
# ======================================
class DeleteAllUsersUseCase(Protocol):
    def execute(self) -> Tuple["DeleteAllUsersOutput", Exception | None]:
        ...


# ======================================
# Output DTO
# ======================================
@dataclass
class DeleteAllUsersOutput:
    success: bool


# ======================================
# Presenterのインターフェース定義
# ======================================
class DeleteAllUsersPresenter(abc.ABC):
    @abc.abstractmethod
    def output(self, success: bool) -> DeleteAllUsersOutput:
        pass


# ======================================
# Usecaseの具体的な実装
# ======================================
class DeleteAllUsersInteractor:
    def __init__(
        self,
        presenter: "DeleteAllUsersPresenter",
        repo: UserRepository,
        timeout_sec: int = 10,
    ):
        self.presenter = presenter
        self.repo = repo
        self.timeout_sec = timeout_sec

    def execute(self) -> Tuple["DeleteAllUsersOutput", Exception | None]:
        try:
            # リポジトリに一括削除を依頼
            self.repo.delete_all()

            # Presenterに成功フラグを渡す
            output = self.presenter.output(True)
            return output, None
        except Exception as e:
            return DeleteAllUsersOutput(success=False), e


# ======================================
# Usecaseインスタンスを生成するファクトリ関数
# ======================================
def new_delete_all_users_interactor(
    presenter: "DeleteAllUsersPresenter",
    repo: UserRepository,
    timeout_sec: int,
) -> "DeleteAllUsersUseCase":
    return DeleteAllUsersInteractor(
        presenter=presenter,
        repo=repo,
        timeout_sec=timeout_sec,
    )

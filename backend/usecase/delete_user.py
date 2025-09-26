import abc
from dataclasses import dataclass
from typing import Protocol, Tuple
from domain.user import UserRepository


# ======================================
# Usecaseのインターフェース定義
# ======================================
class DeleteUserUseCase(Protocol):
    def execute(
        self, input: "DeleteUserInput"
    ) -> Tuple["DeleteUserOutput", Exception | None]:
        ...


# ======================================
# Input DTO
# ======================================
@dataclass
class DeleteUserInput:
    id: int


# ======================================
# Output DTO
# ======================================
@dataclass
class DeleteUserOutput:
    success: bool


# ======================================
# Presenterのインターフェース定義
# ======================================
class DeleteUserPresenter(abc.ABC):
    @abc.abstractmethod
    def output(self, success: bool) -> DeleteUserOutput:
        pass


# ======================================
# Usecaseの具体的な実装
# ======================================
class DeleteUserInteractor:
    def __init__(
        self,
        presenter: "DeleteUserPresenter",
        repo: UserRepository,
        timeout_sec: int = 10,
    ):
        self.presenter = presenter
        self.repo = repo
        self.timeout_sec = timeout_sec

    def execute(
        self, input: DeleteUserInput
    ) -> Tuple["DeleteUserOutput", Exception | None]:
        try:
            # リポジトリに削除を依頼
            self.repo.delete(input.id)

            # Presenterに成功フラグを渡す
            output = self.presenter.output(True)
            return output, None
        except Exception as e:
            return DeleteUserOutput(success=False), e


# ======================================
# Usecaseインスタンスを生成するファクトリ関数
# ======================================
def new_delete_user_interactor(
    presenter: "DeleteUserPresenter",
    repo: UserRepository,
    timeout_sec: int,
) -> "DeleteUserUseCase":
    return DeleteUserInteractor(
        presenter=presenter,
        repo=repo,
        timeout_sec=timeout_sec,
    )

import abc
from dataclasses import dataclass
from typing import Protocol, Tuple
from domain.user import User, UserRepository, NewUser


# ======================================
# Usecaseのインターフェース定義
# ======================================
class UpdateUserUseCase(Protocol):
    def execute(
        self, input: "UpdateUserInput"
    ) -> Tuple["UpdateUserOutput", Exception | None]:
        ...


# ======================================
# Input DTO
# ======================================
@dataclass
class UpdateUserInput:
    id: int
    username: str
    name: str
    email: str
    avatar_url: str
    password: str


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
class UpdateUserOutput:
    user: UserOutputDTO


# ======================================
# Presenterのインターフェース定義
# ======================================
class UpdateUserPresenter(abc.ABC):
    @abc.abstractmethod
    def output(self, user: User) -> UpdateUserOutput:
        pass


# ======================================
# Usecaseの具体的な実装
# ======================================
class UpdateUserInteractor:
    def __init__(
        self,
        presenter: "UpdateUserPresenter",
        repo: UserRepository,
        timeout_sec: int = 10,
    ):
        self.presenter = presenter
        self.repo = repo
        self.timeout_sec = timeout_sec

    def execute(
        self, input: UpdateUserInput
    ) -> Tuple["UpdateUserOutput", Exception | None]:
        try:
            # 入力DTOからエンティティを再構築
            updated_user = NewUser(
                id=input.id,
                username=input.username,
                name=input.name,
                email=input.email,
                avatar_url=input.avatar_url,
                password=input.password,
            )

            # 更新処理（戻り値は不要）
            self.repo.update(updated_user)

            # 更新後のデータをPresenterへ渡す
            output = self.presenter.output(updated_user)
            return output, None
        except Exception as e:
            empty_output = UpdateUserOutput(
                user=UserOutputDTO(
                    id=0, username="", name="", email="", avatar_url=""
                )
            )
            return empty_output, e


# ======================================
# Usecaseインスタンスを生成するファクトリ関数
# ======================================
def new_update_user_interactor(
    presenter: "UpdateUserPresenter",
    repo: UserRepository,
    timeout_sec: int,
) -> "UpdateUserUseCase":
    return UpdateUserInteractor(
        presenter=presenter,
        repo=repo,
        timeout_sec=timeout_sec,
    )

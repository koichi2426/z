import abc
from dataclasses import dataclass
from typing import Protocol, Tuple
from domain.user import User, UserRepository, NewUser
from passlib.context import CryptContext

# ======================================
# パスワードハッシュ用
# ======================================
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ======================================
# Usecaseのインターフェース定義
# ======================================
class CreateUserUseCase(Protocol):
    def execute(
        self, input: "CreateUserInput"
    ) -> Tuple["CreateUserOutput", Exception | None]:
        ...


# ======================================
# Input DTO
# ======================================
@dataclass
class CreateUserInput:
    username: str
    name: str
    email: str
    avatar_url: str
    password: str  # 平文で受け取る


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
class CreateUserOutput:
    user: UserOutputDTO


# ======================================
# Presenterのインターフェース定義
# ======================================
class CreateUserPresenter(abc.ABC):
    @abc.abstractmethod
    def output(self, user: User) -> CreateUserOutput:
        pass


# ======================================
# Usecaseの具体的な実装
# ======================================
class CreateUserInteractor:
    def __init__(
        self,
        presenter: "CreateUserPresenter",
        repo: UserRepository,
        timeout_sec: int = 10,
    ):
        self.presenter = presenter
        self.repo = repo
        self.timeout_sec = timeout_sec

    def execute(
        self, input: CreateUserInput
    ) -> Tuple["CreateUserOutput", Exception | None]:
        try:
            # パスワードをハッシュ化
            hashed_password = pwd_context.hash(input.password)

            # IDはDB側で自動採番される想定なので仮で0をセット
            new_user = NewUser(
                id=0,
                username=input.username,
                name=input.name,
                email=input.email,
                avatar_url=input.avatar_url,
                password=hashed_password,  # ハッシュ化した値を保存
            )

            # 永続化
            created = self.repo.create(new_user)

            # Presenterに渡す
            output = self.presenter.output(created)
            return output, None
        except Exception as e:
            empty_output = CreateUserOutput(
                user=UserOutputDTO(
                    id=0, username="", name="", email="", avatar_url=""
                )
            )
            return empty_output, e


# ======================================
# Usecaseインスタンスを生成するファクトリ関数
# ======================================
def new_create_user_interactor(
    presenter: "CreateUserPresenter",
    repo: UserRepository,
    timeout_sec: int,
) -> "CreateUserUseCase":
    return CreateUserInteractor(
        presenter=presenter,
        repo=repo,
        timeout_sec=timeout_sec,
    )

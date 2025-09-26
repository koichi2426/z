import abc
from dataclasses import dataclass
from typing import Protocol, Tuple
from domain.user import User
from domain.auth_domain_service import AuthDomainService

# ======================================
# Usecaseのインターフェース定義
# ======================================
class VerifyTokenUseCase(Protocol):
    def execute(
        self, input: "VerifyTokenInput"
    ) -> Tuple["VerifyTokenOutput", Exception | None]:
        ...


# ======================================
# UsecaseのInput
# ======================================
@dataclass
class VerifyTokenInput:
    token: str


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
class VerifyTokenOutput:
    user: UserOutputDTO | None


# ======================================
# Presenterのインターフェース定義
# ======================================
class VerifyTokenPresenter(abc.ABC):
    @abc.abstractmethod
    def output(self, user: User) -> VerifyTokenOutput:
        pass


# ======================================
# Usecaseの具体的な実装
# ======================================
class VerifyTokenInteractor:
    def __init__(
        self,
        presenter: "VerifyTokenPresenter",
        auth_service: AuthDomainService,
        timeout_sec: int = 10,
    ):
        self.presenter = presenter
        self.auth_service = auth_service
        self.timeout_sec = timeout_sec

    def execute(
        self, input: VerifyTokenInput
    ) -> Tuple["VerifyTokenOutput", Exception | None]:
        try:
            # ドメインサービスでトークンを検証
            user = self.auth_service.verify_token(input.token)

            # Presenterに渡してDTO化
            output = self.presenter.output(user)
            return output, None
        except Exception as e:
            return VerifyTokenOutput(user=None), e


# ======================================
# Usecaseインスタンスを生成するファクトリ関数
# ======================================
def new_verify_token_interactor(
    presenter: "VerifyTokenPresenter",
    auth_service: AuthDomainService,
    timeout_sec: int,
) -> "VerifyTokenUseCase":
    return VerifyTokenInteractor(
        presenter=presenter,
        auth_service=auth_service,
        timeout_sec=timeout_sec,
    )

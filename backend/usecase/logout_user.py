import abc
from dataclasses import dataclass
from typing import Protocol, Tuple
from domain.auth_domain_service import AuthDomainService

# ======================================
# Usecaseのインターフェース定義
# ======================================
class LogoutUserUseCase(Protocol):
    def execute(
        self, input: "LogoutUserInput"
    ) -> Tuple["LogoutUserOutput", Exception | None]:
        ...


# ======================================
# UsecaseのInput
# ======================================
@dataclass
class LogoutUserInput:
    token: str


# ======================================
# Output DTO
# ======================================
@dataclass
class LogoutUserOutput:
    success: bool


# ======================================
# Presenterのインターフェース定義
# ======================================
class LogoutUserPresenter(abc.ABC):
    @abc.abstractmethod
    def output(self, success: bool) -> LogoutUserOutput:
        pass


# ======================================
# Usecaseの具体的な実装
# ======================================
class LogoutUserInteractor:
    def __init__(
        self,
        presenter: "LogoutUserPresenter",
        auth_service: AuthDomainService,
        timeout_sec: int = 10,
    ):
        self.presenter = presenter
        self.auth_service = auth_service
        self.timeout_sec = timeout_sec

    def execute(
        self, input: LogoutUserInput
    ) -> Tuple["LogoutUserOutput", Exception | None]:
        try:
            # サーバー側では特にトークンを管理しないが、
            # インターフェースに従いAuthDomainService.logoutを呼ぶ
            self.auth_service.logout(input.token)

            # Presenterに渡す
            output = self.presenter.output(True)
            return output, None
        except Exception as e:
            return LogoutUserOutput(success=False), e


# ======================================
# Usecaseインスタンスを生成するファクトリ関数
# ======================================
def new_logout_user_interactor(
    presenter: "LogoutUserPresenter",
    auth_service: AuthDomainService,
    timeout_sec: int,
) -> "LogoutUserUseCase":
    return LogoutUserInteractor(
        presenter=presenter,
        auth_service=auth_service,
        timeout_sec=timeout_sec,
    )

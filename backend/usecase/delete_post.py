import abc
from dataclasses import dataclass
from typing import Protocol, Tuple
from domain.post import PostRepository
from domain.auth_domain_service import AuthDomainService


# ======================================
# Usecaseのインターフェース定義
# ======================================
class DeletePostUseCase(Protocol):
    def execute(
        self, input_data: "DeletePostInput"
    ) -> Tuple["DeletePostOutput", Exception | None]:
        ...


# ======================================
# Input DTO
# ======================================
@dataclass
class DeletePostInput:
    id: int
    token: str  # 追加: 削除実行するユーザーのトークン


# ======================================
# Output DTO
# ======================================
@dataclass
class DeletePostOutput:
    success: bool


# ======================================
# Presenterのインターフェース定義
# ======================================
class DeletePostPresenter(abc.ABC):
    @abc.abstractmethod
    def output(self, success: bool) -> DeletePostOutput:
        pass


# ======================================
# Usecaseの具体的な実装
# ======================================
class DeletePostInteractor:
    def __init__(
        self,
        presenter: "DeletePostPresenter",
        repo: PostRepository,
        auth_service: AuthDomainService,
        timeout_sec: int = 10,
    ):
        self.presenter = presenter
        self.repo = repo
        self.auth_service = auth_service
        self.timeout_sec = timeout_sec

    def execute(
        self, input_data: DeletePostInput
    ) -> Tuple["DeletePostOutput", Exception | None]:
        try:
            # token からユーザーを特定
            user = self.auth_service.verify_token(input_data.token)

            # 投稿を取得してユーザーがオーナーか確認
            post = self.repo.get_by_id(input_data.id)
            if not post or post.user_id != user.id:
                raise PermissionError("You are not authorized to delete this post")

            # リポジトリを通して削除
            self.repo.delete(input_data.id)

            # 成功レスポンスをPresenterで生成
            output = self.presenter.output(True)
            return output, None
        except Exception as e:
            return self.presenter.output(False), e


# ======================================
# Usecaseインスタンスを生成するファクトリ関数
# ======================================
def new_delete_post_interactor(
    presenter: "DeletePostPresenter",
    repo: PostRepository,
    auth_service: AuthDomainService,
    timeout_sec: int,
) -> "DeletePostUseCase":
    return DeletePostInteractor(
        presenter=presenter,
        repo=repo,
        auth_service=auth_service,
        timeout_sec=timeout_sec,
    )

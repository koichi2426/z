import abc
from dataclasses import dataclass
from typing import Protocol, Tuple
from datetime import datetime, timezone, timedelta  # 修正点: timezoneとtimedeltaを追加
from domain.post import Post, PostRepository
from domain.user import User
from domain.auth_domain_service import AuthDomainService


# ======================================
# Usecaseのインターフェース定義
# ======================================
class CreatePostUseCase(Protocol):
    def execute(self, input_data: "CreatePostInput") -> Tuple["CreatePostOutput", Exception | None]:
        ...


# ======================================
# Input DTO
# ======================================
@dataclass
class CreatePostInput:
    token: str
    content: str
    # created_at はサーバー側で生成


# ======================================
# Output DTO
# ======================================
@dataclass
class PostOutputDTO:
    id: int
    user_id: int
    content: str
    created_at: str


@dataclass
class CreatePostOutput:
    post: PostOutputDTO


# ======================================
# Presenterのインターフェース定義
# （Presenter 実装が (Post, User) を受け取る想定に合わせる）
# ======================================
class CreatePostPresenter(abc.ABC):
    @abc.abstractmethod
    def output(self, post_with_user: Tuple[Post, User]) -> CreatePostOutput:
        pass


# ======================================
# Usecaseの具体的な実装
# ======================================
class CreatePostInteractor:
    def __init__(
        self,
        presenter: "CreatePostPresenter",
        repo: PostRepository,
        auth_service: AuthDomainService,
        timeout_sec: int = 10,
    ):
        self.presenter = presenter
        self.repo = repo
        self.auth_service = auth_service
        self.timeout_sec = timeout_sec

    def execute(self, input_data: CreatePostInput) -> Tuple["CreatePostOutput", Exception | None]:
        try:
            # token から user を特定
            user: User = self.auth_service.verify_token(input_data.token)

            # --- ▼▼▼ ここからが修正点 ▼▼▼ ---
            # タイムゾーンをJST（UTC+9）に設定
            JST = timezone(timedelta(hours=+9), 'JST')
            # created_at はサーバー側で日本時間(JST)で生成
            created_at = datetime.now(JST).isoformat()
            # --- ▲▲▲ ここまでが修正点 ▲▲▲ ---

            # Postエンティティを作成
            new_post = Post(
                id=0,  # DBが自動採番する想定
                user_id=user.id,
                content=input_data.content,
                created_at=created_at,
            )

            # リポジトリで保存
            created_post = self.repo.create(new_post)

            # Presenterに (Post, User) を渡す
            output = self.presenter.output((created_post, user))
            return output, None
        except Exception as e:
            empty_post = Post(id=0, user_id=0, content="", created_at="")
            empty_user = User(id=0, username="", name="", email="", avatar_url="", password="")
            return self.presenter.output((empty_post, empty_user)), e


# ======================================
# Usecaseインスタンスを生成するファクトリ関数
# ======================================
def new_create_post_interactor(
    presenter: "CreatePostPresenter",
    repo: PostRepository,
    auth_service: AuthDomainService,
    timeout_sec: int,
) -> "CreatePostUseCase":
    return CreatePostInteractor(
        presenter=presenter,
        repo=repo,
        auth_service=auth_service,
        timeout_sec=timeout_sec,
    )

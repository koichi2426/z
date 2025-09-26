import abc
from dataclasses import dataclass
from typing import Protocol, Tuple
from domain.post import Post, PostRepository


# ======================================
# Usecaseのインターフェース定義
# ======================================
class UpdatePostUseCase(Protocol):
    def execute(self, input_data: "UpdatePostInput") -> Tuple["UpdatePostOutput", Exception | None]:
        ...


# ======================================
# Input DTO
# ======================================
@dataclass
class UpdatePostInput:
    id: int
    user_id: int
    content: str
    created_at: str  # ISO 8601 datetime


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
class UpdatePostOutput:
    post: PostOutputDTO


# ======================================
# Presenterのインターフェース定義
# ======================================
class UpdatePostPresenter(abc.ABC):
    @abc.abstractmethod
    def output(self, post: Post) -> UpdatePostOutput:
        pass


# ======================================
# Usecaseの具体的な実装
# ======================================
class UpdatePostInteractor:
    def __init__(
        self,
        presenter: "UpdatePostPresenter",
        repo: PostRepository,
        timeout_sec: int = 10,
    ):
        self.presenter = presenter
        self.repo = repo
        self.timeout_sec = timeout_sec

    def execute(self, input_data: UpdatePostInput) -> Tuple["UpdatePostOutput", Exception | None]:
        try:
            # 更新用Postエンティティを作成
            updated_post = Post(
                id=input_data.id,
                user_id=input_data.user_id,
                content=input_data.content,
                created_at=input_data.created_at,
            )

            # リポジトリで更新処理
            self.repo.update(updated_post)

            # Presenterに渡してDTO化
            output = self.presenter.output(updated_post)
            return output, None
        except Exception as e:
            empty_post = Post(id=0, user_id=0, content="", created_at="")
            return self.presenter.output(empty_post), e


# ======================================
# Usecaseインスタンスを生成するファクトリ関数
# ======================================
def new_update_post_interactor(
    presenter: "UpdatePostPresenter",
    repo: PostRepository,
    timeout_sec: int,
) -> "UpdatePostUseCase":
    return UpdatePostInteractor(
        presenter=presenter,
        repo=repo,
        timeout_sec=timeout_sec,
    )

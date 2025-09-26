import abc
from dataclasses import dataclass
from typing import Protocol, Tuple
from domain.post import Post, PostRepository


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
class CreatePostOutput:
    post: PostOutputDTO


# ======================================
# Presenterのインターフェース定義
# ======================================
class CreatePostPresenter(abc.ABC):
    @abc.abstractmethod
    def output(self, post: Post) -> CreatePostOutput:
        pass


# ======================================
# Usecaseの具体的な実装
# ======================================
class CreatePostInteractor:
    def __init__(
        self,
        presenter: "CreatePostPresenter",
        repo: PostRepository,
        timeout_sec: int = 10,
    ):
        self.presenter = presenter
        self.repo = repo
        self.timeout_sec = timeout_sec

    def execute(self, input_data: CreatePostInput) -> Tuple["CreatePostOutput", Exception | None]:
        try:
            # Postエンティティを作成
            new_post = Post(
                id=0,  # DBが自動採番する想定
                user_id=input_data.user_id,
                content=input_data.content,
                created_at=input_data.created_at,
            )

            # リポジトリで保存
            created_post = self.repo.create(new_post)

            # Presenterに渡してDTO化
            output = self.presenter.output(created_post)
            return output, None
        except Exception as e:
            empty_post = Post(id=0, user_id=0, content="", created_at="")
            return self.presenter.output(empty_post), e


# ======================================
# Usecaseインスタンスを生成するファクトリ関数
# ======================================
def new_create_post_interactor(
    presenter: "CreatePostPresenter",
    repo: PostRepository,
    timeout_sec: int,
) -> "CreatePostUseCase":
    return CreatePostInteractor(
        presenter=presenter,
        repo=repo,
        timeout_sec=timeout_sec,
    )

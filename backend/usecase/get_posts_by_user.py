import abc
from dataclasses import dataclass
from typing import Protocol, List, Tuple
from domain.post import Post, PostRepository


# ======================================
# Usecaseのインターフェース定義
# ======================================
class GetPostsByUserUseCase(Protocol):
    def execute(self, input_data: "GetPostsByUserInput") -> Tuple["GetPostsByUserOutput", Exception | None]:
        ...


# ======================================
# Input DTO
# ======================================
@dataclass
class GetPostsByUserInput:
    user_id: int


# ======================================
# Output DTO
# ======================================
@dataclass
class PostOutputDTO:
    id: int
    user_id: int
    content: str
    created_at: str  # ISO 8601 datetime


@dataclass
class GetPostsByUserOutput:
    posts: List[PostOutputDTO]


# ======================================
# Presenterのインターフェース定義
# ======================================
class GetPostsByUserPresenter(abc.ABC):
    @abc.abstractmethod
    def output(self, posts: List[Post]) -> GetPostsByUserOutput:
        pass


# ======================================
# Usecaseの具体的な実装
# ======================================
class GetPostsByUserInteractor:
    def __init__(
        self,
        presenter: "GetPostsByUserPresenter",
        repo: PostRepository,
        timeout_sec: int = 10,
    ):
        self.presenter = presenter
        self.repo = repo
        self.timeout_sec = timeout_sec

    def execute(self, input_data: GetPostsByUserInput) -> Tuple["GetPostsByUserOutput", Exception | None]:
        try:
            # リポジトリからユーザーの投稿を取得
            posts = self.repo.find_by_user_id(input_data.user_id)

            # Presenterに渡してDTO化
            output = self.presenter.output(posts)
            return output, None
        except Exception as e:
            return GetPostsByUserOutput(posts=[]), e


# ======================================
# Usecaseインスタンスを生成するファクトリ関数
# ======================================
def new_get_posts_by_user_interactor(
    presenter: "GetPostsByUserPresenter",
    repo: PostRepository,
    timeout_sec: int,
) -> "GetPostsByUserUseCase":
    return GetPostsByUserInteractor(
        presenter=presenter,
        repo=repo,
        timeout_sec=timeout_sec,
    )

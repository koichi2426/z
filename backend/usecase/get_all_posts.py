import abc
from dataclasses import dataclass
from typing import Protocol, List, Tuple
from domain.post import Post, PostRepository


# ======================================
# Usecaseのインターフェース定義
# ======================================
class GetAllPostsUseCase(Protocol):
    def execute(self) -> Tuple["GetAllPostsOutput", Exception | None]:
        ...


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
class GetAllPostsOutput:
    posts: List[PostOutputDTO]


# ======================================
# Presenterのインターフェース定義
# ======================================
class GetAllPostsPresenter(abc.ABC):
    @abc.abstractmethod
    def output(self, posts: List[Post]) -> GetAllPostsOutput:
        pass


# ======================================
# Usecaseの具体的な実装
# ======================================
class GetAllPostsInteractor:
    def __init__(
        self,
        presenter: "GetAllPostsPresenter",
        repo: PostRepository,
        timeout_sec: int = 10,
    ):
        self.presenter = presenter
        self.repo = repo
        self.timeout_sec = timeout_sec

    def execute(self) -> Tuple["GetAllPostsOutput", Exception | None]:
        try:
            # リポジトリから全ポストを取得
            posts = self.repo.find_all()

            # Presenterに渡してDTO化
            output = self.presenter.output(posts)
            return output, None
        except Exception as e:
            return GetAllPostsOutput(posts=[]), e


# ======================================
# Usecaseインスタンスを生成するファクトリ関数
# ======================================
def new_get_all_posts_interactor(
    presenter: "GetAllPostsPresenter",
    repo: PostRepository,
    timeout_sec: int,
) -> "GetAllPostsUseCase":
    return GetAllPostsInteractor(
        presenter=presenter,
        repo=repo,
        timeout_sec=timeout_sec,
    )

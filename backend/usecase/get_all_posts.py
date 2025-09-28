import abc
from dataclasses import dataclass
from typing import Protocol, List, Tuple
from domain.post import Post, PostRepository
from domain.user import User, UserRepository


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
    def output(self, posts_with_users: List[Tuple[Post, User]]) -> GetAllPostsOutput:
        pass


# ======================================
# Usecaseの具体的な実装
# ======================================
class GetAllPostsInteractor:
    def __init__(
        self,
        presenter: "GetAllPostsPresenter",
        post_repo: PostRepository,
        user_repo: UserRepository,
        timeout_sec: int = 10,
    ):
        self.presenter = presenter
        self.post_repo = post_repo
        self.user_repo = user_repo
        self.timeout_sec = timeout_sec

    def execute(self) -> Tuple["GetAllPostsOutput", Exception | None]:
        try:
            # リポジトリから全ポストを取得
            posts = self.post_repo.find_all()

            # 各 Post に対応する User を取得
            posts_with_users: List[Tuple[Post, User]] = []
            for post in posts:
                user = self.user_repo.find_by_id(post.user_id)
                if user:
                    posts_with_users.append((post, user))

            # Presenterに渡してDTO化
            output = self.presenter.output(posts_with_users)
            return output, None
        except Exception as e:
            return GetAllPostsOutput(posts=[]), e


# ======================================
# Usecaseインスタンスを生成するファクトリ関数
# ======================================
def new_get_all_posts_interactor(
    presenter: "GetAllPostsPresenter",
    post_repo: PostRepository,
    user_repo: UserRepository,
    timeout_sec: int,
) -> "GetAllPostsUseCase":
    return GetAllPostsInteractor(
        presenter=presenter,
        post_repo=post_repo,
        user_repo=user_repo,
        timeout_sec=timeout_sec,
    )

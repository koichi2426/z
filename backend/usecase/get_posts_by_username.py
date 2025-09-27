import abc
from dataclasses import dataclass
from typing import Protocol, List, Tuple
from domain.post import Post, PostRepository
from domain.user import UserRepository, User


# ======================================
# Usecaseのインターフェース定義
# ======================================
class GetPostsByUsernameUseCase(Protocol):
    def execute(self, input_data: "GetPostsByUsernameInput") -> Tuple["GetPostsByUsernameOutput", Exception | None]:
        ...


# ======================================
# Input DTO
# ======================================
@dataclass
class GetPostsByUsernameInput:
    username: str


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
class GetPostsByUsernameOutput:
    posts: List[PostOutputDTO]


# ======================================
# Presenterのインターフェース定義
# ======================================
class GetPostsByUsernamePresenter(abc.ABC):
    @abc.abstractmethod
    def output(self, posts_with_user: List[Tuple[Post, User]]) -> GetPostsByUsernameOutput:
        """
        Post と User の組を受け取って DTO に変換する
        """
        pass


# ======================================
# Usecaseの具体的な実装
# ======================================
class GetPostsByUsernameInteractor:
    def __init__(
        self,
        presenter: "GetPostsByUsernamePresenter",
        post_repo: PostRepository,
        user_repo: UserRepository,
        timeout_sec: int = 10,
    ):
        self.presenter = presenter
        self.post_repo = post_repo
        self.user_repo = user_repo
        self.timeout_sec = timeout_sec

    def execute(self, input_data: GetPostsByUsernameInput) -> Tuple["GetPostsByUsernameOutput", Exception | None]:
        print("DEBUG: entered execute with", input_data, type(input_data))  # ★ここ
        try:
            print("DEBUG: input username =", input_data.username)

            # username から user を特定
            user: User | None = self.user_repo.find_by_username(input_data.username)
            print("DEBUG: user =", user, "type(user) =", type(user))

            if not user:
                print("DEBUG: user not found")
                return GetPostsByUsernameOutput(posts=[]), None

            # リポジトリからユーザーの投稿を取得
            posts = self.post_repo.find_by_user_id(user.id)
            print("DEBUG: posts =", posts, "type(posts) =", type(posts))

            # (Post, User) のタプルリストを作成
            posts_with_user: List[Tuple[Post, User]] = []
            for post in posts:
                print("DEBUG: post =", post, "type(post) =", type(post))
                print("DEBUG: user =", user, "type(user) =", type(user))
                posts_with_user.append((post, user))

            print("DEBUG: posts_with_user =", posts_with_user)

            # Presenterに渡してDTO化
            output = self.presenter.output(posts_with_user)
            print("DEBUG: output =", output)
            return output, None
        except Exception as e:
            print("ERROR in execute:", e)
            return GetPostsByUsernameOutput(posts=[]), e



# ======================================
# Usecaseインスタンスを生成するファクトリ関数
# ======================================
def new_get_posts_by_username_interactor(
    presenter: "GetPostsByUsernamePresenter",
    post_repo: PostRepository,
    user_repo: UserRepository,
    timeout_sec: int,
) -> "GetPostsByUsernameUseCase":
    return GetPostsByUsernameInteractor(
        presenter=presenter,
        post_repo=post_repo,
        user_repo=user_repo,
        timeout_sec=timeout_sec,
    )

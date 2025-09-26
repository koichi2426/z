import abc
from dataclasses import dataclass
from typing import Protocol, Tuple
from domain.post import PostRepository


# ======================================
# Usecaseのインターフェース定義
# ======================================
class DeleteAllPostsUseCase(Protocol):
    def execute(self, input_data: "DeleteAllPostsInput") -> Tuple["DeleteAllPostsOutput", Exception | None]:
        ...


# ======================================
# Input DTO
# ======================================
@dataclass
class DeleteAllPostsInput:
    pass  # 特に必要な入力はなし


# ======================================
# Output DTO
# ======================================
@dataclass
class DeleteAllPostsOutput:
    success: bool


# ======================================
# Presenterのインターフェース定義
# ======================================
class DeleteAllPostsPresenter(abc.ABC):
    @abc.abstractmethod
    def output(self, success: bool) -> DeleteAllPostsOutput:
        pass


# ======================================
# Usecaseの具体的な実装
# ======================================
class DeleteAllPostsInteractor:
    def __init__(
        self,
        presenter: "DeleteAllPostsPresenter",
        repo: PostRepository,
        timeout_sec: int = 10,
    ):
        self.presenter = presenter
        self.repo = repo
        self.timeout_sec = timeout_sec

    def execute(self, input_data: DeleteAllPostsInput) -> Tuple["DeleteAllPostsOutput", Exception | None]:
        try:
            # リポジトリを通して全削除
            self.repo.delete_all()

            # 成功レスポンスをPresenterで生成
            output = self.presenter.output(True)
            return output, None
        except Exception as e:
            return self.presenter.output(False), e


# ======================================
# Usecaseインスタンスを生成するファクトリ関数
# ======================================
def new_delete_all_posts_interactor(
    presenter: "DeleteAllPostsPresenter",
    repo: PostRepository,
    timeout_sec: int,
) -> "DeleteAllPostsUseCase":
    return DeleteAllPostsInteractor(
        presenter=presenter,
        repo=repo,
        timeout_sec=timeout_sec,
    )

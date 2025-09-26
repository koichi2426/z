from usecase.delete_all_posts import DeleteAllPostsPresenter
from typing import Dict, Any


class DeleteAllPostsPresenterImpl(DeleteAllPostsPresenter):
    def output(self, deleted_count: int) -> Dict[str, Any]:
        """
        削除された投稿の件数を返す。
        """
        return {
            "success": True,
            "deleted_count": deleted_count
        }


def new_delete_all_posts_presenter() -> DeleteAllPostsPresenter:
    """
    DeleteAllPostsPresenterImpl のインスタンスを生成するファクトリ関数。
    """
    return DeleteAllPostsPresenterImpl()

from usecase.delete_post import DeletePostPresenter
from typing import Dict, Any


class DeletePostPresenterImpl(DeletePostPresenter):
    def output(self, post_id: int) -> Dict[str, Any]:
        """
        削除された Post の ID を返す。
        """
        return {
            "success": True,
            "deleted_post_id": post_id
        }


def new_delete_post_presenter() -> DeletePostPresenter:
    """
    DeletePostPresenterImpl のインスタンスを生成するファクトリ関数。
    """
    return DeletePostPresenterImpl()

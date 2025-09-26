from usecase.delete_all_users import DeleteAllUsersPresenter
from typing import Dict, Any


class DeleteAllUsersPresenterImpl(DeleteAllUsersPresenter):
    def output(self) -> Dict[str, Any]:
        """
        ユーザー一括削除結果を JSON シリアライズ可能な辞書に変換して返す。
        """
        return {
            "success": True,
            "message": "All users deleted successfully."
        }


def new_delete_all_users_presenter() -> DeleteAllUsersPresenter:
    """
    DeleteAllUsersPresenterImpl のインスタンスを生成するファクトリ関数。
    """
    return DeleteAllUsersPresenterImpl()

from usecase.delete_user import DeleteUserPresenter
from typing import Dict, Any


class DeleteUserPresenterImpl(DeleteUserPresenter):
    def output(self, user_id: int) -> Dict[str, Any]:
        """
        ユーザー削除結果を JSON シリアライズ可能な辞書に変換して返す。
        """
        return {
            "success": True,
            "message": f"User with id={user_id} deleted successfully."
        }


def new_delete_user_presenter() -> DeleteUserPresenter:
    """
    DeleteUserPresenterImpl のインスタンスを生成するファクトリ関数。
    """
    return DeleteUserPresenterImpl()

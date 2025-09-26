from usecase.logout_user import LogoutUserPresenter
from typing import Dict, Any


class LogoutUserPresenterImpl(LogoutUserPresenter):
    def output(self) -> Dict[str, Any]:
        """
        ログアウト結果を JSON シリアライズ可能な辞書に変換して返す。
        """
        return {
            "success": True,
            "message": "User logged out successfully."
        }


def new_logout_user_presenter() -> LogoutUserPresenter:
    """
    LogoutUserPresenterImpl のインスタンスを生成するファクトリ関数。
    """
    return LogoutUserPresenterImpl()

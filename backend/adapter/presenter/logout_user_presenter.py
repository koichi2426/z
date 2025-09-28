from usecase.logout_user import LogoutUserPresenter, LogoutUserOutput
from typing import Dict, Any

class LogoutUserPresenterImpl(LogoutUserPresenter):
    def output(self, success: bool) -> Dict[str, Any]:
        """
        ログアウト結果を JSON シリアライズ可能な辞書に変換して返す。
        """
        return {
            "success": success,
            "message": "User logged out successfully." if success else "Logout failed."
        }

def new_logout_user_presenter() -> LogoutUserPresenter:
    return LogoutUserPresenterImpl()

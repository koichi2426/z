from usecase.login_user import LoginUserPresenter
from typing import Dict, Any


class LoginUserPresenterImpl(LoginUserPresenter):
    def output(self, token: str) -> Dict[str, Any]:
        """
        JWTトークンを辞書形式に変換して返す。
        API レスポンスとして JSON シリアライズ可能。
        """
        return {
            "token": token
        }


def new_login_user_presenter() -> LoginUserPresenter:
    """
    LoginUserPresenterImpl のインスタンスを生成するファクトリ関数。
    """
    return LoginUserPresenterImpl()

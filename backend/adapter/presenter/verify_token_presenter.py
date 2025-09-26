from usecase.verify_token import VerifyTokenPresenter
from domain.user import User
from typing import Dict, Any


class VerifyTokenPresenterImpl(VerifyTokenPresenter):
    def output(self, user: User) -> Dict[str, Any]:
        """
        Userドメインオブジェクトを JSON シリアライズ可能な辞書に変換して返す。
        """
        return {
            "id": user.id,
            "username": user.username,
            "name": user.name,
            "email": user.email,
            "avatar_url": user.avatar_url,
            # password は API レスポンスに含めない設計とする
        }


def new_verify_token_presenter() -> VerifyTokenPresenter:
    """
    VerifyTokenPresenterImpl のインスタンスを生成するファクトリ関数。
    """
    return VerifyTokenPresenterImpl()

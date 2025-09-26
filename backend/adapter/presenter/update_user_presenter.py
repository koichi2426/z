from usecase.update_user import UpdateUserPresenter
from domain.user import User
from typing import Dict, Any


class UpdateUserPresenterImpl(UpdateUserPresenter):
    def output(self, user: User) -> Dict[str, Any]:
        """
        更新後の User ドメインオブジェクトを
        JSON シリアライズ可能な辞書に変換して返す。
        """
        return {
            "id": user.id,
            "username": user.username,
            "name": user.name,
            "email": user.email,
            "avatar_url": user.avatar_url,
        }


def new_update_user_presenter() -> UpdateUserPresenter:
    """
    UpdateUserPresenterImpl のインスタンスを生成するファクトリ関数。
    """
    return UpdateUserPresenterImpl()

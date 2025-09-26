from usecase.get_all_users import GetAllUsersPresenter
from domain.user import User
from typing import Dict, Any, List


class GetAllUsersPresenterImpl(GetAllUsersPresenter):
    def output(self, users: List[User]) -> Dict[str, Any]:
        """
        Userドメインオブジェクトのリストを
        JSONシリアライズ可能な辞書に変換して返す。
        """
        return {
            "users": [
                {
                    "id": user.id,
                    "username": user.username,
                    "name": user.name,
                    "email": user.email,
                    "avatar_url": user.avatar_url,
                    # passwordはセキュリティのためレスポンスに含めない
                }
                for user in users
            ]
        }


def new_get_all_users_presenter() -> GetAllUsersPresenter:
    """
    GetAllUsersPresenterImplのインスタンスを生成するファクトリ関数。
    """
    return GetAllUsersPresenterImpl()

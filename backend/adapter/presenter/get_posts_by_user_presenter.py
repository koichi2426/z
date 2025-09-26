from usecase.get_posts_by_user import GetPostsByUserPresenter
from domain import Post, User
from typing import Dict, Any, List, Tuple


class GetPostsByUserPresenterImpl(GetPostsByUserPresenter):
    def output(self, posts_with_user: List[Tuple[Post, User]]) -> Dict[str, Any]:
        """
        ユーザーに紐づく Post と User の組を
        JSON シリアライズ可能な辞書に変換して返す。
        フロントエンドの PostWithUser 型に対応。
        """
        return {
            "posts": [
                {
                    "id": post.id,
                    "userId": post.user_id,
                    "content": post.content,
                    "createdAt": post.created_at,
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "name": user.name,
                        "email": user.email,
                        "avatarUrl": user.avatar_url,
                        # password は返さない
                    },
                }
                for post, user in posts_with_user
            ]
        }


def new_get_posts_by_user_presenter() -> GetPostsByUserPresenter:
    """
    GetPostsByUserPresenterImpl のインスタンスを生成するファクトリ関数。
    """
    return GetPostsByUserPresenterImpl()

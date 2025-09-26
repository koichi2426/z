from usecase.get_all_posts import GetAllPostsPresenter
from domain import Post, User
from typing import Dict, Any, List, Tuple


class GetAllPostsPresenterImpl(GetAllPostsPresenter):
    def output(self, posts_with_users: List[Tuple[Post, User]]) -> Dict[str, Any]:
        """
        Post と User のペアのリストを JSON シリアライズ可能な辞書に変換して返す。
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
                        # password は返さない (セキュリティ的にNG)
                    },
                }
                for post, user in posts_with_users
            ]
        }


def new_get_all_posts_presenter() -> GetAllPostsPresenter:
    """
    GetAllPostsPresenterImpl のインスタンスを生成するファクトリ関数。
    """
    return GetAllPostsPresenterImpl()

from usecase.create_post import CreatePostPresenter
from domain import Post, User
from typing import Dict, Any, Tuple


class CreatePostPresenterImpl(CreatePostPresenter):
    def output(self, post_with_user: Tuple[Post, User]) -> Dict[str, Any]:
        """
        作成された Post と User を JSON シリアライズ可能な辞書に変換。
        フロントエンドの PostWithUser 型に対応。
        """
        post, user = post_with_user
        return {
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


def new_create_post_presenter() -> CreatePostPresenter:
    """
    CreatePostPresenterImpl のインスタンスを生成するファクトリ関数。
    """
    return CreatePostPresenterImpl()

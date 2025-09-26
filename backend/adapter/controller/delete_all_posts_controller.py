from typing import Dict, Union
from usecase.delete_all_posts import (
    DeleteAllPostsUseCase,
    DeleteAllPostsOutput,
)


class DeleteAllPostsController:
    def __init__(self, uc: DeleteAllPostsUseCase):
        self.uc = uc

    def execute(self) -> Dict[str, Union[int, DeleteAllPostsOutput, Dict[str, str]]]:
        try:
            output, err = self.uc.execute()
            if err:
                return {"status": 500, "data": {"error": str(err)}}
            return {"status": 200, "data": output}
        except Exception:
            return {"status": 500, "data": {"error": "An unexpected error occurred"}}

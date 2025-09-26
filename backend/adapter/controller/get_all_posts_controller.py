from typing import Dict, Union
from usecase.get_all_posts import (
    GetAllPostsUseCase,
    GetAllPostsOutput,
)


class GetAllPostsController:
    def __init__(self, uc: GetAllPostsUseCase):
        self.uc = uc

    def execute(self) -> Dict[str, Union[int, GetAllPostsOutput, Dict[str, str]]]:
        try:
            output, err = self.uc.execute()
            if err:
                return {"status": 500, "data": {"error": str(err)}}
            return {"status": 200, "data": output}
        except Exception:
            return {"status": 500, "data": {"error": "An unexpected error occurred"}}

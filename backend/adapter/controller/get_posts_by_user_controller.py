from typing import Dict, Union
from usecase.get_posts_by_user import (
    GetPostsByUserUseCase,
    GetPostsByUserInput,
    GetPostsByUserOutput,
)


class GetPostsByUserController:
    def __init__(self, uc: GetPostsByUserUseCase):
        self.uc = uc

    def execute(
        self, input_data: GetPostsByUserInput
    ) -> Dict[str, Union[int, GetPostsByUserOutput, Dict[str, str]]]:
        try:
            output, err = self.uc.execute(input_data)
            if err:
                return {"status": 404, "data": {"error": str(err)}}
            return {"status": 200, "data": output}
        except Exception:
            return {"status": 500, "data": {"error": "An unexpected error occurred"}}

from typing import Dict, Union
from usecase.create_post import (
    CreatePostUseCase,
    CreatePostInput,
    CreatePostOutput,
)


class CreatePostController:
    def __init__(self, uc: CreatePostUseCase):
        self.uc = uc

    def execute(
        self, input_data: CreatePostInput
    ) -> Dict[str, Union[int, CreatePostOutput, Dict[str, str]]]:
        try:
            output, err = self.uc.execute(input_data)
            if err:
                return {"status": 400, "data": {"error": str(err)}}
            return {"status": 201, "data": output}
        except Exception:
            return {"status": 500, "data": {"error": "An unexpected error occurred"}}

from typing import Dict, Union
from usecase.update_post import (
    UpdatePostUseCase,
    UpdatePostInput,
    UpdatePostOutput,
)


class UpdatePostController:
    def __init__(self, uc: UpdatePostUseCase):
        self.uc = uc

    def execute(
        self, input_data: UpdatePostInput
    ) -> Dict[str, Union[int, UpdatePostOutput, Dict[str, str]]]:
        try:
            output, err = self.uc.execute(input_data)
            if err:
                return {"status": 400, "data": {"error": str(err)}}
            return {"status": 200, "data": output}
        except Exception:
            return {"status": 500, "data": {"error": "An unexpected error occurred"}}

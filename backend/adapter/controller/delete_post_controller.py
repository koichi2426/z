from typing import Dict, Union
from usecase.delete_post import (
    DeletePostUseCase,
    DeletePostInput,
    DeletePostOutput,
)


class DeletePostController:
    def __init__(self, uc: DeletePostUseCase):
        self.uc = uc

    def execute(
        self, input_data: DeletePostInput
    ) -> Dict[str, Union[int, DeletePostOutput, Dict[str, str]]]:
        try:
            output, err = self.uc.execute(input_data)
            if err:
                return {"status": 404, "data": {"error": str(err)}}
            return {"status": 200, "data": output}
        except Exception:
            return {"status": 500, "data": {"error": "An unexpected error occurred"}}

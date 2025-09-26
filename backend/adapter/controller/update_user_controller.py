from typing import Dict, Union
from usecase.update_user import (
    UpdateUserUseCase,
    UpdateUserInput,
    UpdateUserOutput,
)


class UpdateUserController:
    def __init__(self, uc: UpdateUserUseCase):
        self.uc = uc

    def execute(
        self, input_data: UpdateUserInput
    ) -> Dict[str, Union[int, UpdateUserOutput, Dict[str, str]]]:
        try:
            output, err = self.uc.execute(input_data)
            if err:
                return {"status": 400, "data": {"error": str(err)}}
            return {"status": 200, "data": output}
        except Exception:
            return {"status": 500, "data": {"error": "An unexpected error occurred"}}

from typing import Dict, Union
from usecase.delete_user import (
    DeleteUserUseCase,
    DeleteUserInput,
    DeleteUserOutput,
)


class DeleteUserController:
    def __init__(self, uc: DeleteUserUseCase):
        self.uc = uc

    def execute(
        self, input_data: DeleteUserInput
    ) -> Dict[str, Union[int, DeleteUserOutput, Dict[str, str]]]:
        try:
            output, err = self.uc.execute(input_data)
            if err:
                return {"status": 404, "data": {"error": str(err)}}
            return {"status": 200, "data": output}
        except Exception:
            return {"status": 500, "data": {"error": "An unexpected error occurred"}}

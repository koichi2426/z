from typing import Dict, Union
from usecase.delete_all_users import (
    DeleteAllUsersUseCase,
    DeleteAllUsersOutput,
)


class DeleteAllUsersController:
    def __init__(self, uc: DeleteAllUsersUseCase):
        self.uc = uc

    def execute(self) -> Dict[str, Union[int, DeleteAllUsersOutput, Dict[str, str]]]:
        try:
            output, err = self.uc.execute()
            if err:
                return {"status": 500, "data": {"error": str(err)}}
            return {"status": 200, "data": output}
        except Exception:
            return {"status": 500, "data": {"error": "An unexpected error occurred"}}

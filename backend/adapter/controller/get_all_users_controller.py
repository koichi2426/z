from typing import Dict, Union
from usecase.get_all_users import (
    GetAllUsersUseCase,
    GetAllUsersOutput,
)


class GetAllUsersController:
    def __init__(self, uc: GetAllUsersUseCase):
        self.uc = uc

    def execute(self) -> Dict[str, Union[int, GetAllUsersOutput, Dict[str, str]]]:
        try:
            output, err = self.uc.execute()
            if err:
                return {"status": 500, "data": {"error": str(err)}}
            return {"status": 200, "data": output}
        except Exception:
            return {"status": 500, "data": {"error": "An unexpected error occurred"}}

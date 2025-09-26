from typing import Dict, Union
from usecase.logout_user import (
    LogoutUserUseCase,
    LogoutUserInput,
    LogoutUserOutput,
)


class LogoutUserController:
    def __init__(self, uc: LogoutUserUseCase):
        self.uc = uc

    def execute(
        self, input_data: LogoutUserInput
    ) -> Dict[str, Union[int, LogoutUserOutput, Dict[str, str]]]:
        try:
            output, err = self.uc.execute(input_data)
            if err:
                return {"status": 400, "data": {"error": str(err)}}
            return {"status": 200, "data": output}
        except Exception:
            return {"status": 500, "data": {"error": "An unexpected error occurred"}}

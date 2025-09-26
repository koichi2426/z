from typing import Dict, Union
from usecase.login_user import (
    LoginUserUseCase,
    LoginUserInput,
    LoginUserOutput,
)


class LoginUserController:
    def __init__(self, uc: LoginUserUseCase):
        self.uc = uc

    def execute(
        self, input_data: LoginUserInput
    ) -> Dict[str, Union[int, LoginUserOutput, Dict[str, str]]]:
        try:
            output, err = self.uc.execute(input_data)
            if err:
                return {"status": 401, "data": {"error": str(err)}}
            return {"status": 200, "data": output}
        except Exception:
            return {"status": 500, "data": {"error": "An unexpected error occurred"}}

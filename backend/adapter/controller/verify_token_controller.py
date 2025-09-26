from typing import Dict, Union
from usecase.verify_token import (
    VerifyTokenUseCase,
    VerifyTokenInput,
    VerifyTokenOutput,
)


class VerifyTokenController:
    def __init__(self, uc: VerifyTokenUseCase):
        self.uc = uc

    def execute(
        self, input_data: VerifyTokenInput
    ) -> Dict[str, Union[int, VerifyTokenOutput, Dict[str, str]]]:
        try:
            output, err = self.uc.execute(input_data)
            if err:
                return {"status": 401, "data": {"error": str(err)}}
            return {"status": 200, "data": output}
        except Exception:
            return {"status": 500, "data": {"error": "An unexpected error occurred"}}

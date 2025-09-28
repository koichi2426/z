from typing import Dict, Union
from usecase.get_posts_by_username import (
    GetPostsByUsernameUseCase,
    GetPostsByUsernameInput,
    GetPostsByUsernameOutput,
)


class GetPostsByUsernameController:
    def __init__(self, uc: GetPostsByUsernameUseCase):
        self.uc = uc

    def execute(
        self, input_data: GetPostsByUsernameInput
    ) -> Dict[str, Union[int, GetPostsByUsernameOutput, Dict[str, str]]]:
        try:
            output, err = self.uc.execute(input_data)
            if err:
                return {"status": 404, "data": {"error": str(err)}}
            return {"status": 200, "data": output}
        except Exception:
            return {"status": 500, "data": {"error": "An unexpected error occurred"}}

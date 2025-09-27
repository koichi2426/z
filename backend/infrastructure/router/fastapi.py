import json
from fastapi import APIRouter
from fastapi.responses import JSONResponse, Response
from pydantic import BaseModel
from typing import Dict

# --- Controller imports ---
from adapter.controller.login_user_controller import LoginUserController
from adapter.controller.verify_token_controller import VerifyTokenController
from adapter.controller.logout_user_controller import LogoutUserController

from adapter.controller.get_all_users_controller import GetAllUsersController
from adapter.controller.create_user_controller import CreateUserController
from adapter.controller.update_user_controller import UpdateUserController
from adapter.controller.delete_user_controller import DeleteUserController
from adapter.controller.delete_all_users_controller import DeleteAllUsersController

from adapter.controller.get_all_posts_controller import GetAllPostsController
from adapter.controller.get_posts_by_user_controller import GetPostsByUserController
from adapter.controller.create_post_controller import CreatePostController
from adapter.controller.update_post_controller import UpdatePostController
from adapter.controller.delete_post_controller import DeletePostController
from adapter.controller.delete_all_posts_controller import DeleteAllPostsController

# --- Presenter imports ---
from adapter.presenter.login_user_presenter import new_login_user_presenter
from adapter.presenter.verify_token_presenter import new_verify_token_presenter
from adapter.presenter.logout_user_presenter import new_logout_user_presenter

from adapter.presenter.get_all_users_presenter import new_get_all_users_presenter
from adapter.presenter.create_user_presenter import new_create_user_presenter
from adapter.presenter.update_user_presenter import new_update_user_presenter
from adapter.presenter.delete_user_presenter import new_delete_user_presenter
from adapter.presenter.delete_all_users_presenter import new_delete_all_users_presenter

from adapter.presenter.get_all_posts_presenter import new_get_all_posts_presenter
from adapter.presenter.get_posts_by_user_presenter import new_get_posts_by_user_presenter
from adapter.presenter.create_post_presenter import new_create_post_presenter
from adapter.presenter.update_post_presenter import new_update_post_presenter
from adapter.presenter.delete_post_presenter import new_delete_post_presenter
from adapter.presenter.delete_all_posts_presenter import new_delete_all_posts_presenter

# --- Repository imports ---
from adapter.repository.user_mysql import UserMySQL
from adapter.repository.post_mysql import PostMySQL
from infrastructure.database.mysql_handler import MySQLHandler
from infrastructure.database.config import NewMySQLConfigFromEnv

# --- Usecase imports ---
from usecase.login_user import LoginUserInput, new_login_user_interactor
from usecase.verify_token import VerifyTokenInput, new_verify_token_interactor
from usecase.logout_user import LogoutUserInput, new_logout_user_interactor

from usecase.get_all_users import new_get_all_users_interactor
from usecase.create_user import CreateUserInput, new_create_user_interactor
from usecase.update_user import UpdateUserInput, new_update_user_interactor
from usecase.delete_user import DeleteUserInput, new_delete_user_interactor
from usecase.delete_all_users import new_delete_all_users_interactor

from usecase.get_all_posts import new_get_all_posts_interactor
from usecase.get_posts_by_user import GetPostsByUserInput, new_get_posts_by_user_interactor
from usecase.create_post import CreatePostInput, new_create_post_interactor
from usecase.update_post import UpdatePostInput, new_update_post_interactor
from usecase.delete_post import DeletePostInput, new_delete_post_interactor
from usecase.delete_all_posts import new_delete_all_posts_interactor

# --- Domain service (Auth) ---
from infrastructure.domain.auth_domain_service_impl import AuthDomainServiceImpl


# === Router Setup ===
router = APIRouter()
db_handler = MySQLHandler(NewMySQLConfigFromEnv())
ctx_timeout = 10.0

# --- Helper: 共通レスポンス処理 ---
def handle_response(response_dict: Dict, success_code: int = 200):
    status_code = response_dict.get("status", 500)
    data = response_dict.get("data")

    if status_code >= 400:
        return JSONResponse(content=data, status_code=status_code)

    if success_code == 204:
        return Response(status_code=204)

    try:
        content_str = json.dumps(data, default=str)
        content_data = json.loads(content_str)
    except TypeError:
        content_data = {"error": "Failed to serialize response data"}
        status_code = 500

    return JSONResponse(content=content_data, status_code=success_code if status_code < 400 else status_code)


# === Request DTOs ===
class LoginRequest(BaseModel):
    email: str
    password: str

class CreateUserRequest(BaseModel):
    username: str
    name: str
    email: str
    avatar_url: str
    password: str

class UpdateUserRequest(BaseModel):
    id: int
    username: str
    name: str
    email: str
    avatar_url: str
    password: str

class CreatePostRequest(BaseModel):
    user_id: int
    content: str

class UpdatePostRequest(BaseModel):
    id: int
    user_id: int
    content: str


# === Auth Routes ===
@router.post("/v1/auth/login")
def login_user(request: LoginRequest):
    presenter = new_login_user_presenter()
    user_repo = UserMySQL(db_handler)
    domain_service = AuthDomainServiceImpl(user_repo)
    usecase = new_login_user_interactor(presenter, domain_service, ctx_timeout)
    controller = LoginUserController(usecase)
    input_data = LoginUserInput(email=request.email, password=request.password)
    response_dict = controller.execute(input_data)
    return handle_response(response_dict)


@router.post("/v1/auth/verify")
def verify_token(token: str):
    presenter = new_verify_token_presenter()
    user_repo = UserMySQL(db_handler)
    domain_service = AuthDomainServiceImpl(user_repo)
    usecase = new_verify_token_interactor(presenter, domain_service, ctx_timeout)
    controller = VerifyTokenController(usecase)
    input_data = VerifyTokenInput(token=token)
    response_dict = controller.execute(input_data)
    return handle_response(response_dict)


@router.post("/v1/auth/logout")
def logout_user(token: str):
    presenter = new_logout_user_presenter()
    user_repo = UserMySQL(db_handler)
    domain_service = AuthDomainServiceImpl(user_repo)
    usecase = new_logout_user_interactor(presenter, domain_service, ctx_timeout)
    controller = LogoutUserController(usecase)
    input_data = LogoutUserInput(token=token)
    response_dict = controller.execute(input_data)
    return handle_response(response_dict, success_code=204)


# === User Routes ===
@router.get("/v1/users")
def get_all_users():
    repo = UserMySQL(db_handler)
    presenter = new_get_all_users_presenter()
    usecase = new_get_all_users_interactor(presenter, repo, ctx_timeout)
    controller = GetAllUsersController(usecase)
    response_dict = controller.execute()
    return handle_response(response_dict)


@router.post("/v1/users")
def create_user(request: CreateUserRequest):
    repo = UserMySQL(db_handler)
    presenter = new_create_user_presenter()
    usecase = new_create_user_interactor(presenter, repo, ctx_timeout)
    controller = CreateUserController(usecase)
    input_data = CreateUserInput(**request.dict())
    response_dict = controller.execute(input_data)
    return handle_response(response_dict, success_code=201)


@router.put("/v1/users")
def update_user(request: UpdateUserRequest):
    repo = UserMySQL(db_handler)
    presenter = new_update_user_presenter()
    usecase = new_update_user_interactor(presenter, repo, ctx_timeout)
    controller = UpdateUserController(usecase)
    input_data = UpdateUserInput(**request.dict())
    response_dict = controller.execute(input_data)
    return handle_response(response_dict)


@router.delete("/v1/users/{user_id}")
def delete_user(user_id: int):
    repo = UserMySQL(db_handler)
    presenter = new_delete_user_presenter()
    usecase = new_delete_user_interactor(presenter, repo, ctx_timeout)
    controller = DeleteUserController(usecase)
    input_data = DeleteUserInput(user_id=user_id)
    response_dict = controller.execute(input_data)
    return handle_response(response_dict, success_code=204)


@router.delete("/v1/users")
def delete_all_users():
    repo = UserMySQL(db_handler)
    presenter = new_delete_all_users_presenter()
    usecase = new_delete_all_users_interactor(presenter, repo, ctx_timeout)
    controller = DeleteAllUsersController(usecase)
    response_dict = controller.execute()
    return handle_response(response_dict, success_code=204)


# === Post Routes ===
@router.get("/v1/posts")
def get_all_posts():
    post_repo = PostMySQL(db_handler)
    user_repo = UserMySQL(db_handler)
    presenter = new_get_all_posts_presenter()
    usecase = new_get_all_posts_interactor(presenter, post_repo, user_repo, ctx_timeout)
    controller = GetAllPostsController(usecase)
    response_dict = controller.execute()
    return handle_response(response_dict)


@router.get("/v1/posts/user/{user_id}")
def get_posts_by_user(user_id: int):
    post_repo = PostMySQL(db_handler)
    user_repo = UserMySQL(db_handler)
    presenter = new_get_posts_by_user_presenter()
    usecase = new_get_posts_by_user_interactor(presenter, post_repo, user_repo, ctx_timeout)
    controller = GetPostsByUserController(usecase)
    input_data = GetPostsByUserInput(user_id=user_id)
    response_dict = controller.execute(input_data)
    return handle_response(response_dict)


@router.post("/v1/posts")
def create_post(request: CreatePostRequest):
    repo = PostMySQL(db_handler)
    presenter = new_create_post_presenter()
    usecase = new_create_post_interactor(presenter, repo, ctx_timeout)
    controller = CreatePostController(usecase)
    input_data = CreatePostInput(user_id=request.user_id, content=request.content)
    response_dict = controller.execute(input_data)
    return handle_response(response_dict, success_code=201)


@router.put("/v1/posts")
def update_post(request: UpdatePostRequest):
    repo = PostMySQL(db_handler)
    presenter = new_update_post_presenter()
    usecase = new_update_post_interactor(presenter, repo, ctx_timeout)
    controller = UpdatePostController(usecase)
    input_data = UpdatePostInput(**request.dict())
    response_dict = controller.execute(input_data)
    return handle_response(response_dict)


@router.delete("/v1/posts/{post_id}")
def delete_post(post_id: int):
    repo = PostMySQL(db_handler)
    presenter = new_delete_post_presenter()
    usecase = new_delete_post_interactor(presenter, repo, ctx_timeout)
    controller = DeletePostController(usecase)
    input_data = DeletePostInput(post_id=post_id)
    response_dict = controller.execute(input_data)
    return handle_response(response_dict, success_code=204)


@router.delete("/v1/posts")
def delete_all_posts():
    repo = PostMySQL(db_handler)
    presenter = new_delete_all_posts_presenter()
    usecase = new_delete_all_posts_interactor(presenter, repo, ctx_timeout)
    controller = DeleteAllPostsController(usecase)
    response_dict = controller.execute()
    return handle_response(response_dict, success_code=204)


# === Health check ===
@router.get("/v1/health")
def healthcheck():
    return {"status": "ok"}

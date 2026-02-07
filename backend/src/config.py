from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    database_url: str = "postgresql://postgres:postgres@localhost:5432/todo_app_db"
    secret_key: str = "your-super-secret-key-here-make-it-long-and-random"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    better_auth_secret: str = "your-better-auth-secret"
    better_auth_url: str = "http://localhost:8000"

    class Config:
        env_file = ".env"


settings = Settings()
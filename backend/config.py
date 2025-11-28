from functools import lru_cache
from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    openai_api_key: str = Field("", env="OPENAI_API_KEY")
    jwt_secret_key: str = Field("change-me", env="JWT_SECRET_KEY")
    jwt_algorithm: str = Field("HS256", env="JWT_ALGORITHM")
    access_token_expire_minutes: int = Field(60, env="ACCESS_TOKEN_EXPIRE_MINUTES")
    database_url: str = Field("sqlite:///./radiomed.db", env="DATABASE_URL")
    upload_dir: str = Field("./uploads", env="UPLOAD_DIR")
    frontend_origin: str = Field("http://localhost:3000", env="FRONTEND_ORIGIN")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> Settings:
    return Settings()

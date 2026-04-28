from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    allowed_origins: str = "http://localhost:3000"

    @property
    def origins(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]

    @property
    def sqlalchemy_database_url(self) -> str:
        return self.database_url.replace("postgresql://", "postgresql+psycopg://", 1)

    class Config:
        env_file = ".env"


settings = Settings()

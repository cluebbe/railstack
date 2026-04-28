from datetime import datetime

from pydantic import BaseModel


class NoteCreate(BaseModel):
    title: str
    body: str = ""


class NoteUpdate(BaseModel):
    title: str | None = None
    body: str | None = None


class NoteOut(BaseModel):
    id: int
    title: str
    body: str
    created_at: datetime

    model_config = {"from_attributes": True}

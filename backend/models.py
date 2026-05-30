from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    stage: str = Field(pattern="^(todo|inprogress|done)$")

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    stage: Optional[str] = Field(None, pattern="^(todo|inprogress|done)$")

class TaskResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    description: Optional[str]
    stage: str
    created_at: datetime
    updated_at: datetime

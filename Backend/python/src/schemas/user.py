from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from enum import Enum
from typing import List, Optional

class RoleName(str, Enum):
    admin = "admin"
    vendedor = "vendedor"
    consultor = "consultor"

class Token(BaseModel):
    access_token: str
    token_type: str
    role: RoleName
    username: str  # Nuevo campo
    email: str     # Nuevo campo

class TokenData(BaseModel):
    id: Optional[str] = None
    role: Optional[RoleName] = None

class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    full_name: Optional[str] = Field(None, min_length=3, max_length=100)

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    role: RoleName

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = Field(None, min_length=3, max_length=100)
    password: Optional[str] = Field(None, min_length=8)

class User(UserBase):
    id: str
    is_active: bool
    role: RoleName
    created_at: datetime

    class Config:
        from_attributes = True

class UserInDB(User):
    hashed_password: str

class UserLogin(BaseModel):
    username: str = Field(..., min_length=3)
    password: str = Field(..., min_length=8)



class UserBasic(BaseModel):
    id: str
    username: str
    email: EmailStr
    role: RoleName
    is_active: bool
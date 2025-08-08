from bson import ObjectId
import bcrypt
from datetime import datetime
from schemas.user import User, UserCreate, UserInDB, UserUpdate, RoleName
from models.user import get_user_collection
from fastapi import HTTPException, status
from typing import List

def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_user(user: UserCreate) -> UserInDB:
    user_collection = get_user_collection()
    
    if user_collection.find_one({"$or": [{"username": user.username}, {"email": user.email}]}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )
    
    if user.role == RoleName.admin and user_collection.find_one({"role": "admin"}):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin user already exists"
        )
    
    hashed_password = get_password_hash(user.password)
    user_dict = user.model_dump(exclude={"password"})
    user_dict.update({
        "hashed_password": hashed_password,
        "is_active": True,
        "created_at": datetime.utcnow()
    })
    
    result = user_collection.insert_one(user_dict)
    created_user = user_collection.find_one({"_id": result.inserted_id})
    return UserInDB(**created_user)

def get_user(user_id: str) -> User:
    user_collection = get_user_collection()
    try:
        user = user_collection.find_one({"_id": ObjectId(user_id)})
        if user:
            return User(**user)
    except:
        pass
    return None

def get_user_by_username(username: str) -> UserInDB:
    user_collection = get_user_collection()
    user = user_collection.find_one({"username": username})
    if user:
        return UserInDB(**user)
    return None

def authenticate_user(username: str, password: str) -> UserInDB:
    user = get_user_by_username(username)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

def update_user(user_id: str, user: UserUpdate) -> User:
    user_collection = get_user_collection()
    update_data = user.model_dump(exclude_unset=True)
    
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
    
    user_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_data}
    )
    
    updated_user = user_collection.find_one({"_id": ObjectId(user_id)})
    return User(**updated_user)


# Agregar esta función
def get_users(skip: int = 0, limit: int = 100) -> List[User]:
    user_collection = get_user_collection()
    users = user_collection.find().skip(skip).limit(limit)
    return [User(**user) for user in users]
from pymongo.collection import Collection
from database import get_db

db = get_db()

def get_user_collection() -> Collection:
    return db["users"]

def create_indexes():
    user_collection = get_user_collection()
    user_collection.create_index("username", unique=True)
    user_collection.create_index("email", unique=True)
    user_collection.create_index("role")
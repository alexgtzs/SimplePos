from pymongo.collection import Collection
from database import get_db

db = get_db()

def get_role_collection() -> Collection:
    return db["roles"]
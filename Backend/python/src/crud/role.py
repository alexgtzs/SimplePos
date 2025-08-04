from bson import ObjectId
from models.role import get_role_collection
from schemas.role import Role, RoleCreate

def create_role(role: RoleCreate) -> Role:
    role_collection = get_role_collection()
    role_dict = role.model_dump()
    result = role_collection.insert_one(role_dict)
    created_role = role_collection.find_one({"_id": result.inserted_id})
    return Role(**created_role)

def get_role(role_id: str) -> Role:
    role_collection = get_role_collection()
    role = role_collection.find_one({"_id": ObjectId(role_id)})
    if role:
        return Role(**role)
    return None

def get_roles(skip: int = 0, limit: int = 100) -> list[Role]:
    role_collection = get_role_collection()
    roles = role_collection.find().skip(skip).limit(limit)
    return [Role(**role) for role in roles]

def update_role(role_id: str, role: RoleCreate) -> Role:
    role_collection = get_role_collection()
    role_dict = role.model_dump()
    role_collection.update_one(
        {"_id": ObjectId(role_id)},
        {"$set": role_dict}
    )
    updated_role = role_collection.find_one({"_id": ObjectId(role_id)})
    return Role(**updated_role)

def delete_role(role_id: str) -> bool:
    role_collection = get_role_collection()
    result = role_collection.delete_one({"_id": ObjectId(role_id)})
    return result.deleted_count > 0
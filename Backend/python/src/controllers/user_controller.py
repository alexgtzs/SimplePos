from flask import request, jsonify
from bson import ObjectId
from models.user import User
from database import db

def create_user():
    data = request.get_json()
    
    # Verificar si el rol existe
    if not db.roles.find_one({'_id': ObjectId(data['role_id'])}):
        return jsonify({'message': 'Role not found'}), 404
    
    # Verificar si el usuario ya existe
    if db.users.find_one({'username': data['username']}):
        return jsonify({'message': 'Username already exists'}), 400
    
    user = User.from_dict(data)
    result = db.users.insert_one(user.to_dict())
    
    return jsonify({
        'message': 'User created successfully',
        'user_id': str(result.inserted_id)
    }), 201

def get_users():
    users = list(db.users.find({'active': True}))
    for user in users:
        user['_id'] = str(user['_id'])
        user['role_id'] = str(user['role_id'])
    return jsonify(users), 200

def get_user(user_id):
    user = db.users.find_one({'_id': ObjectId(user_id)})
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    user['_id'] = str(user['_id'])
    user['role_id'] = str(user['role_id'])
    return jsonify(user), 200

def update_user(user_id):
    data = request.get_json()
    
    if 'role_id' in data:
        if not db.roles.find_one({'_id': ObjectId(data['role_id'])}):
            return jsonify({'message': 'Role not found'}), 404
    
    result = db.users.update_one(
        {'_id': ObjectId(user_id)},
        {'$set': data}
    )
    
    if result.modified_count == 0:
        return jsonify({'message': 'No changes made'}), 200
    
    return jsonify({'message': 'User updated successfully'}), 200

def delete_user(user_id):
    result = db.users.update_one(
        {'_id': ObjectId(user_id)},
        {'$set': {'active': False}}
    )
    
    if result.modified_count == 0:
        return jsonify({'message': 'User not found'}), 404
    
    return jsonify({'message': 'User deactivated successfully'}), 200
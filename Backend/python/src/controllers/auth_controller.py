from flask import request, jsonify
from database import mongo
from utils.security import generate_token, check_password
from bson.objectid import ObjectId

def login():
    data = request.get_json()
    
    # Validar datos de entrada
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Username and password required'}), 400
    
    # Buscar usuario en la base de datos
    user = mongo.db.users.find_one({'username': data['username']})
    if not user:
        return jsonify({'message': 'Invalid credentials'}), 401
    
    # Verificar contraseña
    if not check_password(user['password'], data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401
    
    # Verificar si el usuario está activo
    if not user.get('active', True):
        return jsonify({'message': 'User account is inactive'}), 403
    
    # Obtener permisos del rol
    role = mongo.db.roles.find_one({'_id': ObjectId(user['role_id'])})
    if not role:
        return jsonify({'message': 'User role not found'}), 500
    
    # Generar token JWT
    token = generate_token(
        user_id=str(user['_id']),
        role_id=str(user['role_id']),
        permissions=role.get('permissions', [])
    )
    
    return jsonify({
        'token': token,
        'user_id': str(user['_id']),
        'role': role['name'],
        'permissions': role.get('permissions', [])
    }), 200
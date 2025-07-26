from functools import wraps
from flask import request, jsonify
from utils.security import verify_token
from database import mongo

def token_required(f):
    """
    Decorador para rutas que requieren autenticación
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Obtener el token del header 'Authorization'
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        # Verificar el token
        payload = verify_token(token)
        if not payload:
            return jsonify({'message': 'Token is invalid or expired!'}), 401
        
        # Agregar información del usuario al contexto
        request.user_id = payload['sub']
        request.role_id = payload['role']
        request.permissions = payload.get('permissions', [])
        
        return f(*args, **kwargs)
    return decorated

def permission_required(permission):
    """
    Decorador para rutas que requieren un permiso específico
    """
    def decorator(f):
        @wraps(f)
        @token_required
        def decorated(*args, **kwargs):
            if permission not in request.permissions:
                return jsonify({'message': 'Permission denied!'}), 403
            return f(*args, **kwargs)
        return decorated
    return decorator
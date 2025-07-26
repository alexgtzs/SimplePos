import jwt
from datetime import datetime, timedelta
from flask import current_app
from werkzeug.security import check_password_hash, generate_password_hash

def generate_token(user_id, role_id, permissions):
    """
    Genera un token JWT con el ID de usuario, rol y permisos
    """
    payload = {
        'exp': datetime.utcnow() + timedelta(days=1),
        'iat': datetime.utcnow(),
        'sub': user_id,
        'role': role_id,
        'permissions': permissions
    }
    return jwt.encode(
        payload,
        current_app.config['SECRET_KEY'],
        algorithm='HS256'
    )

def verify_token(token):
    """
    Verifica y decodifica un token JWT
    """
    try:
        payload = jwt.decode(
            token,
            current_app.config['SECRET_KEY'],
            algorithms=['HS256']
        )
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def hash_password(password):
    """
    Genera un hash seguro de la contraseña
    """
    return generate_password_hash(password)

def check_password(hashed_password, password):
    """
    Verifica si la contraseña coincide con el hash
    """
    return check_password_hash(hashed_password, password)
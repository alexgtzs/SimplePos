from bson import ObjectId
from werkzeug.security import generate_password_hash

class User:
    def __init__(self, username, email, password, role_id, active=True):
        self.username = username
        self.email = email
        self.password = generate_password_hash(password)
        self.role_id = role_id
        self.active = active
    
    @staticmethod
    def from_dict(data):
        return User(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            role_id=data['role_id'],
            active=data.get('active', True)
        )
    
    def to_dict(self):
        return {
            'username': self.username,
            'email': self.email,
            'password': self.password,
            'role_id': self.role_id,
            'active': self.active
        }
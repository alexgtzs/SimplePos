from bson import ObjectId

class Role:
    def __init__(self, name, permissions):
        self.name = name
        self.permissions = permissions
    
    @staticmethod
    def from_dict(data):
        return Role(
            name=data['name'],
            permissions=data['permissions']
        )
    
    def to_dict(self):
        return {
            'name': self.name,
            'permissions': self.permissions
        }
from flask_pymongo import PyMongo
from pymongo import MongoClient
from bson.objectid import ObjectId

mongo = PyMongo()

def init_db(app):
    mongo.init_app(app)
    
    # Opcional: Insertar roles iniciales si no existen
    if mongo.db.roles.count_documents({}) == 0:
        initial_roles = [
            {
                "name": "administrator",
                "permissions": ["manage_users", "view_reports", "manage_sales"]
            },
            {
                "name": "seller",
                "permissions": ["manage_sales"]
            },
            {
                "name": "consultant",
                "permissions": ["view_reports"]
            }
        ]
        mongo.db.roles.insert_many(initial_roles)
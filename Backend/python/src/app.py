from flask import Flask
from middlewares.auth import token_required, permission_required
from controllers.auth_controller import login
from controllers.user_controller import create_user, get_users, get_user, update_user, delete_user
from database import init_db
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-very-secret-key-123')

# Inicializar la base de datos
init_db(app)

# Rutas públicas
app.add_url_rule('/login', 'login', login, methods=['POST'])

# Rutas protegidas
app.add_url_rule('/users', 'create_user', create_user, methods=['POST'])
app.add_url_rule('/users', 'get_users', get_users, methods=['GET'])
app.add_url_rule('/users/<user_id>', 'get_user', get_user, methods=['GET'])
app.add_url_rule('/users/<user_id>', 'update_user', update_user, methods=['PUT'])
app.add_url_rule('/users/<user_id>', 'delete_user', delete_user, methods=['DELETE'])

# Ejemplo de ruta con permisos
@app.route('/admin/dashboard')
@token_required
@permission_required('manage_users')
def admin_dashboard():
    return jsonify({'message': 'Welcome to admin dashboard'})

if __name__ == '__main__':
    app.run(debug=True)
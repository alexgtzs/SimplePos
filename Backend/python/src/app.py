from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Annotated
import os
from dotenv import load_dotenv
import uvicorn

from schemas.user import User, UserCreate, UserInDB, UserUpdate, Token, TokenData, RoleName
from crud.user import (
    create_user,
    get_user,
    get_user_by_username,
    authenticate_user,
    update_user
)
from models.user import create_indexes

load_dotenv()

# Configuración
PORT = 8000
SECRET_KEY = os.getenv("SECRET_KEY", "secret-key-para-desarrollo")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manejador del ciclo de vida de la aplicación"""
    create_indexes()
    try:
        admin_user = UserCreate(
            username="admin",
            email="admin@system.com",
            full_name="Administrador Principal",
            password=os.getenv("ADMIN_PASSWORD", "Admin123!"),
            role=RoleName.admin
        )
        create_user(admin_user)
        print("[INFO] Usuario administrador creado/verificado")
    except HTTPException as e:
        if e.detail != "Admin user already exists":
            print(f"[ERROR] Creando admin: {e.detail}")
    yield

app = FastAPI(
    title="Sistema de Autenticación con Roles",
    description="API para manejo de usuarios con roles: admin, vendedor, consultor",
    lifespan=lifespan
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        role: str = payload.get("role")
        if user_id is None or role is None:
            raise credentials_exception
        token_data = TokenData(id=user_id, role=role)
    except JWTError:
        raise credentials_exception
    
    user = get_user(token_data.id)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)]
):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

def require_role(required_role: RoleName):
    def role_checker(current_user: User = Depends(get_current_active_user)):
        if current_user.role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Requires {required_role.value} role"
            )
        return current_user
    return role_checker

@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role},
        expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role
    }

@app.get("/users/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user

@app.post("/users/", response_model=User)
def create_new_user(
    user: UserCreate,
    current_user: User = Depends(require_role(RoleName.admin))
):
    return create_user(user)

@app.put("/users/{user_id}", response_model=User)
def update_existing_user(
    user_id: str,
    user: UserUpdate,
    current_user: User = Depends(require_role(RoleName.admin))
):
    db_user = get_user(user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return update_user(user_id, user)

# Endpoints específicos por rol
@app.get("/vendedor/dashboard")
def vendedor_dashboard(current_user: User = Depends(require_role(RoleName.vendedor))):
    return {
        "message": "Dashboard del Vendedor",
        "user": current_user.username,
        "role": current_user.role
    }

@app.get("/consultor/reports")
def consultor_reports(current_user: User = Depends(require_role(RoleName.consultor))):
    return {
        "message": "Reportes para Consultor",
        "user": current_user.username,
        "role": current_user.role
    }

def print_startup_message():
    print(f"\n{'='*50}")
    print(f"[INFO] Servidor FastAPI escuchando en puerto {PORT}")
    print(f"[INFO] Usuario admin: admin / {os.getenv('ADMIN_PASSWORD', 'Admin123!')}")
    print(f"[INFO] Documentación: http://localhost:{PORT}/docs")
    print(f"{'='*50}\n")

if __name__ == "__main__":
    print_startup_message()
    uvicorn.run(app, host="0.0.0.0", port=PORT)
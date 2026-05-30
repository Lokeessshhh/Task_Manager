from fastapi import APIRouter, Depends, HTTPException, status
from models import UserCreate, UserLogin, Token
from auth import get_password_hash, verify_password, create_access_token
from database import database
import asyncpg
from datetime import timedelta
from config import get_settings

router = APIRouter(prefix="/auth", tags=["auth"])
settings = get_settings()

@router.post("/register", response_model=Token)
async def register(user: UserCreate):
    hashed_password = get_password_hash(user.password)
    query = "INSERT INTO users (email, password_hash) VALUES (:email, :password_hash) RETURNING id, email"
    try:
        new_user = await database.execute(query=query, values={"email": user.email, "password_hash": hashed_password})
    except asyncpg.exceptions.UniqueViolationError:
        raise HTTPException(status_code=400, detail="Email already registered")
    except Exception as e:
        # Fallback for databases exception wrapping
        if "unique" in str(e).lower():
             raise HTTPException(status_code=400, detail="Email already registered")
        raise HTTPException(status_code=500, detail="Internal server error")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    query = "SELECT id, email, password_hash FROM users WHERE email = :email"
    db_user = await database.fetch_one(query=query, values={"email": user.email})
    
    if not db_user or not verify_password(user.password, db_user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

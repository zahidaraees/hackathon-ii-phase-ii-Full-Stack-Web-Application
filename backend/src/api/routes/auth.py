from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from sqlmodel import Session
from typing import Optional
import secrets

from ..db import get_session
from ..models.user import UserCreate, UserRead
from ..services.auth_service import AuthService
from ..utils.auth import get_current_user
from ..utils.errors import AppException, ErrorCode


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserRead)
def register_user(
    user_create: UserCreate,
    session: Session = Depends(get_session)
):
    """Register a new user."""
    try:
        user = AuthService.create_user(
            session=session,
            user_create=user_create
        )
        return user
    except AppException:
        raise
    except Exception as e:
        raise AppException(ErrorCode.INTERNAL_ERROR, detail=str(e))


@router.post("/login")
def login_user(
    request: Request,
    credentials: HTTPBasicCredentials = Depends(HTTPBasic()),
    session: Session = Depends(get_session)
):
    """Login a user and return an access token."""
    user = AuthService.authenticate_user(
        session=session,
        email=credentials.username,
        password=credentials.password
    )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    
    access_token = AuthService.create_access_token_for_user(user)
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserRead)
def read_users_me(current_user_id: str = Depends(get_current_user)):
    """Get the current user's information."""
    # In a real implementation, we would fetch the user from the database
    # For now, we'll return a minimal representation
    return {"id": current_user_id, "email": "placeholder@example.com", "created_at": "2023-01-01T00:00:00", "updated_at": "2023-01-01T00:00:00"}
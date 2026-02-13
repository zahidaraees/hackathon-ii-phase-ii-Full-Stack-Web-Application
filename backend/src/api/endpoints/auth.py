from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import Dict, Any

from ...database.session import get_session
from ...models.user import UserCreate, UserRead
from ...services.user_service import UserService
from ...auth.utils import create_access_token, create_refresh_token
from ...api.utils import create_success_response, handle_validation_error
from ...middleware.auth import require_authentication

router = APIRouter()

@router.post("/register", response_model=dict)
def register_user(
    user_create: UserCreate,
    session: Session = Depends(get_session)
):
    """
    Register a new user account.
    """
    user_service = UserService(session)
    
    try:
        user = user_service.create_user(user_create)
        
        # Create access and refresh tokens
        access_token = create_access_token(data={"sub": user.email})
        refresh_token = create_refresh_token(data={"sub": user.email})
        
        # Return user data and tokens
        return create_success_response(
            data={
                "user": UserRead.from_orm(user) if hasattr(UserRead, 'from_orm') else UserRead(**user.dict()),
                "token": access_token,
                "refresh_token": refresh_token
            },
            message="User registered successfully"
        )
    except Exception as e:
        # Handle validation errors (like duplicate email)
        handle_validation_error(str(e))


from pydantic import BaseModel

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login", response_model=dict)
def login_user(
    login_request: LoginRequest,
    session: Session = Depends(get_session)
):
    """
    Authenticate user and return JWT token.
    """
    user_service = UserService(session)
    
    # Authenticate the user
    user = user_service.authenticate_user(login_request.email, login_request.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create access and refresh tokens
    access_token = create_access_token(data={"sub": user.email})
    refresh_token = create_refresh_token(data={"sub": user.email})
    
    return create_success_response(
        data={
            "user": UserRead.from_orm(user) if hasattr(UserRead, 'from_orm') else UserRead(**user.dict()),
            "token": access_token,
            "refresh_token": refresh_token
        },
        message="Login successful"
    )


@router.post("/logout", response_model=dict)
def logout_user(
    current_user: str = Depends(require_authentication)
):
    """
    Logout user and invalidate session.
    """
    # In a real application, you might want to add the token to a blacklist
    # or perform other cleanup tasks here
    
    return create_success_response(message="Successfully logged out")
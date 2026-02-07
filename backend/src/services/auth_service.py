from sqlmodel import Session, select
from typing import Optional
from datetime import timedelta

from .models.user import User, UserCreate
from .utils.auth import get_password_hash, verify_password, create_access_token
from .utils.errors import AppException, ErrorCode


class AuthService:
    """Service class for handling authentication-related operations."""
    
    @staticmethod
    def authenticate_user(session: Session, email: str, password: str) -> Optional[User]:
        """Authenticate a user by email and password."""
        statement = select(User).where(User.email == email)
        user = session.exec(statement).first()
        
        if not user or not verify_password(password, user.password_hash):
            return None
        
        return user
    
    @staticmethod
    def create_user(session: Session, user_create: UserCreate) -> User:
        """Create a new user with hashed password."""
        # Check if user already exists
        statement = select(User).where(User.email == user_create.email)
        existing_user = session.exec(statement).first()
        
        if existing_user:
            raise AppException(
                ErrorCode.VALIDATION_ERROR,
                detail="A user with this email already exists"
            )
        
        # Hash the password
        hashed_password = get_password_hash(user_create.password)
        
        # Create the user
        user = User(
            email=user_create.email,
            password_hash=hashed_password
        )
        
        session.add(user)
        session.commit()
        session.refresh(user)
        
        return user
    
    @staticmethod
    def create_access_token_for_user(user: User) -> str:
        """Create an access token for a user."""
        access_token_expires = timedelta(minutes=30)  # Use value from settings
        access_token = create_access_token(
            data={"sub": str(user.id), "email": user.email},
            expires_delta=access_token_expires
        )
        return access_token
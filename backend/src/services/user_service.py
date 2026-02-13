from sqlmodel import Session, select
from typing import Optional
from ..models.user import User, UserCreate, UserUpdate
from ..auth.utils import get_password_hash, verify_password
from ..api.utils import handle_not_found, handle_validation_error

class UserService:
    def __init__(self, session: Session):
        self.session = session

    def create_user(self, user_create: UserCreate) -> User:
        """
        Create a new user with a hashed password
        """
        # Check if user with email already exists
        existing_user = self.get_user_by_email(user_create.email)
        if existing_user:
            handle_validation_error("A user with this email already exists")
        
        # Hash the password
        hashed_password = get_password_hash(user_create.password)
        
        # Create the user object
        user = User(
            email=user_create.email,
            name=user_create.name,
            hashed_password=hashed_password
        )
        
        # Add to session and commit
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        
        return user

    def get_user_by_id(self, user_id: str) -> Optional[User]:
        """
        Retrieve a user by their ID
        """
        user = self.session.get(User, user_id)
        return user

    def get_user_by_email(self, email: str) -> Optional[User]:
        """
        Retrieve a user by their email
        """
        statement = select(User).where(User.email == email)
        user = self.session.exec(statement).first()
        return user

    def update_user(self, user_id: str, user_update: UserUpdate) -> Optional[User]:
        """
        Update a user's information
        """
        user = self.get_user_by_id(user_id)
        if not user:
            return None
        
        # Update user fields
        update_data = user_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)
        
        # Update the updated_at timestamp
        user.updated_at = user.updated_at.__class__.now()
        
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        
        return user

    def delete_user(self, user_id: str) -> bool:
        """
        Delete a user by their ID
        """
        user = self.get_user_by_id(user_id)
        if not user:
            return False
        
        self.session.delete(user)
        self.session.commit()
        return True

    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """
        Authenticate a user by email and password
        """
        user = self.get_user_by_email(email)
        if not user or not verify_password(password, user.hashed_password):
            return None
        return user
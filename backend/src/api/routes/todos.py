from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List

from ..db import get_session
from ..models.todo_item import TodoItem, TodoItemCreate, TodoItemRead, TodoItemUpdate
from ..models.user import UserRead
from ..services.todo_service import TodoService
from ..utils.auth import get_current_user
from ..utils.errors import AppException, ErrorCode


router = APIRouter(prefix="/todos", tags=["todos"])


@router.get("/", response_model=List[TodoItemRead])
def get_todos(
    skip: int = 0,
    limit: int = 100,
    session: Session = Depends(get_session),
    current_user_id: str = Depends(get_current_user)
):
    """Get all todos for the authenticated user."""
    todos = TodoService.get_todos_by_user_id(
        session=session,
        user_id=current_user_id,
        skip=skip,
        limit=limit
    )
    return todos


@router.post("/", response_model=TodoItemRead, status_code=status.HTTP_201_CREATED)
def create_todo(
    todo: TodoItemCreate,
    session: Session = Depends(get_session),
    current_user_id: str = Depends(get_current_user)
):
    """Create a new todo for the authenticated user."""
    created_todo = TodoService.create_todo(
        session=session,
        todo_create=todo,
        user_id=current_user_id
    )
    return created_todo


@router.put("/{todo_id}", response_model=TodoItemRead)
def update_todo(
    todo_id: str,
    todo_update: TodoItemUpdate,
    session: Session = Depends(get_session),
    current_user_id: str = Depends(get_current_user)
):
    """Update a specific todo for the authenticated user."""
    updated_todo = TodoService.update_todo(
        session=session,
        todo_id=todo_id,
        todo_update=todo_update,
        user_id=current_user_id
    )
    
    if not updated_todo:
        raise AppException(ErrorCode.RESOURCE_NOT_FOUND, detail="Todo item not found")
    
    return updated_todo


@router.patch("/{todo_id}/complete", response_model=TodoItemRead)
def toggle_todo_completion(
    todo_id: str,
    completed: bool,
    session: Session = Depends(get_session),
    current_user_id: str = Depends(get_current_user)
):
    """Toggle the completion status of a specific todo for the authenticated user."""
    todo = TodoService.toggle_todo_completion(
        session=session,
        todo_id=todo_id,
        user_id=current_user_id,
        completed=completed
    )
    
    if not todo:
        raise AppException(ErrorCode.RESOURCE_NOT_FOUND, detail="Todo item not found")
    
    return todo


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(
    todo_id: str,
    session: Session = Depends(get_session),
    current_user_id: str = Depends(get_current_user)
):
    """Delete a specific todo for the authenticated user."""
    deleted = TodoService.delete_todo(
        session=session,
        todo_id=todo_id,
        user_id=current_user_id
    )
    
    if not deleted:
        raise AppException(ErrorCode.RESOURCE_NOT_FOUND, detail="Todo item not found")
    
    return {"message": "Todo deleted successfully"}
from typing import Any, Dict, Optional
from fastapi import HTTPException, status

def create_success_response(data: Any = None, message: Optional[str] = None) -> Dict[str, Any]:
    """
    Create a standardized success response
    """
    response = {"success": True}
    
    if data is not None:
        response["data"] = data
    
    if message:
        response["message"] = message
    
    return response

def create_error_response(error_code: str, message: str, details: Optional[Dict] = None) -> Dict[str, Any]:
    """
    Create a standardized error response
    """
    response = {
        "success": False,
        "error": {
            "code": error_code,
            "message": message
        }
    }
    
    if details:
        response["error"]["details"] = details
    
    return response

def handle_not_found(item_type: str = "Resource"):
    """
    Raise a standardized not found exception
    """
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"{item_type} not found"
    )

def handle_unauthorized(message: str = "Unauthorized"):
    """
    Raise a standardized unauthorized exception
    """
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=message
    )

def handle_forbidden(message: str = "Forbidden"):
    """
    Raise a standardized forbidden exception
    """
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail=message
    )

def handle_validation_error(message: str = "Validation error"):
    """
    Raise a standardized validation error exception
    """
    raise HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail=message
    )
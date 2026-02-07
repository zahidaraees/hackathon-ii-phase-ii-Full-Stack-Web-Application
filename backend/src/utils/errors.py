import logging
from fastapi import HTTPException, status
from typing import Dict, Any
from enum import Enum


# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ErrorCode(str, Enum):
    """Enumeration of error codes for consistent error handling."""
    AUTHENTICATION_FAILED = "AUTHENTICATION_FAILED"
    AUTHORIZATION_FAILED = "AUTHORIZATION_FAILED"
    RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND"
    VALIDATION_ERROR = "VALIDATION_ERROR"
    DATABASE_ERROR = "DATABASE_ERROR"
    INTERNAL_ERROR = "INTERNAL_ERROR"


class AppException(HTTPException):
    """Custom application exception with error code."""
    
    def __init__(self, error_code: ErrorCode, detail: str = None, status_code: int = None):
        if status_code is None:
            status_code = self._get_default_status_code(error_code)
        
        super().__init__(
            status_code=status_code,
            detail={
                "error_code": error_code.value,
                "message": detail or self._get_default_message(error_code)
            }
        )
        self.error_code = error_code
    
    @staticmethod
    def _get_default_status_code(error_code: ErrorCode) -> int:
        """Map error codes to appropriate HTTP status codes."""
        status_map = {
            ErrorCode.AUTHENTICATION_FAILED: status.HTTP_401_UNAUTHORIZED,
            ErrorCode.AUTHORIZATION_FAILED: status.HTTP_403_FORBIDDEN,
            ErrorCode.RESOURCE_NOT_FOUND: status.HTTP_404_NOT_FOUND,
            ErrorCode.VALIDATION_ERROR: status.HTTP_422_UNPROCESSABLE_ENTITY,
            ErrorCode.DATABASE_ERROR: status.HTTP_500_INTERNAL_SERVER_ERROR,
            ErrorCode.INTERNAL_ERROR: status.HTTP_500_INTERNAL_SERVER_ERROR,
        }
        return status_map.get(error_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @staticmethod
    def _get_default_message(error_code: ErrorCode) -> str:
        """Provide default messages for error codes."""
        message_map = {
            ErrorCode.AUTHENTICATION_FAILED: "Authentication failed",
            ErrorCode.AUTHORIZATION_FAILED: "Authorization failed",
            ErrorCode.RESOURCE_NOT_FOUND: "Resource not found",
            ErrorCode.VALIDATION_ERROR: "Validation error",
            ErrorCode.DATABASE_ERROR: "Database error occurred",
            ErrorCode.INTERNAL_ERROR: "Internal server error occurred",
        }
        return message_map.get(error_code, "An unexpected error occurred")


def log_error(error: Exception, context: str = ""):
    """Log an error with context."""
    logger.error(f"Error in {context}: {str(error)}", exc_info=True)


def log_info(message: str, extra: Dict[str, Any] = None):
    """Log an informational message."""
    if extra:
        logger.info(f"{message} - Extra: {extra}")
    else:
        logger.info(message)


def log_warning(message: str, extra: Dict[str, Any] = None):
    """Log a warning message."""
    if extra:
        logger.warning(f"{message} - Extra: {extra}")
    else:
        logger.warning(message)
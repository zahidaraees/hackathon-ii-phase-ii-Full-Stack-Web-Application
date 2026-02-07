from fastapi import FastAPI
from .routes import todos, auth


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(title="Todo API", version="1.0.0")
    
    # Include API routes
    app.include_router(auth.router, prefix="/api")
    app.include_router(todos.router, prefix="/api")
    
    @app.get("/")
    def read_root():
        return {"message": "Welcome to the Todo API"}
    
    return app
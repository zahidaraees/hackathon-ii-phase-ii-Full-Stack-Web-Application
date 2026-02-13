from fastapi import FastAPI


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(title="Todo API", version="1.0.0")

    @app.get("/")
    def read_root():
        return {"message": "Welcome to the Todo API"}

    return app
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (agar psycopg2 ya cryptography use ho raha hai)
RUN apt-get update && apt-get install -y build-essential libpq-dev && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Expose Back4App default port
EXPOSE 8080

# Run FastAPI app (entry point is backend/src/api/__init__.py → create_app)
CMD ["uvicorn", "backend.src.api.__init__:create_app", "--host", "0.0.0.0", "--port", "8080"]

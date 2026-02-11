FROM python:3.13-slim

# Prevent interactive prompts during apt-get install
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies including git
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Run FastAPI app with Uvicorn
CMD ["uvicorn", "backend.src.api.__init__:create_app", "--host", "0.0.0.0", "--port", "8080"]

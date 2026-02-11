FROM python:3.11-slim

# Prevent interactive prompts during apt-get install
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "backend.src.api.__init__:create_app", "--host", "0.0.0.0", "--port", "8080"]

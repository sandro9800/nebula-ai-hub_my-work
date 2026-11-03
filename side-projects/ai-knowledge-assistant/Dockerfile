FROM python:3.11-slim

WORKDIR /app

# System dependencies (needed for sentence-transformers / numpy builds)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Application code
COPY kb.py app.py ./
COPY templates ./templates

# Uploads directory
RUN mkdir -p uploads

EXPOSE 5000

ENV PORT=5000
ENV OLLAMA_URL=http://host.docker.internal:11434/api/generate
ENV OLLAMA_MODEL=llama3.2

CMD ["python", "app.py"]

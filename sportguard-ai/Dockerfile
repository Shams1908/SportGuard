# Dockerfile for Google Cloud Run
FROM python:3.10-slim

WORKDIR /app

COPY backend/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ /app/

# Cloud Run requirement: fast api run on $PORT
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]

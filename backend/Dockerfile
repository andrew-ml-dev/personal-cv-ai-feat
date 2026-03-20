FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    # Consistent cache location used both at build time and at runtime
    FASTEMBED_CACHE_PATH=/root/.cache/fastembed

WORKDIR /app

RUN pip install --no-cache-dir --upgrade pip

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download the embedding model so the container starts immediately without
# a network call. This layer is cached by Docker and only re-runs when
# requirements.txt or EMBEDDING_MODEL changes.
ARG EMBEDDING_MODEL=BAAI/bge-small-en-v1.5
RUN python -c "from fastembed import TextEmbedding; list(TextEmbedding('${EMBEDDING_MODEL}').embed(['warmup']))"

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

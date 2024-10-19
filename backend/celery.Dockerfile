FROM python:3.12-slim
# Set the working directory
WORKDIR /app


RUN apk add --no-cache \
    curl \
    gcc \
    musl-dev \
    libffi-dev \
    openssl-dev \
    && curl -sSL https://install.python-poetry.org | python3 -

RUN pip install --upgrade pip && pip install mediapipe


ENV PATH="/root/.local/bin:$PATH"

COPY poetry.lock pyproject.toml ./

RUN poetry install --no-root

COPY . .

CMD ["poetry", "run", "celery", "-A", "quizme", "worker", "--loglevel=info", "--pool=solo"]

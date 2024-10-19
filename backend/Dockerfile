FROM python:3.12-alpine
# Set the working directory
WORKDIR /app


RUN apk add --no-cache \
    curl \
    gcc \
    musl-dev \
    libffi-dev \
    openssl-dev \
    && curl -sSL https://install.python-poetry.org | python3 -

ENV PATH="/root/.local/bin:$PATH"

COPY poetry.lock pyproject.toml ./

RUN poetry install --no-root

COPY . .

CMD ["poetry", "run", "manage.py", "runserver", "0.0.0.0:8000"]
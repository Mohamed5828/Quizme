FROM python:3.12-slim
# Set the working directory
WORKDIR /app
# Install necessary system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

#RUN curl -sSL https://install.python-poetry.org | python3 -
COPY requirements.txt .

RUN pip install --upgrade pip && pip install -r requirements.txt


#ENV PATH="/root/.local/bin:$PATH"
#
#COPY poetry.lock pyproject.toml ./
#
#RUN poetry install --no-root

COPY . .

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
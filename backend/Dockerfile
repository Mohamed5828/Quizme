FROM python:3.12-alpine
# Set the working directory
WORKDIR /app

RUN pip install -r requirements.txt

COPY . .

CMD ["poetry", "run", "manage.py", "runserver", "0.0.0.0:8000"]
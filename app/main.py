# from fastapi import FastAPI
# from app.api import routes

# app = FastAPI()

# app.include_router(routes.router)

# if __name__ == '__main__':
#     import uvicorn
#     uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)


import logging
from fastapi import FastAPI
from app.services.rabbitmq_consumer import RabbitMQConsumer
from app.api.routes import router

logging.basicConfig(level=logging.INFO)

app = FastAPI()

app.include_router(router)

# Starting the RabbitMQ consumer
def start_consumer():
    consumer = RabbitMQConsumer()
    consumer.consume()

if __name__ == "__main__":
    import threading
    consumer_thread = threading.Thread(target=start_consumer)
    consumer_thread.start()
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9000)

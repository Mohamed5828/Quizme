import pika
import logging
from app.config import RABBITMQ_URL, QUEUE_NAME, RESPONSE_QUEUE

class RabbitMQConnection:
    def __init__(self):
        self.connection = None
        self.channel = None
        self.connect()

    def connect(self):
        """Establish a connection to RabbitMQ."""
        params = pika.URLParameters(RABBITMQ_URL)
        self.connection = pika.BlockingConnection(params)
        self.channel = self.connection.channel()
        
        self.channel.queue_declare(queue=QUEUE_NAME)
        self.channel.queue_declare(queue=RESPONSE_QUEUE)
        
        logging.info(f"Connected to RabbitMQ. Listening on queue: {QUEUE_NAME}")

    def get_channel(self):
        """Return the RabbitMQ channel."""
        return self.channel

import json
import pika

url = 'amqps://aetjsbct:eoqiTO5EHxmdWIu8IEEo_gP5z1WYSGjG@hummingbird.rmq.cloudamqp.com/aetjsbct'
params = pika.URLParameters(url)

try:
    connection = pika.BlockingConnection(params)
    channel = connection.channel()

    channel.queue_declare(queue='code_execution')
    
except pika.exceptions.AMQPError as error:
    print(f"Error connecting to RabbitMQ: {error}")
    connection = None


def publish(message):
    if connection and connection.is_open:
        try:
                channel.basic_publish(exchange='', routing_key='code_execution', body=json.dumps(message))
                print("Message published successfully")
        except pika.exceptions.AMQPError as error:
                print(f"Error publishing message: {error}")
    else:
        print("Connection is not available or closed.")
    
    
    



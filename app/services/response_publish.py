import json
import logging

class ResponsePublisher:
    def __init__(self, channel):
        self.channel = channel

    def publish_result(self, result, original_message):
        """Publish the test case results to the response queue."""
        response_message = {
            'request_id': original_message.get('request_id'),
            'test_results': result
        }
        self.channel.basic_publish(
            exchange='',
            routing_key='response_queue',
            body=json.dumps(response_message)
        )
        logging.info(f"Published result to queue: response_queue")
import json
import logging
from .rabbitmq_connection import RabbitMQConnection
from .test_case_runner import TestCaseRunner
from .response_publish import ResponsePublisher

class RabbitMQConsumer:
    def __init__(self):
        self.connection = RabbitMQConnection()
        self.channel = self.connection.get_channel()
        self.test_case_runner = TestCaseRunner()
        self.response_publisher = ResponsePublisher(self.channel)
        self.consume()

    def callback(self, ch, method, body):
        """Callback function to process messages from RabbitMQ."""
        try:
            message = json.loads(body)
            language = message.get("language")
            code = message.get("code")
            test_cases = message.get("test_cases", [])

            if language and code:
                # Execute code for each test case
                test_results = self.test_case_runner.run_test_cases(language, code, test_cases)
                logging.info(f"Executed test cases. Results: {test_results}")

                # Publish the test results back to the response queue
                self.response_publisher.publish_result(test_results, message)
            else:
                error_msg = "Invalid message: missing 'language' or 'code'."
                logging.error(error_msg)
                self.response_publisher.publish_result({"error": error_msg}, message)

        except json.JSONDecodeError:
            logging.error("Failed to decode the message.")
        
        except Exception as e:
            logging.error(f"Unexpected error occurred: {e}")

    def consume(self):
        """Start consuming messages from RabbitMQ."""
        self.channel.basic_consume(queue='response_queue', on_message_callback=self.callback, auto_ack=True)
        logging.info("Waiting for messages. To exit press CTRL+C.")
        self.channel.start_consuming()

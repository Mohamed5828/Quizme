import json
import logging
from app.services.code_executor import CodeExecutor

class TestCaseRunner:
    def __init__(self):
        self.executor = CodeExecutor()

    def run_test_cases(self, language, code, test_cases):
        """Run the code for each test case and return the results."""
        results = []
        for test_case in test_cases:
            stdin = test_case.get('stdin', '')
            expected_output = test_case.get('expected_output', '').strip()

            # Execute the code for the current test case
            execution_result = self.executor.execute_code(language, code, stdin)
            actual_output = execution_result.get('stdout', '').strip()

            # Compare actual output with expected output
            result = {
                'input': stdin,
                'expected_output': expected_output,
                'actual_output': actual_output,
                'success': actual_output == expected_output
            }
            results.append(result)

        return results

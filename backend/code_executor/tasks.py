import requests
from celery import shared_task
from exam.models import Question
from attempts.models import Attempt
from answers.models import Answer
from django.db import transaction

PISTON_BASE_URL = "https://emkc.org/api/v2/piston"


def execute_code(language, code, version, stdin=""):
    """
    Executes code using Piston API with improved error handling and stdin processing.
    """
    if stdin and not stdin.endswith('\n'):
        stdin = stdin + '\n'
        
    payload = {
        "language": language,
        "files": [{"content": code.strip()}],  # Strip any extra whitespace
        "version": version,
        "stdin": stdin
    }
    
    try:
        response = requests.post(f"{PISTON_BASE_URL}/execute", json=payload)
        response.raise_for_status()
        result = response.json()
        
        # More detailed error checking
        if result.get("compile"):
            compile_stderr = result["compile"].get("stderr", "").strip()
            compile_stdout = result["compile"].get("stdout", "").strip()
            
            # Some languages might output to stdout during compilation
            if compile_stderr:
                return {
                    "error": "Compilation error",
                    "details": compile_stderr
                }
        
        run_result = result.get("run", {})
        run_stderr = run_result.get("stderr", "").strip()
        run_stdout = run_result.get("stdout", "").strip()
        
        # Check for runtime errors, but make sure it's actually an error
        # Some languages might use stderr for debug output
        if run_stderr and not run_stdout:
            return {
                "error": "Runtime error",
                "details": run_stderr
            }
        
        return {
            "output": run_stdout,
            "stderr": run_stderr,  # Include stderr even if there's stdout
            "execution_time": run_result.get("time", ""),
            "memory_usage": run_result.get("memory", ""),
            "compile_output": compile_stdout if 'compile' in result else "",
            "language": result.get("language", ""),
            "version": result.get("version", "")
        }
        
    except requests.RequestException as e:
        return {
            "error": "API request failed", 
            "details": str(e)
        }
    except Exception as e:
        return {
            "error": "Unexpected error",
            "details": str(e)
        }
@shared_task
def execute_code_async(language, code, version, stdin=""):
    """
    Async task for executing code using Piston API.
    """
    return execute_code(language, code, version, stdin)
def is_numeric(value):
    """Check if a value can be converted to float."""
    try:
        float(value)
        return True
    except (ValueError, TypeError):
        return False

def compare_values(actual, expected, precision=2):
    """
    Compare two values with specified decimal precision for numbers.
    For strings, performs exact comparison after stripping whitespace.
    """
    actual_str = str(actual).strip()
    expected_str = str(expected).strip()
    
    # Try numeric comparison first
    if is_numeric(actual_str) and is_numeric(expected_str):
        actual_num = float(actual_str)
        expected_num = float(expected_str)
        return (
            abs(actual_num - expected_num) < 10**(-precision),
            f"{actual_num:.{precision}f}",
            f"{expected_num:.{precision}f}"
        )
    
    # Fall back to string comparison
    return (
        actual_str == expected_str,
        actual_str,
        expected_str
    )

@shared_task
def evaluate_test_cases(language, run_code, test_cases, version, precision=2):
    results = []
    
    # First, try to compile the code
    compile_result = execute_code(language, run_code, version, "")
    if compile_result.get("error"):
        return {
            "success": False,
            "details": "Compilation error",
            "error": compile_result.get("details", "Unknown compilation error"),
            "results": []
        }

    for index, test in enumerate(test_cases):
        task_result = execute_code(language, run_code, version, test.get('input', ''))
        
        if task_result.get("error"):
            return {
                "success": False,
                "error": task_result.get("error", "Code execution error"),
                "details": task_result.get("details", "Unknown execution error"),
                "test_case": index + 1,
                "results": results
            }

        actual_output = task_result.get("output", "")
        expected_output = test.get('output', '')
        
        passed, formatted_actual, formatted_expected = compare_values(
            actual_output, 
            expected_output,
            precision
        )
        
        results.append({
            "test_case": index + 1,
            "passed": passed,
            "input": test.get('input', ''),
            "expected_output": formatted_expected,
            "actual_output": formatted_actual,
            "execution_time": task_result.get("execution_time")
        })

        if not passed:
            return {
                "success": False,
                "error": "Test case failed",
                "results": results,
                "language": task_result.get("language"),
                "version": task_result.get("version")
            }

    return {
        "success": True,
        "all_passed": True,
        "results": results,
        "language": task_result.get("language"),
        "version": task_result.get("version")
    }

@shared_task
def update_answer_and_attempt(evaluation_result, attempt_id, question_id, run_code):
    try:
        attempt = Attempt.objects.get(id=attempt_id)
        question = Question.objects.get(id=question_id)
        
        # Check if there was an error during evaluation
        if not evaluation_result.get("success", False):
            question_score = 0
            message = evaluation_result.get("error", "Evaluation failed")
            details = evaluation_result.get("details", "")
        else:
            all_passed = evaluation_result.get("all_passed", False)
            question_score = question.grade if all_passed else 0
            message = "All test cases passed" if all_passed else "Some test cases failed"
            details = ""

        # Prepare code data
        existing_answer = Answer.objects.filter(attempt_id=attempt, question_id=question).first()
        if existing_answer and existing_answer.code:
            code_data = existing_answer.code
            code_data['body'] = run_code
        else:
            code_data = {
                'body': run_code,
                'language': evaluation_result.get('language', 'any'),
                'version': evaluation_result.get('version', 'any')
            }

        # Update or create answer
        answer, created = Answer.objects.update_or_create(
            attempt_id=attempt,
            question_id=question,
            defaults={
                'code': code_data,
                'score': question_score
            }
        )

        return {
            "success": evaluation_result.get("success", False),
            "message": message,
            "details": details,
            "score": question_score,
            "max_score": question.grade,
            "results": evaluation_result.get("results", [])
        }

    except Exception as e:
        return {
            "success": False,
            "message": "Error processing results",
            "details": str(e)
        }
            # poetry run celery -A quizme worker --loglevel=info --pool=solo

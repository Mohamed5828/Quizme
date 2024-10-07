import requests
from celery import shared_task
from exam.models import Question
from attempts.models import Attempt
from answers.models import Answer
from django.db import transaction

PISTON_BASE_URL = "https://emkc.org/api/v2/piston"


def execute_code(language, code, version, stdin=""):
    """
    Executes code using Piston API and returns the response with detailed information.
    """
    payload = {
        "language": language,
        "files": [{"content": code}],
        "version": version,
        "stdin": stdin
    }
    try:
        response = requests.post(f"{PISTON_BASE_URL}/execute", json=payload)
        response.raise_for_status()
        result = response.json()
        
        # Check for compilation errors
        if result.get("compile", {}).get("stderr"):
            return {
                "error": "Compilation error",
                "details": result["compile"]["stderr"]
            }
        
        # Check for runtime errors
        if result.get("run", {}).get("stderr"):
            return {
                "error": "Runtime error",
                "details": result["run"]["stderr"]
            }
        
        return {
            "output": result.get("run", {}).get("stdout", ""),
            "stderr": result.get("run", {}).get("stderr", ""),
            "execution_time": result.get("run", {}).get("time", ""),
            "memory_usage": result.get("run", {}).get("memory", ""),
            "compile_output": result.get("compile", {}).get("stdout", ""),
            "language": result.get("language", ""),
            "version": result.get("version", "")
        }
    except requests.RequestException as e:
        return {"error": "API request failed", "details": str(e)}

@shared_task
def execute_code_async(language, code, version, stdin=""):
    """
    Async task for executing code using Piston API.
    """
    return execute_code(language, code, version, stdin)
@shared_task
def evaluate_test_cases(language, run_code, test_cases, version):
    results = []
    all_passed = True
    compile_error = None

    # First, try to compile the code (if the language requires compilation)
    compile_result = execute_code(language, run_code, version, "")
    if compile_result.get("error") or compile_result.get("stderr"):
        compile_error = compile_result.get("error") or compile_result.get("stderr")
        return {
            "error": "Compilation error",
            "details": compile_error
        }

    for index, test in enumerate(test_cases):
        task_result = execute_code(language, run_code, version, test.get('input', ''))
        
        if task_result.get("error"):
            return {
                "error": "Code execution error",
                "details": task_result["error"],
                "test_case": index + 1
            }
        
        if task_result.get("stderr"):
            return {
                "error": "Runtime error",
                "details": task_result["stderr"],
                "test_case": index + 1
            }

        actual_output = task_result.get("output", "").strip()
        expected_output = test.get('output', '').strip()
        passed = actual_output == expected_output

        # Add detailed debugging information
        results.append({
            "test_case": index + 1,
            "passed": passed,
            "input": test.get('input', ''),
            "expected_output": expected_output,
            "actual_output": actual_output,
            "execution_time": task_result.get("execution_time"),
            "debug_info": {
                "expected_length": len(expected_output),
                "actual_length": len(actual_output),
                "expected_repr": repr(expected_output),
                "actual_repr": repr(actual_output),
                "character_differences": [
                    (i, repr(expected_output[i]), repr(actual_output[i]))
                    for i in range(min(len(expected_output), len(actual_output)))
                    if expected_output[i] != actual_output[i]
                ] if len(expected_output) == len(actual_output) else []
            }
        })

        if not passed:
            all_passed = False
            break  # Stop on first failed test case

    return {
        "all_passed": all_passed,
        "results": results,
        "language": task_result.get("language"),
        "version": task_result.get("version")
    }
@shared_task
def update_answer_and_attempt(evaluation_result, attempt_id, question_id, run_code):
    attempt = Attempt.objects.get(id=attempt_id)
    question = Question.objects.get(id=question_id)
    
    all_passed = evaluation_result['all_passed']
    question_score = question.grade if all_passed else 0

    existing_answer = Answer.objects.filter(attempt_id=attempt, question_id=question).first()
    if existing_answer and existing_answer.code:
        # If there's existing code, update only the body
        code_data = existing_answer.code
        code_data['body'] = run_code
    else:
        # If no existing code, create new structure with defaults
        code_data = {
            'body': run_code,
            'language': 'any',  # You might want to make this dynamic
            'version': 'any'      # You might want to make this dynamic
        }
    answer, created = Answer.objects.update_or_create(
        attempt_id=attempt,
        question_id=question,
        defaults={
            'code': code_data,
            'score': question_score
        }
    )

    # Update the attempt's total score
    # attempt_answers = Answer.objects.filter(attempt_id=attempt)
    # attempt.score = sum(a.score or 0 for a in attempt_answers)
    # attempt.save()

    if all_passed:
        return {
            "message": "All test cases passed",
            "score": question_score,
            "max_score": question.grade,
        }
    else:
        return {
            "message": "Some test cases failed",
            "results": evaluation_result['results']
        }
        # poetry run celery -A quizme worker --loglevel=info --pool=solo

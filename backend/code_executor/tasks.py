import requests
from celery import shared_task

PISTON_BASE_URL = "https://emkc.org/api/v2/piston"

@shared_task
def get_languages():
    try:
        response = requests.get(f"{PISTON_BASE_URL}/runtimes")
        response.raise_for_status()
        runtimes = response.json()
        return [{"language": runtime['language'], "version": runtime['version']} for runtime in runtimes]
    except requests.RequestException as e:
        return {"error": f"Failed to fetch languages: {str(e)}"}

@shared_task
def execute_code_async(language, code, version , stdin=""):
    payload = {
        "language": language,
        "files": [{"content":code}],
        "version": version,
        "stdin": stdin
    }
    try:
        response = requests.post(f"{PISTON_BASE_URL}/execute", json=payload)
        response.raise_for_status()
        result = response.json()
        return {
            "output": result.get("run", {}).get("stdout", ""),
            "stderr": result.get("run", {}).get("stderr", ""),
            "execution_time": result.get("run", {}).get("cpu_time", ""),
            "compile_output": result.get("run", {}).get("output", ""),
            "language": result.get("language", ""),
            "version": result.get("version", "")
        }
    except requests.RequestException as e:
        return {"error": f"Failed to execute code: {str(e)}"}

        
        # poetry run celery -A quizme worker --loglevel=info --pool=solo